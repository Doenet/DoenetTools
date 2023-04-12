import { cesc } from '../../../../src/_utils/url';

describe('Matrix Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
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


    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[]')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('not.exist')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '0, 0');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '0, 0');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '0, 0');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '0, 0');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '0, 0');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '0, 0');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '0, 0');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '0, 0');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '0, 0');

    cy.get(cesc('#\\/nRows')).should('have.text', '0');
    cy.get(cesc('#\\/nRows1')).should('have.text', '0');
    cy.get(cesc('#\\/nRows2')).should('have.text', '0');
    cy.get(cesc('#\\/nRows3')).should('have.text', '0');
    cy.get(cesc('#\\/nRows4')).should('have.text', '0');
    cy.get(cesc('#\\/nRows5')).should('have.text', '0');
    cy.get(cesc('#\\/nRows6')).should('have.text', '0');
    cy.get(cesc('#\\/nRows7')).should('have.text', '0');
    cy.get(cesc('#\\/nRows8')).should('have.text', '0');

    cy.get(cesc('#\\/nColumns')).should('have.text', '0');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '0');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '0');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '0');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '0');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '0');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '0');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '0');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '0');

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


    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[00]')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '2, 1');

    cy.get(cesc('#\\/nRows')).should('have.text', '2');
    cy.get(cesc('#\\/nRows1')).should('have.text', '2');
    cy.get(cesc('#\\/nRows2')).should('have.text', '2');
    cy.get(cesc('#\\/nRows3')).should('have.text', '2');
    cy.get(cesc('#\\/nRows4')).should('have.text', '2');
    cy.get(cesc('#\\/nRows5')).should('have.text', '2');
    cy.get(cesc('#\\/nRows6')).should('have.text', '2');
    cy.get(cesc('#\\/nRows7')).should('have.text', '2');
    cy.get(cesc('#\\/nRows8')).should('have.text', '2');

    cy.get(cesc('#\\/nColumns')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '1');

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

    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_1_0') + ' textarea').type("{end}{backspace}y{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[xy]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')

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

    cy.get(cesc('#\\/mi_rowIncrement')).click();
    cy.get(cesc('#\\/mi_columnIncrement')).click();

    cy.log('change value so know that core has responded')
    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[1y]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')


    cy.get(cesc('#\\/matrixSize')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '2, 1');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '2, 1');

    cy.get(cesc('#\\/nRows')).should('have.text', '2');
    cy.get(cesc('#\\/nRows1')).should('have.text', '2');
    cy.get(cesc('#\\/nRows2')).should('have.text', '2');
    cy.get(cesc('#\\/nRows3')).should('have.text', '2');
    cy.get(cesc('#\\/nRows4')).should('have.text', '2');
    cy.get(cesc('#\\/nRows5')).should('have.text', '2');
    cy.get(cesc('#\\/nRows6')).should('have.text', '2');
    cy.get(cesc('#\\/nRows7')).should('have.text', '2');
    cy.get(cesc('#\\/nRows8')).should('have.text', '2');

    cy.get(cesc('#\\/nColumns')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '1');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '1');


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

    cy.get(cesc('#\\/mi2_component_0_0') + ' textarea').type("{end}{backspace}a{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_1_0') + ' textarea').type("{end}{backspace}b{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[ab]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')


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

    cy.get(cesc('#\\/mi4_component_0_0') + ' textarea').type("{end}{backspace}c{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_1_0') + ' textarea').type("{end}{backspace}d{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[cd]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')


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

    cy.get(cesc('#\\/mi6_component_0_0') + ' textarea').type("{end}{backspace}e{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi7_component_1_0') + ' textarea').type("{end}{backspace}f{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[ef]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')


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

    cy.get(cesc('#\\/mi8_component_0_0') + ' textarea').type("{end}{backspace}g{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_1_0') + ' textarea').type("{end}{backspace}h{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[gh]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')


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


    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[00]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[00]')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '1, 2');

    cy.get(cesc('#\\/nRows')).should('have.text', '1');
    cy.get(cesc('#\\/nRows1')).should('have.text', '1');
    cy.get(cesc('#\\/nRows2')).should('have.text', '1');
    cy.get(cesc('#\\/nRows3')).should('have.text', '1');
    cy.get(cesc('#\\/nRows4')).should('have.text', '1');
    cy.get(cesc('#\\/nRows5')).should('have.text', '1');
    cy.get(cesc('#\\/nRows6')).should('have.text', '1');
    cy.get(cesc('#\\/nRows7')).should('have.text', '1');
    cy.get(cesc('#\\/nRows8')).should('have.text', '1');

    cy.get(cesc('#\\/nColumns')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '2');

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

    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_0_1') + ' textarea').type("{end}{backspace}y{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[xy]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[xy]')

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

    cy.get(cesc('#\\/mi_rowIncrement')).click();
    cy.get(cesc('#\\/mi_columnIncrement')).click();

    cy.log('change value so know that core has responded')
    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[1y]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[1y]')


    cy.get(cesc('#\\/matrixSize')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '1, 2');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '1, 2');

    cy.get(cesc('#\\/nRows')).should('have.text', '1');
    cy.get(cesc('#\\/nRows1')).should('have.text', '1');
    cy.get(cesc('#\\/nRows2')).should('have.text', '1');
    cy.get(cesc('#\\/nRows3')).should('have.text', '1');
    cy.get(cesc('#\\/nRows4')).should('have.text', '1');
    cy.get(cesc('#\\/nRows5')).should('have.text', '1');
    cy.get(cesc('#\\/nRows6')).should('have.text', '1');
    cy.get(cesc('#\\/nRows7')).should('have.text', '1');
    cy.get(cesc('#\\/nRows8')).should('have.text', '1');

    cy.get(cesc('#\\/nColumns')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '2');


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

    cy.get(cesc('#\\/mi2_component_0_0') + ' textarea').type("{end}{backspace}a{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_0_1') + ' textarea').type("{end}{backspace}b{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[ab]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[ab]')


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

    cy.get(cesc('#\\/mi4_component_0_0') + ' textarea').type("{end}{backspace}c{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_0_1') + ' textarea').type("{end}{backspace}d{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[cd]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[cd]')


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

    cy.get(cesc('#\\/mi6_component_0_0') + ' textarea').type("{end}{backspace}e{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi7_component_0_1') + ' textarea').type("{end}{backspace}f{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[ef]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[ef]')


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

    cy.get(cesc('#\\/mi8_component_0_0') + ' textarea').type("{end}{backspace}g{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_0_1') + ' textarea').type("{end}{backspace}h{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[gh]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[gh]')


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


    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '2, 3');

    cy.get(cesc('#\\/nRows')).should('have.text', '2');
    cy.get(cesc('#\\/nRows1')).should('have.text', '2');
    cy.get(cesc('#\\/nRows2')).should('have.text', '2');
    cy.get(cesc('#\\/nRows3')).should('have.text', '2');
    cy.get(cesc('#\\/nRows4')).should('have.text', '2');
    cy.get(cesc('#\\/nRows5')).should('have.text', '2');
    cy.get(cesc('#\\/nRows6')).should('have.text', '2');
    cy.get(cesc('#\\/nRows7')).should('have.text', '2');
    cy.get(cesc('#\\/nRows8')).should('have.text', '2');

    cy.get(cesc('#\\/nColumns')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '3');


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

    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_0_1') + ' textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_0_2') + ' textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_1_0') + ' textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_1_1') + ' textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_1_2') + ' textarea').type("{end}{backspace}w{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[xyzuvw]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')



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

    cy.get(cesc('#\\/mi_rowDecrement')).click();
    cy.get(cesc('#\\/mi_columnDecrement')).click();

    cy.log('change value so know that core has responded')
    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[1yzuvw]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '2, 3');

    cy.get(cesc('#\\/nRows')).should('have.text', '2');
    cy.get(cesc('#\\/nRows1')).should('have.text', '2');
    cy.get(cesc('#\\/nRows2')).should('have.text', '2');
    cy.get(cesc('#\\/nRows3')).should('have.text', '2');
    cy.get(cesc('#\\/nRows4')).should('have.text', '2');
    cy.get(cesc('#\\/nRows5')).should('have.text', '2');
    cy.get(cesc('#\\/nRows6')).should('have.text', '2');
    cy.get(cesc('#\\/nRows7')).should('have.text', '2');
    cy.get(cesc('#\\/nRows8')).should('have.text', '2');

    cy.get(cesc('#\\/nColumns')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '3');



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

    cy.get(cesc('#\\/mi1_component_0_0') + ' textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_0_1') + ' textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_0_2') + ' textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_1_0') + ' textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_1_1') + ' textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_1_2') + ' textarea').type("{end}{backspace}r{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[mnopqr]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')



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

    cy.get(cesc('#\\/mi5_component_0_0') + ' textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_0_1') + ' textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi7_component_0_2') + ' textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi8_component_1_0') + ' textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_1_1') + ' textarea').type("{end}{backspace}w{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_1_2') + ' textarea').type("{end}{backspace}x{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[stuvwx]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')



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


    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[abcdef]')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should('have.text', 'c')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should('have.text', 'f')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '2, 3');

    cy.get(cesc('#\\/nRows')).should('have.text', '2');
    cy.get(cesc('#\\/nRows1')).should('have.text', '2');
    cy.get(cesc('#\\/nRows2')).should('have.text', '2');
    cy.get(cesc('#\\/nRows3')).should('have.text', '2');
    cy.get(cesc('#\\/nRows4')).should('have.text', '2');
    cy.get(cesc('#\\/nRows5')).should('have.text', '2');
    cy.get(cesc('#\\/nRows6')).should('have.text', '2');
    cy.get(cesc('#\\/nRows7')).should('have.text', '2');
    cy.get(cesc('#\\/nRows8')).should('have.text', '2');

    cy.get(cesc('#\\/nColumns')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '3');

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

    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_0_1') + ' textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_0_2') + ' textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_1_0') + ' textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_1_1') + ' textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_1_2') + ' textarea').type("{end}{backspace}w{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[xyzuvw]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[xyzuvw]')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')



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

    cy.get(cesc('#\\/mi_rowDecrement')).click();
    cy.get(cesc('#\\/mi_columnDecrement')).click();

    cy.log('change value so know that core has responded')
    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[1yzuvw]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[1yzuvw]')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '2, 3');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '2, 3');

    cy.get(cesc('#\\/nRows')).should('have.text', '2');
    cy.get(cesc('#\\/nRows1')).should('have.text', '2');
    cy.get(cesc('#\\/nRows2')).should('have.text', '2');
    cy.get(cesc('#\\/nRows3')).should('have.text', '2');
    cy.get(cesc('#\\/nRows4')).should('have.text', '2');
    cy.get(cesc('#\\/nRows5')).should('have.text', '2');
    cy.get(cesc('#\\/nRows6')).should('have.text', '2');
    cy.get(cesc('#\\/nRows7')).should('have.text', '2');
    cy.get(cesc('#\\/nRows8')).should('have.text', '2');

    cy.get(cesc('#\\/nColumns')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '3');



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

    cy.get(cesc('#\\/mi1_component_0_0') + ' textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_0_1') + ' textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_0_2') + ' textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_1_0') + ' textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_1_1') + ' textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_1_2') + ' textarea').type("{end}{backspace}r{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[mnopqr]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[mnopqr]')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 'm')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'n')
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should('have.text', 'o')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'p')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'q')
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should('have.text', 'r')



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

    cy.get(cesc('#\\/mi5_component_0_0') + ' textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_0_1') + ' textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi7_component_0_2') + ' textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi8_component_1_0') + ' textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_1_1') + ' textarea').type("{end}{backspace}w{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_1_2') + ' textarea').type("{end}{backspace}x{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[stuvwx]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[stuvwx]')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi3_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi3_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi4_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi4_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi5_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi5_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi6_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi6_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi7_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi7_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 's')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 't')
    cy.get(cesc(`#\\/mi8_component_0_2`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'w')
    cy.get(cesc(`#\\/mi8_component_1_2`) + ` .mq-editable-field`).should('have.text', 'x')



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


    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi2_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi2_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi3_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi3_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi4_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi4_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi5_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi5_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi6_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi6_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi7_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi7_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi8_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi8_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '3, 2');

    cy.get(cesc('#\\/nRows')).should('have.text', '3');
    cy.get(cesc('#\\/nRows1')).should('have.text', '3');
    cy.get(cesc('#\\/nRows2')).should('have.text', '3');
    cy.get(cesc('#\\/nRows3')).should('have.text', '3');
    cy.get(cesc('#\\/nRows4')).should('have.text', '3');
    cy.get(cesc('#\\/nRows5')).should('have.text', '3');
    cy.get(cesc('#\\/nRows6')).should('have.text', '3');
    cy.get(cesc('#\\/nRows7')).should('have.text', '3');
    cy.get(cesc('#\\/nRows8')).should('have.text', '3');

    cy.get(cesc('#\\/nColumns')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '2');


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

    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_0_1') + ' textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_1_0') + ' textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_1_1') + ' textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_2_0') + ' textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_2_1') + ' textarea').type("{end}{backspace}w{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣xyzuvw⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi2_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi2_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi3_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi3_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi4_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi4_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi5_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi5_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi6_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi6_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi7_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi7_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi8_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi8_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')


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

    cy.get(cesc('#\\/mi_rowDecrement')).click();
    cy.get(cesc('#\\/mi_columnDecrement')).click();

    cy.log('change value so know that core has responded')
    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣1yzuvw⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '3, 2');

    cy.get(cesc('#\\/nRows')).should('have.text', '3');
    cy.get(cesc('#\\/nRows1')).should('have.text', '3');
    cy.get(cesc('#\\/nRows2')).should('have.text', '3');
    cy.get(cesc('#\\/nRows3')).should('have.text', '3');
    cy.get(cesc('#\\/nRows4')).should('have.text', '3');
    cy.get(cesc('#\\/nRows5')).should('have.text', '3');
    cy.get(cesc('#\\/nRows6')).should('have.text', '3');
    cy.get(cesc('#\\/nRows7')).should('have.text', '3');
    cy.get(cesc('#\\/nRows8')).should('have.text', '3');

    cy.get(cesc('#\\/nColumns')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '2');


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

    cy.get(cesc("#\\/mi_nColumns") + " textarea").type("{end}{backspace}4{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '3, 4');

    cy.get(cesc('#\\/nRows')).should('have.text', '3');
    cy.get(cesc('#\\/nRows1')).should('have.text', '3');
    cy.get(cesc('#\\/nRows2')).should('have.text', '3');
    cy.get(cesc('#\\/nRows3')).should('have.text', '3');
    cy.get(cesc('#\\/nRows4')).should('have.text', '3');
    cy.get(cesc('#\\/nRows5')).should('have.text', '3');
    cy.get(cesc('#\\/nRows6')).should('have.text', '3');
    cy.get(cesc('#\\/nRows7')).should('have.text', '3');
    cy.get(cesc('#\\/nRows8')).should('have.text', '3');

    cy.get(cesc('#\\/nColumns')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '4');


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

    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}g{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_0_1') + ' textarea').type("{end}{backspace}h{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_0_2') + ' textarea').type("{end}{backspace}i{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_0_3') + ' textarea').type("{end}{backspace}j{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_1_0') + ' textarea').type("{end}{backspace}k{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_1_1') + ' textarea').type("{end}{backspace}l{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_1_2') + ' textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi7_component_1_3') + ' textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi8_component_2_0') + ' textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_2_1') + ' textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_2_2') + ' textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_2_3') + ' textarea').type("{end}{backspace}r{enter}", { force: true }).blur()


    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')


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

    cy.get(cesc("#\\/mi_nRows") + " textarea").type("{end}{backspace}1{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[ghij]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')


    cy.get(cesc('#\\/matrixSize')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '1, 4');

    cy.get(cesc('#\\/nRows')).should('have.text', '1');
    cy.get(cesc('#\\/nRows1')).should('have.text', '1');
    cy.get(cesc('#\\/nRows2')).should('have.text', '1');
    cy.get(cesc('#\\/nRows3')).should('have.text', '1');
    cy.get(cesc('#\\/nRows4')).should('have.text', '1');
    cy.get(cesc('#\\/nRows5')).should('have.text', '1');
    cy.get(cesc('#\\/nRows6')).should('have.text', '1');
    cy.get(cesc('#\\/nRows7')).should('have.text', '1');
    cy.get(cesc('#\\/nRows8')).should('have.text', '1');

    cy.get(cesc('#\\/nColumns')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '4');



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

    cy.get(cesc('#\\/mi3_component_0_0') + ' textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_0_1') + ' textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_0_2') + ' textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_0_3') + ' textarea').type("{end}{backspace}v{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[stuv]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')

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

    cy.get(cesc("#\\/mi_nRows") + " textarea").type("{end}{backspace}2{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[stuvklmn]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')



    cy.get(cesc('#\\/matrixSize')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '2, 4');

    cy.get(cesc('#\\/nRows')).should('have.text', '2');
    cy.get(cesc('#\\/nRows1')).should('have.text', '2');
    cy.get(cesc('#\\/nRows2')).should('have.text', '2');
    cy.get(cesc('#\\/nRows3')).should('have.text', '2');
    cy.get(cesc('#\\/nRows4')).should('have.text', '2');
    cy.get(cesc('#\\/nRows5')).should('have.text', '2');
    cy.get(cesc('#\\/nRows6')).should('have.text', '2');
    cy.get(cesc('#\\/nRows7')).should('have.text', '2');
    cy.get(cesc('#\\/nRows8')).should('have.text', '2');

    cy.get(cesc('#\\/nColumns')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '4');

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


    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde00⎤⎥⎦')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi2_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi2_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi3_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi3_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi4_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi4_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi5_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi5_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi6_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi6_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi7_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi7_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 'a')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'b')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'd')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'e')
    cy.get(cesc(`#\\/mi8_component_2_0`) + ` .mq-editable-field`).should('have.text', '0')
    cy.get(cesc(`#\\/mi8_component_2_1`) + ` .mq-editable-field`).should('have.text', '0')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '3, 2');

    cy.get(cesc('#\\/nRows')).should('have.text', '3');
    cy.get(cesc('#\\/nRows1')).should('have.text', '3');
    cy.get(cesc('#\\/nRows2')).should('have.text', '3');
    cy.get(cesc('#\\/nRows3')).should('have.text', '3');
    cy.get(cesc('#\\/nRows4')).should('have.text', '3');
    cy.get(cesc('#\\/nRows5')).should('have.text', '3');
    cy.get(cesc('#\\/nRows6')).should('have.text', '3');
    cy.get(cesc('#\\/nRows7')).should('have.text', '3');
    cy.get(cesc('#\\/nRows8')).should('have.text', '3');

    cy.get(cesc('#\\/nColumns')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '2');


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

    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_0_1') + ' textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_1_0') + ' textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_1_1') + ' textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_2_0') + ' textarea').type("{end}{backspace}v{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_2_1') + ' textarea').type("{end}{backspace}w{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣xyzuvw⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvw⎤⎥⎦')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi2_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi2_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi3_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi3_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi3_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi3_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi3_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi3_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi4_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi4_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi4_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi4_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi4_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi4_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi5_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi5_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi5_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi5_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi5_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi5_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi6_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi6_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi6_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi6_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi6_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi6_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi7_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi7_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi7_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi7_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi7_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi7_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc(`#\\/mi8_component_0_0`) + ` .mq-editable-field`).should('have.text', 'x')
    cy.get(cesc(`#\\/mi8_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi8_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi8_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi8_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi8_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')


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

    cy.get(cesc('#\\/mi_rowDecrement')).click();
    cy.get(cesc('#\\/mi_columnDecrement')).click();

    cy.log('change value so know that core has responded')
    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣1yzuvw⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvw⎤⎥⎦')
    cy.get(cesc(`#\\/mi_component_0_0`) + ` .mq-editable-field`).should('have.text', '1')
    cy.get(cesc(`#\\/mi_component_0_1`) + ` .mq-editable-field`).should('have.text', 'y')
    cy.get(cesc(`#\\/mi_component_1_0`) + ` .mq-editable-field`).should('have.text', 'z')
    cy.get(cesc(`#\\/mi_component_1_1`) + ` .mq-editable-field`).should('have.text', 'u')
    cy.get(cesc(`#\\/mi_component_2_0`) + ` .mq-editable-field`).should('have.text', 'v')
    cy.get(cesc(`#\\/mi_component_2_1`) + ` .mq-editable-field`).should('have.text', 'w')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '3, 2');

    cy.get(cesc('#\\/nRows')).should('have.text', '3');
    cy.get(cesc('#\\/nRows1')).should('have.text', '3');
    cy.get(cesc('#\\/nRows2')).should('have.text', '3');
    cy.get(cesc('#\\/nRows3')).should('have.text', '3');
    cy.get(cesc('#\\/nRows4')).should('have.text', '3');
    cy.get(cesc('#\\/nRows5')).should('have.text', '3');
    cy.get(cesc('#\\/nRows6')).should('have.text', '3');
    cy.get(cesc('#\\/nRows7')).should('have.text', '3');
    cy.get(cesc('#\\/nRows8')).should('have.text', '3');

    cy.get(cesc('#\\/nColumns')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '2');


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

    cy.get(cesc("#\\/mi_nColumns") + " textarea").type("{end}{backspace}4{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yc0zuf0vw00⎤⎥⎦')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '3, 4');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '3, 4');

    cy.get(cesc('#\\/nRows')).should('have.text', '3');
    cy.get(cesc('#\\/nRows1')).should('have.text', '3');
    cy.get(cesc('#\\/nRows2')).should('have.text', '3');
    cy.get(cesc('#\\/nRows3')).should('have.text', '3');
    cy.get(cesc('#\\/nRows4')).should('have.text', '3');
    cy.get(cesc('#\\/nRows5')).should('have.text', '3');
    cy.get(cesc('#\\/nRows6')).should('have.text', '3');
    cy.get(cesc('#\\/nRows7')).should('have.text', '3');
    cy.get(cesc('#\\/nRows8')).should('have.text', '3');

    cy.get(cesc('#\\/nColumns')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '4');


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

    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}g{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_0_1') + ' textarea').type("{end}{backspace}h{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_0_2') + ' textarea').type("{end}{backspace}i{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_0_3') + ' textarea').type("{end}{backspace}j{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_1_0') + ' textarea').type("{end}{backspace}k{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_1_1') + ' textarea').type("{end}{backspace}l{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_1_2') + ' textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi7_component_1_3') + ' textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi8_component_2_0') + ' textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_2_1') + ' textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_2_2') + ' textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_2_3') + ' textarea').type("{end}{backspace}r{enter}", { force: true }).blur()


    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ghijklmnopqr⎤⎥⎦')


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

    cy.get(cesc("#\\/mi_nRows") + " textarea").type("{end}{backspace}1{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[ghij]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[ghij]')


    cy.get(cesc('#\\/matrixSize')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '1, 4');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '1, 4');

    cy.get(cesc('#\\/nRows')).should('have.text', '1');
    cy.get(cesc('#\\/nRows1')).should('have.text', '1');
    cy.get(cesc('#\\/nRows2')).should('have.text', '1');
    cy.get(cesc('#\\/nRows3')).should('have.text', '1');
    cy.get(cesc('#\\/nRows4')).should('have.text', '1');
    cy.get(cesc('#\\/nRows5')).should('have.text', '1');
    cy.get(cesc('#\\/nRows6')).should('have.text', '1');
    cy.get(cesc('#\\/nRows7')).should('have.text', '1');
    cy.get(cesc('#\\/nRows8')).should('have.text', '1');

    cy.get(cesc('#\\/nColumns')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '4');



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

    cy.get(cesc('#\\/mi3_component_0_0') + ' textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_0_1') + ' textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_0_2') + ' textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_0_3') + ' textarea').type("{end}{backspace}v{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[stuv]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[stuv]')

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

    cy.get(cesc("#\\/mi_nRows") + " textarea").type("{end}{backspace}2{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '[stuvklmn]')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '[stuvklmn]')



    cy.get(cesc('#\\/matrixSize')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '2, 4');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '2, 4');

    cy.get(cesc('#\\/nRows')).should('have.text', '2');
    cy.get(cesc('#\\/nRows1')).should('have.text', '2');
    cy.get(cesc('#\\/nRows2')).should('have.text', '2');
    cy.get(cesc('#\\/nRows3')).should('have.text', '2');
    cy.get(cesc('#\\/nRows4')).should('have.text', '2');
    cy.get(cesc('#\\/nRows5')).should('have.text', '2');
    cy.get(cesc('#\\/nRows6')).should('have.text', '2');
    cy.get(cesc('#\\/nRows7')).should('have.text', '2');
    cy.get(cesc('#\\/nRows8')).should('have.text', '2');

    cy.get(cesc('#\\/nColumns')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '4');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '4');

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


    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '3, 2');

    cy.get(cesc('#\\/nRows')).should('have.text', '3');
    cy.get(cesc('#\\/nRows1')).should('have.text', '3');
    cy.get(cesc('#\\/nRows2')).should('have.text', '3');
    cy.get(cesc('#\\/nRows3')).should('have.text', '3');
    cy.get(cesc('#\\/nRows4')).should('have.text', '3');
    cy.get(cesc('#\\/nRows5')).should('have.text', '3');
    cy.get(cesc('#\\/nRows6')).should('have.text', '3');
    cy.get(cesc('#\\/nRows7')).should('have.text', '3');
    cy.get(cesc('#\\/nRows8')).should('have.text', '3');

    cy.get(cesc('#\\/nColumns')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '2');


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

    cy.get(cesc('#\\/de') + ' textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣abdekk⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')


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

    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_0_1') + ' textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_1_0') + ' textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_1_1') + ' textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_2_0') + ' textarea').type("{end}{backspace}v{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣xyzuvk⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')


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

    cy.get(cesc('#\\/de') + ' textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(cesc('#\\/mi8_component_0_0') + ' textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣1yzuvk⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')

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
    cy.get(cesc("#\\/mi_nRows") + " textarea").type("{end}{backspace}4{enter}", { force: true }).blur()
    cy.get(cesc("#\\/mi_nColumns") + " textarea").type("{end}{backspace}3{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')


    cy.get(cesc('#\\/matrixSize')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '4, 3');

    cy.get(cesc('#\\/nRows')).should('have.text', '4');
    cy.get(cesc('#\\/nRows1')).should('have.text', '4');
    cy.get(cesc('#\\/nRows2')).should('have.text', '4');
    cy.get(cesc('#\\/nRows3')).should('have.text', '4');
    cy.get(cesc('#\\/nRows4')).should('have.text', '4');
    cy.get(cesc('#\\/nRows5')).should('have.text', '4');
    cy.get(cesc('#\\/nRows6')).should('have.text', '4');
    cy.get(cesc('#\\/nRows7')).should('have.text', '4');
    cy.get(cesc('#\\/nRows8')).should('have.text', '4');

    cy.get(cesc('#\\/nColumns')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '3');


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

    cy.get(cesc('#\\/mi5_component_0_0') + ' textarea').type("{end}{backspace}l{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_0_1') + ' textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi7_component_0_2') + ' textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi8_component_1_0') + ' textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_1_1') + ' textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_1_2') + ' textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_2_0') + ' textarea').type("{end}{backspace}r{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_2_1') + ' textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_2_2') + ' textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_3_0') + ' textarea').type("{end}{backspace}w{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_3_1') + ' textarea').type("{end}{backspace}a{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi7_component_3_2') + ' textarea').type("{end}{backspace}b{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')

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


    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abde11⎤⎥⎦')

    cy.get(cesc('#\\/matrixSize')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '3, 2');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '3, 2');

    cy.get(cesc('#\\/nRows')).should('have.text', '3');
    cy.get(cesc('#\\/nRows1')).should('have.text', '3');
    cy.get(cesc('#\\/nRows2')).should('have.text', '3');
    cy.get(cesc('#\\/nRows3')).should('have.text', '3');
    cy.get(cesc('#\\/nRows4')).should('have.text', '3');
    cy.get(cesc('#\\/nRows5')).should('have.text', '3');
    cy.get(cesc('#\\/nRows6')).should('have.text', '3');
    cy.get(cesc('#\\/nRows7')).should('have.text', '3');
    cy.get(cesc('#\\/nRows8')).should('have.text', '3');

    cy.get(cesc('#\\/nColumns')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '2');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '2');


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

    cy.get(cesc('#\\/de') + ' textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣abdekk⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abdekk⎤⎥⎦')


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

    cy.get(cesc('#\\/mi_component_0_0') + ' textarea').type("{end}{backspace}x{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_0_1') + ' textarea').type("{end}{backspace}y{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_1_0') + ' textarea').type("{end}{backspace}z{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_1_1') + ' textarea').type("{end}{backspace}u{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_2_0') + ' textarea').type("{end}{backspace}v{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣xyzuvk⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣xyzuvk⎤⎥⎦')


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

    cy.get(cesc('#\\/de') + ' textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(cesc('#\\/mi8_component_0_0') + ' textarea').type("{end}{backspace}1{enter}", { force: true }).blur()


    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢⎣1yzuvk⎤⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢⎣1yzuvk⎤⎥⎦')

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
    cy.get(cesc("#\\/mi_nRows") + " textarea").type("{end}{backspace}4{enter}", { force: true }).blur()
    cy.get(cesc("#\\/mi_nColumns") + " textarea").type("{end}{backspace}3{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣1yczufvkjjjj⎤⎥\n⎥\n⎥\n⎥⎦')


    cy.get(cesc('#\\/matrixSize')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize1')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize2')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize3')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize4')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize5')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize6')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize7')).should('have.text', '4, 3');
    cy.get(cesc('#\\/matrixSize8')).should('have.text', '4, 3');

    cy.get(cesc('#\\/nRows')).should('have.text', '4');
    cy.get(cesc('#\\/nRows1')).should('have.text', '4');
    cy.get(cesc('#\\/nRows2')).should('have.text', '4');
    cy.get(cesc('#\\/nRows3')).should('have.text', '4');
    cy.get(cesc('#\\/nRows4')).should('have.text', '4');
    cy.get(cesc('#\\/nRows5')).should('have.text', '4');
    cy.get(cesc('#\\/nRows6')).should('have.text', '4');
    cy.get(cesc('#\\/nRows7')).should('have.text', '4');
    cy.get(cesc('#\\/nRows8')).should('have.text', '4');

    cy.get(cesc('#\\/nColumns')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns1')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns2')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns3')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns4')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns5')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns6')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns7')).should('have.text', '3');
    cy.get(cesc('#\\/nColumns8')).should('have.text', '3');


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

    cy.get(cesc('#\\/mi5_component_0_0') + ' textarea').type("{end}{backspace}l{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_0_1') + ' textarea').type("{end}{backspace}m{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi7_component_0_2') + ' textarea').type("{end}{backspace}n{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi8_component_1_0') + ' textarea').type("{end}{backspace}o{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi_component_1_1') + ' textarea').type("{end}{backspace}p{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi1_component_1_2') + ' textarea').type("{end}{backspace}q{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi2_component_2_0') + ' textarea').type("{end}{backspace}r{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi3_component_2_1') + ' textarea').type("{end}{backspace}s{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi4_component_2_2') + ' textarea').type("{end}{backspace}t{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi5_component_3_0') + ' textarea').type("{end}{backspace}w{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi6_component_3_1') + ' textarea').type("{end}{backspace}a{enter}", { force: true }).blur()
    cy.get(cesc('#\\/mi7_component_3_2') + ' textarea').type("{end}{backspace}b{enter}", { force: true }).blur()

    cy.get(cesc('#\\/A') + ' .mjx-mrow').should('contain.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')

    cy.get(cesc('#\\/A') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A1') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A2') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A3') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A4') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A5') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A6') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A7') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')
    cy.get(cesc('#\\/A8') + ' .mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢⎣lmnopqrstwab⎤⎥\n⎥\n⎥⎦')

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