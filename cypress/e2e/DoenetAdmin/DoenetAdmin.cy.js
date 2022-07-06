describe('Admin Navigation Tests', function () {
  it('setUp', function() {
    cy.request('POST', 'api/cypressCleanupAdminTree.php').then((response) => {
      cy.log(response);
    })
  });
  beforeEach(() => {
      cy.visit('/admin');
  })
    
  it('DownArrorForHeader', function() {
    cy.wait(1000);
    cy.get('[data-cy=arrowDown10]').click();
    cy.get('[data-cy=arrowDown11]').should('not.exist');
    cy.get('[data-cy=arrowUp11]').click();
  });
  it('UpArrorForHeader', function() {
    cy.wait(1000);
    cy.get('[data-cy=arrowUp10]').click();
    cy.get('[data-cy=arrowUp0]').should('not.exist');
    cy.get('[data-cy=arrowDown0]').click();
  });
  it('RightAndLeftArrorForHeader', function() {
    cy.wait(1000);
    cy.get('[data-cy=arrowLeft10]').should('not.exist');
    cy.get('[data-cy=arrowRight10]').click();
    cy.get('[data-cy=arrowRight10]').click();
    cy.get('[data-cy=arrowRight10]').should('not.exist');
    cy.get('[data-cy=arrowLeft10]').click();
    cy.get('[data-cy=arrowLeft10]').click();
    cy.get('[data-cy=arrowLeft10]').should('not.exist');
    cy.get('[data-cy=arrowDown10]').click();
  });
  it('AddHeader', function() {
    cy.wait(1000);
    cy.get('[data-cy=arrowUp13]').should('not.exist');
    cy.get('[data-cy=arrowRight13]').should('not.exist');
    cy.get('[data-cy=addHeader]').click();
    cy.get(':nth-child(17)').click();
    cy.get('[data-cy=modifyTree]').click();
    cy.get('[data-cy=arrowUp13]').should('exist');
    cy.get('[data-cy=arrowRight13]').should('exist');
  });
  it('removeHeader', function() {
    cy.wait(1000);
    cy.get('[data-cy=modifyTree]').click();
    cy.get('[data-cy=arrowUp13]').should('exist');
    cy.get('[data-cy=arrowRight13]').should('exist');
    cy.get('[data-cy=removeTree]').click();
    cy.get('[data-cy=close13]').click();
  });
  it('AddAssignment', function() {
    cy.wait(1000);
    cy.get('[data-cy=arrowUp13]').should('not.exist');
    cy.get('[data-cy=arrowRight13]').should('not.exist');
    cy.get('[data-cy=addHeader]').click();
    cy.get(':nth-child(17)').click();
    cy.get('[data-cy=modifyTree]').click();
    cy.get('[data-cy=arrowUp13]').should('exist');
    cy.get('[data-cy=arrowRight13]').should('exist');
    cy.get('[data-cy=addAssignment]').click();
    cy.get('[data-cy=arrowLeft13]').click();
    cy.get('[data-cy=modifyTree]').click();
    cy.get('[data-cy=arrowDown14]').should('exist');
    cy.get('[data-cy=arrowDown15]').should('exist');
    cy.get('[data-cy=arrowUp15]').should('exist');
    cy.get('[data-cy=arrowUp16]').should('exist');
  });
  it('UpDownAssignment', function() {
    cy.wait(1000);
    cy.get('[data-cy=modifyTree]').click();
    cy.get('[data-cy=arrowDown15]').click();
    cy.get('[data-cy=arrowUp15]').click();
    cy.get('[data-cy=arrowDown14]').click();
    cy.get('[data-cy=arrowUp16]').click();
  });

  it('removeAssignment', function() {
    cy.wait(1000);
    cy.get('[data-cy=removeTree]').click();
    cy.get('[data-cy=close16]').click();
    cy.get('[data-cy=close13]').click();
    cy.get('[data-cy=modifyTree]').click();
    cy.get('[data-cy=arrowUp13]').should('not.exist');
    cy.get('[data-cy=arrowRight13]').should('not.exist');
  });
});
