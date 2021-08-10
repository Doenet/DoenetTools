
describe('Text Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('spaces preserved between tags', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>Hello</text> <text>there</text>!</p>

    <p><text>We <text>could</text> be <copy tname="_text2" />.</text></p>
    `}, "*");
    });

    cy.get('p#\\/_p1').invoke('text').should('contain', 'Hello there!')
    cy.get('p#\\/_p2').invoke('text').should('contain', 'We could be there.')

  })

  it('components adapt to text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>boolean: <text><boolean>true</boolean></text></p>
    <p>number: <text><number>5-2</number></text></p>
    <p>math: <text><math>5-2</math></text></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'true')
    cy.get('#\\/_text2').should('have.text', '3')
    cy.get('#\\/_text3').should('have.text', '5 - 2')

  })

  it('text attribute of paragraph components', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p name="orig"><q>Hello,</q> said the <em>cow</em>.  <sq>Bye,</sq> came the <alert>reply</alert>.  The <attr>text</attr> attribute of <tag>text</tag> or <tage>text</tage> doesn't <term>do</term> <c>much</c>.</p>

    <p name="textOnly"><copy prop="text" tname="orig" assignNames="t" /></p>
    `}, "*");
    });

    cy.get('#\\/orig').should('have.text', `“Hello,” said the cow.  ‘Bye,’ came the reply.  The text attribute of <text> or <text/> doesn't do much.`)
    cy.get('#\\/textOnly').should('have.text', `"Hello," said the cow.  'Bye,' came the reply.  The text attribute of <text> or <text/> doesn't do much.`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/t'].stateValues.value).eq(`"Hello," said the cow.  'Bye,' came the reply.  The text attribute of <text> or <text/> doesn't do much.`)
    })


  })


})



