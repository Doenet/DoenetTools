describe('BooleanList Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('booleanlist within booleanlists', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><booleanlist hide="true">false true false</booleanlist></p>

    <p><copy hide="false" target="_booleanlist1" /></p>

    <p><booleanlist>
      <boolean>true</boolean>
      <boolean hide>false</boolean>
      <copy target="_booleanlist1" />
      <boolean>false</boolean>
      <copy target="_copy1" />
    </booleanlist></p>

    <p><copy maximumnumber="6" target="_booleanlist2" /></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', '')
    cy.get('#\\/_p2').should('have.text', 'false, true, false')
    cy.get('#\\/_p3').should('have.text', 'true, false, true, false, false, false, true, false')
    cy.get('#\\/_p4').should('have.text', 'true, false, true, false, false')


  })

  it('booleanlist with booleanlist children, test inverse', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p><booleanlist>
          <boolean>true</boolean>
          <booleanlist>false false</booleanlist>
          <boolean>false</boolean>
          <booleanlist>
            <booleanlist>
              <boolean>false</boolean>
              <booleanlist>true false</booleanlist>
            </booleanlist>
            <booleanlist>false   true</booleanlist>
          </booleanlist>
        </booleanlist></p>
    
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean1'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean2'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean3'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean4'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean5'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean6'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean7'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean8'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean9'})" />
    
        ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', 'true, false, false, false, false, true, false, false, true')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_booleanlist1'].stateValues.booleans)[0]).eq(true);
      expect(components['/_booleanlist1'].stateValues.booleans[1]).eq(false);
      expect(components['/_booleanlist1'].stateValues.booleans[2]).eq(false);
      expect(components['/_booleanlist1'].stateValues.booleans[3]).eq(false);
      expect(components['/_booleanlist1'].stateValues.booleans[4]).eq(false);
      expect(components['/_booleanlist1'].stateValues.booleans[5]).eq(true);
      expect(components['/_booleanlist1'].stateValues.booleans[6]).eq(false);
      expect(components['/_booleanlist1'].stateValues.booleans[7]).eq(false);
      expect(components['/_booleanlist1'].stateValues.booleans[8]).eq(true);
      expect((await components['/_booleanlist2'].stateValues.booleans)[0]).eq(false);
      expect(components['/_booleanlist2'].stateValues.booleans[1]).eq(false);
      expect((await components['/_booleanlist3'].stateValues.booleans)[0]).eq(false);
      expect(components['/_booleanlist3'].stateValues.booleans[1]).eq(true);
      expect(components['/_booleanlist3'].stateValues.booleans[2]).eq(false);
      expect(components['/_booleanlist3'].stateValues.booleans[3]).eq(false);
      expect(components['/_booleanlist3'].stateValues.booleans[4]).eq(true);
      expect((await components['/_booleanlist4'].stateValues.booleans)[0]).eq(false);
      expect(components['/_booleanlist4'].stateValues.booleans[1]).eq(true);
      expect(components['/_booleanlist4'].stateValues.booleans[2]).eq(false);
      expect((await components['/_booleanlist5'].stateValues.booleans)[0]).eq(true);
      expect(components['/_booleanlist5'].stateValues.booleans[1]).eq(false);
      expect((await components['/_booleanlist6'].stateValues.booleans)[0]).eq(false);
      expect(components['/_booleanlist6'].stateValues.booleans[1]).eq(true);
    })

    cy.log('change values')

    cy.get("#\\/_booleaninput1_input").click();
    cy.get("#\\/_booleaninput2_input").click();
    cy.get("#\\/_booleaninput3_input").click();
    cy.get("#\\/_booleaninput4_input").click();
    cy.get("#\\/_booleaninput5_input").click();
    cy.get("#\\/_booleaninput6_input").click();
    cy.get("#\\/_booleaninput7_input").click();
    cy.get("#\\/_booleaninput8_input").click();
    cy.get("#\\/_booleaninput9_input").click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', 'false, true, true, true, true, false, true, true, false')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_booleanlist1'].stateValues.booleans)[0]).eq(false);
      expect((await components['/_booleanlist1'].stateValues.booleans)[1]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[2]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[3]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[4]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[5]).eq(false);
      expect((await components['/_booleanlist1'].stateValues.booleans)[6]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[7]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[8]).eq(false);
      expect((await components['/_booleanlist2'].stateValues.booleans)[0]).eq(true);
      expect((await components['/_booleanlist2'].stateValues.booleans)[1]).eq(true);
      expect((await components['/_booleanlist3'].stateValues.booleans)[0]).eq(true);
      expect((await components['/_booleanlist3'].stateValues.booleans)[1]).eq(false);
      expect((await components['/_booleanlist3'].stateValues.booleans)[2]).eq(true);
      expect((await components['/_booleanlist3'].stateValues.booleans)[3]).eq(true);
      expect((await components['/_booleanlist3'].stateValues.booleans)[4]).eq(false);
      expect((await components['/_booleanlist4'].stateValues.booleans)[0]).eq(true);
      expect((await components['/_booleanlist4'].stateValues.booleans)[1]).eq(false);
      expect((await components['/_booleanlist4'].stateValues.booleans)[2]).eq(true);
      expect((await components['/_booleanlist5'].stateValues.booleans)[0]).eq(false);
      expect((await components['/_booleanlist5'].stateValues.booleans)[1]).eq(true);
      expect((await components['/_booleanlist6'].stateValues.booleans)[0]).eq(true);
      expect((await components['/_booleanlist6'].stateValues.booleans)[1]).eq(false);
    })

  })

  it('booleanlist with booleanlist children and sugar, test inverse', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p><booleanlist>
          true
          <booleanlist>false false</booleanlist>
          <boolean>false</boolean>
          <booleanlist>
            <booleanlist>
              false
              <booleanlist>true false</booleanlist>
            </booleanlist>
            <booleanlist>false   true</booleanlist>
          </booleanlist>
        </booleanlist></p>
    
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean1'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean2'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean3'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean4'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean5'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean6'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean7'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean8'})" />
        <booleaninput bindValueTo="$(_booleanlist1{prop='boolean9'})" />
    
        ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', 'true, false, false, false, false, true, false, false, true')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_booleanlist1'].stateValues.booleans)[0]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[1]).eq(false);
      expect((await components['/_booleanlist1'].stateValues.booleans)[2]).eq(false);
      expect((await components['/_booleanlist1'].stateValues.booleans)[3]).eq(false);
      expect((await components['/_booleanlist1'].stateValues.booleans)[4]).eq(false);
      expect((await components['/_booleanlist1'].stateValues.booleans)[5]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[6]).eq(false);
      expect((await components['/_booleanlist1'].stateValues.booleans)[7]).eq(false);
      expect((await components['/_booleanlist1'].stateValues.booleans)[8]).eq(true);
      expect((await components['/_booleanlist2'].stateValues.booleans)[0]).eq(false);
      expect((await components['/_booleanlist2'].stateValues.booleans)[1]).eq(false);
      expect((await components['/_booleanlist3'].stateValues.booleans)[0]).eq(false);
      expect((await components['/_booleanlist3'].stateValues.booleans)[1]).eq(true);
      expect((await components['/_booleanlist3'].stateValues.booleans)[2]).eq(false);
      expect((await components['/_booleanlist3'].stateValues.booleans)[3]).eq(false);
      expect((await components['/_booleanlist3'].stateValues.booleans)[4]).eq(true);
      expect((await components['/_booleanlist4'].stateValues.booleans)[0]).eq(false);
      expect((await components['/_booleanlist4'].stateValues.booleans)[1]).eq(true);
      expect((await components['/_booleanlist4'].stateValues.booleans)[2]).eq(false);
      expect((await components['/_booleanlist5'].stateValues.booleans)[0]).eq(true);
      expect((await components['/_booleanlist5'].stateValues.booleans)[1]).eq(false);
      expect((await components['/_booleanlist6'].stateValues.booleans)[0]).eq(false);
      expect((await components['/_booleanlist6'].stateValues.booleans)[1]).eq(true);
    })

    cy.log('change values')

    cy.get("#\\/_booleaninput1_input").click();
    cy.get("#\\/_booleaninput2_input").click();
    cy.get("#\\/_booleaninput3_input").click();
    cy.get("#\\/_booleaninput4_input").click();
    cy.get("#\\/_booleaninput5_input").click();
    cy.get("#\\/_booleaninput6_input").click();
    cy.get("#\\/_booleaninput7_input").click();
    cy.get("#\\/_booleaninput8_input").click();
    cy.get("#\\/_booleaninput9_input").click();

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', 'false, true, true, true, true, false, true, true, false')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_booleanlist1'].stateValues.booleans)[0]).eq(false);
      expect((await components['/_booleanlist1'].stateValues.booleans)[1]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[2]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[3]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[4]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[5]).eq(false);
      expect((await components['/_booleanlist1'].stateValues.booleans)[6]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[7]).eq(true);
      expect((await components['/_booleanlist1'].stateValues.booleans)[8]).eq(false);
      expect((await components['/_booleanlist2'].stateValues.booleans)[0]).eq(true);
      expect((await components['/_booleanlist2'].stateValues.booleans)[1]).eq(true);
      expect((await components['/_booleanlist3'].stateValues.booleans)[0]).eq(true);
      expect((await components['/_booleanlist3'].stateValues.booleans)[1]).eq(false);
      expect((await components['/_booleanlist3'].stateValues.booleans)[2]).eq(true);
      expect((await components['/_booleanlist3'].stateValues.booleans)[3]).eq(true);
      expect((await components['/_booleanlist3'].stateValues.booleans)[4]).eq(false);
      expect((await components['/_booleanlist4'].stateValues.booleans)[0]).eq(true);
      expect((await components['/_booleanlist4'].stateValues.booleans)[1]).eq(false);
      expect((await components['/_booleanlist4'].stateValues.booleans)[2]).eq(true);
      expect((await components['/_booleanlist5'].stateValues.booleans)[0]).eq(false);
      expect((await components['/_booleanlist5'].stateValues.booleans)[1]).eq(true);
      expect((await components['/_booleanlist6'].stateValues.booleans)[0]).eq(true);
      expect((await components['/_booleanlist6'].stateValues.booleans)[1]).eq(false);
    })
  })


})



