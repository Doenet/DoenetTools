describe('Match partial validation tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('match partial with ordered and unordered tuple', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>

  <p>Match partial: <answer>
    <award matchpartial>(1,2,3)</award>
  </answer></p>
  
  <p>Match partial, unordered: <answer>
    <award matchpartial><math unordered="true">(1,2,3)</math></award>
  </answer></p>
  
  <p>Strict equality: <answer>
    <award>(1,2,3)</award>
  </answer></p>
  
  <p>Unordered: <answer>
    <award><math unordered="true">(1,2,3)</math></award>
  </answer></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

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

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('(1,2,3){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('(1,2,3){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('(1,2,3){enter}');
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('(1,2,3){enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Omit one component")
      cy.get(mathinputAnchor).clear().type('(1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).clear().type('(1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('(1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("just a scalar")
      cy.get(mathinputAnchor).clear().type('2{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('2{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).clear().type('2{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('2{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("extra component")
      cy.get(mathinputAnchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("two extra components")
      cy.get(mathinputAnchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("omit parens")
      cy.get(mathinputAnchor).clear().type('1,2,3{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("permute order")
      cy.get(mathinputAnchor).clear().type('(3,1,2){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).clear().type('(3,1,2){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('(3,1,2){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,1,2){enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("reverse order")
      cy.get(mathinputAnchor).clear().type('(3,2,1){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('(3,2,1){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('(3,2,1){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,2,1){enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add another component")
      cy.get(mathinputAnchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '40 %');
      cy.get(mathinput2Anchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 5, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("add one more component")
      cy.get(mathinputAnchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput3Anchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("two component out of order")
      cy.get(mathinputAnchor).clear().type('(3,1){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('(3,1){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('(3,1){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,1){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).clear().type('(3,1,1){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('(3,1,1){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('(3,1,1){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,1,1){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });
    })

  });

  it('match partial with ordered and unordered list', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>
  <p>Match partial: <answer>
    <award matchpartial>1,2,3</award>
  </answer></p>
  
  <p>Match partial, unordered: <answer>
    <award matchpartial><math unordered="true">1,2,3</math></award>
  </answer></p>
  
  <p>Strict equality: <answer>
    <award>1,2,3</award>
  </answer></p>
  
  <p>Unordered: <answer>
    <award><math unordered="true">1,2,3</math></award>
  </answer></p>
    `}, "*");
    });


    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

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

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('1,2,3{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('1,2,3{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('1,2,3{enter}');
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('1,2,3{enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Omit one component")
      cy.get(mathinputAnchor).clear().type('1,3{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).clear().type('1,3{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('1,3{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('1,3{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("just a scalar")
      cy.get(mathinputAnchor).clear().type('2{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('2{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).clear().type('2{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('2{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("extra component")
      cy.get(mathinputAnchor).clear().type('1,2,a,3{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).clear().type('1,2,a,3{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).clear().type('1,2,a,3{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('1,2,a,3{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("two extra components")
      cy.get(mathinputAnchor).clear().type('0,1,2,a,3{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).clear().type('0,1,2,a,3{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).clear().type('0,1,2,a,3{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('0,1,2,a,3{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add parens")
      cy.get(mathinputAnchor).clear().type('(1,2,3){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('(1,2,3){enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('(1,2,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,2,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("permute order")
      cy.get(mathinputAnchor).clear().type('3,1,2{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).clear().type('3,1,2{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('3,1,2{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('3,1,2{enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("reverse order")
      cy.get(mathinputAnchor).clear().type('3,2,1{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('3,2,1{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('3,2,1{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('3,2,1{enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).clear().type('3,2,1,3{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).clear().type('3,2,1,3{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).clear().type('3,2,1,3{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('3,2,1,3{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add another component")
      cy.get(mathinputAnchor).clear().type('3,a,2,1,3{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '40 %');
      cy.get(mathinput2Anchor).clear().type('3,a,2,1,3{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).clear().type('3,a,2,1,3{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('3,a,2,1,3{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 5, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("add one more component")
      cy.get(mathinputAnchor).clear().type('1,3,a,2,1,3{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).clear().type('1,3,a,2,1,3{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput3Anchor).clear().type('1,3,a,2,1,3{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('1,3,a,2,1,3{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("two component out of order")
      cy.get(mathinputAnchor).clear().type('3,1{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('3,1{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('3,1{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('3,1{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).clear().type('3,1,1{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('3,1,1{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('3,1,1{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('3,1,1{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });
    })
  });

  it('match partial with ordered and unordered array', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>
  <p>Match partial: <answer>
    <award matchpartial>[1,2,3]</award>
  </answer></p>
  
  <p>Match partial, unordered: <answer>
    <award matchpartial><math unordered="true">[1,2,3]</math></award>
  </answer></p>
  
  <p>Strict equality: <answer>
    <award>[1,2,3]</award>
  </answer></p>
  
  <p>Unordered: <answer>
    <award><math unordered="true">[1,2,3]</math></award>
  </answer></p>
    `}, "*");
    });


    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

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

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('[1,2,3]{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('[1,2,3]{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('[1,2,3]{enter}');
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('[1,2,3]{enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Omit one component")
      cy.get(mathinputAnchor).clear().type('[1,3]{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).clear().type('[1,3]{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('[1,3]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[1,3]{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("just a scalar")
      cy.get(mathinputAnchor).clear().type('2{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('2{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).clear().type('2{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('2{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("extra component")
      cy.get(mathinputAnchor).clear().type('[1,2,a,3]{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).clear().type('[1,2,a,3]{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).clear().type('[1,2,a,3]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[1,2,a,3]{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("two extra components")
      cy.get(mathinputAnchor).clear().type('[0,1,2,a,3]{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).clear().type('[0,1,2,a,3]{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).clear().type('[0,1,2,a,3]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[0,1,2,a,3]{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("omit brackets")
      cy.get(mathinputAnchor).clear().type('1,2,3{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("permute order")
      cy.get(mathinputAnchor).clear().type('[3,1,2]{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).clear().type('[3,1,2]{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('[3,1,2]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[3,1,2]{enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("reverse order")
      cy.get(mathinputAnchor).clear().type('[3,2,1]{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('[3,2,1]{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('[3,2,1]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[3,2,1]{enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).clear().type('[3,2,1,3]{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).clear().type('[3,2,1,3]{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).clear().type('[3,2,1,3]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[3,2,1,3]{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add another component")
      cy.get(mathinputAnchor).clear().type('[3,a,2,1,3]{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '40 %');
      cy.get(mathinput2Anchor).clear().type('[3,a,2,1,3]{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).clear().type('[3,a,2,1,3]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[3,a,2,1,3]{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 5, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("add one more component")
      cy.get(mathinputAnchor).clear().type('[1,3,a,2,1,3]{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).clear().type('[1,3,a,2,1,3]{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput3Anchor).clear().type('[1,3,a,2,1,3]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[1,3,a,2,1,3]{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("two component out of order")
      cy.get(mathinputAnchor).clear().type('[3,1]{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('[3,1]{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('[3,1]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[3,1]{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).clear().type('[3,1,1]{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('[3,1,1]{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('[3,1,1]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[3,1,1]{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });
    })

  });


  it('match partial with ordered and unordered tuple, unordered specified on award', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>

  <p>Match partial: <answer>
    <award matchpartial>(1,2,3)</award>
  </answer></p>
  
  <p>Match partial, unordered: <answer>
    <award matchpartial unorderedCompare><math>(1,2,3)</math></award>
  </answer></p>
  
  <p>Strict equality: <answer>
    <award>(1,2,3)</award>
  </answer></p>
  
  <p>Unordered: <answer>
    <award unorderedCompare="true"><math>(1,2,3)</math></award>
  </answer></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

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

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('(1,2,3){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('(1,2,3){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('(1,2,3){enter}');
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('(1,2,3){enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Omit one component")
      cy.get(mathinputAnchor).clear().type('(1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).clear().type('(1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('(1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("just a scalar")
      cy.get(mathinputAnchor).clear().type('2{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('2{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).clear().type('2{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('2{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("extra component")
      cy.get(mathinputAnchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("two extra components")
      cy.get(mathinputAnchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("omit parens")
      cy.get(mathinputAnchor).clear().type('1,2,3{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("permute order")
      cy.get(mathinputAnchor).clear().type('(3,1,2){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).clear().type('(3,1,2){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('(3,1,2){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,1,2){enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("reverse order")
      cy.get(mathinputAnchor).clear().type('(3,2,1){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('(3,2,1){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('(3,2,1){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,2,1){enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add another component")
      cy.get(mathinputAnchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '40 %');
      cy.get(mathinput2Anchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 5, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("add one more component")
      cy.get(mathinputAnchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput3Anchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("two component out of order")
      cy.get(mathinputAnchor).clear().type('(3,1){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('(3,1){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('(3,1){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,1){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).clear().type('(3,1,1){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('(3,1,1){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('(3,1,1){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,1,1){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });
    })

  });

  it('match partial with ordered and unordered tuple, unordered specified on answer', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>

  <p>Match partial: <answer>
    <award matchpartial>(1,2,3)</award>
  </answer></p>
  
  <p>Match partial, unordered: <answer unorderedCompare>
    <award matchpartial><math>(1,2,3)</math></award>
  </answer></p>
  
  <p>Strict equality: <answer>
    <award>(1,2,3)</award>
  </answer></p>
  
  <p>Unordered: <answer unorderedCompare="true">
    <award><math>(1,2,3)</math></award>
  </answer></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

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

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('(1,2,3){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('(1,2,3){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('(1,2,3){enter}');
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('(1,2,3){enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Omit one component")
      cy.get(mathinputAnchor).clear().type('(1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).clear().type('(1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('(1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("just a scalar")
      cy.get(mathinputAnchor).clear().type('2{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('2{enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '33 %');
      cy.get(mathinput3Anchor).clear().type('2{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('2{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("extra component")
      cy.get(mathinputAnchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,2,a,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("two extra components")
      cy.get(mathinputAnchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(0,1,2,a,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("omit parens")
      cy.get(mathinputAnchor).clear().type('1,2,3{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("permute order")
      cy.get(mathinputAnchor).clear().type('(3,1,2){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).clear().type('(3,1,2){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('(3,1,2){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,1,2){enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("reverse order")
      cy.get(mathinputAnchor).clear().type('(3,2,1){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('(3,2,1){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('(3,2,1){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,2,1){enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '75 %');
      cy.get(mathinput3Anchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,2,1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add another component")
      cy.get(mathinputAnchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '40 %');
      cy.get(mathinput2Anchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '60 %');
      cy.get(mathinput3Anchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,a,2,1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 5, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("add one more component")
      cy.get(mathinputAnchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput3Anchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,3,a,2,1,3){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(3 / 6, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("two component out of order")
      cy.get(mathinputAnchor).clear().type('(3,1){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('(3,1){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('(3,1){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,1){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("add component")
      cy.get(mathinputAnchor).clear().type('(3,1,1){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('(3,1,1){enter}');
      cy.get(mathinput2PartialAnchor).should('have.text', '67 %');
      cy.get(mathinput3Anchor).clear().type('(3,1,1){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(3,1,1){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });
    })

  });


  it('match set', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>a</p>
  <p>Match partial: <answer>
    <award matchpartial>{1,2,3}</award>
  </answer></p>
  
  <p>No partial: <answer>
    <award>{1,2,3}</award>
  </answer></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

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

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');

      cy.log("Submit empty answers")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Submit correct answers")
      cy.get(mathinputAnchor).type('{{}1,2,3}{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{{}1,2,3}{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Permute components")
      cy.get(mathinputAnchor).clear().type('{{}3,2,1}{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('{{}3,2,1}{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Extra component")
      cy.get(mathinputAnchor).clear().type('{{}3,a,2,1}{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).clear().type('{{}3,a,2,1}{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Another component")
      cy.get(mathinputAnchor).clear().type('{{}3,a,2,b,1}{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');
      cy.get(mathinput2Anchor).clear().type('{{}3,a,2,b,1}{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 5, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Duplicate components")
      cy.get(mathinputAnchor).clear().type('{{}3,2,3,1,1}{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('{{}3,2,3,1,1}{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Add component")
      cy.get(mathinputAnchor).clear().type('{{}3,2,3,a,1,1}{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '75 %');
      cy.get(mathinput2Anchor).clear().type('{{}3,2,3,a,1,1}{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(3 / 4, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Omit braces")
      cy.get(mathinputAnchor).clear().type('1,2,3{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('1,2,3{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Single number")
      cy.get(mathinputAnchor).clear().type('3{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '33 %');
      cy.get(mathinput2Anchor).clear().type('3{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Subset")
      cy.get(mathinputAnchor).clear().type('{{}2,1}{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '67 %');
      cy.get(mathinput2Anchor).clear().type('{{}2,1}{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

    })
  });

  it('match intervals', () => {
    cy.window().then((win) => {
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
    <award matchpartial>(1,2]</award>
  </answer></p>

  <p>Left open, no partial: <answer>
    <award>(1,2]</award>
  </answer></p>

  <p>Right open, match partial: <answer>
    <award matchpartial>[1,2)</award>
  </answer></p>

  <p>Right open, no partial: <answer>
    <award>[1,2)</award>
  </answer></p>

    `}, "*");
    });


    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

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

      let mathinput5Name = components['/_answer5'].stateValues.inputChild.componentName
      let mathinput5Anchor = '#' + mathinput5Name + '_input';
      let mathinput5SubmitAnchor = '#' + mathinput5Name + '_submit';
      let mathinput5CorrectAnchor = '#' + mathinput5Name + '_correct';
      let mathinput5PartialAnchor = '#' + mathinput5Name + '_partial';
      let mathinput5IncorrectAnchor = '#' + mathinput5Name + '_incorrect';

      let mathinput6Name = components['/_answer6'].stateValues.inputChild.componentName
      let mathinput6Anchor = '#' + mathinput6Name + '_input';
      let mathinput6SubmitAnchor = '#' + mathinput6Name + '_submit';
      let mathinput6CorrectAnchor = '#' + mathinput6Name + '_correct';
      let mathinput6PartialAnchor = '#' + mathinput6Name + '_partial';
      let mathinput6IncorrectAnchor = '#' + mathinput6Name + '_incorrect';

      let mathinput7Name = components['/_answer7'].stateValues.inputChild.componentName
      let mathinput7Anchor = '#' + mathinput7Name + '_input';
      let mathinput7SubmitAnchor = '#' + mathinput7Name + '_submit';
      let mathinput7CorrectAnchor = '#' + mathinput7Name + '_correct';
      let mathinput7PartialAnchor = '#' + mathinput7Name + '_partial';
      let mathinput7IncorrectAnchor = '#' + mathinput7Name + '_incorrect';

      let mathinput8Name = components['/_answer8'].stateValues.inputChild.componentName
      let mathinput8Anchor = '#' + mathinput8Name + '_input';
      let mathinput8SubmitAnchor = '#' + mathinput8Name + '_submit';
      let mathinput8CorrectAnchor = '#' + mathinput8Name + '_correct';
      let mathinput8PartialAnchor = '#' + mathinput8Name + '_partial';
      let mathinput8IncorrectAnchor = '#' + mathinput8Name + '_incorrect';


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

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
      });


      cy.log("single number")
      cy.get(mathinputAnchor).type('1{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('1{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).type('1{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).type('1{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).type('1{enter}');
      cy.get(mathinput5IncorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).type('1{enter}');
      cy.get(mathinput6IncorrectAnchor).should('be.visible');
      cy.get(mathinput7Anchor).type('1{enter}');
      cy.get(mathinput7IncorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).type('1{enter}');
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Open interval")
      cy.get(mathinputAnchor).clear().type('(1,2){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('(1,2){enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('(1,2){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,2){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).clear().type('(1,2){enter}');
      cy.get(mathinput5IncorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).clear().type('(1,2){enter}');
      cy.get(mathinput6IncorrectAnchor).should('be.visible');
      cy.get(mathinput7Anchor).clear().type('(1,2){enter}');
      cy.get(mathinput7IncorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).clear().type('(1,2){enter}');
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
      });

      cy.log("partially correct open interval")
      cy.get(mathinputAnchor).clear().type('(3,2){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get(mathinput2Anchor).clear().type('(3,2){enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });


      cy.log("permute order")
      cy.get(mathinputAnchor).clear().type('(2,1){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('(2,1){enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Closed interval")
      cy.get(mathinputAnchor).clear().type('[1,2]{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('[1,2]{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('[1,2]{enter}');
      cy.get(mathinput3CorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[1,2]{enter}');
      cy.get(mathinput4CorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).clear().type('[1,2]{enter}');
      cy.get(mathinput5IncorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).clear().type('[1,2]{enter}');
      cy.get(mathinput6IncorrectAnchor).should('be.visible');
      cy.get(mathinput7Anchor).clear().type('[1,2]{enter}');
      cy.get(mathinput7IncorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).clear().type('[1,2]{enter}');
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Partially correct closed interval")
      cy.get(mathinput3Anchor).clear().type('[1,3]{enter}');
      cy.get(mathinput3PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput4Anchor).clear().type('[1,3]{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Permute order")
      cy.get(mathinput3Anchor).clear().type('[2,1]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[2,1]{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
      });


      cy.log("Left open interval")
      cy.get(mathinputAnchor).clear().type('(1,2]{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('(1,2]{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('(1,2]{enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('(1,2]{enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).clear().type('(1,2]{enter}');
      cy.get(mathinput5CorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).clear().type('(1,2]{enter}');
      cy.get(mathinput6CorrectAnchor).should('be.visible');
      cy.get(mathinput7Anchor).clear().type('(1,2]{enter}');
      cy.get(mathinput7IncorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).clear().type('(1,2]{enter}');
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Partially correct left open interval")
      cy.get(mathinput5Anchor).clear().type('(1,3]{enter}');
      cy.get(mathinput5PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput6Anchor).clear().type('(1,3]{enter}');
      cy.get(mathinput6IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Permute order")
      cy.get(mathinput5Anchor).clear().type('(2,1]{enter}');
      cy.get(mathinput5IncorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).clear().type('(2,1]{enter}');
      cy.get(mathinput6IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Right open interval")
      cy.get(mathinputAnchor).clear().type('[1,2){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('[1,2){enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3Anchor).clear().type('[1,2){enter}');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');
      cy.get(mathinput4Anchor).clear().type('[1,2){enter}');
      cy.get(mathinput4IncorrectAnchor).should('be.visible');
      cy.get(mathinput5Anchor).clear().type('[1,2){enter}');
      cy.get(mathinput5IncorrectAnchor).should('be.visible');
      cy.get(mathinput6Anchor).clear().type('[1,2){enter}');
      cy.get(mathinput6IncorrectAnchor).should('be.visible');
      cy.get(mathinput7Anchor).clear().type('[1,2){enter}');
      cy.get(mathinput7CorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).clear().type('[1,2){enter}');
      cy.get(mathinput8CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Partially correct right open interval")
      cy.get(mathinput7Anchor).clear().type('[1,3){enter}');
      cy.get(mathinput7PartialAnchor).should('have.text', '50 %');
      cy.get(mathinput8Anchor).clear().type('[1,3){enter}');
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Permute order")
      cy.get(mathinput7Anchor).clear().type('[2,1){enter}');
      cy.get(mathinput7IncorrectAnchor).should('be.visible');
      cy.get(mathinput8Anchor).clear().type('[2,1){enter}');
      cy.get(mathinput8IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
      });
    })
  });

  it('match partial with ordered and unordered math inputs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <section name="a" newNamespace><title>Match partial</title>

  <p><mathinput name="x"/></p>
  <p><mathinput name="y"/></p>
  <p><mathinput name="z"/></p>
  <answer>
    <award>
      <when matchpartial>
        <math>
          <copy prop="immediateValue" tname="x" />,
          <copy prop="immediateValue" tname="y" />,
          <copy prop="immediateValue" tname="z" />
        </math>
        =
        <math>x,y,z</math>
      </when>
    </award>
  </answer>
  </section>

  <section name="b" newnamespace><title>Match partial, unordered</title>
    <p><mathinput name="x"/></p>
    <p><mathinput name="y"/></p>
    <p><mathinput name="z"/></p>
  <answer>
    <award>
      <when matchpartial>
        <math unordered="true">
          <copy prop="immediateValue" tname="x" />,
          <copy prop="immediateValue" tname="y" />,
          <copy prop="immediateValue" tname="z" />
        </math>
        =
        <math>x,y,z</math>
      </when>
    </award>
  </answer>
  </section>

  <section newnamespace name="c"><title>Strict equality</title>
   <p><mathinput name="x"/></p>
   <p><mathinput name="y"/></p>
   <p><mathinput name="z"/></p>

   <answer>
   <award>
     <when>
       <math>
         <copy prop="immediateValue" tname="x" />,
         <copy prop="immediateValue" tname="y" />,
         <copy prop="immediateValue" tname="z" />
       </math>
       =
       <math>x,y,z</math>
     </when>
   </award>
 </answer>
 </section>

  <section newnamespace name="d"><title>Unordered</title>
    <p><mathinput name="x"/></p>
    <p><mathinput name="y"/></p>
    <p><mathinput name="z"/></p>

    <answer>
    <award>
      <when>
        <math unordered="true">
          <copy prop="immediateValue" tname="x" />,
          <copy prop="immediateValue" tname="y" />,
          <copy prop="immediateValue" tname="z" />
        </math>
        =
        <math>x,y,z</math>
      </when>
    </award>
  </answer>
  </section>
      `}, "*");
    });

    cy.get('#\\/a\\/_answer1_submit').should('be.visible');
    cy.get('#\\/b\\/_answer1_submit').should('be.visible');
    cy.get('#\\/c\\/_answer1_submit').should('be.visible');
    cy.get('#\\/d\\/_answer1_submit').should('be.visible');

    cy.log("Submit empty answers")
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_incorrect').should('be.visible');
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_incorrect').should('be.visible');
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/b/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit correct answers")
    cy.get('#\\/a\\/x_input').clear().type('x');
    cy.get('#\\/a\\/y_input').clear().type('y');
    cy.get('#\\/a\\/z_input').clear().type('z');
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_correct').should('be.visible');

    cy.get('#\\/b\\/x_input').clear().type('x');
    cy.get('#\\/b\\/y_input').clear().type('y');
    cy.get('#\\/b\\/z_input').clear().type('z');
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_correct').should('be.visible');

    cy.get('#\\/c\\/x_input').clear().type('x');
    cy.get('#\\/c\\/y_input').clear().type('y');
    cy.get('#\\/c\\/z_input').clear().type('z');
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_correct').should('be.visible');

    cy.get('#\\/d\\/x_input').clear().type('x');
    cy.get('#\\/d\\/y_input').clear().type('y');
    cy.get('#\\/d\\/z_input').clear().type('z');
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/b/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("Omit one component")

    cy.get('#\\/a\\/y_input').clear().type('z');
    cy.get('#\\/a\\/z_input').clear();
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/y_input').clear().type('z');
    cy.get('#\\/b\\/z_input').clear();
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/c\\/y_input').clear().type('z');
    cy.get('#\\/c\\/z_input').clear();
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('z');
    cy.get('#\\/d\\/z_input').clear();
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("permute order")
    cy.get('#\\/a\\/x_input').clear().type('z');
    cy.get('#\\/a\\/y_input').clear().type('x');
    cy.get('#\\/a\\/z_input').clear().type('y');
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/x_input').clear().type('z');
    cy.get('#\\/b\\/y_input').clear().type('x');
    cy.get('#\\/b\\/z_input').clear().type('y');
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_correct').should('be.visible');

    cy.get('#\\/c\\/x_input').clear().type('z');
    cy.get('#\\/c\\/y_input').clear().type('x');
    cy.get('#\\/c\\/z_input').clear().type('y');
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/x_input').clear().type('z');
    cy.get('#\\/d\\/y_input').clear().type('x');
    cy.get('#\\/d\\/z_input').clear().type('y');
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("reverse order")
    cy.get('#\\/a\\/y_input').clear().type('y');
    cy.get('#\\/a\\/z_input').clear().type('x');
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })

    cy.get('#\\/b\\/y_input').clear().type('y');
    cy.get('#\\/b\\/z_input').clear().type('x');
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_correct').should('be.visible');

    cy.get('#\\/c\\/y_input').clear().type('y');
    cy.get('#\\/c\\/z_input').clear().type('x');
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('y');
    cy.get('#\\/d\\/z_input').clear().type('x');
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("two components out of order")
    cy.get('#\\/a\\/y_input').clear();
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/b\\/y_input').clear();
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });

    cy.get('#\\/c\\/y_input').clear();
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear();
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("add component")
    cy.get('#\\/a\\/y_input').clear().type('x');
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/b\\/y_input').clear().type('x');
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });

    cy.get('#\\/c\\/y_input').clear().type('x');
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('x');
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(0);
    });

  });

  it('match partial with ordered and unordered text inputs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <section name="a" newNamespace><title>Match partial</title>

  <p><textinput name="x"/></p>
  <p><textinput name="y"/></p>
  <p><textinput name="z"/></p>
  <answer>
    <award>
      <when matchpartial>
        <textlist>
          <copy prop="immediateValue" tname="x" />
          <copy prop="immediateValue" tname="y" />
          <copy prop="immediateValue" tname="z" />
        </textlist>
        =
        <textlist>x,y,z</textlist>
      </when>
    </award>
  </answer>
  </section>
  
  <section name="b" newnamespace><title>Match partial, unordered</title>
  <p><textinput name="x"/></p>
  <p><textinput name="y"/></p>
  <p><textinput name="z"/></p>

  <answer>
    <award>
      <when matchpartial>
        <textlist unordered="true">
          <copy prop="immediateValue" tname="x" />
          <copy prop="immediateValue" tname="y" />
          <copy prop="immediateValue" tname="z" />
        </textlist>
        =
        <textlist>x,y,z</textlist>
      </when>
    </award>
  </answer>
  </section>

  <section newnamespace name="c"><title>Strict equality</title>
  <p><textinput name="x"/></p>
  <p><textinput name="y"/></p>
  <p><textinput name="z"/></p>

   <answer>
   <award>
     <when>
       <textlist>
         <copy prop="immediateValue" tname="x" />
         <copy prop="immediateValue" tname="y" />
         <copy prop="immediateValue" tname="z" />
       </textlist>
       =
       <textlist>x,y,z</textlist>
     </when>
   </award>
   </answer>
   </section>

   <section newnamespace name="d"><title>Unordered</title>
   <p><textinput name="x"/></p>
   <p><textinput name="y"/></p>
   <p><textinput name="z"/></p>
 
     <answer>

    <award>
      <when>
        <textlist unordered="true">
          <copy prop="immediateValue" tname="x" />
          <copy prop="immediateValue" tname="y" />
          <copy prop="immediateValue" tname="z" />
        </textlist>
        =
        <textlist>x,y,z</textlist>
      </when>
    </award>
  </answer>
  </section>
      `}, "*");
    });

    cy.get('#\\/a\\/_answer1_submit').should('be.visible');
    cy.get('#\\/b\\/_answer1_submit').should('be.visible');
    cy.get('#\\/c\\/_answer1_submit').should('be.visible');
    cy.get('#\\/d\\/_answer1_submit').should('be.visible');

    cy.log("Submit empty answers")
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_incorrect').should('be.visible');
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_incorrect').should('be.visible');
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/b/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit correct answers")
    cy.get('#\\/a\\/x_input').clear().type('x');
    cy.get('#\\/a\\/y_input').clear().type('y');
    cy.get('#\\/a\\/z_input').clear().type('z');
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_correct').should('be.visible');

    cy.get('#\\/b\\/x_input').clear().type('x');
    cy.get('#\\/b\\/y_input').clear().type('y');
    cy.get('#\\/b\\/z_input').clear().type('z');
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_correct').should('be.visible');

    cy.get('#\\/c\\/x_input').clear().type('x');
    cy.get('#\\/c\\/y_input').clear().type('y');
    cy.get('#\\/c\\/z_input').clear().type('z');
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_correct').should('be.visible');

    cy.get('#\\/d\\/x_input').clear().type('x');
    cy.get('#\\/d\\/y_input').clear().type('y');
    cy.get('#\\/d\\/z_input').clear().type('z');
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/b/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("Omit one component")

    cy.get('#\\/a\\/y_input').clear().type('z');
    cy.get('#\\/a\\/z_input').clear();
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/y_input').clear().type('z');
    cy.get('#\\/b\\/z_input').clear();
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/c\\/y_input').clear().type('z');
    cy.get('#\\/c\\/z_input').clear();
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('z');
    cy.get('#\\/d\\/z_input').clear();
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("permute order")
    cy.get('#\\/a\\/x_input').clear().type('z');
    cy.get('#\\/a\\/y_input').clear().type('x');
    cy.get('#\\/a\\/z_input').clear().type('y');
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/x_input').clear().type('z');
    cy.get('#\\/b\\/y_input').clear().type('x');
    cy.get('#\\/b\\/z_input').clear().type('y');
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_correct').should('be.visible');

    cy.get('#\\/c\\/x_input').clear().type('z');
    cy.get('#\\/c\\/y_input').clear().type('x');
    cy.get('#\\/c\\/z_input').clear().type('y');
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/x_input').clear().type('z');
    cy.get('#\\/d\\/y_input').clear().type('x');
    cy.get('#\\/d\\/z_input').clear().type('y');
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("reverse order")
    cy.get('#\\/a\\/y_input').clear().type('y');
    cy.get('#\\/a\\/z_input').clear().type('x');
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })

    cy.get('#\\/b\\/y_input').clear().type('y');
    cy.get('#\\/b\\/z_input').clear().type('x');
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_correct').should('be.visible');

    cy.get('#\\/c\\/y_input').clear().type('y');
    cy.get('#\\/c\\/z_input').clear().type('x');
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('y');
    cy.get('#\\/d\\/z_input').clear().type('x');
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("two components out of order")
    cy.get('#\\/a\\/y_input').clear();
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/b\\/y_input').clear();
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });

    cy.get('#\\/c\\/y_input').clear();
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear();
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("add component")
    cy.get('#\\/a\\/y_input').clear().type('x');
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/b\\/y_input').clear().type('x');
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });

    cy.get('#\\/c\\/y_input').clear().type('x');
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('x');
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(0);
    });

  });

  it('match partial with ordered and unordered boolean inputs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <section name="a" newNamespace><title>Match partial</title>

  <p><booleaninput name="x"/></p>
  <p><booleaninput name="y"/></p>
  <p><booleaninput name="z"/></p>
  <answer>
    <award>
      <when matchpartial>
        <booleanlist>
          <copy prop="value" tname="x" />
          <copy prop="value" tname="y" />
          <copy prop="value" tname="z" />
        </booleanlist>
        =
        <booleanlist>false, true, true</booleanlist>
      </when>
    </award>
  </answer>
  </section>
  
  <section name="b" newnamespace><title>Match partial, unordered</title>
  <p><booleaninput name="x"/></p>
  <p><booleaninput name="y"/></p>
  <p><booleaninput name="z"/></p>

  <answer>

    <award>
      <when matchpartial>
        <booleanlist unordered="true">
          <copy prop="value" tname="x" />
          <copy prop="value" tname="y" />
          <copy prop="value" tname="z" />
        </booleanlist>
        =
        <booleanlist>false, true, true</booleanlist>
      </when>
    </award>
  </answer>
  </section>

  <section newnamespace name="c"><title>Strict equality</title>
  <p><booleaninput name="x"/></p>
  <p><booleaninput name="y"/></p>
  <p><booleaninput name="z"/></p>

   <answer>
   <award>
     <when>
       <booleanlist>
         <copy prop="value" tname="x" />
         <copy prop="value" tname="y" />
         <copy prop="value" tname="z" />
       </booleanlist>
       =
       <booleanlist>false, true, true</booleanlist>
     </when>
   </award>
 </answer>
 </section>

 <section newnamespace name="d"><title>Unordered</title>
 <p><booleaninput name="x"/></p>
 <p><booleaninput name="y"/></p>
 <p><booleaninput name="z"/></p>

   <answer>
    <award>
      <when>
        <booleanlist unordered="true">
          <copy prop="value" tname="x" />
          <copy prop="value" tname="y" />
          <copy prop="value" tname="z" />
        </booleanlist>
        =
        <booleanlist>false, true, true</booleanlist>
      </when>
    </award>
  </answer>
  </section>
      `}, "*");
    });

    cy.get('#\\/a\\/_answer1_submit').should('be.visible');
    cy.get('#\\/b\\/_answer1_submit').should('be.visible');
    cy.get('#\\/c\\/_answer1_submit').should('be.visible');
    cy.get('#\\/d\\/_answer1_submit').should('be.visible');

    cy.log("Submit correct answers")
    cy.get('#\\/a\\/y_input').click();
    cy.get('#\\/a\\/z_input').click();
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_correct').should('be.visible');

    cy.get('#\\/b\\/y_input').click();
    cy.get('#\\/b\\/z_input').click();
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_correct').should('be.visible');

    cy.get('#\\/c\\/y_input').click();
    cy.get('#\\/c\\/z_input').click();
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_correct').should('be.visible');

    cy.get('#\\/d\\/y_input').click();
    cy.get('#\\/d\\/z_input').click();
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/b/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("All true")
    cy.get('#\\/a\\/x_input').click();
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/x_input').click();
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/c\\/x_input').click();
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/x_input').click();
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("wrong order")
    cy.get('#\\/a\\/y_input').click();
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/y_input').click();
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_correct').should('be.visible');

    cy.get('#\\/c\\/y_input').click();
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').click();
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("wrong order and values")
    cy.get('#\\/a\\/z_input').click();
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })

    cy.get('#\\/b\\/z_input').click();
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/c\\/z_input').click();
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/z_input').click();
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).closeTo(2 / 3, 1E-14);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(0);
    });


    cy.log("all false")
    cy.get('#\\/a\\/x_input').click();
    cy.get('#\\/a\\/_answer1_submit').click();
    cy.get('#\\/a\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/b\\/x_input').click();
    cy.get('#\\/b\\/_answer1_submit').click();
    cy.get('#\\/b\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/c\\/x_input').click();
    cy.get('#\\/c\\/_answer1_submit').click();
    cy.get('#\\/c\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/d\\/x_input').click();
    cy.get('#\\/d\\/_answer1_submit').click();
    cy.get('#\\/d\\/_answer1_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(components['/b/_answer1'].stateValues.creditAchieved).closeTo(1 / 3, 1E-14);
      expect(components['/c/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/d/_answer1'].stateValues.creditAchieved).eq(0);
    });

  });

});