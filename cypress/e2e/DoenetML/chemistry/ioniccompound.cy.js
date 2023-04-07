import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Ion Compounds Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
  })

  it('answer compounds from atom and ions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>


  <p>What is the ionic compound from <atom name="Li" symbol="Li" /> and <atom name="O" symbol="O" />?
    <answer name="ansLiO" splitSymbols="false"><ionicCompound>$Li$O</ionicCompound></answer>
  </p>

  <p>What is the ionic compound from <atom name="Ca" symbol="Ca" /> and <atom name="P" symbol="P" />?
    <answer name="ansCaP" splitSymbols="false"><math><ionicCompound>$Ca<ion>$P</ion></ionicCompound></math></answer>
  </p>
 
  <p>What is the ionic compound from <atom name="Mg" symbol="Mg" /> and <atom name="S" symbol="S" />?
    <answer name="ansMgS" splitSymbols="false"><ionicCompound><ion>$Mg</ion><ion>$S</ion></ionicCompound></answer>
  </p>
 
  <p>What is the ionic compound from <atom name="Sr" symbol="Sr" /> and <atom name="I" symbol="I" />?
    <answer name="ansSrI" splitSymbols="false"><ionicCompound><ion>$Sr</ion>$I</ionicCompound></answer>
  </p>

  `}, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputLiOName = stateVariables['/ansLiO'].stateValues.inputChildren[0].componentName
      let mathinputLiOAnchor = cesc('#' + mathinputLiOName) + " textarea";
      let mathinputLiOSubmitAnchor = cesc('#' + mathinputLiOName + '_submit');
      let mathinputLiOCorrectAnchor = cesc('#' + mathinputLiOName + '_correct');
      let mathinputLiOIncorrectAnchor = cesc('#' + mathinputLiOName + '_incorrect');

      cy.get(mathinputLiOAnchor).type("LiO{enter}", { force: true });
      cy.get(mathinputLiOIncorrectAnchor).should('be.visible')

      cy.get(mathinputLiOAnchor).type("{end}{leftarrow} {enter}", { force: true });
      cy.get(mathinputLiOIncorrectAnchor).should('be.visible')

      cy.get(mathinputLiOAnchor).type("{end}{leftarrow}{backspace}_2{enter}", { force: true });
      cy.get(mathinputLiOCorrectAnchor).should('be.visible')

      let mathinputCaPName = stateVariables['/ansCaP'].stateValues.inputChildren[0].componentName
      let mathinputCaPAnchor = cesc('#' + mathinputCaPName) + " textarea";
      let mathinputCaPSubmitAnchor = cesc('#' + mathinputCaPName + '_submit');
      let mathinputCaPCorrectAnchor = cesc('#' + mathinputCaPName + '_correct');
      let mathinputCaPIncorrectAnchor = cesc('#' + mathinputCaPName + '_incorrect');

      cy.get(mathinputCaPAnchor).type("CaP{enter}", { force: true });
      cy.get(mathinputCaPIncorrectAnchor).should('be.visible')

      cy.get(mathinputCaPAnchor).type("{end}{leftarrow}_3{enter}", { force: true });
      cy.get(mathinputCaPIncorrectAnchor).should('be.visible')

      cy.get(mathinputCaPAnchor).type("{ctrl+end}_2{enter}", { force: true });
      cy.get(mathinputCaPCorrectAnchor).should('be.visible')

      let mathinputMgSName = stateVariables['/ansMgS'].stateValues.inputChildren[0].componentName
      let mathinputMgSAnchor = cesc('#' + mathinputMgSName) + " textarea";
      let mathinputMgSSubmitAnchor = cesc('#' + mathinputMgSName + '_submit');
      let mathinputMgSCorrectAnchor = cesc('#' + mathinputMgSName + '_correct');
      let mathinputMgSIncorrectAnchor = cesc('#' + mathinputMgSName + '_incorrect');

      cy.get(mathinputMgSAnchor).type("MgS{enter}", { force: true });
      cy.get(mathinputMgSIncorrectAnchor).should('be.visible')

      cy.get(mathinputMgSAnchor).type("{end}{leftarrow} {enter}", { force: true });
      cy.get(mathinputMgSCorrectAnchor).should('be.visible')

      let mathinputSrIName = stateVariables['/ansSrI'].stateValues.inputChildren[0].componentName
      let mathinputSrIAnchor = cesc('#' + mathinputSrIName) + " textarea";
      let mathinputSrISubmitAnchor = cesc('#' + mathinputSrIName + '_submit');
      let mathinputSrICorrectAnchor = cesc('#' + mathinputSrIName + '_correct');
      let mathinputSrIIncorrectAnchor = cesc('#' + mathinputSrIName + '_incorrect');

      cy.get(mathinputSrIAnchor).type("SrI{enter}", { force: true });
      cy.get(mathinputSrIIncorrectAnchor).should('be.visible')

      cy.get(mathinputSrIAnchor).type("{end}_2{enter}", { force: true });
      cy.get(mathinputSrIIncorrectAnchor).should('be.visible')

      cy.get(mathinputSrIAnchor).type("{leftarrow}{leftarrow}{leftarrow} {enter}", { force: true });
      cy.get(mathinputSrICorrectAnchor).should('be.visible')


    })
  });

})