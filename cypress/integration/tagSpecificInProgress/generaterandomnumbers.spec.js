import me from 'math-expressions';

describe('GenerateRandomNumbers Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('no parameters, generate single random number from 1 to 10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers/>
      </template>
      <sources><sequence>1,30</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(30);

      let generatedNumbers = [];
      for (let ind = 0; ind < 30; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(1);

        let num = randomReplacements[0].state.number;
        expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(num)).eq(true);
        generatedNumbers.push(num);
      }

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 30; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 30; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate single random number from 1 to 6', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers>6</generaterandomnumbers>
      </template>
      <sources><sequence>1,30</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(30);

      let generatedNumbers = [];
      for (let ind = 0; ind < 30; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(1);

        let num = randomReplacements[0].state.number;
        expect([1, 2, 3, 4, 5, 6].includes(num)).eq(true);
        generatedNumbers.push(num);
      }

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 30; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 30; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate single random number from -3 to 5', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers>-3,5</generaterandomnumbers>
      </template>
      <sources><sequence>1,30</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(30);

      let generatedNumbers = [];
      for (let ind = 0; ind < 30; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(1);

        let num = randomReplacements[0].state.number;
        expect([-3, -2, -1, 0, 1, 2, 3, 4, 5].includes(num)).eq(true);
        generatedNumbers.push(num);
      }

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 30; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 30; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate single random number from -3 to 5, excluding 0', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers exclude="0">-3,5</generaterandomnumbers>
      </template>
      <sources><sequence>1,30</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(30);

      let generatedNumbers = [];
      for (let ind = 0; ind < 30; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(1);

        let num = randomReplacements[0].state.number;
        expect([-3, -2, -1, 1, 2, 3, 4, 5].includes(num)).eq(true);
        generatedNumbers.push(num);
      }

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 30; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 30; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate single odd random number from -3 to 5', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers step="2">-3,5</generaterandomnumbers>
      </template>
      <sources><sequence>1,30</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(30);

      let generatedNumbers = [];
      for (let ind = 0; ind < 30; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(1);

        let num = randomReplacements[0].state.number;
        expect([-3, -1, 1, 3, 5].includes(num)).eq(true);
        generatedNumbers.push(num);
      }

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 30; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 30; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate two even random numbers from -4 to 4, excluding 0', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers step="2" exclude="0" numberOfSamples="2">-4,4</generaterandomnumbers>
      </template>
      <sources><sequence>1,30</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(30);

      let generatedNumbers = [];
      for (let ind = 0; ind < 30; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(2);

        let num1 = randomReplacements[0].state.number;
        let num2 = randomReplacements[1].state.number;
        expect([-4, -2, 2, 4].includes(num1)).eq(true);
        expect([-4, -2, 2, 4].includes(num2)).eq(true);
        expect(num1).not.eq(num2);
        generatedNumbers.push(num1);
        generatedNumbers.push(num2);
      }

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 60; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 60; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate five even random numbers with replacement from -4 to 4, excluding 0', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers step="2" exclude="0" numberOfSamples="5" withReplacement>-4,4</generaterandomnumbers>
      </template>
      <sources><sequence>1,10</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(10);

      let generatedNumbers = [];
      for (let ind = 0; ind < 10; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(5);

        for (let i = 0; i < 5; i++) {
          let num = randomReplacements[i].state.number;
          expect([-4, -2, 2, 4].includes(num)).eq(true);
          generatedNumbers.push(num);
        }
      }

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 50; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 50; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate five continuous random numbers, no parameters, between 0 and 1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers type="uniform" numberOfSamples="5" />
      </template>
      <sources><sequence>1,10</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(10);

      let generatedNumbers = [];
      for (let ind = 0; ind < 10; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(5);

        for (let i = 0; i < 5; i++) {
          let num = randomReplacements[i].state.number;
          expect(num).at.least(0);
          expect(num).at.most(1);
          generatedNumbers.push(num);
        }
      }

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 50; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 50; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate ten continuous random numbers, between -3 and -2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers type="uniform" numberOfSamples="10">-3,-2</generaterandomnumbers>
      </template>
      <sources><sequence>1,5</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(5);

      let generatedNumbers = [];
      for (let ind = 0; ind < 5; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(10);

        for (let i = 0; i < 10; i++) {
          let num = randomReplacements[i].state.number;
          expect(num).at.least(-3);
          expect(num).at.most(-2);
          generatedNumbers.push(num);
        }
      }

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 50; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 50; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate twenty continuous standard normals, no parameters', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers type="gaussian" numberOfSamples="20"/>
      </template>
      <sources><sequence>1,5</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let nSamples = 100;
      let expectedMean = 0;
      let expectedVariance = 1;
      let expectedStd = Math.sqrt(expectedVariance);

      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(5);

      let mean = 0;
      let variance = 0;
      let generatedNumbers = [];
      for (let ind = 0; ind < 5; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(20);

        for (let i = 0; i < 20; i++) {
          let num = randomReplacements[i].state.number;
          expect(num).at.least(expectedMean - 6 * expectedStd)
          expect(num).at.most(expectedMean + 6 * expectedStd)

          mean += num;
          variance += num * num;
          generatedNumbers.push(num);
        }
      }

      mean /= nSamples;
      variance /= nSamples;
      variance -= mean * mean;

      expect(mean).at.least(expectedMean - 5 * expectedStd / Math.sqrt(nSamples));
      expect(mean).at.most(expectedMean + 5 * expectedStd / Math.sqrt(nSamples));
      expect(variance).at.least(expectedVariance / 2);
      expect(variance).at.most(2 * expectedVariance);


      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 100; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 100; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate twenty continuous standard normals, mean 100, standard deviation 10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers type="gaussian" mean="100" standardDeviation="10" numberOfSamples="20"/>
      </template>
      <sources><sequence>1,5</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let nSamples = 100;
      let expectedMean = 100;
      let expectedVariance = 100;
      let expectedStd = Math.sqrt(expectedVariance);

      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(5);

      let mean = 0;
      let variance = 0;
      let generatedNumbers = [];
      for (let ind = 0; ind < 5; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(20);

        for (let i = 0; i < 20; i++) {
          let num = randomReplacements[i].state.number;
          expect(num).at.least(expectedMean - 6 * expectedStd)
          expect(num).at.most(expectedMean + 6 * expectedStd)

          mean += num;
          variance += num * num;
          generatedNumbers.push(num);
        }
      }

      mean /= nSamples;
      variance /= nSamples;
      variance -= mean * mean;

      expect(mean).at.least(expectedMean - 5 * expectedStd / Math.sqrt(nSamples));
      expect(mean).at.most(expectedMean + 5 * expectedStd / Math.sqrt(nSamples));
      expect(variance).at.least(expectedVariance / 2);
      expect(variance).at.most(2 * expectedVariance);


      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 100; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 100; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate twenty continuous standard normals, mean -3, variance 0.01', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <generaterandomnumbers type="gaussian" mean="-3" variance="0.01" numberOfSamples="20"/>
      </template>
      <sources><sequence>1,5</sequence></sources>
    </map>
    </aslist></p>

    <p><aslist>
      <ref>_map1</ref>
    </aslist></p>

    <ref>_p1</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let nSamples = 100;
      let expectedMean = -3;
      let expectedVariance = 0.01;
      let expectedStd = Math.sqrt(expectedVariance);

      let map1Replacements = components['/_map1'].replacements;
      expect(map1Replacements.length).eq(5);

      let mean = 0;
      let variance = 0;
      let generatedNumbers = [];
      for (let ind = 0; ind < 5; ind++) {

        let randomReplacements = map1Replacements[ind].replacements;
        expect(randomReplacements.length).eq(20);

        for (let i = 0; i < 20; i++) {
          let num = randomReplacements[i].state.number;
          expect(num).at.least(expectedMean - 6 * expectedStd)
          expect(num).at.most(expectedMean + 6 * expectedStd)

          mean += num;
          variance += num * num;
          generatedNumbers.push(num);
        }
      }

      mean /= nSamples;
      variance /= nSamples;
      variance -= mean * mean;

      expect(mean).at.least(expectedMean - 5 * expectedStd / Math.sqrt(nSamples));
      expect(mean).at.most(expectedMean + 5 * expectedStd / Math.sqrt(nSamples));
      expect(variance).at.least(expectedVariance / 2);
      expect(variance).at.most(2 * expectedVariance);


      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < 100; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < 100; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it("refs don't resample", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <generaterandomNumbers name="sample1">100</generaterandomNumbers>
    <generaterandomNumbers name="sample2">100</generaterandomNumbers>
    </aslist></p>

    <p><aslist>
    <ref name="noresample1">sample1</ref>
    <ref name="noresample2">sample2</ref>
    <ref name="noreresample1">noresample1</ref>
    <ref name="noreresample2">noresample2</ref>
    </aslist></p>

    <p><ref name="noresamplelist">_aslist1</ref></p>

    <p><ref name="noreresamplelist">noresamplelist</ref></p>

    <ref name="noresamplep">_p1</ref>
    <ref name="noreresamplep">noresamplep</ref>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let num1 = components['/sample1'].replacements[0].state.number;
      let num2 = components['/sample2'].replacements[0].state.number;
      expect(Number.isInteger(num1) && num1 >= 1 && num1 <= 100).eq(true);
      expect(Number.isInteger(num2) && num2 >= 1 && num2 <= 100).eq(true);
      expect(components['/noresample1'].replacements[0].state.number).eq(num1);
      expect(components['/noresample2'].replacements[0].state.number).eq(num2);
      expect(components['/noreresample1'].replacements[0].state.number).eq(num1);
      expect(components['/noreresample2'].replacements[0].state.number).eq(num2);

      expect(components['/noresamplelist'].replacements[0].activeChildren[0].state.number).eq(num1);
      expect(components['/noresamplelist'].replacements[0].activeChildren[1].state.number).eq(num2);
      expect(components['/noreresamplelist'].replacements[0].activeChildren[0].state.number).eq(num1);
      expect(components['/noreresamplelist'].replacements[0].activeChildren[1].state.number).eq(num2);

      expect(components['/noresamplep'].replacements[0].activeChildren[0].activeChildren[0].state.number).eq(num1);
      expect(components['/noresamplep'].replacements[0].activeChildren[0].activeChildren[1].state.number).eq(num2);
      expect(components['/noreresamplep'].replacements[0].activeChildren[0].activeChildren[0].state.number).eq(num1);
      expect(components['/noreresamplep'].replacements[0].activeChildren[0].activeChildren[1].state.number).eq(num2);

    })
  });

  it("random number does change dynamically", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="20" name="numberofsamples"/>
    <mathinput prefill="10" name="maxnum"/>
    <p><aslist>
    <generaterandomnumbers name="sample1" withReplacement>
      <count><ref prop="value">maxnum</ref></count>
      <numberofsamples><ref prop="value">numberofsamples</ref></numberofsamples>
    </generaterandomnumbers>
    </aslist></p>

    <mathinput prefill="10" name="numberofsamples2"/>
    <mathinput prefill="4" name="maxnum2"/>
    <p><aslist>
    <generaterandomnumbers name="sample2" withReplacement>
      <count><ref prop="value">maxnum2</ref></count>
      <numberofsamples><ref prop="value">numberofsamples2</ref></numberofsamples>
    </generaterandomnumbers>
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
      sample1numbers = sample1replacements.map(x => x.state.number);
      sample2numbers = sample2replacements.map(x => x.state.number);

      for (let num of sample1numbers) {
        expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(num)).eq(true);
      }
      for (let num of sample2numbers) {
        expect([1, 2, 3, 4].includes(num)).eq(true);
      }

    });

    cy.log("Get new samples when change mathinputs");
    cy.get('#\\/numberofsamples_input').clear().type(`15{enter}`);
    cy.get('#\\/maxnum_input').clear().type(`6{enter}`);
    cy.get('#\\/numberofsamples2_input').clear().type(`7{enter}`);
    cy.get('#\\/maxnum2_input').clear().type(`9{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let sample1replacements = components['/sample1'].replacements;
      let sample2replacements = components['/sample2'].replacements;
      expect(sample1replacements.length).eq(15);
      expect(sample2replacements.length).eq(7);
      sample1numbers = sample1replacements.map(x => x.state.number);
      sample2numbers = sample2replacements.map(x => x.state.number);

      for (let num of sample1numbers) {
        expect([1, 2, 3, 4, 5, 6].includes(num)).eq(true);
      }
      for (let num of sample2numbers) {
        expect([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(num)).eq(true);
      }

    });
  });

  it("random number does resample in dynamic map", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    How many numbers do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnamespaces="a,b,c,d,e,f">
      <template>
        <generaterandomnumbers assignnames="n">1000000000</generaterandomnumbers>
      </template>
      <sources>
      <sequence>
        <count><ref prop="value">_mathinput1</ref></count>
      </sequence>
      </sources>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist><ref>_map1</ref></aslist></p>
    <p name="p3"><ref>_aslist1</ref></p>

    <ref name="p4">p1</ref>
    <ref name="p5">p2</ref>
    <ref name="p6">p3</ref>

    <ref name="p7">p4</ref>
    <ref name="p8">p5</ref>
    <ref name="p9">p6</ref>
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
    cy.get('#\\/_mathinput1_input').clear().type(`1{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].state.number;
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
        expect(components['/p1'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1_input').clear().type(`0{enter}`);
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

    cy.log("get different number when go back to 1");
    cy.get('#\\/_mathinput1_input').clear().type(`1{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].state.number;
      expect(n1).not.eq(samplednumbers[0]);
      samplednumbers[0] = n1;
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
        expect(components['/p1'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
      }
    })

    cy.log("get two more samples");
    cy.get('#\\/_mathinput1_input').clear().type(`3{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].state.number;
      let n2 = components['/b/n'].state.number;
      let n3 = components['/c/n'].state.number;
      expect(n1).not.eq(samplednumbers[0]);
      samplednumbers[0] = n1;
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
        expect(components['/p1'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1_input').clear().type(`0{enter}`);
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


    cy.log("get different two numbers when go back to 2");
    cy.get('#\\/_mathinput1_input').clear().type(`2{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].state.number;
      let n2 = components['/b/n'].state.number;
      expect(n1).not.eq(samplednumbers[0]);
      expect(n2).not.eq(samplednumbers[1]);
      samplednumbers[0] = n1;
      samplednumbers[1] = n2;
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
        expect(components['/p1'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
      }
    })

    cy.log("get six total samples, all new");
    cy.get('#\\/_mathinput1_input').clear().type(`6{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].state.number;
      let n2 = components['/b/n'].state.number;
      let n3 = components['/c/n'].state.number;
      let n4 = components['/d/n'].state.number;
      let n5 = components['/e/n'].state.number;
      let n6 = components['/f/n'].state.number;
      expect(n1).not.eq(samplednumbers[0]);
      expect(n2).not.eq(samplednumbers[1]);
      expect(n3).not.eq(samplednumbers[2]);
      samplednumbers[0] = n1;
      samplednumbers[1] = n2;
      samplednumbers[2] = n3;
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
        expect(components['/p1'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1_input').clear().type(`0{enter}`);
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

    cy.log("get six numbers, all different");
    cy.get('#\\/_mathinput1_input').clear().type(`6{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].state.number;
      let n2 = components['/b/n'].state.number;
      let n3 = components['/c/n'].state.number;
      let n4 = components['/d/n'].state.number;
      let n5 = components['/e/n'].state.number;
      let n6 = components['/f/n'].state.number;
      expect(n1).not.eq(samplednumbers[0]);
      expect(n2).not.eq(samplednumbers[1]);
      expect(n3).not.eq(samplednumbers[2]);
      expect(n4).not.eq(samplednumbers[3]);
      expect(n5).not.eq(samplednumbers[4]);
      expect(n6).not.eq(samplednumbers[5]);
      samplednumbers[0] = n1;
      samplednumbers[1] = n2;
      samplednumbers[2] = n3;
      samplednumbers[3] = n4;
      samplednumbers[4] = n5;
      samplednumbers[5] = n6;

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
        expect(components['/p1'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].state.number).eq(samplednumbers[ind]);
      }
    })


  });

  it('generate single number, assign name', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><generaterandomNumbers from="3" step="7" count="3" assignnames="u"/></p>
    <p><generaterandomNumbers from="3" step="7" count="3" assignnames="v"/></p>
    <p><generaterandomNumbers from="3" step="7" count="3" assignnames="w"/></p>
    <p><ref name="u2">u</ref></p>
    <p><ref name="v2">v</ref></p>
    <p><ref name="w2">w</ref></p>
    `}, "*");
    });

    let options = [3, 10, 17];

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/u'];
      let u2 = components['/u2'].replacements[0];

      expect(options.includes(u.state.number)).eq(true);
      expect(u.state.number).eq(u2.state.number);

      let v = components['/v'];
      let v2 = components['/v2'].replacements[0];
      expect(options.includes(v.state.number)).eq(true);
      expect(v.state.number).eq(v2.state.number);

      let w = components['/w'];
      let w2 = components['/w2'].replacements[0];
      expect(options.includes(w.state.number)).eq(true);
      expect(w.state.number).eq(w2.state.number);

    })

  });

  it('generate multiple random numbers, assign names', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of samples: <mathinput name="n" prefill="6"/> </p>
    <p><aslist>
      <generaterandomNumbers name="s" from="3" step="7" count="13" assignnames="u,v,w" withReplacement >
        <numberofsamples><ref prop="value">n</ref></numberofsamples>
      </generaterandomnumbers>
    </aslist></p>
    <p><ref name="u2">u</ref></p>
    <p><ref name="v2">v</ref></p>
    <p><ref name="w2">w</ref></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let options = [3];
    for (let i = 0; i < 12; i++) {
      options.push(options[i] + 7);
    }

    let results = [];

    for (let ind = 0; ind < 6; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").find('.mjx-mrow').eq(0).invoke("text").then(text => {
        results[ind] = Number(text);
        expect(options.includes(Number(text))).eq(true);
      })
    }
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[0]);
    })
    cy.get("#\\/_p4").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[1]);
    })
    cy.get("#\\/_p5").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[2]);
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/u'];
      let u2 = components['/u2'].replacements[0];
      expect(u.state.number).eq(results[0])
      expect(u2.state.number).eq(results[0]);

      let v = components['/v'];
      let v2 = components['/v2'].replacements[0];
      expect(v.state.number).eq(results[1]);
      expect(v2.state.number).eq(results[1]);

      let w = components['/w'];
      let w2 = components['/w2'].replacements[0];
      expect(w.state.number).eq(results[2]);
      expect(w2.state.number).eq(results[2]);

      let s = components['/s'];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = s.replacements[ind];
        expect(r.state.number).eq(results[ind]);
      }
    })

    cy.log("Increase number of samples");
    cy.get('#\\/n_input').clear().type(`10{enter}`);

    for (let ind = 0; ind < 10; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").find('.mjx-mrow').eq(0).invoke("text").then(text => {
        results[ind] = Number(text);
        expect(options.includes(Number(text))).eq(true);
      })
    }

    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[0]);
    })
    cy.get("#\\/_p4").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[1]);
    })
    cy.get("#\\/_p5").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[2]);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/u'];
      let u2 = components['/u2'].replacements[0];
      expect(u.state.number).eq(results[0])
      expect(u2.state.number).eq(results[0]);

      let v = components['/v'];
      let v2 = components['/v2'].replacements[0];
      expect(v.state.number).eq(results[1]);
      expect(v2.state.number).eq(results[1]);

      let w = components['/w'];
      let w2 = components['/w2'].replacements[0];
      expect(w.state.number).eq(results[2]);
      expect(w2.state.number).eq(results[2]);

      let s = components['/s'];
      expect(s.replacements.length).eq(10);
      for (let ind = 0; ind < 10; ind++) {
        let r = s.replacements[ind];
        expect(r.state.number).eq(results[ind]);
      }
    })


    cy.log("decrease number of samples");
    cy.get('#\\/n_input').clear().type(`1{enter}`);


    for (let ind = 0; ind < 1; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").find('.mjx-mrow').eq(0).invoke("text").then(text => {
        results[ind] = Number(text);
        expect(options.includes(Number(text))).eq(true);
      })
    }
    for (let ind = 1; ind < 10; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").should('not.have.text');
    }


    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[0]);
    })
    cy.get("#\\/_p4").should('not.have.text')
    cy.get("#\\/_p5").should('not.have.text')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/u'];
      let u2 = components['/u2'].replacements[0];
      expect(u.state.number).eq(results[0])
      expect(u2.state.number).eq(results[0]);

      expect(components['/v'].inactive).eq(true);
      expect(components['/v2'].replacements.length).eq(0);

      expect(components['/w'].inactive).eq(true);
      expect(components['/w2'].replacements.length).eq(0);


      let s = components['/s'];
      expect(s.replacements.length - s.replacementsToWithhold).eq(1);
      for (let ind = 0; ind < 1; ind++) {
        let r = s.replacements[ind];
        expect(r.state.number).eq(results[ind]);
      }
    })


    cy.log("increase number of samples to 4");
    cy.get('#\\/n_input').clear().type(`4{enter}`);


    for (let ind = 0; ind < 4; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").find('.mjx-mrow').eq(0).invoke("text").then(text => {
        results[ind] = Number(text);
        expect(options.includes(Number(text))).eq(true);
      })
    }
    for (let ind = 4; ind < 10; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").should('not.have.text');
    }

    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[0]);
    })
    cy.get("#\\/_p4").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[1]);
    })
    cy.get("#\\/_p5").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[2]);
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/u'];
      let u2 = components['/u2'].replacements[0];
      expect(u.state.number).eq(results[0])
      expect(u2.state.number).eq(results[0]);

      let v = components['/v'];
      let v2 = components['/v2'].replacements[0];
      expect(v.state.number).eq(results[1]);
      expect(v2.state.number).eq(results[1]);

      let w = components['/w'];
      let w2 = components['/w2'].replacements[0];
      expect(w.state.number).eq(results[2]);
      expect(w2.state.number).eq(results[2]);

      let s = components['/s'];
      expect(s.replacements.length).eq(4);
      for (let ind = 0; ind < 4; ind++) {
        let r = s.replacements[ind];
        expect(r.state.number).eq(results[ind]);
      }
    })


    cy.log("decrease number of samples to zero");
    cy.get('#\\/n_input').clear().type(`0{enter}`);


    for (let ind = 0; ind < 10; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").should('not.have.text');
    }

    cy.get("#\\/_p3").should('not.have.text')
    cy.get("#\\/_p4").should('not.have.text')
    cy.get("#\\/_p5").should('not.have.text')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/u'];
      let u2 = components['/u2'].replacements[0];

      expect(components['/u'].inactive).eq(true);
      expect(components['/u2'].replacements.length).eq(0);

      expect(components['/v'].inactive).eq(true);
      expect(components['/v2'].replacements.length).eq(0);

      expect(components['/w'].inactive).eq(true);
      expect(components['/w2'].replacements.length).eq(0);


      let s = components['/s'];
      expect(s.replacements.length - s.replacementsToWithhold).eq(0);
    })



    cy.log("increase number of samples to 2");
    cy.get('#\\/n_input').clear().type(`2{enter}`);


    for (let ind = 0; ind < 2; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").find('.mjx-mrow').eq(0).invoke("text").then(text => {
        results[ind] = Number(text);
        expect(options.includes(Number(text))).eq(true);
      })
    }
    for (let ind = 2; ind < 10; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").should('not.have.text');
    }


    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[0]);
    })
    cy.get("#\\/_p4").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[1]);
    })
    cy.get("#\\/_p5").should('not.have.text')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/u'];
      let u2 = components['/u2'].replacements[0];
      expect(u.state.number).eq(results[0])
      expect(u2.state.number).eq(results[0]);

      let v = components['/v'];
      let v2 = components['/v2'].replacements[0];
      expect(v.state.number).eq(results[1])
      expect(v2.state.number).eq(results[1]);

      expect(components['/w'].inactive).eq(true);
      expect(components['/w2'].replacements.length).eq(0);

      let s = components['/s'];
      expect(s.replacements.length - s.replacementsToWithhold).eq(2);
      for (let ind = 0; ind < 2; ind++) {
        let r = s.replacements[ind];
        expect(r.state.number).eq(results[ind]);
      }
    })

  });

  it('generate multiple random numbers, assign names, new namespace', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of samples: <mathinput name="n" prefill="6"/> </p>
    <p><aslist>
      <generaterandomNumbers name="s" newnamespace from="3" step="7" count="13" assignnames="u,v,w" withReplacement >
        <numberofsamples><ref prop="value">../n</ref></numberofsamples>
      </generaterandomnumbers>
    </aslist></p>
    <p><ref name="u2">s/u</ref></p>
    <p><ref name="v2">s/v</ref></p>
    <p><ref name="w2">s/w</ref></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let options = [3];
    for (let i = 0; i < 12; i++) {
      options.push(options[i] + 7);
    }

    let results = [];

    for (let ind = 0; ind < 6; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").find('.mjx-mrow').eq(0).invoke("text").then(text => {
        results[ind] = Number(text);
        expect(options.includes(Number(text))).eq(true);
      })
    }
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[0]);
    })
    cy.get("#\\/_p4").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[1]);
    })
    cy.get("#\\/_p5").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[2]);
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/s/u'];
      let u2 = components['/u2'].replacements[0];
      expect(u.state.number).eq(results[0])
      expect(u2.state.number).eq(results[0]);

      let v = components['/s/v'];
      let v2 = components['/v2'].replacements[0];
      expect(v.state.number).eq(results[1]);
      expect(v2.state.number).eq(results[1]);

      let w = components['/s/w'];
      let w2 = components['/w2'].replacements[0];
      expect(w.state.number).eq(results[2]);
      expect(w2.state.number).eq(results[2]);

      let s = components['/s'];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = s.replacements[ind];
        expect(r.state.number).eq(results[ind]);
      }
    })

    cy.log("Increase number of samples");
    cy.get('#\\/n_input').clear().type(`10{enter}`);

    for (let ind = 0; ind < 10; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").find('.mjx-mrow').eq(0).invoke("text").then(text => {
        results[ind] = Number(text);
        expect(options.includes(Number(text))).eq(true);
      })
    }

    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[0]);
    })
    cy.get("#\\/_p4").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[1]);
    })
    cy.get("#\\/_p5").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[2]);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/s/u'];
      let u2 = components['/u2'].replacements[0];
      expect(u.state.number).eq(results[0])
      expect(u2.state.number).eq(results[0]);

      let v = components['/s/v'];
      let v2 = components['/v2'].replacements[0];
      expect(v.state.number).eq(results[1]);
      expect(v2.state.number).eq(results[1]);

      let w = components['/s/w'];
      let w2 = components['/w2'].replacements[0];
      expect(w.state.number).eq(results[2]);
      expect(w2.state.number).eq(results[2]);

      let s = components['/s'];
      expect(s.replacements.length).eq(10);
      for (let ind = 0; ind < 10; ind++) {
        let r = s.replacements[ind];
        expect(r.state.number).eq(results[ind]);
      }
    })


    cy.log("decrease number of samples");
    cy.get('#\\/n_input').clear().type(`1{enter}`);


    for (let ind = 0; ind < 1; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").find('.mjx-mrow').eq(0).invoke("text").then(text => {
        results[ind] = Number(text);
        expect(options.includes(Number(text))).eq(true);
      })
    }
    for (let ind = 1; ind < 10; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").should('not.have.text');
    }


    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[0]);
    })
    cy.get("#\\/_p4").should('not.have.text')
    cy.get("#\\/_p5").should('not.have.text')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/s/u'];
      let u2 = components['/u2'].replacements[0];
      expect(u.state.number).eq(results[0])
      expect(u2.state.number).eq(results[0]);

      expect(components['/s/v'].inactive).eq(true);
      expect(components['/v2'].replacements.length).eq(0);

      expect(components['/s/w'].inactive).eq(true);
      expect(components['/w2'].replacements.length).eq(0);


      let s = components['/s'];
      expect(s.replacements.length - s.replacementsToWithhold).eq(1);
      for (let ind = 0; ind < 1; ind++) {
        let r = s.replacements[ind];
        expect(r.state.number).eq(results[ind]);
      }
    })


    cy.log("increase number of samples to 4");
    cy.get('#\\/n_input').clear().type(`4{enter}`);


    for (let ind = 0; ind < 4; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").find('.mjx-mrow').eq(0).invoke("text").then(text => {
        results[ind] = Number(text);
        expect(options.includes(Number(text))).eq(true);
      })
    }
    for (let ind = 4; ind < 10; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").should('not.have.text');
    }

    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[0]);
    })
    cy.get("#\\/_p4").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[1]);
    })
    cy.get("#\\/_p5").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[2]);
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/s/u'];
      let u2 = components['/u2'].replacements[0];
      expect(u.state.number).eq(results[0])
      expect(u2.state.number).eq(results[0]);

      let v = components['/s/v'];
      let v2 = components['/v2'].replacements[0];
      expect(v.state.number).eq(results[1]);
      expect(v2.state.number).eq(results[1]);

      let w = components['/s/w'];
      let w2 = components['/w2'].replacements[0];
      expect(w.state.number).eq(results[2]);
      expect(w2.state.number).eq(results[2]);

      let s = components['/s'];
      expect(s.replacements.length).eq(4);
      for (let ind = 0; ind < 4; ind++) {
        let r = s.replacements[ind];
        expect(r.state.number).eq(results[ind]);
      }
    })


    cy.log("decrease number of samples to zero");
    cy.get('#\\/n_input').clear().type(`0{enter}`);


    for (let ind = 0; ind < 10; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").should('not.have.text');
    }

    cy.get("#\\/_p3").should('not.have.text')
    cy.get("#\\/_p4").should('not.have.text')
    cy.get("#\\/_p5").should('not.have.text')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/s/u'].inactive).eq(true);
      expect(components['/u2'].replacements.length).eq(0);

      expect(components['/s/v'].inactive).eq(true);
      expect(components['/v2'].replacements.length).eq(0);

      expect(components['/s/w'].inactive).eq(true);
      expect(components['/w2'].replacements.length).eq(0);


      let s = components['/s'];
      expect(s.replacements.length - s.replacementsToWithhold).eq(0);
    })



    cy.log("increase number of samples to 2");
    cy.get('#\\/n_input').clear().type(`2{enter}`);


    for (let ind = 0; ind < 2; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").find('.mjx-mrow').eq(0).invoke("text").then(text => {
        results[ind] = Number(text);
        expect(options.includes(Number(text))).eq(true);
      })
    }
    for (let ind = 2; ind < 10; ind++) {
      cy.get("#\\/_p2 > :nth-child(" + (2*ind + 4) + ")").should('not.have.text');
    }


    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[0]);
    })
    cy.get("#\\/_p4").find('.mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Number(text)).eq(results[1]);
    })
    cy.get("#\\/_p5").should('not.have.text')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let u = components['/s/u'];
      let u2 = components['/u2'].replacements[0];
      expect(u.state.number).eq(results[0])
      expect(u2.state.number).eq(results[0]);

      let v = components['/s/v'];
      let v2 = components['/v2'].replacements[0];
      expect(v.state.number).eq(results[1])
      expect(v2.state.number).eq(results[1]);

      expect(components['/s/w'].inactive).eq(true);
      expect(components['/w2'].replacements.length).eq(0);

      let s = components['/s'];
      expect(s.replacements.length - s.replacementsToWithhold).eq(2);
      for (let ind = 0; ind < 2; ind++) {
        let r = s.replacements[ind];
        expect(r.state.number).eq(results[ind]);
      }
    })

  });

})