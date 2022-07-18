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
    cy.get('[data-test=arrowDown10]').click();
    cy.get('[data-test=arrowDown11]').should('not.exist');
    cy.get('[data-test=arrowUp11]').click();
  });
  it('UpArrorForHeader', function() {
    cy.wait(1000);
    cy.get('[data-test=arrowUp10]').click();
    cy.get('[data-test=arrowUp0]').should('not.exist');
    cy.get('[data-test=arrowDown0]').click();
  });
  it('RightAndLeftArrorForHeader', function() {
    cy.wait(1000);
    cy.get('[data-test=arrowLeft10]').should('not.exist');
    cy.get('[data-test=arrowRight10]').click();
    cy.get('[data-test=arrowRight10]').click();
    cy.get('[data-test=arrowRight10]').should('not.exist');
    cy.get('[data-test=arrowLeft10]').click();
    cy.get('[data-test=arrowLeft10]').click();
    cy.get('[data-test=arrowLeft10]').should('not.exist');
    cy.get('[data-test=arrowDown10]').click();
  });
  it('AddHeader', function() {
    cy.wait(1000);
    cy.get('[data-test=arrowUp13]').should('not.exist');
    cy.get('[data-test=arrowRight13]').should('not.exist');
    cy.get('[data-test=addHeader]').click();
    cy.get(':nth-child(17)').click();
    cy.get('[data-test=modifyTree]').click();
    cy.get('[data-test=arrowUp13]').should('exist');
    cy.get('[data-test=arrowRight13]').should('exist');
  });
  it('removeHeader', function() {
    cy.wait(1000);
    cy.get('[data-test=modifyTree]').click();
    cy.get('[data-test=arrowUp13]').should('exist');
    cy.get('[data-test=arrowRight13]').should('exist');
    cy.get('[data-test=removeTree]').click();
    cy.get('[data-test=close13]').click();
  });
  it('AddAssignment', function() {
    cy.wait(1000);
    cy.get('[data-test=arrowUp13]').should('not.exist');
    cy.get('[data-test=arrowRight13]').should('not.exist');
    cy.get('[data-test=addHeader]').click();
    cy.get(':nth-child(17)').click();
    cy.get('[data-test=modifyTree]').click();
    cy.get('[data-test=arrowUp13]').should('exist');
    cy.get('[data-test=arrowRight13]').should('exist');
    cy.get('[data-test=addAssignment]').click();
    cy.get('[data-test=arrowLeft13]').click();
    cy.get('[data-test=modifyTree]').click();
    cy.get('[data-test=arrowDown14]').should('exist');
    cy.get('[data-test=arrowDown15]').should('exist');
    cy.get('[data-test=arrowUp15]').should('exist');
    cy.get('[data-test=arrowUp16]').should('exist');
  });
  it('UpDownAssignment', function() {
    cy.wait(1000);
    cy.get('[data-test=modifyTree]').click();
    cy.get('[data-test=arrowDown15]').click();
    cy.get('[data-test=arrowUp15]').click();
    cy.get('[data-test=arrowDown14]').click();
    cy.get('[data-test=arrowUp16]').click();
  });

  it('removeAssignment', function() {
    cy.wait(1000);
    cy.get('[data-test=removeTree]').click();
    cy.get('[data-test=close16]').click();
    cy.get('[data-test=close13]').click();
    cy.get('[data-test=modifyTree]').click();
    cy.get('[data-test=arrowUp13]').should('not.exist');
    cy.get('[data-test=arrowRight13]').should('not.exist');
  });
});
