import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Document Tag Tests', function () {

  beforeEach(() => {

    cy.visit('/cypressTest')

  })


  it('get 1 for document credit with nothing', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy assignNames="docCa" prop="creditAchieved" tname="_document1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.get('#\\/docCa').should('have.text', '1');

  })

  it('document credit when have problem with nothing', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy assignNames="docCa" prop="creditAchieved" tname="_document1" />
  <p><answer name="ans">x</answer></p>
  <problem>
    <title>Problem with nothing</title>
  </problem>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.get('#\\/docCa').should('have.text', '0.5');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components["/ans"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";

      cy.get(mathinputAnchor).type('x{enter}', { force: true });

      cy.get('#\\/docCa').should('have.text', '1');


    });
  })

  it('get document credit even when have composites as a siblings', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy assignNames="docCa" prop="creditAchieved" tname="_document1" />
  <setup>
    <math name="m1">x</math>
  </setup>
  <group>
    <math name="m2">$m1</math>
  </group>
  <p><answer name="ans"><award>$m2</award></answer></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.get('#\\/docCa').should('have.text', '0');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components["/ans"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";

      cy.get(mathinputAnchor).type('x{enter}', { force: true });

      cy.get('#\\/docCa').should('have.text', '1');


    });

  })


})

