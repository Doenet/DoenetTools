export const signIn = () => {
  cy.visit('/signin')
//   cy.get('[data-cy=signinEmailInput]')
//   .type('devuser@example.com').blur()
//   cy.get('[data-cy=sendEmailButton]').click()

//   cy.request('POST','api/cypressSignin.php').then((response)=>{
//        cy.log("response",response);
//        cy.get('[data-cy=signinCodeInput]').type(response.body.signInCode)
//        cy.get('[data-cy=signInButton]').click();
//   })

}