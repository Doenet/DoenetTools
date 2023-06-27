// import {signIn} from '../DoenetSignin/DoenetSignin.cy';

const { cesc2 } = require("../../../src/_utils/url");

describe("Share Activities Using Portfolio", function () {
  const userId = "cyuserId";
  const userId2 = "cyuserId2";

  before(() => {
    // cy.clearAllOfAUsersActivities({userId})
  });
  beforeEach(() => {
    cy.signin({ userId });

    cy.visit(`/`);
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("Portfolio Settings Menu", () => {
    const label = "ShareActivites Portfolio Settings Menu";
    try {
      cy.get('[data-test="Portfolio"]').click();

      cy.log("Create an activity");
      cy.get('[data-test="Add Activity"]').click();

      cy.get(".cm-content").type(
        `<p>What is your name? <textinput name="name" /></p>{enter}`,
      );

      cy.get(
        '[data-test="Activity Label Editable"] [data-test="Editable Preview"]',
      ).click();
      cy.get(
        '[data-test="Activity Label Editable"] [data-test="Editable Input"]',
      )
        .type(label)
        .blur();

      cy.get('[data-test="Portfolio"]').click();

      cy.get('[data-test="Private Activities"]').contains(label);
      cy.get('[data-test="Public Activities"]').should("not.contain", label);

      cy.get('[data-test="Private Activities"]')
        .contains(label)
        .get('[data-test="Card Menu Button"]')
        .click();
      cy.get('[data-test="Settings Menu Item"]').click();

      cy.get('[data-test="Public Checkbox"]').click();

      cy.get(".chakra-modal__close-btn").click();
      // // cy.get('[data-test="Close Settings Button"]').click(); //TODO use data-test

      cy.get('[data-test="Public Activities"]').contains(label);
      cy.get('[data-test="Private Activities"]').should("not.contain", label);
    } finally {
      cy.deletePortfolioActivity({ userId, label });
    }
  });

  it("Share activities and remix", () => {
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId: userId2 });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId });
    cy.clearAllOfAUsersActivities({ userId: userId2 });

    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);
    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);

    cy.log("Create an activity");
    cy.get('[data-test="Add Activity"]').click();

    cy.get(".cm-content").type(
      `<p>What is your name? <textinput name="name" /></p>{enter}`,
    );
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);
    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);

    cy.log("Edit the activity");
    cy.get('[data-test="Private Activities"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);

    cy.get('[data-test="Viewer Update Button"]').should("have.length", 1);
    cy.log("In the editor");

    cy.get(".cm-content").type(
      `{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p>Hello, <text name="name2" copySource="name" />!</p>`,
    );
    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");

    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);
    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);

    cy.log("Make the activity public");
    cy.get(
      '[data-test="Private Activities"] [data-test="Card Menu Button"]',
    ).click();
    cy.get('[data-test="Make Public Menu Item"]').click();

    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);
    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);

    cy.log("Change activity label");
    cy.get(
      '[data-test="Public Activities"] [data-test="Card Menu Button"]',
    ).click();
    cy.get('[data-test="Settings Menu Item"]').click();

    cy.get('[data-test="Activity Label"]').clear().type("Hello!").blur();

    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]')
      .eq(0)
      .should("contain.text", "Hello!");

    cy.get(".chakra-modal__close-btn").click(); //Couldn't figure out data-test on this one

    cy.log("Edit the public activity");
    cy.get('[data-test="Public Activities"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(".cm-content").type(
      `{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p name="draft">Draft content</p>`,
    );

    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2("#/draft")).should("have.text", "Draft content");

    cy.get('[data-test="Portfolio"]').click();

    cy.log("Create a private activity");
    cy.get('[data-test="Add Activity"]').click();

    cy.get(".cm-content").type(`Stays private{enter}`);
    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get('[data-test="Controls Button"]').click();

    cy.get('[data-test="Activity Label"]').clear().type("Stay private").blur();
    cy.get(".chakra-modal__close-btn").click();

    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);
    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);

    cy.log("Log on as other user");
    cy.signin({ userId: userId2 });

    cy.visit(`/`);

    cy.log("Cannot find private activity Stay Private");
    cy.get('[data-test="Community"]').click();
    cy.get('[data-test="Search"]').type("Stay Private{enter}");

    cy.get('[data-test="Search Results For"]').should(
      "have.text",
      "Stay Private",
    );
    cy.get('[data-test="Search Results"] [data-test="Activity Card"]').should(
      "have.length",
      0,
    );

    cy.log("Find public activity Hello!");
    cy.get('[data-test="Search"]')
      .clear()
      .should("have.value", "")
      .type("Hello!{enter}");
    cy.get('[data-test="Search Results For"]').should("have.text", "Hello!");

    cy.get('[data-test="Results All Matches"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("not.exist");

    cy.get(cesc2("#/name")).type("Me{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, Me!");

    cy.log("View source code");
    cy.contains("See Inside").click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("not.exist");

    cy.get(cesc2("#/name")).type("You{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, You!");

    cy.log("Temporarily modify the source");
    cy.get(".cm-content").type(
      `{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p name="temp_content">Temporary content</p>`,
    );
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2("#/temp_content")).should("have.text", "Temporary content");

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/name")).type("Mom{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, Mom!");

    cy.log("Remix");
    cy.get('[data-test="Remix Button"]').click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("not.exist");
    cy.get(cesc2("#/temp_content")).should("not.exist");

    cy.log("Modify the source for real");
    cy.get(".cm-content").type(
      `{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p name="actual_change">Actual change</p>`,
    );
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2("#/actual_change")).should("have.text", "Actual change");

    cy.log("Find activity in portfolio");
    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);
    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);

    cy.log("Edit the activity");
    cy.get('[data-test="Private Activities"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("not.exist");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("have.text", "Actual change");

    cy.get(cesc2("#/name")).type("Dad{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, Dad!");

    cy.log("Log back in as first user");
    cy.signin({ userId });
    cy.visit(`/`);

    cy.log("Verify activity is unchanged with draft content");
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Public Activities"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("have.text", "Draft content");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("not.exist");

    cy.log("Update public activity");
    cy.get('[data-test="Update Public Activity Button"]').click();

    cy.get(cesc2("#/name")).type("Sis{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, Sis!");

    cy.log("Log back in as second user");
    cy.signin({ userId: userId2 });
    cy.visit(`/`);

    cy.log("Find new version of public activity Hello!");
    cy.get('[data-test="Community"]').click();

    cy.get('[data-test="Search"]').type("Hello!{enter}");
    cy.get('[data-test="Results All Matches"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("have.text", "Draft content");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("not.exist");

    cy.get(cesc2("#/name")).type("Bro{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, Bro!");

    cy.log("Remix");
    cy.get('[data-test="Remix Button"]').click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("have.text", "Draft content");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("not.exist");

    cy.log("Modify the source for real");
    cy.get(".cm-content").type(
      `{ctrl+end}{rightarrow}{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p name="change2">New change</p>`,
    );
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2("#/change2")).should("have.text", "New change");

    cy.log("Find both activities in portfolio");
    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);
    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 2);

    cy.log("View the most recently remixed activity");
    cy.get('[data-test="Private Activities"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("have.text", "Draft content");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("not.exist");
    cy.get(cesc2("#/change2")).should("have.text", "New change");

    cy.log("View the first remixed activity");
    cy.get('[data-test="Portfolio"]').click();

    cy.get('[data-test="Private Activities"] [data-test="Card Image Link"] ')
      .eq(1)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("not.exist");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("have.text", "Actual change");
    cy.get(cesc2("#/change2")).should("not.exist");
  });

  it("View solution in portfolio", () => {
    const label = "View solution in portfolio";
    try {
      cy.get('[data-test="Portfolio"]').click();

      cy.log("Create an activity with a solution");
      cy.get('[data-test="Add Activity"]').click();

      cy.get(".cm-content").type(
        `<p>What is 1+1?</p>{enter}<solution name="sol"><number name="ans">2</number></solution>`,
      );

      cy.get(
        '[data-test="Activity Label Editable"] [data-test="Editable Preview"]',
      ).click();
      cy.get(
        '[data-test="Activity Label Editable"] [data-test="Editable Input"]',
      )
        .type(label)
        .blur();

      cy.get('[data-test="Viewer Update Button"]').click();

      cy.get(cesc2("#/_p1")).should("have.text", "What is 1+1?");

      cy.get(cesc2("#/ans")).should("not.exist");

      cy.get(cesc2("#/sol_button")).click();
      cy.get(cesc2("#/ans")).should("have.text", "2");
      cy.get(cesc2("#/sol_button")).click();
      cy.get(cesc2("#/ans")).should("not.exist");
      cy.get(cesc2("#/sol_button")).click();
      cy.get(cesc2("#/ans")).should("have.text", "2");
      cy.get(cesc2("#/sol_button")).click();
      cy.get(cesc2("#/ans")).should("not.exist");

      cy.get('[data-test="Portfolio"]').click();

      cy.get('[data-test="Private Activities"]').contains(label);
      cy.get('[data-test="Public Activities"]').should("not.contain", label);

      cy.get('[data-test="Private Activities"]')
        .contains(label)
        .get('[data-test="Card Menu Button"]')
        .click();
      cy.get('[data-test="Settings Menu Item"]').click();

      cy.get('[data-test="Public Checkbox"]').click();

      cy.get(".chakra-modal__close-btn").click();
      // // cy.get('[data-test="Close Settings Button"]').click(); //TODO use data-test

      cy.get('[data-test="Public Activities"]').contains(label);
      cy.get('[data-test="Private Activities"]').should("not.contain", label);

      cy.get("[data-test=Community").click();
      cy.get("[data-test=Search]").type(label + "{enter}");

      cy.get('[data-test="Results All Matches"]')
        .contains(label)
        .get('[data-test="Card Image Link"]')
        .eq(0)
        .click();

      cy.get(cesc2("#/_p1")).should("have.text", "What is 1+1?");

      cy.get(cesc2("#/ans")).should("not.exist");

      cy.get(cesc2("#/sol_button")).click();
      cy.get(cesc2("#/ans")).should("have.text", "2");
      cy.get(cesc2("#/sol_button")).click();
      cy.get(cesc2("#/ans")).should("not.exist");
      cy.get(cesc2("#/sol_button")).click();
      cy.get(cesc2("#/ans")).should("have.text", "2");
      cy.get(cesc2("#/sol_button")).click();
      cy.get(cesc2("#/ans")).should("not.exist");
    } finally {
      console.log("Here!");
      cy.deletePortfolioActivity({ userId, label });
    }
  });
});
