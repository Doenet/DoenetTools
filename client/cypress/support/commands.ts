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
        isAdmin,
      }?: {
        email?: string;
        firstNames?: string;
        lastNames?: string;
        isAdmin?: boolean;
      }): Chainable<null>;

      /**
       * Custom command to create an activity for the logged in user
       */
      createActivity({
        activityName,
        doenetML,
        classifications,
        makePublic,
        publishInLibrary,
      }: {
        activityName: string;
        doenetML: string;
        classifications?: {
          systemShortName: string;
          category: string;
          subCategory: string;
          code: string;
        }[];
        makePublic?: boolean;
        publishInLibrary?: boolean;
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
    isAdmin = false,
  }: {
    email?: string;
    firstNames?: string;
    lastNames?: string;
    isAdmin?: boolean;
  } = {}) => {
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
        body: { email, firstNames, lastNames, isAdmin },
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
    makePublic = false,
    publishInLibrary = false,
  }: {
    activityName: string;
    doenetML: string;
    classifications?: {
      systemShortName: string;
      category: string;
      subCategory: string;
      code: string;
    }[];
    makePublic?: boolean;
    publishInLibrary?: boolean;
  }) => {
    cy.request({
      method: "POST",
      url: "/api/updateContent/createContent",
    }).then((resp) => {
      const contentId: string = resp.body.contentId;

      if (classifications) {
        cy.request({
          method: "POST",
          url: "/api/test/addClassificationsByNames",
          body: {
            contentId,
            classifications,
          },
        });
      }

      if (makePublic) {
        cy.request({
          method: "POST",
          url: "/api/share/makeContentPublic",
          body: {
            contentId,
            licenseCode: "CCDUAL",
          },
        });
      }

      if (publishInLibrary) {
        cy.request({
          method: "POST",
          url: "/api/addDraftToLibrary",
          body: {
            contentId: contentId,
            type: "singleDoc",
          },
        }).then((resp) => {
          cy.request({
            method: "POST",
            url: "/api/publishActivityToLibrary",
            body: {
              id: resp.body.newContentId,
              comment: "Publish it!",
            },
          });
        });
      }

      cy.request({
        method: "POST",
        url: "/api/updateContent/updateContentSettings",
        body: {
          contentId: contentId,
          name: activityName,
        },
      });
      cy.request({
        method: "POST",
        url: "/api/updateContent/saveDoenetML",
        body: {
          contentId,
          doenetML,
          numVariants: 1,
          baseComponentCounts: "{}",
        },
      }).then(() => contentId);
    });
  },
);
