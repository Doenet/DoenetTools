describe("My Activities Tests", function () {
  it("create new content of each type, then rename twice", () => {
    cy.loginAsTestUser();

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();
    cy.get('[data-test="New Button').should("be.visible");

    cy.get(`[data-test="Content Card"]`).should("not.exist");

    cy.log("create document");
    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Document Button"]').click();
    cy.get('[data-test="Editable Title"]').should(
      "have.text",
      "Untitled Document",
    );
    cy.get('[data-test="Editable Title"]').type("Document 1{enter}");
    cy.go("back");
    cy.get(`[data-test="Content Card"]`).should("have.length", 1);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");

    cy.log("create problem set");
    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Problem Set Button"]').click();
    cy.get('[data-test="Editable Title"]').should(
      "have.text",
      "Untitled Problem Set",
    );
    cy.get('[data-test="Editable Title"]').type("Problem Set 1{enter}");
    cy.go("back");
    cy.get(`[data-test="Content Card"]`).should("have.length", 2);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1");

    cy.log("create question bank");
    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Question Bank Button"]').click();
    cy.get('[data-test="Editable Title"]').should(
      "have.text",
      "Untitled Question Bank",
    );
    cy.get('[data-test="Editable Title"]').type("Question Bank 1{enter}");
    cy.go("back");
    cy.get(`[data-test="Content Card"]`).should("have.length", 3);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1");

    cy.log("create folder");
    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Folder Button"]').click();
    cy.get('[data-test="New Content Input"]').should(
      "have.value",
      "Untitled Folder",
    );
    cy.get('[data-test="New Content Input"]').type("Folder 1{enter}");
    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");

    cy.log("Rename document");
    cy.get('[data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Rename Menu Item"]').eq(0).click({ force: true });
    cy.get('[data-test="Setting Drawer Header"]').should(
      "contain.text",
      "Document Controls",
    );
    cy.focused().type("Renamed Document{enter}");
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Renamed Document");

    cy.log("Rename problem set");
    cy.get('[data-test="Card Menu Button"]').eq(1).click();
    cy.get('[data-test="Rename Menu Item"]').eq(1).click({ force: true });
    cy.get('[data-test="Setting Drawer Header"]').should(
      "contain.text",
      "Problem Set Controls",
    );
    cy.focused().type("Renamed Problem Set{enter}");
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Renamed Problem Set");

    cy.log("Rename question bank");
    cy.get('[data-test="Card Menu Button"]').eq(2).click();
    cy.get('[data-test="Rename Menu Item"]').eq(2).click({ force: true });
    cy.get('[data-test="Setting Drawer Header"]').should(
      "contain.text",
      "Question Bank Controls",
    );
    cy.focused().type("Renamed Question Bank{enter}");
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Renamed Question Bank");

    cy.log("Rename folder");
    cy.get('[data-test="Card Menu Button"]').eq(3).click();
    cy.get('[data-test="Rename Menu Item"]').eq(3).click({ force: true });
    cy.get('[data-test="Setting Drawer Header"]').should(
      "contain.text",
      "Folder Controls",
    );
    cy.focused().type("Renamed Folder{enter}");
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Renamed Folder");
  });

  it("Move items up and down", () => {
    cy.loginAsTestUser();

    cy.createContent({ name: "Document 1", contentType: "singleDoc" });
    cy.createContent({ name: "Problem Set 1", contentType: "sequence" });
    cy.createContent({ name: "Question Bank 1", contentType: "select" });
    cy.createContent({ name: "Folder 1", contentType: "folder" });

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");

    cy.get('[data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Move Up Menu Item"]').should("not.be.visible");
    cy.get('[data-test="Move Down Menu Item"]').eq(0).click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");

    cy.get('[data-test="Card Menu Button"]').eq(1).click();
    cy.get('[data-test="Move Up Menu Item"]').should("be.visible");
    cy.get('[data-test="Move Down Menu Item"]').eq(1).click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");

    cy.get('[data-test="Card Menu Button"]').eq(3).click();
    cy.get('[data-test="Move Down Menu Item"]').should("not.be.visible");
    cy.get('[data-test="Move Up Menu Item"]').eq(2).click(); // since no Move Up button on first card

    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Document 1");
  });

  it("Duplicate items", () => {
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
            name: "Document FQ21",
            contentType: "singleDoc",
            parentId: selectId,
            doenetML: "Hi FQ21",
          });
        });
      },
    );

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");

    cy.get('[data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Duplicate Content"]').eq(0).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 5);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Copy of Document 1");

    cy.get('[data-test="Card Menu Button"]').eq(3).click();
    cy.get('[data-test="Duplicate Content"]').eq(3).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 6);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Copy of Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Copy of Folder 1");

    cy.get(`[data-test="Content Card"]`).eq(5).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document F1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set F");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document F2");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Question Bank F2");

    cy.get(`[data-test="Content Card"]`).eq(1).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 3);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document FP1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Question Bank FP1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document FPQ11");

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`).eq(3).click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 1);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document FQ21");

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 4);

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 6);

    cy.get('[data-test="Card Menu Button"]').eq(1).click();
    cy.get('[data-test="Duplicate Content"]').eq(1).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 7);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Copy of Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Copy of Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Copy of Problem Set 1");

    cy.get(`[data-test="Content Card"]`).eq(6).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
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

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 7);

    cy.get('[data-test="Card Menu Button"]').eq(2).click();
    cy.get('[data-test="Duplicate Content"]').eq(2).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 8);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Copy of Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Copy of Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Copy of Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(7)
      .should("contain.text", "Copy of Question Bank 1");

    cy.get(`[data-test="Content Card"]`).eq(7).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 1);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document Q1");

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 8);

    cy.get('[data-test="Card Menu Button"]').eq(6).click();
    cy.get('[data-test="Duplicate Content"]').eq(6).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 9);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Copy of Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Copy of Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Copy of Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(7)
      .should("contain.text", "Copy of Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(8)
      .should("contain.text", "Copy of Copy of Problem Set 1");

    cy.get(`[data-test="Content Card"]`).eq(8).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
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
  });

  it("Delete items", () => {
    cy.loginAsTestUser();

    cy.createContent({ name: "Document 1", contentType: "singleDoc" });
    cy.createContent({ name: "Problem Set 1", contentType: "sequence" });
    cy.createContent({ name: "Question Bank 1", contentType: "select" });
    cy.createContent({ name: "Folder 1", contentType: "folder" });

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");

    cy.get('[data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Delete Menu Item"]').eq(0).click();
    cy.get('[data-test="Confirm Delete Message"]').should(
      "have.text",
      "Are you sure want to delete the document: Document 1",
    );
    cy.get('[data-test="Delete Button"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 3);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Folder 1");

    cy.get('[data-test="Card Menu Button"]').eq(1).click();
    cy.get('[data-test="Delete Menu Item"]').eq(1).click();
    cy.get('[data-test="Confirm Delete Message"]').should(
      "have.text",
      "Are you sure want to delete the question bank: Question Bank 1",
    );
    cy.get('[data-test="Cancel Button"]').click();
    cy.get('[data-test="Confirm Delete Message"]').should("not.exist");
    cy.get(`[data-test="Content Card"]`).should("have.length", 3);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Question Bank 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Folder 1");

    cy.get('[data-test="Card Menu Button"]').eq(1).click();
    cy.get('[data-test="Delete Menu Item"]').eq(1).click();
    cy.get('[data-test="Confirm Delete Message"]').should(
      "have.text",
      "Are you sure want to delete the question bank: Question Bank 1",
    );
    cy.get('[data-test="Delete Button"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 2);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Problem Set 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Folder 1");

    cy.get('[data-test="Card Menu Button"]').eq(1).click();
    cy.get('[data-test="Delete Menu Item"]').eq(1).click();
    cy.get('[data-test="Confirm Delete Message"]').should(
      "have.text",
      "Are you sure want to delete the folder: Folder 1",
    );
    cy.get('[data-test="Delete Button"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 1);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Problem Set 1");

    cy.get('[data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Delete Menu Item"]').eq(0).click();
    cy.get('[data-test="Confirm Delete Message"]').should(
      "have.text",
      "Are you sure want to delete the problem set: Problem Set 1",
    );
    cy.get('[data-test="Delete Button"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 0);
  });
});
