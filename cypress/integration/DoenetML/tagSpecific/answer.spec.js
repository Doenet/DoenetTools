import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Answer Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('answer sugar from one string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>x+y</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='math' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/_copy1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy2'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")

      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/_copy2'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });

        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter wrong answer")
        cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}{backspace}x`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });

        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });

      })

    })
  });

  it('answer sugar from one macro', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="xy" hide>x+y</math>
  <p><answer>$xy</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='math' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/_copy1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy2'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")

      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/_copy2'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });

        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter wrong answer")
        cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}{backspace}x`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });

        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });

      })

    })
  });

  it('answer sugar from macros and string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup><math name="x">x</math><math name="y">y</math></setup>
  <p><answer>$x+$y</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='math' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/_copy1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy2'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")

      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/_copy2'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });

        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter wrong answer")
        cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}{backspace}x`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });

        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });

      })

    })
  });

  it('answer sugar from one string, set to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text">hello there</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='text' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let text1 = components['/_copy1'].replacements[0];
      let text1Anchor = cesc('#' + text1.componentName);
      let text2 = components['/_copy2'].replacements[0];
      let text2Anchor = cesc('#' + text2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq('');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      // wrap to change value of text2Anchor
      cy.window().then(async (win) => {
        text2 = components['/_copy2'].replacements[0];
        text2Anchor = cesc('#' + text2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', ' hello there ');
        cy.get(text1Anchor).should('have.text', ' hello there ')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq(' hello there ');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });


        cy.log("Enter wrong answer")
        cy.get(textinputAnchor).clear().type(`hello  there`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });

        cy.log("Submit answer")
        cy.get(textinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', 'hello  there')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
        });
      })
    })
  });

  it('answer sugar from one macro, set to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <text name='h'>hello there</text>
  <p><answer type="text">$h</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='text' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let text1 = components['/_copy1'].replacements[0];
      let text1Anchor = cesc('#' + text1.componentName);
      let text2 = components['/_copy2'].replacements[0];
      let text2Anchor = cesc('#' + text2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq('');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      // wrap to change value of text2Anchor
      cy.window().then(async (win) => {
        text2 = components['/_copy2'].replacements[0];
        text2Anchor = cesc('#' + text2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', ' hello there ');
        cy.get(text1Anchor).should('have.text', ' hello there ')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq(' hello there ');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });


        cy.log("Enter wrong answer")
        cy.get(textinputAnchor).clear().type(`hello  there`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });

        cy.log("Submit answer")
        cy.get(textinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', 'hello  there')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
        });
      })
    })
  });

  it('answer sugar from macro and string, set to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup><text name="h">hello</text></setup>
  <p><answer type="text">$h there</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='text' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let text1 = components['/_copy1'].replacements[0];
      let text1Anchor = cesc('#' + text1.componentName);
      let text2 = components['/_copy2'].replacements[0];
      let text2Anchor = cesc('#' + text2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq('');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      // wrap to change value of text2Anchor
      cy.window().then(async (win) => {
        text2 = components['/_copy2'].replacements[0];
        text2Anchor = cesc('#' + text2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', ' hello there ');
        cy.get(text1Anchor).should('have.text', ' hello there ')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq(' hello there ');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });


        cy.log("Enter wrong answer")
        cy.get(textinputAnchor).clear().type(`hello  there`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });

        cy.log("Submit answer")
        cy.get(textinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', 'hello  there')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
        });
      })
    })
  });

  it('answer sugar from macros and string, ignores blank string, set to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup><text name="h">hello</text><text name="t">there</text></setup>
  <p><answer type="text">$h $t</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='text' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let text1 = components['/_copy1'].replacements[0];
      let text1Anchor = cesc('#' + text1.componentName);
      let text2 = components['/_copy2'].replacements[0];
      let text2Anchor = cesc('#' + text2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq('');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hellothere `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hellothere ');
      cy.get(text1Anchor).should('have.text', ' hellothere ')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hellothere ']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq(' hellothere ');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      // wrap to change value of text2Anchor
      cy.window().then(async (win) => {
        text2 = components['/_copy2'].replacements[0];
        text2Anchor = cesc('#' + text2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', ' hellothere ');
        cy.get(text1Anchor).should('have.text', ' hellothere ')
        cy.get(text2Anchor).should('have.text', ' hellothere ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hellothere ']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hellothere ']);
          expect(components[textinputName].stateValues.value).eq(' hellothere ');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hellothere ');
        });


        cy.log("Enter wrong answer")
        cy.get(textinputAnchor).clear().type(`hello there`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello there');
        cy.get(text1Anchor).should('have.text', 'hello there')
        cy.get(text2Anchor).should('have.text', ' hellothere ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hellothere ']);
          expect(components[textinputName].stateValues.value).eq('hello there');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hellothere ');
        });

        cy.log("Submit answer")
        cy.get(textinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello there');
        cy.get(text1Anchor).should('have.text', 'hello there')
        cy.get(text2Anchor).should('have.text', 'hello there')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['hello there']);
          expect(components[textinputName].stateValues.value).eq('hello there');
          // expect(components[textinputName].stateValues.submittedValue).eq('hello there');
        });
      })
    })
  });

  // test for bug where submitted response was not initially text
  // when had only one copy of referring to all submitted responses
  it('answer sugar from one string, set to text, copy all responses', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text">hello there</answer></p>
  <p>Submitted responses: <copy prop="submittedResponses" target="_answer1" componentType="text" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.get('#\\/_p2').should('have.text', 'Submitted responses: ')

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there {enter}`)

      cy.get('#\\/_p2').should('have.text', 'Submitted responses:  hello there ')

      cy.window().then(async (win) => {
        let text1 = components['/_copy1'].replacements[0];
        let text1Anchor = cesc('#' + text1.componentName);
        cy.get(textinputAnchor).should('have.value', ' hello there ');
        cy.get(text1Anchor).should('have.text', ' hello there ')

        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq(' hello there ');
        });


        cy.log("Enter wrong answer")
        cy.get(textinputAnchor).clear().type(`hello  there`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', ' hello there ')

        cy.log('Test internal values')
        cy.wait(10)
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });

        cy.log("Submit answer")
        cy.get(textinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
        });
      })
    })
  });


  it('answer sugar from one string, set to boolean', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="boolean">true</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let booleaninputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let booleaninputAnchor = cesc('#' + booleaninputName + '_input');
      let booleaninputSubmitAnchor = cesc('#' + booleaninputName + '_submit');
      let boolean1 = components['/_copy1'].replacements[0];
      let boolean1Anchor = cesc('#' + boolean1.componentName);

      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(boolean1Anchor).should('have.text', 'false')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Select correct answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(boolean1Anchor).should('have.text', 'true')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([true]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Press enter on submit button to submit")
      cy.get(booleaninputSubmitAnchor).type(`{enter}`, { force: true });

      // wrap to set value of boolean2Anchor
      cy.window().then(async (win) => {
        let boolean2 = components['/_copy2'].replacements[0];
        let boolean2Anchor = cesc('#' + boolean2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'true')
        cy.get(boolean2Anchor).should('have.text', 'true')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([true]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([true]);
          expect(components[booleaninputName].stateValues.value).eq(true);
        });


        cy.log("Select wrong answer")
        cy.get(booleaninputAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'false')
        cy.get(boolean2Anchor).should('have.text', 'true')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([true]);
          expect(components[booleaninputName].stateValues.value).eq(false);
        });

        cy.log("Submit answer")
        cy.get(booleaninputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'false')
        cy.get(boolean2Anchor).should('have.text', 'false')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([false]);
          expect(components[booleaninputName].stateValues.value).eq(false);
        });
      })
    })
  });

  it('answer sugar from macro and string, set to boolean', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <boolean hide name="b">false</boolean>
  <p><answer type="boolean">not $b</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let booleaninputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let booleaninputAnchor = cesc('#' + booleaninputName + '_input');
      let booleaninputSubmitAnchor = cesc('#' + booleaninputName + '_submit');
      let boolean1 = components['/_copy1'].replacements[0];
      let boolean1Anchor = cesc('#' + boolean1.componentName);

      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(boolean1Anchor).should('have.text', 'false')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Select correct answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(boolean1Anchor).should('have.text', 'true')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([true]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Press enter on submit button to submit")
      cy.get(booleaninputSubmitAnchor).type(`{enter}`, { force: true });

      // wrap to set value of boolean2Anchor
      cy.window().then(async (win) => {
        let boolean2 = components['/_copy2'].replacements[0];
        let boolean2Anchor = cesc('#' + boolean2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'true')
        cy.get(boolean2Anchor).should('have.text', 'true')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([true]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([true]);
          expect(components[booleaninputName].stateValues.value).eq(true);
        });


        cy.log("Select wrong answer")
        cy.get(booleaninputAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'false')
        cy.get(boolean2Anchor).should('have.text', 'true')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([true]);
          expect(components[booleaninputName].stateValues.value).eq(false);
        });

        cy.log("Submit answer")
        cy.get(booleaninputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'false')
        cy.get(boolean2Anchor).should('have.text', 'false')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([false]);
          expect(components[booleaninputName].stateValues.value).eq(false);
        });
      })
    })
  });

  it('answer award with math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award><math>x+y</math></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType="math" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/_copy1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy2'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/_copy2'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter wrong answer")
        cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });

        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });

      })
    })
  });

  it('answer award with sugared string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award>x+y</award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType="math" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/_copy1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy2'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/_copy2'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter wrong answer")
        cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });

        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });

      })
    })
  });

  it('answer award with sugared macro', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="xy" hide>x+y</math>
  <p><answer><award>$xy</award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType="math" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/_copy1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy2'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/_copy2'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter wrong answer")
        cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });

        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });

      })
    })
  });

  it('answer award with sugared macros and string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup><math name="x">x</math><math name="y">y</math></setup>
  <p><answer><award>$x+$y</award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType="math" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/_copy1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy2'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/_copy2'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter wrong answer")
        cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });

        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });

      })
    })
  });

  it('answer award with math, initally unresolved', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award><math>x+y-3+<copy target="n" /></math></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType="math" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>

  <copy name="n2" target="n3" />
  <copy name="n" target="num1" />
  <math name="num1"><copy target="n2" />+<copy target="num2" /></math>
  <math name="num2"><copy target="n3" />+<copy target="num3" /></math>
  <copy name="n3" target="num3" />
  <number name="num3">1</number>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/_copy2'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy3'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/_copy4'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/_copy3'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter wrong answer")
        cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });

        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });

      })
    })
  });

  it('answer award with mathList', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer matchPartial><award><mathList>x+y z</mathList></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType="math" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/_copy1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy2'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y, z`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y,z')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y,z')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([["list", ['+', 'x', 'y'], "z"]]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(["list", ['+', 'x', 'y'], "z"]);
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/_copy2'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y,z')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y,z')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([["list", ['+', 'x', 'y'], "z"]]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([["list", ['+', 'x', 'y'], "z"]]);
          expect(components[mathinputName].stateValues.value.tree).eqls(["list", ['+', 'x', 'y'], "z"]);
        });


        cy.log("Enter partially correct answer")
        cy.get(mathinputAnchor).type(`{end}{leftArrow}{leftArrow}{leftArrow}{backspace}{backspace}`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x,z')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x,z')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y,z')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([["list", 'x', "z"]]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([["list", ['+', 'x', 'y'], "z"]]);
          expect(components[mathinputName].stateValues.value.tree).eqls(["list", 'x', "z"]);
        });

        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x,z')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x,z')
        });
        cy.get(number1Anchor).should('have.text', '0.5')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([["list", 'x', "z"]]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([["list", 'x', "z"]]);
          expect(components[mathinputName].stateValues.value.tree).eqls(["list", 'x', "z"]);
        });

        cy.log('Submit incorrect answer');
        cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}{backspace}{enter}`, { force: true });


        cy.log('Test value displayed in browser')
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
        });



        cy.log('Submit other partially correct answer')
        cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}z{enter}`, { force: true });

        cy.log('Test value displayed in browser')
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'z')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('z')
        });
        cy.get(number1Anchor).should('have.text', '0.5')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['z']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['z']);
          expect(components[mathinputName].stateValues.value.tree).eqls('z');
        });



      })
    })
  });

  it('answer set to text, award with text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text"><award><text>  hello there </text></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='text' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let text1 = components['/_copy1'].replacements[0];
      let text1Anchor = cesc('#' + text1.componentName);
      let text2 = components['/_copy2'].replacements[0];
      let text2Anchor = cesc('#' + text2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq('');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      // wrap to change value of text2Anchor
      cy.window().then(async (win) => {
        text2 = components['/_copy2'].replacements[0];
        text2Anchor = cesc('#' + text2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', ' hello there ');
        cy.get(text1Anchor).should('have.text', ' hello there ')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq(' hello there ');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });


        cy.log("Enter wrong answer")
        cy.get(textinputAnchor).clear().type(`hello  there`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });

        cy.log("Submit answer")
        cy.get(textinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', 'hello  there')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
        });
      })
    })
  });

  it('answer set to text, award with sugared string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text"><award>  hello there </award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='text' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let text1 = components['/_copy1'].replacements[0];
      let text1Anchor = cesc('#' + text1.componentName);
      let text2 = components['/_copy2'].replacements[0];
      let text2Anchor = cesc('#' + text2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq('');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      // wrap to change value of text2Anchor
      cy.window().then(async (win) => {
        text2 = components['/_copy2'].replacements[0];
        text2Anchor = cesc('#' + text2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', ' hello there ');
        cy.get(text1Anchor).should('have.text', ' hello there ')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq(' hello there ');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });


        cy.log("Enter wrong answer")
        cy.get(textinputAnchor).clear().type(`hello  there`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });

        cy.log("Submit answer")
        cy.get(textinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', 'hello  there')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
        });
      })
    })
  });

  it('answer set to text, award with sugared macro and string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup><text name="h">hello</text></setup>
  <p><answer type="text"><award>$h there</award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='text' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let text1 = components['/_copy1'].replacements[0];
      let text1Anchor = cesc('#' + text1.componentName);
      let text2 = components['/_copy2'].replacements[0];
      let text2Anchor = cesc('#' + text2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq('');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      // wrap to change value of text2Anchor
      cy.window().then(async (win) => {
        text2 = components['/_copy2'].replacements[0];
        text2Anchor = cesc('#' + text2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', ' hello there ');
        cy.get(text1Anchor).should('have.text', ' hello there ')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq(' hello there ');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });


        cy.log("Enter wrong answer")
        cy.get(textinputAnchor).clear().type(`hello  there`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });

        cy.log("Submit answer")
        cy.get(textinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', 'hello  there')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
        });
      })
    })
  });

  it('answer set to text, award with text, initally unresolved', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text"><award><text><copy target="n" /></text></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType="text" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>

  <copy name="n2" target="n3" />
  <copy name="n" target="text1" />
  <text name="text1"><copy target="n2" /> <copy target="text2" /></text>
  <text name="text2"><copy target="n4" /></text>
  <copy name="n3" target="text3" />
  <text name="text3">hello</text>
  <copy name="n4" target="text4" />
  <text name="text4">there</text>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let text1 = components['/_copy2'].replacements[0];
      let text1Anchor = cesc('#' + text1.componentName);
      let text2 = components['/_copy3'].replacements[0];
      let text2Anchor = cesc('#' + text2.componentName);
      let number1 = components['/_copy4'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq('');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      // wrap to change value of text2Anchor
      cy.window().then(async (win) => {
        text2 = components['/_copy3'].replacements[0];
        text2Anchor = cesc('#' + text2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', ' hello there ');
        cy.get(text1Anchor).should('have.text', ' hello there ')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq(' hello there ');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });


        cy.log("Enter wrong answer")
        cy.get(textinputAnchor).clear().type(`hello  there`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });

        cy.log("Submit answer")
        cy.get(textinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello  there');
        cy.get(text1Anchor).should('have.text', 'hello  there')
        cy.get(text2Anchor).should('have.text', 'hello  there')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello  there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
          expect(components[textinputName].stateValues.value).eq('hello  there');
          // expect(components[textinputName].stateValues.submittedValue).eq('hello  there');
        });
      })
    })
  });

  it('answer set to text, award with textlist', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text"><award matchPartial><textlist>  hello there </textlist></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='text' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let text1 = components['/_copy1'].replacements[0];
      let text1Anchor = cesc('#' + text1.componentName);
      let text2 = components['/_copy2'].replacements[0];
      let text2Anchor = cesc('#' + text2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq('');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello  , there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello  , there ');
      cy.get(text1Anchor).should('have.text', ' hello  , there ')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello  , there ']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq(' hello  , there ');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      // wrap to change value of text2Anchor
      cy.window().then(async (win) => {
        text2 = components['/_copy2'].replacements[0];
        text2Anchor = cesc('#' + text2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', ' hello  , there ');
        cy.get(text1Anchor).should('have.text', ' hello  , there ')
        cy.get(text2Anchor).should('have.text', ' hello  , there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello  , there ']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello  , there ']);
          expect(components[textinputName].stateValues.value).eq(' hello  , there ');
        });


        cy.log("Enter partially correct answer")
        cy.get(textinputAnchor).clear().type(`hello,then`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello,then');
        cy.get(text1Anchor).should('have.text', 'hello,then')
        cy.get(text2Anchor).should('have.text', ' hello  , there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello,then']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello  , there ']);
          expect(components[textinputName].stateValues.value).eq('hello,then');
        });

        cy.log("Submit answer")
        cy.get(textinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello,then');
        cy.get(text1Anchor).should('have.text', 'hello,then')
        cy.get(text2Anchor).should('have.text', 'hello,then')
        cy.get(number1Anchor).should('have.text', '0.5')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello,then']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['hello,then']);
          expect(components[textinputName].stateValues.value).eq('hello,then');
        });


        cy.log("Submit incorrect answer")
        cy.get(textinputAnchor).clear().type(`hello there{enter}`);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'hello there');
        cy.get(text1Anchor).should('have.text', 'hello there')
        cy.get(text2Anchor).should('have.text', 'hello there')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['hello there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['hello there']);
          expect(components[textinputName].stateValues.value).eq('hello there');
        });


        cy.log("Submit other partially correct answer")
        cy.get(textinputAnchor).clear().type(`there{enter}`);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'there');
        cy.get(text1Anchor).should('have.text', 'there')
        cy.get(text2Anchor).should('have.text', 'there')
        cy.get(number1Anchor).should('have.text', '0.5')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['there']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['there']);
          expect(components[textinputName].stateValues.value).eq('there');
        });


      })
    })
  });

  it('answer set to boolean, award with boolean', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="boolean"><award><boolean>true</boolean></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let booleaninputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let booleaninputAnchor = cesc('#' + booleaninputName + '_input');
      let booleaninputSubmitAnchor = cesc('#' + booleaninputName + '_submit');
      let boolean1 = components['/_copy1'].replacements[0];
      let boolean1Anchor = cesc('#' + boolean1.componentName);

      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(boolean1Anchor).should('have.text', 'false')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Select correct answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(boolean1Anchor).should('have.text', 'true')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([true]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Press enter on submit button to submit")
      cy.get(booleaninputSubmitAnchor).type(`{enter}`, { force: true });

      // wrap to set value of boolean2Anchor
      cy.window().then(async (win) => {
        let boolean2 = components['/_copy2'].replacements[0];
        let boolean2Anchor = cesc('#' + boolean2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'true')
        cy.get(boolean2Anchor).should('have.text', 'true')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([true]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([true]);
          expect(components[booleaninputName].stateValues.value).eq(true);
        });


        cy.log("Select wrong answer")
        cy.get(booleaninputAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'false')
        cy.get(boolean2Anchor).should('have.text', 'true')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([true]);
          expect(components[booleaninputName].stateValues.value).eq(false);
        });

        cy.log("Submit answer")
        cy.get(booleaninputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'false')
        cy.get(boolean2Anchor).should('have.text', 'false')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([false]);
          expect(components[booleaninputName].stateValues.value).eq(false);
        });
      })
    })
  });

  it('answer set to boolean, award with sugared macro and string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <boolean hide name="b">false</boolean>
  <p><answer type="boolean"><award>not $b</award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let booleaninputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let booleaninputAnchor = cesc('#' + booleaninputName + '_input');
      let booleaninputSubmitAnchor = cesc('#' + booleaninputName + '_submit');
      let boolean1 = components['/_copy1'].replacements[0];
      let boolean1Anchor = cesc('#' + boolean1.componentName);

      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(boolean1Anchor).should('have.text', 'false')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Select correct answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(boolean1Anchor).should('have.text', 'true')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([true]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Press enter on submit button to submit")
      cy.get(booleaninputSubmitAnchor).type(`{enter}`, { force: true });

      // wrap to set value of boolean2Anchor
      cy.window().then(async (win) => {
        let boolean2 = components['/_copy2'].replacements[0];
        let boolean2Anchor = cesc('#' + boolean2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'true')
        cy.get(boolean2Anchor).should('have.text', 'true')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([true]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([true]);
          expect(components[booleaninputName].stateValues.value).eq(true);
        });


        cy.log("Select wrong answer")
        cy.get(booleaninputAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'false')
        cy.get(boolean2Anchor).should('have.text', 'true')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([true]);
          expect(components[booleaninputName].stateValues.value).eq(false);
        });

        cy.log("Submit answer")
        cy.get(booleaninputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(boolean1Anchor).should('have.text', 'false')
        cy.get(boolean2Anchor).should('have.text', 'false')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([false]);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([false]);
          expect(components[booleaninputName].stateValues.value).eq(false);
        });
      })
    })
  });

  it('answer multiple shortcut awards', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award><math>x+y</math></award><award credit="0.5"><math>x</math></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType="math" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/_copy1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy2'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/_copy2'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter partially correct answer")
        cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0.5')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });


        cy.log("Enter incorrect answer")
        // cy.get(mathinputAnchor);
        cy.get(mathinputAnchor).type(`{end}{backspace}y`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'y');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'y')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0.5')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['y']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('y');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });


        cy.log("Submit answer")
        cy.get(mathinputAnchor).type(`{enter}`, { force: true });

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        });
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['y']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['y']);
          expect(components[mathinputName].stateValues.value.tree).eqls('y');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('y');
        });
      })

    })
  });

  it('answer multiple shortcut awards, initially unresolved', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award><math><copy target="rightAnswer" /></math></award><award credit="0.5"><math>x-3+<copy target="n" /></math></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='math' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>

  <math name="rightAnswer">x+y-3+<copy target="n" /></math>
  <copy name="n2" target="n3" />
  <copy name="n" target="num1" />
  <math name="num1"><copy target="n2" />+<copy target="num2" /></math>
  <math name="num2"><copy target="n3" />+<copy target="num3" /></math>
  <copy name="n3" target="num3" />
  <number name="num3">1</number>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/_copy3'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy4'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/_copy5'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/_copy4'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter partially correct answer")
        cy.get(mathinputAnchor).type(`{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0.5')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });


        cy.log("Enter incorrect answer")
        cy.get(mathinputAnchor).type(`{rightarrow}{backspace}y`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'y');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'y')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0.5')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['y']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('y');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });


        cy.log("Submit answer")
        cy.get(mathinputAnchor).type(`{enter}`, { force: true });

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        });
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['y']);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['y']);
          expect(components[mathinputName].stateValues.value.tree).eqls('y');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('y');
        });

      })
    })
  });

  it('answer multiple awards, set to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text"><award><text>hello there</text></award><award credit="0.5"><text>bye</text></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='text' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let text1 = components['/_copy1'].replacements[0];
      let text1Anchor = cesc('#' + text1.componentName);
      let text2 = components['/_copy2'].replacements[0];
      let text2Anchor = cesc('#' + text2.componentName);
      let number1 = components['/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(text1Anchor).should('have.text', '')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq('');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get(text1Anchor).should('have.text', ' hello there ')
      cy.get(text2Anchor).should('have.text', '')
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[textinputName].stateValues.value).eq(' hello there ');
        // expect(components[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      // wrap to change value of text2Anchor
      cy.window().then(async (win) => {
        text2 = components['/_copy2'].replacements[0];
        text2Anchor = cesc('#' + text2.componentName);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', ' hello there ');
        cy.get(text1Anchor).should('have.text', ' hello there ')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls([' hello there ']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq(' hello there ');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });


        cy.log("Enter partially correct answer")
        cy.get(textinputAnchor).clear().type(`bye`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'bye');
        cy.get(text1Anchor).should('have.text', 'bye')
        cy.get(text2Anchor).should('have.text', ' hello there ')
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['bye']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
          expect(components[textinputName].stateValues.value).eq('bye');
          // expect(components[textinputName].stateValues.submittedValue).eq(' hello there ');
        });

        cy.log("Submit answer")
        cy.get(textinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'bye');
        cy.get(text1Anchor).should('have.text', 'bye')
        cy.get(text2Anchor).should('have.text', 'bye')
        cy.get(number1Anchor).should('have.text', '0.5')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['bye']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['bye']);
          expect(components[textinputName].stateValues.value).eq('bye');
          // expect(components[textinputName].stateValues.submittedValue).eq('bye');
        });


        cy.log("Enter incorrect answer")
        cy.get(textinputAnchor).clear().type(`y`).blur();

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'y');
        cy.get(text1Anchor).should('have.text', 'y')
        cy.get(text2Anchor).should('have.text', 'bye')
        cy.get(number1Anchor).should('have.text', '0.5')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['y']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['bye']);
          expect(components[textinputName].stateValues.value).eq('y');
          // expect(components[textinputName].stateValues.submittedValue).eq('bye');
        });

        cy.log("Submit answer")
        cy.get(textinputAnchor).type(`{enter}`);

        cy.log('Test value displayed in browser')
        cy.get(textinputAnchor).should('have.value', 'y');
        cy.get(text1Anchor).should('have.text', 'y')
        cy.get(text2Anchor).should('have.text', 'y')
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['y']);
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['y']);
          expect(components[textinputName].stateValues.value).eq('y');
          // expect(components[textinputName].stateValues.submittedValue).eq('y');
        });
      })
    })
  });

  it('answer multiple awards, namespaces', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <section name="s" newNamespace>
  <p><answer newNamespace>
    <award newNamespace><math>x+y</math></award>
    <award credit="0.5" newNamespace><math>x</math></award>
  </answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType='math' /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" /></p>
  </section>

  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/s/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let math1 = components['/s/_copy1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/s/_copy2'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);
      let number1 = components['/s/_copy3'].replacements[0];
      let number1Anchor = cesc('#' + number1.componentName);

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/s/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/s/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await components['/s/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eq('\uFF3F');
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x+y')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(number1Anchor).should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/s/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/s/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
        expect(await components['/s/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
        // expect(components[mathinputName].stateValues.submittedValue.tree).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of math2Anchor
      cy.window().then(async (win) => {
        math2 = components['/s/_copy2'].replacements[0];
        math2Anchor = cesc('#' + math2.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/s/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/s/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect((await components['/s/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls(['+', 'x', 'y']);
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter partially correct answer")
        cy.get(mathinputAnchor).type(`{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'x')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get(number1Anchor).should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/s/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/s/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/s/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([['+', 'x', 'y']]);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls(['+', 'x', 'y']);
        });


        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0.5')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/s/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/s/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await components['/s/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('x');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });


        cy.log("Enter incorrect answer")
        cy.get(mathinputAnchor).type(`{rightarrow}{backspace}y`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'y');
        cy.get(math1Anchor + ' .mjx-mrow').should('have.text', 'y')
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(number1Anchor).should('have.text', '0.5')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/s/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/s/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['y']);
          expect((await components['/s/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(components[mathinputName].stateValues.value.tree).eqls('y');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('x');
        });


        cy.log("Submit answer")
        cy.get(mathinputAnchor).type(`{enter}`, { force: true });

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'y');
        cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        });
        cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y')
        });
        cy.get(number1Anchor).should('have.text', '0')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/s/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/s/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['y']);
          expect((await components['/s/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['y']);
          expect(components[mathinputName].stateValues.value.tree).eqls('y');
          // expect(components[mathinputName].stateValues.submittedValue.tree).eqls('y');
        });
      })

    })
  });

  it('full answer tag', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Enter values that sum to <m>3x</m>: <mathinput/> <mathinput/>
  <answer>
  <award><when><math><copy prop="immediateValue" target="_mathinput1" isResponse />+<copy prop="immediateValue" target="_mathinput2" isResponse /></math> = <math>3x</math></when></award>
  <award credit="0.5"><when><math><copy prop="immediateValue" target="_mathinput1" />+<copy prop="immediateValue" target="_mathinput2" /></math> = <math>3</math></when></award>
  </answer></p>
  <p>First current response: <copy name="cr" prop="currentResponse" target="_answer1" /></p>
  <p>First current response again: <copy name="cr1" prop="currentResponse1" target="_answer1" /></p>
  <p>Second current response: <copy name="cr2" prop="currentResponse2" target="_answer1" /></p>
  <p>Both current responses together: <copy name="crs" prop="currentResponses" target="_answer1" /></p>
  <p>First submitted response: <copy name="sr" prop="submittedResponse" target="_answer1" componentType="math" /></p>
  <p>First submitted response again: <copy name="sr1" prop="submittedResponse1" target="_answer1" componentType="math" /></p>
  <p>Second submitted response: <copy name="sr2" prop="submittedResponse2" target="_answer1" componentType="math" /></p>
  <p>Both submitted responses together: <copy name="srs" prop="submittedResponses" target="_answer1" /></p>
  <p>Credit for submitted responses: <copy name="ca" prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let cr = components['/cr'].replacements[0];
      let crAnchor = cesc('#' + cr.componentName);
      let cr1 = components['/cr1'].replacements[0];
      let cr1Anchor = cesc('#' + cr1.componentName);
      let cr2 = components['/cr2'].replacements[0];
      let cr2Anchor = cesc('#' + cr2.componentName);
      let crsa = components['/crs'].replacements[0];
      let crsaAnchor = cesc('#' + crsa.componentName);
      let crsb = components['/crs'].replacements[1];
      let crsbAnchor = cesc('#' + crsb.componentName);
      let sr = components['/sr'].replacements[0];
      let srAnchor = cesc('#' + sr.componentName);
      let sr1 = components['/sr1'].replacements[0];
      let sr1Anchor = cesc('#' + sr1.componentName);
      let sr2 = components['/sr2'].replacements[0];
      let sr2Anchor = cesc('#' + sr2.componentName);
      // let srsa = components['/srs'].replacements[0];
      // let srsaAnchor = cesc('#' + srsa.componentName);
      // let srsb = components['/srs'].replacements[1];
      // let srsbAnchor = cesc('#' + srsb.componentName);
      let ca = components['/ca'].replacements[0];
      let caAnchor = cesc('#' + ca.componentName);

      cy.log('Test value displayed in browser')
      // cy.get('#\\/_mathinput1_input').should('have.value', '');
      // cy.get('#\\/_mathinput2_input').should('have.value', '');

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
      // cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('＿')
      // });
      // cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('＿')
      // });
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F', '\uFF3F']);
        expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls('\uFF3F')
        expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls('\uFF3F')
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([])
        expect(await components['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
        expect(await components['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
        expect(components['/_mathinput1'].stateValues.value.tree).eq('\uFF3F');
        // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.value.tree).eq('\uFF3F');
        // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect((await cr.stateValues.value).tree).eq('\uFF3F')
        expect((await cr1.stateValues.value).tree).eq('\uFF3F')
        expect((await cr2.stateValues.value).tree).eq('\uFF3F')
        expect((await crsa.stateValues.value).tree).eq('\uFF3F')
        expect((await crsb.stateValues.value).tree).eq('\uFF3F')
        expect((await sr.stateValues.value).tree).eq('\uFF3F')
        expect((await sr1.stateValues.value).tree).eq('\uFF3F')
        expect((await sr2.stateValues.value).tree).eq('\uFF3F')
        // expect(srsa.stateValues.value.tree).eq('\uFF3F')
        // expect(srsb.stateValues.value.tree).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });

      cy.log("Enter a correct answer in")
      cy.get('#\\/_mathinput1 textarea').type(`x+y`, { force: true }).blur();
      cy.get('#\\/_mathinput2 textarea').type(`2x-y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
      // cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');

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
      // cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('＿')
      // });
      // cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('＿')
      // });
      cy.get(caAnchor).should('have.text', '0')

      // TODO: eliminate need for this wait
      cy.wait(100);

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
        expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls(["+", 'x', 'y']);
        expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([])
        expect(await components['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
        expect(await components['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(["+", 'x', 'y']);
        // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect((await cr.stateValues.value).tree).eqls(["+", 'x', 'y'])
        expect((await cr1.stateValues.value).tree).eqls(["+", 'x', 'y'])
        expect((await cr2.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect((await crsa.stateValues.value).tree).eqls(["+", 'x', 'y'])
        expect((await crsb.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect((await sr.stateValues.value).tree).eq('\uFF3F')
        expect((await sr1.stateValues.value).tree).eq('\uFF3F')
        expect((await sr2.stateValues.value).tree).eq('\uFF3F')
        // expect(srsa.stateValues.value.tree).eq('\uFF3F')
        // expect(srsb.stateValues.value.tree).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });

      cy.wait(100)

      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();

      // wrap to get submitted response anchors
      cy.window().then(async (win) => {
        sr = components['/sr'].replacements[0];
        srAnchor = cesc('#' + sr.componentName);
        sr1 = components['/sr1'].replacements[0];
        sr1Anchor = cesc('#' + sr1.componentName);
        sr2 = components['/sr2'].replacements[0];
        sr2Anchor = cesc('#' + sr2.componentName);
        let srsa = components['/srs'].replacements[0];
        let srsaAnchor = cesc('#' + srsa.componentName);
        let srsb = components['/srs'].replacements[1];
        let srsbAnchor = cesc('#' + srsb.componentName);

        cy.log('Test value displayed in browser')
        // cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
        // cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');

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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
          expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls(["+", 'x', 'y']);
          expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
          expect((await components['/_answer1'].stateValues.submittedResponse1).tree).eqls(["+", 'x', 'y']);
          expect((await components['/_answer1'].stateValues.submittedResponse2).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          expect(components['/_mathinput1'].stateValues.value.tree).eqls(["+", 'x', 'y']);
          // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls(["+", 'x', 'y']);
          expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          expect((await cr.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await cr1.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await cr2.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect((await crsa.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await crsb.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect((await sr.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await sr1.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await sr2.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect(srsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
          expect(srsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect(ca.stateValues.value).eq(1)
        });


        cy.log("Enter partially correct answer")
        cy.get('#\\/_mathinput1 textarea').type(`{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}{backspace}x`, { force: true }).blur();
        cy.get('#\\/_mathinput2 textarea').type(`{rightarrow}{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}{backspace}{backspace}3-x`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get('#\\/_mathinput1_input').should('have.value', 'x');
        // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls('x');
          expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
          expect((await components['/_answer1'].stateValues.submittedResponse1).tree).eqls(["+", 'x', 'y']);
          expect((await components['/_answer1'].stateValues.submittedResponse2).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          expect(components['/_mathinput1'].stateValues.value.tree).eqls('x');
          // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls(["+", 'x', 'y']);
          expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
          // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          expect((await cr.stateValues.value).tree).eqls('x')
          expect((await cr1.stateValues.value).tree).eqls('x')
          expect((await cr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await crsa.stateValues.value).tree).eqls('x')
          expect((await crsb.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await sr.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await sr1.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await sr2.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect(srsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
          expect(srsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect(ca.stateValues.value).eq(1)
        });

        cy.log("Submit answer")
        cy.get('#\\/_answer1_submit').click();


        cy.log('Test value displayed in browser')
        // cy.get('#\\/_mathinput1_input').should('have.value', 'x');
        // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls('x');
          expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.submittedResponse1).tree).eqls('x');
          expect((await components['/_answer1'].stateValues.submittedResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect(components['/_mathinput1'].stateValues.value.tree).eqls('x');
          // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('x');
          expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
          // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
          expect((await cr.stateValues.value).tree).eqls('x')
          expect((await cr1.stateValues.value).tree).eqls('x')
          expect((await cr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await crsa.stateValues.value).tree).eqls('x')
          expect((await crsb.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await sr.stateValues.value).tree).eqls('x')
          expect((await sr1.stateValues.value).tree).eqls('x')
          expect((await sr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect(srsa.stateValues.value.tree).eqls('x')
          expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
          expect(ca.stateValues.value).eq(0.5)
        });

        cy.log("Enter incorrect answer")
        cy.get('#\\/_mathinput1 textarea').type(`{rightarrow}{backspace}y`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get('#\\/_mathinput1_input').should('have.value', 'y');
        // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls('y');
          expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.submittedResponse1).tree).eqls('x');
          expect((await components['/_answer1'].stateValues.submittedResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect(components['/_mathinput1'].stateValues.value.tree).eqls('y');
          // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('x');
          expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
          // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
          expect((await cr.stateValues.value).tree).eqls('y')
          expect((await cr1.stateValues.value).tree).eqls('y')
          expect((await cr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await crsa.stateValues.value).tree).eqls('y')
          expect((await crsb.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await sr.stateValues.value).tree).eqls('x')
          expect((await sr1.stateValues.value).tree).eqls('x')
          expect((await sr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect(srsa.stateValues.value.tree).eqls('x')
          expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
          expect(ca.stateValues.value).eq(0.5)
        });

        cy.log("Submit answer")
        cy.get('#\\/_answer1_submit').click();

        cy.log('Test value displayed in browser')
        // cy.get('#\\/_mathinput1_input').should('have.value', 'y');
        // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls('y');
          expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.submittedResponse1).tree).eqls('y');
          expect((await components['/_answer1'].stateValues.submittedResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect(components['/_mathinput1'].stateValues.value.tree).eqls('y');
          // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('y');
          expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
          // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
          expect((await cr.stateValues.value).tree).eqls('y')
          expect((await cr1.stateValues.value).tree).eqls('y')
          expect((await cr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await crsa.stateValues.value).tree).eqls('y')
          expect((await crsb.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await sr.stateValues.value).tree).eqls('y')
          expect((await sr1.stateValues.value).tree).eqls('y')
          expect((await sr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect(srsa.stateValues.value.tree).eqls('y')
          expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
          expect(ca.stateValues.value).eq(0)
        });

      })

    })
  });

  it('full answer tag, two inputs inside answer, shorter form', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Enter values that sum to <m>3x</m>: 
  <answer>
  <mathinput /> <mathinput/>
  <award><when>$_mathinput1+$_mathinput2 = 3x</when></award>
  <award credit="0.5"><when>$_mathinput1+$_mathinput2 = 3</when></award>
  </answer></p>
  <p>First current response: <copy name="cr" prop="currentResponse" target="_answer1" /></p>
  <p>First current response again: <copy name="cr1" prop="currentResponse1" target="_answer1" /></p>
  <p>Second current response: <copy name="cr2" prop="currentResponse2" target="_answer1" /></p>
  <p>Both current responses together: <copy name="crs" prop="currentResponses" target="_answer1" /></p>
  <p>First submitted response: <copy name="sr" prop="submittedResponse" target="_answer1" componentType="math" /></p>
  <p>First submitted response again: <copy name="sr1" prop="submittedResponse1" target="_answer1" componentType="math" /></p>
  <p>Second submitted response: <copy name="sr2" prop="submittedResponse2" target="_answer1" componentType="math" /></p>
  <p>Both submitted responses together: <copy name="srs" prop="submittedResponses" target="_answer1" /></p>
  <p>Credit for submitted responses: <copy name="ca" prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let cr = components['/cr'].replacements[0];
      let crAnchor = cesc('#' + cr.componentName);
      let cr1 = components['/cr1'].replacements[0];
      let cr1Anchor = cesc('#' + cr1.componentName);
      let cr2 = components['/cr2'].replacements[0];
      let cr2Anchor = cesc('#' + cr2.componentName);
      let crsa = components['/crs'].replacements[0];
      let crsaAnchor = cesc('#' + crsa.componentName);
      let crsb = components['/crs'].replacements[1];
      let crsbAnchor = cesc('#' + crsb.componentName);
      let sr = components['/sr'].replacements[0];
      let srAnchor = cesc('#' + sr.componentName);
      let sr1 = components['/sr1'].replacements[0];
      let sr1Anchor = cesc('#' + sr1.componentName);
      let sr2 = components['/sr2'].replacements[0];
      let sr2Anchor = cesc('#' + sr2.componentName);
      // let srsa = components['/srs'].replacements[0];
      // let srsaAnchor = cesc('#' + srsa.componentName);
      // let srsb = components['/srs'].replacements[1];
      // let srsbAnchor = cesc('#' + srsb.componentName);
      let ca = components['/ca'].replacements[0];
      let caAnchor = cesc('#' + ca.componentName);

      cy.log('Test value displayed in browser')
      // cy.get('#\\/_mathinput1_input').should('have.value', '');
      // cy.get('#\\/_mathinput2_input').should('have.value', '');

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
      // cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('＿')
      // });
      // cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('＿')
      // });
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F', '\uFF3F']);
        expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls('\uFF3F')
        expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls('\uFF3F')
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([])
        expect(await components['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
        expect(await components['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
        expect(components['/_mathinput1'].stateValues.value.tree).eq('\uFF3F');
        // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.value.tree).eq('\uFF3F');
        // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect((await cr.stateValues.value).tree).eq('\uFF3F')
        expect((await cr1.stateValues.value).tree).eq('\uFF3F')
        expect((await cr2.stateValues.value).tree).eq('\uFF3F')
        expect((await crsa.stateValues.value).tree).eq('\uFF3F')
        expect((await crsb.stateValues.value).tree).eq('\uFF3F')
        expect((await sr.stateValues.value).tree).eq('\uFF3F')
        expect((await sr1.stateValues.value).tree).eq('\uFF3F')
        expect((await sr2.stateValues.value).tree).eq('\uFF3F')
        // expect(srsa.stateValues.value.tree).eq('\uFF3F')
        // expect(srsb.stateValues.value.tree).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });

      cy.log("Enter a correct answer in")
      cy.get('#\\/_mathinput1 textarea').type(`x+y`, { force: true }).blur();
      cy.get('#\\/_mathinput2 textarea').type(`2x-y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
      // cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');

      cy.get(crAnchor + ' .mjx-mrow').should('have.text', 'x+y');
      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(cr2Anchor + ' .mjx-mrow').should('have.text', '2x−y');
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
      // cy.get(srsaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('＿')
      // });
      // cy.get(srsbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('＿')
      // });
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
        expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls(["+", 'x', 'y']);
        expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([])
        expect(await components['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
        expect(await components['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(["+", 'x', 'y']);
        // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
        // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eq('\uFF3F');
        expect((await cr.stateValues.value).tree).eqls(["+", 'x', 'y'])
        expect((await cr1.stateValues.value).tree).eqls(["+", 'x', 'y'])
        expect((await cr2.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect((await crsa.stateValues.value).tree).eqls(["+", 'x', 'y'])
        expect((await crsb.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
        expect((await sr.stateValues.value).tree).eq('\uFF3F')
        expect((await sr1.stateValues.value).tree).eq('\uFF3F')
        expect((await sr2.stateValues.value).tree).eq('\uFF3F')
        // expect(srsa.stateValues.value.tree).eq('\uFF3F')
        // expect(srsb.stateValues.value.tree).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });


      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();

      // wrap to get submitted response anchors
      cy.window().then(async (win) => {
        sr = components['/sr'].replacements[0];
        srAnchor = cesc('#' + sr.componentName);
        sr1 = components['/sr1'].replacements[0];
        sr1Anchor = cesc('#' + sr1.componentName);
        sr2 = components['/sr2'].replacements[0];
        sr2Anchor = cesc('#' + sr2.componentName);
        let srsa = components['/srs'].replacements[0];
        let srsaAnchor = cesc('#' + srsa.componentName);
        let srsb = components['/srs'].replacements[1];
        let srsbAnchor = cesc('#' + srsb.componentName);

        cy.log('Test value displayed in browser')
        // cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
        // cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');

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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
          expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls(["+", 'x', 'y']);
          expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
          expect((await components['/_answer1'].stateValues.submittedResponse1).tree).eqls(["+", 'x', 'y']);
          expect((await components['/_answer1'].stateValues.submittedResponse2).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          expect(components['/_mathinput1'].stateValues.value.tree).eqls(["+", 'x', 'y']);
          // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls(["+", 'x', 'y']);
          expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          expect((await cr.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await cr1.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await cr2.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect((await crsa.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await crsb.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect((await sr.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await sr1.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await sr2.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect(srsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
          expect(srsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect(ca.stateValues.value).eq(1)
        });


        cy.log("Enter partially correct answer")
        cy.get('#\\/_mathinput1 textarea').type(`{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}{backspace}x`, { force: true }).blur();
        cy.get('#\\/_mathinput2 textarea').type(`{rightarrow}{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}{backspace}{backspace}3-x`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get('#\\/_mathinput1_input').should('have.value', 'x');
        // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

        cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get(cr2Anchor + ' .mjx-mrow').should('have.text', '3−x');
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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls('x');
          expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
          expect((await components['/_answer1'].stateValues.submittedResponse1).tree).eqls(["+", 'x', 'y']);
          expect((await components['/_answer1'].stateValues.submittedResponse2).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          expect(components['/_mathinput1'].stateValues.value.tree).eqls('x');
          // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls(["+", 'x', 'y']);
          expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
          // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
          expect((await cr.stateValues.value).tree).eqls('x')
          expect((await cr1.stateValues.value).tree).eqls('x')
          expect((await cr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await crsa.stateValues.value).tree).eqls('x')
          expect((await crsb.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await sr.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await sr1.stateValues.value).tree).eqls(["+", 'x', 'y'])
          expect((await sr2.stateValues.value).tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect(srsa.stateValues.value.tree).eqls(["+", 'x', 'y'])
          expect(srsb.stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
          expect(ca.stateValues.value).eq(1)
        });

        cy.log("Submit answer")
        cy.get('#\\/_answer1_submit').click();


        cy.log('Test value displayed in browser')
        // cy.get('#\\/_mathinput1_input').should('have.value', 'x');
        // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls('x');
          expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.submittedResponse1).tree).eqls('x');
          expect((await components['/_answer1'].stateValues.submittedResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect(components['/_mathinput1'].stateValues.value.tree).eqls('x');
          // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('x');
          expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
          // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
          expect((await cr.stateValues.value).tree).eqls('x')
          expect((await cr1.stateValues.value).tree).eqls('x')
          expect((await cr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await crsa.stateValues.value).tree).eqls('x')
          expect((await crsb.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await sr.stateValues.value).tree).eqls('x')
          expect((await sr1.stateValues.value).tree).eqls('x')
          expect((await sr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect(srsa.stateValues.value.tree).eqls('x')
          expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
          expect(ca.stateValues.value).eq(0.5)
        });

        cy.log("Enter incorrect answer")
        cy.get('#\\/_mathinput1 textarea').type(`{rightarrow}{backspace}y`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get('#\\/_mathinput1_input').should('have.value', 'y');
        // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

        cy.get(crAnchor + ' .mjx-mrow').should('have.text','y')
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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls('y');
          expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['x', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.submittedResponse1).tree).eqls('x');
          expect((await components['/_answer1'].stateValues.submittedResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect(components['/_mathinput1'].stateValues.value.tree).eqls('y');
          // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('x');
          expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
          // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
          expect((await cr.stateValues.value).tree).eqls('y')
          expect((await cr1.stateValues.value).tree).eqls('y')
          expect((await cr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await crsa.stateValues.value).tree).eqls('y')
          expect((await crsb.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await sr.stateValues.value).tree).eqls('x')
          expect((await sr1.stateValues.value).tree).eqls('x')
          expect((await sr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect(srsa.stateValues.value.tree).eqls('x')
          expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
          expect(ca.stateValues.value).eq(0.5)
        });

        cy.log("Submit answer")
        cy.get('#\\/_answer1_submit').click();

        cy.log('Test value displayed in browser')
        // cy.get('#\\/_mathinput1_input').should('have.value', 'y');
        // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses).map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.currentResponse1).tree).eqls('y');
          expect((await components['/_answer1'].stateValues.currentResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect((await components['/_answer1'].stateValues.submittedResponses).map(x => x.tree)).eqls(['y', ["+", 3, ['-', 'x']]]);
          expect((await components['/_answer1'].stateValues.submittedResponse1).tree).eqls('y');
          expect((await components['/_answer1'].stateValues.submittedResponse2).tree).eqls(["+", 3, ['-', 'x']]);
          expect(components['/_mathinput1'].stateValues.value.tree).eqls('y');
          // expect(components['/_mathinput1'].stateValues.submittedValue.tree).eqls('y');
          expect(components['/_mathinput2'].stateValues.value.tree).eqls(["+", 3, ['-', 'x']]);
          // expect(components['/_mathinput2'].stateValues.submittedValue.tree).eqls(["+", 3, ['-', 'x']]);
          expect((await cr.stateValues.value).tree).eqls('y')
          expect((await cr1.stateValues.value).tree).eqls('y')
          expect((await cr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await crsa.stateValues.value).tree).eqls('y')
          expect((await crsb.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect((await sr.stateValues.value).tree).eqls('y')
          expect((await sr1.stateValues.value).tree).eqls('y')
          expect((await sr2.stateValues.value).tree).eqls(["+", 3, ['-', 'x']])
          expect(srsa.stateValues.value.tree).eqls('y')
          expect(srsb.stateValues.value.tree).eqls(["+", 3, ['-', 'x']])
          expect(ca.stateValues.value).eq(0)
        });

      })

    })
  });

  it('full answer tag, text inputs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Enter rain and snow in either order: <textinput/> <textinput/>
  <answer>
  <award><when><text><copy prop="immediateValue" target="_textinput1" isResponse /> <copy prop="immediateValue" target="_textinput2" isResponse /></text> = <text>rain snow</text></when></award>
  <award><when><text><copy prop="immediateValue" target="_textinput1" /> <copy prop="immediateValue" target="_textinput2" /></text> = <text>snow rain</text></when></award>
  <award credit="0.5"><when><copy prop="immediateValue" target="_textinput1" /> = rain</when></award>
  <award credit="0.5"><when><copy prop="immediateValue" target="_textinput1" /> = snow</when></award>
  <award credit="0.5"><when><copy prop="immediateValue" target="_textinput2" /> = rain</when></award>
  <award credit="0.5"><when><copy prop="immediateValue" target="_textinput2" /> = snow</when></award>
  </answer></p>
  <p>First current response: <copy name="cr" prop="currentResponse" target="_answer1" /></p>
  <p>First current response again: <copy name="cr1" prop="currentResponse1" target="_answer1" /></p>
  <p>Second current response: <copy name="cr2" prop="currentResponse2" target="_answer1" /></p>
  <p>Both current responses together: <copy name="crs" prop="currentResponses" target="_answer1" /></p>
  <p>First submitted response: <copy name="sr" prop="submittedResponse" target="_answer1" componentType="text" /></p>
  <p>First submitted response again: <copy name="sr1" prop="submittedResponse1" target="_answer1" componentType="text" /></p>
  <p>Second submitted response: <copy name="sr2" prop="submittedResponse2" target="_answer1" componentType="text" /></p>
  <p>Both submitted responses together: <copy name="srs" prop="submittedResponses" target="_answer1" /></p>
  <p>Credit for submitted responses: <copy name="ca" prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let cr = components['/cr'].replacements[0];
      let crAnchor = cesc('#' + cr.componentName);
      let cr1 = components['/cr1'].replacements[0];
      let cr1Anchor = cesc('#' + cr1.componentName);
      let cr2 = components['/cr2'].replacements[0];
      let cr2Anchor = cesc('#' + cr2.componentName);
      let crsa = components['/crs'].replacements[0];
      let crsaAnchor = cesc('#' + crsa.componentName);
      let crsb = components['/crs'].replacements[1];
      let crsbAnchor = cesc('#' + crsb.componentName);
      let sr = components['/sr'].replacements[0];
      let srAnchor = cesc('#' + sr.componentName);
      let sr1 = components['/sr1'].replacements[0];
      let sr1Anchor = cesc('#' + sr1.componentName);
      let sr2 = components['/sr2'].replacements[0];
      let sr2Anchor = cesc('#' + sr2.componentName);
      // let srsa = components['/srs'].replacements[0];
      // let srsaAnchor = cesc('#' + srsa.componentName);
      // let srsb = components['/srs'].replacements[1];
      // let srsbAnchor = cesc('#' + srsb.componentName);
      let ca = components['/ca'].replacements[0];
      let caAnchor = cesc('#' + ca.componentName);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', '');
      cy.get('#\\/_textinput2_input').should('have.value', '');

      cy.get(crAnchor).should('have.text', '')
      cy.get(cr1Anchor).should('have.text', '')
      cy.get(cr2Anchor).should('have.text', '')
      cy.get(crsaAnchor).should('have.text', '')
      cy.get(crsbAnchor).should('have.text', '')
      cy.get(srAnchor).should('have.text', '')
      cy.get(sr1Anchor).should('have.text', '')
      cy.get(sr2Anchor).should('have.text', '')
      // cy.get(srsaAnchor).should('have.text', '＿')
      // cy.get(srsbAnchor).should('have.text', '＿')
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['', '']);
        expect((await components['/_answer1'].stateValues.currentResponse1)).eqls('')
        expect(await components['/_answer1'].stateValues.currentResponse2).eqls('')
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([])
        expect(await components['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
        expect(await components['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
        expect(components['/_textinput1'].stateValues.value).eq('');
        // expect(components['/_textinput1'].stateValues.submittedValue).eq('\uFF3F');
        expect(components['/_textinput2'].stateValues.value).eq('');
        // expect(components['/_textinput2'].stateValues.submittedValue).eq('\uFF3F');
        expect(await cr.stateValues.value).eq('')
        expect(await cr1.stateValues.value).eq('')
        expect(await cr2.stateValues.value).eq('')
        expect(await crsa.stateValues.value).eq('')
        expect(await crsb.stateValues.value).eq('')
        expect(await sr.stateValues.value).eq('')
        expect(await sr1.stateValues.value).eq('')
        expect(await sr2.stateValues.value).eq('')
        // expect(srsa.stateValues.value).eq('\uFF3F')
        // expect(srsb.stateValues.value).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });

      cy.log("Enter a correct answer in")
      cy.get('#\\/_textinput1_input').type(`rain`).blur();
      cy.get('#\\/_textinput2_input').type(`snow{enter}`).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'rain');
      cy.get('#\\/_textinput2_input').should('have.value', 'snow');

      cy.get(crAnchor).should('have.text', 'rain')
      cy.get(cr1Anchor).should('have.text', 'rain')
      cy.get(cr2Anchor).should('have.text', 'snow')
      cy.get(crsaAnchor).should('have.text', 'rain')
      cy.get(crsbAnchor).should('have.text', 'snow')
      cy.get(srAnchor).should('have.text', '')
      cy.get(sr1Anchor).should('have.text', '')
      cy.get(sr2Anchor).should('have.text', '')
      // cy.get(srsaAnchor).should('have.text', '＿')
      // cy.get(srsbAnchor).should('have.text', '＿')
      cy.get(caAnchor).should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['rain', 'snow']);
        expect((await components['/_answer1'].stateValues.currentResponse1)).eqls('rain')
        expect(await components['/_answer1'].stateValues.currentResponse2).eqls('snow')
        expect(await components['/_answer1'].stateValues.submittedResponses).eqls([])
        expect(await components['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
        expect(await components['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
        expect(await components['/_textinput1'].stateValues.value).eq('rain');
        // expect(components['/_textinput1'].stateValues.submittedValue).eq('\uFF3F');
        expect(await components['/_textinput2'].stateValues.value).eq('snow');
        // expect(components['/_textinput2'].stateValues.submittedValue).eq('\uFF3F');
        expect(await cr.stateValues.value).eq('rain')
        expect(await cr1.stateValues.value).eq('rain')
        expect(await cr2.stateValues.value).eq('snow')
        expect(await crsa.stateValues.value).eq('rain')
        expect(await crsb.stateValues.value).eq('snow')
        expect(await sr.stateValues.value).eq('')
        expect(await sr1.stateValues.value).eq('')
        expect(await sr2.stateValues.value).eq('')
        // expect(srsa.stateValues.value).eq('\uFF3F')
        // expect(srsb.stateValues.value).eq('\uFF3F')
        expect(ca.stateValues.value).eq(0)
      });


      cy.log("Submit answer")
      cy.get('#\\/_answer1_submit').click();
      // wrap to get submitted response anchors
      cy.window().then(async (win) => {
        sr = components['/sr'].replacements[0];
        srAnchor = cesc('#' + sr.componentName);
        sr1 = components['/sr1'].replacements[0];
        sr1Anchor = cesc('#' + sr1.componentName);
        sr2 = components['/sr2'].replacements[0];
        sr2Anchor = cesc('#' + sr2.componentName);
        let srsa = components['/srs'].replacements[0];
        let srsaAnchor = cesc('#' + srsa.componentName);
        let srsb = components['/srs'].replacements[1];
        let srsbAnchor = cesc('#' + srsb.componentName);

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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['rain', 'snow']);
          expect((await components['/_answer1'].stateValues.currentResponse1)).eqls('rain')
          expect(await components['/_answer1'].stateValues.currentResponse2).eqls('snow')
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'snow'])
          expect(await components['/_answer1'].stateValues.submittedResponse1).eqls('rain')
          expect(await components['/_answer1'].stateValues.submittedResponse2).eqls('snow')
          expect(components['/_textinput1'].stateValues.value).eq('rain');
          // expect(components['/_textinput1'].stateValues.submittedValue).eq('rain');
          expect(components['/_textinput2'].stateValues.value).eq('snow');
          // expect(components['/_textinput2'].stateValues.submittedValue).eq('snow');
          expect(await cr.stateValues.value).eq('rain')
          expect(await cr1.stateValues.value).eq('rain')
          expect(await cr2.stateValues.value).eq('snow')
          expect(await crsa.stateValues.value).eq('rain')
          expect(await crsb.stateValues.value).eq('snow')
          expect(await sr.stateValues.value).eq('rain')
          expect(await sr1.stateValues.value).eq('rain')
          expect(await sr2.stateValues.value).eq('snow')
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

        cy.wait(100)

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['rain', 'rain']);
          expect((await components['/_answer1'].stateValues.currentResponse1)).eqls('rain')
          expect(await components['/_answer1'].stateValues.currentResponse2).eqls('rain')
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'snow'])
          expect(await components['/_answer1'].stateValues.submittedResponse1).eqls('rain')
          expect(await components['/_answer1'].stateValues.submittedResponse2).eqls('snow')
          expect(components['/_textinput1'].stateValues.value).eq('rain');
          // expect(components['/_textinput1'].stateValues.submittedValue).eq('rain');
          expect(components['/_textinput2'].stateValues.value).eq('rain');
          // expect(components['/_textinput2'].stateValues.submittedValue).eq('snow');
          expect(await cr.stateValues.value).eq('rain')
          expect(await cr1.stateValues.value).eq('rain')
          expect(await cr2.stateValues.value).eq('rain')
          expect(await crsa.stateValues.value).eq('rain')
          expect(await crsb.stateValues.value).eq('rain')
          expect(await sr.stateValues.value).eq('rain')
          expect(await sr1.stateValues.value).eq('rain')
          expect(await sr2.stateValues.value).eq('snow')
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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['rain', 'rain']);
          expect((await components['/_answer1'].stateValues.currentResponse1)).eqls('rain')
          expect(await components['/_answer1'].stateValues.currentResponse2).eqls('rain')
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'rain'])
          expect(await components['/_answer1'].stateValues.submittedResponse1).eqls('rain')
          expect(await components['/_answer1'].stateValues.submittedResponse2).eqls('rain')
          expect(components['/_textinput1'].stateValues.value).eq('rain');
          // expect(components['/_textinput1'].stateValues.submittedValue).eq('rain');
          expect(components['/_textinput2'].stateValues.value).eq('rain');
          // expect(components['/_textinput2'].stateValues.submittedValue).eq('rain');
          expect(await cr.stateValues.value).eq('rain')
          expect(await cr1.stateValues.value).eq('rain')
          expect(await cr2.stateValues.value).eq('rain')
          expect(await crsa.stateValues.value).eq('rain')
          expect(await crsb.stateValues.value).eq('rain')
          expect(await sr.stateValues.value).eq('rain')
          expect(await sr1.stateValues.value).eq('rain')
          expect(await sr2.stateValues.value).eq('rain')
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

        cy.wait(100)

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['snow', 'rain']);
          expect((await components['/_answer1'].stateValues.currentResponse1)).eqls('snow')
          expect(await components['/_answer1'].stateValues.currentResponse2).eqls('rain')
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'rain'])
          expect(await components['/_answer1'].stateValues.submittedResponse1).eqls('rain')
          expect(await components['/_answer1'].stateValues.submittedResponse2).eqls('rain')
          expect(components['/_textinput1'].stateValues.value).eq('snow');
          // expect(components['/_textinput1'].stateValues.submittedValue).eq('rain');
          expect(components['/_textinput2'].stateValues.value).eq('rain');
          // expect(components['/_textinput2'].stateValues.submittedValue).eq('rain');
          expect(await cr.stateValues.value).eq('snow')
          expect(await cr1.stateValues.value).eq('snow')
          expect(await cr2.stateValues.value).eq('rain')
          expect(await crsa.stateValues.value).eq('snow')
          expect(await crsb.stateValues.value).eq('rain')
          expect(await sr.stateValues.value).eq('rain')
          expect(await sr1.stateValues.value).eq('rain')
          expect(await sr2.stateValues.value).eq('rain')
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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['snow', 'rain']);
          expect((await components['/_answer1'].stateValues.currentResponse1)).eqls('snow')
          expect(await components['/_answer1'].stateValues.currentResponse2).eqls('rain')
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'rain'])
          expect(await components['/_answer1'].stateValues.submittedResponse1).eqls('snow')
          expect(await components['/_answer1'].stateValues.submittedResponse2).eqls('rain')
          expect(components['/_textinput1'].stateValues.value).eq('snow');
          // expect(components['/_textinput1'].stateValues.submittedValue).eq('snow');
          expect(components['/_textinput2'].stateValues.value).eq('rain');
          // expect(components['/_textinput2'].stateValues.submittedValue).eq('rain');
          expect(await cr.stateValues.value).eq('snow')
          expect(await cr1.stateValues.value).eq('snow')
          expect(await cr2.stateValues.value).eq('rain')
          expect(await crsa.stateValues.value).eq('snow')
          expect(await crsb.stateValues.value).eq('rain')
          expect(await sr.stateValues.value).eq('snow')
          expect(await sr1.stateValues.value).eq('snow')
          expect(await sr2.stateValues.value).eq('rain')
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

        cy.wait(100)

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['snow', 'snow']);
          expect((await components['/_answer1'].stateValues.currentResponse1)).eqls('snow')
          expect(await components['/_answer1'].stateValues.currentResponse2).eqls('snow')
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'rain'])
          expect(await components['/_answer1'].stateValues.submittedResponse1).eqls('snow')
          expect(await components['/_answer1'].stateValues.submittedResponse2).eqls('rain')
          expect(components['/_textinput1'].stateValues.value).eq('snow');
          // expect(components['/_textinput1'].stateValues.submittedValue).eq('snow');
          expect(components['/_textinput2'].stateValues.value).eq('snow');
          // expect(components['/_textinput2'].stateValues.submittedValue).eq('rain');
          expect(await cr.stateValues.value).eq('snow')
          expect(await cr1.stateValues.value).eq('snow')
          expect(await cr2.stateValues.value).eq('snow')
          expect(await crsa.stateValues.value).eq('snow')
          expect(await crsb.stateValues.value).eq('snow')
          expect(await sr.stateValues.value).eq('snow')
          expect(await sr1.stateValues.value).eq('snow')
          expect(await sr2.stateValues.value).eq('rain')
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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['snow', 'snow']);
          expect((await components['/_answer1'].stateValues.currentResponse1)).eqls('snow')
          expect(await components['/_answer1'].stateValues.currentResponse2).eqls('snow')
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'snow'])
          expect(await components['/_answer1'].stateValues.submittedResponse1).eqls('snow')
          expect(await components['/_answer1'].stateValues.submittedResponse2).eqls('snow')
          expect(components['/_textinput1'].stateValues.value).eq('snow');
          // expect(components['/_textinput1'].stateValues.submittedValue).eq('snow');
          expect(components['/_textinput2'].stateValues.value).eq('snow');
          // expect(components['/_textinput2'].stateValues.submittedValue).eq('snow');
          expect(await cr.stateValues.value).eq('snow')
          expect(await cr1.stateValues.value).eq('snow')
          expect(await cr2.stateValues.value).eq('snow')
          expect(await crsa.stateValues.value).eq('snow')
          expect(await crsb.stateValues.value).eq('snow')
          expect(await sr.stateValues.value).eq('snow')
          expect(await sr1.stateValues.value).eq('snow')
          expect(await sr2.stateValues.value).eq('snow')
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

        cy.wait(100)

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['fog', 'hail']);
          expect((await components['/_answer1'].stateValues.currentResponse1)).eqls('fog')
          expect(await components['/_answer1'].stateValues.currentResponse2).eqls('hail')
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'snow'])
          expect(await components['/_answer1'].stateValues.submittedResponse1).eqls('snow')
          expect(await components['/_answer1'].stateValues.submittedResponse2).eqls('snow')
          expect(components['/_textinput1'].stateValues.value).eq('fog');
          // expect(components['/_textinput1'].stateValues.submittedValue).eq('snow');
          expect(components['/_textinput2'].stateValues.value).eq('hail');
          // expect(components['/_textinput2'].stateValues.submittedValue).eq('snow');
          expect(await cr.stateValues.value).eq('fog')
          expect(await cr1.stateValues.value).eq('fog')
          expect(await cr2.stateValues.value).eq('hail')
          expect(await crsa.stateValues.value).eq('fog')
          expect(await crsb.stateValues.value).eq('hail')
          expect(await sr.stateValues.value).eq('snow')
          expect(await sr1.stateValues.value).eq('snow')
          expect(await sr2.stateValues.value).eq('snow')
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
        cy.window().then(async (win) => {
          expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
          expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['fog', 'hail']);
          expect((await components['/_answer1'].stateValues.currentResponse1)).eqls('fog')
          expect(await components['/_answer1'].stateValues.currentResponse2).eqls('hail')
          expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['fog', 'hail'])
          expect(await components['/_answer1'].stateValues.submittedResponse1).eqls('fog')
          expect(await components['/_answer1'].stateValues.submittedResponse2).eqls('hail')
          expect(components['/_textinput1'].stateValues.value).eq('fog');
          // expect(components['/_textinput1'].stateValues.submittedValue).eq('fog');
          expect(components['/_textinput2'].stateValues.value).eq('hail');
          // expect(components['/_textinput2'].stateValues.submittedValue).eq('hail');
          expect(await cr.stateValues.value).eq('fog')
          expect(await cr1.stateValues.value).eq('fog')
          expect(await cr2.stateValues.value).eq('hail')
          expect(await crsa.stateValues.value).eq('fog')
          expect(await crsb.stateValues.value).eq('hail')
          expect(await sr.stateValues.value).eq('fog')
          expect(await sr1.stateValues.value).eq('fog')
          expect(await sr2.stateValues.value).eq('hail')
          expect(srsa.stateValues.value).eq('fog')
          expect(srsb.stateValues.value).eq('hail')
          expect(ca.stateValues.value).eq(0)
        });

      })
    })
  });

  it('answer inequalities', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  Enter enter number larger than 5 or less than 2: 
  <answer>
  <mathinput name="m" />
  <award targetsAreResponses="m"><when>$m > 5</when></award>
  <award><when>$m < <math>2</math></when></award>
  </answer>
  `}, "*");

    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test initial values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit a correct answer")
    cy.get('#\\/m textarea').type(`6`, { force: true });
    cy.get('#\\/m_submit').click();

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Submit an incorrect answer")
    cy.get('#\\/m textarea').type(`{rightarrow}{backspace}5`, { force: true });
    cy.get('#\\/m_submit').click();
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_answer1'].stateValues.creditAchieved).eq(0);
    });


    cy.log("Submit a different correct answer")
    cy.get('#\\/m textarea').type(`{rightarrow}{backspace}-3`, { force: true });
    cy.get('#\\/m_submit').click();
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Submit a correct answer that must be simplified")
    cy.get('#\\/m textarea').type(`{end}{backspace}{backspace}5xy-5xy+9`, { force: true });
    cy.get('#\\/m_submit').click();
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Submit a non-numerical answer")
    cy.get('#\\/m textarea').type(`{end}{leftarrow}{leftarrow}z`, { force: true });
    cy.get('#\\/m_submit').click();
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });


  });

  it('answer extended inequalities', () => {
    cy.log("Number between -1 and 1, inclusive");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <answer><mathinput/>
  <award><when>-1 <= <copy prop="immediateValue" target="_mathinput1" isResponse /> <= 1</when></award>
  </answer>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    // cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers1 = { "1": 1, "-1": 1, "0.5": 1, "1.1": 0, "-2": 0, "x-x": 1, "x": 0 }

    for (let answerString in answers1) {
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}" + answerString, { delay: 5, force: true });
      cy.get('#\\/_mathinput1_submit').click();
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(answers1[answerString]);
      });
    }

    cy.log("Number between -1 and 1, exclusive");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <answer><mathinput/>
  <award><when>-1 < <copy prop="immediateValue" isResponse target="_mathinput1" /> < 1</when></award>
  </answer>
  `}, "*");
    });

    // cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers2 = { "1": 0, "-1": 0, "0.5": 1, "0.99": 1, "-2": 0, "x-x": 1, "x": 0 }
    for (let answerString in answers2) {
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}" + answerString, { delay: 5, force: true });
      cy.get('#\\/_mathinput1_submit').click();
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(answers2[answerString]);
      });
    }

    cy.log("Number between -1 and 1, as greater than");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <answer><mathinput/>
  <award><when>1 > <copy prop="immediateValue" isResponse target="_mathinput1" /> >= -1</when></award>
  </answer>
  `}, "*");
    });

    // cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers3 = { "1": 0, "-1": 1, "0.5": 1, "0.99": 1, "-2": 0, "x-x": 1, "x": 0 }

    for (let answerString in answers3) {
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}" + answerString, { delay: 5, force: true });
      cy.get('#\\/_mathinput1_submit').click();
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(answers3[answerString]);
      });
    }
  });

  it('compound logic', () => {
    cy.log("Number between -1 and 1, inclusive");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput/> <mathinput/> <mathinput/>
  <answer>
    <award><when>
      ((<copy prop="immediateValue" target="_mathinput1" /> = x
      and <copy prop="immediateValue" target="_mathinput2" /> != <copy prop="immediateValue" target="_mathinput1" />)
      or
      (<copy prop="immediateValue" target="_mathinput1" /> = <math>y</math>
      and <copy prop="immediateValue" target="_mathinput2" /> != z
      and <copy prop="immediateValue" target="_mathinput2" /> != q))
      and <copy prop="immediateValue" target="_mathinput3" /> > 5
   </when></award>
  </answer>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    // cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers1 = [[1, "x", "z", "6"], [0, "x", "x", "6"], [0, "x", "z", "5"],
    [1, "y", "y", "7"], [0, "y", "z", "7"], [0, "y", "q", "7"], [1, "y", "y^2", "7"],
    [0, "y", "y", "a"]];

    for (let answer of answers1) {
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}" + answer[1], { delay: 5, force: true }).blur();
      cy.get('#\\/_mathinput2 textarea').type("{end}{backspace}{backspace}{backspace}" + answer[2], { delay: 5, force: true }).blur();
      cy.get('#\\/_mathinput3 textarea').type("{end}{backspace}{backspace}{backspace}" + answer[3], { delay: 5, force: true }).blur();
      cy.get('#\\/_answer1_submit').click();
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(answer[0]);
      });
    }

  });

  it('answer inside map', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map>
      <template>
        <p>Enter <m>x^$n</m>: <answer><award><math>x^$n</math></award></answer></p>
        <p>Credit achieved: <copy prop="creditAchieved" target="_answer1" /></p>
        <p>Current response: <copy prop="currentResponse" target="_answer1" /></p>
        <p>Submitted response: <copy prop="submittedResponse" target="_answer1" componentType="math" /></p>
      </template>
      <sources alias="n"><sequence from="1" to="3" /></sources>
    </map>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let answer1 = components['/_map1'].replacements[0].replacements[1].activeChildren[3];
      let mathinput1Name = answer1.stateValues.inputChildren[0].componentName;
      let mathinput1 = components[mathinput1Name]
      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let mathinput1SubmitAnchor = cesc('#' + mathinput1Name + '_submit');
      let ca1 = components['/_map1'].replacements[0].replacements[3].activeChildren[1];
      let ca1Anchor = cesc('#' + ca1.componentName);
      let cr1 = components['/_map1'].replacements[0].replacements[5].activeChildren[1];
      let cr1Anchor = cesc('#' + cr1.componentName);
      let sr1 = components['/_map1'].replacements[0].replacements[7].activeChildren[1];
      let sr1Anchor = cesc('#' + sr1.componentName);

      let answer2 = components['/_map1'].replacements[1].replacements[1].activeChildren[3];
      let mathinput2Name = answer2.stateValues.inputChildren[0].componentName;
      let mathinput2 = components[mathinput2Name]
      let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc('#' + mathinput2Name + '_submit');
      let ca2 = components['/_map1'].replacements[1].replacements[3].activeChildren[1];
      let ca2Anchor = cesc('#' + ca2.componentName);
      let cr2 = components['/_map1'].replacements[1].replacements[5].activeChildren[1];
      let cr2Anchor = cesc('#' + cr2.componentName);
      let sr2 = components['/_map1'].replacements[1].replacements[7].activeChildren[1];
      let sr2Anchor = cesc('#' + sr2.componentName);

      let answer3 = components['/_map1'].replacements[2].replacements[1].activeChildren[3];
      let mathinput3Name = answer3.stateValues.inputChildren[0].componentName;
      let mathinput3 = components[mathinput3Name]
      let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
      let mathinput3SubmitAnchor = cesc('#' + mathinput3Name + '_submit');
      let ca3 = components['/_map1'].replacements[2].replacements[3].activeChildren[1];
      let ca3Anchor = cesc('#' + ca3.componentName);
      let cr3 = components['/_map1'].replacements[2].replacements[5].activeChildren[1];
      let cr3Anchor = cesc('#' + cr3.componentName);
      let sr3 = components['/_map1'].replacements[2].replacements[7].activeChildren[1];
      let sr3Anchor = cesc('#' + sr3.componentName);


      cy.log('Test value displayed in browser')
      // cy.get(mathinput1Anchor).should('have.value', '');
      // cy.get(mathinput2Anchor).should('have.value', '');
      // cy.get(mathinput3Anchor).should('have.value', '');
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
      cy.window().then(async (win) => {
        expect(answer1.stateValues.creditAchieved).eq(0);
        expect((await answer1.stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await answer1.stateValues.submittedResponses).eqls([]);
        expect(mathinput1.stateValues.value.tree).eq('\uFF3F');
        // expect(mathinput1.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer2.stateValues.creditAchieved).eq(0);
        expect((await answer2.stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await answer2.stateValues.submittedResponses).eqls([]);
        expect(mathinput2.stateValues.value.tree).eq('\uFF3F');
        // expect(mathinput2.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer3.stateValues.creditAchieved).eq(0);
        expect((await answer3.stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await answer3.stateValues.submittedResponses).eqls([]);
        expect(mathinput3.stateValues.value.tree).eq('\uFF3F');
        // expect(mathinput3.stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Enter correct answer in all three blanks")
      cy.get(mathinput1Anchor).type(`x`, { force: true }).blur();
      cy.get(mathinput2Anchor).type(`x^2`, { force: true }).blur();
      cy.get(mathinput3Anchor).type(`x^3`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinput1Anchor).should('have.value', 'x');
      // cy.get(mathinput2Anchor).should('have.value', 'x^2');
      // cy.get(mathinput3Anchor).should('have.value', 'x^3');

      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '0');
      cy.get(ca3Anchor).should('have.text', '0');
      cy.get(cr1Anchor + ' .mjx-mrow').should('have.text', 'x')
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr2Anchor + ' .mjx-mrow').eq(0).should('have.text', 'x2')
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2')
      });
      cy.get(cr3Anchor + ' .mjx-mrow').should('contain.text', 'x3')
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
      cy.window().then(async (win) => {
        expect(answer1.stateValues.creditAchieved).eq(0);
        expect((await answer1.stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
        expect(await answer1.stateValues.submittedResponses).eqls([]);
        expect(mathinput1.stateValues.value.tree).eq('x');
        // expect(mathinput1.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer2.stateValues.creditAchieved).eq(0);
        expect((await answer2.stateValues.currentResponses).map(x => x.tree)).eqls([['^', 'x', 2]]);
        expect(await answer2.stateValues.submittedResponses).eqls([]);
        expect(mathinput2.stateValues.value.tree).eqls(['^', 'x', 2]);
        // expect(mathinput2.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer3.stateValues.creditAchieved).eq(0);
        expect((await answer3.stateValues.currentResponses).map(x => x.tree)).eqls([['^', 'x', 3]]);
        expect(await answer3.stateValues.submittedResponses).eqls([]);
        expect(mathinput3.stateValues.value.tree).eqls(['^', 'x', 3]);
        // expect(mathinput3.stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Submit answers")
      cy.get(mathinput1SubmitAnchor).click();
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput3SubmitAnchor).click();


      // wrap to change value of sr anchors
      cy.window().then(async (win) => {
        sr1 = components['/_map1'].replacements[0].replacements[7].activeChildren[1];
        sr1Anchor = cesc('#' + sr1.componentName);
        sr2 = components['/_map1'].replacements[1].replacements[7].activeChildren[1];
        sr2Anchor = cesc('#' + sr2.componentName);
        sr3 = components['/_map1'].replacements[2].replacements[7].activeChildren[1];
        sr3Anchor = cesc('#' + sr3.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinput1Anchor).should('have.value', 'x');
        // cy.get(mathinput2Anchor).should('have.value', 'x^2');
        // cy.get(mathinput3Anchor).should('have.value', 'x^3');

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
        cy.window().then(async (win) => {
          expect(answer1.stateValues.creditAchieved).eq(1);
          expect((await answer1.stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await answer1.stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(mathinput1.stateValues.value.tree).eq('x');
          // expect(mathinput1.stateValues.submittedValue.tree).eq('x');
          expect(answer2.stateValues.creditAchieved).eq(1);
          expect((await answer2.stateValues.currentResponses).map(x => x.tree)).eqls([['^', 'x', 2]]);
          expect((await answer2.stateValues.submittedResponses).map(x => x.tree)).eqls([['^', 'x', 2]]);
          expect(mathinput2.stateValues.value.tree).eqls(['^', 'x', 2]);
          // expect(mathinput2.stateValues.submittedValue.tree).eqls(['^', 'x', 2]);
          expect(answer3.stateValues.creditAchieved).eq(1);
          expect((await answer3.stateValues.currentResponses).map(x => x.tree)).eqls([['^', 'x', 3]]);
          expect((await answer3.stateValues.submittedResponses).map(x => x.tree)).eqls([['^', 'x', 3]]);
          expect(mathinput3.stateValues.value.tree).eqls(['^', 'x', 3]);
          // expect(mathinput3.stateValues.submittedValue.tree).eqls(['^', 'x', 3]);
        });

        cy.log("Enter wrong answers")
        cy.get(mathinput1Anchor).type(`{end}{backspace}u`, { force: true }).blur();
        cy.get(mathinput2Anchor).type(`{end}{backspace}{backspace}{backspace}{backspace}v`, { force: true }).blur();
        cy.get(mathinput3Anchor).type(`{end}{backspace}{backspace}{backspace}{backspace}w`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinput1Anchor).should('have.value', 'u');
        // cy.get(mathinput2Anchor).should('have.value', 'v');
        // cy.get(mathinput3Anchor).should('have.value', 'w');

        cy.get(ca1Anchor).should('have.text', '1');
        cy.get(ca2Anchor).should('have.text', '1');
        cy.get(ca3Anchor).should('have.text', '1');

        cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        });
        cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        });
        cy.get(cr3Anchor + ' .mjx-mrow').should('have.text','w')
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
        cy.window().then(async (win) => {
          expect(answer1.stateValues.creditAchieved).eq(1);
          expect((await answer1.stateValues.currentResponses).map(x => x.tree)).eqls(['u']);
          expect((await answer1.stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(mathinput1.stateValues.value.tree).eq('u');
          // expect(mathinput1.stateValues.submittedValue.tree).eq('x');
          expect(answer2.stateValues.creditAchieved).eq(1);
          expect((await answer2.stateValues.currentResponses).map(x => x.tree)).eqls(['v']);
          expect((await answer2.stateValues.submittedResponses).map(x => x.tree)).eqls([['^', 'x', 2]]);
          expect(mathinput2.stateValues.value.tree).eq('v');
          // expect(mathinput2.stateValues.submittedValue.tree).eqls(['^', 'x', 2]);
          expect(answer3.stateValues.creditAchieved).eq(1);
          expect((await answer3.stateValues.currentResponses).map(x => x.tree)).eqls(['w']);
          expect((await answer3.stateValues.submittedResponses).map(x => x.tree)).eqls([['^', 'x', 3]]);
          expect(mathinput3.stateValues.value.tree).eq('w');
          // expect(mathinput3.stateValues.submittedValue.tree).eqls(['^', 'x', 3]);
        });


        cy.log("Submit answers")
        cy.get(mathinput1SubmitAnchor).click();
        cy.get(mathinput2SubmitAnchor).click();
        cy.get(mathinput3SubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinput1Anchor).should('have.value', 'u');
        // cy.get(mathinput2Anchor).should('have.value', 'v');
        // cy.get(mathinput3Anchor).should('have.value', 'w');

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
        cy.window().then(async (win) => {
          expect(answer1.stateValues.creditAchieved).eq(0);
          expect((await answer1.stateValues.currentResponses).map(x => x.tree)).eqls(['u']);
          expect((await answer1.stateValues.submittedResponses).map(x => x.tree)).eqls(['u']);
          expect(mathinput1.stateValues.value.tree).eq('u');
          // expect(mathinput1.stateValues.submittedValue.tree).eq('u');
          expect(answer2.stateValues.creditAchieved).eq(0);
          expect((await answer2.stateValues.currentResponses).map(x => x.tree)).eqls(['v']);
          expect((await answer2.stateValues.submittedResponses).map(x => x.tree)).eqls(['v']);
          expect(mathinput2.stateValues.value.tree).eq('v');
          // expect(mathinput2.stateValues.submittedValue.tree).eq('v');
          expect(answer3.stateValues.creditAchieved).eq(0);
          expect((await answer3.stateValues.currentResponses).map(x => x.tree)).eqls(['w']);
          expect((await answer3.stateValues.submittedResponses).map(x => x.tree)).eqls(['w']);
          expect(mathinput3.stateValues.value.tree).eq('w');
          // expect(mathinput3.stateValues.submittedValue.tree).eq('w');
        });
      })

    })
  });

  it('answer inside map with namespaces and assignNames', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map assignNames="a b c">
      <template newNamespace>
        <p>Enter <m>x^$n</m>: <answer><award><math>x^$n</math></award></answer></p>
        <p>Credit achieved: <copy assignNames="ca" prop="creditAchieved" target="_answer1" /></p>
        <p>Current response: <copy assignNames="cr" prop="currentResponse" target="_answer1" /></p>
        <p>Submitted response: <copy assignNames="sr" prop="submittedResponse" target="_answer1" componentType="math" /></p>
      </template>
      <sources alias="n"><sequence from="1" to="3" /></sources>
    </map>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let answer1 = components['/a/_answer1'];
      let mathinput1Name = answer1.stateValues.inputChildren[0].componentName;
      let mathinput1 = components[mathinput1Name]
      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let mathinput1SubmitAnchor = cesc('#' + mathinput1Name + '_submit');
      let ca1 = components['/a/ca'];
      let ca1Anchor = cesc('#' + ca1.componentName);
      let cr1 = components['/a/cr'];
      let cr1Anchor = cesc('#' + cr1.componentName);
      let sr1 = components['/a/sr'];
      let sr1Anchor = cesc('#' + sr1.componentName);

      let answer2 = components['/b/_answer1'];
      let mathinput2Name = answer2.stateValues.inputChildren[0].componentName;
      let mathinput2 = components[mathinput2Name]
      let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc('#' + mathinput2Name + '_submit');
      let ca2 = components['/b/ca'];
      let ca2Anchor = cesc('#' + ca2.componentName);
      let cr2 = components['/b/cr'];
      let cr2Anchor = cesc('#' + cr2.componentName);
      let sr2 = components['/b/sr'];
      let sr2Anchor = cesc('#' + sr2.componentName);

      let answer3 = components['/c/_answer1'];
      let mathinput3Name = answer3.stateValues.inputChildren[0].componentName;
      let mathinput3 = components[mathinput3Name]
      let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
      let mathinput3SubmitAnchor = cesc('#' + mathinput3Name + '_submit');
      let ca3 = components['/c/ca'];
      let ca3Anchor = cesc('#' + ca3.componentName);
      let cr3 = components['/c/cr'];
      let cr3Anchor = cesc('#' + cr3.componentName);
      let sr3 = components['/c/sr'];
      let sr3Anchor = cesc('#' + sr3.componentName);


      cy.log('Test value displayed in browser')
      // cy.get(mathinput1Anchor).should('have.value', '');
      // cy.get(mathinput2Anchor).should('have.value', '');
      // cy.get(mathinput3Anchor).should('have.value', '');
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
      cy.window().then(async (win) => {
        expect(answer1.stateValues.creditAchieved).eq(0);
        expect((await answer1.stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await answer1.stateValues.submittedResponses).eqls([]);
        expect(mathinput1.stateValues.value.tree).eq('\uFF3F');
        // expect(mathinput1.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer2.stateValues.creditAchieved).eq(0);
        expect((await answer2.stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await answer2.stateValues.submittedResponses).eqls([]);
        expect(mathinput2.stateValues.value.tree).eq('\uFF3F');
        // expect(mathinput2.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer3.stateValues.creditAchieved).eq(0);
        expect((await answer3.stateValues.currentResponses).map(x => x.tree)).eqls(['\uFF3F']);
        expect(await answer3.stateValues.submittedResponses).eqls([]);
        expect(mathinput3.stateValues.value.tree).eq('\uFF3F');
        // expect(mathinput3.stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Enter correct answer in all three blanks")
      cy.get(mathinput1Anchor).type(`x`, { force: true }).blur();
      cy.get(mathinput2Anchor).type(`x^2`, { force: true }).blur();
      cy.get(mathinput3Anchor).type(`x^3`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinput1Anchor).should('have.value', 'x');
      // cy.get(mathinput2Anchor).should('have.value', 'x^2');
      // cy.get(mathinput3Anchor).should('have.value', 'x^3');

      cy.get(ca1Anchor).should('have.text', '0');
      cy.get(ca2Anchor).should('have.text', '0');
      cy.get(ca3Anchor).should('have.text', '0');
      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2')
      });
      cy.get(cr3Anchor + ' .mjx-mrow').should('contain.text', 'x3')
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
      cy.window().then(async (win) => {
        expect(answer1.stateValues.creditAchieved).eq(0);
        expect((await answer1.stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
        expect(await answer1.stateValues.submittedResponses).eqls([]);
        expect(mathinput1.stateValues.value.tree).eq('x');
        // expect(mathinput1.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer2.stateValues.creditAchieved).eq(0);
        expect((await answer2.stateValues.currentResponses).map(x => x.tree)).eqls([['^', 'x', 2]]);
        expect(await answer2.stateValues.submittedResponses).eqls([]);
        expect(mathinput2.stateValues.value.tree).eqls(['^', 'x', 2]);
        // expect(mathinput2.stateValues.submittedValue.tree).eq('\uFF3F');
        expect(answer3.stateValues.creditAchieved).eq(0);
        expect((await answer3.stateValues.currentResponses).map(x => x.tree)).eqls([['^', 'x', 3]]);
        expect(await answer3.stateValues.submittedResponses).eqls([]);
        expect(mathinput3.stateValues.value.tree).eqls(['^', 'x', 3]);
        // expect(mathinput3.stateValues.submittedValue.tree).eq('\uFF3F');
      });

      cy.log("Submit answers")
      cy.get(mathinput1SubmitAnchor).click();
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput3SubmitAnchor).click();


      // wrap to change value of sr anchors
      cy.window().then(async (win) => {
        sr1 = components['/a/sr'];
        sr1Anchor = cesc('#' + sr1.componentName);
        sr2 = components['/b/sr'];
        sr2Anchor = cesc('#' + sr2.componentName);
        sr3 = components['/c/sr'];
        sr3Anchor = cesc('#' + sr3.componentName);

        cy.log('Test value displayed in browser')
        // cy.get(mathinput1Anchor).should('have.value', 'x');
        // cy.get(mathinput2Anchor).should('have.value', 'x^2');
        // cy.get(mathinput3Anchor).should('have.value', 'x^3');

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
        cy.window().then(async (win) => {
          expect(answer1.stateValues.creditAchieved).eq(1);
          expect((await answer1.stateValues.currentResponses).map(x => x.tree)).eqls(['x']);
          expect((await answer1.stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(mathinput1.stateValues.value.tree).eq('x');
          // expect(mathinput1.stateValues.submittedValue.tree).eq('x');
          expect(answer2.stateValues.creditAchieved).eq(1);
          expect((await answer2.stateValues.currentResponses).map(x => x.tree)).eqls([['^', 'x', 2]]);
          expect((await answer2.stateValues.submittedResponses).map(x => x.tree)).eqls([['^', 'x', 2]]);
          expect(mathinput2.stateValues.value.tree).eqls(['^', 'x', 2]);
          // expect(mathinput2.stateValues.submittedValue.tree).eqls(['^', 'x', 2]);
          expect(answer3.stateValues.creditAchieved).eq(1);
          expect((await answer3.stateValues.currentResponses).map(x => x.tree)).eqls([['^', 'x', 3]]);
          expect((await answer3.stateValues.submittedResponses).map(x => x.tree)).eqls([['^', 'x', 3]]);
          expect(mathinput3.stateValues.value.tree).eqls(['^', 'x', 3]);
          // expect(mathinput3.stateValues.submittedValue.tree).eqls(['^', 'x', 3]);
        });

        cy.log("Enter wrong answers")
        cy.get(mathinput1Anchor).type(`{end}{backspace}u`, { force: true }).blur();
        cy.get(mathinput2Anchor).type(`{end}{backspace}{backspace}{backspace}{backspace}v`, { force: true }).blur();
        cy.get(mathinput3Anchor).type(`{end}{backspace}{backspace}{backspace}{backspace}w`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinput1Anchor).should('have.value', 'u');
        // cy.get(mathinput2Anchor).should('have.value', 'v');
        // cy.get(mathinput3Anchor).should('have.value', 'w');

        cy.get(ca1Anchor).should('have.text', '1');
        cy.get(ca2Anchor).should('have.text', '1');
        cy.get(ca3Anchor).should('have.text', '1');

        cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('u')
        });
        cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('v')
        });
        cy.get(cr3Anchor + ' .mjx-mrow').should('contain.text', 'w')
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
        cy.window().then(async (win) => {
          expect(answer1.stateValues.creditAchieved).eq(1);
          expect((await answer1.stateValues.currentResponses).map(x => x.tree)).eqls(['u']);
          expect((await answer1.stateValues.submittedResponses).map(x => x.tree)).eqls(['x']);
          expect(mathinput1.stateValues.value.tree).eq('u');
          // expect(mathinput1.stateValues.submittedValue.tree).eq('x');
          expect(answer2.stateValues.creditAchieved).eq(1);
          expect((await answer2.stateValues.currentResponses).map(x => x.tree)).eqls(['v']);
          expect((await answer2.stateValues.submittedResponses).map(x => x.tree)).eqls([['^', 'x', 2]]);
          expect(mathinput2.stateValues.value.tree).eq('v');
          // expect(mathinput2.stateValues.submittedValue.tree).eqls(['^', 'x', 2]);
          expect(answer3.stateValues.creditAchieved).eq(1);
          expect((await answer3.stateValues.currentResponses).map(x => x.tree)).eqls(['w']);
          expect((await answer3.stateValues.submittedResponses).map(x => x.tree)).eqls([['^', 'x', 3]]);
          expect(mathinput3.stateValues.value.tree).eq('w');
          // expect(mathinput3.stateValues.submittedValue.tree).eqls(['^', 'x', 3]);
        });


        cy.log("Submit answers")
        cy.get(mathinput1SubmitAnchor).click();
        cy.get(mathinput2SubmitAnchor).click();
        cy.get(mathinput3SubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinput1Anchor).should('have.value', 'u');
        // cy.get(mathinput2Anchor).should('have.value', 'v');
        // cy.get(mathinput3Anchor).should('have.value', 'w');

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
        cy.window().then(async (win) => {
          expect(answer1.stateValues.creditAchieved).eq(0);
          expect((await answer1.stateValues.currentResponses).map(x => x.tree)).eqls(['u']);
          expect((await answer1.stateValues.submittedResponses).map(x => x.tree)).eqls(['u']);
          expect(mathinput1.stateValues.value.tree).eq('u');
          // expect(mathinput1.stateValues.submittedValue.tree).eq('u');
          expect(answer2.stateValues.creditAchieved).eq(0);
          expect((await answer2.stateValues.currentResponses).map(x => x.tree)).eqls(['v']);
          expect((await answer2.stateValues.submittedResponses).map(x => x.tree)).eqls(['v']);
          expect(mathinput2.stateValues.value.tree).eq('v');
          // expect(mathinput2.stateValues.submittedValue.tree).eq('v');
          expect(answer3.stateValues.creditAchieved).eq(0);
          expect((await answer3.stateValues.currentResponses).map(x => x.tree)).eqls(['w']);
          expect((await answer3.stateValues.submittedResponses).map(x => x.tree)).eqls(['w']);
          expect(mathinput3.stateValues.value.tree).eq('w');
          // expect(mathinput3.stateValues.submittedValue.tree).eq('w');
        });
      })

    })
  });

  it('integrated submit buttons', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>
    <award><math>x+y</math></award>
    <award credit="0.3215"><math>x+z</math></award>
  </answer></p>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');
      let mathinputPartialAnchor = cesc('#' + mathinputName + '_partial');

      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Press enter")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Add space")
      cy.get(mathinputAnchor).type(`{end} `, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+yz');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Press enter")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete space")
      cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+yz');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Press enter")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Add letter")
      cy.get(mathinputAnchor).type(`{end}z`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+yz');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete letter (no longer goes back to saying correct)")
      cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete more")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Back to correct (no longer goes back to saying correct)")
      cy.get(mathinputAnchor).type(`{end}+y`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Press enter")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete again")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Press enter on submit button")
      cy.get(mathinputSubmitAnchor).type(`{enter}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Add letter")
      cy.get(mathinputAnchor).type(`{end}a`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'xa');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete letter (no longer goes back to saying incorrect)")
      cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete all")
      cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');


      cy.log("Restore incorrect submitted answer (no longer goes back to saying incorrect)")
      cy.get(mathinputAnchor).type(`x`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Click submit button")
      cy.get(mathinputSubmitAnchor).click();
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Enter partially correct answer")
      cy.get(mathinputAnchor).type(`{end}+z`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+z');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Click submit button")
      cy.get(mathinputSubmitAnchor).click();
      // cy.get(mathinputAnchor).should('have.value', 'x+z');
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('have.text', '32 %');

      cy.log("Add letter")
      cy.get(mathinputAnchor).type(`{end}z`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+zz');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete letter (no longer goes back to saying partially correct)")
      cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+z');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Delete more")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Back to partial (no longer goes back to saying partially correct)")
      cy.get(mathinputAnchor).type(`{end}+z`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+z');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Click submit button")
      cy.get(mathinputSubmitAnchor).click();
      // cy.get(mathinputAnchor).should('have.value', 'x+z');
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('have.text', '32 %');

      cy.log("Enter invalid answer")
      cy.get(mathinputAnchor).type(`{end}/`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+z');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Click submit button")
      cy.get(mathinputSubmitAnchor).click();
      // cy.get(mathinputAnchor).should('have.value', 'x+z/');
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Another invalid answer shows submit button again")
      cy.get(mathinputAnchor).type(`{end}^`, { force: true });
      // cy.get(mathinputAnchor).should('have.value', 'x+z/^');
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');

      cy.log("Click submit button")
      cy.get(mathinputSubmitAnchor).click();
      // cy.get(mathinputAnchor).should('have.value', 'x+z/^');
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinputPartialAnchor).should('not.exist');

    })
  });

  it('integrated submit buttons, text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text">
    <award><text>hello there</text></award>
    <award credit="0.3215"><text>bye</text></award>
  </answer></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let textinputCorrectAnchor = cesc('#' + textinputName + '_correct');
      let textinputIncorrectAnchor = cesc('#' + textinputName + '_incorrect');
      let textinputPartialAnchor = cesc('#' + textinputName + '_partial');

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

      cy.log("Delete letter (no longer goes back to saying correct)")
      cy.get(textinputAnchor).type(`{backspace}`);
      cy.get(textinputAnchor).should('have.value', 'hello there');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
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

      cy.log("Add a space")
      cy.get(textinputAnchor).type(` `);
      cy.get(textinputAnchor).should('have.value', 'hello there ');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Press enter")
      cy.get(textinputAnchor).type(`{enter}`);
      cy.get(textinputAnchor).should('have.value', 'hello there ');
      cy.get(textinputSubmitAnchor).should('not.exist');
      cy.get(textinputCorrectAnchor).should('be.visible');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Delete again")
      cy.get(textinputAnchor).type(`{backspace}{backspace}{backspace}`);
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

      cy.log("Delete letter (no longer goes back to saying incorrect)")
      cy.get(textinputAnchor).type(`{backspace}`);
      cy.get(textinputAnchor).should('have.value', 'hello the');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Delete all")
      cy.get(textinputAnchor).clear();
      cy.get(textinputAnchor).should('have.value', '');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Restore incorrect submitted answer (no longer goes back to saying incorrect)")
      cy.get(textinputAnchor).type(`hello the`);
      cy.get(textinputAnchor).should('have.value', 'hello the');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Press enter")
      cy.get(textinputAnchor).type(`{enter}`);
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

      cy.log("Delete letter (no longer goes back to saying partially correct)")
      cy.get(textinputAnchor).type(`{backspace}`);
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Delete more")
      cy.get(textinputAnchor).type(`{backspace}{backspace}`);
      cy.get(textinputAnchor).should('have.value', 'b');
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');
      cy.get(textinputPartialAnchor).should('not.exist');

      cy.log("Back to partial (no longer goes back to saying partially correct)")
      cy.get(textinputAnchor).type(`ye`);
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
    })
  });

  it('submit buttons with two answer blanks', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Enter values that sum to <m>3x</m>: <mathinput/> <mathinput/>
  <answer>
  <award><when><math><copy prop="immediateValue" target="_mathinput1" isResponse />+<copy prop="immediateValue" target="_mathinput2" isResponse /></math> = <math>3x</math></when></award>
  <award credit="0.5"><when><math><copy prop="immediateValue" target="_mathinput1" />+<copy prop="immediateValue" target="_mathinput2" /></math> = <math>3</math></when></award>
  </answer></p>

  <p><copy prop="immediateValue" target="_mathinput1" /></p>
  <p><copy prop="immediateValue" target="_mathinput2" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Enter correct answer")
    cy.get('#\\/_mathinput1 textarea').type(`x+y`, { force: true });
    cy.get('#\\/_mathinput2 textarea').type(`2x-y`, { force: true })
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Submit answer")
    cy.get('#\\/_mathinput2 textarea').blur();
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Type letter in input1")
    cy.get('#\\/_mathinput1 textarea').type('{end}z', { force: true });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Delete letter (no longer goes back to saying correct)")
    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}', { force: true });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Type letter in input2")
    cy.get('#\\/_mathinput1 textarea').blur();
    cy.get('#\\/_mathinput2 textarea').type('{end}q', { force: true });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Delete letter (no longer goes back to saying correct)")
    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}', { force: true });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Type letter in input1")
    cy.get('#\\/_mathinput1 textarea').type('{end}z', { force: true });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Type letter in input2")
    cy.get('#\\/_mathinput1 textarea').blur();
    cy.get('#\\/_mathinput2 textarea').type('{end}q', { force: true });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Delete letter in input1")
    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}', { force: true });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Don't go back to saying correct if return to previous answer")
    cy.get('#\\/_mathinput1 textarea').blur();
    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}', { force: true }).blur();
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Enter partially correct answer")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}{backspace}{backspace}x`, { force: true }).blur();
    cy.get('#\\/_mathinput2 textarea').type(`{end}{backspace}{backspace}{backspace}{backspace}3-x`, { force: true }).blur();
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })


    cy.log("Delete letter in input1")
    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}', { force: true });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Add letter back (no longer goes back to saying partially correct)")
    cy.get('#\\/_mathinput1 textarea').type('{end}x', { force: true });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log("Enter incorrect answer")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}y`, { force: true }).blur();
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    });
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').type("{enter}", { force: true });
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Delete letter in input2")
    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}', { force: true });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Add letter back (no longer goes back to saying incorrect)")
    cy.get('#\\/_mathinput2 textarea').type('{end}x', { force: true });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').type("{enter}", { force: true });
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');

  });

  it('submit buttons with two text answer blanks', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>Enter rain and snow in either order: <textinput/> <textinput/>
        <answer>
        <award><when><text><copy prop="immediateValue" target="_textinput1" isResponse /> <copy prop="immediateValue" target="_textinput2" isResponse /></text> = <text>rain snow</text></when></award>
        <award><when><text><copy prop="immediateValue" target="_textinput1" /> <copy prop="immediateValue" target="_textinput2" /></text> = <text>snow rain</text></when></award>
        <award credit="0.5"><when><copy prop="immediateValue" target="_textinput1" /> = rain</when></award>
        <award credit="0.5"><when><copy prop="immediateValue" target="_textinput1" /> = snow</when></award>
        <award credit="0.5"><when><copy prop="immediateValue" target="_textinput2" /> = rain</when></award>
        <award credit="0.5"><when><copy prop="immediateValue" target="_textinput2" /> = snow</when></award>
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

    cy.log("Delete letter (no longer goes back to saying correct)")
    cy.get('#\\/_textinput1_input').type('{backspace}');
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
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

    cy.log("Delete letter (no longer goes back to saying correct)")
    cy.get('#\\/_textinput2_input').type('{backspace}');
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
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

    cy.log("Don't go back to saying correct if return to previous answer")
    cy.get('#\\/_textinput2_input').type('{backspace}').blur();
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


    cy.log("Add letter back (no longer to back to saying partially correct)")
    cy.get('#\\/_textinput2_input').type('w');
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


    cy.log("Add letter back (no longer go back to saying incorrect")
    cy.get('#\\/_textinput2_input').type('y');
    cy.get('#\\/_textinput1_input').should('have.value', 'x');
    cy.get('#\\/_textinput2_input').should('have.value', 'y');
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').type("{enter}", { force: true });
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');

  });

  it('submit button with external inputs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Favorite variable: <mathinput name="var" prefill="x"/></p>
    <p>Second favorite variable: <mathinput name="var2" prefill="y"/></p>
    <p>Enter variable:
    <answer>
      <mathinput name="ans"/>
      <award><when><copy prop="immediatevalue" target="ans" isResponse /> = <copy prop="immediatevalue" target="var" /></when></award>
      <award credit="0.5"><when><copy prop="immediatevalue" target="ans" /> = <copy prop="immediatevalue" target="var2" /></when></award>
    </answer>
    </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    // cy.get('#\\/var textarea').should('have.value', 'x');
    // cy.get('#\\/var2 textarea').should('have.value', 'y');
    // cy.get('#\\/ans textarea').should('have.value', '');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Type correct answer in")
    cy.get('#\\/ans textarea').type(`x`, { force: true });
    // cy.get('#\\/ans textarea').should('have.value', 'x');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans textarea').type(`{enter}`, { force: true });
    // cy.get('#\\/ans textarea').should('have.value', 'x');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Change correct answer");
    cy.get('#\\/var textarea').type(`{end}{backspace}u{enter}`, { force: true });
    // cy.get('#\\/var textarea').should('have.value', 'u');
    // cy.get('#\\/ans textarea').should('have.value', 'x');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans textarea').type(`{enter}`, { force: true });
    // cy.get('#\\/ans textarea').should('have.value', 'x');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('be.visible');
    cy.get('#\\/ans_partial').should('not.exist');


    cy.log("Change to new correct answer")
    cy.get('#\\/ans textarea').type(`{end}{backspace}u`, { force: true });
    // cy.get('#\\/ans textarea').should('have.value', 'u');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans textarea').type(`{enter}`, { force: true });
    // cy.get('#\\/ans textarea').should('have.value', 'u');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Change partial credit answer");
    cy.get('#\\/var2 textarea').type(`{end}{backspace}v{enter}`, { force: true });
    // cy.get('#\\/var2 textarea').should('have.value', 'v');
    // cy.get('#\\/var textarea').should('have.value', 'u');
    // cy.get('#\\/ans textarea').should('have.value', 'u');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans textarea').type(`{enter}`, { force: true });
    // cy.get('#\\/ans textarea').should('have.value', 'u');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');


    cy.log("Change to new partial correct answer")
    cy.get('#\\/ans textarea').type(`{end}{backspace}v`, { force: true });
    // cy.get('#\\/ans textarea').should('have.value', 'v');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans textarea').type(`{enter}`, { force: true });
    // cy.get('#\\/ans textarea').should('have.value', 'v');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('be.visible');


    cy.log("Change correct answer");
    cy.get('#\\/var textarea').type(`{end}{backspace}w{enter}`, { force: true });
    // cy.get('#\\/var textarea').should('have.value', 'w');
    // cy.get('#\\/ans textarea').should('have.value', 'v');
    // cy.get('#\\/var2 textarea').should('have.value', 'v');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans textarea').type(`{enter}`, { force: true });
    // cy.get('#\\/ans textarea').should('have.value', 'v');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('be.visible');


    cy.log("Change to new correct answer")
    cy.get('#\\/ans textarea').type(`{end}{backspace}w`, { force: true });
    // cy.get('#\\/ans textarea').should('have.value', 'w');
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/ans_correct').should('not.exist');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

    cy.log("Press enter")
    cy.get('#\\/ans textarea').type(`{enter}`, { force: true });
    // cy.get('#\\/ans textarea').should('have.value', 'w');
    cy.get('#\\/ans_submit').should('not.exist');
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get('#\\/ans_incorrect').should('not.exist');
    cy.get('#\\/ans_partial').should('not.exist');

  });

  it('answer with inline choiceinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>The animal is a <answer>
  <choiceinput inline randomizeOrder>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>.</p>
  <p>Current response: <text name="cr"><copy prop="currentResponse" target="_answer1" /></text></p>
  <p>Submitted response: <text name="sr"><copy prop="submittedResponse" target="_answer1" /></text></p>
  <p>Credit for submitted response: <number name="credit"><copy prop="creditAchieved" target="_answer1" /></number></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', '')
    cy.get("#\\/sr").should('have.text', '')
    cy.get("#\\/credit").should('have.text', '0')

    let indexByName = {};
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls([]);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').select(`dog`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'dog')
    cy.get("#\\/sr").should('have.text', '')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'dog')
    cy.get("#\\/sr").should('have.text', 'dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').select(`cat`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50 %');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });


    cy.log("Select incorrect answer again")
    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });


    cy.log("Does not remember previously submitted answer")
    cy.get('#\\/_choiceinput1').select(`cat`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });

    cy.log("Submit answer")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50 %');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });

  });

  it('answer with inline choiceinput, specify component type for submitted', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>The animal is a <answer>
  <choiceinput inline randomizeOrder>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>.</p>
  <p>Current response: <text name="cr"><copy prop="currentResponse" target="_answer1" /></text></p>
  <p>Submitted response: <text name="sr"><copy prop="submittedResponse" target="_answer1" componentType="text" /></text></p>
  <p>Credit for submitted response: <number name="credit"><copy prop="creditAchieved" target="_answer1" /></number></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', '')
    cy.get("#\\/sr").should('have.text', '')
    cy.get("#\\/credit").should('have.text', '0')

    let indexByName = {};
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls([]);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').select(`dog`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'dog')
    cy.get("#\\/sr").should('have.text', '')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'dog')
    cy.get("#\\/sr").should('have.text', 'dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').select(`cat`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50 %');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });


    cy.log("Select incorrect answer again")
    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });


    cy.log("Does not remember previously submitted answer")
    cy.get('#\\/_choiceinput1').select(`cat`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });

    cy.log("Submit answer")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50 %');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });

  });

  it('answer with inline choiceinput, fixedorder', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>The animal is a <answer>
  <choiceinput inline>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>.</p>
  <p>Current response: <text name="cr"><copy prop="currentResponse" target="_answer1" /></text></p>
  <p>Submitted response: <text name="sr"><copy prop="submittedResponse" target="_answer1" componentType="text" /></text></p>
  <p>Credit for submitted response: <number name="credit"><copy prop="creditAchieved" target="_answer1" /></number></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_choiceinput1').should('have.value', '');
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get('#\\/_choiceinput1').should('have.text', 'catdogmonkey');

    cy.get("#\\/cr").should('have.text', '')
    cy.get("#\\/sr").should('have.text', '')
    cy.get("#\\/credit").should('have.text', '0')

    let indexByName = { cat: 1, dog: 2, monkey: 3 };
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        expect(indexByName[val]).eq(ind + 1);
      }

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls([]);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').select(`dog`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'dog')
    cy.get("#\\/sr").should('have.text', '')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'dog')
    cy.get("#\\/sr").should('have.text', 'dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').select(`cat`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50 %');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });


    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });


    cy.log("Does not remember previously submitted answer")
    cy.get('#\\/_choiceinput1').select(`cat`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });


    cy.log("Submit answer")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50 %');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });



  });

  it('answer with select-multiple inline choiceinput, fixedorder', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>The animal is a <answer>
  <choiceinput inline selectMultiple matchPartial>
    <choice credit="1">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>.</p>
  <p name="cr">Current response: <aslist><copy prop="currentResponses" target="_answer1" /></aslist></p>
  <p name="sr">Submitted response: <aslist><copy prop="submittedResponses" target="_answer1" /></aslist></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="credit" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_choiceinput1').invoke('val').should('deep.equal', []);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get('#\\/_choiceinput1').should('have.text', 'catdogmonkey');

    cy.get("#\\/cr").should('have.text', 'Current response: ')
    cy.get("#\\/sr").should('have.text', 'Submitted response: ')
    cy.get("#\\/credit").should('have.text', '0')

    let indexByName = { cat: 1, dog: 2, monkey: 3 };
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        expect(indexByName[val]).eq(ind + 1);
      }

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls([]);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([]);

    });

    cy.log("Select half of correct answer")
    cy.get('#\\/_choiceinput1').select([`dog`]);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: ')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50 %');

    cy.get("#\\/cr").should('have.text', 'Current response: dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: dog')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
    });


    cy.log('Select both correct answers')
    cy.get('#\\/_choiceinput1').select(['dog', 'cat']);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: dog')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
    });


    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
    });


    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Select all answers")
    cy.get('#\\/_choiceinput1').select([`monkey`, `cat`, `dog`]);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '67 %');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog, monkey')
    cy.get("#\\/credit").should('have.text', '0.6666666667')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(2 / 3);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
    });


    cy.log("Select partially correct and incorrect answers")
    cy.get('#\\/_choiceinput1').select([`monkey`, , `dog`]);
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog, monkey')
    cy.get("#\\/credit").should('have.text', '0.6666666667')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(2 / 3);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '33 %');

    cy.get("#\\/cr").should('have.text', 'Current response: dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: dog, monkey')
    cy.get("#\\/credit").should('have.text', '0.3333333333')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1 / 3);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog', 'monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
    });


  });

  it('answer with block choiceinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>The animal is a:</p>
  <answer>
  <choiceinput randomizeOrder>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>
  <p>Current response: <text name="cr"><copy prop="currentResponse" target="_answer1" /></text></p>
  <p>Submitted response: <text name="sr"><copy prop="submittedResponse" target="_answer1" componentType="text" /></text></p>
  <p>Credit for submitted response: <number name="credit"><copy prop="creditAchieved" target="_answer1" /></number></p>
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

    cy.get("#\\/cr").should('have.text', '')
    cy.get("#\\/sr").should('have.text', '')
    cy.get("#\\/credit").should('have.text', '0')

    let indexByName = {};
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls([]);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);

    });

    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').contains(`dog`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'dog')
    cy.get("#\\/sr").should('have.text', '')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls([]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'dog')
    cy.get("#\\/sr").should('have.text', 'dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').contains(`monkey`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Select partially correct answer")
    cy.get('#\\/_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["monkey"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });


    cy.log("Select incorrect answer again")
    cy.get('#\\/_choiceinput1').contains(`monkey`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'monkey')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["dog"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["dog"]]);
    });


    cy.log("Does not remember previously submitted answer")
    cy.get('#\\/_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });


    cy.log("Submit answer")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.get("#\\/cr").should('have.text', 'cat')
    cy.get("#\\/sr").should('have.text', 'cat')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
      // expect(components['/_choiceinput1'].stateValues.submittedValues).eqls(["cat"]);
      // expect(components['/_choiceinput1'].stateValues.submittedIndices).eqls([indexByName["cat"]]);
    });


  });

  it('answer with select-multiple block choiceinput, fixedorder', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>The animal is a <answer>
  <choiceinput selectMultiple>
    <choice credit="1">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>.</p>
  <p name="cr">Current response: <aslist><copy prop="currentResponses" target="_answer1" /></aslist></p>
  <p name="sr">Submitted response: <aslist><copy prop="submittedResponses" target="_answer1" /></aslist></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="credit" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: ')
    cy.get("#\\/sr").should('have.text', 'Submitted response: ')
    cy.get("#\\/credit").should('have.text', '0')

    let indexByName = { cat: 1, dog: 2, monkey: 3 };
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        expect(indexByName[val]).eq(ind + 1);
      }

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls([]);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([]);

    });

    cy.log("Select half of correct answer")
    cy.get('#\\/_choiceinput1').contains(`dog`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: ')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: dog')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
    });


    cy.log('Select both correct answers')
    cy.get('#\\/_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: dog')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
    });


    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
    });


    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#\\/_choiceinput1').contains(`dog`).click({ force: true });
    cy.get('#\\/_choiceinput1').contains(`monkey`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Select all answers")
    cy.get('#\\/_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#\\/_choiceinput1').contains(`dog`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog, monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
    });


    cy.log("Select partially correct and incorrect answers")
    cy.get('#\\/_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog, monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: dog, monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog', 'monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
    });


  });

  it('answer with select-multiple block choiceinput, fixedorder, match partial', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>The animal is a <answer>
  <choiceinput selectMultiple matchPartial>
    <choice credit="1">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>.</p>
  <p name="cr">Current response: <aslist><copy prop="currentResponses" target="_answer1" /></aslist></p>
  <p name="sr">Submitted response: <aslist><copy prop="submittedResponses" target="_answer1" /></aslist></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="credit" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: ')
    cy.get("#\\/sr").should('have.text', 'Submitted response: ')
    cy.get("#\\/credit").should('have.text', '0')

    let indexByName = { cat: 1, dog: 2, monkey: 3 };
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      for (let [ind, val] of components['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        expect(indexByName[val]).eq(ind + 1);
      }

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls([]);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([]);

    });

    cy.log("Select half of correct answer")
    cy.get('#\\/_choiceinput1').contains(`dog`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: ')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
    });

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '50% Correct');

    cy.get("#\\/cr").should('have.text', 'Current response: dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: dog')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
    });


    cy.log('Select both correct answers')
    cy.get('#\\/_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: dog')
    cy.get("#\\/credit").should('have.text', '0.5')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
    });


    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
    });


    cy.log("Select incorrect answer")
    cy.get('#\\/_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#\\/_choiceinput1').contains(`dog`).click({ force: true });
    cy.get('#\\/_choiceinput1').contains(`monkey`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog')
    cy.get("#\\/credit").should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
    });

    cy.log("Select all answers")
    cy.get('#\\/_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#\\/_choiceinput1').contains(`dog`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: monkey')
    cy.get("#\\/credit").should('have.text', '0')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '67% Correct');

    cy.get("#\\/cr").should('have.text', 'Current response: cat, dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog, monkey')
    cy.get("#\\/credit").should('have.text', '0.6666666667')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(2 / 3);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['cat', 'dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
    });


    cy.log("Select partially correct and incorrect answers")
    cy.get('#\\/_choiceinput1').contains(`cat`).click({ force: true });
    cy.get('#\\/_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('not.exist');

    cy.get("#\\/cr").should('have.text', 'Current response: dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: cat, dog, monkey')
    cy.get("#\\/credit").should('have.text', '0.6666666667')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(2 / 3);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
    });

    cy.log("Press enter on submit button")
    cy.get('#\\/_choiceinput1_submit').type(`{enter}`, { force: true });
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
    cy.get('#\\/_choiceinput1_partial').should('have.text', '33% Correct');

    cy.get("#\\/cr").should('have.text', 'Current response: dog, monkey')
    cy.get("#\\/sr").should('have.text', 'Submitted response: dog, monkey')
    cy.get("#\\/credit").should('have.text', '0.3333333333')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1 / 3);
      expect((await components['/_answer1'].stateValues.currentResponses)).eqls(['dog', 'monkey']);
      expect(await components['/_answer1'].stateValues.submittedResponses).eqls(['dog', 'monkey']);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
    });


  });


  it('answer with choiceinput, no bug when submit first', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
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

    cy.log("Click submit button")
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_submit').should('not.exist');
    cy.get('#\\/_choiceinput1_correct').should('not.exist');
    cy.get('#\\/_choiceinput1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    })
    cy.get('#\\/_choiceinput1_partial').should('not.exist');


    cy.log("Select correct answer")
    cy.get('#\\/_choiceinput1').contains(`dog`).click({ force: true });
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


  });

  it('answer with variable number of choices', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Num: <mathinput name="num" prefill="3"/></p>

    <answer>
    <choiceinput randomizeOrder>
      <map>
        <template>
          <choice credit="$m">
          Get <number displaydigits="3"><copy target="m" /></number>, plus a bit is <math displaydigits="3" simplify><copy target="m" />+0.001</math></choice>
        </template>
        <sources alias="m">
          <sequence from="0" to="1" length="$num" />
        </sources>
      </map>
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

    cy.window().then(async (win) => {
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
    cy.get("#\\/num textarea").type("{end}{backspace}4{enter}", { force: true });

    cy.window().then(async (win) => {
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
    cy.get("#\\/num textarea").type("{end}{backspace}3{enter}", { force: true });

    cy.window().then(async (win) => {
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
    cy.get("#\\/num textarea").type("{end}{backspace}6{enter}", { force: true });

    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>Credit for cat: <mathinput name="catcredit" prefill="0.3" /> </p>
      <p>Last option: <textinput prefill="bird" name="last" /></p>
      <answer>
        <choiceinput>
        <choice credit="$catcredit">cat</choice>
        <choice credit="1">dog</choice>
        <choice>monkey</choice>
        <choice><copy prop="value" target="last" /></choice>
        </choiceinput>
      </answer>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let choiceinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName);
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
      cy.get("#\\/catcredit textarea").type("{end}{backspace}4{enter}", { force: true });
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
      cy.get("#\\/catcredit textarea").type("{end}{backspace}2{enter}", { force: true });
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
    })
  });

  it('switch answer between inline and block', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>Inline: <booleaninput name="inline" /> </p>
      <answer inline="$inline">
        <choiceinput randomizeOrder>
        <choice credit="0.5">cat</choice>
        <choice credit="1">dog</choice>
        <choice>monkey</choice>
        </choiceinput>
      </answer>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let choiceinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName);
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
      cy.get(choiceinputSubmitAnchor).should('not.exist');
      cy.get(choiceinputCorrectAnchor).should('not.exist');
      cy.get(choiceinputIncorrectAnchor).should('not.exist');
      cy.get(choiceinputPartialAnchor).should('have.text', '50 %');
    })
  });

  it('answer, any letter', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Enter any letter:
  <answer size='3' name='userx'>
  <mathinput name="userx_input"/>
  <award><when>
    <copy prop="immediatevalue" target="userx_input" /> elementof {a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z}
    </when>
  </award>
  </answer>
  </p>

 `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    // cy.get('#\\/userx_input_input').should('have.value', '');
    cy.get('#\\/userx_input_submit').should('be.visible');

    cy.log("Enter a letter")
    cy.get("#\\/userx_input textarea").type("a{enter}", { force: true });
    cy.get('#\\/userx_input_correct').should('be.visible');

    cy.log("Enter letter combination")
    cy.get("#\\/userx_input textarea").type("{end}{backspace}c,d{enter}", { force: true });
    cy.get('#\\/userx_input_incorrect').should('be.visible');

    cy.log("Enter another letter")
    cy.get("#\\/userx_input textarea").type("{end}{backspace}{backspace}{backspace}q{enter}", { force: true });
    cy.get('#\\/userx_input_correct').should('be.visible');

    cy.log("Enter a number")
    cy.get("#\\/userx_input textarea").type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/userx_input_incorrect').should('be.visible');
  });

  it('answer element of user defined set', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>Enter a set <mathinput name="set" prefill="{1,2,3}" size="20"/></p>
  <p>Enter an element of that set: 
  <answer>
  <mathinput name="element" />
  <award>
    <when><copy prop="immediatevalue" target="element" /> elementof <copy prop="value" target="set" /></when>
  </award>
  </answer>
  </p>
 `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    // cy.get('#\\/element_input').should('have.value', '');
    // cy.get('#\\/set_input').should('have.value', '{ 1, 2, 3 }');
    cy.get('#\\/element_submit').should('be.visible');

    cy.log("Enter a number from set")
    cy.get("#\\/element textarea").type("2{enter}", { force: true });
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter all numbers from set")
    cy.get("#\\/element textarea").type("{end}{backspace}1,2,3{enter}", { force: true });
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Enter a letter")
    cy.get("#\\/element textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}c{enter}", { force: true });
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Change set to letters")
    cy.get("#\\/set textarea").type("{end}{leftarrow}{backspace}{backspace}{backspace}{backspace}{backspace}a,b,c,d,e,f,g{enter}", { force: true });
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter another letter")
    cy.get("#\\/element textarea").type("{end}{backspace}g{enter}", { force: true });
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter a number")
    cy.get("#\\/element textarea").type("{end}{backspace}2{enter}", { force: true });
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Change set to mathematical expressions")
    cy.get("#\\/set textarea").type("{end}{leftarrow}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(x+y)/2{rightarrow}, e^(x^2{rightarrow} + y){rightArrow}, (1,2,3){enter}", { force: true });
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Enter one of the expressions")
    cy.get("#\\/element textarea").type("{end}{backspace}(1,2,3){enter}", { force: true });
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter another of the expressions")
    cy.get("#\\/element textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}e^(x^2{rightarrow} + y){enter}", { force: true });
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter third expression")
    cy.get("#\\/element textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}x+2y-x/2{rightarrow}-3y/2{enter}", { force: true });
    cy.get('#\\/element_correct').should('be.visible');


  });

  it('answer based on math and text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>Enter a number larger than one <mathinput/></p>
        <p>Say hello: <textinput/></p>
        
        <answer name="a"> 
         <award matchpartial><when>
         <copy prop="immediateValue" target="_mathinput1" isResponse /> > 1 
          and
          <copy prop="immediateValue" target="_textinput1" isResponse/> = hello
          </when></award>
        </answer>
        
        <p>Your math answer is <copy name="sr1" prop="submittedResponse" target="a" componentType="math" /></p>
        <p>Your text answer is <copy name="sr2" prop="submittedResponse2" target="a" componentType="text" /></p>
        <p>Credit for your answers <copy name="ca" prop="creditAchieved" target="a" /></p>
 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let sr1Anchor = cesc('#' + components['/sr1'].replacements[0].componentName);
      let sr2Anchor = cesc('#' + components['/sr2'].replacements[0].componentName);
      let caAnchor = cesc('#' + components['/ca'].replacements[0].componentName);

      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).should('have.text', '')
      cy.get(caAnchor).should('have.text', '0')

      cy.get("#\\/_mathinput1 textarea").type("2{enter}", { force: true });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).should('have.text', '')
      cy.get(caAnchor).should('have.text', '0')

      cy.get('#\\/a_submit').click();

      // wrap to change value of sr anchors
      cy.window().then(async (win) => {
        sr1Anchor = cesc('#' + components['/sr1'].replacements[0].componentName);
        sr2Anchor = cesc('#' + components['/sr2'].replacements[0].componentName);

        cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2')
        });
        cy.get(sr2Anchor).should('have.text', '')
        cy.get(caAnchor).should('have.text', '0.5')

        cy.get('#\\/_textinput1_input').clear().type(`hello{enter}`);
        cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2')
        });
        cy.get(sr2Anchor).should('have.text', '')
        cy.get(caAnchor).should('have.text', '0.5')

        cy.get('#\\/a_submit').click();
        cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2')
        });
        cy.get(sr2Anchor).should('have.text', 'hello')
        cy.get(caAnchor).should('have.text', '1')

        cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}0{enter}", { force: true });
        cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2')
        });
        cy.get(sr2Anchor).should('have.text', 'hello')
        cy.get(caAnchor).should('have.text', '1')

        cy.get('#\\/a_submit').click();

        cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('0')
        });
        cy.get(sr2Anchor).should('have.text', 'hello')
        cy.get(caAnchor).should('have.text', '0.5')

      })
    })
  });

  it('answer based on math and text, match partial in answer', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>Enter a number larger than one <mathinput/></p>
        <p>Say hello: <textinput/></p>
        
        <answer name="a" matchpartial> 
         <award targetsAreResponses="_mathinput1 _textinput1"><when>
          $_mathinput1 > 1 
          and
          $_textinput1 = hello
          </when></award>
        </answer>
        
        <p>Your math answer is <copy name="sr1" prop="submittedResponse" target="a" componentType="math" /></p>
        <p>Your text answer is <copy name="sr2" prop="submittedResponse2" target="a" componentType="text" /></p>
        <p>Credit for your answers <copy name="ca" prop="creditAchieved" target="a" /></p>
 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let sr1Anchor = cesc('#' + components['/sr1'].replacements[0].componentName);
      let sr2Anchor = cesc('#' + components['/sr2'].replacements[0].componentName);
      let caAnchor = cesc('#' + components['/ca'].replacements[0].componentName);

      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).should('have.text', '')
      cy.get(caAnchor).should('have.text', '0')

      cy.get("#\\/_mathinput1 textarea").type("2{enter}", { force: true });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).should('have.text', '')
      cy.get(caAnchor).should('have.text', '0')

      cy.get('#\\/a_submit').click();

      // wrap to change value of sr anchors
      cy.window().then(async (win) => {
        sr1Anchor = cesc('#' + components['/sr1'].replacements[0].componentName);
        sr2Anchor = cesc('#' + components['/sr2'].replacements[0].componentName);

        cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2')
        });
        cy.get(sr2Anchor).should('have.text', '')
        cy.get(caAnchor).should('have.text', '0.5')

        cy.get('#\\/_textinput1_input').clear().type(`hello{enter}`);
        cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2')
        });
        cy.get(sr2Anchor).should('have.text', '')
        cy.get(caAnchor).should('have.text', '0.5')

        cy.get('#\\/a_submit').click();
        cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2')
        });
        cy.get(sr2Anchor).should('have.text', 'hello')
        cy.get(caAnchor).should('have.text', '1')

        cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}0{enter}", { force: true });
        cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('2')
        });
        cy.get(sr2Anchor).should('have.text', 'hello')
        cy.get(caAnchor).should('have.text', '1')

        cy.get('#\\/a_submit').click();

        cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('0')
        });
        cy.get(sr2Anchor).should('have.text', 'hello')
        cy.get(caAnchor).should('have.text', '0.5')

      })
    })
  });

  it('answer with submitted response based on point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>Criterion: <mathinput prefill="1" /></p>
        <p>Move point so that its x-coordinate is larger than <copy prop="value" target="_mathinput1" />.</p>
        
        <graph>
          <point>(0,0)</point>
        </graph>

        <answer name="a"> 
          <award><when>
            <copy prop="immediateValue" target="_mathinput1"/> < <copy prop="x" target="_point1" isResponse />
          </when></award>
        </answer>
        
        <p>Your answer: <copy name="sr" prop="submittedResponse" target="a" componentType="math" /></p>
        <p>Credit for your answer <copy name="ca" prop="creditAchieved" target="a"/></p>
 `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let srAnchor = cesc('#' + components['/sr'].replacements[0].componentName);
      let caAnchor = cesc('#' + components['/ca'].replacements[0].componentName);
      let point = components["/_point1"];

      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.get('#\\/a_submit').click();

      // wrap to change value of srAnchor
      cy.window().then(async (win) => {
        srAnchor = cesc('#' + components['/sr'].replacements[0].componentName);

        cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('0')
        });
        cy.get(caAnchor).should('have.text', '0');

        cy.window().then(async (win) => {
          point.movePoint({ x: 3, y: -3 });

          cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal('0')
          });
          cy.get(caAnchor).should('have.text', '0')

          cy.get('#\\/a_submit').click();
          cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal('3')
          });
          cy.get(caAnchor).should('have.text', '1');

          cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}4{enter}", { force: true });
          cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal('3')
          });
          cy.get(caAnchor).should('have.text', '1')

          cy.get('#\\/a_submit').click();

          cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal('3')
          });
          cy.get(caAnchor).should('have.text', '0')

        });


        cy.window().then(async (win) => {
          point.movePoint({ x: 8, y: 9 });

          cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal('3')
          });
          cy.get(caAnchor).should('have.text', '0')

          cy.get('#\\/a_submit').click();
          cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal('8')
          });
          cy.get(caAnchor).should('have.text', '1');

        });

      })

    })
  });

  it('answer with unicode', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>x+2pi+3gamma+4mu+5xi+6eta</answer></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');

      cy.log("Symbols as escaped text")
      cy.get(mathinputAnchor).type(`x+2\\pi+3\\gamma+4\\mu+5\\xi+6\\eta{enter}{enter}`, { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');


      cy.log("Incorrect answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}x{enter}`, { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.log("Symbols as unicode")
      cy.get(mathinputAnchor).type(`{end}{backspace}x+2π+3γ+4μ+5ξ+6η{enter}{enter}`, { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');


    })
  });

  it('mark targets as responses', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>Enter minimum: <mathinput name="min" /></p>
        <p>Enter value larger than $min: <mathinput name="val" /></p>
        
        <answer name="a"> 
         <award targetsAreResponses="val"><when>$val > $min</when></award>
        </answer>
        
        <p>Current response <copy name="cr" prop="currentResponses" target="a" componentType="math" /></p>
        <p>Submitted response <copy name="sr" prop="submittedResponses" target="a" componentType="math" /></p>
        <p>Credit: <copy name="ca" prop="creditAchieved" target="a" /></p>
 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let crAnchor = cesc('#' + components['/cr'].replacements[0].componentName);
      let srAnchor = cesc('#' + components['/sr'].replacements[0].componentName);
      let caAnchor = cesc('#' + components['/ca'].replacements[0].componentName);

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        expect(components["/a"].stateValues.nResponses).eq(1)
      });

      cy.get("#\\/min textarea").type("2{enter}", { force: true });
      cy.get('#\\/a_submit').click();

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')


      cy.get("#\\/val textarea").type("3{enter}", { force: true });

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.get('#\\/a_submit').click();

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(caAnchor).should('have.text', '1')

    })
  });

  it('consider as responses', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>Enter two 2D points, where second to upward and to the right of the first:
         <mathinput name="P" /> <mathinput name="Q" /></p>
        
        <setup>
          <point name="PP" coords="$P" />
          <point name="QQ" coords="$Q" />
        </setup>

        <answer name="a">
          <considerAsResponses>$P $Q</considerAsResponses>
         <award><when>$(QQ{prop='x'}) > $(PP{prop='x'}) and $(QQ{prop='y'}) > $(PP{prop='y'})</when></award>
        </answer>
        
        <p>Current responses <aslist><copy name="cr" prop="currentResponses" target="a" componentType="math" nComponents="2" /></aslist></p>
        <p>Submitted responses <aslist><copy name="sr" prop="submittedResponses" target="a" componentType="math" nComponents="2" /></aslist></p>
        <p>Credit: <copy name="ca" prop="creditAchieved" target="a" /></p>
 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let cr1Anchor = cesc('#' + components['/cr'].replacements[0].componentName);
      let cr2Anchor = cesc('#' + components['/cr'].replacements[1].componentName);
      let sr1Anchor = cesc('#' + components['/sr'].replacements[0].componentName);
      let sr2Anchor = cesc('#' + components['/sr'].replacements[1].componentName);
      let caAnchor = cesc('#' + components['/ca'].replacements[0].componentName);

      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        expect(components["/a"].stateValues.nResponses).eq(2)
      });

      cy.get('#\\/P textarea').type("(2,3){enter}", { force: true })
      cy.get('#\\/Q textarea').type("(3,4){enter}", { force: true })

      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,3)')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.get('#\\/a_submit').click();

      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,3)')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,3)')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      });
      cy.get(caAnchor).should('have.text', '1')


      cy.get('#\\/P textarea').type("{home}{rightArrow}{rightArrow}{backspace}5{enter}", { force: true })
      cy.get('#\\/Q textarea').type("{end}{leftArrow}{backspace}1{enter}", { force: true })

      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,3)')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,1)')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,3)')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      });
      cy.get(caAnchor).should('have.text', '1')

      cy.get('#\\/a_submit').click();

      cy.get(cr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,3)')
      });
      cy.get(cr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,1)')
      });
      cy.get(sr1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,3)')
      });
      cy.get(sr2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,1)')
      });
      cy.get(caAnchor).should('have.text', '0')

    })
  });


  it('isResponse is not copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p><mathinput name="mi" />
        <answer name="ans">
          <award>
            <when><copy prop="value" target="mi" isResponse assignNames="v" name="cm" /> = x</when>
          </award>
          <award credit="0.9">
            <when>$v = y</when>
          </award>
          <award credit="0.8">
            <when>$cm = z</when>
          </award>
        </answer>
        </p>
        <p>Submitted responses of ans: <copy prop="submittedResponses" target="ans" assignNames="sr1 sr2 sr3" /></p>


 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get('#\\/mi textarea').type('x{enter}', { force: true });
    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_correct').should('be.visible')
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/sr2').should('not.exist')
    cy.get('#\\/sr3').should('not.exist')

    cy.get('#\\/mi textarea').type('{end}{backspace}y{enter}', { force: true });
    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('90% correct')
    })
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get('#\\/sr2').should('not.exist')
    cy.get('#\\/sr3').should('not.exist')


    cy.get('#\\/mi textarea').type('{end}{backspace}z{enter}', { force: true });
    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('80% correct')
    })
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/sr2').should('not.exist')
    cy.get('#\\/sr3').should('not.exist')


  });


  it('isResponse from targetsAreResponses is not copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>a1: <mathinput name="mi" />
        <answer name="ans">
          <award targetsAreResponses="mi">
            <when><copy prop="value" target="mi" assignNames="v" name="cm" /> = x</when>
          </award>
          <award credit="0.9">
            <when>$v = y</when>
          </award>
          <award credit="0.8">
            <when>$cm = z</when>
          </award>
        </answer>
        </p>
        <p>Submitted responses of ans: <copy prop="submittedResponses" target="ans" assignNames="sr1 sr2 sr3" /></p>


 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get('#\\/mi textarea').type('x{enter}', { force: true });
    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_correct').should('be.visible')
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/sr2').should('not.exist')
    cy.get('#\\/sr3').should('not.exist')

    cy.get('#\\/mi textarea').type('{end}{backspace}y{enter}', { force: true });
    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('90% correct')
    })
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get('#\\/sr2').should('not.exist')
    cy.get('#\\/sr3').should('not.exist')


    cy.get('#\\/mi textarea').type('{end}{backspace}z{enter}', { force: true });
    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('80% correct')
    })
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/sr2').should('not.exist')
    cy.get('#\\/sr3').should('not.exist')



  });

  it('isResponse from targetsAreResponses is not recursively copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>a1: <mathinput name="mi" />
        <answer name="ans">
          <award targetsAreResponses="mi">
            <when><math name="m">$mi</math> = x</when>
          </award>
          <award credit="0.9">
            <when>$m = y</when>
          </award>
          <award credit="0.8">
            <when>$(m{prop='value'}) = z</when>
          </award>
        </answer>
        </p>
        <p>Submitted responses of ans: <copy prop="submittedResponses" target="ans" assignNames="sr1 sr2 sr3" /></p>


 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get('#\\/mi textarea').type('x{enter}', { force: true });
    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_correct').should('be.visible')
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/sr2').should('not.exist')
    cy.get('#\\/sr3').should('not.exist')

    cy.get('#\\/mi textarea').type('{end}{backspace}y{enter}', { force: true });
    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('90% correct')
    })
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get('#\\/sr2').should('not.exist')
    cy.get('#\\/sr3').should('not.exist')


    cy.get('#\\/mi textarea').type('{end}{backspace}z{enter}', { force: true });
    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('80% correct')
    })
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/sr2').should('not.exist')
    cy.get('#\\/sr3').should('not.exist')



  });


  it('immediate value used for submit button', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>Enter value larger than 3: <mathinput name="val" /></p>
        
        <answer name="a"> 
         <award targetsAreResponses="val"><when>$val > 3</when></award>
        </answer>
        
        <p>Current response: <copy name="cr" prop="currentResponses" target="a" componentType="math" /></p>
        <p>Submitted response: <copy name="sr" prop="submittedResponses" target="a" componentType="math" /></p>
        <p>Credit: <copy name="ca" prop="creditAchieved" target="a" /></p>
 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let crAnchor = cesc('#' + components['/cr'].replacements[0].componentName);
      let srAnchor = cesc('#' + components['/sr'].replacements[0].componentName);
      let caAnchor = cesc('#' + components['/ca'].replacements[0].componentName);


      let submitAnchor = cesc('#/a_submit');
      let correctAnchor = cesc('#/a_correct');
      let incorrectAnchor = cesc('#/a_incorrect');

      cy.get(submitAnchor).should('be.visible');
      cy.get(correctAnchor).should('not.exist');
      cy.get(incorrectAnchor).should('not.exist');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')


      cy.get("#\\/val textarea").type("3{enter}", { force: true });

      cy.get(submitAnchor).should('be.visible');
      cy.get(correctAnchor).should('not.exist');
      cy.get(incorrectAnchor).should('not.exist');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.get('#\\/a_submit').click();

      cy.get(submitAnchor).should('not.exist');
      cy.get(correctAnchor).should('not.exist');
      cy.get(incorrectAnchor).should('be.visible');


      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(caAnchor).should('have.text', '0')


      cy.get("#\\/val textarea").type("{end}{backspace}4", { force: true });

      cy.get(submitAnchor).should('be.visible');
      cy.get(correctAnchor).should('not.exist');
      cy.get(incorrectAnchor).should('not.exist');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.get("#\\/val textarea").type("{end}{backspace}3", { force: true });

      cy.get(submitAnchor).should('be.visible');
      cy.get(correctAnchor).should('not.exist');
      cy.get(incorrectAnchor).should('not.exist');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(caAnchor).should('have.text', '0')


      cy.get('#\\/a_submit').click();
      cy.get(submitAnchor).should('not.exist');
      cy.get(correctAnchor).should('not.exist');
      cy.get(incorrectAnchor).should('be.visible');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.get("#\\/val textarea").type("{end}{backspace}5", { force: true });

      cy.get(submitAnchor).should('be.visible');
      cy.get(correctAnchor).should('not.exist');
      cy.get(incorrectAnchor).should('not.exist');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(caAnchor).should('have.text', '0')

      cy.get("#\\/val textarea").blur();

      cy.get(submitAnchor).should('be.visible');
      cy.get(correctAnchor).should('not.exist');
      cy.get(incorrectAnchor).should('not.exist');

      cy.get(crAnchor + ' .mjx-mrow').should('have.text', '5')
      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(caAnchor).should('have.text', '0')


      cy.get('#\\/a_submit').click();
      cy.get(submitAnchor).should('not.exist');
      cy.get(correctAnchor).should('be.visible');
      cy.get(incorrectAnchor).should('not.exist');

      cy.get(crAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      });
      cy.get(srAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      });
      cy.get(caAnchor).should('have.text', '1')

    })
  });

  it('choiceinput credit from boolean', () => {

    let options = ["meow", "woof", "squeak", "blub"]
    for (let ind = 1; ind <= 4; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl nvariants="4" variantNames="cat dog mouse fish"/>
  
        <select assignNames="(animal)" hide>
          <option selectForVariantNames="cat">
            <text>cat</text>
          </option>
          <option selectForVariantNames="dog">
            <text>dog</text>
          </option>
          <option selectForVariantNames="mouse">
            <text>mouse</text>
          </option>
          <option selectForVariantNames="fish">
            <text>fish</text>
          </option>
        </select>
        
        <p>What does the $animal say?
          <answer name="ans">
            <choiceinput randomizeOrder>
            <choice credit="$animal=cat" >meow</choice>
            <choice credit="$animal=dog" >woof</choice>
            <choice credit="$animal=mouse" >squeak</choice>
            <choice credit="$animal=fish" >blub</choice>
            </choiceinput>
          </answer>
        </p>
        `,
          requestedVariant: { index: ind },
        }, "*");
      });


      cy.get('#\\/_text1').should('have.text', `${ind}`);  // to wait until loaded

      for (let ind2 = 1; ind2 <= 4; ind2++) {

        cy.get('#\\/_choiceinput1').contains(options[ind2 - 1]).click({ force: true });

        cy.get('#\\/_choiceinput1_submit').click();
        cy.get('#\\/_choiceinput1_submit').should('not.exist');
        if (ind2 === ind) {
          cy.get('#\\/_choiceinput1_correct').should('be.visible');
          cy.get('#\\/_choiceinput1_incorrect').should('not.exist');
        } else {
          cy.get('#\\/_choiceinput1_correct').should('not.exist');
          cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
        }
      }

    }
  });

  it('award credit from boolean', () => {

    let options = ["meow", "woof", "squeak", "blub"]
    for (let ind = 1; ind <= 4; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl nvariants="4" variantNames="cat dog mouse fish"/>
  
        <select assignNames="(animal sound)" hide>
          <option selectForVariantNames="cat">
            <text>cat</text><text>meow</text>
          </option>
          <option selectForVariantNames="dog">
            <text>dog</text><text>woof</text>
          </option>
          <option selectForVariantNames="mouse">
            <text>mouse</text><text>squeak</text>
          </option>
          <option selectForVariantNames="fish">
            <text>fish</text><text>blub</text>
          </option>
        </select>
        
        <p>What does the $animal say?
          <answer name="ans" type="text">
            <award credit="$animal=cat" ><text>meow</text></award>
            <award credit="$animal=dog" ><text>woof</text></award>
            <award credit="$animal=mouse" ><text>squeak</text></award>
            <award credit="$animal=fish" ><text>blub</text></award>
          </answer>
        </p>
        `,
          requestedVariant: { index: ind },
        }, "*");
      });


      cy.get('#\\/_text1').should('have.text', `${ind}`);  // to wait until loaded

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let textinputName = components['/ans'].stateValues.inputChildren[0].componentName
        let textinputAnchor = cesc('#' + textinputName + '_input');
        let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
        let textinputCorrectAnchor = cesc('#' + textinputName + '_correct');
        let textinputIncorrectAnchor = cesc('#' + textinputName + '_incorrect');


        for (let ind2 = 1; ind2 <= 4; ind2++) {

          cy.get(textinputAnchor).clear().type(options[ind2 - 1]);
          cy.get(textinputSubmitAnchor).click();

          cy.get(textinputSubmitAnchor).should('not.exist');
          if (ind2 === ind) {
            cy.get(textinputCorrectAnchor).should('be.visible');
            cy.get(textinputIncorrectAnchor).should('not.exist');
          } else {
            cy.get(textinputCorrectAnchor).should('not.exist');
            cy.get(textinputIncorrectAnchor).should('be.visible');
          }
        }
      })

    }
  });

  it('number of awards credited', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>Number of awards credited: <mathinput name="nawards" prefill="1" /></p>
        <p>Credit for combined award: <mathinput name="creditForCombined" prefill="1" /></p>
        <p>Distinct numbers greater than 3:
        <mathinput name="mi1" />
        <mathinput name="mi2" />
        <answer nAwardsCredited="$nawards" name="a">
          <award feedbackText="First is greater than 3" credit="0.4" targetsAreResponses="mi1"><when>$mi1 > 3</when></award>
          <award feedbackText="Second is greater than 3" credit="0.4" targetsAreResponses="mi2"><when>$mi2 > 3</when></award>
          <award feedbackText="Distinct and greater than 3" credit="$creditForCombined"><when>$mi1 > 3 and $mi2 > 3 and $mi1 != $mi2</when></award>
          <award feedbackText="At least the first is a number" credit="0"><when><isNumber>$mi1</isNumber></when></award>
          <award feedbackText="At least the second is a number" credit="0"><when>isnumber($mi2)</when></award>
        </answer>
        </p>

        <copy prop="feedbacks" target="a" assignNames="fb1 fb2 fb3 fb4 fb5" />

        <p>Current responses: <aslist><copy prop="currentResponses" target="a" componentType="math" nComponents="2" assignNames="cr1 cr2" /></aslist></p>
        <p>Submitted response: <aslist><copy prop="submittedResponses" target="a" componentType="math" nComponents="2" assignNames="sr1 sr2" /></aslist></p>
        <p>Credit: <copy assignNames="ca" prop="creditAchieved" target="a" /></p>
 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    let submitAnchor = cesc('#/a_submit');
    let correctAnchor = cesc('#/a_correct');
    let incorrectAnchor = cesc('#/a_incorrect');
    let partialAnchor = cesc('#/a_partial');

    cy.get(submitAnchor).should('be.visible');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('not.exist')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')

    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get("#\\/ca").should('have.text', '0')

    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('not.exist')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')

    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get("#\\/ca").should('have.text', '0')


    cy.get("#\\/mi2 textarea").type("1{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'At least the second is a number')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')


    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get("#\\/ca").should('have.text', '0')


    cy.get("#\\/mi1 textarea").type("0{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'At least the first is a number')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')


    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get("#\\/ca").should('have.text', '0')


    cy.get("#\\/nawards textarea").type("{end}{backspace}3{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'At least the first is a number')
    cy.get('#\\/fb2').should('have.text', 'At least the second is a number')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')


    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get("#\\/ca").should('have.text', '0')



    cy.get("#\\/mi1 textarea").type("{end}{backspace}4{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is greater than 3')
    cy.get('#\\/fb2').should('have.text', 'At least the first is a number')
    cy.get('#\\/fb3').should('have.text', 'At least the second is a number')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')


    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get("#\\/ca").should('have.text', '0.4')


    cy.get("#\\/nawards textarea").type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is greater than 3')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')

    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get("#\\/ca").should('have.text', '0.4')



    cy.get("#\\/mi2 textarea").type("{end}{backspace}4{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is greater than 3')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')

    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get("#\\/ca").should('have.text', '0.4')



    cy.get("#\\/nawards textarea").type("{end}{backspace}3{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('80% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is greater than 3')
    cy.get('#\\/fb2').should('have.text', 'Second is greater than 3')
    cy.get('#\\/fb3').should('have.text', 'At least the first is a number')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')

    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get("#\\/ca").should('have.text', '0.8')


    cy.get("#\\/mi2 textarea").type("{end}{backspace}5{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('be.visible');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'First is greater than 3')
    cy.get('#\\/fb2').should('have.text', 'Second is greater than 3')
    cy.get('#\\/fb3').should('have.text', 'Distinct and greater than 3')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')

    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get("#\\/ca").should('have.text', '1')


    cy.get("#\\/nawards textarea").type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('be.visible');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'Distinct and greater than 3')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')

    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get("#\\/ca").should('have.text', '1')


    cy.get("#\\/creditForCombined textarea").type("{end}{backspace}0.2{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is greater than 3')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')

    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get("#\\/ca").should('have.text', '0.4')


    cy.get("#\\/nawards textarea").type("{end}{backspace}2{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('80% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is greater than 3')
    cy.get('#\\/fb2').should('have.text', 'Second is greater than 3')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')

    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get("#\\/ca").should('have.text', '0.8')


    cy.get("#\\/nawards textarea").type("{end}{backspace}3{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('be.visible');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'First is greater than 3')
    cy.get('#\\/fb2').should('have.text', 'Second is greater than 3')
    cy.get('#\\/fb3').should('have.text', 'Distinct and greater than 3')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')

    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get("#\\/ca").should('have.text', '1')



  });

  it('number of awards credited 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>
        <mathinput name="mi1" />
        <mathinput name="mi2" />
        <mathinput name="mi3" />
        <answer nAwardsCredited="3" name="a">
          <award feedbackText="First is positive" credit="0.2" targetsAreResponses="mi1"><when>$mi1 > 0</when></award>
          <award feedbackText="Second is positive" credit="0.2" targetsAreResponses="mi2"><when>$mi2 > 0</when></award>
          <award feedbackText="Third is positive" credit="0.2" targetsAreResponses="mi3"><when>$mi3 > 0</when></award>
          <award feedbackText="First is larger than second" credit="0.1"><when>$mi1 > $mi2</when></award>
          <award feedbackText="First is larger than third" credit="0.1"><when>$mi1 > $mi3</when></award>
          <award feedbackText="Second is larger than third" credit="0.1"><when>$mi2 > $mi3</when></award>
          <award feedbackText="Sum of first two is larger than 5!" credit="0.35"><when>$mi1 + $mi2 > 5</when></award>
          <award feedbackText="Sum of first and third is larger than 5!" credit="0.35"><when>$mi1 + $mi3 > 5</when></award>
          <award feedbackText="Sum of second and third is larger than 5!" credit="0.35"><when>$mi2 + $mi3 > 5</when></award>
          <award feedbackText="The first should be a number" credit="0"><when><not><isNumber>$mi1</isNumber></not></when></award>
          <award feedbackText="The second should be a number" credit="0"><when>not isnumber($mi2)</when></award>
          <award feedbackText="The third should be a number" credit="0"><when><not>isnumber($mi3)</not></when></award>
          </answer>
        </p>

        <copy prop="feedbacks" target="a" assignNames="fb1 fb2 fb3 fb4 fb5" />

        <p>Credit: <copy assignNames="ca" prop="creditAchieved" target="a" /></p>

 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    let submitAnchor = cesc('#/a_submit');
    let correctAnchor = cesc('#/a_correct');
    let incorrectAnchor = cesc('#/a_incorrect');
    let partialAnchor = cesc('#/a_partial');

    cy.get(submitAnchor).should('be.visible');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('not.exist')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')


    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'The first should be a number')
    cy.get('#\\/fb2').should('have.text', 'The second should be a number')
    cy.get('#\\/fb3').should('have.text', 'The third should be a number')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0')


    cy.get("#\\/mi1 textarea").type("-5{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'The second should be a number')
    cy.get('#\\/fb2').should('have.text', 'The third should be a number')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0')


    cy.get("#\\/mi2 textarea").type("-5{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'The third should be a number')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0')

    cy.get("#\\/mi3 textarea").type("-5{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('not.exist')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0')


    cy.get("#\\/mi2 textarea").type("{end}{backspace}4{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('10% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'Second is larger than third')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0.1')


    cy.get("#\\/mi1 textarea").type("{end}{backspace}4{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('20% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is larger than third')
    cy.get('#\\/fb2').should('have.text', 'Second is larger than third')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0.2')


    cy.get("#\\/mi1 textarea").type("{end}{backspace}3{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('30% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is larger than second')
    cy.get('#\\/fb2').should('have.text', 'First is larger than third')
    cy.get('#\\/fb3').should('have.text', 'Second is larger than third')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0.3')


    cy.get("#\\/mi1 textarea").type("{end}{backspace}{backspace}8{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is positive')
    cy.get('#\\/fb2').should('have.text', 'First is larger than second')
    cy.get('#\\/fb3').should('have.text', 'First is larger than third')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0.4')


    cy.get("#\\/mi2 textarea").type("{end}{backspace}{backspace}-2{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('65% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is positive')
    cy.get('#\\/fb2').should('have.text', 'First is larger than second')
    cy.get('#\\/fb3').should('have.text', 'Sum of first two is larger than 5!')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0.65')


    cy.get("#\\/mi2 textarea").type("{end}{backspace}{backspace}9{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is positive')
    cy.get('#\\/fb2').should('have.text', 'Second is positive')
    cy.get('#\\/fb3').should('have.text', 'Sum of first two is larger than 5!')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0.75')


    cy.get("#\\/mi2 textarea").type("{end}{backspace}{backspace}11{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('90% correct')
    })

    cy.get('#\\/fb1').should('have.text', 'First is positive')
    cy.get('#\\/fb2').should('have.text', 'Sum of first two is larger than 5!')
    cy.get('#\\/fb3').should('have.text', 'Sum of second and third is larger than 5!')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0.9')


    cy.get("#\\/mi3 textarea").type("{end}{backspace}{backspace}-1{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('be.visible');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'Sum of first two is larger than 5!')
    cy.get('#\\/fb2').should('have.text', 'Sum of first and third is larger than 5!')
    cy.get('#\\/fb3').should('have.text', 'Sum of second and third is larger than 5!')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '1')


    cy.get("#\\/mi3 textarea").type("{end}{backspace}{backspace}6{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('be.visible');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'Sum of first two is larger than 5!')
    cy.get('#\\/fb2').should('have.text', 'Sum of first and third is larger than 5!')
    cy.get('#\\/fb3').should('have.text', 'Sum of second and third is larger than 5!')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '1')


    cy.get("#\\/mi1 textarea").type("{end}{backspace}{backspace}15{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('be.visible');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'Sum of first two is larger than 5!')
    cy.get('#\\/fb2').should('have.text', 'Sum of first and third is larger than 5!')
    cy.get('#\\/fb3').should('have.text', 'Sum of second and third is larger than 5!')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '1')


  });

  it('number of awards credited, zero credits are triggered', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>
        <mathinput name="mi1" />
        <mathinput name="mi2" />
        <mathinput name="mi3" />
        <answer nAwardsCredited="3" name="a">
          <award targetsAreResponses="mi1 mi2 mi3" matchPartial>
            <when>$mi1=x and $mi2=y and $mi3=z</when>
          </award>
          <award credit="0" feedbackText="Nothing is in the right spot">
            <when>$mi1!=x and $mi2!=y and $mi3!=z</when>
          </award>
          <award credit="0" feedbackText="x is in the wrong spot">
            <when>$mi2=x or $mi3=x</when>
          </award>
          <award credit="0" feedbackText="y is in the wrong spot">
            <when>$mi1=y or $mi3=y</when>
          </award>
          <award credit="0" feedbackText="z is in the wrong spot">
            <when>$mi1=z or $mi2=z</when>
          </award>
          </answer>
        </p>

        <copy prop="feedbacks" target="a" assignNames="fb1 fb2 fb3 fb4 fb5" />

        <p>Credit: <copy assignNames="ca" prop="creditAchieved" target="a" displayDecimals="3" /></p>

 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    let submitAnchor = cesc('#/a_submit');
    let correctAnchor = cesc('#/a_correct');
    let incorrectAnchor = cesc('#/a_incorrect');
    let partialAnchor = cesc('#/a_partial');

    cy.get(submitAnchor).should('be.visible');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('not.exist')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')


    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'Nothing is in the right spot')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0')


    cy.get("#\\/mi1 textarea").type("z{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'Nothing is in the right spot')
    cy.get('#\\/fb2').should('have.text', 'z is in the wrong spot')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0')


    cy.get("#\\/mi2 textarea").type("y{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get('#\\/fb1').should('have.text', 'z is in the wrong spot')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0.333')

    cy.get("#\\/mi3 textarea").type("x{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get('#\\/fb1').should('have.text', 'x is in the wrong spot')
    cy.get('#\\/fb2').should('have.text', 'z is in the wrong spot')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0.333')


    cy.get("#\\/mi1 textarea").type("{end}{backspace}y{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get('#\\/fb1').should('have.text', 'x is in the wrong spot')
    cy.get('#\\/fb2').should('have.text', 'y is in the wrong spot')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0.333')


    cy.get("#\\/mi2 textarea").type("{end}{backspace}z{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');
    cy.get(partialAnchor).should('not.exist');

    cy.get('#\\/fb1').should('have.text', 'Nothing is in the right spot')
    cy.get('#\\/fb2').should('have.text', 'x is in the wrong spot')
    cy.get('#\\/fb3').should('have.text', 'y is in the wrong spot')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0')

    cy.get("#\\/mi2 textarea").type("{end}{backspace}y{enter}", { force: true });
    cy.get("#\\/mi3 textarea").type("{end}{backspace}z{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get('#\\/fb1').should('have.text', 'y is in the wrong spot')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '0.667')


    cy.get("#\\/mi1 textarea").type("{end}{backspace}x{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('be.visible');
    cy.get(incorrectAnchor).should('not.exist');
    cy.get(partialAnchor).should('not.exist');
    cy.get('#\\/fb1').should('not.exist')
    cy.get('#\\/fb2').should('not.exist')
    cy.get('#\\/fb3').should('not.exist')
    cy.get('#\\/fb4').should('not.exist')
    cy.get('#\\/fb5').should('not.exist')
    cy.get("#\\/ca").should('have.text', '1')



  });

  it('nSubmissions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>
    <award><math>x+y</math></award>
  </answer></p>
  <p><answer type="text">hello</answer></p>
  <p>Number of submissions 1: <copy target="_answer1" prop="nSubmissions" assignNames="nsubs1" /></p>
  <p>Number of submissions 2: <copy target="_answer2" prop="nSubmissions" assignNames="nsubs2" /></p>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get('#\\/nsubs1').should('have.text', 0);
    cy.get('#\\/nsubs2').should('have.text', 0);

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/_answer1"].stateValues.nSubmissions).eq(0);
      expect(components["/nsubs1"].stateValues.value).eq(0);
      expect(components["/_answer2"].stateValues.nSubmissions).eq(0);
      expect(components["/nsubs2"].stateValues.value).eq(0);

      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      let textinputName = components['/_answer2'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + "_input");
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.get(mathinputAnchor).type("x+y{enter}", { force: true });


      cy.get('#\\/nsubs1').should('have.text', 1)
      cy.get('#\\/nsubs2').should('have.text', 0).then(() => {
        expect(components["/_answer1"].stateValues.nSubmissions).eq(1);
        expect(components["/nsubs1"].stateValues.value).eq(1);
        expect(components["/_answer2"].stateValues.nSubmissions).eq(0);
        expect(components["/nsubs2"].stateValues.value).eq(0);
      })

      cy.get(mathinputAnchor).type("{end}{backspace}{backspace}", { force: true });

      cy.get('#\\/nsubs1').should('have.text', 1)
      cy.get('#\\/nsubs2').should('have.text', 0).then(() => {
        expect(components["/_answer1"].stateValues.nSubmissions).eq(1);
        expect(components["/nsubs1"].stateValues.value).eq(1);
        expect(components["/_answer2"].stateValues.nSubmissions).eq(0);
        expect(components["/nsubs2"].stateValues.value).eq(0);
      })

      cy.get(textinputAnchor).type("h").blur();
      cy.get('#\\/nsubs1').should('have.text', 1)
      cy.get('#\\/nsubs2').should('have.text', 0).then(() => {
        expect(components["/_answer1"].stateValues.nSubmissions).eq(1);
        expect(components["/nsubs1"].stateValues.value).eq(1);
        expect(components["/_answer2"].stateValues.nSubmissions).eq(0);
        expect(components["/nsubs2"].stateValues.value).eq(0);
      })


      cy.get(mathinputSubmitAnchor).click()

      cy.get('#\\/nsubs1').should('have.text', 2)
      cy.get('#\\/nsubs2').should('have.text', 0).then(() => {
        expect(components["/_answer1"].stateValues.nSubmissions).eq(2);
        expect(components["/nsubs1"].stateValues.value).eq(2);
        expect(components["/_answer2"].stateValues.nSubmissions).eq(0);
        expect(components["/nsubs2"].stateValues.value).eq(0);
      })

      cy.get(textinputSubmitAnchor).click()

      cy.get('#\\/nsubs1').should('have.text', 2)
      cy.get('#\\/nsubs2').should('have.text', 1).then(() => {
        expect(components["/_answer1"].stateValues.nSubmissions).eq(2);
        expect(components["/nsubs1"].stateValues.value).eq(2);
        expect(components["/_answer2"].stateValues.nSubmissions).eq(1);
        expect(components["/nsubs2"].stateValues.value).eq(1);
      })


      cy.get(textinputAnchor).clear().type("hello").blur();
      cy.get(mathinputAnchor).type("{end}+y", { force: true }).blur();

      cy.get('#\\/nsubs1').should('have.text', 2)
      cy.get('#\\/nsubs2').should('have.text', 1).then(() => {
        expect(components["/_answer1"].stateValues.nSubmissions).eq(2);
        expect(components["/nsubs1"].stateValues.value).eq(2);
        expect(components["/_answer2"].stateValues.nSubmissions).eq(1);
        expect(components["/nsubs2"].stateValues.value).eq(1);
      })


      cy.get(mathinputSubmitAnchor).click()
      cy.get('#\\/nsubs1').should('have.text', 3)
      cy.get('#\\/nsubs2').should('have.text', 1).then(() => {
        expect(components["/_answer1"].stateValues.nSubmissions).eq(3);
        expect(components["/nsubs1"].stateValues.value).eq(3);
        expect(components["/_answer2"].stateValues.nSubmissions).eq(1);
        expect(components["/nsubs2"].stateValues.value).eq(1);
      })

      cy.get(textinputSubmitAnchor).click()
      cy.get('#\\/nsubs1').should('have.text', 3)
      cy.get('#\\/nsubs2').should('have.text', 2).then(() => {
        expect(components["/_answer1"].stateValues.nSubmissions).eq(3);
        expect(components["/nsubs1"].stateValues.value).eq(3);
        expect(components["/_answer2"].stateValues.nSubmissions).eq(2);
        expect(components["/nsubs2"].stateValues.value).eq(2);
      })


    })
  });

  it('answer with choiceinput inside invalid child logic', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <problem>
    <sideBySide>
    
      <choiceInput inline name='choice1'>
        <choice>1</choice>
        <choice>2</choice>
        <choice>3</choice>
        <choice>4</choice>
        <choice>5</choice>
      </choiceInput>
    
    </sideBySide>
    <copy prop='selectedValue' target='choice1' />
    
    <answer>
      <award><when><copy prop='selectedValue' target='choice1' /> = 4</when></award>
    </answer>
  
  </problem>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log("Select correct answer")
    cy.get('#\\/choice1').select(`4`);
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    })

    cy.log("Select incorrect answer and submit")
    cy.get('#\\/choice1').select(`3`);
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    })
  });

  it('maximum number of attempts', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>x</answer></p>
  <p><answer maximumNumberOfAttempts="2">x</answer></p>
  <p><answer forceFullCheckworkButton>x</answer></p>
  <p><answer forceFullCheckworkButton maximumNumberOfAttempts="2">x</answer></p>
  
  <p><answer type="text">hello</answer></p>
  <p><answer type="text" maximumNumberOfAttempts="2">hello</answer></p>
  <p><answer type="text" forceFullCheckworkButton>hello</answer></p>
  <p><answer type="text" forceFullCheckworkButton maximumNumberOfAttempts="2">hello</answer></p>
    
  <p><answer>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer maximumNumberOfAttempts="2">
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton maximumNumberOfAttempts="2">
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  
  <p><answer>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer maximumNumberOfAttempts="2">
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton maximumNumberOfAttempts="2">
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>

  <p><answer type="boolean">true</answer></p>
  <p><answer type="boolean" maximumNumberOfAttempts="2">true</answer></p>
  <p><answer type="boolean" forceFullCheckworkButton>true</answer></p>
  <p><answer type="boolean" forceFullCheckworkButton maximumNumberOfAttempts="2">true</answer></p>
   `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let inputNames = [...Array(20).keys()].map(n => components[`/_answer${n + 1}`].stateValues.inputChildren[0].componentName);

      cy.log("Submit correct answers")
      cy.get(cesc('#' + inputNames[0]) + " textarea").type('x{enter}', { force: true })
      cy.get(cesc('#' + inputNames[1]) + " textarea").type('x{enter}', { force: true })
      cy.get(cesc('#' + inputNames[2]) + " textarea").type('x{enter}', { force: true })
      cy.get(cesc('#' + inputNames[3]) + " textarea").type('x{enter}', { force: true })
      cy.get(cesc("#/_answer3_submit")).click();
      cy.get(cesc("#/_answer4_submit")).click();
      cy.get(cesc('#' + inputNames[0]) + "_correct").should('be.visible');
      cy.get(cesc('#' + inputNames[1]) + "_correct").should('be.visible');
      cy.get(cesc("#/_answer3_correct")).should('be.visible');
      cy.get(cesc("#/_answer4_correct")).should('be.visible');

      cy.get(cesc('#' + inputNames[4]) + "_input").type('hello{enter}')
      cy.get(cesc('#' + inputNames[5]) + "_input").type('hello{enter}')
      cy.get(cesc('#' + inputNames[6]) + "_input").type('hello{enter}')
      cy.get(cesc('#' + inputNames[7]) + "_input").type('hello{enter}')
      cy.get(cesc("#/_answer7_submit")).click();
      cy.get(cesc("#/_answer8_submit")).click();
      cy.get(cesc('#' + inputNames[4]) + "_correct").should('be.visible');
      cy.get(cesc('#' + inputNames[5]) + "_correct").should('be.visible');
      cy.get(cesc("#/_answer7_correct")).should('be.visible');
      cy.get(cesc("#/_answer8_correct")).should('be.visible');

      cy.get(cesc('#/_choiceinput1')).contains("yes").click({ force: true });
      cy.get(cesc('#/_choiceinput2')).contains("yes").click({ force: true });
      cy.get(cesc('#/_choiceinput3')).contains("yes").click({ force: true });
      cy.get(cesc('#/_choiceinput4')).contains("yes").click({ force: true });
      cy.get(cesc("#/_choiceinput1_submit")).click();
      cy.get(cesc("#/_choiceinput2_submit")).click();
      cy.get(cesc("#/_answer11_submit")).click();
      cy.get(cesc("#/_answer12_submit")).click();
      cy.get(cesc("#/_choiceinput1_correct")).should('be.visible');
      cy.get(cesc("#/_choiceinput2_correct")).should('be.visible');
      cy.get(cesc("#/_answer11_correct")).should('be.visible');
      cy.get(cesc("#/_answer12_correct")).should('be.visible');

      cy.get('#\\/_choiceinput5').select(`yes`);
      cy.get('#\\/_choiceinput6').select(`yes`);
      cy.get('#\\/_choiceinput7').select(`yes`);
      cy.get('#\\/_choiceinput8').select(`yes`);
      cy.get(cesc("#/_choiceinput5_submit")).click();
      cy.get(cesc("#/_choiceinput6_submit")).click();
      cy.get(cesc("#/_answer15_submit")).click();
      cy.get(cesc("#/_answer16_submit")).click();
      cy.get(cesc("#/_choiceinput5_correct")).should('be.visible');
      cy.get(cesc("#/_choiceinput6_correct")).should('be.visible');
      cy.get(cesc("#/_answer15_correct")).should('be.visible');
      cy.get(cesc("#/_answer16_correct")).should('be.visible');

      cy.get(cesc('#' + inputNames[16]) + "_input").click();
      cy.get(cesc('#' + inputNames[17]) + "_input").click();
      cy.get(cesc('#' + inputNames[18]) + "_input").click();
      cy.get(cesc('#' + inputNames[19]) + "_input").click();
      cy.get(cesc('#' + inputNames[16]) + "_submit").click();
      cy.get(cesc('#' + inputNames[17]) + "_submit").click();
      cy.get(cesc("#/_answer19_submit")).click();
      cy.get(cesc("#/_answer20_submit")).click();
      cy.get(cesc('#' + inputNames[16]) + "_correct").should('be.visible');
      cy.get(cesc('#' + inputNames[17]) + "_correct").should('be.visible');
      cy.get(cesc("#/_answer19_correct")).should('be.visible');
      cy.get(cesc("#/_answer20_correct")).should('be.visible');


      cy.log('Submit incorrect answers')
      cy.get(cesc('#' + inputNames[0]) + " textarea").type('{end}{backspace}y{enter}', { force: true })
      cy.get(cesc('#' + inputNames[1]) + " textarea").type('{end}{backspace}y{enter}', { force: true })
      cy.get(cesc('#' + inputNames[2]) + " textarea").type('{end}{backspace}y{enter}', { force: true })
      cy.get(cesc('#' + inputNames[3]) + " textarea").type('{end}{backspace}y{enter}', { force: true })
      cy.get(cesc("#/_answer3_submit")).click();
      cy.get(cesc("#/_answer4_submit")).click();
      cy.get(cesc('#' + inputNames[0]) + "_incorrect").should('be.visible');
      cy.get(cesc('#' + inputNames[1]) + "_incorrect").should('be.visible');
      cy.get(cesc("#/_answer3_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer4_incorrect")).should('be.visible');

      cy.get(cesc('#' + inputNames[4]) + "_input").clear().type('bye{enter}')
      cy.get(cesc('#' + inputNames[5]) + "_input").clear().type('bye{enter}')
      cy.get(cesc('#' + inputNames[6]) + "_input").clear().type('bye{enter}')
      cy.get(cesc('#' + inputNames[7]) + "_input").clear().type('bye{enter}')
      cy.get(cesc("#/_answer7_submit")).click();
      cy.get(cesc("#/_answer8_submit")).click();
      cy.get(cesc('#' + inputNames[4]) + "_incorrect").should('be.visible');
      cy.get(cesc('#' + inputNames[5]) + "_incorrect").should('be.visible');
      cy.get(cesc("#/_answer7_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer8_incorrect")).should('be.visible');

      cy.get(cesc('#/_choiceinput1')).contains("no").click({ force: true });
      cy.get(cesc('#/_choiceinput2')).contains("no").click({ force: true });
      cy.get(cesc('#/_choiceinput3')).contains("no").click({ force: true });
      cy.get(cesc('#/_choiceinput4')).contains("no").click({ force: true });
      cy.get(cesc("#/_choiceinput1_submit")).click();
      cy.get(cesc("#/_choiceinput2_submit")).click();
      cy.get(cesc("#/_answer11_submit")).click();
      cy.get(cesc("#/_answer12_submit")).click();
      cy.get(cesc("#/_choiceinput1_incorrect")).should('be.visible');
      cy.get(cesc("#/_choiceinput2_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer11_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer12_incorrect")).should('be.visible');

      cy.get('#\\/_choiceinput5').select(`no`);
      cy.get('#\\/_choiceinput6').select(`no`);
      cy.get('#\\/_choiceinput7').select(`no`);
      cy.get('#\\/_choiceinput8').select(`no`);
      cy.get(cesc("#/_choiceinput5_submit")).click();
      cy.get(cesc("#/_choiceinput6_submit")).click();
      cy.get(cesc("#/_answer15_submit")).click();
      cy.get(cesc("#/_answer16_submit")).click();
      cy.get(cesc("#/_choiceinput5_incorrect")).should('be.visible');
      cy.get(cesc("#/_choiceinput6_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer15_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer16_incorrect")).should('be.visible');

      cy.get(cesc('#' + inputNames[16]) + "_input").click();
      cy.get(cesc('#' + inputNames[17]) + "_input").click();
      cy.get(cesc('#' + inputNames[18]) + "_input").click();
      cy.get(cesc('#' + inputNames[19]) + "_input").click();
      cy.get(cesc('#' + inputNames[16]) + "_submit").click();
      cy.get(cesc('#' + inputNames[17]) + "_submit").click();
      cy.get(cesc("#/_answer19_submit")).click();
      cy.get(cesc("#/_answer20_submit")).click();
      cy.get(cesc('#' + inputNames[16]) + "_incorrect").should('be.visible');
      cy.get(cesc('#' + inputNames[17]) + "_incorrect").should('be.visible');
      cy.get(cesc("#/_answer19_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer20_incorrect")).should('be.visible');


      cy.log('Type to submit correct answers again')

      // the 2nd and 4th input should be disabled,
      // but this isn't working yet.
      // For now, best we can do is make sure button still say incorrect
      cy.get(cesc('#' + inputNames[0]) + " textarea").type('{end}{backspace}x{enter}', { force: true })
      cy.get(cesc('#' + inputNames[1]) + " textarea").type('{end}{backspace}x{enter}', { force: true })
      cy.get(cesc('#' + inputNames[2]) + " textarea").type('{end}{backspace}x{enter}', { force: true })
      cy.get(cesc('#' + inputNames[3]) + " textarea").type('{end}{backspace}x{enter}', { force: true })
      cy.get(cesc("#/_answer3_submit")).click();
      cy.get(cesc('#' + inputNames[0]) + "_correct").should('be.visible');
      cy.get(cesc('#' + inputNames[1]) + "_incorrect").should('be.visible');
      cy.get(cesc("#/_answer3_correct")).should('be.visible');
      cy.get(cesc("#/_answer4_incorrect")).should('be.visible');

      cy.get(cesc('#' + inputNames[4]) + "_input").clear().type('hello{enter}')
      cy.get(cesc('#' + inputNames[5]) + "_input").should('be.disabled');
      cy.get(cesc('#' + inputNames[6]) + "_input").clear().type('hello{enter}')
      cy.get(cesc('#' + inputNames[7]) + "_input").should('be.disabled');
      cy.get(cesc("#/_answer7_submit")).click();
      cy.get(cesc('#' + inputNames[4]) + "_correct").should('be.visible');
      cy.get(cesc('#' + inputNames[5]) + "_incorrect").should('be.visible');
      cy.get(cesc("#/_answer7_correct")).should('be.visible');
      cy.get(cesc("#/_answer8_incorrect")).should('be.visible');

      cy.get(cesc('#/_choiceinput1')).contains("yes").click({ force: true });
      cy.get(cesc('#/_choiceinput2')).contains("yes").click({ force: true });
      cy.get(cesc('#/_choiceinput3')).contains("yes").click({ force: true });
      cy.get(cesc('#/_choiceinput4')).contains("yes").click({ force: true });
      cy.get(cesc("#/_choiceinput1_submit")).click();
      cy.get(cesc("#/_answer11_submit")).click();
      cy.get(cesc("#/_choiceinput1_correct")).should('be.visible');
      cy.get(cesc("#/_choiceinput2_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer11_correct")).should('be.visible');
      cy.get(cesc("#/_answer12_incorrect")).should('be.visible');

      cy.get('#\\/_choiceinput5').select(`yes`);
      cy.get('#\\/_choiceinput6').should('be.disabled')
      cy.get('#\\/_choiceinput7').select(`yes`);
      cy.get('#\\/_choiceinput8').should('be.disabled')
      cy.get(cesc("#/_choiceinput5_submit")).click();
      cy.get(cesc("#/_answer15_submit")).click();
      cy.get(cesc("#/_choiceinput5_correct")).should('be.visible');
      cy.get(cesc("#/_choiceinput6_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer15_correct")).should('be.visible');
      cy.get(cesc("#/_answer16_incorrect")).should('be.visible');

      cy.get(cesc('#' + inputNames[16]) + "_input").click();
      cy.get(cesc('#' + inputNames[17]) + "_input").should('be.disabled')
      cy.get(cesc('#' + inputNames[18]) + "_input").click();
      cy.get(cesc('#' + inputNames[19]) + "_input").should('be.disabled')
      cy.get(cesc('#' + inputNames[16]) + "_submit").click();
      cy.get(cesc("#/_answer19_submit")).click();
      cy.get(cesc('#' + inputNames[16]) + "_correct").should('be.visible');
      cy.get(cesc('#' + inputNames[17]) + "_incorrect").should('be.visible');
      cy.get(cesc("#/_answer19_correct")).should('be.visible');
      cy.get(cesc("#/_answer20_incorrect")).should('be.visible');

    })
  });

  it('disable after correct', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>x</answer></p>
  <p><answer disableAfterCorrect>x</answer></p>
  <p><answer forceFullCheckworkButton>x</answer></p>
  <p><answer forceFullCheckworkButton disableAfterCorrect>x</answer></p>
  
  <p><answer type="text">hello</answer></p>
  <p><answer type="text" disableAfterCorrect>hello</answer></p>
  <p><answer type="text" forceFullCheckworkButton>hello</answer></p>
  <p><answer type="text" forceFullCheckworkButton disableAfterCorrect>hello</answer></p>
    
  <p><answer>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer disableAfterCorrect>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton disableAfterCorrect>
    <choiceinput>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  
  <p><answer>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer disableAfterCorrect>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>
  <p><answer forceFullCheckworkButton disableAfterCorrect>
    <choiceinput inline>
      <choice credit="1">yes</choice>
      <choice>no</choice>
    </choiceinput>
  </answer></p>

  <p><answer type="boolean">true</answer></p>
  <p><answer type="boolean" disableAfterCorrect>true</answer></p>
  <p><answer type="boolean" forceFullCheckworkButton>true</answer></p>
  <p><answer type="boolean" forceFullCheckworkButton disableAfterCorrect>true</answer></p>
   `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let inputNames = [...Array(20).keys()].map(n => components[`/_answer${n + 1}`].stateValues.inputChildren[0].componentName);

      cy.log('Submit incorrect answers')
      cy.get(cesc('#' + inputNames[0]) + " textarea").type('y{enter}', { force: true })
      cy.get(cesc('#' + inputNames[1]) + " textarea").type('y{enter}', { force: true })
      cy.get(cesc('#' + inputNames[2]) + " textarea").type('y{enter}', { force: true })
      cy.get(cesc('#' + inputNames[3]) + " textarea").type('y{enter}', { force: true })
      cy.get(cesc("#/_answer3_submit")).click();
      cy.get(cesc("#/_answer4_submit")).click();
      cy.get(cesc('#' + inputNames[0]) + "_incorrect").should('be.visible');
      cy.get(cesc('#' + inputNames[1]) + "_incorrect").should('be.visible');
      cy.get(cesc("#/_answer3_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer4_incorrect")).should('be.visible');

      cy.get(cesc('#' + inputNames[4]) + "_input").type('bye{enter}')
      cy.get(cesc('#' + inputNames[5]) + "_input").type('bye{enter}')
      cy.get(cesc('#' + inputNames[6]) + "_input").type('bye{enter}')
      cy.get(cesc('#' + inputNames[7]) + "_input").type('bye{enter}')
      cy.get(cesc("#/_answer7_submit")).click();
      cy.get(cesc("#/_answer8_submit")).click();
      cy.get(cesc('#' + inputNames[4]) + "_incorrect").should('be.visible');
      cy.get(cesc('#' + inputNames[5]) + "_incorrect").should('be.visible');
      cy.get(cesc("#/_answer7_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer8_incorrect")).should('be.visible');

      cy.get(cesc('#/_choiceinput1')).contains("no").click({ force: true });
      cy.get(cesc('#/_choiceinput2')).contains("no").click({ force: true });
      cy.get(cesc('#/_choiceinput3')).contains("no").click({ force: true });
      cy.get(cesc('#/_choiceinput4')).contains("no").click({ force: true });
      cy.get(cesc("#/_choiceinput1_submit")).click();
      cy.get(cesc("#/_choiceinput2_submit")).click();
      cy.get(cesc("#/_answer11_submit")).click();
      cy.get(cesc("#/_answer12_submit")).click();
      cy.get(cesc("#/_choiceinput1_incorrect")).should('be.visible');
      cy.get(cesc("#/_choiceinput2_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer11_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer12_incorrect")).should('be.visible');

      cy.get('#\\/_choiceinput5').select(`no`);
      cy.get('#\\/_choiceinput6').select(`no`);
      cy.get('#\\/_choiceinput7').select(`no`);
      cy.get('#\\/_choiceinput8').select(`no`);
      cy.get(cesc("#/_choiceinput5_submit")).click();
      cy.get(cesc("#/_choiceinput6_submit")).click();
      cy.get(cesc("#/_answer15_submit")).click();
      cy.get(cesc("#/_answer16_submit")).click();
      cy.get(cesc("#/_choiceinput5_incorrect")).should('be.visible');
      cy.get(cesc("#/_choiceinput6_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer15_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer16_incorrect")).should('be.visible');

      cy.get(cesc('#' + inputNames[16]) + "_submit").click();
      cy.get(cesc('#' + inputNames[17]) + "_submit").click();
      cy.get(cesc("#/_answer19_submit")).click();
      cy.get(cesc("#/_answer20_submit")).click();
      cy.get(cesc('#' + inputNames[16]) + "_incorrect").should('be.visible');
      cy.get(cesc('#' + inputNames[17]) + "_incorrect").should('be.visible');
      cy.get(cesc("#/_answer19_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer20_incorrect")).should('be.visible');




      cy.log("Submit correct answers")
      cy.get(cesc('#' + inputNames[0]) + " textarea").type('{end}{backspace}x{enter}', { force: true })
      cy.get(cesc('#' + inputNames[1]) + " textarea").type('{end}{backspace}x{enter}', { force: true })
      cy.get(cesc('#' + inputNames[2]) + " textarea").type('{end}{backspace}x{enter}', { force: true })
      cy.get(cesc('#' + inputNames[3]) + " textarea").type('{end}{backspace}x{enter}', { force: true })
      cy.get(cesc("#/_answer3_submit")).click();
      cy.get(cesc("#/_answer4_submit")).click();
      cy.get(cesc('#' + inputNames[0]) + "_correct").should('be.visible');
      cy.get(cesc('#' + inputNames[1]) + "_correct").should('be.visible');
      cy.get(cesc("#/_answer3_correct")).should('be.visible');
      cy.get(cesc("#/_answer4_correct")).should('be.visible');

      cy.get(cesc('#' + inputNames[4]) + "_input").clear().type('hello{enter}')
      cy.get(cesc('#' + inputNames[5]) + "_input").clear().type('hello{enter}')
      cy.get(cesc('#' + inputNames[6]) + "_input").clear().type('hello{enter}')
      cy.get(cesc('#' + inputNames[7]) + "_input").clear().type('hello{enter}')
      cy.get(cesc("#/_answer7_submit")).click();
      cy.get(cesc("#/_answer8_submit")).click();
      cy.get(cesc('#' + inputNames[4]) + "_correct").should('be.visible');
      cy.get(cesc('#' + inputNames[5]) + "_correct").should('be.visible');
      cy.get(cesc("#/_answer7_correct")).should('be.visible');
      cy.get(cesc("#/_answer8_correct")).should('be.visible');

      cy.get(cesc('#/_choiceinput1')).contains("yes").click({ force: true });
      cy.get(cesc('#/_choiceinput2')).contains("yes").click({ force: true });
      cy.get(cesc('#/_choiceinput3')).contains("yes").click({ force: true });
      cy.get(cesc('#/_choiceinput4')).contains("yes").click({ force: true });
      cy.get(cesc("#/_choiceinput1_submit")).click();
      cy.get(cesc("#/_choiceinput2_submit")).click();
      cy.get(cesc("#/_answer11_submit")).click();
      cy.get(cesc("#/_answer12_submit")).click();
      cy.get(cesc("#/_choiceinput1_correct")).should('be.visible');
      cy.get(cesc("#/_choiceinput2_correct")).should('be.visible');
      cy.get(cesc("#/_answer11_correct")).should('be.visible');
      cy.get(cesc("#/_answer12_correct")).should('be.visible');

      cy.get('#\\/_choiceinput5').select(`yes`);
      cy.get('#\\/_choiceinput6').select(`yes`);
      cy.get('#\\/_choiceinput7').select(`yes`);
      cy.get('#\\/_choiceinput8').select(`yes`);
      cy.get(cesc("#/_choiceinput5_submit")).click();
      cy.get(cesc("#/_choiceinput6_submit")).click();
      cy.get(cesc("#/_answer15_submit")).click();
      cy.get(cesc("#/_answer16_submit")).click();
      cy.get(cesc("#/_choiceinput5_correct")).should('be.visible');
      cy.get(cesc("#/_choiceinput6_correct")).should('be.visible');
      cy.get(cesc("#/_answer15_correct")).should('be.visible');
      cy.get(cesc("#/_answer16_correct")).should('be.visible');

      cy.get(cesc('#' + inputNames[16]) + "_input").click();
      cy.get(cesc('#' + inputNames[17]) + "_input").click();
      cy.get(cesc('#' + inputNames[18]) + "_input").click();
      cy.get(cesc('#' + inputNames[19]) + "_input").click();
      cy.get(cesc('#' + inputNames[16]) + "_submit").click();
      cy.get(cesc('#' + inputNames[17]) + "_submit").click();
      cy.get(cesc("#/_answer19_submit")).click();
      cy.get(cesc("#/_answer20_submit")).click();
      cy.get(cesc('#' + inputNames[16]) + "_correct").should('be.visible');
      cy.get(cesc('#' + inputNames[17]) + "_correct").should('be.visible');
      cy.get(cesc("#/_answer19_correct")).should('be.visible');
      cy.get(cesc("#/_answer20_correct")).should('be.visible');



      cy.log('Type to submit incorrect answers again')

      // the 2nd and 4th input should be disabled,
      // but this isn't working yet.
      // For now, best we can do is make sure button still say incorrect
      cy.get(cesc('#' + inputNames[0]) + " textarea").type('{end}{backspace}y{enter}', { force: true })
      cy.get(cesc('#' + inputNames[1]) + " textarea").type('{end}{backspace}y{enter}', { force: true })
      cy.get(cesc('#' + inputNames[2]) + " textarea").type('{end}{backspace}y{enter}', { force: true })
      cy.get(cesc('#' + inputNames[3]) + " textarea").type('{end}{backspace}y{enter}', { force: true })
      cy.get(cesc("#/_answer3_submit")).click();
      cy.get(cesc('#' + inputNames[0]) + "_incorrect").should('be.visible');
      cy.get(cesc('#' + inputNames[1]) + "_correct").should('be.visible');
      cy.get(cesc("#/_answer3_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer4_correct")).should('be.visible');

      cy.get(cesc('#' + inputNames[4]) + "_input").clear().type('bye{enter}')
      cy.get(cesc('#' + inputNames[5]) + "_input").should('be.disabled');
      cy.get(cesc('#' + inputNames[6]) + "_input").clear().type('bye{enter}')
      cy.get(cesc('#' + inputNames[7]) + "_input").should('be.disabled');
      cy.get(cesc("#/_answer7_submit")).click();
      cy.get(cesc('#' + inputNames[4]) + "_incorrect").should('be.visible');
      cy.get(cesc('#' + inputNames[5]) + "_correct").should('be.visible');
      cy.get(cesc("#/_answer7_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer8_correct")).should('be.visible');

      cy.get(cesc('#/_choiceinput1')).contains("no").click({ force: true });
      cy.get(cesc('#/_choiceinput2')).contains("no").click({ force: true });
      cy.get(cesc('#/_choiceinput3')).contains("no").click({ force: true });
      cy.get(cesc('#/_choiceinput4')).contains("no").click({ force: true });
      cy.get(cesc("#/_choiceinput1_submit")).click();
      cy.get(cesc("#/_answer11_submit")).click();
      cy.get(cesc("#/_choiceinput1_incorrect")).should('be.visible');
      cy.get(cesc("#/_choiceinput2_correct")).should('be.visible');
      cy.get(cesc("#/_answer11_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer12_correct")).should('be.visible');

      cy.get('#\\/_choiceinput5').select(`no`);
      cy.get('#\\/_choiceinput6').should('be.disabled')
      cy.get('#\\/_choiceinput7').select(`no`);
      cy.get('#\\/_choiceinput8').should('be.disabled')
      cy.get(cesc("#/_choiceinput5_submit")).click();
      cy.get(cesc("#/_answer15_submit")).click();
      cy.get(cesc("#/_choiceinput5_incorrect")).should('be.visible');
      cy.get(cesc("#/_choiceinput6_correct")).should('be.visible');
      cy.get(cesc("#/_answer15_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer16_correct")).should('be.visible');

      cy.get(cesc('#' + inputNames[16]) + "_input").click();
      cy.get(cesc('#' + inputNames[17]) + "_input").should('be.disabled')
      cy.get(cesc('#' + inputNames[18]) + "_input").click();
      cy.get(cesc('#' + inputNames[19]) + "_input").should('be.disabled')
      cy.get(cesc('#' + inputNames[16]) + "_submit").click();
      cy.get(cesc("#/_answer19_submit")).click();
      cy.get(cesc('#' + inputNames[16]) + "_incorrect").should('be.visible');
      cy.get(cesc('#' + inputNames[17]) + "_correct").should('be.visible');
      cy.get(cesc("#/_answer19_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer20_correct")).should('be.visible');

    })
  });

  it('disable after correct, depends on external', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
    <point name="A" x="0" y="0">
      <constraints>
        <attractTo><point>(3,4)</point></attractTo>
        <attractTo><point>(-5,6)</point></attractTo>
      </constraints>
    </point>
  </graph>

  <p>Move point to <m>(3,4)</m>: </p>
  <p><answer>
    <award targetsAreResponses="A">
      <when>$A = (3,4)</when>
    </award>
  </answer></p>
  <p><answer disableAfterCorrect>
    <award targetsAreResponses="A">
      <when>$A = (3,4)</when>
    </award>
  </answer></p>

  <p>Move point to <m>(-5,6)</m>: </p>
  <p><answer>
    <award targetsAreResponses="A">
      <when>$A = (-5,6)</when>
    </award>
  </answer></p>
  <p><answer disableAfterCorrect>
    <award targetsAreResponses="A">
      <when>$A = (-5,6)</when>
    </award>
  </answer></p>

  <p><mathinput name="mi" /></p>

  <p>Enter <m>x</m> in above blank.</p>
  <p><answer>
    <award targetsAreResponses="mi"><when>$mi=x</when></award>
  </answer></p>
  <p><answer disableAfterCorrect>
    <award targetsAreResponses="mi"><when>$mi=x</when></award>
  </answer></p>

  <p>Enter <m>y</m> in above blank.</p>
  <p><answer>
    <award targetsAreResponses="mi"><when>$mi=y</when></award>
  </answer></p>
  <p><answer disableAfterCorrect>
    <award targetsAreResponses="mi"><when>$mi=y</when></award>
  </answer></p>

   `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Submit incorrect answers')
    for (let i = 1; i <= 8; i++) {
      cy.get(`#\\/_answer${i}_submit`).click();
      cy.get(`#\\/_answer${i}_incorrect`).should('be.visible')
    }

    cy.log('submit first correct answers')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      components["/A"].movePoint({ x: 3, y: 4 })
    })
    cy.get('#\\/mi textarea').type("x{enter}", { force: true });

    for (let i = 1; i <= 8; i++) {
      cy.get(`#\\/_answer${i}_submit`).click();
      if (i % 4 === 1 || i % 4 == 2) {
        cy.get(`#\\/_answer${i}_correct`).should('be.visible')
      } else {
        cy.get(`#\\/_answer${i}_incorrect`).should('be.visible')
      }
    }

    cy.log('submit second correct answers')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      components["/A"].movePoint({ x: -5, y: 6 })
    })
    cy.get('#\\/mi textarea').type("{end}{backspace}y{enter}", { force: true });

    for (let i = 1; i <= 8; i++) {
      if (i % 4 !== 2) {
        cy.get(`#\\/_answer${i}_submit`).click();
      }
      if (i % 4 === 1) {
        cy.get(`#\\/_answer${i}_incorrect`).should('be.visible')
      } else {
        cy.get(`#\\/_answer${i}_correct`).should('be.visible')
      }
    }


    cy.log('submit second incorrect answers')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      components["/A"].movePoint({ x: 1, y: -1 })
    })
    cy.get('#\\/mi textarea').type("{end}{backspace}z{enter}", { force: true });

    for (let i = 1; i <= 8; i++) {
      if (i % 4 === 2 || i % 4 === 0) {
        cy.get(`#\\/_answer${i}_correct`).should('be.visible')
      } else {
        cy.get(`#\\/_answer${i}_submit`).click();
        cy.get(`#\\/_answer${i}_incorrect`).should('be.visible')
      }
    }


  });

  it('award based on choice text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <answer>
    <choiceinput inline>
      <choice name="ca">cat</choice>
      <choice credit="1">dog</choice>
      <choice>monkey</choice>
    </choiceinput>
    <award><when>$_choiceinput1 = <copy prop="text" target="ca" /></when></award>
  </answer>
   `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_choiceinput1').select(`cat`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');

    cy.get('#\\/_choiceinput1').select(`dog`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');

    cy.get('#\\/_choiceinput1').select(`monkey`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');

  });

  it('error expressions are not matched', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <answer>x^</answer>
  <answer symbolicEquality>x^</answer>
   `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinput1Name = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let mathinput1SubmitAnchor = cesc('#' + mathinput1Name + '_submit');
      let mathinput1CorrectAnchor = cesc('#' + mathinput1Name + '_correct');
      let mathinput1IncorrectAnchor = cesc('#' + mathinput1Name + '_incorrect');

      let mathinput2Name = components['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc('#' + mathinput2Name + '_correct');
      let mathinput2IncorrectAnchor = cesc('#' + mathinput2Name + '_incorrect');

      cy.get(mathinput1SubmitAnchor).click();
      cy.get(mathinput1IncorrectAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.get(mathinput1Anchor).type("x^{enter}", { force: true })
      cy.get(mathinput1IncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type("x^{enter}", { force: true })
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.get(mathinput1Anchor).type("{end}{leftArrow}2{enter}", { force: true })
      cy.get(mathinput1IncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type("{end}{leftArrow}2{enter}", { force: true })
      cy.get(mathinput2IncorrectAnchor).should('be.visible');


    })

  });

  it('with split symbols', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>split symbols: <booleaninput name="split" /></p>
  <p>Answer: <math name="ans" splitSymbols="$split">xyz</math></p>
  <answer>
    <mathinput name="mi" splitSymbols="$(ans{prop='splitSymbols'})" />
    <award>$ans</award>
  </answer>
   `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/mi textarea').type("xyz{enter}", { force: true })
    cy.get('#\\/mi_correct').should('be.visible')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/ans"].stateValues.value.tree).eqls("xyz");
      expect(components["/mi"].stateValues.value.tree).eqls("xyz");
    })

    cy.get('#\\/split_input').click();

    // modify textinput so that recalculates value
    cy.get('#\\/mi textarea').type("{end} {backspace}{enter}", { force: true })

    cy.get('#\\/mi_correct').should('be.visible')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/ans"].stateValues.value.tree).eqls(["*", "x", "y", "z"]);
      expect(components["/mi"].stateValues.value.tree).eqls(["*", "x", "y", "z"]);
    })


    cy.get('#\\/split_input').click();

    // modify textinput so that recalculates value
    cy.get('#\\/mi textarea').type("{end} {enter}", { force: true })

    cy.get('#\\/mi_correct').should('be.visible')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/ans"].stateValues.value.tree).eqls("xyz");
      expect(components["/mi"].stateValues.value.tree).eqls("xyz");
    })

  });

  it('justSubmitted with expression containing NaN', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <answer><mathinput name="mi" /><award><math><number>0/0</number>+1</math></award></answer>
   `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/mi textarea').type("x{enter}", { force: true })
    cy.get('#\\/mi_incorrect').should('be.visible')

  });

  it('copy justSubmitted attribute', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <answer name="ans">
    <mathinput name="mi" />
    <award>1</award>
  </answer>
  <conditionalContent condition="$(ans{prop='justSubmitted'})" assignNames="just">
    <p>The answer was just submitted.</p>
  </conditionalContent>
   `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/mi_submit').should('be.visible')
    cy.get('#\\/mi_correct').should('not.exist')
    cy.get('#\\/mi_incorrect').should('not.exist')
    cy.get('#\\/just').should('not.exist')

    cy.get('#\\/mi textarea').type("x", { force: true })
    cy.get('#\\/mi_submit').should('be.visible')
    cy.get('#\\/mi_correct').should('not.exist')
    cy.get('#\\/mi_incorrect').should('not.exist')
    cy.get('#\\/just').should('not.exist')

    cy.get('#\\/mi_submit').click();
    cy.get('#\\/mi_submit').should('not.exist')
    cy.get('#\\/mi_correct').should('not.exist')
    cy.get('#\\/mi_incorrect').should('be.visible')
    cy.get('#\\/just').should('have.text', 'The answer was just submitted.')

    cy.get('#\\/mi textarea').type("{end}{backspace}1", { force: true })
    cy.get('#\\/mi_submit').should('be.visible')
    cy.get('#\\/mi_correct').should('not.exist')
    cy.get('#\\/mi_incorrect').should('not.exist')
    cy.get('#\\/just').should('not.exist')

    cy.get('#\\/mi textarea').type("{enter}", { force: true })
    cy.get('#\\/mi_submit').should('not.exist')
    cy.get('#\\/mi_correct').should('be.visible')
    cy.get('#\\/mi_incorrect').should('not.exist')
    cy.get('#\\/just').should('have.text', 'The answer was just submitted.')

    cy.get('#\\/mi textarea').type("{end}{backspace}1", { force: true })
    cy.get('#\\/mi_submit').should('be.visible')
    cy.get('#\\/mi_correct').should('not.exist')
    cy.get('#\\/mi_incorrect').should('not.exist')
    cy.get('#\\/just').should('not.exist')

  });

  it('empty mathlists always equal', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <answer name="ans1">
    <award>
      <when>
        <mathlist/> = <mathlist/>
      </when>
    </award>
  </answer>
  <answer name="ans2">
    <award>
      <when unorderedCompare>
        <mathlist/> = <mathlist/>
      </when>
    </award>
  </answer>
  <answer name="ans3">
    <award>
      <when matchPartial>
        <mathlist/> = <mathlist/>
      </when>
    </award>
  </answer>
  <answer name="ans4">
    <award>
      <when unorderedCompare matchPartial>
        <mathlist/> = <mathlist/>
      </when>
    </award>
  </answer>
   `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/ans1_submit').click()
    cy.get('#\\/ans1_correct').should('be.visible')

    cy.get('#\\/ans2_submit').click()
    cy.get('#\\/ans2_correct').should('be.visible')

    cy.get('#\\/ans3_submit').click()
    cy.get('#\\/ans3_correct').should('be.visible')

    cy.get('#\\/ans4_submit').click()
    cy.get('#\\/ans4_correct').should('be.visible')

  });

})
