import { cesc } from "../../../src/_utils/url";

describe("Single page activity tests", function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";

  const headerPixels = 40;

  before(() => {
  });

  beforeEach(() => {
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId }); //Needed to be removed for parallel
    cy.clearAllOfAUsersActivities({ userId: studentUserId }); //Needed to be removed for parallel
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("Repeatedly select same internal link", () => {
    const doenetML = `
<section>
  <p><ref name="toAside" target="aside">Link to aside</ref></p>
  
  <lorem generateParagraphs="8" />

  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid1";
    const doenetId = "spa_activity1id";
    const pageDoenetId = "spa_page1id";


    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.url().should("match", /[^#]/);

    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });

    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#\\/insideAside")).should("not.exist");

    cy.get(cesc("#\\/toAside")).click();
    cy.url().should("match", /#\\\/aside$/);

    cy.get(cesc("#\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");

    cy.get(cesc("#\\/asideTitle")).click();
    cy.get(cesc("#\\/insideAside")).should("not.exist");

    cy.get(cesc("#\\/toAside")).scrollIntoView();

    cy.get(cesc("#\\/toAside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.url().should("match", /#\\\/aside$/);

    cy.get(cesc("#\\/toAside")).click();
    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");

    cy.url().should("match", /#\\\/aside$/);

    cy.get(cesc("#\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });
  });

  it("Internal link to content in aside opens it", () => {
    const doenetML = `
<section>
  <p><ref name="toInsideAside" target="insideAside">Link inside aside</ref></p>
  
  <lorem generateParagraphs="8" />

  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid2";
    const doenetId = "spa_activity2id";
    const pageDoenetId = "spa_page2id";


    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });
    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.url().should("match", /[^#]/);

    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });

    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#\\/insideAside")).should("not.exist");

    cy.get(cesc("#\\/toInsideAside")).click();
    cy.url().should("match", /#\\\/insideAside$/);

    cy.wait(200);

    cy.get(cesc("#\\/insideAside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");

    cy.wait(100);
    cy.get(cesc("#\\/asideTitle")).click();
    cy.get(cesc("#\\/insideAside")).should("not.exist");

    cy.get(cesc("#\\/toInsideAside")).scrollIntoView();

    cy.get(cesc("#\\/toInsideAside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.url().should("match", /#\\\/insideAside$/);

    cy.get(cesc("#\\/toInsideAside")).click();
    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");

    cy.url().should("match", /#\\\/insideAside$/);

    cy.wait(200);

    cy.get(cesc("#\\/insideAside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });
  });

  it.skip("Navigating back remembers position where clicked internal link", () => {
    const doenetML = `
<section>
<lorem generateParagraphs="8" />

<p><ref name="toAside" target="aside">Link to aside</ref></p>

<lorem generateParagraphs="8" />

<aside name="aside">
  <title name="asideTitle">The aside</title>
  <p name="insideAside">Content in aside</p>
</aside>

<lorem generateParagraphs="8" />

<p name="bottom">bottom</p>

<lorem generateParagraphs="8" />

</section>`;

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.url().should("match", /[^#]/);

    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });

    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#\\/insideAside")).should("not.exist");

    cy.get(cesc("#\\/toAside")).scrollIntoView();

    cy.get(cesc("#\\/toAside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#\\/toAside")).click();
    cy.url().should("match", /#\\\/aside$/);

    cy.get(cesc("#\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");

    cy.get(cesc("#\\/bottom")).scrollIntoView();

    cy.get(cesc("#\\/bottom")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      cy.log(rect.top);
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });
    cy.go("back");
    cy.url().should("match", /[^#]/);

    cy.get(cesc("#\\/toAside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      cy.log(rect.top);
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });
  });

  it("Links to activity", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid3";
    const doenetId = "spa_activity3id";
    const pageDoenetId = "spa_page3id";
    const doenetId2 = "spa_activity3idb";
    const pageDoenetId2 = "spa_page3idb";

    const doenetML = `
  <section>
    <p><ref name="toAside" target="aside">Link to aside</ref></p>
    
    <lorem generateParagraphs="8" />
  
    <aside name="aside">
      <title name="asideTitle">The aside</title>
      <p name="insideAside">Content in aside</p>
    </aside>
  
    <lorem generateParagraphs="8" />
  
  </section>`;

    const doenetMLother = `
<p><ref name="toTop" uri="doenet:doenetId=${doenetId}">Link to top</ref></p>
<p><ref name="toAside" uri="doenet:doenetId=${doenetId}" target="aside">Link to aside</ref></p>
<p><ref name="toAsideb" uri="doenet:doenetId=${doenetId}#\\/aside">Link to aside</ref></p>
`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });
    cy.createActivity({
      courseId,
      doenetId: doenetId2,
      parentDoenetId: courseId,
      pageDoenetId: pageDoenetId2,
      doenetML: doenetMLother,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 2); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get(".navigationRow").eq(1).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.wait(200);
    // TODO: should not have to wait here.  It seems like this a bug
    // Without the wait get into an inconsistent situation where the activity does appear for the student,
    // but when click "View Activity" it says the assignment is not assigned

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 2); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(1).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/_p1")).should("have.text", "Link to top");

    cy.log("click link to top, remove target so uses same tab");
    cy.get(cesc("#\\/toTop")).invoke("removeAttr", "target").click();

    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#\\/insideAside")).should("not.exist");

    cy.url().should("contain", doenetId);

    cy.go("back");

    cy.get(cesc("#\\/_p1")).should("have.text", "Link to top");
    cy.url().should("contain", doenetId2);

    cy.log("click link to aside, remove target so uses same tab");
    cy.get(cesc("#\\/toAside")).invoke("removeAttr", "target").click();

    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");
    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.wait(1500); // wait for debounce

    cy.go("back");

    cy.get(cesc("#\\/_p1")).should("have.text", "Link to top");
    cy.url().should("contain", doenetId2);

    cy.log("click link to top, remove target so uses same tab");
    cy.get(cesc("#\\/toTop")).invoke("removeAttr", "target").click();

    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");

    cy.get(cesc("#\\/asideTitle")).click();
    cy.get(cesc("#\\/insideAside")).should("not.exist");

    cy.wait(1500); // wait for debounce

    cy.go("back");

    cy.get(cesc("#\\/_p1")).should("have.text", "Link to top");
    cy.url().should("contain", doenetId2);

    cy.log("click link b to aside, remove target so uses same tab");
    cy.get(cesc("#\\/toAsideb")).invoke("removeAttr", "target").click();

    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");
    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });
  });

  it("Links to activity, inside aside", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid4";
    const doenetId = "spa_activity4id";
    const pageDoenetId = "spa_page4id";
    const doenetId2 = "spa_activity4idb";
    const pageDoenetId2 = "spa_page4idb";
    const doenetML = `
  <section>
    <p><ref name="toAside" target="aside">Link to aside</ref></p>
    
    <lorem generateParagraphs="8" />
  
    <aside name="aside">
      <title name="asideTitle">The aside</title>
      <p name="insideAside">Content in aside</p>
    </aside>
  
    <lorem generateParagraphs="8" />
  
  </section>`;

    const doenetMLother = `
<p><ref name="toTop" uri="doenet:doenetId=${doenetId}">Link to top</ref></p>
<p><ref name="toInsideAside" uri="doenet:doenetId=${doenetId}" target="insideAside">Link to inside aside</ref></p>
<p><ref name="toInsideAsideb" uri="doenet:doenetId=${doenetId}#\\/insideAside">Link to inside aside</ref></p>
`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });
    cy.createActivity({
      courseId,
      doenetId: doenetId2,
      parentDoenetId: courseId,
      pageDoenetId: pageDoenetId2,
      doenetML: doenetMLother,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 2); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get(".navigationRow").eq(1).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.wait(200);
    // TODO: should not have to wait here.  It seems like this a bug
    // Without the wait get into an inconsistent situation where the activity does appear for the student,
    // but when click "View Activity" it says the assignment is not assigned

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 2); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(1).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/_p1")).should("have.text", "Link to top");

    cy.log("click link to top, remove target so uses same tab");
    cy.get(cesc("#\\/toTop")).invoke("removeAttr", "target").click();

    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#\\/insideAside")).should("not.exist");

    cy.url().should("contain", doenetId);

    cy.go("back");

    cy.get(cesc("#\\/_p1")).should("have.text", "Link to top");
    cy.url().should("contain", doenetId2);

    cy.log("click link to inside aside, remove target so uses same tab");
    cy.get(cesc("#\\/toInsideAside")).invoke("removeAttr", "target").click();

    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");
    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#\\\/insideAside$/);
    cy.url().should("contain", doenetId);

    cy.waitUntil(() =>
      cy.get(cesc("#\\/insideAside")).then((el) => {
        let rect = el[0].getBoundingClientRect();
        return rect.top > headerPixels - 1 && rect.top < headerPixels + 1;
      }),
    );

    cy.wait(1500); // wait for debounce

    cy.go("back");

    cy.get(cesc("#\\/_p1")).should("have.text", "Link to top");
    cy.url().should("contain", doenetId2);

    cy.log("click link to top, remove target so uses same tab");
    cy.get(cesc("#\\/toTop")).invoke("removeAttr", "target").click();

    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");

    cy.get(cesc("#\\/asideTitle")).click();
    cy.get(cesc("#\\/insideAside")).should("not.exist");

    cy.wait(1500); // wait for debounce

    cy.go("back");

    cy.get(cesc("#\\/_p1")).should("have.text", "Link to top");
    cy.url().should("contain", doenetId2);

    cy.log("click link b to inside aside, remove target so uses same tab");
    cy.get(cesc("#\\/toInsideAsideb")).invoke("removeAttr", "target").click();

    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");
    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#\\\/insideAside$/);
    cy.url().should("contain", doenetId);

    cy.waitUntil(() =>
      cy.get(cesc("#\\/insideAside")).then((el) => {
        let rect = el[0].getBoundingClientRect();
        return rect.top > headerPixels - 1 && rect.top < headerPixels + 1;
      }),
    );
  });

  it("Go directly to URLs of activity", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid5";
    const doenetId = "spa_activity5id";
    const pageDoenetId = "spa_page5id";
    const doenetML = `
  <section>
    <p><ref name="toAside" target="aside">Link to aside</ref></p>
    
    <lorem generateParagraphs="8" />
  
    <aside name="aside">
      <title name="asideTitle">The aside</title>
      <p name="insideAside">Content in aside</p>
    </aside>
  
    <lorem generateParagraphs="8" />
  
  </section>`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");
    cy.wait(100);

    cy.log("go to url");
    cy.visit(`/course?tool=assignment&doenetId=${doenetId}`);

    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#\\/insideAside")).should("not.exist");

    cy.url().should("contain", doenetId);

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.log("go to aside url");
    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#\\/aside`);

    cy.get(cesc("#\\/insideAside")).should("have.text", "Content in aside");
    cy.get(cesc("#\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.waitUntil(() =>
      cy.get(cesc("#\\/aside")).then((el) => {
        let rect = el[0].getBoundingClientRect();
        return rect.top > headerPixels - 1 && rect.top < headerPixels + 1;
      }),
    );
  });

  it("Update to new version, infinite attempts allowed, separate student signin", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid15";
    const doenetId = "spa_activity15id";
    const pageDoenetId = "spa_page15id";
    const doenetML = `
  <problem name="prob">
    <p>What is <m>1+1</m>? <answer name="ans">2</answer></p>
    <p>Current response: <copy source="ans.currentResponse" assignNames="cr" /></p>
    <p>Credit: <copy source="prob.creditAchieved" assignNames="credit" /></p>
  </problem >`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");
    cy.wait(100);

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);
    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();
    cy.wait(2000);

    cy.get(cesc("#\\/ans") + " textarea")
      .type("2{enter}", { force: true });

    cy.get(cesc("#\\/credit")).should("have.text", "1");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.go("back");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/ans") + " textarea")
      .type("{end}{backspace}1{enter}", {
        force: true,
      })
      .then((x) => console.log("we typed in the 1"));

    cy.log(
      "At least for now, hitting enter before core is intialized does not submit response",
    );
    cy.get(cesc("#\\/cr")).should("contain.text", "1");
    cy.get(cesc("#\\/ans") + " textarea").type("{enter}", { force: true });

    cy.get(cesc("#\\/credit")).should("have.text", "0");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.go("back");

    // Have to wait to make sure Core has saved the changes to continue
    // TODO: ideally wouldn't have to wait here
    cy.wait(1000);

    cy.signin({ userId });
    cy.visit(`/course?tool=navigation&courseId=${courseId}`);
    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+2? <answer><mathinput name='ans2' />3</answer></p>{enter}{ctrl+s}",
    );

    cy.go("back");
    cy.get(".navigationRow").eq(0).click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1000);

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);
    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();
    cy.get(cesc("#\\/cr")).should("contain.text", "1");
    cy.get(cesc("#\\/ans2")).should("not.exist");

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      " and the number of available attempts",
    );

    cy.get("[data-test=CancelNewVersion]").click();
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      "new version",
    );

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      " and the number of available attempts",
    );
    cy.get("[data-test=ConfirmNewVersion]").click();

    cy.get(cesc("#\\/cr")).should("contain.text", "\uff3f");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans2") + " textarea").type("3{enter}", { force: true });
    cy.get('[data-test="Attempt Percent"]').should("have.text", "50%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').click();

    cy.get(cesc("#\\/cr")).should("contain.text", "\uff3f");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.wait(1500); // just making sure nothing gets saved even if wait for debounce

    cy.go("back");

    cy.signin({ userId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);
    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+3? <answer name='ans3'>4</answer></p>{enter}{ctrl+s}",
    );


    cy.go("back");
    cy.get(".navigationRow").eq(0).click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500);

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);
    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.log("immediately get new version");
    cy.get('[data-test="View Activity"]').click();

    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans3") + " textarea").type("4{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should("have.text", "33.3%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");
  });

  it("Update to new version, infinite attempts allowed, change roles", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid6";
    const doenetId = "spa_activity6id";
    const pageDoenetId = "spa_page6id";
    const doenetML = `
  <problem name="prob">
    <p>What is <m>1+1</m>? <answer name="ans">2</answer></p>
    <p>Current response: <copy source="ans.currentResponse" assignNames="cr" /></p>
    <p>Credit: <copy source="prob.creditAchieved" assignNames="credit" /></p>
  </problem >`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/ans") + " textarea").type("2{enter}", { force: true });
    cy.get(cesc("#\\/credit")).should("have.text", "1");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.go("back");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/ans") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.log(
      "At least for now, hitting enter before core is intialized does not submit response",
    );
    cy.get(cesc("#\\/cr")).should("contain.text", "1");
    cy.get(cesc("#\\/ans") + " textarea").type("{enter}", { force: true });

    cy.get(cesc("#\\/credit")).should("have.text", "0");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+2? <answer name='ans2'>3</answer></p>{enter}{ctrl+s}",
    );

    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500)

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/cr")).should("contain.text", "1");
    cy.get(cesc("#\\/ans2")).should("not.exist");

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      " and the number of available attempts",
    );

    cy.get("[data-test=CancelNewVersion]").click();
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      "new version",
    );

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      " and the number of available attempts",
    );
    cy.get("[data-test=ConfirmNewVersion]").click();

    cy.get(cesc("#\\/cr")).should("contain.text", "\uff3f");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans2") + " textarea").type("3{enter}", { force: true });
    cy.get('[data-test="Attempt Percent"]').should("have.text", "50%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').click();

    cy.get(cesc("#\\/cr")).should("contain.text", "\uff3f");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.wait(1500); // just making sure nothing gets saved even if wait for debounce

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+3? <answer name='ans3'>4</answer></p>{enter}{ctrl+s}",
    );

    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500)

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.log("immediately get new version");
    cy.get('[data-test="View Activity"]').click();

    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans3") + " textarea").type("4{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should("have.text", "33.3%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");
  });

  //Note: only runs once - needs work
  it("Update to new version, one attempt allowed", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid8";
    const doenetId = "spa_activity8id";
    const pageDoenetId = "spa_page8id";
    const doenetML = `
  <problem name="prob">
    <p>What is <m>1+1</m>? <answer name="ans">2</answer></p>
    <p>Current response: <copy source="ans.currentResponse" assignNames="cr" /></p>
    <p>Credit: <copy source="prob.creditAchieved" assignNames="credit" /></p>
  </problem >`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Attempt Limit Checkbox"]').click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/ans") + " textarea").type("2{enter}", { force: true });
    cy.get(cesc("#\\/credit")).should("have.text", "1");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').should("be.disabled");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+2? <answer name='ans2'>3</answer></p>{enter}{ctrl+s}",
    );


    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/cr")).should("contain.text", "2");
    cy.get(cesc("#\\/ans2")).should("not.exist");

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      " and the number of available attempts",
    );

    cy.get("[data-test=CancelNewVersion]").click();
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      "new version",
    );

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      " and the number of available attempts",
    );

    cy.get('[data-test="New Attempt"]').should("not.be.disabled");
    cy.get("[data-test=ConfirmNewVersion]").click();

    cy.get(cesc("#\\/cr")).should("contain.text", "\uff3f");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans2") + " textarea").type("3{enter}", { force: true });
    cy.get('[data-test="Attempt Percent"]').should("have.text", "50%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').should("be.disabled");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+3? <answer name='ans3'>4</answer></p>{enter}{ctrl+s}",
    );

    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500);

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.log("get updated new version but do not interact with it");
    cy.get('[data-test="View Activity"]').click();

    cy.get('[data-test="New Attempt"]').should("be.disabled");
    cy.get(cesc("#\\/ans2")).should("be.visible");
    cy.get(cesc("#\\/ans3")).should("not.exist");

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      " and the number of available attempts",
    );

    cy.get("[data-test=ConfirmNewVersion]").click();

    cy.get(cesc("#\\/ans3")).should("be.visible");

    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");
    cy.get('[data-test="New Attempt"]').should("be.disabled");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+4? <answer name='ans4'>5</answer></p>{enter}{ctrl+s}",
    );


    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");
    cy.wait(1500);

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.log("immediately get new version");
    cy.get('[data-test="View Activity"]').click();

    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans4") + " textarea").type("5{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should("have.text", "25%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");
    cy.get('[data-test="New Attempt"]').should("be.disabled");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+5? <answer name='ans5'>6</answer></p>{enter}{ctrl+s}",
    );


    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500);

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.log("Can use New Attempt Button to get new content");
    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/ans4")).should("be.visible");
    cy.get(cesc("#\\/ans5")).should("not.exist");

    cy.get('[data-test="Attempt Percent"]').should("have.text", "25%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').click();

    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans5") + " textarea").type("6{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should("have.text", "20%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");
    cy.get('[data-test="New Attempt"]').should("be.disabled");
  });

  it("Update to new version, two attempts allowed", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid10";
    const doenetId = "spa_activity10id";
    const pageDoenetId = "spa_page10id";
    const doenetML = `
  <problem name="prob">
    <p>What is <m>1+1</m>? <answer name="ans">2</answer></p>
    <p>Current response: <copy source="ans.currentResponse" assignNames="cr" /></p>
    <p>Credit: <copy source="prob.creditAchieved" assignNames="credit" /></p>
  </problem >`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });


    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Attempt Limit Checkbox"]').click();

    cy.get('[data-test="Attempt Limit"]').type("{end}{backspace}2{enter}");

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/ans") + " textarea").type("2{enter}", { force: true });
    cy.get(cesc("#\\/credit")).should("have.text", "1");
    cy.get(cesc("#\\/cr")).should("contain.text", "2");
    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 1:",
    );
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').click();

    cy.get(cesc("#\\/credit")).should("have.text", "0");
    cy.get(cesc("#\\/cr")).should("contain.text", "\uff3f");

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 2:",
    );
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans") + " textarea").type("2{enter}", { force: true });

    cy.get(cesc("#\\/credit")).should("have.text", "1");
    cy.get(cesc("#\\/cr")).should("contain.text", "2");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').should("be.disabled");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+2? <answer name='ans2'>3</answer></p>{enter}{ctrl+s}",
    );

    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500);


    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/cr")).should("contain.text", "2");
    cy.get(cesc("#\\/ans2")).should("not.exist");

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 2:",
    );

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should(
      "contain.text",
      " and the number of available attempts",
    );

    cy.get("[data-test=CancelNewVersion]").click();
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      "new version",
    );

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should(
      "contain.text",
      " and the number of available attempts",
    );

    cy.get('[data-test="New Attempt"]').should("not.be.disabled");
    cy.get("[data-test=ConfirmNewVersion]").click();

    cy.get(cesc("#\\/cr")).should("contain.text", "\uff3f");
    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 3:",
    );
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans2") + " textarea").type("3{enter}", { force: true });
    cy.get('[data-test="Attempt Percent"]').should("have.text", "50%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').click();

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 4:",
    );
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");
    cy.get('[data-test="New Attempt"]').should("be.disabled");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+3? <answer name='ans3'>4</answer></p>{enter}{ctrl+s}",
    );

    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500);

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.log("immediately get new version and two more attempts");
    cy.get('[data-test="View Activity"]').click();

    cy.get('[data-test="New Attempt"]').should("not.be.disabled");
    cy.get(cesc("#\\/ans2")).should("be.visible");
    cy.get(cesc("#\\/ans3")).should("be.visible");

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 4:",
    );
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').click();
    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 5:",
    );
    cy.get('[data-test="New Attempt"]').should("be.disabled");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+4? <answer name='ans4'>5</answer></p>{enter}{ctrl+s}",
    );


    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500);

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.log("again, immediately get new version and two more attempts");
    cy.get('[data-test="View Activity"]').click();

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 5:",
    );
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans4") + " textarea").type("5{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should("have.text", "25%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').click();
    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 6:",
    );
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans4") + " textarea").type("5{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should("have.text", "25%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+5? <answer name='ans5'>6</answer></p>{enter}{ctrl+s}",
    );

    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500);

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.log("Can use New Attempt Button to get new content");
    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/ans4")).should("be.visible");
    cy.get(cesc("#\\/ans5")).should("not.exist");

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 6:",
    );
    cy.get('[data-test="Attempt Percent"]').should("have.text", "25%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').click();

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 7:",
    );
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans5") + " textarea").type("6{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should("have.text", "20%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get('[data-test="New Attempt"]').click();

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 8:",
    );
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans5") + " textarea").type("6{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should("have.text", "20%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");
    cy.get('[data-test="New Attempt"]').should("be.disabled");
  });

  it("Clicking links does not give update version prompt", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid11";
    const doenetId = "spa_activity11id";
    const pageDoenetId = "spa_page11id";
    const doenetML = `
<section name="sect">
  <title>Info only</title>
  <p name="top">This activity is just information only, with no interactive content.
    <ref name="goMiddle1" target="middle">Go to middle.</ref>
    <ref name="goBottom1" target="bottom">Go to bottom.</ref>
  </p>
  
  <lorem generateParagraphs="8" />

  <p name="middle">A paragraph in the middle.
    <ref name="goTop2" target="top">Go to top.</ref>
    <ref name="goBottom2" target="bottom">Go to bottom.</ref>
  </p>
  
  <lorem generateParagraphs="8" />

  <p name="bottom">A paragraph near the bottom.
    <ref name="goTop3" target="top">Go to top.</ref>
    <ref name="goMiddle3" target="middle">Go to middle.</ref>
  </p>

  <lorem generateParagraphs="8" />

</section >
`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/sect_title")).should("have.text", "Info only");
    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });

    cy.get(cesc("#\\/goMiddle1")).click();
    cy.url().should("match", /#\\\/middle$/);

    cy.get(cesc("#\\/middle")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#\\/goBottom2")).click();
    cy.url().should("match", /#\\\/bottom$/);

    cy.get(cesc("#\\/bottom")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.wait(2000); // wait for debounce

    cy.go("back");

    cy.get(cesc("#\\/middle")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.go("back");
    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p name='extra'>Extra content</p>{enter}{ctrl+s}",
    );

    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500);

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/extra")).should("have.text", "Extra content");

    cy.get("[data-test=NewVersionAvailable]").should("not.exist");
  });

  it("Presence of video does not give update version prompt", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid12";
    const doenetId = "spa_activity12id";
    const pageDoenetId = "spa_page12id";
    const doenetML = `
<title>A video</title>
<video youtube="tJ4ypc5L6uU" width="640px" height="360px" name="v" />
<p>State: <copy prop="state" source="v" assignNames="state" /></p>
<p>Time: <copy prop="time" source="v" assignNames="time" /></p>
<p>Duration: <copy prop="duration" source="v" assignNames="duration" /></p>
<p>
  <callAction target="v" actionName="playVideo" name="playAction"><label>Play action</label></callAction>
  <callAction target="v" actionName="pauseVideo" name="pauseAction"><label>Pause action</label></callAction>
</p>
`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/_title1")).should("have.text", "A video");
    cy.get(cesc("#\\/duration")).should("have.text", "300");

    cy.wait(1500); // wait for debounce

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p name='more1'>More content 1</p>{enter}{ctrl+s}",
    );

    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500);

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/duration")).should("have.text", "300");
    cy.get(cesc("#\\/more1")).should("have.text", "More content 1");

    cy.get("[data-test=NewVersionAvailable]").should("not.exist");

    cy.get(cesc("#\\/state")).contains("stopped");
    cy.get(cesc("#\\/playAction")).click();
    cy.get(cesc("#\\/time")).contains("1");
    cy.get(cesc("#\\/pauseAction")).click();

    cy.wait(1500); // wait for debounce

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p name='more2'>More content 2</p>{enter}{ctrl+s}",
    );

    cy.go("back");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500);

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/duration")).should("have.text", "300");
    cy.get(cesc("#\\/more2")).should("not.exist");

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get("[data-test=ConfirmNewVersion]").click();

    cy.get(cesc("#\\/more2")).should("have.text", "More content 2");
  });

  it("Auto submit answers", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid13";
    const doenetId = "spa_activity13id";
    const pageDoenetId = "spa_page13id";
    const doenetML = `
<p>Enter x: <answer name="x">x</answer></p>
<p>Enter hello: <answer type="text" name="hello">hello</answer></p>
<p>Select correct: <answer inline name="correct"><choice credit="1">correct</choice><choice>incorrect</choice></answer></p>
<p>Move point to first quadrant</p>
<graph><point name="P" /></graph>
<answer name="firstQuad"><award><when>$P.x >0 and $P.y > 0</when></award></answer>
`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Auto Submit"]').click();

    cy.get('[data-test="Attempt Aggregation"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{enter}");

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/_p1")).should("have.text", "Enter x: ");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");

    cy.get(cesc("#\\/x") + " textarea")
      .type("x", { force: true })
      .blur();
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "25%");

    cy.get(cesc("#\\/x") + " textarea")
      .type("{end}{backspace}y", { force: true })
      .blur();
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");

    cy.get(cesc("#\\/hello") + " input")
      .type("hello")
      .blur();
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "25%");

    cy.get(cesc("#\\/correct") + " select")
      .select(1)
      .blur();
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "50%");

    cy.get(cesc("#\\/correct") + " select")
      .select(2)
      .blur();
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "25%");

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 2, y: 3 },
      });
    });

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "50%");

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -2, y: 3 },
      });
    });

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "25%");

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 1 },
      });
    });

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "50%");
  });

  it("reload text answer without blurring or hitting enter", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid14";
    const doenetId = "spa_activity14id";
    const pageDoenetId = "spa_page14id";
    const doenetML = `
    <p>Enter 1: <answer>
      <textinput name="ti" />
      <award><when>$ti=hello</when></award>
    </answer>
    </p>
`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");
    cy.wait(100);

    // cy.get('[data-test="RoleDropDown"] > div:nth-child(2)').click().type("{downArrow}{downArrow}{enter}")

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);
    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/ti_input")).type("hello", { force: true });

    cy.wait(1500); // wait for debounce

    cy.reload();

    cy.get(cesc("#\\/ti_submit")).click();
    cy.get(cesc("#\\/ti_correct")).should("be.visible");
  });

  it("reload text answer without blurring or hitting enter, clear IndexedDB", () => {
    const studentUserId = "cyStudentUserId";
    const courseId = "spa_courseid16";
    const doenetId = "spa_activity16id";
    const pageDoenetId = "spa_page16id";
    const doenetML = `
    <p>Enter 1: <answer>
      <textinput name="ti" />
      <award><when>$ti=hello</when></award>
    </answer>
    </p>
    $ti.value, $ti.immediateValue
`;

    cy.deleteCourseDBRows({ courseId });
    cy.createCourse({ userId, courseId, studentUserId });

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
      doenetML,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");
    cy.wait(100);

    // cy.get('[data-test="RoleDropDown"] > div:nth-child(2)').click().type("{downArrow}{downArrow}{enter}")

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);
    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/ti_input")).type("hello", { force: true });

    cy.wait(1500); // wait for debounce

    cy.clearIndexedDB();
    cy.reload();

    cy.get(cesc("#\\/ti_submit")).click();
    cy.get(cesc("#\\/ti_correct")).should("be.visible");
  });
});
