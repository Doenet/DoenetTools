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
import { clear as idb_clear } from "idb-keyval";

Cypress.Commands.add(
  "createUserRole",
  ({ courseId, roleId, label = "no label" }) => {
    cy.task(
      "queryDb",
      `
  SELECT roleId
  FROM course_role 
  WHERE courseId="${courseId}"
  AND roleId="${roleId}"`,
    ).then((result) => {
      //Only insert if not a duplicate
      if (result.length == 0) {
        cy.log("here", result.length);
        cy.task(
          "queryDb",
          `
        INSERT INTO course_role 
        SET courseId="${courseId}", roleId="${roleId}", label="${label}"`,
        );
      }
    });
  },
);

Cypress.Commands.add("updateRolePerm", ({ roleId, permName, newValue }) => {
  cy.task(
    "queryDb",
    `
  UPDATE course_role 
  SET ${permName}="${newValue}"
  WHERE roleId="${roleId}"
  `,
  );
});

Cypress.Commands.add("setUserRole", ({ userId, courseId, roleId }) => {
  cy.task(
    "queryDb",
    `
  UPDATE course_user 
  SET roleId="${roleId}"
  WHERE userId="${userId}"
  AND courseId="${courseId}"
  `,
  );
});

Cypress.Commands.add("setUserUpload", ({ userId, newValue = "1" }) => {
  cy.task(
    "queryDb",
    `
  UPDATE user 
  SET canUpload="${newValue}"
  WHERE userId="${userId}"
  `,
  );
});

Cypress.Commands.add(
  "signin",
  ({ userId, firstName = "first", lastName = "last" }) => {
    cy.request(
      `/cyapi/cypressAutoSignin.php?userId=${userId}&firstName=${firstName}&lastName=${lastName}`,
    );
    // .then((resp)=>{
    //   cy.log("signin",resp.body)
    // })
  },
);

Cypress.Commands.add(
  "saveDoenetML",
  ({ doenetML, pageId, courseId, lastKnownCid }) => {
    cy.request("POST", "/api/saveDoenetML.php", {
      doenetML,
      pageId,
      courseId,
      lastKnownCid,
      backup: false,
    }).then((resp) => {
      cy.log("saveDoenetML", resp.body);
    });
  },
);

Cypress.Commands.add("clearEvents", ({ doenetId }) => {
  cy.request(`/cyapi/cypressClearEvents.php?doenetId=${doenetId}`);
  // .then((resp)=>{
  //   cy.log(resp.body)
  // })
});

Cypress.Commands.add("clearAllOfAUsersCoursesAndItems", ({ userId }) => {
  cy.request(`/cyapi/cypressAllOfAUsersCoursesAndItems.php?userId=${userId}`);
  // .then((resp)=>{
  //   cy.log(resp.body)
  // })
});

Cypress.Commands.add("clearAllOfAUsersActivities", ({ userId }) => {
  cy.request(`/cyapi/clearAllOfAUsersActivities.php?userId=${userId}`);
  // .then((resp)=>{
  //   cy.log(resp.body)
  // })
});

Cypress.Commands.add("clearCoursePeople", ({ courseId }) => {
  cy.request(`/cyapi/cypressClearCoursePeople.php?courseId=${courseId}`);
  // .then((resp)=>{
  //   cy.log(resp.body)
  // })
});

Cypress.Commands.add("createCourse", ({ userId, courseId, studentUserId, label }) => {
  cy.request("POST", `/cyapi/cypressCreateCourse.php`, {
    userId,
    courseId,
    studentUserId,
    label
  });
  // .then((resp)=>{
  //   cy.log(resp.body)
  // })
});

Cypress.Commands.add("deleteCourse", ({ label, courseId }) => {
  if (courseId) {
    cy.task(
      "queryDb",
      `
    UPDATE course 
    SET isDeleted = TRUE
    WHERE courseId="${courseId}"
    `,
    );
  } else if (label) {
    cy.task(
      "queryDb",
      `
    UPDATE course 
    SET isDeleted = TRUE
    WHERE label="${label}"
    `,
    );
  }


});

Cypress.Commands.add(
  "deletePortfolioActivity",
  ({ userId, label }) => {
    cy.task(
      "queryDb",
      `DELETE cc
      FROM course_content AS cc
      LEFT JOIN course AS c
      ON cc.courseId = c.courseId
      WHERE cc.label = '${label}'
      AND c.portfolioCourseForUserId = '${userId}'
      `,
    );
  });

Cypress.Commands.add(
  "createActivity",
  ({ courseId, doenetId, parentDoenetId, pageDoenetId, doenetML = "" }) => {
    cy.request("POST", `/cyapi/cypressCreateActivity.php`, {
      courseId,
      doenetId,
      parentDoenetId,
      pageDoenetId,
      doenetML,
    });
  },
);

Cypress.Commands.add(
  "updateActivitySettings",
  ({ courseId, doenetId, activitySettings }) => {
    cy.request("POST", `/cyapi/cypressUpdateActivitySettings.php`, {
      courseId,
      doenetId,
      activitySettings,
    });
    // .then((resp)=>{
    //   cy.log(resp.body)
    // })
  },
);

Cypress.Commands.add(
  "createMultipageActivity",
  ({
    courseId,
    doenetId,
    parentDoenetId,
    pageDoenetId1,
    pageDoenetId2,
    pageDoenetId3,
    pageDoenetId4,
    doenetML1,
    doenetML2,
    doenetML3,
    doenetML4,
    shuffleDoenetId,
    shufflePages,
  }) => {
    cy.log(
      courseId,
      doenetId,
      parentDoenetId,
      pageDoenetId1,
      pageDoenetId2,
      pageDoenetId3,
      pageDoenetId4,
    );
    cy.request("POST", `/cyapi/cypressCreateMultipageActivity.php`, {
      courseId,
      doenetId,
      parentDoenetId,
      pageDoenetId1,
      pageDoenetId2,
      pageDoenetId3,
      pageDoenetId4,
      doenetML1,
      doenetML2,
      doenetML3,
      doenetML4,
      shuffleDoenetId,
      shufflePages,
    });
    // .then((resp)=>{
    //   cy.log(resp.body)
    // })
  },
);

Cypress.Commands.add("clearIndexedDB", () => {
  return idb_clear();
});
