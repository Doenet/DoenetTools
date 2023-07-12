import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

async function testLineCopiedTwice({
  x1,
  y1,
  x2,
  y2,
  lineName = "/l",
  point1Name = "/A",
  point2Name = "/B",
  graph1Name = "/g1",
  graph2Name = "/g2",
  graph3Name = "/g3",
  point1InDomName = "/p1",
  point2InDomName = "/p2",
}) {
  cy.get(`#${cesc2(point1InDomName)} .mjx-mrow`).should(
    "contain.text",
    `(${nInDOM(x1)},${nInDOM(y1)})`,
  );
  cy.get(`#${cesc2(point2InDomName)} .mjx-mrow`).should(
    "contain.text",
    `(${nInDOM(x2)},${nInDOM(y2)})`,
  );

  cy.window().then(async (win) => {
    let stateVariables = await win.returnAllStateVariables1();
    expect(stateVariables[graph1Name + lineName].stateValues.points[0]).eqls([
      x1,
      y1,
    ]);
    expect(stateVariables[graph1Name + lineName].stateValues.points[1]).eqls([
      x2,
      y2,
    ]);
    expect(stateVariables[graph2Name + lineName].stateValues.points[0]).eqls([
      x1,
      y1,
    ]);
    expect(stateVariables[graph2Name + lineName].stateValues.points[1]).eqls([
      x2,
      y2,
    ]);
    expect(stateVariables[graph3Name + lineName].stateValues.points[0]).eqls([
      x1,
      y1,
    ]);
    expect(stateVariables[graph3Name + lineName].stateValues.points[1]).eqls([
      x2,
      y2,
    ]);
    expect(stateVariables[graph1Name + point1Name].stateValues.coords).eqls([
      "vector",
      x1,
      y1,
    ]);
    expect(stateVariables[graph1Name + point2Name].stateValues.coords).eqls([
      "vector",
      x2,
      y2,
    ]);
    expect(stateVariables[graph2Name + point1Name].stateValues.coords).eqls([
      "vector",
      x1,
      y1,
    ]);
    expect(stateVariables[graph2Name + point2Name].stateValues.coords).eqls([
      "vector",
      x2,
      y2,
    ]);
    expect(stateVariables[graph3Name + point1Name].stateValues.coords).eqls([
      "vector",
      x1,
      y1,
    ]);
    expect(stateVariables[graph3Name + point2Name].stateValues.coords).eqls([
      "vector",
      x2,
      y2,
    ]);
  });
}

async function testLineCopiedTwiceBaseOnSlope({
  x1,
  y1,
  x2,
  y2,
  slope,
  lineName = "/l",
  point1Name = "/A",
  point2Name = "/B",
  graph1Name = "/g1",
  graph2Name = "/g2",
  graph3Name = "/g3",
  point1InDomName = "/p1",
  point2InDomName = "/p2",
}) {
  cy.get(`#${cesc2(point1InDomName)} .mjx-mrow`).should(
    "contain.text",
    `(${nInDOM(x1).substring(0, 2)}`,
  );
  cy.get(`#${cesc2(point1InDomName)} .mjx-mrow`).should(
    "contain.text",
    `,${nInDOM(y1).substring(0, 2)}`,
  );
  cy.get(`#${cesc2(point2InDomName)} .mjx-mrow`).should(
    "contain.text",
    `(${nInDOM(x2).substring(0, 2)}`,
  );
  cy.get(`#${cesc2(point2InDomName)} .mjx-mrow`).should(
    "contain.text",
    `,${nInDOM(y2).substring(0, 2)}`,
  );

  cy.window().then(async (win) => {
    let stateVariables = await win.returnAllStateVariables1();
    expect(
      me
        .fromAst(stateVariables[graph1Name + lineName].stateValues.points[0][0])
        .evaluate_to_constant(),
    ).closeTo(x1, 1e-12);
    expect(
      me
        .fromAst(stateVariables[graph1Name + lineName].stateValues.points[0][1])
        .evaluate_to_constant(),
    ).closeTo(y1, 1e-12);
    expect(
      me
        .fromAst(stateVariables[graph1Name + lineName].stateValues.points[1][0])
        .evaluate_to_constant(),
    ).closeTo(x2, 1e-12);
    expect(
      me
        .fromAst(stateVariables[graph1Name + lineName].stateValues.points[1][1])
        .evaluate_to_constant(),
    ).closeTo(y2, 1e-12);
    expect(
      me
        .fromAst(stateVariables[graph2Name + lineName].stateValues.points[0][0])
        .evaluate_to_constant(),
    ).closeTo(x1, 1e-12);
    expect(
      me
        .fromAst(stateVariables[graph2Name + lineName].stateValues.points[0][1])
        .evaluate_to_constant(),
    ).closeTo(y1, 1e-12);
    expect(
      me
        .fromAst(stateVariables[graph2Name + lineName].stateValues.points[1][0])
        .evaluate_to_constant(),
    ).closeTo(x2, 1e-12);
    expect(
      me
        .fromAst(stateVariables[graph2Name + lineName].stateValues.points[1][1])
        .evaluate_to_constant(),
    ).closeTo(y2, 1e-12);
    expect(
      me
        .fromAst(stateVariables[graph3Name + lineName].stateValues.points[0][0])
        .evaluate_to_constant(),
    ).closeTo(x1, 1e-12);
    expect(
      me
        .fromAst(stateVariables[graph3Name + lineName].stateValues.points[0][1])
        .evaluate_to_constant(),
    ).closeTo(y1, 1e-12);
    expect(
      me
        .fromAst(stateVariables[graph3Name + lineName].stateValues.points[1][0])
        .evaluate_to_constant(),
    ).closeTo(x2, 1e-12);
    expect(
      me
        .fromAst(stateVariables[graph3Name + lineName].stateValues.points[1][1])
        .evaluate_to_constant(),
    ).closeTo(y2, 1e-12);

    if (Number.isFinite(slope)) {
      expect(
        me
          .fromAst(stateVariables[graph1Name + lineName].stateValues.slope)
          .evaluate_to_constant(),
      ).closeTo(slope, 1e-12);
      expect(
        me
          .fromAst(stateVariables[graph2Name + lineName].stateValues.slope)
          .evaluate_to_constant(),
      ).closeTo(slope, 1e-12);
      expect(
        me
          .fromAst(stateVariables[graph3Name + lineName].stateValues.slope)
          .evaluate_to_constant(),
      ).closeTo(slope, 1e-12);
    } else {
      expect(stateVariables[graph1Name + lineName].stateValues.slope).eq(slope);
      expect(stateVariables[graph2Name + lineName].stateValues.slope).eq(slope);
      expect(stateVariables[graph3Name + lineName].stateValues.slope).eq(slope);
    }

    expect(stateVariables[graph1Name + point1Name].stateValues.xs[0]).closeTo(
      x1,
      1e-12,
    );
    expect(stateVariables[graph1Name + point1Name].stateValues.xs[1]).closeTo(
      y1,
      1e-12,
    );
    expect(stateVariables[graph1Name + point2Name].stateValues.xs[0]).closeTo(
      x2,
      1e-12,
    );
    expect(stateVariables[graph1Name + point2Name].stateValues.xs[1]).closeTo(
      y2,
      1e-12,
    );
    expect(stateVariables[graph2Name + point1Name].stateValues.xs[0]).closeTo(
      x1,
      1e-12,
    );
    expect(stateVariables[graph2Name + point1Name].stateValues.xs[1]).closeTo(
      y1,
      1e-12,
    );
    expect(stateVariables[graph2Name + point2Name].stateValues.xs[0]).closeTo(
      x2,
      1e-12,
    );
    expect(stateVariables[graph2Name + point2Name].stateValues.xs[1]).closeTo(
      y2,
      1e-12,
    );
    expect(stateVariables[graph3Name + point1Name].stateValues.xs[0]).closeTo(
      x1,
      1e-12,
    );
    expect(stateVariables[graph3Name + point1Name].stateValues.xs[1]).closeTo(
      y1,
      1e-12,
    );
    expect(stateVariables[graph3Name + point2Name].stateValues.xs[0]).closeTo(
      x2,
      1e-12,
    );
    expect(stateVariables[graph3Name + point2Name].stateValues.xs[1]).closeTo(
      y2,
      1e-12,
    );
  });
}

describe("Line Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("move points copied by line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point><label>P</label>(3,5)</point>
  <point><label>Q</label>(-4,-1)</point>
    <line through="$_point1 $_point2 "/>
  </graph>
  $_point1{name="p1a"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/p1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(3)},${nInDOM(5)})`,
    );

    cy.log("move point P to (5,-5)");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 5, y: -5 },
      });
    });

    cy.get(cesc("#\\/p1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(5)},${nInDOM(-5)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-5);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        5,
        -5,
      ]);
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(-4);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        -4,
        -1,
      ]);
    });
  });

  it("through = string of points, label child", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line through="(1,2) (4,7)" ><label>l</label></line>
  </graph>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("points are where they should be");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p1"].stateValues.coords).eqls(["vector", 1, 2]);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(4);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(7);
      expect(stateVariables["/p2"].stateValues.coords).eqls(["vector", 4, 7]);

      expect(stateVariables["/_line1"].stateValues.label).eq("l");
      expect(stateVariables["/_line1"].stateValues.slope).eqls(["/", 5, 3]);
    });
  });

  it("through = points from strings and maths, labelIsName", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <math>1</math>
  <math>2</math>
  <graph>
    <line name='l' labelIsName through="($_math1, $_math2) (4,7) " />
  </graph>
  $l.point1{assignNames="p1"}
  $l.point2{assignNames="p2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p1"].stateValues.coords).eqls(["vector", 1, 2]);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(4);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(7);
      expect(stateVariables["/p2"].stateValues.coords).eqls(["vector", 4, 7]);

      expect(stateVariables["/l"].stateValues.label).eq("l");
      expect(stateVariables["/l"].stateValues.slope).eqls(["/", 5, 3]);
    });
  });

  it("through = maths for points, label child", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <math>(1,2)</math>
  <math>(4,7)</math>
  <graph>
    <line through="$_math1 $_math2" ><label>l</label></line>
  </graph>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("points are where they should be");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p1"].stateValues.coords).eqls(["vector", 1, 2]);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(4);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(7);
      expect(stateVariables["/p2"].stateValues.coords).eqls(["vector", 4, 7]);

      expect(stateVariables["/_line1"].stateValues.label).eq("l");
      expect(stateVariables["/_line1"].stateValues.slope).eqls(["/", 5, 3]);
    });
  });

  it("line from sugared equation, single string", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line>
      5x-2y=3
    </line>
  </graph>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should("be.visible"); // to make sure MathJax rendered

    cy.log("equation is what it should be");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("5x-2y=3"))).to.be.true;
    });

    cy.log("Move line right 1 and down 3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_line1"].stateValues.points[0][0],
        stateVariables["/_line1"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line1"].stateValues.points[1][0],
        stateVariables["/_line1"].stateValues.points[1][1],
      ];

      let moveX = 1;
      let moveY = -3;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let newEquation = me.fromText("5x-2y=3").substitute({
          x: ["+", "x", -moveX],
          y: ["+", "y", -moveY],
        });

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(
          stateVariables["/_line1"].stateValues.equation,
        );
        expect(unproxiedEquation.equals(newEquation)).to.be.true;
      });
    });
  });

  it("line from sugared equation, single string, label as math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line>
      5x-2y=3
      <label>slope = $_line1.slope</label>
    </line>
  </graph>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should("be.visible"); // to make sure MathJax rendered

    cy.log("equation is what it should be");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("5x-2y=3"))).to.be.true;
      expect(stateVariables["/_line1"].stateValues.label).eq(
        "slope = \\(\\frac{5}{2}\\)",
      );
    });

    cy.log("Move line right 1 and down 3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_line1"].stateValues.points[0][0],
        stateVariables["/_line1"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line1"].stateValues.points[1][0],
        stateVariables["/_line1"].stateValues.points[1][1],
      ];

      let moveX = 1;
      let moveY = -3;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let newEquation = me.fromText("5x-2y=3").substitute({
          x: ["+", "x", -moveX],
          y: ["+", "y", -moveY],
        });

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(
          stateVariables["/_line1"].stateValues.equation,
        );
        expect(unproxiedEquation.equals(newEquation)).to.be.true;
        expect(stateVariables["/_line1"].stateValues.label).eq(
          "slope = \\(\\frac{5}{2}\\)",
        );
      });
    });
  });

  it("line from sugared equation, strings and macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line>
      $a x + $b y=$c
    </line>
  </graph>
  <math name="a">5</math>
  <number name="b">-2</number>
  <number name="c">3</number>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("equation is what it should be");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("5x-2y=3"))).to.be.true;
    });

    // Note: not yet able to move a line with equation depending on copies
  });

  it("line from sugared equation, strings and macros, label as math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line>
      <label>slope = $_line1.slope</label>
      $a x + $b y=$c
    </line>
  </graph>
  <math name="a">5</math>
  <number name="b">-2</number>
  <number name="c">3</number>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("equation is what it should be");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("5x-2y=3"))).to.be.true;
      expect(stateVariables["/_line1"].stateValues.label).eq(
        "slope = \\(\\frac{5}{2}\\)",
      );
    });

    // Note: not yet able to move a line with equation depending on copies
  });

  it("line from sugared equation, strings, numbers and maths", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line>
      <math>5</math> x + <number>-2</number>y=<number>3</number>
    </line>
  </graph>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("equation is what it should be");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("5x-2y=3"))).to.be.true;
    });

    // Note: not yet able to move a line with equation depending on components
  });

  it("line from unsugared equation, single string", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <math>1</math>
  <graph>
    <line equation="5x-2y=3" />
  </graph>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.log("equation is what it should be");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("5x-2y=3"))).to.be.true;
    });

    cy.log("Move line right 1 and down 3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_line1"].stateValues.points[0][0],
        stateVariables["/_line1"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line1"].stateValues.points[1][0],
        stateVariables["/_line1"].stateValues.points[1][1],
      ];

      let moveX = 1;
      let moveY = -3;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let newEquation = me.fromText("5x-2y=3").substitute({
          x: ["+", "x", -moveX],
          y: ["+", "y", -moveY],
        });

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(
          stateVariables["/_line1"].stateValues.equation,
        );
        expect(unproxiedEquation.equals(newEquation)).to.be.true;
      });
    });
  });

  it("line from unsugared equation, single string, label as math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <math>1</math>
  <graph>
    <line equation="5x-2y=3" >
      <label>slope = $_line1.slope</label>
    </line>
  </graph>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.log("equation is what it should be");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("5x-2y=3"))).to.be.true;
      expect(stateVariables["/_line1"].stateValues.label).eq(
        "slope = \\(\\frac{5}{2}\\)",
      );
    });

    cy.log("Move line right 1 and down 3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_line1"].stateValues.points[0][0],
        stateVariables["/_line1"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line1"].stateValues.points[1][0],
        stateVariables["/_line1"].stateValues.points[1][1],
      ];

      let moveX = 1;
      let moveY = -3;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let newEquation = me.fromText("5x-2y=3").substitute({
          x: ["+", "x", -moveX],
          y: ["+", "y", -moveY],
        });

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(
          stateVariables["/_line1"].stateValues.equation,
        );
        expect(unproxiedEquation.equals(newEquation)).to.be.true;
        expect(stateVariables["/_line1"].stateValues.label).eq(
          "slope = \\(\\frac{5}{2}\\)",
        );
      });
    });
  });

  it("line from equation, multiple pieces", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <math>5x</math>
  <number>2</number>
  <graph>
    <line equation="$_math1 - $_number1 y = 3" />
  </graph>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5x");
      });

    cy.log("equation is what it should be");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("5x-2y=3"))).to.be.true;
    });
  });

  it("line from equation with different variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line variables="u v">
      5u-2v=3
    </line>
  </graph>
  <p>Variables are $_line1.var1{assignNames="var1"} and $_line1.var2{assignNames="var2"}.</p>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("equation and line variable are what they should be");
    cy.get(cesc("#\\/var1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/var2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("5u-2v=3"))).to.be.true;
      expect(stateVariables["/_line1"].stateValues.var1).eq("u");
      expect(stateVariables["/_line1"].stateValues.var2).eq("v");
      expect(stateVariables["/_line1"].stateValues.coeff0).eq(-3);
      expect(stateVariables["/_line1"].stateValues.coeffvar1).eq(5);
      expect(stateVariables["/_line1"].stateValues.coeffvar2).eq(-2);
      expect(stateVariables["/_line1"].stateValues.slope).eqls(["/", 5, 2]);
      expect(stateVariables["/_line1"].stateValues.xintercept).eqls([
        "/",
        3,
        5,
      ]);
      expect(stateVariables["/_line1"].stateValues.yintercept).eqls([
        "/",
        -3,
        2,
      ]);
      expect(stateVariables["/var1"].stateValues.value).eq("u");
      expect(stateVariables["/var2"].stateValues.value).eq("v");
    });

    cy.log("Move line right 1 and down 3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_line1"].stateValues.points[0][0],
        stateVariables["/_line1"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line1"].stateValues.points[1][0],
        stateVariables["/_line1"].stateValues.points[1][1],
      ];

      let moveX = 1;
      let moveY = -3;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let newEquation = me.fromText("5u-2v=3").substitute({
          u: ["+", "u", -moveX],
          v: ["+", "v", -moveY],
        });

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(
          stateVariables["/_line1"].stateValues.equation,
        );
        expect(unproxiedEquation.equals(newEquation)).to.be.true;
      });
    });
  });

  it("lines with bad equation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line>/2</line>
    <line>$invalid</line>
    <line equation="" />
    <line equation="/2" />
    <line equation="$invalid" />
  </graph>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_line1"].stateValues.equation).eqls([
        "/",
        "＿",
        2,
      ]);
      expect(stateVariables["/_line1"].stateValues.coeff0).eq("\uff3f");
      expect(stateVariables["/_line1"].stateValues.coeffvar1).eq("\uff3f");
      expect(stateVariables["/_line1"].stateValues.coeffvar2).eq("\uff3f");

      expect(stateVariables["/_line2"].stateValues.equation).eq("\uff3f");
      expect(stateVariables["/_line2"].stateValues.coeff0).eq("\uff3f");
      expect(stateVariables["/_line2"].stateValues.coeffvar1).eq("\uff3f");
      expect(stateVariables["/_line2"].stateValues.coeffvar2).eq("\uff3f");

      expect(stateVariables["/_line3"].stateValues.equation).eq("\uff3f");
      expect(stateVariables["/_line3"].stateValues.coeff0).eq("\uff3f");
      expect(stateVariables["/_line3"].stateValues.coeffvar1).eq("\uff3f");
      expect(stateVariables["/_line3"].stateValues.coeffvar2).eq("\uff3f");

      expect(stateVariables["/_line4"].stateValues.equation).eqls([
        "/",
        "＿",
        2,
      ]);
      expect(stateVariables["/_line4"].stateValues.coeff0).eq("\uff3f");
      expect(stateVariables["/_line4"].stateValues.coeffvar1).eq("\uff3f");
      expect(stateVariables["/_line4"].stateValues.coeffvar2).eq("\uff3f");

      expect(stateVariables["/_line5"].stateValues.equation).eq("\uff3f");
      expect(stateVariables["/_line5"].stateValues.coeff0).eq("\uff3f");
      expect(stateVariables["/_line5"].stateValues.coeffvar1).eq("\uff3f");
      expect(stateVariables["/_line5"].stateValues.coeffvar2).eq("\uff3f");
    });
  });

  it("line from points with strange constraints", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>

  <point>
  ($_point2.y,
  $a)
  </point>
  <point>(5,3)</point>
  <line through="$_point1 $_point2" />
  </graph>
  <math name="a" hide simplify>$_point2.x+1</math>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let point2x = 5;
    let point2y = 3;
    let a = point2x + 1;
    let point1x = point2y;
    let point1y = a;
    let slope = (point1y - point2y) / (point1x - point2x);
    let yintercept = point2y - slope * point2x;

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(point1x).substring(0, 4)}`,
    );

    cy.log("points and line match constraints");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
        point2x,
        1e-12,
      );
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
        point2y,
        1e-12,
      );

      expect(stateVariables["/a"].stateValues.value).closeTo(a, 1e-12);

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
        point1x,
        1e-12,
      );
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
        point1y,
        1e-12,
      );

      expect(
        me
          .fromAst(stateVariables["/_line1"].stateValues.slope)
          .evaluate_to_constant(),
      ).closeTo(slope, 1e-12);

      expect(
        me
          .fromAst(stateVariables["/_line1"].stateValues.yintercept)
          .evaluate_to_constant(),
      ).closeTo(yintercept, 1e-12);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      point1x = -5;
      point1y = -3;

      a = point1y;
      point2y = point1x;
      point2x = a - 1;

      slope = (point1y - point2y) / (point1x - point2x);
      yintercept = point2y - slope * point2x;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: point1x, y: point1y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1x).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1y).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point2x).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point2y).substring(0, 4)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
          point2x,
          1e-12,
        );
        expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
          point2y,
          1e-12,
        );

        expect(stateVariables["/a"].stateValues.value).closeTo(a, 1e-12);

        expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
          point1x,
          1e-12,
        );
        expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
          point1y,
          1e-12,
        );

        expect(
          me
            .fromAst(stateVariables["/_line1"].stateValues.slope)
            .evaluate_to_constant(),
        ).closeTo(slope, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/_line1"].stateValues.yintercept)
            .evaluate_to_constant(),
        ).closeTo(yintercept, 1e-12);
      });
    });

    // Note: with the new algorithm for preserving the relationship between points
    // when moving the whole line, the below calculations are incorrect.
    // Question: do we want to figure out what the resulting point positions
    // should be with the new algorithm and test that it stays correct?

    // cy.log("move line");
    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();

    //   let point1coords = [
    //     stateVariables["/_line1"].stateValues.points[0][0],
    //     stateVariables["/_line1"].stateValues.points[0][1],
    //   ];
    //   let point2coords = [
    //     stateVariables["/_line1"].stateValues.points[1][0],
    //     stateVariables["/_line1"].stateValues.points[1][1],
    //   ];

    //   let moveX = -5;
    //   let moveY = 12;

    //   point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
    //   point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
    //   point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
    //   point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

    //   win.callAction1({
    //     actionName: "moveLine",
    //     componentName: "/_line1",
    //     args: {
    //       point1coords: point1coords,
    //       point2coords: point2coords,
    //     },
    //   });

    //   // Note: one of two possible scenarios should be true
    //   // and it's not clear if either are preferred, given the strange constraints
    //   // Whether point1 or point2 wins depends on details of update algorithm
    //   // If point2 takes precedence, uncomment the first group of lines
    //   // and comment out the second group of lines

    //   // point2x += moveX;;
    //   // point2y += moveY;
    //   // a = point2x + 1;
    //   // point1x = point2y;
    //   // point1y = a;

    //   point1x += moveX;
    //   point1y += moveY;
    //   a = point1y;
    //   point2y = point1x;
    //   point2x = a - 1;

    //   slope = (point1y - point2y) / (point1x - point2x);
    //   yintercept = point2y - slope * point2x;

    //   cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
    //     "contain.text",
    //     `(${nInDOM(point1x).substring(0, 4)}`,
    //   );
    //   cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
    //     "contain.text",
    //     `,${nInDOM(point1y).substring(0, 4)}`,
    //   );
    //   cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
    //     "contain.text",
    //     `(${nInDOM(point2x).substring(0, 4)}`,
    //   );
    //   cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
    //     "contain.text",
    //     `,${nInDOM(point2y).substring(0, 4)}`,
    //   );

    //   cy.window().then(async (win) => {
    //     let stateVariables = await win.returnAllStateVariables1();

    //     expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
    //       point2x,
    //       1e-12,
    //     );
    //     expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
    //       point2y,
    //       1e-12,
    //     );

    //     expect(stateVariables["/a"].stateValues.value).closeTo(a, 1e-12);

    //     expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
    //       point1x,
    //       1e-12,
    //     );
    //     expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
    //       point1y,
    //       1e-12,
    //     );

    //     expect(
    //       me
    //         .fromAst(stateVariables["/_line1"].stateValues.slope)
    //         .evaluate_to_constant(),
    //     ).closeTo(slope, 1e-12);

    //     expect(
    //       me
    //         .fromAst(stateVariables["/_line1"].stateValues.yintercept)
    //         .evaluate_to_constant(),
    //     ).closeTo(yintercept, 1e-12);
    //   });
    // });
  });

  it("copied line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>(0,0)</point>
  <point>(1,3)</point>
  <line through="$_point1 $_point2" />
  </graph>
  
  <graph>
  $_line1{name="l2"}
  </graph>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("line starts off correctly");

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(0)},${nInDOM(0)}`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        me
          .fromAst(stateVariables["/l2"].stateValues.slope)
          .evaluate_to_constant(),
      ).closeTo(3, 1e-12);
      expect(
        me
          .fromAst(stateVariables["/l2"].stateValues.yintercept)
          .evaluate_to_constant(),
      ).closeTo(0, 1e-12);
    });

    cy.log("move points");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: -3, y: 5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 5, y: 1 },
      });
    });

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(-3)},${nInDOM(5)}`,
    );
    cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(5)},${nInDOM(1)}`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        me
          .fromAst(stateVariables["/l2"].stateValues.slope)
          .evaluate_to_constant(),
      ).closeTo(-0.5, 1e-12);
      expect(
        me
          .fromAst(stateVariables["/l2"].stateValues.yintercept)
          .evaluate_to_constant(),
      ).closeTo(3.5, 1e-12);
    });

    cy.log("move line1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_line1"].stateValues.points[0][0],
        stateVariables["/_line1"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line1"].stateValues.points[1][0],
        stateVariables["/_line1"].stateValues.points[1][1],
      ];

      let moveX = -2;
      let moveY = -1;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 4)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me
            .fromAst(stateVariables["/l2"].stateValues.slope)
            .evaluate_to_constant(),
        ).closeTo(-0.5, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/l2"].stateValues.yintercept)
            .evaluate_to_constant(),
        ).closeTo(1.5, 1e-12);
      });
    });

    cy.log("move line2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_line1"].stateValues.points[0][0],
        stateVariables["/_line1"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line1"].stateValues.points[1][0],
        stateVariables["/_line1"].stateValues.points[1][1],
      ];

      let moveX = -5;
      let moveY = -2;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 4)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          me
            .fromAst(stateVariables["/l2"].stateValues.slope)
            .evaluate_to_constant(),
        ).closeTo(-0.5, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/l2"].stateValues.yintercept)
            .evaluate_to_constant(),
        ).closeTo(-3, 1e-12);
      });
    });
  });

  it("copied line based on equation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <line>
  y = 2x+1
  </line>
  </graph>
  
  <graph>
  $_line1{name="l2"}
  </graph>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("line starts off correctly");

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(-0.8)}`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        me
          .fromAst(stateVariables["/_line1"].stateValues.slope)
          .evaluate_to_constant(),
      ).closeTo(2, 1e-12);
      expect(
        me
          .fromAst(stateVariables["/_line1"].stateValues.yintercept)
          .evaluate_to_constant(),
      ).closeTo(1, 1e-12);
      expect(
        me
          .fromAst(stateVariables["/l2"].stateValues.slope)
          .evaluate_to_constant(),
      ).closeTo(2, 1e-12);
      expect(
        me
          .fromAst(stateVariables["/l2"].stateValues.yintercept)
          .evaluate_to_constant(),
      ).closeTo(1, 1e-12);
    });

    cy.log("move line1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let point1coords = [
        stateVariables["/_line1"].stateValues.points[0][0],
        stateVariables["/_line1"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line1"].stateValues.points[1][0],
        stateVariables["/_line1"].stateValues.points[1][1],
      ];

      let moveX = -2;
      let moveY = -1;

      // 2(x+2)+1-1 = 2x+4

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 4)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          me
            .fromAst(stateVariables["/_line1"].stateValues.slope)
            .evaluate_to_constant(),
        ).closeTo(2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/_line1"].stateValues.yintercept)
            .evaluate_to_constant(),
        ).closeTo(4, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/l2"].stateValues.slope)
            .evaluate_to_constant(),
        ).closeTo(2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/l2"].stateValues.yintercept)
            .evaluate_to_constant(),
        ).closeTo(4, 1e-12);
      });
    });

    cy.log("move line2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_line1"].stateValues.points[0][0],
        stateVariables["/_line1"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line1"].stateValues.points[1][0],
        stateVariables["/_line1"].stateValues.points[1][1],
      ];

      let moveX = -5;
      let moveY = -2;

      // 2(x+5)+4-2 = 2x + 12

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 4)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          me
            .fromAst(stateVariables["/_line1"].stateValues.slope)
            .evaluate_to_constant(),
        ).closeTo(2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/_line1"].stateValues.yintercept)
            .evaluate_to_constant(),
        ).closeTo(12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/l2"].stateValues.slope)
            .evaluate_to_constant(),
        ).closeTo(2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/l2"].stateValues.yintercept)
            .evaluate_to_constant(),
        ).closeTo(12, 1e-12);
      });
    });
  });

  it("copy points of line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <line through="(1,2) (3,4)" />
  </graph>
  <graph>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  </graph>
  <graph>
  $_line1.points{assignNames="p1a p2a"}
  </graph>
  $_line1.point1{assignNames="p1b"}
  $_line1.point2{assignNames="p2b"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let p1x = 1;
      let p1y = 2;
      let p2x = 3;
      let p2y = 4;
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
      expect(stateVariables["/p1a"].stateValues.xs[0]).eq(p1x);
      expect(stateVariables["/p1a"].stateValues.xs[1]).eq(p1y);
      expect(stateVariables["/p2a"].stateValues.xs[0]).eq(p2x);
      expect(stateVariables["/p2a"].stateValues.xs[1]).eq(p2y);
      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p1x)},${nInDOM(p1y)})`,
      );
    });

    cy.log("move first individually copied point");
    cy.window().then(async (win) => {
      let p1x = -2;
      let p1y = -5;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: p1x, y: p1y },
      });

      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p1x)},${nInDOM(p1y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let p2x = 3;
        let p2y = 4;
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2a"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2a"].stateValues.xs[1]).eq(p2y);
      });
    });

    cy.log("move second individually copied point");
    cy.window().then(async (win) => {
      let p2x = 8;
      let p2y = -1;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: p2x, y: p2y },
      });

      cy.get(cesc("#\\/p2b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p2x)},${nInDOM(p2y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let p1x = -2;
        let p1y = -5;
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2a"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2a"].stateValues.xs[1]).eq(p2y);
      });
    });

    cy.log("move second array-copied point");
    cy.window().then(async (win) => {
      let p2x = -6;
      let p2y = 4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2a",
        args: { x: p2x, y: p2y },
      });

      cy.get(cesc("#\\/p2b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p2x)},${nInDOM(p2y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let p1x = -2;
        let p1y = -5;
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2a"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2a"].stateValues.xs[1]).eq(p2y);
      });
    });

    cy.log("move first array-copied point");
    cy.window().then(async (win) => {
      let p1x = 0;
      let p1y = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1a",
        args: { x: p1x, y: p1y },
      });

      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p1x)},${nInDOM(p1y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let p2x = -6;
        let p2y = 4;
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2a"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2a"].stateValues.xs[1]).eq(p2y);
      });
    });

    cy.log("move line up and to the right");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_line1"].stateValues.points[0][0],
        stateVariables["/_line1"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line1"].stateValues.points[1][0],
        stateVariables["/_line1"].stateValues.points[1][1],
      ];

      let moveX = 4;
      let moveY = 2;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 4)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/p1"].stateValues.xs[0]).eq(point1coords[0]);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(point1coords[1]);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(point2coords[0]);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(point2coords[1]);
        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(point1coords[0]);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(point1coords[1]);
        expect(stateVariables["/p2a"].stateValues.xs[0]).eq(point2coords[0]);
        expect(stateVariables["/p2a"].stateValues.xs[1]).eq(point2coords[1]);
      });
    });
  });

  it("new line from copied points of line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <line through="(-1,-2) (-3,-4)" />
  </graph>
  <graph>
  <line through="$(_line1.points)" />
  $_line1.points{assignNames="p1 p2"}
  </graph>
  $_line1.point1{assignNames="p1b"}
  $_line1.point2{assignNames="p2b"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let p1x = -1;
      let p1y = -2;
      let p2x = -3;
      let p2y = -4;
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
      expect(stateVariables["/_line1"].stateValues.points[0]).eqls([p1x, p1y]);
      expect(stateVariables["/_line1"].stateValues.points[1]).eqls([p2x, p2y]);
      expect(stateVariables["/_line2"].stateValues.points[0]).eqls([p1x, p1y]);
      expect(stateVariables["/_line2"].stateValues.points[1]).eqls([p2x, p2y]);
      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p1x)},${nInDOM(p1y)})`,
      );
    });

    cy.log("move first line up and to the right");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_line1"].stateValues.points[0][0],
        stateVariables["/_line1"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line1"].stateValues.points[1][0],
        stateVariables["/_line1"].stateValues.points[1][1],
      ];

      let moveX = 4;
      let moveY = 2;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 4)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let p1x = -1 + moveX;
        let p1y = -2 + moveY;
        let p2x = -3 + moveX;
        let p2y = -4 + moveY;

        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([
          p1x,
          p1y,
        ]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([
          p2x,
          p2y,
        ]);
        expect(stateVariables["/_line2"].stateValues.points[0]).eqls([
          p1x,
          p1y,
        ]);
        expect(stateVariables["/_line2"].stateValues.points[1]).eqls([
          p2x,
          p2y,
        ]);
      });
    });

    cy.log("move second line up and to the left");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_line2"].stateValues.points[0][0],
        stateVariables["/_line2"].stateValues.points[0][1],
      ];
      let point2coords = [
        stateVariables["/_line2"].stateValues.points[1][0],
        stateVariables["/_line2"].stateValues.points[1][1],
      ];

      let moveX = -7;
      let moveY = 3;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line2",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 4)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        moveX = 4 + moveX;
        moveY = 2 + moveY;
        let p1x = -1 + moveX;
        let p1y = -2 + moveY;
        let p2x = -3 + moveX;
        let p2y = -4 + moveY;

        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([
          p1x,
          p1y,
        ]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([
          p2x,
          p2y,
        ]);
        expect(stateVariables["/_line2"].stateValues.points[0]).eqls([
          p1x,
          p1y,
        ]);
        expect(stateVariables["/_line2"].stateValues.points[1]).eqls([
          p2x,
          p2y,
        ]);
      });
    });
  });

  it("copy public state variables of line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line through="(5,-4) (1,4)" />
  </graph>

  <p>Variables are $_line1.var1{assignNames="var1"} and $_line1.var2{assignNames="var2"}.</p>
  <p><m>x</m>-intercept is: $_line1.xintercept{assignNames="xintercept"}.</p>
  <p><m>y</m>-intercept is: $_line1.yintercept{assignNames="yintercept"}.</p>
  <p>Slope is: $_line1.slope{assignNames="slope"}.</p>
  <p>Equation is: $_line1.equation{assignNames="equation"}.</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/var1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/var2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/xintercept"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/yintercept"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6");
      });
    cy.get(cesc("#\\/slope"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−2");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // have to create unproxied version of equation for equals to work
      let unproxiedEquationInLine = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquationInLine.equals(me.fromText("y = -2x+6"))).to.be
        .true;
      expect(stateVariables["/_line1"].stateValues.var1).eq("x");
      expect(stateVariables["/_line1"].stateValues.var2).eq("y");
      expect(stateVariables["/_line1"].stateValues.slope).eq(-2);
      expect(stateVariables["/_line1"].stateValues.xintercept).eq(3);
      expect(stateVariables["/_line1"].stateValues.yintercept).eq(6);
      expect(stateVariables["/var1"].stateValues.value).eq("x");
      expect(stateVariables["/var2"].stateValues.value).eq("y");
      expect(stateVariables["/xintercept"].stateValues.value).eq(3);
      expect(stateVariables["/yintercept"].stateValues.value).eq(6);
      expect(stateVariables["/slope"].stateValues.value).eq(-2);
      let unproxiedEquation = me.fromAst(
        stateVariables["/equation"].stateValues.value,
      );
      expect(unproxiedEquation.equals(me.fromText("y = -2x+6"))).to.be.true;
    });
  });

  it("line from copy of equation and coefficients", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line through="(5,1) (1,5)" />
  </graph>
  <graph>
  <line equation="$(_line1.equation)" />
  </graph>
  <graph>
  <line variables="u v" equation="$(_line1.coeffvar1)u +$(_line1.coeffvar2)v + $(_line1.coeff0) = 0" />
  </graph>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(5)},${nInDOM(1)})`,
    );
    cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(1)},${nInDOM(5)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(
        stateVariables["/_line1"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("y = 6-x"))).to.be.true;
      unproxiedEquation = me.fromAst(
        stateVariables["/_line2"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("y = 6-x"))).to.be.true;
      unproxiedEquation = me.fromAst(
        stateVariables["/_line3"].stateValues.equation,
      );
      expect(unproxiedEquation.equals(me.fromText("v = 6-u"))).to.be.true;
      expect(stateVariables["/_line1"].stateValues.variables[0]).eq("x");
      expect(stateVariables["/_line1"].stateValues.variables[1]).eq("y");
      expect(stateVariables["/_line1"].stateValues.slope).eq(-1);
      expect(stateVariables["/_line1"].stateValues.xintercept).eq(6);
      expect(stateVariables["/_line1"].stateValues.yintercept).eq(6);
      expect(stateVariables["/_line2"].stateValues.variables[0]).eq("x");
      expect(stateVariables["/_line2"].stateValues.variables[1]).eq("y");
      expect(stateVariables["/_line2"].stateValues.slope).eq(-1);
      expect(stateVariables["/_line2"].stateValues.xintercept).eq(6);
      expect(stateVariables["/_line2"].stateValues.yintercept).eq(6);
      expect(stateVariables["/_line3"].stateValues.variables[0]).eq("u");
      expect(stateVariables["/_line3"].stateValues.variables[1]).eq("v");
      expect(stateVariables["/_line3"].stateValues.slope).eq(-1);
      expect(stateVariables["/_line3"].stateValues.xintercept).eq(6);
      expect(stateVariables["/_line3"].stateValues.yintercept).eq(6);
    });

    cy.log("move points");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: 4, y: 4 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 6, y: 8 },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(4)},${nInDOM(4)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(6)},${nInDOM(8)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(
          stateVariables["/_line1"].stateValues.equation,
        );
        expect(unproxiedEquation.equals(me.fromText("y = 2x-4"))).to.be.true;
        unproxiedEquation = me.fromAst(
          stateVariables["/_line2"].stateValues.equation,
        );
        expect(unproxiedEquation.equals(me.fromText("y = 2x-4"))).to.be.true;
        unproxiedEquation = me.fromAst(
          stateVariables["/_line3"].stateValues.equation,
        );
        expect(unproxiedEquation.equals(me.fromText("v = 2u-4"))).to.be.true;
        expect(stateVariables["/_line1"].stateValues.slope).eq(2);
        expect(stateVariables["/_line1"].stateValues.xintercept).eq(2);
        expect(stateVariables["/_line1"].stateValues.yintercept).eq(-4);
        expect(stateVariables["/_line2"].stateValues.slope).eq(2);
        expect(stateVariables["/_line2"].stateValues.xintercept).eq(2);
        expect(stateVariables["/_line2"].stateValues.yintercept).eq(-4);
        expect(stateVariables["/_line3"].stateValues.slope).eq(2);
        expect(stateVariables["/_line3"].stateValues.xintercept).eq(2);
        expect(stateVariables["/_line3"].stateValues.yintercept).eq(-4);
      });
    });
  });

  it("extracting point coordinates of symmetric line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <math name="threeFixed" fixed>3</math>

  <graph>
    <point hide name="A">(1,2)</point>
    <line through="$A ($(A.y),$(A.x)) "/>
    <point name="x1" x="$(_line1.pointX1_1)" y="$threeFixed" />
    <point name="x2">
      (<extract prop="x">$_line1.point2</extract>,
      <math fixed>4</math>)
    </point>
    <point name="y1" y="$(_line1.pointX1_2)" x="$threeFixed" />
    <point name="y2">
      (<math fixed>4</math>,
      <extract prop="y">$_line1.point2</extract>)
    </point>
  </graph>
  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x = 1,
      y = 2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x, y]);
      expect(stateVariables["/_line1"].stateValues.points[1]).eqls([y, x]);
      expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
    });

    cy.log("move x point 1");
    cy.window().then(async (win) => {
      x = 3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/x1",
        args: { x },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(y)},${nInDOM(x)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x, y]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([y, x]);
        expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move x point 2");
    cy.window().then(async (win) => {
      y = 4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/x2",
        args: { x: y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(y)},${nInDOM(x)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x, y]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([y, x]);
        expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move y point 1");
    cy.window().then(async (win) => {
      y = -6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/y1",
        args: { y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(y)},${nInDOM(x)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x, y]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([y, x]);
        expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move y point 2");
    cy.window().then(async (win) => {
      x = -8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/y2",
        args: { y: x },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(y)},${nInDOM(x)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x, y]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([y, x]);
        expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
      });
    });
  });

  it("three lines with mutual references", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <line through="$(_line2.point2{ createComponentOfType='point'}) (1,0)" />
  <line through="$(_line3.point2{ createComponentOfType='point'}) (3,2)" />
  <line through="$(_line1.point2{ createComponentOfType='point'}) (-1,4)" />
  </graph>
  $_line1.point1{assignNames="p11"}
  $_line1.point2{assignNames="p12"}
  $_line2.point1{assignNames="p21"}
  $_line2.point2{assignNames="p22"}
  $_line3.point1{assignNames="p31"}
  $_line3.point2{assignNames="p32"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 1,
      y1 = 0;
    let x2 = 3,
      y2 = 2;
    let x3 = -1,
      y3 = 4;

    cy.get(cesc("#\\/p11") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(x2)},${nInDOM(y2)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x2, y2]);
      expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x1, y1]);
      expect(stateVariables["/_line2"].stateValues.points[0]).eqls([x3, y3]);
      expect(stateVariables["/_line2"].stateValues.points[1]).eqls([x2, y2]);
      expect(stateVariables["/_line3"].stateValues.points[0]).eqls([x1, y1]);
      expect(stateVariables["/_line3"].stateValues.points[1]).eqls([x3, y3]);
    });

    cy.log("move point 1 of line 1");
    cy.window().then(async (win) => {
      x2 = 7;
      y2 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p11",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/p11") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x2, y2]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x1, y1]);
        expect(stateVariables["/_line2"].stateValues.points[0]).eqls([x3, y3]);
        expect(stateVariables["/_line2"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/_line3"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line3"].stateValues.points[1]).eqls([x3, y3]);
      });
    });

    cy.log("move point 2 of line 1");
    cy.window().then(async (win) => {
      x1 = -1;
      y1 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p12",
        args: { x: x1, y: y1 },
      });

      cy.get(cesc("#\\/p12") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x2, y2]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x1, y1]);
        expect(stateVariables["/_line2"].stateValues.points[0]).eqls([x3, y3]);
        expect(stateVariables["/_line2"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/_line3"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line3"].stateValues.points[1]).eqls([x3, y3]);
      });
    });

    cy.log("move point 1 of line 2");
    cy.window().then(async (win) => {
      x3 = 9;
      y3 = -8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p21",
        args: { x: x3, y: y3 },
      });

      cy.get(cesc("#\\/p21") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x3)},${nInDOM(y3)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x2, y2]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x1, y1]);
        expect(stateVariables["/_line2"].stateValues.points[0]).eqls([x3, y3]);
        expect(stateVariables["/_line2"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/_line3"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line3"].stateValues.points[1]).eqls([x3, y3]);
      });
    });

    cy.log("move point 2 of line 2");
    cy.window().then(async (win) => {
      x2 = 3;
      y2 = 2;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p22",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/p22") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x2, y2]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x1, y1]);
        expect(stateVariables["/_line2"].stateValues.points[0]).eqls([x3, y3]);
        expect(stateVariables["/_line2"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/_line3"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line3"].stateValues.points[1]).eqls([x3, y3]);
      });
    });

    cy.log("move point 1 of line 3");
    cy.window().then(async (win) => {
      x1 = -5;
      y1 = 8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p31",
        args: { x: x1, y: y1 },
      });

      cy.get(cesc("#\\/p31") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x2, y2]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x1, y1]);
        expect(stateVariables["/_line2"].stateValues.points[0]).eqls([x3, y3]);
        expect(stateVariables["/_line2"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/_line3"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line3"].stateValues.points[1]).eqls([x3, y3]);
      });
    });

    cy.log("move point 2 of line 3");
    cy.window().then(async (win) => {
      x3 = 0;
      y3 = -5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p32",
        args: { x: x3, y: y3 },
      });

      cy.get(cesc("#\\/p32") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x3)},${nInDOM(y3)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x2, y2]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x1, y1]);
        expect(stateVariables["/_line2"].stateValues.points[0]).eqls([x3, y3]);
        expect(stateVariables["/_line2"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/_line3"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line3"].stateValues.points[1]).eqls([x3, y3]);
      });
    });
  });

  it("line with no arguments", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <line name="l"/>
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="l" target="../g1/l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />  
  </graph>

  <copy assignNames="g3" target="g2" />

  $(g1/l.point1{assignNames="p1"})
  $(g1/l.point2{assignNames="p2"})
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 1,
      y1 = 0;
    let x2 = 0,
      y2 = 0;

    testLineCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x1 = 7;
      y1 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      x1 = 5;
      y1 = 3;
      x2 = -7;
      y2 = -8;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      x1 = -1;
      y1 = 0;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      x1 = 10;
      y1 = 9;
      x2 = 8;
      y2 = 7;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      x1 = -3;
      y1 = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x1 = 0;
      y1 = -1;
      x2 = 2;
      y2 = -3;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("line with empty through", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <line name="l" through="" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="l" target="../g1/l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />  
  </graph>

  <copy assignNames="g3" target="g2" />

  $(g1/l.point1{assignNames="p1"})
  $(g1/l.point2{assignNames="p2"})
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 1,
      y1 = 0;
    let x2 = 0,
      y2 = 0;

    testLineCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x1 = 7;
      y1 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      x1 = 5;
      y1 = 3;
      x2 = -7;
      y2 = -8;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      x1 = -1;
      y1 = 0;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      x1 = 10;
      y1 = 9;
      x2 = 8;
      y2 = 7;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      x1 = -3;
      y1 = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x1 = 0;
      y1 = -1;
      x2 = 2;
      y2 = -3;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("line through one point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <line name="l" through="(-5,9)" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="l" target="../g1/l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />  
  </graph>

  <copy assignNames="g3" target="g2" />

  $(g1/l.point1{assignNames="p1"})
  $(g1/l.point2{assignNames="p2"})
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = -5,
      y1 = 9;
    let x2 = 0,
      y2 = 0;

    testLineCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x1 = 7;
      y1 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      x1 = 5;
      y1 = 3;
      x2 = -7;
      y2 = -8;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      x1 = -1;
      y1 = 0;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      x1 = 10;
      y1 = 9;
      x2 = 8;
      y2 = 7;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      x1 = -3;
      y1 = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x1 = 0;
      y1 = -1;
      x2 = 2;
      y2 = -3;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("line through one point - the origin", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <line name="l" through="(0,0)" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="l" target="../g1/l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />  
  </graph>

  <copy assignNames="g3" target="g2" />

  $(g1/l.point1{assignNames="p1"})
  $(g1/l.point2{assignNames="p2"})
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 0,
      y1 = 0;
    let x2 = 0,
      y2 = 0;

    testLineCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x1 = 7;
      y1 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      x1 = 5;
      y1 = 3;
      x2 = -7;
      y2 = -8;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      x1 = -1;
      y1 = 0;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      x1 = 10;
      y1 = 9;
      x2 = 8;
      y2 = 7;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      x1 = -3;
      y1 = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x1 = 0;
      y1 = -1;
      x2 = 2;
      y2 = -3;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("line through one point, copy and overwrite the point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <line through="(-5,9)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph newNamespace name="g2">
    <copy target="../g1/l" assignNames="l" through="(4,-2)" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g3">
    <copy target="../g2/l" assignNames="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    <copy target="../g2/_copy1" assignNames="(l)" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}

  $(g1/l.pointX1_1{assignNames="x11"})
  $(g1/l.pointX1_2{assignNames="y11"})
  $(g1/l.pointX2_1{assignNames="x2"})
  $(g1/l.pointX2_2{assignNames="y2"})
  $(g2/l.pointX1_1{assignNames="x12"})
  $(g2/l.pointX1_2{assignNames="y12"})
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    async function checkLines({ x11, y11, x12, y12, x2, y2 }) {
      cy.get(cesc("#\\/x11") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x11).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y11") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y11).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/x2") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x2).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y2") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y2).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/x12") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x12).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y12") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y12).substring(0, 6)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x11, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y11, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(stateVariables["/g1/A"].stateValues.xs[0]).closeTo(x11, 1e-12);
        expect(stateVariables["/g1/A"].stateValues.xs[1]).closeTo(y11, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g2/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g2/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g3/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g3/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g4/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g4/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g5/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g5/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[1]).closeTo(y2, 1e-12);
      });
    }

    let x11 = -5,
      y11 = 9;
    let x12 = 4,
      y12 = -2;
    let x2 = 0,
      y2 = 0;

    cy.window().then(async (win) => {
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/A");
    cy.window().then(async (win) => {
      x11 = 7;
      y11 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x11, y: y11 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g1/l");
    cy.window().then(async (win) => {
      x11 = 5;
      y11 = 3;
      x2 = -7;
      y2 = -8;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x11, y11],
          point2coords: [x2, y2],
        },
      });

      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/A");
    cy.window().then(async (win) => {
      x12 = -1;
      y12 = 0;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g2/l");
    cy.window().then(async (win) => {
      x12 = 10;
      y12 = 9;
      x2 = 8;
      y2 = 7;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });

      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/A");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/B");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g3/l");
    cy.window().then(async (win) => {
      x12 = 0;
      y12 = -1;
      x2 = 2;
      y2 = -3;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });

      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/A");
    cy.window().then(async (win) => {
      x12 = 9;
      y12 = 8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -9;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g4/l");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 4;
      x2 = -5;
      y2 = 6;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g4/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/A");
    cy.window().then(async (win) => {
      x12 = 1;
      y12 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/B");
    cy.window().then(async (win) => {
      x2 = 0;
      y2 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g5/l");
    cy.window().then(async (win) => {
      x12 = 4;
      y12 = 5;
      x2 = -6;
      y2 = -7;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g5/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });
  });

  it("line through one point, copy and overwrite the point, swap line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <booleaninput name="b" />
  <graph name="g1" newNamespace>
    <conditionalContent assignNames="(l)">
      <case condition="$(../b)" >
        <line through="(1,2)" />
      </case>
      <else>
        <line through="(-5,9)" />
      </else>
    </conditionalContent>
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph newNamespace name="g2">
    <copy target="../g1/l" assignNames="l" through="(4,-2)" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g3">
    <copy target="../g2/l" assignNames="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    <copy target="../g2/_copy1" assignNames="(l)" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}

  $(g1/l.pointX1_1{assignNames="x11"})
  $(g1/l.pointX1_2{assignNames="y11"})
  $(g1/l.pointX2_1{assignNames="x2"})
  $(g1/l.pointX2_2{assignNames="y2"})
  $(g2/l.pointX1_1{assignNames="x12"})
  $(g2/l.pointX1_2{assignNames="y12"})

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    async function checkLines({ x11, y11, x12, y12, x2, y2 }) {
      cy.get(cesc("#\\/x11") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x11).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y11") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y11).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/x2") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x2).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y2") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y2).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/x12") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x12).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y12") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y12).substring(0, 6)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x11, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y11, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(stateVariables["/g1/A"].stateValues.xs[0]).closeTo(x11, 1e-12);
        expect(stateVariables["/g1/A"].stateValues.xs[1]).closeTo(y11, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g2/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g2/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g3/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g3/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g4/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g4/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g5/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g5/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[1]).closeTo(y2, 1e-12);
      });
    }

    let x11 = -5,
      y11 = 9;
    let x12 = 4,
      y12 = -2;
    let x2 = 0,
      y2 = 0;

    cy.window().then(async (win) => {
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/A");
    cy.window().then(async (win) => {
      x11 = 7;
      y11 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x11, y: y11 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g1/l");
    cy.window().then(async (win) => {
      x11 = 5;
      y11 = 3;
      x2 = -7;
      y2 = -8;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x11, y11],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/A");
    cy.window().then(async (win) => {
      x12 = -1;
      y12 = 0;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g2/l");
    cy.window().then(async (win) => {
      x12 = 10;
      y12 = 9;
      x2 = 8;
      y2 = 7;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/A");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/B");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g3/l");
    cy.window().then(async (win) => {
      x12 = 0;
      y12 = -1;
      x2 = 2;
      y2 = -3;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/A");
    cy.window().then(async (win) => {
      x12 = 9;
      y12 = 8;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -9;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g4/l");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 4;
      x2 = -5;
      y2 = 6;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g4/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/A");
    cy.window().then(async (win) => {
      x12 = 1;
      y12 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/B");
    cy.window().then(async (win) => {
      x2 = 0;
      y2 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g5/l");
    cy.window().then(async (win) => {
      x12 = 4;
      y12 = 5;
      x2 = -6;
      y2 = -7;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g5/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.get(cesc("#\\/b_input")).check({ force: true });

    cy.window().then(async (win) => {
      (x11 = 1), (y11 = 2);
      (x12 = 4), (y12 = -2);
      (x2 = 0), (y2 = 0);

      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/A");
    cy.window().then(async (win) => {
      x11 = 7;
      y11 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x11, y: y11 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g1/l");
    cy.window().then(async (win) => {
      x11 = 5;
      y11 = 3;
      x2 = -7;
      y2 = -8;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x11, y11],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/A");
    cy.window().then(async (win) => {
      x12 = -1;
      y12 = 0;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g2/l");
    cy.window().then(async (win) => {
      x12 = 10;
      y12 = 9;
      x2 = 8;
      y2 = 7;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/A");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/B");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g3/l");
    cy.window().then(async (win) => {
      x12 = 0;
      y12 = -1;
      x2 = 2;
      y2 = -3;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/A");
    cy.window().then(async (win) => {
      x12 = 9;
      y12 = 8;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -9;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g4/l");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 4;
      x2 = -5;
      y2 = 6;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g4/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/A");
    cy.window().then(async (win) => {
      x12 = 1;
      y12 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/A",
        args: { x: x12, y: y12 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/B");
    cy.window().then(async (win) => {
      x2 = 0;
      y2 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/B",
        args: { x: x2, y: y2 },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g5/l");
    cy.window().then(async (win) => {
      x12 = 4;
      y12 = 5;
      x2 = -6;
      y2 = -7;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g5/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLines({ x11, y11, x12, y12, x2, y2 });
    });
  });

  it("line through fixed point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <point hide fixed>(-5,9)</point>
    <line name="l" through="$_point1" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="l" target="../g1/l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />  
  </graph>

  <copy assignNames="g3" target="g2" />

  $(g1/l.point1{assignNames="p1"})
  $(g1/l.point2{assignNames="p2"})
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = -5,
      y1 = 9;
    let x2 = 0,
      y2 = 0;

    testLineCopiedTwice({ x1, y1, x2, y2 });

    cy.log("can't move point 1");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: 7, y: -3 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("try to move line");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1 + 5, y1 + 9],
          point2coords: [x2 + 5, y2 + 9],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: -1, y: 0 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1 - 3, y1 + 7],
          point2coords: [x2 - 3, y2 + 7],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: -3, y: 7 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1 - 8, y1 - 2],
          point2coords: [x2 - 8, y2 - 2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("line through dynamic number of moveable points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <map hide>
    <template>
      <point>
        ($x + <math>0</math>,
        2$x + <math>0</math>)
      </point>
    </template>
    <sources alias="x">
      <sequence length="$_mathinput1" />
    </sources>
  </map>
  <graph name="g1" newNamespace>
    <line through="$(../_map1)" name="l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="l" target="../g1/l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />  
  </graph>

  <copy assignNames="g3" target="g2" />

  <mathinput prefill="0"/>

  $(g1/l.point1{assignNames="p1"})
  $(g1/l.point2{assignNames="p2"})
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 1,
      y1 = 0;
    let x2 = 0,
      y2 = 0;
    let x1Essential = 1,
      y1Essential = 0;
    let x2Essential = 0,
      y2Essential = 0;

    testLineCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x1Essential = x1 = 7;
      y1Essential = y1 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2Essential = x2 = -1;
      y2Essential = y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      x1Essential = x1 = 5;
      y1Essential = y1 = 3;
      x2Essential = x2 = -7;
      y2Essential = y2 = -8;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      x1Essential = x1 = -1;
      y1Essential = y1 = 0;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2Essential = x2 = 6;
      y2Essential = y2 = -6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      x1Essential = x1 = 10;
      y1Essential = y1 = 9;
      x2Essential = x2 = 8;
      y2Essential = y2 = 7;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      x1Essential = x1 = -3;
      y1Essential = y1 = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2Essential = x2 = -8;
      y2Essential = y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x1Essential = x1 = 0;
      y1Essential = y1 = -1;
      x2Essential = x2 = 2;
      y2Essential = y2 = -3;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("add first through point");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.window().then(async (win) => {
      x1 = 1;
      y1 = 2;

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x1 = 8;
      y1 = -2;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2Essential = x2 = 0;
      y2Essential = y2 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      x1 = 6;
      y1 = 4;
      x2Essential = x2 = -6;
      y2Essential = y2 = -7;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      x1 = 0;
      y1 = 1;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2Essential = x2 = 7;
      y2Essential = y2 = -5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      x1 = 11;
      y1 = 10;
      x2Essential = x2 = 9;
      y2Essential = y2 = 8;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      x1 = -2;
      y1 = 8;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2Essential = x2 = -7;
      y2Essential = y2 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x1 = 1;
      y1 = 0;
      x2Essential = x2 = 3;
      y2Essential = y2 = -2;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("add second through point");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.window().then(async (win) => {
      x2 = 2;
      y2 = 4;

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x1 = 6;
      y1 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2 = -2;
      y2 = -5;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      x1 = 4;
      y1 = 2;
      x2 = -8;
      y2 = -9;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      x1 = -2;
      y1 = -1;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 5;
      y2 = -7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      x1 = 9;
      y1 = 8;
      x2 = 7;
      y2 = 6;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      x1 = -4;
      y1 = 6;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = -9;
      y2 = -5;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x1 = -1;
      y1 = -2;
      x2 = 1;
      y2 = -4;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("remove second through point");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.window().then(async (win) => {
      x2 = x2Essential;
      y2 = y2Essential;

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x1 = 7;
      y1 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      x1 = 5;
      y1 = 3;
      x2 = -7;
      y2 = -8;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      x1 = -1;
      y1 = 0;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      x1 = 10;
      y1 = 9;
      x2 = 8;
      y2 = 7;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      x1 = -3;
      y1 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x1 = 0;
      y1 = -1;
      x2 = 2;
      y2 = -3;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("remove first through point");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}0{enter}",
      { force: true },
    );

    cy.window().then(async (win) => {
      x1 = x1Essential;
      y1 = y1Essential;

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x1 = 7;
      y1 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      x1 = 5;
      y1 = 3;
      x2 = -7;
      y2 = -8;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      x1 = -1;
      y1 = 0;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      x1 = 10;
      y1 = 9;
      x2 = 8;
      y2 = 7;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      x1 = -3;
      y1 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x1 = 0;
      y1 = -1;
      x2 = 2;
      y2 = -3;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("line through dynamic number of fixed points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <map hide>
    <template>
      <point>
        ($x, 2$x)
      </point>
    </template>
    <sources alias="x">
      <sequence length="$_mathinput1" />
    </sources>
  </map>
  <graph name="g1" newNamespace>
    <line through="$(../_map1)" name="l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="l" target="../g1/l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />  
  </graph>

  <copy assignNames="g3" target="g2" />

  <mathinput prefill="0"/>

  $(g1/l.point1{assignNames="p1"})
  $(g1/l.point2{assignNames="p2"})
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 1,
      y1 = 0;
    let x2 = 0,
      y2 = 0;
    let x1Essential = 1,
      y1Essential = 0;
    let x2Essential = 0,
      y2Essential = 0;

    testLineCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x1Essential = x1 = 7;
      y1Essential = y1 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2Essential = x2 = -1;
      y2Essential = y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      x1Essential = x1 = 5;
      y1Essential = y1 = 3;
      x2Essential = x2 = -7;
      y2Essential = y2 = -8;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      x1Essential = x1 = -1;
      y1Essential = y1 = 0;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2Essential = x2 = 6;
      y2Essential = y2 = -6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      x1Essential = x1 = 10;
      y1Essential = y1 = 9;
      x2Essential = x2 = 8;
      y2Essential = y2 = 7;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      x1Essential = x1 = -3;
      y1Essential = y1 = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2Essential = x2 = -8;
      y2Essential = y2 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x1Essential = x1 = 0;
      y1Essential = y1 = -1;
      x2Essential = x2 = 2;
      y2Essential = y2 = -3;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("add first through point");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.window().then(async (win) => {
      x1 = 1;
      y1 = 2;

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: 7, y: -3 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2 = 0;
      y2 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1 + 5, y1 - 3],
          point2coords: [x2 + 5, y2 - 3],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: -1, y: 0 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 7;
      y2 = -5;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1 - 15, y1 + 6],
          point2coords: [x2 - 15, y2 + 6],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: -3, y: 7 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = -7;
      y2 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x2Essential = x2;
      y2Essential = y2;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1 - 4, y1 + 9],
          point2coords: [x2 - 4, y2 + 9],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("add second through point");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.window().then(async (win) => {
      x2 = 2;
      y2 = 4;

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: 7, y: -3 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: -1, y: -4 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [5, 3],
          point2coords: [-7, -8],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: -1, y: 0 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: 6, y: -6 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [10, 9],
          point2coords: [8, 7],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: -3, y: 7 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: -8, y: -4 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [0, -1],
          point2coords: [2, -3],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("remove second through point");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.window().then(async (win) => {
      x2 = x2Essential;
      y2 = y2Essential;

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: 7, y: -3 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1 + 8, y1 + 6],
          point2coords: [x2 + 8, y2 + 6],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: -1, y: 0 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1 - 7, y1 - 1],
          point2coords: [x2 - 7, y2 - 1],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: -3, y: 7 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1 + 2, y1 + 7],
          point2coords: [x2 + 2, y2 + 7],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("remove first through point");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}0{enter}",
      { force: true },
    );

    cy.window().then(async (win) => {
      x1 = x1Essential;
      y1 = y1Essential;

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x1 = 7;
      y1 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      x1 = 5;
      y1 = 3;
      x2 = -7;
      y2 = -8;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      x1 = -1;
      y1 = 0;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 2");
    cy.window().then(async (win) => {
      x1 = 10;
      y1 = 9;
      x2 = 8;
      y2 = 7;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      x1 = -3;
      y1 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move line 3");
    cy.window().then(async (win) => {
      x1 = 0;
      y1 = -1;
      x2 = 2;
      y2 = -3;
      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("line through point referencing own component", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line through="(3, $(_line1.pointX1_1)) (4,5)" />
  </graph>

  <graph>
    $_line1{name="la"}
    $_line1.point1{assignNames="p1a"}
    $_line1.point2{assignNames="p2a"}
  </graph>

  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    // A torture test, because when _copy1 is expanded,
    // it causes a state variable to become unresolved right in the middle
    // of the algorithm processing the consequences of it becoming resolved

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 3,
      y1 = 3;
    let x2 = 4,
      y2 = 5;

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(x1)},${nInDOM(y1)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
      expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
      expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
      expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
      expect(stateVariables["/p1"].stateValues.coords).eqls(["vector", x1, y1]);
      expect(stateVariables["/p2"].stateValues.coords).eqls(["vector", x2, y2]);
      expect(stateVariables["/p1a"].stateValues.coords).eqls([
        "vector",
        x1,
        y1,
      ]);
      expect(stateVariables["/p2a"].stateValues.coords).eqls([
        "vector",
        x2,
        y2,
      ]);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      x1 = y1 = 7;
      let y1try = 13;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: x1, y: y1try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      x2 = -3;
      y2 = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 1a");
    cy.window().then(async (win) => {
      x1 = y1 = -1;
      let y1try = -21;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1a",
        args: { x: x1, y: y1try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 2a");
    cy.window().then(async (win) => {
      x2 = -5;
      y2 = 6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2a",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move line");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -3;

      let y1try = y1 + dy;
      x1 = y1 = x1 + dx;
      x2 = x2 + dx;
      let y2try = y2 + dy;
      y2 = y2try + y1 - y1try;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: [x1, y1try],
          point2coords: [x2, y2try],
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move line a");
    cy.window().then(async (win) => {
      let dx = -6,
        dy = -9;

      let y1try = y1 + dy;
      x1 = y1 = x1 + dx;
      x2 = x2 + dx;
      let y2try = y2 + dy;
      y2 = y2try + y1 - y1try;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/la",
        args: {
          point1coords: [x1, y1try],
          point2coords: [x2, y2try],
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });
  });

  it("line through point referencing own component via copy", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line through="(3,$(la.pointX1_1)) (4,5)" />
  </graph>

  <graph>
    $_line1{name="la"}
    $_line1.point1{assignNames="p1a"}
    $_line1.point2{assignNames="p2a"}
  </graph>

  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 3,
      y1 = 3;
    let x2 = 4,
      y2 = 5;

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(x1)},${nInDOM(y1)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
      expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
      expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
      expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
      expect(stateVariables["/p1"].stateValues.coords).eqls(["vector", x1, y1]);
      expect(stateVariables["/p2"].stateValues.coords).eqls(["vector", x2, y2]);
      expect(stateVariables["/p1a"].stateValues.coords).eqls([
        "vector",
        x1,
        y1,
      ]);
      expect(stateVariables["/p2a"].stateValues.coords).eqls([
        "vector",
        x2,
        y2,
      ]);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      x1 = y1 = 7;
      let y1try = 13;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: x1, y: y1try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      x2 = -3;
      y2 = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 1a");
    cy.window().then(async (win) => {
      x1 = y1 = -1;
      let y1try = -21;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1a",
        args: { x: x1, y: y1try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 2a");
    cy.window().then(async (win) => {
      x2 = -5;
      y2 = 6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2a",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move line");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -3;

      let y1try = y1 + dy;
      x1 = y1 = x1 + dx;
      x2 = x2 + dx;
      let y2try = y2 + dy;
      y2 = y2try + y1 - y1try;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: [x1, y1try],
          point2coords: [x2, y2try],
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move line a");
    cy.window().then(async (win) => {
      let dx = -6,
        dy = -9;

      let y1try = y1 + dy;
      x1 = y1 = x1 + dx;
      x2 = x2 + dx;
      let y2try = y2 + dy;
      y2 = y2try + y1 - y1try;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/la",
        args: {
          point1coords: [x1, y1try],
          point2coords: [x2, y2try],
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });
  });

  it("line with self references to points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line through="(2$(_line1.pointX2_2)+1, 2$(_line1.pointX2_1)+1) ($(_line1.pointX1_1)+1, 1)"/>
  </graph>

  <graph>
    $_line1{name="la"}
    $_line1.point1{assignNames="p1a"}
    $_line1.point2{assignNames="p2a"}
  </graph>

  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}

  `,
        },
        "*",
      );
    });

    // Another torture test with state variables becoming unresolved
    // while being processed

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let y2 = 1;
    let x1 = 2 * y2 + 1;
    let x2 = x1 + 1;
    let y1 = 2 * x2 + 1;

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(x1)},${nInDOM(y1)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
      expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
      expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
      expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
      expect(stateVariables["/p1"].stateValues.coords).eqls(["vector", x1, y1]);
      expect(stateVariables["/p2"].stateValues.coords).eqls(["vector", x2, y2]);
      expect(stateVariables["/p1a"].stateValues.coords).eqls([
        "vector",
        x1,
        y1,
      ]);
      expect(stateVariables["/p2a"].stateValues.coords).eqls([
        "vector",
        x2,
        y2,
      ]);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      x1 = 7;
      let y1try = 13;

      y2 = (x1 - 1) / 2;
      x2 = x1 + 1;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: x1, y: y1try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      x2 = -4;
      let y2try = 9;

      x1 = x2 - 1;
      y2 = (x1 - 1) / 2;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: x2, y: y2try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 1a");
    cy.window().then(async (win) => {
      x1 = -1;
      let y1try = -21;

      y2 = (x1 - 1) / 2;
      x2 = x1 + 1;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1a",
        args: { x: x1, y: y1try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 2a");
    cy.window().then(async (win) => {
      x2 = -8;
      let y2try = 9;

      x1 = x2 - 1;
      y2 = (x1 - 1) / 2;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2a",
        args: { x: x2, y: y2try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move line");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -3;

      let y1try = y1 + dy;
      let x2try = x2 + dx;
      let y2try = y2 + dy;

      x1 = x1 + dx;
      y2 = (x1 - 1) / 2;
      x2 = x1 + 1;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: [x1, y1try],
          point2coords: [x2try, y2try],
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move line a");
    cy.window().then(async (win) => {
      let dx = -6,
        dy = -9;

      let y1try = y1 + dy;
      let x2try = x2 + dx;
      let y2try = y2 + dy;

      x1 = x1 + dx;
      y2 = (x1 - 1) / 2;
      x2 = x1 + 1;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/la",
        args: {
          point1coords: [x1, y1try],
          point2coords: [x2try, y2try],
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });
  });

  it("line with self references to points via copy", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line through="(2$(la.pointX2_2)+1,2$(la.pointX2_1)+1) ($(la.pointX1_1)+1,1)" />
  </graph>

  <graph>
    $_line1{name="la"}
    $_line1.point1{assignNames="p1a"}
    $_line1.point2{assignNames="p2a"}
  </graph>

  $_line1.point1{assignNames="p1"}
  $_line1.point2{assignNames="p2"}
  `,
        },
        "*",
      );
    });

    // Another torture test with state variables becoming unresolved
    // while being processed

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let y2 = 1;
    let x1 = 2 * y2 + 1;
    let x2 = x1 + 1;
    let y1 = 2 * x2 + 1;

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(x1)},${nInDOM(y1)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
      expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
      expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
      expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
      expect(stateVariables["/p1"].stateValues.coords).eqls(["vector", x1, y1]);
      expect(stateVariables["/p2"].stateValues.coords).eqls(["vector", x2, y2]);
      expect(stateVariables["/p1a"].stateValues.coords).eqls([
        "vector",
        x1,
        y1,
      ]);
      expect(stateVariables["/p2a"].stateValues.coords).eqls([
        "vector",
        x2,
        y2,
      ]);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      x1 = 7;
      let y1try = 13;

      y2 = (x1 - 1) / 2;
      x2 = x1 + 1;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: x1, y: y1try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      x2 = -4;
      let y2try = 9;

      x1 = x2 - 1;
      y2 = (x1 - 1) / 2;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: x2, y: y2try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 1a");
    cy.window().then(async (win) => {
      x1 = -1;
      let y1try = -21;

      y2 = (x1 - 1) / 2;
      x2 = x1 + 1;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1a",
        args: { x: x1, y: y1try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move point 2a");
    cy.window().then(async (win) => {
      x2 = -8;
      let y2try = 9;

      x1 = x2 - 1;
      y2 = (x1 - 1) / 2;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2a",
        args: { x: x2, y: y2try },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move line");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -3;

      let y1try = y1 + dy;
      let x2try = x2 + dx;
      let y2try = y2 + dy;

      x1 = x1 + dx;
      y2 = (x1 - 1) / 2;
      x2 = x1 + 1;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: [x1, y1try],
          point2coords: [x2try, y2try],
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });

    cy.log("move line a");
    cy.window().then(async (win) => {
      let dx = -6,
        dy = -9;

      let y1try = y1 + dy;
      let x2try = x2 + dx;
      let y2try = y2 + dy;

      x1 = x1 + dx;
      y2 = (x1 - 1) / 2;
      x2 = x1 + 1;
      y1 = 2 * x2 + 1;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/la",
        args: {
          point1coords: [x1, y1try],
          point2coords: [x2try, y2try],
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_line1"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/_line1"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/la"].stateValues.points[0]).eqls([x1, y1]);
        expect(stateVariables["/la"].stateValues.points[1]).eqls([x2, y2]);
        expect(stateVariables["/p1"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
        expect(stateVariables["/p1a"].stateValues.coords).eqls([
          "vector",
          x1,
          y1,
        ]);
        expect(stateVariables["/p2a"].stateValues.coords).eqls([
          "vector",
          x2,
          y2,
        ]);
      });
    });
  });

  it("line through one point and given slope", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>slope: <mathinput name="slope" prefill="1" /></p>
  <graph name="g1" newNamespace>
    <line through="(-5,9)" slope="$(../slope)" name="l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />
  </graph>
  <graph name="g2" newNamespace>
    <copy assignNames="l" target="../g1/l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />  
  </graph>

  <copy assignNames="g3" target="g2" />
  
  $(g1/l.point1{assignNames="p1"})
  $(g1/l.point2{assignNames="p2"})
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = -5,
      y1 = 9;
    let x2 = -5 + 1 / Math.sqrt(2),
      y2 = 9 + 1 / Math.sqrt(2);
    let slope = 1;

    testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });

    cy.log("move point A");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -4;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point B, negative infinite slope");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;
      slope = -Infinity;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move line 1, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 3;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [31, 22],
        },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point B, positive infinite slope");
    cy.window().then(async (win) => {
      x2 = -2;
      y2 = 10;
      slope = Infinity;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("change slope");
    cy.window().then(async (win) => {
      slope = 0.5;

      let d = y2 - y1; // since infinite slope

      let theta = Math.atan(slope);
      x2 = x1 + d * Math.cos(theta);
      y2 = y1 + d * Math.sin(theta);

      cy.get(cesc("#\\/slope") + " textarea").type(
        "{end}{backspace}0.5{enter}",
        { force: true },
      );

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      let dx = -6,
        dy = -9;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;
      slope = (y2 - y1) / (x2 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move line 2, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 6;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [-73, 58],
        },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -11;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -3;
      slope = (y2 - y1) / (x2 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("change slope");
    cy.window().then(async (win) => {
      slope = -3;

      let dx = x2 - x1;
      let dy = y2 - y1;
      let d = Math.sqrt(dx * dx + dy * dy);
      let theta = Math.atan(slope);
      x2 = x1 + d * Math.cos(theta);
      y2 = y1 + d * Math.sin(theta);

      cy.get(cesc("#\\/slope") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-3{enter}",
        { force: true },
      );

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move line 3, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -8,
        dy = 14;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });
  });

  it("line through one point and given slope, copy and overwrite slope", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>slope1: <mathinput name="slope1" prefill="1" /></p>
  <p>slope2: <mathinput name="slope2" prefill="2" /></p>
  
  <graph name="g1" newNamespace>
    <line through="(-5,9)" slope="$(../slope1)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    <copy target="../g1/l" slope="$(../slope2)" assignNames="l" />
    <copy prop="point1" target="../g2/l" assignNames="A" />
    <copy prop="point2" target="../g2/l" assignNames="B" />
  </graph>

  <graph newNamespace name="g3">
    <copy target="../g2/l" assignNames="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    <copy target="../g2/_copy1" assignNames="(l)" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}

  <copy prop="pointX1_1" target="g1/l" assignNames="x1" simplify />
  <copy prop="pointX1_2" target="g1/l" assignNames="y1" simplify />
  <copy prop="pointX2_1" target="g1/l" assignNames="x21" simplify />
  <copy prop="pointX2_2" target="g1/l" assignNames="y21" simplify />
  <copy prop="pointX2_1" target="g2/l" assignNames="x22" simplify />
  <copy prop="pointX2_2" target="g2/l" assignNames="y22" simplify />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    async function checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 }) {
      cy.get(cesc("#\\/x1") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x1).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y1") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y1).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/x21") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x21).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y21") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y21).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/x22") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x22).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y22") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y22).substring(0, 2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x21, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y21, 1e-12);
        if (Number.isFinite(slope1)) {
          expect(
            me
              .fromAst(stateVariables["/g1/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope1, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g1/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope1);
        }

        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g2/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g2/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g3/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g3/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g4/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g4/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g5/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g5/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(stateVariables["/g1/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g1/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[0]).closeTo(x21, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[1]).closeTo(y21, 1e-12);

        expect(stateVariables["/g2/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g2/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g3/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g3/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g4/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g4/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g5/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g5/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[1]).closeTo(y22, 1e-12);
      });
    }

    let x1 = -5,
      y1 = 9;
    let d = 1;

    let slope1 = 1;
    let theta1 = Math.atan(slope1);
    let x21 = x1 + d * Math.cos(theta1);
    let y21 = y1 + d * Math.sin(theta1);

    let slope2 = 2;
    let theta2 = Math.atan(slope2);
    let x22 = x1 + d * Math.cos(theta2);
    let y22 = y1 + d * Math.sin(theta2);

    cy.window().then(async (win) => {
      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -4;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x21 = -1;
      y21 = -4;
      slope1 = -Infinity;

      d = y1 - y21; // since -infinite slope
      x22 = x1 + d * Math.cos(theta2);
      y22 = y1 + d * Math.sin(theta2);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x21, y: y21 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 1, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 3;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [31, 22],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("change slope");
    cy.window().then(async (win) => {
      slope1 = 0.5;

      d = y1 - y21; // since infinite slope

      theta1 = Math.atan(slope1);
      x21 = x1 + d * Math.cos(theta1);
      y21 = y1 + d * Math.sin(theta1);

      cy.get(cesc("#\\/slope1") + " textarea").type(
        "{end}{backspace}{backspace}0.5{enter}",
        { force: true },
      );

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      let dx = -6,
        dy = -9;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x22 = 6;
      y22 = -6;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      d = (x22 - x1) / Math.cos(theta2);
      x21 = x1 + d * Math.cos(theta1);
      y21 = y1 + d * Math.sin(theta1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 2, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 6;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [-73, 58],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -11;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x22 = 6;
      y22 = -3;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      d = (x22 - x1) / Math.cos(theta2);
      x21 = x1 + d * Math.cos(theta1);
      y21 = y1 + d * Math.sin(theta1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("change slope");
    cy.window().then(async (win) => {
      slope2 = -3;

      let dx = x22 - x1;
      let dy = y22 - y1;
      d = Math.sqrt(dx * dx + dy * dy);
      theta2 = Math.atan(slope2);
      x22 = x1 + d * Math.cos(theta2);
      y22 = y1 + d * Math.sin(theta2);

      cy.get(cesc("#\\/slope2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-3{enter}",
        { force: true },
      );

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 3, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -8,
        dy = 14;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A4");
    cy.window().then(async (win) => {
      let dx = 5,
        dy = -8;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B4");
    cy.window().then(async (win) => {
      x22 = -4;
      y22 = 4;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      d = y22 - y1; // since slope2 is infinity

      x21 = x1 + d * Math.cos(theta1);
      y21 = y1 + d * Math.sin(theta1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 4, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 2;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g4/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A5");
    cy.window().then(async (win) => {
      let dx = 6,
        dy = -6;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B5");
    cy.window().then(async (win) => {
      x22 = -8;
      y22 = -7;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      d = (x22 - x1) / Math.cos(theta2);

      x21 = x1 + d * Math.cos(theta1);
      y21 = y1 + d * Math.sin(theta1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 5, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 6,
        dy = 3;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g5/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });
  });

  it("line through one point, copy and add slope", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>slope: <mathinput name="slope" prefill="1" /></p>
  
  <graph name="g1" newNamespace>
    <line through="(-5,9)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    <copy target="../g1/l" slope="$(../slope)" assignNames="l" />
    <copy prop="point1" target="../g2/l" assignNames="A" />
    <copy prop="point2" target="../g2/l" assignNames="B" />
  </graph>

  <graph newNamespace name="g3">
    <copy target="../g2/l" assignNames="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    <copy target="../g2/_copy1" assignNames="(l)" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}

  <copy prop="pointX1_1" target="g1/l" assignNames="x1" simplify />
  <copy prop="pointX1_2" target="g1/l" assignNames="y1" simplify />
  <copy prop="pointX2_1" target="g1/l" assignNames="x21" simplify />
  <copy prop="pointX2_2" target="g1/l" assignNames="y21" simplify />
  <copy prop="pointX2_1" target="g2/l" assignNames="x22" simplify />
  <copy prop="pointX2_2" target="g2/l" assignNames="y22" simplify />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    async function checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 }) {
      cy.get(cesc("#\\/x1") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x1).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y1") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y1).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/x21") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x21).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y21") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y21).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/x22") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x22).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y22") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y22).substring(0, 2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x21, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y21, 1e-12);
        if (Number.isFinite(slope1)) {
          expect(
            me
              .fromAst(stateVariables["/g1/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope1, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g1/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope1);
        }

        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g2/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g2/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g3/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g3/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g4/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g4/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g5/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g5/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(stateVariables["/g1/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g1/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[0]).closeTo(x21, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[1]).closeTo(y21, 1e-12);

        expect(stateVariables["/g2/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g2/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g3/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g3/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g4/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g4/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g5/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g5/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[1]).closeTo(y22, 1e-12);
      });
    }

    let x1 = -5,
      y1 = 9;
    let x21 = 0,
      y21 = 0;

    let slope1 = (y21 - y1) / (x21 - x1);

    let slope2 = 1;

    let d = 1;
    let theta2 = Math.atan(slope2);
    let x22 = x1 + d * Math.cos(theta2);
    let y22 = y1 + d * Math.sin(theta2);

    cy.window().then(async (win) => {
      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -4;
      x1 += dx;
      y1 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x21 = -1;
      y21 = -4;
      slope1 = -Infinity;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x21, y: y21 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 3;
      x1 += dx;
      y1 += dy;
      x21 = 3;
      y21 = -4;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [x21, y21],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      let dx = -6,
        dy = -9;
      x1 += dx;
      y1 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x22 = 6;
      y22 = -6;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 2, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 6;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [-73, 58],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -11;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x22 = 6;
      y22 = -3;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("change slope");
    cy.window().then(async (win) => {
      slope2 = -3;

      let dx = x22 - x1;
      let dy = y22 - y1;
      d = Math.sqrt(dx * dx + dy * dy);
      theta2 = Math.atan(slope2);
      x22 = x1 + d * Math.cos(theta2);
      y22 = y1 + d * Math.sin(theta2);

      cy.get(cesc("#\\/slope") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-3{enter}",
        { force: true },
      );

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 3, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -8,
        dy = 14;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A4");
    cy.window().then(async (win) => {
      let dx = 5,
        dy = -8;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B4");
    cy.window().then(async (win) => {
      x22 = -4;
      y22 = 4;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 4, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 2;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g4/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A5");
    cy.window().then(async (win) => {
      let dx = 6,
        dy = -6;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B5");
    cy.window().then(async (win) => {
      x22 = -8;
      y22 = -7;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 5, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 6,
        dy = 3;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g5/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });
  });

  it("line with just slope", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>slope: <mathinput name="slope" prefill="1" /></p>
  <graph name="g1" newNamespace>
    <line slope="$(../slope)" name="l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />
  </graph>
  <graph name="g2" newNamespace>
    <copy assignNames="l" target="../g1/l" />
    <copy assignNames="A" prop="point1" target="l" />
    <copy assignNames="B" prop="point2" target="l" />  
  </graph>

  <copy assignNames="g3" target="g2" />
  
  <copy prop="point1" target="g1/l" assignNames="p1" displaySmallAsZero />
  <copy prop="point2" target="g1/l" assignNames="p2" displaySmallAsZero />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 0,
      y1 = 0;
    let x2 = 1 / Math.sqrt(2),
      y2 = 1 / Math.sqrt(2);
    let slope = 1;

    testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });

    cy.log("move point A");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -4;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point B, negative infinite slope");
    cy.window().then(async (win) => {
      x2 = 4;
      y2 = -7;
      slope = -Infinity;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move line 1, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 3;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [31, 22],
        },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point B, positive infinite slope");
    cy.window().then(async (win) => {
      x2 = 3;
      y2 = 9;
      slope = Infinity;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("change slope");
    cy.window().then(async (win) => {
      slope = 0.5;

      let d = y2 - y1; // since infinite slope

      let theta = Math.atan(slope);
      x2 = x1 + d * Math.cos(theta);
      y2 = y1 + d * Math.sin(theta);

      cy.get(cesc("#\\/slope") + " textarea").type(
        "{end}{backspace}0.5{enter}",
        { force: true },
      );

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      let dx = -6,
        dy = -9;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;
      slope = (y2 - y1) / (x2 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move line 2, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 6;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [-73, 58],
        },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -11;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -3;
      slope = (y2 - y1) / (x2 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("change slope");
    cy.window().then(async (win) => {
      slope = -3;

      let dx = x2 - x1;
      let dy = y2 - y1;
      let d = Math.sqrt(dx * dx + dy * dy);
      let theta = Math.atan(slope);
      x2 = x1 + d * Math.cos(theta);
      y2 = y1 + d * Math.sin(theta);

      cy.get(cesc("#\\/slope") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-3{enter}",
        { force: true },
      );

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });

    cy.log("move line 3, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -8,
        dy = 14;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      testLineCopiedTwiceBaseOnSlope({ x1, y1, x2, y2, slope });
    });
  });

  it("line with just given slope, copy and overwrite slope", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>slope1: <mathinput name="slope1" prefill="1" /></p>
  <p>slope2: <mathinput name="slope2" prefill="2" /></p>
  
  <graph name="g1" newNamespace>
    <line slope="$(../slope1)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    <copy target="../g1/l" slope="$(../slope2)" assignNames="l" />
    <copy prop="point1" target="../g2/l" assignNames="A" />
    <copy prop="point2" target="../g2/l" assignNames="B" />
  </graph>

  <graph newNamespace name="g3">
    <copy target="../g2/l" assignNames="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    <copy target="../g2/_copy1" assignNames="(l)" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}
  
  <copy prop="pointX1_1" target="g1/l" assignNames="x1" simplify />
  <copy prop="pointX1_2" target="g1/l" assignNames="y1" simplify />
  <copy prop="pointX2_1" target="g1/l" assignNames="x21" simplify />
  <copy prop="pointX2_2" target="g1/l" assignNames="y21" simplify />
  <copy prop="pointX2_1" target="g2/l" assignNames="x22" simplify />
  <copy prop="pointX2_2" target="g2/l" assignNames="y22" simplify />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    async function checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 }) {
      cy.get(cesc("#\\/x1") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x1).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y1") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y1).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/x21") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x21).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y21") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y21).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/x22") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x22).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y22") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y22).substring(0, 2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x21, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y21, 1e-12);
        if (Number.isFinite(slope1)) {
          expect(
            me
              .fromAst(stateVariables["/g1/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope1, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g1/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope1);
        }

        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g2/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g2/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g3/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g3/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g4/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g4/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g5/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g5/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(stateVariables["/g1/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g1/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[0]).closeTo(x21, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[1]).closeTo(y21, 1e-12);

        expect(stateVariables["/g2/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g2/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g3/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g3/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g4/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g4/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g5/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g5/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[1]).closeTo(y22, 1e-12);
      });
    }

    let x1 = 0,
      y1 = 0;
    let d = 1;

    let slope1 = 1;
    let theta1 = Math.atan(slope1);
    let x21 = x1 + d * Math.cos(theta1);
    let y21 = y1 + d * Math.sin(theta1);

    let slope2 = 2;
    let theta2 = Math.atan(slope2);
    let x22 = x1 + d * Math.cos(theta2);
    let y22 = y1 + d * Math.sin(theta2);

    cy.window().then(async (win) => {
      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -4;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      x21 = -1;
      y21 = -4;

      slope1 = (y21 - y1) / (x21 - x1);

      theta1 = Math.atan(slope1);

      d = (x21 - x1) / Math.cos(theta1);

      x22 = x1 + d * Math.cos(theta2);
      y22 = y1 + d * Math.sin(theta2);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x21, y: y21 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 1, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 3;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [31, 22],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("change slope");
    cy.window().then(async (win) => {
      slope1 = 0.5;

      theta1 = Math.atan(slope1);
      x21 = x1 + d * Math.cos(theta1);
      y21 = y1 + d * Math.sin(theta1);

      cy.get(cesc("#\\/slope1") + " textarea").type(
        "{end}{backspace}{backspace}0.5{enter}",
        { force: true },
      );

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      let dx = -6,
        dy = -9;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x22 = 6;
      y22 = -6;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      d = (x22 - x1) / Math.cos(theta2);
      x21 = x1 + d * Math.cos(theta1);
      y21 = y1 + d * Math.sin(theta1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 2, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 6;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [-73, 58],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -11;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x22 = 6;
      y22 = -3;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      d = (x22 - x1) / Math.cos(theta2);
      x21 = x1 + d * Math.cos(theta1);
      y21 = y1 + d * Math.sin(theta1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("change slope");
    cy.window().then(async (win) => {
      slope2 = -3;

      let dx = x22 - x1;
      let dy = y22 - y1;
      d = Math.sqrt(dx * dx + dy * dy);
      theta2 = Math.atan(slope2);
      x22 = x1 + d * Math.cos(theta2);
      y22 = y1 + d * Math.sin(theta2);

      cy.get(cesc("#\\/slope2") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-3{enter}",
        { force: true },
      );

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 3, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -8,
        dy = 14;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A4");
    cy.window().then(async (win) => {
      let dx = 5,
        dy = -8;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B4");
    cy.window().then(async (win) => {
      x22 = -4;
      y22 = 4;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      d = (x22 - x1) / Math.cos(theta2);

      x21 = x1 + d * Math.cos(theta1);
      y21 = y1 + d * Math.sin(theta1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 4, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 2;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g4/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A5");
    cy.window().then(async (win) => {
      let dx = 6,
        dy = -6;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B5");
    cy.window().then(async (win) => {
      x22 = -8;
      y22 = -7;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      d = (x22 - x1) / Math.cos(theta2);

      x21 = x1 + d * Math.cos(theta1);
      y21 = y1 + d * Math.sin(theta1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 5, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 6,
        dy = 3;
      x1 += dx;
      y1 += dy;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g5/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });
  });

  it("line with just given slope, copy and add through point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>slope: <mathinput name="slope" prefill="1" /></p>
  
  <graph name="g1" newNamespace>
    <line slope="$(../slope)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    <copy target="../g1/l" through="(-5,9)" assignNames="l" />
    <copy prop="point1" target="../g2/l" assignNames="A" />
    <copy prop="point2" target="../g2/l" assignNames="B" />
  </graph>

  <graph newNamespace name="g3">
    <copy target="../g2/l" assignNames="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    <copy target="../g2/_copy1" assignNames="(l)" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}

  <copy prop="pointX1_1" target="g1/l" assignNames="x11" simplify />
  <copy prop="pointX1_2" target="g1/l" assignNames="y11" simplify />
  <copy prop="pointX2_1" target="g1/l" assignNames="x21" simplify />
  <copy prop="pointX2_2" target="g1/l" assignNames="y21" simplify />
  <copy prop="pointX1_1" target="g2/l" assignNames="x12" simplify />
  <copy prop="pointX1_2" target="g2/l" assignNames="y12" simplify />
  <copy prop="pointX2_1" target="g2/l" assignNames="x22" simplify />
  <copy prop="pointX2_2" target="g2/l" assignNames="y22" simplify />

  
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    async function checkLines({
      x11,
      y11,
      x12,
      y12,
      x21,
      y21,
      x22,
      y22,
      slope,
    }) {
      cy.get(cesc("#\\/x11") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x11).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y11") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y11).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/x21") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x21).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y21") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y21).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/x12") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x12).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y12") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y12).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/x22") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x22).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y22") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y22).substring(0, 2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x11, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y11, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x21, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y21, 1e-12);
        if (Number.isFinite(slope)) {
          expect(
            me
              .fromAst(stateVariables["/g1/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g1/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope);
        }

        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope)) {
          expect(
            me
              .fromAst(stateVariables["/g2/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g2/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope);
        }

        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope)) {
          expect(
            me
              .fromAst(stateVariables["/g3/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g3/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope);
        }

        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope)) {
          expect(
            me
              .fromAst(stateVariables["/g4/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g4/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope);
        }

        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope)) {
          expect(
            me
              .fromAst(stateVariables["/g5/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g5/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope);
        }

        expect(stateVariables["/g1/A"].stateValues.xs[0]).closeTo(x11, 1e-12);
        expect(stateVariables["/g1/A"].stateValues.xs[1]).closeTo(y11, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[0]).closeTo(x21, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[1]).closeTo(y21, 1e-12);

        expect(stateVariables["/g2/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g2/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g3/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g3/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g4/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g4/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g5/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g5/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[1]).closeTo(y22, 1e-12);
      });
    }

    let x11 = 0,
      y11 = 0;
    let x12 = -5,
      y12 = 9;

    let slope = 1;

    let d = 1;
    let theta = Math.atan(slope);
    let x21 = x11 + d * Math.cos(theta);
    let y21 = y11 + d * Math.sin(theta);
    let x22 = x12 + d * Math.cos(theta);
    let y22 = y12 + d * Math.sin(theta);

    cy.window().then(async (win) => {
      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -4;
      x11 += dx;
      y11 += dy;

      x21 += dx;
      y21 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x11, y: y11 },
      });
      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      let dx = -d * Math.cos(theta);
      let dy = 4;
      x21 += dx;
      y21 += dy;
      x22 += dx;
      y22 += dy;

      slope = (y21 - y11) / (x21 - x11);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x21, y: y21 },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move line 1, ignore point2 coords");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 3;
      x11 += dx;
      y11 += dy;

      x21 += dx;
      y21 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point1coords: [x11, y11],
          point2coords: [93, -92],
        },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      let dx = -6,
        dy = -9;
      x12 += dx;
      y12 += dy;

      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x12, y: y12 },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x22 = 6;
      y22 = -6;
      slope = (y22 - y12) / (x22 - x12);

      theta = Math.atan(slope);
      x21 = x11 + x22 - x12;
      y21 = y11 + y22 - y12;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move line 2, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 6;
      x12 += dx;
      y12 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [-73, 58],
        },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -11;
      x12 += dx;
      y12 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x12, y: y12 },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x22 = 6;
      y22 = -3;
      slope = (y22 - y12) / (x22 - x12);

      theta = Math.atan(slope);
      x21 = x11 + x22 - x12;
      y21 = y11 + y22 - y12;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("change slope");
    cy.window().then(async (win) => {
      slope = -3;

      let dx = x22 - x12;
      let dy = y22 - y12;
      d = Math.sqrt(dx * dx + dy * dy);
      theta = Math.atan(slope);
      x22 = x12 + d * Math.cos(theta);
      y22 = y12 + d * Math.sin(theta);
      x21 = x11 + d * Math.cos(theta);
      y21 = y11 + d * Math.sin(theta);

      cy.get(cesc("#\\/slope") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-3{enter}",
        { force: true },
      );
      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move line 3, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -8,
        dy = 14;
      x12 += dx;
      y12 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move point A4");
    cy.window().then(async (win) => {
      let dx = 5,
        dy = -8;
      x12 += dx;
      y12 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: x12, y: y12 },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move point B4");
    cy.window().then(async (win) => {
      x22 = -4;
      y22 = 4;
      slope = (y22 - y12) / (x22 - x12);

      theta = Math.atan(slope);
      x21 = x11 + x22 - x12;
      y21 = y11 + y22 - y12;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move line 4, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 2;
      x12 += dx;
      y12 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g4/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move point A5");
    cy.window().then(async (win) => {
      let dx = 6,
        dy = -6;
      x12 += dx;
      y12 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/A",
        args: { x: x12, y: y12 },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move point B5");
    cy.window().then(async (win) => {
      x22 = -8;
      y22 = -7;
      slope = (y22 - y12) / (x22 - x12);

      theta = Math.atan(slope);
      x21 = x11 + x22 - x12;
      y21 = y11 + y22 - y12;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    cy.log("move line 5, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 6,
        dy = 3;
      x12 += dx;
      y12 += dy;
      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g5/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });
  });

  it("line with no parameters, copy and add slope", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>slope: <mathinput name="slope" prefill="1" /></p>
  
  <graph name="g1" newNamespace>
    <line name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    <copy target="../g1/l" slope="$(../slope)" assignNames="l" />
    <copy prop="point1" target="../g2/l" assignNames="A" />
    <copy prop="point2" target="../g2/l" assignNames="B" />
  </graph>

  <graph newNamespace name="g3">
    <copy target="../g2/l" assignNames="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    <copy target="../g2/_copy1" assignNames="(l)" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}

  <copy prop="pointX2_1" target="g1/l" assignNames="x1" simplify />
  <copy prop="pointX2_2" target="g1/l" assignNames="y1" simplify />
  <copy prop="pointX1_1" target="g1/l" assignNames="x21" simplify />
  <copy prop="pointX1_2" target="g1/l" assignNames="y21" simplify />
  <copy prop="pointX2_1" target="g2/l" assignNames="x22" simplify />
  <copy prop="pointX2_2" target="g2/l" assignNames="y22" simplify />
  
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    async function checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 }) {
      cy.get(cesc("#\\/x1") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x1).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y1") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y1).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/x21") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x21).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y21") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y21).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/x22") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x22).substring(0, 2)}`,
      );
      cy.get(cesc("#\\/y22") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y22).substring(0, 2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x21, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y21, 1e-12);
        if (Number.isFinite(slope1)) {
          expect(
            me
              .fromAst(stateVariables["/g1/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope1, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g1/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope1);
        }

        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g2/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g2/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g3/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g3/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g4/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g4/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][0])
            .evaluate_to_constant(),
        ).closeTo(x1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[0][1])
            .evaluate_to_constant(),
        ).closeTo(y1, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][0])
            .evaluate_to_constant(),
        ).closeTo(x22, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.points[1][1])
            .evaluate_to_constant(),
        ).closeTo(y22, 1e-12);
        if (Number.isFinite(slope2)) {
          expect(
            me
              .fromAst(stateVariables["/g5/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).closeTo(slope2, 1e-12);
        } else {
          expect(
            me
              .fromAst(stateVariables["/g5/l"].stateValues.slope)
              .evaluate_to_constant(),
          ).eq(slope2);
        }

        expect(stateVariables["/g1/B"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g1/A"].stateValues.xs[0]).closeTo(x21, 1e-12);
        expect(stateVariables["/g1/A"].stateValues.xs[1]).closeTo(y21, 1e-12);

        expect(stateVariables["/g2/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g2/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g3/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g3/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g4/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g4/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[1]).closeTo(y22, 1e-12);

        expect(stateVariables["/g5/A"].stateValues.xs[0]).closeTo(x1, 1e-12);
        expect(stateVariables["/g5/A"].stateValues.xs[1]).closeTo(y1, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[0]).closeTo(x22, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[1]).closeTo(y22, 1e-12);
      });
    }

    let x1 = 0,
      y1 = 0;
    let x21 = 1,
      y21 = 0;

    let slope1 = (y21 - y1) / (x21 - x1);

    let slope2 = 1;

    let d = 1;
    let theta2 = Math.atan(slope2);
    let x22 = x1 + d * Math.cos(theta2);
    let y22 = y1 + d * Math.sin(theta2);

    cy.window().then(async (win) => {
      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -4;
      x1 += dx;
      y1 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x1, y: y1 },
      });
      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A");
    cy.window().then(async (win) => {
      x21 = -1;
      y21 = -4;
      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x21, y: y21 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 1");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 3;
      x1 += dx;
      y1 += dy;
      x21 = 6;
      y21 = 4;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g1/l",
        args: {
          point2coords: [x1, y1],
          point1coords: [x21, y21],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A2");
    cy.window().then(async (win) => {
      let dx = -6,
        dy = -9;
      x1 += dx;
      y1 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      x22 += dx;
      y22 += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B2");
    cy.window().then(async (win) => {
      x22 = 6;
      y22 = -6;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 2, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 6;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g2/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [-73, 58],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A3");
    cy.window().then(async (win) => {
      let dx = 4,
        dy = -11;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B3");
    cy.window().then(async (win) => {
      x22 = 6;
      y22 = -3;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("change slope");
    cy.window().then(async (win) => {
      slope2 = -3;

      let dx = x22 - x1;
      let dy = y22 - y1;
      d = Math.sqrt(dx * dx + dy * dy);
      theta2 = Math.atan(slope2);
      x22 = x1 + d * Math.cos(theta2);
      y22 = y1 + d * Math.sin(theta2);

      cy.get(cesc("#\\/slope") + " textarea").type(
        "{ctrl+home}{shift+end}{backspace}-3{enter}",
        { force: true },
      );

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 3, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -8,
        dy = 14;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g3/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A4");
    cy.window().then(async (win) => {
      let dx = 5,
        dy = -8;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B4");
    cy.window().then(async (win) => {
      x22 = -4;
      y22 = 4;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 4, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = -1,
        dy = 2;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g4/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point A5");
    cy.window().then(async (win) => {
      let dx = 7,
        dy = -6;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/A",
        args: { x: x1, y: y1 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move point B5");
    cy.window().then(async (win) => {
      x22 = -8;
      y22 = -7;
      slope2 = (y22 - y1) / (x22 - x1);

      theta2 = Math.atan(slope2);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/B",
        args: { x: x22, y: y22 },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });

    cy.log("move line 5, ignores point2 coords");
    cy.window().then(async (win) => {
      let dx = 6,
        dy = 3;
      x1 += dx;
      y1 += dy;
      x22 += dx;
      y22 += dy;

      slope1 = (y21 - y1) / (x21 - x1);

      win.callAction1({
        actionName: "moveLine",
        componentName: "/g5/l",
        args: {
          point1coords: [x1, y1],
          point2coords: [18, 91],
        },
      });

      await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    });
  });

  it("point constrained to line, different scales from graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <line through="(0,0) (1,0.05)" name="l" />
    <point x="100" y="0" name="P">
      <constraints>
        <constrainTo relativeToGraphScales>$l</constrainTo>
      </constraints>
    </point>
  </graph>
  $P{name="P1a"}
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`point on line, close to origin`);

    cy.get(cesc("#\\/P1a") + " .mjx-mrow").should("contain.text", ",0.00");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/P"].stateValues.xs[0];
      let y = stateVariables["/P"].stateValues.xs[1];

      expect(y).greaterThan(0);
      expect(y).lessThan(0.01);

      expect(x).closeTo(20 * y, 1e-10);
    });

    cy.log(`move point`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -100, y: 0.05 },
      });

      cy.get(cesc("#\\/P1a") + " .mjx-mrow").should("contain.text", ",0.04");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let x = stateVariables["/P"].stateValues.xs[0];
        let y = stateVariables["/P"].stateValues.xs[1];
        expect(y).lessThan(0.05);
        expect(y).greaterThan(0.04);
        expect(x).closeTo(20 * y, 1e-10);
      });
    });
  });

  // Testing bug in saving essential state set in definition
  it("reload line", () => {
    let doenetML = `
    <text>a</text>
    <graph>
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line name="l" through="$A $B" />
    </graph>
    <p>$A.coords{assignNames="Ac"}, $B.coords{assignNames="Bc"}</p>
    <p>$l.equation{assignNames="le"}</p>
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

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(1,2)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(3,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 9, y: 8 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 6, y: 7 },
      });
    });

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(9,8)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(6,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([9, 8]);
      expect(stateVariables["/B"].stateValues.xs).eqls([6, 7]);
    });

    cy.wait(2000); // wait for 1 second debounce

    cy.log("reload page");
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    // wait until core is loaded
    cy.waitUntil(() =>
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        return stateVariables["/A"];
      }),
    );

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(9,8)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(6,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([9, 8]);
      expect(stateVariables["/B"].stateValues.xs).eqls([6, 7]);
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 0.5, y: 3.5 },
      });
    });

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(0.5,3.5)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(6,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([0.5, 3.5]);
      expect(stateVariables["/B"].stateValues.xs).eqls([6, 7]);
    });

    cy.wait(2000); // wait for 1 second debounce

    cy.log("reload page");
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    // wait until core is loaded
    cy.waitUntil(() =>
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        return stateVariables["/A"];
      }),
    );

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(0.5,3.5)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(6,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([0.5, 3.5]);
      expect(stateVariables["/B"].stateValues.xs).eqls([6, 7]);
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 8.5, y: 1.5 },
      });
    });

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(8.5,1.5)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(6,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([8.5, 1.5]);
      expect(stateVariables["/B"].stateValues.xs).eqls([6, 7]);
    });
  });

  it("copy propIndex of points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <line through="(2,-3) (3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy prop="points" target="_line1" propIndex="$n" assignNames="P1 P2" /></p>

    <p><copy prop="point2" target="_line1" propIndex="$n" assignNames="x" /></p>
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

    cy.get(cesc("#\\/P1")).should("not.exist");
    cy.get(cesc("#\\/P2")).should("not.exist");
    cy.get(cesc("#\\/x")).should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
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
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
  });

  it("copy propIndex of points, array notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <line through="(2,-3) (3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy source="_line1.points[$n]" assignNames="P1 P2" /></p>

    <p><copy source="_line1.point2[$n]" assignNames="x" /></p>

    <p><copy source="_line1.points[2][$n]" assignNames="xa" /></p>

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

    cy.get(cesc("#\\/P1")).should("not.exist");
    cy.get(cesc("#\\/P2")).should("not.exist");
    cy.get(cesc("#\\/x")).should("not.exist");
    cy.get(cesc("#\\/xa")).should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2x)}`,
    );
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should(
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
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");
  });

  it("display digits and decimals, overwrite in copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <line name="l" equation="0=528.2340235234x + 2.235980242343224y+0.0486234234" />
    <line name="ldg4" displayDigits="4" copySource="l" />
    <line name="ldc3" displayDecimals="3" copySource="l" />
    <line name="ldc3dg4" displayDigits="4" displayDecimals="3" copySource="ldc3" />
    <line name="ldg4dc3" displayDecimals="3" displayDigits="4" copySource="ldg4" />
    <line name="ldg5" displayDigits="5" copySource="ldg4dc3" />
    <line name="ldc4" displayDecimals="4" copySource="ldc3dg4" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/l") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0=528.23x+2.24y+0.0486");
    cy.get(cesc("#\\/ldg4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0=528.2x+2.236y+0.04862");
    cy.get(cesc("#\\/ldc3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0=528.234x+2.236y+0.049");
    cy.get(cesc("#\\/ldc3dg4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0=528.234x+2.236y+0.04862");
    cy.get(cesc("#\\/ldg4dc3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0=528.234x+2.236y+0.04862");
    cy.get(cesc("#\\/ldg5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0=528.23x+2.236y+0.048623");
    cy.get(cesc("#\\/ldc4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0=528.234x+2.236y+0.0486");
  });

  it("label positioning", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <line through="(1,2) (3,4)" labelPosition="$labelPos" name="l">
        <label>$label</label>
      </line>
    </graph>

    <p>label: <textinput name="label" prefill="line segment" /></p>
    <p>position:
    <choiceinput inline preselectChoice="1" name="labelPos">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
    </choiceinput>
    </p>

    <p name="pPos">Position: $l.labelPosition</p>
    <p name="pLabel">Label: $l.label</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    // not sure what to test as don't know how to check renderer...

    cy.get(cesc("#\\/pPos")).should("have.text", "Position: upperright");
    cy.get(cesc("#\\/pLabel")).should("contain.text", "Label: line segment");

    cy.get(cesc("#\\/label_input")).clear().type("nothing{enter}");
    cy.get(cesc("#\\/pLabel")).should("contain.text", "Label: nothing");

    cy.get(cesc("#\\/labelPos")).select("upperLeft");
    cy.get(cesc("#\\/pPos")).should("have.text", "Position: upperleft");
    cy.get(cesc("#\\/labelPos")).select("lowerRight");
    cy.get(cesc("#\\/pPos")).should("have.text", "Position: lowerright");
    cy.get(cesc("#\\/labelPos")).select("lowerLeft");
    cy.get(cesc("#\\/pPos")).should("have.text", "Position: lowerleft");
  });

  it("style description changes with theme", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <line name="A" styleNumber="1" labelIsName through="(0,0) (1,2)" />
      <line name="B" styleNumber="2" labelIsName through="(2,2) (3,4)" />
      <line name="C" styleNumber="5" labelIsName through="(4,4) (5,6)" />
    </graph>
    <p name="Adescrip">Line A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/Adescrip")).should("have.text", "Line A is thick brown.");
    cy.get(cesc("#\\/Bdescrip")).should("have.text", "B is a dark red line.");
    cy.get(cesc("#\\/Cdescrip")).should("have.text", "C is a thin black line.");

    cy.log("set dark mode");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_darkmode").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.get(cesc("#\\/Adescrip")).should("have.text", "Line A is thick yellow.");
    cy.get(cesc("#\\/Bdescrip")).should("have.text", "B is a light red line.");
    cy.get(cesc("#\\/Cdescrip")).should("have.text", "C is a thin white line.");
  });

  it("color line text via style", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
      </styleDefinitions>
    </setup>

    <p>Style number: <mathinput prefill="1" name="sn" /></p>

    <p><line name="no_style">y=x</line> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><line name="fixed_style" stylenumber="2">y=2x</line> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><line name="variable_style" stylenumber="$sn">y=3x</line> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      $no_style{anchor="(1,2)"}
      $fixed_style{anchor="(3,4)"}
      $variable_style
    </graph>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(0, 0, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    // TODO: how to test color in graph

    cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/tsd_variable_style")).should(
      "have.text",
      "red with a blue background",
    );
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "red");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "blue");

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(255, 0, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgb(0, 0, 255)",
    );
  });

  it("line through two points, one constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point name="P" labelIsName>(3,5)
    <constraints><constrainToGrid dx="2" dy="3" /></constraints>
    </point>
  <point name="Q" labelIsName>(-4,-1)</point>
  <line through="$P $Q" />
  </graph>
  $P{name="Pa"}
  $Q{name="Qa"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 4,
      y1 = 6;
    let x2 = -4,
      y2 = -1;

    cy.get(cesc2("#/Pa") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(x1)},${nInDOM(y1)})`,
    );
    cy.get(cesc2("#/Qa") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(x2)},${nInDOM(y2)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs[0]).eq(x1);
      expect(stateVariables["/P"].stateValues.xs[1]).eq(y1);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", x1, y1]);
      expect(stateVariables["/Q"].stateValues.xs[0]).eq(x2);
      expect(stateVariables["/Q"].stateValues.xs[1]).eq(y2);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", x2, y2]);
    });

    cy.log(
      "move line down 4 and right 0.5 actually moves it down 3 and right none",
    );
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      let x1Desired = x1 + dx;
      let y1Desired = y1 + dy;
      let x2Desired = x2 + dx;
      let y2Desired = y2 + dy;

      dx = 0;
      dy = -3;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/_line1",
        args: {
          point1coords: [x1Desired, y1Desired],
          point2coords: [x2Desired, y2Desired],
        },
      });

      cy.get(cesc2("#/Pa") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc2("#/Qa") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs[0]).eq(x1);
      expect(stateVariables["/P"].stateValues.xs[1]).eq(y1);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", x1, y1]);
      expect(stateVariables["/Q"].stateValues.xs[0]).eq(x2);
      expect(stateVariables["/Q"].stateValues.xs[1]).eq(y2);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", x2, y2]);
    });
  });

  it("handle bad through", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <line through="A" />
    </graph>
    `,
        },
        "*",
      );
    });

    // page loads
    cy.get(cesc2("#/_text1")).should("have.text", "a");
  });

  it("line perpendicular to another line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="A1">(3,5)</point>
    <point name="B1">(4,4)</point>
    <line name="l1" through="$A1 $B1" />
    <line name="l2" perpendicularTo="$l1" />
    $l2.points{assignNames="A2 B2"}
  </graph>
  $A1{name="A1a"}
  $B1{name="B1a"}
  $A2{name="A2a"}
  $B2{name="B2a"}
    `,
        },
        "*",
      );
    });

    let A1x = 3;
    let A1y = 5;
    let B1x = 4;
    let B1y = 4;

    let A2x = 0;
    let A2y = 0;
    let B2x = -1 / Math.sqrt(2);
    let B2y = -1 / Math.sqrt(2);

    cy.get(cesc2("#/A1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A1x)},${nInDOM(A1y)})`,
    );
    cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(B1x)},${nInDOM(B1y)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.points[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move l2 down and to the right");
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [A2x, A2y],
          point2coords: [B2x, B2y],
        },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.points[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move A2 up and to the right");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 2;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: A2x, y: A2y },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.points[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B2 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B2y - A2y, B2x - A2x);

      B2x = -4;
      B2y = 6;

      let thetaNew = Math.atan2(B2y - A2y, B2x - A2x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B1 around A1 by same angle,
      // keeping distance the same
      let d1x = B1x - A1x;
      let d1y = B1y - A1y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d1x, d1y] = [c * d1x - s * d1y, s * d1x + c * d1y];

      B1x = A1x + d1x;
      B1y = A1y + d1y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: B2x, y: B2y },
      });

      cy.get(cesc2("#/B2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B2x) / 100)},${nInDOM(
          Math.round(100 * B2y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.points[1][0]).closeTo(
        B1x,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.points[1][1]).closeTo(
        B1y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B1 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B1y - A1y, B1x - A1x);

      B1x = -4;
      B1y = 6;

      let thetaNew = Math.atan2(B1y - A1y, B1x - A1x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B2 around A2 by same angle,
      // keeping distance the same
      let d2x = B2x - A2x;
      let d2y = B2y - A2y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d2x, d2y] = [c * d2x - s * d2y, s * d2x + c * d2y];

      B2x = A2x + d2x;
      B2y = A2y + d2y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: B1x, y: B1y },
      });

      cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B1x) / 100)},${nInDOM(
          Math.round(100 * B1y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.points[1][0]).closeTo(
        B1x,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.points[1][1]).closeTo(
        B1y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });
  });

  it("line parallel to another line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="A1">(3,5)</point>
    <point name="B1">(4,4)</point>
    <line name="l1" through="$A1 $B1" />
    <line name="l2" parallelTo="$l1" />
    $l2.points{assignNames="A2 B2"}
  </graph>
  $A1{name="A1a"}
  $B1{name="B1a"}
  $A2{name="A2a"}
  $B2{name="B2a"}
    `,
        },
        "*",
      );
    });

    let A1x = 3;
    let A1y = 5;
    let B1x = 4;
    let B1y = 4;

    let A2x = 0;
    let A2y = 0;
    let B2x = 1 / Math.sqrt(2);
    let B2y = -1 / Math.sqrt(2);

    cy.get(cesc2("#/A1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A1x)},${nInDOM(A1y)})`,
    );
    cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(B1x)},${nInDOM(B1y)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.points[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move l2 down and to the right");
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [A2x, A2y],
          point2coords: [B2x, B2y],
        },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.points[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move A2 up and to the right");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 2;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: A2x, y: A2y },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.points[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B2 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B2y - A2y, B2x - A2x);

      B2x = -4;
      B2y = 6;

      let thetaNew = Math.atan2(B2y - A2y, B2x - A2x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B1 around A1 by same angle,
      // keeping distance the same
      let d1x = B1x - A1x;
      let d1y = B1y - A1y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d1x, d1y] = [c * d1x - s * d1y, s * d1x + c * d1y];

      B1x = A1x + d1x;
      B1y = A1y + d1y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: B2x, y: B2y },
      });

      cy.get(cesc2("#/B2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B2x) / 100)},${nInDOM(
          Math.round(100 * B2y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.points[1][0]).closeTo(
        B1x,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.points[1][1]).closeTo(
        B1y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B1 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B1y - A1y, B1x - A1x);

      B1x = -4;
      B1y = 6;

      let thetaNew = Math.atan2(B1y - A1y, B1x - A1x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B2 around A2 by same angle,
      // keeping distance the same
      let d2x = B2x - A2x;
      let d2y = B2y - A2y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d2x, d2y] = [c * d2x - s * d2y, s * d2x + c * d2y];

      B2x = A2x + d2x;
      B2y = A2y + d2y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: B1x, y: B1y },
      });

      cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B1x) / 100)},${nInDOM(
          Math.round(100 * B1y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.points[1][0]).closeTo(
        B1x,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.points[1][1]).closeTo(
        B1y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });
  });

  it("line through point perpendicular to line segment", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="A1">(3,5)</point>
    <point name="B1">(4,4)</point>
    <linesegment name="l1" endpoints="$A1 $B1" />
    <point name="A2">(-1,-3)</point>
    <line name="l2" through="$A2" perpendicularTo="$l1" />
    $l2.point2{assignNames="B2"}
  </graph>
  $A1{name="A1a"}
  $B1{name="B1a"}
  $A2{name="A2a"}
  $B2{name="B2a"}
    `,
        },
        "*",
      );
    });

    let A1x = 3;
    let A1y = 5;
    let B1x = 4;
    let B1y = 4;

    let A2x = -1;
    let A2y = -3;
    let B2x = A2x - 1 / Math.sqrt(2);
    let B2y = A2y - 1 / Math.sqrt(2);

    cy.get(cesc2("#/A1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A1x)},${nInDOM(A1y)})`,
    );
    cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(B1x)},${nInDOM(B1y)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoints[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.endpoints[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move l2 down and to the right");
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [A2x, A2y],
          point2coords: [B2x, B2y],
        },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoints[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.endpoints[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move A2 up and to the right");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 2;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: A2x, y: A2y },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoints[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.endpoints[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B2 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B2y - A2y, B2x - A2x);

      B2x = -4;
      B2y = 6;

      let thetaNew = Math.atan2(B2y - A2y, B2x - A2x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B1 around A1 by same angle,
      // keeping distance the same
      let d1x = B1x - A1x;
      let d1y = B1y - A1y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d1x, d1y] = [c * d1x - s * d1y, s * d1x + c * d1y];

      B1x = A1x + d1x;
      B1y = A1y + d1y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: B2x, y: B2y },
      });

      cy.get(cesc2("#/B2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B2x) / 100)},${nInDOM(
          Math.round(100 * B2y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.endpoints[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.endpoints[1][0]).closeTo(
        B1x,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.endpoints[1][1]).closeTo(
        B1y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B1 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B1y - A1y, B1x - A1x);

      B1x = -4;
      B1y = 6;

      let thetaNew = Math.atan2(B1y - A1y, B1x - A1x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B2 around A2 by same angle,
      // keeping distance the same
      let d2x = B2x - A2x;
      let d2y = B2y - A2y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d2x, d2y] = [c * d2x - s * d2y, s * d2x + c * d2y];

      B2x = A2x + d2x;
      B2y = A2y + d2y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: B1x, y: B1y },
      });

      cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B1x) / 100)},${nInDOM(
          Math.round(100 * B1y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.endpoints[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.endpoints[1][0]).closeTo(
        B1x,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.endpoints[1][1]).closeTo(
        B1y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });
  });

  it("line through point parallel to line segment", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="A1">(3,5)</point>
    <point name="B1">(4,4)</point>
    <linesegment name="l1" endpoints="$A1 $B1" />
    <point name="A2">(-1,-3)</point>
    <line name="l2" through="$A2" parallelTo="$l1" />
    $l2.point2{assignNames="B2"}
  </graph>
  $A1{name="A1a"}
  $B1{name="B1a"}
  $A2{name="A2a"}
  $B2{name="B2a"}
    `,
        },
        "*",
      );
    });

    let A1x = 3;
    let A1y = 5;
    let B1x = 4;
    let B1y = 4;

    let A2x = -1;
    let A2y = -3;
    let B2x = A2x + 1 / Math.sqrt(2);
    let B2y = A2y - 1 / Math.sqrt(2);

    cy.get(cesc2("#/A1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A1x)},${nInDOM(A1y)})`,
    );
    cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(B1x)},${nInDOM(B1y)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoints[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.endpoints[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move l2 down and to the right");
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [A2x, A2y],
          point2coords: [B2x, B2y],
        },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoints[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.endpoints[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move A2 up and to the right");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 2;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: A2x, y: A2y },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoints[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.endpoints[1]).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B2 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B2y - A2y, B2x - A2x);

      B2x = -4;
      B2y = 6;

      let thetaNew = Math.atan2(B2y - A2y, B2x - A2x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B1 around A1 by same angle,
      // keeping distance the same
      let d1x = B1x - A1x;
      let d1y = B1y - A1y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d1x, d1y] = [c * d1x - s * d1y, s * d1x + c * d1y];

      B1x = A1x + d1x;
      B1y = A1y + d1y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: B2x, y: B2y },
      });

      cy.get(cesc2("#/B2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B2x) / 100)},${nInDOM(
          Math.round(100 * B2y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.endpoints[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.endpoints[1][0]).closeTo(
        B1x,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.endpoints[1][1]).closeTo(
        B1y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B1 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B1y - A1y, B1x - A1x);

      B1x = -4;
      B1y = 6;

      let thetaNew = Math.atan2(B1y - A1y, B1x - A1x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B2 around A2 by same angle,
      // keeping distance the same
      let d2x = B2x - A2x;
      let d2y = B2y - A2y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d2x, d2y] = [c * d2x - s * d2y, s * d2x + c * d2y];

      B2x = A2x + d2x;
      B2y = A2y + d2y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: B1x, y: B1y },
      });

      cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B1x) / 100)},${nInDOM(
          Math.round(100 * B1y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.endpoints[0]).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.endpoints[1][0]).closeTo(
        B1x,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.endpoints[1][1]).closeTo(
        B1y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });
  });

  it("line through point perpendicular to vector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="A1">(3,5)</point>
    <point name="B1">(4,4)</point>
    <vector name="l1" tail="$A1" head="$B1" />
    <point name="A2">(-1,-3)</point>
    <line name="l2" through="$A2" perpendicularTo="$l1" />
    $l2.point2{assignNames="B2"}
  </graph>
  $A1{name="A1a"}
  $B1{name="B1a"}
  $A2{name="A2a"}
  $B2{name="B2a"}
    `,
        },
        "*",
      );
    });

    let A1x = 3;
    let A1y = 5;
    let B1x = 4;
    let B1y = 4;

    let A2x = -1;
    let A2y = -3;
    let B2x = A2x - 1 / Math.sqrt(2);
    let B2y = A2y - 1 / Math.sqrt(2);

    cy.get(cesc2("#/A1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A1x)},${nInDOM(A1y)})`,
    );
    cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(B1x)},${nInDOM(B1y)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.tail).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.head).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move l2 down and to the right");
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [A2x, A2y],
          point2coords: [B2x, B2y],
        },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.tail).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.head).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move A2 up and to the right");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 2;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: A2x, y: A2y },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.tail).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.head).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B2 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B2y - A2y, B2x - A2x);

      B2x = -4;
      B2y = 6;

      let thetaNew = Math.atan2(B2y - A2y, B2x - A2x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B1 around A1 by same angle,
      // keeping distance the same
      let d1x = B1x - A1x;
      let d1y = B1y - A1y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d1x, d1y] = [c * d1x - s * d1y, s * d1x + c * d1y];

      B1x = A1x + d1x;
      B1y = A1y + d1y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: B2x, y: B2y },
      });

      cy.get(cesc2("#/B2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B2x) / 100)},${nInDOM(
          Math.round(100 * B2y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.tail).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.head[0]).closeTo(B1x, 1e-12);
      expect(stateVariables["/l1"].stateValues.head[1]).closeTo(B1y, 1e-12);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B1 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B1y - A1y, B1x - A1x);

      B1x = -4;
      B1y = 6;

      let thetaNew = Math.atan2(B1y - A1y, B1x - A1x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B2 around A2 by same angle,
      // keeping distance the same
      let d2x = B2x - A2x;
      let d2y = B2y - A2y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d2x, d2y] = [c * d2x - s * d2y, s * d2x + c * d2y];

      B2x = A2x + d2x;
      B2y = A2y + d2y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: B1x, y: B1y },
      });

      cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B1x) / 100)},${nInDOM(
          Math.round(100 * B1y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.tail).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.head[0]).closeTo(B1x, 1e-12);
      expect(stateVariables["/l1"].stateValues.head[1]).closeTo(B1y, 1e-12);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });
  });

  it("line through point parallel to vector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="A1">(3,5)</point>
    <point name="B1">(4,4)</point>
    <vector name="l1" tail="$A1" head="$B1" />
    <point name="A2">(-1,-3)</point>
    <line name="l2" through="$A2" parallelTo="$l1" />
    $l2.point2{assignNames="B2"}
  </graph>
  $A1{name="A1a"}
  $B1{name="B1a"}
  $A2{name="A2a"}
  $B2{name="B2a"}
    `,
        },
        "*",
      );
    });

    let A1x = 3;
    let A1y = 5;
    let B1x = 4;
    let B1y = 4;

    let A2x = -1;
    let A2y = -3;
    let B2x = A2x + 1 / Math.sqrt(2);
    let B2y = A2y - 1 / Math.sqrt(2);

    cy.get(cesc2("#/A1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A1x)},${nInDOM(A1y)})`,
    );
    cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(B1x)},${nInDOM(B1y)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.tail).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.head).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move l2 down and to the right");
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [A2x, A2y],
          point2coords: [B2x, B2y],
        },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.tail).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.head).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move A2 up and to the right");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 2;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: A2x, y: A2y },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.tail).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.head).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B2 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B2y - A2y, B2x - A2x);

      B2x = -4;
      B2y = 6;

      let thetaNew = Math.atan2(B2y - A2y, B2x - A2x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B1 around A1 by same angle,
      // keeping distance the same
      let d1x = B1x - A1x;
      let d1y = B1y - A1y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d1x, d1y] = [c * d1x - s * d1y, s * d1x + c * d1y];

      B1x = A1x + d1x;
      B1y = A1y + d1y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: B2x, y: B2y },
      });

      cy.get(cesc2("#/B2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B2x) / 100)},${nInDOM(
          Math.round(100 * B2y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.tail).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.head[0]).closeTo(B1x, 1e-12);
      expect(stateVariables["/l1"].stateValues.head[1]).closeTo(B1y, 1e-12);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B1 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B1y - A1y, B1x - A1x);

      B1x = -4;
      B1y = 6;

      let thetaNew = Math.atan2(B1y - A1y, B1x - A1x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B2 around A2 by same angle,
      // keeping distance the same
      let d2x = B2x - A2x;
      let d2y = B2y - A2y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d2x, d2y] = [c * d2x - s * d2y, s * d2x + c * d2y];

      B2x = A2x + d2x;
      B2y = A2y + d2y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: B1x, y: B1y },
      });

      cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B1x) / 100)},${nInDOM(
          Math.round(100 * B1y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.tail).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.head[0]).closeTo(B1x, 1e-12);
      expect(stateVariables["/l1"].stateValues.head[1]).closeTo(B1y, 1e-12);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });
  });

  it("line through point perpendicular to ray", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="A1">(3,5)</point>
    <point name="B1">(4,4)</point>
    <ray name="l1" endpoint="$A1" through="$B1" />
    <point name="A2">(-1,-3)</point>
    <line name="l2" through="$A2" perpendicularTo="$l1" />
    $l2.point2{assignNames="B2"}
  </graph>
  $A1{name="A1a"}
  $B1{name="B1a"}
  $A2{name="A2a"}
  $B2{name="B2a"}
    `,
        },
        "*",
      );
    });

    let A1x = 3;
    let A1y = 5;
    let B1x = 4;
    let B1y = 4;

    let A2x = -1;
    let A2y = -3;
    let B2x = A2x - 1 / Math.sqrt(2);
    let B2y = A2y - 1 / Math.sqrt(2);

    cy.get(cesc2("#/A1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A1x)},${nInDOM(A1y)})`,
    );
    cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(B1x)},${nInDOM(B1y)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoint).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.through).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move l2 down and to the right");
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [A2x, A2y],
          point2coords: [B2x, B2y],
        },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoint).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.through).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move A2 up and to the right");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 2;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: A2x, y: A2y },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoint).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.through).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B2 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B2y - A2y, B2x - A2x);

      B2x = -4;
      B2y = 6;

      let thetaNew = Math.atan2(B2y - A2y, B2x - A2x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B1 around A1 by same angle,
      // keeping distance the same
      let d1x = B1x - A1x;
      let d1y = B1y - A1y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d1x, d1y] = [c * d1x - s * d1y, s * d1x + c * d1y];

      B1x = A1x + d1x;
      B1y = A1y + d1y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: B2x, y: B2y },
      });

      cy.get(cesc2("#/B2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B2x) / 100)},${nInDOM(
          Math.round(100 * B2y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.endpoint).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.through[0]).closeTo(B1x, 1e-12);
      expect(stateVariables["/l1"].stateValues.through[1]).closeTo(B1y, 1e-12);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B1 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B1y - A1y, B1x - A1x);

      B1x = -4;
      B1y = 6;

      let thetaNew = Math.atan2(B1y - A1y, B1x - A1x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B2 around A2 by same angle,
      // keeping distance the same
      let d2x = B2x - A2x;
      let d2y = B2y - A2y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d2x, d2y] = [c * d2x - s * d2y, s * d2x + c * d2y];

      B2x = A2x + d2x;
      B2y = A2y + d2y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: B1x, y: B1y },
      });

      cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B1x) / 100)},${nInDOM(
          Math.round(100 * B1y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.endpoint).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.through[0]).closeTo(B1x, 1e-12);
      expect(stateVariables["/l1"].stateValues.through[1]).closeTo(B1y, 1e-12);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });
  });

  it("line through point parallel to ray", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="A1">(3,5)</point>
    <point name="B1">(4,4)</point>
    <ray name="l1" endpoint="$A1" through="$B1" />
    <point name="A2">(-1,-3)</point>
    <line name="l2" through="$A2" parallelTo="$l1" />
    $l2.point2{assignNames="B2"}
  </graph>
  $A1{name="A1a"}
  $B1{name="B1a"}
  $A2{name="A2a"}
  $B2{name="B2a"}
    `,
        },
        "*",
      );
    });

    let A1x = 3;
    let A1y = 5;
    let B1x = 4;
    let B1y = 4;

    let A2x = -1;
    let A2y = -3;
    let B2x = A2x + 1 / Math.sqrt(2);
    let B2y = A2y - 1 / Math.sqrt(2);

    cy.get(cesc2("#/A1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A1x)},${nInDOM(A1y)})`,
    );
    cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(B1x)},${nInDOM(B1y)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoint).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.through).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move l2 down and to the right");
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [A2x, A2y],
          point2coords: [B2x, B2y],
        },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoint).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.through).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move A2 up and to the right");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 2;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: A2x, y: A2y },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.endpoint).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.through).eqls([B1x, B1y]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B2 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B2y - A2y, B2x - A2x);

      B2x = -4;
      B2y = 6;

      let thetaNew = Math.atan2(B2y - A2y, B2x - A2x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B1 around A1 by same angle,
      // keeping distance the same
      let d1x = B1x - A1x;
      let d1y = B1y - A1y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d1x, d1y] = [c * d1x - s * d1y, s * d1x + c * d1y];

      B1x = A1x + d1x;
      B1y = A1y + d1y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: B2x, y: B2y },
      });

      cy.get(cesc2("#/B2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B2x) / 100)},${nInDOM(
          Math.round(100 * B2y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.endpoint).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.through[0]).closeTo(B1x, 1e-12);
      expect(stateVariables["/l1"].stateValues.through[1]).closeTo(B1y, 1e-12);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B1 rotates both lines");
    cy.window().then(async (win) => {
      let thetaOrig = Math.atan2(B1y - A1y, B1x - A1x);

      B1x = -4;
      B1y = 6;

      let thetaNew = Math.atan2(B1y - A1y, B1x - A1x);

      let dTheta = thetaNew - thetaOrig;

      // Rotate B2 around A2 by same angle,
      // keeping distance the same
      let d2x = B2x - A2x;
      let d2y = B2y - A2y;

      let c = Math.cos(dTheta);
      let s = Math.sin(dTheta);

      [d2x, d2y] = [c * d2x - s * d2y, s * d2x + c * d2y];

      B2x = A2x + d2x;
      B2y = A2y + d2y;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: B1x, y: B1y },
      });

      cy.get(cesc2("#/B1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B1x) / 100)},${nInDOM(
          Math.round(100 * B1y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.endpoint).eqls([A1x, A1y]);
      expect(stateVariables["/l1"].stateValues.through[0]).closeTo(B1x, 1e-12);
      expect(stateVariables["/l1"].stateValues.through[1]).closeTo(B1y, 1e-12);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });
  });

  it("3D line parallel to another 3D line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <point name="A1">(3,5,6)</point>
    <point name="B1">(4,4,7)</point>
    <line name="l1" through="$A1 $B1" />
    <line name="l2" parallelTo="$l1" />
    $l2.points{assignNames="A2 B2"}
    `,
        },
        "*",
      );
    });

    let A1x = 3;
    let A1y = 5;
    let A1z = 6;
    let B1x = 4;
    let B1y = 4;
    let B1z = 7;

    let A2x = 0;
    let A2y = 0;
    let A2z = 0;
    let B2x = 1 / Math.sqrt(3);
    let B2y = -1 / Math.sqrt(3);
    let B2z = 1 / Math.sqrt(3);

    cy.get(cesc2("#/A1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A1x)},${nInDOM(A1y)},${nInDOM(A1z)})`,
    );
    cy.get(cesc2("#/B1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(B1x)},${nInDOM(B1y)},${nInDOM(B1z)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y, A1z]);
      expect(stateVariables["/l1"].stateValues.points[1]).eqls([B1x, B1y, B1z]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y, A2z]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][2]).closeTo(
        B2z,
        1e-12,
      );
    });

    cy.log("move A2");
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4,
        dz = 3;

      A2x += dx;
      A2y += dy;
      A2z += dz;
      B2x += dx;
      B2y += dy;
      B2z += dz;

      console.log("move A2");

      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: A2x, y: A2y, z: A2z },
      });

      cy.get(cesc2("#/A2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)},${nInDOM(A2z)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y, A1z]);
      expect(stateVariables["/l1"].stateValues.points[1]).eqls([B1x, B1y, B1z]);
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y, A2z]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][2]).closeTo(
        B2z,
        1e-12,
      );
    });

    cy.log("move B2 rotates both lines");
    cy.window().then(async (win) => {
      // rotate in yz
      let theta = 0.4;

      let d2x = B2x - A2x;
      let d2y = B2y - A2y;
      let d2z = B2z - A2z;

      let c = Math.cos(theta);
      let s = Math.sin(theta);

      [d2y, d2z] = [c * d2y - s * d2z, s * d2y + c * d2z];

      // also stretch B2

      let stretch = 2;
      d2x *= stretch;
      d2y *= stretch;
      d2z *= stretch;

      B2x = A2x + d2x;
      B2y = A2y + d2y;
      B2z = A2z + d2z;

      // Rotate B1 around A1 by same angle,
      // keeping distance the same
      let d1x = B1x - A1x;
      let d1y = B1y - A1y;
      let d1z = B1z - A1z;

      [d1y, d1z] = [c * d1y - s * d1z, s * d1y + c * d1z];

      B1x = A1x + d1x;
      B1y = A1y + d1y;
      B1z = A1z + d1z;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: B2x, y: B2y, z: B2z },
      });

      cy.get(cesc2("#/B2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B2x) / 100)},${nInDOM(
          Math.round(100 * B2y) / 100,
        )},${nInDOM(Math.round(100 * B2z) / 100)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y, A1z]);
      expect(stateVariables["/l1"].stateValues.points[1][0]).closeTo(
        B1x,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.points[1][1]).closeTo(
        B1y,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.points[1][2]).closeTo(
        B1z,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y, A2z]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][2]).closeTo(
        B2z,
        1e-12,
      );
    });

    cy.log("move B1 rotates both lines");
    cy.window().then(async (win) => {
      // rotate in xz

      let theta = 0.7;

      let d1x = B1x - A1x;
      let d1y = B1y - A1y;
      let d1z = B1z - A1z;

      let c = Math.cos(theta);
      let s = Math.sin(theta);

      [d1x, d1z] = [c * d1x - s * d1z, s * d1x + c * d1z];

      // also stretch B1

      let stretch = 3;
      d1x *= stretch;
      d1y *= stretch;
      d1z *= stretch;

      B1x = A1x + d1x;
      B1y = A1y + d1y;
      B1z = A1z + d1z;

      // Rotate B2 around A2 by same angle,
      // keeping distance the same
      let d2x = B2x - A2x;
      let d2y = B2y - A2y;
      let d2z = B2z - A2z;

      [d2x, d2z] = [c * d2x - s * d2z, s * d2x + c * d2z];

      B2x = A2x + d2x;
      B2y = A2y + d2y;
      B2z = A2z + d2z;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: B1x, y: B1y, z: B1z },
      });

      cy.get(cesc2("#/B1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B1x) / 100)},${nInDOM(
          Math.round(100 * B1y) / 100,
        )},${nInDOM(Math.round(100 * B1z) / 100)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l1"].stateValues.points[0]).eqls([A1x, A1y, A1z]);
      expect(stateVariables["/l1"].stateValues.points[1][0]).closeTo(
        B1x,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.points[1][1]).closeTo(
        B1y,
        1e-12,
      );
      expect(stateVariables["/l1"].stateValues.points[1][2]).closeTo(
        B1z,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y, A2z]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][2]).closeTo(
        B2z,
        1e-12,
      );
    });
  });

  it("line through point perpendicular to literal expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="A2">(-1,-3)</point>
    <line name="l2" through="$A2" perpendicularTo="(1,-1)" />
    $l2.point2{assignNames="B2"}
  </graph>
  $A2{name="A2a"}
  $B2{name="B2a"}
    `,
        },
        "*",
      );
    });

    let A2x = -1;
    let A2y = -3;
    let B2x = A2x - 1 / Math.sqrt(2);
    let B2y = A2y - 1 / Math.sqrt(2);

    cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A2x)},${nInDOM(A2y)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move l2 down and to the right");
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [A2x, A2y],
          point2coords: [B2x, B2y],
        },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move A2 up and to the right");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 2;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: A2x, y: A2y },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B2 rotates line");
    cy.window().then(async (win) => {
      B2x = -4;
      B2y = 6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: B2x, y: B2y },
      });

      cy.get(cesc2("#/B2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B2x) / 100)},${nInDOM(
          Math.round(100 * B2y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });
  });

  it("line through point parallel to literal expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="A2">(-1,-3)</point>
    <line name="l2" through="$A2" parallelTo="(1,-1)" />
    $l2.point2{assignNames="B2"}
  </graph>
  $A2{name="A2a"}
  $B2{name="B2a"}
    `,
        },
        "*",
      );
    });

    let A2x = -1;
    let A2y = -3;
    let B2x = A2x + 1 / Math.sqrt(2);
    let B2y = A2y - 1 / Math.sqrt(2);

    cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A2x)},${nInDOM(A2y)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move l2 down and to the right");
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [A2x, A2y],
          point2coords: [B2x, B2y],
        },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move A2 up and to the right");
    cy.window().then(async (win) => {
      let dx = 3,
        dy = 2;

      A2x += dx;
      A2y += dy;
      B2x += dx;
      B2y += dy;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: A2x, y: A2y },
      });

      cy.get(cesc2("#/A2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2x)},${nInDOM(A2y)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });

    cy.log("move B2 rotates line");
    cy.window().then(async (win) => {
      B2x = -4;
      B2y = 6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: B2x, y: B2y },
      });

      cy.get(cesc2("#/B2a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(100 * B2x) / 100)},${nInDOM(
          Math.round(100 * B2y) / 100,
        )})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/l2"].stateValues.points[0]).eqls([A2x, A2y]);
      expect(stateVariables["/l2"].stateValues.points[1][0]).closeTo(
        B2x,
        1e-12,
      );
      expect(stateVariables["/l2"].stateValues.points[1][1]).closeTo(
        B2y,
        1e-12,
      );
    });
  });
});
