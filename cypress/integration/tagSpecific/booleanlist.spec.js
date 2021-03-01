import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Booleanlist Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('booleanlist within booleanlists', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><booleanlist hide="true">false, true, false</booleanlist></p>

    <p><copy hide="false" tname="_booleanlist1" /></p>

    <p><booleanlist>
      <boolean>true</boolean>
      <copy tname="_booleanlist1" />
      <boolean>false</boolean>
      <copy tname="_copy1" />
    </booleanlist></p>

    <p><copy maximumnumber="6" tname="_booleanlist2" /></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', '')
    cy.get('#\\/_p2').should('have.text', 'false, true, false')
    cy.get('#\\/_p3').should('have.text', 'true, false, true, false, false, false, true, false')
    cy.get('#\\/_p4').should('have.text', 'true, false, true, false, false, false')


  })

  it('booleanlist with booleanlist children, test inverse', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <booleanlist>
          <boolean>true</boolean>
          <booleanlist>false, false</booleanlist>
          <boolean>false</boolean>
          <booleanlist>
            <booleanlist>
              <boolean>false</boolean>
              <booleanlist>true, false</booleanlist>
            </booleanlist>
            <booleanlist>false,true</booleanlist>
          </booleanlist>
        </booleanlist>
    
        <booleaninput><copy prop="boolean1" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean2" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean3" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean4" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean5" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean6" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean7" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean8" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean9" tname="_booleanlist1" /></booleaninput>
    
        ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_booleanlist1'].stateValues.childrenToRender[1];
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_booleanlist1'].stateValues.childrenToRender[2];
      let child2Anchor = cesc('#' + child2Name);
      let child5Name = components['/_booleanlist1'].stateValues.childrenToRender[5];
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = components['/_booleanlist1'].stateValues.childrenToRender[6];
      let child6Anchor = cesc('#' + child6Name);
      let child7Name = components['/_booleanlist1'].stateValues.childrenToRender[7];
      let child7Anchor = cesc('#' + child7Name);
      let child8Name = components['/_booleanlist1'].stateValues.childrenToRender[8];
      let child8Anchor = cesc('#' + child8Name);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_boolean1').should('have.text', 'true')
      cy.get(child1Anchor).should('have.text', 'false')
      cy.get(child2Anchor).should('have.text', 'false')
      cy.get('#\\/_boolean2').should('have.text', 'false')
      cy.get('#\\/_boolean3').should('have.text', 'false')
      cy.get(child5Anchor).should('have.text', 'true')
      cy.get(child6Anchor).should('have.text', 'false')
      cy.get(child7Anchor).should('have.text', 'false')
      cy.get(child8Anchor).should('have.text', 'true')


      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleanlist1'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[1]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[2]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[3]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[4]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[5]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[6]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[7]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[8]).eq(true);
        expect(components['/_booleanlist2'].stateValues.booleans[0]).eq(false);
        expect(components['/_booleanlist2'].stateValues.booleans[1]).eq(false);
        expect(components['/_booleanlist3'].stateValues.booleans[0]).eq(false);
        expect(components['/_booleanlist3'].stateValues.booleans[1]).eq(true);
        expect(components['/_booleanlist3'].stateValues.booleans[2]).eq(false);
        expect(components['/_booleanlist3'].stateValues.booleans[3]).eq(false);
        expect(components['/_booleanlist3'].stateValues.booleans[4]).eq(true);
        expect(components['/_booleanlist4'].stateValues.booleans[0]).eq(false);
        expect(components['/_booleanlist4'].stateValues.booleans[1]).eq(true);
        expect(components['/_booleanlist4'].stateValues.booleans[2]).eq(false);
        expect(components['/_booleanlist5'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist5'].stateValues.booleans[1]).eq(false);
        expect(components['/_booleanlist6'].stateValues.booleans[0]).eq(false);
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
      cy.get('#\\/_boolean1').should('have.text', 'false')
      cy.get(child1Anchor).should('have.text', 'true')
      cy.get(child2Anchor).should('have.text', 'true')
      cy.get('#\\/_boolean2').should('have.text', 'true')
      cy.get('#\\/_boolean3').should('have.text', 'true')
      cy.get(child5Anchor).should('have.text', 'false')
      cy.get(child6Anchor).should('have.text', 'true')
      cy.get(child7Anchor).should('have.text', 'true')
      cy.get(child8Anchor).should('have.text', 'false')


      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleanlist1'].stateValues.booleans[0]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[1]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[2]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[3]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[4]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[5]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[6]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[7]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[8]).eq(false);
        expect(components['/_booleanlist2'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist2'].stateValues.booleans[1]).eq(true);
        expect(components['/_booleanlist3'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist3'].stateValues.booleans[1]).eq(false);
        expect(components['/_booleanlist3'].stateValues.booleans[2]).eq(true);
        expect(components['/_booleanlist3'].stateValues.booleans[3]).eq(true);
        expect(components['/_booleanlist3'].stateValues.booleans[4]).eq(false);
        expect(components['/_booleanlist4'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist4'].stateValues.booleans[1]).eq(false);
        expect(components['/_booleanlist4'].stateValues.booleans[2]).eq(true);
        expect(components['/_booleanlist5'].stateValues.booleans[0]).eq(false);
        expect(components['/_booleanlist5'].stateValues.booleans[1]).eq(true);
        expect(components['/_booleanlist6'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist6'].stateValues.booleans[1]).eq(false);
      })
    })

  })

  it('booleanlist with booleanlist children and sugar, test inverse', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <booleanlist>
          true,
          <booleanlist>false, false</booleanlist>,
          <boolean>false</boolean>
          <booleanlist>
            <booleanlist>
              false
              <booleanlist>true, false</booleanlist>
            </booleanlist>
            <booleanlist>false,true</booleanlist>
          </booleanlist>
        </booleanlist>
    
        <booleaninput><copy prop="boolean1" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean2" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean3" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean4" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean5" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean6" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean7" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean8" tname="_booleanlist1" /></booleaninput>
        <booleaninput><copy prop="boolean9" tname="_booleanlist1" /></booleaninput>
    
        ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child0Name = components['/_booleanlist1'].stateValues.childrenToRender[0];
      let child0Anchor = cesc('#' + child0Name);
      let child1Name = components['/_booleanlist1'].stateValues.childrenToRender[1];
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_booleanlist1'].stateValues.childrenToRender[2];
      let child2Anchor = cesc('#' + child2Name);
      let child4Name = components['/_booleanlist1'].stateValues.childrenToRender[4];
      let child4Anchor = cesc('#' + child4Name);
      let child5Name = components['/_booleanlist1'].stateValues.childrenToRender[5];
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = components['/_booleanlist1'].stateValues.childrenToRender[6];
      let child6Anchor = cesc('#' + child6Name);
      let child7Name = components['/_booleanlist1'].stateValues.childrenToRender[7];
      let child7Anchor = cesc('#' + child7Name);
      let child8Name = components['/_booleanlist1'].stateValues.childrenToRender[8];
      let child8Anchor = cesc('#' + child8Name);

      cy.log('Test value displayed in browser')
      cy.get(child0Anchor).should('have.text', 'true')
      cy.get(child1Anchor).should('have.text', 'false')
      cy.get(child2Anchor).should('have.text', 'false')
      cy.get('#\\/_boolean1').should('have.text', 'false')
      cy.get(child4Anchor).should('have.text', 'false')
      cy.get(child5Anchor).should('have.text', 'true')
      cy.get(child6Anchor).should('have.text', 'false')
      cy.get(child7Anchor).should('have.text', 'false')
      cy.get(child8Anchor).should('have.text', 'true')


      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleanlist1'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[1]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[2]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[3]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[4]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[5]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[6]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[7]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[8]).eq(true);
        expect(components['/_booleanlist2'].stateValues.booleans[0]).eq(false);
        expect(components['/_booleanlist2'].stateValues.booleans[1]).eq(false);
        expect(components['/_booleanlist3'].stateValues.booleans[0]).eq(false);
        expect(components['/_booleanlist3'].stateValues.booleans[1]).eq(true);
        expect(components['/_booleanlist3'].stateValues.booleans[2]).eq(false);
        expect(components['/_booleanlist3'].stateValues.booleans[3]).eq(false);
        expect(components['/_booleanlist3'].stateValues.booleans[4]).eq(true);
        expect(components['/_booleanlist4'].stateValues.booleans[0]).eq(false);
        expect(components['/_booleanlist4'].stateValues.booleans[1]).eq(true);
        expect(components['/_booleanlist4'].stateValues.booleans[2]).eq(false);
        expect(components['/_booleanlist5'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist5'].stateValues.booleans[1]).eq(false);
        expect(components['/_booleanlist6'].stateValues.booleans[0]).eq(false);
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
      cy.get(child0Anchor).should('have.text', 'false')
      cy.get(child1Anchor).should('have.text', 'true')
      cy.get(child2Anchor).should('have.text', 'true')
      cy.get('#\\/_boolean1').should('have.text', 'true')
      cy.get(child4Anchor).should('have.text', 'true')
      cy.get(child5Anchor).should('have.text', 'false')
      cy.get(child6Anchor).should('have.text', 'true')
      cy.get(child7Anchor).should('have.text', 'true')
      cy.get(child8Anchor).should('have.text', 'false')


      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleanlist1'].stateValues.booleans[0]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[1]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[2]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[3]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[4]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[5]).eq(false);
        expect(components['/_booleanlist1'].stateValues.booleans[6]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[7]).eq(true);
        expect(components['/_booleanlist1'].stateValues.booleans[8]).eq(false);
        expect(components['/_booleanlist2'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist2'].stateValues.booleans[1]).eq(true);
        expect(components['/_booleanlist3'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist3'].stateValues.booleans[1]).eq(false);
        expect(components['/_booleanlist3'].stateValues.booleans[2]).eq(true);
        expect(components['/_booleanlist3'].stateValues.booleans[3]).eq(true);
        expect(components['/_booleanlist3'].stateValues.booleans[4]).eq(false);
        expect(components['/_booleanlist4'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist4'].stateValues.booleans[1]).eq(false);
        expect(components['/_booleanlist4'].stateValues.booleans[2]).eq(true);
        expect(components['/_booleanlist5'].stateValues.booleans[0]).eq(false);
        expect(components['/_booleanlist5'].stateValues.booleans[1]).eq(true);
        expect(components['/_booleanlist6'].stateValues.booleans[0]).eq(true);
        expect(components['/_booleanlist6'].stateValues.booleans[1]).eq(false);
      })
    })

  })


})



