
describe('Boolean Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')

  })

  it('boolean based on when',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <mathinput />

    <text>
      <hide><when><copy prop="value" tname="_mathinput1" />=3</when></hide>
      Hello there!
    </text>
    `},"*");
    });
  
    cy.get('#\\/_text1').should('contain.text', 'Hello there!')
    
    cy.get('#\\/_mathinput1_input').clear().type('3{enter}');
    cy.get('#\\/_text1').should('not.exist');

    cy.get('#\\/_mathinput1_input').clear().type('4{enter}');
    cy.get('#\\/_text1').should('contain.text', 'Hello there!')
    
    cy.get('#\\/_mathinput1_input').clear().type('1+2{enter}');
    cy.get('#\\/_text1').should('not.exist');

    })
  
})



