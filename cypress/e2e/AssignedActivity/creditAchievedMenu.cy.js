// import {signIn} from '../DoenetSignin/DoenetSignin.cy';


describe('Credit achieved menu tests', function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";
  // const userId = "devuserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const doenetId2 = "activity2id";
  const pageDoenetId = "_page1id";
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
  })
  beforeEach(() => {
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId })
    cy.clearAllOfAUsersActivities({ userId: studentUserId })
  })

  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

  it('Show item credits immediately', () => {
    const doenetML = `
<problem>
  <p>Enter x: <answer name="ans">x</answer></p>
</problem>`

    cy.createActivity({courseId,doenetId,parentDoenetId:courseId,pageDoenetId, doenetML});

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="Unassign Activity"]').should('be.visible')

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)').click().type("{downArrow}{downArrow}{enter}")

    cy.get('[data-test="View Activity"]').click();

    cy.get('#\\/_problem1_title').should('have.text', 'Problem 1')

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')

    cy.get('#\\/ans textarea').type("x{enter}", {force: true})
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')

    cy.get('[data-test="New Attempt"]').click();

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')



  })

  it('Pages without graded content', () => {
    const doenetML1 = `
<problem>
  <p>Enter x: <answer name="ans">x</answer></p>
</problem>`

const doenetML2 = `
<problem>
  <p>No questions here</p>
</problem>`;

const doenetML3 = `
<problem>
<p>Enter y: <answer name="ans">y</answer></p>
</problem>`

const doenetML4 = `<p>No questions here, either</p>`;

    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, 
      pageDoenetId1: pageDoenetId, pageDoenetId2, pageDoenetId3, pageDoenetId4,
       doenetML1, doenetML2, doenetML3, doenetML4 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should('be.visible')


    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)').click().type("{downArrow}{downArrow}{enter}")

    cy.get('[data-test="View Activity"]').click();

    cy.get('#page1\\/_problem1_title').should('have.text', 'Problem 1')

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '0%')
    
    cy.get('#page1\\/ans textarea').type("x{enter}", {force: true})
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '25%')

    cy.get('[data-test="next"]').click();

    cy.get('#page2\\/_problem1_title').should('have.text', 'Problem 2');

    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '50%')

    cy.get('[data-test="next"]').click();

    cy.get('#page3\\/_problem1_title').should('have.text', 'Problem 3');

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '50%')

    cy.get('#page3\\/ans textarea').type("y{enter}", {force: true})

    cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '75%')

    cy.get('[data-test="next"]').click();
    cy.get('#page4\\/_p1').should('have.text', 'No questions here, either');

    cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')



  })

  it('Pages without graded content, non-paginated', () => {
    const doenetML1 = `
<problem>
  <p>Enter x: <answer name="ans">x</answer></p>
  <lorem generateParagraphs="12" />
</problem>`

const doenetML2 = `
<problem>
  <p>No questions here</p>
  <lorem generateParagraphs="12" />
</problem>`;

const doenetML3 = `
<problem>
  <p>Enter y: <answer name="ans">y</answer></p>
  <lorem generateParagraphs="12" />
</problem>`

const doenetML4 = `
<p>No questions here, either</p>
<lorem generateParagraphs="12" />
`;

    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, 
      pageDoenetId1: pageDoenetId, pageDoenetId2, pageDoenetId3, pageDoenetId4,
       doenetML1, doenetML2, doenetML3, doenetML4 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="Unassign Activity"]').should('be.visible')


    cy.get('[data-test="Paginate"').click();
    cy.wait(100) //TODO: need the UI to let us know this was successful

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)').click().type("{downArrow}{downArrow}{enter}")

    cy.get('[data-test="View Activity"]').click();

    cy.get('#page1\\/_problem1_title').should('have.text', 'Problem 1')

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '0%')
    
    cy.get('#page1\\/ans textarea').type("x{enter}", {force: true})
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '25%')


    cy.get('#page2').scrollIntoView();
    cy.get('#page2\\/_problem1_title').should('have.text', 'Problem 2');

    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '50%')

    cy.get('#page3').scrollIntoView();

    cy.get('#page3\\/_problem1_title').should('have.text', 'Problem 3');

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '50%')

    cy.get('#page3\\/ans textarea').type("y{enter}", {force: true})

    cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '75%')

    cy.get('#page4').scrollIntoView();

    cy.get('#page4\\/_p1').should('have.text', 'No questions here, either');

    cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')



  })

  it('Pages without graded content and zero item weight', () => {
    const doenetML1 = `
<problem>
  <p>Enter x: <answer name="ans">x</answer></p>
</problem>`

const doenetML2 = `
<problem>
  <p>No questions here</p>
</problem>`;

const doenetML3 = `
<problem>
<p>Enter y: <answer name="ans">y</answer></p>
</problem>`

const doenetML4 = `<p>No questions here, either</p>`;

    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, 
      pageDoenetId1: pageDoenetId, pageDoenetId2, pageDoenetId3, pageDoenetId4,
       doenetML1, doenetML2, doenetML3, doenetML4 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();

    cy.get('[data-test="Item Weights"]').clear().type("2 0 1 0", {force: true}).blur()
    cy.wait(100) //TODO: need the UI to let us know this was successful

    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="Unassign Activity"]').should('be.visible')


    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)').click().type("{downArrow}{downArrow}{enter}")

    cy.get('[data-test="View Activity"]').click();

    cy.get('#page1\\/_problem1_title').should('have.text', 'Problem 1')

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', 'Not started')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', 'Not started')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '0%')
    
    cy.get('#page1\\/ans textarea').type("x{enter}", {force: true})
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', 'Not started')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', 'Not started')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '66.7%')

    cy.get('[data-test="next"]').click();

    cy.get('#page2\\/_problem1_title').should('have.text', 'Problem 2');

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', 'Complete')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', 'Not started')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '66.7%')

    cy.get('[data-test="next"]').click();

    cy.get('#page3\\/_problem1_title').should('have.text', 'Problem 3');

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', 'Complete')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', 'Not started')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '66.7%')

    cy.get('#page3\\/ans textarea').type("y{enter}", {force: true})

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', 'Complete')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', 'Not started')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')

    cy.get('[data-test="next"]').click();
    cy.get('#page4\\/_p1').should('have.text', 'No questions here, either');

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', 'Complete')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 4 Credit"]').should('have.text', 'Complete')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')



  })

  it('Item credit achieved are links', () => {
    const doenetML1 = `
<problem>
  <p>Enter x: <answer name="ans">x</answer></p>
</problem>`

const doenetML2 = `
<problem>
  <p>Enter y: <answer name="ans">y</answer></p>
</problem>`;

const doenetML3 = `
<problem>
  <p>Enter z: <answer name="ans">z</answer></p>
</problem>`


    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, 
      pageDoenetId1: pageDoenetId, pageDoenetId2, pageDoenetId3,
       doenetML1, doenetML2, doenetML3 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should('be.visible')

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)').click().type("{downArrow}{downArrow}{enter}")

    cy.get('[data-test="View Activity"]').click();

    cy.get('#page1\\/_problem1_title').should('have.text', 'Problem 1')
    cy.get('#page2\\/_problem1_title').should('not.exist')
    cy.get('#page3\\/_problem1_title').should('not.exist')

    cy.url().should('match', /#page1$/)

    cy.get('[data-test="CreditAchieved Menu"]').click();

    cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '0%')
    
    cy.get('#page1\\/ans textarea').type("x{enter}", {force: true})
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '33.3%')

    cy.get('[data-test="Item 3 Credit"]').click();

    cy.get('#page3\\/_problem1_title').should('have.text', 'Problem 3');
    cy.get('#page1\\/_problem1_title').should('not.exist')
    cy.get('#page2\\/_problem1_title').should('not.exist')

    cy.url().should('match', /#page3$/)


    cy.get('#page3\\/ans textarea').type("z{enter}", {force: true})

    cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '66.7%')

    cy.get('[data-test="Item 2 Credit"]').click();

    cy.get('#page2\\/_problem1_title').should('have.text', 'Problem 2');
    cy.get('#page1\\/_problem1_title').should('not.exist')
    cy.get('#page3\\/_problem1_title').should('not.exist')

    cy.url().should('match', /#page2$/)

    cy.get('#page2\\/ans textarea').type("y{enter}", {force: true})

    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')


    cy.get('[data-test="Item 1 Credit"]').click();

    cy.get('#page1\\/_problem1_title').should('have.text', 'Problem 1')
    cy.get('#page2\\/_problem1_title').should('not.exist')
    cy.get('#page3\\/_problem1_title').should('not.exist')

    cy.url().should('match', /#page1$/)

  })

  it('Item credit achieved are links, non-paginated', () => {
    const doenetML1 = `
<problem>
  <p>Enter x: <answer name="ans">x</answer></p>
  <lorem generateParagraphs="6" />
</problem>`

const doenetML2 = `
<problem>
  <p>Enter y: <answer name="ans">y</answer></p>
  <lorem generateParagraphs="6" />
  </problem>`;

const doenetML3 = `
<problem>
  <p>Enter z: <answer name="ans">z</answer></p>
  <lorem generateParagraphs="6" />
</problem>`


    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, 
      pageDoenetId1: pageDoenetId, pageDoenetId2, pageDoenetId3,
       doenetML1, doenetML2, doenetML3 });

    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
    
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should('be.visible')

    cy.get('[data-test="Paginate"').click();
    cy.wait(100) //TODO: need the UI to let us know this was successful

    cy.get('[data-test="RoleDropDown"] > div:nth-child(2)').click().type("{downArrow}{downArrow}{enter}")

    cy.get('[data-test="View Activity"]').click();

    cy.get('#page1\\/_problem1_title').should('have.text', 'Problem 1')

    cy.get('#page2').scrollIntoView();
    cy.get('#page2\\/_problem1_title').should('have.text', 'Problem 2');

    cy.get('#page3').scrollIntoView();
    cy.get('#page3\\/_problem1_title').should('have.text', 'Problem 3');

    cy.get('#page1').scrollIntoView();

    cy.url().should('match', /#page1$/)

    cy.get('[data-test="CreditAchieved Menu"]').click();
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '0%')
    
    cy.get('#page1\\/ans textarea').type("x{enter}", {force: true})
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '33.3%')


    cy.get('[data-test="Item 3 Credit"]').click();

    cy.get('#page3\\/_problem1_title').should('have.text', 'Problem 3');

    cy.url().should('match', /#page3$/)


    cy.get('#page3\\/ans textarea').type("z{enter}", {force: true})

    cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '66.7%')

    cy.get('[data-test="Item 2 Credit"]').click();

    cy.get('#page2\\/_problem1_title').should('have.text', 'Problem 2');

    cy.url().should('match', /#page2$/)

    cy.get('#page2\\/ans textarea').type("y{enter}", {force: true})

    cy.get('[data-test="Item 2 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '100%')


    cy.get('[data-test="Item 1 Credit"]').click();

    cy.get('#page1\\/_problem1_title').should('have.text', 'Problem 1')

    cy.url().should('match', /#page1$/)

  })



})