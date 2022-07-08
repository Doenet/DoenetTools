import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Compiled activity tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })


  it("Minimal activity definition", () => {

    // Note: 
    // - missing xmlns attribute on activity document
    // - missing behavior attribute on order (sequence is assumed)
    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition: `
          <document type="activity">
            <order>
              <page>hi</page>
            </order>
          </document>

        `}, "*");
    })

    cy.get('#\\/_document1').should('have.text', 'hi')


  })


  it("Minimal activity definition, with attributes", () => {

    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition: `
          <document type="activity" xmlns="https://doenet.org/spec/doenetml/v0.1.0">
            <order behavior="sequence">
              <page>hi</page>
            </order>
          </document>

        `}, "*");
    })

    cy.get('#\\/_document1').should('have.text', 'hi')


  })



  it("page definition sent to activity viewer", () => {

    // Note: 
    // - missing xmlns attribute on page document
    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition: `
          <document type="page">hi</document>
        `}, "*");
    })

    cy.get('#\\/_document1').should('have.text', 'hi')

  })



  it("page definition sent to activity viewer, with xmlns", () => {

    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition: `
          <document type="page" xmlns="https://doenet.org/spec/doenetml/v0.1.0">hi</document>
        `}, "*");
    })

    cy.get('#\\/_document1').should('have.text', 'hi')

  })


})