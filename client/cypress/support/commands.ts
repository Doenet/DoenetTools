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

import "cypress-wait-until";
import "cypress-file-upload";
import "cypress-iframe";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to automatically log in as a user with the given email and names
       */
      loginAsTestUser({
        email,
        firstNames,
        lastNames,
      }?: {
        email?: string;
        firstNames?: string;
        lastNames?: string;
      }): Chainable<null>;

      /**
       * Custom command to create an activity for the logged in user
       */
      createActivity({
        activityName,
        doenetML,
        classifications,
      }: {
        activityName: string;
        doenetML: string;
        classifications?: {
          systemShortName: string;
          category: string;
          subCategory: string;
          code: string;
        }[];
      }): Chainable<string>;
    }
  }
}

Cypress.Commands.add(
  "loginAsTestUser",
  ({
    email,
    firstNames,
    lastNames,
  }: { email?: string; firstNames?: string; lastNames?: string } = {}) => {
    if (!email) {
      const code = Date.now().toString();
      email = `test${code}@doenet.org`;
      firstNames = `Test`;
      lastNames = `User${code}`;
    }

    return cy.session(email, () => {
      cy.request({
        method: "POST",
        url: "/api/login/createOrLoginAsTest",
        body: { email, firstNames, lastNames },
      });
    });
  },
);

Cypress.Commands.add(
  "createActivity",
  ({
    activityName,
    doenetML,
    classifications,
  }: {
    activityName: string;
    doenetML: string;
    classifications?: {
      systemShortName: string;
      category: string;
      subCategory: string;
      code: string;
    }[];
  }) => {
    cy.request({
      method: "POST",
      url: "/api/createActivity",
    }).then((resp) => {
      let activityId: string = resp.body.activityId;
      let docId: string = resp.body.docId;

      if (classifications) {
        cy.request({
          method: "POST",
          url: "/api/test/addClassificationsByNames",
          body: {
            id: activityId,
            classifications,
          },
        });
      }

      cy.request({
        method: "POST",
        url: "/api/updateContentName",
        body: {
          id: activityId,
          name: activityName,
        },
      });
      cy.request({
        method: "POST",
        url: "/api/saveDoenetML",
        body: {
          docId,
          doenetML,
        },
      }).then(() => activityId);
    });
  },
);
