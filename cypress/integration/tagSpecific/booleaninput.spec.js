describe('Booleaninput Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('single boolean input', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <booleaninput label="hello"/>
    <ref prop="value">_booleaninput1</ref>
    <ref>_ref1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let boolean1 = components['/_ref1'].replacements[0];
      let boolean1Anchor = '#' + boolean1.componentName;
      let boolean2 = components['/_ref2'].replacements[0].replacements[0];
      let boolean2Anchor = '#' + boolean2.componentName;

      cy.log('Test values displayed in browser')

      cy.get(boolean1Anchor).should('have.text', "false");
      cy.get(boolean2Anchor).should('have.text', "false");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(false);
        expect(boolean2.stateValues.value).eq(false);
        expect(components['/_booleaninput1'].stateValues.label).eq("hello");
      });

      cy.log('check the box')
      cy.get('#\\/_booleaninput1_input').click();

      cy.log('Test values displayed in browser')
      // cy.get('#\\/_booleaninput1_input').should('have.attr', 'checked');
      cy.get(boolean1Anchor).should('have.text', "true");
      cy.get(boolean2Anchor).should('have.text', "true");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(boolean1.stateValues.value).eq(true);
        expect(boolean2.stateValues.value).eq(true);
      });

      cy.log('uncheck the box')
      cy.get('#\\/_booleaninput1_input').click();

      cy.log('Test values displayed in browser')
      // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');
      cy.get(boolean1Anchor).should('have.text', "false");
      cy.get(boolean2Anchor).should('have.text', "false");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(false);
        expect(boolean2.stateValues.value).eq(false);
      });

    })
  })

  it('single boolean input, starts checked', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <booleaninput prefill="true"/>
    <ref prop="value">_booleaninput1</ref>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let boolean1 = components['/_ref1'].replacements[0];
      let boolean1Anchor = '#' + boolean1.componentName;

      cy.log('Test values displayed in browser')
      cy.get(boolean1Anchor).should('have.text', "true");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(boolean1.stateValues.value).eq(true);
      });

      cy.log('uncheck the box')
      cy.get('#\\/_booleaninput1_input').click();

      cy.log('Test values displayed in browser')
      cy.get(boolean1Anchor).should('have.text', "false");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(false);
      });

      cy.log('recheck the box')
      cy.get('#\\/_booleaninput1_input').click();

      cy.log('Test values displayed in browser')
      cy.get(boolean1Anchor).should('have.text', "true");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(boolean1.stateValues.value).eq(true);
      });

    })
  })

  it('reffed boolean input', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <p><booleaninput prefill="t" label="green"/></p>
    <p><ref>_booleaninput1</ref></p>
    <p><ref prop="value">_booleaninput1</ref></p>
    <p><booleaninput label="red" /></p>
    <p><ref prop="value">_booleaninput2</ref></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let booleaninput1a = components['/_ref1'].replacements[0];
      let booleaninput1aAnchor = '#' + booleaninput1a.componentName + "_input";
      let boolean1 = components['/_ref2'].replacements[0];
      let boolean1Anchor = '#' + boolean1.componentName;
      let boolean2 = components['/_ref3'].replacements[0];
      let boolean2Anchor = '#' + boolean2.componentName;

      cy.get(boolean1Anchor).should('have.text', "true");
      cy.get(boolean2Anchor).should('have.text', "false");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(booleaninput1a.stateValues.value).eq(true);
        expect(components['/_booleaninput2'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(true);
        expect(boolean2.stateValues.value).eq(false);
        expect(components['/_booleaninput1'].stateValues.label).eq("green");
        expect(components['/_booleaninput2'].stateValues.label).eq("red");
      });

      cy.log("click the first input");
      cy.get("#\\/_booleaninput1_input").click();
      cy.get(boolean1Anchor).should('have.text', "false");
      cy.get(boolean2Anchor).should('have.text', "false");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleaninput1'].stateValues.value).eq(false);
        expect(booleaninput1a.stateValues.value).eq(false);
        expect(components['/_booleaninput2'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(false);
        expect(boolean2.stateValues.value).eq(false);
      });

      cy.log("click the second input");
      cy.get(booleaninput1aAnchor).click();
      cy.get(boolean1Anchor).should('have.text', "true");
      cy.get(boolean2Anchor).should('have.text', "false");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(booleaninput1a.stateValues.value).eq(true);
        expect(components['/_booleaninput2'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(true);
        expect(boolean2.stateValues.value).eq(false);
      });


      cy.log("click the third input");
      cy.get("#\\/_booleaninput2_input").click();
      cy.get(boolean1Anchor).should('have.text', "true");
      cy.get(boolean2Anchor).should('have.text', "true");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(booleaninput1a.stateValues.value).eq(true);
        expect(components['/_booleaninput2'].stateValues.value).eq(true);
        expect(boolean1.stateValues.value).eq(true);
        expect(boolean2.stateValues.value).eq(true);
      });

    })
  })

  it('downstream from booleaninput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput><ref>_boolean1</ref></booleaninput></p>
    <p>Reffed boolean: <ref>_boolean1</ref></p>
    <p>Reffed boolean input: <ref prop="value">_booleaninput1</ref></p>
    `}, "*");
    });

    // cy.get('#\\/_booleaninput1_input').should('have.attr', 'checked');


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let boolean2 = components['/_ref2'].replacements[0];
      let boolean2Anchor = '#' + boolean2.componentName;
      let boolean3 = components['/_ref3'].replacements[0];
      let boolean3Anchor = '#' + boolean3.componentName;

      cy.get('#\\/_boolean1').should('have.text', 'true');
      cy.get(boolean2Anchor).should('have.text', 'true');
      cy.get(boolean3Anchor).should('have.text', 'true');

      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(components['/_boolean1'].stateValues.value).eq(true);
        expect(boolean2.stateValues.value).eq(true);
        expect(boolean3.stateValues.value).eq(true);
      });

      cy.log('change value')
      cy.get('#\\/_booleaninput1_input').click();

      // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

      cy.get('#\\/_boolean1').should('have.text', 'false');
      cy.get(boolean2Anchor).should('have.text', 'false');
      cy.get(boolean3Anchor).should('have.text', 'false');


      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(false);
        expect(components['/_boolean1'].stateValues.value).eq(false);
        expect(boolean2.stateValues.value).eq(false);
        expect(boolean3.stateValues.value).eq(false);
      });

    });

    cy.log('prefill ignored');
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>b</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput prefill="false"><ref>_boolean1</ref></booleaninput></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded


    // cy.get('#\\/_booleaninput1_input').should('have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', 'true');


    cy.log("values revert if not updatable")
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>c</text>
    <p>Original boolean: <boolean>can't <text>update</text> <text>me</text></boolean></p>
    <p>booleaninput based on boolean: <booleaninput><ref>_boolean1</ref></booleaninput></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'c');  // to wait until loaded

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', `false`);

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_boolean1'].stateValues.value).eq(false);
    });

    cy.log('change value, but it reverts')
    cy.get('#\\/_booleaninput1_input').click();

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', `false`);

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_boolean1'].stateValues.value).eq(false);
    });

  })

});