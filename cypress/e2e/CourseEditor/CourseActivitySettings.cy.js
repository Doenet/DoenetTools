import { cesc2 } from "../../../src/_utils/url";

describe("Course Editor Tests", function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";

  before(() => {

  });

  beforeEach(() => {


  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
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

  it.only("Rename Pages and Activity", () => {
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
    cy.get('[data-test="Page Label"]').should("have.value", page1Label); //Bug!
    cy.get('[data-test="Page Label"]').clear().type(page1Labelb).blur();
    cy.get('[data-test="Close Settings Button"]').click();
    cy.get('[data-test="Editable Activity Label Preview"]').contains(activity1Labelb);
    cy.get('[data-test="Editable Page Label Preview"]').contains(page1Labelb);
    cy.get('[data-test="Close"]').click();
    cy.get(".navigationRow").eq(-1).contains(page2Labelb);
    cy.get(".navigationRow").eq(-2).contains(page1Labelb);
    cy.get(".navigationRow").eq(-3).contains(activity1Labelb);
  });


  // it("Portfolio Editor Varient Control Shows Up", () => {
  //   const label = "Portfolio Variant Control";
  //   const text1 = "Hello World";

  //   cy.log("Make an activity in the portfolio");
  //   cy.get('[data-test="Portfolio"]').click();
  //   cy.get('[data-test="Add Activity"]').click();

  //   cy.get('[data-test="Variant Select Menu Button"]').should("not.exist");

  //   cy.get('[data-test="Controls Button"]').click();
  //   cy.get('[data-test="Activity Label"]').clear().type(label).blur();
  //   cy.get('[data-test="Close Settings Button"]').click();

  //   cy.log("Enter content without need of a variant");

  //   cy.get(".cm-content").type(`<p>${text1}</p> {enter}`);

  //   cy.get('[data-test="Viewer Update Button"]').click();
  //   cy.get(cesc2("#/_document1")).should("contain", text1);

  //   cy.get('[data-test="Variant Select Menu Button"]').should("not.exist");

  //   cy.log("Enter content that does need of a variant");

  //   cy.get(".cm-content").type(`{ctrl+end}<selectFromSequence /> {enter}`);

  //   cy.get('[data-test="Variant Select Menu Button"]').should("not.exist");

  //   cy.get('[data-test="Viewer Update Button"]').click();

  //   cy.get('[data-test="Variant Select Menu Button"]').should("exist");
  //   cy.get(cesc2("#/_document1")).should("contain", "1");

  //   cy.log("Change the variants with the control");

  //   cy.get('[data-test="Variant Select Down Button"]').click();
  //   cy.get(cesc2("#/_document1")).should("contain", "2");

  //   cy.get('[data-test="Variant Select Up Button"]').click();
  //   cy.get(cesc2("#/_document1")).should("contain", "1");

  //   cy.get('[data-test="Variant Select Menu Button"]').click();
  //   cy.get('[data-test="Variant Select Menu Item 2"]').click();

  //   cy.get(cesc2("#/_document1")).should("contain", "3");

  //   cy.get('[data-test="Variant Select Menu Button"]').click();
  //   cy.get('[data-test="Variant Select Filter Input"]')
  //     .clear()
  //     .type("d")
  //     .blur();
  //   cy.get('[data-test="Variant Select Menu Item 0"]').click();
  //   cy.get(cesc2("#/_document1")).should("contain", "4");

  //   cy.log("View Variant Select keeps sync with Edit");
  //   cy.get('[data-test="View Mode Button"]').click();

  //   cy.get(cesc2("#/_document1")).should("contain", "4");
  //   cy.get('[data-test="Variant Select Menu Button"]').should("contain", "d");

  //   cy.get('[data-test="Variant Select Down Button"]').click();
  //   cy.get(cesc2("#/_document1")).should("contain", "5");

  //   cy.get('[data-test="Variant Select Up Button"]').click();
  //   cy.get(cesc2("#/_document1")).should("contain", "4");

  //   cy.get('[data-test="Variant Select Menu Button"]').click();
  //   cy.get('[data-test="Variant Select Menu Item 5"]').click();

  //   cy.get(cesc2("#/_document1")).should("contain", "6");

  //   cy.get('[data-test="Edit Mode Button"]').click();

  //   cy.get(cesc2("#/_document1")).should("contain", "6");
  //   cy.get('[data-test="Variant Select Menu Button"]').should("contain", "f");

  //   cy.get('[data-test="Controls Button"]').click();
  //   cy.get(".chakra-checkbox__control").click();
  //   cy.get('[data-test="Close Settings Button"]').click();

  //   cy.log("sign in as someone else and open the public activity");
  //   cy.signin({ userId2 });

  //   cy.get('[data-test="Community"]').click();

  //   cy.get('[data-test="Search"]').clear().type(`${label}{enter}`);

  //   cy.get('[data-test="Results All Matches"] [data-test="Card Image Link"]')
  //     .eq(0)
  //     .click();

  //   cy.log("Change the variants using the selector");

  //   cy.get('[data-test="Variant Select Menu Button"]').should("exist");
  //   cy.get('[data-test="Variant Select Down Button"]').click();
  //   cy.get(cesc2("#/_document1")).should("contain", "2");

  //   cy.get('[data-test="Variant Select Up Button"]').click();
  //   cy.get(cesc2("#/_document1")).should("contain", "1");

  //   cy.get('[data-test="Variant Select Menu Button"]').click();
  //   cy.get('[data-test="Variant Select Menu Item 2"]').click();

  //   cy.get(cesc2("#/_document1")).should("contain", "3");

  //   cy.log("Try the public editor");

  //   cy.get('[data-test="See Inside"]').click();

  //   cy.wait(500); //Need this to wait for the public editor to spin up

  //   cy.get('[data-test="Variant Select Menu Button"]').should("exist");

  //   cy.get('[data-test="Variant Select Down Button"]').click();
  //   cy.get(cesc2("#/_document1")).should("contain", "2");

  //   cy.get('[data-test="Variant Select Up Button"]').click();
  //   cy.get(cesc2("#/_document1")).should("contain", "1");

  //   cy.get('[data-test="Variant Select Menu Button"]').click();
  //   cy.get('[data-test="Variant Select Menu Item 2"]').click();

  //   cy.get(cesc2("#/_document1")).should("contain", "3");

  //   cy.log("Delete the variant DoenetML code");

  //   cy.get(".cm-content").clear().type("<p>Hello World</p>");
  //   cy.get('[data-test="Viewer Update Button"]').click();
  //   cy.get('[data-test="Variant Select Menu Button"]').should("not.exist");
  //   cy.get(cesc2("#/_document1")).should("contain", "Hello World");
  // });
});
