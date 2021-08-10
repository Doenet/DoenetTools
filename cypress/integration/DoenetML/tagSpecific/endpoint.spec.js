import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Endpoint Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('endpoint change open', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g" newNamespace>
      <endpoint name="A" open>(4,0)</endpoint>
      <endpoint name="B">(7,0)</endpoint>
      <lineSegment endpoints="$A $B" />
      <endpoint name="C" open="$(../b1)" styleNumber="2">(-9,0)</endpoint>
      <endpoint name="D" open="$(../b2)" styleNumber="2">(-3,0)</endpoint>
      <lineSegment endpoints="$C $D" styleNumber="2" />
    </graph>
  
    <booleaninput name="b1" />
    <booleaninput name="b2" />

    <copy tname="g" assignNames="g2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/g/A"].stateValues.open).eq(true);
      expect(components["/g/B"].stateValues.open).eq(false);
      expect(components["/g/C"].stateValues.open).eq(false);
      expect(components["/g/D"].stateValues.open).eq(false);
      expect(components["/g/A"].stateValues.xs.map(x => x.tree)).eqls([4, 0]);
      expect(components["/g/B"].stateValues.xs.map(x => x.tree)).eqls([7, 0]);
      expect(components["/g/C"].stateValues.xs.map(x => x.tree)).eqls([-9, 0]);
      expect(components["/g/D"].stateValues.xs.map(x => x.tree)).eqls([-3, 0]);

      expect(components["/g2/A"].stateValues.open).eq(true);
      expect(components["/g2/B"].stateValues.open).eq(false);
      expect(components["/g2/C"].stateValues.open).eq(false);
      expect(components["/g2/D"].stateValues.open).eq(false);
      expect(components["/g2/A"].stateValues.xs.map(x => x.tree)).eqls([4, 0]);
      expect(components["/g2/B"].stateValues.xs.map(x => x.tree)).eqls([7, 0]);
      expect(components["/g2/C"].stateValues.xs.map(x => x.tree)).eqls([-9, 0]);
      expect(components["/g2/D"].stateValues.xs.map(x => x.tree)).eqls([-3, 0]);
    })

    cy.get('#\\/b1_input').click();

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/g/A"].stateValues.open).eq(true);
      expect(components["/g/B"].stateValues.open).eq(false);
      expect(components["/g/C"].stateValues.open).eq(true);
      expect(components["/g/D"].stateValues.open).eq(false);

      expect(components["/g2/A"].stateValues.open).eq(true);
      expect(components["/g2/B"].stateValues.open).eq(false);
      expect(components["/g2/C"].stateValues.open).eq(true);
      expect(components["/g2/D"].stateValues.open).eq(false);
    })

    cy.get('#\\/b2_input').click();

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/g/A"].stateValues.open).eq(true);
      expect(components["/g/B"].stateValues.open).eq(false);
      expect(components["/g/C"].stateValues.open).eq(true);
      expect(components["/g/D"].stateValues.open).eq(true);

      expect(components["/g2/A"].stateValues.open).eq(true);
      expect(components["/g2/B"].stateValues.open).eq(false);
      expect(components["/g2/C"].stateValues.open).eq(true);
      expect(components["/g2/D"].stateValues.open).eq(true);
    })


    cy.get('#\\/b1_input').click();

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/g/A"].stateValues.open).eq(true);
      expect(components["/g/B"].stateValues.open).eq(false);
      expect(components["/g/C"].stateValues.open).eq(false);
      expect(components["/g/D"].stateValues.open).eq(true);

      expect(components["/g2/A"].stateValues.open).eq(true);
      expect(components["/g2/B"].stateValues.open).eq(false);
      expect(components["/g2/C"].stateValues.open).eq(false);
      expect(components["/g2/D"].stateValues.open).eq(true);
    })

  });


})