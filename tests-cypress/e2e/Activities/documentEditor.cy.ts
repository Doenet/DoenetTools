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

      cy.iframe()
        .find(".doenet-viewer")
        .should("contain.text", `Initial content`);

      cy.iframe().find(".cm-activeLine").type("{enter}");
      cy.iframe().find(".cm-activeLine").invoke("text", "More!");

      cy.get(`[data-test="View Mode Button"]`).click();
      cy.wait(1000);

      cy.iframe().find(".cm-editor").should("not.exist");

      cy.iframe()
        .find(".doenet-viewer")
        .should("contain.text", `Initial content\nMore!`);

      cy.get(`[data-test="Edit Mode Button"]`).click();

      cy.iframe()
        .find(".cm-editor")
        .should("contain.text", "Initial contentMore!");

      cy.iframe()
        .find(".doenet-viewer")
        .should("contain.text", `Initial content\nMore!`);
    });
  });
});
