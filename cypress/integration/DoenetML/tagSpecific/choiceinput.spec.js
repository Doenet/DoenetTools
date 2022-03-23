import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('ChoiceInput Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('default is block format', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput randomizeOrder>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables['/_choiceinput1'].stateValues.choiceTexts];
      choiceOrder = [...stateVariables['/_choiceinput1'].stateValues.choiceOrder];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      // expect(stateVariables['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.inline).eq(false);
      expect(stateVariables['/_choiceinput1'].stateValues.randomizeOrder).eq(true);
      expect(stateVariables['/_choice1'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice2'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice3'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {
      cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).click().then(() => {

        // make this asynchronous so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
        cy.get('#\\/_p2').should('have.text', 'Selected index: ' + (i + 1))
      });

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
        expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
        // expect(stateVariables['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([originalChoices.indexOf(choices[i])+1])
        expect(stateVariables['/_choice1'].stateValues.selected).eq(choiceOrder[i] === 1);
        expect(stateVariables['/_choice2'].stateValues.selected).eq(choiceOrder[i] === 2);
        expect(stateVariables['/_choice3'].stateValues.selected).eq(choiceOrder[i] === 3);
        expect(stateVariables['/_choice4'].stateValues.selected).eq(choiceOrder[i] === 4);

      });
    }

  });

  it('inline choiceinput', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput inline randomizeOrder>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')

    cy.get("#\\/_choiceinput1").should('have.value', '')

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables['/_choiceinput1'].stateValues.choiceTexts];
      choiceOrder = [...stateVariables['/_choiceinput1'].stateValues.choiceOrder];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      // expect(stateVariables['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.inline).eq(true);
      expect(stateVariables['/_choiceinput1'].stateValues.randomizeOrder).eq(true);
      expect(stateVariables['/_choice1'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice2'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice3'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {
      cy.get(`#\\/_choiceinput1`).select(`${i + 1}`);
      cy.get("#\\/_choiceinput1").should('have.value', i + 1).then(() => {

        // make this asynchronous  so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
        cy.get('#\\/_p2').should('have.text', 'Selected index: ' + (i + 1))
      })

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
        expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
        // expect(stateVariables['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([originalChoices.indexOf(choices[i])+1])
        expect(stateVariables['/_choice1'].stateValues.selected).eq(choiceOrder[i] === 1);
        expect(stateVariables['/_choice2'].stateValues.selected).eq(choiceOrder[i] === 2);
        expect(stateVariables['/_choice3'].stateValues.selected).eq(choiceOrder[i] === 3);
        expect(stateVariables['/_choice4'].stateValues.selected).eq(choiceOrder[i] === 4);

      });
    }

  });

  it('fixed order', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')


    let choices;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables['/_choiceinput1'].stateValues.choiceTexts];
      expect(choices).eqls(originalChoices);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      // expect(stateVariables['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.inline).eq(false);
      expect(stateVariables['/_choiceinput1'].stateValues.randomizeOrder).eq(false);
      expect(stateVariables['/_choice1'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice2'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice3'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {
      cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).click().then(() => {

        // make this asynchronous  so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
        cy.get('#\\/_p2').should('have.text', 'Selected index: ' + (i + 1))

      });

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
        expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
        // expect(stateVariables['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([i + 1])
        expect(stateVariables['/_choice1'].stateValues.selected).eq(i === 0);
        expect(stateVariables['/_choice2'].stateValues.selected).eq(i === 1);
        expect(stateVariables['/_choice3'].stateValues.selected).eq(i === 2);
        expect(stateVariables['/_choice4'].stateValues.selected).eq(i === 3);

      });
    }

  });

  it('choiceinput references', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <choiceinput inline randomizeOrder name="ci1">
        <choice>a</choice>
        <choice>b</choice>
        <choice>c</choice>
        <choice>d</choice>
        <choice>e</choice>
        <choice>f</choice>
      </choiceinput>
      <copy name="copy" target="ci1" assignNames="ci2" />
      <copy name="copy2" inline="false" target="ci1" assignNames="ci3" />
      <copy name="copy3" inline="false" target="copy" assignNames="ci4" />
  
      <p>Selected values: <aslist>
      <copy prop='selectedvalue' target="ci1" />
      <copy prop='selectedvalue' target="copy" />
      <copy prop='selectedvalue' target="copy2" />
      <copy prop='selectedvalue' target="copy3" />
      </aslist></p>
      <p>Selected indices: <aslist>
      <copy prop='selectedindex' target="ci1" />
      <copy prop='selectedindex' target="copy" />
      <copy prop='selectedindex' target="copy2" />
      <copy prop='selectedindex' target="copy3" />
      </aslist></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["a", "b", "c", "d", "e", "f"];
    cy.get('#\\/_p1').should('have.text', 'Selected values: ')
    cy.get('#\\/_p2').should('have.text', 'Selected indices: ')


    let choices;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables['/ci1'].stateValues.choiceTexts];
      expect(choices.length).eq(6);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(originalChoices.includes(choices[4])).eq(true);
      expect(originalChoices.includes(choices[5])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(choices[4]).not.eq(choices[0]);
      expect(choices[4]).not.eq(choices[1]);
      expect(choices[4]).not.eq(choices[2]);
      expect(choices[4]).not.eq(choices[3]);
      expect(choices[5]).not.eq(choices[0]);
      expect(choices[5]).not.eq(choices[1]);
      expect(choices[5]).not.eq(choices[2]);
      expect(choices[5]).not.eq(choices[3]);
      expect(choices[5]).not.eq(choices[4]);
      expect(stateVariables['/ci2'].stateValues.choiceTexts).eqls(choices);
      expect(stateVariables['/ci3'].stateValues.choiceTexts).eqls(choices);
      expect(stateVariables['/ci4'].stateValues.choiceTexts).eqls(choices);

      expect(stateVariables['/ci1'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/ci1'].stateValues.selectedIndices).eqls([])
      expect(stateVariables['/ci2'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/ci2'].stateValues.selectedIndices).eqls([])
      expect(stateVariables['/ci3'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/ci3'].stateValues.selectedIndices).eqls([])
      expect(stateVariables['/ci4'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/ci4'].stateValues.selectedIndices).eqls([])

      expect(stateVariables['/ci1'].stateValues.inline).eq(true);
      expect(stateVariables['/ci1'].stateValues.randomizeOrder).eq(true);
      expect(stateVariables['/ci2'].stateValues.inline).eq(true);
      expect(stateVariables['/ci2'].stateValues.randomizeOrder).eq(true);
      expect(stateVariables['/ci3'].stateValues.inline).eq(false);
      expect(stateVariables['/ci3'].stateValues.randomizeOrder).eq(true);
      expect(stateVariables['/ci4'].stateValues.inline).eq(false);
      expect(stateVariables['/ci4'].stateValues.randomizeOrder).eq(true);
    });


    cy.log('select options in order from first input')
    for (let i = 0; i < 6; i++) {
      cy.get(`#\\/ci1`).select(`${i + 1}`).then(() => {

        // make this asynchronous  so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
        cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`)

        cy.window().then(async (win) => {

          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/ci1'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci1'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci2'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci2'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci3'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci3'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci4'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci4'].stateValues.selectedIndices).eqls([i + 1])

        });

      });
    }

    cy.log('select options in order from second input')
    for (let i = 0; i < 6; i++) {
      cy.get(`#\\/ci2`).select(`${i + 1}`).then(() => {

        // make this asynchronous  so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
        cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`)

        cy.window().then(async (win) => {

          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/ci1'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci1'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci2'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci2'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci3'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci3'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci4'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci4'].stateValues.selectedIndices).eqls([i + 1])

        });
      })

    }

    cy.log('select options in order from third input')
    for (let i = 0; i < 6; i++) {
      cy.get(`${`#\\/ci3`}_choice${i + 1}_input`).click().then(() => {

        // make this asynchronous  so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
        cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`)


        cy.window().then(async (win) => {

          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/ci1'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci1'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci2'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci2'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci3'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci3'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci4'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci4'].stateValues.selectedIndices).eqls([i + 1])

        })

      });
    }

    cy.log('select options in order from fourth input')
    for (let i = 0; i < 6; i++) {
      cy.get(`${`#\\/ci4`}_choice${i + 1}_input`).click().then(() => {

        // make this asynchronous  so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
        cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`)


        cy.window().then(async (win) => {

          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/ci1'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci1'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci2'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci2'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci3'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci3'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci4'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci4'].stateValues.selectedIndices).eqls([i + 1])

        })

      });
    }

  })

  it('math inside choices', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput randomizeOrder name="ci1">
      <choice>The function is <m>f(\\xi)=\\sin(\\xi)</m>.</choice>
      <choice>The sum of <math name="lambda2">lambda^2</math> and <math name="twice">2 lambda^2</math> is <math simplify><copy target="lambda2" />+<copy target="twice" /></math>.</choice>
      <choice>The sequence is <aslist><sequence from="1" to="5" /></aslist>.</choice>
      <choice>Can't convert this latex: <m>\\int_a^b q(t) \\, dt</m>.</choice>
    </choiceinput>

    <copy name="copy" inline target="ci1" assignNames="ci2" />

    <p>Selected values: <aslist>
    <copy prop='selectedvalue' target="ci1" />
    <copy prop='selectedvalue' target="copy" />
    </aslist></p>
    <p>Selected indices: <aslist>
    <copy prop='selectedindex' target="ci1" />
    <copy prop='selectedindex' target="copy" />
    </aslist></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = [
      "The function is f(ξ) = sin(ξ).",
      "The sum of λ^2 and 2 λ^2 is 3 λ^2.",
      "The sequence is 1, 2, 3, 4, 5.",
      "Can't convert this latex: \\int_a^b q(t) \\, dt."
    ];
    cy.get('#\\/_p1').should('have.text', 'Selected values: ')
    cy.get('#\\/_p2').should('have.text', 'Selected indices: ')
    // cy.get('#\\/_p3').should('have.text', 'Selected original indices: ')

    let choices;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables['/ci1'].stateValues.choiceTexts];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);

      expect(stateVariables['/ci2'].stateValues.choiceTexts).eqls(choices);

      expect(stateVariables['/ci1'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/ci1'].stateValues.selectedIndices).eqls([])
      expect(stateVariables['/ci2'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/ci2'].stateValues.selectedIndices).eqls([])

      expect(stateVariables['/ci1'].stateValues.inline).eq(false);
      expect(stateVariables['/ci1'].stateValues.randomizeOrder).eq(true);
      expect(stateVariables['/ci2'].stateValues.inline).eq(true);
      expect(stateVariables['/ci2'].stateValues.randomizeOrder).eq(true);
    });


    cy.log('select options in order from first input')
    for (let i = 0; i < 4; i++) {
      cy.get(`#\\/ci1_choice${i + 1}_input`).click().then(() => {

        // make this asynchronous  so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}`)
        cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}`)

        cy.window().then(async (win) => {

          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/ci1'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci1'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci2'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci2'].stateValues.selectedIndices).eqls([i + 1])

        });
      })

    }

    cy.log('select options in order from second input')
    for (let i = 0; i < 4; i++) {
      cy.get(`#\\/ci2`).select(`${i + 1}`).then(() => {

        // make this asynchronous  so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}`)
        cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}`)

        cy.window().then(async (win) => {

          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/ci1'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci1'].stateValues.selectedIndices).eqls([i + 1])
          expect(stateVariables['/ci2'].stateValues.selectedValues).eqls([choices[i]])
          expect(stateVariables['/ci2'].stateValues.selectedIndices).eqls([i + 1])

        })

      });
    }

  });

  it('bind value to textinput', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput bindValueTo="$_textinput1" randomizeOrder name="ci1">
      <choice>caT</choice>
      <choice>  dog </choice>
      <choice>Monkey</choice>
    </choiceinput>

    <p>Select by typing: <textinput prefill="monkey" /></p>

    <copy name="copy" inline target="ci1" assignNames="ci2" />

    <p>Selected values: <aslist>
    <copy prop='selectedvalue' target="ci1" />
    <copy prop='selectedvalue' target="copy" />
    </aslist></p>
    <p>Selected indices: <aslist>
    <copy prop='selectedindex' target="ci1" />
    <copy prop='selectedindex' target="copy" />
    </aslist></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["caT", "  dog ", "Monkey"]

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let choiceOrder = stateVariables["/ci1"].stateValues.choiceOrder;
      let choices = choiceOrder.map(x => originalChoices[x - 1]);


      let checkChoices = function (selectedChoice, inputText) {

        let choiceArray, indexArray;
        if (selectedChoice === null) {
          choiceArray = indexArray = [];

          for (let i = 1; i <= 3; i++) {
            cy.get(`#\\/ci1_choice${i}_input`).should('not.be.checked')
          }
          cy.get(`#\\/ci2`).should('have.value', '')

          cy.get('#\\/_p2').should('have.text', `Selected values: `)
          cy.get('#\\/_p3').should('have.text', `Selected indices: `)

        } else {
          let selectedIndex = choices.indexOf(selectedChoice) + 1;
          choiceArray = [selectedChoice];
          indexArray = [selectedIndex];

          for (let i = 1; i <= 3; i++) {
            if (i === selectedIndex) {
              cy.get(`#\\/ci1_choice${i}_input`).should('be.checked')
            } else {
              cy.get(`#\\/ci1_choice${i}_input`).should('not.be.checked')
            }
          }
          cy.get(`#\\/ci2`).should('have.value', String(selectedIndex))
          cy.get('#\\/_p2').should('have.text', `Selected values: ${selectedChoice}, ${selectedChoice}`)
          cy.get('#\\/_p3').should('have.text', `Selected indices: ${selectedIndex}, ${selectedIndex}`)
        }

        cy.get('#\\/_textinput1_input').should('have.value', inputText)

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/ci1'].stateValues.selectedValues).eqls(choiceArray)
          expect(stateVariables['/ci1'].stateValues.selectedIndices).eqls(indexArray)
          expect(stateVariables['/ci2'].stateValues.selectedValues).eqls(choiceArray)
          expect(stateVariables['/ci2'].stateValues.selectedIndices).eqls(indexArray)
        })
      }

      checkChoices("Monkey", "monkey")


      cy.log('select cat from first input');
      let selectedChoice = "caT";
      let selectedIndex = choices.indexOf(selectedChoice) + 1;
      let inputText = selectedChoice;
      cy.get(`#\\/ci1_choice${selectedIndex}_input`).click();
      checkChoices(selectedChoice, inputText)

      cy.log('Type Dog')
      selectedChoice = "  dog ";
      selectedIndex = choices.indexOf(selectedChoice) + 1;
      inputText = "Dog";
      cy.get('#\\/_textinput1_input').clear().type(`${inputText}{enter}`)
      checkChoices(selectedChoice, inputText)


      cy.log('select monkey from second input');
      selectedChoice = "Monkey";
      selectedIndex = choices.indexOf(selectedChoice) + 1;
      inputText = selectedChoice;
      cy.get(`#\\/ci2`).select(`${selectedIndex}`);
      checkChoices(selectedChoice, inputText)

      cy.log('type no cat');
      selectedChoice = null;
      inputText = "no cat";
      cy.get('#\\/_textinput1_input').clear().type(`${inputText}{enter}`)
      checkChoices(selectedChoice, inputText)

      cy.log('select cat from second input');
      selectedChoice = "caT";
      selectedIndex = choices.indexOf(selectedChoice) + 1;
      inputText = selectedChoice;
      cy.get(`#\\/ci2`).select(`${selectedIndex}`);
      checkChoices(selectedChoice, inputText)

      cy.log('type no dog');
      selectedChoice = null;
      inputText = "no dog";
      cy.get('#\\/_textinput1_input').clear().type(`${inputText}{enter}`)
      checkChoices(selectedChoice, inputText)

      cy.log('select dog from first input');
      selectedChoice = "  dog ";
      selectedIndex = choices.indexOf(selectedChoice) + 1;
      inputText = selectedChoice;
      cy.get(`#\\/ci1_choice${selectedIndex}_input`).click();
      checkChoices(selectedChoice, inputText)

      cy.log('type no monkey');
      selectedChoice = null;
      inputText = "no monkey";
      cy.get('#\\/_textinput1_input').clear().type(`${inputText}{enter}`)
      checkChoices(selectedChoice, inputText)

      cy.log('type   monKey   ');
      selectedChoice = "Monkey";
      inputText = "  monKey   ";
      cy.get('#\\/_textinput1_input').clear().type(`${inputText}{enter}`)
      checkChoices(selectedChoice, inputText)

    })
  });

  it('bind value to textinput, select multiple', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput bindValueTo="$_textinput1" randomizeOrder selectMultiple name="ci1">
      <choice>caT</choice>
      <choice>  dog </choice>
      <choice>Monkey</choice>
    </choiceinput>

    <p>Select by typing: <textinput prefill="monkey" /></p>

    <copy name="copy" inline target="ci1" assignNames="ci2" />

    <p>Selected values: <aslist>
    <copy prop='selectedvalues' target="ci1" />
    <copy prop='selectedvalues' target="copy" />
    </aslist></p>
    <p>Selected indices: <aslist>
    <copy prop='selectedindices' target="ci1" />
    <copy prop='selectedindices' target="copy" />
    </aslist></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["caT", "  dog ", "Monkey"]

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let choiceOrder = stateVariables["/ci1"].stateValues.choiceOrder;
      let choices = choiceOrder.map(x => originalChoices[x - 1]);


      let checkChoices = function (selectedChoices, inputText) {

        selectedChoices.sort((a, b) => choices.indexOf(a) - choices.indexOf(b))

        let selectedIndices = selectedChoices.map(x => choices.indexOf(x) + 1);

        for (let i = 1; i <= 3; i++) {
          if (selectedIndices.includes(i)) {
            cy.get(`#\\/ci1_choice${i}_input`).should('be.checked')
          } else {
            cy.get(`#\\/ci1_choice${i}_input`).should('not.be.checked')
          }
        }
        cy.get(`#\\/ci2`).invoke('val').should('deep.equal', selectedIndices.map(x => String(x)))
        let selectedChoicesString = [...selectedChoices, ...selectedChoices].join(", ")
        let selectedIndicesString = [...selectedIndices, ...selectedIndices].join(", ")
        cy.get('#\\/_p2').should('have.text', `Selected values: ${selectedChoicesString}`)
        cy.get('#\\/_p3').should('have.text', `Selected indices: ${selectedIndicesString}`)

        cy.get('#\\/_textinput1_input').should('have.value', inputText)

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/ci1'].stateValues.selectedValues).eqls(selectedChoices)
          expect(stateVariables['/ci1'].stateValues.selectedIndices).eqls(selectedIndices)
          expect(stateVariables['/ci2'].stateValues.selectedValues).eqls(selectedChoices)
          expect(stateVariables['/ci2'].stateValues.selectedIndices).eqls(selectedIndices)
        })
      }

      checkChoices(["Monkey"], "monkey")


      cy.log('select cat from first input');
      let selectedChoices = ["caT", "Monkey"];
      let selectedIndex = choices.indexOf(selectedChoices[0]) + 1;
      selectedChoices.sort((a, b) => choices.indexOf(a) - choices.indexOf(b))
      let inputText = selectedChoices.join(", ");
      cy.get(`#\\/ci1_choice${selectedIndex}_input`).click();
      checkChoices(selectedChoices, inputText)

      cy.log('Type Dog')
      selectedChoices = ["  dog "];
      inputText = "Dog";
      cy.get('#\\/_textinput1_input').clear().type(`${inputText}{enter}`)
      checkChoices(selectedChoices, inputText)

      cy.log('Type cat  ,DOG')
      selectedChoices = ["  dog ", "caT"];
      inputText = "cat   ,DOG";
      cy.get('#\\/_textinput1_input').clear().type(`${inputText}{enter}`)
      checkChoices(selectedChoices, inputText)


      cy.log('select monkey, dog from second input');
      selectedChoices = ["  dog ", "Monkey"];
      let selectedIndices = selectedChoices.map(x => choices.indexOf(x) + 1);
      selectedChoices.sort((a, b) => choices.indexOf(a) - choices.indexOf(b))
      inputText = selectedChoices.join(", ");
      cy.get(`#\\/ci2`).select(selectedIndices.map(String));
      checkChoices(selectedChoices, inputText)

      cy.log('type no cat');
      selectedChoices = [];
      inputText = "no cat";
      cy.get('#\\/_textinput1_input').clear().type(`${inputText}{enter}`)
      checkChoices(selectedChoices, inputText)

      cy.log('type cat, no dog');
      selectedChoices = ["caT"];
      inputText = "cat, no dog";
      cy.get('#\\/_textinput1_input').clear().type(`${inputText}{enter}`)
      checkChoices(selectedChoices, inputText)

      cy.log('type dog, no monkey,   CAT   ');
      selectedChoices = ["  dog ", "caT"];
      inputText = "dog, no monkey,   CAT   ";
      cy.get('#\\/_textinput1_input').clear().type(`${inputText}{enter}`)
      checkChoices(selectedChoices, inputText)


      cy.log('select all from second input');
      selectedChoices = ["Monkey", "  dog ", "caT"];
      selectedIndices = selectedChoices.map(x => choices.indexOf(x) + 1);
      selectedChoices.sort((a, b) => choices.indexOf(a) - choices.indexOf(b))
      inputText = selectedChoices.join(", ");
      cy.get(`#\\/ci2`).select(selectedIndices.map(String));
      checkChoices(selectedChoices, inputText)


      cy.log('type no dog at end');
      inputText += ", no dog";
      cy.get('#\\/_textinput1_input').type(`{end}, no dog{enter}`)
      checkChoices(selectedChoices, inputText)

      cy.log('type dog,  DOG');
      selectedChoices = ["  dog "];
      inputText = "dog,  DOG";
      cy.get('#\\/_textinput1_input').clear().type(`${inputText}{enter}`)
      checkChoices(selectedChoices, inputText)


      cy.log('select cat from first input');
      selectedChoices = ["  dog ", "caT"];
      selectedChoices.sort((a, b) => choices.indexOf(a) - choices.indexOf(b))
      selectedIndex = choices.indexOf(selectedChoices[0]) + 1;
      inputText = selectedChoices.join(", ");
      cy.get(`#\\/ci1_choice${selectedIndex}_input`).click();
      checkChoices(selectedChoices, inputText)

      cy.log('deselect dog from first input');
      selectedIndex = choices.indexOf(selectedChoices[1]) + 1;
      selectedChoices = ["caT"];
      inputText = selectedChoices.join(", ");
      cy.get(`#\\/ci1_choice${selectedIndex}_input`).click();
      checkChoices(selectedChoices, inputText)

    })
  });

  it('bind value to fixed text, choiceinput reverts to fixed value', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput bindValueTo="$alwaysMonkey" name="ci1">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
    </choiceinput>

    <p>Fixed to be: <text name="alwaysMonkey" fixed>monkey</text></p>

    <copy name="copy" inline target="ci1" assignNames="ci2" />

    <p>Selected values: <aslist>
    <copy prop='selectedvalue' target="ci1" />
    <copy prop='selectedvalue' target="copy" />
    </aslist></p>
    <p>Selected indices: <aslist>
    <copy prop='selectedindex' target="ci1" />
    <copy prop='selectedindex' target="copy" />
    </aslist></p>

    <p>Check for core round trip: <booleaninput name="bi" /> <copy prop="value" target="bi" assignNames="b" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    function checkStillMonkey() {
      for (let i = 1; i <= 3; i++) {
        if (i === 3) {
          cy.get(`#\\/ci1_choice${i}_input`).should('be.checked')
        } else {
          cy.get(`#\\/ci1_choice${i}_input`).should('not.be.checked')
        }
      }
      cy.get(`#\\/ci2`).should('have.value', '3')
      cy.get('#\\/_p2').should('have.text', `Selected values: monkey, monkey`)
      cy.get('#\\/_p3').should('have.text', `Selected indices: 3, 3`)
    }


    checkStillMonkey();

    cy.get(`#\\/ci1_choice1_input`).click();
    cy.get(`#\\/bi_input`).click();
    cy.get('#\\/b').should('have.text', "true")
    checkStillMonkey();

    cy.get(`#\\/ci1_choice2_input`).click();
    cy.get(`#\\/bi_input`).click();
    cy.get('#\\/b').should('have.text', "false")
    checkStillMonkey();

    cy.get(`#\\/ci2`).select(`1`);
    cy.get(`#\\/bi_input`).click();
    cy.get('#\\/b').should('have.text', "true")
    checkStillMonkey();

    cy.get(`#\\/ci2`).select(`2`);
    cy.get(`#\\/bi_input`).click();
    cy.get('#\\/b').should('have.text', "false")
    checkStillMonkey();


  });

  it('preselect choices', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput name="c1" preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>

    <choiceinput name="c2" inline randomizeOrder preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>

    <choiceinput name="c3" inline>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>


    <choiceinput name="c4" randomizeOrder>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>

    <choiceinput name="c5" inline>
      <choice>cat</choice>
      <choice preselect>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>


    <choiceinput name="c6" randomizeOrder>
      <choice>cat</choice>
      <choice preselect>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>


    <choiceinput name="c7" preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>


    <choiceinput name="c8" randomizeOrder inline preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>


    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get('#\\/c1_choice2_input').should('be.checked')

      cy.get('#\\/c2').should('have.value', '2')

      cy.get('#\\/c3').should('have.value', '4')


      let mouseInd4 = stateVariables['/c4'].stateValues.choiceTexts.indexOf("mouse")
      cy.get(`#\\/c4_choice${mouseInd4 + 1}_input`).should('be.checked')

      cy.get('#\\/c5').should('have.value', '2')

      let dogInd6 = stateVariables['/c6'].stateValues.choiceTexts.indexOf("dog")
      let mouseInd6 = stateVariables['/c6'].stateValues.choiceTexts.indexOf("mouse")
      let selectedInd6 = Math.min(dogInd6, mouseInd6)

      cy.get(`#\\/c6_choice${selectedInd6 + 1}_input`).should('be.checked')

      cy.get('#\\/c7_choice4_input').should('be.checked')

      let mouseInd8 = stateVariables['/c8'].stateValues.choiceTexts.indexOf("mouse")
      cy.get('#\\/c8').should('have.value', `${mouseInd8 + 1}`)

    })

  });

  it('disabled choice with inline choiceinput', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput inline placeholder="Choose animal">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice disabled>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')

    cy.get("#\\/_choiceinput1").should('have.value', '')


    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables['/_choiceinput1'].stateValues.choiceTexts];
      choiceOrder = [...stateVariables['/_choiceinput1'].stateValues.choiceOrder];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      // expect(stateVariables['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.inline).eq(true);
      expect(stateVariables['/_choiceinput1'].stateValues.randomizeOrder).eq(false);
      expect(stateVariables['/_choice1'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice2'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice3'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {

      if (i === 2) {
        cy.get(`#\\/_choiceinput1`).get('[value="3"]').should('be.disabled')
      } else {

        cy.get(`#\\/_choiceinput1`).select(`${i + 1}`).then(() => {

          // make this asynchronous  so that choices is populated before line is executed
          cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
          cy.get('#\\/_p2').should('have.text', 'Selected index: ' + (i + 1))

          cy.window().then(async (win) => {

            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
            expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
            expect(stateVariables['/_choice1'].stateValues.selected).eq(choiceOrder[i] === 1);
            expect(stateVariables['/_choice2'].stateValues.selected).eq(choiceOrder[i] === 2);
            expect(stateVariables['/_choice3'].stateValues.selected).eq(choiceOrder[i] === 3);
            expect(stateVariables['/_choice4'].stateValues.selected).eq(choiceOrder[i] === 4);

          });

        });
      }
    }

  });

  it('hidden choice with inline choiceinput', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput inline placeholder="Choose animal">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice hide>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')

    cy.get("#\\/_choiceinput1").should('have.value', '')


    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables['/_choiceinput1'].stateValues.choiceTexts];
      choiceOrder = [...stateVariables['/_choiceinput1'].stateValues.choiceOrder];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.inline).eq(true);
      expect(stateVariables['/_choiceinput1'].stateValues.randomizeOrder).eq(false);
      expect(stateVariables['/_choice1'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice2'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice3'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {

      if (i === 2) {
        cy.get(`#\\/_choiceinput1`).get('[value="3"]').should('not.exist')
      } else {

        cy.get(`#\\/_choiceinput1`).select(`${i + 1}`).then(() => {

          // make this asynchronous  so that choices is populated before line is executed
          cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
          cy.get('#\\/_p2').should('have.text', 'Selected index: ' + (i + 1))

          cy.window().then(async (win) => {

            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
            expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
            expect(stateVariables['/_choice1'].stateValues.selected).eq(choiceOrder[i] === 1);
            expect(stateVariables['/_choice2'].stateValues.selected).eq(choiceOrder[i] === 2);
            expect(stateVariables['/_choice3'].stateValues.selected).eq(choiceOrder[i] === 3);
            expect(stateVariables['/_choice4'].stateValues.selected).eq(choiceOrder[i] === 4);

          })

        });
      }
    }

  });

  it('disabled choice with block choiceinput', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice disabled>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')


    let choices;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables['/_choiceinput1'].stateValues.choiceTexts];
      expect(choices).eqls(originalChoices);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.inline).eq(false);
      expect(stateVariables['/_choiceinput1'].stateValues.randomizeOrder).eq(false);
      expect(stateVariables['/_choice1'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice2'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice3'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {
      if (i === 2) {
        cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).should('be.disabled')
      } else {
        cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).click().then(() => {

          // make this asynchronous  so that choices is populated before line is executed
          cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
          cy.get('#\\/_p2').should('have.text', 'Selected index: ' + (i + 1))

          cy.window().then(async (win) => {

            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
            expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
            expect(stateVariables['/_choice1'].stateValues.selected).eq(i === 0);
            expect(stateVariables['/_choice2'].stateValues.selected).eq(i === 1);
            expect(stateVariables['/_choice3'].stateValues.selected).eq(i === 2);
            expect(stateVariables['/_choice4'].stateValues.selected).eq(i === 3);

          })

        });
      }
    }

  });

  it('hidden choice with block choiceinput', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice hide>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')


    let choices;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables['/_choiceinput1'].stateValues.choiceTexts];
      expect(choices).eqls(originalChoices);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.inline).eq(false);
      expect(stateVariables['/_choiceinput1'].stateValues.randomizeOrder).eq(false);
      expect(stateVariables['/_choice1'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice2'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice3'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {
      if (i === 2) {
        cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).should('not.exist')
      } else {
        cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).click().then(() => {

          // make this asynchronous  so that choices is populated before line is executed
          cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
          cy.get('#\\/_p2').should('have.text', 'Selected index: ' + (i + 1))

          cy.window().then(async (win) => {

            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
            expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
            expect(stateVariables['/_choice1'].stateValues.selected).eq(i === 0);
            expect(stateVariables['/_choice2'].stateValues.selected).eq(i === 1);
            expect(stateVariables['/_choice3'].stateValues.selected).eq(i === 2);
            expect(stateVariables['/_choice4'].stateValues.selected).eq(i === 3);

          })

        });
      }
    }

  });

  it('select multiple with block choiceinput', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput randomizeOrder selectMultiple>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected values: <aslist><copy prop='selectedvalues' target="_choiceinput1" /></aslist></p>
    <p>Selected indices: <aslist><copy prop='selectedindices' target="_choiceinput1" /></aslist></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected values: ')
    cy.get('#\\/_p2').should('have.text', 'Selected indices: ')

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables['/_choiceinput1'].stateValues.choiceTexts];
      choiceOrder = [...stateVariables['/_choiceinput1'].stateValues.choiceOrder];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.inline).eq(false);
      expect(stateVariables['/_choiceinput1'].stateValues.randomizeOrder).eq(true);
      expect(stateVariables['/_choiceinput1'].stateValues.selectMultiple).eq(true);
      expect(stateVariables['/_choice1'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice2'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice3'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {
      cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).click().then(() => {
        // make this asynchronous so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected values: ' + choices.slice(0, i + 1).join(", "))
        cy.get('#\\/_p2').should('have.text', 'Selected indices: ' + [...Array(i + 1).keys()].map(x => x + 1).join(", "))
      });

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(choices.slice(0, i + 1))
        expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([...Array(i + 1).keys()].map(x => x + 1))
        expect(stateVariables['/_choice1'].stateValues.selected).eq(choiceOrder.indexOf(1) <= i);
        expect(stateVariables['/_choice2'].stateValues.selected).eq(choiceOrder.indexOf(2) <= i);
        expect(stateVariables['/_choice3'].stateValues.selected).eq(choiceOrder.indexOf(3) <= i);
        expect(stateVariables['/_choice4'].stateValues.selected).eq(choiceOrder.indexOf(4) <= i);

      });
    }


    cy.log('deselect options in order')

    for (let i = 0; i < 4; i++) {
      cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).click().then(() => {
        // make this asynchronous so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected values: ' + choices.slice(i + 1).join(", "))
        cy.get('#\\/_p2').should('have.text', 'Selected indices: ' + [...Array(3 - i).keys()].map(x => x + 2 + i).join(", "))
      });

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(choices.slice(i + 1))
        expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([...Array(3 - i).keys()].map(x => x + 2 + i))
        expect(stateVariables['/_choice1'].stateValues.selected).eq(choiceOrder.indexOf(1) > i);
        expect(stateVariables['/_choice2'].stateValues.selected).eq(choiceOrder.indexOf(2) > i);
        expect(stateVariables['/_choice3'].stateValues.selected).eq(choiceOrder.indexOf(3) > i);
        expect(stateVariables['/_choice4'].stateValues.selected).eq(choiceOrder.indexOf(4) > i);

      });
    }

    cy.log('select options in reverse order')

    for (let i = 3; i >= 0; i--) {
      cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).click().then(() => {
        // make this asynchronous so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected values: ' + choices.slice(i).join(", "))
        cy.get('#\\/_p2').should('have.text', 'Selected indices: ' + [...Array(4 - i).keys()].map(x => x + 1 + i).join(", "))
      });

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(choices.slice(i))
        expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([...Array(4 - i).keys()].map(x => x + 1 + i))
        expect(stateVariables['/_choice1'].stateValues.selected).eq(choiceOrder.indexOf(1) >= i);
        expect(stateVariables['/_choice2'].stateValues.selected).eq(choiceOrder.indexOf(2) >= i);
        expect(stateVariables['/_choice3'].stateValues.selected).eq(choiceOrder.indexOf(3) >= i);
        expect(stateVariables['/_choice4'].stateValues.selected).eq(choiceOrder.indexOf(4) >= i);

      });
    }

  });

  it('select multiple with inline choiceinput', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput inline randomizeOrder selectMultiple>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected values: <aslist><copy prop='selectedvalues' target="_choiceinput1" /></aslist></p>
    <p>Selected indices: <aslist><copy prop='selectedindices' target="_choiceinput1" /></aslist></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.get("#\\/_choiceinput1").invoke('val').should('deep.equal', [])

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected values: ')
    cy.get('#\\/_p2').should('have.text', 'Selected indices: ')

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables['/_choiceinput1'].stateValues.choiceTexts];
      choiceOrder = [...stateVariables['/_choiceinput1'].stateValues.choiceOrder];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      expect(stateVariables['/_choiceinput1'].stateValues.inline).eq(true);
      expect(stateVariables['/_choiceinput1'].stateValues.randomizeOrder).eq(true);
      expect(stateVariables['/_choiceinput1'].stateValues.selectMultiple).eq(true);
      expect(stateVariables['/_choice1'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice2'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice3'].stateValues.selected).eq(false);
      expect(stateVariables['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {

      // TODO: the onChange handler wasn't triggering when didn't first deselect
      // so, as a stopgap, we're deselecting all here.
      // We shouldn't need to do this!

      cy.get(`#\\/_choiceinput1`).select([]);

      cy.get(`#\\/_choiceinput1`).select([...Array(i + 1).keys()].map(x => String(x + 1))).then(() => {

        let selectedInds = [...Array(i + 1).keys()].map(x => String(x + 1))
        cy.get("#\\/_choiceinput1").invoke('val').should('deep.equal', selectedInds);

        // make this asynchronous so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected values: ' + choices.slice(0, i + 1).join(", "))
        cy.get('#\\/_p2').should('have.text', 'Selected indices: ' + [...Array(i + 1).keys()].map(x => x + 1).join(", "))
      });

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(choices.slice(0, i + 1))
        expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([...Array(i + 1).keys()].map(x => x + 1))
        expect(stateVariables['/_choice1'].stateValues.selected).eq(choiceOrder.indexOf(1) <= i);
        expect(stateVariables['/_choice2'].stateValues.selected).eq(choiceOrder.indexOf(2) <= i);
        expect(stateVariables['/_choice3'].stateValues.selected).eq(choiceOrder.indexOf(3) <= i);
        expect(stateVariables['/_choice4'].stateValues.selected).eq(choiceOrder.indexOf(4) <= i);

      });
    }



    cy.log('deselect options in order')

    for (let i = 0; i < 4; i++) {

      cy.window().then(async (win) => {

        let indicesToSelect = [...Array(3 - i).keys()].map(x => String(x + 2 + i));
        if (i === 3) {
          indicesToSelect = [''];
        }

        cy.get(`#\\/_choiceinput1`).select(indicesToSelect).then(() => {

          let selectedInds = [...Array(3 - i).keys()].map(x => String(x + 2 + i))
          cy.get("#\\/_choiceinput1").invoke('val').should('deep.equal', selectedInds);

          // make this asynchronous so that choices is populated before line is executed
          cy.get('#\\/_p1').should('have.text', 'Selected values: ' + choices.slice(i + 1).join(", "))
          cy.get('#\\/_p2').should('have.text', 'Selected indices: ' + [...Array(3 - i).keys()].map(x => x + 2 + i).join(", "))
        });

        cy.window().then(async (win) => {

          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(choices.slice(i + 1))
          expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([...Array(3 - i).keys()].map(x => x + 2 + i))
          expect(stateVariables['/_choice1'].stateValues.selected).eq(choiceOrder.indexOf(1) > i);
          expect(stateVariables['/_choice2'].stateValues.selected).eq(choiceOrder.indexOf(2) > i);
          expect(stateVariables['/_choice3'].stateValues.selected).eq(choiceOrder.indexOf(3) > i);
          expect(stateVariables['/_choice4'].stateValues.selected).eq(choiceOrder.indexOf(4) > i);

        });
      })
    }


    cy.log('select options in reverse order')

    for (let i = 3; i >= 0; i--) {
      cy.get(`#\\/_choiceinput1`).select([...Array(4 - i).keys()].map(x => String(x + 1 + i))).then(() => {

        let selectedInds = [...Array(4 - i).keys()].map(x => String(x + 1 + i));
        cy.get("#\\/_choiceinput1").invoke('val').should('deep.equal', selectedInds);

        // make this asynchronous so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected values: ' + choices.slice(i).join(", "))
        cy.get('#\\/_p2').should('have.text', 'Selected indices: ' + [...Array(4 - i).keys()].map(x => x + 1 + i).join(", "))
      });

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_choiceinput1'].stateValues.selectedValues).eqls(choices.slice(i))
        expect(stateVariables['/_choiceinput1'].stateValues.selectedIndices).eqls([...Array(4 - i).keys()].map(x => x + 1 + i))
        expect(stateVariables['/_choice1'].stateValues.selected).eq(choiceOrder.indexOf(1) >= i);
        expect(stateVariables['/_choice2'].stateValues.selected).eq(choiceOrder.indexOf(2) >= i);
        expect(stateVariables['/_choice3'].stateValues.selected).eq(choiceOrder.indexOf(3) >= i);
        expect(stateVariables['/_choice4'].stateValues.selected).eq(choiceOrder.indexOf(4) >= i);

      });
    }

  });

  it('chain update off choiceinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput name="ci" >
      <choice>red</choice>
      <choice>orange</choice>
      <choice>yellow</choice>
      <choice>green</choice>
      <choice>blue</choice>
    </choiceinput>

    <text name="t"></text>
    <updateValue triggerWithTargets="ci" target="t" newValue="$t $ci" type="text" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/t').should('have.text', '')

    cy.get(`#\\/ci_choice2_input`).click();
    cy.get('#\\/t').should('have.text', ' orange')

    cy.get(`#\\/ci_choice5_input`).click();
    cy.get('#\\/t').should('have.text', ' orange blue')

    cy.get(`#\\/ci_choice1_input`).click();
    cy.get('#\\/t').should('have.text', ' orange blue red')

  })


});