
describe('Boolean Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })


  it('basic boolean evaluation', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>
    <boolean name="t1">true</boolean>
    <boolean name="t2">trUe</boolean>
    <boolean name="t3">1</boolean>
    <boolean name="t4">10</boolean>
    <boolean name="t5">3+1>1</boolean>
    <boolean name="t6"><math>1 > 2</math> = <math>2 < 1</math></boolean>
    <boolean name="t7">not false</boolean>
    <boolean name="t8">true or false</boolean>
    <boolean name="t9">true and not false</boolean>
    <boolean name="t10">true or not false</boolean>
    <boolean name="t11">not true or not false</boolean>
    <boolean name="t12">not not true</boolean>
    <boolean name="t13">not(true and false)</boolean>
    <boolean name="t14">not(not true or false)</boolean>
    <boolean name="t15">not(not true and false)</boolean>
    <boolean name="t16">not(not true and not false)</boolean>
    <boolean name="t17">not 0</boolean>
    <boolean name="t18"><math>1</math> &lt; <math>3</math></boolean>
    <boolean name="t19">not x</boolean>
    <boolean name="t20"><math>1</math></boolean>
    <boolean name="t21">x-x+1</boolean>
    <boolean name="t22"><math>x-x+1</math></boolean>
    <boolean name="t23">xy = x*y</boolean>
    <boolean name="t24"><math>xy</math> = xy</boolean>
    <boolean name="t25"><text>hello</text> = hello</boolean>
    <boolean name="t26"><boolean>1</boolean> = true</boolean>
    <boolean name="t27"><boolean>0</boolean> = false</boolean>
    <boolean name="t28"><number>0/0</number> = <number>0/0</number></boolean>
    <boolean name="t29"><number>-0/0</number> = <number>0/0</number></boolean>
    <boolean name="t30"><number>3/0</number> = <number>4/0</number></boolean>
    <boolean name="t31"><number>3/0</number> = <number>-4/-0</number></boolean>
    <boolean name="t32"><number>3/-0</number> = <number>-4/0</number></boolean>
    <boolean name="t33"><number>5</number> = <math>5</math></boolean>
    <boolean name="t34"><number>0/0</number> = <math simplify>0/0</math></boolean>
    <boolean name="t35"><number>3/0</number> = <math simplify>4/0</math></boolean>
    <boolean name="t36"><number>3/-0</number> = <math simplify>-4/0</math></boolean>

    </p>

    <p>
    <boolean name="f1">false</boolean>
    <boolean name="f2">t</boolean>
    <boolean name="f3">f</boolean>
    <boolean name="f4">hello</boolean>
    <boolean name="f5">0</boolean>
    <boolean name="f6">x</boolean>
    <boolean name="f7">x>1</boolean>
    <boolean name="f8"></boolean>
    <boolean name="f9">not true</boolean>
    <boolean name="f10">true and false</boolean>
    <boolean name="f11">not true or false</boolean>
    <boolean name="f12">not true and false</boolean>
    <boolean name="f13">not true and not false</boolean>
    <boolean name="f14">not not false</boolean>
    <boolean name="f15">not(true or false)</boolean>
    <boolean name="f16">not(true and not false)</boolean>
    <boolean name="f17">not(true or not false)</boolean>
    <boolean name="f18">not(not true or not false)</boolean>
    <boolean name="f19">not 1</boolean>
    <boolean name="f20"><math>3</math> &lt; <math>1</math></boolean>
    <boolean name="f21"><math>2 > 1</math></boolean>
    <boolean name="f22"><math>xy</math> != xy</boolean>
    <boolean name="f23"><text>hello</text> != hello</boolean>
    <boolean name="f24"><boolean>1</boolean> != true</boolean>
    <boolean name="f25"><boolean>0</boolean> != false</boolean>
    <boolean name="f26"><text>true</text></boolean>
    <boolean name="f27"><math>true</math></boolean>
    <boolean name="f28"><number>3/-0</number> = <number>3/0</number></boolean>
    <boolean name="f29"><number>3/0</number> = <number>0/0</number></boolean>
    <boolean name="f30"><number>3/-0</number> = <number>0/0</number></boolean>
    </p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('contain.text', 'a')


    let nTrues = 36, nFalses = 30;
    for (let i = 1; i <= nTrues; i++) {
      cy.get(`#\\/t${i}`).should('have.text', "true")
    }

    for (let i = 1; i <= nFalses; i++) {
      cy.get(`#\\/f${i}`).should('have.text', "false")
    }

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let i = 1; i <= nTrues; i++) {
        expect(components[`/t${i}`].stateValues.value).to.be.true
      }
      for (let i = 1; i <= nFalses; i++) {
        expect(components[`/f${i}`].stateValues.value).to.be.false
      }
    })

  })


  it('boolean based on math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <mathinput prefill="0" />

    <text hide="$_mathinput1">
      Hello there!
    </text>
    `}, "*");
    });

    cy.get('#\\/_text1').should('contain.text', 'Hello there!')

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}3{enter}', { force: true });
    cy.get('#\\/_text1').should('not.exist');

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}2x{enter}', { force: true });
    cy.get('#\\/_text1').should('contain.text', 'Hello there!')

    cy.get('#\\/_mathinput1 textarea').type('{end}-x-x{enter}', { force: true });
    cy.get('#\\/_text1').should('contain.text', 'Hello there!')

  })


  it('boolean from computation', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <mathinput prefill="1" name="i" />

    <boolean>mod($i,2) = 1</boolean>
    <boolean>abs(cos(pi*$i/2)) < 1E-12</boolean>
    <boolean>(-1)^$i = 1</boolean>
    <boolean>floor(($i+1)/2) = ceil(($i-1)/2)</boolean>
    
    `}, "*");
    });

    cy.get('#\\/_boolean1').should('have.text', "true")
    cy.get('#\\/_boolean2').should('have.text', "true")
    cy.get('#\\/_boolean3').should('have.text', "false")
    cy.get('#\\/_boolean4').should('have.text', "false")

    cy.get('#\\/i textarea').type('{end}{backspace}4{enter}', { force: true });
    cy.get('#\\/_boolean1').should('have.text', "false")
    cy.get('#\\/_boolean2').should('have.text', "false")
    cy.get('#\\/_boolean3').should('have.text', "true")
    cy.get('#\\/_boolean4').should('have.text', "true")

    cy.get('#\\/i textarea').type('{end}{backspace}-7{enter}', { force: true });
    cy.get('#\\/_boolean1').should('have.text', "true")
    cy.get('#\\/_boolean2').should('have.text', "true")
    cy.get('#\\/_boolean3').should('have.text', "false")
    cy.get('#\\/_boolean4').should('have.text', "false")

    cy.get('#\\/i textarea').type('{end}{backspace}{backspace}0{enter}', { force: true });
    cy.get('#\\/_boolean1').should('have.text', "false")
    cy.get('#\\/_boolean2').should('have.text', "false")
    cy.get('#\\/_boolean3').should('have.text', "true")
    cy.get('#\\/_boolean4').should('have.text', "true")


  })

  it('math errors and invalid targets are not equal', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `

    <boolean><math></math> = <math></math></boolean>
    <boolean><math></math> != <math></math></boolean>
    <boolean><math>/</math> = <math>-</math></boolean>
    <boolean><math>/</math> != <math>-</math></boolean>

    <boolean>$invalid = $invalid</boolean>
    <boolean>$invalid != $invalid</boolean>
    <boolean>$nothing = $nada</boolean>
    <boolean>$nothing != $nada</boolean>
    
    `}, "*");
    });

    cy.get('#\\/_boolean1').should('have.text', "false")
    cy.get('#\\/_boolean2').should('have.text', "true")
    cy.get('#\\/_boolean3').should('have.text', "false")
    cy.get('#\\/_boolean4').should('have.text', "true")

    cy.get('#\\/_boolean5').should('have.text', "false")
    cy.get('#\\/_boolean6').should('have.text', "true")
    cy.get('#\\/_boolean7').should('have.text', "false")
    cy.get('#\\/_boolean8').should('have.text', "true")

  })

  it('boolean with number strings for text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <choiceinput name="c">
      <choice>1</choice>
      <choice>2</choice>
      <choice>three</choice>
      <choice>four</choice>
    </choiceinput>

    <boolean name="one">$c = 1</boolean>
    <boolean name="two">$c = <text>2</text></boolean>
    <boolean name="three">$c = three</boolean>
    <boolean name="four">$c = <text>four</text></boolean>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.get('#\\/one').should('have.text', "false")
    cy.get('#\\/two').should('have.text', "false")
    cy.get('#\\/three').should('have.text', "false")
    cy.get('#\\/four').should('have.text', "false")

    cy.get(`#\\/c_choice1_input`).click();
    cy.get('#\\/one').should('have.text', "true")
    cy.get('#\\/two').should('have.text', "false")
    cy.get('#\\/three').should('have.text', "false")
    cy.get('#\\/four').should('have.text', "false")

    cy.get(`#\\/c_choice2_input`).click();
    cy.get('#\\/one').should('have.text', "false")
    cy.get('#\\/two').should('have.text', "true")
    cy.get('#\\/three').should('have.text', "false")
    cy.get('#\\/four').should('have.text', "false")

    cy.get(`#\\/c_choice3_input`).click();
    cy.get('#\\/one').should('have.text', "false")
    cy.get('#\\/two').should('have.text', "false")
    cy.get('#\\/three').should('have.text', "true")
    cy.get('#\\/four').should('have.text', "false")

    cy.get(`#\\/c_choice4_input`).click();
    cy.get('#\\/one').should('have.text', "false")
    cy.get('#\\/two').should('have.text', "false")
    cy.get('#\\/three').should('have.text', "false")
    cy.get('#\\/four').should('have.text', "true")


  })

})



