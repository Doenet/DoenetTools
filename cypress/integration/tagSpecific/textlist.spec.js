
describe('Textlist Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')

  })

  it('textlist within textlists',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p><textlist hide="true">a,b,c</textlist></p>

    <p><ref hide="false">_textlist1</ref></p>

    <p><textlist>
      <text>hello</text>
      <ref>_textlist1</ref>
      <text>bye</text>
      <ref>_ref1</ref>
    </textlist></p>

    <p><ref maximumnumber="6">_textlist2</ref></p>
    `},"*");
    });
  
    cy.get('#\\/_p1').should('have.text', '')
    cy.get('#\\/_p2').should('have.text', 'a, b, c')
    cy.get('#\\/_p3').should('have.text', 'hello, a, b, c, bye, a, b, c')
    cy.get('#\\/_p4').should('have.text', 'hello, a, b, c, bye, a')

  
    })
  
})



