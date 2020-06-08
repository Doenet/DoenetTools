
describe('Booleanlist Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')

  })

  it('booleanlist within booleanlists',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p><booleanlist hide="true">false, true, false</booleanlist></p>

    <p><ref hide="false">_booleanlist1</ref></p>

    <p><booleanlist>
      <boolean>true</boolean>
      <ref>_booleanlist1</ref>
      <boolean>false</boolean>
      <ref>_ref1</ref>
    </booleanlist></p>

    <p><ref maximumnumber="6">_booleanlist2</ref></p>
    `},"*");
    });
  
    cy.get('#\\/_p1').should('have.text', '')
    cy.get('#\\/_p2').should('have.text', 'false, true, false')
    cy.get('#\\/_p3').should('have.text', 'true, false, true, false, false, false, true, false')
    cy.get('#\\/_p4').should('have.text', 'true, false, true, false, false, false')

  
    })
  
})



