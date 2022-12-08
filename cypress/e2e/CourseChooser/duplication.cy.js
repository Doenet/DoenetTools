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

  it('Make a course with one assignment and test the duplicate is the same', () => {
    const activity1label = 'Activity 1';
    const activity1DoenetML = 'This is Activity 1';

    cy.visit(`course?tool=navigation&courseId=${courseId}`);
    cy.wait(1000);
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).click();
    cy.get('[data-test="Label Activity"]').type(`{selectAll}{backspace}${activity1label}{enter}`);
    cy.get('.navigationRow').eq(0).dblclick();
    cy.get('.cm-content').type(activity1DoenetML);
    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();

    
    //TODO: wait on new data time component
    // cy.get('[data-test="Assigned Date Checkbox"]').click()
    // cy.get('[data-test="Assigned Date"]').click()
    // cy.get('.rdtSwitch').eq(0).click({force: true})
    // cy.get('.rdtSwitch').eq(0).click({force: true})
    // cy.get('[data-value="2024"]').click({force: true})
    // cy.get('[data-value="0"]').click({force: true})
    // cy.get('[data-value="15"]').click({force: true})
    // cy.get('[data-test="Main Panel"]').click(); //Blur date entry
    // cy.wait(1000);

    // cy.get('[data-test="Due Date Checkbox"]').click()

    // cy.get('[data-test="Due Date"]').click()
    // cy.get('.rdtSwitch').eq(0).click({force: true})
    // cy.get('.rdtSwitch').eq(0).click({force: true})
    // cy.get('[data-value="2025"]').click({force: true})
    // cy.get('[data-value="2"]').click({force: true})
    // cy.get('[data-value="18"]').click({force: true}) 
    // cy.get('[data-test="Main Panel"]').click(); //Blur date entry
    // cy.wait(1000);
    cy.wait(1000);
    cy.visit(`course?tool=courseChooser`)
    cy.get('.driveCard').should('have.length', 1); //Need this to wait for the row to appear
    cy.wait(500);
    cy.get('.driveCard').eq(0).click();
    cy.get('[data-test="Duplicate Course Button"]').click();
    cy.get('[data-test="New Course Label Textfield"]').type("New Copy");
    cy.get('[data-test="Duplication Start Date"').type('01/01/2000');
    cy.get('[data-test="New Course Label Textfield"]').click(); //Blur date entry
    cy.get('[data-test="Duplication End Date"').type('01/01/2001');
    cy.get('[data-test="New Course Label Textfield"]').click(); //Blur date entry
    
    cy.get('[data-test="Duplicate Action"]').click();
    cy.get('.driveCard').should('have.length', 2); //Need this to wait for the row to appear
    cy.get('.driveCard').eq(0).dblclick();
    
    cy.get('[data-test="Dashboard Content Card"]').click();
    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).contains(activity1label)
    cy.get('.navigationRow').eq(0).dblclick();
    cy.get('.cm-content').contains(activity1DoenetML);

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Unassign Activity"]').should('be.visible');
  });

  // it.skip('Make a course with a linked page and test the duplicate is the same', () => {
  // });

});


// cy.get('[data-test="Label Activity"]').type(activity1label);
    // cy.visit(`course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`);
    // cy.wait(5000);
    // cy.visit(`course?tool=courseChooser`)
    // cy.get('.driveCard').should('have.length', 1); //Need this to wait for the row to appear
    // cy.wait(500);
    // cy.get('.driveCard').eq(0).dblclick();