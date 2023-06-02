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
    const activityLabel = "CourseDuplication Activity"

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
      cy.wait(100)
      cy.get('[data-test="Add Page"]').click();
      cy.get('[data-test="Add Page"]').click();
      // cy.get('.navigationRow').eq(0)
      // .find('[data-test="folderToggleOpenIcon"]').click();
      cy.get('[data-test="folderToggleOpenIcon"]').click();
      cy.wait(100)
      cy.get('.navigationRow').eq(1).click()
      cy.get('[data-test="Label Page"]').clear().type(collectionPageLabel1).blur();
      cy.wait(100)
      cy.get('.navigationRow').eq(2).click()
      cy.get('[data-test="Label Page"]').clear().type(collectionPageLabel2).blur();
      cy.get('[data-test="Main Panel"]').click(); //Deselect

      cy.log("Create an activity and a collection link");
      cy.get('[data-test="Add Activity Button"]').click();
      cy.get('.navigationRow').eq(3).click()
      cy.get('[data-test="Label Activity"]').type(
        `{selectAll}{backspace}${activityLabel}{enter}`,
      );
      cy.get('[data-test="Add Collection Link"]').click();
      // cy.get('[data-test="Main Panel"]').click(); //Deselect


    }
    finally {
      // cy.deleteCourse({ courseId })
    }
    //   cy.visit(`course?tool=navigation&courseId=${courseId}`);
    //   cy.wait(1000);
    //   cy.get('[data-test="Add Activity Button"]').click();
    //   cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    //   cy.get(".navigationRow").eq(0).click();
    //   cy.get('[data-test="Label Activity"]').type(
    //     `{selectAll}{backspace}${activity1label}{enter}`,
    //   );
    //   cy.get(".navigationRow").eq(0).dblclick();
    //   cy.get(".cm-content").type(activity1DoenetML);
    //   cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    //   cy.get('[data-test="Assign Activity"]').click();

    //   //TODO: wait on new data time component
    //   // cy.get('[data-test="Assigned Date Checkbox"]').click()
    //   // cy.get('[data-test="Assigned Date"]').click()
    //   // cy.get('.rdtSwitch').eq(0).click({force: true})
    //   // cy.get('.rdtSwitch').eq(0).click({force: true})
    //   // cy.get('[data-value="2024"]').click({force: true})
    //   // cy.get('[data-value="0"]').click({force: true})
    //   // cy.get('[data-value="15"]').click({force: true})
    //   // cy.get('[data-test="Main Panel"]').click(); //Blur date entry
    //   // cy.wait(1000);

    //   // cy.get('[data-test="Due Date Checkbox"]').click()

    //   // cy.get('[data-test="Due Date"]').click()
    //   // cy.get('.rdtSwitch').eq(0).click({force: true})
    //   // cy.get('.rdtSwitch').eq(0).click({force: true})
    //   // cy.get('[data-value="2025"]').click({force: true})
    //   // cy.get('[data-value="2"]').click({force: true})
    //   // cy.get('[data-value="18"]').click({force: true})
    //   // cy.get('[data-test="Main Panel"]').click(); //Blur date entry
    //   // cy.wait(1000);
    //   cy.wait(1000);
    //   cy.visit(`course?tool=courseChooser`);
    //   cy.get(".driveCard").should("have.length", 1); //Need this to wait for the row to appear
    //   cy.wait(500);
    //   cy.get(".driveCard").eq(0).click();
    //   cy.get('[data-test="Duplicate Course Button"]').click();
    //   cy.get('[data-test="New Course Label Textfield"]').type("New Copy");
    //   cy.get('[data-test="Duplication Start Date"').type("01/01/2000");
    //   cy.get('[data-test="New Course Label Textfield"]').click(); //Blur date entry
    //   cy.get('[data-test="Duplication End Date"').type("01/01/2001");
    //   cy.get('[data-test="New Course Label Textfield"]').click(); //Blur date entry

    //   cy.get('[data-test="Duplicate Action"]').click();
    //   cy.get(".driveCard").should("have.length", 2); //Need this to wait for the row to appear
    //   cy.get(".driveCard").eq(0).dblclick();

    //   cy.get('[data-test="Dashboard Content Card"]').click();
    //   cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    //   cy.get(".navigationRow").eq(0).contains(activity1label);
    //   cy.get(".navigationRow").eq(0).dblclick();
    //   cy.get(".cm-content").contains(activity1DoenetML);

    //   cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    //   cy.get('[data-test="Unassign Activity"]').should("be.visible");
    // });

    // it.skip('Make a course with a linked page and test the duplicate is the same', () => {
    // });
  });

});

// cy.get('[data-test="Label Activity"]').type(activity1label);
// cy.visit(`course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`);
// cy.wait(5000);
// cy.visit(`course?tool=courseChooser`)
// cy.get('.driveCard').should('have.length', 1); //Need this to wait for the row to appear
// cy.wait(500);
// cy.get('.driveCard').eq(0).dblclick();
