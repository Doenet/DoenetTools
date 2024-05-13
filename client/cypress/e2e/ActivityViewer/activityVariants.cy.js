import { numberToLetters } from "../../../src/Core/utils/sequence";
import { cesc, cesc2 } from "../../../src/_utils/url";

describe("Activity variants tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("Variants from single page, no variant control in page", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML;

    let attemptNumber = 0;

    for (let ind = 1; ind <= 200; ind += 97) {
      cy.window().then(async (win) => {
        attemptNumber++;
        doenetML = `
        <document type="activity">
          <page>
            <text>${attemptNumber}</text>
            Enter <selectFromSequence from="1" to="1000" assignNames="n" />:
            <answer>$n</answer>
          </page>
        </document>
        `;
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
            attemptNumber,
          },
          "*",
        );
        cy.get(cesc("#\\/_text1")).should("have.text", `${attemptNumber}`);
      });

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 100) + 1);
        expect(activityData.variantsByPage).eqls([((ind - 1) % 100) + 1]);

        let stateVariables = await win.returnAllStateVariables1();
        let n = stateVariables["/n"].stateValues.value;

        expect(n).gte(1);
        expect(n).lte(1000);

        let mathinputName = cesc2(
          stateVariables["/_answer1"].stateValues.inputChildren[0]
            .componentName,
        );
        let mathinputAnchor = "#" + mathinputName + " textarea";
        let mathinputEditiableFieldAnchor =
          "#" + mathinputName + " .mq-editable-field";
        let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
        let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
        let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

        cy.get(mathinputAnchor).type(`${n}{enter}`, { force: true });
        cy.get(mathinputCorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        });

        cy.wait(2000); // wait for 1 second debounce

        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML,
              requestedVariantIndex: ind,
              attemptNumber,
            },
            "*",
          );
          cy.get(cesc("#\\/_text1")).should("have.text", `${attemptNumber}`);
        });

        // wait until core is loaded
        cy.waitUntil(() =>
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            return stateVariables["/_answer1"];
          }),
        );

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        });

        cy.get(mathinputAnchor).type(`{end}1`, { force: true });
        cy.get(mathinputSubmitAnchor).click();
        cy.get(mathinputIncorrectAnchor).should("be.visible");

        cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
        cy.get(mathinputSubmitAnchor).click();
        cy.get(mathinputCorrectAnchor).should("be.visible");
      });
    }
  });

  it("Variants from single page, specified variants in page", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <document type="activity">
      <page>
        <variantControl numVariants="3" variantNames="red blue green" />
        <text>a</text>
        Enter 
        <select assignNames="color" >
          <option selectForVariants="red">red</option>
          <option selectForVariants="blue">blue</option>
          <option selectForVariants="green">green</option>
        </select>
        :
        <answer type="text">$color</answer>
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 4; ind++) {
      if (ind > 1) {
        cy.reload();
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      cy.get(cesc("#\\/_text1")).should("have.text", "a");

      let color = ["red", "blue", "green"][(ind - 1) % 3];

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 3) + 1);
        expect(activityData.variantsByPage).eqls([((ind - 1) % 3) + 1]);

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/color"].replacements[0]).eq(color);

        let textinputName = cesc2(
          stateVariables["/_answer1"].stateValues.inputChildren[0]
            .componentName,
        );
        let textinputAnchor = "#" + textinputName + "_input";
        let textinputSubmitAnchor = "#" + textinputName + "_submit";
        let textinputCorrectAnchor = "#" + textinputName + "_correct";
        let textinputIncorrectAnchor = "#" + textinputName + "_incorrect";

        cy.get(textinputAnchor).type(`${color}{enter}`);
        cy.get(textinputCorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        });

        cy.wait(2000); // wait for 1 second debounce

        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML,
              requestedVariantIndex: 1,
            },
            "*",
          );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        // wait until core is loaded
        cy.waitUntil(() =>
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            return stateVariables["/_answer1"];
          }),
        );

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        });

        cy.get(textinputAnchor).type(`{end}x`);
        cy.get(textinputSubmitAnchor).click();
        cy.get(textinputIncorrectAnchor).should("be.visible");

        cy.get(textinputAnchor).type(`{end}{backspace}`);
        cy.get(textinputSubmitAnchor).click();
        cy.get(textinputCorrectAnchor).should("be.visible");
      });
    }
  });

  it("Variants from single page, specified variants in problem in page", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <document type="activity">
      <page>
        <problem>
        <variantControl uniqueVariants />
        <text>a</text>
        Enter 
        <select assignNames="color" >
          <option>red</option>
          <option>blue</option>
          <option>green</option>
        </select>
        :
        <answer type="text">$color</answer>
        </problem>
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 4; ind++) {
      if (ind > 1) {
        cy.reload();
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      cy.get(cesc("#\\/_text1")).should("have.text", "a");

      let color = ["red", "blue", "green"][(ind - 1) % 3];

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 3) + 1);
        expect(activityData.variantsByPage).eqls([((ind - 1) % 3) + 1]);

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/color"].replacements[0]).eq(color);

        let textinputName = cesc2(
          stateVariables["/_answer1"].stateValues.inputChildren[0]
            .componentName,
        );
        let textinputAnchor = "#" + textinputName + "_input";
        let textinputSubmitAnchor = "#" + textinputName + "_submit";
        let textinputCorrectAnchor = "#" + textinputName + "_correct";
        let textinputIncorrectAnchor = "#" + textinputName + "_incorrect";

        cy.get(textinputAnchor).type(`${color}{enter}`);
        cy.get(textinputCorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        });

        cy.wait(2000); // wait for 1 second debounce

        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML,
              requestedVariantIndex: 1,
            },
            "*",
          );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a");

        // wait until core is loaded
        cy.waitUntil(() =>
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            return stateVariables["/_answer1"];
          }),
        );

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        });

        cy.get(textinputAnchor).type(`{end}x`);
        cy.get(textinputSubmitAnchor).click();
        cy.get(textinputIncorrectAnchor).should("be.visible");

        cy.get(textinputAnchor).type(`{end}{backspace}`);
        cy.get(textinputSubmitAnchor).click();
        cy.get(textinputCorrectAnchor).should("be.visible");
      });
    }
  });

  it("Two pages few variants, page variants enumerated", () => {
    let doenetML = `
    <document type="activity">
      <page>
        <text>a</text>
        <variantControl uniqueVariants />
        <selectFromSequence from="1" to="2" assignNames="n" />
      </page>
      <page>
        <text>b</text>
        <variantControl uniqueVariants />
        <selectFromSequence type="letters" from="a" to="c" assignNames="l" />
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 2000; ind += 371) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 6) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(
          ((activityData.variantIndex - 1) % 2) + 1,
        );
        expect(activityData.variantsByPage[1]).eq(
          ((activityData.variantIndex - 1) % 3) + 1,
        );

        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(
          activityData.variantsByPage[0],
        );

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(
            numberToLetters(activityData.variantsByPage[1], true),
          );
        });
      });
    }
  });

  it("Two pages, numVariants not specified, defaults to 1000", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <document type="activity">
      <page>
        <text>a</text>
        Enter <selectFromSequence from="1" to="1000" assignNames="n" />:
        <answer>$n</answer>
      </page>
      <page>
        <text>b</text>
        <variantControl uniqueVariants />
        Enter <selectFromSequence type="letters" from="a" to="z" assignNames="l" />:
        <answer type="text">$l</answer>
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 2000; ind += 970) {
      if (ind > 1) {
        cy.reload();
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 1000) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).gte(1);
        expect(activityData.variantsByPage[0]).lte(100);
        expect(activityData.variantsByPage[1]).gte(1);
        expect(activityData.variantsByPage[1]).lte(26);

        let l = numberToLetters(activityData.variantsByPage[1], true);

        let stateVariables1 = await win.returnAllStateVariables1();
        let n = stateVariables1["/n"].stateValues.value;

        expect(n).gte(1);
        expect(n).lte(1000);

        let mathinputName = cesc2(
          stateVariables1["/_answer1"].stateValues.inputChildren[0]
            .componentName,
        );
        let mathinputAnchor = "#page1" + mathinputName + " textarea";
        let mathinputEditiableFieldAnchor =
          "#page1" + mathinputName + " .mq-editable-field";
        let mathinputSubmitAnchor = "#page1" + mathinputName + "_submit";
        let mathinputCorrectAnchor = "#page1" + mathinputName + "_correct";
        let mathinputIncorrectAnchor = "#page1" + mathinputName + "_incorrect";

        cy.get(mathinputAnchor).type(`${n}{enter}`, { force: true });
        cy.get(mathinputCorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables1 = await win.returnAllStateVariables1();
          expect(stateVariables1["/_answer1"].stateValues.creditAchieved).eq(1);
        });

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(l);

          let textinputName = cesc2(
            stateVariables2["/_answer1"].stateValues.inputChildren[0]
              .componentName,
          );
          let textinputAnchor = "#page2" + textinputName + "_input";
          let textinputSubmitAnchor = "#page2" + textinputName + "_submit";
          let textinputCorrectAnchor = "#page2" + textinputName + "_correct";
          let textinputIncorrectAnchor =
            "#page2" + textinputName + "_incorrect";

          cy.get(textinputAnchor).type(`${l}{enter}`);
          cy.get(textinputCorrectAnchor).should("be.visible");

          cy.window().then(async (win) => {
            let stateVariables2 = await win.returnAllStateVariables2();
            expect(stateVariables2["/_answer1"].stateValues.creditAchieved).eq(
              1,
            );
          });

          cy.get("[data-test=previous]").click();

          cy.get(mathinputEditiableFieldAnchor).should("have.text", `${n}`);
          cy.get(mathinputCorrectAnchor).should("be.visible");

          cy.get("[data-test=next]").click();

          cy.get(textinputAnchor).should("have.value", l);
          cy.get(textinputCorrectAnchor).should("be.visible");

          cy.wait(2000); // wait for 1 second debounce

          cy.reload();

          cy.window().then(async (win) => {
            win.postMessage(
              {
                doenetML,
                requestedVariantIndex: 1,
              },
              "*",
            );
          });

          cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

          // wait until core is loaded
          cy.waitUntil(() =>
            cy.window().then(async (win) => {
              let stateVariables2 = await win.returnAllStateVariables2();
              return stateVariables2["/_answer1"];
            }),
          );

          cy.window().then(async (win) => {
            let stateVariables2 = await win.returnAllStateVariables2();
            expect(stateVariables2["/_answer1"].stateValues.creditAchieved).eq(
              1,
            );
          });

          cy.get(textinputAnchor).type(`{end}X`);
          cy.get(textinputSubmitAnchor).click();
          cy.get(textinputIncorrectAnchor).should("be.visible");

          cy.window().then(async (win) => {
            let stateVariables2 = await win.returnAllStateVariables2();
            expect(stateVariables2["/_answer1"].stateValues.creditAchieved).eq(
              0,
            );
          });

          cy.get("[data-test=previous]").click();

          cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

          // wait until core is loaded
          cy.waitUntil(() =>
            cy.window().then(async (win) => {
              let stateVariables1 = await win.returnAllStateVariables1();
              return stateVariables1["/_answer1"];
            }),
          );

          cy.window().then(async (win) => {
            let stateVariables1 = await win.returnAllStateVariables1();
            expect(stateVariables1["/_answer1"].stateValues.creditAchieved).eq(
              1,
            );
          });

          cy.get(mathinputAnchor).type(`{end}1`, { force: true });
          cy.get(mathinputSubmitAnchor).click();
          cy.get(mathinputIncorrectAnchor).should("be.visible");

          cy.window().then(async (win) => {
            let stateVariables1 = await win.returnAllStateVariables1();
            expect(stateVariables1["/_answer1"].stateValues.creditAchieved).eq(
              0,
            );
          });

          cy.get("[data-test=next]").click();

          cy.get(textinputAnchor).type(`{end}{backspace}`);
          cy.get(textinputSubmitAnchor).click();
          cy.get(textinputCorrectAnchor).should("be.visible");

          cy.get("[data-test=previous]").click();

          cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
          cy.get(mathinputSubmitAnchor).click();
          cy.get(mathinputCorrectAnchor).should("be.visible");

          cy.window().then(async (win) => {
            let stateVariables1 = await win.returnAllStateVariables1();
            expect(stateVariables1["/_answer1"].stateValues.creditAchieved).eq(
              1,
            );
            let stateVariables2 = await win.returnAllStateVariables2();
            expect(stateVariables2["/_answer1"].stateValues.creditAchieved).eq(
              1,
            );
          });
        });
      });
    }
  });

  it("Two pages, specify numVariants is 2", () => {
    let doenetML = `
    <document type="activity" numVariants="2">
      <page>
        <text>a</text>
        Enter <selectFromSequence from="1" to="1000" assignNames="n" />:
        <answer>$n</answer>
      </page>
      <page>
        <text>b</text>
        <variantControl uniqueVariants />
        Enter <selectFromSequence type="letters" from="a" to="z" assignNames="l" />:
        <answer type="text">$l</answer>
      </page>
    </document>
    `;

    let numbers = [];
    let letters = [];

    for (let ind = 1; ind <= 3; ind++) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 2) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).gte(1);
        expect(activityData.variantsByPage[0]).lte(100);
        expect(activityData.variantsByPage[1]).gte(1);
        expect(activityData.variantsByPage[1]).lte(26);

        let l = numberToLetters(activityData.variantsByPage[1], true);

        if (letters[activityData.variantIndex] === undefined) {
          letters[activityData.variantIndex] = l;
        } else {
          expect(l).eq(letters[activityData.variantIndex]);
        }

        let stateVariables1 = await win.returnAllStateVariables1();
        let n = stateVariables1["/n"].stateValues.value;

        if (numbers[activityData.variantIndex] === undefined) {
          numbers[activityData.variantIndex] = n;
        } else {
          expect(n).eq(numbers[activityData.variantIndex]);
        }

        let mathinputName = cesc2(
          stateVariables1["/_answer1"].stateValues.inputChildren[0]
            .componentName,
        );
        let mathinputAnchor = "#page1" + mathinputName + " textarea";
        let mathinputEditiableFieldAnchor =
          "#page1" + mathinputName + " .mq-editable-field";
        let mathinputSubmitAnchor = "#page1" + mathinputName + "_submit";
        let mathinputCorrectAnchor = "#page1" + mathinputName + "_correct";
        let mathinputIncorrectAnchor = "#page1" + mathinputName + "_incorrect";

        cy.get(mathinputAnchor).type(`${n}{enter}`, { force: true });
        cy.get(mathinputCorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables1 = await win.returnAllStateVariables1();
          expect(stateVariables1["/_answer1"].stateValues.creditAchieved).eq(1);
        });

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(l);

          let textinputName = cesc2(
            stateVariables2["/_answer1"].stateValues.inputChildren[0]
              .componentName,
          );
          let textinputAnchor = "#page2" + textinputName + "_input";
          let textinputSubmitAnchor = "#page2" + textinputName + "_submit";
          let textinputCorrectAnchor = "#page2" + textinputName + "_correct";
          let textinputIncorrectAnchor =
            "#page2" + textinputName + "_incorrect";

          cy.get(textinputAnchor).type(`${l}{enter}`);
          cy.get(textinputCorrectAnchor).should("be.visible");

          cy.window().then(async (win) => {
            let stateVariables2 = await win.returnAllStateVariables2();
            expect(stateVariables2["/_answer1"].stateValues.creditAchieved).eq(
              1,
            );
          });

          cy.get("[data-test=previous]").click();

          cy.get(mathinputEditiableFieldAnchor).should("have.text", `${n}`);
          cy.get(mathinputCorrectAnchor).should("be.visible");

          cy.get("[data-test=next]").click();

          cy.get(textinputAnchor).should("have.value", l);
          cy.get(textinputCorrectAnchor).should("be.visible");
        });
      });
    }
  });

  it("Shuffle and select orders, numVariants not specified", () => {
    let doenetML = `
    <document type="activity">
      <order behavior="shuffle">
        <page>
          <title>A</title>
          <text>a</text>
          <selectFromSequence from="1" to="1000" assignNames="n" />
        </page>
        <order behavior="select">
          <page>
            <title>B</title>
            <text>a</text>
            <selectFromSequence from="1" to="1000" assignNames="n" />
          </page>
          <page>
            <title>C</title>
            <text>a</text>
            <selectFromSequence from="1" to="1000" assignNames="n" />
          </page>
        </order>
      </order>
    </document>
    `;

    let selectionByVariant = {};

    for (let ind = 5; ind <= 1500; ind += 250) {
      if (ind > 5) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 5) {
        cy.get("[data-test=previous]").click();
      }

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 1000) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).gte(1);
        expect(activityData.variantsByPage[0]).lte(100);
        expect(activityData.variantsByPage[1]).gte(1);
        expect(activityData.variantsByPage[1]).lte(100);

        let selection = {
          order: activityData.order,
          variantsByPage: activityData.variantsByPage,
        };

        let titles = [];

        let stateVariables1 = await win.returnAllStateVariables1();
        let title1 = stateVariables1["/_title1"].stateValues.value;

        titles.push(title1);

        let page1 = {
          title: title1,
          n: stateVariables1["/n"].stateValues.value,
        };

        selection.page1 = page1;

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_title1")).should("not.have.text", title1);
        cy.get(cesc("#page2\\/_text1"))
          .should("have.text", "a")
          .then(async () => {
            let stateVariables2 = await win.returnAllStateVariables2();
            let title2 = stateVariables2["/_title1"].stateValues.value;

            titles.push(title2);

            let page2 = {
              title: title2,
              n: stateVariables2["/n"].stateValues.value,
            };

            titles.sort();

            let validTitles =
              (titles[0] === "A" && (titles[1] === "B" || titles[1] === "C")) ||
              (titles[0] === "B" && titles[1] === "C");

            expect(validTitles).eq(true);

            selection.page2 = page2;

            if (selectionByVariant[activityData.variantIndex] === undefined) {
              selectionByVariant[activityData.variantIndex] = selection;
            } else {
              expect(selection).eqls(
                selectionByVariant[activityData.variantIndex],
              );
            }
          });
      });
    }
  });

  it("Two pages, unique variants, variants to exclude", () => {
    let doenetML = `
    <document type="activity">
      <page>
        <text>a</text>
        <variantControl uniqueVariants variantsToExclude="a c d" />
        <selectFromSequence from="1" to="5" assignNames="n" />
      </page>
      <page>
        <text>b</text>
        <variantControl uniqueVariants variantsToExclude="b c d f" />
        <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      let nFromVariant = [2, 5];
      let lFromVariant = ["a", "e", "g"];

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 6) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(
          ((activityData.variantIndex - 1) % 2) + 1,
        );
        expect(activityData.variantsByPage[1]).eq(
          ((activityData.variantIndex - 1) % 3) + 1,
        );

        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(
          nFromVariant[activityData.variantsByPage[0] - 1],
        );

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(
            lFromVariant[activityData.variantsByPage[1] - 1],
          );
        });
      });
    }
  });

  it("Two pages, unique variants, variants to include", () => {
    let doenetML = `
    <document type="activity">
      <page>
        <text>a</text>
        <variantControl uniqueVariants variantsToInclude="b e" />
        <selectFromSequence from="1" to="5" assignNames="n" />
      </page>
      <page>
        <text>b</text>
        <variantControl uniqueVariants variantsToInclude="a e g" />
        <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      let nFromVariant = [2, 5];
      let lFromVariant = ["a", "e", "g"];

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 6) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(
          ((activityData.variantIndex - 1) % 2) + 1,
        );
        expect(activityData.variantsByPage[1]).eq(
          ((activityData.variantIndex - 1) % 3) + 1,
        );

        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(
          nFromVariant[activityData.variantsByPage[0] - 1],
        );

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(
            lFromVariant[activityData.variantsByPage[1] - 1],
          );
        });
      });
    }
  });

  it("Two pages, named variants, variants to exclude", () => {
    let doenetML = `
    <document type="activity">
      <page>
        <text>a</text>
        <variantControl numVariants="5" variantsToExclude="a c d" />
        <select assignNames="(n)">
          <option selectForVariants="a"><number>1</number></option>
          <option selectForVariants="b"><number>2</number></option>
          <option selectForVariants="c"><number>3</number></option>
          <option selectForVariants="d"><number>4</number></option>
          <option selectForVariants="e"><number>5</number></option>
        </select>
      </page>
      <page>
        <text>b</text>
        <variantControl numVariants="7" variantsToExclude="b c d f" />
        <select assignNames="(l)">
          <option selectForVariants="a"><text>a</text></option>
          <option selectForVariants="b"><text>b</text></option>
          <option selectForVariants="c"><text>c</text></option>
          <option selectForVariants="d"><text>d</text></option>
          <option selectForVariants="e"><text>e</text></option>
          <option selectForVariants="f"><text>f</text></option>
          <option selectForVariants="g"><text>g</text></option>
        </select>
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      let nFromVariant = [2, 5];
      let lFromVariant = ["a", "e", "g"];

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 6) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(
          ((activityData.variantIndex - 1) % 2) + 1,
        );
        expect(activityData.variantsByPage[1]).eq(
          ((activityData.variantIndex - 1) % 3) + 1,
        );

        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(
          nFromVariant[activityData.variantsByPage[0] - 1],
        );

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(
            lFromVariant[activityData.variantsByPage[1] - 1],
          );
        });
      });
    }
  });

  it("Two pages, named variants, variants to include", () => {
    let doenetML = `
    <document type="activity">
      <page>
        <text>a</text>
        <variantControl numVariants="5" variantsToInclude="b e" />
        <select assignNames="(n)">
          <option selectForVariants="a"><number>1</number></option>
          <option selectForVariants="b"><number>2</number></option>
          <option selectForVariants="c"><number>3</number></option>
          <option selectForVariants="d"><number>4</number></option>
          <option selectForVariants="e"><number>5</number></option>
        </select>
      </page>
      <page>
        <text>b</text>
        <variantControl numVariants="7" variantsToInclude="a e g" />
        <select assignNames="(l)">
          <option selectForVariants="a"><text>a</text></option>
          <option selectForVariants="b"><text>b</text></option>
          <option selectForVariants="c"><text>c</text></option>
          <option selectForVariants="d"><text>d</text></option>
          <option selectForVariants="e"><text>e</text></option>
          <option selectForVariants="f"><text>f</text></option>
          <option selectForVariants="g"><text>g</text></option>
        </select>
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      let nFromVariant = [2, 5];
      let lFromVariant = ["a", "e", "g"];

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 6) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(
          ((activityData.variantIndex - 1) % 2) + 1,
        );
        expect(activityData.variantsByPage[1]).eq(
          ((activityData.variantIndex - 1) % 3) + 1,
        );

        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(
          nFromVariant[activityData.variantsByPage[0] - 1],
        );

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(
            lFromVariant[activityData.variantsByPage[1] - 1],
          );
        });
      });
    }
  });

  it("Two pages, variants from problem, variants to exclude", () => {
    let doenetML = `
    <document type="activity">
      <page>
        <problem>
          <text>a</text>
          <variantControl numVariants="5" variantsToExclude="a c d" />
          <select assignNames="(n)">
            <option selectForVariants="a"><number>1</number></option>
            <option selectForVariants="b"><number>2</number></option>
            <option selectForVariants="c"><number>3</number></option>
            <option selectForVariants="d"><number>4</number></option>
            <option selectForVariants="e"><number>5</number></option>
          </select>
        </problem>
      </page>
      <page>
        <problem>
          <text>b</text>
          <variantControl uniqueVariants variantsToExclude="b c d f" />
          <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
        </problem>
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      let nFromVariant = [2, 5];
      let lFromVariant = ["a", "e", "g"];

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 6) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(
          ((activityData.variantIndex - 1) % 2) + 1,
        );
        expect(activityData.variantsByPage[1]).eq(
          ((activityData.variantIndex - 1) % 3) + 1,
        );

        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(
          nFromVariant[activityData.variantsByPage[0] - 1],
        );

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(
            lFromVariant[activityData.variantsByPage[1] - 1],
          );
        });
      });
    }
  });

  it("Two pages, variants from problem, variants to include", () => {
    let doenetML = `
    <document type="activity">
      <page>
        <problem>
          <text>a</text>
          <variantControl numVariants="5" variantsToInclude="b e" />
          <select assignNames="(n)">
            <option selectForVariants="a"><number>1</number></option>
            <option selectForVariants="b"><number>2</number></option>
            <option selectForVariants="c"><number>3</number></option>
            <option selectForVariants="d"><number>4</number></option>
            <option selectForVariants="e"><number>5</number></option>
          </select>
        </problem>
      </page>
      <page>
        <problem>
          <text>b</text>
          <variantControl uniqueVariants variantsToInclude="a e g" />
          <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
        </problem>
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      let nFromVariant = [2, 5];
      let lFromVariant = ["a", "e", "g"];

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 6) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(
          ((activityData.variantIndex - 1) % 2) + 1,
        );
        expect(activityData.variantsByPage[1]).eq(
          ((activityData.variantIndex - 1) % 3) + 1,
        );

        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(
          nFromVariant[activityData.variantsByPage[0] - 1],
        );

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(
            lFromVariant[activityData.variantsByPage[1] - 1],
          );
        });
      });
    }
  });

  it("Two pages, variants from document and problem, variants to exclude in problem", () => {
    let doenetML = `
    <document type="activity">
      <page>
        <variantControl uniqueVariants />
        <problem>
          <text>a</text>
          <variantControl numVariants="5" variantsToExclude="a c d" />
          <select assignNames="(n)">
            <option selectForVariants="a"><number>1</number></option>
            <option selectForVariants="b"><number>2</number></option>
            <option selectForVariants="c"><number>3</number></option>
            <option selectForVariants="d"><number>4</number></option>
            <option selectForVariants="e"><number>5</number></option>
          </select>
        </problem>
      </page>
      <page>
        <variantControl uniqueVariants />
        <problem>
          <text>b</text>
          <variantControl uniqueVariants variantsToExclude="b c d f" />
          <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
        </problem>
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      let nFromVariant = [2, 5];
      let lFromVariant = ["a", "e", "g"];

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 6) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(
          ((activityData.variantIndex - 1) % 2) + 1,
        );
        expect(activityData.variantsByPage[1]).eq(
          ((activityData.variantIndex - 1) % 3) + 1,
        );

        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(
          nFromVariant[activityData.variantsByPage[0] - 1],
        );

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(
            lFromVariant[activityData.variantsByPage[1] - 1],
          );
        });
      });
    }
  });

  it("Two pages, variants from document and problem, variants to include in problem", () => {
    let doenetML = `
    <document type="activity">
      <page>
        <variantControl uniqueVariants />
        <problem>
          <text>a</text>
          <variantControl numVariants="5" variantsToInclude="b e" />
          <select assignNames="(n)">
            <option selectForVariants="a"><number>1</number></option>
            <option selectForVariants="b"><number>2</number></option>
            <option selectForVariants="c"><number>3</number></option>
            <option selectForVariants="d"><number>4</number></option>
            <option selectForVariants="e"><number>5</number></option>
          </select>
        </problem>
      </page>
      <page>
        <variantControl uniqueVariants />
        <problem>
          <text>b</text>
          <variantControl uniqueVariants variantsToInclude="a e g" />
          <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
        </problem>
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      let nFromVariant = [2, 5];
      let lFromVariant = ["a", "e", "g"];

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 6) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(
          ((activityData.variantIndex - 1) % 2) + 1,
        );
        expect(activityData.variantsByPage[1]).eq(
          ((activityData.variantIndex - 1) % 3) + 1,
        );

        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(
          nFromVariant[activityData.variantsByPage[0] - 1],
        );

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(
            lFromVariant[activityData.variantsByPage[1] - 1],
          );
        });
      });
    }
  });

  it("Two pages, variants from document and problem, variant to exclude in document and problem", () => {
    let doenetML = `
    <document type="activity">
      <page>
        <variantControl uniqueVariants variantsToExclude="b" />
        <problem>
          <text>a</text>
          <variantControl numVariants="5" variantsToExclude="a d" />
          <select assignNames="(n)">
            <option selectForVariants="a"><number>1</number></option>
            <option selectForVariants="b"><number>2</number></option>
            <option selectForVariants="c"><number>3</number></option>
            <option selectForVariants="d"><number>4</number></option>
            <option selectForVariants="e"><number>5</number></option>
          </select>
        </problem>
      </page>
      <page>
        <variantControl uniqueVariants variantsToExclude="c" />
        <problem>
          <text>b</text>
          <variantControl uniqueVariants variantsToExclude="b c d" />
          <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
        </problem>
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      let nFromVariant = [2, 5];
      let lFromVariant = ["a", "e", "g"];
      let docVariantOptions1 = ["a", "c"];
      let docVariantOptions2 = ["a", "b", "d"];

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 6) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(
          ((activityData.variantIndex - 1) % 2) + 1,
        );
        expect(activityData.variantsByPage[1]).eq(
          ((activityData.variantIndex - 1) % 3) + 1,
        );

        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(
          nFromVariant[activityData.variantsByPage[0] - 1],
        );
        expect(stateVariables1["/_document1"].sharedParameters.variantName).eq(
          docVariantOptions1[activityData.variantsByPage[0] - 1],
        );

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(
            lFromVariant[activityData.variantsByPage[1] - 1],
          );
          expect(
            stateVariables2["/_document1"].sharedParameters.variantName,
          ).eq(docVariantOptions2[activityData.variantsByPage[1] - 1]);
        });
      });
    }
  });

  it("Two pages, variants from document and problem, variant to include in document and problem", () => {
    let doenetML = `
    <document type="activity">
      <page>
        <variantControl uniqueVariants variantsToInclude="a c" />
        <problem>
          <text>a</text>
          <variantControl numVariants="5" variantsToInclude="b c e" />
          <select assignNames="(n)">
            <option selectForVariants="a"><number>1</number></option>
            <option selectForVariants="b"><number>2</number></option>
            <option selectForVariants="c"><number>3</number></option>
            <option selectForVariants="d"><number>4</number></option>
            <option selectForVariants="e"><number>5</number></option>
          </select>
        </problem>
      </page>
      <page>
        <variantControl uniqueVariants variantsToInclude="a b d" />
        <problem>
          <text>b</text>
          <variantControl uniqueVariants variantsToInclude="a e f g" />
          <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
        </problem>
      </page>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {
      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      if (ind > 1) {
        cy.get("[data-test=previous]").click();
      }

      let nFromVariant = [2, 5];
      let lFromVariant = ["a", "e", "g"];
      let docVariantOptions1 = ["a", "c"];
      let docVariantOptions2 = ["a", "b", "d"];

      cy.get(cesc("#page1\\/_text1")).should("have.text", "a");

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq(((ind - 1) % 6) + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(
          ((activityData.variantIndex - 1) % 2) + 1,
        );
        expect(activityData.variantsByPage[1]).eq(
          ((activityData.variantIndex - 1) % 3) + 1,
        );

        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(
          nFromVariant[activityData.variantsByPage[0] - 1],
        );
        expect(stateVariables1["/_document1"].sharedParameters.variantName).eq(
          docVariantOptions1[activityData.variantsByPage[0] - 1],
        );

        cy.get("[data-test=next]").click();

        cy.get(cesc("#page2\\/_text1")).should("have.text", "b");

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(
            lFromVariant[activityData.variantsByPage[1] - 1],
          );
          expect(
            stateVariables2["/_document1"].sharedParameters.variantName,
          ).eq(docVariantOptions2[activityData.variantsByPage[1] - 1]);
        });
      });
    }
  });
});
