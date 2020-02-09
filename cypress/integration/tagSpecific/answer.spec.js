describe('Answer Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('answer sugar from one string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer>x+y</answer></p>
  <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for submitted response: <ref prop="creditAchieved">_answer1</ref></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let math1 = components['/_ref1'].replacements[0];
      let math1Anchor = '#' + math1.componentName;
      let math2 = components['/_ref2'].replacements[0];
      let math2Anchor = '#' + math2.componentName;
      let number1 = components['/_ref3'].replacements[0];
      let number1Anchor = '#' + number1.componentName;

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['\uFF3F']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).clear().type(`x`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components[mathinputName].stateValues.value.tree).eqls('x');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
      });

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['x']);
        expect(components[mathinputName].stateValues.value.tree).eqls('x');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
      });

    })
  });

  it('answer sugar from one string, set to text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer type="text">hello there</answer></p>
  <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for submitted response: <ref prop="creditAchieved">_answer1</ref></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let textinputAnchor = '#' + textinputName + '_input';
      let textinputSubmitAnchor = '#' + textinputName + '_submit';
      let text1 = components['/_ref1'].replacements[0];
      let text1Anchor = '#' + text1.componentName;
      let text2 = components['/_ref2'].replacements[0];
      let text2Anchor = '#' + text2.componentName;
      let number1 = components['/_ref3'].replacements[0];
      let number1Anchor = '#' + number1.componentName;

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq('');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get(text1Anchor).should('have.text', 'hello  there')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq('hello  there');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get(text1Anchor).should('have.text', 'hello  there')
      cy.get(text2Anchor).should('have.text', 'hello  there')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(components[textinputName].stateValues.value).eq('hello  there');
        expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    })
  });

  it('answer sugar from one string, set to text, initially unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer><type><ref>t1</ref></type>hello there</answer></p>
  <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for submitted response: <ref prop="creditAchieved">_answer1</ref></p>
  
  <p><ref name="t1">t0</ref>
  <text name="t0">text</text></p>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let textinputAnchor = '#' + textinputName + '_input';
      let textinputSubmitAnchor = '#' + textinputName + '_submit';
      let text1 = components['/_ref2'].replacements[0];
      let text1Anchor = '#' + text1.componentName;
      let text2 = components['/_ref3'].replacements[0];
      let text2Anchor = '#' + text2.componentName;
      let number1 = components['/_ref4'].replacements[0];
      let number1Anchor = '#' + number1.componentName;

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq('');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get(text1Anchor).should('have.text', 'hello  there')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq('hello  there');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get(text1Anchor).should('have.text', 'hello  there')
      cy.get(text2Anchor).should('have.text', 'hello  there')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(components[textinputName].stateValues.value).eq('hello  there');
        expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    });
  });

  it('answer sugar from one math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer><math>x+y</math></answer></p>
  <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for submitted response: <ref prop="creditAchieved">_answer1</ref></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let math1 = components['/_ref1'].replacements[0];
      let math1Anchor = '#' + math1.componentName;
      let math2 = components['/_ref2'].replacements[0];
      let math2Anchor = '#' + math2.componentName;
      let number1 = components['/_ref3'].replacements[0];
      let number1Anchor = '#' + number1.componentName;

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['\uFF3F']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).clear().type(`x`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components[mathinputName].stateValues.value.tree).eqls('x');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
      });

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['x']);
        expect(components[mathinputName].stateValues.value.tree).eqls('x');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
      });

    })
  });

  it('answer sugar from one math, initally unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer><math>x+y-3+<ref>n</ref></math></answer></p>
  <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for submitted response: <ref prop="creditAchieved">_answer1</ref></p>

  <ref name="n2">n3</ref>
  <ref name="n">num1</ref>
  <math name="num1"><ref>n2</ref>+<ref>num2</ref></math>
  <math name="num2"><ref>n3</ref>+<ref>num3</ref></math>
  <ref name="n3">num3</ref>
  <number name="num3">1</number>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let math1 = components['/_ref2'].replacements[0];
      let math1Anchor = '#' + math1.componentName;
      let math2 = components['/_ref3'].replacements[0];
      let math2Anchor = '#' + math2.componentName;
      let number1 = components['/_ref4'].replacements[0];
      let number1Anchor = '#' + number1.componentName;

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['\uFF3F']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).clear().type(`x`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components[mathinputName].stateValues.value.tree).eqls('x');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
      });

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['x']);
        expect(components[mathinputName].stateValues.value.tree).eqls('x');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
      });

    })
  });

  it('answer sugar from one text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer><text>  hello there </text></answer></p>
  <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for submitted response: <ref prop="creditAchieved">_answer1</ref></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let textinputAnchor = '#' + textinputName + '_input';
      let textinputSubmitAnchor = '#' + textinputName + '_submit';
      let text1 = components['/_ref1'].replacements[0];
      let text1Anchor = '#' + text1.componentName;
      let text2 = components['/_ref2'].replacements[0];
      let text2Anchor = '#' + text2.componentName;
      let number1 = components['/_ref3'].replacements[0];
      let number1Anchor = '#' + number1.componentName;

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq('');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get(text1Anchor).should('have.text', 'hello  there')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq('hello  there');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get(text1Anchor).should('have.text', 'hello  there')
      cy.get(text2Anchor).should('have.text', 'hello  there')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(components[textinputName].stateValues.value).eq('hello  there');
        expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    })
  });

  it('answer sugar from one text, initally unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer><ref>n</ref></answer></p>
  <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for submitted response: <ref prop="creditAchieved">_answer1</ref></p>

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

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let textinputAnchor = '#' + textinputName + '_input';
      let textinputSubmitAnchor = '#' + textinputName + '_submit';
      let text1 = components['/_ref2'].replacements[0];
      let text1Anchor = '#' + text1.componentName;
      let text2 = components['/_ref3'].replacements[0];
      let text2Anchor = '#' + text2.componentName;
      let number1 = components['/_ref4'].replacements[0];
      let number1Anchor = '#' + number1.componentName;

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq('');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get(text1Anchor).should('have.text', 'hello  there')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq('hello  there');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get(text1Anchor).should('have.text', 'hello  there')
      cy.get(text2Anchor).should('have.text', 'hello  there')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(components[textinputName].stateValues.value).eq('hello  there');
        expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    })
  });

  it('answer sugar from incomplete awards', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer><award>x+y</award><award credit="0.5"><math>x</math></award></answer></p>
  <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for submitted response: <ref prop="creditAchieved">_answer1</ref></p>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let math1 = components['/_ref1'].replacements[0];
      let math1Anchor = '#' + math1.componentName;
      let math2 = components['/_ref2'].replacements[0];
      let math2Anchor = '#' + math2.componentName;
      let number1 = components['/_ref3'].replacements[0];
      let number1Anchor = '#' + number1.componentName;

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['\uFF3F']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter partially correct answer")
      cy.get(mathinputAnchor).clear().type(`x`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components[mathinputName].stateValues.value.tree).eqls('x');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
      });


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(number1Anchor).should('have.text', '0.5')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['x']);
        expect(components[mathinputName].stateValues.value.tree).eqls('x');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
      });


      cy.log("Enter incorrect answer")
      cy.get(mathinputAnchor).clear().type(`y`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(number1Anchor).should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['y']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['x']);
        expect(components[mathinputName].stateValues.value.tree).eqls('y');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
      });


      cy.log("Submit answer")
      cy.get(mathinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['y']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['y']);
        expect(components[mathinputName].stateValues.value.tree).eqls('y');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls('y');
      });

    })
  });

  it('answer sugar from incomplete awards, set to text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer type="text"><award>hello there</award><award credit="0.5"><text>bye</text></award></answer></p>
  <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for submitted response: <ref prop="creditAchieved">_answer1</ref></p>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let textinputAnchor = '#' + textinputName + '_input';
      let textinputSubmitAnchor = '#' + textinputName + '_submit';
      let text1 = components['/_ref1'].replacements[0];
      let text1Anchor = '#' + text1.componentName;
      let text2 = components['/_ref2'].replacements[0];
      let text2Anchor = '#' + text2.componentName;
      let number1 = components['/_ref3'].replacements[0];
      let number1Anchor = '#' + number1.componentName;

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq('');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter partially correct answer")
      cy.get(textinputAnchor).clear().type(`bye`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get(text1Anchor).should('have.text', 'bye')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['bye']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq('bye');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get(text1Anchor).should('have.text', 'bye')
      cy.get(text2Anchor).should('have.text', 'bye')
      cy.get(number1Anchor).should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['bye']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['bye']);
        expect(components[textinputName].stateValues.value).eq('bye');
        expect(components[textinputName].stateValues.submittedValue).eq('bye');
      });


      cy.log("Enter incorrect answer")
      cy.get(textinputAnchor).clear().type(`y`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'y');
      cy.get(text1Anchor).should('have.text', 'y')
      cy.get(text2Anchor).should('have.text', 'bye')
      cy.get(number1Anchor).should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['y']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['bye']);
        expect(components[textinputName].stateValues.value).eq('y');
        expect(components[textinputName].stateValues.submittedValue).eq('bye');
      });

      cy.log("Submit answer")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'y');
      cy.get(text1Anchor).should('have.text', 'y')
      cy.get(text2Anchor).should('have.text', 'y')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['y']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['y']);
        expect(components[textinputName].stateValues.value).eq('y');
        expect(components[textinputName].stateValues.submittedValue).eq('y');
      });
    })
  });

  it('answer sugar from incomplete awards, based on text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer><award>hello there</award><award credit="0.5"><text>bye</text></award></answer></p>
  <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for submitted response: <ref prop="creditAchieved">_answer1</ref></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let textinputAnchor = '#' + textinputName + '_input';
      let textinputSubmitAnchor = '#' + textinputName + '_submit';
      let text1 = components['/_ref1'].replacements[0];
      let text1Anchor = '#' + text1.componentName;
      let text2 = components['/_ref2'].replacements[0];
      let text2Anchor = '#' + text2.componentName;
      let number1 = components['/_ref3'].replacements[0];
      let number1Anchor = '#' + number1.componentName;

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq('');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '＿')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter partially correct answer")
      cy.get(textinputAnchor).clear().type(`bye`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get(text1Anchor).should('have.text', 'bye')
      cy.get(text2Anchor).should('have.text', ' hello there ')
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['bye']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(components[textinputName].stateValues.value).eq('bye');
        expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get(text1Anchor).should('have.text', 'bye')
      cy.get(text2Anchor).should('have.text', 'bye')
      cy.get(number1Anchor).should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['bye']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['bye']);
        expect(components[textinputName].stateValues.value).eq('bye');
        expect(components[textinputName].stateValues.submittedValue).eq('bye');
      });


      cy.log("Enter incorrect answer")
      cy.get(textinputAnchor).clear().type(`y`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'y');
      cy.get(text1Anchor).should('have.text', 'y')
      cy.get(text2Anchor).should('have.text', 'bye')
      cy.get(number1Anchor).should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['y']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['bye']);
        expect(components[textinputName].stateValues.value).eq('y');
        expect(components[textinputName].stateValues.submittedValue).eq('bye');
      });

      cy.log("Submit answer")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'y');
      cy.get(text1Anchor).should('have.text', 'y')
      cy.get(text2Anchor).should('have.text', 'y')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['y']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['y']);
        expect(components[textinputName].stateValues.value).eq('y');
        expect(components[textinputName].stateValues.submittedValue).eq('y');
      });
    })

  });

  it('answer with internal references, incomplete awards', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <answer>
  <award><math>x+y</math></award><award credit="0.5">x</award>
  <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
  <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
  <p>Credit for submitted response: <ref prop="creditAchieved">_answer1</ref></p>
  </answer>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let math1 = components['/_ref1'].replacements[0];
      let math1Anchor = '#' + math1.componentName;
      let math2 = components['/_ref2'].replacements[0];
      let math2Anchor = '#' + math2.componentName;
      let number1 = components['/_ref3'].replacements[0];
      let number1Anchor = '#' + number1.componentName;

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['\uFF3F']);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter partially correct answer")
      cy.get(mathinputAnchor).clear().type(`x`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(number1Anchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(components[mathinputName].stateValues.value.tree).eqls('x');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
      });


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(number1Anchor).should('have.text', '0.5')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['x']);
        expect(components[mathinputName].stateValues.value.tree).eqls('x');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
      });


      cy.log("Enter incorrect answer")
      cy.get(mathinputAnchor).clear().type(`y`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(number1Anchor).should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['y']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['x']);
        expect(components[mathinputName].stateValues.value.tree).eqls('y');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
      });


      cy.log("Submit answer")
      cy.get(mathinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['y']);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['y']);
        expect(components[mathinputName].stateValues.value.tree).eqls('y');
        expect(components[mathinputName].stateValues.submittedValue.tree).eqls('y');
      });

    })
  });

  it('full answer tag', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer>Enter values that sum to <m>3x</m>: <mathinput/> <mathinput/>
  <award><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3x</math></if></award>
  <award credit="0.5"><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3</math></if></award>
  </answer></p>
  <p>First current response: <ref name="cr" prop="currentResponse">_answer1</ref></p>
  <p>First current response again: <ref name="cr1" prop="currentResponse1">_answer1</ref></p>
  <p>Second current response: <ref name="cr2" prop="currentResponse2">_answer1</ref></p>
  <p>Both current responses together: <ref name="crs" prop="currentResponses">_answer1</ref></p>
  <p>First submitted response: <ref name="sr" prop="submittedResponse">_answer1</ref></p>
  <p>First submitted response again: <ref name="sr1" prop="submittedResponse1">_answer1</ref></p>
  <p>Second submitted response: <ref name="sr2" prop="submittedResponse2">_answer1</ref></p>
  <p>Both submitted responses together: <ref name="srs" prop="submittedResponses">_answer1</ref></p>
  <p>Credit for submitted responses: <ref name="ca" prop="creditAchieved">_answer1</ref></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let cr = components['/cr'].replacements[0];
      let crAnchor = '#' + cr.componentName;
      let cr1 = components['/cr1'].replacements[0];
      let cr1Anchor = '#' + cr1.componentName;
      let cr2 = components['/cr2'].replacements[0];
      let cr2Anchor = '#' + cr2.componentName;
      let crsa = components['/crs'].replacements[0];
      let crsaAnchor = '#' + crsa.componentName;
      let crsb = components['/crs'].replacements[1];
      let crsbAnchor = '#' + crsb.componentName;
      let sr = components['/sr'].replacements[0];
      let srAnchor = '#' + sr.componentName;
      let sr1 = components['/sr1'].replacements[0];
      let sr1Anchor = '#' + sr1.componentName;
      let sr2 = components['/sr2'].replacements[0];
      let sr2Anchor = '#' + sr2.componentName;
      let srsa = components['/srs'].replacements[0];
      let srsaAnchor = '#' + srsa.componentName;
      let srsb = components['/srs'].replacements[1];
      let srsbAnchor = '#' + srsb.componentName;
      let ca = components['/ca'].replacements[0];
      let caAnchor = '#' + ca.componentName;

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '');
      cy.get('#\\/_mathinput2_input').should('have.value', '');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['\uFF3F', '\uFF3F']);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls('\uFF3F')
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls('\uFF3F')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F', '\uFF3F'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('\uFF3F')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('\uFF3F')
        expect(components['/_mathinput1'].stateValues.value.tree).eq('\uFF3F');
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.value.tree).eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(cr.stateValues.value.tree).eq('\uFF3F')
        expect(cr1.stateValues.value.tree).eq('\uFF3F')
        expect(cr2.stateValues.value.tree).eq('\uFF3F')
        expect(crsa.stateValues.value.tree).eq('\uFF3F')
        expect(crsb.stateValues.value.tree).eq('\uFF3F')
        expect(sr.stateValues.value.tree).eq('\uFF3F')
        expect(sr1.stateValues.value.tree).eq('\uFF3F')
        expect(sr2.stateValues.value.tree).eq('\uFF3F')
        expect(srsa.stateValues.value.tree).eq('\uFF3F')
        expect(srsb.stateValues.value.tree).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });

      cy.log("Enter a correct answer in")
      cy.get('#\\/_mathinput1_input').type(`x+y`).blur();
      cy.get('#\\/_mathinput2_input').type(`2x-y`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
      cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls(["+", 'x', 'y']);
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F', '\uFF3F'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('\uFF3F')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('\uFF3F')
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(["+", 'x', 'y']);
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(cr.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(cr1.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(cr2.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(crsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(crsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(sr.stateValues.value.tree).eq('\uFF3F')
        expect(sr1.stateValues.value.tree).eq('\uFF3F')
        expect(sr2.stateValues.value.tree).eq('\uFF3F')
        expect(srsa.stateValues.value.tree).eq('\uFF3F')
        expect(srsb.stateValues.value.tree).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });


      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
      cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(caAnchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls(["+", 'x', 'y']);
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
        expect(components['/_answer1'].stateValues.submittedResponse1.tree).eqls(["+", 'x', 'y']);
        expect(components['/_answer1'].stateValues.submittedResponse2.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(["+", 'x', 'y']);
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls(["+", 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(cr.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(cr1.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(cr2.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(crsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(crsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(sr.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(sr1.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(sr2.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(srsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(srsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(ca.stateValues.value).eq(1)
      });


      cy.log("Enter partially correct answer")
      cy.get('#\\/_mathinput1_input').clear().type(`x`).blur();
      cy.get('#\\/_mathinput2_input').clear().type(`3-x`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x');
      cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(caAnchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls('x');
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
        expect(components['/_answer1'].stateValues.submittedResponse1.tree).eqls(["+", 'x', 'y']);
        expect(components['/_answer1'].stateValues.submittedResponse2.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls('x');
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls(["+", 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(cr.stateValues.value.tree).eqls('x')
        expect(cr1.stateValues.value.tree).eqls('x')
        expect(cr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(crsa.stateValues.value.tree).eqls('x')
        expect(crsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(sr.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(sr1.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(sr2.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(srsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(srsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(ca.stateValues.value).eq(1)
      });

      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();


      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x');
      cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(caAnchor).should('have.text', '0.5')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls('x');
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.submittedResponse1.tree).eqls('x');
        expect(components['/_answer1'].stateValues.submittedResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls('x');
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('x');
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
        expect(cr.stateValues.value.tree).eqls('x')
        expect(cr1.stateValues.value.tree).eqls('x')
        expect(cr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(crsa.stateValues.value.tree).eqls('x')
        expect(crsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(sr.stateValues.value.tree).eqls('x')
        expect(sr1.stateValues.value.tree).eqls('x')
        expect(sr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(srsa.stateValues.value.tree).eqls('x')
        expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(ca.stateValues.value).eq(0.5)
      });

      cy.log("Enter incorrect answer")
      cy.get('#\\/_mathinput1_input').clear().type(`y`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'y');
      cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(caAnchor).should('have.text', '0.5')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls('y');
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.submittedResponse1.tree).eqls('x');
        expect(components['/_answer1'].stateValues.submittedResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls('y');
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('x');
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
        expect(cr.stateValues.value.tree).eqls('y')
        expect(cr1.stateValues.value.tree).eqls('y')
        expect(cr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(crsa.stateValues.value.tree).eqls('y')
        expect(crsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(sr.stateValues.value.tree).eqls('x')
        expect(sr1.stateValues.value.tree).eqls('x')
        expect(sr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(srsa.stateValues.value.tree).eqls('x')
        expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(ca.stateValues.value).eq(0.5)
      });

      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'y');
      cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls('y');
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.submittedResponse1.tree).eqls('y');
        expect(components['/_answer1'].stateValues.submittedResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls('y');
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('y');
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
        expect(cr.stateValues.value.tree).eqls('y')
        expect(cr1.stateValues.value.tree).eqls('y')
        expect(cr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(crsa.stateValues.value.tree).eqls('y')
        expect(crsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(sr.stateValues.value.tree).eqls('y')
        expect(sr1.stateValues.value.tree).eqls('y')
        expect(sr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(srsa.stateValues.value.tree).eqls('y')
        expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(ca.stateValues.value).eq(0)
      });

    })
  });

  it('full answer tag, internal references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <answer>
    <p>Enter values that sum to <m>3x</m>: <mathinput/> <mathinput/></p>
    <award><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3x</math></if></award>
    <award credit="0.5"><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3</math></if></award>
    <p>First current response: <ref name="cr" prop="currentResponse">_answer1</ref></p>
    <p>First current response again: <ref name="cr1" prop="currentResponse1">_answer1</ref></p>
    <p>Second current response: <ref name="cr2" prop="currentResponse2">_answer1</ref></p>
    <p>Both current responses together: <ref name="crs" prop="currentResponses">_answer1</ref></p>
    <p>First submitted response: <ref name="sr" prop="submittedResponse">_answer1</ref></p>
    <p>First submitted response again: <ref name="sr1" prop="submittedResponse1">_answer1</ref></p>
    <p>Second submitted response: <ref name="sr2" prop="submittedResponse2">_answer1</ref></p>
    <p>Both submitted responses together: <ref name="srs" prop="submittedResponses">_answer1</ref></p>
    <p>Credit for submitted responses: <ref name="ca" prop="creditAchieved">_answer1</ref></p>
  </answer>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let cr = components['/cr'].replacements[0];
      let crAnchor = '#' + cr.componentName;
      let cr1 = components['/cr1'].replacements[0];
      let cr1Anchor = '#' + cr1.componentName;
      let cr2 = components['/cr2'].replacements[0];
      let cr2Anchor = '#' + cr2.componentName;
      let crsa = components['/crs'].replacements[0];
      let crsaAnchor = '#' + crsa.componentName;
      let crsb = components['/crs'].replacements[1];
      let crsbAnchor = '#' + crsb.componentName;
      let sr = components['/sr'].replacements[0];
      let srAnchor = '#' + sr.componentName;
      let sr1 = components['/sr1'].replacements[0];
      let sr1Anchor = '#' + sr1.componentName;
      let sr2 = components['/sr2'].replacements[0];
      let sr2Anchor = '#' + sr2.componentName;
      let srsa = components['/srs'].replacements[0];
      let srsaAnchor = '#' + srsa.componentName;
      let srsb = components['/srs'].replacements[1];
      let srsbAnchor = '#' + srsb.componentName;
      let ca = components['/ca'].replacements[0];
      let caAnchor = '#' + ca.componentName;

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '');
      cy.get('#\\/_mathinput2_input').should('have.value', '');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['\uFF3F', '\uFF3F']);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls('\uFF3F')
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls('\uFF3F')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F', '\uFF3F'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('\uFF3F')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('\uFF3F')
        expect(components['/_mathinput1'].stateValues.value.tree).eq('\uFF3F');
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.value.tree).eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(cr.stateValues.value.tree).eq('\uFF3F')
        expect(cr1.stateValues.value.tree).eq('\uFF3F')
        expect(cr2.stateValues.value.tree).eq('\uFF3F')
        expect(crsa.stateValues.value.tree).eq('\uFF3F')
        expect(crsb.stateValues.value.tree).eq('\uFF3F')
        expect(sr.stateValues.value.tree).eq('\uFF3F')
        expect(sr1.stateValues.value.tree).eq('\uFF3F')
        expect(sr2.stateValues.value.tree).eq('\uFF3F')
        expect(srsa.stateValues.value.tree).eq('\uFF3F')
        expect(srsb.stateValues.value.tree).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });

      cy.log("Enter a correct answer in")
      cy.get('#\\/_mathinput1_input').type(`x+y`).blur();
      cy.get('#\\/_mathinput2_input').type(`2x-y`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
      cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls(["+", 'x', 'y']);
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F', '\uFF3F'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('\uFF3F')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('\uFF3F')
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(["+", 'x', 'y']);
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(cr.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(cr1.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(cr2.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(crsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(crsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(sr.stateValues.value.tree).eq('\uFF3F')
        expect(sr1.stateValues.value.tree).eq('\uFF3F')
        expect(sr2.stateValues.value.tree).eq('\uFF3F')
        expect(srsa.stateValues.value.tree).eq('\uFF3F')
        expect(srsb.stateValues.value.tree).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });


      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
      cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(caAnchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls(["+", 'x', 'y']);
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
        expect(components['/_answer1'].stateValues.submittedResponse1.tree).eqls(["+", 'x', 'y']);
        expect(components['/_answer1'].stateValues.submittedResponse2.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(["+", 'x', 'y']);
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls(["+", 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(cr.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(cr1.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(cr2.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(crsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(crsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(sr.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(sr1.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(sr2.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(srsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(srsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(ca.stateValues.value).eq(1)
      });


      cy.log("Enter partially correct answer")
      cy.get('#\\/_mathinput1_input').clear().type(`x`).blur();
      cy.get('#\\/_mathinput2_input').clear().type(`3-x`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x');
      cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x−y')
      });
      cy.get(caAnchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls('x');
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
        expect(components['/_answer1'].stateValues.submittedResponse1.tree).eqls(["+", 'x', 'y']);
        expect(components['/_answer1'].stateValues.submittedResponse2.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls('x');
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls(["+", 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(cr.stateValues.value.tree).eqls('x')
        expect(cr1.stateValues.value.tree).eqls('x')
        expect(cr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(crsa.stateValues.value.tree).eqls('x')
        expect(crsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(sr.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(sr1.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(sr2.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(srsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
        expect(srsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect(ca.stateValues.value).eq(1)
      });

      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();


      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x');
      cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(caAnchor).should('have.text', '0.5')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls('x');
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.submittedResponse1.tree).eqls('x');
        expect(components['/_answer1'].stateValues.submittedResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls('x');
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('x');
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
        expect(cr.stateValues.value.tree).eqls('x')
        expect(cr1.stateValues.value.tree).eqls('x')
        expect(cr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(crsa.stateValues.value.tree).eqls('x')
        expect(crsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(sr.stateValues.value.tree).eqls('x')
        expect(sr1.stateValues.value.tree).eqls('x')
        expect(sr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(srsa.stateValues.value.tree).eqls('x')
        expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(ca.stateValues.value).eq(0.5)
      });

      cy.log("Enter incorrect answer")
      cy.get('#\\/_mathinput1_input').clear().type(`y`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'y');
      cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(caAnchor).should('have.text', '0.5')


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls('y');
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.submittedResponse1.tree).eqls('x');
        expect(components['/_answer1'].stateValues.submittedResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls('y');
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('x');
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
        expect(cr.stateValues.value.tree).eqls('y')
        expect(cr1.stateValues.value.tree).eqls('y')
        expect(cr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(crsa.stateValues.value.tree).eqls('y')
        expect(crsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(sr.stateValues.value.tree).eqls('x')
        expect(sr1.stateValues.value.tree).eqls('x')
        expect(sr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(srsa.stateValues.value.tree).eqls('x')
        expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(ca.stateValues.value).eq(0.5)
      });

      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'y');
      cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(crsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(crsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3−x')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses.map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.currentResponse1.tree).eqls('y');
        expect(components['/_answer1'].stateValues.currentResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_answer1'].stateValues.submittedResponses.map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
        expect(components['/_answer1'].stateValues.submittedResponse1.tree).eqls('y');
        expect(components['/_answer1'].stateValues.submittedResponse2.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls('y');
        expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('y');
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
        expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
        expect(cr.stateValues.value.tree).eqls('y')
        expect(cr1.stateValues.value.tree).eqls('y')
        expect(cr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(crsa.stateValues.value.tree).eqls('y')
        expect(crsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(sr.stateValues.value.tree).eqls('y')
        expect(sr1.stateValues.value.tree).eqls('y')
        expect(sr2.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(srsa.stateValues.value.tree).eqls('y')
        expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
        expect(ca.stateValues.value).eq(0)
      });

    })
  });

  it('full answer tag, text inputs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer>Enter rain and snow in either order: <textinput/> <textinput/>
  <award><if><text><ref prop="value">_textinput1</ref> <ref prop="value">_textinput2</ref></text> = <text>rain snow</text></if></award>
  <award><if><text><ref prop="value">_textinput1</ref> <ref prop="value">_textinput2</ref></text> = <text>snow rain</text></if></award>
  <award credit="0.5"><if><ref prop="value">_textinput1</ref> = rain</if></award>
  <award credit="0.5"><if><ref prop="value">_textinput1</ref> = snow</if></award>
  <award credit="0.5"><if><ref prop="value">_textinput2</ref> = rain</if></award>
  <award credit="0.5"><if><ref prop="value">_textinput2</ref> = snow</if></award>
  </answer></p>
  <p>First current response: <ref name="cr" prop="currentResponse">_answer1</ref></p>
  <p>First current response again: <ref name="cr1" prop="currentResponse1">_answer1</ref></p>
  <p>Second current response: <ref name="cr2" prop="currentResponse2">_answer1</ref></p>
  <p>Both current responses together: <ref name="crs" prop="currentResponses">_answer1</ref></p>
  <p>First submitted response: <ref name="sr" prop="submittedResponse">_answer1</ref></p>
  <p>First submitted response again: <ref name="sr1" prop="submittedResponse1">_answer1</ref></p>
  <p>Second submitted response: <ref name="sr2" prop="submittedResponse2">_answer1</ref></p>
  <p>Both submitted responses together: <ref name="srs" prop="submittedResponses">_answer1</ref></p>
  <p>Credit for submitted responses: <ref name="ca" prop="creditAchieved">_answer1</ref></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let cr = components['/cr'].replacements[0];
      let crAnchor = '#' + cr.componentName;
      let cr1 = components['/cr1'].replacements[0];
      let cr1Anchor = '#' + cr1.componentName;
      let cr2 = components['/cr2'].replacements[0];
      let cr2Anchor = '#' + cr2.componentName;
      let crsa = components['/crs'].replacements[0];
      let crsaAnchor = '#' + crsa.componentName;
      let crsb = components['/crs'].replacements[1];
      let crsbAnchor = '#' + crsb.componentName;
      let sr = components['/sr'].replacements[0];
      let srAnchor = '#' + sr.componentName;
      let sr1 = components['/sr1'].replacements[0];
      let sr1Anchor = '#' + sr1.componentName;
      let sr2 = components['/sr2'].replacements[0];
      let sr2Anchor = '#' + sr2.componentName;
      let srsa = components['/srs'].replacements[0];
      let srsaAnchor = '#' + srsa.componentName;
      let srsb = components['/srs'].replacements[1];
      let srsbAnchor = '#' + srsb.componentName;
      let ca = components['/ca'].replacements[0];
      let caAnchor = '#' + ca.componentName;

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', '');
      cy.get('#\\/_textinput2_input').should('have.value', '');

      cy.get(crAnchor).should('have.text', '')
      cy.get(cr1Anchor).should('have.text', '')
      cy.get(cr2Anchor).should('have.text', '')
      cy.get(crsaAnchor).should('have.text', '')
      cy.get(crsbAnchor).should('have.text', '')
      cy.get(srAnchor).should('have.text', '＿')
      cy.get(sr1Anchor).should('have.text', '＿')
      cy.get(sr2Anchor).should('have.text', '＿')
      cy.get(srsaAnchor).should('have.text', '＿')
      cy.get(srsbAnchor).should('have.text', '＿')
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['', '']);
        expect(components['/_answer1'].stateValues.currentResponse1).eqls('')
        expect(components['/_answer1'].stateValues.currentResponse2).eqls('')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F', '\uFF3F'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('\uFF3F')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('\uFF3F')
        expect(components['/_textinput1'].stateValues.value).eq('');
        expect(components['/_textinput1'].stateValues.submittedValue).eq('\uFF3F');
        expect(components['/_textinput2'].stateValues.value).eq('');
        expect(components['/_textinput2'].stateValues.submittedValue).eq('\uFF3F');
        expect(cr.stateValues.value).eq('')
        expect(cr1.stateValues.value).eq('')
        expect(cr2.stateValues.value).eq('')
        expect(crsa.stateValues.value).eq('')
        expect(crsb.stateValues.value).eq('')
        expect(sr.stateValues.value).eq('\uFF3F')
        expect(sr1.stateValues.value).eq('\uFF3F')
        expect(sr2.stateValues.value).eq('\uFF3F')
        expect(srsa.stateValues.value).eq('\uFF3F')
        expect(srsb.stateValues.value).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });

      cy.log("Enter a correct answer in")
      cy.get('#\\/_textinput1_input').type(`rain`).blur();
      cy.get('#\\/_textinput2_input').type(`snow`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'rain');
      cy.get('#\\/_textinput2_input').should('have.value', 'snow');

      cy.get(crAnchor).should('have.text', 'rain')
      cy.get(cr1Anchor).should('have.text', 'rain')
      cy.get(cr2Anchor).should('have.text', 'snow')
      cy.get(crsaAnchor).should('have.text', 'rain')
      cy.get(crsbAnchor).should('have.text', 'snow')
      cy.get(srAnchor).should('have.text', '＿')
      cy.get(sr1Anchor).should('have.text', '＿')
      cy.get(sr2Anchor).should('have.text', '＿')
      cy.get(srsaAnchor).should('have.text', '＿')
      cy.get(srsbAnchor).should('have.text', '＿')
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['rain', 'snow']);
        expect(components['/_answer1'].stateValues.currentResponse1).eqls('rain')
        expect(components['/_answer1'].stateValues.currentResponse2).eqls('snow')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['\uFF3F', '\uFF3F'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('\uFF3F')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('\uFF3F')
        expect(components['/_textinput1'].stateValues.value).eq('rain');
        expect(components['/_textinput1'].stateValues.submittedValue).eq('\uFF3F');
        expect(components['/_textinput2'].stateValues.value).eq('snow');
        expect(components['/_textinput2'].stateValues.submittedValue).eq('\uFF3F');
        expect(cr.stateValues.value).eq('rain')
        expect(cr1.stateValues.value).eq('rain')
        expect(cr2.stateValues.value).eq('snow')
        expect(crsa.stateValues.value).eq('rain')
        expect(crsb.stateValues.value).eq('snow')
        expect(sr.stateValues.value).eq('\uFF3F')
        expect(sr1.stateValues.value).eq('\uFF3F')
        expect(sr2.stateValues.value).eq('\uFF3F')
        expect(srsa.stateValues.value).eq('\uFF3F')
        expect(srsb.stateValues.value).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });


      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'rain');
      cy.get('#\\/_textinput2_input').should('have.value', 'snow');

      cy.get(crAnchor).should('have.text', 'rain')
      cy.get(cr1Anchor).should('have.text', 'rain')
      cy.get(cr2Anchor).should('have.text', 'snow')
      cy.get(crsaAnchor).should('have.text', 'rain')
      cy.get(crsbAnchor).should('have.text', 'snow')
      cy.get(srAnchor).should('have.text', 'rain')
      cy.get(sr1Anchor).should('have.text', 'rain')
      cy.get(sr2Anchor).should('have.text', 'snow')
      cy.get(srsaAnchor).should('have.text', 'rain')
      cy.get(srsbAnchor).should('have.text', 'snow')
      cy.get(caAnchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['rain', 'snow']);
        expect(components['/_answer1'].stateValues.currentResponse1).eqls('rain')
        expect(components['/_answer1'].stateValues.currentResponse2).eqls('snow')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'snow'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('rain')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('snow')
        expect(components['/_textinput1'].stateValues.value).eq('rain');
        expect(components['/_textinput1'].stateValues.submittedValue).eq('rain');
        expect(components['/_textinput2'].stateValues.value).eq('snow');
        expect(components['/_textinput2'].stateValues.submittedValue).eq('snow');
        expect(cr.stateValues.value).eq('rain')
        expect(cr1.stateValues.value).eq('rain')
        expect(cr2.stateValues.value).eq('snow')
        expect(crsa.stateValues.value).eq('rain')
        expect(crsb.stateValues.value).eq('snow')
        expect(sr.stateValues.value).eq('rain')
        expect(sr1.stateValues.value).eq('rain')
        expect(sr2.stateValues.value).eq('snow')
        expect(srsa.stateValues.value).eq('rain')
        expect(srsb.stateValues.value).eq('snow')
        expect(ca.stateValues.value).eq(1)
      });


      cy.log("Enter partially correct answer")
      cy.get('#\\/_textinput2_input').clear().type(`rain`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'rain');
      cy.get('#\\/_textinput2_input').should('have.value', 'rain');

      cy.get(crAnchor).should('have.text', 'rain')
      cy.get(cr1Anchor).should('have.text', 'rain')
      cy.get(cr2Anchor).should('have.text', 'rain')
      cy.get(crsaAnchor).should('have.text', 'rain')
      cy.get(crsbAnchor).should('have.text', 'rain')
      cy.get(srAnchor).should('have.text', 'rain')
      cy.get(sr1Anchor).should('have.text', 'rain')
      cy.get(sr2Anchor).should('have.text', 'snow')
      cy.get(srsaAnchor).should('have.text', 'rain')
      cy.get(srsbAnchor).should('have.text', 'snow')
      cy.get(caAnchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['rain', 'rain']);
        expect(components['/_answer1'].stateValues.currentResponse1).eqls('rain')
        expect(components['/_answer1'].stateValues.currentResponse2).eqls('rain')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'snow'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('rain')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('snow')
        expect(components['/_textinput1'].stateValues.value).eq('rain');
        expect(components['/_textinput1'].stateValues.submittedValue).eq('rain');
        expect(components['/_textinput2'].stateValues.value).eq('rain');
        expect(components['/_textinput2'].stateValues.submittedValue).eq('snow');
        expect(cr.stateValues.value).eq('rain')
        expect(cr1.stateValues.value).eq('rain')
        expect(cr2.stateValues.value).eq('rain')
        expect(crsa.stateValues.value).eq('rain')
        expect(crsb.stateValues.value).eq('rain')
        expect(sr.stateValues.value).eq('rain')
        expect(sr1.stateValues.value).eq('rain')
        expect(sr2.stateValues.value).eq('snow')
        expect(srsa.stateValues.value).eq('rain')
        expect(srsb.stateValues.value).eq('snow')
        expect(ca.stateValues.value).eq(1)
      });

      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'rain');
      cy.get('#\\/_textinput2_input').should('have.value', 'rain');

      cy.get(crAnchor).should('have.text', 'rain')
      cy.get(cr1Anchor).should('have.text', 'rain')
      cy.get(cr2Anchor).should('have.text', 'rain')
      cy.get(crsaAnchor).should('have.text', 'rain')
      cy.get(crsbAnchor).should('have.text', 'rain')
      cy.get(srAnchor).should('have.text', 'rain')
      cy.get(sr1Anchor).should('have.text', 'rain')
      cy.get(sr2Anchor).should('have.text', 'rain')
      cy.get(srsaAnchor).should('have.text', 'rain')
      cy.get(srsbAnchor).should('have.text', 'rain')
      cy.get(caAnchor).should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['rain', 'rain']);
        expect(components['/_answer1'].stateValues.currentResponse1).eqls('rain')
        expect(components['/_answer1'].stateValues.currentResponse2).eqls('rain')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'rain'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('rain')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('rain')
        expect(components['/_textinput1'].stateValues.value).eq('rain');
        expect(components['/_textinput1'].stateValues.submittedValue).eq('rain');
        expect(components['/_textinput2'].stateValues.value).eq('rain');
        expect(components['/_textinput2'].stateValues.submittedValue).eq('rain');
        expect(cr.stateValues.value).eq('rain')
        expect(cr1.stateValues.value).eq('rain')
        expect(cr2.stateValues.value).eq('rain')
        expect(crsa.stateValues.value).eq('rain')
        expect(crsb.stateValues.value).eq('rain')
        expect(sr.stateValues.value).eq('rain')
        expect(sr1.stateValues.value).eq('rain')
        expect(sr2.stateValues.value).eq('rain')
        expect(srsa.stateValues.value).eq('rain')
        expect(srsb.stateValues.value).eq('rain')
        expect(ca.stateValues.value).eq(0.5)
      });

      cy.log("Make correct again");
      cy.get('#\\/_textinput1_input').clear().type(`snow`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'snow');
      cy.get('#\\/_textinput2_input').should('have.value', 'rain');

      cy.get(crAnchor).should('have.text', 'snow')
      cy.get(cr1Anchor).should('have.text', 'snow')
      cy.get(cr2Anchor).should('have.text', 'rain')
      cy.get(crsaAnchor).should('have.text', 'snow')
      cy.get(crsbAnchor).should('have.text', 'rain')
      cy.get(srAnchor).should('have.text', 'rain')
      cy.get(sr1Anchor).should('have.text', 'rain')
      cy.get(sr2Anchor).should('have.text', 'rain')
      cy.get(srsaAnchor).should('have.text', 'rain')
      cy.get(srsbAnchor).should('have.text', 'rain')
      cy.get(caAnchor).should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['snow', 'rain']);
        expect(components['/_answer1'].stateValues.currentResponse1).eqls('snow')
        expect(components['/_answer1'].stateValues.currentResponse2).eqls('rain')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'rain'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('rain')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('rain')
        expect(components['/_textinput1'].stateValues.value).eq('snow');
        expect(components['/_textinput1'].stateValues.submittedValue).eq('rain');
        expect(components['/_textinput2'].stateValues.value).eq('rain');
        expect(components['/_textinput2'].stateValues.submittedValue).eq('rain');
        expect(cr.stateValues.value).eq('snow')
        expect(cr1.stateValues.value).eq('snow')
        expect(cr2.stateValues.value).eq('rain')
        expect(crsa.stateValues.value).eq('snow')
        expect(crsb.stateValues.value).eq('rain')
        expect(sr.stateValues.value).eq('rain')
        expect(sr1.stateValues.value).eq('rain')
        expect(sr2.stateValues.value).eq('rain')
        expect(srsa.stateValues.value).eq('rain')
        expect(srsb.stateValues.value).eq('rain')
        expect(ca.stateValues.value).eq(0.5)
      });

      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'snow');
      cy.get('#\\/_textinput2_input').should('have.value', 'rain');

      cy.get(crAnchor).should('have.text', 'snow')
      cy.get(cr1Anchor).should('have.text', 'snow')
      cy.get(cr2Anchor).should('have.text', 'rain')
      cy.get(crsaAnchor).should('have.text', 'snow')
      cy.get(crsbAnchor).should('have.text', 'rain')
      cy.get(srAnchor).should('have.text', 'snow')
      cy.get(sr1Anchor).should('have.text', 'snow')
      cy.get(sr2Anchor).should('have.text', 'rain')
      cy.get(srsaAnchor).should('have.text', 'snow')
      cy.get(srsbAnchor).should('have.text', 'rain')
      cy.get(caAnchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['snow', 'rain']);
        expect(components['/_answer1'].stateValues.currentResponse1).eqls('snow')
        expect(components['/_answer1'].stateValues.currentResponse2).eqls('rain')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'rain'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('snow')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('rain')
        expect(components['/_textinput1'].stateValues.value).eq('snow');
        expect(components['/_textinput1'].stateValues.submittedValue).eq('snow');
        expect(components['/_textinput2'].stateValues.value).eq('rain');
        expect(components['/_textinput2'].stateValues.submittedValue).eq('rain');
        expect(cr.stateValues.value).eq('snow')
        expect(cr1.stateValues.value).eq('snow')
        expect(cr2.stateValues.value).eq('rain')
        expect(crsa.stateValues.value).eq('snow')
        expect(crsb.stateValues.value).eq('rain')
        expect(sr.stateValues.value).eq('snow')
        expect(sr1.stateValues.value).eq('snow')
        expect(sr2.stateValues.value).eq('rain')
        expect(srsa.stateValues.value).eq('snow')
        expect(srsb.stateValues.value).eq('rain')
        expect(ca.stateValues.value).eq(1)
      });

      cy.log("Enter another partially correct answer")
      cy.get('#\\/_textinput2_input').clear().type(`snow`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'snow');
      cy.get('#\\/_textinput2_input').should('have.value', 'snow');

      cy.get(crAnchor).should('have.text', 'snow')
      cy.get(cr1Anchor).should('have.text', 'snow')
      cy.get(cr2Anchor).should('have.text', 'snow')
      cy.get(crsaAnchor).should('have.text', 'snow')
      cy.get(crsbAnchor).should('have.text', 'snow')
      cy.get(srAnchor).should('have.text', 'snow')
      cy.get(sr1Anchor).should('have.text', 'snow')
      cy.get(sr2Anchor).should('have.text', 'rain')
      cy.get(srsaAnchor).should('have.text', 'snow')
      cy.get(srsbAnchor).should('have.text', 'rain')
      cy.get(caAnchor).should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['snow', 'snow']);
        expect(components['/_answer1'].stateValues.currentResponse1).eqls('snow')
        expect(components['/_answer1'].stateValues.currentResponse2).eqls('snow')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'rain'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('snow')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('rain')
        expect(components['/_textinput1'].stateValues.value).eq('snow');
        expect(components['/_textinput1'].stateValues.submittedValue).eq('snow');
        expect(components['/_textinput2'].stateValues.value).eq('snow');
        expect(components['/_textinput2'].stateValues.submittedValue).eq('rain');
        expect(cr.stateValues.value).eq('snow')
        expect(cr1.stateValues.value).eq('snow')
        expect(cr2.stateValues.value).eq('snow')
        expect(crsa.stateValues.value).eq('snow')
        expect(crsb.stateValues.value).eq('snow')
        expect(sr.stateValues.value).eq('snow')
        expect(sr1.stateValues.value).eq('snow')
        expect(sr2.stateValues.value).eq('rain')
        expect(srsa.stateValues.value).eq('snow')
        expect(srsb.stateValues.value).eq('rain')
        expect(ca.stateValues.value).eq(1)
      });


      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'snow');
      cy.get('#\\/_textinput2_input').should('have.value', 'snow');

      cy.get(crAnchor).should('have.text', 'snow')
      cy.get(cr1Anchor).should('have.text', 'snow')
      cy.get(cr2Anchor).should('have.text', 'snow')
      cy.get(crsaAnchor).should('have.text', 'snow')
      cy.get(crsbAnchor).should('have.text', 'snow')
      cy.get(srAnchor).should('have.text', 'snow')
      cy.get(sr1Anchor).should('have.text', 'snow')
      cy.get(sr2Anchor).should('have.text', 'snow')
      cy.get(srsaAnchor).should('have.text', 'snow')
      cy.get(srsbAnchor).should('have.text', 'snow')
      cy.get(caAnchor).should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['snow', 'snow']);
        expect(components['/_answer1'].stateValues.currentResponse1).eqls('snow')
        expect(components['/_answer1'].stateValues.currentResponse2).eqls('snow')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'snow'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('snow')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('snow')
        expect(components['/_textinput1'].stateValues.value).eq('snow');
        expect(components['/_textinput1'].stateValues.submittedValue).eq('snow');
        expect(components['/_textinput2'].stateValues.value).eq('snow');
        expect(components['/_textinput2'].stateValues.submittedValue).eq('snow');
        expect(cr.stateValues.value).eq('snow')
        expect(cr1.stateValues.value).eq('snow')
        expect(cr2.stateValues.value).eq('snow')
        expect(crsa.stateValues.value).eq('snow')
        expect(crsb.stateValues.value).eq('snow')
        expect(sr.stateValues.value).eq('snow')
        expect(sr1.stateValues.value).eq('snow')
        expect(sr2.stateValues.value).eq('snow')
        expect(srsa.stateValues.value).eq('snow')
        expect(srsb.stateValues.value).eq('snow')
        expect(ca.stateValues.value).eq(0.5)
      });


      cy.log("Enter incorrect answer")
      cy.get('#\\/_textinput1_input').clear().type(`fog`).blur();
      cy.get('#\\/_textinput2_input').clear().type(`hail`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'fog');
      cy.get('#\\/_textinput2_input').should('have.value', 'hail');

      cy.get(crAnchor).should('have.text', 'fog')
      cy.get(cr1Anchor).should('have.text', 'fog')
      cy.get(cr2Anchor).should('have.text', 'hail')
      cy.get(crsaAnchor).should('have.text', 'fog')
      cy.get(crsbAnchor).should('have.text', 'hail')
      cy.get(srAnchor).should('have.text', 'snow')
      cy.get(sr1Anchor).should('have.text', 'snow')
      cy.get(sr2Anchor).should('have.text', 'snow')
      cy.get(srsaAnchor).should('have.text', 'snow')
      cy.get(srsbAnchor).should('have.text', 'snow')
      cy.get(caAnchor).should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['fog', 'hail']);
        expect(components['/_answer1'].stateValues.currentResponse1).eqls('fog')
        expect(components['/_answer1'].stateValues.currentResponse2).eqls('hail')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'snow'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('snow')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('snow')
        expect(components['/_textinput1'].stateValues.value).eq('fog');
        expect(components['/_textinput1'].stateValues.submittedValue).eq('snow');
        expect(components['/_textinput2'].stateValues.value).eq('hail');
        expect(components['/_textinput2'].stateValues.submittedValue).eq('snow');
        expect(cr.stateValues.value).eq('fog')
        expect(cr1.stateValues.value).eq('fog')
        expect(cr2.stateValues.value).eq('hail')
        expect(crsa.stateValues.value).eq('fog')
        expect(crsb.stateValues.value).eq('hail')
        expect(sr.stateValues.value).eq('snow')
        expect(sr1.stateValues.value).eq('snow')
        expect(sr2.stateValues.value).eq('snow')
        expect(srsa.stateValues.value).eq('snow')
        expect(srsb.stateValues.value).eq('snow')
        expect(ca.stateValues.value).eq(0.5)
      });


      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'fog');
      cy.get('#\\/_textinput2_input').should('have.value', 'hail');

      cy.get(crAnchor).should('have.text', 'fog')
      cy.get(cr1Anchor).should('have.text', 'fog')
      cy.get(cr2Anchor).should('have.text', 'hail')
      cy.get(crsaAnchor).should('have.text', 'fog')
      cy.get(crsbAnchor).should('have.text', 'hail')
      cy.get(srAnchor).should('have.text', 'fog')
      cy.get(sr1Anchor).should('have.text', 'fog')
      cy.get(sr2Anchor).should('have.text', 'hail')
      cy.get(srsaAnchor).should('have.text', 'fog')
      cy.get(srsbAnchor).should('have.text', 'hail')
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.currentResponses).eqls(['fog', 'hail']);
        expect(components['/_answer1'].stateValues.currentResponse1).eqls('fog')
        expect(components['/_answer1'].stateValues.currentResponse2).eqls('hail')
        expect(components['/_answer1'].stateValues.submittedResponses).eqls(['fog', 'hail'])
        expect(components['/_answer1'].stateValues.submittedResponse1).eqls('fog')
        expect(components['/_answer1'].stateValues.submittedResponse2).eqls('hail')
        expect(components['/_textinput1'].stateValues.value).eq('fog');
        expect(components['/_textinput1'].stateValues.submittedValue).eq('fog');
        expect(components['/_textinput2'].stateValues.value).eq('hail');
        expect(components['/_textinput2'].stateValues.submittedValue).eq('hail');
        expect(cr.stateValues.value).eq('fog')
        expect(cr1.stateValues.value).eq('fog')
        expect(cr2.stateValues.value).eq('hail')
        expect(crsa.stateValues.value).eq('fog')
        expect(crsb.stateValues.value).eq('hail')
        expect(sr.stateValues.value).eq('fog')
        expect(sr1.stateValues.value).eq('fog')
        expect(sr2.stateValues.value).eq('hail')
        expect(srsa.stateValues.value).eq('fog')
        expect(srsb.stateValues.value).eq('hail')
        expect(ca.stateValues.value).eq(0)
      });

    })
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
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit a correct answer")
    cy.get('#\\/_mathinput1_input').type(`6`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Submit an incorrect answer")
    cy.get('#\\/_mathinput1_input').clear().type(`5`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });


    cy.log("Submit a different correct answer")
    cy.get('#\\/_mathinput1_input').clear().type(`-3`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Submit a correct answer that must be simplified")
    cy.get('#\\/_mathinput1_input').clear().type(`5xy-5xy+9`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Submit a non-numerical answer")
    cy.get('#\\/_mathinput1_input').clear().type(`5xy-5xyz+9`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
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
        expect(components['/_answer1'].stateValues.creditAchieved).eq(answers1[answerString]);
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
        expect(components['/_answer1'].stateValues.creditAchieved).eq(answers2[answerString]);
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
        expect(components['/_answer1'].stateValues.creditAchieved).eq(answers3[answerString]);
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
        expect(components['/_answer1'].stateValues.creditAchieved).eq(answer[0]);
      });
    }

  });

  it('answer inside map', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <map>
      <template>
        <p>Enter <m>x^<subsref/></m>: <answer><math>x^<subsref/></math></answer></p>
        <p>Credit achieved: <ref prop="creditAchieved">_answer1</ref></p>
        <p>Current response: <ref prop="currentResponse">_answer1</ref></p>
        <p>Submitted response: <ref prop="submittedResponse">_answer1</ref></p>
      </template>
      <substitutions><sequence>1,3</sequence></substitutions>
    </map>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let answer1 = components['/_map1'].replacements[0].activeChildren[3];
      let mathinput1Name = answer1.stateValues.inputDescendants[0].componentName;
      let mathinput1 = components[mathinput1Name]
      let mathinput1Anchor = '#' + mathinput1Name + '_input';
      let mathinput1SubmitAnchor = '#' + mathinput1Name + '_submit';
      let ca1 = components['/_map1'].replacements[1].activeChildren[1];
      let ca1Anchor = '#' + ca1.componentName;
      let cr1 = components['/_map1'].replacements[2].activeChildren[1];
      let cr1Anchor = '#' + cr1.componentName;
      let sr1 = components['/_map1'].replacements[3].activeChildren[1];
      let sr1Anchor = '#' + sr1.componentName;

      let answer2 = components['/_map1'].replacements[4].activeChildren[3];
      let mathinput2Name = answer2.stateValues.inputDescendants[0].componentName;
      let mathinput2 = components[mathinput2Name]
      let mathinput2Anchor = '#' + mathinput2Name + '_input';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let ca2 = components['/_map1'].replacements[5].activeChildren[1];
      let ca2Anchor = '#' + ca2.componentName;
      let cr2 = components['/_map1'].replacements[6].activeChildren[1];
      let cr2Anchor = '#' + cr2.componentName;
      let sr2 = components['/_map1'].replacements[7].activeChildren[1];
      let sr2Anchor = '#' + sr2.componentName;

      let answer3 = components['/_map1'].replacements[8].activeChildren[3];
      let mathinput3Name = answer3.stateValues.inputDescendants[0].componentName;
      let mathinput3 = components[mathinput3Name]
      let mathinput3Anchor = '#' + mathinput3Name + '_input';
      let mathinput3SubmitAnchor = '#' + mathinput3Name + '_submit';
      let ca3 = components['/_map1'].replacements[9].activeChildren[1];
      let ca3Anchor = '#' + ca3.componentName;
      let cr3 = components['/_map1'].replacements[10].activeChildren[1];
      let cr3Anchor = '#' + cr3.componentName;
      let sr3 = components['/_map1'].replacements[11].activeChildren[1];
      let sr3Anchor = '#' + sr3.componentName;


      cy.log('Test value displayed in browser')
      cy.get(mathinput1Anchor).should('have.value', '');
      cy.get(mathinput2Anchor).should('have.value', '');
      cy.get(mathinput3Anchor).should('have.value', '');
      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '0');
      cy.get(ca3Anchor).should('have.text', '0');
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(cr3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(answer1.stateValues.creditAchieved).eq(0);
        expect(answer1.stateValues.currentResponses.map(x => x.tree)).eqls(['\uFF3F']);
        expect(answer1.stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(mathinput1.stateValues.value.tree).eq('\uFF3F');
        expect(mathinput1.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer2.stateValues.creditAchieved).eq(0);
        expect(answer2.stateValues.currentResponses.map(x => x.tree)).eqls(['\uFF3F']);
        expect(answer2.stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(mathinput2.stateValues.value.tree).eq('\uFF3F');
        expect(mathinput2.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer3.stateValues.creditAchieved).eq(0);
        expect(answer3.stateValues.currentResponses.map(x => x.tree)).eqls(['\uFF3F']);
        expect(answer3.stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(mathinput3.stateValues.value.tree).eq('\uFF3F');
        expect(mathinput3.stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Enter correct answer in all three blanks")
      cy.get(mathinput1Anchor).type(`x`).blur();
      cy.get(mathinput2Anchor).type(`x^2`).blur();
      cy.get(mathinput3Anchor).type(`x^3`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinput1Anchor).should('have.value', 'x');
      cy.get(mathinput2Anchor).should('have.value', 'x^2');
      cy.get(mathinput3Anchor).should('have.value', 'x^3');

      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '0');
      cy.get(ca3Anchor).should('have.text', '0');
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2')
      });
      cy.get(cr3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x3')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(answer1.stateValues.creditAchieved).eq(0);
        expect(answer1.stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(answer1.stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(mathinput1.stateValues.value.tree).eq('x');
        expect(mathinput1.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer2.stateValues.creditAchieved).eq(0);
        expect(answer2.stateValues.currentResponses.map(x => x.tree)).eqls([['^', 'x', 2]]);
        expect(answer2.stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(mathinput2.stateValues.value.tree).eqls(['^', 'x', 2]);
        expect(mathinput2.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer3.stateValues.creditAchieved).eq(0);
        expect(answer3.stateValues.currentResponses.map(x => x.tree)).eqls([['^', 'x', 3]]);
        expect(answer3.stateValues.submittedResponses).eqls(['\uFF3F']);
        expect(mathinput3.stateValues.value.tree).eqls(['^', 'x', 3]);
        expect(mathinput3.stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Submit answers")
      cy.get(mathinput1SubmitAnchor).click();
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput3SubmitAnchor).click();


      cy.log('Test value displayed in browser')
      cy.get(mathinput1Anchor).should('have.value', 'x');
      cy.get(mathinput2Anchor).should('have.value', 'x^2');
      cy.get(mathinput3Anchor).should('have.value', 'x^3');

      cy.get(ca1Anchor).should('have.text', '1');
      cy.get(ca2Anchor).should('have.text', '1');
      cy.get(ca3Anchor).should('have.text', '1');
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2')
      });
      cy.get(cr3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x3')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2')
      });
      cy.get(sr3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x3')
      });


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(answer1.stateValues.creditAchieved).eq(1);
        expect(answer1.stateValues.currentResponses.map(x => x.tree)).eqls(['x']);
        expect(answer1.stateValues.submittedResponses.map(x => x.tree)).eqls(['x']);
        expect(mathinput1.stateValues.value.tree).eq('x');
        expect(mathinput1.stateValues.submittedValue.tree).eq('x');
        expect(answer2.stateValues.creditAchieved).eq(1);
        expect(answer2.stateValues.currentResponses.map(x => x.tree)).eqls([['^', 'x', 2]]);
        expect(answer2.stateValues.submittedResponses.map(x => x.tree)).eqls([['^', 'x', 2]]);
        expect(mathinput2.stateValues.value.tree).eqls(['^', 'x', 2]);
        expect(mathinput2.stateValues.submittedValue.tree).eqls(['^', 'x', 2]);
        expect(answer3.stateValues.creditAchieved).eq(1);
        expect(answer3.stateValues.currentResponses.map(x => x.tree)).eqls([['^', 'x', 3]]);
        expect(answer3.stateValues.submittedResponses.map(x => x.tree)).eqls([['^', 'x', 3]]);
        expect(mathinput3.stateValues.value.tree).eqls(['^', 'x', 3]);
        expect(mathinput3.stateValues.submittedValue.tree).eqls(['^', 'x', 3]);
      });

      cy.log("Enter wrong answers")
      cy.get(mathinput1Anchor).clear().type(`u`).blur();
      cy.get(mathinput2Anchor).clear().type(`v`).blur();
      cy.get(mathinput3Anchor).clear().type(`w`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinput1Anchor).should('have.value', 'u');
      cy.get(mathinput2Anchor).should('have.value', 'v');
      cy.get(mathinput3Anchor).should('have.value', 'w');

      cy.get(ca1Anchor).should('have.text', '1');
      cy.get(ca2Anchor).should('have.text', '1');
      cy.get(ca3Anchor).should('have.text', '1');

      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('u')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('v')
      });
      cy.get(cr3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('w')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2')
      });
      cy.get(sr3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x3')
      });


      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(answer1.stateValues.creditAchieved).eq(1);
        expect(answer1.stateValues.currentResponses.map(x => x.tree)).eqls(['u']);
        expect(answer1.stateValues.submittedResponses.map(x => x.tree)).eqls(['x']);
        expect(mathinput1.stateValues.value.tree).eq('u');
        expect(mathinput1.stateValues.submittedValue.tree).eq('x');
        expect(answer2.stateValues.creditAchieved).eq(1);
        expect(answer2.stateValues.currentResponses.map(x => x.tree)).eqls(['v']);
        expect(answer2.stateValues.submittedResponses.map(x => x.tree)).eqls([['^', 'x', 2]]);
        expect(mathinput2.stateValues.value.tree).eq('v');
        expect(mathinput2.stateValues.submittedValue.tree).eqls(['^', 'x', 2]);
        expect(answer3.stateValues.creditAchieved).eq(1);
        expect(answer3.stateValues.currentResponses.map(x => x.tree)).eqls(['w']);
        expect(answer3.stateValues.submittedResponses.map(x => x.tree)).eqls([['^', 'x', 3]]);
        expect(mathinput3.stateValues.value.tree).eq('w');
        expect(mathinput3.stateValues.submittedValue.tree).eqls(['^', 'x', 3]);
      });


      cy.log("Submit answers")
      cy.get(mathinput1SubmitAnchor).click();
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput3SubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinput1Anchor).should('have.value', 'u');
      cy.get(mathinput2Anchor).should('have.value', 'v');
      cy.get(mathinput3Anchor).should('have.value', 'w');

      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '0');
      cy.get(ca3Anchor).should('have.text', '0');

      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('u')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('v')
      });
      cy.get(cr3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('w')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('u')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('v')
      });
      cy.get(sr3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('w')
      });

      cy.log('Test internal values')
      cy.window().then((win) => {
        expect(answer1.stateValues.creditAchieved).eq(0);
        expect(answer1.stateValues.currentResponses.map(x => x.tree)).eqls(['u']);
        expect(answer1.stateValues.submittedResponses.map(x => x.tree)).eqls(['u']);
        expect(mathinput1.stateValues.value.tree).eq('u');
        expect(mathinput1.stateValues.submittedValue.tree).eq('u');
        expect(answer2.stateValues.creditAchieved).eq(0);
        expect(answer2.stateValues.currentResponses.map(x => x.tree)).eqls(['v']);
        expect(answer2.stateValues.submittedResponses.map(x => x.tree)).eqls(['v']);
        expect(mathinput2.stateValues.value.tree).eq('v');
        expect(mathinput2.stateValues.submittedValue.tree).eq('v');
        expect(answer3.stateValues.creditAchieved).eq(0);
        expect(answer3.stateValues.currentResponses.map(x => x.tree)).eqls(['w']);
        expect(answer3.stateValues.submittedResponses.map(x => x.tree)).eqls(['w']);
        expect(mathinput3.stateValues.value.tree).eq('w');
        expect(mathinput3.stateValues.submittedValue.tree).eq('w');
      });

    })
  });

  it('integrated submit buttons', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer>
    <award>x+y</award>
    <award credit="0.3215">x+z</award>
  </answer></p>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputPreviewAnchor = '#' + mathinputName + '_input_preview';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';

      cy.get(mathinputAnchor).should('have.value', '');
      cy.get(mathinputPreviewAnchor).should('not.be.visible')
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`);
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Press enter")
      cy.get(mathinputAnchor).type(`{enter}`);
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      })
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Add letter")
      cy.get(mathinputAnchor).type(`z`);
      cy.get(mathinputAnchor).should('have.value', 'x+yz');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+yz')
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete letter")
      cy.get(mathinputAnchor).type(`{backspace}`);
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      })
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete more")
      cy.get(mathinputAnchor).type(`{backspace}{backspace}`);
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Back to correct")
      cy.get(mathinputAnchor).type(`+y`);
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      })
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete again")
      cy.get(mathinputAnchor).type(`{backspace}{backspace}`);
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Press enter on submit button")
      cy.get(mathinputSubmitAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputPreviewAnchor).should('not.be.visible')
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Add letter")
      cy.get(mathinputAnchor).type(`a`);
      cy.get(mathinputAnchor).should('have.value', 'xa');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xa')
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete letter")
      cy.get(mathinputAnchor).type(`{backspace}`);
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      })
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete all")
      cy.get(mathinputAnchor).type(`{backspace}`);
      cy.get(mathinputAnchor).should('have.value', '');
      cy.get(mathinputPreviewAnchor).should('not.be.visible')
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');


      cy.log("Restore incorrect submitted answer")
      cy.get(mathinputAnchor).type(`x`);
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      })
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Enter partially correct answer")
      cy.get(mathinputAnchor).type(`+z`);
      cy.get(mathinputAnchor).should('have.value', 'x+z');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+z')
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Click submit button")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputAnchor).should('have.value', 'x+z');
      cy.get(mathinputPreviewAnchor).should('not.be.visible')
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('have.text', '32 %');

      cy.log("Add letter")
      cy.get(mathinputAnchor).type(`z`);
      cy.get(mathinputAnchor).should('have.value', 'x+zz');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+zz')
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete letter")
      cy.get(mathinputAnchor).type(`{backspace}`);
      cy.get(mathinputAnchor).should('have.value', 'x+z');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+z')
      })
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('have.text', '32 %');

      cy.log("Delete more")
      cy.get(mathinputAnchor).type(`{backspace}{backspace}`);
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Back to partial")
      cy.get(mathinputAnchor).type(`+z`);
      cy.get(mathinputAnchor).should('have.value', 'x+z');
      cy.get(mathinputPreviewAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+z')
      })
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('have.text', '32 %');
    })
  });

  it('integrated submit buttons, text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer type="text">
    <award>hello there</award>
    <award credit="0.3215">bye</award>
  </answer></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let textinputAnchor = '#' + textinputName + '_input';
      let textinputSubmitAnchor = '#' + textinputName + '_submit';
      let textinputCorrectAnchor = '#' + textinputName + '_correct';
      let textinputIncorrectAnchor = '#' + textinputName + '_incorrect';
      let textinputPartialAnchor = '#' + textinputName + '_partial';

      cy.get(textinputAnchor).should('have.value', '');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(`hello there`);
      cy.get(textinputAnchor).should('have.value', 'hello there');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Press enter")
      cy.get(textinputAnchor).type(`{enter}`);
      cy.get(textinputAnchor).should('have.value', 'hello there');
      cy.get(textinputSubmitAnchor).should('not.exist');
      cy.get(textinputCorrectAnchor).should('be.visible');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Add letter")
      cy.get(textinputAnchor).type(`z`);
      cy.get(textinputAnchor).should('have.value', 'hello therez');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Delete letter")
      cy.get(textinputAnchor).type(`{backspace}`);
      cy.get(textinputAnchor).should('have.value', 'hello there');
      cy.get(textinputSubmitAnchor).should('not.exist');
      cy.get(textinputCorrectAnchor).should('be.visible');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Delete more")
      cy.get(textinputAnchor).type(`{backspace}{backspace}`);
      cy.get(textinputAnchor).should('have.value', 'hello the');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Back to correct")
      cy.get(textinputAnchor).type(`re`);
      cy.get(textinputAnchor).should('have.value', 'hello there');
      cy.get(textinputSubmitAnchor).should('not.exist');
      cy.get(textinputCorrectAnchor).should('be.visible');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Delete again")
      cy.get(textinputAnchor).type(`{backspace}{backspace}`);
      cy.get(textinputAnchor).should('have.value', 'hello the');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Press enter on submit button")
      cy.get(textinputSubmitAnchor).type(`{enter}`, { force: true });
      cy.get(textinputAnchor).should('have.value', 'hello the');
      cy.get(textinputSubmitAnchor).should('not.exist');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('be.visible');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Add letter")
      cy.get(textinputAnchor).type(`a`);
      cy.get(textinputAnchor).should('have.value', 'hello thea');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Delete letter")
      cy.get(textinputAnchor).type(`{backspace}`);
      cy.get(textinputAnchor).should('have.value', 'hello the');
      cy.get(textinputSubmitAnchor).should('not.exist');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('be.visible');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Delete all")
      cy.get(textinputAnchor).clear();
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');


      cy.log("Restore incorrect submitted answer")
      cy.get(textinputAnchor).type(`hello the`);
      cy.get(textinputAnchor).should('have.value', 'hello the');
      cy.get(textinputSubmitAnchor).should('not.exist');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('be.visible');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Enter partially correct answer")
      cy.get(textinputAnchor).clear().type(`bye`);
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Click submit button")
      cy.get(textinputSubmitAnchor).click();
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get(textinputSubmitAnchor).should('not.exist');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('have.text', '32 %');

      cy.log("Add letter")
      cy.get(textinputAnchor).type(`z`);
      cy.get(textinputAnchor).should('have.value', 'byez');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Delete letter")
      cy.get(textinputAnchor).type(`{backspace}`);
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get(textinputSubmitAnchor).should('not.exist');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('have.text', '32 %');

      cy.log("Delete more")
      cy.get(textinputAnchor).type(`{backspace}{backspace}`);
      cy.get(textinputAnchor).should('have.value', 'b');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Back to partial")
      cy.get(textinputAnchor).type(`ye`);
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get(textinputSubmitAnchor).should('not.exist');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('have.text', '32 %');
    })
  });

  it('submit buttons with two answer blanks', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p><answer>Enter values that sum to <m>3x</m>: <mathinput/> <mathinput/>
  <award><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3x</math></if></award>
  <award credit="0.5"><if><math><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math> = <math>3</math></if></award>
  </answer></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

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


    cy.log("Don't lose track this is correct answer")
    cy.get('#\\/_mathinput1_input').blur();
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
    cy.get('#\\/_answer1_submit').type("{enter}", { force: true });
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
        <text>a</text>
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

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

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


    cy.log("Don't lose track this is correct answer")
    cy.get('#\\/_textinput2_input').type('{backspace}');
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
    cy.get('#\\/_answer1_submit').type("{enter}", { force: true });
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
    <text>a</text>
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

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

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
  <text>a</text>
  <p>The animal is a <answer>
  <choiceinput inline>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>.</p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    let indexByName = {};
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').select(`dog`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').select(`cat`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50 %');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });

  });

  it('answer with inline choiceinput, fixedorder', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p>The animal is a <answer>
  <choiceinput inline fixedorder>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>.</p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get('#\\/_choiceinput1').should('have.text', 'catdogmonkey');

    let indexByName = { cat: 1, dog: 2, monkey: 3 };
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        expect(indexByName[val]).eq(ind + 1);
      }

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').select(`dog`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').select(`cat`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50 %');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });

  });

  it('answer with sugared inline choiceinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p>The animal is a <answer inline>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </answer>.</p>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let choiceinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName;
      let choiceinputAnchor = '#' + choiceinputName;
      let choiceinputSubmitAnchor = '#' + choiceinputName + '_submit';
      let choiceinputCorrectAnchor = '#' + choiceinputName + '_correct';
      let choiceinputIncorrectAnchor = '#' + choiceinputName + '_incorrect';
      let choiceinputPartialAnchor = '#' + choiceinputName + '_partial';

      cy.get(choiceinputAnchor).should('have.value', '');
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      let indexByName = {};
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        for (let [ind, val] of components[choiceinputName].stateValues.choiceTexts.entries()) {
          indexByName[val] = ind + 1;
        }

        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls([]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls([]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([]);

      });

      cy.log("Select correct answer")
      cy.get(choiceinputAnchor).select(`dog`);
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["dog"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls([]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([]);
      });

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputSubmitAnchor).should('not.exist');
      cy.get(choiceinputCorrectAnchor).should('be.visible');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["dog"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["dog"]]);
      });

      cy.log("Select incorrect answer")
      cy.get(choiceinputAnchor).select(`monkey`);
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["dog"]]);
      });

      cy.log("Press enter on submit button")
      cy.get(choiceinputSubmitAnchor).type(`{enter}`, { force: true });
      cy.get(choiceinputSubmitAnchor).should('not.exist');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('be.visible');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
      });

      cy.log("Select partially correct answer")
      cy.get(choiceinputAnchor).select(`cat`);
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["cat"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["cat"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
      });

      cy.log("Press enter on submit button")
      cy.get(choiceinputSubmitAnchor).type(`{enter}`, { force: true });
      cy.get(choiceinputSubmitAnchor).should('not.exist');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('have.text', '50 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["cat"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["cat"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["cat"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["cat"]]);
      });
    })
  });

  it('answer with sugared inline choiceinput, fixedorder', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p>The animal is a <answer inline fixedorder>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </answer>.</p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let choiceinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName;
      let choiceinputAnchor = '#' + choiceinputName;
      let choiceinputSubmitAnchor = '#' + choiceinputName + '_submit';
      let choiceinputCorrectAnchor = '#' + choiceinputName + '_correct';
      let choiceinputIncorrectAnchor = '#' + choiceinputName + '_incorrect';
      let choiceinputPartialAnchor = '#' + choiceinputName + '_partial';

      cy.get(choiceinputAnchor).should('have.value', '');
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.get(choiceinputAnchor).should('have.text', 'catdogmonkey');

      let indexByName = { cat: 1, dog: 2, monkey: 3 };

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        for (let [ind, val] of components[choiceinputName].stateValues.choiceTexts.entries()) {
          expect(indexByName[val]).eq(ind + 1);
        }

        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls([]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls([]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([]);

      });

      cy.log("Select correct answer")
      cy.get(choiceinputAnchor).select(`dog`);
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["dog"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls([]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([]);
      });

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputSubmitAnchor).should('not.exist');
      cy.get(choiceinputCorrectAnchor).should('be.visible');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["dog"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["dog"]]);
      });

      cy.log("Select incorrect answer")
      cy.get(choiceinputAnchor).select(`monkey`);
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["dog"]]);
      });

      cy.log("Press enter on submit button")
      cy.get(choiceinputSubmitAnchor).type(`{enter}`, { force: true });
      cy.get(choiceinputSubmitAnchor).should('not.exist');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('be.visible');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
      });

      cy.log("Select partially correct answer")
      cy.get(choiceinputAnchor).select(`cat`);
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["cat"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["cat"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
      });

      cy.log("Press enter on submit button")
      cy.get(choiceinputSubmitAnchor).type(`{enter}`, { force: true });
      cy.get(choiceinputSubmitAnchor).should('not.exist');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('have.text', '50 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["cat"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["cat"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["cat"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["cat"]]);
      });
    })
  });

  it('answer with block choiceinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
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

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

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

      for (let [ind, val] of components['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);

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
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);
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
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
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
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
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
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });

  });

  it('answer with sugared block choiceinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p>The animal is a:</p>
  <answer>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </answer>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let choiceinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName;
      let choiceinputAnchor = '#' + choiceinputName;
      let choiceinputSubmitAnchor = '#' + choiceinputName + '_submit';
      let choiceinputCorrectAnchor = '#' + choiceinputName + '_correct';
      let choiceinputIncorrectAnchor = '#' + choiceinputName + '_incorrect';
      let choiceinputPartialAnchor = '#' + choiceinputName + '_partial';

      cy.get(choiceinputAnchor).should('have.value', '');
      cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('check work')
      })
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      let indexByName = {};
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        for (let [ind, val] of components[choiceinputName].stateValues.choiceTexts.entries()) {
          indexByName[val] = ind + 1;
        }

        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls([]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls([]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([]);

      });

      cy.log("Select correct answer")
      cy.get(choiceinputAnchor).contains(`dog`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('check work')
      })
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["dog"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls([]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([]);
      });

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputSubmitAnchor).should('not.exist');
      cy.get(choiceinputCorrectAnchor).invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('correct')
      })
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["dog"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["dog"]]);
      });

      cy.log("Select incorrect answer")
      cy.get(choiceinputAnchor).contains(`monkey`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('check work')
      })
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["dog"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["dog"]]);
      });

      cy.log("Press enter on submit button")
      cy.get(choiceinputSubmitAnchor).type(`{enter}`, { force: true });
      cy.get(choiceinputSubmitAnchor).should('not.exist');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('incorrect')
      });
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
      });

      cy.log("Select partially correct answer")
      cy.get(choiceinputAnchor).contains(`cat`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('check work')
      })
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('not.exist');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["cat"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["cat"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["monkey"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
      });

      cy.log("Press enter on submit button")
      cy.get(choiceinputSubmitAnchor).type(`{enter}`, { force: true });
      cy.get(choiceinputSubmitAnchor).should('not.exist');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('50% correct')
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(components[choiceinputName].stateValues.selectedValues).eqls(["cat"]);
        expect(components[choiceinputName].stateValues.selectedIndices).eqls([indexByName["cat"]]);
        expect(components[choiceinputName].stateValues.submittedValues).eqls(["cat"]);
        expect(components[choiceinputName].stateValues.submittedIndices).eqls([indexByName["cat"]]);
      });
    })
  });

  it.only('answer with variable number of choices', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
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

    <text>a</text>

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_choiceinput1'].stateValues.choiceTexts.length).eq(3);
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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
      expect(components['/_choiceinput1'].stateValues.choiceTexts.length).eq(4);
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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
      expect(components['/_choiceinput1'].stateValues.choiceTexts.length).eq(3);
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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
      expect(components['/_choiceinput1'].stateValues.choiceTexts.length).eq(6);
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
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

    cy.get(choiceinputAnchor).should('have.value', '');
    cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Select correct answer")
    cy.get(choiceinputAnchor).contains(`dog`).click({ force: true });
    cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Click submit button")
    cy.get(choiceinputSubmitAnchor).click();
    cy.get(choiceinputSubmitAnchor).should('not.exist');
    cy.get(choiceinputCorrectAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log('Change partial credit for cat')
    cy.get('#\\/catcredit_input').clear().type('0.4{enter}')
    cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Click submit button")
    cy.get(choiceinputSubmitAnchor).click();
    cy.get(choiceinputSubmitAnchor).should('not.exist');
    cy.get(choiceinputCorrectAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log('Change last choice')
    cy.get('#\\/last_input').clear().type('mouse{enter}')
    cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Click submit button")
    cy.get(choiceinputSubmitAnchor).click();
    cy.get(choiceinputSubmitAnchor).should('not.exist');
    cy.get(choiceinputCorrectAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');


    cy.log("Select partially correct answer")
    cy.get(choiceinputAnchor).contains(`cat`).click({ force: true });
    cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Press enter on submit button")
    cy.get(choiceinputSubmitAnchor).type(`{enter}`, { force: true });
    cy.get(choiceinputSubmitAnchor).should('not.exist');
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.log('Change partial credit for cat')
    cy.get('#\\/catcredit_input').clear().type('0.2{enter}')
    cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Click submit button")
    cy.get(choiceinputSubmitAnchor).click();
    cy.get(choiceinputSubmitAnchor).should('not.exist');
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('20% correct')
    })


    cy.log("Select variable answer")
    cy.get(choiceinputAnchor).contains(`mouse`).click({ force: true });
    cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Press enter on submit button")
    cy.get(choiceinputSubmitAnchor).type(`{enter}`, { force: true });
    cy.get(choiceinputSubmitAnchor).should('not.exist');
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log('Change animal name')
    cy.get('#\\/last_input').clear().type('rabbit{enter}')
    cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Click submit button")
    cy.get(choiceinputSubmitAnchor).click();
    cy.get(choiceinputSubmitAnchor).should('not.exist');
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get(choiceinputPartialAnchor).should('not.exist');

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

    cy.get(choiceinputAnchor).should('have.value', '');
    cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("toggle inline")
    cy.get('#\\/inline_input').click();
    cy.get(choiceinputAnchor).should('have.value', '');
    cy.get(choiceinputSubmitAnchor).should('be.visible');
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Select correct answer")
    cy.get(choiceinputAnchor).select(`dog`);
    cy.get(choiceinputSubmitAnchor).should('be.visible');
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Click submit button")
    cy.get(choiceinputSubmitAnchor).click();
    cy.get(choiceinputSubmitAnchor).should('not.exist');
    cy.get(choiceinputCorrectAnchor).should('be.visible');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("toggle inline")
    cy.get('#\\/inline_input').click();
    cy.get(choiceinputSubmitAnchor).should('be.visible');
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Click submit button")
    cy.get(choiceinputSubmitAnchor).click();
    cy.get(choiceinputSubmitAnchor).should('not.exist');
    cy.get(choiceinputCorrectAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log('Select partial credit answer')
    cy.get(choiceinputAnchor).contains(`cat`).click({ force: true });
    cy.get(choiceinputSubmitAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Click submit button")
    cy.get(choiceinputSubmitAnchor).click();
    cy.get(choiceinputSubmitAnchor).should('not.exist');
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("toggle inline")
    cy.get('#\\/inline_input').click();
    cy.get(choiceinputSubmitAnchor).should('be.visible');
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('not.exist');

    cy.log("Click submit button")
    cy.get(choiceinputSubmitAnchor).click();
    cy.get(choiceinputSubmitAnchor).should('not.exist');
    cy.get(choiceinputCorrectAnchor).should('not.exist');
    cy.get(choiceinputIncorrectAnchor).should('not.exist');
    cy.get(choiceinputPartialAnchor).should('have.text', '50 %');

  });

  it('answer math from one string, split into options', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p>All three: <answer>x+y, (x+y)/2, (x,y)</answer></p>
  <p>Individuals: <answer splitintooptions>x+y, (x+y)/2, (x,y)</answer></p>
  <p>Credit for response 1: <ref name="ca1" prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response 1: <ref name="sr1" prop="submittedResponse">_answer1</ref></p>
  <p>Credit for response 2: <ref name="ca2" prop="creditAchieved">_answer2</ref></p>
  <p>Submitted response 2: <ref name="sr2" prop="submittedResponse">_answer2</ref></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinput1Name = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinput1Anchor = '#' + mathinput1Name + '_input';
      let mathinput2Name = components['/_answer2'].stateValues.inputDescendants[0].componentName
      let mathinput2Anchor = '#' + mathinput2Name + '_input';
      let ca1 = components['/ca1'].replacements[0];
      let ca1Anchor = '#' + ca1.componentName;
      let ca2 = components['/ca2'].replacements[0];
      let ca2Anchor = '#' + ca2.componentName;
      let sr1 = components['/sr1'].replacements[0];
      let sr1Anchor = '#' + sr1.componentName;
      let sr2 = components['/sr2'].replacements[0];
      let sr2Anchor = '#' + sr2.componentName;

      cy.get(mathinput1Anchor).should('have.value', '');
      cy.get(mathinput2Anchor).should('have.value', '');
      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '0');
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });

      cy.log("Enter first part")
      cy.get(mathinput1Anchor).type(`x+y{enter}`);
      cy.get(mathinput2Anchor).type(`x+y{enter}`);

      cy.get(mathinput1Anchor).should('have.value', 'x+y');
      cy.get(mathinput2Anchor).should('have.value', 'x+y');

      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '1');
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });

      cy.log("Enter second part")
      cy.get(mathinput1Anchor).clear().type(`x/2+y/2{enter}`);
      cy.get(mathinput2Anchor).clear().type(`x/2+y/2{enter}`);

      cy.get(mathinput1Anchor).should('have.value', 'x/2+y/2');
      cy.get(mathinput2Anchor).should('have.value', 'x/2+y/2');

      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '1');
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2+y2')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2+y2')
      });

      cy.log("Enter third part")
      cy.get(mathinput1Anchor).clear().type(`(x, y )  {enter}`);
      cy.get(mathinput2Anchor).clear().type(`(x, y )  {enter}`);

      cy.get(mathinput1Anchor).should('have.value', '(x, y )  ');
      cy.get(mathinput2Anchor).should('have.value', '(x, y )  ');

      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '1');
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(x,y)')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(x,y)')
      });

      cy.log("Enter all parts")
      cy.get(mathinput1Anchor).clear().type(`x+ y, x/2 +y/2,(x, y )  {enter}`);
      cy.get(mathinput2Anchor).clear().type(`x+ y, x/2 +y/2,(x, y )  {enter}`);

      cy.get(mathinput1Anchor).should('have.value', 'x+ y, x/2 +y/2,(x, y )  ');
      cy.get(mathinput2Anchor).should('have.value', 'x+ y, x/2 +y/2,(x, y )  ');

      cy.get(ca1Anchor).should('have.text', '1');
      cy.get(ca2Anchor).should('have.text', '0');
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y,x2+y2,(x,y)')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y,x2+y2,(x,y)')
      });

    })
  });

  it('answer text from one string, split into options', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
  <p>All three: <answer type="text">hello there, doenet, (we're almost here, but not quite)</answer></p>
  <p>Individuals: <answer type="text" splitintooptions>hello there, doenet, (we're almost here, but not quite)</answer></p>
  <p>Credit for response 1: <ref name="ca1" prop="creditAchieved">_answer1</ref></p>
  <p>Submitted response 1: <ref name="sr1" prop="submittedResponse">_answer1</ref></p>
  <p>Credit for response 2: <ref name="ca2" prop="creditAchieved">_answer2</ref></p>
  <p>Submitted response 2: <ref name="sr2" prop="submittedResponse">_answer2</ref></p>
 `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinput1Name = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let textinput1Anchor = '#' + textinput1Name + '_input';
      let textinput2Name = components['/_answer2'].stateValues.inputDescendants[0].componentName
      let textinput2Anchor = '#' + textinput2Name + '_input';
      let ca1 = components['/ca1'].replacements[0];
      let ca1Anchor = '#' + ca1.componentName;
      let ca2 = components['/ca2'].replacements[0];
      let ca2Anchor = '#' + ca2.componentName;
      let sr1 = components['/sr1'].replacements[0];
      let sr1Anchor = '#' + sr1.componentName;
      let sr2 = components['/sr2'].replacements[0];
      let sr2Anchor = '#' + sr2.componentName;

      cy.get(textinput1Anchor).should('have.value', '');
      cy.get(textinput2Anchor).should('have.value', '');
      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '0');
      cy.get(sr1Anchor).should('have.text', '＿')
      cy.get(sr2Anchor).should('have.text', '＿')

      cy.log("Enter first part")
      cy.get(textinput1Anchor).type(` hello there   {enter}`);
      cy.get(textinput2Anchor).type(` hello there   {enter}`);

      cy.get(textinput1Anchor).should('have.value', ' hello there   ');
      cy.get(textinput2Anchor).should('have.value', ' hello there   ');
      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '1');
      cy.get(sr1Anchor).should('have.text', ' hello there   ')
      cy.get(sr2Anchor).should('have.text', ' hello there   ')

      cy.log("Enter second part")
      cy.get(textinput1Anchor).clear().type(`doenet {enter}`);
      cy.get(textinput2Anchor).clear().type(`doenet {enter}`);

      cy.get(textinput1Anchor).should('have.value', 'doenet ');
      cy.get(textinput2Anchor).should('have.value', 'doenet ');
      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '1');
      cy.get(sr1Anchor).should('have.text', 'doenet ')
      cy.get(sr2Anchor).should('have.text', 'doenet ')

      cy.log("Enter third part")
      cy.get(textinput1Anchor).clear().type(`(we're almost here, but not quite)  {enter}`);
      cy.get(textinput2Anchor).clear().type(`(we're almost here, but not quite)  {enter}`);

      cy.get(textinput1Anchor).should('have.value', `(we're almost here, but not quite)  `);
      cy.get(textinput2Anchor).should('have.value', `(we're almost here, but not quite)  `);
      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '1');
      cy.get(sr1Anchor).should('have.text', `(we're almost here, but not quite)  `)
      cy.get(sr2Anchor).should('have.text', `(we're almost here, but not quite)  `)

      cy.log("Enter all parts")
      cy.get(textinput1Anchor).clear().type(`  hello there, doenet, (we're almost here, but not quite)    {enter}`);
      cy.get(textinput2Anchor).clear().type(`  hello there, doenet, (we're almost here, but not quite)    {enter}`);

      cy.get(textinput1Anchor).should('have.value', `  hello there, doenet, (we're almost here, but not quite)    `);
      cy.get(textinput2Anchor).should('have.value', `  hello there, doenet, (we're almost here, but not quite)    `);
      cy.get(ca1Anchor).should('have.text', '1');
      cy.get(ca2Anchor).should('have.text', '0');
      cy.get(sr1Anchor).should('have.text', `  hello there, doenet, (we're almost here, but not quite)    `)
      cy.get(sr2Anchor).should('have.text', `  hello there, doenet, (we're almost here, but not quite)    `)

    })
  });

  it('answer with incomplete awards, split into options', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <text>a</text>
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


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinput1Name = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinput1Anchor = '#' + mathinput1Name + '_input';
      let mathinput1SubmitAnchor = '#' + mathinput1Name + '_submit';
      let mathinput1CorrectAnchor = '#' + mathinput1Name + '_correct';
      let mathinput1IncorrectAnchor = '#' + mathinput1Name + '_incorrect';
      let mathinput2Name = components['/_answer2'].stateValues.inputDescendants[0].componentName
      let mathinput2Anchor = '#' + mathinput2Name + '_input';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let mathinput2CorrectAnchor = '#' + mathinput2Name + '_correct';
      let mathinput2IncorrectAnchor = '#' + mathinput2Name + '_incorrect';
      let mathinput3Name = components['/_answer3'].stateValues.inputDescendants[0].componentName
      let mathinput3Anchor = '#' + mathinput3Name + '_input';
      let mathinput3SubmitAnchor = '#' + mathinput3Name + '_submit';
      let mathinput3CorrectAnchor = '#' + mathinput3Name + '_correct';
      let mathinput3IncorrectAnchor = '#' + mathinput3Name + '_incorrect';

      cy.get(mathinput1Anchor).should('have.value', '');
      cy.get(mathinput2Anchor).should('have.value', '');
      cy.get(mathinput3Anchor).should('have.value', '');
      cy.get(mathinput1SubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');
      cy.get(mathinput3SubmitAnchor).should('be.visible');

      cy.log("Enter first option")
      cy.get(mathinput1Anchor).clear().type(`a{enter}`);
      cy.get(mathinput2Anchor).clear().type(`a{enter}`);
      cy.get(mathinput3Anchor).clear().type(`a{enter}`);
      cy.get(mathinput1CorrectAnchor).should('be.visible');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3CorrectAnchor).should('be.visible');

      cy.log("Enter second option")
      cy.get(mathinput1Anchor).clear().type(`b{enter}`);
      cy.get(mathinput2Anchor).clear().type(`b{enter}`);
      cy.get(mathinput3Anchor).clear().type(`b{enter}`);
      cy.get(mathinput1CorrectAnchor).should('be.visible');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3CorrectAnchor).should('be.visible');

      cy.log("Enter third option")
      cy.get(mathinput1Anchor).clear().type(`c{enter}`);
      cy.get(mathinput2Anchor).clear().type(`c{enter}`);
      cy.get(mathinput3Anchor).clear().type(`c{enter}`);
      cy.get(mathinput1CorrectAnchor).should('be.visible');
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3CorrectAnchor).should('be.visible');

      cy.log("Enter options as a whole")
      cy.get(mathinput1Anchor).clear().type(`a,b,c{enter}`);
      cy.get(mathinput2Anchor).clear().type(`a,b,c{enter}`);
      cy.get(mathinput3Anchor).clear().type(`a,b,c{enter}`);
      cy.get(mathinput1IncorrectAnchor).should('be.visible');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');

      cy.log("Enter first of unsplit group")
      cy.get(mathinput2Anchor).clear().type(`f{enter}`);
      cy.get(mathinput3Anchor).clear().type(`f{enter}`);
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');

      cy.log("Enter second of unsplit group")
      cy.get(mathinput2Anchor).clear().type(`g{enter}`);
      cy.get(mathinput3Anchor).clear().type(`g{enter}`);
      cy.get(mathinput2IncorrectAnchor).should('be.visible');
      cy.get(mathinput3IncorrectAnchor).should('be.visible');

      cy.log("Enter entire unsplit group")
      cy.get(mathinput2Anchor).clear().type(`f,g{enter}`);
      cy.get(mathinput3Anchor).clear().type(`f,g{enter}`);
      cy.get(mathinput2CorrectAnchor).should('be.visible');
      cy.get(mathinput3CorrectAnchor).should('be.visible');

    })
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
