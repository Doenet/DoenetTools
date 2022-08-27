import cssesc from 'cssesc';
import me from 'math-expressions';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Paginator Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('Multiple sections in paginator', () => {

    let doenetML = `
    <text>a</text>
  
    <paginatorControls paginator="pgn" name="pcontrols" />
  
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
        <p>What is <m name="mxx">x+x</m>? <answer>$twox</answer></p>
        <p>What is <m name="myy">y+y</m>? <answer>2y</answer></p>
      </section>
    </paginator>
    <p>
    <callAction name="prevPage" disabled="$pageNum = 1" actionName="setPage" target="pgn" number="$pageNum -1"  >
      <label>prev</label>
    </callAction>
    Page <copy prop="currentPage" target="pgn" assignNames="pageNum" />
    of <copy prop="nPages" target="pgn" assignNames="nPages" />
    <callAction name="nextPage" disabled="$pageNum = $nPages" actionName="setPage" target="pgn" number="$pageNum +1"  >
      <label>next</label>
    </callAction>
    
    </p>
    <p>What is 2+2? <answer>4</answer></p>
  
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
  
    `

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinput1Name = stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let mathinput1DisplayAnchor = cesc('#' + mathinput1Name) + " .mq-editable-field";
      let answer1Correct = cesc('#' + mathinput1Name + "_correct");
      let answer1Incorrect = cesc('#' + mathinput1Name + "_incorrect");

      let mathinput4Name = stateVariables["/_answer4"].stateValues.inputChildren[0].componentName;
      let mathinput4Anchor = cesc('#' + mathinput4Name) + " textarea";
      let mathinput4DisplayAnchor = cesc('#' + mathinput4Name) + " .mq-editable-field";
      let answer4Correct = cesc('#' + mathinput4Name + "_correct");
      let answer4Incorrect = cesc('#' + mathinput4Name + "_incorrect");


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

      cy.get(cesc('#/ca')).should('have.text', '0.5');

      cy.get(cesc('#/name_input')).type("Me{enter}");
      cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")
      cy.get(cesc('#/ca')).should('have.text', '0.5');
      cy.get(cesc('#/name_input')).should('have.value', "Me")


      cy.get(mathinput1Anchor).should('not.exist');

      cy.get(mathinput4Anchor).type("{end}{backspace}3", { force: true })
      cy.get(answer4Correct).should('not.exist')
      cy.get(mathinput4Anchor).type("{enter}", { force: true })
      cy.get(answer4Incorrect).should('be.visible')

      cy.get(cesc('#/ca')).should('have.text', '0.25');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
      })

      cy.log('back to page 1')
      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get(cesc('#/_title1')).should('have.text', 'Page 1');
      cy.get(cesc('#/_section2_title')).should('not.exist')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(answer1Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.25');
      cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
      })

      cy.get(cesc('#/name')).should('not.exist');

      cy.log('back to second page')
      cy.get(cesc('#/nextPage_button')).click();
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(cesc('#/name_input')).should('have.value', "Me")
      cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")

      cy.get(answer4Incorrect).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.25');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
      })

      cy.get(mathinput4Anchor).type("{end}{backspace}4", { force: true })
      cy.get(answer4Incorrect).should('not.exist')
      cy.get(mathinput4Anchor).type("{enter}", { force: true })

      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.5');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      cy.log('on to third page');
      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('not.exist');
      cy.get(cesc('#/_title2')).should('have.text', 'Page 3')


      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.5');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      // cy.get('#\\/mxx .mjx-mrow').should('contain.text', 'x+x')
      // cy.get('#\\/myy .mjx-mrow').should('contain.text', 'y+y')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();


        let mathinput2Name = (stateVariables["/_answer2"].stateValues.inputChildren)[0].componentName;
        let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
        let mathinput2DisplayAnchor = cesc('#' + mathinput2Name) + " .mq-editable-field";
        let answer2Correct = cesc('#' + mathinput2Name + "_correct");
        let answer2Incorrect = cesc('#' + mathinput2Name + "_incorrect");

        let mathinput3Name = (stateVariables["/_answer3"].stateValues.inputChildren)[0].componentName;
        let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
        let mathinput3DisplayAnchor = cesc('#' + mathinput3Name) + " .mq-editable-field";
        let answer3Correct = cesc('#' + mathinput3Name + "_correct");
        let answer3Incorrect = cesc('#' + mathinput3Name + "_incorrect");

        cy.get(mathinput2Anchor).type("2x{enter}", { force: true })
        cy.get(answer2Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.75');
        cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2x')
        })

        cy.get(mathinput3Anchor).type("2y{enter}", { force: true })
        cy.get(answer3Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '1');
        cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2y')
        })

        cy.get(mathinput2Anchor).type("{end}{backspace}z", { force: true })
        cy.get(answer2Correct).should('not.exist')
        cy.get(mathinput2Anchor).type("{enter}", { force: true })
        cy.get(answer2Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.75');
        cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2z')
        })

        cy.log('back to second page')
        cy.get(cesc('#/prevPage_button')).click();
        cy.get(cesc('#/_title1')).should('not.exist');
        cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
        cy.get(cesc('#/_title2')).should('not.exist');

        cy.get(cesc('#/name_input')).should('have.value', "Me")
        cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")

        cy.get(answer4Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.75')
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
        })

        cy.log('back to third page');
        cy.get(cesc('#/pcontrols_next')).click()
        cy.get(cesc('#/_title1')).should('not.exist');
        cy.get(cesc('#/_section2_title')).should('not.exist');
        cy.get(cesc('#/_title2')).should('have.text', 'Page 3')

        cy.get(answer4Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.75')
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

        cy.get(cesc('#/ca')).should('have.text', '0.75')

        cy.log('back to second page')
        cy.get(cesc('#/prevPage_button')).click();
        cy.get(cesc('#/_title1')).should('not.exist');
        cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
        cy.get(cesc('#/_title2')).should('not.exist');

        cy.get(cesc('#/name_input')).should('have.value', "Me")
        cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")

        cy.get(answer4Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.75')
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
        })

      });

    })

    cy.wait(2000);   // make sure 1 second debounce is satisified
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.log('on page two')

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables["/_answer4"];
    }))

    cy.get(cesc('#/_title1')).should('not.exist');
    cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
    cy.get(cesc('#/_title2')).should('not.exist');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();


      let mathinput4Name = stateVariables["/_answer4"].stateValues.inputChildren[0].componentName;
      let mathinput4Anchor = cesc('#' + mathinput4Name) + " textarea";
      let mathinput4DisplayAnchor = cesc('#' + mathinput4Name) + " .mq-editable-field";
      let answer4Correct = cesc('#' + mathinput4Name + "_correct");
      let answer4Incorrect = cesc('#' + mathinput4Name + "_incorrect");


      cy.get(cesc('#/name_input')).should('have.value', "Me")
      cy.get(cesc('#/_p3')).should('have.text', "Hello, Me!")

      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.75');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      cy.get(cesc('#/name_input')).clear().type("You{enter}");
      cy.get(cesc('#/name_input')).should('have.value', "You")
      cy.get(cesc('#/_p3')).should('have.text', "Hello, You!")

      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.75');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      cy.log('to third page');
      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('not.exist');
      cy.get(cesc('#/_title2')).should('have.text', 'Page 3')


      cy.get(answer4Correct).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.75');
      cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
      })

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();


        let mathinput2Name = stateVariables["/_answer2"].stateValues.inputChildren[0].componentName;
        let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
        let mathinput2DisplayAnchor = cesc('#' + mathinput2Name) + " .mq-editable-field";
        let answer2Correct = cesc('#' + mathinput2Name + "_correct");
        let answer2Incorrect = cesc('#' + mathinput2Name + "_incorrect");
        let answer2Submit = cesc('#' + mathinput2Name + "_submit");

        let mathinput3Name = stateVariables["/_answer3"].stateValues.inputChildren[0].componentName;
        let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
        let mathinput3DisplayAnchor = cesc('#' + mathinput3Name) + " .mq-editable-field";
        let answer3Correct = cesc('#' + mathinput3Name + "_correct");
        let answer3Incorrect = cesc('#' + mathinput3Name + "_incorrect");

        cy.get(answer2Incorrect).should('be.visible')
        cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2z')
        })
        cy.get(answer3Correct).should('be.visible')
        cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2y')
        })


        cy.get(mathinput3Anchor).type("{end}{backspace}q", { force: true })
        cy.get(answer3Correct).should('not.exist')
        cy.get(mathinput3Anchor).type("{enter}", { force: true })
        cy.get(answer3Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.5');
        cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2q')
        })

        cy.get(mathinput4Anchor).type("{end}{backspace}3", { force: true })
        cy.get(answer4Correct).should('not.exist')
        cy.get(mathinput4Anchor).type("{enter}", { force: true })
        cy.get(answer4Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.25');
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
        })


        cy.get(mathinput2Anchor).type("{end}{backspace}x", { force: true })
        cy.get(answer2Incorrect).should('not.exist')
        cy.get(mathinput2Anchor).type("{enter}", { force: true })
        cy.get(answer2Correct).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.5');
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
        cy.get(cesc('#/ca')).should('have.text', '0.5');
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
        })

        cy.log('to first page');
        cy.get(cesc('#/pcontrols_previous')).click()
        cy.get(cesc('#/_title1')).should('have.text', 'Page 1');
        cy.get(cesc('#/_section2_title')).should('not.exist')
        cy.get(cesc('#/_title2')).should('not.exist');

        cy.get(answer4Incorrect).should('be.visible')
        cy.get(cesc('#/ca')).should('have.text', '0.5');
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
        })

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          let mathinput1Name = stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
          let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
          let mathinput1DisplayAnchor = cesc('#' + mathinput1Name) + " .mq-editable-field";
          let answer1Correct = cesc('#' + mathinput1Name + "_correct");
          let answer1Incorrect = cesc('#' + mathinput1Name + "_incorrect");

          cy.get(answer1Correct).should('be.visible')
          cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
          })

          cy.get(mathinput1Anchor).type("{end}-", { force: true })
          cy.get(answer1Correct).should('not.exist')
          cy.get(mathinput1Anchor).type("{enter}", { force: true })
          cy.get(answer1Incorrect).should('be.visible')
          cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2−')
          })
          cy.get(cesc('#/ca')).should('have.text', '0.25');


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

          cy.get(cesc('#/pcontrols_next')).click()
          cy.get(cesc('#/_title1')).should('not.exist');
          cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
          cy.get(cesc('#/_title2')).should('not.exist');

          cy.get(cesc('#/pcontrols_next')).click()
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
          cy.get(cesc('#/ca')).should('have.text', '0.25');

          cy.get(mathinput2Anchor).type("{end}:", { force: true }).blur()
          cy.get(answer2Submit).should('be.visible');
          cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
            expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2x:')
          })
          cy.get(cesc('#/ca')).should('have.text', '0.25');

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
          cy.get(cesc('#/ca')).should('have.text', '0.25');


        })
      })

    })

    cy.wait(2000);  // wait for 1 second debounce
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables["/_answer4"];
    }))

    cy.log('on third page without first and second defined')
    cy.get(cesc('#/_title1')).should('not.exist');
    cy.get(cesc('#/_section2_title')).should('not.exist');
    cy.get(cesc('#/_title2')).should('have.text', 'Page 3')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinput2Name = stateVariables["/_answer2"].stateValues.inputChildren[0].componentName;
      let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
      let mathinput2DisplayAnchor = cesc('#' + mathinput2Name) + " .mq-editable-field";
      let answer2Correct = cesc('#' + mathinput2Name + "_correct");
      let answer2Incorrect = cesc('#' + mathinput2Name + "_incorrect");
      let answer2Submit = cesc('#' + mathinput2Name + "_submit");

      let mathinput3Name = stateVariables["/_answer3"].stateValues.inputChildren[0].componentName;
      let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
      let mathinput3DisplayAnchor = cesc('#' + mathinput3Name) + " .mq-editable-field";
      let answer3Correct = cesc('#' + mathinput3Name + "_correct");
      let answer3Incorrect = cesc('#' + mathinput3Name + "_incorrect");

      let mathinput4Name = stateVariables["/_answer4"].stateValues.inputChildren[0].componentName;
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
      cy.get(cesc('#/ca')).should('have.text', '0.25');


      cy.log('to second page');
      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(cesc('#/name_input')).should('have.value', "You")
      cy.get(cesc('#/_p3')).should('have.text', "Hello, You!")

      cy.get(answer4Incorrect).should('be.visible')
      cy.get(cesc('#/ca')).should('have.text', '0.25');
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
      cy.get(cesc('#/ca')).should('have.text', '0.25');

      cy.log('to first page')
      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get(cesc('#/_title1')).should('not.exist');
      cy.get(cesc('#/_section2_title')).should('have.text', 'Section 2')
      cy.get(cesc('#/_title2')).should('not.exist');

      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get(cesc('#/_title1')).should('have.text', 'Page 1');
      cy.get(cesc('#/_section2_title')).should('not.exist')
      cy.get(cesc('#/_title2')).should('not.exist');



      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let mathinput1Name = stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
        let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
        let mathinput1DisplayAnchor = cesc('#' + mathinput1Name) + " .mq-editable-field";
        let answer1Correct = cesc('#' + mathinput1Name + "_correct");
        let answer1Incorrect = cesc('#' + mathinput1Name + "_incorrect");

        cy.get(answer1Incorrect).should('be.visible')
        cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2−')
        })
        cy.get(cesc('#/ca')).should('have.text', '0.25');

        cy.get(answer4Incorrect).should('be.visible')
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
        })

      })

    })

  })


  it('With weights', () => {

    let doenetML = `
    <text>a</text>
  
    <paginatorControls paginator="pgn" name="pcontrols" />
  
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
  
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
  
    `

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let textinput1Name = stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
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

      cy.wait(200);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let textinput2Name = stateVariables["/_answer2"].stateValues.inputChildren[0].componentName;
        let textinput2Anchor = cesc('#' + textinput2Name) + "_input";
        let textinput2DisplayAnchor = cesc('#' + textinput2Name) + " .mq-editable-field";
        let answer2Submit = cesc('#' + textinput2Name + "_submit");
        let answer2Correct = cesc('#' + textinput2Name + "_correct");
        let answer2Incorrect = cesc('#' + textinput2Name + "_incorrect");

        cy.get(answer2Submit).should('be.visible')


        cy.get(cesc('#/pcontrols_next')).click()
        cy.get(cesc('#/_problem3_title')).should('have.text', 'Problem 3')
        cy.get(cesc('#/ca')).should('have.text', '0.167');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          let textinput3Name = stateVariables["/_answer3"].stateValues.inputChildren[0].componentName;
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

          cy.get(textinput1Anchor).clear()
          cy.get(answer1Correct).should('not.exist')
          cy.get(textinput1Anchor).type("{enter}")
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


    cy.wait(2000);  // wait for 1 second debounce
    cy.reload();

    cy.window().then(async (win) => {
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

  it.skip('With selects, specify variants', () => {

    let doenetML = `
    <text>a</text>
  
    <paginatorControls paginator="pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <select assignNames="(problem1)">
        <option>
          <problem newNamespace>
            <title>Problem A</title>
            <p>Enter <m>$n</m>.
              <answer name="ans1">
                <mathinput name="input1"/>
                <award>$n</award>
              </answer>
            </p>
            <p>What is <m>1+$n</m>? 
              <answer name="ans2">
                <mathinput name="input2"/>
                <award>1+$n</award>
              </answer>
            </p>
            <selectFromSequence from="1" to="10" assignNames="n" hide />
          </problem>
        </option>
        <option>
          <problem newNamespace>
            <variantControl nVariants="50" />
            <title>Problem B</title>
            <p>Enter <m>$n</m>.
              <answer name="ans1">
                <mathinput name="input1"/>
                <award>$n</award>
              </answer>
            </p>
            <p>What is <m>1-$n</m>? 
              <answer name="ans2">
                <mathinput name="input2"/>
                <award>1-$n</award>
              </answer>
            </p>
            <selectFromSequence from="1" to="10" assignNames="n" hide />
          </problem>
        </option>
      </select>
      <select assignNames = "(((problem2) (problem3)))">
        <option>
          <select numberToSelect="2">
            <option>
              <problem newNamespace>
                <title>Problem C</title>
                <p>What is <m>2+$n</m>? 
                  <answer name="ans">
                    <mathinput name="input"/>
                    <award>2+$n</award>
                  </answer>
                </p>
                <selectFromSequence from="1" to="10" assignNames="n" hide />
              </problem>
            </option>
            <option>
              <problem newNamespace>
                <title>Problem D</title>
                <variantControl nVariants="50" />
                <p>What is <m>2-$n</m>? 
                  <answer name="ans">
                    <mathinput name="input"/>
                    <award>2-$n</award>
                  </answer>
                </p>
                <selectFromSequence from="1" to="10" assignNames="n" hide />
              </problem>
            </option>
          </select>
        </option>
        <option>
          <select numberToSelect="2">
            <option>
              <problem newNamespace>
                <title>Problem E</title>
                <variantcontrol nVariants="3" variantNames="one two three" />
                <select assignNames="(n)" hide>
                  <option selectForVariantNames="one"><number>1</number></option>
                  <option selectForVariantNames="two"><number>2</number></option>
                  <option selectForVariantNames="three"><number>3</number></option>
                </select>
                <p>What is <m>3+$n</m>? 
                  <answer name="ans">
                    <mathinput name="input"/>
                    <award>3+$n</award>
                  </answer>
                </p>
              </problem>
            </option>
            <option>
              <problem newNamespace>
                <title>Problem F</title>
                <variantcontrol nVariants="3" variantNames="four five six" />
                <select assignNames="(n)" hide>
                  <option selectForVariantNames="four"><number>4</number></option>
                  <option selectForVariantNames="five"><number>5</number></option>
                  <option selectForVariantNames="six"><number>6</number></option>
                </select>
                <p>What is <m>3-$n</m>? 
                  <answer name="ans">
                    <mathinput name="input"/>
                    <award>3-$n</award>
                  </answer>
                </p>
              </problem>
            </option>
          </select>
        </option>
      </select>
      <problem name="problem4" newNamespace>
        <title>Problem G</title>
        <selectFromSequence from="101" to="999" name="n" hide/>
        <p>What is <m>2 \\cdot $n</m>? 
          <answer name="ans">
            <mathinput name="input"/>
            <award>2$n</award>
          </answer>
        </p>
      </problem>
      <problem name="problem5" newNamespace>
        <title>Problem H</title>
        <variantControl nVariants="7" variantNames="apple banana cherry date elderberry fig grape" />
        <!-- Note: explicitly don't put fruit in parens to test for previous error -->
        <select assignNames="fruit" hide>
          <option selectForVariantNames="apple"><text>apple</text></option>
          <option selectForVariantNames="banana"><text>banana</text></option>
          <option selectForVariantNames="cherry"><text>cherry</text></option>
          <option selectForVariantNames="date"><text>date</text></option>
          <option selectForVariantNames="elderberry"><text>elderberry</text></option>
          <option selectForVariantNames="fig"><text>fig</text></option>
          <option selectForVariantNames="grape"><text>grape</text></option>
        </select>
        <p>Enter $fruit:
          <answer name="ans" type="text">
            <textinput name="input"/>
            <award>$fruit</award>
          </answer>
        </p>
      </problem>
    </paginator>
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
    `

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariant: {
          subvariants: [{
            indices: [1],
            subvariants: [{
              subvariants: [{
                indices: [7]
              }]
            }]
          }, {
            indices: [2],
            subvariants: [{
              indices: [2, 1],
              subvariants: [{
                index: 1
              }, {
                index: 2
              }]
            }]
          }, {
            subvariants: [{
              indices: [152]
            }]
          }, {
            index: 6
          }]
        }
      }, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/problem1/_title1')).should('have.text', 'Problem A')
    cy.get(cesc('#/ca')).should('have.text', '0')

    cy.get(cesc('#/problem1/input1') + " textarea").type('7{enter}', { force: true });
    cy.get(cesc('#/problem1/input1_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.1')


    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/problem2/_title1')).should('have.text', 'Problem F')
    cy.get(cesc('#/ca')).should('have.text', '0.1')

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>b</text>
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/problem2/_title1')).should('have.text', 'Problem F')
    cy.get(cesc('#/ca')).should('have.text', '0.1')


    cy.get(cesc('#/problem2/input') + " textarea").type('-1{enter}', { force: true });
    cy.get(cesc('#/problem2/input_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>b</text>
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/problem2/_title1')).should('have.text', 'Problem F')
    cy.get(cesc('#/problem2/input_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')

    cy.get(cesc('#/pcontrols_previous')).click()
    cy.get(cesc('#/problem1/_title1')).should('have.text', 'Problem A')
    cy.get(cesc('#/problem1/input1_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')

    cy.get(cesc('#/problem1/input1') + " textarea").type('{end}{backspace}8{enter}', { force: true });
    cy.get(cesc('#/problem1/input1_incorrect')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.2')

    cy.get(cesc('#/problem1/input2') + " textarea").type('8{enter}', { force: true });
    cy.get(cesc('#/problem1/input2_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>b</text>
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/problem1/_title1')).should('have.text', 'Problem A')
    cy.get(cesc('#/problem1/input1_incorrect')).should('be.visible');
    cy.get(cesc('#/problem1/input2_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')


    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/problem2/_title1')).should('have.text', 'Problem F')
    cy.get(cesc('#/problem2/input_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/problem3/_title1')).should('have.text', 'Problem E')
    cy.get(cesc('#/ca')).should('have.text', '0.3')

    cy.get(cesc('#/problem3/input') + " textarea").type('x^{enter}', { force: true });
    cy.get(cesc('#/problem3/input_incorrect')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>b</text>
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.get(cesc('#/problem3/_title1')).should('have.text', 'Problem E')
    cy.get(cesc('#/problem3/input_incorrect')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')


    cy.get(cesc('#/pcontrols_previous')).click()
    cy.get(cesc('#/problem2/_title1')).should('have.text', 'Problem F')
    cy.get(cesc('#/problem2/input_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')

    cy.get(cesc('#/pcontrols_previous')).click()
    cy.get(cesc('#/problem1/_title1')).should('have.text', 'Problem A')
    cy.get(cesc('#/problem1/input1_incorrect')).should('be.visible');
    cy.get(cesc('#/problem1/input2_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/problem2/_title1')).should('have.text', 'Problem F')
    cy.get(cesc('#/problem2/input_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>b</text>
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.get(cesc('#/problem2/_title1')).should('have.text', 'Problem F')
    cy.get(cesc('#/problem2/input_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/problem3/_title1')).should('have.text', 'Problem E')
    cy.get(cesc('#/problem3/input_incorrect')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.3')

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/problem4/_title1')).should('have.text', 'Problem G')
    cy.get(cesc('#/ca')).should('have.text', '0.3')

    cy.get(cesc('#/problem4/input') + " textarea").type('504{enter}', { force: true });
    cy.get(cesc('#/problem4/input_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.5')

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/problem5/_title1')).should('have.text', 'Problem H')
    cy.get(cesc('#/ca')).should('have.text', '0.5')

    cy.get(cesc('#/problem5/input_input')).type('fig{enter}', { force: true });
    cy.get(cesc('#/problem5/input_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.7')

    cy.get(cesc('#/pcontrols_previous')).click()
    cy.get(cesc('#/problem4/_title1')).should('have.text', 'Problem G')
    cy.get(cesc('#/problem4/input_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.7')


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>b</text>
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/problem4/_title1')).should('have.text', 'Problem G')
    cy.get(cesc('#/problem4/input_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.7')

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/problem5/_title1')).should('have.text', 'Problem H')
    cy.get(cesc('#/ca')).should('have.text', '0.7')


  })

  it('With external and internal copies', () => {

    let doenetML = `
    <text>a</text>
    <setup>
      <problem name="problema" newNamespace>
        <title>A hard problem</title>
        <p>What is 1+1? <answer><mathinput /><award>2</award></answer></p>
      </problem>
    </setup>

    <paginatorControls paginator="pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <copy assignNames="problem1" uri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" />
      <copy assignNames="problem2" uri="doenet:CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" />
      <copy assignNames="problem3" target="problema" link="false" />
  
    </paginator>
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
    `

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariantIndex: 3
        // for now, at least, variant 3 gives mouse....
        // subvariants: [{}, {
        //   name: "mouse"
        // }]
      }, "*");
    });


    let choices;

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')
    cy.get(cesc('#/ca')).should('have.text', '0')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = stateVariables['/problem1/_choiceinput1'].stateValues.choiceTexts;
      let mouseInd = choices.indexOf("squeak") + 1;
      cy.get(cesc(`#/problem1/_choiceinput1_choice${mouseInd}_input`)).click();
    })

    cy.get(cesc(`#/problem1/_choiceinput1_submit`)).click();
    cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.333')


    cy.wait(2000);  // wait for 1 second debounce
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let foundIt = Boolean(stateVariables["/problem1/_choiceinput1"]?.stateValues?.choiceTexts);
      return foundIt;
    }))

    cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')
    cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.333')

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')
    cy.get(cesc('#/ca')).should('have.text', '0.333')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinput2Name = stateVariables["/problem2/derivativeProblem/_answer1"].stateValues.inputChildren[0].componentName;

      let mathinput2Anchor = cesc(`#${mathinput2Name}`) + " textarea";
      let mathinput2Correct = cesc(`#${mathinput2Name}_correct`);

      cy.get(mathinput2Anchor).type('2x{enter}', { force: true })
      cy.get(mathinput2Correct).should("be.visible");
      cy.get(cesc('#/ca')).should('have.text', '0.667')


      cy.get(cesc('#/pcontrols_previous')).click();
      cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')
      cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '0.667')


      cy.wait(2000);  // wait for 1 second debounce
      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML
        }, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


      cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')
      cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '0.667')

      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')
      cy.get(mathinput2Correct).should("be.visible");
      cy.get(cesc('#/ca')).should('have.text', '0.667')

      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/problem3/_title1')).should('have.text', 'A hard problem')
      cy.get(cesc('#/ca')).should('have.text', '0.667')


      cy.get(cesc('#/problem3/_mathinput1') + " textarea").type('2{enter}', { force: true })
      cy.get(cesc('#/problem3/_mathinput1_correct')).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '1')


      cy.wait(2000);  // wait for 1 second debounce
      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML
        }, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


      cy.get(cesc('#/problem3/_title1')).should('have.text', 'A hard problem')
      cy.get(cesc('#/problem3/_mathinput1_correct')).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '1')

      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get(cesc('#/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')
      cy.get(mathinput2Correct).should("be.visible");
      cy.get(cesc('#/ca')).should('have.text', '1')

      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')
      cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '1')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let choiceTexts = stateVariables["/problem1/_choiceinput1"].stateValues.choiceTexts;
        expect(choiceTexts).eqls(choices);
        let dogInd = choices.indexOf("woof") + 1;
        cy.get(cesc(`#/problem1/_choiceinput1_choice${dogInd}_input`)).click();
      })

      cy.get(cesc(`#/problem1/_choiceinput1_submit`)).click();
      cy.get(cesc(`#/problem1/_choiceinput1_incorrect`)).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '0.667')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let choiceTexts = stateVariables["/problem1/_choiceinput1"].stateValues.choiceTexts;
        expect(choiceTexts).eqls(choices);
        let mouseInd = choices.indexOf("squeak") + 1;
        cy.get(cesc(`#/problem1/_choiceinput1_choice${mouseInd}_input`)).click();
      })

      cy.get(cesc(`#/problem1/_choiceinput1_submit`)).click();
      cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '1')


    })


  })

  it('External and internal copies, with variantcontrols in document and problem', () => {

    let doenetML = `
    <text>a</text>
    <variantControl nVariants="100" />
    <setup>
      <problem name="problema" newNamespace>
        <variantControl nVariants="1" />
        <title>A hard problem</title>
        <p>What is 1+1? <answer><mathinput /><award>2</award></answer></p>
      </problem>
    </setup>

    <paginatorControls paginator="pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <copy assignNames="problem1" uri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" />
      <copy assignNames="problem2" uri="doenet:CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" />
      <copy assignNames="problem3" target="problema" link="false" />
  
    </paginator>
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
    `

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariantIndex: 10
          // for now, at least, variant 10 gives mouse....
          // subvariants: [{}, {
          //   name: "mouse"
          // }]
      }, "*");
    });



    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')
    cy.get(cesc('#/ca')).should('have.text', '0')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choices = [...stateVariables['/problem1/_choiceinput1'].stateValues.choiceTexts];
      let mouseInd = choices.indexOf("squeak") + 1;
      cy.get(cesc(`#/problem1/_choiceinput1_choice${mouseInd}_input`)).click();
    })

    cy.get(cesc(`#/problem1/_choiceinput1_submit`)).click();
    cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.333')


    cy.wait(2000);  // wait for 1 second debounce
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')
    cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.333')

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')
    cy.get(cesc('#/ca')).should('have.text', '0.333')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinput2Name = stateVariables["/problem2/derivativeProblem/_answer1"].stateValues.inputChildren[0].componentName;

      let mathinput2Anchor = cesc(`#${mathinput2Name}`) + " textarea";
      let mathinput2Correct = cesc(`#${mathinput2Name}_correct`);

      cy.get(mathinput2Anchor).type('2x{enter}', { force: true })
      cy.get(mathinput2Correct).should("be.visible");
      cy.get(cesc('#/ca')).should('have.text', '0.667')


      cy.get(cesc('#/pcontrols_previous')).click();
      cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')
      cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '0.667')


      cy.wait(2000);  // wait for 1 second debounce
      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML
        }, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


      cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')
      cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '0.667')

      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')
      cy.get(mathinput2Correct).should("be.visible");
      cy.get(cesc('#/ca')).should('have.text', '0.667')

      cy.get(cesc('#/pcontrols_next')).click()
      cy.get(cesc('#/problem3/_title1')).should('have.text', 'A hard problem')
      cy.get(cesc('#/ca')).should('have.text', '0.667')


      cy.get(cesc('#/problem3/_mathinput1') + " textarea").type('2{enter}', { force: true })
      cy.get(cesc('#/problem3/_mathinput1_correct')).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '1')


      cy.wait(2000);  // wait for 1 second debounce
      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML
        }, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


      cy.get(cesc('#/problem3/_title1')).should('have.text', 'A hard problem')
      cy.get(cesc('#/problem3/_mathinput1_correct')).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '1')

      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get(cesc('#/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')
      cy.get(mathinput2Correct).should("be.visible");
      cy.get(cesc('#/ca')).should('have.text', '1')

      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')
      cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '1')


    })


  })

  it('Variantcontrols in document and problem', () => {

    let doenetML = `
    <text>a</text>
    <variantControl nVariants="100" />

    <paginatorControls paginator="pgn" name="pcontrols" />

    <paginator name="pgn">
      <problem>
        <title>Type a number</title>
        <variantControl nVariants="100" />
        <selectFromSequence assignNames="a" from="1" to="1000" hide />
        $a: <answer>$a</answer>
      </problem>  
      <problem>
        <title>Type a letter</title>
        <variantControl nVariants="3" />
        <select assignNames="b" hide >u v w x y z</select>
        $b: <answer>$b</answer>
      </problem>  
     
    </paginator>
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
    `

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/_title1')).should('have.text', 'Type a number')
    cy.get(cesc('#/ca')).should('have.text', '0')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let a = stateVariables["/a"].stateValues.value;

      let mathinput1Name = stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinput1Anchor = cesc(`#${mathinput1Name}`) + " textarea";
      let mathinput1Correct = cesc(`#${mathinput1Name}_correct`);

      cy.get(mathinput1Anchor).type(`${a}{enter}`, { force: true });
      cy.get(mathinput1Correct).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '0.5')

    })


    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/_title2')).should('have.text', 'Type a letter')
    cy.get(cesc('#/ca')).should('have.text', '0.5')

    cy.wait(100);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let b = stateVariables["/b"].stateValues.value;

      let mathinput2Name = stateVariables["/_answer2"].stateValues.inputChildren[0].componentName;
      let mathinput2Anchor = cesc(`#${mathinput2Name}`) + " textarea";
      let mathinput2Correct = cesc(`#${mathinput2Name}_correct`);

      cy.get(mathinput2Anchor).type(`${b}{enter}`, { force: true });
      cy.get(mathinput2Correct).should('be.visible');
      cy.get(cesc('#/ca')).should('have.text', '1')

    })

    cy.wait(2000);  // wait for 1 second debounce
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return Boolean(stateVariables["/_answer2"]);
    }))


    cy.get(cesc('#/_title2')).should('have.text', 'Type a letter')
    cy.get(cesc('#/ca')).should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinput2Name = stateVariables["/_answer2"].stateValues.inputChildren[0].componentName;
      let mathinput2Correct = cesc(`#${mathinput2Name}_correct`);

      cy.get(mathinput2Correct).should('be.visible');

    })

    cy.get(cesc('#/pcontrols_previous')).click()
    cy.get(cesc('#/_title1')).should('have.text', 'Type a number')
    cy.get(cesc('#/ca')).should('have.text', '1')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinput1Name = stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinput1Correct = cesc(`#${mathinput1Name}_correct`);

      cy.get(mathinput1Correct).should('be.visible');

    })


  })

  // removed this feature
  it.skip('Submit all answers on page change', () => {

    let doenetML = `
    <text>a</text>
    <paginatorControls paginator="pgn" name="pcontrols" />
  
    <paginator name="pgn" submitAllOnPageChange>
      <problem>
        <title>Problem 1</title>
        <p>1: <answer><mathinput name="mi1"/><award>1</award></answer></p>
        <p>2: <answer><mathinput name="mi2"/><award>2</award></answer></p>
      </problem>
      <problem>
        <title>Problem 2</title>
        <p>3: <answer><mathinput name="mi3"/><award>3</award></answer></p>
        <p>4: <answer><mathinput name="mi4"/><award>4</award></answer></p>
        <p>5: <answer><mathinput name="mi5"/><award>5</award></answer></p>
      </problem>
      <problem>
        <title>Problem 3</title>
        <p>6: <answer><mathinput name="mi6"/><award>6</award></answer></p>
      </problem>
    </paginator>
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
    `

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/_title1')).should('have.text', 'Problem 1')
    cy.get(cesc('#/ca')).should('have.text', '0')

    cy.get('#\\/mi1 textarea').type("1", { force: true });
    cy.get('#\\/mi1_submit').should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0')

    cy.get('#\\/mi2 textarea').type("2{enter}", { force: true });
    cy.get('#\\/mi2_correct').should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.167')

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/_title2')).should('have.text', 'Problem 2')
    cy.get(cesc('#/ca')).should('have.text', '0.333');


    cy.get('#\\/mi3_submit').should('be.visible');
    cy.get('#\\/mi4_submit').should('be.visible');
    cy.get('#\\/mi5_submit').should('be.visible');

    cy.get('#\\/mi3 textarea').type("3", { force: true });
    cy.get('#\\/mi3_submit').should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.333')

    cy.get('#\\/mi4 textarea').type("x", { force: true });
    cy.get('#\\/mi4_submit').should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.333')

    cy.get(cesc('#/pcontrols_previous')).click()
    cy.get(cesc('#/_title1')).should('have.text', 'Problem 1')
    cy.get(cesc('#/ca')).should('have.text', '0.444');

    cy.get('#\\/mi1_correct').should('be.visible');
    cy.get('#\\/mi2_correct').should('be.visible');

    cy.get('#\\/mi1 textarea').type("{end}{backspace}y", { force: true });
    cy.get('#\\/mi1_submit').should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.444');

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/_title2')).should('have.text', 'Problem 2')
    cy.get(cesc('#/ca')).should('have.text', '0.278');

    cy.get('#\\/mi3_correct').should('be.visible');
    cy.get('#\\/mi4_incorrect').should('be.visible');
    cy.get('#\\/mi5_incorrect').should('be.visible');

    cy.get('#\\/mi5 textarea').type("5", { force: true });
    cy.get('#\\/mi5_submit').should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.278');

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/_title3')).should('have.text', 'Problem 3')
    cy.get(cesc('#/ca')).should('have.text', '0.389');

    cy.get('#\\/mi6_submit').should('be.visible');

    cy.get('#\\/mi6 textarea').type("6", { force: true });
    cy.get('#\\/mi6_submit').should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.389');

    cy.get(cesc('#/pcontrols_previous')).click()
    cy.get(cesc('#/_title2')).should('have.text', 'Problem 2')
    cy.get(cesc('#/ca')).should('have.text', '0.722');

    cy.get('#\\/mi3_correct').should('be.visible');
    cy.get('#\\/mi4_incorrect').should('be.visible');
    cy.get('#\\/mi5_correct').should('be.visible');

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/_title3')).should('have.text', 'Problem 3')
    cy.get(cesc('#/ca')).should('have.text', '0.722');

    cy.get('#\\/mi6_correct').should('be.visible');

    cy.log('answers not submitted when readonly')
    cy.get('#\\/mi6 textarea').type("{end}{backspace}7", { force: true });
    cy.get('#\\/mi6_submit').should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.722');

    // at least right now, this turns on Read Only
    cy.get('h3 > button').click();
    cy.get(':nth-child(5) > label > input').click()
    cy.get('h3 > button').click();

    cy.get(cesc('#/pcontrols_previous')).click()
    cy.get(cesc('#/ca')).should('have.text', '0.722');

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get('#\\/mi6_submit').should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.722');

  })

  // Do we restore this feature?
  it.skip('Paginator controls ignore read only flag', () => {

    let doenetML = `
    <text>a</text>
    <paginatorControls paginator="pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <problem>
        <title>Problem 1</title>
        <p>1: <answer type="text"><textinput name="ti1"/><award>1</award></answer></p>
      </problem>
      <problem>
        <title>Problem 2</title>
        <p>2: <answer type="text"><textinput name="ti2"/><award>2</award></answer></p>
      </problem>
    </paginator>
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
    `

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/_title1')).should('have.text', 'Problem 1')

    cy.get('#\\/ti1_input').type("1{enter}");
    cy.get('#\\/ti1_input').should('have.value', '1');

    cy.get('#\\/ti1_correct').should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.5')

    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/_title2')).should('have.text', 'Problem 2')

    cy.get('#\\/ti2_input').type("2");
    cy.get('#\\/ti2_input').should('have.value', '2');
    cy.get('#\\/ti2_submit').should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.5')


    // at least right now, this turns on Read Only
    cy.get('h3 > button').click();
    cy.get(':nth-child(5) > label > input').click()
    cy.get('h3 > button').click();

    cy.get('#\\/ti2_input').should('be.disabled')
    cy.get('#\\/ti2_input').should('have.value', '2');
    cy.get('#\\/ti2_submit').should('be.disabled')


    cy.get(cesc('#/pcontrols_previous')).click()
    cy.get(cesc('#/_title1')).should('have.text', 'Problem 1')
    cy.get(cesc('#/ca')).should('have.text', '0.5');

    cy.get('#\\/ti1_input').should('be.disabled')
    cy.get('#\\/ti1_input').should('have.value', '1');


    cy.get(cesc('#/pcontrols_next')).click()
    cy.get(cesc('#/_title2')).should('have.text', 'Problem 2')
    cy.get(cesc('#/ca')).should('have.text', '0.5');

    cy.get('#\\/ti2_input').should('be.disabled')
    cy.get('#\\/ti2_input').should('have.value', '2');
    cy.get('#\\/ti2_submit').should('be.disabled')


  })

  it.only('Variants stay consistent with external copies', () => {

    let doenetMLWithSelects = `
    <text>a</text>
    <paginatorControls paginator="pgn" name="pcontrols" />

    <paginator name="pgn">
      <select numberToSelect="2" assignNames="((problem1)) ((problem2))">
        <option>
          <copy uri="doenet:cid=bafkreif3jsrmitv2j5urwrmru7ra56aapzniexoul5elyr2y2osd6wxs7i" />
        </option>
        <option>
          <copy uri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" />
        </option>
      </select>    
    </paginator>
    
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
    `

    let doenetMLorder1 = `
    <text>a</text>
    <paginatorControls paginator="pgn" name="pcontrols" />
    <paginator name="pgn">
      <copy uri="doenet:cid=bafkreif3jsrmitv2j5urwrmru7ra56aapzniexoul5elyr2y2osd6wxs7i" assignNames="problem1" />
      <copy uri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" assignNames="problem2" />
    </paginator>
    
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
    `

    let doenetMLorder2 = `
    <text>a</text>
    <paginatorControls paginator="pgn" name="pcontrols" />
    <paginator name="pgn">
      <copy uri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" assignNames="problem1" />
      <copy uri="doenet:cid=bafkreif3jsrmitv2j5urwrmru7ra56aapzniexoul5elyr2y2osd6wxs7i" assignNames="problem2" />
    </paginator>
    
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
    `

    let allDoenetMLs = [
      doenetMLorder1, doenetMLorder2,
      doenetMLWithSelects, doenetMLWithSelects,
      doenetMLWithSelects, doenetMLWithSelects
    ]

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(1000)
    cy.get('#testRunner_toggleControls').click();


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: allDoenetMLs[0],
      }, "*");
    });


    for (let attemptNumber = 1; attemptNumber <= 6; attemptNumber++) {

      if (attemptNumber > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.get('#testRunner_toggleControls').click();

        cy.wait(1000)

        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: allDoenetMLs[attemptNumber - 1]
          }, "*");
        });
        cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


      }



      let problemInfo = [{}, {}];
      let problemOrder;

      cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_document1"].stateValues.generatedVariantInfo.index).eq(attemptNumber)

        if (stateVariables["/problem1/a"]) {
          problemOrder = [1, 2];
        } else {
          problemOrder = [2, 1];
        }

        let creditAchieved = 0;

        for (let ind = 0; ind < 2; ind++) {
          if (ind === 1) {
            cy.get(cesc('#/pcontrols_next')).click()
          }

          cy.wait(0).then(_ => {

            cy.get(cesc('#/ca')).should('have.text', `${creditAchieved}`)


            let thisProbInfo = problemInfo[ind];
            let thisProbName = `/problem${ind + 1}`

            if (problemOrder[ind] === 1) {

              cy.get(cesc(`#${thisProbName}/_problem1_title`)).should('have.text', `Problem ${ind + 1}`)
              cy.wait(10);

              cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();


                thisProbInfo.a = stateVariables[`${thisProbName}/a`].stateValues.value;
                thisProbInfo.v = stateVariables[`${thisProbName}/v`].stateValues.value;
                thisProbInfo.o1m = me.fromAst(stateVariables[`${thisProbName}/o1/m`].stateValues.value);
                thisProbInfo.o1t = stateVariables[`${thisProbName}/o1/t`].stateValues.value;
                thisProbInfo.o2m = me.fromAst(stateVariables[`${thisProbName}/o2/m`].stateValues.value);
                thisProbInfo.o2t = stateVariables[`${thisProbName}/o2/t`].stateValues.value;

                let mathinput1Name = stateVariables[`${thisProbName}/ans1`].stateValues.inputChildren[0].componentName;
                let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
                let answer1Correct = cesc('#' + mathinput1Name + "_correct");

                let mathinput2Name = stateVariables[`${thisProbName}/ans2`].stateValues.inputChildren[0].componentName;
                let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
                let answer2Correct = cesc('#' + mathinput2Name + "_correct");

                let textinput3Name = stateVariables[`${thisProbName}/ans3`].stateValues.inputChildren[0].componentName;
                let textinput3Anchor = cesc('#' + textinput3Name) + "_input";
                let answer3Correct = cesc('#' + textinput3Name + "_correct");

                let mathinput4Name = stateVariables[`${thisProbName}/ans4`].stateValues.inputChildren[0].componentName;
                let mathinput4Anchor = cesc('#' + mathinput4Name) + " textarea";
                let answer4Correct = cesc('#' + mathinput4Name + "_correct");

                let textinput5Name = stateVariables[`${thisProbName}/ans5`].stateValues.inputChildren[0].componentName;
                let textinput5Anchor = cesc('#' + textinput5Name) + "_input";
                let answer5Correct = cesc('#' + textinput5Name + "_correct");


                cy.get(mathinput1Anchor).type(`${thisProbInfo.a}${thisProbInfo.v.toString()}{enter}`, { force: true });
                cy.get(answer1Correct).should('be.visible');

                cy.get(mathinput2Anchor).type(`${thisProbInfo.o1m.toString()}{enter}`, { force: true });
                cy.get(answer2Correct).should('be.visible');

                cy.get(textinput3Anchor).type(`${thisProbInfo.o1t}{enter}`);
                cy.get(answer3Correct).should('be.visible');

                cy.get(mathinput4Anchor).type(`${thisProbInfo.o2m.toString()}{enter}`, { force: true });
                cy.get(answer4Correct).should('be.visible');

                cy.get(textinput5Anchor).type(`${thisProbInfo.o2t}{enter}`);
                cy.get(answer5Correct).should('be.visible');
              })

            } else {
              cy.get(cesc(`#${thisProbName}/_problem1_title`)).should('have.text', `Problem ${ind + 1}: Animal sounds`)
              cy.wait(10);

              cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();


                thisProbInfo.animal = stateVariables[`${thisProbName}/animal`].stateValues.value;
                thisProbInfo.sound = stateVariables[`${thisProbName}/sound`].stateValues.value;

                thisProbInfo.choices = [...stateVariables[`${thisProbName}/_choiceinput1`].stateValues.choiceTexts];
                thisProbInfo.animalInd = thisProbInfo.choices.indexOf(thisProbInfo.sound) + 1;
                cy.get(cesc(`#${thisProbName}/_choiceinput1_choice${thisProbInfo.animalInd}_input`)).click();

                cy.get(cesc(`#${thisProbName}/_choiceinput1_submit`)).click();
                cy.get(cesc(`#${thisProbName}/_choiceinput1_correct`)).should('be.visible');
              })
            }

            creditAchieved += 0.5;
          })


        }

      })

      cy.wait(2000)   // wait for 1 second debounce

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>b</text>
      `}, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: allDoenetMLs[attemptNumber - 1]
        }, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

      // wait until core is loaded
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let foundIt = Boolean(stateVariables["/_document1"]);
        return foundIt;
      }))


      for (let ind = 1; ind >= 0; ind--) {
        if (ind === 0) {
          cy.get(cesc('#/pcontrols_previous')).click()
        }

        cy.wait(0).then(_ => {

          cy.get(cesc('#/ca')).should('have.text', `1`)


          let thisProbInfo = problemInfo[ind];
          let thisProbName = `/problem${ind + 1}`

          if (problemOrder[ind] === 1) {

            cy.get(cesc(`#${thisProbName}/_problem1_title`)).should('have.text', `Problem ${ind + 1}`)
            cy.wait(10);

            cy.window().then(async (win) => {
              let stateVariables = await win.returnAllStateVariables1();

              expect(stateVariables[`${thisProbName}/a`].stateValues.value.toString()).eq(thisProbInfo.a.toString())
              expect(stateVariables[`${thisProbName}/v`].stateValues.value.toString()).eq(thisProbInfo.v.toString())
              expect(me.fromAst(stateVariables[`${thisProbName}/o1/m`].stateValues.value).toString()).eq(thisProbInfo.o1m.toString())
              expect(stateVariables[`${thisProbName}/o1/t`].stateValues.value.toString()).eq(thisProbInfo.o1t.toString())
              expect(me.fromAst(stateVariables[`${thisProbName}/o2/m`].stateValues.value).toString()).eq(thisProbInfo.o2m.toString())
              expect(stateVariables[`${thisProbName}/o2/t`].stateValues.value.toString()).eq(thisProbInfo.o2t.toString())


              let mathinput1Name = stateVariables[`${thisProbName}/ans1`].stateValues.inputChildren[0].componentName;
              let answer1Correct = cesc('#' + mathinput1Name + "_correct");

              let mathinput2Name = stateVariables[`${thisProbName}/ans2`].stateValues.inputChildren[0].componentName;
              let answer2Correct = cesc('#' + mathinput2Name + "_correct");

              let textinput3Name = stateVariables[`${thisProbName}/ans3`].stateValues.inputChildren[0].componentName;
              let answer3Correct = cesc('#' + textinput3Name + "_correct");

              let mathinput4Name = stateVariables[`${thisProbName}/ans4`].stateValues.inputChildren[0].componentName;
              let answer4Correct = cesc('#' + mathinput4Name + "_correct");

              let textinput5Name = stateVariables[`${thisProbName}/ans5`].stateValues.inputChildren[0].componentName;
              let answer5Correct = cesc('#' + textinput5Name + "_correct");


              cy.get(answer1Correct).should('be.visible');

              cy.get(answer2Correct).should('be.visible');

              cy.get(answer3Correct).should('be.visible');

              cy.get(answer4Correct).should('be.visible');

              cy.get(answer5Correct).should('be.visible');
            })

          } else {
            cy.get(cesc(`#${thisProbName}/_problem1_title`)).should('have.text', `Problem ${ind + 1}: Animal sounds`)
            cy.get(cesc(`#${thisProbName}/_choiceinput1_correct`)).should('be.visible');

            cy.wait(10);

            cy.window().then(async (win) => {
              let stateVariables = await win.returnAllStateVariables1();

              expect(stateVariables[`${thisProbName}/animal`].stateValues.value).eq(thisProbInfo.animal)
              expect(stateVariables[`${thisProbName}/sound`].stateValues.value).eq(thisProbInfo.sound)
              expect(stateVariables[`${thisProbName}/_choiceinput1`].stateValues.choiceTexts).eqls(thisProbInfo.choices)
              expect(thisProbInfo.choices.indexOf(thisProbInfo.sound) + 1).eq(thisProbInfo.animalInd)
              cy.get(cesc(`#${thisProbName}/_choiceinput1_correct`)).should('be.visible');
            })
          }

        })


      }


      cy.wait(2000);  // wait for 1 second debounce

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>b</text>
      `}, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: allDoenetMLs[attemptNumber - 1]
        }, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


      // wait until core is loaded
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let foundIt = Boolean(stateVariables["/_document1"]);
        return foundIt;
      }))

      for (let ind = 0; ind < 2; ind++) {
        if (ind === 1) {
          cy.get(cesc('#/pcontrols_next')).click()
        }

        cy.wait(0).then(_ => {

          cy.get(cesc('#/ca')).should('have.text', `1`)


          let thisProbInfo = problemInfo[ind];
          let thisProbName = `/problem${ind + 1}`

          if (problemOrder[ind] === 1) {

            cy.get(cesc(`#${thisProbName}/_problem1_title`)).should('have.text', `Problem ${ind + 1}`)
            cy.wait(10);

            cy.window().then(async (win) => {
              let stateVariables = await win.returnAllStateVariables1();

              expect(stateVariables[`${thisProbName}/a`].stateValues.value.toString()).eq(thisProbInfo.a.toString())
              expect(stateVariables[`${thisProbName}/v`].stateValues.value.toString()).eq(thisProbInfo.v.toString())
              expect(me.fromAst(stateVariables[`${thisProbName}/o1/m`].stateValues.value).toString()).eq(thisProbInfo.o1m.toString())
              expect(stateVariables[`${thisProbName}/o1/t`].stateValues.value.toString()).eq(thisProbInfo.o1t.toString())
              expect(me.fromAst(stateVariables[`${thisProbName}/o2/m`].stateValues.value).toString()).eq(thisProbInfo.o2m.toString())
              expect(stateVariables[`${thisProbName}/o2/t`].stateValues.value.toString()).eq(thisProbInfo.o2t.toString())


              let mathinput1Name = stateVariables[`${thisProbName}/ans1`].stateValues.inputChildren[0].componentName;
              let answer1Correct = cesc('#' + mathinput1Name + "_correct");

              let mathinput2Name = stateVariables[`${thisProbName}/ans2`].stateValues.inputChildren[0].componentName;
              let answer2Correct = cesc('#' + mathinput2Name + "_correct");

              let textinput3Name = stateVariables[`${thisProbName}/ans3`].stateValues.inputChildren[0].componentName;
              let answer3Correct = cesc('#' + textinput3Name + "_correct");

              let mathinput4Name = stateVariables[`${thisProbName}/ans4`].stateValues.inputChildren[0].componentName;
              let answer4Correct = cesc('#' + mathinput4Name + "_correct");

              let textinput5Name = stateVariables[`${thisProbName}/ans5`].stateValues.inputChildren[0].componentName;
              let answer5Correct = cesc('#' + textinput5Name + "_correct");


              cy.get(answer1Correct).should('be.visible');

              cy.get(answer2Correct).should('be.visible');

              cy.get(answer3Correct).should('be.visible');

              cy.get(answer4Correct).should('be.visible');

              cy.get(answer5Correct).should('be.visible');
            })

          } else {
            cy.get(cesc(`#${thisProbName}/_problem1_title`)).should('have.text', `Problem ${ind + 1}: Animal sounds`)
            cy.get(cesc(`#${thisProbName}/_choiceinput1_correct`)).should('be.visible');

            cy.wait(10);

            cy.window().then(async (win) => {
              let stateVariables = await win.returnAllStateVariables1();

              expect(stateVariables[`${thisProbName}/animal`].stateValues.value).eq(thisProbInfo.animal)
              expect(stateVariables[`${thisProbName}/sound`].stateValues.value).eq(thisProbInfo.sound)
              expect(stateVariables[`${thisProbName}/_choiceinput1`].stateValues.choiceTexts).eqls(thisProbInfo.choices)
              expect(thisProbInfo.choices.indexOf(thisProbInfo.sound) + 1).eq(thisProbInfo.animalInd)
              cy.get(cesc(`#${thisProbName}/_choiceinput1_correct`)).should('be.visible');
            })
          }

        })


      }

    }

  })

  it('Conditional content data is saved', () => {

    let doenetML = `
    <text>a</text>
    <paginatorControls paginator="pgn" name="pcontrols" />

    <paginator name="pgn">

    <problem name="problem1" newNamespace>

      <setup>
        <selectFromSequence from="1" to="2" assignNames="n" />
      </setup>

      <conditionalContent>
        <case condition="$n=1">
        <p>Answer x: <answer>x</answer></p>
        </case>
        <case condition="$n=2">
        <p>Answer y: <answer>y</answer></p>
        </case>
      </conditionalContent>
      
      <conditionalContent condition="$n=1" >
        <p>Answer 2x: <answer name="a1">2x</answer></p>
      </conditionalContent>
      <conditionalContent condition="$n=2" >
        <p>Answer 2y: <answer name="a2">2y</answer></p>
      </conditionalContent>
    </problem>
    
    <problem name="problem2" newNamespace>
    
      <setup>
        <number name="n">1</number>
      </setup>
      
      <conditionalContent>
        <case condition="$n=1">
        <p>Answer 1: <answer>1</answer></p>
        </case>
        <else>
        <p>Answer 1b: <answer>1b</answer></p>
        </else>
      </conditionalContent>
      
      <conditionalContent condition="$n=1" >
        <p>Answer 2: <answer>2</answer></p>
      </conditionalContent>
    
    </problem>
    </paginator>
    
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
  
    `


    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/problem1_title').should('have.text', 'Problem 1')
    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n = stateVariables["/problem1/n"].stateValues.value;

      let mathinput1Name = stateVariables[`/problem1/_answer${n}`].stateValues.inputChildren[0].componentName;
      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let mathinput1DisplayAnchor = cesc('#' + mathinput1Name) + " .mq-editable-field";
      let answer1Correct = cesc('#' + mathinput1Name + "_correct");
      let answer1Submit = cesc('#' + mathinput1Name + "_submit");

      let mathinput2Name = stateVariables[`/problem1/a${n}`].stateValues.inputChildren[0].componentName;
      let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
      let mathinput2DisplayAnchor = cesc('#' + mathinput2Name) + " .mq-editable-field";
      let answer2Correct = cesc('#' + mathinput2Name + "_correct");
      let answer2Submit = cesc('#' + mathinput2Name + "_submit");

      let correctAnswer = n === 1 ? 'x' : 'y';

      cy.get(mathinput1Anchor).type(`${correctAnswer}`, { force: true })
      cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal(correctAnswer)
      })
      cy.get(answer1Submit).click();

      cy.get('#\\/ca').should('have.text', '0.25')


      cy.get(mathinput2Anchor).type(`2${correctAnswer}`, { force: true })
      cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal(`2${correctAnswer}`)
      })
      cy.get(answer2Submit).click();

      cy.get('#\\/ca').should('have.text', '0.5')

      cy.get(cesc('#/pcontrols_next')).click()
      cy.get('#\\/problem2_title').should('have.text', 'Problem 2')
      cy.get('#\\/ca').should('have.text', '0.5')

      cy.get(cesc('#/pcontrols_previous')).click()
      cy.get('#\\/problem1_title').should('have.text', 'Problem 1')
      cy.get('#\\/ca').should('have.text', '0.5')

      cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal(correctAnswer)
      })
      cy.get(answer1Correct).should('be.visible');

      cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal(`2${correctAnswer}`)
      })
      cy.get(answer2Correct).should('be.visible');


      cy.get(cesc('#/pcontrols_next')).click()
      cy.get('#\\/problem2_title').should('have.text', 'Problem 2')
      cy.get('#\\/ca').should('have.text', '0.5')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let mathinput3Name = stateVariables[`/problem2/_answer1`].stateValues.inputChildren[0].componentName;
        let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
        let mathinput3DisplayAnchor = cesc('#' + mathinput3Name) + " .mq-editable-field";
        let answer3Correct = cesc('#' + mathinput3Name + "_correct");

        let mathinput4Name = stateVariables[`/problem2/_answer3`].stateValues.inputChildren[0].componentName;
        let mathinput4Anchor = cesc('#' + mathinput4Name) + " textarea";
        let mathinput4DisplayAnchor = cesc('#' + mathinput4Name) + " .mq-editable-field";
        let answer4Correct = cesc('#' + mathinput4Name + "_correct");


        cy.get(mathinput3Anchor).type(`1{enter}`, { force: true })
        cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
        })
        cy.get(answer3Correct).should('be.visible');

        cy.get('#\\/ca').should('have.text', '0.75')


        cy.get(mathinput4Anchor).type(`2{enter}`, { force: true })
        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
        })
        cy.get(answer4Correct).should('be.visible');

        cy.get('#\\/ca').should('have.text', '1')



        cy.get(cesc('#/pcontrols_previous')).click()
        cy.get('#\\/problem1_title').should('have.text', 'Problem 1')
        cy.get('#\\/ca').should('have.text', '1')

        cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal(correctAnswer)
        })
        cy.get(answer1Correct).should('be.visible');

        cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal(`2${correctAnswer}`)
        })
        cy.get(answer2Correct).should('be.visible');


        cy.get(cesc('#/pcontrols_next')).click()
        cy.get('#\\/problem2_title').should('have.text', 'Problem 2')
        cy.get('#\\/ca').should('have.text', '1')

        cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
        })
        cy.get(answer3Correct).should('be.visible');

        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
        })
        cy.get(answer4Correct).should('be.visible');

        cy.get('#\\/ca').should('have.text', '1')


        cy.wait(2000);   // wait for 1 second debounce

        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: '<text>b</text>',
          }, "*");
        });

        cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load



        cy.window().then(async (win) => {
          win.postMessage({
            doenetML,
          }, "*");
        });

        cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

        cy.get('#\\/problem2_title').should('have.text', 'Problem 2')
        cy.get('#\\/ca').should('have.text', '1')

        cy.get(mathinput3DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
        })
        cy.get(answer3Correct).should('be.visible');

        cy.get(mathinput4DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
        })
        cy.get(answer4Correct).should('be.visible');

        cy.get('#\\/ca').should('have.text', '1')


        cy.get(cesc('#/pcontrols_previous')).click()
        cy.get('#\\/problem1_title').should('have.text', 'Problem 1')
        cy.get('#\\/ca').should('have.text', '1')

        cy.get(mathinput1DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal(correctAnswer)
        })
        cy.get(answer1Correct).should('be.visible');

        cy.get(mathinput2DisplayAnchor).invoke('text').then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal(`2${correctAnswer}`)
        })
        cy.get(answer2Correct).should('be.visible');



      })


    })


  })


});