
describe('Url Tag Tests',function() {

beforeEach(() => {
  cy.visit('/test')
 
  })


it('simple url',() => {
  cy.window().then((win) => { win.postMessage({doenetCode: `
  <p>A link to <url href="http://doenet.org">Doenet</url>.</p>
  `},"*");
  });

  cy.get('#\\/_p1').should('have.text', 'A link to Doenet.')

  cy.get('#\\/_url1').should('have.text', 'Doenet').invoke('attr', 'href')
    .then((href) => expect(href).eq("http://doenet.org"));

})


it('url with no link text',() => {
  cy.window().then((win) => { win.postMessage({doenetCode: `
  <p>A link to <url href="http://doenet.org"/>.</p>
  `},"*");
  });

  cy.get('#\\/_p1').should('have.text', 'A link to http://doenet.org.')

  cy.get('#\\/_url1').should('have.text', 'http://doenet.org').invoke('attr', 'href')
    .then((href) => expect(href).eq("http://doenet.org"));
    
})


it('referencing url',() => {
  cy.window().then((win) => { win.postMessage({doenetCode: `
  <p>A link to <url href="http://doenet.org">Doenet</url>.</p>
  <p>Repeat url: <ref>_url1</ref>.</p>
  <p>The link address is: <ref prop="href">_url1</ref>.</p>
  <p>The text linked is: <ref prop="linktext">_url1</ref>.</p>
  <p>Recreate from pieces: <url><ref prop="href">_url1</ref><ref prop="linktext">_url1</ref></url>.</p>
  <p>Recreate from pieces with explicit href tag: <url>
      <href><ref prop="href">_url1</ref></href>
      <ref prop="linktext">_url1</ref>
    </url>.</p>
  `},"*");
  });

  cy.get('#\\/_p1').should('have.text', 'A link to Doenet.')

  cy.get('#\\/_url1').should('have.text', 'Doenet').invoke('attr', 'href')
    .then((href) => expect(href).eq("http://doenet.org"));

  cy.get('#__url1').should('have.text', 'Doenet').invoke('attr', 'href')
    .then((href) => expect(href).eq("http://doenet.org"));

  cy.get('#\\/_p3').should('have.text', 'The link address is: http://doenet.org.')

  cy.get('#\\/_p4').should('have.text', 'The text linked is: Doenet.')

  cy.get('#\\/_p5').should('have.text', 'Recreate from pieces: Doenet.')

  cy.get('#\\/_url2').should('have.text', 'Doenet').invoke('attr', 'href')
    .then((href) => expect(href).eq("http://doenet.org"));

  cy.get('#\\/_p6').should('have.text', 'Recreate from pieces with explicit href tag: Doenet.')

  cy.get('#\\/_url3').should('have.text', 'Doenet').invoke('attr', 'href')
    .then((href) => expect(href).eq("http://doenet.org"));


})

})



