import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/utils/url";

describe("Math Operator Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("sum", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <sum name="numbers"><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></sum>
      <sum name="withNumberSum"><math>3</math><sum><number>17</number><number>5-4</number></sum></sum>
      <sum name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      <sum name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      <sum name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3+17+1");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3+17+1");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("62+17+1");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/withNumberSum"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+x+y+x+y+z");
        });
      cy.get(cesc("#\\/varsSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3x+2y+z");
        });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+x+y+x+y+z");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(21);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.value).eqls([
          "+",
          3,
          17,
          1,
        ]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eq(21);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumberMath"].stateValues.value).eq(
          21,
        );
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .value,
        ).eqls(["+", 3, 17, 1]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(21);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.value,
        ).eqls(["+", ["/", 6, 2], 17, 1]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eq(21);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).eq(21);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberSum"].stateValues.value).eq(21);
        expect(
          stateVariables["/withNumberSum"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberSum"].stateValues.isNumber).eq(true);
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "+",
          "x",
          "x",
          "y",
          "x",
          "y",
          "z",
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.value).eqls([
          "+",
          ["*", 3, "x"],
          ["*", 2, "y"],
          "z",
        ]);
        expect(
          stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numbersb"].stateValues.value).eq(21);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value).eqls([
          "+",
          "x",
          "x",
          "y",
          "x",
          "y",
          "z",
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
      });
    });
  });

  it("sum with sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <sum name="numbers"><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersAsString">3 17 1</sum>
      <sum name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</sum>
      <sum name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</sum>
      <sum name="numericAsString">6/2 17 5-4</sum>
      <sum name="numericAsStringSimplify" simplify>6/2 17 5-4</sum>
      <sum name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</sum>
      <sum name="numbersAsMacros">$a$b$c</sum>
      <sum name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</sum>
      <sum name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</sum>
      <sum name="numbersAsMacros2">$a $b $c</sum>
      <sum name="withNumberMathMacro">$aNumberMath$b$c</sum>
      <sum name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</sum>
      <sum name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</sum>
      <sum name="withNumericMathMacro">$aNumericMath$b$c</sum>
      <sum name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</sum>
      <sum name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</sum>
      <sum name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      <sum name="varsAsString">x x+y x+y+z</sum>
      <sum name="varsAsStringSimplify" simplify>x x+y x+y+z</sum>
      <sum name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</sum>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numbers"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/numbersAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3+17+1");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/numericAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("62+17+5−4");
      });
    cy.get(cesc("#\\/numericAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/numericAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/numbersAsMacros"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3+17+1");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/numbersAsMacros2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/withNumberMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3+17+1");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/withNumericMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("62+17+1");
      });
    cy.get(cesc("#\\/withNumericMathMacroSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/withNumericMathMacroForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/vars"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x+x+y+x+y+z");
      });
    cy.get(cesc("#\\/varsAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x+x+y+x+y+z");
      });
    cy.get(cesc("#\\/varsAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3x+2y+z");
      });
    cy.get(cesc("#\\/varsAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("NaN");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(21);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value).eq(21);
        expect(
          stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.value,
        ).eqls(["+", 3, 17, 1]);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .value,
        ).eq(21);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value).eqls([
          "+",
          ["/", 6, 2],
          17,
          5,
          -4,
        ]);
        expect(
          stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numericAsStringSimplify"].stateValues.value).eq(
          21,
        );
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.value,
        ).eq(21);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value).eq(21);
        expect(
          stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value,
        ).eqls(["+", 3, 17, 1]);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .value,
        ).eq(21);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value).eq(21);
        expect(
          stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/withNumberMathMacro"].stateValues.value).eq(21);
        expect(
          stateVariables["/withNumberMathMacro"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues.value,
        ).eqls(["+", 3, 17, 1]);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(21);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/withNumericMathMacro"].stateValues.value).eqls([
          "+",
          ["/", 6, 2],
          17,
          1,
        ]);
        expect(
          stateVariables["/withNumericMathMacro"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.value,
        ).eq(21);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues.value,
        ).eq(21);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "+",
          "x",
          "x",
          "y",
          "x",
          "y",
          "z",
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.value).eqls([
          "+",
          "x",
          "x",
          "y",
          "x",
          "y",
          "z",
        ]);
        expect(
          stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.value).eqls([
          "+",
          ["*", 3, "x"],
          ["*", 2, "y"],
          "z",
        ]);
        expect(
          stateVariables["/varsAsStringSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.value,
        ).eqls(NaN);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
      });
    });
  });

  it("sum as math expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">sum(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>sum(3,17,5-4)</math>
      <math name="numberStringProduct">sum(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>sum(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        sum(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      sum(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        sum(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        sum(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        sum($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        sum($a,$b,$c)
      </math>
      <math name="macrosProduct">
        sum($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        sum($a$b$c)
      </math>
      <math name="group">
        sum($nums)
      </math>
      <math name="groupPlusGroup">
        sum($nums) + sum($nums)
      </math>
      <math name="groupSimplify" simplify>
        sum($nums)
      </math>
      <math name="groupPlus">
        sum($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        sum($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        sum($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        sum($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        sum($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        sum($a, $b, $nums, $c)
      </math>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numberString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sum(3,17,5−4)");
      });
    cy.get(cesc("#\\/numberStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/numberStringProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sum(3⋅17⋅5−4)");
      });
    cy.get(cesc("#\\/numberStringProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("251");
      });
    cy.get(cesc("#\\/numberComponentsCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sum(3,17,1)");
      });
    cy.get(cesc("#\\/numberComponentsCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/numberComponentsProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sum(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/numberComponentsProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/macrosCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sum(3,17,1)");
      });
    cy.get(cesc("#\\/macrosCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/macrosProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sum(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/macrosProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/group"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sum(3,17,1)");
      });
    cy.get(cesc("#\\/groupPlusGroup"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sum(3,17,1)+sum(3,17,1)");
      });
    cy.get(cesc("#\\/groupSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21");
      });
    cy.get(cesc("#\\/groupPlus"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sum(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlusSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("42");
      });
    cy.get(cesc("#\\/groupPlus2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sum(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlus2Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("42");
      });
    cy.get(cesc("#\\/groupPlus3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sum(3,17,3,17,1,1)");
      });
    cy.get(cesc("#\\/groupPlus3Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("42");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numberString"].stateValues.value).eqls([
          "apply",
          "sum",
          ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/numberStringSimplify"].stateValues.value).eq(
          21,
        );
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/numberStringProduct"].stateValues.value).eqls([
          "apply",
          "sum",
          ["+", ["*", 3, 17, 5], -4],
        ]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.value,
        ).eq(251);
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
          stateVariables["/numberComponentsCommas"].stateValues.value,
        ).eqls(["apply", "sum", ["tuple", 3, 17, 1]]);
        expect(
          await await stateVariables["/numberComponentsCommas"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues.value,
        ).eq(21);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.value,
        ).eqls(["apply", "sum", ["*", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues
            .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value).eqls([
          "apply",
          "sum",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.value).eq(
          21,
        );
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value).eqls([
          "apply",
          "sum",
          ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosProductSimplify"].stateValues.value).eq(
          51,
        );
        expect(
          stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value).eqls([
          "apply",
          "sum",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusGroup"].stateValues.value).eqls([
          "+",
          ["apply", "sum", ["tuple", 3, 17, 1]],
          ["apply", "sum", ["tuple", 3, 17, 1]],
        ]);
        expect(stateVariables["/groupPlusGroup"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/groupSimplify"].stateValues.value).eq(21);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value).eqls([
          "apply",
          "sum",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value).eq(42);
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value).eqls([
          "apply",
          "sum",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value).eq(42);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value).eqls([
          "apply",
          "sum",
          ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value).eq(42);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
          true,
        );
      });
    });
  });

  it("sum with lists", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <sum name="numbers"><numberList>3 17 5-4</numberList></sum>
      <sum name="numbersForceSymbolic" forceSymbolic><numberList>3 17 5-4</numberList></sum>
      <sum name="numbersForceSymbolicSimplify" forceSymbolic simplify><numberList>3 17 5-4</numberList></sum>
      <sum name="numbersWithNumberMath"><math>3</math><numberList>17 5-4</numberList></sum>
      <sum name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><numberList>17 5-4</numberList></sum>
      <sum name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><numberList>17 5-4</numberList></sum>
      <sum name="numbersWithNumericMath"><math>6/2</math><numberList>17 5-4</numberList></sum>
      <sum name="numbersWithNumericMathSimplify" simplify><math>6/2</math><numberList>17 5-4</numberList></sum>
      <sum name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><numberList>17 5-4</numberList></sum>
      <sum name="withNumberSum"><math>3</math><sum><numberList>17 5-4</numberList></sum></sum>
      <sum name="vars"><mathList>x x+y x+y+z</mathList></sum>
      <sum name="varsSimplify" simplify><mathList>x x+y x+y+z</mathList></sum>
      <sum name="varsForcedNumeric" forceNumeric><mathList>x x+y x+y+z</mathList></sum>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3+17+1");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3+17+1");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("62+17+1");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/withNumberSum"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+x+y+x+y+z");
        });
      cy.get(cesc("#\\/varsSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3x+2y+z");
        });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("21");
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+x+y+x+y+z");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(21);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.value).eqls([
          "+",
          3,
          17,
          1,
        ]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eq(21);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumberMath"].stateValues.value).eq(
          21,
        );
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .value,
        ).eqls(["+", 3, 17, 1]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(21);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.value,
        ).eqls(["+", ["/", 6, 2], 17, 1]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eq(21);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).eq(21);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberSum"].stateValues.value).eq(21);
        expect(
          stateVariables["/withNumberSum"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberSum"].stateValues.isNumber).eq(true);
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "+",
          "x",
          "x",
          "y",
          "x",
          "y",
          "z",
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.value).eqls([
          "+",
          ["*", 3, "x"],
          ["*", 2, "y"],
          "z",
        ]);
        expect(
          stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numbersb"].stateValues.value).eq(21);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value).eqls([
          "+",
          "x",
          "x",
          "y",
          "x",
          "y",
          "z",
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
      });
    });
  });

  it("product", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <product name="numbers"><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></product>
      <product name="withNumberProduct"><math>3</math><product><number>17</number><number>5-4</number></product></product>
      <product name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></product>
      <product name="varsExpand" expand><math>x</math><math>x+y</math><math>x+y+z</math></product>
      <product name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></product>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3⋅17⋅1");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3⋅17⋅1");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(62)⋅17⋅1");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/withNumberProduct"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x(x+y)(x+y+z)");
        });
      cy.get(cesc("#\\/varsExpand"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x3+2yx2+zx2+xy2+xyz");
        });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x(x+y)(x+y+z)");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(51);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.value).eqls([
          "*",
          3,
          17,
          1,
        ]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumberMath"].stateValues.value).eq(
          51,
        );
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .value,
        ).eqls(["*", 3, 17, 1]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.value,
        ).eqls(["*", ["/", 6, 2], 17, 1]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).eq(51);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberProduct"].stateValues.value).eq(51);
        expect(
          stateVariables["/withNumberProduct"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberProduct"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "*",
          "x",
          ["+", "x", "y"],
          ["+", "x", "y", "z"],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsExpand"].stateValues.value).eqls([
          "+",
          ["^", "x", 3],
          ["*", 2, "y", ["^", "x", 2]],
          ["*", "z", ["^", "x", 2]],
          ["*", "x", ["^", "y", 2]],
          ["*", "x", "y", "z"],
        ]);
        expect(stateVariables["/varsExpand"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsExpand"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numbersb"].stateValues.value).eq(51);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value).eqls([
          "*",
          "x",
          ["+", "x", "y"],
          ["+", "x", "y", "z"],
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
      });
    });
  });

  it("product with sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <product name="numbers"><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersAsString">3 17 1</product>
      <product name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</product>
      <product name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</product>
      <product name="numericAsString">6/2 17 5-4</product>
      <product name="numericAsStringSimplify" simplify>6/2 17 5-4</product>
      <product name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</product>
      <product name="numbersAsMacros">$a$b$c</product>
      <product name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</product>
      <product name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</product>
      <product name="numbersAsMacros2">$a $b $c</product>
      <product name="withNumberMathMacro">$aNumberMath$b$c</product>
      <product name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</product>
      <product name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</product>
      <product name="withNumericMathMacro">$aNumericMath$b$c</product>
      <product name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</product>
      <product name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</product>
      <product name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></product>
      <product name="varsAsString">x x+y x+y+z</product>
      <product name="varsAsStringExpand" expand>x x+y x+y+z</product>
      <product name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</product>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numbers"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/numbersAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3⋅17⋅1");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/numericAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(62)⋅17(5−4)");
      });
    cy.get(cesc("#\\/numericAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/numericAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/numbersAsMacros"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3⋅17⋅1");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/numbersAsMacros2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/withNumberMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3⋅17⋅1");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/withNumericMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(62)⋅17⋅1");
      });
    cy.get(cesc("#\\/withNumericMathMacroSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/withNumericMathMacroForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/vars"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x(x+y)(x+y+z)");
      });
    cy.get(cesc("#\\/varsAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x(x+y)(x+y+z)");
      });
    cy.get(cesc("#\\/varsAsStringExpand"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x3+2yx2+zx2+xy2+xyz");
      });
    cy.get(cesc("#\\/varsAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("NaN");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(51);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value).eq(51);
        expect(
          stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.value,
        ).eqls(["*", 3, 17, 1]);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .value,
        ).eq(51);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value).eqls([
          "*",
          ["/", 6, 2],
          17,
          ["+", 5, -4],
        ]);
        expect(
          stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numericAsStringSimplify"].stateValues.value).eq(
          51,
        );
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value).eq(51);
        expect(
          stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value,
        ).eqls(["*", 3, 17, 1]);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .value,
        ).eq(51);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value).eq(51);
        expect(
          stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/withNumberMathMacro"].stateValues.value).eq(51);
        expect(
          stateVariables["/withNumberMathMacro"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues.value,
        ).eqls(["*", 3, 17, 1]);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/withNumericMathMacro"].stateValues.value).eqls([
          "*",
          ["/", 6, 2],
          17,
          1,
        ]);
        expect(
          stateVariables["/withNumericMathMacro"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "*",
          "x",
          ["+", "x", "y"],
          ["+", "x", "y", "z"],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.value).eqls([
          "*",
          "x",
          ["+", "x", "y"],
          ["+", "x", "y", "z"],
        ]);
        expect(
          stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsStringExpand"].stateValues.value).eqls([
          "+",
          ["^", "x", 3],
          ["*", 2, "y", ["^", "x", 2]],
          ["*", "z", ["^", "x", 2]],
          ["*", "x", ["^", "y", 2]],
          ["*", "x", "y", "z"],
        ]);
        expect(
          stateVariables["/varsAsStringExpand"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsStringExpand"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.value,
        ).eqls(NaN);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
      });
    });
  });

  it("prod as math expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">prod(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>prod(3,17,5-4)</math>
      <math name="numberStringProduct">prod(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>prod(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        prod(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      prod(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        prod(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        prod(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        prod($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        prod($a,$b,$c)
      </math>
      <math name="macrosProduct">
        prod($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        prod($a$b$c)
      </math>
      <math name="group">
        prod($nums)
      </math>
      <math name="groupSimplify" simplify>
        prod($nums)
      </math>
      <math name="groupPlus">
        prod($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        prod($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        prod($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        prod($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        prod($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        prod($a, $b, $nums, $c)
      </math>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numberString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("prod(3,17,5−4)");
      });
    cy.get(cesc("#\\/numberStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/numberStringProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("prod(3⋅17⋅5−4)");
      });
    cy.get(cesc("#\\/numberStringProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("251");
      });
    cy.get(cesc("#\\/numberComponentsCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("prod(3,17,1)");
      });
    cy.get(cesc("#\\/numberComponentsCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/numberComponentsProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("prod(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/numberComponentsProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/macrosCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("prod(3,17,1)");
      });
    cy.get(cesc("#\\/macrosCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/macrosProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("prod(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/macrosProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/group"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("prod(3,17,1)");
      });
    cy.get(cesc("#\\/groupSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/groupPlus"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("prod(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlusSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2601");
      });
    cy.get(cesc("#\\/groupPlus2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("prod(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlus2Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2601");
      });
    cy.get(cesc("#\\/groupPlus3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("prod(3,17,3,17,1,1)");
      });
    cy.get(cesc("#\\/groupPlus3Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2601");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numberString"].stateValues.value).eqls([
          "apply",
          "prod",
          ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/numberStringSimplify"].stateValues.value).eq(
          51,
        );
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/numberStringProduct"].stateValues.value).eqls([
          "apply",
          "prod",
          ["+", ["*", 3, 17, 5], -4],
        ]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.value,
        ).eq(251);
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
          stateVariables["/numberComponentsCommas"].stateValues.value,
        ).eqls(["apply", "prod", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.value,
        ).eqls(["apply", "prod", ["*", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues
            .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value).eqls([
          "apply",
          "prod",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.value).eq(
          51,
        );
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value).eqls([
          "apply",
          "prod",
          ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosProductSimplify"].stateValues.value).eq(
          51,
        );
        expect(
          stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value).eqls([
          "apply",
          "prod",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value).eq(51);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value).eqls([
          "apply",
          "prod",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value).eq(2601);
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value).eqls([
          "apply",
          "prod",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value).eq(
          2601,
        );
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value).eqls([
          "apply",
          "prod",
          ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value).eq(
          2601,
        );
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
          true,
        );
      });
    });
  });

  it("product with lists", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <product name="numbers"><numberList>3 17 5-4</numberList></product>
      <product name="numbersForceSymbolic" forceSymbolic><numberList>3 17 5-4</numberList></product>
      <product name="numbersForceSymbolicSimplify" forceSymbolic simplify><numberList>3 17 5-4</numberList></product>
      <product name="numbersWithNumberMath"><math>3</math><numberList>17 5-4</numberList></product>
      <product name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><numberList>17 5-4</numberList></product>
      <product name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><numberList>17 5-4</numberList></product>
      <product name="numbersWithNumericMath"><math>6/2</math><numberList>17 5-4</numberList></product>
      <product name="numbersWithNumericMathSimplify" simplify><math>6/2</math><numberList>17 5-4</numberList></product>
      <product name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><numberList>17 5-4</numberList></product>
      <product name="withNumberProduct"><math>3</math><product><numberList>17 5-4</numberList></product></product>
      <product name="vars"><mathList>x x+y x+y+z</mathList></product>
      <product name="varsExpand" expand><mathList>x x+y x+y+z</mathList></product>
      <product name="varsForcedNumeric" forceNumeric><mathList>x x+y x+y+z</mathList></product>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3⋅17⋅1");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3⋅17⋅1");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(62)⋅17⋅1");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/withNumberProduct"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x(x+y)(x+y+z)");
        });
      cy.get(cesc("#\\/varsExpand"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x3+2yx2+zx2+xy2+xyz");
        });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("51");
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x(x+y)(x+y+z)");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(51);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.value).eqls([
          "*",
          3,
          17,
          1,
        ]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumberMath"].stateValues.value).eq(
          51,
        );
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .value,
        ).eqls(["*", 3, 17, 1]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.value,
        ).eqls(["*", ["/", 6, 2], 17, 1]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).eq(51);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberProduct"].stateValues.value).eq(51);
        expect(
          stateVariables["/withNumberProduct"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberProduct"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "*",
          "x",
          ["+", "x", "y"],
          ["+", "x", "y", "z"],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsExpand"].stateValues.value).eqls([
          "+",
          ["^", "x", 3],
          ["*", 2, "y", ["^", "x", 2]],
          ["*", "z", ["^", "x", 2]],
          ["*", "x", ["^", "y", 2]],
          ["*", "x", "y", "z"],
        ]);
        expect(stateVariables["/varsExpand"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsExpand"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numbersb"].stateValues.value).eq(51);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value).eqls([
          "*",
          "x",
          ["+", "x", "y"],
          ["+", "x", "y", "z"],
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
      });
    });
  });

  it("clamp number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>

      <clampNumber>55.3</clampNumber>
      <clampNumber>-55.3</clampNumber>
      <clampNumber>0.3</clampNumber>

      <clampNumber lowervalue="10" uppervalue="40">55.3</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">-55.3</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">12</clampNumber>

      <clampNumber lowervalue="10" uppervalue="40"><math>55.3</math></clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><number>-55.3</number></clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><number>12</number></clampNumber>

      <clampNumber lowervalue="10" uppervalue="40">x+y</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><math>x+y</math></clampNumber>

      <number name="a">4</number>

      <clampNumber lowervalue="10" uppervalue="40">12$a</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">-12$a</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">3$a</clampNumber>

      $_clampnumber1{name="clampnumber1b"}
      $_clampnumber5{name="clampnumber5b"}
      $_clampnumber9{name="clampnumber9b"}
      $_clampnumber14{name="clampnumber14b"}

      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/_clampnumber1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/_clampnumber2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0");
        });
      cy.get(cesc("#\\/_clampnumber3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.3");
        });
      cy.get(cesc("#\\/_clampnumber4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("40");
        });
      cy.get(cesc("#\\/_clampnumber5"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("10");
        });
      cy.get(cesc("#\\/_clampnumber6"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("12");
        });
      cy.get(cesc("#\\/_clampnumber7"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("40");
        });
      cy.get(cesc("#\\/_clampnumber8"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("10");
        });
      cy.get(cesc("#\\/_clampnumber9"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("12");
        });
      cy.get(cesc("#\\/_clampnumber10"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/_clampnumber11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/_clampnumber12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("40");
        });
      cy.get(cesc("#\\/_clampnumber13"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("10");
        });
      cy.get(cesc("#\\/_clampnumber14"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("12");
        });
      cy.get(cesc("#\\/clampnumber1b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/clampnumber5b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("10");
        });
      cy.get(cesc("#\\/clampnumber9b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("12");
        });
      cy.get(cesc("#\\/clampnumber14b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("12");
        });

      cy.window().then(async (win) => {
        expect(stateVariables["/_clampnumber1"].stateValues.value).eq(1);
        expect(stateVariables["/_clampnumber2"].stateValues.value).eq(0);
        expect(stateVariables["/_clampnumber3"].stateValues.value).eq(0.3);
        expect(stateVariables["/_clampnumber4"].stateValues.value).eq(40);
        expect(stateVariables["/_clampnumber5"].stateValues.value).eq(10);
        expect(stateVariables["/_clampnumber6"].stateValues.value).eq(12);
        expect(stateVariables["/_clampnumber7"].stateValues.value).eq(40);
        expect(stateVariables["/_clampnumber8"].stateValues.value).eq(10);
        expect(stateVariables["/_clampnumber9"].stateValues.value).eq(12);
        expect(stateVariables["/_clampnumber10"].stateValues.value).eqls(NaN);
        expect(stateVariables["/_clampnumber11"].stateValues.value).eqls(NaN);
        expect(stateVariables["/_clampnumber12"].stateValues.value).eq(40);
        expect(stateVariables["/_clampnumber13"].stateValues.value).eq(10);
        expect(stateVariables["/_clampnumber14"].stateValues.value).eq(12);
        expect(stateVariables["/clampnumber1b"].stateValues.value).eq(1);
        expect(stateVariables["/clampnumber5b"].stateValues.value).eq(10);
        expect(stateVariables["/clampnumber9b"].stateValues.value).eq(12);
        expect(stateVariables["/clampnumber14b"].stateValues.value).eq(12);
        expect(
          stateVariables["/_clampnumber1"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber3"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber4"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber5"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber6"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber7"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber8"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber9"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber10"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber11"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber12"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber13"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_clampnumber14"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/clampnumber1b"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/clampnumber5b"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/clampnumber9b"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/clampnumber14b"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/_clampnumber1"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber2"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber3"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber4"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber5"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber6"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber7"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber8"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber9"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber10"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/_clampnumber11"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/_clampnumber12"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber13"].stateValues.isNumber).eq(true);
        expect(stateVariables["/_clampnumber14"].stateValues.isNumber).eq(true);
        expect(stateVariables["/clampnumber1b"].stateValues.isNumber).eq(true);
        expect(stateVariables["/clampnumber5b"].stateValues.isNumber).eq(true);
        expect(stateVariables["/clampnumber9b"].stateValues.isNumber).eq(true);
        expect(stateVariables["/clampnumber14b"].stateValues.isNumber).eq(true);
      });
    });
  });

  it("wrap number periodic", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>

      <wrapnumberperiodic>55.3</wrapnumberperiodic>
      <wrapnumberperiodic>-55.3</wrapnumberperiodic>
      <wrapnumberperiodic>0.3</wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40">55.3</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">-55.3</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">12</wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40"><math>55.3</math></wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><number>-55.3</number></wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><number>12</number></wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40">x+y</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><math>x+y</math></wrapnumberperiodic>

      <number name="a">4</number>

      <wrapnumberperiodic lowervalue="10" uppervalue="40">12$a</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">-12$a</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">3$a</wrapnumberperiodic>

      $_wrapnumberperiodic1{name="wrapnumberperiodic1b"}
      $_wrapnumberperiodic5{name="wrapnumberperiodic5b"}
      $_wrapnumberperiodic9{name="wrapnumberperiodic9b"}
      $_wrapnumberperiodic14{name="wrapnumberperiodic14b"}

      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/_wrapnumberperiodic1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.3");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.7");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.3");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("25.3");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic5"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("34.7");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic6"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("12");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic7"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("25.3");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic8"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("34.7");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic9"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("12");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic10"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("18");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic13"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("12");
        });
      cy.get(cesc("#\\/_wrapnumberperiodic14"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("12");
        });
      cy.get(cesc("#\\/wrapnumberperiodic1b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.3");
        });
      cy.get(cesc("#\\/wrapnumberperiodic5b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("34.7");
        });
      cy.get(cesc("#\\/wrapnumberperiodic9b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("12");
        });
      cy.get(cesc("#\\/wrapnumberperiodic14b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("12");
        });

      cy.window().then(async (win) => {
        expect(
          stateVariables["/_wrapnumberperiodic1"].stateValues.value,
        ).closeTo(0.3, 1e-12);
        expect(
          stateVariables["/_wrapnumberperiodic2"].stateValues.value,
        ).closeTo(0.7, 1e-12);
        expect(
          stateVariables["/_wrapnumberperiodic3"].stateValues.value,
        ).closeTo(0.3, 1e-12);
        expect(
          stateVariables["/_wrapnumberperiodic4"].stateValues.value,
        ).closeTo(25.3, 1e-12);
        expect(
          stateVariables["/_wrapnumberperiodic5"].stateValues.value,
        ).closeTo(34.7, 1e-12);
        expect(
          stateVariables["/_wrapnumberperiodic6"].stateValues.value,
        ).closeTo(12, 1e-12);
        expect(
          stateVariables["/_wrapnumberperiodic7"].stateValues.value,
        ).closeTo(25.3, 1e-12);
        expect(
          stateVariables["/_wrapnumberperiodic8"].stateValues.value,
        ).closeTo(34.7, 1e-12);
        expect(
          stateVariables["/_wrapnumberperiodic9"].stateValues.value,
        ).closeTo(12, 1e-12);
        expect(stateVariables["/_wrapnumberperiodic10"].stateValues.value).eqls(
          NaN,
        );
        expect(stateVariables["/_wrapnumberperiodic11"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/_wrapnumberperiodic12"].stateValues.value,
        ).closeTo(18, 1e-12);
        expect(
          stateVariables["/_wrapnumberperiodic13"].stateValues.value,
        ).closeTo(12, 1e-12);
        expect(
          stateVariables["/_wrapnumberperiodic14"].stateValues.value,
        ).closeTo(12, 1e-12);
        expect(
          stateVariables["/wrapnumberperiodic1b"].stateValues.value,
        ).closeTo(0.3, 1e-12);
        expect(
          stateVariables["/wrapnumberperiodic5b"].stateValues.value,
        ).closeTo(34.7, 1e-12);
        expect(
          stateVariables["/wrapnumberperiodic9b"].stateValues.value,
        ).closeTo(12, 1e-12);
        expect(
          stateVariables["/wrapnumberperiodic14b"].stateValues.value,
        ).closeTo(12, 1e-12);
        expect(
          stateVariables["/_wrapnumberperiodic1"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic3"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic4"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic5"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic6"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic7"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic8"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic9"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic10"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic11"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic12"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic13"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic14"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/wrapnumberperiodic1b"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/wrapnumberperiodic5b"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/wrapnumberperiodic9b"].stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/wrapnumberperiodic14b"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(stateVariables["/_wrapnumberperiodic1"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/_wrapnumberperiodic2"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/_wrapnumberperiodic3"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/_wrapnumberperiodic4"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/_wrapnumberperiodic5"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/_wrapnumberperiodic6"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/_wrapnumberperiodic7"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/_wrapnumberperiodic8"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/_wrapnumberperiodic9"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/_wrapnumberperiodic10"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/_wrapnumberperiodic11"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/_wrapnumberperiodic12"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic13"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/_wrapnumberperiodic14"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/wrapnumberperiodic1b"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/wrapnumberperiodic5b"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/wrapnumberperiodic9b"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/wrapnumberperiodic14b"].stateValues.isNumber,
        ).eq(true);
      });
    });
  });

  it("clamp and wrap number updatable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <graph>
        <point layer="1">(6,7)</point>
        <point>
          (<clampnumber lowervalue="-2" uppervalue="5">
            $_point1.x
          </clampnumber>,
          <wrapnumberperiodic lowervalue="-2" uppervalue="5">
            $_point1.y
          </wrapnumberperiodic>
          )
        </point>
        <point>($_point2.y, $_point2.x)</point>
      </graph>

      $_graph1{name="g2"}
      `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let clamp = (x) => Math.min(5, Math.max(-2, x));
    let wrap = (x) => -2 + me.math.mod(x + 2, 7);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 6,
        y = 7;
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(clamp(x));
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(clamp(x));

      let g2children = stateVariables["/g2"].activeChildren.map(
        (x) => stateVariables[x.componentName],
      );
      expect((await g2children[0].stateValues.xs)[0]).eq(x);
      expect((await g2children[0].stateValues.xs)[1]).eq(y);
      expect((await g2children[1].stateValues.xs)[0]).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1]).eq(clamp(x));
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      let x = -5,
        y = 0;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x, y },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(clamp(x));
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(clamp(x));

      let g2children = stateVariables["/g2"].activeChildren.map(
        (x) => stateVariables[x.componentName],
      );
      expect((await g2children[0].stateValues.xs)[0]).eq(x);
      expect((await g2children[0].stateValues.xs)[1]).eq(y);
      expect((await g2children[1].stateValues.xs)[0]).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1]).eq(clamp(x));
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      let x = 9,
        y = -3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x, y },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(clamp(x));
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(wrap(y));
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(clamp(x));
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(clamp(x));

      let g2children = stateVariables["/g2"].activeChildren.map(
        (x) => stateVariables[x.componentName],
      );
      expect((await g2children[0].stateValues.xs)[0]).eq(clamp(x));
      expect((await g2children[0].stateValues.xs)[1]).eq(wrap(y));
      expect((await g2children[1].stateValues.xs)[0]).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1]).eq(clamp(x));
    });

    cy.log("move point 3");
    cy.window().then(async (win) => {
      let x = -4,
        y = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: y, y: x },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(clamp(x));
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(wrap(y));
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(clamp(x));
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(clamp(x));

      let g2children = stateVariables["/g2"].activeChildren.map(
        (x) => stateVariables[x.componentName],
      );
      expect((await g2children[0].stateValues.xs)[0]).eq(clamp(x));
      expect((await g2children[0].stateValues.xs)[1]).eq(wrap(y));
      expect((await g2children[1].stateValues.xs)[0]).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1]).eq(clamp(x));
    });

    cy.log("move point 4");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 10,
        y = -10;

      await win.callAction1({
        actionName: "movePoint",
        componentName: stateVariables["/g2"].activeChildren[0].componentName,
        args: { x, y },
      });
      stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(clamp(x));
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(clamp(x));

      let g2children = stateVariables["/g2"].activeChildren.map(
        (x) => stateVariables[x.componentName],
      );
      expect((await g2children[0].stateValues.xs)[0]).eq(x);
      expect((await g2children[0].stateValues.xs)[1]).eq(y);
      expect((await g2children[1].stateValues.xs)[0]).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1]).eq(clamp(x));
    });

    cy.log("move point 5");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 11,
        y = -13;

      await win.callAction1({
        actionName: "movePoint",
        componentName: stateVariables["/g2"].activeChildren[1].componentName,
        args: { x, y },
      });
      stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(clamp(x));
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(wrap(y));
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(clamp(x));
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(clamp(x));

      let g2children = stateVariables["/g2"].activeChildren.map(
        (x) => stateVariables[x.componentName],
      );
      expect((await g2children[0].stateValues.xs)[0]).eq(clamp(x));
      expect((await g2children[0].stateValues.xs)[1]).eq(wrap(y));
      expect((await g2children[1].stateValues.xs)[0]).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1]).eq(clamp(x));
    });

    cy.log("move point 6");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = -3,
        y = 12;

      await win.callAction1({
        actionName: "movePoint",
        componentName: stateVariables["/g2"].activeChildren[2].componentName,
        args: { x: y, y: x },
      });

      stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(clamp(x));
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(wrap(y));
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(clamp(x));
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(wrap(y));
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(clamp(x));

      let g2children = stateVariables["/g2"].activeChildren.map(
        (x) => stateVariables[x.componentName],
      );
      expect((await g2children[0].stateValues.xs)[0]).eq(clamp(x));
      expect((await g2children[0].stateValues.xs)[1]).eq(wrap(y));
      expect((await g2children[1].stateValues.xs)[0]).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0]).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1]).eq(clamp(x));
    });
  });

  it("round", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <round>55.3252326</round>
      <round>log(31)</round>
      <round>0.5</round>

      <round numDecimals="1">55.3252326</round>
      <round numDecimals="2">log(31)</round>
      <round numDecimals="3">0.5555</round>

      <round numDigits="3">55.3252326</round>
      <round numDigits="4">log(31)</round>
      <round numDigits="5">0.555555</round>

      <round numDigits="3"><math>sin(55.3252326 x)</math></round>
      <round numDigits="3">log(31) exp(3) <number>sin(2)</number></round>

      <round numDecimals="-6"><math>exp(20) pi</math></round>

      $_round1{name="round1b"}
      $_round5{name="round5b"}
      $_round11{name="round11b"}
  
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/_round1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("55");
        });
      cy.get(cesc("#\\/_round2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/_round3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/_round4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("55.3");
        });
      cy.get(cesc("#\\/_round5"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3.43");
        });
      cy.get(cesc("#\\/_round6"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.556");
        });
      cy.get(cesc("#\\/_round7"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("55.3");
        });
      cy.get(cesc("#\\/_round8"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3.434");
        });
      cy.get(cesc("#\\/_round9"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.55556");
        });
      cy.get(cesc("#\\/_round10"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(55.3x)");
        });
      cy.get(cesc("#\\/_round11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("62.7");
        });
      cy.get(cesc("#\\/_round12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1524000000");
        });
      cy.get(cesc("#\\/round1b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("55");
        });
      cy.get(cesc("#\\/round5b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3.43");
        });
      cy.get(cesc("#\\/round11b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("62.7");
        });

      cy.window().then(async (win) => {
        expect(stateVariables["/_round1"].stateValues.value).eq(55);
        expect(stateVariables["/_round2"].stateValues.value).eq(3);
        expect(stateVariables["/_round3"].stateValues.value).eq(1);
        expect(stateVariables["/_round4"].stateValues.value).eq(55.3);
        expect(stateVariables["/_round5"].stateValues.value).eq(3.43);
        expect(stateVariables["/_round6"].stateValues.value).eq(0.556);
        expect(stateVariables["/_round7"].stateValues.value).eq(55.3);
        expect(stateVariables["/_round8"].stateValues.value).eq(3.434);
        expect(stateVariables["/_round9"].stateValues.value).eq(0.55556);
        expect(stateVariables["/_round10"].stateValues.value).eqls([
          "apply",
          "sin",
          ["*", 55.3, "x"],
        ]);
        expect(stateVariables["/_round11"].stateValues.value).eq(62.7);
        expect(stateVariables["/_round12"].stateValues.value).eq(1524000000);
        expect(stateVariables["/round1b"].stateValues.value).eq(55);
        expect(stateVariables["/round5b"].stateValues.value).eq(3.43);
        expect(stateVariables["/round11b"].stateValues.value).eq(62.7);
      });
    });
  });

  it("round ignores display rounding of math children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <round numDigits="6"><math>55.3252326</math></round>
      <round numDigits="6"><number>55.3252326</number></round>
      <round numDecimals="6"><math>55.3252326</math></round>
      <round numDecimals="6"><number>55.3252326</number></round>

      <round numDigits="6"><math displayDigits="1">55.3252326</math></round>
      <round numDigits="6"><number displayDecimals="1">55.3252326</number></round>
      <round numDecimals="6"><math displayDigits="1">55.3252326</math></round>
      <round numDecimals="6"><number displayDecimals="1">55.3252326</number></round>

      <math copysource="_round1" name="r1a" />
      <math copysource="_round2" name="r2a" />
      <math copysource="_round3" name="r3a" />
      <math copysource="_round4" name="r4a" />
      
      <math copysource="_round5" name="r5a" />
      <math copysource="_round6" name="r6a" />
      <math copysource="_round7" name="r7a" />
      <math copysource="_round8" name="r8a" />

      <math copysource="_round1.value" name="r1b" />
      <math copysource="_round2.value" name="r2b" />
      <math copysource="_round3.value" name="r3b" />
      <math copysource="_round4.value" name="r4b" />
      
      <math copysource="_round5.value" name="r5b" />
      <math copysource="_round6.value" name="r6b" />
      <math copysource="_round7.value" name="r7b" />
      <math copysource="_round8.value" name="r8b" />

  
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc2("#/_round1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/_round2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/_round3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");
    cy.get(cesc2("#/_round4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");

    cy.get(cesc2("#/_round5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/_round6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/_round7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");
    cy.get(cesc2("#/_round8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");

    cy.get(cesc2("#/r1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/r2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/r3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");
    cy.get(cesc2("#/r4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");

    cy.get(cesc2("#/r5a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/r6a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/r7a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");
    cy.get(cesc2("#/r8a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");

    cy.get(cesc2("#/r1b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/r2b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/r3b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");
    cy.get(cesc2("#/r4b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");

    cy.get(cesc2("#/r5b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/r6b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.3252");
    cy.get(cesc2("#/r7b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");
    cy.get(cesc2("#/r8b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "55.325233");
  });

  it("convert set to list", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

      <p><text>a</text></p>
      <p><math>{1,2,3,2,1}</math></p>
      <p><math>(1,2,3,2,1)</math></p>
      <p><math>1,2,3,2,1</math></p>

      <p><convertSetToList>$_math1</convertSetToList></p>
      <p><convertSetToList>$_math2</convertSetToList></p>
      <p><convertSetToList>$_math3</convertSetToList></p>

      <p>$_convertsettolist1{name="r1"}</p>
      <p>$_convertsettolist2{name="r2"}</p>
      <p>$_convertsettolist3{name="r3"}</p>


      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("{1,2,3,2,1}");
        });
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2,3,2,1)");
        });
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1,2,3,2,1");
        });
      cy.get(cesc("#\\/_convertsettolist1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1,2,3");
        });
      cy.get(cesc("#\\/_convertsettolist2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2,3,2,1)");
        });
      cy.get(cesc("#\\/_convertsettolist3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1,2,3,2,1");
        });
      cy.get(cesc("#\\/r1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1,2,3");
        });
      cy.get(cesc("#\\/r2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2,3,2,1)");
        });
      cy.get(cesc("#\\/r3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1,2,3,2,1");
        });

      cy.window().then(async (win) => {
        expect(stateVariables["/_math1"].stateValues.value).eqls([
          "set",
          1,
          2,
          3,
          2,
          1,
        ]);
        expect(stateVariables["/_math2"].stateValues.value).eqls([
          "tuple",
          1,
          2,
          3,
          2,
          1,
        ]);
        expect(stateVariables["/_math3"].stateValues.value).eqls([
          "list",
          1,
          2,
          3,
          2,
          1,
        ]);
        expect(stateVariables["/_convertsettolist1"].stateValues.value).eqls([
          "list",
          1,
          2,
          3,
        ]);
        expect(stateVariables["/_convertsettolist2"].stateValues.value).eqls([
          "tuple",
          1,
          2,
          3,
          2,
          1,
        ]);
        expect(stateVariables["/_convertsettolist3"].stateValues.value).eqls([
          "list",
          1,
          2,
          3,
          2,
          1,
        ]);
        expect(stateVariables["/r1"].stateValues.value).eqls(["list", 1, 2, 3]);
        expect(stateVariables["/r2"].stateValues.value).eqls([
          "tuple",
          1,
          2,
          3,
          2,
          1,
        ]);
        expect(stateVariables["/r3"].stateValues.value).eqls([
          "list",
          1,
          2,
          3,
          2,
          1,
        ]);
        expect(stateVariables["/_convertsettolist1"].stateValues.unordered).eq(
          true,
        );
        expect(stateVariables["/_convertsettolist2"].stateValues.unordered).eq(
          true,
        );
        expect(stateVariables["/_convertsettolist3"].stateValues.unordered).eq(
          true,
        );
        expect(stateVariables["/r1"].stateValues.unordered).eq(true);
        expect(stateVariables["/r2"].stateValues.unordered).eq(true);
        expect(stateVariables["/r3"].stateValues.unordered).eq(true);
      });
    });
  });

  it("convert set to list, initially unresolved", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

      <p><text>a</text></p>

      <p><math name="m">7</math>
      <selectFromSequence assignNames='p' hide='true' exclude="$m, $n" from="-10" to="10" />
      </p>

      <p><convertSetToList><math>{$m,$n,$p,$m}</math></convertSetToList></p>
      <p>$_convertsettolist1{name="csl2"}</p>

      <p>$n3{name="n2"}
      $num1{name="n"}
      <math name="num1" simplify>$n2+$num2</math>
      <math name="num2" simplify>$n3+$num3</math>
      $num3{name="n3"}
      <number name="num3">1</number></p>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let p = await stateVariables["/p"].stateValues.value;
      expect(stateVariables["/_convertsettolist1"].stateValues.value).eqls([
        "list",
        7,
        3,
        p,
      ]);
      expect(stateVariables["/csl2"].stateValues.value).eqls(["list", 7, 3, p]);
      expect(stateVariables["/_convertsettolist1"].stateValues.unordered).eq(
        true,
      );
      expect(stateVariables["/csl2"].stateValues.unordered).eq(true);
    });
  });

  it("floor and ceil", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <floor>55.3252326</floor>
      <ceil>log(31)</ceil>

      <floor>$_floor1/$_ceil1</floor>
      <ceil>$_ceil1/$_floor1</ceil>

      <p>Allow for slight roundoff error:
      <floor>3.999999999999999</floor>
      <ceil>-6999.999999999999</ceil>
      </p>

      $_floor2{name="f2a"}
      $_ceil2{name="c2a"}

      <floor>2.1x</floor>
      <ceil>-3.2y</ceil>
  
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/_floor1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("55");
        });
      cy.get(cesc("#\\/_ceil1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/_floor2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("13");
        });
      cy.get(cesc("#\\/_ceil2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/_floor3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/_ceil3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−7000");
        });
      cy.get(cesc("#\\/f2a"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("13");
        });
      cy.get(cesc("#\\/c2a"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/_floor4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("⌊2.1x⌋");
        });
      cy.get(cesc("#\\/_ceil4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("⌈−3.2y⌉");
        });

      cy.window().then(async (win) => {
        expect(stateVariables["/_floor1"].stateValues.value).eq(55);
        expect(stateVariables["/_ceil1"].stateValues.value).eq(4);
        expect(stateVariables["/_floor2"].stateValues.value).eq(13);
        expect(stateVariables["/_ceil2"].stateValues.value).eq(1);
        expect(stateVariables["/_floor3"].stateValues.value).eq(4);
        expect(stateVariables["/_ceil3"].stateValues.value).eq(-7000);
        expect(stateVariables["/f2a"].stateValues.value).eq(13);
        expect(stateVariables["/c2a"].stateValues.value).eq(1);
        expect(stateVariables["/_floor4"].stateValues.value).eqls([
          "apply",
          "floor",
          ["*", 2.1, "x"],
        ]);
        expect(stateVariables["/_ceil4"].stateValues.value).eqls([
          "apply",
          "ceil",
          ["-", ["*", 3.2, "y"]],
        ]);
      });
    });
  });

  it("floor and ceil as math expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <math displayDigits="10" name="floor1" format="latex">\\lfloor 55.3252326 \\rfloor</math>
      <math displayDigits="10" name="floor2">floor(55.3252326)</math>
      <math displayDigits="10" name="floor1simp" copySource="floor1" simplify />
      <math displayDigits="10" name="floor2simp" copySource="floor2" simplify />
      <math displayDigits="10" name="ceil1" format="latex">\\lceil \\log(31.1) \\rceil</math>
      <math displayDigits="10" name="ceil2">ceil(log(31.1))</math>
      <math displayDigits="10" name="ceil1simp" copySource="ceil1" simplify />
      <math displayDigits="10" name="ceil2simp" copySource="ceil2" simplify />

      <math displayDigits="10" name="floor3" format="latex" simplify>\\lfloor $floor1/$ceil1 \\rfloor</math>
      <math displayDigits="10" name="floor4" simplify>floor($floor1/$ceil1)</math>
      <math displayDigits="10" name="ceil3" format="latex" simplify>\\lceil $ceil1/$floor1 \\rceil</math>
      <math displayDigits="10" name="ceil4" simplify>ceil($ceil1/$floor1)</math>

      <p>Allow for slight roundoff error:
      <math displayDigits="10" format="latex" name="floor5" simplify>\\lfloor 3.999999999999999 \\rfloor</math>
      <math displayDigits="10" name="floor6" simplify>floor 3.999999999999999</math>
      <math displayDigits="10" format="latex" name="ceil5" simplify>\\lceil -6999.999999999999 \\rceil</math>
      <math displayDigits="10" name="ceil6" simplify>ceil -6999.999999999999</math>
      </p>

      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/floor1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("⌊55.3252326⌋");
      });
    cy.get(cesc("#\\/floor2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("⌊55.3252326⌋");
      });
    cy.get(cesc("#\\/floor1simp"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("55");
      });
    cy.get(cesc("#\\/floor2simp"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("55");
      });
    cy.get(cesc("#\\/ceil1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("⌈log(31.1)⌉");
      });
    cy.get(cesc("#\\/ceil2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("⌈log(31.1)⌉");
      });
    cy.get(cesc("#\\/ceil1simp"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/ceil2simp"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/floor3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("13");
      });
    cy.get(cesc("#\\/floor4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("13");
      });
    cy.get(cesc("#\\/ceil3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/ceil4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/floor5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/floor6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/ceil5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7000");
      });
    cy.get(cesc("#\\/ceil6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7000");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/floor1"].stateValues.value).eqls([
        "apply",
        "floor",
        55.3252326,
      ]);
      expect(stateVariables["/floor2"].stateValues.value).eqls([
        "apply",
        "floor",
        55.3252326,
      ]);
      expect(stateVariables["/floor1simp"].stateValues.value).eq(55);
      expect(stateVariables["/floor2simp"].stateValues.value).eq(55);
      expect(stateVariables["/ceil1"].stateValues.value).eqls([
        "apply",
        "ceil",
        ["apply", "log", 31.1],
      ]);
      expect(stateVariables["/ceil2"].stateValues.value).eqls([
        "apply",
        "ceil",
        ["apply", "log", 31.1],
      ]);
      expect(stateVariables["/ceil1simp"].stateValues.value).eq(4);
      expect(stateVariables["/ceil2simp"].stateValues.value).eq(4);
      expect(stateVariables["/floor3"].stateValues.value).eq(13);
      expect(stateVariables["/floor4"].stateValues.value).eq(13);
      expect(stateVariables["/ceil3"].stateValues.value).eq(1);
      expect(stateVariables["/ceil4"].stateValues.value).eq(1);
      expect(stateVariables["/floor5"].stateValues.value).eq(4);
      expect(stateVariables["/floor6"].stateValues.value).eq(4);
      expect(stateVariables["/ceil5"].stateValues.value).eq(-7000);
      expect(stateVariables["/ceil6"].stateValues.value).eq(-7000);
    });
  });

  it("abs", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <abs>-5.3</abs>
      <abs>-x</abs>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/_abs1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5.3");
      });
    cy.get(cesc("#\\/_abs2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("|−x|");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_abs1"].stateValues.value).eq(5.3);
      expect(stateVariables["/_abs2"].stateValues.value).eqls([
        "apply",
        "abs",
        ["-", "x"],
      ]);
    });
  });

  it("invert abs", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <abs name="a1">-9</abs>
      <mathinput bindValueTo="$a1" name="a2" />
      $a2.value{assignNames="a3"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/a1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc(`#\\/a2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("9");
      });
    cy.get(cesc("#\\/a3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a1"].stateValues.value).eq(9);
      expect(stateVariables["/a2"].stateValues.value).eq(9);
      expect(stateVariables["/a3"].stateValues.value).eq(9);
    });

    cy.get(cesc("#\\/a2") + " textarea").type("{end}{backspace}-3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/a3")).should("contain.text", "0");

    cy.get(cesc("#\\/a1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc(`#\\/a2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc("#\\/a3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a1"].stateValues.value).eq(0);
      expect(stateVariables["/a2"].stateValues.value).eq(0);
      expect(stateVariables["/a3"].stateValues.value).eq(0);
    });

    cy.get(cesc("#\\/a2") + " textarea").type("{end}{backspace}7{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/a3")).should("contain.text", "7");

    cy.get(cesc("#\\/a1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc(`#\\/a2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
      });
    cy.get(cesc("#\\/a3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a1"].stateValues.value).eq(7);
      expect(stateVariables["/a2"].stateValues.value).eq(7);
      expect(stateVariables["/a3"].stateValues.value).eq(7);
    });

    cy.get(cesc("#\\/a2") + " textarea").type("{end}{backspace}x{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/a3")).should("contain.text", "|x|");

    cy.get(cesc("#\\/a1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("|x|");
      });
    cy.get(cesc(`#\\/a2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("|x|");
      });
    cy.get(cesc("#\\/a3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("|x|");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a1"].stateValues.value).eqls([
        "apply",
        "abs",
        "x",
      ]);
      expect(stateVariables["/a2"].stateValues.value).eqls([
        "apply",
        "abs",
        "x",
      ]);
      expect(stateVariables["/a3"].stateValues.value).eqls([
        "apply",
        "abs",
        "x",
      ]);
    });

    cy.get(cesc("#\\/a2") + " textarea").type(
      "{end}{leftArrow}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/a3")).should("contain.text", "|y|");

    cy.get(cesc("#\\/a1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("|y|");
      });
    cy.get(cesc(`#\\/a2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("|y|");
      });
    cy.get(cesc("#\\/a3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("|y|");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a1"].stateValues.value).eqls([
        "apply",
        "abs",
        "y",
      ]);
      expect(stateVariables["/a2"].stateValues.value).eqls([
        "apply",
        "abs",
        "y",
      ]);
      expect(stateVariables["/a3"].stateValues.value).eqls([
        "apply",
        "abs",
        "y",
      ]);
    });
  });

  it("floor, ceil, round and abs updatable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <graph>
        <point layer="1">(6.1,7.6)</point>
        <point>
          (
          <floor>
            $_point1.x
          </floor>,
          <ceil>
            $_point1.y
          </ceil>
          )
        </point>
        <point>(<abs>$_point2.y</abs>, <round>$_point1.x</round>)</point>
      </graph>

      $_graph1{name="g2"}
      `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let g2ChildrenNames;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      g2ChildrenNames = stateVariables["/g2"].activeChildren.map(
        (x) => x.componentName,
      );
    });

    let checkPoints = async function (x, y) {
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(Math.floor(x));
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(Math.ceil(y));
        expect(stateVariables["/_point3"].stateValues.xs[0]).eq(
          Math.abs(Math.ceil(y)),
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).eq(Math.round(x));

        let g2Children = g2ChildrenNames.map((x) => stateVariables[x]);
        expect((await g2Children[0].stateValues.xs)[0]).eq(x);
        expect((await g2Children[0].stateValues.xs)[1]).eq(y);
        expect((await g2Children[1].stateValues.xs)[0]).eq(Math.floor(x));
        expect((await g2Children[1].stateValues.xs)[1]).eq(Math.ceil(y));
        expect((await g2Children[2].stateValues.xs)[0]).eq(
          Math.abs(Math.ceil(y)),
        );
        expect((await g2Children[2].stateValues.xs)[1]).eq(Math.round(x));
      });
    };

    checkPoints(6.1, 7.6);

    cy.log("move point 1, positive y");
    cy.window().then(async (win) => {
      let x = -5.1,
        y = 0.3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x, y },
      });
      checkPoints(x, y);
    });

    cy.log("move point 1, negative y");
    cy.window().then(async (win) => {
      let x = -7.9,
        y = -5.8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x, y },
      });
      checkPoints(x, y);
    });

    cy.log("move point 2, positive y");
    cy.window().then(async (win) => {
      let x = 3.4,
        y = 8.6;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x, y },
      });
      checkPoints(x, y);
    });

    cy.log("move point 2, negative y");
    cy.window().then(async (win) => {
      let x = 7.7,
        y = -4.4;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x, y },
      });
      checkPoints(x, y);
    });

    cy.log("move point 3, positive x");
    cy.window().then(async (win) => {
      let x = 9.4,
        y = -1.3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x, y },
      });
      checkPoints(y, x);
    });

    cy.log("move point 3, negative x");
    cy.window().then(async (win) => {
      let x = -8.9,
        y = -4.6;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x, y },
      });
      checkPoints(y, 0);
    });

    cy.log("move point 4, positive y");
    cy.window().then(async (win) => {
      let x = 6.8,
        y = 3.7;

      await win.callAction1({
        actionName: "movePoint",
        componentName: g2ChildrenNames[0],
        args: { x, y },
      });
      checkPoints(x, y);
    });

    cy.log("move point 4, negative y");
    cy.window().then(async (win) => {
      let x = 1.2,
        y = -1.4;
      await win.callAction1({
        actionName: "movePoint",
        componentName: g2ChildrenNames[0],
        args: { x, y },
      });
      checkPoints(x, y);
    });

    cy.log("move point 5, positive y");
    cy.window().then(async (win) => {
      let x = -6.6,
        y = 3.2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: g2ChildrenNames[1],
        args: { x, y },
      });
      checkPoints(x, y);
    });

    cy.log("move point 5, negative y");
    cy.window().then(async (win) => {
      let x = -4.3,
        y = -8.9;
      await win.callAction1({
        actionName: "movePoint",
        componentName: g2ChildrenNames[1],
        args: { x, y },
      });
      checkPoints(x, y);
    });

    cy.log("move point 6, positive x");
    cy.window().then(async (win) => {
      let x = 6.4,
        y = 2.3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: g2ChildrenNames[2],
        args: { x, y },
      });
      checkPoints(y, x);
    });

    cy.log("move point 6, negative x");
    cy.window().then(async (win) => {
      let x = -5.6,
        y = 7.8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: g2ChildrenNames[2],
        args: { x, y },
      });
      checkPoints(y, 0);
    });
  });

  it("sign", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <sign>-5.3</sign>
      <sign>63</sign>
      <sign>0</sign>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/_sign1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−1");
      });
    cy.get(cesc("#\\/_sign2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/_sign3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_sign1"].stateValues.value).eq(-1);
      expect(stateVariables["/_sign2"].stateValues.value).eq(1);
      expect(stateVariables["/_sign3"].stateValues.value).eq(0);
    });
  });

  it("mean", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <mean name="numbers"><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></mean>
      <mean name="withNumberMean"><math>3</math><mean><number>17</number><number>5-4</number></mean></mean>
      <mean name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      <mean name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      <mean name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3+17+13");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3+17+13");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("62+17+13");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/withNumberMean"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("6");
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+x+y+x+y+z3");
        });
      cy.get(cesc("#\\/varsSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3x+2y+z3");
        });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+x+y+x+y+z3");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(7);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.value).eqls([
          "/",
          ["+", 3, 17, 1],
          3,
        ]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eq(7);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumberMath"].stateValues.value).eq(
          7,
        );
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .value,
        ).eqls(["/", ["+", 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(7);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.value,
        ).eqls(["/", ["+", ["/", 6, 2], 17, 1], 3]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eq(7);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).eq(7);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberMean"].stateValues.value).eq(6);
        expect(
          stateVariables["/withNumberMean"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMean"].stateValues.isNumber).eq(true);
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "/",
          ["+", "x", "x", "y", "x", "y", "z"],
          3,
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.value).eqls([
          "/",
          ["+", ["*", 3, "x"], ["*", 2, "y"], "z"],
          3,
        ]);
        expect(
          stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numbersb"].stateValues.value).eq(7);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value).eqls([
          "/",
          ["+", "x", "x", "y", "x", "y", "z"],
          3,
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
      });
    });
  });

  it("mean with sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <mean name="numbers"><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersAsString">3 17 1</mean>
      <mean name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</mean>
      <mean name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</mean>
      <mean name="numericAsString">6/2 17 5-4</mean>
      <mean name="numericAsStringSimplify" simplify>6/2 17 5-4</mean>
      <mean name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</mean>
      <mean name="numbersAsMacros">$a$b$c</mean>
      <mean name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</mean>
      <mean name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</mean>
      <mean name="numbersAsMacros2">$a $b $c</mean>
      <mean name="withNumberMathMacro">$aNumberMath$b$c</mean>
      <mean name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</mean>
      <mean name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</mean>
      <mean name="withNumericMathMacro">$aNumericMath$b$c</mean>
      <mean name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</mean>
      <mean name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</mean>
      <mean name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      <mean name="varsAsString">x x+y x+y+z</mean>
      <mean name="varsAsStringSimplify" simplify>x x+y x+y+z</mean>
      <mean name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</mean>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numbers"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/numbersAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3+17+13");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/numericAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("62+17+5−43");
      });
    cy.get(cesc("#\\/numericAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/numericAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/numbersAsMacros"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3+17+13");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/numbersAsMacros2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/withNumberMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3+17+13");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/withNumericMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("62+17+13");
      });
    cy.get(cesc("#\\/withNumericMathMacroSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/withNumericMathMacroForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/vars"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x+x+y+x+y+z3");
      });
    cy.get(cesc("#\\/varsAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x+x+y+x+y+z3");
      });
    cy.get(cesc("#\\/varsAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3x+2y+z3");
      });
    cy.get(cesc("#\\/varsAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("NaN");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(7);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value).eq(7);
        expect(
          stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.value,
        ).eqls(["/", ["+", 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .value,
        ).eq(7);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value).eqls([
          "/",
          ["+", ["/", 6, 2], 17, 5, -4],
          3,
        ]);
        expect(
          stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numericAsStringSimplify"].stateValues.value).eq(
          7,
        );
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.value,
        ).eq(7);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value).eq(7);
        expect(
          stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value,
        ).eqls(["/", ["+", 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .value,
        ).eq(7);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value).eq(7);
        expect(
          stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/withNumberMathMacro"].stateValues.value).eq(7);
        expect(
          stateVariables["/withNumberMathMacro"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues.value,
        ).eqls(["/", ["+", 3, 17, 1], 3]);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(7);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/withNumericMathMacro"].stateValues.value).eqls([
          "/",
          ["+", ["/", 6, 2], 17, 1],
          3,
        ]);
        expect(
          stateVariables["/withNumericMathMacro"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.value,
        ).eq(7);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues.value,
        ).eq(7);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "/",
          ["+", "x", "x", "y", "x", "y", "z"],
          3,
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.value).eqls([
          "/",
          ["+", "x", "x", "y", "x", "y", "z"],
          3,
        ]);
        expect(
          stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(
          stateVariables["/varsAsStringSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.value).eqls([
          "/",
          ["+", ["*", 3, "x"], ["*", 2, "y"], "z"],
          3,
        ]);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.value,
        ).eqls(NaN);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
      });
    });
  });

  it("mean as math expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">mean(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>mean(3,17,5-4)</math>
      <math name="numberStringProduct">mean(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>mean(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        mean(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      mean(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        mean(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        mean(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        mean($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        mean($a,$b,$c)
      </math>
      <math name="macrosProduct">
        mean($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        mean($a$b$c)
      </math>
      <math name="group">
        mean($nums)
      </math>
      <math name="groupSimplify" simplify>
        mean($nums)
      </math>
      <math name="groupPlus">
        mean($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        mean($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        mean($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        mean($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        mean($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        mean($a, $b, $nums, $c)
      </math>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numberString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mean(3,17,5−4)");
      });
    cy.get(cesc("#\\/numberStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/numberStringProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mean(3⋅17⋅5−4)");
      });
    cy.get(cesc("#\\/numberStringProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("251");
      });
    cy.get(cesc("#\\/numberComponentsCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mean(3,17,1)");
      });
    cy.get(cesc("#\\/numberComponentsCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/numberComponentsProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mean(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/numberComponentsProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/macrosCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mean(3,17,1)");
      });
    cy.get(cesc("#\\/macrosCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/macrosProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mean(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/macrosProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/group"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mean(3,17,1)");
      });
    cy.get(cesc("#\\/groupSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/groupPlus"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mean(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlusSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/groupPlus2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mean(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlus2Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/groupPlus3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mean(3,17,3,17,1,1)");
      });
    cy.get(cesc("#\\/groupPlus3Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numberString"].stateValues.value).eqls([
          "apply",
          "mean",
          ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/numberStringSimplify"].stateValues.value).eq(7);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/numberStringProduct"].stateValues.value).eqls([
          "apply",
          "mean",
          ["+", ["*", 3, 17, 5], -4],
        ]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.value,
        ).eq(251);
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
          stateVariables["/numberComponentsCommas"].stateValues.value,
        ).eqls(["apply", "mean", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues.value,
        ).eq(7);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.value,
        ).eqls(["apply", "mean", ["*", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues
            .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value).eqls([
          "apply",
          "mean",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.value).eq(7);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value).eqls([
          "apply",
          "mean",
          ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosProductSimplify"].stateValues.value).eq(
          51,
        );
        expect(
          stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value).eqls([
          "apply",
          "mean",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value).eq(7);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value).eqls([
          "apply",
          "mean",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value).eq(7);
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value).eqls([
          "apply",
          "mean",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value).eq(7);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value).eqls([
          "apply",
          "mean",
          ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value).eq(7);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
          true,
        );
      });
    });
  });

  it("mean additional cases", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="pPrime">Mean of first primes: <mean name="meanPrime">2 3 5 7</mean></p>
    <p>Copying that mean: $meanPrime{name="meanPrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Mean of numbers from 1 to 100: <mean name="mean100"><sequence to="100" /></mean></p>
    <p>Copying that mean: $mean100{name="mean100b"}</p>
    $p100{name="p100b"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.log("Test value displayed in browser");

      cy.get(cesc("#\\/meanPrime"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4.25");
        });
      cy.get(cesc("#\\/meanPrimeb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4.25");
        });
      cy.get(cesc("#\\/pPrimeb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4.25");
        });
      cy.get(cesc("#\\/mean100"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("50.5");
        });
      cy.get(cesc("#\\/mean100b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("50.5");
        });
      cy.get(cesc("#\\/p100b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("50.5");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        expect(stateVariables["/meanPrime"].stateValues.value).eq(4.25);
        expect(stateVariables["/meanPrimeb"].stateValues.value).eq(4.25);
        expect(
          stateVariables[
            stateVariables["/pPrimeb"].activeChildren[1].componentName
          ].stateValues.value,
        ).eq(4.25);
        expect(stateVariables["/mean100"].stateValues.value).eq(50.5);
        expect(stateVariables["/mean100b"].stateValues.value).eq(50.5);
        expect(
          stateVariables[
            stateVariables["/p100b"].activeChildren[1].componentName
          ].stateValues.value,
        ).eq(50.5);
      });
    });
  });

  it("median", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <median name="numbers"><number>3</number><number>17</number><number>5-4</number></median>
      <median name="sugared">1 4 5 10000</median>
      <median name="noSymbolic">1 4 5 x+1</median>
      `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/numbers") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/sugared") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4.5");
    cy.get(cesc2("#/noSymbolic") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/numbers"].stateValues.value).eq(3);
      expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(true);
      expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
    });
  });

  // TODO: skipping most checks of ugly expressions for now
  it("variance", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <variance name="numbers"><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></variance>
      <variance name="withNumberVariance"><math>3</math><variance><number>17</number><number>5-4</number></variance></variance>
      <variance name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      <variance name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      <variance name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let theVariance = me.math.variance([3, 17, 1]);
      let theVarianceString = theVariance.toString();

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("32+172+12−(3+17+1)232");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("32+172+12−(3+17+1)232");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(62)2+172+12−(62+17+1)232");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/withNumberVariance"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(
            me.math.variance([3, me.math.variance([17, 1])]).toString(),
          );
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232");
        });
      // cy.get(cesc('#\\/varsSimplify')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('3x+2y+z3')
      // });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(theVariance);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        // expect(stateVariables['/numbersForceSymbolic'].stateValues.value).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eq(theVariance);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumberMath"].stateValues.value).eq(
          theVariance,
        );
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumberMathForceSymbolic'].stateValues.value).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(theVariance);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumericMath'].stateValues.value).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eq(theVariance);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).eq(theVariance);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberVariance"].stateValues.value).eq(
          me.math.variance([3, me.math.variance([17, 1])]),
        );
        expect(
          stateVariables["/withNumberVariance"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberVariance"].stateValues.isNumber).eq(
          true,
        );
        // expect(stateVariables['/vars'].stateValues.value).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        // expect(stateVariables['/varsSimplify'].stateValues.value).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(
          stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numbersb"].stateValues.value).eq(theVariance);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        // expect(stateVariables["/varsb"].stateValues.value).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
      });
    });
  });

  it("variance with sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <variance name="numbers"><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersAsString">3 17 1</variance>
      <variance name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</variance>
      <variance name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</variance>
      <variance name="numericAsString">6/2 17 5-4</variance>
      <variance name="numericAsStringSimplify" simplify>6/2 17 5-4</variance>
      <variance name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</variance>
      <variance name="numbersAsMacros">$a$b$c</variance>
      <variance name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</variance>
      <variance name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</variance>
      <variance name="numbersAsMacros2">$a $b $c</variance>
      <variance name="withNumberMathMacro">$aNumberMath$b$c</variance>
      <variance name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</variance>
      <variance name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</variance>
      <variance name="withNumericMathMacro">$aNumericMath$b$c</variance>
      <variance name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</variance>
      <variance name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</variance>
      <variance name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      <variance name="varsAsString">x x+y x+y+z</variance>
      <variance name="varsAsStringSimplify" simplify>x x+y x+y+z</variance>
      <variance name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</variance>
      `,
        },
        "*",
      );
    });

    let theVariance = me.math.variance([3, 17, 1]);
    let theVarianceString = theVariance.toString();

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numbers"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/numbersAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("32+172+12−(3+17+1)232");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/numericAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(62)2+172+(5−4)2−(62+17+5−4)232");
      });
    cy.get(cesc("#\\/numericAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/numericAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/numbersAsMacros"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("32+172+12−(3+17+1)232");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/numbersAsMacros2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/withNumberMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("32+172+12−(3+17+1)232");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/withNumericMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(62)2+172+12−(62+17+1)232");
      });
    cy.get(cesc("#\\/withNumericMathMacroSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/withNumericMathMacroForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/vars"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232");
      });
    cy.get(cesc("#\\/varsAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232");
      });
    // cy.get(cesc('#\\/varsAsStringSimplify')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('3x+2y+z3')
    // });
    cy.get(cesc("#\\/varsAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("NaN");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(theVariance);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value).eq(
          theVariance,
        );
        expect(
          stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
          true,
        );
        // expect(stateVariables['/numbersAsStringForceSymbolic'].stateValues.value).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .value,
        ).eq(theVariance);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        // expect(stateVariables['/numericAsString'].stateValues.value).eqls(['/', ['+', ['/', 6, 2], 17, 5, -4], 3]);
        expect(
          stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numericAsStringSimplify"].stateValues.value).eq(
          theVariance,
        );
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.value,
        ).eq(theVariance);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value).eq(
          theVariance,
        );
        expect(
          stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
          true,
        );
        // expect(stateVariables['/numbersAsMacrosForceSymbolic'].stateValues.value).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .value,
        ).eq(theVariance);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value).eq(
          theVariance,
        );
        expect(
          stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/withNumberMathMacro"].stateValues.value).eq(
          theVariance,
        );
        expect(
          stateVariables["/withNumberMathMacro"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
          true,
        );
        // expect(stateVariables['/withNumberMathMacroForceSymbolic'].stateValues.value).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(theVariance);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/withNumericMathMacro'].stateValues.value).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(
          stateVariables["/withNumericMathMacro"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.value,
        ).eq(theVariance);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues.value,
        ).eq(theVariance);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        // expect(stateVariables['/vars'].stateValues.value).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        // expect(stateVariables['/varsAsString'].stateValues.value).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(
          stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(
          stateVariables["/varsAsStringSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        // expect(stateVariables['/varsAsStringSimplify'].stateValues.value).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.value,
        ).eqls(NaN);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
      });
    });
  });

  it("variance as math expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">variance(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>variance(3,17,5-4)</math>
      <math name="numberStringProduct">variance(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>variance(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        variance(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      variance(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        variance(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        variance(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        variance($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        variance($a,$b,$c)
      </math>
      <math name="macrosProduct">
        variance($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        variance($a$b$c)
      </math>
      <math name="group">
        variance($nums)
      </math>
      <math name="groupSimplify" simplify>
        variance($nums)
      </math>
      <math name="groupPlus">
        variance($nums, $a, $b, 13)
      </math>
      <math name="groupPlusSimplify" simplify>
        variance($nums, $a, $b, 13)
      </math>
      <math name="groupPlus2">
        variance($a, $b, 13, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        variance($a, $b, 13, $nums)
      </math>
      <math name="groupPlus3">
        variance($a, $b, $nums, 13)
      </math>
      <math name="groupPlus3Simplify" simplify>
        variance($a, $b, $nums, 13)
      </math>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let theVariance = me.math.variance([3, 17, 1]);
    let theVarianceString = theVariance.toString();
    let theVariance2 = me.math.variance([3, 17, 1, 3, 17, 13]);
    let theVariance2String = theVariance2.toString();

    cy.get(cesc("#\\/numberString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("variance(3,17,5−4)");
      });
    cy.get(cesc("#\\/numberStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/numberStringProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("variance(3⋅17⋅5−4)");
      });
    cy.get(cesc("#\\/numberStringProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/numberComponentsCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("variance(3,17,1)");
      });
    cy.get(cesc("#\\/numberComponentsCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/numberComponentsProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("variance(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/numberComponentsProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/macrosCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("variance(3,17,1)");
      });
    cy.get(cesc("#\\/macrosCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/macrosProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("variance(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/macrosProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/group"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("variance(3,17,1)");
      });
    cy.get(cesc("#\\/groupSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVarianceString);
      });
    cy.get(cesc("#\\/groupPlus"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("variance(3,17,1,3,17,13)");
      });
    cy.get(cesc("#\\/groupPlusSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVariance2String);
      });
    cy.get(cesc("#\\/groupPlus2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("variance(3,17,13,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlus2Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVariance2String);
      });
    cy.get(cesc("#\\/groupPlus3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("variance(3,17,3,17,1,13)");
      });
    cy.get(cesc("#\\/groupPlus3Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theVariance2String);
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numberString"].stateValues.value).eqls([
          "apply",
          "variance",
          ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/numberStringSimplify"].stateValues.value).eq(
          theVariance,
        );
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/numberStringProduct"].stateValues.value).eqls([
          "apply",
          "variance",
          ["+", ["*", 3, 17, 5], -4],
        ]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.value,
        ).eq(0);
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
          stateVariables["/numberComponentsCommas"].stateValues.value,
        ).eqls(["apply", "variance", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues.value,
        ).eq(theVariance);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.value,
        ).eqls(["apply", "variance", ["*", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues.value,
        ).eq(0);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues
            .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value).eqls([
          "apply",
          "variance",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.value).eq(
          theVariance,
        );
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value).eqls([
          "apply",
          "variance",
          ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosProductSimplify"].stateValues.value).eq(
          0,
        );
        expect(
          stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value).eqls([
          "apply",
          "variance",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value).eq(
          theVariance,
        );
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value).eqls([
          "apply",
          "variance",
          ["tuple", 3, 17, 1, 3, 17, 13],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value).eq(
          theVariance2,
        );
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value).eqls([
          "apply",
          "variance",
          ["tuple", 3, 17, 13, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value).eq(
          theVariance2,
        );
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value).eqls([
          "apply",
          "variance",
          ["tuple", 3, 17, 3, 17, 1, 13],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value).eq(
          theVariance2,
        );
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
          true,
        );
      });
    });
  });

  it("variance additional cases", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="pPrime">Variance of first primes: <variance displayDigits="10" name="variancePrime">2 3 5 7</variance></p>
    <p>Copying that variance: $variancePrime{name="variancePrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Variance of numbers from 1 to 100: <variance displayDigits="10" name="variance100"><sequence to="100" /></variance></p>
    <p>Copying that variance: $variance100{name="variance100b"}</p>
    $p100{name="p100b"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let variancePrimes = me.math.variance(2, 3, 5, 7);
    let variance100 = me.math.variance(
      Array.from({ length: 100 }, (_, i) => i + 1),
    );

    cy.log("Test value displayed in browser");

    cy.get(cesc("#\\/variancePrime"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1e-6);
      });
    cy.get(cesc("#\\/variancePrimeb"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1e-6);
      });
    cy.get(cesc("#\\/pPrimeb"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1e-6);
      });
    cy.get(cesc("#\\/variance100"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variance100, 1e-6);
      });
    cy.get(cesc("#\\/variance100b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variance100, 1e-6);
      });
    cy.get(cesc("#\\/p100b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variance100, 1e-6);
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/variancePrime"].stateValues.value).closeTo(
        variancePrimes,
        1e-12,
      );
      expect(stateVariables["/variancePrimeb"].stateValues.value).closeTo(
        variancePrimes,
        1e-12,
      );
      expect(
        stateVariables[
          stateVariables["/pPrimeb"].activeChildren[1].componentName
        ].stateValues.value,
      ).closeTo(variancePrimes, 1e-12);
      expect(stateVariables["/variance100"].stateValues.value).closeTo(
        variance100,
        1e-12,
      );
      expect(stateVariables["/variance100b"].stateValues.value).closeTo(
        variance100,
        1e-12,
      );
      expect(
        stateVariables[stateVariables["/p100b"].activeChildren[1].componentName]
          .stateValues.value,
      ).closeTo(variance100, 1e-12);
    });
  });

  // TODO: skipping most checks of ugly expressions for now
  it("population variance", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <text>a</text>
        <variance population displayDigits="10" name="numbers"><number>4</number><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersForceSymbolic" forceSymbolic><number>4</number><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>4</number><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumberMath"><math>4</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>4</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>4</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumericMath"><math>8/2</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumericMathSimplify" simplify><math>8/2</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="numbersWithNumericMathForceNumeric" forceNumeric><math>8/2</math><number>16</number><number>5-4</number></variance>
        <variance population displayDigits="10" name="withNumberVariance"><math>4</math><variance population><number>17</number><number>5-4</number></variance></variance>
        <variance population displayDigits="10" name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></variance>
        <variance population displayDigits="10" name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></variance>
        <variance population displayDigits="10" name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></variance>
        $numbers{name="numbersb"}
        $vars{name="varsb"}
        `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let theVariance = me.math.variance([4, 16, 1], "uncorrected");
      let theVarianceString = theVariance.toString();

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("42+162+12−(4+16+1)233");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("42+162+12−(4+16+1)233");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(82)2+162+12−(82+16+1)233");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/withNumberVariance"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(
            me.math
              .variance(
                [4, me.math.variance([17, 1], "uncorrected")],
                "uncorrected",
              )
              .toString(),
          );
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)233");
        });
      // cy.get(cesc('#\\/varsSimplify')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('3x+2y+z3')
      // });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(theVarianceString);
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)233");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(theVariance);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        // expect(stateVariables['/numbersForceSymbolic'].stateValues.value).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eq(theVariance);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumberMath"].stateValues.value).eq(
          theVariance,
        );
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumberMathForceSymbolic'].stateValues.value).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(theVariance);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumericMath'].stateValues.value).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eq(theVariance);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).eq(theVariance);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberVariance"].stateValues.value).eq(
          me.math.variance(
            [4, me.math.variance([17, 1], "uncorrected")],
            "uncorrected",
          ),
        );
        expect(
          stateVariables["/withNumberVariance"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberVariance"].stateValues.isNumber).eq(
          true,
        );
        // expect(stateVariables['/vars'].stateValues.value).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        // expect(stateVariables['/varsSimplify'].stateValues.value).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(
          stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numbersb"].stateValues.value).eq(theVariance);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        // expect(stateVariables["/varsb"].stateValues.value).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
      });
    });
  });

  it("population variance additional cases", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="pPrime">Variance of first primes: <variance population displayDigits="10" name="variancePrime">2 3 5 7</variance></p>
    <p>Copying that variance: $variancePrime{name="variancePrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Variance of numbers from 1 to 100: <variance population displayDigits="10" name="variance100"><sequence to="100" /></variance></p>
    <p>Copying that variance: $variance100{name="variance100b"}</p>
    $p100{name="p100b"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let variancePrimes = me.math.variance([2, 3, 5, 7], "uncorrected");
    let variance100 = me.math.variance(
      Array.from({ length: 100 }, (_, i) => i + 1),
      "uncorrected",
    );

    cy.log("Test value displayed in browser");

    cy.get(cesc("#\\/variancePrime"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1e-6);
      });
    cy.get(cesc("#\\/variancePrimeb"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1e-6);
      });
    cy.get(cesc("#\\/pPrimeb"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1e-6);
      });
    cy.get(cesc("#\\/variance100"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variance100, 1e-6);
      });
    cy.get(cesc("#\\/variance100b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variance100, 1e-6);
      });
    cy.get(cesc("#\\/p100b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(variance100, 1e-6);
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/variancePrime"].stateValues.value).closeTo(
        variancePrimes,
        1e-12,
      );
      expect(stateVariables["/variancePrimeb"].stateValues.value).closeTo(
        variancePrimes,
        1e-12,
      );
      expect(
        stateVariables[
          stateVariables["/pPrimeb"].activeChildren[1].componentName
        ].stateValues.value,
      ).closeTo(variancePrimes, 1e-12);
      expect(stateVariables["/variance100"].stateValues.value).closeTo(
        variance100,
        1e-12,
      );
      expect(stateVariables["/variance100b"].stateValues.value).closeTo(
        variance100,
        1e-12,
      );
      expect(
        stateVariables[stateVariables["/p100b"].activeChildren[1].componentName]
          .stateValues.value,
      ).closeTo(variance100, 1e-12);
    });
  });

  // TODO: skipping most checks of ugly expressions for now
  it("standard deviation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <standarddeviation displayDigits="10" name="numbers"><number>3</number><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" name="withNumberStandardDeviation"><math>3</math><standarddeviation><number>17</number><number>5-4</number></standarddeviation></standarddeviation>
      <standarddeviation displayDigits="10" name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation displayDigits="10" name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation displayDigits="10" name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let theStandardDeviation = me.math.std([3, 17, 1]);

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(theStandardDeviation, 1e-6);
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√32+172+12−(3+17+1)232");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√76");
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(theStandardDeviation, 1e-6);
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√32+172+12−(3+17+1)232");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√76");
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√(62)2+172+12−(62+17+1)232");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√76");
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(theStandardDeviation, 1e-6);
        });
      cy.get(cesc("#\\/withNumberStandardDeviation"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(
            me.math.std([3, me.math.std([17, 1])]),
            1e-6,
          );
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232");
        });
      // cy.get(cesc('#\\/varsSimplify')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('3x+2y+z3')
      // });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(theStandardDeviation, 1e-6);
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).closeTo(
          theStandardDeviation,
          1e-12,
        );
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        // expect(stateVariables['/numbersForceSymbolic'].stateValues.value).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eqls(["apply", "sqrt", 76]);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.value,
        ).closeTo(theStandardDeviation, 1e-16);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumberMathForceSymbolic'].stateValues.value).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eqls(["apply", "sqrt", 76]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(false);
        // expect(stateVariables['/numbersWithNumericMath'].stateValues.value).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eqls(["apply", "sqrt", 76]);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).closeTo(theStandardDeviation, 1e-12);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/withNumberStandardDeviation"].stateValues.value,
        ).closeTo(me.math.std([3, me.math.std([17, 1])]), 1e-12);
        expect(
          stateVariables["/withNumberStandardDeviation"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumberStandardDeviation"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/vars'].stateValues.value).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        // expect(stateVariables['/varsSimplify'].stateValues.value).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(
          stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numbersb"].stateValues.value).closeTo(
          theStandardDeviation,
          1e-12,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        // expect(stateVariables["/varsb"].stateValues.value).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
      });
    });
  });

  it("standard deviation as math expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <group name="nums" asList>
        <number name="a">13</number>
        <number name="b">25</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">std(13,25,5-4)</math>
      <math name="numberStringSimplify" simplify>std(13,25,5-4)</math>
      <math name="numberStringProduct">std(13 25 5-4)</math>
      <math name="numberStringProductSimplify" simplify>std(13 25 5-4)</math>
      <math name="numberComponentsCommas">
        std(<number>13</number>,<number>25</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      std(<number>13</number>,<number>25</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        std(<number>13</number><number>25</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        std(<number>13</number><number>25</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        std($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        std($a,$b,$c)
      </math>
      <math name="macrosProduct">
        std($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        std($a$b$c)
      </math>
      <math name="group">
        std($nums)
      </math>
      <math name="groupSimplify" simplify>
        std($nums)
      </math>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let theStd = me.math.std([13, 25, 1]);
    let theStdString = theStd.toString();

    cy.get(cesc("#\\/numberString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("std(13,25,5−4)");
      });
    cy.get(cesc("#\\/numberStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theStdString);
      });
    cy.get(cesc("#\\/numberStringProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("std(13⋅25⋅5−4)");
      });
    cy.get(cesc("#\\/numberStringProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/numberComponentsCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("std(13,25,1)");
      });
    cy.get(cesc("#\\/numberComponentsCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theStdString);
      });
    cy.get(cesc("#\\/numberComponentsProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("std(13⋅25⋅1)");
      });
    cy.get(cesc("#\\/numberComponentsProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/macrosCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("std(13,25,1)");
      });
    cy.get(cesc("#\\/macrosCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theStdString);
      });
    cy.get(cesc("#\\/macrosProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("std(13⋅25⋅1)");
      });
    cy.get(cesc("#\\/macrosProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/group"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("std(13,25,1)");
      });
    cy.get(cesc("#\\/groupSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(theStdString);
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numberString"].stateValues.value).eqls([
          "apply",
          "std",
          ["tuple", 13, 25, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/numberStringSimplify"].stateValues.value).eq(
          theStd,
        );
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/numberStringProduct"].stateValues.value).eqls([
          "apply",
          "std",
          ["+", ["*", 13, 25, 5], -4],
        ]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.value,
        ).eq(0);
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
          stateVariables["/numberComponentsCommas"].stateValues.value,
        ).eqls(["apply", "std", ["tuple", 13, 25, 1]]);
        expect(
          stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues.value,
        ).eq(theStd);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.value,
        ).eqls(["apply", "std", ["*", 13, 25, 1]]);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues.value,
        ).eq(0);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues
            .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value).eqls([
          "apply",
          "std",
          ["tuple", 13, 25, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.value).eq(
          theStd,
        );
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value).eqls([
          "apply",
          "std",
          ["*", 13, 25, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosProductSimplify"].stateValues.value).eq(
          0,
        );
        expect(
          stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value).eqls([
          "apply",
          "std",
          ["tuple", 13, 25, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value).eq(theStd);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);
      });
    });
  });

  it("standard deviation additional cases", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="pPrime">Standard deviation of first primes: <standarddeviation displayDigits="10" name="standarddeviationPrime">2 3 5 7</standarddeviation></p>
    <p>Copying that standard deviation: $standarddeviationPrime{name="standarddeviationPrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Standard deviation of numbers from 1 to 100: <standarddeviation displayDigits="10" name="standarddeviation100"><sequence to="100" /></standarddeviation></p>
    <p>Copying that standard deviation: $standarddeviation100{name="standarddeviation100b"}</p>
    $p100{name="p100b"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let stdPrimes = me.math.std(2, 3, 5, 7);
    let std100 = me.math.std(Array.from({ length: 100 }, (_, i) => i + 1));

    cy.log("Test value displayed in browser");

    cy.get(cesc("#\\/standarddeviationPrime"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1e-6);
      });
    cy.get(cesc("#\\/standarddeviationPrimeb"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1e-6);
      });
    cy.get(cesc("#\\/pPrimeb"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1e-6);
      });
    cy.get(cesc("#\\/standarddeviation100"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(std100, 1e-6);
      });
    cy.get(cesc("#\\/standarddeviation100b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(std100, 1e-6);
      });
    cy.get(cesc("#\\/p100b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(std100, 1e-6);
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/standarddeviationPrime"].stateValues.value,
      ).closeTo(stdPrimes, 1e-12);
      expect(
        stateVariables["/standarddeviationPrimeb"].stateValues.value,
      ).closeTo(stdPrimes, 1e-12);
      expect(
        stateVariables[
          stateVariables["/pPrimeb"].activeChildren[1].componentName
        ].stateValues.value,
      ).closeTo(stdPrimes, 1e-12);
      expect(stateVariables["/standarddeviation100"].stateValues.value).closeTo(
        std100,
        1e-12,
      );
      expect(
        stateVariables["/standarddeviation100b"].stateValues.value,
      ).closeTo(std100, 1e-12);
      expect(
        stateVariables[stateVariables["/p100b"].activeChildren[1].componentName]
          .stateValues.value,
      ).closeTo(std100, 1e-12);
    });
  });

  // TODO: skipping most checks of ugly expressions for now
  it("population standard deviation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <standarddeviation displayDigits="10" population name="numbers"><number>4</number><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersForceSymbolic" forceSymbolic><number>4</number><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>4</number><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumberMath"><math>4</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>4</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>4</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumericMath"><math>8/2</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumericMathSimplify" simplify><math>8/2</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="numbersWithNumericMathForceNumeric" forceNumeric><math>8/2</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation displayDigits="10" population name="withNumberStandardDeviation"><math>3</math><standarddeviation displayDigits="10" population><number>17</number><number>5-4</number></standarddeviation></standarddeviation>
      <standarddeviation displayDigits="10" population name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation displayDigits="10" population name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation displayDigits="10" population name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let theStandardDeviation = me.math.std([4, 16, 1], "uncorrected");

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(theStandardDeviation, 1e-6);
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√42+162+12−(4+16+1)233");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√42");
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(theStandardDeviation, 1e-6);
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√42+162+12−(4+16+1)233");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√42");
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√(82)2+162+12−(82+16+1)233");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√42");
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(theStandardDeviation, 1e-6);
        });
      cy.get(cesc("#\\/withNumberStandardDeviation"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(
            me.math.std(
              [3, me.math.std([17, 1], "uncorrected")],
              "uncorrected",
            ),
            1e-6,
          );
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)233");
        });
      // cy.get(cesc('#\\/varsSimplify')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('3x+2y+z3')
      // });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(theStandardDeviation, 1e-6);
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("√x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)233");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).closeTo(
          theStandardDeviation,
          1e-12,
        );
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        // expect(stateVariables['/numbersForceSymbolic'].stateValues.value).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eqls(["apply", "sqrt", 42]);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.value,
        ).closeTo(theStandardDeviation, 1e-16);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/numbersWithNumberMathForceSymbolic'].stateValues.value).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eqls(["apply", "sqrt", 42]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(false);
        // expect(stateVariables['/numbersWithNumericMath'].stateValues.value).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eqls(["apply", "sqrt", 42]);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).closeTo(theStandardDeviation, 1e-12);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/withNumberStandardDeviation"].stateValues.value,
        ).closeTo(
          me.math.std([3, me.math.std([17, 1], "uncorrected")], "uncorrected"),
          1e-12,
        );
        expect(
          stateVariables["/withNumberStandardDeviation"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumberStandardDeviation"].stateValues.isNumber,
        ).eq(true);
        // expect(stateVariables['/vars'].stateValues.value).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        // expect(stateVariables['/varsSimplify'].stateValues.value).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(
          stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numbersb"].stateValues.value).closeTo(
          theStandardDeviation,
          1e-12,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        // expect(stateVariables["/varsb"].stateValues.value).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
      });
    });
  });

  it("population standard deviation additional cases", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="pPrime">Standard deviation of first primes: <standarddeviation displayDigits="10" population name="standarddeviationPrime">2 3 5 7</standarddeviation></p>
    <p>Copying that standard deviation: $standarddeviationPrime{name="standarddeviationPrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Standard deviation of numbers from 1 to 100: <standarddeviation displayDigits="10" population name="standarddeviation100"><sequence to="100" /></standarddeviation></p>
    <p>Copying that standard deviation: $standarddeviation100{name="standarddeviation100b"}</p>
    $p100{name="p100b"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let stdPrimes = me.math.std([2, 3, 5, 7], "uncorrected");
    let std100 = me.math.std(
      Array.from({ length: 100 }, (_, i) => i + 1),
      "uncorrected",
    );

    cy.log("Test value displayed in browser");

    cy.get(cesc("#\\/standarddeviationPrime"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1e-6);
      });
    cy.get(cesc("#\\/standarddeviationPrimeb"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1e-6);
      });
    cy.get(cesc("#\\/pPrimeb"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1e-6);
      });
    cy.get(cesc("#\\/standarddeviation100"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(std100, 1e-6);
      });
    cy.get(cesc("#\\/standarddeviation100b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(std100, 1e-6);
      });
    cy.get(cesc("#\\/p100b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(std100, 1e-6);
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/standarddeviationPrime"].stateValues.value,
      ).closeTo(stdPrimes, 1e-12);
      expect(
        stateVariables["/standarddeviationPrimeb"].stateValues.value,
      ).closeTo(stdPrimes, 1e-12);
      expect(
        stateVariables[
          stateVariables["/pPrimeb"].activeChildren[1].componentName
        ].stateValues.value,
      ).closeTo(stdPrimes, 1e-12);
      expect(stateVariables["/standarddeviation100"].stateValues.value).closeTo(
        std100,
        1e-12,
      );
      expect(
        stateVariables["/standarddeviation100b"].stateValues.value,
      ).closeTo(std100, 1e-12);
      expect(
        stateVariables[stateVariables["/p100b"].activeChildren[1].componentName]
          .stateValues.value,
      ).closeTo(std100, 1e-12);
    });
  });

  it("count", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <count name="numbers"><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></count>
      <count name="withNumberCount"><math>3</math><count><number>17</number><number>5-4</number></count></count>
      <count name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></count>
      <count name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></count>
      <count name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></count>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/withNumberCount"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/varsSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(3);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.value).eq(3);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumberMath"].stateValues.value).eq(
          3,
        );
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .value,
        ).eq(3);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumericMath"].stateValues.value).eq(
          3,
        );
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).eq(3);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberCount"].stateValues.value).eq(2);
        expect(
          stateVariables["/withNumberCount"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberCount"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/vars"].stateValues.value).eq(3);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(true);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsSimplify"].stateValues.value).eq(3);
        expect(
          stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eq(3);
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.value).eq(3);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value).eq(3);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(true);
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(true);
      });
    });
  });

  it("count with sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <count name="numbers"><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersAsString">3 17 1</count>
      <count name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</count>
      <count name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</count>
      <count name="numericAsString">6/2 17 5-4</count>
      <count name="numericAsStringSimplify" simplify>6/2 17 5-4</count>
      <count name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</count>
      <count name="numbersAsMacros">$a$b$c</count>
      <count name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</count>
      <count name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</count>
      <count name="numbersAsMacros2">$a $b $c</count>
      <count name="withNumberMathMacro">$aNumberMath$b$c</count>
      <count name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</count>
      <count name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</count>
      <count name="withNumericMathMacro">$aNumericMath$b$c</count>
      <count name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</count>
      <count name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</count>
      <count name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></count>
      <count name="varsAsString">x x+y x+y+z</count>
      <count name="varsAsStringSimplify" simplify>x x+y x+y+z</count>
      <count name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</count>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numbers"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numbersAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numericAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numericAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numericAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numbersAsMacros"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numbersAsMacros2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/withNumberMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/withNumericMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/withNumericMathMacroSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/withNumericMathMacroForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/vars"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/varsAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/varsAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/varsAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(3);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value).eq(3);
        expect(
          stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .value,
        ).eq(3);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value).eq(3);
        expect(
          stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/numericAsStringSimplify"].stateValues.value).eq(
          3,
        );
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value).eq(3);
        expect(
          stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .value,
        ).eq(3);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value).eq(3);
        expect(
          stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/withNumberMathMacro"].stateValues.value).eq(3);
        expect(
          stateVariables["/withNumberMathMacro"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/withNumericMathMacro"].stateValues.value).eq(3);
        expect(
          stateVariables["/withNumericMathMacro"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value).eq(3);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(true);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsAsString"].stateValues.value).eq(3);
        expect(
          stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.value).eq(3);
        expect(
          stateVariables["/varsAsStringSimplify"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
      });
    });
  });

  // need to upgrade mathjs to get the count function
  it.skip("count as math expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">count(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>count(3,17,5-4)</math>
      <math name="numberStringProduct">count(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>count(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        count(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      count(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        count(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        count(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        count($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        count($a,$b,$c)
      </math>
      <math name="macrosProduct">
        count($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        count($a$b$c)
      </math>
      <math name="group">
        count($nums)
      </math>
      <math name="groupSimplify" simplify>
        count($nums)
      </math>
      <math name="groupPlus">
        count($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        count($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        count($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        count($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        count($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        count($a, $b, $nums, $c)
      </math>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numberString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("count(3,17,5−4)");
      });
    cy.get(cesc("#\\/numberStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numberStringProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("count(3⋅17⋅5−4)");
      });
    cy.get(cesc("#\\/numberStringProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/numberComponentsCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("count(3,17,1)");
      });
    cy.get(cesc("#\\/numberComponentsCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/numberComponentsProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("count(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/numberComponentsProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/macrosCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("count(3,17,1)");
      });
    cy.get(cesc("#\\/macrosCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/macrosProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("count(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/macrosProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/group"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("count(3,17,1)");
      });
    cy.get(cesc("#\\/groupSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/groupPlus"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("count(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlusSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6");
      });
    cy.get(cesc("#\\/groupPlus2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("count(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlus2Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6");
      });
    cy.get(cesc("#\\/groupPlus3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("count(3,17,3,17,1,1)");
      });
    cy.get(cesc("#\\/groupPlus3Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numberString"].stateValues.value).eqls([
          "apply",
          "count",
          ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/numberStringSimplify"].stateValues.value).eq(3);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/numberStringProduct"].stateValues.value).eqls([
          "apply",
          "count",
          ["+", ["*", 3, 17, 5], -4],
        ]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.value,
        ).eq(1);
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
          stateVariables["/numberComponentsCommas"].stateValues.value,
        ).eqls(["apply", "count", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues.value,
        ).eq(3);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.value,
        ).eqls(["apply", "count", ["*", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues.value,
        ).eq(1);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues
            .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value).eqls([
          "apply",
          "count",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.value).eq(3);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value).eqls([
          "apply",
          "count",
          ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosProductSimplify"].stateValues.value).eq(
          1,
        );
        expect(
          stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value).eqls([
          "apply",
          "count",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value).eq(3);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value).eqls([
          "apply",
          "count",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value).eq(6);
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value).eqls([
          "apply",
          "count",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value).eq(6);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value).eqls([
          "apply",
          "count",
          ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value).eq(6);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
          true,
        );
      });
    });
  });

  it("count additional cases", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="pPrime">Count of first primes: <count name="countPrime">2 3 5 7</count></p>
    <p>Copying that count: $countPrime{name="countPrimeb"}</p>
    $pPrime{name="pPrimeb"}

    <p name="p100">Count of numbers from 1 to 100: <count name="count100"><sequence to="100" /></count></p>
    <p>Copying that count: $count100{name="count100b"}</p>
    $p100{name="p100b"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.log("Test value displayed in browser");

      cy.get(cesc("#\\/countPrime"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/countPrimeb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/pPrimeb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/count100"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("100");
        });
      cy.get(cesc("#\\/count100b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("100");
        });
      cy.get(cesc("#\\/p100b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("100");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        expect(stateVariables["/countPrime"].stateValues.value).eq(4);
        expect(stateVariables["/countPrimeb"].stateValues.value).eq(4);
        expect(
          stateVariables[
            stateVariables["/pPrimeb"].activeChildren[1].componentName
          ].stateValues.value,
        ).eq(4);
        expect(stateVariables["/count100"].stateValues.value).eq(100);
        expect(stateVariables["/count100b"].stateValues.value).eq(100);
        expect(
          stateVariables[
            stateVariables["/p100b"].activeChildren[1].componentName
          ].stateValues.value,
        ).eq(100);
      });
    });
  });

  it("min", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <min name="numbers"><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></min>
      <min name="withNumberMin"><math>3</math><min><number>17</number><number>5-4</number></min></min>
      <min name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></min>
      <min name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></min>
      <min name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></min>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("min(3,17,1)");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("min(3,17,1)");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("min(62,17,1)");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/withNumberMin"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("min(x,x+y,x+y+z)");
        });
      cy.get(cesc("#\\/varsSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("min(x,x+y,x+y+z)");
        });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("min(x,x+y,x+y+z)");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(1);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", 3, 17, 1],
        ]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eq(1);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumberMath"].stateValues.value).eq(
          1,
        );
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .value,
        ).eqls(["apply", "min", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(1);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.value,
        ).eqls(["apply", "min", ["tuple", ["/", 6, 2], 17, 1]]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eq(1);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).eq(1);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberMin"].stateValues.value).eq(1);
        expect(
          stateVariables["/withNumberMin"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMin"].stateValues.isNumber).eq(true);
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
          stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numbersb"].stateValues.value).eq(1);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
      });
    });
  });

  it("min with sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <min name="numbers"><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersAsString">3 17 1</min>
      <min name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</min>
      <min name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</min>
      <min name="numericAsString">6/2 17 5-4</min>
      <min name="numericAsStringSimplify" simplify>6/2 17 5-4</min>
      <min name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</min>
      <min name="numbersAsMacros">$a$b$c</min>
      <min name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</min>
      <min name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</min>
      <min name="numbersAsMacros2">$a $b $c</min>
      <min name="withNumberMathMacro">$aNumberMath$b$c</min>
      <min name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</min>
      <min name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</min>
      <min name="withNumericMathMacro">$aNumericMath$b$c</min>
      <min name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</min>
      <min name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</min>
      <min name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></min>
      <min name="varsAsString">x x+y x+y+z</min>
      <min name="varsAsStringSimplify" simplify>x x+y x+y+z</min>
      <min name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</min>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numbers"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/numbersAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3,17,1)");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/numericAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(62,17,5−4)");
      });
    cy.get(cesc("#\\/numericAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/numericAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/numbersAsMacros"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3,17,1)");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/numbersAsMacros2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/withNumberMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3,17,1)");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/withNumericMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(62,17,1)");
      });
    cy.get(cesc("#\\/withNumericMathMacroSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/withNumericMathMacroForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/vars"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(x,x+y,x+y+z)");
      });
    cy.get(cesc("#\\/varsAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(x,x+y,x+y+z)");
      });
    cy.get(cesc("#\\/varsAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(x,x+y,x+y+z)");
      });
    cy.get(cesc("#\\/varsAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("NaN");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(1);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value).eq(1);
        expect(
          stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.value,
        ).eqls(["apply", "min", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .value,
        ).eq(1);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", ["/", 6, 2], 17, ["+", 5, -4]],
        ]);
        expect(
          stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numericAsStringSimplify"].stateValues.value).eq(
          1,
        );
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.value,
        ).eq(1);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value).eq(1);
        expect(
          stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value,
        ).eqls(["apply", "min", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .value,
        ).eq(1);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value).eq(1);
        expect(
          stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/withNumberMathMacro"].stateValues.value).eq(1);
        expect(
          stateVariables["/withNumberMathMacro"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues.value,
        ).eqls(["apply", "min", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(1);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/withNumericMathMacro"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", ["/", 6, 2], 17, 1],
        ]);
        expect(
          stateVariables["/withNumericMathMacro"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.value,
        ).eq(1);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues.value,
        ).eq(1);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
          stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
          stateVariables["/varsAsStringSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.value,
        ).eqls(NaN);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
      });
    });
  });

  it("min as math expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">min(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>min(3,17,5-4)</math>
      <math name="numberStringProduct">min(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>min(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        min(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      min(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        min(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        min(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        min($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        min($a,$b,$c)
      </math>
      <math name="macrosProduct">
        min($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        min($a$b$c)
      </math>
      <math name="group">
        min($nums)
      </math>
      <math name="groupSimplify" simplify>
        min($nums)
      </math>
      <math name="groupPlus">
        min($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        min($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        min($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        min($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        min($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        min($a, $b, $nums, $c)
      </math>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numberString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3,17,5−4)");
      });
    cy.get(cesc("#\\/numberStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/numberStringProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3⋅17⋅5−4)");
      });
    cy.get(cesc("#\\/numberStringProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("251");
      });
    cy.get(cesc("#\\/numberComponentsCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3,17,1)");
      });
    cy.get(cesc("#\\/numberComponentsCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/numberComponentsProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/numberComponentsProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/macrosCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3,17,1)");
      });
    cy.get(cesc("#\\/macrosCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/macrosProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/macrosProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/group"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3,17,1)");
      });
    cy.get(cesc("#\\/groupSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/groupPlus"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlusSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/groupPlus2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlus2Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/groupPlus3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("min(3,17,3,17,1,1)");
      });
    cy.get(cesc("#\\/groupPlus3Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numberString"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/numberStringSimplify"].stateValues.value).eq(1);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/numberStringProduct"].stateValues.value).eqls([
          "apply",
          "min",
          ["+", ["*", 3, 17, 5], -4],
        ]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.value,
        ).eq(251);
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
          stateVariables["/numberComponentsCommas"].stateValues.value,
        ).eqls(["apply", "min", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues.value,
        ).eq(1);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.value,
        ).eqls(["apply", "min", ["*", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues
            .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.value).eq(1);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value).eqls([
          "apply",
          "min",
          ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosProductSimplify"].stateValues.value).eq(
          51,
        );
        expect(
          stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value).eq(1);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value).eq(1);
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value).eq(1);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value).eqls([
          "apply",
          "min",
          ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value).eq(1);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
          true,
        );
      });
    });
  });

  it("min can be invertible", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <min name="numbers00"><number>3</number><number>6</number></min>
      <min name="numbers01"><number>3</number><number fixed>6</number></min>
      <min name="numbers10"><number fixed>3</number><number>6</number></min>
      <min name="numbers11"><number fixed>3</number><number fixed>6</number></min>

      <min name="maths00"><math>3</math><math>6</math></min>
      <min name="maths01"><math>3</math><math fixed>6</math></min>
      <min name="maths10"><math fixed>3</math><math>6</math></min>
      <min name="maths11"><math fixed>3</math><math fixed>6</math></min>

      <mathinput name="minumbers00" bindValueTo="$numbers00" />
      <mathinput name="minumbers01" bindValueTo="$numbers01" />
      <mathinput name="minumbers10" bindValueTo="$numbers10" />
      <mathinput name="minumbers11" bindValueTo="$numbers11" />

      <mathinput name="mimaths00" bindValueTo="$maths00" />
      <mathinput name="mimaths01" bindValueTo="$maths01" />
      <mathinput name="mimaths10" bindValueTo="$maths10" />
      <mathinput name="mimaths11" bindValueTo="$maths11" />


      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths10") + " .mjx-mrow").should("contain.text", "1");

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths10") + " .mjx-mrow").should("contain.text", "3");

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}8{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}8{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}8{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}8{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}8{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}8{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{backspace}8{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{backspace}8{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths01") + " .mjx-mrow").should("contain.text", "6");

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths10") + " .mjx-mrow").should(
      "contain.text",
      "min(3,x)",
    );

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "min(x,6)");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "min(3,x)");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{shift+home}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{shift+home}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths10") + " .mjx-mrow").should(
      "contain.text",
      "min(3,y)",
    );

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "min(y,6)");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "min(3,y)");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{shift+home}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{shift+home}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths10") + " .mjx-mrow").should("contain.text", "2");

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
  });

  it("max", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <max name="numbers"><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></max>
      <max name="withNumberMax"><math>3</math><max><number>17</number><number>5-4</number></max></max>
      <max name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></max>
      <max name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></max>
      <max name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></max>
      $numbers{name="numbersb"}
      $vars{name="varsb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("17");
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("max(3,17,1)");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("17");
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("17");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("max(3,17,1)");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("17");
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("max(62,17,1)");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("17");
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("17");
        });
      cy.get(cesc("#\\/withNumberMax"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("17");
        });
      cy.get(cesc("#\\/vars"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("max(x,x+y,x+y+z)");
        });
      cy.get(cesc("#\\/varsSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("max(x,x+y,x+y+z)");
        });
      cy.get(cesc("#\\/varsForcedNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("NaN");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("17");
        });
      cy.get(cesc("#\\/varsb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("max(x,x+y,x+y+z)");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(17);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", 3, 17, 1],
        ]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eq(17);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumberMath"].stateValues.value).eq(
          17,
        );
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .value,
        ).eqls(["apply", "max", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(17);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.value,
        ).eqls(["apply", "max", ["tuple", ["/", 6, 2], 17, 1]]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eq(17);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).eq(17);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberMax"].stateValues.value).eq(17);
        expect(
          stateVariables["/withNumberMax"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMax"].stateValues.isNumber).eq(true);
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
          stateVariables["/varsSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsSimplify"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsForcedNumeric"].stateValues.value).eqls(
          NaN,
        );
        expect(
          stateVariables["/varsForcedNumeric"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/varsForcedNumeric"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numbersb"].stateValues.value).eq(17);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
        expect(stateVariables["/varsb"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/varsb"].stateValues.isNumericOperator).eq(
          false,
        );
        expect(stateVariables["/varsb"].stateValues.isNumber).eq(false);
      });
    });
  });

  it("max with sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <max name="numbers"><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersAsString">3 17 1</max>
      <max name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</max>
      <max name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</max>
      <max name="numericAsString">6/2 17 5-4</max>
      <max name="numericAsStringSimplify" simplify>6/2 17 5-4</max>
      <max name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</max>
      <max name="numbersAsMacros">$a$b$c</max>
      <max name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</max>
      <max name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</max>
      <max name="numbersAsMacros2">$a $b $c</max>
      <max name="withNumberMathMacro">$aNumberMath$b$c</max>
      <max name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</max>
      <max name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</max>
      <max name="withNumericMathMacro">$aNumericMath$b$c</max>
      <max name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</max>
      <max name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</max>
      <max name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></max>
      <max name="varsAsString">x x+y x+y+z</max>
      <max name="varsAsStringSimplify" simplify>x x+y x+y+z</max>
      <max name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</max>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numbers"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/numbersAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3,17,1)");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/numericAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(62,17,5−4)");
      });
    cy.get(cesc("#\\/numericAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/numericAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/numbersAsMacros"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3,17,1)");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/numbersAsMacros2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/withNumberMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3,17,1)");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/withNumericMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(62,17,1)");
      });
    cy.get(cesc("#\\/withNumericMathMacroSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/withNumericMathMacroForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/vars"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(x,x+y,x+y+z)");
      });
    cy.get(cesc("#\\/varsAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(x,x+y,x+y+z)");
      });
    cy.get(cesc("#\\/varsAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(x,x+y,x+y+z)");
      });
    cy.get(cesc("#\\/varsAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("NaN");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(17);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value).eq(17);
        expect(
          stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.value,
        ).eqls(["apply", "max", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .value,
        ).eq(17);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", ["/", 6, 2], 17, ["+", 5, -4]],
        ]);
        expect(
          stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numericAsStringSimplify"].stateValues.value).eq(
          17,
        );
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.value,
        ).eq(17);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value).eq(17);
        expect(
          stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value,
        ).eqls(["apply", "max", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .value,
        ).eq(17);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value).eq(17);
        expect(
          stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/withNumberMathMacro"].stateValues.value).eq(17);
        expect(
          stateVariables["/withNumberMathMacro"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues.value,
        ).eqls(["apply", "max", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(17);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/withNumericMathMacro"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", ["/", 6, 2], 17, 1],
        ]);
        expect(
          stateVariables["/withNumericMathMacro"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.value,
        ).eq(17);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues.value,
        ).eq(17);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/vars"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(stateVariables["/vars"].stateValues.isNumericOperator).eq(false);
        expect(stateVariables["/vars"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
          stateVariables["/varsAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", "x", ["+", "x", "y"], ["+", "x", "y", "z"]],
        ]);
        expect(
          stateVariables["/varsAsStringSimplify"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/varsAsStringSimplify"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.value,
        ).eqls(NaN);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/varsAsStringForceNumeric"].stateValues.isNumber,
        ).eq(false);
      });
    });
  });

  it("max as math expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <group name="nums" asList>
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">max(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>max(3,17,5-4)</math>
      <math name="numberStringProduct">max(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>max(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        max(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      max(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        max(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        max(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        max($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        max($a,$b,$c)
      </math>
      <math name="macrosProduct">
        max($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        max($a$b$c)
      </math>
      <math name="group">
        max($nums)
      </math>
      <math name="groupSimplify" simplify>
        max($nums)
      </math>
      <math name="groupPlus">
        max($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        max($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        max($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        max($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        max($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        max($a, $b, $nums, $c)
      </math>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numberString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3,17,5−4)");
      });
    cy.get(cesc("#\\/numberStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/numberStringProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3⋅17⋅5−4)");
      });
    cy.get(cesc("#\\/numberStringProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("251");
      });
    cy.get(cesc("#\\/numberComponentsCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3,17,1)");
      });
    cy.get(cesc("#\\/numberComponentsCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/numberComponentsProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/numberComponentsProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/macrosCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3,17,1)");
      });
    cy.get(cesc("#\\/macrosCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/macrosProduct"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3⋅17⋅1)");
      });
    cy.get(cesc("#\\/macrosProductSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("51");
      });
    cy.get(cesc("#\\/group"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3,17,1)");
      });
    cy.get(cesc("#\\/groupSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/groupPlus"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlusSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/groupPlus2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3,17,1,3,17,1)");
      });
    cy.get(cesc("#\\/groupPlus2Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });
    cy.get(cesc("#\\/groupPlus3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("max(3,17,3,17,1,1)");
      });
    cy.get(cesc("#\\/groupPlus3Simplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("17");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numberString"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", 3, 17, ["+", 5, -4]],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/numberStringSimplify"].stateValues.value).eq(
          17,
        );
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/numberStringProduct"].stateValues.value).eqls([
          "apply",
          "max",
          ["+", ["*", 3, 17, 5], -4],
        ]);
        expect(stateVariables["/numberStringProduct"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.value,
        ).eq(251);
        expect(
          stateVariables["/numberStringProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(
          stateVariables["/numberComponentsCommas"].stateValues.value,
        ).eqls(["apply", "max", ["tuple", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues.value,
        ).eq(17);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.value,
        ).eqls(["apply", "max", ["*", 3, 17, 1]]);
        expect(
          stateVariables["/numberComponentsProduct"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues.value,
        ).eq(51);
        expect(
          stateVariables["/numberComponentsProductSimplify"].stateValues
            .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.value).eq(
          17,
        );
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/macrosProduct"].stateValues.value).eqls([
          "apply",
          "max",
          ["*", 3, 17, 1],
        ]);
        expect(stateVariables["/macrosProduct"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosProductSimplify"].stateValues.value).eq(
          51,
        );
        expect(
          stateVariables["/macrosProductSimplify"].stateValues.isNumber,
        ).eq(true);

        expect(stateVariables["/group"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", 3, 17, 1],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value).eq(17);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);

        expect(stateVariables["/groupPlus"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlusSimplify"].stateValues.value).eq(17);
        expect(stateVariables["/groupPlusSimplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus2"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", 3, 17, 1, 3, 17, 1],
        ]);
        expect(stateVariables["/groupPlus2"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.value).eq(17);
        expect(stateVariables["/groupPlus2Simplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/groupPlus3"].stateValues.value).eqls([
          "apply",
          "max",
          ["tuple", 3, 17, 3, 17, 1, 1],
        ]);
        expect(stateVariables["/groupPlus3"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.value).eq(17);
        expect(stateVariables["/groupPlus3Simplify"].stateValues.isNumber).eq(
          true,
        );
      });
    });
  });

  it("max can be invertible", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <max name="numbers00"><number>3</number><number>6</number></max>
      <max name="numbers01"><number>3</number><number fixed>6</number></max>
      <max name="numbers10"><number fixed>3</number><number>6</number></max>
      <max name="numbers11"><number fixed>3</number><number fixed>6</number></max>

      <max name="maths00"><math>3</math><math>6</math></max>
      <max name="maths01"><math>3</math><math fixed>6</math></max>
      <max name="maths10"><math fixed>3</math><math>6</math></max>
      <max name="maths11"><math fixed>3</math><math fixed>6</math></max>

      <mathinput name="minumbers00" bindValueTo="$numbers00" />
      <mathinput name="minumbers01" bindValueTo="$numbers01" />
      <mathinput name="minumbers10" bindValueTo="$numbers10" />
      <mathinput name="minumbers11" bindValueTo="$numbers11" />

      <mathinput name="mimaths00" bindValueTo="$maths00" />
      <mathinput name="mimaths01" bindValueTo="$maths01" />
      <mathinput name="mimaths10" bindValueTo="$maths10" />
      <mathinput name="mimaths11" bindValueTo="$maths11" />


      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}9{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}9{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}9{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}9{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}9{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}9{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{backspace}9{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{backspace}9{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths10") + " .mjx-mrow").should("contain.text", "9");

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths10") + " .mjx-mrow").should("contain.text", "5");

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths10") + " .mjx-mrow").should("contain.text", "3");

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths10") + " .mjx-mrow").should(
      "contain.text",
      "max(3,x)",
    );

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "max(x,6)");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "max(3,x)");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{shift+home}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{shift+home}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths10") + " .mjx-mrow").should(
      "contain.text",
      "max(3,y)",
    );

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "max(y,6)");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "max(3,y)");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/minumbers00") + " textarea").type(
      "{end}{backspace}7{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers11") + " textarea").type(
      "{end}{backspace}7{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers01") + " textarea").type(
      "{end}{backspace}7{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/minumbers10") + " textarea").type(
      "{end}{backspace}7{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mimaths00") + " textarea").type(
      "{end}{backspace}7{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths11") + " textarea").type(
      "{end}{backspace}7{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths01") + " textarea").type(
      "{end}{shift+home}{backspace}7{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mimaths10") + " textarea").type(
      "{end}{shift+home}{backspace}7{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/maths10") + " .mjx-mrow").should("contain.text", "7");

    cy.get(cesc("#\\/numbers00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/numbers01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc("#\\/numbers10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc("#\\/numbers11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");

    cy.get(cesc("#\\/maths00") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc("#\\/maths01") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc("#\\/maths10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc("#\\/maths11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
  });

  it("mod", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <mod name="numbers"><number>17</number><number>3</number></mod>
      <mod name="numbersForceSymbolic" forceSymbolic><number>17</number><number>3</number></mod>
      <mod name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>17</number><number>3</number></mod>
      <mod name="numbersWithNumberMath"><number>17</number><math>3</math></mod>
      <mod name="numbersWithNumberMathForceSymbolic" forceSymbolic><number>17</number><math>3</math></mod>
      <mod name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><number>17</number><math>3</math></mod>
      <mod name="numbersWithNumericMath"><number>17</number><math>6/2</math></mod>
      <mod name="numbersWithNumericMathSimplify" simplify><number>17</number><math>6/2</math></mod>
      <mod name="numbersWithNumericMathForceNumeric" forceNumeric><number>17</number><math>6/2</math></mod>
      <mod name="withNumberMod"><math>17</math><mod><number>16</number><number>9</number></mod></mod>
      $numbers{name="numbersb"}
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/numbers"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/numbersForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("mod(17,3)");
        });
      cy.get(cesc("#\\/numbersForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/numbersWithNumberMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolic"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("mod(17,3)");
        });
      cy.get(cesc("#\\/numbersWithNumberMathForceSymbolicSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/numbersWithNumericMath"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("mod(17,62)");
        });
      cy.get(cesc("#\\/numbersWithNumericMathSimplify"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/numbersWithNumericMathForceNumeric"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/withNumberMod"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/numbersb"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(2);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.value).eqls([
          "apply",
          "mod",
          ["tuple", 17, 3],
        ]);
        expect(
          stateVariables["/numbersForceSymbolic"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numbersForceSymbolic"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.value,
        ).eq(2);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersForceSymbolicSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersWithNumberMath"].stateValues.value).eq(
          2,
        );
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMath"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .value,
        ).eqls(["apply", "mod", ["tuple", 17, 3]]);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(2);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumberMathForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.value,
        ).eqls(["apply", "mod", ["tuple", 17, ["/", 6, 2]]]);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMath"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues.value,
        ).eq(2);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersWithNumericMathSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .value,
        ).eq(2);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numbersWithNumericMathForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/withNumberMod"].stateValues.value).eq(3);
        expect(
          stateVariables["/withNumberMod"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMod"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersb"].stateValues.value).eq(2);
        expect(stateVariables["/numbersb"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbersb"].stateValues.isNumber).eq(true);
      });
    });
  });

  it("mod with sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="a">17</number>
      <number name="b">3</number>
      <math name="bNumberMath">3</math>
      <math name="bNumericMath">6/2</math>
      <mod name="numbers"><number>17</number><number>3</number></mod>
      <mod name="numbersAsString">17 3</mod>
      <mod name="numbersAsStringForceSymbolic" forceSymbolic>17 3</mod>
      <mod name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>17 3</mod>
      <mod name="numericAsString">17 6/2</mod>
      <mod name="numericAsStringSimplify" simplify>17 6/2</mod>
      <mod name="numericAsStringForceNumeric" forceNumeric>17 6/2</mod>
      <mod name="numbersAsMacros">$a$b</mod>
      <mod name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b</mod>
      <mod name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b</mod>
      <mod name="numbersAsMacros2">$a $b</mod>
      <mod name="withNumberMathMacro">$a$bNumberMath</mod>
      <mod name="withNumberMathMacroForceSymbolic" forceSymbolic>$a$bNumberMath</mod>
      <mod name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$a$bNumberMath</mod>
      <mod name="withNumericMathMacro">$a$bNumericMath</mod>
      <mod name="withNumericMathMacroSimplify" simplify>$a$bNumericMath</mod>
      <mod name="withNumericMathMacroForceNumeric" forceNumeric>$a$bNumericMath</mod>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numbers"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/numbersAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mod(17,3)");
      });
    cy.get(cesc("#\\/numbersAsStringForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/numericAsString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mod(17,62)");
      });
    cy.get(cesc("#\\/numericAsStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/numericAsStringForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/numbersAsMacros"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mod(17,3)");
      });
    cy.get(cesc("#\\/numbersAsMacrosForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/numbersAsMacros2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/withNumberMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolic"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mod(17,3)");
      });
    cy.get(cesc("#\\/withNumberMathMacroForceSymbolicSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/withNumericMathMacro"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mod(17,62)");
      });
    cy.get(cesc("#\\/withNumericMathMacroSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/withNumericMathMacroForceNumeric"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numbers"].stateValues.value).eq(2);
        expect(stateVariables["/numbers"].stateValues.isNumericOperator).eq(
          true,
        );
        expect(stateVariables["/numbers"].stateValues.isNumber).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.value).eq(2);
        expect(
          stateVariables["/numbersAsString"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsString"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.value,
        ).eqls(["apply", "mod", ["tuple", 17, 3]]);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .value,
        ).eq(2);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsStringForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numericAsString"].stateValues.value).eqls([
          "apply",
          "mod",
          ["tuple", 17, ["/", 6, 2]],
        ]);
        expect(
          stateVariables["/numericAsString"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/numericAsString"].stateValues.isNumber).eq(
          false,
        );
        expect(stateVariables["/numericAsStringSimplify"].stateValues.value).eq(
          2,
        );
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numericAsStringSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.value,
        ).eq(2);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/numericAsStringForceNumeric"].stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.value).eq(2);
        expect(
          stateVariables["/numbersAsMacros"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.value,
        ).eqls(["apply", "mod", ["tuple", 17, 3]]);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolic"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .value,
        ).eq(2);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/numbersAsMacrosForceSymbolicSimplify"].stateValues
            .isNumber,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.value).eq(2);
        expect(
          stateVariables["/numbersAsMacros2"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/numbersAsMacros2"].stateValues.isNumber).eq(
          true,
        );
        expect(stateVariables["/withNumberMathMacro"].stateValues.value).eq(2);
        expect(
          stateVariables["/withNumberMathMacro"].stateValues.isNumericOperator,
        ).eq(true);
        expect(stateVariables["/withNumberMathMacro"].stateValues.isNumber).eq(
          true,
        );
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues.value,
        ).eqls(["apply", "mod", ["tuple", 17, 3]]);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolic"].stateValues
            .isNumber,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.value,
        ).eq(2);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumberMathMacroForceSymbolicSimplify"]
            .stateValues.isNumber,
        ).eq(true);
        expect(stateVariables["/withNumericMathMacro"].stateValues.value).eqls([
          "apply",
          "mod",
          ["tuple", 17, ["/", 6, 2]],
        ]);
        expect(
          stateVariables["/withNumericMathMacro"].stateValues.isNumericOperator,
        ).eq(false);
        expect(stateVariables["/withNumericMathMacro"].stateValues.isNumber).eq(
          false,
        );
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.value,
        ).eq(2);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues
            .isNumericOperator,
        ).eq(false);
        expect(
          stateVariables["/withNumericMathMacroSimplify"].stateValues.isNumber,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues.value,
        ).eq(2);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumericOperator,
        ).eq(true);
        expect(
          stateVariables["/withNumericMathMacroForceNumeric"].stateValues
            .isNumber,
        ).eq(true);
      });
    });
  });

  it("mod as math expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <group name="nums" asList>
        <number name="a">17</number>
        <number name="b">3</number>
      </group>
      <math name="numberString">mod(17,3)</math>
      <math name="numberStringSimplify" simplify>mod(17,3)</math>
      <math name="numberComponentsCommas">
        mod(<number>17</number>,<number>3</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      mod(<number>17</number>,<number>3</number>)
      </math>
      <math name="macrosCommas">
        mod($a,$b)
      </math>
      <math name="macrosCommasSimplify" simplify>
        mod($a,$b)
      </math>
      <math name="group">
        mod($nums)
      </math>
      <math name="groupSimplify" simplify>
        mod($nums)
      </math>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/numberString"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mod(17,3)");
      });
    cy.get(cesc("#\\/numberStringSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/numberComponentsCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mod(17,3)");
      });
    cy.get(cesc("#\\/numberComponentsCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/macrosCommas"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mod(17,3)");
      });
    cy.get(cesc("#\\/macrosCommasSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/group"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("mod(17,3)");
      });
    cy.get(cesc("#\\/groupSimplify"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.window().then(async (win) => {
        expect(stateVariables["/numberString"].stateValues.value).eqls([
          "apply",
          "mod",
          ["tuple", 17, 3],
        ]);
        expect(stateVariables["/numberString"].stateValues.isNumber).eq(false);
        expect(stateVariables["/numberStringSimplify"].stateValues.value).eq(2);
        expect(stateVariables["/numberStringSimplify"].stateValues.isNumber).eq(
          true,
        );

        expect(
          stateVariables["/numberComponentsCommas"].stateValues.value,
        ).eqls(["apply", "mod", ["tuple", 17, 3]]);
        expect(
          stateVariables["/numberComponentsCommas"].stateValues.isNumber,
        ).eq(false);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues.value,
        ).eq(2);
        expect(
          stateVariables["/numberComponentsCommasSimplify"].stateValues
            .isNumber,
        ).eq(true);

        expect(stateVariables["/macrosCommas"].stateValues.value).eqls([
          "apply",
          "mod",
          ["tuple", 17, 3],
        ]);
        expect(stateVariables["/macrosCommas"].stateValues.isNumber).eq(false);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.value).eq(2);
        expect(stateVariables["/macrosCommasSimplify"].stateValues.isNumber).eq(
          true,
        );

        expect(stateVariables["/group"].stateValues.value).eqls([
          "apply",
          "mod",
          ["tuple", 17, 3],
        ]);
        expect(stateVariables["/group"].stateValues.isNumber).eq(false);
        expect(stateVariables["/groupSimplify"].stateValues.value).eq(2);
        expect(stateVariables["/groupSimplify"].stateValues.isNumber).eq(true);
      });
    });
  });

  it("gcd", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <gcd><number>135</number><number>81</number></gcd>
      <gcd>135 81 63</gcd>
      <gcd>x y z</gcd>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/_gcd1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("27");
      });
    cy.get(cesc("#\\/_gcd2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/_gcd3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("gcd(x,y,z)");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_gcd1"].stateValues.value).eq(27);
      expect(stateVariables["/_gcd2"].stateValues.value).eq(9);
      expect(stateVariables["/_gcd3"].stateValues.value).eqls([
        "apply",
        "gcd",
        ["tuple", "x", "y", "z"],
      ]);
    });
  });

  it("extract parts of math expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>original expression: <math name="expr" functionSymbols="f g">f(x)+g(y,z)+h(q)</math></p>
      <p>Operator: <extractMathOperator name="operator">$expr</extractMathOperator></p>
      <p>Number of operands: <extractMath type="numOperands" name="numOperands">$expr</extractMath></p>
      <p>First operand: <extractMath type="Operand" name="operand1" operandNumber="1">$expr</extractMath></p>
      <p>Second operand: <extractMath type="Operand" name="operand2" operandNumber="2">$expr</extractMath></p>
      <p>Third operand: <extractMath type="Operand" name="operand3" operandNumber="3">$expr</extractMath></p>
      <p>No fourth operand: <extractMath type="Operand" name="blank1" operandNumber="4">$expr</extractMath></p>
      <p>Function from first operand: <extractMath type="function" name="f">$operand1</extractMath></p>
      <p>Function from second operand: <extractMath type="function" name="g">$operand2</extractMath></p>
      <p>No function from third operand: <extractMath type="function" name="blank2">$operand3</extractMath></p>
      <p>Function argument from first operand: <extractMath type="functionArgument" name="farg1">$operand1</extractMath></p>
      <p>Function argument from first operand again: <extractMath type="functionArgument" argumentNumber="1" name="farg1a">$operand1</extractMath></p>
      <p>No second function argument from first operand: <extractMath type="functionArgument" argumentNumber="2" name="blank3">$operand1</extractMath></p>
      <p>All function arguments from second operand: <extractMath type="functionArgument" name="gargAll">$operand2</extractMath></p>
      <p>First function argument from second operand: <extractMath type="functionArgument" argumentNumber="1" name="garg1">$operand2</extractMath></p>
      <p>Second function argument from second operand: <extractMath type="functionArgument" argumentNumber="2" name="garg2">$operand2</extractMath></p>
      <p>No third function argument from second operand: <extractMath type="functionArgument" argumentNumber="3" name="blank4">$operand2</extractMath></p>
      <p>No function argument from third operand: <extractMath type="functionArgument" name="blank5">$operand3</extractMath></p>
      <p>Number of operands from first operand: <extractMath type="numOperands" name="numOperands1">$operand1</extractMath></p>
      <p>First operand from first operand: <extractMath type="operand" operandNumber="1" name="operand11">$operand1</extractMath></p>


      <p>Pick operand number: <mathinput name="nOperand" prefill="1" /></p>
      <p>Resulting operand: <extractMath type="operand" operandNumber="$nOperand" name="operandN">$expr</extractMath></p>
      <p>Function of resulting operand: <extractMath type="function" name="functionN">$operandN</extractMath></p>
      <p>Pick argument number: <mathinput name="nArgument" prefill="1" /></p>
      <p>Resulting argument: <extractMath type="functionArgument" argumentNumber="$nArgument" name="argumentN">$operandN</extractMath></p>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/operator")).should("have.text", "+");
    cy.get(cesc("#\\/numOperands"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/operand1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f(x)");
      });
    cy.get(cesc("#\\/operand2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g(y,z)");
      });
    cy.get(cesc("#\\/operand3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("hq");
      });
    cy.get(cesc("#\\/blank1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/f"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/g"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/blank2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/farg1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/farg1a"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/blank3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/gargAll"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(y,z)");
      });
    cy.get(cesc("#\\/garg1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/garg2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/blank4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/blank5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/numOperands1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/operand11"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f(x)");
      });
    cy.get(cesc("#\\/operandN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f(x)");
      });
    cy.get(cesc("#\\/functionN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/argumentN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/operator"].stateValues.value).eq("+");
      expect(stateVariables["/numOperands"].stateValues.value).eq(3);
      expect(stateVariables["/operand1"].stateValues.value).eqls([
        "apply",
        "f",
        "x",
      ]);
      expect(stateVariables["/operand2"].stateValues.value).eqls([
        "apply",
        "g",
        ["tuple", "y", "z"],
      ]);
      expect(stateVariables["/operand3"].stateValues.value).eqls([
        "*",
        "h",
        "q",
      ]);
      expect(stateVariables["/blank1"].stateValues.value).eqls("＿");
      expect(stateVariables["/f"].stateValues.value).eqls("f");
      expect(stateVariables["/g"].stateValues.value).eqls("g");
      expect(stateVariables["/blank2"].stateValues.value).eqls("＿");
      expect(stateVariables["/farg1"].stateValues.value).eqls("x");
      expect(stateVariables["/farg1a"].stateValues.value).eqls("x");
      expect(stateVariables["/blank3"].stateValues.value).eqls("＿");
      expect(stateVariables["/gargAll"].stateValues.value).eqls([
        "tuple",
        "y",
        "z",
      ]);
      expect(stateVariables["/garg1"].stateValues.value).eqls("y");
      expect(stateVariables["/garg2"].stateValues.value).eqls("z");
      expect(stateVariables["/blank4"].stateValues.value).eqls("＿");
      expect(stateVariables["/blank5"].stateValues.value).eqls("＿");
      expect(stateVariables["/numOperands1"].stateValues.value).eq(1);
      expect(stateVariables["/operand11"].stateValues.value).eqls([
        "apply",
        "f",
        "x",
      ]);

      expect(stateVariables["/operandN"].stateValues.value).eqls([
        "apply",
        "f",
        "x",
      ]);
      expect(stateVariables["/functionN"].stateValues.value).eqls("f");
      expect(stateVariables["/argumentN"].stateValues.value).eqls("x");
    });

    cy.get(cesc("#\\/nArgument") + " textarea")
      .type("{end}{backspace}2", { force: true })
      .blur();
    cy.get(cesc("#\\/argumentN") + " .mjx-mrow").should("contain.text", "＿");
    cy.get(cesc("#\\/argumentN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/argumentN"].stateValues.value).eqls("＿");
    });

    cy.get(cesc("#\\/nOperand") + " textarea")
      .type("{end}{backspace}2", { force: true })
      .blur();
    cy.get(cesc("#\\/operandN") + " .mjx-mrow").should(
      "contain.text",
      "g(y,z)",
    );
    cy.get(cesc("#\\/operandN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g(y,z)");
      });
    cy.get(cesc("#\\/functionN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/argumentN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/operandN"].stateValues.value).eqls([
        "apply",
        "g",
        ["tuple", "y", "z"],
      ]);
      expect(stateVariables["/functionN"].stateValues.value).eqls("g");
      expect(stateVariables["/argumentN"].stateValues.value).eqls("z");
    });

    cy.get(cesc("#\\/nArgument") + " textarea")
      .type("{end}{backspace}3", { force: true })
      .blur();
    cy.get(cesc("#\\/argumentN") + " .mjx-mrow").should("contain.text", "＿");
    cy.get(cesc("#\\/argumentN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/argumentN"].stateValues.value).eqls("＿");
    });

    cy.get(cesc("#\\/nArgument") + " textarea")
      .type("{end}{backspace}1", { force: true })
      .blur();
    cy.get(cesc("#\\/argumentN") + " .mjx-mrow").should("contain.text", "y");
    cy.get(cesc("#\\/argumentN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/argumentN"].stateValues.value).eqls("y");
    });

    cy.get(cesc("#\\/nOperand") + " textarea")
      .type("{end}{backspace}3", { force: true })
      .blur();
    cy.get(cesc("#\\/operandN") + " .mjx-mrow").should("contain.text", "hq");
    cy.get(cesc("#\\/operandN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("hq");
      });
    cy.get(cesc("#\\/functionN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/argumentN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/operandN"].stateValues.value).eqls([
        "*",
        "h",
        "q",
      ]);
      expect(stateVariables["/functionN"].stateValues.value).eqls("＿");
      expect(stateVariables["/argumentN"].stateValues.value).eqls("＿");
    });

    cy.get(cesc("#\\/nOperand") + " textarea")
      .type("{end}{backspace}4", { force: true })
      .blur();
    cy.get(cesc("#\\/operandN") + " .mjx-mrow").should("contain.text", "＿");
    cy.get(cesc("#\\/operandN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/functionN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/argumentN"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/operandN"].stateValues.value).eqls("＿");
      expect(stateVariables["/functionN"].stateValues.value).eqls("＿");
      expect(stateVariables["/argumentN"].stateValues.value).eqls("＿");
    });
  });

  it("warning with operand", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>original expression: <math name="expr">x+y</math></p>
      <p>Bad operand: <extractMath type="Operand" name="operand1">$expr</extractMath></p>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc2("#/operand1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(1);

      expect(errorWarnings.warnings[0].message).contain(
        `Must specify a operandNumber when extracting a math operand`,
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(23);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(4);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(85);
    });
  });

  it("math operators that take multiple inputs ignore composites with no replacements", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <function name="f" domain="[0,2]" simplify>(x+1)(x-2)(x-4)</function>
      <p>Min on [0,2]: <min name="min02">$$f(0) $(f.minimumValues) $$f(2)</min>.</p>
      <p>Abs treats as product of three factors: <abs name="abs">$$f(0) $(f.minimumValues) $$f(2)</abs>.</p>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/min02"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/abs"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("∣∣8＿⋅0∣∣");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/min02"].stateValues.value).eq(0);
      expect(stateVariables["/abs"].stateValues.value).eqls([
        "apply",
        "abs",
        ["*", 8, "＿", 0],
      ]);
    });
  });
});
