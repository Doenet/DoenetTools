describe('Boolean Operator Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('not', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <booleaninput />
    <not><copy prop="value" target="_booleaninput1" /></not>
    <not>true</not>
    <not>false</not>
    `}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "true");
    cy.get('#\\/_not2').should('have.text', "false");
    cy.get('#\\/_not3').should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components['/_not1'].stateValues.value).eq(true);
      expect(components['/_not2'].stateValues.value).eq(false);
      expect(components['/_not3'].stateValues.value).eq(true);
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

  it('not when', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <mathinput />
    <not><when><copy prop="value" target="_mathinput1" /> > 1</when></not>
    `}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.value.tree).eq('\uff3f');
      expect(components["/_copy1"].replacements[0].stateValues.value.tree).eq('\uff3f');
      expect(components['/_not1'].stateValues.value).eq(true);
    });

    cy.log('enter 2')
    cy.get('#\\/_mathinput1 textarea').type('2{enter}', { force: true });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.value.tree).eq(2);
      expect(components["/_copy1"].replacements[0].stateValues.value.tree).eq(2);
      expect(components['/_not1'].stateValues.value).eq(false);
    });

    cy.log('enter 1')
    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}1{enter}', { force: true });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.value.tree).eq(1);
      expect(components["/_copy1"].replacements[0].stateValues.value.tree).eq(1);
      expect(components['/_not1'].stateValues.value).eq(true);
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
      <copy prop="value" target="_booleaninput1" />
      <copy prop="value" target="_booleaninput2" />
      <copy prop="value" target="_booleaninput3" />
    </and>
    <and>
      <copy prop="value" target="_booleaninput1" />
      <copy prop="value" target="_booleaninput2" />
      <copy prop="value" target="_booleaninput3" />
      true
    </and>
    <and>
      <copy prop="value" target="_booleaninput1" />
      <copy prop="value" target="_booleaninput2" />
      <copy prop="value" target="_booleaninput3" />
      false
    </and>
    `}, "*");
    });

    cy.log('Test initial values')
    cy.get('#\\/_and1').should('have.text', "false");
    cy.get('#\\/_and2').should('have.text', "false");
    cy.get('#\\/_and3').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_and1'].stateValues.value).eq(false);
      expect(components['/_and2'].stateValues.value).eq(false);
      expect(components['/_and3'].stateValues.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_and1').should('have.text', "false");
    cy.get('#\\/_and2').should('have.text', "false");
    cy.get('#\\/_and3').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_and1'].stateValues.value).eq(false);
      expect(components['/_and2'].stateValues.value).eq(false);
      expect(components['/_and3'].stateValues.value).eq(false);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_and1').should('have.text', "false");
    cy.get('#\\/_and2').should('have.text', "false");
    cy.get('#\\/_and3').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_and1'].stateValues.value).eq(false);
      expect(components['/_and2'].stateValues.value).eq(false);
      expect(components['/_and3'].stateValues.value).eq(false);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_and1').should('have.text', "true");
    cy.get('#\\/_and2').should('have.text', "true");
    cy.get('#\\/_and3').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_and1'].stateValues.value).eq(true);
      expect(components['/_and2'].stateValues.value).eq(true);
      expect(components['/_and3'].stateValues.value).eq(false);
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
      <copy prop="value" target="_booleaninput1" />
      <copy prop="value" target="_booleaninput2" />
      <copy prop="value" target="_booleaninput3" />
    </or>
    <or>
      <copy prop="value" target="_booleaninput1" />
      <copy prop="value" target="_booleaninput2" />
      <copy prop="value" target="_booleaninput3" />
      true
    </or>
    <or>
      <copy prop="value" target="_booleaninput1" />
      <copy prop="value" target="_booleaninput2" />
      <copy prop="value" target="_booleaninput3" />
      false
    </or>
    `}, "*");
    });

    cy.log('Test initial values')
    cy.get('#\\/_or1').should('have.text', "false");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_or1'].stateValues.value).eq(false);
      expect(components['/_or2'].stateValues.value).eq(true);
      expect(components['/_or3'].stateValues.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_or1'].stateValues.value).eq(true);
      expect(components['/_or2'].stateValues.value).eq(true);
      expect(components['/_or3'].stateValues.value).eq(true);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_or1'].stateValues.value).eq(true);
      expect(components['/_or2'].stateValues.value).eq(true);
      expect(components['/_or3'].stateValues.value).eq(true);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_or1'].stateValues.value).eq(true);
      expect(components['/_or2'].stateValues.value).eq(true);
      expect(components['/_or3'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_or1'].stateValues.value).eq(true);
      expect(components['/_or2'].stateValues.value).eq(true);
      expect(components['/_or3'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_or1'].stateValues.value).eq(true);
      expect(components['/_or2'].stateValues.value).eq(true);
      expect(components['/_or3'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_or1').should('have.text', "false");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_or1'].stateValues.value).eq(false);
      expect(components['/_or2'].stateValues.value).eq(true);
      expect(components['/_or3'].stateValues.value).eq(false);
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
      <copy prop="value" target="_booleaninput1" />
      <copy prop="value" target="_booleaninput2" />
      <copy prop="value" target="_booleaninput3" />
    </xor>
    <xor>
      <copy prop="value" target="_booleaninput1" />
      <copy prop="value" target="_booleaninput2" />
      <copy prop="value" target="_booleaninput3" />
      true
    </xor>
    <xor>
      <copy prop="value" target="_booleaninput1" />
      <copy prop="value" target="_booleaninput2" />
      <copy prop="value" target="_booleaninput3" />
      false
    </xor>
    `}, "*");
    });

    cy.log('Test initial values')
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.get('#\\/_xor2').should('have.text', "true");
    cy.get('#\\/_xor3').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_xor1'].stateValues.value).eq(false);
      expect(components['/_xor2'].stateValues.value).eq(true);
      expect(components['/_xor3'].stateValues.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_xor1').should('have.text', "true");
    cy.get('#\\/_xor2').should('have.text', "false");
    cy.get('#\\/_xor3').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_xor1'].stateValues.value).eq(true);
      expect(components['/_xor2'].stateValues.value).eq(false);
      expect(components['/_xor3'].stateValues.value).eq(true);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.get('#\\/_xor2').should('have.text', "false");
    cy.get('#\\/_xor3').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_xor1'].stateValues.value).eq(false);
      expect(components['/_xor2'].stateValues.value).eq(false);
      expect(components['/_xor3'].stateValues.value).eq(false);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.get('#\\/_xor2').should('have.text', "false");
    cy.get('#\\/_xor3').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(true);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_xor1'].stateValues.value).eq(false);
      expect(components['/_xor2'].stateValues.value).eq(false);
      expect(components['/_xor3'].stateValues.value).eq(false);
    });

    cy.log('uncheck box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.get('#\\/_xor2').should('have.text', "false");
    cy.get('#\\/_xor3').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(true);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(true);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_xor1'].stateValues.value).eq(false);
      expect(components['/_xor2'].stateValues.value).eq(false);
      expect(components['/_xor3'].stateValues.value).eq(false);
    });

    cy.log('uncheck box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_xor1').should('have.text', "true");
    cy.get('#\\/_xor2').should('have.text', "false");
    cy.get('#\\/_xor3').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(true);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(true);
      expect(components['/_xor1'].stateValues.value).eq(true);
      expect(components['/_xor2'].stateValues.value).eq(false);
      expect(components['/_xor3'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.get('#\\/_xor2').should('have.text', "true");
    cy.get('#\\/_xor3').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_booleaninput2'].stateValues.value).eq(false);
      expect(components['/_booleaninput3'].stateValues.value).eq(false);
      expect(components["/_copy1"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy2"].replacements[0].stateValues.value).eq(false);
      expect(components["/_copy3"].replacements[0].stateValues.value).eq(false);
      expect(components['/_xor1'].stateValues.value).eq(false);
      expect(components['/_xor2'].stateValues.value).eq(true);
      expect(components['/_xor3'].stateValues.value).eq(false);
    });

  })

  it('show point based on logic', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <booleaninput label="show point"/>
    <graph>
      <point hide="not $_booleaninput1">
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