// import {signIn} from '../DoenetSignin/DoenetSignin.cy';
import { cesc } from "../../../src/_utils/url";

describe("Multipage activity tests", function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";
  // const userId = "devuserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const doenetId2 = "activity2id";
  const pageDoenetId1 = "_page1id";
  const pageDoenetId2 = "_page2id";
  const pageDoenetId3 = "_page3id";
  const pageDoenetId4 = "_page4id";

  const headerPixels = 40;

  before(() => {
    // cy.clearAllOfAUsersActivities({userId})
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
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("Changing paginated pages changes hash, does not add to url history", () => {
    const doenetML1 = `Page 1`;

    const doenetML2 = `Page 2`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).get(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get("#page1").should("contain.text", "Page 1");

    cy.url().should("match", /#page1$/);

    cy.get("[data-test=next]").click();

    cy.get("#page2").should("contain.text", "Page 2");

    cy.url().should("match", /#page2$/);

    cy.go("back");

    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);
  });

  it("Changing non-paginated pages changes hash, does not add to url history", () => {
    const doenetML1 = `<p name="top">top 1</p><lorem generateParagraphs="8" /><p name="bottom">bottom 1</p>`;
    const doenetML2 = `<p name="top">top 2</p><lorem generateParagraphs="8" /><p name="bottom">bottom 2</p>`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).get(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.wait(100); //TODO: is there a reason we need to wait before clicking paginate?

    cy.get('[data-test="Paginate"').click();
    cy.wait(100); //TODO: need the UI to let us know this was successful

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get(cesc("#page1\\/top")).should("contain.text", "top 1");
    cy.get(cesc("#page2\\/top")).should("contain.text", "top 2");

    cy.url().should("match", /#page1$/);

    cy.get(cesc("#page1\\/bottom")).scrollIntoView();

    cy.url().should("match", /#page1$/);

    cy.get(cesc("#page2\\/top")).scrollIntoView();

    cy.waitUntil(() => cy.url().should("match", /#page2$/));

    cy.get(cesc("#page2\\/bottom")).scrollIntoView();
    cy.url().should("match", /#page2$/);

    cy.get(cesc("#page1\\/bottom")).scrollIntoView();
    cy.waitUntil(() => cy.url().should("match", /#page1$/));

    cy.go("back");

    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);
  });

  it("New attempt starts at page 1, paginated", () => {
    const doenetML1 = `<p name="top">top 1</p><lorem generateParagraphs="8" /><p name="bottom">bottom 1</p>`;
    const doenetML2 = `<p name="top">top 2</p><lorem generateParagraphs="8" /><p name="bottom">bottom 2</p>`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).get(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/top")).should("contain.text", "top 1");

    cy.url().should("match", /#page1$/);

    cy.get('[data-test="next"]').click();

    cy.get(cesc("#page2\\/top")).should("contain.text", "top 2");

    cy.url().should("match", /#page2$/);

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 1:",
    );

    cy.get('[data-test="New Attempt"]').click();

    cy.get(cesc("#page1\\/top")).should("contain.text", "top 1");

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 2:",
    );

    cy.url().should("match", /#page1$/);

    cy.log("did not add to url history");
    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);
  });

  it("New attempt starts at page 1, non-paginated", () => {
    const doenetML1 = `<p name="top">top 1</p><lorem generateParagraphs="8" /><p name="bottom">bottom 1</p>`;
    const doenetML2 = `<p name="top">top 2</p><lorem generateParagraphs="8" /><p name="bottom">bottom 2</p>`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).get(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.wait(100);
    cy.get('[data-test="Paginate"').click();
    cy.wait(100); //TODO: need the UI to let us know this was successful

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/top")).should("contain.text", "top 1");
    cy.get(cesc("#page2\\/top")).should("contain.text", "top 2");

    cy.url().should("match", /#page1$/);

    cy.get(cesc("#page2\\/bottom")).scrollIntoView();

    cy.waitUntil(() => cy.url().should("match", /#page2$/));

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 1:",
    );

    cy.get('[data-test="New Attempt"]').click();

    cy.get(cesc("#page1\\/top")).should("contain.text", "top 1");
    cy.get(cesc("#page2\\/top")).should("contain.text", "top 2");

    cy.get('[data-test="Attempt Container"]').should(
      "contain.text",
      "Attempt 2:",
    );

    cy.url().should("match", /#page1$/);

    cy.log("did not add to url history");
    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);
  });

  it("Two page activity, paginated, with mutual links", () => {
    const doenetML1 = `
<section>
  <p><ref name="toAbove" target="pAbove">Link to paragraph above aside</ref></p>
  <p><ref name="toAside" target="aside">Link to aside</ref></p>
  <p><ref name="toPage2" page="2">Link to page 2</ref></p>
  <p><ref name="toAbove2" page="2" target="pAbove">Link to paragraph above page 2 aside</ref></p>
  <p><ref name="toAside2" page="2" target="aside">Link to page 2 aside</ref></p>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>
  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const doenetML2 = `
<section>
  <p><ref name="toAbove" target="pAbove">Link to paragraph above aside</ref></p>
  <p><ref name="toAside" target="aside">Link to aside</ref></p>
  <p><ref name="toPage1" page="1">Link to page 1</ref></p>
  <p><ref name="toAbove1" page="1" target="pAbove">Link to paragraph above page 1 aside</ref></p>
  <p><ref name="toAside1" page="1" target="aside">Link to page 1 aside</ref></p>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>

  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).get(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");
    cy.wait(200);

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("not.exist");
    cy.url().should("match", /#page1$/);

    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });

    cy.get(cesc("#page1\\/bi")).click();
    cy.get(cesc("#page1\\/b")).should("have.text", "true");

    cy.get(cesc("#page1\\/toAbove")).click();
    cy.url().should("match", /#page1\\\/pAbove$/);

    cy.get(cesc("#page1\\/pAbove")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should("not.exist");

    cy.wait(1000); // for debounce

    cy.reload();

    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should("not.exist");

    cy.url().should("match", /#page1\\\/pAbove$/);

    cy.get(cesc("#page1\\/pAbove")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page2`);

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/_section1_title")).should("not.exist");

    cy.url().should("match", /#page2$/);

    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });

    cy.get(cesc("#page2\\/bi")).click();
    cy.get(cesc("#page2\\/b")).should("have.text", "true");

    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.get(cesc("#page2\\/toAside1")).click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("not.exist");

    cy.url().should("match", /#page1\\\/aside$/);

    cy.get(cesc("#page1\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );

    cy.wait(1000); // for debounce

    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page2\\/aside`);

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/_section1_title")).should("not.exist");

    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );

    cy.url().should("match", /#page2\\\/aside$/);

    cy.waitUntil(() =>
      cy.get(cesc("#page2\\/aside")).then((el) => {
        let rect = el[0].getBoundingClientRect();
        return rect.top > headerPixels - 1 && rect.top < headerPixels + 1;
      }),
    );

    cy.get(cesc("#page2\\/asideTitle")).click();
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.get("[data-test=previous]").click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("not.exist");

    cy.url().should("match", /#page1$/);

    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );

    cy.get(cesc("#page1\\/toAbove2")).click();

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/_section1_title")).should("not.exist");

    cy.url().should("match", /#page2\\\/pAbove$/);

    cy.waitUntil(() =>
      cy.get(cesc("#page2\\/pAbove")).then((el) => {
        let rect = el[0].getBoundingClientRect();
        return rect.top > headerPixels - 1 && rect.top < headerPixels + 1;
      }),
    );

    cy.get(cesc("#page2\\/bi")).click();
    cy.get(cesc("#page2\\/b")).should("have.text", "false");

    cy.wait(2000);

    cy.visit(`/course?tool=assignment&doenetId=${doenetId}`);

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/_section1_title")).should("not.exist");

    cy.get(cesc("#page2\\/b")).should("have.text", "false");

    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.url().should("match", /#page2$/);

    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });

    cy.get(cesc("#page2\\/toAside")).click();

    cy.get(cesc("#page2\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );

    cy.url().should("match", /#page2\\\/aside$/);

    cy.get(cesc("#page2\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });
  });

  it("Two page activity, non-paginated, with mutual links", () => {
    const doenetML1 = `
<section>
  <p><ref name="toAbove" target="pAbove">Link to paragraph above aside</ref></p>
  <p><ref name="toAside" target="aside">Link to aside</ref></p>
  <p><ref name="toPage2" page="2">Link to page 2</ref></p>
  <p><ref name="toAbove2" page="2" target="pAbove">Link to paragraph above page 2 aside</ref></p>
  <p><ref name="toAside2" page="2" target="aside">Link to page 2 aside</ref></p>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>
  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const doenetML2 = `
<section>
  <p><ref name="toAbove" target="pAbove">Link to paragraph above aside</ref></p>
  <p><ref name="toAside" target="aside">Link to aside</ref></p>
  <p><ref name="toPage1" page="1">Link to page 1</ref></p>
  <p><ref name="toAbove1" page="1" target="pAbove">Link to paragraph above page 1 aside</ref></p>
  <p><ref name="toAside1" page="1" target="aside">Link to page 1 aside</ref></p>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>

  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).get(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="Paginate"').click();
    cy.wait(100); //TODO: need the UI to let us know this was successful

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.url().should("match", /#page1$/);

    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });

    cy.get(cesc("#page1\\/bi")).click();
    cy.get(cesc("#page1\\/b")).should("have.text", "true");

    cy.log("scroll to page 2 to initialize it");
    cy.get(cesc("#page1\\/toPage2")).click();
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");

    cy.get(cesc("#page2\\/bi")).click();
    cy.get(cesc("#page2\\/b")).should("have.text", "true");

    cy.get(cesc("#page2\\/toAbove1")).click();
    cy.url().should("match", /#page1\\\/pAbove$/);

    cy.get(cesc("#page1\\/pAbove")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should("not.exist");

    cy.wait(1000); // for debounce

    cy.reload();

    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should("not.exist");

    cy.url().should("match", /#page1\\\/pAbove$/);

    cy.get(cesc("#page1\\/pAbove")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.wait(100);
    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page2`);

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");

    cy.url().should("match", /#page2$/);

    cy.get("#page2").then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should("not.exist");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.get(cesc("#page2\\/toAside1")).click();

    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );

    cy.url().should("match", /#page1\\\/aside$/);

    cy.get(cesc("#page1\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.wait(1000); // for debounce

    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page2\\/aside`);

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");

    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );

    cy.url().should("match", /#page2\\\/aside$/);

    cy.get(cesc("#page2\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#page2\\/asideTitle")).click();
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.get("#page1").scrollIntoView();

    cy.url().should("match", /#page1$/);

    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );

    cy.get(cesc("#page1\\/toAbove2")).click();

    cy.url().should("match", /#page2\\\/pAbove$/);

    cy.get(cesc("#page2\\/pAbove")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#page2\\/bi")).click();
    cy.get(cesc("#page2\\/b")).should("have.text", "false");

    cy.wait(2000);

    cy.visit(`/course?tool=assignment&doenetId=${doenetId}`);

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");

    cy.get(cesc("#page2\\/b")).should("have.text", "false");

    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.waitUntil(() => cy.url().should("match", /#page2$/));

    // Note sure why the rect of page2 does not appear to be at the top
    // cy.get('#page2').then(el => {
    //   let rect = el[0].getBoundingClientRect();
    //   expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    // })

    cy.get(cesc("#page2\\/toAside")).click();

    cy.get(cesc("#page2\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );

    cy.url().should("match", /#page2\\\/aside$/);

    cy.get(cesc("#page2\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });
  });

  it("Links to paginated two-page activity", () => {
    const doenetML1 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>
  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const doenetML2 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>

  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const doenetMLother = `
<p><ref name="toPage1" uri="doenet:doenetId=${doenetId}" page="1">Link to page 1</ref></p>
<p><ref name="toAside1" uri="doenet:doenetId=${doenetId}" page="1" target="aside">Link to page 1 aside</ref></p>
<p><ref name="toPage2" uri="doenet:doenetId=${doenetId}" page="2">Link to page 2</ref></p>
<p><ref name="toAside2" uri="doenet:doenetId=${doenetId}" page="2" target="aside">Link to page 2 aside</ref></p>
<p><ref name="toPage2b" uri="doenet:doenetId=${doenetId}#page2">Alternative link to page 2</ref></p>
<p><ref name="toAside2b" uri="doenet:doenetId=${doenetId}#page2\\/aside">Link to page 2 aside</ref></p>
`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
    });
    cy.createActivity({
      courseId,
      doenetId: doenetId2,
      parentDoenetId: courseId,
      pageDoenetId: pageDoenetId3,
      doenetML: doenetMLother,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 2); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.wait(100);
    // TODO: should not have to wait here.  It seems like this a bug
    // Without the wait get into an inconsistent situation where the activity does appear for the student,
    // but when click "View Activity" it says the assignment is not assigned

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.url().should("match", /#page1$/);

    cy.get(cesc("#page1\\/bi")).click();
    cy.get(cesc("#page1\\/b")).should("have.text", "true");

    cy.log("move to page 2 to initialize it");
    cy.get("[data-test=next]").click();
    cy.get("#page2").scrollIntoView();
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");

    cy.get(cesc("#page2\\/bi")).click();
    cy.get(cesc("#page2\\/b")).should("have.text", "true");

    cy.wait(1500); // for debounce

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.signin({ userId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 2); //Need this to wait for the row to appear

    cy.get(".navigationRow").eq(1).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.wait(100);
    // TODO: should not have to wait here.  It seems like this a bug
    // Without the wait get into an inconsistent situation where the activity does appear for the student,
    // but when click "View Activity" it says the assignment is not assigned

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 2); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(1).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/_p1")).should("have.text", "Link to page 1");

    cy.log("click link to page 1, remove target so uses same tab");
    cy.get(cesc("#\\/toPage1")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("not.exist");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should("not.exist");

    cy.url().should("match", /#page1$/);
    cy.url().should("contain", doenetId);

    cy.go("back");
    cy.url().should("contain", doenetId2);

    cy.log("click link to page 2, remove target so uses same tab");
    cy.get(cesc("#\\/toPage2")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/_section1_title")).should("not.exist");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.url().should("match", /#page2$/);
    cy.url().should("contain", doenetId);

    cy.go("back");
    cy.url().should("contain", doenetId2);

    cy.log("click link to aside from page 1, remove target so uses same tab");
    cy.get(cesc("#\\/toAside1")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("not.exist");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#page1\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#page1\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.wait(1500); // wait for debounce

    cy.go("back");
    cy.url().should("contain", doenetId2);

    cy.log("click link to aside from page 2, remove target so uses same tab");
    cy.get(cesc("#\\/toAside2")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page2\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/_section1_title")).should("not.exist");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#page2\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#page2\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#page2\\/aside_title")).click();
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.wait(1500); // wait for debounce

    cy.go("back");
    cy.url().should("contain", doenetId2);

    cy.wait(100);
    cy.log("click link b to page 2, remove target so uses same tab");
    cy.get(cesc("#\\/toPage2b")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/_section1_title")).should("not.exist");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.url().should("match", /#page2$/);
    cy.url().should("contain", doenetId);

    cy.go("back");
    cy.url().should("contain", doenetId2);

    cy.log("click link b to aside from page 2, remove target so uses same tab");
    cy.get(cesc("#\\/toAside2b")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page2\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/_section1_title")).should("not.exist");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#page2\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#page2\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });
  });

  it("Links to non-paginated two-page activity", () => {
    const doenetML1 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>
  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const doenetML2 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>

  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const doenetMLother = `
<p><ref name="toPage1" uri="doenet:doenetId=${doenetId}" page="1">Link to page 1</ref></p>
<p><ref name="toAside1" uri="doenet:doenetId=${doenetId}" page="1" target="aside">Link to page 1 aside</ref></p>
<p><ref name="toPage2" uri="doenet:doenetId=${doenetId}" page="2">Link to page 2</ref></p>
<p><ref name="toAside2" uri="doenet:doenetId=${doenetId}" page="2" target="aside">Link to page 2 aside</ref></p>
<p><ref name="toPage2b" uri="doenet:doenetId=${doenetId}#page2">Alternative link to page 2</ref></p>
<p><ref name="toAside2b" uri="doenet:doenetId=${doenetId}#page2\\/aside">Link to page 2 aside</ref></p>
`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
    });
    cy.createActivity({
      courseId,
      doenetId: doenetId2,
      parentDoenetId: courseId,
      pageDoenetId: pageDoenetId3,
      doenetML: doenetMLother,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 2); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="Paginate"]').click();
    cy.wait(100); //TODO: need the UI to let us know this was successful

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.url().should("match", /#page1$/);

    cy.get(cesc("#page1\\/bi")).click();
    cy.get(cesc("#page1\\/b")).should("have.text", "true");

    cy.log("scroll to page 2 to initialize it");
    cy.get("#page2").scrollIntoView();
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");

    cy.get(cesc("#page2\\/bi")).click();
    cy.get(cesc("#page2\\/b")).should("have.text", "true");

    cy.wait(1500); // for debounce

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.signin({ userId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 2); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(1).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");
    cy.wait(100);

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 2); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(1).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/_p1")).should("have.text", "Link to page 1");

    cy.wait(100);

    cy.log("click link to page 1, remove target so uses same tab");
    cy.get(cesc("#\\/toPage1")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should("not.exist");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    // cy.url().should('match', /#page1$/)  // don't know why this randomly fails
    cy.url().should("contain", doenetId);

    cy.go("back");
    cy.url().should("contain", doenetId2);

    cy.log("click link to page 2, remove target so uses same tab");
    cy.get(cesc("#\\/toPage2")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should("not.exist");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.url().should("match", /#page2$/);
    cy.url().should("contain", doenetId);

    cy.go("back");
    cy.url().should("contain", doenetId2);

    cy.wait(100);
    cy.log("click link to aside from page 1, remove target so uses same tab");
    cy.get(cesc("#\\/toAside1")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.url().should("match", /#page1\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#page1\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.wait(1500); // wait for debounce

    cy.go("back");
    cy.url().should("contain", doenetId2);

    cy.wait(100);
    cy.log("click link to aside from page 2, remove target so uses same tab");
    cy.get(cesc("#\\/toAside2")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page2\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#page2\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#page2\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.get(cesc("#page2\\/aside_title")).click();
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.wait(1500); // wait for debounce

    cy.go("back");
    cy.url().should("contain", doenetId2);

    cy.log("click link b to page 2, remove target so uses same tab");
    cy.get(cesc("#\\/toPage2b")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.url().should("match", /#page2$/);
    cy.url().should("contain", doenetId);

    cy.go("back");
    cy.url().should("contain", doenetId2);

    cy.log("click link b to aside from page 2, remove target so uses same tab");
    cy.get(cesc("#\\/toAside2b")).invoke("removeAttr", "target").click();

    cy.get(cesc("#page2\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#page2\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#page2\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });
  });

  it("Go directly to URLs of paginated two-page activity", () => {
    const doenetML1 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>
  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const doenetML2 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>

  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
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

    cy.log("go to page 1 url");
    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page1`);

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("not.exist");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should("not.exist");

    cy.get(cesc("#page1\\/bi")).click();
    cy.get(cesc("#page1\\/b")).should("have.text", "true");

    cy.url().should("match", /#page1$/);
    cy.url().should("contain", doenetId);

    cy.wait(1500); // for debounce

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.log("go to page 2 url");
    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page2`);

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/_section1_title")).should("not.exist");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.get(cesc("#page2\\/bi")).click();
    cy.get(cesc("#page2\\/b")).should("have.text", "true");

    cy.url().should("match", /#page2$/);
    cy.url().should("contain", doenetId);

    cy.wait(1500); // for debounce

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.log("go to page 1 aside url");
    cy.wait(100);
    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page1\\/aside`);

    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("not.exist");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#page1\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#page1\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.wait(1500); // wait for debounce

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.log("go to page 2 aside url");
    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page2\\/aside`);

    cy.get(cesc("#page2\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/_section1_title")).should("not.exist");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#page2\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#page2\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });
  });

  it("Go directly to URLs of non-paginated two-page activity", () => {
    const doenetML1 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>
  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const doenetML2 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>

  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="Paginate"').click();
    cy.wait(100); //TODO: need the UI to let us know this was successful

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.url().should("match", /#page1$/);

    cy.get(cesc("#page1\\/bi")).click();
    cy.get(cesc("#page1\\/b")).should("have.text", "true");

    cy.log("scroll to page 2 to initialize it");
    cy.get("#page2").scrollIntoView();
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");

    cy.get(cesc("#page2\\/bi")).click();
    cy.get(cesc("#page2\\/b")).should("have.text", "true");

    cy.wait(1500); // for debounce

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.wait(200);

    cy.log("go to page 1 url");
    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page1`);

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should("not.exist");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    // cy.url().should('match', /#page1$/)   // don't know why this randomly fails
    cy.url().should("contain", doenetId);

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.log("go to page 2 url");
    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page2`);

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page1\\/insideAside")).should("not.exist");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.url().should("match", /#page2$/);
    cy.url().should("contain", doenetId);

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.log("go to page 1 aside url");
    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page1\\/aside`);

    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/insideAside")).should("not.exist");

    cy.url().should("match", /#page1\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#page1\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.wait(1500); // wait for debounce

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.log("go to page 2 aside url");
    cy.visit(`/course?tool=assignment&doenetId=${doenetId}#page2\\/aside`);

    cy.get(cesc("#page2\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/insideAside")).should(
      "have.text",
      "Content in aside",
    );
    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/asideTitle")).should("have.text", "The aside");
    cy.get(cesc("#page2\\/asideTitle")).should("have.text", "The aside");

    cy.url().should("match", /#page2\\\/aside$/);
    cy.url().should("contain", doenetId);

    cy.get(cesc("#page2\\/aside")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });
  });

  it("Switching pages scrolls to top", () => {
    const doenetML1 = `
<title>Page 1</title>
<p><ref target="pBottom" name="toBottom">To bottom link</ref></p>

<lorem generateParagraphs="8" />

<p name="pBottom"><ref page="2" name="toPage2">Go to page 2</ref></p>

<lorem generateParagraphs="8" />
`;

    const doenetML2 = `
<title>Page 2</title>
<p><ref target="pBottom" name="toBottom">To bottom link</ref></p>

<lorem generateParagraphs="8" />

<p name="pBottom"><ref page="1" name="toPage1">Go to page 1</ref></p>

<lorem generateParagraphs="8" />
`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.log("make sure both pages are rendered");
    cy.get(cesc("#page1\\/_title1")).should("have.text", "Page 1");
    cy.get("[data-test=next]").click();

    cy.get(cesc("#page2\\/_title1")).should("have.text", "Page 2");
    cy.url().should("match", /#page2$/);

    cy.get(cesc("#page2\\/toBottom")).click();
    cy.url().should("match", /#page2\\\/pBottom$/);

    cy.get(cesc("#page2\\/pBottom")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.log("go to page 1 via bottom button");
    cy.get("[data-test=previous-bottom").click();

    cy.get(cesc("#page1\\/_title1")).should("have.text", "Page 1");
    cy.url().should("match", /#page1$/);

    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });

    cy.get(cesc("#page1\\/toBottom")).click();
    cy.url().should("match", /#page1\\\/pBottom$/);

    cy.get(cesc("#page1\\/pBottom")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.log("go to page 2 via bottom button");
    cy.get("[data-test=next-bottom").click();

    cy.get(cesc("#page2\\/_title1")).should("have.text", "Page 2");
    cy.url().should("match", /#page2$/);

    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });

    cy.get(cesc("#page2\\/toBottom")).click();
    cy.url().should("match", /#page2\\\/pBottom$/);

    cy.get(cesc("#page2\\/pBottom")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.log("go to page 1 via bottom link");
    cy.get(cesc("#page2\\/toPage1")).click();

    cy.get(cesc("#page1\\/_title1")).should("have.text", "Page 1");
    cy.url().should("match", /#page1$/);

    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });

    cy.get(cesc("#page1\\/toBottom")).click();
    cy.url().should("match", /#page1\\\/pBottom$/);

    cy.get(cesc("#page1\\/pBottom")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top)
        .gt(headerPixels - 1)
        .lt(headerPixels + 1);
    });

    cy.log("go to page 2 via bottom link");
    cy.get(cesc("#page1\\/toPage2")).click();

    cy.get(cesc("#page2\\/_title1")).should("have.text", "Page 2");
    cy.url().should("match", /#page2$/);

    cy.get('[data-test="Main Panel"]').then((el) => {
      expect(el.scrollTop()).eq(0);
    });
  });

  it("paginated two-page activity remembers page", () => {
    const doenetML1 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>
  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const doenetML2 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>

  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
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

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.url().should("match", /#page1$/);

    cy.get(cesc("#page1\\/bi")).click();
    cy.get(cesc("#page1\\/b")).should("have.text", "true");

    cy.log("go to page 2");
    cy.get("[data-test=next").click();

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");

    cy.get(cesc("#page2\\/bi")).click();
    cy.get(cesc("#page2\\/b")).should("have.text", "true");

    cy.wait(1500); // for debounce

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.log("remembers were last on page 2");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");
    cy.get(cesc("#page1\\/_section1_title")).should("not.exist");

    cy.url().should("match", /#page2$/);
    cy.url().should("contain", doenetId);
  });

  it("non-paginated two-page activity remembers page", () => {
    const doenetML1 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>
  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    const doenetML2 = `
<section>
  <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>

  <lorem generateParagraphs="4" />
  
  <p name="pAbove">Paragraph above aside</p>
  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="Paginate"').click();
    cy.wait(100); //TODO: need the UI to let us know this was successful

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.url().should("match", /#page1$/);

    cy.get(cesc("#page1\\/bi")).click();
    cy.get(cesc("#page1\\/b")).should("have.text", "true");

    cy.log("scroll to page 2 to initialize it");
    cy.get("#page2").scrollIntoView();
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");

    cy.get(cesc("#page2\\/bi")).click();
    cy.get(cesc("#page2\\/b")).should("have.text", "true");

    cy.wait(1500); // for debounce

    cy.go("back");
    cy.url().should("contain", `course?tool=navigation&courseId=${courseId}`);

    cy.log("remembers were last on page 2");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/_section1_title")).should("have.text", "Section 1");
    cy.get(cesc("#page2\\/_section1_title")).should("have.text", "Section 2");

    cy.waitUntil(() => cy.url().should("match", /#page2$/));

    cy.url().should("contain", doenetId);
  });

  it("Update to new version", () => {
    const doenetML1 = `
  <problem name="prob">
    <p>What is <m>1+1</m>? <answer name="ans">2</answer></p>
    <p>Current response: <copy source="ans.currentResponse" assignNames="cr" /></p>
    <p>Credit: <copy source="prob.creditAchieved" assignNames="credit" /></p>
  </problem >`;

    const doenetML2 = `
  <problem name="prob">
    <p>What is <m>2+2</m>? <answer name="ans">4</answer></p>
    <p>Current response: <copy source="ans.currentResponse" assignNames="cr" /></p>
    <p>Credit: <copy source="prob.creditAchieved" assignNames="credit" /></p>
  </problem >`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      doenetML1,
      doenetML2,
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

    cy.get(cesc("#page1\\/ans") + " textarea").type("2{enter}", {
      force: true,
    });
    cy.get(cesc("#page1\\/credit")).should("have.text", "1");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "50%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "50%");

    cy.go("back");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/cr")).should("contain.text", "2");
    cy.get(cesc("#page1\\/credit")).should("have.text", "1");

    cy.get(cesc("#page1\\/ans") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.log(
      "At least for now, hitting enter before core is intialized does not submit response",
    );
    cy.get(cesc("#page1\\/cr")).should("contain.text", "1");
    cy.get(cesc("#page1\\/ans") + " textarea").type("{enter}", { force: true });

    cy.get(cesc("#page1\\/credit")).should("have.text", "0");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "50%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "50%");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 1+2? <answer name='ans2'>3</answer></p>{enter}{ctrl+s}",
    );

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/cr")).should("contain.text", "1");
    cy.get(cesc("#page1\\/ans2")).should("not.exist");

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");

    cy.get("[data-test=CancelNewVersion]").click();
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      "new version",
    );

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get("[data-test=ConfirmNewVersion]").click();

    cy.get(cesc("#page1\\/cr")).should("contain.text", "\uff3f"); //Times out here
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "50%");

    cy.get(cesc("#page1\\/ans2") + " textarea").type("3{enter}", {
      force: true,
    });
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "50%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "25%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "50%");

    cy.get('[data-test="New Attempt"]').click();

    cy.get(cesc("#page1\\/cr")).should("contain.text", "\uff3f");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "50%");

    cy.get("[data-test=next]").click();
    cy.get(cesc("#page2\\/cr")).should("contain.text", "\uff3f");

    cy.get("[data-test=previous]").click();
    cy.get(cesc("#page1\\/cr")).should("contain.text", "\uff3f");

    cy.get("[data-test=next]").click();
    cy.get(cesc("#page2\\/cr")).should("contain.text", "\uff3f");

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

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.log("immediately get new version");
    cy.get('[data-test="View Activity"]').click();

    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "50%");

    cy.get(cesc("#page1\\/ans3") + " textarea").type("4{enter}", {
      force: true,
    });

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "33.3%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "16.7%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "50%");

    cy.get("[data-test=next]").click();

    cy.get(cesc("#page2\\/ans") + " textarea").type("4{enter}", {
      force: true,
    });

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "33.3%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "66.7%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "66.7%");

    cy.go("back");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page2\\/cr")).should("contain.text", "4");
    cy.get(cesc("#page2\\/credit")).should("have.text", "1");

    cy.get(cesc("#page2\\/ans") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.log(
      "At least for now, hitting enter before core is intialized does not submit response",
    );
    cy.get(cesc("#page2\\/cr")).should("contain.text", "1");
    cy.get(cesc("#page2\\/ans") + " textarea").type("{enter}", { force: true });

    cy.get(cesc("#page2\\/credit")).should("have.text", "0");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "33.3%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "66.7%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "66.7%");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get('[data-test="folderToggleOpenIcon"]').click();

    cy.get(".navigationRow").eq(2).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Page"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 2+3? <answer name='ans2'>5</answer></p>{enter}{ctrl+s}",
    );

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page2\\/cr")).should("contain.text", "1");
    cy.get(cesc("#page2\\/ans2")).should("not.exist");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "33.3%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "66.7%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "66.7%");

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");

    cy.get("[data-test=CancelNewVersion]").click();
    cy.get('[data-test="Main Panel"]').should(
      "not.contain.text",
      "new version",
    );

    cy.get("[data-test=NewVersionAvailable]").click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get("[data-test=ConfirmNewVersion]").click();

    cy.get(cesc("#page1\\/cr")).should("contain.text", "\uff3f");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "66.7%");

    cy.get("[data-test=next]").click();

    cy.get(cesc("#page2\\/ans2") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "50%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "25%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "66.7%");

    cy.get('[data-test="New Attempt"]').click();

    cy.get(cesc("#page1\\/cr")).should("contain.text", "\uff3f");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "66.7%");

    cy.get("[data-test=next]").click();
    cy.get(cesc("#page2\\/cr")).should("contain.text", "\uff3f");

    cy.get("[data-test=previous]").click();
    cy.get(cesc("#page1\\/cr")).should("contain.text", "\uff3f");

    cy.get("[data-test=next]").click();
    cy.get(cesc("#page2\\/cr")).should("contain.text", "\uff3f");

    cy.wait(1500); // just making sure nothing gets saved even if wait for debounce

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(2).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Page"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p>What is 2+4? <answer name='ans3'>6</answer></p>{enter}{ctrl+s}",
    );

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/cr")).should("contain.text", "\uff3f");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "66.7%");

    cy.get("[data-test=next]").click();

    cy.get(cesc("#page2\\/ans3") + " textarea").type(
      "{end}{backspace}6{enter}",
      { force: true },
    );

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "33.3%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "16.7%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "66.7%");
  });

  it("Clicking links does not give update version prompt", () => {
    const doenetML = `
<section includeAutoName includeAutoNumber name="sect">
  <title>Info only</title>
  <p>This activity is just information only, with no interactive content.
    <ref name="goPage1" page="1">Go to page 1.</ref>
    <ref name="goPage2" page="2">Go to page 2.</ref>
    <ref name="goPage3" page="3">Go to page 3.</ref>
  </p>
  
  <lorem generateParagraphs="8" />
</section >
`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      pageDoenetId3,
      doenetML1: doenetML,
      doenetML2: doenetML,
      doenetML3: doenetML,
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

    cy.get(cesc("#page1\\/sect_title")).should(
      "have.text",
      "Section 1: Info only",
    );

    cy.get(cesc("#page1\\/goPage2")).click();
    cy.get(cesc("#page2\\/sect_title")).should(
      "have.text",
      "Section 2: Info only",
    );

    cy.get(cesc("#page2\\/goPage3")).click();
    cy.get(cesc("#page3\\/sect_title")).should(
      "have.text",
      "Section 3: Info only",
    );

    cy.get("[data-test=previous]").click();
    cy.get(cesc("#page2\\/sect_title")).should(
      "have.text",
      "Section 2: Info only",
    );

    cy.get(cesc("#page2\\/goPage1")).click();
    cy.get(cesc("#page1\\/sect_title")).should(
      "have.text",
      "Section 1: Info only",
    );

    cy.wait(2000); // wait for debounce
    cy.get('[data-test="Crumb 2"]').click();

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p name='extra1'>Extra content 1</p>{enter}",
    );

    cy.go("back");

    cy.get('[data-test="folderToggleOpenIcon"]').click();

    cy.get(".navigationRow").eq(2).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Page"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p name='extra2'>Extra content 2</p>{enter}",
    );

    cy.go("back");

    cy.get(".navigationRow").eq(3).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Page"]').click();

    cy.get(".cm-content").type(
      "{moveToEnd}{enter}<p name='extra3'>Extra content 3</p>{enter}",
    );

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/extra1")).should("have.text", "Extra content 1");

    cy.get("[data-test=NewVersionAvailable]").should("not.exist");

    cy.get(cesc("#page1\\/goPage3")).click();
    cy.get(cesc("#page3\\/extra3")).should("have.text", "Extra content 3");

    cy.get(cesc("#page3\\/goPage2")).click();
    cy.get(cesc("#page2\\/extra2")).should("have.text", "Extra content 2");

    cy.get("[data-test=NewVersionAvailable]").should("not.exist");
  });

  it("Increase from one to two page activity, page one info only", () => {
    const doenetML = `
<section name="sect">
  <title>Info only</title>
</section >
`;

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId: pageDoenetId1,
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

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 2 Credit"]').should("not.exist");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.wait(2000); // wait for debounce

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Add Page"]').click();
    cy.get(".navigationRow")
      .eq(0)
      .get('[data-test="folderToggleOpenIcon"]')
      .click();

    cy.get(".navigationRow").eq(2).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Page"]').click();

    cy.get(".cm-content").type(
      '<title>Page 1</title>{enter}<p>x: <answer name="ans">x</answer></p>{enter}',
    );

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/sect_title")).should("have.text", "Info only");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "100%");

    // assignment and attempt percent are still at 100%, but don't insist on it

    cy.get("[data-test=NewVersionAvailable]").should("not.exist");

    cy.get("[data-test=next]").click();

    cy.get(cesc("#page2\\/_title1")).should("have.text", "Page 1");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");

    cy.get('[data-test="Attempt Percent"]').should("have.text", "50%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "50%");

    cy.get(cesc("#page2\\/ans") + " textarea").type("x{enter}", {
      force: true,
    });

    cy.get('[data-test="Item 2 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get("[data-test=NewVersionAvailable]").should("not.exist");
  });

  it("Change number of pages in activity", () => {
    const doenetML = `
<problem name="prob">
  <p>1: <answer name="ans">1</answer></p>
</problem >
`;

    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId: pageDoenetId1,
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
    cy.wait(1500);

    cy.get(cesc("#\\/prob_title")).should("have.text", "Problem 1");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("not.exist");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "0%");

    cy.wait(1500); // wait for debounce

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.log("increase to two pages, no new version prompt");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Add Page"]').click();
    cy.get(".navigationRow")
      .eq(0)
      .get('[data-test="folderToggleOpenIcon"]')
      .click();

    cy.get(".navigationRow").eq(2).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Page"]').click();

    cy.get(".cm-content").type(
      '<problem name="prob">{enter}<p>2: <answer name="ans">2</answer></p>{enter}</problem>{enter}',
    );

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500); // wait for update

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/prob_title")).should("have.text", "Problem 1");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "0%");

    cy.get("[data-test=NewVersionAvailable]").should("not.exist");

    cy.get("[data-test=next]").click();

    cy.get(cesc("#page2\\/prob_title")).should("have.text", "Problem 2");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "0%");

    cy.get("[data-test=NewVersionAvailable]").should("not.exist");

    cy.wait(2000); // wait for debounce

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.log("decrease to one page, no new version prompt");
    cy.get(".navigationRow").eq(2).find(".navigationColumn1").click();
    cy.get('[data-test="Delete Page"]').click();

    cy.get('[data-test="Main Panel"]').click(); //Deselect selection
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500); // wait for update

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/prob_title")).should("have.text", "Problem 1");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("not.exist");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "0%");

    cy.get("[data-test=NewVersionAvailable]").should("not.exist");

    cy.get(cesc("#\\/ans") + " textarea").type("1{enter}", { force: true });
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.log("Add second page, get new version prompt");
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Add Page"]').click();

    cy.get(".navigationRow").should("have.length", 3);
    cy.get(".navigationRow").eq(2).find(".navigationColumn1").click();
    cy.get('[data-test="Edit Page"]').click();

    cy.get(".cm-content").type(
      '<problem name="prob">{enter}<p>2: <answer name="ans">2</answer></p>{enter}</problem>{enter}',
    );

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500); // wait for update

    cy.go("back");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#\\/prob_title")).should("have.text", "Problem 1");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 2 Credit"]').should("not.exist");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get("[data-test=next]").should("not.exist");

    cy.get("[data-test=NewVersionAvailable]").click();

    cy.get("[data-test=ConfirmNewVersion]").click();

    cy.get(cesc("#page1\\/prob_title")).should("have.text", "Problem 1");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get("[data-test=next]").click();

    cy.get(cesc("#page2\\/prob_title")).should("have.text", "Problem 2");

    cy.get(cesc("#page2\\/ans") + " textarea").type("2{enter}", {
      force: true,
    });

    cy.get('[data-test="Item 2 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "50%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.go("back");

    cy.log("Delete second page, get new version prompt");

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{upArrow}{upArrow}{enter}");

    cy.get(".navigationRow").eq(2).find(".navigationColumn1").click();
    cy.get('[data-test="Delete Page"]').click();

    cy.get('[data-test="Main Panel"]').click(); //Deselect selection
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1500); // wait for update

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)')
      .click()
      .type("{downArrow}{downArrow}{enter}");

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page2\\/prob_title")).should("have.text", "Problem 2");

    cy.get('[data-test="Item 2 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "50%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get("[data-test=NewVersionAvailable]").click();

    cy.get("[data-test=ConfirmNewVersion]").click();

    cy.get(cesc("#\\/prob_title")).should("have.text", "Problem 1");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("not.exist");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "0%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#\\/ans") + " textarea").type("1{enter}", { force: true });

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");
  });

  // TODO: figure out how to get the gradebook to reload and show the new attempt
  it.skip("Finish button submits and saves state ", () => {
    const doenetML1 = `1: <answer forceFullCheckworkButton>1</answer><solution>1</solution>`;
    const doenetML2 = `2: <answer forceFullCheckworkButton>2</answer><solution>2</solution>`;
    const doenetML3 = `3: <answer forceFullCheckworkButton>3</answer><solution>3</solution>`;
    const doenetML4 = `4: <answer forceFullCheckworkButton>4</answer><solution>4</solution>`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      pageDoenetId3,
      pageDoenetId4,
      doenetML1,
      doenetML2,
      doenetML3,
      doenetML4,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="Show Finish Button"]').click();

    cy.get('[data-test="Show Solution"]').click();

    cy.get('[data-test="Show Correctness"]').click();

    cy.get('[data-test="Show Credit Achieved Menu"]').click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");
    cy.wait(100);

    cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc("#page1\\/_answer1") + " textarea").type("1", { force: true }); //Times out here

    cy.get('[data-test="Item 1 Credit"]').should("not.exist");
    cy.get('[data-test="Item 2 Credit"]').should("not.exist");
    cy.get('[data-test="Item 3 Credit"]').should("not.exist");
    cy.get('[data-test="Item 4 Credit"]').should("not.exist");
    cy.get('[data-test="Assignment Percent"]').should("not.exist");
    cy.get(cesc("#page1\\/_solution1")).should("not.exist");

    cy.get("[data-test=next]").click();

    cy.get(cesc("#page2\\/_answer1") + " textarea").type("2", { force: true });
    cy.get(cesc("#page2\\/_solution1")).should("not.exist");

    cy.get("[data-test=next]").click();

    cy.get(cesc("#page3\\/_answer1") + " textarea").type("3", { force: true });
    cy.get(cesc("#page3\\/_solution1")).should("not.exist");

    cy.get("[data-test=next]").click();

    cy.get(cesc("#page4\\/_answer1") + " textarea").type("4", { force: true });
    cy.get(cesc("#page4\\/_solution1")).should("not.exist");

    cy.get("[data-test=FinishAssessmentPrompt]").click();
    cy.get("[data-test=CancelFinishAssessment]").click();
    cy.get("[data-test=FinishAssessmentPrompt]").click();
    cy.get("[data-test=ConfirmFinishAssessment]").click();

    cy.get("h1").should("contain.text", "finished");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 3 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 4 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.visit(
      `/course?tool=gradebookStudentAssignment&courseId=${courseId}&userId=${studentUserId}&doenetId=${doenetId}`,
    );

    cy.get(cesc(`#page4\\/_answer1`) + ` .mq-editable-field`).should(
      "have.text",
      "4",
    );
    cy.get(cesc(`#page4\\/_answer1_correct`)).should("be.visible");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 3 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 4 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#page4\\/_solution1")).click();
    cy.get(cesc("#page4\\/_solution1")).should("contain.text", "4");

    cy.get("[data-test=previous]").click();

    cy.get(cesc(`#page3\\/_answer1`) + ` .mq-editable-field`).should(
      "have.text",
      "3",
    );
    cy.get(cesc(`#page3\\/_answer1_correct`)).should("be.visible");

    cy.get(cesc("#page3\\/_solution1")).click();
    cy.get(cesc("#page3\\/_solution1")).should("contain.text", "3");

    cy.get('[data-test="Item 1 Credit"]').click();

    cy.get(cesc(`#page1\\/_answer1`) + ` .mq-editable-field`).should(
      "have.text",
      "1",
    );
    cy.get(cesc(`#page1\\/_answer1_correct`)).should("be.visible");

    cy.get(cesc("#page1\\/_solution1")).click();
    cy.get(cesc("#page1\\/_solution1")).should("contain.text", "1");

    cy.get("[data-test=next]").click();

    cy.get(cesc(`#page2\\/_answer1`) + ` .mq-editable-field`).should(
      "have.text",
      "2",
    );
    cy.get(cesc(`#page2\\/_answer1_correct`)).should("be.visible");

    cy.get(cesc("#page2\\/_solution1")).click();
    cy.get(cesc("#page2\\/_solution1")).should("contain.text", "2");

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).find(".navigationColumn1").click();

    cy.get('[data-test="View Activity"]').click();

    cy.get(cesc(`#page4\\/_answer1`) + ` .mq-editable-field`).should(
      "have.text",
      "4",
    );
    cy.get(cesc(`#page4\\/_answer1_saved`)).should("be.visible");

    cy.get('[data-test="New Attempt"]').click();

    cy.get(cesc(`#page1\\/_answer1`)).should("be.visible");
    cy.get(cesc(`#page1\\/_answer1_submit`)).should("be.visible");
    cy.get(cesc("#page1\\/_solution1")).should("not.exist");

    cy.get("[data-test=next]").click();

    cy.get(cesc("#page2\\/_answer1") + " textarea").type("2", { force: true });
    cy.get(cesc("#page2\\/_solution1")).should("not.exist");

    cy.get("[data-test=FinishAssessmentPrompt]").click();
    cy.get("[data-test=ConfirmFinishAssessment]").click();

    cy.get("h1").should("contain.text", "finished");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 3 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 4 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "25%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    // TODO: how do we get the gradebook to reload and show the new attempt?
    cy.reload();
    cy.visit(
      `/course?tool=gradebookStudentAssignment&courseId=${courseId}&userId=${studentUserId}&doenetId=${doenetId}`,
    );
    cy.reload();
    cy.visit(
      `/course?tool=gradebookStudentAssignment&courseId=${courseId}&userId=${studentUserId}&doenetId=${doenetId}`,
    );

    cy.get(cesc(`#page2\\/_answer1`) + ` .mq-editable-field`).should(
      "have.text",
      "2",
    );
    cy.get(cesc(`#page2\\/_answer1_correct`)).should("be.visible");

    cy.get('[data-test="Item 1 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 2 Credit"]').should("have.text", "100%");
    cy.get('[data-test="Item 3 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Item 4 Credit"]').should("have.text", "0%");
    cy.get('[data-test="Attempt Percent"]').should("have.text", "25%");
    cy.get('[data-test="Assignment Percent"]').should("have.text", "100%");

    cy.get(cesc("#page2\\/_solution1")).click();
    cy.get(cesc("#page2\\/_solution1")).should("contain.text", "2");

    cy.get("[data-test=next]").click();
  });

  it("Change pages with navigateToTarget action and choiceinput", () => {
    const doenetML1 = `
    <setup>
      <ref page="1" name="refpage1" />
      <ref page="2" name="refpage2" />
      <ref page="3" name="refpage3" />
    </setup>

    <p>Page 1</p>

    <choiceinput inline name="moveToPage">
      <choice>Page 1</choice>
      <choice>Page 2</choice>
      <choice>Page 3</choice>
    </choiceinput>

    <callAction triggerWhen="$moveToPage.selectedIndex=1" target="refpage1" actionName="navigateToTarget" />
    <callAction triggerWhen="$moveToPage.selectedIndex=2" target="refpage2" actionName="navigateToTarget" />
    <callAction triggerWhen="$moveToPage.selectedIndex=3" target="refpage3" actionName="navigateToTarget" />
    `;

    const doenetML2 = `Page 2`;
    const doenetML3 = `Page 3`;

    cy.createMultipageActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId1,
      pageDoenetId2,
      pageDoenetId3,
      doenetML1,
      doenetML2,
      doenetML3,
    });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`);

    cy.get(".navigationRow").should("have.length", 1); //Need this to wait for the row to appear
    cy.get(".navigationRow").eq(0).get(".navigationColumn1").click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get("#page1").should("contain.text", "Page 1");

    cy.url().should("match", /#page1$/);

    cy.get(cesc(`#page1\\/moveToPage`)).select("2");

    cy.get("#page2").should("contain.text", "Page 2");

    cy.url().should("match", /#page2$/);

    cy.get("[data-test=previous]").click();

    cy.get("#page1").should("contain.text", "Page 1");

    cy.url().should("match", /#page1$/);

    cy.get(cesc(`#page1\\/moveToPage`)).select("3");

    cy.get("#page3").should("contain.text", "Page 3");

    cy.url().should("match", /#page3$/);

    cy.get("[data-test=previous]").click();

    cy.get("#page2").should("contain.text", "Page 2");

    cy.url().should("match", /#page2$/);

    cy.get("[data-test=previous]").click();

    cy.get("#page1").should("contain.text", "Page 1");

    cy.url().should("match", /#page1$/);
  });
});
