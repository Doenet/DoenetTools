describe('Textinput Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('textinput references', () => {

    // A fairly involved test
    // to check for bugs that have shown up only after multiple manipulations

    // Initial doenet code

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput prefill='hello'/>
    <ref>_textinput1</ref>
    <ref prop='value'>_textinput1</ref>
    <textinput/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinput1a = components['/_ref1'].replacements[0];
      let textinput1aAnchor = '#' + textinput1a.componentName + '_input';
      let text1 = components['/_ref2'].replacements[0];
      let text1Anchor = '#' + text1.componentName;

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'hello');
      cy.get(textinput1aAnchor).should('have.value', 'hello');
      cy.get('#\\/_textinput2_input').should('have.value', '');

      cy.get(text1Anchor).should('have.text', 'hello');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq('hello');
        expect(textinput1a.stateValues.value).eq('hello');
        expect(components['/_textinput2'].stateValues.value).eq('');
      });


      // type 2 in first input

      cy.log("Typing 2 in first textinput");
      cy.get('#\\/_textinput1_input').type(`2`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'hello2');
      cy.get(textinput1aAnchor).should('have.value', 'hello2');
      cy.get('#\\/_textinput2_input').should('have.value', '');

      cy.get(text1Anchor).should('have.text', 'hello2');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq('hello2');
        expect(textinput1a.stateValues.value).eq('hello2');
        expect(components['/_textinput2'].stateValues.value).eq('');
      });


      // press enter in first input

      cy.log("Pressing Enter in first textinput");
      cy.get('#\\/_textinput1_input').type(`{enter}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'hello2');
      cy.get(textinput1aAnchor).should('have.value', 'hello2');
      cy.get('#\\/_textinput2_input').should('have.value', '');
      cy.get(text1Anchor).should('have.text', 'hello2');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq('hello2');
        expect(textinput1a.stateValues.value).eq('hello2');
        expect(components['/_textinput2'].stateValues.value).eq('');
      });


      // erase "2" and type " you" in second input

      cy.log(`Erasing "2" and typing " you" in second textinput`);
      cy.get(textinput1aAnchor).type(`{backspace} you`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'hello you');
      cy.get(textinput1aAnchor).should('have.value', 'hello you');
      cy.get('#\\/_textinput2_input').should('have.value', '');

      cy.get(text1Anchor).should('have.text', 'hello you');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("hello you");
        expect(textinput1a.stateValues.value).eq("hello you");
        expect(components['/_textinput2'].stateValues.value).eq('');
      });


      // change focus to textinput 1
      cy.log("Changing focus to first textinput");
      cy.get('#\\/_textinput1_input').focus();

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'hello you');
      cy.get(textinput1aAnchor).should('have.value', 'hello you');
      cy.get('#\\/_textinput2_input').should('have.value', '');

      cy.get(text1Anchor).should('have.text', 'hello you');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("hello you");
        expect(textinput1a.stateValues.value).eq("hello you");
        expect(components['/_textinput2'].stateValues.value).eq('');
      });


      // bye in third input

      cy.log(`Typing "bye" in third textinput`);
      cy.get('#\\/_textinput2_input').type(`bye`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'hello you');
      cy.get(textinput1aAnchor).should('have.value', 'hello you');
      cy.get('#\\/_textinput2_input').should('have.value', 'bye');

      cy.get(text1Anchor).should('have.text', 'hello you');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("hello you");
        expect(textinput1a.stateValues.value).eq("hello you");
        expect(components['/_textinput2'].stateValues.value).eq('bye');
      });



      // press enter in textinput 3

      cy.log("Pressing enter in third textinput");
      cy.get('#\\/_textinput2_input').type(`{enter}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'hello you');
      cy.get(textinput1aAnchor).should('have.value', 'hello you');
      cy.get('#\\/_textinput2_input').should('have.value', 'bye');

      cy.get(text1Anchor).should('have.text', 'hello you');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("hello you");
        expect(textinput1a.stateValues.value).eq("hello you");
        expect(components['/_textinput2'].stateValues.value).eq("bye");
      });


      // type abc enter in textinput 2

      cy.log("Typing abc in second textinput");
      cy.get(textinput1aAnchor).clear().type(`abc`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abc');
      cy.get(textinput1aAnchor).should('have.value', 'abc');
      cy.get('#\\/_textinput2_input').should('have.value', 'bye');

      cy.get(text1Anchor).should('have.text', 'abc');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("abc");
        expect(textinput1a.stateValues.value).eq("abc");
        expect(components['/_textinput2'].stateValues.value).eq("bye");
      });


      // press enter in textinput 2

      cy.log("Pressing enter in second textinput");
      cy.get(textinput1aAnchor).type(`{enter}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abc');
      cy.get(textinput1aAnchor).should('have.value', 'abc');
      cy.get('#\\/_textinput2_input').should('have.value', 'bye');

      cy.get(text1Anchor).should('have.text', 'abc');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("abc");
        expect(textinput1a.stateValues.value).eq("abc");
        expect(components['/_textinput2'].stateValues.value).eq("bye");
      });

      // type abc in textinput 1

      cy.log("Typing abc in first textinput");
      cy.get('#\\/_textinput1_input').clear().type(`abc`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abc');
      cy.get(textinput1aAnchor).should('have.value', 'abc');
      cy.get('#\\/_textinput2_input').should('have.value', 'bye');

      cy.get(text1Anchor).should('have.text', 'abc');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("abc");
        expect(textinput1a.stateValues.value).eq("abc");
        expect(components['/_textinput2'].stateValues.value).eq("bye");
      });


      // type saludos in textinput 3

      cy.log("Typing saludos in third textinput");
      cy.get('#\\/_textinput2_input').clear().type(`saludos`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abc');
      cy.get(textinput1aAnchor).should('have.value', 'abc');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abc');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("abc");
        expect(textinput1a.stateValues.value).eq("abc");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });


      // type d in textinput 1

      cy.log("Typing d in first textinput");
      cy.get('#\\/_textinput1_input').type(`d`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcd');
      cy.get(textinput1aAnchor).should('have.value', 'abcd');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abcd');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("abcd");
        expect(textinput1a.stateValues.value).eq("abcd");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });


      cy.log("Typing enter in first textinput");
      cy.get('#\\/_textinput1_input').type(`{enter}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcd');
      cy.get(textinput1aAnchor).should('have.value', 'abcd');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abcd');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("abcd");
        expect(textinput1a.stateValues.value).eq("abcd");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });


      cy.log("Clearing second textinput");
      cy.get(textinput1aAnchor).clear();

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', '');
      cy.get(textinput1aAnchor).should('have.value', '');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', '');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("");
        expect(textinput1a.stateValues.value).eq("");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });

      cy.log("pressing escape to undo")
      cy.get(textinput1aAnchor).type(`{esc}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcd');
      cy.get(textinput1aAnchor).should('have.value', 'abcd');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abcd');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("abcd");
        expect(textinput1a.stateValues.value).eq("abcd");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });

      cy.log("Type e in second textinput");
      cy.get(textinput1aAnchor).type(`e`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcde');
      cy.get(textinput1aAnchor).should('have.value', 'abcde');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abcde');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("abcde");
        expect(textinput1a.stateValues.value).eq("abcde");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });


      cy.log("Escape in first input doesn't undo");
      cy.get('#\\/_textinput1_input').type(`{Esc}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcde');
      cy.get(textinput1aAnchor).should('have.value', 'abcde');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abcde');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("abcde");
        expect(textinput1a.stateValues.value).eq("abcde");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });


      cy.log("Delete characters and replace in first input");
      cy.get('#\\/_textinput1_input').type(`{backspace}{backspace}f`);


      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcf');
      cy.get(textinput1aAnchor).should('have.value', 'abcf');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abcf');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("abcf");
        expect(textinput1a.stateValues.value).eq("abcf");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });


      cy.log("Undo with escape");
      cy.get('#\\/_textinput1_input').type(`{Esc}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcde');
      cy.get(textinput1aAnchor).should('have.value', 'abcde');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abcde');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq("abcde");
        expect(textinput1a.stateValues.value).eq("abcde");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });

    })
  })

  it('downstream from textinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>Original text: <text>hello there</text></p>
    <p>textinput based on text: <textinput><ref>_text1</ref></textinput></p>
    `}, "*");
    });

    cy.get('#\\/_textinput1_input').should('have.value', 'hello there');

    cy.get('#\\/_text1').should('have.text', 'hello there');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.value).eq('hello there');
      expect(components['/_text1'].stateValues.value).eq('hello there');
    });

    cy.log('enter new values')
    cy.get('#\\/_textinput1_input').clear().type(`bye now{enter}`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');

    cy.get('#\\/_text1').should('have.text', 'bye now');


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.value).eq('bye now');
      expect(components['/_text1'].stateValues.value).eq('bye now');
    });


    cy.log('prefill ignored');
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>Original text: <text>hello there</text></p>
    <p>textinput based on text: <textinput prefill="bye now"><ref>_text1</ref></textinput></p>
    `}, "*");
    });

    cy.get('#\\/_textinput1_input').should('have.value', 'hello there');

    cy.get('#\\/_text1').should('have.text', 'hello there');


    cy.log("values revert if not updatable")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>Original text: <text>can't <text>update</text> <text>me</text></text></p>
    <p>textinput based on text: <textinput><ref>_text1</ref></textinput></p>
    `}, "*");
    });

    cy.get('#\\/_textinput1_input').should('have.value', `can't update me`);

    cy.get('#\\/_text1').should('have.text', `can't update me`);

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.value).eq(`can't update me`);
      expect(components['/_text1'].stateValues.value).eq(`can't update me`);
    });

    cy.log('enter new values, but they revert')
    cy.get('#\\/_textinput1_input').clear().type(`disappear{enter}`);

    cy.get('#\\/_textinput1_input').should('have.value', `can't update me`);

    cy.get('#\\/_text1').should('have.text', `can't update me`);

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.value).eq(`can't update me`);
      expect(components['/_text1'].stateValues.value).eq(`can't update me`);
    });

  })

});