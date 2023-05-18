// import {signIn} from '../DoenetSignin/DoenetSignin.cy';

const { cesc2 } = require("../../../src/_utils/url");

describe("doenetEditor test", function () {
  const userId = "cyuserId";
  const userId2 = "cyuserId2";

  before(() => {
    // cy.clearAllOfAUsersActivities({userId})
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

  it("Update Label of an Activity both ways", () => {
    const label1 = "Scooby Doo"
    const label2 = "Duck Tails"
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Add Activity"]').click();
    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Activity Label"]').clear().type(label1);
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get('[data-test="Activity Label Editable"]').contains(label1);

    cy.get('[data-test="Activity Label Editable"] [data-test="Editable Preview"]').click();
    cy.get('[data-test="Activity Label Editable"] [data-test="Editable Input"]').type(label2).blur();
    cy.wait(1000) //Need the interface to be faster to not have this
    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Activity Label"]').should('have.value', label2)

  })

  it.only("Learning Outcomes", () => {
    const learningOutcome1 = "One, two, buckle my shoe";
    const learningOutcome2 = "Three, four, shut the door";
    const learningOutcome3 = "Five, six, pick up sticks";
    const learningOutcome4 = "Seven, eight, lay them straight";
    const learningOutcome5 = "Nine, ten, a big fat hen";
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Add Activity"]').click();
    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="add a learning outcome button"]').click();
    cy.get('[data-test="add a learning outcome button"]').click();
    cy.get('[data-test="add a learning outcome button"]').click();
    cy.get('[data-test="add a learning outcome button"]').click();

    cy.get('[data-test="learning outcome 0"]').type(learningOutcome1);
    cy.get('[data-test="learning outcome 1"]').type(learningOutcome2);
    cy.get('[data-test="learning outcome 2"]').type(learningOutcome3);
    cy.get('[data-test="learning outcome 3"]').type(learningOutcome4);
    cy.get('[data-test="learning outcome 4"]').type(learningOutcome5);
    // cy.get('[data-test="add a learning outcome button"]').click();

    cy.get('[data-test="Close Settings Button"]').click();
    cy.wait(3000)

    cy.get('[data-test="Controls Button"]').click();
    //Check the text.
    cy.get('[data-test="learning outcome 0"]').should('have.value', learningOutcome1)
    cy.get('[data-test="learning outcome 1"]').should('have.value', learningOutcome2)
    cy.get('[data-test="learning outcome 2"]').should('have.value', learningOutcome3)
    cy.get('[data-test="learning outcome 3"]').should('have.value', learningOutcome4)
    cy.get('[data-test="learning outcome 4"]').should('have.value', learningOutcome5)

    //Delete some
    //Add another

  })


});
