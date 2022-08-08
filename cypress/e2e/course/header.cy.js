describe('Page Header Tests', function () {

  beforeEach(() => {
    cy.visit('/course')
  })

  it('toolbox button', function() {
    // click on toolbox button
    cy.get('[data-test=toolboxButton]').click();
    
    // check if toolbox modal is visible
    cy.get('[data-test=toolbox]').should('be.visible');

    // check if course is selected
    cy.get('[data-test=toolboxNavLinkToCourse]').should('have.class', 'selectedToolboxNavLink');

    // click on toolbox button
    cy.get('[data-test=toolboxButton]').click();
    
    // check if toolbox modal is visible
    cy.get('[data-test=toolbox]').should('not.be.visible');

    // click on toolbox button
    cy.get('[data-test=toolboxButton]').click();

    // click on anywhere on the screen 
    cy.get('.homeActiveSection').click();

    // check if toolbox modal is visible
    cy.get('[data-test=toolbox]').should('not.be.visible');
  });

  it('toolbox menu links', function() {
    // check if admin link redirects to admin page
    cy.get('[data-test=toolboxButton]').click();
    cy.get('[data-test=toolboxNavLinkToAdmin').click();
    cy.url().should('include', '/admin');

    // check if chooser link redirects to chooser page
    cy.visit('/course')
    cy.get('[data-test=toolboxButton]').click();
    cy.get('[data-test=toolboxNavLinkToChooser]').click();
    cy.url().should('include', '/chooser');

    // check if documentation link redirects to documentation page
    cy.visit('/course')
    cy.get('[data-test=toolboxButton]').click();
    cy.get('[data-test=toolboxNavLinkToDocumentation]').click();
    cy.url().should('include', '/docs');

    // check if editor link redirects to editor page
    cy.visit('/course')
    cy.get('[data-test=toolboxButton]').click();
    cy.get('[data-test=toolboxNavLinkToEditor]').click();
    cy.url().should('include', '/editor');
  });

  it('previous page button', function() {

    // redirect to documentation page
    cy.get('[data-test=toolboxButton]').click();
    cy.get('[data-test=toolboxNavLinkToDocumentation').click();
    cy.url().should('include', '/docs');

    // check if previous page button points back to /course
    cy.get('[data-test=previousPageButton]').click();
    cy.url().should('include', '/course');

    // check if previous page button points back to /docs
    cy.get('[data-test=previousPageButton]').click();
    cy.url().should('include', '/docs');

    // check if previous page button points back to same page on refresh
    cy.reload();
    cy.get('[data-test=previousPageButton]').click();
    cy.url().should('include', '/course');

    // redirect to chooser page
    cy.get('[data-test=toolboxButton]').click();
    cy.get('[data-test=toolboxNavLinkToChooser').click();
    cy.url().should('include', '/chooser');

    // check if previous page button points to /course
    cy.get('[data-test=previousPageButton]').click();
    cy.url().should('include', '/course');


  });
})