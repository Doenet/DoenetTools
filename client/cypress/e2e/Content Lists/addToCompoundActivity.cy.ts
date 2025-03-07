import { it } from "mocha";

describe("Add to compound activity tests", () => {
  function createInitialSetup() {
    cy.loginAsTestUser();

    cy.createContent({
      name: "Document 1",
      contentType: "singleDoc",
      makePublic: true,
    });
    cy.createContent({
      name: "Problem Set 1",
      contentType: "sequence",
      makePublic: true,
    }).then((sequenceId) => {
      cy.createContent({
        name: "Document P1",
        contentType: "singleDoc",
        parentId: sequenceId,
        doenetML: "Hi P1",
      });
      cy.createContent({
        name: "Question Bank P1",
        contentType: "select",
        parentId: sequenceId,
      }).then((selectId) => {
        cy.createContent({
          name: "Document PQ11",
          contentType: "singleDoc",
          parentId: selectId,
          doenetML: "Hi PQ12",
        });
        cy.createContent({
          name: "Document PQ12",
          contentType: "singleDoc",
          parentId: selectId,
          doenetML: "Hi PQ12",
        });
      });
    });
    cy.createContent({
      name: "Question Bank 1",
      contentType: "select",
      makePublic: true,
    }).then((selectId) => {
      cy.createContent({
        name: "Document Q1",
        contentType: "singleDoc",
        parentId: selectId,
        doenetML: "Hi Q1",
      });
    });
    cy.createContent({
      name: "Folder 1",
      contentType: "folder",
      makePublic: true,
    }).then((folderId) => {
      cy.createContent({
        name: "Document F1",
        contentType: "singleDoc",
        parentId: folderId,
        doenetML: "Hi F1",
      });
      cy.createContent({
        name: "Problem Set F",
        contentType: "sequence",
        parentId: folderId,
      }).then((sequenceId) => {
        cy.createContent({
          name: "Document FP1",
          contentType: "singleDoc",
          parentId: sequenceId,
          doenetML: "Hi FP1",
        });
        cy.createContent({
          name: "Question Bank FP1",
          contentType: "select",
          parentId: sequenceId,
        }).then((selectId) => {
          cy.createContent({
            name: "Document FPQ11",
            contentType: "singleDoc",
            parentId: selectId,
            doenetML: "Hi FPQ1",
          });
        });
      });
      cy.createContent({
        name: "Document F2",
        contentType: "singleDoc",
        parentId: folderId,
        doenetML: "Hi F2",
      });
      cy.createContent({
        name: "Question Bank F2",
        contentType: "select",
        parentId: folderId,
      }).then((selectId) => {
        cy.createContent({
          name: "Document FQ21",
          contentType: "singleDoc",
          parentId: selectId,
          doenetML: "Hi FQ21",
        });
      });
    });

    cy.createContent({
      name: "Folder 2",
      contentType: "folder",
      makePublic: true,
    });
  }

  it("Add to blank items to compound activity", () => {
    cy.loginAsTestUser();

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();
    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Problem Set Button"]').click();
    cy.get('[data-test="Editable Title"]')
      .should("have.text", "Untitled Problem Set")
      .type("A problem set{enter}");

    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Document Button"]').click();
    cy.get('[data-test="Editable Title"]')
      .should("have.text", "Untitled Document")
      .type("A document{enter}");
    cy.go("back");

    cy.get(`[data-test="Content Card"]`).should("have.length", 1);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "A document");

    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Question Bank Button"]').click();
    cy.get('[data-test="New Content Input"]').should(
      "have.value",
      "Untitled Question Bank",
    );
    cy.get('[data-test="Cancel Button"]').click();
    cy.get('[data-test="New Content Input"]').should("not.exist");

    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Question Bank Button"]').click();
    cy.get('[data-test="New Content Input"]').should(
      "have.value",
      "Untitled Question Bank",
    );
    cy.focused().type("A new bank");
    cy.get('[data-test="Create Content"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 2);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "A document");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "A new bank");

    cy.get('[data-test="Activities"]').should(
      "contain.text",
      "Above question bank is empty.",
    );

    cy.get('[data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Move Down Menu Item"]').eq(0).click();

    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "A new bank");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "A document");

    cy.get('[data-test="Activities"]').should(
      "not.contain.text",
      "Above question bank is empty.",
    );

    cy.get('[data-test="Card Menu Button"]').eq(1).click();
    cy.get('[data-test="Move Down Menu Item"]').eq(0).click();

    cy.get('[data-test="Activities"]').should(
      "contain.text",
      "Above question bank is empty.",
    );

    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "A new bank");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "A document");
  });

  it("Add to compound activity from My Activities", () => {
    createInitialSetup();

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();

    cy.log("Add items to Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1")
      .click();
    cy.get('[data-test="Editable Title"]').should("have.text", "Problem Set 1");
    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add My Activities Items"]').click();

    cy.get('[data-test="Folder Heading"]').should("have.text", "My Activities");
    cy.get('[data-test="Adding Items Message"]').should(
      "have.text",
      "Adding items to: Problem Set 1",
    );
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1")
      .find('[data-test="Card Select"]')
      .click();

    cy.get('[data-test="Add Selected To Button"]')
      .should("contain.text", "Add selected to: Problem Se")
      .click();

    cy.get('[data-test="Copy Body"]').should(
      "have.text",
      "1 item added to: Problem Set 1",
    );
    cy.get('[data-test="Close Button"]').click();

    cy.log("Add Question Bank F2 from Folder 1 ");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1")
      .click();

    cy.get('[data-test="Folder Heading"]').should(
      "have.text",
      "Public Folder: Folder 1",
    );

    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Question Bank F2")
      .find('[data-test="Card Select"]')
      .click();

    cy.get('[data-test="Add Selected To Button"]')
      .should("contain.text", "Add selected to: Problem Se")
      .click();

    cy.get('[data-test="Copy Body"]').should(
      "have.text",
      "1 item added to: Problem Set 1",
    );
    cy.get('[data-test="Go to Destination"]')
      .should("have.text", "Open problem set")
      .click();

    cy.get('[data-test="Editable Title"]').should("have.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`).should("have.length", 7);
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Question Bank F2");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Document FQ21");

    cy.log("Add to Question Bank 1");
    cy.get('[data-test="Back Link"]').click();
    cy.get('[data-test="Folder Heading"]').should("have.text", "My Activities");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1")
      .click();
    cy.get('[data-test="Editable Title"]').should(
      "have.text",
      "Question Bank 1",
    );
    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add My Activities Items"]').click();

    cy.get('[data-test="Folder Heading"]').should("have.text", "My Activities");
    cy.get('[data-test="Adding Items Message"]').should(
      "have.text",
      "Adding items to: Question Bank 1",
    );
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1")
      .find('[data-test="Card Select"]')
      .click();

    cy.get('[data-test="Add Selected To Button"]')
      .should("contain.text", "Add selected to: Question B")
      .click();

    cy.get('[data-test="Copy Body"]').should(
      "have.text",
      "5 items added to: Question Bank 1",
    );
    cy.get('[data-test="Close Button"]').click();

    cy.log("clear selection");
    cy.get('[data-test="Add Selected To Button"]').should(
      "contain.text",
      "Add selected to: Question B",
    );
    cy.get('[data-test="Clear Selection"]').click();
    cy.get('[data-test="Add Selected To Button"]').should("not.be.visible");

    cy.log("stop adding items");

    cy.get('[data-test="Adding Items Message"]').should(
      "have.text",
      "Adding items to: Question Bank 1",
    );

    cy.get('[data-test="Stop Adding Items"]').click();
    cy.get('[data-test="Adding Items Message"]').should("not.exist");

    cy.log("Verify Question Bank 1 has new items");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1")
      .click();
    cy.get('[data-test="Editable Title"]').should(
      "have.text",
      "Question Bank 1",
    );
    cy.get(`[data-test="Content Card"]`).should("have.length", 6);
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Document P1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document PQ11");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Document PQ12");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Document FQ21");
  });

  it("Add to compound activity from Explore", () => {
    createInitialSetup();

    cy.getUserInfo().then((user) => {
      cy.loginAsTestUser();

      cy.visit("/");

      cy.get('[data-test="Activities"]').click();

      cy.log("Create new problem set, then add items from explore");
      cy.get('[data-test="New Button"]').click();
      cy.get('[data-test="Add Problem Set Button"]').click();
      cy.get('[data-test="Editable Title"]')
        .should("have.text", "Untitled Problem Set")
        .type("A problem set{enter}");

      cy.get('[data-test="New Button"]').click();
      cy.get('[data-test="Add Explore Items"]').click();

      cy.get('[data-test="Search"]').type(
        `${user.firstNames} ${user.lastNames}{enter}`,
      );
      cy.get('[data-test="Authors Tab"]').click();
      cy.get('[data-test="Filter By Matched Author"]')
        .eq(0)
        .should("contain.text", `${user.firstNames} ${user.lastNames}`)
        .click();

      cy.get('[data-test="Content List"] [data-test="Content Card"]')
        .eq(0)
        .should("contain.text", "Folder 2");

      cy.log("Add Question Bank 1 and Question Bank FP1");

      cy.get('[data-test="Search"]').type(`Question Bank{enter}`);
      cy.get('[data-test="Content List"] [data-test="Content Card"]')
        .eq(2)
        .should("contain.text", "Question Bank FP1")
        .find('[data-test="Card Select"]')
        .click();

      cy.get('[data-test="Content Card"]')
        .eq(1)
        .should("contain.text", "Question Bank 1")
        .find('[data-test="Card Select"]')
        .click();

      cy.get('[data-test="Add Selected To Button"]')
        .should("contain.text", "Add selected to: A problem")
        .click();

      cy.get('[data-test="Copy Body"]').should(
        "have.text",
        "2 items added to: A problem set",
      );
      cy.get('[data-test="Go to Destination"]')
        .should("have.text", "Open problem set")
        .click();

      cy.get('[data-test="Editable Title"]').should(
        "have.text",
        "A problem set",
      );

      cy.get(`[data-test="Content Card"]`).should("have.length", 4);
      cy.get(`[data-test="Content Card"]`)
        .eq(0)
        .should("contain.text", "Question Bank 1");
      cy.get(`[data-test="Content Card"]`)
        .eq(1)
        .should("contain.text", "Document Q1");
      cy.get(`[data-test="Content Card"]`)
        .eq(2)
        .should("contain.text", "Question Bank FP1");
      cy.get(`[data-test="Content Card"]`)
        .eq(3)
        .should("contain.text", "Document FPQ11");
    });
  });

  it("Add to compound activity from Shared Activities", () => {
    createInitialSetup();

    cy.getUserInfo().then((user) => {
      cy.loginAsTestUser();

      cy.visit("/");

      cy.get('[data-test="Activities"]').click();

      cy.log(
        "Create new question bank, then add items from shared activities found from explore",
      );
      cy.get('[data-test="New Button"]').click();
      cy.get('[data-test="Add Question Bank Button"]').click();
      cy.get('[data-test="Editable Title"]')
        .should("have.text", "Untitled Question Bank")
        .type("My bank{enter}");

      cy.get('[data-test="New Button"]').click();
      cy.get('[data-test="Add Explore Items"]').click();

      cy.get('[data-test="Search"]').type(
        `${user.firstNames} ${user.lastNames}{enter}`,
      );
      cy.get('[data-test="Authors Tab"]').click();
      cy.get('[data-test="Filter By Matched Author"]')
        .eq(0)
        .should("contain.text", `${user.firstNames} ${user.lastNames}`)
        .click();

      cy.get('[data-test="Content List"] [data-test="Content Card"]')
        .eq(0)
        .should("contain.text", "Folder 2");

      cy.get('[data-test="Search"]').type(`Folder 1{enter}`);
      cy.get('[data-test="Content List"] [data-test="Content Card"]')
        .eq(0)
        .should("contain.text", "Folder 1")
        .click();

      cy.get('[data-test="Folder Heading"]').should(
        "have.text",
        "Folder: Folder 1",
      );

      cy.log("Add Document F2 and Question Bank F2 to My bank");
      cy.get('[data-test="Content Card"]')
        .eq(2)
        .should("contain.text", "Document F2")
        .find('[data-test="Card Select"]')
        .click();
      cy.get('[data-test="Content Card"]')
        .eq(3)
        .should("contain.text", "Question Bank F2")
        .find('[data-test="Card Select"]')
        .click();

      cy.get('[data-test="Add Selected To Button"]')
        .should("contain.text", "Add selected to: My bank")
        .click();

      cy.get('[data-test="Copy Body"]').should(
        "have.text",
        "2 items added to: My bank",
      );
      cy.get('[data-test="Go to Destination"]')
        .should("have.text", "Open question bank")
        .click();

      cy.get('[data-test="Editable Title"]').should("have.text", "My bank");

      cy.get(`[data-test="Content Card"]`).should("have.length", 2);
      cy.get(`[data-test="Content Card"]`)
        .eq(0)
        .should("contain.text", "Document F2");
      cy.get(`[data-test="Content Card"]`)
        .eq(1)
        .should("contain.text", "Document FQ21");
    });
  });

  it("Add to compound activity from Activity Viewer", () => {
    createInitialSetup();

    cy.getUserInfo().then((user) => {
      cy.loginAsTestUser();

      cy.visit("/");

      cy.get('[data-test="Activities"]').click();

      cy.log(
        "Create new question bank, then add items from shared activities found from explore",
      );
      cy.get('[data-test="New Button"]').click();
      cy.get('[data-test="Add Question Bank Button"]').click();
      cy.get('[data-test="Editable Title"]')
        .should("have.text", "Untitled Question Bank")
        .type("My bank{enter}");

      cy.get('[data-test="New Button"]').click();
      cy.get('[data-test="Add Explore Items"]').click();

      cy.get('[data-test="Search"]').type(
        `${user.firstNames} ${user.lastNames}{enter}`,
      );
      cy.get('[data-test="Authors Tab"]').click();
      cy.get('[data-test="Filter By Matched Author"]')
        .eq(0)
        .should("contain.text", `${user.firstNames} ${user.lastNames}`)
        .click();

      cy.log("Add Document F1");
      cy.get('[data-test="Content List"] [data-test="Content Card"]')
        .eq(8)
        .should("contain.text", "Document F1")
        .click();

      cy.get('[data-test="Activity Name"]').should("have.text", "Document F1");

      cy.get('[data-test="Add To"]').click();
      cy.get('[data-test="Add To Selected"]').click();

      cy.get('[data-test="Copy Body"]').should(
        "have.text",
        "1 item added to: My bank",
      );
      cy.get('[data-test="Close Button"]').click();

      cy.go("back");

      cy.log("Add Document FPQ11 from Problem Set F");
      cy.get('[data-test="Content List"] [data-test="Content Card"]')
        .eq(7)
        .should("contain.text", "Problem Set F")
        .click();
      cy.get('[data-test="Activity Name"]').should(
        "have.text",
        "Problem Set F",
      );
      cy.get('[data-test="Edit Mode Button"]').click();
      cy.get(`[data-test="Content Card"]`)
        .eq(2)
        .should("contain.text", "Document FPQ11")
        .find('[data-test="Card Select"]')
        .click();

      cy.get('[data-test="Add Selected To Button"]')
        .should("contain.text", "Add selected to: My bank")
        .click();

      cy.get('[data-test="Copy Body"]').should(
        "have.text",
        "1 item added to: My bank",
      );
      cy.get('[data-test="Close Button"]').click();

      cy.go("back");

      cy.log("Add Question Bank F2 from its viewer");
      cy.get('[data-test="Content List"] [data-test="Content Card"]')
        .eq(2)
        .should("contain.text", "Question Bank F2")
        .click();
      cy.get('[data-test="Activity Name"]').should(
        "have.text",
        "Question Bank F2",
      );

      cy.get('[data-test="Activity Name"]').should(
        "have.text",
        "Question Bank F2",
      );
      cy.get('[data-test="Add To"]').eq(0).click();
      cy.get('[data-test="Add To Selected"]').click();

      cy.get('[data-test="Copy Body"]').should(
        "have.text",
        "1 item added to: My bank",
      );

      cy.get('[data-test="Go to Destination"]')
        .should("have.text", "Open question bank")
        .click();

      cy.get('[data-test="Editable Title"]').should("have.text", "My bank");

      cy.get(`[data-test="Content Card"]`).should("have.length", 3);
      cy.get(`[data-test="Content Card"]`)
        .eq(0)
        .should("contain.text", "Document F1");
      cy.get(`[data-test="Content Card"]`)
        .eq(1)
        .should("contain.text", "Document FPQ11");
      cy.get(`[data-test="Content Card"]`)
        .eq(2)
        .should("contain.text", "Document FQ21");
    });
  });
});
