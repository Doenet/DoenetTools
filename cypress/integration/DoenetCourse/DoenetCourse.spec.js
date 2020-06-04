// set up db
// check  overview exists
// remove overview -> check if overview NOT exist
// check  syllabus exists
// remove syllabus -> check if syllabus NOT exist
// check  grade exists
// remove grade -> check if grade NOT exist
// check  assignment exists
// remove assignment -> check if assignment NOT exist

// check if 13th item NOT exists
// add header, now check if 13th item exists
// check if 14th item NOT exists
// add assignments, now check if 14th item exists
// remove 13th item
// check if 13th item NOT exists
describe('Admin Navigation Tests', function () {
  it('setUp', function() {
    cy.request('POST', 'api/cypressCleanupAdminTree.php').then((response) => {
      cy.log(response);
    })
    cy.request('POST', 'api/enableAll.php').then((response) => {
      cy.log(response);
    })
  });
  beforeEach(() => {
      cy.visit('/course');
  })
  it('overview', function() {
    cy.wait(1000);
    cy.get('[data-cy=overviewNavItem]').should('exist');
    
    cy.visit('/admin');
    cy.wait(1000);
    cy.get('[data-cy=overviewNavItem] > :nth-child(3)').click();
    
    cy.visit('/course');
    cy.wait(1000);
    cy.get('[data-cy=overviewNavItem]').should('not.exist');

  });
  it('syllabus', function() {
    cy.wait(1000);
    cy.get('[data-cy=syllabusNavItem]').should('exist');
    
    cy.visit('/admin');
    cy.wait(1000);
    cy.get('[data-cy=syllabusNavItem] > :nth-child(3)').click();
    
    cy.visit('/course');
    cy.wait(1000);
    cy.get('[data-cy=syllabusNavItem]').should('not.exist');

  });
  it('grade', function() {
    cy.wait(1000);
    cy.get('[data-cy=gradesNavItem]').should('exist');
    
    cy.visit('/admin');
    cy.wait(1000);
    cy.get('[data-cy=gradesNavItem] > :nth-child(3)').click();
    
    cy.visit('/course');
    cy.wait(1000);
    cy.get('[data-cy=gradesNavItem]').should('not.exist');

  });
  it('assignment', function() {
    cy.wait(1000);
    cy.get('[data-cy=assignmentsNavItem]').should('exist');
    
    cy.visit('/admin');
    cy.wait(1000);
    cy.get('[data-cy=assignmentsNavItem] > .switch > .slider').click();
    
    cy.visit('/course');
    cy.wait(1000);
    cy.get('[data-cy=assignmentsNavItem]').should('not.exist');

  });
  it('CleanUp', function() {
    cy.request('POST', 'api/enableAll.php').then((response) => {
      cy.log(response);
    })
  });
  it('addHeader', function() {
    cy.wait(1000);
    cy.get('[data-cy=header13]').should('not.exist');

    cy.visit('/admin');
    cy.wait(1000);
    cy.get('[data-cy=addHeader]').click();
    cy.get(':nth-child(17)').click();
    cy.get('[data-cy=modifyTree]').click();
    cy.get('[data-cy=arrowUp13]').should('exist');
    cy.get('[data-cy=arrowRight13]').should('exist');

    cy.visit('/course');
    cy.wait(1000);
    cy.get('[data-cy=assignmentsNavItem]').should('exist').click();
    cy.get('[data-cy=header13]').should('exist');

  });  
  it('addAssignment', function() {
    cy.wait(1000);
    cy.get('[data-cy=assignmentsNavItem]').should('exist').click();
    cy.get('[data-cy=header13]').should('exist');
    cy.get('[data-cy=assignment14]').should('not.exist');


    cy.visit('/admin');
    cy.wait(1000);
    cy.get('[data-cy=addAssignment]').click();
    cy.get('[data-cy=arrowLeft13]').click();

    cy.visit('/course');
    cy.wait(1000);
    cy.get('[data-cy=assignmentsNavItem]').should('exist').click();
    cy.get('[data-cy=header13]').should('exist');
    cy.get('[data-cy=assignment14]').should('exist');

    cy.visit('/admin');
    cy.wait(1000);
    cy.get('[data-cy=removeTree]').click();
    cy.get('[data-cy=close13]').click();

  });

  it('CleanUp', function() {
    cy.request('POST', 'api/enableAll.php').then((response) => {
      cy.log(response);
    })
  });
})