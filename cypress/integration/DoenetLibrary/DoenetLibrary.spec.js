import { expect } from "chai";

describe("Library", function () {
  beforeEach(() => {
    cy.visit('/library');
  });

  it('Creating a new course by clicking the create a new course button', function() {
    cy.get('[data-cy=createNewCourseButton]').click();
    cy.get(':nth-child(1) > [data-cy=navDriveHeader]').should('exist');
  });

  it('Clicking on a course in the Nav Panel should select it and open it up in the drive', function() {
    cy.get(':nth-child(1) > [data-cy=navDriveHeader]').click();

    // Check for drive title equality across nav panel and breadcrumb
    cy.get(':nth-child(1) > [data-cy=navDriveHeader]').invoke('text').then(navDriveTitle => {
      cy.get('[data-cy=breadcrumbDriveColumn]').invoke('text').then(breadcrumbDriveTitle => {
        expect(navDriveTitle.trim()).equal(breadcrumbDriveTitle.trim());
      })
    })
  });

  it('Selecting a course then creating a new folder', function() {
    cy.get(':nth-child(1) > [data-cy=navDriveHeader]').click();
    cy.get('[data-cy=addFolderButton]').click();

    // Verify item existence and type
    cy.get(':nth-child(1) > [data-cy=driveItem]').should('exist');
    cy.get(':nth-child(1) > [data-cy=driveItem]').within(() => {
      cy.get('[data-cy=folderIcon]').should('exist');
    });    
  })


});

/*

Single-click an item (DoenetML/Folder) in table
- right infoPanel should display item name
- item should be highlighted

Double-click a DoenetML item
- should open up editor

Double-click a Folder item
- should toggle open/close



*/