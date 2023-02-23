import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Math expressions equality tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('inverse trig', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>
    <boolean name="t1">sin^(-1)(x) = arcsin(x)</boolean>
    <boolean name="t2">sin^(-1)(x) = asin(x)</boolean>  
    <boolean name="t3">sin^(-1)(1) = pi/2</boolean>
    <boolean name="t4">cos^(-1)(x) = arccos(x)</boolean>
    <boolean name="t5">cos^(-1)(x) = acos(x)</boolean>
    <boolean name="t6">cos^(-1)(1) = 0</boolean>
    <boolean name="t7">tan^(-1)(x) = arctan(x)</boolean>
    <boolean name="t8">tan^(-1)(x) = atan(x)</boolean>
    <boolean name="t9">tan^(-1)(1) = pi/4</boolean>
    </p>

    <p>
    <boolean name="f1">sin^(-1)(x) = sin(x)^(-1)</boolean>
    <boolean name="f2">cos^(-1)(x) = cos(x)^(-1)</boolean>
    <boolean name="f3">tan^(-1)(x) = tan(x)^(-1)</boolean>
    </p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('contain.text', 'a')


    let nTrues = 6, nFalses = 2;
    for (let i = 1; i <= nTrues; i++) {
      cy.get(`#\\/t${i}`).should('have.text', "true")
    }

    for (let i = 1; i <= nFalses; i++) {
      cy.get(`#\\/f${i}`).should('have.text', "false")
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


  it('trig shortcut powers, not other functions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>
    <boolean name="t1">sin^2(x) = sin(x)^2</boolean>
    <boolean name="t2">sin^n(x) = sin(x)^n</boolean>
    <boolean name="t3">cos^2(x) = cos(x)^2</boolean>
    <boolean name="t4">cos^n(x) = cos(x)^n</boolean>
    <boolean name="t5">tan^2(x) = tan(x)^2</boolean>
    <boolean name="t6">tan^n(x) = tan(x)^n</boolean>
    <boolean name="t7">cos^2(x) = cos(x)^2</boolean>
    <boolean name="t8">cos^n(x) = cos(x)^n</boolean>
    <boolean name="t9">sec^2(x) = sec(x)^2</boolean>
    <boolean name="t10">sec^n(x) = sec(x)^n</boolean>
    <boolean name="t11">cot^2(x) = cot(x)^2</boolean>
    <boolean name="t12">cot^n(x) = cot(x)^n</boolean>
    </p>

    <p>
    <boolean name="f1">log^2(x) = log(x)^2</boolean>
    <boolean name="f2">log^n(x) = log(x)^n</boolean>
    <boolean name="f3">ln^2(x) = ln(x)^2</boolean>
    <boolean name="f4">ln^n(x) = ln(x)^n</boolean>
    <boolean name="f5">f^2(x) = f(x)^2</boolean>
    <boolean name="f6">f^n(x) = f(x)^n</boolean>
    </p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('contain.text', 'a')


    let nTrues = 12, nFalses = 6;
    for (let i = 1; i <= nTrues; i++) {
      cy.get(`#\\/t${i}`).should('have.text', "true")
    }

    for (let i = 1; i <= nFalses; i++) {
      cy.get(`#\\/f${i}`).should('have.text', "false")
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

  it('logarithms of different bases', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>
    <boolean name="t1">log(e^3) = 3</boolean>
    <boolean name="t2">ln(e^3) = 3</boolean>
    <boolean name="t3">log10(10^3) = 3</boolean>
    <boolean name="t4">log_10(10^3) = 3</boolean>
    <boolean name="t5">log_2(2^3) = 3</boolean>
    <boolean name="t6">log_7(7^3) = 3</boolean>
    <boolean name="t7">log_b(a) = log(a)/log(b)</boolean>
    </p>


    `}, "*");
    });

    cy.get('#\\/_text1').should('contain.text', 'a')


    let nTrues = 7, nFalses = 0;
    for (let i = 1; i <= nTrues; i++) {
      cy.get(`#\\/t${i}`).should('have.text', "true")
    }

    for (let i = 1; i <= nFalses; i++) {
      cy.get(`#\\/f${i}`).should('have.text', "false")
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

  it('permutations and combinations', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>
    <boolean name="t1">nCr(5,3) = 10</boolean>
    <boolean name="t2">nPr(5,3) = 60</boolean>
    <boolean name="t3">binom(5,3) = 10</boolean>
    </p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('contain.text', 'a')


    let nTrues = 3, nFalses = 0;
    for (let i = 1; i <= nTrues; i++) {
      cy.get(`#\\/t${i}`).should('have.text', "true")
    }

    for (let i = 1; i <= nFalses; i++) {
      cy.get(`#\\/f${i}`).should('have.text', "false")
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

  it('alternative vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <math>⟨a,b⟩</math>
    <p>
    <boolean name="t1">⟨a,b⟩ = (a,b)</boolean>
    <boolean name="t2">⟨a,b⟩ = <math createVectors>(a,b)</math></boolean>
    <boolean name="t3">(a,b) = <math createVectors>(a,b)</math></boolean>
    </p>

    <p>
    <boolean name="f1">⟨a,b⟩ = <math createIntervals>(a,b)</math></boolean>
    <boolean name="f2"><math createVectors>(a,b)</math> = <math createIntervals>(a,b)</math></boolean>
    </p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('contain.text', 'a')


    let nTrues = 3, nFalses = 2;
    for (let i = 1; i <= nTrues; i++) {
      cy.get(`#\\/t${i}`).should('have.text', "true")
    }

    for (let i = 1; i <= nFalses; i++) {
      cy.get(`#\\/f${i}`).should('have.text', "false")
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


})