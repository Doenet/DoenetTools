import { exportAllDeclaration } from "@babel/types";

describe('DoenetChooser tests', function () {

  /*
  1. check if publish indication works properly with title changed or just or content
  2. check if document title is changed based on the title input
  */
  beforeEach(() => {
    cy.visit('/chooser')
  })

  it('chooser item click test', function() {
    // item should be selected when clicked
    cy.get(':nth-child(2) > .browserItemName').click();
    cy.get(':nth-child(2) > .browserItemName').parent().should('have.class', 'browserSelectedRow');
  });

  it('info panel test', function() {
    // info panel should display selected item information
    cy.get(':nth-child(2) > .browserItemName').click();
    cy.get('.browserSelectedRow > .browserItemName > span').invoke('text')
    .then((text1) => {
      cy.get('.infoPanelTitle > span').invoke('text').then((text2) => {
        expect(text1).eq(text2);
      })
    })

    // edit button should open up editor to edit selected item when clicked
    cy.get('[data-cy=editContentButton]').click();
    cy.url().should('include', '/editor');
  });

  it('new document button', function() {
    // check if new content menu is visible onclick    
    cy.get('[data-cy=newContentButton]').click();
    cy.get('[data-cy=newContentMenu]').should('be.visible');

    // click on anywhere on the screen to close menu
    cy.get('.infoPanelTitle').click();
    cy.get('[data-cy=newContentMenu]').should('not.be.visible');

    // click on new document button
    cy.get('[data-cy=newContentButton]').click();
    cy.get('[data-cy=newDocumentButton]').click();
    cy.url().should('include', '/editor');
  });

  it('create new course', function() {    
    cy.get('[data-cy=newContentButton]').click();
    cy.get('[data-cy=newCourseButton]').click();
    cy.get('#topToolbar > span').contains('Add New Course');

    cy.get('[data-cy=newCourseFormNameInput]').type("TestCypressCourseName");
    cy.get('[data-cy=newCourseFormDepInput]').type("TestCypressCourseDepartment");
    cy.get('[data-cy=newCourseFormCodeInput]').type("TestCypressCourseCode");
    cy.get('[data-cy=newCourseFormSectionInput]').type("001");
    cy.get('[data-cy=newCourseFormYearInput]').type("2019");
    cy.get('[data-cy=newCourseFormDescInput]').type("TestCypressCourseDescription");

    cy.get('[data-cy=newCourseFormSubmitButton]').click();

    // info panel should display created course info
    cy.get('.infoPanelTitle > span').contains("TestCypressCourseName");
  });
})