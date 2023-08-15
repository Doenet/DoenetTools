import { cesc } from "../../../../src/utils/url";

describe("Sort Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("sort numbers and math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <aslist>
  <sort assignNames="x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13" name="s">
    <number>3</number>
    <math>pi</math>
    <math>1</math>
    <math>e</math>
    <number displayDigits="5">sqrt(2)</number>
    <math>sqrt(3)</math>
    <numberlist>-3 10 2</numberlist>
    <mathlist>log(2) 1/e sin(2) -2/3</mathlist>
  </sort>
  </aslist>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/x1")).should("have.text", "-3");
    cy.get(cesc("#\\/x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−23");
      });
    cy.get(cesc("#\\/x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1e");
      });
    cy.get(cesc("#\\/x4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("log(2)");
      });
    cy.get(cesc("#\\/x5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sin(2)");
      });
    cy.get(cesc("#\\/x6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/x7")).should("have.text", "1.4142");
    cy.get(cesc("#\\/x8"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("√3");
      });
    cy.get(cesc("#\\/x9")).should("have.text", "2");
    cy.get(cesc("#\\/x10"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/x11")).should("have.text", "3");

    cy.get(cesc("#\\/x12"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("π");
      });
    cy.get(cesc("#\\/x13")).should("have.text", "10");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).eq(-3);
      expect(stateVariables["/x2"].stateValues.value).eqls(["-", ["/", 2, 3]]);
      expect(stateVariables["/x3"].stateValues.value).eqls(["/", 1, "e"]);
      expect(stateVariables["/x4"].stateValues.value).eqls(["apply", "log", 2]);
      expect(stateVariables["/x5"].stateValues.value).eqls(["apply", "sin", 2]);
      expect(stateVariables["/x6"].stateValues.value).eqls(1);
      expect(stateVariables["/x7"].stateValues.value).closeTo(
        Math.sqrt(2),
        1e-14,
      );
      expect(stateVariables["/x8"].stateValues.value).eqls([
        "apply",
        "sqrt",
        3,
      ]);
      expect(stateVariables["/x9"].stateValues.value).eq(2);
      expect(stateVariables["/x10"].stateValues.value).eqls("e");
      expect(stateVariables["/x11"].stateValues.value).eq(3);
      expect(stateVariables["/x12"].stateValues.value).eqls("pi");
      expect(stateVariables["/x13"].stateValues.value).eq(10);
    });
  });

  it("sort dynamic maths", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>Values to sort: 
  <mathinput name="m1" prefill="sqrt(2)" />
  <mathinput name="m2" prefill="5/6" />
  <mathinput name="m3" prefill="Infinity" />
  <mathinput name="m4" prefill="-Infinity" />
  </p>
  <aslist>
  <sort assignNames="x1 x2 x3 x4 x5 x6" name="s">
    $m1$m2$m3
    <number>$m4</number>
    <number>70</number>
    <math>-pi</math>
  </sort>
  </aslist>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/x1")).should("have.text", "-∞");
    cy.get(cesc("#\\/x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−π");
      });
    cy.get(cesc("#\\/x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("56");
      });
    cy.get(cesc("#\\/x4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("√2");
      });
    cy.get(cesc("#\\/x5")).should("have.text", "70");
    cy.get(cesc("#\\/x6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("∞");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).eq(-Infinity);
      expect(stateVariables["/x2"].stateValues.value).eqls(["-", "pi"]);
      expect(stateVariables["/x3"].stateValues.value).eqls(["/", 5, 6]);
      expect(stateVariables["/x4"].stateValues.value).eqls([
        "apply",
        "sqrt",
        2,
      ]);
      expect(stateVariables["/x5"].stateValues.value).eq(70);
      expect(stateVariables["/x6"].stateValues.value).eqls(Infinity);
    });

    cy.log("change first value");
    cy.get(cesc("#\\/m1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}-5{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/x2")).should("contain.text", "−5");

    cy.get(cesc("#\\/x1")).should("have.text", "-∞");
    cy.get(cesc("#\\/x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−π");
      });
    cy.get(cesc("#\\/x4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("56");
      });
    cy.get(cesc("#\\/x5")).should("have.text", "70");

    cy.get(cesc("#\\/x6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("∞");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).eq(-Infinity);
      expect(stateVariables["/x2"].stateValues.value).eqls(-5);
      expect(stateVariables["/x3"].stateValues.value).eqls(["-", "pi"]);
      expect(stateVariables["/x4"].stateValues.value).eqls(["/", 5, 6]);
      expect(stateVariables["/x5"].stateValues.value).eq(70);
      expect(stateVariables["/x6"].stateValues.value).eqls(Infinity);
    });

    cy.log("change second value");
    cy.get(cesc("#\\/m2") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}e^5{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/x4")).should("have.text", "70");
    cy.get(cesc("#\\/x1")).should("have.text", "-∞");
    cy.get(cesc("#\\/x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−π");
      });
    cy.get(cesc("#\\/x5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e5");
      });
    cy.get(cesc("#\\/x6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("∞");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).eq(-Infinity);
      expect(stateVariables["/x2"].stateValues.value).eqls(-5);
      expect(stateVariables["/x3"].stateValues.value).eqls(["-", "pi"]);
      expect(stateVariables["/x4"].stateValues.value).eq(70);
      expect(stateVariables["/x5"].stateValues.value).eqls(["^", "e", 5]);
      expect(stateVariables["/x6"].stateValues.value).eqls(Infinity);
    });

    cy.log("change third value");
    cy.get(cesc("#\\/m3") + " textarea").type("{end}{backspace}-100{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/x5")).should("have.text", "70");
    cy.get(cesc("#\\/x1")).should("have.text", "-∞");
    cy.get(cesc("#\\/x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−100");
      });
    cy.get(cesc("#\\/x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−π");
      });
    cy.get(cesc("#\\/x6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e5");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).eq(-Infinity);
      expect(stateVariables["/x2"].stateValues.value).eqls(-100);
      expect(stateVariables["/x3"].stateValues.value).eqls(-5);
      expect(stateVariables["/x4"].stateValues.value).eqls(["-", "pi"]);
      expect(stateVariables["/x5"].stateValues.value).eq(70);
      expect(stateVariables["/x6"].stateValues.value).eqls(["^", "e", 5]);
    });

    cy.log("change fourth value");
    cy.get(cesc("#\\/m4") + " textarea").type(
      "{end}{backspace}{backspace}0{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/x4")).should("have.text", "0");
    cy.get(cesc("#\\/x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−100");
      });
    cy.get(cesc("#\\/x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−π");
      });
    cy.get(cesc("#\\/x5")).should("have.text", "70");
    cy.get(cesc("#\\/x6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e5");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).eqls(-100);
      expect(stateVariables["/x2"].stateValues.value).eqls(-5);
      expect(stateVariables["/x3"].stateValues.value).eqls(["-", "pi"]);
      expect(stateVariables["/x4"].stateValues.value).eq(0);
      expect(stateVariables["/x5"].stateValues.value).eq(70);
      expect(stateVariables["/x6"].stateValues.value).eqls(["^", "e", 5]);
    });
  });

  it("sort nested lists of numbers and math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <aslist>
  <sort assignNames="x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13" name="s">
    <numberlist>
      <numberlist>
        <numberlist>
          <number displayDigits="5">sqrt(2)</number><number>10</number>
        </numberlist>
        <numberlist>2</numberlist>
        <number>3</number>
      </numberlist>
      <numberlist>-3</numberlist>
    </numberlist>
    <mathlist>
      <mathlist>sqrt(3) 1/e</mathlist>
      <mathlist>
        <mathlist>e pi</mathlist>
        <mathlist>
          <mathlist>log(2) 1</mathlist>
          <mathlist>
            <mathlist>sin(2) -2/3</mathlist>
          </mathlist>
        </mathlist>
      </mathlist>
    </mathlist>
  </sort>
  </aslist>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/x1")).should("have.text", "-3");
    cy.get(cesc("#\\/x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−23");
      });
    cy.get(cesc("#\\/x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1e");
      });
    cy.get(cesc("#\\/x4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("log(2)");
      });
    cy.get(cesc("#\\/x5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sin(2)");
      });
    cy.get(cesc("#\\/x6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/x7")).should("have.text", "1.4142");
    cy.get(cesc("#\\/x8"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("√3");
      });
    cy.get(cesc("#\\/x9")).should("have.text", "2");
    cy.get(cesc("#\\/x10"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/x11")).should("have.text", "3");

    cy.get(cesc("#\\/x12"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("π");
      });
    cy.get(cesc("#\\/x13")).should("have.text", "10");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).eq(-3);
      expect(stateVariables["/x2"].stateValues.value).eqls(["-", ["/", 2, 3]]);
      expect(stateVariables["/x3"].stateValues.value).eqls(["/", 1, "e"]);
      expect(stateVariables["/x4"].stateValues.value).eqls(["apply", "log", 2]);
      expect(stateVariables["/x5"].stateValues.value).eqls(["apply", "sin", 2]);
      expect(stateVariables["/x6"].stateValues.value).eqls(1);
      expect(stateVariables["/x7"].stateValues.value).closeTo(
        Math.sqrt(2),
        1e-14,
      );
      expect(stateVariables["/x8"].stateValues.value).eqls([
        "apply",
        "sqrt",
        3,
      ]);
      expect(stateVariables["/x9"].stateValues.value).eq(2);
      expect(stateVariables["/x10"].stateValues.value).eqls("e");
      expect(stateVariables["/x11"].stateValues.value).eq(3);
      expect(stateVariables["/x12"].stateValues.value).eqls("pi");
      expect(stateVariables["/x13"].stateValues.value).eq(10);
    });
  });

  it("sort points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point name="A">(0,1)</point>
    <point name="B">(-2,1)</point>
    <point name="C">(7,1)</point>
    <point name="D">(3,1)</point>
    <point name="E">(5,1)</point>
  </graph>

  <sort assignNames="P1 P2 P3 P4 P5">$A$B$C$D$E</sort>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/P1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,1)");
      });
    cy.get(cesc("#\\/P2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,1)");
      });
    cy.get(cesc("#\\/P3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,1)");
      });
    cy.get(cesc("#\\/P4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/P5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,1)");
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -8, y: 9 },
      });
    });

    cy.get(cesc("#\\/P1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−8,9)");
      });
    cy.get(cesc("#\\/P2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,1)");
      });
    cy.get(cesc("#\\/P3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,1)");
      });
    cy.get(cesc("#\\/P4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/P5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,1)");
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 8, y: -3 },
      });
    });

    cy.get(cesc("#\\/P1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−8,9)");
      });
    cy.get(cesc("#\\/P2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,1)");
      });
    cy.get(cesc("#\\/P3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/P4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,1)");
      });
    cy.get(cesc("#\\/P5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(8,−3)");
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: 4, y: 5 },
      });
    });

    cy.get(cesc("#\\/P1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−8,9)");
      });
    cy.get(cesc("#\\/P2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,1)");
      });
    cy.get(cesc("#\\/P3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,5)");
      });
    cy.get(cesc("#\\/P4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/P5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(8,−3)");
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/D",
        args: { x: -9, y: 0 },
      });
    });

    cy.get(cesc("#\\/P1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−9,0)");
      });
    cy.get(cesc("#\\/P2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−8,9)");
      });
    cy.get(cesc("#\\/P3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,5)");
      });
    cy.get(cesc("#\\/P4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/P5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(8,−3)");
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/E",
        args: { x: -2, y: -1 },
      });
    });

    cy.get(cesc("#\\/P1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−9,0)");
      });
    cy.get(cesc("#\\/P2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−8,9)");
      });
    cy.get(cesc("#\\/P3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,−1)");
      });
    cy.get(cesc("#\\/P4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,5)");
      });
    cy.get(cesc("#\\/P5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(8,−3)");
      });
  });

  it("sort points by component", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point name="A">(0,5)</point>
    <point name="B">(-2,6)</point>
    <point name="C">(7,-3)</point>
    <point name="D">(3,2)</point>
    <point name="E">(5,1)</point>
  </graph>

  <sort assignNames="P1 P2 P3 P4 P5">$A$B$C$D$E</sort>
  <sort assignNames="Px1 Px2 Px3 Px4 Px5" sortByComponent="1">$A$B$C$D$E</sort>
  <sort assignNames="Py1 Py2 Py3 Py4 Py5" sortByComponent="2">$A$B$C$D$E</sort>
  <sort assignNames="Pu1 Pu2 Pu3 Pu4 Pu5" sortByComponent="3">$A$B$C$D$E</sort>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/P1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/P2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/P3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/P4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/P5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−3)");
      });

    cy.get(cesc("#\\/Px1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/Px2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Px3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Px4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/Px5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−3)");
      });

    cy.get(cesc("#\\/Py1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−3)");
      });
    cy.get(cesc("#\\/Py2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/Py3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Py4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Py5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });

    cy.get(cesc("#\\/Pu1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Pu2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/Pu3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−3)");
      });
    cy.get(cesc("#\\/Pu4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Pu5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
  });

  it("sort vectors", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <vector name="A" displacement="(0,5)" tail="(5,2)" />
    <vector name="B" displacement="(-2,6)" tail="(3,7)" />
    <vector name="C" displacement="(7,-2)" tail="(-4,5)" />
    <vector name="D" displacement="(3,2)" tail="(1,6)" />
    <vector name="E" displacement="(5,1)" tail="(0,-3)" />
  </graph>

  <sort assignNames="V1 V2 V3 V4 V5">$A$B$C$D$E</sort>
  <sort assignNames="Vd1 Vd2 Vd3 Vd4 Vd5" sortVectorsBy="displacement">$A$B$C$D$E</sort>
  <sort assignNames="Vt1 Vt2 Vt3 Vt4 Vt5" sortVectorsBy="tail">$A$B$C$D$E</sort>

  <sort assignNames="Vx1 Vx2 Vx3 Vx4 Vx5" sortByComponent="1">$A$B$C$D$E</sort>
  <sort assignNames="Vxd1 Vxd2 Vxd3 Vxd4 Vxd5" sortVectorsBy="displacement" sortByComponent="1">$A$B$C$D$E</sort>
  <sort assignNames="Vxt1 Vxt2 Vxt3 Vxt4 Vxt5" sortVectorsBy="tail" sortByComponent="1">$A$B$C$D$E</sort>

  <sort assignNames="Vy1 Vy2 Vy3 Vy4 Vy5" sortByComponent="2">$A$B$C$D$E</sort>
  <sort assignNames="Vyd1 Vyd2 Vyd3 Vyd4 Vyd5" sortVectorsBy="displacement" sortByComponent="2">$A$B$C$D$E</sort>
  <sort assignNames="Vyt1 Vyt2 Vyt3 Vyt4 Vyt5" sortVectorsBy="tail" sortByComponent="2">$A$B$C$D$E</sort>

  <sort assignNames="Vu1 Vu2 Vu3 Vu4 Vu5" sortByComponent="3">$A$B$C$D$E</sort>
  <sort assignNames="Vud1 Vud2 Vud3 Vud4 Vud5" sortVectorsBy="displacement" sortByComponent="3">$A$B$C$D$E</sort>
  <sort assignNames="Vut1 Vut2 Vut3 Vut4 Vut5" sortVectorsBy="tail" sortByComponent="3">$A$B$C$D$E</sort>



  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/V1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/V2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/V3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/V4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/V5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });

    cy.get(cesc("#\\/Vd1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/Vd2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Vd3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Vd4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/Vd5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });

    cy.get(cesc("#\\/Vt1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });
    cy.get(cesc("#\\/Vt2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/Vt3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Vt4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/Vt5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });

    cy.get(cesc("#\\/Vx1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/Vx2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Vx3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Vx4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/Vx5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });

    cy.get(cesc("#\\/Vxd1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/Vxd2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Vxd3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Vxd4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/Vxd5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });

    cy.get(cesc("#\\/Vxt1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });
    cy.get(cesc("#\\/Vxt2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/Vxt3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Vxt4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/Vxt5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });

    cy.get(cesc("#\\/Vy1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });
    cy.get(cesc("#\\/Vy2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/Vy3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Vy4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Vy5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });

    cy.get(cesc("#\\/Vyd1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });
    cy.get(cesc("#\\/Vyd2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/Vyd3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Vyd4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Vyd5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });

    cy.get(cesc("#\\/Vyt1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
    cy.get(cesc("#\\/Vyt2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Vyt3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });
    cy.get(cesc("#\\/Vyt4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Vyt5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });

    cy.get(cesc("#\\/Vu1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Vu2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/Vu3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });
    cy.get(cesc("#\\/Vu4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Vu5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });

    cy.get(cesc("#\\/Vud1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Vud2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/Vud3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });
    cy.get(cesc("#\\/Vud4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Vud5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });

    cy.get(cesc("#\\/Vut1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,5)");
      });
    cy.get(cesc("#\\/Vut2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,6)");
      });
    cy.get(cesc("#\\/Vut3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−2)");
      });
    cy.get(cesc("#\\/Vut4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });
    cy.get(cesc("#\\/Vut5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,1)");
      });
  });

  it("sort by prop", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <p>Coords for last point: <mathinput name="cs" /></p>
  <sort assignNames="P1 P2 P3 P4 P5" sortByProp="NUMDIMENSIONS">
    <point>(a,b)</point>
    <point>x</point>
    <point xs="s t u v" />
    <point x="x" y="y" z="z" />
    <point coords="$cs" />
  </sort>


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/P1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/P2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("\uff3f");
      });
    cy.get(cesc("#\\/P3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/P4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/P5") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,u,v)");
      });

    cy.get(cesc("#\\/cs") + " textarea").type("(a,b,c,d){enter}", {
      force: true,
    });

    cy.get(cesc("#\\/P5") + " .mjx-mrow").should("contain.text", "(a,b,c,d)");

    cy.get(cesc("#\\/P1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/P2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/P3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/P4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,u,v)");
      });
    cy.get(cesc("#\\/P5") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b,c,d)");
      });

    cy.get(cesc("#\\/cs") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}(3,4,5){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", "(3,4,5)");

    cy.get(cesc("#\\/P1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/P2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/P3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/P4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4,5)");
      });
    cy.get(cesc("#\\/P5") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,u,v)");
      });
  });

  it("sort texts", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <aslist>
  <sort assignNames="x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13" name="s">
    <text>banana</text>
    <text>apple</text>
    <text>pear</text>
    <textlist>grape cherry kiwi</textlist>
    <text>strawberry</text>
    <text>mango</text>
    <text>passion fruit</text>
    <textlist>orange boysenberry fig currant</textlist>
  </sort>
  </aslist>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/x1")).should("have.text", "apple");
    cy.get(cesc("#\\/x2")).should("have.text", "banana");
    cy.get(cesc("#\\/x3")).should("have.text", "boysenberry");
    cy.get(cesc("#\\/x4")).should("have.text", "cherry");
    cy.get(cesc("#\\/x5")).should("have.text", "currant");
    cy.get(cesc("#\\/x6")).should("have.text", "fig");
    cy.get(cesc("#\\/x7")).should("have.text", "grape");
    cy.get(cesc("#\\/x8")).should("have.text", "kiwi");
    cy.get(cesc("#\\/x9")).should("have.text", "mango");
    cy.get(cesc("#\\/x10")).should("have.text", "orange");
    cy.get(cesc("#\\/x11")).should("have.text", "passion fruit");
    cy.get(cesc("#\\/x12")).should("have.text", "pear");
    cy.get(cesc("#\\/x13")).should("have.text", "strawberry");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).eq("apple");
      expect(stateVariables["/x2"].stateValues.value).eq("banana");
      expect(stateVariables["/x3"].stateValues.value).eq("boysenberry");
      expect(stateVariables["/x4"].stateValues.value).eq("cherry");
      expect(stateVariables["/x5"].stateValues.value).eq("currant");
      expect(stateVariables["/x6"].stateValues.value).eq("fig");
      expect(stateVariables["/x7"].stateValues.value).eq("grape");
      expect(stateVariables["/x8"].stateValues.value).eq("kiwi");
      expect(stateVariables["/x9"].stateValues.value).eq("mango");
      expect(stateVariables["/x10"].stateValues.value).eq("orange");
      expect(stateVariables["/x11"].stateValues.value).eq("passion fruit");
      expect(stateVariables["/x12"].stateValues.value).eq("pear");
      expect(stateVariables["/x13"].stateValues.value).eq("strawberry");
    });
  });

  it("sort text, numbers, maths", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <aslist>
  <sort assignNames="x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13" name="s">
    <text>b</text>
    <number>3</number>
    <math>5</math>
    <textlist>1 z 15 orange</textlist>
    <math>x</math>
    <number>222</number>
    <mathlist>8 u</mathlist>
    <numberlist>99 765</numberlist>
  </sort>
  </aslist>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/x1")).should("have.text", "1");
    cy.get(cesc("#\\/x2")).should("have.text", "15");
    cy.get(cesc("#\\/x3")).should("have.text", "222");
    cy.get(cesc("#\\/x4")).should("have.text", "3");
    cy.get(cesc("#\\/x5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc("#\\/x6")).should("have.text", "765");
    cy.get(cesc("#\\/x7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc("#\\/x8")).should("have.text", "99");
    cy.get(cesc("#\\/x9")).should("have.text", "b");
    cy.get(cesc("#\\/x10")).should("have.text", "orange");
    cy.get(cesc("#\\/x11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "u");
    cy.get(cesc("#\\/x12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc("#\\/x13")).should("have.text", "z");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).eq("1");
      expect(stateVariables["/x2"].stateValues.value).eq("15");
      expect(stateVariables["/x3"].stateValues.value).eq(222);
      expect(stateVariables["/x4"].stateValues.value).eq(3);
      expect(stateVariables["/x5"].stateValues.value).eq(5);
      expect(stateVariables["/x6"].stateValues.value).eq(765);
      expect(stateVariables["/x7"].stateValues.value).eq(8);
      expect(stateVariables["/x8"].stateValues.value).eq(99);
      expect(stateVariables["/x9"].stateValues.value).eq("b");
      expect(stateVariables["/x10"].stateValues.value).eq("orange");
      expect(stateVariables["/x11"].stateValues.value).eq("u");
      expect(stateVariables["/x12"].stateValues.value).eq("x");
      expect(stateVariables["/x13"].stateValues.value).eq("z");
    });
  });

  it("sort sugar type math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p name="pList"><sort name="sh" type="math">
    z b a x y c 
  </sort></p>
  <p name="pNoList"><sort copySource="sh" asList="false" /></p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let sorted = ["aaa", "bbb", "ccc", "xxx", "yyy", "zzz"];

    cy.get(cesc("#\\/pList")).should("have.text", sorted.join(", "));
    cy.get(cesc("#\\/pNoList")).should("have.text", sorted.join(""));
  });

  it("sort sugar type number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p name="pList"><sort name="sh" type="number">
    101 542 817 527 51 234 801
  </sort></p>
  <p name="pNoList"><sort copySource="sh" asList="false" /></p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let sorted = [51, 101, 234, 527, 542, 801, 817];

    cy.get(cesc("#\\/pList")).should("have.text", sorted.join(", "));
    cy.get(cesc("#\\/pNoList")).should("have.text", sorted.join(""));
  });

  it("sort sugar type text", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p name="pList"><sort name="sh" type="text">
    orange
    apple
    banana
    almost
    above
  </sort></p>
  <p name="pNoList"><sort copySource="sh" asList="false" /></p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let sorted = ["above", "almost", "apple", "banana", "orange"];

    cy.get(cesc("#\\/pList")).should("have.text", sorted.join(", "));
    cy.get(cesc("#\\/pNoList")).should("have.text", sorted.join(""));
  });
});
