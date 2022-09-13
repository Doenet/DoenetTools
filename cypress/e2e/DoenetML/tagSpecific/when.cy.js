
describe('When Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('value, fractionSatisfied, conditionSatisfied are public', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" />
  <when matchPartial name="w">
    $n > 0 and $n > 1
  </when>

  <p>Value: <copy prop="value" target="w" assignNames="v" /></p>
  <p>Condition satisfied: <copy prop="conditionSatisfied" target="w" assignNames="cs" /></p>
  <p>Fraction satisfied: <copy prop="fractionSatisfied" target="w" assignNames="fs" /></p>

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/v').should('have.text', 'false');
    cy.get('#\\/cs').should('have.text', 'false');
    cy.get('#\\/fs').should('have.text', '0');

    cy.get('#\\/n textarea').type('1{enter}', { force: true });
    cy.get('#\\/fs').should('have.text', '0.5');
    cy.get('#\\/v').should('have.text', 'false');
    cy.get('#\\/cs').should('have.text', 'false');

    cy.get('#\\/n textarea').type('1{enter}', { force: true });
    cy.get('#\\/v').should('have.text', 'true');
    cy.get('#\\/cs').should('have.text', 'true');
    cy.get('#\\/fs').should('have.text', '1');

    cy.get('#\\/n textarea').type('{home}-{enter}', { force: true });
    cy.get('#\\/v').should('have.text', 'false');
    cy.get('#\\/cs').should('have.text', 'false');
    cy.get('#\\/fs').should('have.text', '0');



  })

  it('fraction satisfied on 2x2 matrix compare', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="A" format="latex">\\begin{pmatrix}1 & 2\\\\ 3 & 4\\end{pmatrix}</math>
  <math name="B" format="latex">\\begin{pmatrix}5 & 6\\\\ 7 & 8\\end{pmatrix}</math>
  <math name="C" format="latex">\\begin{pmatrix}1 & 6\\\\ 7 & 8\\end{pmatrix}</math>
  <math name="D" format="latex">\\begin{pmatrix}1 & 6\\\\ 4 & 7\\end{pmatrix}</math>

  <when matchPartial name="AA">$A = $A</when>
  <when matchPartial name="AB">$A = $B</when>
  <when matchPartial name="AC">$A = $C</when>
  <when matchPartial name="AD">$A = $D</when>
  <when matchPartial name="BA">$B = $A</when>
  <when matchPartial name="BB">$B = $B</when>
  <when matchPartial name="BC">$B = $C</when>
  <when matchPartial name="BD">$B = $D</when>
  <when matchPartial name="CA">$C = $A</when>
  <when matchPartial name="CB">$C = $B</when>
  <when matchPartial name="CC">$C = $C</when>
  <when matchPartial name="CD">$C = $D</when>
  <when matchPartial name="DA">$D = $A</when>
  <when matchPartial name="DB">$D = $B</when>
  <when matchPartial name="DC">$D = $C</when>
  <when matchPartial name="DD">$D = $D</when>

  <p>Fraction satisfied AA: <number name="fsAA" copySource="AA.fractionSatisfied" /></p>
  <p>Fraction satisfied AB: <number name="fsAB" copySource="AB.fractionSatisfied" /></p>
  <p>Fraction satisfied AC: <number name="fsAC" copySource="AC.fractionSatisfied" /></p>
  <p>Fraction satisfied AD: <number name="fsAD" copySource="AD.fractionSatisfied" /></p>
  <p>Fraction satisfied BA: <number name="fsBA" copySource="BA.fractionSatisfied" /></p>
  <p>Fraction satisfied BB: <number name="fsBB" copySource="BB.fractionSatisfied" /></p>
  <p>Fraction satisfied BC: <number name="fsBC" copySource="BC.fractionSatisfied" /></p>
  <p>Fraction satisfied BD: <number name="fsBD" copySource="BD.fractionSatisfied" /></p>
  <p>Fraction satisfied CA: <number name="fsCA" copySource="CA.fractionSatisfied" /></p>
  <p>Fraction satisfied CB: <number name="fsCB" copySource="CB.fractionSatisfied" /></p>
  <p>Fraction satisfied CC: <number name="fsCC" copySource="CC.fractionSatisfied" /></p>
  <p>Fraction satisfied CD: <number name="fsCD" copySource="CD.fractionSatisfied" /></p>
  <p>Fraction satisfied DA: <number name="fsDA" copySource="DA.fractionSatisfied" /></p>
  <p>Fraction satisfied DB: <number name="fsDB" copySource="DB.fractionSatisfied" /></p>
  <p>Fraction satisfied DC: <number name="fsDC" copySource="DC.fractionSatisfied" /></p>
  <p>Fraction satisfied DD: <number name="fsDD" copySource="DD.fractionSatisfied" /></p>

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/fsAA').should('have.text', '1');
    cy.get('#\\/fsAB').should('have.text', '0');
    cy.get('#\\/fsAC').should('have.text', '0.25');
    cy.get('#\\/fsAD').should('have.text', '0.25');


    cy.get('#\\/fsBA').should('have.text', '0');
    cy.get('#\\/fsBB').should('have.text', '1');
    cy.get('#\\/fsBC').should('have.text', '0.75');
    cy.get('#\\/fsBD').should('have.text', '0.25');

    cy.get('#\\/fsCA').should('have.text', '0.25');
    cy.get('#\\/fsCB').should('have.text', '0.75');
    cy.get('#\\/fsCC').should('have.text', '1');
    cy.get('#\\/fsCD').should('have.text', '0.5');

    cy.get('#\\/fsDA').should('have.text', '0.25');
    cy.get('#\\/fsDB').should('have.text', '0.25');
    cy.get('#\\/fsDC').should('have.text', '0.5');
    cy.get('#\\/fsDD').should('have.text', '1');

  })

  it('fraction satisfied on mismatched size matrix compare', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="A" format="latex">\\begin{pmatrix}1\\end{pmatrix}</math>
  <math name="B" format="latex">\\begin{pmatrix}1 & 8\\end{pmatrix}</math>
  <math name="C" format="latex">\\begin{pmatrix}1\\\\8\\end{pmatrix}</math>
  <math name="D" format="latex">\\begin{pmatrix}1 & 6\\\\ 8 & 7\\end{pmatrix}</math>

  <when matchPartial name="AA">$A = $A</when>
  <when matchPartial name="AB">$A = $B</when>
  <when matchPartial name="AC">$A = $C</when>
  <when matchPartial name="AD">$A = $D</when>
  <when matchPartial name="BA">$B = $A</when>
  <when matchPartial name="BB">$B = $B</when>
  <when matchPartial name="BC">$B = $C</when>
  <when matchPartial name="BD">$B = $D</when>
  <when matchPartial name="CA">$C = $A</when>
  <when matchPartial name="CB">$C = $B</when>
  <when matchPartial name="CC">$C = $C</when>
  <when matchPartial name="CD">$C = $D</when>
  <when matchPartial name="DA">$D = $A</when>
  <when matchPartial name="DB">$D = $B</when>
  <when matchPartial name="DC">$D = $C</when>
  <when matchPartial name="DD">$D = $D</when>

  <p>Fraction satisfied AA: <number name="fsAA" copySource="AA.fractionSatisfied" /></p>
  <p>Fraction satisfied AB: <number name="fsAB" copySource="AB.fractionSatisfied" /></p>
  <p>Fraction satisfied AC: <number name="fsAC" copySource="AC.fractionSatisfied" /></p>
  <p>Fraction satisfied AD: <number name="fsAD" copySource="AD.fractionSatisfied" /></p>
  <p>Fraction satisfied BA: <number name="fsBA" copySource="BA.fractionSatisfied" /></p>
  <p>Fraction satisfied BB: <number name="fsBB" copySource="BB.fractionSatisfied" /></p>
  <p>Fraction satisfied BC: <number name="fsBC" copySource="BC.fractionSatisfied" /></p>
  <p>Fraction satisfied BD: <number name="fsBD" copySource="BD.fractionSatisfied" /></p>
  <p>Fraction satisfied CA: <number name="fsCA" copySource="CA.fractionSatisfied" /></p>
  <p>Fraction satisfied CB: <number name="fsCB" copySource="CB.fractionSatisfied" /></p>
  <p>Fraction satisfied CC: <number name="fsCC" copySource="CC.fractionSatisfied" /></p>
  <p>Fraction satisfied CD: <number name="fsCD" copySource="CD.fractionSatisfied" /></p>
  <p>Fraction satisfied DA: <number name="fsDA" copySource="DA.fractionSatisfied" /></p>
  <p>Fraction satisfied DB: <number name="fsDB" copySource="DB.fractionSatisfied" /></p>
  <p>Fraction satisfied DC: <number name="fsDC" copySource="DC.fractionSatisfied" /></p>
  <p>Fraction satisfied DD: <number name="fsDD" copySource="DD.fractionSatisfied" /></p>

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/fsAA').should('have.text', '1');
    cy.get('#\\/fsAB').should('have.text', '0.5');
    cy.get('#\\/fsAC').should('have.text', '0.5');
    cy.get('#\\/fsAD').should('have.text', '0.25');


    cy.get('#\\/fsBA').should('have.text', '0.5');
    cy.get('#\\/fsBB').should('have.text', '1');
    cy.get('#\\/fsBC').should('have.text', '0.25');
    cy.get('#\\/fsBD').should('have.text', '0.25');

    cy.get('#\\/fsCA').should('have.text', '0.5');
    cy.get('#\\/fsCB').should('have.text', '0.25');
    cy.get('#\\/fsCC').should('have.text', '1');
    cy.get('#\\/fsCD').should('have.text', '0.5');

    cy.get('#\\/fsDA').should('have.text', '0.25');
    cy.get('#\\/fsDB').should('have.text', '0.25');
    cy.get('#\\/fsDC').should('have.text', '0.5');
    cy.get('#\\/fsDD').should('have.text', '1');

  })



})



