
describe('Boolean Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')

  })


  it('boolean based on math',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <mathinput prefill="0" />

    <text hide="$_mathinput1">
      Hello there!
    </text>
    `},"*");
    });
  
    cy.get('#\\/_text1').should('contain.text', 'Hello there!')
    
    cy.get('#\\/_mathinput1_input').clear().type('3{enter}');
    cy.get('#\\/_text1').should('not.exist');

    cy.get('#\\/_mathinput1_input').clear().type('2x{enter}');
    cy.get('#\\/_text1').should('contain.text', 'Hello there!')
    
    cy.get('#\\/_mathinput1_input').clear().type('2x-x-x{enter}');
    cy.get('#\\/_text1').should('contain.text', 'Hello there!')

    })
  
})



