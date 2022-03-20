
describe('Text Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('spaces preserved between tags', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>Hello</text> <text>there</text>!</p>

    <p><text>We <text>could</text> be <copy target="_text2" />.</text></p>
    `}, "*");
    });

    cy.get('p#\\/_p1').invoke('text').should('contain', 'Hello there!')
    cy.get('p#\\/_p2').invoke('text').should('contain', 'We could be there.')

  })

  it('components adapt to text', () => {
    cy.window().then(async (win) => {
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

  it('text from paragraph components', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p name="orig"><q>Hello,</q> said the <em>cow</em>.  <sq>Bye,</sq> came the <alert>reply</alert>.  The <attr>text</attr> attribute of <tag>text</tag> or <tage>text</tage> doesn't <term>do</term> <c>much</c>.</p>

    <p name="textOnly"><copy prop="text" target="orig" assignNames="t" /></p>

    <p name="insideText"><text name="t2"><q>Hello,</q> said the <em>cow</em>.  <sq>Bye,</sq> came the <alert>reply</alert>.  The <attr>text</attr> attribute of <tag>text</tag> or <tage>text</tage> doesn't <term>do</term> <c>much</c>.</text></p>
    `}, "*");
    });

    cy.get('#\\/orig').should('have.text', `“Hello,” said the cow.  ‘Bye,’ came the reply.  The text attribute of <text> or <text/> doesn't do much.`)
    cy.get('#\\/textOnly').should('have.text', `"Hello," said the cow.  'Bye,' came the reply.  The text attribute of <text> or <text/> doesn't do much.`)
    cy.get('#\\/insideText').should('have.text', `"Hello," said the cow.  'Bye,' came the reply.  The text attribute of <text> or <text/> doesn't do much.`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/t'].stateValues.value).eq(`"Hello," said the cow.  'Bye,' came the reply.  The text attribute of <text> or <text/> doesn't do much.`)
      expect(stateVariables['/t2'].stateValues.value).eq(`"Hello," said the cow.  'Bye,' came the reply.  The text attribute of <text> or <text/> doesn't do much.`)
    })


  })

  it('text from single character components', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p name="orig">Pick a number from 1 <ndash/> 2 <mdash/> no, maybe from<nbsp/>3<ellipsis /></p>

    <p name="textOnly"><copy prop="text" target="orig" assignNames="t" /></p>

    <p name="insideText"><text name="t2">Pick a number from 1 <ndash/> 2 <mdash/> no, maybe from<nbsp/>3<ellipsis /></text></p>
    `}, "*");
    });

    cy.get('#\\/orig').should('have.text', 'Pick a number from 1 – 2 — no, maybe from\u00a03…')
    cy.get('#\\/textOnly').should('have.text', 'Pick a number from 1 – 2 — no, maybe from\u00a03…')
    cy.get('#\\/insideText').should('have.text', 'Pick a number from 1 – 2 — no, maybe from\u00a03…')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/t'].stateValues.value).eq(`Pick a number from 1 – 2 — no, maybe from\u00a03…`)
      expect(stateVariables['/t2'].stateValues.value).eq(`Pick a number from 1 – 2 — no, maybe from\u00a03…`)
    })


  })


})



