describe('Previous and Next Activty Button Tests', () => {
  const userId = 'cyuserId';
  const studentUserId = 'cyStudentUserId';
  //TODO: create these randomly or from server
  const courseId = '_cypressCourse';
  const section1DoenetId = '_section1';
  const activityOptions = [
    {
      parent: courseId,
      isAssigned: true,
      isMultiPage: false,
      settingOverrides: {},
    },
    {
      parent: courseId,
      isAssigned: true,
      isMultiPage: false,
      settingOverrides: {},
    },
    {
      parent: courseId,
      isAssigned: true,
      isMultiPage: false,
      settingOverrides: { proctorMakesAvailable: 1 },
    },
    {
      parent: courseId,
      isAssigned: false,
      isMultiPage: false,
      settingOverrides: {},
    },
    {
      parent: section1DoenetId,
      isAssigned: true,
      isMultiPage: false,
      settingOverrides: {},
    },
    {
      parent: section1DoenetId,
      isAssigned: false,
      isMultiPage: false,
      settingOverrides: {},
    },
    {
      parent: courseId,
      isAssigned: true,
      isMultiPage: true,
      settingOverrides: {},
    },
    {
      parent: courseId,
      isAssigned: true,
      isMultiPage: true,
      settingOverrides: {},
    },
  ];
  const activitySettings = {
    assignedDate: '2024-01-01 00:00:00',
    dueDate: '2025-12-31 00:00:00',
    timeLimit: 70,
    numberOfAttemptsAllowed: 10,
    attemptAggregation: 'l',
    totalPointsOrPercent: 10,
    gradeCategory: 'problem sets',
    itemWeights: [5],
    individualize: 0,
    showSolution: 0,
    showSolutionInGradebook: 0,
    showFeedback: 0,
    showHints: 0,
    showCorrectness: 0,
    showCreditAchievedMenu: 0,
    paginate: 0,
    showFinishButton: 1,
    proctorMakesAvailable: 0,
    autoSubmit: 0,
    pinnedAfterDate: '2024-01-01 00:00:00',
    pinnedUntilDate: '2025-12-31 00:00:00',
  };
  const genIdsInContnetOrder = [];

  before(() => {
    cy.signin({ userId });
    //TODO: remove once Ids are random
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId: studentUserId });
    cy.createCourse({ userId, courseId, studentUserId });
    // create activites, first two will be assigned,
    // third left alone, a seciton child, firth a multi page
    // cy.createSection({
    //   courseId,
    //   doenetId: section1DoenetId,
    //   parentDoenetId: courseId,
    // });
    for (let i in activityOptions) {
      let { isMultiPage, isAssigned, parent, settingOverrides } =
        activityOptions[i];
      const doenetId = `_doenetId${i}`;
      genIdsInContnetOrder[i] = { doenetId };
      if (isMultiPage) {
        cy.createMultipageActivity({
          courseId,
          doenetId,
          parentDoenetId: parent,
          pageDoenetId1: `_pageDoenetId${i}.1`,
          doenetML1: `${i}.1: <answer>${i}.1</answer>`,
          pageDoenetId2: `_pageDoenetId${i}.2`,
          doenetML2: `${i}.2: <answer>${i}.2</answer>`,
        });
        genIdsInContnetOrder[i]['firstPageId'] = `_pageDoenetId${i}.1`;
      } else {
        cy.createActivity({
          courseId,
          doenetId,
          parentDoenetId: parent,
          pageDoenetId: `_pageDoenetId${i}.1`,
          doenetML: `${i}: <answer>${i}</answer>`,
        });
        genIdsInContnetOrder[i]['firstPageId'] = `_pageDoenetId${i}.1`;
      }
      cy.updateActivitySettings({
        courseId,
        doenetId,
        //TODO: current date instead of hardcoded
        activitySettings: JSON.stringify({
          ...activitySettings,
          ...settingOverrides,
        }),
      });
      if (isAssigned) {
        cy.visit(
          `/course?tool=editor&doenetId=${doenetId}&pageId=${`_pageDoenetId${i}.1`}`,
        );
        cy.get('[data-test="AssignmentSettingsMenu Menu"]')
          .should('be.visible')
          .click();
        cy.get('[data-test="Assign Activity"]').should('be.enabled').click();
        cy.get('[data-test="Unassign Activity"]').should('be.enabled');
      }
    }
  });
  beforeEach(() => {
    cy.signin({ userId: studentUserId });
  });

  Cypress.on('uncaught:exception', () => {
    // Returning false here prevents Cypress from failing the test
    return false;
  });

  it('Next button goes to from first to second', () => {
    cy.visit(
      `/course?tool=assignment&doenetId=${genIdsInContnetOrder[0].doenetId}&pageId=${genIdsInContnetOrder[0].firstPageId}`,
    );
    cy.get('[data-test="Previous Activity Button"]').should('be.disabled');
    cy.get('[data-test="Next Activity Button"]').should('be.enabled').click();
    cy.url()
      .should('include', `doenetId=${genIdsInContnetOrder[1].doenetId}`)
      .should('contain', `pageId=${genIdsInContnetOrder[1].firstPageId}`);
  });

  it('Previous button goes to from second to first', () => {
    cy.visit(
      `/course?tool=assignment&doenetId=${genIdsInContnetOrder[1].doenetId}&pageId=${genIdsInContnetOrder[1].firstPageId}`,
    );
    cy.get('[data-test="Next Activity Button"]').should('be.enabled');
    cy.get('[data-test="Previous Activity Button"]')
      .should('be.enabled')
      .click();
    cy.url()
      .should('include', `doenetId=${genIdsInContnetOrder[0].doenetId}`)
      .should('contain', `pageId=${genIdsInContnetOrder[0].firstPageId}`);
  });

  it('Both button are disabled in proctored content', () => {
    const procIdx = activityOptions.findIndex(
      (options) => options?.settingOverrides?.proctorMakesAvailable === 1,
    );
    expect(procIdx).to.not.equal(-1);
    cy.visit(
      `/course?tool=assignment&doenetId=${genIdsInContnetOrder[procIdx].doenetId}&pageId=${genIdsInContnetOrder[procIdx].firstPageId}`,
    );
    cy.get('[data-test="Next Activity Button"]').should('be.disabled');
    cy.get('[data-test="Previous Activity Button"]').should('be.disabled');
  });

  it('Next button from first to last, skipping unassigned', () => {
    cy.visit(
      `/course?tool=assignment&doenetId=${genIdsInContnetOrder[0].doenetId}&pageId=${genIdsInContnetOrder[0].firstPageId}`,
    );
    cy.get('[data-test="Previous Activity Button"]').should('be.disabled');
    let i;
    for (i = 1; i < activityOptions.length; i++) {
      let options = activityOptions[i];

      if (
        !options.isAssigned ||
        options?.settingOverrides?.proctorMakesAvailable === 1
      ) {
        continue;
      }
      cy.get('[data-test="Next Activity Button"]').should('be.enabled').click();
      cy.url()
        .should('include', `doenetId=${genIdsInContnetOrder[i].doenetId}`)
        .should('contain', `pageId=${genIdsInContnetOrder[i].firstPageId}`);
      cy.get('[data-test="Previous Activity Button"]').should('be.enabled');
    }
    cy.get('[data-test="Next Activity Button"]').should('be.disabled');
  });

  it('Previous button goes to from last to first, skipping unassigned and proctored', () => {
    cy.visit(
      `/course?tool=assignment&doenetId=${genIdsInContnetOrder[activityOptions.length - 1].doenetId
      }&pageId=${genIdsInContnetOrder[activityOptions.length - 1].firstPageId}`,
    );
    cy.get('[data-test="Next Activity Button"]').should('be.disabled');
    let i;
    for (i = 2; i <= activityOptions.length; i++) {
      let options = activityOptions[activityOptions.length - i];
      if (
        !options.isAssigned ||
        options?.settingOverrides?.proctorMakesAvailable === 1
      )
        continue;
      cy.get('[data-test="Previous Activity Button"]')
        .should('be.enabled')
        .click();
      cy.url().should(
        'include',
        `doenetId=${genIdsInContnetOrder[activityOptions.length - i].doenetId}`,
      );
    }
    cy.get('[data-test="Previous Activity Button"]').should('be.disabled');
  });
});
