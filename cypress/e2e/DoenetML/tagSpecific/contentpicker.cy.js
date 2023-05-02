import { cesc2 } from "../../../../src/_utils/url";

describe("ContentPicker Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("No attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <contentPicker>
          <example name="ex1">
            <title>First</title>
            <p>First example</p>
          </example>
          <problem name="pr2">
            <p>Problem with no title</p>
          </problem>
          <text name="tx3">A text must be untitled</text>
          <aside name="as4">
            <title>Final thought</title>
            <p>Not much here</p>
          </aside>
        </contentPicker>
  `,
        },
        "*",
      );
    });

    cy.log("find titles in select");
    cy.get(cesc2("#/_contentpicker1")).should("contain.text", "Select:");
    cy.get(cesc2("#/_contentpicker1") + " option")
      .eq(0)
      .should("have.text", "First");
    cy.get(cesc2("#/_contentpicker1") + " option")
      .eq(1)
      .should("have.text", "Problem 2");
    cy.get(cesc2("#/_contentpicker1") + " option")
      .eq(2)
      .should("have.text", "Untitled");
    cy.get(cesc2("#/_contentpicker1") + " option")
      .eq(3)
      .should("have.text", "Final thought");

    cy.log("First option selected at beginning");
    cy.get(cesc2("#/ex1")).should("contain.text", "First example");
    cy.get(cesc2("#/pr2")).should("not.exist");
    cy.get(cesc2("#/tx3")).should("not.exist");
    cy.get(cesc2("#/as4")).should("not.exist");

    cy.log("Select second option");
    cy.get(cesc2(`#/_contentpicker1`) + ` select`).select(`2`);
    cy.get(cesc2("#/pr2")).should("contain.text", "Problem with no title");
    cy.get(cesc2("#/ex1")).should("not.exist");
    cy.get(cesc2("#/tx3")).should("not.exist");
    cy.get(cesc2("#/as4")).should("not.exist");

    cy.log("Select third option");
    cy.get(cesc2(`#/_contentpicker1`) + ` select`).select(`3`);
    cy.get(cesc2("#/tx3")).should("contain.text", "A text must be untitled");
    cy.get(cesc2("#/ex1")).should("not.exist");
    cy.get(cesc2("#/pr2")).should("not.exist");
    cy.get(cesc2("#/as4")).should("not.exist");

    cy.log("Select fourth option");
    cy.get(cesc2(`#/_contentpicker1`) + ` select`).select(`4`);
    cy.get(cesc2("#/as4")).should("contain.text", "Final thought");
    cy.get(cesc2("#/ex1")).should("not.exist");
    cy.get(cesc2("#/pr2")).should("not.exist");
    cy.get(cesc2("#/tx3")).should("not.exist");
    cy.get(cesc2("#/as4")).should("not.contain.text", "Not much here");

    cy.log("open aside");
    cy.get(cesc2("#/as4_title")).click();
    cy.get(cesc2("#/as4")).should("contain.text", "Not much here");
  });

  it("Specify label", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <contentPicker label="Pick one">
          <example name="ex1">
            <title>First</title>
            <p>First example</p>
          </example>
          <problem name="pr2">
            <p>Problem with no title</p>
          </problem>
        </contentPicker>
  `,
        },
        "*",
      );
    });

    cy.log("check new label");
    cy.get(cesc2("#/_contentpicker1")).should("contain.text", "Pick one:");
  });

  it("Separate by topic", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <contentPicker separateByTopic>
          <example name="ex1">
            <setup><topic>Topic A</topic></setup>
            <title>First</title>
            <p>First example</p>
          </example>
          <problem name="pr2">
            <setup><topic>Topic B</topic></setup>
            <p>Problem with no title</p>
          </problem>
          <text name="tx3">
            <setup><topic>Topic A</topic></setup>
            A text must be untitled
          </text>
          <aside name="as4">
            <title>Final thought</title>
            <p>Not much here</p>
          </aside>
        </contentPicker>
  `,
        },
        "*",
      );
    });

    cy.log("find titles in select");
    cy.get(cesc2("#/_contentpicker1") + " optGroup")
      .eq(0)
      .should("have.attr", "label", "Topic A");
    cy.get(cesc2("#/_contentpicker1") + " optGroup")
      .eq(1)
      .should("have.attr", "label", "Topic B");
    cy.get(cesc2("#/_contentpicker1") + " optGroup")
      .eq(2)
      .should("have.attr", "label", "Other");
    cy.get(cesc2("#/_contentpicker1") + " optGroup")
      .eq(0)
      .find("option")
      .eq(0)
      .should("have.text", "First");
    cy.get(cesc2("#/_contentpicker1") + " optgroup")
      .eq(0)
      .find("option")
      .eq(1)
      .should("have.text", "Untitled");
    cy.get(cesc2("#/_contentpicker1") + " optgroup")
      .eq(1)
      .find("option")
      .eq(0)
      .should("have.text", "Problem 2");
    cy.get(cesc2("#/_contentpicker1") + " optgroup")
      .eq(2)
      .find("option")
      .eq(0)
      .should("have.text", "Final thought");
    cy.get(cesc2("#/as4")).should("not.exist");

    cy.log("First option from first topic should be selected");
    cy.get(cesc2("#/ex1")).should("contain.text", "First example");
    cy.get(cesc2("#/pr2")).should("not.exist");
    cy.get(cesc2("#/tx3")).should("not.exist");
    cy.get(cesc2("#/as4")).should("not.exist");

    cy.log("Select first option from second topic");
    cy.get(cesc2(`#/_contentpicker1`) + ` select`).select(`2`);
    cy.get(cesc2("#/pr2")).should("contain.text", "Problem with no title");
    cy.get(cesc2("#/ex1")).should("not.exist");
    cy.get(cesc2("#/tx3")).should("not.exist");
    cy.get(cesc2("#/as4")).should("not.exist");

    cy.log("Select first option from third topic");
    cy.get(cesc2(`#/_contentpicker1`) + ` select`).select(`4`);
    cy.get(cesc2("#/as4")).should("contain.text", "Final thought");
    cy.get(cesc2("#/ex1")).should("not.exist");
    cy.get(cesc2("#/pr2")).should("not.exist");
    cy.get(cesc2("#/tx3")).should("not.exist");
    cy.get(cesc2("#/as4")).should("not.contain.text", "Not much here");

    cy.log("open aside");
    cy.get(cesc2("#/as4_title")).click();
    cy.get(cesc2("#/as4")).should("contain.text", "Not much here");

    cy.log("Select second option from first topic");
    cy.get(cesc2(`#/_contentpicker1`) + ` select`).select(`3`);
    cy.get(cesc2("#/tx3")).should("contain.text", "A text must be untitled");
    cy.get(cesc2("#/ex1")).should("not.exist");
    cy.get(cesc2("#/pr2")).should("not.exist");
    cy.get(cesc2("#/as4")).should("not.exist");
  });

  it("Separate by topic, specify default topic label", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <contentPicker separateByTopic defaultTopicLabel="Alternative topic">
          <example name="ex1">
            <setup><topic>Topic A</topic></setup>
            <title>First</title>
            <p>First example</p>
          </example>
          <problem name="pr2">
            <setup><topic>Topic B</topic></setup>
            <p>Problem with no title</p>
          </problem>
          <text name="tx3">
            <setup><topic>Topic A</topic></setup>
            A text must be untitled
          </text>
          <aside name="as4">
            <title>Final thought</title>
            <p>Not much here</p>
          </aside>
        </contentPicker>
  `,
        },
        "*",
      );
    });

    cy.log("check new label");

    cy.get(cesc2("#/_contentpicker1") + " optGroup")
      .eq(0)
      .should("have.attr", "label", "Topic A");
    cy.get(cesc2("#/_contentpicker1") + " optGroup")
      .eq(1)
      .should("have.attr", "label", "Topic B");
    cy.get(cesc2("#/_contentpicker1") + " optGroup")
      .eq(2)
      .should("have.attr", "label", "Alternative topic");
  });
});
