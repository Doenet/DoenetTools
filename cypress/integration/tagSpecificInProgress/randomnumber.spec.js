import me from 'math-expressions';

describe('RandomNumber Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('no parameters, generate random number from 1 to 10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <randomnumber/>
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

        let num = map1Replacements[ind].state.number;
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

  it('generate random number from 1 to 6', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <randomnumber>6</randomnumber>
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

        let num = map1Replacements[ind].state.number;
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

  it('generate random number from -3 to 5', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <randomnumber>-3,5</randomnumber>
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

        let num = map1Replacements[ind].state.number;
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

  it('generate random number from -3 to 5, excluding 0', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <randomnumber exclude="0">-3,5</randomnumber>
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

        let num = map1Replacements[ind].state.number;
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

  it('generate odd random number from -3 to 5', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <randomnumber step="2">-3,5</randomnumber>
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

        let num = map1Replacements[ind].state.number;
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

  it('generate continuous random number, no parameters, between 0 and 1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <randomnumber type="uniform"/>
      </template>
      <sources><sequence>1,50</sequence></sources>
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
      expect(map1Replacements.length).eq(50);

      let generatedNumbers = [];
      for (let ind = 0; ind < 50; ind++) {

        let num = map1Replacements[ind].state.number;
        expect(num).at.least(0);
        expect(num).at.most(1);
        generatedNumbers.push(num);
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

  it('generate continuous random number, between 0 and 5', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <randomnumber type="uniform">5</randomnumber>
      </template>
      <sources><sequence>1,50</sequence></sources>
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
      expect(map1Replacements.length).eq(50);

      let generatedNumbers = [];
      for (let ind = 0; ind < 50; ind++) {

        let num = map1Replacements[ind].state.number;
        expect(num).at.least(0);
        expect(num).at.most(5);
        generatedNumbers.push(num);
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

  it('generate continuous random number, between -13 and -7', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <randomnumber type="uniform">-13,-7</randomnumber>
      </template>
      <sources><sequence>1,50</sequence></sources>
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
      expect(map1Replacements.length).eq(50);

      let generatedNumbers = [];
      for (let ind = 0; ind < 50; ind++) {

        let num = map1Replacements[ind].state.number;
        expect(num).at.least(-13);
        expect(num).at.most(-7);
        generatedNumbers.push(num);
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

  it('generate standard normal random number, no parameters', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <randomnumber type="gaussian"/>
      </template>
      <sources><sequence>1,100</sequence></sources>
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
      let nSamples = 100;
      let expectedMean = 0;
      let expectedVariance = 1;
      let expectedStd = Math.sqrt(expectedVariance);

      expect(map1Replacements.length).eq(nSamples);

      let mean = 0;
      let variance = 0;
      let generatedNumbers = [];
      for (let ind = 0; ind < nSamples; ind++) {

        let num = map1Replacements[ind].state.number;
        expect(num).at.least(expectedMean - 6 * expectedStd)
        expect(num).at.most(expectedMean + 6 * expectedStd)

        mean += num;
        variance += num * num;
        generatedNumbers.push(num);
      }

      mean /= nSamples;
      variance /= nSamples;
      variance -= mean * mean;

      expect(mean).at.least(expectedMean - 5 * expectedStd / Math.sqrt(nSamples));
      expect(mean).at.most(expectedMean + 5 * expectedStd / Math.sqrt(nSamples));
      expect(variance).at.least(expectedVariance / 2);
      expect(variance).at.most(2 * expectedVariance);

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < nSamples; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < nSamples; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate normal random number, mean 100, standard deviation 10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <randomnumber type="gaussian" mean="100" standardDeviation="10"/>
      </template>
      <sources><sequence>1,100</sequence></sources>
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
      let nSamples = 100;
      let expectedMean = 100;
      let expectedVariance = 100;
      let expectedStd = Math.sqrt(expectedVariance);

      expect(map1Replacements.length).eq(nSamples);

      let mean = 0;
      let variance = 0;
      let generatedNumbers = [];
      for (let ind = 0; ind < nSamples; ind++) {

        let num = map1Replacements[ind].state.number;
        expect(num).at.least(expectedMean - 6 * expectedStd)
        expect(num).at.most(expectedMean + 6 * expectedStd)

        mean += num;
        variance += num * num;
        generatedNumbers.push(num);
      }

      mean /= nSamples;
      variance /= nSamples;
      variance -= mean * mean;

      expect(mean).at.least(expectedMean - 5 * expectedStd / Math.sqrt(nSamples));
      expect(mean).at.most(expectedMean + 5 * expectedStd / Math.sqrt(nSamples));
      expect(variance).at.least(expectedVariance / 2);
      expect(variance).at.most(2 * expectedVariance);

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < nSamples; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < nSamples; ind++) {
        let num = newAsListChildren[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

    })
  });

  it('generate normal random number, mean -3, variance 0.01', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist>
    <map>
      <template>
        <randomnumber type="gaussian" mean="-3" variance="0.01"/>
      </template>
      <sources><sequence>1,100</sequence></sources>
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
      let nSamples = 100;
      let expectedMean = -3;
      let expectedVariance = 0.01;
      let expectedStd = Math.sqrt(expectedVariance);

      expect(map1Replacements.length).eq(nSamples);

      let mean = 0;
      let variance = 0;
      let generatedNumbers = [];
      for (let ind = 0; ind < nSamples; ind++) {

        let num = map1Replacements[ind].state.number;
        expect(num).at.least(expectedMean - 6 * expectedStd)
        expect(num).at.most(expectedMean + 6 * expectedStd)

        mean += num;
        variance += num * num;
        generatedNumbers.push(num);
      }

      mean /= nSamples;
      variance /= nSamples;
      variance -= mean * mean;

      expect(mean).at.least(expectedMean - 5 * expectedStd / Math.sqrt(nSamples));
      expect(mean).at.most(expectedMean + 5 * expectedStd / Math.sqrt(nSamples));
      expect(variance).at.least(expectedVariance / 2);
      expect(variance).at.most(2 * expectedVariance);

      let ref1Replacements = components['/_ref1'].replacements;
      for (let ind = 0; ind < nSamples; ind++) {

        let num = ref1Replacements[ind].state.number;
        expect(num).eq(generatedNumbers[ind]);
      }

      let newP = components['/_ref2'].replacements[0];
      let newAsListChildren = newP.activeChildren[0].activeChildren;

      for (let ind = 0; ind < nSamples; ind++) {
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
    <randomNumber name="sample1">1000</randomNumber>
    <randomNumber name="sample2">1000</randomNumber>
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
      let num1 = components['/sample1'].state.number;
      let num2 = components['/sample2'].state.number;
      expect(Number.isInteger(num1) && num1 >= 1 && num1 <= 1000).eq(true);
      expect(Number.isInteger(num2) && num2 >= 1 && num2 <= 1000).eq(true);
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
    <mathinput prefill="100" name="maxnum"/>
    <p><aslist>
    <randomnumber type="uniform" name="sample1">
      <to><ref prop="value">maxnum</ref></to>
    </randomnumber>
    </aslist></p>

    <mathinput prefill="20" name="maxnum2"/>
    <p><aslist>
    <randomnumber type="uniform" name="sample2">
      <to><ref prop="value">maxnum2</ref></to>
    </randomnumber>
    </aslist></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let num1, num2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      num1 = components['/sample1'].state.number;
      num2 = components['/sample2'].state.number;
      expect(num1).at.least(0);
      expect(num1).at.most(100);
      expect(num2).at.least(0);
      expect(num2).at.most(20);

    });

    cy.log("Get new samples when change mathinputs");
    cy.get('#\\/maxnum_input').clear().type(`10{enter}`);
    cy.get('#\\/maxnum2_input').clear().type(`200{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let newNum1 = components['/sample1'].state.number;
      let newNum2 = components['/sample2'].state.number;
      expect(newNum1).not.eq(num1);
      expect(newNum2).not.eq(num2);
      expect(newNum1).at.least(0);
      expect(newNum1).at.most(10);
      expect(newNum2).at.least(0);
      expect(newNum2).at.most(200);

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
        <randomnumber name="n">1000000000</randomnumber>
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


})