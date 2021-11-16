import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Equilibriumpoint Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('equilibriumpoint change stable', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g" newNamespace>
      <equilibriumpoint name="A" switchAble>(4,0)</equilibriumpoint>
      <equilibriumpoint name="B" stable="false">(7,0)</equilibriumpoint>
      <equilibriumpoint name="C" stable="$(../b1)" styleNumber="2">(-9,0)</equilibriumpoint>
      <equilibriumpoint name="D" stable="$(../b2)" styleNumber="2" switchable>(-3,0)</equilibriumpoint>
    </graph>
  
    <booleaninput name="b1" />
    <booleaninput name="b2" />

    <copy tname="g" assignNames="g2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(false);
      expect(components["/g/D"].stateValues.stable).eq(false);
      expect(components["/g/A"].stateValues.xs.map(x => x.tree)).eqls([4, 0]);
      expect(components["/g/B"].stateValues.xs.map(x => x.tree)).eqls([7, 0]);
      expect(components["/g/C"].stateValues.xs.map(x => x.tree)).eqls([-9, 0]);
      expect(components["/g/D"].stateValues.xs.map(x => x.tree)).eqls([-3, 0]);

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(false);
      expect(components["/g2/D"].stateValues.stable).eq(false);
      expect(components["/g2/A"].stateValues.xs.map(x => x.tree)).eqls([4, 0]);
      expect(components["/g2/B"].stateValues.xs.map(x => x.tree)).eqls([7, 0]);
      expect(components["/g2/C"].stateValues.xs.map(x => x.tree)).eqls([-9, 0]);
      expect(components["/g2/D"].stateValues.xs.map(x => x.tree)).eqls([-3, 0]);
    })

    cy.log('switch C via boolean input')
    cy.get('#\\/b1_input').click();

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
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/g/A"].actions.switchPoint();

      expect(components["/g/A"].stateValues.stable).eq(false);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(true);

      expect(components["/g2/A"].stateValues.stable).eq(false);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(true);
    })



    cy.log('switch A via second action')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/g2/A"].actions.switchPoint();

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(true);

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(true);
    })

    
    cy.log('cannot switch B via action')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/g/B"].actions.switchPoint();

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(true);

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(true);
    })


    
    cy.log('cannot switch C via second action')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/g2/C"].actions.switchPoint();

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(true);

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(true);
    })

   
    cy.log('switch D via second action')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/g2/D"].actions.switchPoint();

      expect(components["/g/A"].stateValues.stable).eq(true);
      expect(components["/g/B"].stateValues.stable).eq(false);
      expect(components["/g/C"].stateValues.stable).eq(true);
      expect(components["/g/D"].stateValues.stable).eq(false);

      expect(components["/g2/A"].stateValues.stable).eq(true);
      expect(components["/g2/B"].stateValues.stable).eq(false);
      expect(components["/g2/C"].stateValues.stable).eq(true);
      expect(components["/g2/D"].stateValues.stable).eq(false);
    })




  });


})