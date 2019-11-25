describe('Answer Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('answer sugar from one string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer>x+y</answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
    });

    cy.log("Type correct answer in")
    cy.get('#_answer_mathinput1_input').type(`x+y`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
    });


    cy.log("Press enter to submit")
    cy.get('#_answer_mathinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eqls(["+", 'x', 'y']);
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components.__math3.state.value.tree).eqls(["+", 'x', 'y']);
    });


    cy.log("Enter wrong answer")
    cy.get('#_answer_mathinput1_input').clear().type(`x`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eq("x");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components.__math3.state.value.tree).eqls(["+", 'x', 'y']);
    });

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();


    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq("x");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq("x");
      expect(components.__math3.state.value.tree).eq("x");
    });

  });

  it('answer sugar from one string, set to text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer type="text">hello there</answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text3').should('have.text', '＿');

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });

    cy.log("Type correct answer in")
    cy.get('#_answer_textinput1_input').type(` hello there `);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', ' hello there ');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text3').should('have.text', '＿');

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });


    cy.log("Press enter to submit")
    cy.get('#_answer_textinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', ' hello there ');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text3').should('have.text', ' hello there ');

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq(" hello there ");
      expect(components['_answer_textinput1'].state.submittedvalue).eq(" hello there ");
      expect(components.__text3.state.value).eq(" hello there ");
    });


    cy.log("Enter wrong answer")
    cy.get('#_answer_textinput1_input').clear().type(`hello  there`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello  there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text3').should('have.text', ' hello there ')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq("hello  there");
      expect(components['_answer_textinput1'].state.submittedvalue).eq(" hello there ");
      expect(components.__text3.state.value).eq(" hello there ");
    });

    cy.log("Submit answer")
    cy.get('#_answer_textinput1_submit').click();


    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello  there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text3').should('have.text', 'hello  there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq("hello  there");
      expect(components['_answer_textinput1'].state.submittedvalue).eq("hello  there");
      expect(components.__text3.state.value).eq("hello  there");
    });

  });

  it('answer sugar from one string, set to text, initially unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer><type><ref>t1</ref></type>hello there</answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  
  <p><ref name="t1">_text1</ref>
  <text>text</text></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text5').should('have.text', '＿');

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });

    cy.log("Type correct answer in")
    cy.get('#_answer_textinput1_input').type(` hello there `);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', ' hello there ');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text5').should('have.text', '＿');

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });


    cy.log("Press enter to submit")
    cy.get('#_answer_textinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', ' hello there ');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text5').should('have.text', ' hello there ');

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq(" hello there ");
      expect(components['_answer_textinput1'].state.submittedvalue).eq(" hello there ");
      expect(components.__text5.state.value).eq(" hello there ");
    });


    cy.log("Enter wrong answer")
    cy.get('#_answer_textinput1_input').clear().type(`hello  there`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello  there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text5').should('have.text', ' hello there ')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq("hello  there");
      expect(components['_answer_textinput1'].state.submittedvalue).eq(" hello there ");
      expect(components.__text5.state.value).eq(" hello there ");
    });

    cy.log("Submit answer")
    cy.get('#_answer_textinput1_submit').click();


    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello  there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text5').should('have.text', 'hello  there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq("hello  there");
      expect(components['_answer_textinput1'].state.submittedvalue).eq("hello  there");
      expect(components.__text5.state.value).eq("hello  there");
    });

  });

  it('answer sugar from one math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer><math>x+y</math></answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
    });

    cy.log("Type correct answer in")
    cy.get('#_answer_mathinput1_input').type(`x+y`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
    });


    cy.log("Press enter to submit")
    cy.get('#_answer_mathinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eqls(["+", 'x', 'y']);
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components.__math2.state.value.tree).eqls(["+", 'x', 'y']);
    });


    cy.log("Enter wrong answer")
    cy.get('#_answer_mathinput1_input').clear().type(`x`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eq("x");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components.__math2.state.value.tree).eqls(["+", 'x', 'y']);
    });

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq("x");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq("x");
      expect(components.__math2.state.value.tree).eq("x");
    });

  });

  it('answer sugar from one math, initally unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer><math>x+y-3+<ref>n</ref></math></answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>

  <ref name="n2">n3</ref>
  <ref name="n">num1</ref>
  <number name="num1"><ref>n2</ref>+<ref>num2</ref></number>
  <number name="num2"><ref>n3</ref>+<ref>num3</ref></number>
  <ref name="n3">num3</ref>
  <number name="num3">1</number>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
    });

    cy.log("Type correct answer in")
    cy.get('#_answer_mathinput1_input').type(`x+y`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
    });


    cy.log("Press enter to submit")
    cy.get('#_answer_mathinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eqls(["+", 'x', 'y']);
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components.__math2.state.value.tree).eqls(["+", 'x', 'y']);
    });


    cy.log("Enter wrong answer")
    cy.get('#_answer_mathinput1_input').clear().type(`x`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eq("x");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components.__math2.state.value.tree).eqls(["+", 'x', 'y']);
    });

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();


    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq("x");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq("x");
      expect(components.__math2.state.value.tree).eq("x");
    });

  });

  it('answer sugar from one text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer><text>  hello there </text></answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text2').should('have.text', '＿')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });

    cy.log("Type correct answer in")
    cy.get('#_answer_textinput1_input').type('hello there');

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text2').should('have.text', '＿')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });


    cy.log("Press enter to submit")
    cy.get('#_answer_textinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text2').should('have.text', 'hello there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq('hello there');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('hello there');
      expect(components.__text2.state.value).eq('hello there');
    });


    cy.log("Enter wrong answer")
    cy.get('#_answer_textinput1_input').clear().type(`hello  there`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello  there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text2').should('have.text', 'hello there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq("hello  there");
      expect(components['_answer_textinput1'].state.submittedvalue).eq('hello there');
      expect(components.__text2.state.value).eq('hello there');
    });

    cy.log("Submit answer")
    cy.get('#_answer_textinput1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello  there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text2').should('have.text', 'hello  there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq("hello  there");
      expect(components['_answer_textinput1'].state.submittedvalue).eq("hello  there");
      expect(components.__text2.state.value).eq("hello  there");
    });

  });

  it('answer sugar from one text, initally unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer><ref>n</ref></answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>

  <ref name="n2">n3</ref>
  <ref name="n">text1</ref>
  <text name="text1"><ref>n2</ref> <ref>text2</ref></text>
  <text name="text2"><ref>n4</ref></text>
  <ref name="n3">text3</ref>
  <text name="text3">hello</text>
  <ref name="n4">text4</ref>
  <text name="text4">there</text>

  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text10').should('have.text', '＿')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });

    cy.log("Type correct answer in")
    cy.get('#_answer_textinput1_input').type('hello there');

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text10').should('have.text', '＿')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });


    cy.log("Press enter to submit")
    cy.get('#_answer_textinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text10').should('have.text', 'hello there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq('hello there');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('hello there');
      expect(components.__text10.state.value).eq('hello there');
    });


    cy.log("Enter wrong answer")
    cy.get('#_answer_textinput1_input').clear().type(`hello  there`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello  there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text10').should('have.text', 'hello there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq("hello  there");
      expect(components['_answer_textinput1'].state.submittedvalue).eq('hello there');
      expect(components.__text10.state.value).eq('hello there');
    });

    cy.log("Submit answer")
    cy.get('#_answer_textinput1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello  there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text10').should('have.text', 'hello  there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq("hello  there");
      expect(components['_answer_textinput1'].state.submittedvalue).eq("hello  there");
      expect(components.__text10.state.value).eq("hello  there");
    });

  });

  it('answer sugar from incomplete awards', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer><award>x+y</award><award credit="0.5"><math>x</math></award></answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
    });

    cy.log("Type correct answer in")
    cy.get('#_answer_mathinput1_input').type(`x+y`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
    });


    cy.log("Press enter to submit")
    cy.get('#_answer_mathinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eqls(["+", 'x', 'y']);
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components.__math4.state.value.tree).eqls(["+", 'x', 'y']);
    });


    cy.log("Enter partially correct answer")
    cy.get('#_answer_mathinput1_input').clear().type(`x`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eq("x");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components.__math4.state.value.tree).eqls(["+", 'x', 'y']);
    });

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();


    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['_answer_mathinput1'].state.value.tree).eq("x");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq("x");
      expect(components.__math4.state.value.tree).eq("x");
    });


    cy.log("Enter incorrect answer")
    cy.get('#_answer_mathinput1_input').clear().type(`y`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['_answer_mathinput1'].state.value.tree).eq("y");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq("x");
      expect(components.__math4.state.value.tree).eq("x");
    });

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq("y");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq("y");
      expect(components.__math4.state.value.tree).eq("y");
    });

  });

  it('answer sugar from incomplete awards, set to text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer type="text"><award>hello there</award><award credit="0.5"><text>bye</text></award></answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text4').should('have.text', '＿')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });

    cy.log("Type correct answer in")
    cy.get('#_answer_textinput1_input').type(`hello there`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text4').should('have.text', '＿')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });


    cy.log("Press enter to submit")
    cy.get('#_answer_textinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text4').should('have.text', 'hello there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq('hello there');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('hello there');
      expect(components.__text4.state.value).eq('hello there');
    });


    cy.log("Enter partially correct answer")
    cy.get('#_answer_textinput1_input').clear().type(`bye`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'bye');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text4').should('have.text', 'hello there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq("bye");
      expect(components['_answer_textinput1'].state.submittedvalue).eq('hello there');
      expect(components.__text4.state.value).eq('hello there');
    });

    cy.log("Submit answer")
    cy.get('#_answer_textinput1_submit').click();


    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'bye');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__text4').should('have.text', 'bye')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['_answer_textinput1'].state.value).eq("bye");
      expect(components['_answer_textinput1'].state.submittedvalue).eq("bye");
      expect(components.__text4.state.value).eq("bye");
    });


    cy.log("Enter incorrect answer")
    cy.get('#_answer_textinput1_input').clear().type(`y`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__text4').should('have.text', 'bye')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['_answer_textinput1'].state.value).eq("y");
      expect(components['_answer_textinput1'].state.submittedvalue).eq("bye");
      expect(components.__text4.state.value).eq("bye");
    });

    cy.log("Submit answer")
    cy.get('#_answer_textinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text4').should('have.text', 'y')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq("y");
      expect(components['_answer_textinput1'].state.submittedvalue).eq("y");
      expect(components.__text4.state.value).eq("y");
    });

  });

  it('answer sugar from incomplete awards, based on text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer><award>hello there</award><award credit="0.5"><text>bye</text></award></answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text4').should('have.text', '＿')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });

    cy.log("Type correct answer in")
    cy.get('#_answer_textinput1_input').type(`hello there`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text4').should('have.text', '＿')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq('');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('');
    });


    cy.log("Press enter to submit")
    cy.get('#_answer_textinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text4').should('have.text', 'hello there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq('hello there');
      expect(components['_answer_textinput1'].state.submittedvalue).eq('hello there');
      expect(components.__text4.state.value).eq('hello there');
    });


    cy.log("Enter partially correct answer")
    cy.get('#_answer_textinput1_input').clear().type(`bye`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'bye');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text4').should('have.text', 'hello there')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_textinput1'].state.value).eq("bye");
      expect(components['_answer_textinput1'].state.submittedvalue).eq('hello there');
      expect(components.__text4.state.value).eq('hello there');
    });

    cy.log("Submit answer")
    cy.get('#_answer_textinput1_submit').click();


    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'bye');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__text4').should('have.text', 'bye')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['_answer_textinput1'].state.value).eq("bye");
      expect(components['_answer_textinput1'].state.submittedvalue).eq("bye");
      expect(components.__text4.state.value).eq("bye");
    });


    cy.log("Enter incorrect answer")
    cy.get('#_answer_textinput1_input').clear().type(`y`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__text4').should('have.text', 'bye')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['_answer_textinput1'].state.value).eq("y");
      expect(components['_answer_textinput1'].state.submittedvalue).eq("bye");
      expect(components.__text4.state.value).eq("bye");
    });

    cy.log("Submit answer")
    cy.get('#_answer_textinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', 'y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text4').should('have.text', 'y')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_textinput1'].state.value).eq("y");
      expect(components['_answer_textinput1'].state.submittedvalue).eq("y");
      expect(components.__text4.state.value).eq("y");
    });

  });

  it('answer with internal references, incomplete awards', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <answer>
  <award><math>x+y</math></award><award credit="0.5">x</award>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  </answer>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
    });

    cy.log("Type correct answer in")
    cy.get('#_answer_mathinput1_input').type(`x+y`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
    });


    cy.log("Press enter to submit answer")
    cy.get('#_answer_mathinput1_input').type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eqls(["+", 'x', 'y']);
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components.__math4.state.value.tree).eqls(["+", 'x', 'y']);
    });


    cy.log("Enter partially correct answer")
    cy.get('#_answer_mathinput1_input').clear().type(`x`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eq("x");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components.__math4.state.value.tree).eqls(["+", 'x', 'y']);
    });

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();


    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['_answer_mathinput1'].state.value.tree).eq("x");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq("x");
      expect(components.__math4.state.value.tree).eq("x");
    });


    cy.log("Enter incorrect answer")
    cy.get('#_answer_mathinput1_input').clear().type(`y`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['_answer_mathinput1'].state.value.tree).eq("y");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq("x");
      expect(components.__math4.state.value.tree).eq("x");
    });

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_input').type(`{enter}`);


    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq("y");
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq("y");
      expect(components.__math4.state.value.tree).eq("y");
    });

  });

  it('full answer tag', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer>Enter values that sum to <m>3x</m>: <mathinput/> <mathinput/>
  <award><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3x</math></if></award>
  <award credit="0.5"><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3</math></if></award>
  </answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>First submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>First submitted response again: <ref prop="submittedResponse1">_answer1</ref></p>
  <p>Second submitted response: <ref prop="submittedResponse2">_answer1</ref></p>
  <p>Both submitted responses together: <ref prop="submittedResponses">_answer1</ref></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '');
    cy.get('#\\/_mathinput2_input').should('have.value', '');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['/_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
      expect(components['/_mathinput2'].state.value.tree).eq('\uFF3F');
      expect(components['/_mathinput2'].state.submittedvalue.tree).eq('\uFF3F');
    });

    cy.log("Enter a correct answer in")
    cy.get('#\\/_mathinput1_input').type(`x+y`).blur();
    cy.get('#\\/_mathinput2_input').type(`2x-y`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_mathinput1'].state.value.tree).eqls(["+", 'x', 'y']);
      expect(components['/_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eq('\uFF3F');
    });


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_mathinput1'].state.value.tree).eqls(["+", 'x', 'y']);
      expect(components['/_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components.__math5.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math6.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math7.state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components.__math8.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math9.state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
    });


    cy.log("Enter partially correct answer")
    cy.get('#\\/_mathinput1_input').clear().type(`x`).blur();
    cy.get('#\\/_mathinput2_input').clear().type(`3-x`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_mathinput1'].state.value.tree).eq("x");
      expect(components['/_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components.__math5.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math6.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math7.state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components.__math8.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math9.state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['/_mathinput1'].state.value.tree).eq("x");
      expect(components['/_mathinput1'].state.submittedvalue.tree).eq("x");
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math5.state.value.tree).eq("x");
      expect(components.__math6.state.value.tree).eq("x");
      expect(components.__math7.state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math8.state.value.tree).eq("x");
      expect(components.__math9.state.value.tree).eqls(["+", 3, ['-', 'x']]);
    });

    cy.log("Enter incorrect answer")
    cy.get('#\\/_mathinput1_input').clear().type(`y`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['/_mathinput1'].state.value.tree).eq("y");
      expect(components['/_mathinput1'].state.submittedvalue.tree).eq("x");
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math5.state.value.tree).eq("x");
      expect(components.__math6.state.value.tree).eq("x");
      expect(components.__math7.state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math8.state.value.tree).eq("x");
      expect(components.__math9.state.value.tree).eqls(["+", 3, ['-', 'x']]);
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_mathinput1'].state.value.tree).eq("y");
      expect(components['/_mathinput1'].state.submittedvalue.tree).eq("y");
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math5.state.value.tree).eq("y");
      expect(components.__math6.state.value.tree).eq("y");
      expect(components.__math7.state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math8.state.value.tree).eq("y");
      expect(components.__math9.state.value.tree).eqls(["+", 3, ['-', 'x']]);
    });


  });

  it('full answer tag, internal references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <answer>
    <p>Enter values that sum to <m>3x</m>: <mathinput/> <mathinput/></p>
    <award><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3x</math></if></award>
    <award credit="0.5"><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3</math></if></award>
    <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
    <p>First submitted response: <ref prop="submittedResponse">_answer1</ref></p>
    <p>First submitted response again: <ref prop="submittedResponse1">_answer1</ref></p>
    <p>Second submitted response: <ref prop="submittedResponse2">_answer1</ref></p>
    <p>Both submitted responses together: <ref prop="submittedResponses">_answer1</ref></p>
  </answer>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '');
    cy.get('#\\/_mathinput2_input').should('have.value', '');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['/_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
      expect(components['/_mathinput2'].state.value.tree).eq('\uFF3F');
      expect(components['/_mathinput2'].state.submittedvalue.tree).eq('\uFF3F');
    });

    cy.log("Enter a correct answer in")
    cy.get('#\\/_mathinput1_input').type(`x+y`).blur();
    cy.get('#\\/_mathinput2_input').type(`2x-y`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_mathinput1'].state.value.tree).eqls(["+", 'x', 'y']);
      expect(components['/_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eq('\uFF3F');
    });


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_mathinput1'].state.value.tree).eqls(["+", 'x', 'y']);
      expect(components['/_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components.__math5.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math6.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math7.state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components.__math8.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math9.state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
    });


    cy.log("Enter partially correct answer")
    cy.get('#\\/_mathinput1_input').clear().type(`x`).blur();
    cy.get('#\\/_mathinput2_input').clear().type(`3-x`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_mathinput1'].state.value.tree).eq("x");
      expect(components['/_mathinput1'].state.submittedvalue.tree).eqls(["+", 'x', 'y']);
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components.__math5.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math6.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math7.state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(components.__math8.state.value.tree).eqls(["+", 'x', 'y']);
      expect(components.__math9.state.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['/_mathinput1'].state.value.tree).eq("x");
      expect(components['/_mathinput1'].state.submittedvalue.tree).eq("x");
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math5.state.value.tree).eq("x");
      expect(components.__math6.state.value.tree).eq("x");
      expect(components.__math7.state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math8.state.value.tree).eq("x");
      expect(components.__math9.state.value.tree).eqls(["+", 3, ['-', 'x']]);
    });

    cy.log("Enter incorrect answer")
    cy.get('#\\/_mathinput1_input').clear().type(`y`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['/_mathinput1'].state.value.tree).eq("y");
      expect(components['/_mathinput1'].state.submittedvalue.tree).eq("x");
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math5.state.value.tree).eq("x");
      expect(components.__math6.state.value.tree).eq("x");
      expect(components.__math7.state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math8.state.value.tree).eq("x");
      expect(components.__math9.state.value.tree).eqls(["+", 3, ['-', 'x']]);
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_mathinput1'].state.value.tree).eq("y");
      expect(components['/_mathinput1'].state.submittedvalue.tree).eq("y");
      expect(components['/_mathinput2'].state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components['/_mathinput2'].state.submittedvalue.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math5.state.value.tree).eq("y");
      expect(components.__math6.state.value.tree).eq("y");
      expect(components.__math7.state.value.tree).eqls(["+", 3, ['-', 'x']]);
      expect(components.__math8.state.value.tree).eq("y");
      expect(components.__math9.state.value.tree).eqls(["+", 3, ['-', 'x']]);
    });


  });

  it('full answer tag, text inputs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer>Enter rain and snow in either order: <textinput/> <textinput/>
  <award><if><text><ref prop="value">_textinput1</ref> <ref prop="value">_textinput2</ref></text> = <text>rain snow</text></if></award>
  <award><if><text><ref prop="value">_textinput1</ref> <ref prop="value">_textinput2</ref></text> = <text>snow rain</text></if></award>
  <award credit="0.5"><if><ref prop="value">_textinput1</ref> = rain</if></award>
  <award credit="0.5"><if><ref prop="value">_textinput1</ref> = snow</if></award>
  <award credit="0.5"><if><ref prop="value">_textinput2</ref> = rain</if></award>
  <award credit="0.5"><if><ref prop="value">_textinput2</ref> = snow</if></award>
  </answer></p>
  <p>Credit for response: <ref prop="creditAchieved">_answer1</ref></p>
  <p>First submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>First submitted response again: <ref prop="submittedResponse1">_answer1</ref></p>
  <p>Second submitted response: <ref prop="submittedResponse2">_answer1</ref></p>
  <p>Both submitted responses together: <ref prop="submittedResponses">_answer1</ref></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', '');
    cy.get('#\\/_textinput2_input').should('have.value', '');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text9').should('have.text', '＿')
    cy.get('#__text10').should('have.text', '＿')
    cy.get('#__text11').should('have.text', '＿')
    cy.get('#__text12').should('have.text', '＿')
    cy.get('#__text13').should('have.text', '＿')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_textinput1'].state.value).eq('');
      expect(components['/_textinput1'].state.submittedvalue).eq('');
      expect(components['/_textinput2'].state.value).eq('');
      expect(components['/_textinput2'].state.submittedvalue).eq('');
    });

    cy.log("Enter a correct answer in")
    cy.get('#\\/_textinput1_input').type(`rain`).blur();
    cy.get('#\\/_textinput2_input').type(`snow`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__text9').should('have.text', '＿')
    cy.get('#__text10').should('have.text', '＿')
    cy.get('#__text11').should('have.text', '＿')
    cy.get('#__text12').should('have.text', '＿')
    cy.get('#__text13').should('have.text', '＿')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_textinput1'].state.value).eq('rain');
      expect(components['/_textinput1'].state.submittedvalue).eq('');
      expect(components['/_textinput2'].state.value).eq('snow');
      expect(components['/_textinput2'].state.submittedvalue).eq('');
    });


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text9').should('have.text', 'rain')
    cy.get('#__text10').should('have.text', 'rain')
    cy.get('#__text11').should('have.text', 'snow')
    cy.get('#__text12').should('have.text', 'rain')
    cy.get('#__text13').should('have.text', 'snow')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_textinput1'].state.value).eq('rain');
      expect(components['/_textinput1'].state.submittedvalue).eq('rain');
      expect(components['/_textinput2'].state.value).eq('snow');
      expect(components['/_textinput2'].state.submittedvalue).eq('snow');
      expect(components.__text9.state.value).eq('rain');
      expect(components.__text10.state.value).eq('rain');
      expect(components.__text11.state.value).eq('snow');
      expect(components.__text12.state.value).eq('rain');
      expect(components.__text13.state.value).eq('snow');
    });


    cy.log("Enter partially correct answer")
    cy.get('#\\/_textinput2_input').clear().type(`rain`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'rain');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text9').should('have.text', 'rain')
    cy.get('#__text10').should('have.text', 'rain')
    cy.get('#__text11').should('have.text', 'snow')
    cy.get('#__text12').should('have.text', 'rain')
    cy.get('#__text13').should('have.text', 'snow')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_textinput1'].state.value).eq("rain");
      expect(components['/_textinput1'].state.submittedvalue).eq('rain');
      expect(components['/_textinput2'].state.value).eq("rain");
      expect(components['/_textinput2'].state.submittedvalue).eq('snow');
      expect(components.__text9.state.value).eq('rain');
      expect(components.__text10.state.value).eq('rain');
      expect(components.__text11.state.value).eq('snow');
      expect(components.__text12.state.value).eq('rain');
      expect(components.__text13.state.value).eq('snow');
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'rain');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__text9').should('have.text', 'rain')
    cy.get('#__text10').should('have.text', 'rain')
    cy.get('#__text11').should('have.text', 'rain')
    cy.get('#__text12').should('have.text', 'rain')
    cy.get('#__text13').should('have.text', 'rain')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['/_textinput1'].state.value).eq("rain");
      expect(components['/_textinput1'].state.submittedvalue).eq("rain");
      expect(components['/_textinput2'].state.value).eq("rain");
      expect(components['/_textinput2'].state.submittedvalue).eq("rain");
      expect(components.__text9.state.value).eq("rain");
      expect(components.__text10.state.value).eq("rain");
      expect(components.__text11.state.value).eq("rain");
      expect(components.__text12.state.value).eq("rain");
      expect(components.__text13.state.value).eq("rain");
    });

    cy.log("Make correct again");
    cy.get('#\\/_textinput1_input').clear().type(`snow`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'snow');
    cy.get('#\\/_textinput2_input').should('have.value', 'rain');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__text9').should('have.text', 'rain')
    cy.get('#__text10').should('have.text', 'rain')
    cy.get('#__text11').should('have.text', 'rain')
    cy.get('#__text12').should('have.text', 'rain')
    cy.get('#__text13').should('have.text', 'rain')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['/_textinput1'].state.value).eq("snow");
      expect(components['/_textinput1'].state.submittedvalue).eq("rain");
      expect(components['/_textinput2'].state.value).eq("rain");
      expect(components['/_textinput2'].state.submittedvalue).eq("rain");
      expect(components.__text9.state.value).eq("rain");
      expect(components.__text10.state.value).eq("rain");
      expect(components.__text11.state.value).eq("rain");
      expect(components.__text12.state.value).eq("rain");
      expect(components.__text13.state.value).eq("rain");
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'snow');
    cy.get('#\\/_textinput2_input').should('have.value', 'rain');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text9').should('have.text', 'snow')
    cy.get('#__text10').should('have.text', 'snow')
    cy.get('#__text11').should('have.text', 'rain')
    cy.get('#__text12').should('have.text', 'snow')
    cy.get('#__text13').should('have.text', 'rain')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_textinput1'].state.value).eq("snow");
      expect(components['/_textinput1'].state.submittedvalue).eq("snow");
      expect(components['/_textinput2'].state.value).eq("rain");
      expect(components['/_textinput2'].state.submittedvalue).eq("rain");
      expect(components.__text9.state.value).eq("snow");
      expect(components.__text10.state.value).eq("snow");
      expect(components.__text11.state.value).eq("rain");
      expect(components.__text12.state.value).eq("snow");
      expect(components.__text13.state.value).eq("rain");
    });

    cy.log("Enter another partially correct answer")
    cy.get('#\\/_textinput2_input').clear().type(`snow`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'snow');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__text9').should('have.text', 'snow')
    cy.get('#__text10').should('have.text', 'snow')
    cy.get('#__text11').should('have.text', 'rain')
    cy.get('#__text12').should('have.text', 'snow')
    cy.get('#__text13').should('have.text', 'rain')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_textinput1'].state.value).eq("snow");
      expect(components['/_textinput1'].state.submittedvalue).eq("snow");
      expect(components['/_textinput2'].state.value).eq("snow");
      expect(components['/_textinput2'].state.submittedvalue).eq("rain");
      expect(components.__text9.state.value).eq("snow");
      expect(components.__text10.state.value).eq("snow");
      expect(components.__text11.state.value).eq("rain");
      expect(components.__text12.state.value).eq("snow");
      expect(components.__text13.state.value).eq("rain");
    });


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'snow');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });
    cy.get('#__text9').should('have.text', 'snow')
    cy.get('#__text10').should('have.text', 'snow')
    cy.get('#__text11').should('have.text', 'snow')
    cy.get('#__text12').should('have.text', 'snow')
    cy.get('#__text13').should('have.text', 'snow')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['/_textinput1'].state.value).eq("snow");
      expect(components['/_textinput1'].state.submittedvalue).eq("snow");
      expect(components['/_textinput2'].state.value).eq("snow");
      expect(components['/_textinput2'].state.submittedvalue).eq("snow");
      expect(components.__text9.state.value).eq("snow");
      expect(components.__text10.state.value).eq("snow");
      expect(components.__text11.state.value).eq("snow");
      expect(components.__text12.state.value).eq("snow");
      expect(components.__text13.state.value).eq("snow");
    });


    cy.log("Enter incorrect answer")
    cy.get('#\\/_textinput1_input').clear().type(`fog`).blur();
    cy.get('#\\/_textinput2_input').clear().type(`hail`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'fog');
    cy.get('#\\/_textinput2_input').should('have.value', 'hail');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.5')
    });

    cy.get('#__text9').should('have.text', 'snow')
    cy.get('#__text10').should('have.text', 'snow')
    cy.get('#__text11').should('have.text', 'snow')
    cy.get('#__text12').should('have.text', 'snow')
    cy.get('#__text13').should('have.text', 'snow')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['/_textinput1'].state.value).eq("fog");
      expect(components['/_textinput1'].state.submittedvalue).eq("snow");
      expect(components['/_textinput2'].state.value).eq("hail");
      expect(components['/_textinput2'].state.submittedvalue).eq("snow");
      expect(components.__text9.state.value).eq("snow");
      expect(components.__text10.state.value).eq("snow");
      expect(components.__text11.state.value).eq("snow");
      expect(components.__text12.state.value).eq("snow");
      expect(components.__text13.state.value).eq("snow");
    });


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'fog');
    cy.get('#\\/_textinput2_input').should('have.value', 'hail');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });

    cy.get('#__text9').should('have.text', 'fog')
    cy.get('#__text10').should('have.text', 'fog')
    cy.get('#__text11').should('have.text', 'hail')
    cy.get('#__text12').should('have.text', 'fog')
    cy.get('#__text13').should('have.text', 'hail')

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_textinput1'].state.value).eq("fog");
      expect(components['/_textinput1'].state.submittedvalue).eq("fog");
      expect(components['/_textinput2'].state.value).eq("hail");
      expect(components['/_textinput2'].state.submittedvalue).eq("hail");
      expect(components.__text9.state.value).eq("fog");
      expect(components.__text10.state.value).eq("fog");
      expect(components.__text11.state.value).eq("hail");
      expect(components.__text12.state.value).eq("fog");
      expect(components.__text13.state.value).eq("hail");
    });


  });

  it('answer inequalities', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <answer>Enter enter number larger than 5 or less than 2: <mathinput/>
  <award><if><ref prop="value">_mathinput1</ref> > 5</if></award>
  <award><if><ref prop="value">_mathinput1</ref> < <math>2</math></if></award>
  </answer>
  `}, "*");

    });
    cy.get('#\\/_mathinput1_input').should('have.value', '');

    cy.log('Test initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
    });

    cy.log("Submit a correct answer")
    cy.get('#\\/_mathinput1_input').type(`6`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
    });


    cy.log("Submit an incorrect answer")
    cy.get('#\\/_mathinput1_input').clear().type(`5`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
    });


    cy.log("Submit a different correct answer")
    cy.get('#\\/_mathinput1_input').clear().type(`-3`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
    });


    cy.log("Submit a correct answer that must be simplified")
    cy.get('#\\/_mathinput1_input').clear().type(`5xy-5xy+9`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
    });


    cy.log("Submit a non-numerical answer")
    cy.get('#\\/_mathinput1_input').clear().type(`5xy-5xyz+9`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
    });


  });

  it('answer extended inequalities', () => {
    cy.log("Number between -1 and 1, inclusive");
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <answer><mathinput/>
  <award><if>-1 <= <ref prop="value">_mathinput1</ref> <= 1</if></award>
  </answer>
  `}, "*");
    });

    cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers1 = { "1": 1, "-1": 1, "0.5": 1, "1.1": 0, "-2": 0, "x-x": 1, "x": 0 }

    for (let answerString in answers1) {
      cy.get('#\\/_mathinput1_input').clear().type(answerString, { delay: 0 });
      cy.get('#\\/_mathinput1_submit').click();
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].state.creditachieved).eq(answers1[answerString]);
      });
    }

    cy.log("Number between -1 and 1, exclusive");
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <answer><mathinput/>
  <award><if>-1 < <ref prop="value">_mathinput1</ref> < 1</if></award>
  </answer>
  `}, "*");
    });

    cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers2 = { "1": 0, "-1": 0, "0.5": 1, "0.99": 1, "-2": 0, "x-x": 1, "x": 0 }
    for (let answerString in answers2) {
      cy.get('#\\/_mathinput1_input').clear().type(answerString, { delay: 0 });
      cy.get('#\\/_mathinput1_submit').click();
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].state.creditachieved).eq(answers2[answerString]);
      });
    }

    cy.log("Number between -1 and 1, as greater than");
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <answer><mathinput/>
  <award><if>1 > <ref prop="value">_mathinput1</ref> >= -1</if></award>
  </answer>
  `}, "*");
    });

    cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers3 = { "1": 0, "-1": 1, "0.5": 1, "0.99": 1, "-2": 0, "x-x": 1, "x": 0 }

    for (let answerString in answers3) {
      cy.get('#\\/_mathinput1_input').clear().type(answerString, { delay: 0 });
      cy.get('#\\/_mathinput1_submit').click();
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].state.creditachieved).eq(answers3[answerString]);
      });
    }
  });

  it('compound logic', () => {
    cy.log("Number between -1 and 1, inclusive");
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <answer><mathinput/> <mathinput/> <mathinput/>
    <award><if>
      ((<ref prop="value">_mathinput1</ref> = x
      and <ref prop="value">_mathinput2</ref> != <ref prop="value">_mathinput1</ref>)
      or
      (<ref prop="value">_mathinput1</ref> = <math>y</math>
      and <ref prop="value">_mathinput2</ref> != z
      and <ref prop="value">_mathinput2</ref> != q))
      and <ref prop="value">_mathinput3</ref> > 5
   </if></award>
  </answer>
  `}, "*");
    });

    cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers1 = [[1, "x", "z", "6"], [0, "x", "x", "6"], [0, "x", "z", "5"],
    [1, "y", "y", "7"], [0, "y", "z", "7"], [0, "y", "q", "7"], [1, "y", "y^2", "7"],
    [0, "y", "y", "a"]];

    for (let answer of answers1) {
      cy.get('#\\/_mathinput1_input').clear().type(answer[1], { delay: 0 }).blur();
      cy.get('#\\/_mathinput2_input').clear().type(answer[2], { delay: 0 }).blur();
      cy.get('#\\/_mathinput3_input').clear().type(answer[3], { delay: 0 }).blur();
      cy.get('#\\/_answer1_submit').click();
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].state.creditachieved).eq(answer[0]);
      });
    }

  });

  it('answer inside map', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <map>
      <template>
        <p>Enter <m>x^<subsref/></m>: <answer><math>x^<subsref/></math></answer></p>
        <p>Credit achieved: <ref prop="creditAchieved">_answer1</ref></p>
        <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
      </template>
      <substitutions><sequence>1,3</sequence></substitutions>
    </map>
    `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#_answer_mathinput2_input').should('have.value', '');
    cy.get('#_answer_mathinput3_input').should('have.value', '');
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/__map1_0_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
      expect(components['/__map1_1_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput2'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput2'].state.submittedvalue.tree).eq('\uFF3F');
      expect(components['/__map1_2_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput3'].state.value.tree).eq('\uFF3F');
      expect(components['_answer_mathinput3'].state.submittedvalue.tree).eq('\uFF3F');
    });

    cy.log("Enter correct answer in all three blanks")
    cy.get('#_answer_mathinput1_input').type(`x`).blur();
    cy.get('#_answer_mathinput2_input').type(`x^2`).blur();
    cy.get('#_answer_mathinput3_input').type(`x^3`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#_answer_mathinput2_input').should('have.value', 'x^2');
    cy.get('#_answer_mathinput3_input').should('have.value', 'x^3');
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/__map1_0_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('x');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('\uFF3F');
      expect(components['/__map1_1_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput2'].state.value.tree).eqls(['^', 'x', 2]);
      expect(components['_answer_mathinput2'].state.submittedvalue.tree).eq('\uFF3F');
      expect(components['/__map1_2_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput3'].state.value.tree).eqls(['^', 'x', 3]);
      expect(components['_answer_mathinput3'].state.submittedvalue.tree).eq('\uFF3F');
    });

    cy.log("Submit answers")
    cy.get('#_answer_mathinput1_submit').click();
    cy.get('#_answer_mathinput2_submit').click();
    cy.get('#_answer_mathinput3_submit').click();


    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#_answer_mathinput2_input').should('have.value', 'x^2');
    cy.get('#_answer_mathinput3_input').should('have.value', 'x^3');
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x3')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/__map1_0_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eq('x');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('x');
      expect(components['/__map1_1_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput2'].state.value.tree).eqls(['^', 'x', 2]);
      expect(components['_answer_mathinput2'].state.submittedvalue.tree).eqls(['^', 'x', 2]);
      expect(components['/__map1_2_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput3'].state.value.tree).eqls(['^', 'x', 3]);
      expect(components['_answer_mathinput3'].state.submittedvalue.tree).eqls(['^', 'x', 3]);
    });

    cy.log("Enter wrong answers")
    cy.get('#_answer_mathinput1_input').clear().type(`u`).blur();
    cy.get('#_answer_mathinput2_input').clear().type(`v`).blur();
    cy.get('#_answer_mathinput3_input').clear().type(`w`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'u');
    cy.get('#_answer_mathinput2_input').should('have.value', 'v');
    cy.get('#_answer_mathinput3_input').should('have.value', 'w');
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x3')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/__map1_0_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput1'].state.value.tree).eq('u');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('x');
      expect(components['/__map1_1_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput2'].state.value.tree).eq('v');
      expect(components['_answer_mathinput2'].state.submittedvalue.tree).eqls(['^', 'x', 2]);
      expect(components['/__map1_2_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_mathinput3'].state.value.tree).eq('w');
      expect(components['_answer_mathinput3'].state.submittedvalue.tree).eqls(['^', 'x', 3]);
    });


    cy.log("Submit answers")
    cy.get('#_answer_mathinput1_submit').click();
    cy.get('#_answer_mathinput2_submit').click();
    cy.get('#_answer_mathinput3_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'u');
    cy.get('#_answer_mathinput2_input').should('have.value', 'v');
    cy.get('#_answer_mathinput3_input').should('have.value', 'w');
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    });
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    });
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('w')
    });

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/__map1_0_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput1'].state.value.tree).eq('u');
      expect(components['_answer_mathinput1'].state.submittedvalue.tree).eq('u');
      expect(components['/__map1_1_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput2'].state.value.tree).eq('v');
      expect(components['_answer_mathinput2'].state.submittedvalue.tree).eq('v');
      expect(components['/__map1_2_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_mathinput3'].state.value.tree).eq('w');
      expect(components['_answer_mathinput3'].state.submittedvalue.tree).eq('w');
    });


  });

  it('integrated submit buttons', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer>
    <award>x+y</award>
    <award credit="0.3215">x+z</award>
  </answer></p>
  `}, "*");
    });

    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#_answer_mathinput1_input_preview').should('not.be.visible')
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Type correct answer in")
    cy.get('#_answer_mathinput1_input').type(`x+y`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#_answer_mathinput1_input').type(`{enter}`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get('#_answer_mathinput1_submit').should('not.exist');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Add letter")
    cy.get('#_answer_mathinput1_input').type(`z`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+yz');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+yz')
    })
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Delete letter")
    cy.get('#_answer_mathinput1_input').type(`{backspace}`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get('#_answer_mathinput1_submit').should('not.exist');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Delete more")
    cy.get('#_answer_mathinput1_input').type(`{backspace}{backspace}`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Back to correct")
    cy.get('#_answer_mathinput1_input').type(`+y`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get('#_answer_mathinput1_submit').should('not.exist');
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Delete again")
    cy.get('#_answer_mathinput1_input').type(`{backspace}{backspace}`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#_answer_mathinput1_submit').type(`{enter}`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#_answer_mathinput1_input_preview').should('not.be.visible')
    cy.get('#_answer_mathinput1_submit').should('not.exist');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Add letter")
    cy.get('#_answer_mathinput1_input').type(`a`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'xa');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xa')
    })
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Delete letter")
    cy.get('#_answer_mathinput1_input').type(`{backspace}`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#_answer_mathinput1_submit').should('not.exist');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Delete all")
    cy.get('#_answer_mathinput1_input').type(`{backspace}`);
    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#_answer_mathinput1_input_preview').should('not.be.visible')
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');


    cy.log("Restore incorrect submitted answer")
    cy.get('#_answer_mathinput1_input').type(`x`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#_answer_mathinput1_submit').should('not.exist');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Enter partially correct answer")
    cy.get('#_answer_mathinput1_input').type(`+z`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+z');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+z')
    })
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#_answer_mathinput1_submit').click();
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+z');
    cy.get('#_answer_mathinput1_input_preview').should('not.be.visible')
    cy.get('#_answer_mathinput1_submit').should('not.exist');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('have.text', '32 %');

    cy.log("Add letter")
    cy.get('#_answer_mathinput1_input').type(`z`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+zz');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+zz')
    })
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Delete letter")
    cy.get('#_answer_mathinput1_input').type(`{backspace}`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+z');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+z')
    })
    cy.get('#_answer_mathinput1_submit').should('not.exist');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('have.text', '32 %');

    cy.log("Delete more")
    cy.get('#_answer_mathinput1_input').type(`{backspace}{backspace}`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('not.exist');

    cy.log("Back to partial")
    cy.get('#_answer_mathinput1_input').type(`+z`);
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+z');
    cy.get('#_answer_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+z')
    })
    cy.get('#_answer_mathinput1_submit').should('not.exist');
    cy.get('#_answer_mathinput1_correct').should('not.exist');
    cy.get('#_answer_mathinput1_incorrect').should('not.exist');
    cy.get('#_answer_mathinput1_partial').should('have.text', '32 %');

  });

  it('integrated submit buttons, text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer type="text">
    <award>hello there</award>
    <award credit="0.3215">bye</award>
  </answer></p>
  `}, "*");
    });

    cy.get('#_answer_textinput1_input').should('have.value', '');
    cy.get('#_answer_textinput1_submit').should('be.visible');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Type correct answer in")
    cy.get('#_answer_textinput1_input').type(`hello there`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#_answer_textinput1_submit').should('be.visible');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#_answer_textinput1_input').type(`{enter}`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#_answer_textinput1_submit').should('not.exist');
    cy.get('#_answer_textinput1_correct').should('be.visible');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Add letter")
    cy.get('#_answer_textinput1_input').type(`z`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello therez');
    cy.get('#_answer_textinput1_submit').should('be.visible');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Delete letter")
    cy.get('#_answer_textinput1_input').type(`{backspace}`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#_answer_textinput1_submit').should('not.exist');
    cy.get('#_answer_textinput1_correct').should('be.visible');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Delete more")
    cy.get('#_answer_textinput1_input').type(`{backspace}{backspace}`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello the');
    cy.get('#_answer_textinput1_submit').should('be.visible');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Back to correct")
    cy.get('#_answer_textinput1_input').type(`re`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#_answer_textinput1_submit').should('not.exist');
    cy.get('#_answer_textinput1_correct').should('be.visible');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Delete again")
    cy.get('#_answer_textinput1_input').type(`{backspace}{backspace}`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello the');
    cy.get('#_answer_textinput1_submit').should('be.visible');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#_answer_textinput1_submit').type(`{enter}`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello the');
    cy.get('#_answer_textinput1_submit').should('not.exist');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('be.visible');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Add letter")
    cy.get('#_answer_textinput1_input').type(`a`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello thea');
    cy.get('#_answer_textinput1_submit').should('be.visible');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Delete letter")
    cy.get('#_answer_textinput1_input').type(`{backspace}`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello the');
    cy.get('#_answer_textinput1_submit').should('not.exist');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('be.visible');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Delete all")
    cy.get('#_answer_textinput1_input').clear();
    cy.get('#_answer_textinput1_input').should('have.value', '');
    cy.get('#_answer_textinput1_submit').should('be.visible');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');


    cy.log("Restore incorrect submitted answer")
    cy.get('#_answer_textinput1_input').type(`hello the`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello the');
    cy.get('#_answer_textinput1_submit').should('not.exist');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('be.visible');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Enter partially correct answer")
    cy.get('#_answer_textinput1_input').clear().type(`bye`);
    cy.get('#_answer_textinput1_input').should('have.value', 'bye');
    cy.get('#_answer_textinput1_submit').should('be.visible');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#_answer_textinput1_submit').click();
    cy.get('#_answer_textinput1_input').should('have.value', 'bye');
    cy.get('#_answer_textinput1_submit').should('not.exist');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('have.text', '32 %');

    cy.log("Add letter")
    cy.get('#_answer_textinput1_input').type(`z`);
    cy.get('#_answer_textinput1_input').should('have.value', 'byez');
    cy.get('#_answer_textinput1_submit').should('be.visible');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Delete letter")
    cy.get('#_answer_textinput1_input').type(`{backspace}`);
    cy.get('#_answer_textinput1_input').should('have.value', 'bye');
    cy.get('#_answer_textinput1_submit').should('not.exist');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('have.text', '32 %');

    cy.log("Delete more")
    cy.get('#_answer_textinput1_input').type(`{backspace}{backspace}`);
    cy.get('#_answer_textinput1_input').should('have.value', 'b');
    cy.get('#_answer_textinput1_submit').should('be.visible');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('not.exist');

    cy.log("Back to partial")
    cy.get('#_answer_textinput1_input').type(`ye`);
    cy.get('#_answer_textinput1_input').should('have.value', 'bye');
    cy.get('#_answer_textinput1_submit').should('not.exist');
    cy.get('#_answer_textinput1_correct').should('not.exist');
    cy.get('#_answer_textinput1_incorrect').should('not.exist');
    cy.get('#_answer_textinput1_partial').should('have.text', '32 %');

  });

  it('submit buttons with two answer blanks', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p><answer>Enter values that sum to <m>3x</m>: <mathinput/> <mathinput/>
  <award><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3x</math></if></award>
  <award credit="0.5"><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3</math></if></award>
  </answer></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '');
    cy.get('#\\/_mathinput2_input').should('have.value', '');
    cy.get('#\\/_mathinput1_input_preview').should('not.be.visible')
    cy.get('#\\/_mathinput2_input_preview').should('not.be.visible')
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Enter first part of a correct answer")
    cy.get('#\\/_mathinput1_input').type(`x+y`);
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '');
    cy.get('#\\/_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get('#\\/_mathinput2_input_preview').should('not.be.visible')


    cy.log("Enter second part of a correct answer")
    cy.get('#\\/_mathinput1_input').blur();
    cy.get('#\\/_mathinput2_input').type(`2x-y`)
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#\\/_mathinput1_input_preview').should('not.be.visible')
    cy.get('#\\/_mathinput2_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    })
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Submit answer")
    cy.get('#\\/_mathinput2_input').blur();
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#\\/_mathinput1_input_preview').should('not.be.visible')
    cy.get('#\\/_mathinput2_input_preview').should('not.be.visible')
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Type letter in input1")
    cy.get('#\\/_mathinput1_input').type('z');
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+yz');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#\\/_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+yz')
    })
    cy.get('#\\/_mathinput2_input_preview').should('not.be.visible')
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Delete letter")
    cy.get('#\\/_mathinput1_input').type('{backspace}');
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#\\/_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get('#\\/_mathinput2_input_preview').should('not.be.visible')
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Type letter in input2")
    cy.get('#\\/_mathinput1_input').blur();
    cy.get('#\\/_mathinput2_input').type('q');
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-yq');
    cy.get('#\\/_mathinput1_input_preview').should('not.be.visible')
    cy.get('#\\/_mathinput2_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−yq')
    })
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Delete letter")
    cy.get('#\\/_mathinput2_input').type('{backspace}');
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#\\/_mathinput1_input_preview').should('not.be.visible')
    cy.get('#\\/_mathinput2_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    })
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');



    cy.log("Type letter in input1")
    cy.get('#\\/_mathinput1_input').type('z');
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+yz');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#\\/_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+yz')
    })
    cy.get('#\\/_mathinput2_input_preview').should('not.be.visible')
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Type letter in input2")
    cy.get('#\\/_mathinput1_input').blur();
    cy.get('#\\/_mathinput2_input').type('q');
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+yz');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-yq');
    cy.get('#\\/_mathinput1_input_preview').should('not.be.visible')
    cy.get('#\\/_mathinput2_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−yq')
    })
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Delete letter in input1")
    cy.get('#\\/_mathinput1_input').type('{backspace}');
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-yq');
    cy.get('#\\/_mathinput1_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get('#\\/_mathinput2_input_preview').should('not.be.visible')
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Lost track this is correct answer")
    // It'd be even better if we didn't lose track that we have the correct answer
    // so that answer1_correct says correct.
    // But this is the current behavior, which is OK.
    cy.get('#\\/_mathinput1_input').blur();
    cy.get('#\\/_mathinput2_input').type('{backspace}');
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#\\/_mathinput1_input_preview').should('not.be.visible')
    cy.get('#\\/_mathinput2_input_preview .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    })
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer again")
    cy.get('#\\/_mathinput2_input').blur();
    cy.get('#\\/_answer1_submit').type('{enter}');
    cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');
    cy.get('#\\/_mathinput1_input_preview').should('not.be.visible')
    cy.get('#\\/_mathinput2_input_preview').should('not.be.visible')
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Enter partially correct answer")
    cy.get('#\\/_mathinput1_input').clear().type(`x`).blur();
    cy.get('#\\/_mathinput2_input').clear().type(`3-x`).blur();
    cy.get('#\\/_mathinput1_input').should('have.value', 'x');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_mathinput1_input').should('have.value', 'x');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })


    cy.log("Delete letter in input1")
    cy.get('#\\/_mathinput1_input').type('{backspace}');
    cy.get('#\\/_mathinput1_input').should('have.value', '');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Add letter back")
    cy.get('#\\/_mathinput1_input').type('x');
    cy.get('#\\/_mathinput1_input').should('have.value', 'x');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })



    cy.log("Enter incorrect answer")
    cy.get('#\\/_mathinput1_input').clear().type(`y`).blur();
    cy.get('#\\/_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    });
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').type("{enter}");
    cy.get('#\\/_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Delete letter in input2")
    cy.get('#\\/_mathinput2_input').type('{backspace}');
    cy.get('#\\/_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Add letter back")
    cy.get('#\\/_mathinput2_input').type('x');
    cy.get('#\\/_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_mathinput2_input').should('have.value', '3-x');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');

  });

  it('submit buttons with two text answer blanks', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
        <p><answer>Enter rain and snow in either order: <textinput/> <textinput/>
        <award><if><text><ref prop="value">_textinput1</ref> <ref prop="value">_textinput2</ref></text> = <text>rain snow</text></if></award>
        <award><if><text><ref prop="value">_textinput1</ref> <ref prop="value">_textinput2</ref></text> = <text>snow rain</text></if></award>
        <award credit="0.5"><if><ref prop="value">_textinput1</ref> = rain</if></award>
        <award credit="0.5"><if><ref prop="value">_textinput1</ref> = snow</if></award>
        <award credit="0.5"><if><ref prop="value">_textinput2</ref> = rain</if></award>
        <award credit="0.5"><if><ref prop="value">_textinput2</ref> = snow</if></award>
        </answer></p>
  `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', '');
    cy.get('#\\/_textinput2_input').should('have.value', '');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Enter a correct answer")
    cy.get('#\\/_textinput1_input').type(`rain`);
    cy.get('#\\/_textinput2_input').type(`snow`).blur();
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Type letter in input1")
    cy.get('#\\/_textinput1_input').type('z');
    cy.get('#\\/_textinput1_input').should('have.value', 'rainz');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Delete letter")
    cy.get('#\\/_textinput1_input').type('{backspace}');
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Type letter in input2")
    cy.get('#\\/_textinput1_input').blur();
    cy.get('#\\/_textinput2_input').type('q');
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snowq');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Delete letter")
    cy.get('#\\/_textinput2_input').type('{backspace}');
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Type letter in input1")
    cy.get('#\\/_textinput1_input').type('z');
    cy.get('#\\/_textinput1_input').should('have.value', 'rainz');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Type letter in input2")
    cy.get('#\\/_textinput2_input').type('q');
    cy.get('#\\/_textinput1_input').should('have.value', 'rainz');
    cy.get('#\\/_textinput2_input').should('have.value', 'snowq');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Delete letter in input1")
    cy.get('#\\/_textinput1_input').type('{backspace}');
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snowq');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Lost track this is correct answer")
    // It'd be even better if we didn't lose track that we have the correct answer
    // so that answer1_correct says correct.
    // But this is the current behavior, which is OK.
    cy.get('#\\/_textinput2_input').type('{backspace}');
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer again")
    cy.get('#\\/_answer1_submit').type('{enter}');
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Enter partially correct answer")
    cy.get('#\\/_textinput1_input').clear().type(`x`).blur();
    cy.get('#\\/_textinput1_input').should('have.value', 'x');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_textinput1_input').should('have.value', 'x');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })


    cy.log("Delete letter in input2")
    cy.get('#\\/_textinput2_input').type('{backspace}');
    cy.get('#\\/_textinput1_input').should('have.value', 'x');
    cy.get('#\\/_textinput2_input').should('have.value', 'sno');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Add letter back")
    cy.get('#\\/_textinput2_input').type('w');
    cy.get('#\\/_textinput1_input').should('have.value', 'x');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })


    cy.log("Enter incorrect answer")
    cy.get('#\\/_textinput2_input').clear().type(`y`).blur();
    cy.get('#\\/_textinput1_input').should('have.value', 'x');
    cy.get('#\\/_textinput2_input').should('have.value', 'y');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    });
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').type("{enter}");
    cy.get('#\\/_textinput1_input').should('have.value', 'x');
    cy.get('#\\/_textinput2_input').should('have.value', 'y');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Delete letter in input2")
    cy.get('#\\/_textinput2_input').type('{backspace}');
    cy.get('#\\/_textinput1_input').should('have.value', 'x');
    cy.get('#\\/_textinput2_input').should('have.value', '');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Add letter back")
    cy.get('#\\/_textinput2_input').type('y');
    cy.get('#\\/_textinput1_input').should('have.value', 'x');
    cy.get('#\\/_textinput2_input').should('have.value', 'y');
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');

  });

  it('submit button with external inputs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <p>Favorite variable: <mathinput name="var" prefill="x"/></p>
    <p>Second favorite variable: <mathinput name="var2" prefill="y"/></p>
    <p>Enter variable:
    <answer>
      <mathinput name="ans"/>
      <award><if><ref prop="value">ans</ref> = <ref prop="value">var</ref></if></award>
      <award credit="0.5"><if><ref prop="value">ans</ref> = <ref prop="value">var2</ref></if></award>
    </answer>
    </p>
  `}, "*");
    });

    cy.get('#\\/var_input').should('have.value', 'x');
    cy.get('#\\/var2_input').should('have.value', 'y');
    cy.get('#\\/ans_input').should('have.value', '');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Type correct answer in")
    cy.get('#\\/ans_input').type(`x`);
    cy.get('#\\/ans_input').should('have.value', 'x');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans_input').type(`{enter}`);
    cy.get('#\\/ans_input').should('have.value', 'x');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Change correct answer");
    cy.get('#\\/var_input').clear().type(`u{enter}`);
    cy.get('#\\/var_input').should('have.value', 'u');
    cy.get('#\\/ans_input').should('have.value', 'x');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans_input').type(`{enter}`);
    cy.get('#\\/ans_input').should('have.value', 'x');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('be.visible');
    cy.get('#\\/ans_partial').should('not.exist');


    cy.log("Change to new correct answer")
    cy.get('#\\/ans_input').clear().type(`u`);
    cy.get('#\\/ans_input').should('have.value', 'u');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans_input').type(`{enter}`);
    cy.get('#\\/ans_input').should('have.value', 'u');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Change partial credit answer");
    cy.get('#\\/var2_input').clear().type(`v{enter}`);
    cy.get('#\\/var2_input').should('have.value', 'v');
    cy.get('#\\/var_input').should('have.value', 'u');
    cy.get('#\\/ans_input').should('have.value', 'u');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans_input').type(`{enter}`);
    cy.get('#\\/ans_input').should('have.value', 'u');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');


    cy.log("Change to new partial correct answer")
    cy.get('#\\/ans_input').clear().type(`v`);
    cy.get('#\\/ans_input').should('have.value', 'v');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans_input').type(`{enter}`);
    cy.get('#\\/ans_input').should('have.value', 'v');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('be.visible');


    cy.log("Change correct answer");
    cy.get('#\\/var_input').clear().type(`w{enter}`);
    cy.get('#\\/var_input').should('have.value', 'w');
    cy.get('#\\/ans_input').should('have.value', 'v');
    cy.get('#\\/var2_input').should('have.value', 'v');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans_input').type(`{enter}`);
    cy.get('#\\/ans_input').should('have.value', 'v');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('be.visible');


    cy.log("Change to new correct answer")
    cy.get('#\\/ans_input').clear().type(`w`);
    cy.get('#\\/ans_input').should('have.value', 'w');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans_input').type(`{enter}`);
    cy.get('#\\/ans_input').should('have.value', 'w');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

  });

  it('answer with inline choiceinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p>The animal is a <answer>
  <choiceinput inline>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>.</p>
  `}, "*");
    });

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    let indexByName = {};
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].state.choicetexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls([]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').select(`dog`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').select(`cat`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50 %');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["cat"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([1]);
    });

  });

  it('answer with inline choiceinput, fixedorder', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p>The animal is a <answer>
  <choiceinput inline fixedorder>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>.</p>
  `}, "*");
    });

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get('#\\/_choiceinput1').should('have.text', 'catdogmonkey');

    let indexByName = {cat: 1, dog: 2, monkey: 3};
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].state.choicetexts.entries()) {
        expect(indexByName[val]).eq(ind+1);
      }

      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls([]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').select(`dog`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').select(`cat`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50 %');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["cat"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([1]);
    });

  });

  it('answer with sugared inline choiceinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p>The animal is a <answer inline>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </answer>.</p>
  `}, "*");
    });

    cy.get('#_answer_choiceinput1').should('have.value', '');
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    let indexByName = {};
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['_answer_choiceinput1'].state.choicetexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls([]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#_answer_choiceinput1').select(`dog`);
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('be.visible');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Select incorrect answer")
    cy.get('#_answer_choiceinput1').select(`monkey`);
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Press enter on submit button")
    cy.get('#_answer_choiceinput1_submit').type(`{enter}`);
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('be.visible');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Select partially correct answer")
    cy.get('#_answer_choiceinput1').select(`cat`);
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Press enter on submit button")
    cy.get('#_answer_choiceinput1_submit').type(`{enter}`);
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('have.text', '50 %');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["cat"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["cat"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([1]);
    });

  });

  it('answer with sugared inline choiceinput, fixedorder', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p>The animal is a <answer inline fixedorder>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </answer>.</p>
  `}, "*");
    });

    cy.get('#_answer_choiceinput1').should('have.value', '');
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.get('#_answer_choiceinput1').should('have.text', 'catdogmonkey');

    let indexByName = {cat: 1, dog: 2, monkey: 3};

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['_answer_choiceinput1'].state.choicetexts.entries()) {
        expect(indexByName[val]).eq(ind+1);
      }

      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls([]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#_answer_choiceinput1').select(`dog`);
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('be.visible');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Select incorrect answer")
    cy.get('#_answer_choiceinput1').select(`monkey`);
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Press enter on submit button")
    cy.get('#_answer_choiceinput1_submit').type(`{enter}`);
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('be.visible');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Select partially correct answer")
    cy.get('#_answer_choiceinput1').select(`cat`);
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Press enter on submit button")
    cy.get('#_answer_choiceinput1_submit').type(`{enter}`);
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('have.text', '50 %');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["cat"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["cat"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([1]);
    });

  });

  it('answer with block choiceinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p>The animal is a:</p>
  <answer>
  <choiceinput>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>
  `}, "*");
    });

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    let indexByName = {};
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].state.choicetexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls([]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').contains(`dog`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').contains(`monkey`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['/_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['/_choiceinput1'].state.submittedvalues).eqls(["cat"]);
      expect(components['/_choiceinput1'].state.submittedindices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].state.submittedoriginalindices).eqls([1]);
    });

  });

  it('answer with sugared block choiceinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p>The animal is a:</p>
  <answer>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </answer>
  `}, "*");
    });

    cy.get('#_answer_choiceinput1').should('have.value', '');
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    let indexByName = {};
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['_answer_choiceinput1'].state.choicetexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls([]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#_answer_choiceinput1').contains(`dog`).click({ force: true });
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([2]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Select incorrect answer")
    cy.get('#_answer_choiceinput1').contains(`monkey`).click({ force: true });
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(1);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["dog"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["dog"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([2]);
    });

    cy.log("Press enter on submit button")
    cy.get('#_answer_choiceinput1_submit').type(`{enter}`);
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([3]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Select partially correct answer")
    cy.get('#_answer_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["monkey"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["monkey"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([3]);
    });

    cy.log("Press enter on submit button")
    cy.get('#_answer_choiceinput1_submit').type(`{enter}`);
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].state.creditachieved).eq(0.5);
      expect(components['_answer_choiceinput1'].state.selectedvalues).eqls(["cat"]);
      expect(components['_answer_choiceinput1'].state.selectedindices).eqls([indexByName["cat"]]);
      expect(components['_answer_choiceinput1'].state.selectedoriginalindices).eqls([1]);
      expect(components['_answer_choiceinput1'].state.submittedvalues).eqls(["cat"]);
      expect(components['_answer_choiceinput1'].state.submittedindices).eqls([indexByName["cat"]]);
      expect(components['_answer_choiceinput1'].state.submittedoriginalindices).eqls([1]);
    });

  });

  it('answer with variable number of choices', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <p>Num: <mathinput name="num" prefill="3"/></p>

    <answer>
    <choiceinput>
      <map>
        <template>
          <choice><credit><subsref/></credit>Get <subsref displaydigits="3"/>, plus a bit is <math displaydigits="3" simplify><subsref/>+0.001</math></choice>
        </template>
        <substitutions>
          <sequence from="0" to="1"><count><ref prop="value">num</ref></count></sequence>
        </substitutions>
      </map>
    </choiceinput>
    </answer>
  `}, "*");
    });

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_choiceinput1'].state.choicetexts.length).eq(3);
    })

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 1`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').contains(`plus a bit is 0.001`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 0.5`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("add another choice");
    cy.get("#\\/num_input").clear().type("4{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_choiceinput1'].state.choicetexts.length).eq(4);
    })

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 1`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').contains(`plus a bit is 0.001`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 0.333`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })

    cy.log("Select another partially correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 0.667`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })


    cy.log("go back to 3 choices")
    cy.get("#\\/num_input").clear().type("3{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_choiceinput1'].state.choicetexts.length).eq(3);
    })

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 1`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').contains(`plus a bit is 0.001`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 0.5`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })


    cy.log("create 6 choices");
    cy.get("#\\/num_input").clear().type("6{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_choiceinput1'].state.choicetexts.length).eq(6);
    })

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 1`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').contains(`plus a bit is 0.001`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 0.2`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('20% correct')
    })

    cy.log("Select another partially correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 0.4`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.log("Select another partially correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 0.6`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('60% correct')
    })

    cy.log("Select another partially correct answer")
    cy.get('#\\/_choiceinput1').contains(`Get 0.8`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`);
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('80% correct')
    })


  });

  it('answer with user-defined choice and credit', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
      <p>Credit for cat: <mathinput name="catcredit" prefill="0.3" /> </p>
      <p>Last option: <textinput prefill="bird" name="last" /></p>
      <answer>
        <choice><credit><ref prop="value">catcredit</ref></credit>cat</choice>
        <choice credit="1">dog</choice>
        <choice>monkey</choice>
        <choice><ref prop="value">last</ref></choice>
      </answer>
  `}, "*");
    });

    cy.get('#_answer_choiceinput1').should('have.value', '');
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Select correct answer")
    cy.get('#_answer_choiceinput1').contains(`dog`).click({ force: true });
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log('Change partial credit for cat')
    cy.get('#\\/catcredit_input').clear().type('0.4{enter}')
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log('Change last choice')
    cy.get('#\\/last_input').clear().type('mouse{enter}')
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');


    cy.log("Select partially correct answer")
    cy.get('#_answer_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#_answer_choiceinput1_submit').type(`{enter}`);
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.log('Change partial credit for cat')
    cy.get('#\\/catcredit_input').clear().type('0.2{enter}')
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('20% correct')
    })


    cy.log("Select variable answer")
    cy.get('#_answer_choiceinput1').contains(`mouse`).click({ force: true });
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Press enter on submit button")
    cy.get('#_answer_choiceinput1_submit').type(`{enter}`);
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log('Change animal name')
    cy.get('#\\/last_input').clear().type('rabbit{enter}')
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

  });

  it('switch answer between inline and block', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
      <p>Inline: <booleaninput name="inline" /> </p>
      <answer>
        <inline><ref prop="value">inline</ref></inline>
        <choice credit="0.5">cat</choice>
        <choice credit="1">dog</choice>
        <choice>monkey</choice>
      </answer>
  `}, "*");
    });

    cy.get('#_answer_choiceinput1').should('have.value', '');
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("toggle inline")
    cy.get('#\\/inline_input').click();
    cy.get('#_answer_choiceinput1').should('have.value', '');
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Select correct answer")
    cy.get('#_answer_choiceinput1').select(`dog`);
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('be.visible');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("toggle inline")
    cy.get('#\\/inline_input').click();
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log('Select partial credit answer')
    cy.get('#_answer_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#_answer_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("toggle inline")
    cy.get('#\\/inline_input').click();
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('not.exist');

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_submit').should('not.exist');
    cy.get('#_answer_choiceinput1_correct').should('not.exist');
    cy.get('#_answer_choiceinput1_incorrect').should('not.exist');
    cy.get('#_answer_choiceinput1_partial').should('have.text', '50 %');

  });

  it('answer math from one string, split into options', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p>All three: <answer>x+y, (x+y)/2, (x,y)</answer></p>
  <p>Individuals: <answer splitintooptions>x+y, (x+y)/2, (x,y)</answer></p>
  <p>Credit for response 1: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response 1: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for response 2: <ref prop="creditAchieved">_answer2</ref></p>
  <p>Submitted response 2: <ref prop="submittedResponse">_answer2</ref></p>
 `}, "*");
    });

    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#_answer_mathinput2_input').should('have.value', '');
    cy.get('#\\/_p3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/_p5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log("Enter first part")
    cy.get('#_answer_mathinput1_input').type(`x+y{enter}`);
    cy.get('#_answer_mathinput2_input').type(`x+y{enter}`);

    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#_answer_mathinput2_input').should('have.value', 'x+y');
    cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/_p6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log("Enter second part")
    cy.get('#_answer_mathinput1_input').clear().type(`x/2+y/2{enter}`);
    cy.get('#_answer_mathinput2_input').clear().type(`x/2+y/2{enter}`);

    cy.get('#_answer_mathinput1_input').should('have.value', 'x/2+y/2');
    cy.get('#_answer_mathinput2_input').should('have.value', 'x/2+y/2');
    cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2+y2')
    });
    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/_p6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2+y2')
    });

    cy.log("Enter third part")
    cy.get('#_answer_mathinput1_input').clear().type(`(x, y )  {enter}`);
    cy.get('#_answer_mathinput2_input').clear().type(`(x, y )  {enter}`);

    cy.get('#_answer_mathinput1_input').should('have.value', '(x, y )  ');
    cy.get('#_answer_mathinput2_input').should('have.value', '(x, y )  ');
    cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y)')
    });
    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/_p6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y)')
    });


    cy.log("Enter all parts")
    cy.get('#_answer_mathinput1_input').clear().type(`x+ y, x/2 +y/2,(x, y )  {enter}`);
    cy.get('#_answer_mathinput2_input').clear().type(`x+ y, x/2 +y/2,(x, y )  {enter}`);

    cy.get('#_answer_mathinput1_input').should('have.value', 'x+ y, x/2 +y/2,(x, y )  ');
    cy.get('#_answer_mathinput2_input').should('have.value', 'x+ y, x/2 +y/2,(x, y )  ');
    cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y,x2+y2,(x,y)')
    });
    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y,x2+y2,(x,y)')
    });

  });

  it('answer text from one string, split into options', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p>All three: <answer type="text">hello there, doenet, (we're almost here, but not quite)</answer></p>
  <p>Individuals: <answer type="text" splitintooptions>hello there, doenet, (we're almost here, but not quite)</answer></p>
  <p>Credit for response 1: <ref prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response 1: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for response 2: <ref prop="creditAchieved">_answer2</ref></p>
  <p>Submitted response 2: <ref prop="submittedResponse">_answer2</ref></p>
 `}, "*");
    });

    cy.get('#_answer_textinput1_input').should('have.value', '');
    cy.get('#_answer_textinput2_input').should('have.value', '');
    cy.get('#\\/_p3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p4').should('have.text', 'Submitted response 1: ＿')
    cy.get('#\\/_p5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p6').should('have.text', 'Submitted response 2: ＿')


    cy.log("Enter first part")
    cy.get('#_answer_textinput1_input').type(` hello there   {enter}`);
    cy.get('#_answer_textinput2_input').type(` hello there   {enter}`);

    cy.get('#_answer_textinput1_input').should('have.value', ' hello there   ');
    cy.get('#_answer_textinput2_input').should('have.value', ' hello there   ');
    cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p4').should('have.text', 'Submitted response 1:  hello there   ')
    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/_p6').should('have.text', 'Submitted response 2:  hello there   ')

    cy.log("Enter second part")
    cy.get('#_answer_textinput1_input').clear().type(`doenet {enter}`);
    cy.get('#_answer_textinput2_input').clear().type(`doenet {enter}`);

    cy.get('#_answer_textinput1_input').should('have.value', 'doenet ');
    cy.get('#_answer_textinput2_input').should('have.value', 'doenet ');
    cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p4').should('have.text', 'Submitted response 1: doenet ')
    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/_p6').should('have.text', 'Submitted response 2: doenet ')

    cy.log("Enter third part")
    cy.get('#_answer_textinput1_input').clear().type(`(we're almost here, but not quite)  {enter}`);
    cy.get('#_answer_textinput2_input').clear().type(`(we're almost here, but not quite)  {enter}`);

    cy.get('#_answer_textinput1_input').should('have.value', `(we're almost here, but not quite)  `);
    cy.get('#_answer_textinput2_input').should('have.value', `(we're almost here, but not quite)  `);
    cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p4').should('have.text', `Submitted response 1: (we're almost here, but not quite)  `)
    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/_p6').should('have.text', `Submitted response 2: (we're almost here, but not quite)  `)

    cy.log("Enter all parts")
    cy.get('#_answer_textinput1_input').clear().type(`  hello there, doenet, (we're almost here, but not quite)    {enter}`);
    cy.get('#_answer_textinput2_input').clear().type(`  hello there, doenet, (we're almost here, but not quite)    {enter}`);

    cy.get('#_answer_textinput1_input').should('have.value', `  hello there, doenet, (we're almost here, but not quite)    `);
    cy.get('#_answer_textinput2_input').should('have.value', `  hello there, doenet, (we're almost here, but not quite)    `);
    cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/_p4').should('have.text', `Submitted response 1:   hello there, doenet, (we're almost here, but not quite)    `)
    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p6').should('have.text', `Submitted response 2:   hello there, doenet, (we're almost here, but not quite)    `)

  });

  it('answer with incomplete awards, split into options', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <p>Only split: <answer splitintooptions>a,b,c</answer></p>
  <p>Option specified in award:
  <answer>
    <award splitintooptions>a,b,c</award>
    <award>f,g</award>
  </answer>
  </p>
  <p>Option specified in answer:
  <answer splitintooptions>
    <award>a,b,c</award>
    <award splitintooptions="false">f,g</award>
  </answer>
  </p>
 `}, "*");
    });

    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#_answer_mathinput2_input').should('have.value', '');
    cy.get('#_answer_mathinput3_input').should('have.value', '');
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#_answer_mathinput2_submit').should('be.visible');
    cy.get('#_answer_mathinput3_submit').should('be.visible');

    cy.log("Enter first option")
    cy.get('#_answer_mathinput1_input').clear().type(`a{enter}`);
    cy.get('#_answer_mathinput2_input').clear().type(`a{enter}`);
    cy.get('#_answer_mathinput3_input').clear().type(`a{enter}`);
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_correct').should('be.visible');

    cy.log("Enter second option")
    cy.get('#_answer_mathinput1_input').clear().type(`b{enter}`);
    cy.get('#_answer_mathinput2_input').clear().type(`b{enter}`);
    cy.get('#_answer_mathinput3_input').clear().type(`b{enter}`);
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_correct').should('be.visible');

    cy.log("Enter third option")
    cy.get('#_answer_mathinput1_input').clear().type(`c{enter}`);
    cy.get('#_answer_mathinput2_input').clear().type(`c{enter}`);
    cy.get('#_answer_mathinput3_input').clear().type(`c{enter}`);
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_correct').should('be.visible');

    cy.log("Enter options as a whole")
    cy.get('#_answer_mathinput1_input').clear().type(`a,b,c{enter}`);
    cy.get('#_answer_mathinput2_input').clear().type(`a,b,c{enter}`);
    cy.get('#_answer_mathinput3_input').clear().type(`a,b,c{enter}`);
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');

    cy.log("Enter first of unsplit group")
    cy.get('#_answer_mathinput2_input').clear().type(`f{enter}`);
    cy.get('#_answer_mathinput3_input').clear().type(`f{enter}`);
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');

    cy.log("Enter second of unsplit group")
    cy.get('#_answer_mathinput2_input').clear().type(`g{enter}`);
    cy.get('#_answer_mathinput3_input').clear().type(`g{enter}`);
    cy.get('#_answer_mathinput2_incorrect').should('be.visible');
    cy.get('#_answer_mathinput3_incorrect').should('be.visible');

    cy.log("Enter entire unsplit group")
    cy.get('#_answer_mathinput2_input').clear().type(`f,g{enter}`);
    cy.get('#_answer_mathinput3_input').clear().type(`f,g{enter}`);
    cy.get('#_answer_mathinput2_correct').should('be.visible');
    cy.get('#_answer_mathinput3_correct').should('be.visible');


  });

  it('answer, any letter', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `

  <p>Enter any letter:
  <answer size='3' name='userx'>
  <mathinput name="userx_input"/>
  <award><if>
    <ref prop="value">userx_input</ref> elementof {a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z}
    </if>
  </award>
  </answer>
  </p>

 `}, "*");
    });

    cy.get('#\\/userx_input_input').should('have.value', '');
    cy.get('#\\/userx_input_submit').should('be.visible');

    cy.log("Enter a letter")
    cy.get('#\\/userx_input_input').clear().type(`a{enter}`);
    cy.get('#\\/userx_input_correct').should('be.visible');

    cy.log("Enter letter combination")
    cy.get('#\\/userx_input_input').clear().type(`c,d{enter}`);
    cy.get('#\\/userx_input_incorrect').should('be.visible');

    cy.log("Enter another letter")
    cy.get('#\\/userx_input_input').clear().type(`q{enter}`);
    cy.get('#\\/userx_input_correct').should('be.visible');

    cy.log("Enter a number")
    cy.get('#\\/userx_input_input').clear().type(`1{enter}`);
    cy.get('#\\/userx_input_incorrect').should('be.visible');
  });

  it('answer element of user defined set', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `

  <p>Enter a set <mathinput name="set" prefill="{1,2,3}" size="20"/></p>
  <p>Enter an element of that set: 
  <answer>
  <mathinput name="element" />
  <award>
    <if><ref prop="value">element</ref> elementof <ref prop="value">set</ref></if>
  </award>
  </answer>
  </p>
 `}, "*");
    });

    cy.get('#\\/element_input').should('have.value', '');
    cy.get('#\\/set_input').should('have.value', '{ 1, 2, 3 }');
    cy.get('#\\/element_submit').should('be.visible');

    cy.log("Enter a number from set")
    cy.get('#\\/element_input').clear().type(`2{enter}`);
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter all numbers from set")
    cy.get('#\\/element_input').clear().type(`1,2,3{enter}`);
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Enter a letter")
    cy.get('#\\/element_input').clear().type(`c{enter}`);
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Change set to letters")
    cy.get('#\\/set_input').clear().type(`{{}a,b,c,d,e,f,g}{enter}`);
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter another letter")
    cy.get('#\\/element_input').clear().type(`g{enter}`);
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter a number")
    cy.get('#\\/element_input').clear().type(`2{enter}`);
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Change set to mathematical expressions")
    cy.get('#\\/set_input').clear().type(`{{} (x+y)/2, e^(x^2 + y), (1,2,3)}{enter}`);
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Enter one of the expressions")
    cy.get('#\\/element_input').clear().type(`(1,2,3){enter}`);
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter another of the expressions")
    cy.get('#\\/element_input').clear().type(`e^(x^2)e^(y){enter}`);
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter third expression")
    cy.get('#\\/element_input').clear().type(`x+2y-x/2-3y/2{enter}`);
    cy.get('#\\/element_correct').should('be.visible');


  });

})
