describe('Symbolic equality tests',function() {

  beforeEach(() => {
    cy.visit('/test')
    })
  
  it('symbolic equality match with no simplification',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1+3</math>: 
    <answer>
      <award symbolicEquality="true"><ref>_math1</ref></award>
    </answer>

    </p>
    
    <p><math>3+1</math>: 
    <answer>
      <award symbolicEquality="true"><ref>_math2</ref></award>
    </answer>
    </p>

    <p>Numeric versions</p>
    <p><answer>
      <ref>_math1</ref>
    </answer></p>
    <p><answer>
      <ref>_math2</ref>
    </answer></p>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

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
  
    cy.log("The sum isn't correct for symbolic")
    cy.get('#_answer_mathinput1_input').type('4{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').type('4{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_input').type('4{enter}');
    cy.get('#_answer_mathinput3_correct').should('be.visible');
    cy.get('#_answer_mathinput4_input').type('4{enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("3+1")
    cy.get('#_answer_mathinput1_input').clear().type('3+1{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('3+1{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('3+1{enter}');
    cy.get('#_answer_mathinput3_correct').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('3+1{enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("1+3")
    cy.get('#_answer_mathinput1_input').clear().type('1+3{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1+3{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('1+3{enter}');
    cy.get('#_answer_mathinput3_correct').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('1+3{enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });

    cy.log("1+1+1+1")
    cy.get('#_answer_mathinput1_input').clear().type('1+1+1+1{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1+1+1+1{enter}');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_input').clear().type('1+1+1+1{enter}');
    cy.get('#_answer_mathinput3_correct').should('be.visible');
    cy.get('#_answer_mathinput4_input').clear().type('1+1+1+1{enter}');
    cy.get('#_answer_mathinput4_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
    });


  });
  
  it('symbolic equality match with no simplification 2',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1x-0y+-3s</math>: 
    <answer>
      <award symbolicEquality="true"><ref>_math1</ref></award>
    </answer>
    </p>

    <p>Numeric version</p>
    <p><answer>
      <ref>_math1</ref>
    </answer></p>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("Submit exact answer")
    cy.get('#_answer_mathinput1_input').type('1x-0y+-3s{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').type('1x-0y+-3s{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Plus negative to subtraction")
    cy.get('#_answer_mathinput1_input').clear().type('1x-0y-3s{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1x-0y-3s{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Parentheses")
    cy.get('#_answer_mathinput1_input').clear().type('1x-0y+(-3s){enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1x-0y+(-3s){enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Positive zero")
    cy.get('#_answer_mathinput1_input').clear().type('1x+0y-3s{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1x+0y-3s{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Remove zero term")
    cy.get('#_answer_mathinput1_input').clear().type('1x-3s{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1x-3s{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Remove one coefficient")
    cy.get('#_answer_mathinput1_input').clear().type('x-0y-3s{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('x-0y-3s{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Reorder terms")
    cy.get('#_answer_mathinput1_input').clear().type('-0y+1x-3s{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('-0y+1x-3s{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

  });

  it('symbolic equality match with simplifying numbers, preserving order',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1x^2+2-0x^2+3+x^2+3x^2+7+4</math>: 
    <answer size="20">
      <award symbolicEquality="true"><ref simplify="numbersPreserveOrder">_math1</ref></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer size="20">
      <ref>_math1</ref>
    </answer></p>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("Submit exact answer")
    cy.get('#_answer_mathinput1_input').type('1x^2+2-0x^2+3+x^2+3x^2+7+4{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').type('1x^2+2-0x^2+3+x^2+3x^2+7+4{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Simplify numbers")
    cy.get('#_answer_mathinput1_input').clear().type('x^2+5+x^2+3x^2+11{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('x^2+5+x^2+3x^2+11{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Permute adjacent numbers")
    cy.get('#_answer_mathinput1_input').clear().type('1x^2+2-0x^2+3+x^2+3x^2+4+7{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1x^2+2-0x^2+3+x^2+3x^2+4+7{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Permute adjacent variable terms")
    cy.get('#_answer_mathinput1_input').clear().type('1x^2+2-0x^2+3+3x^2+x^2+7+4{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1x^2+2-0x^2+3+3x^2+x^2+7+4{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Combine adjacent variable terms")
    cy.get('#_answer_mathinput1_input').clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Combine all numbers")
    cy.get('#_answer_mathinput1_input').clear().type('1x^2-0x^2+x^2+3x^2+16{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1x^2-0x^2+x^2+3x^2+16{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Combine all terms")
    cy.get('#_answer_mathinput1_input').clear().type('5x^2+16{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('5x^2+16{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

  });

  it('symbolic equality match with simplifying numbers',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p><text>a</text></p>
    <p>
    <math>1x^2+2-0x^2+3+x^2+3x^2+7+4</math>: 
    <answer size="20">
      <award symbolicEquality="true"><ref simplify="numbers">_math1</ref></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer size="20">
      <ref>_math1</ref>
    </answer></p>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("Submit exact answer")
    cy.get('#_answer_mathinput1_input').type('1x^2+2-0x^2+3+x^2+3x^2+7+4{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').type('1x^2+2-0x^2+3+x^2+3x^2+7+4{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Simplify numbers")
    cy.get('#_answer_mathinput1_input').clear().type('x^2+x^2+3x^2+16{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('x^2+x^2+3x^2+16{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Permute terms")
    cy.get('#_answer_mathinput1_input').clear().type('7+1x^2-0x^2+3+3x^2+4+2+x^2{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('7+1x^2-0x^2+3+3x^2+4+2+x^2{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Combine variable terms")
    cy.get('#_answer_mathinput1_input').clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Combine adjacent variable terms")
    cy.get('#_answer_mathinput1_input').clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('1x^2+2-0x^2+3+4x^2+7+4{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Combine all terms")
    cy.get('#_answer_mathinput1_input').clear().type('5x^2+16{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('5x^2+16{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

  });

  it('symbolic equality match with full simplification',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p><text>a</text></p>
    <p>
    <math>6x^2 -3x +8x-4 + (2x-3)(4-x)</math>: 
    <answer size="20">
      <award symbolicEquality="true"><ref simplify>_math1</ref></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer size="20">
      <ref>_math1</ref>
    </answer></p>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("Submit exact answer")
    cy.get('#_answer_mathinput1_input').type('6x^2 -3x +8x-4 + (2x-3)(4-x){enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').type('6x^2 -3x +8x-4 + (2x-3)(4-x){enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Combine terms")
    cy.get('#_answer_mathinput1_input').clear().type('6x^2 + 5x-4 + (2x-3)(4-x){enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('6x^2 + 5x-4 + (2x-3)(4-x){enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Permute terms and factors")
    cy.get('#_answer_mathinput1_input').clear().type('-4 + 6x^2 + (4-x)(-3+2x) + 5x{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('-4 + 6x^2 + (4-x)(-3+2x) + 5x{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Expand polynomial")
    cy.get('#_answer_mathinput1_input').clear().type('6x^2 + 5x-4-2x^2+11x-12{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('6x^2 + 5x-4-2x^2+11x-12{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Expand and simplify")
    cy.get('#_answer_mathinput1_input').clear().type('4x^2 + 16x-16{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('4x^2 + 16x-16{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Factor polynomial")
    cy.get('#_answer_mathinput1_input').clear().type('(3x+4)(2x -1) + (2x-3)(4-x){enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('(3x+4)(2x -1) + (2x-3)(4-x){enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

  });

  it('symbolic equality match with expand and full simplification',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p><text>a</text></p>
    <p>
    <math>(2x-3)(4-x) + sin(x)^2+cos(x)^2</math>: 
    <answer size="20">
      <award symbolicEquality="true"><ref simplify expand>_math1</ref></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer size="20">
      <ref>_math1</ref>
    </answer></p>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("Submit exact answer")
    cy.get('#_answer_mathinput1_input').type('(2x-3)(4-x) + sin(x)^2+cos(x)^2{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').type('(2x-3)(4-x) + sin(x)^2+cos(x)^2{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Expand polynomial")
    cy.get('#_answer_mathinput1_input').clear().type('-2x^2+11x-12 + sin(x)^2+cos(x)^2{enter}');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('-2x^2+11x-12 + sin(x)^2+cos(x)^2{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

    cy.log("Simplify trig")
    cy.get('#_answer_mathinput1_input').clear().type('(2x-3)(4-x) + 1{enter}');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_input').clear().type('(2x-3)(4-x) + 1{enter}');
    cy.get('#_answer_mathinput2_correct').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
    });

  });

});