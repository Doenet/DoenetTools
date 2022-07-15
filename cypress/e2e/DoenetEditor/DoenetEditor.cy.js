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
    cy.clearAllOfAUsersActivities({userId})
    cy.createActivity({courseId,doenetId,parentDoenetId:courseId,pageDoenetId});
    cy.visit(`http://localhost/course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`)
  })


  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

it.only('basic test of update button',()=>{
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

it('Assign Activity Test',()=>{
  const doenetMLString = '<problem name="problem1"><answer>42</answer></problem>'

  cy.get('.cm-content').type(doenetMLString)
  // cy.get('[data-test="Viewer Update Button"]').click();
  cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
  cy.get('[data-test="Assign Activity"]').click();
  cy.get('[data-test="toast"]').contains('Activity Assigned');
  
  cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}`)
  cy.get('#\\/problem1_title').contains('Problem 1')



})


it.skip('Assign Activity Test using breadcrumbs',()=>{
  const doenetMLString = '<problem name="problem1"><answer>42</answer></problem>'

  cy.get('.cm-content').type(doenetMLString)
  // cy.get('[data-test="Viewer Update Button"]').click();
  cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
  cy.get('[data-test="Assign Activity"]').click();
  // cy.get('[data-test="toast"]').contains('Activity Assigned');
  
  // cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}`)
  // cy.get('#\\/problem1_title').contains('Problem 1')



})


// it('publish button test', function() {
    //   //cy.get('[data-test=_v6f_8r8-stZd14gT7vkB]').click();
  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').type("4k8ecd8z",{force:true});
  //   cy.get('[data-test=editorPublishButton]').should('not.be.disabled').click({force:true}).should('be.disabled')
    
  //   cy.reload()
  //   cy.get('[data-test=editorPublishButton]').should('be.disabled')
    
  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').clear({force:true});

  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').type("123this is my testline2line3",{force:true});
  //   cy.get('[data-test=editorPublishButton]').should('be.disabled')

  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').clear({force:true});

  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').type("this is my testline2line3",{force:true});
  //   cy.get('[data-test=editorPublishButton]').should('be.disabled')

  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').clear({force:true});
  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').type("abc is my testline2line3",{force:true});
  //   cy.get('[data-test=editorPublishButton]').should('not.be.disabled')   
  // });
  // it('title input test', function() {
 
  //   cy.get('input').clear().type('abc',{force:true})
  //   cy.get('[data-test=documentTitle]').contains("Document title: abc",{force:true})
  //   cy.get('[data-test=editorPublishButton]').should('not.be.disabled').click({force:true}).should('be.disabled')
  //   cy.reload()
  //   cy.get('[data-test=editorPublishButton]').should('be.disabled')
  //   cy.get('[data-test=documentTitle]').contains("Document title: abc")
  // });

  
})