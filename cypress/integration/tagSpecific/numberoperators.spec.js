import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Number Operator Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('mean', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Mean of first primes: <mean name="meanPrime">2,3,5,7</mean></p>
    <p>Copying that mean: <copy tname="meanPrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Mean of numbers from 1 to 100: <mean name="mean100"><sequence to="100" /></mean></p>
    <p>Copying that mean: <copy tname="mean100" /></p>
    <copy tname="p100" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mean2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let mean3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let mean5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let mean6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      cy.log('Test value displayed in browser')

      cy.get('#\\/meanPrime').should('have.text', '4.25')
      cy.get(mean2Anchor).should('have.text', '4.25')
      cy.get(mean3Anchor).should('have.text', 'Mean of first primes: 4.25')
      cy.get('#\\/mean100').should('have.text', '50.5')
      cy.get(mean5Anchor).should('have.text', '50.5')
      cy.get(mean6Anchor).should('have.text', 'Mean of numbers from 1 to 100: 50.5')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/meanPrime'].stateValues.value).eq(4.25);
        expect(components['/_copy1'].replacements[0].stateValues.value).eq(4.25);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value).eq(4.25);
        expect(components['/mean100'].stateValues.value).eq(50.5);
        expect(components['/_copy3'].replacements[0].stateValues.value).eq(50.5);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value).eq(50.5);
      })
    })
  })

  it('variance', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Variance of first primes: <variance name="variancePrime">2,3,5,7</variance></p>
    <p>Copying that variance: <copy tname="variancePrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Variance of numbers from 1 to 100: <variance name="variance100"><sequence to="100" /></variance></p>
    <p>Copying that variance: <copy tname="variance100" /></p>
    <copy tname="p100" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let variance2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let variance3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let variance5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let variance6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      cy.log('Test value displayed in browser')

      cy.get('#\\/variancePrime').should('have.text', '3.6875')
      cy.get(variance2Anchor).should('have.text', '3.6875')
      cy.get(variance3Anchor).should('have.text', 'Variance of first primes: 3.6875')
      cy.get('#\\/variance100').should('have.text', '833.25')
      cy.get(variance5Anchor).should('have.text', '833.25')
      cy.get(variance6Anchor).should('have.text', 'Variance of numbers from 1 to 100: 833.25')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/variancePrime'].stateValues.value).closeTo(59 / 16, 1E-12);
        expect(components['/_copy1'].replacements[0].stateValues.value).closeTo(59 / 16, 1E-12);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value).closeTo(59 / 16, 1E-12);
        expect(components['/variance100'].stateValues.value).closeTo((100 ** 2 - 1) / 12, 1E-12);
        expect(components['/_copy3'].replacements[0].stateValues.value).closeTo((100 ** 2 - 1) / 12, 1E-12);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value).closeTo((100 ** 2 - 1) / 12, 1E-12);
      })
    })
  })

  it('unbiased variance', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Variance of first primes: <variance unbiased name="variancePrime">2,3,5,7</variance></p>
    <p>Copying that variance: <copy tname="variancePrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Variance of numbers from 1 to 100: <variance name="variance100" unbiased><sequence to="100" /></variance></p>
    <p>Copying that variance: <copy tname="variance100" /></p>
    <copy tname="p100" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let variance2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let variance3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let variance5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let variance6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      cy.log('Test value displayed in browser')

      cy.get('#\\/variancePrime').invoke('text').then((text) => {
        expect(Number(text)).closeTo(59 / 12, 1E-6);
        let textNum = text;
        cy.get(variance2Anchor).should('have.text', textNum)
        cy.get(variance3Anchor).should('have.text', 'Variance of first primes: ' + textNum)
      });
      cy.get('#\\/variance100').invoke('text').then((text) => {
        expect(Number(text)).closeTo((100 ** 2 - 1) / 12 * 100 / 99, 1E-6);
        let textNum = text;
        cy.get(variance5Anchor).should('have.text', textNum)
        cy.get(variance6Anchor).should('have.text', 'Variance of numbers from 1 to 100: ' + textNum)
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/variancePrime'].stateValues.value).closeTo(59 / 12, 1E-12);
        expect(components['/_copy1'].replacements[0].stateValues.value).closeTo(59 / 12, 1E-12);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value).closeTo(59 / 12, 1E-12);
        expect(components['/variance100'].stateValues.value).closeTo((100 ** 2 - 1) / 12 * 100 / 99, 1E-12);
        expect(components['/_copy3'].replacements[0].stateValues.value).closeTo((100 ** 2 - 1) / 12 * 100 / 99, 1E-12);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value).closeTo((100 ** 2 - 1) / 12 * 100 / 99, 1E-12);
      })
    })
  })

  it('standard deviation', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Standard deviation of first primes: <standarddeviation name="standarddeviationPrime">2,3,5,7</standarddeviation></p>
    <p>Copying that standard deviation: <copy tname="standarddeviationPrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Standard deviation of numbers from 1 to 100: <standarddeviation name="standarddeviation100"><sequence to="100" /></standarddeviation></p>
    <p>Copying that standard deviation: <copy tname="standarddeviation100" /></p>
    <copy tname="p100" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let standarddeviation2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let standarddeviation3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let standarddeviation5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let standarddeviation6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      cy.log('Test value displayed in browser')

      cy.get('#\\/standarddeviationPrime').invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.sqrt(59 / 16), 1E-6);
        let textNum = text;
        cy.get(standarddeviation2Anchor).should('have.text', textNum)
        cy.get(standarddeviation3Anchor).should('have.text', 'Standard deviation of first primes: ' + textNum)
      });
      cy.get('#\\/standarddeviation100').invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.sqrt((100 ** 2 - 1) / 12), 1E-6);
        let textNum = text;
        cy.get(standarddeviation5Anchor).should('have.text', textNum)
        cy.get(standarddeviation6Anchor).should('have.text', 'Standard deviation of numbers from 1 to 100: ' + textNum)
      });


      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/standarddeviationPrime'].stateValues.value).closeTo(Math.sqrt(59 / 16), 1E-12);
        expect(components['/_copy1'].replacements[0].stateValues.value).closeTo(Math.sqrt(59 / 16), 1E-12);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value).closeTo(Math.sqrt(59 / 16), 1E-12);
        expect(components['/standarddeviation100'].stateValues.value).closeTo(Math.sqrt((100 ** 2 - 1) / 12), 1E-12);
        expect(components['/_copy3'].replacements[0].stateValues.value).closeTo(Math.sqrt((100 ** 2 - 1) / 12), 1E-12);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value).closeTo(Math.sqrt((100 ** 2 - 1) / 12), 1E-12);
      })
    })
  })

  it('unbiased standard deviation', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Standard deviation of first primes: <standarddeviation unbiased name="standarddeviationPrime">2,3,5,7</standarddeviation></p>
    <p>Copying that standard deviation: <copy tname="standarddeviationPrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Standard deviation of numbers from 1 to 100: <standarddeviation name="standarddeviation100" unbiased><sequence to="100" /></standarddeviation></p>
    <p>Copying that standard deviation: <copy tname="standarddeviation100" /></p>
    <copy tname="p100" />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let standarddeviation2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let standarddeviation3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let standarddeviation5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let standarddeviation6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      cy.log('Test value displayed in browser')

      cy.get('#\\/standarddeviationPrime').invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.sqrt(59 / 12), 1E-6);
        let textNum = text;
        cy.get(standarddeviation2Anchor).should('have.text', textNum)
        cy.get(standarddeviation3Anchor).should('have.text', 'Standard deviation of first primes: ' + textNum)
      });
      cy.get('#\\/standarddeviation100').invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.sqrt((100 ** 2 - 1) / 12 * 100 / 99), 1E-6);
        let textNum = text;
        cy.get(standarddeviation5Anchor).should('have.text', textNum)
        cy.get(standarddeviation6Anchor).should('have.text', 'Standard deviation of numbers from 1 to 100: ' + textNum)
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/standarddeviationPrime'].stateValues.value).closeTo(Math.sqrt(59 / 12), 1E-12);
        expect(components['/_copy1'].replacements[0].stateValues.value).closeTo(Math.sqrt(59 / 12), 1E-12);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value).closeTo(Math.sqrt(59 / 12), 1E-12);
        expect(components['/standarddeviation100'].stateValues.value).closeTo(Math.sqrt((100 ** 2 - 1) / 12 * 100 / 99), 1E-12);
        expect(components['/_copy3'].replacements[0].stateValues.value).closeTo(Math.sqrt((100 ** 2 - 1) / 12 * 100 / 99), 1E-12);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value).closeTo(Math.sqrt((100 ** 2 - 1) / 12 * 100 / 99), 1E-12);
      })
    })
  })

  it('count', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Count of first primes: <count name="countPrime">2,3,5,7</count></p>
    <p>Copying that count: <copy tname="countPrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Count of numbers from 1 to 100: <count name="count100"><sequence to="100" /></count></p>
    <p>Copying that count: <copy tname="count100" /></p>
    <copy tname="p100" />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let count2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let count3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let count5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let count6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      cy.log('Test value displayed in browser')

      cy.get('#\\/countPrime').should('have.text', '4')
      cy.get(count2Anchor).should('have.text', '4')
      cy.get(count3Anchor).should('have.text', 'Count of first primes: 4')
      cy.get('#\\/count100').should('have.text', '100')
      cy.get(count5Anchor).should('have.text', '100')
      cy.get(count6Anchor).should('have.text', 'Count of numbers from 1 to 100: 100')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/countPrime'].stateValues.value).eq(4);
        expect(components['/_copy1'].replacements[0].stateValues.value).eq(4);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value).eq(4);
        expect(components['/count100'].stateValues.value).eq(100);
        expect(components['/_copy3'].replacements[0].stateValues.value).eq(100);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value).eq(100);
      })
    })
  })

  it('mod', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>7 mod 2 is <mod><number>7</number><number>2</number></mod>.</p>
    `}, "*");
    });

    cy.log('Test value displayed in browser')

    cy.get('#\\/_mod1').should('have.text','1');

  })

});