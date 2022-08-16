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

    cy.createActivity({courseId,doenetId,parentDoenetId:courseId,pageDoenetId, doenetML});

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/_section1_title').should('have.text', 'Section 1')
    cy.url().should('match', /[^#]/)

    cy.window().then(async (win) => {
      expect(win.scrollY).eq(0);
    })


    cy.get('#\\/asideTitle').should('have.text', 'The aside');
    cy.get('#\\/insideAside').should('not.exist');


    cy.get('#\\/toAside').click();
    cy.url().should('match', /#\/aside$/)

    cy.get('#\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
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
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
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


    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId,doenetML });
    cy.createActivity({ courseId, doenetId: doenetId2, parentDoenetId: courseId, pageDoenetId: pageDoenetId3, doenetML: doenetMLother });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',2); //Need this to wait for the row to appear
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
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
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
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
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

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
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
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

  })

})