import { cesc } from '../../../../src/_utils/url';


describe('Boolean Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })

  it('basic boolean evaluation', () => {
    cy.window().then(async (win) => {
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
    <boolean name="t37">  true    </boolean>

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
    <boolean name="f31">0 = <math>t=4</math></boolean>
    </p>

    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('contain.text', 'a')


    let nTrues = 37, nFalses = 31;
    for (let i = 1; i <= nTrues; i++) {
      cy.get(cesc(`#\\/t${i}`)).should('have.text', "true")
    }

    for (let i = 1; i <= nFalses; i++) {
      cy.get(cesc(`#\\/f${i}`)).should('have.text', "false")
    }

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let i = 1; i <= nTrues; i++) {
        expect(stateVariables[`/t${i}`].stateValues.value).to.be.true
      }
      for (let i = 1; i <= nFalses; i++) {
        expect(stateVariables[`/f${i}`].stateValues.value).to.be.false
      }
    })

  })

  it('boolean based on math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <mathinput prefill="0" />

    <text hide="$_mathinput1">
      Hello there!
    </text>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('contain.text', 'Hello there!')

    cy.get(cesc('#\\/_mathinput1') + ' textarea').type('{end}{backspace}3{enter}', { force: true });
    cy.get(cesc('#\\/_text1')).should('not.exist');

    cy.get(cesc('#\\/_mathinput1') + ' textarea').type('{end}{backspace}2x{enter}', { force: true });
    cy.get(cesc('#\\/_text1')).should('contain.text', 'Hello there!')

    cy.get(cesc('#\\/_mathinput1') + ' textarea').type('{end}-x-x{enter}', { force: true });
    cy.get(cesc('#\\/_text1')).should('contain.text', 'Hello there!')

  })

  it('boolean based on complex numbers', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><number name="a">3+4i</number> <number name="b">3i</number> <number name="c">pi+e i</number></p>

    <p><boolean name="t1">isnumber(re($c))</boolean></p>
    <p><boolean name="t2">isnumber(im($c))</boolean></p>
    <p><boolean name="f1">isnumber($c)</boolean></p>
    <p><boolean name="f2">isinteger(re($c))</boolean></p>
    <p><boolean name="f3">isinteger(im($c))</boolean></p>
    <p><boolean name="f4">isinteger($c)</boolean></p>
    <p><boolean name="t3">isinteger(re($a))</boolean></p>
    <p><boolean name="t4">isinteger(im($a))</boolean></p>
    <p><boolean name="f5">isinteger($a)</boolean></p>
    <p><boolean name="t5">re($a)</boolean></p>
    <p><boolean name="f6">re($b)</boolean></p>
    <p><boolean name="t6">re($c)</boolean></p>
    <p><boolean name="t7">re($a) <= 3</boolean></p>
    <p><boolean name="f7">re($a) < 3</boolean></p>
    <p><boolean name="t8">im($a) <= 4</boolean></p>
    <p><boolean name="f8">im($a) < 4</boolean></p>
    <p><boolean name="t9">abs($a) <= 5</boolean></p>
    <p><boolean name="f9">abs($a) < 5</boolean></p>
        
    `}, "*");
    });


    let nTrues = 9, nFalses = 9;
    for (let i = 1; i <= nTrues; i++) {
      cy.get(cesc(`#\\/t${i}`)).should('have.text', "true")
    }

    for (let i = 1; i <= nFalses; i++) {
      cy.get(cesc(`#\\/f${i}`)).should('have.text', "false")
    }

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let i = 1; i <= nTrues; i++) {
        expect(stateVariables[`/t${i}`].stateValues.value).to.be.true
      }
      for (let i = 1; i <= nFalses; i++) {
        expect(stateVariables[`/f${i}`].stateValues.value).to.be.false
      }
    })
  })

  it('boolean from computation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <mathinput prefill="1" name="i" />

    <boolean>mod($i,2) = 1</boolean>
    <boolean>abs(cos(pi*$i/2)) < 10^(-12)</boolean>
    <boolean>(-1)^$i = 1</boolean>
    <boolean>floor(($i+1)/2) = ceil(($i-1)/2)</boolean>
    
    `}, "*");
    });

    cy.get(cesc('#\\/_boolean1')).should('have.text', "true")
    cy.get(cesc('#\\/_boolean2')).should('have.text', "true")
    cy.get(cesc('#\\/_boolean3')).should('have.text', "false")
    cy.get(cesc('#\\/_boolean4')).should('have.text', "false")

    cy.get(cesc('#\\/i') + ' textarea').type('{end}{backspace}4{enter}', { force: true });
    cy.get(cesc('#\\/_boolean1')).should('have.text', "false")
    cy.get(cesc('#\\/_boolean2')).should('have.text', "false")
    cy.get(cesc('#\\/_boolean3')).should('have.text', "true")
    cy.get(cesc('#\\/_boolean4')).should('have.text', "true")

    cy.get(cesc('#\\/i') + ' textarea').type('{end}{backspace}-7{enter}', { force: true });
    cy.get(cesc('#\\/_boolean1')).should('have.text', "true")
    cy.get(cesc('#\\/_boolean2')).should('have.text', "true")
    cy.get(cesc('#\\/_boolean3')).should('have.text', "false")
    cy.get(cesc('#\\/_boolean4')).should('have.text', "false")

    cy.get(cesc('#\\/i') + ' textarea').type('{end}{backspace}{backspace}0{enter}', { force: true });
    cy.get(cesc('#\\/_boolean1')).should('have.text', "false")
    cy.get(cesc('#\\/_boolean2')).should('have.text', "false")
    cy.get(cesc('#\\/_boolean3')).should('have.text', "true")
    cy.get(cesc('#\\/_boolean4')).should('have.text', "true")


  })

  it('boolean with lists', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <boolean name="t1"><math>1,2</math> = <mathlist>1 2</mathlist></boolean>
    <boolean name="t2"><math>1,2</math> = <mathlist unordered>2 1</mathlist></boolean>
    <boolean name="t3"><math unordered>1,2</math> = <mathlist>2 1</mathlist></boolean>
    <boolean name="t4"><math unordered>1,2</math> = <mathlist unordered>2 1</mathlist></boolean>
    <boolean name="t5"><numberlist>1 2</numberlist> = <mathlist>1 2</mathlist></boolean>
    <boolean name="t6"><mathlist unordered>1 2</mathlist> = <mathlist>2 1</mathlist></boolean>
    <boolean name="t7"><numberlist unordered>1 2</numberlist> = <mathlist>2 1</mathlist></boolean>
    <boolean name="t8"><numberlist unordered>1 2</numberlist> = <numberlist>2 1</numberlist></boolean>
    <boolean name="t9"><textlist unordered>a b</textlist> = <textlist>b a</textlist></boolean>
    <boolean name="t10"><booleanlist unordered>true false</booleanlist> = <booleanlist>false true</booleanlist></boolean>
    <boolean name="t11"><mathlist></mathlist> = <mathlist></mathlist></boolean>
    <boolean name="t12"><mathlist></mathlist> = <numberlist></numberlist></boolean>
    <boolean name="t13"><numberlist></numberlist> = <numberlist></numberlist></boolean>
    <boolean name="t14"><textlist></textlist> = <textlist></textlist></boolean>
    <boolean name="t15"><mathlist>1</mathlist> = <math>1</math></boolean>
    <boolean name="t16"><mathlist>1</mathlist> = <number>1</number></boolean>
    <boolean name="t17"><numberlist>1</numberlist> = <math>1</math></boolean>
    <boolean name="t18"><numberlist>1</numberlist> = <number>1</number></boolean>
    <boolean name="t19"><text>a, b</text> = <textlist>a b</textlist></boolean>
    <boolean name="t20"><text>a, b</text> = <textlist unordered>b a</textlist></boolean>
    <boolean name="t21"><text>a,b</text> = <textlist>a b</textlist></boolean>

    <boolean name="f1"><math>1,2</math> = <mathlist>2 1</mathlist></boolean>
    <boolean name="f2"><mathlist>1 2</mathlist> = <mathlist>2 1</mathlist></boolean>
    <boolean name="f3"><numberlist>1 2</numberlist> = <mathlist>2 1</mathlist></boolean>
    <boolean name="f4"><numberlist>1 2</numberlist> = <numberlist>2 1</numberlist></boolean>
    <boolean name="f5"><textlist>a b</textlist> = <textlist>b a</textlist></boolean>
    <boolean name="f6"><booleanlist>true false</booleanlist> = <booleanlist>false true</booleanlist></boolean>
    <boolean name="f7"><mathlist></mathlist> = <mathlist>1</mathlist></boolean>
    <boolean name="f8"><numberlist></numberlist> = <mathlist>1</mathlist></boolean>
    <boolean name="f9"><numberlist>1</numberlist> = <mathlist>0</mathlist></boolean>
    <boolean name="f10"><numberlist></numberlist> = <numberlist>1</numberlist></boolean>
    <boolean name="f11"><textlist></textlist> = <textlist>a</textlist></boolean>
    <boolean name="f12"><mathlist>1</mathlist> = <math>2</math></boolean>
    <boolean name="f13"><mathlist>1</mathlist> = <number>2</number></boolean>
    <boolean name="f14"><numberlist>1</numberlist> = <math>2</math></boolean>
    <boolean name="f15"><numberlist>1</numberlist> = <number>2</number></boolean>
    <boolean name="f16"><mathlist></mathlist> = <math></math></boolean>
    <boolean name="f17"><numberlist></numberlist> = <number></number></boolean>
    <boolean name="f18"><textlist></textlist> = <text></text></boolean>
    <boolean name="f19"><text>a, b</text> = <textlist>b a</textlist></boolean>

    `}, "*");
    });

    cy.get(cesc('#\\/t1')).should('have.text', "true")
    cy.get(cesc('#\\/t2')).should('have.text', "true")
    cy.get(cesc('#\\/t3')).should('have.text', "true")
    cy.get(cesc('#\\/t4')).should('have.text', "true")
    cy.get(cesc('#\\/t5')).should('have.text', "true")
    cy.get(cesc('#\\/t6')).should('have.text', "true")
    cy.get(cesc('#\\/t7')).should('have.text', "true")
    cy.get(cesc('#\\/t8')).should('have.text', "true")
    cy.get(cesc('#\\/t9')).should('have.text', "true")
    cy.get(cesc('#\\/t10')).should('have.text', "true")
    cy.get(cesc('#\\/t11')).should('have.text', "true")
    cy.get(cesc('#\\/t12')).should('have.text', "true")
    cy.get(cesc('#\\/t13')).should('have.text', "true")
    cy.get(cesc('#\\/t14')).should('have.text', "true")
    cy.get(cesc('#\\/t15')).should('have.text', "true")
    cy.get(cesc('#\\/t16')).should('have.text', "true")
    cy.get(cesc('#\\/t17')).should('have.text', "true")
    cy.get(cesc('#\\/t18')).should('have.text', "true")
    cy.get(cesc('#\\/t19')).should('have.text', "true")
    cy.get(cesc('#\\/t20')).should('have.text', "true")
    cy.get(cesc('#\\/t21')).should('have.text', "true")

    cy.get(cesc('#\\/f1')).should('have.text', "false")
    cy.get(cesc('#\\/f2')).should('have.text', "false")
    cy.get(cesc('#\\/f3')).should('have.text', "false")
    cy.get(cesc('#\\/f4')).should('have.text', "false")
    cy.get(cesc('#\\/f5')).should('have.text', "false")
    cy.get(cesc('#\\/f6')).should('have.text', "false")
    cy.get(cesc('#\\/f7')).should('have.text', "false")
    cy.get(cesc('#\\/f8')).should('have.text', "false")
    cy.get(cesc('#\\/f9')).should('have.text', "false")
    cy.get(cesc('#\\/f10')).should('have.text', "false")
    cy.get(cesc('#\\/f11')).should('have.text', "false")
    cy.get(cesc('#\\/f12')).should('have.text', "false")
    cy.get(cesc('#\\/f13')).should('have.text', "false")
    cy.get(cesc('#\\/f14')).should('have.text', "false")
    cy.get(cesc('#\\/f15')).should('have.text', "false")
    cy.get(cesc('#\\/f16')).should('have.text', "false")
    cy.get(cesc('#\\/f17')).should('have.text', "false")
    cy.get(cesc('#\\/f18')).should('have.text', "false")
    cy.get(cesc('#\\/f19')).should('have.text', "false")

  })

  it('boolean with texts', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <boolean name="t1"><text>hello there</text> = hello there</boolean>
    <boolean name="t2"><text>hello there</text> = <text>hello</text> <text>there</text></boolean>
    <boolean name="t3"><text>hello there</text> = hello  there</boolean>
    <boolean name="t4"><text>hello there</text> = <text>hello</text><text>there</text></boolean>
    <boolean name="t5"><text>hellothere</text> = <text><text>hello</text><text>there</text></text></boolean>
    <boolean name="t6"><textlist>hello</textlist> = hello</boolean>
    <boolean name="t7"><text>hello  there</text> = hello there</boolean>
    <boolean name="t8"><text>hello  there</text> = hello  there</boolean>
    <boolean name="t9"><textlist>hello there</textlist> = <text>hello,there</text></boolean>
    <boolean name="t10"><textlist>hello there</textlist> = <text>hello, there</text></boolean>
    <boolean name="t11"><textlist>hello there</textlist> = <text> hello ,   there   </text></boolean>


    <boolean name="f1"><text>hello there</text> = hellothere</boolean>
    <boolean name="f2"><text>hello there</text> = <text>hellothere</text></boolean>
    <boolean name="f3"><text>hello there</text> = <text><text>hello</text><text>there</text></text></boolean>
    <boolean name="f4"><textlist>hello there</textlist> = hello there</boolean>
    <boolean name="f5"><textlist>hello there</textlist> = hello, there</boolean>


    `}, "*");
    });

    cy.get(cesc('#\\/t1')).should('have.text', "true")
    cy.get(cesc('#\\/t2')).should('have.text', "true")
    cy.get(cesc('#\\/t3')).should('have.text', "true")
    cy.get(cesc('#\\/t4')).should('have.text', "true")
    cy.get(cesc('#\\/t5')).should('have.text', "true")
    cy.get(cesc('#\\/t5')).should('have.text', "true")
    cy.get(cesc('#\\/t6')).should('have.text', "true")
    cy.get(cesc('#\\/t7')).should('have.text', "true")
    cy.get(cesc('#\\/t8')).should('have.text', "true")
    cy.get(cesc('#\\/t9')).should('have.text', "true")
    cy.get(cesc('#\\/t10')).should('have.text', "true")
    cy.get(cesc('#\\/t11')).should('have.text', "true")

    cy.get(cesc('#\\/f1')).should('have.text', "false")
    cy.get(cesc('#\\/f2')).should('have.text', "false")
    cy.get(cesc('#\\/f3')).should('have.text', "false")
    cy.get(cesc('#\\/f4')).should('have.text', "false")
    cy.get(cesc('#\\/f5')).should('have.text', "false")

  })

  it('math errors and invalid targets are not equal', () => {
    cy.window().then(async (win) => {
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

    cy.get(cesc('#\\/_boolean1')).should('have.text', "false")
    cy.get(cesc('#\\/_boolean2')).should('have.text', "true")
    cy.get(cesc('#\\/_boolean3')).should('have.text', "false")
    cy.get(cesc('#\\/_boolean4')).should('have.text', "true")

    cy.get(cesc('#\\/_boolean5')).should('have.text', "false")
    cy.get(cesc('#\\/_boolean6')).should('have.text', "true")
    cy.get(cesc('#\\/_boolean7')).should('have.text', "false")
    cy.get(cesc('#\\/_boolean8')).should('have.text', "true")

  })

  it('boolean with number strings for text', () => {
    cy.window().then(async (win) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a')// to wait for page to load

    cy.get(cesc('#\\/one')).should('have.text', "false")
    cy.get(cesc('#\\/two')).should('have.text', "false")
    cy.get(cesc('#\\/three')).should('have.text', "false")
    cy.get(cesc('#\\/four')).should('have.text', "false")

    cy.get(cesc(`#\\/c_choice1_input`)).click();
    cy.get(cesc('#\\/one')).should('have.text', "true")
    cy.get(cesc('#\\/two')).should('have.text', "false")
    cy.get(cesc('#\\/three')).should('have.text', "false")
    cy.get(cesc('#\\/four')).should('have.text', "false")

    cy.get(cesc(`#\\/c_choice2_input`)).click();
    cy.get(cesc('#\\/one')).should('have.text', "false")
    cy.get(cesc('#\\/two')).should('have.text', "true")
    cy.get(cesc('#\\/three')).should('have.text', "false")
    cy.get(cesc('#\\/four')).should('have.text', "false")

    cy.get(cesc(`#\\/c_choice3_input`)).click();
    cy.get(cesc('#\\/one')).should('have.text', "false")
    cy.get(cesc('#\\/two')).should('have.text', "false")
    cy.get(cesc('#\\/three')).should('have.text', "true")
    cy.get(cesc('#\\/four')).should('have.text', "false")

    cy.get(cesc(`#\\/c_choice4_input`)).click();
    cy.get(cesc('#\\/one')).should('have.text', "false")
    cy.get(cesc('#\\/two')).should('have.text', "false")
    cy.get(cesc('#\\/three')).should('have.text', "false")
    cy.get(cesc('#\\/four')).should('have.text', "true")


  })

  it('boolean adapts to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput name="bi" />
    <p><text name="t">You are hungry. $bi</text></p>
    <p>Are you sure? <textinput bindvalueto="$bi" name="ti" /></p>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a')// to wait for page to load

    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. false")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'false')

    cy.get(cesc('#\\/bi')).click();
    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. true")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'true')

    cy.get(cesc('#\\/ti_input')).clear().type("false{enter}")
    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. false")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'false')

    cy.get(cesc('#\\/ti_input')).clear().type("tRuE{enter}")
    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. true")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'true')

    cy.get(cesc('#\\/ti_input')).clear().type("0{enter}")
    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. true")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'true')

    cy.get(cesc('#\\/ti_input')).clear().type("1=0{enter}")
    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. true")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'true')

    cy.get(cesc('#\\/ti_input')).clear().type("f{enter}")
    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. true")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'true')

    cy.get(cesc('#\\/ti_input')).clear().type("FALSE{enter}")
    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. false")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'false')

    cy.get(cesc('#\\/ti_input')).clear().type("1{enter}")
    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. false")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'false')

    cy.get(cesc('#\\/ti_input')).clear().type("t{enter}")
    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. false")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'false')

    cy.get(cesc('#\\/bi')).click();
    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. true")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'true')

    cy.get(cesc('#\\/bi')).click();
    cy.get(cesc('#\\/t')).should('have.text', "You are hungry. false")
    cy.get(cesc('#\\/ti_input')).should('have.value', 'false')

  })

  it('boolean does not adapt while number adapts', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean name="b1"><number>3</number> != 1 and <boolean>true</boolean></boolean>
    <boolean name="b2"><number>3</number> != 1 and <boolean>true</boolean> and <number>4</number> = <math>4</math></boolean>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a')// to wait for page to load

    cy.get(cesc('#\\/b1')).should('have.text', "true")
    cy.get(cesc('#\\/b2')).should('have.text', "true")

  })

  it('overwrite properties when copying', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean name="b">x+x = 2x</boolean>

    <copy target="b" symbolicEquality name="c1" assignNames="b1" />
    <copy target="b1" symbolicEquality="false" name="c2" assignNames="b2" />
    <copy target="c1" symbolicEquality="false" name="c3" assignNames="b3" />
    
    <copy target="b1" simplifyOnCompare name="c4" assignNames="b4" />
    <copy target="b4" simplifyOnCompare="false" name="c5" assignNames="b5" />
    <copy target="c4" simplifyOnCompare="false" name="c6" assignNames="b6" />
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a')// to wait for page to load

    cy.get(cesc('#\\/b')).should('have.text', "true")
    cy.get(cesc('#\\/b1')).should('have.text', "false")
    cy.get(cesc('#\\/b2')).should('have.text', "true")
    cy.get(cesc('#\\/b3')).should('have.text', "true")
    cy.get(cesc('#\\/b4')).should('have.text', "true")
    cy.get(cesc('#\\/b5')).should('have.text', "false")
    cy.get(cesc('#\\/b6')).should('have.text', "false")

  })

  it('boolean simplifyOnCompare bug', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean simplifyOnCompare symbolicEquality name="b1">
      <math>-5e^(-t)</math> = <math simplify>-5e^(-t)</math>
    </boolean>
    <boolean simplifyOnCompare symbolicEquality name="b2">
      <math name="orig">-5e^(-t)</math> = <copy prop="value" simplify target="orig" />
    </boolean>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a')// to wait for page to load

    cy.get(cesc('#\\/b1')).should('have.text', "true")
    cy.get(cesc('#\\/b2')).should('have.text', "true")

  })

  it('case insensitive match', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean name="b1">a/B = A/b</boolean>
    <boolean name="b2" caseInsensitiveMatch>a/B = A/b</boolean>
    <boolean name="b3"><math>a/B</math> = <math>A/b</math></boolean>
    <boolean name="b4" caseInsensitiveMatch><math>a/B</math> = <math>A/b</math></boolean>
    <boolean name="b5"><text>one Word</text> = <text>One word</text></boolean>
    <boolean name="b6" caseInsensitiveMatch><text>one Word</text> = <text>One word</text></boolean>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a')// to wait for page to load

    cy.get(cesc('#\\/b1')).should('have.text', "false")
    cy.get(cesc('#\\/b2')).should('have.text', "true")
    cy.get(cesc('#\\/b3')).should('have.text', "false")
    cy.get(cesc('#\\/b4')).should('have.text', "true")
    cy.get(cesc('#\\/b5')).should('have.text', "false")
    cy.get(cesc('#\\/b6')).should('have.text', "true")

  })

  it('match blanks', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean name="b1">/a = /a</boolean>
    <boolean name="b2" matchBlanks>/a = /a</boolean>
    <boolean name="b3"><math>/a</math> = <math>/a</math></boolean>
    <boolean name="b4" matchBlanks><math>/a</math> = <math>/a</math></boolean>
    <boolean name="b5"><math>/a</math> = /a</boolean>
    <boolean name="b6" matchBlanks><math>/a</math> = /a</boolean>
    <boolean name="b7"><math>_6^14C</math> = <math>_6^14C</math></boolean>
    <boolean name="b8" matchBlanks><math>_6^14C</math> = <math>_6^14C</math></boolean>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a')// to wait for page to load

    cy.get(cesc('#\\/b1')).should('have.text', "false")
    cy.get(cesc('#\\/b2')).should('have.text', "true")
    cy.get(cesc('#\\/b3')).should('have.text', "false")
    cy.get(cesc('#\\/b4')).should('have.text', "true")
    cy.get(cesc('#\\/b5')).should('have.text', "false")
    cy.get(cesc('#\\/b6')).should('have.text', "true")
    cy.get(cesc('#\\/b7')).should('have.text', "false")
    cy.get(cesc('#\\/b8')).should('have.text', "true")

  })

  it('boolean with symbolic functions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean name="t1">
      <math>(f(a)-g(b))(x)</math> = <math>(g(b)-f(a))(-x)</math>
    </boolean>
    <boolean name="t2">
      <math>(f(a)-g(f))(x)</math> = <math>(g(f)-f(a))(-x)</math>
    </boolean>
    <boolean name="t3">
      <math>(f_3(a)-g_2(b))(x)</math> = <math>(g_2(b)-f_3(a))(-x)</math>
    </boolean>
    <boolean name="t4">
      <math>(f^3(a)-g^2(b))(x)</math> = <math>(g^2(b)-f^3(a))(-x)</math>
    </boolean>
    <boolean name="f1">
      <math>(f(a)-g(b))(x)</math> = <math>(f(b)-g(a))(-x)</math>
    </boolean>
    <boolean name="f2">
      <math>(f(a)-g(f))(x)</math> = <math>(f(g)-g(a))(-x)</math>
    </boolean>
    <boolean name="f3">
      <math>(f_3(a)-g_2(b))(x)</math> = <math>(g_3(b)-f_2(a))(-x)</math>
    </boolean>
    <boolean name="f4">
      <math>(f^3(a)-g^2(b))(x)</math> = <math>(g^3(b)-f^2(a))(-x)</math>
    </boolean>
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a')// to wait for page to load

    cy.get(cesc('#\\/t1')).should('have.text', "true")
    cy.get(cesc('#\\/t2')).should('have.text', "true")
    cy.get(cesc('#\\/t3')).should('have.text', "true")
    cy.get(cesc('#\\/t4')).should('have.text', "true")

    cy.get(cesc('#\\/f1')).should('have.text', "false")
    cy.get(cesc('#\\/f2')).should('have.text', "false")
    cy.get(cesc('#\\/f3')).should('have.text', "false")
    cy.get(cesc('#\\/f4')).should('have.text', "false")

  })

})



