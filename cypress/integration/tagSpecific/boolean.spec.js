
describe('Boolean Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')

  })

  it('boolean based on if',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <mathinput />

    <text>
      <hide><if><ref prop="value">_mathinput1</ref>=3</if></hide>
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



