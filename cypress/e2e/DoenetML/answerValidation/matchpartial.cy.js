import { cesc } from '../../../../src/_utils/url';

function cesc2(s) {
  return cesc(cesc(s));
}


describe('Match partial validation tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
  })

  it('match partial with ordered and unordered tuple', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>
  <setup>
    <math name="ordered">(1,2,3)</math>
    <math name="unordered" unordered>(1,2,3)</math>
  </setup>

  <p>Match partial: <answer>
    <award matchpartial>$ordered</award>
  </answer></p>
  
  <p>Match partial, match by exact positions: <answer>
    <award matchpartial matchByExactPositions>$ordered</award>
  </answer></p>
  
  <p>Match partial, unordered: <answer>
    <award matchpartial>$unordered</award>
  </answer></p>
  
  <p>Strict equality: <answer>
    <award>$ordered</award>
  </answer></p>
  
  <p>Unordered: <answer>
    <award>$unordered</award>
  </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc2('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc2('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc2('#' + mathinputName + '_correct');
      let mathinputPartialAnchor = cesc2('#' + mathinputName + '_partial');
      let mathinputIncorrectAnchor = cesc2('#' + mathinputName + '_incorrect');

      let mathinput2Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc2('#' + mathinput2Name) + ' textarea';
      let mathinput2SubmitAnchor = cesc2('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc2('#' + mathinput2Name + '_correct');
      let mathinput2PartialAnchor = cesc2('#' + mathinput2Name + '_partial');
      let mathinput2IncorrectAnchor = cesc2('#' + mathinput2Name + '_incorrect');

      let mathinput3Name = stateVariables['/_answer3'].stateValues.inputChildren[0].componentName
      let mathinput3Anchor = cesc2('#' + mathinput3Name) + ' textarea';
      let mathinput3SubmitAnchor = cesc2('#' + mathinput3Name + '_submit');
      let mathinput3CorrectAnchor = cesc2('#' + mathinput3Name + '_correct');
      let mathinput3PartialAnchor = cesc2('#' + mathinput3Name + '_partial');
      let mathinput3IncorrectAnchor = cesc2('#' + mathinput3Name + '_incorrect');

      let mathinput4Name = stateVariables['/_answer4'].stateValues.inputChildren[0].componentName
      let mathinput4Anchor = cesc2('#' + mathinput4Name) + ' textarea';
      let mathinput4SubmitAnchor = cesc2('#' + mathinput4Name + '_submit');
      let mathinput4CorrectAnchor = cesc2('#' + mathinput4Name + '_correct');
      let mathinput4PartialAnchor = cesc2('#' + mathinput4Name + '_partial');
      let mathinput4IncorrectAnchor = cesc2('#' + mathinput4Name + '_incorrect');

      let mathinput5Name = stateVariables['/_answer5'].stateValues.inputChildren[0].componentName
      let mathinput5Anchor = cesc2('#' + mathinput5Name) + ' textarea';
      let mathinput5SubmitAnchor = cesc2('#' + mathinput5Name + '_submit');
      let mathinput5CorrectAnchor = cesc2('#' + mathinput5Name + '_correct');
      let mathinput5PartialAnchor = cesc2('#' + mathinput5Name + '_partial');
      let mathinput5IncorrectAnchor = cesc2('#' + mathinput5Name + '_incorrect');

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).should('be.visible');
      cy.get(mathinput5SubmitAnchor).should('be.visible');

      cy.log("Submit empty answers")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Omit one component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });

      cy.log("just a scalar")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });

      cy.log("just a scalar matching first component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}1', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}1', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}1', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });

      cy.log("extra component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(1 / 2, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });

      cy.log("two extra components")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });

      cy.log("omit parens")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });

      cy.log("permute order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(1);
      });

      cy.log("reverse order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(1);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '25 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(1 / 4, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add another component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '40 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 5, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });


      cy.log("add one more component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '17 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(1 / 6, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });


      cy.log("two components out of order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
      });
    })

  });

  it('match partial with ordered and unordered list', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>
  <p>Match partial: <answer>
    <award matchpartial><math>1,2,3</math></award>
  </answer></p>
  
  <p>Match partial, unordered: <answer>
    <award matchpartial><math unordered="true">1,2,3</math></award>
  </answer></p>
  
  <p>Strict equality: <answer>
    <award><math>1,2,3</math></award>
  </answer></p>
  
  <p>Unordered: <answer>
    <award><math unordered="true">1,2,3</math></award>
  </answer></p>
    `}, "*");
    });


    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc2('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc2('#' + mathinputName + '_correct');
      let mathinputPartialAnchor = cesc2('#' + mathinputName + '_partial');
      let mathinputIncorrectAnchor = cesc2('#' + mathinputName + '_incorrect');

      let mathinput2Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc2('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc2('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc2('#' + mathinput2Name + '_correct');
      let mathinput2PartialAnchor = cesc2('#' + mathinput2Name + '_partial');
      let mathinput2IncorrectAnchor = cesc2('#' + mathinput2Name + '_incorrect');

      let mathinput3Name = stateVariables['/_answer3'].stateValues.inputChildren[0].componentName
      let mathinput3Anchor = cesc2('#' + mathinput3Name) + " textarea";
      let mathinput3SubmitAnchor = cesc2('#' + mathinput3Name + '_submit');
      let mathinput3CorrectAnchor = cesc2('#' + mathinput3Name + '_correct');
      let mathinput3PartialAnchor = cesc2('#' + mathinput3Name + '_partial');
      let mathinput3IncorrectAnchor = cesc2('#' + mathinput3Name + '_incorrect');

      let mathinput4Name = stateVariables['/_answer4'].stateValues.inputChildren[0].componentName
      let mathinput4Anchor = cesc2('#' + mathinput4Name) + " textarea";
      let mathinput4SubmitAnchor = cesc2('#' + mathinput4Name + '_submit');
      let mathinput4CorrectAnchor = cesc2('#' + mathinput4Name + '_correct');
      let mathinput4PartialAnchor = cesc2('#' + mathinput4Name + '_partial');
      let mathinput4IncorrectAnchor = cesc2('#' + mathinput4Name + '_incorrect');

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).should('be.visible');

      cy.log("Submit empty answers")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('1,2,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('1,2,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('1,2,3', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('1,2,3', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Omit one component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}1,3', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}1,3', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("just a scalar")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("extra component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1,2,a,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,a,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,a,3', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,a,3', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("two extra components")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}0,1,2,a,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}0,1,2,a,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}0,1,2,a,3', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}0,1,2,a,3', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add parens")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("permute order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}3,1,2', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}3,1,2', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}3,1,2', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}3,1,2', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("reverse order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}3,2,1', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}3,2,1', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}3,2,1', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}3,2,1', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}3,2,1,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}3,2,1,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}3,2,1,3', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}3,2,1,3', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add another component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}3,a,2,1,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '40 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}3,a,2,1,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}3,a,2,1,3', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}3,a,2,1,3', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 5, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("add one more component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1,3,a,2,1,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1,3,a,2,1,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}1,3,a,2,1,3', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}1,3,a,2,1,3', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("two component out of order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}3,1', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}3,1', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}3,1', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}3,1', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}3,1,1', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}3,1,1', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}3,1,1', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}3,1,1', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });
    })
  });

  it('match partial with ordered and unordered array', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>
  <p>Match partial: <answer>
    <award matchpartial><math>[1,2,3]</math></award>
  </answer></p>
  
  <p>Match partial, unordered: <answer>
    <award matchpartial><math unordered="true">[1,2,3]</math></award>
  </answer></p>
  
  <p>Strict equality: <answer>
    <award><math>[1,2,3]</math></award>
  </answer></p>
  
  <p>Unordered: <answer>
    <award><math unordered="true">[1,2,3]</math></award>
  </answer></p>
    `}, "*");
    });


    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc2('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc2('#' + mathinputName + '_correct');
      let mathinputPartialAnchor = cesc2('#' + mathinputName + '_partial');
      let mathinputIncorrectAnchor = cesc2('#' + mathinputName + '_incorrect');

      let mathinput2Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc2('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc2('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc2('#' + mathinput2Name + '_correct');
      let mathinput2PartialAnchor = cesc2('#' + mathinput2Name + '_partial');
      let mathinput2IncorrectAnchor = cesc2('#' + mathinput2Name + '_incorrect');

      let mathinput3Name = stateVariables['/_answer3'].stateValues.inputChildren[0].componentName
      let mathinput3Anchor = cesc2('#' + mathinput3Name) + " textarea";
      let mathinput3SubmitAnchor = cesc2('#' + mathinput3Name + '_submit');
      let mathinput3CorrectAnchor = cesc2('#' + mathinput3Name + '_correct');
      let mathinput3PartialAnchor = cesc2('#' + mathinput3Name + '_partial');
      let mathinput3IncorrectAnchor = cesc2('#' + mathinput3Name + '_incorrect');

      let mathinput4Name = stateVariables['/_answer4'].stateValues.inputChildren[0].componentName
      let mathinput4Anchor = cesc2('#' + mathinput4Name) + " textarea";
      let mathinput4SubmitAnchor = cesc2('#' + mathinput4Name + '_submit');
      let mathinput4CorrectAnchor = cesc2('#' + mathinput4Name + '_correct');
      let mathinput4PartialAnchor = cesc2('#' + mathinput4Name + '_partial');
      let mathinput4IncorrectAnchor = cesc2('#' + mathinput4Name + '_incorrect');

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).should('be.visible');

      cy.log("Submit empty answers")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('[1,2,3]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('[1,2,3]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('[1,2,3]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('[1,2,3]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Omit one component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[1,3]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[1,3]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[1,3]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[1,3]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("just a scalar")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("extra component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[1,2,a,3]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2,a,3]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2,a,3]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2,a,3]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("two extra components")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[0,1,2,a,3]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[0,1,2,a,3]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[0,1,2,a,3]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[0,1,2,a,3]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("omit brackets")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("permute order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[3,1,2]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[3,1,2]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[3,1,2]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[3,1,2]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("reverse order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[3,2,1]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[3,2,1]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[3,2,1]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[3,2,1]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[3,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[3,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[3,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[3,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add another component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[3,a,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '40 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[3,a,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[3,a,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[3,a,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 5, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("add one more component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[1,3,a,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[1,3,a,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[1,3,a,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[1,3,a,2,1,3]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("two component out of order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[3,1]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[3,1]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[3,1]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[3,1]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[3,1,1]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[3,1,1]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[3,1,1]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[3,1,1]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });
    })

  });

  it('match partial with ordered and unordered tuple, unordered specified on award', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>

  <p>Match partial: <answer>
    <award matchpartial><math>(1,2,3)</math></award>
  </answer></p>
  
  <p>Match partial, unordered: <answer>
    <award matchpartial unorderedCompare><math>(1,2,3)</math></award>
  </answer></p>
  
  <p>Strict equality: <answer>
    <award><math>(1,2,3)</math></award>
  </answer></p>
  
  <p>Unordered: <answer>
    <award unorderedCompare="true"><math>(1,2,3)</math></award>
  </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc2('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc2('#' + mathinputName + '_correct');
      let mathinputPartialAnchor = cesc2('#' + mathinputName + '_partial');
      let mathinputIncorrectAnchor = cesc2('#' + mathinputName + '_incorrect');

      let mathinput2Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc2('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc2('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc2('#' + mathinput2Name + '_correct');
      let mathinput2PartialAnchor = cesc2('#' + mathinput2Name + '_partial');
      let mathinput2IncorrectAnchor = cesc2('#' + mathinput2Name + '_incorrect');

      let mathinput3Name = stateVariables['/_answer3'].stateValues.inputChildren[0].componentName
      let mathinput3Anchor = cesc2('#' + mathinput3Name) + " textarea";
      let mathinput3SubmitAnchor = cesc2('#' + mathinput3Name + '_submit');
      let mathinput3CorrectAnchor = cesc2('#' + mathinput3Name + '_correct');
      let mathinput3PartialAnchor = cesc2('#' + mathinput3Name + '_partial');
      let mathinput3IncorrectAnchor = cesc2('#' + mathinput3Name + '_incorrect');

      let mathinput4Name = stateVariables['/_answer4'].stateValues.inputChildren[0].componentName
      let mathinput4Anchor = cesc2('#' + mathinput4Name) + " textarea";
      let mathinput4SubmitAnchor = cesc2('#' + mathinput4Name + '_submit');
      let mathinput4CorrectAnchor = cesc2('#' + mathinput4Name + '_correct');
      let mathinput4PartialAnchor = cesc2('#' + mathinput4Name + '_partial');
      let mathinput4IncorrectAnchor = cesc2('#' + mathinput4Name + '_incorrect');

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).should('be.visible');

      cy.log("Submit empty answers")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Omit one component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("just a scalar")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("extra component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("two extra components")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("omit parens")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("permute order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("reverse order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add another component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '40 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 5, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("add one more component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("two component out of order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });
    })

  });

  it('match partial with ordered and unordered tuple, unordered specified on answer', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>

  <p>Match partial: <answer>
    <award matchpartial><math>(1,2,3)</math></award>
  </answer></p>
  
  <p>Match partial, unordered: <answer unorderedCompare>
    <award matchpartial><math>(1,2,3)</math></award>
  </answer></p>
  
  <p>Strict equality: <answer>
    <award><math>(1,2,3)</math></award>
  </answer></p>
  
  <p>Unordered: <answer unorderedCompare="true">
    <award><math>(1,2,3)</math></award>
  </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc2('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc2('#' + mathinputName + '_correct');
      let mathinputPartialAnchor = cesc2('#' + mathinputName + '_partial');
      let mathinputIncorrectAnchor = cesc2('#' + mathinputName + '_incorrect');

      let mathinput2Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc2('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc2('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc2('#' + mathinput2Name + '_correct');
      let mathinput2PartialAnchor = cesc2('#' + mathinput2Name + '_partial');
      let mathinput2IncorrectAnchor = cesc2('#' + mathinput2Name + '_incorrect');

      let mathinput3Name = stateVariables['/_answer3'].stateValues.inputChildren[0].componentName
      let mathinput3Anchor = cesc2('#' + mathinput3Name) + " textarea";
      let mathinput3SubmitAnchor = cesc2('#' + mathinput3Name + '_submit');
      let mathinput3CorrectAnchor = cesc2('#' + mathinput3Name + '_correct');
      let mathinput3PartialAnchor = cesc2('#' + mathinput3Name + '_partial');
      let mathinput3IncorrectAnchor = cesc2('#' + mathinput3Name + '_incorrect');

      let mathinput4Name = stateVariables['/_answer4'].stateValues.inputChildren[0].componentName
      let mathinput4Anchor = cesc2('#' + mathinput4Name) + " textarea";
      let mathinput4SubmitAnchor = cesc2('#' + mathinput4Name + '_submit');
      let mathinput4CorrectAnchor = cesc2('#' + mathinput4Name + '_correct');
      let mathinput4PartialAnchor = cesc2('#' + mathinput4Name + '_partial');
      let mathinput4IncorrectAnchor = cesc2('#' + mathinput4Name + '_incorrect');

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).should('be.visible');

      cy.log("Submit empty answers")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('(1,2,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Omit one component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("just a scalar")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}2', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("extra component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("two extra components")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(0,1,2,a,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("omit parens")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("permute order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,2)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("reverse order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add another component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '40 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 5, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("add one more component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3,a,2,1,3)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("two component out of order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(3,1,1)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });
    })

  });

  it('match set', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>
  <p>Match partial: <answer>
    <award matchpartial><math>{1,2,3}</math></award>
  </answer></p>
  
  <p>No partial: <answer>
    <award><math>{1,2,3}</math></award>
  </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc2('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc2('#' + mathinputName + '_correct');
      let mathinputPartialAnchor = cesc2('#' + mathinputName + '_partial');
      let mathinputIncorrectAnchor = cesc2('#' + mathinputName + '_incorrect');

      let mathinput2Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc2('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc2('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc2('#' + mathinput2Name + '_correct');
      let mathinput2PartialAnchor = cesc2('#' + mathinput2Name + '_partial');
      let mathinput2IncorrectAnchor = cesc2('#' + mathinput2Name + '_incorrect');

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');

      cy.log("Submit empty answers")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('{{}1,2,3}', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{{}1,2,3}', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Permute components")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}{{}3,2,1}', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}{{}3,2,1}', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Extra component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}{{}3,a,2,1}', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}{{}3,a,2,1}', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Another component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}{{}3,a,2,b,1}', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}{{}3,a,2,b,1}', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Duplicate components")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}{{}3,2,3,1,1}', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}{{}3,2,3,1,1}', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Add component")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}{{}3,2,3,a,1,1}', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}{{}3,2,3,a,1,1}', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Omit braces")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1,2,3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Single number")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}3', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}3', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Subset")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}{{}2,1}', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}{{}2,1}', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
      });

    })
  });

  it('match intervals', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>
  <p>Open, match partial: <answer>
    <award matchpartial><math createintervals>(1,2)</math></award>
  </answer></p>
  
  <p>Open, no partial: <answer>
    <award><math createintervals>(1,2)</math></award>
  </answer></p>

  <p>Closed, match partial: <answer>
    <award matchpartial><math createintervals>[1,2]</math></award>
  </answer></p>

  <p>Closed, no partial: <answer>
    <award><math createintervals>[1,2]</math></award>
  </answer></p>

  <p>Left open, match partial: <answer>
    <award matchpartial><math>(1,2]</math></award>
  </answer></p>

  <p>Left open, no partial: <answer>
    <award><math>(1,2]</math></award>
  </answer></p>

  <p>Right open, match partial: <answer>
    <award matchpartial><math>[1,2)</math></award>
  </answer></p>

  <p>Right open, no partial: <answer>
    <award><math>[1,2)</math></award>
  </answer></p>

    `}, "*");
    });


    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc2('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc2('#' + mathinputName + '_correct');
      let mathinputPartialAnchor = cesc2('#' + mathinputName + '_partial');
      let mathinputIncorrectAnchor = cesc2('#' + mathinputName + '_incorrect');

      let mathinput2Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc2('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc2('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc2('#' + mathinput2Name + '_correct');
      let mathinput2PartialAnchor = cesc2('#' + mathinput2Name + '_partial');
      let mathinput2IncorrectAnchor = cesc2('#' + mathinput2Name + '_incorrect');

      let mathinput3Name = stateVariables['/_answer3'].stateValues.inputChildren[0].componentName
      let mathinput3Anchor = cesc2('#' + mathinput3Name) + " textarea";
      let mathinput3SubmitAnchor = cesc2('#' + mathinput3Name + '_submit');
      let mathinput3CorrectAnchor = cesc2('#' + mathinput3Name + '_correct');
      let mathinput3PartialAnchor = cesc2('#' + mathinput3Name + '_partial');
      let mathinput3IncorrectAnchor = cesc2('#' + mathinput3Name + '_incorrect');

      let mathinput4Name = stateVariables['/_answer4'].stateValues.inputChildren[0].componentName
      let mathinput4Anchor = cesc2('#' + mathinput4Name) + " textarea";
      let mathinput4SubmitAnchor = cesc2('#' + mathinput4Name + '_submit');
      let mathinput4CorrectAnchor = cesc2('#' + mathinput4Name + '_correct');
      let mathinput4PartialAnchor = cesc2('#' + mathinput4Name + '_partial');
      let mathinput4IncorrectAnchor = cesc2('#' + mathinput4Name + '_incorrect');

      let mathinput5Name = stateVariables['/_answer5'].stateValues.inputChildren[0].componentName
      let mathinput5Anchor = cesc2('#' + mathinput5Name) + " textarea";
      let mathinput5SubmitAnchor = cesc2('#' + mathinput5Name + '_submit');
      let mathinput5CorrectAnchor = cesc2('#' + mathinput5Name + '_correct');
      let mathinput5PartialAnchor = cesc2('#' + mathinput5Name + '_partial');
      let mathinput5IncorrectAnchor = cesc2('#' + mathinput5Name + '_incorrect');

      let mathinput6Name = stateVariables['/_answer6'].stateValues.inputChildren[0].componentName
      let mathinput6Anchor = cesc2('#' + mathinput6Name) + " textarea";
      let mathinput6SubmitAnchor = cesc2('#' + mathinput6Name + '_submit');
      let mathinput6CorrectAnchor = cesc2('#' + mathinput6Name + '_correct');
      let mathinput6PartialAnchor = cesc2('#' + mathinput6Name + '_partial');
      let mathinput6IncorrectAnchor = cesc2('#' + mathinput6Name + '_incorrect');

      let mathinput7Name = stateVariables['/_answer7'].stateValues.inputChildren[0].componentName
      let mathinput7Anchor = cesc2('#' + mathinput7Name) + " textarea";
      let mathinput7SubmitAnchor = cesc2('#' + mathinput7Name + '_submit');
      let mathinput7CorrectAnchor = cesc2('#' + mathinput7Name + '_correct');
      let mathinput7PartialAnchor = cesc2('#' + mathinput7Name + '_partial');
      let mathinput7IncorrectAnchor = cesc2('#' + mathinput7Name + '_incorrect');

      let mathinput8Name = stateVariables['/_answer8'].stateValues.inputChildren[0].componentName
      let mathinput8Anchor = cesc2('#' + mathinput8Name) + " textarea";
      let mathinput8SubmitAnchor = cesc2('#' + mathinput8Name + '_submit');
      let mathinput8CorrectAnchor = cesc2('#' + mathinput8Name + '_correct');
      let mathinput8PartialAnchor = cesc2('#' + mathinput8Name + '_partial');
      let mathinput8IncorrectAnchor = cesc2('#' + mathinput8Name + '_incorrect');


      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).should('be.visible');
      cy.get(mathinput5SubmitAnchor).should('be.visible');
      cy.get(mathinput6SubmitAnchor).should('be.visible');
      cy.get(mathinput7SubmitAnchor).should('be.visible');
      cy.get(mathinput8SubmitAnchor).should('be.visible');

      cy.log("Submit empty answers")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');
      cy.get(mathinput6SubmitAnchor).click();
      cy.get(mathinput6IncorrectAnchor).should('be.visible');
      cy.get(mathinput7SubmitAnchor).click();
      cy.get(mathinput7IncorrectAnchor).should('be.visible');
      cy.get(mathinput8SubmitAnchor).click();
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
      });


      cy.log("single number")
      cy.get(mathinputAnchor).type('1', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('1', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('1', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('1', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('1', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).type('1', { force: true, delay: 0 });
      cy.get(mathinput6SubmitAnchor).click();
      cy.get(mathinput6IncorrectAnchor).should('be.visible');
      cy.get(mathinput7Anchor).type('1', { force: true, delay: 0 });
      cy.get(mathinput7SubmitAnchor).click();
      cy.get(mathinput7IncorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).type('1', { force: true, delay: 0 });
      cy.get(mathinput8SubmitAnchor).click();
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Open interval")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,2)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2)', { force: true, delay: 0 });
      cy.get(mathinput6SubmitAnchor).click();
      cy.get(mathinput6IncorrectAnchor).should('be.visible');
      cy.get(mathinput7Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2)', { force: true, delay: 0 });
      cy.get(mathinput7SubmitAnchor).click();
      cy.get(mathinput7IncorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2)', { force: true, delay: 0 });
      cy.get(mathinput8SubmitAnchor).click();
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
      });

      cy.log("partially correct open interval")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3,2)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3,2)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
      });


      cy.log("permute order")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(2,1)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(2,1)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Closed interval")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[1,2]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2]', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2]', { force: true, delay: 0 });
      cy.get(mathinput6SubmitAnchor).click();
      cy.get(mathinput6IncorrectAnchor).should('be.visible');
      cy.get(mathinput7Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2]', { force: true, delay: 0 });
      cy.get(mathinput7SubmitAnchor).click();
      cy.get(mathinput7IncorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2]', { force: true, delay: 0 });
      cy.get(mathinput8SubmitAnchor).click();
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Partially correct closed interval")
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[1,3]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[1,3]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Permute order")
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[2,1]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[2,1]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("Left open interval")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(1,2]', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2]', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2]', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2]', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2]', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5CorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2]', { force: true, delay: 0 });
      cy.get(mathinput6SubmitAnchor).click();
      cy.get(mathinput6CorrectAnchor).should('be.visible');
      cy.get(mathinput7Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2]', { force: true, delay: 0 });
      cy.get(mathinput7SubmitAnchor).click();
      cy.get(mathinput7IncorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).type('{ctrl+home}{shift+end}{backspace}(1,2]', { force: true, delay: 0 });
      cy.get(mathinput8SubmitAnchor).click();
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Partially correct left open interval")
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3]', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput6Anchor).type('{ctrl+home}{shift+end}{backspace}(1,3]', { force: true, delay: 0 });
      cy.get(mathinput6SubmitAnchor).click();
      cy.get(mathinput6IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Permute order")
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}(2,1]', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).type('{ctrl+home}{shift+end}{backspace}(2,1]', { force: true, delay: 0 });
      cy.get(mathinput6SubmitAnchor).click();
      cy.get(mathinput6IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Right open interval")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}[1,2)', { force: true, delay: 0 });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2)', { force: true, delay: 0 });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2)', { force: true, delay: 0 });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2)', { force: true, delay: 0 });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2)', { force: true, delay: 0 });
      cy.get(mathinput5SubmitAnchor).click();
      cy.get(mathinput5IncorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2)', { force: true, delay: 0 });
      cy.get(mathinput6SubmitAnchor).click();
      cy.get(mathinput6IncorrectAnchor).should('be.visible');
      cy.get(mathinput7Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2)', { force: true, delay: 0 });
      cy.get(mathinput7SubmitAnchor).click();
      cy.get(mathinput7CorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).type('{ctrl+home}{shift+end}{backspace}[1,2)', { force: true, delay: 0 });
      cy.get(mathinput8SubmitAnchor).click();
      cy.get(mathinput8CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Partially correct right open interval")
      cy.get(mathinput7Anchor).type('{ctrl+home}{shift+end}{backspace}[1,3)', { force: true, delay: 0 });
      cy.get(mathinput7SubmitAnchor).click();
      cy.get(mathinput7PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput8Anchor).type('{ctrl+home}{shift+end}{backspace}[1,3)', { force: true, delay: 0 });
      cy.get(mathinput8SubmitAnchor).click();
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Permute order")
      cy.get(mathinput7Anchor).type('{ctrl+home}{shift+end}{backspace}[2,1)', { force: true, delay: 0 });
      cy.get(mathinput7SubmitAnchor).click();
      cy.get(mathinput7IncorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).type('{ctrl+home}{shift+end}{backspace}[2,1)', { force: true, delay: 0 });
      cy.get(mathinput8SubmitAnchor).click();
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
      });
    })
  });

  it('match partial with ordered and unordered math inputs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><mathinput name="x"/></p>
  <p><mathinput name="y"/></p>
  <p><mathinput name="z"/></p>

  <section><title>Match partial</title>

  <answer name="a">
    <award>
      <when matchpartial>
        <math>
          $x, $y, $z
        </math>
        =
        <math>x,y,z</math>
      </when>
    </award>
  </answer>
  </section>

  <section><title>Match partial, match by exact positions</title>

  <answer name="b">
  <award>
    <when matchpartial matchByExactPositions>
      <math>
        $x, $y, $z
      </math>
      =
      <math>x,y,z</math>
    </when>
  </award>
</answer>
</section>


  <section><title>Match partial, unordered</title>
  <answer name="c">
    <award>
      <when matchpartial>
        <math unordered="true">
          $x, $y, $z
        </math>
        =
        <math>x,y,z</math>
      </when>
    </award>
  </answer>
  </section>

  <section><title>Strict equality</title>
   <answer name="d">
   <award>
     <when>
       <math>
         $x, $y, $z
       </math>
       =
       <math>x,y,z</math>
     </when>
   </award>
 </answer>
 </section>

  <section><title>Unordered</title>
    <answer name="e">
    <award>
      <when>
        <math unordered="true">
          $x, $y, $z
        </math>
        =
        <math>x,y,z</math>
      </when>
    </award>
  </answer>
  </section>
      `}, "*");
    });

    cy.get(cesc('#\\/a_submit')).should('be.visible');
    cy.get(cesc('#\\/b_submit')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).should('be.visible');

    cy.log("Submit empty answers")
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_incorrect')).should('be.visible');
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_incorrect')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_incorrect')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/c'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit correct answers")
    cy.get(cesc('#\\/x') + ' textarea').type('x', { force: true, delay: 0 });
    cy.get(cesc('#\\/y') + ' textarea').type('y', { force: true, delay: 0 });
    cy.get(cesc('#\\/z') + ' textarea').type('z', { force: true, delay: 0 });

    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_correct')).should('be.visible');
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_correct')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_correct')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_correct')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_correct')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/c'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(1);
    });

    cy.log("Omit one component")

    cy.get(cesc('#\\/y') + ' textarea').type('{end}{backspace}z', { force: true, delay: 0 });
    cy.get(cesc('#\\/z') + ' textarea').type('{end}{backspace}', { force: true, delay: 0 });
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });

    cy.log("permute order")
    cy.get(cesc('#\\/x') + ' textarea').type('{end}{backspace}z', { force: true, delay: 0 });
    cy.get(cesc('#\\/y') + ' textarea').type('{end}{backspace}x', { force: true, delay: 0 });
    cy.get(cesc('#\\/z') + ' textarea').type('{end}{backspace}y', { force: true, delay: 0 });
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_incorrect')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_correct')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_correct')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/c'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(1);
    });

    cy.log("reverse order")
    cy.get(cesc('#\\/y') + ' textarea').type('{end}{backspace}y', { force: true, delay: 0 });
    cy.get(cesc('#\\/z') + ' textarea').type('{end}{backspace}x', { force: true, delay: 0 });
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_correct')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_correct')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/c'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(1);
    });


    cy.log("two components out of order")
    cy.get(cesc('#\\/y') + ' textarea').type('{end}{backspace}', { force: true, delay: 0 });
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_incorrect')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });

    cy.log("add component")
    cy.get(cesc('#\\/y') + ' textarea').type('{end}{backspace}x', { force: true, delay: 0 });
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_incorrect')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });


    cy.log("extra component, but in right order")
    cy.get(cesc('#\\/x') + ' textarea').type('{end}{backspace}x', { force: true, delay: 0 });
    cy.get(cesc('#\\/z') + ' textarea').type('{end}{backspace}z', { force: true, delay: 0 });
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });


    cy.log("extra component, in right order, but only one in right position")
    cy.get(cesc('#\\/z') + ' textarea').type('{end}{backspace}y', { force: true, delay: 0 });
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });

  });

  it('match partial with ordered and unordered text inputs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><textinput name="x"/></p>
  <p><textinput name="y"/></p>
  <p><textinput name="z"/></p>

  <section><title>Match partial</title>

  <answer name="a">
    <award>
      <when matchpartial>
        <textlist>
          $x $y $z
        </textlist>
        =
        <textlist>x y z</textlist>
      </when>
    </award>
  </answer>
  </section>

  <section><title>Match partial, match by exact positions</title>

  <answer name="b">
  <award>
    <when matchpartial matchByExactPositions>
      <textlist>
        $x $y $z
      </textlist>
      =
      <textlist>x y z</textlist>
    </when>
  </award>
</answer>
</section>


  <section><title>Match partial, unordered</title>
  <answer name="c">
    <award>
      <when matchpartial>
        <textlist unordered="true">
          $x $y $z
        </textlist>
        =
        <textlist>x y z</textlist>
      </when>
    </award>
  </answer>
  </section>

  <section><title>Strict equality</title>
   <answer name="d">
   <award>
     <when>
       <textlist>
         $x $y $z
       </textlist>
       =
       <textlist>x y z</textlist>
     </when>
   </award>
 </answer>
 </section>

  <section><title>Unordered</title>
    <answer name="e">
    <award>
      <when>
        <textlist unordered="true">
          $x $y $z
        </textlist>
        =
        <textlist>x y z</textlist>
      </when>
    </award>
  </answer>
  </section>
      `}, "*");
    });

    cy.get(cesc('#\\/a_submit')).should('be.visible');
    cy.get(cesc('#\\/b_submit')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).should('be.visible');

    cy.log("Submit empty answers")
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_incorrect')).should('be.visible');
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_incorrect')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_incorrect')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/c'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit correct answers")
    cy.get(cesc('#\\/x_input')).clear().type('x');
    cy.get(cesc('#\\/y_input')).clear().type('y');
    cy.get(cesc('#\\/z_input')).clear().type('z');

    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_correct')).should('be.visible');
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_correct')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_correct')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_correct')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_correct')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/c'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(1);
    });

    cy.log("Omit one component")

    cy.get(cesc('#\\/y_input')).clear().type('z');
    cy.get(cesc('#\\/z_input')).clear();
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });

    cy.log("permute order")
    cy.get(cesc('#\\/x_input')).clear().type('z');
    cy.get(cesc('#\\/y_input')).clear().type('x');
    cy.get(cesc('#\\/z_input')).clear().type('y');
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_incorrect')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_correct')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_correct')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/c'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(1);
    });

    cy.log("reverse order")
    cy.get(cesc('#\\/y_input')).clear().type('y');
    cy.get(cesc('#\\/z_input')).clear().type('x');
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_correct')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_correct')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/c'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(1);
    });


    cy.log("two components out of order")
    cy.get(cesc('#\\/y_input')).clear();
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_incorrect')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });

    cy.log("add component")
    cy.get(cesc('#\\/y_input')).clear().type('x');
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_incorrect')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });


    cy.log("extra component, but in right order")
    cy.get(cesc('#\\/x_input')).clear().type('x');
    cy.get(cesc('#\\/z_input')).clear().type('z');
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });


    cy.log("extra component, in right order, but only one in right position")
    cy.get(cesc('#\\/z_input')).clear().type('y');
    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });

  });

  it('match partial with ordered and unordered boolean inputs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><booleaninput name="x"/></p>
  <p><booleaninput name="y"/></p>
  <p><booleaninput name="z"/></p>

  <section><title>Match partial</title>

    <answer name="a">
      <award>
        <when matchpartial>
          <booleanlist>
            $x $y $z
          </booleanlist>
          =
          <booleanlist>false true true</booleanlist>
        </when>
      </award>
    </answer>
  </section>

  <section><title>Match partial, match by exact positions</title>

    <answer name="b">
      <award>
        <when matchpartial matchByExactPositions>
          <booleanlist>
            $x $y $z
          </booleanlist>
          =
          <booleanlist>false true true</booleanlist>
        </when>
      </award>
    </answer>
  </section>


  <section><title>Match partial, unordered</title>
    <answer name="c">
      <award>
        <when matchpartial>
          <booleanlist unordered="true">
            $x $y $z
          </booleanlist>
          =
          <booleanlist>false true true</booleanlist>
        </when>
      </award>
    </answer>
  </section>

  <section><title>Strict equality</title>
    <answer name="d">
      <award>
        <when>
          <booleanlist>
            $x $y $z
          </booleanlist>
          =
          <booleanlist>false true true</booleanlist>
        </when>
      </award>
    </answer>
  </section>

  <section><title>Unordered</title>
    <answer name="e">
      <award>
        <when>
          <booleanlist unordered="true">
            $x $y $z
          </booleanlist>
          =
          <booleanlist>false true true</booleanlist>
        </when>
      </award>
    </answer>
  </section>
  `}, "*");
    });


    cy.get(cesc('#\\/a_submit')).should('be.visible');
    cy.get(cesc('#\\/b_submit')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).should('be.visible');

    cy.log("Submit correct answers")
    cy.get(cesc('#\\/y')).click();
    cy.get(cesc('#\\/z')).click();

    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_correct')).should('be.visible');
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_correct')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_correct')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_correct')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_correct')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/c'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(1);
    });

    cy.log("All true")
    cy.get(cesc('#\\/x')).click();

    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });

    cy.log("wrong order")
    cy.get(cesc('#\\/y')).click();

    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_correct')).should('be.visible');
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_correct')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/c'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(1);
    });

    cy.log("wrong order and values")
    cy.get(cesc('#\\/z')).click();

    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_incorrect')).should('be.visible');
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });

    cy.log("all false")
    cy.get(cesc('#\\/x')).click();

    cy.get(cesc('#\\/a_submit')).click();
    cy.get(cesc('#\\/a_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get(cesc('#\\/b_submit')).click();
    cy.get(cesc('#\\/b_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get(cesc('#\\/c_submit')).click();
    cy.get(cesc('#\\/c_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get(cesc('#\\/d_submit')).click();
    cy.get(cesc('#\\/d_incorrect')).should('be.visible');
    cy.get(cesc('#\\/e_submit')).click();
    cy.get(cesc('#\\/e_incorrect')).should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/b'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/c'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(stateVariables['/d'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/e'].stateValues.creditAchieved).eq(0);
    });

  });

  it('match partial with combined ordered/unordered tuples', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>

  <mathinput name="m1"/>
  <mathinput name="m2"/>

  <p>Match partial: <answer name="partial">
    <award matchPartial>
      <when>
        $m1 = (1,2)
        and
        $m2 = <math unordered>(3,4)</math>
      </when>
    </award>
  </answer></p>

  <p>Strict equality: <answer name="strict">
    <award>
      <when>
        $m1 = (1,2)
        and
        $m2 = <math unordered>(3,4)</math>
      </when>
    </award>
  </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit correct answers")
    cy.get(cesc("#\\/m1") + " textarea").type('(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible');
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible');

    cy.log("scalar in first tuple")
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}2{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log("scalar in second tuple")
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}3{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')

    cy.log('permute order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(2,1){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('permute order also in second tuple')
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(4,3){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('correct order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible')
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible')


  });

  it('match partial with combined ordered/unordered tuples via whens', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>

  <mathinput name="m1"/>
  <mathinput name="m2"/>

  <p>Match partial: <answer name="partial">
    <award matchPartial>
      <when>
        $m1 = (1,2)
        and
        <when unorderedCompare>$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>

  <p>Strict equality: <answer name="strict">
    <award>
      <when>
        $m1 = (1,2)
        and
        <when unorderedCompare>$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit correct answers")
    cy.get(cesc("#\\/m1") + " textarea").type('(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible');
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible');

    cy.log("scalar in first tuple")
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}2{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log("scalar in second tuple")
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}3{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')

    cy.log('permute order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(2,1){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('permute order also in second tuple')
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(4,3){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(4,3){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('correct order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible')
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible')


  });

  it('match partial with combined ordered/unordered tuples via booleans', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>

  <mathinput name="m1"/>
  <mathinput name="m2"/>
  <p>Match partial: <answer name="partial">
    <award matchPartial>
      <when>
        $m1 = (1,2)
        and
        <boolean unorderedCompare>$m2 = (3,4)</boolean>
      </when>
    </award>
  </answer></p>

  <p>Strict equality: <answer name="strict">
    <award>
      <when>
        $m1 = (1,2)
        and
        <boolean unorderedCompare>$m2 = (3,4)</boolean>
      </when>
    </award>
  </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit correct answers")
    cy.get(cesc("#\\/m1") + " textarea").type('(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible');
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible');

    cy.log("scalar in first tuple")
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}2{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log("scalar in second tuple")
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}3{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('25% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')

    cy.log('permute order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(2,1){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('permute order also in second tuple')
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(4,3){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(4,3){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('correct order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible')
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible')


  });

  it('mixed match partial and ordered/unordered tuples via whens', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>

  <mathinput name="m1"/>
  <mathinput name="m2"/>

  <p>Match partial: <answer name="partial">

    <award matchPartial>
      <when>
        $m1 = (1,2)
        and
        <when unorderedCompare matchPartial="false">$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>

  <p>No net effect of inner matchPartial: <answer name="strict">
    <award>
      <when>
        $m1 = (1,2)
        and
        <when unorderedCompare matchPartial>$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit correct answers")
    cy.get(cesc("#\\/m1") + " textarea").type('(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible');
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible');

    cy.log("scalar in first tuple")
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}2{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log("scalar in second tuple")
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}3{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('25% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')

    cy.log('permute order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(2,1){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('permute order also in second tuple')
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(4,3){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(4,3){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('correct order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible')
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible')


  });

  it('match partial with combined ordered/unordered tuples, force ordered compare', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>

  <mathinput name="m1"/>
  <mathinput name="m2"/>

  <p>Match partial: <answer name="partial">
    <award matchPartial>
      <when unorderedCompare="false">
        $m1 = (1,2)
        and
        $m2 = <math unordered>(3,4)</math>
      </when>
    </award>
  </answer></p>

  <p>Strict equality: <answer name="strict">
    <award>
      <when unorderedCompare="false">
        $m1 = (1,2)
        and
        $m2 = <math unordered>(3,4)</math>
      </when>
    </award>
  </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit correct answers")
    cy.get(cesc("#\\/m1") + " textarea").type('(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible');
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible');

    cy.log("scalar in first tuple")
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}2{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log("scalar in second tuple")
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}3{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')

    cy.log('permute order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(2,1){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('permute order also in second tuple')
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(4,3){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('correct order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


  });

  it('match partial with combined ordered/unordered tuples via whens, no effect of force ordered compare', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>

  <mathinput name="m1"/>
  <mathinput name="m2"/>

  <p>Match partial: <answer name="partial">
    <award matchPartial>
      <when unorderedCompare="false">
        $m1 = (1,2)
        and
        <when unorderedCompare>$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>

  <p>Strict equality: <answer name="strict">
    <award>
      <when unorderedCompare="false">
        $m1 = (1,2)
        and
        <when unorderedCompare>$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit correct answers")
    cy.get(cesc("#\\/m1") + " textarea").type('(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible');
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible');

    cy.log("scalar in first tuple")
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}2{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log("scalar in second tuple")
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}3{enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')

    cy.log('permute order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(2,1){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(3,4){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('permute order also in second tuple')
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(4,3){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc("#\\/m2") + " textarea").type('{ctrl+home}{shift+end}{backspace}(4,3){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible')


    cy.log('correct order in first tuple')
    cy.get(cesc("#\\/m1") + " textarea").type('{ctrl+home}{shift+end}{backspace}(1,2){enter}', { force: true, delay: 0 });
    cy.get(cesc("#\\/partial_submit")).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible')
    cy.get(cesc("#\\/strict_submit")).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible')


  });

  it('match partial with combined ordered/unordered text inputs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

  <p>a</p>

  <p><textinput name="u"/></p>
  <p><textinput name="v"/></p>
  <p><textinput name="x"/></p>
  <p><textinput name="y"/></p>

  <p>Match partial:
  <answer name="partial">
    <award>
      <when matchpartial>
        <textlist>$u $v</textlist>
        =
        <textlist>u v</textlist>
        and 
        <textlist>$x $y</textlist>
        =
        <textlist unordered>x y</textlist>
      </when>
    </award>
  </answer>
  </p>

  <p>Strict:
  <answer name="strict">
    <award>
      <when>
        <textlist>$u $v</textlist>
        =
        <textlist>u v</textlist>
        and 
        <textlist>$x $y</textlist>
        =
        <textlist unordered>x y</textlist>
      </when>
    </award>
  </answer>
  </p>

  `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit correct answers")
    cy.get(cesc('#\\/u_input')).clear().type('u');
    cy.get(cesc('#\\/v_input')).clear().type('v');
    cy.get(cesc('#\\/x_input')).clear().type('x');
    cy.get(cesc('#\\/y_input')).clear().type('y');
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible');
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible');

    cy.log("Omit one component in first")
    cy.get(cesc('#\\/u_input')).clear().type('v');
    cy.get(cesc('#\\/v_input')).clear();
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible');


    cy.log("Omit one component in second")
    cy.get(cesc('#\\/x_input')).clear().type('y');
    cy.get(cesc('#\\/y_input')).clear();
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible');


    cy.log("permute order in first")
    cy.get(cesc('#\\/v_input')).type('u');
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible');

    cy.log("permute order in second")
    cy.get(cesc('#\\/y_input')).type('x');
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible');

    cy.log("correct order in first")
    cy.get(cesc('#\\/u_input')).clear().type('u');
    cy.get(cesc('#\\/v_input')).clear().type('v');
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible')
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible');


  });

  it('match partial with combined ordered/unordered boolean inputs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

  <p>a</p>

  <p><booleaninput name="u"/></p>
  <p><booleaninput name="v"/></p>
  <p><booleaninput name="x"/></p>
  <p><booleaninput name="y"/></p>

  <p>Match partial:
  <answer name="partial">
    <award>
      <when matchpartial>
        <booleanlist>$u $v</booleanlist>
        =
        <booleanlist>true false</booleanlist>
        and 
        <booleanlist>$x $y</booleanlist>
        =
        <booleanlist unordered>true false</booleanlist>
      </when>
    </award>
  </answer>
  </p>

  <p>Strict:
  <answer name="strict">
    <award>
      <when>
        <booleanlist>$u $v</booleanlist>
        =
        <booleanlist>true false</booleanlist>
        and 
        <booleanlist>$x $y</booleanlist>
        =
        <booleanlist unordered>true false</booleanlist>
      </when>
    </award>
  </answer>
  </p>

  `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit correct answers")
    cy.get(cesc('#\\/u')).click();
    cy.get(cesc('#\\/x')).click();
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible');
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible');

    cy.log("One incorrect in first")
    cy.get(cesc('#\\/v')).click();
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible');


    cy.log("One incorrect in second")
    cy.get(cesc('#\\/y')).click();
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible');


    cy.log("permute order in first")
    cy.get(cesc('#\\/u')).click();
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible');

    cy.log("permute order in second")
    cy.get(cesc('#\\/x')).click();
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_incorrect')).should('be.visible');

    cy.log("correct order in first")
    cy.get(cesc('#\\/u')).click();
    cy.get(cesc('#\\/v')).click();
    cy.get(cesc('#\\/partial_submit')).click();
    cy.get(cesc('#\\/partial_correct')).should('be.visible')
    cy.get(cesc('#\\/strict_submit')).click();
    cy.get(cesc('#\\/strict_correct')).should('be.visible');


  });

  it('match tuple with list of tuples', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

  <p>a</p>
  <p>
  <mathinput name="mi" />
  <answer name="ans1">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        $mi = <mathlist><math>(1,2)</math><math>(3,4)</math></mathlist>
      </when>
    </award>
  </answer>
  <answer name="ans2">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        <mathlist><math>(1,2)</math><math>(3,4)</math></mathlist> = $mi
      </when>
    </award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit first tuple")
    cy.get(cesc('#\\/mi') + ' textarea').type("(1,2){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans2_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("Submit both tuples")
    cy.get(cesc('#\\/mi') + ' textarea').type("{end},(3,4){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_correct')).should('be.visible')
    cy.get(cesc('#\\/ans2_correct')).should('be.visible')


    cy.log("Submit second tuple")
    cy.get(cesc('#\\/mi') + ' textarea').type("{ctrl+home}{shift+end}{backspace}(3,4){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })



  });

  it('match tuple with list of vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

  <p>a</p>
  <p>
  <mathinput name="mi" />
  <answer name="ans1">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        $mi = <mathlist><math createVectors>(1,2)</math><math createVectors>(3,4)</math></mathlist>
      </when>
    </award>
  </answer>
  <answer name="ans2">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        <mathlist><math createVectors>(1,2)</math><math createVectors>(3,4)</math></mathlist> = $mi
      </when>
    </award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit first tuple")
    cy.get(cesc('#\\/mi') + ' textarea').type("(1,2){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans2_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("Submit both tuples")
    cy.get(cesc('#\\/mi') + ' textarea').type("{end},(3,4){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_correct')).should('be.visible')
    cy.get(cesc('#\\/ans2_correct')).should('be.visible')


    cy.log("Submit second tuple")
    cy.get(cesc('#\\/mi') + ' textarea').type("{ctrl+home}{shift+end}{backspace}(3,4){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })



  });

  it('match vector with list of tuples', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

  <p>a</p>
  <p>
  <mathinput name="mi" />
  <answer name="ans1">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        <math createVectors>$mi</math> = <mathlist><math>(1,2)</math><math>(3,4)</math></mathlist>
      </when>
    </award>
  </answer>
  <answer name="ans2">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        <mathlist><math>(1,2)</math><math>(3,4)</math></mathlist> = <math createVectors>$mi</math>
      </when>
    </award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit first tuple")
    cy.get(cesc('#\\/mi') + ' textarea').type("(1,2){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans2_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("Submit both tuples")
    cy.get(cesc('#\\/mi') + ' textarea').type("{end},(3,4){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_correct')).should('be.visible')
    cy.get(cesc('#\\/ans2_correct')).should('be.visible')


    cy.log("Submit second tuple")
    cy.get(cesc('#\\/mi') + ' textarea').type("{ctrl+home}{shift+end}{backspace}(3,4){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("Submit first as altvector")
    cy.get(cesc('#\\/mi') + ' textarea').type("{ctrl+home}{shift+end}{backspace}\\langle 1,2\\rangle{enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans2_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })


    cy.log("Submit both as alt vectors")
    cy.get(cesc('#\\/mi') + ' textarea').type("{end},\\langle 3,4\\rangle{enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_correct')).should('be.visible')
    cy.get(cesc('#\\/ans2_correct')).should('be.visible')


  });

  it('match vector with list of vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

  <p>a</p>
  <p>
  <mathinput name="mi" />
  <answer name="ans1">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        <math createVectors>$mi</math> = <mathlist><math createVectors>(1,2)</math><math createVectors>(3,4)</math></mathlist>
      </when>
    </award>
  </answer>
  <answer name="ans2">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        <mathlist><math createVectors>(1,2)</math><math createVectors>(3,4)</math></mathlist> = <math createVectors>$mi</math>
      </when>
    </award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit first tuple")
    cy.get(cesc('#\\/mi') + ' textarea').type("(1,2){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans2_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("Submit both tuples")
    cy.get(cesc('#\\/mi') + ' textarea').type("{end},(3,4){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_correct')).should('be.visible')
    cy.get(cesc('#\\/ans2_correct')).should('be.visible')


    cy.log("Submit second tuple")
    cy.get(cesc('#\\/mi') + ' textarea').type("{ctrl+home}{shift+end}{backspace}(3,4){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("Submit first as altvector")
    cy.get(cesc('#\\/mi') + ' textarea').type("{ctrl+home}{shift+end}{backspace}\\langle 1,2\\rangle{enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans2_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })



    cy.log("Submit both as altvectors")
    cy.get(cesc('#\\/mi') + ' textarea').type("{end},\\langle 3,4\\rangle{enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_correct')).should('be.visible')
    cy.get(cesc('#\\/ans2_correct')).should('be.visible')

  });

  it('match interval with list of intervals', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

  <p>a</p>
  <p>
  <mathinput name="mi" />
  <answer name="ans1">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        $mi = <mathlist><math>[1,2)</math><math>(3,4]</math></mathlist>
      </when>
    </award>
  </answer>
  <answer name="ans2">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        <mathlist><math>[1,2)</math><math>(3,4]</math></mathlist> = $mi
      </when>
    </award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit first interval")
    cy.get(cesc('#\\/mi') + ' textarea').type("[1,2){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans2_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("Submit both intervals")
    cy.get(cesc('#\\/mi') + ' textarea').type("{end},(3,4]{enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_correct')).should('be.visible')
    cy.get(cesc('#\\/ans2_correct')).should('be.visible')


    cy.log("Submit second interval")
    cy.get(cesc('#\\/mi') + ' textarea').type("{ctrl+home}{shift+end}{backspace}(3,4]{enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })



  });

  it('match array with list of arrays', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

  <p>a</p>
  <p>
  <mathinput name="mi" />
  <answer name="ans1">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        $mi = <mathlist><math>[1,2]</math><math>[3,4]</math></mathlist>
      </when>
    </award>
  </answer>
  <answer name="ans2">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        <mathlist><math>[1,2]</math><math>[3,4]</math></mathlist> = $mi
      </when>
    </award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit first array")
    cy.get(cesc('#\\/mi') + ' textarea').type("[1,2]{enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans2_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("Submit both arrays")
    cy.get(cesc('#\\/mi') + ' textarea').type("{end},[3,4]{enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_correct')).should('be.visible')
    cy.get(cesc('#\\/ans2_correct')).should('be.visible')


    cy.log("Submit second array")
    cy.get(cesc('#\\/mi') + ' textarea').type("{ctrl+home}{shift+end}{backspace}[3,4]{enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get(cesc('#\\/ans1_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })



  });

  it('match partial does not recurse on single element lists', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

  <p>a</p>
  <p>
  <mathinput name="mi" />
  <answer name="ans1">
    <award sourcesAreResponses="mi">
      <when matchpartial>
        <mathlist>$mi</mathlist> = <mathlist>(1,2)</mathlist>
      </when>
    </award>
  </answer>
  <answer name="ans2">
    <award sourcesAreResponses="mi">
      <when matchpartial unorderedCompare>
        <mathlist>$mi</mathlist> = <mathlist>(1,2)</mathlist>
      </when>
    </award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get(cesc('#\\/_p1')).should('have.text', "a");  // to wait until loaded

    cy.log("Submit correct answer")
    cy.get(cesc('#\\/mi') + ' textarea').type("(1,2){enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_correct')).should('be.visible')
    cy.get(cesc('#\\/ans2_correct')).should('be.visible')


    cy.log("Submit tuple with incorrect entry")
    cy.get(cesc('#\\/mi') + ' textarea').type("{end}{leftArrow}{backSpace}3{enter}", { force: true, delay: 0 })
    cy.get(cesc('#\\/ans1_submit')).click();
    cy.get(cesc('#\\/ans2_submit')).click();

    cy.get(cesc('#\\/ans1_incorrect')).should('be.visible')
    cy.get(cesc('#\\/ans2_incorrect')).should('be.visible')




  });



});