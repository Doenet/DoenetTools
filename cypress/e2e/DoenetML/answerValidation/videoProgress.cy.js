import { cesc } from "../../../../src/_utils/url";

describe("Video progress tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("Credit for watching video", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <video name="v" width="560 px" youtube="tJ4ypc5L6uU" />

    <p name="pDuration">Duration: $v.duration</p>
    <p>Time: <copy prop="time" target="v" assignNames="time" /></p>
    <p>State: <copy prop="state" target="v" assignNames="state" /></p>
    
    <p>Seconds watched: <number displayDecimals="0" ignoreDisplayDigits name="seconds">$v.secondsWatched</number></p>
    <p>Video progress: <number displayDecimals="1" ignoreDisplayDigits name="progress">$v.fractionWatched*100</number>%</p>

    <p>Credit achieved: <number displayDecimals="3" ignoreDisplayDigits name="credit">$_document1.creditAchieved</number></p>
    
    
    <answer hide>
      <award credit="$v.fractionWatched"><when>true</when></award>
    </answer>
    
    <callAction triggerWith="v" target="_answer1" actionName="submitAnswer" />

    <p>Control with actions:
      <callAction target="v" actionName="playVideo" name="play"><label>Play</label></callAction>
      <callAction target="v" actionName="pauseVideo" name="pause"><label>Pause</label></callAction>
    </p>
    <p>Skip to time 157: <updateValue target="v" prop="time" newValue="157" name="skip1"><label>Skip 1</label></updateValue></p>
    <p>Skip to time 57: <updateValue target="v" prop="time" newValue="57" name="skip2"><label>Skip 2</label></updateValue></p>
  
    `,
        },
        "*",
      );
    });

    let credit;

    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/pDuration")).should("have.text", "Duration: 300");
    cy.get(cesc("#\\/seconds")).should("have.text", "0");
    cy.get(cesc("#\\/progress")).should("have.text", "0");
    cy.get(cesc("#\\/credit")).should("have.text", "0");

    cy.get(cesc("#\\/play")).click();

    cy.get(cesc("#\\/time")).contains("5");
    cy.get(cesc("#\\/pause")).click();

    cy.get(cesc("#\\/seconds")).should("have.text", "5");
    cy.get(cesc("#\\/credit")).should("not.have.text", "0");

    cy.get(cesc("#\\/credit"))
      .invoke("text")
      .then((text) => {
        credit = Number(text);
        expect(credit).gte(0.016).lte(0.018);
      });

    cy.get(cesc("#\\/progress"))
      .invoke("text")
      .then((text) => {
        expect(Number(text)).eq(Math.round(credit * 1000) / 10);
      });

    cy.get(cesc("#\\/play")).click();

    cy.get(cesc("#\\/time")).contains("7");
    cy.get(cesc("#\\/pause")).click();

    cy.get(cesc("#\\/seconds"))
      .should("have.text", "7")
      .then(() => {
        // put inside then so that get updated value of local variable credit
        cy.get(cesc("#\\/credit")).should("not.have.text", `${credit}`);
      });

    cy.get(cesc("#\\/credit"))
      .invoke("text")
      .then((text) => {
        credit = Number(text);
        expect(credit).gte(0.023).lte(0.025);
      });

    cy.get(cesc("#\\/progress"))
      .invoke("text")
      .then((text) => {
        expect(Number(text)).eq(Math.round(credit * 1000) / 10);
      });

    cy.get(cesc("#\\/skip1")).click();
    cy.get(cesc("#\\/time")).contains("157");

    cy.get(cesc("#\\/seconds")).should("have.text", "7");

    cy.get(cesc("#\\/credit"))
      .invoke("text")
      .then((text) => {
        expect(Number(text)).eq(credit);
      });

    cy.get(cesc("#\\/progress"))
      .invoke("text")
      .then((text) => {
        expect(Number(text)).eq(Math.round(credit * 1000) / 10);
      });

    cy.get(cesc("#\\/play")).click();

    cy.get(cesc("#\\/time")).contains("160");
    cy.get(cesc("#\\/skip2")).click();

    cy.get(cesc("#\\/time")).contains("59");

    cy.get(cesc("#\\/pause")).click();

    cy.get(cesc("#\\/seconds"))
      .contains(/1(2|3)/)
      .then(() => {
        // put inside then so that get updated value of local variable credit
        cy.get(cesc("#\\/credit")).should("not.have.text", `${credit}`);
        cy.get(cesc("#\\/credit")).should("not.contain", `3`); // should contain a 3 after the intermediate skip
      });

    cy.get(cesc("#\\/credit"))
      .invoke("text")
      .then((text) => {
        credit = Number(text);
        expect(credit).gte(0.04).lte(0.045);
      });

    cy.get(cesc("#\\/progress"))
      .invoke("text")
      .then((text) => {
        expect(Number(text)).eq(Math.round(credit * 1000) / 10);
      });

    cy.get(cesc("#\\/skip1")).click();
    cy.get(cesc("#\\/time")).contains("157");

    cy.get(cesc("#\\/seconds")).contains(/1(2|3)/);

    cy.get(cesc("#\\/credit"))
      .invoke("text")
      .then((text) => {
        expect(Number(text)).eq(credit);
      });

    cy.get(cesc("#\\/progress"))
      .invoke("text")
      .then((text) => {
        expect(Number(text)).eq(Math.round(credit * 1000) / 10);
      });

    cy.get(cesc("#\\/play")).click();

    cy.get(cesc("#\\/time")).contains("159");
    cy.get(cesc("#\\/pause")).click();
    cy.get(cesc("#\\/state")).contains("stopped");

    cy.get(cesc("#\\/seconds")).contains(/1(2|3)/);
    cy.get(cesc("#\\/credit"))
      .invoke("text")
      .then((text) => {
        expect(Number(text)).eq(credit);
      });

    cy.get(cesc("#\\/progress"))
      .invoke("text")
      .then((text) => {
        expect(Number(text)).eq(Math.round(credit * 1000) / 10);
      });

    cy.wait(200); // for some reason seems to occasionally miss clicking play
    cy.get(cesc("#\\/play")).click();

    cy.get(cesc("#\\/time")).contains("162");
    cy.get(cesc("#\\/pause")).click();

    cy.get(cesc("#\\/seconds"))
      .contains(/1(4|5)/)
      .then(() => {
        // put inside then so that get updated value of local variable credit
        cy.get(cesc("#\\/credit")).should("not.have.text", `${credit}`);
      });

    cy.get(cesc("#\\/credit"))
      .invoke("text")
      .then((text) => {
        credit = Number(text);
        expect(credit).gte(0.046).lte(0.052);
      });

    cy.get(cesc("#\\/progress"))
      .invoke("text")
      .then((text) => {
        expect(Number(text)).eq(Math.round(credit * 1000) / 10);
      });
  });
});
