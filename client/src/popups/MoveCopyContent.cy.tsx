import { MoveCopyContent } from "./MoveCopyContent";

describe("MoveCopyContent component tests", () => {
  const contentName = "A problem set";
  const contentType = "sequence";
  const contentId = "abc";

  const contentList1 = [
    {
      canOpen: true,
      contentId,
      isAssignment: false,
      name: contentName,
      type: contentType,
    },
    {
      canOpen: true,
      contentId: "def",
      isAssignment: false,
      name: "another problem set",
      type: "sequence",
    },
    {
      canOpen: false,
      contentId: "def2",
      isAssignment: true,
      name: "another problem set - assigned",
      type: "sequence",
    },
    {
      canOpen: true,
      contentId: "hij",
      isAssignment: false,
      name: "Folder 1",
      type: "folder",
    },
  ];

  it("cancel and close buttons calls onClose", () => {
    cy.intercept("/api/copyMove/getMoveCopyContentData/*", {
      parent: null,
      contents: contentList1,
    }).as("getData");

    const onCloseSpy = cy.spy().as("onClose");
    cy.mount(
      <MoveCopyContent
        isOpen={true}
        onClose={onCloseSpy}
        sourceContent={[
          {
            contentId,
            name: contentName,
            type: contentType,
          },
        ]}
        userId={"abc123"}
        currentParentId={null}
        allowedParentTypes={["folder"]}
        action="Move"
      />,
    );

    cy.wait("@getData")
      .its("request.url")
      .should("include", "?allowedParentTypes=folder");

    cy.get("@onClose").should("not.be.called");
    cy.get("[data-test='Cancel Button']").click();
    cy.get("@onClose").should("have.callCount", 1);
    cy.get("[aria-label=Close]").click();
    cy.get("@onClose").should("have.callCount", 2);
  });

  it("link to own content is disabled", () => {
    cy.intercept("/api/copyMove/getMoveCopyContentData/*", {
      parent: null,
      contents: contentList1,
    }).as("getData");

    const onCloseSpy = cy.spy().as("onClose");
    cy.mount(
      <MoveCopyContent
        isOpen={true}
        onClose={onCloseSpy}
        sourceContent={[
          {
            contentId,
            name: contentName,
            type: contentType,
          },
        ]}
        userId={"abc123"}
        currentParentId={null}
        allowedParentTypes={["folder"]}
        action="Move"
      />,
    );

    cy.get('[data-test="Select Item Option"]')
      .eq(0)
      .should("have.text", contentName)
      .should("be.disabled");
  });

  it("items with canOpen=false are disabled", () => {
    cy.intercept("/api/copyMove/getMoveCopyContentData/*", {
      parent: null,
      contents: contentList1,
    }).as("getData");

    const onCloseSpy = cy.spy().as("onClose");
    cy.mount(
      <MoveCopyContent
        isOpen={true}
        onClose={onCloseSpy}
        sourceContent={[
          {
            contentId,
            name: contentName,
            type: contentType,
          },
        ]}
        userId={"abc123"}
        currentParentId={null}
        allowedParentTypes={["folder"]}
        action="Move"
      />,
    );

    cy.get('[data-test="Select Item Option"]')
      .eq(1)
      .should("have.text", "another problem set")
      .should("not.be.disabled");

    cy.get('[data-test="Select Item Option"]')
      .eq(2)
      .should("have.text", "another problem set - assigned")
      .should("be.disabled");

    cy.get('[data-test="Select Item Option"]')
      .eq(3)
      .should("have.text", "Folder 1")
      .should("not.be.disabled");
  });

  it.skip("Selecting an items gives appropriate response");
  it.skip("Execute button is disabled appropriately");
  it.skip("Clicking execute buttons does the right things");
  it.skip("select parent folder does the right thing");
  it.skip("different actions");
});
