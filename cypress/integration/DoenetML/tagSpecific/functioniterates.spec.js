
describe('FunctionIterates Tag Tests', function () {

  beforeEach(() => {

    cy.visit('/cypressTest')

  })


  // TODO: test numeric versus symbolic?

  it('user-defined function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Choose variable for function: <mathinput name="x" prefill="x" />.
  Let <m>f($x) =</m> <mathinput name="fformula" prefill="ax" />.
  Let <m>u = </m> <mathinput name="u" prefill="3v" />.
  Then <m name="result">f(u) = f($u) = $$f($u)</m>.</p>

  <p hide><function name="f" variable="$x" symbolic simplify expand formula="$fformula" /></p>
  

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('initial state');

    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(3v)=3av')
    })

    cy.log('change function')
    cy.get('#\\/fformula textarea').type("{end}{backspace}{backspace}bx^2{enter}", { force: true });
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(3v)=9bv2')
    })

    cy.log('change u')
    cy.get('#\\/u textarea').type("{end}{backspace}{backspace}cq^2{enter}", { force: true });
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(cq2)=bc2q4')
    })

    cy.log('change variable')
    cy.get('#\\/x textarea').type("{end}{backspace}y{enter}", { force: true });
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(cq2)=bx2')
    })

    cy.log('change function to match variable')
    cy.get('#\\/fformula textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}ay+by^2{enter}", { force: true });
    cy.get('#\\/result').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(u)=f(cq2)=acq2+bc2q4')
    })

  })


})



