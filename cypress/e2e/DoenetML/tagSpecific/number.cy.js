import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Number Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
  })

  it('1+1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <copy target="_number1" />
      <number>1+1</number>
    ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let number0Name = stateVariables['/_copy1'].replacements[0].componentName;
      let number0Anchor = cesc('#' + number0Name);

      cy.log('Test value displayed in browser')
      cy.get(number0Anchor).should('have.text', '2')
      cy.get('#\\/_number1').should('have.text', '2')

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables[number0Name].stateValues.value).eq(2);
        expect(stateVariables['/_number1'].stateValues.value).eq(2);
      })
    })
  })

  it(`number that isn't a number`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <copy target="_number1" />
      <number>x+1</number>
      ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let number0Name = stateVariables['/_copy1'].replacements[0].componentName;
      let number0Anchor = cesc('#' + number0Name);

      cy.log('Test value displayed in browser')
      cy.get(number0Anchor).should('have.text', 'NaN')
      cy.get('#\\/_number1').should('have.text', 'NaN')


      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        assert.isNaN(stateVariables[number0Name].stateValues.value);
        assert.isNaN(stateVariables['/_number1'].stateValues.value);
      })
    })
  })

  it(`number becomes non-numeric through inverse`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="n">5</number>
      <mathinput bindValueTo="$n" />
      ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n').should('have.text', '5');

    cy.get('#\\/_mathinput1 textarea').type('{end}x{enter}', { force: true })
    cy.get('#\\/n').should('have.text', 'NaN');

    cy.get('#\\/_mathinput1 textarea').type('{ctrl+home}{shift+end}{backspace}9{enter}', { force: true })
    cy.get('#\\/n').should('have.text', '9');

  })

  it('number in math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <math>x+<number>3</number></math>
      ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+3')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', 'x', 3])
      expect(stateVariables['/_number1'].stateValues.value).to.eq(3);
    })
  });

  it('math in number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number><math>5+<math>3</math></math></number>
      ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_number1').should('have.text', '8')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', 5, 3]);
      expect(stateVariables['/_math2'].stateValues.value).eq(3);
      expect(stateVariables['/_number1'].stateValues.value).eq(8);
    })
  });

  it('number converts to decimals', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number>log(0.5/0.3)</number>, 
      <math><copy target="_number1" /></math>
      ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    let num = Math.log(0.5 / 0.3);
    let numString = me.math.round(num, 10).toString();

    cy.log('Test value displayed in browser');
    cy.get('#\\/_number1').should('have.text', numString)
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(numString)
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).closeTo(num, 1E-14);
      expect(stateVariables['/_number1'].stateValues.value).closeTo(num, 1E-14);
    })
  });

  it('rounding', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="n1">234234823.34235235324</number>
      <number name="n2">5.4285023408250342</number>
      <number name="n3">0.000000000000005023481340324</number>
      <copy target="n1" displayDigits='3' assignNames="n1a" />
      <copy target="n1" displayDecimals='3' assignNames="n1b" />
      <copy target="n1" displayDigits='3' displaySmallAsZero assignNames="n1c" />
      <copy target="n2" displayDigits='3' assignNames="n2a" />
      <copy target="n2" displayDecimals='3' assignNames="n2b" />
      <copy target="n2" displayDigits='3' displaySmallAsZero assignNames="n2c" />
      <copy target="n3" displayDigits='3' assignNames="n3a" />
      <copy target="n3" displayDecimals='3' assignNames="n3b" />
      <copy target="n3" displayDigits='3' displaySmallAsZero assignNames="n3c" />

      <copy target="n1a" displayDigits='3' assignNames="n1aa" />
      <copy target="n1a" displayDecimals='3' assignNames="n1ab" />
      <copy target="n2a" displayDigits='3' assignNames="n2aa" />
      <copy target="n2a" displayDecimals='3' assignNames="n2ab" />
      <copy target="n3a" displayDigits='3' assignNames="n3aa" />
      <copy target="n3a" displayDecimals='3' assignNames="n3ab" />

      <copy target="n1b" displayDigits='3' assignNames="n1ba" />
      <copy target="n1b" displayDecimals='3' assignNames="n1bb" />
      <copy target="n2b" displayDigits='3' assignNames="n2ba" />
      <copy target="n2b" displayDecimals='3' assignNames="n2bb" />
      <copy target="n3b" displayDigits='3' assignNames="n3ba" />
      <copy target="n3b" displayDecimals='3' assignNames="n3bb" />

      <m name="n1am">$n1a</m>
      <m name="n1bm">$n1b</m>
      <m name="n1cm">$n1c</m>
      <m name="n2am">$n2a</m>
      <m name="n2bm">$n2b</m>
      <m name="n2cm">$n2c</m>
      <m name="n3am">$n3a</m>
      <m name="n3bm">$n3b</m>
      <m name="n3cm">$n3c</m>

      <m name="n1aam">$n1aa</m>
      <m name="n1abm">$n1ab</m>
      <m name="n2aam">$n2aa</m>
      <m name="n2abm">$n2ab</m>
      <m name="n3aam">$n3aa</m>
      <m name="n3abm">$n3ab</m>

      <m name="n1bam">$n1ba</m>
      <m name="n1bbm">$n1bb</m>
      <m name="n2bam">$n2ba</m>
      <m name="n2bbm">$n2bb</m>
      <m name="n3bam">$n3ba</m>
      <m name="n3bbm">$n3bb</m>
      
    ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n1').should('have.text', '234234823.3')
    cy.get('#\\/n1a').should('have.text', '234000000')
    cy.get('#\\/n1b').should('have.text', '234234823.342')
    cy.get('#\\/n1c').should('have.text', '234000000')
    cy.get('#\\/n1am .mjx-mrow').eq(0).should('have.text', '234000000')
    cy.get('#\\/n1bm .mjx-mrow').eq(0).should('have.text', '234234823.342')
    cy.get('#\\/n1cm .mjx-mrow').eq(0).should('have.text', '234000000')

    cy.get('#\\/n2').should('have.text', '5.428502341')
    cy.get('#\\/n2a').should('have.text', '5.43')
    cy.get('#\\/n2b').should('have.text', '5.429')
    cy.get('#\\/n2c').should('have.text', '5.43')
    cy.get('#\\/n2am .mjx-mrow').eq(0).should('have.text', '5.43')
    cy.get('#\\/n2bm .mjx-mrow').eq(0).should('have.text', '5.429')
    cy.get('#\\/n2cm .mjx-mrow').eq(0).should('have.text', '5.43')

    cy.get('#\\/n3').should('have.text', '5.02348134 * 10^(-15)')
    cy.get('#\\/n3a').should('have.text', '5.02 * 10^(-15)')
    cy.get('#\\/n3b').should('have.text', '0')
    cy.get('#\\/n3c').should('have.text', '0')
    cy.get('#\\/n3am .mjx-mrow').eq(0).should('have.text', '5.02⋅10−15')
    cy.get('#\\/n3bm .mjx-mrow').eq(0).should('have.text', '0')
    cy.get('#\\/n3cm .mjx-mrow').eq(0).should('have.text', '0')


    cy.get('#\\/n1aa').should('have.text', '234000000')
    cy.get('#\\/n1ab').should('have.text', '234234823.342')
    cy.get('#\\/n1aam .mjx-mrow').eq(0).should('have.text', '234000000')
    cy.get('#\\/n1abm .mjx-mrow').eq(0).should('have.text', '234234823.342')

    cy.get('#\\/n2aa').should('have.text', '5.43')
    cy.get('#\\/n2ab').should('have.text', '5.429')
    cy.get('#\\/n2aam .mjx-mrow').eq(0).should('have.text', '5.43')
    cy.get('#\\/n2abm .mjx-mrow').eq(0).should('have.text', '5.429')

    cy.get('#\\/n3aa').should('have.text', '5.02 * 10^(-15)')
    cy.get('#\\/n3ab').should('have.text', '0')
    cy.get('#\\/n3aam .mjx-mrow').eq(0).should('have.text', '5.02⋅10−15')
    cy.get('#\\/n3abm .mjx-mrow').eq(0).should('have.text', '0')

    cy.get('#\\/n1ba').should('have.text', '234000000')
    cy.get('#\\/n1bb').should('have.text', '234234823.342')
    cy.get('#\\/n1bam .mjx-mrow').eq(0).should('have.text', '234000000')
    cy.get('#\\/n1bbm .mjx-mrow').eq(0).should('have.text', '234234823.342')

    cy.get('#\\/n2ba').should('have.text', '5.43')
    cy.get('#\\/n2bb').should('have.text', '5.429')
    cy.get('#\\/n2bam .mjx-mrow').eq(0).should('have.text', '5.43')
    cy.get('#\\/n2bbm .mjx-mrow').eq(0).should('have.text', '5.429')

    cy.get('#\\/n3ba').should('have.text', '5.02 * 10^(-15)')
    cy.get('#\\/n3bb').should('have.text', '0')
    cy.get('#\\/n3bam .mjx-mrow').eq(0).should('have.text', '5.02⋅10−15')
    cy.get('#\\/n3bbm .mjx-mrow').eq(0).should('have.text', '0')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n1'].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables['/n1a'].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables['/n1b'].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables['/n1c'].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables[stateVariables['/n1am'].activeChildren[0].componentName].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables[stateVariables['/n1bm'].activeChildren[0].componentName].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables[stateVariables['/n1cm'].activeChildren[0].componentName].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables['/n2'].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables['/n2a'].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables['/n2b'].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables['/n2c'].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables[stateVariables['/n2am'].activeChildren[0].componentName].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables[stateVariables['/n2bm'].activeChildren[0].componentName].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables[stateVariables['/n2cm'].activeChildren[0].componentName].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables['/n3'].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables['/n3a'].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables['/n3b'].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables['/n3c'].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables[stateVariables['/n3am'].activeChildren[0].componentName].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables[stateVariables['/n3bm'].activeChildren[0].componentName].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables[stateVariables['/n3cm'].activeChildren[0].componentName].stateValues.value).eq(0.000000000000005023481340324);

      expect(stateVariables['/n1aa'].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables['/n1ab'].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables[stateVariables['/n1aam'].activeChildren[0].componentName].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables[stateVariables['/n1abm'].activeChildren[0].componentName].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables['/n2aa'].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables['/n2ab'].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables[stateVariables['/n2aam'].activeChildren[0].componentName].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables[stateVariables['/n2abm'].activeChildren[0].componentName].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables['/n3aa'].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables['/n3ab'].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables[stateVariables['/n3aam'].activeChildren[0].componentName].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables[stateVariables['/n3abm'].activeChildren[0].componentName].stateValues.value).eq(0.000000000000005023481340324);

      expect(stateVariables['/n1ba'].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables['/n1bb'].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables[stateVariables['/n1bam'].activeChildren[0].componentName].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables[stateVariables['/n1bbm'].activeChildren[0].componentName].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables['/n2ba'].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables['/n2bb'].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables[stateVariables['/n2bam'].activeChildren[0].componentName].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables[stateVariables['/n2bbm'].activeChildren[0].componentName].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables['/n3ba'].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables['/n3bb'].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables[stateVariables['/n3bam'].activeChildren[0].componentName].stateValues.value).eq(0.000000000000005023481340324);
      expect(stateVariables[stateVariables['/n3bbm'].activeChildren[0].componentName].stateValues.value).eq(0.000000000000005023481340324);


    })
  })

  it('pad zeros with rounding', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="n1">22</number>
      <number name="n2">0.000000000000005</number>
      <copy target="n1" displayDigits='3' assignNames="n1a" />
      <copy target="n1" displayDigits='3' assignNames="n1apad" padZeros />
      <copy target="n1" displayDecimals='3' assignNames="n1b" />
      <copy target="n1" displayDecimals='3' assignNames="n1bpad" padZeros />
      <copy target="n1" displayDigits='3' displaySmallAsZero assignNames="n1c" />
      <copy target="n1" displayDigits='3' displaySmallAsZero assignNames="n1cpad" padZeros />
      <copy target="n2" displayDigits='3' assignNames="n2a" />
      <copy target="n2" displayDigits='3' assignNames="n2apad" padZeros />
      <copy target="n2" displayDecimals='3' assignNames="n2b" />
      <copy target="n2" displayDecimals='3' assignNames="n2bpad" padZeros />
      <copy target="n2" displayDigits='3' displaySmallAsZero assignNames="n2c" />
      <copy target="n2" displayDigits='3' displaySmallAsZero assignNames="n2cpad" padZeros />

      <m name="n1am">$n1a</m>
      <m name="n1apadm">$n1apad</m>
      <m name="n1bm">$n1b</m>
      <m name="n1bpadm">$n1bpad</m>
      <m name="n1cm">$n1c</m>
      <m name="n1cpadm">$n1cpad</m>
      <m name="n2am">$n2a</m>
      <m name="n2apadm">$n2apad</m>
      <m name="n2bm">$n2b</m>
      <m name="n2bpadm">$n2bpad</m>
      <m name="n2cm">$n2c</m>
      <m name="n2cpadm">$n2cpad</m>

      <number name="n1aNumber">$n1a</number>
      <number name="n1apadNumber">$n1apad</number>
      <number name="n1bNumber">$n1b</number>
      <number name="n1bpadNumber">$n1bpad</number>
      <number name="n1cNumber">$n1c</number>
      <number name="n1cpadNumber">$n1cpad</number>
      <number name="n2aNumber">$n2a</number>
      <number name="n2apadNumber">$n2apad</number>
      <number name="n2bNumber">$n2b</number>
      <number name="n2bpadNumber">$n2bpad</number>
      <number name="n2cNumber">$n2c</number>
      <number name="n2cpadNumber">$n2cpad</number>

      <math name="n1aMath">$n1a</math>
      <math name="n1apadMath">$n1apad</math>
      <math name="n1bMath">$n1b</math>
      <math name="n1bpadMath">$n1bpad</math>
      <math name="n1cMath">$n1c</math>
      <math name="n1cpadMath">$n1cpad</math>
      <math name="n2aMath">$n2a</math>
      <math name="n2apadMath">$n2apad</math>
      <math name="n2bMath">$n2b</math>
      <math name="n2bpadMath">$n2bpad</math>
      <math name="n2cMath">$n2c</math>
      <math name="n2cpadMath">$n2cpad</math>

      <copy prop="value" target="n1a" assignNames="n1aValue" />
      <copy prop="value" target="n1apad" assignNames="n1apadValue" />
      <copy prop="value" target="n1b" assignNames="n1bValue" />
      <copy prop="value" target="n1bpad" assignNames="n1bpadValue" />
      <copy prop="value" target="n1c" assignNames="n1cValue" />
      <copy prop="value" target="n1cpad" assignNames="n1cpadValue" />
      <copy prop="value" target="n2a" assignNames="n2aValue" />
      <copy prop="value" target="n2apad" assignNames="n2apadValue" />
      <copy prop="value" target="n2b" assignNames="n2bValue" />
      <copy prop="value" target="n2bpad" assignNames="n2bpadValue" />
      <copy prop="value" target="n2c" assignNames="n2cValue" />
      <copy prop="value" target="n2cpad" assignNames="n2cpadValue" />

      <copy prop="text" target="n1a" assignNames="n1aText" />
      <copy prop="text" target="n1apad" assignNames="n1apadText" />
      <copy prop="text" target="n1b" assignNames="n1bText" />
      <copy prop="text" target="n1bpad" assignNames="n1bpadText" />
      <copy prop="text" target="n1c" assignNames="n1cText" />
      <copy prop="text" target="n1cpad" assignNames="n1cpadText" />
      <copy prop="text" target="n2a" assignNames="n2aText" />
      <copy prop="text" target="n2apad" assignNames="n2apadText" />
      <copy prop="text" target="n2b" assignNames="n2bText" />
      <copy prop="text" target="n2bpad" assignNames="n2bpadText" />
      <copy prop="text" target="n2c" assignNames="n2cText" />
      <copy prop="text" target="n2cpad" assignNames="n2cpadText" />

      <copy prop="math" target="n1a" assignNames="n1aMath2" />
      <copy prop="math" target="n1apad" assignNames="n1apadMath2" />
      <copy prop="math" target="n1b" assignNames="n1bMath2" />
      <copy prop="math" target="n1bpad" assignNames="n1bpadMath2" />
      <copy prop="math" target="n1c" assignNames="n1cMath2" />
      <copy prop="math" target="n1cpad" assignNames="n1cpadMath2" />
      <copy prop="math" target="n2a" assignNames="n2aMath2" />
      <copy prop="math" target="n2apad" assignNames="n2apadMath2" />
      <copy prop="math" target="n2b" assignNames="n2bMath2" />
      <copy prop="math" target="n2bpad" assignNames="n2bpadMath2" />
      <copy prop="math" target="n2c" assignNames="n2cMath2" />
      <copy prop="math" target="n2cpad" assignNames="n2cpadMath2" />

    ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n1').should('have.text', '22')
    cy.get('#\\/n1a').should('have.text', '22')
    cy.get('#\\/n1apad').should('have.text', '22.0')
    cy.get('#\\/n1b').should('have.text', '22')
    cy.get('#\\/n1bpad').should('have.text', '22.000')
    cy.get('#\\/n1c').should('have.text', '22')
    cy.get('#\\/n1cpad').should('have.text', '22.0')
    cy.get('#\\/n2').should('have.text', '5 * 10^(-15)')
    cy.get('#\\/n2a').should('have.text', '5 * 10^(-15)')
    cy.get('#\\/n2apad').should('have.text', '5.00 * 10^(-15)')
    cy.get('#\\/n2b').should('have.text', '0')
    cy.get('#\\/n2bpad').should('have.text', '0.000')
    cy.get('#\\/n2c').should('have.text', '0')
    cy.get('#\\/n2cpad').should('have.text', '0.00')

    cy.get('#\\/n1am .mjx-mrow').eq(0).should('have.text', '22')
    cy.get('#\\/n1apadm .mjx-mrow').eq(0).should('have.text', '22.0')
    cy.get('#\\/n1bm .mjx-mrow').eq(0).should('have.text', '22')
    cy.get('#\\/n1bpadm .mjx-mrow').eq(0).should('have.text', '22.000')
    cy.get('#\\/n1cm .mjx-mrow').eq(0).should('have.text', '22')
    cy.get('#\\/n1cpadm .mjx-mrow').eq(0).should('have.text', '22.0')
    cy.get('#\\/n2am .mjx-mrow').eq(0).should('have.text', '5⋅10−15')
    cy.get('#\\/n2apadm .mjx-mrow').eq(0).should('have.text', '5.00⋅10−15')
    cy.get('#\\/n2bm .mjx-mrow').eq(0).should('have.text', '0')
    cy.get('#\\/n2bpadm .mjx-mrow').eq(0).should('have.text', '0.000')
    cy.get('#\\/n2cm .mjx-mrow').eq(0).should('have.text', '0')
    cy.get('#\\/n2cpadm .mjx-mrow').eq(0).should('have.text', '0.00')

    cy.get('#\\/n1aNumber').should('have.text', '22')
    cy.get('#\\/n1apadNumber').should('have.text', '22.0')
    cy.get('#\\/n1bNumber').should('have.text', '22')
    cy.get('#\\/n1bpadNumber').should('have.text', '22.000')
    cy.get('#\\/n1cNumber').should('have.text', '22')
    cy.get('#\\/n1cpadNumber').should('have.text', '22.0')
    cy.get('#\\/n2aNumber').should('have.text', '5 * 10^(-15)')
    cy.get('#\\/n2apadNumber').should('have.text', '5.00 * 10^(-15)')
    cy.get('#\\/n2bNumber').should('have.text', '0')
    cy.get('#\\/n2bpadNumber').should('have.text', '0.000')
    cy.get('#\\/n2cNumber').should('have.text', '0')
    cy.get('#\\/n2cpadNumber').should('have.text', '0.00')

    cy.get('#\\/n1aMath .mjx-mrow').eq(0).should('have.text', '22')
    cy.get('#\\/n1apadMath .mjx-mrow').eq(0).should('have.text', '22.0')
    cy.get('#\\/n1bMath .mjx-mrow').eq(0).should('have.text', '22')
    cy.get('#\\/n1bpadMath .mjx-mrow').eq(0).should('have.text', '22.000')
    cy.get('#\\/n1cMath .mjx-mrow').eq(0).should('have.text', '22')
    cy.get('#\\/n1cpadMath .mjx-mrow').eq(0).should('have.text', '22.0')
    cy.get('#\\/n2aMath .mjx-mrow').eq(0).should('have.text', '5⋅10−15')
    cy.get('#\\/n2apadMath .mjx-mrow').eq(0).should('have.text', '5.00⋅10−15')
    cy.get('#\\/n2bMath .mjx-mrow').eq(0).should('have.text', '0')
    cy.get('#\\/n2bpadMath .mjx-mrow').eq(0).should('have.text', '0.000')
    cy.get('#\\/n2cMath .mjx-mrow').eq(0).should('have.text', '0')
    cy.get('#\\/n2cpadMath .mjx-mrow').eq(0).should('have.text', '0.00')

    cy.get('#\\/n1aValue').should('have.text', '22')
    cy.get('#\\/n1apadValue').should('have.text', '22.0')
    cy.get('#\\/n1bValue').should('have.text', '22')
    cy.get('#\\/n1bpadValue').should('have.text', '22.000')
    cy.get('#\\/n1cValue').should('have.text', '22')
    cy.get('#\\/n1cpadValue').should('have.text', '22.0')
    cy.get('#\\/n2aValue').should('have.text', '5 * 10^(-15)')
    cy.get('#\\/n2apadValue').should('have.text', '5.00 * 10^(-15)')
    cy.get('#\\/n2bValue').should('have.text', '0')
    cy.get('#\\/n2bpadValue').should('have.text', '0.000')
    cy.get('#\\/n2cValue').should('have.text', '0')
    cy.get('#\\/n2cpadValue').should('have.text', '0.00')

    cy.get('#\\/n1aText').should('have.text', '22')
    cy.get('#\\/n1apadText').should('have.text', '22.0')
    cy.get('#\\/n1bText').should('have.text', '22')
    cy.get('#\\/n1bpadText').should('have.text', '22.000')
    cy.get('#\\/n1cText').should('have.text', '22')
    cy.get('#\\/n1cpadText').should('have.text', '22.0')
    cy.get('#\\/n2aText').should('have.text', '5 * 10^(-15)')
    cy.get('#\\/n2apadText').should('have.text', '5.00 * 10^(-15)')
    cy.get('#\\/n2bText').should('have.text', '0')
    cy.get('#\\/n2bpadText').should('have.text', '0.000')
    cy.get('#\\/n2cText').should('have.text', '0')
    cy.get('#\\/n2cpadText').should('have.text', '0.00')

    cy.get('#\\/n1aMath2 .mjx-mrow').eq(0).should('have.text', '22')
    cy.get('#\\/n1apadMath2 .mjx-mrow').eq(0).should('have.text', '22.0')
    cy.get('#\\/n1bMath2 .mjx-mrow').eq(0).should('have.text', '22')
    cy.get('#\\/n1bpadMath2 .mjx-mrow').eq(0).should('have.text', '22.000')
    cy.get('#\\/n1cMath2 .mjx-mrow').eq(0).should('have.text', '22')
    cy.get('#\\/n1cpadMath2 .mjx-mrow').eq(0).should('have.text', '22.0')
    cy.get('#\\/n2aMath2 .mjx-mrow').eq(0).should('have.text', '5⋅10−15')
    cy.get('#\\/n2apadMath2 .mjx-mrow').eq(0).should('have.text', '5.00⋅10−15')
    cy.get('#\\/n2bMath2 .mjx-mrow').eq(0).should('have.text', '0')
    cy.get('#\\/n2bpadMath2 .mjx-mrow').eq(0).should('have.text', '0.000')
    cy.get('#\\/n2cMath2 .mjx-mrow').eq(0).should('have.text', '0')
    cy.get('#\\/n2cpadMath2 .mjx-mrow').eq(0).should('have.text', '0.00')

  })

  it('dynamic rounding', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>Number: <number name="n">35203423.02352343201</number></p>
      <p>Number of digits: <mathinput name="ndigits" prefill="3" /></p>
      <p>Number of decimals: <mathinput name="ndecimals" prefill="3" /></p>
      <p><copy target="n" displayDigits='$ndigits' assignNames="na" /></p>
      <p><copy target="n" displayDecimals='$ndecimals' assignNames="nb" /></p>
    ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n').should('have.text', '35203423.02')
    cy.get('#\\/na').should('have.text', '35200000')
    cy.get('#\\/nb').should('have.text', '35203423.024')

    cy.log('higher precision')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}12{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}5{enter}", { force: true });
    cy.get('#\\/na').should('have.text', '35203423.0235')
    cy.get('#\\/nb').should('have.text', '35203423.02352')

    cy.log('invalid precision means default rounding')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}{backspace}x{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}{backspace}y{enter}", { force: true });
    cy.get('#\\/na').should('have.text', '35203423.02')
    cy.get('#\\/nb').should('have.text', '35203423.02')

    cy.log('low precision')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/na').should('have.text', '40000000')
    cy.get('#\\/nb').should('have.text', '35203423')


    cy.log('negative precision, default rounding for displayDigits')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.get('#\\/na').should('have.text', '35203423.02')
    cy.get('#\\/nb').should('have.text', '35203000')

  })

  it('infinity and nan', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="inf1">Infinity</number>
      <number name="inf2">Infinity+Infinity</number>
      <number name="inf3">1/0</number>
      <number name="inf4">-2/-0</number>
      <number name="inf5"><math>Infinity</math></number>
      <number name="inf6"><math>Infinity</math>+<math>Infinity</math></number>
      <number name="inf7"><math>5/0</math></number>
      <number name="inf8"><math>-6</math>/<math>-0</math></number>

      <number name="ninf1">-Infinity</number>
      <number name="ninf2">-3/0</number>
      <number name="ninf3">4/-0</number>
      <number name="ninf4"><math>-Infinity</math></number>
      <number name="ninf5"><math>-8/0</math></number>
      <number name="ninf6"><math>7</math>/<math>-0</math></number>

      <number name="nan1">Infinity-Infinity</number>
      <number name="nan2">Infinity/Infinity</number>
      <number name="nan3">0/0</number>
      <number name="nan4">-0/0</number>
      <number name="nan5"><math>-Infinity</math>+<math>Infinity</math></number>
      <number name="nan6"><math>Infinity/Infinity</math></number>
      <number name="nan7"><math>0/0</math></number>
      <number name="nan8"><math>0</math>/<math>-0</math></number>


    ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/inf1').should('have.text', '∞')
    cy.get('#\\/inf2').should('have.text', '∞')
    cy.get('#\\/inf3').should('have.text', '∞')
    cy.get('#\\/inf4').should('have.text', '∞')
    cy.get('#\\/inf5').should('have.text', '∞')
    cy.get('#\\/inf6').should('have.text', '∞')
    cy.get('#\\/inf7').should('have.text', '∞')
    cy.get('#\\/inf8').should('have.text', '∞')

    cy.get('#\\/ninf1').should('have.text', '-∞')
    cy.get('#\\/ninf2').should('have.text', '-∞')
    cy.get('#\\/ninf3').should('have.text', '-∞')
    cy.get('#\\/ninf4').should('have.text', '-∞')
    cy.get('#\\/ninf5').should('have.text', '-∞')
    cy.get('#\\/ninf6').should('have.text', '-∞')

    cy.get('#\\/nan1').should('have.text', 'NaN')
    cy.get('#\\/nan2').should('have.text', 'NaN')
    cy.get('#\\/nan3').should('have.text', 'NaN')
    cy.get('#\\/nan4').should('have.text', 'NaN')
    cy.get('#\\/nan5').should('have.text', 'NaN')
    cy.get('#\\/nan6').should('have.text', 'NaN')
    cy.get('#\\/nan7').should('have.text', 'NaN')
    cy.get('#\\/nan8').should('have.text', 'NaN')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/inf1'].stateValues.value).eq(Infinity);
      expect(stateVariables['/inf2'].stateValues.value).eq(Infinity);
      expect(stateVariables['/inf3'].stateValues.value).eq(Infinity);
      expect(stateVariables['/inf4'].stateValues.value).eq(Infinity);
      expect(stateVariables['/inf5'].stateValues.value).eq(Infinity);
      expect(stateVariables['/inf6'].stateValues.value).eq(Infinity);
      expect(stateVariables['/inf7'].stateValues.value).eq(Infinity);
      expect(stateVariables['/inf8'].stateValues.value).eq(Infinity);


      expect(stateVariables['/ninf1'].stateValues.value).eq(-Infinity);
      expect(stateVariables['/ninf2'].stateValues.value).eq(-Infinity);
      expect(stateVariables['/ninf3'].stateValues.value).eq(-Infinity);
      expect(stateVariables['/ninf4'].stateValues.value).eq(-Infinity);
      expect(stateVariables['/ninf5'].stateValues.value).eq(-Infinity);
      expect(stateVariables['/ninf6'].stateValues.value).eq(-Infinity);

      expect(stateVariables['/nan1'].stateValues.value).eqls(NaN);
      expect(stateVariables['/nan2'].stateValues.value).eqls(NaN);
      expect(stateVariables['/nan3'].stateValues.value).eqls(NaN);
      expect(stateVariables['/nan4'].stateValues.value).eqls(NaN);
      expect(stateVariables['/nan5'].stateValues.value).eqls(NaN);
      expect(stateVariables['/nan6'].stateValues.value).eqls(NaN);
      expect(stateVariables['/nan7'].stateValues.value).eqls(NaN);
      expect(stateVariables['/nan8'].stateValues.value).eqls(NaN);

    })
  })

  it('copy value prop copies attributes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><number name="n1" displayDigits="3">8.5203845251</number>
  <copy target="n1" prop="value" assignNames="n1a" />
  <copy target="n1" prop="value" displayDigits="5" assignNames="n1b" />
  <copy target="n1" prop="value" link="false" assignNames="n1c" />
  <copy target="n1" prop="value" link="false" displayDigits="5" assignNames="n1d" />
  </p>

  <p><number name="n2" displayDecimals="4">8.5203845251</number>
  <copy target="n2" prop="value" assignNames="n2a" />
  <copy target="n2" prop="value" displayDecimals="6" assignNames="n2b" />
  <copy target="n2" prop="value" link="false" assignNames="n2c" />
  <copy target="n2" prop="value" link="false" displayDecimals="6" assignNames="n2d" />
  </p>

  <p><number name="n3" displaySmallAsZero>0.000000000000000015382487</number>
  <copy target="n3" prop="value" assignNames="n3a" />
  <copy target="n3" prop="value" displaySmallAsZero="false" assignNames="n3b" />
  <copy target="n3" prop="value" link="false" assignNames="n3c" />
  <copy target="n3" prop="value" link="false" displaySmallAsZero="false" assignNames="n3d" />
  </p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n1').should('have.text', '8.52');
    cy.get('#\\/n1a').should('have.text', '8.52');
    cy.get('#\\/n1b').should('have.text', '8.5204');
    cy.get('#\\/n1c').should('have.text', '8.52');
    cy.get('#\\/n1d').should('have.text', '8.5204');

    cy.get('#\\/n2').should('have.text', '8.5204');
    cy.get('#\\/n2a').should('have.text', '8.5204');
    cy.get('#\\/n2b').should('have.text', '8.520385');
    cy.get('#\\/n2c').should('have.text', '8.5204');
    cy.get('#\\/n2d').should('have.text', '8.520385');

    cy.get('#\\/n3').should('have.text', '0');
    cy.get('#\\/n3a').should('have.text', '0');
    cy.get('#\\/n3b').should('have.text', '1.5382487 * 10^(-17)');
    cy.get('#\\/n3c').should('have.text', '0');
    cy.get('#\\/n3d').should('have.text', '1.5382487 * 10^(-17)');


  });

  it('display rounding preserved when only one number or math child', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><number name="m1"><math displayDigits="3">8.5203845251</math></number>
    <number name="m1a"><number displayDigits="3">8.5203845251</number></number>
    <number name="m1b"><math displayDigits="3">8.5203845251</math>2.8392634947</number>
    <number name="m1c"><number displayDigits="3">8.5203845251</number>2.8392634947</number>
    <number name="m1d"><math displayDigits="3">8.5203845251</math><math displayDigits="3">2.8392634947</math></number>
    <number name="m1e"><number displayDigits="3">8.5203845251</number><math displayDigits="3">2.8392634947</math></number>
    <number name="m1f" displayDigits="6"><math displayDigits="3">8.5203845251</math></number>
    <number name="m1g" displayDecimals="8"><math displayDigits="3">8.5203845251</math></number>
  </p>

  <p><number name="m2"><math displayDecimals="4">8.5203845251</math></number>
    <number name="m2a"><number displayDecimals="4">8.5203845251</number></number>
    <number name="m2b"><math displayDecimals="4">8.5203845251</math>2.8392634947</number>
    <number name="m2c"><number displayDecimals="4">8.5203845251</number>2.8392634947</number>
    <number name="m2d"><math displayDecimals="4">8.5203845251</math><math displayDecimals="4">2.8392634947</math></number>
    <number name="m2e"><number displayDecimals="4">8.5203845251</number><math displayDecimals="4">2.8392634947</math></number>
    <number name="m2f" displayDecimals="6"><math displayDecimals="4">8.5203845251</math></number>
    <number name="m2g" displayDigits="8"><math displayDecimals="4">8.5203845251</math></number>
  </p>

  <p><number name="m3"><math displaySmallAsZero>0.000000000000000015382487</math></number>
    <number name="m3a"><number displaySmallAsZero>0.000000000000000015382487</number></number>
    <number name="m3b"><math displaySmallAsZero>0.000000000000000015382487</math>2.8392634947</number>
    <number name="m3c"><number displaySmallAsZero>0.000000000000000015382487</number>2.8392634947</number>
    <number name="m3d"><math displaySmallAsZero>0.000000000000000015382487</math><math displaySmallAsZero>2.8392634947</math></number>
    <number name="m3e"><number displaySmallAsZero>0.000000000000000015382487</number><math displaySmallAsZero>2.8392634947</math></number>
    <number name="m3f" displaySmallAsZero="false"><math displaySmallAsZero>0.000000000000000015382487</math></number>
  </p>

  <p><number name="m4"><math displayDigits="3" padZeros>8</math></number>
    <number name="m4a"><number displayDigits="3" padZeros>8</number></number>
    <number name="m4b"><math displayDigits="3" padZeros>8</math>2</number>
    <number name="m4c"><number displayDigits="3" padZeros>8</number>2</number>
    <number name="m4d"><math displayDigits="3" padZeros>8</math><math displayDigits="3" padZeros>2</math></number>
    <number name="m4e"><number displayDigits="3" padZeros>8</number><math displayDigits="3" padZeros>2</math></number>
    <number name="m4f" padZeros="false"><math displayDigits="3" padZeros>8</math></number>
  </p>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/m1').should('have.text', '8.52');
    cy.get('#\\/m1a').should('have.text', '8.52');
    cy.get('#\\/m1b').should('have.text', '24.19161674');
    cy.get('#\\/m1c').should('have.text', '24.19161674');
    cy.get('#\\/m1d').should('have.text', '24.19161674');
    cy.get('#\\/m1e').should('have.text', '24.19161674');
    cy.get('#\\/m1f').should('have.text', '8.52038');
    cy.get('#\\/m1g').should('have.text', '8.52038453');

    cy.get('#\\/m2').should('have.text', '8.5204');
    cy.get('#\\/m2a').should('have.text', '8.5204');
    cy.get('#\\/m2b').should('have.text', '24.19161674');
    cy.get('#\\/m2c').should('have.text', '24.19161674');
    cy.get('#\\/m2d').should('have.text', '24.19161674');
    cy.get('#\\/m2e').should('have.text', '24.19161674');
    cy.get('#\\/m2f').should('have.text', '8.520385');
    cy.get('#\\/m2g').should('have.text', '8.5203845');

    cy.get('#\\/m3').should('have.text', '0');
    cy.get('#\\/m3a').should('have.text', '0');
    cy.get('#\\/m3b').should('have.text', '4.36749338 * 10^(-17)');
    cy.get('#\\/m3c').should('have.text', '4.36749338 * 10^(-17)');
    cy.get('#\\/m3d').should('have.text', '4.36749338 * 10^(-17)');
    cy.get('#\\/m3e').should('have.text', '4.36749338 * 10^(-17)');
    cy.get('#\\/m3f').should('have.text', '1.5382487 * 10^(-17)');

    cy.get('#\\/m4').should('have.text', '8.00');
    cy.get('#\\/m4a').should('have.text', '8.00');
    cy.get('#\\/m4b').should('have.text', '16');
    cy.get('#\\/m4c').should('have.text', '16');
    cy.get('#\\/m4d').should('have.text', '16');
    cy.get('#\\/m4e').should('have.text', '16');
    cy.get('#\\/m4f').should('have.text', '8');

  });

  it('value on NaN', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  
  <p>
    <mathinput name="mi1" />
    <number name="n1">$mi1</number>
  </p>
  
  <p>
    <mathinput name="mi2" />
    <number name="n2" valueOnNaN="3">$mi2</number>
  </p>

  <p>
    <mathinput name="mi3" bindValueTo="$n3" hideNaN="false" />
    <number name="n3" />
  </p>

  <p>
    <mathinput name="mi4" bindValueTo="$n4" />
    <number name="n4" valueOnNan="5" />
  </p>


  <p>
    <mathinput name="mi1a" />
    <number name="n1a"><number>$mi1a</number></number>
  </p>
  
  <p>
    <mathinput name="mi2a" />
    <number name="n2a" valueOnNaN="3"><number>$mi2a</number></number>
  </p>
  
  <p>
    <mathinput name="mi2b" />
    <number name="n2b"><number valueOnNaN="3">$mi2b</number></number>
  </p>

  <p>
    <mathinput name="mi3a" bindValueTo="$n3a" />
    <number name="n3a"><number /></number>
  </p>

  <p>
    <mathinput name="mi4a" bindValueTo="$n4a" />
    <number name="n4a" valueOnNan="5"><number/></number>
  </p>

  <p>
    <mathinput name="mi4b" bindValueTo="$n4b" />
    <number name="n4b"><number valueOnNan="5"/></number>
  </p>


  <p>
    <number name="n5">8/</number>
    <number name="n6" valueOnNan="7">8/</number>
  </p>

  <p>
    <boolean name="b" hide />
    <number name="n7" convertBoolean>$b>y</number>
    <number name="n8" convertBoolean valueOnNaN="9">$b>y</number>
  </p>

  <p>
    <number name="n9">x>y</number>
    <number name="n10" valueOnNaN="-9">x>y</number>
  </p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get('#\\/n1').should('have.text', 'NaN');

    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get('#\\/n2').should('have.text', '3');

    cy.get(`#\\/mi3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('NaN')
    })
    cy.get('#\\/n3').should('have.text', 'NaN');

    cy.get(`#\\/mi4 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get('#\\/n4').should('have.text', '5');


    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get('#\\/n1a').should('have.text', 'NaN');

    cy.get(`#\\/mi2a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get('#\\/n2a').should('have.text', '3');

    cy.get(`#\\/mi3a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get('#\\/n3a').should('have.text', 'NaN');

    cy.get(`#\\/mi4a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get('#\\/n4a').should('have.text', '5');


    cy.get(`#\\/mi2b .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get('#\\/n2b').should('have.text', '3');

    cy.get(`#\\/mi4b .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get('#\\/n4b').should('have.text', '5');



    cy.get('#\\/n5').should('have.text', 'NaN');
    cy.get('#\\/n6').should('have.text', '7');

    cy.get('#\\/n7').should('have.text', 'NaN');
    cy.get('#\\/n8').should('have.text', '9');

    cy.get('#\\/n9').should('have.text', 'NaN');
    cy.get('#\\/n10').should('have.text', '-9');


    cy.get('#\\/mi1 textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}", { force: true })
    cy.get('#\\/mi2 textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}", { force: true })
    cy.get('#\\/mi3 textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}", { force: true })
    cy.get('#\\/mi4 textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}", { force: true })

    cy.get('#\\/mi1a textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}", { force: true })
    cy.get('#\\/mi2a textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}", { force: true })
    cy.get('#\\/mi3a textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}", { force: true })
    cy.get('#\\/mi4a textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}", { force: true })

    cy.get('#\\/mi2b textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}", { force: true })
    cy.get('#\\/mi4b textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}", { force: true })

    cy.get(`#\\/mi4b .mq-editable-field`).should('contain.text', '0.75')

    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('34')
    })
    cy.get('#\\/n1').should('have.text', '0.75');

    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('34')
    })
    cy.get('#\\/n2').should('have.text', '0.75');

    cy.get(`#\\/mi3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0.75')
    })
    cy.get('#\\/n3').should('have.text', '0.75');

    cy.get(`#\\/mi4 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0.75')
    })
    cy.get('#\\/n4').should('have.text', '0.75');


    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('34')
    })
    cy.get('#\\/n1a').should('have.text', '0.75');

    cy.get(`#\\/mi2a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('34')
    })
    cy.get('#\\/n2a').should('have.text', '0.75');

    cy.get(`#\\/mi3a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0.75')
    })
    cy.get('#\\/n3a').should('have.text', '0.75');

    cy.get(`#\\/mi4a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0.75')
    })
    cy.get('#\\/n4a').should('have.text', '0.75');


    cy.get(`#\\/mi2b .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('34')
    })
    cy.get('#\\/n2b').should('have.text', '0.75');

    cy.get(`#\\/mi4b .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0.75')
    })
    cy.get('#\\/n4b').should('have.text', '0.75');



    cy.get('#\\/mi1 textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}x{enter}", { force: true })
    cy.get('#\\/mi2 textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}x{enter}", { force: true })
    cy.get('#\\/mi3 textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}x{enter}", { force: true })
    cy.get('#\\/mi4 textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}x{enter}", { force: true })

    cy.get('#\\/mi1a textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}x{enter}", { force: true })
    cy.get('#\\/mi2a textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}x{enter}", { force: true })
    cy.get('#\\/mi3a textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}x{enter}", { force: true })
    cy.get('#\\/mi4a textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}x{enter}", { force: true })

    cy.get('#\\/mi2b textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}x{enter}", { force: true })
    cy.get('#\\/mi4b textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}x{enter}", { force: true })

    cy.get(`#\\/mi4b .mq-editable-field`).should('contain.text', '5')

    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get('#\\/n1').should('have.text', 'NaN');

    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get('#\\/n2').should('have.text', '3');

    cy.get(`#\\/mi3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('NaN')
    })
    cy.get('#\\/n3').should('have.text', 'NaN');

    cy.get(`#\\/mi4 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get('#\\/n4').should('have.text', '5');


    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get('#\\/n1a').should('have.text', 'NaN');

    cy.get(`#\\/mi2a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get('#\\/n2a').should('have.text', '3');

    cy.get(`#\\/mi3a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get('#\\/n3a').should('have.text', 'NaN');

    cy.get(`#\\/mi4a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get('#\\/n4a').should('have.text', '5');


    cy.get(`#\\/mi2b .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get('#\\/n2b').should('have.text', '3');

    cy.get(`#\\/mi4b .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get('#\\/n4b').should('have.text', '5');

  });

  it('indeterminant forms give NaN', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  
  <p><number name="if1">0^0</number></p>
  <p><number name="if2">Infinity^0</number></p>
  <p><number name="if3">0/0</number></p>
  <p><number name="if4">Infinity/Infinity</number></p>
  <p><number name="if5">0*Infinity</number></p>
  <p><number name="if6">Infinity-Infinity</number></p>
  <p><number name="if7">1^Infinity</number></p>
  <p><number name="ifalt"><number>0^0</number>^0</number></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/if1').should('have.text', 'NaN');
    cy.get('#\\/if2').should('have.text', 'NaN');
    cy.get('#\\/if3').should('have.text', 'NaN');
    cy.get('#\\/if4').should('have.text', 'NaN');
    cy.get('#\\/if5').should('have.text', 'NaN');
    cy.get('#\\/if6').should('have.text', 'NaN');
    cy.get('#\\/if7').should('have.text', 'NaN');
    cy.get('#\\/ifalt').should('have.text', 'NaN');


  });

  it('complex numbers', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  
  <p><number name="i1">i</number></p>
  <p><math name="i1a">$i1</math></p>
  <p><number name="i2" displaySmallAsZero>sqrt(-1)</number></p>
  <p><number name="i3" displaySmallAsZero>exp(pi i/2)</number></p>
  <p><number name="i4">$ni1^3</number></p>
  <p><number name="i5">$ni2^3</number></p>
  <p><number name="i6" displaySmallAsZero>$ni3^3</number></p>
  <p><number name="i7">1/-i</number></p>
  <p><number name="i8" displaySmallAsZero>1/$ni4</number></p>
  <p><number name="i9">1/$ni5</number></p>
  <p><number name="i10" displaySmallAsZero>1/$ni6</number></p>
  <p><number name="i11">0+i</number></p>
  <p><number name="i12">1i</number></p>

  <p><number name="ni1">-i</number></p>
  <p><math name="ni1a">$ni1</math></p>
  <p><number name="ni2">i^3</number></p>
  <p><number name="ni3" displaySmallAsZero>(-1)^(3/2)</number></p>
  <p><number name="ni4" displaySmallAsZero>exp(3 pi i/2)</number></p>
  <p><number name="ni5">$i1^3</number></p>
  <p><number name="ni6" displaySmallAsZero>$i2^3</number></p>
  <p><number name="ni7" displaySmallAsZero>$i3^3</number></p>
  <p><number name="ni8">1/i</number></p>
  <p><number name="ni9">1/$i4</number></p>
  <p><number name="ni10">1/$i5</number></p>
  <p><number name="ni11" displaySmallAsZero>1/$i6</number></p>
  <p><number name="ni12">0-i</number></p>
  <p><number name="ni13">-1i</number></p>

  <p><number name="c1">2+3i</number></p>
  <p><number name="c2"><math>2+3i</math></number></p>
  <p><number name="c3">(2+3i)/(3+i)</number></p>
  <p><number name="c4"><math>2+3i</math>/<number>3+i</number></number></p>
  <p><number name="c5">Infinity i</number></p>
  <p><number name="c6"><math format="latex">\\infty i</math></number></p>
  <p><number name="c7">5+0i</number></p>
  <p><number name="c8"><math>5+0i</math></number></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/i1').should('have.text', 'i');
    cy.get('#\\/i1a .mjx-mrow').eq(0).should('have.text', 'i');
    cy.get('#\\/i2').should('have.text', 'i');
    cy.get('#\\/i3').should('have.text', 'i');
    cy.get('#\\/i4').should('have.text', 'i');
    cy.get('#\\/i5').should('have.text', 'i');
    cy.get('#\\/i6').should('have.text', 'i');
    cy.get('#\\/i7').should('have.text', 'i');
    cy.get('#\\/i8').should('have.text', 'i');
    cy.get('#\\/i9').should('have.text', 'i');
    cy.get('#\\/i10').should('have.text', 'i');
    cy.get('#\\/i11').should('have.text', 'i');
    cy.get('#\\/i12').should('have.text', 'i');


    cy.get('#\\/ni1').should('have.text', '-i');
    cy.get('#\\/ni1a .mjx-mrow').eq(0).should('have.text', '−i');
    cy.get('#\\/ni2').should('have.text', '-i');
    cy.get('#\\/ni3').should('have.text', '-i');
    cy.get('#\\/ni4').should('have.text', '-i');
    cy.get('#\\/ni5').should('have.text', '-i');
    cy.get('#\\/ni6').should('have.text', '-i');
    cy.get('#\\/ni7').should('have.text', '-i');
    cy.get('#\\/ni8').should('have.text', '-i');
    cy.get('#\\/ni9').should('have.text', '-i');
    cy.get('#\\/ni10').should('have.text', '-i');
    cy.get('#\\/ni11').should('have.text', '-i');
    cy.get('#\\/ni12').should('have.text', '-i');
    cy.get('#\\/ni13').should('have.text', '-i');

    cy.get('#\\/c1').should('have.text', '2 + 3 i');
    cy.get('#\\/c2').should('have.text', '2 + 3 i');
    cy.get('#\\/c3').should('have.text', '0.9 + 0.7 i');
    cy.get('#\\/c4').should('have.text', '0.9 + 0.7 i');
    cy.get('#\\/c5').should('have.text', 'NaN + NaN i');
    cy.get('#\\/c6').should('have.text', 'NaN + NaN i');
    cy.get('#\\/c7').should('have.text', '5');
    cy.get('#\\/c8').should('have.text', '5');



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/i1'].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables['/i1a'].stateValues.value).eqls("i");
      expect(stateVariables['/i2'].stateValues.value.re).closeTo(0, 1E-14);
      expect(stateVariables['/i2'].stateValues.value.im).eq(1);
      expect(stateVariables['/i3'].stateValues.value.re).closeTo(0, 1E-14);
      expect(stateVariables['/i3'].stateValues.value.im).eq(1);
      expect(stateVariables['/i4'].stateValues.value.re).eq(0)
      expect(stateVariables['/i4'].stateValues.value.im).eq(1);
      expect(stateVariables['/i5'].stateValues.value.re).eq(0)
      expect(stateVariables['/i5'].stateValues.value.im).eq(1);
      expect(stateVariables['/i6'].stateValues.value.re).closeTo(0, 1E-14);
      expect(stateVariables['/i6'].stateValues.value.im).eq(1);
      expect(stateVariables['/i7'].stateValues.value.re).eq(0)
      expect(stateVariables['/i7'].stateValues.value.im).eq(1);
      expect(stateVariables['/i8'].stateValues.value.re).closeTo(0, 1E-14);
      expect(stateVariables['/i8'].stateValues.value.im).eq(1);
      expect(stateVariables['/i9'].stateValues.value.re).eq(0)
      expect(stateVariables['/i9'].stateValues.value.im).eq(1);
      expect(stateVariables['/i10'].stateValues.value.re).closeTo(0, 1E-14);
      expect(stateVariables['/i10'].stateValues.value.im).eq(1);
      expect(stateVariables['/i11'].stateValues.value.re).eq(0)
      expect(stateVariables['/i11'].stateValues.value.im).eq(1);
      expect(stateVariables['/i12'].stateValues.value.re).eq(0)
      expect(stateVariables['/i12'].stateValues.value.im).eq(1);


      expect(stateVariables['/ni1'].stateValues.value.re).eq(0)
      expect(stateVariables['/ni1'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni1a'].stateValues.value).eqls(["-", "i"]);
      expect(stateVariables['/ni2'].stateValues.value.re).eq(0)
      expect(stateVariables['/ni2'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni3'].stateValues.value.re).closeTo(0, 1E-14);
      expect(stateVariables['/ni3'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni4'].stateValues.value.re).closeTo(0, 1E-14);
      expect(stateVariables['/ni4'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni5'].stateValues.value.re).eq(0)
      expect(stateVariables['/ni5'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni6'].stateValues.value.re).closeTo(0, 1E-14);
      expect(stateVariables['/ni6'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni7'].stateValues.value.re).closeTo(0, 1E-14);
      expect(stateVariables['/ni7'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni8'].stateValues.value.re).eq(0)
      expect(stateVariables['/ni8'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni9'].stateValues.value.re).eq(0)
      expect(stateVariables['/ni9'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni10'].stateValues.value.re).eq(0)
      expect(stateVariables['/ni10'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni11'].stateValues.value.re).closeTo(0, 1E-14);
      expect(stateVariables['/ni11'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni12'].stateValues.value.re).eq(0)
      expect(stateVariables['/ni12'].stateValues.value.im).eq(-1);
      expect(stateVariables['/ni13'].stateValues.value.re).eq(0)
      expect(stateVariables['/ni13'].stateValues.value.im).eq(-1);


      expect(stateVariables['/c1'].stateValues.value.re).eq(2)
      expect(stateVariables['/c1'].stateValues.value.im).eq(3);
      expect(stateVariables['/c2'].stateValues.value.re).eq(2)
      expect(stateVariables['/c2'].stateValues.value.im).eq(3);
      expect(stateVariables['/c3'].stateValues.value.re).closeTo(0.9, 1E-14)
      expect(stateVariables['/c3'].stateValues.value.im).closeTo(0.7, 1E-14);
      expect(stateVariables['/c4'].stateValues.value.re).closeTo(0.9, 1E-14)
      expect(stateVariables['/c4'].stateValues.value.im).closeTo(0.7, 1E-14);
      expect(stateVariables['/c5'].stateValues.value.re).eqls(NaN)
      expect(stateVariables['/c5'].stateValues.value.im).eqls(NaN);
      expect(stateVariables['/c6'].stateValues.value.re).eqls(NaN)
      expect(stateVariables['/c6'].stateValues.value.im).eqls(NaN);
      expect(stateVariables['/c7'].stateValues.value).eq(5);
      expect(stateVariables['/c8'].stateValues.value).eq(5);
    })

  });

  it('complex numbers and inverse definition', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><number name="n1">1</number> <mathinput bindValueto="$n1" name="mi1" /></p>
  <p><number name="n2"><number>1</number></number> <mathinput bindValueto="$n2" name="mi2" /></p>
  <p><number name="n3"></number> <mathinput bindValueto="$n3" name="mi3" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n1').should('have.text', '1');
    cy.get('#\\/n2').should('have.text', '1');
    cy.get('#\\/n3').should('have.text', 'NaN');

    cy.get(`#\\/mi1 .mq-editable-field`).should('have.text', "1")
    cy.get(`#\\/mi2 .mq-editable-field`).should('have.text', "1")
    cy.get(`#\\/mi3 .mq-editable-field`).should('have.text', "")


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n1'].stateValues.value).eqls(1);
      expect(stateVariables['/n2'].stateValues.value).eqls(1);
      expect(stateVariables['/n3'].stateValues.value).eqls(NaN);
      expect(stateVariables['/mi1'].stateValues.value).eqls(1);
      expect(stateVariables['/mi2'].stateValues.value).eqls(1);
      expect(stateVariables['/mi3'].stateValues.value).eqls(NaN);

    })

    cy.get('#\\/mi1 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi2 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi3 textarea').type("{end}{backspace}i{enter}", { force: true }).blur()

    cy.get('#\\/n1').should('have.text', 'i');
    cy.get('#\\/n2').should('have.text', 'i');
    cy.get('#\\/n3').should('have.text', 'i');

    cy.get(`#\\/mi1 .mq-editable-field`).should('have.text', "i")
    cy.get(`#\\/mi2 .mq-editable-field`).should('have.text', "i")
    cy.get(`#\\/mi3 .mq-editable-field`).should('have.text', "i")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n1'].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables['/n2'].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables['/n3'].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables['/mi1'].stateValues.value).eqls("i");
      expect(stateVariables['/mi2'].stateValues.value).eqls("i");
      expect(stateVariables['/mi3'].stateValues.value).eqls("i");

    })


    cy.get('#\\/mi1 textarea').type("{end}+2{enter}", { force: true })
    cy.get('#\\/mi2 textarea').type("{end}+2{enter}", { force: true })
    cy.get('#\\/mi3 textarea').type("{end}+2{enter}", { force: true }).blur()

    cy.get('#\\/n1').should('have.text', '2 + i');
    cy.get('#\\/n2').should('have.text', '2 + i');
    cy.get('#\\/n3').should('have.text', '2 + i');

    cy.get(`#\\/mi1 .mq-editable-field`).should('have.text', "2+i")
    cy.get(`#\\/mi2 .mq-editable-field`).should('have.text', "2+i")
    cy.get(`#\\/mi3 .mq-editable-field`).should('have.text', "2+i")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n1'].stateValues.value.re).eq(2)
      expect(stateVariables['/n1'].stateValues.value.im).eq(1)
      expect(stateVariables['/n2'].stateValues.value.re).eq(2)
      expect(stateVariables['/n2'].stateValues.value.im).eq(1)
      expect(stateVariables['/n3'].stateValues.value.re).eq(2)
      expect(stateVariables['/n3'].stateValues.value.im).eq(1)
      expect(stateVariables['/mi1'].stateValues.value).eqls(["+", 2, "i"]);
      expect(stateVariables['/mi2'].stateValues.value).eqls(["+", 2, "i"]);
      expect(stateVariables['/mi3'].stateValues.value).eqls(["+", 2, "i"]);

    })


    cy.get('#\\/mi1 textarea').type("{end}{backspace}{backspace}{backspace}3+0i{enter}", { force: true })
    cy.get('#\\/mi2 textarea').type("{end}{backspace}{backspace}{backspace}3+0i{enter}", { force: true })
    cy.get('#\\/mi3 textarea').type("{end}{backspace}{backspace}{backspace}3+0i{enter}", { force: true }).blur()

    cy.get('#\\/n1').should('have.text', '3');
    cy.get('#\\/n2').should('have.text', '3');
    cy.get('#\\/n3').should('have.text', '3');

    cy.get(`#\\/mi1 .mq-editable-field`).should('have.text', "3")
    cy.get(`#\\/mi2 .mq-editable-field`).should('have.text', "3")
    cy.get(`#\\/mi3 .mq-editable-field`).should('have.text', "3")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n1'].stateValues.value).eq(3)
      expect(stateVariables['/n2'].stateValues.value).eq(3)
      expect(stateVariables['/n3'].stateValues.value).eq(3)
      expect(stateVariables['/mi1'].stateValues.value).eqls(3);
      expect(stateVariables['/mi2'].stateValues.value).eqls(3);
      expect(stateVariables['/mi3'].stateValues.value).eqls(3);

    })


    cy.get('#\\/mi1 textarea').type("{end}{backspace}1i{enter}", { force: true })
    cy.get('#\\/mi2 textarea').type("{end}{backspace}1i{enter}", { force: true })
    cy.get('#\\/mi3 textarea').type("{end}{backspace}1i{enter}", { force: true }).blur()

    cy.get('#\\/n1').should('have.text', 'i');
    cy.get('#\\/n2').should('have.text', 'i');
    cy.get('#\\/n3').should('have.text', 'i');

    cy.get(`#\\/mi1 .mq-editable-field`).should('have.text', "i")
    cy.get(`#\\/mi2 .mq-editable-field`).should('have.text', "i")
    cy.get(`#\\/mi3 .mq-editable-field`).should('have.text', "i")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n1'].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables['/n2'].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables['/n3'].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables['/mi1'].stateValues.value).eqls("i");
      expect(stateVariables['/mi2'].stateValues.value).eqls("i");
      expect(stateVariables['/mi3'].stateValues.value).eqls("i");

    })


    cy.get('#\\/mi1 textarea').type("{end}{backspace}-1i+0{enter}", { force: true })
    cy.get('#\\/mi2 textarea').type("{end}{backspace}-1i+0{enter}", { force: true })
    cy.get('#\\/mi3 textarea').type("{end}{backspace}-1i+0{enter}", { force: true }).blur()

    cy.get('#\\/n1').should('have.text', '-i');
    cy.get('#\\/n2').should('have.text', '-i');
    cy.get('#\\/n3').should('have.text', '-i');

    cy.get(`#\\/mi1 .mq-editable-field`).should('have.text', "−i")
    cy.get(`#\\/mi2 .mq-editable-field`).should('have.text', "−i")
    cy.get(`#\\/mi3 .mq-editable-field`).should('have.text', "−i")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n1'].stateValues.value.re).eq(0)
      expect(stateVariables['/n1'].stateValues.value.im).eq(-1)
      expect(stateVariables['/n2'].stateValues.value.re).eq(0)
      expect(stateVariables['/n2'].stateValues.value.im).eq(-1)
      expect(stateVariables['/n3'].stateValues.value.re).eq(0)
      expect(stateVariables['/n3'].stateValues.value.im).eq(-1)
      expect(stateVariables['/mi1'].stateValues.value).eqls(['-', "i"]);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['-', "i"]);
      expect(stateVariables['/mi3'].stateValues.value).eqls(['-', "i"]);

    })


  });

  it('complex numbers, re and im', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  
  <p><number name="n1">re(2-4i)</number></p>
  <p><number name="n2">im(2-4i)</number></p>
  <p><number name="n3">re((2-4i)(3-i))</number></p>
  <p><number name="n4">im((2-4i)(3-i))</number></p>
  <p><number name="n1a"><math>re(2-4i)</math></number></p>
  <p><number name="n2a"><math>im(2-4i)</math></number></p>
  <p><number name="n3a"><math>re((2-4i)(3-i))</math></number></p>
  <p><number name="n4a"><math>im((2-4i)(3-i))</math></number></p>
  <p><number name="n1b"><math format="latex">\\Re(2-4i)</math></number></p>
  <p><number name="n2b"><math format="latex">\\Im(2-4i)</math></number></p>
  <p><number name="n3b"><math format="latex">\\Re((2-4i)(3-i))</math></number></p>
  <p><number name="n4b"><math format="latex">\\Im((2-4i)(3-i))</math></number></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n1').should('have.text', '2');
    cy.get('#\\/n2').should('have.text', '-4');
    cy.get('#\\/n3').should('have.text', '2');
    cy.get('#\\/n4').should('have.text', '-14');
    cy.get('#\\/n1a').should('have.text', '2');
    cy.get('#\\/n2a').should('have.text', '-4');
    cy.get('#\\/n3a').should('have.text', '2');
    cy.get('#\\/n4a').should('have.text', '-14');
    cy.get('#\\/n1b').should('have.text', '2');
    cy.get('#\\/n2b').should('have.text', '-4');
    cy.get('#\\/n3b').should('have.text', '2');
    cy.get('#\\/n4b').should('have.text', '-14');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n1'].stateValues.value).eq(2);
      expect(stateVariables['/n2'].stateValues.value).eq(-4);
      expect(stateVariables['/n3'].stateValues.value).eq(2);
      expect(stateVariables['/n4'].stateValues.value).eq(-14);
      expect(stateVariables['/n1a'].stateValues.value).eq(2);
      expect(stateVariables['/n2a'].stateValues.value).eq(-4);
      expect(stateVariables['/n3a'].stateValues.value).eq(2);
      expect(stateVariables['/n4a'].stateValues.value).eq(-14);
      expect(stateVariables['/n1b'].stateValues.value).eq(2);
      expect(stateVariables['/n2b'].stateValues.value).eq(-4);
      expect(stateVariables['/n3b'].stateValues.value).eq(2);
      expect(stateVariables['/n4b'].stateValues.value).eq(-14);
    })

  });


});