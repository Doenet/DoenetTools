
describe('When Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('value, fractionSatisfied, conditionSatisfied are public', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" />
  <when matchPartial name="w">
    $n > 0 and $n > 1
  </when>

  <p>Value: <copy prop="value" target="w" assignNames="v" /></p>
  <p>Condition satisfied: <copy prop="conditionSatisfied" target="w" assignNames="cs" /></p>
  <p>Fraction satisfied: <copy prop="fractionSatisfied" target="w" assignNames="fs" /></p>

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/v').should('have.text', 'false');
    cy.get('#\\/cs').should('have.text', 'false');
    cy.get('#\\/fs').should('have.text', '0');

    cy.get('#\\/n textarea').type('1{enter}', { force: true });
    cy.get('#\\/v').should('have.text', 'false');
    cy.get('#\\/cs').should('have.text', 'false');
    cy.get('#\\/fs').should('have.text', '0.5');

    cy.get('#\\/n textarea').type('1{enter}', { force: true });
    cy.get('#\\/v').should('have.text', 'true');
    cy.get('#\\/cs').should('have.text', 'true');
    cy.get('#\\/fs').should('have.text', '1');

    cy.get('#\\/n textarea').type('{home}-{enter}', { force: true });
    cy.get('#\\/v').should('have.text', 'false');
    cy.get('#\\/cs').should('have.text', 'false');
    cy.get('#\\/fs').should('have.text', '0');



  })




})



