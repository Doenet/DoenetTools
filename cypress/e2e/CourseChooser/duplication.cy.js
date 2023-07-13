describe("Duplicate Course", function () {
  const userId = "cyuserId";
  const defaultCourseLabel = "Untitled Course"


  before(() => {
    cy.signin({ userId });
    cy.visit("/")

  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("Duplicate a course with assigned content", () => {
    const sourceCourseLabel = "Duplication Test Source"
    const duplicateCourseLabel = "Duplication Test Duplicate"
    const collectionLabel = "CourseDuplication Collection 1"
    const collectionPageLabel1 = "CourseDuplication Page 1"
    const collectionPageLabel2 = "CourseDuplication Page 2"
    const collectionPageLabel3 = "CourseDuplication Page 3"
    const collectionPageLabel4 = "CourseDuplication Page 4"
    const collectionPageLabel5 = "CourseDuplication Page 5"
    const activityLabel = "CourseDuplication Activity"
    const collectionLinkLabel = "CourseDuplication Collection Link"

    cy.log("Clean up from the last run")

    cy.deleteCourse({ label: sourceCourseLabel })
    cy.deleteCourse({ label: duplicateCourseLabel })

    cy.get('[data-test="My Courses"]').click();
    cy.get('[data-test="Add Course"]').click();
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
    cy.get('#label').clear().type(sourceCourseLabel).blur();
    cy.get('.chakra-modal__close-btn').click();

    cy.log("Enter Course and make a collection")
    //Assumes it's the left most sourceCourseLabel is the one this cypress test made
    cy.get('[data-test="Course Card"]')
      .contains(sourceCourseLabel)
      .eq(0)
      .parent()
      .parent()
      .parent()
      .parent()
      .find('[data-test="Card Image Link"]').click();


    cy.get('[data-test="Dashboard Content Card"]').click();
    cy.get('[data-test="Add Collection Button"]').click();

    cy.log("Label the collection and two pages")
    cy.get('.navigationRow').eq(0).click()
    cy.get('[data-test="Collection Textfield"]').clear().type(collectionLabel).blur();
    cy.wait(200)
    cy.get('[data-test="Add Page"]').click();
    cy.wait(200)
    cy.get('[data-test="Add Page"]').click();
    cy.wait(200)
    cy.get('[data-test="Add Page"]').click();
    cy.wait(200)
    cy.get('[data-test="Add Page"]').click();
    cy.wait(200)
    cy.get('[data-test="Add Page"]').click();

    cy.get('[data-test="folderToggleOpenIcon"]').click();
    cy.wait(200)
    cy.get('.navigationRow').eq(1).click()
    cy.get('[data-test="Label Page"]').clear().type(collectionPageLabel1).blur();
    cy.wait(100)
    cy.get('.navigationRow').eq(2).click()
    cy.get('[data-test="Label Page"]').clear().type(collectionPageLabel2).blur();
    cy.wait(100)
    cy.get('.navigationRow').eq(3).click()
    cy.get('[data-test="Label Page"]').clear().type(collectionPageLabel3).blur();
    cy.wait(100)
    cy.get('.navigationRow').eq(4).click()
    cy.get('[data-test="Label Page"]').clear().type(collectionPageLabel4).blur();
    cy.wait(100)
    cy.get('.navigationRow').eq(5).click()
    cy.get('[data-test="Label Page"]').clear().type(collectionPageLabel5).blur();
    cy.wait(100)

    cy.get('[data-test="Main Panel"]').click(); //Deselect

    cy.log('add simple content for each page');
    cy.get('.navigationRow').eq(1).dblclick()
    cy.get(".cm-content").type(
      `<title>${collectionPageLabel1}</title>{enter}<p>What is your name? <textinput name="name" /></p>{enter}`,
    );
    cy.go('back')
    cy.get('.navigationRow').eq(2).dblclick()
    cy.get(".cm-content").type(
      `<title>${collectionPageLabel2}</title>{enter}<p>What is your name? <textinput name="name" /></p>{enter}`,
    );
    cy.go('back')
    cy.get('.navigationRow').eq(3).dblclick()
    cy.get(".cm-content").type(
      `<title>${collectionPageLabel3}</title>{enter}<p>What is your name? <textinput name="name" /></p>{enter}`,
    );
    cy.go('back')
    cy.get('.navigationRow').eq(4).dblclick()
    cy.get(".cm-content").type(
      `<title>${collectionPageLabel4}</title>{enter}<p>What is your name? <textinput name="name" /></p>{enter}`,
    );
    cy.go('back')
    cy.get('.navigationRow').eq(5).dblclick()
    cy.get(".cm-content").type(
      `<title>${collectionPageLabel5}</title>{enter}<p>What is your name? <textinput name="name" /></p>{enter}`,
    );
    cy.go('back')

    cy.log("Create an activity with only a collection link");
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get('.navigationRow').eq(6).click()
    cy.get('[data-test="Label Activity"]').type(
      `{selectAll}{backspace}${activityLabel}{enter}`,
    );
    cy.get('[data-test="Add Collection Link"]').click();
    cy.get('.navigationRow').eq(6).find('[data-test="folderToggleOpenIcon"]').click();
    cy.get('.navigationRow').eq(7).click();
    cy.get('[data-test="Delete Page"]').click();
    cy.get('.navigationRow').eq(7).click();
    cy.get('[data-test="Label Collection"]').clear().type(collectionLinkLabel).blur();
    cy.get('[data-test="Collection Link Selector"]').select(0);

    cy.log("Assign the activity")
    cy.get('.navigationRow').eq(6).click();
    cy.get('[data-test="Assign Activity"]').click();

    cy.log("duplicate the course and test results")
    cy.get('[data-test="Crumb 0"] ').click();
    cy.get('[data-test="Course Card"]')
      .contains(sourceCourseLabel)
      .eq(0)
      .parent()
      .parent()
      .find('[data-test="Card Menu Button"]').click()
      .parent()
      .find('[data-test="Course Duplicate MenuItem"]').click();

    cy.get('[data-test="Duplicate Course Label Textfield"]').clear().type(duplicateCourseLabel).blur();
    cy.get('[data-test="Duplicate Course Start Date"]').clear().type("2030-12-01");
    cy.get('[data-test="Duplicate Course End Date"]').clear().type("2030-12-01");
    cy.get('[data-test="Duplicate Submit Button"]').click();
    cy.wait(200)

    cy.get('[data-test="Course Card"]')
      .contains(duplicateCourseLabel)
      .eq(0)
      .parent()
      .parent()
      .parent()
      .parent()
      .find('[data-test="Card Image Link"]').click();

    cy.get('[data-test="Dashboard Content Card"]').click();
    cy.get('.navigationRow').eq(0).find('[data-test="folderToggleOpenIcon"]').click();
    cy.get('.navigationRow').eq(6).find('[data-test="folderToggleOpenIcon"]').click();
    cy.get('.navigationRow').eq(7).find('[data-test="folderToggleOpenIcon"]').click();

    cy.get('.navigationRow').eq(0).contains(collectionLabel);
    cy.get('.navigationRow').eq(1).contains(collectionPageLabel1);
    cy.get('.navigationRow').eq(2).contains(collectionPageLabel2);
    cy.get('.navigationRow').eq(3).contains(collectionPageLabel3);
    cy.get('.navigationRow').eq(4).contains(collectionPageLabel4);
    cy.get('.navigationRow').eq(5).contains(collectionPageLabel5);
    cy.get('.navigationRow').eq(6).contains(activityLabel);
    cy.get('.navigationRow').eq(7).contains(collectionLinkLabel);
    cy.get('.navigationRow').eq(8).contains(`Link to ${collectionPageLabel1}`);
    cy.get('.navigationRow').eq(9).contains(`Link to ${collectionPageLabel2}`);

  });

});
