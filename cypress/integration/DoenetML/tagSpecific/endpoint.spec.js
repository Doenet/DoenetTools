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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g" newNamespace>
      <endpoint name="A" open switchAble>(4,0)</endpoint>
      <endpoint name="B">(7,0)</endpoint>
      <lineSegment endpoints="$A $B" />
      <endpoint name="C" open="$(../b1)" styleNumber="2">(-9,0)</endpoint>
      <endpoint name="D" open="$(../b2)" styleNumber="2" switchable>(-3,0)</endpoint>
      <lineSegment endpoints="$C $D" styleNumber="2" />
    </graph>
  
    <booleaninput name="b1" />
    <booleaninput name="b2" />

    <copy target="g" assignNames="g2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.open).eq(true);
      expect(stateVariables["/g/B"].stateValues.open).eq(false);
      expect(stateVariables["/g/C"].stateValues.open).eq(false);
      expect(stateVariables["/g/D"].stateValues.open).eq(false);
      expect(stateVariables["/g/A"].stateValues.xs.map(x => x.tree)).eqls([4, 0]);
      expect(stateVariables["/g/B"].stateValues.xs.map(x => x.tree)).eqls([7, 0]);
      expect(stateVariables["/g/C"].stateValues.xs.map(x => x.tree)).eqls([-9, 0]);
      expect(stateVariables["/g/D"].stateValues.xs.map(x => x.tree)).eqls([-3, 0]);

      expect(stateVariables["/g2/A"].stateValues.open).eq(true);
      expect(stateVariables["/g2/B"].stateValues.open).eq(false);
      expect(stateVariables["/g2/C"].stateValues.open).eq(false);
      expect(stateVariables["/g2/D"].stateValues.open).eq(false);
      expect(stateVariables["/g2/A"].stateValues.xs.map(x => x.tree)).eqls([4, 0]);
      expect(stateVariables["/g2/B"].stateValues.xs.map(x => x.tree)).eqls([7, 0]);
      expect(stateVariables["/g2/C"].stateValues.xs.map(x => x.tree)).eqls([-9, 0]);
      expect(stateVariables["/g2/D"].stateValues.xs.map(x => x.tree)).eqls([-3, 0]);
    })

    cy.log('switch C via boolean input')
    cy.get('#\\/b1_input').click();

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.open).eq(true);
      expect(stateVariables["/g/B"].stateValues.open).eq(false);
      expect(stateVariables["/g/C"].stateValues.open).eq(true);
      expect(stateVariables["/g/D"].stateValues.open).eq(false);

      expect(stateVariables["/g2/A"].stateValues.open).eq(true);
      expect(stateVariables["/g2/B"].stateValues.open).eq(false);
      expect(stateVariables["/g2/C"].stateValues.open).eq(true);
      expect(stateVariables["/g2/D"].stateValues.open).eq(false);
    })

    cy.log('switch D via boolean input')
    cy.get('#\\/b2_input').click();

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.open).eq(true);
      expect(stateVariables["/g/B"].stateValues.open).eq(false);
      expect(stateVariables["/g/C"].stateValues.open).eq(true);
      expect(stateVariables["/g/D"].stateValues.open).eq(true);

      expect(stateVariables["/g2/A"].stateValues.open).eq(true);
      expect(stateVariables["/g2/B"].stateValues.open).eq(false);
      expect(stateVariables["/g2/C"].stateValues.open).eq(true);
      expect(stateVariables["/g2/D"].stateValues.open).eq(true);
    })


    cy.log('switch A via first action')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await stateVariables["/g/A"].actions.switchPoint();

      expect(stateVariables["/g/A"].stateValues.open).eq(false);
      expect(stateVariables["/g/B"].stateValues.open).eq(false);
      expect(stateVariables["/g/C"].stateValues.open).eq(true);
      expect(stateVariables["/g/D"].stateValues.open).eq(true);

      expect(stateVariables["/g2/A"].stateValues.open).eq(false);
      expect(stateVariables["/g2/B"].stateValues.open).eq(false);
      expect(stateVariables["/g2/C"].stateValues.open).eq(true);
      expect(stateVariables["/g2/D"].stateValues.open).eq(true);
    })



    cy.log('switch A via second action')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await stateVariables["/g2/A"].actions.switchPoint();

      expect(stateVariables["/g/A"].stateValues.open).eq(true);
      expect(stateVariables["/g/B"].stateValues.open).eq(false);
      expect(stateVariables["/g/C"].stateValues.open).eq(true);
      expect(stateVariables["/g/D"].stateValues.open).eq(true);

      expect(stateVariables["/g2/A"].stateValues.open).eq(true);
      expect(stateVariables["/g2/B"].stateValues.open).eq(false);
      expect(stateVariables["/g2/C"].stateValues.open).eq(true);
      expect(stateVariables["/g2/D"].stateValues.open).eq(true);
    })

    
    cy.log('cannot switch B via action')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await stateVariables["/g/B"].actions.switchPoint();

      expect(stateVariables["/g/A"].stateValues.open).eq(true);
      expect(stateVariables["/g/B"].stateValues.open).eq(false);
      expect(stateVariables["/g/C"].stateValues.open).eq(true);
      expect(stateVariables["/g/D"].stateValues.open).eq(true);

      expect(stateVariables["/g2/A"].stateValues.open).eq(true);
      expect(stateVariables["/g2/B"].stateValues.open).eq(false);
      expect(stateVariables["/g2/C"].stateValues.open).eq(true);
      expect(stateVariables["/g2/D"].stateValues.open).eq(true);
    })


    
    cy.log('cannot switch C via second action')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await stateVariables["/g2/C"].actions.switchPoint();

      expect(stateVariables["/g/A"].stateValues.open).eq(true);
      expect(stateVariables["/g/B"].stateValues.open).eq(false);
      expect(stateVariables["/g/C"].stateValues.open).eq(true);
      expect(stateVariables["/g/D"].stateValues.open).eq(true);

      expect(stateVariables["/g2/A"].stateValues.open).eq(true);
      expect(stateVariables["/g2/B"].stateValues.open).eq(false);
      expect(stateVariables["/g2/C"].stateValues.open).eq(true);
      expect(stateVariables["/g2/D"].stateValues.open).eq(true);
    })

   
    cy.log('switch D via second action')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await stateVariables["/g2/D"].actions.switchPoint();

      expect(stateVariables["/g/A"].stateValues.open).eq(true);
      expect(stateVariables["/g/B"].stateValues.open).eq(false);
      expect(stateVariables["/g/C"].stateValues.open).eq(true);
      expect(stateVariables["/g/D"].stateValues.open).eq(false);

      expect(stateVariables["/g2/A"].stateValues.open).eq(true);
      expect(stateVariables["/g2/B"].stateValues.open).eq(false);
      expect(stateVariables["/g2/C"].stateValues.open).eq(true);
      expect(stateVariables["/g2/D"].stateValues.open).eq(false);
    })




  });


})