import { cesc, cesc2 } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

describe("Circle Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("circle with no parameters gives unit circle", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <circle/>
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([0, 0]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        0, 0,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(1);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([0, 0]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [0, 0],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        1,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([0, 0]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [0, 0],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        1,
      );
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(0);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(0);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(1);
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [2, 3] },
      });
    });

    cy.get(cesc("#\\/centerPoint2")).should("contain.text", "(2,3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_circle1"].stateValues.center).eqls([2, 3]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        2, 3,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(1);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([2, 3]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [2, 3],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        1,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([2, 3]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [2, 3],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        1,
      );
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(3);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(1);
    });

    cy.log("change radius");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 5, y: 0 },
      });
    });

    cy.get(cesc("#\\/radiusNumber")).should("contain.text", "5");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_circle1"].stateValues.center).eqls([2, 3]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        2, 3,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([2, 3]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [2, 3],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([2, 3]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [2, 3],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(3);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    });

    cy.log("change center");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: -6, y: -2 },
      });
    });

    cy.get(cesc("#\\/centerPoint2")).should("contain.text", "(−6,−2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([-6, -2]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        -6, -2,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
        -6, -2,
      ]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [-6, -2],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
        -6, -2,
      ]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [-6, -2],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-6);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(-2);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [-7, 9] },
      });
    });

    cy.get(cesc("#\\/centerPoint2")).should("contain.text", "(−7,9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([-7, 9]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        -7, 9,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([-7, 9]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [-7, 9],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([-7, 9]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [-7, 9],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-7);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(9);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [6, -8] },
      });
    });

    cy.get(cesc("#\\/centerPoint2")).should("contain.text", "(6,−8)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([6, -8]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        6, -8,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([6, -8]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [6, -8],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([6, -8]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [6, -8],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(6);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(-8);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    });
  });

  it("circle with center", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point name="center">(-1,3)</point>
      <circle center="$center" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point name="radiusPoint" x="$(_circle1.radius)" y="0" />
    </graph>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([-1, 3]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        -1, 3,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(1);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([-1, 3]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [-1, 3],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        1,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([-1, 3]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [-1, 3],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        1,
      );
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(-1);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(3);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-1);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(3);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(1);
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [2, 4] },
      });
    });

    cy.get(cesc("#\\/centerPoint2")).should("contain.text", "(2,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_circle1"].stateValues.center).eqls([2, 4]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        2, 4,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(1);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([2, 4]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [2, 4],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        1,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([2, 4]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [2, 4],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        1,
      );
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(4);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(1);
    });

    cy.log("change radius");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/radiusPoint",
        args: { x: 5, y: 0 },
      });
    });

    cy.get(cesc("#\\/radiusNumber")).should("contain.text", "5");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([2, 4]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        2, 4,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([2, 4]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [2, 4],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([2, 4]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [2, 4],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(4);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    });

    cy.log("change center via defining point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/center",
        args: { x: -6, y: -2 },
      });
    });

    cy.get(cesc("#\\/centerPoint2")).should("contain.text", "(−6,−2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([-6, -2]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        -6, -2,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
        -6, -2,
      ]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [-6, -2],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
        -6, -2,
      ]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [-6, -2],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(-6);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(-2);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-6);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(-2);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    });

    cy.log("change center via reffed point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: -7, y: 8 },
      });
    });

    cy.get(cesc("#\\/centerPoint2")).should("contain.text", "(−7,8)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([-7, 8]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        -7, 8,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([-7, 8]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [-7, 8],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([-7, 8]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [-7, 8],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(-7);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(8);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-7);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(8);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [9, -10] },
      });
    });

    cy.get(cesc("#\\/centerPoint2")).should("contain.text", "(9,−10)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([9, -10]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        9, -10,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
        9, -10,
      ]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [9, -10],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
        9, -10,
      ]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [9, -10],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(9);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(-10);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(9);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(-10);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [-3, -4] },
      });
    });

    cy.get(cesc("#\\/centerPoint2")).should("contain.text", "(−3,−4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([-3, -4]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        -3, -4,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
        -3, -4,
      ]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [-3, -4],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
        -3, -4,
      ]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [-3, -4],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        5,
      );
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(-3);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(-4);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-3);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(-4);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    });
  });

  it("circle with radius", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" source="_point1" /></math>
    <graph>
    <point>(2,0)</point>
    <circle radius="$pX" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 0,
        y = 0,
        r = 2;
      expect(stateVariables["/_circle1"].stateValues.center).eqls([x, y]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        x,
        y,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([x, y]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [x, y],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        r,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([x, y]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [x, y],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        r,
      );
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(r);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let x = 3,
        y = 4,
        r = 2;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [x, y] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          x,
          y,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("change radius with defining point");
    cy.window().then(async (win) => {
      let x = 3,
        y = 4,
        r = 5;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: r, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          x,
          y,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("change radius with reffed point");
    cy.window().then(async (win) => {
      let x = 3,
        y = 4,
        r = 7;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: r, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          x,
          y,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("change center with reffed point");
    cy.window().then(async (win) => {
      let x = -5,
        y = -2,
        r = 7;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: x, y: y },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          x,
          y,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let x = 9,
        y = -10,
        r = 7;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [x, y] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          x,
          y,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let x = -3,
        y = -4,
        r = 7;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [x, y] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          x,
          y,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          x,
          y,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([x, y]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });
  });

  it("circle through point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(2,-3)</point>
    <circle through="$_point1" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let tx = 2,
        ty = -3;
      let r = 1;
      let cnx = tx,
        cny = ty - r;
      expect(stateVariables["/_circle1"].stateValues.center).eqls([cnx, cny]);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        cnx,
        cny,
      ]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
        cnx,
        cny,
      ]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls(
        [cnx, cny],
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
        r,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
        cnx,
        cny,
      ]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls(
        [cnx, cny],
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
        r,
      );
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(tx);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(ty);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(cnx);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(r);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(0);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let tx = -4,
        ty = 7;
      let r = 1;
      let cnx = tx,
        cny = ty - r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          cnx,
          cny,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(tx);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(
          cnx,
        );
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("move through point");
    cy.window().then(async (win) => {
      let tx = -5,
        ty = 9;
      let r = 1;
      let cnx = tx,
        cny = ty - r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: tx, y: ty },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          cnx,
          cny,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(tx);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(
          cnx,
        );
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("move reffed center");
    cy.window().then(async (win) => {
      let tx = 3,
        ty = -3;
      let r = 1;
      let cnx = tx,
        cny = ty - r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          cnx,
          cny,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(tx);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(
          cnx,
        );
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("change reffed radius, center moves");
    cy.window().then(async (win) => {
      let r = 3;
      let cnx = 3,
        cny = -6;
      let tx = 3,
        ty = cny + r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: r, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          cnx,
          cny,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(tx);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(
          cnx,
        );
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("try to make radius negative");
    cy.window().then(async (win) => {
      let rtry = -3;
      let r = 0;
      let cnx = 3,
        cny = -3;
      let tx = 3,
        ty = cny + r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: rtry, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          cnx,
          cny,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(tx);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(
          cnx,
        );
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("make radius positive again");
    cy.window().then(async (win) => {
      let r = 2;
      let cnx = 3,
        cny = -5;
      let tx = 3,
        ty = cny + r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: r, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          cnx,
          cny,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(tx);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(
          cnx,
        );
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let r = 2;
      let cnx = 9,
        cny = -10;
      let tx = 9,
        ty = cny + r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          cnx,
          cny,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(tx);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(
          cnx,
        );
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let r = 2;
      let cnx = -3,
        cny = -4;
      let tx = -3,
        ty = cny + r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          cnx,
          cny,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph3/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([
          cnx,
          cny,
        ]);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter,
        ).eqls([cnx, cny]);
        expect(await stateVariables["/graph4/circle"].stateValues.radius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(
          r,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(tx);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(
          cnx,
        );
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(r);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      });
    });
  });

  it("circle through two points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(2,-3)</point><point>(3,4)</point>
    <circle through="$_point1 $_point2"/>
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 2,
        t1y = -3;
      let t2x = 3,
        t2y = 4;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(t1x, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(t1y, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(t2x, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(t2y, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let t1x = -2,
        t1y = 0;
      let t2x = -1,
        t2y = 7;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move first through point");
    cy.window().then(async (win) => {
      let t1x = 4,
        t1y = -1;
      let t2x = -1,
        t2y = 7;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move second through point on top of first");
    cy.window().then(async (win) => {
      let t1x = 4,
        t1y = -1;
      let t2x = 4,
        t2y = -1;
      let r = 0;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move second through point again");
    cy.window().then(async (win) => {
      let t1x = 4,
        t1y = -1;
      let t2x = 8,
        t2y = -3;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move center");
    cy.window().then(async (win) => {
      let t1x = 4 + 2,
        t1y = -1 - 3;
      let t2x = 8 + 2,
        t2y = -3 - 3;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move radius to half size");
    cy.window().then(async (win) => {
      let t1x = 8 + (4 + 2 - 8) / 2,
        t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2,
        t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: r, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let t1x = 8 + (4 + 2 - 8) / 2,
        t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2,
        t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      let dx = 3,
        dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let t1x = 8 + (4 + 2 - 8) / 2,
        t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2,
        t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      let dx = -3,
        dy = 5;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });
  });

  it("circle through two points, undefined on first pass", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <circle through="$_point1 $_point2" />
    <point>(2,-3)</point><point>(3,4)</point>
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 2,
        t1y = -3;
      let t2x = 3,
        t2y = 4;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(t1x, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(t1y, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(t2x, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(t2y, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let t1x = -2,
        t1y = 0;
      let t2x = -1,
        t2y = 7;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move first through point");
    cy.window().then(async (win) => {
      let t1x = 4,
        t1y = -1;
      let t2x = -1,
        t2y = 7;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move second through point on top of first");
    cy.window().then(async (win) => {
      let t1x = 4,
        t1y = -1;
      let t2x = 4,
        t2y = -1;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move second through point again");
    cy.window().then(async (win) => {
      let t1x = 4,
        t1y = -1;
      let t2x = 8,
        t2y = -3;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move center");
    cy.window().then(async (win) => {
      let t1x = 4 + 2,
        t1y = -1 - 3;
      let t2x = 8 + 2,
        t2y = -3 - 3;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move radius to half size");
    cy.window().then(async (win) => {
      let t1x = 8 + (4 + 2 - 8) / 2,
        t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2,
        t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: r, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let t1x = 8 + (4 + 2 - 8) / 2,
        t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2,
        t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      let dx = 3,
        dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 8 + (4 + 2 - 8) / 2,
        t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2,
        t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      let dx = -3,
        dy = 5;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });
  });

  it("circle through three points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(2,-3)</point><point>(3,4)</point><point>(-3,4)</point>
    <circle through="$_point1 $_point2 $_point3" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero displayDigits="8" assignNames="centerPoint2">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <copy prop="diameter" assignNames="diam" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = 4;
    let t3x = -3,
      t3y = 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);

      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(t1x, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(t1y, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(t2x, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(t2y, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(t3x, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(t3y, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle up and to the right");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      let dx = 3,
        dy = 4;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move first point to be in straight line");
    cy.window().then(async (win) => {
      (t1x = -3), (t1y = 8);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y },
      });
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(＿,＿)`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", "＿");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalRadius,
          ),
        ).false;
        expect(
          Number.isFinite(stateVariables["/_circle1"].stateValues.center[0]),
        ).false;
        expect(
          Number.isFinite(stateVariables["/_circle1"].stateValues.center[1]),
        ).false;
        expect(Number.isFinite(stateVariables["/_circle1"].stateValues.radius))
          .false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalRadius,
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.center[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.center[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            await stateVariables["/graph3/circle"].stateValues.radius,
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalRadius,
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.center[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.center[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            await stateVariables["/graph4/circle"].stateValues.radius,
          ),
        ).false;

        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          Number.isFinite(
            (await stateVariables["/centerPoint"].stateValues.xs)[0],
          ),
        ).false;
        expect(
          Number.isFinite(stateVariables["/centerPoint"].stateValues.xs[1]),
        ).false;
        expect(
          Number.isFinite(stateVariables["/radiusNumber"].stateValues.value),
        ).false;
        expect(Number.isFinite(stateVariables["/diam"].stateValues.value))
          .false;
      });
    });

    cy.log("move second point");
    cy.window().then(async (win) => {
      (t2x = -4), (t2y = -2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(−1.5`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
        let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
        let r = stateVariables["/_circle1"].stateValues.numericalRadius;

        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
        );
        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `${nInDOM(Math.trunc(cny * 100) / 100)}`,
        );
        cy.get(cesc("#\\/radiusNumber")).should(
          "contain.text",
          nInDOM(Math.trunc(r * 100) / 100),
        );

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);

        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move third point");
    cy.window().then(async (win) => {
      (t3x = 5), (t3y = 3);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(−0.7`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
        let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
        let r = stateVariables["/_circle1"].stateValues.numericalRadius;

        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
        );
        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `${nInDOM(Math.trunc(cny * 100) / 100)}`,
        );
        cy.get(cesc("#\\/radiusNumber")).should(
          "contain.text",
          nInDOM(Math.trunc(r * 100) / 100),
        );

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);

        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move points to be identical");
    cy.window().then(async (win) => {
      (t1x = 5), (t1y = 3);
      (t2x = 5), (t2y = 3);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });

      // should be a circle of radius zero
      let cnx = t1x;
      let cny = t1y;
      let r = 0;

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("points 1 and 3 are identical");
    cy.window().then(async (win) => {
      (t2x = 2), (t2y = -7);

      // two points should be the diameter
      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("points 2 and 3 are identical");
    cy.window().then(async (win) => {
      (t3x = 2), (t3y = -7);

      // two points should be the diameter
      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("points 1 and 2 are identical");
    cy.window().then(async (win) => {
      (t1x = 4), (t1y = 9);
      (t2x = 4), (t2y = 9);

      // two points should be the diameter
      let cnx = (t1x + t3x) / 2;
      let cny = (t1y + t3y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move points apart again");
    cy.window().then(async (win) => {
      (t2x = 2), (t2y = -7);
      (t3x = 0), (t3y = -8);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(−3.6`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
        let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
        let r = stateVariables["/_circle1"].stateValues.numericalRadius;

        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
        );
        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `${nInDOM(Math.trunc(cny * 100) / 100)}`,
        );
        cy.get(cesc("#\\/radiusNumber")).should(
          "contain.text",
          nInDOM(Math.trunc(r * 100) / 100),
        );

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move center by reffed point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      let dx = 2,
        dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("half radius around center");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      r = r / 2;

      t1x = cnx + (t1x - cnx) / 2;
      t1y = cny + (t1y - cny) / 2;
      t2x = cnx + (t2x - cnx) / 2;
      t2y = cny + (t2y - cny) / 2;
      t3x = cnx + (t3x - cnx) / 2;
      t3y = cny + (t3y - cny) / 2;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: r, y: 0 },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph3/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph3/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph3/circle"].stateValues.numericalRadius;

      let dx = -5,
        dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph4/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph4/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph4/circle"].stateValues.numericalRadius;

      let dx = 7,
        dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });
  });

  it("circle through three points, undefined on first pass", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <circle through="$_point1 $_point2 $_point3" />
    <point>(2,-3)</point><point>(3,4)</point><point>(-3,4)</point>
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2" displayDigits="8">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <copy prop="diameter" assignNames="diam" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = 4;
    let t3x = -3,
      t3y = 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);

      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(t1x, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(t1y, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(t2x, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(t2y, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(t3x, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(t3y, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle up and to the right");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      let dx = 3,
        dy = 4;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move first point to be in straight line");
    cy.window().then(async (win) => {
      (t1x = -3), (t1y = 8);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y },
      });
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(＿,＿)`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", "＿");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalRadius,
          ),
        ).false;
        expect(
          Number.isFinite(stateVariables["/_circle1"].stateValues.center[0]),
        ).false;
        expect(
          Number.isFinite(stateVariables["/_circle1"].stateValues.center[1]),
        ).false;
        expect(Number.isFinite(stateVariables["/_circle1"].stateValues.radius))
          .false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalRadius,
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.center[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.center[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            await stateVariables["/graph3/circle"].stateValues.radius,
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalRadius,
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.center[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.center[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            await stateVariables["/graph4/circle"].stateValues.radius,
          ),
        ).false;

        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          Number.isFinite(
            (await stateVariables["/centerPoint"].stateValues.xs)[0],
          ),
        ).false;
        expect(
          Number.isFinite(stateVariables["/centerPoint"].stateValues.xs[1]),
        ).false;
        expect(
          Number.isFinite(stateVariables["/radiusNumber"].stateValues.value),
        ).false;
        expect(Number.isFinite(stateVariables["/diam"].stateValues.value))
          .false;
      });
    });

    cy.log("move second point");
    cy.window().then(async (win) => {
      (t2x = -4), (t2y = -2);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(−1.5`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
        let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
        let r = stateVariables["/_circle1"].stateValues.numericalRadius;

        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
        );
        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `${nInDOM(Math.trunc(cny * 100) / 100)}`,
        );
        cy.get(cesc("#\\/radiusNumber")).should(
          "contain.text",
          nInDOM(Math.trunc(r * 100) / 100),
        );

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);

        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move third point");
    cy.window().then(async (win) => {
      (t3x = 5), (t3y = 3);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(−0.7`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
        let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
        let r = stateVariables["/_circle1"].stateValues.numericalRadius;

        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
        );
        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `${nInDOM(Math.trunc(cny * 100) / 100)}`,
        );
        cy.get(cesc("#\\/radiusNumber")).should(
          "contain.text",
          nInDOM(Math.trunc(r * 100) / 100),
        );

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);

        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move points to be identical");
    cy.window().then(async (win) => {
      (t1x = 5), (t1y = 3);
      (t2x = 5), (t2y = 3);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });

      // should be a circle of radius zero
      let cnx = t1x;
      let cny = t1y;
      let r = 0;

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("points 1 and 3 are identical");
    cy.window().then(async (win) => {
      (t2x = 2), (t2y = -7);

      // two points should be the diameter
      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("points 2 and 3 are identical");
    cy.window().then(async (win) => {
      (t3x = 2), (t3y = -7);

      // two points should be the diameter
      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("points 1 and 2 are identical");
    cy.window().then(async (win) => {
      (t1x = 4), (t1y = 9);
      (t2x = 4), (t2y = 9);

      // two points should be the diameter
      let cnx = (t1x + t3x) / 2;
      let cny = (t1y + t3y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move points apart again");
    cy.window().then(async (win) => {
      (t2x = 2), (t2y = -7);
      (t3x = 0), (t3y = -8);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(−3.6`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
        let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
        let r = stateVariables["/_circle1"].stateValues.numericalRadius;

        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
        );
        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `${nInDOM(Math.trunc(cny * 100) / 100)}`,
        );
        cy.get(cesc("#\\/radiusNumber")).should(
          "contain.text",
          nInDOM(Math.trunc(r * 100) / 100),
        );

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move center by reffed point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      let dx = 2,
        dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("half radius around center");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      r = r / 2;

      t1x = cnx + (t1x - cnx) / 2;
      t1y = cny + (t1y - cny) / 2;
      t2x = cnx + (t2x - cnx) / 2;
      t2y = cny + (t2y - cny) / 2;
      t3x = cnx + (t3x - cnx) / 2;
      t3y = cny + (t3y - cny) / 2;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: r, y: 0 },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph3/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph3/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph3/circle"].stateValues.numericalRadius;

      let dx = -5,
        dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph4/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph4/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph4/circle"].stateValues.numericalRadius;

      let dx = 7,
        dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });
  });

  it("circle with radius and through one point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" source="_point1" /></math>
    <graph>
    <point>(2,0)</point><point>(3,4)</point>

    <circle radius="$pX" through="$_point2" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let tx = 3,
        ty = 4;
      let r = 2;
      let cnx = tx,
        cny = ty - r;

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let tx = 1,
        ty = -1;
      let r = 2;
      let cnx = tx,
        cny = ty - r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move through point");
    cy.window().then(async (win) => {
      let tx = 4,
        ty = 7;
      let r = 2;
      let cnx = tx,
        cny = ty - r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: tx, y: ty },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("change definition radius");
    cy.window().then(async (win) => {
      let tx = 4,
        ty = 7;
      let r = 6;
      let cnx = tx,
        cny = ty - r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: r, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("half reffed radius, center moves");
    cy.window().then(async (win) => {
      let cnx = 4,
        cny = 4;
      let r = 3;
      let tx = cnx,
        ty = cny + 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: r, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let cnx = 9,
        cny = -10;
      let r = 3;
      let tx = cnx,
        ty = cny + r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = -4,
        cny = -3;
      let r = 3;
      let tx = cnx,
        ty = cny + r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });
  });

  it("circle with radius and through two points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" source="_point1" /></math>
    <graph>
    <point>(2,0)</point><point>(3,4)</point><point>(5,6)</point>

    <circle radius="$pX" through="$_point2 $_point3" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2" displayDigits="8">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 3,
        t1y = 4;
      let t2x = 5,
        t2y = 6;
      let r = 2;

      // get center from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(t1x, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(t1y, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(t2x, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(t2y, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 3,
        t1y = 4;
      let t2x = 5,
        t2y = 6;
      let r = 2;

      // get center from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];

      let dx = -1,
        dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move through point too far away");
    cy.window().then(async (win) => {
      let t1x = 0,
        t1y = -1;
      let t2x = 4,
        t2y = 3;
      let r = 2;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t1x, y: t1y },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(＿,＿)`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          Number.isFinite(stateVariables["/_circle1"].stateValues.center[0]),
        ).false;
        expect(
          Number.isFinite(stateVariables["/_circle1"].stateValues.center[1]),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).false;
        // expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalRadius)).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.center[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.center[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
          ),
        ).false;
        // expect(Number.isFinite((await stateVariables["/graph3/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalRadius)).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.center[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.center[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
          ),
        ).false;
        // expect(Number.isFinite((await stateVariables["/graph4/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalRadius)).false;
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          Number.isFinite(
            (await stateVariables["/centerPoint"].stateValues.xs)[0],
          ),
        ).false;
        expect(
          Number.isFinite(stateVariables["/centerPoint"].stateValues.xs[1]),
        ).false;
        // expect(Number.isFinite(stateVariables["/radiusNumber"].stateValues.value)).false;
      });
    });

    cy.log("increase definition radius");
    cy.window().then(async (win) => {
      let t1x = 0,
        t1y = -1;
      let t2x = 4,
        t2y = 3;
      let r = 6;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: r, y: 0 },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(−1.7`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // get center from circle itself
        let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
        let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];

        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
        );
        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `${nInDOM(Math.trunc(cny * 100) / 100)}`,
        );
        cy.get(cesc("#\\/radiusNumber")).should(
          "contain.text",
          nInDOM(Math.trunc(r * 100) / 100),
        );

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("decrease reffed and then definition radius");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 0,
        t1y = -1;
      let t2x = 4,
        t2y = 3;
      let r = 6;

      // get center from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];

      r = r / 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: r, y: 0 },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(＿,＿)`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          Number.isFinite(stateVariables["/_circle1"].stateValues.center[0]),
        ).false;
        expect(
          Number.isFinite(stateVariables["/_circle1"].stateValues.center[1]),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).false;
        // expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalRadius)).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.center[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.center[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
          ),
        ).false;
        // expect(Number.isFinite((await stateVariables["/graph3/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalRadius)).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.center[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.center[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
          ),
        ).false;
        // expect(Number.isFinite((await stateVariables["/graph4/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalRadius)).false;
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          Number.isFinite(
            (await stateVariables["/centerPoint"].stateValues.xs)[0],
          ),
        ).false;
        expect(
          Number.isFinite(stateVariables["/centerPoint"].stateValues.xs[1]),
        ).false;
        // expect(Number.isFinite(stateVariables["/radiusNumber"].stateValues.value)).false;

        r = r * 3;
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point4",
          args: { x: r, y: 0 },
        });

        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
        );
        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `${nInDOM(Math.trunc(cny * 100) / 100)}`,
        );
        cy.get(cesc("#\\/radiusNumber")).should(
          "contain.text",
          nInDOM(Math.trunc(r * 100) / 100),
        );
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );

        r = r / 9;
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: r, y: 0 },
        });
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(＿,＿)`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          Number.isFinite(stateVariables["/_circle1"].stateValues.center[0]),
        ).false;
        expect(
          Number.isFinite(stateVariables["/_circle1"].stateValues.center[1]),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).false;
        // expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalRadius)).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.center[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.center[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
          ),
        ).false;
        // expect(Number.isFinite((await stateVariables["/graph3/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalRadius)).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.center[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.center[1],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
          ),
        ).false;
        // expect(Number.isFinite((await stateVariables["/graph4/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalRadius)).false;
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          Number.isFinite(
            (await stateVariables["/centerPoint"].stateValues.xs)[0],
          ),
        ).false;
        expect(
          Number.isFinite(stateVariables["/centerPoint"].stateValues.xs[1]),
        ).false;
        // expect(Number.isFinite(stateVariables["/radiusNumber"].stateValues.value)).false;
      });
    });

    cy.log("move through points on top of each other");
    cy.window().then(async (win) => {
      let t1x = 5,
        t1y = -4;
      let t2x = 5,
        t2y = -4;
      let r = 2 / 3;

      let cnx = t1x,
        cny = t1y - r;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t1x, y: t1y },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t2x, y: t2y },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move through points apart, but close enough");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = -2,
        t1y = 7;
      let t2x = -2.5,
        t2y = 6.6;
      let r = 2 / 3;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t1x, y: t1y },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t2x, y: t2y },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", "(−1.8");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        // get center from circle itself
        let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
        let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];

        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
        );
        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `${nInDOM(Math.trunc(cny * 100) / 100)}`,
        );
        cy.get(cesc("#\\/radiusNumber")).should(
          "contain.text",
          nInDOM(Math.trunc(r * 100) / 100),
        );

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move reffed center");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = -2,
        t1y = 7;
      let t2x = -2.5,
        t2y = 6.6;
      let r = 2 / 3;

      // get center from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];

      let dx = 6,
        dy = -7;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 4,
        t1y = 0;
      let t2x = 3.5,
        t2y = -0.4;
      let r = 2 / 3;

      // get center from circle itself
      let cnx = stateVariables["/graph3/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph3/circle"].stateValues.numericalCenter[1];

      let dx = 3,
        dy = -1;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 7,
        t1y = -1;
      let t2x = 6.5,
        t2y = -1.4;
      let r = 2 / 3;

      // get center from circle itself
      let cnx = stateVariables["/graph4/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph4/circle"].stateValues.numericalCenter[1];

      let dx = -5,
        dy = 3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });
  });

  it("circle with center and through point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(3,4)</point><point>(5,6)</point>

    <circle center="$_point1" through="$_point2" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 3,
        cny = 4;
      let tx = 5,
        ty = 6;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(cnx, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(cny, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let cnx = 3,
        cny = 4;
      let tx = 5,
        ty = 6;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = -2,
        dy = -6;
      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move defining center");
    cy.window().then(async (win) => {
      let cnx = 1,
        cny = -2;
      let tx = 3,
        ty = 0;

      cnx = -5;
      cny = 5;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: cnx, y: cny },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move reffed center");
    cy.window().then(async (win) => {
      let cnx = 1,
        cny = -1;
      let tx = 3,
        ty = 0;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move through point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 1,
        cny = -1;
      let tx = -4,
        ty = 3;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: tx, y: ty },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("change reffed radius");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 1,
        cny = -1;
      let tx = -4,
        ty = 3;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      r = r / 4;

      tx = cnx + (tx - cnx) / 4;
      ty = cny + (ty - cny) / 4;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: r, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let cnx = 1,
        cny = -1;
      let tx = -4,
        ty = 3;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      r = r / 4;

      tx = cnx + (tx - cnx) / 4;
      ty = cny + (ty - cny) / 4;

      let dx = 4,
        dy = -1;

      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 1,
        cny = -1;
      let tx = -4,
        ty = 3;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      r = r / 4;

      tx = cnx + (tx - cnx) / 4;
      ty = cny + (ty - cny) / 4;

      let dx = -5,
        dy = 4;

      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });
  });

  it("circle with radius and center", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" source="_point1" /></math>
    <graph>
    <point>(3,0)</point>
    <point name="center">(-3,5)</point>
    <circle radius="$pX" center="$center" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point name="radiusPoint" x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = -3,
        cny = 5;
      let r = 3;

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
      expect((await stateVariables["/center"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect((await stateVariables["/center"].stateValues.xs)[1]).closeTo(
        cny,
        1e-12,
      );
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
    });

    cy.log("make defined radius negative");
    cy.window().then(async (win) => {
      let cnx = -3,
        cny = 5;
      let r = -3;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: r, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          0,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          0,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(0, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(0, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect((await stateVariables["/center"].stateValues.xs)[0]).closeTo(
          cnx,
          1e-12,
        );
        expect((await stateVariables["/center"].stateValues.xs)[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          0,
          1e-12,
        );
      });
    });

    cy.log("making copied radius negative sets it to zero");
    cy.window().then(async (win) => {
      let cnx = -3,
        cny = 5;
      let r = 0;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1, y: 0 },
      });

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/radiusPoint",
        args: { x: -5, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect((await stateVariables["/center"].stateValues.xs)[0]).closeTo(
          cnx,
          1e-12,
        );
        expect((await stateVariables["/center"].stateValues.xs)[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });
  });

  it("point constrained to circle", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" source="_point1" /></math>
    <point>(3,0)</point><point>(-1,7)</point>
    <graph>
      <circle radius="$pX" center="$_point2" />
      <point x="-4" y="-6">
        <constraints>
          <constrainTo><copy source="_circle1" /></constrainTo>
        </constraints>
      </point>
      </graph>
    <graph>
      <copy prop="center" assignNames="centerPoint" source="_circle1" />
      <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <copy name="graph2" source="_graph1" newNamespace />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = -1,
        cny = 7;
      let r = 3;

      let px = stateVariables["/_point3"].stateValues.xs[0];
      let py = stateVariables["/_point3"].stateValues.xs[1];
      let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
      expect(dist).closeTo(r, 1e-12);
      expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
      expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/graph2/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph2/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(
        await stateVariables["/graph2/_circle1"].stateValues.radius,
      ).closeTo(r, 1e-12);
      expect(
        stateVariables["/graph2/_circle1"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(cnx, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(cny, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let cnx = 5,
        cny = -2;
      let r = 3;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: cnx, y: cny },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables["/_point3"].stateValues.xs[0];
        let py = stateVariables["/_point3"].stateValues.xs[1];
        let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
        expect(dist).closeTo(r, 1e-12);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph2/_circle1"].stateValues.center[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.center[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph2/_circle1"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("shink circle");
    cy.window().then(async (win) => {
      let cnx = 5,
        cny = -2;
      let r = 1;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: r, y: 0 },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables["/_point3"].stateValues.xs[0];
        let py = stateVariables["/_point3"].stateValues.xs[1];
        let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
        expect(dist).closeTo(r, 1e-12);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph2/_circle1"].stateValues.center[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.center[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph2/_circle1"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move point");
    cy.window().then(async (win) => {
      let cnx = 5,
        cny = -2;
      let r = 1;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: -9, y: 8 },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables["/_point3"].stateValues.xs[0];
        let py = stateVariables["/_point3"].stateValues.xs[1];
        let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
        expect(dist).closeTo(r, 1e-12);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph2/_circle1"].stateValues.center[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.center[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph2/_circle1"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle shadow");
    cy.window().then(async (win) => {
      let cnx = -3,
        cny = 7;
      let r = 1;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph2/_circle1",
        args: { center: [cnx, cny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables["/_point3"].stateValues.xs[0];
        let py = stateVariables["/_point3"].stateValues.xs[1];
        let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
        expect(dist).closeTo(r, 1e-12);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph2/_circle1"].stateValues.center[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.center[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph2/_circle1"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move point shadow");
    cy.window().then(async (win) => {
      let cnx = -3,
        cny = 7;
      let r = 1;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/graph2/_point3",
        args: { x: 11, y: -21 },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables["/_point3"].stateValues.xs[0];
        let py = stateVariables["/_point3"].stateValues.xs[1];
        let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
        expect(dist).closeTo(r, 1e-12);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph2/_circle1"].stateValues.center[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.center[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph2/_circle1"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph2/_circle1"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });
  });

  it("all updatable with copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(3,0)</point><point>(-1,7)</point>
    <circle center="$_point1" through="$_point2" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point>
      (<copy prop="y" source="centerPoint" />,
      <copy prop="radius" source="_circle1" />)
    </point>
    <copy assignNames="circle2" source="_circle1" />
    </graph>
    <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 3,
        cny = 0;
      let tx = -1,
        ty = 7;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(cnx, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(cny, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(cny, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(r, 1e-12);
      expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/circle2"].stateValues.numericalCenter[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/circle2"].stateValues.numericalCenter[1]).closeTo(
        cny,
        1e-12,
      );
      expect(await stateVariables["/circle2"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle 1");
    cy.window().then(async (win) => {
      let cnx = 3,
        cny = 0;
      let tx = -1,
        ty = 7;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = -5,
        dy = 4;
      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(r, 1e-12);
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(await stateVariables["/circle2"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle 2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 3,
        cny = 0;
      let tx = -1,
        ty = 7;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = 3,
        dy = -2;
      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/circle2",
        args: { center: [cnx, cny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(r, 1e-12);
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(await stateVariables["/circle2"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move copied center");
    cy.window().then(async (win) => {
      let cnx = 6,
        cny = -2;
      let tx = 2,
        ty = 5;

      let dx = -5,
        dy = -5;
      cnx += dx;
      cny += dy;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(r, 1e-12);
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(await stateVariables["/circle2"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move defining center");
    cy.window().then(async (win) => {
      let tx = 2,
        ty = 5;

      let cnx = -3;
      let cny = 1;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: cnx, y: cny },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(r, 1e-12);
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(await stateVariables["/circle2"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move through point");
    cy.window().then(async (win) => {
      let cnx = -3,
        cny = 1;

      let tx = 0;
      let ty = 4;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: tx, y: ty },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(r, 1e-12);
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(await stateVariables["/circle2"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
      });
    });

    // This test captures the actual behavior with this strange construction
    // Question: is this the desired behavior?
    // Not sure how to improve behavior in a way that wouldn't depend
    // on the order of which is updated first:
    // the x or y coordinate of the point moved
    cy.log("move point of refs");
    cy.window().then(async (win) => {
      let cnx = -3,
        cny = 1;
      let tx = 0,
        ty = 4;

      let theta = Math.atan2(ty - cny, tx - cnx);

      let rSpecified = 2;
      tx = cnx + rSpecified * Math.cos(theta);
      ty = cny + rSpecified * Math.sin(theta);

      cny = -3;

      // first time through, the radius doesn't end up being what specified
      let rActual = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: cny, y: rSpecified },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(rActual * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          rActual,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          rActual,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          rActual,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/circle2"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(await stateVariables["/circle2"].stateValues.radius).closeTo(
          rActual,
          1e-12,
        );
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(
          rActual,
          1e-12,
        );

        // try it again
        // since center doesn't move, we get radius specified
        theta = Math.atan2(ty - cny, tx - cnx);
        tx = cnx + rSpecified * Math.cos(theta);
        ty = cny + rSpecified * Math.sin(theta);
        rActual = rSpecified;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point3",
          args: { x: cny, y: rSpecified },
        });

        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
        );
        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `${nInDOM(Math.trunc(cny * 100) / 100)}`,
        );
        cy.get(cesc("#\\/radiusNumber")).should(
          "contain.text",
          nInDOM(Math.trunc(rActual * 100) / 100),
        );

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
            cnx,
            1e-12,
          );
          expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
            cny,
            1e-12,
          );
          expect(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ).closeTo(cnx, 1e-12);
          expect(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ).closeTo(cny, 1e-12);
          expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
            rActual,
            1e-12,
          );
          expect(
            stateVariables["/_circle1"].stateValues.numericalRadius,
          ).closeTo(rActual, 1e-12);
          expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
            cnx,
            1e-12,
          );
          expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
            cny,
            1e-12,
          );
          expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
            tx,
            1e-12,
          );
          expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
            ty,
            1e-12,
          );
          expect(
            (await stateVariables["/centerPoint"].stateValues.xs)[0],
          ).closeTo(cnx, 1e-12);
          expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
            cny,
            1e-12,
          );
          expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
            cny,
            1e-12,
          );
          expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
            rActual,
            1e-12,
          );
          expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(
            cnx,
            1e-12,
          );
          expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(
            cny,
            1e-12,
          );
          expect(
            stateVariables["/circle2"].stateValues.numericalCenter[0],
          ).closeTo(cnx, 1e-12);
          expect(
            stateVariables["/circle2"].stateValues.numericalCenter[1],
          ).closeTo(cny, 1e-12);
          expect(await stateVariables["/circle2"].stateValues.radius).closeTo(
            rActual,
            1e-12,
          );
          expect(
            stateVariables["/circle2"].stateValues.numericalRadius,
          ).closeTo(rActual, 1e-12);
        });
      });
    });
  });

  it("triangle inscribed in circle, copy center coordinates separately and radius", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <number hide name="fixedZero" fixed>0</number>
    <graph>
    <triangle layer="1" name="t" vertices="(1,2) (3,5) (-5,2)" />
  
    <circle name="c" through="$t.vertex1 $t.vertex2 $t.vertex3" />
  
    <point name="x">
      (<extract prop="x"><copy prop="center" source="c" /></extract>,
      $fixedZero)
    </point>
  
    <point name="y">
      ($fixedZero,
      <extract prop="y"><copy prop="center" source="c" /></extract>)
    </point>
    <point name="r">
      (<copy prop="radius" source="c" />, 5)
    </point>
  
    </graph>
    <copy prop="center" assignNames="centerPoint2" source="c" displayDigits="8" />
    <copy prop="radius" assignNames="radiusNumber" source="c" displayDigits="8" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 1,
      t1y = 2,
      t2x = 3,
      t2y = 5,
      t3x = -5,
      t3y = 2;
    let circy, circx, r;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // calculate center and radius from circle itself
      circx = stateVariables["/c"].stateValues.numericalCenter[0];
      circy = stateVariables["/c"].stateValues.numericalCenter[1];
      r = stateVariables["/c"].stateValues.numericalRadius;

      // verify triangle vertices are on circle
      expect(Math.sqrt((t1x - circx) ** 2 + (t1y - circy) ** 2)).closeTo(
        r,
        1e-12,
      );
      expect(Math.sqrt((t2x - circx) ** 2 + (t2y - circy) ** 2)).closeTo(
        r,
        1e-12,
      );
      expect(Math.sqrt((t3x - circx) ** 2 + (t3y - circy) ** 2)).closeTo(
        r,
        1e-12,
      );

      expect(stateVariables["/t"].stateValues.vertices[0][0]).closeTo(
        t1x,
        1e-12,
      );
      expect(stateVariables["/t"].stateValues.vertices[0][1]).closeTo(
        t1y,
        1e-12,
      );
      expect(stateVariables["/t"].stateValues.vertices[1][0]).closeTo(
        t2x,
        1e-12,
      );
      expect(stateVariables["/t"].stateValues.vertices[1][1]).closeTo(
        t2y,
        1e-12,
      );
      expect(stateVariables["/t"].stateValues.vertices[2][0]).closeTo(
        t3x,
        1e-12,
      );
      expect(stateVariables["/t"].stateValues.vertices[2][1]).closeTo(
        t3y,
        1e-12,
      );
      expect(stateVariables["/c"].stateValues.center[0]).closeTo(circx, 1e-12);
      expect(stateVariables["/c"].stateValues.center[1]).closeTo(circy, 1e-12);
      expect(stateVariables["/c"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/x"].stateValues.xs[0]).closeTo(circx, 1e-12);
      expect(stateVariables["/y"].stateValues.xs[1]).closeTo(circy, 1e-12);
      expect(stateVariables["/r"].stateValues.xs[0]).closeTo(r, 1e-12);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(circx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(circy * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move triangle points");
    cy.window().then(async (win) => {
      (t1x = -3), (t1y = 1), (t2x = 4), (t2y = 0), (t3x = -1), (t3y = 7);

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/t",
        args: {
          pointCoords: [
            [t1x, t1y],
            [t2x, t2y],
            [t3x, t3y],
          ],
        },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(0.8`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        // calculate center and radius from circle itself
        circx = stateVariables["/c"].stateValues.numericalCenter[0];
        circy = stateVariables["/c"].stateValues.numericalCenter[1];
        r = stateVariables["/c"].stateValues.numericalRadius;

        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `(${nInDOM(Math.trunc(circx * 100) / 100)}`,
        );
        cy.get(cesc("#\\/centerPoint2")).should(
          "contain.text",
          `${nInDOM(Math.trunc(circy * 100) / 100)}`,
        );
        cy.get(cesc("#\\/radiusNumber")).should(
          "contain.text",
          nInDOM(Math.trunc(r * 100) / 100),
        );

        // verify triangle vertices are on circle
        expect(Math.sqrt((t1x - circx) ** 2 + (t1y - circy) ** 2)).closeTo(
          r,
          1e-12,
        );
        expect(Math.sqrt((t2x - circx) ** 2 + (t2y - circy) ** 2)).closeTo(
          r,
          1e-12,
        );
        expect(Math.sqrt((t3x - circx) ** 2 + (t3y - circy) ** 2)).closeTo(
          r,
          1e-12,
        );

        expect(stateVariables["/t"].stateValues.vertices[0][0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[0][1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][1]).closeTo(
          t3y,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.radius).closeTo(r, 1e-12);
        expect(stateVariables["/x"].stateValues.xs[0]).closeTo(circx, 1e-12);
        expect(stateVariables["/y"].stateValues.xs[1]).closeTo(circy, 1e-12);
        expect(stateVariables["/r"].stateValues.xs[0]).closeTo(r, 1e-12);
      });
    });

    cy.log("move circle via center");
    cy.window().then(async (win) => {
      let dx = 2,
        dy = -3;
      circx += dx;
      circy += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/c",
        args: { center: [circx, circy] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(circx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(circy * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/c"].stateValues.numericalCenter[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalCenter[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );

        expect(stateVariables["/t"].stateValues.vertices[0][0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[0][1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][1]).closeTo(
          t3y,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.radius).closeTo(r, 1e-12);
        expect(stateVariables["/x"].stateValues.xs[0]).closeTo(circx, 1e-12);
        expect(stateVariables["/y"].stateValues.xs[1]).closeTo(circy, 1e-12);
        expect(stateVariables["/r"].stateValues.xs[0]).closeTo(r, 1e-12);
      });
    });

    cy.log("move circle center x");
    cy.window().then(async (win) => {
      let dx = -5;
      circx += dx;
      t1x += dx;
      t2x += dx;
      t3x += dx;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/x",
        args: { x: circx },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(circx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(circy * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/c"].stateValues.numericalCenter[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalCenter[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );

        expect(stateVariables["/t"].stateValues.vertices[0][0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[0][1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][1]).closeTo(
          t3y,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.radius).closeTo(r, 1e-12);
        expect(stateVariables["/x"].stateValues.xs[0]).closeTo(circx, 1e-12);
        expect(stateVariables["/y"].stateValues.xs[1]).closeTo(circy, 1e-12);
        expect(stateVariables["/r"].stateValues.xs[0]).closeTo(r, 1e-12);
      });
    });

    cy.log("move circle center y");
    cy.window().then(async (win) => {
      let dy = 6;
      circy += dy;
      t1y += dy;
      t2y += dy;
      t3y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/y",
        args: { y: circy },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(circx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(circy * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/c"].stateValues.numericalCenter[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalCenter[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );

        expect(stateVariables["/t"].stateValues.vertices[0][0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[0][1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][1]).closeTo(
          t3y,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.radius).closeTo(r, 1e-12);
        expect(stateVariables["/x"].stateValues.xs[0]).closeTo(circx, 1e-12);
        expect(stateVariables["/y"].stateValues.xs[1]).closeTo(circy, 1e-12);
        expect(stateVariables["/r"].stateValues.xs[0]).closeTo(r, 1e-12);
      });
    });

    cy.log("shrink radius");
    cy.window().then(async (win) => {
      let radiusfactor = 0.4;

      r = r * radiusfactor;

      t1x = circx + (t1x - circx) * radiusfactor;
      t1y = circy + (t1y - circy) * radiusfactor;
      t2x = circx + (t2x - circx) * radiusfactor;
      t2y = circy + (t2y - circy) * radiusfactor;
      t3x = circx + (t3x - circx) * radiusfactor;
      t3y = circy + (t3y - circy) * radiusfactor;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/r",
        args: { x: r },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(circx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(circy * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/c"].stateValues.numericalCenter[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalCenter[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );

        expect(stateVariables["/t"].stateValues.vertices[0][0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[0][1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][1]).closeTo(
          t3y,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.radius).closeTo(r, 1e-12);
        expect(stateVariables["/x"].stateValues.xs[0]).closeTo(circx, 1e-12);
        expect(stateVariables["/y"].stateValues.xs[1]).closeTo(circy, 1e-12);
        expect(stateVariables["/r"].stateValues.xs[0]).closeTo(r, 1e-12);
      });
    });

    cy.log("shrink radius to zero");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/r",
        args: { x: -3 },
      }); // overshoot

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(circx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(circy * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/c"].stateValues.numericalCenter[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalCenter[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalRadius).closeTo(
          0,
          1e-12,
        );

        expect(stateVariables["/t"].stateValues.vertices[0][0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[0][1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.radius).closeTo(0, 1e-12);
        expect(stateVariables["/x"].stateValues.xs[0]).closeTo(circx, 1e-12);
        expect(stateVariables["/y"].stateValues.xs[1]).closeTo(circy, 1e-12);
        expect(stateVariables["/r"].stateValues.xs[0]).closeTo(0, 1e-12);
      });
    });

    cy.log("increase radius to 6");
    cy.window().then(async (win) => {
      let radiusfactor = 6 / r;

      r = r * radiusfactor;

      t1x = circx + (t1x - circx) * radiusfactor;
      t1y = circy + (t1y - circy) * radiusfactor;
      t2x = circx + (t2x - circx) * radiusfactor;
      t2y = circy + (t2y - circy) * radiusfactor;
      t3x = circx + (t3x - circx) * radiusfactor;
      t3y = circy + (t3y - circy) * radiusfactor;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/r",
        args: { x: r },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(circx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(circy * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/c"].stateValues.numericalCenter[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalCenter[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );

        expect(stateVariables["/t"].stateValues.vertices[0][0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[0][1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[1][1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/t"].stateValues.vertices[2][1]).closeTo(
          t3y,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[0]).closeTo(
          circx,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.center[1]).closeTo(
          circy,
          1e-12,
        );
        expect(stateVariables["/c"].stateValues.radius).closeTo(r, 1e-12);
        expect(stateVariables["/x"].stateValues.xs[0]).closeTo(circx, 1e-12);
        expect(stateVariables["/y"].stateValues.xs[1]).closeTo(circy, 1e-12);
        expect(stateVariables["/r"].stateValues.xs[0]).closeTo(r, 1e-12);
      });
    });
  });

  it("circle where radius depends on center", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <math hide name="r"><extract prop="y"><copy prop="center" source="_circle1" /></extract></math>
  <graph>
    <circle radius="$r" center="(1,2)" />
    <copy prop="center" source="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 2]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
        "vector",
        1,
        2,
      ]);
      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(2),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, 5] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(-3)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(5)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(5));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([-3, 5]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -3,
          5,
        ]);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: 7 },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(8)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(7)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(7));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([8, 7]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(7);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          8,
          7,
        ]);
      });
    });

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [3, -2] },
      });
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(3)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(-2)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(0));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([3, -2]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(0);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          3,
          -2,
        ]);
      });
    });

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: 4 },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(1)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(4)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(4));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 4]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(4);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          1,
          4,
        ]);
      });
    });
  });

  it("circle where center depends on radius", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <circle radius="2" center="(1,$(_circle1.radius))" />
    <copy prop="center" source="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 2]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
        "vector",
        1,
        2,
      ]);
      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(2),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, 5] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(-3)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(5)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(5));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([-3, 5]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -3,
          5,
        ]);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: 7 },
      });
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(8)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(7)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(7));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([8, 7]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(7);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          8,
          7,
        ]);
      });
    });

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [3, -2] },
      });
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(3)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(0)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(0));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([3, 0]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(0);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          3,
          0,
        ]);
      });
    });

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: 4 },
      });
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(1)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(4)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(4));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 4]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(4);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          1,
          4,
        ]);
      });
    });
  });

  it("circle where center depends on diameter", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <circle radius="2" center="(1,$_circle1.diameter)" />
    <copy prop="center" source="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 4]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(2);
      expect(stateVariables["/_circle1"].stateValues.diameter).eq(4);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
        "vector",
        1,
        4,
      ]);
      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(2),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, 6] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(-3)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(6)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(3));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([-3, 6]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(3);
        expect(stateVariables["/_circle1"].stateValues.diameter).eq(6);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -3,
          6,
        ]);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: 4 },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(8)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(4)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([8, 4]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(2);
        expect(stateVariables["/_circle1"].stateValues.diameter).eq(4);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          8,
          4,
        ]);
      });
    });

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [3, -2] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(3)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(0)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(0));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([3, 0]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(0);
        expect(stateVariables["/_circle1"].stateValues.diameter).eq(0);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          3,
          0,
        ]);
      });
    });

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: 8 },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(1)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(8)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(4));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 8]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(4);
        expect(stateVariables["/_circle1"].stateValues.diameter).eq(8);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          1,
          8,
        ]);
      });
    });
  });

  it("circle where center depends on unspecified radius", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <circle center="(1,$(_circle1.radius))" />
    <copy prop="center" source="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 1]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(1);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
        "vector",
        1,
        1,
      ]);
      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(1),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, 5] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(-3)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(5)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(5));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([-3, 5]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(5);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -3,
          5,
        ]);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: 7 },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(8)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(7)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(7));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([8, 7]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(7);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          8,
          7,
        ]);
      });
    });

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [3, -2] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(3)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(0)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(0));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([3, 0]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(0);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          3,
          0,
        ]);
      });
    });

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: 4 },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(1)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(4)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(4));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 4]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(4);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          1,
          4,
        ]);
      });
    });
  });

  it("circle where single through point depends on radius", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <circle radius="2" through="(1,2$(_circle1.radius))" />
    <copy prop="center" source="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 2]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
        "vector",
        1,
        2,
      ]);
      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(2),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = (5 + 2) / 2;
      // given previous radius is 2, would move through point to 5+2,
      // so that center of circle would be (5+2)/2
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(-3)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          -3,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -3,
          actualHeight,
        ]);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = (7 + 3.5) / 2; // given previous radius is 3.5
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(8)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          8,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          8,
          actualHeight,
        ]);
      });
    });

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [4, -6] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(4)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(0)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(0));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([4, 0]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(0);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          4,
          0,
        ]);
      });
    });

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let desiredHeight = 4;
      let actualHeight = (4 + 0) / 2; // given previous radius is 0
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: desiredHeight },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(1)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          1,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          1,
          actualHeight,
        ]);
      });
    });
  });

  it("circle where single through point depends on unspecified radius", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <circle through="(1,2$(_circle1.radius))" />
    <copy prop="center" source="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 1]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(1);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
        "vector",
        1,
        1,
      ]);
      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(1),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = (5 + 1) / 2;
      // given previous radius is 1, would move through point to 5+1,
      // so that center of circle would be (5+1)/2
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(-3)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          -3,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -3,
          actualHeight,
        ]);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = (7 + 3) / 2; // given previous radius is 3
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(8)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          8,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          8,
          actualHeight,
        ]);
      });
    });

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [4, -6] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(4)}`);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `${nInDOM(0)}`);
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(0));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([4, 0]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(0);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          4,
          0,
        ]);
      });
    });

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let desiredHeight = 4;
      let actualHeight = (4 + 0) / 2; // given previous radius is 0
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: desiredHeight },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(1)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          1,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          1,
          actualHeight,
        ]);
      });
    });
  });

  it("circle where radius depends on single through point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <math name="r" hide><extract prop="y"><copy prop="throughPoint1" source="_circle1" /></extract>/2</math>
  <graph>
    <circle radius="$r" through="(1,4)" />
    <copy prop="center" source="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 2]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
        "vector",
        1,
        2,
      ]);
      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(2),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = (5 + 2) / 2;
      // given previous radius is 2, would move through point to 5+2,
      // so that center of circle would be (5+2)/2
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(-3)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          -3,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -3,
          actualHeight,
        ]);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = (7 + 3.5) / 2; // given previous radius is 3.5
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(8)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          8,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          8,
          actualHeight,
        ]);
      });
    });

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let desiredHeight = -6;
      let actualHeight = -6 + 5.25;
      // would move through point to -6+5.25,
      // but radius becomes zero, so center is at -6+5.25
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [4, desiredHeight] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(4)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(0));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          4,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(0);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          4,
          actualHeight,
        ]);
      });
    });

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let desiredHeight = 4;
      let actualHeight = (4 + 0) / 2; // given previous radius is 0
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: desiredHeight },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(1)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          1,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          1,
          actualHeight,
        ]);
      });
    });
  });

  it("circle where center depends on through point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <circle through="(1,4)" center="($_circle1.throughPointX1_1, $_circle1.throughPointX1_2/2)"/>
    <copy prop="center" source="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 2]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
        "vector",
        1,
        2,
      ]);
      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(2),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = 11 / 4;
      // Note: the following isn't the desired behavior, but it is a result of the situation
      // appearing to be that of a constrained center and a free through point when moving the circle.
      // (The through point ends up where requested but the center got altered.)
      // Since we care about that situation (see test "circle with center and through point, center constrained")
      // but don't care as much about this contrived situation,
      // we live with this more complicated behavior in the case where we have this strange relationship
      // between the through point and the center.
      // The attempt to move the through point a second time to preserve the radius yield this result:
      // Given previous radius is 2, would move through point to (-3, 5+2),
      // so that center of circle would initially be (-3,(5+2)/2).
      // Since center changed from given value but through point didn't,
      // it will attempt to move through point back to radius 2 above center,
      // i.e., to (-3, (5+2)/2+2)) = (-3, 11/2)
      // which will make the center be (-3, 11/4)
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(-3)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          -3,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -3,
          actualHeight,
        ]);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = 7; // since moving center itself
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(8)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          8,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          8,
          actualHeight,
        ]);
      });
    });

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let desiredHeight = -31;
      let actualHeight = -5 / 2;
      // Note: Given previous radius is 7, would move through point to (4, -24),
      // so that center of circle would initially be (4,-12).
      // Since center changed from given value but through point didn't,
      // it will attempt to move through point back to radius 7 above center,
      // i.e., to (4, -5)
      // which will make the center be (4, -5/2)
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [4, desiredHeight] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(4)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(-actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          4,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(
          -actualHeight,
        );
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          4,
          actualHeight,
        ]);
      });
    });

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let desiredHeight = 4;
      let actualHeight = 4; // since moving point itself
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: desiredHeight },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(1)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          1,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          1,
          actualHeight,
        ]);
      });
    });
  });

  it("circle where through point depends on center", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <circle through="($_circle1.centerX1,$(_circle1.centerX2)2)" center="(1,2)" />
    <copy prop="center" source="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 2]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
        "vector",
        1,
        2,
      ]);
      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(2),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = 11 / 4;
      // Note: the following isn't the desired behavior, but it is a result of the situation
      // appearing to be that of a constrained center and a free through point when moving the circle.
      // (The through point ends up where requested but the center got altered.)
      // Since we care about that situation (see test "circle with center and through point, center constrained")
      // but don't care as much about this contrived situation,
      // we live with this more complicated behavior in the case where we have this strange relationship
      // between the through point and the center.
      // The attempt to move the through point a second time to preserve the radius yield this result:
      // Given previous radius is 2, would move through point to (-3, 5+2),
      // so that center of circle would initially be (-3,(5+2)/2).
      // Since center changed from given value but through point didn't,
      // it will attempt to move through point back to radius 2 above center,
      // i.e., to (-3, (5+2)/2+2)) = (-3, 11/2)
      // which will make the center be (-3, 11/4)
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(-3)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          -3,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -3,
          actualHeight,
        ]);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = 7; // since moving center itself
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(8)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          8,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          8,
          actualHeight,
        ]);
      });
    });

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let desiredHeight = -31;
      let actualHeight = -5 / 2;
      // Note: given previous radius is 7, would move through point to (4, -24),
      // so that center of circle would initially be (4,-12).
      // Since center changed from given value but through point didn't,
      // it will attempt to move through point back to radius 7 above center,
      // i.e., to (4, -5)
      // which will make the center be (4, -5/2)
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [4, desiredHeight] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(4)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(-actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          4,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(
          -actualHeight,
        );
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          4,
          actualHeight,
        ]);
      });
    });

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let desiredHeight = 4;
      let actualHeight = 4; // since moving point itself
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: desiredHeight },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(1)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(actualHeight),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          1,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(actualHeight);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          1,
          actualHeight,
        ]);
      });
    });
  });

  it("circle where one center component depends on other center component", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <circle center="(1, $_circle1.centerX1+1)" />
    <copy prop="center" source="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_circle1"].stateValues.center).eqls([1, 2]);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(1);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
        "vector",
        1,
        2,
      ]);
      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(1),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = -2;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(-3)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(1));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          -3,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(1);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -3,
          actualHeight,
        ]);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = 9; // since moving center itself
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight },
      });

      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(${nInDOM(8)}`);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(actualHeight)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(1));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center).eqls([
          8,
          actualHeight,
        ]);
        expect(stateVariables["/_circle1"].stateValues.radius).eq(1);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          8,
          actualHeight,
        ]);
      });
    });
  });

  it("circle where radius depends on two through points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <math hide name="r">
    abs(<extract prop="x"><copy prop="throughPoint1" source="_circle1" /></extract>
      -<extract prop="x"><copy prop="throughPoint2" source="_circle1" /></extract>)
  </math>
  <graph>
    <point name="TP1">(1,2)</point>
    <point name="TP2">(3,4)</point>
    <circle radius="$r" through="$TP1 $TP2" />
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 1,
      t1y = 2;
    let t2x = 3,
      t2y = 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let r = Math.abs(t1x - t2x);
      expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
      expect(stateVariables["/_circle1"].stateValues.throughPoints[0]).eqls([
        t1x,
        t1y,
      ]);
      expect(stateVariables["/_circle1"].stateValues.throughPoints[1]).eqls([
        t2x,
        t2y,
      ]);
      expect(await stateVariables["/TP1"].stateValues.coords).eqls([
        "vector",
        t1x,
        t1y,
      ]);
      expect(await stateVariables["/TP2"].stateValues.coords).eqls([
        "vector",
        t2x,
        t2y,
      ]);
      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(r),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter =
        stateVariables["/_circle1"].stateValues.numericalCenter;
      let dx = 2,
        dy = -3;
      let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: newCenter },
      });

      let r = Math.abs(t1x - t2x);

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(newCenter[0])}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(newCenter[1])}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(newCenter[0], 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(newCenter[1], 1e-12);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter =
        stateVariables["/_circle1"].stateValues.numericalCenter;
      let dx = -5,
        dy = -2;
      let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: newCenter[0], y: newCenter[1] },
      });

      let r = Math.abs(t1x - t2x);

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(newCenter[0])}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(newCenter[1])}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(newCenter[0], 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(newCenter[1], 1e-12);
      });
    });

    cy.log("move first through point");
    cy.window().then(async (win) => {
      t1x = 6;
      t1y = 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP1",
        args: { x: t1x, y: t1y },
      });

      let r = Math.abs(t1x - t2x);

      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );
      });
    });

    cy.log("move second through point under first through point");
    cy.window().then(async (win) => {
      t2x = 5;
      t2y = -3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y },
      });

      let r = Math.abs(t1x - t2x);

      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).false;
      });
    });

    cy.log("move second through point close enough to make circle");
    cy.window().then(async (win) => {
      t2y = 1.5;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y },
      });

      let r = Math.abs(t1x - t2x);

      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).true;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).true;
      });
    });
  });

  it("circle with dependencies among radius and two through points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <math name="r" hide>
    <extract prop="x"><copy prop="throughPoint1" source="_circle1" /></extract>
  </math>
  <graph>
    <point name="TP1">(1,2)</point>
    <copy prop="throughPoint2" source="_circle1" assignNames="TP2" />
    <circle radius="$r" through="$TP1 ($(_circle1.radius)+1,3)" />
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
  </graph>

  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 1,
      t1y = 2;
    let t2x = 2,
      t2y = 3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let r = t1x;
      expect(stateVariables["/_circle1"].stateValues.radius).eq(r);
      expect(stateVariables["/_circle1"].stateValues.throughPoints[0]).eqls([
        t1x,
        t1y,
      ]);
      expect(stateVariables["/_circle1"].stateValues.throughPoints[1]).eqls([
        t2x,
        t2y,
      ]);
      expect(await stateVariables["/TP1"].stateValues.coords).eqls([
        "vector",
        t1x,
        t1y,
      ]);
      expect(await stateVariables["/TP2"].stateValues.coords).eqls([
        "vector",
        t2x,
        t2y,
      ]);

      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(r),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter =
        stateVariables["/_circle1"].stateValues.numericalCenter;
      let dx = 2,
        dy = -3;
      let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: newCenter },
      });

      let r = t1x;

      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).true;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).true;
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter =
        stateVariables["/_circle1"].stateValues.numericalCenter;
      let dx = -1,
        dy = -2;
      let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: newCenter[0], y: newCenter[1] },
      });

      let r = t1x;

      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).true;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).true;
      });
    });

    cy.log("move first through point");
    cy.window().then(async (win) => {
      t1x = 6;
      t1y = 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP1",
        args: { x: t1x, y: t1y },
      });

      let r = t1x;
      t2x = t1x + 1;

      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );
      });
    });

    cy.log("move second through point under first through point");
    cy.window().then(async (win) => {
      t2y = -9;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y },
      });

      let r = t1x;

      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).false;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).false;
      });
    });

    cy.log("move second through point to the right");
    cy.window().then(async (win) => {
      t2x = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y },
      });

      t1x = t2x - 1;
      let r = t1x;

      cy.get(cesc("#\\/radiusNumber")).should("contain.text", nInDOM(r));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).true;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).true;
      });
    });
  });

  it("circle where through point 2 depends on through point 1", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point name="TP1">(1,2)</point>
    <copy prop="throughPoint2" source="_circle1" assignNames="TP2" />
    <circle through="$TP1 ($_circle1.throughPointX1_1+1,3)"/>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
  </graph>

  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 1,
      t1y = 2;
    let t2x = 2,
      t2y = 3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;

      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.throughPoints[0]).eqls([
        t1x,
        t1y,
      ]);
      expect(stateVariables["/_circle1"].stateValues.throughPoints[1]).eqls([
        t2x,
        t2y,
      ]);
      expect(await stateVariables["/TP1"].stateValues.coords).eqls([
        "vector",
        t1x,
        t1y,
      ]);
      expect(await stateVariables["/TP2"].stateValues.coords).eqls([
        "vector",
        t2x,
        t2y,
      ]);

      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);

      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;

      let dx = 2,
        dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] },
      });

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;

      let dx = -1,
        dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny },
      });

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
      });
    });

    cy.log("move first through point");
    cy.window().then(async (win) => {
      t1x = 6;
      t1y = 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP1",
        args: { x: t1x, y: t1y },
      });

      t2x = t1x + 1;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;

      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
      });
    });

    cy.log("move second through point");
    cy.window().then(async (win) => {
      t2x = -7;
      t2y = -9;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y },
      });

      t1x = t2x - 1;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;

      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
      });
    });
  });

  it("circle with dependencies among three through points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point name="TP2">(1,2)</point>
    <copy prop="throughPoint3" source="_circle1" assignNames="TP3" />
    <circle through="($_circle1.throughPointX2_1+1,3) $TP2 ($_circle1.throughPointX1_1+1,5)" />
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
  </graph>

  <copy prop="throughPoint1" source="_circle1" assignNames="TP1" />
  <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = 3;
    let t2x = 1,
      t2y = 2;
    let t3x = 3,
      t3y = 5;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(Number.isFinite(stateVariables["/_circle1"].stateValues.radius))
        .true;
      expect(stateVariables["/_circle1"].stateValues.throughPoints[0]).eqls([
        t1x,
        t1y,
      ]);
      expect(stateVariables["/_circle1"].stateValues.throughPoints[1]).eqls([
        t2x,
        t2y,
      ]);
      expect(stateVariables["/_circle1"].stateValues.throughPoints[2]).eqls([
        t3x,
        t3y,
      ]);
      expect(await stateVariables["/TP1"].stateValues.coords).eqls([
        "vector",
        t1x,
        t1y,
      ]);
      expect(await stateVariables["/TP2"].stateValues.coords).eqls([
        "vector",
        t2x,
        t2y,
      ]);
      expect(await stateVariables["/TP3"].stateValues.coords).eqls([
        "vector",
        t3x,
        t3y,
      ]);

      expect(
        Number.isFinite(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ),
      ).true;
      expect(
        Number.isFinite(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ),
      ).true;

      let r = stateVariables["/_circle1"].stateValues.radius;

      cy.get(cesc("#\\/radiusNumber") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter =
        stateVariables["/_circle1"].stateValues.numericalCenter;
      let cnx = numericalCenter[0];
      let cny = numericalCenter[1];

      let dx = 2,
        dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      let r = stateVariables["/_circle1"].stateValues.radius;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] },
      });

      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[2][0],
        ).closeTo(t3x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[2][1],
        ).closeTo(t3y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );
        expect((await stateVariables["/TP3"].stateValues.xs)[0]).closeTo(
          t3x,
          1e-12,
        );
        expect((await stateVariables["/TP3"].stateValues.xs)[1]).closeTo(
          t3y,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter =
        stateVariables["/_circle1"].stateValues.numericalCenter;
      let cnx = numericalCenter[0];
      let cny = numericalCenter[1];

      let dx = -1,
        dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      let r = stateVariables["/_circle1"].stateValues.radius;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny },
      });

      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[2][0],
        ).closeTo(t3x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[2][1],
        ).closeTo(t3y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );
        expect((await stateVariables["/TP3"].stateValues.xs)[0]).closeTo(
          t3x,
          1e-12,
        );
        expect((await stateVariables["/TP3"].stateValues.xs)[1]).closeTo(
          t3y,
          1e-12,
        );

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
      });
    });

    cy.log("move first through point");
    cy.window().then(async (win) => {
      t1x = 6;
      t1y = 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP1",
        args: { x: t1x, y: t1y },
      });

      t3x = t1x + 1;
      t2x = t1x - 1;

      cy.get(cesc("#\\/TP1")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(t1x * 100) / 100)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(Number.isFinite(stateVariables["/_circle1"].stateValues.radius))
          .true;

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[2][0],
        ).closeTo(t3x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[2][1],
        ).closeTo(t3y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );
        expect((await stateVariables["/TP3"].stateValues.xs)[0]).closeTo(
          t3x,
          1e-12,
        );
        expect((await stateVariables["/TP3"].stateValues.xs)[1]).closeTo(
          t3y,
          1e-12,
        );

        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).true;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).true;
      });
    });

    cy.log("move second through point");
    cy.window().then(async (win) => {
      t2x = -7;
      t2y = -9;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y },
      });

      t1x = t2x + 1;
      t3x = t1x + 1;

      cy.get(cesc("#\\/TP1")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(t1x * 100) / 100)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(Number.isFinite(stateVariables["/_circle1"].stateValues.radius))
          .true;

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[2][0],
        ).closeTo(t3x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[2][1],
        ).closeTo(t3y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );
        expect((await stateVariables["/TP3"].stateValues.xs)[0]).closeTo(
          t3x,
          1e-12,
        );
        expect((await stateVariables["/TP3"].stateValues.xs)[1]).closeTo(
          t3y,
          1e-12,
        );

        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).true;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).true;
      });
    });

    cy.log("move third through point");
    cy.window().then(async (win) => {
      t3x = 1;
      t3y = -2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP3",
        args: { x: t3x, y: t3y },
      });

      t1x = t3x - 1;
      t2x = t1x - 1;

      cy.get(cesc("#\\/TP1")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(t1x * 100) / 100)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(Number.isFinite(stateVariables["/_circle1"].stateValues.radius))
          .true;

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][0],
        ).closeTo(t1x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[0][1],
        ).closeTo(t1y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][0],
        ).closeTo(t2x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[1][1],
        ).closeTo(t2y, 1e-12);

        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[2][0],
        ).closeTo(t3x, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalThroughPoints[2][1],
        ).closeTo(t3y, 1e-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(
          t1x,
          1e-12,
        );
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(
          t1y,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(
          t2x,
          1e-12,
        );
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(
          t2y,
          1e-12,
        );
        expect((await stateVariables["/TP3"].stateValues.xs)[0]).closeTo(
          t3x,
          1e-12,
        );
        expect((await stateVariables["/TP3"].stateValues.xs)[1]).closeTo(
          t3y,
          1e-12,
        );

        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[0],
          ),
        ).true;
        expect(
          Number.isFinite(
            stateVariables["/_circle1"].stateValues.numericalCenter[1],
          ),
        ).true;
      });
    });
  });

  it("essential center can combine coordinates", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <circle/>
    <point>
     (<extract prop="y"><copy prop="center" source="_circle1" /></extract>,
     <extract prop="x"><copy prop="center" source="_circle1" /></extract>)
    </point>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="_circle1" displayDigits="8" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_circle1"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
        0, 0,
      ]);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
        "vector",
        0,
        0,
      ]);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        0,
        0,
      ]);
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(0)},${nInDOM(0)})`,
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-7, 2] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(-7)},${nInDOM(2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          -7, 2,
        ]);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -7,
          2,
        ]);
        expect(stateVariables["/_point1"].stateValues.coords).eqls([
          "vector",
          2,
          -7,
        ]);
      });
    });

    cy.log("move flipped point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -3, y: -5 },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(-5)},${nInDOM(-3)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          -5, -3,
        ]);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          -5,
          -3,
        ]);
        expect(stateVariables["/_point1"].stateValues.coords).eqls([
          "vector",
          -3,
          -5,
        ]);
      });
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: -4 },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(1)},${nInDOM(-4)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.numericalCenter).eqls([
          1, -4,
        ]);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls([
          "vector",
          1,
          -4,
        ]);
        expect(stateVariables["/_point1"].stateValues.coords).eqls([
          "vector",
          -4,
          1,
        ]);
      });
    });
  });

  it("handle initially undefined center", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>Center: <mathinput name="c" /></p>
  <graph>
    <circle center="$c" name="circ" />
  </graph>
  <graph>
    <copy source="circ" assignNames="circ2" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" source="circ" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
        NaN,
        NaN,
      ]);
      expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/circ2"].stateValues.numericalCenter).eqls([
        NaN,
        NaN,
      ]);
      expect(stateVariables["/circ2"].stateValues.numericalRadius).eq(1);
      cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(＿,＿)`);
    });

    cy.log("enter point for center");
    cy.get(cesc("#\\/c") + " textarea").type("(2,1){enter}", { force: true });

    cy.get(cesc("#\\/centerPoint2")).should(
      "contain.text",
      `(${nInDOM(2)},${nInDOM(1)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([2, 1]);
      expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/circ2"].stateValues.numericalCenter).eqls([2, 1]);
      expect(stateVariables["/circ2"].stateValues.numericalRadius).eq(1);
    });

    cy.log(`move circle`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/circ",
        args: { center: [-7, 2] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(-7)},${nInDOM(2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
          -7, 2,
        ]);
        expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
        expect(stateVariables["/circ2"].stateValues.numericalCenter).eqls([
          -7, 2,
        ]);
        expect(stateVariables["/circ2"].stateValues.numericalRadius).eq(1);
      });
    });

    cy.log("change point for center");
    cy.get(cesc("#\\/c") + " textarea").type(
      "{end}{leftArrow}{backspace}-4{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/centerPoint2")).should(
      "contain.text",
      `(${nInDOM(-7)},${nInDOM(-4)})`,
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
        -7, -4,
      ]);
      expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/circ2"].stateValues.numericalCenter).eqls([
        -7, -4,
      ]);
      expect(stateVariables["/circ2"].stateValues.numericalRadius).eq(1);
    });

    cy.log(`move circle2`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/circ2",
        args: { center: [6, 9] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(6)},${nInDOM(9)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
          6, 9,
        ]);
        expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
        expect(stateVariables["/circ2"].stateValues.numericalCenter).eqls([
          6, 9,
        ]);
        expect(stateVariables["/circ2"].stateValues.numericalRadius).eq(1);
      });
    });

    cy.log("center undefined again");
    cy.get(cesc("#\\/c") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/centerPoint2")).should("contain.text", `(＿,＿)`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
        NaN,
        NaN,
      ]);
      expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/circ2"].stateValues.numericalCenter).eqls([
        NaN,
        NaN,
      ]);
      expect(stateVariables["/circ2"].stateValues.numericalRadius).eq(1);
    });

    cy.log("enter new point for center");
    cy.get(cesc("#\\/c") + " textarea").type("(5,4){enter}", { force: true });

    cy.get(cesc("#\\/centerPoint2")).should(
      "contain.text",
      `(${nInDOM(5)},${nInDOM(4)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([5, 4]);
      expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/circ2"].stateValues.numericalCenter).eqls([5, 4]);
      expect(stateVariables["/circ2"].stateValues.numericalRadius).eq(1);
    });
  });

  it("overwrite attributes on copy", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <circle name="c" />
  </graph>

  <p>Change radius: <mathinput name="rc" bindValueTo="$(c.radius)" /></p>
  <p>Change center: <mathinput name="cc" bindValueTo="$(c.center)" /></p>

  <graph>
    <point name="P">(3,4)</point>
    <copy source="c" center="$P" assignNames="c1" />
  </graph>

  <p>Change radius: <mathinput name="rc1" bindValueTo="$(c1.radius)" /></p>
  <p>Change center: <mathinput name="cc1" bindValueTo="$(c1.center)" /></p>

  <graph>
    <point name="Q">(7,7)</point>
    <copy source="c1" through="$Q" assignNames="c2" />
  </graph>

  <p>Change radius: <mathinput name="rc2" bindValueTo="$(c2.radius)" /></p>
  <p>Change center: <mathinput name="cc2" bindValueTo="$(c2.center)" /></p>

  <graph>
    <copy source="c" radius="$src3" assignNames = "c3" />
  </graph>

  <p>Set radius radius: <mathinput name="src3" prefill="3" /></p>
  <p>Change radius: <mathinput name="rc3" bindValueTo="$(c3.radius)" /></p>
  <p>Change center: <mathinput name="cc3" bindValueTo="$(c3.center)" /></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/rc") + " .mq-editable-field").should("have.text", "1");
    cy.get(cesc("#\\/cc") + " .mq-editable-field").should("have.text", "(0,0)");
    cy.get(cesc("#\\/rc1") + " .mq-editable-field").should("have.text", "1");
    cy.get(cesc("#\\/cc1") + " .mq-editable-field").should(
      "have.text",
      "(3,4)",
    );
    cy.get(cesc("#\\/rc2") + " .mq-editable-field").should("have.text", "5");
    cy.get(cesc("#\\/cc2") + " .mq-editable-field").should(
      "have.text",
      "(3,4)",
    );
    cy.get(cesc("#\\/src3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/rc3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/cc3") + " .mq-editable-field").should(
      "have.text",
      "(0,0)",
    );

    cy.log("move original circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/c",
        args: { center: [-1, 2] },
      });
    });

    cy.get(cesc("#\\/rc") + " .mq-editable-field").should("have.text", "1");
    cy.get(cesc("#\\/cc") + " .mq-editable-field").should(
      "have.text",
      "(−1,2)",
    );
    cy.get(cesc("#\\/rc1") + " .mq-editable-field").should("have.text", "1");
    cy.get(cesc("#\\/cc1") + " .mq-editable-field").should(
      "have.text",
      "(3,4)",
    );
    cy.get(cesc("#\\/rc2") + " .mq-editable-field").should("have.text", "5");
    cy.get(cesc("#\\/cc2") + " .mq-editable-field").should(
      "have.text",
      "(3,4)",
    );
    cy.get(cesc("#\\/src3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/rc3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/cc3") + " .mq-editable-field").should(
      "have.text",
      "(−1,2)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await stateVariables["/P"].stateValues.xs).eqls([3, 4]);
      expect(await stateVariables["/Q"].stateValues.xs).eqls([7, 7]);
    });

    cy.log("enter non-numeric radius and center for original circle");
    cy.get(cesc("#\\/rc") + " textarea").type("{end}+x{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/cc") + " textarea").type(
      "{end}{leftArrow}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/rc") + " .mq-editable-field").should("have.text", "1+x");
    cy.get(cesc("#\\/cc") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("(−1,y)");
      });
    cy.get(cesc("#\\/rc1") + " .mq-editable-field").should("have.text", "1+x");
    cy.get(cesc("#\\/cc1") + " .mq-editable-field").should(
      "have.text",
      "(3,4)",
    );
    cy.get(cesc("#\\/rc2") + " .mq-editable-field").should("have.text", "5");
    cy.get(cesc("#\\/cc2") + " .mq-editable-field").should(
      "have.text",
      "(3,4)",
    );
    cy.get(cesc("#\\/src3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/rc3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/cc3") + " .mq-editable-field").should(
      "have.text",
      "(−1,y)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await stateVariables["/P"].stateValues.xs).eqls([3, 4]);
      expect(await stateVariables["/Q"].stateValues.xs).eqls([7, 7]);
    });

    cy.log(
      "set radius and center for original circle back to number using other components",
    );
    cy.get(cesc("#\\/rc1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/cc3") + " textarea").type(
      "{end}{leftArrow}{backspace}{backspace}{backspace}{backspace}4,5{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/rc") + " .mq-editable-field").should("have.text", "2");
    cy.get(cesc("#\\/cc") + " .mq-editable-field").should("have.text", "(4,5)");
    cy.get(cesc("#\\/rc1") + " .mq-editable-field").should("have.text", "2");
    cy.get(cesc("#\\/cc1") + " .mq-editable-field").should(
      "have.text",
      "(3,4)",
    );
    cy.get(cesc("#\\/rc2") + " .mq-editable-field").should("have.text", "5");
    cy.get(cesc("#\\/cc2") + " .mq-editable-field").should(
      "have.text",
      "(3,4)",
    );
    cy.get(cesc("#\\/src3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/rc3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/cc3") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("(4,5)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await stateVariables["/P"].stateValues.xs).eqls([3, 4]);
      expect(await stateVariables["/Q"].stateValues.xs).eqls([7, 7]);
    });

    cy.log("move point P and set radius of second circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -5, y: 2 },
      });
    });

    cy.get(cesc("#\\/rc1") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/rc") + " .mq-editable-field").should("have.text", "4");
    cy.get(cesc("#\\/cc") + " .mq-editable-field").should("have.text", "(4,5)");
    cy.get(cesc("#\\/rc1") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc("#\\/cc1") + " .mq-editable-field").should(
      "have.text",
      "(−5,2)",
    );
    cy.get(cesc("#\\/rc2") + " .mq-editable-field").should("have.text", "13");
    cy.get(cesc("#\\/cc2") + " .mq-editable-field").should(
      "have.text",
      "(−5,2)",
    );
    cy.get(cesc("#\\/src3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/rc3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/cc3") + " .mq-editable-field").should(
      "have.text",
      "(4,5)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await stateVariables["/P"].stateValues.xs).eqls([-5, 2]);
      expect(await stateVariables["/Q"].stateValues.xs).eqls([7, 7]);
    });

    cy.log("move point Q");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: 3, y: 8 },
      });
    });

    cy.get(cesc("#\\/rc") + " .mq-editable-field").should("have.text", "4");
    cy.get(cesc("#\\/cc") + " .mq-editable-field").should("have.text", "(4,5)");
    cy.get(cesc("#\\/rc1") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc("#\\/cc1") + " .mq-editable-field").should(
      "have.text",
      "(−5,2)",
    );
    cy.get(cesc("#\\/rc2") + " .mq-editable-field").should("have.text", "10");
    cy.get(cesc("#\\/cc2") + " .mq-editable-field").should(
      "have.text",
      "(−5,2)",
    );
    cy.get(cesc("#\\/src3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/rc3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/cc3") + " .mq-editable-field").should(
      "have.text",
      "(4,5)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await stateVariables["/P"].stateValues.xs).eqls([-5, 2]);
      expect(await stateVariables["/Q"].stateValues.xs).eqls([3, 8]);
    });

    cy.log("set radius of third circle");

    cy.get(cesc("#\\/rc2") + " textarea").type(
      "{end}{backspace}{backspace}5{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/rc") + " .mq-editable-field").should("have.text", "4");
    cy.get(cesc("#\\/cc") + " .mq-editable-field").should("have.text", "(4,5)");
    cy.get(cesc("#\\/rc1") + " .mq-editable-field").should("have.text", "4");
    cy.get(cesc("#\\/cc1") + " .mq-editable-field").should(
      "have.text",
      "(−5,2)",
    );
    cy.get(cesc("#\\/rc2") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("5");
      });
    cy.get(cesc("#\\/cc2") + " .mq-editable-field").should(
      "have.text",
      "(−5,2)",
    );
    cy.get(cesc("#\\/src3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/rc3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/cc3") + " .mq-editable-field").should(
      "have.text",
      "(4,5)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await stateVariables["/P"].stateValues.xs).eqls([-5, 2]);
      expect(await stateVariables["/Q"].stateValues.xs).eqls([-1, 5]);
    });

    cy.log("set center of third circle");

    cy.get(cesc("#\\/cc2") + " textarea").type(
      "{end}{leftArrow}{backspace}{backspace}{backspace}{backspace}5,-3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/rc") + " .mq-editable-field").should("have.text", "4");
    cy.get(cesc("#\\/cc") + " .mq-editable-field").should("have.text", "(4,5)");
    cy.get(cesc("#\\/rc1") + " .mq-editable-field").should("have.text", "4");
    cy.get(cesc("#\\/cc1") + " .mq-editable-field").should(
      "have.text",
      "(5,−3)",
    );
    cy.get(cesc("#\\/rc2") + " .mq-editable-field").should("have.text", "10");
    cy.get(cesc("#\\/cc2") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("(5,−3)");
      });
    cy.get(cesc("#\\/src3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/rc3") + " .mq-editable-field").should("have.text", "3");
    cy.get(cesc("#\\/cc3") + " .mq-editable-field").should(
      "have.text",
      "(4,5)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await stateVariables["/P"].stateValues.xs).eqls([5, -3]);
      expect(await stateVariables["/Q"].stateValues.xs).eqls([-1, 5]);
    });

    cy.log("set radius of fourth circle");

    cy.get(cesc("#\\/src3") + " textarea").type("{end}{backspace}9{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/rc") + " .mq-editable-field").should("have.text", "4");
    cy.get(cesc("#\\/cc") + " .mq-editable-field").should("have.text", "(4,5)");
    cy.get(cesc("#\\/rc1") + " .mq-editable-field").should("have.text", "4");
    cy.get(cesc("#\\/cc1") + " .mq-editable-field").should(
      "have.text",
      "(5,−3)",
    );
    cy.get(cesc("#\\/rc2") + " .mq-editable-field").should("have.text", "10");
    cy.get(cesc("#\\/cc2") + " .mq-editable-field").should(
      "have.text",
      "(5,−3)",
    );
    cy.get(cesc("#\\/src3") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("9");
      });
    cy.get(cesc("#\\/rc3") + " .mq-editable-field").should("have.text", "9");
    cy.get(cesc("#\\/cc3") + " .mq-editable-field").should(
      "have.text",
      "(4,5)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await stateVariables["/P"].stateValues.xs).eqls([5, -3]);
      expect(await stateVariables["/Q"].stateValues.xs).eqls([-1, 5]);
    });

    cy.log("move and change radius of fourth circle");

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/c3",
        args: { center: [3, 8] },
      });
    });

    cy.get(cesc("#\\/rc3") + " textarea").type("{end}{backspace}9{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/rc") + " .mq-editable-field").should("have.text", "4");
    cy.get(cesc("#\\/cc") + " .mq-editable-field").should("have.text", "(3,8)");
    cy.get(cesc("#\\/rc1") + " .mq-editable-field").should("have.text", "4");
    cy.get(cesc("#\\/cc1") + " .mq-editable-field").should(
      "have.text",
      "(5,−3)",
    );
    cy.get(cesc("#\\/rc2") + " .mq-editable-field").should("have.text", "10");
    cy.get(cesc("#\\/cc2") + " .mq-editable-field").should(
      "have.text",
      "(5,−3)",
    );
    cy.get(cesc("#\\/src3") + " .mq-editable-field").should("have.text", "9");
    cy.get(cesc("#\\/rc3") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("9");
      });
    cy.get(cesc("#\\/cc3") + " .mq-editable-field").should(
      "have.text",
      "(3,8)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await stateVariables["/P"].stateValues.xs).eqls([5, -3]);
      expect(await stateVariables["/Q"].stateValues.xs).eqls([-1, 5]);
    });
  });

  it("reload essential center from database", () => {
    let doenetML = `
    <text>a</text>
    <graph>
      <circle name="circ" />
    </graph>
    <mathinput bindvalueTo="$(circ.radius)" name="r" />
    <p>radius: <copy prop='radius' source='circ' assignNames="r2" /></p>
    <p>Center: <copy prop="center" source="circ" assignNames="c" /></p>
  `;

    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([0, 0]);
      expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
      cy.get(cesc(`#\\/r2`) + ` .mjx-mrow`).should("contain.text", "1");
    });

    cy.log(`move circle`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/circ",
        args: { center: [-7, 2] },
      });

      cy.get(cesc(`#\\/r2`) + ` .mjx-mrow`).should("contain.text", "1");
      cy.get(cesc(`#\\/c`) + ` .mjx-mrow`).should(
        "contain.text",
        `(${nInDOM(-7)},${nInDOM(2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
          -7, 2,
        ]);
        expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
      });
    });

    cy.log("change radius");
    cy.get(cesc("#\\/r") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc(`#\\/r`) + ` .mq-editable-field`).should("contain.text", "3");
    cy.get(cesc(`#\\/r2`) + ` .mjx-mrow`).should("contain.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([-7, 2]);
      expect(stateVariables["/circ"].stateValues.numericalRadius).eq(3);
    });

    cy.wait(2000); // wait for 1 second debounce

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    // wait until core is loaded
    cy.waitUntil(() =>
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        return stateVariables["/circ"];
      }),
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([-7, 2]);
      expect(stateVariables["/circ"].stateValues.numericalRadius).eq(3);
    });
  });

  it("copy propIndex of throughPoints", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <circle through="(2,-3) (3,4) (-3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy prop="throughPoints" source="_circle1" propIndex="$n" assignNames="P1 P2 P3" /></p>

    <p><copy prop="throughPoint2" source="_circle1" propIndex="$n" assignNames="x" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = 4;
    let t3x = -3,
      t3y = 4;

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2x)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t2x)},${nInDOM(t2y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t3x)},${nInDOM(t3y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
  });

  it("copy propIndex of throughPoints, dot and array notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <circle through="(2,-3) (3,4) (-3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy source="_circle1.throughPoints[$n]" assignNames="P1 P2 P3" /></p>

    <p><copy source="_circle1.throughPoint2[$n]" assignNames="x" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = 4;
    let t3x = -3,
      t3y = 4;

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2x)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t2x)},${nInDOM(t2y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t3x)},${nInDOM(t3y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
  });

  it("changing styles", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <setup>
      <styledefinitions>
        <styledefinition stylenumber="1" lineColor="blue" fillColor="blue" lineWidth="2" lineStyle="solid" />
        <styledefinition stylenumber="2" lineColor="red" fillColor="green" lineWidth="2" lineStyle="solid" />

        <styledefinition stylenumber="3" lineColor="blue" fillColor="blue" lineWidth="5" lineStyle="solid" />
        <styledefinition stylenumber="4" lineColor="red" fillColor="green" lineWidth="1" lineStyle="dotted" />
      </styledefinitions>
    </setup>

    <graph>
      <circle center="(-8,0)" name="c1" />
      <circle center="(-8,4)" name="c2" filled />
      <circle center="(-4,0)" name="c3" stylenumber="2" />
      <circle center="(-4,4)" name="c4" stylenumber="2" filled />

      <circle center="(0,0)" name="c5" stylenumber="3"/>
      <circle center="(0,4)" name="c6" stylenumber="3" filled />
      <circle center="(4,0)" name="c7" stylenumber="4" />
      <circle center="(4,4)" name="c8" stylenumber="4" filled />

    </graph>

    <p>First circle is $c1.styleDescription{assignNames="st1"}.  It is a $c1.styleDescriptionWithNoun{assignNames="stn1"}. 
      Its border is $c1.borderStyleDescription{assignNames="bst1"}.  Its fill is $c1.fillStyleDescription{assignNames="fst1"}.
    </p>
    <p>Second circle is $c2.styleDescription{assignNames="st2"}.  It is a $c2.styleDescriptionWithNoun{assignNames="stn2"}. 
      Its border is $c2.borderStyleDescription{assignNames="bst2"}.  Its fill is $c2.fillStyleDescription{assignNames="fst2"}.
    </p>
    <p>Third circle is $c3.styleDescription{assignNames="st3"}.  It is a $c3.styleDescriptionWithNoun{assignNames="stn3"}. 
      Its border is $c3.borderStyleDescription{assignNames="bst3"}.  Its fill is $c3.fillStyleDescription{assignNames="fst3"}.
    </p>
    <p>Fourth circle is $c4.styleDescription{assignNames="st4"}.  It is a $c4.styleDescriptionWithNoun{assignNames="stn4"}. 
      Its border is $c4.borderStyleDescription{assignNames="bst4"}.  Its fill is $c4.fillStyleDescription{assignNames="fst4"}.
    </p>

    <p>Fifth circle is $c5.styleDescription{assignNames="st5"}.  It is a $c5.styleDescriptionWithNoun{assignNames="stn5"}. 
      Its border is $c5.borderStyleDescription{assignNames="bst5"}.  Its fill is $c5.fillStyleDescription{assignNames="fst5"}.
    </p>
    <p>Sixth circle is $c6.styleDescription{assignNames="st6"}.  It is a $c6.styleDescriptionWithNoun{assignNames="stn6"}. 
      Its border is $c6.borderStyleDescription{assignNames="bst6"}.  Its fill is $c6.fillStyleDescription{assignNames="fst6"}.
    </p>
    <p>Seventh circle is $c7.styleDescription{assignNames="st7"}.  It is a $c7.styleDescriptionWithNoun{assignNames="stn7"}. 
      Its border is $c7.borderStyleDescription{assignNames="bst7"}.  Its fill is $c7.fillStyleDescription{assignNames="fst7"}.
    </p>
    <p>Eighth circle is $c8.styleDescription{assignNames="st8"}.  It is a $c8.styleDescriptionWithNoun{assignNames="stn8"}. 
      Its border is $c8.borderStyleDescription{assignNames="bst8"}.  Its fill is $c8.fillStyleDescription{assignNames="fst8"}.
    </p>


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/st1")).should("have.text", "blue");
    cy.get(cesc("#\\/stn1")).should("have.text", "blue circle");
    cy.get(cesc("#\\/bst1")).should("have.text", "blue");
    cy.get(cesc("#\\/fst1")).should("have.text", "unfilled");

    cy.get(cesc("#\\/st2")).should("have.text", "filled blue");
    cy.get(cesc("#\\/stn2")).should("have.text", "filled blue circle");
    cy.get(cesc("#\\/bst2")).should("have.text", "blue");
    cy.get(cesc("#\\/fst2")).should("have.text", "blue");

    cy.get(cesc("#\\/st3")).should("have.text", "red");
    cy.get(cesc("#\\/stn3")).should("have.text", "red circle");
    cy.get(cesc("#\\/bst3")).should("have.text", "red");
    cy.get(cesc("#\\/fst3")).should("have.text", "unfilled");

    cy.get(cesc("#\\/st4")).should("have.text", "filled green with red border");
    cy.get(cesc("#\\/stn4")).should(
      "have.text",
      "filled green circle with a red border",
    );
    cy.get(cesc("#\\/bst4")).should("have.text", "red");
    cy.get(cesc("#\\/fst4")).should("have.text", "green");

    cy.get(cesc("#\\/st5")).should("have.text", "thick blue");
    cy.get(cesc("#\\/stn5")).should("have.text", "thick blue circle");
    cy.get(cesc("#\\/bst5")).should("have.text", "thick blue");
    cy.get(cesc("#\\/fst5")).should("have.text", "unfilled");

    cy.get(cesc("#\\/st6")).should(
      "have.text",
      "filled blue with thick border",
    );
    cy.get(cesc("#\\/stn6")).should(
      "have.text",
      "filled blue circle with a thick border",
    );
    cy.get(cesc("#\\/bst6")).should("have.text", "thick blue");
    cy.get(cesc("#\\/fst6")).should("have.text", "blue");

    cy.get(cesc("#\\/st7")).should("have.text", "thin dotted red");
    cy.get(cesc("#\\/stn7")).should("have.text", "thin dotted red circle");
    cy.get(cesc("#\\/bst7")).should("have.text", "thin dotted red");
    cy.get(cesc("#\\/fst7")).should("have.text", "unfilled");

    cy.get(cesc("#\\/st8")).should(
      "have.text",
      "filled green with thin dotted red border",
    );
    cy.get(cesc("#\\/stn8")).should(
      "have.text",
      "filled green circle with a thin dotted red border",
    );
    cy.get(cesc("#\\/bst8")).should("have.text", "thin dotted red");
    cy.get(cesc("#\\/fst8")).should("have.text", "green");
  });

  it("style description changes with theme", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" fillColor="brown" fillColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" fillColor="#540907" fillColorWord="dark red" fillColorDarkMode="#f0c6c5" fillColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <circle name="A" styleNumber="1" labelIsName center="(0,0)" filled />
      <circle name="B" styleNumber="2" labelIsName center="(2,2)" filled />
      <circle name="C" styleNumber="5" labelIsName center="(4,4)" filled />
    </graph>
    <p name="Adescrip">Circle A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    <p name="Aborderdescrip">A has a $A.borderStyleDescription border.</p>
    <p name="Bborderdescrip">B has a $B.borderStyleDescription border.</p>
    <p name="Cborderdescrip">C has a $C.borderStyleDescription border.</p>
    <p name="Afilldescrip">A has a $A.fillStyleDescription fill.</p>
    <p name="Bfilldescrip">B has a $B.fillStyleDescription fill.</p>
    <p name="Cfilldescrip">C has a $C.fillStyleDescription fill.</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/Adescrip")).should(
      "have.text",
      "Circle A is filled brown with thick border.",
    );
    cy.get(cesc("#\\/Bdescrip")).should(
      "have.text",
      "B is a filled dark red circle.",
    );
    cy.get(cesc("#\\/Cdescrip")).should(
      "have.text",
      "C is a filled black circle with a thin border.",
    );
    cy.get(cesc("#\\/Aborderdescrip")).should(
      "have.text",
      "A has a thick brown border.",
    );
    cy.get(cesc("#\\/Bborderdescrip")).should(
      "have.text",
      "B has a dark red border.",
    );
    cy.get(cesc("#\\/Cborderdescrip")).should(
      "have.text",
      "C has a thin black border.",
    );
    cy.get(cesc("#\\/Afilldescrip")).should("have.text", "A has a brown fill.");
    cy.get(cesc("#\\/Bfilldescrip")).should(
      "have.text",
      "B has a dark red fill.",
    );
    cy.get(cesc("#\\/Cfilldescrip")).should("have.text", "C has a black fill.");

    cy.log("set dark mode");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_darkmode").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.get(cesc("#\\/Adescrip")).should(
      "have.text",
      "Circle A is filled yellow with thick border.",
    );
    cy.get(cesc("#\\/Bdescrip")).should(
      "have.text",
      "B is a filled light red circle.",
    );
    cy.get(cesc("#\\/Cdescrip")).should(
      "have.text",
      "C is a filled white circle with a thin border.",
    );
    cy.get(cesc("#\\/Aborderdescrip")).should(
      "have.text",
      "A has a thick yellow border.",
    );
    cy.get(cesc("#\\/Bborderdescrip")).should(
      "have.text",
      "B has a light red border.",
    );
    cy.get(cesc("#\\/Cborderdescrip")).should(
      "have.text",
      "C has a thin white border.",
    );
    cy.get(cesc("#\\/Afilldescrip")).should(
      "have.text",
      "A has a yellow fill.",
    );
    cy.get(cesc("#\\/Bfilldescrip")).should(
      "have.text",
      "B has a light red fill.",
    );
    cy.get(cesc("#\\/Cfilldescrip")).should("have.text", "C has a white fill.");
  });

  it("circle with center and through point, center constrained", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(3,4)
      <constraints>
        <constrainToGrid dx="3" dy="2" />
      </constraints>
    </point>
    <point>(5,6)</point>

    <circle center="$_point1" through="$_point2" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 3,
        cny = 4;
      let tx = 5,
        ty = 6;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(cnx, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(cny, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    let cnx = 3,
      cny = 4;
    let tx = 5,
      ty = 6;

    cy.log("move circle");
    cy.window().then(async (win) => {
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = -2,
        dy = -6;
      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      let desiredcnx = cnx;
      let desiredcny = cny;
      cnx = Math.round(desiredcnx / 3) * 3;
      cny = Math.round(desiredcny / 2) * 2;

      tx += cnx - desiredcnx;
      ty += cny - desiredcny;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [desiredcnx, desiredcny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move defining center");
    cy.window().then(async (win) => {
      let desiredcnx = -5;
      let desiredcny = 5;
      cnx = Math.round(desiredcnx / 3) * 3;
      cny = Math.round(desiredcny / 2) * 2;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: desiredcnx, y: desiredcny },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move reffed center");
    cy.window().then(async (win) => {
      let desiredcnx = 1;
      let desiredcny = -1;
      cnx = Math.round(desiredcnx / 3) * 3;
      cny = Math.round(desiredcny / 2) * 2;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: desiredcnx, y: desiredcny },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move through point");
    cy.window().then(async (win) => {
      tx = -4;
      ty = 3;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: tx, y: ty },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("change reffed radius");
    cy.window().then(async (win) => {
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      r = r / 4;

      tx = cnx + (tx - cnx) / 4;
      ty = cny + (ty - cny) / 4;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: r, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = 4,
        dy = -1;

      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      let desiredcnx = cnx;
      let desiredcny = cny;
      cnx = Math.round(desiredcnx / 3) * 3;
      cny = Math.round(desiredcny / 2) * 2;

      tx += cnx - desiredcnx;
      ty += cny - desiredcny;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [desiredcnx, desiredcny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = -5,
        dy = 4;

      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      let desiredcnx = cnx;
      let desiredcny = cny;
      cnx = Math.round(desiredcnx / 3) * 3;
      cny = Math.round(desiredcny / 2) * 2;

      tx += cnx - desiredcnx;
      ty += cny - desiredcny;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [desiredcnx, desiredcny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });
  });

  it("circle with center and through point, through point constrained", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(3,4)
    </point>
    <point>(5,7)
      <constraints>
        <constrainToGrid dx="3" dy="2" />
      </constraints>
    </point>

    <circle center="$_point1" through="$_point2" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 3,
        cny = 4;
      let tx = 6,
        ty = 8;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(cnx, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(cny, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    let cnx = 3,
      cny = 4;
    let tx = 6,
      ty = 8;

    cy.log("move circle");
    cy.window().then(async (win) => {
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = -2,
        dy = -6;
      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      let desiredcnx = cnx;
      let desiredcny = cny;
      cnx = Math.round(desiredcnx / 3) * 3;
      cny = Math.round(desiredcny / 2) * 2;

      tx += cnx - desiredcnx;
      ty += cny - desiredcny;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [desiredcnx, desiredcny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move defining center");
    cy.window().then(async (win) => {
      cnx = -5;
      cny = 5;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: cnx, y: cny },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move reffed center");
    cy.window().then(async (win) => {
      cnx = 1;
      cny = -1;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move through point");
    cy.window().then(async (win) => {
      let desiredtx = -4;
      let desiredty = 3;
      tx = Math.round(desiredtx / 3) * 3;
      ty = Math.round(desiredty / 2) * 2;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: desiredtx, y: desiredty },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("change reffed radius");
    cy.window().then(async (win) => {
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let desiredr = r / 4;

      let desiredtx = cnx + (tx - cnx) / 4;
      let desiredty = cny + (ty - cny) / 4;

      tx = Math.round(desiredtx / 3) * 3;
      ty = Math.round(desiredty / 2) * 2;

      r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: desiredr, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = 4,
        dy = -1;

      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      let desiredcnx = cnx;
      let desiredcny = cny;

      let desiredtx = tx;
      let desiredty = ty;
      tx = Math.round(desiredtx / 3) * 3;
      ty = Math.round(desiredty / 2) * 2;

      cnx += tx - desiredtx;
      cny += ty - desiredty;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [desiredcnx, desiredcny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = -5,
        dy = 4;

      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      let desiredcnx = cnx;
      let desiredcny = cny;

      let desiredtx = tx;
      let desiredty = ty;
      tx = Math.round(desiredtx / 3) * 3;
      ty = Math.round(desiredty / 2) * 2;

      cnx += tx - desiredtx;
      cny += ty - desiredty;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [desiredcnx, desiredcny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(tx, 1e-12);
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(ty, 1e-12);
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });
  });

  it("circle through two points, one point constrained", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>

    <point>(2,-3)
      <constraints>
        <constrainToGrid dx="3" dy="2" />
      </constraints>
    </point>
    <point>(3,4)</point>
    <circle through="$_point1 $_point2"/>
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 3,
      t1y = -2;
    let t2x = 3,
      t2y = 4;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/_circle1"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);
      expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(t1x, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(t1y, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(t2x, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(t2y, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle");
    cy.window().then(async (win) => {
      let dx = -2,
        dy = -7;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      let desiredcnx = (t1x + t2x) / 2;
      let desiredcny = (t1y + t2y) / 2;

      let desiredt1x = t1x;
      let desiredt1y = t1y;

      t1x = Math.round(desiredt1x / 3) * 3;
      t1y = Math.round(desiredt1y / 2) * 2;

      t2x += t1x - desiredt1x;
      t2y += t1y - desiredt1y;

      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [desiredcnx, desiredcny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move first through point");
    cy.window().then(async (win) => {
      let desiredt1x = 4,
        desiredt1y = -1;

      t1x = Math.round(desiredt1x / 3) * 3;
      t1y = Math.round(desiredt1y / 2) * 2;

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: desiredt1x, y: desiredt1y },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move second through point");
    cy.window().then(async (win) => {
      t2x = 8;
      t2y = -3;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move center");
    cy.window().then(async (win) => {
      let dx = 2,
        dy = -3;

      let desiredcnx = (t1x + t2x) / 2 + dx;
      let desiredcny = (t1y + t2y) / 2 + dy;

      t1x = Math.round((t1x + dx) / 3) * 3;
      t1y = Math.round((t1y + dy) / 2) * 2;

      t2x += dx;
      t2y += dy;

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: desiredcnx, y: desiredcny },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move radius to half size");
    cy.window().then(async (win) => {
      let desiredr =
        Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 4;

      let desiredcnx = (t1x + t2x) / 2;
      let desiredcny = (t1y + t2y) / 2;

      let desiredt1x = desiredcnx + (t1x - desiredcnx) / 2;
      let desiredt1y = desiredcny + (t1y - desiredcny) / 2;

      t2x = desiredcnx + (t2x - desiredcnx) / 2;
      t2y = desiredcny + (t2y - desiredcny) / 2;

      t1x = Math.round(desiredt1x / 3) * 3;
      t1y = Math.round(desiredt1y / 2) * 2;

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: desiredr, y: 0 },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let dx = -8;
      let dy = 5;

      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      let desiredt1x = t1x;
      let desiredt1y = t1y;

      let desiredcnx = (desiredt1x + t2x) / 2;
      let desiredcny = (desiredt1y + t2y) / 2;

      t1x = Math.round(desiredt1x / 3) * 3;
      t1y = Math.round(desiredt1y / 2) * 2;

      t2x += t1x - desiredt1x;
      t2y += t1y - desiredt1y;

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [desiredcnx, desiredcny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let dx = -3;
      let dy = 3;

      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      let desiredt1x = t1x;
      let desiredt1y = t1y;

      let desiredcnx = (desiredt1x + t2x) / 2;
      let desiredcny = (desiredt1y + t2y) / 2;

      t1x = Math.round(desiredt1x / 3) * 3;
      t1y = Math.round(desiredt1y / 2) * 2;

      t2x += t1x - desiredt1x;
      t2y += t1y - desiredt1y;

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      let cnx = (t1x + t2x) / 2,
        cny = (t1y + t2y) / 2;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [desiredcnx, desiredcny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(cnx)},${nInDOM(cny)})`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
      });
    });
  });

  it("circle through three points, one point constrained", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(2,-3)</point>
    <point>(3,4)
    <constraints>
      <constrainToGrid dx="3" dy="2" />
    </constraints>
    </point>
    <point>(-3,4)</point>
    <circle through="$_point1 $_point2 $_point3" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2" displayDigits="8">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <copy prop="diameter" assignNames="diam" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = 4;
    let t3x = -3,
      t3y = 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);

      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(t1x, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(t1y, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(t2x, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(t2y, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(t3x, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(t3y, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle up and to the right");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      let desireddx = 5,
        desireddy = 3;

      let desiredcnx = cnx + desireddx;
      let desiredcny = cny + desireddy;

      let dx = 6;
      let dy = 4;

      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [desiredcnx, desiredcny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph3/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph3/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph3/circle"].stateValues.numericalRadius;

      let desireddx = -5,
        desireddy = -2.2;

      let desiredcnx = cnx + desireddx;
      let desiredcny = cny + desireddy;

      let dx = -6;
      let dy = -2;

      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [desiredcnx, desiredcny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph4/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph4/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph4/circle"].stateValues.numericalRadius;

      let desireddx = 7,
        desireddy = -3;

      let desiredcnx = cnx + desireddx;
      let desiredcny = cny + desireddy;

      let dx = 6;
      let dy = -2;

      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      cnx = Math.round(cnx * 1e14) / 1e14;
      cny = Math.round(cny * 1e14) / 1e14;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [desiredcnx, desiredcny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });
  });

  it("circle through three points, two points constrained", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point>(2,-3)</point>
    <point>(3,4)
    <constraints>
      <constrainToGrid dx="3" dy="2" />
    </constraints>
    </point>
    <point>(-3,4)
    <constraints>
      <constrainToGrid dx="3" dy="2" />
    </constraints>
    </point>
    <circle through="$_point1 $_point2 $_point3" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" source="_circle1" />
    <point x="$(_circle1.radius)" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2" displayDigits="8">
      <copy prop="center" source="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" source="_circle1" displayDigits="8" />
    <copy prop="diameter" assignNames="diam" source="_circle1" displayDigits="8" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" source="../_circle1" />
    </graph>
    <copy assignNames="graph4" source="graph3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = 4;
    let t3x = -3,
      t3y = 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/_circle1"].stateValues.radius).closeTo(r, 1e-12);

      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(
        stateVariables["/graph3/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(await stateVariables["/graph3/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
      ).closeTo(cnx, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
      ).closeTo(cny, 1e-12);
      expect(
        stateVariables["/graph4/circle"].stateValues.numericalRadius,
      ).closeTo(r, 1e-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
        cny,
        1e-12,
      );
      expect(await stateVariables["/graph4/circle"].stateValues.radius).closeTo(
        r,
        1e-12,
      );

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(t1x, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(t1y, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(t2x, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(t2y, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(t3x, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(t3y, 1e-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(
        cnx,
        1e-12,
      );
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
        cny,
        1e-12,
      );
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
        r,
        1e-12,
      );
      expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );
    });

    cy.log("move circle up and to the right");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/_circle1"].stateValues.numericalCenter[0];
      let cny = stateVariables["/_circle1"].stateValues.numericalCenter[1];
      let r = stateVariables["/_circle1"].stateValues.numericalRadius;

      let desireddx = 5,
        desireddy = 3;

      let desiredcnx = cnx + desireddx;
      let desiredcny = cny + desireddy;

      let dx = 6;
      let dy = 4;

      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [desiredcnx, desiredcny] },
      });
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move circle2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph3/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph3/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph3/circle"].stateValues.numericalRadius;

      let desireddx = -4.9,
        desireddy = -2.2;

      let desiredcnx = cnx + desireddx;
      let desiredcny = cny + desireddy;

      let dx = -6;
      let dy = -2;

      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [desiredcnx, desiredcny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });

    cy.log("move circle3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph4/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph4/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph4/circle"].stateValues.numericalRadius;

      let desireddx = 7.1,
        desireddy = -2.9;

      let desiredcnx = cnx + desireddx;
      let desiredcny = cny + desireddy;

      let dx = 6;
      let dy = -2;

      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      cnx = Math.round(cnx * 1e14) / 1e14;
      cny = Math.round(cny * 1e14) / 1e14;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [desiredcnx, desiredcny] },
      });

      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `(${nInDOM(Math.trunc(cnx * 100) / 100)}`,
      );
      cy.get(cesc("#\\/centerPoint2")).should(
        "contain.text",
        `${nInDOM(Math.trunc(cny * 100) / 100)}`,
      );
      cy.get(cesc("#\\/radiusNumber")).should(
        "contain.text",
        nInDOM(Math.trunc(r * 100) / 100),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/_circle1"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(stateVariables["/_circle1"].stateValues.numericalRadius).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/_circle1"].stateValues.radius).closeTo(
          r,
          1e-12,
        );
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph3/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cnx, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cny, 1e-12);
        expect(
          stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(
          cnx,
          1e-12,
        );
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(
          cny,
          1e-12,
        );
        expect(
          await stateVariables["/graph4/circle"].stateValues.radius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          t1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          t1y,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          t2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          t2y,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          t3x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          t3y,
          1e-12,
        );
        expect(
          (await stateVariables["/centerPoint"].stateValues.xs)[0],
        ).closeTo(cnx, 1e-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(
          cny,
          1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(
          r,
          1e-12,
        );
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1e-12);
      });
    });
  });

  it("hideOffGraphIndicator", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
      <circle name="P1" center="(12,3)" />
      <circle name="Q1" hideOffGraphIndicator center="(-2,14)" />
      <circle name="R1" hideOffGraphIndicator="false" center="(6,-14)" />
    </graph>

    <boolean copySource="P1.hideOffGraphIndicator" name="P1h" />
    <boolean copySource="Q1.hideOffGraphIndicator" name="Q1h" />
    <boolean copySource="R1.hideOffGraphIndicator" name="R1h" />

    <graph hideOffGraphIndicators>
      <circle name="P2" copySource="P1" />
      <circle name="Q2" copySource="Q1" />
      <circle name="R2" copySource="R1" />
    </graph>

    <boolean copySource="P2.hideOffGraphIndicator" name="P2h" />
    <boolean copySource="Q2.hideOffGraphIndicator" name="Q2h" />
    <boolean copySource="R2.hideOffGraphIndicator" name="R2h" />

    <graph hideOffGraphIndicators="false" >
      <circle name="P3" copySource="P1" />
      <circle name="Q3" copySource="Q1" />
      <circle name="R3" copySource="R1" />
    </graph>

    <boolean copySource="P3.hideOffGraphIndicator" name="P3h" />
    <boolean copySource="Q3.hideOffGraphIndicator" name="Q3h" />
    <boolean copySource="R3.hideOffGraphIndicator" name="R3h" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/P1h")).should("have.text", "false");
    cy.get(cesc2("#/Q1h")).should("have.text", "true");
    cy.get(cesc2("#/R1h")).should("have.text", "false");

    cy.get(cesc2("#/P2h")).should("have.text", "true");
    cy.get(cesc2("#/Q2h")).should("have.text", "true");
    cy.get(cesc2("#/R2h")).should("have.text", "false");

    cy.get(cesc2("#/P3h")).should("have.text", "false");
    cy.get(cesc2("#/Q3h")).should("have.text", "true");
    cy.get(cesc2("#/R3h")).should("have.text", "false");

  });
});
