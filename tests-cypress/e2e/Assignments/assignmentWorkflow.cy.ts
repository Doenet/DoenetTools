import { UserInfo } from "@doenet-tools/client/src/types";
import { toMathJaxString } from "@doenet-tools/shared";

describe("Assignment workflow Tests", function () {
  it("instructor creates assignment, anonymous user takes it, instructor views data", () => {
    const code = Date.now().toString();
    const instructorEmail = `test${code}@doenet.org`;
    cy.loginAsTestUser({
      isAuthor: true,
      email: instructorEmail,
      firstNames: "Instructor",
      lastNames: "One",
    });

    let classCode: number | null = null;
    let studentUser: UserInfo | null = null;
    let studentUser2: UserInfo | null = null;

    // Instructor creates document
    cy.visit("/");
    cy.get('[data-test="Activities"]').click();
    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Document Button"]').click();

    // change title
    cy.get('[data-test="Editable Title"]').should(
      "have.text",
      "Untitled Document",
    );
    cy.get('[data-test="Editable Title"]').type("Assignment{enter}");

    // add answer blank
    cy.iframe()
      .find(".cm-activeLine")
      .type('<m>x+x =</m> <answer name="ans">2x</answer>{enter}');

    cy.iframe().find('[data-test="Viewer Update Button"]').click();

    cy.iframe()
      .find(".doenet-viewer")
      .should("contain.text", toMathJaxString("x+x ="));

    // increase number of attempts to 3
    cy.get('[data-test="Settings Button"]').click();
    cy.get('[data-test="max-attempts-input"] input').type(
      "{selectall}3{enter}",
    );

    cy.get('[data-test="Edit Mode Button"]').click();
    // wait for MathJax to have rendered
    cy.iframe()
      .find(".doenet-viewer")
      .should("contain.text", toMathJaxString("x+x ="));

    cy.reload();

    // wait for MathJax to have rendered
    cy.iframe()
      .find(".doenet-viewer")
      .should("contain.text", toMathJaxString("x+x ="));

    // Create an assignment from the document
    cy.get('[data-test="Create Assignment"]').click();

    // Verify number of attempts is still 3
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "3");

    // Confirm create assignment
    cy.get('[data-test="Confirm Create Assignment"]').click();

    // Save in My Activities
    cy.get('[data-test="Execute MoveCopy Button"]').click();

    // Navigate to My Activities to find assignment
    cy.get('[data-test="Activities"]').click();
    cy.get(`[data-test="Content Card"]`).eq(1).click();
    cy.get('[data-test="Class Code"]')
      .invoke("text")
      .then((text) => {
        classCode = parseInt(text);
      });

    // Log in as anonymous user to take assignment
    cy.loginAsTestUser({
      isAnonymous: true,
    });

    cy.getUserInfo().then((user) => {
      studentUser = user;

      // Visit assignment
      cy.visit(`/code/${classCode}`);

      // Verify have 3 attempts (i.e., 2 left after initial)
      cy.get("#viewer-container").find("button").first().contains("2 left");

      // Submit an incorrect answer for this attempt
      cy.iframe()
        .find(".doenet-viewer #ans textarea")
        .type("3x{enter}", { force: true });

      cy.iframe()
        .find(".doenet-viewer #ans .mq-editable-field")
        .should("contain.text", "3x");

      // Get a new attempt
      cy.get("#viewer-container").find("button").first().click();
      cy.get("#viewer-container").find("button").first().contains("1 left");

      // Wait so that don't get element that will be removed
      cy.wait(500);

      // Verify answer is now blank
      cy.iframe()
        .find(".doenet-viewer #ans .mq-editable-field")
        .should("not.contain.text", "3x");

      // Submit an incorrect answer at first
      cy.iframe()
        .find(".doenet-viewer #ans textarea")
        .type("4x{enter}", { force: true });

      cy.iframe()
        .find(".doenet-viewer #ans .mq-editable-field")
        .should("contain.text", "4x");

      // Then submit a correct answer
      cy.iframe()
        .find(".doenet-viewer #ans textarea")
        .type("{end}{backspace}{backspace}2x{enter}", { force: true });

      cy.iframe()
        .find(".doenet-viewer #ans .mq-editable-field")
        .should("not.contain.text", "4x");

      cy.iframe()
        .find(".doenet-viewer #ans .mq-editable-field")
        .should("contain.text", "2x");

      // Get third and final attempt
      cy.get("#viewer-container").find("button").first().click();
      cy.get("#viewer-container")
        .find("button")
        .first()
        .should("be.disabled")
        .contains("0 left");

      // Wait so that don't get element that will be removed
      cy.wait(500);

      // Verify answer is now blank
      cy.iframe()
        .find(".doenet-viewer #ans .mq-editable-field")
        .should("not.contain.text", "2x");

      // Submit an incorrect answer
      cy.iframe()
        .find(".doenet-viewer #ans textarea")
        .type("5x{enter}", { force: true });

      cy.iframe()
        .find(".doenet-viewer #ans .mq-editable-field")
        .should("contain.text", "5x");
    });

    // Log in as second anonymous user to take assignment
    cy.loginAsTestUser({
      isAnonymous: true,
    });

    cy.getUserInfo().then((user) => {
      studentUser2 = user;

      // Visit assignment
      cy.visit(`/code/${classCode}`);

      // Verify have 3 attempts (i.e., 2 left after initial)
      cy.get("#viewer-container").find("button").first().contains("2 left");

      // Submit an incorrect answer for this attempt
      cy.iframe()
        .find(".doenet-viewer #ans textarea")
        .type("6x{enter}", { force: true });

      cy.iframe()
        .find(".doenet-viewer #ans .mq-editable-field")
        .should("contain.text", "6x");
    });

    // Log back in as instructor to view data
    cy.loginAsTestUser({
      email: instructorEmail,
    }).then(() => {
      // make asynchronous so that can access studentUser and classCode

      cy.visit("/");
      // Navigate to My Activities to find assignment
      cy.get('[data-test="Activities"]').click();
      cy.get(`[data-test="Content Card"]`).eq(1).click();

      cy.get(`td:contains("${studentUser!.lastNames}")`).click();

      cy.get('[data-test="Title"]').should("contain.text", `Student Summary`);
      cy.get('[data-test="Student Select"]').should(
        "have.value",
        `${studentUser!.userId}`,
      );

      cy.get('[data-test="Overall Score"]').should("contain.text", `100`);

      cy.get('[data-test="Attempt Number 1"]').should("contain.text", "1");
      cy.get('[data-test="Attempt Total 1"]').should("contain.text", "0");

      cy.get('[data-test="Attempt Number 2"]').should("contain.text", "2");
      cy.get('[data-test="Attempt Total 2"]').should("contain.text", "100");

      cy.get('[data-test="Attempt Number 3"]').should("contain.text", "3");
      cy.get('[data-test="Attempt Total 3"]').should("contain.text", "0");

      cy.get('[data-test="Attempt Total 2"]').click();

      cy.get('[data-test="Title"]').should("contain.text", `Item Details`);

      cy.iframe()
        .find(".doenet-viewer #ans .mq-editable-field")
        .should("contain.text", "2x");

      cy.get('[data-test="Attempt Select"]').select("3");

      cy.wait(500); // wait for iframe to update
      cy.iframe()
        .find(".doenet-viewer #ans .mq-editable-field")
        .should("contain.text", "5x");

      // switch to second student
      cy.get('[data-test="Student Select"]').select(
        `${studentUser2!.lastNames}`,
      );

      cy.get('[data-test="Attempt Select"]').should("have.value", `1`);

      cy.wait(500); // wait for iframe to update
      cy.iframe()
        .find(".doenet-viewer #ans .mq-editable-field")
        .should("contain.text", "6x");

      cy.get('[data-test="Back Link"]').click();

      cy.get('[data-test="Title"]').should("contain.text", `Student Summary`);
      cy.get('[data-test="Student Select"]').select(
        `${studentUser2!.lastNames}`,
      );

      cy.get('[data-test="Overall Score"]').should("contain.text", `0`);

      cy.get('[data-test="Back Link"]').click();

      // Download scores CSV and verify contents
      cy.get('[data-test="Download Scores Button"]').click();

      cy.readFile(`cypress/downloads/Scores for Assignment.csv`).then(
        (fileContent) => {
          expect(fileContent).to.include(
            `"${studentUser!.lastNames}","${studentUser!.userId}",100`,
          );
          expect(fileContent).to.include(
            `"${studentUser2!.lastNames}","${studentUser2!.userId}",0`,
          );
        },
      );
    });
  });
});
