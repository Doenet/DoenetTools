import me from 'math-expressions';

describe('SampleRandomNumbers Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('no parameters, sample single uniform random number from 0 to 1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers/></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[stateVariables[x.componentName].replacements[0].componentName].replacements[0].componentName].stateValues.value)

      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect(sample).gt(0)
        expect(sample).lte(1)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(0.5, 0.05);
      expect(varX).closeTo(1 / 12, 0.01)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(0.5, 1E-10)
      expect(firstSample.stateValues.variance).closeTo(1 / 12, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt(1 / 12), 1E-10)

      let copiedSamples = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[stateVariables[x.componentName].replacements[0].componentName].replacements[0].componentName].stateValues.value)
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });


  it('sample five uniform random numbers from 0 to 8, only to specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="uniform" numberOfSamples="5" to="8" /></template>
      <sources><sequence length="80" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect(sample).gt(0)
        expect(sample).lte(8)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(4, 0.5);
      expect(varX).closeTo(8 ** 2 / 12, 0.5)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(4, 1E-10)
      expect(firstSample.stateValues.variance).closeTo(8 ** 2 / 12, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt(8 ** 2 / 12), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample five uniform random numbers from -5 to -4, only from specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="uniform" numberOfSamples="5" from="-5" /></template>
      <sources><sequence length="80" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect(sample).gt(-5)
        expect(sample).lte(-4)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(-4.5, 0.05);
      expect(varX).closeTo(1 / 12, 0.01)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(-4.5, 1E-10)
      expect(firstSample.stateValues.variance).closeTo(1 / 12, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt(1 / 12), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample ten uniform random numbers from -4 to -2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers numberOfSamples="10" from="-4" to="-2" /></template>
      <sources><sequence length="40" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect(sample).gt(-4)
        expect(sample).lte(-2)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(-3, 0.5);
      expect(varX).closeTo(2 ** 2 / 12, 0.5)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(-3, 1E-10)
      expect(firstSample.stateValues.variance).closeTo(2 ** 2 / 12, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt(2 ** 2 / 12), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample ten uniform random numbers from -2 to -4', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers numberOfSamples="10" from="-2" to="-4" /></template>
      <sources><sequence length="40" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect(sample).gt(-4)
        expect(sample).lte(-2)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(-3, 0.5);
      expect(varX).closeTo(2 ** 2 / 12, 0.5)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(-3, 1E-10)
      expect(firstSample.stateValues.variance).closeTo(2 ** 2 / 12, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt(2 ** 2 / 12), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample twenty continuous standard normals, no parameters', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="gaussian" numberOfSamples="20" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(0, 0.1);
      expect(varX).closeTo(1, 0.2)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(0, 1E-10)
      expect(firstSample.stateValues.variance).closeTo(1, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt(1), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample five continuous standard normals, unspecified mean 0, standard deviation 10', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="gaussian" numberOfSamples="5" standardDeviation="10" /></template>
      <sources><sequence length="80" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(0, 2);
      expect(varX).closeTo(100, 20)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(0, 1E-10)
      expect(firstSample.stateValues.variance).closeTo(100, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt(100), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample single continuous standard normal, mean -50, unspecified standard deviation 1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="gaussian" mean="-50" /></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(-50, 0.2);
      expect(varX).closeTo(1, 0.3)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(-50, 1E-10)
      expect(firstSample.stateValues.variance).closeTo(1, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt(1), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample twenty continuous standard normals, mean 100, standard deviation 10', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="gaussian" numberOfSamples="20" mean="100" standardDeviation="10" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(100, 2);
      expect(varX).closeTo(100, 30)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(100, 1E-10)
      expect(firstSample.stateValues.variance).closeTo(100, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt(100), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample twenty continuous standard normals, mean -3, variance 0.01', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="gaussian" numberOfSamples="20" mean="-3" variance="0.01" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(-3, 0.1);
      expect(varX).closeTo(0.01, 0.002)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(-3, 1E-10)
      expect(firstSample.stateValues.variance).closeTo(0.01, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt(0.01), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample single discrete uniform, no parameters, integer from 0 to 1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" /></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([0, 1].includes(sample)).eq(true)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(0.5, 0.1);
      expect(varX).closeTo((2 ** 2 - 1) / 12, 0.1)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(0.5, 1E-10)
      expect(firstSample.stateValues.variance).closeTo((2 ** 2 - 1) / 12, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt((2 ** 2 - 1) / 12), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample single discrete uniform, from 0.5 to 5.5, only to specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" to="5.5" /></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([0.5, 1.5, 2.5, 3.5, 4.5, 5.5].includes(sample)).eq(true)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(3, 0.2);
      expect(varX).closeTo((6 ** 2 - 1) / 12, 0.5)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(3, 1E-10)
      expect(firstSample.stateValues.variance).closeTo((6 ** 2 - 1) / 12, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt((6 ** 2 - 1) / 12), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample single discrete uniform, from 8.5 to 9.5, only from specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" from="8.5" /></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([8.5, 9.5].includes(sample)).eq(true)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(9, 0.05);
      expect(varX).closeTo((2 ** 2 - 1) / 12, 0.05)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(9, 1E-10)
      expect(firstSample.stateValues.variance).closeTo((2 ** 2 - 1) / 12, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt((2 ** 2 - 1) / 12), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });


  it('sample five integers from -3 to 5', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" from="-3" to="5" numberOfSamples="5" /></template>
      <sources><sequence length="80" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([-3, -2, -1, 0, 1, 2, 3, 4, 5].includes(sample)).eq(true)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(1, 0.5);
      expect(varX).closeTo((9 ** 2 - 1) / 12, 1)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(1, 1E-10)
      expect(firstSample.stateValues.variance).closeTo((9 ** 2 - 1) / 12, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt((9 ** 2 - 1) / 12), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it('sample five integers from 5 to -3 gives nothing', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" from="5" to="-3" numberOfSamples="5" /></template>
      <sources><sequence length="80" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(0);

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });


  it('sample 10 odd integers from -3 to 5', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" from="-3" to="5" numberOfSamples="10" step="2" /></template>
      <sources><sequence length="40" /></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <copy target="_map1" />
    </aslist></p>

    <copy target="_p1" assignNames = "p" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([-3, -1, 1, 3, 5].includes(sample)).eq(true)
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.var(samples, 'uncorrected');

      expect(meanX).closeTo(1, 0.5);
      expect(varX).closeTo((5 ** 2 - 1) * 2 ** 2 / 12, 1)

      let firstSample = stateVariables[stateVariables[stateVariables["/_map1"].replacements[0].componentName].replacements[0].componentName]
      expect(firstSample.stateValues.mean).closeTo(1, 1E-10)
      expect(firstSample.stateValues.variance).closeTo((5 ** 2 - 1) * 2 ** 2 / 12, 1E-10)
      expect(firstSample.stateValues.standardDeviation).closeTo(Math.sqrt((5 ** 2 - 1) * 2 ** 2 / 12), 1E-10)

      let copiedSamples = stateVariables["/_copy1"].replacements.reduce((a, c) => [...a, ...stateVariables[stateVariables[c.componentName].replacements[0].componentName].replacements.map(y => stateVariables[y.componentName].stateValues.value)], [])
      expect(copiedSamples).eqls(samples)

      let copiedCopiedSamples = stateVariables[stateVariables["/p"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)
      expect(copiedCopiedSamples).eqls(samples)


    })
  });

  it("sampled number does change dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="50" name="numberOfSamples"/>
    <mathinput prefill="10" name="maxnum"/>
    <p><aslist>
    <sampleRandomNumbers name="sample1" to="$maxnum" numberOfSamples="$numberOfSamples" />
    </aslist></p>

    <mathinput prefill="180" name="numberOfSamples2"/>
    <mathinput prefill="4" name="standardDeviation"/>
    <p><aslist>
    <sampleRandomNumbers type="gaussian" name="sample2" standardDeviation="$standardDeviation" numberOfSamples="$numberOfSamples2" />
    </aslist></p>
    <p>
      <copy prop="value" target="numberOfSamples2" assignNames="numberOfSamples2a" />
      <copy prop="value" target="standardDeviation" assignNames="standardDeviationa" />
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let sample1numbers, sample2numbers;
    let sample1numbersb, sample2numbersb;
    let sample1numbersc, sample2numbersc;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      sample1numbers = stateVariables['/sample1'].replacements.map(x => stateVariables[x.componentName].stateValues.value);
      sample2numbers = stateVariables['/sample2'].replacements.map(x => stateVariables[x.componentName].stateValues.value);
      expect(sample1numbers.length).eq(50);
      expect(sample2numbers.length).eq(180);

      for (let num of sample1numbers) {
        expect(num).gte(0)
        expect(num).lt(10)
      }

      expect(me.math.mean(sample1numbers)).closeTo(5, 2)
      expect(me.math.var(sample1numbers, 'uncorrected')).closeTo(10 ** 2 / 12, 2)

      expect(me.math.mean(sample2numbers)).closeTo(0, 1)
      expect(me.math.var(sample2numbers, 'uncorrected')).closeTo(16, 4)

    });

    cy.log("Get new samples when change number of samples");
    cy.get('#\\/numberOfSamples textarea').type(`{end}{backspace}{backspace}70{enter}`, { force: true });
    cy.get('#\\/numberOfSamples2 textarea').type(`{end}{backspace}{backspace}{backspace}160{enter}`, { force: true });
    cy.get('#\\/numberOfSamples2a').should('contain.text', '160');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      sample1numbersb = stateVariables['/sample1'].replacements.map(x => stateVariables[x.componentName].stateValues.value);
      sample2numbersb = stateVariables['/sample2'].replacements.slice(0, stateVariables['/sample2'].replacements.length - stateVariables["/sample2"].replacementsToWithhold).map(x => stateVariables[x.componentName].stateValues.value);
      expect(sample1numbersb.length).eq(70);
      expect(sample2numbersb.length).eq(160);

      for (let num of sample1numbersb) {
        expect(num).gte(0)
        expect(num).lt(10)
      }

      expect(me.math.mean(sample1numbersb)).closeTo(5, 2)
      expect(me.math.var(sample1numbersb, 'uncorrected')).closeTo(10 ** 2 / 12, 4)

      expect(me.math.mean(sample2numbersb)).closeTo(0, 1)
      expect(me.math.var(sample2numbersb, 'uncorrected')).closeTo(16, 6)

      for (let ind = 0; ind < 10; ind++) {
        expect(sample1numbersb[ind]).not.eq(sample1numbers[ind])
      }
      for (let ind = 0; ind < 10; ind++) {
        expect(sample2numbersb[ind]).not.eq(sample2numbers[ind])
      }

    })

    cy.log("Get new samples when sample parameters");
    cy.get('#\\/maxnum textarea').type(`{end}{backspace}{backspace}4{enter}`, { force: true });
    cy.get('#\\/standardDeviation textarea').type(`{end}{backspace}{backspace}18{enter}`, { force: true });
    cy.get('#\\/standardDeviationa').should('contain.text', '18');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      sample1numbersc = stateVariables['/sample1'].replacements.map(x => stateVariables[x.componentName].stateValues.value);
      sample2numbersc = stateVariables['/sample2'].replacements.slice(0, stateVariables['/sample2'].replacements.length - stateVariables["/sample2"].replacementsToWithhold).map(x => stateVariables[x.componentName].stateValues.value);
      expect(sample1numbersc.length).eq(70);
      expect(sample2numbersc.length).eq(160);

      for (let num of sample1numbersc) {
        expect(num).gte(0)
        expect(num).lt(4)
      }
      expect(me.math.mean(sample1numbersc)).closeTo(2, 1)
      expect(me.math.var(sample1numbersc, 'uncorrected')).closeTo(4 ** 2 / 12, 1)

      expect(me.math.mean(sample2numbersc)).closeTo(0, 4)
      expect(me.math.var(sample2numbersc, 'uncorrected')).closeTo(18 ** 2, 100)

      for (let ind = 0; ind < 10; ind++) {
        expect(sample1numbersc[ind]).not.eq(sample1numbersb[ind])
      }
      for (let ind = 0; ind < 10; ind++) {
        expect(sample2numbersc[ind]).not.eq(sample2numbersb[ind])
      }

    })

  });

  it("random number doesn't resample in dynamic map", () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    How many numbers do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnames="a b c d e f">
      <template newNamespace>
        <sampleRandomNumbers assignnames="n" />
      </template>
      <sources>
      <sequence length="$_mathinput1" />
      </sources>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist><copy target="_map1" /></aslist></p>
    <p name="p3"><copy target="_aslist1" /></p>

    <copy name="p4" target="p1" />
    <copy name="p5" target="p2" />
    <copy name="p6" target="p3" />

    <copy name="p7" target="p4" />
    <copy name="p8" target="p5" />
    <copy name="p9" target="p6" />
    <p><copy prop="value" target="_mathinput1" assignNames="m1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let samplednumbers = [];

    cy.log("initially nothing")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
    });

    cy.log("sample one number");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}1{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '1')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      samplednumbers.push(n1);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      for (let ind = 0; ind < 1; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })


    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '0')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
    });

    cy.log("get same number back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}1{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '1')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);

      for (let ind = 0; ind < 1; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })


    cy.log("get two more samples");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}3{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '3')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      let n2 = stateVariables['/b/n'].stateValues.value;
      let n3 = stateVariables['/c/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      samplednumbers.push(n2);
      samplednumbers.push(n3);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      for (let ind = 0; ind < 3; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '0')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
    });


    cy.log("get first two numbers back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}2{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '2')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      let n2 = stateVariables['/b/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);

      for (let ind = 0; ind < 2; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("get six total samples");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}6{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '6')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      let n2 = stateVariables['/b/n'].stateValues.value;
      let n3 = stateVariables['/c/n'].stateValues.value;
      let n4 = stateVariables['/d/n'].stateValues.value;
      let n5 = stateVariables['/e/n'].stateValues.value;
      let n6 = stateVariables['/f/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      samplednumbers.push(n4);
      samplednumbers.push(n5);
      samplednumbers.push(n6);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '0')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
    });

    cy.log("get all six back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}6{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '6')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      let n2 = stateVariables['/b/n'].stateValues.value;
      let n3 = stateVariables['/c/n'].stateValues.value;
      let n4 = stateVariables['/d/n'].stateValues.value;
      let n5 = stateVariables['/e/n'].stateValues.value;
      let n6 = stateVariables['/f/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      expect(n4).eq(samplednumbers[3]);
      expect(n5).eq(samplednumbers[4]);
      expect(n6).eq(samplednumbers[5]);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })


  });

  it('sample single discrete uniform number, assign name', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><sampleRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="u"/></p>
    <p><sampleRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="v"/></p>
    <p><sampleRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="w"/></p>
    <p><copy assignNames="u2" target="u" /></p>
    <p><copy assignNames="v2" target="v" /></p>
    <p><copy assignNames="w2" target="w" /></p>
    `}, "*");
    });

    let options = [3, 10];

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables['/u'];
      let u2 = stateVariables['/u2'];

      expect(options.includes(u.stateValues.value)).eq(true);
      expect(u.stateValues.value).eq(u2.stateValues.value);

      let v = stateVariables['/v'];
      let v2 = stateVariables['/v2'];
      expect(options.includes(v.stateValues.value)).eq(true);
      expect(v.stateValues.value).eq(v2.stateValues.value);

      let w = stateVariables['/w'];
      let w2 = stateVariables['/w2'];
      expect(options.includes(w.stateValues.value)).eq(true);
      expect(w.stateValues.value).eq(w2.stateValues.value);

    })

  });

  it('sample multiple uniform random numbers, assign names', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
      <sampleRandomNumbers name="s" from="3" to="13" assignnames="u v w" numberOfSamples="6" />
    </aslist></p>
    <p><copy assignNames="u2" target="u" /></p>
    <p><copy assignNames="v2" target="v" /></p>
    <p><copy assignNames="w2" target="w" /></p>
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables['/u'];
      let u2 = stateVariables['/u2'];
      expect(u.stateValues.value).closeTo(results[0], 1E-8)
      expect(u2.stateValues.value).closeTo(results[0], 1E-8);

      let v = stateVariables['/v'];
      let v2 = stateVariables['/v2'];
      expect(v.stateValues.value).closeTo(results[1], 1E-8);
      expect(v2.stateValues.value).closeTo(results[1], 1E-8);

      let w = stateVariables['/w'];
      let w2 = stateVariables['/w2'];
      expect(w.stateValues.value).closeTo(results[2], 1E-8);
      expect(w2.stateValues.value).closeTo(results[2], 1E-8);

      let s = stateVariables['/s'];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = stateVariables[s.replacements[ind].componentName];
        expect(r.stateValues.value).closeTo(results[ind], 1E-8);
      }
    })


  });

  it('sample multiple uniform random numbers, assign names, newNamespace', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
      <sampleRandomNumbers name="s" newnamespace from="3" to="13" assignnames="u v w" numberOfSamples="6" />
    </aslist></p>
    <p><copy assignNames="u2" target="s/u" /></p>
    <p><copy assignNames="v2" target="s/v" /></p>
    <p><copy assignNames="w2" target="s/w" /></p>
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables['/s/u'];
      let u2 = stateVariables['/u2'];
      expect(u.stateValues.value).closeTo(results[0], 1E-8)
      expect(u2.stateValues.value).closeTo(results[0], 1E-8);

      let v = stateVariables['/s/v'];
      let v2 = stateVariables['/v2'];
      expect(v.stateValues.value).closeTo(results[1], 1E-8);
      expect(v2.stateValues.value).closeTo(results[1], 1E-8);

      let w = stateVariables['/s/w'];
      let w2 = stateVariables['/w2'];
      expect(w.stateValues.value).closeTo(results[2], 1E-8);
      expect(w2.stateValues.value).closeTo(results[2], 1E-8);

      let s = stateVariables['/s'];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = stateVariables[s.replacements[ind].componentName];
        expect(r.stateValues.value).closeTo(results[ind], 1E-8);
      }
    })


  });


  it("copying parameters", () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of samples <mathinput name="nSamples" prefill="10" /></p>
    <p>Specified type of random number <textinput name="type" /></p>
    <p>Specified mean <mathinput name="specifiedMean" prefill="0" /></p>
    <p>Specified variance <mathinput name="specifiedVariance" prefill="1" /></p>
    <p>Specified from <mathinput name="specifiedFrom" prefill="0" /></p>
    <p>Specified to <mathinput name="specifiedTo" prefill="1" /></p>
    <p>Specified step <mathinput name="specifiedStep" prefill="1" /></p>
    <p>Actual type: <copy prop="type" target="samples" obtainPropFromComposite assignNames="actualType" /></p>
    <p>Actual from: <copy prop="from" target="samples" obtainPropFromComposite assignNames="actualFrom" /></p>
    <p>Actual to: <copy prop="to" target="samples" obtainPropFromComposite assignNames="actualTo" /></p>
    <p>Actual step: <copy prop="step" target="samples" obtainPropFromComposite assignNames="actualStep" /></p>
    <p>Expected mean: <copy prop="mean" target="samples" obtainPropFromComposite assignNames="expectedMean" /></p>
    <p>Expected variance: <copy prop="variance" target="samples" obtainPropFromComposite assignNames="expectedVariance" /></p>
    <p>Expected standard deviation: <copy prop="standardDeviation" target="samples" obtainPropFromComposite assignNames="expectedStandardDeviation" /></p>
    <p>Resulting mean: <mean name="resultingMean">$samples</mean></p>
    <p>Resulting variance: <variance name="resultingVariance">$samples</variance></p>
    <p>Resulting standard deviation: <standardDeviation name="resultingStandardDeviation">$samples</standardDeviation></p>
    <p name="p1"><aslist>
      <sampleRandomNumbers name="samples" numberOfSamples="$nSamples" type="$type" mean="$specifiedMean" variance="$specifiedVariance" from="$specifiedFrom" to="$specifiedTo" step="$specifiedStep" />
    </aslist></p>
    <p name="p2"><aslist><copy target="samples" /></aslist></p>
    <p name="p3"><copy target="_aslist1" /></p>

    <copy name="p4c" target="p1" assignNames="p4" />
    <copy name="p5c" target="p2" assignNames="p5" />
    <copy name="p6c" target="p3" assignNames="p6" />

    <copy name="p7c" target="p4c" assignNames="p7" />
    <copy name="p8c" target="p5" assignNames="p8" />
    <copy name="p9c" target="p6c" assignNames="p9" />

    <p>
      <copy prop="value" target="nSamples" assignNames="nSamplesa" />
      <copy prop="value" target="specifiedTo" assignNames="specifiedToa" />
      <copy prop="value" target="type" assignNames="typea" />
      <copy prop="value" target="specifiedVariance" assignNames="specifiedVariancea" />
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load



    let checkSamples = function ({ numberOfSamples, specifiedType,
      specifiedMean, specifiedVariance,
      specifiedFrom, specifiedTo, specifiedStep,
      sampleComponent,
      allowedErrorInMean, allowedErrorInVariance,
      checkAllSamples = true,
      stateVariables
    }) {


      let nReplacements = sampleComponent.replacements.length;
      if (sampleComponent.replacementsToWithhold) {
        nReplacements -= sampleComponent.replacementsToWithhold;
      }
      let samples = sampleComponent.replacements.slice(0, nReplacements)
        .map(x => stateVariables[x.componentName].stateValues.value);
      expect(samples.length).eq(numberOfSamples);

      cy.get('#\\/nSamples .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/−/, '-')).equal(numberOfSamples.toString())
      })
      cy.get('#\\/type_input').should('have.value', specifiedType);
      cy.get('#\\/specifiedMean .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/−/, '-')).equal(specifiedMean.toString())
      })
      cy.get('#\\/specifiedVariance .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/−/, '-')).equal(specifiedVariance.toString())
      })
      cy.get('#\\/specifiedFrom .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/−/, '-')).equal(specifiedFrom.toString())
      })
      cy.get('#\\/specifiedTo .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/−/, '-')).equal(specifiedTo.toString())
      })
      cy.get('#\\/specifiedStep .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/−/, '-')).equal(specifiedStep.toString())
      })

      let type = specifiedType.toLowerCase();
      if (!["gaussian", "uniform", "discreteuniform"].includes(type)) {
        type = "uniform"
      }

      cy.get('#\\/actualType').should('have.text', type)

      let from = specifiedFrom;
      let to = specifiedTo;
      let step = specifiedStep;
      let expectedMean = specifiedMean;
      let expectedVariance = specifiedVariance;


      if (type === "uniform") {
        step = 0;
        expectedMean = (to + from) / 2
        expectedVariance = (to - from) ** 2 / 12;
      } else if (type === "discreteuniform") {
        to = from + Math.floor((to - from) / step) * step;
        expectedMean = (to + from) / 2
        expectedVariance = (((to - from) / step + 1) ** 2 - 1) * step ** 2 / 12
      } else {
        from = 0;
        to = 0;
        step = 0;
      }

      let expectedStandardDeviation = Math.sqrt(expectedVariance);


      cy.get(`#\\/actualFrom`).should('have.text', from);
      cy.get(`#\\/actualTo`).should('have.text', to);
      cy.get(`#\\/actualStep`).should('have.text', step);
      cy.get(`#\\/expectedMean`).invoke('text').then(text => {
        expect(Number(text)).closeTo(expectedMean, 1E-8)
      })
      cy.get(`#\\/expectedVariance`).invoke('text').then(text => {
        expect(Number(text)).closeTo(expectedVariance, 1E-8)
      })
      cy.get(`#\\/expectedStandardDeviation`).invoke('text').then(text => {
        expect(Number(text)).closeTo(expectedStandardDeviation, 1E-8)
      })

      let resultingMean = me.math.mean(samples);
      let resultingVariance = me.math.var(samples);
      let resultingStandardDeviation = Math.sqrt(resultingVariance);

      cy.get(`#\\/resultingMean .mjx-mrow`).invoke('text').then(text => {
        expect(Number(text.replace(/−/, '-'))).closeTo(resultingMean, 1E-8)
        expect(resultingMean).closeTo(expectedMean, allowedErrorInMean)
      })
      cy.get(`#\\/resultingVariance .mjx-mrow`).invoke('text').then(text => {
        expect(Number(text.replace(/−/, '-'))).closeTo(resultingVariance, 1E-8)
        expect(resultingVariance).closeTo(expectedVariance, allowedErrorInVariance)
      })
      cy.get(`#\\/resultingStandardDeviation .mjx-mrow`).invoke('text').then(text => {
        expect(Number(text.replace(/−/, '-'))).closeTo(resultingStandardDeviation, 1E-8)
        expect(resultingStandardDeviation).closeTo(expectedStandardDeviation, Math.sqrt(allowedErrorInVariance))
      })

      if (checkAllSamples) {
        for (let ind = 1; ind <= 9; ind++) {
          cy.get(`#\\/p${ind}`).invoke('text').then(text => {
            let numbers = text.split(',').map(Number);
            expect(numbers.length).eq(numberOfSamples);
            for (let [i, num] of numbers.entries()) {
              expect(num).closeTo(samples[i], 1E-8)
            }
          })
        }
      }
    }


    let numberOfSamples = 10;
    let specifiedType = "";
    let specifiedMean = 0;
    let specifiedVariance = 1;
    let specifiedFrom = 0;
    let specifiedTo = 1;
    let specifiedStep = 1;

    cy.log("initial values")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numberOfSamples, specifiedType,
        specifiedMean, specifiedVariance,
        specifiedFrom, specifiedTo, specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.4,
        allowedErrorInVariance: 0.4,
        stateVariables
      })


    });

    cy.log('Increase number of samples').then(() => {
      numberOfSamples = 50;
    })
    cy.get(`#\\/nSamples textarea`).type("{end}{backspace}{backspace}50{enter}", { force: true })
    cy.get('#\\/nSamplesa').should('contain.text', '50');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numberOfSamples, specifiedType,
        specifiedMean, specifiedVariance,
        specifiedFrom, specifiedTo, specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.2,
        allowedErrorInVariance: 0.2,
        checkAllSamples: false,
        stateVariables
      })

    });

    cy.log('change from and to').then(() => {
      specifiedFrom = -3;
      specifiedTo = 0;
    })
    cy.get(`#\\/specifiedFrom textarea`).type("{end}{backspace}{backspace}-3{enter}", { force: true })
    cy.get(`#\\/specifiedTo textarea`).type("{end}{backspace}{backspace}0{enter}", { force: true })
    cy.get('#\\/specifiedToa').should('contain.text', '0');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numberOfSamples, specifiedType,
        specifiedMean, specifiedVariance,
        specifiedFrom, specifiedTo, specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.4,
        allowedErrorInVariance: 0.4,
        checkAllSamples: false,
        stateVariables
      })

    });


    cy.log('change type to discrete uniform').then(() => {
      specifiedType = "discreteUniform";
    })
    cy.get(`#\\/type_input`).clear().type("discreteUniform{enter}")
    cy.get('#\\/typea').should('contain.text', 'discreteUniform');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numberOfSamples, specifiedType,
        specifiedMean, specifiedVariance,
        specifiedFrom, specifiedTo, specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.4,
        allowedErrorInVariance: 0.3,
        checkAllSamples: false,
        stateVariables
      })

    });

    cy.log('change from, to, and step').then(() => {
      specifiedFrom = 3;
      specifiedTo = -8;
      specifiedStep = -4
    })
    cy.get(`#\\/specifiedFrom textarea`).type("{end}{backspace}{backspace}3{enter}", { force: true })
    cy.get(`#\\/specifiedStep textarea`).type("{end}{backspace}{backspace}-4{enter}", { force: true })
    cy.get(`#\\/specifiedTo textarea`).type("{end}{backspace}{backspace}-8{enter}", { force: true })
    cy.get('#\\/specifiedToa').should('contain.text', '−8');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numberOfSamples, specifiedType,
        specifiedMean, specifiedVariance,
        specifiedFrom, specifiedTo, specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 1,
        allowedErrorInVariance: 2,
        checkAllSamples: false,
        stateVariables
      })

    });


    cy.log('change type to gaussian').then(() => {
      specifiedType = "gaussian";
    })
    cy.get(`#\\/type_input`).clear().type("gaussian{enter}")
    cy.get('#\\/typea').should('contain.text', 'gaussian');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numberOfSamples, specifiedType,
        specifiedMean, specifiedVariance,
        specifiedFrom, specifiedTo, specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.6,
        allowedErrorInVariance: 0.5,
        checkAllSamples: false,
        stateVariables
      })

    });

    cy.log('change mean and variance').then(() => {
      specifiedMean = -11;
      specifiedVariance = 3;
    })
    cy.get(`#\\/specifiedMean textarea`).type("{end}{backspace}{backspace}-11{enter}", { force: true })
    cy.get(`#\\/specifiedVariance textarea`).type("{end}{backspace}{backspace}3{enter}", { force: true })
    cy.get(`#\\/specifiedVariancea`).should('contain.text', '3');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numberOfSamples, specifiedType,
        specifiedMean, specifiedVariance,
        specifiedFrom, specifiedTo, specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.6,
        allowedErrorInVariance: 2,
        checkAllSamples: false,
        stateVariables
      })

    });

    cy.log('Increase number of samples').then(() => {
      numberOfSamples = 200;
    })
    cy.get(`#\\/nSamples textarea`).type("{end}{backspace}{backspace}200{enter}", { force: true })
    cy.get('#\\/nSamplesa').should('contain.text', '200');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numberOfSamples, specifiedType,
        specifiedMean, specifiedVariance,
        specifiedFrom, specifiedTo, specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.4,
        allowedErrorInVariance: 0.8,
        checkAllSamples: false,
        stateVariables
      })

    });

    cy.log('Decrease number of samples').then(() => {
      numberOfSamples = 20;
    })
    cy.get(`#\\/nSamples textarea`).type("{end}{backspace}{enter}", { force: true })
    cy.get('#\\/nSamplesa').should('not.contain.text', '200');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numberOfSamples, specifiedType,
        specifiedMean, specifiedVariance,
        specifiedFrom, specifiedTo, specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 1,
        allowedErrorInVariance: 2,
        checkAllSamples: true,
        stateVariables
      })

    });

  });


  it(`different numbers when reload page if don't save state`, () => {

    let doenetML = `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    `

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let samples = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      samples = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[stateVariables[x.componentName].replacements[0].componentName].replacements[0].componentName].stateValues.value)

      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(0)
        expect(sample).lte(1)
      }

    })


    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[stateVariables[x.componentName].replacements[0].componentName].replacements[0].componentName].stateValues.value)

      expect(samples2.length).eq(100);

      for (let [ind, sample] of samples2.entries()) {
        expect(sample).gt(0)
        expect(sample).lte(1)
        expect(sample).not.eq(samples[ind])
      }


    })

  });

  it('same numbers when reload if save state', () => {

    let doenetML = `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers variantDeterminesSeed /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    `

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let samples = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      samples = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[stateVariables[x.componentName].replacements[0].componentName].replacements[0].componentName].stateValues.value)

      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(0)
        expect(sample).lte(1)
      }

    })


    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[stateVariables[x.componentName].replacements[0].componentName].replacements[0].componentName].stateValues.value)

      expect(samples2).eqls(samples)

    })

  });


  it('same numbers for given variant if variantDeterminesSeed', () => {

    let doenetML = `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers variantDeterminesSeed /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    `

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariant: {
          index: 1,
        }
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let samples = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      samples = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[stateVariables[x.componentName].replacements[0].componentName].replacements[0].componentName].stateValues.value)

      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(0)
        expect(sample).lte(1)
      }

    })


    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariant: {
          index: 1,
        }
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[stateVariables[x.componentName].replacements[0].componentName].replacements[0].componentName].stateValues.value)

      expect(samples2).eqls(samples)

    })



    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariant: {
          index: 2,
        }
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[stateVariables[x.componentName].replacements[0].componentName].replacements[0].componentName].stateValues.value)

      expect(samples2.length).eq(100);

      for (let [ind, sample] of samples2.entries()) {
        expect(sample).gt(0)
        expect(sample).lte(1)
        expect(sample).not.eq(samples[ind])
      }


    })

  });


})