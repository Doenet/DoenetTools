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
  })

  it('Make a course, assignment, bank, page and section and duplicate them', () => {
    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId });
    // cy.visit(`course?tool=editor%doenetId=${doenetId}&pageId=${pageDoenetId}`);
    cy.visit(`course?tool=courseChooser`)
    cy.get('.driveCard').should('have.length', 1); //Need this to wait for the row to appear
    // cy.wait(500)
    // cy.get('.driveCard').eq(0).click();
  });
});