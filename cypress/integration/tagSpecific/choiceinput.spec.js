describe('Choiceinput Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('default is block format', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <choiceinput>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <ref prop='selectedvalue'>_choiceinput1</ref></p>
    <p>Selected index: <ref prop='selectedindex'>_choiceinput1</ref></p>
    <p>Selected original index: <ref prop='selectedoriginalindex'>_choiceinput1</ref></p>
    `}, "*");
    });

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')
    cy.get('#\\/_p3').should('have.text', 'Selected original index: ')

    let choices ;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      choices = [...components['/_choiceinput1'].state.choicetexts];
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
      expect(components['/_choiceinput1'].state.selectedvalues).eqls([])
      expect(components['/_choiceinput1'].state.selectedindices).eqls([])
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([])
      expect(components['/_choiceinput1'].state.inline).eq(false);
      expect(components['/_choiceinput1'].state.fixedorder).eq(false);

    });

    cy.log('select options in order')

    for(let i=0; i<4; i++) {
      cy.get(`#\\/_choiceinput1_choice${i}_input`).click();

      cy.window().then((win) => {

        // put this inside promise so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
        cy.get('#\\/_p2 .mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i+1}`)
        })
        cy.get('#\\/_p3 .mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${originalChoices.indexOf(choices[i])+1}`)
        })
        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].state.selectedvalues).eqls([choices[i]])
        expect(components['/_choiceinput1'].state.selectedindices).eqls([i+1])
        expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([originalChoices.indexOf(choices[i])+1])

      });
    }

  });

  it('inline choiceinput', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <choiceinput inline>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <ref prop='selectedvalue'>_choiceinput1</ref></p>
    <p>Selected index: <ref prop='selectedindex'>_choiceinput1</ref></p>
    <p>Selected original index: <ref prop='selectedoriginalindex'>_choiceinput1</ref></p>
    `}, "*");
    });

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')
    cy.get('#\\/_p3').should('have.text', 'Selected original index: ')


    let choices ;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      choices = [...components['/_choiceinput1'].state.choicetexts];
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
      expect(components['/_choiceinput1'].state.selectedvalues).eqls([])
      expect(components['/_choiceinput1'].state.selectedindices).eqls([])
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([])
      expect(components['/_choiceinput1'].state.inline).eq(true);
      expect(components['/_choiceinput1'].state.fixedorder).eq(false);
    });

    cy.log('select options in order')

    for(let i=0; i<4; i++) {
      cy.get(`#\\/_choiceinput1`).select(`${i+1}`);

      cy.window().then((win) => {

        // put this inside promise so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
        cy.get('#\\/_p2 .mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i+1}`)
        })
        cy.get('#\\/_p3 .mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${originalChoices.indexOf(choices[i])+1}`)
        })

        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].state.selectedvalues).eqls([choices[i]])
        expect(components['/_choiceinput1'].state.selectedindices).eqls([i+1])
        expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([originalChoices.indexOf(choices[i])+1])

      });
    }

  });

  it('fixed order', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <choiceinput fixedorder>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <ref prop='selectedvalue'>_choiceinput1</ref></p>
    <p>Selected index: <ref prop='selectedindex'>_choiceinput1</ref></p>
    <p>Selected original index: <ref prop='selectedoriginalindex'>_choiceinput1</ref></p>
    `}, "*");
    });

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get('#\\/_p1').should('have.text', 'Selected value: ')
    cy.get('#\\/_p2').should('have.text', 'Selected index: ')
    cy.get('#\\/_p3').should('have.text', 'Selected original index: ')


    let choices ;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      choices = [...components['/_choiceinput1'].state.choicetexts];
      expect(choices).eqls(originalChoices);
      expect(components['/_choiceinput1'].state.selectedvalues).eqls([])
      expect(components['/_choiceinput1'].state.selectedindices).eqls([])
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([])
      expect(components['/_choiceinput1'].state.inline).eq(false);
      expect(components['/_choiceinput1'].state.fixedorder).eq(true);
    });

    cy.log('select options in order')

    for(let i=0; i<4; i++) {
      cy.get(`#\\/_choiceinput1_choice${i}_input`).click();

      cy.window().then((win) => {

        // put this inside promise so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', 'Selected value: ' + choices[i])
        cy.get('#\\/_p2 .mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i+1}`)
        })
        cy.get('#\\/_p3 .mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i+1}`)
        })

        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].state.selectedvalues).eqls([choices[i]])
        expect(components['/_choiceinput1'].state.selectedindices).eqls([i+1])
        expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([i+1])

      });
    }

  });

  it('choiceinput references', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
      <choiceinput inline>
        <choice>a</choice>
        <choice>b</choice>
        <choice>c</choice>
        <choice>d</choice>
        <choice>e</choice>
        <choice>f</choice>
      </choiceinput>
      <ref name="copy">_choiceinput1</ref>
      <ref name="copy2" inline="false">_choiceinput1</ref>
      <ref name="copy3" inline="false">copy</ref>
  
      <p>Selected values: <aslist>
      <ref prop='selectedvalue'>_choiceinput1</ref>
      <ref prop='selectedvalue'>copy</ref>
      <ref prop='selectedvalue'>copy2</ref>
      <ref prop='selectedvalue'>copy3</ref>
      </aslist></p>
      <p>Selected indices: <aslist>
      <ref prop='selectedindex'>_choiceinput1</ref>
      <ref prop='selectedindex'>copy</ref>
      <ref prop='selectedindex'>copy2</ref>
      <ref prop='selectedindex'>copy3</ref>
      </aslist></p>
      <p>Selected original indices: <aslist>
      <ref prop='selectedoriginalindex'>_choiceinput1</ref>
      <ref prop='selectedoriginalindex'>copy</ref>
      <ref prop='selectedoriginalindex'>copy2</ref>
      <ref prop='selectedoriginalindex'>copy3</ref>
      </aslist></p>
    `}, "*");
    });


    let originalChoices = ["a", "b", "c", "d", "e", "f"];
    cy.get('#\\/_p1').should('have.text', 'Selected values: ')
    cy.get('#\\/_p2').should('have.text', 'Selected indices: ')
    cy.get('#\\/_p3').should('have.text', 'Selected original indices: ')


    let choices ;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      choices = [...components['/_choiceinput1'].state.choicetexts];
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
      expect(components['/copy'].replacements[0].state.choicetexts).eqls(choices);
      expect(components['/copy2'].replacements[0].state.choicetexts).eqls(choices);
      expect(components['/copy3'].replacements[0].state.choicetexts).eqls(choices);

      expect(components['/_choiceinput1'].state.selectedvalues).eqls([])
      expect(components['/_choiceinput1'].state.selectedindices).eqls([])
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([])
      expect(components['/copy'].replacements[0].state.selectedvalues).eqls([])
      expect(components['/copy'].replacements[0].state.selectedindices).eqls([])
      expect(components['/copy'].replacements[0].state.selectedoriginalindices).eqls([])
      expect(components['/copy2'].replacements[0].state.selectedvalues).eqls([])
      expect(components['/copy2'].replacements[0].state.selectedindices).eqls([])
      expect(components['/copy2'].replacements[0].state.selectedoriginalindices).eqls([])
      expect(components['/copy3'].replacements[0].state.selectedvalues).eqls([])
      expect(components['/copy3'].replacements[0].state.selectedindices).eqls([])
      expect(components['/copy3'].replacements[0].state.selectedoriginalindices).eqls([])

      expect(components['/_choiceinput1'].state.inline).eq(true);
      expect(components['/_choiceinput1'].state.fixedorder).eq(false);
      expect(components['/copy'].replacements[0].state.inline).eq(true);
      expect(components['/copy'].replacements[0].state.fixedorder).eq(false);
      expect(components['/copy2'].replacements[0].state.inline).eq(false);
      expect(components['/copy2'].replacements[0].state.fixedorder).eq(false);
      expect(components['/copy3'].replacements[0].state.inline).eq(false);
      expect(components['/copy3'].replacements[0].state.fixedorder).eq(false);
    });


    cy.log('select options in order from first input')
    for(let i=0; i<6; i++) {
      cy.get(`#\\/_choiceinput1`).select(`${i+1}`);

      cy.window().then((win) => {

        let origInd = originalChoices.indexOf(choices[i])+1;
        // put this inside promise so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
        for(let ind=0; ind < 4; ind++) {
          cy.get(`#\\/_p2 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i+1}`)
          })
          cy.get(`#\\/_p3 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${origInd}`)
          })
        }

        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].state.selectedvalues).eqls([choices[i]])
        expect(components['/_choiceinput1'].state.selectedindices).eqls([i+1])
        expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy'].replacements[0].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy2'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy2'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy2'].replacements[0].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy3'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy3'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy3'].replacements[0].state.selectedoriginalindices).eqls([origInd])

      });
    }

    cy.log('select options in order from second input')
    for(let i=0; i<6; i++) {
      cy.get(`#__choiceinput1`).select(`${i+1}`);

      cy.window().then((win) => {

        let origInd = originalChoices.indexOf(choices[i])+1;
        // put this inside promise so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
        for(let ind=0; ind < 4; ind++) {
          cy.get(`#\\/_p2 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i+1}`)
          })
          cy.get(`#\\/_p3 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${origInd}`)
          })
        }

        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].state.selectedvalues).eqls([choices[i]])
        expect(components['/_choiceinput1'].state.selectedindices).eqls([i+1])
        expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy'].replacements[0].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy2'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy2'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy2'].replacements[0].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy3'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy3'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy3'].replacements[0].state.selectedoriginalindices).eqls([origInd])

      });
    }

    cy.log('select options in order from third input')
    for(let i=0; i<6; i++) {
      cy.get(`#__choiceinput2_choice${i}_input`).click();

      cy.window().then((win) => {

        let origInd = originalChoices.indexOf(choices[i])+1;
        // put this inside promise so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
        for(let ind=0; ind < 4; ind++) {
          cy.get(`#\\/_p2 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i+1}`)
          })
          cy.get(`#\\/_p3 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${origInd}`)
          })
        }

        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].state.selectedvalues).eqls([choices[i]])
        expect(components['/_choiceinput1'].state.selectedindices).eqls([i+1])
        expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy'].replacements[0].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy2'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy2'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy2'].replacements[0].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy3'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy3'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy3'].replacements[0].state.selectedoriginalindices).eqls([origInd])

      });
    }

    cy.log('select options in order from fourth input')
    for(let i=0; i<6; i++) {
      cy.get(`#__choiceinput3_choice${i}_input`).click();

      cy.window().then((win) => {

        let origInd = originalChoices.indexOf(choices[i])+1;
        // put this inside promise so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`)
        for(let ind=0; ind < 4; ind++) {
          cy.get(`#\\/_p2 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i+1}`)
          })
          cy.get(`#\\/_p3 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${origInd}`)
          })
        }

        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].state.selectedvalues).eqls([choices[i]])
        expect(components['/_choiceinput1'].state.selectedindices).eqls([i+1])
        expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy'].replacements[0].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy2'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy2'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy2'].replacements[0].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy3'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy3'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy3'].replacements[0].state.selectedoriginalindices).eqls([origInd])

      });
    }

  })

  it('math inside choices', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <choiceinput>
      <choice>The function is <m>f(\\xi)=\\sin(\\xi)</m>.</choice>
      <choice>The sum of <math name="lambda2">lambda^2</math> and <math name="twice">2 lambda^2</math> is <math simplify><ref>lambda2</ref>+<ref>twice</ref></math>.</choice>
      <choice>The sequence is <aslist><sequence>1,5</sequence></aslist>.</choice>
      <choice>Can't convert this latex: <m>\\int_a^b q(t) \\, dt</m>.</choice>
    </choiceinput>

    <ref name="copy" inline>_choiceinput1</ref>

    <p>Selected values: <aslist>
    <ref prop='selectedvalue'>_choiceinput1</ref>
    <ref prop='selectedvalue'>copy</ref>
    </aslist></p>
    <p>Selected indices: <aslist>
    <ref prop='selectedindex'>_choiceinput1</ref>
    <ref prop='selectedindex'>copy</ref>
    </aslist></p>
    <p>Selected original indices: <aslist>
    <ref prop='selectedoriginalindex'>_choiceinput1</ref>
    <ref prop='selectedoriginalindex'>copy</ref>
    </aslist></p>
    `}, "*");
    });

    let originalChoices = [
      "The function is f(ξ) = sin(ξ).",
      "The sum of λ^2 and 2 λ^2 is 3 λ^2.",
      "The sequence is 1, 2, 3, 4, 5.",
      "Can't convert this latex: \\int_a^b q(t) \\, dt."
    ];
    cy.get('#\\/_p1').should('have.text', 'Selected values: ')
    cy.get('#\\/_p2').should('have.text', 'Selected indices: ')
    cy.get('#\\/_p3').should('have.text', 'Selected original indices: ')


    let choices ;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      choices = [...components['/_choiceinput1'].state.choicetexts];
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
      
      expect(components['/copy'].replacements[0].state.choicetexts).eqls(choices);

      expect(components['/_choiceinput1'].state.selectedvalues).eqls([])
      expect(components['/_choiceinput1'].state.selectedindices).eqls([])
      expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([])
      expect(components['/copy'].replacements[0].state.selectedvalues).eqls([])
      expect(components['/copy'].replacements[0].state.selectedindices).eqls([])
      expect(components['/copy'].replacements[0].state.selectedoriginalindices).eqls([])

      expect(components['/_choiceinput1'].state.inline).eq(false);
      expect(components['/_choiceinput1'].state.fixedorder).eq(false);
      expect(components['/copy'].replacements[0].state.inline).eq(true);
      expect(components['/copy'].replacements[0].state.fixedorder).eq(false);
    });


    cy.log('select options in order from first input')
    for(let i=0; i<4; i++) {
      cy.get(`#\\/_choiceinput1_choice${i}_input`).click();

      cy.window().then((win) => {

        let origInd = originalChoices.indexOf(choices[i])+1;
        // put this inside promise so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}`)
        for(let ind=0; ind < 2; ind++) {
          cy.get(`#\\/_p2 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i+1}`)
          })
          cy.get(`#\\/_p3 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${origInd}`)
          })
        }

        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].state.selectedvalues).eqls([choices[i]])
        expect(components['/_choiceinput1'].state.selectedindices).eqls([i+1])
        expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy'].replacements[0].state.selectedoriginalindices).eqls([origInd])

      });
    }

    cy.log('select options in order from second input')
    for(let i=0; i<4; i++) {
      cy.get(`#__choiceinput1`).select(`${i+1}`);

      cy.window().then((win) => {

        let origInd = originalChoices.indexOf(choices[i])+1;
        // put this inside promise so that choices is populated before line is executed
        cy.get('#\\/_p1').should('have.text', `Selected values: ${choices[i]}, ${choices[i]}`)
        for(let ind=0; ind < 2; ind++) {
          cy.get(`#\\/_p2 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i+1}`)
          })
          cy.get(`#\\/_p3 > :nth-child(${2*ind+4})`).find(`.mjx-mrow`).eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${origInd}`)
          })
        }

        let components = Object.assign({}, win.state.components);
        expect(components['/_choiceinput1'].state.selectedvalues).eqls([choices[i]])
        expect(components['/_choiceinput1'].state.selectedindices).eqls([i+1])
        expect(components['/_choiceinput1'].state.selectedoriginalindices).eqls([origInd])
        expect(components['/copy'].replacements[0].state.selectedvalues).eqls([choices[i]])
        expect(components['/copy'].replacements[0].state.selectedindices).eqls([i+1])
        expect(components['/copy'].replacements[0].state.selectedoriginalindices).eqls([origInd])

      });
    }

  });

});