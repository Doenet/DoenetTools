import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Numberlist Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('numberlist from string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <numberlist>5,1+1,pi</numberlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_numberlist1'].stateValues.childrenToRender[0];
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_numberlist1'].stateValues.childrenToRender[1];
      let child2Anchor = cesc('#' + child2Name);
      let child3Name = components['/_numberlist1'].stateValues.childrenToRender[2];
      let child3Anchor = cesc('#' + child3Name);


      cy.log('Test value displayed in browser')
      cy.get(child1Anchor).should('have.text', '5')
      cy.get(child2Anchor).should('have.text', '2')
      cy.get(child3Anchor).should('have.text', '3.141592654')


      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_numberlist1'].activeChildren[0].stateValues.value).eq(5);
        expect(components['/_numberlist1'].activeChildren[1].stateValues.value).eq(2);
        expect(components['/_numberlist1'].activeChildren[2].stateValues.value).closeTo(Math.PI, 14);
        expect(components['/_numberlist1'].stateValues.numbers[0]).eq(5);
        expect(components['/_numberlist1'].stateValues.numbers[1]).eq(2);
        expect(components['/_numberlist1'].stateValues.numbers[2]).closeTo(Math.PI, 14);
      })
    })
  })

  it('numberlist with error in string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <numberlist>5,(, 1+1,</numberlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_numberlist1'].stateValues.childrenToRender[0];
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_numberlist1'].stateValues.childrenToRender[1];
      let child2Anchor = cesc('#' + child2Name);
      let child3Name = components['/_numberlist1'].stateValues.childrenToRender[2];
      let child3Anchor = cesc('#' + child3Name);

      cy.log('Test value displayed in browser')
      cy.get(child1Anchor).should('have.text', '5')
      cy.get(child2Anchor).should('have.text', 'NaN')
      cy.get(child3Anchor).should('have.text', '2')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_numberlist1'].activeChildren[0].stateValues.value).eq(5);
        assert.isNaN(components['/_numberlist1'].activeChildren[1].stateValues.value);
        expect(components['/_numberlist1'].activeChildren[2].stateValues.value).eq(2);
        expect(components['/_numberlist1'].stateValues.numbers[0]).eq(5);
        assert.isNaN(components['/_numberlist1'].stateValues.numbers[1]);
        expect(components['/_numberlist1'].stateValues.numbers[2]).eq(2);
      })
    })
  })

  it('numberlist with number children', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <numberlist>
      <number>5</number>
      <number>1+1</number>
    </numberlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_number1').should('have.text', '5')
    cy.get('#\\/_number2').should('have.text', '2')

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_numberlist1'].activeChildren[0].stateValues.value).eq(5);
      expect(components['/_numberlist1'].activeChildren[1].stateValues.value).eq(2);
      expect(components['/_numberlist1'].stateValues.numbers[0]).eq(5);
      expect(components['/_numberlist1'].stateValues.numbers[1]).eq(2);
    })
  })

  it('numberlist with number and string children', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <numberlist>
      -1, 8/2
      <number>5</number>, 9
      <number>1+1</number>
    </numberlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let numbera = components["/_numberlist1"].activeChildren[0];
      let numberaAnchor = cesc('#' + numbera.componentName);
      let numberb = components["/_numberlist1"].activeChildren[1];
      let numberbAnchor = cesc('#' + numberb.componentName);
      let numberc = components["/_numberlist1"].activeChildren[3];
      let numbercAnchor = cesc('#' + numberc.componentName);


      cy.log('Test value displayed in browser')
      cy.get(numberaAnchor).should('have.text', '-1');
      cy.get(numberbAnchor).should('have.text', '4');
      cy.get('#\\/_number1').should('have.text', '5')
      cy.get(numbercAnchor).should('have.text', '9');
      cy.get('#\\/_number2').should('have.text', '2')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_numberlist1'].activeChildren[0].stateValues.value).eq(-1);
        expect(components['/_numberlist1'].activeChildren[1].stateValues.value).eq(4);
        expect(components['/_numberlist1'].activeChildren[2].stateValues.value).eq(5);
        expect(components['/_numberlist1'].activeChildren[3].stateValues.value).eq(9);
        expect(components['/_numberlist1'].activeChildren[4].stateValues.value).eq(2);
        expect(components['/_numberlist1'].stateValues.numbers[0]).eq(-1);
        expect(components['/_numberlist1'].stateValues.numbers[1]).eq(4);
        expect(components['/_numberlist1'].stateValues.numbers[2]).eq(5);
        expect(components['/_numberlist1'].stateValues.numbers[3]).eq(9);
        expect(components['/_numberlist1'].stateValues.numbers[4]).eq(2);
      })
    })
  })

  it('numberlist with math and number children', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <numberlist>
      <number>5</number>
      <math>1+1</math>
    </numberlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathAdapterName = components['/_math1'].adapterUsed.componentName;
      let mathAdapterAnchor = cesc('#' + mathAdapterName);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_number1').should('have.text', '5')
      cy.get(mathAdapterAnchor).should('have.text', '2')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_numberlist1'].activeChildren[0].stateValues.value).eq(5);
        expect(components['/_numberlist1'].activeChildren[1].stateValues.value).eq(2);
        expect(components['/_numberlist1'].stateValues.numbers[0]).eq(5);
        expect(components['/_numberlist1'].stateValues.numbers[1]).eq(2);
      })
    })
  })

  it('numberlist with numberlist children, test inverse', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <numberlist>
      <number>1</number>
      <numberlist>2,3</numberlist>
      <number>4</number>
      <numberlist>
        <numberlist>
          <number>5</number>
          <numberlist>6,7</numberlist>
        </numberlist>
        <numberlist>8,9</numberlist>
      </numberlist>
    </numberlist>

    <mathinput><copy prop="number1" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number2" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number3" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number4" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number5" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number6" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number7" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number8" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number9" tname="_numberlist1" /></mathinput>

    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_numberlist1'].stateValues.childrenToRender[1];
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_numberlist1'].stateValues.childrenToRender[2];
      let child2Anchor = cesc('#' + child2Name);
      let child5Name = components['/_numberlist1'].stateValues.childrenToRender[5];
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = components['/_numberlist1'].stateValues.childrenToRender[6];
      let child6Anchor = cesc('#' + child6Name);
      let child7Name = components['/_numberlist1'].stateValues.childrenToRender[7];
      let child7Anchor = cesc('#' + child7Name);
      let child8Name = components['/_numberlist1'].stateValues.childrenToRender[8];
      let child8Anchor = cesc('#' + child8Name);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_number1').should('have.text', '1');
      cy.get(child1Anchor).should('have.text', '2');
      cy.get(child2Anchor).should('have.text', '3');
      cy.get('#\\/_number2').should('have.text', '4');
      cy.get('#\\/_number3').should('have.text', '5');
      cy.get(child5Anchor).should('have.text', '6');
      cy.get(child6Anchor).should('have.text', '7');
      cy.get(child7Anchor).should('have.text', '8');
      cy.get(child8Anchor).should('have.text', '9');

      cy.get("#\\/_mathinput1_input").should('have.value', '1')
      cy.get("#\\/_mathinput2_input").should('have.value', '2')
      cy.get("#\\/_mathinput3_input").should('have.value', '3')
      cy.get("#\\/_mathinput4_input").should('have.value', '4')
      cy.get("#\\/_mathinput5_input").should('have.value', '5')
      cy.get("#\\/_mathinput6_input").should('have.value', '6')
      cy.get("#\\/_mathinput7_input").should('have.value', '7')
      cy.get("#\\/_mathinput8_input").should('have.value', '8')
      cy.get("#\\/_mathinput9_input").should('have.value', '9')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_numberlist1'].stateValues.numbers[0]).eq(1);
        expect(components['/_numberlist1'].stateValues.numbers[1]).eq(2);
        expect(components['/_numberlist1'].stateValues.numbers[2]).eq(3);
        expect(components['/_numberlist1'].stateValues.numbers[3]).eq(4);
        expect(components['/_numberlist1'].stateValues.numbers[4]).eq(5);
        expect(components['/_numberlist1'].stateValues.numbers[5]).eq(6);
        expect(components['/_numberlist1'].stateValues.numbers[6]).eq(7);
        expect(components['/_numberlist1'].stateValues.numbers[7]).eq(8);
        expect(components['/_numberlist1'].stateValues.numbers[8]).eq(9);
        expect(components['/_numberlist2'].stateValues.numbers[0]).eq(2);
        expect(components['/_numberlist2'].stateValues.numbers[1]).eq(3);
        expect(components['/_numberlist3'].stateValues.numbers[0]).eq(5);
        expect(components['/_numberlist3'].stateValues.numbers[1]).eq(6);
        expect(components['/_numberlist3'].stateValues.numbers[2]).eq(7);
        expect(components['/_numberlist3'].stateValues.numbers[3]).eq(8);
        expect(components['/_numberlist3'].stateValues.numbers[4]).eq(9);
        expect(components['/_numberlist4'].stateValues.numbers[0]).eq(5);
        expect(components['/_numberlist4'].stateValues.numbers[1]).eq(6);
        expect(components['/_numberlist4'].stateValues.numbers[2]).eq(7);
        expect(components['/_numberlist5'].stateValues.numbers[0]).eq(6);
        expect(components['/_numberlist5'].stateValues.numbers[1]).eq(7);
        expect(components['/_numberlist6'].stateValues.numbers[0]).eq(8);
        expect(components['/_numberlist6'].stateValues.numbers[1]).eq(9);
      })

      cy.log('change values')

      cy.get("#\\/_mathinput1_input").clear().type("-11{enter}")
      cy.get("#\\/_mathinput2_input").clear().type("-12{enter}")
      cy.get("#\\/_mathinput3_input").clear().type("-13{enter}")
      cy.get("#\\/_mathinput4_input").clear().type("-14{enter}")
      cy.get("#\\/_mathinput5_input").clear().type("-15{enter}")
      cy.get("#\\/_mathinput6_input").clear().type("-16{enter}")
      cy.get("#\\/_mathinput7_input").clear().type("-17{enter}")
      cy.get("#\\/_mathinput8_input").clear().type("-18{enter}")
      cy.get("#\\/_mathinput9_input").clear().type("-19{enter}")


      cy.log('Test value displayed in browser')
      cy.get('#\\/_number1').should('have.text', '-11');
      cy.get(child1Anchor).should('have.text', '-12');
      cy.get(child2Anchor).should('have.text', '-13');
      cy.get('#\\/_number2').should('have.text', '-14');
      cy.get('#\\/_number3').should('have.text', '-15');
      cy.get(child5Anchor).should('have.text', '-16');
      cy.get(child6Anchor).should('have.text', '-17');
      cy.get(child7Anchor).should('have.text', '-18');
      cy.get(child8Anchor).should('have.text', '-19');

      cy.get("#\\/_mathinput1_input").should('have.value', '-11')
      cy.get("#\\/_mathinput2_input").should('have.value', '-12')
      cy.get("#\\/_mathinput3_input").should('have.value', '-13')
      cy.get("#\\/_mathinput4_input").should('have.value', '-14')
      cy.get("#\\/_mathinput5_input").should('have.value', '-15')
      cy.get("#\\/_mathinput6_input").should('have.value', '-16')
      cy.get("#\\/_mathinput7_input").should('have.value', '-17')
      cy.get("#\\/_mathinput8_input").should('have.value', '-18')
      cy.get("#\\/_mathinput9_input").should('have.value', '-19')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_numberlist1'].stateValues.numbers[0]).eq(-11);
        expect(components['/_numberlist1'].stateValues.numbers[1]).eq(-12);
        expect(components['/_numberlist1'].stateValues.numbers[2]).eq(-13);
        expect(components['/_numberlist1'].stateValues.numbers[3]).eq(-14);
        expect(components['/_numberlist1'].stateValues.numbers[4]).eq(-15);
        expect(components['/_numberlist1'].stateValues.numbers[5]).eq(-16);
        expect(components['/_numberlist1'].stateValues.numbers[6]).eq(-17);
        expect(components['/_numberlist1'].stateValues.numbers[7]).eq(-18);
        expect(components['/_numberlist1'].stateValues.numbers[8]).eq(-19);
        expect(components['/_numberlist2'].stateValues.numbers[0]).eq(-12);
        expect(components['/_numberlist2'].stateValues.numbers[1]).eq(-13);
        expect(components['/_numberlist3'].stateValues.numbers[0]).eq(-15);
        expect(components['/_numberlist3'].stateValues.numbers[1]).eq(-16);
        expect(components['/_numberlist3'].stateValues.numbers[2]).eq(-17);
        expect(components['/_numberlist3'].stateValues.numbers[3]).eq(-18);
        expect(components['/_numberlist3'].stateValues.numbers[4]).eq(-19);
        expect(components['/_numberlist4'].stateValues.numbers[0]).eq(-15);
        expect(components['/_numberlist4'].stateValues.numbers[1]).eq(-16);
        expect(components['/_numberlist4'].stateValues.numbers[2]).eq(-17);
        expect(components['/_numberlist5'].stateValues.numbers[0]).eq(-16);
        expect(components['/_numberlist5'].stateValues.numbers[1]).eq(-17);
        expect(components['/_numberlist6'].stateValues.numbers[0]).eq(-18);
        expect(components['/_numberlist6'].stateValues.numbers[1]).eq(-19);
      })


    })
  })

  it('numberlist with numberlist children and sugar, test inverse', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <numberlist>
      1,
      <numberlist>2,3</numberlist>,
      <number>4</number>
      <numberlist>
        <numberlist>
          5
          <numberlist>6,7</numberlist>
        </numberlist>
        <numberlist>8,9</numberlist>
      </numberlist>
    </numberlist>

    <mathinput><copy prop="number1" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number2" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number3" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number4" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number5" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number6" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number7" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number8" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number9" tname="_numberlist1" /></mathinput>

    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child0Name = components['/_numberlist1'].stateValues.childrenToRender[0];
      let child0Anchor = cesc('#' + child0Name);
      let child1Name = components['/_numberlist1'].stateValues.childrenToRender[1];
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_numberlist1'].stateValues.childrenToRender[2];
      let child2Anchor = cesc('#' + child2Name);
      let child4Name = components['/_numberlist1'].stateValues.childrenToRender[4];
      let child4Anchor = cesc('#' + child4Name);
      let child5Name = components['/_numberlist1'].stateValues.childrenToRender[5];
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = components['/_numberlist1'].stateValues.childrenToRender[6];
      let child6Anchor = cesc('#' + child6Name);
      let child7Name = components['/_numberlist1'].stateValues.childrenToRender[7];
      let child7Anchor = cesc('#' + child7Name);
      let child8Name = components['/_numberlist1'].stateValues.childrenToRender[8];
      let child8Anchor = cesc('#' + child8Name);

      cy.log('Test value displayed in browser')
      cy.get(child0Anchor).should('have.text', '1');
      cy.get(child1Anchor).should('have.text', '2');
      cy.get(child2Anchor).should('have.text', '3');
      cy.get('#\\/_number1').should('have.text', '4');
      cy.get(child4Anchor).should('have.text', '5');
      cy.get(child5Anchor).should('have.text', '6');
      cy.get(child6Anchor).should('have.text', '7');
      cy.get(child7Anchor).should('have.text', '8');
      cy.get(child8Anchor).should('have.text', '9');

      cy.get("#\\/_mathinput1_input").should('have.value', '1')
      cy.get("#\\/_mathinput2_input").should('have.value', '2')
      cy.get("#\\/_mathinput3_input").should('have.value', '3')
      cy.get("#\\/_mathinput4_input").should('have.value', '4')
      cy.get("#\\/_mathinput5_input").should('have.value', '5')
      cy.get("#\\/_mathinput6_input").should('have.value', '6')
      cy.get("#\\/_mathinput7_input").should('have.value', '7')
      cy.get("#\\/_mathinput8_input").should('have.value', '8')
      cy.get("#\\/_mathinput9_input").should('have.value', '9')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_numberlist1'].stateValues.numbers[0]).eq(1);
        expect(components['/_numberlist1'].stateValues.numbers[1]).eq(2);
        expect(components['/_numberlist1'].stateValues.numbers[2]).eq(3);
        expect(components['/_numberlist1'].stateValues.numbers[3]).eq(4);
        expect(components['/_numberlist1'].stateValues.numbers[4]).eq(5);
        expect(components['/_numberlist1'].stateValues.numbers[5]).eq(6);
        expect(components['/_numberlist1'].stateValues.numbers[6]).eq(7);
        expect(components['/_numberlist1'].stateValues.numbers[7]).eq(8);
        expect(components['/_numberlist1'].stateValues.numbers[8]).eq(9);
        expect(components['/_numberlist2'].stateValues.numbers[0]).eq(2);
        expect(components['/_numberlist2'].stateValues.numbers[1]).eq(3);
        expect(components['/_numberlist3'].stateValues.numbers[0]).eq(5);
        expect(components['/_numberlist3'].stateValues.numbers[1]).eq(6);
        expect(components['/_numberlist3'].stateValues.numbers[2]).eq(7);
        expect(components['/_numberlist3'].stateValues.numbers[3]).eq(8);
        expect(components['/_numberlist3'].stateValues.numbers[4]).eq(9);
        expect(components['/_numberlist4'].stateValues.numbers[0]).eq(5);
        expect(components['/_numberlist4'].stateValues.numbers[1]).eq(6);
        expect(components['/_numberlist4'].stateValues.numbers[2]).eq(7);
        expect(components['/_numberlist5'].stateValues.numbers[0]).eq(6);
        expect(components['/_numberlist5'].stateValues.numbers[1]).eq(7);
        expect(components['/_numberlist6'].stateValues.numbers[0]).eq(8);
        expect(components['/_numberlist6'].stateValues.numbers[1]).eq(9);
      })

      cy.log('change values')

      cy.get("#\\/_mathinput1_input").clear().type("-11{enter}")
      cy.get("#\\/_mathinput2_input").clear().type("-12{enter}")
      cy.get("#\\/_mathinput3_input").clear().type("-13{enter}")
      cy.get("#\\/_mathinput4_input").clear().type("-14{enter}")
      cy.get("#\\/_mathinput5_input").clear().type("-15{enter}")
      cy.get("#\\/_mathinput6_input").clear().type("-16{enter}")
      cy.get("#\\/_mathinput7_input").clear().type("-17{enter}")
      cy.get("#\\/_mathinput8_input").clear().type("-18{enter}")
      cy.get("#\\/_mathinput9_input").clear().type("-19{enter}")


      cy.log('Test value displayed in browser')
      cy.get(child0Anchor).should('have.text', '-11');
      cy.get(child1Anchor).should('have.text', '-12');
      cy.get(child2Anchor).should('have.text', '-13');
      cy.get('#\\/_number1').should('have.text', '-14');
      cy.get(child4Anchor).should('have.text', '-15');
      cy.get(child5Anchor).should('have.text', '-16');
      cy.get(child6Anchor).should('have.text', '-17');
      cy.get(child7Anchor).should('have.text', '-18');
      cy.get(child8Anchor).should('have.text', '-19');

      cy.get("#\\/_mathinput1_input").should('have.value', '-11')
      cy.get("#\\/_mathinput2_input").should('have.value', '-12')
      cy.get("#\\/_mathinput3_input").should('have.value', '-13')
      cy.get("#\\/_mathinput4_input").should('have.value', '-14')
      cy.get("#\\/_mathinput5_input").should('have.value', '-15')
      cy.get("#\\/_mathinput6_input").should('have.value', '-16')
      cy.get("#\\/_mathinput7_input").should('have.value', '-17')
      cy.get("#\\/_mathinput8_input").should('have.value', '-18')
      cy.get("#\\/_mathinput9_input").should('have.value', '-19')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_numberlist1'].stateValues.numbers[0]).eq(-11);
        expect(components['/_numberlist1'].stateValues.numbers[1]).eq(-12);
        expect(components['/_numberlist1'].stateValues.numbers[2]).eq(-13);
        expect(components['/_numberlist1'].stateValues.numbers[3]).eq(-14);
        expect(components['/_numberlist1'].stateValues.numbers[4]).eq(-15);
        expect(components['/_numberlist1'].stateValues.numbers[5]).eq(-16);
        expect(components['/_numberlist1'].stateValues.numbers[6]).eq(-17);
        expect(components['/_numberlist1'].stateValues.numbers[7]).eq(-18);
        expect(components['/_numberlist1'].stateValues.numbers[8]).eq(-19);
        expect(components['/_numberlist2'].stateValues.numbers[0]).eq(-12);
        expect(components['/_numberlist2'].stateValues.numbers[1]).eq(-13);
        expect(components['/_numberlist3'].stateValues.numbers[0]).eq(-15);
        expect(components['/_numberlist3'].stateValues.numbers[1]).eq(-16);
        expect(components['/_numberlist3'].stateValues.numbers[2]).eq(-17);
        expect(components['/_numberlist3'].stateValues.numbers[3]).eq(-18);
        expect(components['/_numberlist3'].stateValues.numbers[4]).eq(-19);
        expect(components['/_numberlist4'].stateValues.numbers[0]).eq(-15);
        expect(components['/_numberlist4'].stateValues.numbers[1]).eq(-16);
        expect(components['/_numberlist4'].stateValues.numbers[2]).eq(-17);
        expect(components['/_numberlist5'].stateValues.numbers[0]).eq(-16);
        expect(components['/_numberlist5'].stateValues.numbers[1]).eq(-17);
        expect(components['/_numberlist6'].stateValues.numbers[0]).eq(-18);
        expect(components['/_numberlist6'].stateValues.numbers[1]).eq(-19);
      })


    })
  })

  it('numberlist with self references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <numberlist>
      <number>1</number>
      <numberlist>2,3</numberlist>
      <copy prop="number3" tname="_numberlist1" />
      <numberlist>
        <numberlist name="mid">
          <number><copy prop="number1" tname="_numberlist1"/></number>
          <numberlist>4,5</numberlist>
        </numberlist>
        <numberlist>
          <copy prop="number2" tname="_numberlist1"/>
          <copy prop="number5" tname="_numberlist1"/>
        </numberlist>
      </numberlist>
      <copy tname="mid" />
    </numberlist>

    <mathinput><copy prop="number1" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number2" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number3" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number4" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number5" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number6" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number7" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number8" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number9" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number10" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number11" tname="_numberlist1" /></mathinput>
    <mathinput><copy prop="number12" tname="_numberlist1" /></mathinput>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child0Name = components['/_numberlist1'].stateValues.childrenToRender[0];
      let ca0 = cesc('#' + child0Name);
      let child1Name = components['/_numberlist1'].stateValues.childrenToRender[1];
      let ca1 = cesc('#' + child1Name);
      let child2Name = components['/_numberlist1'].stateValues.childrenToRender[2];
      let ca2 = cesc('#' + child2Name);
      let child3Name = components['/_numberlist1'].stateValues.childrenToRender[3];
      let ca3 = cesc('#' + child3Name);
      let child4Name = components['/_numberlist1'].stateValues.childrenToRender[4];
      let ca4 = cesc('#' + child4Name);
      let child5Name = components['/_numberlist1'].stateValues.childrenToRender[5];
      let ca5 = cesc('#' + child5Name);
      let child6Name = components['/_numberlist1'].stateValues.childrenToRender[6];
      let ca6 = cesc('#' + child6Name);
      let child7Name = components['/_numberlist1'].stateValues.childrenToRender[7];
      let ca7 = cesc('#' + child7Name);
      let child8Name = components['/_numberlist1'].stateValues.childrenToRender[8];
      let ca8 = cesc('#' + child8Name);
      let child9Name = components['/_numberlist1'].stateValues.childrenToRender[9];
      let ca9 = cesc('#' + child9Name);
      let child10Name = components['/_numberlist1'].stateValues.childrenToRender[10];
      let ca10 = cesc('#' + child10Name);
      let child11Name = components['/_numberlist1'].stateValues.childrenToRender[11];
      let ca11 = cesc('#' + child11Name);


      let childAnchors = [ca0, ca1, ca2, ca3, ca4, ca5, ca6, ca7, ca8, ca9, ca10, ca11]
      let vals = [1, 2, 3, 4, 5]
      let mapping = [0, 1, 2, 2, 0, 3, 4, 1, 0, 0, 3, 4];
      let mv = i => vals[mapping[i]];

      let numbers = components['/_numberlist1'].stateValues.numbers;

      let mathinputAnchors = []
      for (let i in mapping) {
        mathinputAnchors.push(`#\\/_mathinput${Number(i) + 1}_input`)

      }

      cy.log('Test value displayed in browser')

      for (let i in mapping) {
        cy.get(childAnchors[i]).should('have.text', String(mv(i)))
        cy.get(mathinputAnchors[i]).should('have.value', String(mv(i)))
      }

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        for (let i in mapping) {
          expect(numbers[i]).eq(mv(i));
        }
      })

      cy.log('change values')

      for (let changeInd in mapping) {
        cy.window().then((win) => {
          vals[mapping[changeInd]] = 100 + Number(changeInd);
          cy.get(mathinputAnchors[changeInd]).clear().type((100 + Number(changeInd)) + "{enter}");

          cy.log('Test value displayed in browser')

          for (let i in mapping) {
            cy.get(childAnchors[i]).should('have.text', String(mv(i)))
            cy.get(mathinputAnchors[i]).should('have.value', String(mv(i)))
          }

          cy.log('Test internal values are set to the correct values')
          cy.window().then((win) => {
            for (let i in mapping) {
              expect(numbers[i]).eq(mv(i));
            }
          })


        })

      }


    })
  })

  it('numberlist with maximum number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <numberlist maximumnumber="7">
      <number>1</number>
      <numberlist maximumnumber="2">2,3,4,5</numberlist>
      <number>6</number>
      <numberlist maximumnumber="4">
        <numberlist maximumnumber="2">
          <number>7</number>
          <numberlist>8,9</numberlist>
        </numberlist>
        <numberlist>10,11,12</numberlist>
      </numberlist>
    </numberlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_numberlist1'].stateValues.childrenToRender[1];
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_numberlist1'].stateValues.childrenToRender[2];
      let child2Anchor = cesc('#' + child2Name);
      let child5Name = components['/_numberlist1'].stateValues.childrenToRender[5];
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = components['/_numberlist1'].stateValues.childrenToRender[6];
      let child6Anchor = cesc('#' + child6Name);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_number1').should('have.text', '1')
      cy.get(child1Anchor).should('have.text', '2');
      cy.get(child2Anchor).should('have.text', '3');
      cy.get('#\\/_number2').should('have.text', '6')
      cy.get('#\\/_number3').should('have.text', '7')
      cy.get(child5Anchor).should('have.text', '8');
      cy.get(child6Anchor).should('have.text', '10');

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_numberlist1'].stateValues.numbers.length).eq(7);
        expect(components['/_numberlist1'].stateValues.numbers[0]).eq(1);
        expect(components['/_numberlist1'].stateValues.numbers[1]).eq(2);
        expect(components['/_numberlist1'].stateValues.numbers[2]).eq(3);
        expect(components['/_numberlist1'].stateValues.numbers[3]).eq(6);
        expect(components['/_numberlist1'].stateValues.numbers[4]).eq(7);
        expect(components['/_numberlist1'].stateValues.numbers[5]).eq(8);
        expect(components['/_numberlist1'].stateValues.numbers[6]).eq(10);
        expect(components['/_numberlist2'].stateValues.numbers.length).eq(2);
        expect(components['/_numberlist2'].stateValues.numbers[0]).eq(2);
        expect(components['/_numberlist2'].stateValues.numbers[1]).eq(3);
        expect(components['/_numberlist3'].stateValues.numbers.length).eq(4);
        expect(components['/_numberlist3'].stateValues.numbers[0]).eq(7);
        expect(components['/_numberlist3'].stateValues.numbers[1]).eq(8);
        expect(components['/_numberlist3'].stateValues.numbers[2]).eq(10);
        expect(components['/_numberlist3'].stateValues.numbers[3]).eq(11);
        expect(components['/_numberlist4'].stateValues.numbers.length).eq(2);
        expect(components['/_numberlist4'].stateValues.numbers[0]).eq(7);
        expect(components['/_numberlist4'].stateValues.numbers[1]).eq(8);
        expect(components['/_numberlist5'].stateValues.numbers.length).eq(2);
        expect(components['/_numberlist5'].stateValues.numbers[0]).eq(8);
        expect(components['/_numberlist5'].stateValues.numbers[1]).eq(9);
        expect(components['/_numberlist6'].stateValues.numbers.length).eq(3);
        expect(components['/_numberlist6'].stateValues.numbers[0]).eq(10);
        expect(components['/_numberlist6'].stateValues.numbers[1]).eq(11);
        expect(components['/_numberlist6'].stateValues.numbers[2]).eq(12);
      })
    })
  })

  it('numberlist within numberlists, ignore child hide', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist hide="true">1,2,3</numberlist></p>

    <p><copy name="numberlist1a" hide="false" tname="_numberlist1" /></p>

    <p><numberlist>
      <number>4</number>
      <copy tname="_numberlist1" />
      <number hide>5</number>
      <copy tname="numberlist1a" />
    </numberlist></p>

    <p><copy name="numberlist3" maximumnumber="6" tname="_numberlist2" /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')

    cy.get('#\\/_p1').should('have.text', '')

    cy.get('#\\/_p2').should('have.text', '1, 2, 3')

    cy.get('#\\/_p3').should('have.text', '4, 1, 2, 3, 5, 1, 2, 3')

    cy.get('#\\/_p4').should('have.text', '4, 1, 2, 3, 5, 1')


    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let numberlist1a = components["/numberlist1a"].replacements[0];
      let numberlist3 = components["/numberlist3"].replacements[0];
      expect(components['/_numberlist1'].stateValues.numbers.length).eq(3);
      expect(components['/_numberlist1'].stateValues.numbers[0]).eq(1);
      expect(components['/_numberlist1'].stateValues.numbers[1]).eq(2);
      expect(components['/_numberlist1'].stateValues.numbers[2]).eq(3);
      expect(numberlist1a.stateValues.numbers.length).eq(3);
      expect(numberlist1a.stateValues.numbers[0]).eq(1);
      expect(numberlist1a.stateValues.numbers[1]).eq(2);
      expect(numberlist1a.stateValues.numbers[2]).eq(3);
      expect(components['/_numberlist2'].stateValues.numbers.length).eq(8);
      expect(components['/_numberlist2'].stateValues.numbers[0]).eq(4);
      expect(components['/_numberlist2'].stateValues.numbers[1]).eq(1);
      expect(components['/_numberlist2'].stateValues.numbers[2]).eq(2);
      expect(components['/_numberlist2'].stateValues.numbers[3]).eq(3);
      expect(components['/_numberlist2'].stateValues.numbers[4]).eq(5);
      expect(components['/_numberlist2'].stateValues.numbers[5]).eq(1);
      expect(components['/_numberlist2'].stateValues.numbers[6]).eq(2);
      expect(components['/_numberlist2'].stateValues.numbers[7]).eq(3);
      expect(numberlist3.stateValues.numbers.length).eq(6);
      expect(numberlist3.stateValues.numbers[0]).eq(4);
      expect(numberlist3.stateValues.numbers[1]).eq(1);
      expect(numberlist3.stateValues.numbers[2]).eq(2);
      expect(numberlist3.stateValues.numbers[3]).eq(3);
      expect(numberlist3.stateValues.numbers[4]).eq(5);
      expect(numberlist3.stateValues.numbers[5]).eq(1);

    })

  })

})
