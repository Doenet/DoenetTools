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

  it.only("Update Label of an Activity using Settings", () => {
    const label1 = "Scooby Doo Episode #1"
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Add Activity"]').click();
    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Activity Label"]').clear().type(label1);
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get('[data-test="Activity Label Edititable"]').contains(label1);
  })

  it("Update Label of an Activity using Editable", () => {
    const label1 = "Scooby Doo Episode"
    cy.get('[data-test="Portfolio"]').click();
    // cy.get('[data-test="Add Activity"]').click();
    // cy.get('[data-test="Controls Button"]').click();
    // cy.get('[data-test="Activity Label"]').clear().type(label1).blur();
    // cy.get('[data-test="Close Settings Button"]').click();

    // cy.get('[data-test="Portfolio"]').click();
    // cy.get('[data-test="Private Activities"] [data-test="Card Label"]').contains(label1)
    // cy.get('[data-test="Private Activities"] [data-test="Card Image Link"] ').eq(0).click();

  })


});
