// import {signIn} from '../DoenetSignin/DoenetSignin.cy';


describe('visibility events test', function () {
  const userId = "cyuserId";
  // const userId = "devuserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";

  before(() => {
    // cy.clearAllOfAUsersActivities({userId})
    cy.signin({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.createCourse({ userId, courseId });
  })
  beforeEach(() => {
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId })
    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId });
    cy.clearEvents({ doenetId })

  })


  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

  // cy.clock doesn't work in a web worker, so don't know how to check visibility events
  it.skip('single page activity, ', () => {
    const doenetML = `
  <section name="section1">
    <title>First section</title>

    <subsection name="section11">
      <title>Subsection 1.1</title>

      <graph name="g" />

      <lorem generateParagraphs="3" assignNames="p1 p2 p3" />

    </subsection>

    <subsection name="section12">
      <title>Subsection 1.2</title> 

      <video youtube="tJ4ypc5L6uU" name="v" />

      <sideBySide name="sbs">
        <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="i1" />
        <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="i2" />
      </sideBySide />
    </subsection>
  </section>

  <section name="section2">
    <title>Section 2</title>

    <spreadsheet name="ss" />

    <hint name="hint" />

    <table name="table">
      <tabular>
        <row><cell>1</cell></row>
        <row><cell>2</cell></row>
        <row><cell>3</cell></row>
        <row><cell>4</cell></row>
        <row><cell>5</cell></row>
        <row><cell>6</cell></row>
        <row><cell>7</cell></row>
        <row><cell>8</cell></row>
        <row><cell>9</cell></row>
        <row><cell>10</cell></row>
      </tabular>
    </table>

    <p name="pend">The end</p>

  </section>
  `
  
    cy.saveDoenetML({ doenetML, pageId: pageDoenetId, courseId });
    cy.visit(`http://localhost/course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`)
    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');

    cy.clock();

    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}`)
    //Interact with content
    cy.get('[data-test="Crumb 3"]').contains('Cypress Activity');
    cy.tick(1000);
    cy.wait(1000);
    cy.tick(1000);
    cy.wait(1000);
    cy.tick(1000);
    cy.wait(1000);
    cy.tick(1000);

    cy.get("#\\/_title1").should('be.visible');


    cy.log("scroll to section 2 after 10 seconds")
    cy.wait(1000);
    cy.tick(10 * 1000);
    cy.get("#\\/section2").scrollIntoView().should('be.visible');

    cy.log('scroll to graph after 60 seconds')
    cy.wait(1000);
    cy.tick(60 * 1000);
    cy.get("#\\/g").scrollIntoView().should('be.visible');


    cy.log('scroll to subsection 12 after 10 minutes')
    cy.wait(1000);
    cy.tick(10 * 60 * 1000);
    cy.get("#\\/g").scrollIntoView().should('be.visible');

    cy.log('scroll to bottom after 30 seconds')
    cy.wait(1000);
    cy.tick(30 * 1000);
    cy.get("#\\/pend").scrollIntoView().should('be.visible');

    cy.log('wait 5 minutes')
    cy.wait(1000);
    cy.tick(5*60*1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)
    cy.tick(1000)

    cy.wait(1000);

    //Test if interactions were recorded
    cy.request(`http://localhost/api/getEventData.php?doenetId[]=${doenetId}`)
      .then((resp) => {
        const events = resp.body.events;

        console.log([...events]);


      });


  })



})