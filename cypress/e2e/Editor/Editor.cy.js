// import {signIn} from '../DoenetSignin/DoenetSignin.cy';


describe('doenetEditor test', function () {
  const userId = "cyuserId";
  // const userId = "devuserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";

  before(()=>{
    // cy.clearAllOfAUsersActivities({userId})
    cy.signin({userId});
    cy.clearAllOfAUsersCoursesAndItems({userId});
    cy.createCourse({userId,courseId});
  })
  beforeEach(() => {
    cy.signin({userId});
    cy.clearAllOfAUsersActivities({userId})
    cy.createActivity({courseId,doenetId,parentDoenetId:courseId,pageDoenetId});
    cy.visit(`http://localhost/course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`)
  })


  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

it('basic test of update button',()=>{
  const doenetMLString = 'abcdefg'
  cy.get('.cm-content').type(doenetMLString)
  cy.get('[data-test="Viewer Update Button"]').click();
  cy.get('.sc-iBkjds > div').contains(doenetMLString);

})

it('Page Variant Menu Test',()=>{
  const componentName = 'seqenceContainer'
  const doenetMLString = `<p name='${componentName}' ><selectFromSequence   /></p>`
  // const doenetMLString = `<selectFromSequence  assignNames='${componentName}' />`
  cy.get('.cm-content').type(doenetMLString)
  cy.get('[data-test="Viewer Update Button"]').click();
  cy.get('[data-test="PageVariant Menu"]').click();

  cy.get('[data-test="Variant Index Input"]').invoke('val','3').type(' {enter}')
  cy.get(`#\\/${componentName}`).contains('3')

  cy.get('[data-test="Variant Name Input"]').invoke('val','4').trigger('change');
  cy.get(`#\\/${componentName}`).contains('4')
  

})

it.only('Assign Activity Test using Toast',()=>{
  const doenetMLString = '<problem name="problem1"><answer>42</answer></problem>'

  cy.get('.cm-content').type(doenetMLString)
  cy.get('[data-test="Viewer Update Button"]').click();

  cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
  cy.get('[data-test="Assign Activity"]').click();
  cy.get('[data-test="toast"]').contains('Activity Assigned');
  cy.get('[data-test="toast cancel button"]').click();

  cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}`)
  cy.get('#\\/problem1_title').contains('Problem 1')



})


it('Assign Activity Test using Breadcrumbs',()=>{
  const doenetMLString = '<problem name="problem1"><answer>42</answer></problem>'

  cy.get('.cm-content').type(doenetMLString)
  // cy.get('[data-test="Viewer Update Button"]').click(); //Shouldn't need to click the update button
  cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
  cy.get('[data-test="Assign Activity"]').click();
  cy.get('[data-test="toast"]').contains('Activity Assigned');
  cy.get('[data-test="toast cancel button"]').click();
  cy.get('[data-test="Crumb Menu"]').click({force:true});
  cy.get('[data-test="Crumb Menu Item 2"]').click();
  cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
  cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
  cy.get('[data-test="View Assigned Activity"]').click();
  cy.get('#\\/problem1_title').contains('Problem 1')
})

  
})