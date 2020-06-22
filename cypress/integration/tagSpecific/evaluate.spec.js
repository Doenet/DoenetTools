
describe('Evaluate Tag Tests', function () {

  beforeEach(() => {

    cy.visit('/test')

  })


  it('evaluate numeric and symbolic', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Variable: <mathinput name="variable" prefill="x" /></p>
  <p>Function: <mathinput name="formula" prefill="sin(x)"/></p>
  <p><booleaninput label="symbolic evaluation" name="symbolic" /></p>
  <p>Input value: <mathinput name="input" prefill="0" /></p>

  <function name="f">
    <variable><copy prop="value" tname="variable" /></variable>
    <copy prop="value" tname="formula" />
  </function>

  <p>Evaluation: 
    <evaluate name="result">
      <symbolic><copy prop="value" tname="symbolic" /></symbolic>
      <copy tname="f" />
      <copy prop="value" tname="input" />
    </evaluate>
  </p>

  <p>Evaluated result again: <math name="result2"><copy prop="evaluatedResult" tname="result" /></math></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result'].stateValues.value.tree).eq(0);
      expect(components['/result2'].stateValues.value.tree).eq(0);
    })

    
    cy.log('evaluate at pi')
    cy.get('#\\/input_input').clear().type("pi{enter}");
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0,9)).eq(Math.sin(Math.PI).toString().slice(0,9))
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0,9)).eq(Math.sin(Math.PI).toString().slice(0,9))
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result2'].stateValues.value.tree).closeTo(0, 1E-10);
    })

    cy.log('change to symbolic')
    cy.get("#\\/symbolic_input").click();
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq('sin(π)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq('sin(π)')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result'].stateValues.value.tree).eqls(["apply", "sin", "pi"])
      expect(components['/result2'].stateValues.value.tree).eqls(["apply", "sin", "pi"])
    })


    cy.log('change variable')
    cy.get('#\\/variable_input').clear().type("y{enter}");
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq('sin(x)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq('sin(x)')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result'].stateValues.value.tree).eqls(["apply", "sin", "x"])
      expect(components['/result2'].stateValues.value.tree).eqls(["apply", "sin", "x"])
    })

    cy.log('change formula to match variable')
    cy.get('#\\/formula_input').clear().type("sin(y){enter}");
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq('sin(π)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq('sin(π)')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result'].stateValues.value.tree).eqls(["apply", "sin", "pi"])
      expect(components['/result2'].stateValues.value.tree).eqls(["apply", "sin", "pi"])
    })

    cy.log('back to numeric')
    cy.get("#\\/symbolic_input").click();
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0,9)).eq(Math.sin(Math.PI).toString().slice(0,9))
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0,9)).eq(Math.sin(Math.PI).toString().slice(0,9))
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result2'].stateValues.value.tree).closeTo(0, 1E-10);
    })

    cy.log('change variable')
    cy.get('#\\/variable_input').clear().type("z{enter}");
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq('NaN')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq('NaN')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      assert.isNaN(components['/result'].stateValues.value.tree);
      assert.isNaN(components['/result2'].stateValues.value.tree);
    })

    cy.log('change formula to match variable')
    cy.get('#\\/formula_input').clear().type("z^2{enter}");
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.trim())).closeTo(Math.pow(Math.PI,2), 1E-10)
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.trim())).closeTo(Math.pow(Math.PI,2), 1E-10)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result'].stateValues.value.tree).closeTo(Math.pow(Math.PI,2), 1E-10);
      expect(components['/result2'].stateValues.value.tree).closeTo(Math.pow(Math.PI,2), 1E-10);
    })

  })

})



