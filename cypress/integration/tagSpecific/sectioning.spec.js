describe('Sectioning Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('sections default to not aggregating scores', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <title>Activity</title>
    <p>Credit achieved for <ref prop="title">_document1</ref>:
    <ref prop="creditAchieved">_document1</ref>, or <ref prop="percentcreditachieved">_document1</ref>%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <section title="Section 1" name="section1">
      <p>Credit achieved for <ref prop="title">section1</ref>:
      <ref prop="creditAchieved">section1</ref>, or <ref prop="percentcreditachieved">section1</ref>%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </section>
    <section title="Section 2" name="section2">
      <p>Credit achieved for <ref prop="title">section2</ref>:
      <ref prop="creditAchieved">section2</ref>, or <ref prop="percentcreditachieved">section2</ref>%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <subsection title="Section 2.1" name="section21">
        <p>Credit achieved for <ref prop="title">section21</ref>:
        <ref prop="creditAchieved">section21</ref>, or <ref prop="percentcreditachieved">section21</ref>%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </subsection>
      <subsection title="Section 2.2" name="section22">
        <p>Credit achieved for <ref prop="title">section22</ref>:
        <ref prop="creditAchieved">section22</ref>, or <ref prop="percentcreditachieved">section22</ref>%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <subsubsection title="Section 2.2.1" name="section221">
          <p>Credit achieved for <ref prop="title">section221</ref>:
          <ref prop="creditAchieved">section221</ref>, or <ref prop="percentcreditachieved">section221</ref>%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </subsubsection>
        <subsubsection title="Section 2.2.2" name="section222">
          <p>Credit achieved for <ref prop="title">section222</ref>:
          <ref prop="creditAchieved">section222</ref>, or <ref prop="percentcreditachieved">section222</ref>%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    `}, "*");
    });

    let weight = [1,1,2,1,0.5,1,1,1,3]
    let totWeight = weight.reduce((a,b)=>a+b);

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
      expect(components['/section1'].state.creditAchieved).eq(0);
      expect(components['/section1'].state.percentcreditachieved).eq(0);
      expect(components['/section2'].state.creditAchieved).eq(0);
      expect(components['/section2'].state.percentcreditachieved).eq(0);
      expect(components['/section21'].state.creditAchieved).eq(0);
      expect(components['/section21'].state.percentcreditachieved).eq(0);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).eq(0);
      expect(components['/section221'].state.percentcreditachieved).eq(0);
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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

    let credit1 = weight[0]/totWeight;
    let credit1Round = Math.round(10000*credit1)/10000;
    let percentCredit1 = credit1*100;
    let percentCredit1Round = credit1Round*100;

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
      expect(components['/section1'].state.creditAchieved).eq(0);
      expect(components['/section1'].state.percentcreditachieved).eq(0);
      expect(components['/section2'].state.creditAchieved).eq(0);
      expect(components['/section2'].state.percentcreditachieved).eq(0);
      expect(components['/section21'].state.creditAchieved).eq(0);
      expect(components['/section21'].state.percentcreditachieved).eq(0);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).eq(0);
      expect(components['/section221'].state.percentcreditachieved).eq(0);
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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

    let credit2 = (weight[0]+weight[2]+weight[4]+weight[6])/totWeight;
    let credit2Round = Math.round(1000*credit2)/1000;
    let percentCredit2 = credit2*100;
    let percentCredit2Round = credit2Round*100;

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(credit2Round.toString())
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(percentCredit2Round.toString())
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
      expect(components['/_document1'].state.creditAchieved).closeTo(credit2,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit2, 1E-12);
      expect(components['/section1'].state.creditAchieved).eq(0);
      expect(components['/section1'].state.percentcreditachieved).eq(0);
      expect(components['/section2'].state.creditAchieved).eq(0);
      expect(components['/section2'].state.percentcreditachieved).eq(0);
      expect(components['/section21'].state.creditAchieved).eq(0);
      expect(components['/section21'].state.percentcreditachieved).eq(0);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).eq(0);
      expect(components['/section221'].state.percentcreditachieved).eq(0);
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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

    let credit3 = 1-weight[8]/totWeight;
    let credit3Round = Math.round(1000*credit3)/1000;
    let percentCredit3 = credit3*100;
    let percentCredit3Round = credit3Round*100;

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(credit3Round.toString())
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(percentCredit3Round.toString())
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
      expect(components['/_document1'].state.creditAchieved).closeTo(credit3,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit3, 1E-12);
      expect(components['/section1'].state.creditAchieved).eq(0);
      expect(components['/section1'].state.percentcreditachieved).eq(0);
      expect(components['/section2'].state.creditAchieved).eq(0);
      expect(components['/section2'].state.percentcreditachieved).eq(0);
      expect(components['/section21'].state.creditAchieved).eq(0);
      expect(components['/section21'].state.percentcreditachieved).eq(0);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).eq(0);
      expect(components['/section221'].state.percentcreditachieved).eq(0);
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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

    let credit4 = 1;
    let credit4Round = Math.round(1000*credit4)/1000;
    let percentCredit4 = credit4*100;
    let percentCredit4Round = credit4Round*100;

    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(credit4Round.toString())
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(percentCredit4Round.toString())
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
      expect(components['/_document1'].state.creditAchieved).closeTo(credit4,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit4, 1E-12);
      expect(components['/section1'].state.creditAchieved).eq(0);
      expect(components['/section1'].state.percentcreditachieved).eq(0);
      expect(components['/section2'].state.creditAchieved).eq(0);
      expect(components['/section2'].state.percentcreditachieved).eq(0);
      expect(components['/section21'].state.creditAchieved).eq(0);
      expect(components['/section21'].state.percentcreditachieved).eq(0);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).eq(0);
      expect(components['/section221'].state.percentcreditachieved).eq(0);
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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

  it('sections aggregating scores default to weight 1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <title>Activity</title>
    <p>Credit achieved for <ref prop="title">_document1</ref>:
    <ref prop="creditAchieved">_document1</ref>, or <ref prop="percentcreditachieved">_document1</ref>%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <section title="Section 1" name="section1" aggregatescores>
      <p>Credit achieved for <ref prop="title">section1</ref>:
      <ref prop="creditAchieved">section1</ref>, or <ref prop="percentcreditachieved">section1</ref>%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </section>
    <section title="Section 2" name="section2" aggregatescores>
      <p>Credit achieved for <ref prop="title">section2</ref>:
      <ref prop="creditAchieved">section2</ref>, or <ref prop="percentcreditachieved">section2</ref>%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <subsection title="Section 2.1" name="section21" aggregatescores>
        <p>Credit achieved for <ref prop="title">section21</ref>:
        <ref prop="creditAchieved">section21</ref>, or <ref prop="percentcreditachieved">section21</ref>%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </subsection>
      <subsection title="Section 2.2" name="section22">
        <p>Credit achieved for <ref prop="title">section22</ref>:
        <ref prop="creditAchieved">section22</ref>, or <ref prop="percentcreditachieved">section22</ref>%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <subsubsection title="Section 2.2.1" name="section221" aggregatescores>
          <p>Credit achieved for <ref prop="title">section221</ref>:
          <ref prop="creditAchieved">section221</ref>, or <ref prop="percentcreditachieved">section221</ref>%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </subsubsection>
        <subsubsection title="Section 2.2.2" name="section222" aggregatescores>
          <p>Credit achieved for <ref prop="title">section222</ref>:
          <ref prop="creditAchieved">section222</ref>, or <ref prop="percentcreditachieved">section222</ref>%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
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
      expect(components['/section1'].state.creditAchieved).eq(0);
      expect(components['/section1'].state.percentcreditachieved).eq(0);
      expect(components['/section2'].state.creditAchieved).eq(0);
      expect(components['/section2'].state.percentcreditachieved).eq(0);
      expect(components['/section21'].state.creditAchieved).eq(0);
      expect(components['/section21'].state.percentcreditachieved).eq(0);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).eq(0);
      expect(components['/section221'].state.percentcreditachieved).eq(0);
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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
      expect(components['/section1'].state.creditAchieved).eq(0);
      expect(components['/section1'].state.percentcreditachieved).eq(0);
      expect(components['/section2'].state.creditAchieved).eq(0);
      expect(components['/section2'].state.percentcreditachieved).eq(0);
      expect(components['/section21'].state.creditAchieved).eq(0);
      expect(components['/section21'].state.percentcreditachieved).eq(0);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).eq(0);
      expect(components['/section221'].state.percentcreditachieved).eq(0);
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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

    let section1credit2 = 2/3;
    let section1credit2Round = Math.round(1000*section1credit2)/1000;
    let section1percentCredit2 = section1credit2*100;
    let section1percentCredit2Round = Math.round(10*section1percentCredit2)/10;

    let section21credit2 = 1/3;
    let section21credit2Round = Math.round(1000*section21credit2)/1000;
    let section21percentCredit2 = section21credit2*100;
    let section21percentCredit2Round = Math.round(10*section21percentCredit2)/10;

    let section2credit2 = (section21credit2+1)/5
    let section2credit2Round = Math.round(1000*section2credit2)/1000;
    let section2percentCredit2 = section2credit2*100;
    let section2percentCredit2Round = Math.round(10*section2percentCredit2)/10;;

    let credit2 = (1+section1credit2+section2credit2)/3;
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
      expect(text.trim()).equal(section1credit2Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section1percentCredit2Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2credit2Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2percentCredit2Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21credit2Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21percentCredit2Round.toString())
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
      expect(components['/_document1'].state.creditAchieved).closeTo(credit2,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit2, 1E-12);
      expect(components['/section1'].state.creditAchieved).closeTo(section1credit2,1E-12);
      expect(components['/section1'].state.percentcreditachieved).closeTo(section1percentCredit2,1E-12);
      expect(components['/section2'].state.creditAchieved).closeTo(section2credit2,1E-12);
      expect(components['/section2'].state.percentcreditachieved).closeTo(section2percentCredit2,1E-12);
      expect(components['/section21'].state.creditAchieved).closeTo(section21credit2,1E-12)
      expect(components['/section21'].state.percentcreditachieved).closeTo(section21percentCredit2,1E-12);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).eq(0);
      expect(components['/section221'].state.percentcreditachieved).eq(0);
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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


    let section1credit3 = 1;
    let section1credit3Round = Math.round(1000*section1credit3)/1000;
    let section1percentCredit3 = section1credit3*100;
    let section1percentCredit3Round = Math.round(10*section1percentCredit3)/10;

    let section221credit3 = 1;
    let section221credit3Round = Math.round(1000*section221credit3)/1000;
    let section221percentCredit3 = section221credit3*100;
    let section221percentCredit3Round = Math.round(10*section221percentCredit3)/10;

    let section21credit3 = 1;
    let section21credit3Round = Math.round(1000*section21credit3)/1000;
    let section21percentCredit3 = section21credit3*100;
    let section21percentCredit3Round = Math.round(10*section21percentCredit3)/10;

    let section2credit3 = (section21credit3+3)/5
    let section2credit3Round = Math.round(1000*section2credit3)/1000;
    let section2percentCredit3 = section2credit3*100;
    let section2percentCredit3Round = Math.round(10*section2percentCredit3)/10;;

    let credit3 = (1+section1credit3+section2credit3)/3;
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
      expect(text.trim()).equal(section1credit3Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section1percentCredit3Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2credit3Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2percentCredit3Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21credit3Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21percentCredit3Round.toString())
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section221credit3Round.toString())
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section221percentCredit3Round.toString())
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
      expect(components['/section1'].state.creditAchieved).closeTo(section1credit3,1E-12);
      expect(components['/section1'].state.percentcreditachieved).closeTo(section1percentCredit3,1E-12);
      expect(components['/section2'].state.creditAchieved).closeTo(section2credit3,1E-12);
      expect(components['/section2'].state.percentcreditachieved).closeTo(section2percentCredit3,1E-12);
      expect(components['/section21'].state.creditAchieved).closeTo(section21credit3,1E-12)
      expect(components['/section21'].state.percentcreditachieved).closeTo(section21percentCredit3,1E-12);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).closeTo(section221credit3,1E-12);
      expect(components['/section221'].state.percentcreditachieved).closeTo(section221percentCredit3,1E-12);;
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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


    let section1credit4 = 1;
    let section1credit4Round = Math.round(1000*section1credit4)/1000;
    let section1percentCredit4 = section1credit4*100;
    let section1percentCredit4Round = Math.round(10*section1percentCredit4)/10;

    let section221credit4 = 1;
    let section221credit4Round = Math.round(1000*section221credit4)/1000;
    let section221percentCredit4 = section221credit4*100;
    let section221percentCredit4Round = Math.round(10*section221percentCredit4)/10;

    let section222credit4 = 1;
    let section222credit4Round = Math.round(1000*section222credit4)/1000;
    let section222percentCredit4 = section222credit4*100;
    let section222percentCredit4Round = Math.round(10*section222percentCredit4)/10;

    let section21credit4 = 1;
    let section21credit4Round = Math.round(1000*section21credit4)/1000;
    let section21percentCredit4 = section21credit4*100;
    let section21percentCredit4Round = Math.round(10*section21percentCredit4)/10;

    let section2credit4 = 1;
    let section2credit4Round = Math.round(1000*section2credit4)/1000;
    let section2percentCredit4 = section2credit4*100;
    let section2percentCredit4Round = Math.round(10*section2percentCredit4)/10;;

    let credit4 = (1+section1credit4+section2credit4)/3;
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
      expect(text.trim()).equal(section1credit4Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section1percentCredit4Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2credit4Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2percentCredit4Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21credit4Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21percentCredit4Round.toString())
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section221credit4Round.toString())
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section221percentCredit4Round.toString())
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section222credit4Round.toString())
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section222percentCredit4Round.toString())
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).closeTo(credit4,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit4, 1E-12);
      expect(components['/section1'].state.creditAchieved).closeTo(section1credit4,1E-12);
      expect(components['/section1'].state.percentcreditachieved).closeTo(section1percentCredit4,1E-12);
      expect(components['/section2'].state.creditAchieved).closeTo(section2credit4,1E-12);
      expect(components['/section2'].state.percentcreditachieved).closeTo(section2percentCredit4,1E-12);
      expect(components['/section21'].state.creditAchieved).closeTo(section21credit4,1E-12)
      expect(components['/section21'].state.percentcreditachieved).closeTo(section21percentCredit4,1E-12);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).closeTo(section221credit4,1E-12);
      expect(components['/section221'].state.percentcreditachieved).closeTo(section221percentCredit4,1E-12);;
      expect(components['/section222'].state.creditAchieved).closeTo(section222credit4,1E-12);
      expect(components['/section222'].state.percentcreditachieved).closeTo(section222percentCredit4,1E-12);;
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

  it('sections aggregating scores, with weights', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <title>Activity</title>
    <p>Credit achieved for <ref prop="title">_document1</ref>:
    <ref prop="creditAchieved">_document1</ref>, or <ref prop="percentcreditachieved">_document1</ref>%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <section title="Section 1" name="section1" aggregatescores weight="0.5">
      <p>Credit achieved for <ref prop="title">section1</ref>:
      <ref prop="creditAchieved">section1</ref>, or <ref prop="percentcreditachieved">section1</ref>%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </section>
    <section title="Section 2" name="section2" aggregatescores weight="2">
      <p>Credit achieved for <ref prop="title">section2</ref>:
      <ref prop="creditAchieved">section2</ref>, or <ref prop="percentcreditachieved">section2</ref>%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <subsection title="Section 2.1" name="section21" aggregatescores weight="3">
        <p>Credit achieved for <ref prop="title">section21</ref>:
        <ref prop="creditAchieved">section21</ref>, or <ref prop="percentcreditachieved">section21</ref>%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </subsection>
      <subsection title="Section 2.2" name="section22" aggregatescores weight="4">
        <p>Credit achieved for <ref prop="title">section22</ref>:
        <ref prop="creditAchieved">section22</ref>, or <ref prop="percentcreditachieved">section22</ref>%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <subsubsection title="Section 2.2.1" name="section221" aggregatescores weight="5">
          <p>Credit achieved for <ref prop="title">section221</ref>:
          <ref prop="creditAchieved">section221</ref>, or <ref prop="percentcreditachieved">section221</ref>%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </subsubsection>
        <subsubsection title="Section 2.2.2" name="section222" aggregatescores weight="1">
          <p>Credit achieved for <ref prop="title">section222</ref>:
          <ref prop="creditAchieved">section222</ref>, or <ref prop="percentcreditachieved">section222</ref>%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
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
      expect(components['/section1'].state.creditAchieved).eq(0);
      expect(components['/section1'].state.percentcreditachieved).eq(0);
      expect(components['/section2'].state.creditAchieved).eq(0);
      expect(components['/section2'].state.percentcreditachieved).eq(0);
      expect(components['/section21'].state.creditAchieved).eq(0);
      expect(components['/section21'].state.percentcreditachieved).eq(0);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).eq(0);
      expect(components['/section221'].state.percentcreditachieved).eq(0);
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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
      expect(components['/section1'].state.creditAchieved).eq(0);
      expect(components['/section1'].state.percentcreditachieved).eq(0);
      expect(components['/section2'].state.creditAchieved).eq(0);
      expect(components['/section2'].state.percentcreditachieved).eq(0);
      expect(components['/section21'].state.creditAchieved).eq(0);
      expect(components['/section21'].state.percentcreditachieved).eq(0);
      expect(components['/section22'].state.creditAchieved).eq(0);
      expect(components['/section22'].state.percentcreditachieved).eq(0);
      expect(components['/section221'].state.creditAchieved).eq(0);
      expect(components['/section221'].state.percentcreditachieved).eq(0);
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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

    let section1credit2 = 2/3;
    let section1credit2Round = Math.round(1000*section1credit2)/1000;
    let section1percentCredit2 = section1credit2*100;
    let section1percentCredit2Round = Math.round(10*section1percentCredit2)/10;

    let section21credit2 = 1/3;
    let section21credit2Round = Math.round(1000*section21credit2)/1000;
    let section21percentCredit2 = section21credit2*100;
    let section21percentCredit2Round = Math.round(10*section21percentCredit2)/10;

    let section22credit2 = 1/7;
    let section22credit2Round = Math.round(1000*section22credit2)/1000;
    let section22percentCredit2 = section22credit2*100;
    let section22percentCredit2Round = Math.round(10*section22percentCredit2)/10;

    let section2credit2 = (3*section21credit2+4*section22credit2)/8
    let section2credit2Round = Math.round(1000*section2credit2)/1000;
    let section2percentCredit2 = section2credit2*100;
    let section2percentCredit2Round = Math.round(10*section2percentCredit2)/10;;

    let credit2 = (1+0.5*section1credit2+2*section2credit2)/3.5;
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
      expect(text.trim()).equal(section1credit2Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section1percentCredit2Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2credit2Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2percentCredit2Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21credit2Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21percentCredit2Round.toString())
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section22credit2Round.toString())
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section22percentCredit2Round.toString())
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
      expect(components['/section1'].state.creditAchieved).closeTo(section1credit2,1E-12);
      expect(components['/section1'].state.percentcreditachieved).closeTo(section1percentCredit2,1E-12);
      expect(components['/section2'].state.creditAchieved).closeTo(section2credit2,1E-12);
      expect(components['/section2'].state.percentcreditachieved).closeTo(section2percentCredit2,1E-12);
      expect(components['/section21'].state.creditAchieved).closeTo(section21credit2,1E-12)
      expect(components['/section21'].state.percentcreditachieved).closeTo(section21percentCredit2,1E-12);
      expect(components['/section22'].state.creditAchieved).closeTo(section22credit2,1E-12)
      expect(components['/section22'].state.percentcreditachieved).closeTo(section22percentCredit2,1E-12);
      expect(components['/section221'].state.creditAchieved).eq(0);
      expect(components['/section221'].state.percentcreditachieved).eq(0);
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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


    let section1credit3 = 1;
    let section1credit3Round = Math.round(1000*section1credit3)/1000;
    let section1percentCredit3 = section1credit3*100;
    let section1percentCredit3Round = Math.round(10*section1percentCredit3)/10;

    let section21credit3 = 1;
    let section21credit3Round = Math.round(1000*section21credit3)/1000;
    let section21percentCredit3 = section21credit3*100;
    let section21percentCredit3Round = Math.round(10*section21percentCredit3)/10;

    let section221credit3 = 1;
    let section221credit3Round = Math.round(1000*section221credit3)/1000;
    let section221percentCredit3 = section221credit3*100;
    let section221percentCredit3Round = Math.round(10*section221percentCredit3)/10;

    let section22credit3 = 6/7;
    let section22credit3Round = Math.round(1000*section22credit3)/1000;
    let section22percentCredit3 = section22credit3*100;
    let section22percentCredit3Round = Math.round(10*section22percentCredit3)/10;

    let section2credit3 = (1+3*section21credit3+4*section22credit3)/8
    let section2credit3Round = Math.round(1000*section2credit3)/1000;
    let section2percentCredit3 = section2credit3*100;
    let section2percentCredit3Round = Math.round(10*section2percentCredit3)/10;;

    let credit3 = (1+0.5*section1credit3+2*section2credit3)/3.5;
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
      expect(text.trim()).equal(section1credit3Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section1percentCredit3Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2credit3Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2percentCredit3Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21credit3Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21percentCredit3Round.toString())
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section22credit3Round.toString())
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section22percentCredit3Round.toString())
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section221credit3Round.toString())
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section221percentCredit3Round.toString())
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
      expect(components['/section1'].state.creditAchieved).closeTo(section1credit3,1E-12);
      expect(components['/section1'].state.percentcreditachieved).closeTo(section1percentCredit3,1E-12);
      expect(components['/section2'].state.creditAchieved).closeTo(section2credit3,1E-12);
      expect(components['/section2'].state.percentcreditachieved).closeTo(section2percentCredit3,1E-12);
      expect(components['/section21'].state.creditAchieved).closeTo(section21credit3,1E-12)
      expect(components['/section21'].state.percentcreditachieved).closeTo(section21percentCredit3,1E-12);
      expect(components['/section22'].state.creditAchieved).closeTo(section22credit3,1E-12)
      expect(components['/section22'].state.percentcreditachieved).closeTo(section22percentCredit3,1E-12);
      expect(components['/section221'].state.creditAchieved).closeTo(section221credit3,1E-12);
      expect(components['/section221'].state.percentcreditachieved).closeTo(section221percentCredit3,1E-12);;
      expect(components['/section222'].state.creditAchieved).eq(0);
      expect(components['/section222'].state.percentcreditachieved).eq(0);
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


    let section1credit4 = 1;
    let section1credit4Round = Math.round(1000*section1credit4)/1000;
    let section1percentCredit4 = section1credit4*100;
    let section1percentCredit4Round = Math.round(10*section1percentCredit4)/10;

    let section21credit4 = 1;
    let section21credit4Round = Math.round(1000*section21credit4)/1000;
    let section21percentCredit4 = section21credit4*100;
    let section21percentCredit4Round = Math.round(10*section21percentCredit4)/10;

    let section221credit4 = 1;
    let section221credit4Round = Math.round(1000*section221credit4)/1000;
    let section221percentCredit4 = section221credit4*100;
    let section221percentCredit4Round = Math.round(10*section221percentCredit4)/10;

    let section222credit4 = 1;
    let section222credit4Round = Math.round(1000*section222credit4)/1000;
    let section222percentCredit4 = section222credit4*100;
    let section222percentCredit4Round = Math.round(10*section222percentCredit4)/10;

    let section22credit4 = 1;
    let section22credit4Round = Math.round(1000*section22credit4)/1000;
    let section22percentCredit4 = section22credit4*100;
    let section22percentCredit4Round = Math.round(10*section22percentCredit4)/10;

    let section2credit4 = 1;
    let section2credit4Round = Math.round(1000*section2credit4)/1000;
    let section2percentCredit4 = section2credit4*100;
    let section2percentCredit4Round = Math.round(10*section2percentCredit4)/10;;

    let credit4 = (1+section1credit4+section2credit4)/3;
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
      expect(text.trim()).equal(section1credit4Round.toString())
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section1percentCredit4Round.toString())
    })
    cy.get('#__number5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2credit4Round.toString())
    })
    cy.get('#__number6 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section2percentCredit4Round.toString())
    })
    cy.get('#__number7 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21credit4Round.toString())
    })
    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section21percentCredit4Round.toString())
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section22credit4Round.toString())
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section22percentCredit4Round.toString())
    })
    cy.get('#__number11 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section221credit4Round.toString())
    })
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section221percentCredit4Round.toString())
    })
    cy.get('#__number13 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section222credit4Round.toString())
    })
    cy.get('#__number14 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(section222percentCredit4Round.toString())
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_document1'].state.creditAchieved).closeTo(credit4,1E-12);
      expect(components['/_document1'].state.percentcreditachieved).closeTo(percentCredit4, 1E-12);
      expect(components['/section1'].state.creditAchieved).closeTo(section1credit4,1E-12);
      expect(components['/section1'].state.percentcreditachieved).closeTo(section1percentCredit4,1E-12);
      expect(components['/section2'].state.creditAchieved).closeTo(section2credit4,1E-12);
      expect(components['/section2'].state.percentcreditachieved).closeTo(section2percentCredit4,1E-12);
      expect(components['/section21'].state.creditAchieved).closeTo(section21credit4,1E-12)
      expect(components['/section21'].state.percentcreditachieved).closeTo(section21percentCredit4,1E-12);
      expect(components['/section22'].state.creditAchieved).closeTo(section22credit4,1E-12)
      expect(components['/section22'].state.percentcreditachieved).closeTo(section22percentCredit4,1E-12);
      expect(components['/section221'].state.creditAchieved).closeTo(section221credit4,1E-12);
      expect(components['/section221'].state.percentcreditachieved).closeTo(section221percentCredit4,1E-12);;
      expect(components['/section222'].state.creditAchieved).closeTo(section222credit4,1E-12);
      expect(components['/section222'].state.percentcreditachieved).closeTo(section222percentCredit4,1E-12);;
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

  it('paragraphs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <paragraphs title="Some paragraphs">

    <p>Paragraph 1</p>
    <p>Paragraph 2</p>

    </paragraphs>
    
    `}, "*");
    });

    cy.get('#\\/_paragraphs1_heading').should('have.text', 'Some paragraphs');
    
    cy.get('#\\/_paragraphs1 p:first-of-type').should('have.text', 'Paragraph 1');
    cy.get('#\\/_paragraphs1 p:last-of-type').should('have.text', 'Paragraph 2');
    
  });




});