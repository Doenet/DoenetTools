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

Cypress.Commands.add("createCourse", ({userId,courseId}) => {
  cy.request(`/cyapi/cypressCreateCourse.php?userId=${userId}&courseId=${courseId}`)
    // .then((resp)=>{
    //   cy.log(resp.body)
    // })
});

Cypress.Commands.add("createActivity", ({courseId,doenetId,parentDoenetId,pageDoenetId}) => {
  // cy.log(courseId,doenetId,parentDoenetId,pageDoenetId)
  cy.request(`/cyapi/cypressCreateActivity.php?courseId=${courseId}&doenetId=${doenetId}&parentDoenetId=${parentDoenetId}&pageDoenetId=${pageDoenetId}`)
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

