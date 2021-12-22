import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Equilibriumline Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('equilibriumline change stable', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g" newNamespace>
      <equilibriumline name="A" switchAble>y=4</equilibriumline>
      <equilibriumline name="B" stable="false">y=7</equilibriumline>
      <equilibriumline name="C" stable="$(../b1)" styleNumber="2">y=-9</equilibriumline>
      <equilibriumline name="D" stable="$(../b2)" styleNumber="2" switchable>y=-3</equilibriumline>
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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(false);
      expect(components["/g/D"].stateValues.stable).eq(false);
      expect(components["/g/A"].stateValues.equation.tree).eqls(["=", "y", 4])
      expect(components["/g/B"].stateValues.equation.tree).eqls(["=", "y", 7])
      expect(components["/g/C"].stateValues.equation.tree).eqls(["=", "y", ['-', 9]])
      expect(components["/g/D"].stateValues.equation.tree).eqls(["=", "y", ['-', 3]])

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(false);
      expect(components["/g2/D"].stateValues.stable).eq(false);
      expect(components["/g2/A"].stateValues.equation.tree).eqls(["=", "y", 4])
      expect(components["/g2/B"].stateValues.equation.tree).eqls(["=", "y", 7])
      expect(components["/g2/C"].stateValues.equation.tree).eqls(["=", "y", ['-', 9]])
      expect(components["/g2/D"].stateValues.equation.tree).eqls(["=", "y", ['-', 3]])
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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(false);

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(false);
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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(true);

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(true);
    })


    cy.log('switch A via first action')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/g/A"].actions.switchLine();

      expect(components["/g/A"].stateValues.stable).eq(false);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(true);

      expect(components["/g2/A"].stateValues.stable).eq(false);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(true);


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
      let components = Object.assign({}, win.state.components);
      await components["/g2/A"].actions.switchLine();

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(true);

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(true);


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
      let components = Object.assign({}, win.state.components);
      await components["/g/B"].actions.switchLine();

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(true);

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(true);

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
      let components = Object.assign({}, win.state.components);
      await components["/g2/C"].actions.switchLine();

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(true);

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(true);

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
      let components = Object.assign({}, win.state.components);
      await components["/g2/D"].actions.switchLine();

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(false);

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(false);

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