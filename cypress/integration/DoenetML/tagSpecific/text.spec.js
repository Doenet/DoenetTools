
describe('Text Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')

  })

  it('spaces preserved between tags',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p><text>Hello</text> <text>there</text>!</p>

    <p><text>We <text>could</text> be <copy tname="_text2" />.</text></p>
    `},"*");
    });
  
    cy.get('p#\\/_p1').invoke('text').should('contain', 'Hello there!')
    cy.get('p#\\/_p2').invoke('text').should('contain', 'We could be there.')
  
    })
  
})



