import { cesc2 } from "../../../src/_utils/url";

describe('Gradebook tests', function () {
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
  const shuffleDoenetId = "_shuffleId";

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

  it('Gradebook show correct variant', () => {
    const doenetML1 = `
    <problem>
      <title>Option 1</title>
      <p><selectFromSequence from="10" to="19" assignNames="n" />: <answer name="ans">$n</answer></p>
      <p>You answered <math copySource="ans.submittedResponse" name="ans2" /></p>
    </problem>`
    const doenetML2 = `
    <problem>
      <title>Option 2</title>
      <p><selectFromSequence from="20" to="29" assignNames="n" />: <answer name="ans">$n</answer></p>
      <p>You answered <math copySource="ans.submittedResponse" name="ans2" /></p>
      </problem>`
    const doenetML3 = `
    <problem>
      <title>Option 3</title>
      <p><selectFromSequence from="30" to="39" assignNames="n" />: <answer name="ans">$n</answer></p>
      <p>You answered <math copySource="ans.submittedResponse" name="ans2" /></p>
    </problem>`

    cy.createMultipageActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId1, pageDoenetId2, pageDoenetId3, doenetML1, doenetML2, doenetML3, shufflePages: true, shuffleDoenetId });

    cy.visit(`/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();

    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should('be.visible')


    // update grade category to exams
    cy.get('[data-test="Grade Category"] > div:nth-child(2)').click().type("{downArrow}{downArrow}{enter}")


    cy.signin({ userId: studentUserId })

    cy.visit(`/course?tool=navigation&courseId=${courseId}`)

    cy.get('.navigationRow').should('have.length', 1); //Need this to wait for the row to appear
    cy.get('.navigationRow').eq(0).find('.navigationColumn1').click();

    cy.get('[data-test="View Activity"]').click();

    let pageOrder = [];
    let ns = [];

    cy.get(cesc2("#page1/_title1")).invoke("text").then((text) => {
      pageOrder.push(parseInt(text.slice(7)))
    })

    cy.get(cesc2('#page1/n')).invoke("text").then((text) => {
      ns.push(parseInt(text));
    })

    cy.get(cesc2('#page1/ans2') + ' .mjx-mrow').should('contain.text', '\uff3f')

    cy.get(cesc2('#page1/ans') + ' textarea').type("wrong{enter}", { force: true })

    cy.get(cesc2('#page1/ans2') + ' .mjx-mrow').should('contain.text', "wrong");


    cy.get('[data-test=next').click();

    cy.get(cesc2("#page2/_title1")).invoke("text").then((text) => {
      pageOrder.push(parseInt(text.slice(7)))
    })
    cy.get(cesc2('#page2/n')).invoke("text").then((text) => {
      ns.push(parseInt(text));
    })



    cy.get('[data-test=next').click();

    cy.get(cesc2("#page3/_title1")).invoke("text").then((text) => {
      pageOrder.push(parseInt(text.slice(7)))
      console.log('pageOrder', [...pageOrder])
    })
    cy.get(cesc2('#page3/n')).invoke("text").then((text) => {
      ns.push(parseInt(text));
      console.log('ns', [...ns])

      cy.get(cesc2('#page3/ans2') + ' .mjx-mrow').should('contain.text', '\uff3f')

      cy.get(cesc2('#page3/ans') + ' textarea').type(`${text}{enter}`, { force: true })

      cy.get(cesc2('#page3/ans2') + ' .mjx-mrow').should('contain.text', text);


    })

    cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
    cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
    cy.get('[data-test="Assignment Percent"]').should('have.text', '33.3%')


    cy.get('[data-test="Crumb 2"]').click();
    cy.get('.navigationRow').should('have.length', 1);

    cy.visit(`/course?tool=gradebookStudentAssignment&courseId=${courseId}&userId=${studentUserId}&doenetId=${doenetId}`).then(() => {
      // put inside a "then" just so that pageOrder and ns have their new values

      cy.get(cesc2('#page3/_title1')).should('have.text', `Option ${pageOrder[2]}`)
      cy.get(cesc2('#page3/ans2') + ' .mjx-mrow').should('contain.text', `${ns[2]}`)

      cy.get('[data-test=previous').click();

      cy.get(cesc2('#page2/_title1')).should('have.text', `Option ${pageOrder[1]}`)
      cy.get(cesc2('#page2/ans2') + ' .mjx-mrow').should('contain.text', "\uff3f")

      cy.get('[data-test=previous').click();

      cy.get(cesc2('#page1/_title1')).should('have.text', `Option ${pageOrder[0]}`)
      cy.get(cesc2('#page1/ans2') + ' .mjx-mrow').should('contain.text', "wrong")


      cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')
      cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
      cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
      cy.get('[data-test="Assignment Percent"]').should('have.text', '33.3%')


    })


    cy.signin({ userId });

    cy.visit(`/course?tool=gradebookStudentAssignment&courseId=${courseId}&userId=${studentUserId}&doenetId=${doenetId}`).then(() => {
      // put inside a "then" just so that pageOrder and ns have their new values

      cy.get('#page3/_title1').should('have.text', `Option ${pageOrder[2]}`)
      cy.get(cesc2('#page3/ans2') + ' .mjx-mrow').should('contain.text', `${ns[2]}`)

      cy.get('[data-test=previous').click();

      cy.get('#page2/_title1').should('have.text', `Option ${pageOrder[1]}`)
      cy.get(cesc2('#page2/ans2') + ' .mjx-mrow').should('contain.text', "\uff3f")

      cy.get('[data-test=previous').click();

      cy.get('#page1/_title1').should('have.text', `Option ${pageOrder[0]}`)
      cy.get(cesc2('#page1/ans2') + ' .mjx-mrow').should('contain.text', "wrong")


      cy.get('[data-test="Item 1 Credit"]').should('have.text', '0%')
      cy.get('[data-test="Item 2 Credit"]').should('have.text', '0%')
      cy.get('[data-test="Item 3 Credit"]').should('have.text', '100%')
      cy.get('[data-test="Assignment Percent"]').should('have.text', '33.3%')


    })




  })


})