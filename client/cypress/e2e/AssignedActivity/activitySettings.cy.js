describe("Activity Settings Test", function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";

  before(() => {
    cy.signin({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId: studentUserId });
    cy.createCourse({ userId, courseId, studentUserId });
  });

  beforeEach(() => {
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId });
    cy.clearAllOfAUsersActivities({ userId: studentUserId });
    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
    });
    cy.visit(`course?tool=navigation&courseId=${courseId}`);
    cy.get(".navigationRow").click();
  });

  // how to test time?
  it("Set Assigned Date", () => {
    // assign date to 01/15/2024
    // cypress might cause error due to diff time zone,
    // so if time set is 01/15/2024, that means the test is successful
    cy.get('[data-test="Assigned Date Checkbox"]').click();

    cy.get('[data-test="Assigned Date"]').click();
    cy.get(".rdtSwitch").click();
    cy.get(".rdtSwitch").click();
    cy.get('[data-value="2024"]').click();
    cy.get('[data-value="0"]').click();
    cy.get('[data-value="15"]').click();
    cy.get('[data-test="Menu Panel"]').click({ force: true });
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT assignedDate FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      let utcDateTime = new Date(result[0].assignedDate);
      let localDateTime = utcDateTime.toLocaleDateString();
      expect(localDateTime).contains("1/15/2024");
    });
  });

  it("Set Due Date", () => {
    // set due date to 03/18/2025
    // cypress might cause error due to diff time zone,
    // so if time set is 03/19/2025, that means the test is successful
    cy.get('[data-test="Due Date Checkbox"]').click();

    cy.get('[data-test="Due Date"]').click();
    cy.get(".rdtSwitch").click();
    cy.get(".rdtSwitch").click();
    cy.get('[data-value="2025"]').click();
    cy.get('[data-value="2"]').click();
    cy.get('[data-value="18"]').click();
    cy.get('[data-test="Menu Panel"]').click({ force: true });
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT dueDate FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      let utcDateTime = new Date(result[0].dueDate);
      let localDateTime = utcDateTime.toLocaleDateString();
      expect(localDateTime).contains("3/18/2025");
    });
  });

  it("Set Time Limit", () => {
    // default time limit is 60
    cy.get('[data-test="Time Limit Checkbox"]').click();

    // check increment time limit to 61
    cy.get('[data-test="Increment Time Limit"]').click();
    cy.get('[data-test="Menu Panel"]').click({ force: true });

    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT timeLimit FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].timeLimit).to.equals(61);
    });

    //check decrement time limit to 60
    cy.get('[data-test="Decrement Time Limit"]').click();
    cy.get('[data-test="Menu Panel"]').click({ force: true });
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT timeLimit FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].timeLimit).to.equals(60);
    });
  });

  it("Set Attempts", () => {
    // default attempt limit is 1
    cy.get('[data-test="Attempt Limit Checkbox"]').click();

    // check increment attempt limit to 2
    cy.get('[data-test="Increment Attempt Limit"]').click();
    cy.get('[data-test="Menu Panel"]').click({ force: true });

    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT numberOfAttemptsAllowed FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].numberOfAttemptsAllowed).to.equals(2);
    });

    //check decrement attempt limit to 1
    cy.get('[data-test="Decrement Attempt Limit"]').click();
    cy.get('[data-test="Menu Panel"]').click({ force: true });

    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT numberOfAttemptsAllowed FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].numberOfAttemptsAllowed).to.equals(1);
    });
  });

  // how to click dropdown?
  // it('Set Attempt Aggregation',()=>{
  //   cy.get('[data-test="Attempt Aggregation"]').click()
  //   // cy.get('[data-test="Attempt Limit"]')
  // })

  it("Set Total Points or Percent", () => {
    // default Total Points or Percent is 0

    // check increment Total Points or Percent to 1
    cy.get('[data-test="Increment Total Points Or Percent"]').click();
    cy.get('[data-test="Menu Panel"]').click({ force: true });

    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT totalPointsOrPercent FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].totalPointsOrPercent).to.equals(1);
    });

    //check decrement Total Points or Percent to 0
    cy.get('[data-test="Decrement Total Points Or Percent"]').click();
    cy.get('[data-test="Menu Panel"]').click({ force: true });

    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT totalPointsOrPercent FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].totalPointsOrPercent).to.equals(0);
    });
  });

  // how to click dropdown?
  // it('Set Grade Category',()=>{
  //   cy.get('[data-test="Grade Category"]').click()
  //   // cy.get('[data-test="Attempt Limit"]')
  // })

  // in tbl course content
  it("Set Item Weights", () => {
    let itemWeights = 5;
    cy.get('[data-test="Item Weights"]').clear();
    cy.get('[data-test="Item Weights"]').type(itemWeights, { force: true });
    cy.get('[data-test="Menu Panel"]').click({ force: true });

    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT jsonDefinition FROM course_content WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].jsonDefinition.itemWeights).eqls([itemWeights]);
    });
  });

  it("Individualize", () => {
    cy.get('[data-test="Individualize"]').click();
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT individualize FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].individualize).to.equal(1);
    });
  });

  it("Show Solution", () => {
    cy.get('[data-test="Show Solution"]').click();
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT showSolution FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].showSolution).to.equal(0);
    });
  });

  it("Show Solution In Gradebook", () => {
    cy.get('[data-test="Show Solution In Gradebook"]').click();
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT showSolutionInGradebook FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].showSolutionInGradebook).to.equal(0);
    });
  });

  it("Show Feedback", () => {
    cy.get('[data-test="Show Feedback"]').click();
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT showFeedback FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].showFeedback).to.equal(0);
    });
  });

  it("Show Hints", () => {
    cy.get('[data-test="Show Hints"]').click();
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT showHints FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].showHints).to.equal(0);
    });
  });

  it("Show Correctness", () => {
    cy.get('[data-test="Show Correctness"]').click();
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT showCorrectness FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].showCorrectness).to.equal(0);
    });
  });

  it("Show Credit Achieved Menu", () => {
    cy.get('[data-test="Show Credit Achieved Menu"]').click();
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT showCreditAchievedMenu FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].showCreditAchievedMenu).to.equal(0);
    });
  });

  it("Paginate", () => {
    cy.get('[data-test="Paginate"]').click();
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT paginate FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].paginate).to.equal(0);
    });
  });

  it("Show Finish Button", () => {
    cy.get('[data-test="Show Finish Button"]').click();
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT showFinishButton FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].showFinishButton).to.equal(1);
    });
  });

  it("Proctor Makes Available", () => {
    cy.get('[data-test="Proctor Makes Available"]').click();
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT proctorMakesAvailable FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].proctorMakesAvailable).to.equal(1);
    });
  });

  it("Auto Submit", () => {
    cy.get('[data-test="Auto Submit"]').click();
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT autoSubmit FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      expect(result[0].autoSubmit).to.equal(1);
    });
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
    cy.get('[data-test="Pin Assignment Checkbox"]').click();

    // assign pin after date to 01/03/2024
    // cypress might cause error due to diff time zone,
    // so if time set in db is 01/04/2024, that means the test is actually successful
    cy.get('[data-test="Pinned After Date"]').click();
    cy.get(
      ".rdtOpen > .rdtPicker > .rdtDays > table > thead > :nth-child(1) > .rdtSwitch",
    ).click();
    cy.get(".rdtMonths > :nth-child(1) > thead > tr > .rdtSwitch").click();
    cy.get('[data-value="2024"]').click();
    cy.get('[data-value="0"]').click();
    cy.get(
      '.rdtOpen > .rdtPicker > .rdtDays > table > tbody > :nth-child(1) > [data-value="3"]',
    ).click();
    cy.get('[data-test="Menu Panel"]').click({ force: true });

    // set pin until date to 07/20/2025
    // cypress might cause error due to diff time zone,
    // so if time set in db is 07/21/2025, that means the test is actually successful
    cy.get('[data-test="Pinned Until Date"]').click();
    cy.get(
      ".rdtOpen > .rdtPicker > .rdtDays > table > thead > :nth-child(1) > .rdtSwitch",
    ).click();
    cy.get(".rdtMonths > :nth-child(1) > thead > tr > .rdtSwitch").click();
    cy.get('[data-value="2025"]').click();
    cy.get(':nth-child(2) > [data-value="6"]').click();
    cy.get(':nth-child(4) > [data-value="20"]').click();
    cy.get('[data-test="Menu Panel"]').click({ force: true });
    cy.wait(500); //TODO: need the UI to let us know this was successful
    cy.task(
      "queryDb",
      `SELECT pinnedAfterDate, pinnedUntilDate FROM assignment WHERE doenetId="${doenetId}"`,
    ).then((result) => {
      let pinnedAfterUtcDateTime = new Date(result[0].pinnedAfterDate);
      let pinnedAfterLocalDateTime =
        pinnedAfterUtcDateTime.toLocaleDateString();
      cy.log(pinnedAfterLocalDateTime);
      expect(pinnedAfterLocalDateTime).contains("1/3/2024");
      let pinnedUntilUtcDateTime = new Date(result[0].pinnedUntilDate);
      let pinnedUntilLocalDateTime =
        pinnedUntilUtcDateTime.toLocaleDateString();
      cy.log(pinnedUntilLocalDateTime);
      expect(pinnedUntilLocalDateTime).contains("7/20/2025");
    });
  });
});
