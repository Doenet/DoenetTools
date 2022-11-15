describe('Increment Menu Tests', function () {

  before(() => {
    cy.visit("http://localhost/uiDocs");
    cy.get('[data-test="componentLink increment"]').click();
  })
  
  
  it('Drag to Increment/Decrement',()=>{
      const dataTransfer = new DataTransfer();
      cy.get('[data-test="Test"]')
      .trigger('dragstart', { dataTransfer })
      .trigger('drag', { clientX: 100, clientY: 100 })
      .trigger('drag', { clientX: 105, clientY: 100 })
      .trigger('drag', { clientX: 110, clientY: 100 })
      .trigger('drag', { clientX: 115, clientY: 100 })
      .trigger('dragend')
      cy.get('[data-test="Test Textfield"]').should('contain.value', 4)

      cy.get('[data-test="Test"]')
      .trigger('dragstart', { dataTransfer })
      .trigger('drag', { clientX: 100, clientY: 100 })
      .trigger('drag', { clientX: 95, clientY: 100 })
      .trigger('drag', { clientX: 90, clientY: 100 })
      .trigger('drag', { clientX: 85, clientY: 100 })
      .trigger('dragend')
      cy.get('[data-test="Test Textfield"]').should('contain.value', 0)
  })
      
})