import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('TextInput Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

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
    <copy tname="_textinput1" />
    <copy prop='value' tname="_textinput1" />
    <copy prop='immediateValue' tname="_textinput1" />
    <textinput/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinput1a = components['/_copy1'].replacements[0];
      let textinput1aAnchor = cesc('#' + textinput1a.componentName + '_input');
      let text1 = components['/_copy2'].replacements[0];
      let text1Anchor = cesc('#' + text1.componentName);
      let text2 = components['/_copy3'].replacements[0];
      let text2Anchor = cesc('#' + text2.componentName);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'hello');
      cy.get(textinput1aAnchor).should('have.value', 'hello');
      cy.get('#\\/_textinput2_input').should('have.value', '');

      cy.get(text1Anchor).should('have.text', 'hello');
      cy.get(text2Anchor).should('have.text', 'hello');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq('hello');
        expect(textinput1a.stateValues.immediateValue).eq('hello');
        expect(components['/_textinput2'].stateValues.immediateValue).eq('');
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

      cy.get(text1Anchor).should('have.text', 'hello');
      cy.get(text2Anchor).should('have.text', 'hello2');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq('hello2');
        expect(textinput1a.stateValues.immediateValue).eq('hello2');
        expect(components['/_textinput2'].stateValues.immediateValue).eq('');
        expect(components['/_textinput1'].stateValues.value).eq('hello');
        expect(textinput1a.stateValues.value).eq('hello');
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
      cy.get(text2Anchor).should('have.text', 'hello2');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq('hello2');
        expect(textinput1a.stateValues.immediateValue).eq('hello2');
        expect(components['/_textinput2'].stateValues.immediateValue).eq('');
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

      cy.get(text1Anchor).should('have.text', 'hello2');
      cy.get(text2Anchor).should('have.text', 'hello you');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("hello you");
        expect(textinput1a.stateValues.immediateValue).eq("hello you");
        expect(components['/_textinput2'].stateValues.immediateValue).eq('');
        expect(components['/_textinput1'].stateValues.value).eq("hello2");
        expect(textinput1a.stateValues.value).eq("hello2");
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
      cy.get(text2Anchor).should('have.text', 'hello you');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("hello you");
        expect(textinput1a.stateValues.immediateValue).eq("hello you");
        expect(components['/_textinput2'].stateValues.immediateValue).eq('');
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
      cy.get(text2Anchor).should('have.text', 'hello you');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("hello you");
        expect(textinput1a.stateValues.immediateValue).eq("hello you");
        expect(components['/_textinput2'].stateValues.immediateValue).eq('bye');
        expect(components['/_textinput1'].stateValues.value).eq("hello you");
        expect(textinput1a.stateValues.value).eq("hello you");
        expect(components['/_textinput2'].stateValues.value).eq('');
      });



      // press enter in textinput 3

      cy.log("Pressing enter in third textinput");
      cy.get('#\\/_textinput2_input').type(`{enter}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'hello you');
      cy.get(textinput1aAnchor).should('have.value', 'hello you');
      cy.get('#\\/_textinput2_input').should('have.value', 'bye');

      cy.get(text1Anchor).should('have.text', 'hello you');
      cy.get(text2Anchor).should('have.text', 'hello you');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("hello you");
        expect(textinput1a.stateValues.immediateValue).eq("hello you");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("bye");
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

      cy.get(text1Anchor).should('have.text', 'hello you');
      cy.get(text2Anchor).should('have.text', 'abc');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("abc");
        expect(textinput1a.stateValues.immediateValue).eq("abc");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("bye");
        expect(components['/_textinput1'].stateValues.value).eq("hello you");
        expect(textinput1a.stateValues.value).eq("hello you");
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
      cy.get(text2Anchor).should('have.text', 'abc');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("abc");
        expect(textinput1a.stateValues.immediateValue).eq("abc");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("bye");
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
      cy.get(text2Anchor).should('have.text', 'abc');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("abc");
        expect(textinput1a.stateValues.immediateValue).eq("abc");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("bye");
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
      cy.get(text2Anchor).should('have.text', 'abc');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("abc");
        expect(textinput1a.stateValues.immediateValue).eq("abc");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("saludos");
        expect(components['/_textinput1'].stateValues.value).eq("abc");
        expect(textinput1a.stateValues.value).eq("abc");
        expect(components['/_textinput2'].stateValues.value).eq("bye");
      });


      // type d in textinput 1

      cy.log("Typing d in first textinput");
      cy.get('#\\/_textinput1_input').type(`d`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcd');
      cy.get(textinput1aAnchor).should('have.value', 'abcd');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abc');
      cy.get(text2Anchor).should('have.text', 'abcd');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("abcd");
        expect(textinput1a.stateValues.immediateValue).eq("abcd");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("saludos");
        expect(components['/_textinput1'].stateValues.value).eq("abc");
        expect(textinput1a.stateValues.value).eq("abc");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });


      cy.log("Typing enter in first textinput");
      cy.get('#\\/_textinput1_input').type(`{enter}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcd');
      cy.get(textinput1aAnchor).should('have.value', 'abcd');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abcd');
      cy.get(text2Anchor).should('have.text', 'abcd');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("abcd");
        expect(textinput1a.stateValues.immediateValue).eq("abcd");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("saludos");
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

      cy.get(text1Anchor).should('have.text', 'abcd');
      cy.get(text2Anchor).should('have.text', '');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("");
        expect(textinput1a.stateValues.immediateValue).eq("");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("saludos");
        expect(components['/_textinput1'].stateValues.value).eq("abcd");
        expect(textinput1a.stateValues.value).eq("abcd");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });

      cy.log("pressing escape to undo")
      cy.get(textinput1aAnchor).type(`{esc}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcd');
      cy.get(textinput1aAnchor).should('have.value', 'abcd');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abcd');
      // cy.get(text2Anchor).should('have.text', 'abcd');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("abcd");
        expect(textinput1a.stateValues.immediateValue).eq("abcd");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("saludos");
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

      cy.get(text1Anchor).should('have.text', 'abcd');
      cy.get(text2Anchor).should('have.text', 'abcde');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("abcde");
        expect(textinput1a.stateValues.immediateValue).eq("abcde");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("saludos");
        expect(components['/_textinput1'].stateValues.value).eq("abcd");
        expect(textinput1a.stateValues.value).eq("abcd");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });


      cy.log("Escape in first input doesn't undo");
      cy.get('#\\/_textinput1_input').type(`{Esc}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcde');
      cy.get(textinput1aAnchor).should('have.value', 'abcde');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abcde');
      cy.get(text2Anchor).should('have.text', 'abcde');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("abcde");
        expect(textinput1a.stateValues.immediateValue).eq("abcde");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("saludos");
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

      cy.get(text1Anchor).should('have.text', 'abcde');
      cy.get(text2Anchor).should('have.text', 'abcf');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("abcf");
        expect(textinput1a.stateValues.immediateValue).eq("abcf");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("saludos");
        expect(components['/_textinput1'].stateValues.value).eq("abcde");
        expect(textinput1a.stateValues.value).eq("abcde");
        expect(components['/_textinput2'].stateValues.value).eq("saludos");
      });


      cy.log("Undo with escape");
      cy.get('#\\/_textinput1_input').type(`{Esc}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_textinput1_input').should('have.value', 'abcde');
      cy.get(textinput1aAnchor).should('have.value', 'abcde');
      cy.get('#\\/_textinput2_input').should('have.value', 'saludos');

      cy.get(text1Anchor).should('have.text', 'abcde');
      cy.get(text2Anchor).should('have.text', 'abcde');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.immediateValue).eq("abcde");
        expect(textinput1a.stateValues.immediateValue).eq("abcde");
        expect(components['/_textinput2'].stateValues.immediateValue).eq("saludos");
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
    <p>textinput based on text: <textinput bindValueTo="$_text1" /></p>
    <p>Copied textinput: <copy tname="_textinput1" name="textinput2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'hello there');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let textinput2 = components['/textinput2'].replacements[0];
      let textinput2Anchor = cesc('#' + textinput2.componentName) + "_input";

      cy.get('#\\/_textinput1_input').should('have.value', 'hello there');
      cy.get(textinput2Anchor).should('have.value', 'hello there');


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq('hello there');
        expect(components['/_textinput1'].stateValues.immediateValue).eq('hello there');
        expect(components['/_text1'].stateValues.value).eq('hello there');
        expect(textinput2.stateValues.value).eq('hello there');
        expect(textinput2.stateValues.immediateValue).eq('hello there');
      });

      cy.log('enter new values')
      cy.get('#\\/_textinput1_input').clear().type(`bye now{enter}`);

      cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
      cy.get(textinput2Anchor).should('have.value', 'bye now');

      cy.get('#\\/_text1').should('have.text', 'bye now');


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textinput1'].stateValues.value).eq('bye now');
        expect(components['/_textinput1'].stateValues.immediateValue).eq('bye now');
        expect(components['/_text1'].stateValues.value).eq('bye now');
        expect(textinput2.stateValues.value).eq('bye now');
        expect(textinput2.stateValues.immediateValue).eq('bye now');
      });
    })


    cy.log('prefill ignored');
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>Original text: <text>hello there</text></p>
    <p>textinput based on text: <textinput prefill="bye now" bindValueTo="$_text1" /></p>
    `}, "*");
    });

    cy.get('#\\/_textinput1_input').should('have.value', 'hello there');

    cy.get('#\\/_text1').should('have.text', 'hello there');


    cy.log("values revert if not updatable")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>Original text: <text>can't <text>update</text> <text>me</text></text></p>
    <p>textinput based on text: <textinput bindValueTo="$_text1" /></p>
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

  it('textinput based on value of textinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>Original textinput: <textinput prefill="hello there"/></p>
    <p>textinput based on textinput: <textinput bindValueTo="$_textinput1" /></p>
    <p>Immediate value of original: <text name="originalimmediate"><copy prop="immediateValue" tname="_textinput1"/></text></p>
    <p>Value of original: <text name="originalvalue"><copy prop="value" tname="_textinput1"/></text></p>
    <p>Immediate value of second: <text name="secondimmediate"><copy prop="immediateValue" tname="_textinput2"/></text></p>
    <p>Value of second: <text name="secondvalue"><copy prop="value" tname="_textinput2"/></text></p>
    `}, "*");
    });

    cy.get('#\\/_textinput1_input').should('have.value', 'hello there');
    cy.get('#\\/_textinput2_input').should('have.value', 'hello there');

    cy.get('#\\/originalimmediate').should('have.text', 'hello there');
    cy.get('#\\/originalvalue').should('have.text', 'hello there');
    cy.get('#\\/secondimmediate').should('have.text', 'hello there');
    cy.get('#\\/secondvalue').should('have.text', 'hello there');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.immediateValue).eq('hello there');
      expect(components['/_textinput1'].stateValues.value).eq('hello there');
      expect(components['/_textinput2'].stateValues.immediateValue).eq('hello there');
      expect(components['/_textinput2'].stateValues.value).eq('hello there');
    });

    cy.log('type new values in first textinput')
    cy.get('#\\/_textinput1_input').clear().type(`bye now`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'hello there');

    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'hello there');
    cy.get('#\\/secondimmediate').should('have.text', 'hello there');
    cy.get('#\\/secondvalue').should('have.text', 'hello there');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(components['/_textinput1'].stateValues.value).eq('hello there');
      expect(components['/_textinput2'].stateValues.immediateValue).eq('hello there');
      expect(components['/_textinput2'].stateValues.value).eq('hello there');
    });

    cy.log('press enter')
    cy.get('#\\/_textinput1_input').type(`{enter}`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'bye now');

    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'bye now');
    cy.get('#\\/secondimmediate').should('have.text', 'bye now');
    cy.get('#\\/secondvalue').should('have.text', 'bye now');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(components['/_textinput1'].stateValues.value).eq('bye now');
      expect(components['/_textinput2'].stateValues.immediateValue).eq('bye now');
      expect(components['/_textinput2'].stateValues.value).eq('bye now');
    });


    cy.log('type values input second textinput')
    cy.get('#\\/_textinput2_input').clear().type(`Hello again`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'Hello again');

    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'bye now');
    cy.get('#\\/secondimmediate').should('have.text', 'Hello again');
    cy.get('#\\/secondvalue').should('have.text', 'bye now');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(components['/_textinput1'].stateValues.value).eq('bye now');
      expect(components['/_textinput2'].stateValues.immediateValue).eq('Hello again');
      expect(components['/_textinput2'].stateValues.value).eq('bye now');
    });



    cy.log('leave second textinput')
    cy.get('#\\/_textinput2_input').blur();

    cy.get('#\\/_textinput1_input').should('have.value', 'Hello again');
    cy.get('#\\/_textinput2_input').should('have.value', 'Hello again');

    cy.get('#\\/originalimmediate').should('have.text', 'Hello again');
    cy.get('#\\/originalvalue').should('have.text', 'Hello again');
    cy.get('#\\/secondimmediate').should('have.text', 'Hello again');
    cy.get('#\\/secondvalue').should('have.text', 'Hello again');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.immediateValue).eq('Hello again');
      expect(components['/_textinput1'].stateValues.value).eq('Hello again');
      expect(components['/_textinput2'].stateValues.immediateValue).eq('Hello again');
      expect(components['/_textinput2'].stateValues.value).eq('Hello again');
    });


  })

  it('textinput based on immediateValue of textinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>Original textinput: <textinput prefill="hello there"/></p>
    <p>textinput based on textinput: <textinput bindValueTo="$(_textinput1{prop='immediateValue'})" /></p>
    <p>Immediate value of original: <text name="originalimmediate"><copy prop="immediateValue" tname="_textinput1"/></text></p>
    <p>Value of original: <text name="originalvalue"><copy prop="value" tname="_textinput1"/></text></p>
    <p>Immediate value of second: <text name="secondimmediate"><copy prop="immediateValue" tname="_textinput2"/></text></p>
    <p>Value of second: <text name="secondvalue"><copy prop="value" tname="_textinput2"/></text></p>

    `}, "*");
    });

    cy.get('#\\/_textinput1_input').should('have.value', 'hello there');
    cy.get('#\\/_textinput2_input').should('have.value', 'hello there');
    cy.get('#\\/originalimmediate').should('have.text', 'hello there');
    cy.get('#\\/originalvalue').should('have.text', 'hello there');
    cy.get('#\\/secondimmediate').should('have.text', 'hello there');
    cy.get('#\\/secondvalue').should('have.text', 'hello there');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.immediateValue).eq('hello there');
      expect(components['/_textinput1'].stateValues.value).eq('hello there');
      expect(components['/_textinput2'].stateValues.immediateValue).eq('hello there');
      expect(components['/_textinput2'].stateValues.value).eq('hello there');
    });

    cy.log('type new values in first textinput')
    cy.get('#\\/_textinput1_input').clear().type(`bye now`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'bye now');
    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'hello there');
    cy.get('#\\/secondimmediate').should('have.text', 'bye now');
    cy.get('#\\/secondvalue').should('have.text', 'bye now');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(components['/_textinput1'].stateValues.value).eq('hello there');
      expect(components['/_textinput2'].stateValues.immediateValue).eq('bye now');
      expect(components['/_textinput2'].stateValues.value).eq('bye now');
    });

    cy.log('press enter')
    cy.get('#\\/_textinput1_input').type(`{enter}`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'bye now');
    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'bye now');
    cy.get('#\\/secondimmediate').should('have.text', 'bye now');
    cy.get('#\\/secondvalue').should('have.text', 'bye now');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(components['/_textinput1'].stateValues.value).eq('bye now');
      expect(components['/_textinput2'].stateValues.immediateValue).eq('bye now');
      expect(components['/_textinput2'].stateValues.value).eq('bye now');
    });


    cy.log('type values in second textinput')
    cy.get('#\\/_textinput2_input').clear().type(`Hello again`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'Hello again');
    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'bye now');
    cy.get('#\\/secondimmediate').should('have.text', 'Hello again');
    cy.get('#\\/secondvalue').should('have.text', 'bye now');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(components['/_textinput1'].stateValues.value).eq('bye now');
      expect(components['/_textinput2'].stateValues.immediateValue).eq('Hello again');
      expect(components['/_textinput2'].stateValues.value).eq('bye now');
    });

    cy.log('leave second textinput, changes all values')
    cy.get('#\\/_textinput2_input').blur();

    cy.get('#\\/_textinput1_input').should('have.value', 'Hello again');
    cy.get('#\\/_textinput2_input').should('have.value', 'Hello again');
    cy.get('#\\/originalimmediate').should('have.text', 'Hello again');
    cy.get('#\\/originalvalue').should('have.text', 'Hello again');
    cy.get('#\\/secondimmediate').should('have.text', 'Hello again');
    cy.get('#\\/secondvalue').should('have.text', 'Hello again');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_textinput1'].stateValues.immediateValue).eq('Hello again');
      expect(components['/_textinput1'].stateValues.value).eq('Hello again');
      expect(components['/_textinput2'].stateValues.immediateValue).eq('Hello again');
      expect(components['/_textinput2'].stateValues.value).eq('Hello again');
    });


  })

  it('chain update off textinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput name="ti" />

    <text name="h">hello</text>
    <updateValue triggerWithTnames="ti" tname="h" newValue="$h$ti" type="text" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/h').should('have.text', 'hello')

    cy.get('#\\/ti_input').type(" bye")
    cy.get('#\\/h').should('have.text', 'hello')

    cy.get('#\\/ti_input').clear().type(" there")
    cy.get('#\\/h').should('have.text', 'hello')

    cy.get('#\\/ti_input').blur();
    cy.get('#\\/h').should('have.text', 'hello there')

    cy.get('#\\/ti_input').clear().type("?")
    cy.get('#\\/h').should('have.text', 'hello there')

    cy.get('#\\/ti_input').clear().type("!")
    cy.get('#\\/h').should('have.text', 'hello there')

    cy.get('#\\/ti_input').type("{enter}")
    cy.get('#\\/h').should('have.text', 'hello there!')

  })

  it('expanded textinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput name="ti" expanded />

    <p>$ti</p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/ti_input').type("hello")
    cy.get('#\\/ti_input').should('have.value', 'hello')
    cy.get('#\\/_p1').should('have.text', '')


    cy.get('#\\/ti_input').blur();
    cy.get('#\\/ti_input').should('have.value', 'hello')
    cy.get('#\\/_p1').should('have.text', 'hello')

    cy.get('#\\/ti_input').type("{enter}bye{enter}")
    cy.get('#\\/ti_input').should('have.value', 'hello\nbye\n')
    cy.get('#\\/_p1').should('have.text', 'hello\nbye')

    // cy.get('#\\/ti_input').blur();
    // cy.get('#\\/ti_input').should('have.value', 'hello\nbye\n')
    // cy.get('#\\/_p1').should('have.text', 'hello\nbye\n')


    cy.get('#\\/ti_input').type("{ctrl+home}new{enter}old{enter}")
    cy.get('#\\/_p1').should('have.text', 'new\nold\nhello\nbye')


  })

});