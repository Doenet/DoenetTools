describe('Assigned Activity Test', function () {
    const userId = "cyuserId";
    const studentUserId = "cyStudentUserId";
    // const userId = "devuserId";
    const courseId = "courseid1";
    const doenetId = "activity1id";
    const pageDoenetId = "_page1id";
    // const doenetId2 = "activity2id";
    // const pageDoenetId2 = "_page2id";
  
    before(()=>{
      // cy.clearAllOfAUsersActivities({userId})
      cy.signin({ userId });
      cy.clearAllOfAUsersCoursesAndItems({ userId });
      cy.clearAllOfAUsersCoursesAndItems({ userId: studentUserId });
      cy.createCourse({ userId, courseId, studentUserId });
    })
    beforeEach(() => {
      cy.signin({ userId });
      cy.clearIndexedDB();
      cy.clearAllOfAUsersActivities({ userId })
      cy.clearAllOfAUsersActivities({ userId: studentUserId })
      cy.createActivity({ courseId, doenetId, parentDoenetId:courseId, pageDoenetId });
      // cy.createActivity({courseId,doenetId:doenetId2,parentDoenetId:courseId,pageDoenetId:pageDoenetId2});
      cy.visit(`http://localhost/course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`)
    })
  
  
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
  })

  it('Activity contains assigned date and due date in Content page',()=>{
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    function formatDate(date) {
      // Formatting the date
      const yyyy = date.getFullYear();
      let mm = date.getMonth() + 1; // Months start at 0!
      let dd = date.getDate();
      if (mm < 10) mm = '0' + mm;
      if (dd < 10) dd = '0' + dd;

      return mm + '/' + dd + '/' + yyyy;
    }

    // Formatting the time
    let hr = today.getHours();
    let min = today.getMinutes();
    const ampm = hr >= 12 ? 'PM' : 'AM';
    hr = hr % 12;
    hr = hr ? hr : 12; // Hour '0' should be '12
    min = min < 10 ? '0' + min : min;

    const formattedTime = hr + ':' + min + ' ' + ampm;


    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assigned Date Checkbox"]').click();
    cy.get('[data-test="Due Date Checkbox"]').click();
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="Assigned Date"]').should('have.text', formatDate(today) + ' ' + formattedTime);
    cy.get('[data-test="Due Date"]').should('have.text', formatDate(nextWeek) + ' ' + formattedTime);


    cy.get('[data-test="Crumb2"]').click();


    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').contains('Untitled Activity');
  
  
  })

})