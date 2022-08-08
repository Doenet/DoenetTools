import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Equilibriumcurve Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('equilibriumcurve change stable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g" newNamespace>
      <equilibriumcurve name="A" switchAble through="(1,2) (3,4) (2,6)"/>
      <equilibriumcurve name="B" stable="false" through="(3,2) (5,4) (4,6)" />
      <equilibriumcurve name="C" stable="$(../b1)" styleNumber="2" through="(-3,2) (-5,4) (-4,6)" />
      <equilibriumcurve name="D" stable="$(../b2)" styleNumber="2" switchable through="(-1,2) (-3,4) (-2,6)" />
    </graph>
  
    <booleaninput name="b1" />
    <booleaninput name="b2" />

    <p><aslist>
    <copy prop="stable" target="g/A" assignNames="gAs" />
    <copy prop="stable" target="g/B" assignNames="gBs" />
    <copy prop="stable" target="g/C" assignNames="gCs" />
    <copy prop="stable" target="g/D" assignNames="gDs" />
    </aslist>
    </p>

    <copy target="g" assignNames="g2" />

    <p><aslist>
    <copy prop="stable" target="g2/A" assignNames="g2As" />
    <copy prop="stable" target="g2/B" assignNames="g2Bs" />
    <copy prop="stable" target="g2/C" assignNames="g2Cs" />
    <copy prop="stable" target="g2/D" assignNames="g2Ds" />
    </aslist>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get("#\\/gAs").should('have.text', 'true');
    cy.get("#\\/gBs").should('have.text', 'false');
    cy.get("#\\/gCs").should('have.text', 'false');
    cy.get("#\\/gDs").should('have.text', 'false');
    cy.get("#\\/g2As").should('have.text', 'true');
    cy.get("#\\/g2Bs").should('have.text', 'false');
    cy.get("#\\/g2Cs").should('have.text', 'false');
    cy.get("#\\/g2Ds").should('have.text', 'false');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(false);
      expect(stateVariables["/g/D"].stateValues.stable).eq(false);
      expect(stateVariables["/g/A"].stateValues.numericalThroughPoints).eqls([[1, 2], [3, 4], [2, 6]])
      expect(stateVariables["/g/B"].stateValues.numericalThroughPoints).eqls([[3, 2], [5, 4], [4, 6]])
      expect(stateVariables["/g/C"].stateValues.numericalThroughPoints).eqls([[-3, 2], [-5, 4], [-4, 6]])
      expect(stateVariables["/g/D"].stateValues.numericalThroughPoints).eqls([[-1, 2], [-3, 4], [-2, 6]])

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/A"].stateValues.numericalThroughPoints).eqls([[1, 2], [3, 4], [2, 6]])
      expect(stateVariables["/g2/B"].stateValues.numericalThroughPoints).eqls([[3, 2], [5, 4], [4, 6]])
      expect(stateVariables["/g2/C"].stateValues.numericalThroughPoints).eqls([[-3, 2], [-5, 4], [-4, 6]])
      expect(stateVariables["/g2/D"].stateValues.numericalThroughPoints).eqls([[-1, 2], [-3, 4], [-2, 6]])
    })


    cy.log('switch C via boolean input')
    cy.get('#\\/b1_input').click();

    cy.get("#\\/gAs").should('have.text', 'true');
    cy.get("#\\/gBs").should('have.text', 'false');
    cy.get("#\\/gCs").should('have.text', 'true');
    cy.get("#\\/gDs").should('have.text', 'false');
    cy.get("#\\/g2As").should('have.text', 'true');
    cy.get("#\\/g2Bs").should('have.text', 'false');
    cy.get("#\\/g2Cs").should('have.text', 'true');
    cy.get("#\\/g2Ds").should('have.text', 'false');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(false);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(false);
    })

    cy.log('switch D via boolean input')
    cy.get('#\\/b2_input').click();

    cy.get("#\\/gAs").should('have.text', 'true');
    cy.get("#\\/gBs").should('have.text', 'false');
    cy.get("#\\/gCs").should('have.text', 'true');
    cy.get("#\\/gDs").should('have.text', 'true');
    cy.get("#\\/g2As").should('have.text', 'true');
    cy.get("#\\/g2Bs").should('have.text', 'false');
    cy.get("#\\/g2Cs").should('have.text', 'true');
    cy.get("#\\/g2Ds").should('have.text', 'true');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(true);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(true);
    })


    cy.log('switch A via first action')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "switchCurve",
        componentName: "/g/A"
      })

      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(false);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(true);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(true);


      cy.get("#\\/gAs").should('have.text', 'false');
      cy.get("#\\/gBs").should('have.text', 'false');
      cy.get("#\\/gCs").should('have.text', 'true');
      cy.get("#\\/gDs").should('have.text', 'true');
      cy.get("#\\/g2As").should('have.text', 'false');
      cy.get("#\\/g2Bs").should('have.text', 'false');
      cy.get("#\\/g2Cs").should('have.text', 'true');
      cy.get("#\\/g2Ds").should('have.text', 'true');
    })



    cy.log('switch A via second action')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "switchCurve",
        componentName: "/g2/A"
      })

      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(true);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(true);


      cy.get("#\\/gAs").should('have.text', 'true');
      cy.get("#\\/gBs").should('have.text', 'false');
      cy.get("#\\/gCs").should('have.text', 'true');
      cy.get("#\\/gDs").should('have.text', 'true');
      cy.get("#\\/g2As").should('have.text', 'true');
      cy.get("#\\/g2Bs").should('have.text', 'false');
      cy.get("#\\/g2Cs").should('have.text', 'true');
      cy.get("#\\/g2Ds").should('have.text', 'true');
    })


    cy.log('cannot switch B via action')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "switchCurve",
        componentName: "/g/B"
      })

      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(true);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(true);

      cy.get("#\\/gAs").should('have.text', 'true');
      cy.get("#\\/gBs").should('have.text', 'false');
      cy.get("#\\/gCs").should('have.text', 'true');
      cy.get("#\\/gDs").should('have.text', 'true');
      cy.get("#\\/g2As").should('have.text', 'true');
      cy.get("#\\/g2Bs").should('have.text', 'false');
      cy.get("#\\/g2Cs").should('have.text', 'true');
      cy.get("#\\/g2Ds").should('have.text', 'true');
    })



    cy.log('cannot switch C via second action')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "switchCurve",
        componentName: "/g2/C"
      })

      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(true);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(true);

      cy.get("#\\/gAs").should('have.text', 'true');
      cy.get("#\\/gBs").should('have.text', 'false');
      cy.get("#\\/gCs").should('have.text', 'true');
      cy.get("#\\/gDs").should('have.text', 'true');
      cy.get("#\\/g2As").should('have.text', 'true');
      cy.get("#\\/g2Bs").should('have.text', 'false');
      cy.get("#\\/g2Cs").should('have.text', 'true');
      cy.get("#\\/g2Ds").should('have.text', 'true');
    })


    cy.log('switch D via second action')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "switchCurve",
        componentName: "/g2/D"
      })

      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(false);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(false);

      cy.get("#\\/gAs").should('have.text', 'true');
      cy.get("#\\/gBs").should('have.text', 'false');
      cy.get("#\\/gCs").should('have.text', 'true');
      cy.get("#\\/gDs").should('have.text', 'false');
      cy.get("#\\/g2As").should('have.text', 'true');
      cy.get("#\\/g2Bs").should('have.text', 'false');
      cy.get("#\\/g2Cs").should('have.text', 'true');
      cy.get("#\\/g2Ds").should('have.text', 'false');
    })


  });


})