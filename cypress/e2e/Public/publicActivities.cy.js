// import {signIn} from '../DoenetSignin/DoenetSignin.cy';


describe('Multipage activity tests', function () {
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

  it('Test public urls', () => {
    const doenetML = `
<title>A public activity</title>
<p>This is public</p>
`

    cy.createActivity({courseId,doenetId,parentDoenetId:courseId,pageDoenetId, doenetML});

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.log('Document is not public by default')

    cy.visit(`http://localhost/public?doenetId=${doenetId}`)
    cy.get('[data-test="Main Panel"]').should('contain.text', 'not found');

    cy.go("back");

    cy.visit(`http://localhost/public?tool=editor&doenetId=${doenetId}`)
    cy.get('[data-test="Main Panel"]').should('contain.text', 'not found');

    cy.go("back");

    cy.log('make publicly visible')
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    cy.get('[data-test="Make Publicly Visible"]').click()

    cy.get('[data-test="toast"]').contains('Updated Make Publicly Visible to True');
    cy.get('[data-test="toast cancel button"]').click();

    cy.visit(`http://localhost/public?doenetId=${doenetId}`)

    cy.get('#\\/_p1').should('have.text', 'This is public')

    cy.title().should('contain', 'Cypress Activity')
    cy.go("back");


    cy.visit(`http://localhost/public?tool=editor&doenetId=${doenetId}`)
    cy.get('[data-test="Main Panel"]').should('contain.text', 'not found');

    cy.go("back");

    cy.log('show DoenetML source')
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    cy.get('[data-test="Show DoenetML Source"]').click()

    cy.get('[data-test="toast"]').contains('Updated Show DoenetML Source to True');
    cy.get('[data-test="toast cancel button"]').click();


    cy.visit(`http://localhost/public?doenetId=${doenetId}`)

    cy.get('#\\/_p1').should('have.text', 'This is public')

    cy.title().should('contain', 'Cypress Activity')
    cy.go("back");


    cy.visit(`http://localhost/public?tool=editor&doenetId=${doenetId}`)

    cy.get('#\\/_p1').should('have.text', 'This is public')
    cy.get('#\\/_p2').should('not.exist')

    cy.title().should('contain', 'Cypress Activity')

    cy.get('.cm-content').type('{ctrl+end}<p>A new paragraph</p>{enter}{ctrl+s}')

    cy.get('#\\/_p2').should('have.text', 'A new paragraph')

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

    cy.get('[data-test="Make Publicly Visible"]').click()

    cy.get('[data-test="toast"]').contains('Updated Make Publicly Visible to True');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Show DoenetML Source"]').click()

    cy.get('[data-test="toast"]').contains('Updated Show DoenetML Source to True');
    cy.get('[data-test="toast cancel button"]').click();

    cy.visit(`http://localhost/public?doenetId=${doenetId}`)


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


    cy.visit(`http://localhost/public?tool=editor&doenetId=${doenetId}`)

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

  it('Navigating back remembers position where clicked internal link', () => {
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

</section>`

    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId, doenetML });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Make Publicly Visible"]').click()

    cy.get('[data-test="toast"]').contains('Updated Make Publicly Visible to True');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Show DoenetML Source"]').click()

    cy.get('[data-test="toast"]').contains('Updated Show DoenetML Source to True');
    cy.get('[data-test="toast cancel button"]').click();

    cy.visit(`http://localhost/public?doenetId=${doenetId}`)


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

    cy.visit(`http://localhost/public?tool=editor&doenetId=${doenetId}`)


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