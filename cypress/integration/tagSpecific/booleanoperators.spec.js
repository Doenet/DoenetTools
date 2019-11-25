describe('Boolean Operator Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('not', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <booleaninput />
    <not><ref prop="value">_booleaninput1</ref></not>
    `}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(false);
      expect(components['/_not1'].state.value).eq(true);
    });

    cy.log('check the box')
    cy.get('#\\/_booleaninput1_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(true);
      expect(components['/_not1'].state.value).eq(false);
    });

  })

  it('and', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <and>
      <ref prop="value">_booleaninput1</ref>
      <ref prop="value">_booleaninput2</ref>
      <ref prop="value">_booleaninput3</ref>
    </and>
    `}, "*");
    });

    cy.log('Test initial values')
    cy.get('#\\/_and1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components['/_booleaninput3'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__boolean3.state.value).eq(false);
      expect(components['/_and1'].state.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_and1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components['/_booleaninput3'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__boolean3.state.value).eq(false);
      expect(components['/_and1'].state.value).eq(false);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_and1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(true);
      expect(components['/_booleaninput3'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(true);
      expect(components.__boolean3.state.value).eq(false);
      expect(components['/_and1'].state.value).eq(false);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_and1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(true);
      expect(components['/_booleaninput3'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(true);
      expect(components.__boolean3.state.value).eq(true);
      expect(components['/_and1'].state.value).eq(true);
    });
  })

  it('or', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <or>
      <ref prop="value">_booleaninput1</ref>
      <ref prop="value">_booleaninput2</ref>
      <ref prop="value">_booleaninput3</ref>
    </or>
    `}, "*");
    });

    cy.log('Test initial values')
    cy.get('#\\/_or1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components['/_booleaninput3'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__boolean3.state.value).eq(false);
      expect(components['/_or1'].state.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components['/_booleaninput3'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__boolean3.state.value).eq(false);
      expect(components['/_or1'].state.value).eq(true);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(true);
      expect(components['/_booleaninput3'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(true);
      expect(components.__boolean3.state.value).eq(false);
      expect(components['/_or1'].state.value).eq(true);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(true);
      expect(components['/_booleaninput3'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(true);
      expect(components.__boolean3.state.value).eq(true);
      expect(components['/_or1'].state.value).eq(true);
    });

    cy.log('uncheck box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_booleaninput2'].state.value).eq(true);
      expect(components['/_booleaninput3'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(true);
      expect(components.__boolean3.state.value).eq(true);
      expect(components['/_or1'].state.value).eq(true);
    });

    cy.log('uncheck box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components['/_booleaninput3'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__boolean3.state.value).eq(true);
      expect(components['/_or1'].state.value).eq(true);
    });

    cy.log('uncheck box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_or1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components['/_booleaninput3'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__boolean3.state.value).eq(false);
      expect(components['/_or1'].state.value).eq(false);
    });

  })

  it('xor', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <xor>
      <ref prop="value">_booleaninput1</ref>
      <ref prop="value">_booleaninput2</ref>
      <ref prop="value">_booleaninput3</ref>
    </xor>
    `}, "*");
    });

    cy.log('Test initial values')
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components['/_booleaninput3'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__boolean3.state.value).eq(false);
      expect(components['/_xor1'].state.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_xor1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components['/_booleaninput3'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__boolean3.state.value).eq(false);
      expect(components['/_xor1'].state.value).eq(true);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(true);
      expect(components['/_booleaninput3'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(true);
      expect(components.__boolean3.state.value).eq(false);
      expect(components['/_xor1'].state.value).eq(false);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['/_booleaninput2'].state.value).eq(true);
      expect(components['/_booleaninput3'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(true);
      expect(components.__boolean2.state.value).eq(true);
      expect(components.__boolean3.state.value).eq(true);
      expect(components['/_xor1'].state.value).eq(false);
    });

    cy.log('uncheck box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_booleaninput2'].state.value).eq(true);
      expect(components['/_booleaninput3'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(true);
      expect(components.__boolean3.state.value).eq(true);
      expect(components['/_xor1'].state.value).eq(false);
    });

    cy.log('uncheck box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_xor1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components['/_booleaninput3'].state.value).eq(true);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__boolean3.state.value).eq(true);
      expect(components['/_xor1'].state.value).eq(true);
    });

    cy.log('uncheck box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_booleaninput2'].state.value).eq(false);
      expect(components['/_booleaninput3'].state.value).eq(false);
      expect(components.__boolean1.state.value).eq(false);
      expect(components.__boolean2.state.value).eq(false);
      expect(components.__boolean3.state.value).eq(false);
      expect(components['/_xor1'].state.value).eq(false);
    });

  })

  it('show point based on logic', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <booleaninput label="show point"/>
    <graph>
      <point><hide><not><ref prop="value">_booleaninput1</ref></not></hide>
       (1,2)
      </point>
    </graph>
    `}, "*");
    });

    cy.get("#\\/_booleaninput1_input")  //wait for page to load
    cy.log('Test initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(false);
      expect(components['/_point1'].state.hide).eq(true);
    });

    cy.log('check box to show point')
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].state.value).eq(true);
      expect(components['/_point1'].state.hide).eq(false);
    });

  })

});