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
      cy.iframe().find(".doenet-viewer", { timeout: 10000 });
      cy.iframe()
        .find(".doenet-viewer")
        .should("contain.text", `Initial content`);

      cy.iframe().find(".cm-activeLine").type("{enter}More!");
      cy.wait(100);

      // Switch to view mode
      cy.get(`[data-test="View Mode Button"]`).click();
      cy.wait(1000);

      // Verify editor is hidden
      cy.iframe().find(".cm-editor").should("not.exist");

      // Verify viewer shows updated content - separate queries
      cy.iframe()
        .find(".doenet-viewer")
        .should("contain.text", `Initial content`);
      cy.iframe().find(".doenet-viewer").should("contain.text", `More!`);

      // Switch back to edit mode
      cy.get(`[data-test="Edit Mode Button"]`).click();
      cy.wait(500);

      // Verify editor is back - separate queries
      cy.iframe().find(".cm-editor").should("contain.text", "Initial content");
      cy.iframe().find(".cm-editor").should("contain.text", "More!");

      // Verify viewer still shows content - separate queries
      cy.iframe()
        .find(".doenet-viewer")
        .should("contain.text", `Initial content`);
      cy.iframe().find(".doenet-viewer").should("contain.text", `More!`);
    });
  });
});
