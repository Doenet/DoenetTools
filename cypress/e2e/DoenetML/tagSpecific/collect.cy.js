import { cesc } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

describe("Collect Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("collect points from graphs", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,5)</point>
    </graph>

    <graph>
      <copy source="_point1" assignNames="p1a" />
      <point>(4,2)</point>
      <point>
        (<copy prop="y" source="_point2" />,
        <copy prop="x" source="_point2" />)
      </point>
    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" name="points" source="_panel1" assignNames="q1 q2 q3 q4 q5" />
    </graph>

    <p>Coordinates of points: <collect componentTypes="point" prop="coords" name="coords" source="_panel1" assignNames="c1 c2 c3 c4 c5" /></p>
    <p><m>x</m>-coordinates of points: <aslist><collect componentTypes="point" prop="x" name="xs" source="_graph3" assignNames="x1 x2 x3 x4 x5" /></aslist></p>
    <p><m>x</m>-coordinates of points via a copy: <aslist><copy name="xs2" source="xs" assignNames="xc1 xc2 xc3 xc4 xc5" /></aslist></p>
    <p><m>x</m>-coordinates of points via extract: <aslist><extract prop="x" name="xs3" assignNames="xe1 xe2 xe3 xe4 xe5" ><copy name="points2" source="points" assignNames="qa1 qa2 qa3 qa4 qa5" /></extract></aslist></p>
    <p>Average of <m>y</m>-coordinates of points: <mean name="mean"><collect componentTypes="point" prop="y" name="ys" source="_graph3" assignNames="y1 y2 y3 y4 y5" /></mean></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = -3,
      y1 = 1;
    let x2 = -7,
      y2 = 5;
    let x3 = 4,
      y3 = 2;

    let coords1Text = ("(" + x1 + "," + y1 + ")").replace(/-/g, "−");
    let coords2Text = ("(" + x2 + "," + y2 + ")").replace(/-/g, "−");
    let coords3Text = ("(" + x3 + "," + y3 + ")").replace(/-/g, "−");
    let coords2tText = ("(" + y2 + "," + x2 + ")").replace(/-/g, "−");

    let meany = (y1 + y2 + y1 + y3 + x2) / 5;

    cy.get(cesc("#\\/c1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(coords1Text);
      });
    cy.get(cesc("#\\/c2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(coords2Text);
      });
    cy.get(cesc("#\\/c3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(coords1Text);
      });
    cy.get(cesc("#\\/c4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(coords3Text);
      });
    cy.get(cesc("#\\/c5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(coords2tText);
      });

    cy.get(cesc("#\\/x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x2).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/x4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x3).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/x5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(y2).replace(/-/, "−"));
      });

    cy.get(cesc("#\\/xc1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xc2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x2).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xc3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xc4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x3).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xc5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(y2).replace(/-/, "−"));
      });

    cy.get(cesc("#\\/xe1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xe2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x2).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xe3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xe4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x3).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xe5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(y2).replace(/-/, "−"));
      });

    cy.get(cesc("#\\/mean"))
      .find(".mjx-mrow")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(meany).replace(/-/, "−"));
      });

    cy.window().then(async (win) => {
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      let stateVariables = await win.returnAllStateVariables1();
      for (let i = 0; i < 5; i++) {
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(xs[i]);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(ys[i]);
        expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0]).eq(xs[i]);
        expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1]).eq(ys[i]);
        expect(stateVariables[`/c${i + 1}`].stateValues.value).eqls([
          "vector",
          xs[i],
          ys[i],
        ]);
        expect(stateVariables[`/x${i + 1}`].stateValues.value).eq(xs[i]);
        expect(stateVariables[`/xc${i + 1}`].stateValues.value).eq(xs[i]);
        expect(stateVariables[`/xe${i + 1}`].stateValues.value).eq(xs[i]);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(ys[i]);
      }
      expect(stateVariables["/mean"].stateValues.value).eq(meany);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      x1 = -8;
      y1 = 6;
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      meany = (y1 + y2 + y1 + y3 + x2) / 5;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1 },
      });

      cy.get(cesc("#\\/c1")).should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 5; i++) {
          expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(xs[i]);
          expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(ys[i]);
          expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0]).eq(xs[i]);
          expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1]).eq(ys[i]);
          expect(stateVariables[`/c${i + 1}`].stateValues.value).eqls([
            "vector",
            xs[i],
            ys[i],
          ]);
          expect(stateVariables[`/x${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/xc${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/xe${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(ys[i]);
        }
        expect(stateVariables["/mean"].stateValues.value).eq(meany);
      });
    });

    cy.log("move point 1 via copy");
    cy.window().then(async (win) => {
      x1 = 2;
      y1 = 0;
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      meany = (y1 + y2 + y1 + y3 + x2) / 5;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p1a",
        args: { x: x1, y: y1 },
      });

      cy.get(cesc("#\\/c1")).should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        for (let i = 0; i < 5; i++) {
          expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(xs[i]);
          expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(ys[i]);
          expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0]).eq(xs[i]);
          expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1]).eq(ys[i]);
          expect(stateVariables[`/c${i + 1}`].stateValues.value).eqls([
            "vector",
            xs[i],
            ys[i],
          ]);
          expect(stateVariables[`/x${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/xc${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/xe${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(ys[i]);
        }
        expect(stateVariables["/mean"].stateValues.value).eq(meany);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      x2 = 4;
      y2 = 8;
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      meany = (y1 + y2 + y1 + y3 + x2) / 5;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/c2")).should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 5; i++) {
          expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(xs[i]);
          expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(ys[i]);
          expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0]).eq(xs[i]);
          expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1]).eq(ys[i]);
          expect(stateVariables[`/c${i + 1}`].stateValues.value).eqls([
            "vector",
            xs[i],
            ys[i],
          ]);
          expect(stateVariables[`/x${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/xc${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/xe${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(ys[i]);
        }
        expect(stateVariables["/mean"].stateValues.value).eq(meany);
      });
    });

    cy.log("move flipped point 2");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -3;
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      meany = (y1 + y2 + y1 + y3 + x2) / 5;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: y2, y: x2 },
      });

      cy.get(cesc("#\\/c2")).should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 5; i++) {
          expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(xs[i]);
          expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(ys[i]);
          expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0]).eq(xs[i]);
          expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1]).eq(ys[i]);
          expect(stateVariables[`/c${i + 1}`].stateValues.value).eqls([
            "vector",
            xs[i],
            ys[i],
          ]);
          expect(stateVariables[`/x${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/xc${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/xe${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(ys[i]);
        }
        expect(stateVariables["/mean"].stateValues.value).eq(meany);
      });
    });

    cy.log("move point 3");
    cy.window().then(async (win) => {
      x3 = -5;
      y3 = 9;
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      meany = (y1 + y2 + y1 + y3 + x2) / 5;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: x3, y: y3 },
      });

      cy.get(cesc("#\\/c4")).should(
        "contain.text",
        `(${nInDOM(x3)},${nInDOM(y3)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 5; i++) {
          expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(xs[i]);
          expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(ys[i]);
          expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0]).eq(xs[i]);
          expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1]).eq(ys[i]);
          expect(stateVariables[`/c${i + 1}`].stateValues.value).eqls([
            "vector",
            xs[i],
            ys[i],
          ]);
          expect(stateVariables[`/x${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/xc${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/xe${i + 1}`].stateValues.value).eq(xs[i]);
          expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(ys[i]);
        }
        expect(stateVariables["/mean"].stateValues.value).eq(meany);
      });
    });
  });

  it("collect dynamic points from graphs", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="length" prefill="3"/>
    <mathinput name="mult" prefill="2"/>
    <panel>
    <graph>
      <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6)">
        <template><point>($x, <copy prop="value" source="mult" />$x)</point></template>
        <sources alias="x"><sequence to="$length" /></sources>
      </map>
      <line>y=x/3</line>
    </graph>

    <graph>
      <map assignNames="(q1) (q2) (q3) (q4) (q5) (q6)">
        <template><point>(<extract prop="x">$p</extract>+1, 1.5*<extract prop="y">$p</extract>)</point></template>
        <sources alias="p"><collect componentTypes="point" source="_map1" assignNames="pa1 pa2 pa3 pa4 pa5 pa6" /></sources>
      </map>

    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" source="_panel1" assignNames="r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12" />
    </graph>

    <p>y-coordinates of points: <aslist>
      <collect componentTypes="point" prop="y" source="_graph3" assignNames="y1 y2 y3 y4 y5 y6 y7 y8 y9 y10 y11 y12" />
    </aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(3);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(3);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(3);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(6);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(6);

      for (let i = 0; i < 3; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/r${i + 4}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 4}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(2 * x);
        expect(stateVariables[`/y${i + 4}`].stateValues.value).eq(3 * x);
      }
    });

    cy.log("increase number of points");
    cy.get(cesc("#\\/length") + " textarea").type(`{end}{backspace}5{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y10")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(5);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(10);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(2 * x);
        expect(stateVariables[`/y${i + 6}`].stateValues.value).eq(3 * x);
      }
    });

    cy.log("change multiple");
    cy.get(cesc("#\\/mult") + " textarea").type(`{end}{backspace}0.5{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y10")).should("contain.text", "3.75");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(5);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(10);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
        expect(stateVariables[`/y${i + 6}`].stateValues.value).eq(0.75 * x);
      }
    });

    cy.log("decrease number of points");
    cy.get(cesc("#\\/length") + " textarea").type(`{end}{backspace}1{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y10")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(1);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(1);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(1);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(2);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(2);

      for (let i = 0; i < 1; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/r${i + 2}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 2}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
        expect(stateVariables[`/y${i + 2}`].stateValues.value).eq(0.75 * x);
      }
    });

    cy.log("increase number of points back to 4");
    cy.get(cesc("#\\/length") + " textarea").type(`{end}{backspace}4{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y8")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(4);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(4);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(4);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(8);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(8);

      for (let i = 0; i < 4; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/r${i + 5}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 5}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
        expect(stateVariables[`/y${i + 5}`].stateValues.value).eq(0.75 * x);
      }
    });

    cy.log("increase number of points to 6");
    cy.get(cesc("#\\/length") + " textarea").type(`{end}{backspace}6{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y12")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(6);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(6);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(6);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(12);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(12);

      for (let i = 0; i < 6; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/r${i + 7}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 7}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
        expect(stateVariables[`/y${i + 7}`].stateValues.value).eq(0.75 * x);
      }
    });
  });

  it("collect dynamic points from groups", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="length" prefill="3"/>
    <mathinput name="mult" prefill="2"/>
    <section>
    <group>
      <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6)">
        <template><point>($x, <copy prop="value" source="mult" />$x)</point></template>
        <sources alias="x"><sequence to="$length" /></sources>
      </map>
      <line>y=x/3</line>
    </group>

    <group>
      <map assignNames="(q1) (q2) (q3) (q4) (q5) (q6)">
        <template><point>(<extract prop="x">$p</extract>+1, 1.5*<extract prop="y">$p</extract>)</point></template>
        <sources alias="p"><collect componentTypes="point" source="_map1" assignNames="pa1 pa2 pa3 pa4 pa5 pa6" /></sources>
      </map>

    </group>
    </section>

    <group>
      <collect componentTypes="point" source="_section1" assignNames="r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12" />
    </group>

    <p>y-coordinates of points: <aslist>
      <collect componentTypes="point" prop="y" source="_group3" assignNames="y1 y2 y3 y4 y5 y6 y7 y8 y9 y10 y11 y12" />
    </aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(3);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(3);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(3);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(6);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(6);

      for (let i = 0; i < 3; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/r${i + 4}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 4}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(2 * x);
        expect(stateVariables[`/y${i + 4}`].stateValues.value).eq(3 * x);
      }
    });

    cy.log("increase number of points");
    cy.get(cesc("#\\/length") + " textarea").type(`{end}{backspace}5{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y10")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(5);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(10);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(2 * x);
        expect(stateVariables[`/y${i + 6}`].stateValues.value).eq(3 * x);
      }
    });

    cy.log("change multiple");
    cy.get(cesc("#\\/mult") + " textarea").type(`{end}{backspace}0.5{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y10")).should("contain.text", "3.75");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(5);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(10);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
        expect(stateVariables[`/y${i + 6}`].stateValues.value).eq(0.75 * x);
      }
    });

    cy.log("decrease number of points");
    cy.get(cesc("#\\/length") + " textarea").type(`{end}{backspace}1{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y10")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(1);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(1);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(1);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(2);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(2);

      for (let i = 0; i < 1; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/r${i + 2}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 2}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
        expect(stateVariables[`/y${i + 2}`].stateValues.value).eq(0.75 * x);
      }
    });

    cy.log("increase number of points back to 4");
    cy.get(cesc("#\\/length") + " textarea").type(`{end}{backspace}4{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y8")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(4);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(4);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(4);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(8);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(8);

      for (let i = 0; i < 4; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/r${i + 5}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 5}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
        expect(stateVariables[`/y${i + 5}`].stateValues.value).eq(0.75 * x);
      }
    });

    cy.log("increase number of points to 6");
    cy.get(cesc("#\\/length") + " textarea").type(`{end}{backspace}6{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y12")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(6);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(6);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(6);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(12);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(12);

      for (let i = 0; i < 6; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/r${i + 7}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 7}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
        expect(stateVariables[`/y${i + 7}`].stateValues.value).eq(0.75 * x);
      }
    });
  });

  it("collect points and vectors from graphs", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,4)</point>
      <vector tail="$_point1" head="$_point2" />
    </graph>

    <graph>
      <point>
        (<copy prop="y" source="_point1" />,
        <copy prop="x" source="_point1" />)
      </point>
      <point>
        (<copy prop="y" source="_point2" />,
        <copy prop="x" source="_point2" />)
      </point>
      <vector tail="$_point3" head="$_point4" />
    </graph>
    </panel>

    <graph>
      <collect componentTypes="point vector" source="_panel1" assignNames="v1 v2 v3 v4 v5 v6" />
    </graph>

    <copy prop="head" source="_vector1" assignNames="h1" />
    <copy prop="head" source="_vector2" assignNames="h2" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = -3,
      y1 = 1;
    let x2 = -7,
      y2 = 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        x1,
        y1,
      ]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        x2,
        y2,
      ]);
      expect(stateVariables["/_vector1"].stateValues.tail).eqls([x1, y1]);
      expect(stateVariables["/_vector1"].stateValues.head).eqls([x2, y2]);
      expect(stateVariables["/_point3"].stateValues.coords).eqls([
        "vector",
        y1,
        x1,
      ]);
      expect(stateVariables["/_point4"].stateValues.coords).eqls([
        "vector",
        y2,
        x2,
      ]);
      expect(stateVariables["/_vector2"].stateValues.tail).eqls([y1, x1]);
      expect(stateVariables["/_vector2"].stateValues.head).eqls([y2, x2]);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(6);
      expect(stateVariables["/v1"].stateValues.coords).eqls(["vector", x1, y1]);
      expect(stateVariables["/v2"].stateValues.coords).eqls(["vector", x2, y2]);
      expect(stateVariables["/v3"].stateValues.tail).eqls([x1, y1]);
      expect(stateVariables["/v3"].stateValues.head).eqls([x2, y2]);
      expect(stateVariables["/v4"].stateValues.coords).eqls(["vector", y1, x1]);
      expect(stateVariables["/v5"].stateValues.coords).eqls(["vector", y2, x2]);
      expect(stateVariables["/v6"].stateValues.tail).eqls([y1, x1]);
      expect(stateVariables["/v6"].stateValues.head).eqls([y2, x2]);
      cy.get(cesc("#\\/h1")).should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );
    });

    cy.log("move vector 1 via copy");
    cy.window().then(async (win) => {
      x1 = -8;
      y1 = 6;
      x2 = 3;
      y2 = 2;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/v3",
        args: { tailcoords: [x1, y1], headcoords: [x2, y2] },
      });

      cy.get(cesc("#\\/h1")).should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_point1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/_point2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([x1, y1]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([x2, y2]);
        expect(stateVariables["/_point3"].stateValues.coords).eqls([
          "vector",
          y1,
          x1,
        ]);
        expect(stateVariables["/_point4"].stateValues.coords).eqls([
          "vector",
          y2,
          x2,
        ]);
        expect(stateVariables["/_vector2"].stateValues.tail).eqls([y1, x1]);
        expect(stateVariables["/_vector2"].stateValues.head).eqls([y2, x2]);
        expect(
          stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(6);
        expect(stateVariables["/v1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/v2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/v3"].stateValues.tail).eqls([x1, y1]);
        expect(stateVariables["/v3"].stateValues.head).eqls([x2, y2]);
        expect(stateVariables["/v4"].stateValues.coords).eqls([
          "vector",
          y1,
          x1,
        ]);
        expect(stateVariables["/v5"].stateValues.coords).eqls([
          "vector",
          y2,
          x2,
        ]);
        expect(stateVariables["/v6"].stateValues.tail).eqls([y1, x1]);
        expect(stateVariables["/v6"].stateValues.head).eqls([y2, x2]);
      });
    });

    cy.log("move vector 2 via copy");
    cy.window().then(async (win) => {
      x1 = 9;
      y1 = 0;
      x2 = -7;
      y2 = 5;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/v6",
        args: { tailcoords: [y1, x1], headcoords: [y2, x2] },
      });

      cy.get(cesc("#\\/h2")).should(
        "contain.text",
        `(${nInDOM(y2)},${nInDOM(x2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_point1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/_point2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([x1, y1]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([x2, y2]);
        expect(stateVariables["/_point3"].stateValues.coords).eqls([
          "vector",
          y1,
          x1,
        ]);
        expect(stateVariables["/_point4"].stateValues.coords).eqls([
          "vector",
          y2,
          x2,
        ]);
        expect(stateVariables["/_vector2"].stateValues.tail).eqls([y1, x1]);
        expect(stateVariables["/_vector2"].stateValues.head).eqls([y2, x2]);
        expect(
          stateVariables["/_collect1"].stateValues.collectedComponents.length,
        ).eq(6);
        expect(stateVariables["/v1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/v2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/v3"].stateValues.tail).eqls([x1, y1]);
        expect(stateVariables["/v3"].stateValues.head).eqls([x2, y2]);
        expect(stateVariables["/v4"].stateValues.coords).eqls([
          "vector",
          y1,
          x1,
        ]);
        expect(stateVariables["/v5"].stateValues.coords).eqls([
          "vector",
          y2,
          x2,
        ]);
        expect(stateVariables["/v6"].stateValues.tail).eqls([y1, x1]);
        expect(stateVariables["/v6"].stateValues.head).eqls([y2, x2]);
      });
    });
  });

  it("maximum number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="length" prefill="5"/>
    <mathinput name="mult" prefill="2"/>
    <mathinput name="maxnumber" prefill="2"/>
    <panel>
    <graph>
      <map assignNames="(p1) (p2) (p3) (p4) (p5)">
        <template><point>($x, <copy prop="value" source="../mult" />$x)</point></template>
        <sources alias="x"><sequence to="$length" /></sources>
      </map>
      <line>y=x/3</line>
    </graph>

    <graph>
      <map assignNames="(q1) (q2) (q3) (q4) (q5)">
      <template><point>(<extract prop="x">$p</extract>+1, 1.5*<extract prop="y">$p</extract>)</point></template>
      <sources alias="p"><collect componentTypes="point" source="_map1" maxNumber="$maxnumber" assignNames="pa1 pa2 pa3 pa4 pa5" /></sources>
    </map>

    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" source="_panel1" maxNumber="2$maxnumber" assignNames="r1 r2 r3 r4 r5 r6 r7 r8 r9 r10" />
    </graph>

    <p>y-coordinates of points: <aslist>
      <collect componentTypes="point" prop="y" source="_graph3" maxNumber="$maxnumber" assignNames="y1 y2 y3 y4 y5 y6 y7 y8 y9 y10" />
    </aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(2);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(2);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(4);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(2);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(2 * x);
      }
      for (let i = 0; i < 2; i++) {
        let x = i + 1;
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(3 * x);
      }
      for (let i = 0; i < 4; i++) {
        let x = i + 1;
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(2 * x);
      }
      for (let i = 0; i < 2; i++) {
        let x = i + 1;
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(2 * x);
      }
    });

    cy.log("increase maxnumber");
    cy.get(cesc("#\\/maxnumber") + " textarea").type(
      `{end}{backspace}5{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/y5")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(5);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(10);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(5);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(2 * x);
        //expect(stateVariables[`/y${i + 6}`].stateValues.value).eq(3 * x);
      }
    });

    cy.log("increase maxnumber further");
    cy.get(cesc("#\\/maxnumber") + " textarea").type(
      `{end}{backspace}10{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/y10")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(5);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(10);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(2 * x);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[1]).eq(3 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(2 * x);
        expect(stateVariables[`/y${i + 6}`].stateValues.value).eq(3 * x);
      }
    });

    cy.log("change multiple");
    cy.get(cesc("#\\/mult") + " textarea").type(`{end}{backspace}0.5{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y10")).should("contain.text", "3.75");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(5);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(5);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(10);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 6}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
        expect(stateVariables[`/y${i + 6}`].stateValues.value).eq(0.75 * x);
      }
    });

    cy.log("decrease number of points");
    cy.get(cesc("#\\/length") + " textarea").type(`{end}{backspace}1{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y10")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(1);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(1);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(1);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(2);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(2);

      for (let i = 0; i < 1; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/r${i + 2}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 2}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
        expect(stateVariables[`/y${i + 2}`].stateValues.value).eq(0.75 * x);
      }
    });

    cy.log("increase number of points back to 4");
    cy.get(cesc("#\\/length") + " textarea").type(`{end}{backspace}4{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/y4")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(4);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(4);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(4);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(8);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(8);

      for (let i = 0; i < 4; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/r${i + 5}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 5}`].stateValues.xs[1]).eq(0.75 * x);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
        expect(stateVariables[`/y${i + 5}`].stateValues.value).eq(0.75 * x);
      }
    });

    cy.log("decrease max number to 3");
    cy.get(cesc("#\\/maxnumber") + " textarea").type(
      `{end}{backspace}{backspace}3{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/y4")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_map1"].stateValues.nIterates[0]).eq(4);
      expect(
        stateVariables["/_collect1"].stateValues.collectedComponents.length,
      ).eq(3);
      expect(stateVariables["/_map2"].stateValues.nIterates[0]).eq(3);
      expect(
        stateVariables["/_collect2"].stateValues.collectedComponents.length,
      ).eq(6);
      expect(
        stateVariables["/_collect3"].stateValues.collectedComponents.length,
      ).eq(3);

      for (let i = 0; i < 4; i++) {
        let x = i + 1;
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/p${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
      }
      for (let i = 0; i < 3; i++) {
        let x = i + 1;
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/pa${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(0.75 * x);
      }
      for (let i = 0; i < 4; i++) {
        let x = i + 1;

        expect(stateVariables[`/r${i + 1}`].stateValues.xs[0]).eq(x);
        expect(stateVariables[`/r${i + 1}`].stateValues.xs[1]).eq(0.5 * x);
      }
      for (let i = 0; i < 2; i++) {
        let x = i + 1;
        expect(stateVariables[`/r${i + 5}`].stateValues.xs[0]).eq(x + 1);
        expect(stateVariables[`/r${i + 5}`].stateValues.xs[1]).eq(0.75 * x);
      }
      for (let i = 0; i < 3; i++) {
        let x = i + 1;
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(0.5 * x);
      }
    });
  });

  it("collect, extract, copy multiple ways", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text><math>a</math>

  <p>How many blanks? 
    <mathinput name="n" prefill="1" />
  </p>
 
  <p name="p_original">Enter expressions:
    <map>
      <template>
        <mathinput />
      </template>
      <sources>
        <sequence length="$n" />
      </sources>
    </map>
  </p>
  
  <p name="p_1">Inputs collected then, values extracted: 
  <aslist name="al1"><extract prop="value" name="values1"><collect componentTypes="mathinput" source="p_original"/></extract></aslist></p>

  <p name="p_1a">Copied: <aslist name="al1a"><copy name="values1a" source="values1" /></aslist></p>
  <p name="p_1b">Copy aslist: <copy name="al1b" source="al1" /></p>
  <p name="p_1c">Copy copied: <aslist><copy source="values1a" /></aslist></p>
  <p name="p_1d">Copy aslist containing copy: <copy source="al1a" /></p>
  <p name="p_1e">Copy copied aslist: <copy source="al1b" /></p>

  <p name="p_2">Values collected: 
    <aslist name="al2"><collect prop="value" name="values2" componentTypes="mathinput" source="p_original"/></aslist></p>
    
  <p name="p_2a">Copied: <aslist name="al2a"><copy name="values2a" source="values2" /></aslist></p>
  <p name="p_2b">Copy aslist: <copy name="al2b" source="al2" /></p>
  <p name="p_2c">Copy copied: <aslist><copy source="values2a" /></aslist></p>
  <p name="p_2d">Copy aslist containing copy: <copy source="al2a" /></p>
  <p name="p_2e">Copy copied aslist: <copy source="al2b" /></p>

  <p name="p_3">Inputs collected: <aslist name="al3"><collect name="col" componentTypes="mathinput" source="p_original"/></aslist></p>
  
  <p name="p_3a">Copied: <aslist name="al3a"><copy name="cola" source="col" /></aslist></p>
  <p name="p_3b">Copy aslist: <copy name="al3b" source="al3" /></p>
  <p name="p_3c">Copy copied: <aslist><copy source="cola" /></aslist></p>
  <p name="p_3d">Copy aslist containing copy: <copy source="al3a" /></p>
  <p name="p_3e">Copy copied aslist: <copy source="al3b" /></p>
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "a");

    cy.get(cesc("#\\/p_3e") + " span:nth-of-type(1) textarea").type(
      "x{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(1) .mjx-mrow").should(
      "contain.text",
      "x",
    );
    // cy.get(cesc('#\\/p_original') + ' span:nth-of-type(1) input').should('have.value', 'x');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(1) input').should('have.value', 'x');

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}5{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/p_original") + " > span:nth-of-type(2) textarea")
      .type("{end}{backspace}y", { force: true })
      .blur();
    cy.get(cesc("#\\/p_original") + " > span:nth-of-type(3) textarea")
      .type("{end}{backspace}z", { force: true })
      .blur();
    cy.get(cesc("#\\/p_original") + " > span:nth-of-type(4) textarea")
      .type("{end}{backspace}u", { force: true })
      .blur();
    cy.get(cesc("#\\/p_original") + " > span:nth-of-type(5) textarea")
      .type("{end}{backspace}v", { force: true })
      .blur();

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(5) .mjx-mrow").should(
      "contain.text",
      "v",
    );

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(1) input').should('have.value', 'x');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(1) input').should('have.value', 'x');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(2) input').should('have.value', 'y');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(2) input').should('have.value', 'y');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(3) input').should('have.value', 'z');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(3) input').should('have.value', 'z');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(4) input').should('have.value', 'u');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(4) input').should('have.value', 'u');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(5) input').should('have.value', 'v');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(5) input').should('have.value', 'v');

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(3) .mjx-mrow").should(
      "not.exist",
    );

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(1) .mjx-mrow").should(
      "contain.text",
      "x",
    );

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(1) input').should('have.value', 'x');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(1) input').should('have.value', 'x');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(2) input').should('have.value', 'y');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(2) input').should('have.value', 'y');

    cy.get(cesc("#\\/p_3") + " > span:nth-of-type(1) textarea").type(
      "{end}{backspace}a{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/p_3a") + " > span:nth-of-type(2) textarea").type(
      "{end}{backspace}b{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(2) .mjx-mrow").should(
      "contain.text",
      "b",
    );

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(1) input').should('have.value', 'a');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(1) input').should('have.value', 'a');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(2) input').should('have.value', 'b');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(2) input').should('have.value', 'b');

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}5{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(5) .mjx-mrow").should(
      "contain.text",
      "v",
    );

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(1) input').should('have.value', 'a');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(1) input').should('have.value', 'a');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(2) input').should('have.value', 'b');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(2) input').should('have.value', 'b');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(3) input').should('have.value', 'z');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(3) input').should('have.value', 'z');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(4) input').should('have.value', 'u');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(4) input').should('have.value', 'u');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(5) input').should('have.value', 'v');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(5) input').should('have.value', 'v');

    cy.get(cesc("#\\/p_3b") + " > span:nth-of-type(3) textarea").type(
      "{end}{backspace}c{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/p_3c") + " > span:nth-of-type(4) textarea").type(
      "{end}{backspace}d{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/p_3d") + " > span:nth-of-type(5) textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(5) .mjx-mrow").should(
      "contain.text",
      "e",
    );

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(1) input').should('have.value', 'a');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(1)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(1) input').should('have.value', 'a');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(2) input').should('have.value', 'b');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(2) input').should('have.value', 'b');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(3) input').should('have.value', 'c');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(3)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(3) input').should('have.value', 'c');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(3) input').should('have.value', 'c');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(3) input').should('have.value', 'c');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(3) input').should('have.value', 'c');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(3) input').should('have.value', 'c');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(3) input').should('have.value', 'c');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(4) input').should('have.value', 'd');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(4)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(4) input').should('have.value', 'd');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(4) input').should('have.value', 'd');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(4) input').should('have.value', 'd');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(4) input').should('have.value', 'd');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(4) input').should('have.value', 'd');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(4) input').should('have.value', 'd');

    // cy.get(cesc('#\\/p_original') + ' > span:nth-of-type(5) input').should('have.value', 'e');

    cy.get(cesc("#\\/p_1") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p_1a") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p_1b") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p_1c") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p_1d") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p_1e") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });

    cy.get(cesc("#\\/p_2") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p_2a") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p_2b") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p_2c") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p_2d") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p_2e") + " > span:nth-of-type(5)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });

    // cy.get(cesc('#\\/p_3') + ' > span:nth-of-type(5) input').should('have.value', 'e');
    // cy.get(cesc('#\\/p_3a') + ' > span:nth-of-type(5) input').should('have.value', 'e');
    // cy.get(cesc('#\\/p_3b') + ' > span:nth-of-type(5) input').should('have.value', 'e');
    // cy.get(cesc('#\\/p_3c') + ' > span:nth-of-type(5) input').should('have.value', 'e');
    // cy.get(cesc('#\\/p_3d') + ' > span:nth-of-type(5) input').should('have.value', 'e');
    // cy.get(cesc('#\\/p_3e') + ' > span:nth-of-type(5) input').should('have.value', 'e');
  });

  // main point: no longer turn inputs into their value
  // even with copy a collection with a macro
  it("test macros by collecting inputs and others", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group>
      <mathinput name="a" prefill="x" />
      <textinput name="b" prefill="hello" />
      <booleaninput name="c" />
      <math>2$a</math>
      <text>$b there</text>
      <boolean>not $c</boolean>
    </group>

    <p name="pcollect1"><collect source="_group1" componentTypes="_input math text boolean" /></p>
    <p name="pcollect2">$_collect1</p>
    <p name="pgroup2">$_group1</p>
    <p name="pcollect3"><copy source="_collect1" /></p>
    <p name="pgroup3"><copy source="_group1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let group1Replacements = stateVariables[
        "/_document1"
      ].activeChildren.slice(3, 16);
      let collect1Replacements = stateVariables["/pcollect1"].activeChildren;
      let collect2Replacements = stateVariables["/pcollect2"].activeChildren;
      let group2Replacements = stateVariables["/pgroup2"].activeChildren;
      let collect3Replacements = stateVariables["/pcollect3"].activeChildren;
      let group3Replacements = stateVariables["/pgroup3"].activeChildren;

      expect(group1Replacements.length).eq(13);
      expect(collect1Replacements.length).eq(6);
      expect(collect2Replacements.length).eq(6);
      expect(group2Replacements.length).eq(13);
      expect(collect3Replacements.length).eq(6);
      expect(group3Replacements.length).eq(13);

      expect(group1Replacements[1].componentType).eq("mathInput");
      expect(
        stateVariables[group1Replacements[1].componentName].stateValues.value,
      ).eq("x");
      expect(collect1Replacements[0].componentType).eq("mathInput");
      expect(
        stateVariables[collect1Replacements[0].componentName].stateValues.value,
      ).eq("x");
      expect(collect2Replacements[0].componentType).eq("mathInput");
      expect(
        stateVariables[collect2Replacements[0].componentName].stateValues.value,
      ).eq("x");
      expect(group2Replacements[1].componentType).eq("mathInput");
      expect(
        stateVariables[group2Replacements[1].componentName].stateValues.value,
      ).eq("x");
      expect(collect3Replacements[0].componentType).eq("mathInput");
      expect(
        stateVariables[collect3Replacements[0].componentName].stateValues.value,
      ).eq("x");
      expect(group3Replacements[1].componentType).eq("mathInput");
      expect(
        stateVariables[group3Replacements[1].componentName].stateValues.value,
      ).eq("x");

      expect(group1Replacements[3].componentType).eq("textInput");
      expect(
        stateVariables[group1Replacements[3].componentName].stateValues.value,
      ).eq("hello");
      expect(collect1Replacements[1].componentType).eq("textInput");
      expect(
        stateVariables[collect1Replacements[1].componentName].stateValues.value,
      ).eq("hello");
      expect(collect2Replacements[1].componentType).eq("textInput");
      expect(
        stateVariables[collect2Replacements[1].componentName].stateValues.value,
      ).eq("hello");
      expect(group2Replacements[3].componentType).eq("textInput");
      expect(
        stateVariables[group2Replacements[3].componentName].stateValues.value,
      ).eq("hello");
      expect(collect3Replacements[1].componentType).eq("textInput");
      expect(
        stateVariables[collect3Replacements[1].componentName].stateValues.value,
      ).eq("hello");
      expect(group3Replacements[3].componentType).eq("textInput");
      expect(
        stateVariables[group3Replacements[3].componentName].stateValues.value,
      ).eq("hello");

      expect(group1Replacements[5].componentType).eq("booleanInput");
      expect(
        stateVariables[group1Replacements[5].componentName].stateValues.value,
      ).eq(false);
      expect(collect1Replacements[2].componentType).eq("booleanInput");
      expect(
        stateVariables[collect1Replacements[2].componentName].stateValues.value,
      ).eq(false);
      expect(collect2Replacements[2].componentType).eq("booleanInput");
      expect(
        stateVariables[collect2Replacements[2].componentName].stateValues.value,
      ).eq(false);
      expect(group2Replacements[5].componentType).eq("booleanInput");
      expect(
        stateVariables[group2Replacements[5].componentName].stateValues.value,
      ).eq(false);
      expect(collect3Replacements[2].componentType).eq("booleanInput");
      expect(
        stateVariables[collect3Replacements[2].componentName].stateValues.value,
      ).eq(false);
      expect(group3Replacements[5].componentType).eq("booleanInput");
      expect(
        stateVariables[group3Replacements[5].componentName].stateValues.value,
      ).eq(false);

      expect(group1Replacements[7].componentType).eq("math");
      expect(
        stateVariables[group1Replacements[7].componentName].stateValues.value,
      ).eqls(["*", 2, "x"]);
      expect(collect1Replacements[3].componentType).eq("math");
      expect(
        stateVariables[collect1Replacements[3].componentName].stateValues.value,
      ).eqls(["*", 2, "x"]);
      expect(collect2Replacements[3].componentType).eq("math");
      expect(
        stateVariables[collect2Replacements[3].componentName].stateValues.value,
      ).eqls(["*", 2, "x"]);
      expect(group2Replacements[7].componentType).eq("math");
      expect(
        stateVariables[group2Replacements[7].componentName].stateValues.value,
      ).eqls(["*", 2, "x"]);
      expect(collect3Replacements[3].componentType).eq("math");
      expect(
        stateVariables[collect3Replacements[3].componentName].stateValues.value,
      ).eqls(["*", 2, "x"]);
      expect(group3Replacements[7].componentType).eq("math");
      expect(
        stateVariables[group3Replacements[7].componentName].stateValues.value,
      ).eqls(["*", 2, "x"]);

      expect(group1Replacements[9].componentType).eq("text");
      expect(
        stateVariables[group1Replacements[9].componentName].stateValues.value,
      ).eq("hello there");
      expect(collect1Replacements[4].componentType).eq("text");
      expect(
        stateVariables[collect1Replacements[4].componentName].stateValues.value,
      ).eq("hello there");
      expect(collect2Replacements[4].componentType).eq("text");
      expect(
        stateVariables[collect2Replacements[4].componentName].stateValues.value,
      ).eq("hello there");
      expect(group2Replacements[9].componentType).eq("text");
      expect(
        stateVariables[group2Replacements[9].componentName].stateValues.value,
      ).eq("hello there");
      expect(collect3Replacements[4].componentType).eq("text");
      expect(
        stateVariables[collect3Replacements[4].componentName].stateValues.value,
      ).eq("hello there");
      expect(group3Replacements[9].componentType).eq("text");
      expect(
        stateVariables[group3Replacements[9].componentName].stateValues.value,
      ).eq("hello there");

      expect(group1Replacements[11].componentType).eq("boolean");
      expect(
        stateVariables[group1Replacements[11].componentName].stateValues.value,
      ).eq(true);
      expect(collect1Replacements[5].componentType).eq("boolean");
      expect(
        stateVariables[collect1Replacements[5].componentName].stateValues.value,
      ).eq(true);
      expect(collect2Replacements[5].componentType).eq("boolean");
      expect(
        stateVariables[collect2Replacements[5].componentName].stateValues.value,
      ).eq(true);
      expect(group2Replacements[11].componentType).eq("boolean");
      expect(
        stateVariables[group2Replacements[11].componentName].stateValues.value,
      ).eq(true);
      expect(collect3Replacements[5].componentType).eq("boolean");
      expect(
        stateVariables[collect3Replacements[5].componentName].stateValues.value,
      ).eq(true);
      expect(group3Replacements[11].componentType).eq("boolean");
      expect(
        stateVariables[group3Replacements[11].componentName].stateValues.value,
      ).eq(true);
    });
  });

  it("collect does not ignore hide", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <section>
      <text hide>secret</text>
      <text>public</text>
    </section>
    <p>Hidden by default: <collect componentTypes="text" source="_section1" /></p>
    <p>Force to reveal: <collect componentTypes="text" source="_section1" hide="false" /></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");
    cy.get(cesc("#\\/_section1")).should("contain.text", "public");
    cy.get(cesc("#\\/_section1")).should("not.contain.text", "secret");

    cy.get(cesc("#\\/_p1")).should("have.text", "Hidden by default: public");
    cy.get(cesc("#\\/_p2")).should(
      "have.text",
      "Force to reveal: secretpublic",
    );
  });

  it("collect keeps hidden children hidden", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <section>
      <p name="theP1" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
      <copy source="theP1" assignNames="theP2" />
      <p hide name="theP3" newNamespace>Hidden paragraph with hidden text: <text name="hidden" hide>top secret</text></p>
      <copy source="theP3" assignNames="theP4" />
    </section>
    <collect componentTypes="p" source="_section1" assignNames="cp1 cp2 cp3 cp4" />
    <collect componentTypes="p" source="_section1" hide="false" assignNames="cp5 cp6 cp7 cp8" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");
    cy.get(cesc("#\\/theP1")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/theP2")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/theP3")).should("not.exist");
    cy.get(cesc("#\\/theP4")).should("not.exist");
    cy.get(cesc("#\\/cp1")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/cp2")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/cp3")).should("not.exist");
    cy.get(cesc("#\\/cp4")).should("not.exist");
    cy.get(cesc("#\\/cp5")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/cp6")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/cp7")).should(
      "have.text",
      "Hidden paragraph with hidden text: ",
    );
    cy.get(cesc("#\\/cp8")).should(
      "have.text",
      "Hidden paragraph with hidden text: ",
    );
  });

  it("collecting from within a hidden section", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <section hide>
      <p name="theP1" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
      <copy source="theP1" assignNames="theP2" />
      <p hide name="theP3" newNamespace>Hidden paragraph with hidden text: <text name="hidden" hide>top secret</text></p>
      <copy source="theP3" assignNames="theP4" />
    </section>
    <collect componentTypes="p" source="_section1" assignNames="cp1 cp2 cp3 cp4" />
    <collect componentTypes="p" source="_section1" hide="false" assignNames="cp5 cp6 cp7 cp8" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");
    cy.get(cesc("#\\/theP1")).should("not.exist");
    cy.get(cesc("#\\/theP2")).should("not.exist");
    cy.get(cesc("#\\/theP3")).should("not.exist");
    cy.get(cesc("#\\/theP4")).should("not.exist");
    cy.get(cesc("#\\/cp1")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/cp2")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/cp3")).should("not.exist");
    cy.get(cesc("#\\/cp4")).should("not.exist");
    cy.get(cesc("#\\/cp5")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/cp6")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/cp7")).should(
      "have.text",
      "Hidden paragraph with hidden text: ",
    );
    cy.get(cesc("#\\/cp8")).should(
      "have.text",
      "Hidden paragraph with hidden text: ",
    );
  });

  it("copies hide dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>
      <map>
        <template><text>Hello, $l! </text></template>
        <sources alias="l"><sequence type="letters" from="a" length="$n" /></sources>
      </map>
    </p>

    <booleaninput name='h1' prefill="false" >
      <label>Hide first collect</label>
    </booleaninput>
    <booleaninput name='h2' prefill="true" >
      <label>Hide second collect</label>
    </booleaninput>
    <p>Number of points <mathinput name="n" prefill="4" /></p>

    <p name="c1">collect 1: <collect hide="$h1" componentTypes="text" source="_p1" /></p>
    <p name="c2">collect 2: <collect hide="$h2" componentTypes="text" prop="value" source="_p1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/c1")).should(
      "have.text",
      "collect 1: Hello, a! Hello, b! Hello, c! Hello, d! ",
    );
    cy.get(cesc("#\\/c2")).should("have.text", "collect 2: ");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}6{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/c1")).should(
      "have.text",
      "collect 1: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! ",
    );
    cy.get(cesc("#\\/c2")).should("have.text", "collect 2: ");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();

    cy.get(cesc("#\\/c1")).should("have.text", "collect 1: ");
    cy.get(cesc("#\\/c2")).should(
      "have.text",
      "collect 2: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! ",
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}8{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/c1")).should("have.text", "collect 1: ");
    cy.get(cesc("#\\/c2")).should(
      "have.text",
      "collect 2: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! Hello, g! Hello, h! ",
    );

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();

    cy.get(cesc("#\\/c1")).should(
      "have.text",
      "collect 1: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! Hello, g! Hello, h! ",
    );
    cy.get(cesc("#\\/c2")).should("have.text", "collect 2: ");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/c1")).should(
      "have.text",
      "collect 1: Hello, a! Hello, b! Hello, c! ",
    );
    cy.get(cesc("#\\/c2")).should("have.text", "collect 2: ");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();

    cy.get(cesc("#\\/c1")).should("have.text", "collect 1: ");
    cy.get(cesc("#\\/c2")).should(
      "have.text",
      "collect 2: Hello, a! Hello, b! Hello, c! ",
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/c1")).should("have.text", "collect 1: ");
    cy.get(cesc("#\\/c2")).should(
      "have.text",
      "collect 2: Hello, a! Hello, b! Hello, c! Hello, d! ",
    );
  });

  // Not sure how to test with with core a web worker
  it.skip("allChildrenOrdered consistent with dynamic collect and adapters", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="2" name='n' />

    <p>
      begin
      <point name="A">(1,2)</point>
      <map>
        <template><point>($x, $i)</point></template>
        <sources alias="x" indexAlias="i"><sequence length="$n" /></sources>
      </map>
      <point name="B">(3,4)</point>
      end
    </p>
    
    <p>Hello <collect componentTypes="point" source="_p1" /> there</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    function checkAllChildren(stateVariables) {
      let p1AllChildren = [];
      p1AllChildren.push("/A");
      p1AllChildren.push(stateVariables["/A"].adapterUsed.componentName);
      p1AllChildren.push("/_map1");

      let map = stateVariables["/_map1"];

      let nActiveReps = map.replacements.length;
      if (map.replacementsToWithhold) {
        nActiveReps -= stateVariables["/_map1"].replacementsToWithhold;
      }
      for (let template of map.replacements.slice(0, nActiveReps)) {
        p1AllChildren.push(template.componentName);
        let point = template.replacements[0];
        p1AllChildren.push(point.componentName);
        p1AllChildren.push(point.adapterUsed.componentName);
      }
      p1AllChildren.push("/B");
      p1AllChildren.push(stateVariables["/B"].adapterUsed.componentName);

      expect(stateVariables["/_p1"].allChildrenOrdered).eqls(p1AllChildren);

      let p2AllChildren = [];
      p2AllChildren.push("/_collect1");
      let collect = stateVariables["/_collect1"];
      nActiveReps = collect.replacements.length;
      if (collect.replacementsToWithhold) {
        nActiveReps -= stateVariables["/_collect1"].replacementsToWithhold;
      }
      for (let rep of collect.replacements.slice(0, nActiveReps)) {
        p2AllChildren.push(rep.componentName);
        p2AllChildren.push(rep.adapterUsed.componentName);
      }

      expect(stateVariables["/_p2"].allChildrenOrdered).eqls(p2AllChildren);
    }

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkAllChildren(stateVariables);
    });

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkAllChildren(stateVariables);
    });

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkAllChildren(stateVariables);
    });

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkAllChildren(stateVariables);
    });

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkAllChildren(stateVariables);
    });
  });

  it("overwrite attributes using collect", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>Collected points are fixed: <booleaninput name="fixed" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g2">
      <collect componentTypes="point" source="g1" fixed="$fixed" assignNames="A2 B2" />
    </graph>
    
    <copy source="g2" name="g3" newNamespace />

    <aslist name="al"><collect componentTypes="point" prop="x" source="g1" fixed="$fixed" assignNames="Ax Bx" /></aslist>

    <copy source="al" name="al2" newNamespace />

    <copy prop="fixed" source="A2" assignNames="A2fixed" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.fixed).eq(false);
      expect(stateVariables["/B"].stateValues.fixed).eq(false);
      expect(stateVariables["/A2"].stateValues.fixed).eq(false);
      expect(stateVariables["/B2"].stateValues.fixed).eq(false);
      expect(stateVariables["/g3/A2"].stateValues.fixed).eq(false);
      expect(stateVariables["/g3/B2"].stateValues.fixed).eq(false);
      expect(stateVariables["/Ax"].stateValues.fixed).eq(false);
      expect(stateVariables["/Bx"].stateValues.fixed).eq(false);
      expect(stateVariables["/al2/Ax"].stateValues.fixed).eq(false);
      expect(stateVariables["/al2/Bx"].stateValues.fixed).eq(false);
    });

    cy.get(cesc("#\\/fixed")).click();

    cy.get(cesc("#\\/A2fixed")).should("have.text", "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.fixed).eq(false);
      expect(stateVariables["/B"].stateValues.fixed).eq(false);
      expect(stateVariables["/A2"].stateValues.fixed).eq(true);
      expect(stateVariables["/B2"].stateValues.fixed).eq(true);
      expect(stateVariables["/g3/A2"].stateValues.fixed).eq(true);
      expect(stateVariables["/g3/B2"].stateValues.fixed).eq(true);
      expect(stateVariables["/Ax"].stateValues.fixed).eq(true);
      expect(stateVariables["/Bx"].stateValues.fixed).eq(true);
      expect(stateVariables["/al2/Ax"].stateValues.fixed).eq(true);
      expect(stateVariables["/al2/Bx"].stateValues.fixed).eq(true);
    });

    cy.get(cesc("#\\/fixed")).click();

    cy.get(cesc("#\\/A2fixed")).should("have.text", "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.fixed).eq(false);
      expect(stateVariables["/B"].stateValues.fixed).eq(false);
      expect(stateVariables["/A2"].stateValues.fixed).eq(false);
      expect(stateVariables["/B2"].stateValues.fixed).eq(false);
      expect(stateVariables["/g3/A2"].stateValues.fixed).eq(false);
      expect(stateVariables["/g3/B2"].stateValues.fixed).eq(false);
      expect(stateVariables["/Ax"].stateValues.fixed).eq(false);
      expect(stateVariables["/Bx"].stateValues.fixed).eq(false);
      expect(stateVariables["/al2/Ax"].stateValues.fixed).eq(false);
      expect(stateVariables["/al2/Bx"].stateValues.fixed).eq(false);
    });
  });

  it("collect componentIndex", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>n: <mathinput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g2">
      <collect componentTypes="point" source="g1" assignNames="A2 B2" componentIndex="$n" />
    </graph>
    
    <copy source="g2" name="g3" newNamespace />

    <aslist name="al"><collect componentTypes="point" prop="x" source="g1" componentIndex="$n" assignNames="Ax Bx" /></aslist>

    <copy source="al" name="al2" newNamespace />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 1,
      y1 = 2,
      x2 = 3,
      y2 = 4;

    cy.get(cesc("#\\/Ax") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/Ax") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/Bx") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/Bx") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/A2"]).eq(undefined);
      expect(stateVariables["/g3/A2"]).eq(undefined);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/B2"]).eq(undefined);
      expect(stateVariables["/g3/B2"]).eq(undefined);
      expect(stateVariables["/Ax"]).eq(undefined);
      expect(stateVariables["/al2/Ax"]).eq(undefined);
      expect(stateVariables["/Bx"]).eq(undefined);
      expect(stateVariables["/al2/Bx"]).eq(undefined);
    });

    cy.log("restrict collection to first component");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc("#\\/Bx") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/Bx") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/Ax") + " .mjx-mrow").should("contain.text", nInDOM(x1));
    cy.get(cesc("#\\/al2\\/Ax") + " .mjx-mrow").should(
      "contain.text",
      nInDOM(x1),
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/B2"]).eq(undefined);
      expect(stateVariables["/g3/B2"]).eq(undefined);
      expect(stateVariables["/Ax"].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      expect(stateVariables["/Bx"]).eq(undefined);
      expect(stateVariables["/al2/Bx"]).eq(undefined);
    });

    cy.log("move copied point");
    cy.window().then(async (win) => {
      (x1 = 9), (y1 = -5);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: x1, y: y1 },
      });

      cy.get(cesc("#\\/Bx") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/Bx") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/Ax") + " .mjx-mrow").should("contain.text", nInDOM(x1));
      cy.get(cesc("#\\/al2\\/Ax") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x1),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/A2"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/B2"]).eq(undefined);
        expect(stateVariables["/g3/B2"]).eq(undefined);
        expect(stateVariables["/Ax"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
        expect(stateVariables["/Bx"]).eq(undefined);
        expect(stateVariables["/al2/Bx"]).eq(undefined);
      });
    });

    cy.log("restrict collection to second component");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/Bx") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/Bx") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/Ax") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/Ax") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/B2"]).eq(undefined);
        expect(stateVariables["/g3/B2"]).eq(undefined);
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/Bx"]).eq(undefined);
        expect(stateVariables["/al2/Bx"]).eq(undefined);
      });
    });

    cy.log("move double copied point");
    cy.window().then(async (win) => {
      (x2 = 0), (y2 = 8);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A2",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/Bx") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/Bx") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/Ax") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/Ax") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/B2"]).eq(undefined);
        expect(stateVariables["/g3/B2"]).eq(undefined);
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/Bx"]).eq(undefined);
        expect(stateVariables["/al2/Bx"]).eq(undefined);
      });
    });
  });

  it("collect propIndex and componentIndex", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>m: <mathinput name="m" /></p>
    <p>n: <mathinput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <p><aslist name="al"><collect componentTypes="point" prop="xs" source="g1" componentIndex="$m" propIndex="$n" assignNames="n1 n2 n3 n4" /></aslist></p>

    <p><copy source="al" name="al2" newNamespace /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 1,
      y1 = 2,
      x2 = 3,
      y2 = 4;

    cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/n1"]).eq(undefined);
      expect(stateVariables["/n2"]).eq(undefined);
      expect(stateVariables["/n3"]).eq(undefined);
      expect(stateVariables["/n4"]).eq(undefined);
      expect(stateVariables["/al2/n1"]).eq(undefined);
      expect(stateVariables["/al2/n2"]).eq(undefined);
      expect(stateVariables["/al2/n3"]).eq(undefined);
      expect(stateVariables["/al2/n4"]).eq(undefined);
    });

    cy.log("set propIndex to 1");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/n1"]).eq(undefined);
      expect(stateVariables["/n2"]).eq(undefined);
      expect(stateVariables["/n3"]).eq(undefined);
      expect(stateVariables["/n4"]).eq(undefined);
      expect(stateVariables["/al2/n1"]).eq(undefined);
      expect(stateVariables["/al2/n2"]).eq(undefined);
      expect(stateVariables["/al2/n3"]).eq(undefined);
      expect(stateVariables["/al2/n4"]).eq(undefined);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      (x1 = 9), (y1 = -5);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: x1, y: y1 },
      });

      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/n2"]).eq(undefined);
        expect(stateVariables["/n3"]).eq(undefined);
        expect(stateVariables["/n4"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
        expect(stateVariables["/al2/n2"]).eq(undefined);
        expect(stateVariables["/al2/n3"]).eq(undefined);
        expect(stateVariables["/al2/n4"]).eq(undefined);
      });
    });

    cy.log("set componentIndex to 2");

    cy.get(cesc("#\\/m") + " textarea").type("2{enter}", { force: true });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/n2"]).eq(undefined);
        expect(stateVariables["/n3"]).eq(undefined);
        expect(stateVariables["/n4"]).eq(undefined);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n2"]).eq(undefined);
        expect(stateVariables["/al2/n3"]).eq(undefined);
        expect(stateVariables["/al2/n4"]).eq(undefined);
      });
    });

    cy.log("move point2");
    cy.window().then(async (win) => {
      (x2 = 0), (y2 = 8);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/n2"]).eq(undefined);
        expect(stateVariables["/n3"]).eq(undefined);
        expect(stateVariables["/n4"]).eq(undefined);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n2"]).eq(undefined);
        expect(stateVariables["/al2/n3"]).eq(undefined);
        expect(stateVariables["/al2/n4"]).eq(undefined);
      });
    });

    cy.log("set propIndex to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y2));
      cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y2),
      );
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y2);
        expect(stateVariables["/n2"]).eq(undefined);
        expect(stateVariables["/n3"]).eq(undefined);
        expect(stateVariables["/n4"]).eq(undefined);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y2);
        expect(stateVariables["/al2/n2"]).eq(undefined);
        expect(stateVariables["/al2/n3"]).eq(undefined);
        expect(stateVariables["/al2/n4"]).eq(undefined);
      });
    });

    cy.log("set componentIndex to 1");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y1));
      cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y1),
      );
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y1);
        expect(stateVariables["/n2"]).eq(undefined);
        expect(stateVariables["/n3"]).eq(undefined);
        expect(stateVariables["/n4"]).eq(undefined);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y1);
        expect(stateVariables["/al2/n2"]).eq(undefined);
        expect(stateVariables["/al2/n3"]).eq(undefined);
        expect(stateVariables["/al2/n4"]).eq(undefined);
      });
    });

    cy.log("set propIndex to 3");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/n2"]).eq(undefined);
        expect(stateVariables["/n3"]).eq(undefined);
        expect(stateVariables["/n4"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
        expect(stateVariables["/al2/n2"]).eq(undefined);
        expect(stateVariables["/al2/n3"]).eq(undefined);
        expect(stateVariables["/al2/n4"]).eq(undefined);
      });
    });

    cy.log("set propIndex to 1");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x1));
      cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x1),
      );
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x1);
        expect(stateVariables["/n2"]).eq(undefined);
        expect(stateVariables["/n3"]).eq(undefined);
        expect(stateVariables["/n4"]).eq(undefined);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/n2"]).eq(undefined);
        expect(stateVariables["/al2/n3"]).eq(undefined);
        expect(stateVariables["/al2/n4"]).eq(undefined);
      });
    });

    cy.log("set componentIndex to 3");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/n2"]).eq(undefined);
        expect(stateVariables["/n3"]).eq(undefined);
        expect(stateVariables["/n4"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
        expect(stateVariables["/al2/n2"]).eq(undefined);
        expect(stateVariables["/al2/n3"]).eq(undefined);
        expect(stateVariables["/al2/n4"]).eq(undefined);
      });
    });

    cy.log("set componentIndex to 2");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/n2"]).eq(undefined);
        expect(stateVariables["/n3"]).eq(undefined);
        expect(stateVariables["/n4"]).eq(undefined);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n2"]).eq(undefined);
        expect(stateVariables["/al2/n3"]).eq(undefined);
        expect(stateVariables["/al2/n4"]).eq(undefined);
      });
    });

    cy.log("clear propIndex");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/n4") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n3") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n4") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/n2"]).eq(undefined);
        expect(stateVariables["/n3"]).eq(undefined);
        expect(stateVariables["/n4"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
        expect(stateVariables["/al2/n2"]).eq(undefined);
        expect(stateVariables["/al2/n3"]).eq(undefined);
        expect(stateVariables["/al2/n4"]).eq(undefined);
      });
    });
  });

  it("collect prop is case insensitive", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,5)</point>
    </graph>

    <graph>
      <copy source="_point1" assignNames="p1a" />
      <point>(4,2)</point>
      <point>
        (<copy prop="y" source="_point2" />,
        <copy prop="x" source="_point2" />)
      </point>
    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" name="points" source="_panel1" assignNames="q1 q2 q3 q4 q5" />
    </graph>

    <p>Coordinates of points: <collect componentTypes="point" prop="CoOrDS" name="coords" source="_panel1" assignNames="c1 c2 c3 c4 c5" /></p>
    <p><m>x</m>-coordinates of points: <aslist><collect componentTypes="point" prop="X" name="xs" source="_graph3" assignNames="x1 x2 x3 x4 x5" /></aslist></p>
    <p><m>x</m>-coordinates of points via a copy: <aslist><copy name="xs2" source="xs" assignNames="xc1 xc2 xc3 xc4 xc5" /></aslist></p>
    <p><m>x</m>-coordinates of points via extract: <aslist><extract prop="X" name="xs3" assignNames="xe1 xe2 xe3 xe4 xe5" ><copy name="points2" source="points" assignNames="qa1 qa2 qa3 qa4 qa5" /></extract></aslist></p>
    <p>Average of <m>y</m>-coordinates of points: <mean name="mean"><collect componentTypes="point" prop="Y" name="ys" source="_graph3" assignNames="y1 y2 y3 y4 y5" /></mean></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = -3,
      y1 = 1;
    let x2 = -7,
      y2 = 5;
    let x3 = 4,
      y3 = 2;

    let coords1Text = ("(" + x1 + "," + y1 + ")").replace(/-/g, "−");
    let coords2Text = ("(" + x2 + "," + y2 + ")").replace(/-/g, "−");
    let coords3Text = ("(" + x3 + "," + y3 + ")").replace(/-/g, "−");
    let coords2tText = ("(" + y2 + "," + x2 + ")").replace(/-/g, "−");

    let meany = (y1 + y2 + y1 + y3 + x2) / 5;

    cy.get(cesc("#\\/c1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(coords1Text);
      });
    cy.get(cesc("#\\/c2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(coords2Text);
      });
    cy.get(cesc("#\\/c3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(coords1Text);
      });
    cy.get(cesc("#\\/c4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(coords3Text);
      });
    cy.get(cesc("#\\/c5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(coords2tText);
      });

    cy.get(cesc("#\\/x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x2).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/x4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x3).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/x5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(y2).replace(/-/, "−"));
      });

    cy.get(cesc("#\\/xc1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xc2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x2).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xc3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xc4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x3).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xc5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(y2).replace(/-/, "−"));
      });

    cy.get(cesc("#\\/xe1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xe2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x2).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xe3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x1).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xe4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(x3).replace(/-/, "−"));
      });
    cy.get(cesc("#\\/xe5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(y2).replace(/-/, "−"));
      });

    cy.get(cesc("#\\/mean"))
      .find(".mjx-mrow")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(String(meany).replace(/-/, "−"));
      });

    cy.window().then(async (win) => {
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      let stateVariables = await win.returnAllStateVariables1();
      for (let i = 0; i < 5; i++) {
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[0]).eq(xs[i]);
        expect(stateVariables[`/q${i + 1}`].stateValues.xs[1]).eq(ys[i]);
        expect(stateVariables[`/qa${i + 1}`].stateValues.xs[0]).eq(xs[i]);
        expect(stateVariables[`/qa${i + 1}`].stateValues.xs[1]).eq(ys[i]);
        expect(stateVariables[`/c${i + 1}`].stateValues.value).eqls([
          "vector",
          xs[i],
          ys[i],
        ]);
        expect(stateVariables[`/x${i + 1}`].stateValues.value).eq(xs[i]);
        expect(stateVariables[`/xc${i + 1}`].stateValues.value).eq(xs[i]);
        expect(stateVariables[`/xe${i + 1}`].stateValues.value).eq(xs[i]);
        expect(stateVariables[`/y${i + 1}`].stateValues.value).eq(ys[i]);
      }
      expect(stateVariables["/mean"].stateValues.value).eq(meany);
    });
  });
});
