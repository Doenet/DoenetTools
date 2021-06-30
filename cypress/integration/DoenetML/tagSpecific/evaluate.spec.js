
describe('Evaluate Tag Tests', function () {

  beforeEach(() => {

    cy.visit('/cypressTest')

  })


  it('evaluate numeric and symbolic', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Variable: <mathinput name="variable" prefill="x" /></p>
  <p>Function: <mathinput name="formula" prefill="sin(x)"/></p>
  <p>Input value: <mathinput name="input" prefill="0" /></p>

  <function name="f_symbolic" variables="$variable" symbolic formula="$formula" />

  <function name="f_numeric" variables="$variable" formula="$formula" />

  <p>Evaluate symbolic: 
    <evaluate name="result_symbolic" function="$f_symbolic" input="$input" />
  </p>

  <p name="p_symbolic2">Evaluate symbolic using macro:  <math name="result_symbolic2">$$f_symbolic($input)</math></p>

  <p>Evaluated symbolic result again: <copy prop="value" tname="result_symbolic" assignNames="result_symbolic3" /></p>


  <p>Evaluate numeric: 
    <evaluate name="result_numeric" function="$f_numeric" input="$input" />
  </p>

  <p>Evaluate numeric using macro:  <math name="result_numeric2">$$f_numeric($input)</math></p>


  <p>Evaluated numeric result again: <copy prop="value" tname="result_numeric" assignNames="result_numeric3" /></p>


  <p>Force evaluate symbolic: 
  <evaluate forceSymbolic name="result_force_symbolic" function="$f_symbolic" input="$input" />
  </p>

  <p>Force evaluate symbolic numeric function: 
  <evaluate forceSymbolic name="result_force_symbolic_numeric" function="$f_numeric" input="$input" />
  </p>

  <p>Force evaluate numeric: 
  <evaluate forceNumeric name="result_force_numeric" function="$f_numeric" input="$input" />
  </p>

  <p>Force evaluate numeric symbolic function: 
  <evaluate forceNumeric name="result_force_numeric_symbolic" function="$f_symbolic" input="$input" />
  </p>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');
    cy.get('#\\/result_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0)')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0)')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0)')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/result_force_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0)')
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0)')
    })
    cy.get('#\\/result_force_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result_symbolic'].stateValues.value.tree).eqls(["apply", "sin", 0]);
      expect(components['/result_symbolic2'].stateValues.value.tree).eqls(["apply", "sin", 0]);
      expect(components['/result_symbolic3'].stateValues.value.tree).eqls(["apply", "sin", 0]);
      expect(components['/result_numeric'].stateValues.value.tree).eq(0);
      expect(components['/result_numeric2'].stateValues.value.tree).eq(0);
      expect(components['/result_numeric3'].stateValues.value.tree).eq(0);
      expect(components['/result_force_symbolic'].stateValues.value.tree).eqls(["apply", "sin", 0]);
      expect(components['/result_force_symbolic_numeric'].stateValues.value.tree).eqls(["apply", "sin", 0]);
      expect(components['/result_force_numeric'].stateValues.value.tree).eq(0);
      expect(components['/result_force_numeric_symbolic'].stateValues.value.tree).eq(0);
    })


    cy.log('evaluate at pi')
    cy.get('#\\/input textarea').type("{end}{backspace}pi{enter}", { force: true });
    cy.get('#\\/result_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π)')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π)')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π)')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_force_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π)')
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π)')
    })
    cy.get('#\\/result_force_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result_symbolic'].stateValues.value.tree).eqls(["apply", "sin", "pi"]);
      expect(components['/result_symbolic2'].stateValues.value.tree).eqls(["apply", "sin", "pi"]);
      expect(components['/result_symbolic3'].stateValues.value.tree).eqls(["apply", "sin", "pi"]);
      expect(components['/result_numeric'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_numeric2'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_numeric3'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_force_symbolic'].stateValues.value.tree).eqls(["apply", "sin", "pi"]);
      expect(components['/result_force_symbolic_numeric'].stateValues.value.tree).eqls(["apply", "sin", "pi"]);
      expect(components['/result_force_numeric'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_force_numeric_symbolic'].stateValues.value.tree).closeTo(0, 1E-10);
    })


    cy.log('change variable')
    cy.get('#\\/variable textarea').type("{end}{backspace}y{enter}", { force: true });
    cy.get('#\\/result_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/result_force_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)')
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)')
    })
    cy.get('#\\/result_force_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result_symbolic'].stateValues.value.tree).eqls(["apply", "sin", "x"])
      expect(components['/result_symbolic2'].stateValues.value.tree).eqls(["apply", "sin", "x"])
      expect(components['/result_symbolic3'].stateValues.value.tree).eqls(["apply", "sin", "x"])
      assert.isNaN(components['/result_numeric'].stateValues.value.tree);
      assert.isNaN(components['/result_numeric2'].stateValues.value.tree);
      assert.isNaN(components['/result_numeric3'].stateValues.value.tree);
      expect(components['/result_force_symbolic'].stateValues.value.tree).eqls(["apply", "sin", "x"]);
      expect(components['/result_force_symbolic_numeric'].stateValues.value.tree).eqls(["apply", "sin", "x"]);
      assert.isNaN(components['/result_force_numeric'].stateValues.value.tree);
      assert.isNaN(components['/result_force_numeric_symbolic'].stateValues.value.tree);

    })

    cy.log('change formula to match variable')
    cy.get('#\\/formula textarea').type("{end}{backspace}{backspace}y{enter}", { force: true });
    cy.get('#\\/result_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π)')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π)')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π)')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_force_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π)')
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π)')
    })
    cy.get('#\\/result_force_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result_symbolic'].stateValues.value.tree).eqls(["apply", "sin", "pi"]);
      expect(components['/result_symbolic2'].stateValues.value.tree).eqls(["apply", "sin", "pi"]);
      expect(components['/result_symbolic3'].stateValues.value.tree).eqls(["apply", "sin", "pi"]);
      expect(components['/result_numeric'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_numeric2'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_numeric3'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_force_symbolic'].stateValues.value.tree).eqls(["apply", "sin", "pi"]);
      expect(components['/result_force_symbolic_numeric'].stateValues.value.tree).eqls(["apply", "sin", "pi"]);
      expect(components['/result_force_numeric'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_force_numeric_symbolic'].stateValues.value.tree).closeTo(0, 1E-10);
    })

  })

  it('user-defined function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Choose variable for function: <mathinput name="x" prefill="x" />.
  Let <m>f($x) =</m> <mathinput name="fformula" prefill="ax" />.
  Let <m>u = </m> <mathinput name="u" prefill="3v" />.
  Then <m name="result">f(u) = f($u) = $$f($u)</m>.</p>

  <p hide><function name="f" variables="$x" symbolic simplify expand formula="$fformula" /></p>
  

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');

    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(3v)=3av')
    })

    cy.log('change function')
    cy.get('#\\/fformula textarea').type("{end}{backspace}{backspace}bx^2{enter}", { force: true });
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(3v)=9bv2')
    })

    cy.log('change u')
    cy.get('#\\/u textarea').type("{end}{backspace}{backspace}cq^2{enter}", { force: true });
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(cq2)=bc2q4')
    })

    cy.log('change variable')
    cy.get('#\\/x textarea').type("{end}{backspace}y{enter}", { force: true });
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(cq2)=bx2')
    })

    cy.log('change function to match variable')
    cy.get('#\\/fformula textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}ay+by^2{enter}", { force: true });
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(cq2)=acq2+bc2q4')
    })

  })

  it('evaluate function when input is replaced', () => {
    // catch bug where child dependency was not recalculated
    // when a skipComponentNames = true
    // and the number of active children did not change
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <function variables="u" symbolic name="f">1+u</function>
  <answer size="5">
    <mathinput />
    <award><math>1</math></award>
  </answer>
  <p><evaluate name="eval" function="$f" input="$(_answer1{prop='submittedResponse'})" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');

    cy.get('#\\/eval').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+＿')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/eval'].stateValues.value.tree).eqls(["+", 1, '＿']);
    })

    cy.log('submit answer')
    cy.get('#\\/_mathinput1 textarea').type("4{enter}", { force: true });
    cy.get('#\\/eval').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+4')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/eval'].stateValues.value.tree).eqls(["+", 1, 4]);
    })

  })

  it('evaluate numeric and symbolic for function of two variables', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Variable 1: <mathinput name="variable1" prefill="x" /></p>
  <p>Variable 2: <mathinput name="variable2" prefill="y" /></p>
  <p>Function: <mathinput name="formula" prefill="sin(x+y)"/></p>
  <p>Input 1 value: <mathinput name="input1" prefill="0" /></p>
  <p>Input 2 value: <mathinput name="input2" prefill="0" /></p>

  <function name="f_symbolic" variables="$variable1 $variable2" symbolic formula="$formula" />

  <function name="f_numeric" variables="$variable1 $variable2" formula="$formula" />

  <p>Evaluate symbolic: 
    <evaluate name="result_symbolic" function="$f_symbolic" input="$input1 $input2" />
  </p>

  <p name="p_symbolic2">Evaluate symbolic using macro:  <math name="result_symbolic2">$$f_symbolic($input1, $input2)</math></p>

  <p>Evaluated symbolic result again: <copy prop="value" tname="result_symbolic" assignNames="result_symbolic3" /></p>


  <p>Evaluate numeric: 
    <evaluate name="result_numeric" function="$f_numeric" input="$input1 $input2" />
  </p>

  <p>Evaluate numeric using macro:  <math name="result_numeric2">$$f_numeric($input1, $input2)</math></p>

  <p>Evaluated numeric result again: <copy prop="value" tname="result_numeric" assignNames="result_numeric3" /></p>

  <p>Force evaluate symbolic numeric function: 
  <evaluate forceSymbolic name="result_force_symbolic_numeric" function="$f_numeric" input="$input1 $input2" />
  </p>

  <p>Force evaluate numeric symbolic function: 
  <evaluate forceNumeric name="result_force_numeric_symbolic" function="$f_symbolic" input="$input1 $input2" />
  </p>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');
    cy.get('#\\/result_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0+0)')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0+0)')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0+0)')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0+0)')
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result_symbolic'].stateValues.value.tree).eqls(["apply", "sin", ['+', 0, 0]]);
      expect(components['/result_symbolic2'].stateValues.value.tree).eqls(["apply", "sin", ['+', 0, 0]]);
      expect(components['/result_symbolic3'].stateValues.value.tree).eqls(["apply", "sin", ['+', 0, 0]]);
      expect(components['/result_numeric'].stateValues.value.tree).eq(0);
      expect(components['/result_numeric2'].stateValues.value.tree).eq(0);
      expect(components['/result_numeric3'].stateValues.value.tree).eq(0);
      expect(components['/result_force_symbolic_numeric'].stateValues.value.tree).eqls(["apply", "sin", ['+', 0, 0]]);
      expect(components['/result_force_numeric_symbolic'].stateValues.value.tree).eq(0);
    })


    cy.log('evaluate at (pi, 2pi)')
    cy.get('#\\/input1 textarea').type("{end}{backspace}pi{enter}", { force: true });
    cy.get('#\\/input2 textarea').type("{end}{backspace}2pi{enter}", { force: true });
    cy.get('#\\/result_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π+2π)')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π+2π)')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π+2π)')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(3 * Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(3 * Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(3 * Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π+2π)')
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(3 * Math.PI).toString().slice(0, 9))
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result_symbolic'].stateValues.value.tree).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(components['/result_symbolic2'].stateValues.value.tree).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(components['/result_symbolic3'].stateValues.value.tree).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(components['/result_numeric'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_numeric2'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_numeric3'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_force_symbolic_numeric'].stateValues.value.tree).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(components['/result_force_numeric_symbolic'].stateValues.value.tree).closeTo(0, 1E-10);
    })


    cy.log('change variable')
    cy.get('#\\/variable1 textarea').type("{end}{backspace}u{enter}", { force: true });
    cy.get('#\\/variable2 textarea').type("{end}{backspace}v{enter}", { force: true });
    cy.get('#\\/result_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x+y)')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x+y)')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x+y)')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x+y)')
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result_symbolic'].stateValues.value.tree).eqls(["apply", "sin", ["+", "x", "y"]])
      expect(components['/result_symbolic2'].stateValues.value.tree).eqls(["apply", "sin", ["+", "x", "y"]])
      expect(components['/result_symbolic3'].stateValues.value.tree).eqls(["apply", "sin", ["+", "x", "y"]])
      assert.isNaN(components['/result_numeric'].stateValues.value.tree);
      assert.isNaN(components['/result_numeric2'].stateValues.value.tree);
      assert.isNaN(components['/result_numeric3'].stateValues.value.tree);
      expect(components['/result_force_symbolic_numeric'].stateValues.value.tree).eqls(["apply", "sin", ["+", "x", "y"]]);
      assert.isNaN(components['/result_force_numeric_symbolic'].stateValues.value.tree);

    })

    cy.log('change formula to use new variables')
    cy.get('#\\/formula textarea').type("{end}{backspace}{backspace}{backspace}{backspace}u+v{enter}", { force: true });
    cy.get('#\\/result_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π+2π)')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π+2π)')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π+2π)')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(3 * Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(3 * Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(3 * Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(π+2π)')
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(3 * Math.PI).toString().slice(0, 9))
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result_symbolic'].stateValues.value.tree).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(components['/result_symbolic2'].stateValues.value.tree).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(components['/result_symbolic3'].stateValues.value.tree).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(components['/result_numeric'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_numeric2'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_numeric3'].stateValues.value.tree).closeTo(0, 1E-10);
      expect(components['/result_force_symbolic_numeric'].stateValues.value.tree).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(components['/result_force_numeric_symbolic'].stateValues.value.tree).closeTo(0, 1E-10);
    })


  })

  it('function of multiple variables', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Variables: <mathinput name="variablesOrig" prefill="x,y" /></p>
  <p>Function: <mathinput name="formula" prefill="sin(x+y)"/></p>
  <p>Input: <mathinput name="input" prefill="(0,0)" /></p>
  <mathlist mergeMathLists name="variables" hide>$variablesOrig</mathlist>

  <function name="f" variables="$variables" symbolic simplify formula="$formula" />

  <p>Evaluate 1: 
    <evaluate name="result1" function="$f" input="$input" />
  </p>

  <p>Evaluate 2:  <math name="result2">$$f($input)</math></p>

  <p>Evaluate 3: <copy prop="value" tname="result1" assignNames="result3" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result1'].stateValues.value.tree).eqls(0);
      expect(components['/result2'].stateValues.value.tree).eqls(0);
      expect(components['/result3'].stateValues.value.tree).eqls(0);
    })

    cy.log('evaluate at (pi, pi/2)')
    cy.get('#\\/input textarea').type("{end}{leftArrow}{backspace}{backspace}{backspace}pi,pi/2{enter}", { force: true });

    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result1'].stateValues.value.tree).eqls(-1);
      expect(components['/result2'].stateValues.value.tree).eqls(-1);
      expect(components['/result3'].stateValues.value.tree).eqls(-1);
    })

    cy.log('change variables to 3D')
    cy.get('#\\/variablesOrig textarea').type("{end},z{enter}", { force: true });

    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result1'].stateValues.value.tree).eqls('＿');
      expect(components['/result2'].stateValues.value.tree).eqls('＿');
      expect(components['/result3'].stateValues.value.tree).eqls('＿');
    })


    cy.log('change input to 3D')
    cy.get('#\\/input textarea').type("{end}{leftArrow},3{enter}", { force: true });

    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result1'].stateValues.value.tree).eqls(-1);
      expect(components['/result2'].stateValues.value.tree).eqls(-1);
      expect(components['/result3'].stateValues.value.tree).eqls(-1);
    })

    cy.log('change formula to use all variables')
    cy.get('#\\/formula textarea').type("z{enter}", { force: true });

    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−3')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−3')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−3')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result1'].stateValues.value.tree).eqls(-3);
      expect(components['/result2'].stateValues.value.tree).eqls(-3);
      expect(components['/result3'].stateValues.value.tree).eqls(-3);
    })

    cy.log('add fourth variable to formula')
    cy.get('#\\/formula textarea').type("{end}{leftArrow}/w{enter}", { force: true });

    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3sin(π+π2w)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3sin(π+π2w)')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3sin(π+π2w)')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result1'].stateValues.value.tree).eqls(['*', 3, ['apply', 'sin', ['+', 'pi', ['/', 'pi', ['*', 2, 'w']]]]]);
      expect(components['/result2'].stateValues.value.tree).eqls(['*', 3, ['apply', 'sin', ['+', 'pi', ['/', 'pi', ['*', 2, 'w']]]]]);
      expect(components['/result3'].stateValues.value.tree).eqls(['*', 3, ['apply', 'sin', ['+', 'pi', ['/', 'pi', ['*', 2, 'w']]]]]);
    })


    cy.log('add 4th input')
    cy.get('#\\/input textarea').type("{end}{leftArrow},3{enter}", { force: true });

    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result1'].stateValues.value.tree).eqls('＿');
      expect(components['/result2'].stateValues.value.tree).eqls('＿');
      expect(components['/result3'].stateValues.value.tree).eqls('＿');
    })

    cy.log('add 4th variable')
    cy.get('#\\/variablesOrig textarea').type("{end},w{enter}", { force: true });

    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−32')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−32')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−32')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result1'].stateValues.value.tree).eqls(['/', -3, 2]);
      expect(components['/result2'].stateValues.value.tree).eqls(['/', -3, 2]);
      expect(components['/result3'].stateValues.value.tree).eqls(['/', -3, 2]);
    })


  })

  it('different input forms for function of two variables', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <function name="f" variables="x y" symbolic simplify formula="x^2/y^3" />
  <p>Input as vector: <mathinput name="input1" prefill="(2,3)" /></p>
  <p>Input as list: <mathinput name="input2Orig" prefill="2,3" /></p>
  <mathList mergeMathLists name="input2" hide>$input2Orig</mathList>
 
  <graph>
    <point name="A" x="2" y="5" />
    <point name="B" x="3" y="6" />
  </graph>
  <collect name="input3" componentTypes="point" prop="x" tname="_graph1" />

  <p>Separate inputs: <mathinput name="input4a" prefill="2" /> 
  <mathinput name="input4b" prefill="3" /></p>


  <p>Evaluate 1a: 
    <evaluate name="result1a" function="$f" input="$input1" />
  </p>
  <p>Evaluate 1b:  <math name="result1b">$$f($input1)</math></p>

  <p>Evaluate 2a: 
    <evaluate name="result2a" function="$f" input="$input2" />
  </p>
  <p>Evaluate 2b:  <math name="result2b">$$f($input2)</math></p>

  <p>Evaluate 3a: 
    <evaluate name="result3a" function="$f" input="$input3" />
  </p>
  <p>Evaluate 3b:  <math name="result3b">$$f($input3)</math></p>

  <p>Evaluate 4a: 
    <evaluate name="result4a" function="$f" input="$input4a $input4b" />
  </p>
  <p>Evaluate 4b:  <math name="result4b">$$f($input4a,$input4b)</math></p>
  <p>Evaluate 4c:  <math name="result4c">$$f($input4a, $input4b)</math></p>

  <p>Evaluate 5a: 
    <evaluate name="result5a" function="$f" input="($input4a,$input4b)" />
  </p>
  <p>Evaluate 5b:  <math name="result5b">$$f(($input4a,$input4b))</math></p>
  <p>Evaluate 5c:  <math name="result5c">$$f(($input4a, $input4b))</math></p>
  <p>Evaluate 5d (bad): 
    <evaluate name="result5d" function="$f" input="($input4a, $input4b)" />
  </p>

  <p>Evaluate 6a: 
    <evaluate name="result6a" function="$f" input="2 3" />
  </p>
  <p>Evaluate 6b:  <math name="result6b">$$f(2,3)</math></p>
  <p>Evaluate 6c:  <math name="result6c">$$f(2, 3)</math></p>

  <p>Evaluate 7a: 
    <evaluate name="result7a" function="$f" input="(2,3)" />
  </p>
  <p>Evaluate 7b:  <math name="result7b">$$f((2,3))</math></p>
  <p>Evaluate 7c:  <math name="result7c">$$f((2, 3))</math></p>
  <p>Evaluate 7d (bad): 
    <evaluate name="result7d" function="$f" input="(2, 3)" />
  </p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');
    cy.get('#\\/result1a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result1b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result2a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result2b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result3a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result3b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result4a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result4b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result4c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result5c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result5d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿2＿3')
    })
    cy.get('#\\/result6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result7a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result7a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result7c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('427')
    })
    cy.get('#\\/result7d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿2＿3')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/result1a'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result1b'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result2a'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result2b'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result3a'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result3b'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result4a'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result4b'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result4c'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result5a'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result5b'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result5c'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result5d'].stateValues.value.tree).eqls(['/', ['^', '＿', 2], ['^', '＿', 3]]);
      expect(components['/result6a'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result6b'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result6c'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result7a'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result7b'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result7c'].stateValues.value.tree).eqls(['/', 4, 27]);
      expect(components['/result7d'].stateValues.value.tree).eqls(['/', ['^', '＿', 2], ['^', '＿', 3]]);
    })

    cy.log(`change inputs`);
    cy.get('#\\/input1 textarea').type('{end}{leftArrow}{backspace}{backspace}{backspace}-3,5', { force: true })
    cy.get('#\\/input2Orig textarea').type('{end}{backspace}{backspace}{backspace}-3,5', { force: true })
    cy.get('#\\/input4a textarea').type('{end}{backspace}-3', { force: true })
    cy.get('#\\/input4b textarea').type('{end}{backspace}5', { force: true }).blur()

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components["/A"].movePoint({x: -3, y: 7})
      components["/B"].movePoint({x: 5, y: -9})

      cy.get('#\\/result1a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result1b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result2a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result2b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result3a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result3b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result4a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result4b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result4c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result5c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9125')
      })
      cy.get('#\\/result5d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿2＿3')
      })
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/result1a'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result1b'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result2a'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result2b'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result3a'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result3b'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result4a'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result4b'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result4c'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result5a'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result5b'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result5c'].stateValues.value.tree).eqls(['/', 9, 125]);
        expect(components['/result5d'].stateValues.value.tree).eqls(['/', ['^', '＿', 2], ['^', '＿', 3]]);
      })

    })
  })


})



