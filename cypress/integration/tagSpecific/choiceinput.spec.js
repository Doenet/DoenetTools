import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Choiceinput Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('default is block format', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' tname="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' tname="_choiceinput1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')

    let choices, choiceOrder;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      choices = [...components['/_choiceinput1'].stateValues.choiceTexts];
      choiceOrder = [...components['/_choiceinput1'].stateValues.choiceOrder];
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
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
      expect(components['/_choiceinput1'].stateValues.inline).eq(false);
      expect(components['/_choiceinput1'].stateValues.fixedOrder).eq(false);
      expect(components['/_choice1'].stateValues.selected).eq(false);
      expect(components['/_choice2'].stateValues.selected).eq(false);
      expect(components['/_choice3'].stateValues.selected).eq(false);
      expect(components['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {
      cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).click();

      cy.window().then((win) => {

        // make this asynchronous so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
        cy.get('#\\/_p2').should('have.text', 'Selected index: ' + (i + 1))
        // cy.get('#\\/_p3 .mjx-mrow').eq(0).invoke('text').then((text) => {
        //   expect(text.trim()).equal(`${originalChoices.indexOf(choices[i])+1}`)
        // })
        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
        expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
        // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([originalChoices.indexOf(choices[i])+1])
        expect(components['/_choice1'].stateValues.selected).eq(choiceOrder[i] === 0);
        expect(components['/_choice2'].stateValues.selected).eq(choiceOrder[i] === 1);
        expect(components['/_choice3'].stateValues.selected).eq(choiceOrder[i] === 2);
        expect(components['/_choice4'].stateValues.selected).eq(choiceOrder[i] === 3);

      });
    }

  });

  it('inline choiceinput', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput inline>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' tname="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' tname="_choiceinput1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')


    let choices, choiceOrder;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      choices = [...components['/_choiceinput1'].stateValues.choiceTexts];
      choiceOrder = [...components['/_choiceinput1'].stateValues.choiceOrder];
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
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
      expect(components['/_choiceinput1'].stateValues.inline).eq(true);
      expect(components['/_choiceinput1'].stateValues.fixedOrder).eq(false);
      expect(components['/_choice1'].stateValues.selected).eq(false);
      expect(components['/_choice2'].stateValues.selected).eq(false);
      expect(components['/_choice3'].stateValues.selected).eq(false);
      expect(components['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {
      cy.get(`#\\/_choiceinput1`).select(`${i + 1}`);

      cy.window().then((win) => {

        // make this asynchronous  so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
        cy.get('#\\/_p2').should('have.text', 'Selected index: ' + (i + 1))
        // cy.get('#\\/_p3 .mjx-mrow').eq(0).invoke('text').then((text) => {
        //   expect(text.trim()).equal(`${originalChoices.indexOf(choices[i])+1}`)
        // })

        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
        expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
        // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([originalChoices.indexOf(choices[i])+1])
        expect(components['/_choice1'].stateValues.selected).eq(choiceOrder[i] === 0);
        expect(components['/_choice2'].stateValues.selected).eq(choiceOrder[i] === 1);
        expect(components['/_choice3'].stateValues.selected).eq(choiceOrder[i] === 2);
        expect(components['/_choice4'].stateValues.selected).eq(choiceOrder[i] === 3);

      });
    }

  });

  it('fixed order', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput fixedOrder>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' tname="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' tname="_choiceinput1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')
    // cy.get('#\\/_p3').should('have.text', 'Selected original index: ')


    let choices;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      choices = [...components['/_choiceinput1'].stateValues.choiceTexts];
      expect(choices).eqls(originalChoices);
      expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([])
      expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([])
      // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
      expect(components['/_choiceinput1'].stateValues.inline).eq(false);
      expect(components['/_choiceinput1'].stateValues.fixedOrder).eq(true);
      expect(components['/_choice1'].stateValues.selected).eq(false);
      expect(components['/_choice2'].stateValues.selected).eq(false);
      expect(components['/_choice3'].stateValues.selected).eq(false);
      expect(components['/_choice4'].stateValues.selected).eq(false);

    });

    cy.log('select options in order')

    for (let i = 0; i < 4; i++) {
      cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).click();

      cy.window().then((win) => {

        // make this asynchronous  so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
        cy.get('#\\/_p2').should('have.text', 'Selected index: ' + (i + 1))
        // cy.get('#\\/_p3 .mjx-mrow').eq(0).invoke('text').then((text) => {
        //   expect(text.trim()).equal(`${i+1}`)
        // })

        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
        expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
        // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([i + 1])
        expect(components['/_choice1'].stateValues.selected).eq(i === 0);
        expect(components['/_choice2'].stateValues.selected).eq(i === 1);
        expect(components['/_choice3'].stateValues.selected).eq(i === 2);
        expect(components['/_choice4'].stateValues.selected).eq(i === 3);

      });
    }

  });

  it('choiceinput references', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <choiceinput inline>
        <choice>a</choice>
        <choice>b</choice>
        <choice>c</choice>
        <choice>d</choice>
        <choice>e</choice>
        <choice>f</choice>
      </choiceinput>
      <copy name="copy" tname="_choiceinput1" />
      <copy name="copy2" inline="false" tname="_choiceinput1" />
      <copy name="copy3" inline="false" tname="copy" />
  
      <p>Selected values: <aslist>
      <copy prop='selectedvalue' tname="_choiceinput1" />
      <copy prop='selectedvalue' tname="copy" />
      <copy prop='selectedvalue' tname="copy2" />
      <copy prop='selectedvalue' tname="copy3" />
      </aslist></p>
      <p>Selected indices: <aslist>
      <copy prop='selectedindex' tname="_choiceinput1" />
      <copy prop='selectedindex' tname="copy" />
      <copy prop='selectedindex' tname="copy2" />
      <copy prop='selectedindex' tname="copy3" />
      </aslist></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["a", "b", "c", "d", "e", "f"];
    cy.get('#\\/_p1').should('have.text', 'Selected values: ')
    cy.get('#\\/_p2').should('have.text', 'Selected indices: ')
    // cy.get('#\\/_p3').should('have.text', 'Selected original indices: ')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let choice2Anchor = cesc('#' + components["/copy"].replacements[0].componentName);
      let choice3Anchor = cesc('#' + components["/copy2"].replacements[0].componentName);
      let choice4Anchor = cesc('#' + components["/copy3"].replacements[0].componentName);

      let choices;
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        choices = [...components['/_choiceinput1'].stateValues.choiceTexts];
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
        expect(components['/copy'].replacements[0].stateValues.choiceTexts).eqls(choices);
        expect(components['/copy2'].replacements[0].stateValues.choiceTexts).eqls(choices);
        expect(components['/copy3'].replacements[0].stateValues.choiceTexts).eqls(choices);

        expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([])
        expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([])
        // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
        expect(components['/copy'].replacements[0].stateValues.selectedValues).eqls([])
        expect(components['/copy'].replacements[0].stateValues.selectedIndices).eqls([])
        // expect(components['/copy'].replacements[0].stateValues.selectedoriginalindices).eqls([])
        expect(components['/copy2'].replacements[0].stateValues.selectedValues).eqls([])
        expect(components['/copy2'].replacements[0].stateValues.selectedIndices).eqls([])
        // expect(components['/copy2'].replacements[0].stateValues.selectedoriginalindices).eqls([])
        expect(components['/copy3'].replacements[0].stateValues.selectedValues).eqls([])
        expect(components['/copy3'].replacements[0].stateValues.selectedIndices).eqls([])
        // expect(components['/copy3'].replacements[0].stateValues.selectedoriginalindices).eqls([])

        expect(components['/_choiceinput1'].stateValues.inline).eq(true);
        expect(components['/_choiceinput1'].stateValues.fixedOrder).eq(false);
        expect(components['/copy'].replacements[0].stateValues.inline).eq(true);
        expect(components['/copy'].replacements[0].stateValues.fixedOrder).eq(false);
        expect(components['/copy2'].replacements[0].stateValues.inline).eq(false);
        expect(components['/copy2'].replacements[0].stateValues.fixedOrder).eq(false);
        expect(components['/copy3'].replacements[0].stateValues.inline).eq(false);
        expect(components['/copy3'].replacements[0].stateValues.fixedOrder).eq(false);
      });


      cy.log('select options in order from first input')
      for (let i = 0; i < 6; i++) {
        cy.get(`#\\/_choiceinput1`).select(`${i + 1}`);

        cy.window().then((win) => {

          let origInd = originalChoices.indexOf(choices[i]) + 1;
          // make this asynchronous  so that choices is populated before line is executed
          cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
          cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`)
          // for (let ind = 0; ind < 4; ind++) {
          //   cy.get(`#\\/_p3 > :nth-child(${2 * ind + 4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
          //     expect(text.trim()).equal(`${origInd}`)
          //   })
          // }

          let components = Object.assign({}, win.state.components);
          expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy2'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy2'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy2'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy3'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy3'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy3'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])

        });
      }

      cy.log('select options in order from second input')
      for (let i = 0; i < 6; i++) {
        cy.get(choice2Anchor).select(`${i + 1}`);

        cy.window().then((win) => {

          let origInd = originalChoices.indexOf(choices[i]) + 1;
          // make this asynchronous  so that choices is populated before line is executed
          cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
          cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`)
          // for (let ind = 0; ind < 4; ind++) {
          //   cy.get(`#\\/_p3 > :nth-child(${2 * ind + 4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
          //     expect(text.trim()).equal(`${origInd}`)
          //   })
          // }

          let components = Object.assign({}, win.state.components);
          expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy2'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy2'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy2'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy3'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy3'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy3'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])

        });
      }

      cy.log('select options in order from third input')
      for (let i = 0; i < 6; i++) {
        cy.get(`${choice3Anchor}_choice${i + 1}_input`).click();

        cy.window().then((win) => {

          let origInd = originalChoices.indexOf(choices[i]) + 1;
          // make this asynchronous  so that choices is populated before line is executed
          cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
          cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`)
          // for (let ind = 0; ind < 4; ind++) {
          //   cy.get(`#\\/_p3 > :nth-child(${2 * ind + 4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
          //     expect(text.trim()).equal(`${origInd}`)
          //   })
          // }

          let components = Object.assign({}, win.state.components);
          expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy2'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy2'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy2'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy3'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy3'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy3'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])

        });
      }

      cy.log('select options in order from fourth input')
      for (let i = 0; i < 6; i++) {
        cy.get(`${choice4Anchor}_choice${i + 1}_input`).click();

        cy.window().then((win) => {

          let origInd = originalChoices.indexOf(choices[i]) + 1;
          // make this asynchronous  so that choices is populated before line is executed
          cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
          cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`)
          // for (let ind = 0; ind < 4; ind++) {
          //   cy.get(`#\\/_p3 > :nth-child(${2 * ind + 4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
          //     expect(text.trim()).equal(`${origInd}`)
          //   })
          // }

          let components = Object.assign({}, win.state.components);
          expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy2'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy2'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy2'].replacements[0].stateVsalues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy3'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy3'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy3'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])

        });
      }
    })

  })

  it('math inside choices', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput>
      <choice>The function is <m>f(\\xi)=\\sin(\\xi)</m>.</choice>
      <choice>The sum of <math name="lambda2">lambda^2</math> and <math name="twice">2 lambda^2</math> is <math simplify><copy tname="lambda2" />+<copy tname="twice" /></math>.</choice>
      <choice>The sequence is <aslist><sequence from="1" to="5" /></aslist>.</choice>
      <choice>Can't convert this latex: <m>\\int_a^b q(t) \\, dt</m>.</choice>
    </choiceinput>

    <copy name="copy" inline tname="_choiceinput1" />

    <p>Selected values: <aslist>
    <copy prop='selectedvalue' tname="_choiceinput1" />
    <copy prop='selectedvalue' tname="copy" />
    </aslist></p>
    <p>Selected indices: <aslist>
    <copy prop='selectedindex' tname="_choiceinput1" />
    <copy prop='selectedindex' tname="copy" />
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


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let choice2Anchor = cesc('#' + components["/copy"].replacements[0].componentName);


      let choices;
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        choices = [...components['/_choiceinput1'].stateValues.choiceTexts];
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

        expect(components['/copy'].replacements[0].stateValues.choiceTexts).eqls(choices);

        expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([])
        expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([])
        // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
        expect(components['/copy'].replacements[0].stateValues.selectedValues).eqls([])
        expect(components['/copy'].replacements[0].stateValues.selectedIndices).eqls([])
        // expect(components['/copy'].replacements[0].stateValues.selectedoriginalindices).eqls([])

        expect(components['/_choiceinput1'].stateValues.inline).eq(false);
        expect(components['/_choiceinput1'].stateValues.fixedOrder).eq(false);
        expect(components['/copy'].replacements[0].stateValues.inline).eq(true);
        expect(components['/copy'].replacements[0].stateValues.fixedOrder).eq(false);
      });


      cy.log('select options in order from first input')
      for (let i = 0; i < 4; i++) {
        cy.get(`#\\/_choiceinput1_choice${i + 1}_input`).click();

        cy.window().then((win) => {

          let origInd = originalChoices.indexOf(choices[i]) + 1;
          // make this asynchronous  so that choices is populated before line is executed
          cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}`)
          cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}`)
          // for (let ind = 0; ind < 2; ind++) {
          //   cy.get(`#\\/_p3 > :nth-child(${2 * ind + 4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
          //     expect(text.trim()).equal(`${origInd}`)
          //   })
          // }

          let components = Object.assign({}, win.state.components);
          expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])

        });
      }

      cy.log('select options in order from second input')
      for (let i = 0; i < 4; i++) {
        cy.get(choice2Anchor).select(`${i + 1}`);

        cy.window().then((win) => {

          let origInd = originalChoices.indexOf(choices[i]) + 1;
          // make this asynchronous  so that choices is populated before line is executed
          cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}`)
          cy.get('#\\/_p2').should('have.text', `Selected indices: ${i + 1}, ${i + 1}`)
          // for (let ind = 0; ind < 2; ind++) {
          //   cy.get(`#\\/_p3 > :nth-child(${2 * ind + 4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
          //     expect(text.trim()).equal(`${origInd}`)
          //   })
          // }

          let components = Object.assign({}, win.state.components);
          expect(components['/_choiceinput1'].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([origInd])
          expect(components['/copy'].replacements[0].stateValues.selectedValues).eqls([choices[i]])
          expect(components['/copy'].replacements[0].stateValues.selectedIndices).eqls([i + 1])
          // expect(components['/copy'].replacements[0].stateValues.selectedoriginalindices).eqls([origInd])

        });
      }

    })
  });

  it('bind value to choiceinput', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput bindValueTo="$_textinput1">
      <choice>caT</choice>
      <choice>  dog </choice>
      <choice>Monkey</choice>
    </choiceinput>

    <p>Select by typing: <textinput prefill="monkey" /></p>

    <copy name="copy" inline tname="_choiceinput1" />

    <p>Selected values: <aslist>
    <copy prop='selectedvalue' tname="_choiceinput1" />
    <copy prop='selectedvalue' tname="copy" />
    </aslist></p>
    <p>Selected indices: <aslist>
    <copy prop='selectedindex' tname="_choiceinput1" />
    <copy prop='selectedindex' tname="copy" />
    </aslist></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let originalChoices = ["caT", "  dog ", "Monkey"]

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let choice2Anchor = cesc('#' + components["/copy"].replacements[0].componentName);

      let choiceOrder = components["/_choiceinput1"].stateValues.choiceOrder;
      let choices = choiceOrder.map(x => originalChoices[x]);


      let checkChoices = function (selectedChoice, inputText) {

        let choiceArray, indexArray;
        if (selectedChoice === null) {
          choiceArray = indexArray = [];

          for (let i = 1; i <= 3; i++) {
            cy.get(`#\\/_choiceinput1_choice${i}_input`).should('not.be.checked')
          }
          cy.get(choice2Anchor).should('have.value', '')

          cy.get('#\\/_p2').should('have.text', `Selected values: `)
          cy.get('#\\/_p3').should('have.text', `Selected indices: `)

        } else {
          let selectedIndex = choices.indexOf(selectedChoice) + 1;
          choiceArray = [selectedChoice];
          indexArray = [selectedIndex];

          for (let i = 1; i <= 3; i++) {
            if (i === selectedIndex) {
              cy.get(`#\\/_choiceinput1_choice${i}_input`).should('be.checked')
            } else {
              cy.get(`#\\/_choiceinput1_choice${i}_input`).should('not.be.checked')
            }
          }
          cy.get(choice2Anchor).should('have.value', String(selectedIndex))
          cy.get('#\\/_p2').should('have.text', `Selected values: ${selectedChoice}, ${selectedChoice}`)
          cy.get('#\\/_p3').should('have.text', `Selected indices: ${selectedIndex}, ${selectedIndex}`)
        }

        cy.get('#\\/_textinput1_input').should('have.value', inputText)

        cy.window().then((win) => {
          expect(components['/_choiceinput1'].stateValues.selectedValues).eqls(choiceArray)
          expect(components['/_choiceinput1'].stateValues.selectedIndices).eqls(indexArray)
          expect(components['/copy'].replacements[0].stateValues.selectedValues).eqls(choiceArray)
          expect(components['/copy'].replacements[0].stateValues.selectedIndices).eqls(indexArray)
        })
      }

      checkChoices("Monkey", "monkey")


      cy.log('select cat from first input');
      let selectedChoice = "caT";
      let selectedIndex = choices.indexOf(selectedChoice) + 1;
      let inputText = selectedChoice;
      cy.get(`#\\/_choiceinput1_choice${selectedIndex}_input`).click();
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
      cy.get(choice2Anchor).select(`${selectedIndex}`);
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
      cy.get(choice2Anchor).select(`${selectedIndex}`);
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
      cy.get(`#\\/_choiceinput1_choice${selectedIndex}_input`).click();
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

});