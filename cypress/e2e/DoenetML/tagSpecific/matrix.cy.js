import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Matrix Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("no arguments, 0x0 matrix", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>A: <matrix name="A" /></p>
    <p>Copy 1: <matrix name="A1" copySource="A" /></p>
    <p>Copy 2: <matrix name="A2" copySource="A.value" /></p>
    <p>Copy 3: <copy source="A" assignNames="A3" /></p>
    <p>Copy 4: <copy source="A.value" assignNames="A4" /></p>
    <p>Copy 5: <matrix name="A5">$A</matrix></p>
    <p>Copy 6: <matrix name="A6">$A.value</matrix></p>
    <p>Copy 7: <matrix name="A7"><matrix copySource="A1" /></matrix></p>
    <p>Copy 8: <matrix name="A8"><matrix copySource="A1.value" /></matrix></p>
    <p>Modify: <matrixInput bindValueTo="$A" name="mi" /></p>
    <p>Modify copy 1: <matrixInput bindValueTo="$A1" name="mi1" /></p>
    <p>Modify copy 2: <matrixInput bindValueTo="$A2" name="mi2" /></p>
    <p>Modify copy 3: <matrixInput bindValueTo="$A3" name="mi3" /></p>
    <p>Modify copy 4: <matrixInput bindValueTo="$A4" name="mi4" /></p>
    <p>Modify copy 5: <matrixInput bindValueTo="$A5" name="mi5" /></p>
    <p>Modify copy 6: <matrixInput bindValueTo="$A6" name="mi6" /></p>
    <p>Modify copy 7: <matrixInput bindValueTo="$A7" name="mi7" /></p>
    <p>Modify copy 8: <matrixInput bindValueTo="$A8" name="mi8" /></p>
    <p>Size: <numberList copySource="A.matrixSize" name="matrixSize" />, 
      numRows: <integer copySource="A.numRows" name="numRows" />,
      numColumns: <integer copySource="A.numColumns" name="numColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      numRows 1: <integer copySource="A1.numRows" name="numRows1" />,
      numColumns 1: <integer copySource="A1.numColumns" name="numColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      numRows 2: <integer copySource="A2.numRows" name="numRows2" />,
      numColumns 2: <integer copySource="A2.numColumns" name="numColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      numRows 3: <integer copySource="A3.numRows" name="numRows3" />,
      numColumns 3: <integer copySource="A3.numColumns" name="numColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      numRows 4: <integer copySource="A4.numRows" name="numRows4" />,
      numColumns 4: <integer copySource="A4.numColumns" name="numColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      numRows 5: <integer copySource="A5.numRows" name="numRows5" />,
      numColumns 5: <integer copySource="A5.numColumns" name="numColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      numRows 6: <integer copySource="A6.numRows" name="numRows6" />,
      numColumns 6: <integer copySource="A6.numColumns" name="numColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      numRows 7: <integer copySource="A7.numRows" name="numRows7" />,
      numColumns 7: <integer copySource="A7.numColumns" name="numColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      numRows 8: <integer copySource="A8.numRows" name="numRows8" />,
      numColumns 8: <integer copySource="A8.numColumns" name="numColumns8" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[]");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "not.exist",
    );

    cy.get(cesc("#\\/matrixSize")).should("have.text", "0, 0");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "0, 0");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "0, 0");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "0, 0");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "0, 0");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "0, 0");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "0, 0");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "0, 0");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "0, 0");

    cy.get(cesc("#\\/numRows")).should("have.text", "0");
    cy.get(cesc("#\\/numRows1")).should("have.text", "0");
    cy.get(cesc("#\\/numRows2")).should("have.text", "0");
    cy.get(cesc("#\\/numRows3")).should("have.text", "0");
    cy.get(cesc("#\\/numRows4")).should("have.text", "0");
    cy.get(cesc("#\\/numRows5")).should("have.text", "0");
    cy.get(cesc("#\\/numRows6")).should("have.text", "0");
    cy.get(cesc("#\\/numRows7")).should("have.text", "0");
    cy.get(cesc("#\\/numRows8")).should("have.text", "0");

    cy.get(cesc("#\\/numColumns")).should("have.text", "0");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "0");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "0");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "0");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "0");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "0");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "0");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "0");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]];
      let matrixValue = [];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([0, 0]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });
  });

  it("specify numRows, get 1 column, 2x1 matrix of 0s", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>A: <matrix name="A" numRows="2" /></p>
    <p>Copy 1: <matrix name="A1" copySource="A" /></p>
    <p>Copy 2: <matrix name="A2" copySource="A.value" /></p>
    <p>Copy 3: <copy source="A" assignNames="A3" /></p>
    <p>Copy 4: <copy source="A.value" assignNames="A4" /></p>
    <p>Copy 5: <matrix name="A5">$A</matrix></p>
    <p>Copy 6: <matrix name="A6">$A.value</matrix></p>
    <p>Copy 7: <matrix name="A7"><matrix copySource="A1" /></matrix></p>
    <p>Copy 8: <matrix name="A8"><matrix copySource="A1.value" /></matrix></p>
    <p>Modify: <matrixInput bindValueTo="$A" name="mi" /></p>
    <p>Modify copy 1: <matrixInput bindValueTo="$A1" name="mi1" /></p>
    <p>Modify copy 2: <matrixInput bindValueTo="$A2" name="mi2" /></p>
    <p>Modify copy 3: <matrixInput bindValueTo="$A3" name="mi3" /></p>
    <p>Modify copy 4: <matrixInput bindValueTo="$A4" name="mi4" /></p>
    <p>Modify copy 5: <matrixInput bindValueTo="$A5" name="mi5" /></p>
    <p>Modify copy 6: <matrixInput bindValueTo="$A6" name="mi6" /></p>
    <p>Modify copy 7: <matrixInput bindValueTo="$A7" name="mi7" /></p>
    <p>Modify copy 8: <matrixInput bindValueTo="$A8" name="mi8" /></p>
    <p>Size: <numberList copySource="A.matrixSize" name="matrixSize" />, 
      numRows: <integer copySource="A.numRows" name="numRows" />,
      numColumns: <integer copySource="A.numColumns" name="numColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      numRows 1: <integer copySource="A1.numRows" name="numRows1" />,
      numColumns 1: <integer copySource="A1.numColumns" name="numColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      numRows 2: <integer copySource="A2.numRows" name="numRows2" />,
      numColumns 2: <integer copySource="A2.numColumns" name="numColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      numRows 3: <integer copySource="A3.numRows" name="numRows3" />,
      numColumns 3: <integer copySource="A3.numColumns" name="numColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      numRows 4: <integer copySource="A4.numRows" name="numRows4" />,
      numColumns 4: <integer copySource="A4.numColumns" name="numColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      numRows 5: <integer copySource="A5.numRows" name="numRows5" />,
      numColumns 5: <integer copySource="A5.numColumns" name="numColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      numRows 6: <integer copySource="A6.numRows" name="numRows6" />,
      numColumns 6: <integer copySource="A6.numColumns" name="numColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      numRows 7: <integer copySource="A7.numRows" name="numRows7" />,
      numColumns 7: <integer copySource="A7.numColumns" name="numColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      numRows 8: <integer copySource="A8.numRows" name="numRows8" />,
      numColumns 8: <integer copySource="A8.numColumns" name="numColumns8" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "2, 1");

    cy.get(cesc("#\\/numRows")).should("have.text", "2");
    cy.get(cesc("#\\/numRows1")).should("have.text", "2");
    cy.get(cesc("#\\/numRows2")).should("have.text", "2");
    cy.get(cesc("#\\/numRows3")).should("have.text", "2");
    cy.get(cesc("#\\/numRows4")).should("have.text", "2");
    cy.get(cesc("#\\/numRows5")).should("have.text", "2");
    cy.get(cesc("#\\/numRows6")).should("have.text", "2");
    cy.get(cesc("#\\/numRows7")).should("have.text", "2");
    cy.get(cesc("#\\/numRows8")).should("have.text", "2");

    cy.get(cesc("#\\/numColumns")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", 0], ["tuple", 0]],
      ];
      let matrixValue = [[0], [0]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value");

    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}x{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea")
      .type("{end}{backspace}y{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[xy]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "x"], ["tuple", "y"]],
      ];
      let matrixValue = [["x"], ["y"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("cannot add rows or columns");

    cy.get(cesc("#\\/mi_rowIncrement")).click();
    cy.get(cesc("#\\/mi_columnIncrement")).click();

    cy.log("change value so know that core has responded");
    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}1{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[1y]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "2, 1");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "2, 1");

    cy.get(cesc("#\\/numRows")).should("have.text", "2");
    cy.get(cesc("#\\/numRows1")).should("have.text", "2");
    cy.get(cesc("#\\/numRows2")).should("have.text", "2");
    cy.get(cesc("#\\/numRows3")).should("have.text", "2");
    cy.get(cesc("#\\/numRows4")).should("have.text", "2");
    cy.get(cesc("#\\/numRows5")).should("have.text", "2");
    cy.get(cesc("#\\/numRows6")).should("have.text", "2");
    cy.get(cesc("#\\/numRows7")).should("have.text", "2");
    cy.get(cesc("#\\/numRows8")).should("have.text", "2");

    cy.get(cesc("#\\/numColumns")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", 1], ["tuple", "y"]],
      ];
      let matrixValue = [[1], ["y"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value 2,3");

    cy.get(cesc("#\\/mi2_component_0_0") + " textarea")
      .type("{end}{backspace}a{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_1_0") + " textarea")
      .type("{end}{backspace}b{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[ab]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "a"], ["tuple", "b"]],
      ];
      let matrixValue = [["a"], ["b"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value 4,5");

    cy.get(cesc("#\\/mi4_component_0_0") + " textarea")
      .type("{end}{backspace}c{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_1_0") + " textarea")
      .type("{end}{backspace}d{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[cd]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "c"], ["tuple", "d"]],
      ];
      let matrixValue = [["c"], ["d"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value 6,7");

    cy.get(cesc("#\\/mi6_component_0_0") + " textarea")
      .type("{end}{backspace}e{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi7_component_1_0") + " textarea")
      .type("{end}{backspace}f{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      let matrixValue = [["e"], ["f"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value 8, orig");

    cy.get(cesc("#\\/mi8_component_0_0") + " textarea")
      .type("{end}{backspace}g{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_1_0") + " textarea")
      .type("{end}{backspace}h{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[gh]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "g"], ["tuple", "h"]],
      ];
      let matrixValue = [["g"], ["h"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });
  });

  it("specify numColumns, get 1 row, 1x2 matrix of zeros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>A: <matrix name="A" numColumns="2" /></p>
    <p>Copy 1: <matrix name="A1" copySource="A" /></p>
    <p>Copy 2: <matrix name="A2" copySource="A.value" /></p>
    <p>Copy 3: <copy source="A" assignNames="A3" /></p>
    <p>Copy 4: <copy source="A.value" assignNames="A4" /></p>
    <p>Copy 5: <matrix name="A5">$A</matrix></p>
    <p>Copy 6: <matrix name="A6">$A.value</matrix></p>
    <p>Copy 7: <matrix name="A7"><matrix copySource="A1" /></matrix></p>
    <p>Copy 8: <matrix name="A8"><matrix copySource="A1.value" /></matrix></p>
    <p>Modify: <matrixInput bindValueTo="$A" name="mi" /></p>
    <p>Modify copy 1: <matrixInput bindValueTo="$A1" name="mi1" /></p>
    <p>Modify copy 2: <matrixInput bindValueTo="$A2" name="mi2" /></p>
    <p>Modify copy 3: <matrixInput bindValueTo="$A3" name="mi3" /></p>
    <p>Modify copy 4: <matrixInput bindValueTo="$A4" name="mi4" /></p>
    <p>Modify copy 5: <matrixInput bindValueTo="$A5" name="mi5" /></p>
    <p>Modify copy 6: <matrixInput bindValueTo="$A6" name="mi6" /></p>
    <p>Modify copy 7: <matrixInput bindValueTo="$A7" name="mi7" /></p>
    <p>Modify copy 8: <matrixInput bindValueTo="$A8" name="mi8" /></p>
    <p>Size: <numberList copySource="A.matrixSize" name="matrixSize" />, 
      numRows: <integer copySource="A.numRows" name="numRows" />,
      numColumns: <integer copySource="A.numColumns" name="numColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      numRows 1: <integer copySource="A1.numRows" name="numRows1" />,
      numColumns 1: <integer copySource="A1.numColumns" name="numColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      numRows 2: <integer copySource="A2.numRows" name="numRows2" />,
      numColumns 2: <integer copySource="A2.numColumns" name="numColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      numRows 3: <integer copySource="A3.numRows" name="numRows3" />,
      numColumns 3: <integer copySource="A3.numColumns" name="numColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      numRows 4: <integer copySource="A4.numRows" name="numRows4" />,
      numColumns 4: <integer copySource="A4.numColumns" name="numColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      numRows 5: <integer copySource="A5.numRows" name="numRows5" />,
      numColumns 5: <integer copySource="A5.numColumns" name="numColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      numRows 6: <integer copySource="A6.numRows" name="numRows6" />,
      numColumns 6: <integer copySource="A6.numColumns" name="numColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      numRows 7: <integer copySource="A7.numRows" name="numRows7" />,
      numColumns 7: <integer copySource="A7.numColumns" name="numColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      numRows 8: <integer copySource="A8.numRows" name="numRows8" />,
      numColumns 8: <integer copySource="A8.numColumns" name="numColumns8" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[00]");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "1, 2");

    cy.get(cesc("#\\/numRows")).should("have.text", "1");
    cy.get(cesc("#\\/numRows1")).should("have.text", "1");
    cy.get(cesc("#\\/numRows2")).should("have.text", "1");
    cy.get(cesc("#\\/numRows3")).should("have.text", "1");
    cy.get(cesc("#\\/numRows4")).should("have.text", "1");
    cy.get(cesc("#\\/numRows5")).should("have.text", "1");
    cy.get(cesc("#\\/numRows6")).should("have.text", "1");
    cy.get(cesc("#\\/numRows7")).should("have.text", "1");
    cy.get(cesc("#\\/numRows8")).should("have.text", "1");

    cy.get(cesc("#\\/numColumns")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 0, 0]]];
      let matrixValue = [[0, 0]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value");

    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}x{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea")
      .type("{end}{backspace}y{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[xy]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "x", "y"]],
      ];
      let matrixValue = [["x", "y"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("cannot add rows or columns");

    cy.get(cesc("#\\/mi_rowIncrement")).click();
    cy.get(cesc("#\\/mi_columnIncrement")).click();

    cy.log("change value so know that core has responded");
    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}1{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[1y]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1y]");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "1, 2");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "1, 2");

    cy.get(cesc("#\\/numRows")).should("have.text", "1");
    cy.get(cesc("#\\/numRows1")).should("have.text", "1");
    cy.get(cesc("#\\/numRows2")).should("have.text", "1");
    cy.get(cesc("#\\/numRows3")).should("have.text", "1");
    cy.get(cesc("#\\/numRows4")).should("have.text", "1");
    cy.get(cesc("#\\/numRows5")).should("have.text", "1");
    cy.get(cesc("#\\/numRows6")).should("have.text", "1");
    cy.get(cesc("#\\/numRows7")).should("have.text", "1");
    cy.get(cesc("#\\/numRows8")).should("have.text", "1");

    cy.get(cesc("#\\/numColumns")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 1, "y"]]];
      let matrixValue = [[1, "y"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value 2,3");

    cy.get(cesc("#\\/mi2_component_0_0") + " textarea")
      .type("{end}{backspace}a{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_0_1") + " textarea")
      .type("{end}{backspace}b{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[ab]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "a", "b"]],
      ];
      let matrixValue = [["a", "b"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value 4,5");

    cy.get(cesc("#\\/mi4_component_0_0") + " textarea")
      .type("{end}{backspace}c{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_0_1") + " textarea")
      .type("{end}{backspace}d{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[cd]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[cd]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "c", "d"]],
      ];
      let matrixValue = [["c", "d"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value 6,7");

    cy.get(cesc("#\\/mi6_component_0_0") + " textarea")
      .type("{end}{backspace}e{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi7_component_0_1") + " textarea")
      .type("{end}{backspace}f{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "f"]],
      ];
      let matrixValue = [["e", "f"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value 8, orig");

    cy.get(cesc("#\\/mi8_component_0_0") + " textarea")
      .type("{end}{backspace}g{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_0_1") + " textarea")
      .type("{end}{backspace}h{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[gh]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[gh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "g", "h"]],
      ];
      let matrixValue = [["g", "h"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });
  });

  it("with string/math children get 1x1 matrix", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>A: <matrix name="A" >2<math>x</math></matrix></p>
    <p>Copy 1: <matrix name="A1" copySource="A" /></p>
    <p>Copy 2: <matrix name="A2" copySource="A.value" /></p>
    <p>Copy 3: <copy source="A" assignNames="A3" /></p>
    <p>Copy 4: <copy source="A.value" assignNames="A4" /></p>
    <p>Copy 5: <matrix name="A5">$A</matrix></p>
    <p>Copy 6: <matrix name="A6">$A.value</matrix></p>
    <p>Copy 7: <matrix name="A7"><matrix copySource="A1" /></matrix></p>
    <p>Copy 8: <matrix name="A8"><matrix copySource="A1.value" /></matrix></p>
    <p>Modify: <matrixInput bindValueTo="$A" name="mi" /></p>
    <p>Modify copy 1: <matrixInput bindValueTo="$A1" name="mi1" /></p>
    <p>Modify copy 2: <matrixInput bindValueTo="$A2" name="mi2" /></p>
    <p>Modify copy 3: <matrixInput bindValueTo="$A3" name="mi3" /></p>
    <p>Modify copy 4: <matrixInput bindValueTo="$A4" name="mi4" /></p>
    <p>Modify copy 5: <matrixInput bindValueTo="$A5" name="mi5" /></p>
    <p>Modify copy 6: <matrixInput bindValueTo="$A6" name="mi6" /></p>
    <p>Modify copy 7: <matrixInput bindValueTo="$A7" name="mi7" /></p>
    <p>Modify copy 8: <matrixInput bindValueTo="$A8" name="mi8" /></p>
    <p>Size: <numberList copySource="A.matrixSize" name="matrixSize" />, 
      numRows: <integer copySource="A.numRows" name="numRows" />,
      numColumns: <integer copySource="A.numColumns" name="numColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      numRows 1: <integer copySource="A1.numRows" name="numRows1" />,
      numColumns 1: <integer copySource="A1.numColumns" name="numColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      numRows 2: <integer copySource="A2.numRows" name="numRows2" />,
      numColumns 2: <integer copySource="A2.numColumns" name="numColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      numRows 3: <integer copySource="A3.numRows" name="numRows3" />,
      numColumns 3: <integer copySource="A3.numColumns" name="numColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      numRows 4: <integer copySource="A4.numRows" name="numRows4" />,
      numColumns 4: <integer copySource="A4.numColumns" name="numColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      numRows 5: <integer copySource="A5.numRows" name="numRows5" />,
      numColumns 5: <integer copySource="A5.numColumns" name="numColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      numRows 6: <integer copySource="A6.numRows" name="numRows6" />,
      numColumns 6: <integer copySource="A6.numColumns" name="numColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      numRows 7: <integer copySource="A7.numRows" name="numRows7" />,
      numColumns 7: <integer copySource="A7.numColumns" name="numColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      numRows 8: <integer copySource="A8.numRows" name="numRows8" />,
      numColumns 8: <integer copySource="A8.numColumns" name="numColumns8" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2x]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2x]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2x]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2x]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2x]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2x]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2x]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2x]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2x]");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "1, 1");

    cy.get(cesc("#\\/numRows")).should("have.text", "1");
    cy.get(cesc("#\\/numRows1")).should("have.text", "1");
    cy.get(cesc("#\\/numRows2")).should("have.text", "1");
    cy.get(cesc("#\\/numRows3")).should("have.text", "1");
    cy.get(cesc("#\\/numRows4")).should("have.text", "1");
    cy.get(cesc("#\\/numRows5")).should("have.text", "1");
    cy.get(cesc("#\\/numRows6")).should("have.text", "1");
    cy.get(cesc("#\\/numRows7")).should("have.text", "1");
    cy.get(cesc("#\\/numRows8")).should("have.text", "1");

    cy.get(cesc("#\\/numColumns")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", ["*", 2, "x"]]],
      ];
      let matrixValue = [[["*", 2, "x"]]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 1]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value");

    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}y{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[2y]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2y]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2y]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2y]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2y]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2y]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2y]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2y]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2y]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2y]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", ["*", 2, "y"]]],
      ];
      let matrixValue = [[["*", 2, "y"]]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 1]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("cannot add rows or columns");

    cy.get(cesc("#\\/mi_rowIncrement")).click();
    cy.get(cesc("#\\/mi_columnIncrement")).click();

    cy.log("change value so know that core has responded");
    cy.get(cesc("#\\/mi3_component_0_0") + " textarea")
      .type("{end}{backspace}z{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[2z]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2z]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2z]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2z]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2z]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2z]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2z]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2z]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2z]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2z]");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "1, 1");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "1, 1");

    cy.get(cesc("#\\/numRows")).should("have.text", "1");
    cy.get(cesc("#\\/numRows1")).should("have.text", "1");
    cy.get(cesc("#\\/numRows2")).should("have.text", "1");
    cy.get(cesc("#\\/numRows3")).should("have.text", "1");
    cy.get(cesc("#\\/numRows4")).should("have.text", "1");
    cy.get(cesc("#\\/numRows5")).should("have.text", "1");
    cy.get(cesc("#\\/numRows6")).should("have.text", "1");
    cy.get(cesc("#\\/numRows7")).should("have.text", "1");
    cy.get(cesc("#\\/numRows8")).should("have.text", "1");

    cy.get(cesc("#\\/numColumns")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "1");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", ["*", 2, "z"]]],
      ];
      let matrixValue = [[["*", 2, "z"]]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 1]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });
  });

  it("functionSymbols", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p><matrix name="Adef">
      <row>f(x) g(x)</row>
      <row>h(x) a(x)</row>
    </matrix>
    </p>
    <p><matrix name="Ah" functionSymbols="h">
      <row>f(x) g(x)</row>
      <row>h(x) a(x)</row>
    </matrix>
    </p>
    <p><matrix name="Amixedbyrow" functionSymbols="h a">
      <row><math functionSymbols="g">h(x)</math> <math functionSymbols="g">g(x)</math> a(x)</row>
      <row functionSymbols="h">h(x) a(x) <math functionSymbols="b">b(x)</math></row>
    </matrix>
    </p>
    <p><matrix name="Amixedbycolumn" functionSymbols="h a">
      <column><math functionSymbols="g">h(x)</math> <math functionSymbols="g">g(x)</math> a(x)</column>
      <column functionSymbols="h">h(x) a(x) <math functionSymbols="b">b(x)</math></column>
    </matrix>
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/Adef") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[f(x)g(x)hxax]");
    cy.get(cesc2("#/Ah") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[fxgxh(x)ax]");
    cy.get(cesc2("#/Amixedbyrow") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[hxg(x)a(x)h(x)axb(x)]");
    cy.get(cesc2("#/Amixedbycolumn") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣hxh(x)g(x)axa(x)b(x)⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixdefAst = [
        "matrix",
        ["tuple", 2, 2],
        [
          "tuple",
          ["tuple", ["apply", "f", "x"], ["apply", "g", "x"]],
          ["tuple", ["*", "h", "x"], ["*", "a", "x"]],
        ],
      ];
      let matrixhAst = [
        "matrix",
        ["tuple", 2, 2],
        [
          "tuple",
          ["tuple", ["*", "f", "x"], ["*", "g", "x"]],
          ["tuple", ["apply", "h", "x"], ["*", "a", "x"]],
        ],
      ];
      let matrixmixedbyrowAst = [
        "matrix",
        ["tuple", 2, 3],
        [
          "tuple",
          ["tuple", ["*", "h", "x"], ["apply", "g", "x"], ["apply", "a", "x"]],
          ["tuple", ["apply", "h", "x"], ["*", "a", "x"], ["apply", "b", "x"]],
        ],
      ];
      let matrixmixedbycolumnAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", ["*", "h", "x"], ["apply", "h", "x"]],
          ["tuple", ["apply", "g", "x"], ["*", "a", "x"]],
          ["tuple", ["apply", "a", "x"], ["apply", "b", "x"]],
        ],
      ];
      expect(stateVariables["/Adef"].stateValues.value).eqls(matrixdefAst);
      expect(stateVariables["/Ah"].stateValues.value).eqls(matrixhAst);
      expect(stateVariables["/Amixedbyrow"].stateValues.value).eqls(
        matrixmixedbyrowAst,
      );
      expect(stateVariables["/Amixedbycolumn"].stateValues.value).eqls(
        matrixmixedbycolumnAst,
      );
    });
  });

  it("sourcesAreFunctionSymbols", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <math name="fun1">f</math>
      <math name="fun2">g</math>
      <math name="fun3">h</math>
      <math name="fun4">a</math>
      <math name="fun5">b</math>
    </setup>
    <p><matrix name="Adef">
      <row>$fun1(x) $fun2(x)</row>
      <row>$fun3(x) $fun4(x)</row>
    </matrix>
    </p>
    <p><matrix name="Ah" sourcesAreFunctionSymbols="fun1 fun4">
      <row>$fun1(x) $fun2(x)</row>
      <row>$fun3(x) $fun4(x)</row>
    </matrix>
    </p>
    <p><matrix name="Amixedbyrow" sourcesAreFunctionSymbols="fun3 fun4">
      <row><math sourcesAreFunctionSymbols="fun2">$fun3(x)</math> <math sourcesAreFunctionSymbols="fun2">$fun2(x)</math> $fun4(x)</row>
      <row sourcesAreFunctionSymbols="fun3">$fun3(x) $fun4(x) <math sourcesAreFunctionSymbols="fun5">$fun5(x)</math></row>
    </matrix>
    </p>
    <p><matrix name="Amixedbycolumn" sourcesAreFunctionSymbols="fun3 fun4">
      <column><math sourcesAreFunctionSymbols="fun2">h(x)</math> <math sourcesAreFunctionSymbols="fun2">$fun2(x)</math> $fun4(x)</column>
      <column sourcesAreFunctionSymbols="fun3">$fun3(x) $fun4(x) <math sourcesAreFunctionSymbols="fun5">$fun5(x)</math></column>
    </matrix>
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/Adef") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[fxgxhxax]");
    cy.get(cesc2("#/Ah") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[f(x)gxhxa(x)]");
    cy.get(cesc2("#/Amixedbyrow") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[hxg(x)a(x)h(x)axb(x)]");
    cy.get(cesc2("#/Amixedbycolumn") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣hxh(x)g(x)axa(x)b(x)⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixdefAst = [
        "matrix",
        ["tuple", 2, 2],
        [
          "tuple",
          ["tuple", ["*", "f", "x"], ["*", "g", "x"]],
          ["tuple", ["*", "h", "x"], ["*", "a", "x"]],
        ],
      ];
      let matrixhAst = [
        "matrix",
        ["tuple", 2, 2],
        [
          "tuple",
          ["tuple", ["apply", "f", "x"], ["*", "g", "x"]],
          ["tuple", ["*", "h", "x"], ["apply", "a", "x"]],
        ],
      ];
      let matrixmixedbyrowAst = [
        "matrix",
        ["tuple", 2, 3],
        [
          "tuple",
          ["tuple", ["*", "h", "x"], ["apply", "g", "x"], ["apply", "a", "x"]],
          ["tuple", ["apply", "h", "x"], ["*", "a", "x"], ["apply", "b", "x"]],
        ],
      ];
      let matrixmixedbycolumnAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", ["*", "h", "x"], ["apply", "h", "x"]],
          ["tuple", ["apply", "g", "x"], ["*", "a", "x"]],
          ["tuple", ["apply", "a", "x"], ["apply", "b", "x"]],
        ],
      ];
      expect(stateVariables["/Adef"].stateValues.value).eqls(matrixdefAst);
      expect(stateVariables["/Ah"].stateValues.value).eqls(matrixhAst);
      expect(stateVariables["/Amixedbyrow"].stateValues.value).eqls(
        matrixmixedbyrowAst,
      );
      expect(stateVariables["/Amixedbycolumn"].stateValues.value).eqls(
        matrixmixedbycolumnAst,
      );
    });
  });

  it("splitsymbols", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p><matrix name="Adef">
      <row>xy yz</row>
      <row>ab bc</row>
    </matrix>
    </p>
    <p><matrix name="Ah" splitSymbols="false">
    <row>xy yz</row>
    <row>ab bc</row>
    </matrix>
    </p>
    <p><matrix name="Amixedbyrow" splitSymbols="false">
      <row>xy <math splitSymbols>yz</math> <math>zx</math></row>
      <row splitSymbols>ab <math splitSymbols="false">bc</math> <math>ca</math></row>
    </matrix>
    </p>
    <p><matrix name="Amixedbycolumn" splitSymbols="false">
    <column>xy <math splitSymbols>yz</math> <math>zx</math></column>
    <column splitSymbols>ab <math splitSymbols="false">bc</math> <math>ca</math></column>
    </matrix>
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/Adef") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyyzabbc]");
    cy.get(cesc2("#/Ah") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyyzabbc]");
    cy.get(cesc2("#/Amixedbyrow") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyyzzxabbcca]");
    cy.get(cesc2("#/Amixedbycolumn") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyabyzbczxca⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixdefAst = [
        "matrix",
        ["tuple", 2, 2],
        [
          "tuple",
          ["tuple", ["*", "x", "y"], ["*", "y", "z"]],
          ["tuple", ["*", "a", "b"], ["*", "b", "c"]],
        ],
      ];
      let matrixnAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "xy", "yz"], ["tuple", "ab", "bc"]],
      ];
      let matrixmixedbyrowAst = [
        "matrix",
        ["tuple", 2, 3],
        [
          "tuple",
          ["tuple", "xy", ["*", "y", "z"], "zx"],
          ["tuple", ["*", "a", "b"], "bc", ["*", "c", "a"]],
        ],
      ];
      let matrixmixedbycolumnAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "xy", ["*", "a", "b"]],
          ["tuple", ["*", "y", "z"], "bc"],
          ["tuple", "zx", ["*", "c", "a"]],
        ],
      ];
      expect(stateVariables["/Adef"].stateValues.value).eqls(matrixdefAst);
      expect(stateVariables["/Ah"].stateValues.value).eqls(matrixnAst);
      expect(stateVariables["/Amixedbyrow"].stateValues.value).eqls(
        matrixmixedbyrowAst,
      );
      expect(stateVariables["/Amixedbycolumn"].stateValues.value).eqls(
        matrixmixedbycolumnAst,
      );
    });
  });

  it("displayBlanks", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p><matrix name="Adef">
      <row>x_ y_</row>
      <row>a_ b_</row>
    </matrix>
    </p>
    <p><matrix name="Ah" displayBlanks="false">
    <row>x_ y_</row>
    <row>a_ b_</row>
    </matrix>
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/Adef") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[x＿y＿a＿b＿]");
    cy.get(cesc2("#/Ah") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyab]");
  });

  it("2x3 matrix by rows", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>A: <matrix name="A" >
      <row>a b c</row>
      <row>d e f</row>
    </matrix>
    </p>
    <p>Copy 1: <matrix name="A1" copySource="A" /></p>
    <p>Copy 2: <matrix name="A2" copySource="A.value" /></p>
    <p>Copy 3: <copy source="A" assignNames="A3" /></p>
    <p>Copy 4: <copy source="A.value" assignNames="A4" /></p>
    <p>Copy 5: <matrix name="A5">$A</matrix></p>
    <p>Copy 6: <matrix name="A6">$A.value</matrix></p>
    <p>Copy 7: <matrix name="A7"><matrix copySource="A1" /></matrix></p>
    <p>Copy 8: <matrix name="A8"><matrix copySource="A1.value" /></matrix></p>
    <p>Modify: <matrixInput bindValueTo="$A" name="mi" /></p>
    <p>Modify copy 1: <matrixInput bindValueTo="$A1" name="mi1" /></p>
    <p>Modify copy 2: <matrixInput bindValueTo="$A2" name="mi2" /></p>
    <p>Modify copy 3: <matrixInput bindValueTo="$A3" name="mi3" /></p>
    <p>Modify copy 4: <matrixInput bindValueTo="$A4" name="mi4" /></p>
    <p>Modify copy 5: <matrixInput bindValueTo="$A5" name="mi5" /></p>
    <p>Modify copy 6: <matrixInput bindValueTo="$A6" name="mi6" /></p>
    <p>Modify copy 7: <matrixInput bindValueTo="$A7" name="mi7" /></p>
    <p>Modify copy 8: <matrixInput bindValueTo="$A8" name="mi8" /></p>
    <p>Size: <numberList copySource="A.matrixSize" name="matrixSize" />, 
      numRows: <integer copySource="A.numRows" name="numRows" />,
      numColumns: <integer copySource="A.numColumns" name="numColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      numRows 1: <integer copySource="A1.numRows" name="numRows1" />,
      numColumns 1: <integer copySource="A1.numColumns" name="numColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      numRows 2: <integer copySource="A2.numRows" name="numRows2" />,
      numColumns 2: <integer copySource="A2.numColumns" name="numColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      numRows 3: <integer copySource="A3.numRows" name="numRows3" />,
      numColumns 3: <integer copySource="A3.numColumns" name="numColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      numRows 4: <integer copySource="A4.numRows" name="numRows4" />,
      numColumns 4: <integer copySource="A4.numColumns" name="numColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      numRows 5: <integer copySource="A5.numRows" name="numRows5" />,
      numColumns 5: <integer copySource="A5.numColumns" name="numColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      numRows 6: <integer copySource="A6.numRows" name="numRows6" />,
      numColumns 6: <integer copySource="A6.numColumns" name="numColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      numRows 7: <integer copySource="A7.numRows" name="numRows7" />,
      numColumns 7: <integer copySource="A7.numColumns" name="numColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      numRows 8: <integer copySource="A8.numRows" name="numRows8" />,
      numColumns 8: <integer copySource="A8.numColumns" name="numColumns8" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc("#\\/matrixSize")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "2, 3");

    cy.get(cesc("#\\/numRows")).should("have.text", "2");
    cy.get(cesc("#\\/numRows1")).should("have.text", "2");
    cy.get(cesc("#\\/numRows2")).should("have.text", "2");
    cy.get(cesc("#\\/numRows3")).should("have.text", "2");
    cy.get(cesc("#\\/numRows4")).should("have.text", "2");
    cy.get(cesc("#\\/numRows5")).should("have.text", "2");
    cy.get(cesc("#\\/numRows6")).should("have.text", "2");
    cy.get(cesc("#\\/numRows7")).should("have.text", "2");
    cy.get(cesc("#\\/numRows8")).should("have.text", "2");

    cy.get(cesc("#\\/numColumns")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 3],
        ["tuple", ["tuple", "a", "b", "c"], ["tuple", "d", "e", "f"]],
      ];
      let matrixValue = [
        ["a", "b", "c"],
        ["d", "e", "f"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value");

    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}x{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_0_1") + " textarea")
      .type("{end}{backspace}y{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_0_2") + " textarea")
      .type("{end}{backspace}z{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_1_0") + " textarea")
      .type("{end}{backspace}u{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_1_1") + " textarea")
      .type("{end}{backspace}v{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_1_2") + " textarea")
      .type("{end}{backspace}w{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[xyzuvw]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 3],
        ["tuple", ["tuple", "x", "y", "z"], ["tuple", "u", "v", "w"]],
      ];
      let matrixValue = [
        ["x", "y", "z"],
        ["u", "v", "w"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("cannot remove rows or columns");

    cy.get(cesc("#\\/mi_rowDecrement")).click();
    cy.get(cesc("#\\/mi_columnDecrement")).click();

    cy.log("change value so know that core has responded");
    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}1{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[1yzuvw]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc("#\\/matrixSize")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "2, 3");

    cy.get(cesc("#\\/numRows")).should("have.text", "2");
    cy.get(cesc("#\\/numRows1")).should("have.text", "2");
    cy.get(cesc("#\\/numRows2")).should("have.text", "2");
    cy.get(cesc("#\\/numRows3")).should("have.text", "2");
    cy.get(cesc("#\\/numRows4")).should("have.text", "2");
    cy.get(cesc("#\\/numRows5")).should("have.text", "2");
    cy.get(cesc("#\\/numRows6")).should("have.text", "2");
    cy.get(cesc("#\\/numRows7")).should("have.text", "2");
    cy.get(cesc("#\\/numRows8")).should("have.text", "2");

    cy.get(cesc("#\\/numColumns")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 3],
        ["tuple", ["tuple", 1, "y", "z"], ["tuple", "u", "v", "w"]],
      ];
      let matrixValue = [
        [1, "y", "z"],
        ["u", "v", "w"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value, 1-4");

    cy.get(cesc("#\\/mi1_component_0_0") + " textarea")
      .type("{end}{backspace}m{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_0_1") + " textarea")
      .type("{end}{backspace}n{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_0_2") + " textarea")
      .type("{end}{backspace}o{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_1_0") + " textarea")
      .type("{end}{backspace}p{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea")
      .type("{end}{backspace}q{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_1_2") + " textarea")
      .type("{end}{backspace}r{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[mnopqr]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 3],
        ["tuple", ["tuple", "m", "n", "o"], ["tuple", "p", "q", "r"]],
      ];
      let matrixValue = [
        ["m", "n", "o"],
        ["p", "q", "r"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value, 5-8");

    cy.get(cesc("#\\/mi5_component_0_0") + " textarea")
      .type("{end}{backspace}s{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_0_1") + " textarea")
      .type("{end}{backspace}t{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi7_component_0_2") + " textarea")
      .type("{end}{backspace}u{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi8_component_1_0") + " textarea")
      .type("{end}{backspace}v{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_1_1") + " textarea")
      .type("{end}{backspace}w{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_1_2") + " textarea")
      .type("{end}{backspace}x{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[stuvwx]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 3],
        ["tuple", ["tuple", "s", "t", "u"], ["tuple", "v", "w", "x"]],
      ];
      let matrixValue = [
        ["s", "t", "u"],
        ["v", "w", "x"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });
  });

  it("2x3 matrix by columns", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>A: <matrix name="A" >
      <column>a d</column>
      <column>b e</column>
      <column>c f</column>
    </matrix>
    </p>
    <p>Copy 1: <matrix name="A1" copySource="A" /></p>
    <p>Copy 2: <matrix name="A2" copySource="A.value" /></p>
    <p>Copy 3: <copy source="A" assignNames="A3" /></p>
    <p>Copy 4: <copy source="A.value" assignNames="A4" /></p>
    <p>Copy 5: <matrix name="A5">$A</matrix></p>
    <p>Copy 6: <matrix name="A6">$A.value</matrix></p>
    <p>Copy 7: <matrix name="A7"><matrix copySource="A1" /></matrix></p>
    <p>Copy 8: <matrix name="A8"><matrix copySource="A1.value" /></matrix></p>
    <p>Modify: <matrixInput bindValueTo="$A" name="mi" /></p>
    <p>Modify copy 1: <matrixInput bindValueTo="$A1" name="mi1" /></p>
    <p>Modify copy 2: <matrixInput bindValueTo="$A2" name="mi2" /></p>
    <p>Modify copy 3: <matrixInput bindValueTo="$A3" name="mi3" /></p>
    <p>Modify copy 4: <matrixInput bindValueTo="$A4" name="mi4" /></p>
    <p>Modify copy 5: <matrixInput bindValueTo="$A5" name="mi5" /></p>
    <p>Modify copy 6: <matrixInput bindValueTo="$A6" name="mi6" /></p>
    <p>Modify copy 7: <matrixInput bindValueTo="$A7" name="mi7" /></p>
    <p>Modify copy 8: <matrixInput bindValueTo="$A8" name="mi8" /></p>
    <p>Size: <numberList copySource="A.matrixSize" name="matrixSize" />, 
      numRows: <integer copySource="A.numRows" name="numRows" />,
      numColumns: <integer copySource="A.numColumns" name="numColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      numRows 1: <integer copySource="A1.numRows" name="numRows1" />,
      numColumns 1: <integer copySource="A1.numColumns" name="numColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      numRows 2: <integer copySource="A2.numRows" name="numRows2" />,
      numColumns 2: <integer copySource="A2.numColumns" name="numColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      numRows 3: <integer copySource="A3.numRows" name="numRows3" />,
      numColumns 3: <integer copySource="A3.numColumns" name="numColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      numRows 4: <integer copySource="A4.numRows" name="numRows4" />,
      numColumns 4: <integer copySource="A4.numColumns" name="numColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      numRows 5: <integer copySource="A5.numRows" name="numRows5" />,
      numColumns 5: <integer copySource="A5.numColumns" name="numColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      numRows 6: <integer copySource="A6.numRows" name="numRows6" />,
      numColumns 6: <integer copySource="A6.numColumns" name="numColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      numRows 7: <integer copySource="A7.numRows" name="numRows7" />,
      numColumns 7: <integer copySource="A7.numColumns" name="numColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      numRows 8: <integer copySource="A8.numRows" name="numRows8" />,
      numColumns 8: <integer copySource="A8.numColumns" name="numColumns8" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[abcdef]");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "c",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "f",
    );

    cy.get(cesc("#\\/matrixSize")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "2, 3");

    cy.get(cesc("#\\/numRows")).should("have.text", "2");
    cy.get(cesc("#\\/numRows1")).should("have.text", "2");
    cy.get(cesc("#\\/numRows2")).should("have.text", "2");
    cy.get(cesc("#\\/numRows3")).should("have.text", "2");
    cy.get(cesc("#\\/numRows4")).should("have.text", "2");
    cy.get(cesc("#\\/numRows5")).should("have.text", "2");
    cy.get(cesc("#\\/numRows6")).should("have.text", "2");
    cy.get(cesc("#\\/numRows7")).should("have.text", "2");
    cy.get(cesc("#\\/numRows8")).should("have.text", "2");

    cy.get(cesc("#\\/numColumns")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 3],
        ["tuple", ["tuple", "a", "b", "c"], ["tuple", "d", "e", "f"]],
      ];
      let matrixValue = [
        ["a", "b", "c"],
        ["d", "e", "f"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value");

    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}x{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_0_1") + " textarea")
      .type("{end}{backspace}y{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_0_2") + " textarea")
      .type("{end}{backspace}z{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_1_0") + " textarea")
      .type("{end}{backspace}u{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_1_1") + " textarea")
      .type("{end}{backspace}v{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_1_2") + " textarea")
      .type("{end}{backspace}w{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[xyzuvw]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xyzuvw]");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 3],
        ["tuple", ["tuple", "x", "y", "z"], ["tuple", "u", "v", "w"]],
      ];
      let matrixValue = [
        ["x", "y", "z"],
        ["u", "v", "w"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("cannot remove rows or columns");

    cy.get(cesc("#\\/mi_rowDecrement")).click();
    cy.get(cesc("#\\/mi_columnDecrement")).click();

    cy.log("change value so know that core has responded");
    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}1{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[1yzuvw]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1yzuvw]");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc("#\\/matrixSize")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "2, 3");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "2, 3");

    cy.get(cesc("#\\/numRows")).should("have.text", "2");
    cy.get(cesc("#\\/numRows1")).should("have.text", "2");
    cy.get(cesc("#\\/numRows2")).should("have.text", "2");
    cy.get(cesc("#\\/numRows3")).should("have.text", "2");
    cy.get(cesc("#\\/numRows4")).should("have.text", "2");
    cy.get(cesc("#\\/numRows5")).should("have.text", "2");
    cy.get(cesc("#\\/numRows6")).should("have.text", "2");
    cy.get(cesc("#\\/numRows7")).should("have.text", "2");
    cy.get(cesc("#\\/numRows8")).should("have.text", "2");

    cy.get(cesc("#\\/numColumns")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 3],
        ["tuple", ["tuple", 1, "y", "z"], ["tuple", "u", "v", "w"]],
      ];
      let matrixValue = [
        [1, "y", "z"],
        ["u", "v", "w"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value, 1-4");

    cy.get(cesc("#\\/mi1_component_0_0") + " textarea")
      .type("{end}{backspace}m{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_0_1") + " textarea")
      .type("{end}{backspace}n{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_0_2") + " textarea")
      .type("{end}{backspace}o{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_1_0") + " textarea")
      .type("{end}{backspace}p{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea")
      .type("{end}{backspace}q{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_1_2") + " textarea")
      .type("{end}{backspace}r{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[mnopqr]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[mnopqr]");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "m",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "n",
    );
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "o",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "p",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "q",
    );
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "r",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 3],
        ["tuple", ["tuple", "m", "n", "o"], ["tuple", "p", "q", "r"]],
      ];
      let matrixValue = [
        ["m", "n", "o"],
        ["p", "q", "r"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value, 5-8");

    cy.get(cesc("#\\/mi5_component_0_0") + " textarea")
      .type("{end}{backspace}s{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_0_1") + " textarea")
      .type("{end}{backspace}t{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi7_component_0_2") + " textarea")
      .type("{end}{backspace}u{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi8_component_1_0") + " textarea")
      .type("{end}{backspace}v{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_1_1") + " textarea")
      .type("{end}{backspace}w{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_1_2") + " textarea")
      .type("{end}{backspace}x{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[stuvwx]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvwx]");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "s",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "t",
    );
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 3],
        ["tuple", ["tuple", "s", "t", "u"], ["tuple", "v", "w", "x"]],
      ];
      let matrixValue = [
        ["s", "t", "u"],
        ["v", "w", "x"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi8"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });
  });

  it("3x2 matrix, rows, change size", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>numRows: <mathinput name="mi_nRows" prefill="3" />,
      numColumns: <mathinput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" numRows="$mi_nRows" numColumns="$mi_nColumns" >
      <row>a b c</row>
      <row>d e f</row>
    </matrix>
    </p>
    <p>Copy 1: <matrix name="A1" copySource="A" /></p>
    <p>Copy 2: <matrix name="A2" copySource="A.value" /></p>
    <p>Copy 3: <copy source="A" assignNames="A3" /></p>
    <p>Copy 4: <copy source="A.value" assignNames="A4" /></p>
    <p>Copy 5: <matrix name="A5">$A</matrix></p>
    <p>Copy 6: <matrix name="A6">$A.value</matrix></p>
    <p>Copy 7: <matrix name="A7"><matrix copySource="A1" /></matrix></p>
    <p>Copy 8: <matrix name="A8"><matrix copySource="A1.value" /></matrix></p>
    <p>Modify: <matrixInput bindValueTo="$A" name="mi" /></p>
    <p>Modify copy 1: <matrixInput bindValueTo="$A1" name="mi1" /></p>
    <p>Modify copy 2: <matrixInput bindValueTo="$A2" name="mi2" /></p>
    <p>Modify copy 3: <matrixInput bindValueTo="$A3" name="mi3" /></p>
    <p>Modify copy 4: <matrixInput bindValueTo="$A4" name="mi4" /></p>
    <p>Modify copy 5: <matrixInput bindValueTo="$A5" name="mi5" /></p>
    <p>Modify copy 6: <matrixInput bindValueTo="$A6" name="mi6" /></p>
    <p>Modify copy 7: <matrixInput bindValueTo="$A7" name="mi7" /></p>
    <p>Modify copy 8: <matrixInput bindValueTo="$A8" name="mi8" /></p>
    <p>Size: <numberList copySource="A.matrixSize" name="matrixSize" />, 
      numRows: <integer copySource="A.numRows" name="numRows" />,
      numColumns: <integer copySource="A.numColumns" name="numColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      numRows 1: <integer copySource="A1.numRows" name="numRows1" />,
      numColumns 1: <integer copySource="A1.numColumns" name="numColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      numRows 2: <integer copySource="A2.numRows" name="numRows2" />,
      numColumns 2: <integer copySource="A2.numColumns" name="numColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      numRows 3: <integer copySource="A3.numRows" name="numRows3" />,
      numColumns 3: <integer copySource="A3.numColumns" name="numColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      numRows 4: <integer copySource="A4.numRows" name="numRows4" />,
      numColumns 4: <integer copySource="A4.numColumns" name="numColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      numRows 5: <integer copySource="A5.numRows" name="numRows5" />,
      numColumns 5: <integer copySource="A5.numColumns" name="numColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      numRows 6: <integer copySource="A6.numRows" name="numRows6" />,
      numColumns 6: <integer copySource="A6.numColumns" name="numColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      numRows 7: <integer copySource="A7.numRows" name="numRows7" />,
      numColumns 7: <integer copySource="A7.numColumns" name="numColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      numRows 8: <integer copySource="A8.numRows" name="numRows8" />,
      numColumns 8: <integer copySource="A8.numColumns" name="numColumns8" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi2_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi2_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi3_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi3_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi4_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi4_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi5_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi5_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi6_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi6_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi7_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi7_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi8_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi8_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc("#\\/matrixSize")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "3, 2");

    cy.get(cesc("#\\/numRows")).should("have.text", "3");
    cy.get(cesc("#\\/numRows1")).should("have.text", "3");
    cy.get(cesc("#\\/numRows2")).should("have.text", "3");
    cy.get(cesc("#\\/numRows3")).should("have.text", "3");
    cy.get(cesc("#\\/numRows4")).should("have.text", "3");
    cy.get(cesc("#\\/numRows5")).should("have.text", "3");
    cy.get(cesc("#\\/numRows6")).should("have.text", "3");
    cy.get(cesc("#\\/numRows7")).should("have.text", "3");
    cy.get(cesc("#\\/numRows8")).should("have.text", "3");

    cy.get(cesc("#\\/numColumns")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        ["tuple", ["tuple", "a", "b"], ["tuple", "d", "e"], ["tuple", 0, 0]],
      ];
      let matrixValue = [
        ["a", "b"],
        ["d", "e"],
        [0, 0],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value");

    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}x{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea")
      .type("{end}{backspace}y{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_1_0") + " textarea")
      .type("{end}{backspace}z{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_1_1") + " textarea")
      .type("{end}{backspace}u{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_2_0") + " textarea")
      .type("{end}{backspace}v{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_2_1") + " textarea")
      .type("{end}{backspace}w{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "⎡⎢⎣xyzuvw⎤⎥⎦");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi2_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi2_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi3_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi3_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi4_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi4_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi5_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi5_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi6_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi6_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi7_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi7_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi8_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi8_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "x", "y"],
          ["tuple", "z", "u"],
          ["tuple", "v", "w"],
        ],
      ];
      let matrixValue = [
        ["x", "y"],
        ["z", "u"],
        ["v", "w"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("cannot remove rows or columns");

    cy.get(cesc("#\\/mi_rowDecrement")).click();
    cy.get(cesc("#\\/mi_columnDecrement")).click();

    cy.log("change value so know that core has responded");
    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}1{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "⎡⎢⎣1yzuvw⎤⎥⎦");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc("#\\/matrixSize")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "3, 2");

    cy.get(cesc("#\\/numRows")).should("have.text", "3");
    cy.get(cesc("#\\/numRows1")).should("have.text", "3");
    cy.get(cesc("#\\/numRows2")).should("have.text", "3");
    cy.get(cesc("#\\/numRows3")).should("have.text", "3");
    cy.get(cesc("#\\/numRows4")).should("have.text", "3");
    cy.get(cesc("#\\/numRows5")).should("have.text", "3");
    cy.get(cesc("#\\/numRows6")).should("have.text", "3");
    cy.get(cesc("#\\/numRows7")).should("have.text", "3");
    cy.get(cesc("#\\/numRows8")).should("have.text", "3");

    cy.get(cesc("#\\/numColumns")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        ["tuple", ["tuple", 1, "y"], ["tuple", "z", "u"], ["tuple", "v", "w"]],
      ];
      let matrixValue = [
        [1, "y"],
        ["z", "u"],
        ["v", "w"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("increase to 4 columns");

    cy.get(cesc("#\\/mi_nColumns") + " textarea")
      .type("{end}{backspace}4{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦",
    );

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "3, 4");

    cy.get(cesc("#\\/numRows")).should("have.text", "3");
    cy.get(cesc("#\\/numRows1")).should("have.text", "3");
    cy.get(cesc("#\\/numRows2")).should("have.text", "3");
    cy.get(cesc("#\\/numRows3")).should("have.text", "3");
    cy.get(cesc("#\\/numRows4")).should("have.text", "3");
    cy.get(cesc("#\\/numRows5")).should("have.text", "3");
    cy.get(cesc("#\\/numRows6")).should("have.text", "3");
    cy.get(cesc("#\\/numRows7")).should("have.text", "3");
    cy.get(cesc("#\\/numRows8")).should("have.text", "3");

    cy.get(cesc("#\\/numColumns")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 4],
        [
          "tuple",
          ["tuple", 1, "y", "c", 0],
          ["tuple", "z", "u", "f", 0],
          ["tuple", "v", "w", 0, 0],
        ],
      ];
      let matrixValue = [
        [1, "y", "c", 0],
        ["z", "u", "f", 0],
        ["v", "w", 0, 0],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 4]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change values");

    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}g{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea")
      .type("{end}{backspace}h{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_0_2") + " textarea")
      .type("{end}{backspace}i{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_0_3") + " textarea")
      .type("{end}{backspace}j{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_1_0") + " textarea")
      .type("{end}{backspace}k{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_1_1") + " textarea")
      .type("{end}{backspace}l{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_1_2") + " textarea")
      .type("{end}{backspace}m{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi7_component_1_3") + " textarea")
      .type("{end}{backspace}n{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi8_component_2_0") + " textarea")
      .type("{end}{backspace}o{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_2_1") + " textarea")
      .type("{end}{backspace}p{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_2_2") + " textarea")
      .type("{end}{backspace}q{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_2_3") + " textarea")
      .type("{end}{backspace}r{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣ghijklmnopqr⎤⎥⎦",
    );

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 4],
        [
          "tuple",
          ["tuple", "g", "h", "i", "j"],
          ["tuple", "k", "l", "m", "n"],
          ["tuple", "o", "p", "q", "r"],
        ],
      ];
      let matrixValue = [
        ["g", "h", "i", "j"],
        ["k", "l", "m", "n"],
        ["o", "p", "q", "r"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 4]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("decrease to 1 row");

    cy.get(cesc("#\\/mi_nRows") + " textarea")
      .type("{end}{backspace}1{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[ghij]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "1, 4");

    cy.get(cesc("#\\/numRows")).should("have.text", "1");
    cy.get(cesc("#\\/numRows1")).should("have.text", "1");
    cy.get(cesc("#\\/numRows2")).should("have.text", "1");
    cy.get(cesc("#\\/numRows3")).should("have.text", "1");
    cy.get(cesc("#\\/numRows4")).should("have.text", "1");
    cy.get(cesc("#\\/numRows5")).should("have.text", "1");
    cy.get(cesc("#\\/numRows6")).should("have.text", "1");
    cy.get(cesc("#\\/numRows7")).should("have.text", "1");
    cy.get(cesc("#\\/numRows8")).should("have.text", "1");

    cy.get(cesc("#\\/numColumns")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "g", "h", "i", "j"]],
      ];
      let matrixValue = [["g", "h", "i", "j"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 4]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change values");

    cy.get(cesc("#\\/mi3_component_0_0") + " textarea")
      .type("{end}{backspace}s{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_0_1") + " textarea")
      .type("{end}{backspace}t{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_0_2") + " textarea")
      .type("{end}{backspace}u{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_0_3") + " textarea")
      .type("{end}{backspace}v{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[stuv]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "s", "t", "u", "v"]],
      ];
      let matrixValue = [["s", "t", "u", "v"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 4]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("up to 2 rows");

    cy.get(cesc("#\\/mi_nRows") + " textarea")
      .type("{end}{backspace}2{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[stuvklmn]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "2, 4");

    cy.get(cesc("#\\/numRows")).should("have.text", "2");
    cy.get(cesc("#\\/numRows1")).should("have.text", "2");
    cy.get(cesc("#\\/numRows2")).should("have.text", "2");
    cy.get(cesc("#\\/numRows3")).should("have.text", "2");
    cy.get(cesc("#\\/numRows4")).should("have.text", "2");
    cy.get(cesc("#\\/numRows5")).should("have.text", "2");
    cy.get(cesc("#\\/numRows6")).should("have.text", "2");
    cy.get(cesc("#\\/numRows7")).should("have.text", "2");
    cy.get(cesc("#\\/numRows8")).should("have.text", "2");

    cy.get(cesc("#\\/numColumns")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 4],
        ["tuple", ["tuple", "s", "t", "u", "v"], ["tuple", "k", "l", "m", "n"]],
      ];
      let matrixValue = [
        ["s", "t", "u", "v"],
        ["k", "l", "m", "n"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 4]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });
  });

  it("3x2 matrix, columns, change size", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>numRows: <mathinput name="mi_nRows" prefill="3" />,
      numColumns: <mathinput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" numRows="$mi_nRows" numColumns="$mi_nColumns" >
      <column>a d</column>
      <column>b e</column>
      <column>c f</column>
    </matrix>
    </p>
    <p>Copy 1: <matrix name="A1" copySource="A" /></p>
    <p>Copy 2: <matrix name="A2" copySource="A.value" /></p>
    <p>Copy 3: <copy source="A" assignNames="A3" /></p>
    <p>Copy 4: <copy source="A.value" assignNames="A4" /></p>
    <p>Copy 5: <matrix name="A5">$A</matrix></p>
    <p>Copy 6: <matrix name="A6">$A.value</matrix></p>
    <p>Copy 7: <matrix name="A7"><matrix copySource="A1" /></matrix></p>
    <p>Copy 8: <matrix name="A8"><matrix copySource="A1.value" /></matrix></p>
    <p>Modify: <matrixInput bindValueTo="$A" name="mi" /></p>
    <p>Modify copy 1: <matrixInput bindValueTo="$A1" name="mi1" /></p>
    <p>Modify copy 2: <matrixInput bindValueTo="$A2" name="mi2" /></p>
    <p>Modify copy 3: <matrixInput bindValueTo="$A3" name="mi3" /></p>
    <p>Modify copy 4: <matrixInput bindValueTo="$A4" name="mi4" /></p>
    <p>Modify copy 5: <matrixInput bindValueTo="$A5" name="mi5" /></p>
    <p>Modify copy 6: <matrixInput bindValueTo="$A6" name="mi6" /></p>
    <p>Modify copy 7: <matrixInput bindValueTo="$A7" name="mi7" /></p>
    <p>Modify copy 8: <matrixInput bindValueTo="$A8" name="mi8" /></p>
    <p>Size: <numberList copySource="A.matrixSize" name="matrixSize" />, 
      numRows: <integer copySource="A.numRows" name="numRows" />,
      numColumns: <integer copySource="A.numColumns" name="numColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      numRows 1: <integer copySource="A1.numRows" name="numRows1" />,
      numColumns 1: <integer copySource="A1.numColumns" name="numColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      numRows 2: <integer copySource="A2.numRows" name="numRows2" />,
      numColumns 2: <integer copySource="A2.numColumns" name="numColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      numRows 3: <integer copySource="A3.numRows" name="numRows3" />,
      numColumns 3: <integer copySource="A3.numColumns" name="numColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      numRows 4: <integer copySource="A4.numRows" name="numRows4" />,
      numColumns 4: <integer copySource="A4.numColumns" name="numColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      numRows 5: <integer copySource="A5.numRows" name="numRows5" />,
      numColumns 5: <integer copySource="A5.numColumns" name="numColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      numRows 6: <integer copySource="A6.numRows" name="numRows6" />,
      numColumns 6: <integer copySource="A6.numColumns" name="numColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      numRows 7: <integer copySource="A7.numRows" name="numRows7" />,
      numColumns 7: <integer copySource="A7.numColumns" name="numColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      numRows 8: <integer copySource="A8.numRows" name="numRows8" />,
      numColumns 8: <integer copySource="A8.numColumns" name="numColumns8" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde00⎤⎥⎦");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi2_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi2_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi3_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi3_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi4_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi4_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi5_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi5_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi6_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi6_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi7_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi7_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "a",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "b",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "d",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "e",
    );
    cy.get(cesc(`#\\/mi8_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );
    cy.get(cesc(`#\\/mi8_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "0",
    );

    cy.get(cesc("#\\/matrixSize")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "3, 2");

    cy.get(cesc("#\\/numRows")).should("have.text", "3");
    cy.get(cesc("#\\/numRows1")).should("have.text", "3");
    cy.get(cesc("#\\/numRows2")).should("have.text", "3");
    cy.get(cesc("#\\/numRows3")).should("have.text", "3");
    cy.get(cesc("#\\/numRows4")).should("have.text", "3");
    cy.get(cesc("#\\/numRows5")).should("have.text", "3");
    cy.get(cesc("#\\/numRows6")).should("have.text", "3");
    cy.get(cesc("#\\/numRows7")).should("have.text", "3");
    cy.get(cesc("#\\/numRows8")).should("have.text", "3");

    cy.get(cesc("#\\/numColumns")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        ["tuple", ["tuple", "a", "b"], ["tuple", "d", "e"], ["tuple", 0, 0]],
      ];
      let matrixValue = [
        ["a", "b"],
        ["d", "e"],
        [0, 0],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change value");

    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}x{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea")
      .type("{end}{backspace}y{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_1_0") + " textarea")
      .type("{end}{backspace}z{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_1_1") + " textarea")
      .type("{end}{backspace}u{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_2_0") + " textarea")
      .type("{end}{backspace}v{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_2_1") + " textarea")
      .type("{end}{backspace}w{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "⎡⎢⎣xyzuvw⎤⎥⎦");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvw⎤⎥⎦");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi2_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi2_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi3_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi3_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi4_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi4_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi5_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi5_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi6_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi6_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi7_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi7_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "x",
    );
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi8_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi8_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "x", "y"],
          ["tuple", "z", "u"],
          ["tuple", "v", "w"],
        ],
      ];
      let matrixValue = [
        ["x", "y"],
        ["z", "u"],
        ["v", "w"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("cannot remove rows or columns");

    cy.get(cesc("#\\/mi_rowDecrement")).click();
    cy.get(cesc("#\\/mi_columnDecrement")).click();

    cy.log("change value so know that core has responded");
    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}1{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "⎡⎢⎣1yzuvw⎤⎥⎦");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvw⎤⎥⎦");
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should(
      "have.text",
      "y",
    );
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should(
      "have.text",
      "z",
    );
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should(
      "have.text",
      "u",
    );
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should(
      "have.text",
      "v",
    );
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should(
      "have.text",
      "w",
    );

    cy.get(cesc("#\\/matrixSize")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "3, 2");

    cy.get(cesc("#\\/numRows")).should("have.text", "3");
    cy.get(cesc("#\\/numRows1")).should("have.text", "3");
    cy.get(cesc("#\\/numRows2")).should("have.text", "3");
    cy.get(cesc("#\\/numRows3")).should("have.text", "3");
    cy.get(cesc("#\\/numRows4")).should("have.text", "3");
    cy.get(cesc("#\\/numRows5")).should("have.text", "3");
    cy.get(cesc("#\\/numRows6")).should("have.text", "3");
    cy.get(cesc("#\\/numRows7")).should("have.text", "3");
    cy.get(cesc("#\\/numRows8")).should("have.text", "3");

    cy.get(cesc("#\\/numColumns")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        ["tuple", ["tuple", 1, "y"], ["tuple", "z", "u"], ["tuple", "v", "w"]],
      ];
      let matrixValue = [
        [1, "y"],
        ["z", "u"],
        ["v", "w"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("increase to 4 columns");

    cy.get(cesc("#\\/mi_nColumns") + " textarea")
      .type("{end}{backspace}4{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦",
    );

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yc0zuf0vw00⎤⎥⎦");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "3, 4");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "3, 4");

    cy.get(cesc("#\\/numRows")).should("have.text", "3");
    cy.get(cesc("#\\/numRows1")).should("have.text", "3");
    cy.get(cesc("#\\/numRows2")).should("have.text", "3");
    cy.get(cesc("#\\/numRows3")).should("have.text", "3");
    cy.get(cesc("#\\/numRows4")).should("have.text", "3");
    cy.get(cesc("#\\/numRows5")).should("have.text", "3");
    cy.get(cesc("#\\/numRows6")).should("have.text", "3");
    cy.get(cesc("#\\/numRows7")).should("have.text", "3");
    cy.get(cesc("#\\/numRows8")).should("have.text", "3");

    cy.get(cesc("#\\/numColumns")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 4],
        [
          "tuple",
          ["tuple", 1, "y", "c", 0],
          ["tuple", "z", "u", "f", 0],
          ["tuple", "v", "w", 0, 0],
        ],
      ];
      let matrixValue = [
        [1, "y", "c", 0],
        ["z", "u", "f", 0],
        ["v", "w", 0, 0],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 4]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change values");

    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}g{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea")
      .type("{end}{backspace}h{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_0_2") + " textarea")
      .type("{end}{backspace}i{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_0_3") + " textarea")
      .type("{end}{backspace}j{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_1_0") + " textarea")
      .type("{end}{backspace}k{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_1_1") + " textarea")
      .type("{end}{backspace}l{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_1_2") + " textarea")
      .type("{end}{backspace}m{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi7_component_1_3") + " textarea")
      .type("{end}{backspace}n{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi8_component_2_0") + " textarea")
      .type("{end}{backspace}o{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_2_1") + " textarea")
      .type("{end}{backspace}p{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_2_2") + " textarea")
      .type("{end}{backspace}q{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_2_3") + " textarea")
      .type("{end}{backspace}r{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣ghijklmnopqr⎤⎥⎦",
    );

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ghijklmnopqr⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 4],
        [
          "tuple",
          ["tuple", "g", "h", "i", "j"],
          ["tuple", "k", "l", "m", "n"],
          ["tuple", "o", "p", "q", "r"],
        ],
      ];
      let matrixValue = [
        ["g", "h", "i", "j"],
        ["k", "l", "m", "n"],
        ["o", "p", "q", "r"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 4]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("decrease to 1 row");

    cy.get(cesc("#\\/mi_nRows") + " textarea")
      .type("{end}{backspace}1{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[ghij]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "1, 4");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "1, 4");

    cy.get(cesc("#\\/numRows")).should("have.text", "1");
    cy.get(cesc("#\\/numRows1")).should("have.text", "1");
    cy.get(cesc("#\\/numRows2")).should("have.text", "1");
    cy.get(cesc("#\\/numRows3")).should("have.text", "1");
    cy.get(cesc("#\\/numRows4")).should("have.text", "1");
    cy.get(cesc("#\\/numRows5")).should("have.text", "1");
    cy.get(cesc("#\\/numRows6")).should("have.text", "1");
    cy.get(cesc("#\\/numRows7")).should("have.text", "1");
    cy.get(cesc("#\\/numRows8")).should("have.text", "1");

    cy.get(cesc("#\\/numColumns")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "g", "h", "i", "j"]],
      ];
      let matrixValue = [["g", "h", "i", "j"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 4]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change values");

    cy.get(cesc("#\\/mi3_component_0_0") + " textarea")
      .type("{end}{backspace}s{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_0_1") + " textarea")
      .type("{end}{backspace}t{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_0_2") + " textarea")
      .type("{end}{backspace}u{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_0_3") + " textarea")
      .type("{end}{backspace}v{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[stuv]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuv]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "s", "t", "u", "v"]],
      ];
      let matrixValue = [["s", "t", "u", "v"]];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([1, 4]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("up to 2 rows");

    cy.get(cesc("#\\/mi_nRows") + " textarea")
      .type("{end}{backspace}2{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "[stuvklmn]");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[stuvklmn]");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "2, 4");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "2, 4");

    cy.get(cesc("#\\/numRows")).should("have.text", "2");
    cy.get(cesc("#\\/numRows1")).should("have.text", "2");
    cy.get(cesc("#\\/numRows2")).should("have.text", "2");
    cy.get(cesc("#\\/numRows3")).should("have.text", "2");
    cy.get(cesc("#\\/numRows4")).should("have.text", "2");
    cy.get(cesc("#\\/numRows5")).should("have.text", "2");
    cy.get(cesc("#\\/numRows6")).should("have.text", "2");
    cy.get(cesc("#\\/numRows7")).should("have.text", "2");
    cy.get(cesc("#\\/numRows8")).should("have.text", "2");

    cy.get(cesc("#\\/numColumns")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "4");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 4],
        ["tuple", ["tuple", "s", "t", "u", "v"], ["tuple", "k", "l", "m", "n"]],
      ];
      let matrixValue = [
        ["s", "t", "u", "v"],
        ["k", "l", "m", "n"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([2, 4]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });
  });

  it("3x2 matrix, rows, change size, change default entry", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Default entry: <mathinput name="de" prefill="1" /></p>
    <p>numRows: <mathinput name="mi_nRows" prefill="3" />,
      numColumns: <mathinput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" numRows="$mi_nRows" numColumns="$mi_nColumns" defaultEntry="$de" >
      <row>a b c</row>
      <row>d e f</row>
    </matrix>
    </p>
    <p>Copy 1: <matrix name="A1" copySource="A" /></p>
    <p>Copy 2: <matrix name="A2" copySource="A.value" /></p>
    <p>Copy 3: <copy source="A" assignNames="A3" /></p>
    <p>Copy 4: <copy source="A.value" assignNames="A4" /></p>
    <p>Copy 5: <matrix name="A5">$A</matrix></p>
    <p>Copy 6: <matrix name="A6">$A.value</matrix></p>
    <p>Copy 7: <matrix name="A7"><matrix copySource="A1" /></matrix></p>
    <p>Copy 8: <matrix name="A8"><matrix copySource="A1.value" /></matrix></p>
    <p>Modify: <matrixInput bindValueTo="$A" name="mi" /></p>
    <p>Modify copy 1: <matrixInput bindValueTo="$A1" name="mi1" /></p>
    <p>Modify copy 2: <matrixInput bindValueTo="$A2" name="mi2" /></p>
    <p>Modify copy 3: <matrixInput bindValueTo="$A3" name="mi3" /></p>
    <p>Modify copy 4: <matrixInput bindValueTo="$A4" name="mi4" /></p>
    <p>Modify copy 5: <matrixInput bindValueTo="$A5" name="mi5" /></p>
    <p>Modify copy 6: <matrixInput bindValueTo="$A6" name="mi6" /></p>
    <p>Modify copy 7: <matrixInput bindValueTo="$A7" name="mi7" /></p>
    <p>Modify copy 8: <matrixInput bindValueTo="$A8" name="mi8" /></p>
    <p>Size: <numberList copySource="A.matrixSize" name="matrixSize" />, 
      numRows: <integer copySource="A.numRows" name="numRows" />,
      numColumns: <integer copySource="A.numColumns" name="numColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      numRows 1: <integer copySource="A1.numRows" name="numRows1" />,
      numColumns 1: <integer copySource="A1.numColumns" name="numColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      numRows 2: <integer copySource="A2.numRows" name="numRows2" />,
      numColumns 2: <integer copySource="A2.numColumns" name="numColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      numRows 3: <integer copySource="A3.numRows" name="numRows3" />,
      numColumns 3: <integer copySource="A3.numColumns" name="numColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      numRows 4: <integer copySource="A4.numRows" name="numRows4" />,
      numColumns 4: <integer copySource="A4.numColumns" name="numColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      numRows 5: <integer copySource="A5.numRows" name="numRows5" />,
      numColumns 5: <integer copySource="A5.numColumns" name="numColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      numRows 6: <integer copySource="A6.numRows" name="numRows6" />,
      numColumns 6: <integer copySource="A6.numColumns" name="numColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      numRows 7: <integer copySource="A7.numRows" name="numRows7" />,
      numColumns 7: <integer copySource="A7.numColumns" name="numColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      numRows 8: <integer copySource="A8.numRows" name="numRows8" />,
      numColumns 8: <integer copySource="A8.numColumns" name="numColumns8" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "3, 2");

    cy.get(cesc("#\\/numRows")).should("have.text", "3");
    cy.get(cesc("#\\/numRows1")).should("have.text", "3");
    cy.get(cesc("#\\/numRows2")).should("have.text", "3");
    cy.get(cesc("#\\/numRows3")).should("have.text", "3");
    cy.get(cesc("#\\/numRows4")).should("have.text", "3");
    cy.get(cesc("#\\/numRows5")).should("have.text", "3");
    cy.get(cesc("#\\/numRows6")).should("have.text", "3");
    cy.get(cesc("#\\/numRows7")).should("have.text", "3");
    cy.get(cesc("#\\/numRows8")).should("have.text", "3");

    cy.get(cesc("#\\/numColumns")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        ["tuple", ["tuple", "a", "b"], ["tuple", "d", "e"], ["tuple", 1, 1]],
      ];
      let matrixValue = [
        ["a", "b"],
        ["d", "e"],
        [1, 1],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change default entry");

    cy.get(cesc("#\\/de") + " textarea").type("{end}{backspace}k{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "⎡⎢⎣abdekk⎤⎥⎦");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "a", "b"],
          ["tuple", "d", "e"],
          ["tuple", "k", "k"],
        ],
      ];
      let matrixValue = [
        ["a", "b"],
        ["d", "e"],
        ["k", "k"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change all but last value");

    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}x{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea")
      .type("{end}{backspace}y{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_1_0") + " textarea")
      .type("{end}{backspace}z{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_1_1") + " textarea")
      .type("{end}{backspace}u{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_2_0") + " textarea")
      .type("{end}{backspace}v{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "⎡⎢⎣xyzuvk⎤⎥⎦");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "x", "y"],
          ["tuple", "z", "u"],
          ["tuple", "v", "k"],
        ],
      ];
      let matrixValue = [
        ["x", "y"],
        ["z", "u"],
        ["v", "k"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log(
      "change default entry again does not work as all modified by matrixinput",
    );

    cy.get(cesc("#\\/de") + " textarea").type("{end}{backspace}j{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/mi8_component_0_0") + " textarea")
      .type("{end}{backspace}1{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "⎡⎢⎣1yzuvk⎤⎥⎦");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        ["tuple", ["tuple", 1, "y"], ["tuple", "z", "u"], ["tuple", "v", "k"]],
      ];
      let matrixValue = [
        [1, "y"],
        ["z", "u"],
        ["v", "k"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("add row and column");
    cy.get(cesc("#\\/mi_nRows") + " textarea")
      .type("{end}{backspace}4{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_nColumns") + " textarea")
      .type("{end}{backspace}3{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦",
    );

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "4, 3");

    cy.get(cesc("#\\/numRows")).should("have.text", "4");
    cy.get(cesc("#\\/numRows1")).should("have.text", "4");
    cy.get(cesc("#\\/numRows2")).should("have.text", "4");
    cy.get(cesc("#\\/numRows3")).should("have.text", "4");
    cy.get(cesc("#\\/numRows4")).should("have.text", "4");
    cy.get(cesc("#\\/numRows5")).should("have.text", "4");
    cy.get(cesc("#\\/numRows6")).should("have.text", "4");
    cy.get(cesc("#\\/numRows7")).should("have.text", "4");
    cy.get(cesc("#\\/numRows8")).should("have.text", "4");

    cy.get(cesc("#\\/numColumns")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 4, 3],
        [
          "tuple",
          ["tuple", 1, "y", "c"],
          ["tuple", "z", "u", "f"],
          ["tuple", "v", "k", "j"],
          ["tuple", "j", "j", "j"],
        ],
      ];
      let matrixValue = [
        [1, "y", "c"],
        ["z", "u", "f"],
        ["v", "k", "j"],
        ["j", "j", "j"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([4, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change all values");

    cy.get(cesc("#\\/mi5_component_0_0") + " textarea")
      .type("{end}{backspace}l{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_0_1") + " textarea")
      .type("{end}{backspace}m{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi7_component_0_2") + " textarea")
      .type("{end}{backspace}n{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi8_component_1_0") + " textarea")
      .type("{end}{backspace}o{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_1_1") + " textarea")
      .type("{end}{backspace}p{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_1_2") + " textarea")
      .type("{end}{backspace}q{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_2_0") + " textarea")
      .type("{end}{backspace}r{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_2_1") + " textarea")
      .type("{end}{backspace}s{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_2_2") + " textarea")
      .type("{end}{backspace}t{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_3_0") + " textarea")
      .type("{end}{backspace}w{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_3_1") + " textarea")
      .type("{end}{backspace}a{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi7_component_3_2") + " textarea")
      .type("{end}{backspace}b{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦",
    );

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 4, 3],
        [
          "tuple",
          ["tuple", "l", "m", "n"],
          ["tuple", "o", "p", "q"],
          ["tuple", "r", "s", "t"],
          ["tuple", "w", "a", "b"],
        ],
      ];
      let matrixValue = [
        ["l", "m", "n"],
        ["o", "p", "q"],
        ["r", "s", "t"],
        ["w", "a", "b"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([4, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });
  });

  it("3x2 matrix, columns, change size, change default entry", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Default entry: <mathinput name="de" prefill="1" /></p>
    <p>numRows: <mathinput name="mi_nRows" prefill="3" />,
      numColumns: <mathinput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" numRows="$mi_nRows" numColumns="$mi_nColumns" defaultEntry="$de" >
      <column>a d</column>
      <column>b e</column>
      <column>c f</column>
    </matrix>
    </p>
    <p>Copy 1: <matrix name="A1" copySource="A" /></p>
    <p>Copy 2: <matrix name="A2" copySource="A.value" /></p>
    <p>Copy 3: <copy source="A" assignNames="A3" /></p>
    <p>Copy 4: <copy source="A.value" assignNames="A4" /></p>
    <p>Copy 5: <matrix name="A5">$A</matrix></p>
    <p>Copy 6: <matrix name="A6">$A.value</matrix></p>
    <p>Copy 7: <matrix name="A7"><matrix copySource="A1" /></matrix></p>
    <p>Copy 8: <matrix name="A8"><matrix copySource="A1.value" /></matrix></p>
    <p>Modify: <matrixInput bindValueTo="$A" name="mi" /></p>
    <p>Modify copy 1: <matrixInput bindValueTo="$A1" name="mi1" /></p>
    <p>Modify copy 2: <matrixInput bindValueTo="$A2" name="mi2" /></p>
    <p>Modify copy 3: <matrixInput bindValueTo="$A3" name="mi3" /></p>
    <p>Modify copy 4: <matrixInput bindValueTo="$A4" name="mi4" /></p>
    <p>Modify copy 5: <matrixInput bindValueTo="$A5" name="mi5" /></p>
    <p>Modify copy 6: <matrixInput bindValueTo="$A6" name="mi6" /></p>
    <p>Modify copy 7: <matrixInput bindValueTo="$A7" name="mi7" /></p>
    <p>Modify copy 8: <matrixInput bindValueTo="$A8" name="mi8" /></p>
    <p>Size: <numberList copySource="A.matrixSize" name="matrixSize" />, 
      numRows: <integer copySource="A.numRows" name="numRows" />,
      numColumns: <integer copySource="A.numColumns" name="numColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      numRows 1: <integer copySource="A1.numRows" name="numRows1" />,
      numColumns 1: <integer copySource="A1.numColumns" name="numColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      numRows 2: <integer copySource="A2.numRows" name="numRows2" />,
      numColumns 2: <integer copySource="A2.numColumns" name="numColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      numRows 3: <integer copySource="A3.numRows" name="numRows3" />,
      numColumns 3: <integer copySource="A3.numColumns" name="numColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      numRows 4: <integer copySource="A4.numRows" name="numRows4" />,
      numColumns 4: <integer copySource="A4.numColumns" name="numColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      numRows 5: <integer copySource="A5.numRows" name="numRows5" />,
      numColumns 5: <integer copySource="A5.numColumns" name="numColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      numRows 6: <integer copySource="A6.numRows" name="numRows6" />,
      numColumns 6: <integer copySource="A6.numColumns" name="numColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      numRows 7: <integer copySource="A7.numRows" name="numRows7" />,
      numColumns 7: <integer copySource="A7.numColumns" name="numColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      numRows 8: <integer copySource="A8.numRows" name="numRows8" />,
      numColumns 8: <integer copySource="A8.numColumns" name="numColumns8" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abde11⎤⎥⎦");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "3, 2");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "3, 2");

    cy.get(cesc("#\\/numRows")).should("have.text", "3");
    cy.get(cesc("#\\/numRows1")).should("have.text", "3");
    cy.get(cesc("#\\/numRows2")).should("have.text", "3");
    cy.get(cesc("#\\/numRows3")).should("have.text", "3");
    cy.get(cesc("#\\/numRows4")).should("have.text", "3");
    cy.get(cesc("#\\/numRows5")).should("have.text", "3");
    cy.get(cesc("#\\/numRows6")).should("have.text", "3");
    cy.get(cesc("#\\/numRows7")).should("have.text", "3");
    cy.get(cesc("#\\/numRows8")).should("have.text", "3");

    cy.get(cesc("#\\/numColumns")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "2");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        ["tuple", ["tuple", "a", "b"], ["tuple", "d", "e"], ["tuple", 1, 1]],
      ];
      let matrixValue = [
        ["a", "b"],
        ["d", "e"],
        [1, 1],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change default entry");

    cy.get(cesc("#\\/de") + " textarea").type("{end}{backspace}k{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "⎡⎢⎣abdekk⎤⎥⎦");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abdekk⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "a", "b"],
          ["tuple", "d", "e"],
          ["tuple", "k", "k"],
        ],
      ];
      let matrixValue = [
        ["a", "b"],
        ["d", "e"],
        ["k", "k"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change all but last value");

    cy.get(cesc("#\\/mi_component_0_0") + " textarea")
      .type("{end}{backspace}x{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea")
      .type("{end}{backspace}y{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_1_0") + " textarea")
      .type("{end}{backspace}z{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_1_1") + " textarea")
      .type("{end}{backspace}u{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_2_0") + " textarea")
      .type("{end}{backspace}v{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "⎡⎢⎣xyzuvk⎤⎥⎦");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣xyzuvk⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "x", "y"],
          ["tuple", "z", "u"],
          ["tuple", "v", "k"],
        ],
      ];
      let matrixValue = [
        ["x", "y"],
        ["z", "u"],
        ["v", "k"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log(
      "change default entry again does not work as all modified by matrixinput",
    );

    cy.get(cesc("#\\/de") + " textarea").type("{end}{backspace}j{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/mi8_component_0_0") + " textarea")
      .type("{end}{backspace}1{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should("contain.text", "⎡⎢⎣1yzuvk⎤⎥⎦");

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣1yzuvk⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        ["tuple", ["tuple", 1, "y"], ["tuple", "z", "u"], ["tuple", "v", "k"]],
      ];
      let matrixValue = [
        [1, "y"],
        ["z", "u"],
        ["v", "k"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("add row and column");
    cy.get(cesc("#\\/mi_nRows") + " textarea")
      .type("{end}{backspace}4{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_nColumns") + " textarea")
      .type("{end}{backspace}3{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦",
    );

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦");

    cy.get(cesc("#\\/matrixSize")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize1")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize2")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize3")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize4")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize5")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize6")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize7")).should("have.text", "4, 3");
    cy.get(cesc("#\\/matrixSize8")).should("have.text", "4, 3");

    cy.get(cesc("#\\/numRows")).should("have.text", "4");
    cy.get(cesc("#\\/numRows1")).should("have.text", "4");
    cy.get(cesc("#\\/numRows2")).should("have.text", "4");
    cy.get(cesc("#\\/numRows3")).should("have.text", "4");
    cy.get(cesc("#\\/numRows4")).should("have.text", "4");
    cy.get(cesc("#\\/numRows5")).should("have.text", "4");
    cy.get(cesc("#\\/numRows6")).should("have.text", "4");
    cy.get(cesc("#\\/numRows7")).should("have.text", "4");
    cy.get(cesc("#\\/numRows8")).should("have.text", "4");

    cy.get(cesc("#\\/numColumns")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns1")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns2")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns3")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns4")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns5")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns6")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns7")).should("have.text", "3");
    cy.get(cesc("#\\/numColumns8")).should("have.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 4, 3],
        [
          "tuple",
          ["tuple", 1, "y", "c"],
          ["tuple", "z", "u", "f"],
          ["tuple", "v", "k", "j"],
          ["tuple", "j", "j", "j"],
        ],
      ];
      let matrixValue = [
        [1, "y", "c"],
        ["z", "u", "f"],
        ["v", "k", "j"],
        ["j", "j", "j"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([4, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });

    cy.log("change all values");

    cy.get(cesc("#\\/mi5_component_0_0") + " textarea")
      .type("{end}{backspace}l{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_0_1") + " textarea")
      .type("{end}{backspace}m{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi7_component_0_2") + " textarea")
      .type("{end}{backspace}n{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi8_component_1_0") + " textarea")
      .type("{end}{backspace}o{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi_component_1_1") + " textarea")
      .type("{end}{backspace}p{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi1_component_1_2") + " textarea")
      .type("{end}{backspace}q{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2_component_2_0") + " textarea")
      .type("{end}{backspace}r{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3_component_2_1") + " textarea")
      .type("{end}{backspace}s{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4_component_2_2") + " textarea")
      .type("{end}{backspace}t{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi5_component_3_0") + " textarea")
      .type("{end}{backspace}w{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi6_component_3_1") + " textarea")
      .type("{end}{backspace}a{enter}", { force: true })
      .blur();
    cy.get(cesc("#\\/mi7_component_3_2") + " textarea")
      .type("{end}{backspace}b{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/A") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦",
    );

    cy.get(cesc("#\\/A") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");
    cy.get(cesc("#\\/A8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 4, 3],
        [
          "tuple",
          ["tuple", "l", "m", "n"],
          ["tuple", "o", "p", "q"],
          ["tuple", "r", "s", "t"],
          ["tuple", "w", "a", "b"],
        ],
      ];
      let matrixValue = [
        ["l", "m", "n"],
        ["o", "p", "q"],
        ["r", "s", "t"],
        ["w", "a", "b"],
      ];
      expect(stateVariables["/A"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A3"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A4"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A5"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A6"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A7"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/A8"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi"].stateValues.value).eqls(matrixAst);

      expect(stateVariables["/A"].stateValues.matrixSize).eqls([4, 3]);
      expect(stateVariables["/A"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A1"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A2"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A3"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A4"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A5"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A6"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A7"].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables["/A8"].stateValues.matrix).eqls(matrixValue);
    });
  });
});
