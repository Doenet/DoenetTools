// import {signIn} from '../DoenetSignin/DoenetSignin.cy';


describe('Single page activity tests', function () {
  const userId = "cyuserId";
  // const userId = "devuserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const doenetId2 = "activity2id";
  const pageDoenetId = "_page1id";
  const pageDoenetId2 = "_page2id";
  const pageDoenetId3 = "_page3id";

  const headerPixels = 40;

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
  })


  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

  it('Repeatedly select same internal link', () => {
    const doenetML = `
<section>
  <p><ref name="toAside" target="aside">Link to aside</ref></p>
  
  <lorem generateParagraphs="8" />

  <aside name="aside">
    <title name="asideTitle">The aside</title>
    <p name="insideAside">Content in aside</p>
  </aside>

  <lorem generateParagraphs="8" />

</section>`

    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId, doenetML });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/_section1_title').should('have.text', 'Section 1')
    cy.url().should('match', /[^#]/)

    cy.get('[data-test="Main Panel"]').then(el => {
      expect(el.scrollTop()).eq(0);
    })


    cy.get('#\\/asideTitle').should('have.text', 'The aside');
    cy.get('#\\/insideAside').should('not.exist');


    cy.get('#\\/toAside').click();
    cy.url().should('match', /#\/aside$/)

    cy.get('#\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })


    cy.get('#\\/insideAside').should('have.text', 'Content in aside');

    cy.get('#\\/asideTitle').click();
    cy.get('#\\/insideAside').should('not.exist');

    cy.get('#\\/toAside').scrollIntoView();

    cy.url().should('match', /#\/aside$/)


    cy.get('#\\/toAside').click();
    cy.get('#\\/insideAside').should('have.text', 'Content in aside');

    cy.url().should('match', /#\/aside$/)

    cy.get('#\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })



  })

  it('Links to activity', () => {
    const doenetML = `
  <section>
    <p><ref name="toAside" target="aside">Link to aside</ref></p>
    
    <lorem generateParagraphs="8" />
  
    <aside name="aside">
      <title name="asideTitle">The aside</title>
      <p name="insideAside">Content in aside</p>
    </aside>
  
    <lorem generateParagraphs="8" />
  
  </section>`


    const doenetMLother = `
<p><ref name="toTop" uri="doenet:doenetId=${doenetId}">Link to top</ref></p>
<p><ref name="toAside" uri="doenet:doenetId=${doenetId}" target="aside">Link to aside</ref></p>
<p><ref name="toAsideb" uri="doenet:doenetId=${doenetId}#/aside">Link to aside</ref></p>
`


    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId, doenetML });
    cy.createActivity({ courseId, doenetId: doenetId2, parentDoenetId: courseId, pageDoenetId: pageDoenetId3, doenetML: doenetMLother });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 2); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('.navigationRow').eq(1).find('.navigationColumn1').click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/_p1').should('have.text', 'Link to top');

    cy.log('click link to top, remove target so uses same tab')
    cy.get('#\\/toTop').invoke('removeAttr', 'target').click();

    cy.get('#\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#\\/asideTitle').should('have.text', 'The aside');
    cy.get('#\\/insideAside').should('not.exist');

    cy.url().should('contain', doenetId)

    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.log('click link to aside, remove target so uses same tab')
    cy.get('#\\/toAside').invoke('removeAttr', 'target').click();

    cy.get('#\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#\\/asideTitle').should('have.text', 'The aside');


    cy.url().should('match', /#\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })

    cy.wait(1500);  // wait for debounce

    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.get('#\\/_p1').should('have.text', 'Link to top');

    cy.log('click link to top, remove target so uses same tab')
    cy.get('#\\/toTop').invoke('removeAttr', 'target').click();

    cy.get('#\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#\\/asideTitle').should('have.text', 'The aside');
    cy.get('#\\/insideAside').should('have.text', 'Content in aside');

    cy.get('#\\/asideTitle').click();
    cy.get('#\\/insideAside').should('not.exist');

    cy.wait(1500);  // wait for debounce

    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.get('#\\/_p1').should('have.text', 'Link to top');

    cy.log('click link b to aside, remove target so uses same tab')
    cy.get('#\\/toAsideb').invoke('removeAttr', 'target').click();

    cy.get('#\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#\\/asideTitle').should('have.text', 'The aside');


    cy.url().should('match', /#\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })
  })

  it('Go directly to URLs of activity', () => {
    const doenetML = `
  <section>
    <p><ref name="toAside" target="aside">Link to aside</ref></p>
    
    <lorem generateParagraphs="8" />
  
    <aside name="aside">
      <title name="asideTitle">The aside</title>
      <p name="insideAside">Content in aside</p>
    </aside>
  
    <lorem generateParagraphs="8" />
  
  </section>`


    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId, doenetML });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();


    cy.log('go to url')
    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}`)

    cy.get('#\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#\\/asideTitle').should('have.text', 'The aside');
    cy.get('#\\/insideAside').should('not.exist');

    cy.url().should('contain', doenetId)

    cy.go("back");
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


    cy.log('go to aside url')
    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#/aside`)

    cy.get('#\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#\\/asideTitle').should('have.text', 'The aside');


    cy.url().should('match', /#\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })

  })

  it('Update to new version, infinite attempts allowed', () => {
    const doenetML = `
  <problem name="prob">
    <p>What is <m>1+1</m>? <answer name="ans">2</answer></p>
    <p>Current response: <copy source="ans.currentResponse" assignNames="cr" /></p>
    <p>Credit: <copy source="prob.creditAchieved" assignNames="credit" /></p>
  </problem >`


    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId, doenetML });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/ans textarea').type("2{enter}", { force: true });
    cy.get('#\\/credit').should('have.text', '1')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '100%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.go("back");

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/ans textarea').type("{end}{backspace}1{enter}", { force: true });

    cy.log('At least for now, hitting enter before core is intialized does not submit response')
    cy.get('#\\/cr').should("contain.text", '1')
    cy.get('#\\/ans textarea').type("{enter}", { force: true });

    cy.get('#\\/credit').should('have.text', '0')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '100%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')


    cy.go("back");

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p>What is 1+2? <answer name='ans2'>3</answer></p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/cr').should('contain.text', '1');
    cy.get('#\\/ans2').should('not.exist');

    cy.get('[data-test=NewVersionAvailable]').click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should("not.contain.text", " and the number of available attempts");

    cy.get('[data-test=CancelNewVersion]').click();
    cy.get('[data-test="Main Panel"]').should("not.contain.text", "new version");

    cy.get('[data-test=NewVersionAvailable]').click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should("not.contain.text", " and the number of available attempts");
    cy.get('[data-test=ConfirmNewVersion]').click();

    cy.get('#\\/cr').should('contain.text', '\uff3f');
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('#\\/ans2 textarea').type("3{enter}", { force: true })
    cy.get('[data-test="Attempt Percent"]').should('have.text', '50%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').click();

    cy.get('#\\/cr').should('contain.text', '\uff3f');
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.wait(1500);  // just making sure nothing gets saved even if wait for debounce

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p>What is 1+3? <answer name='ans3'>4</answer></p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.log('immediately get new version')
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('#\\/ans3 textarea').type("4{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should('have.text', '33.3%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')
  })

  it('Update to new version, one attempt allowed', () => {
    const doenetML = `
  <problem name="prob">
    <p>What is <m>1+1</m>? <answer name="ans">2</answer></p>
    <p>Current response: <copy source="ans.currentResponse" assignNames="cr" /></p>
    <p>Credit: <copy source="prob.creditAchieved" assignNames="credit" /></p>
  </problem >`


    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId, doenetML });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="Attempt Limit Checkbox"]').click();
    cy.get('[data-test="toast"]').contains('Updated Attempts Allowed to 1');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/ans textarea').type("2{enter}", { force: true });
    cy.get('#\\/credit').should('have.text', '1')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '100%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').should('be.disabled')


    cy.go("back");

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p>What is 1+2? <answer name='ans2'>3</answer></p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/cr').should('contain.text', '2');
    cy.get('#\\/ans2').should('not.exist');

    cy.get('[data-test=NewVersionAvailable]').click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should("not.contain.text", " and the number of available attempts");

    cy.get('[data-test=CancelNewVersion]').click();
    cy.get('[data-test="Main Panel"]').should("not.contain.text", "new version");

    cy.get('[data-test=NewVersionAvailable]').click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should("not.contain.text", " and the number of available attempts");

    cy.get('[data-test="New Attempt"]').should('not.be.disabled')
    cy.get('[data-test=ConfirmNewVersion]').click();

    cy.get('#\\/cr').should('contain.text', '\uff3f');
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('#\\/ans2 textarea').type("3{enter}", { force: true })
    cy.get('[data-test="Attempt Percent"]').should('have.text', '50%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').should('be.disabled')

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p>What is 1+3? <answer name='ans3'>4</answer></p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.log('get updated new version but do not interact with it')
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('[data-test="New Attempt"]').should('be.disabled')
    cy.get('#\\/ans2').should('be.visible');
    cy.get('#\\/ans3').should('not.exist');

    cy.get('[data-test=NewVersionAvailable]').click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should("not.contain.text", " and the number of available attempts");

    cy.get('[data-test=ConfirmNewVersion]').click();

    cy.get('#\\/ans3').should('be.visible');

    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')
    cy.get('[data-test="New Attempt"]').should('be.disabled')


    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p>What is 1+4? <answer name='ans4'>5</answer></p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();



    cy.log('immediately get new version')
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('#\\/ans4 textarea').type("5{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should('have.text', '25%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')
    cy.get('[data-test="New Attempt"]').should('be.disabled')

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p>What is 1+5? <answer name='ans5'>6</answer></p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.log('Can use New Attempt Button to get new content')
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/ans4').should('be.visible');
    cy.get('#\\/ans5').should('not.exist');

    cy.get('[data-test="Attempt Percent"]').should('have.text', '25%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').click()

    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('#\\/ans5 textarea').type("6{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should('have.text', '20%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')
    cy.get('[data-test="New Attempt"]').should('be.disabled')



  })

  it('Update to new version, two attempts allowed', () => {
    const doenetML = `
  <problem name="prob">
    <p>What is <m>1+1</m>? <answer name="ans">2</answer></p>
    <p>Current response: <copy source="ans.currentResponse" assignNames="cr" /></p>
    <p>Credit: <copy source="prob.creditAchieved" assignNames="credit" /></p>
  </problem >`


    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId, doenetML });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="Attempt Limit Checkbox"]').click();
    cy.get('[data-test="toast"]').contains('Updated Attempts Allowed to 1');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Attempt Limit"]').type("{end}{backspace}2{enter}")
    cy.get('[data-test="toast"]').contains('Updated Attempts Allowed to 2');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/ans textarea').type("2{enter}", { force: true });
    cy.get('#\\/credit').should('have.text', '1')
    cy.get('#\\/cr').should('contain.text', '2');
    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 1:')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '100%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').click();

    cy.get('#\\/credit').should('have.text', '0')
    cy.get('#\\/cr').should('contain.text', '\uff3f');

    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 2:')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('#\\/ans textarea').type("2{enter}", { force: true });

    cy.get('#\\/credit').should('have.text', '1')
    cy.get('#\\/cr').should('contain.text', '2');
    cy.get('[data-test="Attempt Percent"]').should('have.text', '100%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').should('be.disabled')


    cy.go("back");

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p>What is 1+2? <answer name='ans2'>3</answer></p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/cr').should('contain.text', '2');
    cy.get('#\\/ans2').should('not.exist');

    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 2:')

    cy.get('[data-test=NewVersionAvailable]').click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should("contain.text", " and the number of available attempts");

    cy.get('[data-test=CancelNewVersion]').click();
    cy.get('[data-test="Main Panel"]').should("not.contain.text", "new version");

    cy.get('[data-test=NewVersionAvailable]').click();
    cy.get('[data-test="Main Panel"]').should("contain.text", "new version");
    cy.get('[data-test="Main Panel"]').should("contain.text", " and the number of available attempts");

    cy.get('[data-test="New Attempt"]').should('not.be.disabled')
    cy.get('[data-test=ConfirmNewVersion]').click();

    cy.get('#\\/cr').should('contain.text', '\uff3f');
    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 3:')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('#\\/ans2 textarea').type("3{enter}", { force: true })
    cy.get('[data-test="Attempt Percent"]').should('have.text', '50%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').click();

    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 4:')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')
    cy.get('[data-test="New Attempt"]').should('be.disabled')


    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p>What is 1+3? <answer name='ans3'>4</answer></p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.log('immediately get new version and two more attempts')
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('[data-test="New Attempt"]').should('not.be.disabled')
    cy.get('#\\/ans2').should('be.visible');
    cy.get('#\\/ans3').should('be.visible');

    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 4:')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').click();
    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 5:')
    cy.get('[data-test="New Attempt"]').should('be.disabled')



    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p>What is 1+4? <answer name='ans4'>5</answer></p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();



    cy.log('again, immediately get new version and two more attempts')
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 5:')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('#\\/ans4 textarea').type("5{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should('have.text', '25%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').click();
    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 6:')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')


    cy.get('#\\/ans4 textarea').type("5{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should('have.text', '25%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')


    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p>What is 1+5? <answer name='ans5'>6</answer></p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.log('Can use New Attempt Button to get new content')
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/ans4').should('be.visible');
    cy.get('#\\/ans5').should('not.exist');

    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 6:')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '25%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').click()

    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 7:')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('#\\/ans5 textarea').type("6{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should('have.text', '20%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').click()

    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 8:')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('#\\/ans5 textarea').type("6{enter}", { force: true });

    cy.get('[data-test="Attempt Percent"]').should('have.text', '20%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')
    cy.get('[data-test="New Attempt"]').should('be.disabled')


  })

  it('Clicking links does not give update version prompt', () => {
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
`


    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId, doenetML });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/sect_title').should('have.text', 'Section 1: Info only')
    cy.get('[data-test="Main Panel"]').then(el => {
      expect(el.scrollTop()).eq(0);
    })


    cy.get('#\\/goMiddle1').click();
    cy.url().should('match', /#\/middle$/)

    cy.get('#\\/middle').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })


    cy.get('#\\/goBottom2').click();
    cy.url().should('match', /#\/bottom$/)

    cy.get('#\\/bottom').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })

    cy.wait(2000);  // wait for debounce


    cy.go("back");

    cy.get('#\\/middle').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })

    cy.go("back");
    cy.go("back");

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p name='extra'>Extra content</p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get("#\\/extra").should('have.text', 'Extra content');

    cy.get('[data-test=NewVersionAvailable]').should('not.exist')

  })

  it('Video interactions do not give update version prompt', () => {
    const doenetML = `
<title>A video</title>
<video youtube="tJ4ypc5L6uU" width="640px" height="360px" name="v" />
<p>State: <copy prop="state" source="v" assignNames="state" /></p>
<p>Time: <copy prop="time" source="v" assignNames="time" /></p>
<p>
  <callAction target="v" actionName="playVideo" name="playAction"><label>Play action</label></callAction>
  <callAction target="v" actionName="pauseVideo" name="pauseAction"><label>Pause action</label></callAction>
</p>
`

    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId, doenetML });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/_title1').should('have.text', 'A video')

    cy.wait(1500);  // wait for debounce

    cy.go("back");

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p name='more1'>More content 1</p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get("#\\/more1").should('have.text', 'More content 1');

    cy.get('[data-test=NewVersionAvailable]').should('not.exist')

    cy.get('#\\/state').contains("stopped")
    cy.get('#\\/playAction').click();
    cy.get('#\\/time').contains("1")
    cy.get('#\\/pauseAction').click();

    cy.wait(1500);  // wait for debounce

    cy.go("back");

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Activity"]').click();

    cy.get('.cm-content').type("{ctrl+end}{enter}<p name='more2'>More content 2</p>{enter}{ctrl+s}")

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Assigned Activity Updated');
    cy.get('[data-test="toast cancel button"]').click();

    cy.go("back")

    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get("#\\/more2").should('have.text', 'More content 2');

    cy.get('[data-test=NewVersionAvailable]').should('not.exist')

  })

})