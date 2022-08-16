// import {signIn} from '../DoenetSignin/DoenetSignin.cy';


describe('Multipage activity tests', function () {
  const userId = "cyuserId";
  // const userId = "devuserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const doenetId2 = "activity2id";
  const pageDoenetId1 = "_page1id";
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



  it('Changing paginated pages changes hash, does not add to url history', () => {
    const doenetML1 = `Page 1`

    const doenetML2 = `Page 2`

    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1').should('contain.text', 'Page 1')
    
    cy.url().should('match', /#page1$/)

    cy.get('[data-test=next]').click();

    cy.get('#page2').should('contain.text', 'Page 2')

    cy.url().should('match', /#page2$/)

    cy.go('back')

    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


  })

  it('Changing non-paginated pages changes hash, does not add to url history', () => {
    const doenetML1 = `<p name="top">top 1</p><lorem generateParagraphs="8" /><p name="bottom">bottom 1</p>`
    const doenetML2 = `<p name="top">top 2</p><lorem generateParagraphs="8" /><p name="bottom">bottom 2</p>`

    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Paginate"').click();
    cy.get('[data-test="toast"]').contains('Updated Paginate to False');
    cy.get('[data-test="toast cancel button"]').click();


    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1\\/top').should('contain.text', 'top 1')
    cy.get('#page2\\/top').should('contain.text', 'top 2')
    
    cy.url().should('match', /#page1$/)

    cy.get('#page1\\/bottom').scrollIntoView();

    cy.url().should('match', /#page1$/)

    cy.get('#page2\\/top').scrollIntoView();

    cy.url().should('match', /#page2$/)

    cy.get('#page2\\/bottom').scrollIntoView();
    cy.url().should('match', /#page2$/)

    cy.get('#page1\\/bottom').scrollIntoView();
    cy.url().should('match', /#page1$/)

    cy.go('back')

    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


  })

  it('New attempt starts at page 1, paginated', () => {
    const doenetML1 = `<p name="top">top 1</p><lorem generateParagraphs="8" /><p name="bottom">bottom 1</p>`
    const doenetML2 = `<p name="top">top 2</p><lorem generateParagraphs="8" /><p name="bottom">bottom 2</p>`

    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();


    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1\\/top').should('contain.text', 'top 1')
    
    cy.url().should('match', /#page1$/)

    cy.get('[data-test="next"]').click()

    cy.get('#page2\\/top').should('contain.text', 'top 2')

    cy.url().should('match', /#page2$/)

    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 1:')

    cy.get('[data-test="New Attempt"]').click();

    cy.get('#page1\\/top').should('contain.text', 'top 1')
   
    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 2:')

    cy.url().should('match', /#page1$/)

    cy.log('did not add to url history')
    cy.go('back')
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


  })

  it('New attempt starts at page 1, non-paginated', () => {
    const doenetML1 = `<p name="top">top 1</p><lorem generateParagraphs="8" /><p name="bottom">bottom 1</p>`
    const doenetML2 = `<p name="top">top 2</p><lorem generateParagraphs="8" /><p name="bottom">bottom 2</p>`

    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Paginate"').click();
    cy.get('[data-test="toast"]').contains('Updated Paginate to False');
    cy.get('[data-test="toast cancel button"]').click();


    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1\\/top').should('contain.text', 'top 1')
    cy.get('#page2\\/top').should('contain.text', 'top 2')
    
    cy.url().should('match', /#page1$/)

    cy.get('#page2\\/bottom').scrollIntoView();

    cy.url().should('match', /#page2$/)

    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 1:')

    cy.get('[data-test="New Attempt"]').click();

    cy.get('#page1\\/top').should('contain.text', 'top 1')
    cy.get('#page2\\/top').should('contain.text', 'top 2')
   
    cy.get('[data-test="Attempt Container"]').should('contain.text', 'Attempt 2:')

    cy.url().should('match', /#page1$/)

    cy.log('did not add to url history')
    cy.go('back')
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


  })

  it('Two page activity, paginated, with mutual links', () => {
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

</section>`

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

</section>`

    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('not.exist')
    cy.url().should('match', /#page1$/)

    cy.window().then(async (win) => {
      expect(win.scrollY).eq(0);
    })

    cy.get('#page1\\/bi_input').click();
    cy.get('#page1\\/b').should('have.text', 'true');


    cy.get('#page1\\/toAbove').click();
    cy.url().should('match', /#page1\/pAbove$/)

    cy.get('#page1\\/pAbove').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');

    cy.wait(1000); // for debounce

    cy.reload();

    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');

    cy.url().should('match', /#page1\/pAbove$/)

    cy.get('#page1\\/pAbove').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })


    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page2`)

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('not.exist')

    cy.url().should('match', /#page2$/)

    cy.window().then(async (win) => {
      expect(win.scrollY).eq(0);
    })


    cy.get('#page2\\/bi_input').click();
    cy.get('#page2\\/b').should('have.text', 'true');


    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');

    cy.get('#page2\\/toAside1').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('not.exist')

    cy.url().should('match', /#page1\/aside$/)

    cy.get('#page1\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');


    cy.wait(1000); // for debounce

    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page2/aside`)


    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('not.exist')

    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');

    cy.url().should('match', /#page2\/aside$/)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.get('#page2\\/asideTitle').click();
    cy.get('#page2\\/insideAside').should('not.exist');

    cy.get('[data-test=previous]').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('not.exist')

    cy.url().should('match', /#page1$/)

    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');


    cy.get('#page1\\/toAbove2').click();

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('not.exist')

    cy.url().should('match', /#page2\/pAbove$/)

    cy.get('#page2\\/pAbove').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.get('#page2\\/bi_input').click();
    cy.get('#page2\\/b').should('have.text', 'false');

    cy.wait(2000);


    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}`)

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('not.exist')

    cy.get('#page2\\/b').should('have.text', 'false');

    cy.get('#page2\\/insideAside').should('not.exist');

    cy.url().should('match', /#page2$/)

    cy.window().then(async (win) => {
      expect(win.scrollY).eq(0);
    })

    cy.get('#page2\\/toAside').click();

    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');

    cy.url().should('match', /#page2\/aside$/)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })



  })

  it('Two page activity, non-paginated, with mutual links', () => {
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

</section>`

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

</section>`

    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Paginate"').click();
    cy.get('[data-test="toast"]').contains('Updated Paginate to False');
    cy.get('[data-test="toast cancel button"]').click();


    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.url().should('match', /#page1$/)

    cy.window().then(async (win) => {
      expect(win.scrollY).eq(0);
    })

    cy.get('#page1\\/bi_input').click();
    cy.get('#page1\\/b').should('have.text', 'true');


    cy.log('scroll to page 2 to initialize it')
    cy.get('#page1\\/toPage2').click();
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')

    cy.get('#page2\\/bi_input').click();
    cy.get('#page2\\/b').should('have.text', 'true');


    cy.get('#page2\\/toAbove1').click();
    cy.url().should('match', /#page1\/pAbove$/)

    cy.get('#page1\\/pAbove').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');

    cy.wait(1000); // for debounce

    cy.reload();

    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');

    cy.url().should('match', /#page1\/pAbove$/)

    cy.get('#page1\\/pAbove').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })


    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page2`)

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')

    cy.url().should('match', /#page2$/)

    cy.get('#page2').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })


    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');

    cy.get('#page2\\/toAside1').click();

    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');

    cy.url().should('match', /#page1\/aside$/)

    cy.get('#page1\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })



    cy.wait(1000); // for debounce

    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page2/aside`)


    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')

    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');

    cy.url().should('match', /#page2\/aside$/)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.get('#page2\\/asideTitle').click();
    cy.get('#page2\\/insideAside').should('not.exist');

    cy.get('#page1').scrollIntoView()

    cy.url().should('match', /#page1$/)

    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');

    cy.get('#page1\\/toAbove2').click();


    cy.url().should('match', /#page2\/pAbove$/)

    cy.get('#page2\\/pAbove').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.get('#page2\\/bi_input').click();
    cy.get('#page2\\/b').should('have.text', 'false');

    cy.wait(2000);


    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}`)

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')

    cy.get('#page2\\/b').should('have.text', 'false');

    cy.get('#page2\\/insideAside').should('not.exist');

    cy.url().should('match', /#page2$/)

    // Note sure why the rect of page2 does not appear to be at the top
    // cy.get('#page2').then(el => {
    //   let rect = el[0].getBoundingClientRect();
    //   expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    // })

    cy.get('#page2\\/toAside').click();

    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');

    cy.url().should('match', /#page2\/aside$/)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })



  })


  it('Links to paginated two-page activity', () => {
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

</section>`

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

</section>`

    const doenetMLother = `
<p><ref name="toPage1" uri="doenet:doenetId=${doenetId}" page="1">Link to page 1</ref></p>
<p><ref name="toAside1" uri="doenet:doenetId=${doenetId}" page="1" target="aside">Link to page 1 aside</ref></p>
<p><ref name="toPage2" uri="doenet:doenetId=${doenetId}" page="2">Link to page 2</ref></p>
<p><ref name="toAside2" uri="doenet:doenetId=${doenetId}" page="2" target="aside">Link to page 2 aside</ref></p>
<p><ref name="toPage2b" uri="doenet:doenetId=${doenetId}#page2">Alternative link to page 2</ref></p>
<p><ref name="toAside2b" uri="doenet:doenetId=${doenetId}#page2/aside">Link to page 2 aside</ref></p>
`


    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });
    cy.createActivity({ courseId, doenetId: doenetId2, parentDoenetId: courseId, pageDoenetId: pageDoenetId3, doenetML: doenetMLother });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',2); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();


    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.url().should('match', /#page1$/)

    cy.get('#page1\\/bi_input').click();
    cy.get('#page1\\/b').should('have.text', 'true');

    cy.log('move to page 2 to initialize it')
    cy.get('[data-test=next]').click();
    cy.get('#page2').scrollIntoView();
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')

    cy.get('#page2\\/bi_input').click();
    cy.get('#page2\\/b').should('have.text', 'true');

    cy.wait(1500); // for debounce

    cy.go('back')
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);

    cy.get('.navigationRow').eq(1).find('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/_p1').should('have.text', 'Link to page 1');

    cy.log('click link to page 1, remove target so uses same tab')
    cy.get('#\\/toPage1').invoke('removeAttr', 'target').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('not.exist')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');

    cy.url().should('match', /#page1$/)
    cy.url().should('contain', doenetId)

    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.log('click link to page 2, remove target so uses same tab')
    cy.get('#\\/toPage2').invoke('removeAttr', 'target').click();

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');


    cy.url().should('match', /#page2$/)
    cy.url().should('contain', doenetId)

    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.log('click link to aside from page 1, remove target so uses same tab')
    cy.get('#\\/toAside1').invoke('removeAttr', 'target').click();

    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('not.exist')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');


    cy.url().should('match', /#page1\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#page1\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.wait(1500);  // wait for debounce

    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.log('click link to aside from page 2, remove target so uses same tab')
    cy.get('#\\/toAside2').invoke('removeAttr', 'target').click();

    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');


    cy.url().should('match', /#page2\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.get('#page2\\/aside_title').click();
    cy.get('#page2\\/insideAside').should('not.exist');

    cy.wait(1500); // wait for debounce

    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.log('click link b to page 2, remove target so uses same tab')
    cy.get('#\\/toPage2b').invoke('removeAttr', 'target').click();

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');


    cy.url().should('match', /#page2$/)
    cy.url().should('contain', doenetId)


    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.log('click link b to aside from page 2, remove target so uses same tab')
    cy.get('#\\/toAside2b').invoke('removeAttr', 'target').click();

    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');


    cy.url().should('match', /#page2\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })



  })

  it('Links to non-paginated two-page activity', () => {
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

</section>`

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

</section>`

    const doenetMLother = `
<p><ref name="toPage1" uri="doenet:doenetId=${doenetId}" page="1">Link to page 1</ref></p>
<p><ref name="toAside1" uri="doenet:doenetId=${doenetId}" page="1" target="aside">Link to page 1 aside</ref></p>
<p><ref name="toPage2" uri="doenet:doenetId=${doenetId}" page="2">Link to page 2</ref></p>
<p><ref name="toAside2" uri="doenet:doenetId=${doenetId}" page="2" target="aside">Link to page 2 aside</ref></p>
<p><ref name="toPage2b" uri="doenet:doenetId=${doenetId}#page2">Alternative link to page 2</ref></p>
<p><ref name="toAside2b" uri="doenet:doenetId=${doenetId}#page2/aside">Link to page 2 aside</ref></p>
`


    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });
    cy.createActivity({ courseId, doenetId: doenetId2, parentDoenetId: courseId, pageDoenetId: pageDoenetId3, doenetML: doenetMLother });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',2); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Paginate"').click();
    cy.get('[data-test="toast"]').contains('Updated Paginate to False');
    cy.get('[data-test="toast cancel button"]').click();


    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.url().should('match', /#page1$/)

    cy.get('#page1\\/bi_input').click();
    cy.get('#page1\\/b').should('have.text', 'true');


    cy.log('scroll to page 2 to initialize it')
    cy.get('#page2').scrollIntoView();
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')

    cy.get('#page2\\/bi_input').click();
    cy.get('#page2\\/b').should('have.text', 'true');

    cy.wait(1500); // for debounce

    cy.go('back')
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);

    cy.get('.navigationRow').eq(1).find('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#\\/_p1').should('have.text', 'Link to page 1');

    cy.log('click link to page 1, remove target so uses same tab')
    cy.get('#\\/toPage1').invoke('removeAttr', 'target').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');

    cy.url().should('match', /#page1$/)
    cy.url().should('contain', doenetId)

    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.log('click link to page 2, remove target so uses same tab')
    cy.get('#\\/toPage2').invoke('removeAttr', 'target').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');


    cy.url().should('match', /#page2$/)
    cy.url().should('contain', doenetId)

    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.log('click link to aside from page 1, remove target so uses same tab')
    cy.get('#\\/toAside1').invoke('removeAttr', 'target').click();

    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');


    cy.url().should('match', /#page1\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#page1\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.wait(1500);  // wait for debounce

    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.log('click link to aside from page 2, remove target so uses same tab')
    cy.get('#\\/toAside2').invoke('removeAttr', 'target').click();

    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');


    cy.url().should('match', /#page2\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.get('#page2\\/aside_title').click();
    cy.get('#page2\\/insideAside').should('not.exist');

    cy.wait(1500); // wait for debounce

    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.log('click link b to page 2, remove target so uses same tab')
    cy.get('#\\/toPage2b').invoke('removeAttr', 'target').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');


    cy.url().should('match', /#page2$/)
    cy.url().should('contain', doenetId)


    cy.go("back");
    cy.url().should('contain', doenetId2)

    cy.log('click link b to aside from page 2, remove target so uses same tab')
    cy.get('#\\/toAside2b').invoke('removeAttr', 'target').click();

    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');


    cy.url().should('match', /#page2\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })



  })


  it('Go directly to URLs of paginated two-page activity', () => {
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

</section>`

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

</section>`


    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();


    cy.log('go to page 1 url')
    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page1`)

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('not.exist')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');

    cy.get('#page1\\/bi_input').click();
    cy.get('#page1\\/b').should('have.text', 'true');

    cy.url().should('match', /#page1$/)
    cy.url().should('contain', doenetId)

    cy.wait(1500); // for debounce

    cy.go("back");
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


    cy.log('go to page 2 url')
    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page2`)

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');

    cy.get('#page2\\/bi_input').click();
    cy.get('#page2\\/b').should('have.text', 'true');

    cy.url().should('match', /#page2$/)
    cy.url().should('contain', doenetId)

    cy.wait(1500); // for debounce

    cy.go("back");
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


    cy.log('go to page 1 aside url')
    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page1/aside`)

    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('not.exist')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');


    cy.url().should('match', /#page1\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#page1\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.wait(1500);  // wait for debounce

    cy.go("back");
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


    cy.log('go to page 2 aside url')
    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page2/aside`)

    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');


    cy.url().should('match', /#page2\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

  })

  it('Go directly to URLs of non-paginated two-page activity', () => {
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

</section>`

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

</section>`


    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Paginate"').click();
    cy.get('[data-test="toast"]').contains('Updated Paginate to False');
    cy.get('[data-test="toast cancel button"]').click();


    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.url().should('match', /#page1$/)

    cy.get('#page1\\/bi_input').click();
    cy.get('#page1\\/b').should('have.text', 'true');


    cy.log('scroll to page 2 to initialize it')
    cy.get('#page2').scrollIntoView();
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')

    cy.get('#page2\\/bi_input').click();
    cy.get('#page2\\/b').should('have.text', 'true');

    cy.wait(1500); // for debounce

    cy.go('back')
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


    cy.log('go to page 1 url')
    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page1`)

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');

    cy.url().should('match', /#page1$/)
    cy.url().should('contain', doenetId)

    cy.go("back");
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


    cy.log('go to page 2 url')
    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page2`)

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');


    cy.url().should('match', /#page2$/)
    cy.url().should('contain', doenetId)

    cy.go("back");
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


    cy.log('go to page 1 aside url')
    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page1/aside`)

    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');


    cy.url().should('match', /#page1\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#page1\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

    cy.wait(1500);  // wait for debounce

    cy.go("back");
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);


    cy.log('go to page 2 aside url')
    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}#page2/aside`)

    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');
    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');


    cy.url().should('match', /#page2\/aside$/)
    cy.url().should('contain', doenetId)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(headerPixels-1).lt(headerPixels+1)
    })

  })


  it('paginated two-page activity remembers page', () => {
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

</section>`

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

</section>`


    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();


    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.url().should('match', /#page1$/)

    cy.get('#page1\\/bi_input').click();
    cy.get('#page1\\/b').should('have.text', 'true');


    cy.log('go to page 2')
    cy.get('[data-test=next').click();

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')

    cy.get('#page2\\/bi_input').click();
    cy.get('#page2\\/b').should('have.text', 'true');

    cy.wait(1500); // for debounce

    cy.go('back')
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);

    cy.log('remembers were last on page 2')
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('not.exist')

    cy.url().should('match', /#page2$/)
    cy.url().should('contain', doenetId)

  })

  it('non-paginated two-page activity remembers page', () => {
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

</section>`

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

</section>`


    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, doenetML1, doenetML2 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');
    cy.get('[data-test="toast cancel button"]').click();

    cy.get('[data-test="Paginate"').click();
    cy.get('[data-test="toast"]').contains('Updated Paginate to False');
    cy.get('[data-test="toast cancel button"]').click();


    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.url().should('match', /#page1$/)

    cy.get('#page1\\/bi_input').click();
    cy.get('#page1\\/b').should('have.text', 'true');


    cy.log('scroll to page 2 to initialize it')
    cy.get('#page2').scrollIntoView();
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')

    cy.get('#page2\\/bi_input').click();
    cy.get('#page2\\/b').should('have.text', 'true');

    cy.wait(1500); // for debounce

    cy.go('back')
    cy.url().should('contain', `course?tool=navigation&courseId=${courseId}`);

    cy.log('remembers were last on page 2')
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();
    cy.get('[data-test="View Assigned Activity"]').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')


    cy.url().should('match', /#page2$/)
    cy.url().should('contain', doenetId)

  })



  
})