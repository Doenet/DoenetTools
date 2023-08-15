import { cesc2 } from "../../../../src/utils/url";

describe("ContentBrowser Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("Empty contentbrowser", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <contentBrowser>
        </contentBrowser>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=initials]").should(
      "have.text",
      "Filter by: ",
    );

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .should("not.exist");
  });

  it("Basic example", () => {
    let doenetML = `
    <contentBrowser>
      <contentBrowserItem label="p">
        <p name="pp1">The <tag>p</tag> is simple.</p>
        <p name="pp2">Hello!</p>
      </contentBrowserItem>
      <contentBrowserItem label="mathInput">
        <title>The <tag>mathInput</tag> component</title>
        <p name="mathinputp1">The <tag>mathInput</tag> let's you input math, but we don't have a video.</p>
        <p name="mathinputp2">Here is a mathInput: <mathInput prefill="x+x"/></p>
      </contentBrowserItem>
      <contentBrowserItem label="math">
        <title>The <tag>math</tag> component</title>
        <div>
          <p name="mathp1">The <tag>math</tag> does math.</p>
          <video youtube="tJ4ypc5L6uU" name="mathv" />
        </div>
        <p name="mathp2">Here is a math: <math>x+x</math></p>
      </contentBrowserItem>
      <contentBrowserItem>
        <title>Forgot a label</title>
        <p name="pUnlabeled">This item does not have a label.</p>
      </contentBrowserItem>

    </contentBrowser>
`;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=initials]").should(
      "have.text",
      "Filter by: MPU",
    );

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(0)
      .should("have.text", "math");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(1)
      .should("have.text", "mathInput");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(2)
      .should("not.exist");

    cy.log("start with math selected");
    cy.get(cesc2("#/_title2")).should("have.text", "The <math> component");

    cy.get(cesc2("#/mathp1")).should("have.text", "The <math> does math.");

    cy.get(cesc2("#/mathv"))
      .invoke("attr", "src")
      .then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true));

    cy.get(cesc2("#/mathp2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");

    cy.get(cesc2("#/mathinputp1")).should("not.exist");
    cy.get(cesc2("#/mathinputp2")).should("not.exist");
    cy.get(cesc2("#/pp1")).should("not.exist");
    cy.get(cesc2("#/pp2")).should("not.exist");

    cy.log("make sure mathinput and p paragraphs were not even created");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mathp1"].stateValues.text).eq(
        "The <math> does math.",
      );
      expect(stateVariables["/mathp2"].stateValues.text).eq(
        "Here is a math: x + x",
      );
      expect(stateVariables["/mathinputp1"]).eq(undefined);
      expect(stateVariables["/mathinputp2"]).eq(undefined);
      expect(stateVariables["/pp1"]).eq(undefined);
      expect(stateVariables["/pp2"]).eq(undefined);
    });

    cy.log("select mathinput");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(1)
      .click();

    cy.get(cesc2("#/_title1")).should("have.text", "The <mathInput> component");
    cy.get(cesc2("#/_title2")).should("not.exist");

    cy.get(cesc2("#/mathinputp1")).should(
      "have.text",
      "The <mathInput> let's you input math, but we don't have a video.",
    );

    cy.get(cesc2("#/mathinputp2")).should(
      "have.text",
      "Here is a mathInput: x+x",
    );

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(0)
      .should("have.text", "math");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(1)
      .should("have.text", "mathInput");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(2)
      .should("not.exist");

    cy.get(cesc2("#/mathp1")).should("not.exist");
    cy.get(cesc2("#/mathp2")).should("not.exist");
    cy.get(cesc2("#/pp1")).should("not.exist");
    cy.get(cesc2("#/pp2")).should("not.exist");

    cy.log("make sure p paragraph was not even created");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mathp1"].stateValues.text).eq(
        "The <math> does math.",
      );
      expect(stateVariables["/mathp2"].stateValues.text).eq(
        "Here is a math: x + x",
      );
      expect(stateVariables["/mathinputp1"].stateValues.text).eq(
        "The <mathInput> let's you input math, but we don't have a video.",
      );
      expect(stateVariables["/mathinputp2"].stateValues.text).eq(
        "Here is a mathInput: x + x",
      );
      expect(stateVariables["/pp1"]).eq(undefined);
      expect(stateVariables["/pp2"]).eq(undefined);
    });

    cy.log("select p initial");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=initials] a")
      .eq(1)
      .click();

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div").should(
      "not.contain.text",
      "math",
    );

    cy.get(cesc2("#/pp1")).should("have.text", "The <p> is simple.");
    cy.get(cesc2("#/pp2")).should("have.text", "Hello!");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(0)
      .should("have.text", "p");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(1)
      .should("not.exist");

    cy.get(cesc2("#/_title1")).should("not.exist");
    cy.get(cesc2("#/_title2")).should("not.exist");

    cy.get(cesc2("#/mathp1")).should("not.exist");
    cy.get(cesc2("#/mathp2")).should("not.exist");

    cy.get(cesc2("#/mathinputp1")).should("not.exist");
    cy.get(cesc2("#/mathinputp2")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mathp1"].stateValues.text).eq(
        "The <math> does math.",
      );
      expect(stateVariables["/mathp2"].stateValues.text).eq(
        "Here is a math: x + x",
      );
      expect(stateVariables["/mathinputp1"].stateValues.text).eq(
        "The <mathInput> let's you input math, but we don't have a video.",
      );
      expect(stateVariables["/mathinputp2"].stateValues.text).eq(
        "Here is a mathInput: x + x",
      );
      expect(stateVariables["/pp1"].stateValues.text).eq("The <p> is simple.");
      expect(stateVariables["/pp2"].stateValues.text).eq("Hello!");
    });

    cy.log("Remember selected item when reload");
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div").should(
      "not.contain.text",
      "math",
    );

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(0)
      .should("have.text", "p");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(1)
      .should("not.exist");

    cy.get(cesc2("#/pp1")).should("have.text", "The <p> is simple.");
    cy.get(cesc2("#/pp2")).should("have.text", "Hello!");

    cy.log("make sure mathinput paragraph was not even created");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/pp1"].stateValues.text).eq("The <p> is simple.");
      expect(stateVariables["/pp2"].stateValues.text).eq("Hello!");
      expect(stateVariables["/mathp1"].stateValues.text).eq(
        "The <math> does math.",
      );
      expect(stateVariables["/mathp2"].stateValues.text).eq(
        "Here is a math: x + x",
      );
      expect(stateVariables["/mathinputp1"]).eq(undefined);
      expect(stateVariables["/mathinputp2"]).eq(undefined);
    });

    cy.log("navigate to math using url");
    cy.visit("/src/Tools/cypressTest/#\\/_contentbrowseritem3");

    cy.get(cesc2("#/_title2")).should("have.text", "The <math> component");

    cy.get(cesc2("#/mathp1")).should("have.text", "The <math> does math.");

    cy.get(cesc2("#/mathv"))
      .invoke("attr", "src")
      .then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true));

    cy.get(cesc2("#/mathp2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");

    cy.log("select unlabeled");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=initials] a")
      .eq(2)
      .click();

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div").should(
      "contain.text",
      "Unlabeled",
    );

    cy.get(cesc2("#/_title3")).should("have.text", "Forgot a label");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(0)
      .should("have.text", "Unlabeled");

    cy.get(cesc2("#/_contentbrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(1)
      .should("not.exist");

    cy.get(cesc2("#/pUnlabeled")).should(
      "have.text",
      "This item does not have a label.",
    );
  });
});
