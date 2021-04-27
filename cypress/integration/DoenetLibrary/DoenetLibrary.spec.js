import { expect } from "chai";

describe("Library", function () {
  beforeEach(() => {
    cy.visit('/library');
  });

  it('CreateNewCourse', function() {
    cy.get('[data-cy=createNewCourseButton]').click();
    cy.get(':nth-child(1) > [data-cy=navDriveHeader]').should('exist');
  });

  it('ClickOnCourse', function() {
    cy.get(':nth-child(1) > [data-cy=navDriveHeader]').click();

    // Check for drive title equality across nav panel and breadcrumb
    cy.get(':nth-child(1) > [data-cy=navDriveHeader]').invoke('text').then(navDriveTitle => {
      cy.get('[data-cy=breadcrumbDriveColumn]').invoke('text').then(breadcrumbDriveTitle => {
        expect(navDriveTitle.trim()).equal(breadcrumbDriveTitle.trim());
      })
    })
  });
});

/*
Single-click on "Create a New Course" button in infoPanel
- new course Untitled should be created


Single-click an item (DoenetML/Folder) in table
- right infoPanel should display item name
- item should be highlighted

Double-click a DoenetML item
- should open up editor

Double-click a Folder item
- should toggle open/close



*/