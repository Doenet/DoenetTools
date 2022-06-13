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
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('answer sugar from one string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>x+y</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='math' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });

      cy.log("Type correct answer in")

      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')

      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });

      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });


    })
  });

  it('answer sugar from one macro', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="xy" hide>x+y</math>
  <p><answer>$xy</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='math' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });

      cy.log("Type correct answer in")

      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      // wrap to change value of '#\\/sr1'
      cy.window().then(async (win) => {

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x+y');
        cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')
        cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });

        cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get('#\\/ca1').should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
          expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
          expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
          expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
          // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
        });


        cy.log("Enter wrong answer")
        cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, { force: true }).blur();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
        cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x+y')
        });
        cy.get('#\\/ca1').should('have.text', '1')

        cy.log('Test internal values')
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
          expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
          expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
          expect(stateVariables[mathinputName].stateValues.value).eqls('x');
          // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
        });

        cy.log("Submit answer")
        cy.get(mathinputSubmitAnchor).click();

        cy.log('Test value displayed in browser')
        // cy.get(mathinputAnchor).should('have.value', 'x');
        cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
        cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('x')
        });
        cy.get('#\\/ca1').should('have.text', '0')


        cy.log('Test internal values')
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
          expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
          expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
          expect(stateVariables[mathinputName].stateValues.value).eqls('x');
          // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
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
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='math' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });

      cy.log("Type correct answer in")

      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });

      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });


    })
  });

  it('answer sugar from one string, set to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text">hello there</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='text' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').should('have.text', '')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq('');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);


      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', 'hello  there')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    })
  });

  it('answer sugar from one macro, set to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <text name='h'>hello there</text>
  <p><answer type="text">$h</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='text' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').should('have.text', '')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq('');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', 'hello  there')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    })
  });

  it('answer sugar from macro and string, set to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup><text name="h">hello</text></setup>
  <p><answer type="text">$h there</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='text' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').should('have.text', '')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq('');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', 'hello  there')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    })
  });

  it('answer sugar from macros and string, ignores blank string, set to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup><text name="h">hello</text><text name="t">there</text></setup>
  <p><answer type="text">$h $t</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='text' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').should('have.text', '')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq('');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hellothere `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hellothere ');
      cy.get('#\\/cr1').should('have.text', ' hellothere ')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hellothere ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq(' hellothere ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hellothere ');
      cy.get('#\\/cr1').should('have.text', ' hellothere ')
      cy.get('#\\/sr1').should('have.text', ' hellothere ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hellothere ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hellothere ']);
        expect(stateVariables[textinputName].stateValues.value).eq(' hellothere ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hellothere ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello there');
      cy.get('#\\/cr1').should('have.text', 'hello there')
      cy.get('#\\/sr1').should('have.text', ' hellothere ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hellothere ']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hellothere ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello there');
      cy.get('#\\/cr1').should('have.text', 'hello there')
      cy.get('#\\/sr1').should('have.text', 'hello there')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello there']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('hello there');
      });
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
  <p>Submitted responses: <copy prop="submittedResponses" target="_answer1" createComponentOfType="text" assignNames="sr1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.get('#\\/_p2').should('have.text', 'Submitted responses: ')

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there {enter}`)

      cy.get('#\\/_p2').should('have.text', 'Submitted responses:  hello there ')

      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/sr1').should('have.text', ' hello there ')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/sr1').should('have.text', ' hello there ')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);

        // Note: since intentially now putting currentResponses in the DOM,
        // don't have a way to know how long to wait for these values to change
        // so can't test these values
        // expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        // expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/sr1').should('have.text', 'hello  there')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    })
  });


  it('answer sugar from one string, set to boolean', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="boolean">true</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let booleaninputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let booleaninputAnchor = cesc('#' + booleaninputName + '_input');
      let booleaninputSubmitAnchor = cesc('#' + booleaninputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Select correct answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([true]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Press enter on submit button to submit")
      cy.get(booleaninputSubmitAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'true')
      cy.get('#\\/sr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([true]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([true]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Select wrong answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/sr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([true]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Submit answer")
      cy.get(booleaninputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/sr1').should('have.text', 'false')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([false]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });
    })
  });

  it('answer sugar from macro and string, set to boolean', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <boolean hide name="b">false</boolean>
  <p><answer type="boolean">not $b</answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let booleaninputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let booleaninputAnchor = cesc('#' + booleaninputName + '_input');
      let booleaninputSubmitAnchor = cesc('#' + booleaninputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Select correct answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([true]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Press enter on submit button to submit")
      cy.get(booleaninputSubmitAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'true')
      cy.get('#\\/sr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([true]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([true]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Select wrong answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/sr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([true]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Submit answer")
      cy.get(booleaninputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/sr1').should('have.text', 'false')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([false]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });
    })
  });

  it('answer award with math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award><math>x+y</math></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType="math" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });
    })
  });

  it('answer award with sugared string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award>x+y</award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType="math" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });
    })
  });

  it('answer award with sugared macro', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="xy" hide>x+y</math>
  <p><answer><award>$xy</award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType="math" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });
    })
  });

  it('answer award with sugared macros and string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup><math name="x">x</math><math name="y">y</math></setup>
  <p><answer><award>$x+$y</award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType="math" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });
    })
  });

  it('answer award with math, initally unresolved', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award><math>x+y-3+<copy target="n" /></math></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType="math" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>

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
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });
    })
  });

  it('answer award with mathList', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer matchPartial><award><mathList>x+y z</mathList></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType="math" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y, z`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y,z')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y,z')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([["list", ['+', 'x', 'y'], "z"]]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(["list", ['+', 'x', 'y'], "z"]);
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y,z')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y,z')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y,z')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([["list", ['+', 'x', 'y'], "z"]]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([["list", ['+', 'x', 'y'], "z"]]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(["list", ['+', 'x', 'y'], "z"]);
      });


      cy.log("Enter partially correct answer")
      cy.get(mathinputAnchor).type(`{end}{leftArrow}{leftArrow}{leftArrow}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x,z')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x,z')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y,z')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([["list", 'x', "z"]]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([["list", ['+', 'x', 'y'], "z"]]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(["list", 'x', "z"]);
      });

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x,z')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x,z')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x,z')
      });
      cy.get('#\\/ca1').should('have.text', '0.5')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([["list", 'x', "z"]]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([["list", 'x', "z"]]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(["list", 'x', "z"]);
      });

      cy.log('Submit incorrect answer');
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}{backspace}`, { force: true, delay: 100 });
      // Note: have to wait for core to respond to at least first keystroke
      // or the renderer will not be set to allow a submission
      // (delayed typing to make sure can test case where submit before core has responded to all, 
      // in case where have core set for a delayed response)
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });


      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
      });



      cy.log('Submit other partially correct answer')
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}z`, { force: true, delay: 100 });
      // Note: have to wait for core to respond to at least first keystroke
      // or the renderer will not be set to allow a submission
      // (delayed typing to make sure can test case where submit before core has responded to all, 
      // in case where have core set for a delayed response)
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'z')
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'z')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('z')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('z')
      });
      cy.get('#\\/ca1').should('have.text', '0.5')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['z']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['z']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('z');
      });

    })
  });

  it('answer from mathList', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><mathinput name="mi1" /> <mathinput name="mi2" />
    <answer matchPartial><award><when>
      <mathList isResponse>$mi1 $mi2</mathList> = <mathList>x+y z</mathList>
    </when></award></answer></p>
  <p>Current response: <copy prop="currentResponses" target="_answer1" assignNames="cr1 cr2" /></p>
  <p>Submitted response: <copy prop="submittedResponses" target="_answer1" createComponentOfType="math" nComponents="2" assignNames="sr1 sr2" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    let mathinput1Name = "/mi1";
    let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
    let mathinput2Name = "/mi2";
    let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
    let submitAnchor = cesc('#/_answer1_submit');

    cy.log('Test value displayed in browser')
    // cy.get(mathinputAnchor).should('have.value', '');
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
    cy.get('#\\/ca1').should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F','\uFF3F']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables[mathinput1Name].stateValues.value).eq('\uFF3F');
      expect(stateVariables[mathinput2Name].stateValues.value).eq('\uFF3F');
    });

    cy.log("Type correct answer in")
    cy.get(mathinput1Anchor).type(`x+y`, { force: true }).blur();
    cy.get(mathinput2Anchor).type(`z`, { force: true }).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
    cy.get('#\\/cr2 .mjx-mrow').should('have.text', 'z')
    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/ca1').should('have.text', '0')


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y'], "z"]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables[mathinput1Name].stateValues.value).eqls(['+', 'x', 'y']);
      expect(stateVariables[mathinput2Name].stateValues.value).eqls("z");
    });


    cy.log("Press enter to submit")
    cy.get(submitAnchor).type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')
    cy.get('#\\/sr2 .mjx-mrow').should('have.text', 'z')
    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/ca1').should('have.text', '1')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y'], "z"]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y'], "z"]);
      expect(stateVariables[mathinput1Name].stateValues.value).eqls(['+', 'x', 'y']);
      expect(stateVariables[mathinput2Name].stateValues.value).eqls("z");
    });


    cy.log("Enter partially correct answer")
    cy.get(mathinput1Anchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
    cy.get('#\\/cr2 .mjx-mrow').should('have.text', 'z')
    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/ca1').should('have.text', '1')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x', "z"]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y'], "z"]);
      expect(stateVariables[mathinput1Name].stateValues.value).eqls('x');
      expect(stateVariables[mathinput2Name].stateValues.value).eqls("z");
    });

    cy.log("Submit answer")
    cy.get(submitAnchor).click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
    cy.get('#\\/sr2 .mjx-mrow').should('have.text', 'z')
    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/ca1').should('have.text', '0.5')


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x', "z"]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x', "z"]);
      expect(stateVariables[mathinput1Name].stateValues.value).eqls('x');
      expect(stateVariables[mathinput2Name].stateValues.value).eqls("z");
    });

    cy.log('Submit incorrect answer');
    cy.get(mathinput2Anchor).type(`{end}{backspace}{backspace}{backspace}`, { force: true, delay: 100 });
    // Note: have to wait for core to respond to at least first keystroke
    // or the renderer will not be set to allow a submission
    // (delayed typing to make sure can test case where submit before core has responded to all, 
    // in case where have core set for a delayed response)
    cy.get(submitAnchor).type(`{enter}`);


    cy.log('Test value displayed in browser')
    cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
    cy.get('#\\/cr2 .mjx-mrow').should('contain.text', '\uff3f')
    cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
    cy.get('#\\/sr2 .mjx-mrow').should('contain.text', '\uff3f')
    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uff3f')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uff3f')
    });
    cy.get('#\\/ca1').should('have.text', '0')


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x', '\uff3f']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x', '\uff3f']);
      expect(stateVariables[mathinput1Name].stateValues.value).eqls('x');
      expect(stateVariables[mathinput2Name].stateValues.value).eqls('\uff3f');
    });



    cy.log('Submit other partially correct answer')
    cy.get(mathinput1Anchor).type(`{end}{backspace}{backspace}z`, { force: true, delay: 100 });
    // Note: have to wait for core to respond to at least first keystroke
    // or the renderer will not be set to allow a submission
    // (delayed typing to make sure can test case where submit before core has responded to all, 
    // in case where have core set for a delayed response)
    cy.get(submitAnchor).type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'z')
    cy.get('#\\/cr2 .mjx-mrow').should('contain.text', '\uff3f')
    cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'z')
    cy.get('#\\/sr2 .mjx-mrow').should('contain.text', '\uff3f')
    cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/cr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uff3f')
    });
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uff3f')
    });
    cy.get('#\\/ca1').should('have.text', '0.5')


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['z', '\uff3f']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['z', '\uff3f']);
      expect(stateVariables[mathinput1Name].stateValues.value).eqls('z');
      expect(stateVariables[mathinput2Name].stateValues.value).eqls('\uff3f');
    });


  });


  it('answer set to text, award with text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text"><award><text>  hello there </text></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='text' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').should('have.text', '')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq('');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', 'hello  there')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    })
  });

  it('answer set to text, award with sugared string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text"><award>  hello there </award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='text' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').should('have.text', '')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq('');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', 'hello  there')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    })
  });

  it('answer set to text, award with sugared macro and string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup><text name="h">hello</text></setup>
  <p><answer type="text"><award>$h there</award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='text' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').should('have.text', '')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq('');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', 'hello  there')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    })
  });

  it('answer set to text, award with text, initally unresolved', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text"><award><text><copy target="n" /></text></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType="text" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>

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
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').should('have.text', '')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq('');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter wrong answer")
      cy.get(textinputAnchor).clear().type(`hello  there`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello  there');
      cy.get('#\\/cr1').should('have.text', 'hello  there')
      cy.get('#\\/sr1').should('have.text', 'hello  there')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello  there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello  there']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello  there');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('hello  there');
      });
    })
  });

  it('answer set to text, award with textlist', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text"><award matchPartial><textlist>  hello there </textlist></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='text' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').should('have.text', '')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq('');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello  , there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello  , there ');
      cy.get('#\\/cr1').should('have.text', ' hello  , there ')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello  , there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello  , there ');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello  , there ');
      cy.get('#\\/cr1').should('have.text', ' hello  , there ')
      cy.get('#\\/sr1').should('have.text', ' hello  , there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello  , there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello  , there ']);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello  , there ');
      });


      cy.log("Enter partially correct answer")
      cy.get(textinputAnchor).clear().type(`hello,then`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello,then');
      cy.get('#\\/cr1').should('have.text', 'hello,then')
      cy.get('#\\/sr1').should('have.text', ' hello  , there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello,then']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello  , there ']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello,then');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello,then');
      cy.get('#\\/cr1').should('have.text', 'hello,then')
      cy.get('#\\/sr1').should('have.text', 'hello,then')
      cy.get('#\\/ca1').should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello,then']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello,then']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello,then');
      });


      cy.log("Submit incorrect answer")
      cy.get(textinputAnchor).clear().type(`hello there`, { delay: 100 });
      // Note: have to wait for core to respond to at least first keystroke
      // or the renderer will not be set to allow a submission
      // (delayed typing to make sure can test case where submit before core has responded to all, 
      // in case where have core set for a delayed response)
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'hello there');
      cy.get('#\\/cr1').should('have.text', 'hello there')
      cy.get('#\\/sr1').should('have.text', 'hello there')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello there']);
        expect(stateVariables[textinputName].stateValues.value).eq('hello there');
      });


      cy.log("Submit other partially correct answer")
      cy.get(textinputAnchor).clear().type(`there`, { delay: 100 });
      // Note: have to wait for core to respond to at least first keystroke
      // or the renderer will not be set to allow a submission
      // (delayed typing to make sure can test case where submit before core has responded to all, 
      // in case where have core set for a delayed response)
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'there');
      cy.get('#\\/cr1').should('have.text', 'there')
      cy.get('#\\/sr1').should('have.text', 'there')
      cy.get('#\\/ca1').should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['there']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['there']);
        expect(stateVariables[textinputName].stateValues.value).eq('there');
      });
    })
  });

  it('answer from textlist', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><textinput name="ti1" /> <textinput name="ti2" />
    <answer><award matchPartial><when>
      <textlist isResponse>$ti1$ti2</textlist>=<textlist>  hello there </textlist>
    </when></award></answer></p>
  <p>Current responses: <copy prop="currentResponses" target="_answer1" assignNames="cr1 cr2" /></p>
  <p>Submitted responses: <copy prop="submittedResponses" target="_answer1" assignNames="sr1 sr2" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    let textinput1Name = "/ti1";
    let textinput1Anchor = cesc('#' + textinput1Name + '_input');
    let textinput2Name = "/ti2";
    let textinput2Anchor = cesc('#' + textinput2Name + '_input');
    let submitAnchor = cesc('#/_answer1_submit');

    cy.log('Test value displayed in browser')
    cy.get(textinput1Anchor).should('have.value', '');
    cy.get(textinput2Anchor).should('have.value', '');
    cy.get('#\\/cr1').should('have.text', '')
    cy.get('#\\/cr2').should('have.text', '')
    cy.get('#\\/sr1').should('not.exist');
    cy.get('#\\/sr2').should('not.exist');
    cy.get('#\\/ca1').should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['', '']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables[textinput1Name].stateValues.value).eq('');
      expect(stateVariables[textinput2Name].stateValues.value).eq('');
    });

    cy.log("Type correct answers in")
    cy.get(textinput1Anchor).type(` hello  `).blur();
    cy.get(textinput2Anchor).type(` there `).blur();

    cy.log('Test value displayed in browser')
    cy.get(textinput1Anchor).should('have.value', ' hello  ');
    cy.get(textinput2Anchor).should('have.value', ' there ');
    cy.get('#\\/cr1').should('have.text', ' hello  ')
    cy.get('#\\/cr2').should('have.text', ' there ')
    cy.get('#\\/sr1').should('not.exist');
    cy.get('#\\/sr2').should('not.exist');
    cy.get('#\\/ca1').should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello  ', ' there ']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables[textinput1Name].stateValues.value).eq(' hello  ');
      expect(stateVariables[textinput2Name].stateValues.value).eq(' there ');
    });


    cy.log("Press enter to submit")
    cy.get(submitAnchor).type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get(textinput1Anchor).should('have.value', ' hello  ');
    cy.get(textinput2Anchor).should('have.value', ' there ');
    cy.get('#\\/cr1').should('have.text', ' hello  ')
    cy.get('#\\/cr2').should('have.text', ' there ')
    cy.get('#\\/sr1').should('have.text', ' hello  ')
    cy.get('#\\/sr2').should('have.text', ' there ')
    cy.get('#\\/ca1').should('have.text', '1')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello  ', ' there ']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello  ', ' there ']);
      expect(stateVariables[textinput1Name].stateValues.value).eq(' hello  ');
      expect(stateVariables[textinput2Name].stateValues.value).eq(' there ');
    });


    cy.log("Enter partially correct answer")
    cy.get(textinput1Anchor).clear().type(`hello`).blur();
    cy.get(textinput2Anchor).clear().type(`then`).blur();

    cy.log('Test value displayed in browser')
    cy.get(textinput1Anchor).should('have.value', 'hello');
    cy.get(textinput2Anchor).should('have.value', 'then');
    cy.get('#\\/cr1').should('have.text', 'hello')
    cy.get('#\\/cr2').should('have.text', 'then')
    cy.get('#\\/sr1').should('have.text', ' hello  ')
    cy.get('#\\/sr2').should('have.text', ' there ')
    cy.get('#\\/ca1').should('have.text', '1')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello', 'then']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello  ', ' there ']);
      expect(stateVariables[textinput1Name].stateValues.value).eq('hello');
      expect(stateVariables[textinput2Name].stateValues.value).eq('then');
    });

    cy.log("Submit answer")
    cy.get(submitAnchor).click();

    cy.log('Test value displayed in browser')
    cy.get(textinput1Anchor).should('have.value', 'hello');
    cy.get(textinput2Anchor).should('have.value', 'then');
    cy.get('#\\/cr1').should('have.text', 'hello')
    cy.get('#\\/cr2').should('have.text', 'then')
    cy.get('#\\/sr1').should('have.text', 'hello')
    cy.get('#\\/sr2').should('have.text', 'then')
    cy.get('#\\/ca1').should('have.text', '0.5')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello', 'then']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello', 'then']);
      expect(stateVariables[textinput1Name].stateValues.value).eq('hello');
      expect(stateVariables[textinput2Name].stateValues.value).eq('then');
    });


    cy.log("Submit incorrect answer")
    cy.get(textinput2Anchor).clear();
    cy.get(textinput1Anchor).clear().type(`hello, there`, { delay: 100 });
    // Note: have to wait for core to respond to at least first keystroke
    // or the renderer will not be set to allow a submission
    // (delayed typing to make sure can test case where submit before core has responded to all, 
    // in case where have core set for a delayed response)
    cy.get(submitAnchor).type(`{enter}`);

    cy.log('Test value displayed in browser')
    cy.get(textinput1Anchor).should('have.value', 'hello, there');
    cy.get(textinput2Anchor).should('have.value', '');
    cy.get('#\\/cr1').should('have.text', 'hello, there')
    cy.get('#\\/cr2').should('have.text', '')
    cy.get('#\\/sr1').should('have.text', 'hello, there')
    cy.get('#\\/sr2').should('have.text', '')
    cy.get('#\\/ca1').should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['hello, there', '']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['hello, there', '']);
      expect(stateVariables[textinput1Name].stateValues.value).eq('hello, there');
      expect(stateVariables[textinput2Name].stateValues.value).eq('');
    });


    cy.log("Submit other partially correct answer")
    cy.get(textinput1Anchor).clear().type(`there`, { delay: 100 });
    // Note: have to wait for core to respond to at least first keystroke
    // or the renderer will not be set to allow a submission
    // (delayed typing to make sure can test case where submit before core has responded to all, 
    // in case where have core set for a delayed response)
    cy.get(submitAnchor).click();

    cy.log('Test value displayed in browser')
    cy.get(textinput1Anchor).should('have.value', 'there');
    cy.get(textinput2Anchor).should('have.value', '');
    cy.get('#\\/cr1').should('have.text', 'there')
    cy.get('#\\/cr2').should('have.text', '')
    cy.get('#\\/sr1').should('have.text', 'there')
    cy.get('#\\/sr2').should('have.text', '')
    cy.get('#\\/ca1').should('have.text', '0.5')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['there', '']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['there', '']);
      expect(stateVariables[textinput1Name].stateValues.value).eq('there');
      expect(stateVariables[textinput2Name].stateValues.value).eq('');
    });
  });

  it('answer set to boolean, award with boolean', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="boolean"><award><boolean>true</boolean></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let booleaninputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let booleaninputAnchor = cesc('#' + booleaninputName + '_input');
      let booleaninputSubmitAnchor = cesc('#' + booleaninputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Select correct answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([true]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Press enter on submit button to submit")
      cy.get(booleaninputSubmitAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'true')
      cy.get('#\\/sr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([true]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([true]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Select wrong answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/sr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([true]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Submit answer")
      cy.get(booleaninputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/sr1').should('have.text', 'false')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([false]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });
    })
  });

  it('answer set to boolean, award with sugared macro and string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <boolean hide name="b">false</boolean>
  <p><answer type="boolean"><award>not $b</award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let booleaninputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let booleaninputAnchor = cesc('#' + booleaninputName + '_input');
      let booleaninputSubmitAnchor = cesc('#' + booleaninputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Select correct answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([true]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Press enter on submit button to submit")
      cy.get(booleaninputSubmitAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'true')
      cy.get('#\\/sr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([true]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([true]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(true);
      });


      cy.log("Select wrong answer")
      cy.get(booleaninputAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/sr1').should('have.text', 'true')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([true]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });

      cy.log("Submit answer")
      cy.get(booleaninputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/cr1').should('have.text', 'false')
      cy.get('#\\/sr1').should('have.text', 'false')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([false]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([false]);
        expect(stateVariables[booleaninputName].stateValues.value).eq(false);
      });
    })
  });

  it('answer multiple shortcut awards', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award><math>x+y</math></award><award credit="0.5"><math>x</math></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType="math" assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter partially correct answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0.5')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });


      cy.log("Enter incorrect answer")
      // cy.get(mathinputAnchor);
      cy.get(mathinputAnchor).type(`{end}{backspace}y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['y']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('y');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });


      cy.log("Submit answer")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['y']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['y']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('y');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('y');
      });

    })
  });

  it('answer multiple shortcut awards, initially unresolved', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award><math><copy target="rightAnswer" /></math></award><award credit="0.5"><math>x-3+<copy target="n" /></math></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='math' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>

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
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter partially correct answer")
      cy.get(mathinputAnchor).type(`{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0.5')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });


      cy.log("Enter incorrect answer")
      cy.get(mathinputAnchor).type(`{rightarrow}{backspace}y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/ca1').should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['y']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('y');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });


      cy.log("Submit answer")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'y')
      cy.get('#\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['y']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['y']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('y');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('y');
      });
    })
  });

  it('answer multiple awards, set to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text"><award><text>hello there</text></award><award credit="0.5"><text>bye</text></award></answer></p>
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='text' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/cr1').should('have.text', '')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq('');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(` hello there `).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', '')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('＿');
      });


      cy.log("Press enter to submit")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', ' hello there ');
      cy.get('#\\/cr1').should('have.text', ' hello there ')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([' hello there ']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq(' hello there ');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });


      cy.log("Enter partially correct answer")
      cy.get(textinputAnchor).clear().type(`bye`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get('#\\/cr1').should('have.text', 'bye')
      cy.get('#\\/sr1').should('have.text', ' hello there ')
      cy.get('#\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['bye']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([' hello there ']);
        expect(stateVariables[textinputName].stateValues.value).eq('bye');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq(' hello there ');
      });

      cy.log("Submit answer")
      cy.get(textinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get('#\\/cr1').should('have.text', 'bye')
      cy.get('#\\/sr1').should('have.text', 'bye')
      cy.get('#\\/ca1').should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['bye']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['bye']);
        expect(stateVariables[textinputName].stateValues.value).eq('bye');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('bye');
      });


      cy.log("Enter incorrect answer")
      cy.get(textinputAnchor).clear().type(`y`).blur();

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'y');
      cy.get('#\\/cr1').should('have.text', 'y')
      cy.get('#\\/sr1').should('have.text', 'bye')
      cy.get('#\\/ca1').should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['y']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['bye']);
        expect(stateVariables[textinputName].stateValues.value).eq('y');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('bye');
      });

      cy.log("Submit answer")
      cy.get(textinputAnchor).type(`{enter}`);

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', 'y');
      cy.get('#\\/cr1').should('have.text', 'y')
      cy.get('#\\/sr1').should('have.text', 'y')
      cy.get('#\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['y']);
        expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['y']);
        expect(stateVariables[textinputName].stateValues.value).eq('y');
        // expect(stateVariables[textinputName].stateValues.submittedValue).eq('y');
      });
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
  <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType='math' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  </section>

  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/s/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/s\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/s\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/s\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/s/_answer1'].stateValues.creditAchieved).eq(0);
        expect((stateVariables['/s/_answer1'].stateValues.currentResponses)).eqls(['\uFF3F']);
        expect(stateVariables['/s/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/s\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/s\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/s\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get('#\\/s\\/ca1').should('have.text', '0')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/s/_answer1'].stateValues.creditAchieved).eq(0);
        expect((stateVariables['/s/_answer1'].stateValues.currentResponses)).eqls([['+', 'x', 'y']]);
        expect(stateVariables['/s/_answer1'].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eq('\uFF3F');
      });


      cy.log("Press enter to submit")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/s\\/sr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/s\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/s\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/s\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/s/_answer1'].stateValues.creditAchieved).eq(1);
        expect((stateVariables['/s/_answer1'].stateValues.currentResponses)).eqls([['+', 'x', 'y']]);
        expect((stateVariables['/s/_answer1'].stateValues.submittedResponses)).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls(['+', 'x', 'y']);
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Enter partially correct answer")
      cy.get(mathinputAnchor).type(`{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/s\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/s\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/s\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/s\\/ca1').should('have.text', '1')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/s/_answer1'].stateValues.creditAchieved).eq(1);
        expect((stateVariables['/s/_answer1'].stateValues.currentResponses)).eqls(['x']);
        expect((stateVariables['/s/_answer1'].stateValues.submittedResponses)).eqls([['+', 'x', 'y']]);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls(['+', 'x', 'y']);
      });


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/s\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/s\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/s\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/s\\/ca1').should('have.text', '0.5')


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/s/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect((stateVariables['/s/_answer1'].stateValues.currentResponses)).eqls(['x']);
        expect((stateVariables['/s/_answer1'].stateValues.submittedResponses)).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('x');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });


      cy.log("Enter incorrect answer")
      cy.get(mathinputAnchor).type(`{rightarrow}{backspace}y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/s\\/cr1 .mjx-mrow').should('have.text', 'y')
      cy.get('#\\/s\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get('#\\/s\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/s\\/ca1').should('have.text', '0.5')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/s/_answer1'].stateValues.creditAchieved).eq(0.5);
        expect((stateVariables['/s/_answer1'].stateValues.currentResponses)).eqls(['y']);
        expect((stateVariables['/s/_answer1'].stateValues.submittedResponses)).eqls(['x']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('y');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('x');
      });


      cy.log("Submit answer")
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/s\\/sr1 .mjx-mrow').should('have.text', 'y')
      cy.get('#\\/s\\/cr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get('#\\/s\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
      cy.get('#\\/s\\/ca1').should('have.text', '0')

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/s/_answer1'].stateValues.creditAchieved).eq(0);
        expect((stateVariables['/s/_answer1'].stateValues.currentResponses)).eqls(['y']);
        expect((stateVariables['/s/_answer1'].stateValues.submittedResponses)).eqls(['y']);
        expect(stateVariables[mathinputName].stateValues.value).eqls('y');
        // expect(stateVariables[mathinputName].stateValues.submittedValue).eqls('y');
      });

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
  <p>First current response: <copy assignNames="cr" prop="currentResponse" target="_answer1" /></p>
  <p>First current response again: <copy assignNames="cr1" prop="currentResponse1" target="_answer1" /></p>
  <p>Second current response: <copy assignNames="cr2" prop="currentResponse2" target="_answer1" /></p>
  <p>Both current responses together: <copy assignNames="crsa crsb" prop="currentResponses" target="_answer1" /></p>
  <p>First submitted response: <copy assignNames="sr" prop="submittedResponse" target="_answer1" createComponentOfType="math" /></p>
  <p>First submitted response again: <copy assignNames="sr1" prop="submittedResponse1" target="_answer1" createComponentOfType="math" /></p>
  <p>Second submitted response: <copy assignNames="sr2" prop="submittedResponse2" target="_answer1" createComponentOfType="math" /></p>
  <p>Both submitted responses together: <copy assignNames="srsa srsb" prop="submittedResponses" target="_answer1" /></p>
  <p>Credit for submitted responses: <copy assignNames="ca" prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', '');
    // cy.get('#\\/_mathinput2_input').should('have.value', '');

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    // cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('＿')
    // });
    // cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('＿')
    // });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F', '\uFF3F']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('\uFF3F')
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls('\uFF3F')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
      expect(stateVariables['/_mathinput1'].stateValues.value).eq('\uFF3F');
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eq('\uFF3F');
      expect(stateVariables['/_mathinput2'].stateValues.value).eq('\uFF3F');
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eq('\uFF3F');
      expect((stateVariables['/cr'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/cr1'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/cr2'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/crsa'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/crsb'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/sr'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/sr1'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/sr2'].stateValues.value)).eq('\uFF3F')
      // expect(stateVariables['/srsa'].stateValues.value).eq('\uFF3F')
      // expect(stateVariables['/srsb'].stateValues.value).eq('\uFF3F')
      expect(stateVariables['/ca'].stateValues.value).eq(0)
    });

    cy.log("Enter a correct answer in")
    cy.get('#\\/_mathinput1 textarea').type(`x+y`, { force: true }).blur();
    cy.get('#\\/_mathinput2 textarea').type(`2x-y`, { force: true }).blur();

    cy.log('Test value displayed in browser')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).should('contain.text', 'x+y')
    cy.get(`#\\/_mathinput2 .mq-editable-field`).should('contain.text', '2x−y')
    cy.get(`#\\/cr .mjx-mrow`).should('contain.text', 'x+y')
    cy.get(`#\\/cr1 .mjx-mrow`).should('contain.text', 'x+y')
    cy.get(`#\\/crsa .mjx-mrow`).should('contain.text', 'x+y')
    cy.get(`#\\/cr2 .mjx-mrow`).should('contain.text', '2x−y')
    cy.get(`#\\/crsb .mjx-mrow`).should('contain.text', '2x−y')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2x−y')
    })
    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    // cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('＿')
    // });
    // cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('＿')
    // });
    cy.get(`#\\/ca`).should('have.text', '0')


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls(["+", 'x', 'y']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(["+", 'x', 'y']);
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eq('\uFF3F');
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eq('\uFF3F');
      expect((stateVariables['/cr'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/cr1'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect((stateVariables['/sr'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/sr1'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/sr2'].stateValues.value)).eq('\uFF3F')
      // expect(stateVariables['/srsa'].stateValues.value).eq('\uFF3F')
      // expect(stateVariables['/srsb'].stateValues.value).eq('\uFF3F')
      expect(stateVariables['/ca'].stateValues.value).eq(0)
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')

    cy.get(`#\\/sr .mjx-mrow`).should('contain.text', 'x+y')
    cy.get(`#\\/sr1 .mjx-mrow`).should('contain.text', 'x+y')
    cy.get(`#\\/srsa .mjx-mrow`).should('contain.text', 'x+y')
    cy.get(`#\\/sr2 .mjx-mrow`).should('contain.text', '2x−y')
    cy.get(`#\\/srsb .mjx-mrow`).should('contain.text', '2x−y')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2x−y')
    })

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/ca`).should('have.text', '1')


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls(["+", 'x', 'y']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse1)).eqls(["+", 'x', 'y']);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse2)).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(["+", 'x', 'y']);
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eqls(["+", 'x', 'y']);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect((stateVariables['/cr'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/cr1'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect((stateVariables['/sr'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/sr1'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/sr2'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect(stateVariables['/srsa'].stateValues.value).eqls(["+", 'x', 'y'])
      expect(stateVariables['/srsb'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect(stateVariables['/ca'].stateValues.value).eq(1)
    });


    cy.log("Enter partially correct answer")
    cy.get('#\\/_mathinput1 textarea').type(`{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}{backspace}x`, { force: true }).blur();
    cy.get('#\\/_mathinput2 textarea').type(`{rightarrow}{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}{backspace}{backspace}3-x`, { force: true }).blur();


    cy.log('Test value displayed in browser')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).should('contain.text', 'x')
    cy.get(`#\\/_mathinput2 .mq-editable-field`).should('contain.text', '3−x')
    cy.get(`#\\/cr .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/cr1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/crsa .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/cr2 .mjx-mrow`).should('contain.text', '3−x')
    cy.get(`#\\/crsb .mjx-mrow`).should('contain.text', '3−x')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3−x')
    })

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('x');
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse1)).eqls(["+", 'x', 'y']);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse2)).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls('x');
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eqls(["+", 'x', 'y']);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", 3, ['-', 'x']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect((stateVariables['/cr'].stateValues.value)).eqls('x')
      expect((stateVariables['/cr1'].stateValues.value)).eqls('x')
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls('x')
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/sr'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/sr1'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/sr2'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect(stateVariables['/srsa'].stateValues.value).eqls(["+", 'x', 'y'])
      expect(stateVariables['/srsb'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect(stateVariables['/ca'].stateValues.value).eq(1)
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();


    cy.log('Test value displayed in browser')

    cy.get(`#\\/sr .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/sr1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/srsa .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/sr2 .mjx-mrow`).should('contain.text', '3−x')
    cy.get(`#\\/srsb .mjx-mrow`).should('contain.text', '3−x')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3−x')
    })

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/ca`).should('have.text', '0.5')


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('x');
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse1)).eqls('x');
      expect((stateVariables['/_answer1'].stateValues.submittedResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls('x');
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eqls('x');
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", 3, ['-', 'x']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eqls(["+", 3, ['-', 'x']]);
      expect((stateVariables['/cr'].stateValues.value)).eqls('x')
      expect((stateVariables['/cr1'].stateValues.value)).eqls('x')
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls('x')
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/sr'].stateValues.value)).eqls('x')
      expect((stateVariables['/sr1'].stateValues.value)).eqls('x')
      expect((stateVariables['/sr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/srsa'].stateValues.value).eqls('x')
      expect(stateVariables['/srsb'].stateValues.value).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/ca'].stateValues.value).eq(0.5)
    });

    cy.log("Enter incorrect answer")
    cy.get('#\\/_mathinput1 textarea').type(`{rightarrow}{backspace}y`, { force: true }).blur();

    cy.log('Test value displayed in browser')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).should('contain.text', 'y')
    cy.get(`#\\/_mathinput2 .mq-editable-field`).should('contain.text', '3−x')
    cy.get(`#\\/cr .mjx-mrow`).should('contain.text', 'y')
    cy.get(`#\\/cr1 .mjx-mrow`).should('contain.text', 'y')
    cy.get(`#\\/crsa .mjx-mrow`).should('contain.text', 'y')
    cy.get(`#\\/cr2 .mjx-mrow`).should('contain.text', '3−x')
    cy.get(`#\\/crsb .mjx-mrow`).should('contain.text', '3−x')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3−x')
    })

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/ca`).should('have.text', '0.5')


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['y', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('y');
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse1)).eqls('x');
      expect((stateVariables['/_answer1'].stateValues.submittedResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls('y');
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eqls('x');
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", 3, ['-', 'x']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eqls(["+", 3, ['-', 'x']]);
      expect((stateVariables['/cr'].stateValues.value)).eqls('y')
      expect((stateVariables['/cr1'].stateValues.value)).eqls('y')
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls('y')
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/sr'].stateValues.value)).eqls('x')
      expect((stateVariables['/sr1'].stateValues.value)).eqls('x')
      expect((stateVariables['/sr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/srsa'].stateValues.value).eqls('x')
      expect(stateVariables['/srsb'].stateValues.value).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/ca'].stateValues.value).eq(0.5)
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get(`#\\/sr .mjx-mrow`).should('contain.text', 'y')
    cy.get(`#\\/sr1 .mjx-mrow`).should('contain.text', 'y')
    cy.get(`#\\/srsa .mjx-mrow`).should('contain.text', 'y')
    cy.get(`#\\/sr2 .mjx-mrow`).should('contain.text', '3−x')
    cy.get(`#\\/srsb .mjx-mrow`).should('contain.text', '3−x')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3−x')
    })

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['y', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('y');
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['y', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse1)).eqls('y');
      expect((stateVariables['/_answer1'].stateValues.submittedResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls('y');
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eqls('y');
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", 3, ['-', 'x']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eqls(["+", 3, ['-', 'x']]);
      expect((stateVariables['/cr'].stateValues.value)).eqls('y')
      expect((stateVariables['/cr1'].stateValues.value)).eqls('y')
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls('y')
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/sr'].stateValues.value)).eqls('y')
      expect((stateVariables['/sr1'].stateValues.value)).eqls('y')
      expect((stateVariables['/sr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/srsa'].stateValues.value).eqls('y')
      expect(stateVariables['/srsb'].stateValues.value).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/ca'].stateValues.value).eq(0)
    });

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
  <p>First current response: <copy assignNames="cr" prop="currentResponse" target="_answer1" /></p>
  <p>First current response again: <copy assignNames="cr1" prop="currentResponse1" target="_answer1" /></p>
  <p>Second current response: <copy assignNames="cr2" prop="currentResponse2" target="_answer1" /></p>
  <p>Both current responses together: <copy assignNames="crsa crsb" prop="currentResponses" target="_answer1" /></p>
  <p>First submitted response: <copy assignNames="sr" prop="submittedResponse" target="_answer1" createComponentOfType="math" /></p>
  <p>First submitted response again: <copy assignNames="sr1" prop="submittedResponse1" target="_answer1" createComponentOfType="math" /></p>
  <p>Second submitted response: <copy assignNames="sr2" prop="submittedResponse2" target="_answer1" createComponentOfType="math" /></p>
  <p>Both submitted responses together: <copy assignNames="srsa srsb" prop="submittedResponses" target="_answer1" /></p>
  <p>Credit for submitted responses: <copy assignNames="ca" prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', '');
    // cy.get('#\\/_mathinput2_input').should('have.value', '');

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    // cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('＿')
    // });
    // cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('＿')
    // });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['\uFF3F', '\uFF3F']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('\uFF3F')
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls('\uFF3F')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
      expect(stateVariables['/_mathinput1'].stateValues.value).eq('\uFF3F');
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eq('\uFF3F');
      expect(stateVariables['/_mathinput2'].stateValues.value).eq('\uFF3F');
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eq('\uFF3F');
      expect((stateVariables['/cr'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/cr1'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/cr2'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/crsa'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/crsb'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/sr'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/sr1'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/sr2'].stateValues.value)).eq('\uFF3F')
      // expect(stateVariables['/srsa'].stateValues.value).eq('\uFF3F')
      // expect(stateVariables['/srsb'].stateValues.value).eq('\uFF3F')
      expect(stateVariables['/ca'].stateValues.value).eq(0)
    });

    cy.log("Enter a correct answer in")
    cy.get('#\\/_mathinput1 textarea').type(`x+y`, { force: true }).blur();
    cy.get('#\\/_mathinput2 textarea').type(`2x-y`, { force: true }).blur();

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    // cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');

    cy.get(`#\\/cr .mjx-mrow`).should('have.text', 'x+y');
    cy.get(`#\\/cr1 .mjx-mrow`).should('have.text', 'x+y');
    cy.get(`#\\/cr2 .mjx-mrow`).should('have.text', '2x−y');
    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    // cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('＿')
    // });
    // cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('＿')
    // });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls(["+", 'x', 'y']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(["+", 'x', 'y']);
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eq('\uFF3F');
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eq('\uFF3F');
      expect((stateVariables['/cr'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/cr1'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect((stateVariables['/sr'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/sr1'].stateValues.value)).eq('\uFF3F')
      expect((stateVariables['/sr2'].stateValues.value)).eq('\uFF3F')
      // expect(stateVariables['/srsa'].stateValues.value).eq('\uFF3F')
      // expect(stateVariables['/srsb'].stateValues.value).eq('\uFF3F')
      expect(stateVariables['/ca'].stateValues.value).eq(0)
    });


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', 'x+y');
    // cy.get('#\\/_mathinput2_input').should('have.value', '2x-y');


    cy.get(`#\\/sr .mjx-mrow`).should('have.text', 'x+y');
    cy.get(`#\\/sr1 .mjx-mrow`).should('have.text', 'x+y');
    cy.get(`#\\/sr2 .mjx-mrow`).should('have.text', '2x−y');
    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls(["+", 'x', 'y']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse1)).eqls(["+", 'x', 'y']);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse2)).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(["+", 'x', 'y']);
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eqls(["+", 'x', 'y']);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect((stateVariables['/cr'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/cr1'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect((stateVariables['/sr'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/sr1'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/sr2'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect(stateVariables['/srsa'].stateValues.value).eqls(["+", 'x', 'y'])
      expect(stateVariables['/srsb'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect(stateVariables['/ca'].stateValues.value).eq(1)
    });


    cy.log("Enter partially correct answer")
    cy.get('#\\/_mathinput1 textarea').type(`{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}{backspace}x`, { force: true }).blur();
    cy.get('#\\/_mathinput2 textarea').type(`{rightarrow}{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}{backspace}{backspace}3-x`, { force: true }).blur();

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', 'x');
    // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

    cy.get(`#\\/cr .mjx-mrow`).should('have.text', 'x');
    cy.get(`#\\/cr1 .mjx-mrow`).should('have.text', 'x');
    cy.get(`#\\/cr2 .mjx-mrow`).should('have.text', '3−x');
    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x−y')
    });
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('x');
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([["+", 'x', 'y'], ["+", ['*', 2, 'x'], ['-', 'y']]]);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse1)).eqls(["+", 'x', 'y']);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse2)).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls('x');
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eqls(["+", 'x', 'y']);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", 3, ['-', 'x']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eqls(["+", ['*', 2, 'x'], ['-', 'y']]);
      expect((stateVariables['/cr'].stateValues.value)).eqls('x')
      expect((stateVariables['/cr1'].stateValues.value)).eqls('x')
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls('x')
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/sr'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/sr1'].stateValues.value)).eqls(["+", 'x', 'y'])
      expect((stateVariables['/sr2'].stateValues.value)).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect(stateVariables['/srsa'].stateValues.value).eqls(["+", 'x', 'y'])
      expect(stateVariables['/srsb'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['-', 'y']])
      expect(stateVariables['/ca'].stateValues.value).eq(1)
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();


    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', 'x');
    // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

    cy.get(`#\\/sr .mjx-mrow`).should('have.text', 'x');
    cy.get(`#\\/sr1 .mjx-mrow`).should('have.text', 'x');
    cy.get(`#\\/sr2 .mjx-mrow`).should('have.text', '3−x');

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/ca`).should('have.text', '0.5')


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['x', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('x');
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse1)).eqls('x');
      expect((stateVariables['/_answer1'].stateValues.submittedResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls('x');
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eqls('x');
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", 3, ['-', 'x']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eqls(["+", 3, ['-', 'x']]);
      expect((stateVariables['/cr'].stateValues.value)).eqls('x')
      expect((stateVariables['/cr1'].stateValues.value)).eqls('x')
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls('x')
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/sr'].stateValues.value)).eqls('x')
      expect((stateVariables['/sr1'].stateValues.value)).eqls('x')
      expect((stateVariables['/sr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/srsa'].stateValues.value).eqls('x')
      expect(stateVariables['/srsb'].stateValues.value).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/ca'].stateValues.value).eq(0.5)
    });

    cy.log("Enter incorrect answer")
    cy.get('#\\/_mathinput1 textarea').type(`{rightarrow}{backspace}y`, { force: true }).blur();

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', 'y');
    // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');

    cy.get(`#\\/cr .mjx-mrow`).should('have.text', 'y')
    cy.get(`#\\/cr1 .mjx-mrow`).should('have.text', 'y')
    cy.get(`#\\/cr2 .mjx-mrow`).should('have.text', '3−x')
    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/ca`).should('have.text', '0.5')


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['y', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('y');
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['x', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse1)).eqls('x');
      expect((stateVariables['/_answer1'].stateValues.submittedResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls('y');
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eqls('x');
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", 3, ['-', 'x']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eqls(["+", 3, ['-', 'x']]);
      expect((stateVariables['/cr'].stateValues.value)).eqls('y')
      expect((stateVariables['/cr1'].stateValues.value)).eqls('y')
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls('y')
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/sr'].stateValues.value)).eqls('x')
      expect((stateVariables['/sr1'].stateValues.value)).eqls('x')
      expect((stateVariables['/sr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/srsa'].stateValues.value).eqls('x')
      expect(stateVariables['/srsb'].stateValues.value).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/ca'].stateValues.value).eq(0.5)
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', 'y');
    // cy.get('#\\/_mathinput2_input').should('have.value', '3-x');


    cy.get(`#\\/sr .mjx-mrow`).should('have.text', 'y')
    cy.get(`#\\/sr1 .mjx-mrow`).should('have.text', 'y')
    cy.get(`#\\/sr2 .mjx-mrow`).should('have.text', '3−x')
    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/crsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/crsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/srsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/srsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3−x')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['y', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('y');
      expect((stateVariables['/_answer1'].stateValues.currentResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['y', ["+", 3, ['-', 'x']]]);
      expect((stateVariables['/_answer1'].stateValues.submittedResponse1)).eqls('y');
      expect((stateVariables['/_answer1'].stateValues.submittedResponse2)).eqls(["+", 3, ['-', 'x']]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls('y');
      // expect(stateVariables['/_mathinput1'].stateValues.submittedValue).eqls('y');
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(["+", 3, ['-', 'x']]);
      // expect(stateVariables['/_mathinput2'].stateValues.submittedValue).eqls(["+", 3, ['-', 'x']]);
      expect((stateVariables['/cr'].stateValues.value)).eqls('y')
      expect((stateVariables['/cr1'].stateValues.value)).eqls('y')
      expect((stateVariables['/cr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/crsa'].stateValues.value)).eqls('y')
      expect((stateVariables['/crsb'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect((stateVariables['/sr'].stateValues.value)).eqls('y')
      expect((stateVariables['/sr1'].stateValues.value)).eqls('y')
      expect((stateVariables['/sr2'].stateValues.value)).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/srsa'].stateValues.value).eqls('y')
      expect(stateVariables['/srsb'].stateValues.value).eqls(["+", 3, ['-', 'x']])
      expect(stateVariables['/ca'].stateValues.value).eq(0)
    });

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
  <p>First current response: <copy assignNames="cr" prop="currentResponse" target="_answer1" /></p>
  <p>First current response again: <copy assignNames="cr1" prop="currentResponse1" target="_answer1" /></p>
  <p>Second current response: <copy assignNames="cr2" prop="currentResponse2" target="_answer1" /></p>
  <p>Both current responses together: <copy assignNames="crsa crsb" prop="currentResponses" target="_answer1" /></p>
  <p>First submitted response: <copy assignNames="sr" prop="submittedResponse" target="_answer1" createComponentOfType="text" /></p>
  <p>First submitted response again: <copy assignNames="sr1" prop="submittedResponse1" target="_answer1" createComponentOfType="text" /></p>
  <p>Second submitted response: <copy assignNames="sr2" prop="submittedResponse2" target="_answer1" createComponentOfType="text" /></p>
  <p>Both submitted responses together: <copy assignNames="srsa srsb" prop="submittedResponses" target="_answer1" /></p>
  <p>Credit for submitted responses: <copy assignNames="ca" prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', '');
    cy.get('#\\/_textinput2_input').should('have.value', '');

    cy.get(`#\\/cr`).should('have.text', '')
    cy.get(`#\\/cr1`).should('have.text', '')
    cy.get(`#\\/cr2`).should('have.text', '')
    cy.get(`#\\/crsa`).should('have.text', '')
    cy.get(`#\\/crsb`).should('have.text', '')
    cy.get(`#\\/sr`).should('have.text', '')
    cy.get(`#\\/sr1`).should('have.text', '')
    cy.get(`#\\/sr2`).should('have.text', '')
    // cy.get(`#\\/srsa`).should('have.text', '＿')
    // cy.get(`#\\/srsb`).should('have.text', '＿')
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['', '']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('')
      expect(stateVariables['/_answer1'].stateValues.currentResponse2).eqls('')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
      expect(stateVariables['/_textinput1'].stateValues.value).eq('');
      // expect(stateVariables['/_textinput1'].stateValues.submittedValue).eq('\uFF3F');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('');
      // expect(stateVariables['/_textinput2'].stateValues.submittedValue).eq('\uFF3F');
      expect(stateVariables['/cr'].stateValues.value).eq('')
      expect(stateVariables['/cr1'].stateValues.value).eq('')
      expect(stateVariables['/cr2'].stateValues.value).eq('')
      expect(stateVariables['/crsa'].stateValues.value).eq('')
      expect(stateVariables['/crsb'].stateValues.value).eq('')
      expect(stateVariables['/sr'].stateValues.value).eq('')
      expect(stateVariables['/sr1'].stateValues.value).eq('')
      expect(stateVariables['/sr2'].stateValues.value).eq('')
      // expect(stateVariables['/srsa'].stateValues.value).eq('\uFF3F')
      // expect(stateVariables['/srsb'].stateValues.value).eq('\uFF3F')
      expect(stateVariables['/ca'].stateValues.value).eq(0)
    });

    cy.log("Enter a correct answer in")
    cy.get('#\\/_textinput1_input').type(`rain`).blur();
    cy.get('#\\/_textinput2_input').type(`snow{enter}`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');

    cy.get(`#\\/cr`).should('have.text', 'rain')
    cy.get(`#\\/cr1`).should('have.text', 'rain')
    cy.get(`#\\/cr2`).should('have.text', 'snow')
    cy.get(`#\\/crsa`).should('have.text', 'rain')
    cy.get(`#\\/crsb`).should('have.text', 'snow')
    cy.get(`#\\/sr`).should('have.text', '')
    cy.get(`#\\/sr1`).should('have.text', '')
    cy.get(`#\\/sr2`).should('have.text', '')
    // cy.get(`#\\/srsa`).should('have.text', '＿')
    // cy.get(`#\\/srsb`).should('have.text', '＿')
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['rain', 'snow']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.currentResponse2).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls(undefined)
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls(undefined)
      expect(stateVariables['/_textinput1'].stateValues.value).eq('rain');
      // expect(stateVariables['/_textinput1'].stateValues.submittedValue).eq('\uFF3F');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('snow');
      // expect(stateVariables['/_textinput2'].stateValues.submittedValue).eq('\uFF3F');
      expect(stateVariables['/cr'].stateValues.value).eq('rain')
      expect(stateVariables['/cr1'].stateValues.value).eq('rain')
      expect(stateVariables['/cr2'].stateValues.value).eq('snow')
      expect(stateVariables['/crsa'].stateValues.value).eq('rain')
      expect(stateVariables['/crsb'].stateValues.value).eq('snow')
      expect(stateVariables['/sr'].stateValues.value).eq('')
      expect(stateVariables['/sr1'].stateValues.value).eq('')
      expect(stateVariables['/sr2'].stateValues.value).eq('')
      // expect(stateVariables['/srsa'].stateValues.value).eq('\uFF3F')
      // expect(stateVariables['/srsb'].stateValues.value).eq('\uFF3F')
      expect(stateVariables['/ca'].stateValues.value).eq(0)
    });


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');

    cy.get(`#\\/cr`).should('have.text', 'rain')
    cy.get(`#\\/cr1`).should('have.text', 'rain')
    cy.get(`#\\/cr2`).should('have.text', 'snow')
    cy.get(`#\\/crsa`).should('have.text', 'rain')
    cy.get(`#\\/crsb`).should('have.text', 'snow')
    cy.get(`#\\/sr`).should('have.text', 'rain')
    cy.get(`#\\/sr1`).should('have.text', 'rain')
    cy.get(`#\\/sr2`).should('have.text', 'snow')
    cy.get(`#\\/srsa`).should('have.text', 'rain')
    cy.get(`#\\/srsb`).should('have.text', 'snow')
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['rain', 'snow']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.currentResponse2).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'snow'])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls('snow')
      expect(stateVariables['/_textinput1'].stateValues.value).eq('rain');
      // expect(stateVariables['/_textinput1'].stateValues.submittedValue).eq('rain');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('snow');
      // expect(stateVariables['/_textinput2'].stateValues.submittedValue).eq('snow');
      expect(stateVariables['/cr'].stateValues.value).eq('rain')
      expect(stateVariables['/cr1'].stateValues.value).eq('rain')
      expect(stateVariables['/cr2'].stateValues.value).eq('snow')
      expect(stateVariables['/crsa'].stateValues.value).eq('rain')
      expect(stateVariables['/crsb'].stateValues.value).eq('snow')
      expect(stateVariables['/sr'].stateValues.value).eq('rain')
      expect(stateVariables['/sr1'].stateValues.value).eq('rain')
      expect(stateVariables['/sr2'].stateValues.value).eq('snow')
      expect(stateVariables['/srsa'].stateValues.value).eq('rain')
      expect(stateVariables['/srsb'].stateValues.value).eq('snow')
      expect(stateVariables['/ca'].stateValues.value).eq(1)
    });


    cy.log("Enter partially correct answer")
    cy.get('#\\/_textinput2_input').clear().type(`rain`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'rain');

    cy.get(`#\\/cr`).should('have.text', 'rain')
    cy.get(`#\\/cr1`).should('have.text', 'rain')
    cy.get(`#\\/cr2`).should('have.text', 'rain')
    cy.get(`#\\/crsa`).should('have.text', 'rain')
    cy.get(`#\\/crsb`).should('have.text', 'rain')
    cy.get(`#\\/sr`).should('have.text', 'rain')
    cy.get(`#\\/sr1`).should('have.text', 'rain')
    cy.get(`#\\/sr2`).should('have.text', 'snow')
    cy.get(`#\\/srsa`).should('have.text', 'rain')
    cy.get(`#\\/srsb`).should('have.text', 'snow')
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.wait(100)

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['rain', 'rain']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.currentResponse2).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'snow'])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls('snow')
      expect(stateVariables['/_textinput1'].stateValues.value).eq('rain');
      // expect(stateVariables['/_textinput1'].stateValues.submittedValue).eq('rain');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('rain');
      // expect(stateVariables['/_textinput2'].stateValues.submittedValue).eq('snow');
      expect(stateVariables['/cr'].stateValues.value).eq('rain')
      expect(stateVariables['/cr1'].stateValues.value).eq('rain')
      expect(stateVariables['/cr2'].stateValues.value).eq('rain')
      expect(stateVariables['/crsa'].stateValues.value).eq('rain')
      expect(stateVariables['/crsb'].stateValues.value).eq('rain')
      expect(stateVariables['/sr'].stateValues.value).eq('rain')
      expect(stateVariables['/sr1'].stateValues.value).eq('rain')
      expect(stateVariables['/sr2'].stateValues.value).eq('snow')
      expect(stateVariables['/srsa'].stateValues.value).eq('rain')
      expect(stateVariables['/srsb'].stateValues.value).eq('snow')
      expect(stateVariables['/ca'].stateValues.value).eq(1)
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'rain');
    cy.get('#\\/_textinput2_input').should('have.value', 'rain');

    cy.get(`#\\/cr`).should('have.text', 'rain')
    cy.get(`#\\/cr1`).should('have.text', 'rain')
    cy.get(`#\\/cr2`).should('have.text', 'rain')
    cy.get(`#\\/crsa`).should('have.text', 'rain')
    cy.get(`#\\/crsb`).should('have.text', 'rain')
    cy.get(`#\\/sr`).should('have.text', 'rain')
    cy.get(`#\\/sr1`).should('have.text', 'rain')
    cy.get(`#\\/sr2`).should('have.text', 'rain')
    cy.get(`#\\/srsa`).should('have.text', 'rain')
    cy.get(`#\\/srsb`).should('have.text', 'rain')
    cy.get(`#\\/ca`).should('have.text', '0.5')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['rain', 'rain']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.currentResponse2).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'rain'])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls('rain')
      expect(stateVariables['/_textinput1'].stateValues.value).eq('rain');
      // expect(stateVariables['/_textinput1'].stateValues.submittedValue).eq('rain');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('rain');
      // expect(stateVariables['/_textinput2'].stateValues.submittedValue).eq('rain');
      expect(stateVariables['/cr'].stateValues.value).eq('rain')
      expect(stateVariables['/cr1'].stateValues.value).eq('rain')
      expect(stateVariables['/cr2'].stateValues.value).eq('rain')
      expect(stateVariables['/crsa'].stateValues.value).eq('rain')
      expect(stateVariables['/crsb'].stateValues.value).eq('rain')
      expect(stateVariables['/sr'].stateValues.value).eq('rain')
      expect(stateVariables['/sr1'].stateValues.value).eq('rain')
      expect(stateVariables['/sr2'].stateValues.value).eq('rain')
      expect(stateVariables['/srsa'].stateValues.value).eq('rain')
      expect(stateVariables['/srsb'].stateValues.value).eq('rain')
      expect(stateVariables['/ca'].stateValues.value).eq(0.5)
    });

    cy.log("Make correct again");
    cy.get('#\\/_textinput1_input').clear().type(`snow`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'snow');
    cy.get('#\\/_textinput2_input').should('have.value', 'rain');

    cy.get(`#\\/cr`).should('have.text', 'snow')
    cy.get(`#\\/cr1`).should('have.text', 'snow')
    cy.get(`#\\/cr2`).should('have.text', 'rain')
    cy.get(`#\\/crsa`).should('have.text', 'snow')
    cy.get(`#\\/crsb`).should('have.text', 'rain')
    cy.get(`#\\/sr`).should('have.text', 'rain')
    cy.get(`#\\/sr1`).should('have.text', 'rain')
    cy.get(`#\\/sr2`).should('have.text', 'rain')
    cy.get(`#\\/srsa`).should('have.text', 'rain')
    cy.get(`#\\/srsb`).should('have.text', 'rain')
    cy.get(`#\\/ca`).should('have.text', '0.5')

    cy.wait(100)

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['snow', 'rain']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.currentResponse2).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['rain', 'rain'])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls('rain')
      expect(stateVariables['/_textinput1'].stateValues.value).eq('snow');
      // expect(stateVariables['/_textinput1'].stateValues.submittedValue).eq('rain');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('rain');
      // expect(stateVariables['/_textinput2'].stateValues.submittedValue).eq('rain');
      expect(stateVariables['/cr'].stateValues.value).eq('snow')
      expect(stateVariables['/cr1'].stateValues.value).eq('snow')
      expect(stateVariables['/cr2'].stateValues.value).eq('rain')
      expect(stateVariables['/crsa'].stateValues.value).eq('snow')
      expect(stateVariables['/crsb'].stateValues.value).eq('rain')
      expect(stateVariables['/sr'].stateValues.value).eq('rain')
      expect(stateVariables['/sr1'].stateValues.value).eq('rain')
      expect(stateVariables['/sr2'].stateValues.value).eq('rain')
      expect(stateVariables['/srsa'].stateValues.value).eq('rain')
      expect(stateVariables['/srsb'].stateValues.value).eq('rain')
      expect(stateVariables['/ca'].stateValues.value).eq(0.5)
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'snow');
    cy.get('#\\/_textinput2_input').should('have.value', 'rain');

    cy.get(`#\\/cr`).should('have.text', 'snow')
    cy.get(`#\\/cr1`).should('have.text', 'snow')
    cy.get(`#\\/cr2`).should('have.text', 'rain')
    cy.get(`#\\/crsa`).should('have.text', 'snow')
    cy.get(`#\\/crsb`).should('have.text', 'rain')
    cy.get(`#\\/sr`).should('have.text', 'snow')
    cy.get(`#\\/sr1`).should('have.text', 'snow')
    cy.get(`#\\/sr2`).should('have.text', 'rain')
    cy.get(`#\\/srsa`).should('have.text', 'snow')
    cy.get(`#\\/srsb`).should('have.text', 'rain')
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['snow', 'rain']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.currentResponse2).eqls('rain')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'rain'])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls('rain')
      expect(stateVariables['/_textinput1'].stateValues.value).eq('snow');
      // expect(stateVariables['/_textinput1'].stateValues.submittedValue).eq('snow');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('rain');
      // expect(stateVariables['/_textinput2'].stateValues.submittedValue).eq('rain');
      expect(stateVariables['/cr'].stateValues.value).eq('snow')
      expect(stateVariables['/cr1'].stateValues.value).eq('snow')
      expect(stateVariables['/cr2'].stateValues.value).eq('rain')
      expect(stateVariables['/crsa'].stateValues.value).eq('snow')
      expect(stateVariables['/crsb'].stateValues.value).eq('rain')
      expect(stateVariables['/sr'].stateValues.value).eq('snow')
      expect(stateVariables['/sr1'].stateValues.value).eq('snow')
      expect(stateVariables['/sr2'].stateValues.value).eq('rain')
      expect(stateVariables['/srsa'].stateValues.value).eq('snow')
      expect(stateVariables['/srsb'].stateValues.value).eq('rain')
      expect(stateVariables['/ca'].stateValues.value).eq(1)
    });

    cy.log("Enter another partially correct answer")
    cy.get('#\\/_textinput2_input').clear().type(`snow`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'snow');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');

    cy.get(`#\\/cr`).should('have.text', 'snow')
    cy.get(`#\\/cr1`).should('have.text', 'snow')
    cy.get(`#\\/cr2`).should('have.text', 'snow')
    cy.get(`#\\/crsa`).should('have.text', 'snow')
    cy.get(`#\\/crsb`).should('have.text', 'snow')
    cy.get(`#\\/sr`).should('have.text', 'snow')
    cy.get(`#\\/sr1`).should('have.text', 'snow')
    cy.get(`#\\/sr2`).should('have.text', 'rain')
    cy.get(`#\\/srsa`).should('have.text', 'snow')
    cy.get(`#\\/srsb`).should('have.text', 'rain')
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.wait(100)

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['snow', 'snow']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.currentResponse2).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'rain'])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls('rain')
      expect(stateVariables['/_textinput1'].stateValues.value).eq('snow');
      // expect(stateVariables['/_textinput1'].stateValues.submittedValue).eq('snow');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('snow');
      // expect(stateVariables['/_textinput2'].stateValues.submittedValue).eq('rain');
      expect(stateVariables['/cr'].stateValues.value).eq('snow')
      expect(stateVariables['/cr1'].stateValues.value).eq('snow')
      expect(stateVariables['/cr2'].stateValues.value).eq('snow')
      expect(stateVariables['/crsa'].stateValues.value).eq('snow')
      expect(stateVariables['/crsb'].stateValues.value).eq('snow')
      expect(stateVariables['/sr'].stateValues.value).eq('snow')
      expect(stateVariables['/sr1'].stateValues.value).eq('snow')
      expect(stateVariables['/sr2'].stateValues.value).eq('rain')
      expect(stateVariables['/srsa'].stateValues.value).eq('snow')
      expect(stateVariables['/srsb'].stateValues.value).eq('rain')
      expect(stateVariables['/ca'].stateValues.value).eq(1)
    });


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'snow');
    cy.get('#\\/_textinput2_input').should('have.value', 'snow');

    cy.get(`#\\/cr`).should('have.text', 'snow')
    cy.get(`#\\/cr1`).should('have.text', 'snow')
    cy.get(`#\\/cr2`).should('have.text', 'snow')
    cy.get(`#\\/crsa`).should('have.text', 'snow')
    cy.get(`#\\/crsb`).should('have.text', 'snow')
    cy.get(`#\\/sr`).should('have.text', 'snow')
    cy.get(`#\\/sr1`).should('have.text', 'snow')
    cy.get(`#\\/sr2`).should('have.text', 'snow')
    cy.get(`#\\/srsa`).should('have.text', 'snow')
    cy.get(`#\\/srsb`).should('have.text', 'snow')
    cy.get(`#\\/ca`).should('have.text', '0.5')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['snow', 'snow']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.currentResponse2).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'snow'])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls('snow')
      expect(stateVariables['/_textinput1'].stateValues.value).eq('snow');
      // expect(stateVariables['/_textinput1'].stateValues.submittedValue).eq('snow');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('snow');
      // expect(stateVariables['/_textinput2'].stateValues.submittedValue).eq('snow');
      expect(stateVariables['/cr'].stateValues.value).eq('snow')
      expect(stateVariables['/cr1'].stateValues.value).eq('snow')
      expect(stateVariables['/cr2'].stateValues.value).eq('snow')
      expect(stateVariables['/crsa'].stateValues.value).eq('snow')
      expect(stateVariables['/crsb'].stateValues.value).eq('snow')
      expect(stateVariables['/sr'].stateValues.value).eq('snow')
      expect(stateVariables['/sr1'].stateValues.value).eq('snow')
      expect(stateVariables['/sr2'].stateValues.value).eq('snow')
      expect(stateVariables['/srsa'].stateValues.value).eq('snow')
      expect(stateVariables['/srsb'].stateValues.value).eq('snow')
      expect(stateVariables['/ca'].stateValues.value).eq(0.5)
    });


    cy.log("Enter incorrect answer")
    cy.get('#\\/_textinput1_input').clear().type(`fog`).blur();
    cy.get('#\\/_textinput2_input').clear().type(`hail`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'fog');
    cy.get('#\\/_textinput2_input').should('have.value', 'hail');

    cy.get(`#\\/cr`).should('have.text', 'fog')
    cy.get(`#\\/cr1`).should('have.text', 'fog')
    cy.get(`#\\/cr2`).should('have.text', 'hail')
    cy.get(`#\\/crsa`).should('have.text', 'fog')
    cy.get(`#\\/crsb`).should('have.text', 'hail')
    cy.get(`#\\/sr`).should('have.text', 'snow')
    cy.get(`#\\/sr1`).should('have.text', 'snow')
    cy.get(`#\\/sr2`).should('have.text', 'snow')
    cy.get(`#\\/srsa`).should('have.text', 'snow')
    cy.get(`#\\/srsb`).should('have.text', 'snow')
    cy.get(`#\\/ca`).should('have.text', '0.5')

    cy.wait(100)

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['fog', 'hail']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('fog')
      expect(stateVariables['/_answer1'].stateValues.currentResponse2).eqls('hail')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['snow', 'snow'])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls('snow')
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls('snow')
      expect(stateVariables['/_textinput1'].stateValues.value).eq('fog');
      // expect(stateVariables['/_textinput1'].stateValues.submittedValue).eq('snow');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('hail');
      // expect(stateVariables['/_textinput2'].stateValues.submittedValue).eq('snow');
      expect(stateVariables['/cr'].stateValues.value).eq('fog')
      expect(stateVariables['/cr1'].stateValues.value).eq('fog')
      expect(stateVariables['/cr2'].stateValues.value).eq('hail')
      expect(stateVariables['/crsa'].stateValues.value).eq('fog')
      expect(stateVariables['/crsb'].stateValues.value).eq('hail')
      expect(stateVariables['/sr'].stateValues.value).eq('snow')
      expect(stateVariables['/sr1'].stateValues.value).eq('snow')
      expect(stateVariables['/sr2'].stateValues.value).eq('snow')
      expect(stateVariables['/srsa'].stateValues.value).eq('snow')
      expect(stateVariables['/srsb'].stateValues.value).eq('snow')
      expect(stateVariables['/ca'].stateValues.value).eq(0.5)
    });


    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_textinput1_input').should('have.value', 'fog');
    cy.get('#\\/_textinput2_input').should('have.value', 'hail');

    cy.get(`#\\/cr`).should('have.text', 'fog')
    cy.get(`#\\/cr1`).should('have.text', 'fog')
    cy.get(`#\\/cr2`).should('have.text', 'hail')
    cy.get(`#\\/crsa`).should('have.text', 'fog')
    cy.get(`#\\/crsb`).should('have.text', 'hail')
    cy.get(`#\\/sr`).should('have.text', 'fog')
    cy.get(`#\\/sr1`).should('have.text', 'fog')
    cy.get(`#\\/sr2`).should('have.text', 'hail')
    cy.get(`#\\/srsa`).should('have.text', 'fog')
    cy.get(`#\\/srsb`).should('have.text', 'hail')
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['fog', 'hail']);
      expect((stateVariables['/_answer1'].stateValues.currentResponse1)).eqls('fog')
      expect(stateVariables['/_answer1'].stateValues.currentResponse2).eqls('hail')
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['fog', 'hail'])
      expect(stateVariables['/_answer1'].stateValues.submittedResponse1).eqls('fog')
      expect(stateVariables['/_answer1'].stateValues.submittedResponse2).eqls('hail')
      expect(stateVariables['/_textinput1'].stateValues.value).eq('fog');
      // expect(stateVariables['/_textinput1'].stateValues.submittedValue).eq('fog');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('hail');
      // expect(stateVariables['/_textinput2'].stateValues.submittedValue).eq('hail');
      expect(stateVariables['/cr'].stateValues.value).eq('fog')
      expect(stateVariables['/cr1'].stateValues.value).eq('fog')
      expect(stateVariables['/cr2'].stateValues.value).eq('hail')
      expect(stateVariables['/crsa'].stateValues.value).eq('fog')
      expect(stateVariables['/crsb'].stateValues.value).eq('hail')
      expect(stateVariables['/sr'].stateValues.value).eq('fog')
      expect(stateVariables['/sr1'].stateValues.value).eq('fog')
      expect(stateVariables['/sr2'].stateValues.value).eq('hail')
      expect(stateVariables['/srsa'].stateValues.value).eq('fog')
      expect(stateVariables['/srsb'].stateValues.value).eq('hail')
      expect(stateVariables['/ca'].stateValues.value).eq(0)
    });

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
  <p>Submitted response: <copy assignNames="sr" prop="submittedResponse" target="_answer1" /></p>
  <p>Credit achieved: <copy assignNames="ca" prop="creditAchieved" target="_answer1" /></p>
  `}, "*");

    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test initial values')
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.log("Submit a correct answer")
    cy.get('#\\/m textarea').type(`6`, { force: true });
    cy.get('#\\/m_submit').click();

    cy.get(`#\\/sr .mjx-mrow`).should('have.text', '6')
    cy.get(`#\\/ca`).should('have.text', '1')


    cy.log("Submit an incorrect answer")
    cy.get('#\\/m textarea').type(`{rightarrow}{backspace}5`, { force: true });
    cy.get('#\\/m_submit').click();

    cy.get(`#\\/sr .mjx-mrow`).should('have.text', '5')
    cy.get(`#\\/ca`).should('have.text', '0')


    cy.log("Submit a different correct answer")
    cy.get('#\\/m textarea').type(`{rightarrow}{backspace}-3`, { force: true });
    cy.get('#\\/m_submit').click();

    cy.get(`#\\/sr .mjx-mrow`).should('have.text', '−3')
    cy.get(`#\\/ca`).should('have.text', '1')


    cy.log("Submit a correct answer that must be simplified")
    cy.get('#\\/m textarea').type(`{end}{backspace}{backspace}5xy-5xy+9`, { force: true });
    cy.get('#\\/m_submit').click();

    cy.get(`#\\/sr .mjx-mrow`).should('have.text', '5xy−5xy+9')
    cy.get(`#\\/ca`).should('have.text', '1')


    cy.log("Submit a non-numerical answer")
    cy.get('#\\/m textarea').type(`{end}{leftarrow}{leftarrow}z`, { force: true });
    cy.get('#\\/m_submit').click();

    cy.get(`#\\/sr .mjx-mrow`).should('have.text', '5xy−5xyz+9')
    cy.get(`#\\/ca`).should('have.text', '0')


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
  <p>Submitted response: <copy assignNames="sr" prop="submittedResponse" target="_answer1" /></p>
  <p>Credit achieved: <copy assignNames="ca" prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    // cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers1 = { "1": "1", "-1": "1", "0.5": "1", "1.1": "0", "-2": "0", "x-x": "1", "x": "0" }

    for (let answerString in answers1) {
      cy.get('#\\/_mathinput1 textarea').type("{ctrl+home}{shift+end}{backspace}" + answerString, { delay: 5, force: true });
      cy.get('#\\/_mathinput1_submit').click();

      cy.get(`#\\/sr .mjx-mrow`).should('have.text', answerString.replace(/-/g, '−'))
      cy.get(`#\\/ca`).should('have.text', answers1[answerString])
    }


    cy.wait(500)

    cy.log("Number between -1 and 1, exclusive");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <answer><mathinput/>
  <award><when>-1 < <copy prop="immediateValue" isResponse target="_mathinput1" /> < 1</when></award>
  </answer>
  <p>Submitted response: <copy assignNames="sr" prop="submittedResponse" target="_answer1" /></p>
  <p>Credit achieved: <copy assignNames="ca" prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

    // cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers2 = { "1": "0", "-1": "0", "0.5": "1", "0.99": "1", "-2": "0", "x-x": "1", "x": "0" }
    for (let answerString in answers2) {
      cy.get('#\\/_mathinput1 textarea').type("{ctrl+home}{shift+end}{backspace}" + answerString, { delay: 5, force: true });
      cy.get('#\\/_mathinput1_submit').click();

      cy.get(`#\\/sr .mjx-mrow`).should('have.text', answerString.replace(/-/g, '−'))
      cy.get(`#\\/ca`).should('have.text', answers2[answerString])
    }


    cy.wait(500)

    cy.log("Number between -1 and 1, as greater than");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>c</text>
  <answer><mathinput/>
  <award><when>1 > <copy prop="immediateValue" isResponse target="_mathinput1" /> >= -1</when></award>
  </answer>
  <p>Submitted response: <copy assignNames="sr" prop="submittedResponse" target="_answer1" /></p>
  <p>Credit achieved: <copy assignNames="ca" prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'c');  // to wait until loaded

    // cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers3 = { "1": "0", "-1": "1", "0.5": "1", "0.99": "1", "-2": "0", "x-x": "1", "x": "0" }

    for (let answerString in answers3) {
      cy.get('#\\/_mathinput1 textarea').type("{ctrl+home}{shift+end}{backspace}" + answerString, { delay: 5, force: true });
      cy.get('#\\/_mathinput1_submit').click();

      cy.get(`#\\/sr .mjx-mrow`).should('have.text', answerString.replace(/-/g, '−'))
      cy.get(`#\\/ca`).should('have.text', answers3[answerString])
    }
  });

  it('compound logic', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput/> <mathinput/> <mathinput/>
  <answer>
    <award><when>
      ((<copy prop="immediateValue" target="_mathinput1" isResponse /> = x
      and <copy prop="immediateValue" target="_mathinput2" isResponse /> != <copy prop="immediateValue" target="_mathinput1"  />)
      or
      (<copy prop="immediateValue" target="_mathinput1" /> = <math>y</math>
      and <copy prop="immediateValue" target="_mathinput2" /> != z
      and <copy prop="immediateValue" target="_mathinput2" /> != q))
      and <copy prop="immediateValue" target="_mathinput3" isResponse /> > 5
   </when></award>
  </answer>
  <p>Submitted responses: <copy assignNames="sr1 sr2 sr3" prop="submittedResponses" target="_answer1" /></p>
  <p>Credit achieved: <copy assignNames="ca" prop="creditAchieved" target="_answer1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    // cy.get('#\\/_mathinput1_input').should('have.value', '');

    let answers1 = [["1", "x", "z", "6"], ["0", "x", "x", "6"], ["0", "x", "z", "5"],
    ["1", "y", "y", "7"], ["0", "y", "z", "7"], ["0", "y", "q", "7"], ["1", "y", "y^2", "7"],
    ["0", "y", "y", "a"]];

    for (let answer of answers1) {
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}" + answer[1], { delay: 5, force: true }).blur();
      cy.get('#\\/_mathinput2 textarea').type("{ctrl+home}{shift+end}{backspace}" + answer[2], { delay: 5, force: true }).blur();
      cy.get('#\\/_mathinput3 textarea').type("{end}{backspace}" + answer[3], { delay: 5, force: true }).blur();
      cy.get('#\\/_answer1_submit').click();

      cy.get('#\\/sr1 .mjx-mrow').should('have.text', answer[1])
      cy.get('#\\/sr2 .mjx-mrow').should('contain.text', answer[2].replace("^", ""))
      cy.get('#\\/sr3 .mjx-mrow').should('have.text', answer[3])

      cy.get('#\\/ca').should('have.text', answer[0])

    }

  });

  it('answer inside map', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map assignNames="a b c">
      <template newNamespace>
        <p>Enter <m>x^$n</m>: <answer><award><math>x^$n</math></award></answer></p>
        <p>Credit achieved: <copy prop="creditAchieved" target="_answer1" assignNames="ca" /></p>
        <p>Current response: <copy prop="currentResponse" target="_answer1" assignNames="cr" /></p>
        <p>Submitted response: <copy prop="submittedResponse" target="_answer1" createComponentOfType="math" assignNames="sr" /></p>
      </template>
      <sources alias="n"><sequence from="1" to="3" /></sources>
    </map>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinput1Name = stateVariables['/a/_answer1'].stateValues.inputChildren[0].componentName;
      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let mathinput1SubmitAnchor = cesc('#' + mathinput1Name + '_submit');

      let mathinput2Name = stateVariables['/b/_answer1'].stateValues.inputChildren[0].componentName;
      let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc('#' + mathinput2Name + '_submit');

      let mathinput3Name = stateVariables['/c/_answer1'].stateValues.inputChildren[0].componentName;
      let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
      let mathinput3SubmitAnchor = cesc('#' + mathinput3Name + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinput1Anchor).should('have.value', '');
      // cy.get(mathinput2Anchor).should('have.value', '');
      // cy.get(mathinput3Anchor).should('have.value', '');
      cy.get("#\\/a\\/ca").should('have.text', '0');
      cy.get("#\\/b\\/ca").should('have.text', '0');
      cy.get("#\\/c\\/ca").should('have.text', '0');
      cy.get("#\\/a\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get("#\\/b\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get("#\\/c\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get("#\\/a\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get("#\\/b\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get("#\\/c\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/a/_answer1"].stateValues.creditAchieved).eq(0);
        expect((stateVariables["/a/_answer1"].stateValues.currentResponses)).eqls(['\uFF3F']);
        expect(stateVariables["/a/_answer1"].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinput1Name].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinput1Name].stateValues.submittedValue).eq('\uFF3F');
        expect(stateVariables["/b/_answer1"].stateValues.creditAchieved).eq(0);
        expect((stateVariables["/b/_answer1"].stateValues.currentResponses)).eqls(['\uFF3F']);
        expect(stateVariables["/b/_answer1"].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinput2Name].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinput2Name].stateValues.submittedValue).eq('\uFF3F');
        expect(stateVariables["/c/_answer1"].stateValues.creditAchieved).eq(0);
        expect((stateVariables["/c/_answer1"].stateValues.currentResponses)).eqls(['\uFF3F']);
        expect(stateVariables["/c/_answer1"].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinput3Name].stateValues.value).eq('\uFF3F');
        // expect(stateVariables[mathinput3Name].stateValues.submittedValue).eq('\uFF3F');
      });

      cy.log("Enter correct answer in all three blanks")
      cy.get(mathinput1Anchor).type(`x`, { force: true }).blur();
      cy.get(mathinput2Anchor).type(`x^2`, { force: true }).blur();
      cy.get(mathinput3Anchor).type(`x^3`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinput1Anchor).should('have.value', 'x');
      // cy.get(mathinput2Anchor).should('have.value', 'x^2');
      // cy.get(mathinput3Anchor).should('have.value', 'x^3');


      cy.get("#\\/a\\/cr .mjx-mrow").should('have.text', 'x')
      cy.get("#\\/b\\/cr .mjx-mrow").should('contain.text', 'x2')
      cy.get("#\\/c\\/cr .mjx-mrow").should('contain.text', 'x3')

      cy.get("#\\/a\\/ca").should('have.text', '0');
      cy.get("#\\/b\\/ca").should('have.text', '0');
      cy.get("#\\/c\\/ca").should('have.text', '0');
      cy.get("#\\/a\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get("#\\/b\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2')
      });
      cy.get("#\\/c\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x3')
      });
      cy.get("#\\/a\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get("#\\/b\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });
      cy.get("#\\/c\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      });

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/a/_answer1"].stateValues.creditAchieved).eq(0);
        expect((stateVariables["/a/_answer1"].stateValues.currentResponses)).eqls(['x']);
        expect(stateVariables["/a/_answer1"].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinput1Name].stateValues.value).eq('x');
        // expect(stateVariables[mathinput1Name].stateValues.submittedValue).eq('\uFF3F');
        expect(stateVariables["/b/_answer1"].stateValues.creditAchieved).eq(0);
        expect((stateVariables["/b/_answer1"].stateValues.currentResponses)).eqls([['^', 'x', 2]]);
        expect(stateVariables["/b/_answer1"].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinput2Name].stateValues.value).eqls(['^', 'x', 2]);
        // expect(stateVariables[mathinput2Name].stateValues.submittedValue).eq('\uFF3F');
        expect(stateVariables["/c/_answer1"].stateValues.creditAchieved).eq(0);
        expect((stateVariables["/c/_answer1"].stateValues.currentResponses)).eqls([['^', 'x', 3]]);
        expect(stateVariables["/c/_answer1"].stateValues.submittedResponses).eqls([]);
        expect(stateVariables[mathinput3Name].stateValues.value).eqls(['^', 'x', 3]);
        // expect(stateVariables[mathinput3Name].stateValues.submittedValue).eq('\uFF3F');
      });

      cy.log("Submit answers")
      cy.get(mathinput1SubmitAnchor).click();
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput3SubmitAnchor).click();


      cy.log('Test value displayed in browser')
      // cy.get(mathinput1Anchor).should('have.value', 'x');
      // cy.get(mathinput2Anchor).should('have.value', 'x^2');
      // cy.get(mathinput3Anchor).should('have.value', 'x^3');

      cy.get("#\\/a\\/ca").should('have.text', '1');
      cy.get("#\\/b\\/ca").should('have.text', '1');
      cy.get("#\\/c\\/ca").should('have.text', '1');
      cy.get("#\\/a\\/sr .mjx-mrow").should('have.text', 'x')
      cy.get("#\\/b\\/sr .mjx-mrow").should('contain.text', 'x2')
      cy.get("#\\/c\\/sr .mjx-mrow").should('contain.text', 'x3')
      cy.get("#\\/a\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get("#\\/b\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2')
      });
      cy.get("#\\/c\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x3')
      });
      cy.get("#\\/a\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get("#\\/b\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2')
      });
      cy.get("#\\/c\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x3')
      });


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/a/_answer1"].stateValues.creditAchieved).eq(1);
        expect((stateVariables["/a/_answer1"].stateValues.currentResponses)).eqls(['x']);
        expect((stateVariables["/a/_answer1"].stateValues.submittedResponses)).eqls(['x']);
        expect(stateVariables[mathinput1Name].stateValues.value).eq('x');
        // expect(stateVariables[mathinput1Name].stateValues.submittedValue).eq('x');
        expect(stateVariables["/b/_answer1"].stateValues.creditAchieved).eq(1);
        expect((stateVariables["/b/_answer1"].stateValues.currentResponses)).eqls([['^', 'x', 2]]);
        expect((stateVariables["/b/_answer1"].stateValues.submittedResponses)).eqls([['^', 'x', 2]]);
        expect(stateVariables[mathinput2Name].stateValues.value).eqls(['^', 'x', 2]);
        // expect(stateVariables[mathinput2Name].stateValues.submittedValue).eqls(['^', 'x', 2]);
        expect(stateVariables["/c/_answer1"].stateValues.creditAchieved).eq(1);
        expect((stateVariables["/c/_answer1"].stateValues.currentResponses)).eqls([['^', 'x', 3]]);
        expect((stateVariables["/c/_answer1"].stateValues.submittedResponses)).eqls([['^', 'x', 3]]);
        expect(stateVariables[mathinput3Name].stateValues.value).eqls(['^', 'x', 3]);
        // expect(stateVariables[mathinput3Name].stateValues.submittedValue).eqls(['^', 'x', 3]);
      });

      cy.log("Enter wrong answers")
      cy.get(mathinput1Anchor).type(`{end}{backspace}u`, { force: true }).blur();
      cy.get(mathinput2Anchor).type(`{ctrl+home}{shift+end}{backspace}v`, { force: true }).blur();
      cy.get(mathinput3Anchor).type(`{ctrl+home}{shift+end}{backspace}w`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinput1Anchor).should('have.value', 'u');
      // cy.get(mathinput2Anchor).should('have.value', 'v');
      // cy.get(mathinput3Anchor).should('have.value', 'w');


      cy.get("#\\/a\\/cr .mjx-mrow").should('have.text', 'u')
      cy.get("#\\/b\\/cr .mjx-mrow").should('have.text', 'v')
      cy.get("#\\/c\\/cr .mjx-mrow").should('have.text', 'w')

      cy.get("#\\/a\\/ca").should('have.text', '1');
      cy.get("#\\/b\\/ca").should('have.text', '1');
      cy.get("#\\/c\\/ca").should('have.text', '1');

      cy.get("#\\/a\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('u')
      });
      cy.get("#\\/b\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('v')
      });
      cy.get("#\\/c\\/cr" + ' .mjx-mrow').should('have.text', 'w')
      cy.get("#\\/c\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('w')
      });
      cy.get("#\\/a\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get("#\\/b\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2')
      });
      cy.get("#\\/c\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x3')
      });


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/a/_answer1"].stateValues.creditAchieved).eq(1);
        expect((stateVariables["/a/_answer1"].stateValues.currentResponses)).eqls(['u']);
        expect((stateVariables["/a/_answer1"].stateValues.submittedResponses)).eqls(['x']);
        expect(stateVariables[mathinput1Name].stateValues.value).eq('u');
        // expect(stateVariables[mathinput1Name].stateValues.submittedValue).eq('x');
        expect(stateVariables["/b/_answer1"].stateValues.creditAchieved).eq(1);
        expect((stateVariables["/b/_answer1"].stateValues.currentResponses)).eqls(['v']);
        expect((stateVariables["/b/_answer1"].stateValues.submittedResponses)).eqls([['^', 'x', 2]]);
        expect(stateVariables[mathinput2Name].stateValues.value).eq('v');
        // expect(stateVariables[mathinput2Name].stateValues.submittedValue).eqls(['^', 'x', 2]);
        expect(stateVariables["/c/_answer1"].stateValues.creditAchieved).eq(1);
        expect((stateVariables["/c/_answer1"].stateValues.currentResponses)).eqls(['w']);
        expect((stateVariables["/c/_answer1"].stateValues.submittedResponses)).eqls([['^', 'x', 3]]);
        expect(stateVariables[mathinput3Name].stateValues.value).eq('w');
        // expect(stateVariables[mathinput3Name].stateValues.submittedValue).eqls(['^', 'x', 3]);
      });


      cy.log("Submit answers")
      cy.get(mathinput1SubmitAnchor).click();
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput3SubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinput1Anchor).should('have.value', 'u');
      // cy.get(mathinput2Anchor).should('have.value', 'v');
      // cy.get(mathinput3Anchor).should('have.value', 'w');

      cy.get("#\\/a\\/ca").should('have.text', '0');
      cy.get("#\\/b\\/ca").should('have.text', '0');
      cy.get("#\\/c\\/ca").should('have.text', '0');

      cy.get("#\\/a\\/sr .mjx-mrow").should('have.text', 'u')
      cy.get("#\\/b\\/sr .mjx-mrow").should('have.text', 'v')
      cy.get("#\\/c\\/sr .mjx-mrow").should('have.text', 'w')

      cy.get("#\\/a\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('u')
      });
      cy.get("#\\/b\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('v')
      });
      cy.get("#\\/c\\/cr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('w')
      });
      cy.get("#\\/a\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('u')
      });
      cy.get("#\\/b\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('v')
      });
      cy.get("#\\/c\\/sr").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('w')
      });

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/a/_answer1"].stateValues.creditAchieved).eq(0);
        expect((stateVariables["/a/_answer1"].stateValues.currentResponses)).eqls(['u']);
        expect((stateVariables["/a/_answer1"].stateValues.submittedResponses)).eqls(['u']);
        expect(stateVariables[mathinput1Name].stateValues.value).eq('u');
        // expect(stateVariables[mathinput1Name].stateValues.submittedValue).eq('u');
        expect(stateVariables["/b/_answer1"].stateValues.creditAchieved).eq(0);
        expect((stateVariables["/b/_answer1"].stateValues.currentResponses)).eqls(['v']);
        expect((stateVariables["/b/_answer1"].stateValues.submittedResponses)).eqls(['v']);
        expect(stateVariables[mathinput2Name].stateValues.value).eq('v');
        // expect(stateVariables[mathinput2Name].stateValues.submittedValue).eq('v');
        expect(stateVariables["/c/_answer1"].stateValues.creditAchieved).eq(0);
        expect((stateVariables["/c/_answer1"].stateValues.currentResponses)).eqls(['w']);
        expect((stateVariables["/c/_answer1"].stateValues.submittedResponses)).eqls(['w']);
        expect(stateVariables[mathinput3Name].stateValues.value).eq('w');
        // expect(stateVariables[mathinput3Name].stateValues.submittedValue).eq('w');
      });
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
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
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
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
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
    cy.get('#\\/_mathinput1 textarea').type(`{ctrl+home}{shift+end}{backspace}x`, { force: true }).blur();
    cy.get('#\\/_mathinput2 textarea').type(`{ctrl+home}{shift+end}{backspace}3-x`, { force: true }).blur();
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
  <choiceinput inline shuffleOrder>
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
      let stateVariables = await win.returnAllStateVariables1();

      for (let [ind, val] of stateVariables['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([]);

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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
    });

  });

  it('answer with inline choiceinput, specify component type for submitted', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>The animal is a <answer>
  <choiceinput inline shuffleOrder>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>.</p>
  <p>Current response: <text name="cr"><copy prop="currentResponse" target="_answer1" /></text></p>
  <p>Submitted response: <text name="sr"><copy prop="submittedResponse" target="_answer1" createComponentOfType="text" /></text></p>
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
      let stateVariables = await win.returnAllStateVariables1();

      for (let [ind, val] of stateVariables['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([]);

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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
  <p>Submitted response: <text name="sr"><copy prop="submittedResponse" target="_answer1" createComponentOfType="text" /></text></p>
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
      let stateVariables = await win.returnAllStateVariables1();

      for (let [ind, val] of stateVariables['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        expect(indexByName[val]).eq(ind + 1);
      }

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([]);

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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();

      for (let [ind, val] of stateVariables['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        expect(indexByName[val]).eq(ind + 1);
      }

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([]);

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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(2 / 3);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(2 / 3);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1 / 3);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
    });


  });

  it('answer with block choiceinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>The animal is a:</p>
  <answer>
  <choiceinput shuffleOrder>
    <choice credit="0.5">cat</choice>
    <choice credit="1">dog</choice>
    <choice>monkey</choice>
  </choiceinput>
  </answer>
  <p>Current response: <text name="cr"><copy prop="currentResponse" target="_answer1" /></text></p>
  <p>Submitted response: <text name="sr"><copy prop="submittedResponse" target="_answer1" createComponentOfType="text" /></text></p>
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
      let stateVariables = await win.returnAllStateVariables1();

      for (let [ind, val] of stateVariables['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        indexByName[val] = ind + 1;
      }

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([]);

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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"]]);
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
      let stateVariables = await win.returnAllStateVariables1();

      for (let [ind, val] of stateVariables['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        expect(indexByName[val]).eq(ind + 1);
      }

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([]);

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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();

      for (let [ind, val] of stateVariables['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        expect(indexByName[val]).eq(ind + 1);
      }

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([]);

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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(2 / 3);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(2 / 3);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1 / 3);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
    });


  });

  it('answer with select-multiple block choiceinput, fixedorder, match partial in answer', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>The animal is a <answer matchPartial>
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
      let stateVariables = await win.returnAllStateVariables1();

      for (let [ind, val] of stateVariables['/_choiceinput1'].stateValues.choiceTexts.entries()) {
        expect(indexByName[val]).eq(ind + 1);
      }

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls([]);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([]);

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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls([]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0.5);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(2 / 3);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["cat", "dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["cat"], indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(2 / 3);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['cat', 'dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1 / 3);
      expect(stateVariables['/_answer1'].stateValues.currentResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_answer1'].stateValues.submittedResponses).eqls(['dog', 'monkey']);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(["dog", "monkey"]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([indexByName["dog"], indexByName["monkey"]]);
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
    <choiceinput shuffleOrder>
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_choiceinput1'].stateValues.choiceTexts.length).eq(3);
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

    cy.get('#\\/_choiceinput1 li:nth-of-type(4)').should('be.visible')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_choiceinput1'].stateValues.choiceTexts.length).eq(4);
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

    cy.get('#\\/_choiceinput1 li:nth-of-type(4)').should('not.exist')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_choiceinput1'].stateValues.choiceTexts.length).eq(3);
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

    cy.get('#\\/_choiceinput1 li:nth-of-type(6)').should('be.visible')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_choiceinput1'].stateValues.choiceTexts.length).eq(6);
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
      let stateVariables = await win.returnAllStateVariables1();
      let choiceinputName = cesc(stateVariables['/_answer1'].stateValues.inputChildren[0].componentName);
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
        <choiceinput shuffleOrder>
        <choice credit="0.5">cat</choice>
        <choice credit="1">dog</choice>
        <choice>monkey</choice>
        </choiceinput>
      </answer>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceinputName = cesc(stateVariables['/_answer1'].stateValues.inputChildren[0].componentName);
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
      cy.get(`${choiceinputAnchor} option:nth-of-type(3)`).should('be.visible')
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
      cy.get(`${choiceinputAnchor} li:nth-of-type(3)`).should('be.visible')
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
      cy.get(`${choiceinputAnchor} option:nth-of-type(3)`).should('be.visible')
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
  <answer name='userx'>
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
    cy.get("#\\/userx_input textarea").type("{end}{backspace}c,d", { force: true });
    cy.get('#\\/userx_input_submit').click();
    cy.get('#\\/userx_input_incorrect').should('be.visible');

    cy.log("Enter another letter")
    cy.get("#\\/userx_input textarea").type("{ctrl+home}{shift+end}{backspace}q", { force: true });
    cy.get('#\\/userx_input_submit').click();
    cy.get('#\\/userx_input_correct').should('be.visible');

    cy.log("Enter a number")
    cy.get("#\\/userx_input textarea").type("{end}{backspace}1", { force: true });
    cy.get('#\\/userx_input_submit').click();
    cy.get('#\\/userx_input_incorrect').should('be.visible');
  });

  it('answer element of user defined set', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>Enter a set <mathinput name="set" prefill="{1,2,3}" /></p>
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
    cy.get("#\\/element textarea").type("{end}{backspace}1,2,3", { force: true });
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Enter a letter")
    cy.get("#\\/element textarea").type("{ctrl+home}{shift+end}{backspace}c", { force: true });
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Change set to letters")
    cy.get("#\\/set textarea").type("{end}{leftarrow}{backspace}{backspace}{backspace}{backspace}{backspace}a,b,c,d,e,f,g", { force: true });
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter another letter")
    cy.get("#\\/element textarea").type("{end}{backspace}g", { force: true });
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter a number")
    cy.get("#\\/element textarea").type("{end}{backspace}2", { force: true });
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Change set to mathematical expressions")
    cy.get("#\\/set textarea").type("{end}{leftarrow}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(x+y)/2{rightarrow}, e^(x^2{rightarrow} + y){rightArrow}, (1,2,3)", { force: true });
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_incorrect').should('be.visible');

    cy.log("Enter one of the expressions")
    cy.get("#\\/element textarea").type("{end}{backspace}(1,2,3)", { force: true });
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter another of the expressions")
    cy.get("#\\/element textarea").type("{ctrl+home}{shift+end}{backspace}e^(x^2{rightarrow} + y)", { force: true });
    cy.get('#\\/element_submit').click();
    cy.get('#\\/element_correct').should('be.visible');

    cy.log("Enter third expression")
    cy.get("#\\/element textarea").type("{ctrl+home}{shift+end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}x+2y-x/2{rightarrow}-3y/2", { force: true });
    cy.get('#\\/element_submit').click();
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
        
        <p>Your current math answer is <copy assignNames="cr1" prop="currentResponse" target="a" createComponentOfType="math" /></p>
        <p>Your current text answer is <copy assignNames="cr2" prop="currentResponse2" target="a" createComponentOfType="text" /></p>
        <p>Your submitted math answer is <copy assignNames="sr1" prop="submittedResponse" target="a" createComponentOfType="math" /></p>
        <p>Your submitted text answer is <copy assignNames="sr2" prop="submittedResponse2" target="a" createComponentOfType="text" /></p>
        <p>Credit for your answers <copy assignNames="ca" prop="creditAchieved" target="a" /></p>
 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/cr2`).should('have.text', '')
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr2`).should('have.text', '')
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.get("#\\/_mathinput1 textarea").type("2{enter}", { force: true });
    cy.get(`#\\/cr1 .mjx-mrow`).should("have.text", '2')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/cr2`).should('have.text', '')
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr2`).should('have.text', '')
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.get('#\\/a_submit').click();

    cy.get(`#\\/sr1 .mjx-mrow`).should("have.text", '2')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/cr2`).should('have.text', '')
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/sr2`).should('have.text', '')
    cy.get(`#\\/ca`).should('have.text', '0.5')

    cy.get('#\\/_textinput1_input').clear().type(`hello{enter}`);
    cy.get(`#\\/cr2`).should('have.text', 'hello')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/sr2`).should('have.text', '')
    cy.get(`#\\/ca`).should('have.text', '0.5')

    cy.get('#\\/a_submit').click();
    cy.get(`#\\/sr2`).should('have.text', 'hello')
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/cr2`).should('have.text', 'hello')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}0{enter}", { force: true });
    cy.get(`#\\/cr1 .mjx-mrow`).should("have.text", '0')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get(`#\\/cr2`).should('have.text', 'hello')
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/sr2`).should('have.text', 'hello')
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.get('#\\/a_submit').click();
    cy.get(`#\\/sr1 .mjx-mrow`).should("have.text", '0')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get(`#\\/cr2`).should('have.text', 'hello')
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get(`#\\/sr2`).should('have.text', 'hello')
    cy.get(`#\\/ca`).should('have.text', '0.5')

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
        
        <p>Your current math answer is <copy assignNames="cr1" prop="currentResponse" target="a" createComponentOfType="math" /></p>
        <p>Your current text answer is <copy assignNames="cr2" prop="currentResponse2" target="a" createComponentOfType="text" /></p>
        <p>Your submitted math answer is <copy assignNames="sr1" prop="submittedResponse" target="a" createComponentOfType="math" /></p>
        <p>Your submitted text answer is <copy assignNames="sr2" prop="submittedResponse2" target="a" createComponentOfType="text" /></p>
        <p>Credit for your answers <copy assignNames="ca" prop="creditAchieved" target="a" /></p>
 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/cr2`).should('have.text', '')
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr2`).should('have.text', '')
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.get("#\\/_mathinput1 textarea").type("2{enter}", { force: true });
    cy.get(`#\\/cr1 .mjx-mrow`).should("have.text", '2')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/cr2`).should('have.text', '')
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr2`).should('have.text', '')
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.get('#\\/a_submit').click();

    cy.get(`#\\/sr1 .mjx-mrow`).should("have.text", '2')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/cr2`).should('have.text', '')
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/sr2`).should('have.text', '')
    cy.get(`#\\/ca`).should('have.text', '0.5')

    cy.get('#\\/_textinput1_input').clear().type(`hello{enter}`);
    cy.get(`#\\/cr2`).should('have.text', 'hello')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/sr2`).should('have.text', '')
    cy.get(`#\\/ca`).should('have.text', '0.5')

    cy.get('#\\/a_submit').click();
    cy.get(`#\\/sr2`).should('have.text', 'hello')
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/cr2`).should('have.text', 'hello')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}0{enter}", { force: true });
    cy.get(`#\\/cr1 .mjx-mrow`).should("have.text", '0')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get(`#\\/cr2`).should('have.text', 'hello')
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get(`#\\/sr2`).should('have.text', 'hello')
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.get('#\\/a_submit').click();
    cy.get(`#\\/sr1 .mjx-mrow`).should("have.text", '0')

    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get(`#\\/cr2`).should('have.text', 'hello')

    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get(`#\\/sr2`).should('have.text', 'hello')
    cy.get(`#\\/ca`).should('have.text', '0.5')

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
        
        <p>Your current answer: <copy assignNames="cr" prop="currentResponse" target="a" createComponentOfType="math" /></p>
        <p>Your submitted answer: <copy assignNames="sr" prop="submittedResponse" target="a" createComponentOfType="math" /></p>
        <p>Credit for your answer <copy assignNames="ca" prop="creditAchieved" target="a"/></p>
 `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.get('#\\/a_submit').click();

    cy.get(`#\\/sr .mjx-mrow`).should("have.text", '0')
    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get(`#\\/ca`).should('have.text', '0');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3, y: -3 }
      })

      cy.get(`#\\/cr .mjx-mrow`).should("have.text", '3')
      cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get(`#\\/ca`).should('have.text', '0')

      cy.get('#\\/a_submit').click();
      cy.get(`#\\/sr .mjx-mrow`).should("have.text", '3')
      cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(`#\\/ca`).should('have.text', '1');

      cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}4{enter}", { force: true });

      cy.get(`#\\/cr .mjx-mrow`).should("have.text", '3')
      cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(`#\\/ca`).should('have.text', '1')

      cy.get('#\\/a_submit').click();
      cy.get(`#\\/ca`).should('have.text', '0')

      cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });

    });


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: 9 }
      })


      cy.get(`#\\/cr .mjx-mrow`).should("have.text", '8')
      cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      });
      cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(`#\\/ca`).should('have.text', '0')

      cy.get('#\\/a_submit').click();
      cy.get(`#\\/sr .mjx-mrow`).should("have.text", '8')


      cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      });
      cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      });
      cy.get(`#\\/ca`).should('have.text', '1');

    });

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
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
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
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, { force: true });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.log("Symbols as unicode")
      cy.get(mathinputAnchor).type(`{end}{backspace}x+2π+3γ+4μ+5ξ+6η`, { force: true });
      cy.get(mathinputSubmitAnchor).click();
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
        
        <p>Current response <copy assignNames="cr" prop="currentResponses" target="a" createComponentOfType="math" /></p>
        <p>Submitted response <copy assignNames="sr" prop="submittedResponses" target="a" createComponentOfType="math" /></p>
        <p>Credit: <copy assignNames="ca" prop="creditAchieved" target="a" /></p>
 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a"].stateValues.nResponses).eq(1)
    });

    cy.get("#\\/min textarea").type("2{enter}", { force: true });
    cy.get('#\\/a_submit').click();

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/ca`).should('have.text', '0')


    cy.get("#\\/val textarea").type("3{enter}", { force: true });

    cy.get(`#\\/cr .mjx-mrow`).should("have.text", '3')
    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.get('#\\/a_submit').click();

    cy.get(`#\\/sr .mjx-mrow`).should("have.text", '3')
    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/ca`).should('have.text', '1')

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
        
        <p>Current responses <aslist><copy assignNames="cr1 cr2" prop="currentResponses" target="a" createComponentOfType="math" nComponents="2" /></aslist></p>
        <p>Submitted responses <aslist><copy assignNames="sr1 sr2" prop="submittedResponses" target="a" createComponentOfType="math" nComponents="2" /></aslist></p>
        <p>Credit: <copy assignNames="ca" prop="creditAchieved" target="a" /></p>
 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a"].stateValues.nResponses).eq(2)
    });

    cy.get('#\\/P textarea').type("(2,3){enter}", { force: true })
    cy.get('#\\/Q textarea').type("(3,4){enter}", { force: true })

    cy.get(`#\\/cr1 .mjx-mrow`).should("contain.text", '(2,3)')
    cy.get(`#\\/cr2 .mjx-mrow`).should("contain.text", '(3,4)')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,3)')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,4)')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.get('#\\/a_submit').click();

    cy.get(`#\\/sr1 .mjx-mrow`).should("contain.text", '(2,3)')
    cy.get(`#\\/sr2 .mjx-mrow`).should("contain.text", '(3,4)')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,3)')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,4)')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,3)')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,4)')
    });
    cy.get(`#\\/ca`).should('have.text', '1')


    cy.get('#\\/P textarea').type("{home}{rightArrow}{rightArrow}{backspace}5{enter}", { force: true })
    cy.get('#\\/Q textarea').type("{end}{leftArrow}{backspace}1{enter}", { force: true })

    cy.get(`#\\/cr1 .mjx-mrow`).should("contain.text", '(5,3)')
    cy.get(`#\\/cr2 .mjx-mrow`).should("contain.text", '(3,1)')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,3)')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,1)')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,3)')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,4)')
    });
    cy.get(`#\\/ca`).should('have.text', '1')

    cy.get('#\\/a_submit').click();

    cy.get(`#\\/sr1 .mjx-mrow`).should("contain.text", '(5,3)')
    cy.get(`#\\/sr2 .mjx-mrow`).should("contain.text", '(3,1)')
    cy.get(`#\\/cr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,3)')
    });
    cy.get(`#\\/cr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,1)')
    });
    cy.get(`#\\/sr1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,3)')
    });
    cy.get(`#\\/sr2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,1)')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

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
        
        <p>Current response: <copy assignNames="cr" prop="currentResponses" target="a" createComponentOfType="math" /></p>
        <p>Submitted response: <copy assignNames="sr" prop="submittedResponses" target="a" createComponentOfType="math" /></p>
        <p>Credit: <copy assignNames="ca" prop="creditAchieved" target="a" /></p>
 `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    let submitAnchor = cesc('#/a_submit');
    let correctAnchor = cesc('#/a_correct');
    let incorrectAnchor = cesc('#/a_incorrect');

    cy.get(submitAnchor).should('be.visible');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/ca`).should('have.text', '0')


    cy.get("#\\/val textarea").type("3{enter}", { force: true });

    cy.get(submitAnchor).should('be.visible');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');

    cy.get(`#\\/cr .mjx-mrow`).should("contain.text", '3')

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.get('#\\/a_submit').click();

    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');


    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/ca`).should('have.text', '0')


    cy.get("#\\/val textarea").type("{end}{backspace}4", { force: true });

    cy.get(submitAnchor).should('be.visible');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.get("#\\/val textarea").type("{end}{backspace}3", { force: true });

    cy.get(submitAnchor).should('be.visible');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/ca`).should('have.text', '0')


    cy.get('#\\/a_submit').click();
    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('be.visible');

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.get("#\\/val textarea").type("{end}{backspace}5", { force: true });

    cy.get(submitAnchor).should('be.visible');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/ca`).should('have.text', '0')

    cy.get("#\\/val textarea").blur();

    cy.get(submitAnchor).should('be.visible');
    cy.get(correctAnchor).should('not.exist');
    cy.get(incorrectAnchor).should('not.exist');

    cy.get(`#\\/cr .mjx-mrow`).should('have.text', '5')
    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get(`#\\/ca`).should('have.text', '0')


    cy.get('#\\/a_submit').click();
    cy.get(submitAnchor).should('not.exist');
    cy.get(correctAnchor).should('be.visible');
    cy.get(incorrectAnchor).should('not.exist');

    cy.get(`#\\/cr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get(`#\\/sr`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    });
    cy.get(`#\\/ca`).should('have.text', '1')

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
            <choiceinput shuffleOrder>
            <choice credit="$animal=cat" >meow</choice>
            <choice credit="$animal=dog" >woof</choice>
            <choice credit="$animal=mouse" >squeak</choice>
            <choice credit="$animal=fish" >blub</choice>
            </choiceinput>
          </answer>
        </p>
        `,
          requestedVariantIndex: ind,
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
          requestedVariantIndex: ind,
        }, "*");
      });


      cy.get('#\\/_text1').should('have.text', `${ind}`);  // to wait until loaded

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let textinputName = stateVariables['/ans'].stateValues.inputChildren[0].componentName
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

        <p>Current responses: <aslist><copy prop="currentResponses" target="a" createComponentOfType="math" nComponents="2" assignNames="cr1 cr2" /></aslist></p>
        <p>Submitted response: <aslist><copy prop="submittedResponses" target="a" createComponentOfType="math" nComponents="2" assignNames="sr1 sr2" /></aslist></p>
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_answer1"].stateValues.nSubmissions).eq(0);
      expect(stateVariables["/nsubs1"].stateValues.value).eq(0);
      expect(stateVariables["/_answer2"].stateValues.nSubmissions).eq(0);
      expect(stateVariables["/nsubs2"].stateValues.value).eq(0);

      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      let textinputName = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + "_input");
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.get(mathinputAnchor).type("x+y{enter}", { force: true });


      cy.get('#\\/nsubs1').should('have.text', 1)
      cy.get('#\\/nsubs2').should('have.text', 0)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.nSubmissions).eq(1);
        expect(stateVariables["/nsubs1"].stateValues.value).eq(1);
        expect(stateVariables["/_answer2"].stateValues.nSubmissions).eq(0);
        expect(stateVariables["/nsubs2"].stateValues.value).eq(0);
      })

      cy.get(mathinputAnchor).type("{end}{backspace}{backspace}", { force: true });

      cy.get('#\\/nsubs1').should('have.text', 1)
      cy.get('#\\/nsubs2').should('have.text', 0)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.nSubmissions).eq(1);
        expect(stateVariables["/nsubs1"].stateValues.value).eq(1);
        expect(stateVariables["/_answer2"].stateValues.nSubmissions).eq(0);
        expect(stateVariables["/nsubs2"].stateValues.value).eq(0);
      })

      cy.get(textinputAnchor).type("h").blur();
      cy.get('#\\/nsubs1').should('have.text', 1)
      cy.get('#\\/nsubs2').should('have.text', 0)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.nSubmissions).eq(1);
        expect(stateVariables["/nsubs1"].stateValues.value).eq(1);
        expect(stateVariables["/_answer2"].stateValues.nSubmissions).eq(0);
        expect(stateVariables["/nsubs2"].stateValues.value).eq(0);
      })


      cy.get(mathinputSubmitAnchor).click()

      cy.get('#\\/nsubs1').should('have.text', 2)
      cy.get('#\\/nsubs2').should('have.text', 0)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.nSubmissions).eq(2);
        expect(stateVariables["/nsubs1"].stateValues.value).eq(2);
        expect(stateVariables["/_answer2"].stateValues.nSubmissions).eq(0);
        expect(stateVariables["/nsubs2"].stateValues.value).eq(0);
      })

      cy.get(textinputSubmitAnchor).click()

      cy.get('#\\/nsubs1').should('have.text', 2)
      cy.get('#\\/nsubs2').should('have.text', 1)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.nSubmissions).eq(2);
        expect(stateVariables["/nsubs1"].stateValues.value).eq(2);
        expect(stateVariables["/_answer2"].stateValues.nSubmissions).eq(1);
        expect(stateVariables["/nsubs2"].stateValues.value).eq(1);
      })


      cy.get(textinputAnchor).clear().type("hello").blur();
      cy.get(mathinputAnchor).type("{end}+y", { force: true }).blur();

      cy.get('#\\/nsubs1').should('have.text', 2)
      cy.get('#\\/nsubs2').should('have.text', 1)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.nSubmissions).eq(2);
        expect(stateVariables["/nsubs1"].stateValues.value).eq(2);
        expect(stateVariables["/_answer2"].stateValues.nSubmissions).eq(1);
        expect(stateVariables["/nsubs2"].stateValues.value).eq(1);
      })


      cy.get(mathinputSubmitAnchor).click()
      cy.get('#\\/nsubs1').should('have.text', 3)
      cy.get('#\\/nsubs2').should('have.text', 1)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.nSubmissions).eq(3);
        expect(stateVariables["/nsubs1"].stateValues.value).eq(3);
        expect(stateVariables["/_answer2"].stateValues.nSubmissions).eq(1);
        expect(stateVariables["/nsubs2"].stateValues.value).eq(1);
      })

      cy.get(textinputSubmitAnchor).click()
      cy.get('#\\/nsubs1').should('have.text', 3)
      cy.get('#\\/nsubs2').should('have.text', 2)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.nSubmissions).eq(3);
        expect(stateVariables["/nsubs1"].stateValues.value).eq(3);
        expect(stateVariables["/_answer2"].stateValues.nSubmissions).eq(2);
        expect(stateVariables["/nsubs2"].stateValues.value).eq(2);
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
      let stateVariables = await win.returnAllStateVariables1();

      let inputNames = [...Array(20).keys()].map(n => stateVariables[`/_answer${n + 1}`].stateValues.inputChildren[0].componentName);

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
      cy.get(cesc('#' + inputNames[0]) + " textarea").type('{end}{backspace}y', { force: true })
      cy.get(cesc('#' + inputNames[1]) + " textarea").type('{end}{backspace}y', { force: true })
      cy.get(cesc('#' + inputNames[2]) + " textarea").type('{end}{backspace}y', { force: true })
      cy.get(cesc('#' + inputNames[3]) + " textarea").type('{end}{backspace}y', { force: true })
      cy.get(cesc('#' + inputNames[0]) + "_submit").click();
      cy.get(cesc('#' + inputNames[1]) + "_submit").click();
      cy.get(cesc("#/_answer3_submit")).click();
      cy.get(cesc("#/_answer4_submit")).click();
      cy.get(cesc('#' + inputNames[0]) + "_incorrect").should('be.visible');
      cy.get(cesc('#' + inputNames[1]) + "_incorrect").should('be.visible');
      cy.get(cesc("#/_answer3_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer4_incorrect")).should('be.visible');

      cy.get(cesc('#' + inputNames[4]) + "_input").clear().type('bye')
      cy.get(cesc('#' + inputNames[5]) + "_input").clear().type('bye')
      cy.get(cesc('#' + inputNames[6]) + "_input").clear().type('bye')
      cy.get(cesc('#' + inputNames[7]) + "_input").clear().type('bye')
      cy.get(cesc('#' + inputNames[4]) + "_submit").click();
      cy.get(cesc('#' + inputNames[5]) + "_submit").click();
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
      cy.get(cesc('#' + inputNames[0]) + " textarea").type('{end}{backspace}x', { force: true })
      cy.get(cesc('#' + inputNames[1]) + " textarea").type('{end}{backspace}x', { force: true })
      cy.get(cesc('#' + inputNames[2]) + " textarea").type('{end}{backspace}x', { force: true })
      cy.get(cesc('#' + inputNames[3]) + " textarea").type('{end}{backspace}x', { force: true })
      cy.get(cesc('#' + inputNames[0]) + "_submit").click();
      cy.get(cesc("#/_answer3_submit")).click();
      cy.get(cesc('#' + inputNames[0]) + "_correct").should('be.visible');
      cy.get(cesc('#' + inputNames[1]) + "_incorrect").should('be.visible');
      cy.get(cesc("#/_answer3_correct")).should('be.visible');
      cy.get(cesc("#/_answer4_incorrect")).should('be.visible');

      cy.get(cesc('#' + inputNames[4]) + "_input").clear().type('hello')
      cy.get(cesc('#' + inputNames[5]) + "_input").should('be.disabled');
      cy.get(cesc('#' + inputNames[6]) + "_input").clear().type('hello')
      cy.get(cesc('#' + inputNames[7]) + "_input").should('be.disabled');
      cy.get(cesc('#' + inputNames[4]) + "_submit").click();
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
      let stateVariables = await win.returnAllStateVariables1();

      let inputNames = [...Array(20).keys()].map(n => stateVariables[`/_answer${n + 1}`].stateValues.inputChildren[0].componentName);

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
      cy.get(cesc('#' + inputNames[0]) + " textarea").type('{end}{backspace}x', { force: true })
      cy.get(cesc('#' + inputNames[1]) + " textarea").type('{end}{backspace}x', { force: true })
      cy.get(cesc('#' + inputNames[2]) + " textarea").type('{end}{backspace}x', { force: true })
      cy.get(cesc('#' + inputNames[3]) + " textarea").type('{end}{backspace}x', { force: true })
      cy.get(cesc('#' + inputNames[0]) + "_submit").click();
      cy.get(cesc('#' + inputNames[1]) + "_submit").click();
      cy.get(cesc("#/_answer3_submit")).click();
      cy.get(cesc("#/_answer4_submit")).click();
      cy.get(cesc('#' + inputNames[0]) + "_correct").should('be.visible');
      cy.get(cesc('#' + inputNames[1]) + "_correct").should('be.visible');
      cy.get(cesc("#/_answer3_correct")).should('be.visible');
      cy.get(cesc("#/_answer4_correct")).should('be.visible');

      cy.get(cesc('#' + inputNames[4]) + "_input").clear().type('hello')
      cy.get(cesc('#' + inputNames[5]) + "_input").clear().type('hello')
      cy.get(cesc('#' + inputNames[6]) + "_input").clear().type('hello')
      cy.get(cesc('#' + inputNames[7]) + "_input").clear().type('hello')
      cy.get(cesc('#' + inputNames[4]) + "_submit").click();
      cy.get(cesc('#' + inputNames[5]) + "_submit").click();
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
      cy.get(cesc('#' + inputNames[0]) + " textarea").type('{end}{backspace}y', { force: true })
      cy.get(cesc('#' + inputNames[1]) + " textarea").type('{end}{backspace}y', { force: true })
      cy.get(cesc('#' + inputNames[2]) + " textarea").type('{end}{backspace}y', { force: true })
      cy.get(cesc('#' + inputNames[3]) + " textarea").type('{end}{backspace}y', { force: true })
      cy.get(cesc('#' + inputNames[0]) + "_submit").click();
      cy.get(cesc("#/_answer3_submit")).click();
      cy.get(cesc('#' + inputNames[0]) + "_incorrect").should('be.visible');
      cy.get(cesc('#' + inputNames[1]) + "_correct").should('be.visible');
      cy.get(cesc("#/_answer3_incorrect")).should('be.visible');
      cy.get(cesc("#/_answer4_correct")).should('be.visible');

      cy.get(cesc('#' + inputNames[4]) + "_input").clear().type('bye')
      cy.get(cesc('#' + inputNames[5]) + "_input").should('be.disabled');
      cy.get(cesc('#' + inputNames[6]) + "_input").clear().type('bye')
      cy.get(cesc('#' + inputNames[7]) + "_input").should('be.disabled');
      cy.get(cesc('#' + inputNames[4]) + "_submit").click();
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
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 3, y: 4 }
      })
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
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -5, y: 6 }
      })
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
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 1, y: -1 }
      })
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
      let stateVariables = await win.returnAllStateVariables1();
      let mathinput1Name = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let mathinput1SubmitAnchor = cesc('#' + mathinput1Name + '_submit');
      let mathinput1CorrectAnchor = cesc('#' + mathinput1Name + '_correct');
      let mathinput1IncorrectAnchor = cesc('#' + mathinput1Name + '_incorrect');

      let mathinput2Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.value).eqls("xyz");
      expect(stateVariables["/mi"].stateValues.value).eqls("xyz");
    })

    cy.get('#\\/split_input').click();

    // modify textinput so that recalculates value
    cy.get('#\\/mi textarea').type("{end}a{backspace}", { force: true })
    cy.get('#\\/mi_submit').click();
    cy.get('#\\/mi_correct').should('be.visible')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables["/mi"].stateValues.value).eqls(["*", "x", "y", "z"]);
    })


    cy.get('#\\/split_input').click();

    // modify textinput so that recalculates value
    cy.get('#\\/mi textarea').type("{end}b{backspace}", { force: true })
    cy.get('#\\/mi_submit').click();

    cy.get('#\\/mi_correct').should('be.visible')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.value).eqls("xyz");
      expect(stateVariables["/mi"].stateValues.value).eqls("xyz");
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

  it('cannot change submitted or changed response', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <answer name="a"><mathinput name="mia" />x</answer>

  <p>Current Response: <copy target="a" prop="currentResponse" assignNames="cr" /></p>
  <p>Submitted Response: <copy target="a" prop="submittedResponse" assignNames="sr" /></p>
  
  <p>Change current response: <mathinput bindValueTo="$(a{prop='currentResponse'})" name="micr" /></p>
  <p>Change submitted response: <mathinput bindValueTo="$(a{prop='submittedResponse'})" name="misr"  /></p>
   `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/cr .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('\uff3f')
    })
    cy.get('#\\/sr').should('not.exist');

    cy.log('cannot change from mathinputs')
    cy.get('#\\/micr textarea').type("y{enter}", { force: true })
    cy.get('#\\/misr textarea').type("z{enter}", { force: true })

    cy.get('#\\/cr .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('\uff3f')
    })
    cy.get('#\\/sr').should('not.exist');


    cy.log('submit response')
    cy.get('#\\/mia textarea').type("x{enter}", { force: true })
    cy.get('#\\/cr .mjx-mrow').should('have.text', 'x')
    cy.get('#\\/cr .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('x')
    })
    cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('x')
    })


    cy.log('cannot change from mathinputs')
    cy.get('#\\/micr textarea').type("{end}{backspace}y{enter}", { force: true })
    cy.get('#\\/misr textarea').type("{end}{backspace}z{enter}", { force: true })

    cy.get('#\\/cr .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('x')
    })
    cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('x')
    })

  });

  it('answer award with sugared string, copy award and overwrite properties', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer name="an">
    <award name="aw">1.1</award>
    <copy target="aw" credit="0.5" allowedErrorInNumbers="0.001" />
  </answer></p>
  <p>Number of responses: <copy prop="nResponses" target="an" assignNames="nr" /></p>
  <p>Submitted response: <copy prop="submittedResponses" target="an" assignNames="sr" /></p>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/nr').should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/an'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');
      let mathinputPartialAnchor = cesc('#' + mathinputName + '_partial');


      cy.get(mathinputAnchor).type("1.1{enter}", { force: true })
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');
      cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('1.1')
      })

      cy.get(mathinputAnchor).type("{end}1", { force: true })
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinputPartialAnchor).should('not.exist');
      cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('1.11')
      })
      cy.get(mathinputAnchor).type("{end}{leftArrow}0", { force: true })
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('1.101')
      })
    })
  });

  it('answer award with full award, copy award and overwrite properties', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer name="an">
    <mathinput name="mi" />
    <award name="aw"><when>$mi=1.1</when></award>
    <copy target="aw" credit="0.5" allowedErrorInNumbers="0.001" />
  </answer></p>
  <p>Number of responses: <copy prop="nResponses" target="an" assignNames="nr" /></p>
  <p>Submitted response: <copy prop="submittedResponses" target="an" assignNames="sr" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/nr').should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/an'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');
      let mathinputPartialAnchor = cesc('#' + mathinputName + '_partial');


      cy.get(mathinputAnchor).type("1.1{enter}", { force: true })
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');
      cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('1.1')
      })

      cy.get(mathinputAnchor).type("{end}1", { force: true })
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinputPartialAnchor).should('not.exist');
      cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('1.11')
      })

      cy.get(mathinputAnchor).type("{end}{leftArrow}0", { force: true })
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');
      cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('1.101')
      })

    })
  });

  it('answer award with full award and outside input, copy award and overwrite properties', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>
  <mathinput name="mi" />
  <answer name="an">
    <award name="aw" targetsAreResponses="mi"><when>$mi=1.1</when></award>
    <copy target="aw" credit="0.5" allowedErrorInNumbers="0.001" />
  </answer></p>
  <p>Number of responses: <copy prop="nResponses" target="an" assignNames="nr" /></p>
  <p>Submitted response: <copy prop="submittedResponses" target="an" assignNames="sr" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/nr').should('have.text', '1')


    cy.get("#\\/mi textarea").type("1.1{enter}", { force: true })
    cy.get("#\\/an_submit").click();
    cy.get("#\\/an_correct").should('be.visible');
    cy.get("#\\/an_incorrect").should('not.exist');
    cy.get("#\\/an_partial").should('not.exist');
    cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('1.1')
    })

    cy.get("#\\/mi textarea").type("{end}1{enter}", { force: true })
    cy.get("#\\/an_submit").click();
    cy.get("#\\/an_correct").should('not.exist');
    cy.get("#\\/an_incorrect").should('be.visible');
    cy.get("#\\/an_partial").should('not.exist');
    cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('1.11')
    })

    cy.get("#\\/mi textarea").type("{end}{leftArrow}0{enter}", { force: true })
    cy.get("#\\/an_submit").click();
    cy.get("#\\/an_correct").should('not.exist');
    cy.get("#\\/an_incorrect").should('not.exist');
    cy.get("#\\/an_partial").should('have.text', '50% Correct');
    cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('1.101')
    })

  });

  it('copied answer mirrors original', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer name="ans1">x+y</answer></p>
  <p>Current response: <copy prop="currentResponse" target="ans1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="ans1" createComponentOfType='math' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="ans1" assignNames="ca1" /></p>

  <p><copy target="ans1" assignNames="ans2" /></p>
  <p>Current response: <copy prop="currentResponse" target="ans2" assignNames="cr2" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="ans2" createComponentOfType='math' assignNames="sr2" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="ans2" assignNames="ca2" /></p>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinput1Name = stateVariables['/ans1'].stateValues.inputChildren[0].componentName
      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let mathinput1SubmitAnchor = cesc('#' + mathinput1Name + '_submit');
      let mathinput1CorrectAnchor = cesc('#' + mathinput1Name + '_correct');
      let mathinput1IncorrectAnchor = cesc('#' + mathinput1Name + '_incorrect');

      let mathinput2Name = stateVariables['/ans2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc('#' + mathinput2Name + '_correct');
      let mathinput2IncorrectAnchor = cesc('#' + mathinput2Name + '_incorrect');


      cy.get(mathinput1SubmitAnchor).should('be.visible')
      cy.get(mathinput2SubmitAnchor).should('be.visible')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca1').should('have.text', '0')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca2').should('have.text', '0')


      cy.log('Type correct answer in first blank')

      cy.get(mathinput1Anchor).type('x+y', { force: true }).blur();

      cy.get(mathinput1SubmitAnchor).should('be.visible')
      cy.get(mathinput2SubmitAnchor).should('be.visible')
      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr2 .mjx-mrow').should('have.text', 'x+y')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca1').should('have.text', '0')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca2').should('have.text', '0')


      cy.log('Click second submit button')

      cy.get(mathinput2SubmitAnchor).click();

      cy.get(mathinput1CorrectAnchor).should('be.visible')
      cy.get(mathinput2CorrectAnchor).should('be.visible')

      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/sr2 .mjx-mrow').should('have.text', 'x+y')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca1').should('have.text', '1')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca2').should('have.text', '1')


      cy.log('type incorrect answer into second blank')

      cy.get(mathinput2Anchor).type('{end}{backspace}{backspace}', { force: true }).blur();

      cy.get(mathinput1SubmitAnchor).should('be.visible')
      cy.get(mathinput2SubmitAnchor).should('be.visible')

      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/cr2 .mjx-mrow').should('have.text', 'x')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca1').should('have.text', '1')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca2').should('have.text', '1')


      cy.log('Click first submit button')

      cy.get(mathinput1SubmitAnchor).click();

      cy.get(mathinput1IncorrectAnchor).should('be.visible')
      cy.get(mathinput2IncorrectAnchor).should('be.visible')

      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')
      cy.get('#\\/sr2 .mjx-mrow').should('have.text', 'x')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/ca1').should('have.text', '0')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/ca2').should('have.text', '0')


    })
  });

  it('copy answer with no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer name="ans1">x+y</answer></p>
  <p>Current response: <copy prop="currentResponse" target="ans1" assignNames="cr1" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="ans1" createComponentOfType='math' assignNames="sr1" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="ans1" assignNames="ca1" /></p>

  <p><copy target="ans1" assignNames="ans2" link='false' /></p>
  <p>Current response: <copy prop="currentResponse" target="ans2" assignNames="cr2" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="ans2" createComponentOfType='math' assignNames="sr2" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="ans2" assignNames="ca2" /></p>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinput1Name = stateVariables['/ans1'].stateValues.inputChildren[0].componentName
      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let mathinput1SubmitAnchor = cesc('#' + mathinput1Name + '_submit');
      let mathinput1CorrectAnchor = cesc('#' + mathinput1Name + '_correct');
      let mathinput1IncorrectAnchor = cesc('#' + mathinput1Name + '_incorrect');

      let mathinput2Name = stateVariables['/ans2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc('#' + mathinput2Name + '_submit');
      let mathinput2CorrectAnchor = cesc('#' + mathinput2Name + '_correct');
      let mathinput2IncorrectAnchor = cesc('#' + mathinput2Name + '_incorrect');


      cy.get(mathinput1SubmitAnchor).should('be.visible')
      cy.get(mathinput2SubmitAnchor).should('be.visible')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca1').should('have.text', '0')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca2').should('have.text', '0')


      cy.log('Type correct answer in first blank')

      cy.get(mathinput1Anchor).type('x+y', { force: true }).blur();

      cy.get(mathinput1SubmitAnchor).should('be.visible')
      cy.get(mathinput2SubmitAnchor).should('be.visible')

      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x+y')
      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca1').should('have.text', '0')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca2').should('have.text', '0')


      cy.log('Click first submit button')

      cy.get(mathinput1SubmitAnchor).click();

      cy.get(mathinput1CorrectAnchor).should('be.visible')
      cy.get(mathinput2SubmitAnchor).should('be.visible')

      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x+y')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca1').should('have.text', '1')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca2').should('have.text', '0')


      cy.log('type correct answer into second blank')

      cy.get(mathinput2Anchor).type('x+y', { force: true }).blur();

      cy.get(mathinput1CorrectAnchor).should('be.visible')
      cy.get(mathinput2SubmitAnchor).should('be.visible')

      cy.get('#\\/cr2 .mjx-mrow').should('have.text', 'x+y')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca1').should('have.text', '1')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca2').should('have.text', '0')


      cy.log('Click second submit button')

      cy.get(mathinput2SubmitAnchor).click();

      cy.get(mathinput1CorrectAnchor).should('be.visible')
      cy.get(mathinput2CorrectAnchor).should('be.visible')

      cy.get('#\\/sr2 .mjx-mrow').should('have.text', 'x+y')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca1').should('have.text', '1')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca2').should('have.text', '1')


      cy.log('type incorrect answer into second blank')

      cy.get(mathinput2Anchor).type('{end}{backspace}{backspace}', { force: true }).blur();

      cy.get(mathinput1CorrectAnchor).should('be.visible')
      cy.get(mathinput2SubmitAnchor).should('be.visible')

      cy.get('#\\/cr2 .mjx-mrow').should('have.text', 'x')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca1').should('have.text', '1')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca2').should('have.text', '1')



      cy.log('press enter in second blank')

      cy.get(mathinput2Anchor).type('{enter}', { force: true });

      cy.get(mathinput1CorrectAnchor).should('be.visible')
      cy.get(mathinput2IncorrectAnchor).should('be.visible')

      cy.get('#\\/sr2 .mjx-mrow').should('have.text', 'x')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca1').should('have.text', '1')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/ca2').should('have.text', '0')


      cy.log('type incorrect answer into first blank')


      cy.get(mathinput1Anchor).type('{end}{backspace}{backspace}', { force: true }).blur();

      cy.get(mathinput1SubmitAnchor).should('be.visible')
      cy.get(mathinput2IncorrectAnchor).should('be.visible')

      cy.get('#\\/cr1 .mjx-mrow').should('have.text', 'x')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x+y')
      })
      cy.get('#\\/ca1').should('have.text', '1')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/ca2').should('have.text', '0')


      cy.log('press enter in first blank')

      cy.get(mathinput1Anchor).type('{enter}', { force: true });

      cy.get(mathinput1IncorrectAnchor).should('be.visible')
      cy.get(mathinput2IncorrectAnchor).should('be.visible')

      cy.get('#\\/sr1 .mjx-mrow').should('have.text', 'x')

      cy.get('#\\/cr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/sr1 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/ca1').should('have.text', '0')

      cy.get('#\\/cr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/sr2 .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x')
      })
      cy.get('#\\/ca2').should('have.text', '0')


    })
  });


  // TODO: is there any way to check this now that core is in a web worker?
  it.skip('credit achieved not calculated before submit', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <answer name="ans">
    <award>x^2-2x+3</award>
    <award credit="0.5" nSignErrorsMatched="1">x^2-2x+3</award>
  </answer>
  <p>Current response: <copy prop="currentResponse" target="ans" assignNames="cr" /></p>
  <p>Submitted response: <copy prop="submittedResponse" target="ans" createComponentOfType='math' assignNames="sr" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="ans" assignNames="ca" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinputName = stateVariables['/ans'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');
      let mathinputPartialAnchor = cesc('#' + mathinputName + '_partial');

      cy.get(mathinputSubmitAnchor).should('be.visible')

      cy.get('#\\/cr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca').should('have.text', '0')


      cy.log('check that have getters for creditAchievedIfSubmit/fractionSatisfiedIfSubmit')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let stateVarObj = stateVariables["/_award1"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/_award1"].state.fractionSatisfiedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/_award2"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/_award2"].state.fractionSatisfiedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/ans"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;

        expect(stateVariables["/ans"].state.creditAchieved.value).eq(0);
        expect(stateVariables["/_award1"].state.creditAchieved.value).eq(0);
        expect(stateVariables["/_award1"].state.fractionSatisfied.value).eq(0);
        expect(stateVariables["/_award2"].state.creditAchieved.value).eq(0);
        expect(stateVariables["/_award2"].state.fractionSatisfied.value).eq(0);


      })


      cy.log('type correct answer')

      cy.get(mathinputAnchor).type("x^2{rightArrow}-2x+3", { force: true }).blur();

      cy.get(mathinputSubmitAnchor).should('be.visible')

      cy.get('#\\/cr .mjx-mrow').should('contain.text', 'x2−2x+3')

      cy.get('#\\/cr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x2−2x+3')
      })
      cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('\uff3f')
      })
      cy.get('#\\/ca').should('have.text', '0')


      cy.log('check that still have getters for creditAchievedIfSubmit/fractionSatisfiedIfSubmit')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let stateVarObj = stateVariables["/_award1"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/_award1"].state.fractionSatisfiedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/_award2"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/_award2"].state.fractionSatisfiedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/ans"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;

        expect(stateVariables["/ans"].state.creditAchieved.value).eq(0);
        expect(stateVariables["/_award1"].state.creditAchieved.value).eq(0);
        expect(stateVariables["/_award1"].state.fractionSatisfied.value).eq(0);
        expect(stateVariables["/_award2"].state.creditAchieved.value).eq(0);
        expect(stateVariables["/_award2"].state.fractionSatisfied.value).eq(0);

      })


      cy.log('click submit')

      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');


      cy.get('#\\/cr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x2−2x+3')
      })
      cy.get('#\\/sr .mjx-mrow').should('contain.text', 'x2−2x+3')

      cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x2−2x+3')
      })
      cy.get('#\\/ca').should('have.text', '1')



      cy.log('check that no longer have getters for creditAchievedIfSubmit/fractionSatisfiedIfSubmit')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let stateVarObj = stateVariables["/_award1"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.false;
        stateVarObj = stateVariables["/_award1"].state.fractionSatisfiedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.false;
        stateVarObj = stateVariables["/_award2"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.false;
        stateVarObj = stateVariables["/_award2"].state.fractionSatisfiedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.false;
        stateVarObj = stateVariables["/ans"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.false;

        expect(stateVariables["/_award1"].state.creditAchievedIfSubmit.value).eq(1);
        expect(stateVariables["/_award1"].state.fractionSatisfiedIfSubmit.value).eq(1);
        expect(stateVariables["/_award1"].state.creditAchieved.value).eq(1);
        expect(stateVariables["/_award1"].state.fractionSatisfied.value).eq(1);
        expect(stateVariables["/_award2"].state.creditAchievedIfSubmit.value).eq(0.5);
        expect(stateVariables["/_award2"].state.fractionSatisfiedIfSubmit.value).eq(1);
        expect(stateVariables["/_award2"].state.creditAchieved.value).eq(0.5);
        expect(stateVariables["/_award2"].state.fractionSatisfied.value).eq(1);
        expect(stateVariables["/ans"].state.creditAchievedIfSubmit.value).eq(1);
        expect(stateVariables["/ans"].state.creditAchieved.value).eq(1);

      })


      cy.log('type partially correct answer')

      cy.get(mathinputAnchor).type("{end}{leftArrow}{backspace}-", { force: true }).blur();

      cy.get(mathinputSubmitAnchor).should('be.visible')

      cy.get('#\\/cr .mjx-mrow').should('contain.text', 'x2−2x−3')

      cy.get('#\\/cr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x2−2x−3')
      })
      cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x2−2x+3')
      })
      cy.get('#\\/ca').should('have.text', '1')


      cy.log('check that still have getters for creditAchievedIfSubmit/fractionSatisfiedIfSubmit')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let stateVarObj = stateVariables["/_award1"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/_award1"].state.fractionSatisfiedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/_award2"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/_award2"].state.fractionSatisfiedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;
        stateVarObj = stateVariables["/ans"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.true;

        expect(stateVariables["/ans"].state.creditAchieved.value).eq(1);
        expect(stateVariables["/_award1"].state.creditAchieved.value).eq(1);
        expect(stateVariables["/_award1"].state.fractionSatisfied.value).eq(1);
        expect(stateVariables["/_award2"].state.creditAchieved.value).eq(0.5);
        expect(stateVariables["/_award2"].state.fractionSatisfied.value).eq(1);

      })



      cy.log('click submit')

      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '50 %');

      cy.get('#\\/cr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x2−2x−3')
      })
      cy.get('#\\/sr .mjx-mrow').should('contain.text', 'x2−2x−3')

      cy.get('#\\/sr .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('x2−2x−3')
      })
      cy.get('#\\/ca').should('have.text', '0.5')



      cy.log('check that no longer have getters for creditAchievedIfSubmit/fractionSatisfiedIfSubmit')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let stateVarObj = stateVariables["/_award1"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.false;
        stateVarObj = stateVariables["/_award1"].state.fractionSatisfiedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.false;
        stateVarObj = stateVariables["/_award2"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.false;
        stateVarObj = stateVariables["/_award2"].state.fractionSatisfiedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.false;
        stateVarObj = stateVariables["/ans"].state.creditAchievedIfSubmit;
        expect(Boolean(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)).to.be.false;

        expect(stateVariables["/_award1"].state.creditAchievedIfSubmit.value).eq(0);
        expect(stateVariables["/_award1"].state.fractionSatisfiedIfSubmit.value).eq(0);
        expect(stateVariables["/_award1"].state.creditAchieved.value).eq(0);
        expect(stateVariables["/_award1"].state.fractionSatisfied.value).eq(0);
        expect(stateVariables["/_award2"].state.creditAchievedIfSubmit.value).eq(0.5);
        expect(stateVariables["/_award2"].state.fractionSatisfiedIfSubmit.value).eq(1);
        expect(stateVariables["/_award2"].state.creditAchieved.value).eq(0.5);
        expect(stateVariables["/_award2"].state.fractionSatisfied.value).eq(1);
        expect(stateVariables["/ans"].state.creditAchievedIfSubmit.value).eq(0.5);
        expect(stateVariables["/ans"].state.creditAchieved.value).eq(0.5);

      })

    })



  });

  it('verify tab behavior, math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <answer>x</answer>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');

      cy.log("Press tab")
      cy.get(mathinputSubmitAnchor).focus();
      cy.get(mathinputAnchor).tab();
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');

      cy.log("Press enter on submit button")
      cy.get(mathinputSubmitAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');

    })
  });

  it('verify tab behavior, text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <answer type="text">hello</answer>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName) + "_input";
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');
      let textinputCorrectAnchor = cesc('#' + textinputName + '_correct');
      let textinputIncorrectAnchor = cesc('#' + textinputName + '_incorrect');

      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');

      cy.log("Type correct answer in")
      cy.get(textinputAnchor).type(`hello`);
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');

      cy.log("Press tab")
      cy.get(textinputAnchor).tab();
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputCorrectAnchor).should('not.exist');
      cy.get(textinputIncorrectAnchor).should('not.exist');

      cy.log("Press enter on submit button")
      cy.get(textinputSubmitAnchor).type(`{enter}`, { force: true });
      cy.get(textinputSubmitAnchor).should('not.exist');
      cy.get(textinputCorrectAnchor).should('be.visible');
      cy.get(textinputIncorrectAnchor).should('not.exist');

    })
  });

})
