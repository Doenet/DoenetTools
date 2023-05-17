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

  it("Load Large Number", () => {
    const largeNumber = `12345678901234567890123456789012345678901234567890123456789012345678901234567890`
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Add Activity"]').click();
    cy.get(".cm-content").type(largeNumber);
    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Private Activities"] [data-test="Card Image Link"] ').eq(0).click();
    cy.get(cesc2('#/_document1')).should("contains.text", largeNumber);
    // cy.get(cesc2(".cm-content")).should("have.text", largeNumber);

  })

  it("Quickly Save", () => {
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Add Activity"]').click();
    cy.get(".cm-content").type(`{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p name="draft">Draft content</p>`);

    // cy.get('[data-test="Viewer Update Button"]').click();
    // cy.get(cesc2("#/draft")).should("have.text", "Draft content");

    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Private Activities"] [data-test="Card Image Link"] ').eq(0).click();
    cy.get(cesc2("#/draft")).should("have.text", "Draft content");
  });

});
