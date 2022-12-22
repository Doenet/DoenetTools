// import {signIn} from '../DoenetSignin/DoenetSignin.cy';


describe('Navigation test', function () {
  const userId = "cyuserId";
  // const userId = "devuserId";
  const courseId = "courseid1";
  // const doenetId1 = "activity1id";
  // const pageDoenetId1 = "_page1id";
  // const doenetId2 = "activity2id";
  // const pageDoenetId2 = "_page2id";

  before(()=>{
    // cy.clearAllOfAUsersActivities({userId})
    cy.signin({userId});
    cy.clearAllOfAUsersCoursesAndItems({userId});
    cy.createCourse({userId,courseId});
  })
  beforeEach(() => {
    cy.signin({userId});
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({userId})
    // cy.createActivity({courseId,doenetId:doenetId1,parentDoenetId:courseId,pageDoenetId:pageDoenetId1});
    // cy.createActivity({courseId,doenetId:doenetId2,parentDoenetId:courseId,pageDoenetId:pageDoenetId2});
    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)
  })


  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

it('Test Add Activity',()=>{
  cy.get('[data-test="Add Activity Button"]').click();

  cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
  cy.wait(500)
  cy.get('.navigationRow').eq(0).get('.navigationColumn1').contains('Untitled Activity');


})

it('Test Add Collection',()=>{
  cy.get('[data-test="Add Collection Button"]').click();
  cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
  cy.get('.navigationRow').eq(0).get('.navigationColumn1').contains('Untitled Collection');
  
})

it('Test Add Section',()=>{
  cy.get('[data-test="Add Section Button"]').click();

  cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
  cy.get('.navigationRow').eq(0).get('.navigationColumn1').contains('Untitled Section');
})

it('Test Add a Activity, Collection and Section',()=>{
  cy.get('[data-test="Add Activity Button"]').click();
  cy.get('.navigationRow').should('have.length',1); //Need this to wait for the 1st one to appear
  cy.wait(500);

  cy.get('[data-test="Add Collection Button"]').click();
  cy.get('.navigationRow').should('have.length',1); //Need this to wait for the 2nd one to appear
  cy.wait(500);

  cy.get('[data-test="Add Section Button"]').click();
  cy.get('.navigationRow').should('have.length',3); //Need this to wait for the 3rd one to appear
  cy.wait(500);

  cy.get('.navigationRow').eq(0).get('.navigationColumn1').contains('Untitled Activity');
  cy.get('.navigationRow').eq(1).get('.navigationColumn1').contains('Untitled Collection');
  cy.get('.navigationRow').eq(2).get('.navigationColumn1').contains('Untitled Section');


})

  
})