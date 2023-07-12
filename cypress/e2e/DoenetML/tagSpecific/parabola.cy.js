import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

describe("Parabola Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("parabola with no parameters gives y=x^2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <parabola />
    $_parabola1.vertex{name="v"}
    </graph>
    <graph name="g2">
    $_parabola1{name="p2"}
    <copy assignnames="v2" target="v" />
    </graph>
    $g2{name="g3"}

    $p2.equation{name="e2"}

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1.a)"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1.b)"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1.c)"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2.a)"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2.b)"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2.c)"/></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let equationAnchor = cesc2(
        "#" + stateVariables["/e2"].replacements[0].componentName,
      );
      let parabola3Name =
        stateVariables[stateVariables["/g3"].replacements[0].componentName]
          .activeChildren[0].componentName;
      let vertex3Name =
        stateVariables[stateVariables["/g3"].replacements[0].componentName]
          .activeChildren[1].componentName;

      cy.window().then(async (win) => {
        let a = 1,
          b = 0,
          c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=x2");
          });

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change a");
      cy.get(cesc("#\\/a") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = 0,
          c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=−2x2");
        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=−2x2");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change b");
      cy.get(cesc("#\\/b") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}3{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = 3,
          c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=−2x2+3x");
        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=−2x2+3x");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change c");
      cy.get(cesc("#\\/c") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}9{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = 3,
          c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=−2x2+3x+9");
        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=−2x2+3x+9");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change a2");
      cy.get(cesc("#\\/a2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}0.2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = 3,
          c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2+3x+9");
        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=0.2x2+3x+9");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change b2");
      cy.get(cesc("#\\/b2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-1.7{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = -1.7,
          c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2−1.7x+9");
        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=0.2x2−1.7x+9");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change c2");
      cy.get(cesc("#\\/c2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-4.5{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = -1.7,
          c = -4.5;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2−1.7x−4.5");
        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=0.2x2−1.7x−4.5");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v"].replacements[0].componentName,
          args: { x: -2, y: 1 },
        });

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v2"].replacements[0].componentName,
          args: { x: 5, y: -6 },
        });

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("move vertex3");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: vertex3Name,
          args: { x: -3, y: -2 },
        });

        let a = 0.2;

        let vertex_x = -3;
        let vertex_y = -2;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });
    });
  });

  it("parabola through no points gives y=x^2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <parabola through="" />
    $_parabola1.vertex{name="v"}
    </graph>
    <graph name="g2">
    $_parabola1{name="p2"}
    <copy assignnames="v2" target="v" />
    </graph>
    $g2{name="g3"}

    $p2.equation{name="e2"}

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1.a)"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1.b)"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1.c)"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2.a)"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2.b)"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2.c)"/></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let equationAnchor = cesc2(
        "#" + stateVariables["/e2"].replacements[0].componentName,
      );
      let parabola3Name =
        stateVariables[stateVariables["/g3"].replacements[0].componentName]
          .activeChildren[0].componentName;
      let vertex3Name =
        stateVariables[stateVariables["/g3"].replacements[0].componentName]
          .activeChildren[1].componentName;

      cy.window().then(async (win) => {
        let a = 1,
          b = 0,
          c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=x2");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change a");
      cy.get(cesc("#\\/a") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = 0,
          c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=−2x2");

        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=−2x2");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change b");
      cy.get(cesc("#\\/b") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}3{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = 3,
          c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=−2x2+3x");
        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=−2x2+3x");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change c");
      cy.get(cesc("#\\/c") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}9{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = 3,
          c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=−2x2+3x+9");
        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=−2x2+3x+9");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change a2");
      cy.get(cesc("#\\/a2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}0.2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = 3,
          c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2+3x+9");
        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=0.2x2+3x+9");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change b2");
      cy.get(cesc("#\\/b2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-1.7{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = -1.7,
          c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2−1.7x+9");
        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=0.2x2−1.7x+9");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change c2");
      cy.get(cesc("#\\/c2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-4.5{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = -1.7,
          c = -4.5;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2−1.7x−4.5");
        cy.get(equationAnchor)
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("y=0.2x2−1.7x−4.5");
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v"].replacements[0].componentName,
          args: { x: -2, y: 1 },
        });

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v2"].replacements[0].componentName,
          args: { x: 5, y: -6 },
        });

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("move vertex3");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: vertex3Name,
          args: { x: -3, y: -2 },
        });

        let a = 0.2;

        let vertex_x = -3;
        let vertex_y = -2;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });
    });
  });

  it("parabola through one point uses it as vertex", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <parabola through="$_point1"/>
    $_parabola1.vertex{name="v"}
    </graph>
    <graph name="g2">
    $_parabola1{name="p2"}
    <copy assignnames="v2" target="v" />
    </graph>
    $g2{name="g3"}

    $p2.equation{name="e2"}

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1.a)"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1.b)"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1.c)"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2.a)"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2.b)"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2.c)"/></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let equationAnchor = cesc2(
        "#" + stateVariables["/e2"].replacements[0].componentName,
      );
      let parabola3Name =
        stateVariables[stateVariables["/g3"].replacements[0].componentName]
          .activeChildren[0].componentName;
      let vertex3Name =
        stateVariables[stateVariables["/g3"].replacements[0].componentName]
          .activeChildren[1].componentName;

      cy.window().then(async (win) => {
        let a = 1,
          b = -2,
          c = 3;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change a");
      cy.get(cesc("#\\/a") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = -2,
          c = 3;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=−2x2−2x+3");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change b");
      cy.get(cesc("#\\/b") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}3{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = 3,
          c = 3;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=−2x2+3x+3");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change c");
      cy.get(cesc("#\\/c") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}9{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = 3,
          c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=−2x2+3x+9");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change a2");
      cy.get(cesc("#\\/a2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}0.2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = 3,
          c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2+3x+9");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change b2");
      cy.get(cesc("#\\/b2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-1.7{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = -1.7,
          c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2−1.7x+9");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("Change c2");
      cy.get(cesc("#\\/c2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-4.5{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = -1.7,
          c = -4.5;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2−1.7x−4.5");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v"].replacements[0].componentName,
          args: { x: -2, y: 1 },
        });

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v2"].replacements[0].componentName,
          args: { x: 5, y: -6 },
        });

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });

      cy.log("move point defining vertex");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: 2, y: 6 },
        });

        let a = 0.2;

        let vertex_x = 2;
        let vertex_y = 6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
        });
      });
    });
  });

  it("parabola through two points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <parabola through="$_point1 $_point2"/>
    $_parabola1.vertex{name="v"}
    </graph>
    <graph name="g2">
    $_parabola1{name="p2"}
    <copy assignnames="v2" target="v" />
    </graph>
    $g2{name="g3"}

    $p2.equation{name="e2"}

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1.a)"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1.b)"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1.c)"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2.a)"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2.b)"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2.c)"/></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let equationAnchor = cesc2(
        "#" + stateVariables["/e2"].replacements[0].componentName,
      );
      let parabola3Name =
        stateVariables[stateVariables["/g3"].replacements[0].componentName]
          .activeChildren[0].componentName;
      let vertex3Name =
        stateVariables[stateVariables["/g3"].replacements[0].componentName]
          .activeChildren[1].componentName;

      cy.get(equationAnchor).should("contain.text", "y=x2−3x+4");

      cy.window().then(async (win) => {
        let x1 = 1,
          x2 = 3;
        let y1 = 2,
          y2 = 4;

        let a = 1;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("Change a");
      cy.get(cesc("#\\/a") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        // first calculate old values of parameters
        let x1 = 1,
          x2 = 3;
        let y1 = 2,
          y2 = 4;

        let a = 1;
        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        a = -2;

        // revise y1 and y2 for new value of a
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=−2x2−3x+4");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("Change b");
      cy.get(cesc("#\\/b") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}3{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        // first calculate old values of parameters
        let x1 = 1,
          x2 = 3;
        let y1 = 2,
          y2 = 4;

        let a = 1;
        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        (a = -2), (b = 3);

        // revise y1 and y2 for new values of a and b
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=−2x2+3x+4");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("Change c");
      cy.get(cesc("#\\/c") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}9{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = 3,
          c = 9;

        // calculate point locations
        let x1 = 1,
          x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=−2x2+3x+9");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("Change a2");
      cy.get(cesc("#\\/a2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}0.2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = 3,
          c = 9;

        // calculate point locations
        let x1 = 1,
          x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2+3x+9");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("Change b2");
      cy.get(cesc("#\\/b2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-1.7{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = -1.7,
          c = 9;

        // calculate point locations
        let x1 = 1,
          x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2−1.7x+9");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("Change c2");
      cy.get(cesc("#\\/c2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-4.5{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = -1.7,
          c = -4.5;

        // calculate point locations
        let x1 = 1,
          x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2−1.7x−4.5");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v"].replacements[0].componentName,
          args: { x: -2, y: 1 },
        });

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1,
          x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v2"].replacements[0].componentName,
          args: { x: 5, y: -6 },
        });

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1,
          x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("move both points");
      cy.window().then(async (win) => {
        let x1 = -4,
          x2 = 0;
        let y1 = 7,
          y2 = -2;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });

        let a = 0.2;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("move points on top of each other, become vertex");
      cy.window().then(async (win) => {
        let x1 = 3,
          x2 = 3;
        let y1 = -9,
          y2 = -9;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });

        let a = 0.2;

        let vertex_x = x1;
        let vertex_y = y1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("move points above each other, parabola undefined");
      cy.window().then(async (win) => {
        let x1 = -4,
          x2 = -4;
        let y1 = -9,
          y2 = 1;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          assert.isNaN(stateVariables["/_parabola1"].stateValues.a);
          assert.isNaN(stateVariables["/_parabola1"].stateValues.b);
          assert.isNaN(stateVariables["/_parabola1"].stateValues.c);
          expect(stateVariables["/_parabola1"].stateValues.vertex).eqls([
            "\uff3f",
            "\uff3f",
          ]);
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq("\uff3f");
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq("\uff3f");
          assert.isNaN(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          );
          assert.isNaN(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          );
          assert.isNaN(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          );
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex,
          ).eqls(["\uff3f", "\uff3f"]);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq("\uff3f");
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq("\uff3f");
          assert.isNaN(stateVariables[parabola3Name].stateValues.a);
          assert.isNaN(stateVariables[parabola3Name].stateValues.b);
          assert.isNaN(stateVariables[parabola3Name].stateValues.c);
          expect(stateVariables[parabola3Name].stateValues.vertex).eqls([
            "\uff3f",
            "\uff3f",
          ]);
          expect(stateVariables[vertex3Name].stateValues.xs[0]).eq("\uff3f");
          expect(stateVariables[vertex3Name].stateValues.xs[1]).eq("\uff3f");
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });

      cy.log("move points apart");
      cy.window().then(async (win) => {
        let x1 = 4,
          x2 = -6;
        let y1 = 5,
          y2 = 8;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });

        let a = 0.2;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
        });
      });
    });
  });

  it("parabola through three points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <point>(5,6)</point>
    <parabola through="$_point1 $_point2 $_point3"/>
    $_parabola1.vertex{name="v"}
    </graph>
    <graph name="g2">
    $_parabola1{name="p2"}
    <copy assignnames="v2" target="v" />
    </graph>
    $g2{name="g3"}

    $p2.equation{name="e2"}

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1.a)"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1.b)"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1.c)"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2.a)"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2.b)"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2.c)"/></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let equationAnchor = cesc2(
        "#" + stateVariables["/e2"].replacements[0].componentName,
      );
      let parabola3Name =
        stateVariables[stateVariables["/g3"].replacements[0].componentName]
          .activeChildren[0].componentName;
      let vertex3Name =
        stateVariables[stateVariables["/g3"].replacements[0].componentName]
          .activeChildren[1].componentName;

      cy.window().then(async (win) => {
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = 2,
          y2 = 4,
          y3 = 6;

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables["/_parabola1"].stateValues.vertex[0]).eq(
            "\uff3f",
          );
          expect(stateVariables["/_parabola1"].stateValues.vertex[1]).eq(
            "\uff3f",
          );
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq("\uff3f");
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq("\uff3f");
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[0],
          ).eq("\uff3f");
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[1],
          ).eq("\uff3f");
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq("\uff3f");
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq("\uff3f");
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.vertex[0]).eq(
            "\uff3f",
          );
          expect(stateVariables[parabola3Name].stateValues.vertex[1]).eq(
            "\uff3f",
          );
          expect(stateVariables[vertex3Name].stateValues.xs[0]).eq("\uff3f");
          expect(stateVariables[vertex3Name].stateValues.xs[1]).eq("\uff3f");
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("Change a");
      cy.get(cesc("#\\/a") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        // first calculate old values of parameters
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = 2,
          y2 = 4,
          y3 = 6;

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        a = -2;

        // revise ys for new value of a
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;
        y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=−2x2+x+1");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("Change b");
      cy.get(cesc("#\\/b") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}3{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        // first calculate old values of parameters
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = 2,
          y2 = 4,
          y3 = 6;

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        (a = -2), (b = 3);

        // revise ys for new values of a and b
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;
        y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=−2x2+3x+1");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("Change c");
      cy.get(cesc("#\\/c") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}9{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = 3,
          c = 9;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=−2x2+3x+9");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("Change a2");
      cy.get(cesc("#\\/a2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}0.2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = 3,
          c = 9;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2+3x+9");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("Change b2");
      cy.get(cesc("#\\/b2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-1.7{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = -1.7,
          c = 9;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2−1.7x+9");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("Change c2");
      cy.get(cesc("#\\/c2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-4.5{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = 0.2,
          b = -1.7,
          c = -4.5;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.get(equationAnchor).should("contain.text", "y=0.2x2−1.7x−4.5");
        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v"].replacements[0].componentName,
          args: { x: -2, y: 1 },
        });

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v2"].replacements[0].componentName,
          args: { x: 5, y: -6 },
        });

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move all points");
      cy.window().then(async (win) => {
        let x1 = -4,
          x2 = 0,
          x3 = -9;
        let y1 = 7,
          y2 = -2,
          y3 = -2;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point3",
          args: { x: x3, y: y3 },
        });

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move points on top of each other, become vertex");
      cy.window().then(async (win) => {
        let x1 = 3,
          x2 = 3,
          x3 = 3;
        let y1 = -9,
          y2 = -9,
          y3 = -9;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point3",
          args: { x: x3, y: y3 },
        });

        let a = 0.2;

        let vertex_x = x1;
        let vertex_y = y1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move one point apart");
      cy.window().then(async (win) => {
        let x1 = 3,
          x2 = 3,
          x3 = 4;
        let y1 = -9,
          y2 = -9,
          y3 = -9;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point3",
          args: { x: x3, y: y3 },
        });

        let a = 0.2;

        let b = (y1 - y3 - a * (x1 ** 2 - x3 ** 2)) / (x1 - x3);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("change point grouping");
      cy.window().then(async (win) => {
        let x1 = 3,
          x2 = 4,
          x3 = 4;
        let y1 = -9,
          y2 = -9,
          y3 = -9;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });

        let a = 0.2;

        let b = (y1 - y3 - a * (x1 ** 2 - x3 ** 2)) / (x1 - x3);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("change point grouping again");
      cy.window().then(async (win) => {
        let x1 = 4,
          x2 = 6,
          x3 = 4;
        let y1 = -9,
          y2 = 3,
          y3 = -9;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });

        let a = 0.2;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move points above each other, parabola undefined");
      cy.window().then(async (win) => {
        let x1 = -4,
          x2 = -4,
          x3 = 0;
        let y1 = -9,
          y2 = 1,
          y3 = 1;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point3",
          args: { x: x3, y: y3 },
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          assert.isNaN(stateVariables["/_parabola1"].stateValues.a);
          assert.isNaN(stateVariables["/_parabola1"].stateValues.b);
          assert.isNaN(stateVariables["/_parabola1"].stateValues.c);
          expect(stateVariables["/_parabola1"].stateValues.vertex).eqls([
            "\uff3f",
            "\uff3f",
          ]);
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq("\uff3f");
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq("\uff3f");
          assert.isNaN(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          );
          assert.isNaN(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          );
          assert.isNaN(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          );
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex,
          ).eqls(["\uff3f", "\uff3f"]);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq("\uff3f");
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq("\uff3f");
          assert.isNaN(stateVariables[parabola3Name].stateValues.a);
          assert.isNaN(stateVariables[parabola3Name].stateValues.b);
          assert.isNaN(stateVariables[parabola3Name].stateValues.c);
          expect(stateVariables[parabola3Name].stateValues.vertex).eqls([
            "\uff3f",
            "\uff3f",
          ]);
          expect(stateVariables[vertex3Name].stateValues.xs[0]).eq("\uff3f");
          expect(stateVariables[vertex3Name].stateValues.xs[1]).eq("\uff3f");
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move points apart");
      cy.window().then(async (win) => {
        let x1 = -5,
          x2 = -4,
          x3 = 0;
        let y1 = -9,
          y2 = 1,
          y3 = 1;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });
    });
  });

  // test unfinished
  it.skip("parabola through variable number of points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput name="n" prefill="1" /></p>
    <graph>
    <parabola><through hide="false">
      <map>
        <template>
          <point>($i+<math>0</math>, $m+<math>0</math>)</point>
        </template>
        <sources alias="m" indexAlias="i">
          <sequence step="2"><count>$n.value</count></sequence>
        </sources>
      </map>
    </through></parabola>
    $_parabola1.vertex{name="v"}
    </graph>
    <graph name="g2">
    $_parabola1{name="p2"}
    <copy assignames="v2" target="v" />
    </graph>
    $g2{name="g3"}

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1.a)"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1.b)"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1.c)"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2.a)"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2.b)"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2.c)"/></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let parabola3 = stateVariables["/g3"].replacements[0].activeChildren[0];
      let vertex3 = stateVariables["/g3"].replacements[0].activeChildren[1];

      cy.window().then(async (win) => {
        let a = 1,
          b = -2,
          c = 2;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.vertex[0]).eq(
            vertex_x,
          );
          expect(stateVariables["/_parabola1"].stateValues.vertex[1]).eq(
            vertex_y,
          );
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq(vertex_y);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[1],
          ).eq(vertex_y);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq(vertex_y);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.vertex[0]).eq(
            vertex_x,
          );
          expect(stateVariables[parabola3Name].stateValues.vertex[1]).eq(
            vertex_y,
          );
          expect(stateVariables[vertex3Name].stateValues.xs[0]).eq(vertex_x);
          expect(stateVariables[vertex3Name].stateValues.xs[1]).eq(vertex_y);
        });
      });

      cy.log("Change a");
      cy.get(cesc("#\\/a") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = -2,
          c = 2;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.vertex[0]).eq(
            vertex_x,
          );
          expect(stateVariables["/_parabola1"].stateValues.vertex[1]).eq(
            vertex_y,
          );
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq(vertex_y);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[1],
          ).eq(vertex_y);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq(vertex_y);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.vertex[0]).eq(
            vertex_x,
          );
          expect(stateVariables[parabola3Name].stateValues.vertex[1]).eq(
            vertex_y,
          );
          expect(stateVariables[vertex3Name].stateValues.xs[0]).eq(vertex_x);
          expect(stateVariables[vertex3Name].stateValues.xs[1]).eq(vertex_y);
        });
      });

      cy.log("Change b2");
      cy.get(cesc("#\\/b2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}3{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2,
          b = 3,
          c = 2;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.vertex[0]).eq(
            vertex_x,
          );
          expect(stateVariables["/_parabola1"].stateValues.vertex[1]).eq(
            vertex_y,
          );
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq(vertex_y);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[1],
          ).eq(vertex_y);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq(vertex_y);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.vertex[0]).eq(
            vertex_x,
          );
          expect(stateVariables[parabola3Name].stateValues.vertex[1]).eq(
            vertex_y,
          );
          expect(stateVariables[vertex3Name].stateValues.xs[0]).eq(vertex_x);
          expect(stateVariables[vertex3Name].stateValues.xs[1]).eq(vertex_y);
        });
      });

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v"].replacements[0].componentName,
          args: { x: -2, y: 1 },
        });

        let a = -2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.vertex[0]).eq(
            vertex_x,
          );
          expect(stateVariables["/_parabola1"].stateValues.vertex[1]).eq(
            vertex_y,
          );
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq(vertex_y);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[1],
          ).eq(vertex_y);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq(vertex_y);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.vertex[0]).eq(
            vertex_x,
          );
          expect(stateVariables[parabola3Name].stateValues.vertex[1]).eq(
            vertex_y,
          );
          expect(stateVariables[vertex3Name].stateValues.xs[0]).eq(vertex_x);
          expect(stateVariables[vertex3Name].stateValues.xs[1]).eq(vertex_y);
        });
      });

      cy.log("Add a second point");
      cy.get(cesc("#\\/n") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let a = -2;

        let x1 = -2,
          x2 = 2;
        let y1 = 1,
          y2 = 3;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.vertex[0]).eq(
            vertex_x,
          );
          expect(stateVariables["/_parabola1"].stateValues.vertex[1]).eq(
            vertex_y,
          );
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq(vertex_y);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex[1],
          ).eq(vertex_y);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq(vertex_x);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq(vertex_y);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.vertex[0]).eq(
            vertex_x,
          );
          expect(stateVariables[parabola3Name].stateValues.vertex[1]).eq(
            vertex_y,
          );
          expect(stateVariables[vertex3Name].stateValues.xs[0]).eq(vertex_x);
          expect(stateVariables[vertex3Name].stateValues.xs[1]).eq(vertex_y);
        });
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // first calculate old values of parameters
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = 2,
          y2 = 4,
          y3 = 6;

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        a = -2;

        // revise ys for new value of a
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;
        y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("Change b");
      cy.get(cesc("#\\/b") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}3{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // first calculate old values of parameters
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = 2,
          y2 = 4,
          y3 = 6;

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        (a = -2), (b = 3);

        // revise ys for new values of a and b
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;
        y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("Change c");
      cy.get(cesc("#\\/c") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}9{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let a = -2,
          b = 3,
          c = 9;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("Change a2");
      cy.get(cesc("#\\/a2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}0.2{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let a = 0.2,
          b = 3,
          c = 9;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("Change b2");
      cy.get(cesc("#\\/b2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-1.7{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let a = 0.2,
          b = -1.7,
          c = 9;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("Change c2");
      cy.get(cesc("#\\/c2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-4.5{enter}",
        { force: true },
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let a = 0.2,
          b = -1.7,
          c = -4.5;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v"].replacements[0].componentName,
          args: { x: -2, y: 1 },
        });

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
          actionName: "movePoint",
          componentName: stateVariables["/v2"].replacements[0].componentName,
          args: { x: 5, y: -6 },
        });

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1,
          x2 = 3,
          x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move all points");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let x1 = -4,
          x2 = 0,
          x3 = -9;
        let y1 = 7,
          y2 = -2,
          y3 = -2;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point3",
          args: { x: x3, y: y3 },
        });

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move points on top of each other, become vertex");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let x1 = 3,
          x2 = 3,
          x3 = 3;
        let y1 = -9,
          y2 = -9,
          y3 = -9;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point3",
          args: { x: x3, y: y3 },
        });

        let a = 0.2;

        let vertex_x = x1;
        let vertex_y = y1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move one point apart");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let x1 = 3,
          x2 = 3,
          x3 = 4;
        let y1 = -9,
          y2 = -9,
          y3 = -9;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point3",
          args: { x: x3, y: y3 },
        });

        let a = 0.2;

        let b = (y1 - y3 - a * (x1 ** 2 - x3 ** 2)) / (x1 - x3);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("change point grouping");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let x1 = 3,
          x2 = 4,
          x3 = 4;
        let y1 = -9,
          y2 = -9,
          y3 = -9;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });

        let a = 0.2;

        let b = (y1 - y3 - a * (x1 ** 2 - x3 ** 2)) / (x1 - x3);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("change point grouping again");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let x1 = 4,
          x2 = 6,
          x3 = 4;
        let y1 = -9,
          y2 = 3,
          y3 = -9;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });

        let a = 0.2;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move points above each other, parabola undefined");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let x1 = -4,
          x2 = -4,
          x3 = 0;
        let y1 = -9,
          y2 = 1,
          y3 = 1;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point3",
          args: { x: x3, y: y3 },
        });

        cy.window().then(async (win) => {
          assert.isNaN(stateVariables["/_parabola1"].stateValues.a);
          assert.isNaN(stateVariables["/_parabola1"].stateValues.b);
          assert.isNaN(stateVariables["/_parabola1"].stateValues.c);
          expect(stateVariables["/_parabola1"].stateValues.vertex).eqls([
            "\uff3f",
            "\uff3f",
          ]);
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq("\uff3f");
          expect(
            stateVariables[stateVariables["/v"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq("\uff3f");
          assert.isNaN(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          );
          assert.isNaN(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          );
          assert.isNaN(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          );
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.vertex,
          ).eqls(["\uff3f", "\uff3f"]);
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[0],
          ).eq("\uff3f");
          expect(
            stateVariables[stateVariables["/v2"].replacements[0].componentName]
              .stateValues.xs[1],
          ).eq("\uff3f");
          assert.isNaN(stateVariables[parabola3Name].stateValues.a);
          assert.isNaN(stateVariables[parabola3Name].stateValues.b);
          assert.isNaN(stateVariables[parabola3Name].stateValues.c);
          expect(stateVariables[parabola3Name].stateValues.vertex).eqls([
            "\uff3f",
            "\uff3f",
          ]);
          expect(stateVariables[vertex3Name].stateValues.xs[0]).eq("\uff3f");
          expect(stateVariables[vertex3Name].stateValues.xs[1]).eq("\uff3f");
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });

      cy.log("move points apart");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let x1 = -5,
          x2 = -4,
          x3 = 0;
        let y1 = -9,
          y2 = 1,
          y3 = 1;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: x1, y: y1 },
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point2",
          args: { x: x2, y: y2 },
        });

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {
          expect(stateVariables["/_parabola1"].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables["/_parabola1"].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_parabola1"].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.a,
          ).closeTo(a, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.b,
          ).closeTo(b, 1e-12);
          expect(
            stateVariables[stateVariables["/p2"].replacements[0].componentName]
              .stateValues.c,
          ).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.equation,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/p2"].replacements[0].componentName
                ].stateValues.vertex[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[0],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/v2"].replacements[0].componentName
                ].stateValues.xs[1],
              )
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(
                stateVariables[
                  stateVariables["/e2"].replacements[0].componentName
                ].stateValues.value,
              )
              .equals(equationExpression),
          ).eq(true);
          expect(stateVariables[parabola3Name].stateValues.a).closeTo(a, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.b).closeTo(b, 1e-12);
          expect(stateVariables[parabola3Name].stateValues.c).closeTo(c, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.equation)
              .equals(equationExpression),
          ).eq(true);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[parabola3Name].stateValues.vertex[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(vertex_x, 1e-12);
          expect(
            me
              .fromAst(stateVariables[vertex3Name].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(vertex_y, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point1"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y1, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point2"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y2, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[0])
              .evaluate_numbers().tree,
          ).closeTo(x3, 1e-12);
          expect(
            me
              .fromAst(stateVariables["/_point3"].stateValues.xs[1])
              .evaluate_numbers().tree,
          ).closeTo(y3, 1e-12);
        });
      });
    });
  });

  it("constrain to parabola", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <parabola through="(1,2)" name="p" />
    <point x="0" y="0" name="A">
      <constraints>
        <constrainTo>$p</constrainTo>
      </constraints>
    </point>
    </graph>
    <graph name="g2">
      <copy assignNames="p2" target="p" />
      <copy assignNames="A2" target="A" />
    </graph>
    <copy assignNames="g3" target="g2"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let f_p = (x) => (x - 1) ** 2 + 2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let A3Name = stateVariables["/g3"].activeChildren[1].componentName;

      let [x1, x2] = stateVariables["/A"].stateValues.xs;
      let [x12, x22] = stateVariables["/A2"].stateValues.xs;
      let [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).greaterThan(0);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 9, y: -2 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).lessThan(9);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: -9, y: 4 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).greaterThan(-9);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: A3Name,
        args: { x: 0.9, y: 9 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).lessThan(0.9);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: A3Name,
        args: { x: 1.1, y: 9 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).greaterThan(1.11);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);
    });
  });

  it("constrain to parabola opening downward", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <parabola through="(1,-2) (2,-3) (0,-3)" name="p" />
    <point x="0" y="0" name="A">
      <constraints>
        <constrainTo>$p</constrainTo>
      </constraints>
    </point>
    </graph>
    <graph name="g2">
      <copy assignNames="p2" target="p" />
      <copy assignNames="A2" target="A" />
    </graph>
    <copy assignNames="g3" target="g2"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let f_p = (x) => -((x - 1) ** 2 + 2);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let A3Name = stateVariables["/g3"].activeChildren[1].componentName;

      let [x1, x2] = stateVariables["/A"].stateValues.xs;
      let [x12, x22] = stateVariables["/A2"].stateValues.xs;
      let [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).greaterThan(0);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 9, y: 2 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).lessThan(9);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: -9, y: -4 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).greaterThan(-9);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: A3Name,
        args: { x: 0.9, y: -9 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).lessThan(0.9);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: A3Name,
        args: { x: 1.1, y: -9 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).greaterThan(1.11);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);
    });
  });

  it("constrain to parabola that is a line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <parabola through="(1,2) (3,3) (5, 4)" name="p" />
    <point x="0" y="0" name="A">
      <constraints>
        <constrainTo>$p</constrainTo>
      </constraints>
    </point>
    </graph>
    <graph name="g2">
      <copy assignNames="p2" target="p" />
      <copy assignNames="A2" target="A" />
    </graph>
    <copy assignNames="g3" target="g2"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let f_p = (x) => 0.5 * x + 1.5;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let A3Name = stateVariables["/g3"].activeChildren[1].componentName;

      let [x1, x2] = stateVariables["/A"].stateValues.xs;
      let [x12, x22] = stateVariables["/A2"].stateValues.xs;
      let [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).closeTo(1.5 / -2.5, 1e-14);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 9, y: -2 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).closeTo((1.5 - 2 * 9 + 2) / -2.5, 1e-14);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: -9, y: 4 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).closeTo((1.5 + 2 * 9 - 4) / -2.5, 1e-14);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: A3Name,
        args: { x: 0.9, y: 9 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).closeTo((1.5 - 2 * 0.9 - 9) / -2.5, 1e-14);
      expect(x2).closeTo(f_p(x1), 1e-14);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);
    });
  });

  it("constrain to parabola opening downward, different axis scales", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph ymin="-1000" ymax="1000">
    <parabola through="(1,-200) (2,-300) (0,-300)" name="p" />
    <point x="0" y="0" name="A">
      <constraints>
        <constrainTo relativeToGraphScales>$p</constrainTo>
      </constraints>
    </point>
    </graph>
    <graph name="g2" ymin="-1000" ymax="1000">
      <copy assignNames="p2" target="p" />
      <copy assignNames="A2" target="A" />
    </graph>
    <copy assignNames="g3" target="g2" ymin="-1000" ymax="1000"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let f_p = (x) => -100 * ((x - 1) ** 2 + 2);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let A3Name = stateVariables["/g3"].activeChildren[1].componentName;

      let [x1, x2] = stateVariables["/A"].stateValues.xs;
      let [x12, x22] = stateVariables["/A2"].stateValues.xs;
      let [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).greaterThan(0);
      expect(x2).closeTo(f_p(x1), 1e-12);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 9, y: 200 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).lessThan(9);
      expect(x2).closeTo(f_p(x1), 1e-12);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: -9, y: -400 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).greaterThan(-9);
      expect(x2).closeTo(f_p(x1), 1e-12);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: A3Name,
        args: { x: 0.9, y: -900 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).lessThan(0.9);
      expect(x2).closeTo(f_p(x1), 1e-12);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: A3Name,
        args: { x: 1.1, y: -900 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).greaterThan(1.11);
      expect(x2).closeTo(f_p(x1), 1e-12);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 9, y: 0 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).greaterThan(2);
      expect(x2).closeTo(f_p(x1), 1e-12);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: -9, y: 100 },
      });
      stateVariables = await win.returnAllStateVariables1();
      [x1, x2] = stateVariables["/A"].stateValues.xs;
      [x12, x22] = stateVariables["/A2"].stateValues.xs;
      [x13, x23] = stateVariables[A3Name].stateValues.xs;
      expect(x1).lessThan(0);
      expect(x2).closeTo(f_p(x1), 1e-12);
      expect(x12).eq(x1);
      expect(x13).eq(x1);
      expect(x22).eq(x2);
      expect(x23).eq(x2);
    });
  });

  it("copy parabola and overwrite parameters", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph name="g1" newNamespace>
    <parabola name="p0" />
    <copy target="p0" vertex="(3,4)" assignNames="p1" />
    <copy target="p1" through="(5,-4)" assignNames="p2" />
    <copy target="p0" through="(-5,-2)" assignNames="p3" />
    <copy target="p3" vertex="(-6,6)" assignNames="p4" />
    </graph>

    $g1{name="g2"}

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g1/p0"].stateValues.a).closeTo(1, 1e-12);
      expect(stateVariables["/g1/p0"].stateValues.b).closeTo(0, 1e-12);
      expect(stateVariables["/g1/p0"].stateValues.c).closeTo(0, 1e-12);
      expect(stateVariables["/g2/p0"].stateValues.a).closeTo(1, 1e-12);
      expect(stateVariables["/g2/p0"].stateValues.b).closeTo(0, 1e-12);
      expect(stateVariables["/g2/p0"].stateValues.c).closeTo(0, 1e-12);

      expect(stateVariables["/g1/p1"].stateValues.a).closeTo(1, 1e-12);
      expect(stateVariables["/g1/p1"].stateValues.b).closeTo(-6, 1e-12);
      expect(stateVariables["/g1/p1"].stateValues.c).closeTo(13, 1e-12);
      expect(stateVariables["/g2/p1"].stateValues.a).closeTo(1, 1e-12);
      expect(stateVariables["/g2/p1"].stateValues.b).closeTo(-6, 1e-12);
      expect(stateVariables["/g2/p1"].stateValues.c).closeTo(13, 1e-12);

      expect(stateVariables["/g1/p2"].stateValues.a).closeTo(-2, 1e-12);
      expect(stateVariables["/g1/p2"].stateValues.b).closeTo(12, 1e-12);
      expect(stateVariables["/g1/p2"].stateValues.c).closeTo(-14, 1e-12);
      expect(stateVariables["/g2/p2"].stateValues.a).closeTo(-2, 1e-12);
      expect(stateVariables["/g2/p2"].stateValues.b).closeTo(12, 1e-12);
      expect(stateVariables["/g2/p2"].stateValues.c).closeTo(-14, 1e-12);

      expect(stateVariables["/g1/p3"].stateValues.a).closeTo(1, 1e-12);
      expect(stateVariables["/g1/p3"].stateValues.b).closeTo(10, 1e-12);
      expect(stateVariables["/g1/p3"].stateValues.c).closeTo(23, 1e-12);
      expect(stateVariables["/g2/p3"].stateValues.a).closeTo(1, 1e-12);
      expect(stateVariables["/g2/p3"].stateValues.b).closeTo(10, 1e-12);
      expect(stateVariables["/g2/p3"].stateValues.c).closeTo(23, 1e-12);

      expect(stateVariables["/g1/p4"].stateValues.a).closeTo(-8, 1e-12);
      expect(stateVariables["/g1/p4"].stateValues.b).closeTo(-96, 1e-12);
      expect(stateVariables["/g1/p4"].stateValues.c).closeTo(-282, 1e-12);
      expect(stateVariables["/g2/p4"].stateValues.a).closeTo(-8, 1e-12);
      expect(stateVariables["/g2/p4"].stateValues.b).closeTo(-96, 1e-12);
      expect(stateVariables["/g2/p4"].stateValues.c).closeTo(-282, 1e-12);
    });
  });

  it("copy propIndex of points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <parabola through="(2,-3) (3,4) (-3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy prop="throughpoints" target="_parabola1" propIndex="$n" assignNames="P1 P2 P3" /></p>

    <p><copy prop="throughpoint2" target="_parabola1" propIndex="$n" assignNames="x" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = 4;
    let t3x = -3,
      t3y = 4;

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2x)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t2x)},${nInDOM(t2y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t3x)},${nInDOM(t3y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
  });

  it("copy propIndex of points, dot and array notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <parabola through="(2,-3) (3,4) (-3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy source="_parabola1.throughpoints[$n]" assignNames="P1 P2 P3" /></p>

    <p><copy source="_parabola1.throughpoint2[$n]" assignNames="x" /></p>

    <p><copy source="_parabola1.throughpoints[2][$n]" assignNames="xa" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = 4;
    let t3x = -3,
      t3y = 4;

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2x)}`,
    );
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2x)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t2x)},${nInDOM(t2y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t3x)},${nInDOM(t3y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");
  });
});
