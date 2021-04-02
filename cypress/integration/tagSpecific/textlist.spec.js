import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Textlist Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('textlist within textlists', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><textlist hide="true">a b c</textlist></p>

    <p><copy hide="false" tname="_textlist1" /></p>

    <p><textlist>
      <text>hello</text>
      <copy tname="_textlist1" />
      <text>bye</text>
      <copy tname="_copy1" />
    </textlist></p>

    <p><copy maximumnumber="6" tname="_textlist2" /></p>

    <p><copy prop="text" tname="_textlist2" /></p>

    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', '')
    cy.get('#\\/_p2').should('have.text', 'a, b, c')
    cy.get('#\\/_p3').should('have.text', 'hello, a, b, c, bye, a, b, c')
    cy.get('#\\/_p4').should('have.text', 'hello, a, b, c, bye, a')
    cy.get('#\\/_p5').should('have.text', 'hello, a, b, c, bye, a, b, c')


  })

  it('textlist with textlist children, test inverse', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <letters>a</letters>
      <textlist>
        <text>a</text>
        <textlist>q r</textlist>
        <text>h</text>
        <textlist>
          <textlist>
            <text>b</text>
            <textlist>u v</textlist>
          </textlist>
          <textlist>i j</textlist>
        </textlist>
      </textlist>
  
      <textinput bindValueTo="$(_textlist1{prop='text1'})" />
      <textinput bindValueTo="$(_textlist1{prop='text2'})" />
      <textinput bindValueTo="$(_textlist1{prop='text3'})" />
      <textinput bindValueTo="$(_textlist1{prop='text4'})" />
      <textinput bindValueTo="$(_textlist1{prop='text5'})" />
      <textinput bindValueTo="$(_textlist1{prop='text6'})" />
      <textinput bindValueTo="$(_textlist1{prop='text7'})" />
      <textinput bindValueTo="$(_textlist1{prop='text8'})" />
      <textinput bindValueTo="$(_textlist1{prop='text9'})" />
  
      ` }, "*");
    });

    cy.get('#\\/_letters1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_textlist1'].stateValues.childrenToRender[1];
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_textlist1'].stateValues.childrenToRender[2];
      let child2Anchor = cesc('#' + child2Name);
      let child5Name = components['/_textlist1'].stateValues.childrenToRender[5];
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = components['/_textlist1'].stateValues.childrenToRender[6];
      let child6Anchor = cesc('#' + child6Name);
      let child7Name = components['/_textlist1'].stateValues.childrenToRender[7];
      let child7Anchor = cesc('#' + child7Name);
      let child8Name = components['/_textlist1'].stateValues.childrenToRender[8];
      let child8Anchor = cesc('#' + child8Name);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_text1').should('have.text', 'a')
      cy.get(child1Anchor).should('have.text', 'q')
      cy.get(child2Anchor).should('have.text', 'r')
      cy.get('#\\/_text2').should('have.text', 'h')
      cy.get('#\\/_text3').should('have.text', 'b')
      cy.get(child5Anchor).should('have.text', 'u')
      cy.get(child6Anchor).should('have.text', 'v')
      cy.get(child7Anchor).should('have.text', 'i')
      cy.get(child8Anchor).should('have.text', 'j')

      cy.get("#\\/_textinput1_input").should('have.value', 'a')
      cy.get("#\\/_textinput2_input").should('have.value', 'q')
      cy.get("#\\/_textinput3_input").should('have.value', 'r')
      cy.get("#\\/_textinput4_input").should('have.value', 'h')
      cy.get("#\\/_textinput5_input").should('have.value', 'b')
      cy.get("#\\/_textinput6_input").should('have.value', 'u')
      cy.get("#\\/_textinput7_input").should('have.value', 'v')
      cy.get("#\\/_textinput8_input").should('have.value', 'i')
      cy.get("#\\/_textinput9_input").should('have.value', 'j')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textlist1'].stateValues.texts[0]).eq('a');
        expect(components['/_textlist1'].stateValues.texts[1]).eq('q');
        expect(components['/_textlist1'].stateValues.texts[2]).eq('r');
        expect(components['/_textlist1'].stateValues.texts[3]).eq('h');
        expect(components['/_textlist1'].stateValues.texts[4]).eq('b');
        expect(components['/_textlist1'].stateValues.texts[5]).eq('u');
        expect(components['/_textlist1'].stateValues.texts[6]).eq('v');
        expect(components['/_textlist1'].stateValues.texts[7]).eq('i');
        expect(components['/_textlist1'].stateValues.texts[8]).eq('j');
        expect(components['/_textlist2'].stateValues.texts[0]).eq('q');
        expect(components['/_textlist2'].stateValues.texts[1]).eq('r');
        expect(components['/_textlist3'].stateValues.texts[0]).eq('b');
        expect(components['/_textlist3'].stateValues.texts[1]).eq('u');
        expect(components['/_textlist3'].stateValues.texts[2]).eq('v');
        expect(components['/_textlist3'].stateValues.texts[3]).eq('i');
        expect(components['/_textlist3'].stateValues.texts[4]).eq('j');
        expect(components['/_textlist4'].stateValues.texts[0]).eq('b');
        expect(components['/_textlist4'].stateValues.texts[1]).eq('u');
        expect(components['/_textlist4'].stateValues.texts[2]).eq('v');
        expect(components['/_textlist5'].stateValues.texts[0]).eq('u');
        expect(components['/_textlist5'].stateValues.texts[1]).eq('v');
        expect(components['/_textlist6'].stateValues.texts[0]).eq('i');
        expect(components['/_textlist6'].stateValues.texts[1]).eq('j');
      })

      cy.log('change values')

      cy.get("#\\/_textinput1_input").clear().type("1{enter}")
      cy.get("#\\/_textinput2_input").clear().type("2{enter}")
      cy.get("#\\/_textinput3_input").clear().type("3{enter}")
      cy.get("#\\/_textinput4_input").clear().type("4{enter}")
      cy.get("#\\/_textinput5_input").clear().type("5{enter}")
      cy.get("#\\/_textinput6_input").clear().type("6{enter}")
      cy.get("#\\/_textinput7_input").clear().type("7{enter}")
      cy.get("#\\/_textinput8_input").clear().type("8{enter}")
      cy.get("#\\/_textinput9_input").clear().type("9{enter}")


      cy.log('Test value displayed in browser')
      cy.get('#\\/_text1').should('have.text', '1')
      cy.get(child1Anchor).should('have.text', '2')
      cy.get(child2Anchor).should('have.text', '3')
      cy.get('#\\/_text2').should('have.text', '4')
      cy.get('#\\/_text3').should('have.text', '5')
      cy.get(child5Anchor).should('have.text', '6')
      cy.get(child6Anchor).should('have.text', '7')
      cy.get(child7Anchor).should('have.text', '8')
      cy.get(child8Anchor).should('have.text', '9')

      cy.get("#\\/_textinput1_input").should('have.value', '1')
      cy.get("#\\/_textinput2_input").should('have.value', '2')
      cy.get("#\\/_textinput3_input").should('have.value', '3')
      cy.get("#\\/_textinput4_input").should('have.value', '4')
      cy.get("#\\/_textinput5_input").should('have.value', '5')
      cy.get("#\\/_textinput6_input").should('have.value', '6')
      cy.get("#\\/_textinput7_input").should('have.value', '7')
      cy.get("#\\/_textinput8_input").should('have.value', '8')
      cy.get("#\\/_textinput9_input").should('have.value', '9')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_textlist1'].stateValues.texts[0]).eq('1');
        expect(components['/_textlist1'].stateValues.texts[1]).eq('2');
        expect(components['/_textlist1'].stateValues.texts[2]).eq('3');
        expect(components['/_textlist1'].stateValues.texts[3]).eq('4');
        expect(components['/_textlist1'].stateValues.texts[4]).eq('5');
        expect(components['/_textlist1'].stateValues.texts[5]).eq('6');
        expect(components['/_textlist1'].stateValues.texts[6]).eq('7');
        expect(components['/_textlist1'].stateValues.texts[7]).eq('8');
        expect(components['/_textlist1'].stateValues.texts[8]).eq('9');
        expect(components['/_textlist2'].stateValues.texts[0]).eq('2');
        expect(components['/_textlist2'].stateValues.texts[1]).eq('3');
        expect(components['/_textlist3'].stateValues.texts[0]).eq('5');
        expect(components['/_textlist3'].stateValues.texts[1]).eq('6');
        expect(components['/_textlist3'].stateValues.texts[2]).eq('7');
        expect(components['/_textlist3'].stateValues.texts[3]).eq('8');
        expect(components['/_textlist3'].stateValues.texts[4]).eq('9');
        expect(components['/_textlist4'].stateValues.texts[0]).eq('5');
        expect(components['/_textlist4'].stateValues.texts[1]).eq('6');
        expect(components['/_textlist4'].stateValues.texts[2]).eq('7');
        expect(components['/_textlist5'].stateValues.texts[0]).eq('6');
        expect(components['/_textlist5'].stateValues.texts[1]).eq('7');
        expect(components['/_textlist6'].stateValues.texts[0]).eq('8');
        expect(components['/_textlist6'].stateValues.texts[1]).eq('9');
      })


    })
  })

})



