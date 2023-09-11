import { cesc } from "../../../src/_utils/url";

describe("Assignment Alert Queue Tests", function () {

  before(() => {
  });

  beforeEach(() => {
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("No Alert", () => {
    const userId = "cyuserId";
    const studentUserId = "cyStudentUserId";
    const courseId = "aaq_courseid1";
    const doenetML = `
<problem>
<p>1+1 = <answer name='ans1'>2</answer></p>
</problem>
    `

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.log('Assign a single page activity')
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get(".navigationRow").last().dblclick();
    cy.get(".cm-content").type(doenetML);
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get('.doenet-viewer').contains('Problem 1');

    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Assign Tab"]').click();
    cy.get('[data-test="Assign Button"]').eq(1).click();
    cy.log('alert queue should show message and then be dismissed');
    cy.get('[data-test="Alert Title"]').should('have.text', 'Activity is assigned.')
    cy.get('[data-test="Alert Close Button"]').click();
    cy.get('[data-test="Alert Title"]').should('not.exist');
    cy.get('[data-test="Close Settings Button"]').click();

    cy.log('sign in as student')
    cy.signin({ userId: studentUserId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").last().dblclick();
    cy.get('.mq-root-block').type('2{enter}')

    // cy.get('[data-test="Alert Title"]').contains("No credit awarded since the due date has passed.");
    // cy.get('[data-test="Alert Close Button"]').click();
    cy.get('[data-test="Alert Title"]').should('not.exist');
  });

  it("Due Date Alert", () => {
    const userId = "cyuserId";
    const studentUserId = "cyStudentUserId";
    const courseId = "aaq_courseid2";
    const doenetML = `
<problem>
<p>1+1 = <answer name='ans1'>2</answer></p>
</problem>
    `

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.log('Assign a single page activity')
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get(".navigationRow").last().dblclick();
    cy.get(".cm-content").type(doenetML);
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get('.doenet-viewer').contains('Problem 1');

    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Assign Tab"]').click();
    cy.get('[data-test="Assign Button"]').eq(1).click();
    cy.log('alert queue should show message and then be dismissed');
    cy.get('[data-test="Alert Title"]').should('have.text', 'Activity is assigned.')
    cy.get('[data-test="Alert Close Button"]').click();
    cy.get('[data-test="Alert Title"]').should('not.exist');

    cy.log('Set due date to a date in the past')
    cy.get('[data-test="due date"]').type('2023-09-01T04:56').blur();
    cy.get('[data-test="Alert Title"]').contains("Due date set.");
    cy.get('[data-test="Alert Close Button"]').click();
    cy.get('[data-test="Alert Title"]').should('not.exist');
    cy.get('[data-test="Close Settings Button"]').click();

    cy.log('sign in as student')
    cy.signin({ userId: studentUserId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").last().dblclick();
    cy.get('.mq-root-block').type('2{enter}')

    cy.get('[data-test="Alert Title"]').contains("No credit awarded since the due date has passed.");
    cy.get('[data-test="Alert Close Button"]').click();
    cy.get('[data-test="Alert Title"]').should('not.exist');

  });

  it("Due Date and Solution Shown Alert", () => {
    const userId = "cyuserId";
    const studentUserId = "cyStudentUserId";
    const courseId = "aaq_courseid2";
    const doenetML = `
<problem>
<p>1+1 = <answer name='ans1'>2</answer></p>
<solution>2</solution>
</problem>
    `

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.log('Assign a single page activity')
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get(".navigationRow").last().dblclick();
    cy.get(".cm-content").type(doenetML);
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get('.doenet-viewer').contains('Problem 1');


    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Assign Tab"]').click();
    cy.get('[data-test="Assign Button"]').eq(1).click();
    cy.log('alert queue should show message and then be dismissed');
    cy.get('[data-test="Alert Title"]').should('have.text', 'Activity is assigned.')
    cy.get('[data-test="Alert Close Button"]').click();
    cy.get('[data-test="Alert Title"]').should('not.exist');

    cy.log('Set due date to a date in the past')
    cy.get('[data-test="due date"]').type('2023-09-01T04:56').blur();
    cy.get('[data-test="Alert Title"]').contains("Due date set.");
    cy.get('[data-test="Alert Close Button"]').click();
    cy.get('[data-test="Alert Title"]').should('not.exist');
    cy.get('[data-test="Close Settings Button"]').click();

    cy.log('sign in as student')
    cy.signin({ userId: studentUserId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").last().dblclick();
    cy.get(cesc("#\\/_solution1_button")).click();

    cy.get('.mq-root-block').type('2{enter}')

    cy.get('[data-test="Alert Title"]').should('have.length', 2);

    cy.get(':nth-child(1) > [data-test="Alert Close Button"]').click({ force: true });
    cy.get('[data-test="Alert Title"]').should('have.length', 1);
    cy.get('[data-test="Alert Close Button"]').click({ force: true });

    cy.get('[data-test="Alert Title"]').should('not.exist');
  });

});