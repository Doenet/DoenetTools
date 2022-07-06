// import {signIn} from '../DoenetSignin/DoenetSignin.cy';


describe('doenetEditor test', function () {
  // signIn();

  /*
  1. check if publish indication works properly with title changed or just or content
  2. check if document title is changed based on the title input
  */
  beforeEach(() => {
    // cy.visit('/editor/?doenetId=_v6f_8r8-stZd14gT7vkB')
  })

  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

it('try the reset task',()=>{
  cy.log("here")
  // cy.visit('http://localhost/')
  // cy.get('[data-cy=signinEmailInput]')
  // .type('devuser@example.com').blur()
  // cy.get('[data-cy=sendEmailButton]').click()
  // cy.visit('http://localhost/course')
  // cy.request('http://localhost/api/getCoursePermissionsAndSettings.php')
  
})

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