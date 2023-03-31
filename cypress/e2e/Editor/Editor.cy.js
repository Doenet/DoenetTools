// import {signIn} from '../DoenetSignin/DoenetSignin.cy';


describe('doenetEditor test', function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";
  // const userId = "devuserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";

  const headerPixels = 40;

  before(() => {
    // cy.clearAllOfAUsersActivities({userId})
    cy.signin({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId: studentUserId });
    cy.createCourse({ userId, courseId, studentUserId });
  })
  beforeEach(() => {
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId })
    cy.clearAllOfAUsersActivities({ userId: studentUserId })
    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId });
    cy.visit(`/course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`)
  })


  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

  it('basic test of update button', () => {
    const doenetMLString = 'abcdefg'
    cy.get('.cm-content').type(doenetMLString)
    cy.get('#\\/_document1').should('not.contain', 'a');
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get('#\\/_document1').contains(doenetMLString)
  })

  it('ctrl+s updates viewer', () => {
    const doenetMLString = 'abcdefg'
    cy.get('.cm-content').type(doenetMLString)
    cy.get('#\\/_document1').should('not.contain', 'a');
    cy.get('.cm-content').type('{control}{s}')
    cy.get('#\\/_document1').contains(doenetMLString)
  })

  it('command+s updates viewer', () => {
    const doenetMLString = 'abcdefg'
    cy.get('.cm-content').type(doenetMLString)
    cy.get('#\\/_document1').should('not.contain', 'a');
    cy.get('.cm-content').type('{command}{s}')
    cy.get('#\\/_document1').contains(doenetMLString)
  })

  it('Page Variant Menu Test', () => {
    const componentName = 'sequenceContainer'
    const doenetMLString = `<p name='${componentName}' ><selectFromSequence   /></p>`
    // const doenetMLString = `<selectFromSequence  assignNames='${componentName}' />`
    cy.get('.cm-content').type(doenetMLString)
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get('[data-test="PageVariant Menu"]').click();

    cy.get('[data-test="Variant Index Input"]').invoke('val', '3').type(' {enter}')
    cy.get(`#\\/${componentName}`).contains('3')

    cy.get('[data-test="Variant Name Input"]').invoke('val', '4').trigger('change');
    cy.get(`#\\/${componentName}`).contains('4')


  })

  it('Assign activity and navigate directly to URL', () => {
    const doenetMLString = '<problem name="problem1"><answer>42</answer></problem>'

    cy.get('.cm-content').type(doenetMLString)
    // cy.get('[data-test="Viewer Update Button"]').click();

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should('be.visible');

    cy.visit(`/course?tool=assignment&doenetId=${doenetId}`)
    cy.get('#\\/problem1_title').contains('Problem 1')

  })

  it('Assign activity and navigate using Breadcrumbs', () => {
    const doenetMLString = '<problem name="problem1"><answer>42</answer></problem>'

    cy.get('.cm-content').type(doenetMLString)
    // cy.get('[data-test="Viewer Update Button"]').click(); //Shouldn't need to click the update button
    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should('be.visible');
    cy.get('[data-test="Crumb Menu"]').click({ force: true });
    cy.get('[data-test="Crumb Menu Item 2"]').click();
    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    cy.get('[data-test="View Assigned Activity"]').click();
    cy.get('#\\/problem1_title').contains('Problem 1')
  })

  it('Assign two-page activity', () => {
    const doenetMLString1 = `
<section>
  <p><m>1+1 =</m> <answer name="a">2</answer></p>
  <p>Your answer: $a</p>
</section>`

    const doenetMLString2 = `
<section>
  <p><m>1 \\times 1 =</m> <answer name="a">1</answer></p>
  <p>Your answer: $a</p>
</section>`


    cy.get('.cm-content').type(doenetMLString1)
    // cy.get('[data-test="Viewer Update Button"]').click();

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should('be.visible');

    cy.get('[data-test="Crumb Menu"]').click({ force: true });
    cy.get('[data-test="Crumb Menu Item 2"]').click();

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    cy.get('[data-test="Add Page"]').click();
    cy.get('.navigationRow').eq(0).get('[data-test="folderToggleOpenIcon"]').click();

    // cy.get('.navigationRow').should('have.length',3);

    cy.get('.navigationRow').eq(2).find('.navigationColumn1').click();
    cy.get('[data-test="Edit Page"]').click();

    cy.get('.cm-content').type(doenetMLString2)

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="Unassign Activity"]').should('be.visible');

    cy.get('[data-test="Crumb Menu"]').click({ force: true });
    cy.get('[data-test="Crumb Menu Item 2"]').click();
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();


    cy.signin({ userId: studentUserId })

    cy.visit(`/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();


    cy.get('[data-test="View Activity"]').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')

    cy.get('[data-test="Possible Points"]').should('have.text', '10')
    cy.get('[data-test="Final Score"]').should('have.text', '0')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '0%')

    cy.get('#page1\\/a textarea').type("{enter}", { force: true })
    cy.get('#page1\\/_p2 .mjx-mrow').should('contain.text', '\uff3f')

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Final Score"]').should('have.text', '0')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '0%')
    cy.get('[data-test="Possible Points"]').should('have.text', '10')

    // TODO: why does this frequently fail if don't wait here?
    cy.wait(500)
    cy.get('#page1\\/a textarea').type("2{enter}", { force: true })
    cy.get('#page1\\/_p2 .mjx-mrow').should('contain.text', '2')

    cy.get('[data-test="Final Score"]').should('have.text', '5')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '50%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '50%')
    cy.get('[data-test="Possible Points"]').should('have.text', '10')

    cy.get('[data-test=next]').click();

    cy.wait(2000);  // make sure debounce occurred while waiting

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')

    cy.get('[data-test="Final Score"]').should('have.text', '5')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '50%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '50%')
    cy.get('[data-test="Possible Points"]').should('have.text', '10')


    cy.get('#page2\\/a textarea').type("1{enter}", { force: true })
    cy.get('#page2\\/_p2 .mjx-mrow').should('contain.text', '1')

    // cy.get('[data-test="Final Score"]').should('have.text', '10')
    // cy.get('[data-test="Attempt Percent"]').should('have.text', '100%')
    // cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    // cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    // cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')
    // cy.get('[data-test="Possible Points"]').should('have.text', '10')


    cy.log('Reloading immediately does not save state but saves credit achieved')
    cy.reload();

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page2\\/_p2').should('not.contain.text', '1')

    cy.get('[data-test="Final Score"]').should('have.text', '10')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')
    cy.get('[data-test="Possible Points"]').should('have.text', '10')

    cy.log('State on previous page was saved')
    cy.get('[data-test=previous]').click();
    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page1\\/_p2 .mjx-mrow').should('contain.text', '2')

    cy.get('[data-test=next]').click();
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')


    cy.log('New attempt, goes back to page 1')
    cy.get('[data-test="New Attempt"]').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')

    cy.get('[data-test="Attempt Percent"]').should('have.text', '0%')
    cy.get('[data-test="Final Score"]').should('have.text', '10')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')
    cy.get('[data-test="Possible Points"]').should('have.text', '10')

    cy.get('[data-test=next]').click();
    cy.get('#page2\\/a textarea').type("1{enter}", { force: true })

    cy.get('#page2\\/_p2 .mjx-mrow').should('contain.text', '1')

    cy.get('[data-test="Attempt Percent"]').should('have.text', '50%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Final Score"]').should('have.text', '10')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')
    cy.get('[data-test="Possible Points"]').should('have.text', '10')

    cy.wait(2000);  // wait for debounce

    cy.log('Reloading after a wait does save state and credit achieved')
    cy.reload();


    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page2\\/_p2 .mjx-mrow').should('contain.text', '1')

    cy.get('[data-test="Final Score"]').should('have.text', '10')
    cy.get('[data-test="Attempt Percent"]').should('have.text', '50%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')
    cy.get('[data-test="Possible Points"]').should('have.text', '10')


  })

  it('animation stopped when click update button', () => {
    const doenetMLString = `
<number name="n">1</number>

<animateFromSequence target="n" animationMode="increase once" from="1" to="100" animationInterval="100" name="a" />

<p><callAction target="a" actionName="toggleAnimation" name="ca" >
<label>Toggle animation</label>
</callAction></p>
`
    cy.get('.cm-content').type(doenetMLString)
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get('#\\/n').should('have.text', '1')

    cy.get('#\\/ca_button').click();
    cy.get('#\\/n').should('have.text', '2')
    cy.get('#\\/n').should('have.text', '3')

    cy.get('.cm-content').type("{ctrl+end}<p name='np'>More text</p>{enter}")

    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get("#\\/np").should('have.text', 'More text')

    cy.log('ensure animation has stopped')
    cy.get('#\\/n').should('have.text', '1')
    cy.wait(200)
    cy.get('#\\/n').should('have.text', '1')

    cy.get('#\\/ca_button').click();
    cy.get('#\\/n').should('have.text', '2')
    cy.get('#\\/n').should('have.text', '3')

    cy.get('#\\/ca_button').click();
    cy.wait(200)
    cy.get('#\\/n').contains(/3|4/)

    cy.get('.cm-content').type("{ctrl+end}<p name='np2'>And more</p>{enter}")

    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get("#\\/np2").should('have.text', 'And more')

    cy.log('ensure animation has stopped')
    cy.get('#\\/n').should('have.text', '1')
    cy.wait(200)
    cy.get('#\\/n').should('have.text', '1')

    cy.get('#\\/ca_button').click();
    cy.get('#\\/n').should('have.text', '2')
    cy.get('#\\/n').should('have.text', '3')

    cy.get('#\\/ca_button').click();
    cy.wait(200)
    cy.get('#\\/n').contains(/3|4/)

  })

  it('Repeatedly select same internal link', () => {
    const doenetMLString = `
<section>
<p><ref name="toAside" target="aside">Link to aside</ref></p>

<lorem generateParagraphs="8" />

<aside name="aside">
  <title name="asideTitle">The aside</title>
  <p name="insideAside">Content in aside</p>
</aside>

<lorem generateParagraphs="8" />

</section>`

    cy.get('.cm-content').type(doenetMLString)
    cy.get('[data-test="Viewer Update Button"]').click();

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

    cy.get('#\\/toAside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })

    cy.url().should('match', /#\/aside$/)


    cy.get('#\\/toAside').click();
    cy.get('#\\/insideAside').should('have.text', 'Content in aside');

    cy.url().should('match', /#\/aside$/)

    cy.get('#\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })



  })

  //This is broken
  it.skip('Navigating back remembers position where clicked internal link', () => {
    const doenetMLString = `
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

</section>`

    cy.get('.cm-content').type(doenetMLString)
    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get('#\\/_section1_title').should('have.text', 'Section 1')
    cy.url().should('match', /[^#]/)

    cy.get('[data-test="Main Panel"]').then(el => {
      expect(el.scrollTop()).eq(0);
    })


    cy.get('#\\/asideTitle').should('have.text', 'The aside');
    cy.get('#\\/insideAside').should('not.exist');

    cy.get('#\\/toAside').scrollIntoView();

    cy.get('#\\/toAside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })

    cy.get('#\\/toAside').click();
    cy.url().should('match', /#\/aside$/)

    cy.get('#\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })


    cy.get('#\\/insideAside').should('have.text', 'Content in aside');


    cy.get('#\\/bottom').scrollIntoView();

    cy.get('#\\/bottom').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })

    cy.go("back");
    cy.url().should('match', /[^#]/)

    cy.get('#\\/toAside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels - 1).lt(headerPixels + 1)
    })



  })

})