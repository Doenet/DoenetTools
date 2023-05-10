import { cesc2 } from "../../../../src/_utils/url";

describe("ExampleBrowser Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("Empty examplebrowser", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <exampleBrowser>
        </exampleBrowser>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=initials]").should(
      "have.text",
      "Filter by: ",
    );

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .should("have.text", "");
  });

  it("Basic example", () => {
    let doenetML = `
    <exampleBrowser>
      <exampleBrowserItem>
        <setup>
          <label>p</label>
          <description>The <tag>p</tag> is simple.</description>
        </setup>
        <p name="pp">Hello!</p>
      </exampleBrowserItem>
      <exampleBrowserItem>
        <setup>
          <label>mathInput</label>
          <description>The <tag>mathInput</tag> let's you input math, but we don't have a video.</description>
        </setup>
        <p name="mathinputp">Here is a mathInput: <mathInput prefill="x+x"/></p>
      </exampleBrowserItem>
      <exampleBrowserItem youtubecode="tJ4ypc5L6uU">
        <setup>
          <label>math</label>
          <description>The <tag>math</tag> does math.</description>
        </setup>
        <p name="mathp">Here is a math: <math>x+x</math></p>
      </exampleBrowserItem>

    </exampleBrowser>
`;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=initials]").should(
      "have.text",
      "Filter by: MP",
    );

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(0)
      .should("have.text", "math");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(1)
      .should("have.text", "mathInput");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(2)
      .should("not.exist");

    cy.log("start with math selected");
    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(0)
      .should("contain.text", "The math component");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(0)
      .should("contain.text", "The <math> does math.");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(1)
      .find("iframe")
      .invoke("attr", "src")
      .then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true));

    cy.get(cesc2("#/mathp") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");

    cy.get(cesc2("#/mathinputp")).should("not.exist");

    cy.log("make sure mathinput and p paragraphs were not even created");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mathp"].stateValues.text).eq(
        "Here is a math: x + x",
      );
      expect(stateVariables["/mathinputp"]).eq(undefined);
      expect(stateVariables["/pp"]).eq(undefined);
    });

    cy.log("select mathinput");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(1)
      .click();

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(0)
      .should("contain.text", "The mathInput component");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(0)
      .should(
        "contain.text",
        "The <mathInput> let's you input math, but we don't have a video.",
      );

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(1)
      .find("iframe")
      .should("not.exist");

    cy.get(cesc2("#/mathinputp")).should(
      "have.text",
      "Here is a mathInput: x+x",
    );

    cy.get(cesc2("#/mathp")).should("not.exist");

    cy.log("make sure p paragraph was not even created");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mathp"].stateValues.text).eq(
        "Here is a math: x + x",
      );
      expect(stateVariables["/mathinputp"].stateValues.text).eq(
        "Here is a mathInput: x + x",
      );
      expect(stateVariables["/pp"]).eq(undefined);
    });

    cy.log("select p initial");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=initials] a")
      .eq(1)
      .click();

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=labelPicker] div").should(
      "not.contain.text",
      "math",
    );

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(0)
      .should("have.text", "p");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(1)
      .should("not.exist");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(0)
      .should("contain.text", "The p component");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(0)
      .should("contain.text", "The <p> is simple.");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(1)
      .find("iframe")
      .should("not.exist");

    cy.get(cesc2("#/pp")).should("have.text", "Hello!");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mathp"].stateValues.text).eq(
        "Here is a math: x + x",
      );
      expect(stateVariables["/mathinputp"].stateValues.text).eq(
        "Here is a mathInput: x + x",
      );
      expect(stateVariables["/pp"].stateValues.text).eq("Hello!");
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

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=labelPicker] div").should(
      "not.contain.text",
      "math",
    );

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(0)
      .should("have.text", "p");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=labelPicker] div")
      .eq(1)
      .find("a")
      .eq(1)
      .should("not.exist");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(0)
      .should("contain.text", "The p component");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(0)
      .should("contain.text", "The <p> is simple.");

    cy.get(cesc2("#/_examplebrowser1") + " [data-test=descriptionAndVideo] div")
      .eq(1)
      .find("iframe")
      .should("not.exist");

    cy.get(cesc2("#/pp")).should("have.text", "Hello!");

    cy.log("make sure mathinput paragraph was not even created");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/pp"].stateValues.text).eq("Hello!");

      expect(stateVariables["/mathp"].stateValues.text).eq(
        "Here is a math: x + x",
      );
      expect(stateVariables["/mathinputp"]).eq(undefined);
    });
  });
});
