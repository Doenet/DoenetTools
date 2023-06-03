describe("Duplicate Course", function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";
  const activity1label = "Activity 1";
  const activity1DoenetML = "This is Activity 1";

  before(() => {
    cy.signin({ userId });
    cy.visit("/")
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    // cy.clearAllOfAUsersCoursesAndItems({ userId: studentUserId });
    // cy.createCourse({ userId, courseId, studentUserId });
    // cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId });
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("Make a course with one assignment and test the duplicate is the same", () => {
    const collectionLabel = "CourseDuplication Collection 1"
    const collectionPageLabel1 = "CourseDuplication Page 1"
    const collectionPageLabel2 = "CourseDuplication Page 2"
    const collectionPageLabel3 = "CourseDuplication Page 3"
    const collectionPageLabel4 = "CourseDuplication Page 4"
    const collectionPageLabel5 = "CourseDuplication Page 5"
    const activityLabel = "CourseDuplication Activity"
    const collectionLinkLabel = "CourseDuplication Collection Link"
    const duplicateCourseLabel = "CourseDuplication Duplicate"


    try {
      cy.log("Create a new course and label it")
      cy.get('[data-test="My Courses"]').click();
      cy.get('[data-test="createCourse"]').click();
      cy.get('[data-test="Course Card"]').eq(0).click();
      cy.get('[data-test="Course Label Textfield"]').clear().type("Source").blur();

      cy.log("Enter Course and make a collection")
      cy.get('[data-test="Enter Course nav button"]').click();
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


      cy.log("duplicate the course and test results")
      cy.get('[data-test="Crumb 0"] ').click();
      cy.get('#card-label').click();
      cy.get('[data-test="Duplicate Course Button"]').click();
      cy.get('[data-test="New Course Label Textfield"]').clear().type(duplicateCourseLabel).blur();
      cy.get('[data-test="Duplication Start Date"]').clear().type("01/01/2030{enter}");
      cy.get('[data-test="Duplication End Date"]').clear().type("12/01/2030{enter}");
      cy.get('[data-test="Duplicate Action"]').click();
      cy.wait(200)

      cy.get('#card-label').eq(0).dblclick();
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
    }
    finally {
      // cy.deleteCourse({ courseId })
    }

  });

});
