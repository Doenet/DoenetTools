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

it('basic test of update button',()=>{
  const doenetMLString = 'test code'
  cy.log('test 1');
  // cy.get('.cm-activeLine').type(doenetMLString)
  cy.get('.cm-content').type(doenetMLString)
  cy.wait(1000);
  cy.get('[data-test="Viewer Update Button"]').click();
  cy.wait(1000);
  cy.get('.sc-iBkjds > div').contains(doenetMLString);

})
// it('test 2',()=>{
//   cy.log('test 2');
// })


// it('publish button test', function() {
    //   //cy.get('[data-cy=_v6f_8r8-stZd14gT7vkB]').click();
  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').type("4k8ecd8z",{force:true});
  //   cy.get('[data-cy=editorPublishButton]').should('not.be.disabled').click({force:true}).should('be.disabled')
    
  //   cy.reload()
  //   cy.get('[data-cy=editorPublishButton]').should('be.disabled')
    
  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').clear({force:true});

  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').type("123this is my testline2line3",{force:true});
  //   cy.get('[data-cy=editorPublishButton]').should('be.disabled')

  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').clear({force:true});

  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').type("this is my testline2line3",{force:true});
  //   cy.get('[data-cy=editorPublishButton]').should('be.disabled')

  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').clear({force:true});
  //   cy.get('[class=ace_content]').get('[class=ace_text-input]').type("abc is my testline2line3",{force:true});
  //   cy.get('[data-cy=editorPublishButton]').should('not.be.disabled')   
  // });
  // it('title input test', function() {
 
  //   cy.get('input').clear().type('abc',{force:true})
  //   cy.get('[data-cy=documentTitle]').contains("Document title: abc",{force:true})
  //   cy.get('[data-cy=editorPublishButton]').should('not.be.disabled').click({force:true}).should('be.disabled')
  //   cy.reload()
  //   cy.get('[data-cy=editorPublishButton]').should('be.disabled')
  //   cy.get('[data-cy=documentTitle]').contains("Document title: abc")
  // });

  
})