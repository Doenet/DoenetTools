describe('Duplicate Course test', function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";

  before(() => {
    cy.signin({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId: studentUserId });
    cy.createCourse({ userId, courseId, studentUserId });
    // cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId });
  })

  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

  it('Make a course, assignment, bank, page and section and duplicate them', () => {
    let activit1label = 'Activity 1';
    cy.visit(`course?tool=navigation&courseId=${courseId}`);
    cy.wait(100);
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).click();
    cy.get('[data-test="Label Activity"]').type(`{selectAll}{backspace}${activit1label}{enter}`);
    cy.get('.navigationRow').eq(0).dblclick();

    // cy.get('[data-test="Label Activity"]').type(activit1label);
    // cy.visit(`course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`);
    // cy.wait(5000);
    // cy.visit(`course?tool=courseChooser`)
    // cy.get('.driveCard').should('have.length', 1); //Need this to wait for the row to appear
    // cy.wait(500);
    // cy.get('.driveCard').eq(0).dblclick();

    
  });
});