import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Basic copy assignName Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  // Note: this isn't using assignNames anymore given changes to how copies work
  it("recursively copying and naming text", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text name="a">hello</text>
  $a{name="b"}
  $b{name="c"}
  $c{name="d"}
  $c{name="e"}
  $e{name="f"}
  $f{name="g"}
  $g{name="h"}
  $h{name="i"}

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/a")).should("have.text", "hello");
    cy.get(cesc("#\\/b")).should("have.text", "hello");
    cy.get(cesc("#\\/c")).should("have.text", "hello");
    cy.get(cesc("#\\/d")).should("have.text", "hello");
    cy.get(cesc("#\\/e")).should("have.text", "hello");
    cy.get(cesc("#\\/f")).should("have.text", "hello");
    cy.get(cesc("#\\/g")).should("have.text", "hello");
    cy.get(cesc("#\\/h")).should("have.text", "hello");
    cy.get(cesc("#\\/i")).should("have.text", "hello");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/a"].stateValues.value).eq("hello");
      expect(stateVariables["/b"].stateValues.value).eq("hello");
      expect(stateVariables["/c"].stateValues.value).eq("hello");
      expect(stateVariables["/d"].stateValues.value).eq("hello");
      expect(stateVariables["/e"].stateValues.value).eq("hello");
      expect(stateVariables["/f"].stateValues.value).eq("hello");
      expect(stateVariables["/g"].stateValues.value).eq("hello");
      expect(stateVariables["/h"].stateValues.value).eq("hello");
      expect(stateVariables["/i"].stateValues.value).eq("hello");
    });
  });

  it("assign name to prop", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <math>x+x</math>
  $_math1.simplify{name="cp1" assignNames="s1"}
  $s1{name="s2"}
  $cp1{assignNames="s3"}

  <math name="m1" copySource="_math1" simplify="full" />
  $m1.simplify{name="cp5" assignNames="s4" target="m1" }
  $s4{name="s5"}
  $cp5{assignNames="s6"}

  <extract name="ex1" prop="simplify" assignNames="s7">$_math1</extract>
  $s7{name="s8"}
  $ex1{assignNames="s9"}
  <extract name="ex2" prop="simplify" assignNames="s10">$m1</extract>
  $s10{name="s11"}
  $ex2{assignNames="s12"}

  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_math1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");
    cy.get(cesc2("#/s1")).should("have.text", "none");
    cy.get(cesc2("#/s2")).should("have.text", "none");
    cy.get(cesc2("#/s3")).should("have.text", "none");

    cy.get(cesc2("#/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/s4")).should("have.text", "full");
    cy.get(cesc2("#/s5")).should("have.text", "full");
    cy.get(cesc2("#/s6")).should("have.text", "full");

    cy.get(cesc2("#/s7")).should("have.text", "none");
    cy.get(cesc2("#/s8")).should("have.text", "none");
    cy.get(cesc2("#/s9")).should("have.text", "none");
    cy.get(cesc2("#/s10")).should("have.text", "full");
    cy.get(cesc2("#/s11")).should("have.text", "full");
    cy.get(cesc2("#/s12")).should("have.text", "full");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_math1"].stateValues.value).eqls(["+", "x", "x"]);
      expect(stateVariables["/s1"].stateValues.value).eq("none");
      expect(stateVariables["/s2"].stateValues.value).eq("none");
      expect(stateVariables["/s3"].stateValues.value).eq("none");

      expect(stateVariables["/m1"].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables["/s4"].stateValues.value).eq("full");
      expect(stateVariables["/s5"].stateValues.value).eq("full");
      expect(stateVariables["/s6"].stateValues.value).eq("full");

      expect(stateVariables["/s7"].stateValues.value).eq("none");
      expect(stateVariables["/s8"].stateValues.value).eq("none");
      expect(stateVariables["/s9"].stateValues.value).eq("none");
      expect(stateVariables["/s10"].stateValues.value).eq("full");
      expect(stateVariables["/s11"].stateValues.value).eq("full");
      expect(stateVariables["/s12"].stateValues.value).eq("full");
    });
  });

  it("assign names to array prop", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <line through="(0,0) (1,1)" />
  </graph>

  $_line1.points{name="pts" assignNames="b c"}

  <graph>
    $b{name="b1"}
    $c{name="c1"}
  </graph>

  <graph>
    $pts{assignNames="d e"}
  </graph>

  $d{name="f"}
  $e{name="g"}

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,1)");
    cy.get(cesc("#\\/f") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/g") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("y=x"))).to.be.true;

      expect(stateVariables["/b"].stateValues.xs).eqls([0, 0]);
      expect(stateVariables["/c"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([0, 0]);
      expect(stateVariables["/c1"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/d"].stateValues.xs).eqls([0, 0]);
      expect(stateVariables["/e"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/f"].stateValues.xs).eqls([0, 0]);
      expect(stateVariables["/g"].stateValues.xs).eqls([1, 1]);
    });

    cy.log("move point b");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b",
        args: { x: 5, y: -5 },
      });
    });
    cy.get(cesc("#\\/b") + " .mjx-mrow").should("contain.text", "(5,−5)");
    cy.get(cesc("#\\/b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,−5)");
    cy.get(cesc("#\\/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,1)");
    cy.get(cesc("#\\/f") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,−5)");
    cy.get(cesc("#\\/g") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/b"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/c"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/c1"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/d"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/e"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/f"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/g"].stateValues.xs).eqls([1, 1]);
    });

    cy.log("move point c");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/c",
        args: { x: 3, y: 4 },
      });
    });
    cy.get(cesc("#\\/b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,−5)");
    cy.get(cesc("#\\/c") + " .mjx-mrow").should("contain.text", "(3,4)");
    cy.get(cesc("#\\/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.get(cesc("#\\/f") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,−5)");
    cy.get(cesc("#\\/g") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/b"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/c"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/c1"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/d"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/e"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/f"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/g"].stateValues.xs).eqls([3, 4]);
    });

    cy.log("move point b1");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b1",
        args: { x: -9, y: -8 },
      });
    });
    cy.get(cesc("#\\/b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−9,−8)");
    cy.get(cesc("#\\/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.get(cesc("#\\/f") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−9,−8)");
    cy.get(cesc("#\\/g") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/b"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/c"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/c1"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/d"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/e"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/f"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/g"].stateValues.xs).eqls([3, 4]);
    });

    cy.log("move point c1");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/c1",
        args: { x: -1, y: -3 },
      });
    });
    cy.get(cesc("#\\/b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−9,−8)");
    cy.get(cesc("#\\/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−1,−3)");
    cy.get(cesc("#\\/f") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−9,−8)");
    cy.get(cesc("#\\/g") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−1,−3)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/b"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/c"].stateValues.xs).eqls([-1, -3]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/c1"].stateValues.xs).eqls([-1, -3]);
      expect(stateVariables["/d"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/e"].stateValues.xs).eqls([-1, -3]);
      expect(stateVariables["/f"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/g"].stateValues.xs).eqls([-1, -3]);
    });

    cy.log("move point d");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/d",
        args: { x: 0, y: 2 },
      });
    });
    cy.get(cesc("#\\/b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,2)");
    cy.get(cesc("#\\/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−1,−3)");
    cy.get(cesc("#\\/f") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,2)");
    cy.get(cesc("#\\/g") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−1,−3)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/b"].stateValues.xs).eqls([0, 2]);
      expect(stateVariables["/c"].stateValues.xs).eqls([-1, -3]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([0, 2]);
      expect(stateVariables["/c1"].stateValues.xs).eqls([-1, -3]);
      expect(stateVariables["/d"].stateValues.xs).eqls([0, 2]);
      expect(stateVariables["/e"].stateValues.xs).eqls([-1, -3]);
      expect(stateVariables["/f"].stateValues.xs).eqls([0, 2]);
      expect(stateVariables["/g"].stateValues.xs).eqls([-1, -3]);
    });

    cy.log("move point e");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/e",
        args: { x: 5, y: 4 },
      });
    });
    cy.get(cesc("#\\/b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,2)");
    cy.get(cesc("#\\/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,4)");
    cy.get(cesc("#\\/f") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,2)");
    cy.get(cesc("#\\/g") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,4)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/b"].stateValues.xs).eqls([0, 2]);
      expect(stateVariables["/c"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([0, 2]);
      expect(stateVariables["/c1"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/d"].stateValues.xs).eqls([0, 2]);
      expect(stateVariables["/e"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/f"].stateValues.xs).eqls([0, 2]);
      expect(stateVariables["/g"].stateValues.xs).eqls([5, 4]);
    });

    cy.log("move point f");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/f",
        args: { x: 6, y: 7 },
      });
    });
    cy.get(cesc("#\\/b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,4)");
    cy.get(cesc("#\\/f") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/g") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,4)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/b"].stateValues.xs).eqls([6, 7]);
      expect(stateVariables["/c"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([6, 7]);
      expect(stateVariables["/c1"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/d"].stateValues.xs).eqls([6, 7]);
      expect(stateVariables["/e"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/f"].stateValues.xs).eqls([6, 7]);
      expect(stateVariables["/g"].stateValues.xs).eqls([5, 4]);
    });

    cy.log("move point g");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g",
        args: { x: 9, y: 3 },
      });
    });
    cy.get(cesc("#\\/b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,3)");
    cy.get(cesc("#\\/f") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/g") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,3)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/b"].stateValues.xs).eqls([6, 7]);
      expect(stateVariables["/c"].stateValues.xs).eqls([9, 3]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([6, 7]);
      expect(stateVariables["/c1"].stateValues.xs).eqls([9, 3]);
      expect(stateVariables["/d"].stateValues.xs).eqls([6, 7]);
      expect(stateVariables["/e"].stateValues.xs).eqls([9, 3]);
      expect(stateVariables["/f"].stateValues.xs).eqls([6, 7]);
      expect(stateVariables["/g"].stateValues.xs).eqls([9, 3]);
    });
  });

  it("assign names to length-1 array prop", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <line through="(0,0) (1,1)" />
  </graph>

  $_line1.point1{name="cp1" assignNames="b"}

  <graph>
    $b{name="b1"}
  </graph>

  <graph>
    $cp1{assignNames="d"}
  </graph>

  $d{name="f"}

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/b") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/f") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("y=x"))).to.be.true;

      expect(stateVariables["/b"].stateValues.xs).eqls([0, 0]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([0, 0]);
      expect(stateVariables["/d"].stateValues.xs).eqls([0, 0]);
      expect(stateVariables["/f"].stateValues.xs).eqls([0, 0]);
    });

    cy.log("move point b");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b",
        args: { x: 5, y: -5 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      cy.get(cesc("#\\/b") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(5,−5)");
      cy.get(cesc("#\\/f") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(5,−5)");
      expect(stateVariables["/b"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/d"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/f"].stateValues.xs).eqls([5, -5]);
    });

    cy.log("move point b1");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b1",
        args: { x: -9, y: -8 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      cy.get(cesc("#\\/b") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(−9,−8)");
      cy.get(cesc("#\\/f") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(−9,−8)");
      expect(stateVariables["/b"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/d"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/f"].stateValues.xs).eqls([-9, -8]);
    });

    cy.log("move point d");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/d",
        args: { x: 0, y: 2 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      cy.get(cesc("#\\/b") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,2)");
      cy.get(cesc("#\\/f") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,2)");
      expect(stateVariables["/b"].stateValues.xs).eqls([0, 2]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([0, 2]);
      expect(stateVariables["/d"].stateValues.xs).eqls([0, 2]);
      expect(stateVariables["/f"].stateValues.xs).eqls([0, 2]);
    });

    cy.log("move point f");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/f",
        args: { x: 6, y: 7 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      cy.get(cesc("#\\/b") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(6,7)");
      cy.get(cesc("#\\/f") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(6,7)");
      expect(stateVariables["/b"].stateValues.xs).eqls([6, 7]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([6, 7]);
      expect(stateVariables["/d"].stateValues.xs).eqls([6, 7]);
      expect(stateVariables["/f"].stateValues.xs).eqls([6, 7]);
    });
  });

  it("assign names to prop of array prop", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

  <graph>
    <line through="(0,0) (1,1)" />
  </graph>

  <graph>
    $_line1.points{name="pts" assignNames="b c"}
  </graph>

  <p>xs of points: $pts.x{assignNames="d e"}</p>

  <p>
    xs again: $d{name="f"}
    $e{name="g"}
  </p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/d") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc("#\\/e") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc("#\\/f") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc("#\\/g") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("y=x"))).to.be.true;

      expect(stateVariables["/b"].stateValues.xs).eqls([0, 0]);
      expect(stateVariables["/c"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/d"].stateValues.value).eq(0);
      expect(stateVariables["/e"].stateValues.value).eq(1);
      expect(stateVariables["/f"].stateValues.value).eq(0);
      expect(stateVariables["/g"].stateValues.value).eq(1);
    });

    cy.log("move point b");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b",
        args: { x: 5, y: -5 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      cy.get(cesc("#\\/d") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "5");
      cy.get(cesc("#\\/e") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
      cy.get(cesc("#\\/f") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "5");
      cy.get(cesc("#\\/g") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
      expect(stateVariables["/b"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/c"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/d"].stateValues.value).eq(5);
      expect(stateVariables["/e"].stateValues.value).eq(1);
      expect(stateVariables["/f"].stateValues.value).eq(5);
      expect(stateVariables["/g"].stateValues.value).eq(1);
    });

    cy.log("move point c");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/c",
        args: { x: 3, y: 4 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      cy.get(cesc("#\\/d") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "5");
      cy.get(cesc("#\\/e") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "3");
      cy.get(cesc("#\\/f") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "5");
      cy.get(cesc("#\\/g") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "3");
      expect(stateVariables["/b"].stateValues.xs).eqls([5, -5]);
      expect(stateVariables["/c"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/d"].stateValues.value).eq(5);
      expect(stateVariables["/e"].stateValues.value).eq(3);
      expect(stateVariables["/f"].stateValues.value).eq(5);
      expect(stateVariables["/g"].stateValues.value).eq(3);
    });
  });

  it("cannot assign subnames to array prop", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <graph>
    <line through="(0,0) (1,1)" />
  </graph>

  $_line1.points{name="pts" assignNames="(a1 a2) (b1 b2)"}
  
  <p name="n1">nothing 1: $a1</p>
  <p name="n2">nothing 2: $a2</p>
  <p name="n3">nothing 3: $b1</p>
  <p name="n4">nothing 4: $b2</p>

  <graph>
    $pts{name="ptsa" assignNames="c d"}
  </graph>

  $c{name="e"}
  $d{name="f"}

  $pts{name="ptsb" assignNames="(g1 g2) (h1 h2)"}

  <p name="n5">nothing 5: $g1</p>
  <p name="n6">nothing 6: $g2</p>
  <p name="n7">nothing 7: $h1</p>
  <p name="n8">nothing 8: $h2</p>

  $ptsa{name="ptsc" assignNames="(i1 i2) (j1 j2)"}

  <p name="n9">nothing 9: $i1</p>
  <p name="n10">nothing 10: $i2</p>
  <p name="n11">nothing 11: $j1</p>
  <p name="n12">nothing 12: $j2</p>


  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let point1Anchor = cesc2(
        "#" + stateVariables["/pts"].replacements[0].componentName,
      );
      let point2Anchor = cesc2(
        "#" + stateVariables["/pts"].replacements[1].componentName,
      );
      let point1aAnchor = cesc2(
        "#" + stateVariables["/ptsb"].replacements[0].componentName,
      );
      let point2aAnchor = cesc2(
        "#" + stateVariables["/ptsb"].replacements[1].componentName,
      );
      let point1bAnchor = cesc2(
        "#" + stateVariables["/ptsc"].replacements[0].componentName,
      );
      let point2bAnchor = cesc2(
        "#" + stateVariables["/ptsc"].replacements[1].componentName,
      );

      cy.get(point1Anchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(point2Anchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,1)");

      cy.get(cesc("#\\/n1")).should("have.text", "nothing 1: ");
      cy.get(cesc("#\\/n2")).should("have.text", "nothing 2: ");
      cy.get(cesc("#\\/n3")).should("have.text", "nothing 3: ");
      cy.get(cesc("#\\/n4")).should("have.text", "nothing 4: ");

      cy.get(cesc("#\\/e") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(cesc("#\\/f") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,1)");

      cy.get(point1aAnchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(point2aAnchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,1)");

      cy.get(cesc("#\\/n5")).should("have.text", "nothing 5: ");
      cy.get(cesc("#\\/n6")).should("have.text", "nothing 6: ");
      cy.get(cesc("#\\/n7")).should("have.text", "nothing 7: ");
      cy.get(cesc("#\\/n8")).should("have.text", "nothing 8: ");

      cy.get(point1bAnchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(point2bAnchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,1)");

      cy.get(cesc("#\\/n9")).should("have.text", "nothing 9: ");
      cy.get(cesc("#\\/n10")).should("have.text", "nothing 10: ");
      cy.get(cesc("#\\/n11")).should("have.text", "nothing 11: ");
      cy.get(cesc("#\\/n12")).should("have.text", "nothing 12: ");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(
          stateVariables["/_line1"].stateValues.equation,
        );
        expect(unproxiedEquation.equals(me.fromText("y=x"))).to.be.true;

        expect(stateVariables["/c"].stateValues.xs).eqls([0, 0]);
        expect(stateVariables["/d"].stateValues.xs).eqls([1, 1]);
        expect(stateVariables["/e"].stateValues.xs).eqls([0, 0]);
        expect(stateVariables["/f"].stateValues.xs).eqls([1, 1]);
      });

      cy.log("move point c");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/c",
          args: { x: 5, y: -5 },
        });
        let stateVariables = await win.returnAllStateVariables1();
        cy.get(point1Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(1,1)");
        cy.get(point1aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(1,1)");
        cy.get(point1bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(1,1)");
        cy.get(cesc("#\\/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(cesc("#\\/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(1,1)");
        cy.get(cesc("#\\/n1")).should("have.text", "nothing 1: ");
        cy.get(cesc("#\\/n2")).should("have.text", "nothing 2: ");
        cy.get(cesc("#\\/n3")).should("have.text", "nothing 3: ");
        cy.get(cesc("#\\/n4")).should("have.text", "nothing 4: ");
        cy.get(cesc("#\\/n5")).should("have.text", "nothing 5: ");
        cy.get(cesc("#\\/n6")).should("have.text", "nothing 6: ");
        cy.get(cesc("#\\/n7")).should("have.text", "nothing 7: ");
        cy.get(cesc("#\\/n8")).should("have.text", "nothing 8: ");
        cy.get(cesc("#\\/n9")).should("have.text", "nothing 9: ");
        cy.get(cesc("#\\/n10")).should("have.text", "nothing 10: ");
        cy.get(cesc("#\\/n11")).should("have.text", "nothing 11: ");
        cy.get(cesc("#\\/n12")).should("have.text", "nothing 12: ");

        expect(stateVariables["/c"].stateValues.xs).eqls([5, -5]);
        expect(stateVariables["/d"].stateValues.xs).eqls([1, 1]);
        expect(stateVariables["/e"].stateValues.xs).eqls([5, -5]);
        expect(stateVariables["/f"].stateValues.xs).eqls([1, 1]);
      });

      cy.log("move point d");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/d",
          args: { x: 3, y: 4 },
        });
        let stateVariables = await win.returnAllStateVariables1();
        cy.get(point1Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(point1aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(point1bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(cesc("#\\/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(cesc("#\\/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(cesc("#\\/n1")).should("have.text", "nothing 1: ");
        cy.get(cesc("#\\/n2")).should("have.text", "nothing 2: ");
        cy.get(cesc("#\\/n3")).should("have.text", "nothing 3: ");
        cy.get(cesc("#\\/n4")).should("have.text", "nothing 4: ");
        cy.get(cesc("#\\/n5")).should("have.text", "nothing 5: ");
        cy.get(cesc("#\\/n6")).should("have.text", "nothing 6: ");
        cy.get(cesc("#\\/n7")).should("have.text", "nothing 7: ");
        cy.get(cesc("#\\/n8")).should("have.text", "nothing 8: ");
        cy.get(cesc("#\\/n9")).should("have.text", "nothing 9: ");
        cy.get(cesc("#\\/n10")).should("have.text", "nothing 10: ");
        cy.get(cesc("#\\/n11")).should("have.text", "nothing 11: ");
        cy.get(cesc("#\\/n12")).should("have.text", "nothing 12: ");

        expect(stateVariables["/c"].stateValues.xs).eqls([5, -5]);
        expect(stateVariables["/d"].stateValues.xs).eqls([3, 4]);
        expect(stateVariables["/e"].stateValues.xs).eqls([5, -5]);
        expect(stateVariables["/f"].stateValues.xs).eqls([3, 4]);
      });

      cy.log("move point e");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/e",
          args: { x: -9, y: -8 },
        });
        let stateVariables = await win.returnAllStateVariables1();
        cy.get(point1Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(point1aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(point1bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(cesc("#\\/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(cesc("#\\/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(cesc("#\\/n1")).should("have.text", "nothing 1: ");
        cy.get(cesc("#\\/n2")).should("have.text", "nothing 2: ");
        cy.get(cesc("#\\/n3")).should("have.text", "nothing 3: ");
        cy.get(cesc("#\\/n4")).should("have.text", "nothing 4: ");
        cy.get(cesc("#\\/n5")).should("have.text", "nothing 5: ");
        cy.get(cesc("#\\/n6")).should("have.text", "nothing 6: ");
        cy.get(cesc("#\\/n7")).should("have.text", "nothing 7: ");
        cy.get(cesc("#\\/n8")).should("have.text", "nothing 8: ");
        cy.get(cesc("#\\/n9")).should("have.text", "nothing 9: ");
        cy.get(cesc("#\\/n10")).should("have.text", "nothing 10: ");
        cy.get(cesc("#\\/n11")).should("have.text", "nothing 11: ");
        cy.get(cesc("#\\/n12")).should("have.text", "nothing 12: ");

        expect(stateVariables["/c"].stateValues.xs).eqls([-9, -8]);
        expect(stateVariables["/d"].stateValues.xs).eqls([3, 4]);
        expect(stateVariables["/e"].stateValues.xs).eqls([-9, -8]);
        expect(stateVariables["/f"].stateValues.xs).eqls([3, 4]);
      });

      cy.log("move point f");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/f",
          args: { x: -1, y: -3 },
        });
        let stateVariables = await win.returnAllStateVariables1();
        cy.get(point1Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−1,−3)");
        cy.get(point1aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−1,−3)");
        cy.get(point1bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−1,−3)");
        cy.get(cesc("#\\/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(cesc("#\\/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−1,−3)");
        cy.get(cesc("#\\/n1")).should("have.text", "nothing 1: ");
        cy.get(cesc("#\\/n2")).should("have.text", "nothing 2: ");
        cy.get(cesc("#\\/n3")).should("have.text", "nothing 3: ");
        cy.get(cesc("#\\/n4")).should("have.text", "nothing 4: ");
        cy.get(cesc("#\\/n5")).should("have.text", "nothing 5: ");
        cy.get(cesc("#\\/n6")).should("have.text", "nothing 6: ");
        cy.get(cesc("#\\/n7")).should("have.text", "nothing 7: ");
        cy.get(cesc("#\\/n8")).should("have.text", "nothing 8: ");
        cy.get(cesc("#\\/n9")).should("have.text", "nothing 9: ");
        cy.get(cesc("#\\/n10")).should("have.text", "nothing 10: ");
        cy.get(cesc("#\\/n11")).should("have.text", "nothing 11: ");
        cy.get(cesc("#\\/n12")).should("have.text", "nothing 12: ");

        expect(stateVariables["/c"].stateValues.xs).eqls([-9, -8]);
        expect(stateVariables["/d"].stateValues.xs).eqls([-1, -3]);
        expect(stateVariables["/e"].stateValues.xs).eqls([-9, -8]);
        expect(stateVariables["/f"].stateValues.xs).eqls([-1, -3]);
      });
    });
  });

  it("cannot assign subnames to array prop, inside namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <section name="hello" newNamespace ><title>hello</title>
  <graph>
    <line through="(0,0) (1,1)" />
  </graph>

  $_line1.points{name="pts" assignNames="(a1 a2) (b1 b2)"}
  
  <p name="n1">nothing 1: $a1</p>
  <p name="n2">nothing 2: $a2</p>
  <p name="n3">nothing 3: $b1</p>
  <p name="n4">nothing 4: $b2</p>

  <graph>
    $pts{name="ptsa" assignNames="c d"}
  </graph>

  $c{name="e"}
  $d{name="f"}

  $pts{name="ptsb" assignNames="(g1 g2) (h1 h2)"}
  
  <p name="n5">nothing 5: $g1</p>
  <p name="n6">nothing 6: $g2</p>
  <p name="n7">nothing 7: $h1</p>
  <p name="n8">nothing 8: $h2</p>

  $ptsa{name="ptsc" assignNames="(i1 i2) (j1 j2)"}
  
  <p name="n9">nothing 9: $i1</p>
  <p name="n10">nothing 10: $i2</p>
  <p name="n11">nothing 11: $j1</p>
  <p name="n12">nothing 12: $j2</p>
  
  </section>

  $(hello/e{name="e"})
  $(hello/f{name="f"})

  <p name="n13">nothing 13: $(hello/i1)</p>
  <p name="n14">nothing 14: $(hello/i2)</p>
  <p name="n15">nothing 15: $(hello/j1)</p>
  <p name="n16">nothing 16: $(hello/j2)</p>
  

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let point1Anchor = cesc2(
        "#" + stateVariables["/hello/pts"].replacements[0].componentName,
      );
      let point2Anchor = cesc2(
        "#" + stateVariables["/hello/pts"].replacements[1].componentName,
      );
      let point1aAnchor = cesc2(
        "#" + stateVariables["/hello/ptsb"].replacements[0].componentName,
      );
      let point2aAnchor = cesc2(
        "#" + stateVariables["/hello/ptsb"].replacements[1].componentName,
      );
      let point1bAnchor = cesc2(
        "#" + stateVariables["/hello/ptsc"].replacements[0].componentName,
      );
      let point2bAnchor = cesc2(
        "#" + stateVariables["/hello/ptsc"].replacements[1].componentName,
      );

      cy.get(point1Anchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(point2Anchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,1)");

      cy.get(cesc2("#/hello/n1")).should("have.text", "nothing 1: ");
      cy.get(cesc2("#/hello/n2")).should("have.text", "nothing 2: ");
      cy.get(cesc2("#/hello/n3")).should("have.text", "nothing 3: ");
      cy.get(cesc2("#/hello/n4")).should("have.text", "nothing 4: ");

      cy.get(cesc2("#/hello/e") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(cesc2("#/hello/f") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,1)");

      cy.get(point1aAnchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(point2aAnchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,1)");

      cy.get(cesc2("#/hello/n5")).should("have.text", "nothing 5: ");
      cy.get(cesc2("#/hello/n6")).should("have.text", "nothing 6: ");
      cy.get(cesc2("#/hello/n7")).should("have.text", "nothing 7: ");
      cy.get(cesc2("#/hello/n8")).should("have.text", "nothing 8: ");

      cy.get(point1bAnchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(point2bAnchor + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,1)");

      cy.get(cesc2("#/hello/n9")).should("have.text", "nothing 9: ");
      cy.get(cesc2("#/hello/n10")).should("have.text", "nothing 10: ");
      cy.get(cesc2("#/hello/n11")).should("have.text", "nothing 11: ");
      cy.get(cesc2("#/hello/n12")).should("have.text", "nothing 12: ");

      cy.get(cesc2("#/e") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(cesc2("#/f") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,1)");

      cy.get(cesc2("#/n13")).should("have.text", "nothing 13: ");
      cy.get(cesc2("#/n14")).should("have.text", "nothing 14: ");
      cy.get(cesc2("#/n15")).should("have.text", "nothing 15: ");
      cy.get(cesc2("#/n16")).should("have.text", "nothing 16: ");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(
          stateVariables["/hello/_line1"].stateValues.equation,
        );
        expect(unproxiedEquation.equals(me.fromText("y=x"))).to.be.true;

        expect(stateVariables["/hello/c"].stateValues.xs).eqls([0, 0]);
        expect(stateVariables["/hello/d"].stateValues.xs).eqls([1, 1]);
        expect(stateVariables["/hello/e"].stateValues.xs).eqls([0, 0]);
        expect(stateVariables["/hello/f"].stateValues.xs).eqls([1, 1]);
        expect(stateVariables["/e"].stateValues.xs).eqls([0, 0]);
        expect(stateVariables["/f"].stateValues.xs).eqls([1, 1]);
      });

      cy.log("move point c");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/hello/c",
          args: { x: 5, y: -5 },
        });
        let stateVariables = await win.returnAllStateVariables1();
        cy.get(point1Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(1,1)");
        cy.get(point1aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(1,1)");
        cy.get(point1bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(1,1)");
        cy.get(cesc2("#/hello/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(cesc2("#/hello/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(1,1)");
        cy.get(cesc2("#/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(cesc2("#/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(1,1)");
        cy.get(cesc2("#/hello/n1")).should("have.text", "nothing 1: ");
        cy.get(cesc2("#/hello/n2")).should("have.text", "nothing 2: ");
        cy.get(cesc2("#/hello/n3")).should("have.text", "nothing 3: ");
        cy.get(cesc2("#/hello/n4")).should("have.text", "nothing 4: ");
        cy.get(cesc2("#/hello/n5")).should("have.text", "nothing 5: ");
        cy.get(cesc2("#/hello/n6")).should("have.text", "nothing 6: ");
        cy.get(cesc2("#/hello/n7")).should("have.text", "nothing 7: ");
        cy.get(cesc2("#/hello/n8")).should("have.text", "nothing 8: ");
        cy.get(cesc2("#/hello/n9")).should("have.text", "nothing 9: ");
        cy.get(cesc2("#/hello/n10")).should("have.text", "nothing 10: ");
        cy.get(cesc2("#/hello/n11")).should("have.text", "nothing 11: ");
        cy.get(cesc2("#/hello/n12")).should("have.text", "nothing 12: ");
        cy.get(cesc2("#/n13")).should("have.text", "nothing 13: ");
        cy.get(cesc2("#/n14")).should("have.text", "nothing 14: ");
        cy.get(cesc2("#/n15")).should("have.text", "nothing 15: ");
        cy.get(cesc2("#/n16")).should("have.text", "nothing 16: ");

        expect(stateVariables["/hello/c"].stateValues.xs).eqls([5, -5]);
        expect(stateVariables["/hello/d"].stateValues.xs).eqls([1, 1]);
        expect(stateVariables["/hello/e"].stateValues.xs).eqls([5, -5]);
        expect(stateVariables["/hello/f"].stateValues.xs).eqls([1, 1]);
        expect(stateVariables["/e"].stateValues.xs).eqls([5, -5]);
        expect(stateVariables["/f"].stateValues.xs).eqls([1, 1]);
      });

      cy.log("move point d");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/hello/d",
          args: { x: 3, y: 4 },
        });
        let stateVariables = await win.returnAllStateVariables1();
        cy.get(point1Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(point1aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(point1bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(point2bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(cesc2("#/hello/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(cesc2("#/hello/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(cesc2("#/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(5,−5)");
        cy.get(cesc2("#/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(cesc2("#/hello/n1")).should("have.text", "nothing 1: ");
        cy.get(cesc2("#/hello/n2")).should("have.text", "nothing 2: ");
        cy.get(cesc2("#/hello/n3")).should("have.text", "nothing 3: ");
        cy.get(cesc2("#/hello/n4")).should("have.text", "nothing 4: ");
        cy.get(cesc2("#/hello/n5")).should("have.text", "nothing 5: ");
        cy.get(cesc2("#/hello/n6")).should("have.text", "nothing 6: ");
        cy.get(cesc2("#/hello/n7")).should("have.text", "nothing 7: ");
        cy.get(cesc2("#/hello/n8")).should("have.text", "nothing 8: ");
        cy.get(cesc2("#/hello/n9")).should("have.text", "nothing 9: ");
        cy.get(cesc2("#/hello/n10")).should("have.text", "nothing 10: ");
        cy.get(cesc2("#/hello/n11")).should("have.text", "nothing 11: ");
        cy.get(cesc2("#/hello/n12")).should("have.text", "nothing 12: ");
        cy.get(cesc2("#/n13")).should("have.text", "nothing 13: ");
        cy.get(cesc2("#/n14")).should("have.text", "nothing 14: ");
        cy.get(cesc2("#/n15")).should("have.text", "nothing 15: ");
        cy.get(cesc2("#/n16")).should("have.text", "nothing 16: ");

        expect(stateVariables["/hello/c"].stateValues.xs).eqls([5, -5]);
        expect(stateVariables["/hello/d"].stateValues.xs).eqls([3, 4]);
        expect(stateVariables["/hello/e"].stateValues.xs).eqls([5, -5]);
        expect(stateVariables["/hello/f"].stateValues.xs).eqls([3, 4]);
        expect(stateVariables["/e"].stateValues.xs).eqls([5, -5]);
        expect(stateVariables["/f"].stateValues.xs).eqls([3, 4]);
      });

      cy.log("move point e");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/hello/e",
          args: { x: -9, y: -8 },
        });
        let stateVariables = await win.returnAllStateVariables1();
        cy.get(point1Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(point1aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(point1bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(cesc2("#/hello/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(cesc2("#/hello/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(cesc2("#/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(cesc2("#/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(3,4)");
        cy.get(cesc2("#/hello/n1")).should("have.text", "nothing 1: ");
        cy.get(cesc2("#/hello/n2")).should("have.text", "nothing 2: ");
        cy.get(cesc2("#/hello/n3")).should("have.text", "nothing 3: ");
        cy.get(cesc2("#/hello/n4")).should("have.text", "nothing 4: ");
        cy.get(cesc2("#/hello/n5")).should("have.text", "nothing 5: ");
        cy.get(cesc2("#/hello/n6")).should("have.text", "nothing 6: ");
        cy.get(cesc2("#/hello/n7")).should("have.text", "nothing 7: ");
        cy.get(cesc2("#/hello/n8")).should("have.text", "nothing 8: ");
        cy.get(cesc2("#/hello/n9")).should("have.text", "nothing 9: ");
        cy.get(cesc2("#/hello/n10")).should("have.text", "nothing 10: ");
        cy.get(cesc2("#/hello/n11")).should("have.text", "nothing 11: ");
        cy.get(cesc2("#/hello/n12")).should("have.text", "nothing 12: ");
        cy.get(cesc2("#/n13")).should("have.text", "nothing 13: ");
        cy.get(cesc2("#/n14")).should("have.text", "nothing 14: ");
        cy.get(cesc2("#/n15")).should("have.text", "nothing 15: ");
        cy.get(cesc2("#/n16")).should("have.text", "nothing 16: ");

        expect(stateVariables["/hello/c"].stateValues.xs).eqls([-9, -8]);
        expect(stateVariables["/hello/d"].stateValues.xs).eqls([3, 4]);
        expect(stateVariables["/hello/e"].stateValues.xs).eqls([-9, -8]);
        expect(stateVariables["/hello/f"].stateValues.xs).eqls([3, 4]);
        expect(stateVariables["/e"].stateValues.xs).eqls([-9, -8]);
        expect(stateVariables["/f"].stateValues.xs).eqls([3, 4]);
      });

      cy.log("move point f");
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/hello/f",
          args: { x: -1, y: -3 },
        });
        let stateVariables = await win.returnAllStateVariables1();
        cy.get(point1Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2Anchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−1,−3)");
        cy.get(point1aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2aAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−1,−3)");
        cy.get(point1bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(point2bAnchor + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−1,−3)");
        cy.get(cesc2("#/hello/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(cesc2("#/hello/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−1,−3)");
        cy.get(cesc2("#/e") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−9,−8)");
        cy.get(cesc2("#/f") + " .mjx-mrow")
          .eq(0)
          .should("have.text", "(−1,−3)");
        cy.get(cesc2("#/hello/n1")).should("have.text", "nothing 1: ");
        cy.get(cesc2("#/hello/n2")).should("have.text", "nothing 2: ");
        cy.get(cesc2("#/hello/n3")).should("have.text", "nothing 3: ");
        cy.get(cesc2("#/hello/n4")).should("have.text", "nothing 4: ");
        cy.get(cesc2("#/hello/n5")).should("have.text", "nothing 5: ");
        cy.get(cesc2("#/hello/n6")).should("have.text", "nothing 6: ");
        cy.get(cesc2("#/hello/n7")).should("have.text", "nothing 7: ");
        cy.get(cesc2("#/hello/n8")).should("have.text", "nothing 8: ");
        cy.get(cesc2("#/hello/n9")).should("have.text", "nothing 9: ");
        cy.get(cesc2("#/hello/n10")).should("have.text", "nothing 10: ");
        cy.get(cesc2("#/hello/n11")).should("have.text", "nothing 11: ");
        cy.get(cesc2("#/hello/n12")).should("have.text", "nothing 12: ");
        cy.get(cesc2("#/n13")).should("have.text", "nothing 13: ");
        cy.get(cesc2("#/n14")).should("have.text", "nothing 14: ");
        cy.get(cesc2("#/n15")).should("have.text", "nothing 15: ");
        cy.get(cesc2("#/n16")).should("have.text", "nothing 16: ");

        expect(stateVariables["/hello/c"].stateValues.xs).eqls([-9, -8]);
        expect(stateVariables["/hello/d"].stateValues.xs).eqls([-1, -3]);
        expect(stateVariables["/hello/e"].stateValues.xs).eqls([-9, -8]);
        expect(stateVariables["/hello/f"].stateValues.xs).eqls([-1, -3]);
        expect(stateVariables["/e"].stateValues.xs).eqls([-9, -8]);
        expect(stateVariables["/f"].stateValues.xs).eqls([-1, -3]);
      });
    });
  });

  it("assign names to array prop, further copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <line through="(0,0) (1,1)" />
  </graph>

  $_line1.points{name="pts" assignNames="p1 p2"}
  $_line1.points.y{name="ys" assignNames="y1 y2"}

  <section name="sec1">
  <p>ptsa: $pts{name="ptsa" assignNames="p1a p2a"}, repeat: $p1a{name="p1ac"}, $p2a{name="p2ac"}</p>
  <p>ptsb: $ptsa{name="ptsb" assignNames="p1b p2b"}, repeat: $p1b{name="p1bc"}, $p2a{name="p2bc"}</p>
  <p>ptsc: $ptsb{name="ptsc" assignNames="p1c p2c"}, repeat: $p1c{name="p1cc"}, $p2a{name="p2cc"}</p>

  <p>ysa: $ys{name="ysa" assignNames="y1a y2a"}, repeat: $y1a{name="y1ac"}, $y2a{name="y2ac"}</p>
  <p>ysb: $ysa{name="ysb" assignNames="y1b y2b"}, repeat: $y1b{name="y1bc"}, $y2b{name="y2bc"}</p>
  <p>ysc: $ysb{name="ysc" assignNames="y1c y2c"}, repeat: $y1c{name="y1cc"}, $y2c{name="y2cc"}</p>
  </section>

  <section name="sec2" copySource="sec1" newNamespace />
  <section name="sec3" copySource="sec2" newNamespace />

  `,
        },
        "*",
      );
    });

    let ptsNames = [
      "/pts",
      "/ptsa",
      "/ptsb",
      "/ptsc",
      "/sec2/ptsa",
      "/sec2/ptsb",
      "/sec2/ptsc",
      "/sec3/ptsa",
      "/sec3/ptsb",
      "/sec3/ptsc",
    ];
    let p1Names = [
      "/p1",
      "/p1a",
      "/p1ac",
      "/p1b",
      "/p1bc",
      "/p1c",
      "/p1cc",
      "/sec2/p1a",
      "/sec2/p1ac",
      "/sec2/p1b",
      "/sec2/p1bc",
      "/sec2/p1c",
      "/sec2/p1cc",
      "/sec3/p1a",
      "/sec3/p1ac",
      "/sec3/p1b",
      "/sec3/p1bc",
      "/sec3/p1c",
      "/sec3/p1cc",
    ];
    let p2Names = [
      "/p2",
      "/p2a",
      "/p2ac",
      "/p2b",
      "/p2bc",
      "/p2c",
      "/p2cc",
      "/sec2/p2a",
      "/sec2/p2ac",
      "/sec2/p2b",
      "/sec2/p2bc",
      "/sec2/p2c",
      "/sec2/p2cc",
      "/sec3/p2a",
      "/sec3/p2ac",
      "/sec3/p2b",
      "/sec3/p2bc",
      "/sec3/p2c",
      "/sec3/p2cc",
    ];

    let ysNames = [
      "/ys",
      "/ysa",
      "/ysb",
      "/ysc",
      "/sec2/ysa",
      "/sec2/ysb",
      "/sec2/ysc",
      "/sec3/ysa",
      "/sec3/ysb",
      "/sec3/ysc",
    ];
    let y1Names = [
      "/y1",
      "/y1a",
      "/y1ac",
      "/y1b",
      "/y1bc",
      "/y1c",
      "/y1cc",
      "/sec2/y1a",
      "/sec2/y1ac",
      "/sec2/y1b",
      "/sec2/y1bc",
      "/sec2/y1c",
      "/sec2/y1cc",
      "/sec3/y1a",
      "/sec3/y1ac",
      "/sec3/y1b",
      "/sec3/y1bc",
      "/sec3/y1c",
      "/sec3/y1cc",
    ];
    let y2Names = [
      "/y2",
      "/y2a",
      "/y2ac",
      "/y2b",
      "/y2bc",
      "/y2c",
      "/y2cc",
      "/sec2/y2a",
      "/sec2/y2ac",
      "/sec2/y2b",
      "/sec2/y2bc",
      "/sec2/y2c",
      "/sec2/y2cc",
      "/sec3/y2a",
      "/sec3/y2ac",
      "/sec3/y2b",
      "/sec3/y2bc",
      "/sec3/y2c",
      "/sec3/y2cc",
    ];

    for (let ptsName of ptsNames) {
      cy.get(cesc2("#" + ptsName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(cesc2("#" + ptsName) + " .mjx-mrow")
        .eq(2)
        .should("have.text", "(1,1)");
    }

    for (let p1Name of p1Names) {
      cy.get(cesc2("#" + p1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
    }
    for (let p2Name of p2Names) {
      cy.get(cesc2("#" + p2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,1)");
    }

    for (let ysName of ysNames) {
      cy.get(cesc2("#" + ysName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "0");
      cy.get(cesc2("#" + ysName) + " .mjx-mrow")
        .eq(1)
        .should("have.text", "1");
    }

    for (let y1Name of y1Names) {
      cy.get(cesc2("#" + y1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "0");
    }
    for (let y2Name of y2Names) {
      cy.get(cesc2("#" + y2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
    }

    cy.log("move point p1");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: 5, y: -5 },
      });
    });
    cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", "(5,−5)");

    for (let ptsName of ptsNames) {
      cy.get(cesc2("#" + ptsName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(5,−5)");
      cy.get(cesc2("#" + ptsName) + " .mjx-mrow")
        .eq(2)
        .should("have.text", "(1,1)");
    }

    for (let p1Name of p1Names) {
      cy.get(cesc2("#" + p1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(5,−5)");
    }
    for (let p2Name of p2Names) {
      cy.get(cesc2("#" + p2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,1)");
    }

    for (let ysName of ysNames) {
      cy.get(cesc2("#" + ysName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "−5");
      cy.get(cesc2("#" + ysName) + " .mjx-mrow")
        .eq(1)
        .should("have.text", "1");
    }

    for (let y1Name of y1Names) {
      cy.get(cesc2("#" + y1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "−5");
    }
    for (let y2Name of y2Names) {
      cy.get(cesc2("#" + y2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
    }

    cy.log("move point p2");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 3, y: 4 },
      });
    });
    cy.get(cesc("#\\/p2") + " .mjx-mrow").should("contain.text", "(3,4)");

    for (let ptsName of ptsNames) {
      cy.get(cesc2("#" + ptsName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(5,−5)");
      cy.get(cesc2("#" + ptsName) + " .mjx-mrow")
        .eq(2)
        .should("have.text", "(3,4)");
    }

    for (let p1Name of p1Names) {
      cy.get(cesc2("#" + p1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(5,−5)");
    }
    for (let p2Name of p2Names) {
      cy.get(cesc2("#" + p2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(3,4)");
    }

    for (let ysName of ysNames) {
      cy.get(cesc2("#" + ysName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "−5");
      cy.get(cesc2("#" + ysName) + " .mjx-mrow")
        .eq(1)
        .should("have.text", "4");
    }

    for (let y1Name of y1Names) {
      cy.get(cesc2("#" + y1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "−5");
    }
    for (let y2Name of y2Names) {
      cy.get(cesc2("#" + y2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "4");
    }
  });

  it("assign names to array prop with copy component index, further copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <mathinput name="n" prefill="1" />
  
  <graph>
    <line through="(1,2) (3,4)" />
  </graph>

  <p>xs = $_line1.points[$n].xs{name="xs" assignNames="x1 x2"}</p>

  <section name="sec1">
  <p>xsa: $xs{name="xsa" assignNames="x1a x2a"}, repeat: $x1a{name="x1ac"}, $x2a{name="x2ac"}</p>
  <p>xsb: $xsa{name="xsb" assignNames="x1b x2b"}, repeat: $x1b{name="x1bc"}, $x2b{name="x2bc"}</p>
  <p>xsc: $xsb{name="xsc" assignNames="x1c x2c"}, repeat: $x1c{name="x1cc"}, $x2c{name="x2cc"}</p>
  </section>

  <section name="sec2" copySource="sec1" newNamespace />
  <section name="sec3" copySource="sec2" newNamespace />

  `,
        },
        "*",
      );
    });

    let xsNames = [
      "/xs",
      "/xsa",
      "/xsb",
      "/xsc",
      "/sec2/xsa",
      "/sec2/xsb",
      "/sec2/xsc",
      "/sec3/xsa",
      "/sec3/xsb",
      "/sec3/xsc",
    ];
    let x1Names = [
      "/x1",
      "/x1a",
      "/x1ac",
      "/x1b",
      "/x1bc",
      "/x1c",
      "/x1cc",
      "/sec2/x1a",
      "/sec2/x1ac",
      "/sec2/x1b",
      "/sec2/x1bc",
      "/sec2/x1c",
      "/sec2/x1cc",
      "/sec3/x1a",
      "/sec3/x1ac",
      "/sec3/x1b",
      "/sec3/x1bc",
      "/sec3/x1c",
      "/sec3/x1cc",
    ];
    let x2Names = [
      "/x2",
      "/x2a",
      "/x2ac",
      "/x2b",
      "/x2bc",
      "/x2c",
      "/x2cc",
      "/sec2/x2a",
      "/sec2/x2ac",
      "/sec2/x2b",
      "/sec2/x2bc",
      "/sec2/x2c",
      "/sec2/x2cc",
      "/sec3/x2a",
      "/sec3/x2ac",
      "/sec3/x2b",
      "/sec3/x2bc",
      "/sec3/x2c",
      "/sec3/x2cc",
    ];

    for (let xsName of xsNames) {
      cy.get(cesc2("#" + xsName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
      cy.get(cesc2("#" + xsName) + " .mjx-mrow")
        .eq(1)
        .should("have.text", "2");
    }

    for (let x1Name of x1Names) {
      cy.get(cesc2("#" + x1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
    }
    for (let x2Name of x2Names) {
      cy.get(cesc2("#" + x2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "2");
    }

    cy.log("switch point index");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc2("#/x1") + " .mjx-mrow").should("contain.text", "3");

    for (let xsName of xsNames) {
      cy.get(cesc2("#" + xsName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "3");
      cy.get(cesc2("#" + xsName) + " .mjx-mrow")
        .eq(1)
        .should("have.text", "4");
    }

    for (let x1Name of x1Names) {
      cy.get(cesc2("#" + x1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "3");
    }
    for (let x2Name of x2Names) {
      cy.get(cesc2("#" + x2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "4");
    }

    cy.log("switch to invalid point index");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    for (let xsName of xsNames) {
      cy.get(cesc2("#" + xsName) + " .mjx-mrow").should("not.exist");
    }

    for (let x1Name of x1Names) {
      cy.get(cesc2("#" + x1Name) + " .mjx-mrow").should("not.exist");
    }
    for (let x2Name of x2Names) {
      cy.get(cesc2("#" + x2Name) + " .mjx-mrow").should("not.exist");
    }

    cy.log("back to point 1");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    for (let xsName of xsNames) {
      cy.get(cesc2("#" + xsName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
      cy.get(cesc2("#" + xsName) + " .mjx-mrow")
        .eq(1)
        .should("have.text", "2");
    }

    for (let x1Name of x1Names) {
      cy.get(cesc2("#" + x1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
    }
    for (let x2Name of x2Names) {
      cy.get(cesc2("#" + x2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "2");
    }
  });

  it("assign names to array prop, copy with component index", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <mathinput name="n" prefill="1" />
  
  <graph>
    <line through="(1,2) (3,4)" />
  </graph>

  $_line1.points{name="pts" assignNames="p1 p2"}

  <section name="sec1">
    <p>$pts[$n]{name="pt"}</p>
    <p>$pt{name="pta"}</p>
    <p>$pts[$n].xs{name="ptxs" assignNames="ptx1 ptx2"}</p>
    <p>$ptxs{name="ptxsa" assignNames="ptx1a ptx2a"}</p>
    <p>$p1.xs[$n]{name="p1xs" assignNames="p1x"}</p>
    <p>$p1xs{name="p1xsa"}</p>
    <p>$p1x{name="p1xa"}</p>
    <p>$p2.xs[$n]{name="p2xs" assignNames="p2x"}</p>
    <p>$p2xs{name="p2xsa"}</p>
    <p>$p2x{name="p2xa"}</p>
  </section>

  <section name="sec2" copySource="sec1" newNamespace />
  <section name="sec3" copySource="sec2" newNamespace />

  `,
        },
        "*",
      );
    });

    let ptNames = [
      "/pt",
      "/pta",
      "/sec2/pt",
      "/sec2/pta",
      "/sec3/pt",
      "/sec3/pta",
    ];
    let ptxsNames = [
      "/ptxs",
      "/ptxsa",
      "/sec2/ptxs",
      "/sec2/ptxsa",
      "/sec3/ptxs",
      "/sec3/ptxsa",
    ];
    let ptx1Names = [
      "/ptx1",
      "/ptx1a",
      "/sec2/ptx1",
      "/sec2/ptx1a",
      "/sec3/ptx1",
      "/sec3/ptx1a",
    ];
    let ptx2Names = [
      "/ptx2",
      "/ptx2a",
      "/sec2/ptx2",
      "/sec2/ptx2a",
      "/sec3/ptx2",
      "/sec3/ptx2a",
    ];
    let p1xNames = [
      "/p1x",
      "/p1xa",
      "/sec2/p1x",
      "/sec2/p1xa",
      "/sec3/p1x",
      "/sec3/p1xa",
    ];
    let p2xNames = [
      "/p2x",
      "/p2xa",
      "/sec2/p2x",
      "/sec2/p2xa",
      "/sec3/p2x",
      "/sec3/p2xa",
    ];

    for (let ptName of ptNames) {
      cy.get(cesc2("#" + ptName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,2)");
    }

    for (let ptxsName of ptxsNames) {
      cy.get(cesc2("#" + ptxsName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
      cy.get(cesc2("#" + ptxsName) + " .mjx-mrow")
        .eq(1)
        .should("have.text", "2");
    }
    for (let ptx1Name of ptx1Names) {
      cy.get(cesc2("#" + ptx1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
    }
    for (let ptx2Name of ptx2Names) {
      cy.get(cesc2("#" + ptx2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "2");
    }
    for (let p1xName of p1xNames) {
      cy.get(cesc2("#" + p1xName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
    }
    for (let p2xName of p2xNames) {
      cy.get(cesc2("#" + p2xName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "3");
    }

    cy.log("switch index");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc2("#/ptx1") + " .mjx-mrow").should("contain.text", "3");

    for (let ptName of ptNames) {
      cy.get(cesc2("#" + ptName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(3,4)");
    }

    for (let ptxsName of ptxsNames) {
      cy.get(cesc2("#" + ptxsName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "3");
      cy.get(cesc2("#" + ptxsName) + " .mjx-mrow")
        .eq(1)
        .should("have.text", "4");
    }
    for (let ptx1Name of ptx1Names) {
      cy.get(cesc2("#" + ptx1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "3");
    }
    for (let ptx2Name of ptx2Names) {
      cy.get(cesc2("#" + ptx2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "4");
    }
    for (let p1xName of p1xNames) {
      cy.get(cesc2("#" + p1xName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "2");
    }
    for (let p2xName of p2xNames) {
      cy.get(cesc2("#" + p2xName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "4");
    }

    cy.log("switch to invalid index");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    for (let ptName of ptNames) {
      cy.get(cesc2("#" + ptName) + " .mjx-mrow").should("not.exist");
    }

    for (let ptxsName of ptxsNames) {
      cy.get(cesc2("#" + ptxsName) + " .mjx-mrow").should("not.exist");
    }
    for (let ptx1Name of ptx1Names) {
      cy.get(cesc2("#" + ptx1Name) + " .mjx-mrow").should("not.exist");
    }
    for (let ptx2Name of ptx2Names) {
      cy.get(cesc2("#" + ptx2Name) + " .mjx-mrow").should("not.exist");
    }
    for (let p1xName of p1xNames) {
      cy.get(cesc2("#" + p1xName) + " .mjx-mrow").should("not.exist");
    }
    for (let p2xName of p2xNames) {
      cy.get(cesc2("#" + p2xName) + " .mjx-mrow").should("not.exist");
    }

    cy.log("switch back to index 1");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    for (let ptName of ptNames) {
      cy.get(cesc2("#" + ptName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(1,2)");
    }

    for (let ptxsName of ptxsNames) {
      cy.get(cesc2("#" + ptxsName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
      cy.get(cesc2("#" + ptxsName) + " .mjx-mrow")
        .eq(1)
        .should("have.text", "2");
    }
    for (let ptx1Name of ptx1Names) {
      cy.get(cesc2("#" + ptx1Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
    }
    for (let ptx2Name of ptx2Names) {
      cy.get(cesc2("#" + ptx2Name) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "2");
    }
    for (let p1xName of p1xNames) {
      cy.get(cesc2("#" + p1xName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "1");
    }
    for (let p2xName of p2xNames) {
      cy.get(cesc2("#" + p2xName) + " .mjx-mrow")
        .eq(0)
        .should("have.text", "3");
    }
  });

  //Note: the next 3 are not using assignNames anymore given changes to how copies work
  it("names can access namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <section newNamespace>
    <subsection>
      <p newNamespace>Hello, <text name="person">Jesse</text>!</p>
    </subsection>
    <subsection>
      <p>Hello, <text name="person">Jessica</text>!</p>
    </subsection>
  </section>

  $_section1{name="a"}

  $a{name="b"}

  <p>$(_section1/_p1/person) $(_section1/person)
$(a/_p1/person) $(a/person)
$(b/_p1/person) $(b/person)</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_section1\\/_p1")).should("have.text", "Hello, Jesse!");
    cy.get(cesc("#\\/_section1\\/_p2")).should("have.text", "Hello, Jessica!");
    cy.get(cesc("#\\/a\\/_p1")).should("have.text", "Hello, Jesse!");
    cy.get(cesc("#\\/a\\/_p2")).should("have.text", "Hello, Jessica!");
    cy.get(cesc("#\\/b\\/_p1")).should("have.text", "Hello, Jesse!");
    cy.get(cesc("#\\/b\\/_p2")).should("have.text", "Hello, Jessica!");

    cy.get(cesc("#\\/_p1")).should(
      "have.text",
      "Jesse Jessica\nJesse Jessica\nJesse Jessica",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_section1/_p1/person"].stateValues.value).eq(
        "Jesse",
      );
      expect(stateVariables["/_section1/person"].stateValues.value).eq(
        "Jessica",
      );
      expect(stateVariables["/a/_p1/person"].stateValues.value).eq("Jesse");
      expect(stateVariables["/a/person"].stateValues.value).eq("Jessica");
      expect(stateVariables["/b/_p1/person"].stateValues.value).eq("Jesse");
      expect(stateVariables["/b/person"].stateValues.value).eq("Jessica");
    });
  });

  it("names can access namespace, across namespaces", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <section name="hello" newNamespace><title>Hello</title>
    <p newNamespace>Hello, <text name="person">Jesse</text>!</p>
    $_p1{name="a"}
    <p>$(_p1/person) $(a/person) $(../bye/a/person)</p>
  </section>

  <section name="bye" newNamespace><title>Bye</title>
   $(../hello/_p1{name="a"})
    <p>$(../hello/_p1/person) $(../hello/a/person) $(a/person)</p>
  </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/hello\\/_p1")).should("have.text", "Hello, Jesse!");
    cy.get(cesc("#\\/hello\\/a")).should("have.text", "Hello, Jesse!");
    cy.get(cesc("#\\/hello\\/_p2")).should("have.text", "Jesse Jesse Jesse");

    cy.get(cesc("#\\/bye\\/a")).should("have.text", "Hello, Jesse!");
    cy.get(cesc("#\\/bye\\/_p1")).should("have.text", "Jesse Jesse Jesse");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/hello/_p1/person"].stateValues.value).eq("Jesse");
      expect(stateVariables["/hello/a/person"].stateValues.value).eq("Jesse");
      expect(stateVariables["/bye/a/person"].stateValues.value).eq("Jesse");
    });
  });

  it("names can access namespace even with math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p newNamespace name="pOriginal">
    <math name="expression">
      <math name="x">x</math>+<math name="y">y</math>
    </math>
  </p>

  $pOriginal{name="pCopy"}

  <p>This grabs expression: $(pOriginal/expression{name="expressionCopy"})</p>
  <p>This grabs expression: $(pCopy/expression{name="expressionCopy2"})</p>
  <p>This grabs piece x: $(pOriginal/x{name="xCopy"})</p>
  <p>This grabs piece y: $(pOriginal/y{name="yCopy"})</p>
  <p>Should this grab piece x? $(pCopy/x{name="xCopy2"})</p>
  <p>Should this grab piece y? $(pCopy/y{name="yCopy2"})</p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load
    cy.get(cesc(`#\\/pOriginal\\/expression`) + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+y");
    cy.get(cesc(`#\\/pCopy\\/expression`) + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+y");
    cy.get(cesc(`#\\/expressionCopy`) + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+y");
    cy.get(cesc(`#\\/expressionCopy2`) + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+y");
    cy.get(cesc(`#\\/xCopy`) + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc(`#\\/xCopy2`) + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc(`#\\/yCopy`) + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");
    cy.get(cesc(`#\\/yCopy2`) + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");
  });
});
