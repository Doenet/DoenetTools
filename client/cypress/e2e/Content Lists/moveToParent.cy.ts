describe("Move to parent tests", () => {
  it("Move items to parents", () => {
    cy.loginAsTestUser();

    cy.createContent({ name: "Document 1", contentType: "singleDoc" });
    cy.createContent({ name: "Problem Set", contentType: "sequence" }).then(
      (sequenceId) => {
        cy.createContent({
          name: "Document P1",
          contentType: "singleDoc",
          parentId: sequenceId,
        });
        cy.createContent({
          name: "Question Bank P",
          contentType: "select",
          parentId: sequenceId,
        });
        cy.createContent({
          name: "Document P2",
          contentType: "singleDoc",
          parentId: sequenceId,
        });
      },
    );
    cy.createContent({ name: "Document 2", contentType: "singleDoc" });
    cy.createContent({ name: "Question Bank", contentType: "select" }).then(
      (selectId) => {
        cy.createContent({
          name: "Document Q1",
          contentType: "singleDoc",
          parentId: selectId,
        });
      },
    );
    cy.createContent({ name: "Document 3", contentType: "singleDoc" });
    cy.createContent({ name: "Folder 1", contentType: "folder" }).then(
      (folderId) => {
        cy.createContent({
          name: "Document F1",
          contentType: "singleDoc",
          parentId: folderId,
        });
        cy.createContent({
          name: "Problem Set F",
          contentType: "sequence",
          parentId: folderId,
        });
        cy.createContent({
          name: "Document F2",
          contentType: "singleDoc",
          parentId: folderId,
        });
        cy.createContent({
          name: "Question Bank F",
          contentType: "select",
          parentId: folderId,
        });
        cy.createContent({
          name: "Document F3",
          contentType: "singleDoc",
          parentId: folderId,
        });
        cy.createContent({
          name: "Folder F",
          contentType: "folder",
          parentId: folderId,
        });
        cy.createContent({
          name: "Document F4",
          contentType: "singleDoc",
          parentId: folderId,
        });
      },
    );
    cy.createContent({ name: "Document 4", contentType: "singleDoc" });
    cy.createContent({ name: "Folder 2", contentType: "folder" }).then(
      (folderId) => {
        cy.createContent({
          name: "Problem Set F2",
          contentType: "sequence",
          parentId: folderId,
        });
      },
    );

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 8);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document 2");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Question Bank");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Document 3");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Document 4");
    cy.get(`[data-test="Content Card"]`)
      .eq(7)
      .should("contain.text", "Folder 2");

    // Move Document 1 into Problem Set
    cy.log("Move Document 1 into Problem Set");
    cy.get('[data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Move to Parent"]').eq(0).click();

    cy.get('[data-test="MoveCopy Heading 2"]').should(
      "have.text",
      "Document 1",
    );

    cy.get('[data-test="Select Item Option"]').should("have.length", 8);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Question Bank")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Folder 1")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(3)
      .should("have.text", "Folder 2")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(4)
      .should("have.text", "Document 1")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(5)
      .should("have.text", "Document 2")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(6)
      .should("have.text", "Document 3")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(7)
      .should("have.text", "Document 4")
      .should("be.disabled");

    cy.get('[data-test="Select Item Option"]').eq(0).click();
    cy.get('[data-test="Current destination"]').should(
      "have.text",
      "Problem Set",
    );
    cy.get('[data-test="Select Item Option"]').should("have.length", 3);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Question Bank P")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Document P1")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Document P2")
      .should("be.disabled");

    cy.get('[data-test="Select Item Option"]').eq(0).click();
    cy.get('[data-test="Current destination"]').should(
      "have.text",
      "Question Bank P",
    );
    cy.get('[data-test="Select Item Option"]').should("have.length", 0);

    cy.get('[data-test="Back Arrow"]').click();
    cy.get('[data-test="Current destination"]').should(
      "have.text",
      "Problem Set",
    );
    cy.get('[data-test="Select Item Option"]').should("have.length", 3);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Question Bank P")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Document P1")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Document P2")
      .should("be.disabled");

    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "1 item moved to: Problem Set",
    );
    cy.get('[data-test="Go to Destination"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document P1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Question Bank P");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document P2");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Document 1");

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 7);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Problem Set");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Document 2");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Document 3");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Document 4");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Folder 2");

    // Move Problem Set into Folder 1
    cy.log("Move Problem Set into Folder 1");
    cy.get('[data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Move to Parent"]').eq(0).click();

    cy.get('[data-test="MoveCopy Heading 2"]').should(
      "have.text",
      "Problem Set",
    );

    cy.get('[data-test="Select Item Option"]').should("have.length", 7);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Question Bank")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Folder 1")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(3)
      .should("have.text", "Folder 2")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(4)
      .should("have.text", "Document 2")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(5)
      .should("have.text", "Document 3")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(6)
      .should("have.text", "Document 4")
      .should("be.disabled");

    cy.get('[data-test="Select Item Option"]').eq(2).click();
    cy.get('[data-test="Current destination"]').should("have.text", "Folder 1");
    cy.get('[data-test="Select Item Option"]').should("have.length", 7);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set F")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Question Bank F")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Folder F")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(3)
      .should("have.text", "Document F1")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(4)
      .should("have.text", "Document F2")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(5)
      .should("have.text", "Document F3")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(6)
      .should("have.text", "Document F4")
      .should("be.disabled");

    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "1 item moved to: Folder 1",
    );
    cy.get('[data-test="Close Button"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 6);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 2");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Question Bank");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document 3");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Document 4");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Folder 2");

    cy.get(`[data-test="Content Card"]`).eq(3).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 8);
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
      .should("contain.text", "Question Bank F");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Document F3");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Folder F");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Document F4");
    cy.get(`[data-test="Content Card"]`)
      .eq(7)
      .should("contain.text", "Problem Set");

    cy.get(`[data-test="Content Card"]`).eq(7).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document P1");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Question Bank P");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document P2");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Document 1");

    // Move Question Bank P to base folder
    cy.log("Question Bank P to base folder");
    cy.get('[data-test="Card Menu Button"]').eq(1).click();
    cy.get('[data-test="Move to Parent"]').eq(1).click();

    cy.get('[data-test="MoveCopy Heading 2"]').should(
      "have.text",
      "Question Bank P",
    );
    cy.get('[data-test="Current destination"]').should(
      "have.text",
      "Problem Set",
    );

    cy.get('[data-test="Select Item Option"]').should("have.length", 4);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Question Bank P")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Document P1")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Document P2")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(3)
      .should("have.text", "Document 1")
      .should("be.disabled");

    cy.get('[data-test="Back Arrow"]').click();
    cy.get('[data-test="Current destination"]').should("have.text", "Folder 1");

    cy.get('[data-test="Back Arrow"]').click();
    cy.get('[data-test="Current destination"]').should(
      "have.text",
      "My Activities",
    );

    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "1 item moved to: My Activities",
    );
    cy.get('[data-test="Go to Destination"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 7);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 2");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Question Bank");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document 3");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Document 4");
    cy.get(`[data-test="Content Card"]`)
      .eq(5)
      .should("contain.text", "Folder 2");
    cy.get(`[data-test="Content Card"]`)
      .eq(6)
      .should("contain.text", "Question Bank P");

    // Move Document 3 and Question Bank to Folder 2
    cy.log("Move Document 3 and Question Bank to Folder 2");
    cy.get('[data-test="Card Menu Button"]').eq(2).click();
    cy.get('[data-test="Move to Parent"]').eq(2).click();
    cy.get('[data-test="Select Item Option"]').eq(2).click();
    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "1 item moved to: Folder 2",
    );
    cy.get('[data-test="Close Button"]').click();

    cy.get('[data-test="Card Menu Button"]').eq(1).click();
    cy.get('[data-test="Move to Parent"]').eq(1).click();
    cy.get('[data-test="Select Item Option"]').eq(2).click();
    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "1 item moved to: Folder 2",
    );
    cy.get('[data-test="Go to Destination"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 3);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Problem Set F2");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Document 3");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank");

    cy.get(`[data-test="Content Card"]`).eq(2).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 1);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document Q1");

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 3);

    cy.get('[data-test="Back Link"]').click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 5);

    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document 2");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Document 4");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 2");
    cy.get(`[data-test="Content Card"]`)
      .eq(4)
      .should("contain.text", "Question Bank P");

    // Move Folder 1 to Folder 2
    cy.log("Move Folder 1 to Folder 2");
    cy.get('[data-test="Card Menu Button"]').eq(1).click();
    cy.get('[data-test="Move to Parent"]').eq(1).click();
    cy.get('[data-test="Select Item Option"]').should("have.length", 5);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Folder 1")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Folder 2")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Question Bank P")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(3)
      .should("have.text", "Document 2")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(4)
      .should("have.text", "Document 4")
      .should("be.disabled");

    cy.get('[data-test="Select Item Option"]').eq(1).click();
    cy.get('[data-test="Select Item Option"]').should("have.length", 3);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set F2")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Question Bank")
      .should("be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "Document 3")
      .should("be.disabled");

    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "1 item moved to: Folder 2",
    );
    cy.get('[data-test="Go to Destination"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 4);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Problem Set F2");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Document 3");
    cy.get(`[data-test="Content Card"]`)
      .eq(2)
      .should("contain.text", "Question Bank");
    cy.get(`[data-test="Content Card"]`)
      .eq(3)
      .should("contain.text", "Folder 1");
    cy.get(`[data-test="Content Card"]`).eq(3).click();
    cy.get(`[data-test="Content Card"]`).should("have.length", 8);
  });

  it("Move item to shared parent", () => {
    cy.loginAsTestUser();

    cy.createContent({ name: "Document", contentType: "singleDoc" });
    cy.createContent({
      name: "Problem Set",
      contentType: "sequence",
      makePublic: true,
    });

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 2);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document");
    cy.get(`[data-test="Content Card"]`)
      .eq(1)
      .should("contain.text", "Problem Set");

    // Move Document into Problem Set
    cy.log("Move Document 1 into Problem Set");
    cy.get('[data-test="Card Menu Button"]').eq(0).click();
    cy.get('[data-test="Move to Parent"]').eq(0).click();

    cy.get('[data-test="Select Item Option"]').should("have.length", 2);
    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", "Problem Set")
      .should("not.be.disabled");
    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "Document")
      .should("be.disabled");

    cy.get('[data-test="Select Item Option"]').eq(0).click();
    cy.get('[data-test="Select Item Option"]').should("have.length", 0);

    cy.get('[data-test="Empty Message"]').should(
      "have.text",
      "This item is empty.",
    );
    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="Confirm Header"]').should(
      "contain.text",
      "Confirm move to shared parent",
    );
    cy.get('[data-test="Confirm Body"]').should(
      "contain.text",
      "The target locationProblem Setis shared.",
    );
    cy.get('[data-test="Confirm Body"]').should(
      "contain.text",
      "Moving here will share the content with the same people.",
    );

    cy.get('[data-test="Back Button"]').click();
    cy.get('[data-test="Confirm Header"]').should("not.exist");
    cy.get('[data-test="Execute MoveCopy Button"]').click();
    cy.get('[data-test="Confirm Header"]').should(
      "contain.text",
      "Confirm move to shared parent",
    );
    cy.get('[data-test="Confirm Button"]').click();

    cy.get('[data-test="MoveCopy Body"]').should(
      "have.text",
      "1 item moved to: Problem Set",
    );

    cy.get('[data-test="Go to Destination"]').click();

    cy.get(`[data-test="Content Card"]`).should("have.length", 1);
    cy.get(`[data-test="Content Card"]`)
      .eq(0)
      .should("contain.text", "Document");
  });
});
