describe("Student Sign-In Test", function () {
  const userId = "cyuserId";
  const courseId = "courseid1";


  Cypress.on("uncaught:exception", (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    return false;
  });

  it("Student can sign in after being added to a course", () => {
    cy.createCourse({ userId, courseId });
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId });
    cy.visit(`/course?tool=people&courseId=${courseId}`);

    const emailAddress = "scoobydoo@doenet.org";
    cy.get('[data-test="First"]').type("Scooby");
    cy.get('[data-test="Last"]').type("Doo");
    cy.get('[data-test="Email"]').type(emailAddress);
    cy.get('[data-test="Add User"]').click();
    cy.visit(`/settings`);
    cy.get('[data-test="sign out button"]').click();
    cy.get('[data-test="homepage button"]').should("be.visible");
    cy.visit(`/SignIn`);
    cy.get('[data-test="email input"]').type(emailAddress);
    cy.get('[data-test="sendEmailButton"]').click();
    cy.task(
      "queryDb",
      `SELECT signInCode FROM user_device ORDER BY id DESC LIMIT 1`,
    ).then((result) => {
      const code = result[0].signInCode;
      // cy.get('[data-test="signinCodeInput"]').type(code);
      cy.get('[data-test="code-input-0"]').type(code.charAt(0));
      cy.get('[data-test="code-input-1"]').type(code.charAt(1));
      cy.get('[data-test="code-input-2"]').type(code.charAt(2));
      cy.get('[data-test="code-input-3"]').type(code.charAt(3));
      cy.get('[data-test="code-input-4"]').type(code.charAt(4));
      cy.get('[data-test="code-input-5"]').type(code.charAt(5));
      cy.get('[data-test="code-input-6"]').type(code.charAt(6));
      cy.get('[data-test="code-input-7"]').type(code.charAt(7));
      cy.get('[data-test="code-input-8"]').type(code.charAt(8));
      cy.get('[data-test="submitCodeButton"]').click();
      cy.get('[data-test="My Courses"]').click();
      cy.get('[data-test="Course Label"]').should(
        "have.text",
        "Cypress Generated",
      );
      cy.get('[data-test="Card Image Link"]').click();
      cy.document().should("contain.text", "Welcome");
    });
  });

  it("Signed out to in to out with all entry errors", () => {
    const emailAddress = "scrapydoo@doenet.org";
    const firstName = "Scrapy";
    const lastName = "Doo";
    //Delete entry so we will need to enter the name
    cy.task(
      "queryDb",
      `DELETE FROM user WHERE email='${emailAddress}'`,
    ).then(() => {
      cy.visit(`/`);
      cy.get('[data-test="Nav to signin"]').click();
      cy.get('[data-test="email input"]').type(emailAddress);
      cy.get('[data-test="sendEmailButton"]').click();
      cy.wait(500); //Wait for it to be stored in db
      cy.task(
        "queryDb",
        `SELECT signInCode FROM user_device ORDER BY id DESC LIMIT 1`,
      ).then((result) => {
        const code = result[0].signInCode;
        //Try no code
        cy.get('[data-test="submitCodeButton"]').click();
        cy.get('[data-test="code-err"]').should('contain', "Please enter the nine digits sent to your email.");
        //Try only one number
        cy.get('[data-test="code-input-0"]').type(code.charAt(0));
        cy.get('[data-test="submitCodeButton"]').click();
        cy.get('[data-test="code-err"]').should('contain', "Please enter all nine digits.");

        cy.get('[data-test="code-input-0"]').type(code.charAt(0));
        cy.get('[data-test="code-input-1"]').type(code.charAt(1));
        cy.get('[data-test="code-input-2"]').type(code.charAt(2));
        cy.get('[data-test="code-input-3"]').type(code.charAt(3));
        cy.get('[data-test="code-input-4"]').type(code.charAt(4));
        cy.get('[data-test="code-input-5"]').type(code.charAt(5));
        cy.get('[data-test="code-input-6"]').type(code.charAt(6));
        cy.get('[data-test="code-input-7"]').type(code.charAt(7));
        cy.get('[data-test="code-input-8"]').type(code.charAt(8));
        cy.get('[data-test="submitCodeButton"]').click();
        //Try no names
        cy.get('[data-test="submitName"]').click();
        cy.get('[data-test="firstNameError"]').should('contain', 'Please enter your first name.')
        cy.get('[data-test="lastNameError"]').should('contain', 'Please enter your last name.')

        cy.get('[data-test="firstNameInput"]').type(firstName);
        cy.get('[data-test="lastNameInput"]').type(lastName);
        cy.get('[data-test="submitName"]').click();
        cy.get('[data-test="AvatarMenuButton"]').click();
        cy.get('[data-test="AvatarMenuSignOut"]').click();
        cy.get('[data-test="homepage button"]').click();
      });
    });
  });
});
