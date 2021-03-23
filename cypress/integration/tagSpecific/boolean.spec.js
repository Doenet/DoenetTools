
describe('Boolean Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })


  it.only('basic boolean evaluation', () => {
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
    </p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('contain.text', 'a')

    
    let nTrues = 27, nFalses = 27;
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

})



