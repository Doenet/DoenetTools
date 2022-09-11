import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Feedback Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('feedback from answer value or credit', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>x+y</answer></p>
  <section>
  <feedback condition="$(_answer1.creditAchieved) = 1">
  <p>You got full credit!</p></feedback>
  <feedback condition="$_answer1 = x+y">
  <p>You typed the right answer!</p></feedback>
  <feedback condition="$_answer1 = x" >
  <p>That's a bad answer.</p></feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Blur")
      cy.get(mathinputAnchor).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').eq(0).should('have.text', 'You got full credit!')
      cy.get('#\\/_section1 p').eq(1).should('have.text', 'You typed the right answer!')
      cy.get('#\\/_section1 p').eq(2).should('not.exist')

      cy.log("Type wrong answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/_section1 p').eq(0).should('have.text', 'You got full credit!')
      cy.get('#\\/_section1 p').eq(1).should('have.text', 'You typed the right answer!')
      cy.get('#\\/_section1 p').eq(2).should('not.exist')

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/_section1 p').should('have.text', "That's a bad answer.")

      cy.log("Enter different wrong answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/_section1 p').should('have.text', "That's a bad answer.")

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/_section1 p').should('not.exist')

    })
  });

  it('feedback from answer value or credit, set showFeedback=false', () => {
    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_showFeedback').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>x+y</answer></p>
  <section>
  <feedback condition="$(_answer1.creditAchieved) = 1">
  <p>You got full credit!</p></feedback>
  <feedback condition="$_answer1 = x+y">
  <p>You typed the right answer!</p></feedback>
  <feedback condition="$_answer1 = x" >
  <p>That's a bad answer.</p></feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Blur")
      cy.get(mathinputAnchor).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Type wrong answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Enter different wrong answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/_section1 p').should('not.exist')

    })
  });

  it('feedback from award', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award><math>x+y</math></award><award credit="0.5"><math>x</math></award></answer></p>
  <section>
  <feedback condition="$_award1">
  <p>You got award 1.</p>
  </feedback>
  <feedback condition="$_award2">
  <p>You got award 2.</p>
  </feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`, { force: true });

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Blur")
      cy.get(mathinputAnchor).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('have.text', `You got award 1.`)

      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}{backspace}`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/_section1 p').should('have.text', `You got award 1.`)

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/_section1 p').should('have.text', `You got award 2.`)

      cy.log("Enter different wrong answer")
      cy.get(mathinputAnchor).type(`{end}{backspace}y`, { force: true }).blur();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/_section1 p').should('have.text', `You got award 2.`)

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/_section1 p').should('not.exist')

    })
  });

  it('feedback from awards, select which one to display', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>
    <mathinput />
    <award credit="0.1"><when><copy prop="immediateValue" target="_mathinput1" /> > 1</when></award>
    <award><when><copy prop="immediateValue" target="_mathinput1" /> > 10</when></award>
    <award credit="0.2"><when><copy prop="immediateValue" target="_mathinput1" /> > 2</when></award>
    <award credit="0.1"><when><copy prop="immediateValue" target="_mathinput1" /> > 0.9</when></award>
    <award credit="0"><when><copy prop="immediateValue" target="_mathinput1" /> < 0</when></award>
  </answer></p>
  <p>Credit achieved: <copy assignNames="ca" prop="creditAchieved" target="_answer1" /></p>
  <section>
  <feedback condition="$_award1">
    <p>Larger than 1</p>
  </feedback>
  <feedback condition="$_award2" >
    <p>Larger than 10</p>
  </feedback>
  <feedback condition="$_award3">
    <p>Larger than 2</p>
  </feedback>
  <feedback condition="$_award4">
    <p>Larger than 0.9</p>
  </feedback>
  <feedback condition="$_award5">
    <p>A negative number?</p>
  </feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', '');
    cy.get("#\\/ca").invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_section1 p').should('not.exist')

    cy.log("Type 11")
    cy.get('#\\/_mathinput1 textarea').type(`11`, { force: true });

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', '11');
    cy.get("#\\/ca").invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_section1 p').should('not.exist')

    cy.log("Blur")
    cy.get('#\\/_mathinput1 textarea').blur();

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', '11');
    cy.get("#\\/ca").invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_section1 p').should('not.exist')

    cy.log("Submit answer")
    cy.get('#\\/_mathinput1_submit').click();

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', '11');
    cy.get('#\\/_section1 p').should('have.text', `Larger than 10`)
    cy.get("#\\/ca").invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });

    cy.log("submit 10")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0`, { force: true });
    cy.get('#\\/_mathinput1_submit').should('be.visible');
    cy.get('#\\/_mathinput1 textarea').type(`{enter}`, { force: true });

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', '10');
    cy.get('#\\/_section1 p').should('have.text', `Larger than 2`)
    cy.get("#\\/ca").invoke('text').then((text) => {
      expect(text.trim()).equal('0.2')
    });

    cy.log("submit 2")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}{backspace}2`, { force: true });
    cy.get('#\\/_mathinput1_submit').should('be.visible');
    cy.get('#\\/_mathinput1 textarea').type(`{enter}`, { force: true });

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', '2');
    cy.get('#\\/_section1 p').should('have.text', `Larger than 1`)
    cy.get("#\\/ca").invoke('text').then((text) => {
      expect(text.trim()).equal('0.1')
    });

    cy.log("submit 1")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}1`, { force: true });
    cy.get('#\\/_mathinput1_submit').should('be.visible');
    cy.get('#\\/_mathinput1 textarea').type(`{enter}`, { force: true });

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', '1');
    cy.get('#\\/_section1 p').should('have.text', `Larger than 0.9`)
    cy.get("#\\/ca").invoke('text').then((text) => {
      expect(text.trim()).equal('0.1')
    });

    cy.log("submit 0")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0`, { force: true });
    cy.get('#\\/_mathinput1_submit').should('be.visible');
    cy.get('#\\/_mathinput1 textarea').type(`{enter}`, { force: true });

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', '0');
    cy.get('#\\/_section1 p').should('not.exist')
    cy.get("#\\/ca").invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });

    cy.log("submit -1")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}-1`, { force: true });
    cy.get('#\\/_mathinput1_submit').should('be.visible');
    cy.get('#\\/_mathinput1 textarea').type(`{enter}`, { force: true });

    cy.log('Test value displayed in browser')
    // cy.get('#\\/_mathinput1_input').should('have.value', '-1');
    cy.get('#\\/_section1 p').should('have.text', `A negative number?`)
    cy.get("#\\/ca").invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });


  });

  it('feedback from multiple choice, select which one to display', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>
    <choiceinput shuffleOrder>
    <choice credit="0.1">cat</choice>
    <choice credit="1">dog</choice>
    <choice credit="0.2">cow</choice>
    <choice credit="0.1">mouse</choice>
    <choice>banana</choice>
    </choiceinput>
  </answer></p>
  <p>Credit achieved: <copy assignNames="ca" prop="creditAchieved" target="_answer1" /></p>
  <section>
  <feedback condition="$_choice1">
    <p>Meow</p>
  </feedback>
  <feedback condition="$_choice2">
    <p>Ruff</p>
  </feedback>
  <feedback condition="$_choice3">
    <p>Moo</p>
  </feedback>
  <feedback condition="$_choice4">
    <p>Squeak</p>
  </feedback>
  <feedback condition="$_choice5">
    <p>Huh?</p>
  </feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName;
      let choiceinputAnchor = cesc('#' + choiceinputName);
      let choiceinputSubmitAnchor = cesc('#' + choiceinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get("#\\/ca").invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Select dog")
      cy.get(choiceinputAnchor).contains(`dog`).click();
      cy.get('#\\/_section1 p').should('not.exist')
      cy.get("#\\/ca").invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });

      cy.log("Submit answer")
      cy.get(choiceinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_section1 p').should('have.text', `Ruff`)
      cy.get("#\\/ca").invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });

      cy.log("submit cow")
      cy.get(choiceinputAnchor).contains(`cow`).click();
      cy.get(choiceinputSubmitAnchor).click();
      cy.get('#\\/_section1 p').should('have.text', `Moo`)
      cy.get("#\\/ca").invoke('text').then((text) => {
        expect(text.trim()).equal('0.2')
      });

      cy.log("submit cat")
      cy.get(choiceinputAnchor).contains(`cat`).click();
      cy.get(choiceinputSubmitAnchor).click();
      cy.get('#\\/_section1 p').should('have.text', `Meow`)
      cy.get("#\\/ca").invoke('text').then((text) => {
        expect(text.trim()).equal('0.1')
      });

      cy.log("submit mouse")
      cy.get(choiceinputAnchor).contains(`mouse`).click();
      cy.get(choiceinputSubmitAnchor).click();
      cy.get('#\\/_section1 p').should('have.text', `Squeak`)
      cy.get("#\\/ca").invoke('text').then((text) => {
        expect(text.trim()).equal('0.1')
      });

      cy.log("submit banana")
      cy.get(choiceinputAnchor).contains(`banana`).click();
      cy.get(choiceinputSubmitAnchor).click();
      cy.get('#\\/_section1 p').should('have.text', `Huh?`)
      cy.get("#\\/ca").invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
    })
  });

  it('feedback for any incorrect response', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text">hello there</answer></p>
  <section>
  <feedback condition="$(_answer1.creditAchieved) != 1 and $(_answer1.responseHasBeenSubmitted) ">
    <p>Your response <em><copy prop="submittedresponse" target="_answer1" /></em> is incorrect.</p>
  </feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');
      let textinputSubmitAnchor = cesc('#' + textinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Enter incorrect answer in")
      cy.get(textinputAnchor).clear().type(`wrong{enter}`);
      cy.get(textinputAnchor).should('have.value', 'wrong');
      cy.get('#\\/_section1 p').should('have.text', `Your response wrong is incorrect.`)

      cy.log("Enter correct answer")
      cy.get(textinputAnchor).clear().type(`hello there`);
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputAnchor).type(`{enter}`);
      cy.get(textinputAnchor).should('have.value', 'hello there');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Enter blank answer")
      cy.get(textinputAnchor).clear();
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputAnchor).type(`{enter}`);
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/_section1 p').should('have.text', `Your response  is incorrect.`)

      cy.log("Enter another incorrect answer in")
      cy.get(textinputAnchor).clear().type(`bye`);
      cy.get(textinputSubmitAnchor).should('be.visible');
      cy.get(textinputAnchor).type(`{enter}`);
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get('#\\/_section1 p').should('have.text', `Your response bye is incorrect.`)

    })
  });

  it('feedback defined in awards', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>
    <award feedbackcodes="goodjob"><math>sin(pi x)</math></award>
    <award credit="0.7" feedbacktext="Close, but wrong trignometric function"><math>cos(pi x)</math></award>
    <award credit="0.3" feedbacktext="You lost pi"><math>sin(x)</math></award>
  </answer></p>

  <p>Award 1 feedback:</p>
  <subsection name="feedback1" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award1" /></subsection>
  
  <p>Award 2 feedback:</p>
  <subsection name="feedback2" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award2" /></subsection>

  <p>Award 3 feedback:</p>
  <subsection name="feedback3" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award3" /></subsection>

  <p>Answer feedbacks:</p>
  <subsection name="feedback4" suppressAutoName suppressAutoNumber><title/><copy prop="feedbacks" target="_answer1" /></subsection>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');
      let mathinputPartialAnchor = cesc('#' + mathinputName + '_partial');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log('submit blank answer');
      cy.get(mathinputSubmitAnchor).click();

      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Type sin(pi x)")
      cy.get(mathinputAnchor).type(`sin(pi x)`, { force: true });

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Blur")
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')



      cy.log("Type cos(pi x)")
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}cos(pi x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')


      cy.log("Blur")
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '70 %');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').should('contain.text', 'FeedbackClose, but wrong trignometric function')
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackClose, but wrong trignometric function')


      cy.log("Enter x")
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })

      cy.log("Enter sin(x)")
      cy.get(mathinputAnchor).type(`{end}{backspace}sin(x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputPartialAnchor).should('have.text', '30 %');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').should('contain.text', 'FeedbackYou lost pi')
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackYou lost pi')

    })
  });

  it('feedback defined in awards, new feedback definitions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="wrongTrig" text="Close, but wrong trignometric function" />
      <feedbackDefinition code="lostPI" text="You lost pi" />
    </feedbackDefinitions>
  </setup>

  <p><answer>
    <award feedbackcodes="goodJob"><math>sin(pi x)</math></award>
    <award credit="0.7" feedbackcodes="wrongTRIG"><math>cos(pi x)</math></award>
    <award credit="0.3" feedbackcodes="lostpi"><math>sin(x)</math></award>
  </answer></p>

  <p>Award 1 feedback:</p>
  <subsection name="feedback1" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award1" /></subsection>
  
  <p>Award 2 feedback:</p>
  <subsection name="feedback2" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award2" /></subsection>

  <p>Award 3 feedback:</p>
  <subsection name="feedback3" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award3" /></subsection>

  <p>Answer feedbacks:</p>
  <subsection name="feedback4" suppressAutoName suppressAutoNumber><title/><copy prop="feedbacks" target="_answer1" /></subsection>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');
      let mathinputPartialAnchor = cesc('#' + mathinputName + '_partial');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log('submit blank answer');
      cy.get(mathinputSubmitAnchor).click();

      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Type sin(pi x)")
      cy.get(mathinputAnchor).type(`sin(pi x)`, { force: true });

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Blur")
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')



      cy.log("Type cos(pi x)")
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}cos(pi x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')


      cy.log("Blur")
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '70 %');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').should('contain.text', 'FeedbackClose, but wrong trignometric function')
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackClose, but wrong trignometric function')


      cy.log("Enter x")
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })

      cy.log("Enter sin(x)")
      cy.get(mathinputAnchor).type(`{end}{backspace}sin(x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputPartialAnchor).should('have.text', '30 %');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').should('contain.text', 'FeedbackYou lost pi')
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackYou lost pi')

    })
  });

  it('feedback defined in awards, new feedback definitions in document and section', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="wrongTrig" text="typo here" />
      <feedbackDefinition code="lostPI" text="You lost pi" />
    </feedbackDefinitions>
  </setup>

  <section>
    <setup>
      <feedbackDefinitions>
        <feedbackDefinition code="wrongTrig" text="Close, but wrong trignometric function" />
      </feedbackDefinitions>
    </setup>

    <p><answer>
      <award feedbackcodes="goodJob"><math>sin(pi x)</math></award>
      <award credit="0.7" feedbackcodes="wrongTRIG"><math>cos(pi x)</math></award>
      <award credit="0.3" feedbackcodes="lostpi"><math>sin(x)</math></award>
    </answer></p>

    <p>Award 1 feedback:</p>
    <subsection name="feedback1" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award1" /></subsection>
    
    <p>Award 2 feedback:</p>
    <subsection name="feedback2" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award2" /></subsection>

    <p>Award 3 feedback:</p>
    <subsection name="feedback3" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award3" /></subsection>

    <p>Answer feedbacks:</p>
    <subsection name="feedback4" suppressAutoName suppressAutoNumber><title/><copy prop="feedbacks" target="_answer1" /></subsection>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');
      let mathinputPartialAnchor = cesc('#' + mathinputName + '_partial');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log('submit blank answer');
      cy.get(mathinputSubmitAnchor).click();

      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Type sin(pi x)")
      cy.get(mathinputAnchor).type(`sin(pi x)`, { force: true });

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Blur")
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')



      cy.log("Type cos(pi x)")
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}cos(pi x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')


      cy.log("Blur")
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '70 %');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').should('contain.text', 'FeedbackClose, but wrong trignometric function')
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackClose, but wrong trignometric function')


      cy.log("Enter x")
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })

      cy.log("Enter sin(x)")
      cy.get(mathinputAnchor).type(`{end}{backspace}sin(x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputPartialAnchor).should('have.text', '30 %');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').should('contain.text', 'FeedbackYou lost pi')
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackYou lost pi')

    })
  });

  it('feedback defined in awards, new feedback definitions in document, incorrect codes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="wrongTrig" text="Close, but wrong trignometric function" />
      <feedbackDefinition code="lostPI" text="You lost pi" />
    </feedbackDefinitions>
  </setup>


  <p><answer>
    <award feedbackcodes="goodJob"><math>sin(pi x)</math></award>
    <award credit="0.7" feedbackcodes="wrongTRIGbad"><math>cos(pi x)</math></award>
    <award credit="0.3" feedbackcodes="lostpi anotherCode"><math>sin(x)</math></award>
  </answer></p>

  <p>Award 1 feedback:</p>
  <subsection name="feedback1" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award1" /></subsection>
  
  <p>Award 2 feedback:</p>
  <subsection name="feedback2" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award2" /></subsection>

  <p>Award 3 feedback:</p>
  <subsection name="feedback3" suppressAutoName suppressAutoNumber><title/><copy prop="feedback" target="_award3" /></subsection>

  <p>Answer feedbacks:</p>
  <subsection name="feedback4" suppressAutoName suppressAutoNumber><title/><copy prop="feedbacks" target="_answer1" /></subsection>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');
      let mathinputPartialAnchor = cesc('#' + mathinputName + '_partial');

      cy.log('Test value displayed in browser')
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log('submit blank answer');
      cy.get(mathinputSubmitAnchor).click();

      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Type sin(pi x)")
      cy.get(mathinputAnchor).type(`sin(pi x)`, { force: true });

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Blur")
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')



      cy.log("Type cos(pi x)")
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}cos(pi x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')


      cy.log("Blur")
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('contain.text', 'FeedbackGood job!')
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackGood job!')


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '70 %');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })


      cy.log("Enter x")
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback4').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })

      cy.log("Enter sin(x)")
      cy.get(mathinputAnchor).type(`{end}{backspace}sin(x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputPartialAnchor).should('have.text', '30 %');
      cy.get('#\\/feedback1').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback2').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })
      cy.get('#\\/feedback3').should('contain.text', 'FeedbackYou lost pi')
      cy.get('#\\/feedback4').should('contain.text', 'FeedbackYou lost pi')

    })
  });

  it('feedback defined in choices', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>
    <answer>
      <choiceinput shuffleOrder>
      <choice feedbacktext="meow" credit="0.5">cat</choice>
      <choice feedbackcodes="goodjob" credit="1">dog</choice>
      <choice>monkey</choice>
      </choiceinput>
    </answer>
  </p>

  <p>Answer feedbacks:</p>
  <subsection name="feedbacks" suppressAutoName suppressAutoNumber><title/><copy prop="feedbacks" target="_answer1" /></subsection>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceinputName = cesc(stateVariables['/_answer1'].stateValues.inputChildren[0].componentName);
      let choiceinputAnchor = '#' + choiceinputName;
      let choiceinputSubmitAnchor = '#' + choiceinputName + '_submit';
      let choiceinputCorrectAnchor = '#' + choiceinputName + '_correct';
      let choiceinputIncorrectAnchor = '#' + choiceinputName + '_incorrect';
      let choiceinputPartialAnchor = '#' + choiceinputName + '_partial';

      cy.log('Test value displayed in browser')
      cy.get(choiceinputAnchor).should('have.value', '');
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })

      cy.log("Select correct answer")
      cy.get(choiceinputAnchor).contains(`dog`).click();
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputCorrectAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('contain.text', 'FeedbackGood job!')

      cy.log("Select half correct answer")
      cy.get(choiceinputAnchor).contains(`cat`).click();
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('contain.text', 'FeedbackGood job!')

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputPartialAnchor).invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('50% correct')
      })
      cy.get('#\\/feedbacks').should('contain.text', 'Feedbackmeow')

      cy.log("Select incorrect answer")
      cy.get(choiceinputAnchor).contains(`monkey`).click();
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('contain.text', 'Feedbackmeow')

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedbacks').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })

    })
  });

  it('feedback defined in choices, new feedback definitions in document and section', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="catSays" text="Meow" />
      <feedbackDefinition code="dogSays" text="Woof" />
    </feedbackDefinitions>
  </setup>

  <section>
    <setup>
      <feedbackDefinitions>
        <feedbackDefinition code="dogAlsoSays" text="Grrr" />
      </feedbackDefinitions>
    </setup>

    <p>
      <answer>
        <choiceinput shuffleOrder>
        <choice feedbackcodes="catsays" credit="0.5">cat</choice>
        <choice feedbackcodes="DogSays dogalsosays" credit="1">dog</choice>
        <choice>monkey</choice>
        </choiceinput>
      </answer>
    </p>

    <p>Answer feedbacks:</p>
    <subsection name="feedbacks" suppressAutoName suppressAutoNumber><title/><copy prop="feedbacks" target="_answer1" /></subsection>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceinputName = cesc(stateVariables['/_answer1'].stateValues.inputChildren[0].componentName);
      let choiceinputAnchor = '#' + choiceinputName;
      let choiceinputSubmitAnchor = '#' + choiceinputName + '_submit';
      let choiceinputCorrectAnchor = '#' + choiceinputName + '_correct';
      let choiceinputIncorrectAnchor = '#' + choiceinputName + '_incorrect';
      let choiceinputPartialAnchor = '#' + choiceinputName + '_partial';

      cy.log('Test value displayed in browser')
      cy.get(choiceinputAnchor).should('have.value', '');
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })

      cy.log("Select correct answer")
      cy.get(choiceinputAnchor).contains(`dog`).click();
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputCorrectAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('contain.text', 'FeedbackWoof FeedbackGrrr')

      cy.log("Select half correct answer")
      cy.get(choiceinputAnchor).contains(`cat`).click();
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('contain.text', 'FeedbackWoof FeedbackGrrr')

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputPartialAnchor).invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('50% correct')
      })
      cy.get('#\\/feedbacks').should('contain.text', 'FeedbackMeow')

      cy.log("Select incorrect answer")
      cy.get(choiceinputAnchor).contains(`monkey`).click();
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('contain.text', 'FeedbackMeow')

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedbacks').invoke('text').then(text => {
        expect(text.match(/^\s*$/)).not.be.null;
      })

    })
  });

  it('feedback updated with target', () => {
    let doenetML = `
    <text>a</text>
    <mathinput name="mi" />
    <answer name="ans">
      <award>
        <when>$mi = x</when>
      </award>
    </answer>
    
    <feedback condition="$mi=y" updateWith="ans" name="fback"><p>You typed y!</p></feedback>
    `;
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get("#\\/fback").should('not.exist')

    cy.get('#\\/mi textarea').type("y{enter}", { force: true })
    cy.get("#\\/fback").should('not.exist')

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_incorrect').should('be.visible');
    cy.get("#\\/fback").should('have.text', 'You typed y!');

    cy.get('#\\/mi textarea').type("{end}{backspace}x{enter}", { force: true })
    cy.get("#\\/fback").should('have.text', 'You typed y!');

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get("#\\/fback").should('not.exist')

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_showFeedback').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get("#\\/fback").should('not.exist')

    cy.get('#\\/mi textarea').type("y{enter}", { force: true })
    cy.get("#\\/fback").should('not.exist')

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_incorrect').should('be.visible');
    cy.get("#\\/fback").should('not.exist')

    cy.get('#\\/mi textarea').type("{end}{backspace}x{enter}", { force: true })
    cy.get("#\\/fback").should('not.exist')

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get("#\\/fback").should('not.exist')


  });

  it('feedback based on booleans, updated with target', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="m1" />
  <mathinput name="m2" />
  <boolean name="got1">$m1 = x</boolean>
  <boolean name="got2">$m2 = y</boolean>
  <answer name="ans">
    <award>
      <when>$got1 and $got2</when>
    </award>
    <considerAsResponses>$m1 $m2</considerAsResponses>
  </answer>

  <p>Submitted responses: <copy prop="submittedResponses" target="ans" assignNames="r1 r2" /></p>
  
  <subsection>
    <title>Desired feedback behavior</title>
    <feedback condition="$got1 and not $got2" updateWith="ans" name="fback1"><p>You got the first; what about the second?</p></feedback>
    <feedback condition="$got2 and not $got1" updateWith="ans" name="fback2"><p>You got the second; what about the first?</p></feedback>
  </subsection>
  <subsection>
    <title>Default feedback behavior</title>
    <feedback condition="$got1 and not $got2" name="fback1b"><p>You got the first; what about the second?</p></feedback>
    <feedback condition="$got2 and not $got1" name="fback2b"><p>You got the second; what about the first?</p></feedback>
  </subsection>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get("#\\/fback1").should('not.exist')
    cy.get("#\\/fback2").should('not.exist')
    cy.get("#\\/fback1b").should('not.exist')
    cy.get("#\\/fback2b").should('not.exist')
    cy.get("#\\/r1").should('not.exist')
    cy.get("#\\/r2").should('not.exist')

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_incorrect').should('be.visible');
    cy.get("#\\/fback1").should('not.exist')
    cy.get("#\\/fback2").should('not.exist')
    cy.get("#\\/fback1b").should('not.exist')
    cy.get("#\\/fback2b").should('not.exist')
    cy.get("#\\/r1 .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get("#\\/r2 .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get('#\\/m2 textarea').type("y{enter}", { force: true })
    cy.get("#\\/fback1").should('not.exist')
    cy.get("#\\/fback2").should('not.exist')
    cy.get("#\\/fback1b").should('not.exist')
    cy.get("#\\/fback2b").should('have.text', 'You got the second; what about the first?');
    cy.get("#\\/r1 .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get("#\\/r2 .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_incorrect').should('be.visible');
    cy.get("#\\/fback1").should('not.exist')
    cy.get("#\\/fback2").should('have.text', 'You got the second; what about the first?');
    cy.get("#\\/fback1b").should('not.exist')
    cy.get("#\\/fback2b").should('have.text', 'You got the second; what about the first?');
    cy.get("#\\/r1 .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get("#\\/r2 .mjx-mrow").eq(0).should('have.text', 'y')

    cy.get('#\\/m1 textarea').type("x{enter}", { force: true })
    cy.get("#\\/fback1").should('not.exist')
    cy.get("#\\/fback2").should('have.text', 'You got the second; what about the first?');
    cy.get("#\\/fback1b").should('not.exist')
    cy.get("#\\/fback2b").should('not.exist')
    cy.get("#\\/r1 .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get("#\\/r2 .mjx-mrow").eq(0).should('have.text', 'y')

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get("#\\/fback1").should('not.exist')
    cy.get("#\\/fback2").should('not.exist')
    cy.get("#\\/fback1b").should('not.exist')
    cy.get("#\\/fback2b").should('not.exist')
    cy.get("#\\/r1 .mjx-mrow").eq(0).should('have.text', 'x')
    cy.get("#\\/r2 .mjx-mrow").eq(0).should('have.text', 'y')

    cy.get('#\\/m2 textarea').type("{end}{backspace}{enter}", { force: true })
    cy.get("#\\/fback1").should('not.exist')
    cy.get("#\\/fback2").should('not.exist')
    cy.get("#\\/fback1b").should('have.text', 'You got the first; what about the second?');
    cy.get("#\\/fback2b").should('not.exist')
    cy.get("#\\/r1 .mjx-mrow").eq(0).should('have.text', 'x')
    cy.get("#\\/r2 .mjx-mrow").eq(0).should('have.text', 'y')

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_incorrect').should('be.visible');
    cy.get("#\\/fback1").should('have.text', 'You got the first; what about the second?');
    cy.get("#\\/fback2").should('not.exist')
    cy.get("#\\/fback1b").should('have.text', 'You got the first; what about the second?');
    cy.get("#\\/fback2b").should('not.exist')
    cy.get("#\\/r1 .mjx-mrow").eq(0).should('have.text', 'x')
    cy.get("#\\/r2 .mjx-mrow").eq(0).should('have.text', '\uff3f')

  });

  it('feedback based on fractionSatisfied/creditAchieved of award', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer matchPartial name="ans">
    <mathinput name="mi1" /> <mathinput name="mi2" />
    <award name="small"><when>$mi1 < 1 and $mi2 < 1</when></award>
    <award name="medium" credit="0.5"><when>$mi1 < 2 and $mi2 < 2</when></award>
    <award name="large" credit="0"><when>$mi1 < 3 and $mi2 < 3</when></award>
  </answer></p>
  <section>
  <feedback name="close" condition="$(medium.creditAchieved) > $(small.creditAchieved)">
  <p>A number or two is close but not quite.</p>
  </feedback>
  <feedback name="goodAndClose" condition="$(medium.fractionSatisfied) > $(small.fractionSatisfied) > 0">
  <p>One number is good, the other number is close but not quite.</p>
  </feedback>
  <feedback name="startingClose" condition="$(large.fractionSatisfied) > 0 and $(medium.fractionSatisfied) = 0">
  <p>A number or two is starting to get close.</p>
  </feedback>
  <feedback name="closeStartingClose" condition="$(large.fractionSatisfied) >  $(medium.fractionSatisfied) > $(small.fractionSatisfied)">
  <p>A number is close but not quite; the other number is starting to get close.</p>
  </feedback>
  <feedback name="goodStartingClose" condition="$(large.fractionSatisfied) > $(small.fractionSatisfied) > 0 and  $(small.fractionSatisfied) =  $(medium.fractionSatisfied)">
  <p>One number is good, the other number is starting to get close.</p>
  </feedback>
  <feedback name="good" condition="1 > $(small.fractionSatisfied) > 0 and $(small.fractionSatisfied) = $(medium.fractionSatisfied) = $(large.fractionSatisfied)">
  <p>One number is good.</p>
  </feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_incorrect').should('be.visible');

    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');


    cy.get('#\\/mi1 textarea').type("2{enter}", { force: true })
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_incorrect').should('be.visible');
    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('contain.text', 'A number or two is starting to get close.');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/mi1 textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('contain.text', 'A number or two is starting to get close.');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('25% correct')
    })
    cy.get('#\\/close').should('contain.text', 'A number or two is close but not quite.');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/mi1 textarea').type("{end}{backspace}0{enter}", { force: true })
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/close').should('contain.text', 'A number or two is close but not quite.');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('contain.text', 'One number is good.');


    cy.get('#\\/mi2 textarea').type("2{enter}", { force: true })
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('contain.text', 'One number is good.');

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('have.text', 'One number is good, the other number is starting to get close.');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/mi2 textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('have.text', 'One number is good, the other number is starting to get close.');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('have.text', 'One number is good, the other number is close but not quite.');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/mi2 textarea').type("{end}{backspace}0{enter}", { force: true })
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('have.text', 'One number is good, the other number is close but not quite.');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_correct').should('be.visible');
    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/mi1 textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/mi2 textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/close').should('not.exist');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/close').should('contain.text', 'A number or two is close but not quite.');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/mi1 textarea').type("{end}{backspace}2{enter}", { force: true })
    cy.get('#\\/ans_submit').should('be.visible');
    cy.get('#\\/close').should('contain.text', 'A number or two is close but not quite.');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('not.exist');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

    cy.get('#\\/ans_submit').click();
    cy.get('#\\/ans_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('25% correct')
    })
    cy.get('#\\/close').should('contain.text', 'A number or two is close but not quite.');
    cy.get('#\\/goodAndClose').should('not.exist');
    cy.get('#\\/startingClose').should('not.exist');
    cy.get('#\\/closeStartingClose').should('contain.text', 'A number is close but not quite; the other number is starting to get close.');
    cy.get('#\\/goodStartingClose').should('not.exist');
    cy.get('#\\/good').should('not.exist');

  });

  it('feedback with no condition', () => {
    let doenetML = `
    <text>a</text>
    <feedback name="fback"><p>Good job!</p></feedback>
    `;
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get("#\\/fback").should('have.text', 'Good job!');

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_showFeedback').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get("#\\/fback").should('not.exist');

  });

});