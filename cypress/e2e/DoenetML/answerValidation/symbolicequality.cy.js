import { cesc } from '../../../../src/_utils/url';

function cesc2(s) {
  return cesc(cesc(s));
}

describe('Symbolic equality tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
  })

  it('symbolic equality match with no simplification', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1+3</math>: 
    <answer>
      <award symbolicEquality="true"><copy target="_math1" /></award>
    </answer>

    </p>
    
    <p><math>3+1</math>: 
    <answer>
      <award symbolicEquality="true"><copy target="_math2" /></award>
    </answer>
    </p>

    <p>Numeric versions</p>
    <p><answer>
      <award><copy target="_math1" /></award>
    </answer></p>
    <p><answer>
      <award><copy target="_math2" /></award>
    </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');

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

      cy.log("The sum isn't correct for symbolic")
      cy.get(mathinputAnchor).type('4{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('4{enter}', { force: true });
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('4{enter}', { force: true });
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('4{enter}', { force: true });
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("3+1")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}3+1{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}3+1{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}3+1{enter}', { force: true });
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}3+1{enter}', { force: true });
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("1+3")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1+3{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1+3{enter}', { force: true });
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}1+3{enter}', { force: true });
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}1+3{enter}', { force: true });
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("1+1+1+1")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1+1+1+1{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1+1+1+1{enter}', { force: true });
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}1+1+1+1{enter}', { force: true });
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}1+1+1+1{enter}', { force: true });
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });
    })


  });

  it('symbolic equality match with no simplification 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1x-0y+-3s</math>: 
    <answer>
      <award symbolicEquality="true"><copy target="_math1" /></award>
    </answer>
    </p>

    <p>Numeric version</p>
    <p><answer>
      <award><copy target="_math1" /></award>
    </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');

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

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('1x-0y+-3s{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('1x-0y+-3s{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Plus negative to subtraction")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1x-0y-3s{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1x-0y-3s{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Parentheses")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1x-0y+(-3s){enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1x-0y+(-3s){enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Positive zero")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1x+0y-3s{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1x+0y-3s{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Remove zero term")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1x-3s{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1x-3s{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Remove one coefficient")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}x-0y-3s{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}x-0y-3s{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reorder terms")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}-0y+1x-3s{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}-0y+1x-3s{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })
  });

  it('symbolic equality match with simplifying numbers, preserving order', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1x^2+2-0x^2+3+x^2+3x^2+7+4</math>: 
    <answer>
      <award symbolicEquality="true" simplifyOnCompare="numbersPreserveOrder">$_math1</award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer>
      <award><copy target="_math1" /></award>
    </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');

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

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('1x^2{rightArrow}+2-0x^2{rightArrow}+3+x^2{rightArrow}+3x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('1x^2{rightArrow}+2-0x^2{rightArrow}+3+x^2{rightArrow}+3x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Simplify numbers")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}x^2{rightArrow}+5+x^2{rightArrow}+3x^2{rightArrow}+11{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}x^2{rightArrow}+5+x^2{rightArrow}+3x^2{rightArrow}+11{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Permute adjacent numbers")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}+2-0x^2{rightArrow}+3+x^2{rightArrow}+3x^2{rightArrow}+4+7{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}+2-0x^2{rightArrow}+3+x^2{rightArrow}+3x^2{rightArrow}+4+7{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Permute adjacent variable terms")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}+2-0x^2{rightArrow}+3+3x^2{rightArrow}+x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}+2-0x^2{rightArrow}+3+3x^2{rightArrow}+x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine adjacent variable terms")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}+2-0x^2{rightArrow}+3+4x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}+2-0x^2{rightArrow}+3+4x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine all numbers")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}-0x^2{rightArrow}+x^2{rightArrow}+3x^2{rightArrow}+16{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}-0x^2{rightArrow}+x^2{rightArrow}+3x^2{rightArrow}+16{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine all terms")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}5x^2{rightArrow}+16{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}5x^2{rightArrow}+16{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })
  });

  it('symbolic equality match with simplifying numbers', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1x^2+2-0x^2+3+x^2+3x^2+7+4</math>: 
    <answer>
      <award symbolicEquality="true" simplifyOnCompare="numbers">$_math1</award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer>
      <award><copy target="_math1" /></award>
    </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');

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

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('1x^2{rightArrow}+2-0x^2{rightArrow}+3+x^2{rightArrow}+3x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('1x^2{rightArrow}+2-0x^2{rightArrow}+3+x^2{rightArrow}+3x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Simplify numbers")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}x^2{rightArrow}+x^2{rightArrow}+3x^2{rightArrow}+16{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}x^2{rightArrow}+x^2{rightArrow}+3x^2{rightArrow}+16{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Permute terms")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}7+1x^2{rightArrow}-0x^2{rightArrow}+3+3x^2{rightArrow}+4+2+x^2{rightArrow}{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}7+1x^2{rightArrow}-0x^2{rightArrow}+3+3x^2{rightArrow}+4+2+x^2{rightArrow}{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine variable terms")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}+2-0x^2{rightArrow}+3+4x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}+2-0x^2{rightArrow}+3+4x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine adjacent variable terms")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}+2-0x^2{rightArrow}+3+4x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}1x^2{rightArrow}+2-0x^2{rightArrow}+3+4x^2{rightArrow}+7+4{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine all terms")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}5x^2{rightArrow}+16{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}5x^2{rightArrow}+16{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })

  });

  it('symbolic equality match with full simplification', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>6x^2 -3x +8x-4 + (2x-3)(4-x)</math>: 
    <answer>
      <award symbolicEquality="true" simplifyOnCompare>$_math1</award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer>
      <award><copy target="_math1" /></award>
    </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');

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

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('6x^2{rightArrow} -3x +8x-4 + (2x-3)(4-x){enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('6x^2{rightArrow} -3x +8x-4 + (2x-3)(4-x){enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine terms")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}6x^2{rightArrow} + 5x-4 + (2x-3)(4-x){enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}6x^2{rightArrow} + 5x-4 + (2x-3)(4-x){enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Permute terms and factors")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}-4 + 6x^2{rightArrow} + (4-x)(-3+2x) + 5x{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}-4 + 6x^2{rightArrow} + (4-x)(-3+2x) + 5x{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Expand polynomial")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}6x^2{rightArrow} + 5x-4-2x^2{rightArrow}+11x-12{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}6x^2{rightArrow} + 5x-4-2x^2{rightArrow}+11x-12{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Expand and simplify")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}4x^2{rightArrow} + 16x-16{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}4x^2{rightArrow} + 16x-16{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Factor polynomial")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(3x+4)(2x -1) + (2x-3)(4-x){enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(3x+4)(2x -1) + (2x-3)(4-x){enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })
  });

  it('symbolic equality match with expand and full simplification', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>(2x-3)(4-x) + sin(x)^2+cos(x)^2</math>: 
    <answer>
      <award symbolicEquality="true" simplifyOnCompare expandOnCompare>$_math1</award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer>
      <award><copy target="_math1" /></award>
    </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');

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

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('(2x-3)(4-x) + sin(x)^2{rightArrow}+cos(x)^2{rightArrow}{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('(2x-3)(4-x) + sin(x)^2{rightArrow}+cos(x)^2{rightArrow}{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Expand polynomial")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}-2x^2{rightArrow}+11x-12 + sin(x)^2{rightArrow}+cos(x)^2{rightArrow}{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}-2x^2{rightArrow}+11x-12 + sin(x)^2{rightArrow}+cos(x)^2{rightArrow}{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Simplify trig")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}(2x-3)(4-x) + 1{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}(2x-3)(4-x) + 1{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })
  });

  it('symbolic equality with simplification can match simplified negative', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    What is <math name="expr">-3-4</math>?
    <answer>
      <award symbolicEquality="true"><copy target="expr" simplify /></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p>What is $expr? 
    <answer>
      <award><copy target="expr" simplify/></award>
    </answer></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc2('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc2('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc2('#' + mathinputName + '_incorrect');

      let mathinput2Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc2('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc2('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc2('#' + mathinput2Name + '_correct');
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

      cy.log("The sum is always correct")
      cy.get(mathinputAnchor).type('-7{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('-7{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("The original expression is incorrect for symbolic")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}-3-4{enter}', { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}-3-4{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
      });

    })


  });

  it('symbolic equality with simplification, exponentials', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <math name='eans'>-5 *e^(-t)</math>
    <math name='expans'>-5 *exp(-t)</math>

    <answer symbolicEquality simplifyOnCompare>$eans</answer>
    <answer symbolicEquality simplifyOnCompare>$expans</answer>
    <answer symbolicEquality simplifyOnCompare>$(eans{simplify})</answer>
    <answer symbolicEquality simplifyOnCompare>$(expans{simplify})</answer>
    
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc2('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc2('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc2('#' + mathinputName + '_incorrect');

      let mathinput2Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc2('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc2('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc2('#' + mathinput2Name + '_correct');
      let mathinput2IncorrectAnchor = cesc2('#' + mathinput2Name + '_incorrect');

      let mathinput3Name = stateVariables['/_answer3'].stateValues.inputChildren[0].componentName
      let mathinput3Anchor = cesc2('#' + mathinput3Name) + " textarea";
      let mathinput3SubmitAnchor = cesc2('#' + mathinput3Name + '_submit');
      let mathinput3CorrectAnchor = cesc2('#' + mathinput3Name + '_correct');
      let mathinput3IncorrectAnchor = cesc2('#' + mathinput3Name + '_incorrect');


      let mathinput4Name = stateVariables['/_answer4'].stateValues.inputChildren[0].componentName
      let mathinput4Anchor = cesc2('#' + mathinput4Name) + " textarea";
      let mathinput4SubmitAnchor = cesc2('#' + mathinput4Name + '_submit');
      let mathinput4CorrectAnchor = cesc2('#' + mathinput4Name + '_correct');
      let mathinput4IncorrectAnchor = cesc2('#' + mathinput4Name + '_incorrect');

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).should('be.visible');
      cy.get(mathinput4SubmitAnchor).should('be.visible');


      cy.log("Submit original form")
      cy.get(mathinputAnchor).type('-5e^-t{enter}', { force: true });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('-5e^-t{enter}', { force: true });
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('-5e^-t{enter}', { force: true });
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('-5e^-t{enter}', { force: true });
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });


      cy.log("Submit as exp")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}-5exp(-t)', { force: true });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}-5exp(-t)', { force: true });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}-5exp(-t)', { force: true });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}-5exp(-t)', { force: true });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });


      cy.log("Submit as ratio with exponent")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}-5/e^t', { force: true });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}-5/e^t', { force: true });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}-5/e^t', { force: true });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}-5/e^t', { force: true });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });


      cy.log("Submit as ratio with exp")
      cy.get(mathinputAnchor).type('{ctrl+home}{shift+end}{backspace}-5/exp(t)', { force: true });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{ctrl+home}{shift+end}{backspace}-5/exp(t)', { force: true });
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('{ctrl+home}{shift+end}{backspace}-5/exp(t)', { force: true });
      cy.get(mathinput3SubmitAnchor).click();
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('{ctrl+home}{shift+end}{backspace}-5/exp(t)', { force: true });
      cy.get(mathinput4SubmitAnchor).click();
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
      });

    })


  });


});