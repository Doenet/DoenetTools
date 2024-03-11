import { cesc2 } from "../../../src/_utils/url";

describe("Load and Save Editor", function () {
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
    const largeNumber = `12345678901234567890123456789012345678901234567890123456789012345678901234567890`;
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Add Activity"]').click();
    cy.get('.chakra-modal__close-btn').click();
    cy.get('[data-test="Private Activities"] [data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Edit Menu Item"]').eq(0).click();

    cy.get(".cm-content").type(largeNumber);
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2("#/_document1")).should("contains.text", largeNumber);

    //Leave and come back
    cy.get('[data-test="Logo Button"]').click();
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Private Activities"] [data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Edit Menu Item"]').eq(0).click();
    cy.get(cesc2("#/_document1")).should("contains.text", largeNumber);
  });

  it("Quickly Save and Refresh Save", () => {
    const doenetML1 = "Draft content";
    const doenetML2 = "More Draft content";
    //Set it up
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Add Activity"]').click();
    cy.get('.chakra-modal__close-btn').click();
    cy.get('[data-test="Private Activities"] [data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Edit Menu Item"]').eq(0).click();
    cy.get(".cm-content").type(
      `{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p name="draft">${doenetML1}</p>`,
    );

    //Leave
    cy.get('[data-test="Logo Button"]').click();

    //Go Back
    cy.get('[data-test="Private Activities"] [data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Edit Menu Item"]').eq(0).click();

    cy.get(cesc2("#/draft")).should("have.text", doenetML1);

    //Enter more and hit refresh
    cy.get(".cm-content").clear().type(
      `{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p name="draft">${doenetML2}</p>`,
    );
    cy.reload();
    cy.get(cesc2("#/draft")).should("have.text", doenetML2);

  });
});
