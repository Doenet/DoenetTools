describe('Booleaninput Tag Tests',function() {

  beforeEach(() => {
    cy.visit('/test')
  })
  
  it('single boolean input', () => {

    cy.window().then((win) => { win.postMessage({doenetCode: `
    <booleaninput label="hello"/>
    <ref prop="value">_booleaninput1</ref>
    <ref>_ref1</ref>
    `},"*");
    });

    cy.log('Test values displayed in browser')
    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');
    
    // had to include two booleans in order to get it to wait long enough
    // so that the components object, below, was populated
    cy.get('#__boolean1').should('have.text', "false");
    cy.get('#__boolean2').should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__label1.state.value).eq("hello");
    });

    cy.log('check the box')
    cy.get('#\\/_booleaninput1_input').click();

    cy.log('Test values displayed in browser')
    // cy.get('#\\/_booleaninput1_input').should('have.attr', 'checked');
    cy.get('#__boolean1').should('have.text', "true");
    cy.get('#__boolean2').should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(true);
    });

    cy.log('uncheck the box')
    cy.get('#\\/_booleaninput1_input').click();

    cy.log('Test values displayed in browser')
    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');
    cy.get('#__boolean1').should('have.text', "false");
    cy.get('#__boolean2').should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(false);
    });


  })

  it('single boolean input, starts checked', () => {

    cy.window().then((win) => { win.postMessage({doenetCode: `
    <booleaninput prefill="true"/>
    <ref prop="value">_booleaninput1</ref>
    `},"*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#__boolean1').should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(true);
    });

    cy.log('uncheck the box')
    cy.get('#\\/_booleaninput1_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#__boolean1').should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(false);
    });

    cy.log('recheck the box')
    cy.get('#\\/_booleaninput1_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#__boolean1').should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(true);
    });


  })

  it('reffed boolean input', () => {

    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p><booleaninput prefill="t" label="green"/></p>
    <p><ref>_booleaninput1</ref></p>
    <p><ref prop="value">_booleaninput1</ref></p>
    <p><booleaninput label="red" /></p>
    <p><ref prop="value">_booleaninput2</ref></p>
    `},"*");
    });

    cy.get('#__boolean1').should('have.text', "true");
    cy.get('#__boolean2').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['__booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__label1.state.value).eq("green");
      expect(components.__label2.state.value).eq("red");
    });

    cy.log("click the first input");
    cy.get("#\\/_booleaninput1_input").click();
    cy.get('#__boolean1').should('have.text', "false");
    cy.get('#__boolean2').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['__booleaninput1'].state.value).eq(false);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(false);
    });

    cy.log("click the second input");
    cy.get("#__booleaninput1_input").click();
    cy.get('#__boolean1').should('have.text', "true");
    cy.get('#__boolean2').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['__booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(false);
    });


    cy.log("click the third input");
    cy.get("#\\/_booleaninput2_input").click();
    cy.get('#__boolean1').should('have.text', "true");
    cy.get('#__boolean2').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['__booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(true);
    });

  })

  it('downstream from booleaninput', () => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput><ref>_boolean1</ref></booleaninput></p>
    <p>Reffed boolean: <ref>_boolean1</ref></p>
    <p>Reffed boolean input: <ref prop="value">_booleaninput1</ref></p>
    `},"*");
    });

    // cy.get('#\\/_booleaninput1_input').should('have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', 'true');
    cy.get('#\\__boolean2').should('have.text', 'true');
    cy.get('#\\__boolean3').should('have.text', 'true');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['/_boolean1'].state.value).eq(true);
      expect(components['__boolean2'].state.value).eq(true);
      expect(components['__boolean3'].state.value).eq(true);
    });

    cy.log('change value')
    cy.get('#\\/_booleaninput1_input').click();

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', 'false');
    cy.get('#\\__boolean2').should('have.text', 'false');
    cy.get('#\\__boolean3').should('have.text', 'false');


    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_boolean1'].state.value).eq(false);
      expect(components['__boolean2'].state.value).eq(false);
      expect(components['__boolean3'].state.value).eq(false);
    });


    cy.log('prefill ignored');
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput prefill="false"><ref>_boolean1</ref></booleaninput></p>
    `},"*");
    });

    // cy.get('#\\/_booleaninput1_input').should('have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', 'true');


    cy.log("values revert if not updatable")
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p>Original boolean: <boolean>can't <text>update</text> <text>me</text></boolean></p>
    <p>booleaninput based on boolean: <booleaninput><ref>_boolean1</ref></booleaninput></p>
    `},"*");
    });

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', `false`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_boolean1'].state.value).eq(false);
    });

    cy.log('change value, but it reverts')
    cy.get('#\\/_booleaninput1_input').click();

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', `false`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_boolean1'].state.value).eq(false);
    });

  })


});