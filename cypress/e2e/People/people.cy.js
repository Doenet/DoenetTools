describe("People Test", function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";

  // generate people in cypress/fixtures/peopleExample.csv
  let peopleInCsv = [];
  let updatedPeopleInCsv = [];
  for (let i = 1; i <= 3; i++) {
    peopleInCsv.push({
      // first: i == 2 ? `firstCsv${i}` : "",
      // last: i == 1 || i == 3 ? `lastCsv${i}` : "",
      first: `firstCsv${i}`,
      last: `lastCsv${i}`,
      email: `csvtest${i}@gmail.com`,
      section: `csvSec${i}`,
      externalId: `exIdCsv${i}`,
    });
    //email and external remain constant
    updatedPeopleInCsv.push({
      first: i == 1 || i == 3 ? `updatedFirstCsv${i}` : `firstCsv${i}`,
      last: i == 2 ? `updatedLastCsv${i}` : `lastCsv${i}`,
      email: `csvtest${i}@gmail.com`,
      section: `csvSec${i}`,
      externalId: `exIdCsv${i}`,
    });
  }

  it("Add Person Test", () => {
    const courseId = "people_courseid1";
    const personToAdd = {
      first: "firstname",
      last: "lastname",
      email: "test@gmail.com",
      section: "testsect",
      externalId: "testExID",
      roleId: "people_courseid1SId",
    };

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=people&courseId=${courseId}`);

    cy.get('[data-test="First"]').type(personToAdd.first);
    cy.get('[data-test="Last"]').type(personToAdd.last);
    cy.get('[data-test="Email"]').type(personToAdd.email);
    cy.get('[data-test="Section"]').type(personToAdd.section);
    cy.get('[data-test="External Id"]').type(personToAdd.externalId);
    cy.get('[data-test="Add User"]').click();
    cy.wait(1000);

    cy.task(
      "queryDb",
      `SELECT * FROM course_user WHERE externalId="${personToAdd.externalId}"`,
    ).then((res) => {
      expect(res[0].roleId).to.equals(personToAdd.roleId);
      expect(res[0].section).to.equals(personToAdd.section);
      cy.task(
        "queryDb",
        `SELECT * FROM user WHERE userId="${res[0].userId}"`,
      ).then((result) => {
        expect(result[0].firstName).to.equals(personToAdd.first);
        expect(result[0].lastName).to.equals(personToAdd.last);
        expect(result[0].email).to.equals(personToAdd.email);
      });
    });
  });

  //TODO why are updated and peopleExample getting mixed?
  it.skip("CSV File Add+Update People Test", () => {
    const courseId = "people_courseid2";
    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=people&courseId=${courseId}`);

    cy.get('[data-test="LoadPeople Menu"]').click();
    cy.get('[data-test="Import CSV file"]').attachFile("peopleExample.csv");
    cy.get('[data-test="Merge"]').click();
    cy.wait(1000);

    peopleInCsv.forEach((person) => {
      cy.task(
        "queryDb",
        `SELECT * FROM course_user WHERE externalId="${person.externalId}"`,
      ).then((res) => {
        expect(res[0].section).to.equals(person.section);
        cy.task(
          "queryDb",
          `SELECT * FROM user WHERE userId="${res[0].userId}"`,
        ).then((result) => {
          expect(result[0].firstName).to.equals(person.first);
          expect(result[0].lastName).to.equals(person.last);
          expect(result[0].email).to.equals(person.email);
        });
      });
    });

    cy.get('[data-test="Import CSV file"]').attachFile(
      "updatedPeopleExample.csv",
    );
    cy.get('[data-test="Merge"]').click();
    cy.wait(1000);

    updatedPeopleInCsv.forEach((person) => {
      cy.task(
        "queryDb",
        `SELECT * FROM course_user WHERE externalId="${person.externalId}"`,
      ).then((res) => {
        expect(res[0].section).to.equals(person.section);
        cy.task(
          "queryDb",
          `SELECT * FROM user WHERE userId="${res[0].userId}"`,
        ).then((result) => {
          expect(result[0].firstName).to.equals(person.first);
          expect(result[0].lastName).to.equals(person.last);
          expect(result[0].email).to.equals(person.email);
        });
      });
    });
  });

  it("Withdraw Enroll Test", () => {
    const courseId = "people_courseid3";
    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.signin({ userId });
    cy.visit(`course?tool=people&courseId=${courseId}`);
    cy.viewport(1200, 660);

    cy.get(`[data-test="Withdraw ${userId}@doenet.org"]`).click();
    cy.get('[data-test="People Table"]').should(
      "not.contain",
      `${userId}@doenet.org`,
    );
    cy.wait(1000);

    cy.task(
      "queryDb",
      `SELECT withdrew FROM course_user WHERE userId="${userId}" and courseId="${courseId}"`,
    ).then((res) => {
      expect(res[0].withdrew.data[0]).to.equals(1);
    });

    cy.get('[data-test="Show Withdrawn"]').click();
    cy.get('[data-test="Enroll cyuserId@doenet.org"]').click();
    cy.wait(1000);

    cy.task(
      "queryDb",
      `SELECT withdrew FROM course_user WHERE userId="cyuserId"`,
    ).then((res) => {
      expect(res[0].withdrew.data[0]).to.equals(0);
    });
  });
});
