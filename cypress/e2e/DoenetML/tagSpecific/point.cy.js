import me from "math-expressions";
import { cesc } from "../../../../src/_utils/url";

describe("Point Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("point sugar a copy", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point>(5,6)</point>
      <point>(1, $_point1.y)</point>
    </graph>
    $_point1.coords{assignNames="coords1"}
    $_point2.coords{assignNames="coords2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(5,6)");
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(1,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs).eqls([5, 6]);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        5,
        6,
      ]);
      expect(stateVariables["/_point2"].stateValues.xs).eqls([1, 6]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        6,
      ]);
    });

    cy.log("move point P to (-1,-7)");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1, y: -7 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(1,−7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -1,
        -7,
      ]);
      expect(stateVariables["/_point2"].stateValues.xs).eqls([1, -7]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        -7,
      ]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        -7,
      ]);
    });
  });

  it("point sugar a copy, with labels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point>(5,6)<label>P</label></point>
      <point><label>Q</label>(1, $_point1.y)</point>
    </graph>
    $_point1.coords{assignNames="coords1"}
    $_point2.coords{assignNames="coords2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(5,6)");
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(1,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs).eqls([5, 6]);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        5,
        6,
      ]);
      expect(stateVariables["/_point1"].stateValues.label).eq("P");
      expect(stateVariables["/_point2"].stateValues.xs).eqls([1, 6]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        6,
      ]);
      expect(stateVariables["/_point2"].stateValues.label).eq("Q");
    });

    cy.log("move point P to (-1,-7)");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1, y: -7 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(1,−7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -1,
        -7,
      ]);
      expect(stateVariables["/_point2"].stateValues.xs).eqls([1, -7]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        -7,
      ]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        -7,
      ]);
    });
  });

  it("coords use a copy", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point>(5,6)</point>
    <point coords="(1, $(_point1.y))" />
  </graph>
  $_point1.coords{assignNames="coords1"}
  $_point2.coords{assignNames="coords2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(5,6)");
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(1,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs).eqls([5, 6]);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        5,
        6,
      ]);
      expect(stateVariables["/_point2"].stateValues.xs).eqls([1, 6]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        6,
      ]);
    });

    cy.log("move point P to (-1,-7)");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1, y: -7 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(1,−7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -1,
        -7,
      ]);
      expect(stateVariables["/_point2"].stateValues.xs).eqls([1, -7]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        -7,
      ]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        -7,
      ]);
    });
  });

  it("coords use a copy with label", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point><label>P</label>(5,6)</point>
    <point coords="(1, $(_point1.y))" ><label>Q</label></point>
  </graph>
  $_point1.coords{assignNames="coords1"}
  $_point2.coords{assignNames="coords2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(5,6)");
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(1,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs).eqls([5, 6]);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        5,
        6,
      ]);
      expect(stateVariables["/_point1"].stateValues.label).eq("P");
      expect(stateVariables["/_point2"].stateValues.xs).eqls([1, 6]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        6,
      ]);
      expect(stateVariables["/_point2"].stateValues.label).eq("Q");
    });

    cy.log("move point P to (-1,-7)");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1, y: -7 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(1,−7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -1,
        -7,
      ]);
      expect(stateVariables["/_point2"].stateValues.xs).eqls([1, -7]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        -7,
      ]);
      expect(stateVariables["/_point2"].stateValues.coords).eqls([
        "vector",
        1,
        -7,
      ]);
    });
  });

  it("label uses a copy", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point><label>P</label>(5,6)</point>
    <point>
      (1,3)
      <label>$_point1.label'</label>
    </point>
  </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`Labels are P and P'`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs).eqls([5, 6]);
      expect(stateVariables["/_point1"].stateValues.label).eq("P");
      expect(stateVariables["/_point2"].stateValues.xs).eqls([1, 3]);
      expect(stateVariables["/_point2"].stateValues.label).eq(`P'`);
    });
  });

  it("label uses a copy 2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point><label>P</label>(5,6)</point>
    <point>
      (1,3)
      <label>$(_point1.label)'</label>
    </point>
  </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`Labels are P and P'`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs).eqls([5, 6]);
      expect(stateVariables["/_point1"].stateValues.label).eq("P");
      expect(stateVariables["/_point2"].stateValues.xs).eqls([1, 3]);
      expect(stateVariables["/_point2"].stateValues.label).eq(`P'`);
    });
  });

  it("labels from labelIsName are preserved when shadowed", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g">
    <point name="P" labelIsName>(5,6)</point>
    <point labelIsName>
      (1,3)
    </point>
  </graph>

  <graph name="g2" copySource="g" newNamespace />

  <graph name="g3">
     $P{name="P3"}
     $_point2{name="Q3"}
  </graph>

  <graph name="g4">
     <copy source="P" assignNames="P4" labelIsName="false" />
     <copy source="_point2" assignNames="Q4" labelIsName="false" />
  </graph>

  <graph copySource="g2" name="g5" newNamespace />
  <graph copySource="g3" name="g6" newNamespace />
  <graph copySource="g4" name="g7" newNamespace />

  <p>P label: <label copySource="P.label" name="Plabel" /></p>
  <p>_point2 label: <label copySource="_point2.label" name="point2label" /></p>
  <p>g2/P label: <label copySource="g2/P.label" name="g2Plabel" /></p>
  <p>g2/_point2 label: <label copySource="g2/_point2.label" name="g2point2label" /></p>
  <p>P3 label: <label copySource="P3.label" name="P3label" /></p>
  <p>Q3 label: <label copySource="Q3.label" name="Q3label" /></p>
  <p>P4 label: <label copySource="P4.label" name="P4label" /></p>
  <p>Q4 label: <label copySource="Q4.label" name="Q4label" /></p>
  <p>g5/P label: <label copySource="g5/P.label" name="g5Plabel" /></p>
  <p>g5/_point2 label: <label copySource="g5/_point2.label" name="g5point2label" /></p>
  <p>g6/P3 label: <label copySource="g6/P3.label" name="g6Plabel" /></p>
  <p>g6/Q3 label: <label copySource="g6/Q3.label" name="g6point2label" /></p>
  <p>g7/P4 label: <label copySource="g7/P4.label" name="g7Plabel" /></p>
  <p>g7/Q4 label: <label copySource="g7/Q4.label" name="g7point2label" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/Plabel")).should("have.text", "P");
    cy.get(cesc("#\\/point2label")).should("have.text", "_point2");
    cy.get(cesc("#\\/g2Plabel")).should("have.text", "P");
    cy.get(cesc("#\\/g2point2label")).should("have.text", "_point2");
    cy.get(cesc("#\\/P3label")).should("have.text", "P");
    cy.get(cesc("#\\/Q3label")).should("have.text", "_point2");
    cy.get(cesc("#\\/P4label")).should("have.text", "P");
    cy.get(cesc("#\\/Q4label")).should("have.text", "_point2");
    cy.get(cesc("#\\/g5Plabel")).should("have.text", "P");
    cy.get(cesc("#\\/g5point2label")).should("have.text", "_point2");
    cy.get(cesc("#\\/g6Plabel")).should("have.text", "P");
    cy.get(cesc("#\\/g6point2label")).should("have.text", "_point2");
    cy.get(cesc("#\\/g7Plabel")).should("have.text", "P");
    cy.get(cesc("#\\/g7point2label")).should("have.text", "_point2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let P2Name = stateVariables["/g2"].activeChildren[0].componentName;
      let Q2Name = stateVariables["/g2"].activeChildren[1].componentName;
      let P5Name = stateVariables["/g5"].activeChildren[0].componentName;
      let Q5Name = stateVariables["/g5"].activeChildren[1].componentName;
      let P6Name = stateVariables["/g6"].activeChildren[0].componentName;
      let Q6Name = stateVariables["/g6"].activeChildren[1].componentName;
      let P7Name = stateVariables["/g7"].activeChildren[0].componentName;
      let Q7Name = stateVariables["/g7"].activeChildren[1].componentName;

      expect(stateVariables["/P"].stateValues.label).eq("P");
      expect(stateVariables["/P"].stateValues.labelForGraph).eq("P");
      expect(stateVariables["/_point2"].stateValues.label).eq(`_point2`);
      expect(stateVariables["/_point2"].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
      expect(stateVariables[P2Name].stateValues.label).eq("P");
      expect(stateVariables[P2Name].stateValues.labelForGraph).eq("P");
      expect(stateVariables[Q2Name].stateValues.label).eq(`_point2`);
      expect(stateVariables[Q2Name].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
      expect(stateVariables["/P3"].stateValues.label).eq("P");
      expect(stateVariables["/P3"].stateValues.labelForGraph).eq("P");
      expect(stateVariables["/Q3"].stateValues.label).eq(`_point2`);
      expect(stateVariables["/Q3"].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
      expect(stateVariables["/P4"].stateValues.label).eq("P");
      expect(stateVariables["/P4"].stateValues.labelForGraph).eq("P");
      expect(stateVariables["/Q4"].stateValues.label).eq(`_point2`);
      expect(stateVariables["/Q4"].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
      expect(stateVariables[P5Name].stateValues.label).eq("P");
      expect(stateVariables[P5Name].stateValues.labelForGraph).eq("P");
      expect(stateVariables[Q5Name].stateValues.label).eq(`_point2`);
      expect(stateVariables[Q5Name].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
      expect(stateVariables[P6Name].stateValues.label).eq("P");
      expect(stateVariables[P6Name].stateValues.labelForGraph).eq("P");
      expect(stateVariables[Q6Name].stateValues.label).eq(`_point2`);
      expect(stateVariables[Q6Name].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
      expect(stateVariables[P7Name].stateValues.label).eq("P");
      expect(stateVariables[P7Name].stateValues.labelForGraph).eq("P");
      expect(stateVariables[Q7Name].stateValues.label).eq(`_point2`);
      expect(stateVariables[Q7Name].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
    });
  });

  it("labelIsName in map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <map>
      <template><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g2" newNamespace>
    <map>
      <template newNamespace><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g3" newNamespace>
    <map assignNames="(A) (B) (C)">
      <template><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g4" newNamespace>
    <map assignNames="(A) (B) (C)">
      <template newNamespace><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g5" newNamespace>
    <map assignNames="A B C">
      <template><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g6" newNamespace>
    <map assignNames="A B C">
      <template newNamespace><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>


  $g1{name="g7"}
  $g2{name="g8"}
  $g3{name="g9"}
  $g4{name="g10"}
  $g5{name="g11"}
  $g6{name="g12"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`Labels are P and P'`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1ChildNames = stateVariables["/g1"].activeChildren.map(
        (x) => x.componentName,
      );
      let g2ChildNames = stateVariables["/g2"].activeChildren.map(
        (x) => x.componentName,
      );
      let g3ChildNames = stateVariables["/g3"].activeChildren.map(
        (x) => x.componentName,
      );
      let g4ChildNames = stateVariables["/g4"].activeChildren.map(
        (x) => x.componentName,
      );
      let g5ChildNames = stateVariables["/g5"].activeChildren.map(
        (x) => x.componentName,
      );
      let g6ChildNames = stateVariables["/g6"].activeChildren.map(
        (x) => x.componentName,
      );
      let g7ChildNames = stateVariables["/g7"].activeChildren.map(
        (x) => x.componentName,
      );
      let g8ChildNames = stateVariables["/g8"].activeChildren.map(
        (x) => x.componentName,
      );
      let g9ChildNames = stateVariables["/g9"].activeChildren.map(
        (x) => x.componentName,
      );
      let g10ChildNames = stateVariables["/g10"].activeChildren.map(
        (x) => x.componentName,
      );
      let g11ChildNames = stateVariables["/g11"].activeChildren.map(
        (x) => x.componentName,
      );
      let g12ChildNames = stateVariables["/g12"].activeChildren.map(
        (x) => x.componentName,
      );

      let g1ChildLabels = Array(5).fill("");
      let g2ChildLabels = Array(5).fill("P");
      let g3ChildLabels = ["A", "B", "C", "", ""];
      let g4ChildLabels = ["A", "B", "C", "P", "P"];
      let g5ChildLabels = Array(5).fill("");
      let g6ChildLabels = Array(5).fill("P");

      for (let [ind, name] of g1ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g1ChildLabels[ind]);
      }
      for (let [ind, name] of g2ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g2ChildLabels[ind]);
      }
      for (let [ind, name] of g3ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g3ChildLabels[ind]);
      }
      for (let [ind, name] of g4ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g4ChildLabels[ind]);
      }
      for (let [ind, name] of g5ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g5ChildLabels[ind]);
      }
      for (let [ind, name] of g6ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g6ChildLabels[ind]);
      }

      for (let [ind, name] of g7ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g1ChildLabels[ind]);
      }
      for (let [ind, name] of g8ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g2ChildLabels[ind]);
      }
      for (let [ind, name] of g9ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g3ChildLabels[ind]);
      }
      for (let [ind, name] of g10ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g4ChildLabels[ind]);
      }
      for (let [ind, name] of g11ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g5ChildLabels[ind]);
      }
      for (let [ind, name] of g12ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g6ChildLabels[ind]);
      }
    });
  });

  it.skip("labels from labelIsName, copy with link=false", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g">
    <point name="P" labelIsName>(5,6)</point>
    <point labelIsName>
      (1,3)
    </point>
  </graph>

  <copy target="g" assignNames="g2" link="false" />

  <graph name="g3">
     <copy target="P" assignNames="P3" link="false" />
     <copy target="_point2" assignNames="Q3" link="false" />
  </graph>

  <copy target="g2" assignNames="g4" link="false" />
  <copy target="g3" assignNames="g5" link="false" />


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`Labels are P and P'`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let P2Name = stateVariables["/g2"].activeChildren[0].componentName;
      let Q2Name = stateVariables["/g2"].activeChildren[1].componentName;
      let P4Name = stateVariables["/g4"].activeChildren[0].componentName;
      let Q4Name = stateVariables["/g4"].activeChildren[1].componentName;
      let P5Name = stateVariables["/g5"].activeChildren[0].componentName;
      let Q5Name = stateVariables["/g5"].activeChildren[1].componentName;

      expect(stateVariables["/P"].stateValues.label).eq("P");
      expect(stateVariables["/P"].stateValues.labelForGraph).eq("P");
      expect(stateVariables["/_point2"].stateValues.label).eq(`_point2`);
      expect(stateVariables["/_point2"].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
      expect(stateVariables[P2Name].stateValues.label).eq("P");
      expect(stateVariables[P2Name].stateValues.labelForGraph).eq("P");
      expect(stateVariables[Q2Name].stateValues.label).eq(`_point2`);
      expect(stateVariables[Q2Name].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
      expect(stateVariables["/P3"].stateValues.label).eq("P");
      expect(stateVariables["/P3"].stateValues.labelForGraph).eq("P");
      expect(stateVariables["/Q3"].stateValues.label).eq(`_point2`);
      expect(stateVariables["/Q3"].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
      expect(stateVariables[P4Name].stateValues.label).eq("P");
      expect(stateVariables[P4Name].stateValues.labelForGraph).eq("P");
      expect(stateVariables[Q4Name].stateValues.label).eq(`_point2`);
      expect(stateVariables[Q4Name].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
      expect(stateVariables[P5Name].stateValues.label).eq("P");
      expect(stateVariables[P5Name].stateValues.labelForGraph).eq("P");
      expect(stateVariables[Q5Name].stateValues.label).eq(`_point2`);
      expect(stateVariables[Q5Name].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
    });
  });

  it("labelIsName in newNamespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g" newNamespace>
    <point name="P" labelIsName>(5,6)</point>
    <point labelIsName>
      (1,3)
    </point>
  </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`Labels are P and P'`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.label).eq("P");
      expect(stateVariables["/g/_point2"].stateValues.label).eq(`_point2`);
      expect(stateVariables["/g/_point2"].stateValues.labelForGraph).eq(
        `&UnderBar;point2`,
      );
    });
  });

  it("labelIsName converts case", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point name="the_first_point" labelIsName>(5,6)</point>
    <point name="the-second-point" labelIsName>(1,3)</point>
    <point name="theThirdPoint" labelIsName>(-2,1)</point>
    <point name="TheFourthPoint" labelIsName>(7,-5)</point>
    <point name="the-FIFTH_Point" labelIsName>(-6,-8)</point>
    <point name="the_SiXiTH-Point" labelIsName>(9,0)</point>
  </graph>

  <p><text copySource="the_first_point" copyProp="label" name="l1" /></p>
  <p><label copySource="the-second-point" copyProp="label" name="l2" /></p>
  <p><text copySource="theThirdPoint" copyProp="label" name="l3" /></p>
  <p><label copySource="TheFourthPoint" copyProp="label" name="l4" /></p>
  <p><text copySource="the-FIFTH_Point" copyProp="label" name="l5" /></p>
  <p><label copySource="the_SiXiTH-Point" copyProp="label" name="l6" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/l1")).should("have.text", "the first point");
    cy.get(cesc("#\\/l2")).should("have.text", "the second point");
    cy.get(cesc("#\\/l3")).should("have.text", "the third point");
    cy.get(cesc("#\\/l4")).should("have.text", "The Fourth Point");
    cy.get(cesc("#\\/l5")).should("have.text", "the FIFTH Point");
    cy.get(cesc("#\\/l6")).should("have.text", "the SiXiTH Point");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/the_first_point"].stateValues.label).eq(
        "the first point",
      );
      expect(stateVariables["/the-second-point"].stateValues.label).eq(
        "the second point",
      );
      expect(stateVariables["/theThirdPoint"].stateValues.label).eq(
        "the third point",
      );
      expect(stateVariables["/TheFourthPoint"].stateValues.label).eq(
        "The Fourth Point",
      );
      expect(stateVariables["/the-FIFTH_Point"].stateValues.label).eq(
        "the FIFTH Point",
      );
      expect(stateVariables["/the_SiXiTH-Point"].stateValues.label).eq(
        "the SiXiTH Point",
      );
    });
  });

  it("labelIsName and copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point name="A" labelIsName />
  </graph>
  <graph>
    <point copySource="A" name="B" />
  </graph>
  <graph>
    $A{name="C"}
  </graph>
  <graph>
    <point copySource="A" name="D" labelIsName/>
  </graph>
  <graph>
    <copy source="A" assignNames="E" labelIsName />
  </graph>
  <graph>
    <point copySource="A" labelIsName/>
  </graph>
  <graph>
    <copy source="A" labelIsName />
  </graph>

  <p><text copySource="A" copyProp="label" name="lA" /></p>
  <p><label copySource="B" copyProp="label" name="lB" /></p>
  <p><text copySource="C" copyProp="label" name="lC" /></p>
  <p><label copySource="D" copyProp="label" name="lD" /></p>
  <p><text copySource="E" copyProp="label" name="lE" /></p>
  <p><label copySource="_point4" copyProp="label" name="lp4" /></p>
  <p><label copySource="_copy3" copyProp="label" name="lc3" /></p>

  <p><textinput bindValueTo="$A.label" name="tiA" /></p>
  <p><textinput bindValueTo="$B.label" name="tiB" /></p>
  <p><textinput bindValueTo="$C.label" name="tiC" /></p>
  <p><textinput bindValueTo="$D.label" name="tiD" /></p>
  <p><textinput bindValueTo="$E.label" name="tiE" /></p>
  <p><textinput bindValueTo="$_point4.label" name="tip4" /></p>
  <p><textinput bindValueTo="$_copy3.label" name="tic3" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/lA")).should("have.text", "A");
    cy.get(cesc("#\\/lB")).should("have.text", "A");
    cy.get(cesc("#\\/lC")).should("have.text", "A");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "E");
    cy.get(cesc("#\\/lp4")).should("have.text", "_point4");
    cy.get(cesc("#\\/lc3")).should("have.text", "A");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/A"].stateValues.labelForGraph).eq("A");
      expect(stateVariables["/B"].stateValues.label).eq("A");
      expect(stateVariables["/B"].stateValues.labelForGraph).eq("A");
      expect(stateVariables["/C"].stateValues.label).eq("A");
      expect(stateVariables["/C"].stateValues.labelForGraph).eq("A");
      expect(stateVariables["/D"].stateValues.label).eq("D");
      expect(stateVariables["/D"].stateValues.labelForGraph).eq("D");
      expect(stateVariables["/E"].stateValues.label).eq("E");
      expect(stateVariables["/E"].stateValues.labelForGraph).eq("E");
      expect(stateVariables["/_point4"].stateValues.label).eq("_point4");
      expect(stateVariables["/_point4"].stateValues.labelForGraph).eq(
        "&UnderBar;point4",
      );
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq("A");
      expect(stateVariables[c3p].stateValues.labelForGraph).eq("A");
    });

    cy.get(cesc("#\\/tiA_input")).type("{end}{backspace}F{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "F");
    cy.get(cesc("#\\/lB")).should("have.text", "F");
    cy.get(cesc("#\\/lC")).should("have.text", "F");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "E");
    cy.get(cesc("#\\/lp4")).should("have.text", "_point4");
    cy.get(cesc("#\\/lc3")).should("have.text", "A");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.label).eq("F");
      expect(stateVariables["/A"].stateValues.labelForGraph).eq("F");
      expect(stateVariables["/B"].stateValues.label).eq("F");
      expect(stateVariables["/B"].stateValues.labelForGraph).eq("F");
      expect(stateVariables["/C"].stateValues.label).eq("F");
      expect(stateVariables["/C"].stateValues.labelForGraph).eq("F");
      expect(stateVariables["/D"].stateValues.label).eq("D");
      expect(stateVariables["/D"].stateValues.labelForGraph).eq("D");
      expect(stateVariables["/E"].stateValues.label).eq("E");
      expect(stateVariables["/E"].stateValues.labelForGraph).eq("E");
      expect(stateVariables["/_point4"].stateValues.label).eq("_point4");
      expect(stateVariables["/_point4"].stateValues.labelForGraph).eq(
        "&UnderBar;point4",
      );
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq("A");
      expect(stateVariables[c3p].stateValues.labelForGraph).eq("A");
    });

    cy.get(cesc("#\\/tiB_input")).type("{end}{backspace}G{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "G");
    cy.get(cesc("#\\/lB")).should("have.text", "G");
    cy.get(cesc("#\\/lC")).should("have.text", "G");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "E");
    cy.get(cesc("#\\/lp4")).should("have.text", "_point4");
    cy.get(cesc("#\\/lc3")).should("have.text", "A");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.label).eq("G");
      expect(stateVariables["/A"].stateValues.labelForGraph).eq("G");
      expect(stateVariables["/B"].stateValues.label).eq("G");
      expect(stateVariables["/B"].stateValues.labelForGraph).eq("G");
      expect(stateVariables["/C"].stateValues.label).eq("G");
      expect(stateVariables["/C"].stateValues.labelForGraph).eq("G");
      expect(stateVariables["/D"].stateValues.label).eq("D");
      expect(stateVariables["/D"].stateValues.labelForGraph).eq("D");
      expect(stateVariables["/E"].stateValues.label).eq("E");
      expect(stateVariables["/E"].stateValues.labelForGraph).eq("E");
      expect(stateVariables["/_point4"].stateValues.label).eq("_point4");
      expect(stateVariables["/_point4"].stateValues.labelForGraph).eq(
        "&UnderBar;point4",
      );
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq("A");
      expect(stateVariables[c3p].stateValues.labelForGraph).eq("A");
    });

    cy.get(cesc("#\\/tiC_input")).type("{end}{backspace}H{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "H");
    cy.get(cesc("#\\/lB")).should("have.text", "H");
    cy.get(cesc("#\\/lC")).should("have.text", "H");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "E");
    cy.get(cesc("#\\/lp4")).should("have.text", "_point4");
    cy.get(cesc("#\\/lc3")).should("have.text", "A");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.label).eq("H");
      expect(stateVariables["/A"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/B"].stateValues.label).eq("H");
      expect(stateVariables["/B"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/C"].stateValues.label).eq("H");
      expect(stateVariables["/C"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/D"].stateValues.label).eq("D");
      expect(stateVariables["/D"].stateValues.labelForGraph).eq("D");
      expect(stateVariables["/E"].stateValues.label).eq("E");
      expect(stateVariables["/E"].stateValues.labelForGraph).eq("E");
      expect(stateVariables["/_point4"].stateValues.label).eq("_point4");
      expect(stateVariables["/_point4"].stateValues.labelForGraph).eq(
        "&UnderBar;point4",
      );
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq("A");
      expect(stateVariables[c3p].stateValues.labelForGraph).eq("A");
    });

    cy.get(cesc("#\\/tiD_input")).type("{end}{backspace}I{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "H");
    cy.get(cesc("#\\/lB")).should("have.text", "H");
    cy.get(cesc("#\\/lC")).should("have.text", "H");
    cy.get(cesc("#\\/lD")).should("have.text", "I");
    cy.get(cesc("#\\/lE")).should("have.text", "E");
    cy.get(cesc("#\\/lp4")).should("have.text", "_point4");
    cy.get(cesc("#\\/lc3")).should("have.text", "A");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.label).eq("H");
      expect(stateVariables["/A"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/B"].stateValues.label).eq("H");
      expect(stateVariables["/B"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/C"].stateValues.label).eq("H");
      expect(stateVariables["/C"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/D"].stateValues.label).eq("I");
      expect(stateVariables["/D"].stateValues.labelForGraph).eq("I");
      expect(stateVariables["/E"].stateValues.label).eq("E");
      expect(stateVariables["/E"].stateValues.labelForGraph).eq("E");
      expect(stateVariables["/_point4"].stateValues.label).eq("_point4");
      expect(stateVariables["/_point4"].stateValues.labelForGraph).eq(
        "&UnderBar;point4",
      );
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq("A");
      expect(stateVariables[c3p].stateValues.labelForGraph).eq("A");
    });

    cy.get(cesc("#\\/tiE_input")).type("{end}{backspace}J{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "H");
    cy.get(cesc("#\\/lB")).should("have.text", "H");
    cy.get(cesc("#\\/lC")).should("have.text", "H");
    cy.get(cesc("#\\/lD")).should("have.text", "I");
    cy.get(cesc("#\\/lE")).should("have.text", "J");
    cy.get(cesc("#\\/lp4")).should("have.text", "_point4");
    cy.get(cesc("#\\/lc3")).should("have.text", "A");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.label).eq("H");
      expect(stateVariables["/A"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/B"].stateValues.label).eq("H");
      expect(stateVariables["/B"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/C"].stateValues.label).eq("H");
      expect(stateVariables["/C"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/D"].stateValues.label).eq("I");
      expect(stateVariables["/D"].stateValues.labelForGraph).eq("I");
      expect(stateVariables["/E"].stateValues.label).eq("J");
      expect(stateVariables["/E"].stateValues.labelForGraph).eq("J");
      expect(stateVariables["/_point4"].stateValues.label).eq("_point4");
      expect(stateVariables["/_point4"].stateValues.labelForGraph).eq(
        "&UnderBar;point4",
      );
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq("A");
      expect(stateVariables[c3p].stateValues.labelForGraph).eq("A");
    });

    cy.get(cesc("#\\/tip4_input")).type(
      "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}K{enter}",
    );

    cy.get(cesc("#\\/lA")).should("have.text", "H");
    cy.get(cesc("#\\/lB")).should("have.text", "H");
    cy.get(cesc("#\\/lC")).should("have.text", "H");
    cy.get(cesc("#\\/lD")).should("have.text", "I");
    cy.get(cesc("#\\/lE")).should("have.text", "J");
    cy.get(cesc("#\\/lp4")).should("have.text", "K");
    cy.get(cesc("#\\/lc3")).should("have.text", "A");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.label).eq("H");
      expect(stateVariables["/A"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/B"].stateValues.label).eq("H");
      expect(stateVariables["/B"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/C"].stateValues.label).eq("H");
      expect(stateVariables["/C"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/D"].stateValues.label).eq("I");
      expect(stateVariables["/D"].stateValues.labelForGraph).eq("I");
      expect(stateVariables["/E"].stateValues.label).eq("J");
      expect(stateVariables["/E"].stateValues.labelForGraph).eq("J");
      expect(stateVariables["/_point4"].stateValues.label).eq("K");
      expect(stateVariables["/_point4"].stateValues.labelForGraph).eq("K");
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq("A");
      expect(stateVariables[c3p].stateValues.labelForGraph).eq("A");
    });

    cy.get(cesc("#\\/tic3_input")).type("{end}{backspace}L{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "H");
    cy.get(cesc("#\\/lB")).should("have.text", "H");
    cy.get(cesc("#\\/lC")).should("have.text", "H");
    cy.get(cesc("#\\/lD")).should("have.text", "I");
    cy.get(cesc("#\\/lE")).should("have.text", "J");
    cy.get(cesc("#\\/lp4")).should("have.text", "K");
    cy.get(cesc("#\\/lc3")).should("have.text", "L");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.label).eq("H");
      expect(stateVariables["/A"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/B"].stateValues.label).eq("H");
      expect(stateVariables["/B"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/C"].stateValues.label).eq("H");
      expect(stateVariables["/C"].stateValues.labelForGraph).eq("H");
      expect(stateVariables["/D"].stateValues.label).eq("I");
      expect(stateVariables["/D"].stateValues.labelForGraph).eq("I");
      expect(stateVariables["/E"].stateValues.label).eq("J");
      expect(stateVariables["/E"].stateValues.labelForGraph).eq("J");
      expect(stateVariables["/_point4"].stateValues.label).eq("K");
      expect(stateVariables["/_point4"].stateValues.labelForGraph).eq("K");
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq("L");
      expect(stateVariables[c3p].stateValues.labelForGraph).eq("L");
    });
  });

  it("label, labelIsName and copies, start with label", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <graph>
  
    <point name="A">
      <label>A</label>
    </point>
    <point copysource="A" name="B" x="1" />
    <point copysource="A" labelIsName name="C" x="2" />
    <point copysource="A" name="D" x="3"><label>D</label></point>

    <point copysource="B" name="E" x="1" y="1" />
    <point copysource="B" labelIsName name="F" x="2" y="1" />
    <point copysource="B" name="G" x="3" y="1"><label>G</label></point>

    <point copysource="C" name="H" x="1" y="2" />
    <point copysource="C" labelIsName name="I" x="2" y="2" />
    <point copysource="C" name="J" x="3" y="2"><label>J</label></point>

    <point copysource="D" name="K" x="1" y="3" />
    <point copysource="D" labelIsName name="L" x="2" y="3" />
    <point copysource="D" name="M" x="3" y="3"><label>M</label></point>

  </graph>

  <p><text copySource="A.label" name="lA" /></p>
  <p><text copySource="B.label" name="lB" /></p>
  <p><text copySource="C.label" name="lC" /></p>
  <p><text copySource="D.label" name="lD" /></p>
  <p><text copySource="E.label" name="lE" /></p>
  <p><text copySource="F.label" name="lF" /></p>
  <p><text copySource="G.label" name="lG" /></p>
  <p><text copySource="H.label" name="lH" /></p>
  <p><text copySource="I.label" name="lI" /></p>
  <p><text copySource="J.label" name="lJ" /></p>
  <p><text copySource="K.label" name="lK" /></p>
  <p><text copySource="L.label" name="lL" /></p>
  <p><text copySource="M.label" name="lM" /></p>

  <p>Change label of A: <textinput bindValueTo="$A.label" name="tiA" /></p>
  <p>Change label of B: <textinput bindValueTo="$B.label" name="tiB" /></p>
  <p>Change label of C: <textinput bindValueTo="$C.label" name="tiC" /></p>
  <p>Change label of D: <textinput bindValueTo="$D.label" name="tiD" /></p>
  <p>Change label of E: <textinput bindValueTo="$E.label" name="tiE" /></p>
  <p>Change label of F: <textinput bindValueTo="$F.label" name="tiF" /></p>
  <p>Change label of G: <textinput bindValueTo="$G.label" name="tiG" /></p>
  <p>Change label of H: <textinput bindValueTo="$H.label" name="tiH" /></p>
  <p>Change label of I: <textinput bindValueTo="$I.label" name="tiI" /></p>
  <p>Change label of J: <textinput bindValueTo="$J.label" name="tiJ" /></p>
  <p>Change label of K: <textinput bindValueTo="$K.label" name="tiK" /></p>
  <p>Change label of L: <textinput bindValueTo="$L.label" name="tiL" /></p>
  <p>Change label of M: <textinput bindValueTo="$M.label" name="tiM" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/lA")).should("have.text", "A");
    cy.get(cesc("#\\/lB")).should("have.text", "A");
    cy.get(cesc("#\\/lC")).should("have.text", "C");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "A");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "C");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiA_input")).type("{end}{backspace}N{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "N");
    cy.get(cesc("#\\/lB")).should("have.text", "N");
    cy.get(cesc("#\\/lC")).should("have.text", "C");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "N");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "C");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiB_input")).type("{end}{backspace}O{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "O");
    cy.get(cesc("#\\/lB")).should("have.text", "O");
    cy.get(cesc("#\\/lC")).should("have.text", "C");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "O");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "C");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiC_input")).type("{end}{backspace}P{enter}");

    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lA")).should("have.text", "O");
    cy.get(cesc("#\\/lB")).should("have.text", "O");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "O");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiD_input")).type("{end}{backspace}Q{enter}");

    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lA")).should("have.text", "O");
    cy.get(cesc("#\\/lB")).should("have.text", "O");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lE")).should("have.text", "O");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiE_input")).type("{end}{backspace}R{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiF_input")).type("{end}{backspace}S{enter}");

    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiG_input")).type("{end}{backspace}T{enter}");

    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiH_input")).type("{end}{backspace}U{enter}");

    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiI_input")).type("{end}{backspace}V{enter}");

    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiJ_input")).type("{end}{backspace}W{enter}");

    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiK_input")).type("{end}{backspace}X{enter}");

    cy.get(cesc("#\\/lK")).should("have.text", "X");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "X");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiL_input")).type("{end}{backspace}Y{enter}");

    cy.get(cesc("#\\/lL")).should("have.text", "Y");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "X");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lK")).should("have.text", "X");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiM_input")).type("{end}{backspace}Z{enter}");

    cy.get(cesc("#\\/lM")).should("have.text", "Z");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "X");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lK")).should("have.text", "X");
    cy.get(cesc("#\\/lL")).should("have.text", "Y");
  });

  it("label, labelIsName and copies, start with labelIsName", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <graph>
  
    <point name="A" labelIsName />
    <point copysource="A" name="B" x="1" />
    <point copysource="A" labelIsName name="C" x="2" />
    <point copysource="A" name="D" x="3"><label>D</label></point>

    <point copysource="B" name="E" x="1" y="1" />
    <point copysource="B" labelIsName name="F" x="2" y="1" />
    <point copysource="B" name="G" x="3" y="1"><label>G</label></point>

    <point copysource="C" name="H" x="1" y="2" />
    <point copysource="C" labelIsName name="I" x="2" y="2" />
    <point copysource="C" name="J" x="3" y="2"><label>J</label></point>

    <point copysource="D" name="K" x="1" y="3" />
    <point copysource="D" labelIsName name="L" x="2" y="3" />
    <point copysource="D" name="M" x="3" y="3"><label>M</label></point>

  </graph>

  <p><text copySource="A.label" name="lA" /></p>
  <p><text copySource="B.label" name="lB" /></p>
  <p><text copySource="C.label" name="lC" /></p>
  <p><text copySource="D.label" name="lD" /></p>
  <p><text copySource="E.label" name="lE" /></p>
  <p><text copySource="F.label" name="lF" /></p>
  <p><text copySource="G.label" name="lG" /></p>
  <p><text copySource="H.label" name="lH" /></p>
  <p><text copySource="I.label" name="lI" /></p>
  <p><text copySource="J.label" name="lJ" /></p>
  <p><text copySource="K.label" name="lK" /></p>
  <p><text copySource="L.label" name="lL" /></p>
  <p><text copySource="M.label" name="lM" /></p>

  <p>Change label of A: <textinput bindValueTo="$A.label" name="tiA" /></p>
  <p>Change label of B: <textinput bindValueTo="$B.label" name="tiB" /></p>
  <p>Change label of C: <textinput bindValueTo="$C.label" name="tiC" /></p>
  <p>Change label of D: <textinput bindValueTo="$D.label" name="tiD" /></p>
  <p>Change label of E: <textinput bindValueTo="$E.label" name="tiE" /></p>
  <p>Change label of F: <textinput bindValueTo="$F.label" name="tiF" /></p>
  <p>Change label of G: <textinput bindValueTo="$G.label" name="tiG" /></p>
  <p>Change label of H: <textinput bindValueTo="$H.label" name="tiH" /></p>
  <p>Change label of I: <textinput bindValueTo="$I.label" name="tiI" /></p>
  <p>Change label of J: <textinput bindValueTo="$J.label" name="tiJ" /></p>
  <p>Change label of K: <textinput bindValueTo="$K.label" name="tiK" /></p>
  <p>Change label of L: <textinput bindValueTo="$L.label" name="tiL" /></p>
  <p>Change label of M: <textinput bindValueTo="$M.label" name="tiM" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/lA")).should("have.text", "A");
    cy.get(cesc("#\\/lB")).should("have.text", "A");
    cy.get(cesc("#\\/lC")).should("have.text", "C");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "A");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "C");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiA_input")).type("{end}{backspace}N{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "N");
    cy.get(cesc("#\\/lB")).should("have.text", "N");
    cy.get(cesc("#\\/lC")).should("have.text", "C");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "N");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "C");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiB_input")).type("{end}{backspace}O{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "O");
    cy.get(cesc("#\\/lB")).should("have.text", "O");
    cy.get(cesc("#\\/lC")).should("have.text", "C");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "O");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "C");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiC_input")).type("{end}{backspace}P{enter}");

    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lA")).should("have.text", "O");
    cy.get(cesc("#\\/lB")).should("have.text", "O");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "O");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiD_input")).type("{end}{backspace}Q{enter}");

    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lA")).should("have.text", "O");
    cy.get(cesc("#\\/lB")).should("have.text", "O");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lE")).should("have.text", "O");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiE_input")).type("{end}{backspace}R{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiF_input")).type("{end}{backspace}S{enter}");

    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiG_input")).type("{end}{backspace}T{enter}");

    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiH_input")).type("{end}{backspace}U{enter}");

    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiI_input")).type("{end}{backspace}V{enter}");

    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiJ_input")).type("{end}{backspace}W{enter}");

    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiK_input")).type("{end}{backspace}X{enter}");

    cy.get(cesc("#\\/lK")).should("have.text", "X");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "X");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiL_input")).type("{end}{backspace}Y{enter}");

    cy.get(cesc("#\\/lL")).should("have.text", "Y");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "X");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lK")).should("have.text", "X");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiM_input")).type("{end}{backspace}Z{enter}");

    cy.get(cesc("#\\/lM")).should("have.text", "Z");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "X");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lK")).should("have.text", "X");
    cy.get(cesc("#\\/lL")).should("have.text", "Y");
  });

  it("label, labelIsName and copies, copy in labels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <graph>
  
    <point name="A" >
      <label copySource="Al" />
    </point>
    <point copysource="A" name="B" x="1" />
    <point copysource="A" labelIsName name="C" x="2" />
    <point copysource="A" name="D" x="3"><label copySource="Dl"/></point>

    <point copysource="B" name="E" x="1" y="1" />
    <point copysource="B" labelIsName name="F" x="2" y="1" />
    <point copysource="B" name="G" x="3" y="1"><label copysource="Gl" /></point>

    <point copysource="C" name="H" x="1" y="2" />
    <point copysource="C" labelIsName name="I" x="2" y="2" />
    <point copysource="C" name="J" x="3" y="2"><label copySource="Jl" /></point>

    <point copysource="D" name="K" x="1" y="3" />
    <point copysource="D" labelIsName name="L" x="2" y="3" />
    <point copysource="D" name="M" x="3" y="3"><label>M</label></point>

  </graph>

  <label name="Al0">A</label>
  <label name="Al" copySource="Al0" />
  <label name="Dl">D</label>
  <label name="Gl0">G</label>
  <label name="Gl" copySource="Gl0" />
  <label name="Jl0">J</label>
  <label name="Jl1" copySource="Jl0" />
  <label name="Jl" copySource="Jl1" />


  <p><text copySource="A.label" name="lA" /></p>
  <p><text copySource="B.label" name="lB" /></p>
  <p><text copySource="C.label" name="lC" /></p>
  <p><text copySource="D.label" name="lD" /></p>
  <p><text copySource="E.label" name="lE" /></p>
  <p><text copySource="F.label" name="lF" /></p>
  <p><text copySource="G.label" name="lG" /></p>
  <p><text copySource="H.label" name="lH" /></p>
  <p><text copySource="I.label" name="lI" /></p>
  <p><text copySource="J.label" name="lJ" /></p>
  <p><text copySource="K.label" name="lK" /></p>
  <p><text copySource="L.label" name="lL" /></p>
  <p><text copySource="M.label" name="lM" /></p>

  <p>Change label of A: <textinput bindValueTo="$A.label" name="tiA" /></p>
  <p>Change label of B: <textinput bindValueTo="$B.label" name="tiB" /></p>
  <p>Change label of C: <textinput bindValueTo="$C.label" name="tiC" /></p>
  <p>Change label of D: <textinput bindValueTo="$D.label" name="tiD" /></p>
  <p>Change label of E: <textinput bindValueTo="$E.label" name="tiE" /></p>
  <p>Change label of F: <textinput bindValueTo="$F.label" name="tiF" /></p>
  <p>Change label of G: <textinput bindValueTo="$G.label" name="tiG" /></p>
  <p>Change label of H: <textinput bindValueTo="$H.label" name="tiH" /></p>
  <p>Change label of I: <textinput bindValueTo="$I.label" name="tiI" /></p>
  <p>Change label of J: <textinput bindValueTo="$J.label" name="tiJ" /></p>
  <p>Change label of K: <textinput bindValueTo="$K.label" name="tiK" /></p>
  <p>Change label of L: <textinput bindValueTo="$L.label" name="tiL" /></p>
  <p>Change label of M: <textinput bindValueTo="$M.label" name="tiM" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/lA")).should("have.text", "A");
    cy.get(cesc("#\\/lB")).should("have.text", "A");
    cy.get(cesc("#\\/lC")).should("have.text", "C");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "A");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "C");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiA_input")).type("{end}{backspace}N{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "N");
    cy.get(cesc("#\\/lB")).should("have.text", "N");
    cy.get(cesc("#\\/lC")).should("have.text", "C");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "N");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "C");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiB_input")).type("{end}{backspace}O{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "O");
    cy.get(cesc("#\\/lB")).should("have.text", "O");
    cy.get(cesc("#\\/lC")).should("have.text", "C");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "O");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "C");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiC_input")).type("{end}{backspace}P{enter}");

    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lA")).should("have.text", "O");
    cy.get(cesc("#\\/lB")).should("have.text", "O");
    cy.get(cesc("#\\/lD")).should("have.text", "D");
    cy.get(cesc("#\\/lE")).should("have.text", "O");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "D");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiD_input")).type("{end}{backspace}Q{enter}");

    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lA")).should("have.text", "O");
    cy.get(cesc("#\\/lB")).should("have.text", "O");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lE")).should("have.text", "O");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiE_input")).type("{end}{backspace}R{enter}");

    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "F");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiF_input")).type("{end}{backspace}S{enter}");

    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lG")).should("have.text", "G");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiG_input")).type("{end}{backspace}T{enter}");

    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "P");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lH")).should("have.text", "P");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiH_input")).type("{end}{backspace}U{enter}");

    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "I");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiI_input")).type("{end}{backspace}V{enter}");

    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lJ")).should("have.text", "J");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiJ_input")).type("{end}{backspace}W{enter}");

    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "Q");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lK")).should("have.text", "Q");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiK_input")).type("{end}{backspace}X{enter}");

    cy.get(cesc("#\\/lK")).should("have.text", "X");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "X");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lL")).should("have.text", "L");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiL_input")).type("{end}{backspace}Y{enter}");

    cy.get(cesc("#\\/lL")).should("have.text", "Y");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "X");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lK")).should("have.text", "X");
    cy.get(cesc("#\\/lM")).should("have.text", "M");

    cy.get(cesc("#\\/tiM_input")).type("{end}{backspace}Z{enter}");

    cy.get(cesc("#\\/lM")).should("have.text", "Z");
    cy.get(cesc("#\\/lA")).should("have.text", "R");
    cy.get(cesc("#\\/lB")).should("have.text", "R");
    cy.get(cesc("#\\/lC")).should("have.text", "U");
    cy.get(cesc("#\\/lD")).should("have.text", "X");
    cy.get(cesc("#\\/lE")).should("have.text", "R");
    cy.get(cesc("#\\/lF")).should("have.text", "S");
    cy.get(cesc("#\\/lG")).should("have.text", "T");
    cy.get(cesc("#\\/lH")).should("have.text", "U");
    cy.get(cesc("#\\/lI")).should("have.text", "V");
    cy.get(cesc("#\\/lJ")).should("have.text", "W");
    cy.get(cesc("#\\/lK")).should("have.text", "X");
    cy.get(cesc("#\\/lL")).should("have.text", "Y");
  });

  it("escape underscore and caret in labelForGraph except if math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point name="A" >
      <label>x_1</label>
      (0,0)
    </point>
    <point name="B" >
      <label><m>x_1</m></label>
      (1,1)
    </point>
    <point name="C" >
      <label>x^1</label>
      (2,2)
    </point>
    <point name="D" >
      <label><m>x^1</m></label>
      (3,3)
    </point>
    <point name="E" >
      <label>x^1 or <m>x^2</m> or x_3 or <m>x_4</m></label>
      (4,4)
    </point>
    <point name="F" >
      <label>x_a^b or <m>x_c^d</m></label>
      (5,5)
    </point>
  </graph>

  <p>label for A: <label copySource="A" copyProp="label" name="lA" /></p>
  <p>label for B: <label copySource="B" copyProp="label" name="lB" /></p>
  <p>label for C: <label copySource="C" copyProp="label" name="lC" /></p>
  <p>label for D: <label copySource="D" copyProp="label" name="lD" /></p>
  <p>label for E: <label copySource="E" copyProp="label" name="lE" /></p>
  <p>label for F: <label copySource="F" copyProp="label" name="lF" /></p>
  <p>text of label for A: <text copySource="A" copyProp="label" name="tA" /></p>
  <p>text of label for B: <text copySource="B" copyProp="label" name="tB" /></p>
  <p>text of label for C: <text copySource="C" copyProp="label" name="tC" /></p>
  <p>text of label for D: <text copySource="D" copyProp="label" name="tD" /></p>
  <p>text of label for E: <text copySource="E" copyProp="label" name="tE" /></p>
  <p>text of label for F: <text copySource="F" copyProp="label" name="tF" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/lA")).should("have.text", "x_1");
    cy.get(cesc("#\\/lB") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x1");
    cy.get(cesc("#\\/lC")).should("have.text", "x^1");
    cy.get(cesc("#\\/lD") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x1");
    cy.get(cesc("#\\/lE")).should("contain.text", "x^1 or ");
    cy.get(cesc("#\\/lE")).should("contain.text", "or x_3 or ");
    cy.get(cesc("#\\/lE") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x2");
    cy.get(cesc("#\\/lE") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "x4");
    cy.get(cesc("#\\/lF")).should("contain.text", "x_a^b or ");
    cy.get(cesc("#\\/lF") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "xdc");

    cy.get(cesc("#\\/tA")).should("have.text", "x_1");
    cy.get(cesc("#\\/tB")).should("have.text", "x_1");
    cy.get(cesc("#\\/tC")).should("have.text", "x^1");
    cy.get(cesc("#\\/tD")).should("have.text", "x^1");
    cy.get(cesc("#\\/tE")).should("have.text", "x^1 or x^2 or x_3 or x_4");
    cy.get(cesc("#\\/tF")).should("have.text", "x_a^b or x_c^d");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.label).eq("x_1");
      expect(stateVariables["/A"].stateValues.labelForGraph).eq("x&UnderBar;1");
      expect(stateVariables["/B"].stateValues.label).eq("\\(x_1\\)");
      expect(stateVariables["/B"].stateValues.labelForGraph).eq("\\(x_1\\)");
      expect(stateVariables["/C"].stateValues.label).eq("x^1");
      expect(stateVariables["/C"].stateValues.labelForGraph).eq("x&Hat;1");
      expect(stateVariables["/D"].stateValues.label).eq("\\(x^1\\)");
      expect(stateVariables["/D"].stateValues.labelForGraph).eq("\\(x^1\\)");
      expect(stateVariables["/E"].stateValues.label).eq(
        "x^1 or \\(x^2\\) or x_3 or \\(x_4\\)",
      );
      expect(stateVariables["/E"].stateValues.labelForGraph).eq(
        "x&Hat;1 or \\(x^2\\) or x&UnderBar;3 or \\(x_4\\)",
      );
      expect(stateVariables["/F"].stateValues.label).eq("x_a^b or \\(x_c^d\\)");
      expect(stateVariables["/F"].stateValues.labelForGraph).eq(
        "x&UnderBar;a&Hat;b or \\(x_c^d\\)",
      );
    });
  });

  it("point sugar from single copied math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="coords" />
    <graph>
      <point name="P" labelIsName>$(coords.value{createComponentOfType="math"})</point>
    </graph>
    <graph>
      <copy target="P" assignNames="Q" labelIsName/>
    </graph>
    $P.coords{assignNames="Pcoords"}
    $Q.coords{assignNames="Qcoords"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("initially undefined");

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "\uff3f");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "\uff3f");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/P"].stateValues.coords).eqls("\uff3f");
      expect(stateVariables["/Q"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/Q"].stateValues.coords).eqls("\uff3f");
    });

    cy.log("create 2D point");
    cy.get(cesc("#\\/coords") + " textarea").type("(-1,-7){enter}", {
      force: true,
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", -1, -7]);
      expect(stateVariables["/P"].stateValues.label).eq("P");
      expect(stateVariables["/Q"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", -1, -7]);
      expect(stateVariables["/Q"].stateValues.label).eq("Q");
    });

    cy.log("move point P to (3,5)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 5 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(3,5)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(3,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([3, 5]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 3, 5]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([3, 5]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 3, 5]);
    });

    cy.log("move point Q to (9,1)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: 9, y: 1 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(9,1)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(9,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([9, 1]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 9, 1]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([9, 1]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 9, 1]);
    });

    cy.log("make point undefined again");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "\uff3f");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "\uff3f");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/P"].stateValues.coords).eqls("\uff3f");
      expect(stateVariables["/Q"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/Q"].stateValues.coords).eqls("\uff3f");
    });

    cy.log("create 1D point");
    cy.get(cesc("#\\/coords") + " textarea").type("-3{enter}", { force: true });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "−3");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "−3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([-3]);
      expect(stateVariables["/P"].stateValues.coords).eqls(-3);
      expect(stateVariables["/Q"].stateValues.xs).eqls([-3]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(-3);
    });

    cy.log("create 3D point");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{end}{backspace}{backspace}(6,5,4){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should(
      "contain.text",
      "(6,5,4)",
    );
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should(
      "contain.text",
      "(6,5,4)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([6, 5, 4]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 6, 5, 4]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([6, 5, 4]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 6, 5, 4]);
    });

    cy.log("create 2D point from altvector");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}\\langle 5,-2\\rangle {enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(5,−2)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(5,−2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([5, -2]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 5, -2]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([5, -2]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 5, -2]);
    });

    cy.log("move point P to (7,8)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 7, y: 8 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(7,8)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(7,8)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 7, 8]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 7, 8]);
    });
  });

  it("point sugar from single math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="coords" />
    <graph>
      <point name="P" labelIsName><math>$coords</math></point>
    </graph>
    <graph>
      <copy target="P" assignNames="Q" labelIsName/>
    </graph>
    $P.coords{assignNames="Pcoords"}
    $Q.coords{assignNames="Qcoords"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("initially undefined");

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "\uff3f");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "\uff3f");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/P"].stateValues.coords).eqls("\uff3f");
      expect(stateVariables["/Q"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/Q"].stateValues.coords).eqls("\uff3f");
    });

    cy.log("create 2D point");
    cy.get(cesc("#\\/coords") + " textarea").type("(-1,-7){enter}", {
      force: true,
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", -1, -7]);
      expect(stateVariables["/P"].stateValues.label).eq("P");
      expect(stateVariables["/Q"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", -1, -7]);
      expect(stateVariables["/Q"].stateValues.label).eq("Q");
    });

    cy.log("move point P to (3,5)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 5 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(3,5)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(3,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([3, 5]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 3, 5]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([3, 5]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 3, 5]);
    });

    cy.log("move point Q to (9,1)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: 9, y: 1 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(9,1)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(9,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([9, 1]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 9, 1]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([9, 1]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 9, 1]);
    });

    cy.log("make point undefined again");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "\uff3f");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "\uff3f");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/P"].stateValues.coords).eqls("\uff3f");
      expect(stateVariables["/Q"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/Q"].stateValues.coords).eqls("\uff3f");
    });

    cy.log("create 1D point");
    cy.get(cesc("#\\/coords") + " textarea").type("-3{enter}", { force: true });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "−3");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "−3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([-3]);
      expect(stateVariables["/P"].stateValues.coords).eqls(-3);
      expect(stateVariables["/Q"].stateValues.xs).eqls([-3]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(-3);
    });

    cy.log("create 3D point");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{end}{backspace}{backspace}(6,5,4){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should(
      "contain.text",
      "(6,5,4)",
    );
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should(
      "contain.text",
      "(6,5,4)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([6, 5, 4]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 6, 5, 4]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([6, 5, 4]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 6, 5, 4]);
    });

    cy.log("create 2D point from altvector");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}\\langle 5,-2\\rangle {enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(5,−2)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(5,−2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([5, -2]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 5, -2]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([5, -2]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 5, -2]);
    });

    cy.log("move point P to (7,8)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 7, y: 8 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(7,8)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(7,8)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 7, 8]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 7, 8]);
    });
  });

  it("point from vector with sugared single math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="coords" />
    <graph>
      <point name="P" labelIsName><vector><math>$coords</math></vector></point>
    </graph>
    <graph>
      <copy target="P" assignNames="Q" labelIsName/>
    </graph>
    $P.coords{assignNames="Pcoords"}
    $Q.coords{assignNames="Qcoords"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("initially undefined");

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "\uff3f");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "\uff3f");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/P"].stateValues.coords).eqls("\uff3f");
      expect(stateVariables["/Q"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/Q"].stateValues.coords).eqls("\uff3f");
    });

    cy.log("create 2D point");
    cy.get(cesc("#\\/coords") + " textarea").type("(-1,-7){enter}", {
      force: true,
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", -1, -7]);
      expect(stateVariables["/P"].stateValues.label).eq("P");
      expect(stateVariables["/Q"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", -1, -7]);
      expect(stateVariables["/Q"].stateValues.label).eq("Q");
    });

    cy.log("move point P to (3,5)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 5 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(3,5)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(3,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([3, 5]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 3, 5]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([3, 5]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 3, 5]);
    });

    cy.log("move point Q to (9,1)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: 9, y: 1 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(9,1)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(9,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([9, 1]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 9, 1]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([9, 1]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 9, 1]);
    });

    cy.log("make point undefined again");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "\uff3f");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "\uff3f");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/P"].stateValues.coords).eqls("\uff3f");
      expect(stateVariables["/Q"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/Q"].stateValues.coords).eqls("\uff3f");
    });

    cy.log("create 1D point");
    cy.get(cesc("#\\/coords") + " textarea").type("-3{enter}", { force: true });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "−3");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "−3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([-3]);
      expect(stateVariables["/P"].stateValues.coords).eqls(-3);
      expect(stateVariables["/Q"].stateValues.xs).eqls([-3]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(-3);
    });

    cy.log("create 3D point");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{end}{backspace}{backspace}(6,5,4){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should(
      "contain.text",
      "(6,5,4)",
    );
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should(
      "contain.text",
      "(6,5,4)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([6, 5, 4]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 6, 5, 4]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([6, 5, 4]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 6, 5, 4]);
    });

    cy.log("create 2D point from altvector");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}\\langle 5,-2\\rangle {enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(5,−2)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(5,−2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([5, -2]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 5, -2]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([5, -2]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 5, -2]);
    });

    cy.log("move point P to (7,8)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 7, y: 8 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(7,8)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(7,8)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 7, 8]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 7, 8]);
    });
  });

  it("point from copied vector with sugared single math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="coords" />
    <vector name="v"><math>$coords</math></vector>
    <graph>
      <point name="P" labelIsName>$v</point>
    </graph>
    <graph>
      <copy target="P" assignNames="Q" labelIsName/>
    </graph>
    $P.coords{assignNames="Pcoords"}
    $Q.coords{assignNames="Qcoords"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("initially undefined");

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "\uff3f");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "\uff3f");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/P"].stateValues.coords).eqls("\uff3f");
      expect(stateVariables["/Q"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/Q"].stateValues.coords).eqls("\uff3f");
    });

    cy.log("create 2D point");
    cy.get(cesc("#\\/coords") + " textarea").type("(-1,-7){enter}", {
      force: true,
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", -1, -7]);
      expect(stateVariables["/P"].stateValues.label).eq("P");
      expect(stateVariables["/Q"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", -1, -7]);
      expect(stateVariables["/Q"].stateValues.label).eq("Q");
    });

    cy.log("move point P to (3,5)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 5 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(3,5)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(3,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([3, 5]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 3, 5]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([3, 5]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 3, 5]);
    });

    cy.log("move point Q to (9,1)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: 9, y: 1 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(9,1)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(9,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([9, 1]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 9, 1]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([9, 1]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 9, 1]);
    });

    cy.log("make point undefined again");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "\uff3f");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "\uff3f");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/P"].stateValues.coords).eqls("\uff3f");
      expect(stateVariables["/Q"].stateValues.xs).eqls(["\uff3f"]);
      expect(stateVariables["/Q"].stateValues.coords).eqls("\uff3f");
    });

    cy.log("create 1D point");
    cy.get(cesc("#\\/coords") + " textarea").type("-3{enter}", { force: true });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "−3");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "−3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([-3]);
      expect(stateVariables["/P"].stateValues.coords).eqls(-3);
      expect(stateVariables["/Q"].stateValues.xs).eqls([-3]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(-3);
    });

    cy.log("create 3D point");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{end}{backspace}{backspace}(6,5,4){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should(
      "contain.text",
      "(6,5,4)",
    );
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should(
      "contain.text",
      "(6,5,4)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([6, 5, 4]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 6, 5, 4]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([6, 5, 4]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 6, 5, 4]);
    });

    cy.log("create 2D point from altvector");
    cy.get(cesc("#\\/coords") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}\\langle 5,-2\\rangle {enter}",
      { force: true },
    );

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(5,−2)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(5,−2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([5, -2]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 5, -2]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([5, -2]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 5, -2]);
    });

    cy.log("move point P to (7,8)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 7, y: 8 },
      });
    });

    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow").should("contain.text", "(7,8)");
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow").should("contain.text", "(7,8)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", 7, 8]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", 7, 8]);
    });
  });

  it("test invertible due to modifyIndirectly", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>
    (0.5<math>2</math><math modifyIndirectly="false">3</math>, <math name="y">1</math>)
  </point>
  </graph>
  $_point1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(3,1)");

    cy.log(`we can move point`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 7, y: -5 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(7,−5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(7, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(-5, 1e-12);
      expect(
        me
          .fromAst(stateVariables["/_math1"].stateValues.value)
          .evaluate_to_constant(),
      ).closeTo(7 / 1.5, 1e-12);
      expect(stateVariables["/_math2"].stateValues.value).closeTo(3, 1e-12);
      expect(stateVariables["/y"].stateValues.value).closeTo(-5, 1e-12);
    });
  });

  it("define 2D point from 3D point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>
    ($source.y,$source.z)
  </point>
  </graph>

  <point name="source">
    (<math modifyIndirectly="false">a</math>,2,3)
  </point>
  $_point1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait to load

    cy.log("points are where they should be");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(2,3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(2, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(3, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/source"].stateValues.xs[1]).closeTo(2, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[2]).closeTo(3, 1e-12);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -4, y: -7 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−4,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(-4, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(-7, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/source"].stateValues.xs[1]).closeTo(-4, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[2]).closeTo(-7, 1e-12);
    });
  });

  it("define 2D point from 3D point, copying xj", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>
    ($source.x2,$source.x3)
  </point>
  </graph>

  <point name="source">
    (<math modifyIndirectly="false">a</math>,2,3)
  </point>
  $_point1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait to load

    cy.log("points are where they should be");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(2,3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(2, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(3, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/source"].stateValues.xs[1]).closeTo(2, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[2]).closeTo(3, 1e-12);
    });

    cy.log("move point 1");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -4, y: -7 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−4,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(-4, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(-7, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/source"].stateValues.xs[1]).closeTo(-4, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[2]).closeTo(-7, 1e-12);
    });
  });

  it("define 2D point from 3D point, separate coordinates", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point x="$(source.y)" y = "$(source.z)" />
  </graph>

  <math name="a" modifyIndirectly="false">a</math>
  <point name="source" x="$a" y="2" z="3" />
  $_point1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait to load

    cy.log("points are where they should be");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(2,3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(2, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(3, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/source"].stateValues.xs[1]).closeTo(2, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[2]).closeTo(3, 1e-12);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -4, y: -7 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−4,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(-4, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(-7, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/source"].stateValues.xs[1]).closeTo(-4, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[2]).closeTo(-7, 1e-12);
    });
  });

  it("define 2D point from double-copied 3D point, separate coordinates", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point x="$(source3.y)" y = "$(source3.z)" />
  </graph>

  $source{name="source2"}
  <math name="a" modifyIndirectly="false">a</math>
  <point name="source" x="$a" y="2" z="3" />
  $source2{name="source3"}
  $_point1.coords{assignNames="coords1"}

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait to load

    cy.log("points are where they should be");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(2,3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(2, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(3, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/source"].stateValues.xs[1]).closeTo(2, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[2]).closeTo(3, 1e-12);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -4, y: -7 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−4,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(-4, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(-7, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/source"].stateValues.xs[1]).closeTo(-4, 1e-12);
      expect(stateVariables["/source"].stateValues.xs[2]).closeTo(-7, 1e-12);
    });
  });

  it("point on graph that is copied in two ways", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
  <point>(1,2)
  </point>
  </graph>
  $g1{name="g2"}
  <graph>
  $(/g1/_point1{name="p3"})
  </graph>
  $p3.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait to load

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1/_point1"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g2/_point1"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/p3"].stateValues.xs).eqls([1, 2]);
    });

    cy.log(`move point1 to (4,6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/_point1",
        args: { x: 4, y: 6 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(4,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1/_point1"].stateValues.xs).eqls([4, 6]);
      expect(stateVariables["/g2/_point1"].stateValues.xs).eqls([4, 6]);
      expect(stateVariables["/p3"].stateValues.xs).eqls([4, 6]);
    });

    cy.log(`move point2 to (-3,-7)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/_point1",
        args: { x: -3, y: -7 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−3,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1/_point1"].stateValues.xs).eqls([-3, -7]);
      expect(stateVariables["/g2/_point1"].stateValues.xs).eqls([-3, -7]);
      expect(stateVariables["/p3"].stateValues.xs).eqls([-3, -7]);
    });

    cy.log(`move point3 to (9,-2)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: 9, y: -2 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(9,−2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1/_point1"].stateValues.xs).eqls([9, -2]);
      expect(stateVariables["/g2/_point1"].stateValues.xs).eqls([9, -2]);
      expect(stateVariables["/p3"].stateValues.xs).eqls([9, -2]);
    });
  });

  it("point draggable but constrained to x = y^2/10", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>
    ($y^2/10, <math name="y">1</math>)
  </point>
  </graph>
  $_point1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(110,1)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eqls(["/", 1, 10]);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(1);
    });

    cy.log(`move point1 to (-9,6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 6 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(185,6)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eqls(["/", 18, 5]);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(6);
    });

    cy.log(`move point1 to (9,-3)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -3 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(910,−3)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eqls(["/", 9, 10]);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-3);
    });
  });

  it("point draggable but constrained to y = sin(x)", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<math name="x">1</math>, sin($x))
  </point>
  </graph>
  $_point1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(1,sin(1))",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eqls([
        "apply",
        "sin",
        1,
      ]);
    });

    cy.log(`move point1 to (-9,6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 6 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−9,sin(−9))",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-9);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eqls([
        "apply",
        "sin",
        -9,
      ]);
    });

    cy.log(`move point1 to (9,-3)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -3 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(9,sin(9))",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(9);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eqls([
        "apply",
        "sin",
        9,
      ]);
    });
  });

  it("point reflected across line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>
    ($_point1.y, $_point1.x)
  </point>
  <line draggable="false">x=y</line>
  </graph>
  $_point2.coords{assignNames="coords2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(2,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(1);
    });

    cy.log(`move point1 to (-9,6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 6 },
      });
    });

    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(6,−9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-9);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(6);
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(-9);
    });

    cy.log(`move point2 to (0,-3)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 0, y: -3 },
      });
    });

    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(0,−3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(0);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(-3);
    });
  });

  it("point not draggable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point draggable="false">(1,2)</point>
  </graph>
  $_point1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(2);
    });

    cy.log(`move point1 to (-9,6)`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 6 },
      });
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(2);
    });
  });

  it("point on line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>
    ($d,3-$d)
  </point>
  </graph>
  <math name="d">5</math>
  $_point1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(5,−2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-2);
    });

    cy.log(`move point1 to (8,8)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: 8 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(8,−5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(8);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-5);
    });
  });

  it("points draggable even with complicated dependence", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>q</text>
  <graph>

  <point>
  ($_point2.y,
  $a)
  </point>
  <point>(5,3)</point>

  </graph>

  <math name="a">$_point2.x+1</math>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "q"); // to wait until loaded

    cy.get(cesc("#\\/a") + " .mjx-mrow").should("contain.text", "5+1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(6);
    });

    cy.log(`move point1 to (-4,-8)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -4, y: -8 },
      });
    });

    cy.get(cesc("#\\/a") + " .mjx-mrow").should("contain.text", "−4+1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(-4);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(-8);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-8);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-3);
    });

    cy.log(`move point2 to (-9,10)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 10 },
      });
    });

    cy.get(cesc("#\\/a") + " .mjx-mrow").should("contain.text", "9+1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(9);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-9);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(10);
    });
  });

  // The behavior of this test varies widely depending on update order
  // When finalize exactly how we want the updates to occur, could resurrect this
  it.skip("points related through intermediate math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>
  ($a,
  $_point2.x)
  </point>
  <point>($d,3-$d)</point>
  </graph>

  <math name="a" simplify modifyIndirectly="true">$b+1</math>,
  <math name="b" simplify modifyIndirectly="true">$_point2.y$c</math>,
  <math name="c" simplify modifyIndirectly="false">$_point2.x$d*0.01</math>,
  <math name="d" simplify modifyIndirectly="true">5</math>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");
    cy.get(cesc("#\\/d") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let d = 5;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
        point1x,
        1e-12,
      );
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
        point1y,
        1e-12,
      );
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
        point2x,
        1e-12,
      );
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
        point2y,
        1e-12,
      );
      expect(stateVariables["/d"].stateValues.value).closeTo(d, 1e-12);
      expect(stateVariables["/c"].stateValues.value).closeTo(c, 1e-12);
      expect(stateVariables["/b"].stateValues.value).closeTo(b, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(a, 1e-12);
    });

    cy.log(`move point2 along constained line`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let d = -6;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: point2x, y: point2y },
      });
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
        point1x,
        1e-12,
      );
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
        point1y,
        1e-12,
      );
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
        point2x,
        1e-12,
      );
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
        point2y,
        1e-12,
      );
      expect(stateVariables["/d"].stateValues.value).closeTo(d, 1e-12);
      expect(stateVariables["/c"].stateValues.value).closeTo(c, 1e-12);
      expect(stateVariables["/b"].stateValues.value).closeTo(b, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(a, 1e-12);
    });

    cy.log(`move point1 along constained curve`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let d = 7;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: point1x, y: point1y },
      });
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
        point1x,
        1e-12,
      );
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
        point1y,
        1e-12,
      );
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
        point2x,
        1e-12,
      );
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
        point2y,
        1e-12,
      );
      expect(stateVariables["/d"].stateValues.value).closeTo(d, 1e-12);
      expect(stateVariables["/c"].stateValues.value).closeTo(c, 1e-12);
      expect(stateVariables["/b"].stateValues.value).closeTo(b, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(a, 1e-12);
    });

    cy.log(`move point2 to upper right`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 9, y: 9 },
      });

      let d = 9;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
        point1x,
        1e-12,
      );
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
        point1y,
        1e-12,
      );
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
        point2x,
        1e-12,
      );
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
        point2y,
        1e-12,
      );
      expect(stateVariables["/d"].stateValues.value).closeTo(d, 1e-12);
      expect(stateVariables["/c"].stateValues.value).closeTo(c, 1e-12);
      expect(stateVariables["/b"].stateValues.value).closeTo(b, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(a, 1e-12);
    });

    cy.log(`move point1 to upper left`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -6, y: 4 },
      });

      let d = 4;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(
        point1x,
        1e-12,
      );
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(
        point1y,
        1e-12,
      );
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(
        point2x,
        1e-12,
      );
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(
        point2y,
        1e-12,
      );
      expect(stateVariables["/d"].stateValues.value).closeTo(d, 1e-12);
      expect(stateVariables["/c"].stateValues.value).closeTo(c, 1e-12);
      expect(stateVariables["/b"].stateValues.value).closeTo(b, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(a, 1e-12);
    });
  });

  it("no dependence on downstream update order", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>
    ($_point2.y, 3)
  </point>
  <point>
    ($a,$a)
  </point>
  </graph>

  <number name="a">2</number>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait to load

    cy.get(cesc("#\\/a")).should("have.text", "2");

    cy.log(`point 2 is moveable, based on x component`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -3, y: -7 },
      });
    });

    cy.get(cesc("#\\/a")).should("have.text", "-3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(-3, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(3, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(-3, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(-3, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(-3, 1e-12);
    });
    // test zero as had a bug affect case when zero
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 0, y: 5 },
      });
    });

    cy.get(cesc("#\\/a")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(0, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(3, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(0, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(0, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(0, 1e-12);
    });

    cy.log(`point1 is free to move`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -6 },
      });
    });

    cy.get(cesc("#\\/a")).should("have.text", "9");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(9, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(-6, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(9, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(9, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(9, 1e-12);
    });

    // move to zero to make sure are testing the bug that occured at zero
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0, y: 0 },
      });
    });

    cy.get(cesc("#\\/a")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(0, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(0, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(0, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(0, 1e-12);
    });

    cy.visit("/src/Tools/cypressTest/");

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>b</text>
  <graph>
  <point>
    ($_point2.x, 3)
  </point>
  <point>
    ($a,$a)
  </point>
  </graph>

  <number name="a">3</number>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "b"); // to wait to load

    cy.get(cesc("#\\/a")).should("have.text", "3");

    cy.log(`point 2 is moveable, based on x component`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -3, y: -7 },
      });
    });

    cy.get(cesc("#\\/a")).should("have.text", "-3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(-3, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(3, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(-3, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(-3, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(-3, 1e-12);
    });
    // test zero as had a bug affect case when zero
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 0, y: 5 },
      });
    });

    cy.get(cesc("#\\/a")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(0, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(3, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(0, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(0, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(0, 1e-12);
    });

    cy.log(`point1 is free to move`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -6 },
      });
    });

    cy.get(cesc("#\\/a")).should("have.text", "9");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(9, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(-6, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(9, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(9, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(9, 1e-12);
    });

    // move to zero to make sure are testing the bug that occured at zero
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0, y: 0 },
      });
    });

    cy.get(cesc("#\\/a")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(0, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(0, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(0, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(0, 1e-12);
      expect(stateVariables["/a"].stateValues.value).closeTo(0, 1e-12);
    });
  });

  it("point constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>

  <point x="1" y="2">
    <constraints>
      <constrainToGrid/>
    </constraints>
  </point>

  </graph>
  <math>$_point1.coords</math>
  <boolean>$_point1.constraintUsed</boolean>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.log(`move point to (1.2,3.6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.2, y: 3.6 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1,
        4,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`move point to (-9.8,-7.4)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9.8, y: -7.4 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(−10,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-10);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-7);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -10,
        -7,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−10,−7)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    // test bug with number in scientific notation
    cy.log(`move point to (-1.3E-14,2.5E-12)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1.3e-14, y: 2.5e-12 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(0,0)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(0);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        0,
        0,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,0)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("point constrained to grid with sugared coordinates", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>

  <point>
    (1,2)
    <constraints>
      <constrainToGrid/>
    </constraints>
  </point>

  </graph>
  <math>$_point1.coords</math>
  <boolean>$_point1.constraintUsed</boolean>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.log(`move point to (1.2,3.6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.2, y: 3.6 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1,
        4,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`move point to (-9.8,-7.4)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9.8, y: -7.4 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(−10,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-10);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-7);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -10,
        -7,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−10,−7)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("point constrained to grid, copied from outside", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <constraints name="toGrid">
    <constrainToGrid/>
  </constraints>

  <graph>
  <point x="1" y="2">
    <copy target="toGrid" createComponentOfType="constraints" />
  </point>
  </graph>
  <math>$_point1.coords</math>
  <boolean>$_point1.constraintUsed</boolean>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.log(`move point to (1.2,3.6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.2, y: 3.6 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1,
        4,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`move point to (-9.8,-7.4)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9.8, y: -7.4 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(−10,−7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-10);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-7);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -10,
        -7,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−10,−7)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("point constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>

  <point x="1" y="2">
    <constraints>
      <constrainToGrid dx="1.04" dy="1.04" />
    </constraints>
  </point>

  </graph>
  <math>$_point1.coords</math>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(1.04,2.08)",
    );

    cy.log(`move point to (10,3.6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 10, y: 3.6 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(10.4,3.12)",
    );

    cy.log(`move point to (-11,-7.4)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -11, y: -7.4 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(−11.44,−7.28)",
    );

    cy.log(`move point to (10,-10)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 10, y: -10 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(10.4,−10.4)",
    );

    cy.log(`move point to (-2,12)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -2, y: 12 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(−2.08,12.48)",
    );
  });

  it("point constrained to grid, 3D", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <point x="1" y="2" z="3">
    <constraints>
      <constrainToGrid/>
    </constraints>
  </point>

  <math>$_point1.coords</math>
  <boolean>$_point1.constraintUsed</boolean>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,2,3)");

    cy.log(`move point to (1.2,3.6,5.4)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.2, y: 3.6, z: 5.4 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,4,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq(5);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1,
        4,
        5,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4,5)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`move point to (-9.8,-7.4,-4.6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9.8, y: -7.4, z: -4.6 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(−10,−7,−5)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-10);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-7);
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq(-5);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -10,
        -7,
        -5,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−10,−7,−5)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    // test bug with number in scientific notation
    cy.log(`move point to (-1.3E-14,2.5E-12,7.1E-21)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1.3e-14, y: 2.5e-12, z: 7.1e-121 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(0,0,0)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(0);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq(0);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        0,
        0,
        0,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,0,0)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("point constrained to two contradictory grids", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>

  <point xs="1 3.1">
    <constraints>
      <constrainToGrid dx="2" dy="2"/>
      <constrainToGrid dx="2" dy="2" xoffset="1" yoffset="1" />
    </constraints>
  </point>

  </graph>
  <math>$_point1.coords</math>
  <boolean>$_point1.constraintUsed</boolean>

  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("second constraint wins, but first constraint affects result");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        3,
        5,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,5)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`Unexpected results when moving since constraints applied twice`);
    // Note: the behavior isn't necessarily desired, but it is a consequence
    // of applying the constraints in the inverse direction, and then
    // again in the normal direction.
    // If one can find a way to avoid this strange behavior, we can change this test

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3, y: 2.9 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(7,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(7);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        7,
        5,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,5)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("point constrained to grid and line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <line name="PhaseLine" equation="y=0" fixed styleNumber="3"/>
    <point x="-1.5" y="7.9">
      <constraints>
        <constrainToGrid/>
        <constrainto>$PhaseLine</constrainto>
      </constraints>
    </point>
  </graph>
  <math>$_point1.coords</math>
  <boolean>$_point1.constraintUsed</boolean>

  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−1,0)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`move point`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8.5, y: -6.2 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(9,0)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(9);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(9,0)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("point constrained to graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point x="1" y="2" name="A">
      <constraints>
        <constrainToGraph/>
      </constraints>
    </point>
    <point x="3" y="4" name="C">
      <constraints>
        <constrainToGraph buffer="0.025" />
      </constraints>
    </point>
  </graph>

  <graph xmin="-20" xmax="20" ymin="-20" ymax="20" >
    $A{name="B"}
    $C{name="D"}
  </graph>

  <math>$A.coords</math>
  <boolean>$A.constraintUsed</boolean>
  <math>$B.coords</math>
  <boolean>$B.constraintUsed</boolean>
  <math>$C.coords</math>
  <boolean>$C.constraintUsed</boolean>
  <math>$D.coords</math>
  <boolean>$D.constraintUsed</boolean>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.log(`move point A to (105,3)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 105, y: 3 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(9.8,3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).eq(9.8);
      expect(stateVariables["/A"].stateValues.xs[1]).eq(3);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
      expect(stateVariables["/B"].stateValues.xs[0]).eq(9.8);
      expect(stateVariables["/B"].stateValues.xs[1]).eq(3);
      expect(stateVariables["/B"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(9.8,3)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(9.8,3)");
      });
    cy.get(cesc("#\\/_boolean2")).should("have.text", "true");

    cy.log(`move point A to (-30,11)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -30, y: 11 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(−9.8,9.8)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).eq(-9.8);
      expect(stateVariables["/A"].stateValues.xs[1]).eq(9.8);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
      expect(stateVariables["/B"].stateValues.xs[0]).eq(-9.8);
      expect(stateVariables["/B"].stateValues.xs[1]).eq(9.8);
      expect(stateVariables["/B"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−9.8,9.8)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−9.8,9.8)");
      });
    cy.get(cesc("#\\/_boolean2")).should("have.text", "true");

    cy.log(`move point A to (-3,1)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -3, y: 1 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(−3,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/A"].stateValues.xs[1]).eq(1);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
      expect(stateVariables["/B"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/B"].stateValues.xs[1]).eq(1);
      expect(stateVariables["/B"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−3,1)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−3,1)");
      });
    cy.get(cesc("#\\/_boolean2")).should("have.text", "true");

    cy.log(`move point B to (-17,18)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -17, y: 18 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(−9.8,9.8)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).eq(-9.8);
      expect(stateVariables["/A"].stateValues.xs[1]).eq(9.8);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
      expect(stateVariables["/B"].stateValues.xs[0]).eq(-17);
      expect(stateVariables["/B"].stateValues.xs[1]).eq(18);
      expect(stateVariables["/B"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−9.8,9.8)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−17,18)");
      });
    cy.get(cesc("#\\/_boolean2")).should("have.text", "true");

    cy.log(`move point B to (56,-91)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 56, y: -91 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(9.8,−9.8)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).eq(9.8);
      expect(stateVariables["/A"].stateValues.xs[1]).eq(-9.8);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
      expect(stateVariables["/B"].stateValues.xs[0]).eq(19.6);
      expect(stateVariables["/B"].stateValues.xs[1]).eq(-19.6);
      expect(stateVariables["/B"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(9.8,−9.8)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(19.6,−19.6)");
      });
    cy.get(cesc("#\\/_boolean2")).should("have.text", "true");

    cy.log(`move point C to (56,-91)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: 56, y: -91 },
      });
    });
    cy.get(cesc("#\\/_math3") + " .mjx-mrow").should(
      "contain.text",
      "(9.5,−9.5)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/C"].stateValues.xs[0]).eq(9.5);
      expect(stateVariables["/C"].stateValues.xs[1]).eq(-9.5);
      expect(stateVariables["/C"].stateValues.constraintUsed).eq(true);
      expect(stateVariables["/D"].stateValues.xs[0]).eq(9.5);
      expect(stateVariables["/D"].stateValues.xs[1]).eq(-9.5);
      expect(stateVariables["/D"].stateValues.constraintUsed).eq(true);
    });

    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(9.5,−9.5)");
      });
    cy.get(cesc("#\\/_boolean3")).should("have.text", "true");
    cy.get(cesc("#\\/_math4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(9.5,−9.5)");
      });
    cy.get(cesc("#\\/_boolean4")).should("have.text", "true");

    cy.log(`move point D to (5,15)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/D",
        args: { x: 5, y: 15 },
      });
    });
    cy.get(cesc("#\\/_math3") + " .mjx-mrow").should("contain.text", "(5,9.5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/C"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/C"].stateValues.xs[1]).eq(9.5);
      expect(stateVariables["/C"].stateValues.constraintUsed).eq(true);
      expect(stateVariables["/D"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/D"].stateValues.xs[1]).eq(15);
      expect(stateVariables["/D"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,9.5)");
      });
    cy.get(cesc("#\\/_boolean3")).should("have.text", "true");
    cy.get(cesc("#\\/_math4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,15)");
      });
    cy.get(cesc("#\\/_boolean4")).should("have.text", "true");

    cy.log(`move point D to (-65,-79)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/D",
        args: { x: -65, y: -79 },
      });
    });
    cy.get(cesc("#\\/_math3") + " .mjx-mrow").should(
      "contain.text",
      "(−9.5,−9.5)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/C"].stateValues.xs[0]).eq(-9.5);
      expect(stateVariables["/C"].stateValues.xs[1]).eq(-9.5);
      expect(stateVariables["/C"].stateValues.constraintUsed).eq(true);
      expect(stateVariables["/D"].stateValues.xs[0]).eq(-19);
      expect(stateVariables["/D"].stateValues.xs[1]).eq(-19);
      expect(stateVariables["/D"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−9.5,−9.5)");
      });
    cy.get(cesc("#\\/_boolean3")).should("have.text", "true");
    cy.get(cesc("#\\/_math4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−19,−19)");
      });
    cy.get(cesc("#\\/_boolean4")).should("have.text", "true");
  });

  it("three points with one constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point name="original">(1,2)</point>
    <point name="constrained" x="$(original.x)+1" y="$(original.y)+1" >
      <constraints>
        <constrainToGrid/>
      </constraints>
    </point>
    <point name="follower">
        ($constrained.x+1,
          $constrained.y+1)
    </point>
  </graph>
  <math>$original.coords</math>
  <math>$constrained.coords</math>
  <math>$follower.coords</math>
  <boolean>$original.constraintUsed</boolean>
  <boolean>$constrained.constraintUsed</boolean>
  <boolean>$follower.constraintUsed</boolean>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.log(`move point1 to (1.2,3.6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/original",
        args: { x: 1.2, y: 3.6 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(1.2,3.6)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.xs[0]).eq(1.2);
      expect(stateVariables["/original"].stateValues.xs[1]).eq(3.6);
      expect(stateVariables["/original"].stateValues.coords).eqls([
        "vector",
        1.2,
        3.6,
      ]);
      expect(stateVariables["/original"].stateValues.constraintUsed).eq(false);
      expect(stateVariables["/constrained"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/constrained"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/constrained"].stateValues.coords).eqls([
        "vector",
        2,
        5,
      ]);
      expect(stateVariables["/constrained"].stateValues.constraintUsed).eq(
        true,
      );
      expect(stateVariables["/follower"].stateValues.xs[0]).eq(3);
      expect(stateVariables["/follower"].stateValues.xs[1]).eq(6);
      expect(stateVariables["/follower"].stateValues.coords).eqls([
        "vector",
        3,
        6,
      ]);
      expect(stateVariables["/follower"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1.2,3.6)");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,5)");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,6)");
      });

    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");
    cy.get(cesc("#\\/_boolean2")).should("have.text", "true");
    cy.get(cesc("#\\/_boolean3")).should("have.text", "false");

    cy.log(`move point2 to (-3.4,6.7)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/constrained",
        args: { x: -3.4, y: 6.7 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(−4,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.xs[0]).eq(-4);
      expect(stateVariables["/original"].stateValues.xs[1]).eq(6);
      expect(stateVariables["/original"].stateValues.coords).eqls([
        "vector",
        -4,
        6,
      ]);
      expect(stateVariables["/original"].stateValues.constraintUsed).eq(false);
      expect(stateVariables["/constrained"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/constrained"].stateValues.xs[1]).eq(7);
      expect(stateVariables["/constrained"].stateValues.coords).eqls([
        "vector",
        -3,
        7,
      ]);
      expect(stateVariables["/constrained"].stateValues.constraintUsed).eq(
        true,
      );
      expect(stateVariables["/follower"].stateValues.xs[0]).eq(-2);
      expect(stateVariables["/follower"].stateValues.xs[1]).eq(8);
      expect(stateVariables["/follower"].stateValues.coords).eqls([
        "vector",
        -2,
        8,
      ]);
      expect(stateVariables["/follower"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−4,6)");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−3,7)");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,8)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");
    cy.get(cesc("#\\/_boolean2")).should("have.text", "true");
    cy.get(cesc("#\\/_boolean3")).should("have.text", "false");

    cy.log(`move point3 to (5.3, -2.2)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/follower",
        args: { x: 5.3, y: -2.2 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(3,−4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.xs[0]).eq(3);
      expect(stateVariables["/original"].stateValues.xs[1]).eq(-4);
      expect(stateVariables["/original"].stateValues.coords).eqls([
        "vector",
        3,
        -4,
      ]);
      expect(stateVariables["/original"].stateValues.constraintUsed).eq(false);
      expect(stateVariables["/constrained"].stateValues.xs[0]).eq(4);
      expect(stateVariables["/constrained"].stateValues.xs[1]).eq(-3);
      expect(stateVariables["/constrained"].stateValues.coords).eqls([
        "vector",
        4,
        -3,
      ]);
      expect(stateVariables["/constrained"].stateValues.constraintUsed).eq(
        true,
      );
      expect(stateVariables["/follower"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/follower"].stateValues.xs[1]).eq(-2);
      expect(stateVariables["/follower"].stateValues.coords).eqls([
        "vector",
        5,
        -2,
      ]);
      expect(stateVariables["/follower"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,−4)");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,−3)");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,−2)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");
    cy.get(cesc("#\\/_boolean2")).should("have.text", "true");
    cy.get(cesc("#\\/_boolean3")).should("have.text", "false");
  });

  it("points constrained to grid with parameters", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="dx"/>
  <mathinput name="dy"/>
  <mathinput name="xoffset"/>
  <mathinput name="yoffset"/>

  <graph>
    <point name="original">(1.2,3.6)</point>
    <point name="constrained" x="$(original.x)+1" y="$(original.y)+1">
      <constraints>
        <constrainToGrid dx="$dx" dy="$dy" xoffset="$xoffset" yoffset="$yoffset" />
      </constraints>
    </point>
    <point name="follower">
        ($constrained.x+1,
          $constrained.y+1)
    </point>
  </graph>
  <math>$original.coords</math>
  <math>$constrained.coords</math>
  <math>$follower.coords</math>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`no constraints with blanks`);
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1.2,3.6)");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2.2,4.6)");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3.2,5.6)");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.xs[0]).eq(1.2);
      expect(stateVariables["/original"].stateValues.xs[1]).eq(3.6);
      expect(stateVariables["/original"].stateValues.coords).eqls([
        "vector",
        1.2,
        3.6,
      ]);
      expect(stateVariables["/constrained"].stateValues.xs[0]).eq(2.2);
      expect(stateVariables["/constrained"].stateValues.xs[1]).eq(4.6);
      expect(stateVariables["/constrained"].stateValues.coords).eqls([
        "vector",
        2.2,
        4.6,
      ]);
      expect(stateVariables["/follower"].stateValues.xs[0]).eq(3.2);
      expect(stateVariables["/follower"].stateValues.xs[1]).eq(5.6);
      expect(stateVariables["/follower"].stateValues.coords).eqls([
        "vector",
        3.2,
        5.6,
      ]);
    });

    cy.log(`constrain x and y to integers`);
    cy.get(cesc("#\\/dx") + " textarea").type("1", { force: true });
    cy.get(cesc("#\\/dy") + " textarea").type("1", { force: true });
    cy.get(cesc("#\\/xoffset") + " textarea").type("0", { force: true });
    cy.get(cesc("#\\/yoffset") + " textarea").type("0{enter}", { force: true });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(1.2,3.6)",
    );
    cy.get(cesc("#\\/_math2") + " .mjx-mrow").should("contain.text", "(2,5)");
    cy.get(cesc("#\\/_math3") + " .mjx-mrow").should("contain.text", "(3,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.xs[0]).eq(1.2);
      expect(stateVariables["/original"].stateValues.xs[1]).eq(3.6);
      expect(stateVariables["/original"].stateValues.coords).eqls([
        "vector",
        1.2,
        3.6,
      ]);
      expect(stateVariables["/constrained"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/constrained"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/constrained"].stateValues.coords).eqls([
        "vector",
        2,
        5,
      ]);
      expect(stateVariables["/follower"].stateValues.xs[0]).eq(3);
      expect(stateVariables["/follower"].stateValues.xs[1]).eq(6);
      expect(stateVariables["/follower"].stateValues.coords).eqls([
        "vector",
        3,
        6,
      ]);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1.2,3.6)");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,5)");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,6)");
      });

    cy.log(`move point2 to (5.3, -2.2)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/constrained",
        args: { x: 5.3, y: -2.2 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(4,−3)");
    cy.get(cesc("#\\/_math2") + " .mjx-mrow").should("contain.text", "(5,−2)");
    cy.get(cesc("#\\/_math3") + " .mjx-mrow").should("contain.text", "(6,−1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.xs[0]).eq(4);
      expect(stateVariables["/original"].stateValues.xs[1]).eq(-3);
      expect(stateVariables["/original"].stateValues.coords).eqls([
        "vector",
        4,
        -3,
      ]);
      expect(stateVariables["/constrained"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/constrained"].stateValues.xs[1]).eq(-2);
      expect(stateVariables["/constrained"].stateValues.coords).eqls([
        "vector",
        5,
        -2,
      ]);
      expect(stateVariables["/follower"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/follower"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/follower"].stateValues.coords).eqls([
        "vector",
        6,
        -1,
      ]);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,−3)");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(5,−2)");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(6,−1)");
      });

    cy.log(`change constraints`);
    cy.get(cesc("#\\/dx") + " textarea").type("{end}{backspace}3", {
      force: true,
    });
    cy.get(cesc("#\\/dy") + " textarea").type("{end}{backspace}0.5", {
      force: true,
    });
    cy.get(cesc("#\\/xoffset") + " textarea").type("{end}{backspace}1", {
      force: true,
    });
    cy.get(cesc("#\\/yoffset") + " textarea").type(
      "{end}{backspace}0.1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(4,−3)");
    cy.get(cesc("#\\/_math2") + " .mjx-mrow").should(
      "contain.text",
      "(4,−1.9)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.xs[0]).eq(4);
      expect(stateVariables["/original"].stateValues.xs[1]).eq(-3);
      expect(stateVariables["/original"].stateValues.coords).eqls([
        "vector",
        4,
        -3,
      ]);
      expect(stateVariables["/constrained"].stateValues.xs[0]).eq(4);
      expect(stateVariables["/constrained"].stateValues.xs[1]).eq(-1.9);
      expect(stateVariables["/constrained"].stateValues.coords).eqls([
        "vector",
        4,
        -1.9,
      ]);
      expect(stateVariables["/follower"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/follower"].stateValues.xs[1]).to.be.approximately(
        -0.9,
        1e-10,
      );
      expect(stateVariables["/follower"].stateValues.coords.slice(0, 2)).eqls([
        "vector",
        5,
      ]);
      expect(
        stateVariables["/follower"].stateValues.coords[2],
      ).to.be.approximately(-0.9, 1e-10);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,−3)");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,−1.9)");
      });
    // cy.get(cesc('#\\/_math3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('(5,−0.9)')
    // });

    cy.log(`move point to (-2.2, -8.6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/constrained",
        args: { x: -0.6, y: -8.6 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(−3,−9.4)",
    );
    cy.get(cesc("#\\/_math2") + " .mjx-mrow").should(
      "contain.text",
      "(−2,−8.4)",
    );
    cy.get(cesc("#\\/_math3") + " .mjx-mrow").should(
      "contain.text",
      "(−1,−7.4)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/original"].stateValues.xs[1]).eq(-9.4);
      expect(stateVariables["/original"].stateValues.coords).eqls([
        "vector",
        -3,
        -9.4,
      ]);
      expect(stateVariables["/constrained"].stateValues.xs[0]).eq(-2);
      expect(stateVariables["/constrained"].stateValues.xs[1]).eq(-8.4);
      expect(stateVariables["/constrained"].stateValues.coords).eqls([
        "vector",
        -2,
        -8.4,
      ]);
      expect(stateVariables["/follower"].stateValues.xs[0]).eq(-1);
      expect(stateVariables["/follower"].stateValues.xs[1]).eq(-7.4);
      expect(stateVariables["/follower"].stateValues.coords).eqls([
        "vector",
        -1,
        -7.4,
      ]);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−3,−9.4)");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−2,−8.4)");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−1,−7.4)");
      });
  });

  it("point attracted to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>

  <point xs="-7.1 8.9">
    <constraints>
      <attractToGrid/>
    </constraints>
  </point>

  </graph>
  <math>$_point1.coords</math>
  <boolean>$_point1.constraintUsed</boolean>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(−7,9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(9);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -7,
        9,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−7,9)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`move point to (1.1,3.6)`);

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.6 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(1.1,3.6)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1.1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(3.6);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1.1,
        3.6,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1.1,3.6)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");

    cy.log(`move point to (1.1,3.9)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.9 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1,
        4,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    // test bug with number in scientific notation
    cy.log(`move point to (-1.3E-14,2.5E-12)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1.3e-14, y: 2.5e-12 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(0,0)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(0);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        0,
        0,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,0)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("point attracted to grid, copied from outside", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <constraints name="toGrid">
    <attractToGrid/>
  </constraints>

  <graph>

  <point xs="-7.1 8.9">
    <copy target="toGrid" createComponentOfType="constraints" />
  </point>

  </graph>
  <math>$_point1.coords</math>
  <boolean>$_point1.constraintUsed</boolean>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(9);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -7,
        9,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−7,9)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`move point to (1.1,3.6)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.6 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(1.1,3.6)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1.1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(3.6);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1.1,
        3.6,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1.1,3.6)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");

    cy.log(`move point to (1.1,3.9)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.9 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1,
        4,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("point attracted to grid, 3D", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <point xs="-7.1 8.9 2.1">
    <constraints>
      <attractToGrid/>
    </constraints>
  </point>

  <math>$_point1.coords</math>
  <boolean>$_point1.constraintUsed</boolean>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(9);
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq(2);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -7,
        9,
        2,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−7,9,2)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`move point to (1.1,3.9,5.4)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.9, z: 5.4 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(1.1,3.9,5.4)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1.1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(3.9);
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq(5.4);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1.1,
        3.9,
        5.4,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1.1,3.9,5.4)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");

    cy.log(`move point to (1.1,3.9,5.9)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.9, z: 5.9 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,4,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq(6);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1,
        4,
        6,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4,6)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    // test bug with number in scientific notation
    cy.log(`move point to (-1.3E-14,2.5E-12,-2.3E-19)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1.3e-14, y: 2.5e-12, z: -2.3e-19 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(0,0,0)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(0);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(0);
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq(0);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        0,
        0,
        0,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,0,0)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("point attracted to grid, including gridlines", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>

  <point xs="3.1 -3.4">
    <constraints>
      <attractToGrid includeGridlines="true"/>
    </constraints>
  </point>

  </graph>
  <math>$_point1.coords</math>
  <boolean>$_point1.constraintUsed</boolean>
  

  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,−3.4)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-3.4);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        3,
        -3.4,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });

    cy.log(`move point to (1.3,3.9)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.3, y: 3.9 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1.3,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1.3);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1.3,
        4,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1.3,4)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`move point to (1.1,3.9)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.9 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(1,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1,
        4,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`move point to (1.3,3.7)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.3, y: 3.7 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(1.3,3.7)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1.3);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(3.7);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        1.3,
        3.7,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1.3,3.7)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");
  });

  it("point attracted to grid with parameters", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="dx"/>
  <mathinput name="dy"/>
  <mathinput name="xoffset"/>
  <mathinput name="yoffset"/>
  <mathinput name="xthreshold"/>
  <mathinput name="ythreshold"/>

  <graph>

  <point xs="-7.1 8.9">
    <constraints>
      <attractToGrid dx="$dx" dy="$dy" xoffset="$xoffset" yoffset="$yoffset" xthreshold="$xthreshold" ythreshold="$ythreshold" />
    </constraints>
  </point>

  </graph>
  <math>$_point1.coords</math>
  <boolean>$_point1.constraintUsed</boolean>

  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`no constraints with blanks`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-7.1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(8.9);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -7.1,
        8.9,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−7.1,8.9)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");

    cy.log(`constrain x and y to integers`);
    cy.get(cesc("#\\/dx") + " textarea").type("1", { force: true });
    cy.get(cesc("#\\/dy") + " textarea").type("1", { force: true });
    cy.get(cesc("#\\/xoffset") + " textarea").type("0", { force: true });
    cy.get(cesc("#\\/yoffset") + " textarea").type("0", { force: true });
    cy.get(cesc("#\\/xthreshold") + " textarea").type("0.2", { force: true });
    cy.get(cesc("#\\/ythreshold") + " textarea").type("0.2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(−7,9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(9);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -7,
        9,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−7,9)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");

    cy.log(`change constraints`);
    cy.get(cesc("#\\/dx") + " textarea").type("{end}{backspace}3", {
      force: true,
    });
    cy.get(cesc("#\\/dy") + " textarea").type("{end}{backspace}0.5", {
      force: true,
    });
    cy.get(cesc("#\\/xoffset") + " textarea").type("{end}{backspace}1", {
      force: true,
    });
    cy.get(cesc("#\\/yoffset") + " textarea").type(
      "{end}{backspace}0.1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(−7.1,8.9)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-7.1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(8.9);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -7.1,
        8.9,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−7.1,8.9)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");

    cy.get(cesc("#\\/xthreshold") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}1.0",
      { force: true },
    );
    cy.get(cesc("#\\/ythreshold") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}0.3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
      "contain.text",
      "(−8,9.1)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-8);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(9.1);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -8,
        9.1,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−8,9.1)");
      });
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("point attracted to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>include gridlines: <booleaninput name="includeGridlines" /></p>

  <graph grid="3 3" xmin="-8.5" xmax="8.5" ymin="-8.5" ymax="8.5">

  <point xs="-3.5 6.6">
    <constraints>
      <attractToGrid dx="3" dy="3" xthreshold="1" ythreshold="1" includeGridlines="$includeGridlines"  />
    </constraints>
  </point>

  </graph>
  <math>$_point1.coords</math>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(−3,6)");

    cy.log(`move point to (8.5,3.1)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8.5, y: 3.1 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(9,3)");

    cy.log(`move point to (-8.5,-6.4)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8.5, y: -6.4 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(−9,−6)");

    cy.log(`move point to (8.5,-8.5)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8.5, y: -8.5 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(9,−9)");

    cy.log(`move point to (-3.2,8.5)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -3.2, y: 8.5 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(−3,9)");

    cy.get(cesc("#\\/includeGridlines")).click();

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(−3,9)");

    cy.log(`move point to (8.5,3.1)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8.5, y: 3.1 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(9,3)");

    cy.log(`move point to (-8.5,-6.4)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8.5, y: -6.4 },
      });
    });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(−9,−6)");

    cy.log(`move point to (8.5,-8.5)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8.5, y: -8.5 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(9,−9)");

    cy.log(`move point to (-3.2,8.5)`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -3.2, y: 8.5 },
      });
    });

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "(−3,9)");
  });

  it("point constrained to line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>(0,2)</point>
  <point>(2,0)</point>
  <line through="$_point1 $_point2"/>
  <point name="A" xs="-1 -5">
    <constraints>
      <constrainTo>$_line1</constrainTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  $A.coords{assignNames="coords"}
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      cy.log(`point is on line`);
      cy.get(cesc("#\\/coords") + " .mjx-mrow").should(
        "contain.text",
        "(3,−1)",
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/A"].stateValues.xs[0] +
            stateVariables["/A"].stateValues.xs[1],
        ).eq(2);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
      });
      cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

      cy.log(`move point`);
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "movePoint",
          componentName: "/A",
          args: { x: 9, y: -3 },
        });
      });
      cy.get(cesc("#\\/coords") + " .mjx-mrow").should(
        "contain.text",
        "(7,−5)",
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/A"].stateValues.xs[0] +
            stateVariables["/A"].stateValues.xs[1],
        ).eq(2);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
      });
      cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

      cy.log(`change line`);
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: 3, y: 1 },
        });
      });
      cy.get(cesc("#\\/coords") + " .mjx-mrow").should("contain.text", "(2,0)");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/A"].stateValues.xs[0] -
            stateVariables["/A"].stateValues.xs[1],
        ).eq(2);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
      });
      cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

      cy.log(`move point`);
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "movePoint",
          componentName: "/A",
          args: { x: 9, y: -3 },
        });
      });
      cy.get(cesc("#\\/coords") + " .mjx-mrow").should("contain.text", "(4,2)");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/A"].stateValues.xs[0] -
            stateVariables["/A"].stateValues.xs[1],
        ).eq(2);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
      });
      cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
    });
  });

  it("point attracted to line", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>(0,2)</point>
  <point>(2,0)</point>
  <line through="$_point1 $_point2"/>
  <point name="A" xs="-1 -5">
    <constraints>
      <attractTo>$_line1</attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  $A.coords{assignNames="coords"}
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`point is not on line`);
    cy.get(cesc("#\\/coords") + " .mjx-mrow").should("contain.text", "(−1,−5)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).eq(-1);
      expect(stateVariables["/A"].stateValues.xs[1]).eq(-5);
      expect(stateVariables["/A"].stateValues.coords).eqls(["vector", -1, -5]);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "false");

    cy.log(`move point near line`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 9.1, y: -6.8 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] +
          stateVariables["/A"].stateValues.xs[1],
      ).closeTo(2, 1e-14);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    cy.log(`change line, point not on line`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3, y: 1 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] +
          stateVariables["/A"].stateValues.xs[1],
      ).closeTo(2, 1e-14);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);
    });

    cy.log(`move point`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -5.1, y: -6.8 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] -
          stateVariables["/A"].stateValues.xs[1],
      ).closeTo(2, 1e-14);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
  });

  it("point constrained to lines and points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
  <line hide>y = x + 7</line>
  <line hide>y = x - 3</line>
  <map>
    <template newNamespace>
      <point hide>($n,$n+2)</point>
    </template>
    <sources alias="n"><sequence from="-10" to="10"/></sources>
  </map>

  <point xs="3 2">
    <constraints>
    <constrainTo>
      $_line1
      $_line2
      $_map1
    </constrainTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="_point1" />
  $_point1.coords{assignNames="coords1"}

  <text>a</text>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`point is on line`);

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(4,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/_point1"].stateValues.xs[1] -
          stateVariables["/_point1"].stateValues.xs[0],
      ).eq(-3);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move point to lower right`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -5 },
      });
    });
    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(3.5,0.5)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/_point1"].stateValues.xs[1] -
          stateVariables["/_point1"].stateValues.xs[0],
      ).eq(-3);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move point near points`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3.5, y: 5.5 },
      });
    });
    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(3,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        3,
        5,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move point to upper left`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 8 },
      });
    });
    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(−4,3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/_point1"].stateValues.xs[1] -
          stateVariables["/_point1"].stateValues.xs[0],
      ).eq(7);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
  });

  it("point attracted to lines and points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
  <line hide>y = x + 7</line>
  <line hide>y = x - 3</line>
  <map>
    <template newNamespace>
      <point hide>($n,$n+2)</point>
    </template>
    <sources alias="n"><sequence from="-10" to="10"/></sources>
  </map>

  <point xs="3 2">
    <constraints>
      <attractTo threshold="1">
        $_line1
        $_line2
        $_map1
      </attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="_point1" />
  $_point1.coords{assignNames="coords1"}
  <text>a</text>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`point is in original location`);

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(3,2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        3,
        2,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "false");

    cy.log(`point is on line`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3.1, y: 0.5 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/_point1"].stateValues.xs[1] -
          stateVariables["/_point1"].stateValues.xs[0],
      ).eq(-3);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });

    cy.log(`move point to lower right`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -5 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(9);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-5);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        9,
        -5,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(false);
    });

    cy.log(`move point near points`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3.1, y: 5.1 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        3,
        5,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });

    cy.log(`move point to upper left`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 8 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(-9);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(8);
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        -9,
        8,
      ]);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(false);
    });

    cy.log(`move point near upper line`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8.8, y: -2.3 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/_point1"].stateValues.xs[1] -
          stateVariables["/_point1"].stateValues.xs[0],
      ).eq(7);
      expect(stateVariables["/_point1"].stateValues.constraintUsed).eq(true);
    });
  });

  it("point constrained to union of lines and grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <constraintUnion>
      <constrainTo>$_line1</constrainTo>
      <constrainTo>$_line2$_line3</constrainTo>
      <constrainTo>$_line4</constrainTo>
      <constrainToGrid dx="2" dy="2"/>
    </constraintUnion>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  $A.coords{assignNames="coordsA"}
  <text>a</text>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`point on grid`);
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should("contain.text", "(8,4)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(8, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(4, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.1, y: 8.2 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(−7.65,7.65)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] +
          stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near line x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.1, y: 8.2 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(7.65,7.65)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] -
          stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near line x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 3.5, y: -2.5 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(3.4,−2.3)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] -
          2 * stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near line x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -3.5, y: -2.5 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(−3.4,−2.3)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] +
          2 * stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(-8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
  });

  it("point attracted to union of lines and grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <attractToConstraint>
      <constraintUnion>
        <constrainTo>$_line1</constrainTo>
        <constrainTo>$_line2$_line3</constrainTo>
        <constrainTo>$_line4</constrainTo>
        <constrainToGrid dx="2" dy="2"/>
      </constraintUnion>
    </attractToConstraint>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  $A.coords{assignNames="coordsA"}
  <text>a</text>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`point in original location`);

    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should("contain.text", "(7,3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(7, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(3, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "false");

    cy.log(`move point near grid`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 0.2, y: -1.8 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(-2, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    cy.log(`move not close enough to line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.1, y: 8.2 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(-7.1, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(8.2, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);
    });

    cy.log(`move close enough to line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.5, y: 7.8 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] +
          stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    cy.log(`move not close enough to line x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.1, y: 8.2 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(7.1, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(8.2, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);
    });

    cy.log(`move close enough to line x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.5, y: 7.8 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] -
          stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    cy.log(`move near line x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 3.5, y: -2.5 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(3.4,−2.3)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] -
          2 * stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near line x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -3.5, y: -2.5 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(−3.4,−2.3)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] +
          2 * stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(-8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
  });

  it("point attracted to union of lines and intersections", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <attractTo>
      $_line1
      $_line2
      $_line3
      $_line4
    </attractTo>
    <attractTo>
      <intersection>$_line1$_line2</intersection>
      <intersection>$_line1$_line3</intersection>
      <intersection>$_line1$_line4</intersection>
      <intersection>$_line2$_line3</intersection>
      <intersection>$_line2$_line4</intersection>
      <intersection>$_line3$_line4</intersection>
    </attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  <copy prop="coords" target="A" assignNames="coordsA" displayDecimals="2" />
  <text>a</text>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`point in original location`);

    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should("contain.text", "(7,3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(7, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(3, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "false");

    cy.log(`move not close enough to line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.1, y: 8.2 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(−7.1,8.2)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(-7.1, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(8.2, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "false");

    cy.log(`move close enough to line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.5, y: 7.8 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] +
          stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    cy.log(`move not close enough to line x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.1, y: 8.2 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(7.1, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(8.2, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);
    });

    cy.log(`move close enough to line x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.5, y: 7.8 },
      });
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] -
          stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    cy.log(`move near line x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 3.5, y: -2.5 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(3.4,−2.3)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] -
          2 * stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near line x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -3.5, y: -2.5 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(−3.4,−2.3)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] +
          2 * stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(-8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x+y=0 and x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -0.2, y: 0.1 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should("contain.text", "(0,0)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x+y=0 and x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 2.6, y: -2.7 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(2.67,−2.67)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(
        8 / 3,
        1e-12,
      );
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(
        -8 / 3,
        1e-12,
      );
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x+y=0 and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.9, y: -8.2 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should("contain.text", "(8,−8)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(8, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(-8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x=y and x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -8.1, y: -7.8 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(−8,−8)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(-8, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(-8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x+y=0 and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -2.5, y: -2.7 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(−2.67,−2.67)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(
        -8 / 3,
        1e-12,
      );
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(
        -8 / 3,
        1e-12,
      );
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x=2y+8 and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 0.2, y: -3.9 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should("contain.text", "(0,−4)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(-4, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
  });

  it("point constrained to union of lines and attracted to intersections", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <constrainTo>
      $_line1
      $_line2
      $_line3
      $_line4
    </constrainTo>
    <attractTo>
      <intersection>$_line1$_line2</intersection>
      <intersection>$_line1$_line3</intersection>
      <intersection>$_line1$_line4</intersection>
      <intersection>$_line2$_line3</intersection>
      <intersection>$_line2$_line4</intersection>
      <intersection>$_line3$_line4</intersection>
    </attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  <copy prop="coords" target="A" assignNames="coordsA" displayDecimals="2" />
  <text>a</text>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`on x=y`);

    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should("contain.text", "(5,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] -
          stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`attract to line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.1, y: 10 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(−8.55,8.55)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] +
          stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near line x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 10, y: -3 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(8.4,0.2)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] -
          2 * stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near line x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -10, y: -3 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(−8.4,0.2)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/A"].stateValues.xs[0] +
          2 * stateVariables["/A"].stateValues.xs[1],
      ).to.be.closeTo(-8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x+y=0 and x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -0.2, y: 0.1 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should("contain.text", "(0,0)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x+y=0 and x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 2.6, y: -2.7 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(2.67,−2.67)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(
        8 / 3,
        1e-12,
      );
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(
        -8 / 3,
        1e-12,
      );
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x+y=0 and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.9, y: -8.2 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should("contain.text", "(8,−8)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(8, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(-8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x=y and x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -8.1, y: -7.8 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(−8,−8)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(-8, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(-8, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x=y and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -2.5, y: -2.7 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should(
      "contain.text",
      "(−2.67,−2.67)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(
        -8 / 3,
        1e-12,
      );
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(
        -8 / 3,
        1e-12,
      );
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");

    cy.log(`move near intersection of x=2y+8 and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 0.2, y: -3.9 },
      });
    });
    cy.get(cesc("#\\/coordsA") + " .mjx-mrow").should("contain.text", "(0,−4)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs[0]).to.be.closeTo(0, 1e-12);
      expect(stateVariables["/A"].stateValues.xs[1]).to.be.closeTo(-4, 1e-12);
      expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });
    cy.get(cesc("#\\/constraintUsed")).should("have.text", "true");
  });

  // gap not so relevant any more with new sugar
  // Not sure how to make this work with core as a web work
  it.skip("sugar coords with defining gap", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <mathinput name="n"/>

  <graph>
    <point>(<math>5</math><sequence from="2" to="$n" /><math>1</math>,4 )</point>
  </graph>

  <text>a</text>
    `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 =
        stateVariables["/_point1"].attributes.xs.component.activeChildren[0];
      let math1 = x1.definingChildren[0];
      let math1Name = math1.componentName;
      let math2 = x1.definingChildren[2];
      let math2Name = math2.componentName;

      cy.window().then(async (win) => {
        expect(x1.definingChildren.map((x) => x.componentName)).eqls([
          math1Name,
          "/_sequence1",
          math2Name,
        ]);
        expect(x1.activeChildren.map((x) => x.componentName)).eqls([
          math1Name,
          math2Name,
        ]);
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(5);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(4);
      });

      cy.get(cesc("#\\/n") + " textarea")
        .type("2{enter}", { force: true })
        .blur();

      cy.window().then(async (win) => {
        let math3 = stateVariables["/_sequence1"].replacements[0].adapterUsed;
        let math3Name = math3.componentName;
        expect(x1.definingChildren.map((x) => x.componentName)).eqls([
          math1Name,
          "/_sequence1",
          math2Name,
        ]);
        expect(x1.activeChildren.map((x) => x.componentName)).eqls([
          math1Name,
          math3Name,
          math2Name,
        ]);
        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(10);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(4);
      });
    });
  });

  it("copying via x1 and x2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <point>($_point1.x2, $_point1.x1)</point>
  </graph>
  $_point2.coords{assignNames="coords2"}
    `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(2,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(1);
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -4, y: 9 },
      });
    });
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(−4,9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(9);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(-4);
      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(-4);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(9);
    });
  });

  it("updating via point children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point name="p1"><point name="p2">(1,2)</point></point>
  </graph>
  
  <graph>
  <point name="p3">$p1{name="p4"}</point>
  </graph>
  
  <graph>
  <point name="p5">$p2{name="p6"}</point>
  </graph>
  
  <graph>
  <point name="p7"><copy target="_copy1" assignNames="(p8)" /></point>
  </graph>
  $p1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let points = ["/p1", "/p2", "/p3", "/p4", "/p5", "/p6", "/p7", "/p8"];
    let xs = [-10, 6, -4, 2, -9, -5, -2, 4];
    let ys = [8, 3, -3, -2, -6, 5, -9, 0];

    cy.log("initial positions");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `(1,2)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 1;
      let y = 2;
      for (let point of points) {
        expect(stateVariables[point].stateValues.xs[0]).eq(x);
        expect(stateVariables[point].stateValues.xs[1]).eq(y);
      }
    });

    cy.log("move each point in turn");
    for (let i = 0; i < 8; i++) {
      let x = xs[i];
      let y = ys[i];

      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "movePoint",
          componentName: points[i],
          args: { x, y },
        });
      });
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        for (let point of points) {
          expect(stateVariables[point].stateValues.xs[0]).eq(x);
          expect(stateVariables[point].stateValues.xs[1]).eq(y);
        }
      });
    }
  });

  it("combining different components through copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    $_point1
    $_point1
    <point x = "$(_copy1.y)" y="$(_copy2.x)" />
  </graph>
  $_point1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial positions");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `(1,2)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 1;
      let y = 2;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      let x = 9;
      let y = -1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: y, y: x },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
      });
    });
  });

  it("combining different components through copies 2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    $_point1
    $_point1
    <point x = "$(_copy1.y)" y="$(_copy2.x)" />
  </graph>
  $_point1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial positions");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `(1,2)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 1;
      let y = 2;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      let x = 9;
      let y = -1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: y, y: x },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
      });
    });
  });

  it("copy prop of copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math>$p1a.y{assignNames="p1ay"}</math>

    <graph>
      <copy name="p1a" target="p1" assignNames="p1ap" />
    </graph>
    
    <graph>
      <point name="p1" x="3" y="7" />
    </graph>

    $p1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial values");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `(3,7)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 3;
      let y = 7;

      expect(stateVariables["/p1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/p1ap"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/p1ap"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/p1ay"].stateValues.value).eq(y);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/p1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/p1ap"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1ap"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/p1ay"].stateValues.value).eq(y);
      });

      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(y.toString());
        });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1ap",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/p1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/p1ap"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1ap"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/p1ay"].stateValues.value).eq(y);
      });
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(y.toString());
        });
    });
  });

  it("nested copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    $p1a{name="p1b"}
  </graph>
  
  <graph>
    $p1{name="p1a"}
  </graph>
  
  <graph>
    <point name="p1" x="3" y="7"/>
  </graph>
  $p1.coords{assignNames="coords1"}
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial values");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `(3,7)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 3;
      let y = 7;

      expect(stateVariables["/p1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/p1a"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/p1a"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/p1b"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/p1b"].stateValues.xs[1]).eq(y);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/p1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/p1b"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1b"].stateValues.xs[1]).eq(y);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1a",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/p1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/p1b"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1b"].stateValues.xs[1]).eq(y);
      });
    });

    cy.log("move point 3");
    cy.window().then(async (win) => {
      let x = -4;
      let y = 0;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1b",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/p1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/p1b"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/p1b"].stateValues.xs[1]).eq(y);
      });
    });
  });
});
