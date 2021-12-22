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
    cy.visit('/cypressTest')
  })

  it('1+1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <copy target="_number1" />
      <number>1+1</number>
    ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let number0 = components['/_copy1'].replacements[0];
      let number0Anchor = cesc('#' + number0.componentName);

      cy.log('Test value displayed in browser')
      cy.get(number0Anchor).should('have.text', '2')
      cy.get('#\\/_number1').should('have.text', '2')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(number0.stateValues.value).eq(2);
        expect(components['/_number1'].stateValues.value).eq(2);
      })
    })
  })

  it(`number that isn't a number`, () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <copy target="_number1" />
      <number>x+1</number>
      ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let number0 = components['/_copy1'].replacements[0];
      let number0Anchor = cesc('#' + number0.componentName);

      cy.log('Test value displayed in browser')
      cy.get(number0Anchor).should('have.text', 'NaN')
      cy.get('#\\/_number1').should('have.text', 'NaN')


      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        assert.isNaN(number0.stateValues.value);
        assert.isNaN(components['/_number1'].stateValues.value);
      })
    })
  })

  it(`number becomes non-numeric through inverse`, () => {
    cy.window().then((win) => {
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

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}9{enter}', { force: true })
    cy.get('#\\/n').should('have.text', '9');

  })

  it('number in math', () => {
    cy.window().then((win) => {
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
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eqls(['+', 'x', 3])
      expect(components['/_number1'].stateValues.value).to.eq(3);
    })
  });

  it('math in number', () => {
    cy.window().then((win) => {
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
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eqls(['+', 5, 3]);
      expect(components['/_math2'].stateValues.value.tree).eq(3);
      expect(components['/_number1'].stateValues.value).eq(8);
    })
  });

  it('number converts to decimals', () => {
    cy.window().then((win) => {
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
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).closeTo(num, 1E-14);
      expect(components['/_number1'].stateValues.value).closeTo(num, 1E-14);
    })
  });

  it('rounding', () => {
    cy.window().then((win) => {
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
      <m name="n1am">$n1a</m>
      <m name="n1bm">$n1b</m>
      <m name="n1cm">$n1c</m>
      <m name="n2am">$n2a</m>
      <m name="n2bm">$n2b</m>
      <m name="n2cm">$n2c</m>
      <m name="n3am">$n3a</m>
      <m name="n3bm">$n3b</m>
      <m name="n3cm">$n3c</m>
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

    cy.get('#\\/n3').should('have.text', '5.02348134e-15')
    cy.get('#\\/n3a').should('have.text', '5.02e-15')
    cy.get('#\\/n3b').should('have.text', '0')
    cy.get('#\\/n3c').should('have.text', '0')
    cy.get('#\\/n3am .mjx-mrow').eq(0).should('have.text', '5.02⋅10−15')
    cy.get('#\\/n3bm .mjx-mrow').eq(0).should('have.text', '0')
    cy.get('#\\/n3cm .mjx-mrow').eq(0).should('have.text', '0')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n1'].stateValues.value).eq(234234823.34235235324);
      expect(components['/n1a'].stateValues.value).eq(234234823.34235235324);
      expect(components['/n1b'].stateValues.value).eq(234234823.34235235324);
      expect(components['/n1c'].stateValues.value).eq(234234823.34235235324);
      expect(components['/n1am'].activeChildren[0].stateValues.value.tree).eq(234234823.34235235324);
      expect(components['/n1bm'].activeChildren[0].stateValues.value.tree).eq(234234823.34235235324);
      expect(components['/n1cm'].activeChildren[0].stateValues.value.tree).eq(234234823.34235235324);
      expect(components['/n2'].stateValues.value).eq(5.4285023408250342);
      expect(components['/n2a'].stateValues.value).eq(5.4285023408250342);
      expect(components['/n2b'].stateValues.value).eq(5.4285023408250342);
      expect(components['/n2c'].stateValues.value).eq(5.4285023408250342);
      expect(components['/n2am'].activeChildren[0].stateValues.value.tree).eq(5.4285023408250342);
      expect(components['/n2bm'].activeChildren[0].stateValues.value.tree).eq(5.4285023408250342);
      expect(components['/n2cm'].activeChildren[0].stateValues.value.tree).eq(5.4285023408250342);
      expect(components['/n3'].stateValues.value).eq(0.000000000000005023481340324);
      expect(components['/n3a'].stateValues.value).eq(0.000000000000005023481340324);
      expect(components['/n3b'].stateValues.value).eq(0.000000000000005023481340324);
      expect(components['/n3c'].stateValues.value).eq(0.000000000000005023481340324);
      expect(components['/n3am'].activeChildren[0].stateValues.value.tree).eq(0.000000000000005023481340324);
      expect(components['/n3bm'].activeChildren[0].stateValues.value.tree).eq(0.000000000000005023481340324);
      expect(components['/n3cm'].activeChildren[0].stateValues.value.tree).eq(0.000000000000005023481340324);
    })
  })

  it('dynamic rounding', () => {
    cy.window().then((win) => {
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

    cy.log('invalid precision means no rounding')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}{backspace}x{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}{backspace}y{enter}", { force: true });
    cy.get('#\\/na').invoke('text').then(text => {
      expect(Number(text)).closeTo(35203423.02352343201, 1E-15)
    })
    cy.get('#\\/nb').invoke('text').then(text => {
      expect(Number(text)).closeTo(35203423.02352343201, 1E-15)
    })

    cy.log('low precision')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/na').should('have.text', '40000000')
    cy.get('#\\/nb').should('have.text', '35203423')


    cy.log('negative precision, no rounding for displayDigits')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.get('#\\/na').invoke('text').then(text => {
      expect(Number(text)).closeTo(35203423.02352343201, 1E-15)
    })
    cy.get('#\\/nb').should('have.text', '35203000')

  })

  it('infinity and nan', () => {
    cy.window().then((win) => {
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

    cy.get('#\\/inf1').should('have.text', 'Infinity')
    cy.get('#\\/inf2').should('have.text', 'Infinity')
    cy.get('#\\/inf3').should('have.text', 'Infinity')
    cy.get('#\\/inf4').should('have.text', 'Infinity')
    cy.get('#\\/inf5').should('have.text', 'Infinity')
    cy.get('#\\/inf6').should('have.text', 'Infinity')
    cy.get('#\\/inf7').should('have.text', 'Infinity')
    cy.get('#\\/inf8').should('have.text', 'Infinity')
 
    cy.get('#\\/ninf1').should('have.text', '-Infinity')
    cy.get('#\\/ninf2').should('have.text', '-Infinity')
    cy.get('#\\/ninf3').should('have.text', '-Infinity')
    cy.get('#\\/ninf4').should('have.text', '-Infinity')
    cy.get('#\\/ninf5').should('have.text', '-Infinity')
    cy.get('#\\/ninf6').should('have.text', '-Infinity')
 
    cy.get('#\\/nan1').should('have.text', 'NaN')
    cy.get('#\\/nan2').should('have.text', 'NaN')
    cy.get('#\\/nan3').should('have.text', 'NaN')
    cy.get('#\\/nan4').should('have.text', 'NaN')
    cy.get('#\\/nan5').should('have.text', 'NaN')
    cy.get('#\\/nan6').should('have.text', 'NaN')
    cy.get('#\\/nan7').should('have.text', 'NaN')
    cy.get('#\\/nan8').should('have.text', 'NaN')
 
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/inf1'].stateValues.value).eq(Infinity);
      expect(components['/inf2'].stateValues.value).eq(Infinity);
      expect(components['/inf3'].stateValues.value).eq(Infinity);
      expect(components['/inf4'].stateValues.value).eq(Infinity);
      expect(components['/inf5'].stateValues.value).eq(Infinity);
      expect(components['/inf6'].stateValues.value).eq(Infinity);
      expect(components['/inf7'].stateValues.value).eq(Infinity);
      expect(components['/inf8'].stateValues.value).eq(Infinity);


      expect(components['/ninf1'].stateValues.value).eq(-Infinity);
      expect(components['/ninf2'].stateValues.value).eq(-Infinity);
      expect(components['/ninf3'].stateValues.value).eq(-Infinity);
      expect(components['/ninf4'].stateValues.value).eq(-Infinity);
      expect(components['/ninf5'].stateValues.value).eq(-Infinity);
      expect(components['/ninf6'].stateValues.value).eq(-Infinity);

      expect(components['/nan1'].stateValues.value).eqls(NaN);
      expect(components['/nan2'].stateValues.value).eqls(NaN);
      expect(components['/nan3'].stateValues.value).eqls(NaN);
      expect(components['/nan4'].stateValues.value).eqls(NaN);
      expect(components['/nan5'].stateValues.value).eqls(NaN);
      expect(components['/nan6'].stateValues.value).eqls(NaN);
      expect(components['/nan7'].stateValues.value).eqls(NaN);
      expect(components['/nan8'].stateValues.value).eqls(NaN);

    })
  })

});