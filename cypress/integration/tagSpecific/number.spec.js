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
    cy.visit('/test')
  })

  it('1+1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <copy tname="_number1" />
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
      <copy tname="_number1" />
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


  it('number in math', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetML: `
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
      win.postMessage({ doenetML: `
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
      win.postMessage({ doenetML: `
      <text>a</text>
      <number>log(0.5/0.3)</number>, 
      <math><copy tname="_number1" /></math>
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


});