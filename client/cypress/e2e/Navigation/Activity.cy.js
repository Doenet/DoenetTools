describe("Activity test", function () {
  const userId = "cyuserId";
  // const userId = "devuserId";
  const courseId = "courseid1";
  // const doenetId1 = "activity1id";
  // const pageDoenetId1 = "_page1id";
  // const doenetId2 = "activity2id";
  // const pageDoenetId2 = "_page2id";

  before(() => {
    // cy.clearAllOfAUsersActivities({userId})
    cy.signin({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.createCourse({ userId, courseId });
  });
  beforeEach(() => {
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId });
    // cy.createActivity({courseId,doenetId:doenetId1,parentDoenetId:courseId,pageDoenetId:pageDoenetId1});
    // cy.createActivity({courseId,doenetId:doenetId2,parentDoenetId:courseId,pageDoenetId:pageDoenetId2});
    cy.visit(`/course?tool=navigation&courseId=${courseId}`);
  });

  it("Renaming activity", () => {
    const label1 = "Hello";
    const label2 = "First Activity";
    cy.get('[data-test="Add Activity Button"]').click();
    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow")
      .eq(0)
      .get(".navigationColumn1")
      .contains("Untitled Activity");
    cy.get(".navigationRow").eq(0).get(".navigationColumn1").click();
    cy.get('[data-test="Label Activity"]', { timeout: 20000 })
      .should("be.visible")
      .clear({ scrollBehavior: false })
      .type(label1, { scrollBehavior: false });
    cy.get('[data-test="infoPanelItemLabel"]').click();
    cy.get('[data-test="rowLabel"]').should("contain.text", label1);
    cy.get('[data-test="Label Activity"]', { timeout: 20000 })
      .should("be.visible")
      .clear({ scrollBehavior: false })
      .type(label2, { scrollBehavior: false })
      .type("{enter}", { scrollBehavior: false });
    cy.get('[data-test="rowLabel"]').should("contain.text", label2);
  });

  it("Renaming section", () => {
    const label1 = "section rename test";
    const label2 = "this section was renamed";
    cy.get('[data-test="Add Section Button"]').click();
    cy.contains(".navigationRow", "Untitled Section").click();

    cy.get('[data-test="Label Section"]', { timeout: 20000 })
      .should("be.visible")
      .clear({ scrollBehavior: false })
      .type(label1, { scrollBehavior: false });
    cy.get('[data-test="infoPanelItemLabel"]').click();
    cy.get('[data-test="rowLabel"]').should("contain.text", label1);
    cy.get('[data-test="Label Section"]', { timeout: 20000 })
      .should("be.visible")
      .clear({ scrollBehavior: false })
      .type(label2, { scrollBehavior: false })
      .type("{enter}", { scrollBehavior: false });
    cy.get('[data-test="rowLabel"]').should("contain.text", label2);
  });

  it("Adding sub-sections", () => {
    const label1 = "Adding sub-sections test";
    cy.get('[data-test="Add Section Button"]').click();
    cy.contains(".navigationRow", "Untitled Section").click();

    cy.get('[data-test="Label Section"]', { timeout: 20000 })
      .should("be.visible")
      .clear({ scrollBehavior: false })
      .type(label1, { scrollBehavior: false });
    cy.get('[data-test="infoPanelItemLabel"]').click();
    cy.get('[data-test="rowLabel"]').should("contain.text", label1);

    // click on the section to expand it and show the sub-section
    cy.get('[data-test="folderToggleOpenIcon"]').click();

    cy.contains(".navigationRow", label1).click();
    cy.get('[data-test="Add Activity Button"]').click();
    cy.contains(".navigationRow", label1).click();
    // this used to fail when there was an activity in a section
    cy.get('[data-test="Add Section Button"]').click();

    cy.contains(".navigationRow", "Untitled Section").click();
  });

  it("Adding collection below section", () => {
    const label1 = "Adding collection below sections test";
    cy.get('[data-test="Add Section Button"]').click();
    cy.contains(".navigationRow", "Untitled Section").click();

    cy.get('[data-test="Label Section"]', { timeout: 20000 })
      .should("be.visible")
      .clear({ scrollBehavior: false })
      .type(label1, { scrollBehavior: false });
    cy.get('[data-test="infoPanelItemLabel"]').click();
    cy.get('[data-test="rowLabel"]').should("contain.text", label1);

    // click on the section to expand it and show the sub-section
    cy.get('[data-test="folderToggleOpenIcon"]').click();

    cy.contains(".navigationRow", label1).click();
    cy.get('[data-test="Add Activity Button"]').click();
    cy.contains(".navigationRow", label1).click();
    // this used to fail when there was an activity in a section
    cy.get('[data-test="Add Collection Button"]').click();

    cy.contains(".navigationRow", "Untitled Collection").click();
  });
});
