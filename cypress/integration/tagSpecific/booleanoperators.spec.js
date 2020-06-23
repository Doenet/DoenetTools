describe('Boolean Operator Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('not', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <booleaninput />
    <not><copy prop="value" tname="_booleaninput1" /></not>
    `}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components['/_not1'].stateValues.value).eq(true);
    });

    cy.log('check the box')
    cy.get('#\\/_booleaninput1_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components['/_not1'].stateValues.value).eq(false);
    });

  })

  it('and', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <and>
      <copy prop="value" tname="_booleaninput1" />
      <copy prop="value" tname="_booleaninput2" />
      <copy prop="value" tname="_booleaninput3" />
    </and>
    `}, "*");
    });

    cy.log('Test initial values')
    cy.get('#\\/_and1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_and1'].stateValues.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_and1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_and1'].stateValues.value).eq(false);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_and1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_and1'].stateValues.value).eq(false);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_and1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_and1'].stateValues.value).eq(true);
    });
  })

  it('or', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <or>
      <copy prop="value" tname="_booleaninput1" />
      <copy prop="value" tname="_booleaninput2" />
      <copy prop="value" tname="_booleaninput3" />
    </or>
    `}, "*");
    });

    cy.log('Test initial values')
    cy.get('#\\/_or1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_or1'].stateValues.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_or1'].stateValues.value).eq(true);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_or1'].stateValues.value).eq(true);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_or1'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_or1'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_or1'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_or1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_or1'].stateValues.value).eq(false);
    });

  })

  it('xor', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <xor>
      <copy prop="value" tname="_booleaninput1" />
      <copy prop="value" tname="_booleaninput2" />
      <copy prop="value" tname="_booleaninput3" />
    </xor>
    `}, "*");
    });

    cy.log('Test initial values')
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_xor1'].stateValues.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_xor1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_xor1'].stateValues.value).eq(true);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_xor1'].stateValues.value).eq(false);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_xor1'].stateValues.value).eq(false);
    });

    cy.log('uncheck box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_xor1'].stateValues.value).eq(false);
    });

    cy.log('uncheck box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_xor1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_xor1'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_xor1'].stateValues.value).eq(false);
    });

  })

  it('show point based on logic', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <booleaninput label="show point"/>
    <graph>
      <point><hide><not><copy prop="value" tname="_booleaninput1" /></not></hide>
       (1,2)
      </point>
    </graph>
    `}, "*");
    });

    cy.get("#\\/_booleaninput1_input")  //wait for page to load
    cy.log('Test initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_point1'].stateValues.hide).eq(true);
    });

    cy.log('check box to show point')
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_point1'].stateValues.hide).eq(false);
    });

  })

});