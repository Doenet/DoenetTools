
describe('blockquote Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest')
  })

  it('display blockquote', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>Hello</p>
  <blockQuote>
    For to be free is not merely to cast off one's chains, but to live in a way that respects and enhances the freedom of others.
  </blockquote>
  <p>There</p>
  `}, "*");
    });

    cy.get('blockquote#\\/_blockquote1').should('have.text', "\n    For to be free is not merely to cast off one's chains, but to live in a way that respects and enhances the freedom of others.\n  ")

  });

})