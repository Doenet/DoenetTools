describe('Problem Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('problems default to weight 1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <title>Activity</title>
    <p>Credit achieved for <ref prop="title">_document1</ref>:
    <ref prop="creditAchieved">_document1</ref>, or <ref prop="percentcreditachieved">_document1</ref>%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <problem title="Problem 1" name="problem1">
      <p>Credit achieved for <ref prop="title">problem1</ref>:
      <ref prop="creditAchieved">problem1</ref>, or <ref prop="percentcreditachieved">problem1</ref>%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </problem>
    <problem title="Problem 2" name="problem2">
      <p>Credit achieved for <ref prop="title">problem2</ref>:
      <ref prop="creditAchieved">problem2</ref>, or <ref prop="percentcreditachieved">problem2</ref>%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <problem title="Problem 2.1" name="problem21">
        <p>Credit achieved for <ref prop="title">problem21</ref>:
        <ref prop="creditAchieved">problem21</ref>, or <ref prop="percentcreditachieved">problem21</ref>%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </problem>
      <problem title="Problem 2.2" name="problem22">
        <p>Credit achieved for <ref prop="title">problem22</ref>:
        <ref prop="creditAchieved">problem22</ref>, or <ref prop="percentcreditachieved">problem22</ref>%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <problem title="Problem 2.2.1" name="problem221">
          <p>Credit achieved for <ref prop="title">problem221</ref>:
          <ref prop="creditAchieved">problem221</ref>, or <ref prop="percentcreditachieved">problem221</ref>%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </problem>
        <problem title="Problem 2.2.2" name="problem222">
          <p>Credit achieved for <ref prop="title">problem222</ref>:
          <ref prop="creditAchieved">problem222</ref>, or <ref prop="percentcreditachieved">problem222</ref>%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </problem>
      </problem>

    </problem>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_document1_heading').should('have.text', 'Activity')
    
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).eq(0);
      expect(components['/_document1'].state.percentcreditachieved).eq(0);
      expect(components['/problem1'].state.creditAchieved).eq(0);
      expect(components['/problem1'].state.percentcreditachieved).eq(0);
      expect(components['/problem2'].state.creditAchieved).eq(0);
      expect(components['/problem2'].state.percentcreditachieved).eq(0);
      expect(components['/problem21'].state.creditAchieved).eq(0);
      expect(components['/problem21'].state.percentcreditachieved).eq(0);
      expect(components['/problem22'].state.creditAchieved).eq(0);
      expect(components['/problem22'].state.percentcreditachieved).eq(0);
      expect(components['/problem221'].state.creditAchieved).eq(0);
      expect(components['/problem221'].state.percentcreditachieved).eq(0);
      expect(components['/problem222'].state.creditAchieved).eq(0);
      expect(components['/problem222'].state.percentcreditachieved).eq(0);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
      expect(components['/_answer5'].state.creditAchieved).eq(0);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
      expect(components['/_answer7'].state.creditAchieved).eq(0);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
      expect(components['/_answer9'].state.creditAchieved).eq(0);
    })

    cy.log('enter first correct answer');
    cy.get('#_answer_mathinput1_input').type(`u{enter}`);

    let credit1 = 1/3;
    let credit1Round = Math.round(1000*credit1)/1000;
    let percentCredit1 = credit1*100;
    let percentCredit1Round = Math.round(10*percentCredit1)/10;

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(credit1Round.toString())
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(percentCredit1Round.toString())
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).closeTo(credit1,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit1, 1E-12);
      expect(components['/problem1'].state.creditAchieved).eq(0);
      expect(components['/problem1'].state.percentcreditachieved).eq(0);
      expect(components['/problem2'].state.creditAchieved).eq(0);
      expect(components['/problem2'].state.percentcreditachieved).eq(0);
      expect(components['/problem21'].state.creditAchieved).eq(0);
      expect(components['/problem21'].state.percentcreditachieved).eq(0);
      expect(components['/problem22'].state.creditAchieved).eq(0);
      expect(components['/problem22'].state.percentcreditachieved).eq(0);
      expect(components['/problem221'].state.creditAchieved).eq(0);
      expect(components['/problem221'].state.percentcreditachieved).eq(0);
      expect(components['/problem222'].state.creditAchieved).eq(0);
      expect(components['/problem222'].state.percentcreditachieved).eq(0);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
      expect(components['/_answer5'].state.creditAchieved).eq(0);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
      expect(components['/_answer7'].state.creditAchieved).eq(0);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
      expect(components['/_answer9'].state.creditAchieved).eq(0);
    })


    cy.log('enter additional correct answers');
    cy.get('#_answer_mathinput3_input').type(`y{enter}`);
    cy.get('#_answer_mathinput5_input').type(`v{enter}`);
    cy.get('#_answer_mathinput7_input').type(`q{enter}`);

    let problem1credit2 = 2/3;
    let problem1credit2Round = Math.round(1000*problem1credit2)/1000;
    let problem1percentCredit2 = problem1credit2*100;
    let problem1percentCredit2Round = Math.round(10*problem1percentCredit2)/10;

    let problem21credit2 = 1/3;
    let problem21credit2Round = Math.round(1000*problem21credit2)/1000;
    let problem21percentCredit2 = problem21credit2*100;
    let problem21percentCredit2Round = Math.round(10*problem21percentCredit2)/10;

    let problem22credit2 = 1/3;
    let problem22credit2Round = Math.round(1000*problem22credit2)/1000;
    let problem22percentCredit2 = problem22credit2*100;
    let problem22percentCredit2Round = Math.round(10*problem22percentCredit2)/10;

    let problem2credit2 = (problem21credit2 + problem22credit2)/3
    let problem2credit2Round = Math.round(1000*problem2credit2)/1000;
    let problem2percentCredit2 = problem2credit2*100;
    let problem2percentCredit2Round = Math.round(10*problem2percentCredit2)/10;;

    let credit2 = (1+problem1credit2+problem2credit2)/3;
    let credit2Round = Math.round(1000*credit2)/1000;
    let percentCredit2 = credit2*100;
    let percentCredit2Round = Math.round(10*percentCredit2)/10;

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(credit2Round.toString())
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(percentCredit2Round.toString())
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1credit2Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1percentCredit2Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2credit2Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2percentCredit2Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21credit2Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21percentCredit2Round.toString())
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22credit2Round.toString())
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22percentCredit2Round.toString())
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).closeTo(credit2,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit2, 1E-12);
      expect(components['/problem1'].state.creditAchieved).closeTo(problem1credit2,1E-12);
      expect(components['/problem1'].state.percentcreditachieved).closeTo(problem1percentCredit2,1E-12);
      expect(components['/problem2'].state.creditAchieved).closeTo(problem2credit2,1E-12);
      expect(components['/problem2'].state.percentcreditachieved).closeTo(problem2percentCredit2,1E-12);
      expect(components['/problem21'].state.creditAchieved).closeTo(problem21credit2,1E-12)
      expect(components['/problem21'].state.percentcreditachieved).closeTo(problem21percentCredit2,1E-12);
      expect(components['/problem22'].state.creditAchieved).closeTo(problem22credit2,1E-12)
      expect(components['/problem22'].state.percentcreditachieved).closeTo(problem22percentCredit2,1E-12);
      expect(components['/problem221'].state.creditAchieved).eq(0);
      expect(components['/problem221'].state.percentcreditachieved).eq(0);
      expect(components['/problem222'].state.creditAchieved).eq(0);
      expect(components['/problem222'].state.percentcreditachieved).eq(0);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
      expect(components['/_answer5'].state.creditAchieved).eq(1);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
      expect(components['/_answer7'].state.creditAchieved).eq(1);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
      expect(components['/_answer9'].state.creditAchieved).eq(0);
    })

    cy.log('enter most other correct answers');
    cy.get('#_answer_mathinput2_input').type(`x{enter}`);
    cy.get('#_answer_mathinput4_input').type(`z{enter}`);
    cy.get('#_answer_mathinput6_input').type(`w{enter}`);
    cy.get('#_answer_mathinput8_input').type(`r{enter}`);


    let problem1credit3 = 1;
    let problem1credit3Round = Math.round(1000*problem1credit3)/1000;
    let problem1percentCredit3 = problem1credit3*100;
    let problem1percentCredit3Round = Math.round(10*problem1percentCredit3)/10;

    let problem21credit3 = 1;
    let problem21credit3Round = Math.round(1000*problem21credit3)/1000;
    let problem21percentCredit3 = problem21credit3*100;
    let problem21percentCredit3Round = Math.round(10*problem21percentCredit3)/10;

    let problem221credit3 = 1;
    let problem221credit3Round = Math.round(1000*problem221credit3)/1000;
    let problem221percentCredit3 = problem221credit3*100;
    let problem221percentCredit3Round = Math.round(10*problem221percentCredit3)/10;

    let problem22credit3 = (problem221credit3+1)/3;
    let problem22credit3Round = Math.round(1000*problem22credit3)/1000;
    let problem22percentCredit3 = problem22credit3*100;
    let problem22percentCredit3Round = Math.round(10*problem22percentCredit3)/10;

    let problem2credit3 = (problem21credit3+problem22credit3+1)/3
    let problem2credit3Round = Math.round(1000*problem2credit3)/1000;
    let problem2percentCredit3 = problem2credit3*100;
    let problem2percentCredit3Round = Math.round(10*problem2percentCredit3)/10;;

    let credit3 = (1+problem1credit3+problem2credit3)/3;
    let credit3Round = Math.round(1000*credit3)/1000;
    let percentCredit3 = credit3*100;
    let percentCredit3Round = Math.round(10*percentCredit3)/10;

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(credit3Round.toString())
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(percentCredit3Round.toString())
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1credit3Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1percentCredit3Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2credit3Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2percentCredit3Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21credit3Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21percentCredit3Round.toString())
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22credit3Round.toString())
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22percentCredit3Round.toString())
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem221credit3Round.toString())
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem221percentCredit3Round.toString())
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).closeTo(credit3,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit3, 1E-12);
      expect(components['/problem1'].state.creditAchieved).closeTo(problem1credit3,1E-12);
      expect(components['/problem1'].state.percentcreditachieved).closeTo(problem1percentCredit3,1E-12);
      expect(components['/problem2'].state.creditAchieved).closeTo(problem2credit3,1E-12);
      expect(components['/problem2'].state.percentcreditachieved).closeTo(problem2percentCredit3,1E-12);
      expect(components['/problem21'].state.creditAchieved).closeTo(problem21credit3,1E-12)
      expect(components['/problem21'].state.percentcreditachieved).closeTo(problem21percentCredit3,1E-12);
      expect(components['/problem22'].state.creditAchieved).closeTo(problem22credit3,1E-12)
      expect(components['/problem22'].state.percentcreditachieved).closeTo(problem22percentCredit3,1E-12);
      expect(components['/problem221'].state.creditAchieved).closeTo(problem221credit3,1E-12);
      expect(components['/problem221'].state.percentcreditachieved).closeTo(problem221percentCredit3,1E-12);;
      expect(components['/problem222'].state.creditAchieved).eq(0);
      expect(components['/problem222'].state.percentcreditachieved).eq(0);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
      expect(components['/_answer5'].state.creditAchieved).eq(1);
      expect(components['/_answer6'].state.creditAchieved).eq(1);
      expect(components['/_answer7'].state.creditAchieved).eq(1);
      expect(components['/_answer8'].state.creditAchieved).eq(1);
      expect(components['/_answer9'].state.creditAchieved).eq(0);
    })

    cy.log('enter last correct answer');
    cy.get('#_answer_mathinput9_input').type(`s{enter}`);


    let problem1credit4 = 1;
    let problem1credit4Round = Math.round(1000*problem1credit4)/1000;
    let problem1percentCredit4 = problem1credit4*100;
    let problem1percentCredit4Round = Math.round(10*problem1percentCredit4)/10;

    let problem221credit4 = 1;
    let problem221credit4Round = Math.round(1000*problem221credit4)/1000;
    let problem221percentCredit4 = problem221credit4*100;
    let problem221percentCredit4Round = Math.round(10*problem221percentCredit4)/10;

    let problem222credit4 = 1;
    let problem222credit4Round = Math.round(1000*problem222credit4)/1000;
    let problem222percentCredit4 = problem222credit4*100;
    let problem222percentCredit4Round = Math.round(10*problem222percentCredit4)/10;

    let problem21credit4 = 1;
    let problem21credit4Round = Math.round(1000*problem21credit4)/1000;
    let problem21percentCredit4 = problem21credit4*100;
    let problem21percentCredit4Round = Math.round(10*problem21percentCredit4)/10;

    let problem22credit4 = 1;
    let problem22credit4Round = Math.round(1000*problem22credit4)/1000;
    let problem22percentCredit4 = problem22credit4*100;
    let problem22percentCredit4Round = Math.round(10*problem22percentCredit4)/10;

    let problem2credit4 = 1;
    let problem2credit4Round = Math.round(1000*problem2credit4)/1000;
    let problem2percentCredit4 = problem2credit4*100;
    let problem2percentCredit4Round = Math.round(10*problem2percentCredit4)/10;;

    let credit4 = (1+problem1credit4+problem2credit4)/3;
    let credit4Round = Math.round(1000*credit4)/1000;
    let percentCredit4 = credit4*100;
    let percentCredit4Round = Math.round(10*percentCredit4)/10;

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(credit4Round.toString())
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(percentCredit4Round.toString())
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1credit4Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1percentCredit4Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2credit4Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2percentCredit4Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21credit4Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21percentCredit4Round.toString())
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22credit4Round.toString())
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22percentCredit4Round.toString())
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem221credit4Round.toString())
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem221percentCredit4Round.toString())
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem222credit4Round.toString())
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem222percentCredit4Round.toString())
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).closeTo(credit4,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit4, 1E-12);
      expect(components['/problem1'].state.creditAchieved).closeTo(problem1credit4,1E-12);
      expect(components['/problem1'].state.percentcreditachieved).closeTo(problem1percentCredit4,1E-12);
      expect(components['/problem2'].state.creditAchieved).closeTo(problem2credit4,1E-12);
      expect(components['/problem2'].state.percentcreditachieved).closeTo(problem2percentCredit4,1E-12);
      expect(components['/problem21'].state.creditAchieved).closeTo(problem21credit4,1E-12)
      expect(components['/problem21'].state.percentcreditachieved).closeTo(problem21percentCredit4,1E-12);
      expect(components['/problem22'].state.creditAchieved).closeTo(problem22credit4,1E-12)
      expect(components['/problem22'].state.percentcreditachieved).closeTo(problem22percentCredit4,1E-12);
      expect(components['/problem221'].state.creditAchieved).closeTo(problem221credit4,1E-12);
      expect(components['/problem221'].state.percentcreditachieved).closeTo(problem221percentCredit4,1E-12);;
      expect(components['/problem222'].state.creditAchieved).closeTo(problem222credit4,1E-12);
      expect(components['/problem222'].state.percentcreditachieved).closeTo(problem222percentCredit4,1E-12);;
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
      expect(components['/_answer5'].state.creditAchieved).eq(1);
      expect(components['/_answer6'].state.creditAchieved).eq(1);
      expect(components['/_answer7'].state.creditAchieved).eq(1);
      expect(components['/_answer8'].state.creditAchieved).eq(1);
      expect(components['/_answer9'].state.creditAchieved).eq(1);
    })

  });

  it('problems with weights', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <title>Activity</title>
    <p>Credit achieved for <ref prop="title">_document1</ref>:
    <ref prop="creditAchieved">_document1</ref>, or <ref prop="percentcreditachieved">_document1</ref>%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <problem title="Problem 1" name="problem1" weight="0.5">
      <p>Credit achieved for <ref prop="title">problem1</ref>:
      <ref prop="creditAchieved">problem1</ref>, or <ref prop="percentcreditachieved">problem1</ref>%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </problem>
    <problem title="Problem 2" name="problem2" weight="2">
      <p>Credit achieved for <ref prop="title">problem2</ref>:
      <ref prop="creditAchieved">problem2</ref>, or <ref prop="percentcreditachieved">problem2</ref>%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <problem title="Problem 2.1" name="problem21" weight="3">
        <p>Credit achieved for <ref prop="title">problem21</ref>:
        <ref prop="creditAchieved">problem21</ref>, or <ref prop="percentcreditachieved">problem21</ref>%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </problem>
      <problem title="Problem 2.2" name="problem22" weight="4">
        <p>Credit achieved for <ref prop="title">problem22</ref>:
        <ref prop="creditAchieved">problem22</ref>, or <ref prop="percentcreditachieved">problem22</ref>%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <problem title="Problem 2.2.1" name="problem221" weight="5">
          <p>Credit achieved for <ref prop="title">problem221</ref>:
          <ref prop="creditAchieved">problem221</ref>, or <ref prop="percentcreditachieved">problem221</ref>%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </problem>
        <problem title="Problem 2.2.2" name="problem222" weight="1">
          <p>Credit achieved for <ref prop="title">problem222</ref>:
          <ref prop="creditAchieved">problem222</ref>, or <ref prop="percentcreditachieved">problem222</ref>%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </problem>
      </problem>

    </problem>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_document1_heading').should('have.text', 'Activity')
    
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).eq(0);
      expect(components['/_document1'].state.percentcreditachieved).eq(0);
      expect(components['/problem1'].state.creditAchieved).eq(0);
      expect(components['/problem1'].state.percentcreditachieved).eq(0);
      expect(components['/problem2'].state.creditAchieved).eq(0);
      expect(components['/problem2'].state.percentcreditachieved).eq(0);
      expect(components['/problem21'].state.creditAchieved).eq(0);
      expect(components['/problem21'].state.percentcreditachieved).eq(0);
      expect(components['/problem22'].state.creditAchieved).eq(0);
      expect(components['/problem22'].state.percentcreditachieved).eq(0);
      expect(components['/problem221'].state.creditAchieved).eq(0);
      expect(components['/problem221'].state.percentcreditachieved).eq(0);
      expect(components['/problem222'].state.creditAchieved).eq(0);
      expect(components['/problem222'].state.percentcreditachieved).eq(0);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
      expect(components['/_answer5'].state.creditAchieved).eq(0);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
      expect(components['/_answer7'].state.creditAchieved).eq(0);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
      expect(components['/_answer9'].state.creditAchieved).eq(0);
    })

    cy.log('enter first correct answer');
    cy.get('#_answer_mathinput1_input').type(`u{enter}`);

    let credit1 = 1/3.5;
    let credit1Round = Math.round(1000*credit1)/1000;
    let percentCredit1 = credit1*100;
    let percentCredit1Round = Math.round(10*percentCredit1)/10;

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(credit1Round.toString())
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(percentCredit1Round.toString())
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).closeTo(credit1,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit1, 1E-12);
      expect(components['/problem1'].state.creditAchieved).eq(0);
      expect(components['/problem1'].state.percentcreditachieved).eq(0);
      expect(components['/problem2'].state.creditAchieved).eq(0);
      expect(components['/problem2'].state.percentcreditachieved).eq(0);
      expect(components['/problem21'].state.creditAchieved).eq(0);
      expect(components['/problem21'].state.percentcreditachieved).eq(0);
      expect(components['/problem22'].state.creditAchieved).eq(0);
      expect(components['/problem22'].state.percentcreditachieved).eq(0);
      expect(components['/problem221'].state.creditAchieved).eq(0);
      expect(components['/problem221'].state.percentcreditachieved).eq(0);
      expect(components['/problem222'].state.creditAchieved).eq(0);
      expect(components['/problem222'].state.percentcreditachieved).eq(0);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(0);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
      expect(components['/_answer5'].state.creditAchieved).eq(0);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
      expect(components['/_answer7'].state.creditAchieved).eq(0);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
      expect(components['/_answer9'].state.creditAchieved).eq(0);
    })


    cy.log('enter additional correct answers');
    cy.get('#_answer_mathinput3_input').type(`y{enter}`);
    cy.get('#_answer_mathinput5_input').type(`v{enter}`);
    cy.get('#_answer_mathinput7_input').type(`q{enter}`);

    let problem1credit2 = 2/3;
    let problem1credit2Round = Math.round(1000*problem1credit2)/1000;
    let problem1percentCredit2 = problem1credit2*100;
    let problem1percentCredit2Round = Math.round(10*problem1percentCredit2)/10;

    let problem21credit2 = 1/3;
    let problem21credit2Round = Math.round(1000*problem21credit2)/1000;
    let problem21percentCredit2 = problem21credit2*100;
    let problem21percentCredit2Round = Math.round(10*problem21percentCredit2)/10;

    let problem22credit2 = 1/7;
    let problem22credit2Round = Math.round(1000*problem22credit2)/1000;
    let problem22percentCredit2 = problem22credit2*100;
    let problem22percentCredit2Round = Math.round(10*problem22percentCredit2)/10;

    let problem2credit2 = (3*problem21credit2+4*problem22credit2)/8
    let problem2credit2Round = Math.round(1000*problem2credit2)/1000;
    let problem2percentCredit2 = problem2credit2*100;
    let problem2percentCredit2Round = Math.round(10*problem2percentCredit2)/10;;

    let credit2 = (1+0.5*problem1credit2+2*problem2credit2)/3.5;
    let credit2Round = Math.round(1000*credit2)/1000;
    let percentCredit2 = credit2*100;
    let percentCredit2Round = Math.round(10*percentCredit2)/10;

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(credit2Round.toString())
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(percentCredit2Round.toString())
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1credit2Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1percentCredit2Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2credit2Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2percentCredit2Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21credit2Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21percentCredit2Round.toString())
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22credit2Round.toString())
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22percentCredit2Round.toString())
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).closeTo(credit2,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit2, 1E-12);
      expect(components['/problem1'].state.creditAchieved).closeTo(problem1credit2,1E-12);
      expect(components['/problem1'].state.percentcreditachieved).closeTo(problem1percentCredit2,1E-12);
      expect(components['/problem2'].state.creditAchieved).closeTo(problem2credit2,1E-12);
      expect(components['/problem2'].state.percentcreditachieved).closeTo(problem2percentCredit2,1E-12);
      expect(components['/problem21'].state.creditAchieved).closeTo(problem21credit2,1E-12)
      expect(components['/problem21'].state.percentcreditachieved).closeTo(problem21percentCredit2,1E-12);
      expect(components['/problem22'].state.creditAchieved).closeTo(problem22credit2,1E-12)
      expect(components['/problem22'].state.percentcreditachieved).closeTo(problem22percentCredit2,1E-12);
      expect(components['/problem221'].state.creditAchieved).eq(0);
      expect(components['/problem221'].state.percentcreditachieved).eq(0);
      expect(components['/problem222'].state.creditAchieved).eq(0);
      expect(components['/problem222'].state.percentcreditachieved).eq(0);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(0);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(0);
      expect(components['/_answer5'].state.creditAchieved).eq(1);
      expect(components['/_answer6'].state.creditAchieved).eq(0);
      expect(components['/_answer7'].state.creditAchieved).eq(1);
      expect(components['/_answer8'].state.creditAchieved).eq(0);
      expect(components['/_answer9'].state.creditAchieved).eq(0);
    })

    cy.log('enter most other correct answers');
    cy.get('#_answer_mathinput2_input').type(`x{enter}`);
    cy.get('#_answer_mathinput4_input').type(`z{enter}`);
    cy.get('#_answer_mathinput6_input').type(`w{enter}`);
    cy.get('#_answer_mathinput8_input').type(`r{enter}`);


    let problem1credit3 = 1;
    let problem1credit3Round = Math.round(1000*problem1credit3)/1000;
    let problem1percentCredit3 = problem1credit3*100;
    let problem1percentCredit3Round = Math.round(10*problem1percentCredit3)/10;

    let problem21credit3 = 1;
    let problem21credit3Round = Math.round(1000*problem21credit3)/1000;
    let problem21percentCredit3 = problem21credit3*100;
    let problem21percentCredit3Round = Math.round(10*problem21percentCredit3)/10;

    let problem221credit3 = 1;
    let problem221credit3Round = Math.round(1000*problem221credit3)/1000;
    let problem221percentCredit3 = problem221credit3*100;
    let problem221percentCredit3Round = Math.round(10*problem221percentCredit3)/10;

    let problem22credit3 = 6/7;
    let problem22credit3Round = Math.round(1000*problem22credit3)/1000;
    let problem22percentCredit3 = problem22credit3*100;
    let problem22percentCredit3Round = Math.round(10*problem22percentCredit3)/10;

    let problem2credit3 = (1+3*problem21credit3+4*problem22credit3)/8
    let problem2credit3Round = Math.round(1000*problem2credit3)/1000;
    let problem2percentCredit3 = problem2credit3*100;
    let problem2percentCredit3Round = Math.round(10*problem2percentCredit3)/10;;

    let credit3 = (1+0.5*problem1credit3+2*problem2credit3)/3.5;
    let credit3Round = Math.round(1000*credit3)/1000;
    let percentCredit3 = credit3*100;
    let percentCredit3Round = Math.round(10*percentCredit3)/10;

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(credit3Round.toString())
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(percentCredit3Round.toString())
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1credit3Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1percentCredit3Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2credit3Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2percentCredit3Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21credit3Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21percentCredit3Round.toString())
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22credit3Round.toString())
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22percentCredit3Round.toString())
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem221credit3Round.toString())
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem221percentCredit3Round.toString())
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).closeTo(credit3,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit3, 1E-12);
      expect(components['/problem1'].state.creditAchieved).closeTo(problem1credit3,1E-12);
      expect(components['/problem1'].state.percentcreditachieved).closeTo(problem1percentCredit3,1E-12);
      expect(components['/problem2'].state.creditAchieved).closeTo(problem2credit3,1E-12);
      expect(components['/problem2'].state.percentcreditachieved).closeTo(problem2percentCredit3,1E-12);
      expect(components['/problem21'].state.creditAchieved).closeTo(problem21credit3,1E-12)
      expect(components['/problem21'].state.percentcreditachieved).closeTo(problem21percentCredit3,1E-12);
      expect(components['/problem22'].state.creditAchieved).closeTo(problem22credit3,1E-12)
      expect(components['/problem22'].state.percentcreditachieved).closeTo(problem22percentCredit3,1E-12);
      expect(components['/problem221'].state.creditAchieved).closeTo(problem221credit3,1E-12);
      expect(components['/problem221'].state.percentcreditachieved).closeTo(problem221percentCredit3,1E-12);;
      expect(components['/problem222'].state.creditAchieved).eq(0);
      expect(components['/problem222'].state.percentcreditachieved).eq(0);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
      expect(components['/_answer5'].state.creditAchieved).eq(1);
      expect(components['/_answer6'].state.creditAchieved).eq(1);
      expect(components['/_answer7'].state.creditAchieved).eq(1);
      expect(components['/_answer8'].state.creditAchieved).eq(1);
      expect(components['/_answer9'].state.creditAchieved).eq(0);
    })

    cy.log('enter last correct answer');
    cy.get('#_answer_mathinput9_input').type(`s{enter}`);


    let problem1credit4 = 1;
    let problem1credit4Round = Math.round(1000*problem1credit4)/1000;
    let problem1percentCredit4 = problem1credit4*100;
    let problem1percentCredit4Round = Math.round(10*problem1percentCredit4)/10;

    let problem21credit4 = 1;
    let problem21credit4Round = Math.round(1000*problem21credit4)/1000;
    let problem21percentCredit4 = problem21credit4*100;
    let problem21percentCredit4Round = Math.round(10*problem21percentCredit4)/10;

    let problem221credit4 = 1;
    let problem221credit4Round = Math.round(1000*problem221credit4)/1000;
    let problem221percentCredit4 = problem221credit4*100;
    let problem221percentCredit4Round = Math.round(10*problem221percentCredit4)/10;

    let problem222credit4 = 1;
    let problem222credit4Round = Math.round(1000*problem222credit4)/1000;
    let problem222percentCredit4 = problem222credit4*100;
    let problem222percentCredit4Round = Math.round(10*problem222percentCredit4)/10;

    let problem22credit4 = 1;
    let problem22credit4Round = Math.round(1000*problem22credit4)/1000;
    let problem22percentCredit4 = problem22credit4*100;
    let problem22percentCredit4Round = Math.round(10*problem22percentCredit4)/10;

    let problem2credit4 = 1;
    let problem2credit4Round = Math.round(1000*problem2credit4)/1000;
    let problem2percentCredit4 = problem2credit4*100;
    let problem2percentCredit4Round = Math.round(10*problem2percentCredit4)/10;;

    let credit4 = (1+problem1credit4+problem2credit4)/3;
    let credit4Round = Math.round(1000*credit4)/1000;
    let percentCredit4 = credit4*100;
    let percentCredit4Round = Math.round(10*percentCredit4)/10;

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(credit4Round.toString())
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(percentCredit4Round.toString())
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1credit4Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem1percentCredit4Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2credit4Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem2percentCredit4Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21credit4Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem21percentCredit4Round.toString())
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22credit4Round.toString())
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem22percentCredit4Round.toString())
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem221credit4Round.toString())
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem221percentCredit4Round.toString())
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem222credit4Round.toString())
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(problem222percentCredit4Round.toString())
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).closeTo(credit4,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit4, 1E-12);
      expect(components['/problem1'].state.creditAchieved).closeTo(problem1credit4,1E-12);
      expect(components['/problem1'].state.percentcreditachieved).closeTo(problem1percentCredit4,1E-12);
      expect(components['/problem2'].state.creditAchieved).closeTo(problem2credit4,1E-12);
      expect(components['/problem2'].state.percentcreditachieved).closeTo(problem2percentCredit4,1E-12);
      expect(components['/problem21'].state.creditAchieved).closeTo(problem21credit4,1E-12)
      expect(components['/problem21'].state.percentcreditachieved).closeTo(problem21percentCredit4,1E-12);
      expect(components['/problem22'].state.creditAchieved).closeTo(problem22credit4,1E-12)
      expect(components['/problem22'].state.percentcreditachieved).closeTo(problem22percentCredit4,1E-12);
      expect(components['/problem221'].state.creditAchieved).closeTo(problem221credit4,1E-12);
      expect(components['/problem221'].state.percentcreditachieved).closeTo(problem221percentCredit4,1E-12);;
      expect(components['/problem222'].state.creditAchieved).closeTo(problem222credit4,1E-12);
      expect(components['/problem222'].state.percentcreditachieved).closeTo(problem222percentCredit4,1E-12);;
      expect(components['/_answer1'].state.creditAchieved).eq(1);
      expect(components['/_answer2'].state.creditAchieved).eq(1);
      expect(components['/_answer3'].state.creditAchieved).eq(1);
      expect(components['/_answer4'].state.creditAchieved).eq(1);
      expect(components['/_answer5'].state.creditAchieved).eq(1);
      expect(components['/_answer6'].state.creditAchieved).eq(1);
      expect(components['/_answer7'].state.creditAchieved).eq(1);
      expect(components['/_answer8'].state.creditAchieved).eq(1);
      expect(components['/_answer9'].state.creditAchieved).eq(1);
    })

  });

});