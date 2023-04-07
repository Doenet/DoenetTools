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
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })


  it('get 1 for document credit with nothing', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy assignNames="docCa" prop="creditAchieved" target="_document1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.get('#\\/docCa').should('have.text', '1');

  })

  it('document credit when have problem with nothing', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy assignNames="docCa" prop="creditAchieved" target="_document1" />
  <p><answer name="ans">x</answer></p>
  <problem>
    <title>Problem with nothing</title>
  </problem>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.get('#\\/docCa').should('have.text', '0.5');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables["/ans"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";

      cy.get(mathinputAnchor).type('x{enter}', { force: true });

      cy.get('#\\/docCa').should('have.text', '1');


    });
  })

  it('get document credit even when have composites as a siblings', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy assignNames="docCa" prop="creditAchieved" target="_document1" />
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables["/ans"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";

      cy.get(mathinputAnchor).type('x{enter}', { force: true });

      cy.get('#\\/docCa').should('have.text', '1');


    });

  })

  it(`item credit achieved, don't skip weight 0`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy assignNames="docCa" prop="creditAchieved" target="_document1" />
  <p>x: <answer name="x">x</answer></p>
  <p>a: <answer name="a" weight="0">a</answer></p>
  <problem>
    <p>y: <answer name="y">y</answer></p>
  </problem>
  <problem weight="0">
    <p>b: <answer name="b">b</answer></p>
  </problem>
  <problem>
    <p>z: <answer name="z">z</answer></p>
  </problem>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.get('#\\/docCa').should('have.text', '0');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_document1"].stateValues.itemCreditAchieved).eqls([0, 0, 0, 0, 0])

      let mathinputXName = stateVariables["/x"].stateValues.inputChildren[0].componentName;
      let mathinputXAnchor = cesc('#' + mathinputXName) + " textarea";
      let mathinputXCorrect = cesc('#' + mathinputXName) + "_correct";
      let mathinputYName = stateVariables["/y"].stateValues.inputChildren[0].componentName;
      let mathinputYAnchor = cesc('#' + mathinputYName) + " textarea";
      let mathinputYCorrect = cesc('#' + mathinputYName) + "_correct";
      let mathinputZName = stateVariables["/z"].stateValues.inputChildren[0].componentName;
      let mathinputZAnchor = cesc('#' + mathinputZName) + " textarea";
      let mathinputZCorrect = cesc('#' + mathinputZName) + "_correct";
      let mathinputAName = stateVariables["/a"].stateValues.inputChildren[0].componentName;
      let mathinputAAnchor = cesc('#' + mathinputAName) + " textarea";
      let mathinputACorrect = cesc('#' + mathinputAName) + "_correct";
      let mathinputBName = stateVariables["/b"].stateValues.inputChildren[0].componentName;
      let mathinputBAnchor = cesc('#' + mathinputBName) + " textarea";
      let mathinputBCorrect = cesc('#' + mathinputBName) + "_correct";


      cy.get(mathinputXAnchor).type('x{enter}', { force: true });
      cy.get(mathinputXCorrect).should('be.visible');
      cy.get('#\\/docCa').should('have.text', '0.333');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_document1"].stateValues.itemCreditAchieved).eqls([1, 0, 0, 0, 0])
      })

      cy.get(mathinputAAnchor).type('a{enter}', { force: true });
      cy.get(mathinputACorrect).should('be.visible');
      cy.get('#\\/docCa').should('have.text', '0.333');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_document1"].stateValues.itemCreditAchieved).eqls([1, 1, 0, 0, 0])
      })

      cy.get(mathinputYAnchor).type('y{enter}', { force: true });
      cy.get(mathinputYCorrect).should('be.visible');
      cy.get('#\\/docCa').should('have.text', '0.667');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_document1"].stateValues.itemCreditAchieved).eqls([1, 1, 1, 0, 0])
      })


      cy.get(mathinputBAnchor).type('b{enter}', { force: true });
      cy.get(mathinputBCorrect).should('be.visible');
      cy.get('#\\/docCa').should('have.text', '0.667');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_document1"].stateValues.itemCreditAchieved).eqls([1, 1, 1, 1, 0])
      })


      cy.get(mathinputZAnchor).type('z{enter}', { force: true });
      cy.get(mathinputZCorrect).should('be.visible');
      cy.get('#\\/docCa').should('have.text', '1');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_document1"].stateValues.itemCreditAchieved).eqls([1, 1, 1, 1, 1])
      })

    });
  })

  it('explicit document tag, ignore outer blank strings', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

  <document>a</document>



  `}, "*");
    });

    cy.get('#\\/_document1').should('contain.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(Object.keys(stateVariables).length).eq(1);

      expect(stateVariables["/_document1"].activeChildren).eqls(["a"]);


    });

  })


})

