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
    cy.visit('/test')
  })

  it('feedback from answer value or credit', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>x+y</answer></p>
  <section>
  <feedback><condition><copy prop="creditAchieved" tname="_answer1" /> = 1</condition>
  <p>You got full credit!</p></feedback>
  <feedback><condition><copy prop="submittedResponse" tname="_answer1" /> = <math>x+y</math></condition>
  <p>You typed the right answer!</p></feedback>
  <feedback><condition><copy prop="submittedResponse" tname="_answer1" /> = <math>x</math></condition>
  <p>That's a bad answer.</p></feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChild.componentName
      let mathinputAnchor = cesc('#' + mathinputName + '_input');
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Blur")
      cy.get(mathinputAnchor).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').eq(0).should('have.text', 'You got full credit!')
      cy.get('#\\/_section1 p').eq(1).should('have.text', 'You typed the right answer!')
      cy.get('#\\/_section1 p').eq(2).should('not.exist')

      cy.log("Type wrong answer")
      cy.get(mathinputAnchor).clear().type(`x`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/_section1 p').eq(0).should('have.text', 'You got full credit!')
      cy.get('#\\/_section1 p').eq(1).should('have.text', 'You typed the right answer!')
      cy.get('#\\/_section1 p').eq(2).should('not.exist')

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/_section1 p').should('have.text', "That's a bad answer.")

      cy.log("Enter different wrong answer")
      cy.get(mathinputAnchor).clear().type(`y`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/_section1 p').should('have.text', "That's a bad answer.")

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/_section1 p').should('not.exist')

    })
  });

  it('feedback from award', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award><math>x+y</math></award><award credit="0.5"><math>x</math></award></answer></p>
  <section>
  <feedback><condition><copy tname="_award1" /></condition>
  <p>You got award 1.</p>
  </feedback>
  <feedback><condition><copy tname="_award2" /></condition>
  <p>You got award 2.</p>
  </feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChild.componentName
      let mathinputAnchor = cesc('#' + mathinputName + '_input');
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Type correct answer in")
      cy.get(mathinputAnchor).type(`x+y`);

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Blur")
      cy.get(mathinputAnchor).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get('#\\/_section1 p').should('have.text', `You got award 1.`)

      cy.log("Enter wrong answer")
      cy.get(mathinputAnchor).clear().type(`x`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/_section1 p').should('have.text', `You got award 1.`)

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get('#\\/_section1 p').should('have.text', `You got award 2.`)

      cy.log("Enter different wrong answer")
      cy.get(mathinputAnchor).clear().type(`y`).blur();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/_section1 p').should('have.text', `You got award 2.`)

      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get('#\\/_section1 p').should('not.exist')

    })
  });

  it('feedback from awards, select which one to display', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>
    <mathinput />
    <award credit="0.1"><when><copy prop="immediateValue" tname="_mathinput1" /> > 1</when></award>
    <award><when><copy prop="immediateValue" tname="_mathinput1" /> > 10</when></award>
    <award credit="0.2"><when><copy prop="immediateValue" tname="_mathinput1" /> > 2</when></award>
    <award credit="0.1"><when><copy prop="immediateValue" tname="_mathinput1" /> > 0.9</when></award>
    <award credit="0"><when><copy prop="immediateValue" tname="_mathinput1" /> < 0</when></award>
  </answer></p>
  <p>Credit achieved: <copy name="ca" prop="creditAchieved" tname="_answer1" /></p>
  <section>
  <feedback>
    <condition><copy tname="_award1" /></condition>
    <p>Larger than 1</p>
  </feedback>
  <feedback>
    <condition><copy tname="_award2" /></condition>
    <p>Larger than 10</p>
  </feedback>
  <feedback>
    <condition><copy tname="_award3" /></condition>
    <p>Larger than 2</p>
  </feedback>
  <feedback>
    <condition><copy tname="_award4" /></condition>
    <p>Larger than 0.9</p>
  </feedback>
  <feedback>
    <condition><copy tname="_award5" /></condition>
    <p>A negative number?</p>
  </feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let caAnchor = cesc('#' + components['/ca'].replacements[0].componentName);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '');
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Type 11")
      cy.get('#\\/_mathinput1_input').type(`11`);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '11');
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Blur")
      cy.get('#\\/_mathinput1_input').blur();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '11');
      cy.get('#\\/_mathinput1_input').should('have.value', '11');
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Submit answer")
      cy.get('#\\/_mathinput1_submit').click();

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '11');
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/_section1 p').should('have.text', `Larger than 10`)

      cy.log("submit 10")
      cy.get('#\\/_mathinput1_input').clear().type(`10{enter}`);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '10');
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0.2')
      });
      cy.get('#\\/_section1 p').should('have.text', `Larger than 2`)

      cy.log("submit 2")
      cy.get('#\\/_mathinput1_input').clear().type(`2{enter}`);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '2');
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0.1')
      });
      cy.get('#\\/_section1 p').should('have.text', `Larger than 1`)

      cy.log("submit 1")
      cy.get('#\\/_mathinput1_input').clear().type(`1{enter}`);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '1');
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0.1')
      });
      cy.get('#\\/_section1 p').should('have.text', `Larger than 0.9`)

      cy.log("submit 0")
      cy.get('#\\/_mathinput1_input').clear().type(`0{enter}`);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '0');
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("submit -1")
      cy.get('#\\/_mathinput1_input').clear().type(`-1{enter}`);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '-1');
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get('#\\/_section1 p').should('have.text', `A negative number?`)

    })
  });

  it('feedback from multiple choice, select which one to display', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>
    <choiceinput>
    <choice credit="0.1">cat</choice>
    <choice credit="1">dog</choice>
    <choice credit="0.2">cow</choice>
    <choice credit="0.1">mouse</choice>
    <choice>banana</choice>
    </choiceinput>
  </answer></p>
  <p>Credit achieved: <copy name="ca" prop="creditAchieved" tname="_answer1" /></p>
  <section>
  <feedback>
    <condition><copy tname="_choice1" /></condition>
    <p>Meow</p>
  </feedback>
  <feedback>
    <condition><copy tname="_choice2" /></condition>
    <p>Ruff</p>
  </feedback>
  <feedback>
    <condition><copy tname="_choice3" /></condition>
    <p>Moo</p>
  </feedback>
  <feedback>
    <condition><copy tname="_choice4" /></condition>
    <p>Squeak</p>
  </feedback>
  <feedback>
    <condition><copy tname="_choice5" /></condition>
    <p>Huh?</p>
  </feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let caAnchor = cesc('#' + components['/ca'].replacements[0].componentName)
      let choiceinputName = components['/_answer1'].stateValues.inputChild.componentName;
      let choiceinputAnchor = cesc('#' + choiceinputName);
      let choiceinputSubmitAnchor = cesc('#' + choiceinputName + '_submit');

      cy.log('Test value displayed in browser')
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Select dog")
      cy.get(choiceinputAnchor).contains(`dog`).click();
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Submit answer")
      cy.get(choiceinputSubmitAnchor).click();

      cy.log('Test value displayed in browser')
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/_section1 p').should('have.text', `Ruff`)

      cy.log("submit cow")
      cy.get(choiceinputAnchor).contains(`cow`).click();
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0.2')
      });
      cy.get('#\\/_section1 p').should('have.text', `Moo`)

      cy.log("submit cat")
      cy.get(choiceinputAnchor).contains(`cat`).click();
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0.1')
      });
      cy.get('#\\/_section1 p').should('have.text', `Meow`)

      cy.log("submit mouse")
      cy.get(choiceinputAnchor).contains(`mouse`).click();
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0.1')
      });
      cy.get('#\\/_section1 p').should('have.text', `Squeak`)

      cy.log("submit banana")
      cy.get(choiceinputAnchor).contains(`banana`).click();
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(caAnchor).invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get('#\\/_section1 p').should('have.text', `Huh?`)
    })
  });

  it('feedback for any incorrect response', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text">hello there</answer></p>
  <section>
  <feedback>
    <condition>
      <copy prop="creditAchieved" tname="_answer1" /> != 1
      and <copy prop="responsehasbeensubmitted" tname="_answer1" />
    </condition>
    <p>Your response <em><copy prop="submittedresponse" tname="_answer1" /></em> is incorrect.</p>
  </feedback>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinputName = components['/_answer1'].stateValues.inputChild.componentName
      let textinputAnchor = cesc('#' + textinputName + '_input');

      cy.log('Test value displayed in browser')
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Enter incorrect answer in")
      cy.get(textinputAnchor).clear().type(`wrong{enter}`);
      cy.get(textinputAnchor).should('have.value', 'wrong');
      cy.get('#\\/_section1 p').should('have.text', `Your response wrong is incorrect.`)

      cy.log("Enter correct answer")
      cy.get(textinputAnchor).clear().type(`hello there{enter}`);
      cy.get(textinputAnchor).should('have.value', 'hello there');
      cy.get('#\\/_section1 p').should('not.exist')

      cy.log("Enter blank answer")
      cy.get(textinputAnchor).clear().type("{enter}");
      cy.get(textinputAnchor).should('have.value', '');
      cy.get('#\\/_section1 p').should('have.text', `Your response  is incorrect.`)

      cy.log("Enter another incorrect answer in")
      cy.get(textinputAnchor).clear().type(`bye{enter}`);
      cy.get(textinputAnchor).should('have.value', 'bye');
      cy.get('#\\/_section1 p').should('have.text', `Your response bye is incorrect.`)

    })
  });

  it('feedback defined in awards', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>
    <award feedbackcodes="goodjob"><math>sin(pi x)</math></award>
    <award credit="0.7" feedbacktext="Close, but wrong trignometric function"><math>cos(pi x)</math></award>
    <award credit="0.3" feedbacktext="You lost pi"><math>sin(x)</math></award>
  </answer></p>

  <p>Award 1 feedback:</p>
  <subsection name="feedback1" title=""><copy prop="feedback" tname="_award1" /></subsection>
  
  <p>Award 2 feedback:</p>
  <subsection name="feedback2" title=""><copy prop="feedback" tname="_award2" /></subsection>

  <p>Award 3 feedback:</p>
  <subsection name="feedback3" title=""><copy prop="feedback" tname="_award3" /></subsection>

  <p>Answer feedbacks:</p>
  <subsection name="feedback4" title=""><copy prop="feedbacks" tname="_answer1" /></subsection>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChild.componentName
      let mathinputAnchor = cesc('#' + mathinputName + '_input');
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');
      let mathinputPartialAnchor = cesc('#' + mathinputName + '_partial');

      cy.log('Test value displayed in browser')
      cy.get(mathinputAnchor).should('have.value', '');
      cy.get('#\\/feedback1').should('have.text', '')
      cy.get('#\\/feedback2').should('have.text', '')
      cy.get('#\\/feedback3').should('have.text', '')
      cy.get('#\\/feedback4').should('have.text', '')
      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log('submit blank answer');
      cy.get(mathinputSubmitAnchor).click();

      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('have.text', '')
      cy.get('#\\/feedback2').should('have.text', '')
      cy.get('#\\/feedback3').should('have.text', '')
      cy.get('#\\/feedback4').should('have.text', '')


      cy.log("Type sin(pi x)")
      cy.get(mathinputAnchor).clear().type(`sin(pi x)`);

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('have.text', '')
      cy.get('#\\/feedback2').should('have.text', '')
      cy.get('#\\/feedback3').should('have.text', '')
      cy.get('#\\/feedback4').should('have.text', '')


      cy.log("Blur")
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('have.text', '')
      cy.get('#\\/feedback2').should('have.text', '')
      cy.get('#\\/feedback3').should('have.text', '')
      cy.get('#\\/feedback4').should('have.text', '')


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('have.text', ' FeedbackGood job!')
      cy.get('#\\/feedback2').should('have.text', '')
      cy.get('#\\/feedback3').should('have.text', '')
      cy.get('#\\/feedback4').should('have.text', ' FeedbackGood job!')



      cy.log("Type cos(pi x)")
      cy.get(mathinputAnchor).clear().type(`cos(pi x)`);
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('have.text', ' FeedbackGood job!')
      cy.get('#\\/feedback2').should('have.text', '')
      cy.get('#\\/feedback3').should('have.text', '')
      cy.get('#\\/feedback4').should('have.text', ' FeedbackGood job!')


      cy.log("Blur")
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('have.text', ' FeedbackGood job!')
      cy.get('#\\/feedback2').should('have.text', '')
      cy.get('#\\/feedback3').should('have.text', '')
      cy.get('#\\/feedback4').should('have.text', ' FeedbackGood job!')


      cy.log("Submit answer")
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should('have.text', '70 %');
      cy.get('#\\/feedback1').should('have.text', '')
      cy.get('#\\/feedback2').should('have.text', ' FeedbackClose, but wrong trignometric function')
      cy.get('#\\/feedback3').should('have.text', '')
      cy.get('#\\/feedback4').should('have.text', ' FeedbackClose, but wrong trignometric function')


      cy.log("Enter x")
      cy.get(mathinputAnchor).clear().type(`x{enter}`);
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedback1').should('have.text', '')
      cy.get('#\\/feedback2').should('have.text', '')
      cy.get('#\\/feedback3').should('have.text', '')
      cy.get('#\\/feedback4').should('have.text', '')

      cy.log("Enter sin(x)")
      cy.get(mathinputAnchor).clear().type(`sin(x){enter}`);
      cy.get(mathinputPartialAnchor).should('have.text', '30 %');
      cy.get('#\\/feedback1').should('have.text', '')
      cy.get('#\\/feedback2').should('have.text', '')
      cy.get('#\\/feedback3').should('have.text', ' FeedbackYou lost pi')
      cy.get('#\\/feedback4').should('have.text', ' FeedbackYou lost pi')

    })
  });

  it('feedback defined in choices', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>
    <answer>
      <choiceinput>
      <choice feedbacktext="meow" credit="0.5">cat</choice>
      <choice feedbackcodes="goodjob" credit="1">dog</choice>
      <choice>monkey</choice>
      </choiceinput>
    </answer>
  </p>

  <p>Answer feedbacks:</p>
  <subsection name="feedbacks" title=""><copy prop="feedbacks" tname="_answer1" /></subsection>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let choiceinputName = cesc(components['/_answer1'].stateValues.inputChild.componentName);
      let choiceinputAnchor = '#' + choiceinputName;
      let choiceinputSubmitAnchor = '#' + choiceinputName + '_submit';
      let choiceinputCorrectAnchor = '#' + choiceinputName + '_correct';
      let choiceinputIncorrectAnchor = '#' + choiceinputName + '_incorrect';
      let choiceinputPartialAnchor = '#' + choiceinputName + '_partial';

      cy.log('Test value displayed in browser')
      cy.get(choiceinputAnchor).should('have.value', '');
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('have.text', '')

      cy.log("Select correct answer")
      cy.get(choiceinputAnchor).contains(`dog`).click();
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('have.text', '')

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputCorrectAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('have.text', ' FeedbackGood job!')

      cy.log("Select half correct answer")
      cy.get(choiceinputAnchor).contains(`cat`).click();
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('have.text', ' FeedbackGood job!')

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputPartialAnchor).invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('50% correct')
      })
      cy.get('#\\/feedbacks').should('have.text', ' Feedbackmeow')

      cy.log("Select half incorrect answer")
      cy.get(choiceinputAnchor).contains(`monkey`).click();
      cy.get(choiceinputSubmitAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('have.text', ' Feedbackmeow')

      cy.log("Click submit button")
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(choiceinputIncorrectAnchor).should('be.visible');
      cy.get('#\\/feedbacks').should('have.text', '')

    })
  });

});