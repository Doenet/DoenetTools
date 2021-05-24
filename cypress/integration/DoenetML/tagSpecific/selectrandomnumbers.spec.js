import me from 'math-expressions';

describe('SelectRandomNumbers Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })


  it('no parameters, select single uniform random number from 0 to 1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers/></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.map(x => x.replacements[0].replacements[0].stateValues.value)

      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(0)
        expect(sample).lte(1)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(0.5, 0.05);
      expect(varX).closeTo(1 / 12, 0.005)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(0.5, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo(1 / 12, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt(1 / 12), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.map(x => x.replacements[0].replacements[0].stateValues.value)
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });


  it('select five uniform random numbers from 0 to 8, only to specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="uniform" numberToSelect="5" to="8" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(0)
        expect(sample).lte(8)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(4, 0.5);
      expect(varX).closeTo(8 ** 2 / 12, 0.5)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(4, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo(8 ** 2 / 12, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt(8 ** 2 / 12), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select five uniform random numbers from -5 to -4, only from specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="uniform" numberToSelect="5" from="-5" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(-5)
        expect(sample).lte(-4)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(-4.5, 0.05);
      expect(varX).closeTo(1 / 12, 0.005)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(-4.5, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo(1 / 12, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt(1 / 12), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select ten uniform random numbers from -4 to -2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers numberToSelect="10" from="-4" to="-2" /></template>
      <sources><sequence length="10" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(-4)
        expect(sample).lte(-2)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(-3, 0.5);
      expect(varX).closeTo(2 ** 2 / 12, 0.5)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(-3, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo(2 ** 2 / 12, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt(2 ** 2 / 12), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select ten uniform random numbers from -2 to -4', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers numberToSelect="10" from="-2" to="-4" /></template>
      <sources><sequence length="10" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(-4)
        expect(sample).lte(-2)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(-3, 0.5);
      expect(varX).closeTo(2 ** 2 / 12, 0.5)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(-3, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo(2 ** 2 / 12, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt(2 ** 2 / 12), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select twenty continuous standard normals, no parameters', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="gaussian" numberToSelect="20" /></template>
      <sources><sequence length="5" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(0, 0.1);
      expect(varX).closeTo(1, 0.1)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(0, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo(1, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt(1), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select five continuous standard normals, unspecified mean 0, standard deviation 10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="gaussian" numberToSelect="5" standardDeviation="10" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(0, 2);
      expect(varX).closeTo(100, 10)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(0, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo(100, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt(100), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select single continuous standard normal, mean -50, unspecified standard deviation 1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="gaussian" mean="-50" /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(-50, 0.1);
      expect(varX).closeTo(1, 0.1)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(-50, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo(1, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt(1), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select twenty continuous standard normals, mean 100, standard deviation 10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="gaussian" numberToSelect="20" mean="100" standardDeviation="10" /></template>
      <sources><sequence length="5" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(100, 2);
      expect(varX).closeTo(100, 10)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(100, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo(100, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt(100), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select twenty continuous standard normals, mean -3, variance 0.01', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="gaussian" numberToSelect="20" mean="-3" variance="0.01" /></template>
      <sources><sequence length="5" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(-3, 0.1);
      expect(varX).closeTo(0.01, 0.001)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(-3, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo(0.01, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt(0.01), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select single discrete uniform, no parameters, integer from 0 to 1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect([0, 1].includes(sample)).eq(true)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(0.5, 0.05);
      expect(varX).closeTo((2 ** 2 - 1) / 12, 0.05)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(0.5, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo((2 ** 2 - 1) / 12, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt((2 ** 2 - 1) / 12), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select single discrete uniform, from 0.5 to 5.5, only to specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" to="5.5" /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect([0.5, 1.5, 2.5, 3.5, 4.5, 5.5].includes(sample)).eq(true)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(3, 0.2);
      expect(varX).closeTo((6 ** 2 - 1) / 12, 0.5)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(3, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo((6 ** 2 - 1) / 12, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt((6 ** 2 - 1) / 12), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select single discrete uniform, from 8.5 to 9.5, only from specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" from="8.5" /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect([8.5, 9.5].includes(sample)).eq(true)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(9, 0.05);
      expect(varX).closeTo((2 ** 2 - 1) / 12, 0.05)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(9, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo((2 ** 2 - 1) / 12, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt((2 ** 2 - 1) / 12), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });


  it('select five integers from -3 to 5', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" from="-3" to="5" numberToSelect="5" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect([-3, -2, -1, 0, 1, 2, 3, 4, 5].includes(sample)).eq(true)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(1, 0.3);
      expect(varX).closeTo((9 ** 2 - 1) / 12, 1)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(1, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo((9 ** 2 - 1) / 12, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt((9 ** 2 - 1) / 12), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('select five integers from 5 to -3 gives nothing', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" from="5" to="-3" numberToSelect="5" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(0);

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });


  it('select 10 odd integers from -3 to 5', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><selectrandomnumbers type="discreteUniform" from="-3" to="5" numberToSelect="10" step="2" /></template>
      <sources><sequence length="10" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy tname="_map1" />
    </aslist></p>

    <copy tname="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let samples = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect([-3, -1, 1, 3, 5].includes(sample)).eq(true)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(1, 0.3);
      expect(varX).closeTo((5 ** 2 - 1) * 2 ** 2 / 12, 1)

      let firstSelect = components["/_map1"].replacements[0].replacements[0]
      expect(firstSelect.stateValues.mean).closeTo(1, 1E-10)
      expect(firstSelect.stateValues.variance).closeTo((5 ** 2 - 1) * 2 ** 2 / 12, 1E-10)
      expect(firstSelect.stateValues.standardDeviation).closeTo(Math.sqrt((5 ** 2 - 1) * 2 ** 2 / 12), 1E-10)

      let copiedSamples = components["/_copy1"].replacements.reduce((a, c) => [...a, ...c.replacements[0].replacements.map(y => y.stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = components["/p"].activeChildren[0].activeChildren.map(x => x.stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it("selected number doesn't change dynamically", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="20" name="numbertoselect"/>
    <mathinput prefill="10" name="maxnum"/>
    <p><aslist>
    <selectRandomNumbers name="sample1" to="$maxnum" numberToSelect="$numbertoselect" />
    </aslist></p>

    <mathinput prefill="10" name="numbertoselect2"/>
    <mathinput prefill="4" name="maxnum2"/>
    <p><aslist>
    <selectRandomNumbers type="discreteUniform" name="sample2" to="$maxnum2" numberToSelect="$numbertoselect2" />
    </aslist></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let sample1numbers, sample2numbers;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let sample1replacements = components['/sample1'].replacements;
      let sample2replacements = components['/sample2'].replacements;
      expect(sample1replacements.length).eq(20);
      expect(sample2replacements.length).eq(10);
      sample1numbers = sample1replacements.map(x => x.stateValues.value);
      sample2numbers = sample2replacements.map(x => x.stateValues.value);

      for (let num of sample1numbers) {
        expect(num).gte(0)
        expect(num).lt(10)
      }
      for (let num of sample2numbers) {
        expect([0, 1, 2, 3, 4].includes(num)).eq(true);
      }

    });

    cy.log("Nothing changes when change mathinputs");
    cy.get('#\\/numbertoselect textarea').type(`{end}{backspace}{backspace}7{enter}`, { force: true });
    cy.get('#\\/maxnum textarea').type(`{end}{backspace}{backspace}11{enter}`, { force: true });
    cy.get('#\\/numbertoselect2 textarea').type(`{end}{backspace}{backspace}15{enter}`, { force: true });
    cy.get('#\\/maxnum2 textarea').type(`{end}{backspace}{backspace}18{enter}`, { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let sample1replacements = components['/sample1'].replacements;
      let sample2replacements = components['/sample2'].replacements;

      expect(sample1replacements.map(x => x.stateValues.value)).eqls(sample1numbers)
      expect(sample2replacements.map(x => x.stateValues.value)).eqls(sample2numbers)


    })

  });

  it("random number doesn't resample in dynamic map", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    How many numbers do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnames="a b c d e f">
      <template newNamespace>
        <selectRandomNumbers assignnames="n" />
      </template>
      <sources>
      <sequence length="$_mathinput1" />
      </sources>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist><copy tname="_map1" /></aslist></p>
    <p name="p3"><copy tname="_aslist1" /></p>

    <copy name="p4" tname="p1" />
    <copy name="p5" tname="p2" />
    <copy name="p6" tname="p3" />

    <copy name="p7" tname="p4" />
    <copy name="p8" tname="p5" />
    <copy name="p9" tname="p6" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let samplednumbers = [];

    cy.log("initially nothing")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("sample one number");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}1{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      samplednumbers.push(n1);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      for (let ind = 0; ind < 1; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
      }
    })


    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("get same number back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}1{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(1);

      for (let ind = 0; ind < 1; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
      }
    })


    cy.log("get two more samples");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}3{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      let n2 = components['/b/n'].stateValues.value;
      let n3 = components['/c/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      samplednumbers.push(n2);
      samplednumbers.push(n3);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      for (let ind = 0; ind < 3; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });


    cy.log("get first two numbers back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}2{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      let n2 = components['/b/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(2);

      for (let ind = 0; ind < 2; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("get six total samples");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}6{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      let n2 = components['/b/n'].stateValues.value;
      let n3 = components['/c/n'].stateValues.value;
      let n4 = components['/d/n'].stateValues.value;
      let n5 = components['/e/n'].stateValues.value;
      let n6 = components['/f/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      samplednumbers.push(n4);
      samplednumbers.push(n5);
      samplednumbers.push(n6);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("get all six back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}6{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      let n2 = components['/b/n'].stateValues.value;
      let n3 = components['/c/n'].stateValues.value;
      let n4 = components['/d/n'].stateValues.value;
      let n5 = components['/e/n'].stateValues.value;
      let n6 = components['/f/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      expect(n4).eq(samplednumbers[3]);
      expect(n5).eq(samplednumbers[4]);
      expect(n6).eq(samplednumbers[5]);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
      }
    })


  });

  it('select single discrete uniform number, assign name', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="u"/></p>
    <p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="v"/></p>
    <p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="w"/></p>
    <p><copy assignNames="u2" tname="u" /></p>
    <p><copy assignNames="v2" tname="v" /></p>
    <p><copy assignNames="w2" tname="w" /></p>
    `}, "*");
    });

    let options = [3, 10];

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/u'];
      let u2 = components['/u2'];

      expect(options.includes(u.stateValues.value)).eq(true);
      expect(u.stateValues.value).eq(u2.stateValues.value);

      let v = components['/v'];
      let v2 = components['/v2'];
      expect(options.includes(v.stateValues.value)).eq(true);
      expect(v.stateValues.value).eq(v2.stateValues.value);

      let w = components['/w'];
      let w2 = components['/w2'];
      expect(options.includes(w.stateValues.value)).eq(true);
      expect(w.stateValues.value).eq(w2.stateValues.value);

    })

  });

  it('select multiple uniform random numbers, assign names', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
      <selectRandomNumbers name="s" from="3" to="13" assignnames="u v w" numberToSelect="6" />
    </aslist></p>
    <p><copy assignNames="u2" tname="u" /></p>
    <p><copy assignNames="v2" tname="v" /></p>
    <p><copy assignNames="w2" tname="w" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let results = [];

    for (let ind = 0; ind < 6; ind++) {
      cy.get("#\\/_p1 > :nth-child(" + (2 * ind + 4) + ")").invoke("text").then(text => {
        let num = Number(text)
        results[ind] = num;
        expect(num).gte(3);
        expect(num).lt(13);
      })
    }

    cy.log('check by name').then(() => {
      cy.get("#\\/u").should('have.text', results[0]);
      cy.get("#\\/u2").should('have.text', results[0]);
      cy.get("#\\/v").should('have.text', results[1]);
      cy.get("#\\/v2").should('have.text', results[1]);
      cy.get("#\\/w").should('have.text', results[2]);
      cy.get("#\\/w2").should('have.text', results[2]);

    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/u'];
      let u2 = components['/u2'];
      expect(u.stateValues.value).closeTo(results[0], 1E-8)
      expect(u2.stateValues.value).closeTo(results[0], 1E-8);

      let v = components['/v'];
      let v2 = components['/v2'];
      expect(v.stateValues.value).closeTo(results[1], 1E-8);
      expect(v2.stateValues.value).closeTo(results[1], 1E-8);

      let w = components['/w'];
      let w2 = components['/w2'];
      expect(w.stateValues.value).closeTo(results[2], 1E-8);
      expect(w2.stateValues.value).closeTo(results[2], 1E-8);

      let s = components['/s'];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = s.replacements[ind];
        expect(r.stateValues.value).closeTo(results[ind], 1E-8);
      }
    })


  });

  it('select multiple uniform random numbers, assign names, newNamespace', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
      <selectRandomNumbers name="s" newnamespace from="3" to="13" assignnames="u v w" numberToSelect="6" />
    </aslist></p>
    <p><copy assignNames="u2" tname="s/u" /></p>
    <p><copy assignNames="v2" tname="s/v" /></p>
    <p><copy assignNames="w2" tname="s/w" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let results = [];

    for (let ind = 0; ind < 6; ind++) {
      cy.get("#\\/_p1 > :nth-child(" + (2 * ind + 4) + ")").invoke("text").then(text => {
        let num = Number(text)
        results[ind] = num;
        expect(num).gte(3);
        expect(num).lt(13);
      })
    }

    cy.log('check by name').then(() => {
      cy.get("#\\/s\\/u").should('have.text', results[0]);
      cy.get("#\\/u2").should('have.text', results[0]);
      cy.get("#\\/s\\/v").should('have.text', results[1]);
      cy.get("#\\/v2").should('have.text', results[1]);
      cy.get("#\\/s\\/w").should('have.text', results[2]);
      cy.get("#\\/w2").should('have.text', results[2]);

    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/s/u'];
      let u2 = components['/u2'];
      expect(u.stateValues.value).closeTo(results[0], 1E-8)
      expect(u2.stateValues.value).closeTo(results[0], 1E-8);

      let v = components['/s/v'];
      let v2 = components['/v2'];
      expect(v.stateValues.value).closeTo(results[1], 1E-8);
      expect(v2.stateValues.value).closeTo(results[1], 1E-8);

      let w = components['/s/w'];
      let w2 = components['/w2'];
      expect(w.stateValues.value).closeTo(results[2], 1E-8);
      expect(w2.stateValues.value).closeTo(results[2], 1E-8);

      let s = components['/s'];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = s.replacements[ind];
        expect(r.stateValues.value).closeTo(results[ind], 1E-8);
      }
    })


  });

})