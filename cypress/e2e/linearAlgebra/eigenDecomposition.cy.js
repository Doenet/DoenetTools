import me from "math-expressions";
import { cesc } from "../../../../src/utils/url";

describe("EigenDecomposition Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("2x2 matrices", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>A = <math name="A" format="latex">
      \\begin{pmatrix}
      1 & 2\\\\
      2 & 1
      \\end{pmatrix}
    </math></p>
    <p>B = <math name="B" format="latex">
      \\begin{pmatrix}
      1 & 2\\\\
      -2 & 1
      \\end{pmatrix}
    </math></p>
    
    <eigenDecomposition name="Ad">
      $A
    </eigenDecomposition>
    <eigenDecomposition name="Bd">
      $B
    </eigenDecomposition>

    <p name="pAevs">Eigenvalues of A: <aslist name="Aevs"><copy source="Ad.eigenvalues" assignNames="Aev1a Aev2a" /></aslist></p>
    <p>1st eigenvalue of A: <number copySource="Ad.eigenvalue1" name="Aev1" /></p>
    <p>2nd eigenvalue of A: <number copySource="Ad.eigenvalue2" name="Aev2" /></p>

    <p name="pAevecs">Eigenvectors of A: <aslist name="Aevecs"><copy source="Ad.eigenvectors" assignNames="Aevec1a Aevec2a" /></aslist></p>
    <p>1st eigenvector of A: <vector copySource="Ad.eigenvector1" name="Aevec1" /></p>
    <p>2nd eigenvector of A: <vector copySource="Ad.eigenvector2" name="Aevec2" /></p>
    <p>1st component of 1st eigenvector of A: <number copySource="Ad.eigenvector1.x" name="Aevec1x" /></p>
    <p>2nd component of 1st eigenvector of A: <number copySource="Ad.eigenvector1.y" name="Aevec1y" /></p>

    <p name="pBevs">Eigenvalues of B: <aslist name="Bevs"><copy source="Bd.eigenvalues" assignNames="Bev1a Bev2a" /></aslist></p>
    <p>1st eigenvalue of B: <number copySource="Bd.eigenvalue1" name="Bev1" /></p>
    <p>2nd eigenvalue of B: <number copySource="Bd.eigenvalue2" name="Bev2" /></p>

    <p name="pBevecs">Eigenvectors of B: <aslist name="Bevecs"><copy source="Bd.eigenvectors" assignNames="Bevec1a Bevec2a" /></aslist></p>
    <p>1st eigenvector of B: <vector copySource="Bd.eigenvector1" name="Bevec1" /></p>
    <p>2nd eigenvector of B: <vector copySource="Bd.eigenvector2" name="Bevec2" /></p>
    <p>1st component of 1st eigenvector of B: <number copySource="Bd.eigenvector1.x" name="Bevec1x" /></p>
    <p>2nd component of 1st eigenvector of B: <number copySource="Bd.eigenvector1.y" name="Bevec1y" /></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/pAevs")).should("have.text", "Eigenvalues of A: -1, 3");
    cy.get(cesc("#\\/Aev1")).should("have.text", "-1");
    cy.get(cesc("#\\/Aev2")).should("have.text", "3");

    cy.get(cesc("#\\/pBevs")).should(
      "have.text",
      "Eigenvalues of B: 1 + 2 i, 1 - 2 i",
    );
    cy.get(cesc("#\\/Bev1")).should("have.text", "1 + 2 i");
    cy.get(cesc("#\\/Bev2")).should("have.text", "1 - 2 i");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/Ad"].stateValues.eigenvalues).eqls([-1, 3]);
      expect(stateVariables["/Aev1"].stateValues.value).eq(-1);
      expect(stateVariables["/Aev1a"].stateValues.value).eq(-1);
      expect(stateVariables["/Aev2"].stateValues.value).eq(3);
      expect(stateVariables["/Aev2a"].stateValues.value).eq(3);

      expect(
        stateVariables["/Ad"].stateValues.eigenvectors[0][1] /
          stateVariables["/Ad"].stateValues.eigenvectors[0][0],
      ).closeTo(-1, 1e-14);
      expect(
        stateVariables["/Ad"].stateValues.eigenvectors[1][1] /
          stateVariables["/Ad"].stateValues.eigenvectors[1][0],
      ).closeTo(1, 1e-14);

      expect(
        stateVariables["/Aevec1"].stateValues.displacement[1] /
          stateVariables["/Aevec1"].stateValues.displacement[0],
      ).closeTo(-1, 1e-14);
      expect(
        stateVariables["/Aevec1a"].stateValues.displacement[1] /
          stateVariables["/Aevec1a"].stateValues.displacement[0],
      ).closeTo(-1, 1e-14);
      expect(
        stateVariables["/Aevec2"].stateValues.displacement[1] /
          stateVariables["/Aevec2"].stateValues.displacement[0],
      ).closeTo(1, 1e-14);
      expect(
        stateVariables["/Aevec2a"].stateValues.displacement[1] /
          stateVariables["/Aevec2a"].stateValues.displacement[0],
      ).closeTo(1, 1e-14);
      expect(
        stateVariables["/Aevec1y"].stateValues.value /
          stateVariables["/Aevec1x"].stateValues.value,
      ).closeTo(-1, 1e-14);

      expect(stateVariables["/Bd"].stateValues.eigenvalues[0].re).closeTo(
        1,
        1e-14,
      );
      expect(stateVariables["/Bd"].stateValues.eigenvalues[0].im).closeTo(
        2,
        1e-14,
      );
      expect(stateVariables["/Bd"].stateValues.eigenvalues[1].re).closeTo(
        1,
        1e-14,
      );
      expect(stateVariables["/Bd"].stateValues.eigenvalues[1].im).closeTo(
        -2,
        1e-14,
      );
      expect(stateVariables["/Bev1"].stateValues.value.re).closeTo(1, 1e-14);
      expect(stateVariables["/Bev1"].stateValues.value.im).closeTo(2, 1e-14);
      expect(stateVariables["/Bev1a"].stateValues.value.re).closeTo(1, 1e-14);
      expect(stateVariables["/Bev1a"].stateValues.value.im).closeTo(2, 1e-14);
      expect(stateVariables["/Bev2"].stateValues.value.re).closeTo(1, 1e-14);
      expect(stateVariables["/Bev2"].stateValues.value.im).closeTo(-2, 1e-14);
      expect(stateVariables["/Bev2a"].stateValues.value.re).closeTo(1, 1e-14);
      expect(stateVariables["/Bev2a"].stateValues.value.im).closeTo(-2, 1e-14);

      let ratio = me.math.divide(
        reviveComplex(stateVariables["/Bd"].stateValues.eigenvectors[0][1]),
        reviveComplex(stateVariables["/Bd"].stateValues.eigenvectors[0][0]),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(1, 1e-14);
      ratio = me.math.divide(
        reviveComplex(stateVariables["/Bd"].stateValues.eigenvectors[1][1]),
        reviveComplex(stateVariables["/Bd"].stateValues.eigenvectors[1][0]),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(-1, 1e-14);

      ratio = me.math.divide(
        me
          .fromAst(stateVariables["/Bevec1"].stateValues.displacement[1])
          .evaluate_to_constant(),
        me
          .fromAst(stateVariables["/Bevec1"].stateValues.displacement[0])
          .evaluate_to_constant(),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(1, 1e-14);

      ratio = me.math.divide(
        me
          .fromAst(stateVariables["/Bevec1a"].stateValues.displacement[1])
          .evaluate_to_constant(),
        me
          .fromAst(stateVariables["/Bevec1a"].stateValues.displacement[0])
          .evaluate_to_constant(),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(1, 1e-14);

      ratio = me.math.divide(
        me
          .fromAst(stateVariables["/Bevec2"].stateValues.displacement[1])
          .evaluate_to_constant(),
        me
          .fromAst(stateVariables["/Bevec2"].stateValues.displacement[0])
          .evaluate_to_constant(),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(-1, 1e-14);

      ratio = me.math.divide(
        me
          .fromAst(stateVariables["/Bevec2a"].stateValues.displacement[1])
          .evaluate_to_constant(),
        me
          .fromAst(stateVariables["/Bevec2a"].stateValues.displacement[0])
          .evaluate_to_constant(),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(-1, 1e-14);

      ratio = me.math.divide(
        reviveComplex(stateVariables["/Bevec1y"].stateValues.value),
        reviveComplex(stateVariables["/Bevec1x"].stateValues.value),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(1, 1e-14);
    });
  });

  it("2x2 matrices, fractions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>A = <math name="A" format="latex">
      \\begin{pmatrix}
      2/2 & 6/3\\\\
      8/4 & 5/5
      \\end{pmatrix}
    </math></p>
    <p>B = <math name="B" format="latex">
      \\begin{pmatrix}
      2/2 & 6/3\\\\
      -8/4 & 5/5
      \\end{pmatrix}
    </math></p>
    
    <eigenDecomposition name="Ad">
      $A
    </eigenDecomposition>
    <eigenDecomposition name="Bd">
      $B
    </eigenDecomposition>

    <p name="pAevs">Eigenvalues of A: <aslist name="Aevs"><copy source="Ad.eigenvalues" assignNames="Aev1a Aev2a" /></aslist></p>
    <p>1st eigenvalue of A: <number copySource="Ad.eigenvalue1" name="Aev1" /></p>
    <p>2nd eigenvalue of A: <number copySource="Ad.eigenvalue2" name="Aev2" /></p>

    <p name="pAevecs">Eigenvectors of A: <aslist name="Aevecs"><copy source="Ad.eigenvectors" assignNames="Aevec1a Aevec2a" /></aslist></p>
    <p>1st eigenvector of A: <vector copySource="Ad.eigenvector1" name="Aevec1" /></p>
    <p>2nd eigenvector of A: <vector copySource="Ad.eigenvector2" name="Aevec2" /></p>
    <p>1st component of 1st eigenvector of A: <number copySource="Ad.eigenvector1.x" name="Aevec1x" /></p>
    <p>2nd component of 1st eigenvector of A: <number copySource="Ad.eigenvector1.y" name="Aevec1y" /></p>

    <p name="pBevs">Eigenvalues of B: <aslist name="Bevs"><copy source="Bd.eigenvalues" assignNames="Bev1a Bev2a" /></aslist></p>
    <p>1st eigenvalue of B: <number copySource="Bd.eigenvalue1" name="Bev1" /></p>
    <p>2nd eigenvalue of B: <number copySource="Bd.eigenvalue2" name="Bev2" /></p>

    <p name="pBevecs">Eigenvectors of B: <aslist name="Bevecs"><copy source="Bd.eigenvectors" assignNames="Bevec1a Bevec2a" /></aslist></p>
    <p>1st eigenvector of B: <vector copySource="Bd.eigenvector1" name="Bevec1" /></p>
    <p>2nd eigenvector of B: <vector copySource="Bd.eigenvector2" name="Bevec2" /></p>
    <p>1st component of 1st eigenvector of B: <number copySource="Bd.eigenvector1.x" name="Bevec1x" /></p>
    <p>2nd component of 1st eigenvector of B: <number copySource="Bd.eigenvector1.y" name="Bevec1y" /></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/pAevs")).should("have.text", "Eigenvalues of A: -1, 3");
    cy.get(cesc("#\\/Aev1")).should("have.text", "-1");
    cy.get(cesc("#\\/Aev2")).should("have.text", "3");

    cy.get(cesc("#\\/pBevs")).should(
      "have.text",
      "Eigenvalues of B: 1 + 2 i, 1 - 2 i",
    );
    cy.get(cesc("#\\/Bev1")).should("have.text", "1 + 2 i");
    cy.get(cesc("#\\/Bev2")).should("have.text", "1 - 2 i");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/Ad"].stateValues.eigenvalues).eqls([-1, 3]);
      expect(stateVariables["/Aev1"].stateValues.value).eq(-1);
      expect(stateVariables["/Aev1a"].stateValues.value).eq(-1);
      expect(stateVariables["/Aev2"].stateValues.value).eq(3);
      expect(stateVariables["/Aev2a"].stateValues.value).eq(3);

      expect(
        stateVariables["/Ad"].stateValues.eigenvectors[0][1] /
          stateVariables["/Ad"].stateValues.eigenvectors[0][0],
      ).closeTo(-1, 1e-14);
      expect(
        stateVariables["/Ad"].stateValues.eigenvectors[1][1] /
          stateVariables["/Ad"].stateValues.eigenvectors[1][0],
      ).closeTo(1, 1e-14);

      expect(
        stateVariables["/Aevec1"].stateValues.displacement[1] /
          stateVariables["/Aevec1"].stateValues.displacement[0],
      ).closeTo(-1, 1e-14);
      expect(
        stateVariables["/Aevec1a"].stateValues.displacement[1] /
          stateVariables["/Aevec1a"].stateValues.displacement[0],
      ).closeTo(-1, 1e-14);
      expect(
        stateVariables["/Aevec2"].stateValues.displacement[1] /
          stateVariables["/Aevec2"].stateValues.displacement[0],
      ).closeTo(1, 1e-14);
      expect(
        stateVariables["/Aevec2a"].stateValues.displacement[1] /
          stateVariables["/Aevec2a"].stateValues.displacement[0],
      ).closeTo(1, 1e-14);
      expect(
        stateVariables["/Aevec1y"].stateValues.value /
          stateVariables["/Aevec1x"].stateValues.value,
      ).closeTo(-1, 1e-14);

      expect(stateVariables["/Bd"].stateValues.eigenvalues[0].re).closeTo(
        1,
        1e-14,
      );
      expect(stateVariables["/Bd"].stateValues.eigenvalues[0].im).closeTo(
        2,
        1e-14,
      );
      expect(stateVariables["/Bd"].stateValues.eigenvalues[1].re).closeTo(
        1,
        1e-14,
      );
      expect(stateVariables["/Bd"].stateValues.eigenvalues[1].im).closeTo(
        -2,
        1e-14,
      );
      expect(stateVariables["/Bev1"].stateValues.value.re).closeTo(1, 1e-14);
      expect(stateVariables["/Bev1"].stateValues.value.im).closeTo(2, 1e-14);
      expect(stateVariables["/Bev1a"].stateValues.value.re).closeTo(1, 1e-14);
      expect(stateVariables["/Bev1a"].stateValues.value.im).closeTo(2, 1e-14);
      expect(stateVariables["/Bev2"].stateValues.value.re).closeTo(1, 1e-14);
      expect(stateVariables["/Bev2"].stateValues.value.im).closeTo(-2, 1e-14);
      expect(stateVariables["/Bev2a"].stateValues.value.re).closeTo(1, 1e-14);
      expect(stateVariables["/Bev2a"].stateValues.value.im).closeTo(-2, 1e-14);

      let ratio = me.math.divide(
        reviveComplex(stateVariables["/Bd"].stateValues.eigenvectors[0][1]),
        reviveComplex(stateVariables["/Bd"].stateValues.eigenvectors[0][0]),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(1, 1e-14);
      ratio = me.math.divide(
        reviveComplex(stateVariables["/Bd"].stateValues.eigenvectors[1][1]),
        reviveComplex(stateVariables["/Bd"].stateValues.eigenvectors[1][0]),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(-1, 1e-14);

      ratio = me.math.divide(
        me
          .fromAst(stateVariables["/Bevec1"].stateValues.displacement[1])
          .evaluate_to_constant(),
        me
          .fromAst(stateVariables["/Bevec1"].stateValues.displacement[0])
          .evaluate_to_constant(),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(1, 1e-14);

      ratio = me.math.divide(
        me
          .fromAst(stateVariables["/Bevec1a"].stateValues.displacement[1])
          .evaluate_to_constant(),
        me
          .fromAst(stateVariables["/Bevec1a"].stateValues.displacement[0])
          .evaluate_to_constant(),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(1, 1e-14);

      ratio = me.math.divide(
        me
          .fromAst(stateVariables["/Bevec2"].stateValues.displacement[1])
          .evaluate_to_constant(),
        me
          .fromAst(stateVariables["/Bevec2"].stateValues.displacement[0])
          .evaluate_to_constant(),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(-1, 1e-14);

      ratio = me.math.divide(
        me
          .fromAst(stateVariables["/Bevec2a"].stateValues.displacement[1])
          .evaluate_to_constant(),
        me
          .fromAst(stateVariables["/Bevec2a"].stateValues.displacement[0])
          .evaluate_to_constant(),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(-1, 1e-14);

      ratio = me.math.divide(
        reviveComplex(stateVariables["/Bevec1y"].stateValues.value),
        reviveComplex(stateVariables["/Bevec1x"].stateValues.value),
      );
      expect(ratio.re).closeTo(0, 1e-14);
      expect(ratio.im).closeTo(1, 1e-14);
    });
  });
});

function reviveComplex(num) {
  return me.math.complex({ re: num.re, im: num.im });
}
