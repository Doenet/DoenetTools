const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

describe("Duplicate Course", function () {
  const userId = "cyuserId";
  const defaultCourseLabel = "Untitled Course"


  beforeEach(() => {
    cy.signin({ userId });
    cy.visit("/")
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("Adding and Renaming a Course", () => {
    const renamedCourseLabel = "Rename a Course Test"

    cy.log("Clean up from the last run")
    cy.deleteCourse({ label: renamedCourseLabel })

    cy.get('[data-test="My Courses"]').click();
    cy.get('[data-test="Add Course"]').click();
    cy.get('[data-test="Confirm Add Course"]').click();
    //Assumes it's the left most "Untitled Course" is the one cypress made
    cy.log("Create a new course and label it")
    cy.get('[data-test="My Courses"]').click();
    cy.get('[data-test="Course Card"]')
      .contains(defaultCourseLabel)
      .eq(0)
      .parent()
      .parent()
      .find('[data-test="Card Menu Button"]').click()
      .parent()
      .find('[data-test="Course Settings MenuItem"]').click();
    cy.get('#label').clear().type(renamedCourseLabel).blur();
    cy.get('.chakra-modal__close-btn').click();

    cy.get('[data-test="Course Card"]').contains(renamedCourseLabel)

  });

  it("Adding and Delete a Course", () => {
    const deleteMeCourseLabel = "Delete Me Course Test"

    cy.log("Clean up from the last run")
    cy.deleteCourse({ label: deleteMeCourseLabel })

    cy.get('[data-test="My Courses"]').click();
    cy.get('[data-test="Add Course"]').click();
    cy.get('[data-test="Confirm Add Course"]').click();
    //Assumes it's the left most "Untitled Course" is the one cypress made
    cy.log("Create a new course and label it")
    cy.get('[data-test="My Courses"]').click();
    cy.get('[data-test="Course Card"]')
      .contains(defaultCourseLabel)
      .eq(0)
      .parent()
      .parent()
      .find('[data-test="Card Menu Button"]').click()
      .parent()
      .find('[data-test="Course Settings MenuItem"]').click();
    cy.get('#label').clear().type(deleteMeCourseLabel).blur();
    cy.get('.chakra-modal__close-btn').click();

    cy.get('[data-test="Course Card"]').contains(deleteMeCourseLabel)

    cy.log("Delete the course")
    cy.get('[data-test="Course Card"]')
      .contains(deleteMeCourseLabel)
      .eq(0)
      .parent()
      .parent()
      .find('[data-test="Card Menu Button"]').click()
      .parent()
      .find('[data-test="Course Delete MenuItem"]').click();

    cy.get('[data-test="Course Delete Button"]').click();
    cy.get('[data-test="Course Card"]').contains(deleteMeCourseLabel).should('not.exist')


  });

  it("Adding and Change the image of a Course", () => {
    const changeImageCourseLabel = "Change Image Course Test"
    const pictureChoice = "picture5.jpg"
    const colorChoice = "3D5A80"
    const rgbColorChoice = hexToRgb(colorChoice);

    cy.log("Clean up from the last run")
    cy.deleteCourse({ label: changeImageCourseLabel })

    cy.get('[data-test="My Courses"]').click();
    cy.get('[data-test="Add Course"]').click();
    cy.get('[data-test="Confirm Add Course"]').click();
    //Assumes it's the left most "Untitled Course" is the one cypress made
    cy.log("Create a new course and label it")
    cy.get('[data-test="My Courses"]').click();
    cy.get('[data-test="Course Card"]')
      .contains(defaultCourseLabel)
      .eq(0)
      .parent()
      .parent()
      .find('[data-test="Card Menu Button"]').click()
      .parent()
      .find('[data-test="Course Settings MenuItem"]').click();

    cy.get('#label').clear().type(changeImageCourseLabel).blur();
    cy.get('[data-test="Choose Image Trigger"]').click();
    cy.get(`[data-test="Card Image ${pictureChoice}"]`).click();
    cy.get('[data-test="Choose Image Trigger"]').click();

    cy.get('.chakra-modal__close-btn').click();

    cy.log("Does it have the right image?")

    cy.get('[data-test="Course Card"]')
      .contains(changeImageCourseLabel)
      .eq(0)
      .parent()
      .parent()
      .parent()
      .parent()
      .find('[data-test="Card Image Link"]')
      .should('have.attr', 'src', `/drive_pictures/${pictureChoice}`)

    cy.log("Test Color instead of image")

    cy.get('[data-test="Course Card"]')
      .contains(changeImageCourseLabel)
      .eq(0)
      .parent()
      .parent()
      .find('[data-test="Card Menu Button"]').click()
      .parent()
      .find('[data-test="Course Settings MenuItem"]').click();

    cy.get('[data-test="Choose Image Trigger"]').click();
    cy.get(`[data-test="Card Color ${colorChoice}"]`).click();
    cy.get('[data-test="Choose Color Trigger"]').click();

    cy.get('.chakra-modal__close-btn').click();

    cy.get('[data-test="Course Card"]')
      .contains(changeImageCourseLabel)
      .eq(0)
      .parent()
      .parent()
      .parent()
      .parent()
      .find('[data-test="Card Color Link"]')
      .should('have.css', 'background-color', rgbColorChoice)


  });

  it.skip("Add Course Cancel", () => {
    //Test that course count is the same
    cy.log("Cancel adding a course")
    cy.get('[data-test="My Courses"]').click();

    cy.get('[data-test="Course Card"]').then(($cards) => {
      const numCardsBefore = $cards.length;
      cy.log(`${numCardsBefore} courses`)
      cy.get('[data-test="Add Course"]').click();
      cy.get('[data-test="Cancel Add Course"]').click();
      // cy.get('[data-test="Confirm Add Course"]').click();
      // cy.get('[data-test="Course Card"]').should(($cardsAfter) => {
      //   expect($cardsAfter.length).to.eq(numCardsBefore);
      // });
    })

  });
});
