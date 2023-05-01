import { cesc, cesc2 } from "../../../../src/_utils/url";
describe("Code Editor Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("code editor with no arguments", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <codeEditor />

    <p><copy prop="immediateValue" target="_codeeditor1" /></p>
    <p><copy prop="value" target="_codeeditor1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("contain.text", "a");

    cy.get(cesc("#\\/_p1")).should("have.text", "");
    cy.get(cesc("#\\/_p2")).should("have.text", "");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq("");
      expect(stateVariables["/_codeeditor1"].stateValues.value).eq("");
    });

    cy.log("type text in editor");
    cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type("Hello!", {
      delay: 0,
    });

    cy.get(cesc("#\\/_p1")).should("have.text", "Hello!");
    cy.get(cesc("#\\/_p2")).should("have.text", "");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
        "Hello!",
      );
      expect(stateVariables["/_codeeditor1"].stateValues.value).eq("");
    });

    cy.log("wait for debounce to update value");
    cy.wait(1500);
    cy.get(cesc("#\\/_p1")).should("have.text", "Hello!");
    cy.get(cesc("#\\/_p2")).should("have.text", "Hello!");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
        "Hello!",
      );
      expect(stateVariables["/_codeeditor1"].stateValues.value).eq("Hello!");
    });

    cy.log("type more in editor");
    cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type(
      "{enter}More here.",
      { delay: 0 },
    );

    cy.get(cesc("#\\/_p1")).should("have.text", "Hello!\nMore here.");
    cy.get(cesc("#\\/_p2")).should("have.text", "Hello!");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
        "Hello!\nMore here.",
      );
      expect(stateVariables["/_codeeditor1"].stateValues.value).eq("Hello!");
    });

    cy.log("blur to update value");
    cy.get(cesc("#\\/_codeeditor1") + " .cm-content").blur();

    cy.get(cesc("#\\/_p1")).should("have.text", "Hello!\nMore here.");
    cy.get(cesc("#\\/_p2")).should("have.text", "Hello!\nMore here.");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
        "Hello!\nMore here.",
      );
      expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
        "Hello!\nMore here.",
      );
    });
  });

  it("code editor with show results", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <codeEditor showResults />

    <p><copy prop="immediateValue" target="_codeeditor1" /></p>
    <p><copy prop="value" target="_codeeditor1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("contain.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let viewerName =
        stateVariables["/_codeeditor1"].activeChildren[0].componentName;
      let updateAnchor = "#" + cesc2(viewerName) + "_updateButton";
      let contentAnchor = "#" + cesc2(viewerName) + "_content";

      cy.get(cesc("#\\/_p1")).should("have.text", "");
      cy.get(cesc("#\\/_p2")).should("have.text", "");
      cy.get(contentAnchor).should("have.text", "");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq("");
        expect(stateVariables[viewerName].activeChildren.length).eq(0);
      });

      cy.log("type text in editor");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type("<p>Hello!</p>", {
        delay: 0,
      });

      cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p2")).should("have.text", "");
      cy.get(contentAnchor).should("have.text", "");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq("");
        expect(stateVariables[viewerName].activeChildren.length).eq(0);
      });

      cy.log("blur updates value but not content");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").blur();

      cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");
      cy.get(contentAnchor).should("have.text", "");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables[viewerName].activeChildren.length).eq(0);
      });

      cy.log("click to update content");
      cy.get(updateAnchor).click();

      cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");
      cy.get(contentAnchor).should("have.text", "Hello!");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables[viewerName].activeChildren.length).eq(1);
        expect(stateVariables[viewerName].activeChildren[0].componentType).eq(
          "p",
        );
        let pName = stateVariables[viewerName].activeChildren[0].componentName;
        expect(stateVariables[pName].stateValues.text).eq("Hello!");
      });

      cy.log("type more content");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type(
        "{ctrl+end}{enter}<p><math simplify>1+1</math></p>",
        { delay: 0 },
      );

      cy.get(cesc("#\\/_p1")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );
      cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");
      cy.get(contentAnchor).should("have.text", "Hello!");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables[viewerName].activeChildren.length).eq(1);
        expect(stateVariables[viewerName].activeChildren[0].componentType).eq(
          "p",
        );
        let pName = stateVariables[viewerName].activeChildren[0].componentName;
        expect(stateVariables[pName].stateValues.text).eq("Hello!");
      });

      cy.log("Wait for value to be updated");
      cy.get(cesc("#\\/_p2")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );
      cy.get(cesc("#\\/_p1")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );
      cy.get(contentAnchor).should("have.text", "Hello!");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables[viewerName].activeChildren.length).eq(1);
        expect(stateVariables[viewerName].activeChildren[0].componentType).eq(
          "p",
        );
        let pName = stateVariables[viewerName].activeChildren[0].componentName;
        expect(stateVariables[pName].stateValues.text).eq("Hello!");
      });

      cy.log("click to update content");
      cy.get(updateAnchor).click();

      cy.get(cesc("#\\/_p1")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );
      cy.get(cesc("#\\/_p2")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );
      cy.get(contentAnchor).should("contain.text", "Hello!\n2");
      cy.get(contentAnchor + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("2");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables[viewerName].activeChildren.length).eq(3);
        expect(stateVariables[viewerName].activeChildren[0].componentType).eq(
          "p",
        );
        let p1Name = stateVariables[viewerName].activeChildren[0].componentName;
        expect(stateVariables[p1Name].stateValues.text).eq("Hello!");
        expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
        expect(stateVariables[viewerName].activeChildren[2].componentType).eq(
          "p",
        );
        let p2Name = stateVariables[viewerName].activeChildren[2].componentName;
        expect(stateVariables[p2Name].stateValues.text).eq("2");
        expect(stateVariables[p2Name].activeChildren.length).eq(1);
        let mathName = stateVariables[p2Name].activeChildren[0].componentName;
        expect(stateVariables[mathName].stateValues.value).eq(2);
      });
    });
  });

  it("code editor with renderedName", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <codeEditor showResults renderedName="result" />

    <p><copy prop="immediateValue" target="_codeeditor1" /></p>
    <p><copy prop="value" target="_codeeditor1" /></p>

    <p>The value of the entered math is <copy prop="value" target="/result/_math1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("contain.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let viewerName =
        stateVariables["/_codeeditor1"].activeChildren[0].componentName;
      let updateAnchor = "#" + cesc2(viewerName) + "_updateButton";
      let contentAnchor = "#" + cesc2(viewerName) + "_content";

      cy.get(cesc("#\\/_p1")).should("have.text", "");
      cy.get(cesc("#\\/_p2")).should("have.text", "");
      cy.get(cesc("#\\/_p3")).should(
        "have.text",
        "The value of the entered math is ",
      );
      cy.get(contentAnchor).should("have.text", "");
      cy.get(cesc("#\\/m1")).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq("");
        expect(stateVariables[viewerName].activeChildren.length).eq(0);
        expect(stateVariables["/result/_p1"]).eq(undefined);
        expect(stateVariables["/result/_p2"]).eq(undefined);
        expect(stateVariables["/result/_math1"]).eq(undefined);
      });

      cy.log("type text in editor");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type("<p>Hello!</p>", {
        delay: 0,
      });

      cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p2")).should("have.text", "");
      cy.get(cesc("#\\/_p3")).should(
        "have.text",
        "The value of the entered math is ",
      );
      cy.get(contentAnchor).should("have.text", "");
      cy.get(cesc("#\\/m1")).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq("");
        expect(stateVariables[viewerName].activeChildren.length).eq(0);
        expect(stateVariables["/result/_p1"]).eq(undefined);
        expect(stateVariables["/result/_p2"]).eq(undefined);
        expect(stateVariables["/result/_math1"]).eq(undefined);
      });

      cy.log("blur updates value but not content");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").blur();

      cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p3")).should(
        "have.text",
        "The value of the entered math is ",
      );
      cy.get(contentAnchor).should("have.text", "");
      cy.get(cesc("#\\/m1")).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables[viewerName].activeChildren.length).eq(0);
        expect(stateVariables["/result/_p1"]).eq(undefined);
        expect(stateVariables["/result/_p2"]).eq(undefined);
        expect(stateVariables["/result/_math1"]).eq(undefined);
      });

      cy.log("click to update content");
      cy.get(updateAnchor).click();

      cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p3")).should(
        "have.text",
        "The value of the entered math is ",
      );
      cy.get(contentAnchor).should("have.text", "Hello!");
      cy.get(cesc("#\\/m1")).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables[viewerName].activeChildren.length).eq(1);
        expect(stateVariables[viewerName].activeChildren[0].componentName).eq(
          "/result/_p1",
        );
        expect(stateVariables["/result/_p1"].stateValues.text).eq("Hello!");
        expect(stateVariables["/result/_p2"]).eq(undefined);
        expect(stateVariables["/result/_math1"]).eq(undefined);
      });

      cy.log("type more content");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type(
        "{ctrl+end}{enter}<p><math simplify>1+1</math></p>",
        { delay: 0 },
      );

      cy.get(cesc("#\\/_p1")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );
      cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p3")).should(
        "have.text",
        "The value of the entered math is ",
      );
      cy.get(contentAnchor).should("have.text", "Hello!");
      cy.get(cesc("#\\/m1")).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables[viewerName].activeChildren.length).eq(1);
        expect(stateVariables[viewerName].activeChildren[0].componentName).eq(
          "/result/_p1",
        );
        expect(stateVariables["/result/_p1"].stateValues.text).eq("Hello!");
        expect(stateVariables["/result/_p2"]).eq(undefined);
        expect(stateVariables["/result/_math1"]).eq(undefined);
      });

      cy.log("Wait for value to be updated");
      cy.get(cesc("#\\/_p2")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );
      cy.get(cesc("#\\/_p1")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );
      cy.get(cesc("#\\/_p3")).should(
        "have.text",
        "The value of the entered math is ",
      );
      cy.get(contentAnchor).should("have.text", "Hello!");
      cy.get(cesc("#\\/m1")).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables[viewerName].activeChildren.length).eq(1);
        expect(stateVariables[viewerName].activeChildren[0].componentName).eq(
          "/result/_p1",
        );
        expect(stateVariables["/result/_p1"].stateValues.text).eq("Hello!");
        expect(stateVariables["/result/_p2"]).eq(undefined);
        expect(stateVariables["/result/_math1"]).eq(undefined);
      });

      cy.log("click to update content");
      cy.get(updateAnchor).click();

      cy.get(cesc("#\\/_p1")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );
      cy.get(cesc("#\\/_p2")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );
      cy.get(cesc("#\\/_p3")).should(
        "contain.text",
        "The value of the entered math is 2",
      );
      cy.get(contentAnchor).should("contain.text", "Hello!\n2");
      cy.get(contentAnchor + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("2");
        });
      cy.get(cesc("#\\/m1") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("2");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables[viewerName].activeChildren.length).eq(3);
        expect(stateVariables[viewerName].activeChildren[0].componentName).eq(
          "/result/_p1",
        );
        expect(stateVariables["/result/_p1"].stateValues.text).eq("Hello!");
        expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
        expect(stateVariables[viewerName].activeChildren[2].componentName).eq(
          "/result/_p2",
        );
        expect(stateVariables["/result/_p2"].stateValues.text).eq("2");
        expect(stateVariables["/result/_p2"].activeChildren.length).eq(1);
        expect(
          stateVariables["/result/_p2"].activeChildren[0].componentName,
        ).eq("/result/_math1");
        expect(stateVariables["/result/_math1"].stateValues.value).eq(2);
      });
    });
  });

  it("code editor with renderedName and staticName", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <codeEditor showResults renderedName="result" staticName="static" />

    <p name="px">The value of the dynamic math is <copy prop="value" target="/result/x" assignNames="x" /></p>
    <p name="psx">The value of the static math is <copy prop="value" target="/static/x" assignNames="sx" /></p>
    <p name="pP">The coords of the dynamic point are <copy prop="coords" target="/result/P" assignNames="P" /></p>
    <p name="psP">The coords of the static point are <copy prop="coords" target="/static/P" assignNames="sP" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("contain.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let viewerName =
        stateVariables["/_codeeditor1"].activeChildren[0].componentName;
      let updateAnchor = "#" + cesc2(viewerName) + "_updateButton";

      cy.get(cesc("#\\/px")).should(
        "have.text",
        "The value of the dynamic math is ",
      );
      cy.get(cesc("#\\/psx")).should(
        "have.text",
        "The value of the static math is ",
      );
      cy.get(cesc("#\\/pP")).should(
        "have.text",
        "The coords of the dynamic point are ",
      );
      cy.get(cesc("#\\/psP")).should(
        "have.text",
        "The coords of the static point are ",
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq("");
        expect(stateVariables[viewerName].activeChildren.length).eq(0);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/sx"]).eq(undefined);
        expect(stateVariables["/P"]).eq(undefined);
        expect(stateVariables["/sP"]).eq(undefined);
        expect(stateVariables["/result/x"]).eq(undefined);
        expect(stateVariables["/static/x"]).eq(undefined);
        expect(stateVariables["/result/P"]).eq(undefined);
        expect(stateVariables["/static/P"]).eq(undefined);
        expect(stateVariables["/result"].replacements.length).eq(0);
        expect(stateVariables["/static"].replacements.length).eq(0);
      });

      cy.log("type text in editor");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type(
        "<p>Enter value <mathinput name='mi' prefill='y' /></p>{enter}",
      );
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type(
        "<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>{enter}",
      );

      cy.get(cesc("#\\/px")).should(
        "have.text",
        "The value of the dynamic math is ",
      );
      cy.get(cesc("#\\/psx")).should(
        "have.text",
        "The value of the static math is ",
      );
      cy.get(cesc("#\\/pP")).should(
        "have.text",
        "The coords of the dynamic point are ",
      );
      cy.get(cesc("#\\/psP")).should(
        "have.text",
        "The coords of the static point are ",
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Enter value <mathinput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>\n",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq("");
        expect(stateVariables[viewerName].activeChildren.length).eq(0);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/sx"]).eq(undefined);
        expect(stateVariables["/P"]).eq(undefined);
        expect(stateVariables["/sP"]).eq(undefined);
        expect(stateVariables["/result/x"]).eq(undefined);
        expect(stateVariables["/static/x"]).eq(undefined);
        expect(stateVariables["/result/P"]).eq(undefined);
        expect(stateVariables["/static/P"]).eq(undefined);
        expect(stateVariables["/result"].replacements.length).eq(0);
        expect(stateVariables["/static"].replacements.length).eq(0);
      });

      cy.log("blur updates static but not dynamic");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").blur();

      cy.get(cesc("#\\/psx")).should(
        "contain.text",
        "The value of the static math is y",
      );
      cy.get(cesc("#\\/px")).should(
        "have.text",
        "The value of the dynamic math is ",
      );
      cy.get(cesc("#\\/pP")).should(
        "have.text",
        "The coords of the dynamic point are ",
      );
      cy.get(cesc("#\\/psP")).should(
        "have.text",
        "The coords of the static point are ",
      );

      cy.get(cesc("#\\/sx") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("y");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Enter value <mathinput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>\n",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Enter value <mathinput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>\n",
        );
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/sx"].stateValues.value).eq("y");
        expect(stateVariables["/P"]).eq(undefined);
        expect(stateVariables["/sP"]).eq(undefined);
        expect(stateVariables["/result/x"]).eq(undefined);
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
        expect(stateVariables["/result/P"]).eq(undefined);
        expect(stateVariables["/static/P"]).eq(undefined);

        expect(stateVariables[viewerName].activeChildren.length).eq(0);
        expect(stateVariables["/result"].replacements.length).eq(0);

        expect(stateVariables["/static"].replacements.length).eq(3);
        expect(stateVariables["/static"].replacements[0].componentName).eq(
          "/static/_p1",
        );
        expect(stateVariables["/static/_p1"].stateValues.text).eq(
          "Enter value y",
        );
        expect(stateVariables["/static"].replacements[1]).eq("\n");
        expect(stateVariables["/static"].replacements[2].componentName).eq(
          "/static/_p2",
        );
        expect(stateVariables["/static/_p2"].stateValues.text).eq(
          "The value is y",
        );
        expect(stateVariables["/static/mi"].stateValues.value).eq("y");
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
      });

      cy.log("click to update dynamic content");
      cy.get(updateAnchor).click();

      cy.get(cesc("#\\/px")).should(
        "contain.text",
        "The value of the dynamic math is y",
      );
      cy.get(cesc("#\\/psx")).should(
        "contain.text",
        "The value of the static math is y",
      );
      cy.get(cesc("#\\/pP")).should(
        "have.text",
        "The coords of the dynamic point are ",
      );
      cy.get(cesc("#\\/psP")).should(
        "have.text",
        "The coords of the static point are ",
      );

      cy.get(cesc("#\\/x") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("y");
        });
      cy.get(cesc("#\\/sx") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("y");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Enter value <mathinput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>\n",
        );
        expect(stateVariables["/x"].stateValues.value).eq("y");
        expect(stateVariables["/sx"].stateValues.value).eq("y");
        expect(stateVariables["/P"]).eq(undefined);
        expect(stateVariables["/sP"]).eq(undefined);
        expect(stateVariables["/result/x"].stateValues.value).eq("y");
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
        expect(stateVariables["/result/P"]).eq(undefined);
        expect(stateVariables["/static/P"]).eq(undefined);

        expect(stateVariables[viewerName].activeChildren.length).eq(3);
        expect(stateVariables["/result"].replacements.length).eq(3);
        expect(stateVariables[viewerName].activeChildren[0].componentName).eq(
          "/result/_p1",
        );
        expect(stateVariables["/result/_p1"].stateValues.text).eq(
          "Enter value y",
        );
        expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
        expect(stateVariables[viewerName].activeChildren[2].componentName).eq(
          "/result/_p2",
        );
        expect(stateVariables["/result/_p2"].stateValues.text).eq(
          "The value is y",
        );
        expect(stateVariables["/result/mi"].stateValues.value).eq("y");
        expect(stateVariables["/result/x"].stateValues.value).eq("y");

        expect(stateVariables["/static"].replacements.length).eq(3);
        expect(stateVariables["/static"].replacements[0].componentName).eq(
          "/static/_p1",
        );
        expect(stateVariables["/static/_p1"].stateValues.text).eq(
          "Enter value y",
        );
        expect(stateVariables["/static"].replacements[1]).eq("\n");
        expect(stateVariables["/static"].replacements[2].componentName).eq(
          "/static/_p2",
        );
        expect(stateVariables["/static/_p2"].stateValues.text).eq(
          "The value is y",
        );
        expect(stateVariables["/static/mi"].stateValues.value).eq("y");
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
      });

      cy.log("Enter new value in dynamic results");
      cy.get(cesc("#\\/result\\/mi") + " textarea").type(
        "{end}{backspace}x{enter}",
        { force: true },
      );

      cy.get(cesc("#\\/px")).should(
        "contain.text",
        "The value of the dynamic math is x",
      );
      cy.get(cesc("#\\/psx")).should(
        "contain.text",
        "The value of the static math is y",
      );
      cy.get(cesc("#\\/pP")).should(
        "have.text",
        "The coords of the dynamic point are ",
      );
      cy.get(cesc("#\\/psP")).should(
        "have.text",
        "The coords of the static point are ",
      );

      cy.get(cesc("#\\/x") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("x");
        });
      cy.get(cesc("#\\/sx") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("y");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Enter value <mathinput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>\n",
        );
        expect(stateVariables["/x"].stateValues.value).eq("x");
        expect(stateVariables["/sx"].stateValues.value).eq("y");
        expect(stateVariables["/P"]).eq(undefined);
        expect(stateVariables["/sP"]).eq(undefined);
        expect(stateVariables["/result/x"].stateValues.value).eq("x");
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
        expect(stateVariables["/result/P"]).eq(undefined);
        expect(stateVariables["/static/P"]).eq(undefined);

        expect(stateVariables[viewerName].activeChildren.length).eq(3);
        expect(stateVariables["/result"].replacements.length).eq(3);
        expect(stateVariables[viewerName].activeChildren[0].componentName).eq(
          "/result/_p1",
        );
        expect(stateVariables["/result/_p1"].stateValues.text).eq(
          "Enter value x",
        );
        expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
        expect(stateVariables[viewerName].activeChildren[2].componentName).eq(
          "/result/_p2",
        );
        expect(stateVariables["/result/_p2"].stateValues.text).eq(
          "The value is x",
        );
        expect(stateVariables["/result/mi"].stateValues.value).eq("x");
        expect(stateVariables["/result/x"].stateValues.value).eq("x");

        expect(stateVariables["/static"].replacements.length).eq(3);
        expect(stateVariables["/static"].replacements[0].componentName).eq(
          "/static/_p1",
        );
        expect(stateVariables["/static/_p1"].stateValues.text).eq(
          "Enter value y",
        );
        expect(stateVariables["/static"].replacements[1]).eq("\n");
        expect(stateVariables["/static"].replacements[2].componentName).eq(
          "/static/_p2",
        );
        expect(stateVariables["/static/_p2"].stateValues.text).eq(
          "The value is y",
        );
        expect(stateVariables["/static/mi"].stateValues.value).eq("y");
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
      });

      cy.log("type text in editor");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content")
        .type("{ctrl+end}<graph><point name='P'>(3,4)</point></graph>{enter}")
        .blur();

      cy.get(cesc("#\\/psP")).should(
        "contain.text",
        "The coords of the static point are (3,4)",
      );
      cy.get(cesc("#\\/px")).should(
        "contain.text",
        "The value of the dynamic math is x",
      );
      cy.get(cesc("#\\/psx")).should(
        "contain.text",
        "The value of the static math is y",
      );
      cy.get(cesc("#\\/pP")).should(
        "have.text",
        "The coords of the dynamic point are ",
      );

      cy.get(cesc("#\\/x") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("x");
        });
      cy.get(cesc("#\\/sx") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("y");
        });
      cy.get(cesc("#\\/sP") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("(3,4)");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/x"].stateValues.value).eq("x");
        expect(stateVariables["/sx"].stateValues.value).eq("y");
        expect(stateVariables["/P"]).eq(undefined);
        expect(stateVariables["/sP"].stateValues.vector).eqls([3, 4]);
        expect(stateVariables["/result/x"].stateValues.value).eq("x");
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
        expect(stateVariables["/result/P"]).eq(undefined);
        expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);

        expect(stateVariables[viewerName].activeChildren.length).eq(3);
        expect(stateVariables["/result"].replacements.length).eq(3);
        expect(stateVariables[viewerName].activeChildren[0].componentName).eq(
          "/result/_p1",
        );
        expect(stateVariables["/result/_p1"].stateValues.text).eq(
          "Enter value x",
        );
        expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
        expect(stateVariables[viewerName].activeChildren[2].componentName).eq(
          "/result/_p2",
        );
        expect(stateVariables["/result/_p2"].stateValues.text).eq(
          "The value is x",
        );
        expect(stateVariables["/result/mi"].stateValues.value).eq("x");
        expect(stateVariables["/result/x"].stateValues.value).eq("x");

        expect(stateVariables["/static"].replacements.length).eq(5);
        expect(stateVariables["/static"].replacements[0].componentName).eq(
          "/static/_p1",
        );
        expect(stateVariables["/static/_p1"].stateValues.text).eq(
          "Enter value y",
        );
        expect(stateVariables["/static"].replacements[1]).eq("\n");
        expect(stateVariables["/static"].replacements[2].componentName).eq(
          "/static/_p2",
        );
        expect(stateVariables["/static/_p2"].stateValues.text).eq(
          "The value is y",
        );
        expect(stateVariables["/static"].replacements[3]).eq("\n");
        expect(stateVariables["/static"].replacements[4].componentName).eq(
          "/static/_graph1",
        );

        expect(stateVariables["/static/mi"].stateValues.value).eq("y");
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
        expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);
      });

      cy.log("click to update dynamic content");
      cy.get(updateAnchor).click();

      cy.get(cesc("#\\/pP")).should(
        "contain.text",
        "The coords of the dynamic point are (3,4)",
      );
      cy.get(cesc("#\\/px")).should(
        "contain.text",
        "The value of the dynamic math is y",
      );
      cy.get(cesc("#\\/psx")).should(
        "contain.text",
        "The value of the static math is y",
      );
      cy.get(cesc("#\\/psP")).should(
        "contain.text",
        "The coords of the static point are (3,4)",
      );

      cy.get(cesc("#\\/x") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("y");
        });
      cy.get(cesc("#\\/sx") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("y");
        });
      cy.get(cesc("#\\/P") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("(3,4)");
        });
      cy.get(cesc("#\\/sP") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("(3,4)");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/x"].stateValues.value).eq("y");
        expect(stateVariables["/sx"].stateValues.value).eq("y");
        expect(stateVariables["/P"].stateValues.vector).eqls([3, 4]);
        expect(stateVariables["/sP"].stateValues.vector).eqls([3, 4]);
        expect(stateVariables["/result/x"].stateValues.value).eq("y");
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
        expect(stateVariables["/result/P"].stateValues.xs).eqls([3, 4]);
        expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);

        expect(stateVariables[viewerName].activeChildren.length).eq(5);
        expect(stateVariables["/result"].replacements.length).eq(5);
        expect(stateVariables[viewerName].activeChildren[0].componentName).eq(
          "/result/_p1",
        );
        expect(stateVariables["/result/_p1"].stateValues.text).eq(
          "Enter value y",
        );
        expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
        expect(stateVariables[viewerName].activeChildren[2].componentName).eq(
          "/result/_p2",
        );
        expect(stateVariables["/result/_p2"].stateValues.text).eq(
          "The value is y",
        );
        expect(stateVariables[viewerName].activeChildren[3]).eq("\n");
        expect(stateVariables[viewerName].activeChildren[4].componentName).eq(
          "/result/_graph1",
        );
        expect(stateVariables["/result/mi"].stateValues.value).eq("y");
        expect(stateVariables["/result/x"].stateValues.value).eq("y");
        expect(stateVariables["/result/P"].stateValues.xs).eqls([3, 4]);

        expect(stateVariables["/static"].replacements.length).eq(5);
        expect(stateVariables["/static"].replacements[0].componentName).eq(
          "/static/_p1",
        );
        expect(stateVariables["/static/_p1"].stateValues.text).eq(
          "Enter value y",
        );
        expect(stateVariables["/static"].replacements[1]).eq("\n");
        expect(stateVariables["/static"].replacements[2].componentName).eq(
          "/static/_p2",
        );
        expect(stateVariables["/static/_p2"].stateValues.text).eq(
          "The value is y",
        );
        expect(stateVariables["/static"].replacements[3]).eq("\n");
        expect(stateVariables["/static"].replacements[4].componentName).eq(
          "/static/_graph1",
        );

        expect(stateVariables["/static/mi"].stateValues.value).eq("y");
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
        expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);
      });

      cy.log("Change values in dynamic results");

      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/result/P",
          args: { x: 5, y: 7 },
        });
      });

      cy.get(cesc("#\\/pP")).should(
        "contain.text",
        "The coords of the dynamic point are (5,7)",
      );
      cy.get(cesc("#\\/px")).should(
        "contain.text",
        "The value of the dynamic math is y",
      );
      cy.get(cesc("#\\/psx")).should(
        "contain.text",
        "The value of the static math is y",
      );
      cy.get(cesc("#\\/psP")).should(
        "contain.text",
        "The coords of the static point are (3,4)",
      );

      cy.get(cesc("#\\/x") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("y");
        });
      cy.get(cesc("#\\/sx") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("y");
        });
      cy.get(cesc("#\\/P") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("(5,7)");
        });
      cy.get(cesc("#\\/sP") + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("(3,4)");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/x"].stateValues.value).eq("y");
        expect(stateVariables["/sx"].stateValues.value).eq("y");
        expect(stateVariables["/P"].stateValues.vector).eqls([5, 7]);
        expect(stateVariables["/sP"].stateValues.vector).eqls([3, 4]);
        expect(stateVariables["/result/x"].stateValues.value).eq("y");
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
        expect(stateVariables["/result/P"].stateValues.xs).eqls([5, 7]);
        expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);

        expect(stateVariables[viewerName].activeChildren.length).eq(5);
        expect(stateVariables["/result"].replacements.length).eq(5);
        expect(stateVariables[viewerName].activeChildren[0].componentName).eq(
          "/result/_p1",
        );
        expect(stateVariables["/result/_p1"].stateValues.text).eq(
          "Enter value y",
        );
        expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
        expect(stateVariables[viewerName].activeChildren[2].componentName).eq(
          "/result/_p2",
        );
        expect(stateVariables["/result/_p2"].stateValues.text).eq(
          "The value is y",
        );
        expect(stateVariables[viewerName].activeChildren[3]).eq("\n");
        expect(stateVariables[viewerName].activeChildren[4].componentName).eq(
          "/result/_graph1",
        );
        expect(stateVariables["/result/mi"].stateValues.value).eq("y");
        expect(stateVariables["/result/x"].stateValues.value).eq("y");
        expect(stateVariables["/result/P"].stateValues.xs).eqls([5, 7]);

        expect(stateVariables["/static"].replacements.length).eq(5);
        expect(stateVariables["/static"].replacements[0].componentName).eq(
          "/static/_p1",
        );
        expect(stateVariables["/static/_p1"].stateValues.text).eq(
          "Enter value y",
        );
        expect(stateVariables["/static"].replacements[1]).eq("\n");
        expect(stateVariables["/static"].replacements[2].componentName).eq(
          "/static/_p2",
        );
        expect(stateVariables["/static/_p2"].stateValues.text).eq(
          "The value is y",
        );
        expect(stateVariables["/static"].replacements[3]).eq("\n");
        expect(stateVariables["/static"].replacements[4].componentName).eq(
          "/static/_graph1",
        );

        expect(stateVariables["/static/mi"].stateValues.value).eq("y");
        expect(stateVariables["/static/x"].stateValues.value).eq("y");
        expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);
      });
    });
  });

  it("include blank string children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <codeEditor showResults renderedName="result" prefill="<text>hello</text> <text>there</text>" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("contain.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let viewerName =
        stateVariables["/_codeeditor1"].activeChildren[0].componentName;
      let contentAnchor = "#" + cesc2(viewerName) + "_content";

      cy.get(contentAnchor).should("have.text", "hello there");
    });
  });

  it("set value from immediateValue on reload", () => {
    let doenetML = `
    <p><codeEditor name="ce" /></p>

    <p name="pv">value: $ce</p>
    <p name="piv">immediate value: $ce.immediateValue</p>
    `;

    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/ce") + " .cm-content").type("hello", { delay: 0 });

    cy.get(cesc("#\\/piv")).should("have.text", "immediate value: hello");
    cy.get(cesc("#\\/pv")).should("have.text", "value: ");

    cy.wait(1500); // wait for debounce

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/pv")).should("have.text", "value: hello");
    cy.get(cesc("#\\/piv")).should("have.text", "immediate value: hello");
  });

  it("bind value to", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p><codeEditor name="ce" bindValueTo="$ti" /></p>

    <p><textinput name="ti" expanded prefill="Hello!" /></p>

    <p name="pv">value: $ce</p>
    <p name="piv">immediate value: $ce.immediateValue</p>
    <p name="pv2">value: $ti</p>
    <p name="piv2">immediate value: $ti.immediateValue</p>
          `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/piv")).should("have.text", "immediate value: Hello!");
    cy.get(cesc2("#/pv")).should("have.text", "value: Hello!");
    cy.get(cesc2("#/piv2")).should("have.text", "immediate value: Hello!");
    cy.get(cesc2("#/pv2")).should("have.text", "value: Hello!");

    cy.get(cesc2("#/ti_input")).type("{ctrl+end}{enter}Selam!", { delay: 0 });
    cy.get(cesc2("#/piv2")).should(
      "have.text",
      "immediate value: Hello!\nSelam!",
    );
    cy.get(cesc2("#/pv2")).should("have.text", "value: Hello!");

    cy.get(cesc2("#/piv")).should("have.text", "immediate value: Hello!");
    cy.get(cesc2("#/pv")).should("have.text", "value: Hello!");

    cy.get(cesc2("#/ti_input")).blur();

    cy.get(cesc2("#/piv")).should(
      "have.text",
      "immediate value: Hello!\nSelam!",
    );
    cy.get(cesc2("#/pv")).should("have.text", "value: Hello!\nSelam!");
    cy.get(cesc2("#/piv2")).should(
      "have.text",
      "immediate value: Hello!\nSelam!",
    );
    cy.get(cesc2("#/pv2")).should("have.text", "value: Hello!\nSelam!");

    cy.get(cesc("#\\/ce") + " .cm-content").type("{ctrl+end}{enter}Kaixo!", {
      delay: 0,
    });
    cy.get(cesc2("#/piv")).should(
      "have.text",
      "immediate value: Hello!\nSelam!\nKaixo!",
    );
    cy.get(cesc2("#/pv")).should("have.text", "value: Hello!\nSelam!");
    cy.get(cesc2("#/piv2")).should(
      "have.text",
      "immediate value: Hello!\nSelam!",
    );
    cy.get(cesc2("#/pv2")).should("have.text", "value: Hello!\nSelam!");

    cy.get(cesc("#\\/ce") + " .cm-content").blur();

    cy.get(cesc2("#/piv2")).should(
      "have.text",
      "immediate value: Hello!\nSelam!\nKaixo!",
    );
    cy.get(cesc2("#/pv2")).should("have.text", "value: Hello!\nSelam!\nKaixo!");
    cy.get(cesc2("#/piv")).should(
      "have.text",
      "immediate value: Hello!\nSelam!\nKaixo!",
    );
    cy.get(cesc2("#/pv")).should("have.text", "value: Hello!\nSelam!\nKaixo!");
  });
});
