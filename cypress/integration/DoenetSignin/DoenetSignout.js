export const signOut = () => {
  
  // cy.visit('/signout')

  cy.get('[data-cy=profileMenuButton]').click()  //TODO
  cy.wait(500)
  cy.get('[data-cy=SignOut]').click()

}