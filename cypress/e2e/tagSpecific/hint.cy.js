import { cesc } from "../../../../src/utils/url";

describe("Hints Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("hints with and without title", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <hint name="hint1">
        <p name="p1">Hello</p>
      </hint>
    
      <hint name="hint2">
        <title>Hint 2</title>
        <p name="p2">Good day!</p>
      </hint>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint",
    );
    cy.get(cesc("#\\/hint2") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint 2",
    );

    cy.get(cesc("#\\/p1")).should("not.exist");
    cy.get(cesc("#\\/_title1")).should("have.text", "Hint 2");
    cy.get(cesc("#\\/p2")).should("not.exist");

    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").click();
    cy.get(cesc("#\\/p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/p2")).should("not.exist");
    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint",
    );
    cy.get(cesc("#\\/hint2") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint 2",
    );
    cy.get(cesc("#\\/_title1")).should("have.text", "Hint 2");

    cy.get(cesc("#\\/hint2") + " [data-test=hint-heading]").click();
    cy.get(cesc("#\\/p2")).should("have.text", "Good day!");
    cy.get(cesc("#\\/p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint",
    );
    cy.get(cesc("#\\/hint2") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint 2",
    );
    cy.get(cesc("#\\/_title1")).should("have.text", "Hint 2");

    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").click();
    cy.get(cesc("#\\/p1")).should("not.exist");
    cy.get(cesc("#\\/p2")).should("have.text", "Good day!");
    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint",
    );
    cy.get(cesc("#\\/hint2") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint 2",
    );
    cy.get(cesc("#\\/_title1")).should("have.text", "Hint 2");

    cy.get(cesc("#\\/hint2") + " [data-test=hint-heading]").click();
    cy.get(cesc("#\\/p1")).should("not.exist");
    cy.get(cesc("#\\/p2")).should("not.exist");
    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint",
    );
    cy.get(cesc("#\\/hint2") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint 2",
    );
    cy.get(cesc("#\\/_title1")).should("have.text", "Hint 2");
  });

  it("copy and overwrite title", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <hint name="hint1" newNamespace>
        <title>Hint 1</title>
        <p name="p1">Hello</p>
      </hint>
    
      <hint name="revised" copySource="hint1" newNamespace>
        <title>Hint 2</title>
        <p name="p2">Good day!</p>
      </hint>

      <p>Title of original hint: <text copySource="hint1.title" name="title1" /></p>
      <p>Title of revised hint: <text copySource="revised.title" name="title2" /></p>
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint 1",
    );
    cy.get(cesc("#\\/revised") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint 2",
    );
    cy.get(cesc("#\\/title1")).should("have.text", "Hint 1");
    cy.get(cesc("#\\/title2")).should("have.text", "Hint 2");
    cy.get(cesc("#\\/hint1\\/_title1")).should("have.text", "Hint 1");
    cy.get(cesc("#\\/hint1\\/p1")).should("not.exist");
    cy.get(cesc("#\\/revised\\/_title1")).should("not.exist");
    cy.get(cesc("#\\/revised\\/_title2")).should("have.text", "Hint 2");
    cy.get(cesc("#\\/revised\\/p2")).should("not.exist");

    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").click();
    cy.get(cesc("#\\/hint1\\/p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/revised\\/p1")).should("not.exist");
    cy.get(cesc("#\\/revised\\/p2")).should("not.exist");
    cy.get(cesc("#\\/hint1\\/_title1")).should("have.text", "Hint 1");
    cy.get(cesc("#\\/revised\\/_title1")).should("not.exist");
    cy.get(cesc("#\\/revised\\/_title2")).should("have.text", "Hint 2");

    cy.get(cesc("#\\/revised") + " [data-test=hint-heading]").click();
    cy.get(cesc("#\\/revised\\/p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/revised\\/p2")).should("have.text", "Good day!");
    cy.get(cesc("#\\/hint1\\/p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/hint1\\/_title1")).should("have.text", "Hint 1");
    cy.get(cesc("#\\/revised\\/_title1")).should("not.exist");
    cy.get(cesc("#\\/revised\\/_title2")).should("have.text", "Hint 2");

    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").click();
    cy.get(cesc("#\\/hint1\\/p1")).should("not.exist");
    cy.get(cesc("#\\/revised\\/p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/revised\\/p2")).should("have.text", "Good day!");
    cy.get(cesc("#\\/hint1\\/_title1")).should("have.text", "Hint 1");
    cy.get(cesc("#\\/revised\\/_title1")).should("not.exist");
    cy.get(cesc("#\\/revised\\/_title2")).should("have.text", "Hint 2");

    cy.get(cesc("#\\/revised") + " [data-test=hint-heading]").click();
    cy.get(cesc("#\\/revised\\/p1")).should("not.exist");
    cy.get(cesc("#\\/revised\\/p2")).should("not.exist");
    cy.get(cesc("#\\/hint1\\/p1")).should("not.exist");
    cy.get(cesc("#\\/hint1\\/_title1")).should("have.text", "Hint 1");
    cy.get(cesc("#\\/revised\\/_title1")).should("not.exist");
    cy.get(cesc("#\\/revised\\/_title2")).should("have.text", "Hint 2");
  });

  it("Can open hint in read only mode", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_readOnly").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <hint name="hint1">
        <title>Hello</title>
        <p>Content</p>
      </hint>

      <p><textinput name="ti" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hello",
    );

    cy.get(cesc("#\\/_p1")).should("not.exist");
    cy.get(cesc("#\\/ti_input")).should("be.disabled");

    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").click();
    cy.get(cesc("#\\/_p1")).should("have.text", "Content");

    cy.get(cesc("#\\/hint1") + " [data-test=hint-heading]").click();
    cy.get(cesc("#\\/_p1")).should("not.exist");
  });
});
