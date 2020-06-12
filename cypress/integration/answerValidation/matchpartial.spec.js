describe('Match partial validation tests',function() {

  beforeEach(() => {
    cy.visit('/test')
    })
  
  it('match partial with ordered and unordered tuple',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
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
    `},"*");
    });
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput2_submit').should('be.visible');
    cy.get('#_answer_mathinput3_submit').should('be.visible');
    cy.get('#_answer_mathinput4_submit').should('be.visible');

    cy.log("Submit empty answers")
    cy.get('#_answer_mathinput1_submit').click();
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_submit').click();
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_submit').click();
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_submit').click();
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });
  
    cy.log("Submit correct answers")
    cy.get('#_answer_mathinput1_input').type('(1,2,3){enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').type('(1,2,3){enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_input').type('(1,2,3){enter}');
    cy.get('#_answer_mathinput3_correct').should('be.visible');
    cy.get('#_answer_mathinput4_input').type('(1,2,3){enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("Omit one component")
    cy.get('#_answer_mathinput1_input').clear().type('(1,3){enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput2_input').clear().type('(1,3){enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput3_input').clear().type('(1,3){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(1,3){enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("just a scalar")
    cy.get('#_answer_mathinput1_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput3_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("extra component")
    cy.get('#_answer_mathinput1_input').clear().type('(1,2,a,3){enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '75 %');
    cy.get('#_answer_mathinput2_input').clear().type('(1,2,a,3){enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '75 %');
    cy.get('#_answer_mathinput3_input').clear().type('(1,2,a,3){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(1,2,a,3){enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/4,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/4,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("two extra components")
    cy.get('#_answer_mathinput1_input').clear().type('(0,1,2,a,3){enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '60 %');
    cy.get('#_answer_mathinput2_input').clear().type('(0,1,2,a,3){enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '60 %');
    cy.get('#_answer_mathinput3_input').clear().type('(0,1,2,a,3){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(0,1,2,a,3){enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/5,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/5,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("omit parens")
    cy.get('#_answer_mathinput1_input').clear().type('1,2,3{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1,2,3{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('1,2,3{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('1,2,3{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("permute order")
    cy.get('#_answer_mathinput1_input').clear().type('(3,1,2){enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput2_input').clear().type('(3,1,2){enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('(3,1,2){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(3,1,2){enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("reverse order")
    cy.get('#_answer_mathinput1_input').clear().type('(3,2,1){enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('(3,2,1){enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('(3,2,1){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(3,2,1){enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("add component")
    cy.get('#_answer_mathinput1_input').clear().type('(3,2,1,3){enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput2_input').clear().type('(3,2,1,3){enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '75 %');
    cy.get('#_answer_mathinput3_input').clear().type('(3,2,1,3){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(3,2,1,3){enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/4,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/4,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("add another component")
    cy.get('#_answer_mathinput1_input').clear().type('(3,a,2,1,3){enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '40 %');
    cy.get('#_answer_mathinput2_input').clear().type('(3,a,2,1,3){enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '60 %');
    cy.get('#_answer_mathinput3_input').clear().type('(3,a,2,1,3){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(3,a,2,1,3){enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/5,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/5,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });


    cy.log("add one more component")
    cy.get('#_answer_mathinput1_input').clear().type('(1,3,a,2,1,3){enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput2_input').clear().type('(1,3,a,2,1,3){enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput3_input').clear().type('(1,3,a,2,1,3){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(1,3,a,2,1,3){enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/6,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/6,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });


    cy.log("two component out of order")
    cy.get('#_answer_mathinput1_input').clear().type('(3,1){enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('(3,1){enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput3_input').clear().type('(3,1){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(3,1){enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("add component")
    cy.get('#_answer_mathinput1_input').clear().type('(3,1,1){enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('(3,1,1){enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput3_input').clear().type('(3,1,1){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(3,1,1){enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

  });
    
  it('match partial with ordered and unordered list',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
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
    `},"*");
    });
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput2_submit').should('be.visible');
    cy.get('#_answer_mathinput3_submit').should('be.visible');
    cy.get('#_answer_mathinput4_submit').should('be.visible');

    cy.log("Submit empty answers")
    cy.get('#_answer_mathinput1_submit').click();
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_submit').click();
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_submit').click();
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_submit').click();
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });
  
    cy.log("Submit correct answers")
    cy.get('#_answer_mathinput1_input').type('1,2,3{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').type('1,2,3{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_input').type('1,2,3{enter}');
    cy.get('#_answer_mathinput3_correct').should('be.visible');
    cy.get('#_answer_mathinput4_input').type('1,2,3{enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("Omit one component")
    cy.get('#_answer_mathinput1_input').clear().type('1,3{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput2_input').clear().type('1,3{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput3_input').clear().type('1,3{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('1,3{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("just a scalar")
    cy.get('#_answer_mathinput1_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput3_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("extra component")
    cy.get('#_answer_mathinput1_input').clear().type('1,2,a,3{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '75 %');
    cy.get('#_answer_mathinput2_input').clear().type('1,2,a,3{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '75 %');
    cy.get('#_answer_mathinput3_input').clear().type('1,2,a,3{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('1,2,a,3{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/4,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/4,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("two extra components")
    cy.get('#_answer_mathinput1_input').clear().type('0,1,2,a,3{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '60 %');
    cy.get('#_answer_mathinput2_input').clear().type('0,1,2,a,3{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '60 %');
    cy.get('#_answer_mathinput3_input').clear().type('0,1,2,a,3{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('0,1,2,a,3{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/5,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/5,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("add parens")
    cy.get('#_answer_mathinput1_input').clear().type('(1,2,3){enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('(1,2,3){enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('(1,2,3){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(1,2,3){enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("permute order")
    cy.get('#_answer_mathinput1_input').clear().type('3,1,2{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput2_input').clear().type('3,1,2{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('3,1,2{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('3,1,2{enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("reverse order")
    cy.get('#_answer_mathinput1_input').clear().type('3,2,1{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('3,2,1{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('3,2,1{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('3,2,1{enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("add component")
    cy.get('#_answer_mathinput1_input').clear().type('3,2,1,3{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput2_input').clear().type('3,2,1,3{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '75 %');
    cy.get('#_answer_mathinput3_input').clear().type('3,2,1,3{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('3,2,1,3{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/4,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/4,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("add another component")
    cy.get('#_answer_mathinput1_input').clear().type('3,a,2,1,3{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '40 %');
    cy.get('#_answer_mathinput2_input').clear().type('3,a,2,1,3{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '60 %');
    cy.get('#_answer_mathinput3_input').clear().type('3,a,2,1,3{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('3,a,2,1,3{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/5,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/5,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });


    cy.log("add one more component")
    cy.get('#_answer_mathinput1_input').clear().type('1,3,a,2,1,3{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput2_input').clear().type('1,3,a,2,1,3{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput3_input').clear().type('1,3,a,2,1,3{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('1,3,a,2,1,3{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/6,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/6,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });


    cy.log("two component out of order")
    cy.get('#_answer_mathinput1_input').clear().type('3,1{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('3,1{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput3_input').clear().type('3,1{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('3,1{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("add component")
    cy.get('#_answer_mathinput1_input').clear().type('3,1,1{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('3,1,1{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput3_input').clear().type('3,1,1{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('3,1,1{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

  });
    
  it('match partial with ordered and unordered array',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
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
    `},"*");
    });
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput2_submit').should('be.visible');
    cy.get('#_answer_mathinput3_submit').should('be.visible');
    cy.get('#_answer_mathinput4_submit').should('be.visible');

    cy.log("Submit empty answers")
    cy.get('#_answer_mathinput1_submit').click();
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_submit').click();
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_submit').click();
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_submit').click();
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });
  
    cy.log("Submit correct answers")
    cy.get('#_answer_mathinput1_input').type('[1,2,3]{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').type('[1,2,3]{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_input').type('[1,2,3]{enter}');
    cy.get('#_answer_mathinput3_correct').should('be.visible');
    cy.get('#_answer_mathinput4_input').type('[1,2,3]{enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("Omit one component")
    cy.get('#_answer_mathinput1_input').clear().type('[1,3]{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput2_input').clear().type('[1,3]{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput3_input').clear().type('[1,3]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[1,3]{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("just a scalar")
    cy.get('#_answer_mathinput1_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput3_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('2{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("extra component")
    cy.get('#_answer_mathinput1_input').clear().type('[1,2,a,3]{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '75 %');
    cy.get('#_answer_mathinput2_input').clear().type('[1,2,a,3]{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '75 %');
    cy.get('#_answer_mathinput3_input').clear().type('[1,2,a,3]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[1,2,a,3]{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/4,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/4,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("two extra components")
    cy.get('#_answer_mathinput1_input').clear().type('[0,1,2,a,3]{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '60 %');
    cy.get('#_answer_mathinput2_input').clear().type('[0,1,2,a,3]{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '60 %');
    cy.get('#_answer_mathinput3_input').clear().type('[0,1,2,a,3]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[0,1,2,a,3]{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/5,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/5,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("omit brackets")
    cy.get('#_answer_mathinput1_input').clear().type('1,2,3{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1,2,3{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('1,2,3{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('1,2,3{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("permute order")
    cy.get('#_answer_mathinput1_input').clear().type('[3,1,2]{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput2_input').clear().type('[3,1,2]{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('[3,1,2]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[3,1,2]{enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("reverse order")
    cy.get('#_answer_mathinput1_input').clear().type('[3,2,1]{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('[3,2,1]{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('[3,2,1]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[3,2,1]{enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("add component")
    cy.get('#_answer_mathinput1_input').clear().type('[3,2,1,3]{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput2_input').clear().type('[3,2,1,3]{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '75 %');
    cy.get('#_answer_mathinput3_input').clear().type('[3,2,1,3]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[3,2,1,3]{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/4,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/4,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("add another component")
    cy.get('#_answer_mathinput1_input').clear().type('[3,a,2,1,3]{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '40 %');
    cy.get('#_answer_mathinput2_input').clear().type('[3,a,2,1,3]{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '60 %');
    cy.get('#_answer_mathinput3_input').clear().type('[3,a,2,1,3]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[3,a,2,1,3]{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/5,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/5,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });


    cy.log("add one more component")
    cy.get('#_answer_mathinput1_input').clear().type('[1,3,a,2,1,3]{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput2_input').clear().type('[1,3,a,2,1,3]{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput3_input').clear().type('[1,3,a,2,1,3]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[1,3,a,2,1,3]{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/6,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(3/6,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });


    cy.log("two component out of order")
    cy.get('#_answer_mathinput1_input').clear().type('[3,1]{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('[3,1]{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput3_input').clear().type('[3,1]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[3,1]{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("add component")
    cy.get('#_answer_mathinput1_input').clear().type('[3,1,1]{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('[3,1,1]{enter}');
    cy.get('#_answer_mathinput2_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput3_input').clear().type('[3,1,1]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[3,1,1]{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/_answer2'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

  });
    
  it('match set',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
  <p>Match partial: <answer>
    <award matchpartial>{1,2,3}</award>
  </answer></p>
  
  <p>No partial: <answer>
    <award>{1,2,3}</award>
  </answer></p>
  
    `},"*");
    });
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput2_submit').should('be.visible');

    cy.log("Submit empty answers")
    cy.get('#_answer_mathinput1_submit').click();
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_submit').click();
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
    });
  
    cy.log("Submit correct answers")
    cy.get('#_answer_mathinput1_input').type('{{}1,2,3}{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').type('{{}1,2,3}{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Permute components")
    cy.get('#_answer_mathinput1_input').clear().type('{{}3,2,1}{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('{{}3,2,1}{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Extra component")
    cy.get('#_answer_mathinput1_input').clear().type('{{}3,a,2,1}{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '75 %');
    cy.get('#_answer_mathinput2_input').clear().type('{{}3,a,2,1}{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/4, 1E-14);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
    });

    cy.log("Another component")
    cy.get('#_answer_mathinput1_input').clear().type('{{}3,a,2,b,1}{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '60 %');
    cy.get('#_answer_mathinput2_input').clear().type('{{}3,a,2,b,1}{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/5, 1E-14);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
    });

    cy.log("Duplicate components")
    cy.get('#_answer_mathinput1_input').clear().type('{{}3,2,3,1,1}{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('{{}3,2,3,1,1}{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Add component")
    cy.get('#_answer_mathinput1_input').clear().type('{{}3,2,3,a,1,1}{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '75 %');
    cy.get('#_answer_mathinput2_input').clear().type('{{}3,2,3,a,1,1}{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(3/4, 1E-14);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
    });

    cy.log("Omit braces")
    cy.get('#_answer_mathinput1_input').clear().type('1,2,3{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1,2,3{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
    });

    cy.log("Single number")
    cy.get('#_answer_mathinput1_input').clear().type('3{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '33 %');
    cy.get('#_answer_mathinput2_input').clear().type('3{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(1/3, 1E-14);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
    });

    cy.log("Subset")
    cy.get('#_answer_mathinput1_input').clear().type('{{}2,1}{enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '67 %');
    cy.get('#_answer_mathinput2_input').clear().type('{{}2,1}{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).closeTo(2/3, 1E-14);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
    });

  });
   
  it('match intervals',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
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

    `},"*");
    });
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput2_submit').should('be.visible');
    cy.get('#_answer_mathinput3_submit').should('be.visible');
    cy.get('#_answer_mathinput4_submit').should('be.visible');
    cy.get('#_answer_mathinput5_submit').should('be.visible');
    cy.get('#_answer_mathinput6_submit').should('be.visible');
    cy.get('#_answer_mathinput7_submit').should('be.visible');
    cy.get('#_answer_mathinput8_submit').should('be.visible');

    cy.log("Submit empty answers")
    cy.get('#_answer_mathinput1_submit').click();
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_submit').click();
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_submit').click();
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_submit').click();
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');
    cy.get('#_answer_mathinput5_submit').click();
    cy.get('#_answer_mathinput5_incorrect').should('be.visible');
    cy.get('#_answer_mathinput6_submit').click();
    cy.get('#_answer_mathinput6_incorrect').should('be.visible');
    cy.get('#_answer_mathinput7_submit').click();
    cy.get('#_answer_mathinput7_incorrect').should('be.visible');
    cy.get('#_answer_mathinput8_submit').click();
    cy.get('#_answer_mathinput8_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
      expect(components['/_answer5'].state.creditAchieved).eq(0);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
      expect(components['/_answer7'].state.creditAchieved).eq(0);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
    });
  

    cy.log("single number")
    cy.get('#_answer_mathinput1_input').type('1{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').type('1{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_input').type('1{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').type('1{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');
    cy.get('#_answer_mathinput5_input').type('1{enter}');
    cy.get('#_answer_mathinput5_incorrect').should('be.visible');
    cy.get('#_answer_mathinput6_input').type('1{enter}');
    cy.get('#_answer_mathinput6_incorrect').should('be.visible');
    cy.get('#_answer_mathinput7_input').type('1{enter}');
    cy.get('#_answer_mathinput7_incorrect').should('be.visible');
    cy.get('#_answer_mathinput8_input').type('1{enter}');
    cy.get('#_answer_mathinput8_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
      expect(components['/_answer5'].state.creditAchieved).eq(0);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
      expect(components['/_answer7'].state.creditAchieved).eq(0);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
    });

    cy.log("Open interval")
    cy.get('#_answer_mathinput1_input').clear().type('(1,2){enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('(1,2){enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('(1,2){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(1,2){enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');
    cy.get('#_answer_mathinput5_input').clear().type('(1,2){enter}');
    cy.get('#_answer_mathinput5_incorrect').should('be.visible');
    cy.get('#_answer_mathinput6_input').clear().type('(1,2){enter}');
    cy.get('#_answer_mathinput6_incorrect').should('be.visible');
    cy.get('#_answer_mathinput7_input').clear().type('(1,2){enter}');
    cy.get('#_answer_mathinput7_incorrect').should('be.visible');
    cy.get('#_answer_mathinput8_input').clear().type('(1,2){enter}');
    cy.get('#_answer_mathinput8_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
      expect(components['/_answer5'].state.creditAchieved).eq(0);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
      expect(components['/_answer7'].state.creditAchieved).eq(0);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
    });

    cy.log("partially correct open interval")
    cy.get('#_answer_mathinput1_input').clear().type('(3,2){enter}');
    cy.get('#_answer_mathinput1_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput2_input').clear().type('(3,2){enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0.5);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
    });


    cy.log("permute order")
    cy.get('#_answer_mathinput1_input').clear().type('(2,1){enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('(2,1){enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
    });

    cy.log("Closed interval")
    cy.get('#_answer_mathinput1_input').clear().type('[1,2]{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('[1,2]{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('[1,2]{enter}');
    cy.get('#_answer_mathinput3_correct').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[1,2]{enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');
    cy.get('#_answer_mathinput5_input').clear().type('[1,2]{enter}');
    cy.get('#_answer_mathinput5_incorrect').should('be.visible');
    cy.get('#_answer_mathinput6_input').clear().type('[1,2]{enter}');
    cy.get('#_answer_mathinput6_incorrect').should('be.visible');
    cy.get('#_answer_mathinput7_input').clear().type('[1,2]{enter}');
    cy.get('#_answer_mathinput7_incorrect').should('be.visible');
    cy.get('#_answer_mathinput8_input').clear().type('[1,2]{enter}');
    cy.get('#_answer_mathinput8_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
      expect(components['/_answer5'].state.creditAchieved).eq(0);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
      expect(components['/_answer7'].state.creditAchieved).eq(0);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
    });

    cy.log("Partially correct closed interval")
    cy.get('#_answer_mathinput3_input').clear().type('[1,3]{enter}');
    cy.get('#_answer_mathinput3_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput4_input').clear().type('[1,3]{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer3'].state.creditAchieved).eq(0.5);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });

    cy.log("Permute order")
    cy.get('#_answer_mathinput3_input').clear().type('[2,1]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[2,1]{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
    });


    cy.log("Left open interval")
    cy.get('#_answer_mathinput1_input').clear().type('(1,2]{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('(1,2]{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('(1,2]{enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('(1,2]{enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');
    cy.get('#_answer_mathinput5_input').clear().type('(1,2]{enter}');
    cy.get('#_answer_mathinput5_correct').should('be.visible');
    cy.get('#_answer_mathinput6_input').clear().type('(1,2]{enter}');
    cy.get('#_answer_mathinput6_correct').should('be.visible');
    cy.get('#_answer_mathinput7_input').clear().type('(1,2]{enter}');
    cy.get('#_answer_mathinput7_incorrect').should('be.visible');
    cy.get('#_answer_mathinput8_input').clear().type('(1,2]{enter}');
    cy.get('#_answer_mathinput8_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
      expect(components['/_answer5'].state.creditAchieved).eq(1);
      expect(components['/_answer6'].state.creditAchieved).eq(1);
      expect(components['/_answer7'].state.creditAchieved).eq(0);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
    });

    cy.log("Partially correct left open interval")
    cy.get('#_answer_mathinput5_input').clear().type('(1,3]{enter}');
    cy.get('#_answer_mathinput5_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput6_input').clear().type('(1,3]{enter}');
    cy.get('#_answer_mathinput6_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer5'].state.creditAchieved).eq(0.5);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
    });

    cy.log("Permute order")
    cy.get('#_answer_mathinput5_input').clear().type('(2,1]{enter}');
    cy.get('#_answer_mathinput5_incorrect').should('be.visible');
    cy.get('#_answer_mathinput6_input').clear().type('(2,1]{enter}');
    cy.get('#_answer_mathinput6_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer5'].state.creditAchieved).eq(0);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
    });

    cy.log("Right open interval")
    cy.get('#_answer_mathinput1_input').clear().type('[1,2){enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('[1,2){enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('[1,2){enter}');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('[1,2){enter}');
    cy.get('#_answer_mathinput4_incorrect').should('be.visible');
    cy.get('#_answer_mathinput5_input').clear().type('[1,2){enter}');
    cy.get('#_answer_mathinput5_incorrect').should('be.visible');
    cy.get('#_answer_mathinput6_input').clear().type('[1,2){enter}');
    cy.get('#_answer_mathinput6_incorrect').should('be.visible');
    cy.get('#_answer_mathinput7_input').clear().type('[1,2){enter}');
    cy.get('#_answer_mathinput7_correct').should('be.visible');
    cy.get('#_answer_mathinput8_input').clear().type('[1,2){enter}');
    cy.get('#_answer_mathinput8_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
      expect(components['/_answer5'].state.creditAchieved).eq(0);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
      expect(components['/_answer7'].state.creditAchieved).eq(1);
      expect(components['/_answer8'].state.creditAchieved).eq(1);
    });

    cy.log("Partially correct right open interval")
    cy.get('#_answer_mathinput7_input').clear().type('[1,3){enter}');
    cy.get('#_answer_mathinput7_partial').should('have.text', '50 %');
    cy.get('#_answer_mathinput8_input').clear().type('[1,3){enter}');
    cy.get('#_answer_mathinput8_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer7'].state.creditAchieved).eq(0.5);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
    });

    cy.log("Permute order")
    cy.get('#_answer_mathinput7_input').clear().type('[2,1){enter}');
    cy.get('#_answer_mathinput7_incorrect').should('be.visible');
    cy.get('#_answer_mathinput8_input').clear().type('[2,1){enter}');
    cy.get('#_answer_mathinput8_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer7'].state.creditAchieved).eq(0);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
    });

  });

  it('match partial with ordered and unordered math inputs',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
  <p>Match partial:</p>
  <answer name="a" newnamespace>
    <p><mathinput name="x"/></p>
    <p><mathinput name="y"/></p>
    <p><mathinput name="z"/></p>

    <award>
      <if matchpartial>
        <math>
          <ref prop="value">x</ref>,
          <ref prop="value">y</ref>,
          <ref prop="value">z</ref>
        </math>
        =
        <math>x,y,z</math>
      </if>
    </award>
  </answer>

  <p>Match partial, unordered:</p>
  <answer name="b" newnamespace>
    <p><mathinput name="x"/></p>
    <p><mathinput name="y"/></p>
    <p><mathinput name="z"/></p>

    <award>
      <if matchpartial>
        <math unordered="true">
          <ref prop="value">x</ref>,
          <ref prop="value">y</ref>,
          <ref prop="value">z</ref>
        </math>
        =
        <math>x,y,z</math>
      </if>
    </award>
  </answer>

  <p>Strict equality:</p>
  <answer name="c" newnamespace>
   <p><mathinput name="x"/></p>
   <p><mathinput name="y"/></p>
   <p><mathinput name="z"/></p>

   <award>
     <if>
       <math>
         <ref prop="value">x</ref>,
         <ref prop="value">y</ref>,
         <ref prop="value">z</ref>
       </math>
       =
       <math>x,y,z</math>
     </if>
   </award>
 </answer>

  <p>Unordered:</p>
  <answer name="d" newnamespace>
    <p><mathinput name="x"/></p>
    <p><mathinput name="y"/></p>
    <p><mathinput name="z"/></p>

    <award>
      <if>
        <math unordered="true">
          <ref prop="value">x</ref>,
          <ref prop="value">y</ref>,
          <ref prop="value">z</ref>
        </math>
        =
        <math>x,y,z</math>
      </if>
    </award>
  </answer>
      `},"*");
    });

    cy.get('#\\/a_submit').should('be.visible');
    cy.get('#\\/b_submit').should('be.visible');
    cy.get('#\\/c_submit').should('be.visible');
    cy.get('#\\/d_submit').should('be.visible');

    cy.log("Submit empty answers")
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_incorrect').should('be.visible');
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_incorrect').should('be.visible');
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).eq(0);
      expect(components['/b'].state.creditAchieved).eq(0);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(0);
    });
  
    cy.log("Submit correct answers")
    cy.get('#\\/a\\/x_input').clear().type('x');
    cy.get('#\\/a\\/y_input').clear().type('y');
    cy.get('#\\/a\\/z_input').clear().type('z');
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_correct').should('be.visible');

    cy.get('#\\/b\\/x_input').clear().type('x');
    cy.get('#\\/b\\/y_input').clear().type('y');
    cy.get('#\\/b\\/z_input').clear().type('z');
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_correct').should('be.visible');

    cy.get('#\\/c\\/x_input').clear().type('x');
    cy.get('#\\/c\\/y_input').clear().type('y');
    cy.get('#\\/c\\/z_input').clear().type('z');
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_correct').should('be.visible');

    cy.get('#\\/d\\/x_input').clear().type('x');
    cy.get('#\\/d\\/y_input').clear().type('y');
    cy.get('#\\/d\\/z_input').clear().type('z');
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).eq(1);
      expect(components['/b'].state.creditAchieved).eq(1);
      expect(components['/c'].state.creditAchieved).eq(1);
      expect(components['/d'].state.creditAchieved).eq(1);
    });

    cy.log("Omit one component")

    cy.get('#\\/a\\/y_input').clear().type('z');
    cy.get('#\\/a\\/z_input').clear();
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/y_input').clear().type('z');
    cy.get('#\\/b\\/z_input').clear();
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/c\\/y_input').clear().type('z');
    cy.get('#\\/c\\/z_input').clear();
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('z');
    cy.get('#\\/d\\/z_input').clear();
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/b'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(0);
    });

    cy.log("permute order")
    cy.get('#\\/a\\/x_input').clear().type('z');
    cy.get('#\\/a\\/y_input').clear().type('x');
    cy.get('#\\/a\\/z_input').clear().type('y');
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/x_input').clear().type('z');
    cy.get('#\\/b\\/y_input').clear().type('x');
    cy.get('#\\/b\\/z_input').clear().type('y');
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_correct').should('be.visible');

    cy.get('#\\/c\\/x_input').clear().type('z');
    cy.get('#\\/c\\/y_input').clear().type('x');
    cy.get('#\\/c\\/z_input').clear().type('y');
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/x_input').clear().type('z');
    cy.get('#\\/d\\/y_input').clear().type('x');
    cy.get('#\\/d\\/z_input').clear().type('y');
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/b'].state.creditAchieved).eq(1);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(1);
    });

    cy.log("reverse order")
    cy.get('#\\/a\\/y_input').clear().type('y');
    cy.get('#\\/a\\/z_input').clear().type('x');
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })

    cy.get('#\\/b\\/y_input').clear().type('y');
    cy.get('#\\/b\\/z_input').clear().type('x');
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_correct').should('be.visible');

    cy.get('#\\/c\\/y_input').clear().type('y');
    cy.get('#\\/c\\/z_input').clear().type('x');
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('y');
    cy.get('#\\/d\\/z_input').clear().type('x');
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/b'].state.creditAchieved).eq(1);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(1);
    });


    cy.log("two components out of order")
    cy.get('#\\/a\\/y_input').clear();
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/b\\/y_input').clear();
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });

    cy.get('#\\/c\\/y_input').clear();
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear();
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/b'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(0);
    });

    cy.log("add component")
    cy.get('#\\/a\\/y_input').clear().type('x');
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/b\\/y_input').clear().type('x');
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });

    cy.get('#\\/c\\/y_input').clear().type('x');
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('x');
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/b'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(0);
    });

  });
    
  it('match partial with ordered and unordered text inputs',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
  <p>Match partial:</p>
  <answer name="a" newnamespace>
    <p><textinput name="x"/></p>
    <p><textinput name="y"/></p>
    <p><textinput name="z"/></p>

    <award>
      <if matchpartial>
        <textlist>
          <ref prop="value">x</ref>
          <ref prop="value">y</ref>
          <ref prop="value">z</ref>
        </textlist>
        =
        <textlist>x,y,z</textlist>
      </if>
    </award>
  </answer>

  <p>Match partial, unordered:</p>
  <answer name="b" newnamespace>
    <p><textinput name="x"/></p>
    <p><textinput name="y"/></p>
    <p><textinput name="z"/></p>

    <award>
      <if matchpartial>
        <textlist unordered="true">
          <ref prop="value">x</ref>
          <ref prop="value">y</ref>
          <ref prop="value">z</ref>
        </textlist>
        =
        <textlist>x,y,z</textlist>
      </if>
    </award>
  </answer>

  <p>Strict equality:</p>
  <answer name="c" newnamespace>
   <p><textinput name="x"/></p>
   <p><textinput name="y"/></p>
   <p><textinput name="z"/></p>

   <award>
     <if>
       <textlist>
         <ref prop="value">x</ref>
         <ref prop="value">y</ref>
         <ref prop="value">z</ref>
       </textlist>
       =
       <textlist>x,y,z</textlist>
     </if>
   </award>
 </answer>

  <p>Unordered:</p>
  <answer name="d" newnamespace>
    <p><textinput name="x"/></p>
    <p><textinput name="y"/></p>
    <p><textinput name="z"/></p>

    <award>
      <if>
        <textlist unordered="true">
          <ref prop="value">x</ref>
          <ref prop="value">y</ref>
          <ref prop="value">z</ref>
        </textlist>
        =
        <textlist>x,y,z</textlist>
      </if>
    </award>
  </answer>
      `},"*");
    });

    cy.get('#\\/a_submit').should('be.visible');
    cy.get('#\\/b_submit').should('be.visible');
    cy.get('#\\/c_submit').should('be.visible');
    cy.get('#\\/d_submit').should('be.visible');

    cy.log("Submit empty answers")
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_incorrect').should('be.visible');
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_incorrect').should('be.visible');
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).eq(0);
      expect(components['/b'].state.creditAchieved).eq(0);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(0);
    });
  
    cy.log("Submit correct answers")
    cy.get('#\\/a\\/x_input').clear().type('x');
    cy.get('#\\/a\\/y_input').clear().type('y');
    cy.get('#\\/a\\/z_input').clear().type('z');
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_correct').should('be.visible');

    cy.get('#\\/b\\/x_input').clear().type('x');
    cy.get('#\\/b\\/y_input').clear().type('y');
    cy.get('#\\/b\\/z_input').clear().type('z');
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_correct').should('be.visible');

    cy.get('#\\/c\\/x_input').clear().type('x');
    cy.get('#\\/c\\/y_input').clear().type('y');
    cy.get('#\\/c\\/z_input').clear().type('z');
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_correct').should('be.visible');

    cy.get('#\\/d\\/x_input').clear().type('x');
    cy.get('#\\/d\\/y_input').clear().type('y');
    cy.get('#\\/d\\/z_input').clear().type('z');
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).eq(1);
      expect(components['/b'].state.creditAchieved).eq(1);
      expect(components['/c'].state.creditAchieved).eq(1);
      expect(components['/d'].state.creditAchieved).eq(1);
    });

    cy.log("Omit one component")

    cy.get('#\\/a\\/y_input').clear().type('z');
    cy.get('#\\/a\\/z_input').clear();
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/y_input').clear().type('z');
    cy.get('#\\/b\\/z_input').clear();
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/c\\/y_input').clear().type('z');
    cy.get('#\\/c\\/z_input').clear();
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('z');
    cy.get('#\\/d\\/z_input').clear();
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/b'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(0);
    });

    cy.log("permute order")
    cy.get('#\\/a\\/x_input').clear().type('z');
    cy.get('#\\/a\\/y_input').clear().type('x');
    cy.get('#\\/a\\/z_input').clear().type('y');
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/x_input').clear().type('z');
    cy.get('#\\/b\\/y_input').clear().type('x');
    cy.get('#\\/b\\/z_input').clear().type('y');
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_correct').should('be.visible');

    cy.get('#\\/c\\/x_input').clear().type('z');
    cy.get('#\\/c\\/y_input').clear().type('x');
    cy.get('#\\/c\\/z_input').clear().type('y');
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/x_input').clear().type('z');
    cy.get('#\\/d\\/y_input').clear().type('x');
    cy.get('#\\/d\\/z_input').clear().type('y');
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/b'].state.creditAchieved).eq(1);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(1);
    });

    cy.log("reverse order")
    cy.get('#\\/a\\/y_input').clear().type('y');
    cy.get('#\\/a\\/z_input').clear().type('x');
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })

    cy.get('#\\/b\\/y_input').clear().type('y');
    cy.get('#\\/b\\/z_input').clear().type('x');
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_correct').should('be.visible');

    cy.get('#\\/c\\/y_input').clear().type('y');
    cy.get('#\\/c\\/z_input').clear().type('x');
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('y');
    cy.get('#\\/d\\/z_input').clear().type('x');
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/b'].state.creditAchieved).eq(1);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(1);
    });


    cy.log("two components out of order")
    cy.get('#\\/a\\/y_input').clear();
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/b\\/y_input').clear();
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });

    cy.get('#\\/c\\/y_input').clear();
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear();
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/b'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(0);
    });

    cy.log("add component")
    cy.get('#\\/a\\/y_input').clear().type('x');
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/b\\/y_input').clear().type('x');
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });

    cy.get('#\\/c\\/y_input').clear().type('x');
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').clear().type('x');
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/b'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(0);
    });

  });
    
      
  it.only('match partial with ordered and unordered boolean inputs',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
  <p>Match partial:</p>
  <answer name="a" newnamespace>
    <p><booleaninput name="x"/></p>
    <p><booleaninput name="y"/></p>
    <p><booleaninput name="z"/></p>

    <award>
      <if matchpartial>
        <booleanlist>
          <ref prop="value">x</ref>
          <ref prop="value">y</ref>
          <ref prop="value">z</ref>
        </booleanlist>
        =
        <booleanlist>false, true, true</booleanlist>
      </if>
    </award>
  </answer>

  <p>Match partial, unordered:</p>
  <answer name="b" newnamespace>
    <p><booleaninput name="x"/></p>
    <p><booleaninput name="y"/></p>
    <p><booleaninput name="z"/></p>

    <award>
      <if matchpartial>
        <booleanlist unordered="true">
          <ref prop="value">x</ref>
          <ref prop="value">y</ref>
          <ref prop="value">z</ref>
        </booleanlist>
        =
        <booleanlist>false, true, true</booleanlist>
      </if>
    </award>
  </answer>

  <p>Strict equality:</p>
  <answer name="c" newnamespace>
   <p><booleaninput name="x"/></p>
   <p><booleaninput name="y"/></p>
   <p><booleaninput name="z"/></p>

   <award>
     <if>
       <booleanlist>
         <ref prop="value">x</ref>
         <ref prop="value">y</ref>
         <ref prop="value">z</ref>
       </booleanlist>
       =
       <booleanlist>false, true, true</booleanlist>
     </if>
   </award>
 </answer>

  <p>Unordered:</p>
  <answer name="d" newnamespace>
    <p><booleaninput name="x"/></p>
    <p><booleaninput name="y"/></p>
    <p><booleaninput name="z"/></p>

    <award>
      <if>
        <booleanlist unordered="true">
          <ref prop="value">x</ref>
          <ref prop="value">y</ref>
          <ref prop="value">z</ref>
        </booleanlist>
        =
        <booleanlist>false, true, true</booleanlist>
      </if>
    </award>
  </answer>
      `},"*");
    });

    cy.get('#\\/a_submit').should('be.visible');
    cy.get('#\\/b_submit').should('be.visible');
    cy.get('#\\/c_submit').should('be.visible');
    cy.get('#\\/d_submit').should('be.visible');

    cy.log("Submit correct answers")
    cy.get('#\\/a\\/y_input').click();
    cy.get('#\\/a\\/z_input').click();
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_correct').should('be.visible');

    cy.get('#\\/b\\/y_input').click();
    cy.get('#\\/b\\/z_input').click();
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_correct').should('be.visible');

    cy.get('#\\/c\\/y_input').click();
    cy.get('#\\/c\\/z_input').click();
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_correct').should('be.visible');

    cy.get('#\\/d\\/y_input').click();
    cy.get('#\\/d\\/z_input').click();
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).eq(1);
      expect(components['/b'].state.creditAchieved).eq(1);
      expect(components['/c'].state.creditAchieved).eq(1);
      expect(components['/d'].state.creditAchieved).eq(1);
    });

    cy.log("All true")
    cy.get('#\\/a\\/x_input').click();
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/x_input').click();
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/c\\/x_input').click();
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/x_input').click();
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/b'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(0);
    });

    cy.log("wrong order")
    cy.get('#\\/a\\/y_input').click();
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/b\\/y_input').click();
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_correct').should('be.visible');

    cy.get('#\\/c\\/y_input').click();
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/y_input').click();
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/b'].state.creditAchieved).eq(1);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(1);
    });

    cy.log("wrong order and values")
    cy.get('#\\/a\\/z_input').click();
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })

    cy.get('#\\/b\\/z_input').click();
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    
    cy.get('#\\/c\\/z_input').click();
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/z_input').click();
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/b'].state.creditAchieved).closeTo(2/3,1E-14);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(0);
    });


    cy.log("all false")
    cy.get('#\\/a\\/x_input').click();
    cy.get('#\\/a_submit').click();
    cy.get('#\\/a_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/b\\/x_input').click();
    cy.get('#\\/b_submit').click();
    cy.get('#\\/b_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    });

    cy.get('#\\/c\\/x_input').click();
    cy.get('#\\/c_submit').click();
    cy.get('#\\/c_incorrect').should('be.visible');

    cy.get('#\\/d\\/x_input').click();
    cy.get('#\\/d_submit').click();
    cy.get('#\\/d_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/a'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/b'].state.creditAchieved).closeTo(1/3,1E-14);
      expect(components['/c'].state.creditAchieved).eq(0);
      expect(components['/d'].state.creditAchieved).eq(0);
    });

  });
    
});