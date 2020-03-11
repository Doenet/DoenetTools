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
  <feedback><if><ref prop="creditAchieved">_answer1</ref> = 1</if>
  <p>You got full credit!</p></feedback>
  <feedback><if><ref prop="submittedResponse">_answer1</ref> = <math>x+y</math></if>
  <p>You typed the right answer!</p></feedback>
  <feedback><if><ref prop="submittedResponse">_answer1</ref> = <math>x</math></if>
  <p>That's a bad answer.</p></feedback>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')

    cy.log("Type correct answer in")
    cy.get('#_answer_mathinput1_input').type(`x+y`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')

    cy.log("Blur")
    cy.get('#_answer_mathinput1_input').blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_p2').should('have.text', 'You got full credit!')
    cy.get('#\\/_p3').should('have.text', 'You typed the right answer!')
    cy.get('#\\/_p4').should('not.exist')

    cy.log("Type wrong answer")
    cy.get('#_answer_mathinput1_input').clear().type(`x`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#\\/_p2').should('have.text', 'You got full credit!')
    cy.get('#\\/_p3').should('have.text', 'You typed the right answer!')
    cy.get('#\\/_p4').should('not.exist')

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('have.text', `That's a bad answer.`)

    cy.log("Enter different wrong answer")
    cy.get('#_answer_mathinput1_input').clear().type(`y`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('have.text', `That's a bad answer.`)

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')

  });

  it('feedback from award', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer><award>x+y</award><award credit="0.5">x</award></answer></p>
  <feedback><if><ref>_award1</ref></if>
  <p>You got award 1.</p>
  </feedback>
  <feedback><if><ref>_award2</ref></if>
  <p>You got award 2.</p>
  </feedback>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('not.exist')

    cy.log("Type correct answer in")
    cy.get('#_answer_mathinput1_input').type(`x+y`);

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('not.exist')

    cy.log("Blur")
    cy.get('#_answer_mathinput1_input').blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('not.exist')

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x+y');
    cy.get('#\\/_p2').should('have.text', `You got award 1.`)
    cy.get('#\\/_p3').should('not.exist')

    cy.log("Enter wrong answer")
    cy.get('#_answer_mathinput1_input').clear().type(`x`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#\\/_p2').should('have.text', `You got award 1.`)
    cy.get('#\\/_p3').should('not.exist')

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'x');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('have.text', `You got award 2.`)

    cy.log("Enter different wrong answer")
    cy.get('#_answer_mathinput1_input').clear().type(`y`).blur();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('have.text', `You got award 2.`)

    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', 'y');
    cy.get('#\\/_p2').should('not.exist')
    cy.get('#\\/_p3').should('not.exist')

  });

  it('feedback from awards, select which one to display', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>
    <mathinput />
    <award credit="0.1"><if><ref prop="value">_mathinput1</ref> > 1</if></award>
    <award><if><ref prop="value">_mathinput1</ref> > 10</if></award>
    <award credit="0.2"><if><ref prop="value">_mathinput1</ref> > 2</if></award>
    <award credit="0.1"><if><ref prop="value">_mathinput1</ref> > 0.9</if></award>
    <award credit="0"><if><ref prop="value">_mathinput1</ref> < 0</if></award>
  </answer></p>
  <p>Credit achieved: <ref prop="creditAchieved">_answer1</ref></p>
  <feedback>
    <if><ref>_award1</ref></if>
    <p>Larger than 1</p>
  </feedback>
  <feedback>
    <if><ref>_award2</ref></if>
    <p>Larger than 10</p>
  </feedback>
  <feedback>
    <if><ref>_award3</ref></if>
    <p>Larger than 2</p>
  </feedback>
  <feedback>
    <if><ref>_award4</ref></if>
    <p>Larger than 0.9</p>
  </feedback>
  <feedback>
    <if><ref>_award5</ref></if>
    <p>A negative number?</p>
  </feedback>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '');
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')

    cy.log("Type 11")
    cy.get('#\\/_mathinput1_input').type(`11`);

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '11');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')

    cy.log("Blur")
    cy.get('#\\/_mathinput1_input').blur();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '11');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')

    cy.log("Submit answer")
    cy.get('#\\/_mathinput1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '11');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('have.text', `Larger than 10`)
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')

    cy.log("submit 10")
    cy.get('#\\/_mathinput1_input').clear().type(`10{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '10');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.2')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('have.text', `Larger than 2`)
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')

    cy.log("submit 2")
    cy.get('#\\/_mathinput1_input').clear().type(`2{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '2');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.1')
    });
    cy.get('#\\/_p3').should('have.text', `Larger than 1`)
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')

    cy.log("submit 1")
    cy.get('#\\/_mathinput1_input').clear().type(`1{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '1');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.1')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('have.text', `Larger than 0.9`)
    cy.get('#\\/_p7').should('not.exist')

    cy.log("submit 0")
    cy.get('#\\/_mathinput1_input').clear().type(`0{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '0');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')

    cy.log("submit -1")
    cy.get('#\\/_mathinput1_input').clear().type(`-1{enter}`);

    cy.log('Test value displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '-1');
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('have.text', `A negative number?`)

  });

  it('feedback from multiple choice, select which one to display', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>
    <choice credit="0.1">cat</choice>
    <choice credit="1">dog</choice>
    <choice credit="0.2">cow</choice>
    <choice credit="0.1">mouse</choice>
    <choice>banana</choice>
  </answer></p>
  <p>Credit achieved: <ref prop="creditAchieved">_answer1</ref></p>
  <feedback>
    <if><ref>_choice1</ref></if>
    <p>Meow</p>
  </feedback>
  <feedback>
    <if><ref>_choice2</ref></if>
    <p>Ruff</p>
  </feedback>
  <feedback>
    <if><ref>_choice3</ref></if>
    <p>Moo</p>
  </feedback>
  <feedback>
    <if><ref>_choice4</ref></if>
    <p>Squeak</p>
  </feedback>
  <feedback>
    <if><ref>_choice5</ref></if>
    <p>Huh?</p>
  </feedback>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('Test value displayed in browser')
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')


    cy.log("Select dog")
    cy.get('#_answer_choiceinput1').contains(`dog`).click();
    cy.get('#__number6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')

    cy.log("Submit answer")
    cy.get('#_answer_choiceinput1_submit').click();

    cy.log('Test value displayed in browser')
    cy.get('#__number6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('have.text', `Ruff`)
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')

    cy.log("submit cow")
    cy.get('#_answer_choiceinput1').contains(`cow`).click();
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#__number6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.2')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('have.text', `Moo`)
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')

    cy.log("submit cat")
    cy.get('#_answer_choiceinput1').contains(`cat`).click();
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#__number6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.1')
    });
    cy.get('#\\/_p3').should('have.text', `Meow`)
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('not.exist')

    cy.log("submit mouse")
    cy.get('#_answer_choiceinput1').contains(`mouse`).click();
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#__number6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.1')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('have.text', `Squeak`)
    cy.get('#\\/_p7').should('not.exist')

    cy.log("submit banana")
    cy.get('#_answer_choiceinput1').contains(`banana`).click();
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#__number6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/_p3').should('not.exist')
    cy.get('#\\/_p4').should('not.exist')
    cy.get('#\\/_p5').should('not.exist')
    cy.get('#\\/_p6').should('not.exist')
    cy.get('#\\/_p7').should('have.text', `Huh?`)

  });

  it('feedback for any incorrect response', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer type="text">hello there</answer></p>
  <feedback>
    <if>
      <ref prop="creditAchieved">_answer1</ref> != 1
      and <ref prop="responsehasbeensubmitted">_answer1</ref>
    </if>
    <p>Your response <em><ref prop="submittedresponse">_answer1</ref></em> is incorrect.</p>
  </feedback>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('Test value displayed in browser')
    cy.get('#_answer_textinput1_input').should('have.value', '');
    cy.get('#\\/_p2').should('not.exist')

    cy.log("Enter incorrect answer in")
    cy.get('#_answer_textinput1_input').clear().type(`wrong{enter}`);
    cy.get('#_answer_textinput1_input').should('have.value', 'wrong');
    cy.get('#\\/_p2').should('have.text', 'Your response wrong is incorrect.');

    cy.log("Enter correct answer")
    cy.get('#_answer_textinput1_input').clear().type(`hello there{enter}`);
    cy.get('#_answer_textinput1_input').should('have.value', 'hello there');
    cy.get('#\\/_p2').should('not.exist');

    cy.log("Enter blank answer")
    cy.get('#_answer_textinput1_input').clear().type("{enter}");
    cy.get('#_answer_textinput1_input').should('have.value', '');
    cy.get('#\\/_p2').should('have.text', 'Your response  is incorrect.');

    cy.log("Enter another incorrect answer in")
    cy.get('#_answer_textinput1_input').clear().type(`bye{enter}`);
    cy.get('#_answer_textinput1_input').should('have.value', 'bye');
    cy.get('#\\/_p2').should('have.text', 'Your response bye is incorrect.');

  });

  it('feedback defined in awards', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><answer>
    <award feedbackcode="goodjob">sin(pi x)</award>
    <award credit="0.7" feedbacktext="Close, but wrong trignometric function">cos(pi x)</award>
    <award credit="0.3" feedbacktext="You lost pi">sin(x)</award>
  </answer></p>

  <p>Award 1 feedback:</p>
  <aside><ref prop="feedback">_award1</ref></aside>
  
  <p>Award 2 feedback:</p>
  <aside><ref prop="feedback">_award2</ref></aside>

  <p>Award 3 feedback:</p>
  <aside><ref prop="feedback">_award3</ref></aside>

  <p>Answer feedbacks:</p>
  <aside><ref prop="feedbacks">_answer1</ref></aside>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('Test value displayed in browser')
    cy.get('#_answer_mathinput1_input').should('have.value', '');
    cy.get('#\\/_aside1').should('have.text','')
    cy.get('#\\/_aside2').should('have.text','')
    cy.get('#\\/_aside3').should('have.text','')
    cy.get('#\\/_aside4').should('have.text','')
    cy.get('#_answer_mathinput1_submit').should('be.visible');

    cy.log('submit blank answer');
    cy.get('#_answer_mathinput1_submit').click();

    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','')
    cy.get('#\\/_aside2').should('have.text','')
    cy.get('#\\/_aside3').should('have.text','')
    cy.get('#\\/_aside4').should('have.text','')


    cy.log("Type sin(pi x)")
    cy.get('#_answer_mathinput1_input').clear().type(`sin(pi x)`);

    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','')
    cy.get('#\\/_aside2').should('have.text','')
    cy.get('#\\/_aside3').should('have.text','')
    cy.get('#\\/_aside4').should('have.text','')


    cy.log("Blur")
    cy.get('#_answer_mathinput1_input').blur();
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','')
    cy.get('#\\/_aside2').should('have.text','')
    cy.get('#\\/_aside3').should('have.text','')
    cy.get('#\\/_aside4').should('have.text','')


    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();
    cy.get('#_answer_mathinput1_correct').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','Good job!')
    cy.get('#\\/_aside2').should('have.text','')
    cy.get('#\\/_aside3').should('have.text','')
    cy.get('#\\/_aside4').should('have.text','Good job!')



    cy.log("Type cos(pi x)")
    cy.get('#_answer_mathinput1_input').clear().type(`cos(pi x)`);
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','Good job!')
    cy.get('#\\/_aside2').should('have.text','')
    cy.get('#\\/_aside3').should('have.text','')
    cy.get('#\\/_aside4').should('have.text','Good job!')


    cy.log("Blur")
    cy.get('#_answer_mathinput1_input').blur();
    cy.get('#_answer_mathinput1_submit').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','Good job!')
    cy.get('#\\/_aside2').should('have.text','')
    cy.get('#\\/_aside3').should('have.text','')
    cy.get('#\\/_aside4').should('have.text','Good job!')


    cy.log("Submit answer")
    cy.get('#_answer_mathinput1_submit').click();
    cy.get('#_answer_mathinput1_partial').should('have.text', '70 %');
    cy.get('#\\/_aside1').should('have.text','')
    cy.get('#\\/_aside2').should('have.text','Close, but wrong trignometric function')
    cy.get('#\\/_aside3').should('have.text','')
    cy.get('#\\/_aside4').should('have.text','Close, but wrong trignometric function')


    cy.log("Enter x")
    cy.get('#_answer_mathinput1_input').clear().type(`x{enter}`);
    cy.get('#_answer_mathinput1_incorrect').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','')
    cy.get('#\\/_aside2').should('have.text','')
    cy.get('#\\/_aside3').should('have.text','')
    cy.get('#\\/_aside4').should('have.text','')

    cy.log("Enter sin(x)")
    cy.get('#_answer_mathinput1_input').clear().type(`sin(x){enter}`);
    cy.get('#_answer_mathinput1_partial').should('have.text', '30 %');
    cy.get('#\\/_aside1').should('have.text','')
    cy.get('#\\/_aside2').should('have.text','')
    cy.get('#\\/_aside3').should('have.text','You lost pi')
    cy.get('#\\/_aside4').should('have.text','You lost pi')


  });

  it('feedback defined in choices', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>
    <answer>
      <choice feedbacktext="meow" credit="0.5">cat</choice>
      <choice feedbackcode="goodjob" credit="1">dog</choice>
      <choice>monkey</choice>
    </answer>
  </p>

  <p>Answer feedbacks:</p>
  <aside><ref prop="feedbacks">_answer1</ref></aside>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('Test value displayed in browser')
    cy.get('#_answer_choiceinput1').should('have.value', '');
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','')

    cy.log("Select correct answer")
    cy.get('#_answer_choiceinput1').contains(`dog`).click();
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','')

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','Good job!')

    cy.log("Select half correct answer")
    cy.get('#_answer_choiceinput1').contains(`cat`).click();
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','Good job!')

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/_aside1').should('have.text','meow')

    cy.log("Select half incorrect answer")
    cy.get('#_answer_choiceinput1').contains(`monkey`).click();
    cy.get('#_answer_choiceinput1_submit').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','meow')

    cy.log("Click submit button")
    cy.get('#_answer_choiceinput1_submit').click();
    cy.get('#_answer_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_aside1').should('have.text','')


  });


});