
describe('Boolean Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })


  it('boolean based on math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <mathinput prefill="0" />

    <text hide="$_mathinput1">
      Hello there!
    </text>
    `}, "*");
    });

    cy.get('#\\/_text1').should('contain.text', 'Hello there!')

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}3{enter}', { force: true });
    cy.get('#\\/_text1').should('not.exist');

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}2x{enter}', { force: true });
    cy.get('#\\/_text1').should('contain.text', 'Hello there!')

    cy.get('#\\/_mathinput1 textarea').type('{end}-x-x{enter}', { force: true });
    cy.get('#\\/_text1').should('contain.text', 'Hello there!')

  })

})



