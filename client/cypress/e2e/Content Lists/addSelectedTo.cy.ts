describe("Add selected to tests", () => {
  function createInitialSetup() {
    cy.loginAsTestUser();

    cy.createContent({ name: "Document 1", contentType: "singleDoc" });
    cy.createContent({ name: "Problem Set 1", contentType: "sequence" }).then(
      (sequenceId) => {
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
      },
    );
    cy.createContent({ name: "Question Bank 1", contentType: "select" }).then(
      (selectId) => {
        cy.createContent({
          name: "Document Q1",
          contentType: "singleDoc",
          parentId: selectId,
          doenetML: "Hi Q1",
        });
      },
    );
    cy.createContent({ name: "Folder 1", contentType: "folder" }).then(
      (folderId) => {
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
            name: "Document FPQ21",
            contentType: "singleDoc",
            parentId: selectId,
            doenetML: "Hi FPQ21",
          });
        });
      },
    );

    cy.createContent({ name: "Folder 2", contentType: "folder" });
  }

  it("Copy selected from My Activities", () => {
    createInitialSetup();

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();

    // Copy document 1 to problem set 1
    cy.log("Copy document 1 to problem set 1");
    cy.get('[data-test="Card Select"]').eq(0).click();

    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Add To Problem Set"]').click();
    cy.get('[data-test="Current destination"]').should(
      "have.text",
      "My Activities",
    );
    cy.get('[data-test="Execute MoveCopy Button"]').should("be.disabled");

    cy.get('[data-test="Select Item Option"]').should("have.length", 5);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set 1")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Question Bank 1")
      .should("be.disabled");
    // Folder 1 has a problem set inside it, so it is not disabled
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Folder 1")
      .should("not.be.disabled");
    // Folder 2 does not have a problem set inside it, so it is disabled
    cy.get('[data-test="Select Item Option"]')
      .eq(3)
      .should("have.text", "Folder 2")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(4)
      .should("have.text", "Document 1")
      .should("be.disabled");

    cy.get('[data-test="Select Item Option"]').eq(0).click();
    cy.get('[data-test="Select Item Option"]').should("have.length", 2);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Question Bank P1")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Document P1")
      .should("be.disabled");

    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "1 item added to: Problem Set 1",
    );
    cy.get('[data-test="Go to Destination"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 5);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document P1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Question Bank P1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document PQ11");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Document PQ12");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Document 1");

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");

    // Copy document 1 to question bank 1
    cy.log("Copy document 1 to question bank 1");
    cy.get('[data-test="Card Select"]').eq(0).click();

    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Add To Question Bank"]').click();
    cy.get('[data-test="Current destination"]').should(
      "have.text",
      "My Activities",
    );
    cy.get('[data-test="Execute MoveCopy Button"]').should("be.disabled");

    cy.get('[data-test="Select Item Option"]').should("have.length", 5);
    // Problem Set 1 has a question bank inside it, so it is not disabled
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set 1")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Question Bank 1")
      .should("not.be.disabled");
    // Folder 1 has a question bank inside it, so it is not disabled
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Folder 1")
      .should("not.be.disabled");
    // Folder 2 does not have a question bank inside it, so it is disabled
    cy.get('[data-test="Select Item Option"]')
      .eq(3)
      .should("have.text", "Folder 2")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(4)
      .should("have.text", "Document 1")
      .should("be.disabled");

    cy.get('[data-test="Select Item Option"]').eq(1).click();
    cy.get('[data-test="Select Item Option"]').should("have.length", 1);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Document Q1")
      .should("be.disabled");

    cy.get('[data-test="Cancel Button"]').click();
    cy.get('[data-test="Select Item Option"]').should("not.exist");
    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Add To Question Bank"]').click();
    cy.get('[data-test="Select Item Option"]').eq(1).click();
    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "1 item added to: Question Bank 1",
    );
    cy.get('[data-test="Close Button"]').click();
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1")
      .click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 2);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document Q1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Document 1");

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 5);

    // Copy problem set 1 to question bank FP1
    cy.log("problem set 1 to question bank FP1");
    cy.get('[data-test="Card Select"]').eq(1).click();

    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Add To Question Bank"]').click();
    cy.get('[data-test="Current destination"]').should(
      "have.text",
      "My Activities",
    );
    cy.get('[data-test="Execute MoveCopy Button"]').should("be.disabled");

    cy.get('[data-test="Select Item Option"]').should("have.length", 5);
    // Problem Set 1 is disabled as we are copying it
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set 1")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Question Bank 1")
      .should("not.be.disabled");
    // Folder 1 has a question bank inside it, so it is not disabled
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Folder 1")
      .should("not.be.disabled");
    // Folder 2 does not have a question bank inside it, so it is disabled
    cy.get('[data-test="Select Item Option"]')
      .eq(3)
      .should("have.text", "Folder 2")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(4)
      .should("have.text", "Document 1")
      .should("be.disabled");

    cy.get('[data-test="Select Item Option"]').eq(2).click();
    cy.get('[data-test="Select Item Option"]').should("have.length", 4);
    cy.get('[data-test="Execute MoveCopy Button"]').should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set F")
      .click();

    cy.get('[data-test="Select Item Option"]').should("have.length", 2);
    cy.get('[data-test="Execute MoveCopy Button"]').should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Question Bank FP1")
      .click();

    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "4 items added to: Question Bank FP1",
    );

    cy.get('[data-test="Go to Destination"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 7);
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Question Bank FP1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Document P1");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Document PQ11");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Document PQ12");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Document 1");

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 4);

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 5);
  });

  it.only("Copy multiple selected from My Activities", () => {
    createInitialSetup();

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();

    // Copy document 1, problem set 1, question bank 1 to problem set F
    cy.log("Copy document 1, problem set 1, question bank 1 to problem set F");

    cy.get('[data-test="Card Select"]').eq(1).click();
    cy.get('[data-test="Card Select"]').eq(0).click();
    cy.get('[data-test="Card Select"]').eq(2).click();

    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Add To Problem Set"]').click();
    cy.get('[data-test="Current destination"]').should(
      "have.text",
      "My Activities",
    );

    cy.get('[data-test="Execute MoveCopy Button"]').should("be.disabled");

    cy.get('[data-test="Select Item Option"]').should("have.length", 5);
    // Problem Set 1 is disabled as we are copying it
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set 1")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Question Bank 1")
      .should("be.disabled");
    // Folder 1 has a problem set inside it, so it is not disabled
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Folder 1")
      .should("not.be.disabled");
    // Folder 2 does not have a problem set inside it, so it is disabled
    cy.get('[data-test="Select Item Option"]')
      .eq(3)
      .should("have.text", "Folder 2")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(4)
      .should("have.text", "Document 1")
      .should("be.disabled");

    cy.get('[data-test="Select Item Option"]').eq(2).click();
    cy.get('[data-test="Select Item Option"]').should("have.length", 4);
    cy.get('[data-test="Execute MoveCopy Button"]').should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set F")
      .click();

    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "4 items added to: Problem Set F",
    );

    cy.get('[data-test="Go to Destination"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 10);
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Document P1");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Question Bank P1");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Document PQ11");
    cy.get(`[data-test="Content Card"]`)
      .eq(7)
      .should("contain.text", "Document PQ12");
    cy.get(`[data-test="Content Card"]`)
      .eq(8)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(9)
      .should("contain.text", "Document Q1");

    cy.log("Copy Document F2 and Question Bank F2 to MyActivities");
    cy.get('[data-test="Back Link"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Question Bank F2")
      .find('[data-test="Card Select"]')
      .click();
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document F2")
      .find('[data-test="Card Select"]')
      .click();

    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Add To My Activities"]').click();

    cy.get('[data-test="Copy Body"]').should(
      "have.text",
      "2 items added to: My Activities",
    );
    cy.get('[data-test="Go to Destination"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 7);
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Document F2");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Question Bank F2");

    cy.log("Copy Question Bank 1 from My Activities to My Activities");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1")
      .find('[data-test="Card Select"]')
      .click();
    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Add To My Activities"]').click();

    cy.get('[data-test="Copy Body"]').should(
      "have.text",
      "1 item added to: My Activities",
    );

    // new item appeared without any refresh
    cy.get(`[data-test="Content Card"]`).should("have.length", 8);
    cy.get(`[data-test="Content Card"]`)
      .eq(7)
      .should("contain.text", "Question Bank 1");

    cy.get('[data-test="Close Button"]').click();
    cy.get('[data-test="Copy Body"]').should("not.exist");
  });

  it("Copy selected to recent content", () => {
    createInitialSetup();

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();

    cy.log("Visit Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1")
      .click();
    cy.get('[data-test="Back Link"]').click();

    // Copy Document 1, Folder 2 to recent Folder 1
    cy.log("Copy Document 1, Folder 2 to recent Folder 1");

    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Folder 2")
      .find('[data-test="Card Select"]')
      .click();

    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1")
      .find('[data-test="Card Select"]')
      .click();

    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Recent Item"]').should("have.length", 1);
    cy.get('[data-test="Recent Item"]')
      .eq(0)
      .should("contain.text", "Folder 1")
      .click();
    cy.get('[data-test="Copy Body"]').should(
      "have.text",
      "2 items added to: Folder 1",
    );
    cy.get('[data-test="Go to Destination"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 6);
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Folder 2");

    cy.log("Visit Question Bank F2");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Question Bank F2")
      .click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 1);

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 6);

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 5);

    cy.log("Cannot move Folder 2 into self or a descendant");

    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1")
      .find('[data-test="Card Select"]')
      .click();

    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Recent Item"]').should("have.length", 2);
    cy.get('[data-test="Recent Item"]')
      .eq(0)
      .should("contain.text", "Folder 1")
      .should("be.disabled");

    cy.get('[data-test="Recent Item"]')
      .eq(1)
      .should("contain.text", "Question Bank F2")
      .click();
    cy.get('[data-test="Copy Body"]').should(
      "have.text",
      "An error occurred while adding: Cannot copy content into a descendant of itself.",
    );
    cy.get('[data-test="Close Button"]').click();

    cy.log("copying question bank 1 to problem set 1 adds it to recent list");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1")
      .find('[data-test="Card Select"]')
      .click();
    // unselect folder 1
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1")
      .find('[data-test="Card Select"]')
      .click();

    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Add To Problem Set"]').click();
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set 1")
      .click();

    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "1 item added to: Problem Set 1",
    );
    cy.get('[data-test="Close Button"]').click();

    cy.log("copy Document 1 to Problem Set 1 via recent list");
    // unselect question bank 1
    cy.get('[data-test="Content Card"]')
      .eq(2)
      .should("contain.text", "Question Bank 1")
      .find('[data-test="Card Select"]')
      .click();
    cy.get('[data-test="Content Card"]')
      .eq(0)
      .should("contain.text", "Document 1")
      .find('[data-test="Card Select"]')
      .click();

    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Recent Item"]').should("have.length", 3);
    cy.get('[data-test="Recent Item"]')
      .eq(0)
      .should("contain.text", "Problem Set 1")
      .click();
    cy.get('[data-test="Copy Body"]').should(
      "have.text",
      "1 item added to: Problem Set 1",
    );

    cy.get('[data-test="Go to Destination"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 7);
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Document Q1");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Document 1");
  });
});
