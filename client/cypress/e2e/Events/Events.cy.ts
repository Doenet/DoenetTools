// import {signIn} from '../DoenetSignin/DoenetSignin.cy';

import { cesc2 } from "../../../src/_utils/url";

describe("doenet events test", function () {
  const _userId = "cyuserId";
  const _studentUserId = "cyStudentUserId";
  // const userId = "devuserId";
  const _courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";
  const _blankCid =
    "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

  it.skip("make sure events are recorded in general", () => {
    const _doenetML = `
  <p>Enter values that sum to <m>3x</m>: 
  <answer>
  <mathinput /> <mathinput/>
  <award><when>$_mathinput1+$_mathinput2 = 3x</when></award>
  <award credit="0.5"><when>$_mathinput1+$_mathinput2 = 3</when></award>
  </answer></p>
  `;
    // cy.saveDoenetML({
    //   doenetML,
    //   pageId: pageDoenetId,
    //   courseId,
    //   lastKnownCid: blankCid,
    // });
    cy.visit(`/course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`);
    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.wait(1000);

    // cy.signin({ userId: studentUserId });

    cy.visit(`/course?tool=assignment&doenetId=${doenetId}`);
    //Interact with content
    cy.log("Enter a correct answer in");
    //TODO: clear out previous entry state
    cy.get(cesc2("#/_mathinput1") + " textarea")
      .type(`x+y`, { force: true })
      .blur();
    cy.get(cesc2("#/_mathinput2") + " textarea")
      .type(`2x-y`, { force: true })
      .blur();

    cy.log("Submit answer");
    cy.get(cesc2("#/_answer1_submit")).click();

    cy.wait(1000); //TODO: time travel instead of wait?
    //Test if interactions were recorded
    cy.request(`/api/getEventData.php?doenetId[]=${doenetId}`).then((resp) => {
      const events = resp.body.events;
      expect(events.length).gt(0);
    });
  });
});
