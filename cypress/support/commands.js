// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-wait-until';

Cypress.Commands.add("signin", ({userId}) => {
  cy.request(`/cyapi/cypressAutoSignin.php?userId=${userId}`)
    // .then((resp)=>{
    //   cy.log("signin",resp.body)
    // })
});

Cypress.Commands.add("saveDoenetML", ({doenetML,pageId,courseId}) => {
  cy.request("POST","/api/saveDoenetML.php",{
    doenetML,
    pageId,
    courseId,
    backup:false,
  })
    .then((resp)=>{
      cy.log("saveDoenetML",resp.body)
    })

});

Cypress.Commands.add("clearEvents", ({doenetId}) => {
  cy.request(`/cyapi/cypressClearEvents.php?doenetId=${doenetId}`)
  // .then((resp)=>{
  //   cy.log(resp.body)
  // })

});

Cypress.Commands.add("clearAllOfAUsersCoursesAndItems", ({userId}) => {
  cy.request(`/cyapi/cypressAllOfAUsersCoursesAndItems.php?userId=${userId}`)
    // .then((resp)=>{
    //   cy.log(resp.body)
    // })
});

Cypress.Commands.add("clearAllOfAUsersActivities", ({userId}) => {
  cy.request(`/cyapi/clearAllOfAUsersActivities.php?userId=${userId}`)
    // .then((resp)=>{
    //   cy.log(resp.body)
    // })
});

Cypress.Commands.add("createCourse", ({userId,courseId,studentUserId}) => {
  cy.request('POST', `/cyapi/cypressCreateCourse.php`, {userId,courseId,studentUserId})
    // .then((resp)=>{
    //   cy.log(resp.body)
    // })
});

Cypress.Commands.add("createActivity", ({courseId,doenetId,parentDoenetId,pageDoenetId,doenetML=""}) => {
  // cy.log(courseId,doenetId,parentDoenetId,pageDoenetId)
  cy.request('POST', `/cyapi/cypressCreateActivity.php`, {courseId, doenetId,parentDoenetId,pageDoenetId,doenetML})
    // .then((resp)=>{
    //   cy.log(resp.body)
    // })
});


Cypress.Commands.add("createMultipageActivity", ({courseId,doenetId,parentDoenetId,pageDoenetId1,pageDoenetId2,pageDoenetId3,pageDoenetId4,doenetML1,doenetML2,doenetML3,doenetML4,shuffleDoenetId,shufflePages}) => {
  cy.log(courseId,doenetId,parentDoenetId,pageDoenetId1,pageDoenetId2,pageDoenetId3,pageDoenetId4)
  cy.request('POST', `/cyapi/cypressCreateMultipageActivity.php`, {courseId, doenetId,parentDoenetId,pageDoenetId1,pageDoenetId2,pageDoenetId3,pageDoenetId4,doenetML1,doenetML2,doenetML3,doenetML4,shuffleDoenetId,shufflePages})
    // .then((resp)=>{
    //   cy.log(resp.body)
    // })
});

Cypress.Commands.add("clearIndexedDB", () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.deleteDatabase("keyval-store");

    request.addEventListener('success', resolve);
    request.addEventListener('blocked', resolve);
    request.addEventListener('error', reject);

  })
});

