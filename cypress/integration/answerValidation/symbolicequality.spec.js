describe('Symbolic equality tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('symbolic equality match with no simplification', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1+3</math>: 
    <answer>
      <award symbolicEquality="true"><copy tname="_math1" /></award>
    </answer>

    </p>
    
    <p><math>3+1</math>: 
    <answer>
      <award symbolicEquality="true"><copy tname="_math2" /></award>
    </answer>
    </p>

    <p>Numeric versions</p>
    <p><answer>
      <copy tname="_math1" />
    </answer></p>
    <p><answer>
      <copy tname="_math2" />
    </answer></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChild.componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      let mathinput2Name = components['/_answer2'].stateValues.inputChild.componentName
      let mathinput2Anchor = '#' + mathinput2Name + '_input';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let mathinput2CorrectAnchor = '#' + mathinput2Name + '_correct';
      let mathinput2PartialAnchor = '#' + mathinput2Name + '_partial';
      let mathinput2IncorrectAnchor = '#' + mathinput2Name + '_incorrect';

      let mathinput3Name = components['/_answer3'].stateValues.inputChild.componentName
      let mathinput3Anchor = '#' + mathinput3Name + '_input';
      let mathinput3SubmitAnchor = '#' + mathinput3Name + '_submit';
      let mathinput3CorrectAnchor = '#' + mathinput3Name + '_correct';
      let mathinput3PartialAnchor = '#' + mathinput3Name + '_partial';
      let mathinput3IncorrectAnchor = '#' + mathinput3Name + '_incorrect';

      let mathinput4Name = components['/_answer4'].stateValues.inputChild.componentName
      let mathinput4Anchor = '#' + mathinput4Name + '_input';
      let mathinput4SubmitAnchor = '#' + mathinput4Name + '_submit';
      let mathinput4CorrectAnchor = '#' + mathinput4Name + '_correct';
      let mathinput4PartialAnchor = '#' + mathinput4Name + '_partial';
      let mathinput4IncorrectAnchor = '#' + mathinput4Name + '_incorrect';

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

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("The sum isn't correct for symbolic")
      cy.get(mathinputAnchor).type('4{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('4{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('4{enter}');
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('4{enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("3+1")
      cy.get(mathinputAnchor).clear().type('3+1{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('3+1{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('3+1{enter}');
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('3+1{enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("1+3")
      cy.get(mathinputAnchor).clear().type('1+3{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1+3{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('1+3{enter}');
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('1+3{enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("1+1+1+1")
      cy.get(mathinputAnchor).clear().type('1+1+1+1{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1+1+1+1{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('1+1+1+1{enter}');
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('1+1+1+1{enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });
    })


  });

  it('symbolic equality match with no simplification 2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1x-0y+-3s</math>: 
    <answer>
      <award symbolicEquality="true"><copy tname="_math1" /></award>
    </answer>
    </p>

    <p>Numeric version</p>
    <p><answer>
      <copy tname="_math1" />
    </answer></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChild.componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      let mathinput2Name = components['/_answer2'].stateValues.inputChild.componentName
      let mathinput2Anchor = '#' + mathinput2Name + '_input';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let mathinput2CorrectAnchor = '#' + mathinput2Name + '_correct';
      let mathinput2PartialAnchor = '#' + mathinput2Name + '_partial';
      let mathinput2IncorrectAnchor = '#' + mathinput2Name + '_incorrect';

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('1x-0y+-3s{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('1x-0y+-3s{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Plus negative to subtraction")
      cy.get(mathinputAnchor).clear().type('1x-0y-3s{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1x-0y-3s{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Parentheses")
      cy.get(mathinputAnchor).clear().type('1x-0y+(-3s){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1x-0y+(-3s){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Positive zero")
      cy.get(mathinputAnchor).clear().type('1x+0y-3s{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1x+0y-3s{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Remove zero term")
      cy.get(mathinputAnchor).clear().type('1x-3s{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1x-3s{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Remove one coefficient")
      cy.get(mathinputAnchor).clear().type('x-0y-3s{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('x-0y-3s{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reorder terms")
      cy.get(mathinputAnchor).clear().type('-0y+1x-3s{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('-0y+1x-3s{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })
  });

  it('symbolic equality match with simplifying numbers, preserving order', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1x^2+2-0x^2+3+x^2+3x^2+7+4</math>: 
    <answer size="20">
      <award symbolicEquality="true"><copy simplify="numbersPreserveOrder" tname="_math1" /></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer size="20">
      <copy tname="_math1" />
    </answer></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChild.componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      let mathinput2Name = components['/_answer2'].stateValues.inputChild.componentName
      let mathinput2Anchor = '#' + mathinput2Name + '_input';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let mathinput2CorrectAnchor = '#' + mathinput2Name + '_correct';
      let mathinput2PartialAnchor = '#' + mathinput2Name + '_partial';
      let mathinput2IncorrectAnchor = '#' + mathinput2Name + '_incorrect';

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('1x^2+2-0x^2+3+x^2+3x^2+7+4{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('1x^2+2-0x^2+3+x^2+3x^2+7+4{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Simplify numbers")
      cy.get(mathinputAnchor).clear().type('x^2+5+x^2+3x^2+11{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('x^2+5+x^2+3x^2+11{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Permute adjacent numbers")
      cy.get(mathinputAnchor).clear().type('1x^2+2-0x^2+3+x^2+3x^2+4+7{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1x^2+2-0x^2+3+x^2+3x^2+4+7{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Permute adjacent variable terms")
      cy.get(mathinputAnchor).clear().type('1x^2+2-0x^2+3+3x^2+x^2+7+4{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1x^2+2-0x^2+3+3x^2+x^2+7+4{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine adjacent variable terms")
      cy.get(mathinputAnchor).clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine all numbers")
      cy.get(mathinputAnchor).clear().type('1x^2-0x^2+x^2+3x^2+16{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1x^2-0x^2+x^2+3x^2+16{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine all terms")
      cy.get(mathinputAnchor).clear().type('5x^2+16{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('5x^2+16{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })
  });

  it('symbolic equality match with simplifying numbers', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1x^2+2-0x^2+3+x^2+3x^2+7+4</math>: 
    <answer size="20">
      <award symbolicEquality="true"><copy simplify="numbers" tname="_math1" /></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer size="20">
      <copy tname="_math1" />
    </answer></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChild.componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      let mathinput2Name = components['/_answer2'].stateValues.inputChild.componentName
      let mathinput2Anchor = '#' + mathinput2Name + '_input';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let mathinput2CorrectAnchor = '#' + mathinput2Name + '_correct';
      let mathinput2PartialAnchor = '#' + mathinput2Name + '_partial';
      let mathinput2IncorrectAnchor = '#' + mathinput2Name + '_incorrect';

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('1x^2+2-0x^2+3+x^2+3x^2+7+4{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('1x^2+2-0x^2+3+x^2+3x^2+7+4{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Simplify numbers")
      cy.get(mathinputAnchor).clear().type('x^2+x^2+3x^2+16{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('x^2+x^2+3x^2+16{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Permute terms")
      cy.get(mathinputAnchor).clear().type('7+1x^2-0x^2+3+3x^2+4+2+x^2{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('7+1x^2-0x^2+3+3x^2+4+2+x^2{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine variable terms")
      cy.get(mathinputAnchor).clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine adjacent variable terms")
      cy.get(mathinputAnchor).clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine all terms")
      cy.get(mathinputAnchor).clear().type('5x^2+16{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('5x^2+16{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })

  });

  it('symbolic equality match with full simplification', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>6x^2 -3x +8x-4 + (2x-3)(4-x)</math>: 
    <answer size="20">
      <award symbolicEquality="true"><copy simplify tname="_math1" /></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer size="20">
      <copy tname="_math1" />
    </answer></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChild.componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      let mathinput2Name = components['/_answer2'].stateValues.inputChild.componentName
      let mathinput2Anchor = '#' + mathinput2Name + '_input';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let mathinput2CorrectAnchor = '#' + mathinput2Name + '_correct';
      let mathinput2PartialAnchor = '#' + mathinput2Name + '_partial';
      let mathinput2IncorrectAnchor = '#' + mathinput2Name + '_incorrect';

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('6x^2 -3x +8x-4 + (2x-3)(4-x){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('6x^2 -3x +8x-4 + (2x-3)(4-x){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combine terms")
      cy.get(mathinputAnchor).clear().type('6x^2 + 5x-4 + (2x-3)(4-x){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('6x^2 + 5x-4 + (2x-3)(4-x){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Permute terms and factors")
      cy.get(mathinputAnchor).clear().type('-4 + 6x^2 + (4-x)(-3+2x) + 5x{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('-4 + 6x^2 + (4-x)(-3+2x) + 5x{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Expand polynomial")
      cy.get(mathinputAnchor).clear().type('6x^2 + 5x-4-2x^2+11x-12{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('6x^2 + 5x-4-2x^2+11x-12{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Expand and simplify")
      cy.get(mathinputAnchor).clear().type('4x^2 + 16x-16{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('4x^2 + 16x-16{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Factor polynomial")
      cy.get(mathinputAnchor).clear().type('(3x+4)(2x -1) + (2x-3)(4-x){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('(3x+4)(2x -1) + (2x-3)(4-x){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })
  });

  it('symbolic equality match with expand and full simplification', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>
    <math>(2x-3)(4-x) + sin(x)^2+cos(x)^2</math>: 
    <answer size="20">
      <award symbolicEquality="true"><copy simplify expand tname="_math1" /></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer size="20">
      <copy tname="_math1" />
    </answer></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChild.componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      let mathinput2Name = components['/_answer2'].stateValues.inputChild.componentName
      let mathinput2Anchor = '#' + mathinput2Name + '_input';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let mathinput2CorrectAnchor = '#' + mathinput2Name + '_correct';
      let mathinput2PartialAnchor = '#' + mathinput2Name + '_partial';
      let mathinput2IncorrectAnchor = '#' + mathinput2Name + '_incorrect';

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('(2x-3)(4-x) + sin(x)^2+cos(x)^2{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('(2x-3)(4-x) + sin(x)^2+cos(x)^2{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Expand polynomial")
      cy.get(mathinputAnchor).clear().type('-2x^2+11x-12 + sin(x)^2+cos(x)^2{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('-2x^2+11x-12 + sin(x)^2+cos(x)^2{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Simplify trig")
      cy.get(mathinputAnchor).clear().type('(2x-3)(4-x) + 1{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('(2x-3)(4-x) + 1{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })
  });

});