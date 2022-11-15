
describe('ActionButton Tests', function () {

before(() => {
  cy.visit("http://localhost/uiDocs");
  cy.get('[data-test="componentLink actionbutton"]').click();
})


 
// it('Button Width CSS Test',()=>{
//   cy.get('[data-test="ActionButton width example"]').contains('Action Button');
// })

it('Button value has Edit',()=>{
  cy.get('[data-test="ActionButton Edit Value example"]').contains('Edit');
})

it.only('Test onClick',()=>{
  cy.get('[data-test="ActionButton click example"]').click();
  cy.get('[data-test="action result"]').contains('ActionButton clicked');
  cy.get('[data-test="clear action result"]').click();
})



})