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

    <p>$_codeeditor1.immediateValue</p>
    <p>$_codeeditor1.value</p>
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

    <p>$_codeeditor1.immediateValue</p>
    <p>$_codeeditor1.value</p>
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

      cy.get(cesc2(`#${viewerName}/_document1`)).should("exist");

      cy.get(cesc("#\\/_p1")).should("have.text", "");
      cy.get(cesc("#\\/_p2")).should("have.text", "");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq("");
      });

      cy.log("type text in editor");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type("<p>Hello!</p>", {
        delay: 0,
      });

      cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p2")).should("have.text", "");
      cy.get(cesc2(`#${viewerName}/_document1`)).should("exist");
      cy.get(cesc2(`#${viewerName}/_p1`)).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq("");
      });

      cy.log("blur updates value but not content");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").blur();

      cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc2(`#${viewerName}/_document1`)).should("exist");
      cy.get(cesc2(`#${viewerName}/_p1`)).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>",
        );
      });

      cy.log("click to update content");
      cy.get(updateAnchor).click();

      cy.get(cesc2(`#${viewerName}/_p1`)).should("have.text", "Hello!");
      cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>",
        );
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

      cy.get(cesc2(`#${viewerName}/_p1`)).should("have.text", "Hello!");
      cy.get(cesc2(`#${viewerName}/_p2`)).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>",
        );
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

      cy.get(cesc2(`#${viewerName}/_p1`)).should("have.text", "Hello!");
      cy.get(cesc2(`#${viewerName}/_p2`)).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
      });

      cy.log("click to update content");
      cy.get(updateAnchor).click();

      cy.get(cesc2(`#${viewerName}/_p2`)).should("contain.text", "2");

      cy.get(cesc("#\\/_p1")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );
      cy.get(cesc("#\\/_p2")).should(
        "have.text",
        "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
      );

      cy.get(cesc2(`#${viewerName}/_p1`)).should("have.text", "Hello!");
      cy.get(cesc2(`#${viewerName}/_p2`) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "2");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_codeeditor1"].stateValues.immediateValue).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        expect(stateVariables["/_codeeditor1"].stateValues.value).eq(
          "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
      });
    });
  });

  // TODO: if we can find a way to communicate with the rendered DoenetML again,
  // we should revive these next two tests
  it.skip("code editor with renderedName", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <codeEditor showResults renderedName="result" />

    <p>$_codeeditor1.immediateValue</p>
    <p>$_codeeditor1.value</p>

    <p>The value of the entered math is $(/result/_math1.value{assignNames="m1"})</p>
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

  it.skip("code editor with renderedName and staticName", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <codeEditor showResults renderedName="result" staticName="static" />

    <p name="px">The value of the dynamic math is $(/result/x.value{assignNames="x"})</p>
    <p name="psx">The value of the static math is $(/static/x.value{assignNames="sx"})</p>
    <p name="pP">The coords of the dynamic point are $(/result/P.coords{assignNames="P"})</p>
    <p name="psP">The coords of the static point are $(/static/P.coords{assignNames="sP"})</p>
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
    <codeEditor showResults prefill="<text>hello</text> <text>there</text>" />

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

      cy.get(contentAnchor).should("contain.text", "hello there");
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

  it("undo prompts save", () => {
    let doenetML = `
    <text>a</text>
    <codeEditor showResults />

    <p>$_codeeditor1.value</p>
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

    cy.get(cesc("#\\/_text1")).should("contain.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let viewerName =
        stateVariables["/_codeeditor1"].activeChildren[0].componentName;
      let updateAnchor = "#" + cesc2(viewerName) + "_updateButton";
      let contentAnchor = "#" + cesc2(viewerName) + "_content";

      cy.get(cesc2("#/_p1")).should("have.text", "");

      cy.log("type text in editor");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type("<p>Hello!</p>", {
        delay: 0,
      });
      cy.get(updateAnchor).click();

      cy.get(cesc2("#/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(contentAnchor).should("contain.text", "Hello!");

      cy.wait(1500); // wait for 1 second debounce

      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
          },
          "*",
        );
      });

      cy.get(cesc2("#/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(contentAnchor).should("contain.text", "Hello!");

      cy.log("Overwrite text");

      if (Cypress.platform === "darwin") {
        cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type(
          "{command+a}<alert>Ovewritten!</alert>",
          {
            delay: 0,
          },
        );
      } else {
        cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type(
          "{control+a}<alert>Ovewritten!</alert>",
          {
            delay: 0,
          },
        );
      }
      cy.get(updateAnchor).click();

      cy.get(cesc2("#/_p1")).should("have.text", "<alert>Ovewritten!</alert>");
      cy.get(contentAnchor).should("not.contain.text", "Hello!");
      cy.get(contentAnchor).should("contain.text", "Ovewritten!");

      cy.wait(1500); // wait for 1 second debounce

      if (Cypress.platform === "darwin") {
        cy.get(".cm-content").type("{command}{z}");
      } else {
        cy.get(".cm-content").type("{control}{z}");
      }
      cy.get(updateAnchor).click();

      cy.get(cesc2("#/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(contentAnchor).should("contain.text", "Hello!");
      cy.get(contentAnchor).should("not.contain.text", "Ovewritten!");

      cy.wait(1500); // wait for 1 second debounce

      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
          },
          "*",
        );
      });

      cy.get(cesc2("#/_p1")).should("have.text", "<p>Hello!</p>");
      cy.get(contentAnchor).should("contain.text", "Hello!");
      cy.get(contentAnchor).should("not.contain.text", "Ovewritten!");
    });
  });

  it("recover from invalid doenetML", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <text>a</text>
        <codeEditor showResults />
    
        <p>$_codeeditor1.value</p>
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

      cy.get(cesc2("#/_p1")).should("have.text", "");

      cy.log("type text in editor");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type("<p>Hello!</p>", {
        delay: 0,
      });

      // Note: for some reason, have to type {enter} more slowly
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type("{end}{enter}");
      cy.get(updateAnchor).click();

      cy.get(cesc2("#/_p1")).should("have.text", "<p>Hello!</p>\n");
      cy.get(contentAnchor).should("contain.text", "Hello!");

      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type(
        "{ctrl+end}<text name='ti'>$ti</text>",
        {
          delay: 0,
        },
      );
      // Note: for some reason, have to type {enter} more slowly
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type("{end}{enter}");
      cy.get(updateAnchor).click();

      cy.get(cesc2("#/_p1")).should(
        "have.text",
        "<p>Hello!</p>\n<text name='ti'>$ti</text>\n",
      );

      cy.get(contentAnchor).should("contain.text", "Circular dependency");

      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type(
        "{ctrl+end}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{backspace}{backspace}{backspace}Bye",
        {
          delay: 0,
        },
      );

      cy.get(updateAnchor).click();

      cy.get(cesc2("#/_p1")).should(
        "have.text",
        "<p>Hello!</p>\n<text name='ti'>Bye</text>\n",
      );

      cy.get(contentAnchor).should("contain.text", "Hello!\nBye");
    });
  });

  it("Multiple code editors", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <text>a</text>
        <codeEditor showResults />
    
        <p>$_codeeditor1.value</p>


        <codeEditor showResults />
    
        <p>$_codeeditor2.value</p>

        <codeEditor showResults />
    
        <p>$_codeeditor3.value</p>
        `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("contain.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let viewer1Name =
        stateVariables["/_codeeditor1"].activeChildren[0].componentName;
      let updateAnchor1 = "#" + cesc2(viewer1Name) + "_updateButton";
      let contentAnchor1 = "#" + cesc2(viewer1Name) + "_content";

      let viewer2Name =
        stateVariables["/_codeeditor2"].activeChildren[0].componentName;
      let updateAnchor2 = "#" + cesc2(viewer2Name) + "_updateButton";
      let contentAnchor2 = "#" + cesc2(viewer2Name) + "_content";

      let viewer3Name =
        stateVariables["/_codeeditor3"].activeChildren[0].componentName;
      let updateAnchor3 = "#" + cesc2(viewer3Name) + "_updateButton";
      let contentAnchor3 = "#" + cesc2(viewer3Name) + "_content";

      cy.log("type text in editor 1");
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type("<p>Apple</p>", {
        delay: 0,
      });
      // Note: for some reason, have to type {enter} more slowly
      cy.get(cesc("#\\/_codeeditor1") + " .cm-content").type("{end}{enter}");

      cy.get(updateAnchor1).click();

      cy.get(cesc2("#/_p1")).should("have.text", "<p>Apple</p>\n");
      cy.get(contentAnchor1).should("contain.text", "Apple");

      cy.log("type text in editor 2");
      cy.get(cesc("#\\/_codeeditor2") + " .cm-content").type("<p>Banana</p>", {
        delay: 0,
      });
      // Note: for some reason, have to type {enter} more slowly
      cy.get(cesc("#\\/_codeeditor2") + " .cm-content").type("{end}{enter}");
      cy.get(updateAnchor2).click();

      cy.get(cesc2("#/_p2")).should("have.text", "<p>Banana</p>\n");
      cy.get(contentAnchor2).should("contain.text", "Banana");

      cy.log("type text in editor 3");
      cy.get(cesc("#\\/_codeeditor3") + " .cm-content").type("<p>Cherry</p>", {
        delay: 0,
      });
      // Note: for some reason, have to type {enter} more slowly
      cy.get(cesc("#\\/_codeeditor3") + " .cm-content").type("{end}{enter}");
      cy.get(updateAnchor3).click();

      cy.get(cesc2("#/_p3")).should("have.text", "<p>Cherry</p>\n");
      cy.get(contentAnchor3).should("contain.text", "Cherry");
    });
  });

  it("valueChanged", () => {
    let doenetML = `
    <codeEditor name="ce1" /> <p><text copySource="ce1" name="ce1a" /> <boolean copysource="ce1.valueChanged" name="ce1changed" /> <text copySource="ce1.immediateValue" name="ce1iva" /> <boolean copysource="ce1.immediateValueChanged" name="ce1ivchanged" /></p>
    <codeEditor name="ce2" prefill="apple" /> <p><text copySource="ce2" name="ce2a" /> <boolean copysource="ce2.valueChanged" name="ce2changed" /> <text copySource="ce2.immediateValue" name="ce2iva" /> <boolean copysource="ce2.immediateValueChanged" name="ce2ivchanged" /></p>
    <codeEditor name="ce3" bindValueTo="$ce1" /> <p><text copySource="ce3" name="ce3a" /> <boolean copysource="ce3.valueChanged" name="ce3changed" /> <text copySource="ce3.immediateValue" name="ce3iva" /> <boolean copysource="ce3.immediateValueChanged" name="ce3ivchanged" /></p>
    <codeEditor name="ce4" bindValueTo="$ce2.immediateValue" /> <p><text copySource="ce4" name="ce4a" /> <boolean copysource="ce4.valueChanged" name="ce4changed" /> <text copySource="ce4.immediateValue" name="ce4iva" /> <boolean copysource="ce4.immediateValueChanged" name="ce4ivchanged" /></p>

    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ce1a")).should("have.text", "");
    cy.get(cesc2("#/ce2a")).should("have.text", "apple");
    cy.get(cesc2("#/ce3a")).should("have.text", "");
    cy.get(cesc2("#/ce4a")).should("have.text", "apple");

    cy.get(cesc2("#/ce1iva")).should("have.text", "");
    cy.get(cesc2("#/ce2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ce3iva")).should("have.text", "");
    cy.get(cesc2("#/ce4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ce1changed")).should("have.text", "false");
    cy.get(cesc2("#/ce2changed")).should("have.text", "false");
    cy.get(cesc2("#/ce3changed")).should("have.text", "false");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "false");

    cy.log("type in first marks only first immediate value as changed");

    cy.get(cesc2("#/ce1") + " .cm-content").type("banana");

    cy.get(cesc2("#/ce1iva")).should("have.text", "banana");

    cy.get(cesc2("#/ce1a")).should("have.text", "");
    cy.get(cesc2("#/ce2a")).should("have.text", "apple");
    cy.get(cesc2("#/ce3a")).should("have.text", "");
    cy.get(cesc2("#/ce4a")).should("have.text", "apple");

    cy.get(cesc2("#/ce1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ce3iva")).should("have.text", "");
    cy.get(cesc2("#/ce4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ce1changed")).should("have.text", "false");
    cy.get(cesc2("#/ce2changed")).should("have.text", "false");
    cy.get(cesc2("#/ce3changed")).should("have.text", "false");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "false");

    cy.log("blur in first marks only first value as changed");

    cy.get(cesc2("#/ce1") + " .cm-content").blur();

    cy.get(cesc2("#/ce1a")).should("have.text", "banana");

    cy.get(cesc2("#/ce1a")).should("have.text", "banana");
    cy.get(cesc2("#/ce2a")).should("have.text", "apple");
    cy.get(cesc2("#/ce3a")).should("have.text", "banana");
    cy.get(cesc2("#/ce4a")).should("have.text", "apple");

    cy.get(cesc2("#/ce1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ce3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ce1changed")).should("have.text", "true");
    cy.get(cesc2("#/ce2changed")).should("have.text", "false");
    cy.get(cesc2("#/ce3changed")).should("have.text", "false");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "false");

    cy.log("type in second marks only second immediate value as changed");

    cy.get(cesc2("#/ce2") + " .cm-content")
      .clear()
      .type("cherry", {
        force: true,
      });

    cy.get(cesc2("#/ce2iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1a")).should("have.text", "banana");
    cy.get(cesc2("#/ce2a")).should("have.text", "apple");
    cy.get(cesc2("#/ce3a")).should("have.text", "banana");
    cy.get(cesc2("#/ce4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ce3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1changed")).should("have.text", "true");
    cy.get(cesc2("#/ce2changed")).should("have.text", "false");
    cy.get(cesc2("#/ce3changed")).should("have.text", "false");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "false");

    cy.log("blur in second marks only second value as changed");

    cy.get(cesc2("#/ce2") + " .cm-content").blur();

    cy.get(cesc2("#/ce2a")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1a")).should("have.text", "banana");
    cy.get(cesc2("#/ce2a")).should("have.text", "cherry");
    cy.get(cesc2("#/ce3a")).should("have.text", "banana");
    cy.get(cesc2("#/ce4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ce3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1changed")).should("have.text", "true");
    cy.get(cesc2("#/ce2changed")).should("have.text", "true");
    cy.get(cesc2("#/ce3changed")).should("have.text", "false");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "false");

    cy.log("type in third marks third immediate value as changed");

    cy.get(cesc2("#/ce3") + " .cm-content")
      .clear()
      .type("dragonfruit", {
        force: true,
      });

    cy.get(cesc2("#/ce3iva")).should("have.text", "dragonfruit");

    cy.get(cesc2("#/ce1a")).should("have.text", "banana");
    cy.get(cesc2("#/ce2a")).should("have.text", "cherry");
    cy.get(cesc2("#/ce3a")).should("have.text", "banana");
    cy.get(cesc2("#/ce4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ce3iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1changed")).should("have.text", "true");
    cy.get(cesc2("#/ce2changed")).should("have.text", "true");
    cy.get(cesc2("#/ce3changed")).should("have.text", "false");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "false");

    cy.log("blur in third marks third value as changed");

    cy.get(cesc2("#/ce3") + " .cm-content").blur();

    cy.get(cesc2("#/ce3a")).should("have.text", "dragonfruit");

    cy.get(cesc2("#/ce1a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce2a")).should("have.text", "cherry");
    cy.get(cesc2("#/ce3a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ce3iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1changed")).should("have.text", "true");
    cy.get(cesc2("#/ce2changed")).should("have.text", "true");
    cy.get(cesc2("#/ce3changed")).should("have.text", "true");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "false");

    cy.log("type in fourth marks fourth immediate value as changed");

    cy.get(cesc2("#/ce4") + " .cm-content")
      .clear()
      .type("eggplant", {
        force: true,
      });

    cy.get(cesc2("#/ce4iva")).should("have.text", "eggplant");

    cy.get(cesc2("#/ce1a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce2a")).should("have.text", "cherry");
    cy.get(cesc2("#/ce3a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ce3iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce4iva")).should("have.text", "eggplant");

    cy.get(cesc2("#/ce1changed")).should("have.text", "true");
    cy.get(cesc2("#/ce2changed")).should("have.text", "true");
    cy.get(cesc2("#/ce3changed")).should("have.text", "true");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "true");

    cy.log("blur in fourth marks fourth value as changed");

    cy.get(cesc2("#/ce4") + " .cm-content").blur();

    cy.get(cesc2("#/ce4a")).should("have.text", "eggplant");

    cy.get(cesc2("#/ce1a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce2a")).should("have.text", "eggplant");
    cy.get(cesc2("#/ce3a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce4a")).should("have.text", "eggplant");

    cy.get(cesc2("#/ce1iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce2iva")).should("have.text", "eggplant");
    cy.get(cesc2("#/ce3iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ce4iva")).should("have.text", "eggplant");

    cy.get(cesc2("#/ce1changed")).should("have.text", "true");
    cy.get(cesc2("#/ce2changed")).should("have.text", "true");
    cy.get(cesc2("#/ce3changed")).should("have.text", "true");
    cy.get(cesc2("#/ce4changed")).should("have.text", "true");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "true");

    cy.log("reload");
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ce1a")).should("have.text", "");
    cy.get(cesc2("#/ce2a")).should("have.text", "apple");
    cy.get(cesc2("#/ce3a")).should("have.text", "");
    cy.get(cesc2("#/ce4a")).should("have.text", "apple");

    cy.get(cesc2("#/ce1iva")).should("have.text", "");
    cy.get(cesc2("#/ce2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ce3iva")).should("have.text", "");
    cy.get(cesc2("#/ce4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ce1changed")).should("have.text", "false");
    cy.get(cesc2("#/ce2changed")).should("have.text", "false");
    cy.get(cesc2("#/ce3changed")).should("have.text", "false");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "false");

    cy.log("type in third marks only third immediate value as changed");

    cy.get(cesc2("#/ce3") + " .cm-content").type("banana");

    cy.get(cesc2("#/ce3iva")).should("have.text", "banana");

    cy.get(cesc2("#/ce1a")).should("have.text", "");
    cy.get(cesc2("#/ce2a")).should("have.text", "apple");
    cy.get(cesc2("#/ce3a")).should("have.text", "");
    cy.get(cesc2("#/ce4a")).should("have.text", "apple");

    cy.get(cesc2("#/ce1iva")).should("have.text", "");
    cy.get(cesc2("#/ce2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ce3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ce1changed")).should("have.text", "false");
    cy.get(cesc2("#/ce2changed")).should("have.text", "false");
    cy.get(cesc2("#/ce3changed")).should("have.text", "false");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "false");

    cy.log(
      "blur in third marks first and third value/immediateValue as changed",
    );

    cy.get(cesc2("#/ce3") + " .cm-content").blur();

    cy.get(cesc2("#/ce3a")).should("have.text", "banana");

    cy.get(cesc2("#/ce1a")).should("have.text", "banana");
    cy.get(cesc2("#/ce2a")).should("have.text", "apple");
    cy.get(cesc2("#/ce3a")).should("have.text", "banana");
    cy.get(cesc2("#/ce4a")).should("have.text", "apple");

    cy.get(cesc2("#/ce1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ce3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ce1changed")).should("have.text", "true");
    cy.get(cesc2("#/ce2changed")).should("have.text", "false");
    cy.get(cesc2("#/ce3changed")).should("have.text", "true");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "false");

    cy.log("type in fourth marks only fourth immediate value as changed");

    cy.get(cesc2("#/ce4") + " .cm-content")
      .clear()
      .type("cherry", {
        force: true,
      });

    cy.get(cesc2("#/ce4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1a")).should("have.text", "banana");
    cy.get(cesc2("#/ce2a")).should("have.text", "apple");
    cy.get(cesc2("#/ce3a")).should("have.text", "banana");
    cy.get(cesc2("#/ce4a")).should("have.text", "apple");

    cy.get(cesc2("#/ce1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ce3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1changed")).should("have.text", "true");
    cy.get(cesc2("#/ce2changed")).should("have.text", "false");
    cy.get(cesc2("#/ce3changed")).should("have.text", "true");
    cy.get(cesc2("#/ce4changed")).should("have.text", "false");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "true");

    cy.log(
      "blur in fourth marks third and fourth value/immediateValue as changed",
    );

    cy.get(cesc2("#/ce4") + " .cm-content").blur();

    cy.get(cesc2("#/ce4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1a")).should("have.text", "banana");
    cy.get(cesc2("#/ce2a")).should("have.text", "cherry");
    cy.get(cesc2("#/ce3a")).should("have.text", "banana");
    cy.get(cesc2("#/ce4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ce3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ce4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ce1changed")).should("have.text", "true");
    cy.get(cesc2("#/ce2changed")).should("have.text", "true");
    cy.get(cesc2("#/ce3changed")).should("have.text", "true");
    cy.get(cesc2("#/ce4changed")).should("have.text", "true");

    cy.get(cesc2("#/ce1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ce4ivchanged")).should("have.text", "true");
  });

  it("viewer ratio", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
          <codeEditor name="ce1" showResults ><graph/></codeEditor>
          <codeEditor name="ce2" showResults viewerRatio="0.7" ><graph/></codeEditor>
          <codeEditor name="ce3" showResults resultsLocation="left"><graph/></codeEditor>
          <codeEditor name="ce4" showResults resultsLocation="left" viewerRatio="0.7" ><graph/></codeEditor>
          <codeEditor name="ce5" showResults resultsLocation="right" ><graph/></codeEditor>
          <codeEditor name="ce6" showResults resultsLocation="right" viewerRatio="0.7" ><graph/></codeEditor>
      
          `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ce1_editor")).should("have.css", "width", "850px");
    cy.get(cesc2("#/ce1_editor"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 200, 20);
    cy.get(cesc2("#/ce1_viewer")).should("have.css", "width", "850px");
    cy.get(cesc2("#/ce1_viewer")).should("have.css", "height", "200px");

    cy.get(cesc2("#/ce2_editor")).should("have.css", "width", "850px");
    cy.get(cesc2("#/ce2_editor"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 120, 20);
    cy.get(cesc2("#/ce2_viewer")).should("have.css", "width", "850px");
    cy.get(cesc2("#/ce2_viewer")).should("have.css", "height", "280px");

    cy.get(cesc2("#/ce3_editor")).should("have.css", "width", "425px");
    cy.get(cesc2("#/ce3_editor")).should("have.css", "height", "400px");
    cy.get(cesc2("#/ce3_viewer")).should("have.css", "width", "410px");
    cy.get(cesc2("#/ce3_viewer"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 400, 5);

    cy.get(cesc2("#/ce4_editor")).should("have.css", "width", "255px");
    cy.get(cesc2("#/ce4_editor")).should("have.css", "height", "400px");
    cy.get(cesc2("#/ce4_viewer")).should("have.css", "width", "580px");
    cy.get(cesc2("#/ce4_viewer"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 400, 5);

    cy.get(cesc2("#/ce5_editor")).should("have.css", "width", "410px");
    cy.get(cesc2("#/ce5_editor")).should("have.css", "height", "400px");
    cy.get(cesc2("#/ce5_viewer")).should("have.css", "width", "425px");
    cy.get(cesc2("#/ce5_viewer"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 400, 5);

    cy.get(cesc2("#/ce6_editor")).should("have.css", "width", "240px");
    cy.get(cesc2("#/ce6_editor")).should("have.css", "height", "400px");
    cy.get(cesc2("#/ce6_viewer")).should("have.css", "width", "595px");
    cy.get(cesc2("#/ce6_viewer"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 400, 5);
  });

  it("viewer ratio and change size", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
          <codeEditor name="ce1" width="600px" height="500px" showResults ><graph/></codeEditor>
          <codeEditor name="ce2" width="600px" height="500px" showResults viewerRatio="0.7" ><graph/></codeEditor>
          <codeEditor name="ce3" width="600px" height="500px" showResults resultsLocation="left"><graph/></codeEditor>
          <codeEditor name="ce4" width="600px" height="500px" showResults resultsLocation="left" viewerRatio="0.7" ><graph/></codeEditor>
          <codeEditor name="ce5" width="600px" height="500px" showResults resultsLocation="right" ><graph/></codeEditor>
          <codeEditor name="ce6" width="600px" height="500px" showResults resultsLocation="right" viewerRatio="0.7" ><graph/></codeEditor>
      
          `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ce1_editor")).should("have.css", "width", "600px");
    cy.get(cesc2("#/ce1_editor"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 250, 20);
    cy.get(cesc2("#/ce1_viewer")).should("have.css", "width", "600px");
    cy.get(cesc2("#/ce1_viewer")).should("have.css", "height", "250px");

    cy.get(cesc2("#/ce2_editor")).should("have.css", "width", "600px");
    cy.get(cesc2("#/ce2_editor"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 150, 20);
    cy.get(cesc2("#/ce2_viewer")).should("have.css", "width", "600px");
    cy.get(cesc2("#/ce2_viewer")).should("have.css", "height", "350px");

    cy.get(cesc2("#/ce3_editor")).should("have.css", "width", "300px");
    cy.get(cesc2("#/ce3_editor")).should("have.css", "height", "500px");
    cy.get(cesc2("#/ce3_viewer")).should("have.css", "width", "285px");
    cy.get(cesc2("#/ce3_viewer"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 500, 5);

    cy.get(cesc2("#/ce4_editor")).should("have.css", "width", "180px");
    cy.get(cesc2("#/ce4_editor")).should("have.css", "height", "500px");
    cy.get(cesc2("#/ce4_viewer")).should("have.css", "width", "405px");
    cy.get(cesc2("#/ce4_viewer"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 500, 5);

    cy.get(cesc2("#/ce5_editor")).should("have.css", "width", "285px");
    cy.get(cesc2("#/ce5_editor")).should("have.css", "height", "500px");
    cy.get(cesc2("#/ce5_viewer")).should("have.css", "width", "300px");
    cy.get(cesc2("#/ce5_viewer"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 500, 5);

    cy.get(cesc2("#/ce6_editor")).should("have.css", "width", "165px");
    cy.get(cesc2("#/ce6_editor")).should("have.css", "height", "500px");
    cy.get(cesc2("#/ce6_viewer")).should("have.css", "width", "420px");
    cy.get(cesc2("#/ce6_viewer"))
      .invoke("css", "height")
      .then((str) => parseInt(str))
      .should("be.closeTo", 500, 5);
  });

  it("ignore variants from children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
          <text>a</text>
          <codeEditor name="ce1" showResults ><selectFromSequence/></codeEditor>
          `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc2("#/_text1")).should("have.text", "a");

    cy.log("Have only one variant despite selectFromSequence child");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a"]);
    });
  });
});
