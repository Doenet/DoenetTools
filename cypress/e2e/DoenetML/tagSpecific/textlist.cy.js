import { cesc } from "../../../../src/_utils/url";

describe("TextList Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("textlist within textlists", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p><textlist hide="true">a b c</textlist></p>

    <p><copy hide="false" target="_textlist1" /></p>

    <p><textlist>
      <text>hello</text>
      <copy target="_textlist1" hide="false" />
      <text>bye</text>
      <copy target="_copy1" />
    </textlist></p>

    <p><copy maxNumber="6" target="_textlist2" /></p>

    <p><copy prop="text" target="_textlist2" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_p1")).should("have.text", "");
    cy.get(cesc("#\\/_p2")).should("have.text", "a, b, c");
    cy.get(cesc("#\\/_p3")).should("have.text", "hello, a, b, c, bye, a, b, c");
    cy.get(cesc("#\\/_p4")).should("have.text", "hello, a, b, c, bye, a");
    cy.get(cesc("#\\/_p5")).should("have.text", "hello, a, b, c, bye, a, b, c");
  });

  it("textlist with textlist children, test inverse", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p><textlist>
        <text>a</text>
        <textlist>q r</textlist>
        <text>h</text>
        <textlist>
          <textlist>
            <text>b</text>
            <textlist>u v</textlist>
          </textlist>
          <textlist>i j</textlist>
        </textlist>
      </textlist></p>
  
      <textinput bindValueTo="$(_textlist1.text1)" />
      <textinput bindValueTo="$(_textlist1.text2)" />
      <textinput bindValueTo="$(_textlist1.text3)" />
      <textinput bindValueTo="$(_textlist1.text4)" />
      <textinput bindValueTo="$(_textlist1.text5)" />
      <textinput bindValueTo="$(_textlist1.text6)" />
      <textinput bindValueTo="$(_textlist1.text7)" />
      <textinput bindValueTo="$(_textlist1.text8)" />
      <textinput bindValueTo="$(_textlist1.text9)" />
  
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should("have.text", "a, q, r, h, b, u, v, i, j");

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "a");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "q");
    cy.get(cesc("#\\/_textinput3_input")).should("have.value", "r");
    cy.get(cesc("#\\/_textinput4_input")).should("have.value", "h");
    cy.get(cesc("#\\/_textinput5_input")).should("have.value", "b");
    cy.get(cesc("#\\/_textinput6_input")).should("have.value", "u");
    cy.get(cesc("#\\/_textinput7_input")).should("have.value", "v");
    cy.get(cesc("#\\/_textinput8_input")).should("have.value", "i");
    cy.get(cesc("#\\/_textinput9_input")).should("have.value", "j");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textlist1"].stateValues.texts[0]).eq("a");
      expect(stateVariables["/_textlist1"].stateValues.texts[1]).eq("q");
      expect(stateVariables["/_textlist1"].stateValues.texts[2]).eq("r");
      expect(stateVariables["/_textlist1"].stateValues.texts[3]).eq("h");
      expect(stateVariables["/_textlist1"].stateValues.texts[4]).eq("b");
      expect(stateVariables["/_textlist1"].stateValues.texts[5]).eq("u");
      expect(stateVariables["/_textlist1"].stateValues.texts[6]).eq("v");
      expect(stateVariables["/_textlist1"].stateValues.texts[7]).eq("i");
      expect(stateVariables["/_textlist1"].stateValues.texts[8]).eq("j");
      expect(stateVariables["/_textlist2"].stateValues.texts[0]).eq("q");
      expect(stateVariables["/_textlist2"].stateValues.texts[1]).eq("r");
      expect(stateVariables["/_textlist3"].stateValues.texts[0]).eq("b");
      expect(stateVariables["/_textlist3"].stateValues.texts[1]).eq("u");
      expect(stateVariables["/_textlist3"].stateValues.texts[2]).eq("v");
      expect(stateVariables["/_textlist3"].stateValues.texts[3]).eq("i");
      expect(stateVariables["/_textlist3"].stateValues.texts[4]).eq("j");
      expect(stateVariables["/_textlist4"].stateValues.texts[0]).eq("b");
      expect(stateVariables["/_textlist4"].stateValues.texts[1]).eq("u");
      expect(stateVariables["/_textlist4"].stateValues.texts[2]).eq("v");
      expect(stateVariables["/_textlist5"].stateValues.texts[0]).eq("u");
      expect(stateVariables["/_textlist5"].stateValues.texts[1]).eq("v");
      expect(stateVariables["/_textlist6"].stateValues.texts[0]).eq("i");
      expect(stateVariables["/_textlist6"].stateValues.texts[1]).eq("j");
    });

    cy.log("change values");

    cy.get(cesc("#\\/_textinput1_input")).clear().type("1{enter}");
    cy.get(cesc("#\\/_textinput2_input")).clear().type("2{enter}");
    cy.get(cesc("#\\/_textinput3_input")).clear().type("3{enter}");
    cy.get(cesc("#\\/_textinput4_input")).clear().type("4{enter}");
    cy.get(cesc("#\\/_textinput5_input")).clear().type("5{enter}");
    cy.get(cesc("#\\/_textinput6_input")).clear().type("6{enter}");
    cy.get(cesc("#\\/_textinput7_input")).clear().type("7{enter}");
    cy.get(cesc("#\\/_textinput8_input")).clear().type("8{enter}");
    cy.get(cesc("#\\/_textinput9_input")).clear().type("9{enter}");

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should("have.text", "1, 2, 3, 4, 5, 6, 7, 8, 9");

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "1");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "2");
    cy.get(cesc("#\\/_textinput3_input")).should("have.value", "3");
    cy.get(cesc("#\\/_textinput4_input")).should("have.value", "4");
    cy.get(cesc("#\\/_textinput5_input")).should("have.value", "5");
    cy.get(cesc("#\\/_textinput6_input")).should("have.value", "6");
    cy.get(cesc("#\\/_textinput7_input")).should("have.value", "7");
    cy.get(cesc("#\\/_textinput8_input")).should("have.value", "8");
    cy.get(cesc("#\\/_textinput9_input")).should("have.value", "9");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textlist1"].stateValues.texts[0]).eq("1");
      expect(stateVariables["/_textlist1"].stateValues.texts[1]).eq("2");
      expect(stateVariables["/_textlist1"].stateValues.texts[2]).eq("3");
      expect(stateVariables["/_textlist1"].stateValues.texts[3]).eq("4");
      expect(stateVariables["/_textlist1"].stateValues.texts[4]).eq("5");
      expect(stateVariables["/_textlist1"].stateValues.texts[5]).eq("6");
      expect(stateVariables["/_textlist1"].stateValues.texts[6]).eq("7");
      expect(stateVariables["/_textlist1"].stateValues.texts[7]).eq("8");
      expect(stateVariables["/_textlist1"].stateValues.texts[8]).eq("9");
      expect(stateVariables["/_textlist2"].stateValues.texts[0]).eq("2");
      expect(stateVariables["/_textlist2"].stateValues.texts[1]).eq("3");
      expect(stateVariables["/_textlist3"].stateValues.texts[0]).eq("5");
      expect(stateVariables["/_textlist3"].stateValues.texts[1]).eq("6");
      expect(stateVariables["/_textlist3"].stateValues.texts[2]).eq("7");
      expect(stateVariables["/_textlist3"].stateValues.texts[3]).eq("8");
      expect(stateVariables["/_textlist3"].stateValues.texts[4]).eq("9");
      expect(stateVariables["/_textlist4"].stateValues.texts[0]).eq("5");
      expect(stateVariables["/_textlist4"].stateValues.texts[1]).eq("6");
      expect(stateVariables["/_textlist4"].stateValues.texts[2]).eq("7");
      expect(stateVariables["/_textlist5"].stateValues.texts[0]).eq("6");
      expect(stateVariables["/_textlist5"].stateValues.texts[1]).eq("7");
      expect(stateVariables["/_textlist6"].stateValues.texts[0]).eq("8");
      expect(stateVariables["/_textlist6"].stateValues.texts[1]).eq("9");
    });
  });

  it("textlist does not force composite replacement, even in boolean", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <boolean>
      <textlist>$nothing</textlist> = <textlist></textlist>
    </boolean>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("copy textlist and overwrite maximum number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p><textlist name="tl1">a b c d e</textlist></p>
      <p><copy target="tl1" maxNumber="3" assignNames="tl2" /></p>
      <p><copy target="tl2" maxNumber="" assignNames="tl3" /></p>

      <p><textlist name="tl4" maxNumber="3">a b c d e</textlist></p>
      <p><copy target="tl4" maxNumber="4" assignNames="tl5" /></p>
      <p><copy target="tl5" maxNumber="" assignNames="tl6" /></p>

      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/_p1")).should("have.text", "a, b, c, d, e");
      cy.get(cesc("#\\/_p2")).should("have.text", "a, b, c");
      cy.get(cesc("#\\/_p3")).should("have.text", "a, b, c, d, e");

      cy.get(cesc("#\\/_p4")).should("have.text", "a, b, c");
      cy.get(cesc("#\\/_p5")).should("have.text", "a, b, c, d");
      cy.get(cesc("#\\/_p6")).should("have.text", "a, b, c, d, e");

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/tl1"].stateValues.texts).eqls([
          "a",
          "b",
          "c",
          "d",
          "e",
        ]);
        expect(stateVariables["/tl2"].stateValues.texts).eqls(["a", "b", "c"]);
        expect(stateVariables["/tl3"].stateValues.texts).eqls([
          "a",
          "b",
          "c",
          "d",
          "e",
        ]);
        expect(stateVariables["/tl4"].stateValues.texts).eqls(["a", "b", "c"]);
        expect(stateVariables["/tl5"].stateValues.texts).eqls([
          "a",
          "b",
          "c",
          "d",
        ]);
        expect(stateVariables["/tl6"].stateValues.texts).eqls([
          "a",
          "b",
          "c",
          "d",
          "e",
        ]);
      });
    });
  });

  it("dynamic maximum number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p><textlist name="tl1" maxNumber="$mn1">a b c d e</textlist></p>
      <p><copy target="tl1" maxNumber="$mn2" assignNames="tl2" /></p>
      <p>Maximum number 1: <mathinput name="mn1" prefill="2" /></p>
      <p>Maximum number 2: <mathinput name="mn2" /></p>

      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/_p1")).should("have.text", "a, b");
      cy.get(cesc("#\\/_p2")).should("have.text", "a, b, c, d, e");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/tl1"].stateValues.texts).eqls(["a", "b"]);
        expect(stateVariables["/tl2"].stateValues.texts).eqls([
          "a",
          "b",
          "c",
          "d",
          "e",
        ]);
      });
    });

    cy.log("clear first maxnum");
    cy.get(cesc("#\\/mn1") + " textarea")
      .type("{end}{backspace}", { force: true })
      .blur();
    cy.get(cesc("#\\/_p1")).should("have.text", "a, b, c, d, e");
    cy.get(cesc("#\\/_p2")).should("have.text", "a, b, c, d, e");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/tl1"].stateValues.texts).eqls([
        "a",
        "b",
        "c",
        "d",
        "e",
      ]);
      expect(stateVariables["/tl2"].stateValues.texts).eqls([
        "a",
        "b",
        "c",
        "d",
        "e",
      ]);
    });

    cy.log("number in second maxnum");
    cy.get(cesc("#\\/mn2") + " textarea").type("3{enter}", { force: true });
    cy.get(cesc("#\\/_p2")).should("have.text", "a, b, c");
    cy.get(cesc("#\\/_p1")).should("have.text", "a, b, c, d, e");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/tl1"].stateValues.texts).eqls([
        "a",
        "b",
        "c",
        "d",
        "e",
      ]);
      expect(stateVariables["/tl2"].stateValues.texts).eqls(["a", "b", "c"]);
    });

    cy.log("number in first maxnum");
    cy.get(cesc("#\\/mn1") + " textarea").type("4{enter}", { force: true });
    cy.get(cesc("#\\/_p1")).should("have.text", "a, b, c, d");
    cy.get(cesc("#\\/_p2")).should("have.text", "a, b, c");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/tl1"].stateValues.texts).eqls([
        "a",
        "b",
        "c",
        "d",
      ]);
      expect(stateVariables["/tl2"].stateValues.texts).eqls(["a", "b", "c"]);
    });

    cy.log("change number in first maxnum");
    cy.get(cesc("#\\/mn1") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a");
    cy.get(cesc("#\\/_p2")).should("have.text", "a, b, c");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/tl1"].stateValues.texts).eqls(["a"]);
      expect(stateVariables["/tl2"].stateValues.texts).eqls(["a", "b", "c"]);
    });
  });
});
