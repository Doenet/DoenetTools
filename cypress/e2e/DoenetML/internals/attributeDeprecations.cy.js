import { cesc } from "../../../../src/_utils/url";

describe("Test attribute deprecations", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("testRenderingAllDeprecations", () => {
    cy.window().then(async (win) => {
      /*
      - from serializedStateProcessing.js
      let deprecatedAttributeSubstitutions = {
          ... previously deprecated things ...
          ...
          numberdecimals: "numDecimals",
          numberdigits: "numDigits",
          nDimensions: "numDimensions",
          nInputs: "numInputs",
          nOutputs: "numOutputs",
          nIterates: "numIterates",
          nRows: "numRows",
          nColumns: "numColumns",
      }

      export const deprecatedPropertySubstitutions = {
        maximumNumberOfAttempts: "maxNumAttempts",
        numberFeedbacks: "numFeedbacks",
        numberOfAttemptsLeft: "numAttemptsLeft",
        nSubmissions: "numSubmissions",
        nSubmittedResponses: "numSubmittedResponses",
        nAwardsCredited: "numAwardsCredited",
        numberChoices: "numChoices",
        numberMinima: "numMinima",
        numberMaxima: "numMaxima",
        numberExtrema: "numExtrema",
        numberDecimals: "numDecimals",
        numberDigits: "numDigits",
        numSamples: "numSamples",
        numberToSelect: "numToSelect",
        numberSolutions: "numSolutions",
        maximumNumber: "maxNumber",
        nVertices: "numVertices",
        nPoints: "numPoints",
        nSignErrorsMatched: "numSignErrorsMatched",
        nPeriodicSetMatchesRequired: "numPeriodicSetMatchesRequired",
        nValues: "numValues",
        nResponses: "numResponses",
        nControls: "numControls",
        nThroughPoints: "numThroughPoints",
        nComponents: "numComponents",
        nChildrenToRender: "numChildrenToRender",
        nSelectedIndices: "numSelectedIndices",
        nDimensions: "numDimensions",
        nCases: "numCases",
        nDiscretizationPoints: "numDiscretizationPoints",
        nXCriticalPoints: "numXCriticalPoints",
        nYCriticalPoints: "numYCriticalPoints",
        numCurvatureChangePoints: "numCurvatureChangePoints",
        nScoredDescendants: "numScoredDescendants",
        nInputs: "numInputs",
        nOutputs: "numOutputs",
        nIterates: "numIterates",
        nDerivatives: "numDerivatives",
        nSources: "numSources",
        nMatches: "numMatches",
        nRows: "numRows",
        nColumns: "numColumns",
        nPages: "numPages",
        nOffsets: "numOffsets",
      };
      */
      win.postMessage(
        {
          doenetML: `
  <p>Hello, paragraph 1</p>
  <p>Bye, paragraph 2</p>
  `,
        },
        "*",
      );

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
  <text>a</text>
  <p><mathinput name="mi1" /> <mathinput name="mi2" />
    <answer matchPartial><award><when>
      <mathList isResponse>$mi1 $mi2</mathList> = <mathList>x+y z</mathList>
    </when></award></answer></p>
  <p>Current response: <copy prop="currentResponses" target="_answer1" assignNames="cr1 cr2" /></p>
  <p>Submitted response: <copy prop="submittedResponses" target="_answer1" createComponentOfType="math" nComponents="2" assignNames="sr1 sr2" /></p>
  <p>Credit for submitted response: <copy prop="creditAchieved" target="_answer1" assignNames="ca1" /></p>
  `,
          },
          "*",
        );
      });

      cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded
    });

    cy.log("find paragraphs");
    cy.get("p" + cesc("#\\/_p1")).should("have.text", "Hello, paragraph 1");
    cy.get("p" + cesc("#\\/_p2")).should("have.text", "Bye, paragraph 2");
  });

  it("paragraph with math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>math in paragraph: <math simplify>x+x</math></p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("find mathjax rendered math in paragraph");
    cy.get("p" + cesc("#\\/_p1"))
      .find(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
  });
});
