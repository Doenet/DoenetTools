
describe("Course Editor Tests", function () {

  before(() => {
  });

  beforeEach(() => {
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  //TODO: not sure how to handle alert when button is pushed
  it.skip("DoenetML Code Copy", () => {
    const userId = "cyuserId";
    const studentUserId = "cyStudentUserId";
    const courseId = "courseid20";

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.log('Add single page activity')
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get(".navigationRow").last().dblclick();
    cy.get(".cm-content").type("TESTING!");
    cy.get('[data-test="Viewer Update Button"]');
    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Copy DoenetML embed link"]').click();
    cy.contains('button', 'Copy to clipboard').click()
    // cy.get('[data-test="Alert Title"]').contains("Embed Link Copied to Clipboard");
    // win.navigator.clipboard.readText().then((text) => {
    //   console.log("Clipboard content: " + text);
    //   // You can add your assertions here
    // });
  });

  it("Rename Activity", () => {
    const activity1Label = "Renamed Activity 1";
    const activity1Labelb = "Renamed Activity 1 2nd time";
    const userId = "cyuserId";
    const studentUserId = "cyStudentUserId";
    const courseId = "courseid2";

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.log('Add single page activity')
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get(".navigationRow").last().dblclick();
    cy.get('[data-test="Editable Activity Label Preview"]').click();
    cy.get('[data-test="Editable Activity Label Input"]').clear().type(activity1Label).blur();
    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Activity Label"]').should("have.value", activity1Label);
    cy.get('[data-test="Activity Label"]').clear().type(activity1Labelb).blur();
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get('[data-test="Editable Activity Label Preview"]').contains(activity1Labelb);
    cy.get('[data-test="Close"]').click();
    cy.get(".navigationRow").last().contains(activity1Labelb);
  });

  it("Rename Pages and Activity", () => {
    const activity1Label = "Renamed Mulitpage Activity 1";
    const activity1Labelb = "Renamed Mulitpage Activity 1 2nd time";
    const page1Label = "Renamed Mulitpage page 1";
    const page1Labelb = "Renamed Mulitpage page 1 2nd time";
    const page2Label = "Renamed Mulitpage page 2";
    const page2Labelb = "Renamed Mulitpage page 2 2nd time";
    const userId = "cyuserId";
    const studentUserId = "cyStudentUserId";
    const courseId = "courseid3";

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.log('Add multipage activity')
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get(".navigationRow").last().click();
    cy.get('[data-test="Add Page"]').click();
    cy.get(".navigationRow")
      .last()
      .get('[data-test="folderToggleOpenIcon"]')
      .click();
    cy.log("Upldate labels in the 2nd page's editor")
    cy.get(".navigationRow").last().dblclick();
    cy.get('[data-test="Editable Page Label Preview"]').click();
    cy.get('[data-test="Editable Page Label Input"]').clear().type(page2Label).blur();
    cy.get('[data-test="Editable Activity Label Preview"]').click();
    cy.get('[data-test="Editable Activity Label Input"]').clear().type(activity1Label).blur();
    cy.wait(500); //Needed as we don't yet have alerts in the editor tool yet
    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Activity Label"]').should("have.value", activity1Label);
    cy.get('[data-test="Activity Label"]').clear().type(activity1Labelb).blur();
    cy.get('[data-test="Alert Title"]').contains("Activity Label Updated");
    cy.get('[data-test="Page Label"]').should("have.value", page2Label);
    cy.get('[data-test="Page Label"]').clear().type(page2Labelb).blur();
    cy.get('[data-test="Alert Title"]').contains("Activity Page Label Updated");
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get('[data-test="Editable Activity Label Preview"]').contains(activity1Labelb);
    cy.get('[data-test="Editable Page Label Preview"]').contains(page2Labelb);
    cy.get('[data-test="Close"]').click();
    cy.get(".navigationRow").last().contains(page2Labelb);
    cy.get(".navigationRow").eq(-3).contains(activity1Labelb);
    cy.log("Upldate labels in the 1st page's editor")
    cy.get(".navigationRow").eq(-2).dblclick();
    cy.get('[data-test="Editable Activity Label Preview"]').contains(activity1Labelb);
    cy.get('[data-test="Editable Page Label Preview"]').should('not.contain', page2Labelb);
    cy.get('[data-test="Editable Page Label Preview"]').click();
    cy.get('[data-test="Editable Page Label Input"]').clear().type(page1Label).blur();
    cy.wait(500); //Needed as we don't yet have alerts in the editor tool yet
    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Activity Label"]').should("have.value", activity1Labelb);
    cy.get('[data-test="Page Label"]').should("have.value", page1Label);
    cy.get('[data-test="Page Label"]').clear().type(page1Labelb).blur();
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get('[data-test="Editable Activity Label Preview"]').contains(activity1Labelb);
    cy.get('[data-test="Editable Page Label Preview"]').contains(page1Labelb);
    cy.get('[data-test="Close"]').click();
    cy.get(".navigationRow").eq(-1).contains(page2Labelb);
    cy.get(".navigationRow").eq(-2).contains(page1Labelb);
    cy.get(".navigationRow").eq(-3).contains(activity1Labelb);
  });

  it("Learning Outcomes", () => {
    const userId = "cyuserId";
    const studentUserId = "cyStudentUserId";
    const courseId = "courseid3";
    const learningOutcome1 = "learning outcome 1";
    const learningOutcome2 = "learning outcome 2";
    const learningOutcome3 = "learning outcome 3";
    const learningOutcome4 = "learning outcome 4";
    const learningOutcome5 = "learning outcome 5";

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.log('Add single page activity')
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get(".navigationRow").last().dblclick();
    cy.get('[data-test="Controls Button"]').click();
    cy.log('Add five learning outcomes and blur or hit enter');
    // cy.get('[data-test="learning outcome 0"]').clear().type(learningOutcome1).blur(); //Blur doesn't trigger event
    cy.get('[data-test="learning outcome 0"]').clear().type(`${learningOutcome1}{enter}`);
    cy.get('[data-test="Alert Title"]').contains("Updated learning outcome #1.");

    cy.get('[data-test="add a learning outcome button"]').click();
    cy.get('[data-test="Alert Title"]').contains("Blank learning outcome added.");
    cy.get('[data-test="learning outcome 1"]').clear().type(`${learningOutcome2}{enter}`);
    cy.get('[data-test="Alert Title"]').contains("Updated learning outcome #2.");

    cy.get('[data-test="add a learning outcome button"]').click();
    cy.get('[data-test="Alert Title"]').contains("Blank learning outcome added.");
    cy.get('[data-test="learning outcome 2"]').clear().type(`${learningOutcome3}{enter}`);
    cy.get('[data-test="Alert Title"]').contains("Updated learning outcome #3.");

    cy.get('[data-test="add a learning outcome button"]').click();
    cy.get('[data-test="Alert Title"]').contains("Blank learning outcome added.");
    cy.get('[data-test="learning outcome 3"]').clear().type(`${learningOutcome4}{enter}`);
    cy.get('[data-test="Alert Title"]').contains("Updated learning outcome #4.");


    cy.get('[data-test="add a learning outcome button"]').click();
    cy.get('[data-test="Alert Title"]').contains("Blank learning outcome added.");
    cy.get('[data-test="learning outcome 4"]').clear().type(`${learningOutcome5}{enter}`);
    cy.get('[data-test="Alert Title"]').contains("Updated learning outcome #5.");

    cy.get('[data-test="Close Settings Button"]').click();
    cy.get('[data-test="Close"]').click();
    cy.get(".navigationRow").last().dblclick();
    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="learning outcome 0"]').should("have.value", learningOutcome1);
    cy.get('[data-test="learning outcome 1"]').should("have.value", learningOutcome2);
    cy.get('[data-test="learning outcome 2"]').should("have.value", learningOutcome3);
    cy.get('[data-test="learning outcome 3"]').should("have.value", learningOutcome4);
    cy.get('[data-test="learning outcome 4"]').should("have.value", learningOutcome5);

    cy.get('[data-test="delete learning outcome 0 button"]').click();
    cy.get('[data-test="Alert Title"]').contains("Deleted learning outcome #1.");
    cy.get('[data-test="learning outcome 0"]').should("have.value", learningOutcome2);
    cy.get('[data-test="learning outcome 1"]').should("have.value", learningOutcome3);
    cy.get('[data-test="learning outcome 2"]').should("have.value", learningOutcome4);
    cy.get('[data-test="learning outcome 3"]').should("have.value", learningOutcome5);

    cy.get('[data-test="delete learning outcome 2 button"]').click();
    cy.get('[data-test="Alert Title"]').contains("Deleted learning outcome #3.");
    cy.get('[data-test="learning outcome 0"]').should("have.value", learningOutcome2);
    cy.get('[data-test="learning outcome 1"]').should("have.value", learningOutcome3);
    cy.get('[data-test="learning outcome 2"]').should("have.value", learningOutcome5);

    cy.get('[data-test="delete learning outcome 2 button"]').click();
    cy.get('[data-test="Alert Title"]').contains("Deleted learning outcome #3.");
    cy.get('[data-test="learning outcome 0"]').should("have.value", learningOutcome2);
    cy.get('[data-test="learning outcome 1"]').should("have.value", learningOutcome3);

    cy.get('[data-test="delete learning outcome 1 button"]').click();
    cy.get('[data-test="Alert Title"]').contains("Deleted learning outcome #2.");
    cy.get('[data-test="learning outcome 0"]').should("have.value", learningOutcome2);

    cy.get('[data-test="delete learning outcome 0 button"]').click();
    cy.get('[data-test="Alert Title"]').contains("Deleted learning outcome #1.");
    cy.get('[data-test="learning outcome 0"]').should("have.value", "");
  });

  it("Assignment Assigned and Settings stay", () => {
    const userId = "cyuserId";
    const studentUserId = "cyStudentUserId";
    const courseId = "courseid4";

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.log('Add single page activity')
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get(".navigationRow").last().dblclick();
    cy.get('[data-test="Controls Button"]').click();

    cy.log('Assign the activity')
    cy.get('[data-test="Presentation Tab"]').click({ force: true });
    cy.get('[data-test="Assign Button"]').eq(0).click();
    cy.get('[data-test="Alert Title"]').contains("Activity is assigned.");

    cy.log('Presentation Controls')
    cy.get('[data-test="Individualize"] input').should('not.be.checked');
    cy.get('[data-test="Individualize"]').click();
    cy.get('[data-test="Alert Title"]').contains("Activity individualized.");
    cy.get('[data-test="Individualize"] input').should('be.checked');

    cy.get('[data-test="Show Solution"] input').should('be.checked');
    cy.get('[data-test="Show Solution"]').click();
    cy.get('[data-test="Alert Title"]').contains("Solution will be hidden for users taking activity.");
    cy.get('[data-test="Show Solution"] input').should('not.be.checked');

    cy.get('[data-test="Time Limit"] input').eq(0).should('not.be.checked');
    cy.get('[data-test="Time Limit"]').eq(0).click();
    cy.get('[data-test="Alert Title"]').contains("Time limit of 60 minutes for activity.");
    cy.get('[data-test="Time Limit"] input').eq(0).should('be.checked');
    cy.get('[data-test="Time Limit Increment button"]').click();
    cy.get('[data-test="Alert Title"]').contains("Time limited to 65 minutes for activity.");

    cy.get('[data-test="Show Feedback"] input').should('be.checked');
    cy.get('[data-test="Show Feedback"]').click();
    cy.get('[data-test="Alert Title"]').contains("User will not be shown feedback for activity.");
    cy.get('[data-test="Show Feedback"] input').should('not.be.checked');

    cy.get('[data-test="Show Hints"] input').should('be.checked');
    cy.get('[data-test="Show Hints"]').click();
    cy.get('[data-test="Alert Title"]').contains("User will not be shown hints for activity.");
    cy.get('[data-test="Show Hints"] input').should('not.be.checked');

    cy.get('[data-test="Show Correctness"] input').should('be.checked');
    cy.get('[data-test="Show Correctness"]').click();
    cy.get('[data-test="Alert Title"]').contains("User will not be shown correctness for activity.");
    cy.get('[data-test="Show Correctness"] input').should('not.be.checked');

    cy.get('[data-test="Show Credit Achieved"] input').should('be.checked');
    cy.get('[data-test="Show Credit Achieved"]').click();
    cy.get('[data-test="Alert Title"]').contains("User will not be shown credit achieved for activity.");
    cy.get('[data-test="Show Credit Achieved"] input').should('not.be.checked');

    cy.get('[data-test="Paginate"] input').should('be.checked');
    cy.get('[data-test="Paginate"]').click();
    cy.get('[data-test="Alert Title"]').contains("User will not be shown pagination for activity.");
    cy.get('[data-test="Paginate"] input').should('not.be.checked');

    cy.get('[data-test="Show Finish Button"] input').should('not.be.checked');
    cy.get('[data-test="Show Finish Button"]').click();
    cy.get('[data-test="Alert Title"]').contains("User will be shown finish button for activity.");
    cy.get('[data-test="Show Finish Button"] input').should('be.checked');

    cy.get('[data-test="AutoSubmit"] input').should('not.be.checked');
    cy.get('[data-test="AutoSubmit"]').click();
    cy.get('[data-test="Alert Title"]').contains("User will automatically submit activity.");
    cy.get('[data-test="AutoSubmit"] input').should('be.checked');

    cy.get('[data-test="Can View After Completed"] input').should('be.checked');
    cy.get('[data-test="Can View After Completed"]').click();
    cy.get('[data-test="Alert Title"]').contains("User will not be allowed viewing after taking activity.");
    cy.get('[data-test="Can View After Completed"] input').should('not.be.checked');


    cy.log('Assign Controls')
    cy.get('[data-test="Assign Tab"]').click();

    cy.get('[data-test="assign date"]').type('2023-08-29T01:23').blur();
    cy.get('[data-test="Alert Title"]').contains("Assigned date set.");

    cy.get('[data-test="due date"]').type('2023-09-01T04:56').blur();
    cy.get('[data-test="Alert Title"]').contains("Due date set.");

    cy.get('[data-test="Pin Assignment"] input').should('not.be.checked');
    cy.get('[data-test="Pin Assignment"]').click();
    cy.get('[data-test="Alert Title"]').contains("Activity pinned.");
    cy.get('[data-test="Pin Assignment"] input').should('be.checked');

    cy.get('[data-test="Proctor Makes Available"] input').should('not.be.checked');
    cy.get('[data-test="Proctor Makes Available"]').click();
    cy.get('[data-test="Alert Title"]').contains("Activity only allowed in a proctored exam.");
    cy.get('[data-test="Proctor Makes Available"] input').should('be.checked');

    cy.log('Grade Controls')
    cy.get('[data-test="Grade Tab"]').click();

    cy.get('[data-test="Total Points NumberInputField"]').should("have.value", "10");
    cy.get('[data-test="Total Points Increment button"]').click();
    cy.get('[data-test="Alert Title"]').contains("Total points or percent set to 15.");
    cy.get('[data-test="Total Points NumberInputField"]').should("have.value", "15");

    cy.get('[data-test="Grade Category"]').select('exams');
    cy.get('[data-test="Alert Title"]').contains("Grade category set to exams.");

    cy.get('[data-test="Number of Attempts Allowed Checkbox"] input').should('not.be.checked');
    cy.get('[data-test="Number of Attempts Allowed Checkbox"]').click();
    cy.get('[data-test="Alert Title"]').contains("1 attempt allowed.");
    cy.get('[data-test="Number of Attempts Allowed Checkbox"] input').should('be.checked');
    cy.get('[data-test="Number of Attempts Increment button"]').click();
    cy.get('[data-test="Alert Title"]').contains("2 attempts allowed.");

    cy.get('[data-test="Attempt Aggregation"]').select('Last Attempt');
    cy.get('[data-test="Alert Title"]').contains("Aggregate attempts is based on score of last attempt.");

    cy.get('[data-test="Show Solution In Gradebook"] input').should('be.checked');
    cy.get('[data-test="Show Solution In Gradebook"]').click();
    cy.get('[data-test="Alert Title"]').contains("User will not be shown solution in gradebook.");
    cy.get('[data-test="Show Solution In Gradebook"] input').should('not.be.checked');

    cy.log('General Controls')
    cy.get('[data-test="General Tab"]').click({ force: true })
    cy.get('[data-test="Public Checkbox"] input').should('not.be.checked');
    cy.get('[data-test="Public Checkbox"]').click();
    cy.get('[data-test="Alert Title"]').contains("Activity is public.");
    cy.get('[data-test="Public Checkbox"] input').should('be.checked');

    cy.get('[data-test="Show DoenetML Checkbox"] input').should('not.be.checked');
    cy.get('[data-test="Show DoenetML Checkbox"]').click();
    cy.get('[data-test="Alert Title"]').contains("Users can see the source of the activity.");
    cy.get('[data-test="Show DoenetML Checkbox"] input').should('be.checked');

    cy.log('Go back to the old code and return to make sure the settings saved and load back')
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get('[data-test="Close"]').click();
    cy.get(".navigationRow").last().dblclick();
    cy.get('[data-test="Controls Button"]').click();

    cy.log("Check General Controls")
    cy.get('[data-test="Public Checkbox"] input').should('be.checked');
    cy.get('[data-test="Show DoenetML Checkbox"] input').should('be.checked');

    cy.log("Check Presentation Controls")
    cy.get('[data-test="Presentation Tab"]').click({ force: true });
    cy.get('[data-test="Individualize"] input').should('be.checked');
    cy.get('[data-test="Show Solution"] input').should('not.be.checked');
    cy.get('[data-test="Time Limit"] input').eq(0).should('be.checked');
    cy.get('[data-test="Time Limit NumberInputField"]').should("have.value", "65");
    cy.get('[data-test="Show Feedback"] input').should('not.be.checked');
    cy.get('[data-test="Show Hints"] input').should('not.be.checked');
    cy.get('[data-test="Show Correctness"] input').should('not.be.checked');
    cy.get('[data-test="Show Credit Achieved"] input').should('not.be.checked');
    cy.get('[data-test="Paginate"] input').should('not.be.checked');
    cy.get('[data-test="Show Finish Button"] input').should('be.checked');
    cy.get('[data-test="AutoSubmit"] input').should('be.checked');
    cy.get('[data-test="Can View After Completed"] input').should('not.be.checked');

    cy.log("Check Assign Controls")
    cy.get('[data-test="Assign Tab"]').click({ force: true });
    cy.get('[data-test="Pin Assignment"] input').should('be.checked');
    cy.get('[data-test="Proctor Makes Available"] input').should('be.checked');

    cy.log("Check Grade Controls")
    cy.get('[data-test="Grade Tab"]').click({ force: true });
    cy.get('[data-test="Total Points NumberInputField"]').should("have.value", "15");
    cy.get('[data-test="Number of Attempts Allowed Checkbox"] input').should('be.checked');
    cy.get('[data-test="Number of Attempts Allowed NumberInputfield"]').should("have.value", "2");
    cy.get('[data-test="Show Solution In Gradebook"] input').should('not.be.checked');

  });


  it("Collection page", () => {
    const collection1Label = "Renamed Collection 1";
    const page1Label = "Renamed Collection Page 1";
    const page1Labelb = "Renamed Collection Page 1 2nd time";
    const userId = "cyuserId";
    const studentUserId = "cyStudentUserId";
    const courseId = "courseid4";

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);

    cy.log("Open Editor to a page in the collection");
    cy.get('[data-test="Add Collection Button"]').click();
    cy.get(".navigationRow").last().click();
    cy.get('[data-test="Add Page"]').click();
    cy.wait(500);
    cy.get('.navigationRow').eq(0).find('[data-test="folderToggleOpenIcon"]').click({ force: true });
    cy.get(".navigationRow").eq(1).dblclick();
    cy.get('[data-test="Editable Page Label Preview"]').click();
    cy.get('[data-test="Editable Page Label Input"]').clear().type(page1Label).blur();
    cy.wait(500); //Needed as we don't yet have alerts in the editor tool yet
    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Page Label"]').should("have.value", page1Label);
    cy.get('[data-test="Page Label"]').clear().type(page1Labelb).blur();
    cy.get('[data-test="Collection Label"]').clear().type(collection1Label).blur();
    cy.get('[data-test="Alert Title"]').contains("Collection Label Updated");
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get('[data-test="Close"]').click();
    cy.get(".navigationRow").last().contains(page1Labelb);
    cy.get(".navigationRow").eq(0).contains(collection1Label);
  });


});
