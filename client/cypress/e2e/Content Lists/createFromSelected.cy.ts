describe("Create from selected tests", () => {
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
          name: "Document FPQ21",
          contentType: "singleDoc",
          parentId: selectId,
          doenetML: "Hi FPQ21",
        });
      });
    });

    cy.createContent({
      name: "Folder 2",
      contentType: "folder",
      makePublic: true,
    });
  }

  it("Create from My Activities", () => {
    createInitialSetup();

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();

    // Create problem set from Document 1
    cy.log("Create problem set from Document 1");
    cy.get('[data-test="Card Select"]').eq(0).click();
    cy.get('[data-test="Create From Selected Button"]').click();
    cy.get('[data-test="Create Problem Set"]').click();
    cy.get('[data-test="Created Statement"]').should(
      "have.text",
      "Problem set created with 1 item",
    );
    // new items should appear without any refresh
    cy.get(`[data-test="Content Card"]`).should("have.length", 6);
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Untitled Problem Set");

    cy.focused().type("Problem Set With One Document{enter}");

    cy.get(`[data-test="Content Card"]`).should("have.length", 6);
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Problem Set With One Document");

    cy.get('[data-test="Close Button"]').click();
    cy.get('[data-test="Created Statement"]').should("not.exist");

    cy.log("create question bank from document 1 and problem set 1");
    // note: document 1 is still selected

    cy.get('[data-test="Card Select"]').eq(1).click();
    cy.get('[data-test="Create From Selected Button"]').click();
    cy.get('[data-test="Create Question Bank"]').click();
    cy.get('[data-test="Created Statement"]').should(
      "have.text",
      "Question bank created with 4 items",
    );
    // new items should appear without any refresh
    cy.get(`[data-test="Content Card"]`).should("have.length", 7);
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Untitled Question Bank");

    cy.focused().type("Question Bank of 4{enter}");

    cy.get(`[data-test="Content Card"]`).should("have.length", 7);
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Question Bank of 4");

    cy.get('[data-test="Go to Created"]').click();
    cy.get('[data-test="Created Statement"]').should("not.exist");

    cy.get('[data-test="Editable Title"]').should(
      "have.text",
      "Question Bank of 4",
    );
    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Document P1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document PQ11");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Document PQ12");

    cy.log("Verify first problem set was created correctly");
    cy.get('[data-test="Back Link"]').click();
    cy.get('[data-test="Folder Heading"]').should("have.text", "My Activities");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Problem Set With One Document")
      .click();
    cy.get('[data-test="Editable Title"]').should(
      "have.text",
      "Problem Set With One Document",
    );
    cy.get(`[data-test="Content Card"]`).should("have.length", 1);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");

    cy.log("Create folder from folder 1 and question bank 1");
    cy.get('[data-test="Back Link"]').click();
    cy.get('[data-test="Folder Heading"]').should("have.text", "My Activities");
    cy.get(`[data-test="Content Card"]`).should("have.length", 7);
    cy.get('[data-test="Card Select"]').eq(3).click();
    cy.get('[data-test="Card Select"]').eq(2).click();
    cy.get('[data-test="Create From Selected Button"]').click();
    cy.get('[data-test="Create Folder"]').click();
    cy.get('[data-test="Created Statement"]').should(
      "have.text",
      "Folder created with 2 items",
    );
    // new items should appear without any refresh
    cy.get(`[data-test="Content Card"]`).should("have.length", 8);
    cy.get(`[data-test="Content Card"]`)
      .eq(7)
      .should("contain.text", "Untitled Folder");

    cy.focused().type("New Folder{enter}");

    cy.get(`[data-test="Content Card"]`)
      .eq(7)
      .should("contain.text", "New Folder");

    cy.get('[data-test="Go to Created"]').click();
    cy.get('[data-test="Folder Heading"]').should(
      "have.text",
      "Folder: New Folder",
    );
    cy.get(`[data-test="Content Card"]`).should("have.length", 2);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Question Bank 1")
      .click();
    cy.get('[data-test="Editable Title"]').should(
      "have.text",
      "Question Bank 1",
    );
    cy.get(`[data-test="Content Card"]`).should("have.length", 1);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document Q1");

    cy.get('[data-test="Back Link"]').click();
    cy.get('[data-test="Folder Heading"]').should(
      "have.text",
      "Folder: New Folder",
    );
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Folder 1")
      .click();
    cy.get('[data-test="Folder Heading"]').should(
      "have.text",
      "Folder: Folder 1",
    );
    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document F1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set F")
      .click();
    cy.get('[data-test="Editable Title"]').should("have.text", "Problem Set F");
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
    cy.get('[data-test="Folder Heading"]').should(
      "have.text",
      "Folder: Folder 1",
    );
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document F2");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Question Bank F2")
      .click();
    cy.get('[data-test="Editable Title"]').should(
      "have.text",
      "Question Bank F2",
    );
    cy.get(`[data-test="Content Card"]`).should("have.length", 1);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document FPQ21");
  });

  it("Create from Compound Activity Editor", () => {
    createInitialSetup();

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();

    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set 1")
      .click();

    cy.get('[data-test="Editable Title"]').should("have.text", "Problem Set 1");

    // From within problem set 1, create problem set from Question Bank P1.
    // Start by selecting Document PQ12, but it will be ignored when its parent, Question Bank P1, is selected
    cy.get('[data-test="Card Select"]').eq(3).click();
    cy.get('[data-test="Card Select"]').eq(1).click();
    cy.get('[data-test="Create From Selected Button"]').click();
    cy.get('[data-test="Create Problem Set"]').click();
    cy.get('[data-test="Created Statement"]').should(
      "have.text",
      "Problem set created with 1 item",
    );
    cy.focused().type("Set of one bank{enter}");
    cy.get('[data-test="Go to Created"]').click();

    cy.get('[data-test="Editable Title"]').should(
      "have.text",
      "Set of one bank",
    );

    cy.get(`[data-test="Content Card"]`).should("have.length", 3);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Question Bank P1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Document PQ11");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document PQ12");

    cy.get('[data-test="Create From Selected Button"]').should(
      "not.be.visible",
    );
  });

  it("Create from Explore", () => {
    createInitialSetup();

    cy.getUserInfo().then((user) => {
      cy.loginAsTestUser();

      cy.log("Go to explore page filtered by owner of initial content created");
      cy.visit(`/explore?author=${user.userId}`);

      cy.log(
        "Copy Document FPQ21, Question Bank F2 and Problem Set 1 into new Problem Set",
      );
      cy.get('[data-test="Content List"] [data-test="Card Select"]')
        .eq(1)
        .click();
      cy.get('[data-test="Content List"] [data-test="Card Select"]')
        .eq(16)
        .click();
      cy.get('[data-test="Content List"] [data-test="Card Select"]')
        .eq(2)
        .click();

      cy.get('[data-test="Create From Selected Button"]').click();
      cy.get('[data-test="Create Problem Set"]').click();
      cy.get('[data-test="Created Statement"]').should(
        "have.text",
        "Problem set created with 4 items",
      );
      cy.focused().type("New problem set{enter}");
      cy.get('[data-test="Go to Created"]').click();

      cy.get('[data-test="Editable Title"]').should(
        "have.text",
        "New problem set",
      );

      cy.get(`[data-test="Content Card"]`).should("have.length", 7);
      cy.get(`[data-test="Content Card"]`)
        .eq(0)
        .should("contain.text", "Document FPQ21");
      cy.get(`[data-test="Content Card"]`)
        .eq(1)
        .should("contain.text", "Question Bank F2");
      cy.get(`[data-test="Content Card"]`)
        .eq(2)
        .should("contain.text", "Document FPQ21");
      cy.get(`[data-test="Content Card"]`)
        .eq(3)
        .should("contain.text", "Document P1");
      cy.get(`[data-test="Content Card"]`)
        .eq(4)
        .should("contain.text", "Question Bank P1");
      cy.get(`[data-test="Content Card"]`)
        .eq(5)
        .should("contain.text", "Document PQ11");
      cy.get(`[data-test="Content Card"]`)
        .eq(6)
        .should("contain.text", "Document PQ12");

      cy.get('[data-test="Back Link"]').click();

      cy.get('[data-test="Folder Heading"]').should(
        "have.text",
        "My Activities",
      );
    });
  });

  it("Create from Shared Activities", () => {
    createInitialSetup();

    cy.getUserInfo().then((user) => {
      cy.loginAsTestUser();

      cy.log("Go to explore page filtered by owner of initial content created");
      cy.visit(`/explore?author=${user.userId}`);

      cy.log(
        "Copy Document F1 and Document F2 from Folder 1 into new Question Bank",
      );

      cy.get(`[data-test="Content List"] [data-test="Content Card"]`)
        .eq(9)
        .should("contain.text", "Folder 1")
        .click();

      cy.get('[data-test="Folder Heading"]').should(
        "have.text",
        "Folder: Folder 1",
      );

      cy.get('[data-test="Card Select"]').eq(0).click();
      cy.get('[data-test="Card Select"]').eq(2).click();

      cy.get('[data-test="Create From Selected Button"]').click();
      cy.get('[data-test="Create Question Bank"]').click();
      cy.get('[data-test="Created Statement"]').should(
        "have.text",
        "Question bank created with 2 items",
      );
      cy.focused().type("Bank of two{enter}");
      cy.get('[data-test="Go to Created"]').click();

      cy.get('[data-test="Editable Title"]').should("have.text", "Bank of two");

      cy.get(`[data-test="Content Card"]`).should("have.length", 2);
      cy.get(`[data-test="Content Card"]`)
        .eq(0)
        .should("contain.text", "Document F1");
      cy.get(`[data-test="Content Card"]`)
        .eq(1)
        .should("contain.text", "Document F2");

      cy.get('[data-test="Back Link"]').click();

      cy.get('[data-test="Folder Heading"]').should(
        "have.text",
        "My Activities",
      );
    });
  });
});
