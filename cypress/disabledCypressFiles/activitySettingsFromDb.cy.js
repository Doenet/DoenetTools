describe("Activity Settings From Database Test", function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";
  const activitySettings = {
    assignedDate: "2024-01-01 00:00:00",
    dueDate: "2025-12-31 00:00:00",
    timeLimit: 70,
    numberOfAttemptsAllowed: 10,
    attemptAggregation: "l",
    totalPointsOrPercent: 10,
    gradeCategory: "problem sets",
    itemWeights: [5],
    individualize: 1,
    showSolution: 0,
    showSolutionInGradebook: 0,
    showFeedback: 0,
    showHints: 0,
    showCorrectness: 0,
    showCreditAchievedMenu: 0,
    paginate: 0,
    showFinishButton: 1,
    proctorMakesAvailable: 1,
    autoSubmit: 0,
    pinnedAfterDate: "2024-01-01 00:00:00",
    pinnedUntilDate: "2025-12-31 00:00:00",
  };

  before(() => {
    cy.signin({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId: studentUserId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId });
    cy.clearAllOfAUsersActivities({ userId: studentUserId });
    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
    });

    //set the activity settings in the db and check in the interface
    cy.updateActivitySettings({
      courseId,
      doenetId,
      activitySettings: JSON.stringify(activitySettings),
    });

    cy.visit(`course?tool=navigation&courseId=${courseId}`);
    cy.get(".navigationRow").click();
  });

  it("Set Assigned Date", () => {
    cy.get('[data-test="Assigned Date"]').should(
      "contain.value",
      "12/31/2023 6:00 PM",
    );
  });

  it("Set Due Date", () => {
    cy.get('[data-test="Due Date"]').should(
      "contain.value",
      "12/30/2025 6:00 PM",
    );
  });

  it("Set Time Limit", () => {
    cy.get('[data-test="Time Limit"]').should(
      "contain.value",
      activitySettings.timeLimit,
    );
  });

  it("Set Attempts", () => {
    cy.get('[data-test="Attempt Limit"]').should(
      "contain.value",
      activitySettings.numberOfAttemptsAllowed,
    );
  });

  // can't get attribute "value"
  it.skip("Set Attempt Aggregation", () => {
    cy.get('[data-test="Attempt Aggregation Dropdown"]').should(
      "have.attr",
      "value",
      '{label: "Last Attempt", value: "l"}',
    );
  });

  it("Set Total Points or Percent", () => {
    cy.get('[data-test="Total Points Or Percent"]').should(
      "contain.value",
      activitySettings.totalPointsOrPercent,
    );
  });

  // can't get attribute "value"
  it.skip("Set Grade Category", () => {
    cy.get('[data-test="Grade Category Dropdown"]').should(
      "have.attr",
      "value",
      '{label: "Problem Sets", value: "problem sets"}',
    );
  });

  // in tbl course content
  it("Set Item Weights", () => {
    cy.get('[data-test="Item Weights"]').should(
      "contain.value",
      activitySettings.itemWeights[0],
    );
  });

  it("Individualize", () => {
    cy.get('[data-test="Individualize"]').should(
      "have.attr",
      "aria-checked",
      activitySettings.individualize ? "true" : "false",
    );
  });

  it("Show Solution", () => {
    cy.get('[data-test="Show Solution"]').should(
      "have.attr",
      "aria-checked",
      activitySettings.showSolution ? "true" : "false",
    );
  });

  it("Show Solution In Gradebook", () => {
    cy.get('[data-test="Show Solution In Gradebook"]').should(
      "have.attr",
      "aria-checked",
      activitySettings.showSolutionInGradebook ? "true" : "false",
    );
  });

  it("Show Feedback", () => {
    cy.get('[data-test="Show Feedback"]').should(
      "have.attr",
      "aria-checked",
      activitySettings.showFeedback ? "true" : "false",
    );
  });

  it("Show Hints", () => {
    cy.get('[data-test="Show Hints"]').should(
      "have.attr",
      "aria-checked",
      activitySettings.showHints ? "true" : "false",
    );
  });

  it("Show Correctness", () => {
    cy.get('[data-test="Show Correctness"]').should(
      "have.attr",
      "aria-checked",
      activitySettings.showCorrectness ? "true" : "false",
    );
  });

  it("Show Credit Achieved Menu", () => {
    cy.get('[data-test="Show Credit Achieved Menu"]').should(
      "have.attr",
      "aria-checked",
      activitySettings.showCreditAchievedMenu ? "true" : "false",
    );
  });

  it("Paginate", () => {
    cy.get('[data-test="Paginate"]').should(
      "have.attr",
      "aria-checked",
      activitySettings.paginate ? "true" : "false",
    );
  });

  it("Show Finish Button", () => {
    cy.get('[data-test="Show Finish Button"]').should(
      "have.attr",
      "aria-checked",
      activitySettings.showFinishButton ? "true" : "false",
    );
  });

  it("Proctor Makes Available", () => {
    cy.get('[data-test="Proctor Makes Available"]').should(
      "have.attr",
      "aria-checked",
      activitySettings.proctorMakesAvailable ? "true" : "false",
    );
  });

  it("Auto Submit", () => {
    cy.get('[data-test="Auto Submit"]').should(
      "have.attr",
      "aria-checked",
      activitySettings.autoSubmit ? "true" : "false",
    );
  });

  // db located where?
  // it('Make Publicly Visible',()=>{
  //   cy.get('[data-test="Make Publicly Visible"]').click()
  // })

  // db located where?
  // it('Show DoenetML Source',()=>{
  //   cy.get('[data-test="Show DoenetML Source"]').click()
  // })

  // checkbox not named (data-test) yet
  it("Pin Assignment", () => {
    cy.get('[data-test="Pinned After Date"]').should(
      "contain.value",
      "12/31/2023 6:00 PM",
    );
    cy.get('[data-test="Pinned Until Date"]').should(
      "contain.value",
      "12/30/2025 6:00 PM",
    );
  });
});
