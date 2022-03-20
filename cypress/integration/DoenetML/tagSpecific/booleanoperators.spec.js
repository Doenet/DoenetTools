describe('Boolean Operator Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('not', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <booleaninput />
    <not><copy prop="value" target="_booleaninput1" assignNames="bv" /></not>
    <not>true</not>
    <not>false</not>
    `}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "true");
    cy.get('#\\/_not2').should('have.text', "false");
    cy.get('#\\/_not3').should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/bv'].stateValues.value).eq(false);
      expect(stateVariables['/_not1'].stateValues.value).eq(true);
      expect(stateVariables['/_not2'].stateValues.value).eq(false);
      expect(stateVariables['/_not3'].stateValues.value).eq(true);
    });

    cy.log('check the box')
    cy.get('#\\/_booleaninput1_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/bv'].stateValues.value).eq(true);
      expect(stateVariables['/_not1'].stateValues.value).eq(false);
    });

  })

  it('not when', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <mathinput />
    <not><when><copy prop="value" target="_mathinput1" assignNames="mv" /> > 1</when></not>
    `}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.value).eq('\uff3f');
      expect(stateVariables["/mv"].stateValues.value).eq('\uff3f');
      expect(stateVariables['/_not1'].stateValues.value).eq(true);
    });

    cy.log('enter 2')
    cy.get('#\\/_mathinput1 textarea').type('2{enter}', { force: true });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.value).eq(2);
      expect(stateVariables["/mv"].stateValues.value).eq(2);
      expect(stateVariables['/_not1'].stateValues.value).eq(false);
    });

    cy.log('enter 1')
    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}1{enter}', { force: true });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_not1').should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.value).eq(1);
      expect(stateVariables["/mv"].stateValues.value).eq(1);
      expect(stateVariables['/_not1'].stateValues.value).eq(true);
    });

  })

  it('and', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <and>
      <copy prop="value" target="_booleaninput1" assignNames="bv1" />
      <copy prop="value" target="_booleaninput2" assignNames="bv2" />
      <copy prop="value" target="_booleaninput3" assignNames="bv3" />
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables['/_and1'].stateValues.value).eq(false);
      expect(stateVariables['/_and2'].stateValues.value).eq(false);
      expect(stateVariables['/_and3'].stateValues.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_and1').should('have.text', "false");
    cy.get('#\\/_and2').should('have.text', "false");
    cy.get('#\\/_and3').should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables['/_and1'].stateValues.value).eq(false);
      expect(stateVariables['/_and2'].stateValues.value).eq(false);
      expect(stateVariables['/_and3'].stateValues.value).eq(false);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_and1').should('have.text', "false");
    cy.get('#\\/_and2').should('have.text', "false");
    cy.get('#\\/_and3').should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables['/_and1'].stateValues.value).eq(false);
      expect(stateVariables['/_and2'].stateValues.value).eq(false);
      expect(stateVariables['/_and3'].stateValues.value).eq(false);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_and1').should('have.text', "true");
    cy.get('#\\/_and2').should('have.text', "true");
    cy.get('#\\/_and3').should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables['/_and1'].stateValues.value).eq(true);
      expect(stateVariables['/_and2'].stateValues.value).eq(true);
      expect(stateVariables['/_and3'].stateValues.value).eq(false);
    });
  })

  it('or', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <or>
      <copy prop="value" target="_booleaninput1" assignNames="bv1" />
      <copy prop="value" target="_booleaninput2" assignNames="bv2" />
      <copy prop="value" target="_booleaninput3" assignNames="bv3" />
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables['/_or1'].stateValues.value).eq(false);
      expect(stateVariables['/_or2'].stateValues.value).eq(true);
      expect(stateVariables['/_or3'].stateValues.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables['/_or1'].stateValues.value).eq(true);
      expect(stateVariables['/_or2'].stateValues.value).eq(true);
      expect(stateVariables['/_or3'].stateValues.value).eq(true);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables['/_or1'].stateValues.value).eq(true);
      expect(stateVariables['/_or2'].stateValues.value).eq(true);
      expect(stateVariables['/_or3'].stateValues.value).eq(true);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables['/_or1'].stateValues.value).eq(true);
      expect(stateVariables['/_or2'].stateValues.value).eq(true);
      expect(stateVariables['/_or3'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables['/_or1'].stateValues.value).eq(true);
      expect(stateVariables['/_or2'].stateValues.value).eq(true);
      expect(stateVariables['/_or3'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_or1').should('have.text', "true");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables['/_or1'].stateValues.value).eq(true);
      expect(stateVariables['/_or2'].stateValues.value).eq(true);
      expect(stateVariables['/_or3'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_or1').should('have.text', "false");
    cy.get('#\\/_or2').should('have.text', "true");
    cy.get('#\\/_or3').should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables['/_or1'].stateValues.value).eq(false);
      expect(stateVariables['/_or2'].stateValues.value).eq(true);
      expect(stateVariables['/_or3'].stateValues.value).eq(false);
    });

  })

  it('xor', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <xor>
      <copy prop="value" target="_booleaninput1" assignNames="bv1" />
      <copy prop="value" target="_booleaninput2" assignNames="bv2" />
      <copy prop="value" target="_booleaninput3" assignNames="bv3" />
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables['/_xor1'].stateValues.value).eq(false);
      expect(stateVariables['/_xor2'].stateValues.value).eq(true);
      expect(stateVariables['/_xor3'].stateValues.value).eq(false);
    });

    cy.log('check box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_xor1').should('have.text', "true");
    cy.get('#\\/_xor2').should('have.text', "false");
    cy.get('#\\/_xor3').should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables['/_xor1'].stateValues.value).eq(true);
      expect(stateVariables['/_xor2'].stateValues.value).eq(false);
      expect(stateVariables['/_xor3'].stateValues.value).eq(true);
    });

    cy.log('check box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.get('#\\/_xor2').should('have.text', "false");
    cy.get('#\\/_xor3').should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables['/_xor1'].stateValues.value).eq(false);
      expect(stateVariables['/_xor2'].stateValues.value).eq(false);
      expect(stateVariables['/_xor3'].stateValues.value).eq(false);
    });

    cy.log('check box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.get('#\\/_xor2').should('have.text', "false");
    cy.get('#\\/_xor3').should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables['/_xor1'].stateValues.value).eq(false);
      expect(stateVariables['/_xor2'].stateValues.value).eq(false);
      expect(stateVariables['/_xor3'].stateValues.value).eq(false);
    });

    cy.log('uncheck box 1')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.get('#\\/_xor2').should('have.text', "false");
    cy.get('#\\/_xor3').should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(true);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables['/_xor1'].stateValues.value).eq(false);
      expect(stateVariables['/_xor2'].stateValues.value).eq(false);
      expect(stateVariables['/_xor3'].stateValues.value).eq(false);
    });

    cy.log('uncheck box 2')
    cy.get('#\\/_booleaninput2_input').click();
    cy.get('#\\/_xor1').should('have.text', "true");
    cy.get('#\\/_xor2').should('have.text', "false");
    cy.get('#\\/_xor3').should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables['/_xor1'].stateValues.value).eq(true);
      expect(stateVariables['/_xor2'].stateValues.value).eq(false);
      expect(stateVariables['/_xor3'].stateValues.value).eq(true);
    });

    cy.log('uncheck box 3')
    cy.get('#\\/_booleaninput3_input').click();
    cy.get('#\\/_xor1').should('have.text', "false");
    cy.get('#\\/_xor2').should('have.text', "true");
    cy.get('#\\/_xor3').should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput2'].stateValues.value).eq(false);
      expect(stateVariables['/_booleaninput3'].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables['/_xor1'].stateValues.value).eq(false);
      expect(stateVariables['/_xor2'].stateValues.value).eq(true);
      expect(stateVariables['/_xor3'].stateValues.value).eq(false);
    });

  })

  it('show point based on logic', () => {

    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_point1'].stateValues.hide).eq(true);
    });

    cy.log('check box to show point')
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_point1'].stateValues.hide).eq(false);
    });

  })

});