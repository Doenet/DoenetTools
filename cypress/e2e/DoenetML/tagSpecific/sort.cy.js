
describe('Sort Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })


  it('sort numbers and math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <aslist>
  <sort assignNames="x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13" name="s">
    <number>3</number>
    <math>pi</math>
    <math>1</math>
    <math>e</math>
    <number displayDigits="5">sqrt(2)</number>
    <math>sqrt(3)</math>
    <numberlist>-3 10 2</numberlist>
    <mathlist>log(2) 1/e sin(2) -2/3</mathlist>
  </sort>
  </aslist>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/x1').should('have.text', '-3')
    cy.get('#\\/x2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−23')
    })
    cy.get('#\\/x3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1e')
    })
    cy.get('#\\/x4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('log(2)')
    })
    cy.get('#\\/x5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2)')
    })
    cy.get('#\\/x6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/x7').should('have.text', '1.4142')
    cy.get('#\\/x8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('√3')
    })
    cy.get('#\\/x9').should('have.text', '2')
    cy.get('#\\/x10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get('#\\/x11').should('have.text', '3')

    cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('π')
    })
    cy.get('#\\/x13').should('have.text', '10')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x1'].stateValues.value).eq(-3)
      expect(stateVariables['/x2'].stateValues.value).eqls(['-', ['/', 2, 3]])
      expect(stateVariables['/x3'].stateValues.value).eqls(['/', 1, 'e'])
      expect(stateVariables['/x4'].stateValues.value).eqls(['apply', 'log', 2])
      expect(stateVariables['/x5'].stateValues.value).eqls(['apply', 'sin', 2])
      expect(stateVariables['/x6'].stateValues.value).eqls(1)
      expect(stateVariables['/x7'].stateValues.value).closeTo(Math.sqrt(2), 1E-14)
      expect(stateVariables['/x8'].stateValues.value).eqls(['apply', 'sqrt', 3])
      expect(stateVariables['/x9'].stateValues.value).eq(2)
      expect(stateVariables['/x10'].stateValues.value).eqls('e')
      expect(stateVariables['/x11'].stateValues.value).eq(3)
      expect(stateVariables['/x12'].stateValues.value).eqls('pi')
      expect(stateVariables['/x13'].stateValues.value).eq(10)


    })



  })

  it('sort dynamic maths', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Values to sort: 
  <mathinput name="m1" prefill="sqrt(2)" />
  <mathinput name="m2" prefill="5/6" />
  <mathinput name="m3" prefill="Infinity" />
  <mathinput name="m4" prefill="-Infinity" />
  </p>
  <aslist>
  <sort assignNames="x1 x2 x3 x4 x5 x6" name="s">
    $m1$m2$m3
    <number>$m4</number>
    <number>70</number>
    <math>-pi</math>
  </sort>
  </aslist>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/x1').should('have.text', "-∞")
    cy.get('#\\/x2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−π')
    })
    cy.get('#\\/x3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('56')
    })
    cy.get('#\\/x4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('√2')
    })
    cy.get('#\\/x5').should('have.text', '70')
    cy.get('#\\/x6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x1'].stateValues.value).eq(-Infinity)
      expect(stateVariables['/x2'].stateValues.value).eqls(['-', 'pi'])
      expect(stateVariables['/x3'].stateValues.value).eqls(['/', 5, 6])
      expect(stateVariables['/x4'].stateValues.value).eqls(['apply', 'sqrt', 2])
      expect(stateVariables['/x5'].stateValues.value).eq(70)
      expect(stateVariables['/x6'].stateValues.value).eqls(Infinity)
    })


    cy.log('change first value')
    cy.get('#\\/m1 textarea').type('{ctrl+home}{shift+end}{backspace}-5{enter}', { force: true })

    cy.get('#\\/x2').should('contain.text', '−5')

    cy.get('#\\/x1').should('have.text', "-∞")
    cy.get('#\\/x2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−5')
    })
    cy.get('#\\/x3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−π')
    })
    cy.get('#\\/x4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('56')
    })
    cy.get('#\\/x5').should('have.text', '70')

    cy.get('#\\/x6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x1'].stateValues.value).eq(-Infinity)
      expect(stateVariables['/x2'].stateValues.value).eqls(-5)
      expect(stateVariables['/x3'].stateValues.value).eqls(['-', 'pi'])
      expect(stateVariables['/x4'].stateValues.value).eqls(['/', 5, 6])
      expect(stateVariables['/x5'].stateValues.value).eq(70)
      expect(stateVariables['/x6'].stateValues.value).eqls(Infinity)
    })



    cy.log('change second value')
    cy.get('#\\/m2 textarea').type('{ctrl+home}{shift+end}{backspace}e^5{enter}', { force: true })

    cy.get('#\\/x4').should('have.text', '70')
    cy.get('#\\/x1').should('have.text', "-∞")
    cy.get('#\\/x2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−5')
    })
    cy.get('#\\/x3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−π')
    })
    cy.get('#\\/x5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e5')
    })
    cy.get('#\\/x6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x1'].stateValues.value).eq(-Infinity)
      expect(stateVariables['/x2'].stateValues.value).eqls(-5)
      expect(stateVariables['/x3'].stateValues.value).eqls(['-', 'pi'])
      expect(stateVariables['/x4'].stateValues.value).eq(70)
      expect(stateVariables['/x5'].stateValues.value).eqls(['^', 'e', 5])
      expect(stateVariables['/x6'].stateValues.value).eqls(Infinity)
    })


    cy.log('change third value')
    cy.get('#\\/m3 textarea').type('{end}{backspace}-100{enter}', { force: true })

    cy.get('#\\/x5').should('have.text', '70')
    cy.get('#\\/x1').should('have.text', "-∞")
    cy.get('#\\/x2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−100')
    })
    cy.get('#\\/x3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−5')
    })
    cy.get('#\\/x4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−π')
    })
    cy.get('#\\/x6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e5')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x1'].stateValues.value).eq(-Infinity)
      expect(stateVariables['/x2'].stateValues.value).eqls(-100)
      expect(stateVariables['/x3'].stateValues.value).eqls(-5)
      expect(stateVariables['/x4'].stateValues.value).eqls(['-', 'pi'])
      expect(stateVariables['/x5'].stateValues.value).eq(70)
      expect(stateVariables['/x6'].stateValues.value).eqls(['^', 'e', 5])
    })


    cy.log('change fourth value')
    cy.get('#\\/m4 textarea').type('{end}{backspace}{backspace}0{enter}', { force: true })

    cy.get('#\\/x4').should('have.text', "0")
    cy.get('#\\/x1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−100')
    })
    cy.get('#\\/x2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−5')
    })
    cy.get('#\\/x3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−π')
    })
    cy.get('#\\/x5').should('have.text', '70')
    cy.get('#\\/x6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e5')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x1'].stateValues.value).eqls(-100)
      expect(stateVariables['/x2'].stateValues.value).eqls(-5)
      expect(stateVariables['/x3'].stateValues.value).eqls(['-', 'pi'])
      expect(stateVariables['/x4'].stateValues.value).eq(0)
      expect(stateVariables['/x5'].stateValues.value).eq(70)
      expect(stateVariables['/x6'].stateValues.value).eqls(['^', 'e', 5])
    })

  })

  it('sort nested lists of numbers and math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <aslist>
  <sort assignNames="x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13" name="s">
    <numberlist>
      <numberlist>
        <numberlist>
          <number displayDigits="5">sqrt(2)</number><number>10</number>
        </numberlist>
        <numberlist>2</numberlist>
        <number>3</number>
      </numberlist>
      <numberlist>-3</numberlist>
    </numberlist>
    <mathlist>
      <mathlist>sqrt(3) 1/e</mathlist>
      <mathlist>
        <mathlist>e pi</mathlist>
        <mathlist>
          <mathlist>log(2) 1</mathlist>
          <mathlist>
            <mathlist>sin(2) -2/3</mathlist>
          </mathlist>
        </mathlist>
      </mathlist>
    </mathlist>
  </sort>
  </aslist>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/x1').should('have.text', '-3')
    cy.get('#\\/x2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−23')
    })
    cy.get('#\\/x3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1e')
    })
    cy.get('#\\/x4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('log(2)')
    })
    cy.get('#\\/x5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2)')
    })
    cy.get('#\\/x6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/x7').should('have.text', '1.4142')
    cy.get('#\\/x8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('√3')
    })
    cy.get('#\\/x9').should('have.text', '2')
    cy.get('#\\/x10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get('#\\/x11').should('have.text', '3')

    cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('π')
    })
    cy.get('#\\/x13').should('have.text', '10')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x1'].stateValues.value).eq(-3)
      expect(stateVariables['/x2'].stateValues.value).eqls(['-', ['/', 2, 3]])
      expect(stateVariables['/x3'].stateValues.value).eqls(['/', 1, 'e'])
      expect(stateVariables['/x4'].stateValues.value).eqls(['apply', 'log', 2])
      expect(stateVariables['/x5'].stateValues.value).eqls(['apply', 'sin', 2])
      expect(stateVariables['/x6'].stateValues.value).eqls(1)
      expect(stateVariables['/x7'].stateValues.value).closeTo(Math.sqrt(2), 1E-14)
      expect(stateVariables['/x8'].stateValues.value).eqls(['apply', 'sqrt', 3])
      expect(stateVariables['/x9'].stateValues.value).eq(2)
      expect(stateVariables['/x10'].stateValues.value).eqls('e')
      expect(stateVariables['/x11'].stateValues.value).eq(3)
      expect(stateVariables['/x12'].stateValues.value).eqls('pi')
      expect(stateVariables['/x13'].stateValues.value).eq(10)


    })



  })

  it('sort points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="A">(0,1)</point>
    <point name="B">(-2,1)</point>
    <point name="C">(7,1)</point>
    <point name="D">(3,1)</point>
    <point name="E">(5,1)</point>
  </graph>

  <sort assignNames="P1 P2 P3 P4 P5">$A$B$C$D$E</sort>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/P1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,1)')
    })
    cy.get('#\\/P2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,1)')
    })
    cy.get('#\\/P3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,1)')
    })
    cy.get('#\\/P4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/P5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,1)')
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -8, y: 9 }
      })
    })


    cy.get('#\\/P1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−8,9)')
    })
    cy.get('#\\/P2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,1)')
    })
    cy.get('#\\/P3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,1)')
    })
    cy.get('#\\/P4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/P5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,1)')
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 8, y: -3 }
      })
    })

    cy.get('#\\/P1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−8,9)')
    })
    cy.get('#\\/P2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,1)')
    })
    cy.get('#\\/P3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/P4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,1)')
    })
    cy.get('#\\/P5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(8,−3)')
    })


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: 4, y: 5 }
      })
    })

    cy.get('#\\/P1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−8,9)')
    })
    cy.get('#\\/P2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,1)')
    })
    cy.get('#\\/P3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,5)')
    })
    cy.get('#\\/P4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/P5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(8,−3)')
    })


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/D",
        args: { x: -9, y: 0 }
      })
    })

    cy.get('#\\/P1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−9,0)')
    })
    cy.get('#\\/P2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−8,9)')
    })
    cy.get('#\\/P3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,5)')
    })
    cy.get('#\\/P4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/P5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(8,−3)')
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/E",
        args: { x: -2, y: -1 }
      })
    })

    cy.get('#\\/P1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−9,0)')
    })
    cy.get('#\\/P2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−8,9)')
    })
    cy.get('#\\/P3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,−1)')
    })
    cy.get('#\\/P4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,5)')
    })
    cy.get('#\\/P5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(8,−3)')
    })



  })

  it('sort points by component', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="A">(0,5)</point>
    <point name="B">(-2,6)</point>
    <point name="C">(7,-3)</point>
    <point name="D">(3,2)</point>
    <point name="E">(5,1)</point>
  </graph>

  <sort assignNames="P1 P2 P3 P4 P5">$A$B$C$D$E</sort>
  <sort assignNames="Px1 Px2 Px3 Px4 Px5" sortByComponent="1">$A$B$C$D$E</sort>
  <sort assignNames="Py1 Py2 Py3 Py4 Py5" sortByComponent="2">$A$B$C$D$E</sort>
  <sort assignNames="Pu1 Pu2 Pu3 Pu4 Pu5" sortByComponent="3">$A$B$C$D$E</sort>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/P1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/P2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/P3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/P4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/P5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−3)')
    })


    cy.get('#\\/Px1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/Px2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Px3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Px4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/Px5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−3)')
    })


    cy.get('#\\/Py1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−3)')
    })
    cy.get('#\\/Py2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/Py3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Py4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Py5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })


    cy.get('#\\/Pu1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Pu2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/Pu3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−3)')
    })
    cy.get('#\\/Pu4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Pu5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })



  })

  it('sort vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <vector name="A" displacement="(0,5)" tail="(5,2)" />
    <vector name="B" displacement="(-2,6)" tail="(3,7)" />
    <vector name="C" displacement="(7,-2)" tail="(-4,5)" />
    <vector name="D" displacement="(3,2)" tail="(1,6)" />
    <vector name="E" displacement="(5,1)" tail="(0,-3)" />
  </graph>

  <sort assignNames="V1 V2 V3 V4 V5">$A$B$C$D$E</sort>
  <sort assignNames="Vd1 Vd2 Vd3 Vd4 Vd5" sortVectorsBy="displacement">$A$B$C$D$E</sort>
  <sort assignNames="Vt1 Vt2 Vt3 Vt4 Vt5" sortVectorsBy="tail">$A$B$C$D$E</sort>

  <sort assignNames="Vx1 Vx2 Vx3 Vx4 Vx5" sortByComponent="1">$A$B$C$D$E</sort>
  <sort assignNames="Vxd1 Vxd2 Vxd3 Vxd4 Vxd5" sortVectorsBy="displacement" sortByComponent="1">$A$B$C$D$E</sort>
  <sort assignNames="Vxt1 Vxt2 Vxt3 Vxt4 Vxt5" sortVectorsBy="tail" sortByComponent="1">$A$B$C$D$E</sort>

  <sort assignNames="Vy1 Vy2 Vy3 Vy4 Vy5" sortByComponent="2">$A$B$C$D$E</sort>
  <sort assignNames="Vyd1 Vyd2 Vyd3 Vyd4 Vyd5" sortVectorsBy="displacement" sortByComponent="2">$A$B$C$D$E</sort>
  <sort assignNames="Vyt1 Vyt2 Vyt3 Vyt4 Vyt5" sortVectorsBy="tail" sortByComponent="2">$A$B$C$D$E</sort>

  <sort assignNames="Vu1 Vu2 Vu3 Vu4 Vu5" sortByComponent="3">$A$B$C$D$E</sort>
  <sort assignNames="Vud1 Vud2 Vud3 Vud4 Vud5" sortVectorsBy="displacement" sortByComponent="3">$A$B$C$D$E</sort>
  <sort assignNames="Vut1 Vut2 Vut3 Vut4 Vut5" sortVectorsBy="tail" sortByComponent="3">$A$B$C$D$E</sort>



  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/V1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/V2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/V3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/V4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/V5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })


    cy.get('#\\/Vd1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/Vd2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Vd3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Vd4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/Vd5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })


    cy.get('#\\/Vt1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })
    cy.get('#\\/Vt2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/Vt3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Vt4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/Vt5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })


    cy.get('#\\/Vx1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/Vx2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Vx3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Vx4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/Vx5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })


    cy.get('#\\/Vxd1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/Vxd2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Vxd3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Vxd4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/Vxd5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })


    cy.get('#\\/Vxt1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })
    cy.get('#\\/Vxt2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/Vxt3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Vxt4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/Vxt5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })


    cy.get('#\\/Vy1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })
    cy.get('#\\/Vy2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/Vy3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Vy4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Vy5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })


    cy.get('#\\/Vyd1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })
    cy.get('#\\/Vyd2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/Vyd3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Vyd4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Vyd5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })



    cy.get('#\\/Vyt1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })
    cy.get('#\\/Vyt2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Vyt3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })
    cy.get('#\\/Vyt4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Vyt5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })



    cy.get('#\\/Vu1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Vu2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/Vu3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })
    cy.get('#\\/Vu4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Vu5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })



    cy.get('#\\/Vud1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Vud2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/Vud3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })
    cy.get('#\\/Vud4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Vud5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })



    cy.get('#\\/Vut1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,5)')
    })
    cy.get('#\\/Vut2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,6)')
    })
    cy.get('#\\/Vut3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,−2)')
    })
    cy.get('#\\/Vut4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/Vut5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,1)')
    })


  })

  it('sort by prop', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>Coords for last point: <mathinput name="cs" /></p>
  <sort assignNames="P1 P2 P3 P4 P5" sortByProp="NDIMENSIONS">
    <point>(a,b)</point>
    <point>x</point>
    <point xs="s t u v" />
    <point x="x" y="y" z="z" />
    <point coords="$cs" />
  </sort>


  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/P1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/P2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uff3f')
    })
    cy.get('#\\/P3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get('#\\/P4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get('#\\/P5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,u,v)')
    })


    cy.get('#\\/cs textarea').type("(a,b,c,d){enter}", { force: true });

    cy.get('#\\/P5 .mjx-mrow').should('contain.text', '(a,b,c,d)');

    cy.get('#\\/P1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/P2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get('#\\/P3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get('#\\/P4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,u,v)')
    })
    cy.get('#\\/P5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b,c,d)')
    })


    cy.get('#\\/cs textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}(3,4,5){enter}", { force: true });

    cy.get('#\\/P4 .mjx-mrow').should('contain.text', '(3,4,5)');

    cy.get('#\\/P1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/P2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get('#\\/P3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get('#\\/P4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,4,5)')
    })
    cy.get('#\\/P5 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,u,v)')
    })


  })

  it('sort texts', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <aslist>
  <sort assignNames="x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13" name="s">
    <text>banana</text>
    <text>apple</text>
    <text>pear</text>
    <textlist>grape cherry kiwi</textlist>
    <text>strawberry</text>
    <text>mango</text>
    <text>passion fruit</text>
    <textlist>orange boysenberry fig currant</textlist>
  </sort>
  </aslist>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/x1').should('have.text', 'apple')
    cy.get('#\\/x2').should('have.text', 'banana')
    cy.get('#\\/x3').should('have.text', 'boysenberry')
    cy.get('#\\/x4').should('have.text', 'cherry')
    cy.get('#\\/x5').should('have.text', 'currant')
    cy.get('#\\/x6').should('have.text', 'fig')
    cy.get('#\\/x7').should('have.text', 'grape')
    cy.get('#\\/x8').should('have.text', 'kiwi')
    cy.get('#\\/x9').should('have.text', 'mango')
    cy.get('#\\/x10').should('have.text', 'orange')
    cy.get('#\\/x11').should('have.text', 'passion fruit')
    cy.get('#\\/x12').should('have.text', 'pear')
    cy.get('#\\/x13').should('have.text', 'strawberry')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x1'].stateValues.value).eq('apple')
      expect(stateVariables['/x2'].stateValues.value).eq('banana')
      expect(stateVariables['/x3'].stateValues.value).eq('boysenberry')
      expect(stateVariables['/x4'].stateValues.value).eq('cherry')
      expect(stateVariables['/x5'].stateValues.value).eq('currant')
      expect(stateVariables['/x6'].stateValues.value).eq('fig')
      expect(stateVariables['/x7'].stateValues.value).eq('grape')
      expect(stateVariables['/x8'].stateValues.value).eq('kiwi')
      expect(stateVariables['/x9'].stateValues.value).eq('mango')
      expect(stateVariables['/x10'].stateValues.value).eq('orange')
      expect(stateVariables['/x11'].stateValues.value).eq('passion fruit')
      expect(stateVariables['/x12'].stateValues.value).eq('pear')
      expect(stateVariables['/x13'].stateValues.value).eq('strawberry')


    })



  })

  it('sort text, numbers, maths', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <aslist>
  <sort assignNames="x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13" name="s">
    <text>b</text>
    <number>3</number>
    <math>5</math>
    <textlist>1 z 15 orange</textlist>
    <math>x</math>
    <number>222</number>
    <mathlist>8 u</mathlist>
    <numberlist>99 765</numberlist>
  </sort>
  </aslist>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/x1').should('have.text', '1')
    cy.get('#\\/x2').should('have.text', '15')
    cy.get('#\\/x3').should('have.text', '222')
    cy.get('#\\/x4').should('have.text', '3')
    cy.get('#\\/x5 .mjx-mrow').eq(0).should('have.text', '5')
    cy.get('#\\/x6').should('have.text', '765')
    cy.get('#\\/x7 .mjx-mrow').eq(0).should('have.text', '8')
    cy.get('#\\/x8').should('have.text', '99')
    cy.get('#\\/x9').should('have.text', 'b')
    cy.get('#\\/x10').should('have.text', 'orange')
    cy.get('#\\/x11 .mjx-mrow').eq(0).should('have.text', 'u')
    cy.get('#\\/x12 .mjx-mrow').eq(0).should('have.text', 'x')
    cy.get('#\\/x13').should('have.text', 'z')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x1'].stateValues.value).eq('1')
      expect(stateVariables['/x2'].stateValues.value).eq('15')
      expect(stateVariables['/x3'].stateValues.value).eq(222)
      expect(stateVariables['/x4'].stateValues.value).eq(3)
      expect(stateVariables['/x5'].stateValues.value).eq(5)
      expect(stateVariables['/x6'].stateValues.value).eq(765)
      expect(stateVariables['/x7'].stateValues.value).eq(8)
      expect(stateVariables['/x8'].stateValues.value).eq(99)
      expect(stateVariables['/x9'].stateValues.value).eq('b')
      expect(stateVariables['/x10'].stateValues.value).eq('orange')
      expect(stateVariables['/x11'].stateValues.value).eq('u')
      expect(stateVariables['/x12'].stateValues.value).eq('x')
      expect(stateVariables['/x13'].stateValues.value).eq('z')
    })


  })

})



