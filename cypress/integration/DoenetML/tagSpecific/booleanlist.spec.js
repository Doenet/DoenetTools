describe('BooleanList Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it('booleanlist within booleanlists', () => {
    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
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
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[0]).eq(true);
      expect(stateVariables['/_booleanlist1'].stateValues.booleans[1]).eq(false);
      expect(stateVariables['/_booleanlist1'].stateValues.booleans[2]).eq(false);
      expect(stateVariables['/_booleanlist1'].stateValues.booleans[3]).eq(false);
      expect(stateVariables['/_booleanlist1'].stateValues.booleans[4]).eq(false);
      expect(stateVariables['/_booleanlist1'].stateValues.booleans[5]).eq(true);
      expect(stateVariables['/_booleanlist1'].stateValues.booleans[6]).eq(false);
      expect(stateVariables['/_booleanlist1'].stateValues.booleans[7]).eq(false);
      expect(stateVariables['/_booleanlist1'].stateValues.booleans[8]).eq(true);
      expect((stateVariables['/_booleanlist2'].stateValues.booleans)[0]).eq(false);
      expect(stateVariables['/_booleanlist2'].stateValues.booleans[1]).eq(false);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[0]).eq(false);
      expect(stateVariables['/_booleanlist3'].stateValues.booleans[1]).eq(true);
      expect(stateVariables['/_booleanlist3'].stateValues.booleans[2]).eq(false);
      expect(stateVariables['/_booleanlist3'].stateValues.booleans[3]).eq(false);
      expect(stateVariables['/_booleanlist3'].stateValues.booleans[4]).eq(true);
      expect((stateVariables['/_booleanlist4'].stateValues.booleans)[0]).eq(false);
      expect(stateVariables['/_booleanlist4'].stateValues.booleans[1]).eq(true);
      expect(stateVariables['/_booleanlist4'].stateValues.booleans[2]).eq(false);
      expect((stateVariables['/_booleanlist5'].stateValues.booleans)[0]).eq(true);
      expect(stateVariables['/_booleanlist5'].stateValues.booleans[1]).eq(false);
      expect((stateVariables['/_booleanlist6'].stateValues.booleans)[0]).eq(false);
      expect(stateVariables['/_booleanlist6'].stateValues.booleans[1]).eq(true);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[0]).eq(false);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[1]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[2]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[3]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[4]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[5]).eq(false);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[6]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[7]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[8]).eq(false);
      expect((stateVariables['/_booleanlist2'].stateValues.booleans)[0]).eq(true);
      expect((stateVariables['/_booleanlist2'].stateValues.booleans)[1]).eq(true);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[0]).eq(true);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[1]).eq(false);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[2]).eq(true);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[3]).eq(true);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[4]).eq(false);
      expect((stateVariables['/_booleanlist4'].stateValues.booleans)[0]).eq(true);
      expect((stateVariables['/_booleanlist4'].stateValues.booleans)[1]).eq(false);
      expect((stateVariables['/_booleanlist4'].stateValues.booleans)[2]).eq(true);
      expect((stateVariables['/_booleanlist5'].stateValues.booleans)[0]).eq(false);
      expect((stateVariables['/_booleanlist5'].stateValues.booleans)[1]).eq(true);
      expect((stateVariables['/_booleanlist6'].stateValues.booleans)[0]).eq(true);
      expect((stateVariables['/_booleanlist6'].stateValues.booleans)[1]).eq(false);
    })

  })

  it('booleanlist with booleanlist children and sugar, test inverse', () => {
    cy.window().then(async (win) => {
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
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[0]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[1]).eq(false);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[2]).eq(false);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[3]).eq(false);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[4]).eq(false);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[5]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[6]).eq(false);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[7]).eq(false);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[8]).eq(true);
      expect((stateVariables['/_booleanlist2'].stateValues.booleans)[0]).eq(false);
      expect((stateVariables['/_booleanlist2'].stateValues.booleans)[1]).eq(false);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[0]).eq(false);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[1]).eq(true);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[2]).eq(false);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[3]).eq(false);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[4]).eq(true);
      expect((stateVariables['/_booleanlist4'].stateValues.booleans)[0]).eq(false);
      expect((stateVariables['/_booleanlist4'].stateValues.booleans)[1]).eq(true);
      expect((stateVariables['/_booleanlist4'].stateValues.booleans)[2]).eq(false);
      expect((stateVariables['/_booleanlist5'].stateValues.booleans)[0]).eq(true);
      expect((stateVariables['/_booleanlist5'].stateValues.booleans)[1]).eq(false);
      expect((stateVariables['/_booleanlist6'].stateValues.booleans)[0]).eq(false);
      expect((stateVariables['/_booleanlist6'].stateValues.booleans)[1]).eq(true);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[0]).eq(false);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[1]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[2]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[3]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[4]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[5]).eq(false);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[6]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[7]).eq(true);
      expect((stateVariables['/_booleanlist1'].stateValues.booleans)[8]).eq(false);
      expect((stateVariables['/_booleanlist2'].stateValues.booleans)[0]).eq(true);
      expect((stateVariables['/_booleanlist2'].stateValues.booleans)[1]).eq(true);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[0]).eq(true);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[1]).eq(false);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[2]).eq(true);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[3]).eq(true);
      expect((stateVariables['/_booleanlist3'].stateValues.booleans)[4]).eq(false);
      expect((stateVariables['/_booleanlist4'].stateValues.booleans)[0]).eq(true);
      expect((stateVariables['/_booleanlist4'].stateValues.booleans)[1]).eq(false);
      expect((stateVariables['/_booleanlist4'].stateValues.booleans)[2]).eq(true);
      expect((stateVariables['/_booleanlist5'].stateValues.booleans)[0]).eq(false);
      expect((stateVariables['/_booleanlist5'].stateValues.booleans)[1]).eq(true);
      expect((stateVariables['/_booleanlist6'].stateValues.booleans)[0]).eq(true);
      expect((stateVariables['/_booleanlist6'].stateValues.booleans)[1]).eq(false);
    })
  })

  it('copy booleanlist and overwrite maximum number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p><booleanlist name="bl1">true true false true false</booleanlist></p>
      <p><copy target="bl1" maximumNumber="3" assignNames="bl2" /></p>
      <p><copy target="bl2" maximumNumber="" assignNames="bl3" /></p>

      <p><booleanlist name="bl4" maximumNumber="3">true true false true false</booleanlist></p>
      <p><copy target="bl4" maximumNumber="4" assignNames="bl5" /></p>
      <p><copy target="bl5" maximumNumber="" assignNames="bl6" /></p>

      ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {

      cy.get('#\\/_p1').should('have.text', 'true, true, false, true, false')
      cy.get('#\\/_p2').should('have.text', 'true, true, false')
      cy.get('#\\/_p3').should('have.text', 'true, true, false, true, false')

      cy.get('#\\/_p4').should('have.text', 'true, true, false')
      cy.get('#\\/_p5').should('have.text', 'true, true, false, true')
      cy.get('#\\/_p6').should('have.text', 'true, true, false, true, false')

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/bl1'].stateValues.booleans).eqls([true, true, false, true, false]);
        expect(stateVariables['/bl2'].stateValues.booleans).eqls([true, true, false]);
        expect(stateVariables['/bl3'].stateValues.booleans).eqls([true, true, false, true, false]);
        expect(stateVariables['/bl4'].stateValues.booleans).eqls([true, true, false]);
        expect(stateVariables['/bl5'].stateValues.booleans).eqls([true, true, false, true]);
        expect(stateVariables['/bl6'].stateValues.booleans).eqls([true, true, false, true, false]);

      })
    })
  })

  it('dynamic maximum number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p><booleanlist name="bl1" maximumNumber="$mn1">true true false true false</booleanlist></p>
      <p><copy target="bl1" maximumNumber="$mn2" assignNames="bl2" /></p>
      <p>Maximum number 1: <mathinput name="mn1" prefill="2" /></p>
      <p>Maximum number 2: <mathinput name="mn2" /></p>

      ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {

      cy.get('#\\/_p1').should('have.text', 'true, true')
      cy.get('#\\/_p2').should('have.text', 'true, true, false, true, false')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/bl1'].stateValues.booleans).eqls([true, true]);
        expect(stateVariables['/bl2'].stateValues.booleans).eqls([true, true, false, true, false]);
      })
    })

    cy.log("clear first maxnum")
    cy.get('#\\/mn1 textarea').type("{end}{backspace}", { force: true }).blur();
    cy.get('#\\/_p1').should('have.text', 'true, true, false, true, false')
    cy.get('#\\/_p2').should('have.text', 'true, true, false, true, false')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bl1'].stateValues.booleans).eqls([true, true, false, true, false]);
      expect(stateVariables['/bl2'].stateValues.booleans).eqls([true, true, false, true, false]);
    })


    cy.log("number in second maxnum")
    cy.get('#\\/mn2 textarea').type("3{enter}", { force: true });
    cy.get('#\\/_p2').should('have.text', 'true, true, false')
    cy.get('#\\/_p1').should('have.text', 'true, true, false, true, false')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bl1'].stateValues.booleans).eqls([true, true, false, true, false]);
      expect(stateVariables['/bl2'].stateValues.booleans).eqls([true, true, false]);
    })


    cy.log("number in first maxnum")
    cy.get('#\\/mn1 textarea').type("4{enter}", { force: true });
    cy.get('#\\/_p1').should('have.text', 'true, true, false, true')
    cy.get('#\\/_p2').should('have.text', 'true, true, false')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bl1'].stateValues.booleans).eqls([true, true, false, true]);
      expect(stateVariables['/bl2'].stateValues.booleans).eqls([true, true, false]);
    })


    cy.log("change number in first maxnum")
    cy.get('#\\/mn1 textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/_p1').should('have.text', 'true')
    cy.get('#\\/_p2').should('have.text', 'true, true, false')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bl1'].stateValues.booleans).eqls([true]);
      expect(stateVariables['/bl2'].stateValues.booleans).eqls([true, true, false]);
    })


  })

})



