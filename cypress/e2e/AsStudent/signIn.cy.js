describe('Student Sign-In Test', function () {
    const userId = "cyuserId";
    // const studentUserId = "cyStudentUserId";
    const courseId = "courseid1";
    const doenetId = "activity1id";
    const pageDoenetId = "_page1id";
  
    before(()=>{
      cy.signin({ userId });
      cy.clearAllOfAUsersCoursesAndItems({ userId });
    //   cy.clearAllOfAUsersCoursesAndItems({ userId: studentUserId });
      cy.createCourse({ userId, courseId });
    })
    beforeEach(() => {
      cy.signin({ userId });
      cy.clearIndexedDB();
      cy.clearAllOfAUsersActivities({ userId });
    //   cy.clearAllOfAUsersActivities({ userId: studentUserId });
    //   cy.createActivity({ courseId, doenetId, parentDoenetId:courseId, pageDoenetId });
      cy.visit(`http://localhost/course?tool=people&courseId=${courseId}`);
    })
  
  
    Cypress.on('uncaught:exception', (err, runnable) => {
      // Returning false here prevents Cypress from failing the test
      return false;
    })
  
    
    it('Student can sign in afeter being added to a course', () => {
        cy.get(':nth-child(1) > .sc-hOGkXu').type("Scooby");
        cy.get(':nth-child(2) > .sc-hOGkXu').type("Doo");
        cy.get('.sc-jUosCB > :nth-child(4) > .sc-hOGkXu').type("scoobydoo@gmail.com");
        cy.get('.sc-jQrDum > .sc-cTAqQK > .sc-iAKWXU').click();
    
    
    })

})