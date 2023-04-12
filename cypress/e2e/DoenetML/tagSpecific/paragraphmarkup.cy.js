import { cesc } from '../../../../src/_utils/url';


describe('Paragraph Markup Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })


  it('em', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <em>This is italics</em>
  `}, "*");
    });

    cy.log('find em');
    cy.get('em' + cesc('#\\/_em1')).should('have.text', 'This is italics')

  })

  it('alert', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <alert>This is bold</alert>
  `}, "*");
    });

    cy.log('find alert');
    cy.get('strong' + cesc('#\\/_alert1')).should('have.text', 'This is bold')

  })

  it('q', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><q>Double quoted</q></p>
  `}, "*");
    });

    cy.log('find quotes');
    cy.get('p' + cesc('#\\/_p1')).should('have.text', '“Double quoted”')

  })

  it('sq', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><sq>Single quoted</sq></p>
  `}, "*");
    });

    cy.log('find quotes');
    cy.get('p' + cesc('#\\/_p1')).should('have.text', '‘Single quoted’')

  })

  it('c', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <c>Code!</c>
  `}, "*");
    });

    cy.log('find quotes');
    cy.get('code' + cesc('#\\/_c1')).should('have.text', 'Code!')

  })

  it('term', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <term>Homogeneous</term>
  `}, "*");
    });

    cy.log('find term');
    cy.get('strong' + cesc('#\\/_term1')).should('have.text', 'Homogeneous')

  })

})
