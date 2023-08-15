import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Feedback Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("feedback from answer value or credit", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer>x+y</answer></p>
  <section>
  <feedback condition="$(_answer1.creditAchieved) = 1">
  <p>You got full credit!</p></feedback>
  <feedback condition="$_answer1 = x+y">
  <p>You typed the right answer!</p></feedback>
  <feedback condition="$_answer1 = x" >
  <p>That's a bad answer.</p></feedback>
  </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Type correct answer in");
      cy.get(mathinputAnchor).type(`x+y`, { force: true });

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Blur");
      cy.get(mathinputAnchor).blur();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(cesc("#\\/_section1") + " p")
        .eq(0)
        .should("have.text", "You got full credit!");
      cy.get(cesc("#\\/_section1") + " p")
        .eq(1)
        .should("have.text", "You typed the right answer!");
      cy.get(cesc("#\\/_section1") + " p")
        .eq(2)
        .should("not.exist");

      cy.log("Type wrong answer");
      cy.get(mathinputAnchor)
        .type(`{end}{backspace}{backspace}`, { force: true })
        .blur();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(cesc("#\\/_section1") + " p")
        .eq(0)
        .should("have.text", "You got full credit!");
      cy.get(cesc("#\\/_section1") + " p")
        .eq(1)
        .should("have.text", "You typed the right answer!");
      cy.get(cesc("#\\/_section1") + " p")
        .eq(2)
        .should("not.exist");

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        "That's a bad answer.",
      );

      cy.log("Enter different wrong answer");
      cy.get(mathinputAnchor).type(`{end}{backspace}y`, { force: true }).blur();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        "That's a bad answer.",
      );

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");
    });
  });

  it("feedback from answer value or credit, set showFeedback=false", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_showFeedback").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer>x+y</answer></p>
  <section>
  <feedback condition="$(_answer1.creditAchieved) = 1">
  <p>You got full credit!</p></feedback>
  <feedback condition="$_answer1 = x+y">
  <p>You typed the right answer!</p></feedback>
  <feedback condition="$_answer1 = x" >
  <p>That's a bad answer.</p></feedback>
  </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Type correct answer in");
      cy.get(mathinputAnchor).type(`x+y`, { force: true });

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Blur");
      cy.get(mathinputAnchor).blur();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Type wrong answer");
      cy.get(mathinputAnchor)
        .type(`{end}{backspace}{backspace}`, { force: true })
        .blur();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Enter different wrong answer");
      cy.get(mathinputAnchor).type(`{end}{backspace}y`, { force: true }).blur();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");
    });
  });

  it("feedback from award", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer><award><math>x+y</math></award><award credit="0.5"><math>x</math></award></answer></p>
  <section>
  <feedback condition="$_award1">
  <p>You got award 1.</p>
  </feedback>
  <feedback condition="$_award2.awarded">
  <p>You got award 2.</p>
  </feedback>
  </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Type correct answer in");
      cy.get(mathinputAnchor).type(`x+y`, { force: true });

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Blur");
      cy.get(mathinputAnchor).blur();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x+y');
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        `You got award 1.`,
      );

      cy.log("Enter wrong answer");
      cy.get(mathinputAnchor)
        .type(`{end}{backspace}{backspace}`, { force: true })
        .blur();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        `You got award 1.`,
      );

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'x');
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        `You got award 2.`,
      );

      cy.log("Enter different wrong answer");
      cy.get(mathinputAnchor).type(`{end}{backspace}y`, { force: true }).blur();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        `You got award 2.`,
      );

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', 'y');
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");
    });
  });

  it("feedback from full awards", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer>
    <mathinput />
    <award credit="0.1"><when>$_mathinput1.immediateValue > 1</when></award>
    <award><when>$_mathinput1.immediateValue > 10</when></award>
    <award credit="0.2"><when>$_mathinput1.immediateValue > 2</when></award>
    <award credit="0.1"><when>$_mathinput1.immediateValue > 0.9</when></award>
    <award credit="0"><when>$_mathinput1.immediateValue < 0</when></award>
  </answer></p>
  <p>Credit achieved: $_answer1.creditAchieved{assignNames="ca"}</p>
  <section>
  <feedback condition="$_award1">
    <p>Larger than 1</p>
  </feedback>
  <feedback condition="$_award2.awarded" >
    <p>Larger than 10</p>
  </feedback>
  <feedback condition="$_award3">
    <p>Larger than 2</p>
  </feedback>
  <feedback condition="$_award4.awarded">
    <p>Larger than 0.9</p>
  </feedback>
  <feedback condition="$_award5">
    <p>A negative number?</p>
  </feedback>
  </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("Test value displayed in browser");
    // cy.get(cesc('#\\/_mathinput1_input')).should('have.value', '');
    cy.get(cesc("#\\/ca"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/_section1") + " p").should("not.exist");

    cy.log("Type 11");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(`11`, { force: true });

    cy.log("Test value displayed in browser");
    // cy.get(cesc('#\\/_mathinput1_input')).should('have.value', '11');
    cy.get(cesc("#\\/ca"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/_section1") + " p").should("not.exist");

    cy.log("Blur");
    cy.get(cesc("#\\/_mathinput1") + " textarea").blur();

    cy.log("Test value displayed in browser");
    // cy.get(cesc('#\\/_mathinput1_input')).should('have.value', '11');
    cy.get(cesc("#\\/ca"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/_section1") + " p").should("not.exist");

    cy.log("Submit answer");
    cy.get(cesc("#\\/_mathinput1_submit")).click();

    cy.log("Test value displayed in browser");
    // cy.get(cesc('#\\/_mathinput1_input')).should('have.value', '11');
    cy.get(cesc("#\\/_section1") + " p").should("have.text", `Larger than 10`);
    cy.get(cesc("#\\/ca"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.log("submit 10");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(`{end}{backspace}0`, {
      force: true,
    });
    cy.get(cesc("#\\/_mathinput1_submit")).should("be.visible");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(`{enter}`, {
      force: true,
    });

    cy.log("Test value displayed in browser");
    // cy.get(cesc('#\\/_mathinput1_input')).should('have.value', '10');
    cy.get(cesc("#\\/_section1") + " p").should("have.text", `Larger than 2`);
    cy.get(cesc("#\\/ca"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0.2");
      });

    cy.log("submit 2");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}{backspace}2`,
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput1_submit")).should("be.visible");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(`{enter}`, {
      force: true,
    });

    cy.log("Test value displayed in browser");
    // cy.get(cesc('#\\/_mathinput1_input')).should('have.value', '2');
    cy.get(cesc("#\\/_section1") + " p").should("have.text", `Larger than 1`);
    cy.get(cesc("#\\/ca"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0.1");
      });

    cy.log("submit 1");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(`{end}{backspace}1`, {
      force: true,
    });
    cy.get(cesc("#\\/_mathinput1_submit")).should("be.visible");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(`{enter}`, {
      force: true,
    });

    cy.log("Test value displayed in browser");
    // cy.get(cesc('#\\/_mathinput1_input')).should('have.value', '1');
    cy.get(cesc("#\\/_section1") + " p").should("have.text", `Larger than 0.9`);
    cy.get(cesc("#\\/ca"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0.1");
      });

    cy.log("submit 0");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(`{end}{backspace}0`, {
      force: true,
    });
    cy.get(cesc("#\\/_mathinput1_submit")).should("be.visible");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(`{enter}`, {
      force: true,
    });

    cy.log("Test value displayed in browser");
    // cy.get(cesc('#\\/_mathinput1_input')).should('have.value', '0');
    cy.get(cesc("#\\/_section1") + " p").should("not.exist");
    cy.get(cesc("#\\/ca"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });

    cy.log("submit -1");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(`{end}{backspace}-1`, {
      force: true,
    });
    cy.get(cesc("#\\/_mathinput1_submit")).should("be.visible");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(`{enter}`, {
      force: true,
    });

    cy.log("Test value displayed in browser");
    // cy.get(cesc('#\\/_mathinput1_input')).should('have.value', '-1');
    cy.get(cesc("#\\/_section1") + " p").should(
      "have.text",
      `A negative number?`,
    );
    cy.get(cesc("#\\/ca"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
  });

  it("feedback from copied awards", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer><award name="xy"><math>x+y</math></award><award name="x" credit="0.5"><math>x</math></award></answer></p>
  <section>
  <feedback condition="$xy">
  <p>You got award 1.</p>
  </feedback>
  <feedback condition="$x.awarded">
  <p>You got award 2.</p>
  </feedback>
  </section>
  <p><answer><award copySource="xy" name="xy2" credit="0.5" /><award copysource="x" name="x2" credit="1"/></answer></p>
  <section>
  <feedback condition="$xy2">
  <p>You got award 1.</p>
  </feedback>
  <feedback condition="$x2.awarded">
  <p>You got award 2.</p>
  </feedback>
  </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinput1Name =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinput1Anchor = cesc2("#" + mathinput1Name) + " textarea";
      let mathinput1SubmitAnchor = cesc2("#" + mathinput1Name + "_submit");
      let mathinput1CorrectAnchor = cesc2("#" + mathinput1Name + "_correct");
      let mathinput1IncorrectAnchor = cesc2(
        "#" + mathinput1Name + "_incorrect",
      );
      let mathinput1PartialAnchor = cesc2("#" + mathinput1Name + "_partial");

      let mathinput2Name =
        stateVariables["/_answer2"].stateValues.inputChildren[0].componentName;
      let mathinput2Anchor = cesc2("#" + mathinput2Name) + " textarea";
      let mathinput2SubmitAnchor = cesc2("#" + mathinput2Name + "_submit");
      let mathinput2CorrectAnchor = cesc2("#" + mathinput2Name + "_correct");
      let mathinput2IncorrectAnchor = cesc2(
        "#" + mathinput2Name + "_incorrect",
      );
      let mathinput2PartialAnchor = cesc2("#" + mathinput2Name + "_partial");

      cy.get(cesc("#\\/_section1") + " p").should("not.exist");
      cy.get(cesc("#\\/_section2") + " p").should("not.exist");
      cy.get(mathinput1SubmitAnchor).should("be.visible");
      cy.get(mathinput2SubmitAnchor).should("be.visible");

      cy.log("Submit correct answer 1");
      cy.get(mathinput1Anchor).type(`x+y{enter}`, { force: true });
      cy.get(mathinput1CorrectAnchor).should("be.visible");
      cy.get(mathinput2SubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        `You got award 1.`,
      );
      cy.get(cesc("#\\/_section2") + " p").should("not.exist");

      cy.log("Submit wrong answer 1");
      cy.get(mathinput1Anchor).type(`{end}{backspace}{backspace}{enter}`, {
        force: true,
      });
      cy.get(mathinput1PartialAnchor).should("be.visible");
      cy.get(mathinput2SubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        `You got award 2.`,
      );
      cy.get(cesc("#\\/_section2") + " p").should("not.exist");

      cy.log("Submit wrong answer 2");
      cy.get(mathinput2Anchor).type(`x+y{enter}`, { force: true });
      cy.get(mathinput2PartialAnchor).should("be.visible");
      cy.get(mathinput1PartialAnchor).should("be.visible");
      cy.get(cesc("#\\/_section2") + " p").should(
        "have.text",
        `You got award 1.`,
      );
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        `You got award 2.`,
      );

      cy.log("Submit correct answer 2");
      cy.get(mathinput2Anchor).type(`{end}{backspace}{backspace}{enter}`, {
        force: true,
      });
      cy.get(mathinput2CorrectAnchor).should("be.visible");
      cy.get(mathinput1PartialAnchor).should("be.visible");
      cy.get(cesc("#\\/_section2") + " p").should(
        "have.text",
        `You got award 2.`,
      );
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        `You got award 2.`,
      );

      cy.log("Enter different wrong answer 1");
      cy.get(mathinput1Anchor).type(`{end}{backspace}y{enter}`, {
        force: true,
      });
      cy.get(mathinput1IncorrectAnchor).should("be.visible");
      cy.get(mathinput2CorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");
      cy.get(cesc("#\\/_section2") + " p").should(
        "have.text",
        `You got award 2.`,
      );

      cy.log("Enter different wrong answer 2");
      cy.get(mathinput2Anchor).type(`{end}{backspace}y{enter}`, {
        force: true,
      });
      cy.get(mathinput2IncorrectAnchor).should("be.visible");
      cy.get(mathinput1IncorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/_section2") + " p").should("not.exist");
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");
    });
  });

  it("feedback from multiple choice", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer>
    <choiceinput shuffleOrder>
    <choice credit="0.1">cat</choice>
    <choice credit="1">dog</choice>
    <choice credit="0.2">cow</choice>
    <choice credit="0.1">mouse</choice>
    <choice>banana</choice>
    </choiceinput>
  </answer></p>
  <p>Credit achieved: $_answer1.creditAchieved{assignNames="ca"}</p>
  <section>
  <feedback condition="$_choice1">
    <p>Meow</p>
  </feedback>
  <feedback condition="$_choice2.submitted">
    <p>Ruff</p>
  </feedback>
  <feedback condition="$_choice3">
    <p>Moo</p>
  </feedback>
  <feedback condition="$_choice4.submitted">
    <p>Squeak</p>
  </feedback>
  <feedback condition="$_choice5">
    <p>Huh?</p>
  </feedback>
  </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let choiceinputAnchor = cesc2("#" + choiceinputName);
      let choiceinputSubmitAnchor = cesc2("#" + choiceinputName + "_submit");

      cy.log("Test value displayed in browser");
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0");
        });
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Select dog");
      cy.get(choiceinputAnchor).contains(`dog`).click({ force: true });
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0");
        });

      cy.log("Submit answer");
      cy.get(choiceinputSubmitAnchor).click();

      cy.log("Test value displayed in browser");
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Ruff`);
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });

      cy.log("submit cow");
      cy.get(choiceinputAnchor).contains(`cow`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Moo`);
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.2");
        });

      cy.log("submit cat");
      cy.get(choiceinputAnchor).contains(`cat`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Meow`);
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.1");
        });

      cy.log("submit mouse");
      cy.get(choiceinputAnchor).contains(`mouse`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Squeak`);
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.1");
        });

      cy.log("submit banana");
      cy.get(choiceinputAnchor).contains(`banana`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Huh?`);
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0");
        });
    });
  });

  it("feedback from multiple choice, some choices inside shuffle", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer>
    <choiceinput>
    <choice credit="0.1">cat</choice>
    <shuffle>
      <choice credit="1">dog</choice>
      <choice credit="0.2">cow</choice>
    </shuffle>
    <choice credit="0.1">mouse</choice>
    <choice>banana</choice>
    </choiceinput>
  </answer></p>
  <p>Credit achieved: $_answer1.creditAchieved{assignNames="ca"}</p>
  <section>
  <feedback condition="$_choice1">
    <p>Meow</p>
  </feedback>
  <feedback condition="$_choice2.submitted">
    <p>Ruff</p>
  </feedback>
  <feedback condition="$_choice3">
    <p>Moo</p>
  </feedback>
  <feedback condition="$_choice4.submitted">
    <p>Squeak</p>
  </feedback>
  <feedback condition="$_choice5">
    <p>Huh?</p>
  </feedback>
  </section>
  `,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let choiceinputAnchor = cesc2("#" + choiceinputName);
      let choiceinputSubmitAnchor = cesc2("#" + choiceinputName + "_submit");

      cy.log("Test value displayed in browser");
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0");
        });
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Select dog");
      cy.get(choiceinputAnchor).contains(`dog`).click({ force: true });
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0");
        });

      cy.log("Submit answer");
      cy.get(choiceinputSubmitAnchor).click();

      cy.log("Test value displayed in browser");
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Ruff`);
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });

      cy.log("submit cow");
      cy.get(choiceinputAnchor).contains(`cow`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Moo`);
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.2");
        });

      cy.log("submit cat");
      cy.get(choiceinputAnchor).contains(`cat`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Meow`);
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.1");
        });

      cy.log("submit mouse");
      cy.get(choiceinputAnchor).contains(`mouse`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Squeak`);
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0.1");
        });

      cy.log("submit banana");
      cy.get(choiceinputAnchor).contains(`banana`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).click();
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Huh?`);
      cy.get(cesc("#\\/ca"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("0");
        });
    });
  });

  it("feedback from multiple choice, copied choices, some choices inside shuffle", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer>
    <choiceinput>
      <choice name="cat1" credit="0.1">cat</choice>
      <shuffle>
        <choice credit="1" name="dog1">dog</choice>
        <choice name="cow1">cow</choice>
      </shuffle>
    </choiceinput>
  </answer></p>
  <p>Credit achieved 1: $_answer1.creditAchieved{assignNames="ca1"}</p>
  <section>
  <feedback condition="$cat1">
    <p>Meow</p>
  </feedback>
  <feedback condition="$dog1.submitted">
    <p>Ruff</p>
  </feedback>
  <feedback condition="$cow1">
    <p>Moo</p>
  </feedback>
  </section>

  <p><answer>
    <choiceinput>
      <choice copySource="dog1" name="dog2" credit="0.1"/>
      <shuffle>
        <choice copySource="cow1" name="cow2" />
        <choice copySource="cat1" name="cat2" credit="1" />
      </shuffle>
    </choiceinput>
  </answer></p>
  <p>Credit achieved 2: $_answer2.creditAchieved{assignNames="ca2"}</p>
  <section>
  <feedback condition="$dog2">
    <p>Ruff</p>
  </feedback>
  <feedback condition="$cat2.submitted">
    <p>Meow</p>
  </feedback>
  <feedback condition="$cow2">
    <p>Moo</p>
  </feedback>
  </section>
  `,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceinput1Name =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let choiceinput1Anchor = cesc2("#" + choiceinput1Name);
      let choiceinput1SubmitAnchor = cesc2("#" + choiceinput1Name + "_submit");
      let choiceinput2Name =
        stateVariables["/_answer2"].stateValues.inputChildren[0].componentName;
      let choiceinput2Anchor = cesc2("#" + choiceinput2Name);
      let choiceinput2SubmitAnchor = cesc2("#" + choiceinput2Name + "_submit");

      cy.log("Test value displayed in browser");
      cy.get(cesc("#\\/ca1")).should("have.text", "0");
      cy.get(cesc("#\\/ca2")).should("have.text", "0");
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");
      cy.get(cesc("#\\/_section2") + " p").should("not.exist");

      cy.log("Submit dog1");
      cy.get(choiceinput1Anchor).contains(`dog`).click({ force: true });
      cy.get(choiceinput1SubmitAnchor).click();
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Ruff`);
      cy.get(cesc("#\\/_section2") + " p").should("not.exist");
      cy.get(cesc("#\\/ca1")).should("have.text", "1");
      cy.get(cesc("#\\/ca2")).should("have.text", "0");

      cy.log("submit cow1");
      cy.get(choiceinput1Anchor).contains(`cow`).click({ force: true });
      cy.get(choiceinput1SubmitAnchor).click();
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Moo`);
      cy.get(cesc("#\\/_section2") + " p").should("not.exist");

      cy.get(cesc("#\\/ca1")).should("have.text", "0");
      cy.get(cesc("#\\/ca2")).should("have.text", "0");

      cy.log("Submit dog2");
      cy.get(choiceinput2Anchor).contains(`dog`).click({ force: true });
      cy.get(choiceinput2SubmitAnchor).click();
      cy.get(cesc("#\\/_section2") + " p").should("have.text", `Ruff`);
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Moo`);
      cy.get(cesc("#\\/ca2")).should("have.text", "0.1");
      cy.get(cesc("#\\/ca1")).should("have.text", "0");

      cy.log("Submit cat2");
      cy.get(choiceinput2Anchor).contains(`cat`).click({ force: true });
      cy.get(choiceinput2SubmitAnchor).click();
      cy.get(cesc("#\\/_section2") + " p").should("have.text", `Meow`);
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Moo`);
      cy.get(cesc("#\\/ca2")).should("have.text", "1");
      cy.get(cesc("#\\/ca1")).should("have.text", "0");

      cy.log("Submit cat1");
      cy.get(choiceinput1Anchor).contains(`cat`).click({ force: true });
      cy.get(choiceinput1SubmitAnchor).click();
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Meow`);
      cy.get(cesc("#\\/_section2") + " p").should("have.text", `Meow`);
      cy.get(cesc("#\\/ca1")).should("have.text", "0.1");
      cy.get(cesc("#\\/ca2")).should("have.text", "1");

      cy.log("Submit cow2");
      cy.get(choiceinput2Anchor).contains(`cow`).click({ force: true });
      cy.get(choiceinput2SubmitAnchor).click();
      cy.get(cesc("#\\/_section2") + " p").should("have.text", `Moo`);
      cy.get(cesc("#\\/_section1") + " p").should("have.text", `Meow`);
      cy.get(cesc("#\\/ca2")).should("have.text", "0");
      cy.get(cesc("#\\/ca1")).should("have.text", "0.1");
    });
  });

  it("feedback for any incorrect response", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer type="text">hello there</answer></p>
  <section>
  <feedback condition="$(_answer1.creditAchieved) != 1 and $(_answer1.responseHasBeenSubmitted) ">
    <p>Your response <em>$_answer1.submittedresponse</em> is incorrect.</p>
  </feedback>
  </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let textinputAnchor = cesc2("#" + textinputName + "_input");
      let textinputSubmitAnchor = cesc2("#" + textinputName + "_submit");

      cy.log("Test value displayed in browser");
      cy.get(textinputAnchor).should("have.value", "");
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Enter incorrect answer in");
      cy.get(textinputAnchor).clear().type(`wrong{enter}`);
      cy.get(textinputAnchor).should("have.value", "wrong");
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        `Your response wrong is incorrect.`,
      );

      cy.log("Enter correct answer");
      cy.get(textinputAnchor).clear().type(`hello there`);
      cy.get(textinputSubmitAnchor).should("be.visible");
      cy.get(textinputAnchor).type(`{enter}`);
      cy.get(textinputAnchor).should("have.value", "hello there");
      cy.get(cesc("#\\/_section1") + " p").should("not.exist");

      cy.log("Enter blank answer");
      cy.get(textinputAnchor).clear();
      cy.get(textinputSubmitAnchor).should("be.visible");
      cy.get(textinputAnchor).type(`{enter}`);
      cy.get(textinputAnchor).should("have.value", "");
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        `Your response  is incorrect.`,
      );

      cy.log("Enter another incorrect answer in");
      cy.get(textinputAnchor).clear().type(`bye`);
      cy.get(textinputSubmitAnchor).should("be.visible");
      cy.get(textinputAnchor).type(`{enter}`);
      cy.get(textinputAnchor).should("have.value", "bye");
      cy.get(cesc("#\\/_section1") + " p").should(
        "have.text",
        `Your response bye is incorrect.`,
      );
    });
  });

  it("feedback defined in awards", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer>
    <award feedbackcodes="goodjob"><math>sin(pi x)</math></award>
    <award credit="0.7" feedbacktext="Close, but wrong trignometric function"><math>cos(pi x)</math></award>
    <award credit="0.3" feedbacktext="You lost pi"><math>sin(x)</math></award>
  </answer></p>

  <p>Award 1 feedback:</p>
  <subsection name="feedback1"><title/>$_award1.feedback</subsection>
  
  <p>Award 2 feedback:</p>
  <subsection name="feedback2"><title/>$_award2.feedback</subsection>

  <p>Award 3 feedback:</p>
  <subsection name="feedback3"><title/>$_award3.feedback</subsection>

  <p>Answer feedbacks:</p>
  <subsection name="feedback4"><title/>$_answer1.feedbacks</subsection>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
      let mathinputCorrectAnchor = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrectAnchor = cesc2("#" + mathinputName + "_incorrect");
      let mathinputPartialAnchor = cesc2("#" + mathinputName + "_partial");

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("submit blank answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Type sin(pi x)");
      cy.get(mathinputAnchor).type(`sin(pi x)`, { force: true });

      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Blur");
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Type cos(pi x)");
      cy.get(mathinputAnchor).type(
        `{ctrl+home}{shift+end}{backspace}cos(pi x)`,
        { force: true },
      );
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Blur");
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "70 %");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2")).should(
        "contain.text",
        "FeedbackClose, but wrong trignometric function",
      );
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should(
        "contain.text",
        "FeedbackClose, but wrong trignometric function",
      );

      cy.log("Enter x");
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, {
        force: true,
      });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Enter sin(x)");
      cy.get(mathinputAnchor).type(`{end}{backspace}sin(x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputPartialAnchor).should("have.text", "30 %");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3")).should(
        "contain.text",
        "FeedbackYou lost pi",
      );
      cy.get(cesc("#\\/feedback4")).should(
        "contain.text",
        "FeedbackYou lost pi",
      );
    });
  });

  it("feedback defined in awards, new feedback definitions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="wrongTrig" text="Close, but wrong trignometric function" />
      <feedbackDefinition code="lostPI" text="You lost pi" />
    </feedbackDefinitions>
  </setup>

  <p><answer>
    <award feedbackcodes="goodJob"><math>sin(pi x)</math></award>
    <award credit="0.7" feedbackcodes="wrongTRIG"><math>cos(pi x)</math></award>
    <award credit="0.3" feedbackcodes="lostpi"><math>sin(x)</math></award>
  </answer></p>

  <p>Award 1 feedback:</p>
  <subsection name="feedback1"><title/>$_award1.feedback</subsection>
  
  <p>Award 2 feedback:</p>
  <subsection name="feedback2"><title/>$_award2.feedback</subsection>

  <p>Award 3 feedback:</p>
  <subsection name="feedback3"><title/>$_award3.feedback</subsection>

  <p>Answer feedbacks:</p>
  <subsection name="feedback4"><title/>$_answer1.feedbacks</subsection>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
      let mathinputCorrectAnchor = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrectAnchor = cesc2("#" + mathinputName + "_incorrect");
      let mathinputPartialAnchor = cesc2("#" + mathinputName + "_partial");

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("submit blank answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Type sin(pi x)");
      cy.get(mathinputAnchor).type(`sin(pi x)`, { force: true });

      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Blur");
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Type cos(pi x)");
      cy.get(mathinputAnchor).type(
        `{ctrl+home}{shift+end}{backspace}cos(pi x)`,
        { force: true },
      );
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Blur");
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "70 %");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2")).should(
        "contain.text",
        "FeedbackClose, but wrong trignometric function",
      );
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should(
        "contain.text",
        "FeedbackClose, but wrong trignometric function",
      );

      cy.log("Enter x");
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, {
        force: true,
      });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Enter sin(x)");
      cy.get(mathinputAnchor).type(`{end}{backspace}sin(x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputPartialAnchor).should("have.text", "30 %");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3")).should(
        "contain.text",
        "FeedbackYou lost pi",
      );
      cy.get(cesc("#\\/feedback4")).should(
        "contain.text",
        "FeedbackYou lost pi",
      );
    });
  });

  it("feedback defined in awards, new feedback definitions in document and section", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="wrongTrig" text="typo here" />
      <feedbackDefinition code="lostPI" text="You lost pi" />
    </feedbackDefinitions>
  </setup>

  <section>
    <setup>
      <feedbackDefinitions>
        <feedbackDefinition code="wrongTrig" text="Close, but wrong trignometric function" />
      </feedbackDefinitions>
    </setup>

    <p><answer>
      <award feedbackcodes="goodJob"><math>sin(pi x)</math></award>
      <award credit="0.7" feedbackcodes="wrongTRIG"><math>cos(pi x)</math></award>
      <award credit="0.3" feedbackcodes="lostpi"><math>sin(x)</math></award>
    </answer></p>

    <p>Award 1 feedback:</p>
    <subsection name="feedback1"><title/>$_award1.feedback</subsection>
    
    <p>Award 2 feedback:</p>
    <subsection name="feedback2"><title/>$_award2.feedback</subsection>

    <p>Award 3 feedback:</p>
    <subsection name="feedback3"><title/>$_award3.feedback</subsection>

    <p>Answer feedbacks:</p>
    <subsection name="feedback4"><title/>$_answer1.feedbacks</subsection>
  </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
      let mathinputCorrectAnchor = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrectAnchor = cesc2("#" + mathinputName + "_incorrect");
      let mathinputPartialAnchor = cesc2("#" + mathinputName + "_partial");

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("submit blank answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Type sin(pi x)");
      cy.get(mathinputAnchor).type(`sin(pi x)`, { force: true });

      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Blur");
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Type cos(pi x)");
      cy.get(mathinputAnchor).type(
        `{ctrl+home}{shift+end}{backspace}cos(pi x)`,
        { force: true },
      );
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Blur");
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "70 %");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2")).should(
        "contain.text",
        "FeedbackClose, but wrong trignometric function",
      );
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should(
        "contain.text",
        "FeedbackClose, but wrong trignometric function",
      );

      cy.log("Enter x");
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, {
        force: true,
      });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Enter sin(x)");
      cy.get(mathinputAnchor).type(`{end}{backspace}sin(x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputPartialAnchor).should("have.text", "30 %");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3")).should(
        "contain.text",
        "FeedbackYou lost pi",
      );
      cy.get(cesc("#\\/feedback4")).should(
        "contain.text",
        "FeedbackYou lost pi",
      );
    });
  });

  it("feedback defined in awards, new feedback definitions in document, incorrect codes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="wrongTrig" text="Close, but wrong trignometric function" />
      <feedbackDefinition code="lostPI" text="You lost pi" />
    </feedbackDefinitions>
  </setup>


  <p><answer>
    <award feedbackcodes="goodJob"><math>sin(pi x)</math></award>
    <award credit="0.7" feedbackcodes="wrongTRIGbad"><math>cos(pi x)</math></award>
    <award credit="0.3" feedbackcodes="lostpi anotherCode"><math>sin(x)</math></award>
  </answer></p>

  <p>Award 1 feedback:</p>
  <subsection name="feedback1"><title/>$_award1.feedback</subsection>
  
  <p>Award 2 feedback:</p>
  <subsection name="feedback2"><title/>$_award2.feedback</subsection>

  <p>Award 3 feedback:</p>
  <subsection name="feedback3"><title/>$_award3.feedback</subsection>

  <p>Answer feedbacks:</p>
  <subsection name="feedback4"><title/>$_answer1.feedbacks</subsection>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
      let mathinputCorrectAnchor = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrectAnchor = cesc2("#" + mathinputName + "_incorrect");
      let mathinputPartialAnchor = cesc2("#" + mathinputName + "_partial");

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("submit blank answer");
      cy.get(mathinputSubmitAnchor).click();

      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Type sin(pi x)");
      cy.get(mathinputAnchor).type(`sin(pi x)`, { force: true });

      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Blur");
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Type cos(pi x)");
      cy.get(mathinputAnchor).type(
        `{ctrl+home}{shift+end}{backspace}cos(pi x)`,
        { force: true },
      );
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Blur");
      cy.get(mathinputAnchor).blur();
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1")).should("contain.text", "FeedbackGood job!");
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4")).should("contain.text", "FeedbackGood job!");

      cy.log("Submit answer");
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "70 %");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Enter x");
      cy.get(mathinputAnchor).type(`{ctrl+home}{shift+end}{backspace}x`, {
        force: true,
      });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback4"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Enter sin(x)");
      cy.get(mathinputAnchor).type(`{end}{backspace}sin(x)`, { force: true });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type(`{enter}`, { force: true });
      cy.get(mathinputPartialAnchor).should("have.text", "30 %");
      cy.get(cesc("#\\/feedback1"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback2"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
      cy.get(cesc("#\\/feedback3")).should(
        "contain.text",
        "FeedbackYou lost pi",
      );
      cy.get(cesc("#\\/feedback4")).should(
        "contain.text",
        "FeedbackYou lost pi",
      );
    });
  });

  it("feedback defined in choices", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>
    <answer>
      <choiceinput shuffleOrder>
      <choice feedbacktext="meow" credit="0.5">cat</choice>
      <choice feedbackcodes="goodjob" credit="1">dog</choice>
      <choice>monkey</choice>
      </choiceinput>
    </answer>
  </p>

  <p>Answer feedbacks:</p>
  <subsection name="feedbacks"><title/>$_answer1.feedbacks</subsection>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let choiceinputAnchor = "#" + choiceinputName;
      let choiceinputSubmitAnchor = "#" + choiceinputName + "_submit";
      let choiceinputCorrectAnchor = "#" + choiceinputName + "_correct";
      let choiceinputIncorrectAnchor = "#" + choiceinputName + "_incorrect";
      let choiceinputPartialAnchor = "#" + choiceinputName + "_partial";

      cy.log("Test value displayed in browser");
      cy.get(choiceinputAnchor).should("have.value", "");
      cy.get(choiceinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Select correct answer");
      cy.get(choiceinputAnchor).contains(`dog`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Click submit button");
      cy.get(choiceinputSubmitAnchor).click({ force: true });
      cy.get(choiceinputCorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks")).should("contain.text", "FeedbackGood job!");

      cy.log("Select half correct answer");
      cy.get(choiceinputAnchor).contains(`cat`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks")).should("contain.text", "FeedbackGood job!");

      cy.log("Click submit button");
      cy.get(choiceinputSubmitAnchor).click({ force: true });
      cy.get(choiceinputPartialAnchor)
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("50% correct");
        });
      cy.get(cesc("#\\/feedbacks")).should("contain.text", "Feedbackmeow");

      cy.log("Select incorrect answer");
      cy.get(choiceinputAnchor).contains(`monkey`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks")).should("contain.text", "Feedbackmeow");

      cy.log("Click submit button");
      cy.get(choiceinputSubmitAnchor).click({ force: true });
      cy.get(choiceinputIncorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
    });
  });

  it("feedback defined in choices, new feedback definitions in document and section", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <setup>
    <feedbackDefinitions>
      <feedbackDefinition code="catSays" text="Meow" />
      <feedbackDefinition code="dogSays" text="Woof" />
    </feedbackDefinitions>
  </setup>

  <section>
    <setup>
      <feedbackDefinitions>
        <feedbackDefinition code="dogAlsoSays" text="Grrr" />
      </feedbackDefinitions>
    </setup>

    <p>
      <answer>
        <choiceinput shuffleOrder>
        <choice feedbackcodes="catsays" credit="0.5">cat</choice>
        <choice feedbackcodes="DogSays dogalsosays" credit="1">dog</choice>
        <choice>monkey</choice>
        </choiceinput>
      </answer>
    </p>

    <p>Answer feedbacks:</p>
    <subsection name="feedbacks"><title/>$_answer1.feedbacks</subsection>
  </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let choiceinputAnchor = "#" + choiceinputName;
      let choiceinputSubmitAnchor = "#" + choiceinputName + "_submit";
      let choiceinputCorrectAnchor = "#" + choiceinputName + "_correct";
      let choiceinputIncorrectAnchor = "#" + choiceinputName + "_incorrect";
      let choiceinputPartialAnchor = "#" + choiceinputName + "_partial";

      cy.log("Test value displayed in browser");
      cy.get(choiceinputAnchor).should("have.value", "");
      cy.get(choiceinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Select correct answer");
      cy.get(choiceinputAnchor).contains(`dog`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });

      cy.log("Click submit button");
      cy.get(choiceinputSubmitAnchor).click({ force: true });
      cy.get(choiceinputCorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks")).should(
        "contain.text",
        "FeedbackWoof FeedbackGrrr",
      );

      cy.log("Select half correct answer");
      cy.get(choiceinputAnchor).contains(`cat`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks")).should(
        "contain.text",
        "FeedbackWoof FeedbackGrrr",
      );

      cy.log("Click submit button");
      cy.get(choiceinputSubmitAnchor).click({ force: true });
      cy.get(choiceinputPartialAnchor)
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("50% correct");
        });
      cy.get(cesc("#\\/feedbacks")).should("contain.text", "FeedbackMeow");

      cy.log("Select incorrect answer");
      cy.get(choiceinputAnchor).contains(`monkey`).click({ force: true });
      cy.get(choiceinputSubmitAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks")).should("contain.text", "FeedbackMeow");

      cy.log("Click submit button");
      cy.get(choiceinputSubmitAnchor).click({ force: true });
      cy.get(choiceinputIncorrectAnchor).should("be.visible");
      cy.get(cesc("#\\/feedbacks"))
        .invoke("text")
        .then((text) => {
          expect(text.match(/^\s*$/)).not.be.null;
        });
    });
  });

  it("feedback updated with target", () => {
    let doenetML = `
    <text>a</text>
    <mathinput name="mi" />
    <answer name="ans">
      <award>
        <when>$mi = x</when>
      </award>
    </answer>
    
    <feedback condition="$mi=y" updateWith="ans" name="fback"><p>You typed y!</p></feedback>
    `;
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/fback")).should("not.exist");

    cy.get(cesc("#\\/mi") + " textarea").type("y{enter}", { force: true });
    cy.get(cesc("#\\/fback")).should("not.exist");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_incorrect")).should("be.visible");
    cy.get(cesc("#\\/fback")).should("have.text", "You typed y!");

    cy.get(cesc("#\\/mi") + " textarea").type("{end}{backspace}x{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/fback")).should("have.text", "You typed y!");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_correct")).should("be.visible");
    cy.get(cesc("#\\/fback")).should("not.exist");

    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_showFeedback").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/fback")).should("not.exist");

    cy.get(cesc("#\\/mi") + " textarea").type("y{enter}", { force: true });
    cy.get(cesc("#\\/fback")).should("not.exist");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_incorrect")).should("be.visible");
    cy.get(cesc("#\\/fback")).should("not.exist");

    cy.get(cesc("#\\/mi") + " textarea").type("{end}{backspace}x{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/fback")).should("not.exist");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_correct")).should("be.visible");
    cy.get(cesc("#\\/fback")).should("not.exist");
  });

  it("feedback based on booleans, updated with target", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="m1" />
  <mathinput name="m2" />
  <boolean name="got1">$m1 = x</boolean>
  <boolean name="got2">$m2 = y</boolean>
  <answer name="ans">
    <award>
      <when>$got1 and $got2</when>
    </award>
    <considerAsResponses>$m1 $m2</considerAsResponses>
  </answer>

  <p>Submitted responses: $ans.submittedResponses{assignNames="r1 r2"}</p>
  
  <subsection>
    <title>Desired feedback behavior</title>
    <feedback condition="$got1 and not $got2" updateWith="ans" name="fback1"><p>You got the first; what about the second?</p></feedback>
    <feedback condition="$got2 and not $got1" updateWith="ans" name="fback2"><p>You got the second; what about the first?</p></feedback>
  </subsection>
  <subsection>
    <title>Default feedback behavior</title>
    <feedback condition="$got1 and not $got2" name="fback1b"><p>You got the first; what about the second?</p></feedback>
    <feedback condition="$got2 and not $got1" name="fback2b"><p>You got the second; what about the first?</p></feedback>
  </subsection>


  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/fback1")).should("not.exist");
    cy.get(cesc("#\\/fback2")).should("not.exist");
    cy.get(cesc("#\\/fback1b")).should("not.exist");
    cy.get(cesc("#\\/fback2b")).should("not.exist");
    cy.get(cesc("#\\/r1")).should("not.exist");
    cy.get(cesc("#\\/r2")).should("not.exist");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_incorrect")).should("be.visible");
    cy.get(cesc("#\\/fback1")).should("not.exist");
    cy.get(cesc("#\\/fback2")).should("not.exist");
    cy.get(cesc("#\\/fback1b")).should("not.exist");
    cy.get(cesc("#\\/fback2b")).should("not.exist");
    cy.get(cesc("#\\/r1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc("#\\/r2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.get(cesc("#\\/m2") + " textarea").type("y{enter}", { force: true });
    cy.get(cesc("#\\/fback1")).should("not.exist");
    cy.get(cesc("#\\/fback2")).should("not.exist");
    cy.get(cesc("#\\/fback1b")).should("not.exist");
    cy.get(cesc("#\\/fback2b")).should(
      "have.text",
      "You got the second; what about the first?",
    );
    cy.get(cesc("#\\/r1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc("#\\/r2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_incorrect")).should("be.visible");
    cy.get(cesc("#\\/fback1")).should("not.exist");
    cy.get(cesc("#\\/fback2")).should(
      "have.text",
      "You got the second; what about the first?",
    );
    cy.get(cesc("#\\/fback1b")).should("not.exist");
    cy.get(cesc("#\\/fback2b")).should(
      "have.text",
      "You got the second; what about the first?",
    );
    cy.get(cesc("#\\/r1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc("#\\/r2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");

    cy.get(cesc("#\\/m1") + " textarea").type("x{enter}", { force: true });
    cy.get(cesc("#\\/fback1")).should("not.exist");
    cy.get(cesc("#\\/fback2")).should(
      "have.text",
      "You got the second; what about the first?",
    );
    cy.get(cesc("#\\/fback1b")).should("not.exist");
    cy.get(cesc("#\\/fback2b")).should("not.exist");
    cy.get(cesc("#\\/r1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc("#\\/r2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_correct")).should("be.visible");
    cy.get(cesc("#\\/fback1")).should("not.exist");
    cy.get(cesc("#\\/fback2")).should("not.exist");
    cy.get(cesc("#\\/fback1b")).should("not.exist");
    cy.get(cesc("#\\/fback2b")).should("not.exist");
    cy.get(cesc("#\\/r1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc("#\\/r2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");

    cy.get(cesc("#\\/m2") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/fback1")).should("not.exist");
    cy.get(cesc("#\\/fback2")).should("not.exist");
    cy.get(cesc("#\\/fback1b")).should(
      "have.text",
      "You got the first; what about the second?",
    );
    cy.get(cesc("#\\/fback2b")).should("not.exist");
    cy.get(cesc("#\\/r1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc("#\\/r2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_incorrect")).should("be.visible");
    cy.get(cesc("#\\/fback1")).should(
      "have.text",
      "You got the first; what about the second?",
    );
    cy.get(cesc("#\\/fback2")).should("not.exist");
    cy.get(cesc("#\\/fback1b")).should(
      "have.text",
      "You got the first; what about the second?",
    );
    cy.get(cesc("#\\/fback2b")).should("not.exist");
    cy.get(cesc("#\\/r1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc("#\\/r2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
  });

  it("feedback based on fractionSatisfied/creditAchieved of award", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer matchPartial name="ans">
    <mathinput name="mi1" /> <mathinput name="mi2" />
    <award name="small"><when>$mi1 < 1 and $mi2 < 1</when></award>
    <award name="medium" credit="0.5"><when>$mi1 < 2 and $mi2 < 2</when></award>
    <award name="large" credit="0"><when>$mi1 < 3 and $mi2 < 3</when></award>
  </answer></p>
  <section>
  <feedback name="close" condition="$(medium.creditAchieved) > $(small.creditAchieved)">
  <p>A number or two is close but not quite.</p>
  </feedback>
  <feedback name="goodAndClose" condition="$(medium.fractionSatisfied) > $(small.fractionSatisfied) > 0">
  <p>One number is good, the other number is close but not quite.</p>
  </feedback>
  <feedback name="startingClose" condition="$(large.fractionSatisfied) > 0 and $(medium.fractionSatisfied) = 0">
  <p>A number or two is starting to get close.</p>
  </feedback>
  <feedback name="closeStartingClose" condition="$(large.fractionSatisfied) >  $(medium.fractionSatisfied) > $(small.fractionSatisfied)">
  <p>A number is close but not quite; the other number is starting to get close.</p>
  </feedback>
  <feedback name="goodStartingClose" condition="$(large.fractionSatisfied) > $(small.fractionSatisfied) > 0 and  $(small.fractionSatisfied) =  $(medium.fractionSatisfied)">
  <p>One number is good, the other number is starting to get close.</p>
  </feedback>
  <feedback name="good" condition="1 > $(small.fractionSatisfied) > 0 and $(small.fractionSatisfied) = $(medium.fractionSatisfied) = $(large.fractionSatisfied)">
  <p>One number is good.</p>
  </feedback>
  </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_incorrect")).should("be.visible");

    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/mi1") + " textarea").type("2{enter}", { force: true });
    cy.get(cesc("#\\/ans_submit")).should("be.visible");
    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_incorrect")).should("be.visible");
    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should(
      "contain.text",
      "A number or two is starting to get close.",
    );
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/ans_submit")).should("be.visible");
    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should(
      "contain.text",
      "A number or two is starting to get close.",
    );
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("25% correct");
      });
    cy.get(cesc("#\\/close")).should(
      "contain.text",
      "A number or two is close but not quite.",
    );
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/ans_submit")).should("be.visible");
    cy.get(cesc("#\\/close")).should(
      "contain.text",
      "A number or two is close but not quite.",
    );
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });
    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("contain.text", "One number is good.");

    cy.get(cesc("#\\/mi2") + " textarea").type("2{enter}", { force: true });
    cy.get(cesc("#\\/ans_submit")).should("be.visible");
    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("contain.text", "One number is good.");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });
    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should(
      "have.text",
      "One number is good, the other number is starting to get close.",
    );
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/mi2") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/ans_submit")).should("be.visible");
    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should(
      "have.text",
      "One number is good, the other number is starting to get close.",
    );
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });
    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should(
      "have.text",
      "One number is good, the other number is close but not quite.",
    );
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/mi2") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/ans_submit")).should("be.visible");
    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should(
      "have.text",
      "One number is good, the other number is close but not quite.",
    );
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_correct")).should("be.visible");
    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/ans_submit")).should("be.visible");
    cy.get(cesc("#\\/close")).should("not.exist");
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });
    cy.get(cesc("#\\/close")).should(
      "contain.text",
      "A number or two is close but not quite.",
    );
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/ans_submit")).should("be.visible");
    cy.get(cesc("#\\/close")).should(
      "contain.text",
      "A number or two is close but not quite.",
    );
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should("not.exist");
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("25% correct");
      });
    cy.get(cesc("#\\/close")).should(
      "contain.text",
      "A number or two is close but not quite.",
    );
    cy.get(cesc("#\\/goodAndClose")).should("not.exist");
    cy.get(cesc("#\\/startingClose")).should("not.exist");
    cy.get(cesc("#\\/closeStartingClose")).should(
      "contain.text",
      "A number is close but not quite; the other number is starting to get close.",
    );
    cy.get(cesc("#\\/goodStartingClose")).should("not.exist");
    cy.get(cesc("#\\/good")).should("not.exist");
  });

  it("feedback with no condition", () => {
    let doenetML = `
    <text>a</text>
    <feedback name="fback"><p>Good job!</p></feedback>
    `;
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/fback")).should("have.text", "Good job!");

    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_showFeedback").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/fback")).should("not.exist");
  });

  it("feedback inside invalid children", () => {
    // The following DoenetML was a minimal working example to trigger a bug
    // where the children of _li1 where not being updated on the second submission
    // (due to being marked stale from invalid children in the middle of the first
    // time that they were being updated)
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <text>a</text>
        <p>
          <graph />
          <ul>
            <li>
              x: <answer name="ans"><mathinput name="mi" />x</answer>   
              <feedback name="fb" condition="$ans.numSubmissions > 1">You answered at least twice</feedback>
            </li>
            <li>$ans</li>
          </ul>
        </p>
        `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/fb")).should("not.exist");

    cy.get(cesc("#\\/mi_submit")).click();
    cy.get(cesc("#\\/mi_incorrect")).should("be.visible");
    cy.get(cesc("#\\/_li2") + " .mjx-mrow").should("contain.text", "\uff3f");

    cy.get(cesc("#\\/fb")).should("not.exist");

    // Note: added 100 ms delay because otherwise when Enter key event was received,
    // the renderer had not yet gotten signal from core that answer blank was unvalidated,
    // which is a necessary condition for Enter to lead to a submitAnswer
    cy.get(cesc("#\\/mi") + " textarea").type("y{enter}", {
      force: true,
      delay: 100,
    });

    cy.get(cesc("#\\/_li2") + " .mjx-mrow").should("contain.text", "y");
    cy.get(cesc("#\\/fb")).should("have.text", "You answered at least twice");
  });

  it("feedback from numSubmissions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer name="ans">x</answer></p>
  <feedback condition="$ans.numSubmissions > 1">
    <p name="pSub">You answered more than once!</p>
  </feedback>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/ans"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputCorrect = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrect = cesc2("#" + mathinputName + "_incorrect");

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(cesc2("#/pSub")).should("not.exist");

      cy.log("Submit first time");
      cy.get(mathinputAnchor).type(`x{enter}`, { force: true });
      cy.get(mathinputCorrect).should("be.visible");
      cy.get(cesc2("#/pSub")).should("not.exist");

      cy.log("Submit second time");
      cy.get(mathinputAnchor).type(`{end}{backspace}y{enter}`, { force: true });
      cy.get(mathinputIncorrect).should("be.visible");
      cy.get(cesc2("#/pSub")).should(
        "have.text",
        "You answered more than once!",
      );

      cy.log("Submit third time");
      cy.get(mathinputAnchor).type(`{end}{backspace}x{enter}`, { force: true });
      cy.get(mathinputCorrect).should("be.visible");
      cy.get(cesc2("#/pSub")).should(
        "have.text",
        "You answered more than once!",
      );
    });
  });

  it("feedback with deprecation shim for nSubmissions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><answer name="ans">x</answer></p>
  <feedback condition="$ans.nSubmissions > 1">
    <p name="pSub">You answered more than once!</p>
  </feedback>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/ans"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputCorrect = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrect = cesc2("#" + mathinputName + "_incorrect");

      cy.log("Test value displayed in browser");
      // cy.get(mathinputAnchor).should('have.value', '');
      cy.get(cesc2("#/pSub")).should("not.exist");

      cy.log("Submit first time");
      cy.get(mathinputAnchor).type(`x{enter}`, { force: true });
      cy.get(mathinputCorrect).should("be.visible");
      cy.get(cesc2("#/pSub")).should("not.exist");

      cy.log("Submit second time");
      cy.get(mathinputAnchor).type(`{end}{backspace}y{enter}`, { force: true });
      cy.get(mathinputIncorrect).should("be.visible");
      cy.get(cesc2("#/pSub")).should(
        "have.text",
        "You answered more than once!",
      );

      cy.log("Submit third time");
      cy.get(mathinputAnchor).type(`{end}{backspace}x{enter}`, { force: true });
      cy.get(mathinputCorrect).should("be.visible");
      cy.get(cesc2("#/pSub")).should(
        "have.text",
        "You answered more than once!",
      );
    });
  });
});
