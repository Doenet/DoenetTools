describe("Activity Editor Tests", function () {
  it("correctly restore editor state after clicking view", () => {
    // test bug where activity editor was not restoring itself with the correct state
    // after one switched to view mode and back

    cy.loginAsTestUser();

    cy.createActivity({
      activityName: "Hello!",
      doenetML: "Initial content",
    }).then((contentId) => {
      cy.visit(`/activityEditor/${contentId}`);

      cy.iframe()
        .find(".doenet-viewer")
        .should("contain.text", `Initial content`);

      cy.iframe().find(".cm-editor").type(`{end}{enter}More!`);

      cy.get(`[data-test="View Mode Button"]`).click();

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
