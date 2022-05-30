import cssesc from 'cssesc';
import { C } from '../../../src/Core/components/ParagraphMarkup';
import { numberToLetters } from '../../../src/Core/utils/sequence';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Activity variants tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })


  it("Variants from single page, no variant control in page", () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    let activityDefinition = `
    <document type="activity">
      <order>
        <page>
          <text>a</text>
          Enter <selectFromSequence from="1" to="1000" assignNames="n" />:
          <answer>$n</answer>
        </page>
      </order>
    </document>
    `;

    for (let ind = 1; ind <= 200; ind += 97) {

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })


      cy.get('#\\/_text1').should('have.text', 'a');


      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 1000 + 1);
        expect(activityData.variantsByPage).eqls([(ind - 1) % 100 + 1])

        let stateVariables = await win.returnAllStateVariables1();
        let n = stateVariables["/n"].stateValues.value;

        expect(n).gte(1);
        expect(n).lte(1000);

        let mathinputName = cesc(stateVariables['/_answer1'].stateValues.inputChildren[0].componentName)
        let mathinputAnchor = '#' + mathinputName + ' textarea';
        let mathinputEditiableFieldAnchor = '#' + mathinputName + " .mq-editable-field";
        let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
        let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
        let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';


        cy.get(mathinputAnchor).type(`${n}{enter}`, { force: true });
        cy.get(mathinputCorrectAnchor).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);

        })

        cy.wait(2000);  // wait for 1 second debounce

        cy.reload();


        cy.window().then(async (win) => {
          win.postMessage({
            activityDefinition,
            requestedVariantIndex: 1
          }, "*");
        })

        cy.get('#\\/_text1').should('have.text', 'a');

        // wait until core is loaded
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/_answer1"];
        }))

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        })

        cy.get(mathinputAnchor).type(`{end}1`, { force: true });
        cy.get(mathinputSubmitAnchor).click();
        cy.get(mathinputIncorrectAnchor).should('be.visible');

        cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
        cy.get(mathinputSubmitAnchor).click();
        cy.get(mathinputCorrectAnchor).should('be.visible');

      })

    }


  })

  it("Variants from single page, specified variants in page", () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    let activityDefinition = `
    <document type="activity">
      <order>
        <page>
          <variantControl nVariants="3" variantNames="red blue green" />
          <text>a</text>
          Enter 
          <select assignNames="color" >
            <option selectForVariantNames="red">red</option>
            <option selectForVariantNames="blue">blue</option>
            <option selectForVariantNames="green">green</option>
          </select>
          :
          <answer type="text">$color</answer>
        </page>
      </order>
    </document>
    `;

    for (let ind = 1; ind <= 4; ind++) {

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })


      cy.get('#\\/_text1').should('have.text', 'a');

      let color = ["red", "blue", "green"][(ind - 1) % 3];

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 100 + 1);
        expect(activityData.variantsByPage).eqls([(ind - 1) % 3 + 1]);

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/color"].replacements[0]).eq(color)

        let textinputName = cesc(stateVariables['/_answer1'].stateValues.inputChildren[0].componentName)
        let textinputAnchor = '#' + textinputName + '_input';
        let textinputSubmitAnchor = '#' + textinputName + '_submit';
        let textinputCorrectAnchor = '#' + textinputName + '_correct';
        let textinputIncorrectAnchor = '#' + textinputName + '_incorrect';


        cy.get(textinputAnchor).type(`${color}{enter}`);
        cy.get(textinputCorrectAnchor).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);

        })

        cy.wait(2000);  // wait for 1 second debounce

        cy.reload();


        cy.window().then(async (win) => {
          win.postMessage({
            activityDefinition,
            requestedVariantIndex: 1
          }, "*");
        })

        cy.get('#\\/_text1').should('have.text', 'a');

        // wait until core is loaded
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/_answer1"];
        }))

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        })

        cy.get(textinputAnchor).type(`{end}x`);
        cy.get(textinputSubmitAnchor).click();
        cy.get(textinputIncorrectAnchor).should('be.visible');

        cy.get(textinputAnchor).type(`{end}{backspace}`);
        cy.get(textinputSubmitAnchor).click();
        cy.get(textinputCorrectAnchor).should('be.visible');

      })

    }


  })

  it("Variants from single page, specified variants in problem in page", () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    let activityDefinition = `
    <document type="activity">
      <order>
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
      </order>
    </document>
    `;

    for (let ind = 1; ind <= 4; ind++) {

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })


      cy.get('#\\/_text1').should('have.text', 'a');

      let color = ["red", "blue", "green"][(ind - 1) % 3];

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 1000 + 1);
        expect(activityData.variantsByPage).eqls([(ind - 1) % 3 + 1]);

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/color"].replacements[0]).eq(color)

        let textinputName = cesc(stateVariables['/_answer1'].stateValues.inputChildren[0].componentName)
        let textinputAnchor = '#' + textinputName + '_input';
        let textinputSubmitAnchor = '#' + textinputName + '_submit';
        let textinputCorrectAnchor = '#' + textinputName + '_correct';
        let textinputIncorrectAnchor = '#' + textinputName + '_incorrect';


        cy.get(textinputAnchor).type(`${color}{enter}`);
        cy.get(textinputCorrectAnchor).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);

        })

        cy.wait(2000);  // wait for 1 second debounce

        cy.reload();


        cy.window().then(async (win) => {
          win.postMessage({
            activityDefinition,
            requestedVariantIndex: 1
          }, "*");
        })

        cy.get('#\\/_text1').should('have.text', 'a');

        // wait until core is loaded
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/_answer1"];
        }))

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        })

        cy.get(textinputAnchor).type(`{end}x`);
        cy.get(textinputSubmitAnchor).click();
        cy.get(textinputIncorrectAnchor).should('be.visible');

        cy.get(textinputAnchor).type(`{end}{backspace}`);
        cy.get(textinputSubmitAnchor).click();
        cy.get(textinputCorrectAnchor).should('be.visible');

      })

    }


  })

  it("Two pages few variants, page variants enumerated", () => {

    let activityDefinition = `
    <document type="activity">
      <order>
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
      </order>
    </document>
    `;

    for (let ind = 1; ind <= 2000; ind += 371) {

      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })


      cy.get('#\\/_text1').should('have.text', 'a');


      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 1000 + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq((activityData.variantIndex - 1) % 2 + 1);
        expect(activityData.variantsByPage[1]).eq((activityData.variantIndex - 1) % 3 + 1);


        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(activityData.variantsByPage[0])


        cy.get('[data-cy=next]').click();

        cy.get('#\\/_text1').should('have.text', 'b');

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(numberToLetters(activityData.variantsByPage[1], true));

        })
      })


    }


  })

  it("Two pages, numberOfVariants not specified, defaults to 1000", () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    let activityDefinition = `
    <document type="activity">
      <order>
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
      </order>
    </document>
    `;

    for (let ind = 1; ind <= 2000; ind += 970) {

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })


      cy.get('#\\/_text1').should('have.text', 'a');


      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 1000 + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).gte(1);
        expect(activityData.variantsByPage[0]).lte(100);
        expect(activityData.variantsByPage[1]).gte(1);
        expect(activityData.variantsByPage[1]).lte(26);

        let l = numberToLetters(activityData.variantsByPage[1], true)

        let stateVariables1 = await win.returnAllStateVariables1();
        let n = stateVariables1["/n"].stateValues.value;

        expect(n).gte(1);
        expect(n).lte(1000);

        let mathinputName = cesc(stateVariables1['/_answer1'].stateValues.inputChildren[0].componentName)
        let mathinputAnchor = '#' + mathinputName + ' textarea';
        let mathinputEditiableFieldAnchor = '#' + mathinputName + " .mq-editable-field";
        let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
        let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
        let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';


        cy.get(mathinputAnchor).type(`${n}{enter}`, { force: true });
        cy.get(mathinputCorrectAnchor).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables1 = await win.returnAllStateVariables1();
          expect(stateVariables1["/_answer1"].stateValues.creditAchieved).eq(1);
        })


        cy.get('[data-cy=next]').click();

        cy.get('#\\/_text1').should('have.text', 'b');

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(l);

          let textinputName = cesc(stateVariables2['/_answer1'].stateValues.inputChildren[0].componentName)
          let textinputAnchor = '#' + textinputName + '_input';
          let textinputSubmitAnchor = '#' + textinputName + '_submit';
          let textinputCorrectAnchor = '#' + textinputName + '_correct';
          let textinputIncorrectAnchor = '#' + textinputName + '_incorrect';

          cy.get(textinputAnchor).type(`${l}{enter}`);
          cy.get(textinputCorrectAnchor).should('be.visible');


          cy.window().then(async (win) => {
            let stateVariables2 = await win.returnAllStateVariables2();
            expect(stateVariables2["/_answer1"].stateValues.creditAchieved).eq(1);
          })


          cy.get('[data-cy=previous]').click();

          cy.get(mathinputEditiableFieldAnchor).should('have.text', `${n}`)
          cy.get(mathinputCorrectAnchor).should('be.visible');

          cy.get('[data-cy=next]').click();

          cy.get(textinputAnchor).should('have.value', l);
          cy.get(textinputCorrectAnchor).should('be.visible');

          cy.wait(2000);  // wait for 1 second debounce

          cy.reload();


          cy.window().then(async (win) => {
            win.postMessage({
              activityDefinition,
              requestedVariantIndex: 1
            }, "*");
          })

          cy.get('#\\/_text1').should('have.text', 'b');

          // wait until core is loaded
          cy.waitUntil(() => cy.window().then(async (win) => {
            let stateVariables2 = await win.returnAllStateVariables2();
            return stateVariables2["/_answer1"];
          }))

          cy.window().then(async (win) => {
            let stateVariables2 = await win.returnAllStateVariables2();
            expect(stateVariables2["/_answer1"].stateValues.creditAchieved).eq(1);
          })

          cy.get(textinputAnchor).type(`{end}X`);
          cy.get(textinputSubmitAnchor).click();
          cy.get(textinputIncorrectAnchor).should('be.visible');

          cy.window().then(async (win) => {
            let stateVariables2 = await win.returnAllStateVariables2();
            expect(stateVariables2["/_answer1"].stateValues.creditAchieved).eq(0);
          })


          cy.get('[data-cy=previous]').click();

          cy.get('#\\/_text1').should('have.text', 'a');

          // wait until core is loaded
          cy.waitUntil(() => cy.window().then(async (win) => {
            let stateVariables1 = await win.returnAllStateVariables1();
            return stateVariables1["/_answer1"];
          }))

          cy.window().then(async (win) => {
            let stateVariables1 = await win.returnAllStateVariables1();
            expect(stateVariables1["/_answer1"].stateValues.creditAchieved).eq(1);
          })


          cy.get(mathinputAnchor).type(`{end}1`, { force: true });
          cy.get(mathinputSubmitAnchor).click();
          cy.get(mathinputIncorrectAnchor).should('be.visible');

          cy.window().then(async (win) => {
            let stateVariables1 = await win.returnAllStateVariables1();
            expect(stateVariables1["/_answer1"].stateValues.creditAchieved).eq(0);
          })


          cy.get('[data-cy=next]').click();

          cy.get(textinputAnchor).type(`{end}{backspace}`);
          cy.get(textinputSubmitAnchor).click();
          cy.get(textinputCorrectAnchor).should('be.visible');

          cy.get('[data-cy=previous]').click();

          cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
          cy.get(mathinputSubmitAnchor).click();
          cy.get(mathinputCorrectAnchor).should('be.visible');


          cy.window().then(async (win) => {
            let stateVariables1 = await win.returnAllStateVariables1();
            expect(stateVariables1["/_answer1"].stateValues.creditAchieved).eq(1);
            let stateVariables2 = await win.returnAllStateVariables2();
            expect(stateVariables2["/_answer1"].stateValues.creditAchieved).eq(1);
          })



        })
      })


    }


  })

  it("Two pages, specify numberOfVariants is 2", () => {

    let activityDefinition = `
    <document type="activity" numberOfVariants="2">
      <order>
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
      </order>
    </document>
    `;

    let numbers = [];
    let letters = [];

    for (let ind = 1; ind <= 3; ind++) {

      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })


      cy.get('#\\/_text1').should('have.text', 'a');

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 2 + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).gte(1);
        expect(activityData.variantsByPage[0]).lte(100);
        expect(activityData.variantsByPage[1]).gte(1);
        expect(activityData.variantsByPage[1]).lte(26);

        let l = numberToLetters(activityData.variantsByPage[1], true)

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

        let mathinputName = cesc(stateVariables1['/_answer1'].stateValues.inputChildren[0].componentName)
        let mathinputAnchor = '#' + mathinputName + ' textarea';
        let mathinputEditiableFieldAnchor = '#' + mathinputName + " .mq-editable-field";
        let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
        let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
        let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';


        cy.get(mathinputAnchor).type(`${n}{enter}`, { force: true });
        cy.get(mathinputCorrectAnchor).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables1 = await win.returnAllStateVariables1();
          expect(stateVariables1["/_answer1"].stateValues.creditAchieved).eq(1);
        })


        cy.get('[data-cy=next]').click();

        cy.get('#\\/_text1').should('have.text', 'b');

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(l);

          let textinputName = cesc(stateVariables2['/_answer1'].stateValues.inputChildren[0].componentName)
          let textinputAnchor = '#' + textinputName + '_input';
          let textinputSubmitAnchor = '#' + textinputName + '_submit';
          let textinputCorrectAnchor = '#' + textinputName + '_correct';
          let textinputIncorrectAnchor = '#' + textinputName + '_incorrect';

          cy.get(textinputAnchor).type(`${l}{enter}`);
          cy.get(textinputCorrectAnchor).should('be.visible');


          cy.window().then(async (win) => {
            let stateVariables2 = await win.returnAllStateVariables2();
            expect(stateVariables2["/_answer1"].stateValues.creditAchieved).eq(1);
          })


          cy.get('[data-cy=previous]').click();

          cy.get(mathinputEditiableFieldAnchor).should('have.text', `${n}`)
          cy.get(mathinputCorrectAnchor).should('be.visible');

          cy.get('[data-cy=next]').click();

          cy.get(textinputAnchor).should('have.value', l);
          cy.get(textinputCorrectAnchor).should('be.visible');


        })
      })


    }


  })

  it("Shuffle and select orders, numberOfVariants not specified", () => {

    let activityDefinition = `
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

      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })


      cy.get('#\\/_text1').should('have.text', 'a');

      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 1000 + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).gte(1);
        expect(activityData.variantsByPage[0]).lte(100);
        expect(activityData.variantsByPage[1]).gte(1);
        expect(activityData.variantsByPage[1]).lte(100);

        let selection = {
          order: activityData.order,
          variantsByPage: activityData.variantsByPage,
        }

        let titles = [];


        let stateVariables1 = await win.returnAllStateVariables1();
        let title1 = stateVariables1["/_title1"].stateValues.value;

        titles.push(title1)

        let page1 = {
          title: title1,
          n: stateVariables1["/n"].stateValues.value
        }

        selection.page1 = page1;


        cy.get('[data-cy=next]').click();

        cy.get('#\\/_title1').should('not.have.text', title1)
        cy.get('#\\/_text1').should('have.text', 'a').then(async () => {

          let stateVariables2 = await win.returnAllStateVariables2();
          let title2 = stateVariables2["/_title1"].stateValues.value;

          titles.push(title2)

          let page2 = {
            title: title2,
            n: stateVariables2["/n"].stateValues.value
          }


          titles.sort();

          let validTitles = (titles[0] === "A" && (titles[1] === "B" || titles[1] === "C"))
            || (titles[0] === "B" && titles[1] === "C");

          expect(validTitles).eq(true);

          selection.page2 = page2;

          if (selectionByVariant[activityData.variantIndex] === undefined) {
            selectionByVariant[activityData.variantIndex] = selection;
          } else {
            expect(selection).eqls(selectionByVariant[activityData.variantIndex])
          }

        });


      })


    }


  })

  it("Two pages, unique variants, variant indices to ignore", () => {

    let activityDefinition = `
    <document type="activity">
      <order>
        <page>
          <text>a</text>
          <variantControl uniqueVariants variantIndicesToIgnore="1 3 4" />
          <selectFromSequence from="1" to="5" assignNames="n" />
        </page>
        <page>
          <text>b</text>
          <variantControl uniqueVariants variantIndicesToIgnore="2 3 4 6" />
          <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
        </page>
      </order>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {

      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })

      let variantOptions1 = [2, 5];
      let variantOptions2 = [1, 5, 7];

      cy.get('#\\/_text1').should('have.text', 'a');


      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 1000 + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(variantOptions1[(activityData.variantIndex - 1) % 2]);
        expect(activityData.variantsByPage[1]).eq(variantOptions2[(activityData.variantIndex - 1) % 3]);


        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(activityData.variantsByPage[0])


        cy.get('[data-cy=next]').click();

        cy.get('#\\/_text1').should('have.text', 'b');

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(numberToLetters(activityData.variantsByPage[1], true));

        })
      })


    }


  })

  it("Two pages, named variants, variant indices to ignore", () => {

    let activityDefinition = `
    <document type="activity">
      <order>
        <page>
          <text>a</text>
          <variantControl nVariants="5" variantIndicesToIgnore="1 3 4" />
          <select assignNames="(n)">
            <option selectForVariantNames="a"><number>1</number></option>
            <option selectForVariantNames="b"><number>2</number></option>
            <option selectForVariantNames="c"><number>3</number></option>
            <option selectForVariantNames="d"><number>4</number></option>
            <option selectForVariantNames="e"><number>5</number></option>
          </select>
        </page>
        <page>
          <text>b</text>
          <variantControl nVariants="7" variantIndicesToIgnore="2 3 4 6" />
          <select assignNames="(l)">
            <option selectForVariantNames="a"><text>a</text></option>
            <option selectForVariantNames="b"><text>b</text></option>
            <option selectForVariantNames="c"><text>c</text></option>
            <option selectForVariantNames="d"><text>d</text></option>
            <option selectForVariantNames="e"><text>e</text></option>
            <option selectForVariantNames="f"><text>f</text></option>
            <option selectForVariantNames="g"><text>g</text></option>
          </select>
        </page>
      </order>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {

      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })

      let variantOptions1 = [2, 5];
      let variantOptions2 = [1, 5, 7];

      cy.get('#\\/_text1').should('have.text', 'a');


      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 1000 + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(variantOptions1[(activityData.variantIndex - 1) % 2]);
        expect(activityData.variantsByPage[1]).eq(variantOptions2[(activityData.variantIndex - 1) % 3]);


        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(activityData.variantsByPage[0])


        cy.get('[data-cy=next]').click();

        cy.get('#\\/_text1').should('have.text', 'b');

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(numberToLetters(activityData.variantsByPage[1], true));

        })
      })


    }


  })

  it("Two pages, variants from problem, variant indices to ignore", () => {

    let activityDefinition = `
    <document type="activity">
      <order>
        <page>
          <problem>
            <text>a</text>
            <variantControl nVariants="5" variantIndicesToIgnore="1 3 4" />
            <select assignNames="(n)">
              <option selectForVariantNames="a"><number>1</number></option>
              <option selectForVariantNames="b"><number>2</number></option>
              <option selectForVariantNames="c"><number>3</number></option>
              <option selectForVariantNames="d"><number>4</number></option>
              <option selectForVariantNames="e"><number>5</number></option>
            </select>
          </problem>
        </page>
        <page>
          <problem>
            <text>b</text>
            <variantControl uniqueVariants variantIndicesToIgnore="2 3 4 6" />
            <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
          </problem>
        </page>
      </order>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {

      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })

      let variantOptions1 = [2, 5];
      let variantOptions2 = [1, 5, 7];

      cy.get('#\\/_text1').should('have.text', 'a');


      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 1000 + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(variantOptions1[(activityData.variantIndex - 1) % 2]);
        expect(activityData.variantsByPage[1]).eq(variantOptions2[(activityData.variantIndex - 1) % 3]);


        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(activityData.variantsByPage[0])


        cy.get('[data-cy=next]').click();

        cy.get('#\\/_text1').should('have.text', 'b');

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(numberToLetters(activityData.variantsByPage[1], true));

        })
      })


    }


  })

  it("Two pages, variants from document and problem, variant indices to ignore in problem", () => {

    let activityDefinition = `
    <document type="activity">
      <order>
        <page>
          <variantControl uniqueVariants />
          <problem>
            <text>a</text>
            <variantControl nVariants="5" variantIndicesToIgnore="1 3 4" />
            <select assignNames="(n)">
              <option selectForVariantNames="a"><number>1</number></option>
              <option selectForVariantNames="b"><number>2</number></option>
              <option selectForVariantNames="c"><number>3</number></option>
              <option selectForVariantNames="d"><number>4</number></option>
              <option selectForVariantNames="e"><number>5</number></option>
            </select>
          </problem>
        </page>
        <page>
          <variantControl uniqueVariants />
          <problem>
            <text>b</text>
            <variantControl uniqueVariants variantIndicesToIgnore="2 3 4 6" />
            <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
          </problem>
        </page>
      </order>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {

      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })

      let variantOptions1 = [2, 5];
      let variantOptions2 = [1, 5, 7];

      cy.get('#\\/_text1').should('have.text', 'a');


      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 1000 + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq((activityData.variantIndex - 1) % 2 + 1);
        expect(activityData.variantsByPage[1]).eq((activityData.variantIndex - 1) % 3 + 1);


        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(variantOptions1[activityData.variantsByPage[0] - 1])


        cy.get('[data-cy=next]').click();

        cy.get('#\\/_text1').should('have.text', 'b');

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(numberToLetters(variantOptions2[activityData.variantsByPage[1] - 1], true));

        })
      })


    }


  })

  it("Two pages, variants from document and problem, variant indices to ignore in document and problem", () => {

    let activityDefinition = `
    <document type="activity">
      <order>
        <page>
          <variantControl uniqueVariants variantIndicesToIgnore="2" />
          <problem>
            <text>a</text>
            <variantControl nVariants="5" variantIndicesToIgnore="1 4" />
            <select assignNames="(n)">
              <option selectForVariantNames="a"><number>1</number></option>
              <option selectForVariantNames="b"><number>2</number></option>
              <option selectForVariantNames="c"><number>3</number></option>
              <option selectForVariantNames="d"><number>4</number></option>
              <option selectForVariantNames="e"><number>5</number></option>
            </select>
          </problem>
        </page>
        <page>
          <variantControl uniqueVariants variantIndicesToIgnore="3" />
          <problem>
            <text>b</text>
            <variantControl uniqueVariants variantIndicesToIgnore="2 3 4" />
            <selectFromSequence type="letters" from="a" to="g" assignNames="l" />
          </problem>
        </page>
      </order>
    </document>
    `;

    for (let ind = 1; ind <= 20; ind += 5) {

      if (ind > 1) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          activityDefinition,
          requestedVariantIndex: ind
        }, "*");
      })

      let docVariantOptions1 = [1, 3];
      let docVariantOptions2 = [1, 2, 4];
      let pageVariantOptions1 = [2, undefined, 5];
      let pageVariantOptions2 = [1, 5, undefined, 7];

      cy.get('#\\/_text1').should('have.text', 'a');


      cy.window().then(async (win) => {
        let activityData = win.returnActivityData();

        expect(activityData.requestedVariantIndex).eq(ind);
        expect(activityData.variantIndex).eq((ind - 1) % 1000 + 1);
        expect(activityData.variantsByPage.length).eq(2);
        expect(activityData.variantsByPage[0]).eq(docVariantOptions1[(activityData.variantIndex - 1) % 2]);
        expect(activityData.variantsByPage[1]).eq(docVariantOptions2[(activityData.variantIndex - 1) % 3]);


        let stateVariables1 = await win.returnAllStateVariables1();

        expect(stateVariables1["/n"].stateValues.value).eq(pageVariantOptions1[activityData.variantsByPage[0] - 1])


        cy.get('[data-cy=next]').click();

        cy.get('#\\/_text1').should('have.text', 'b');

        cy.window().then(async (win) => {
          let stateVariables2 = await win.returnAllStateVariables2();

          expect(stateVariables2["/l"].stateValues.value).eq(numberToLetters(pageVariantOptions2[activityData.variantsByPage[1] - 1], true));

        })
      })


    }


  })



})