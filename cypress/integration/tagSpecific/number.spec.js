import me from 'math-expressions';

describe('Number Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('1+1', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetML: `
      <text>a</text>
      <ref>_number1</ref>
      <number>1+1</number>
    ` }, "*");
    })

    cy.log('Test value displayed in browser')
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/_number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['__number1'].state.value.tree).eq(2);
      expect(components['__number1'].state.number).eq(2);
      expect(components['/_number1'].state.value.tree).eq(2);
      expect(components['/_number1'].state.number).eq(2);
    })
  })

  it(`number that isn't a number`, () => {
    cy.window().then((win) => {
      win.postMessage({ doenetML: `<ref>_number1</ref><number>x+1</number>` }, "*");
    })

    cy.log('Test value displayed in browser')
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uFF3F')
    })
    cy.get('#\\/_number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uFF3F')
    })
    
    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_number1'].state.value.tree).to.eq('\uFF3F');
      assert.isNaN(components['/_number1'].state.number);
    })
  })


  it('number in math', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetML: `<math>x+<number>3</number></math>` }, "*");
    })

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+3')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1']._state.value.value.tree).eqls(['+', 'x', 3])
      expect(components['/_number1'].state.value.tree).to.eq(3);
      expect(components['/_number1'].state.number).to.eq(3);
    })
  });

  it('math in number', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetML: `<number>5+<math>3</math></number>` }, "*");
    })

    cy.log('Test value displayed in browser')
    cy.get('#\\/_number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1']._state.value.value.tree).to.eq(3);
      expect(components['/_number1'].state.value.tree).to.eq(8);
      expect(components['/_number1'].state.number).to.eq(8);
    })
  });


  it('number converts to decimals', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetML: `<number>log(0.5/0.3)</number>, <math><ref>_number1</ref></math>` }, "*");
    })

    let num = Math.log(0.5/0.3);
    let numString = me.math.round(num, 10).toString();

    cy.log('Test value displayed in browser');
    cy.get('#\\/_number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(numString)
    })
    cy.get('#\\/_number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(numString)
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1']._state.value.value.tree).closeTo(num, 1E-14);
      expect(components['/_number1'].state.value.tree).closeTo(num,1E-14);
      expect(components['/_number1'].state.number).closeTo(num,1E-14);
    })
  });


  it('ref number property', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetML: `
      <ref prop="number">_number1</ref>,
      <number>8+3</number>` }, "*");
    })

    cy.log('Test value displayed in browser')
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('11')
    })
    cy.get('#\\/_number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('11')
    })
    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['__number1'].state.value.tree).to.eq(11);
      expect(components['__number1'].state.number).to.eq(11);
      expect(components['/_number1'].state.value.tree).to.eq(11);
      expect(components['/_number1'].state.number).to.eq(11);
   })
  });


});