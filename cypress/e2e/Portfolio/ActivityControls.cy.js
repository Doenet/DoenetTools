describe("Activity Controls Tests", function () {
  const userId = "cyuserId";
  const userId2 = "cyuserId2";

  before(() => {
    cy.signin({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId: userId2 });
  });
  beforeEach(() => {
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId });
    cy.clearAllOfAUsersActivities({ userId: userId2 });
    cy.visit(`/`);
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("Update Label of an Activity twice", () => {
    const label1 = "Scooby Doo";
    const label2 = "Duck Tails";
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Add Activity"]').click();
    cy.get('[data-test="Activity Label"]').clear().type(label1);
    // cy.get('[data-test="Close Settings Button"]').click(); //Why does this not work?
    cy.get('.chakra-modal__close-btn').click();
    cy.get('[data-test="Private Activities"] [data-test="Card Label"]').eq(0).contains(label1);

    cy.get('[data-test="Private Activities"] [data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Settings Menu Item"]').click();
    cy.get('[data-test="Activity Label"]').clear().type(label2);
    cy.get('.chakra-modal__close-btn').click();
    cy.get('[data-test="Private Activities"] [data-test="Card Label"]').eq(0).contains(label2);
  });

  it("Learning Outcomes", () => {
    const learningOutcome1 = "One, two, buckle my shoe";
    const learningOutcome2 = "Three, four, shut the door";
    const learningOutcome3 = "Five, six, pick up sticks";
    const learningOutcome4 = "Seven, eight, lay them straight";
    const learningOutcome5 = "Nine, ten, a big fat hen";
    const learningOutcome6 = "The End";
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Add Activity"]').click();
    cy.get('[data-test="add a learning outcome button"]').click();
    cy.get('[data-test="add a learning outcome button"]').click();
    cy.get('[data-test="add a learning outcome button"]').click();
    cy.get('[data-test="add a learning outcome button"]').click();

    cy.get('[data-test="learning outcome 0"]').type(learningOutcome1);
    cy.get('[data-test="learning outcome 1"]').type(learningOutcome2);
    cy.get('[data-test="learning outcome 2"]').type(learningOutcome3);
    cy.get('[data-test="learning outcome 3"]').type(learningOutcome4);
    cy.get('[data-test="learning outcome 4"]').type(learningOutcome5);

    cy.get('.chakra-modal__close-btn').click();
    cy.get('[data-test="Private Activities"] [data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Settings Menu Item"]').click();

    //Check the text.
    cy.get('[data-test="learning outcome 0"]').should(
      "have.value",
      learningOutcome1,
    );
    cy.get('[data-test="learning outcome 1"]').should(
      "have.value",
      learningOutcome2,
    );
    cy.get('[data-test="learning outcome 2"]').should(
      "have.value",
      learningOutcome3,
    );
    cy.get('[data-test="learning outcome 3"]').should(
      "have.value",
      learningOutcome4,
    );
    cy.get('[data-test="learning outcome 4"]').should(
      "have.value",
      learningOutcome5,
    );

    //Delete the first two
    cy.get('[data-test="delete learning outcome 0 button"]').click();
    cy.get('[data-test="delete learning outcome 0 button"]').click();
    cy.get('[data-test="learning outcome 0"]').should(
      "have.value",
      learningOutcome3,
    );
    cy.get('[data-test="learning outcome 1"]').should(
      "have.value",
      learningOutcome4,
    );
    cy.get('[data-test="learning outcome 2"]').should(
      "have.value",
      learningOutcome5,
    );
    //Add another
    cy.get('[data-test="add a learning outcome button"]').click();
    cy.get('[data-test="learning outcome 3"]').type(learningOutcome6);

    cy.get('[data-test="learning outcome 0"]').should(
      "have.value",
      learningOutcome3,
    );
    cy.get('[data-test="learning outcome 1"]').should(
      "have.value",
      learningOutcome4,
    );
    cy.get('[data-test="learning outcome 2"]').should(
      "have.value",
      learningOutcome5,
    );
    cy.get('[data-test="learning outcome 3"]').should(
      "have.value",
      learningOutcome6,
    );
  });
});
