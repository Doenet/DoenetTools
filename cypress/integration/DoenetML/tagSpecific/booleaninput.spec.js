import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('BooleanInput Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('single boolean input', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput label="hello" name="bi1" />
    <copy prop="value" target="bi1" assignNames="v1" />
    <copy target="_copy1" assignNames="v2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Test values displayed in browser')

    cy.get('#\\/v1').should('have.text', "false");
    cy.get("#\\/v2").should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
      expect(stateVariables['/bi1'].stateValues.label).eq("hello");
    });

    cy.log('check the box')
    cy.get('#\\/bi1_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/v1').should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });

    cy.log('uncheck the box')
    cy.get('#\\/bi1_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/v1').should('have.text', "false");
    cy.get("#\\/v2").should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
    });

  })

  it('single boolean input, starts checked', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput prefill="true"/>
    <copy prop="value" target="_booleaninput1" assignNames="v1" />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Test values displayed in browser')
    cy.get("#\\/v1").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/v1'].stateValues.value).eq(true);
    });

    cy.log('uncheck the box')
    cy.get('#\\/_booleaninput1_input').click();

    cy.log('Test values displayed in browser')
    cy.get("#\\/v1").should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/v1'].stateValues.value).eq(false);
    });

    cy.log('recheck the box')
    cy.get('#\\/_booleaninput1_input').click();

    cy.log('Test values displayed in browser')
    cy.get("#\\/v1").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/v1'].stateValues.value).eq(true);
    });

  })

  it('copied boolean input', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><booleaninput prefill="true" label="green" name="bi1" /></p>
    <p><copy target="bi1" assignNames="bi1a" /></p>
    <p><copy prop="value" target="bi1" assignNames="v1" /></p>
    <p><booleaninput label="red" name="bi2" /></p>
    <p><copy prop="value" target="bi2" assignNames="v2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get("#\\/v1").should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(true);
      expect(stateVariables['/bi1a'].stateValues.value).eq(true);
      expect(stateVariables['/bi2'].stateValues.value).eq(false);
      expect(stateVariables['/v1'].stateValues.value).eq(true);
      expect(stateVariables['/v2'].stateValues.value).eq(false);
      expect(stateVariables['/bi1'].stateValues.label).eq("green");
      expect(stateVariables['/bi2'].stateValues.label).eq("red");
    });

    cy.log("click the first input");
    cy.get("#\\/bi1_input").click();
    cy.get("#\\/v1").should('have.text', "false");
    cy.get("#\\/v2").should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(false);
      expect(stateVariables['/bi1a'].stateValues.value).eq(false);
      expect(stateVariables['/bi2'].stateValues.value).eq(false);
      expect(stateVariables['/v1'].stateValues.value).eq(false);
      expect(stateVariables['/v2'].stateValues.value).eq(false);
    });

    cy.log("click the second input");
    cy.get("#\\/bi1a_input").click();
    cy.get("#\\/v1").should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(true);
      expect(stateVariables['/bi1a'].stateValues.value).eq(true);
      expect(stateVariables['/bi2'].stateValues.value).eq(false);
      expect(stateVariables['/v1'].stateValues.value).eq(true);
      expect(stateVariables['/v2'].stateValues.value).eq(false);
    });


    cy.log("click the third input");
    cy.get("#\\/bi2_input").click();
    cy.get("#\\/v1").should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(true);
      expect(stateVariables['/bi1a'].stateValues.value).eq(true);
      expect(stateVariables['/bi2'].stateValues.value).eq(true);
      expect(stateVariables['/v1'].stateValues.value).eq(true);
      expect(stateVariables['/v2'].stateValues.value).eq(true);
    });

  })

  it('downstream from booleaninput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput bindValueTo="$_boolean1" /></p>
    <p>Copied boolean: <copy target="_boolean1" assignNames="b2" /></p>
    <p>Copied boolean input: <copy prop="value" target="_booleaninput1" assignNames="b3" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get('#\\/_boolean1').should('have.text', 'true');
    cy.get("#\\/b2").should('have.text', 'true');
    cy.get("#\\/b3").should('have.text', 'true');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_boolean1'].stateValues.value).eq(true);
      expect(stateVariables['/b2'].stateValues.value).eq(true);
      expect(stateVariables['/b3'].stateValues.value).eq(true);
    });

    cy.log('change value')
    cy.get('#\\/_booleaninput1_input').click();

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', 'false');
    cy.get("#\\/b2").should('have.text', 'false');
    cy.get("#\\/b3").should('have.text', 'false');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_boolean1'].stateValues.value).eq(false);
      expect(stateVariables['/b2'].stateValues.value).eq(false);
      expect(stateVariables['/b3'].stateValues.value).eq(false);
    });


    cy.log('prefill ignored');
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput prefill="false" bindValueTo="$_boolean1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded


    // cy.get('#\\/_booleaninput1_input').should('have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', 'true');


    cy.log("values revert if not updatable")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <p>Original boolean: <boolean>can't <text>update</text> <text>me</text></boolean></p>
    <p>booleaninput based on boolean: <booleaninput bindValueTo="$_boolean1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'c');  // to wait until loaded

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', `false`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_boolean1'].stateValues.value).eq(false);
    });

    cy.log('change value, but it reverts')
    cy.get('#\\/_booleaninput1_input').click();

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', `false`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_boolean1'].stateValues.value).eq(false);
    });

  })

  it('chain update off booleaninput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput name="bi" />
    <number name="n">1</number>
    <updateValue triggerWithTargets="bi" target="n" newValue="$n+1" type="number" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n').should('have.text', '1')
    cy.get('#\\/bi_input').click();
    cy.get('#\\/n').should('have.text', '2')
    cy.get('#\\/bi_input').click();
    cy.get('#\\/n').should('have.text', '3')

  })

  it('boolean input as toggle button', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><booleanInput name="atb" label="As Toggle" /></p>
    <p><booleanInput name="bi" label="hello" asToggleButton="$atb"/></p>

    <copy prop="value" target="bi" assignNames="v1" />
    <copy target="_copy1" assignNames="v2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Test values displayed in browser')

    cy.get('#\\/atb_input').should('not.be.checked');
    cy.get('#\\/bi_input').should('not.be.checked');
    cy.get('#\\/v1').should('have.text', "false");
    cy.get("#\\/v2").should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(false);
      expect(stateVariables['/bi'].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
      expect(stateVariables['/atb'].stateValues.label).eq("As Toggle");
      expect(stateVariables['/bi'].stateValues.label).eq("hello");
    });

    cy.log('check the box')
    cy.get('#\\/bi_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/atb_input').should('not.be.checked');
    cy.get('#\\/bi_input').should('be.checked');
    cy.get('#\\/v1').should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(false);
      expect(stateVariables['/bi'].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });

    cy.log('set as toggle button')
    cy.get('#\\/atb_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/atb_input').should('be.checked');
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get('#\\/bi_input').should('be.checked');
    cy.get('#\\/v1').should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(true);
      expect(stateVariables['/bi'].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });


    cy.log('turn off via toggle button')
    cy.get('#\\/bi_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/atb_input').should('be.checked');
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get('#\\/bi_input').should('not.be.checked');
    cy.get('#\\/v1').should('have.text', "false");
    cy.get("#\\/v2").should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(true);
      expect(stateVariables['/bi'].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
    });


    cy.log('turn on via toggle button')
    cy.get('#\\/bi_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/atb_input').should('be.checked');
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get('#\\/bi_input').should('be.checked');
    cy.get('#\\/v1').should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(true);
      expect(stateVariables['/bi'].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });

  })

});