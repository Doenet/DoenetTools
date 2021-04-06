import { exportAllDeclaration } from "@babel/types";

Cypress.Commands.add('dragTo', {prevSubject: "element"}, (itemId, targetId) => {
    cy.wrap(itemId).trigger("dragstart", {force: true});
    cy.get(targetId).trigger("drop", {force: true});
})

describe('DoenetChooser tests', function () {

  /*
  1. check if publish indication works properly with title changed or just or content
  2. check if document title is changed based on the title input
  */
  beforeEach(() => {
    cy.fixture('chooserSeed').then((seed) => {
      this.seed = seed;
      cy.request('POST', 'api/cypressCleanupChooser.php', this.seed).then((response) => {
        cy.log(response);
        cy.request('POST', 'api/cypressSetupChooser.php', this.seed).then((response) => {
          cy.log(response);
          cy.visit('/chooser')
        })
      })
    })
  })
  it('chooser item click test', function() {
    // item should be selected when clicked
    cy.get('[data-cy=testContentBranchId]').click({force: true});
    cy.get('[data-cy=testContentBranchId]').should('have.class', 'browserSelectedRow');;
  });

  it('info panel test', function() {
    // info panel should display selected item information
    cy.get('[data-cy=testContentBranchId]').click({force: true});
    cy.get('[data-cy=testContentBranchId] > .browserItemName > span').invoke('text')
    .then((itemTitle) => {
      cy.get('[data-cy=infoPanelTitle] > span').invoke('text').then((infoPanelTitle) => {
        expect(infoPanelTitle).eq(itemTitle);
      })
    })

    // edit button should open up editor to edit selected item when clicked
    // cy.get('[data-cy="editContentButton"]').click();
    // cy.url().should('include', '/editor');
  });

  it('new document button', function() {
    // check if new content menu is visible onclick    
    cy.get('[data-cy=newContentButton]').click();
    cy.get('[data-cy=newContentMenu]').should('be.visible');

    // click on anywhere on the screen to close menu
    cy.get('[data-cy=newContentButton]').click()
    cy.get('[data-cy=newContentMenu]').should('not.be.visible');

    // click on new document button
    cy.get('[data-cy=newContentButton]').click();
    cy.get('[data-cy=newDocumentButton]').click();
    cy.wait(3000);
    cy.url().should('include', '/editor');
  });

  it('create new course', function() {    
    cy.get('[data-cy=newContentButton]').click();
    cy.get('[data-cy=newCourseButton]').click();

    cy.get('[data-cy=newCourseFormNameInput]').type("TestCypressCourseName");
    cy.get('[data-cy=newCourseFormDepInput]').type("TestCypressCourseDepartment");
    cy.get('[data-cy=newCourseFormCodeInput]').type("TestCypressCourseCode");
    cy.get('[data-cy=newCourseFormSectionInput]').type("001");
    cy.get('[data-cy=newCourseFormYearInput]').type("2019");
    cy.get('[data-cy=newCourseFormDescInput]').type("TestCypressCourseDescription");

    cy.get('[data-cy=newCourseFormSubmitButton]').click();
  });

  it('folder navigation', function() {
    // double click should open up folder
    cy.get('[data-cy=testFolderId2]').should('not.be.visible');
    cy.get('[data-cy=testFolderId1]').dblclick({force: true});
    cy.get('[data-cy=breadcrumbtestFolderId1]').should('be.visible');
    cy.get('[data-cy=breadcrumbtestFolderId2]').should('not.be.visible');
    cy.get('[data-cy=testFolderId2]').dblclick();
    cy.get('[data-cy=breadcrumbtestFolderId2]').should('be.visible');

    // double click on ... should go up to parent directory
    cy.get('[data-cy=upOneDirectory]').dblclick();
    cy.get('[data-cy=breadcrumbtestFolderId1]').should('be.visible');

    // jumping through breadcrumb
    cy.get('[data-cy=testFolderId2]').dblclick();
    cy.get('[data-cy=breadcrumbtestFolderId1]').click();
    cy.get('[data-cy=breadcrumbtestFolderId1]').should('be.visible');
    cy.get('[data-cy=breadcrumbtestFolderId2]').should('not.be.visible');
    
    cy.get('[data-cy=breadcrumbbase]').dblclick();
    cy.get('[data-cy=breadcrumbtestFolderId1]').should('not.be.visible');
    cy.get('[data-cy=breadcrumbtestFolderId2]').should('not.be.visible');
  });

  it('moving folders and content', function() {
    // moving content into folder
    cy.get('[data-cy=testContentBranchId]').click({force: true});
    cy.get('[data-cy=testContentBranchId]').dragTo('[data-cy=testFolderId1]');
    cy.get('[data-cy=testContentBranchId]').should('not.be.visible');
    cy.get('[data-cy=testFolderId1]').dblclick({force: true});
    cy.get('[data-cy=testContentBranchId]').should('be.visible');

    // moving content out of folder
    cy.get('[data-cy=testContentBranchId]').click();
    cy.get('[data-cy=testContentBranchId]').dragTo('[data-cy=upOneDirectory]');
    cy.get('[data-cy=testContentBranchId]').should('not.be.visible');
    cy.get('[data-cy=upOneDirectory]').dblclick({force: true});
    cy.get('[data-cy=testContentBranchId]').click({force: true});
    cy.get('[data-cy=testContentBranchId] > .browserItemName > span').invoke('text')
    .then((itemTitle) => {
      cy.get('[data-cy=infoPanelTitle] > span').invoke('text').then((infoPanelTitle) => {
        expect(infoPanelTitle).eq(itemTitle);
      })
    })

    // moving folder out of a folder
    cy.get('[data-cy=testFolderId2]').should('not.be.visible');
    cy.get('[data-cy=testFolderId1]').dblclick({force: true});
    cy.get('[data-cy=testFolderId2]').dragTo('[data-cy=upOneDirectory]');
    cy.get('[data-cy=testFolderId2]').should('not.be.visible');
    cy.get('[data-cy=upOneDirectory]').dblclick({force: true});
    cy.get('[data-cy=testFolderId2]').click({force: true});
    cy.get('[data-cy=testFolderId2] > .browserItemName > div > span').invoke('text')
    .then((itemTitle) => {
      cy.get('[data-cy=infoPanelTitle] > span').invoke('text').then((infoPanelTitle) => {
        expect(infoPanelTitle).eq(itemTitle);
      })
    })
  });
})