import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("ChoiceInput Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("default is block format, shuffleOrder", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput shuffleOrder>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>

    <p name="pCat">Selected cat: $_choice1.selected</p>
    <p name="pDog">Selected dog: $_choice2.selected</p>
    <p name="pMonkey">Selected monkey: $_choice3.selected</p>
    <p name="pMouse">Selected mouse: $_choice4.selected</p>
    `,
          requestedVariantIndex: 8,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");

    cy.get(cesc("#\\/pCat")).should("have.text", "Selected cat: false");
    cy.get(cesc("#\\/pDog")).should("have.text", "Selected dog: false");
    cy.get(cesc("#\\/pMonkey")).should("have.text", "Selected monkey: false");
    cy.get(cesc("#\\/pMouse")).should("have.text", "Selected mouse: false");

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/_choiceinput1"].stateValues.choiceTexts];
      choiceOrder = [
        ...stateVariables["/_choiceinput1"].stateValues.choiceOrder,
      ];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables["/_choiceinput1"].stateValues.selectedValues).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectedIndices).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(false);
      expect(stateVariables["/_choiceinput1"].stateValues.shuffleOrder).eq(
        true,
      );
      expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
    });

    cy.log("select options in order");

    for (let i = 0; i < 4; i++) {
      cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
        .click()
        .then(() => {
          // make this asynchronous so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Selected value: " + choices[i],
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "Selected index: " + (i + 1),
          );

          cy.get(cesc("#\\/pCat")).should(
            "have.text",
            `Selected cat: ${choiceOrder[i] === 1}`,
          );
          cy.get(cesc("#\\/pDog")).should(
            "have.text",
            `Selected dog: ${choiceOrder[i] === 2}`,
          );
          cy.get(cesc("#\\/pMonkey")).should(
            "have.text",
            `Selected monkey: ${choiceOrder[i] === 3}`,
          );
          cy.get(cesc("#\\/pMouse")).should(
            "have.text",
            `Selected mouse: ${choiceOrder[i] === 4}`,
          );
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedValues,
        ).eqls([choices[i]]);
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedIndices,
        ).eqls([i + 1]);
        expect(stateVariables["/_choice1"].stateValues.selected).eq(
          choiceOrder[i] === 1,
        );
        expect(stateVariables["/_choice2"].stateValues.selected).eq(
          choiceOrder[i] === 2,
        );
        expect(stateVariables["/_choice3"].stateValues.selected).eq(
          choiceOrder[i] === 3,
        );
        expect(stateVariables["/_choice4"].stateValues.selected).eq(
          choiceOrder[i] === 4,
        );
      });
    }
  });

  it("inline choiceinput, shuffleOrder", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput inline shuffleOrder>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>

    <p name="pCat">Selected cat: $_choice1.selected</p>
    <p name="pDog">Selected dog: $_choice2.selected</p>
    <p name="pMonkey">Selected monkey: $_choice3.selected</p>
    <p name="pMouse">Selected mouse: $_choice4.selected</p>
    `,
          requestedVariantIndex: 8,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");

    cy.get(cesc("#\\/pCat")).should("have.text", "Selected cat: false");
    cy.get(cesc("#\\/pDog")).should("have.text", "Selected dog: false");
    cy.get(cesc("#\\/pMonkey")).should("have.text", "Selected monkey: false");
    cy.get(cesc("#\\/pMouse")).should("have.text", "Selected mouse: false");

    cy.get(cesc("#\\/_choiceinput1")).should("have.value", "");

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/_choiceinput1"].stateValues.choiceTexts];
      choiceOrder = [
        ...stateVariables["/_choiceinput1"].stateValues.choiceOrder,
      ];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables["/_choiceinput1"].stateValues.selectedValues).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectedIndices).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(true);
      expect(stateVariables["/_choiceinput1"].stateValues.shuffleOrder).eq(
        true,
      );
      expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
    });

    cy.log("select options in order");

    for (let i = 0; i < 4; i++) {
      cy.get(cesc(`#\\/_choiceinput1`)).select(`${i + 1}`);
      cy.get(cesc("#\\/_choiceinput1"))
        .should("have.value", i + 1)
        .then(() => {
          // make this asynchronous  so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Selected value: " + choices[i],
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "Selected index: " + (i + 1),
          );

          cy.get(cesc("#\\/pCat")).should(
            "have.text",
            `Selected cat: ${choiceOrder[i] === 1}`,
          );
          cy.get(cesc("#\\/pDog")).should(
            "have.text",
            `Selected dog: ${choiceOrder[i] === 2}`,
          );
          cy.get(cesc("#\\/pMonkey")).should(
            "have.text",
            `Selected monkey: ${choiceOrder[i] === 3}`,
          );
          cy.get(cesc("#\\/pMouse")).should(
            "have.text",
            `Selected mouse: ${choiceOrder[i] === 4}`,
          );
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedValues,
        ).eqls([choices[i]]);
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedIndices,
        ).eqls([i + 1]);
        expect(stateVariables["/_choice1"].stateValues.selected).eq(
          choiceOrder[i] === 1,
        );
        expect(stateVariables["/_choice2"].stateValues.selected).eq(
          choiceOrder[i] === 2,
        );
        expect(stateVariables["/_choice3"].stateValues.selected).eq(
          choiceOrder[i] === 3,
        );
        expect(stateVariables["/_choice4"].stateValues.selected).eq(
          choiceOrder[i] === 4,
        );
      });
    }
  });

  it("fixed order", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");

    let choices;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/_choiceinput1"].stateValues.choiceTexts];
      expect(choices).eqls(originalChoices);
      expect(stateVariables["/_choiceinput1"].stateValues.selectedValues).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectedIndices).eqls(
        [],
      );
      // expect(stateVariables['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
      expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(false);
      expect(stateVariables["/_choiceinput1"].stateValues.shuffleOrder).eq(
        false,
      );
      expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
    });

    cy.log("select options in order");

    for (let i = 0; i < 4; i++) {
      cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
        .click()
        .then(() => {
          // make this asynchronous  so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Selected value: " + choices[i],
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "Selected index: " + (i + 1),
          );
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedValues,
        ).eqls([choices[i]]);
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedIndices,
        ).eqls([i + 1]);
        // expect(stateVariables['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([i + 1])
        expect(stateVariables["/_choice1"].stateValues.selected).eq(i === 0);
        expect(stateVariables["/_choice2"].stateValues.selected).eq(i === 1);
        expect(stateVariables["/_choice3"].stateValues.selected).eq(i === 2);
        expect(stateVariables["/_choice4"].stateValues.selected).eq(i === 3);
      });
    }
  });

  it("choiceinput references", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <choiceinput inline shuffleOrder name="ci1">
        <choice>a</choice>
        <choice>b</choice>
        <choice>c</choice>
        <choice>d</choice>
        <choice>e</choice>
        <choice>f</choice>
      </choiceinput>
      <choiceinput copySource="ci1" name="ci2" />
      <choiceinput inline="false" copySource="ci1" name="ci3" />
      <choiceinput inline="false" copySource="ci2" name="ci4" />
  
      <p>Selected values: <aslist>
      $ci1.selectedValue
      $ci2.selectedValue
      $ci3.selectedValue
      $ci4.selectedValue
      </aslist></p>
      <p>Selected indices: <aslist>
      $ci1.selectedindex
      $ci2.selectedindex
      $ci3.selectedindex
      $ci4.selectedindex
      </aslist></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["a", "b", "c", "d", "e", "f"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected values: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected indices: ");

    let choices;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/ci1"].stateValues.choiceTexts];
      expect(choices.length).eq(6);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(originalChoices.includes(choices[4])).eq(true);
      expect(originalChoices.includes(choices[5])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(choices[4]).not.eq(choices[0]);
      expect(choices[4]).not.eq(choices[1]);
      expect(choices[4]).not.eq(choices[2]);
      expect(choices[4]).not.eq(choices[3]);
      expect(choices[5]).not.eq(choices[0]);
      expect(choices[5]).not.eq(choices[1]);
      expect(choices[5]).not.eq(choices[2]);
      expect(choices[5]).not.eq(choices[3]);
      expect(choices[5]).not.eq(choices[4]);
      expect(stateVariables["/ci2"].stateValues.choiceTexts).eqls(choices);
      expect(stateVariables["/ci3"].stateValues.choiceTexts).eqls(choices);
      expect(stateVariables["/ci4"].stateValues.choiceTexts).eqls(choices);

      expect(stateVariables["/ci1"].stateValues.selectedValues).eqls([]);
      expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls([]);
      expect(stateVariables["/ci2"].stateValues.selectedValues).eqls([]);
      expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls([]);
      expect(stateVariables["/ci3"].stateValues.selectedValues).eqls([]);
      expect(stateVariables["/ci3"].stateValues.selectedIndices).eqls([]);
      expect(stateVariables["/ci4"].stateValues.selectedValues).eqls([]);
      expect(stateVariables["/ci4"].stateValues.selectedIndices).eqls([]);

      expect(stateVariables["/ci1"].stateValues.inline).eq(true);
      expect(stateVariables["/ci1"].stateValues.shuffleOrder).eq(true);
      expect(stateVariables["/ci2"].stateValues.inline).eq(true);
      expect(stateVariables["/ci2"].stateValues.shuffleOrder).eq(true);
      expect(stateVariables["/ci3"].stateValues.inline).eq(false);
      expect(stateVariables["/ci3"].stateValues.shuffleOrder).eq(true);
      expect(stateVariables["/ci4"].stateValues.inline).eq(false);
      expect(stateVariables["/ci4"].stateValues.shuffleOrder).eq(true);
    });

    cy.log("select options in order from first input");
    for (let i = 0; i < 6; i++) {
      cy.get(cesc(`#\\/ci1`))
        .select(`${i + 1}`)
        .then(() => {
          // make this asynchronous  so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`,
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`,
          );

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ci1"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci3"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci3"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci4"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci4"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
          });
        });
    }

    cy.log("select options in order from second input");
    for (let i = 0; i < 6; i++) {
      cy.get(cesc(`#\\/ci2`))
        .select(`${i + 1}`)
        .then(() => {
          // make this asynchronous  so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`,
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`,
          );

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ci1"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci3"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci3"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci4"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci4"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
          });
        });
    }

    cy.log("select options in order from third input");
    for (let i = 0; i < 6; i++) {
      cy.get(`${cesc(`#\\/ci3`)}_choice${i + 1}_input`)
        .click()
        .then(() => {
          // make this asynchronous  so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`,
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`,
          );

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ci1"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci3"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci3"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci4"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci4"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
          });
        });
    }

    cy.log("select options in order from fourth input");
    for (let i = 0; i < 6; i++) {
      cy.get(`${cesc(`#\\/ci4`)}_choice${i + 1}_input`)
        .click()
        .then(() => {
          // make this asynchronous  so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            `Selected values: ${choices[i]}, ${choices[i]}, ${choices[i]}, ${choices[i]}`,
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            `Selected indices: ${i + 1}, ${i + 1}, ${i + 1}, ${i + 1}`,
          );

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ci1"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci3"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci3"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci4"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci4"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
          });
        });
    }
  });

  it("math inside choices", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput shuffleOrder name="ci1">
      <choice>The function is <m>f(\\xi)=\\sin(\\xi)</m>.</choice>
      <choice>The sum of <math name="lambda2">lambda^2</math> and <math name="twice">2 lambda^2</math> is <math simplify>$lambda2+$twice</math>.</choice>
      <choice>The sequence is <aslist><sequence from="1" to="5" /></aslist>.</choice>
      <choice>Can't convert this latex: <m>\\bar{x}^i</m>.</choice>
    </choiceinput>

    <choiceinput inline copySource="ci1" name="ci2" />

    <p>Selected values: <aslist>
    $ci1.selectedValue
    $ci2.selectedValue
    </aslist></p>
    <p>Selected indices: <aslist>
    $ci1.selectedindex
    $ci2.selectedindex
    </aslist></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = [
      "The function is f(ξ) = sin(ξ).",
      "The sum of λ² and 2 λ² is 3 λ².",
      "The sequence is 1, 2, 3, 4, 5.",
      "Can't convert this latex: \\bar{x}^i.",
    ];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected values: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected indices: ");
    // cy.get(cesc('#\\/_p3')).should('have.text', 'Selected original indices: ')

    let choices;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/ci1"].stateValues.choiceTexts];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);

      expect(stateVariables["/ci2"].stateValues.choiceTexts).eqls(choices);

      expect(stateVariables["/ci1"].stateValues.selectedValues).eqls([]);
      expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls([]);
      expect(stateVariables["/ci2"].stateValues.selectedValues).eqls([]);
      expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls([]);

      expect(stateVariables["/ci1"].stateValues.inline).eq(false);
      expect(stateVariables["/ci1"].stateValues.shuffleOrder).eq(true);
      expect(stateVariables["/ci2"].stateValues.inline).eq(true);
      expect(stateVariables["/ci2"].stateValues.shuffleOrder).eq(true);
    });

    cy.log("select options in order from first input");
    for (let i = 0; i < 4; i++) {
      cy.get(cesc(`#\\/ci1_choice${i + 1}_input`))
        .click()
        .then(() => {
          // make this asynchronous  so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            `Selected values: ${choices[i]}, ${choices[i]}`,
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            `Selected indices: ${i + 1}, ${i + 1}`,
          );

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ci1"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
          });
        });
    }

    cy.log("select options in order from second input");
    for (let i = 0; i < 4; i++) {
      cy.get(cesc(`#\\/ci2`))
        .select(`${i + 1}`)
        .then(() => {
          // make this asynchronous  so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            `Selected values: ${choices[i]}, ${choices[i]}`,
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            `Selected indices: ${i + 1}, ${i + 1}`,
          );

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ci1"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedValues).eqls([
              choices[i],
            ]);
            expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls([
              i + 1,
            ]);
          });
        });
    }
  });

  it("bind value to textinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput bindValueTo="$_textinput1" shuffleOrder name="ci1">
      <choice>caT</choice>
      <choice>  dog </choice>
      <choice><text>Monkey</text></choice>
    </choiceinput>

    <p>Select by typing: <textinput prefill="monkey" /></p>

    <choiceinput inline copySource="ci1" name="ci2" />

    <p>Selected values: <aslist>
    $ci1.selectedValue
    $ci2.selectedValue
    </aslist></p>
    <p>Selected indices: <aslist>
    $ci1.selectedindex
    $ci2.selectedindex
    </aslist></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["caT", "  dog ", "Monkey"];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let choiceOrder = stateVariables["/ci1"].stateValues.choiceOrder;
      let choices = choiceOrder.map((x) => originalChoices[x - 1]);

      let checkChoices = function (selectedChoice, inputText) {
        let choiceArray, indexArray;
        if (selectedChoice === null) {
          choiceArray = indexArray = [];

          for (let i = 1; i <= 3; i++) {
            cy.get(cesc(`#\\/ci1_choice${i}_input`)).should("not.be.checked");
          }
          cy.get(cesc(`#\\/ci2`)).should("have.value", "");

          cy.get(cesc("#\\/_p2")).should("have.text", `Selected values: `);
          cy.get(cesc("#\\/_p3")).should("have.text", `Selected indices: `);
        } else {
          let selectedIndex = choices.indexOf(selectedChoice) + 1;
          choiceArray = [selectedChoice];
          indexArray = [selectedIndex];

          for (let i = 1; i <= 3; i++) {
            if (i === selectedIndex) {
              cy.get(cesc(`#\\/ci1_choice${i}_input`)).should("be.checked");
            } else {
              cy.get(cesc(`#\\/ci1_choice${i}_input`)).should("not.be.checked");
            }
          }
          cy.get(cesc(`#\\/ci2`)).should("have.value", String(selectedIndex));
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            `Selected values: ${selectedChoice}, ${selectedChoice}`,
          );
          cy.get(cesc("#\\/_p3")).should(
            "have.text",
            `Selected indices: ${selectedIndex}, ${selectedIndex}`,
          );
        }

        cy.get(cesc("#\\/_textinput1_input")).should("have.value", inputText);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci1"].stateValues.selectedValues).eqls(
            choiceArray,
          );
          expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls(
            indexArray,
          );
          expect(stateVariables["/ci2"].stateValues.selectedValues).eqls(
            choiceArray,
          );
          expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls(
            indexArray,
          );
        });
      };

      checkChoices("Monkey", "monkey");

      cy.log("select cat from first input");
      let selectedChoice = "caT";
      let selectedIndex = choices.indexOf(selectedChoice) + 1;
      let inputText = selectedChoice;
      cy.get(cesc(`#\\/ci1_choice${selectedIndex}_input`)).click();
      checkChoices(selectedChoice, inputText);

      cy.log("Type Dog");
      selectedChoice = "  dog ";
      selectedIndex = choices.indexOf(selectedChoice) + 1;
      inputText = "Dog";
      cy.get(cesc("#\\/_textinput1_input")).clear().type(`${inputText}{enter}`);
      checkChoices(selectedChoice, inputText);

      cy.log("select monkey from second input");
      selectedChoice = "Monkey";
      selectedIndex = choices.indexOf(selectedChoice) + 1;
      inputText = selectedChoice;
      cy.get(cesc(`#\\/ci2`)).select(`${selectedIndex}`);
      checkChoices(selectedChoice, inputText);

      cy.log("type no cat");
      selectedChoice = null;
      inputText = "no cat";
      cy.get(cesc("#\\/_textinput1_input")).clear().type(`${inputText}{enter}`);
      checkChoices(selectedChoice, inputText);

      cy.log("select cat from second input");
      selectedChoice = "caT";
      selectedIndex = choices.indexOf(selectedChoice) + 1;
      inputText = selectedChoice;
      cy.get(cesc(`#\\/ci2`)).select(`${selectedIndex}`);
      checkChoices(selectedChoice, inputText);

      cy.log("type no dog");
      selectedChoice = null;
      inputText = "no dog";
      cy.get(cesc("#\\/_textinput1_input")).clear().type(`${inputText}{enter}`);
      checkChoices(selectedChoice, inputText);

      cy.log("select dog from first input");
      selectedChoice = "  dog ";
      selectedIndex = choices.indexOf(selectedChoice) + 1;
      inputText = selectedChoice;
      cy.get(cesc(`#\\/ci1_choice${selectedIndex}_input`)).click();
      checkChoices(selectedChoice, inputText);

      cy.log("type no monkey");
      selectedChoice = null;
      inputText = "no monkey";
      cy.get(cesc("#\\/_textinput1_input")).clear().type(`${inputText}{enter}`);
      checkChoices(selectedChoice, inputText);

      cy.log("type   monKey   ");
      selectedChoice = "Monkey";
      inputText = "  monKey   ";
      cy.get(cesc("#\\/_textinput1_input")).clear().type(`${inputText}{enter}`);
      checkChoices(selectedChoice, inputText);
    });
  });

  it("bind value to textinput, select multiple", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput bindValueTo="$_textinput1" shuffleOrder selectMultiple name="ci1">
      <choice><text>caT</text></choice>
      <choice>  dog </choice>
      <choice>Monkey</choice>
    </choiceinput>

    <p>Select by typing: <textinput prefill="monkey" /></p>

    <choiceinput inline copySource="ci1" name="ci2" />

    <p>Selected values: <aslist>
    $ci1.selectedValues
    $ci2.selectedValues
    </aslist></p>
    <p>Selected indices: <aslist>
    $ci1.selectedindices
    $ci2.selectedindices
    </aslist></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["caT", "  dog ", "Monkey"];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let choiceOrder = stateVariables["/ci1"].stateValues.choiceOrder;
      let choices = choiceOrder.map((x) => originalChoices[x - 1]);

      let checkChoices = function (selectedChoices, inputText) {
        selectedChoices.sort((a, b) => choices.indexOf(a) - choices.indexOf(b));

        let selectedIndices = selectedChoices.map(
          (x) => choices.indexOf(x) + 1,
        );

        for (let i = 1; i <= 3; i++) {
          if (selectedIndices.includes(i)) {
            cy.get(cesc(`#\\/ci1_choice${i}_input`)).should("be.checked");
          } else {
            cy.get(cesc(`#\\/ci1_choice${i}_input`)).should("not.be.checked");
          }
        }
        cy.get(cesc(`#\\/ci2`))
          .invoke("val")
          .should(
            "deep.equal",
            selectedIndices.map((x) => String(x)),
          );
        let selectedChoicesString = [
          ...selectedChoices,
          ...selectedChoices,
        ].join(", ");
        let selectedIndicesString = [
          ...selectedIndices,
          ...selectedIndices,
        ].join(", ");
        cy.get(cesc("#\\/_p2")).should(
          "have.text",
          `Selected values: ${selectedChoicesString}`,
        );
        cy.get(cesc("#\\/_p3")).should(
          "have.text",
          `Selected indices: ${selectedIndicesString}`,
        );

        cy.get(cesc("#\\/_textinput1_input")).should("have.value", inputText);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci1"].stateValues.selectedValues).eqls(
            selectedChoices,
          );
          expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls(
            selectedIndices,
          );
          expect(stateVariables["/ci2"].stateValues.selectedValues).eqls(
            selectedChoices,
          );
          expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls(
            selectedIndices,
          );
        });
      };

      checkChoices(["Monkey"], "monkey");

      cy.log("select cat from first input");
      let selectedChoices = ["caT", "Monkey"];
      let selectedIndex = choices.indexOf(selectedChoices[0]) + 1;
      selectedChoices.sort((a, b) => choices.indexOf(a) - choices.indexOf(b));
      let inputText = selectedChoices.join(", ");
      cy.get(cesc(`#\\/ci1_choice${selectedIndex}_input`)).click();
      checkChoices(selectedChoices, inputText);

      cy.log("Type Dog");
      selectedChoices = ["  dog "];
      inputText = "Dog";
      cy.get(cesc("#\\/_textinput1_input")).clear().type(`${inputText}{enter}`);
      checkChoices(selectedChoices, inputText);

      cy.log("Type cat  ,DOG");
      selectedChoices = ["  dog ", "caT"];
      inputText = "cat   ,DOG";
      cy.get(cesc("#\\/_textinput1_input")).clear().type(`${inputText}{enter}`);
      checkChoices(selectedChoices, inputText);

      cy.log("select monkey, dog from second input");
      selectedChoices = ["  dog ", "Monkey"];
      let selectedIndices = selectedChoices.map((x) => choices.indexOf(x) + 1);
      selectedChoices.sort((a, b) => choices.indexOf(a) - choices.indexOf(b));
      inputText = selectedChoices.join(", ");
      cy.get(cesc(`#\\/ci2`)).select(selectedIndices.map(String));
      checkChoices(selectedChoices, inputText);

      cy.log("type no cat");
      selectedChoices = [];
      inputText = "no cat";
      cy.get(cesc("#\\/_textinput1_input")).clear().type(`${inputText}{enter}`);
      checkChoices(selectedChoices, inputText);

      cy.log("type cat, no dog");
      selectedChoices = ["caT"];
      inputText = "cat, no dog";
      cy.get(cesc("#\\/_textinput1_input")).clear().type(`${inputText}{enter}`);
      checkChoices(selectedChoices, inputText);

      cy.log("type dog, no monkey,   CAT   ");
      selectedChoices = ["  dog ", "caT"];
      inputText = "dog, no monkey,   CAT   ";
      cy.get(cesc("#\\/_textinput1_input")).clear().type(`${inputText}{enter}`);
      checkChoices(selectedChoices, inputText);

      cy.log("select all from second input");
      selectedChoices = ["Monkey", "  dog ", "caT"];
      selectedIndices = selectedChoices.map((x) => choices.indexOf(x) + 1);
      selectedChoices.sort((a, b) => choices.indexOf(a) - choices.indexOf(b));
      inputText = selectedChoices.join(", ");

      // for some reason, the html <select> tag is ignoring the onChange event
      // unless first select option 3 before selecting them all!
      // No idea what's going on
      cy.get(cesc("#\\/ci2")).select(["3"]);
      cy.get(cesc(`#\\/ci2`)).select(selectedIndices.map(String));

      checkChoices(selectedChoices, inputText);

      cy.log("type no dog at end");
      inputText += ", no dog";
      cy.get(cesc("#\\/_textinput1_input")).type(`{end}, no dog{enter}`);
      checkChoices(selectedChoices, inputText);

      cy.log("type dog,  DOG");
      selectedChoices = ["  dog "];
      inputText = "dog,  DOG";
      cy.get(cesc("#\\/_textinput1_input")).clear().type(`${inputText}{enter}`);
      checkChoices(selectedChoices, inputText);

      cy.log("select cat from first input");
      selectedChoices = ["  dog ", "caT"];
      selectedChoices.sort((a, b) => choices.indexOf(a) - choices.indexOf(b));
      selectedIndex = choices.indexOf(selectedChoices[0]) + 1;
      inputText = selectedChoices.join(", ");
      cy.get(cesc(`#\\/ci1_choice${selectedIndex}_input`)).click();
      checkChoices(selectedChoices, inputText);

      cy.log("deselect dog from first input");
      selectedIndex = choices.indexOf(selectedChoices[1]) + 1;
      selectedChoices = ["caT"];
      inputText = selectedChoices.join(", ");
      cy.get(cesc(`#\\/ci1_choice${selectedIndex}_input`)).click();
      checkChoices(selectedChoices, inputText);
    });
  });

  it("bind value to fixed text, choiceinput reverts to fixed value", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput bindValueTo="$alwaysMonkey" name="ci1">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
    </choiceinput>

    <p>Fixed to be: <text name="alwaysMonkey" fixed>monkey</text></p>

    <choiceinput inline copySource="ci1" name="ci2" />

    <p>Selected values: <aslist>
    $ci1.selectedValue
    $ci2.selectedValue
    </aslist></p>
    <p>Selected indices: <aslist>
    $ci1.selectedindex
    $ci2.selectedindex
    </aslist></p>

    <p>Check for core round trip: <booleaninput name="bi" /> $bi.value{assignNames="b"}</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    function checkStillMonkey() {
      for (let i = 1; i <= 3; i++) {
        if (i === 3) {
          cy.get(cesc(`#\\/ci1_choice${i}_input`)).should("be.checked");
        } else {
          cy.get(cesc(`#\\/ci1_choice${i}_input`)).should("not.be.checked");
        }
      }
      cy.get(cesc(`#\\/ci2`)).should("have.value", "3");
      cy.get(cesc("#\\/_p2")).should(
        "have.text",
        `Selected values: monkey, monkey`,
      );
      cy.get(cesc("#\\/_p3")).should("have.text", `Selected indices: 3, 3`);
    }

    checkStillMonkey();

    cy.get(cesc(`#\\/ci1_choice1_input`)).click();
    cy.get(cesc(`#\\/bi`)).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");
    checkStillMonkey();

    cy.get(cesc(`#\\/ci1_choice2_input`)).click();
    cy.get(cesc(`#\\/bi`)).click();
    cy.get(cesc("#\\/b")).should("have.text", "false");
    checkStillMonkey();

    cy.get(cesc(`#\\/ci2`)).select(`1`);
    cy.get(cesc(`#\\/bi`)).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");
    checkStillMonkey();

    cy.get(cesc(`#\\/ci2`)).select(`2`);
    cy.get(cesc(`#\\/bi`)).click();
    cy.get(cesc("#\\/b")).should("have.text", "false");
    checkStillMonkey();
  });

  it("bind value to mathinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput bindValueTo="$_mathinput1" name="ci1">
      <choice><math>x^2/2</math></choice>
      <choice><m>y</m></choice>
      <choice><math format="latex">\\frac{\\partial f}{\\partial x}</math></choice>
      <choice>3</choice>
      <choice><text>1/(e^x)</text></choice>
    </choiceinput>
    
    <p>Select by typing: <mathinput prefill="y" /></p>

    <choiceinput inline copySource="ci1" name="ci2" />

    <p>Selected values: <aslist>
    $ci1.selectedValue
    $ci2.selectedValue
    </aslist></p>
    <p>Selected indices: <aslist>
    $ci1.selectedindex
    $ci2.selectedindex
    </aslist></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let textOrder = ["(x²)/2", "y", "∂f/∂x", "3", "1/(e^x)"];

    let checkChoices = function (selectedIndex, inputText, inputMath) {
      let choiceArray, indexArray;

      let selectedChoice = null;

      if (selectedIndex === null) {
        choiceArray = indexArray = [];

        for (let i = 1; i <= 3; i++) {
          cy.get(cesc(`#\\/ci1_choice${i}_input`)).should("not.be.checked");
        }
        cy.get(cesc(`#\\/ci2`)).should("have.value", "");

        cy.get(cesc("#\\/_p2")).should("have.text", `Selected values: `);
        cy.get(cesc("#\\/_p3")).should("have.text", `Selected indices: `);
      } else {
        selectedChoice = textOrder[selectedIndex - 1];
        choiceArray = [selectedChoice];
        indexArray = [selectedIndex];

        for (let i = 1; i <= 3; i++) {
          if (i === selectedIndex) {
            cy.get(cesc(`#\\/ci1_choice${i}_input`)).should("be.checked");
          } else {
            cy.get(cesc(`#\\/ci1_choice${i}_input`)).should("not.be.checked");
          }
        }
        cy.get(cesc(`#\\/ci2`)).should("have.value", String(selectedIndex));
        cy.get(cesc("#\\/_p2")).should(
          "have.text",
          `Selected values: ${selectedChoice}, ${selectedChoice}`,
        );
        cy.get(cesc("#\\/_p3")).should(
          "have.text",
          `Selected indices: ${selectedIndex}, ${selectedIndex}`,
        );
      }

      cy.get(cesc(`#\\/_mathinput1`) + ` .mq-editable-field`)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(inputText);
        });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/ci1"].stateValues.selectedValues).eqls(
          choiceArray,
        );
        expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls(
          indexArray,
        );
        expect(stateVariables["/ci2"].stateValues.selectedValues).eqls(
          choiceArray,
        );
        expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls(
          indexArray,
        );
        expect(stateVariables["/_mathinput1"].stateValues.value).eqls(
          inputMath,
        );
      });
    };

    cy.get(cesc("#\\/_math1")).should("contain.text", "x22");

    checkChoices(2, "y", "y");

    cy.log("select x^2/2 from first input");
    let selectedIndex = 1;
    let inputText = "x22";
    cy.get(cesc(`#\\/ci1_choice${selectedIndex}_input`))
      .should("not.be.visible")
      .click({ force: true }); // input is invisible (covered by text), but click it anyway
    checkChoices(selectedIndex, inputText, ["/", ["^", "x", 2], 2]);

    cy.log("Type 3");
    selectedIndex = 4;
    inputText = "3";
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}${inputText}{enter}`,
      { force: true },
    );
    checkChoices(selectedIndex, inputText, 3);

    cy.log("select ∂f/∂x from second input");
    selectedIndex = 3;
    inputText = "∂f∂x";
    cy.get(cesc(`#\\/ci2`)).select(`${selectedIndex}`);
    checkChoices(selectedIndex, inputText, [
      "partial_derivative_leibniz",
      "f",
      ["tuple", "x"],
    ]);

    cy.log("type e^{-x}");
    selectedIndex = null;
    inputText = "e−x";
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}e^-x{enter}`,
      { force: true },
    );
    checkChoices(selectedIndex, inputText, ["^", "e", ["-", "x"]]);

    cy.log("type 1/e^{x}");
    selectedIndex = 5;
    inputText = "1ex";
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}1/e^x{enter}`,
      { force: true },
    );
    checkChoices(selectedIndex, inputText, ["/", 1, ["^", "e", "x"]]);

    cy.log("select y from second input");
    selectedIndex = 2;
    inputText = "y";
    cy.get(cesc(`#\\/ci2`)).select(`${selectedIndex}`);
    checkChoices(selectedIndex, inputText, "y");
  });

  it("preselect choices", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput name="c1" preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>

    <choiceinput name="c2" inline shuffleOrder preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>

    <choiceinput name="c3" inline>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>


    <choiceinput name="c4" shuffleOrder>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>

    <choiceinput name="c5" inline>
      <choice>cat</choice>
      <choice preselect>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>


    <choiceinput name="c6" shuffleOrder>
      <choice>cat</choice>
      <choice preselect>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>


    <choiceinput name="c7" preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>


    <choiceinput name="c8" shuffleOrder inline preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceinput>


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/c1_choice2_input")).should("be.checked");

      cy.get(cesc("#\\/c2")).should("have.value", "2");

      cy.get(cesc("#\\/c3")).should("have.value", "4");

      let mouseInd4 =
        stateVariables["/c4"].stateValues.choiceTexts.indexOf("mouse");
      cy.get(cesc(`#\\/c4_choice${mouseInd4 + 1}_input`)).should("be.checked");

      cy.get(cesc("#\\/c5")).should("have.value", "2");

      let dogInd6 =
        stateVariables["/c6"].stateValues.choiceTexts.indexOf("dog");
      let mouseInd6 =
        stateVariables["/c6"].stateValues.choiceTexts.indexOf("mouse");
      let selectedInd6 = Math.min(dogInd6, mouseInd6);

      cy.get(cesc(`#\\/c6_choice${selectedInd6 + 1}_input`)).should(
        "be.checked",
      );

      cy.get(cesc("#\\/c7_choice4_input")).should("be.checked");

      let mouseInd8 =
        stateVariables["/c8"].stateValues.choiceTexts.indexOf("mouse");
      cy.get(cesc("#\\/c8")).should("have.value", `${mouseInd8 + 1}`);
    });
  });

  it("disabled choice with inline choiceinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput inline placeholder="Choose animal">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice disabled>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");

    cy.get(cesc("#\\/_choiceinput1")).should("have.value", "");

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/_choiceinput1"].stateValues.choiceTexts];
      choiceOrder = [
        ...stateVariables["/_choiceinput1"].stateValues.choiceOrder,
      ];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables["/_choiceinput1"].stateValues.selectedValues).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectedIndices).eqls(
        [],
      );
      // expect(stateVariables['/_choiceinput1'].stateValues.selectedoriginalindices).eqls([])
      expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(true);
      expect(stateVariables["/_choiceinput1"].stateValues.shuffleOrder).eq(
        false,
      );
      expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
    });

    cy.log("select options in order");

    for (let i = 0; i < 4; i++) {
      if (i === 2) {
        cy.get(cesc(`#\\/_choiceinput1`))
          .get('[value="3"]')
          .should("be.disabled");
      } else {
        cy.get(cesc(`#\\/_choiceinput1`))
          .select(`${i + 1}`)
          .then(() => {
            // make this asynchronous  so that choices is populated before line is executed
            cy.get(cesc("#\\/_p1")).should(
              "have.text",
              "Selected value: " + choices[i],
            );
            cy.get(cesc("#\\/_p2")).should(
              "have.text",
              "Selected index: " + (i + 1),
            );

            cy.window().then(async (win) => {
              let stateVariables = await win.returnAllStateVariables1();
              expect(
                stateVariables["/_choiceinput1"].stateValues.selectedValues,
              ).eqls([choices[i]]);
              expect(
                stateVariables["/_choiceinput1"].stateValues.selectedIndices,
              ).eqls([i + 1]);
              expect(stateVariables["/_choice1"].stateValues.selected).eq(
                choiceOrder[i] === 1,
              );
              expect(stateVariables["/_choice2"].stateValues.selected).eq(
                choiceOrder[i] === 2,
              );
              expect(stateVariables["/_choice3"].stateValues.selected).eq(
                choiceOrder[i] === 3,
              );
              expect(stateVariables["/_choice4"].stateValues.selected).eq(
                choiceOrder[i] === 4,
              );
            });
          });
      }
    }
  });

  it("hidden choice with inline choiceinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput inline placeholder="Choose animal">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice hide>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");

    cy.get(cesc("#\\/_choiceinput1")).should("have.value", "");

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/_choiceinput1"].stateValues.choiceTexts];
      choiceOrder = [
        ...stateVariables["/_choiceinput1"].stateValues.choiceOrder,
      ];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables["/_choiceinput1"].stateValues.selectedValues).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectedIndices).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(true);
      expect(stateVariables["/_choiceinput1"].stateValues.shuffleOrder).eq(
        false,
      );
      expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
    });

    cy.log("select options in order");

    for (let i = 0; i < 4; i++) {
      if (i === 2) {
        cy.get(cesc(`#\\/_choiceinput1`))
          .get('[value="3"]')
          .should("not.exist");
      } else {
        cy.get(cesc(`#\\/_choiceinput1`))
          .select(`${i + 1}`)
          .then(() => {
            // make this asynchronous  so that choices is populated before line is executed
            cy.get(cesc("#\\/_p1")).should(
              "have.text",
              "Selected value: " + choices[i],
            );
            cy.get(cesc("#\\/_p2")).should(
              "have.text",
              "Selected index: " + (i + 1),
            );

            cy.window().then(async (win) => {
              let stateVariables = await win.returnAllStateVariables1();
              expect(
                stateVariables["/_choiceinput1"].stateValues.selectedValues,
              ).eqls([choices[i]]);
              expect(
                stateVariables["/_choiceinput1"].stateValues.selectedIndices,
              ).eqls([i + 1]);
              expect(stateVariables["/_choice1"].stateValues.selected).eq(
                choiceOrder[i] === 1,
              );
              expect(stateVariables["/_choice2"].stateValues.selected).eq(
                choiceOrder[i] === 2,
              );
              expect(stateVariables["/_choice3"].stateValues.selected).eq(
                choiceOrder[i] === 3,
              );
              expect(stateVariables["/_choice4"].stateValues.selected).eq(
                choiceOrder[i] === 4,
              );
            });
          });
      }
    }
  });

  it("disabled choice with block choiceinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice disabled>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");

    let choices;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/_choiceinput1"].stateValues.choiceTexts];
      expect(choices).eqls(originalChoices);
      expect(stateVariables["/_choiceinput1"].stateValues.selectedValues).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectedIndices).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(false);
      expect(stateVariables["/_choiceinput1"].stateValues.shuffleOrder).eq(
        false,
      );
      expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
    });

    cy.log("select options in order");

    for (let i = 0; i < 4; i++) {
      if (i === 2) {
        cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`)).should(
          "be.disabled",
        );
      } else {
        cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
          .click()
          .then(() => {
            // make this asynchronous  so that choices is populated before line is executed
            cy.get(cesc("#\\/_p1")).should(
              "have.text",
              "Selected value: " + choices[i],
            );
            cy.get(cesc("#\\/_p2")).should(
              "have.text",
              "Selected index: " + (i + 1),
            );

            cy.window().then(async (win) => {
              let stateVariables = await win.returnAllStateVariables1();
              expect(
                stateVariables["/_choiceinput1"].stateValues.selectedValues,
              ).eqls([choices[i]]);
              expect(
                stateVariables["/_choiceinput1"].stateValues.selectedIndices,
              ).eqls([i + 1]);
              expect(stateVariables["/_choice1"].stateValues.selected).eq(
                i === 0,
              );
              expect(stateVariables["/_choice2"].stateValues.selected).eq(
                i === 1,
              );
              expect(stateVariables["/_choice3"].stateValues.selected).eq(
                i === 2,
              );
              expect(stateVariables["/_choice4"].stateValues.selected).eq(
                i === 3,
              );
            });
          });
      }
    }
  });

  it("hidden choice with block choiceinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice hide>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");

    let choices;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/_choiceinput1"].stateValues.choiceTexts];
      expect(choices).eqls(originalChoices);
      expect(stateVariables["/_choiceinput1"].stateValues.selectedValues).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectedIndices).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(false);
      expect(stateVariables["/_choiceinput1"].stateValues.shuffleOrder).eq(
        false,
      );
      expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
    });

    cy.log("select options in order");

    for (let i = 0; i < 4; i++) {
      if (i === 2) {
        cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`)).should(
          "not.exist",
        );
      } else {
        cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
          .click()
          .then(() => {
            // make this asynchronous  so that choices is populated before line is executed
            cy.get(cesc("#\\/_p1")).should(
              "have.text",
              "Selected value: " + choices[i],
            );
            cy.get(cesc("#\\/_p2")).should(
              "have.text",
              "Selected index: " + (i + 1),
            );

            cy.window().then(async (win) => {
              let stateVariables = await win.returnAllStateVariables1();
              expect(
                stateVariables["/_choiceinput1"].stateValues.selectedValues,
              ).eqls([choices[i]]);
              expect(
                stateVariables["/_choiceinput1"].stateValues.selectedIndices,
              ).eqls([i + 1]);
              expect(stateVariables["/_choice1"].stateValues.selected).eq(
                i === 0,
              );
              expect(stateVariables["/_choice2"].stateValues.selected).eq(
                i === 1,
              );
              expect(stateVariables["/_choice3"].stateValues.selected).eq(
                i === 2,
              );
              expect(stateVariables["/_choice4"].stateValues.selected).eq(
                i === 3,
              );
            });
          });
      }
    }
  });

  it("select multiple with block choiceinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput shuffleOrder selectMultiple>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected values: <aslist><copy prop='selectedvalues' target="_choiceinput1" /></aslist></p>
    <p>Selected indices: <aslist><copy prop='selectedindices' target="_choiceinput1" /></aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected values: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected indices: ");

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/_choiceinput1"].stateValues.choiceTexts];
      choiceOrder = [
        ...stateVariables["/_choiceinput1"].stateValues.choiceOrder,
      ];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables["/_choiceinput1"].stateValues.selectedValues).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectedIndices).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(false);
      expect(stateVariables["/_choiceinput1"].stateValues.shuffleOrder).eq(
        true,
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectMultiple).eq(
        true,
      );
      expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
    });

    cy.log("select options in order");

    for (let i = 0; i < 4; i++) {
      cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
        .click()
        .then(() => {
          // make this asynchronous so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Selected values: " + choices.slice(0, i + 1).join(", "),
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "Selected indices: " +
              [...Array(i + 1).keys()].map((x) => x + 1).join(", "),
          );
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedValues,
        ).eqls(choices.slice(0, i + 1));
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedIndices,
        ).eqls([...Array(i + 1).keys()].map((x) => x + 1));
        expect(stateVariables["/_choice1"].stateValues.selected).eq(
          choiceOrder.indexOf(1) <= i,
        );
        expect(stateVariables["/_choice2"].stateValues.selected).eq(
          choiceOrder.indexOf(2) <= i,
        );
        expect(stateVariables["/_choice3"].stateValues.selected).eq(
          choiceOrder.indexOf(3) <= i,
        );
        expect(stateVariables["/_choice4"].stateValues.selected).eq(
          choiceOrder.indexOf(4) <= i,
        );
      });
    }

    cy.log("deselect options in order");

    for (let i = 0; i < 4; i++) {
      cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
        .click()
        .then(() => {
          // make this asynchronous so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Selected values: " + choices.slice(i + 1).join(", "),
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "Selected indices: " +
              [...Array(3 - i).keys()].map((x) => x + 2 + i).join(", "),
          );
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedValues,
        ).eqls(choices.slice(i + 1));
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedIndices,
        ).eqls([...Array(3 - i).keys()].map((x) => x + 2 + i));
        expect(stateVariables["/_choice1"].stateValues.selected).eq(
          choiceOrder.indexOf(1) > i,
        );
        expect(stateVariables["/_choice2"].stateValues.selected).eq(
          choiceOrder.indexOf(2) > i,
        );
        expect(stateVariables["/_choice3"].stateValues.selected).eq(
          choiceOrder.indexOf(3) > i,
        );
        expect(stateVariables["/_choice4"].stateValues.selected).eq(
          choiceOrder.indexOf(4) > i,
        );
      });
    }

    cy.log("select options in reverse order");

    for (let i = 3; i >= 0; i--) {
      cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
        .click()
        .then(() => {
          // make this asynchronous so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Selected values: " + choices.slice(i).join(", "),
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "Selected indices: " +
              [...Array(4 - i).keys()].map((x) => x + 1 + i).join(", "),
          );
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedValues,
        ).eqls(choices.slice(i));
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedIndices,
        ).eqls([...Array(4 - i).keys()].map((x) => x + 1 + i));
        expect(stateVariables["/_choice1"].stateValues.selected).eq(
          choiceOrder.indexOf(1) >= i,
        );
        expect(stateVariables["/_choice2"].stateValues.selected).eq(
          choiceOrder.indexOf(2) >= i,
        );
        expect(stateVariables["/_choice3"].stateValues.selected).eq(
          choiceOrder.indexOf(3) >= i,
        );
        expect(stateVariables["/_choice4"].stateValues.selected).eq(
          choiceOrder.indexOf(4) >= i,
        );
      });
    }
  });

  it("select multiple with inline choiceinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput inline shuffleOrder selectMultiple>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
    </choiceinput>

    <p>Selected values: <aslist><copy prop='selectedvalues' target="_choiceinput1" /></aslist></p>
    <p>Selected indices: <aslist><copy prop='selectedindices' target="_choiceinput1" /></aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/_choiceinput1")).invoke("val").should("deep.equal", []);

    let originalChoices = ["cat", "dog", "monkey", "mouse"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected values: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected indices: ");

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/_choiceinput1"].stateValues.choiceTexts];
      choiceOrder = [
        ...stateVariables["/_choiceinput1"].stateValues.choiceOrder,
      ];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables["/_choiceinput1"].stateValues.selectedValues).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectedIndices).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(true);
      expect(stateVariables["/_choiceinput1"].stateValues.shuffleOrder).eq(
        true,
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectMultiple).eq(
        true,
      );
      expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
    });

    cy.log("select options in order");

    for (let i = 0; i < 4; i++) {
      // TODO: the onChange handler wasn't triggering when didn't first deselect
      // so, as a stopgap, we're deselecting all here.
      // We shouldn't need to do this!

      cy.get(cesc(`#\\/_choiceinput1`)).select([]);

      cy.get(cesc(`#\\/_choiceinput1`))
        .select([...Array(i + 1).keys()].map((x) => String(x + 1)))
        .then(() => {
          let selectedInds = [...Array(i + 1).keys()].map((x) => String(x + 1));
          cy.get(cesc("#\\/_choiceinput1"))
            .invoke("val")
            .should("deep.equal", selectedInds);

          // make this asynchronous so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Selected values: " + choices.slice(0, i + 1).join(", "),
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "Selected indices: " +
              [...Array(i + 1).keys()].map((x) => x + 1).join(", "),
          );
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedValues,
        ).eqls(choices.slice(0, i + 1));
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedIndices,
        ).eqls([...Array(i + 1).keys()].map((x) => x + 1));
        expect(stateVariables["/_choice1"].stateValues.selected).eq(
          choiceOrder.indexOf(1) <= i,
        );
        expect(stateVariables["/_choice2"].stateValues.selected).eq(
          choiceOrder.indexOf(2) <= i,
        );
        expect(stateVariables["/_choice3"].stateValues.selected).eq(
          choiceOrder.indexOf(3) <= i,
        );
        expect(stateVariables["/_choice4"].stateValues.selected).eq(
          choiceOrder.indexOf(4) <= i,
        );
      });
    }

    cy.log("deselect options in order");

    for (let i = 0; i < 4; i++) {
      cy.window().then(async (win) => {
        let indicesToSelect = [...Array(3 - i).keys()].map((x) =>
          String(x + 2 + i),
        );
        if (i === 3) {
          indicesToSelect = [""];
        }

        cy.get(cesc(`#\\/_choiceinput1`))
          .select(indicesToSelect)
          .then(() => {
            let selectedInds = [...Array(3 - i).keys()].map((x) =>
              String(x + 2 + i),
            );
            cy.get(cesc("#\\/_choiceinput1"))
              .invoke("val")
              .should("deep.equal", selectedInds);

            // make this asynchronous so that choices is populated before line is executed
            cy.get(cesc("#\\/_p1")).should(
              "have.text",
              "Selected values: " + choices.slice(i + 1).join(", "),
            );
            cy.get(cesc("#\\/_p2")).should(
              "have.text",
              "Selected indices: " +
                [...Array(3 - i).keys()].map((x) => x + 2 + i).join(", "),
            );
          });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(
            stateVariables["/_choiceinput1"].stateValues.selectedValues,
          ).eqls(choices.slice(i + 1));
          expect(
            stateVariables["/_choiceinput1"].stateValues.selectedIndices,
          ).eqls([...Array(3 - i).keys()].map((x) => x + 2 + i));
          expect(stateVariables["/_choice1"].stateValues.selected).eq(
            choiceOrder.indexOf(1) > i,
          );
          expect(stateVariables["/_choice2"].stateValues.selected).eq(
            choiceOrder.indexOf(2) > i,
          );
          expect(stateVariables["/_choice3"].stateValues.selected).eq(
            choiceOrder.indexOf(3) > i,
          );
          expect(stateVariables["/_choice4"].stateValues.selected).eq(
            choiceOrder.indexOf(4) > i,
          );
        });
      });
    }

    cy.log("select options in reverse order");

    for (let i = 3; i >= 0; i--) {
      cy.get(cesc(`#\\/_choiceinput1`))
        .select([...Array(4 - i).keys()].map((x) => String(x + 1 + i)))
        .then(() => {
          let selectedInds = [...Array(4 - i).keys()].map((x) =>
            String(x + 1 + i),
          );
          cy.get(cesc("#\\/_choiceinput1"))
            .invoke("val")
            .should("deep.equal", selectedInds);

          // make this asynchronous so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Selected values: " + choices.slice(i).join(", "),
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "Selected indices: " +
              [...Array(4 - i).keys()].map((x) => x + 1 + i).join(", "),
          );
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedValues,
        ).eqls(choices.slice(i));
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedIndices,
        ).eqls([...Array(4 - i).keys()].map((x) => x + 1 + i));
        expect(stateVariables["/_choice1"].stateValues.selected).eq(
          choiceOrder.indexOf(1) >= i,
        );
        expect(stateVariables["/_choice2"].stateValues.selected).eq(
          choiceOrder.indexOf(2) >= i,
        );
        expect(stateVariables["/_choice3"].stateValues.selected).eq(
          choiceOrder.indexOf(3) >= i,
        );
        expect(stateVariables["/_choice4"].stateValues.selected).eq(
          choiceOrder.indexOf(4) >= i,
        );
      });
    }
  });

  it("chain update off choiceinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput name="ci" >
      <choice>red</choice>
      <choice>orange</choice>
      <choice>yellow</choice>
      <choice>green</choice>
      <choice>blue</choice>
    </choiceinput>

    <text name="t"></text>
    <updateValue triggerWith="ci" target="t" newValue="$t $ci" type="text" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/t")).should("have.text", "");

    cy.get(cesc(`#\\/ci_choice2_input`)).click();
    cy.get(cesc("#\\/t")).should("have.text", " orange");

    cy.get(cesc(`#\\/ci_choice5_input`)).click();
    cy.get(cesc("#\\/t")).should("have.text", " orange blue");

    cy.get(cesc(`#\\/ci_choice1_input`)).click();
    cy.get(cesc("#\\/t")).should("have.text", " orange blue red");
  });

  // verify fixed bug where shuffle order was recalculated
  // causing a copy with no link to have a different shuffle order
  it("shuffleOrder is not recalculated when copy with no link", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <variantControl uniqueVariants="false" />

    <group name="g" newNamespace>
      <choiceinput shuffleOrder name="ci">
        <choice>a</choice>
        <choice>b</choice>
        <choice>c</choice>
        <choice>d</choice>
        <choice>e</choice>
      </choiceinput>
    </group>
    
    $g{name="g2" link="false"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let choices = ["a", "b", "c", "d", "e"];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let choiceOrder = stateVariables["/g/ci"].stateValues.choiceOrder;
      let choiceOrder2 = stateVariables["/g2/ci"].stateValues.choiceOrder;

      expect(choiceOrder2).eqls(choiceOrder);

      cy.get(`label[for=${cesc2("/g/ci_choice1_input")}]`).should(
        "have.text",
        choices[choiceOrder[0] - 1],
      );
      cy.get(`label[for=${cesc2("/g/ci_choice2_input")}]`).should(
        "have.text",
        choices[choiceOrder[1] - 1],
      );
      cy.get(`label[for=${cesc2("/g/ci_choice3_input")}]`).should(
        "have.text",
        choices[choiceOrder[2] - 1],
      );
      cy.get(`label[for=${cesc2("/g/ci_choice4_input")}]`).should(
        "have.text",
        choices[choiceOrder[3] - 1],
      );
      cy.get(`label[for=${cesc2("/g/ci_choice5_input")}]`).should(
        "have.text",
        choices[choiceOrder[4] - 1],
      );
      cy.get(`label[for=${cesc2("/g2/ci_choice1_input")}]`).should(
        "have.text",
        choices[choiceOrder[0] - 1],
      );
      cy.get(`label[for=${cesc2("/g2/ci_choice2_input")}]`).should(
        "have.text",
        choices[choiceOrder[1] - 1],
      );
      cy.get(`label[for=${cesc2("/g2/ci_choice3_input")}]`).should(
        "have.text",
        choices[choiceOrder[2] - 1],
      );
      cy.get(`label[for=${cesc2("/g2/ci_choice4_input")}]`).should(
        "have.text",
        choices[choiceOrder[3] - 1],
      );
      cy.get(`label[for=${cesc2("/g2/ci_choice5_input")}]`).should(
        "have.text",
        choices[choiceOrder[4] - 1],
      );
    });
  });

  it("math choices", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput>
      <choice><math>x + x</math></choice>
      <choice><m>y+y</m></choice>
      <choice><me>z+z</me></choice>
      <choice><men>u+u</men></choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' source="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' source="_choiceinput1" /></p>
    <p>Selected value: $_choiceinput1</p>
    <p>Selected value simplified: $_choiceinput1{simplify}</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");
    cy.get(cesc("#\\/_p3")).should("have.text", "Selected value: ");
    cy.get(cesc("#\\/_p4")).should("have.text", "Selected value simplified: ");

    cy.get(cesc(`#\\/_choiceinput1_choice1_input`)).click({ force: true });

    cy.get(cesc("#\\/_p1") + " .mjx-mrow").should("contain.text", "x+x");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: 1");
    cy.get(cesc("#\\/_p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");
    cy.get(cesc("#\\/_p4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");

    cy.get(cesc(`#\\/_choiceinput1_choice2_input`)).click({ force: true });

    cy.get(cesc("#\\/_p1") + " .mjx-mrow").should("contain.text", "y+y");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y+y");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: 2");
    cy.get(cesc("#\\/_p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y+y");
    cy.get(cesc("#\\/_p4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2y");

    cy.get(cesc(`#\\/_choiceinput1_choice3_input`)).click({ force: true });

    cy.get(cesc("#\\/_p1") + " .mjx-mrow").should("contain.text", "z+z");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "z+z");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: 3");
    cy.get(cesc("#\\/_p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "z+z");
    cy.get(cesc("#\\/_p4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2z");

    cy.get(cesc(`#\\/_choiceinput1_choice4_input`)).click({ force: true });

    cy.get(cesc("#\\/_p1") + " .mjx-mrow").should("contain.text", "u+u");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "u+u");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: 4");
    cy.get(cesc("#\\/_p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "u+u");
    cy.get(cesc("#\\/_p4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2u");
  });

  it("consistent order for n elements for given variant", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p>m: <mathinput prefill="1" name="m" /> <number name="m2" copySource="m" /></p>
  <p>n: <mathinput prefill="6" name="n" /> <number name="n2" copySource="n" /></p>
  <choiceinput name="ci" shuffleOrder>
    <map>
      <template>
        <choice>$v</choice>
      </template>
      <sources alias="v">
        <sequence from="$m" to="$n" />
      </sources>
    </map>
  </choiceinput>
  `,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/n2")).should("have.text", "6");

    let orders = {};

    cy.window().then(async (win) => {
      let m = 1,
        n = 6;

      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

      expect([...choiceOrder].sort((a, b) => a - b)).eqls(
        [...Array(n - m + 1).keys()].map((x) => x + m),
      );

      orders[[m, n]] = choiceOrder;
    });

    cy.log("switch n to 8");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}8{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2")).should("have.text", "8");

    cy.window().then(async (win) => {
      let m = 1,
        n = 8;

      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

      expect([...choiceOrder].sort((a, b) => a - b)).eqls(
        [...Array(n - m + 1).keys()].map((x) => x + m),
      );

      orders[[m, n]] = choiceOrder;
    });

    cy.log("get another list of length 6 by setting m to 3");

    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/m2")).should("have.text", "3");

    cy.window().then(async (win) => {
      let m = 3,
        n = 8;

      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

      expect(choiceOrder).eqls(orders[[1, 6]]);

      orders[[m, n]] = choiceOrder;
    });

    cy.log("get another list of length 8 by setting n to 10");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}10{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2")).should("have.text", "10");

    cy.window().then(async (win) => {
      let m = 3,
        n = 10;

      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

      expect(choiceOrder).eqls(orders[[1, 8]]);

      orders[[m, n]] = choiceOrder;
    });

    cy.log("values change with another variant");

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p>m: <mathinput prefill="1" name="m" /> <number name="m2" copySource="m" /></p>
  <p>n: <mathinput prefill="6" name="n" /> <number name="n2" copySource="n" /></p>
  <choiceinput name="ci" shuffleOrder>
    <map>
      <template>
        <choice>$v</choice>
      </template>
      <sources alias="v">
        <sequence from="$m" to="$n" />
      </sources>
    </map>
  </choiceinput>
  `,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/m2")).should("have.text", "1");
    cy.get(cesc("#\\/n2")).should("have.text", "6");

    cy.window().then(async (win) => {
      let m = 1,
        n = 6;

      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

      expect(choiceOrder).not.eqls(orders[[m, n]]);

      expect([...choiceOrder].sort((a, b) => a - b)).eqls(
        [...Array(n - m + 1).keys()].map((x) => x + m),
      );

      orders[[m, n]] = choiceOrder;
    });

    cy.log("switch n to 8");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}8{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2")).should("have.text", "8");

    cy.window().then(async (win) => {
      let m = 1,
        n = 8;

      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

      expect(choiceOrder).not.eqls(orders[[m, n]]);

      expect([...choiceOrder].sort((a, b) => a - b)).eqls(
        [...Array(n - m + 1).keys()].map((x) => x + m),
      );

      orders[[m, n]] = choiceOrder;
    });

    cy.log("get another list of length 6 by setting m to 3");

    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/m2")).should("have.text", "3");

    cy.window().then(async (win) => {
      let m = 3,
        n = 8;

      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

      expect(choiceOrder).eqls(orders[[1, 6]]);

      orders[[m, n]] = choiceOrder;
    });

    cy.log("get another list of length 8 by setting n to 10");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}10{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2")).should("have.text", "10");

    cy.window().then(async (win) => {
      let m = 3,
        n = 10;

      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

      expect(choiceOrder).eqls(orders[[1, 8]]);

      orders[[m, n]] = choiceOrder;
    });
  });

  it("shuffle all but last choice", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput>
      <shuffle>
        <choice>cat</choice>
        <choice>dog</choice>
        <choice>monkey</choice>
      </shuffle>
      <choice>none of the above</choice>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>

    <p name="pCat">Selected cat: $_choice1.selected</p>
    <p name="pDog">Selected dog: $_choice2.selected</p>
    <p name="pMonkey">Selected monkey: $_choice3.selected</p>
    <p name="pNone">Selected none of the above: $_choice4.selected</p>
    `,
          requestedVariantIndex: 4,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["cat", "dog", "monkey", "none of the above"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");
    cy.get(cesc("#\\/pCat")).should("have.text", "Selected cat: false");
    cy.get(cesc("#\\/pDog")).should("have.text", "Selected dog: false");
    cy.get(cesc("#\\/pMonkey")).should("have.text", "Selected monkey: false");
    cy.get(cesc("#\\/pNone")).should(
      "have.text",
      "Selected none of the above: false",
    );

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/_choiceinput1"].stateValues.choiceTexts];
      choiceOrder = [
        ...stateVariables["/_shuffle1"].stateValues.componentOrder,
        4,
      ];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(originalChoices[3]).eq(choices[3]);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables["/_choiceinput1"].stateValues.selectedValues).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectedIndices).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(false);
      expect(stateVariables["/_choiceinput1"].stateValues.shuffleOrder).eq(
        false,
      );
      expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
    });

    cy.log("select options in order");

    for (let i = 0; i < 4; i++) {
      cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
        .click()
        .then(() => {
          // make this asynchronous so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Selected value: " + choices[i],
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "Selected index: " + (i + 1),
          );

          cy.get(cesc("#\\/pCat")).should(
            "have.text",
            `Selected cat: ${choiceOrder[i] === 1}`,
          );
          cy.get(cesc("#\\/pDog")).should(
            "have.text",
            `Selected dog: ${choiceOrder[i] === 2}`,
          );
          cy.get(cesc("#\\/pMonkey")).should(
            "have.text",
            `Selected monkey: ${choiceOrder[i] === 3}`,
          );
          cy.get(cesc("#\\/pNone")).should(
            "have.text",
            `Selected none of the above: ${choiceOrder[i] === 4}`,
          );
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedValues,
        ).eqls([choices[i]]);
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedIndices,
        ).eqls([i + 1]);
        expect(stateVariables["/_choice1"].stateValues.selected).eq(
          choiceOrder[i] === 1,
        );
        expect(stateVariables["/_choice2"].stateValues.selected).eq(
          choiceOrder[i] === 2,
        );
        expect(stateVariables["/_choice3"].stateValues.selected).eq(
          choiceOrder[i] === 3,
        );
        expect(stateVariables["/_choice4"].stateValues.selected).eq(
          choiceOrder[i] === 4,
        );
      });
    }
  });

  it("sorted choices", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <choiceinput>
      <sort sortByProp="text">
        <choice>mouse</choice>
        <choice>dog</choice>
        <choice>cat</choice>
        <choice>monkey</choice>
      </sort>
    </choiceinput>

    <p>Selected value: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p>Selected index: <copy prop='selectedindex' target="_choiceinput1" /></p>

    <p name="pMouse">Selected mouse: $_choice1.selected</p>
    <p name="pDog">Selected dog: $_choice2.selected</p>
    <p name="pCat">Selected cat: $_choice3.selected</p>
    <p name="pMonkey">Selected monkey: $_choice4.selected</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let originalChoices = ["mouse", "dog", "cat", "monkey"];
    cy.get(cesc("#\\/_p1")).should("have.text", "Selected value: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Selected index: ");
    cy.get(cesc("#\\/pMouse")).should("have.text", "Selected mouse: false");
    cy.get(cesc("#\\/pDog")).should("have.text", "Selected dog: false");
    cy.get(cesc("#\\/pCat")).should("have.text", "Selected cat: false");
    cy.get(cesc("#\\/pMonkey")).should("have.text", "Selected monkey: false");

    let choices, choiceOrder;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      choices = [...stateVariables["/_choiceinput1"].stateValues.choiceTexts];
      choiceOrder = [3, 2, 4, 1];
      expect(choices.length).eq(4);
      expect(originalChoices.includes(choices[0])).eq(true);
      expect(originalChoices.includes(choices[1])).eq(true);
      expect(originalChoices.includes(choices[2])).eq(true);
      expect(originalChoices.includes(choices[3])).eq(true);
      expect(choices[1]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[0]);
      expect(choices[2]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[0]);
      expect(choices[3]).not.eq(choices[1]);
      expect(choices[3]).not.eq(choices[2]);
      expect(stateVariables["/_choiceinput1"].stateValues.selectedValues).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.selectedIndices).eqls(
        [],
      );
      expect(stateVariables["/_choiceinput1"].stateValues.inline).eq(false);
      expect(stateVariables["/_choiceinput1"].stateValues.shuffleOrder).eq(
        false,
      );
      expect(stateVariables["/_choice1"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice2"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice3"].stateValues.selected).eq(false);
      expect(stateVariables["/_choice4"].stateValues.selected).eq(false);
    });

    cy.log("select options in order");

    for (let i = 0; i < 4; i++) {
      cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`))
        .click()
        .then(() => {
          // make this asynchronous so that choices is populated before line is executed
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "Selected value: " + choices[i],
          );
          cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "Selected index: " + (i + 1),
          );

          cy.get(cesc("#\\/pMouse")).should(
            "have.text",
            `Selected mouse: ${choiceOrder[i] === 1}`,
          );
          cy.get(cesc("#\\/pDog")).should(
            "have.text",
            `Selected dog: ${choiceOrder[i] === 2}`,
          );
          cy.get(cesc("#\\/pCat")).should(
            "have.text",
            `Selected cat: ${choiceOrder[i] === 3}`,
          );
          cy.get(cesc("#\\/pMonkey")).should(
            "have.text",
            `Selected monkey: ${choiceOrder[i] === 4}`,
          );
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedValues,
        ).eqls([choices[i]]);
        expect(
          stateVariables["/_choiceinput1"].stateValues.selectedIndices,
        ).eqls([i + 1]);
        expect(stateVariables["/_choice1"].stateValues.selected).eq(
          choiceOrder[i] === 1,
        );
        expect(stateVariables["/_choice2"].stateValues.selected).eq(
          choiceOrder[i] === 2,
        );
        expect(stateVariables["/_choice3"].stateValues.selected).eq(
          choiceOrder[i] === 3,
        );
        expect(stateVariables["/_choice4"].stateValues.selected).eq(
          choiceOrder[i] === 4,
        );
      });
    }
  });

  it("copy choices", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <choice name="cat0">cat</choice>
    </setup>
    <choiceinput>
      <choice copySource="cat0" name="cat1" />
      <choice name="dog1">dog</choice>
      <choice name="monkey1">monkey</choice>
    </choiceinput>

    <choiceinput>
      <choice copySource="cat1" name="cat2" />
      <choice copySource="dog1" name="dog2" />
      <choice name="monkey2">monkey</choice>
    </choiceinput>

    <p name="pSv1">Selected value 1: <copy prop='selectedvalue' target="_choiceinput1" /></p>
    <p name="pSi1">Selected index 1: <copy prop='selectedindex' target="_choiceinput1" /></p>

    <p name="pSv2">Selected value 2: <copy prop='selectedvalue' target="_choiceinput2" /></p>
    <p name="pSi2">Selected index 2: <copy prop='selectedindex' target="_choiceinput2" /></p>

    <p name="pCat0">Selected cat0: $cat0.selected</p>

    <p name="pCat1">Selected cat1: $cat1.selected</p>
    <p name="pDog1">Selected dog1: $dog1.selected</p>
    <p name="pMonkey1">Selected monkey1: $monkey1.selected</p>

    <p name="pCat2">Selected cat2: $cat2.selected</p>
    <p name="pDog2">Selected dog2: $dog2.selected</p>
    <p name="pMonkey2">Selected monkey2: $monkey2.selected</p>

    `,
        },
        "*",
      );
    });

    let choices = ["cat", "dog", "monkey"];
    cy.get(cesc("#\\/pSv1")).should("have.text", "Selected value 1: ");
    cy.get(cesc("#\\/pSi1")).should("have.text", "Selected index 1: ");
    cy.get(cesc("#\\/pSv2")).should("have.text", "Selected value 2: ");
    cy.get(cesc("#\\/pSi2")).should("have.text", "Selected index 2: ");

    cy.get(cesc("#\\/pCat1")).should("have.text", "Selected cat1: false");
    cy.get(cesc("#\\/pDog1")).should("have.text", "Selected dog1: false");
    cy.get(cesc("#\\/pMonkey1")).should("have.text", "Selected monkey1: false");
    cy.get(cesc("#\\/pCat2")).should("have.text", "Selected cat2: false");
    cy.get(cesc("#\\/pDog2")).should("have.text", "Selected dog2: false");
    cy.get(cesc("#\\/pMonkey2")).should("have.text", "Selected monkey2: false");

    cy.log("select options 1 in order");

    for (let i = 0; i < 3; i++) {
      cy.get(cesc(`#\\/_choiceinput1_choice${i + 1}_input`)).click();

      cy.get(cesc("#\\/pSv1")).should(
        "have.text",
        "Selected value 1: " + choices[i],
      );
      cy.get(cesc("#\\/pSi1")).should(
        "have.text",
        "Selected index 1: " + (i + 1),
      );

      cy.get(cesc("#\\/pSv2")).should("have.text", "Selected value 2: ");
      cy.get(cesc("#\\/pSi2")).should("have.text", "Selected index 2: ");

      cy.get(cesc("#\\/pCat1")).should(
        "have.text",
        `Selected cat1: ${i === 0}`,
      );
      cy.get(cesc("#\\/pDog1")).should(
        "have.text",
        `Selected dog1: ${i === 1}`,
      );
      cy.get(cesc("#\\/pMonkey1")).should(
        "have.text",
        `Selected monkey1: ${i == 2}`,
      );
      cy.get(cesc("#\\/pCat2")).should("have.text", "Selected cat2: false");
      cy.get(cesc("#\\/pDog2")).should("have.text", "Selected dog2: false");
      cy.get(cesc("#\\/pMonkey2")).should(
        "have.text",
        "Selected monkey2: false",
      );
    }

    cy.log("select options 2 in order");

    for (let i = 0; i < 3; i++) {
      cy.get(cesc(`#\\/_choiceinput2_choice${i + 1}_input`)).click();

      cy.get(cesc("#\\/pSv2")).should(
        "have.text",
        "Selected value 2: " + choices[i],
      );
      cy.get(cesc("#\\/pSi2")).should(
        "have.text",
        "Selected index 2: " + (i + 1),
      );

      cy.get(cesc("#\\/pSv1")).should("have.text", "Selected value 1: monkey");
      cy.get(cesc("#\\/pSi1")).should("have.text", "Selected index 1: 3");

      cy.get(cesc("#\\/pCat1")).should("have.text", "Selected cat1: false");
      cy.get(cesc("#\\/pDog1")).should("have.text", "Selected dog1: false");
      cy.get(cesc("#\\/pMonkey1")).should(
        "have.text",
        "Selected monkey1: true",
      );

      cy.get(cesc("#\\/pCat2")).should(
        "have.text",
        `Selected cat2: ${i === 0}`,
      );
      cy.get(cesc("#\\/pDog2")).should(
        "have.text",
        `Selected dog2: ${i === 1}`,
      );
      cy.get(cesc("#\\/pMonkey2")).should(
        "have.text",
        `Selected monkey2: ${i == 2}`,
      );
    }
  });

  it("valueChanged", () => {
    let doenetML = `
    <p><choiceInput name="ci1" inline><choice>Yes</choice><choice>No</choice></choiceInput>
      <text copySource="ci1" name="ci1a" /> <boolean copysource="ci1.valueChanged" name="ci1changed" /></p>
    <p><choiceInput name="ci2" preselectChoice="2"><choice>Yes</choice><choice>No</choice></choiceInput>
      <text copySource="ci2" name="ci2a" /> <boolean copysource="ci2.valueChanged" name="ci2changed" /></p>
    <p><choiceInput name="ci3" bindValueTo="$ci1.values" ><choice>Yes</choice><choice>No</choice></choiceInput>
      <text copySource="ci3" name="ci3a" /> <boolean copysource="ci3.valueChanged" name="ci3changed" /></p>
    <p><choiceInput name="ci4" inline bindValueTo="$ci2.values"><choice>Yes</choice><choice>No</choice></choiceInput
      <text copySource="ci4" name="ci4a" /> <boolean copysource="ci4.valueChanged" name="ci4changed" /></p>

    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ci1changed")).should("have.text", "false");
    cy.get(cesc2("#/ci2changed")).should("have.text", "false");
    cy.get(cesc2("#/ci3changed")).should("have.text", "false");
    cy.get(cesc2("#/ci4changed")).should("have.text", "false");

    cy.get(cesc2("#/ci1a")).should("have.text", "");
    cy.get(cesc2("#/ci2a")).should("have.text", "No");
    cy.get(cesc2("#/ci3a")).should("have.text", "");
    cy.get(cesc2("#/ci4a")).should("have.text", "No");

    cy.log("selecting from first and third marks only them as changed");

    cy.get(cesc2("#/ci1")).select("Yes");
    cy.get(cesc2("#/ci2") + "_choice1_input").click();

    cy.get(cesc2("#/ci1a")).should("have.text", "Yes");
    cy.get(cesc2("#/ci2a")).should("have.text", "Yes");
    cy.get(cesc2("#/ci3a")).should("have.text", "Yes");
    cy.get(cesc2("#/ci4a")).should("have.text", "Yes");

    cy.get(cesc2("#/ci1changed")).should("have.text", "true");
    cy.get(cesc2("#/ci2changed")).should("have.text", "true");
    cy.get(cesc2("#/ci3changed")).should("have.text", "false");
    cy.get(cesc2("#/ci4changed")).should("have.text", "false");

    // TODO: cannot change choiceInputs from bound values, so can't change third and fourth
    // Should we add this features?
  });

  it("label", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p><choiceInput name="ci1" inline><label>Select an option</label><choice>Yes</choice><choice>No</choice></choiceInput>
      <choiceInput copySource="ci1" name="ci1a" /> </p>
    <p><choiceInput name="ci2"><choice>Yes</choice><choice>No</choice><label>Select another option</label></choiceInput>
      <choiceInput copySource="ci2" name="ci2a" /> </p>

    <p><updateValue target="_label1.hide" newValue="!$_label1.hide" type="boolean" name="toggleLabels"><label>Toggle labels</label></updateValue>
    <updateValue triggerWith="toggleLabels" target="_label2.hide" newValue="!$_label2.hide" type="boolean" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ci1-label")).should("contain.text", "Select an option");
    cy.get(cesc2("#/ci2-label")).should(
      "contain.text",
      "Select another option",
    );

    cy.log("hide labels");
    cy.get(cesc2("#/toggleLabels")).click();
    cy.get(cesc2("#/ci1-label")).should("not.contain.text", "Select an option");
    cy.get(cesc2("#/ci2-label")).should(
      "not.contain.text",
      "Select another option",
    );

    cy.log("show labels again");
    cy.get(cesc2("#/toggleLabels")).click();
    cy.get(cesc2("#/ci1-label")).should("contain.text", "Select an option");
    cy.get(cesc2("#/ci2-label")).should(
      "contain.text",
      "Select another option",
    );
  });

  it("change choice input from copied value, text", () => {
    let doenetML = `
  <choiceinput name="ci">
    <choice>yes</choice>
    <choice>no</choice>
    <choice>maybe</choice>
  </choiceinput>
  
  <p>Change from text of ci: <textinput name="fromTextCi"><text copySource="ci" /></textinput></p>
  <p>Change from text of ci.selectedValue: <textinput name="fromTextSelectedValue"><text copySource="ci.selectedValue" /></textinput></p>
  <p>Change from macro of &dollar;ci: <textinput name="fromMacroCi">$ci</textinput></p>
  <p>Change from macro of &dollar;ci.selectedValue: <textinput name="fromMacroSelectedValue">$ci.selectedValue</textinput></p>
  <p>Change from math of ci.selectedIndices: <mathinput name="fromMathSelectedIndices"><math copySource="ci.selectedIndices" /></mathinput></p>
  <p>Change from math of ci.selectedIndex: <mathinput name="fromMathSelectedIndex"><math copySource="ci.selectedIndex" /></mathinput></p>
  <p>Change from macro of &dollar;ci.selectedIndices: <mathinput name="fromMacroSelectedIndices">$ci.selectedIndices</mathinput></p>
  <p>Change from macro of &dollar;ci.selectedIndex: <mathinput name="fromMacroSelectedIndex">$ci.selectedIndex</mathinput></p>

  <p name="p">Selected value: <text copySource="ci" name="selectedValue" /></p>
  <booleaninput name="bi" /> <boolean name="b" copySource="bi" />
    `;

    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });

    cy.get(cesc2("#/p")).should("have.text", "Selected value: ");

    cy.log("typing in wrong value doesn't do anything");
    cy.get(cesc2("#/fromTextCi") + "_input").type("nothing{enter}");
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/p")).should("have.text", "Selected value: ");

    cy.log("Select value from text ci");
    cy.get(cesc2("#/fromTextCi") + "_input").type("maybe{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected value: maybe");

    cy.log("Change value from text ci.selectedValue");
    cy.get(cesc2("#/fromTextSelectedValue") + "_input")
      .clear()
      .type("no{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected value: no");

    cy.log("Invalid value into text ci.selectedValue does nothing");
    cy.get(cesc2("#/fromTextSelectedValue") + "_input")
      .clear()
      .type("bad{enter}");
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/p")).should("have.text", "Selected value: no");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/p")).should("have.text", "Selected value: ");

    cy.log("Cannot change value from macros after starting afresh");
    cy.get(cesc2("#/fromMacroCi") + "_input")
      .clear()
      .type("yes{enter}");
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/p")).should("have.text", "Selected value: ");
    cy.get(cesc2("#/fromMacroCi") + "_input").should("have.value", "yes");

    cy.get(cesc2("#/fromMacroSelectedValue") + "_input")
      .clear()
      .type("no{enter}");
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/p")).should("have.text", "Selected value: ");
    cy.get(cesc2("#/fromMacroSelectedValue") + "_input").should(
      "have.value",
      "no",
    );
    cy.get(cesc2("#/fromMacroCi") + "_input").should("have.value", "yes");

    cy.log(
      "Change value from text ci.selectedValue works after starting afresh",
    );
    cy.get(cesc2("#/fromTextSelectedValue") + "_input")
      .clear()
      .type("maybe{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected value: maybe");

    cy.log("Textinputs from macros are now attached");
    cy.get(cesc2("#/fromMacroCi") + "_input").should("have.value", "maybe");
    cy.get(cesc2("#/fromMacroSelectedValue") + "_input").should(
      "have.value",
      "maybe",
    );

    cy.log("We can now change from macros");
    cy.get(cesc2("#/fromMacroCi") + "_input")
      .clear()
      .type("yes{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected value: yes");

    cy.get(cesc2("#/fromMacroSelectedValue") + "_input")
      .clear()
      .type("no{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected value: no");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/p")).should("have.text", "Selected value: ");

    cy.log(
      "Change value from math ci.selectedIndices works after starting afresh",
    );
    cy.get(cesc2("#/fromMathSelectedIndices") + " textarea").type("3{enter}", {
      force: true,
    });
    cy.get(cesc2("#/p")).should("have.text", "Selected value: maybe");

    cy.log(
      "Invalid value into from math ci.selectedIndex deselects all options",
    );
    cy.get(cesc2("#/fromMathSelectedIndex") + " textarea").type(
      "{end}{backspace}4{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p")).should("have.text", "Selected value: ");

    cy.log("Enter valid value into from math ci.selectedIndex");
    cy.get(cesc2("#/fromMathSelectedIndex") + " textarea").type(
      "{end}{backspace}3{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p")).should("have.text", "Selected value: maybe");

    cy.log("Enter value into from macro ci.selectedIndices");
    cy.get(cesc2("#/fromMacroSelectedIndices") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p")).should("have.text", "Selected value: no");

    cy.log("Enter value into from macro ci.selectedIndex");
    cy.get(cesc2("#/fromMacroSelectedIndex") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p")).should("have.text", "Selected value: yes");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/p")).should("have.text", "Selected value: ");

    cy.log("Cannot change value from macros after starting afresh");

    cy.get(cesc2("#/fromMacroSelectedIndices") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/p")).should("have.text", "Selected value: ");

    cy.log("Enter value into from macro ci.selectedIndex");
    cy.get(cesc2("#/fromMacroSelectedIndex") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/p")).should("have.text", "Selected value: ");

    cy.log(
      "can add value into from math ci.selectedIndex even after starting afresh",
    );
    cy.get(cesc2("#/fromMathSelectedIndex") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p")).should("have.text", "Selected value: no");
  });

  it("change choice input from copied value, text, select multiple", () => {
    let doenetML = `
  <choiceinput name="ci" selectMultiple>
    <choice>yes</choice>
    <choice>no</choice>
    <choice>maybe</choice>
  </choiceinput>
  
  <p>Change from text of ci.selectedValue: <textinput name="fromTextSelectedValue"><text copySource="ci.selectedValue" /></textinput></p>
  <p>Change from text of ci.selectedValue2: <textinput name="fromTextSelectedValue2"><text copySource="ci.selectedValue2" /></textinput></p>
  <p>Change from macro of &dollar;ci.selectedValue: <textinput name="fromMacroSelectedValue">$ci.selectedValue</textinput></p>
  <p>Change from macro of &dollar;ci.selectedValue2: <textinput name="fromMacroSelectedValue2">$ci.selectedValue2</textinput></p>
  <p>Change from math of ci.selectedIndex: <mathinput name="fromMathSelectedIndex"><math copySource="ci.selectedIndex" /></mathinput></p>
  <p>Change from math of ci.selectedIndex2: <mathinput name="fromMathSelectedIndex2"><math copySource="ci.selectedIndex2" /></mathinput></p>
  <p>Change from macro of &dollar;ci.selectedIndex: <mathinput name="fromMacroSelectedIndex">$ci.selectedIndex</mathinput></p>
  <p>Change from macro of &dollar;ci.selectedIndex2: <mathinput name="fromMacroSelectedIndex2">$ci.selectedIndex2</mathinput></p>

  <p name="p">Selected values: <aslist>$ci.selectedValues</aslist></p>
  <booleaninput name="bi" /> <boolean name="b" copySource="bi" />
    `;

    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });

    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log("typing in wrong value doesn't do anything");
    cy.get(cesc2("#/fromTextSelectedValue") + "_input").type("nothing{enter}");
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log("Select value from text ci.selectedValue");
    cy.get(cesc2("#/fromTextSelectedValue") + "_input").type("maybe{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: maybe");

    cy.log("Add second value from text ci.selectedValue2");
    cy.get(cesc2("#/fromTextSelectedValue2") + "_input")
      .clear()
      .type("no{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: no, maybe");

    cy.log("Invalid value into text ci.selectedValue does nothing");
    cy.get(cesc2("#/fromTextSelectedValue") + "_input")
      .clear()
      .type("bad{enter}");
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: no, maybe");

    cy.log(
      "Repeat first value from text ci.selectedValue2 reduces to one value",
    );
    cy.get(cesc2("#/fromTextSelectedValue2") + "_input")
      .clear()
      .type("no{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: no");

    cy.log("Add second value from text ci.selectedValue2");
    cy.get(cesc2("#/fromTextSelectedValue2") + "_input")
      .clear()
      .type("yes{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: yes, no");

    cy.log(
      "Repeat second value from text ci.selectedValue reduces to one value",
    );
    cy.get(cesc2("#/fromTextSelectedValue") + "_input")
      .clear()
      .type("no{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: no");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log("Cannot change value from macros after starting afresh");
    cy.get(cesc2("#/fromMacroSelectedValue") + "_input")
      .clear()
      .type("yes{enter}");
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");
    cy.get(cesc2("#/fromMacroSelectedValue") + "_input").should(
      "have.value",
      "yes",
    );

    cy.get(cesc2("#/fromMacroSelectedValue2") + "_input")
      .clear()
      .type("no{enter}");
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");
    cy.get(cesc2("#/fromMacroSelectedValue2") + "_input").should(
      "have.value",
      "no",
    );
    cy.get(cesc2("#/fromMacroSelectedValue") + "_input").should(
      "have.value",
      "yes",
    );

    cy.log(
      "Change value from text ci.selectedValue2 works after starting afresh",
    );
    cy.get(cesc2("#/fromTextSelectedValue2") + "_input")
      .clear()
      .type("maybe{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: maybe");

    cy.log("Textinput from first macro is now attached");
    cy.get(cesc2("#/fromMacroSelectedValue") + "_input").should(
      "have.value",
      "maybe",
    );
    cy.get(cesc2("#/fromMacroSelectedValue2") + "_input").should(
      "have.value",
      "no",
    );
    cy.log("Add second value from text ci.selectedValue2");
    cy.get(cesc2("#/fromTextSelectedValue2") + "_input")
      .clear()
      .type("yes{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: yes, maybe");
    cy.log("Textinputs from both macros are now attached");
    cy.get(cesc2("#/fromMacroSelectedValue") + "_input").should(
      "have.value",
      "yes",
    );
    cy.get(cesc2("#/fromMacroSelectedValue2") + "_input").should(
      "have.value",
      "maybe",
    );

    cy.log("We can now change from macros");
    cy.get(cesc2("#/fromMacroSelectedValue") + "_input")
      .clear()
      .type("no{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: no, maybe");

    cy.get(cesc2("#/fromMacroSelectedValue2") + "_input")
      .clear()
      .type("yes{enter}");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: yes, no");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log(
      "Change value from math ci.selectedIndex works after starting afresh",
    );
    cy.get(cesc2("#/fromMathSelectedIndex") + " textarea").type("3{enter}", {
      force: true,
    });
    cy.get(cesc2("#/p")).should("have.text", "Selected values: maybe");

    cy.log("Invalid value into from math ci.selectedIndex is reverted");
    cy.get(cesc2("#/fromMathSelectedIndex") + " textarea").type(
      "{end}{backspace}4{enter}",
      {
        force: true,
      },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: maybe");

    cy.log("Enter valid value into from math ci.selectedIndex2");
    cy.get(cesc2("#/fromMathSelectedIndex2") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p")).should("have.text", "Selected values: yes, maybe");

    cy.log("Enter value into from macro ci.selectedIndex");
    cy.get(cesc2("#/fromMacroSelectedIndex") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p")).should("have.text", "Selected values: no, maybe");

    cy.log("Enter value into from macro ci.selectedIndex2");
    cy.get(cesc2("#/fromMacroSelectedIndex2") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p")).should("have.text", "Selected values: yes, no");

    cy.log(
      "Enter repeated value into from macro ci.selectedIndex2 selects just one",
    );
    cy.get(cesc2("#/fromMacroSelectedIndex2") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p")).should("have.text", "Selected values: yes");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log("Cannot change value from macros after starting afresh");

    cy.get(cesc2("#/fromMacroSelectedIndex") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log("Enter value into from macro ci.selectedIndex2");
    cy.get(cesc2("#/fromMacroSelectedIndex2") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log(
      "can add value into from math ci.selectedIndex2 even after starting afresh",
    );
    cy.get(cesc2("#/fromMathSelectedIndex2") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p")).should("have.text", "Selected values: no");
  });

  it("change choice input from copied value, math", () => {
    let doenetML = `
  <choiceinput name="ci">
    <choice><math>x</math></choice>
    <choice><math>y</math></choice>
    <choice><math>z</math></choice>
  </choiceinput>
  
  <p>Change from math of ci: <mathinput name="fromMathCi"><math copySource="ci" /></mathinput></p>
  <p>Change from math of ci.selectedValue: <mathinput name="fromMathSelectedValue"><math copySource="ci.selectedValue" /></mathinput></p>
  <p>Change from macro of &dollar;ci: <mathinput name="fromMacroCi">$ci</mathinput></p>
  <p>Change from macro of &dollar;ci.selectedValue: <mathinput name="fromMacroSelectedValue">$ci.selectedValue</mathinput></p>
  <p>Change from math of ci.selectedIndices: <mathinput name="fromMathSelectedIndices"><math copySource="ci.selectedIndices" /></mathinput></p>
  <p>Change from math of ci.selectedIndex: <mathinput name="fromMathSelectedIndex"><math copySource="ci.selectedIndex" /></mathinput></p>
  <p>Change from macro of &dollar;ci.selectedIndices: <mathinput name="fromMacroSelectedIndices">$ci.selectedIndices</mathinput></p>
  <p>Change from macro of &dollar;ci.selectedIndex: <mathinput name="fromMacroSelectedIndex">$ci.selectedIndex</mathinput></p>

  <p name="p">Selected value: <math copySource="ci" name="selectedValue" /></p>
  <booleaninput name="bi" /> <boolean name="b" copySource="bi" />
    `;

    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });

    cy.get(cesc2("#/selectedValue") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.log("typing in wrong value doesn't do anything");
    cy.get(cesc2("#/fromMathCi") + " textarea").type("a{enter}", {
      force: true,
    });
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.log("Select value from math ci");
    cy.get(cesc2("#/fromMathCi") + " textarea").type("z{enter}", {
      force: true,
    });
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should("have.text", "z");

    cy.log("Change value from math ci.selectedValue");
    cy.get(cesc2("#/fromMathSelectedValue") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should("have.text", "y");

    cy.log("Invalid value into math ci.selectedValue does nothing");
    cy.get(cesc2("#/fromMathSelectedValue") + " textarea").type(
      "{end}{backspace}bad{enter}",
      { force: true },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should("have.text", "y");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.log("Cannot change value from macros after starting afresh");
    cy.get(cesc2("#/fromMacroCi") + " textarea").type("x{enter}", {
      force: true,
    });
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc2(`#/fromMacroCi`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("x");
      });

    cy.get(cesc2("#/fromMacroSelectedValue") + " textarea").type("y{enter}", {
      force: true,
    });
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc2(`#/fromMacroCi`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("x");
      });
    cy.get(cesc2(`#/fromMacroSelectedValue`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("y");
      });

    cy.log(
      "Change value from math ci.selectedValue works after starting afresh",
    );
    cy.get(cesc2("#/fromMathSelectedValue") + " textarea").type("z{enter}", {
      force: true,
    });
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should("have.text", "z");

    cy.log("Mathinputs from macros are now attached");
    cy.get(cesc2(`#/fromMacroCi`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc2(`#/fromMacroSelectedValue`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });

    cy.log("We can now change from macros");
    cy.get(cesc2("#/fromMacroCi") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should("have.text", "x");

    cy.get(cesc2("#/fromMacroSelectedValue") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should("have.text", "y");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.log(
      "Change value from math ci.selectedIndices works after starting afresh",
    );
    cy.get(cesc2("#/fromMathSelectedIndices") + " textarea").type("3{enter}", {
      force: true,
    });
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should("have.text", "z");

    cy.log(
      "Invalid value into from math ci.selectedIndex deselects all options",
    );
    cy.get(cesc2("#/fromMathSelectedIndex") + " textarea").type(
      "{end}{backspace}4{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should(
      "contain.text",
      "\uff3f",
    );
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.log("Enter valid value into from math ci.selectedIndex");
    cy.get(cesc2("#/fromMathSelectedIndex") + " textarea").type(
      "{end}{backspace}3{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should("have.text", "z");

    cy.log("Enter value into from macro ci.selectedIndices");
    cy.get(cesc2("#/fromMacroSelectedIndices") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should("have.text", "y");

    cy.log("Enter value into from macro ci.selectedIndex");
    cy.get(cesc2("#/fromMacroSelectedIndex") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should("have.text", "x");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.log("Cannot change value from macros after starting afresh");

    cy.get(cesc2("#/fromMacroSelectedIndices") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.log("Enter value into from macro ci.selectedIndex");
    cy.get(cesc2("#/fromMacroSelectedIndex") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.log(
      "can add value into from math ci.selectedIndex even after starting afresh",
    );
    cy.get(cesc2("#/fromMathSelectedIndex") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/selectedValue") + " .mjx-mrow").should("have.text", "y");
  });

  it("change choice input from copied value, math, select multiple", () => {
    let doenetML = `
  <choiceinput name="ci" selectMultiple>
    <choice><math>x</math></choice>
    <choice><math>y</math></choice>
    <choice><math>z</math></choice>
  </choiceinput>
  
  <p>Change from math of ci.selectedValue: <mathinput name="fromMathSelectedValue"><math copySource="ci.selectedValue" /></mathinput></p>
  <p>Change from math of ci.selectedValue2: <mathinput name="fromMathSelectedValue2"><math copySource="ci.selectedValue2" /></mathinput></p>
  <p>Change from macro of &dollar;ci.selectedValue: <mathinput name="fromMacroSelectedValue">$ci.selectedValue</mathinput></p>
  <p>Change from macro of &dollar;ci.selectedValue2: <mathinput name="fromMacroSelectedValue2">$ci.selectedValue2</mathinput></p>
  <p>Change from math of ci.selectedIndex: <mathinput name="fromMathSelectedIndex"><math copySource="ci.selectedIndex" /></mathinput></p>
  <p>Change from math of ci.selectedIndex2: <mathinput name="fromMathSelectedIndex2"><math copySource="ci.selectedIndex2" /></mathinput></p>
  <p>Change from macro of &dollar;ci.selectedIndex: <mathinput name="fromMacroSelectedIndex">$ci.selectedIndex</mathinput></p>
  <p>Change from macro of &dollar;ci.selectedIndex2: <mathinput name="fromMacroSelectedIndex2">$ci.selectedIndex2</mathinput></p>

  <p name="p">Selected values: <aslist>$ci.selectedValues</aslist></p>
  <booleaninput name="bi" /> <boolean name="b" copySource="bi" />
    `;

    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });

    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log("typing in wrong value doesn't do anything");
    cy.get(cesc2("#/fromMathSelectedValue") + " textarea").type(
      "nothing{enter}",
      { force: true },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log("Select value from math ci.selectedValue");
    cy.get(cesc2("#/fromMathSelectedValue") + " textarea").type("z{enter}", {
      force: true,
    });
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "z");

    cy.log("Add second value from math ci.selectedValue2");
    cy.get(cesc2("#/fromMathSelectedValue2") + " textarea").type("y{enter}", {
      force: true,
    });
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "yz");

    cy.log("Invalid value into math ci.selectedValue does nothing");
    cy.get(cesc2("#/fromMathSelectedValue") + " textarea").type("bad{enter}", {
      force: true,
    });
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "yz");

    cy.log(
      "Repeat first value from math ci.selectedValue2 reduces to one value",
    );
    cy.get(cesc2("#/fromMathSelectedValue2") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "y");

    cy.log("Add second value from math ci.selectedValue2");
    cy.get(cesc2("#/fromMathSelectedValue2") + " textarea").type("x{enter}"),
      { force: true };
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "xy");

    cy.log(
      "Repeat second value from math ci.selectedValue reduces to one value",
    );
    cy.get(cesc2("#/fromMathSelectedValue") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "y");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log("Cannot change value from macros after starting afresh");
    cy.get(cesc2("#/fromMacroSelectedValue") + " textarea").type("x{enter}", {
      force: true,
    });
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");
    cy.get(cesc2(`#/fromMacroSelectedValue`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("x");
      });

    cy.get(cesc2("#/fromMacroSelectedValue2") + " textarea").type("y{enter}", {
      force: true,
    });
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");
    cy.get(cesc2(`#/fromMacroSelectedValue2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("y");
      });
    cy.get(cesc2(`#/fromMacroSelectedValue`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("x");
      });

    cy.log(
      "Change value from math ci.selectedValue2 works after starting afresh",
    );
    cy.get(cesc2("#/fromMathSelectedValue2") + " textarea").type("z{enter}", {
      force: true,
    });
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "z");

    cy.log("Mathinput from first macro is now attached");
    cy.get(cesc2(`#/fromMacroSelectedValue`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc2(`#/fromMacroSelectedValue2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("y");
      });

    cy.log("Add second value from math ci.selectedValue2");
    cy.get(cesc2("#/fromMathSelectedValue2") + " textarea").type("x{enter}", {
      force: true,
    });
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "xz");
    cy.log("Mathinputs from both macros are now attached");
    cy.get(cesc2(`#/fromMacroSelectedValue`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("x");
      });
    cy.get(cesc2(`#/fromMacroSelectedValue2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });

    cy.log("We can now change from macros");
    cy.get(cesc2("#/fromMacroSelectedValue") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "yz");

    cy.get(cesc2("#/fromMacroSelectedValue2") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "xy");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log(
      "Change value from math ci.selectedIndex works after starting afresh",
    );
    cy.get(cesc2("#/fromMathSelectedIndex") + " textarea").type("3{enter}", {
      force: true,
    });
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "z");

    cy.log("Invalid value into from math ci.selectedIndex is reverted");
    cy.get(cesc2("#/fromMathSelectedIndex") + " textarea").type(
      "{end}{backspace}4{enter}",
      {
        force: true,
      },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "z");

    cy.log("Enter valid value into from math ci.selectedIndex2");
    cy.get(cesc2("#/fromMathSelectedIndex2") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "xz");

    cy.log("Enter value into from macro ci.selectedIndex");
    cy.get(cesc2("#/fromMacroSelectedIndex") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "yz");

    cy.log("Enter value into from macro ci.selectedIndex2");
    cy.get(cesc2("#/fromMacroSelectedIndex2") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "xy");

    cy.log(
      "Enter repeated value into from macro ci.selectedIndex2 selects just one",
    );
    cy.get(cesc2("#/fromMacroSelectedIndex2") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "x");

    cy.reload();
    cy.window().then(async (win) => {
      win.postMessage({ doenetML }, "*");
    });
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log("Cannot change value from macros after starting afresh");

    cy.get(cesc2("#/fromMacroSelectedIndex") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log("Enter value into from macro ci.selectedIndex2");
    cy.get(cesc2("#/fromMacroSelectedIndex2") + " textarea").type(
      "{end}{backspace}1{enter}",
      {
        force: true,
      },
    );
    // since nothing will change, wait for core to respond to booleaninput change
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");
    cy.get(cesc2("#/p")).should("have.text", "Selected values: ");

    cy.log(
      "can add value into from math ci.selectedIndex2 even after starting afresh",
    );
    cy.get(cesc2("#/fromMathSelectedIndex2") + " textarea").type(
      "{end}{backspace}2{enter}",
      {
        force: true,
      },
    );
    cy.get(cesc2("#/p") + " .mjx-mrow").should("have.text", "y");
  });
});
