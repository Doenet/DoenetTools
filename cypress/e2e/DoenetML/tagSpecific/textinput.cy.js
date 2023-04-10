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
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })

  it('textinput references', () => {

    // A fairly involved test
    // to check for bugs that have shown up only after multiple manipulations

    // Initial doenet code

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput prefill='hello' name="ti1" />
    <copy target="ti1" assignNames="ti1a" createComponentOfType="textinput" />
    <copy prop='value' target="ti1" assignNames="v1" />
    <copy prop='immediateValue' target="ti1" assignNames="iv1" />
    <copy prop='value' target="ti1a" assignNames="v1a" />
    <copy prop='immediateValue' target="ti1a" assignNames="iv1a" />
    <textinput name="ti2" />
    <copy prop='value' target="ti2" assignNames="v2" />
    <copy prop='immediateValue' target="ti2" assignNames="iv2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'hello');
    cy.get('#\\/ti1a_input').should('have.value', 'hello');
    cy.get('#\\/ti2_input').should('have.value', '');

    cy.get('#\\/v1').should('have.text', 'hello');
    cy.get('#\\/iv1').should('have.text', 'hello');
    cy.get('#\\/v1a').should('have.text', 'hello');
    cy.get('#\\/iv1a').should('have.text', 'hello');
    cy.get('#\\/v2').should('have.text', '');
    cy.get('#\\/iv2').should('have.text', '');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq('hello');
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq('hello');
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq('');
      expect(stateVariables['/ti1'].stateValues.value).eq('hello');
      expect(stateVariables['/ti1a'].stateValues.value).eq('hello');
      expect(stateVariables['/ti2'].stateValues.value).eq('');
    });


    // type 2 in first input

    cy.log("Typing 2 in first textinput");
    cy.get('#\\/ti1_input').type(`2`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'hello2');
    cy.get('#\\/ti1a_input').should('have.value', 'hello2');
    cy.get('#\\/ti2_input').should('have.value', '');

    cy.get('#\\/v1').should('have.text', 'hello');
    cy.get('#\\/iv1').should('have.text', 'hello2');
    cy.get('#\\/v1a').should('have.text', 'hello');
    cy.get('#\\/iv1a').should('have.text', 'hello2');
    cy.get('#\\/v2').should('have.text', '');
    cy.get('#\\/iv2').should('have.text', '');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq('hello2');
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq('hello2');
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq('');
      expect(stateVariables['/ti1'].stateValues.value).eq('hello');
      expect(stateVariables['/ti1a'].stateValues.value).eq('hello');
      expect(stateVariables['/ti2'].stateValues.value).eq('');
    });


    // press enter in first input

    cy.log("Pressing Enter in first textinput");
    cy.get('#\\/ti1_input').type(`{enter}`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'hello2');
    cy.get('#\\/ti1a_input').should('have.value', 'hello2');
    cy.get('#\\/ti2_input').should('have.value', '');

    cy.get('#\\/v1').should('have.text', 'hello2');
    cy.get('#\\/iv1').should('have.text', 'hello2');
    cy.get('#\\/v1a').should('have.text', 'hello2');
    cy.get('#\\/iv1a').should('have.text', 'hello2');
    cy.get('#\\/v2').should('have.text', '');
    cy.get('#\\/iv2').should('have.text', '');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq('hello2');
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq('hello2');
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq('');
      expect(stateVariables['/ti1'].stateValues.value).eq('hello2');
      expect(stateVariables['/ti1a'].stateValues.value).eq('hello2');
      expect(stateVariables['/ti2'].stateValues.value).eq('');
    });


    // erase "2" and type " you" in second input

    cy.log(`Erasing "2" and typing " you" in second textinput`);
    cy.get('#\\/ti1a_input').type(`{backspace} you`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'hello you');
    cy.get('#\\/ti1a_input').should('have.value', 'hello you');
    cy.get('#\\/ti2_input').should('have.value', '');

    cy.get('#\\/v1').should('have.text', 'hello2');
    cy.get('#\\/iv1').should('have.text', 'hello you');
    cy.get('#\\/v1a').should('have.text', 'hello2');
    cy.get('#\\/iv1a').should('have.text', 'hello you');
    cy.get('#\\/v2').should('have.text', '');
    cy.get('#\\/iv2').should('have.text', '');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("hello you");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("hello you");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq('');
      expect(stateVariables['/ti1'].stateValues.value).eq("hello2");
      expect(stateVariables['/ti1a'].stateValues.value).eq("hello2");
      expect(stateVariables['/ti2'].stateValues.value).eq('');
    });


    // change focus to textinput 1
    cy.log("Changing focus to first textinput");
    cy.get('#\\/ti1_input').focus();

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'hello you');
    cy.get('#\\/ti1a_input').should('have.value', 'hello you');
    cy.get('#\\/ti2_input').should('have.value', '');

    cy.get('#\\/v1').should('have.text', 'hello you');
    cy.get('#\\/iv1').should('have.text', 'hello you');
    cy.get('#\\/v1a').should('have.text', 'hello you');
    cy.get('#\\/iv1a').should('have.text', 'hello you');
    cy.get('#\\/v2').should('have.text', '');
    cy.get('#\\/iv2').should('have.text', '');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("hello you");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("hello you");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq('');
      expect(stateVariables['/ti1'].stateValues.value).eq("hello you");
      expect(stateVariables['/ti1a'].stateValues.value).eq("hello you");
      expect(stateVariables['/ti2'].stateValues.value).eq('');
    });


    // bye in third input

    cy.log(`Typing "bye" in third textinput`);
    cy.get('#\\/ti2_input').type(`bye`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'hello you');
    cy.get('#\\/ti1a_input').should('have.value', 'hello you');
    cy.get('#\\/ti2_input').should('have.value', 'bye');

    cy.get('#\\/v1').should('have.text', 'hello you');
    cy.get('#\\/iv1').should('have.text', 'hello you');
    cy.get('#\\/v1a').should('have.text', 'hello you');
    cy.get('#\\/iv1a').should('have.text', 'hello you');
    cy.get('#\\/v2').should('have.text', '');
    cy.get('#\\/iv2').should('have.text', 'bye');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("hello you");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("hello you");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq('bye');
      expect(stateVariables['/ti1'].stateValues.value).eq("hello you");
      expect(stateVariables['/ti1a'].stateValues.value).eq("hello you");
      expect(stateVariables['/ti2'].stateValues.value).eq('');
    });



    // press enter in textinput 3

    cy.log("Pressing enter in third textinput");
    cy.get('#\\/ti2_input').type(`{enter}`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'hello you');
    cy.get('#\\/ti1a_input').should('have.value', 'hello you');
    cy.get('#\\/ti2_input').should('have.value', 'bye');

    cy.get('#\\/v1').should('have.text', 'hello you');
    cy.get('#\\/iv1').should('have.text', 'hello you');
    cy.get('#\\/v1a').should('have.text', 'hello you');
    cy.get('#\\/iv1a').should('have.text', 'hello you');
    cy.get('#\\/v2').should('have.text', 'bye');
    cy.get('#\\/iv2').should('have.text', 'bye');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("hello you");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("hello you");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("bye");
      expect(stateVariables['/ti1'].stateValues.value).eq("hello you");
      expect(stateVariables['/ti1a'].stateValues.value).eq("hello you");
      expect(stateVariables['/ti2'].stateValues.value).eq("bye");
    });


    // type abc enter in textinput 2

    cy.log("Typing abc in second textinput");
    cy.get('#\\/ti1a_input').clear().type(`abc`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'abc');
    cy.get('#\\/ti1a_input').should('have.value', 'abc');
    cy.get('#\\/ti2_input').should('have.value', 'bye');

    cy.get('#\\/v1').should('have.text', 'hello you');
    cy.get('#\\/iv1').should('have.text', 'abc');
    cy.get('#\\/v1a').should('have.text', 'hello you');
    cy.get('#\\/iv1a').should('have.text', 'abc');
    cy.get('#\\/v2').should('have.text', 'bye');
    cy.get('#\\/iv2').should('have.text', 'bye');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("abc");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("abc");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("bye");
      expect(stateVariables['/ti1'].stateValues.value).eq("hello you");
      expect(stateVariables['/ti1a'].stateValues.value).eq("hello you");
      expect(stateVariables['/ti2'].stateValues.value).eq("bye");
    });


    // press enter in textinput 2

    cy.log("Pressing enter in second textinput");
    cy.get('#\\/ti1a_input').type(`{enter}`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'abc');
    cy.get('#\\/ti1a_input').should('have.value', 'abc');
    cy.get('#\\/ti2_input').should('have.value', 'bye');

    cy.get('#\\/v1').should('have.text', 'abc');
    cy.get('#\\/iv1').should('have.text', 'abc');
    cy.get('#\\/v1a').should('have.text', 'abc');
    cy.get('#\\/iv1a').should('have.text', 'abc');
    cy.get('#\\/v2').should('have.text', 'bye');
    cy.get('#\\/iv2').should('have.text', 'bye');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("abc");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("abc");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("bye");
      expect(stateVariables['/ti1'].stateValues.value).eq("abc");
      expect(stateVariables['/ti1a'].stateValues.value).eq("abc");
      expect(stateVariables['/ti2'].stateValues.value).eq("bye");
    });

    // type abc in textinput 1

    cy.log("Typing abc in first textinput");
    cy.get('#\\/ti1_input').clear().type(`abc`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'abc');
    cy.get('#\\/ti1a_input').should('have.value', 'abc');
    cy.get('#\\/ti2_input').should('have.value', 'bye');

    cy.get('#\\/v1').should('have.text', 'abc');
    cy.get('#\\/iv1').should('have.text', 'abc');
    cy.get('#\\/v1a').should('have.text', 'abc');
    cy.get('#\\/iv1a').should('have.text', 'abc');
    cy.get('#\\/v2').should('have.text', 'bye');
    cy.get('#\\/iv2').should('have.text', 'bye');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("abc");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("abc");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("bye");
      expect(stateVariables['/ti1'].stateValues.value).eq("abc");
      expect(stateVariables['/ti1a'].stateValues.value).eq("abc");
      expect(stateVariables['/ti2'].stateValues.value).eq("bye");
    });


    // type saludos in textinput 3

    cy.log("Typing saludos in third textinput");
    cy.get('#\\/ti2_input').clear().type(`saludos`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'abc');
    cy.get('#\\/ti1a_input').should('have.value', 'abc');
    cy.get('#\\/ti2_input').should('have.value', 'saludos');

    cy.get('#\\/v1').should('have.text', 'abc');
    cy.get('#\\/iv1').should('have.text', 'abc');
    cy.get('#\\/v1a').should('have.text', 'abc');
    cy.get('#\\/iv1a').should('have.text', 'abc');
    cy.get('#\\/v2').should('have.text', 'bye');
    cy.get('#\\/iv2').should('have.text', 'saludos');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("abc");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("abc");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("saludos");
      expect(stateVariables['/ti1'].stateValues.value).eq("abc");
      expect(stateVariables['/ti1a'].stateValues.value).eq("abc");
      expect(stateVariables['/ti2'].stateValues.value).eq("bye");
    });


    // type d in textinput 1

    cy.log("Typing d in first textinput");
    cy.get('#\\/ti1_input').type(`d`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'abcd');
    cy.get('#\\/ti1a_input').should('have.value', 'abcd');
    cy.get('#\\/ti2_input').should('have.value', 'saludos');

    cy.get('#\\/v1').should('have.text', 'abc');
    cy.get('#\\/iv1').should('have.text', 'abcd');
    cy.get('#\\/v1a').should('have.text', 'abc');
    cy.get('#\\/iv1a').should('have.text', 'abcd');
    cy.get('#\\/v2').should('have.text', 'saludos');
    cy.get('#\\/iv2').should('have.text', 'saludos');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("abcd");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("abcd");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("saludos");
      expect(stateVariables['/ti1'].stateValues.value).eq("abc");
      expect(stateVariables['/ti1a'].stateValues.value).eq("abc");
      expect(stateVariables['/ti2'].stateValues.value).eq("saludos");
    });


    cy.log("Typing enter in first textinput");
    cy.get('#\\/ti1_input').type(`{enter}`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'abcd');
    cy.get('#\\/ti1a_input').should('have.value', 'abcd');
    cy.get('#\\/ti2_input').should('have.value', 'saludos');

    cy.get('#\\/v1').should('have.text', 'abcd');
    cy.get('#\\/iv1').should('have.text', 'abcd');
    cy.get('#\\/v1a').should('have.text', 'abcd');
    cy.get('#\\/iv1a').should('have.text', 'abcd');
    cy.get('#\\/v2').should('have.text', 'saludos');
    cy.get('#\\/iv2').should('have.text', 'saludos');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("abcd");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("abcd");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("saludos");
      expect(stateVariables['/ti1'].stateValues.value).eq("abcd");
      expect(stateVariables['/ti1a'].stateValues.value).eq("abcd");
      expect(stateVariables['/ti2'].stateValues.value).eq("saludos");
    });


    cy.log("Clearing second textinput");
    cy.get('#\\/ti1a_input').clear();

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', '');
    cy.get('#\\/ti1a_input').should('have.value', '');
    cy.get('#\\/ti2_input').should('have.value', 'saludos');

    cy.get('#\\/v1').should('have.text', 'abcd');
    cy.get('#\\/iv1').should('have.text', '');
    cy.get('#\\/v1a').should('have.text', 'abcd');
    cy.get('#\\/iv1a').should('have.text', '');
    cy.get('#\\/v2').should('have.text', 'saludos');
    cy.get('#\\/iv2').should('have.text', 'saludos');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("saludos");
      expect(stateVariables['/ti1'].stateValues.value).eq("abcd");
      expect(stateVariables['/ti1a'].stateValues.value).eq("abcd");
      expect(stateVariables['/ti2'].stateValues.value).eq("saludos");
    });

    cy.log("pressing escape to undo")
    cy.get('#\\/ti1a_input').type(`{esc}`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'abcd');
    cy.get('#\\/ti1a_input').should('have.value', 'abcd');
    cy.get('#\\/ti2_input').should('have.value', 'saludos');

    cy.get('#\\/v1').should('have.text', 'abcd');
    cy.get('#\\/iv1').should('have.text', 'abcd');
    cy.get('#\\/v1a').should('have.text', 'abcd');
    cy.get('#\\/iv1a').should('have.text', 'abcd');
    cy.get('#\\/v2').should('have.text', 'saludos');
    cy.get('#\\/iv2').should('have.text', 'saludos');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("abcd");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("abcd");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("saludos");
      expect(stateVariables['/ti1'].stateValues.value).eq("abcd");
      expect(stateVariables['/ti1a'].stateValues.value).eq("abcd");
      expect(stateVariables['/ti2'].stateValues.value).eq("saludos");
    });

    cy.log("Type e in second textinput");
    cy.get('#\\/ti1a_input').type(`e`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'abcde');
    cy.get('#\\/ti1a_input').should('have.value', 'abcde');
    cy.get('#\\/ti2_input').should('have.value', 'saludos');

    cy.get('#\\/v1').should('have.text', 'abcd');
    cy.get('#\\/iv1').should('have.text', 'abcde');
    cy.get('#\\/v1a').should('have.text', 'abcd');
    cy.get('#\\/iv1a').should('have.text', 'abcde');
    cy.get('#\\/v2').should('have.text', 'saludos');
    cy.get('#\\/iv2').should('have.text', 'saludos');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("abcde");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("abcde");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("saludos");
      expect(stateVariables['/ti1'].stateValues.value).eq("abcd");
      expect(stateVariables['/ti1a'].stateValues.value).eq("abcd");
      expect(stateVariables['/ti2'].stateValues.value).eq("saludos");
    });


    cy.log("Escape in first input doesn't undo");
    cy.get('#\\/ti1_input').type(`{Esc}`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'abcde');
    cy.get('#\\/ti1a_input').should('have.value', 'abcde');
    cy.get('#\\/ti2_input').should('have.value', 'saludos');

    cy.get('#\\/v1').should('have.text', 'abcde');
    cy.get('#\\/iv1').should('have.text', 'abcde');
    cy.get('#\\/v1a').should('have.text', 'abcde');
    cy.get('#\\/iv1a').should('have.text', 'abcde');
    cy.get('#\\/v2').should('have.text', 'saludos');
    cy.get('#\\/iv2').should('have.text', 'saludos');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("abcde");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("abcde");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("saludos");
      expect(stateVariables['/ti1'].stateValues.value).eq("abcde");
      expect(stateVariables['/ti1a'].stateValues.value).eq("abcde");
      expect(stateVariables['/ti2'].stateValues.value).eq("saludos");
    });


    cy.log("Delete characters and replace in first input");
    cy.get('#\\/ti1_input').type(`{backspace}{backspace}f`);


    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'abcf');
    cy.get('#\\/ti1a_input').should('have.value', 'abcf');
    cy.get('#\\/ti2_input').should('have.value', 'saludos');

    cy.get('#\\/v1').should('have.text', 'abcde');
    cy.get('#\\/iv1').should('have.text', 'abcf');
    cy.get('#\\/v1a').should('have.text', 'abcde');
    cy.get('#\\/iv1a').should('have.text', 'abcf');
    cy.get('#\\/v2').should('have.text', 'saludos');
    cy.get('#\\/iv2').should('have.text', 'saludos');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("abcf");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("abcf");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("saludos");
      expect(stateVariables['/ti1'].stateValues.value).eq("abcde");
      expect(stateVariables['/ti1a'].stateValues.value).eq("abcde");
      expect(stateVariables['/ti2'].stateValues.value).eq("saludos");
    });


    cy.log("Undo with escape");
    cy.get('#\\/ti1_input').type(`{Esc}`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/ti1_input').should('have.value', 'abcde');
    cy.get('#\\/ti1a_input').should('have.value', 'abcde');
    cy.get('#\\/ti2_input').should('have.value', 'saludos');

    cy.get('#\\/v1').should('have.text', 'abcde');
    cy.get('#\\/iv1').should('have.text', 'abcde');
    cy.get('#\\/v1a').should('have.text', 'abcde');
    cy.get('#\\/iv1a').should('have.text', 'abcde');
    cy.get('#\\/v2').should('have.text', 'saludos');
    cy.get('#\\/iv2').should('have.text', 'saludos');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ti1'].stateValues.immediateValue).eq("abcde");
      expect(stateVariables['/ti1a'].stateValues.immediateValue).eq("abcde");
      expect(stateVariables['/ti2'].stateValues.immediateValue).eq("saludos");
      expect(stateVariables['/ti1'].stateValues.value).eq("abcde");
      expect(stateVariables['/ti1a'].stateValues.value).eq("abcde");
      expect(stateVariables['/ti2'].stateValues.value).eq("saludos");
    });

  })

  it('downstream from textinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>Original text: <text>hello there</text></p>
    <p>textinput based on text: <textinput bindValueTo="$_text1" /></p>
    <p>Copied textinput: <textInput copySource="_textinput1" name="textinput2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'hello there');

    cy.get('#\\/_textinput1_input').should('have.value', 'hello there');
    cy.get('#\\/textinput2_input').should('have.value', 'hello there');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.value).eq('hello there');
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('hello there');
      expect(stateVariables['/_text1'].stateValues.value).eq('hello there');
      expect(stateVariables['/textinput2'].stateValues.value).eq('hello there');
      expect(stateVariables['/textinput2'].stateValues.immediateValue).eq('hello there');
    });

    cy.log('enter new values')
    cy.get('#\\/_textinput1_input').clear().type(`bye now{enter}`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/textinput2_input').should('have.value', 'bye now');

    cy.get('#\\/_text1').should('have.text', 'bye now');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.value).eq('bye now');
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(stateVariables['/_text1'].stateValues.value).eq('bye now');
      expect(stateVariables['/textinput2'].stateValues.value).eq('bye now');
      expect(stateVariables['/textinput2'].stateValues.immediateValue).eq('bye now');
    });


    cy.log('prefill ignored');
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>Original text: <text>hello there</text></p>
    <p>textinput based on text: <textinput prefill="bye now" bindValueTo="$_text1" /></p>
    `}, "*");
    });

    cy.get('#\\/_textinput1_input').should('have.value', 'hello there');

    cy.get('#\\/_text1').should('have.text', 'hello there');


    cy.log("values revert if not updatable")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>Original text: <text>can't <text>update</text> <text>me</text></text></p>
    <p>textinput based on text: <textinput bindValueTo="$_text1" /></p>
    <p>immediate value: <copy prop="immediateValue" target="_textinput1" assignNames="iv" /></p>
    `}, "*");
    });

    cy.get('#\\/_textinput1_input').should('have.value', `can't update me`);

    cy.get('#\\/_text1').should('have.text', `can't update me`);

    cy.get('#\\/iv').should('have.text', `can't update me`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.value).eq(`can't update me`);
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq(`can't update me`);
      expect(stateVariables['/_text1'].stateValues.value).eq(`can't update me`);
    });

    cy.log('enter new values')
    cy.get('#\\/_textinput1_input').clear().type(`disappear`);

    cy.get('#\\/_textinput1_input').should('have.value', `disappear`);

    cy.get('#\\/_text1').should('have.text', `can't update me`);

    cy.get('#\\/iv').should('have.text', `disappear`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.value).eq(`can't update me`);
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq(`disappear`);
      expect(stateVariables['/_text1'].stateValues.value).eq(`can't update me`);
    });

    cy.log('values revert when press enter')
    cy.get('#\\/_textinput1_input').type(`{enter}`);

    cy.get('#\\/_textinput1_input').should('have.value', `can't update me`);

    cy.get('#\\/_text1').should('have.text', `can't update me`);

    cy.get('#\\/iv').should('have.text', `can't update me`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.value).eq(`can't update me`);
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq(`can't update me`);
      expect(stateVariables['/_text1'].stateValues.value).eq(`can't update me`);
    });

  })

  it('textinput based on value of textinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>Original textinput: <textinput prefill="hello there"/></p>
    <p>textinput based on textinput: <textinput bindValueTo="$_textinput1" /></p>
    <p>Immediate value of original: <text name="originalimmediate"><copy prop="immediateValue" target="_textinput1"/></text></p>
    <p>Value of original: <text name="originalvalue"><copy prop="value" target="_textinput1"/></text></p>
    <p>Immediate value of second: <text name="secondimmediate"><copy prop="immediateValue" target="_textinput2"/></text></p>
    <p>Value of second: <text name="secondvalue"><copy prop="value" target="_textinput2"/></text></p>
    `}, "*");
    });

    cy.get('#\\/_textinput1_input').should('have.value', 'hello there');
    cy.get('#\\/_textinput2_input').should('have.value', 'hello there');

    cy.get('#\\/originalimmediate').should('have.text', 'hello there');
    cy.get('#\\/originalvalue').should('have.text', 'hello there');
    cy.get('#\\/secondimmediate').should('have.text', 'hello there');
    cy.get('#\\/secondvalue').should('have.text', 'hello there');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('hello there');
      expect(stateVariables['/_textinput1'].stateValues.value).eq('hello there');
      expect(stateVariables['/_textinput2'].stateValues.immediateValue).eq('hello there');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('hello there');
    });

    cy.log('type new values in first textinput')
    cy.get('#\\/_textinput1_input').clear().type(`bye now`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'hello there');

    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'hello there');
    cy.get('#\\/secondimmediate').should('have.text', 'hello there');
    cy.get('#\\/secondvalue').should('have.text', 'hello there');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(stateVariables['/_textinput1'].stateValues.value).eq('hello there');
      expect(stateVariables['/_textinput2'].stateValues.immediateValue).eq('hello there');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('hello there');
    });

    cy.log('press enter')
    cy.get('#\\/_textinput1_input').type(`{enter}`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'bye now');

    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'bye now');
    cy.get('#\\/secondimmediate').should('have.text', 'bye now');
    cy.get('#\\/secondvalue').should('have.text', 'bye now');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(stateVariables['/_textinput1'].stateValues.value).eq('bye now');
      expect(stateVariables['/_textinput2'].stateValues.immediateValue).eq('bye now');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('bye now');
    });


    cy.log('type values input second textinput')
    cy.get('#\\/_textinput2_input').clear().type(`Hello again`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'Hello again');

    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'bye now');
    cy.get('#\\/secondimmediate').should('have.text', 'Hello again');
    cy.get('#\\/secondvalue').should('have.text', 'bye now');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(stateVariables['/_textinput1'].stateValues.value).eq('bye now');
      expect(stateVariables['/_textinput2'].stateValues.immediateValue).eq('Hello again');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('bye now');
    });



    cy.log('leave second textinput')
    cy.get('#\\/_textinput2_input').blur();

    cy.get('#\\/_textinput1_input').should('have.value', 'Hello again');
    cy.get('#\\/_textinput2_input').should('have.value', 'Hello again');

    cy.get('#\\/originalimmediate').should('have.text', 'Hello again');
    cy.get('#\\/originalvalue').should('have.text', 'Hello again');
    cy.get('#\\/secondimmediate').should('have.text', 'Hello again');
    cy.get('#\\/secondvalue').should('have.text', 'Hello again');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('Hello again');
      expect(stateVariables['/_textinput1'].stateValues.value).eq('Hello again');
      expect(stateVariables['/_textinput2'].stateValues.immediateValue).eq('Hello again');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('Hello again');
    });


  })

  it('textinput based on immediateValue of textinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>Original textinput: <textinput prefill="hello there"/></p>
    <p>textinput based on textinput: <textinput bindValueTo="$(_textinput1.immediateValue)" /></p>
    <p>Immediate value of original: <text name="originalimmediate"><copy prop="immediateValue" target="_textinput1"/></text></p>
    <p>Value of original: <text name="originalvalue"><copy prop="value" target="_textinput1"/></text></p>
    <p>Immediate value of second: <text name="secondimmediate"><copy prop="immediateValue" target="_textinput2"/></text></p>
    <p>Value of second: <text name="secondvalue"><copy prop="value" target="_textinput2"/></text></p>

    `}, "*");
    });

    cy.get('#\\/_textinput1_input').should('have.value', 'hello there');
    cy.get('#\\/_textinput2_input').should('have.value', 'hello there');
    cy.get('#\\/originalimmediate').should('have.text', 'hello there');
    cy.get('#\\/originalvalue').should('have.text', 'hello there');
    cy.get('#\\/secondimmediate').should('have.text', 'hello there');
    cy.get('#\\/secondvalue').should('have.text', 'hello there');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('hello there');
      expect(stateVariables['/_textinput1'].stateValues.value).eq('hello there');
      expect(stateVariables['/_textinput2'].stateValues.immediateValue).eq('hello there');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('hello there');
    });

    cy.log('type new values in first textinput')
    cy.get('#\\/_textinput1_input').clear().type(`bye now`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'bye now');
    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'hello there');
    cy.get('#\\/secondimmediate').should('have.text', 'bye now');
    cy.get('#\\/secondvalue').should('have.text', 'bye now');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(stateVariables['/_textinput1'].stateValues.value).eq('hello there');
      expect(stateVariables['/_textinput2'].stateValues.immediateValue).eq('bye now');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('bye now');
    });

    cy.log('press enter')
    cy.get('#\\/_textinput1_input').type(`{enter}`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'bye now');
    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'bye now');
    cy.get('#\\/secondimmediate').should('have.text', 'bye now');
    cy.get('#\\/secondvalue').should('have.text', 'bye now');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(stateVariables['/_textinput1'].stateValues.value).eq('bye now');
      expect(stateVariables['/_textinput2'].stateValues.immediateValue).eq('bye now');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('bye now');
    });


    cy.log('type values in second textinput')
    cy.get('#\\/_textinput2_input').clear().type(`Hello again`);

    cy.get('#\\/_textinput1_input').should('have.value', 'bye now');
    cy.get('#\\/_textinput2_input').should('have.value', 'Hello again');
    cy.get('#\\/originalimmediate').should('have.text', 'bye now');
    cy.get('#\\/originalvalue').should('have.text', 'bye now');
    cy.get('#\\/secondimmediate').should('have.text', 'Hello again');
    cy.get('#\\/secondvalue').should('have.text', 'bye now');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('bye now');
      expect(stateVariables['/_textinput1'].stateValues.value).eq('bye now');
      expect(stateVariables['/_textinput2'].stateValues.immediateValue).eq('Hello again');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('bye now');
    });

    cy.log('leave second textinput, changes all values')
    cy.get('#\\/_textinput2_input').blur();

    cy.get('#\\/_textinput1_input').should('have.value', 'Hello again');
    cy.get('#\\/_textinput2_input').should('have.value', 'Hello again');
    cy.get('#\\/originalimmediate').should('have.text', 'Hello again');
    cy.get('#\\/originalvalue').should('have.text', 'Hello again');
    cy.get('#\\/secondimmediate').should('have.text', 'Hello again');
    cy.get('#\\/secondvalue').should('have.text', 'Hello again');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_textinput1'].stateValues.immediateValue).eq('Hello again');
      expect(stateVariables['/_textinput1'].stateValues.value).eq('Hello again');
      expect(stateVariables['/_textinput2'].stateValues.immediateValue).eq('Hello again');
      expect(stateVariables['/_textinput2'].stateValues.value).eq('Hello again');
    });


  })

  it('chain update off textinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput name="ti" />
    <copy prop="immediateValue" target="ti" assignNames="iv" />

    <text name="h">hello</text>
    <updateValue triggerWith="ti" target="h" newValue="$h$ti" type="text" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/h').should('have.text', 'hello')

    cy.get('#\\/ti_input').type(" bye")
    cy.get('#\\/iv').should('have.text', ' bye')
    cy.get('#\\/h').should('have.text', 'hello')

    cy.get('#\\/ti_input').clear().type(" there")
    cy.get('#\\/iv').should('have.text', ' there')
    cy.get('#\\/h').should('have.text', 'hello')

    cy.get('#\\/ti_input').blur();
    cy.get('#\\/iv').should('have.text', ' there')
    cy.get('#\\/h').should('have.text', 'hello there')

    cy.get('#\\/ti_input').clear().type("?")
    cy.get('#\\/iv').should('have.text', '?')
    cy.get('#\\/h').should('have.text', 'hello there')

    cy.get('#\\/ti_input').clear().type("!")
    cy.get('#\\/iv').should('have.text', '!')
    cy.get('#\\/h').should('have.text', 'hello there')

    cy.get('#\\/ti_input').type("{enter}")
    cy.get('#\\/iv').should('have.text', '!')
    cy.get('#\\/h').should('have.text', 'hello there!')

  })

  it('expanded textinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput name="ti" expanded />

    <p>$ti</p>
    <p>$(ti.immediateValue)</p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/ti_input').type("hello")
    cy.get('#\\/ti_input').should('have.value', 'hello')
    cy.get('#\\/_p2').should('have.text', 'hello')
    cy.get('#\\/_p1').should('have.text', '')


    cy.get('#\\/ti_input').blur();
    cy.get('#\\/ti_input').should('have.value', 'hello')
    cy.get('#\\/_p2').should('have.text', 'hello')
    cy.get('#\\/_p1').should('have.text', 'hello')

    cy.get('#\\/ti_input').type("{enter}bye{enter}")
    cy.get('#\\/ti_input').should('have.value', 'hello\nbye\n')
    cy.get('#\\/_p2').should('have.text', 'hello\nbye\n')
    cy.get('#\\/_p1').should('have.text', 'hello\nbye')

    cy.get('#\\/ti_input').blur();
    cy.get('#\\/ti_input').should('have.value', 'hello\nbye\n')
    cy.get('#\\/_p2').should('have.text', 'hello\nbye\n')
    cy.get('#\\/_p1').should('have.text', 'hello\nbye\n')

    cy.get('#\\/ti_input').type("{moveToStart}new{enter}old{enter}")
    cy.get('#\\/ti_input').should('have.value', 'new\nold\nhello\nbye\n')
    cy.get('#\\/_p2').should('have.text', 'new\nold\nhello\nbye\n')
    cy.get('#\\/_p1').should('have.text', 'new\noldhello\nbye\n')

    cy.get('#\\/ti_input').blur();
    cy.get('#\\/ti_input').should('have.value', 'new\nold\nhello\nbye\n')
    cy.get('#\\/_p2').should('have.text', 'new\nold\nhello\nbye\n')
    cy.get('#\\/_p1').should('have.text', 'new\nold\nhello\nbye\n')


  })

  it('set value from immediateValue on reload', () => {
    let doenetML = `
    <p><textinput name="ti" /></p>

    <p name="pv">value: $ti</p>
    <p name="piv">immediate value: $ti.immediateValue</p>
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


    cy.get('#\\/ti_input').type("hello", { force: true });

    cy.get('#\\/piv').should('have.text', 'immediate value: hello')
    cy.get('#\\/pv').should('have.text', 'value: ')

    cy.wait(1500);  // wait for debounce


    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });



    cy.get('#\\/pv').should('have.text', 'value: hello')
    cy.get('#\\/piv').should('have.text', 'immediate value: hello')

  });

  it('text input in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>n: <number name="n">1</number></p>
    <graph >
      <textinput anchor="$anchorCoords1" name="textinput1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1"><label>input 1</label></textinput>
      <textinput name="textinput2"><label>input 2</label></textinput>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $textinput1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $textinput2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$textinput2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $textinput1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $textinput2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceinput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p>Change position from anchor 2
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$textinput2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$textinput2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$textinput2.disabled" /></p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    ` }, "*");
    });

    // TODO: how to click on the checkboxes and test if they are disabled?

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(1,3)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(0,0)')

    cy.get("#\\/pPositionFromAnchor1").should('have.text', 'Position from anchor 1: upperright')
    cy.get("#\\/pPositionFromAnchor2").should('have.text', 'Position from anchor 2: center')
    cy.get("#\\/positionFromAnchor1").should('have.value', '1')
    cy.get("#\\/positionFromAnchor2").should('have.value', '9')
    cy.get("#\\/pDraggable1").should('have.text', 'Draggable 1: true')
    cy.get("#\\/pDraggable2").should('have.text', 'Draggable 2: true')


    cy.log("move textinputs by dragging")

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput1",
        args: { x: -2, y: 3 }
      })
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput2",
        args: { x: 4, y: -5 }
      })
    })

    cy.get('#\\/pAnchor2 .mjx-mrow').should('contain.text', '(4,−5)')

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(−2,3)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(4,−5)')


    cy.log("move textinputs by entering coordinates")

    cy.get('#\\/anchorCoords1 textarea').type("{home}{shift+end}{backspace}(6,7){enter}", { force: true })
    cy.get('#\\/anchorCoords2 textarea').type("{home}{shift+end}{backspace}(8,9){enter}", { force: true })

    cy.get('#\\/pAnchor2 .mjx-mrow').should('contain.text', '(8,9)')

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(8,9)')


    cy.log('change position from anchor');
    cy.get('#\\/positionFromAnchor1').select("lowerLeft")
    cy.get('#\\/positionFromAnchor2').select("lowerRight")

    cy.get("#\\/pPositionFromAnchor1").should('have.text', 'Position from anchor 1: lowerleft')
    cy.get("#\\/pPositionFromAnchor2").should('have.text', 'Position from anchor 2: lowerright')


    cy.log('make not draggable')

    cy.get('#\\/draggable1').click();
    cy.get('#\\/draggable2').click();
    cy.get("#\\/pDraggable1").should('have.text', 'Draggable 1: false')
    cy.get("#\\/pDraggable2").should('have.text', 'Draggable 2: false')


    cy.log('cannot move textinputs by dragging')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput1",
        args: { x: -10, y: -9 }
      })
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput2",
        args: { x: -8, y: -7 }
      })
    })

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get("#\\/bi").click();
    cy.get("#\\/b").should('have.text', 'true');

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(8,9)')



  })

});