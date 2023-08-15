import { cesc } from "../../../../src/utils/url";

describe("MatchesPattern Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("match linear pattern", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>Pattern: <math name="pattern">()x+()</math></p>
  <p>Expression: <mathinput name="expr" /></p>
  <p><booleanInput name="bi"/> <boolean name="b" copySource="bi" /></p>

  <p>Default settings: <matchesPattern name="default" pattern="$pattern">
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="default.patternMatches" assignNames="dm1 dm2" /></p>

  <p>No permutations: <matchesPattern name="noperm" pattern="$pattern" allowPermutations="false">
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="noperm.patternMatches" assignNames="npm1 npm2" /></p>

  <p>Implicit identities: <matchesPattern name="implicitIdents" pattern="$pattern" allowImplicitIdentities>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="implicitIdents.patternMatches" assignNames="iim1 iim2" /></p>

  <p>Require numeric matches: <matchesPattern name="requireNumeric" pattern="$pattern" requireNumericMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="requireNumeric.patternMatches" assignNames="rnm1 rnm2" /></p>

  <p>Require variable matches: <matchesPattern name="requireVariable" pattern="$pattern" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="requireVariable.patternMatches" assignNames="rvm1 rvm2" /></p>

  <p>Variable except x: <matchesPattern name="excludeX" pattern="$pattern" excludeMatches="x" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="excludeX.patternMatches" assignNames="exm1 exm2" /></p>


  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let matchNames = {
      default: ["dm1", "dm2"],
      noperm: ["npm1", "npm2"],
      implicitIdents: ["iim1", "iim2"],
      requireNumeric: ["rnm1", "rnm2"],
      requireVariable: ["rvm1", "rvm2"],
      excludeX: ["exm1", "exm2"],
    };

    let desiredResults = {
      "": {
        default: false,
        noperm: false,
        implicitIdents: false,
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      x: {
        default: false,
        noperm: false,
        implicitIdents: [1, 0],
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      "x+y": {
        default: false,
        noperm: false,
        implicitIdents: [1, "y"],
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      "2x+y": {
        default: [2, "y"],
        noperm: [2, "y"],
        implicitIdents: [2, "y"],
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      "y+2x": {
        default: [2, "y"],
        noperm: false,
        implicitIdents: [2, "y"],
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      "x*2+y": {
        default: [2, "y"],
        noperm: false,
        implicitIdents: [2, "y"],
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      "(y+z)x+7+e^q+5": {
        default: ["y+z", "7+eq+5"],
        noperm: ["y+z", "7+eq+5"],
        implicitIdents: ["y+z", "7+eq+5"],
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      "pi x+sqrt3": {
        default: ["π", "√3"],
        noperm: ["π", "√3"],
        implicitIdents: ["π", "√3"],
        requireNumeric: ["π", "√3"],
        requireVariable: false,
        excludeX: false,
      },
      "ax+b": {
        default: ["a", "b"],
        noperm: ["a", "b"],
        implicitIdents: ["a", "b"],
        requireNumeric: false,
        requireVariable: ["a", "b"],
        excludeX: ["a", "b"],
      },
      "ax+x": {
        default: ["a", "x"],
        noperm: ["a", "x"],
        implicitIdents: ["a", "x"],
        requireNumeric: false,
        requireVariable: ["a", "x"],
        excludeX: false,
      },
      "ax+x+x": {
        default: ["a", "x+x"],
        noperm: ["a", "x+x"],
        implicitIdents: ["a", "x+x"],
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      "b+xa": {
        default: ["a", "b"],
        noperm: false,
        implicitIdents: ["a", "b"],
        requireNumeric: false,
        requireVariable: ["a", "b"],
        excludeX: ["a", "b"],
      },
      "ax+b+c": {
        default: ["a", "b+c"],
        noperm: ["a", "b+c"],
        implicitIdents: ["a", "b+c"],
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      "(1+2)x+3+4": {
        default: ["1+2", "3+4"],
        noperm: ["1+2", "3+4"],
        implicitIdents: ["1+2", "3+4"],
        requireNumeric: ["1+2", "3+4"],
        requireVariable: false,
        excludeX: false,
      },
    };

    let b = false;

    for (let expr in desiredResults) {
      cy.log(`trying: ${expr}`);
      cy.get(cesc("#\\/expr") + " textarea").type(
        `{ctrl+home}{ctrl+shift+end}{backspace}${expr}{enter}`,
        { force: true },
      );
      cy.get(cesc("#\\/bi")).click();
      b = !b;
      cy.get(cesc("#\\/b")).should("have.text", b.toString()); // to make sure change occured

      let dResults = desiredResults[expr];

      for (let name in dResults) {
        let res = dResults[name];
        if (res) {
          cy.get(cesc(`#\\/${name}`)).should("have.text", "true");
          cy.get(cesc(`#\\/${matchNames[name][0]}`) + ` .mjx-mrow`)
            .eq(0)
            .should("have.text", res[0]);
          cy.get(cesc(`#\\/${matchNames[name][1]}`) + ` .mjx-mrow`)
            .eq(0)
            .should("have.text", res[1]);
        } else {
          cy.get(cesc(`#\\/${name}`)).should("have.text", "false");
          cy.get(cesc(`#\\/${matchNames[name][0]}`)).should("not.exist");
          cy.get(cesc(`#\\/${matchNames[name][1]}`)).should("not.exist");
        }
      }
    }
  });

  it("match quadratic pattern, base test", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>Pattern: <math name="pattern">()x^2+()x+()</math></p>
  <p>Expression: <mathinput name="expr" /></p>
  <p><booleanInput name="bi"/> <boolean name="b" copySource="bi" /></p>

  <p>Default settings: <matchesPattern name="default" pattern="$pattern">
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="default.patternMatches" assignNames="dm1 dm2 dm3" /></p>

  <p>No permutations: <matchesPattern name="noperm" pattern="$pattern" allowPermutations="false">
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="noperm.patternMatches" assignNames="npm1 npm2 npm3" /></p>

  <p>Implicit identities: <matchesPattern name="implicitIdents" pattern="$pattern" allowImplicitIdentities>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="implicitIdents.patternMatches" assignNames="iim1 iim2 iim3" /></p>

  <p>Require numeric matches: <matchesPattern name="requireNumeric" pattern="$pattern" requireNumericMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="requireNumeric.patternMatches" assignNames="rnm1 rnm2 rnm3" /></p>

  <p>Require variable matches: <matchesPattern name="requireVariable" pattern="$pattern" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="requireVariable.patternMatches" assignNames="rvm1 rvm2 rvm3" /></p>

  <p>Variable except x: <matchesPattern name="excludeX" pattern="$pattern" excludeMatches="x" requirevariableMatches>
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="excludeX.patternMatches" assignNames="exm1 exm2 exm3" /></p>


  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let matchNames = {
      default: ["dm1", "dm2", "dm3"],
      noperm: ["npm1", "npm2", "npm3"],
      implicitIdents: ["iim1", "iim2", "iim3"],
      requireNumeric: ["rnm1", "rnm2", "rnm3"],
      requireVariable: ["rvm1", "rvm2", "rvm3"],
      excludeX: ["exm1", "exm2", "exm3"],
    };

    let desiredResults = {
      "": {
        default: false,
        noperm: false,
        implicitIdents: false,
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      x: {
        default: false,
        noperm: false,
        implicitIdents: false,
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      "x^2": {
        default: false,
        noperm: false,
        implicitIdents: false,
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      "x^2{rightArrow}+x": {
        default: false,
        noperm: false,
        implicitIdents: [1, 1, 0],
        requireNumeric: false,
        requireVariable: false,
        excludeX: false,
      },
      "1x^2{rightArrow}+1x+0": {
        default: [1, 1, 0],
        noperm: [1, 1, 0],
        implicitIdents: [1, 1, 0],
        requireNumeric: [1, 1, 0],
        requireVariable: false,
        excludeX: false,
      },
      "ax^2{rightArrow}+bx+c": {
        default: ["a", "b", "c"],
        noperm: ["a", "b", "c"],
        implicitIdents: ["a", "b", "c"],
        requireNumeric: false,
        requireVariable: ["a", "b", "c"],
        excludeX: ["a", "b", "c"],
      },
      "ax^2{rightArrow}+c+bx": {
        default: ["a", "b", "c"],
        noperm: false,
        implicitIdents: ["a", "b", "c"],
        requireNumeric: false,
        requireVariable: ["a", "b", "c"],
        excludeX: ["a", "b", "c"],
      },
      "xx^2{rightArrow}+bx+c": {
        default: ["x", "b", "c"],
        noperm: ["x", "b", "c"],
        implicitIdents: ["x", "b", "c"],
        requireNumeric: false,
        requireVariable: ["x", "b", "c"],
        excludeX: false,
      },
    };

    let b = false;

    for (let expr in desiredResults) {
      cy.log(`trying: ${expr}`);
      cy.get(cesc("#\\/expr") + " textarea").type(
        `{ctrl+home}{ctrl+shift+end}{backspace}${expr}{enter}`,
        { force: true },
      );
      cy.get(cesc("#\\/bi")).click();
      b = !b;
      cy.get(cesc("#\\/b")).should("have.text", b.toString()); // to make sure change occured

      let dResults = desiredResults[expr];

      for (let name in dResults) {
        let res = dResults[name];
        if (res) {
          cy.get(cesc(`#\\/${name}`)).should("have.text", "true");
          cy.get(cesc(`#\\/${matchNames[name][0]}`) + ` .mjx-mrow`)
            .eq(0)
            .should("have.text", res[0]);
          cy.get(cesc(`#\\/${matchNames[name][1]}`) + ` .mjx-mrow`)
            .eq(0)
            .should("have.text", res[1]);
        } else {
          cy.get(cesc(`#\\/${name}`)).should("have.text", "false");
          cy.get(cesc(`#\\/${matchNames[name][0]}`)).should("not.exist");
          cy.get(cesc(`#\\/${matchNames[name][1]}`)).should("not.exist");
        }
      }
    }
  });

  it("match quadratic pattern, combine matches for flexibility", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>Pattern 1: <math name="pattern1">()x^2+()x+()</math></p>
  <p>Pattern 2: <math name="pattern2">()x^2+()</math></p>
  <p>Expression: <mathinput name="expr" /></p>
  <p><booleanInput name="bi"/> <boolean name="b" copySource="bi" /></p>

  <p>base: <boolean name="base">
    <matchesPattern name="base1" pattern="$pattern1" allowImplicitIdentities>$expr</matchesPattern>
    or <matchesPattern name="base2" pattern="$pattern2" allowImplicitIdentities>$expr</matchesPattern>
  </boolean></p>
  <p>Matches: 
    <conditionalContent assignNames="(bm1 bm2 bm3)" maximumNumberToShow="1">
      <case condition="$base1">$base1.patternMatches[1] $base1.patternMatches[2] $base1.patternMatch3</case>
      <case condition="$base2">$base2.patternMatches[1] <math>0</math> $base2.patternMatch2</case>
    </conditionalContent>
  </p>

  <p>Require numeric matches: <boolean name="requireNumeric">
    <matchesPattern name="requireNumeric1" pattern="$pattern1" requireNumericMatches allowImplicitIdentities>$expr</matchesPattern>
    or <matchesPattern name="requireNumeric2" pattern="$pattern2" requireNumericMatches allowImplicitIdentities>$expr</matchesPattern>
  </boolean></p>
  <p>Matches: 
    <conditionalContent assignNames="(rnm1 rnm2 rnm3)" maximumNumberToShow="1">
      <case condition="$requireNumeric1">$requireNumeric1.patternMatches[1] $requireNumeric1.patternMatches[2] $requireNumeric1.patternMatch3</case>
      <case condition="$requireNumeric2">$requireNumeric2.patternMatches[1] <math>0</math> $requireNumeric2.patternMatch2</case>
    </conditionalContent>
  </p>
  
  <p>Anything except x: <boolean name="excludeX">
    <matchesPattern name="excludeX1" pattern="$pattern1" excludeMatches="x" allowImplicitIdentities>$expr</matchesPattern>
    or <matchesPattern name="excludeX2" pattern="$pattern2" excludeMatches="x" allowImplicitIdentities>$expr</matchesPattern>
  </boolean></p>
  <p>Matches: 
    <conditionalContent assignNames="(exm1 exm2 exm3)" maximumNumberToShow="1">
      <case condition="$excludeX1">$excludeX1.patternMatches[1] $excludeX1.patternMatches[2] $excludeX1.patternMatch3</case>
      <case condition="$excludeX2">$excludeX2.patternMatches[1] <math>0</math> $excludeX2.patternMatch2</case>
    </conditionalContent>
  </p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let matchNames = {
      base: ["bm1", "bm2", "bm3"],
      requireNumeric: ["rnm1", "rnm2", "rnm3"],
      excludeX: ["exm1", "exm2", "exm3"],
    };

    let desiredResults = {
      "": {
        base: false,
        requireNumeric: false,
        excludeX: false,
      },
      "x^2": {
        base: [1, 0, 0],
        requireNumeric: [1, 0, 0],
        excludeX: [1, 0, 0],
      },
      "x^2{rightArrow}+x": {
        base: [1, 1, 0],
        requireNumeric: [1, 1, 0],
        excludeX: [1, 1, 0],
      },
      "x^2{rightArrow}+x+1": {
        base: [1, 1, 1],
        requireNumeric: [1, 1, 1],
        excludeX: [1, 1, 1],
      },
      "3x^2{rightArrow}-5x+pi": {
        base: [3, "−5", "pi"],
        requireNumeric: [3, "−5", "pi"],
        excludeX: [3, "−5", "pi"],
      },
      "ax^2{rightArrow}+bx+c": {
        base: ["a", "b", "c"],
        requireNumeric: false,
        excludeX: ["a", "b", "c"],
      },
      "ax^2{rightArrow}+c": {
        base: ["a", "0", "c"],
        requireNumeric: false,
        excludeX: ["a", "0", "c"],
      },
      "xx^2{rightArrow}+c": {
        base: ["x", "0", "c"],
        requireNumeric: false,
        excludeX: false,
      },
      "xx^2{rightArrow}+bx+c": {
        base: ["x", "b", "c"],
        requireNumeric: false,
        excludeX: false,
      },
      "3/2{rightArrow}x^2{rightArrow}+5/7{rightArrow}x+2/3": {
        base: ["32", "57", "23"],
        requireNumeric: ["32", "57", "23"],
        excludeX: ["32", "57", "23"],
      },
      "3/2{rightArrow}x^2{rightArrow}+2/3": {
        base: ["32", "0", "23"],
        requireNumeric: ["32", "0", "23"],
        excludeX: ["32", "0", "23"],
      },
    };

    let b = false;

    for (let expr in desiredResults) {
      cy.log(`trying: ${expr}`);
      cy.get(cesc("#\\/expr") + " textarea").type(
        `{ctrl+home}{ctrl+shift+end}{backspace}${expr}{enter}`,
        { force: true },
      );
      cy.get(cesc("#\\/bi")).click();
      b = !b;
      cy.get(cesc("#\\/b")).should("have.text", b.toString()); // to make sure change occured

      let dResults = desiredResults[expr];

      for (let name in dResults) {
        let res = dResults[name];
        if (res) {
          cy.get(cesc(`#\\/${name}`)).should("have.text", "true");
          cy.get(cesc(`#\\/${matchNames[name][0]}`) + ` .mjx-mrow`)
            .eq(0)
            .should("have.text", res[0]);
          cy.get(cesc(`#\\/${matchNames[name][1]}`) + ` .mjx-mrow`)
            .eq(0)
            .should("have.text", res[1]);
        } else {
          cy.get(cesc(`#\\/${name}`)).should("have.text", "false");
          cy.get(cesc(`#\\/${matchNames[name][0]}`)).should("not.exist");
          cy.get(cesc(`#\\/${matchNames[name][1]}`)).should("not.exist");
        }
      }
    }
  });

  it("handle case with no pattern specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><matchesPattern name="mp">hello</matchesPattern></p>


  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/mp")).should("have.text", "false");
  });

  it("works with string or multiple children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><matchesPattern name="mps" pattern="()^()">e^(x+2)</matchesPattern></p>
  <p>Matches: <copy source="mps.patternMatches" assignNames="mpsm1 mpsm2" /></p>
  <p><matchesPattern name="mpm" pattern="()^()">e^(<math>x</math>+<math>2</math>)</matchesPattern></p>
  <p>Matches: <copy source="mpm.patternMatches" assignNames="mpmm1 mpmm2" /></p>


  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/mps")).should("have.text", "true");
    cy.get(cesc("#\\/mpsm1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "e");
    cy.get(cesc("#\\/mpsm2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+2");
    cy.get(cesc("#\\/mpm")).should("have.text", "true");
    cy.get(cesc("#\\/mpmm1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "e");
    cy.get(cesc("#\\/mpmm2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+2");
  });

  it("match expression with blanks", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>Pattern: <math name="pattern"> < </math></p>
  <p>Expression: <mathinput name="expr" /></p>
  <p><booleanInput name="matchBlanks"><label>Match expression with blanks</label></booleanInput> <boolean name="matchBlanks2" copySource="matchBlanks" /></p>

  <p>Matches: <matchesPattern name="match" pattern="$pattern" matchExpressionWithBlanks="$matchBlanks">
    $expr
  </matchesPattern></p>
  <p>Matches: <copy source="match.patternMatches" assignNames="m1 m2" /></p>


  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let desiredResults = {
      "": {
        default: false,
        blanks: false,
      },
      "<": {
        default: false,
        blanks: ["\uff3f", "\uff3f"],
      },
      ">": {
        default: false,
        blanks: ["\uff3f", "\uff3f"],
      },
      "x<y": {
        default: ["x", "y"],
        blanks: ["x", "y"],
      },
      "x>y": {
        default: ["y", "x"],
        blanks: ["y", "x"],
      },
      "a>": {
        default: false,
        blanks: ["\uff3f", "a"],
      },
      "a<": {
        default: false,
        blanks: ["a", "\uff3f"],
      },
      ">c": {
        default: false,
        blanks: ["c", "\uff3f"],
      },
      "<c": {
        default: false,
        blanks: ["\uff3f", "c"],
      },
      "q/r{rightArrow} < st": {
        default: ["qr", "st"],
        blanks: ["qr", "st"],
      },
      "q/{rightArrow}  < st": {
        default: false,
        blanks: ["q\uff3f", "st"],
      },
    };

    for (let expr in desiredResults) {
      cy.log(`trying: ${expr}`);
      cy.get(cesc("#\\/expr") + " textarea").type(
        `{ctrl+home}{ctrl+shift+end}{backspace}${expr}{enter}`,
        { force: true },
      );
      cy.get(cesc("#\\/matchBlanks")).click();
      cy.get(cesc("#\\/matchBlanks2")).should("have.text", "true"); // to make sure change occured

      let dResults = desiredResults[expr];

      let res = dResults.blanks;
      if (res) {
        cy.get(cesc(`#\\/match`)).should("have.text", "true");
        cy.get(cesc(`#\\/m1`) + ` .mjx-mrow`)
          .eq(0)
          .should("have.text", res[0]);
        cy.get(cesc(`#\\/m2`) + ` .mjx-mrow`)
          .eq(0)
          .should("have.text", res[1]);
      } else {
        cy.get(cesc(`#\\/match`)).should("have.text", "false");
        cy.get(cesc(`#\\/m1`)).should("not.exist");
        cy.get(cesc(`#\\/m2`)).should("not.exist");
      }

      cy.get(cesc("#\\/matchBlanks")).click();
      cy.get(cesc("#\\/matchBlanks2")).should("have.text", "false"); // to make sure change occured

      res = dResults.default;
      if (res) {
        cy.get(cesc(`#\\/match`)).should("have.text", "true");
        cy.get(cesc(`#\\/m1`) + ` .mjx-mrow`)
          .eq(0)
          .should("have.text", res[0]);
        cy.get(cesc(`#\\/m2`) + ` .mjx-mrow`)
          .eq(0)
          .should("have.text", res[1]);
      } else {
        cy.get(cesc(`#\\/match`)).should("have.text", "false");
        cy.get(cesc(`#\\/m1`)).should("not.exist");
        cy.get(cesc(`#\\/m2`)).should("not.exist");
      }
    }
  });
});
