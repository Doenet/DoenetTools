describe('Student Sign-In Test', function () {
    const userId = "cyuserId";
    // const studentUserId = "cyStudentUserId";
    const courseId = "courseid1";
    // const doenetId = "activity1id";
    // const pageDoenetId = "_page1id";
  
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
  
    
    it('Student can sign in after being added to a course', () => {
      const emailAddress = "scoobydoo@doenet.org";
      cy.get('[data-test="First"]').type("Scooby");
      cy.get('[data-test="Last"]').type("Doo");
      cy.get('[data-test="Email"]').type(emailAddress);
      cy.get('[data-test="Add User"]').click();
      cy.visit(`http://localhost/settings`)
      cy.get('[data-test="sign out button"]').click();
      cy.get('[data-test="homepage button"]').should('be.visible');
      cy.visit(`http://localhost/SignIn`)
      cy.get('[data-test="email input"]').type(emailAddress);
      cy.get('[data-test="sendEmailButton"]').click();
      cy.task('queryDb', `SELECT signInCode FROM user_device ORDER BY id DESC LIMIT 1`).then((result)=>{
        const code = result[0].signInCode;
        cy.get('[data-test="signinCodeInput"]').type(code);
        cy.get('[data-test="signInButton"]').click();
        cy.get('[data-test="Nav to course"]').should('be.visible');
      });
    
    })

})