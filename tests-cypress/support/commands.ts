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

import type { ContentType } from "@doenet-tools/client/src/types";

Cypress.Commands.add(
  "loginAsTestUser",
  ({
    email,
    firstNames,
    lastNames,
    isEditor = false,
    isAuthor = false,
  }: {
    email?: string;
    firstNames?: string;
    lastNames?: string;
    isEditor?: boolean;
    isAuthor?: boolean;
  } = {}) => {
    const code = Date.now().toString();
    if (!email) {
      email = `test${code}@doenet.org`;
    }
    if (!firstNames && !lastNames) {
      firstNames = `Test`;
      lastNames = `User${code}`;
    }

    return cy.session(email, () => {
      cy.request({
        method: "POST",
        url: "/api/login/createOrLoginAsTest",
        body: { email, firstNames, lastNames, isEditor, isAuthor },
      });
    });
  },
);

Cypress.Commands.add(
  "createContent",
  ({
    name,
    doenetML,
    contentType = "singleDoc",
    classifications,
    categories,
    makePublic = false,
    publishInLibrary = false,
    parentId,
  }: {
    name: string;
    doenetML?: string;
    contentType?: ContentType;
    classifications?: {
      systemShortName: string;
      category: string;
      subCategory: string;
      code: string;
    }[];
    categories?: Record<string, boolean>;
    makePublic?: boolean;
    publishInLibrary?: boolean;
    parentId?: string;
  }) => {
    cy.request({
      method: "POST",
      url: "/api/updateContent/createContent",
      body: {
        contentType,
        parentId: parentId ?? null,
      },
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

      if (categories) {
        cy.request({
          method: "POST",
          url: "/api/updateContent/updateCategories",
          body: {
            contentId,
            categories,
          },
        });
      }

      if (makePublic || publishInLibrary) {
        cy.request({
          method: "POST",
          url: "/api/share/setContentIsPublic",
          body: {
            contentId,
            isPublic: true,
          },
        });
      }

      if (publishInLibrary) {
        cy.request({
          method: "POST",
          url: "/api/curate/suggestToBeCurated",
          body: {
            contentId: contentId,
          },
        }).then((resp) => {
          const contentIdInLibrary = resp.body.contentIdInLibrary;
          cy.request({
            method: "POST",
            url: "/api/curate/claimOwnershipOfReview",
            body: {
              contentId: contentIdInLibrary,
            },
          }).then(() => {
            cy.request({
              method: "POST",
              url: "/api/curate/publishActivityToLibrary",
              body: {
                contentId: contentIdInLibrary,
              },
            });
          });
        });
      }

      if (doenetML !== undefined) {
        cy.request({
          method: "POST",
          url: "/api/updateContent/saveDoenetML",
          body: {
            contentId,
            doenetML,
            numVariants: 1,
          },
        });
      }
      cy.request({
        method: "POST",
        url: "/api/updateContent/updateContentSettings",
        body: {
          contentId: contentId,
          name: name,
        },
      }).then(() => contentId);
    });
  },
);

Cypress.Commands.add("getUserInfo", () => {
  cy.request({
    method: "GET",
    url: "/api/user/getMyUserInfo",
  }).then((resp) => {
    const user = resp.body.user;
    return user;
  });
});
