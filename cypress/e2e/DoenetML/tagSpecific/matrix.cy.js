import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Matrix Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('no arguments, 0x0 matrix', () => {
    cy.window().then(async (win) => {
      win.postMessage({
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
      nRows: <integer copySource="A.nRows" name="nRows" />,
      nColumns: <integer copySource="A.nColumns" name="nColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      nRows 1: <integer copySource="A1.nRows" name="nRows1" />,
      nColumns 1: <integer copySource="A1.nColumns" name="nColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      nRows 2: <integer copySource="A2.nRows" name="nRows2" />,
      nColumns 2: <integer copySource="A2.nColumns" name="nColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      nRows 3: <integer copySource="A3.nRows" name="nRows3" />,
      nColumns 3: <integer copySource="A3.nColumns" name="nColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      nRows 4: <integer copySource="A4.nRows" name="nRows4" />,
      nColumns 4: <integer copySource="A4.nColumns" name="nColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      nRows 5: <integer copySource="A5.nRows" name="nRows5" />,
      nColumns 5: <integer copySource="A5.nColumns" name="nColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      nRows 6: <integer copySource="A6.nRows" name="nRows6" />,
      nColumns 6: <integer copySource="A6.nColumns" name="nColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      nRows 7: <integer copySource="A7.nRows" name="nRows7" />,
      nColumns 7: <integer copySource="A7.nColumns" name="nColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      nRows 8: <integer copySource="A8.nRows" name="nRows8" />,
      nColumns 8: <integer copySource="A8.nColumns" name="nColumns8" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('not.exist')

    cy.get('#\\/matrixSize').should('have.text', '0, 0');
    cy.get('#\\/matrixSize1').should('have.text', '0, 0');
    cy.get('#\\/matrixSize2').should('have.text', '0, 0');
    cy.get('#\\/matrixSize3').should('have.text', '0, 0');
    cy.get('#\\/matrixSize4').should('have.text', '0, 0');
    cy.get('#\\/matrixSize5').should('have.text', '0, 0');
    cy.get('#\\/matrixSize6').should('have.text', '0, 0');
    cy.get('#\\/matrixSize7').should('have.text', '0, 0');
    cy.get('#\\/matrixSize8').should('have.text', '0, 0');

    cy.get('#\\/nRows').should('have.text', '0');
    cy.get('#\\/nRows1').should('have.text', '0');
    cy.get('#\\/nRows2').should('have.text', '0');
    cy.get('#\\/nRows3').should('have.text', '0');
    cy.get('#\\/nRows4').should('have.text', '0');
    cy.get('#\\/nRows5').should('have.text', '0');
    cy.get('#\\/nRows6').should('have.text', '0');
    cy.get('#\\/nRows7').should('have.text', '0');
    cy.get('#\\/nRows8').should('have.text', '0');

    cy.get('#\\/nColumns').should('have.text', '0');
    cy.get('#\\/nColumns1').should('have.text', '0');
    cy.get('#\\/nColumns2').should('have.text', '0');
    cy.get('#\\/nColumns3').should('have.text', '0');
    cy.get('#\\/nColumns4').should('have.text', '0');
    cy.get('#\\/nColumns5').should('have.text', '0');
    cy.get('#\\/nColumns6').should('have.text', '0');
    cy.get('#\\/nColumns7').should('have.text', '0');
    cy.get('#\\/nColumns8').should('have.text', '0');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]]
      let matrixValue = [];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([0, 0]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


  })

  it('specify nRows, get 1 column, 2x1 matrix of 0s', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>A: <matrix name="A" nRows="2" /></p>
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
      nRows: <integer copySource="A.nRows" name="nRows" />,
      nColumns: <integer copySource="A.nColumns" name="nColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      nRows 1: <integer copySource="A1.nRows" name="nRows1" />,
      nColumns 1: <integer copySource="A1.nColumns" name="nColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      nRows 2: <integer copySource="A2.nRows" name="nRows2" />,
      nColumns 2: <integer copySource="A2.nColumns" name="nColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      nRows 3: <integer copySource="A3.nRows" name="nRows3" />,
      nColumns 3: <integer copySource="A3.nColumns" name="nColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      nRows 4: <integer copySource="A4.nRows" name="nRows4" />,
      nColumns 4: <integer copySource="A4.nColumns" name="nColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      nRows 5: <integer copySource="A5.nRows" name="nRows5" />,
      nColumns 5: <integer copySource="A5.nColumns" name="nColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      nRows 6: <integer copySource="A6.nRows" name="nRows6" />,
      nColumns 6: <integer copySource="A6.nColumns" name="nColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      nRows 7: <integer copySource="A7.nRows" name="nRows7" />,
      nColumns 7: <integer copySource="A7.nColumns" name="nColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      nRows 8: <integer copySource="A8.nRows" name="nRows8" />,
      nColumns 8: <integer copySource="A8.nColumns" name="nColumns8" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[00]')

    cy.get('#\\/matrixSize').should('have.text', '2, 1');
    cy.get('#\\/matrixSize1').should('have.text', '2, 1');
    cy.get('#\\/matrixSize2').should('have.text', '2, 1');
    cy.get('#\\/matrixSize3').should('have.text', '2, 1');
    cy.get('#\\/matrixSize4').should('have.text', '2, 1');
    cy.get('#\\/matrixSize5').should('have.text', '2, 1');
    cy.get('#\\/matrixSize6').should('have.text', '2, 1');
    cy.get('#\\/matrixSize7').should('have.text', '2, 1');
    cy.get('#\\/matrixSize8').should('have.text', '2, 1');

    cy.get('#\\/nRows').should('have.text', '2');
    cy.get('#\\/nRows1').should('have.text', '2');
    cy.get('#\\/nRows2').should('have.text', '2');
    cy.get('#\\/nRows3').should('have.text', '2');
    cy.get('#\\/nRows4').should('have.text', '2');
    cy.get('#\\/nRows5').should('have.text', '2');
    cy.get('#\\/nRows6').should('have.text', '2');
    cy.get('#\\/nRows7').should('have.text', '2');
    cy.get('#\\/nRows8').should('have.text', '2');

    cy.get('#\\/nColumns').should('have.text', '1');
    cy.get('#\\/nColumns1').should('have.text', '1');
    cy.get('#\\/nColumns2').should('have.text', '1');
    cy.get('#\\/nColumns3').should('have.text', '1');
    cy.get('#\\/nColumns4').should('have.text', '1');
    cy.get('#\\/nColumns5').should('have.text', '1');
    cy.get('#\\/nColumns6').should('have.text', '1');
    cy.get('#\\/nColumns7').should('have.text', '1');
    cy.get('#\\/nColumns8').should('have.text', '1');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 0], ["tuple", 0]]]
      let matrixValue = [[0], [0]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change value')

    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}y{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[xy]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[xy]')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", "x"], ["tuple", "y"]]]
      let matrixValue = [["x"], ["y"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('cannot add rows or columns')

    cy.get('#\\/mi_rowIncrement').click();
    cy.get('#\\/mi_columnIncrement').click();

    cy.log('change value so know that core has responded')
    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get('#\\/A .mjx-mrow').should('contain.text', '[1y]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[1y]')


    cy.get('#\\/matrixSize').should('have.text', '2, 1');
    cy.get('#\\/matrixSize1').should('have.text', '2, 1');
    cy.get('#\\/matrixSize2').should('have.text', '2, 1');
    cy.get('#\\/matrixSize3').should('have.text', '2, 1');
    cy.get('#\\/matrixSize4').should('have.text', '2, 1');
    cy.get('#\\/matrixSize5').should('have.text', '2, 1');
    cy.get('#\\/matrixSize6').should('have.text', '2, 1');
    cy.get('#\\/matrixSize7').should('have.text', '2, 1');
    cy.get('#\\/matrixSize8').should('have.text', '2, 1');

    cy.get('#\\/nRows').should('have.text', '2');
    cy.get('#\\/nRows1').should('have.text', '2');
    cy.get('#\\/nRows2').should('have.text', '2');
    cy.get('#\\/nRows3').should('have.text', '2');
    cy.get('#\\/nRows4').should('have.text', '2');
    cy.get('#\\/nRows5').should('have.text', '2');
    cy.get('#\\/nRows6').should('have.text', '2');
    cy.get('#\\/nRows7').should('have.text', '2');
    cy.get('#\\/nRows8').should('have.text', '2');

    cy.get('#\\/nColumns').should('have.text', '1');
    cy.get('#\\/nColumns1').should('have.text', '1');
    cy.get('#\\/nColumns2').should('have.text', '1');
    cy.get('#\\/nColumns3').should('have.text', '1');
    cy.get('#\\/nColumns4').should('have.text', '1');
    cy.get('#\\/nColumns5').should('have.text', '1');
    cy.get('#\\/nColumns6').should('have.text', '1');
    cy.get('#\\/nColumns7').should('have.text', '1');
    cy.get('#\\/nColumns8').should('have.text', '1');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 1], ["tuple", "y"]]]
      let matrixValue = [[1], ["y"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('change value 2,3')

    cy.get('#\\/mi2_component_0_0 textarea').type("{end}{backspace}a{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_1_0 textarea').type("{end}{backspace}b{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[ab]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[ab]')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", "a"], ["tuple", "b"]]]
      let matrixValue = [["a"], ["b"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('change value 4,5')

    cy.get('#\\/mi4_component_0_0 textarea').type("{end}{backspace}c{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_1_0 textarea').type("{end}{backspace}d{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[cd]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[cd]')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", "c"], ["tuple", "d"]]]
      let matrixValue = [["c"], ["d"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('change value 6,7')

    cy.get('#\\/mi6_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true }).blur()
    cy.get('#\\/mi7_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[ef]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[ef]')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", "e"], ["tuple", "f"]]]
      let matrixValue = [["e"], ["f"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });



    cy.log('change value 8, orig')

    cy.get('#\\/mi8_component_0_0 textarea').type("{end}{backspace}g{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_1_0 textarea').type("{end}{backspace}h{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[gh]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[gh]')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", "g"], ["tuple", "h"]]]
      let matrixValue = [["g"], ["h"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 1]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });



  })

  it('specify nColumns, get 1 row, 1x2 matrix of zeros', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>A: <matrix name="A" nColumns="2" /></p>
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
      nRows: <integer copySource="A.nRows" name="nRows" />,
      nColumns: <integer copySource="A.nColumns" name="nColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      nRows 1: <integer copySource="A1.nRows" name="nRows1" />,
      nColumns 1: <integer copySource="A1.nColumns" name="nColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      nRows 2: <integer copySource="A2.nRows" name="nRows2" />,
      nColumns 2: <integer copySource="A2.nColumns" name="nColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      nRows 3: <integer copySource="A3.nRows" name="nRows3" />,
      nColumns 3: <integer copySource="A3.nColumns" name="nColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      nRows 4: <integer copySource="A4.nRows" name="nRows4" />,
      nColumns 4: <integer copySource="A4.nColumns" name="nColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      nRows 5: <integer copySource="A5.nRows" name="nRows5" />,
      nColumns 5: <integer copySource="A5.nColumns" name="nColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      nRows 6: <integer copySource="A6.nRows" name="nRows6" />,
      nColumns 6: <integer copySource="A6.nColumns" name="nColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      nRows 7: <integer copySource="A7.nRows" name="nRows7" />,
      nColumns 7: <integer copySource="A7.nColumns" name="nColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      nRows 8: <integer copySource="A8.nRows" name="nRows8" />,
      nColumns 8: <integer copySource="A8.nColumns" name="nColumns8" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[00]')

    cy.get('#\\/matrixSize').should('have.text', '1, 2');
    cy.get('#\\/matrixSize1').should('have.text', '1, 2');
    cy.get('#\\/matrixSize2').should('have.text', '1, 2');
    cy.get('#\\/matrixSize3').should('have.text', '1, 2');
    cy.get('#\\/matrixSize4').should('have.text', '1, 2');
    cy.get('#\\/matrixSize5').should('have.text', '1, 2');
    cy.get('#\\/matrixSize6').should('have.text', '1, 2');
    cy.get('#\\/matrixSize7').should('have.text', '1, 2');
    cy.get('#\\/matrixSize8').should('have.text', '1, 2');

    cy.get('#\\/nRows').should('have.text', '1');
    cy.get('#\\/nRows1').should('have.text', '1');
    cy.get('#\\/nRows2').should('have.text', '1');
    cy.get('#\\/nRows3').should('have.text', '1');
    cy.get('#\\/nRows4').should('have.text', '1');
    cy.get('#\\/nRows5').should('have.text', '1');
    cy.get('#\\/nRows6').should('have.text', '1');
    cy.get('#\\/nRows7').should('have.text', '1');
    cy.get('#\\/nRows8').should('have.text', '1');

    cy.get('#\\/nColumns').should('have.text', '2');
    cy.get('#\\/nColumns1').should('have.text', '2');
    cy.get('#\\/nColumns2').should('have.text', '2');
    cy.get('#\\/nColumns3').should('have.text', '2');
    cy.get('#\\/nColumns4').should('have.text', '2');
    cy.get('#\\/nColumns5').should('have.text', '2');
    cy.get('#\\/nColumns6').should('have.text', '2');
    cy.get('#\\/nColumns7').should('have.text', '2');
    cy.get('#\\/nColumns8').should('have.text', '2');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 0, 0]]]
      let matrixValue = [[0, 0]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change value')

    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}y{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[xy]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[xy]')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", "x", "y"]]]
      let matrixValue = [["x", "y"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('cannot add rows or columns')

    cy.get('#\\/mi_rowIncrement').click();
    cy.get('#\\/mi_columnIncrement').click();

    cy.log('change value so know that core has responded')
    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get('#\\/A .mjx-mrow').should('contain.text', '[1y]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[1y]')


    cy.get('#\\/matrixSize').should('have.text', '1, 2');
    cy.get('#\\/matrixSize1').should('have.text', '1, 2');
    cy.get('#\\/matrixSize2').should('have.text', '1, 2');
    cy.get('#\\/matrixSize3').should('have.text', '1, 2');
    cy.get('#\\/matrixSize4').should('have.text', '1, 2');
    cy.get('#\\/matrixSize5').should('have.text', '1, 2');
    cy.get('#\\/matrixSize6').should('have.text', '1, 2');
    cy.get('#\\/matrixSize7').should('have.text', '1, 2');
    cy.get('#\\/matrixSize8').should('have.text', '1, 2');

    cy.get('#\\/nRows').should('have.text', '1');
    cy.get('#\\/nRows1').should('have.text', '1');
    cy.get('#\\/nRows2').should('have.text', '1');
    cy.get('#\\/nRows3').should('have.text', '1');
    cy.get('#\\/nRows4').should('have.text', '1');
    cy.get('#\\/nRows5').should('have.text', '1');
    cy.get('#\\/nRows6').should('have.text', '1');
    cy.get('#\\/nRows7').should('have.text', '1');
    cy.get('#\\/nRows8').should('have.text', '1');

    cy.get('#\\/nColumns').should('have.text', '2');
    cy.get('#\\/nColumns1').should('have.text', '2');
    cy.get('#\\/nColumns2').should('have.text', '2');
    cy.get('#\\/nColumns3').should('have.text', '2');
    cy.get('#\\/nColumns4').should('have.text', '2');
    cy.get('#\\/nColumns5').should('have.text', '2');
    cy.get('#\\/nColumns6').should('have.text', '2');
    cy.get('#\\/nColumns7').should('have.text', '2');
    cy.get('#\\/nColumns8').should('have.text', '2');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 1, "y"]]]
      let matrixValue = [[1, "y"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('change value 2,3')

    cy.get('#\\/mi2_component_0_0 textarea').type("{end}{backspace}a{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_0_1 textarea').type("{end}{backspace}b{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[ab]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[ab]')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", "a", "b"]]]
      let matrixValue = [["a", "b"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('change value 4,5')

    cy.get('#\\/mi4_component_0_0 textarea').type("{end}{backspace}c{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_0_1 textarea').type("{end}{backspace}d{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[cd]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[cd]')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", "c", "d"]]]
      let matrixValue = [["c", "d"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('change value 6,7')

    cy.get('#\\/mi6_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true }).blur()
    cy.get('#\\/mi7_component_0_1 textarea').type("{end}{backspace}f{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[ef]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[ef]')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", "e", "f"]]]
      let matrixValue = [["e", "f"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });



    cy.log('change value 8, orig')

    cy.get('#\\/mi8_component_0_0 textarea').type("{end}{backspace}g{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_0_1 textarea').type("{end}{backspace}h{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[gh]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[gh]')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", "g", "h"]]]
      let matrixValue = [["g", "h"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([1, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });



  })

  it('2x3 matrix by rows', () => {
    cy.window().then(async (win) => {
      win.postMessage({
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
      nRows: <integer copySource="A.nRows" name="nRows" />,
      nColumns: <integer copySource="A.nColumns" name="nColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      nRows 1: <integer copySource="A1.nRows" name="nRows1" />,
      nColumns 1: <integer copySource="A1.nColumns" name="nColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      nRows 2: <integer copySource="A2.nRows" name="nRows2" />,
      nColumns 2: <integer copySource="A2.nColumns" name="nColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      nRows 3: <integer copySource="A3.nRows" name="nRows3" />,
      nColumns 3: <integer copySource="A3.nColumns" name="nColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      nRows 4: <integer copySource="A4.nRows" name="nRows4" />,
      nColumns 4: <integer copySource="A4.nColumns" name="nColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      nRows 5: <integer copySource="A5.nRows" name="nRows5" />,
      nColumns 5: <integer copySource="A5.nColumns" name="nColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      nRows 6: <integer copySource="A6.nRows" name="nRows6" />,
      nColumns 6: <integer copySource="A6.nColumns" name="nColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      nRows 7: <integer copySource="A7.nRows" name="nRows7" />,
      nColumns 7: <integer copySource="A7.nColumns" name="nColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      nRows 8: <integer copySource="A8.nRows" name="nRows8" />,
      nColumns 8: <integer copySource="A8.nColumns" name="nColumns8" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi3_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi3_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi4_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi4_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi5_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi5_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi6_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi6_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi7_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi7_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi8_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi8_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get('#\\/matrixSize').should('have.text', '2, 3');
    cy.get('#\\/matrixSize1').should('have.text', '2, 3');
    cy.get('#\\/matrixSize2').should('have.text', '2, 3');
    cy.get('#\\/matrixSize3').should('have.text', '2, 3');
    cy.get('#\\/matrixSize4').should('have.text', '2, 3');
    cy.get('#\\/matrixSize5').should('have.text', '2, 3');
    cy.get('#\\/matrixSize6').should('have.text', '2, 3');
    cy.get('#\\/matrixSize7').should('have.text', '2, 3');
    cy.get('#\\/matrixSize8').should('have.text', '2, 3');

    cy.get('#\\/nRows').should('have.text', '2');
    cy.get('#\\/nRows1').should('have.text', '2');
    cy.get('#\\/nRows2').should('have.text', '2');
    cy.get('#\\/nRows3').should('have.text', '2');
    cy.get('#\\/nRows4').should('have.text', '2');
    cy.get('#\\/nRows5').should('have.text', '2');
    cy.get('#\\/nRows6').should('have.text', '2');
    cy.get('#\\/nRows7').should('have.text', '2');
    cy.get('#\\/nRows8').should('have.text', '2');

    cy.get('#\\/nColumns').should('have.text', '3');
    cy.get('#\\/nColumns1').should('have.text', '3');
    cy.get('#\\/nColumns2').should('have.text', '3');
    cy.get('#\\/nColumns3').should('have.text', '3');
    cy.get('#\\/nColumns4').should('have.text', '3');
    cy.get('#\\/nColumns5').should('have.text', '3');
    cy.get('#\\/nColumns6').should('have.text', '3');
    cy.get('#\\/nColumns7').should('have.text', '3');
    cy.get('#\\/nColumns8').should('have.text', '3');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 3], ["tuple", ["tuple", "a", "b", "c"], ["tuple", "d", "e", "f"]]]
      let matrixValue = [["a", "b", "c"], ["d", "e", "f"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change value')

    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_0_1 textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_0_2 textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_1_0 textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_1_1 textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_1_2 textarea').type("{end}{backspace}w{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[xyzuvw]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi3_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi3_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi4_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi4_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi5_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi5_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi6_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi6_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi7_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi7_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi8_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi8_component_1_2 .mq-editable-field`).should('have.text', 'w')



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 3], ["tuple", ["tuple", "x", "y", "z"], ["tuple", "u", "v", "w"]]]
      let matrixValue = [["x", "y", "z"], ["u", "v", "w"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('cannot remove rows or columns')

    cy.get('#\\/mi_rowDecrement').click();
    cy.get('#\\/mi_columnDecrement').click();

    cy.log('change value so know that core has responded')
    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get('#\\/A .mjx-mrow').should('contain.text', '[1yzuvw]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi3_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi3_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi4_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi4_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi5_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi5_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi6_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi6_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi7_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi7_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi8_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi8_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get('#\\/matrixSize').should('have.text', '2, 3');
    cy.get('#\\/matrixSize1').should('have.text', '2, 3');
    cy.get('#\\/matrixSize2').should('have.text', '2, 3');
    cy.get('#\\/matrixSize3').should('have.text', '2, 3');
    cy.get('#\\/matrixSize4').should('have.text', '2, 3');
    cy.get('#\\/matrixSize5').should('have.text', '2, 3');
    cy.get('#\\/matrixSize6').should('have.text', '2, 3');
    cy.get('#\\/matrixSize7').should('have.text', '2, 3');
    cy.get('#\\/matrixSize8').should('have.text', '2, 3');

    cy.get('#\\/nRows').should('have.text', '2');
    cy.get('#\\/nRows1').should('have.text', '2');
    cy.get('#\\/nRows2').should('have.text', '2');
    cy.get('#\\/nRows3').should('have.text', '2');
    cy.get('#\\/nRows4').should('have.text', '2');
    cy.get('#\\/nRows5').should('have.text', '2');
    cy.get('#\\/nRows6').should('have.text', '2');
    cy.get('#\\/nRows7').should('have.text', '2');
    cy.get('#\\/nRows8').should('have.text', '2');

    cy.get('#\\/nColumns').should('have.text', '3');
    cy.get('#\\/nColumns1').should('have.text', '3');
    cy.get('#\\/nColumns2').should('have.text', '3');
    cy.get('#\\/nColumns3').should('have.text', '3');
    cy.get('#\\/nColumns4').should('have.text', '3');
    cy.get('#\\/nColumns5').should('have.text', '3');
    cy.get('#\\/nColumns6').should('have.text', '3');
    cy.get('#\\/nColumns7').should('have.text', '3');
    cy.get('#\\/nColumns8').should('have.text', '3');



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 3], ["tuple", ["tuple", 1, "y", "z"], ["tuple", "u", "v", "w"]]]
      let matrixValue = [[1, "y", "z"], ["u", "v", "w"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });



    cy.log('change value, 1-4')

    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_0_1 textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_0_2 textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_1_0 textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_1_2 textarea').type("{end}{backspace}r{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[mnopqr]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi3_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi3_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi4_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi4_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi5_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi5_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi6_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi6_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi7_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi7_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi8_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi8_component_1_2 .mq-editable-field`).should('have.text', 'r')



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 3], ["tuple", ["tuple", "m", "n", "o"], ["tuple", "p", "q", "r"]]]
      let matrixValue = [["m", "n", "o"], ["p", "q", "r"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('change value, 5-8')

    cy.get('#\\/mi5_component_0_0 textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_0_1 textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get('#\\/mi7_component_0_2 textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get('#\\/mi8_component_1_0 textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_1_1 textarea').type("{end}{backspace}w{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_1_2 textarea').type("{end}{backspace}x{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[stuvwx]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi3_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi3_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi4_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi4_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi5_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi5_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi6_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi6_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi7_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi7_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi8_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi8_component_1_2 .mq-editable-field`).should('have.text', 'x')



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 3], ["tuple", ["tuple", "s", "t", "u"], ["tuple", "v", "w", "x"]]]
      let matrixValue = [["s", "t", "u"], ["v", "w", "x"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });



  })

  it('2x3 matrix by columns', () => {
    cy.window().then(async (win) => {
      win.postMessage({
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
      nRows: <integer copySource="A.nRows" name="nRows" />,
      nColumns: <integer copySource="A.nColumns" name="nColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      nRows 1: <integer copySource="A1.nRows" name="nRows1" />,
      nColumns 1: <integer copySource="A1.nColumns" name="nColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      nRows 2: <integer copySource="A2.nRows" name="nRows2" />,
      nColumns 2: <integer copySource="A2.nColumns" name="nColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      nRows 3: <integer copySource="A3.nRows" name="nRows3" />,
      nColumns 3: <integer copySource="A3.nColumns" name="nColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      nRows 4: <integer copySource="A4.nRows" name="nRows4" />,
      nColumns 4: <integer copySource="A4.nColumns" name="nColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      nRows 5: <integer copySource="A5.nRows" name="nRows5" />,
      nColumns 5: <integer copySource="A5.nColumns" name="nColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      nRows 6: <integer copySource="A6.nRows" name="nRows6" />,
      nColumns 6: <integer copySource="A6.nColumns" name="nColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      nRows 7: <integer copySource="A7.nRows" name="nRows7" />,
      nColumns 7: <integer copySource="A7.nColumns" name="nColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      nRows 8: <integer copySource="A8.nRows" name="nRows8" />,
      nColumns 8: <integer copySource="A8.nColumns" name="nColumns8" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi3_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi3_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi4_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi4_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi5_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi5_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi6_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi6_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi7_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi7_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi8_component_0_2 .mq-editable-field`).should('have.text', 'c')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi8_component_1_2 .mq-editable-field`).should('have.text', 'f')

    cy.get('#\\/matrixSize').should('have.text', '2, 3');
    cy.get('#\\/matrixSize1').should('have.text', '2, 3');
    cy.get('#\\/matrixSize2').should('have.text', '2, 3');
    cy.get('#\\/matrixSize3').should('have.text', '2, 3');
    cy.get('#\\/matrixSize4').should('have.text', '2, 3');
    cy.get('#\\/matrixSize5').should('have.text', '2, 3');
    cy.get('#\\/matrixSize6').should('have.text', '2, 3');
    cy.get('#\\/matrixSize7').should('have.text', '2, 3');
    cy.get('#\\/matrixSize8').should('have.text', '2, 3');

    cy.get('#\\/nRows').should('have.text', '2');
    cy.get('#\\/nRows1').should('have.text', '2');
    cy.get('#\\/nRows2').should('have.text', '2');
    cy.get('#\\/nRows3').should('have.text', '2');
    cy.get('#\\/nRows4').should('have.text', '2');
    cy.get('#\\/nRows5').should('have.text', '2');
    cy.get('#\\/nRows6').should('have.text', '2');
    cy.get('#\\/nRows7').should('have.text', '2');
    cy.get('#\\/nRows8').should('have.text', '2');

    cy.get('#\\/nColumns').should('have.text', '3');
    cy.get('#\\/nColumns1').should('have.text', '3');
    cy.get('#\\/nColumns2').should('have.text', '3');
    cy.get('#\\/nColumns3').should('have.text', '3');
    cy.get('#\\/nColumns4').should('have.text', '3');
    cy.get('#\\/nColumns5').should('have.text', '3');
    cy.get('#\\/nColumns6').should('have.text', '3');
    cy.get('#\\/nColumns7').should('have.text', '3');
    cy.get('#\\/nColumns8').should('have.text', '3');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 3], ["tuple", ["tuple", "a", "b", "c"], ["tuple", "d", "e", "f"]]]
      let matrixValue = [["a", "b", "c"], ["d", "e", "f"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change value')

    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_0_1 textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_0_2 textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_1_0 textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_1_1 textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_1_2 textarea').type("{end}{backspace}w{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[xyzuvw]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi3_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi3_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi4_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi4_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi5_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi5_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi6_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi6_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi7_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi7_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi8_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi8_component_1_2 .mq-editable-field`).should('have.text', 'w')



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 3], ["tuple", ["tuple", "x", "y", "z"], ["tuple", "u", "v", "w"]]]
      let matrixValue = [["x", "y", "z"], ["u", "v", "w"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('cannot remove rows or columns')

    cy.get('#\\/mi_rowDecrement').click();
    cy.get('#\\/mi_columnDecrement').click();

    cy.log('change value so know that core has responded')
    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get('#\\/A .mjx-mrow').should('contain.text', '[1yzuvw]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi3_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi3_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi4_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi4_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi5_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi5_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi6_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi6_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi7_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi7_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi8_component_0_2 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi8_component_1_2 .mq-editable-field`).should('have.text', 'w')

    cy.get('#\\/matrixSize').should('have.text', '2, 3');
    cy.get('#\\/matrixSize1').should('have.text', '2, 3');
    cy.get('#\\/matrixSize2').should('have.text', '2, 3');
    cy.get('#\\/matrixSize3').should('have.text', '2, 3');
    cy.get('#\\/matrixSize4').should('have.text', '2, 3');
    cy.get('#\\/matrixSize5').should('have.text', '2, 3');
    cy.get('#\\/matrixSize6').should('have.text', '2, 3');
    cy.get('#\\/matrixSize7').should('have.text', '2, 3');
    cy.get('#\\/matrixSize8').should('have.text', '2, 3');

    cy.get('#\\/nRows').should('have.text', '2');
    cy.get('#\\/nRows1').should('have.text', '2');
    cy.get('#\\/nRows2').should('have.text', '2');
    cy.get('#\\/nRows3').should('have.text', '2');
    cy.get('#\\/nRows4').should('have.text', '2');
    cy.get('#\\/nRows5').should('have.text', '2');
    cy.get('#\\/nRows6').should('have.text', '2');
    cy.get('#\\/nRows7').should('have.text', '2');
    cy.get('#\\/nRows8').should('have.text', '2');

    cy.get('#\\/nColumns').should('have.text', '3');
    cy.get('#\\/nColumns1').should('have.text', '3');
    cy.get('#\\/nColumns2').should('have.text', '3');
    cy.get('#\\/nColumns3').should('have.text', '3');
    cy.get('#\\/nColumns4').should('have.text', '3');
    cy.get('#\\/nColumns5').should('have.text', '3');
    cy.get('#\\/nColumns6').should('have.text', '3');
    cy.get('#\\/nColumns7').should('have.text', '3');
    cy.get('#\\/nColumns8').should('have.text', '3');



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 3], ["tuple", ["tuple", 1, "y", "z"], ["tuple", "u", "v", "w"]]]
      let matrixValue = [[1, "y", "z"], ["u", "v", "w"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });



    cy.log('change value, 1-4')

    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_0_1 textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_0_2 textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_1_0 textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_1_2 textarea').type("{end}{backspace}r{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[mnopqr]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi3_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi3_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi4_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi4_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi5_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi5_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi6_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi6_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi7_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi7_component_1_2 .mq-editable-field`).should('have.text', 'r')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 'm')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'n')
    cy.get(`#\\/mi8_component_0_2 .mq-editable-field`).should('have.text', 'o')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'p')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'q')
    cy.get(`#\\/mi8_component_1_2 .mq-editable-field`).should('have.text', 'r')



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 3], ["tuple", ["tuple", "m", "n", "o"], ["tuple", "p", "q", "r"]]]
      let matrixValue = [["m", "n", "o"], ["p", "q", "r"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('change value, 5-8')

    cy.get('#\\/mi5_component_0_0 textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_0_1 textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get('#\\/mi7_component_0_2 textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get('#\\/mi8_component_1_0 textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_1_1 textarea').type("{end}{backspace}w{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_1_2 textarea').type("{end}{backspace}x{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[stuvwx]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi3_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi3_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi4_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi4_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi5_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi5_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi6_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi6_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi7_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi7_component_1_2 .mq-editable-field`).should('have.text', 'x')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 's')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 't')
    cy.get(`#\\/mi8_component_0_2 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'w')
    cy.get(`#\\/mi8_component_1_2 .mq-editable-field`).should('have.text', 'x')



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 3], ["tuple", ["tuple", "s", "t", "u"], ["tuple", "v", "w", "x"]]]
      let matrixValue = [["s", "t", "u"], ["v", "w", "x"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi8'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });



  })

  it('3x2 matrix, rows, change size', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>nRows: <mathinput name="mi_nRows" prefill="3" />,
      nColumns: <mathinput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" nRows="$mi_nRows" nColumns="$mi_nColumns" >
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
      nRows: <integer copySource="A.nRows" name="nRows" />,
      nColumns: <integer copySource="A.nColumns" name="nColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      nRows 1: <integer copySource="A1.nRows" name="nRows1" />,
      nColumns 1: <integer copySource="A1.nColumns" name="nColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      nRows 2: <integer copySource="A2.nRows" name="nRows2" />,
      nColumns 2: <integer copySource="A2.nColumns" name="nColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      nRows 3: <integer copySource="A3.nRows" name="nRows3" />,
      nColumns 3: <integer copySource="A3.nColumns" name="nColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      nRows 4: <integer copySource="A4.nRows" name="nRows4" />,
      nColumns 4: <integer copySource="A4.nColumns" name="nColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      nRows 5: <integer copySource="A5.nRows" name="nRows5" />,
      nColumns 5: <integer copySource="A5.nColumns" name="nColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      nRows 6: <integer copySource="A6.nRows" name="nRows6" />,
      nColumns 6: <integer copySource="A6.nColumns" name="nColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      nRows 7: <integer copySource="A7.nRows" name="nRows7" />,
      nColumns 7: <integer copySource="A7.nColumns" name="nColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      nRows 8: <integer copySource="A8.nRows" name="nRows8" />,
      nColumns 8: <integer copySource="A8.nColumns" name="nColumns8" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi2_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi2_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi3_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi3_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi4_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi4_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi5_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi5_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi6_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi6_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi7_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi7_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi8_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi8_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get('#\\/matrixSize').should('have.text', '3, 2');
    cy.get('#\\/matrixSize1').should('have.text', '3, 2');
    cy.get('#\\/matrixSize2').should('have.text', '3, 2');
    cy.get('#\\/matrixSize3').should('have.text', '3, 2');
    cy.get('#\\/matrixSize4').should('have.text', '3, 2');
    cy.get('#\\/matrixSize5').should('have.text', '3, 2');
    cy.get('#\\/matrixSize6').should('have.text', '3, 2');
    cy.get('#\\/matrixSize7').should('have.text', '3, 2');
    cy.get('#\\/matrixSize8').should('have.text', '3, 2');

    cy.get('#\\/nRows').should('have.text', '3');
    cy.get('#\\/nRows1').should('have.text', '3');
    cy.get('#\\/nRows2').should('have.text', '3');
    cy.get('#\\/nRows3').should('have.text', '3');
    cy.get('#\\/nRows4').should('have.text', '3');
    cy.get('#\\/nRows5').should('have.text', '3');
    cy.get('#\\/nRows6').should('have.text', '3');
    cy.get('#\\/nRows7').should('have.text', '3');
    cy.get('#\\/nRows8').should('have.text', '3');

    cy.get('#\\/nColumns').should('have.text', '2');
    cy.get('#\\/nColumns1').should('have.text', '2');
    cy.get('#\\/nColumns2').should('have.text', '2');
    cy.get('#\\/nColumns3').should('have.text', '2');
    cy.get('#\\/nColumns4').should('have.text', '2');
    cy.get('#\\/nColumns5').should('have.text', '2');
    cy.get('#\\/nColumns6').should('have.text', '2');
    cy.get('#\\/nColumns7').should('have.text', '2');
    cy.get('#\\/nColumns8').should('have.text', '2');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", "a", "b"], ["tuple", "d", "e"], ["tuple", 0, 0]]]
      let matrixValue = [["a", "b"], ["d", "e"], [0, 0]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change value')

    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_1_0 textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_1_1 textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_2_0 textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_2_1 textarea').type("{end}{backspace}w{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣xyzuvw⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi2_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi2_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi3_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi3_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi4_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi4_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi5_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi5_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi6_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi6_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi7_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi7_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi8_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi8_component_2_1 .mq-editable-field`).should('have.text', 'w')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", "x", "y"], ["tuple", "z", "u"], ["tuple", "v", "w"]]]
      let matrixValue = [["x", "y"], ["z", "u"], ["v", "w"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('cannot remove rows or columns')

    cy.get('#\\/mi_rowDecrement').click();
    cy.get('#\\/mi_columnDecrement').click();

    cy.log('change value so know that core has responded')
    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣1yzuvw⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get('#\\/matrixSize').should('have.text', '3, 2');
    cy.get('#\\/matrixSize1').should('have.text', '3, 2');
    cy.get('#\\/matrixSize2').should('have.text', '3, 2');
    cy.get('#\\/matrixSize3').should('have.text', '3, 2');
    cy.get('#\\/matrixSize4').should('have.text', '3, 2');
    cy.get('#\\/matrixSize5').should('have.text', '3, 2');
    cy.get('#\\/matrixSize6').should('have.text', '3, 2');
    cy.get('#\\/matrixSize7').should('have.text', '3, 2');
    cy.get('#\\/matrixSize8').should('have.text', '3, 2');

    cy.get('#\\/nRows').should('have.text', '3');
    cy.get('#\\/nRows1').should('have.text', '3');
    cy.get('#\\/nRows2').should('have.text', '3');
    cy.get('#\\/nRows3').should('have.text', '3');
    cy.get('#\\/nRows4').should('have.text', '3');
    cy.get('#\\/nRows5').should('have.text', '3');
    cy.get('#\\/nRows6').should('have.text', '3');
    cy.get('#\\/nRows7').should('have.text', '3');
    cy.get('#\\/nRows8').should('have.text', '3');

    cy.get('#\\/nColumns').should('have.text', '2');
    cy.get('#\\/nColumns1').should('have.text', '2');
    cy.get('#\\/nColumns2').should('have.text', '2');
    cy.get('#\\/nColumns3').should('have.text', '2');
    cy.get('#\\/nColumns4').should('have.text', '2');
    cy.get('#\\/nColumns5').should('have.text', '2');
    cy.get('#\\/nColumns6').should('have.text', '2');
    cy.get('#\\/nColumns7').should('have.text', '2');
    cy.get('#\\/nColumns8').should('have.text', '2');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 1, "y"], ["tuple", "z", "u"], ["tuple", "v", "w"]]]
      let matrixValue = [[1, "y"], ["z", "u"], ["v", "w"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('increase to 4 columns')

    cy.get("#\\/mi_nColumns textarea").type("{end}{backspace}4{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')

    cy.get('#\\/matrixSize').should('have.text', '3, 4');
    cy.get('#\\/matrixSize1').should('have.text', '3, 4');
    cy.get('#\\/matrixSize2').should('have.text', '3, 4');
    cy.get('#\\/matrixSize3').should('have.text', '3, 4');
    cy.get('#\\/matrixSize4').should('have.text', '3, 4');
    cy.get('#\\/matrixSize5').should('have.text', '3, 4');
    cy.get('#\\/matrixSize6').should('have.text', '3, 4');
    cy.get('#\\/matrixSize7').should('have.text', '3, 4');
    cy.get('#\\/matrixSize8').should('have.text', '3, 4');

    cy.get('#\\/nRows').should('have.text', '3');
    cy.get('#\\/nRows1').should('have.text', '3');
    cy.get('#\\/nRows2').should('have.text', '3');
    cy.get('#\\/nRows3').should('have.text', '3');
    cy.get('#\\/nRows4').should('have.text', '3');
    cy.get('#\\/nRows5').should('have.text', '3');
    cy.get('#\\/nRows6').should('have.text', '3');
    cy.get('#\\/nRows7').should('have.text', '3');
    cy.get('#\\/nRows8').should('have.text', '3');

    cy.get('#\\/nColumns').should('have.text', '4');
    cy.get('#\\/nColumns1').should('have.text', '4');
    cy.get('#\\/nColumns2').should('have.text', '4');
    cy.get('#\\/nColumns3').should('have.text', '4');
    cy.get('#\\/nColumns4').should('have.text', '4');
    cy.get('#\\/nColumns5').should('have.text', '4');
    cy.get('#\\/nColumns6').should('have.text', '4');
    cy.get('#\\/nColumns7').should('have.text', '4');
    cy.get('#\\/nColumns8').should('have.text', '4');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 4], ["tuple", ["tuple", 1, "y", "c", 0], ["tuple", "z", "u", "f", 0], ["tuple", "v", "w", 0, 0]]]
      let matrixValue = [[1, "y", "c", 0], ["z", "u", "f", 0], ["v", "w", 0, 0]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 4]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('change values')

    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}g{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}h{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_0_2 textarea').type("{end}{backspace}i{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_0_3 textarea').type("{end}{backspace}j{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_1_0 textarea').type("{end}{backspace}k{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_1_1 textarea').type("{end}{backspace}l{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_1_2 textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get('#\\/mi7_component_1_3 textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get('#\\/mi8_component_2_0 textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_2_1 textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_2_2 textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_2_3 textarea').type("{end}{backspace}r{enter}", { force: true }).blur()


    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 4], ["tuple", ["tuple", "g", "h", "i", "j"], ["tuple", "k", "l", "m", "n"], ["tuple", "o", "p", "q", "r"]]]
      let matrixValue = [["g", "h", "i", "j"], ["k", "l", "m", "n"], ["o", "p", "q", "r"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 4]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('decrease to 1 row')

    cy.get("#\\/mi_nRows textarea").type("{end}{backspace}1{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[ghij]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[ghij]')


    cy.get('#\\/matrixSize').should('have.text', '1, 4');
    cy.get('#\\/matrixSize1').should('have.text', '1, 4');
    cy.get('#\\/matrixSize2').should('have.text', '1, 4');
    cy.get('#\\/matrixSize3').should('have.text', '1, 4');
    cy.get('#\\/matrixSize4').should('have.text', '1, 4');
    cy.get('#\\/matrixSize5').should('have.text', '1, 4');
    cy.get('#\\/matrixSize6').should('have.text', '1, 4');
    cy.get('#\\/matrixSize7').should('have.text', '1, 4');
    cy.get('#\\/matrixSize8').should('have.text', '1, 4');

    cy.get('#\\/nRows').should('have.text', '1');
    cy.get('#\\/nRows1').should('have.text', '1');
    cy.get('#\\/nRows2').should('have.text', '1');
    cy.get('#\\/nRows3').should('have.text', '1');
    cy.get('#\\/nRows4').should('have.text', '1');
    cy.get('#\\/nRows5').should('have.text', '1');
    cy.get('#\\/nRows6').should('have.text', '1');
    cy.get('#\\/nRows7').should('have.text', '1');
    cy.get('#\\/nRows8').should('have.text', '1');

    cy.get('#\\/nColumns').should('have.text', '4');
    cy.get('#\\/nColumns1').should('have.text', '4');
    cy.get('#\\/nColumns2').should('have.text', '4');
    cy.get('#\\/nColumns3').should('have.text', '4');
    cy.get('#\\/nColumns4').should('have.text', '4');
    cy.get('#\\/nColumns5').should('have.text', '4');
    cy.get('#\\/nColumns6').should('have.text', '4');
    cy.get('#\\/nColumns7').should('have.text', '4');
    cy.get('#\\/nColumns8').should('have.text', '4');



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 4], ["tuple", ["tuple", "g", "h", "i", "j"]]]
      let matrixValue = [["g", "h", "i", "j"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([1, 4]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change values')

    cy.get('#\\/mi3_component_0_0 textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_0_1 textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_0_2 textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_0_3 textarea').type("{end}{backspace}v{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[stuv]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[stuv]')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 4], ["tuple", ["tuple", "s", "t", "u", "v"]]]
      let matrixValue = [["s", "t", "u", "v"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([1, 4]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('up to 2 rows')

    cy.get("#\\/mi_nRows textarea").type("{end}{backspace}2{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[stuvklmn]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')



    cy.get('#\\/matrixSize').should('have.text', '2, 4');
    cy.get('#\\/matrixSize1').should('have.text', '2, 4');
    cy.get('#\\/matrixSize2').should('have.text', '2, 4');
    cy.get('#\\/matrixSize3').should('have.text', '2, 4');
    cy.get('#\\/matrixSize4').should('have.text', '2, 4');
    cy.get('#\\/matrixSize5').should('have.text', '2, 4');
    cy.get('#\\/matrixSize6').should('have.text', '2, 4');
    cy.get('#\\/matrixSize7').should('have.text', '2, 4');
    cy.get('#\\/matrixSize8').should('have.text', '2, 4');

    cy.get('#\\/nRows').should('have.text', '2');
    cy.get('#\\/nRows1').should('have.text', '2');
    cy.get('#\\/nRows2').should('have.text', '2');
    cy.get('#\\/nRows3').should('have.text', '2');
    cy.get('#\\/nRows4').should('have.text', '2');
    cy.get('#\\/nRows5').should('have.text', '2');
    cy.get('#\\/nRows6').should('have.text', '2');
    cy.get('#\\/nRows7').should('have.text', '2');
    cy.get('#\\/nRows8').should('have.text', '2');

    cy.get('#\\/nColumns').should('have.text', '4');
    cy.get('#\\/nColumns1').should('have.text', '4');
    cy.get('#\\/nColumns2').should('have.text', '4');
    cy.get('#\\/nColumns3').should('have.text', '4');
    cy.get('#\\/nColumns4').should('have.text', '4');
    cy.get('#\\/nColumns5').should('have.text', '4');
    cy.get('#\\/nColumns6').should('have.text', '4');
    cy.get('#\\/nColumns7').should('have.text', '4');
    cy.get('#\\/nColumns8').should('have.text', '4');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 4], ["tuple", ["tuple", "s", "t", "u", "v"], ["tuple", "k", "l", "m", "n"]]]
      let matrixValue = [["s", "t", "u", "v"], ["k", "l", "m", "n"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 4]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });
  })

  it('3x2 matrix, columns, change size', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>nRows: <mathinput name="mi_nRows" prefill="3" />,
      nColumns: <mathinput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" nRows="$mi_nRows" nColumns="$mi_nColumns" >
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
      nRows: <integer copySource="A.nRows" name="nRows" />,
      nColumns: <integer copySource="A.nColumns" name="nColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      nRows 1: <integer copySource="A1.nRows" name="nRows1" />,
      nColumns 1: <integer copySource="A1.nColumns" name="nColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      nRows 2: <integer copySource="A2.nRows" name="nRows2" />,
      nColumns 2: <integer copySource="A2.nColumns" name="nColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      nRows 3: <integer copySource="A3.nRows" name="nRows3" />,
      nColumns 3: <integer copySource="A3.nColumns" name="nColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      nRows 4: <integer copySource="A4.nRows" name="nRows4" />,
      nColumns 4: <integer copySource="A4.nColumns" name="nColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      nRows 5: <integer copySource="A5.nRows" name="nRows5" />,
      nColumns 5: <integer copySource="A5.nColumns" name="nColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      nRows 6: <integer copySource="A6.nRows" name="nRows6" />,
      nColumns 6: <integer copySource="A6.nColumns" name="nColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      nRows 7: <integer copySource="A7.nRows" name="nRows7" />,
      nColumns 7: <integer copySource="A7.nColumns" name="nColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      nRows 8: <integer copySource="A8.nRows" name="nRows8" />,
      nColumns 8: <integer copySource="A8.nColumns" name="nColumns8" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi2_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi2_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi3_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi3_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi4_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi4_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi5_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi5_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi6_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi6_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi7_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi7_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'b')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'e')
    cy.get(`#\\/mi8_component_2_0 .mq-editable-field`).should('have.text', '0')
    cy.get(`#\\/mi8_component_2_1 .mq-editable-field`).should('have.text', '0')

    cy.get('#\\/matrixSize').should('have.text', '3, 2');
    cy.get('#\\/matrixSize1').should('have.text', '3, 2');
    cy.get('#\\/matrixSize2').should('have.text', '3, 2');
    cy.get('#\\/matrixSize3').should('have.text', '3, 2');
    cy.get('#\\/matrixSize4').should('have.text', '3, 2');
    cy.get('#\\/matrixSize5').should('have.text', '3, 2');
    cy.get('#\\/matrixSize6').should('have.text', '3, 2');
    cy.get('#\\/matrixSize7').should('have.text', '3, 2');
    cy.get('#\\/matrixSize8').should('have.text', '3, 2');

    cy.get('#\\/nRows').should('have.text', '3');
    cy.get('#\\/nRows1').should('have.text', '3');
    cy.get('#\\/nRows2').should('have.text', '3');
    cy.get('#\\/nRows3').should('have.text', '3');
    cy.get('#\\/nRows4').should('have.text', '3');
    cy.get('#\\/nRows5').should('have.text', '3');
    cy.get('#\\/nRows6').should('have.text', '3');
    cy.get('#\\/nRows7').should('have.text', '3');
    cy.get('#\\/nRows8').should('have.text', '3');

    cy.get('#\\/nColumns').should('have.text', '2');
    cy.get('#\\/nColumns1').should('have.text', '2');
    cy.get('#\\/nColumns2').should('have.text', '2');
    cy.get('#\\/nColumns3').should('have.text', '2');
    cy.get('#\\/nColumns4').should('have.text', '2');
    cy.get('#\\/nColumns5').should('have.text', '2');
    cy.get('#\\/nColumns6').should('have.text', '2');
    cy.get('#\\/nColumns7').should('have.text', '2');
    cy.get('#\\/nColumns8').should('have.text', '2');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", "a", "b"], ["tuple", "d", "e"], ["tuple", 0, 0]]]
      let matrixValue = [["a", "b"], ["d", "e"], [0, 0]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change value')

    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_1_0 textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_1_1 textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_2_0 textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_2_1 textarea').type("{end}{backspace}w{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣xyzuvw⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi2_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi2_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi3_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi3_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi3_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi3_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi3_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi3_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi4_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi4_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi4_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi4_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi4_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi4_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi5_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi5_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi5_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi5_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi5_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi5_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi6_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi6_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi6_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi6_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi6_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi6_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi7_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi7_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi7_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi7_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi7_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi7_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get(`#\\/mi8_component_0_0 .mq-editable-field`).should('have.text', 'x')
    cy.get(`#\\/mi8_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi8_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi8_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi8_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi8_component_2_1 .mq-editable-field`).should('have.text', 'w')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", "x", "y"], ["tuple", "z", "u"], ["tuple", "v", "w"]]]
      let matrixValue = [["x", "y"], ["z", "u"], ["v", "w"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('cannot remove rows or columns')

    cy.get('#\\/mi_rowDecrement').click();
    cy.get('#\\/mi_columnDecrement').click();

    cy.log('change value so know that core has responded')
    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣1yzuvw⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(`#\\/mi_component_0_0 .mq-editable-field`).should('have.text', '1')
    cy.get(`#\\/mi_component_0_1 .mq-editable-field`).should('have.text', 'y')
    cy.get(`#\\/mi_component_1_0 .mq-editable-field`).should('have.text', 'z')
    cy.get(`#\\/mi_component_1_1 .mq-editable-field`).should('have.text', 'u')
    cy.get(`#\\/mi_component_2_0 .mq-editable-field`).should('have.text', 'v')
    cy.get(`#\\/mi_component_2_1 .mq-editable-field`).should('have.text', 'w')

    cy.get('#\\/matrixSize').should('have.text', '3, 2');
    cy.get('#\\/matrixSize1').should('have.text', '3, 2');
    cy.get('#\\/matrixSize2').should('have.text', '3, 2');
    cy.get('#\\/matrixSize3').should('have.text', '3, 2');
    cy.get('#\\/matrixSize4').should('have.text', '3, 2');
    cy.get('#\\/matrixSize5').should('have.text', '3, 2');
    cy.get('#\\/matrixSize6').should('have.text', '3, 2');
    cy.get('#\\/matrixSize7').should('have.text', '3, 2');
    cy.get('#\\/matrixSize8').should('have.text', '3, 2');

    cy.get('#\\/nRows').should('have.text', '3');
    cy.get('#\\/nRows1').should('have.text', '3');
    cy.get('#\\/nRows2').should('have.text', '3');
    cy.get('#\\/nRows3').should('have.text', '3');
    cy.get('#\\/nRows4').should('have.text', '3');
    cy.get('#\\/nRows5').should('have.text', '3');
    cy.get('#\\/nRows6').should('have.text', '3');
    cy.get('#\\/nRows7').should('have.text', '3');
    cy.get('#\\/nRows8').should('have.text', '3');

    cy.get('#\\/nColumns').should('have.text', '2');
    cy.get('#\\/nColumns1').should('have.text', '2');
    cy.get('#\\/nColumns2').should('have.text', '2');
    cy.get('#\\/nColumns3').should('have.text', '2');
    cy.get('#\\/nColumns4').should('have.text', '2');
    cy.get('#\\/nColumns5').should('have.text', '2');
    cy.get('#\\/nColumns6').should('have.text', '2');
    cy.get('#\\/nColumns7').should('have.text', '2');
    cy.get('#\\/nColumns8').should('have.text', '2');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 1, "y"], ["tuple", "z", "u"], ["tuple", "v", "w"]]]
      let matrixValue = [[1, "y"], ["z", "u"], ["v", "w"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('increase to 4 columns')

    cy.get("#\\/mi_nColumns textarea").type("{end}{backspace}4{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')

    cy.get('#\\/matrixSize').should('have.text', '3, 4');
    cy.get('#\\/matrixSize1').should('have.text', '3, 4');
    cy.get('#\\/matrixSize2').should('have.text', '3, 4');
    cy.get('#\\/matrixSize3').should('have.text', '3, 4');
    cy.get('#\\/matrixSize4').should('have.text', '3, 4');
    cy.get('#\\/matrixSize5').should('have.text', '3, 4');
    cy.get('#\\/matrixSize6').should('have.text', '3, 4');
    cy.get('#\\/matrixSize7').should('have.text', '3, 4');
    cy.get('#\\/matrixSize8').should('have.text', '3, 4');

    cy.get('#\\/nRows').should('have.text', '3');
    cy.get('#\\/nRows1').should('have.text', '3');
    cy.get('#\\/nRows2').should('have.text', '3');
    cy.get('#\\/nRows3').should('have.text', '3');
    cy.get('#\\/nRows4').should('have.text', '3');
    cy.get('#\\/nRows5').should('have.text', '3');
    cy.get('#\\/nRows6').should('have.text', '3');
    cy.get('#\\/nRows7').should('have.text', '3');
    cy.get('#\\/nRows8').should('have.text', '3');

    cy.get('#\\/nColumns').should('have.text', '4');
    cy.get('#\\/nColumns1').should('have.text', '4');
    cy.get('#\\/nColumns2').should('have.text', '4');
    cy.get('#\\/nColumns3').should('have.text', '4');
    cy.get('#\\/nColumns4').should('have.text', '4');
    cy.get('#\\/nColumns5').should('have.text', '4');
    cy.get('#\\/nColumns6').should('have.text', '4');
    cy.get('#\\/nColumns7').should('have.text', '4');
    cy.get('#\\/nColumns8').should('have.text', '4');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 4], ["tuple", ["tuple", 1, "y", "c", 0], ["tuple", "z", "u", "f", 0], ["tuple", "v", "w", 0, 0]]]
      let matrixValue = [[1, "y", "c", 0], ["z", "u", "f", 0], ["v", "w", 0, 0]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 4]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('change values')

    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}g{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}h{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_0_2 textarea').type("{end}{backspace}i{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_0_3 textarea').type("{end}{backspace}j{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_1_0 textarea').type("{end}{backspace}k{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_1_1 textarea').type("{end}{backspace}l{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_1_2 textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get('#\\/mi7_component_1_3 textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get('#\\/mi8_component_2_0 textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_2_1 textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_2_2 textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_2_3 textarea').type("{end}{backspace}r{enter}", { force: true }).blur()


    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 4], ["tuple", ["tuple", "g", "h", "i", "j"], ["tuple", "k", "l", "m", "n"], ["tuple", "o", "p", "q", "r"]]]
      let matrixValue = [["g", "h", "i", "j"], ["k", "l", "m", "n"], ["o", "p", "q", "r"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 4]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('decrease to 1 row')

    cy.get("#\\/mi_nRows textarea").type("{end}{backspace}1{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[ghij]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[ghij]')


    cy.get('#\\/matrixSize').should('have.text', '1, 4');
    cy.get('#\\/matrixSize1').should('have.text', '1, 4');
    cy.get('#\\/matrixSize2').should('have.text', '1, 4');
    cy.get('#\\/matrixSize3').should('have.text', '1, 4');
    cy.get('#\\/matrixSize4').should('have.text', '1, 4');
    cy.get('#\\/matrixSize5').should('have.text', '1, 4');
    cy.get('#\\/matrixSize6').should('have.text', '1, 4');
    cy.get('#\\/matrixSize7').should('have.text', '1, 4');
    cy.get('#\\/matrixSize8').should('have.text', '1, 4');

    cy.get('#\\/nRows').should('have.text', '1');
    cy.get('#\\/nRows1').should('have.text', '1');
    cy.get('#\\/nRows2').should('have.text', '1');
    cy.get('#\\/nRows3').should('have.text', '1');
    cy.get('#\\/nRows4').should('have.text', '1');
    cy.get('#\\/nRows5').should('have.text', '1');
    cy.get('#\\/nRows6').should('have.text', '1');
    cy.get('#\\/nRows7').should('have.text', '1');
    cy.get('#\\/nRows8').should('have.text', '1');

    cy.get('#\\/nColumns').should('have.text', '4');
    cy.get('#\\/nColumns1').should('have.text', '4');
    cy.get('#\\/nColumns2').should('have.text', '4');
    cy.get('#\\/nColumns3').should('have.text', '4');
    cy.get('#\\/nColumns4').should('have.text', '4');
    cy.get('#\\/nColumns5').should('have.text', '4');
    cy.get('#\\/nColumns6').should('have.text', '4');
    cy.get('#\\/nColumns7').should('have.text', '4');
    cy.get('#\\/nColumns8').should('have.text', '4');



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 4], ["tuple", ["tuple", "g", "h", "i", "j"]]]
      let matrixValue = [["g", "h", "i", "j"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([1, 4]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change values')

    cy.get('#\\/mi3_component_0_0 textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_0_1 textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_0_2 textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_0_3 textarea').type("{end}{backspace}v{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[stuv]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[stuv]')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 4], ["tuple", ["tuple", "s", "t", "u", "v"]]]
      let matrixValue = [["s", "t", "u", "v"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([1, 4]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('up to 2 rows')

    cy.get("#\\/mi_nRows textarea").type("{end}{backspace}2{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '[stuvklmn]')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')



    cy.get('#\\/matrixSize').should('have.text', '2, 4');
    cy.get('#\\/matrixSize1').should('have.text', '2, 4');
    cy.get('#\\/matrixSize2').should('have.text', '2, 4');
    cy.get('#\\/matrixSize3').should('have.text', '2, 4');
    cy.get('#\\/matrixSize4').should('have.text', '2, 4');
    cy.get('#\\/matrixSize5').should('have.text', '2, 4');
    cy.get('#\\/matrixSize6').should('have.text', '2, 4');
    cy.get('#\\/matrixSize7').should('have.text', '2, 4');
    cy.get('#\\/matrixSize8').should('have.text', '2, 4');

    cy.get('#\\/nRows').should('have.text', '2');
    cy.get('#\\/nRows1').should('have.text', '2');
    cy.get('#\\/nRows2').should('have.text', '2');
    cy.get('#\\/nRows3').should('have.text', '2');
    cy.get('#\\/nRows4').should('have.text', '2');
    cy.get('#\\/nRows5').should('have.text', '2');
    cy.get('#\\/nRows6').should('have.text', '2');
    cy.get('#\\/nRows7').should('have.text', '2');
    cy.get('#\\/nRows8').should('have.text', '2');

    cy.get('#\\/nColumns').should('have.text', '4');
    cy.get('#\\/nColumns1').should('have.text', '4');
    cy.get('#\\/nColumns2').should('have.text', '4');
    cy.get('#\\/nColumns3').should('have.text', '4');
    cy.get('#\\/nColumns4').should('have.text', '4');
    cy.get('#\\/nColumns5').should('have.text', '4');
    cy.get('#\\/nColumns6').should('have.text', '4');
    cy.get('#\\/nColumns7').should('have.text', '4');
    cy.get('#\\/nColumns8').should('have.text', '4');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 2, 4], ["tuple", ["tuple", "s", "t", "u", "v"], ["tuple", "k", "l", "m", "n"]]]
      let matrixValue = [["s", "t", "u", "v"], ["k", "l", "m", "n"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([2, 4]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });
  })

  it('3x2 matrix, rows, change size, change default entry', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Default entry: <mathinput name="de" prefill="1" /></p>
    <p>nRows: <mathinput name="mi_nRows" prefill="3" />,
      nColumns: <mathinput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" nRows="$mi_nRows" nColumns="$mi_nColumns" defaultEntry="$de" >
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
      nRows: <integer copySource="A.nRows" name="nRows" />,
      nColumns: <integer copySource="A.nColumns" name="nColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      nRows 1: <integer copySource="A1.nRows" name="nRows1" />,
      nColumns 1: <integer copySource="A1.nColumns" name="nColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      nRows 2: <integer copySource="A2.nRows" name="nRows2" />,
      nColumns 2: <integer copySource="A2.nColumns" name="nColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      nRows 3: <integer copySource="A3.nRows" name="nRows3" />,
      nColumns 3: <integer copySource="A3.nColumns" name="nColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      nRows 4: <integer copySource="A4.nRows" name="nRows4" />,
      nColumns 4: <integer copySource="A4.nColumns" name="nColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      nRows 5: <integer copySource="A5.nRows" name="nRows5" />,
      nColumns 5: <integer copySource="A5.nColumns" name="nColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      nRows 6: <integer copySource="A6.nRows" name="nRows6" />,
      nColumns 6: <integer copySource="A6.nColumns" name="nColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      nRows 7: <integer copySource="A7.nRows" name="nRows7" />,
      nColumns 7: <integer copySource="A7.nColumns" name="nColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      nRows 8: <integer copySource="A8.nRows" name="nRows8" />,
      nColumns 8: <integer copySource="A8.nColumns" name="nColumns8" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')

    cy.get('#\\/matrixSize').should('have.text', '3, 2');
    cy.get('#\\/matrixSize1').should('have.text', '3, 2');
    cy.get('#\\/matrixSize2').should('have.text', '3, 2');
    cy.get('#\\/matrixSize3').should('have.text', '3, 2');
    cy.get('#\\/matrixSize4').should('have.text', '3, 2');
    cy.get('#\\/matrixSize5').should('have.text', '3, 2');
    cy.get('#\\/matrixSize6').should('have.text', '3, 2');
    cy.get('#\\/matrixSize7').should('have.text', '3, 2');
    cy.get('#\\/matrixSize8').should('have.text', '3, 2');

    cy.get('#\\/nRows').should('have.text', '3');
    cy.get('#\\/nRows1').should('have.text', '3');
    cy.get('#\\/nRows2').should('have.text', '3');
    cy.get('#\\/nRows3').should('have.text', '3');
    cy.get('#\\/nRows4').should('have.text', '3');
    cy.get('#\\/nRows5').should('have.text', '3');
    cy.get('#\\/nRows6').should('have.text', '3');
    cy.get('#\\/nRows7').should('have.text', '3');
    cy.get('#\\/nRows8').should('have.text', '3');

    cy.get('#\\/nColumns').should('have.text', '2');
    cy.get('#\\/nColumns1').should('have.text', '2');
    cy.get('#\\/nColumns2').should('have.text', '2');
    cy.get('#\\/nColumns3').should('have.text', '2');
    cy.get('#\\/nColumns4').should('have.text', '2');
    cy.get('#\\/nColumns5').should('have.text', '2');
    cy.get('#\\/nColumns6').should('have.text', '2');
    cy.get('#\\/nColumns7').should('have.text', '2');
    cy.get('#\\/nColumns8').should('have.text', '2');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", "a", "b"], ["tuple", "d", "e"], ["tuple", 1, 1]]]
      let matrixValue = [["a", "b"], ["d", "e"], [1, 1]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change default entry')

    cy.get('#\\/de textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣abdekk⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", "a", "b"], ["tuple", "d", "e"], ["tuple", "k", "k"]]]
      let matrixValue = [["a", "b"], ["d", "e"], ["k", "k"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change all but last value')

    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_1_0 textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_1_1 textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_2_0 textarea').type("{end}{backspace}v{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣xyzuvk⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", "x", "y"], ["tuple", "z", "u"], ["tuple", "v", "k"]]]
      let matrixValue = [["x", "y"], ["z", "u"], ["v", "k"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change default entry again does not work as all modified by matrixinput')

    cy.get('#\\/de textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get('#\\/mi8_component_0_0 textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣1yzuvk⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 1, "y"], ["tuple", "z", "u"], ["tuple", "v", "k"]]]
      let matrixValue = [[1, "y"], ["z", "u"], ["v", "k"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('add row and column')
    cy.get("#\\/mi_nRows textarea").type("{end}{backspace}4{enter}", { force: true }).blur()
    cy.get("#\\/mi_nColumns textarea").type("{end}{backspace}3{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')


    cy.get('#\\/matrixSize').should('have.text', '4, 3');
    cy.get('#\\/matrixSize1').should('have.text', '4, 3');
    cy.get('#\\/matrixSize2').should('have.text', '4, 3');
    cy.get('#\\/matrixSize3').should('have.text', '4, 3');
    cy.get('#\\/matrixSize4').should('have.text', '4, 3');
    cy.get('#\\/matrixSize5').should('have.text', '4, 3');
    cy.get('#\\/matrixSize6').should('have.text', '4, 3');
    cy.get('#\\/matrixSize7').should('have.text', '4, 3');
    cy.get('#\\/matrixSize8').should('have.text', '4, 3');

    cy.get('#\\/nRows').should('have.text', '4');
    cy.get('#\\/nRows1').should('have.text', '4');
    cy.get('#\\/nRows2').should('have.text', '4');
    cy.get('#\\/nRows3').should('have.text', '4');
    cy.get('#\\/nRows4').should('have.text', '4');
    cy.get('#\\/nRows5').should('have.text', '4');
    cy.get('#\\/nRows6').should('have.text', '4');
    cy.get('#\\/nRows7').should('have.text', '4');
    cy.get('#\\/nRows8').should('have.text', '4');

    cy.get('#\\/nColumns').should('have.text', '3');
    cy.get('#\\/nColumns1').should('have.text', '3');
    cy.get('#\\/nColumns2').should('have.text', '3');
    cy.get('#\\/nColumns3').should('have.text', '3');
    cy.get('#\\/nColumns4').should('have.text', '3');
    cy.get('#\\/nColumns5').should('have.text', '3');
    cy.get('#\\/nColumns6').should('have.text', '3');
    cy.get('#\\/nColumns7').should('have.text', '3');
    cy.get('#\\/nColumns8').should('have.text', '3');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 4, 3], ["tuple", ["tuple", 1, "y", "c"], ["tuple", "z", "u", "f"], ["tuple", "v", "k", "j"], ["tuple", "j", "j", "j"]]]
      let matrixValue = [[1, "y", "c"], ["z", "u", "f"], ["v", "k", "j"], ["j", "j", "j"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([4, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change all values')

    cy.get('#\\/mi5_component_0_0 textarea').type("{end}{backspace}l{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_0_1 textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get('#\\/mi7_component_0_2 textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get('#\\/mi8_component_1_0 textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_1_1 textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_1_2 textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_2_0 textarea').type("{end}{backspace}r{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_2_1 textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_2_2 textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_3_0 textarea').type("{end}{backspace}w{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_3_1 textarea').type("{end}{backspace}a{enter}", { force: true }).blur()
    cy.get('#\\/mi7_component_3_2 textarea').type("{end}{backspace}b{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 4, 3], ["tuple", ["tuple", "l", "m", "n"], ["tuple", "o", "p", "q"], ["tuple", "r", "s", "t"], ["tuple", "w", "a", "b"]]]
      let matrixValue = [["l", "m", "n"], ["o", "p", "q"], ["r", "s", "t"], ["w", "a", "b"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([4, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


  })

  it('3x2 matrix, columns, change size, change default entry', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Default entry: <mathinput name="de" prefill="1" /></p>
    <p>nRows: <mathinput name="mi_nRows" prefill="3" />,
      nColumns: <mathinput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" nRows="$mi_nRows" nColumns="$mi_nColumns" defaultEntry="$de" >
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
      nRows: <integer copySource="A.nRows" name="nRows" />,
      nColumns: <integer copySource="A.nColumns" name="nColumns" />
    </p>
    <p>Size 1: <numberList copySource="A1.matrixSize" name="matrixSize1" />, 
      nRows 1: <integer copySource="A1.nRows" name="nRows1" />,
      nColumns 1: <integer copySource="A1.nColumns" name="nColumns1" />
    </p>
    <p>Size 2: <numberList copySource="A2.matrixSize" name="matrixSize2" />, 
      nRows 2: <integer copySource="A2.nRows" name="nRows2" />,
      nColumns 2: <integer copySource="A2.nColumns" name="nColumns2" />
    </p>
    <p>Size 3: <numberList copySource="A3.matrixSize" name="matrixSize3" />, 
      nRows 3: <integer copySource="A3.nRows" name="nRows3" />,
      nColumns 3: <integer copySource="A3.nColumns" name="nColumns3" />
    </p>
    <p>Size 4: <numberList copySource="A4.matrixSize" name="matrixSize4" />, 
      nRows 4: <integer copySource="A4.nRows" name="nRows4" />,
      nColumns 4: <integer copySource="A4.nColumns" name="nColumns4" />
    </p>
    <p>Size 5: <numberList copySource="A5.matrixSize" name="matrixSize5" />, 
      nRows 5: <integer copySource="A5.nRows" name="nRows5" />,
      nColumns 5: <integer copySource="A5.nColumns" name="nColumns5" />
    </p>
    <p>Size 6: <numberList copySource="A6.matrixSize" name="matrixSize6" />, 
      nRows 6: <integer copySource="A6.nRows" name="nRows6" />,
      nColumns 6: <integer copySource="A6.nColumns" name="nColumns6" />
    </p>
    <p>Size 7: <numberList copySource="A7.matrixSize" name="matrixSize7" />, 
      nRows 7: <integer copySource="A7.nRows" name="nRows7" />,
      nColumns 7: <integer copySource="A7.nColumns" name="nColumns7" />
    </p>
    <p>Size 8: <numberList copySource="A8.matrixSize" name="matrixSize8" />, 
      nRows 8: <integer copySource="A8.nRows" name="nRows8" />,
      nColumns 8: <integer copySource="A8.nColumns" name="nColumns8" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')

    cy.get('#\\/matrixSize').should('have.text', '3, 2');
    cy.get('#\\/matrixSize1').should('have.text', '3, 2');
    cy.get('#\\/matrixSize2').should('have.text', '3, 2');
    cy.get('#\\/matrixSize3').should('have.text', '3, 2');
    cy.get('#\\/matrixSize4').should('have.text', '3, 2');
    cy.get('#\\/matrixSize5').should('have.text', '3, 2');
    cy.get('#\\/matrixSize6').should('have.text', '3, 2');
    cy.get('#\\/matrixSize7').should('have.text', '3, 2');
    cy.get('#\\/matrixSize8').should('have.text', '3, 2');

    cy.get('#\\/nRows').should('have.text', '3');
    cy.get('#\\/nRows1').should('have.text', '3');
    cy.get('#\\/nRows2').should('have.text', '3');
    cy.get('#\\/nRows3').should('have.text', '3');
    cy.get('#\\/nRows4').should('have.text', '3');
    cy.get('#\\/nRows5').should('have.text', '3');
    cy.get('#\\/nRows6').should('have.text', '3');
    cy.get('#\\/nRows7').should('have.text', '3');
    cy.get('#\\/nRows8').should('have.text', '3');

    cy.get('#\\/nColumns').should('have.text', '2');
    cy.get('#\\/nColumns1').should('have.text', '2');
    cy.get('#\\/nColumns2').should('have.text', '2');
    cy.get('#\\/nColumns3').should('have.text', '2');
    cy.get('#\\/nColumns4').should('have.text', '2');
    cy.get('#\\/nColumns5').should('have.text', '2');
    cy.get('#\\/nColumns6').should('have.text', '2');
    cy.get('#\\/nColumns7').should('have.text', '2');
    cy.get('#\\/nColumns8').should('have.text', '2');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", "a", "b"], ["tuple", "d", "e"], ["tuple", 1, 1]]]
      let matrixValue = [["a", "b"], ["d", "e"], [1, 1]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change default entry')

    cy.get('#\\/de textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣abdekk⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", "a", "b"], ["tuple", "d", "e"], ["tuple", "k", "k"]]]
      let matrixValue = [["a", "b"], ["d", "e"], ["k", "k"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change all but last value')

    cy.get('#\\/mi_component_0_0 textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_1_0 textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_1_1 textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_2_0 textarea').type("{end}{backspace}v{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣xyzuvk⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", "x", "y"], ["tuple", "z", "u"], ["tuple", "v", "k"]]]
      let matrixValue = [["x", "y"], ["z", "u"], ["v", "k"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change default entry again does not work as all modified by matrixinput')

    cy.get('#\\/de textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get('#\\/mi8_component_0_0 textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢⎣1yzuvk⎤⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 1, "y"], ["tuple", "z", "u"], ["tuple", "v", "k"]]]
      let matrixValue = [[1, "y"], ["z", "u"], ["v", "k"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([3, 2]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


    cy.log('add row and column')
    cy.get("#\\/mi_nRows textarea").type("{end}{backspace}4{enter}", { force: true }).blur()
    cy.get("#\\/mi_nColumns textarea").type("{end}{backspace}3{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')


    cy.get('#\\/matrixSize').should('have.text', '4, 3');
    cy.get('#\\/matrixSize1').should('have.text', '4, 3');
    cy.get('#\\/matrixSize2').should('have.text', '4, 3');
    cy.get('#\\/matrixSize3').should('have.text', '4, 3');
    cy.get('#\\/matrixSize4').should('have.text', '4, 3');
    cy.get('#\\/matrixSize5').should('have.text', '4, 3');
    cy.get('#\\/matrixSize6').should('have.text', '4, 3');
    cy.get('#\\/matrixSize7').should('have.text', '4, 3');
    cy.get('#\\/matrixSize8').should('have.text', '4, 3');

    cy.get('#\\/nRows').should('have.text', '4');
    cy.get('#\\/nRows1').should('have.text', '4');
    cy.get('#\\/nRows2').should('have.text', '4');
    cy.get('#\\/nRows3').should('have.text', '4');
    cy.get('#\\/nRows4').should('have.text', '4');
    cy.get('#\\/nRows5').should('have.text', '4');
    cy.get('#\\/nRows6').should('have.text', '4');
    cy.get('#\\/nRows7').should('have.text', '4');
    cy.get('#\\/nRows8').should('have.text', '4');

    cy.get('#\\/nColumns').should('have.text', '3');
    cy.get('#\\/nColumns1').should('have.text', '3');
    cy.get('#\\/nColumns2').should('have.text', '3');
    cy.get('#\\/nColumns3').should('have.text', '3');
    cy.get('#\\/nColumns4').should('have.text', '3');
    cy.get('#\\/nColumns5').should('have.text', '3');
    cy.get('#\\/nColumns6').should('have.text', '3');
    cy.get('#\\/nColumns7').should('have.text', '3');
    cy.get('#\\/nColumns8').should('have.text', '3');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 4, 3], ["tuple", ["tuple", 1, "y", "c"], ["tuple", "z", "u", "f"], ["tuple", "v", "k", "j"], ["tuple", "j", "j", "j"]]]
      let matrixValue = [[1, "y", "c"], ["z", "u", "f"], ["v", "k", "j"], ["j", "j", "j"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([4, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });

    cy.log('change all values')

    cy.get('#\\/mi5_component_0_0 textarea').type("{end}{backspace}l{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_0_1 textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get('#\\/mi7_component_0_2 textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get('#\\/mi8_component_1_0 textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get('#\\/mi_component_1_1 textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get('#\\/mi1_component_1_2 textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get('#\\/mi2_component_2_0 textarea').type("{end}{backspace}r{enter}", { force: true }).blur()
    cy.get('#\\/mi3_component_2_1 textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get('#\\/mi4_component_2_2 textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get('#\\/mi5_component_3_0 textarea').type("{end}{backspace}w{enter}", { force: true }).blur()
    cy.get('#\\/mi6_component_3_1 textarea').type("{end}{backspace}a{enter}", { force: true }).blur()
    cy.get('#\\/mi7_component_3_2 textarea').type("{end}{backspace}b{enter}", { force: true }).blur()

    cy.get('#\\/A .mjx-mrow').should('contain.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')

    cy.get('#\\/A .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A1 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A2 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A3 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A4 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A5 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A6 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A7 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get('#\\/A8 .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 4, 3], ["tuple", ["tuple", "l", "m", "n"], ["tuple", "o", "p", "q"], ["tuple", "r", "s", "t"], ["tuple", "w", "a", "b"]]]
      let matrixValue = [["l", "m", "n"], ["o", "p", "q"], ["r", "s", "t"], ["w", "a", "b"]];
      expect(stateVariables['/A'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A1'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A2'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A3'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A4'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A5'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A6'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A7'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/A8'].stateValues.value).eqls(matrixAst);
      expect(stateVariables['/mi'].stateValues.value).eqls(matrixAst);

      expect(stateVariables['/A'].stateValues.matrixSize).eqls([4, 3]);
      expect(stateVariables['/A'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A1'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A2'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A3'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A4'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A5'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A6'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A7'].stateValues.matrix).eqls(matrixValue);
      expect(stateVariables['/A8'].stateValues.matrix).eqls(matrixValue);

    });


  })

})