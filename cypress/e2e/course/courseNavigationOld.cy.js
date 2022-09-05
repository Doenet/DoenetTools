describe('Course Navigation Tests', function () {

  beforeEach(() => {
    cy.fixture('courseAssignmentsSeed').then((seed) => {
      this.seed = seed;
      cy.request('POST', 'api/cypressCleanupAssignments.php', this.seed).then((response) => {
        cy.log(response);
        cy.request('POST', 'api/cypressSetupAssignments.php', this.seed).then((response) => {
          cy.log(response);
          cy.visit('/course')
        })
      })
    })
  })

  it.skip('overview', function() {
    // click on navbar
    cy.get('[data-test=overviewNavItem]').click();
    // check if selected navbar is prepended with *
    cy.get('[data-test=overviewNavItem]').should('have.text', '* Overview');
    // check url
    cy.url().should('include', '/course/?active=overview')
    // check main section heading
    cy.get('[data-test=sectionTitle]').should('have.text', 'Overview');

    // check if overview is still selected and rendered after page reloaded
    cy.reload();
    cy.get('[data-test=overviewNavItem]').should('have.text', '* Overview');
    cy.url().should('include', '/course/?active=overview')
    cy.get('[data-test=sectionTitle]').should('have.text', 'Overview');

  });

  it.skip('syllabus', function() {
    // click on navbar
    cy.get('[data-test=syllabusNavItem]').click();
    // check if selected navbar is prepended with *
    cy.get('[data-test=syllabusNavItem]').should('have.text', '* Syllabus');
    // check url
    cy.url().should('include', '/course/?active=syllabus')
    // check main section heading
    cy.get('[data-test=sectionTitle]').should('have.text', 'Syllabus');

    // check if syllabus is still selected and rendered after page reloaded
    cy.reload();
    cy.get('[data-test=syllabusNavItem]').should('have.text', '* Syllabus');
    cy.url().should('include', '/course/?active=syllabus')
    cy.get('[data-test=sectionTitle]').should('have.text', 'Syllabus');
  });

  it.skip('grades', function() {
    // click on navbar
    cy.get('[data-test=gradesNavItem]').click();
    // check if selected navbar is prepended with *
    cy.get('[data-test=gradesNavItem]').should('have.text', '* Grades');
    // check url
    cy.url().should('include', '/course/?active=grades')
    // check main section heading
    cy.get('[data-test=sectionTitle]').should('have.text', 'Grades');

    // check if syllabus is still selected and rendered after page reloaded
    cy.reload();
    cy.get('[data-test=gradesNavItem]').should('have.text', '* Grades');
    cy.url().should('include', '/course/?active=grades')
    cy.get('[data-test=sectionTitle]').should('have.text', 'Grades');
  });

  it.skip('assignments onclick', function() {
    
    // click on navbar
    cy.get('[data-test=assignmentsAccordion]').click();
    cy.get('.homeLeftNav > :nth-child(4)').click();
    
    // check url
    cy.get('.courseLeftNav > :nth-child(8)').click();
    cy.get('[style="text-align: center; background-color: grey;"] > div').click();
    cy.get('#\\/_document1_heading').should('have.text', 'Assignment A3');
    cy.url().should('include', '/course/?active=assignments&assignmentId=12248');

    // check if assignment 3 is still selected and rendered after page reloaded
    cy.reload();
    cy.url().should('include', '/course/?active=assignments&assignmentId=12248');
    cy.get('#\\/_document1_heading').should('have.text', 'Assignment A3');
  })

  it.skip('assignments outline type sort order', function(){
    // click on navbar
    cy.get('[data-test=assignmentsAccordion]').click();
    cy.get('.homeLeftNav > :nth-child(4)').click();
    cy.get('[style="text-align: center; background-color: grey;"] > div').click();

    cy.get('select').select("Assignment Date");
    cy.get('.courseLeftNav > :nth-child(3)').should('have.text', 'Assignment A1');

    cy.get('select').select("Due Date");
    cy.get('.courseLeftNav > :nth-child(3)').should('have.text', 'Assignment A3');
  })

})