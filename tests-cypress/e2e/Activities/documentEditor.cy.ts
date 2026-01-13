describe("Activity Editor Tests", function () {
  it("correctly restore editor state after clicking view", () => {
    // test bug where activity editor was not restoring itself with the correct state
    // after one switched to view mode and back

    cy.loginAsTestUser({ isAuthor: true });

    cy.createContent({
      name: "Hello!",
      doenetML: "Initial content",
    }).then((activityId) => {
      cy.visit(`/documentEditor/${activityId}/edit`);

      // Wait for viewer to display initial content
      cy.iframe()
        .find(".doenet-viewer")
        .should("contain.text", `Initial content`);

      // Edit the content - break up command chain to avoid detached DOM issues
      cy.iframe().find(".cm-activeLine").as("activeLine");
      cy.get("@activeLine").type("{enter}");

      // Wait a moment for editor to settle, then re-query the active line
      cy.wait(300);
      cy.iframe().find(".cm-activeLine").invoke("text", "More!");

      // Switch to view mode
      cy.get(`[data-test="View Mode Button"]`).click();
      cy.wait(1000);

      // Verify editor is hidden and viewer shows updated content
      cy.iframe().find(".cm-editor").should("not.exist");
      cy.iframe().find(".doenet-viewer").as("viewer");
      cy.get("@viewer").should("contain.text", `Initial content`);
      cy.get("@viewer").should("contain.text", `More!`);

      // Switch back to edit mode
      cy.get(`[data-test="Edit Mode Button"]`).click();

      // Verify editor is back and shows content, then separately verify viewer
      cy.iframe().find(".cm-editor").as("editor");
      cy.get("@editor").should("contain.text", "Initial content");
      cy.get("@editor").should("contain.text", "More!");

      cy.iframe().find(".doenet-viewer").as("viewerAgain");
      cy.get("@viewerAgain").should("contain.text", `Initial content`);
      cy.get("@viewerAgain").should("contain.text", `More!`);
    });
  });
});
