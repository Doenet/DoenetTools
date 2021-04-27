
describe("Library", function () {
  beforeEach(() => {
    cy.visit('/library');
  });

  it('CreateNewCourse', function() {
    cy.get('[data-cy=createNewCourseButton]').click();

    // Check if new course exists


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