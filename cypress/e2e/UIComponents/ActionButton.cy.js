
describe('ActionButton Tests', function () {

before(() => {
  cy.visit("http://localhost/uiDocs");
  cy.get('[data-test="componentLinkactionbutton"] > a').click();
})


 
it('Button Width CSS Test',()=>{
  cy.get('[data-test="ActionButton width example"]').contains('Action Button');
})

it('Button value has Edit',()=>{
  cy.get('[data-test="ActionButton Edit Value example"]').contains('Edit');
})



})