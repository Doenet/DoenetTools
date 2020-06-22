
describe('Textlist Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')

  })

  it('textlist within textlists',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p><textlist hide="true">a,b,c</textlist></p>

    <p><copy hide="false" tname="_textlist1" /></p>

    <p><textlist>
      <text>hello</text>
      <copy tname="_textlist1" />
      <text>bye</text>
      <copy tname="_copy1" />
    </textlist></p>

    <p><copy maximumnumber="6" tname="_textlist2" /></p>

    <p><copy prop="text" tname="_textlist2" /></p>

    `},"*");
    });
  
    cy.get('#\\/_p1').should('have.text', '')
    cy.get('#\\/_p2').should('have.text', 'a, b, c')
    cy.get('#\\/_p3').should('have.text', 'hello, a, b, c, bye, a, b, c')
    cy.get('#\\/_p4').should('have.text', 'hello, a, b, c, bye, a')
    cy.get('#\\/_p5').should('have.text', 'hello, a, b, c, bye, a, b, c')

  
    })
  
})



