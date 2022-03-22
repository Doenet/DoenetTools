
describe('P Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('two paragraphs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>Hello, paragraph 1</p>
  <p>Bye, paragraph 2</p>
  `}, "*");
    });

    cy.log('find paragraphs');
    cy.get('p#\\/_p1').should('have.text', 'Hello, paragraph 1')
    cy.get('p#\\/_p2').should('have.text', 'Bye, paragraph 2')

  })

  it('paragraph with math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>math in paragraph: <math simplify>x+x</math></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('find mathjax rendered math in paragraph');
    cy.get('p#\\/_p1').find('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
  })

  it('spaces preserved between tags', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><text>Hello</text> <math>x</math></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('p#\\/_p1').invoke('text').should('contain', 'Hello x')

  })

})



