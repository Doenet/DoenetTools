import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('matching patterns answer tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('enter any quadratic', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
      <math name="pattern1">()$var^2+()$var+()</math>
      <math name="pattern2">()$var^2+()</math>
    </setup>

    <p><mathinput name="var" /></p>
    <p>Enter a quadratic expression in the variable <math name="var2" copysource="var" />:
    <answer name="ans">
      <mathinput name="resp" />
      <award><when>
        <matchesPattern name="excludeX1" pattern="$pattern1" excludeMatches="$var" allowImplicitIdentities>
          $resp
        </matchesPattern>
        or
        <matchesPattern name="excludeX2" pattern="$pattern2" excludeMatches="$var" allowImplicitIdentities>
          $resp
        </matchesPattern>
      </when></award>
      <considerAsResponses>
        <conditionalContent maximumNumberToShow="1">
          <case condition="$excludeX1">$excludeX1.patternMatches[1]{assignNamesSkip="1"} $excludeX1.patternMatches[2]{assignNamesSkip="1"} $excludeX1.patternMatch3{assignNamesSkip="1"}</case>
          <case condition="$excludeX2">$excludeX2.patternMatches[1]{assignNamesSkip="1"} <math>0</math> $excludeX2.patternMatch2</case>
        </conditionalContent>
      </considerAsResponses>
    </answer>
    </p>

    <p name="p_sub">Submitted answer: $ans.submittedResponse</p>
    <p name="p_quad">Quadratic coeff: $ans.submittedResponse2</p>
    <p name="p_lin">Linear coeff: $ans.submittedResponse3</p>
    <p name="p_const">Constant term: $ans.submittedResponse4</p>
    

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    let desiredResults = {
      x: {
        '': {
          correct: false,
          response: ["\uff3f", "\uff3f"]
        },
        "x^2": {
          correct: true,
          response: [["^", "x", 2], "x2"],
          matches: [[1, "1"], [0, "0"], [0, "0"]]
        },
        "x^2{rightArrow}+1": {
          correct: true,
          response: [["+", ["^", "x", 2], 1], "x2+1"],
          matches: [[1, "1"], [0, "0"], [1, "1"]]
        },
        "x^2{rightArrow}+x": {
          correct: true,
          response: [["+", ["^", "x", 2], "x"], "x2+x"],
          matches: [[1, "1"], [1, "1"], [0, "0"]]
        },
        "x^2{rightArrow}+x+x": {
          correct: false,
          response: [["+", ["^", "x", 2], "x", "x"], "x2+x+x"],
        },
        "x^2{rightArrow}+c": {
          correct: true,
          response: [["+", ["^", "x", 2], "c"], "x2+c"],
          matches: [[1, "1"], [0, "0"], ["c", "c"]]
        },
        "xx^2{rightArrow}+c": {
          correct: false,
          response: [["+", ["*", "x", ["^", "x", 2]], "c"], "xx2+c"],
        },
        "x^2{rightArrow}+x+c+d": {
          correct: true,
          response: [["+", ["^", "x", 2], "x", "c", "d"], "x2+x+c+d"],
          matches: [[1, "1"], [1, "1"], [["+", "c", "d"], "c+d"]]
        },
        "ax^2{rightArrow}+bx+c": {
          correct: true,
          response: [["+", ["*", "a", ["^", "x", 2]], ["*", "b", "x"], "c"], "ax2+bx+c"],
          matches: [["a", "a"], ["b", "b"], ["c", "c"]]
        },
        "ay^2{rightArrow}+by+c": {
          correct: false,
          response: [["+", ["*", "a", ["^", "y", 2]], ["*", "b", "y"], "c"], "ay2+by+c"],
        },
        "sqrt2{rightArrow}x^2{rightArrow}+5/8{rightArrow}x+e^y": {
          correct: true,
          response: [["+", ["*", ["apply", "sqrt", 2], ["^", "x", 2]], ["*", ["/", 5, 8], "x"], ["^", "e", "y"]], "√2x2+(58)x+ey"],
          matches: [[["apply", "sqrt", 2], "√2"], [["/", 5, 8], "58"], [["^", "e", "y"], "ey"]]
        },
      },
      y: {
        "ay^2{rightArrow}+by+c": {
          correct: true,
          response: [["+", ["*", "a", ["^", "y", 2]], ["*", "b", "y"], "c"], "ay2+by+c"],
          matches: [["a", "a"], ["b", "b"], ["c", "c"]]
        },
        "piy^2{rightArrow}x^2{rightArrow}+e^x{rightArrow}y+x+x": {
          correct: true,
          response: [["+", ["*", "pi", ["^", "y", 2], ["^", "x", 2]], ["*", ["^", "e", "x"], "y"], "x", "x"], "πy2x2+exy+x+x"],
          matches: [[["*", "pi", ["^", "x", 2]], "πx2"], [["^", "e", "x"], "ex"], [["+", "x", "x"], "x+x"]]
        },
        "4y^2{rightArrow}-9y-2": {
          correct: true,
          response: [["+", ["*", 4, ["^", "y", 2]], ["-", ["*", 9, "y"]], -2], "4y2−9y−2"],
          matches: [[4, "4"], [["-", 9], "−9"], [-2, "−2"]]
        },
        "4y^2{rightArrow}+3x+5": {
          correct: true,
          response: [["+", ["*", 4, ["^", "y", 2]], ["*", 3, "x"], 5], "4y2+3x+5"],
          matches: [[4, "4"], [0, "0"], [["+", ["*", 3, "x"], 5], "3x+5"]]
        },
      }
    }

    cy.get("#\\/var2 .mjx-mrow").should('contain.text', "\uff3f")

    for (let varName in desiredResults) {
      cy.log(`setting variable to ${varName}`)
      cy.get('#\\/var textarea').type(`{end}{backspace}${varName}{enter}`, { force: true })
      cy.get("#\\/var2 .mjx-mrow").should('contain.text', varName)

      let resultsForVar = desiredResults[varName];
      for (let expr in resultsForVar) {
        cy.log(`trying ${expr} for variable ${varName}`)

        cy.get("#\\/resp textarea").type(`{ctrl+home}{ctrl+shift+end}{backspace}${expr}{enter}`, { force: true })

        let res = resultsForVar[expr];

        if (res.correct) {

          cy.get("#\\/resp_correct").should('be.visible')
          cy.get('#\\/p_sub .mjx-mrow').eq(0).should('have.text', res.response[1])
          cy.get('#\\/p_quad .mjx-mrow').eq(0).should('have.text', res.matches[0][1])
          cy.get('#\\/p_lin .mjx-mrow').eq(0).should('have.text', res.matches[1][1])
          cy.get('#\\/p_const .mjx-mrow').eq(0).should('have.text', res.matches[2][1])
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ans"].stateValues.submittedResponse1).eqls(res.response[0])
            expect(stateVariables["/ans"].stateValues.submittedResponse2).eqls(res.matches[0][0])
            expect(stateVariables["/ans"].stateValues.submittedResponse3).eqls(res.matches[1][0])
            expect(stateVariables["/ans"].stateValues.submittedResponse4).eqls(res.matches[2][0])
          })

        } else {
          cy.get("#\\/resp_incorrect").should('be.visible')
          cy.get('#\\/p_sub .mjx-mrow').eq(0).should('have.text', res.response[1])
          cy.get('#\\/p_quad .mjx-mrow').should('not.exist');
          cy.get('#\\/p_lin .mjx-mrow').should('not.exist');
          cy.get('#\\/p_const .mjx-mrow').should('not.exist');
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ans"].stateValues.submittedResponse1).eqls(res.response[0])
            expect(stateVariables["/ans"].stateValues.submittedResponse2).eq(undefined);
            expect(stateVariables["/ans"].stateValues.submittedResponse3).eq(undefined);
            expect(stateVariables["/ans"].stateValues.submittedResponse4).eq(undefined);
          })
        }

      }
    }


  });

});