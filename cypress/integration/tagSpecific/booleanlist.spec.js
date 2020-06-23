
describe('Booleanlist Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')

  })

  it('booleanlist within booleanlists',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p><booleanlist hide="true">false, true, false</booleanlist></p>

    <p><copy hide="false" tname="_booleanlist1" /></p>

    <p><booleanlist>
      <boolean>true</boolean>
      <copy tname="_booleanlist1" />
      <boolean>false</boolean>
      <copy tname="_copy1" />
    </booleanlist></p>

    <p><copy maximumnumber="6" tname="_booleanlist2" /></p>
    `},"*");
    });
  
    cy.get('#\\/_p1').should('have.text', '')
    cy.get('#\\/_p2').should('have.text', 'false, true, false')
    cy.get('#\\/_p3').should('have.text', 'true, false, true, false, false, false, true, false')
    cy.get('#\\/_p4').should('have.text', 'true, false, true, false, false, false')

  
    })
  
})



