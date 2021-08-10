import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Paginator Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })


  it('Default behavior preserved scores as change pages', () => {

    let doenetML = `
    <text>a</text>
  
    <paginatorControls paginatorTname="pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <section>
        <title>Page 1</title>
        <p>What is 1+1? <answer>$two</answer></p>
        <math hide name="two">2</math>
      </section>
      <section>
        <p>What is your name? <textinput name="name" /></p>
        <p>Hello, $name!</p>
      </section>
      <section>
        <title>Page 3</title>
        <math hide name="twox">2x</math>
        <p>What is <m>x+x</m>? <answer>$twox</answer></p>
        <p>What is <m>y+y</m>? <answer>2y</answer></p>
      </section>
    </paginator>
    <p>
    <callAction name="prevPage" label="prev" disabled="$pageNum = 1" actionName="setPage" tName="pgn" number="$pageNum -1" />
    Page <copy prop="currentPage" tname="pgn" assignNames="pageNum" />
    of <copy prop="nPages" tname="pgn" assignNames="nPages" />
    <callAction name="nextPage" label="next" disabled="$pageNum = $nPages" actionName="setPage" tName="pgn" number="$pageNum +1" />
    
    </p>
    <p>What is 2+2? <answer>4</answer></p>
  
    <p>Credit achieved: <copy prop="creditAchieved" tname="_document1" assignNames="ca" /></p>
  
    `

    cy.window().then((win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    // at least right now, this turns on Allow Local Page State
    cy.get('h3 > button').click();
    cy.get(':nth-child(11) > label > input').click()
    cy.get('h3 > button').click();


    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let mathinput1Name = components["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let mathinput1DisplayAnchor = cesc('#' + mathinput1Name) + " .mq-editable-field";
      let answer1Correct = cesc('#' + mathinput1Name + "_correct");
      let answer1Incorrect = cesc('#' + mathinput1Name + "_incorrect");

      let mathinput4Name = components["/_answer4"].stateValues.inputChildren[0].componentName;
      let mathinput4Anchor = cesc('#' + mathinput4Name) + " textarea";
      let mathinput4DisplayAnchor = cesc('#' + mathinput4Name) + " .mq-editable-field";
      let answer4Correct = cesc('#' + mathinput4Name + "_correct");
      let answer4Incorrect = cesc('#' + mathinput4Name + "_incorrect");

      expect(components["/_section2"]).eq(undefined);
      expect(components["/_textinput1"]).eq(undefined);
      expect(components["/_section3"]).eq(undefined);
      expect(components["/_mathinput2"]).eq(undefined);
      expect(components["/_mathinput3"]).eq(undefined);


      cy.get(cesc('#/ca')).should('have.text', '0');
      cy.get(cesc('#/_title1')).should('have.text', 'Page 1');
      cy.get(cesc('#/_section2_title')).should('not.exist')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(mathinput4Anchor).type("4{enter}", { force: true })

      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.25');

      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      cy.get(mathinput1Anchor).type("2{enter}", { force: true })

      cy.get(answer1Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.5');
      cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
      })

      cy.log('move to page 2')
      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(answer4Correct).should('be.visible')
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      // since section 2 has no answer blanks
      // automatically get full credit for section 2
      // as soon as it is created, bring score up to 75%
      cy.get(cesc('#/ca')).should('have.text', '0.75');

      cy.get(cesc('#/name_input')).type("Me{enter}");
      cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")
      cy.get(cesc('#/ca')).should('have.text', '0.75');
      cy.get(cesc('#/name_input')).should('have.value', "Me")


      cy.get(mathinput1Anchor).should('not.exist');

      cy.window().then((win) => {
        components = Object.assign({}, win.state.components);
        expect(components["/_section3"]).eq(undefined);
        expect(components["/_answer2"]).eq(undefined);
        expect(components["/_answer3"]).eq(undefined);
      })

      cy.get(mathinput4Anchor).type("{end}{backspace}3{enter}", { force: true })

      cy.get(answer4Incorrect).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.5');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
      })

      cy.log('back to page 1')
      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get(cesc('#/_title1')).should('have.text', 'Page 1');
      cy.get(cesc('#/_section2_title')).should('not.exist')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(answer1Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.5');
      cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
      })

      cy.get(cesc('#/name')).should('not.exist');

      cy.window().then((win) => {
        components = Object.assign({}, win.state.components);
        expect(components["/_section3"]).eq(undefined);
        expect(components["/_answer2"]).eq(undefined);
        expect(components["/_answer3"]).eq(undefined);
      })

      cy.log('back to second page')
      cy.get(cesc('#/nextPage')).click();
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(cesc('#/name_input')).should('have.value', "Me")
      cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")

      cy.get(answer4Incorrect).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.5');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
      })

      cy.get(mathinput4Anchor).type("{end}{backspace}4{enter}", { force: true })

      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.75');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      cy.log('on to third page');
      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('not.exist');
      cy.get(cesc('#/_title2')).should('have.text', 'Page 3')


      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.75');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      cy.window().then((win) => {
        components = Object.assign({}, win.state.components);

        let mathinput2Name = components["/_answer2"].stateValues.inputChildren[0].componentName;
        let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
        let mathinput2DisplayAnchor = cesc('#' + mathinput2Name) + " .mq-editable-field";
        let answer2Correct = cesc('#' + mathinput2Name + "_correct");
        let answer2Incorrect = cesc('#' + mathinput2Name + "_incorrect");

        let mathinput3Name = components["/_answer3"].stateValues.inputChildren[0].componentName;
        let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
        let mathinput3DisplayAnchor = cesc('#' + mathinput3Name) + " .mq-editable-field";
        let answer3Correct = cesc('#' + mathinput3Name + "_correct");
        let answer3Incorrect = cesc('#' + mathinput3Name + "_incorrect");

        cy.get(mathinput2Anchor).type("2x{enter}", { force: true })
        cy.get(answer2Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.875');
        cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2x')
        })

        cy.get(mathinput3Anchor).type("2y{enter}", { force: true })
        cy.get(answer3Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '1');
        cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2y')
        })

        cy.get(mathinput2Anchor).type("{end}{backspace}z{enter}", { force: true })
        cy.get(answer2Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.875');
        cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2z')
        })

        cy.log('back to second page')
        cy.get(cesc('#/prevPage')).click();
        cy.get(cesc('#/_title1')).should('not.exist');
        cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
        cy.get(cesc('#/_title2')).should('not.exist');

        cy.get(cesc('#/name_input')).should('have.value', "Me")
        cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")

        cy.get(answer4Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.875')
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
        })

        cy.log('back to third page');
        cy.get(cesc('#/pcontrols_next')).click()
        cy.get(cesc('#/_title1')).should('not.exist');
        cy.get(cesc('#/_section2_title')).should('not.exist');
        cy.get(cesc('#/_title2')).should('have.text', 'Page 3')

        cy.get(answer4Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.875')
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
        })

        cy.get(answer2Incorrect).should('be.visible')
        cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2z')
        })
        cy.get(answer3Correct).should('be.visible')
        cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2y')
        })

        cy.get(cesc('#/ca')).should('have.text', '0.875')

        cy.log('back to second page')
        cy.get(cesc('#/prevPage')).click();
        cy.get(cesc('#/_title1')).should('not.exist');
        cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
        cy.get(cesc('#/_title2')).should('not.exist');

        cy.get(cesc('#/name_input')).should('have.value', "Me")
        cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")

        cy.get(answer4Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.875')
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
        })

      });

    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.log('on page two without pages 1 or 3 loaded')

    cy.get(cesc('#/_title1')).should('not.exist');
    cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
    cy.get(cesc('#/_title2')).should('not.exist');


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/_section1"]).eq(undefined);
      expect(components["/_answer1"]).eq(undefined);
      expect(components["/_section3"]).eq(undefined);
      expect(components["/_answer2"]).eq(undefined);
      expect(components["/_answer3"]).eq(undefined);


      let mathinput4Name = components["/_answer4"].stateValues.inputChildren[0].componentName;
      let mathinput4Anchor = cesc('#' + mathinput4Name) + " textarea";
      let mathinput4DisplayAnchor = cesc('#' + mathinput4Name) + " .mq-editable-field";
      let answer4Correct = cesc('#' + mathinput4Name + "_correct");
      let answer4Incorrect = cesc('#' + mathinput4Name + "_incorrect");


      cy.get(cesc('#/name_input')).should('have.value', "Me")
      cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")

      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.875');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      cy.get(cesc('#/name_input')).clear().type("You{enter}");
      cy.get(cesc('#/name_input')).should('have.value', "You")
      cy.get(cesc('#/_p3')).should('have.text', "Hello, You!")

      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.875');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      cy.log('to third page');
      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('not.exist');
      cy.get(cesc('#/_title2')).should('have.text', 'Page 3')


      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.875');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      cy.window().then((win) => {
        components = Object.assign({}, win.state.components);

        let mathinput2Name = components["/_answer2"].stateValues.inputChildren[0].componentName;
        let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
        let mathinput2DisplayAnchor = cesc('#' + mathinput2Name) + " .mq-editable-field";
        let answer2Correct = cesc('#' + mathinput2Name + "_correct");
        let answer2Incorrect = cesc('#' + mathinput2Name + "_incorrect");
        let answer2Submit = cesc('#' + mathinput2Name + "_submit");

        let mathinput3Name = components["/_answer3"].stateValues.inputChildren[0].componentName;
        let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
        let mathinput3DisplayAnchor = cesc('#' + mathinput3Name) + " .mq-editable-field";
        let answer3Correct = cesc('#' + mathinput3Name + "_correct");
        let answer3Incorrect = cesc('#' + mathinput3Name + "_incorrect");

        expect(components["/_section1"]).eq(undefined);
        expect(components["/_answer1"]).eq(undefined);

        cy.get(answer2Incorrect).should('be.visible')
        cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2z')
        })
        cy.get(answer3Correct).should('be.visible')
        cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2y')
        })


        cy.get(mathinput3Anchor).type("{end}{backspace}q{enter}", { force: true })
        cy.get(answer3Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.75');
        cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2q')
        })

        cy.get(mathinput4Anchor).type("{end}{backspace}3{enter}", { force: true })
        cy.get(answer4Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.5');
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
        })


        cy.get(mathinput2Anchor).type("{end}{backspace}x{enter}", { force: true })
        cy.get(answer2Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.625');
        cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2x')
        })

        cy.log('back to second page');
        cy.get(cesc('#/pcontrols_previous')).click()
        cy.get(cesc('#/_title1')).should('not.exist');
        cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
        cy.get(cesc('#/_title2')).should('not.exist');

        cy.get(cesc('#/name_input')).should('have.value', "You")
        cy.get(cesc('#/_p3')).should('have.text', "Hello, You!")

        cy.get(answer4Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.625');
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
        })

        cy.log('to first page');
        cy.get(cesc('#/pcontrols_previous')).click()
        cy.get(cesc('#/_title1')).should('have.text', 'Page 1');
        cy.get(cesc('#/_section2_title')).should('not.exist')
        cy.get(cesc('#/_title2')).should('not.exist');

        cy.get(answer4Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.625');
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
        })

        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);

          let mathinput1Name = components["/_answer1"].stateValues.inputChildren[0].componentName;
          let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
          let mathinput1DisplayAnchor = cesc('#' + mathinput1Name) + " .mq-editable-field";
          let answer1Correct = cesc('#' + mathinput1Name + "_correct");
          let answer1Incorrect = cesc('#' + mathinput1Name + "_incorrect");

          cy.get(answer1Correct).should('be.visible')
          cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
          })

          cy.get(mathinput1Anchor).type("{end}-{enter}", { force: true })
          cy.get(answer1Incorrect).should('be.visible')
          cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2−')
          })
          cy.get(cesc('#/ca')).should('have.text', '0.375');


          cy.log('back to second page');
          cy.get(cesc('#/pcontrols_next')).click()
          cy.get(cesc('#/_title1')).should('not.exist');
          cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
          cy.get(cesc('#/_title2')).should('not.exist');

          cy.log('back to first page');
          cy.get(cesc('#/pcontrols_previous')).click()
          cy.get(cesc('#/_title1')).should('have.text', 'Page 1');
          cy.get(cesc('#/_section2_title')).should('not.exist')
          cy.get(cesc('#/_title2')).should('not.exist');

          cy.get(answer1Incorrect).should('be.visible')
          cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2−')
          })

          cy.log('to third page');

          cy.get(cesc('#/pcontrols_next')).click().click()
          cy.get(cesc('#/_title1')).should('not.exist');
          cy.get(cesc('#/_section2_title')).should('not.exist');
          cy.get(cesc('#/_title2')).should('have.text', 'Page 3')

          cy.get(answer3Incorrect).should('be.visible')
          cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2q')
          })

          cy.get(answer4Incorrect).should('be.visible')
          cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
          })

          cy.get(answer2Correct).should('be.visible')
          cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2x')
          })
          cy.get(cesc('#/ca')).should('have.text', '0.375');

          cy.get(mathinput2Anchor).type("{end}:", { force: true }).blur()
          cy.get(answer2Submit).should('be.visible');
          cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2x:')
          })
          cy.get(cesc('#/ca')).should('have.text', '0.375');

          cy.log('to second page');
          cy.get(cesc('#/pcontrols_previous')).click()
          cy.get(cesc('#/_title1')).should('not.exist');
          cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
          cy.get(cesc('#/_title2')).should('not.exist');

          cy.log('back to third page');
          cy.get(cesc('#/pcontrols_next')).click()
          cy.get(cesc('#/_title1')).should('not.exist');
          cy.get(cesc('#/_section2_title')).should('not.exist');
          cy.get(cesc('#/_title2')).should('have.text', 'Page 3')

          cy.get(answer2Submit).should('be.visible');
          cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2x:')
          })
          cy.get(answer3Incorrect).should('be.visible')
          cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2q')
          })
          cy.get(answer4Incorrect).should('be.visible')
          cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
          })
          cy.get(cesc('#/ca')).should('have.text', '0.375');


        })
      })

    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.log('on third page without first and second defined')
    cy.get(cesc('#/_title1')).should('not.exist');
    cy.get(cesc('#/_section2_title')).should('not.exist');
    cy.get(cesc('#/_title2')).should('have.text', 'Page 3')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/_section1"]).eq(undefined);
      expect(components["/_answer1"]).eq(undefined);
      expect(components["/_section2"]).eq(undefined);
      expect(components["/name"]).eq(undefined);


      let mathinput2Name = components["/_answer2"].stateValues.inputChildren[0].componentName;
      let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
      let mathinput2DisplayAnchor = cesc('#' + mathinput2Name) + " .mq-editable-field";
      let answer2Correct = cesc('#' + mathinput2Name + "_correct");
      let answer2Incorrect = cesc('#' + mathinput2Name + "_incorrect");
      let answer2Submit = cesc('#' + mathinput2Name + "_submit");

      let mathinput3Name = components["/_answer3"].stateValues.inputChildren[0].componentName;
      let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
      let mathinput3DisplayAnchor = cesc('#' + mathinput3Name) + " .mq-editable-field";
      let answer3Correct = cesc('#' + mathinput3Name + "_correct");
      let answer3Incorrect = cesc('#' + mathinput3Name + "_incorrect");

      let mathinput4Name = components["/_answer4"].stateValues.inputChildren[0].componentName;
      let mathinput4Anchor = cesc('#' + mathinput4Name) + " textarea";
      let mathinput4DisplayAnchor = cesc('#' + mathinput4Name) + " .mq-editable-field";
      let answer4Correct = cesc('#' + mathinput4Name + "_correct");
      let answer4Incorrect = cesc('#' + mathinput4Name + "_incorrect");

      cy.get(answer2Submit).should('be.visible');
      cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2x:')
      })
      cy.get(answer3Incorrect).should('be.visible')
      cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2q')
      })
      cy.get(answer4Incorrect).should('be.visible')
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
      })
      cy.get(cesc('#/ca')).should('have.text', '0.375');


      cy.log('to second page');
      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(cesc('#/name_input')).should('have.value', "You")
      cy.get(cesc('#/_p3')).should('have.text', "Hello, You!")

      cy.get(answer4Incorrect).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.375');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
      })

      cy.log('back to third page')
      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(answer2Submit).should('be.visible');
      cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2x:')
      })
      cy.get(answer3Incorrect).should('be.visible')
      cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2q')
      })
      cy.get(answer4Incorrect).should('be.visible')
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
      })
      cy.get(cesc('#/ca')).should('have.text', '0.375');

      cy.log('to first page')
      cy.get(cesc('#/pcontrols_previous')).click().click();
      cy.get(cesc('#/_title1')).should('have.text', 'Page 1');
      cy.get(cesc('#/_section2_title')).should('not.exist')
      cy.get(cesc('#/_title2')).should('not.exist');



      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let mathinput1Name = components["/_answer1"].stateValues.inputChildren[0].componentName;
        let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
        let mathinput1DisplayAnchor = cesc('#' + mathinput1Name) + " .mq-editable-field";
        let answer1Correct = cesc('#' + mathinput1Name + "_correct");
        let answer1Incorrect = cesc('#' + mathinput1Name + "_incorrect");

        cy.get(answer1Incorrect).should('be.visible')
        cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2−')
        })
        cy.get(cesc('#/ca')).should('have.text', '0.375');

        cy.get(answer4Incorrect).should('be.visible')
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
        })

      })

    })

  })

  it('Set to not preserve scores as change pages', () => {

    let doenetML = `
    <text>a</text>
  
    <paginatorControls paginatorTname="pgn" name="pcontrols" />
  
    <paginator name="pgn" preserveScores="false">
      <section>
        <title>Page 1</title>
        <p>What is 1+1? <answer>$two</answer></p>
        <math hide name="two">2</math>
      </section>
      <section>
        <p>What is your name? <textinput name="name" /></p>
        <p>Hello, $name!</p>
      </section>
      <section>
        <title>Page 3</title>
        <math hide name="twox">2x</math>
        <p>What is <m>x+x</m>? <answer>$twox</answer></p>
        <p>What is <m>y+y</m>? <answer>2y</answer></p>
      </section>
    </paginator>
    <p>
    <callAction name="prevPage" label="prev" disabled="$pageNum = 1" actionName="setPage" tName="pgn" number="$pageNum -1" />
    Page <copy prop="currentPage" tname="pgn" assignNames="pageNum" />
    of <copy prop="nPages" tname="pgn" assignNames="nPages" />
    <callAction name="nextPage" label="next" disabled="$pageNum = $nPages" actionName="setPage" tName="pgn" number="$pageNum +1" />
    
    </p>
    <p>What is 2+2? <answer>4</answer></p>
  
    <p>Credit achieved: <copy prop="creditAchieved" tname="_document1" assignNames="ca" /></p>
  
    `
    cy.window().then((win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    // at least right now, this turns on Allow Local Page State
    cy.get('h3 > button').click();
    cy.get(':nth-child(11) > label > input').click()
    cy.get('h3 > button').click();


    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let mathinput1Name = components["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let answer1Correct = cesc('#' + mathinput1Name + "_correct");
      let answer1Incorrect = cesc('#' + mathinput1Name + "_incorrect");

      let mathinput4Name = components["/_answer4"].stateValues.inputChildren[0].componentName;
      let mathinput4Anchor = cesc('#' + mathinput4Name) + " textarea";
      let answer4Correct = cesc('#' + mathinput4Name + "_correct");
      let answer4Incorrect = cesc('#' + mathinput4Name + "_incorrect");

      expect(components["/_section2"]).eq(undefined);
      expect(components["/_textinput1"]).eq(undefined);
      expect(components["/_section3"]).eq(undefined);
      expect(components["/_mathinput2"]).eq(undefined);
      expect(components["/_mathinput3"]).eq(undefined);


      cy.get(cesc('#/ca')).should('have.text', '0');
      cy.get(cesc('#/_title1')).should('have.text', 'Page 1');
      cy.get(cesc('#/_section2_title')).should('not.exist')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(mathinput4Anchor).type("4{enter}", { force: true })

      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.5');

      cy.get(mathinput1Anchor).type("2{enter}", { force: true })

      cy.get(answer1Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '1');


      cy.log('move to page 2')
      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '1');

      cy.get(cesc('#/name_input')).type("Me{enter}");
      cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")
      cy.get(cesc('#/ca')).should('have.text', '1');

      cy.get(mathinput1Anchor).should('not.exist');

      cy.window().then((win) => {
        components = Object.assign({}, win.state.components);
        expect(components["/_section3"]).eq(undefined);
        expect(components["/_answer2"]).eq(undefined);
        expect(components["/_answer3"]).eq(undefined);
      })

      cy.get(mathinput4Anchor).type("{end}{backspace}3{enter}", { force: true })

      cy.get(answer4Incorrect).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0');


      cy.log('back to page 1')
      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get(cesc('#/_title1')).should('have.text', 'Page 1');
      cy.get(cesc('#/_section2_title')).should('not.exist')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(mathinput1Anchor).should('exist');
      cy.get(cesc('#/ca')).should('have.text', '0.5');

      cy.get(cesc('#/name')).should('not.exist');

      cy.window().then((win) => {
        components = Object.assign({}, win.state.components);
        expect(components["/_section3"]).eq(undefined);
        expect(components["/_answer2"]).eq(undefined);
        expect(components["/_answer3"]).eq(undefined);
      })

      cy.log('back to second page')
      cy.get(cesc('#/nextPage')).click();
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(cesc('#/ca')).should('have.text', '0');
      cy.get(mathinput4Anchor).type("{end}{backspace}4{enter}", { force: true })

      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '1');


      cy.log('on to third page');
      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('not.exist');
      cy.get(cesc('#/_title2')).should('have.text', 'Page 3')


      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.333');

      cy.window().then((win) => {
        components = Object.assign({}, win.state.components);

        let mathinput2Name = components["/_answer2"].stateValues.inputChildren[0].componentName;
        let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
        let answer2Correct = cesc('#' + mathinput2Name + "_correct");
        let answer2Incorrect = cesc('#' + mathinput2Name + "_incorrect");

        let mathinput3Name = components["/_answer3"].stateValues.inputChildren[0].componentName;
        let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
        let answer3Correct = cesc('#' + mathinput3Name + "_correct");
        let answer3Incorrect = cesc('#' + mathinput3Name + "_incorrect");

        cy.get(mathinput2Anchor).type("2x{enter}", { force: true })
        cy.get(answer2Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.667');

        cy.get(mathinput3Anchor).type("2y{enter}", { force: true })
        cy.get(answer3Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '1');

        cy.get(mathinput2Anchor).type("{end}{backspace}z{enter}", { force: true })
        cy.get(answer2Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.667');


        cy.log('back to second page again')
        cy.get(cesc('#/prevPage')).click();
        cy.get(cesc('#/_title1')).should('not.exist');
        cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
        cy.get(cesc('#/_title2')).should('not.exist');

        cy.get(cesc('#/ca')).should('have.text', '1');

      });

    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.log('on page two without pages 1 or 3 loaded')

    cy.get(cesc('#/_title1')).should('not.exist');
    cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
    cy.get(cesc('#/_title2')).should('not.exist');

    cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")
    cy.get(cesc('#/ca')).should('have.text', '1');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/_section1"]).eq(undefined);
      expect(components["/_answer1"]).eq(undefined);
      expect(components["/_section3"]).eq(undefined);
      expect(components["/_answer2"]).eq(undefined);
      expect(components["/_answer3"]).eq(undefined);


      let mathinput4Name = components["/_answer4"].stateValues.inputChildren[0].componentName;
      let mathinput4Anchor = cesc('#' + mathinput4Name) + " textarea";
      let answer4Correct = cesc('#' + mathinput4Name + "_correct");
      let answer4Incorrect = cesc('#' + mathinput4Name + "_incorrect");



      cy.get(cesc('#/name_input')).clear().type("You{enter}");
      cy.get(cesc('#/_p3')).should('have.text', "Hello, You!")

      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '1');

      cy.log('to third page');
      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('not.exist');
      cy.get(cesc('#/_title2')).should('have.text', 'Page 3')


      cy.get(cesc('#/ca')).should('have.text', '0.667');

      cy.window().then((win) => {
        components = Object.assign({}, win.state.components);

        let mathinput2Name = components["/_answer2"].stateValues.inputChildren[0].componentName;
        let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
        let answer2Correct = cesc('#' + mathinput2Name + "_correct");
        let answer2Incorrect = cesc('#' + mathinput2Name + "_incorrect");

        let mathinput3Name = components["/_answer3"].stateValues.inputChildren[0].componentName;
        let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
        let answer3Correct = cesc('#' + mathinput3Name + "_correct");
        let answer3Incorrect = cesc('#' + mathinput3Name + "_incorrect");

        expect(components["/_section1"]).eq(undefined);
        expect(components["/_answer1"]).eq(undefined);


        cy.get(answer2Incorrect).should('be.visible');
        cy.get(answer3Correct).should('be.visible');

        cy.get(mathinput3Anchor).type("{end}{backspace}q{enter}", { force: true })
        cy.get(answer3Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.333');

        cy.get(mathinput4Anchor).type("{end}{backspace}3{enter}", { force: true })
        cy.get(answer4Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0');


        cy.get(mathinput2Anchor).type("{end}{backspace}x{enter}", { force: true })
        cy.get(answer2Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.333');

        cy.log('back to second page');
        cy.get(cesc('#/pcontrols_previous')).click()
        cy.get(cesc('#/_title1')).should('not.exist');
        cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
        cy.get(cesc('#/_title2')).should('not.exist');

        cy.get(cesc('#/_p3')).should('have.text', "Hello, You!")
        cy.get(cesc('#/ca')).should('have.text', '0');


        cy.log('to first page');
        cy.get(cesc('#/pcontrols_previous')).click()
        cy.get(cesc('#/_title1')).should('have.text', 'Page 1');
        cy.get(cesc('#/_section2_title')).should('not.exist')
        cy.get(cesc('#/_title2')).should('not.exist');

        cy.get(cesc('#/ca')).should('have.text', '0.5');

        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);

          let mathinput1Name = components["/_answer1"].stateValues.inputChildren[0].componentName;
          let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
          let answer1Correct = cesc('#' + mathinput1Name + "_correct");
          let answer1Incorrect = cesc('#' + mathinput1Name + "_incorrect");

          cy.get(answer1Correct).should('be.visible')


        })
      })

    })

  })

  it('With weights', () => {

    let doenetML = `
    <text>a</text>
  
    <paginatorControls paginatorTname="pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <problem>
        <answer type="text">a</answer>
      </problem>
      <problem weight="2">
        <answer type="text">b</answer>
      </problem>
      <problem weight="3">
        <answer type="text">c</answer>
      </problem>
    </paginator>
  
    <p>Credit achieved: <copy prop="creditAchieved" tname="_document1" assignNames="ca" /></p>
  
    `

    cy.window().then((win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    // at least right now, this turns on Allow Local Page State
    cy.get('h3 > button').click();
    cy.get(':nth-child(11) > label > input').click()
    cy.get('h3 > button').click();


    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let textinput1Name = components["/_answer1"].stateValues.inputChildren[0].componentName;
      let textinput1Anchor = cesc('#' + textinput1Name) + "_input";
      let textinput1DisplayAnchor = cesc('#' + textinput1Name) + " .mq-editable-field";
      let answer1Submit = cesc('#' + textinput1Name + "_submit");
      let answer1Correct = cesc('#' + textinput1Name + "_correct");
      let answer1Incorrect = cesc('#' + textinput1Name + "_incorrect");

      cy.get(cesc('#/_problem1_title')).should('have.text', 'Problem 1')

      cy.get(cesc('#/ca')).should('have.text', '0');

      cy.get(textinput1Anchor).type("a{enter}")

      cy.get(answer1Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.167');

      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/_problem2_title')).should('have.text', 'Problem 2')
      cy.get(cesc('#/ca')).should('have.text', '0.167');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let textinput2Name = components["/_answer2"].stateValues.inputChildren[0].componentName;
        let textinput2Anchor = cesc('#' + textinput2Name) + "_input";
        let textinput2DisplayAnchor = cesc('#' + textinput2Name) + " .mq-editable-field";
        let answer2Submit = cesc('#' + textinput2Name + "_submit");
        let answer2Correct = cesc('#' + textinput2Name + "_correct");
        let answer2Incorrect = cesc('#' + textinput2Name + "_incorrect");

        cy.get(answer2Submit).should('be.visible')


        cy.get(cesc('#/pcontrols_next')).click()
        cy.get(cesc('#/_problem3_title')).should('have.text', 'Problem 3')
        cy.get(cesc('#/ca')).should('have.text', '0.167');

        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);

          let textinput3Name = components["/_answer3"].stateValues.inputChildren[0].componentName;
          let textinput3Anchor = cesc('#' + textinput3Name) + "_input";
          let textinput3DisplayAnchor = cesc('#' + textinput3Name) + " .mq-editable-field";
          let answer3Submit = cesc('#' + textinput3Name + "_submit");
          let answer3Correct = cesc('#' + textinput3Name + "_correct");
          let answer3Incorrect = cesc('#' + textinput3Name + "_incorrect");

          cy.get(answer3Submit).should('be.visible')

          cy.get(cesc('#/pcontrols_previous')).click()
          cy.get(cesc('#/_problem2_title')).should('have.text', 'Problem 2')
          cy.get(cesc('#/ca')).should('have.text', '0.167');


          cy.get(textinput2Anchor).type("b{enter}")

          cy.get(answer2Correct).should('be.visible')
          cy.get(cesc('#/ca')).should('have.text', '0.5');


          cy.get(cesc('#/pcontrols_previous')).click()
          cy.get(cesc('#/_problem1_title')).should('have.text', 'Problem 1')
          cy.get(cesc('#/ca')).should('have.text', '0.5');


          cy.get(answer1Correct).should('be.visible')

          cy.get(textinput1Anchor).clear().type("{enter}")
          cy.get(answer1Incorrect).should('be.visible')
          cy.get(cesc('#/ca')).should('have.text', '0.333');

          cy.get(cesc('#/pcontrols_next')).click()
          cy.get(cesc('#/_problem2_title')).should('have.text', 'Problem 2')
          cy.get(cesc('#/ca')).should('have.text', '0.333');

          cy.get(answer2Correct).should('be.visible')

          cy.get(cesc('#/pcontrols_next')).click()
          cy.get(cesc('#/_problem3_title')).should('have.text', 'Problem 3')
          cy.get(cesc('#/ca')).should('have.text', '0.333');

          cy.get(textinput3Anchor).clear().type("c{enter}")
          cy.get(answer3Correct).should('be.visible')
          cy.get(cesc('#/ca')).should('have.text', '0.833');

          cy.get(cesc('#/pcontrols_previous')).click()
          cy.get(cesc('#/_problem2_title')).should('have.text', 'Problem 2')
          cy.get(cesc('#/ca')).should('have.text', '0.833');

          cy.get(answer2Correct).should('be.visible')


        })

      });

    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/_problem2_title')).should('have.text', 'Problem 2')
    cy.get(cesc('#/ca')).should('have.text', '0.833');

    cy.get(cesc('#/pcontrols_previous')).click()
    cy.get(cesc('#/_problem1_title')).should('have.text', 'Problem 1')
    cy.get(cesc('#/ca')).should('have.text', '0.833');

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/_problem2_title')).should('have.text', 'Problem 2')
    cy.get(cesc('#/ca')).should('have.text', '0.833');

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/_problem3_title')).should('have.text', 'Problem 3')
    cy.get(cesc('#/ca')).should('have.text', '0.833');


  })



});