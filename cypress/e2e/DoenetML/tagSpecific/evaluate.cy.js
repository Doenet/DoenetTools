import me from 'math-expressions';

describe('Evaluate Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('evaluate numeric and symbolic', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Variable: <mathinput name="variable" prefill="x" /></p>
  <p>Function: <mathinput name="formula" prefill="sin(x)"/></p>
  <p>Input value: <mathinput name="input" prefill="0" /></p>

  <function name="f_symbolic" variables="$variable" symbolic>$formula</function>

  <function name="f_numeric" variables="$variable">$formula</function>

  <p>Evaluate symbolic: 
    <evaluate name="result_symbolic" function="$f_symbolic" input="$input" />
  </p>

  <p name="p_symbolic2">Evaluate symbolic using macro:  <m name="result_symbolic2">$$f_symbolic($input)</m></p>

  <p>Evaluated symbolic result again: <copy target="result_symbolic" assignNames="result_symbolic3" /></p>


  <p>Evaluate numeric: 
    <evaluate name="result_numeric" function="$f_numeric" input="$input" />
  </p>

  <p>Evaluate numeric using macro:  <m name="result_numeric2">$$f_numeric($input)</m></p>


  <p>Evaluated numeric result again: <copy target="result_numeric" assignNames="result_numeric3" /></p>


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

    let result_symbolic2_name;
    let result_numeric2_name;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["apply", "sin", 0]);
      result_symbolic2_name = stateVariables['/result_symbolic2'].activeChildren[0].componentName;
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["apply", "sin", 0]);
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["apply", "sin", 0]);
      expect(stateVariables['/result_numeric'].stateValues.value).eq(0);
      result_numeric2_name = stateVariables['/result_numeric2'].activeChildren[0].componentName;
      expect(stateVariables[result_numeric2_name].stateValues.value).eq(0);
      expect(stateVariables['/result_numeric3'].stateValues.value).eq(0);
      expect(stateVariables['/result_force_symbolic'].stateValues.value).eqls(["apply", "sin", 0]);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["apply", "sin", 0]);
      expect(stateVariables['/result_force_numeric'].stateValues.value).eq(0);
      expect(stateVariables['/result_force_numeric_symbolic'].stateValues.value).eq(0);
    })


    cy.log('evaluate at pi')
    cy.get('#\\/input textarea').type("{end}{backspace}pi{enter}", { force: true });
    cy.get('#\\/result_symbolic').should('contain.text', 'sin(π)')
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["apply", "sin", "pi"]);
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["apply", "sin", "pi"]);
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["apply", "sin", "pi"]);
      expect(stateVariables['/result_numeric'].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables[result_numeric2_name].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables['/result_numeric3'].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables['/result_force_symbolic'].stateValues.value).eqls(["apply", "sin", "pi"]);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["apply", "sin", "pi"]);
      expect(stateVariables['/result_force_numeric'].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables['/result_force_numeric_symbolic'].stateValues.value).closeTo(0, 1E-10);
    })


    cy.log('change variable')
    cy.get('#\\/variable textarea').type("{end}{backspace}y{enter}", { force: true });
    cy.get('#\\/result_symbolic').should('contain.text', 'sin(x)')
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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["apply", "sin", "x"])
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["apply", "sin", "x"])
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["apply", "sin", "x"])
      assert.isNaN(stateVariables['/result_numeric'].stateValues.value);
      assert.isNaN(stateVariables[result_numeric2_name].stateValues.value);
      assert.isNaN(stateVariables['/result_numeric3'].stateValues.value);
      expect(stateVariables['/result_force_symbolic'].stateValues.value).eqls(["apply", "sin", "x"]);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["apply", "sin", "x"]);
      assert.isNaN(stateVariables['/result_force_numeric'].stateValues.value);
      assert.isNaN(stateVariables['/result_force_numeric_symbolic'].stateValues.value);

    })

    cy.log('change formula to match variable')
    cy.get('#\\/formula textarea').type("{end}{backspace}{backspace}y{enter}", { force: true });
    cy.get('#\\/result_symbolic').should('contain.text', 'sin(π)')
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["apply", "sin", "pi"]);
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["apply", "sin", "pi"]);
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["apply", "sin", "pi"]);
      expect(stateVariables['/result_numeric'].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables[result_numeric2_name].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables['/result_numeric3'].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables['/result_force_symbolic'].stateValues.value).eqls(["apply", "sin", "pi"]);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["apply", "sin", "pi"]);
      expect(stateVariables['/result_force_numeric'].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables['/result_force_numeric_symbolic'].stateValues.value).closeTo(0, 1E-10);
    })

  })

  it('user-defined function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Choose variable for function: <mathinput name="x" prefill="x" />.
  Let <m>f($x) =</m> <mathinput name="fformula" prefill="ax" />.
  Let <m>u = </m> <mathinput name="u" prefill="3v" />.
  Then <m name="result">f(u) = f($u) = $$f($u)</m>.</p>

  <p hide><function name="f" variables="$x" symbolic simplify expand>$fformula</function></p>
  

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');

    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(3v)=3av')
    })

    cy.log('change function')
    cy.get('#\\/fformula textarea').type("{end}{backspace}{backspace}bx^2{enter}", { force: true });
    cy.get('#\\/result').should('contain.text', 'f(u)=f(3v)=9bv2')
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(3v)=9bv2')
    })

    cy.log('change u')
    cy.get('#\\/u textarea').type("{end}{backspace}{backspace}cq^2{enter}", { force: true });
    cy.get('#\\/result').should('contain.text', 'f(u)=f(cq2)=bc2q4')
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(cq2)=bc2q4')
    })

    cy.log('change variable')
    cy.get('#\\/x textarea').type("{end}{backspace}y{enter}", { force: true });
    cy.get('#\\/result').should('contain.text', 'f(u)=f(cq2)=bx2')
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(cq2)=bx2')
    })

    cy.log('change function to match variable')
    cy.get('#\\/fformula textarea').type("{ctrl+home}{shift+end}{backspace}ay+by^2{enter}", { force: true });
    cy.get('#\\/result').should('contain.text', 'f(u)=f(cq2)=acq2+bc2q4')
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(cq2)=acq2+bc2q4')
    })

  })

  it('evaluate function when input is replaced', () => {
    // catch bug where child dependency was not recalculated
    // when a skipComponentNames = true
    // and the number of active children did not change
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <function variables="u" symbolic name="f">1+u</function>
  <answer>
    <mathinput />
    <award><math>1</math></award>
  </answer>
  <p><evaluate name="eval" function="$f" input="$_answer1.submittedResponse" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');

    cy.get('#\\/eval').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/eval'].stateValues.value).eq('＿');
    })

    cy.log('submit answer')
    cy.get('#\\/_mathinput1 textarea').type("4{enter}", { force: true });
    cy.get('#\\/eval').should('contain.text', '1+4')
    cy.get('#\\/eval').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+4')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/eval'].stateValues.value).eqls(["+", 1, 4]);
    })

  })

  it('rounding on display', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <function displayDigits="3" name="f1">100sin(x)</function>
  <function displayDecimals="3" name="f2">100sin(x)</function>
  <function displaySmallAsZero="1E-13" name="f3">100sin(x)</function>
  <function name="f4">100sin(x)</function>

  <p>Input: <mathinput name="input" prefill="1" /></p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1" />
  <evaluate function="$f2" input="$input" name="ef2" />
  <evaluate function="$f3" input="$input" name="ef3" />
  <evaluate function="$f4" input="$input" name="ef4" />
  <copy target="ef1" assignNames="ef1a" />
  <copy target="ef2" assignNames="ef2a" />
  <copy target="ef3" assignNames="ef3a" />
  <copy target="ef4" assignNames="ef4a" />
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dg6" displayDigits="6" />
  <evaluate function="$f2" input="$input" name="ef2dg6" displayDigits="6" />
  <evaluate function="$f3" input="$input" name="ef3dg6" displayDigits="6" />
  <evaluate function="$f4" input="$input" name="ef4dg6" displayDigits="6" />
  <copy target="ef1dg6" assignNames="ef1dg6a" />
  <copy target="ef2dg6" assignNames="ef2dg6a" />
  <copy target="ef3dg6" assignNames="ef3dg6a" />
  <copy target="ef4dg6" assignNames="ef4dg6a" />
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dc6" displayDecimals="6" />
  <evaluate function="$f2" input="$input" name="ef2dc6" displayDecimals="6" />
  <evaluate function="$f3" input="$input" name="ef3dc6" displayDecimals="6" />
  <evaluate function="$f4" input="$input" name="ef4dc6" displayDecimals="6" />
  <copy target="ef1dc6" assignNames="ef1dc6a" />
  <copy target="ef2dc6" assignNames="ef2dc6a" />
  <copy target="ef3dc6" assignNames="ef3dc6a" />
  <copy target="ef4dc6" assignNames="ef4dc6a" />
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f2" input="$input" name="ef2dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f3" input="$input" name="ef3dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f4" input="$input" name="ef4dsz" displaySmallAsZero="1E-13" />
  <copy target="ef1dsz" assignNames="ef1dsza" />
  <copy target="ef2dsz" assignNames="ef2dsza" />
  <copy target="ef3dsz" assignNames="ef3dsza" />
  <copy target="ef4dsz" assignNames="ef4dsza" />
  </p>

  <p>
  <m name="ef1m">$$f1($input)</m>
  <m name="ef2m">$$f2($input)</m>
  <m name="ef3m">$$f3($input)</m>
  <m name="ef4m">$$f4($input)</m>
  <copy target="ef1m" assignNames="ef1ma" />
  <copy target="ef2m" assignNames="ef2ma" />
  <copy target="ef3m" assignNames="ef3ma" />
  <copy target="ef4m" assignNames="ef4ma" />
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/ef1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef1a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })

    cy.get('#\\/ef1dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef2dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef3dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef4dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef1dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef2dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef3dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef4dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })


    cy.get('#\\/ef1dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef2dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef3dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef4dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef1dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef2dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef3dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef4dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })

    cy.get('#\\/ef1dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef1dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })

    cy.get('#\\/ef1m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef1ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })

    cy.get('#\\/input textarea').type("{end}{backspace}pi{enter}", { force: true });


    cy.get('#\\/ef2').should('contain.text', '0');
    cy.get('#\\/ef1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 3)).eq(Math.sin(Math.PI).toString().slice(0, 3))
    })
    cy.get('#\\/ef2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/ef1a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 3)).eq(Math.sin(Math.PI).toString().slice(0, 3))
    })
    cy.get('#\\/ef2a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })

    cy.get('#\\/ef1dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef2dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef3dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef1dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef2dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef3dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })


    cy.get('#\\/ef1dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef1dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/ef1dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef1dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/ef1m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 3)).eq(Math.sin(Math.PI).toString().slice(0, 3))
    })
    cy.get('#\\/ef2m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/ef1ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 3)).eq(Math.sin(Math.PI).toString().slice(0, 3))
    })
    cy.get('#\\/ef2ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })




  })

  it('rounding on display, overwrite on copy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <function displayDigits="3" name="f1">100sin(x)</function>
  <function displayDecimals="3" name="f2">100sin(x)</function>
  <function displaySmallAsZero="1E-13" name="f3">100sin(x)</function>
  <function name="f4">100sin(x)</function>

  <p>Input: <mathinput name="input" prefill="1" /></p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1" />
  <evaluate function="$f2" input="$input" name="ef2" />
  <evaluate function="$f3" input="$input" name="ef3" />
  <evaluate function="$f4" input="$input" name="ef4" />
  <copy target="ef1" assignNames="ef1dg6" displayDigits="6" />
  <copy target="ef2" assignNames="ef2dg6" displayDigits="6" />
  <copy target="ef3" assignNames="ef3dg6" displayDigits="6" />
  <copy target="ef4" assignNames="ef4dg6" displayDigits="6" />
  <copy target="ef1" assignNames="ef1dc6" displayDecimals="6" />
  <copy target="ef2" assignNames="ef2dc6" displayDecimals="6" />
  <copy target="ef3" assignNames="ef3dc6" displayDecimals="6" />
  <copy target="ef4" assignNames="ef4dc6" displayDecimals="6" />
  <copy target="ef1" assignNames="ef1dsz" displaySmallAsZero="1E-13" />
  <copy target="ef2" assignNames="ef2dsz" displaySmallAsZero="1E-13" />
  <copy target="ef3" assignNames="ef3dsz" displaySmallAsZero="1E-13" />
  <copy target="ef4" assignNames="ef4dsz" displaySmallAsZero="1E-13" />
  <copy target="ef1dc6" assignNames="ef1dg6a" displayDigits="6" />
  <copy target="ef2dc6" assignNames="ef2dg6a" displayDigits="6" />
  <copy target="ef3dc6" assignNames="ef3dg6a" displayDigits="6" />
  <copy target="ef4dc6" assignNames="ef4dg6a" displayDigits="6" />
  <copy target="ef1dg6" assignNames="ef1dc6a" displayDecimals="6" />
  <copy target="ef2dg6" assignNames="ef2dc6a" displayDecimals="6" />
  <copy target="ef3dg6" assignNames="ef3dc6a" displayDecimals="6" />
  <copy target="ef4dg6" assignNames="ef4dc6a" displayDecimals="6" />
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dg6b" displayDigits="6" />
  <evaluate function="$f2" input="$input" name="ef2dg6b" displayDigits="6" />
  <evaluate function="$f3" input="$input" name="ef3dg6b" displayDigits="6" />
  <evaluate function="$f4" input="$input" name="ef4dg6b" displayDigits="6" />
  <copy target="ef1dg6b" assignNames="ef1dg8" displayDigits="8" />
  <copy target="ef2dg6b" assignNames="ef2dg8" displayDigits="8" />
  <copy target="ef3dg6b" assignNames="ef3dg8" displayDigits="8" />
  <copy target="ef4dg6b" assignNames="ef4dg8" displayDigits="8" />
  <copy target="ef1dg6b" assignNames="ef1dc6b" displayDecimals="6" />
  <copy target="ef2dg6b" assignNames="ef2dc6b" displayDecimals="6" />
  <copy target="ef3dg6b" assignNames="ef3dc6b" displayDecimals="6" />
  <copy target="ef4dg6b" assignNames="ef4dc6b" displayDecimals="6" />
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dc6c" displayDecimals="6" />
  <evaluate function="$f2" input="$input" name="ef2dc6c" displayDecimals="6" />
  <evaluate function="$f3" input="$input" name="ef3dc6c" displayDecimals="6" />
  <evaluate function="$f4" input="$input" name="ef4dc6c" displayDecimals="6" />
  <copy target="ef1dc6c" assignNames="ef1dc7" displayDecimals="7" />
  <copy target="ef2dc6c" assignNames="ef2dc7" displayDecimals="7" />
  <copy target="ef3dc6c" assignNames="ef3dc7" displayDecimals="7" />
  <copy target="ef4dc6c" assignNames="ef4dc7" displayDecimals="7" />
  <copy target="ef1dc6c" assignNames="ef1dg6c" displayDigits="6" />
  <copy target="ef2dc6c" assignNames="ef2dg6c" displayDigits="6" />
  <copy target="ef3dc6c" assignNames="ef3dg6c" displayDigits="6" />
  <copy target="ef4dc6c" assignNames="ef4dg6c" displayDigits="6" />
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dsza" displaySmallAsZero="1E-13" />
  <evaluate function="$f2" input="$input" name="ef2dsza" displaySmallAsZero="1E-13" />
  <evaluate function="$f3" input="$input" name="ef3dsza" displaySmallAsZero="1E-13" />
  <evaluate function="$f4" input="$input" name="ef4dsza" displaySmallAsZero="1E-13" />
  <copy target="ef1dsza" assignNames="ef1dsz0a" displaySmallAsZero="0" />
  <copy target="ef2dsza" assignNames="ef2dsz0a" displaySmallAsZero="0" />
  <copy target="ef3dsza" assignNames="ef3dsz0a" displaySmallAsZero="0" />
  <copy target="ef4dsza" assignNames="ef4dsz0a" displaySmallAsZero="0" />
  </p>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/ef1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })

    cy.get('#\\/ef1dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef2dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef3dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef4dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })

    cy.get('#\\/ef1dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef2dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef3dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef4dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })

    cy.get('#\\/ef1dg6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef2dg6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef3dg6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef4dg6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })


    cy.get('#\\/ef1dg6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef2dg6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef3dg6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef4dg6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })


    cy.get('#\\/ef1dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef2dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef3dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef4dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })

    cy.get('#\\/ef1dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef2dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef3dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef4dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })

    cy.get('#\\/ef1dc6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef2dc6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef3dc6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef4dc6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })

    cy.get('#\\/ef1dc6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef2dc6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef3dc6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef4dc6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })


    cy.get('#\\/ef1dg8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef2dg8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef3dg8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef4dg8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })


    cy.get('#\\/ef1dc7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1470985')
    })
    cy.get('#\\/ef2dc7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1470985')
    })
    cy.get('#\\/ef3dc7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1470985')
    })
    cy.get('#\\/ef4dc7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1470985')
    })


    cy.get('#\\/ef1dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })

    cy.get('#\\/ef1dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef1dsz0a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2dsz0a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3dsz0a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4dsz0a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })


    cy.get('#\\/input textarea').type("{end}{backspace}pi{enter}", { force: true });

    cy.get('#\\/ef2').should('contain.text', '0');
    cy.get('#\\/ef1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 3)).eq(Math.sin(Math.PI).toString().slice(0, 3))
    })
    cy.get('#\\/ef2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })


    cy.get('#\\/ef1dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef2dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef3dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })


    cy.get('#\\/ef1dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef2dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef3dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })


    cy.get('#\\/ef1dg6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef2dg6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef3dg6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dg6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })


    cy.get('#\\/ef1dg6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef2dg6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef3dg6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dg6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })


    cy.get('#\\/ef1dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/ef1dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/ef1dc6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dc6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dc6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dc6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/ef1dc6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dc6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dc6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dc6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })



    cy.get('#\\/ef1dg8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 8)).eq(Math.sin(Math.PI).toString().slice(0, 8))
    })
    cy.get('#\\/ef2dg8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 8)).eq(Math.sin(Math.PI).toString().slice(0, 8))
    })
    cy.get('#\\/ef3dg8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dg8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 8)).eq(Math.sin(Math.PI).toString().slice(0, 8))
    })


    cy.get('#\\/ef1dc7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dc7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dc7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dc7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })


    cy.get('#\\/ef1dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/ef1dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/ef1dsz0a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 3)).eq(Math.sin(Math.PI).toString().slice(0, 3))
    })
    cy.get('#\\/ef2dsz0a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dsz0a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/ef4dsz0a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })

  })

  it('rounding on display, ovewrite on copy functions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy target="f2" displayDigits="3" assignNames="f1" />
  <copy target="f4" displayDecimals="3" assignNames="f2" />
  <function displaySmallAsZero="1E-13" name="f3">100sin(x)</function>
  <copy target="f3" displaySmallAsZero="0" assignNames="f4" />

  <p>Input: <mathinput name="input" prefill="1" /></p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1" />
  <evaluate function="$f2" input="$input" name="ef2" />
  <evaluate function="$f3" input="$input" name="ef3" />
  <evaluate function="$f4" input="$input" name="ef4" />
  <copy target="ef1" assignNames="ef1a" />
  <copy target="ef2" assignNames="ef2a" />
  <copy target="ef3" assignNames="ef3a" />
  <copy target="ef4" assignNames="ef4a" />
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dg6" displayDigits="6" />
  <evaluate function="$f2" input="$input" name="ef2dg6" displayDigits="6" />
  <evaluate function="$f3" input="$input" name="ef3dg6" displayDigits="6" />
  <evaluate function="$f4" input="$input" name="ef4dg6" displayDigits="6" />
  <copy target="ef1dg6" assignNames="ef1dg6a" />
  <copy target="ef2dg6" assignNames="ef2dg6a" />
  <copy target="ef3dg6" assignNames="ef3dg6a" />
  <copy target="ef4dg6" assignNames="ef4dg6a" />
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dc6" displayDecimals="6" />
  <evaluate function="$f2" input="$input" name="ef2dc6" displayDecimals="6" />
  <evaluate function="$f3" input="$input" name="ef3dc6" displayDecimals="6" />
  <evaluate function="$f4" input="$input" name="ef4dc6" displayDecimals="6" />
  <copy target="ef1dc6" assignNames="ef1dc6a" />
  <copy target="ef2dc6" assignNames="ef2dc6a" />
  <copy target="ef3dc6" assignNames="ef3dc6a" />
  <copy target="ef4dc6" assignNames="ef4dc6a" />
  </p>

  <p>
  <evaluate function="$f1" input="$input" name="ef1dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f2" input="$input" name="ef2dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f3" input="$input" name="ef3dsz" displaySmallAsZero="1E-13" />
  <evaluate function="$f4" input="$input" name="ef4dsz" displaySmallAsZero="1E-13" />
  <copy target="ef1dsz" assignNames="ef1dsza" />
  <copy target="ef2dsz" assignNames="ef2dsza" />
  <copy target="ef3dsz" assignNames="ef3dsza" />
  <copy target="ef4dsz" assignNames="ef4dsza" />
  </p>

  <p>
  <m name="ef1m">$$f1($input)</m>
  <m name="ef2m">$$f2($input)</m>
  <m name="ef3m">$$f3($input)</m>
  <m name="ef4m">$$f4($input)</m>
  <copy target="ef1m" assignNames="ef1ma" />
  <copy target="ef2m" assignNames="ef2ma" />
  <copy target="ef3m" assignNames="ef3ma" />
  <copy target="ef4m" assignNames="ef4ma" />
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/ef1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef1a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })

    cy.get('#\\/ef1dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef2dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef3dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef4dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef1dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef2dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef3dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })
    cy.get('#\\/ef4dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1471')
    })


    cy.get('#\\/ef1dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef2dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef3dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef4dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef1dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef2dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef3dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })
    cy.get('#\\/ef4dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147098')
    })

    cy.get('#\\/ef1dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef1dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })

    cy.get('#\\/ef1m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef1ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.1')
    })
    cy.get('#\\/ef2ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.147')
    })
    cy.get('#\\/ef3ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })
    cy.get('#\\/ef4ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('84.14709848')
    })

    cy.get('#\\/input textarea').type("{end}{backspace}pi{enter}", { force: true });


    cy.get('#\\/ef2').should('contain.text', '0');
    cy.get('#\\/ef1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 3)).eq(Math.sin(Math.PI).toString().slice(0, 3))
    })
    cy.get('#\\/ef2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/ef1a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 3)).eq(Math.sin(Math.PI).toString().slice(0, 3))
    })
    cy.get('#\\/ef2a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })

    cy.get('#\\/ef1dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef2dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef3dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dg6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef1dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef2dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })
    cy.get('#\\/ef3dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dg6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 6)).eq(Math.sin(Math.PI).toString().slice(0, 6))
    })


    cy.get('#\\/ef1dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dc6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef1dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dc6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/ef1dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dsz').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef1dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef2dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4dsza').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/ef1m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 3)).eq(Math.sin(Math.PI).toString().slice(0, 3))
    })
    cy.get('#\\/ef2m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })
    cy.get('#\\/ef1ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 3)).eq(Math.sin(Math.PI).toString().slice(0, 3))
    })
    cy.get('#\\/ef2ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef3ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/ef4ma').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().slice(0, 9)).eq(Math.sin(Math.PI).toString().slice(0, 9))
    })



  })

  it('evaluate numeric and symbolic for function of two variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Variable 1: <mathinput name="variable1" prefill="x" /></p>
  <p>Variable 2: <mathinput name="variable2" prefill="y" /></p>
  <p>Function: <mathinput name="formula" prefill="sin(x+y)"/></p>
  <p>Input 1 value: <mathinput name="input1" prefill="0" /></p>
  <p>Input 2 value: <mathinput name="input2" prefill="0" /></p>

  <function name="f_symbolic" variables="$variable1 $variable2" symbolic>$formula</function>

  <function name="f_numeric" variables="$variable1 $variable2">$formula</function>

  <p>Evaluate symbolic: 
    <evaluate name="result_symbolic" function="$f_symbolic" input="$input1 $input2" />
  </p>

  <p name="p_symbolic2">Evaluate symbolic using macro:  <m name="result_symbolic2">$$f_symbolic($input1, $input2)</m></p>

  <p>Evaluated symbolic result again: <copy target="result_symbolic" assignNames="result_symbolic3" /></p>


  <p>Evaluate numeric: 
    <evaluate name="result_numeric" function="$f_numeric" input="$input1 $input2" />
  </p>

  <p>Evaluate numeric using macro:  <m name="result_numeric2">$$f_numeric($input1, $input2)</m></p>

  <p>Evaluated numeric result again: <copy target="result_numeric" assignNames="result_numeric3" /></p>

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


    let result_symbolic2_name;
    let result_numeric2_name;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["apply", "sin", ['+', 0, 0]]);
      result_symbolic2_name = stateVariables['/result_symbolic2'].activeChildren[0].componentName;
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["apply", "sin", ['+', 0, 0]]);
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["apply", "sin", ['+', 0, 0]]);
      expect(stateVariables['/result_numeric'].stateValues.value).eq(0);
      result_numeric2_name = stateVariables['/result_numeric2'].activeChildren[0].componentName;
      expect(stateVariables[result_numeric2_name].stateValues.value).eq(0);
      expect(stateVariables['/result_numeric3'].stateValues.value).eq(0);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["apply", "sin", ['+', 0, 0]]);
      expect(stateVariables['/result_force_numeric_symbolic'].stateValues.value).eq(0);
    })


    cy.log('evaluate at (pi, 2pi)')
    cy.get('#\\/input1 textarea').type("{end}{backspace}pi{enter}", { force: true });
    cy.get('#\\/input2 textarea').type("{end}{backspace}2pi{enter}", { force: true });
    cy.get('#\\/result_symbolic').should('contain.text', 'sin(π+2π)')
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(stateVariables['/result_numeric'].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables[result_numeric2_name].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables['/result_numeric3'].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(stateVariables['/result_force_numeric_symbolic'].stateValues.value).closeTo(0, 1E-10);
    })


    cy.log('change variable')
    cy.get('#\\/variable1 textarea').type("{end}{backspace}u{enter}", { force: true });
    cy.get('#\\/variable2 textarea').type("{end}{backspace}v{enter}", { force: true });
    cy.get('#\\/result_symbolic').should('contain.text', 'sin(x+y)')
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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["apply", "sin", ["+", "x", "y"]])
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["apply", "sin", ["+", "x", "y"]])
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["apply", "sin", ["+", "x", "y"]])
      assert.isNaN(stateVariables['/result_numeric'].stateValues.value);
      assert.isNaN(stateVariables[result_numeric2_name].stateValues.value);
      assert.isNaN(stateVariables['/result_numeric3'].stateValues.value);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["apply", "sin", ["+", "x", "y"]]);
      assert.isNaN(stateVariables['/result_force_numeric_symbolic'].stateValues.value);

    })

    cy.log('change formula to use new variables')
    cy.get('#\\/formula textarea').type("{end}{leftarrow}{backspace}{backspace}{backspace}u+v{enter}", { force: true });
    cy.get('#\\/result_symbolic').should('contain.text', 'sin(π+2π)')
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(stateVariables['/result_numeric'].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables[result_numeric2_name].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables['/result_numeric3'].stateValues.value).closeTo(0, 1E-10);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["apply", "sin", ["+", "pi", ['*', 2, 'pi']]]);
      expect(stateVariables['/result_force_numeric_symbolic'].stateValues.value).closeTo(0, 1E-10);
    })


  })

  it('function of multiple variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Variables: <mathinput name="variablesOrig" prefill="x,y" /></p>
  <p>Function: <mathinput name="formula" prefill="sin(x+y)"/></p>
  <p>Input: <mathinput name="input" prefill="(0,0)" /></p>
  <mathlist mergeMathLists name="variables" hide>$variablesOrig</mathlist>

  <function name="f" variables="$variables" symbolic simplify>$formula</function>

  <p>Evaluate 1: 
    <evaluate name="result1" function="$f" input="$input" />
  </p>

  <p>Evaluate 2:  <m name="result2">$$f($input)</m></p>

  <p>Evaluate 3: <copy target="result1" assignNames="result3" /></p>
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
    let result2Name;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result1'].stateValues.value).eqls(0);
      result2Name = stateVariables['/result2'].activeChildren[0].componentName;
      expect(stateVariables[result2Name].stateValues.value).eqls(0);
      expect(stateVariables['/result3'].stateValues.value).eqls(0);
    })

    cy.log('evaluate at (pi, pi/2)')
    cy.get('#\\/input textarea').type("{end}{leftArrow}{backspace}{backspace}{backspace}pi,pi/2{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '−1')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result1'].stateValues.value).eqls(-1);
      expect(stateVariables[result2Name].stateValues.value).eqls(-1);
      expect(stateVariables['/result3'].stateValues.value).eqls(-1);
    })

    cy.log('change variables to 3D')
    cy.get('#\\/variablesOrig textarea').type("{end},z{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '＿')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result1'].stateValues.value).eqls('＿');
      expect(stateVariables[result2Name].stateValues.value).eqls('＿');
      expect(stateVariables['/result3'].stateValues.value).eqls('＿');
    })


    cy.log('change input to 3D')
    cy.get('#\\/input textarea').type("{end}{leftArrow},3{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '−1')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result1'].stateValues.value).eqls(-1);
      expect(stateVariables[result2Name].stateValues.value).eqls(-1);
      expect(stateVariables['/result3'].stateValues.value).eqls(-1);
    })

    cy.log('change formula to use all variables')
    cy.get('#\\/formula textarea').type("z{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '−3')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−3')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−3')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−3')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result1'].stateValues.value).eqls(-3);
      expect(stateVariables[result2Name].stateValues.value).eqls(-3);
      expect(stateVariables['/result3'].stateValues.value).eqls(-3);
    })

    cy.log('add fourth variable to formula')
    cy.get('#\\/formula textarea').type("{end}{leftArrow}/w{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '3sin(π+π2w)')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3sin(π+π2w)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3sin(π+π2w)')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3sin(π+π2w)')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result1'].stateValues.value).eqls(['*', 3, ['apply', 'sin', ['+', 'pi', ['/', 'pi', ['*', 2, 'w']]]]]);
      expect(stateVariables[result2Name].stateValues.value).eqls(['*', 3, ['apply', 'sin', ['+', 'pi', ['/', 'pi', ['*', 2, 'w']]]]]);
      expect(stateVariables['/result3'].stateValues.value).eqls(['*', 3, ['apply', 'sin', ['+', 'pi', ['/', 'pi', ['*', 2, 'w']]]]]);
    })


    cy.log('add 4th input')
    cy.get('#\\/input textarea').type("{end}{leftArrow},3{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '＿')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result1'].stateValues.value).eqls('＿');
      expect(stateVariables[result2Name].stateValues.value).eqls('＿');
      expect(stateVariables['/result3'].stateValues.value).eqls('＿');
    })

    cy.log('add 4th variable')
    cy.get('#\\/variablesOrig textarea').type("{end},w{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '−32')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−32')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−32')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−32')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result1'].stateValues.value).eqls(['/', -3, 2]);
      expect(stateVariables[result2Name].stateValues.value).eqls(['/', -3, 2]);
      expect(stateVariables['/result3'].stateValues.value).eqls(['/', -3, 2]);
    })


  })

  it('different input forms for function of two variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <function name="f" variables="x y" symbolic simplify>x^2/y^3</function>
  <p>Input as vector: <mathinput name="input1" prefill="(2,3)" /></p>
  <p>Input as list: <mathinput name="input2Orig" prefill="2,3" /></p>
  <mathList mergeMathLists name="input2" hide>$input2Orig</mathList>
 
  <graph>
    <point name="A" x="2" y="5" />
    <point name="B" x="3" y="6" />
  </graph>
  <collect name="input3" componentTypes="point" prop="x" target="_graph1" />

  <p>Separate inputs: <mathinput name="input4a" prefill="2" /> 
  <mathinput name="input4b" prefill="3" /></p>


  <p>Evaluate 1a: 
    <evaluate name="result1a" function="$f" input="$input1" />
  </p>
  <p>Evaluate 1b:  <m name="result1b">$$f($input1)</m></p>

  <p>Evaluate 2a: 
    <evaluate name="result2a" function="$f" input="$input2" />
  </p>
  <p>Evaluate 2b:  <m name="result2b">$$f($input2)</m></p>

  <p>Evaluate 3a: 
    <evaluate name="result3a" function="$f" input="$input3" />
  </p>
  <p>Evaluate 3b:  <m name="result3b">$$f($input3)</m></p>

  <p>Evaluate 4a: 
    <evaluate name="result4a" function="$f" input="$input4a $input4b" />
  </p>
  <p>Evaluate 4b:  <m name="result4b">$$f($input4a,$input4b)</m></p>
  <p>Evaluate 4c:  <m name="result4c">$$f($input4a, $input4b)</m></p>

  <p>Evaluate 5a: 
    <evaluate name="result5a" function="$f" input="($input4a,$input4b)" />
  </p>
  <p>Evaluate 5b:  <m name="result5b">$$f(($input4a,$input4b))</m></p>
  <p>Evaluate 5c:  <m name="result5c">$$f(($input4a, $input4b))</m></p>
  <p>Evaluate 5d (bad): 
    <evaluate name="result5d" function="$f" input="($input4a, $input4b)" />
  </p>

  <p>Evaluate 6a: 
    <evaluate name="result6a" function="$f" input="2 3" />
  </p>
  <p>Evaluate 6b:  <m name="result6b">$$f(2,3)</m></p>
  <p>Evaluate 6c:  <m name="result6c">$$f(2, 3)</m></p>

  <p>Evaluate 7a: 
    <evaluate name="result7a" function="$f" input="(2,3)" />
  </p>
  <p>Evaluate 7b:  <m name="result7b">$$f((2,3))</m></p>
  <p>Evaluate 7c:  <m name="result7c">$$f((2, 3))</m></p>
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result1a'].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables[stateVariables['/result1b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables['/result2a'].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables[stateVariables['/result2b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables['/result3a'].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables[stateVariables['/result3b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables['/result4a'].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables[stateVariables['/result4b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables[stateVariables['/result4c'].activeChildren[0].componentName].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables['/result5a'].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables[stateVariables['/result5b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables[stateVariables['/result5c'].activeChildren[0].componentName].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables['/result5d'].stateValues.value).eqls(['/', ['^', '＿', 2], ['^', '＿', 3]]);
      expect(stateVariables['/result6a'].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables[stateVariables['/result6b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables[stateVariables['/result6c'].activeChildren[0].componentName].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables['/result7a'].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables[stateVariables['/result7b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables[stateVariables['/result7c'].activeChildren[0].componentName].stateValues.value).eqls(['/', 4, 27]);
      expect(stateVariables['/result7d'].stateValues.value).eqls(['/', ['^', '＿', 2], ['^', '＿', 3]]);
    })

    cy.log(`change inputs, use altvector`);
    cy.get('#\\/input1 textarea').type('{ctrl+home}{shift+end}{backspace}\\langle -3,5\\rangle{enter}', { force: true })
    cy.get('#\\/input2Orig textarea').type('{ctrl+home}{shift+end}{backspace}-3,5', { force: true })
    cy.get('#\\/input4a textarea').type('{end}{backspace}-3', { force: true })
    cy.get('#\\/input4b textarea').type('{end}{backspace}5', { force: true }).blur()

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -3, y: 7 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 5, y: -9 }
      })

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
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/result1a'].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables[stateVariables['/result1b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables['/result2a'].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables[stateVariables['/result2b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables['/result3a'].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables[stateVariables['/result3b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables['/result4a'].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables[stateVariables['/result4b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables[stateVariables['/result4c'].activeChildren[0].componentName].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables['/result5a'].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables[stateVariables['/result5b'].activeChildren[0].componentName].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables[stateVariables['/result5c'].activeChildren[0].componentName].stateValues.value).eqls(['/', 9, 125]);
        expect(stateVariables['/result5d'].stateValues.value).eqls(['/', ['^', '＿', 2], ['^', '＿', 3]]);
      })

    })
  })

  it('evaluate numeric and symbolic for vector-valued function of two variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Variable 1: <mathinput name="variable1" prefill="x" /></p>
  <p>Variable 2: <mathinput name="variable2" prefill="y" /></p>
  <p>Function: <mathinput name="formula" prefill="(sin(x+y), cos(x-y))"/></p>
  <p>Input 1 value: <mathinput name="input1" prefill="0" /></p>
  <p>Input 2 value: <mathinput name="input2" prefill="0" /></p>

  <function name="f_symbolic" variables="$variable1 $variable2" symbolic displaySmallAsZero >$formula</function>

  <function name="f_numeric" variables="$variable1 $variable2" displaySmallAsZero >$formula</function>

  <p>Evaluate symbolic: 
    <evaluate name="result_symbolic" function="$f_symbolic" input="$input1 $input2" />
  </p>

  <p name="p_symbolic2">Evaluate symbolic using macro:  <m name="result_symbolic2">$$f_symbolic($input1, $input2)</m></p>

  <p>Evaluated symbolic result again: <copy target="result_symbolic" assignNames="result_symbolic3" /></p>


  <p>Evaluate numeric: 
    <evaluate name="result_numeric" function="$f_numeric" input="$input1 $input2" />
  </p>

  <p>Evaluate numeric using macro:  <m name="result_numeric2">$$f_numeric($input1, $input2)</m></p>

  <p>Evaluated numeric result again: <copy target="result_numeric" assignNames="result_numeric3" /></p>

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
      expect(text.trim()).equal('(sin(0),cos(0))')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(0),cos(0))')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(0),cos(0))')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,1)')
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,1)')
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,1)')
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(0),cos(0))')
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,1)')
    })

    let result_symbolic2_name;
    let result_numeric2_name;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["vector", ["apply", "sin", ['+', 0, 0]], ["apply", "cos", ["+", 0, ["-", 0]]]]);
      result_symbolic2_name = stateVariables['/result_symbolic2'].activeChildren[0].componentName;
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["vector", ["apply", "sin", ['+', 0, 0]], ["apply", "cos", ["+", 0, ["-", 0]]]]);
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["vector", ["apply", "sin", ['+', 0, 0]], ["apply", "cos", ["+", 0, ["-", 0]]]]);
      expect(stateVariables['/result_numeric'].stateValues.value).eqls(["vector", 0, 1]);
      result_numeric2_name = stateVariables['/result_numeric2'].activeChildren[0].componentName;
      expect(stateVariables[result_numeric2_name].stateValues.value).eqls(["vector", 0, 1]);
      expect(stateVariables['/result_numeric3'].stateValues.value).eqls(["vector", 0, 1]);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["vector", ["apply", "sin", ['+', 0, 0]], ["apply", "cos", ["+", 0, ["-", 0]]]]);
      expect(stateVariables['/result_force_numeric_symbolic'].stateValues.value).eqls(["vector", 0, 1]);
    })


    cy.log('evaluate at (pi, 2pi)')
    cy.get('#\\/input1 textarea').type("{end}{backspace}pi{enter}", { force: true });
    cy.get('#\\/input2 textarea').type("{end}{backspace}2pi{enter}", { force: true });

    cy.get('#\\/result_symbolic').should('contain.text', '(sin(π+2π),cos(π−2π))')
    cy.get('#\\/result_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(π+2π),cos(π−2π))')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(π+2π),cos(π−2π))')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(π+2π),cos(π−2π))')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,−1)')
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,−1)')
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,−1)')
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(π+2π),cos(π−2π))')
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,−1)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "pi", ['*', 2, 'pi']]], ["apply", "cos", ["+", "pi", ['-', ['*', 2, 'pi']]]]]);
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "pi", ['*', 2, 'pi']]], ["apply", "cos", ["+", "pi", ['-', ['*', 2, 'pi']]]]]);
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "pi", ['*', 2, 'pi']]], ["apply", "cos", ["+", "pi", ['-', ['*', 2, 'pi']]]]]);
      expect(stateVariables['/result_numeric'].stateValues.value.map(x => typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x)).eqls(["vector", 0, -1]);
      expect(stateVariables[result_numeric2_name].stateValues.value.map(x => typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x)).eqls(["vector", 0, -1]);
      expect(stateVariables['/result_numeric3'].stateValues.value.map(x => typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x)).eqls(["vector", 0, -1]);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "pi", ['*', 2, 'pi']]], ["apply", "cos", ["+", "pi", ['-', ['*', 2, 'pi']]]]]);
      expect(stateVariables['/result_force_numeric_symbolic'].stateValues.value.map(x => typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x)).eqls(["vector", 0, -1]);
    })


    cy.log('change variable')
    cy.get('#\\/variable1 textarea').type("{end}{backspace}u{enter}", { force: true });
    cy.get('#\\/variable2 textarea').type("{end}{backspace}v{enter}", { force: true });
    cy.get('#\\/result_symbolic').should('contain.text', '(sin(x+y),cos(x−y))')
    cy.get('#\\/result_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(x+y),cos(x−y))')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(x+y),cos(x−y))')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(x+y),cos(x−y))')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(NaN,NaN)')
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(NaN,NaN)')
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(NaN,NaN)')
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(x+y),cos(x−y))')
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(NaN,NaN)')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "x", "y"]], ["apply", "cos", ["+", "x", ['-', "y"]]]])
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "x", "y"]], ["apply", "cos", ["+", "x", ['-', "y"]]]])
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "x", "y"]], ["apply", "cos", ["+", "x", ['-', "y"]]]])
      assert.isNaN(stateVariables['/result_numeric'].stateValues.value[1]);
      assert.isNaN(stateVariables['/result_numeric'].stateValues.value[2]);
      assert.isNaN(stateVariables[result_numeric2_name].stateValues.value[1]);
      assert.isNaN(stateVariables[result_numeric2_name].stateValues.value[2]);
      assert.isNaN(stateVariables['/result_numeric3'].stateValues.value[1]);
      assert.isNaN(stateVariables['/result_numeric3'].stateValues.value[2]);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "x", "y"]], ["apply", "cos", ["+", "x", ['-', "y"]]]]);
      assert.isNaN(stateVariables['/result_force_numeric_symbolic'].stateValues.value[1]);
      assert.isNaN(stateVariables['/result_force_numeric_symbolic'].stateValues.value[2]);

    })

    cy.log('change formula to use new variables')
    cy.get('#\\/formula textarea').type("{end}{leftArrow}{leftArrow}{backspace}{backspace}{backspace}u-v{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{backspace}{backspace}{backspace}u+v{enter}", { force: true });
    cy.get('#\\/result_symbolic').should('contain.text', '(sin(π+2π),cos(π−2π))')

    cy.get('#\\/result_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(π+2π),cos(π−2π))')
    })
    cy.get('#\\/result_symbolic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(π+2π),cos(π−2π))')
    })
    cy.get('#\\/result_symbolic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(π+2π),cos(π−2π))')
    })
    cy.get('#\\/result_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,−1)')
    })
    cy.get('#\\/result_numeric2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,−1)')
    })
    cy.get('#\\/result_numeric3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,−1)')
    })
    cy.get('#\\/result_force_symbolic_numeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(sin(π+2π),cos(π−2π))')
    })
    cy.get('#\\/result_force_numeric_symbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,−1)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result_symbolic'].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "pi", ['*', 2, 'pi']]], ["apply", "cos", ["+", "pi", ['-', ['*', 2, 'pi']]]]]);
      expect(stateVariables[result_symbolic2_name].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "pi", ['*', 2, 'pi']]], ["apply", "cos", ["+", "pi", ['-', ['*', 2, 'pi']]]]]);
      expect(stateVariables['/result_symbolic3'].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "pi", ['*', 2, 'pi']]], ["apply", "cos", ["+", "pi", ['-', ['*', 2, 'pi']]]]]);
      expect(stateVariables['/result_numeric'].stateValues.value.map(x => typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x)).eqls(["vector", 0, -1]);
      expect(stateVariables[result_numeric2_name].stateValues.value.map(x => typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x)).eqls(["vector", 0, -1]);
      expect(stateVariables['/result_numeric3'].stateValues.value.map(x => typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x)).eqls(["vector", 0, -1]);
      expect(stateVariables['/result_force_symbolic_numeric'].stateValues.value).eqls(["vector", ["apply", "sin", ["+", "pi", ['*', 2, 'pi']]], ["apply", "cos", ["+", "pi", ['-', ['*', 2, 'pi']]]]]);
      expect(stateVariables['/result_force_numeric_symbolic'].stateValues.value.map(x => typeof x === "number" && me.math.round(x, 10) === 0 ? 0 : x)).eqls(["vector", 0, -1]);
    })

  })

  it('vector-valued function of multiple variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Variables: <mathinput name="variablesOrig" prefill="x,y" /></p>
  <p>Function: <mathinput name="formula" prefill="(x+y, x-y)"/></p>
  <p>Input: <mathinput name="input" prefill="(0,0)" /></p>
  <mathlist mergeMathLists name="variables" hide>$variablesOrig</mathlist>

  <function name="f" variables="$variables" symbolic simplify displaySmallAsZero>$formula</function>

  <p>Evaluate 1: 
    <evaluate name="result1" function="$f" input="$input" />
  </p>

  <p>Evaluate 2:  <m name="result2">$$f($input)</m></p>

  <p>Evaluate 3: <copy target="result1" assignNames="result3" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    })
    let result2Name;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/f"].stateValues.nInputs).eq(2);
      expect(stateVariables["/f"].stateValues.nOutputs).eq(2);
      expect(stateVariables['/result1'].stateValues.value).eqls(["vector", 0, 0]);
      result2Name = stateVariables['/result2'].activeChildren[0].componentName;
      expect(stateVariables[result2Name].stateValues.value).eqls(["vector", 0, 0]);
      expect(stateVariables['/result3'].stateValues.value).eqls(["vector", 0, 0]);
    })

    cy.log('evaluate at (7,3)')
    cy.get('#\\/input textarea').type("{end}{leftArrow}{backspace}{backspace}{backspace}7,3{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '(10,4)')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(10,4)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(10,4)')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(10,4)')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/f"].stateValues.nInputs).eq(2);
      expect(stateVariables["/f"].stateValues.nOutputs).eq(2);
      expect(stateVariables['/result1'].stateValues.value).eqls(["vector", 10, 4]);
      expect(stateVariables[result2Name].stateValues.value).eqls(["vector", 10, 4]);
      expect(stateVariables['/result3'].stateValues.value).eqls(["vector", 10, 4]);
    })

    cy.log('change variables to 3D')
    cy.get('#\\/variablesOrig textarea').type("{end},z{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '＿')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/f"].stateValues.nInputs).eq(3);
      expect(stateVariables["/f"].stateValues.nOutputs).eq(2);
      expect(stateVariables['/result1'].stateValues.value).eqls('＿');
      expect(stateVariables[result2Name].stateValues.value).eqls('＿');
      expect(stateVariables['/result3'].stateValues.value).eqls('＿');
    })


    cy.log('change input to 3D')
    cy.get('#\\/input textarea').type("{end}{leftArrow},2{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '(10,4)')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(10,4)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(10,4)')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(10,4)')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/f"].stateValues.nInputs).eq(3);
      expect(stateVariables["/f"].stateValues.nOutputs).eq(2);
      expect(stateVariables['/result1'].stateValues.value).eqls(["vector", 10, 4]);
      expect(stateVariables[result2Name].stateValues.value).eqls(["vector", 10, 4]);
      expect(stateVariables['/result3'].stateValues.value).eqls(["vector", 10, 4]);
    })

    cy.log('change formula to use all variables')
    cy.get('#\\/formula textarea').type("{rightArrow}z{end}{leftArrow}z{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '(17,1)')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1)')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1)')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/f"].stateValues.nInputs).eq(3);
      expect(stateVariables["/f"].stateValues.nOutputs).eq(2);
      expect(stateVariables['/result1'].stateValues.value).eqls(["vector", 17, 1]);
      expect(stateVariables[result2Name].stateValues.value).eqls(["vector", 17, 1]);
      expect(stateVariables['/result3'].stateValues.value).eqls(["vector", 17, 1]);
    })


    cy.log('add third dimension')
    cy.get('#\\/formula textarea').type("{end},xyz{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '(17,1,42)')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1,42)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1,42)')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1,42)')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/f"].stateValues.nInputs).eq(3);
      expect(stateVariables["/f"].stateValues.nOutputs).eq(3);
      expect(stateVariables['/result1'].stateValues.value).eqls(["vector", 17, 1, 42]);
      expect(stateVariables[result2Name].stateValues.value).eqls(["vector", 17, 1, 42]);
      expect(stateVariables['/result3'].stateValues.value).eqls(["vector", 17, 1, 42]);
    })

    cy.log('add fourth variable and 4th dimension to formula')
    cy.get('#\\/formula textarea').type("{end}w,w{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '(17,1,42w,w)')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1,42w,w)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1,42w,w)')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1,42w,w)')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/f"].stateValues.nInputs).eq(3);
      expect(stateVariables["/f"].stateValues.nOutputs).eq(4);
      expect(stateVariables['/result1'].stateValues.value).eqls(["vector", 17, 1, ['*', 42, 'w'], 'w']);
      expect(stateVariables[result2Name].stateValues.value).eqls(["vector", 17, 1, ['*', 42, 'w'], 'w']);
      expect(stateVariables['/result3'].stateValues.value).eqls(["vector", 17, 1, ['*', 42, 'w'], 'w']);
    })


    cy.log('add 4th input')
    cy.get('#\\/input textarea').type("{end}{leftArrow},5{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '＿')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result1'].stateValues.value).eqls('＿');
      expect(stateVariables[result2Name].stateValues.value).eqls('＿');
      expect(stateVariables['/result3'].stateValues.value).eqls('＿');
    })

    cy.log('add 4th variable')
    cy.get('#\\/variablesOrig textarea').type("{end},w{enter}", { force: true });

    cy.get('#\\/result1').should('contain.text', '(17,1,210,5)')
    cy.get('#\\/result1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1,210,5)')
    })
    cy.get('#\\/result2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1,210,5)')
    })
    cy.get('#\\/result3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(17,1,210,5)')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/result1'].stateValues.value).eqls(["vector", 17, 1, 210, 5]);
      expect(stateVariables[result2Name].stateValues.value).eqls(["vector", 17, 1, 210, 5]);
      expect(stateVariables['/result3'].stateValues.value).eqls(["vector", 17, 1, 210, 5]);
    })


  })

  it('change variables of symbolic function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>f: <function name="f" variables="s t" symbolic simplify expand>st^2</function></p>
  <p>g: <function name="g" variables="t s">$f</function></p>

  <p name="pf1">f(u, v+w) = $$f(u, v+w)</p>
  <p name="pf2">f(a+b, c) = $$f(a+b, c)</p>
  <p name="pg1">g(u, v+w) = $$g(u, v+w)</p>
  <p name="pg2">g(a+b, c) = $$g(a+b, c)</p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');

    cy.get('#\\/pf1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv2+2uvw+uw2')
    })
    cy.get('#\\/pf2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ac2+bc2')
    })
    cy.get('#\\/pg1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('vu2+wu2')
    })
    cy.get('#\\/pg2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ca2+2abc+cb2')
    })


  })

  it('change variables of numeric function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>f: <function name="f" variables="s t">st^2</function></p>
  <p>g: <function name="g" variables="t s">$f</function></p>

  <p name="pf">f(2, -3) = $$f(2, -3)</p>
  <p name="pg">g(2, -3) = $$g(2, -3)</p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');

    cy.get('#\\/pf').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('18')
    })
    cy.get('#\\/pg').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−12')
    })


  })

  it('change variables of interpolated function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>f: <function name="f" variables="s" maxima="(3,4)" /></p>
  <p>g: <function name="g" variables="t">$f</function></p>

  <p name="pf1">f(3) = $$f(3)</p>
  <p name="pf2">f(4) = $$f(4)</p>
  <p name="pf3">f(5) = $$f(5)</p>
  <p name="pg1">g(3) = $$g(3)</p>
  <p name="pg2">g(4) = $$g(4)</p>
  <p name="pg3">g(5) = $$g(5)</p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');

    cy.get('#\\/pf1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/pf2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/pf3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/pg1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/pg2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/pg3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })


  })

  it('evaluate at asymptotes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>f1: <function name="f1">1/x</function></p>
  <p>f2: <function name="f2">1/(-x)</function></p>
  <p>f3: <function name="f3">-1/x</function></p>
  <p>f4: <function name="f4">-1/(-x)</function></p>
  <p>f5: <function name="f5">1/(x(x-1))</function></p>
  <p>f6: <function name="f6">1/(x(x+1))</function></p>
  <p>f7: <function name="f7">1/(x(x+1)(x-1))</function></p>
  <p>f5a: <function name="f5a">1/x*1/(x-1)</function></p>
  <p>f6a: <function name="f6a">1/x*1/(x+1)</function></p>
  <p>f7a: <function name="f7a">1/x*1/(x+1)*1/(x-1)</function></p>

  <p><evaluate function="$f1" input="0" name="f10n" /></p>
  <p><evaluate function="$f1" input="0" name="f10s" forceSymbolic simplify /></p>
  <p><evaluate function="$f2" input="0" name="f20n" /></p>
  <p><evaluate function="$f2" input="0" name="f20s" forceSymbolic simplify /></p>
  <p><evaluate function="$f3" input="0" name="f30n" /></p>
  <p><evaluate function="$f3" input="0" name="f30s" forceSymbolic simplify /></p>
  <p><evaluate function="$f4" input="0" name="f40n" /></p>
  <p><evaluate function="$f4" input="0" name="f40s" forceSymbolic simplify /></p>

  <p><evaluate function="$f5" input="0" name="f50n" /></p>
  <p><evaluate function="$f5" input="0" name="f50s" forceSymbolic simplify /></p>
  <p><evaluate function="$f5" input="1" name="f51n" /></p>
  <p><evaluate function="$f5" input="1" name="f51s" forceSymbolic simplify /></p>

  <p><evaluate function="$f6" input="0" name="f60n" /></p>
  <p><evaluate function="$f6" input="0" name="f60s" forceSymbolic simplify /></p>
  <p><evaluate function="$f6" input="-1" name="f6n1n" /></p>
  <p><evaluate function="$f6" input="-1" name="f6n1s" forceSymbolic simplify /></p>

  <p><evaluate function="$f7" input="0" name="f70n" /></p>
  <p><evaluate function="$f7" input="0" name="f70s" forceSymbolic simplify /></p>
  <p><evaluate function="$f7" input="1" name="f71n" /></p>
  <p><evaluate function="$f7" input="1" name="f71s" forceSymbolic simplify /></p>
  <p><evaluate function="$f7" input="-1" name="f7n1n" /></p>
  <p><evaluate function="$f7" input="-1" name="f7n1s" forceSymbolic simplify /></p>


  <p><evaluate function="$f5a" input="0" name="f5a0n" /></p>
  <p><evaluate function="$f5a" input="0" name="f5a0s" forceSymbolic simplify /></p>
  <p><evaluate function="$f5a" input="1" name="f5a1n" /></p>
  <p><evaluate function="$f5a" input="1" name="f5a1s" forceSymbolic simplify /></p>

  <p><evaluate function="$f6a" input="0" name="f6a0n" /></p>
  <p><evaluate function="$f6a" input="0" name="f6a0s" forceSymbolic simplify /></p>
  <p><evaluate function="$f6a" input="-1" name="f6an1n" /></p>
  <p><evaluate function="$f6a" input="-1" name="f6an1s" forceSymbolic simplify /></p>

  <p><evaluate function="$f7a" input="0" name="f7a0n" /></p>
  <p><evaluate function="$f7a" input="0" name="f7a0s" forceSymbolic simplify /></p>
  <p><evaluate function="$f7a" input="1" name="f7a1n" /></p>
  <p><evaluate function="$f7a" input="1" name="f7a1s" forceSymbolic simplify /></p>
  <p><evaluate function="$f7a" input="-1" name="f7an1n" /></p>
  <p><evaluate function="$f7a" input="-1" name="f7an1s" forceSymbolic simplify /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/f10n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f10s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })

    cy.get('#\\/f20n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f20s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })

    cy.get('#\\/f30n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f30s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })

    cy.get('#\\/f40n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f40s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })

    cy.get('#\\/f50n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f50s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f51n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f51s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })

    cy.get('#\\/f60n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f60s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f6n1n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f6n1s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })

    cy.get('#\\/f70n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f70s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f71n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f71s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f7n1n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f7n1s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })


    cy.get('#\\/f5a0n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f5a0s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f5a1n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f5a1s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })

    cy.get('#\\/f6a0n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f6a0s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f6an1n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f6an1s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })

    cy.get('#\\/f7a0n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f7a0s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f7a1n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f7a1s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f7an1n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f7an1s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })

  })

  it('evaluate at infinity', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>f1: <function name="f1">1/x</function></p>
  <p>f2: <function name="f2">1/(-x)</function></p>
  <p>f3: <function name="f3">x^3</function></p>
  <p>f4: <function name="f4">(-x)^3</function></p>
  <p>f5: <function name="f5">sin(x)</function></p>

  <p><evaluate function="$f1" input="Infinity" name="f1pn" /></p>
  <p><evaluate function="$f1" input="Infinity" name="f1ps" forceSymbolic simplify /></p>
  <p><evaluate function="$f1" input="-Infinity" name="f1mn" /></p>
  <p><evaluate function="$f1" input="-Infinity" name="f1ms" forceSymbolic simplify /></p>

  <p><evaluate function="$f2" input="Infinity" name="f2pn" /></p>
  <p><evaluate function="$f2" input="Infinity" name="f2ps" forceSymbolic simplify /></p>
  <p><evaluate function="$f2" input="-Infinity" name="f2mn" /></p>
  <p><evaluate function="$f2" input="-Infinity" name="f2ms" forceSymbolic simplify /></p>

  <p><evaluate function="$f3" input="Infinity" name="f3pn" /></p>
  <p><evaluate function="$f3" input="Infinity" name="f3ps" forceSymbolic simplify /></p>
  <p><evaluate function="$f3" input="-Infinity" name="f3mn" /></p>
  <p><evaluate function="$f3" input="-Infinity" name="f3ms" forceSymbolic simplify /></p>

  <p><evaluate function="$f4" input="Infinity" name="f4pn" /></p>
  <p><evaluate function="$f4" input="Infinity" name="f4ps" forceSymbolic simplify /></p>
  <p><evaluate function="$f4" input="-Infinity" name="f4mn" /></p>
  <p><evaluate function="$f4" input="-Infinity" name="f4ms" forceSymbolic simplify /></p>

  <p><evaluate function="$f5" input="Infinity" name="f5pn" /></p>
  <p><evaluate function="$f5" input="Infinity" name="f5ps" forceSymbolic simplify /></p>
  <p><evaluate function="$f5" input="-Infinity" name="f5mn" /></p>
  <p><evaluate function="$f5" input="-Infinity" name="f5ms" forceSymbolic simplify /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/f1pn').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/f1ps').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/f1mn').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/f1ms').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/f2pn').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/f2ps').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/f2mn').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/f2ms').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/f3pn').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f3ps').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f3mn').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f3ms').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })

    cy.get('#\\/f4pn').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f4ps').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−∞')
    })
    cy.get('#\\/f4mn').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })
    cy.get('#\\/f4ms').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('∞')
    })

    cy.get('#\\/f5pn').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/f5ps').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(∞)')
    })
    cy.get('#\\/f5mn').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/f5ms').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(−∞)')
    })



  })

  it('evaluate at domain boundary', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>f1: <function name="f1" domain="(-pi,pi)" displaySmallAsZero>sin(x)</function></p>
  <p>f2: <function name="f2" domain="(-pi,pi]" displaySmallAsZero>sin(x)</function></p>
  <p>f3: <function name="f3" domain="[-pi,pi]" displaySmallAsZero>sin(x)</function></p>
  <p>f4: <function name="f4" domain="[-pi,pi)" displaySmallAsZero>sin(x)</function></p>

  <p><evaluate function="$f1" input="-pi" name="f1l" /></p>
  <p><evaluate function="$f1" input="pi" name="f1r" /></p>
  <p><evaluate function="$f1" input="0" name="f1m" /></p>

  <p><evaluate function="$f2" input="-pi" name="f2l" /></p>
  <p><evaluate function="$f2" input="pi" name="f2r" /></p>
  <p><evaluate function="$f2" input="0" name="f2m" /></p>

  <p><evaluate function="$f3" input="-pi" name="f3l" /></p>
  <p><evaluate function="$f3" input="pi" name="f3r" /></p>
  <p><evaluate function="$f3" input="0" name="f3m" /></p>

  <p><evaluate function="$f4" input="-pi" name="f4l" /></p>
  <p><evaluate function="$f4" input="pi" name="f4r" /></p>
  <p><evaluate function="$f4" input="0" name="f4m" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/f1l').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/f1r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/f1m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/f2l').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/f2r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/f2m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/f3l').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/f3r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/f3m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.get('#\\/f4l').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/f4r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/f4m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

  })

  it('evaluate interpolated at domain boundary', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>f1: <function name="f1" domain="(-4, 3)" through="(-4,1) (-3,5) (3,-1)" /></p>
  <p>f2: <function name="f2" domain="(-4, 3]" through="(-4,1) (-3,5) (3,-1)" /></p>
  <p>f3: <function name="f3" domain="[-4, 3]" through="(-4,1) (-3,5) (3,-1)" /></p>
  <p>f4: <function name="f4" domain="[-4, 3)" through="(-4,1) (-3,5) (3,-1)" /></p>

  <p><evaluate function="$f1" input="-4" name="f1l" /></p>
  <p><evaluate function="$f1" input="3" name="f1r" /></p>
  <p><evaluate function="$f1" input="-3" name="f1m" /></p>

  <p><evaluate function="$f2" input="-4" name="f2l" /></p>
  <p><evaluate function="$f2" input="3" name="f2r" /></p>
  <p><evaluate function="$f2" input="-3" name="f2m" /></p>

  <p><evaluate function="$f3" input="-4" name="f3l" /></p>
  <p><evaluate function="$f3" input="3" name="f3r" /></p>
  <p><evaluate function="$f3" input="-3" name="f3m" /></p>

  <p><evaluate function="$f4" input="-4" name="f4l" /></p>
  <p><evaluate function="$f4" input="3" name="f4r" /></p>
  <p><evaluate function="$f4" input="-3" name="f4m" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/f1l').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/f1r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/f1m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.get('#\\/f2l').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/f2r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.get('#\\/f2m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.get('#\\/f3l').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/f3r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    })
    cy.get('#\\/f3m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.get('#\\/f4l').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/f4r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    })
    cy.get('#\\/f4m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

  })



})



