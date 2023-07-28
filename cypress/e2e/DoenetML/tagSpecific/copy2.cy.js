import { cesc, cesc2 } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

describe("Copy Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("source attributes to ignore", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p name="p1" newNamespace fixed isResponse>The text: <text name="hidden" hide fixed isResponse>secret</text></p>

    <p>Text stays hidden by default:</p>
    $p1{name="p2"}
    <p name="p4">Check attributes: $p2.hidden $p2.fixed $p2.isResponse $(p2/hidden.hidden) $(p2/hidden.fixed) $(p2/hidden.isResponse)</p>

    <p>Now all is revealed:</p>
    <copy source="p1" name="p5" sourceAttributesToIgnore="hide fixed" />
    <p name="p7">Check attributes: $p5.hidden $p5.fixed $p5.isResponse $(p5/hidden.hidden) $(p5/hidden.fixed) $(p5/hidden.isResponse)</p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/p1")).should("have.text", "The text: ");

    cy.get(cesc("#\\/p2")).should("have.text", "The text: ");
    cy.get(cesc("#\\/p4")).should(
      "have.text",
      "Check attributes: false true false true true false",
    );

    cy.get(cesc("#\\/p5")).should("have.text", "The text: secret");
    cy.get(cesc("#\\/p7")).should(
      "have.text",
      "Check attributes: false false true false false true",
    );
  });

  it("copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph name="g1">
      <point name="P">(1,2)</point>
    </graph>
    <copy source="P.x" assignNames="P1x" />
    <graph name="g2" newNamespace>
      <point name="P">(3,4)</point>
    </graph>
    <copy source="g2/P.x" assignNames="P2x" />
    <graph name="g3">
      <point copySource="P" name="Pa" />
    </graph>
    <graph name="g4" newNamespace>
      <point copySource="../g2/P" name="Pa" />
    </graph>
    <graph copySource="g1" name="g5" />
    <graph copySource="g2" name="g6" />
    <graph copySource="g3" name="g7" />
    <graph copySource="g4" name="g8" />

    <graph copySource="g1" name="g9" newNamespace />
    <graph copySource="g2" name="g10" newNamespace />
    <graph copySource="g3" name="g11" newNamespace />
    <graph copySource="g4" name="g12" newNamespace />

    <graph copySource="g5" name="g13" />
    <graph copySource="g6" name="g14" />
    <graph copySource="g7" name="g15" />
    <graph copySource="g8" name="g16" />
    <graph copySource="g9" name="g17" />
    <graph copySource="g10" name="g18" />
    <graph copySource="g11" name="g19" />
    <graph copySource="g12" name="g20" />
  
    <graph copySource="g5" name="g21" newNamespace />
    <graph copySource="g6" name="g22" newNamespace />
    <graph copySource="g7" name="g23" newNamespace />
    <graph copySource="g8" name="g24" newNamespace />
    <graph copySource="g9" name="g25" newNamespace />
    <graph copySource="g10" name="g26" newNamespace />
    <graph copySource="g11" name="g27" newNamespace />
    <graph copySource="g12" name="g28" newNamespace />

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let P1 = [1, 2];
    let P2 = [3, 4];

    cy.get(cesc2("#/P1x")).contains(`${P1[0]}`);
    cy.get(cesc2("#/P2x")).contains(`${P2[0]}`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g5PName = stateVariables["/g5"].activeChildren[0].componentName;
      let g7PName = stateVariables["/g7"].activeChildren[0].componentName;
      let g13PName = stateVariables["/g13"].activeChildren[0].componentName;
      let g15PName = stateVariables["/g15"].activeChildren[0].componentName;
      let g21PName = stateVariables["/g21"].activeChildren[0].componentName;
      let g23PName = stateVariables["/g23"].activeChildren[0].componentName;

      expect(stateVariables["/P"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls(P2);
      expect(stateVariables["/Pa"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g4/Pa"].stateValues.xs).eqls(P2);

      expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g6/P"].stateValues.xs).eqls(P2);
      expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g8/Pa"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g9/P"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g10/P"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g11/Pa"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g12/Pa"].stateValues.xs).eqls(P2);

      expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g14/P"].stateValues.xs).eqls(P2);
      expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g16/Pa"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g17/P"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g18/P"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g19/Pa"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g20/Pa"].stateValues.xs).eqls(P2);

      expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g22/P"].stateValues.xs).eqls(P2);
      expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g24/Pa"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g25/P"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g26/P"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g27/Pa"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g28/Pa"].stateValues.xs).eqls(P2);

      cy.log(`move P1 to (4,5)`);
      cy.window().then(async (win) => {
        P1 = [4, 5];

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/P",
          args: { x: P1[0], y: P1[1] },
        });

        cy.get(cesc2("#/P1x")).contains(`${P1[0]}`);
        cy.get(cesc2("#/P2x")).contains(`${P2[0]}`);
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g4/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g6/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g8/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g9/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g10/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g11/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g12/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g14/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g16/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g18/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g19/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g20/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g22/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g24/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g26/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g27/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g28/Pa"].stateValues.xs).eqls(P2);
      });

      cy.log(`move P2 to (7,0)`);
      cy.window().then(async (win) => {
        P2 = [7, 0];
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/g2/P",
          args: { x: P2[0], y: P2[1] },
        });

        cy.get(cesc2("#/P2x")).contains(`${P2[0]}`);
        cy.get(cesc2("#/P1x")).contains(`${P1[0]}`);
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g4/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g6/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g8/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g9/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g10/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g11/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g12/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g14/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g16/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g18/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g19/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g20/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g22/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g24/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g26/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g27/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g28/Pa"].stateValues.xs).eqls(P2);
      });

      cy.log(`move P1 via Pa to (2,9)`);
      cy.window().then(async (win) => {
        P1 = [2, 0];

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/Pa",
          args: { x: P1[0], y: P1[1] },
        });

        cy.get(cesc2("#/P1x")).contains(`${P1[0]}`);
        cy.get(cesc2("#/P2x")).contains(`${P2[0]}`);
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g4/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g6/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g8/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g9/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g10/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g11/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g12/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g14/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g16/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g18/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g19/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g20/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g22/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g24/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g26/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g27/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g28/Pa"].stateValues.xs).eqls(P2);
      });

      cy.log(`move P2 via graph 4's Pa to (8, 6)`);
      cy.window().then(async (win) => {
        P2 = [8, 6];
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/g4/Pa",
          args: { x: P2[0], y: P2[1] },
        });

        cy.get(cesc2("#/P2x")).contains(`${P2[0]}`);
        cy.get(cesc2("#/P1x")).contains(`${P1[0]}`);
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g4/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g6/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g8/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g9/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g10/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g11/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g12/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g14/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g16/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g18/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g19/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g20/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g22/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g24/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g26/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g27/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g28/Pa"].stateValues.xs).eqls(P2);
      });
    });
  });

  it("copySource and copies with newNamespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph name="g1">
      <point name="P">(1,2)</point>
    </graph>
    $P.x{name="P1x"}
    <graph name="g2" newNamespace>
      <point name="P">(3,4)</point>
    </graph>
    $(g2/P.x{name="P2x"})
    <graph name="g3">
      <point copySource="P" name="Pa" />
    </graph>
    <graph name="g4" newNamespace>
      <point copySource="../g2/P" name="Pa" />
    </graph>
    <graph copySource="g1" name="g5" />
    <graph copySource="g2" name="g6" />
    <graph copySource="g3" name="g7" />
    <graph copySource="g4" name="g8" />

    $g1{name="g9" newNamespace}
    $g2{name="g10" newNamespace}
    $g3{name="g11" newNamespace}
    $g4{name="g12" newNamespace}

    <graph copySource="g5" name="g13" />
    <graph copySource="g6" name="g14" />
    <graph copySource="g7" name="g15" />
    <graph copySource="g8" name="g16" />
    <graph copySource="g9" name="g17" />
    <graph copySource="g10" name="g18" />
    <graph copySource="g11" name="g19" />
    <graph copySource="g12" name="g20" />
  
    $g5{name="g21" newNamespace}
    $g6{name="g22" newNamespace}
    $g7{name="g23" newNamespace}
    $g8{name="g24" newNamespace}
    $g9{name="g25" newNamespace}
    $g10{name="g26" newNamespace}
    $g11{name="g27" newNamespace}
    $g12{name="g28" newNamespace}

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let P1 = [1, 2];
    let P2 = [3, 4];

    cy.get(cesc2("#/P1x")).contains(`${P1[0]}`);
    cy.get(cesc2("#/P2x")).contains(`${P2[0]}`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g5PName = stateVariables["/g5"].activeChildren[0].componentName;
      let g7PName = stateVariables["/g7"].activeChildren[0].componentName;
      let g13PName = stateVariables["/g13"].activeChildren[0].componentName;
      let g15PName = stateVariables["/g15"].activeChildren[0].componentName;
      let g21PName = stateVariables["/g21"].activeChildren[0].componentName;
      let g23PName = stateVariables["/g23"].activeChildren[0].componentName;

      expect(stateVariables["/P"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls(P2);
      expect(stateVariables["/Pa"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g4/Pa"].stateValues.xs).eqls(P2);

      expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g6/P"].stateValues.xs).eqls(P2);
      expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g8/Pa"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g9/P"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g10/P"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g11/Pa"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g12/Pa"].stateValues.xs).eqls(P2);

      expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g14/P"].stateValues.xs).eqls(P2);
      expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g16/Pa"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g17/P"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g18/P"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g19/Pa"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g20/Pa"].stateValues.xs).eqls(P2);

      expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g22/P"].stateValues.xs).eqls(P2);
      expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
      expect(stateVariables["/g24/Pa"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g25/P"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g26/P"].stateValues.xs).eqls(P2);
      expect(stateVariables["/g27/Pa"].stateValues.xs).eqls(P1);
      expect(stateVariables["/g28/Pa"].stateValues.xs).eqls(P2);

      cy.log(`move P1 to (4,5)`);
      cy.window().then(async (win) => {
        P1 = [4, 5];

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/P",
          args: { x: P1[0], y: P1[1] },
        });

        cy.get(cesc2("#/P1x")).contains(`${P1[0]}`);
        cy.get(cesc2("#/P2x")).contains(`${P2[0]}`);
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g4/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g6/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g8/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g9/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g10/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g11/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g12/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g14/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g16/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g18/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g19/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g20/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g22/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g24/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g26/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g27/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g28/Pa"].stateValues.xs).eqls(P2);
      });

      cy.log(`move P2 to (7,0)`);
      cy.window().then(async (win) => {
        P2 = [7, 0];
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/g2/P",
          args: { x: P2[0], y: P2[1] },
        });

        cy.get(cesc2("#/P2x")).contains(`${P2[0]}`);
        cy.get(cesc2("#/P1x")).contains(`${P1[0]}`);
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g4/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g6/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g8/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g9/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g10/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g11/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g12/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g14/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g16/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g18/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g19/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g20/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g22/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g24/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g26/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g27/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g28/Pa"].stateValues.xs).eqls(P2);
      });

      cy.log(`move P1 via Pa to (2,9)`);
      cy.window().then(async (win) => {
        P1 = [2, 0];

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/Pa",
          args: { x: P1[0], y: P1[1] },
        });

        cy.get(cesc2("#/P1x")).contains(`${P1[0]}`);
        cy.get(cesc2("#/P2x")).contains(`${P2[0]}`);
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g4/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g6/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g8/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g9/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g10/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g11/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g12/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g14/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g16/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g18/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g19/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g20/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g22/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g24/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g26/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g27/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g28/Pa"].stateValues.xs).eqls(P2);
      });

      cy.log(`move P2 via graph 4's Pa to (8, 6)`);
      cy.window().then(async (win) => {
        P2 = [8, 6];
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/g4/Pa",
          args: { x: P2[0], y: P2[1] },
        });

        cy.get(cesc2("#/P2x")).contains(`${P2[0]}`);
        cy.get(cesc2("#/P1x")).contains(`${P1[0]}`);
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g2/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g4/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g6/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g8/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g9/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g10/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g11/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g12/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g14/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g16/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g17/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g18/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g19/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g20/Pa"].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g22/P"].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables["/g24/Pa"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g25/P"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g26/P"].stateValues.xs).eqls(P2);
        expect(stateVariables["/g27/Pa"].stateValues.xs).eqls(P1);
        expect(stateVariables["/g28/Pa"].stateValues.xs).eqls(P2);
      });
    });
  });

  it("copy with newNamespace and references to parent", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <mathinput name="mi" prefill="p" />
    <answer>x</answer>

    <problem name="p1">
      <answer>y</answer>
      <p>Credit achieved: $p1.creditAchieved{assignNames="ca"}</p>
      <p>Value of mathinput: $mi.value{assignNames="m"}</p>
      <p>Other answer credit achieved: $(p2/_answer1.creditAchieved{assignNames="cao"})</p>
      </problem>

    <problem name="p2" newNamespace>
      <answer>z</answer>
      <p>Credit achieved: $(../p2.creditAchieved{assignNames="ca"})</p>
      <p>Value of mathinput: $(../mi.value{assignNames="m"})</p>
      <p>Other answer credit achieved: $(../_answer2.creditAchieved{assignNames="cao"})</p>
    </problem>

    $p1{name="p3" newNamespace}

    $p2{name="p4" newNamespace}

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/ca")).contains("0");
    cy.get(cesc2("#/p2/cao")).contains("0");
    cy.get(cesc2("#/p3/ca")).contains("0");
    cy.get(cesc2("#/p4/cao")).contains("0");

    cy.get(cesc2("#/cao")).contains("0");
    cy.get(cesc2("#/p2/ca")).contains("0");
    cy.get(cesc2("#/p3/cao")).contains("0");
    cy.get(cesc2("#/p4/ca")).contains("0");

    cy.get(cesc2("#/m") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "p");
    cy.get(cesc2("#/p2/m") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "p");
    cy.get(cesc2("#/p3/m") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "p");
    cy.get(cesc2("#/p4/m") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "p");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinputoutsideName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinputoutsideAnchor =
        cesc2("#" + mathinputoutsideName) + " textarea";
      let mathinputoutsideSubmitAnchor = cesc2(
        "#" + mathinputoutsideName + "_submit",
      );
      let mathinputoutsideCorrectAnchor = cesc2(
        "#" + mathinputoutsideName + "_correct",
      );
      let mathinputoutsideIncorrectAnchor = cesc2(
        "#" + mathinputoutsideName + "_incorrect",
      );
      let mathinputoutsideFieldAnchor =
        cesc2("#" + mathinputoutsideName) + " .mq-editable-field";

      let mathinputp1Name =
        stateVariables["/_answer2"].stateValues.inputChildren[0].componentName;
      let mathinputp1Anchor = cesc2("#" + mathinputp1Name) + " textarea";
      let mathinputp1SubmitAnchor = cesc2("#" + mathinputp1Name + "_submit");
      let mathinputp1CorrectAnchor = cesc2("#" + mathinputp1Name + "_correct");
      let mathinputp1IncorrectAnchor = cesc2(
        "#" + mathinputp1Name + "_incorrect",
      );
      let mathinputp1FieldAnchor =
        cesc2("#" + mathinputp1Name) + " .mq-editable-field";

      let mathinputp2Name =
        stateVariables["/p2/_answer1"].stateValues.inputChildren[0]
          .componentName;
      let mathinputp2Anchor = cesc2("#" + mathinputp2Name) + " textarea";
      let mathinputp2SubmitAnchor = cesc2("#" + mathinputp2Name + "_submit");
      let mathinputp2CorrectAnchor = cesc2("#" + mathinputp2Name + "_correct");
      let mathinputp2IncorrectAnchor = cesc2(
        "#" + mathinputp2Name + "_incorrect",
      );
      let mathinputp2FieldAnchor =
        cesc2("#" + mathinputp2Name) + " .mq-editable-field";

      let mathinputp3Name =
        stateVariables["/p3/_answer2"].stateValues.inputChildren[0]
          .componentName;
      let mathinputp3Anchor = cesc2("#" + mathinputp3Name) + " textarea";
      let mathinputp3SubmitAnchor = cesc2("#" + mathinputp3Name + "_submit");
      let mathinputp3CorrectAnchor = cesc2("#" + mathinputp3Name + "_correct");
      let mathinputp3IncorrectAnchor = cesc2(
        "#" + mathinputp3Name + "_incorrect",
      );
      let mathinputp3FieldAnchor =
        cesc2("#" + mathinputp3Name) + " .mq-editable-field";

      let mathinputp4Name =
        stateVariables["/p4/_answer1"].stateValues.inputChildren[0]
          .componentName;
      let mathinputp4Anchor = cesc2("#" + mathinputp4Name) + " textarea";
      let mathinputp4SubmitAnchor = cesc2("#" + mathinputp4Name + "_submit");
      let mathinputp4CorrectAnchor = cesc2("#" + mathinputp4Name + "_correct");
      let mathinputp4IncorrectAnchor = cesc2(
        "#" + mathinputp4Name + "_incorrect",
      );
      let mathinputp4FieldAnchor =
        cesc2("#" + mathinputp4Name) + " .mq-editable-field";

      expect(stateVariables["/ca"].stateValues.value).eq(0);
      expect(stateVariables["/p2/cao"].stateValues.value).eq(0);
      expect(stateVariables["/p3/ca"].stateValues.value).eq(0);
      expect(stateVariables["/p4/cao"].stateValues.value).eq(0);

      expect(stateVariables["/cao"].stateValues.value).eq(0);
      expect(stateVariables["/p2/ca"].stateValues.value).eq(0);
      expect(stateVariables["/p3/cao"].stateValues.value).eq(0);
      expect(stateVariables["/p4/ca"].stateValues.value).eq(0);

      expect(stateVariables["/m"].stateValues.value).eq("p");
      expect(stateVariables["/p2/m"].stateValues.value).eq("p");
      expect(stateVariables["/p3/m"].stateValues.value).eq("p");
      expect(stateVariables["/p4/m"].stateValues.value).eq("p");

      cy.log("answer outside answer");

      cy.get(mathinputoutsideAnchor).type("x{enter}", { force: true });
      cy.get(mathinputoutsideCorrectAnchor).should("be.visible");
      cy.get(mathinputp1SubmitAnchor).should("be.visible");
      cy.get(mathinputp2SubmitAnchor).should("be.visible");
      cy.get(mathinputp3SubmitAnchor).should("be.visible");
      cy.get(mathinputp4SubmitAnchor).should("be.visible");

      cy.log("correctly answer first problem");
      cy.get(mathinputp1Anchor).type("y{enter}", { force: true });
      cy.get(mathinputp1CorrectAnchor).should("be.visible");
      cy.get(mathinputp2SubmitAnchor).should("be.visible");
      cy.get(mathinputp3CorrectAnchor).should("be.visible");
      cy.get(mathinputp4SubmitAnchor).should("be.visible");

      cy.get(mathinputp1FieldAnchor)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("y");
        });
      cy.get(mathinputp2FieldAnchor).should("have.text", "");
      cy.get(mathinputp3FieldAnchor).should("have.text", "y");
      cy.get(mathinputp4FieldAnchor).should("have.text", "");

      cy.get(cesc2("#/ca")).contains("1");
      cy.get(cesc2("#/p2/cao")).contains("1");
      cy.get(cesc2("#/p3/ca")).contains("1");
      cy.get(cesc2("#/p4/cao")).contains("1");

      cy.get(cesc2("#/cao")).contains("0");
      cy.get(cesc2("#/p2/ca")).contains("0");
      cy.get(cesc2("#/p3/cao")).contains("0");
      cy.get(cesc2("#/p4/ca")).contains("0");

      cy.get(cesc2("#/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p2/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p3/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p4/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(1);

        expect(stateVariables["/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(0);

        expect(stateVariables["/m"].stateValues.value).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value).eq("p");
      });

      cy.log("correctly answer second problem");
      cy.get(mathinputp2Anchor).type("z{enter}", { force: true });
      cy.get(mathinputp2CorrectAnchor).should("be.visible");
      cy.get(mathinputp1CorrectAnchor).should("be.visible");
      cy.get(mathinputp3CorrectAnchor).should("be.visible");
      cy.get(mathinputp4CorrectAnchor).should("be.visible");

      cy.get(mathinputp2FieldAnchor)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
        });
      cy.get(mathinputp1FieldAnchor).should("have.text", "y");
      cy.get(mathinputp3FieldAnchor).should("have.text", "y");
      cy.get(mathinputp4FieldAnchor).should("have.text", "z");

      cy.get(cesc2("#/ca")).contains("1");
      cy.get(cesc2("#/p2/cao")).contains("1");
      cy.get(cesc2("#/p3/ca")).contains("1");
      cy.get(cesc2("#/p4/cao")).contains("1");

      cy.get(cesc2("#/cao")).contains("1");
      cy.get(cesc2("#/p2/ca")).contains("1");
      cy.get(cesc2("#/p3/cao")).contains("1");
      cy.get(cesc2("#/p4/ca")).contains("1");

      cy.get(cesc2("#/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p2/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p3/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p4/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(1);

        expect(stateVariables["/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(1);

        expect(stateVariables["/m"].stateValues.value).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value).eq("p");
      });

      cy.log("incorrectly answer third problem");
      cy.get(mathinputp3Anchor).type("{end}{backspace}a{enter}", {
        force: true,
      });
      cy.get(mathinputp3IncorrectAnchor).should("be.visible");
      cy.get(mathinputp1IncorrectAnchor).should("be.visible");
      cy.get(mathinputp2CorrectAnchor).should("be.visible");
      cy.get(mathinputp4CorrectAnchor).should("be.visible");

      cy.get(mathinputp3FieldAnchor)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
        });
      cy.get(mathinputp1FieldAnchor).should("have.text", "a");
      cy.get(mathinputp2FieldAnchor).should("have.text", "z");
      cy.get(mathinputp4FieldAnchor).should("have.text", "z");

      cy.get(cesc2("#/ca")).contains("0");
      cy.get(cesc2("#/p2/cao")).contains("0");
      cy.get(cesc2("#/p3/ca")).contains("0");
      cy.get(cesc2("#/p4/cao")).contains("0");

      cy.get(cesc2("#/cao")).contains("1");
      cy.get(cesc2("#/p2/ca")).contains("1");
      cy.get(cesc2("#/p3/cao")).contains("1");
      cy.get(cesc2("#/p4/ca")).contains("1");

      cy.get(cesc2("#/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p2/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p3/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p4/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(0);

        expect(stateVariables["/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(1);

        expect(stateVariables["/m"].stateValues.value).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value).eq("p");
      });

      cy.log("incorrectly answer fourth problem");
      cy.get(mathinputp4Anchor).type("{end}{backspace}b{enter}", {
        force: true,
      });
      cy.get(mathinputp4IncorrectAnchor).should("be.visible");
      cy.get(mathinputp1IncorrectAnchor).should("be.visible");
      cy.get(mathinputp2IncorrectAnchor).should("be.visible");
      cy.get(mathinputp3IncorrectAnchor).should("be.visible");

      cy.get(mathinputp4FieldAnchor)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
        });
      cy.get(mathinputp1FieldAnchor).should("have.text", "a");
      cy.get(mathinputp2FieldAnchor).should("have.text", "b");
      cy.get(mathinputp3FieldAnchor).should("have.text", "a");

      cy.get(cesc2("#/ca")).contains("0");
      cy.get(cesc2("#/p2/cao")).contains("0");
      cy.get(cesc2("#/p3/ca")).contains("0");
      cy.get(cesc2("#/p4/cao")).contains("0");

      cy.get(cesc2("#/cao")).contains("0");
      cy.get(cesc2("#/p2/ca")).contains("0");
      cy.get(cesc2("#/p3/cao")).contains("0");
      cy.get(cesc2("#/p4/ca")).contains("0");

      cy.get(cesc2("#/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p2/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p3/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p4/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(0);

        expect(stateVariables["/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(0);

        expect(stateVariables["/m"].stateValues.value).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value).eq("p");
      });

      cy.log("change mathinput");
      cy.get(cesc2("#/mi") + " textarea").type("{end}{backspace}q{enter}", {
        force: true,
      });
      cy.get(cesc2("#/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "q");
      cy.get(cesc2("#/p2/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "q");
      cy.get(cesc2("#/p3/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "q");
      cy.get(cesc2("#/p4/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "q");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/m"].stateValues.value).eq("q");
        expect(stateVariables["/p2/m"].stateValues.value).eq("q");
        expect(stateVariables["/p3/m"].stateValues.value).eq("q");
        expect(stateVariables["/p4/m"].stateValues.value).eq("q");
      });
    });
  });

  it("copySource with newNamespace and references to parent", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <mathinput name="mi" prefill="p" />
    <answer>x</answer>

    <problem name="p1">
      <answer>y</answer>
      <p>Credit achieved: <number copysource="p1.creditAchieved" name="ca" /></p>
      <p>Value of mathinput: <math copysource="mi" name="m" /></p>
      <p>Other answer credit achieved: <number copysource="p2/_answer1.creditAchieved" name="cao" /></p>
    </problem>

    <problem name="p2" newNamespace>
      <answer>z</answer>
      <p>Credit achieved: <number copysource="../p2.creditAchieved" name="ca" /></p>
      <p>Value of mathinput: <math copysource="../mi" name="m" /></p>
      <p>Other answer credit achieved: <number copysource="../_answer2.creditAchieved" name="cao" /></p>
    </problem>

    <problem copySource="p1" name="p3" newNamespace />

    <problem copySource="p2" name="p4" newNamespace />

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/ca")).contains("0");
    cy.get(cesc2("#/p2/cao")).contains("0");
    cy.get(cesc2("#/p3/ca")).contains("0");
    cy.get(cesc2("#/p4/cao")).contains("0");

    cy.get(cesc2("#/cao")).contains("0");
    cy.get(cesc2("#/p2/ca")).contains("0");
    cy.get(cesc2("#/p3/cao")).contains("0");
    cy.get(cesc2("#/p4/ca")).contains("0");

    cy.get(cesc2("#/m") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "p");
    cy.get(cesc2("#/p2/m") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "p");
    cy.get(cesc2("#/p3/m") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "p");
    cy.get(cesc2("#/p4/m") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "p");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinputoutsideName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinputoutsideAnchor =
        cesc2("#" + mathinputoutsideName) + " textarea";
      let mathinputoutsideSubmitAnchor = cesc2(
        "#" + mathinputoutsideName + "_submit",
      );
      let mathinputoutsideCorrectAnchor = cesc2(
        "#" + mathinputoutsideName + "_correct",
      );
      let mathinputoutsideIncorrectAnchor = cesc2(
        "#" + mathinputoutsideName + "_incorrect",
      );
      let mathinputoutsideFieldAnchor =
        cesc2("#" + mathinputoutsideName) + " .mq-editable-field";

      let mathinputp1Name =
        stateVariables["/_answer2"].stateValues.inputChildren[0].componentName;
      let mathinputp1Anchor = cesc2("#" + mathinputp1Name) + " textarea";
      let mathinputp1SubmitAnchor = cesc2("#" + mathinputp1Name + "_submit");
      let mathinputp1CorrectAnchor = cesc2("#" + mathinputp1Name + "_correct");
      let mathinputp1IncorrectAnchor = cesc2(
        "#" + mathinputp1Name + "_incorrect",
      );
      let mathinputp1FieldAnchor =
        cesc2("#" + mathinputp1Name) + " .mq-editable-field";

      let mathinputp2Name =
        stateVariables["/p2/_answer1"].stateValues.inputChildren[0]
          .componentName;
      let mathinputp2Anchor = cesc2("#" + mathinputp2Name) + " textarea";
      let mathinputp2SubmitAnchor = cesc2("#" + mathinputp2Name + "_submit");
      let mathinputp2CorrectAnchor = cesc2("#" + mathinputp2Name + "_correct");
      let mathinputp2IncorrectAnchor = cesc2(
        "#" + mathinputp2Name + "_incorrect",
      );
      let mathinputp2FieldAnchor =
        cesc2("#" + mathinputp2Name) + " .mq-editable-field";

      let mathinputp3Name =
        stateVariables["/p3/_answer2"].stateValues.inputChildren[0]
          .componentName;
      let mathinputp3Anchor = cesc2("#" + mathinputp3Name) + " textarea";
      let mathinputp3SubmitAnchor = cesc2("#" + mathinputp3Name + "_submit");
      let mathinputp3CorrectAnchor = cesc2("#" + mathinputp3Name + "_correct");
      let mathinputp3IncorrectAnchor = cesc2(
        "#" + mathinputp3Name + "_incorrect",
      );
      let mathinputp3FieldAnchor =
        cesc2("#" + mathinputp3Name) + " .mq-editable-field";

      let mathinputp4Name =
        stateVariables["/p4/_answer1"].stateValues.inputChildren[0]
          .componentName;
      let mathinputp4Anchor = cesc2("#" + mathinputp4Name) + " textarea";
      let mathinputp4SubmitAnchor = cesc2("#" + mathinputp4Name + "_submit");
      let mathinputp4CorrectAnchor = cesc2("#" + mathinputp4Name + "_correct");
      let mathinputp4IncorrectAnchor = cesc2(
        "#" + mathinputp4Name + "_incorrect",
      );
      let mathinputp4FieldAnchor =
        cesc2("#" + mathinputp4Name) + " .mq-editable-field";

      expect(stateVariables["/ca"].stateValues.value).eq(0);
      expect(stateVariables["/p2/cao"].stateValues.value).eq(0);
      expect(stateVariables["/p3/ca"].stateValues.value).eq(0);
      expect(stateVariables["/p4/cao"].stateValues.value).eq(0);

      expect(stateVariables["/cao"].stateValues.value).eq(0);
      expect(stateVariables["/p2/ca"].stateValues.value).eq(0);
      expect(stateVariables["/p3/cao"].stateValues.value).eq(0);
      expect(stateVariables["/p4/ca"].stateValues.value).eq(0);

      expect(stateVariables["/m"].stateValues.value).eq("p");
      expect(stateVariables["/p2/m"].stateValues.value).eq("p");
      expect(stateVariables["/p3/m"].stateValues.value).eq("p");
      expect(stateVariables["/p4/m"].stateValues.value).eq("p");

      cy.log("answer outside answer");

      cy.get(mathinputoutsideAnchor).type("x{enter}", { force: true });
      cy.get(mathinputoutsideCorrectAnchor).should("be.visible");
      cy.get(mathinputp1SubmitAnchor).should("be.visible");
      cy.get(mathinputp2SubmitAnchor).should("be.visible");
      cy.get(mathinputp3SubmitAnchor).should("be.visible");
      cy.get(mathinputp4SubmitAnchor).should("be.visible");

      cy.log("correctly answer first problem");
      cy.get(mathinputp1Anchor).type("y{enter}", { force: true });
      cy.get(mathinputp1CorrectAnchor).should("be.visible");
      cy.get(mathinputp2SubmitAnchor).should("be.visible");
      cy.get(mathinputp3CorrectAnchor).should("be.visible");
      cy.get(mathinputp4SubmitAnchor).should("be.visible");

      cy.get(mathinputp1FieldAnchor)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("y");
        });
      cy.get(mathinputp2FieldAnchor).should("have.text", "");
      cy.get(mathinputp3FieldAnchor).should("have.text", "y");
      cy.get(mathinputp4FieldAnchor).should("have.text", "");

      cy.get(cesc2("#/ca")).contains("1");
      cy.get(cesc2("#/p2/cao")).contains("1");
      cy.get(cesc2("#/p3/ca")).contains("1");
      cy.get(cesc2("#/p4/cao")).contains("1");

      cy.get(cesc2("#/cao")).contains("0");
      cy.get(cesc2("#/p2/ca")).contains("0");
      cy.get(cesc2("#/p3/cao")).contains("0");
      cy.get(cesc2("#/p4/ca")).contains("0");

      cy.get(cesc2("#/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p2/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p3/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p4/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(1);

        expect(stateVariables["/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(0);

        expect(stateVariables["/m"].stateValues.value).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value).eq("p");
      });

      cy.log("correctly answer second problem");
      cy.get(mathinputp2Anchor).type("z{enter}", { force: true });
      cy.get(mathinputp2CorrectAnchor).should("be.visible");
      cy.get(mathinputp1CorrectAnchor).should("be.visible");
      cy.get(mathinputp3CorrectAnchor).should("be.visible");
      cy.get(mathinputp4CorrectAnchor).should("be.visible");

      cy.get(mathinputp2FieldAnchor)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
        });
      cy.get(mathinputp1FieldAnchor).should("have.text", "y");
      cy.get(mathinputp3FieldAnchor).should("have.text", "y");
      cy.get(mathinputp4FieldAnchor).should("have.text", "z");

      cy.get(cesc2("#/ca")).contains("1");
      cy.get(cesc2("#/p2/cao")).contains("1");
      cy.get(cesc2("#/p3/ca")).contains("1");
      cy.get(cesc2("#/p4/cao")).contains("1");

      cy.get(cesc2("#/cao")).contains("1");
      cy.get(cesc2("#/p2/ca")).contains("1");
      cy.get(cesc2("#/p3/cao")).contains("1");
      cy.get(cesc2("#/p4/ca")).contains("1");

      cy.get(cesc2("#/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p2/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p3/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p4/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(1);

        expect(stateVariables["/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(1);

        expect(stateVariables["/m"].stateValues.value).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value).eq("p");
      });

      cy.log("incorrectly answer third problem");
      cy.get(mathinputp3Anchor).type("{end}{backspace}a{enter}", {
        force: true,
      });
      cy.get(mathinputp3IncorrectAnchor).should("be.visible");
      cy.get(mathinputp1IncorrectAnchor).should("be.visible");
      cy.get(mathinputp2CorrectAnchor).should("be.visible");
      cy.get(mathinputp4CorrectAnchor).should("be.visible");

      cy.get(mathinputp3FieldAnchor)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
        });
      cy.get(mathinputp1FieldAnchor).should("have.text", "a");
      cy.get(mathinputp2FieldAnchor).should("have.text", "z");
      cy.get(mathinputp4FieldAnchor).should("have.text", "z");

      cy.get(cesc2("#/ca")).contains("0");
      cy.get(cesc2("#/p2/cao")).contains("0");
      cy.get(cesc2("#/p3/ca")).contains("0");
      cy.get(cesc2("#/p4/cao")).contains("0");

      cy.get(cesc2("#/cao")).contains("1");
      cy.get(cesc2("#/p2/ca")).contains("1");
      cy.get(cesc2("#/p3/cao")).contains("1");
      cy.get(cesc2("#/p4/ca")).contains("1");

      cy.get(cesc2("#/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p2/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p3/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p4/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(0);

        expect(stateVariables["/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(1);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(1);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(1);

        expect(stateVariables["/m"].stateValues.value).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value).eq("p");
      });

      cy.log("incorrectly answer fourth problem");
      cy.get(mathinputp4Anchor).type("{end}{backspace}b{enter}", {
        force: true,
      });
      cy.get(mathinputp4IncorrectAnchor).should("be.visible");
      cy.get(mathinputp1IncorrectAnchor).should("be.visible");
      cy.get(mathinputp2IncorrectAnchor).should("be.visible");
      cy.get(mathinputp3IncorrectAnchor).should("be.visible");

      cy.get(mathinputp4FieldAnchor)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
        });
      cy.get(mathinputp1FieldAnchor).should("have.text", "a");
      cy.get(mathinputp2FieldAnchor).should("have.text", "b");
      cy.get(mathinputp3FieldAnchor).should("have.text", "a");

      cy.get(cesc2("#/ca")).contains("0");
      cy.get(cesc2("#/p2/cao")).contains("0");
      cy.get(cesc2("#/p3/ca")).contains("0");
      cy.get(cesc2("#/p4/cao")).contains("0");

      cy.get(cesc2("#/cao")).contains("0");
      cy.get(cesc2("#/p2/ca")).contains("0");
      cy.get(cesc2("#/p3/cao")).contains("0");
      cy.get(cesc2("#/p4/ca")).contains("0");

      cy.get(cesc2("#/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p2/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p3/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");
      cy.get(cesc2("#/p4/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "p");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p2/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p3/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p4/cao"].stateValues.value).eq(0);

        expect(stateVariables["/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p2/ca"].stateValues.value).eq(0);
        expect(stateVariables["/p3/cao"].stateValues.value).eq(0);
        expect(stateVariables["/p4/ca"].stateValues.value).eq(0);

        expect(stateVariables["/m"].stateValues.value).eq("p");
        expect(stateVariables["/p2/m"].stateValues.value).eq("p");
        expect(stateVariables["/p3/m"].stateValues.value).eq("p");
        expect(stateVariables["/p4/m"].stateValues.value).eq("p");
      });

      cy.log("change mathinput");
      cy.get(cesc2("#/mi") + " textarea").type("{end}{backspace}q{enter}", {
        force: true,
      });
      cy.get(cesc2("#/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "q");
      cy.get(cesc2("#/p2/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "q");
      cy.get(cesc2("#/p3/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "q");
      cy.get(cesc2("#/p4/m") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "q");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/m"].stateValues.value).eq("q");
        expect(stateVariables["/p2/m"].stateValues.value).eq("q");
        expect(stateVariables["/p3/m"].stateValues.value).eq("q");
        expect(stateVariables["/p4/m"].stateValues.value).eq("q");
      });
    });
  });

  it("copySource of map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <mathinput name="n" prefill="2" />

    <p>Value: <copy source="n" prop="value" assignNames="n2" /></p>
    <p>Value 2: <number copySource="n2" name="n3" /></p>

    <map name="map1" assignNames="(p1) (p2) (p3)">
      <template><p newNamespace>Hello <number copySource="v" />!  <mathinput name="x" /> <math copySource="x" /></p></template>
      <sources alias="v"><sequence from="1" to="$n" /></sources>
    </map>

    <map copySource="map1" name="map2" assignNames="(p1a) (p2a) (p3a)" />

    <map copySource="map2" name="map3" assignNames="(p1b) (p2b) (p3b)" />


    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/n2")).contains("2");
    cy.get(cesc2("#/n3")).contains("2");

    cy.get(cesc2("#/p1")).contains("Hello 1!");
    cy.get(cesc2("#/p1/_number1")).contains("1");
    cy.get(cesc2("#/p1/_math1")).contains("＿");
    cy.get(cesc2("#/p2")).contains("Hello 2!");
    cy.get(cesc2("#/p2/_number1")).contains("2");
    cy.get(cesc2("#/p2/_math1")).contains("＿");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p3/_number1")).should("not.exist");
    cy.get(cesc2("#/p3/_math1")).should("not.exist");

    cy.get(cesc2("#/p1a")).contains("Hello 1!");
    cy.get(cesc2("#/p1a/_number1")).contains("1");
    cy.get(cesc2("#/p1a/_math1")).contains("＿");
    cy.get(cesc2("#/p2a")).contains("Hello 2!");
    cy.get(cesc2("#/p2a/_number1")).contains("2");
    cy.get(cesc2("#/p2a/_math1")).contains("＿");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p3a/_number1")).should("not.exist");
    cy.get(cesc2("#/p3a/_math1")).should("not.exist");

    cy.get(cesc2("#/p1b")).contains("Hello 1!");
    cy.get(cesc2("#/p1b/_number1")).contains("1");
    cy.get(cesc2("#/p1b/_math1")).contains("＿");
    cy.get(cesc2("#/p2b")).contains("Hello 2!");
    cy.get(cesc2("#/p2b/_number1")).contains("2");
    cy.get(cesc2("#/p2b/_math1")).contains("＿");
    cy.get(cesc2("#/p3b")).should("not.exist");
    cy.get(cesc2("#/p3b/_number1")).should("not.exist");
    cy.get(cesc2("#/p3b/_math1")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(2);
      expect(stateVariables["/n3"].stateValues.value).eq(2);

      expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/_number1"]).eq(undefined);
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/_number1"]).eq(undefined);
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/_number1"]).eq(undefined);

      expect(stateVariables["/p1/_math1"].stateValues.value).eq("＿");
      expect(stateVariables["/p2/_math1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3/_math1"]).eq(undefined);
      expect(stateVariables["/p1a/_math1"].stateValues.value).eq("＿");
      expect(stateVariables["/p2a/_math1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3a/_math1"]).eq(undefined);
      expect(stateVariables["/p1b/_math1"].stateValues.value).eq("＿");
      expect(stateVariables["/p2b/_math1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3b/_math1"]).eq(undefined);
    });

    cy.log("type x in first mathinput");
    cy.get(cesc2("#/p1/x") + " textarea").type("x{enter}", { force: true });

    cy.get(cesc2("#/p1")).contains("Hello 1!");
    cy.get(cesc2("#/p1/_number1")).contains("1");
    cy.get(cesc2("#/p1/_math1")).contains("x");
    cy.get(cesc2("#/p2")).contains("Hello 2!");
    cy.get(cesc2("#/p2/_number1")).contains("2");
    cy.get(cesc2("#/p2/_math1")).contains("＿");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p3/_number1")).should("not.exist");
    cy.get(cesc2("#/p3/_math1")).should("not.exist");

    cy.get(cesc2("#/p1a")).contains("Hello 1!");
    cy.get(cesc2("#/p1a/_number1")).contains("1");
    cy.get(cesc2("#/p1a/_math1")).contains("x");
    cy.get(cesc2("#/p2a")).contains("Hello 2!");
    cy.get(cesc2("#/p2a/_number1")).contains("2");
    cy.get(cesc2("#/p2a/_math1")).contains("＿");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p3a/_number1")).should("not.exist");
    cy.get(cesc2("#/p3a/_math1")).should("not.exist");

    cy.get(cesc2("#/p1b")).contains("Hello 1!");
    cy.get(cesc2("#/p1b/_number1")).contains("1");
    cy.get(cesc2("#/p1b/_math1")).contains("x");
    cy.get(cesc2("#/p2b")).contains("Hello 2!");
    cy.get(cesc2("#/p2b/_number1")).contains("2");
    cy.get(cesc2("#/p2b/_math1")).contains("＿");
    cy.get(cesc2("#/p3b")).should("not.exist");
    cy.get(cesc2("#/p3b/_number1")).should("not.exist");
    cy.get(cesc2("#/p3b/_math1")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(2);
      expect(stateVariables["/n3"].stateValues.value).eq(2);

      expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/_number1"]).eq(undefined);
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/_number1"]).eq(undefined);
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/_number1"]).eq(undefined);

      expect(stateVariables["/p1/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2/_math1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3/_math1"]).eq(undefined);
      expect(stateVariables["/p1a/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2a/_math1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3a/_math1"]).eq(undefined);
      expect(stateVariables["/p1b/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2b/_math1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3b/_math1"]).eq(undefined);
    });

    cy.log("type y in second mathinput");
    cy.get(cesc2("#/p2b/x") + " textarea").type("y{enter}", { force: true });

    cy.get(cesc2("#/p1")).contains("Hello 1!");
    cy.get(cesc2("#/p1/_number1")).contains("1");
    cy.get(cesc2("#/p1/_math1")).contains("x");
    cy.get(cesc2("#/p2")).contains("Hello 2!");
    cy.get(cesc2("#/p2/_number1")).contains("2");
    cy.get(cesc2("#/p2/_math1")).contains("y");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p3/_number1")).should("not.exist");
    cy.get(cesc2("#/p3/_math1")).should("not.exist");

    cy.get(cesc2("#/p1a")).contains("Hello 1!");
    cy.get(cesc2("#/p1a/_number1")).contains("1");
    cy.get(cesc2("#/p1a/_math1")).contains("x");
    cy.get(cesc2("#/p2a")).contains("Hello 2!");
    cy.get(cesc2("#/p2a/_number1")).contains("2");
    cy.get(cesc2("#/p2a/_math1")).contains("y");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p3a/_number1")).should("not.exist");
    cy.get(cesc2("#/p3a/_math1")).should("not.exist");

    cy.get(cesc2("#/p1b")).contains("Hello 1!");
    cy.get(cesc2("#/p1b/_number1")).contains("1");
    cy.get(cesc2("#/p1b/_math1")).contains("x");
    cy.get(cesc2("#/p2b")).contains("Hello 2!");
    cy.get(cesc2("#/p2b/_number1")).contains("2");
    cy.get(cesc2("#/p2b/_math1")).contains("y");
    cy.get(cesc2("#/p3b")).should("not.exist");
    cy.get(cesc2("#/p3b/_number1")).should("not.exist");
    cy.get(cesc2("#/p3b/_math1")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(2);
      expect(stateVariables["/n3"].stateValues.value).eq(2);

      expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/_number1"]).eq(undefined);
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/_number1"]).eq(undefined);
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/_number1"]).eq(undefined);

      expect(stateVariables["/p1/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2/_math1"].stateValues.value).eq("y");
      expect(stateVariables["/p3/_math1"]).eq(undefined);
      expect(stateVariables["/p1a/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2a/_math1"].stateValues.value).eq("y");
      expect(stateVariables["/p3a/_math1"]).eq(undefined);
      expect(stateVariables["/p1b/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2b/_math1"].stateValues.value).eq("y");
      expect(stateVariables["/p3b/_math1"]).eq(undefined);
    });

    cy.log("increase n");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc2("#/n2")).contains("3");
    cy.get(cesc2("#/n3")).contains("3");

    cy.get(cesc2("#/p1")).contains("Hello 1!");
    cy.get(cesc2("#/p1/_number1")).contains("1");
    cy.get(cesc2("#/p1/_math1")).contains("x");
    cy.get(cesc2("#/p2")).contains("Hello 2!");
    cy.get(cesc2("#/p2/_number1")).contains("2");
    cy.get(cesc2("#/p2/_math1")).contains("y");
    cy.get(cesc2("#/p3")).contains("Hello 3!");
    cy.get(cesc2("#/p3/_number1")).contains("3");
    cy.get(cesc2("#/p3/_math1")).contains("＿");

    cy.get(cesc2("#/p1a")).contains("Hello 1!");
    cy.get(cesc2("#/p1a/_number1")).contains("1");
    cy.get(cesc2("#/p1a/_math1")).contains("x");
    cy.get(cesc2("#/p2a")).contains("Hello 2!");
    cy.get(cesc2("#/p2a/_number1")).contains("2");
    cy.get(cesc2("#/p2a/_math1")).contains("y");
    cy.get(cesc2("#/p3a")).contains("Hello 3!");
    cy.get(cesc2("#/p3a/_number1")).contains("3");
    cy.get(cesc2("#/p3a/_math1")).contains("＿");

    cy.get(cesc2("#/p1b")).contains("Hello 1!");
    cy.get(cesc2("#/p1b/_number1")).contains("1");
    cy.get(cesc2("#/p1b/_math1")).contains("x");
    cy.get(cesc2("#/p2b")).contains("Hello 2!");
    cy.get(cesc2("#/p2b/_number1")).contains("2");
    cy.get(cesc2("#/p2b/_math1")).contains("y");
    cy.get(cesc2("#/p3b")).contains("Hello 3!");
    cy.get(cesc2("#/p3b/_number1")).contains("3");
    cy.get(cesc2("#/p3b/_math1")).contains("＿");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(3);
      expect(stateVariables["/n3"].stateValues.value).eq(3);

      expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/_number1"].stateValues.value).eq(3);
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/_number1"].stateValues.value).eq(3);
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/_number1"].stateValues.value).eq(3);

      expect(stateVariables["/p1/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2/_math1"].stateValues.value).eq("y");
      expect(stateVariables["/p3/_math1"].stateValues.value).eq("＿");
      expect(stateVariables["/p1a/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2a/_math1"].stateValues.value).eq("y");
      expect(stateVariables["/p3a/_math1"].stateValues.value).eq("＿");
      expect(stateVariables["/p1b/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2b/_math1"].stateValues.value).eq("y");
      expect(stateVariables["/p3b/_math1"].stateValues.value).eq("＿");
    });

    cy.log("type z in third mathinput");
    cy.get(cesc2("#/p3a/x") + " textarea").type("z{enter}", { force: true });

    cy.get(cesc2("#/p1")).contains("Hello 1!");
    cy.get(cesc2("#/p1/_number1")).contains("1");
    cy.get(cesc2("#/p1/_math1")).contains("x");
    cy.get(cesc2("#/p2")).contains("Hello 2!");
    cy.get(cesc2("#/p2/_number1")).contains("2");
    cy.get(cesc2("#/p2/_math1")).contains("y");
    cy.get(cesc2("#/p3")).contains("Hello 3!");
    cy.get(cesc2("#/p3/_number1")).contains("3");
    cy.get(cesc2("#/p3/_math1")).contains("z");

    cy.get(cesc2("#/p1a")).contains("Hello 1!");
    cy.get(cesc2("#/p1a/_number1")).contains("1");
    cy.get(cesc2("#/p1a/_math1")).contains("x");
    cy.get(cesc2("#/p2a")).contains("Hello 2!");
    cy.get(cesc2("#/p2a/_number1")).contains("2");
    cy.get(cesc2("#/p2a/_math1")).contains("y");
    cy.get(cesc2("#/p3a")).contains("Hello 3!");
    cy.get(cesc2("#/p3a/_number1")).contains("3");
    cy.get(cesc2("#/p3a/_math1")).contains("z");

    cy.get(cesc2("#/p1b")).contains("Hello 1!");
    cy.get(cesc2("#/p1b/_number1")).contains("1");
    cy.get(cesc2("#/p1b/_math1")).contains("x");
    cy.get(cesc2("#/p2b")).contains("Hello 2!");
    cy.get(cesc2("#/p2b/_number1")).contains("2");
    cy.get(cesc2("#/p2b/_math1")).contains("y");
    cy.get(cesc2("#/p3b")).contains("Hello 3!");
    cy.get(cesc2("#/p3b/_number1")).contains("3");
    cy.get(cesc2("#/p3b/_math1")).contains("z");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(3);
      expect(stateVariables["/n3"].stateValues.value).eq(3);

      expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/_number1"].stateValues.value).eq(3);
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/_number1"].stateValues.value).eq(3);
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/_number1"].stateValues.value).eq(3);

      expect(stateVariables["/p1/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2/_math1"].stateValues.value).eq("y");
      expect(stateVariables["/p3/_math1"].stateValues.value).eq("z");
      expect(stateVariables["/p1a/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2a/_math1"].stateValues.value).eq("y");
      expect(stateVariables["/p3a/_math1"].stateValues.value).eq("z");
      expect(stateVariables["/p1b/_math1"].stateValues.value).eq("x");
      expect(stateVariables["/p2b/_math1"].stateValues.value).eq("y");
      expect(stateVariables["/p3b/_math1"].stateValues.value).eq("z");
    });
  });

  it("macro to copy map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <mathinput name="n" prefill="2" />

    <p>Value: $n.value{assignNames="n2"}</p>
    <p>Value 2: $n2{name="n3"}</p>

    <map name="map1" assignNames="(p1) (p2) (p3)">
      <template><p newNamespace>Hello $v{name="n1"}!  <mathinput name="x" /> $x{name="m1"}</p></template>
      <sources alias="v"><sequence from="1" to="$n" /></sources>
    </map>

    $map1{name="map2" assignNames="(p1a) (p2a) (p3a)"}

    $map2{name="map3" assignNames="(p1b) (p2b) (p3b)"}


    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/n2")).contains("2");
    cy.get(cesc2("#/n3")).contains("2");

    cy.get(cesc2("#/p1")).contains("Hello 1!");
    cy.get(cesc2("#/p1/n1")).contains("1");
    cy.get(cesc2("#/p1/m1")).contains("＿");
    cy.get(cesc2("#/p2")).contains("Hello 2!");
    cy.get(cesc2("#/p2/n1")).contains("2");
    cy.get(cesc2("#/p2/m1")).contains("＿");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p3/n1")).should("not.exist");
    cy.get(cesc2("#/p3/m1")).should("not.exist");

    cy.get(cesc2("#/p1a")).contains("Hello 1!");
    cy.get(cesc2("#/p1a/n1")).contains("1");
    cy.get(cesc2("#/p1a/m1")).contains("＿");
    cy.get(cesc2("#/p2a")).contains("Hello 2!");
    cy.get(cesc2("#/p2a/n1")).contains("2");
    cy.get(cesc2("#/p2a/m1")).contains("＿");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p3a/n1")).should("not.exist");
    cy.get(cesc2("#/p3a/m1")).should("not.exist");

    cy.get(cesc2("#/p1b")).contains("Hello 1!");
    cy.get(cesc2("#/p1b/n1")).contains("1");
    cy.get(cesc2("#/p1b/m1")).contains("＿");
    cy.get(cesc2("#/p2b")).contains("Hello 2!");
    cy.get(cesc2("#/p2b/n1")).contains("2");
    cy.get(cesc2("#/p2b/m1")).contains("＿");
    cy.get(cesc2("#/p3b")).should("not.exist");
    cy.get(cesc2("#/p3b/n1")).should("not.exist");
    cy.get(cesc2("#/p3b/m1")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(2);
      expect(stateVariables["/n3"].stateValues.value).eq(2);

      expect(stateVariables["/p1/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/n1"]).eq(undefined);
      expect(stateVariables["/p1a/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/n1"]).eq(undefined);
      expect(stateVariables["/p1b/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/n1"]).eq(undefined);

      expect(stateVariables["/p1/m1"].stateValues.value).eq("＿");
      expect(stateVariables["/p2/m1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3/m1"]).eq(undefined);
      expect(stateVariables["/p1a/m1"].stateValues.value).eq("＿");
      expect(stateVariables["/p2a/m1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3a/m1"]).eq(undefined);
      expect(stateVariables["/p1b/m1"].stateValues.value).eq("＿");
      expect(stateVariables["/p2b/m1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3b/m1"]).eq(undefined);
    });

    cy.log("type x in first mathinput");
    cy.get(cesc2("#/p1/x") + " textarea").type("x{enter}", { force: true });

    cy.get(cesc2("#/p1")).contains("Hello 1!");
    cy.get(cesc2("#/p1/n1")).contains("1");
    cy.get(cesc2("#/p1/m1")).contains("x");
    cy.get(cesc2("#/p2")).contains("Hello 2!");
    cy.get(cesc2("#/p2/n1")).contains("2");
    cy.get(cesc2("#/p2/m1")).contains("＿");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p3/n1")).should("not.exist");
    cy.get(cesc2("#/p3/m1")).should("not.exist");

    cy.get(cesc2("#/p1a")).contains("Hello 1!");
    cy.get(cesc2("#/p1a/n1")).contains("1");
    cy.get(cesc2("#/p1a/m1")).contains("x");
    cy.get(cesc2("#/p2a")).contains("Hello 2!");
    cy.get(cesc2("#/p2a/n1")).contains("2");
    cy.get(cesc2("#/p2a/m1")).contains("＿");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p3a/n1")).should("not.exist");
    cy.get(cesc2("#/p3a/m1")).should("not.exist");

    cy.get(cesc2("#/p1b")).contains("Hello 1!");
    cy.get(cesc2("#/p1b/n1")).contains("1");
    cy.get(cesc2("#/p1b/m1")).contains("x");
    cy.get(cesc2("#/p2b")).contains("Hello 2!");
    cy.get(cesc2("#/p2b/n1")).contains("2");
    cy.get(cesc2("#/p2b/m1")).contains("＿");
    cy.get(cesc2("#/p3b")).should("not.exist");
    cy.get(cesc2("#/p3b/n1")).should("not.exist");
    cy.get(cesc2("#/p3b/m1")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(2);
      expect(stateVariables["/n3"].stateValues.value).eq(2);

      expect(stateVariables["/p1/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/n1"]).eq(undefined);
      expect(stateVariables["/p1a/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/n1"]).eq(undefined);
      expect(stateVariables["/p1b/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/n1"]).eq(undefined);

      expect(stateVariables["/p1/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2/m1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3/m1"]).eq(undefined);
      expect(stateVariables["/p1a/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2a/m1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3a/m1"]).eq(undefined);
      expect(stateVariables["/p1b/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2b/m1"].stateValues.value).eq("＿");
      expect(stateVariables["/p3b/m1"]).eq(undefined);
    });

    cy.log("type y in second mathinput");
    cy.get(cesc2("#/p2b/x") + " textarea").type("y{enter}", { force: true });

    cy.get(cesc2("#/p1")).contains("Hello 1!");
    cy.get(cesc2("#/p1/n1")).contains("1");
    cy.get(cesc2("#/p1/m1")).contains("x");
    cy.get(cesc2("#/p2")).contains("Hello 2!");
    cy.get(cesc2("#/p2/n1")).contains("2");
    cy.get(cesc2("#/p2/m1")).contains("y");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p3/n1")).should("not.exist");
    cy.get(cesc2("#/p3/m1")).should("not.exist");

    cy.get(cesc2("#/p1a")).contains("Hello 1!");
    cy.get(cesc2("#/p1a/n1")).contains("1");
    cy.get(cesc2("#/p1a/m1")).contains("x");
    cy.get(cesc2("#/p2a")).contains("Hello 2!");
    cy.get(cesc2("#/p2a/n1")).contains("2");
    cy.get(cesc2("#/p2a/m1")).contains("y");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p3a/n1")).should("not.exist");
    cy.get(cesc2("#/p3a/m1")).should("not.exist");

    cy.get(cesc2("#/p1b")).contains("Hello 1!");
    cy.get(cesc2("#/p1b/n1")).contains("1");
    cy.get(cesc2("#/p1b/m1")).contains("x");
    cy.get(cesc2("#/p2b")).contains("Hello 2!");
    cy.get(cesc2("#/p2b/n1")).contains("2");
    cy.get(cesc2("#/p2b/m1")).contains("y");
    cy.get(cesc2("#/p3b")).should("not.exist");
    cy.get(cesc2("#/p3b/n1")).should("not.exist");
    cy.get(cesc2("#/p3b/m1")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(2);
      expect(stateVariables["/n3"].stateValues.value).eq(2);

      expect(stateVariables["/p1/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/n1"]).eq(undefined);
      expect(stateVariables["/p1a/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/n1"]).eq(undefined);
      expect(stateVariables["/p1b/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/n1"]).eq(undefined);

      expect(stateVariables["/p1/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2/m1"].stateValues.value).eq("y");
      expect(stateVariables["/p3/m1"]).eq(undefined);
      expect(stateVariables["/p1a/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2a/m1"].stateValues.value).eq("y");
      expect(stateVariables["/p3a/m1"]).eq(undefined);
      expect(stateVariables["/p1b/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2b/m1"].stateValues.value).eq("y");
      expect(stateVariables["/p3b/m1"]).eq(undefined);
    });

    cy.log("increase n");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc2("#/n2")).contains("3");
    cy.get(cesc2("#/n3")).contains("3");

    cy.get(cesc2("#/p1")).contains("Hello 1!");
    cy.get(cesc2("#/p1/n1")).contains("1");
    cy.get(cesc2("#/p1/m1")).contains("x");
    cy.get(cesc2("#/p2")).contains("Hello 2!");
    cy.get(cesc2("#/p2/n1")).contains("2");
    cy.get(cesc2("#/p2/m1")).contains("y");
    cy.get(cesc2("#/p3")).contains("Hello 3!");
    cy.get(cesc2("#/p3/n1")).contains("3");
    cy.get(cesc2("#/p3/m1")).contains("＿");

    cy.get(cesc2("#/p1a")).contains("Hello 1!");
    cy.get(cesc2("#/p1a/n1")).contains("1");
    cy.get(cesc2("#/p1a/m1")).contains("x");
    cy.get(cesc2("#/p2a")).contains("Hello 2!");
    cy.get(cesc2("#/p2a/n1")).contains("2");
    cy.get(cesc2("#/p2a/m1")).contains("y");
    cy.get(cesc2("#/p3a")).contains("Hello 3!");
    cy.get(cesc2("#/p3a/n1")).contains("3");
    cy.get(cesc2("#/p3a/m1")).contains("＿");

    cy.get(cesc2("#/p1b")).contains("Hello 1!");
    cy.get(cesc2("#/p1b/n1")).contains("1");
    cy.get(cesc2("#/p1b/m1")).contains("x");
    cy.get(cesc2("#/p2b")).contains("Hello 2!");
    cy.get(cesc2("#/p2b/n1")).contains("2");
    cy.get(cesc2("#/p2b/m1")).contains("y");
    cy.get(cesc2("#/p3b")).contains("Hello 3!");
    cy.get(cesc2("#/p3b/n1")).contains("3");
    cy.get(cesc2("#/p3b/m1")).contains("＿");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(3);
      expect(stateVariables["/n3"].stateValues.value).eq(3);

      expect(stateVariables["/p1/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/n1"].stateValues.value).eq(3);
      expect(stateVariables["/p1a/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/n1"].stateValues.value).eq(3);
      expect(stateVariables["/p1b/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/n1"].stateValues.value).eq(3);

      expect(stateVariables["/p1/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2/m1"].stateValues.value).eq("y");
      expect(stateVariables["/p3/m1"].stateValues.value).eq("＿");
      expect(stateVariables["/p1a/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2a/m1"].stateValues.value).eq("y");
      expect(stateVariables["/p3a/m1"].stateValues.value).eq("＿");
      expect(stateVariables["/p1b/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2b/m1"].stateValues.value).eq("y");
      expect(stateVariables["/p3b/m1"].stateValues.value).eq("＿");
    });

    cy.log("type z in third mathinput");
    cy.get(cesc2("#/p3a/x") + " textarea").type("z{enter}", { force: true });

    cy.get(cesc2("#/p1")).contains("Hello 1!");
    cy.get(cesc2("#/p1/n1")).contains("1");
    cy.get(cesc2("#/p1/m1")).contains("x");
    cy.get(cesc2("#/p2")).contains("Hello 2!");
    cy.get(cesc2("#/p2/n1")).contains("2");
    cy.get(cesc2("#/p2/m1")).contains("y");
    cy.get(cesc2("#/p3")).contains("Hello 3!");
    cy.get(cesc2("#/p3/n1")).contains("3");
    cy.get(cesc2("#/p3/m1")).contains("z");

    cy.get(cesc2("#/p1a")).contains("Hello 1!");
    cy.get(cesc2("#/p1a/n1")).contains("1");
    cy.get(cesc2("#/p1a/m1")).contains("x");
    cy.get(cesc2("#/p2a")).contains("Hello 2!");
    cy.get(cesc2("#/p2a/n1")).contains("2");
    cy.get(cesc2("#/p2a/m1")).contains("y");
    cy.get(cesc2("#/p3a")).contains("Hello 3!");
    cy.get(cesc2("#/p3a/n1")).contains("3");
    cy.get(cesc2("#/p3a/m1")).contains("z");

    cy.get(cesc2("#/p1b")).contains("Hello 1!");
    cy.get(cesc2("#/p1b/n1")).contains("1");
    cy.get(cesc2("#/p1b/m1")).contains("x");
    cy.get(cesc2("#/p2b")).contains("Hello 2!");
    cy.get(cesc2("#/p2b/n1")).contains("2");
    cy.get(cesc2("#/p2b/m1")).contains("y");
    cy.get(cesc2("#/p3b")).contains("Hello 3!");
    cy.get(cesc2("#/p3b/n1")).contains("3");
    cy.get(cesc2("#/p3b/m1")).contains("z");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(3);
      expect(stateVariables["/n3"].stateValues.value).eq(3);

      expect(stateVariables["/p1/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/n1"].stateValues.value).eq(3);
      expect(stateVariables["/p1a/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/n1"].stateValues.value).eq(3);
      expect(stateVariables["/p1b/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/n1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/n1"].stateValues.value).eq(3);

      expect(stateVariables["/p1/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2/m1"].stateValues.value).eq("y");
      expect(stateVariables["/p3/m1"].stateValues.value).eq("z");
      expect(stateVariables["/p1a/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2a/m1"].stateValues.value).eq("y");
      expect(stateVariables["/p3a/m1"].stateValues.value).eq("z");
      expect(stateVariables["/p1b/m1"].stateValues.value).eq("x");
      expect(stateVariables["/p2b/m1"].stateValues.value).eq("y");
      expect(stateVariables["/p3b/m1"].stateValues.value).eq("z");
    });
  });

  it("copySource and createComponentOfType wrap to match specified type", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <mathinput name="mi" prefill="2" />
        
    <math name="m1" copySource="mi" />
    $mi{name="m2" createComponentOfType="MatH"}

    <number name="n1" copySource="mi" />
    $mi{name="n2" createComponentOfType="number"}

    <point name="P">(x,y)</point>

    <coords name="c1" copySource="P" />
    $P{name="c2" createComponentOfType="coords"}
    <coords name="c3" copySource="P.coords" />
    $P.coords{assignNames="c4" createComponentOfType="coords"}

    <math name="mc1" copySource="P" />
    $P{name="mc2" createComponentOfType="math"}
    <math name="mc3" copySource="P.coords" />
    $P.coords{assignNames="mc4" createComponentOfType="math"}

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/m1") + " .mjx-mrow")
      .eq(0)
      .contains("2");
    cy.get(cesc2("#/m2") + " .mjx-mrow")
      .eq(0)
      .contains("2");

    cy.get(cesc2("#/n1")).contains("2");
    cy.get(cesc2("#/n2")).contains("2");

    cy.get(cesc2("#/c1") + " .mjx-mrow")
      .eq(0)
      .contains("(x,y)");
    cy.get(cesc2("#/c2") + " .mjx-mrow")
      .eq(0)
      .contains("(x,y)");
    cy.get(cesc2("#/c3") + " .mjx-mrow")
      .eq(0)
      .contains("(x,y)");
    cy.get(cesc2("#/c4") + " .mjx-mrow")
      .eq(0)
      .contains("(x,y)");

    cy.get(cesc2("#/mc1") + " .mjx-mrow")
      .eq(0)
      .contains("(x,y)");
    cy.get(cesc2("#/mc2") + " .mjx-mrow")
      .eq(0)
      .contains("(x,y)");
    cy.get(cesc2("#/mc3") + " .mjx-mrow")
      .eq(0)
      .contains("(x,y)");
    cy.get(cesc2("#/mc4") + " .mjx-mrow")
      .eq(0)
      .contains("(x,y)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eq(2);
      expect(stateVariables["/m2"].stateValues.value).eq(2);

      expect(stateVariables["/n1"].stateValues.value).eq(2);
      expect(stateVariables["/n2"].stateValues.value).eq(2);

      expect(stateVariables["/c1"].stateValues.value).eqls([
        "vector",
        "x",
        "y",
      ]);
      expect(stateVariables["/c2"].stateValues.value).eqls([
        "vector",
        "x",
        "y",
      ]);
      expect(stateVariables["/c3"].stateValues.value).eqls([
        "vector",
        "x",
        "y",
      ]);
      expect(stateVariables["/c4"].stateValues.value).eqls([
        "vector",
        "x",
        "y",
      ]);

      expect(stateVariables["/mc1"].stateValues.value).eqls([
        "vector",
        "x",
        "y",
      ]);
      expect(stateVariables["/mc2"].stateValues.value).eqls([
        "vector",
        "x",
        "y",
      ]);
      expect(stateVariables["/mc3"].stateValues.value).eqls([
        "vector",
        "x",
        "y",
      ]);
      expect(stateVariables["/mc4"].stateValues.value).eqls([
        "vector",
        "x",
        "y",
      ]);
    });

    cy.log("enter a");
    cy.get(cesc2("#/mi") + " textarea").type("{end}{backspace}a{enter}", {
      force: true,
    });

    cy.get(cesc2("#/m1") + " .mjx-mrow").should("contain.text", "a");

    cy.get(cesc2("#/m1") + " .mjx-mrow")
      .eq(0)
      .contains("a");
    cy.get(cesc2("#/m2") + " .mjx-mrow")
      .eq(0)
      .contains("a");

    cy.get(cesc2("#/n1")).contains("NaN");
    cy.get(cesc2("#/n2")).contains("NaN");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eq("a");
      expect(stateVariables["/m2"].stateValues.value).eq("a");

      expect(stateVariables["/n1"].stateValues.value).eqls(NaN);
      expect(stateVariables["/n2"].stateValues.value).eqls(NaN);
    });
  });

  it("add children to invalid copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g" copySource="invalid">
      <point name="P" />
    </graph>

    <graph name="g2" copySource="invalid" newNamespace>
      <point name="P" />
    </graph>

    <math name="Pcoords" copySource="P" />
    <math name="g2Pcoords" copySource="g2/P" />

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/Pcoords") + " .mjx-mrow")
      .eq(0)
      .contains("(0,0)");
    cy.get(cesc2("#/g2Pcoords") + " .mjx-mrow")
      .eq(0)
      .contains("(0,0)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g"].activeChildren.length).eq(1);
      expect(stateVariables["/g"].activeChildren[0].componentName).eq("/P");
      expect(stateVariables["/P"].stateValues.xs).eqls([0, 0]);

      expect(stateVariables["/g2"].activeChildren.length).eq(1);
      expect(stateVariables["/g2"].activeChildren[0].componentName).eq("/g2/P");
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([0, 0]);

      expect(stateVariables["/Pcoords"].stateValues.value).eqls([
        "vector",
        0,
        0,
      ]);
      expect(stateVariables["/g2Pcoords"].stateValues.value).eqls([
        "vector",
        0,
        0,
      ]);
    });

    cy.log(`move points`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/P",
        args: { x: 7, y: 6 },
      });
    });

    cy.get(cesc2("#/g2Pcoords") + " .mjx-mrow").should("contain.text", "(7,6)");
    cy.get(cesc2("#/Pcoords") + " .mjx-mrow").should("contain.text", "(3,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([3, 5]);

      expect(stateVariables["/g2/P"].stateValues.xs).eqls([7, 6]);

      expect(stateVariables["/Pcoords"].stateValues.value).eqls([
        "vector",
        3,
        5,
      ]);
      expect(stateVariables["/g2Pcoords"].stateValues.value).eqls([
        "vector",
        7,
        6,
      ]);
    });
  });

  it("add children with copySource, different newNamespace combinations", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g1">
      <point name="P1">(1,2)</point>
    </graph>

    <graph name="g1a" copySource="g1">
      <vector name="v1">(4,5)</vector>
    </graph>

    <math name="P1coords" copySource="P1" />
    <math name="v1displacement" copySource="v1" />

    <graph name="g2">
      <point name="P2">(1,2)</point>
    </graph>

    <graph name="g2a" copySource="g2" newNamespace>
      <vector name="v2">(4,5)</vector>
    </graph>

    <math name="P2coords" copySource="P2" />
    <math name="P2acoords" copySource="g2a/P2" />
    <math name="v2displacement" copySource="g2a/v2" />

    <graph name="g3" newNamespace>
      <point name="P3">(1,2)</point>
    </graph>

    <graph name="g3a" copySource="g3" newNamespace>
      <vector name="v3">(4,5)</vector>
    </graph>

    <math name="P3coords" copySource="g3/P3" />
    <math name="P3acoords" copySource="g3a/P3" />
    <math name="v3displacement" copySource="g3a/v3" />

    <graph name="g4" newNamespace>
      <point name="P4">(1,2)</point>
    </graph>

    <graph name="g4a" copySource="g4">
      <vector name="v4">(4,5)</vector>
    </graph>

    <math name="P4coords" copySource="g4/P4" />
    <math name="P4acoords" copySource="g4a/P4" />
    <math name="v4displacement" copySource="v4" />



    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/v1displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(4,5)");

    cy.get(cesc2("#/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/P2acoords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(4,5)");

    cy.get(cesc2("#/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/P3acoords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(4,5)");

    cy.get(cesc2("#/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/P4acoords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/v4displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(4,5)");

    let P1aName;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1"].activeChildren.length).eq(1);
      expect(stateVariables["/g1"].activeChildren[0].componentName).eq("/P1");
      expect(stateVariables["/P1"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g1a"].activeChildren.length).eq(2);
      expect(stateVariables["/g1a"].activeChildren[1].componentName).eq("/v1");
      P1aName = stateVariables["/g1a"].activeChildren[0].componentName;
      expect(stateVariables[P1aName].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/v1"].stateValues.displacement).eqls([4, 5]);
      expect(stateVariables["/P1coords"].stateValues.value).eqls([
        "vector",
        1,
        2,
      ]);
      expect(stateVariables["/v1displacement"].stateValues.value).eqls([
        "vector",
        4,
        5,
      ]);

      expect(stateVariables["/g2"].activeChildren.length).eq(1);
      expect(stateVariables["/g2"].activeChildren[0].componentName).eq("/P2");
      expect(stateVariables["/P2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g2a"].activeChildren.length).eq(2);
      expect(stateVariables["/g2a"].activeChildren[0].componentName).eq(
        "/g2a/P2",
      );
      expect(stateVariables["/g2a"].activeChildren[1].componentName).eq(
        "/g2a/v2",
      );
      expect(stateVariables["/g2a/P2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g2a/v2"].stateValues.displacement).eqls([4, 5]);
      expect(stateVariables["/P2coords"].stateValues.value).eqls([
        "vector",
        1,
        2,
      ]);
      expect(stateVariables["/P2acoords"].stateValues.value).eqls([
        "vector",
        1,
        2,
      ]);
      expect(stateVariables["/v2displacement"].stateValues.value).eqls([
        "vector",
        4,
        5,
      ]);

      expect(stateVariables["/g3"].activeChildren.length).eq(1);
      expect(stateVariables["/g3"].activeChildren[0].componentName).eq(
        "/g3/P3",
      );
      expect(stateVariables["/g3/P3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g3a"].activeChildren.length).eq(2);
      expect(stateVariables["/g3a"].activeChildren[0].componentName).eq(
        "/g3a/P3",
      );
      expect(stateVariables["/g3a"].activeChildren[1].componentName).eq(
        "/g3a/v3",
      );
      expect(stateVariables["/g3a/P3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g3a/v3"].stateValues.displacement).eqls([4, 5]);
      expect(stateVariables["/P3coords"].stateValues.value).eqls([
        "vector",
        1,
        2,
      ]);
      expect(stateVariables["/P3acoords"].stateValues.value).eqls([
        "vector",
        1,
        2,
      ]);
      expect(stateVariables["/v3displacement"].stateValues.value).eqls([
        "vector",
        4,
        5,
      ]);

      expect(stateVariables["/g4"].activeChildren.length).eq(1);
      expect(stateVariables["/g4"].activeChildren[0].componentName).eq(
        "/g4/P4",
      );
      expect(stateVariables["/g4/P4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g4a"].activeChildren.length).eq(2);
      expect(stateVariables["/g4a"].activeChildren[0].componentName).eq(
        "/g4a/P4",
      );
      expect(stateVariables["/g4a"].activeChildren[1].componentName).eq("/v4");
      expect(stateVariables["/g4a/P4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/v4"].stateValues.displacement).eqls([4, 5]);
      expect(stateVariables["/P4coords"].stateValues.value).eqls([
        "vector",
        1,
        2,
      ]);
      expect(stateVariables["/P4acoords"].stateValues.value).eqls([
        "vector",
        1,
        2,
      ]);
      expect(stateVariables["/v4displacement"].stateValues.value).eqls([
        "vector",
        4,
        5,
      ]);
    });

    cy.log(`move points`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P1",
        args: { x: 3, y: 5 },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v1",
        args: {
          headcoords: [8, 7],
        },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P2",
        args: { x: 6, y: 0 },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/g2a/v2",
        args: {
          headcoords: [9, 1],
        },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/P3",
        args: { x: 5, y: 8 },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/g3a/v3",
        args: {
          headcoords: [8, 6],
        },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/P4",
        args: { x: 0, y: 3 },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v4",
        args: {
          headcoords: [7, 2],
        },
      });
    });

    cy.get(cesc2("#/v4displacement") + " .mjx-mrow").should(
      "contain.text",
      "(7,2)",
    );

    cy.get(cesc2("#/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(3,5)");
    cy.get(cesc2("#/v1displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(8,7)");

    cy.get(cesc2("#/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(6,0)");
    cy.get(cesc2("#/P2acoords") + " .mjx-mrow")
      .eq(0)
      .contains("(6,0)");
    cy.get(cesc2("#/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(9,1)");

    cy.get(cesc2("#/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(5,8)");
    cy.get(cesc2("#/P3acoords") + " .mjx-mrow")
      .eq(0)
      .contains("(5,8)");
    cy.get(cesc2("#/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(8,6)");

    cy.get(cesc2("#/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(0,3)");
    cy.get(cesc2("#/P4acoords") + " .mjx-mrow")
      .eq(0)
      .contains("(0,3)");
    cy.get(cesc2("#/v4displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(7,2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.xs).eqls([3, 5]);
      expect(stateVariables[P1aName].stateValues.xs).eqls([3, 5]);
      expect(stateVariables["/v1"].stateValues.displacement).eqls([8, 7]);
      expect(stateVariables["/P1coords"].stateValues.value).eqls([
        "vector",
        3,
        5,
      ]);
      expect(stateVariables["/v1displacement"].stateValues.value).eqls([
        "vector",
        8,
        7,
      ]);

      expect(stateVariables["/P2"].stateValues.xs).eqls([6, 0]);
      expect(stateVariables["/g2a/P2"].stateValues.xs).eqls([6, 0]);
      expect(stateVariables["/g2a/v2"].stateValues.displacement).eqls([9, 1]);
      expect(stateVariables["/P2coords"].stateValues.value).eqls([
        "vector",
        6,
        0,
      ]);
      expect(stateVariables["/P2acoords"].stateValues.value).eqls([
        "vector",
        6,
        0,
      ]);
      expect(stateVariables["/v2displacement"].stateValues.value).eqls([
        "vector",
        9,
        1,
      ]);

      expect(stateVariables["/g3/P3"].stateValues.xs).eqls([5, 8]);
      expect(stateVariables["/g3a/P3"].stateValues.xs).eqls([5, 8]);
      expect(stateVariables["/g3a/v3"].stateValues.displacement).eqls([8, 6]);
      expect(stateVariables["/P3coords"].stateValues.value).eqls([
        "vector",
        5,
        8,
      ]);
      expect(stateVariables["/P3acoords"].stateValues.value).eqls([
        "vector",
        5,
        8,
      ]);
      expect(stateVariables["/v3displacement"].stateValues.value).eqls([
        "vector",
        8,
        6,
      ]);

      expect(stateVariables["/g4/P4"].stateValues.xs).eqls([0, 3]);
      expect(stateVariables["/g4a/P4"].stateValues.xs).eqls([0, 3]);
      expect(stateVariables["/v4"].stateValues.displacement).eqls([7, 2]);
      expect(stateVariables["/P4coords"].stateValues.value).eqls([
        "vector",
        0,
        3,
      ]);
      expect(stateVariables["/P4acoords"].stateValues.value).eqls([
        "vector",
        0,
        3,
      ]);
      expect(stateVariables["/v4displacement"].stateValues.value).eqls([
        "vector",
        7,
        2,
      ]);
    });

    cy.log(`move shadowed points`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: P1aName,
        args: { x: 2, y: 1 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2a/P2",
        args: { x: 5, y: 4 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3a/P3",
        args: { x: 9, y: 7 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4a/P4",
        args: { x: 7, y: 6 },
      });
    });

    cy.get(cesc2("#/P4coords") + " .mjx-mrow").should("contain.text", "(7,6)");

    cy.get(cesc2("#/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(2,1)");
    cy.get(cesc2("#/v1displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(8,7)");

    cy.get(cesc2("#/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(5,4)");
    cy.get(cesc2("#/P2acoords") + " .mjx-mrow")
      .eq(0)
      .contains("(5,4)");
    cy.get(cesc2("#/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(9,1)");

    cy.get(cesc2("#/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(9,7)");
    cy.get(cesc2("#/P3acoords") + " .mjx-mrow")
      .eq(0)
      .contains("(9,7)");
    cy.get(cesc2("#/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(8,6)");

    cy.get(cesc2("#/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(7,6)");
    cy.get(cesc2("#/P4acoords") + " .mjx-mrow")
      .eq(0)
      .contains("(7,6)");
    cy.get(cesc2("#/v4displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(7,2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.xs).eqls([2, 1]);
      expect(stateVariables[P1aName].stateValues.xs).eqls([2, 1]);
      expect(stateVariables["/v1"].stateValues.displacement).eqls([8, 7]);
      expect(stateVariables["/P1coords"].stateValues.value).eqls([
        "vector",
        2,
        1,
      ]);
      expect(stateVariables["/v1displacement"].stateValues.value).eqls([
        "vector",
        8,
        7,
      ]);

      expect(stateVariables["/P2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/g2a/P2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/g2a/v2"].stateValues.displacement).eqls([9, 1]);
      expect(stateVariables["/P2coords"].stateValues.value).eqls([
        "vector",
        5,
        4,
      ]);
      expect(stateVariables["/P2acoords"].stateValues.value).eqls([
        "vector",
        5,
        4,
      ]);
      expect(stateVariables["/v2displacement"].stateValues.value).eqls([
        "vector",
        9,
        1,
      ]);

      expect(stateVariables["/g3/P3"].stateValues.xs).eqls([9, 7]);
      expect(stateVariables["/g3a/P3"].stateValues.xs).eqls([9, 7]);
      expect(stateVariables["/g3a/v3"].stateValues.displacement).eqls([8, 6]);
      expect(stateVariables["/P3coords"].stateValues.value).eqls([
        "vector",
        9,
        7,
      ]);
      expect(stateVariables["/P3acoords"].stateValues.value).eqls([
        "vector",
        9,
        7,
      ]);
      expect(stateVariables["/v3displacement"].stateValues.value).eqls([
        "vector",
        8,
        6,
      ]);

      expect(stateVariables["/g4/P4"].stateValues.xs).eqls([7, 6]);
      expect(stateVariables["/g4a/P4"].stateValues.xs).eqls([7, 6]);
      expect(stateVariables["/v4"].stateValues.displacement).eqls([7, 2]);
      expect(stateVariables["/P4coords"].stateValues.value).eqls([
        "vector",
        7,
        6,
      ]);
      expect(stateVariables["/P4acoords"].stateValues.value).eqls([
        "vector",
        7,
        6,
      ]);
      expect(stateVariables["/v4displacement"].stateValues.value).eqls([
        "vector",
        7,
        2,
      ]);
    });
  });

  it("add children with copySource, ignore implicit newNamespace when copied", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <group name="grp">
      <graph name="g" size="small" newNamespace>
        <point name="P">(1,2)</point>
      </graph>
    
      <graph name="g2" copySource="g">
        <vector name="v" />
      </graph>
    
      <graph name="g3" copySource="g2" newNamespace />

      <graph name="g4" copySource="g2" />
    
    </group>
    
    <group copySource="grp" name="grp2" newNamespace />
  
    <p>Point 1: <math copySource="g/P" name="P1coords" /></p>
    <p>Point 2: <math copySource="g2/P" name="P2coords" /></p>
    <p>Vector 2: <math copySource="v" name="v2displacement" /></p>
    <p>Point 3: <math copySource="g3/P" name="P3coords" /></p>
    <p>Vector 3: <math copySource="g3/v" name="v3displacement" /></p>
    <p>Point 4: <math copySource="g4/P" name="P4coords" /></p>
    <p>Nothing at g4/v: <math copySource="g4/v" name="v4nodisplacement" /></p>

    <group name="grp2ps" newNamespace>
      <p>Grp2 Point 1: <math copySource="/grp2/g/P" name="P1coords" /></p>
      <p>Grp2 Point 2: <math copySource="/grp2/g2/P" name="P2coords" /></p>

      <p>Grp2 Vector 2: <math copySource="/grp2/v" name="v2displacement" /></p>
      <p>Nothing at /grp2/g2/v: <math copySource="/grp2/g2/v" name="v2nodisplacement" /></p>

      <p>Grp2 Point 3: <math copySource="/grp2/g3/P" name="P3coords" /></p>
      <p>Grp2 Vector 3: <math copySource="/grp2/g3/v" name="v3displacement" /></p>
 
      <p>Grp2 Point 4: <math copySource="/grp2/g4/P" name="P4coords" /></p>
      <p>Nothing at /grp2/g4/v: <math copySource="/grp2/g4/v" name="v4nodisplacement" /></p>
    </group>


    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(1,0)");
    cy.get(cesc2("#/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(1,0)");
    cy.get(cesc2("#/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/v4nodisplacement") + " .mjx-mrow")
      .eq(0)
      .contains("\uff3f");

    cy.get(cesc2("#/grp2ps/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/grp2ps/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/grp2ps/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(1,0)");
    cy.get(cesc2("#/grp2ps/v2nodisplacement") + " .mjx-mrow")
      .eq(0)
      .contains("\uff3f");
    cy.get(cesc2("#/grp2ps/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/grp2ps/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(1,0)");
    cy.get(cesc2("#/grp2ps/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(1,2)");
    cy.get(cesc2("#/grp2ps/v4nodisplacement") + " .mjx-mrow")
      .eq(0)
      .contains("\uff3f");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/v"].stateValues.displacement).eqls([1, 0]);
      expect(stateVariables["/g3/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g3/v"].stateValues.displacement).eqls([1, 0]);
      expect(stateVariables["/g4/P"].stateValues.xs).eqls([1, 2]);
      let g4vName = stateVariables["/g4"].activeChildren[1].componentName;
      expect(g4vName.substring(0, 3) === "/__");
      expect(stateVariables[g4vName].stateValues.displacement).eqls([1, 0]);
      expect(stateVariables["/g4/v"]).eq(undefined);

      expect(stateVariables["/grp2/g/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/grp2/g2/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/grp2/v"].stateValues.displacement).eqls([1, 0]);
      expect(stateVariables["/grp2/g2/v"]).eq(undefined);
      expect(stateVariables["/grp2/g3/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/grp2/g3/v"].stateValues.displacement).eqls([
        1, 0,
      ]);
      expect(stateVariables["/grp2/g4/P"].stateValues.xs).eqls([1, 2]);
      let grp2g4vName =
        stateVariables["/grp2/g4"].activeChildren[1].componentName;
      expect(grp2g4vName.substring(0, 3) === "/__");
      expect(stateVariables[grp2g4vName].stateValues.displacement).eqls([1, 0]);
      expect(stateVariables["/grp2/g4/v"]).eq(undefined);
    });
  });

  it("add children with copySource, multiple levels of groups", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name="grp0" >
      <group name="grp1">
    
        <graph name="g" newNamespace>
          <point name="P">(1,2)</point>
        </graph>
      
        <graph name="g2" copySource="g">
          <vector name="v">(4,5)</vector>
        </graph>
      
        <graph name="g3" copySource="g2" newNamespace>
          <circle name="c" center="$(../g/P)" />
          <lineSegment name="l" endpoints="$P $(../v.head)" />
        </graph>
      
        $g{name="g4"}
        
        <graph copySource="g4" name="g5" newNamespace>
          <circle name="c" />
        </graph>
        
      </group>
      
      
      <group copySource="grp1" name="grp2" newNamespace>
      
        <graph copySource="../g5" name="g6">
          <lineSegment name="l" endpoints="$(g6/c.center) $(../g4/P)" />
        </graph>
      
      </group>
    
    </group>
    
    
    <group copySource="grp0" name="grp3" newNamespace>
    
      <graph copySource="../grp2/g6" name="g7" newNamespace>
        <vector name="v" tail="$l.endpoint1" head="$(../v.head)" />
      </graph>
    
    </group>
    
    <p>Point 1: <math copySource="g/P" name="P1coords" /></p>
    <p>Point 2: <math copySource="g2/P" name="P2coords" /></p>
    <p>Vector 2: <math copySource="v" name="v2displacement" /></p>
    <p>Point 3: <math copySource="g3/P" name="P3coords" /></p>
    <p>Vector 3: <math copySource="g3/v" name="v3displacement" /></p>
    <p>Circle 3 center: <math copySource="g3/c.center" name="c3center" /></p>
    <p>Line segment 3 point 1: <math copySource="g3/l.endpoint1" name="l3point1" /></p>
    <p>Line segment 3 point 2: <math copySource="g3/l.endpoint2" name="l3point2" /></p>
    <p>Point 4: <math copySource="g4/P" name="P4coords" /></p>
    <p>Point 5: <math copySource="g5/P" name="P5coords" /></p>
    <p>Circle 5 center: <math copySource="g5/c.center" name="c5center" /></p>
    
    <group name="grp2ps" newNamespace>
      <p>Grp2 Point 1: <math copySource="/grp2/g/P" name="P1coords" /></p>
      <p>Grp2 Point 2: <math copySource="/grp2/g2/P" name="P2coords" /></p>
      <p>Grp2 Vector 2: <math copySource="/grp2/v" name="v2displacement" /></p>
      <p>Grp2 Point 3: <math copySource="/grp2/g3/P" name="P3coords" /></p>
      <p>Grp2 Vector 3: <math copySource="/grp2/g3/v" name="v3displacement" /></p>
      <p>Grp2 Circle 3 center: <math copySource="/grp2/g3/c.center" name="c3center" /></p>
      <p>Grp2 Line segment 3 point 1: <math copySource="/grp2/g3/l.endpoint1" name="l3point1" /></p>
      <p>Grp2 Line segment 3 point 2: <math copySource="/grp2/g3/l.endpoint2" name="l3point2" /></p>
      <p>Grp2 Point 4: <math copySource="/grp2/g4/P" name="P4coords" /></p>
      <p>Grp2 Point 5: <math copySource="/grp2/g5/P" name="P5coords" /></p>
      <p>Grp2 Circle 5 center: <math copySource="/grp2/g5/c.center" name="c5center" /></p>
      <p>Grp2 Point 6: <math copySource="/grp2/g6/P" name="P6coords" /></p>
      <p>Grp2 Circle 6 center: <math copySource="/grp2/g6/c.center" name="c6center" /></p>
      <p>Grp2 Line segment 6 point 1: <math copySource="/grp2/l.endpoint1" name="l6point1" /></p>
      <p>Grp2 Line segment 6 point 2: <math copySource="/grp2/l.endpoint2" name="l6point2" /></p>
    </group>

    
    <group name="grp3ps" newNamespace>

      <p>Grp3 Point 1: <math copySource="/grp3/g/P" name="P1coords" /></p>
      <p>Grp3 Point 2: <math copySource="/grp3/g2/P" name="P2coords" /></p>
      <p>Grp3 Vector 2: <math copySource="/grp3/v" name="v2displacement" /></p>
      <p>Grp3 Point 3: <math copySource="/grp3/g3/P" name="P3coords" /></p>
      <p>Grp3 Vector 3: <math copySource="/grp3/g3/v" name="v3displacement" /></p>
      <p>Grp3 Circle 3 center: <math copySource="/grp3/g3/c.center" name="c3center" /></p>
      <p>Grp3 Line segment 3 point 1: <math copySource="/grp3/g3/l.endpoint1" name="l3point1" /></p>
      <p>Grp3 Line segment 3 point 2: <math copySource="/grp3/g3/l.endpoint2" name="l3point2" /></p>
      <p>Grp3 Point 4: <math copySource="/grp3/g4/P" name="P4coords" /></p>
      <p>Grp3 Point 5: <math copySource="/grp3/g5/P" name="P5coords" /></p>
      <p>Grp3 Circle 5 center: <math copySource="/grp3/g5/c.center" name="c5center" /></p>
      
      <group name="grp2ps" newNamespace>
        <p>Grp3 Grp2 Point 1: <math copySource="/grp3/grp2/g/P" name="P1coords" /></p>
        <p>Grp3 Grp2 Point 2: <math copySource="/grp3/grp2/g2/P" name="P2coords" /></p>
        <p>Grp3 Grp2 Vector 2: <math copySource="/grp3/grp2/v" name="v2displacement" /></p>
        <p>Grp3 Grp2 Point 3: <math copySource="/grp3/grp2/g3/P" name="P3coords" /></p>
        <p>Grp3 Grp2 Vector 3: <math copySource="/grp3/grp2/g3/v" name="v3displacement" /></p>
        <p>Grp3 Grp2 Circle 3 center: <math copySource="/grp3/grp2/g3/c.center" name="c3center" /></p>
        <p>Grp3 Grp2 Line segment 3 point 1: <math copySource="/grp3/grp2/g3/l.endpoint1" name="l3point1" /></p>
        <p>Grp3 Grp2 Line segment 3 point 2: <math copySource="/grp3/grp2/g3/l.endpoint2" name="l3point2" /></p>
        <p>Grp3 Grp2 Point 4: <math copySource="/grp3/grp2/g4/P" name="P4coords" /></p>
        <p>Grp3 Grp2 Point 5: <math copySource="/grp3/grp2/g5/P" name="P5coords" /></p>
        <p>Grp3 Grp2 Circle 5 center: <math copySource="/grp3/grp2/g5/c.center" name="c5center" /></p>
        <p>Grp3 Grp2 Point 6: <math copySource="/grp3/grp2/g6/P" name="P6coords" /></p>
        <p>Grp3 Grp2 Circle 6 center: <math copySource="/grp3/grp2/g6/c.center" name="c6center" /></p>
        <p>Grp3 Grp2 Line segment 6 point 1: <math copySource="/grp3/grp2/l.endpoint1" name="l6point1" /></p>
        <p>Grp3 Grp2 Line segment 6 point 2: <math copySource="/grp3/grp2/l.endpoint2" name="l6point2" /></p>
        <p>Grp3 Point 7: <math copySource="/grp3/g7/P" name="P7coords" /></p>
        <p>Grp3 Circle 7 center: <math copySource="/grp3/g7/c.center" name="c7center" /></p>
        <p>Grp3 Line segment 7 point 1: <math copySource="/grp3/g7/l.endpoint1" name="l7point1" /></p>
        <p>Grp3 Line segment 7 point 2: <math copySource="/grp3/g7/l.endpoint2" name="l7point2" /></p>
        <p>Grp3 Vector 7 head: <math copySource="/grp3/g7/v.head" name="v7head" /></p>
        <p>Grp3 Vector 7 tail: <math copySource="/grp3/g7/v.tail" name="v7tail" /></p>
      </group>

    </group>



    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let P = [1, 2];
    let v = [4, 5];
    let vH = [4, 5];
    let c0 = [0, 0];

    cy.get(cesc2("#/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/c3center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/l3point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/l3point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + vH + ")");
    cy.get(cesc2("#/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/P5coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/c5center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");

    cy.get(cesc2("#/grp2ps/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp2ps/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp2ps/c3center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/l3point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/l3point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + vH + ")");
    cy.get(cesc2("#/grp2ps/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/P5coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/c5center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");
    cy.get(cesc2("#/grp2ps/P6coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/l6point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");
    cy.get(cesc2("#/grp2ps/l6point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");

    cy.get(cesc2("#/grp3ps/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp3ps/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp3ps/c3center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/l3point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/l3point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + vH + ")");
    cy.get(cesc2("#/grp3ps/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/P5coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/c5center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");

    cy.get(cesc2("#/grp3ps/grp2ps/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/c3center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l3point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l3point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + vH + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P5coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/c5center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P6coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l6point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l6point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P7coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l7point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l7point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/v7head") + " .mjx-mrow")
      .eq(0)
      .contains("(" + vH + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/v7tail") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g5/c"].stateValues.center).eqls(c0);

      expect(stateVariables["/grp2/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp2/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp2/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp2/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/grp2/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/grp2/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g5/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp2/g6/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g6/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp2/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp2/l"].stateValues.endpoints[1]).eqls(P);

      expect(stateVariables["/grp3/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp3/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/grp3/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/grp3/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g5/c"].stateValues.center).eqls(c0);

      expect(stateVariables["/grp3/grp2/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/grp2/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g3/v"].stateValues.displacement).eqls(
        v,
      );
      expect(stateVariables["/grp3/grp2/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp3/grp2/g3/l"].stateValues.endpoints[0]).eqls(
        P,
      );
      expect(stateVariables["/grp3/grp2/g3/l"].stateValues.endpoints[1]).eqls(
        vH,
      );
      expect(stateVariables["/grp3/grp2/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g5/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/grp2/g6/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g6/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/grp2/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp3/grp2/l"].stateValues.endpoints[1]).eqls(P);
      expect(stateVariables["/grp3/g7/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g7/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/g7/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp3/g7/l"].stateValues.endpoints[1]).eqls(P);
      expect(stateVariables["/grp3/g7/v"].stateValues.head).eqls(vH);
      expect(stateVariables["/grp3/g7/v"].stateValues.tail).eqls(c0);
    });

    cy.log("move objects");
    cy.window().then(async (win) => {
      P = [3, 5];
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g/P",
        args: { x: P[0], y: P[1] },
      });
      v = [8, 7];
      vH = [5, 1];
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v",
        args: {
          headcoords: vH,
          tailcoords: [vH[0] - v[0], vH[1] - v[1]],
        },
      });
      c0 = [6, 0];
      win.callAction1({
        actionName: "moveCircle",
        componentName: "/g5/c",
        args: { center: c0 },
      });
    });

    cy.get(cesc2("#/grp3ps/grp2ps/v7tail") + " .mjx-mrow").should(
      "contain.text",
      "(" + c0 + ")",
    );

    cy.get(cesc2("#/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/c3center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/l3point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/l3point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + vH + ")");
    cy.get(cesc2("#/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/P5coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/c5center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");

    cy.get(cesc2("#/grp2ps/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp2ps/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp2ps/c3center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/l3point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/l3point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + vH + ")");
    cy.get(cesc2("#/grp2ps/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/P5coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/c5center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");
    cy.get(cesc2("#/grp2ps/P6coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp2ps/l6point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");
    cy.get(cesc2("#/grp2ps/l6point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");

    cy.get(cesc2("#/grp3ps/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp3ps/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp3ps/c3center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/l3point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/l3point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + vH + ")");
    cy.get(cesc2("#/grp3ps/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/P5coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/c5center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");

    cy.get(cesc2("#/grp3ps/grp2ps/P1coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P2coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/v2displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P3coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/v3displacement") + " .mjx-mrow")
      .eq(0)
      .contains("(" + v + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/c3center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l3point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l3point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + vH + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P4coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P5coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/c5center") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P6coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l6point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l6point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/P7coords") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l7point1") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/l7point2") + " .mjx-mrow")
      .eq(0)
      .contains("(" + P + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/v7head") + " .mjx-mrow")
      .eq(0)
      .contains("(" + vH + ")");
    cy.get(cesc2("#/grp3ps/grp2ps/v7tail") + " .mjx-mrow")
      .eq(0)
      .contains("(" + c0 + ")");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g5/c"].stateValues.center).eqls(c0);

      expect(stateVariables["/grp2/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp2/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp2/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp2/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/grp2/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/grp2/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g5/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp2/g6/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g6/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp2/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp2/l"].stateValues.endpoints[1]).eqls(P);

      expect(stateVariables["/grp3/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp3/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/grp3/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/grp3/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g5/c"].stateValues.center).eqls(c0);

      expect(stateVariables["/grp3/grp2/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/grp2/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g3/v"].stateValues.displacement).eqls(
        v,
      );
      expect(stateVariables["/grp3/grp2/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp3/grp2/g3/l"].stateValues.endpoints[0]).eqls(
        P,
      );
      expect(stateVariables["/grp3/grp2/g3/l"].stateValues.endpoints[1]).eqls(
        vH,
      );
      expect(stateVariables["/grp3/grp2/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g5/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/grp2/g6/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g6/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/grp2/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp3/grp2/l"].stateValues.endpoints[1]).eqls(P);
      expect(stateVariables["/grp3/g7/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g7/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/g7/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp3/g7/l"].stateValues.endpoints[1]).eqls(P);
      expect(stateVariables["/grp3/g7/v"].stateValues.head).eqls(vH);
      expect(stateVariables["/grp3/g7/v"].stateValues.tail).eqls(c0);
    });
  });

  it("add children with copySource, recreated replacements include added children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <mathinput name="n" prefill="1" />

    <conditionalContent assignNames="(g1)">
      <case condition="$n>1">
        <graph newNamespace>
          <point name="P">(3,4)</point>
        </graph>
      </case>
      <else>
        <graph newnamespace>
          <point name="P">(5,6)</point>
        </graph>
      </else>
    </conditionalContent>
    
    <graph copySource="g1" name="g2" newNamespace>
      <point name="Q">(7,8)</point>
    </graph>

    <p name="pP">g2/P: $(g2/P)</p>
    <p name="pQ">g2/Q: $(g2/Q)</p>


    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/pP") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc2("#/pQ") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,8)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1"].activeChildren.length).eq(1);
      expect(stateVariables["/g1"].activeChildren[0].componentName).eq("/g1/P");
      expect(stateVariables["/g1/P"].stateValues.xs).eqls([5, 6]);
      expect(stateVariables["/g2"].activeChildren.length).eq(2);
      expect(stateVariables["/g2"].activeChildren[0].componentName).eq("/g2/P");
      expect(stateVariables["/g2"].activeChildren[1].componentName).eq("/g2/Q");
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([5, 6]);
      expect(stateVariables["/g2/Q"].stateValues.xs).eqls([7, 8]);
    });

    cy.log("move points");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/P",
        args: { x: 10, y: 9 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/Q",
        args: { x: 8, y: 4 },
      });
    });

    cy.get(cesc2("#/pQ") + " .mjx-mrow").should("contain.text", "(8,4)");
    cy.get(cesc2("#/pP") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(10,9)");
    cy.get(cesc2("#/pQ") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1"].activeChildren.length).eq(1);
      expect(stateVariables["/g1"].activeChildren[0].componentName).eq("/g1/P");
      expect(stateVariables["/g1/P"].stateValues.xs).eqls([10, 9]);
      expect(stateVariables["/g2"].activeChildren.length).eq(2);
      expect(stateVariables["/g2"].activeChildren[0].componentName).eq("/g2/P");
      expect(stateVariables["/g2"].activeChildren[1].componentName).eq("/g2/Q");
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([10, 9]);
      expect(stateVariables["/g2/Q"].stateValues.xs).eqls([8, 4]);
    });

    cy.log("switch to second option from conditional content");
    cy.get(cesc2("#/n") + " textarea").type("{end}2{enter}", { force: true });

    cy.get(cesc2("#/pP") + " .mjx-mrow").should("contain.text", "(3,4)");
    cy.get(cesc2("#/pP") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.get(cesc2("#/pQ") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,8)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1"].activeChildren.length).eq(1);
      expect(stateVariables["/g1"].activeChildren[0].componentName).eq("/g1/P");
      expect(stateVariables["/g1/P"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/g2"].activeChildren.length).eq(2);
      expect(stateVariables["/g2"].activeChildren[0].componentName).eq("/g2/P");
      expect(stateVariables["/g2"].activeChildren[1].componentName).eq("/g2/Q");
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/g2/Q"].stateValues.xs).eqls([7, 8]);
    });

    cy.log("move new points");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/P",
        args: { x: 6, y: 1 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/Q",
        args: { x: 9, y: 3 },
      });
    });

    cy.get(cesc2("#/pQ") + " .mjx-mrow").should("contain.text", "(9,3)");
    cy.get(cesc2("#/pP") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,1)");
    cy.get(cesc2("#/pQ") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1"].activeChildren.length).eq(1);
      expect(stateVariables["/g1"].activeChildren[0].componentName).eq("/g1/P");
      expect(stateVariables["/g1/P"].stateValues.xs).eqls([6, 1]);
      expect(stateVariables["/g2"].activeChildren.length).eq(2);
      expect(stateVariables["/g2"].activeChildren[0].componentName).eq("/g2/P");
      expect(stateVariables["/g2"].activeChildren[1].componentName).eq("/g2/Q");
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([6, 1]);
      expect(stateVariables["/g2/Q"].stateValues.xs).eqls([9, 3]);
    });

    cy.log("switch back to first option from conditional content");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}0{enter}",
      { force: true },
    );

    cy.get(cesc2("#/pP") + " .mjx-mrow").should("contain.text", "(5,6)");
    cy.get(cesc2("#/pP") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc2("#/pQ") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,8)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1"].activeChildren.length).eq(1);
      expect(stateVariables["/g1"].activeChildren[0].componentName).eq("/g1/P");
      expect(stateVariables["/g1/P"].stateValues.xs).eqls([5, 6]);
      expect(stateVariables["/g2"].activeChildren.length).eq(2);
      expect(stateVariables["/g2"].activeChildren[0].componentName).eq("/g2/P");
      expect(stateVariables["/g2"].activeChildren[1].componentName).eq("/g2/Q");
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([5, 6]);
      expect(stateVariables["/g2/Q"].stateValues.xs).eqls([7, 8]);
    });
  });

  it("assign names with copySource of group and map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <map name="map1" assignNames="(a) (b)">
      <template><text>hi $v</text></template>
      <sources alias="v"><number>1</number><number>2</number></sources>
    </map>
    
    <map copySource="map1" name="map2" assignNames="(c) (d)" />
    
    
    <group name="grp1" assignNames="e f">
      <text>apple</text>
      <text>banana</text>
    </group>
    
    <group copySource="grp1" name="grp2" assignNames="g h" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/a")).should("have.text", "hi 1");
    cy.get(cesc2("#/b")).should("have.text", "hi 2");
    cy.get(cesc2("#/c")).should("have.text", "hi 1");
    cy.get(cesc2("#/d")).should("have.text", "hi 2");
    cy.get(cesc2("#/e")).should("have.text", "apple");
    cy.get(cesc2("#/f")).should("have.text", "banana");
    cy.get(cesc2("#/g")).should("have.text", "apple");
    cy.get(cesc2("#/h")).should("have.text", "banana");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a"].stateValues.value).eq("hi 1");
      expect(stateVariables["/b"].stateValues.value).eq("hi 2");
      expect(stateVariables["/c"].stateValues.value).eq("hi 1");
      expect(stateVariables["/d"].stateValues.value).eq("hi 2");
      expect(stateVariables["/e"].stateValues.value).eq("apple");
      expect(stateVariables["/f"].stateValues.value).eq("banana");
      expect(stateVariables["/g"].stateValues.value).eq("apple");
      expect(stateVariables["/h"].stateValues.value).eq("banana");
    });
  });

  it("assign names with macro copy of group and map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <map name="map1" assignNames="(a) (b)">
      <template><text>hi $v</text></template>
      <sources alias="v"><number>1</number><number>2</number></sources>
    </map>
    
    $map1{name="map2" assignNames="(c) (d)"}
    
    
    <group name="grp1" assignNames="e f">
      <text>apple</text>
      <text>banana</text>
    </group>
    
    $grp1{name="grp2" assignNames="g h"}

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/a")).should("have.text", "hi 1");
    cy.get(cesc2("#/b")).should("have.text", "hi 2");
    cy.get(cesc2("#/c")).should("have.text", "hi 1");
    cy.get(cesc2("#/d")).should("have.text", "hi 2");
    cy.get(cesc2("#/e")).should("have.text", "apple");
    cy.get(cesc2("#/f")).should("have.text", "banana");
    cy.get(cesc2("#/g")).should("have.text", "apple");
    cy.get(cesc2("#/h")).should("have.text", "banana");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a"].stateValues.value).eq("hi 1");
      expect(stateVariables["/b"].stateValues.value).eq("hi 2");
      expect(stateVariables["/c"].stateValues.value).eq("hi 1");
      expect(stateVariables["/d"].stateValues.value).eq("hi 2");
      expect(stateVariables["/e"].stateValues.value).eq("apple");
      expect(stateVariables["/f"].stateValues.value).eq("banana");
      expect(stateVariables["/g"].stateValues.value).eq("apple");
      expect(stateVariables["/h"].stateValues.value).eq("banana");
    });
  });

  it("assign names with copySource of group and map, newNamespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <map name="map1" newNamespace assignNames="a b">
      <template newNamespace><text name="t">hi $v</text></template>
      <sources alias="v"><number>1</number><number>2</number></sources>
    </map>
    
    <map copySource="map1" name="map2" assignNames="c d" />
    
    
    <group name="grp1" newNamespace assignNames="a b">
      <text>apple</text>
      <text>banana</text>
    </group>
    
    <group copySource="grp1" name="grp2" assignNames="c d" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/map1/a/t")).should("have.text", "hi 1");
    cy.get(cesc2("#/map1/b/t")).should("have.text", "hi 2");
    cy.get(cesc2("#/map2/c/t")).should("have.text", "hi 1");
    cy.get(cesc2("#/map2/d/t")).should("have.text", "hi 2");
    cy.get(cesc2("#/grp1/a")).should("have.text", "apple");
    cy.get(cesc2("#/grp1/b")).should("have.text", "banana");
    cy.get(cesc2("#/grp2/c")).should("have.text", "apple");
    cy.get(cesc2("#/grp2/d")).should("have.text", "banana");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/map1/a/t"].stateValues.value).eq("hi 1");
      expect(stateVariables["/map1/b/t"].stateValues.value).eq("hi 2");
      expect(stateVariables["/map2/c/t"].stateValues.value).eq("hi 1");
      expect(stateVariables["/map2/d/t"].stateValues.value).eq("hi 2");
      expect(stateVariables["/grp1/a"].stateValues.value).eq("apple");
      expect(stateVariables["/grp1/b"].stateValues.value).eq("banana");
      expect(stateVariables["/grp2/c"].stateValues.value).eq("apple");
      expect(stateVariables["/grp2/d"].stateValues.value).eq("banana");
    });
  });

  it("assign names with macro copy of group and map, newNamespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <map name="map1" newNamespace assignNames="a b">
      <template newNamespace><text name="t">hi $v</text></template>
      <sources alias="v"><number>1</number><number>2</number></sources>
    </map>
    
    $map1{name="map2" assignNames="c d"}
    
    
    <group name="grp1" newNamespace assignNames="a b">
      <text>apple</text>
      <text>banana</text>
    </group>
    
    $grp1{name="grp2" assignNames="c d"}

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/map1/a/t")).should("have.text", "hi 1");
    cy.get(cesc2("#/map1/b/t")).should("have.text", "hi 2");
    cy.get(cesc2("#/map2/c/t")).should("have.text", "hi 1");
    cy.get(cesc2("#/map2/d/t")).should("have.text", "hi 2");
    cy.get(cesc2("#/grp1/a")).should("have.text", "apple");
    cy.get(cesc2("#/grp1/b")).should("have.text", "banana");
    cy.get(cesc2("#/grp2/c")).should("have.text", "apple");
    cy.get(cesc2("#/grp2/d")).should("have.text", "banana");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/map1/a/t"].stateValues.value).eq("hi 1");
      expect(stateVariables["/map1/b/t"].stateValues.value).eq("hi 2");
      expect(stateVariables["/map2/c/t"].stateValues.value).eq("hi 1");
      expect(stateVariables["/map2/d/t"].stateValues.value).eq("hi 2");
      expect(stateVariables["/grp1/a"].stateValues.value).eq("apple");
      expect(stateVariables["/grp1/b"].stateValues.value).eq("banana");
      expect(stateVariables["/grp2/c"].stateValues.value).eq("apple");
      expect(stateVariables["/grp2/d"].stateValues.value).eq("banana");
    });
  });

  it("copySource composite replacement implicitly skips assignNames", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text name="t1">hi</text>
      <text name="t2">bye</text>
      
      <group assignNames="a b">
        <text copySource="t1" />
        <text copySource="t2" />
      </group>

      <p>
        <group copySource="_group1" assignNames="c d" />
      </p>

      <p copySource="_p1" newNamespace />

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/a")).should("have.text", "hi");
    cy.get(cesc2("#/b")).should("have.text", "bye");
    cy.get(cesc2("#/c")).should("have.text", "hi");
    cy.get(cesc2("#/d")).should("have.text", "bye");
    cy.get(cesc2("#/_p2/c")).should("have.text", "hi");
    cy.get(cesc2("#/_p2/d")).should("have.text", "bye");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a"].stateValues.value).eq("hi");
      expect(stateVariables["/b"].stateValues.value).eq("bye");
      expect(stateVariables["/c"].stateValues.value).eq("hi");
      expect(stateVariables["/d"].stateValues.value).eq("bye");
      expect(stateVariables["/_p2/c"].stateValues.value).eq("hi");
      expect(stateVariables["/_p2/d"].stateValues.value).eq("bye");
    });
  });

  it("macro copy composite replacement implicitly skips assignNames", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text name="t1">hi</text>
      <text name="t2">bye</text>
      
      <group assignNames="a b">
        $t1
        $t2
      </group>

      <p>
        $_group1{assignNames="c d"}
      </p>

      $_p1{name="p2" newNamespace}

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/a")).should("have.text", "hi");
    cy.get(cesc2("#/b")).should("have.text", "bye");
    cy.get(cesc2("#/c")).should("have.text", "hi");
    cy.get(cesc2("#/d")).should("have.text", "bye");
    cy.get(cesc2("#/p2/c")).should("have.text", "hi");
    cy.get(cesc2("#/p2/d")).should("have.text", "bye");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a"].stateValues.value).eq("hi");
      expect(stateVariables["/b"].stateValues.value).eq("bye");
      expect(stateVariables["/c"].stateValues.value).eq("hi");
      expect(stateVariables["/d"].stateValues.value).eq("bye");
      expect(stateVariables["/p2/c"].stateValues.value).eq("hi");
      expect(stateVariables["/p2/d"].stateValues.value).eq("bye");
    });
  });

  it("copy and macro's prescribed name is used to assign name to replacement", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text name="t1">hi</text>
      <copy source="t1" name="t2" />
      $t1{name="t3"}
      
      <group name="grp1" newNamespace>
        <text>apple</text>
        <text>banana</text>
      </group>
      <copy source="grp1" name="grp2" />
      $grp1{name="grp3"}

      <point name="p">(3,4)</point>
      <copy source="p" prop="x" assignNames="x1" />
      <copy source="p.x" assignNames="x2" />
      $p.x{assignNames="x3"}

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/t1")).should("have.text", "hi");
    cy.get(cesc2("#/t2")).should("have.text", "hi");
    cy.get(cesc2("#/t3")).should("have.text", "hi");

    cy.get(cesc2("#/grp1/_text1")).should("have.text", "apple");
    cy.get(cesc2("#/grp1/_text2")).should("have.text", "banana");
    cy.get(cesc2("#/grp2/_text1")).should("have.text", "apple");
    cy.get(cesc2("#/grp2/_text2")).should("have.text", "banana");
    cy.get(cesc2("#/grp3/_text1")).should("have.text", "apple");
    cy.get(cesc2("#/grp3/_text2")).should("have.text", "banana");

    cy.get(cesc2("#/p") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.get(cesc2("#/x1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/x2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/x3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/t1"].stateValues.value).eq("hi");
      expect(stateVariables["/t2"].stateValues.value).eq("hi");
      expect(stateVariables["/t3"].stateValues.value).eq("hi");

      expect(stateVariables["/grp1/_text1"].stateValues.value).eq("apple");
      expect(stateVariables["/grp1/_text2"].stateValues.value).eq("banana");
      expect(stateVariables["/grp2/_text1"].stateValues.value).eq("apple");
      expect(stateVariables["/grp2/_text2"].stateValues.value).eq("banana");
      expect(stateVariables["/grp3/_text1"].stateValues.value).eq("apple");
      expect(stateVariables["/grp3/_text2"].stateValues.value).eq("banana");

      expect(stateVariables["/p"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/x1"].stateValues.value).eq(3);
      expect(stateVariables["/x2"].stateValues.value).eq(3);
      expect(stateVariables["/x3"].stateValues.value).eq(3);
    });
  });

  it("copy's automatically generated name not used", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text name="t1">hi</text> $t1

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/t1")).should("have.text", "hi");
    cy.get(cesc2("#/_document1")).should("contain.text", "hi hi");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/t1"].stateValues.value).eq("hi");
      expect(stateVariables["/_copy1"]).eq(undefined);

      let secondTextComponentName =
        stateVariables["/_document1"].activeChildren[3].componentName;
      expect(stateVariables[secondTextComponentName].stateValues.value).eq(
        "hi",
      );

      cy.get(cesc2("#" + secondTextComponentName)).should("have.text", "hi");
    });
  });

  it("copy and macro's ssignNames is used to assign name to prop replacement", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <point name="p">(3,4)</point>
      <copy source="p.x" assignNames="x1" />
      $p.x{assignNames="x2"}

      <copy source="p.coords" assignNames="c1" />
      $p.coords{assignNames="c2"}

      <copy source="p.xs" assignNames="x11 x21" />
      $p.xs{assignNames="x12 x22"}

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/p") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");

    cy.get(cesc2("#/x1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/x2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc2("#/c1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.get(cesc2("#/c2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");

    cy.get(cesc2("#/x11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/x21") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4");
    cy.get(cesc2("#/x12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/x22") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/x1"].stateValues.value).eq(3);
      expect(stateVariables["/x2"].stateValues.value).eq(3);
      expect(stateVariables["/c1"].stateValues.value).eqls(["vector", 3, 4]);
      expect(stateVariables["/c2"].stateValues.value).eqls(["vector", 3, 4]);
      expect(stateVariables["/x11"].stateValues.value).eq(3);
      expect(stateVariables["/x21"].stateValues.value).eq(4);
      expect(stateVariables["/x12"].stateValues.value).eq(3);
      expect(stateVariables["/x22"].stateValues.value).eq(4);
    });
  });

  it("add children to copySource with prop and propIndex", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <mathinput name="ind" prefill="1" />

    <graph>
      <rectangle name="rect" width="4" height="6" center="(3,5)"/>
      <point copySource="rect.vertices[$ind]" name="P">
        <label><m>V_$ind</m></label>
      </point>
    </graph>

    <p>P: <point name="Pa" copySource="P" /></p>
    <p>label of P: <label copySource="P.label" name="l" /></p>


    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/Pa") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,2)");
    cy.get(cesc2("#/l") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "V1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/P"].stateValues.label).eq("\\(V_1\\)");
    });

    cy.log("change to vertex 2");
    cy.get(cesc2("#/ind") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc2("#/Pa") + " .mjx-mrow").should("contain.text", "(5,2)");
    cy.get(cesc2("#/Pa") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,2)");
    cy.get(cesc2("#/l") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "V2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([5, 2]);
      expect(stateVariables["/P"].stateValues.label).eq("\\(V_2\\)");
    });

    cy.log("invalid vertex");
    cy.get(cesc2("#/ind") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });
    cy.get(cesc2("#/Pa") + " .mjx-mrow").should("contain.text", "(0,0)");
    cy.get(cesc2("#/Pa") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc2("#/l")).should("have.text", "");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([0, 0]);
      expect(stateVariables["/P"].stateValues.label).eq("");
    });

    cy.log("change to vertex 3");
    cy.get(cesc2("#/ind") + " textarea").type("3{enter}", {
      force: true,
    });
    cy.get(cesc2("#/Pa") + " .mjx-mrow").should("contain.text", "(5,8)");
    cy.get(cesc2("#/Pa") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,8)");
    cy.get(cesc2("#/l") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "V3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([5, 8]);
      expect(stateVariables["/P"].stateValues.label).eq("\\(V_3\\)");
    });
  });

  it("dot and array notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(2,3)</point>
    </graph>
    
    <p name="p1">P: $P</p>
    <p name="p2">P: $P[1]</p>
    <p name="p3">nothing: $P[2]</p>
    <p name="p4">P.: $P.</p>
    <p name="p5">P.1: $P.1</p>
    <p name="p6">x of P: $P.x</p>
    <p name="p7">y of P: $P.y</p>
    <p name="p8">nothing: $P._x</p>
    <p name="p9">x of P: $P.xs[1]</p>
    <p name="p10">y of P: $P.xs[2]</p>
    <p name="p11">nothing: $P.xs[3]</p>
    
    
    <p name="p12">P: $(P)</p>
    <p name="p13">(P).x: $(P).x</p>
    <p name="p14">no match: $(P.)</p>
    <p name="p15">nothing: $(P.1)</p>
    <p name="p16">x of P: $(P.x)</p>
    <p name="p17">y of P: $(P.y)</p>
    <p name="p18">x of P: $(P.xs[1])</p>
    <p name="p19">y of P: $(P.xs[2])</p>


    <p name="p20">P: $P</p>
    <p name="p21">P: <copy source="P[1]" /></p>
    <p name="p22">nothing: <copy source="P[2]" /></p>
    <p name="p23">nothing: <copy source="P." /></p>
    <p name="p24">nothing: <copy source="P.1" /></p>
    <p name="p25">x of P: <copy source="P.x" /></p>
    <p name="p26">y of P: <copy source="P.y" /></p>
    <p name="p27">nothing: <copy source="P._x" /></p>
    <p name="p28">x of P: <copy source="P.xs[1]" /></p>
    <p name="p29">y of P: <copy source="P.xs[2]" /></p>
    <p name="p30">nothing: <copy source="P.xs[3]" /></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/p3")).should("have.text", "nothing: ");
    cy.get(cesc2("#/p4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/p4")).should("contain.text", ").");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/p5")).should("contain.text", ").1");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2");
    cy.get(cesc2("#/p7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p8")).should("have.text", "nothing: ");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p11")).should("have.text", "nothing: ");

    cy.get(cesc2("#/p12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/p13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/p13")).should("contain.text", ").x");
    cy.get(cesc2("#/p14")).should("have.text", "no match: $(P.)");
    cy.get(cesc2("#/p15")).should("have.text", "nothing: ");
    cy.get(cesc2("#/p16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2");
    cy.get(cesc2("#/p17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2");
    cy.get(cesc2("#/p19") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.get(cesc2("#/p20") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/p21") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/p22")).should("have.text", "nothing: ");
    cy.get(cesc2("#/p23")).should("have.text", "nothing: ");
    cy.get(cesc2("#/p24")).should("have.text", "nothing: ");
    cy.get(cesc2("#/p25") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2");
    cy.get(cesc2("#/p26") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p27")).should("have.text", "nothing: ");
    cy.get(cesc2("#/p28") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2");
    cy.get(cesc2("#/p29") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p30")).should("have.text", "nothing: ");
  });

  it("dot and array notation, chaining, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph size="small">
      <line name="l" through="(2/3,3) (5,6)" displayDigits="2" />
    </graph>
    
    <p name="p1">$l.points.coords</p>
    <p name="p2">$l.points.x</p>
    <p name="p3">$l.points.y</p>
    <p name="p4">$l.points.bad</p>
    <p name="p5">$l.points.xs[1]</p>
    <p name="p6">$l.points.xs[2]</p>
    <p name="p7">$l.points.xs[3]</p>

    <p name="p8">$l.points[1].coords</p>
    <p name="p9">$l.points[1].x</p>
    <p name="p10">$l.points[1].y</p>
    <p name="p11">$l.points[1].bad</p>
    <p name="p12">$l.points[1].xs[1]</p>
    <p name="p13">$l.points[1].xs[2]</p>
    <p name="p14">$l.points[1].xs[3]</p>

    <p name="p15">$l.points[2].coords</p>
    <p name="p16">$l.points[2].x</p>
    <p name="p17">$l.points[2].y</p>
    <p name="p18">$l.points[2].bad</p>
    <p name="p19">$l.points[2].xs[1]</p>
    <p name="p20">$l.points[2].xs[2]</p>
    <p name="p21">$l.points[2].xs[3]</p>

    <p name="p22">$l.points[3].coords</p>
    <p name="p23">$l.points[3].x</p>
    <p name="p24">$l.points[3].y</p>
    <p name="p25">$l.points[3].bad</p>
    <p name="p26">$l.points[3].xs[1]</p>
    <p name="p27">$l.points[3].xs[2]</p>
    <p name="p28">$l.points[3].xs[3]</p>

    <p name="p29">$l.points.coords.latex</p>
    <p name="p30">$l.points.x.latex</p>
    <p name="p31">$l.points.y.latex</p>
    <p name="p32">$l.points.bad.latex</p>
    <p name="p33">$l.points.xs[1].latex</p>
    <p name="p34">$l.points.xs[2].latex</p>
    <p name="p35">$l.points.xs[3].latex</p>
    
    <p name="p36">$l.points[1].coords.latex</p>
    <p name="p37">$l.points[1].x.latex</p>
    <p name="p38">$l.points[1].y.latex</p>
    <p name="p39">$l.points[1].bad.latex</p>
    <p name="p40">$l.points[1].xs[1].latex</p>
    <p name="p41">$l.points[1].xs[2].latex</p>
    <p name="p42">$l.points[1].xs[3].latex</p>

    <p name="p43">$l.points[1][1]</p>
    <p name="p44">$l.points[1][2]</p>
    <p name="p45">$l.points[2][1]</p>
    <p name="p46">$l.points[2][2]</p>
    <p name="p47">$l.points[0][1]</p>
    <p name="p48">$l.points[1][0]</p>
    <p name="p49">$l.points[1][3]</p>
    <p name="p50">$l.points[3][1]</p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(23,3)");
    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "(5,6)");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "23");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "5");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "6");
    cy.get(cesc2("#/p4")).should("have.text", "");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "23");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "5");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "6");
    cy.get(cesc2("#/p7")).should("have.text", "");

    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(23,3)");
    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "23");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p11")).should("have.text", "");
    cy.get(cesc2("#/p12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "23");
    cy.get(cesc2("#/p12") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p13") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p14")).should("have.text", "");

    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc2("#/p16") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc2("#/p17") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p18")).should("have.text", "");
    cy.get(cesc2("#/p19") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc2("#/p19") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p20") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc2("#/p20") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p21")).should("have.text", "");

    cy.get(cesc2("#/p22")).should("have.text", "");
    cy.get(cesc2("#/p23")).should("have.text", "");
    cy.get(cesc2("#/p24")).should("have.text", "");
    cy.get(cesc2("#/p25")).should("have.text", "");
    cy.get(cesc2("#/p26")).should("have.text", "");
    cy.get(cesc2("#/p27")).should("have.text", "");
    cy.get(cesc2("#/p28")).should("have.text", "");

    cy.get(cesc2("#/p29")).should(
      "have.text",
      "\\left( \\frac{2}{3}, 3 \\right), \\left( 5, 6 \\right)",
    );
    cy.get(cesc2("#/p30")).should("have.text", "\\frac{2}{3}, 5");
    cy.get(cesc2("#/p31")).should("have.text", "3, 6");
    cy.get(cesc2("#/p32")).should("have.text", "");
    cy.get(cesc2("#/p33")).should("have.text", "\\frac{2}{3}, 5");
    cy.get(cesc2("#/p34")).should("have.text", "3, 6");
    cy.get(cesc2("#/p35")).should("have.text", "");

    cy.get(cesc2("#/p36")).should(
      "have.text",
      "\\left( \\frac{2}{3}, 3 \\right)",
    );
    cy.get(cesc2("#/p37")).should("have.text", "\\frac{2}{3}");
    cy.get(cesc2("#/p38")).should("have.text", "3");
    cy.get(cesc2("#/p39")).should("have.text", "");
    cy.get(cesc2("#/p40")).should("have.text", "\\frac{2}{3}");
    cy.get(cesc2("#/p41")).should("have.text", "3");
    cy.get(cesc2("#/p42")).should("have.text", "");

    cy.get(cesc2("#/p43") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "23");
    cy.get(cesc2("#/p44") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p45") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc2("#/p46") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc2("#/p47")).should("have.text", "");
    cy.get(cesc2("#/p48")).should("have.text", "");
    cy.get(cesc2("#/p49")).should("have.text", "");
    cy.get(cesc2("#/p50")).should("have.text", "");

    cy.log("move points");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [7, 8],
          point2coords: [9, 0],
        },
      });
    });

    cy.get(cesc2("#/p29")).should(
      "have.text",
      "\\left( 7, 8 \\right), \\left( 9, 0 \\right)",
    );

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,8)");
    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "9");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "0");
    cy.get(cesc2("#/p4")).should("have.text", "");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "9");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "0");
    cy.get(cesc2("#/p7")).should("have.text", "");

    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,8)");
    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p11")).should("have.text", "");
    cy.get(cesc2("#/p12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc2("#/p12") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc2("#/p13") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p14")).should("have.text", "");

    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc2("#/p16") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc2("#/p17") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p18")).should("have.text", "");
    cy.get(cesc2("#/p19") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc2("#/p19") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p20") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc2("#/p20") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p21")).should("have.text", "");

    cy.get(cesc2("#/p22")).should("have.text", "");
    cy.get(cesc2("#/p23")).should("have.text", "");
    cy.get(cesc2("#/p24")).should("have.text", "");
    cy.get(cesc2("#/p25")).should("have.text", "");
    cy.get(cesc2("#/p26")).should("have.text", "");
    cy.get(cesc2("#/p27")).should("have.text", "");
    cy.get(cesc2("#/p28")).should("have.text", "");

    cy.get(cesc2("#/p29")).should(
      "have.text",
      "\\left( 7, 8 \\right), \\left( 9, 0 \\right)",
    );
    cy.get(cesc2("#/p30")).should("have.text", "7, 9");
    cy.get(cesc2("#/p31")).should("have.text", "8, 0");
    cy.get(cesc2("#/p32")).should("have.text", "");
    cy.get(cesc2("#/p33")).should("have.text", "7, 9");
    cy.get(cesc2("#/p34")).should("have.text", "8, 0");
    cy.get(cesc2("#/p35")).should("have.text", "");

    cy.get(cesc2("#/p36")).should("have.text", "\\left( 7, 8 \\right)");
    cy.get(cesc2("#/p37")).should("have.text", "7");
    cy.get(cesc2("#/p38")).should("have.text", "8");
    cy.get(cesc2("#/p39")).should("have.text", "");
    cy.get(cesc2("#/p40")).should("have.text", "7");
    cy.get(cesc2("#/p41")).should("have.text", "8");
    cy.get(cesc2("#/p42")).should("have.text", "");

    cy.get(cesc2("#/p43") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc2("#/p44") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc2("#/p45") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc2("#/p46") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc2("#/p47")).should("have.text", "");
    cy.get(cesc2("#/p48")).should("have.text", "");
    cy.get(cesc2("#/p49")).should("have.text", "");
    cy.get(cesc2("#/p50")).should("have.text", "");
  });

  it("dot and array notation, chaining, copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph size="small">
      <line name="l" through="(2/3,3) (5,6)" displayDigits="2" />
    </graph>
    
    <p name="p1"><copy source="l.points.coords" /></p>
    <p name="p2"><copy source="l.points.x" /></p>
    <p name="p3"><copy source="l.points.y" /></p>
    <p name="p4"><copy source="l.points.bad" /></p>
    <p name="p5"><copy source="l.points.xs[1]" /></p>
    <p name="p6"><copy source="l.points.xs[2]" /></p>
    <p name="p7"><copy source="l.points.xs[3]" /></p>

    <p name="p8"><copy source="l.points[1].coords" /></p>
    <p name="p9"><copy source="l.points[1].x" /></p>
    <p name="p10"><copy source="l.points[1].y" /></p>
    <p name="p11"><copy source="l.points[1].bad" /></p>
    <p name="p12"><copy source="l.points[1].xs[1]" /></p>
    <p name="p13"><copy source="l.points[1].xs[2]" /></p>
    <p name="p14"><copy source="l.points[1].xs[3]" /></p>

    <p name="p15"><copy source="l.points[2].coords" /></p>
    <p name="p16"><copy source="l.points[2].x" /></p>
    <p name="p17"><copy source="l.points[2].y" /></p>
    <p name="p18"><copy source="l.points[2].bad" /></p>
    <p name="p19"><copy source="l.points[2].xs[1]" /></p>
    <p name="p20"><copy source="l.points[2].xs[2]" /></p>
    <p name="p21"><copy source="l.points[2].xs[3]" /></p>

    <p name="p22"><copy source="l.points[3].coords" /></p>
    <p name="p23"><copy source="l.points[3].x" /></p>
    <p name="p24"><copy source="l.points[3].y" /></p>
    <p name="p25"><copy source="l.points[3].bad" /></p>
    <p name="p26"><copy source="l.points[3].xs[1]" /></p>
    <p name="p27"><copy source="l.points[3].xs[2]" /></p>
    <p name="p28"><copy source="l.points[3].xs[3]" /></p>

    <p name="p29"><copy source="l.points.coords.latex" /></p>
    <p name="p30"><copy source="l.points.x.latex" /></p>
    <p name="p31"><copy source="l.points.y.latex" /></p>
    <p name="p32"><copy source="l.points.bad.latex" /></p>
    <p name="p33"><copy source="l.points.xs[1].latex" /></p>
    <p name="p34"><copy source="l.points.xs[2].latex" /></p>
    <p name="p35"><copy source="l.points.xs[3].latex" /></p>
    
    <p name="p36"><copy source="l.points[1].coords.latex" /></p>
    <p name="p37"><copy source="l.points[1].x.latex" /></p>
    <p name="p38"><copy source="l.points[1].y.latex" /></p>
    <p name="p39"><copy source="l.points[1].bad.latex" /></p>
    <p name="p40"><copy source="l.points[1].xs[1].latex" /></p>
    <p name="p41"><copy source="l.points[1].xs[2].latex" /></p>
    <p name="p42"><copy source="l.points[1].xs[3].latex" /></p>
    
    <p name="p43"><copy source="l.points[1][1]" /></p>
    <p name="p44"><copy source="l.points[1][2]" /></p>
    <p name="p45"><copy source="l.points[2][1]" /></p>
    <p name="p46"><copy source="l.points[2][2]" /></p>
    <p name="p47"><copy source="l.points[0][1]" /></p>
    <p name="p48"><copy source="l.points[1][0]" /></p>
    <p name="p49"><copy source="l.points[1][3]" /></p>
    <p name="p50"><copy source="l.points[3][1]" /></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(23,3)");
    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "(5,6)");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "23");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "5");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "6");
    cy.get(cesc2("#/p4")).should("have.text", "");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "23");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "5");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "6");
    cy.get(cesc2("#/p7")).should("have.text", "");

    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(23,3)");
    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "23");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p11")).should("have.text", "");
    cy.get(cesc2("#/p12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "23");
    cy.get(cesc2("#/p12") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p13") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p14")).should("have.text", "");

    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc2("#/p16") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc2("#/p17") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p18")).should("have.text", "");
    cy.get(cesc2("#/p19") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc2("#/p19") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p20") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc2("#/p20") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p21")).should("have.text", "");

    cy.get(cesc2("#/p22")).should("have.text", "");
    cy.get(cesc2("#/p23")).should("have.text", "");
    cy.get(cesc2("#/p24")).should("have.text", "");
    cy.get(cesc2("#/p25")).should("have.text", "");
    cy.get(cesc2("#/p26")).should("have.text", "");
    cy.get(cesc2("#/p27")).should("have.text", "");
    cy.get(cesc2("#/p28")).should("have.text", "");

    cy.get(cesc2("#/p29")).should(
      "have.text",
      "\\left( \\frac{2}{3}, 3 \\right), \\left( 5, 6 \\right)",
    );
    cy.get(cesc2("#/p30")).should("have.text", "\\frac{2}{3}, 5");
    cy.get(cesc2("#/p31")).should("have.text", "3, 6");
    cy.get(cesc2("#/p32")).should("have.text", "");
    cy.get(cesc2("#/p33")).should("have.text", "\\frac{2}{3}, 5");
    cy.get(cesc2("#/p34")).should("have.text", "3, 6");
    cy.get(cesc2("#/p35")).should("have.text", "");

    cy.get(cesc2("#/p36")).should(
      "have.text",
      "\\left( \\frac{2}{3}, 3 \\right)",
    );
    cy.get(cesc2("#/p37")).should("have.text", "\\frac{2}{3}");
    cy.get(cesc2("#/p38")).should("have.text", "3");
    cy.get(cesc2("#/p39")).should("have.text", "");
    cy.get(cesc2("#/p40")).should("have.text", "\\frac{2}{3}");
    cy.get(cesc2("#/p41")).should("have.text", "3");
    cy.get(cesc2("#/p42")).should("have.text", "");

    cy.get(cesc2("#/p43") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "23");
    cy.get(cesc2("#/p44") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");
    cy.get(cesc2("#/p45") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc2("#/p46") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc2("#/p47")).should("have.text", "");
    cy.get(cesc2("#/p48")).should("have.text", "");
    cy.get(cesc2("#/p49")).should("have.text", "");
    cy.get(cesc2("#/p50")).should("have.text", "");

    cy.log("move points");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [7, 8],
          point2coords: [9, 0],
        },
      });
    });

    cy.get(cesc2("#/p29")).should(
      "have.text",
      "\\left( 7, 8 \\right), \\left( 9, 0 \\right)",
    );

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,8)");
    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "9");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "0");
    cy.get(cesc2("#/p4")).should("have.text", "");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "9");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "0");
    cy.get(cesc2("#/p7")).should("have.text", "");

    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,8)");
    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p11")).should("have.text", "");
    cy.get(cesc2("#/p12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc2("#/p12") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc2("#/p13") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p14")).should("have.text", "");

    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc2("#/p16") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc2("#/p17") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p18")).should("have.text", "");
    cy.get(cesc2("#/p19") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc2("#/p19") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p20") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc2("#/p20") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p21")).should("have.text", "");

    cy.get(cesc2("#/p22")).should("have.text", "");
    cy.get(cesc2("#/p23")).should("have.text", "");
    cy.get(cesc2("#/p24")).should("have.text", "");
    cy.get(cesc2("#/p25")).should("have.text", "");
    cy.get(cesc2("#/p26")).should("have.text", "");
    cy.get(cesc2("#/p27")).should("have.text", "");
    cy.get(cesc2("#/p28")).should("have.text", "");

    cy.get(cesc2("#/p29")).should(
      "have.text",
      "\\left( 7, 8 \\right), \\left( 9, 0 \\right)",
    );
    cy.get(cesc2("#/p30")).should("have.text", "7, 9");
    cy.get(cesc2("#/p31")).should("have.text", "8, 0");
    cy.get(cesc2("#/p32")).should("have.text", "");
    cy.get(cesc2("#/p33")).should("have.text", "7, 9");
    cy.get(cesc2("#/p34")).should("have.text", "8, 0");
    cy.get(cesc2("#/p35")).should("have.text", "");

    cy.get(cesc2("#/p36")).should("have.text", "\\left( 7, 8 \\right)");
    cy.get(cesc2("#/p37")).should("have.text", "7");
    cy.get(cesc2("#/p38")).should("have.text", "8");
    cy.get(cesc2("#/p39")).should("have.text", "");
    cy.get(cesc2("#/p40")).should("have.text", "7");
    cy.get(cesc2("#/p41")).should("have.text", "8");
    cy.get(cesc2("#/p42")).should("have.text", "");

    cy.get(cesc2("#/p43") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "7");
    cy.get(cesc2("#/p44") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc2("#/p45") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc2("#/p46") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc2("#/p47")).should("have.text", "");
    cy.get(cesc2("#/p48")).should("have.text", "");
    cy.get(cesc2("#/p49")).should("have.text", "");
    cy.get(cesc2("#/p50")).should("have.text", "");
  });

  it("dot and array notation, chaining, specify attributes, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph size="small">
      <line name="l" through="(3.92639372,9.8293629453) (0.9060742037,32.93520806203104)" displayDigits="2" />
    </graph>
    
    <p name="p1">$l.points.coords</p>
    <p name="p2">$l.points.x</p>
    <p name="p3">$l.points.y</p>
    <p name="p4">$l.points.bad</p>
    <p name="p5">$l.points.xs[1]</p>
    <p name="p6">$l.points.xs[2]</p>
    <p name="p7">$l.points.xs[3]</p>

    <p name="p8">$(l.points.coords{displayDecimals="4"})</p>
    <p name="p9">$(l.points.x{displayDecimals="4"})</p>
    <p name="p10">$(l.points.y{displayDecimals="4"})</p>
    <p name="p11">$(l.points.bad{displayDecimals="4"})</p>
    <p name="p12">$(l.points.xs[1]{displayDecimals="4"})</p>
    <p name="p13">$(l.points.xs[2]{displayDecimals="4"})</p>
    <p name="p14">$(l.points.xs[3]{displayDecimals="4"})</p>

    <p name="p15">$(l.points[1].coords{displayDecimals="4"})</p>
    <p name="p16">$(l.points[1].x{displayDecimals="4"})</p>
    <p name="p17">$(l.points[1].y{displayDecimals="4"})</p>
    <p name="p18">$(l.points[1].bad{displayDecimals="4"})</p>
    <p name="p19">$(l.points[1].xs[1]{displayDecimals="4"})</p>
    <p name="p20">$(l.points[1].xs[2]{displayDecimals="4"})</p>
    <p name="p21">$(l.points[1].xs[3]{displayDecimals="4"})</p>

    <p name="p22">$l.points.coords{displayDecimals="4"}</p>
    <p name="p23">$l.points{displayDecimals="4"}.x</p>
    <p name="p24">$l{displayDecimals="4"}.points.y</p>
    <p name="p25">$l.points.bad{displayDecimals="4"}</p>
    <p name="p26">$l.points.xs[1]{displayDecimals="4"}</p>
    <p name="p27">$l.points{displayDecimals="4"}.xs[2]</p>
    <p name="p28">$l{displayDecimals="4"}.points.xs[3]</p>

    <p name="p29">$l.points[1].coords{displayDecimals="4"}</p>
    <p name="p30">$l.points[1]{displayDecimals="4"}.x</p>
    <p name="p31">$l{displayDecimals="4"}.points[1].y</p>
    <p name="p32">$l.points[1].bad{displayDecimals="4"}</p>
    <p name="p33">$l.points[1].xs[1]{displayDecimals="4"}</p>
    <p name="p34">$l.points[1]{displayDecimals="4"}.xs[2]</p>
    <p name="p35">$l{displayDecimals="4"}.points[1].xs[3]</p>

    <p name="p36">$l{displayDecimals="4"}.latex</p>
    <p name="p37">$(l{displayDigits="3"}.points{displayDecimals="4"})</p>
    <p name="p38">$(l{displayDigits="3"}.points[1]{displayDecimals="4"})</p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3.9,9.8)");
    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "(0.91,33)");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3.9");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "0.91");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9.8");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "33");
    cy.get(cesc2("#/p4")).should("have.text", "");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3.9");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "0.91");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9.8");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "33");
    cy.get(cesc2("#/p7")).should("have.text", "");

    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3.9264,9.8294)");
    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "(0.9061,32.9352)");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3.9264");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "0.9061");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9.8294");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "32.9352");
    cy.get(cesc2("#/p11")).should("have.text", "");
    cy.get(cesc2("#/p12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3.9264");
    cy.get(cesc2("#/p12") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "0.9061");
    cy.get(cesc2("#/p13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9.8294");
    cy.get(cesc2("#/p13") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "32.9352");
    cy.get(cesc2("#/p14")).should("have.text", "");

    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3.9264,9.8294)");
    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3.9264");
    cy.get(cesc2("#/p16") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9.8294");
    cy.get(cesc2("#/p17") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p18")).should("have.text", "");
    cy.get(cesc2("#/p19") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3.9264");
    cy.get(cesc2("#/p19") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p20") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9.8294");
    cy.get(cesc2("#/p20") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p21")).should("have.text", "");

    cy.get(cesc2("#/p22") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3.9264,9.8294)");
    cy.get(cesc2("#/p22") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "(0.9061,32.9352)");
    cy.get(cesc2("#/p23") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3.9264");
    cy.get(cesc2("#/p23") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "0.9061");
    cy.get(cesc2("#/p24") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9.8294");
    cy.get(cesc2("#/p24") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "32.9352");
    cy.get(cesc2("#/p25")).should("have.text", "");
    cy.get(cesc2("#/p26") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3.9264");
    cy.get(cesc2("#/p26") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "0.9061");
    cy.get(cesc2("#/p27") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9.8294");
    cy.get(cesc2("#/p27") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "32.9352");
    cy.get(cesc2("#/p28")).should("have.text", "");

    cy.get(cesc2("#/p29") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3.9264,9.8294)");
    cy.get(cesc2("#/p29") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p30") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3.9264");
    cy.get(cesc2("#/p30") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p31") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9.8294");
    cy.get(cesc2("#/p31") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p32")).should("have.text", "");
    cy.get(cesc2("#/p33") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3.9264");
    cy.get(cesc2("#/p33") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p34") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9.8294");
    cy.get(cesc2("#/p34") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/p35")).should("have.text", "");

    cy.get(cesc2("#/p36")).should(
      "have.text",
      "0 = -23.1058 x - 3.0203 y + 120.4105",
    );
    cy.get(cesc2("#/p37") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3.9264,9.8294)");
    cy.get(cesc2("#/p37") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "(0.9061,32.9352)");
    cy.get(cesc2("#/p38") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3.9264,9.8294)");
    cy.get(cesc2("#/p38") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
  });

  it("dot and array notation, chaining, nested", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph size="small">
      <line name="l" through="(1.92639372,9.8293629453) (5.9060742037,2.93520806203104)" />
      $l.points
    </graph>
    
    <p name="p1"><aslist>
      $l[1].points[$l.points[1].x]{displayDigits="$l.points[2].x"}.y
    </aslist></p>
    <p name="p2"><aslist>
      <copy source='l[1].points[$l.points[1].x]{displayDigits="$l.points[2].x"}.y' />
    </aslist></p>
    
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2.93521");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2.93521");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [1.38527302734, 8.48273402357],
          point2coords: [5.9060742037, 2.93520806203104],
        },
      });
    });

    cy.get(cesc2("#/p1") + " .mjx-mrow").should("contain.text", "8.48273");
    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8.48273");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8.48273");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [1.38527302734, 8.48273402357],
          point2coords: [4.482081034234, 7.34828203481],
        },
      });
    });

    cy.get(cesc2("#/p1") + " .mjx-mrow").should("contain.text", "8.483");
    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8.483");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8.483");
  });

  it("dot and array notation, chaining, copy source, change type", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph size="small">
      <line name="l" through="(2/3,3/4) (5/8,6/10)" displayDigits="2" />
    </graph>
    
    <p name="p1"><aslist><copy source="l.points.coords" creatComponentOfType="math" numComponents="2" /></aslist></p>
    <p name="p2"><aslist><copy source="l.points.x" createComponentOfType="number" numComponents="2" /></aslist></p>
    <p name="p3"><aslist><copy source="l.points.y" createComponentOfType="number" numComponents="2" /></aslist></p>
    <p name="p4"><aslist><copy source="l.points.bad" createComponentOfType="number" numComponents="2" /></aslist></p>
    <p name="p5"><aslist><copy source="l.points.xs[1]" createComponentOfType="number" numComponents="2" /></aslist></p>
    <p name="p6"><aslist><copy source="l.points.xs[2]" createComponentOfType="number" numComponents="2" /></aslist></p>
    <p name="p7"><aslist><copy source="l.points.xs[3]" createComponentOfType="number" numComponents="2" /></aslist></p>

    <p name="p8"><math copySource="l.points[1].coords" /></p>
    <p name="p9"><number copySource="l.points[1].x" /></p>
    <p name="p10"><number copysource="l.points[1].y" /></p>
    <p name="p11"><number copysource="l.points[1].bad" /></p>
    <p name="p12"><number copysource="l.points[1].xs[1]" /></p>
    <p name="p13"><number copysource="l.points[1].xs[2]" /></p>
    <p name="p14"><number copysource="l.points[1].xs[3]" /></p>

    <p name="p15"><math copysource="l.points[2].coords" /></p>
    <p name="p16"><number copysource="l.points[2].x" /></p>
    <p name="p17"><number copysource="l.points[2].y" /></p>
    <p name="p18"><number copysource="l.points[2].bad" /></p>
    <p name="p19"><number copysource="l.points[2].xs[1]" /></p>
    <p name="p20"><number copysource="l.points[2].xs[2]" /></p>
    <p name="p21"><number copysource="l.points[2].xs[3]" /></p>

    <p name="p22"><math copysource="l.points[3].coords" /></p>
    <p name="p23"><number copysource="l.points[3].x" /></p>
    <p name="p24"><number copysource="l.points[3].y" /></p>
    <p name="p25"><number copysource="l.points[3].bad" /></p>
    <p name="p26"><number copysource="l.points[3].xs[1]" /></p>
    <p name="p27"><number copysource="l.points[3].xs[2]" /></p>
    <p name="p28"><number copysource="l.points[3].xs[3]" /></p>

    <p name="p29"><aslist><copy source="l.points.coords.latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p30"><aslist><copy source="l.points.x.latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p31"><aslist><copy source="l.points.y.latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p32"><aslist><copy source="l.points.bad.latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p33"><aslist><copy source="l.points.xs[1].latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p34"><aslist><copy source="l.points.xs[2].latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    <p name="p35"><aslist><copy source="l.points.xs[3].latex" createComponentOfType="text" numComponents="2" /></aslist></p>
    
    <p name="p36"><text copysource="l.points[1].coords.latex" /></p>
    <p name="p37"><text copysource="l.points[1].x.latex" /></p>
    <p name="p38"><text copysource="l.points[1].y.latex" /></p>
    <p name="p39"><text copysource="l.points[1].bad.latex" /></p>
    <p name="p40"><text copysource="l.points[1].xs[1].latex" /></p>
    <p name="p41"><text copysource="l.points[1].xs[2].latex" /></p>
    <p name="p42"><text copysource="l.points[1].xs[3].latex" /></p>
    
    <p name="p43"><number copysource="l.points[1][1]" /></p>
    <p name="p44"><number copysource="l.points[1][2]" /></p>
    <p name="p45"><number copysource="l.points[2][1]" /></p>
    <p name="p46"><number copysource="l.points[2][2]" /></p>
    <p name="p47"><number copysource="l.points[0][1]" /></p>
    <p name="p48"><number copysource="l.points[1][0]" /></p>
    <p name="p49"><number copysource="l.points[1][3]" /></p>
    <p name="p50"><number copysource="l.points[3][1]" /></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(23,34)");
    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "(58,35)");
    cy.get(cesc2("#/p2")).should("have.text", "0.67, 0.63");
    cy.get(cesc2("#/p3")).should("have.text", "0.75, 0.6");
    cy.get(cesc2("#/p4")).should("have.text", "NaN, NaN");
    cy.get(cesc2("#/p5")).should("have.text", "0.67, 0.63");
    cy.get(cesc2("#/p6")).should("have.text", "0.75, 0.6");
    cy.get(cesc2("#/p7")).should("have.text", "NaN, NaN");

    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(23,34)");
    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p9")).should("have.text", "0.67");
    cy.get(cesc2("#/p10")).should("have.text", "0.75");
    cy.get(cesc2("#/p11")).should("have.text", "NaN");
    cy.get(cesc2("#/p12")).should("have.text", "0.67");
    cy.get(cesc2("#/p13")).should("have.text", "0.75");
    cy.get(cesc2("#/p14")).should("have.text", "NaN");

    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(58,35)");
    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p16")).should("have.text", "0.63");
    cy.get(cesc2("#/p17")).should("have.text", "0.6");
    cy.get(cesc2("#/p18")).should("have.text", "NaN");
    cy.get(cesc2("#/p19")).should("have.text", "0.63");
    cy.get(cesc2("#/p20")).should("have.text", "0.6");
    cy.get(cesc2("#/p21")).should("have.text", "NaN");

    cy.get(cesc2("#/p22") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc2("#/p23")).should("have.text", "NaN");
    cy.get(cesc2("#/p24")).should("have.text", "NaN");
    cy.get(cesc2("#/p25")).should("have.text", "NaN");
    cy.get(cesc2("#/p26")).should("have.text", "NaN");
    cy.get(cesc2("#/p27")).should("have.text", "NaN");
    cy.get(cesc2("#/p28")).should("have.text", "NaN");

    cy.get(cesc2("#/p29")).should(
      "have.text",
      "\\left( \\frac{2}{3}, \\frac{3}{4} \\right), \\left( \\frac{5}{8}, \\frac{3}{5} \\right)",
    );
    cy.get(cesc2("#/p30")).should("have.text", "\\frac{2}{3}, \\frac{5}{8}");
    cy.get(cesc2("#/p31")).should("have.text", "\\frac{3}{4}, \\frac{3}{5}");
    cy.get(cesc2("#/p32")).should("have.text", ", ");
    cy.get(cesc2("#/p33")).should("have.text", "\\frac{2}{3}, \\frac{5}{8}");
    cy.get(cesc2("#/p34")).should("have.text", "\\frac{3}{4}, \\frac{3}{5}");
    cy.get(cesc2("#/p35")).should("have.text", ", ");

    cy.get(cesc2("#/p36")).should(
      "have.text",
      "\\left( \\frac{2}{3}, \\frac{3}{4} \\right)",
    );
    cy.get(cesc2("#/p37")).should("have.text", "\\frac{2}{3}");
    cy.get(cesc2("#/p38")).should("have.text", "\\frac{3}{4}");
    cy.get(cesc2("#/p39")).should("have.text", "");
    cy.get(cesc2("#/p40")).should("have.text", "\\frac{2}{3}");
    cy.get(cesc2("#/p41")).should("have.text", "\\frac{3}{4}");
    cy.get(cesc2("#/p42")).should("have.text", "");

    cy.get(cesc2("#/p43")).should("have.text", "0.67");
    cy.get(cesc2("#/p44")).should("have.text", "0.75");
    cy.get(cesc2("#/p45")).should("have.text", "0.63");
    cy.get(cesc2("#/p46")).should("have.text", "0.6");
    cy.get(cesc2("#/p47")).should("have.text", "NaN");
    cy.get(cesc2("#/p48")).should("have.text", "NaN");
    cy.get(cesc2("#/p49")).should("have.text", "NaN");
    cy.get(cesc2("#/p50")).should("have.text", "NaN");

    cy.log("move points");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [7, 8],
          point2coords: [9, 0],
        },
      });
    });

    cy.get(cesc2("#/p29")).should(
      "have.text",
      "\\left( 7, 8 \\right), \\left( 9, 0 \\right)",
    );

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,8)");
    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/p2")).should("have.text", "7, 9");
    cy.get(cesc2("#/p3")).should("have.text", "8, 0");
    cy.get(cesc2("#/p4")).should("have.text", "NaN, NaN");
    cy.get(cesc2("#/p5")).should("have.text", "7, 9");
    cy.get(cesc2("#/p6")).should("have.text", "8, 0");
    cy.get(cesc2("#/p7")).should("have.text", "NaN, NaN");

    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,8)");
    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p9")).should("have.text", "7");
    cy.get(cesc2("#/p10")).should("have.text", "8");
    cy.get(cesc2("#/p11")).should("have.text", "NaN");
    cy.get(cesc2("#/p12")).should("have.text", "7");
    cy.get(cesc2("#/p13")).should("have.text", "8");
    cy.get(cesc2("#/p14")).should("have.text", "NaN");

    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/p15") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/p16")).should("have.text", "9");
    cy.get(cesc2("#/p17")).should("have.text", "0");
    cy.get(cesc2("#/p18")).should("have.text", "NaN");
    cy.get(cesc2("#/p19")).should("have.text", "9");
    cy.get(cesc2("#/p20")).should("have.text", "0");
    cy.get(cesc2("#/p21")).should("have.text", "NaN");

    cy.get(cesc2("#/p22") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc2("#/p23")).should("have.text", "NaN");
    cy.get(cesc2("#/p24")).should("have.text", "NaN");
    cy.get(cesc2("#/p25")).should("have.text", "NaN");
    cy.get(cesc2("#/p26")).should("have.text", "NaN");
    cy.get(cesc2("#/p27")).should("have.text", "NaN");
    cy.get(cesc2("#/p28")).should("have.text", "NaN");

    cy.get(cesc2("#/p29")).should(
      "have.text",
      "\\left( 7, 8 \\right), \\left( 9, 0 \\right)",
    );
    cy.get(cesc2("#/p30")).should("have.text", "7, 9");
    cy.get(cesc2("#/p31")).should("have.text", "8, 0");
    cy.get(cesc2("#/p32")).should("have.text", ", ");
    cy.get(cesc2("#/p33")).should("have.text", "7, 9");
    cy.get(cesc2("#/p34")).should("have.text", "8, 0");
    cy.get(cesc2("#/p35")).should("have.text", ", ");

    cy.get(cesc2("#/p36")).should("have.text", "\\left( 7, 8 \\right)");
    cy.get(cesc2("#/p37")).should("have.text", "7");
    cy.get(cesc2("#/p38")).should("have.text", "8");
    cy.get(cesc2("#/p39")).should("have.text", "");
    cy.get(cesc2("#/p40")).should("have.text", "7");
    cy.get(cesc2("#/p41")).should("have.text", "8");
    cy.get(cesc2("#/p42")).should("have.text", "");

    cy.get(cesc2("#/p43")).should("have.text", "7");
    cy.get(cesc2("#/p44")).should("have.text", "8");
    cy.get(cesc2("#/p45")).should("have.text", "9");
    cy.get(cesc2("#/p46")).should("have.text", "0");
    cy.get(cesc2("#/p47")).should("have.text", "NaN");
    cy.get(cesc2("#/p48")).should("have.text", "NaN");
    cy.get(cesc2("#/p49")).should("have.text", "NaN");
    cy.get(cesc2("#/p50")).should("have.text", "NaN");
  });

  it("dot and array notation, multidimensional, dynamic", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph size="small">
      <line through="(1,2) (3,4)" />
      <line through="(5,7) (9,6)" />
    </graph>

    <graph size="small">
      <collect name="col" componentTypes="line" source="_graph1" />
    </graph>

    <p>Line number: <mathinput name="ln" prefill="1" /></p>
    <p>Point number: <mathinput name="pn" prefill="1" /></p>
    <p>Coordinate number: <mathinput name="cn" prefill="1" /></p>

    
    <p name="p1">$col[$ln].points[$pn][$cn]</p>
    <p name="p2"><copy source="col[$ln].points[$pn][$cn]" /></p>
    <p name="p3">$col[$ln].points[$pn].xs[$cn]</p>
    <p name="p4"><copy source="col[$ln].points[$pn].xs[$cn]" /></p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/p4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");

    cy.get(cesc2("#/ln") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });

    cy.get(cesc2("#/p1")).should("have.text", "");
    cy.get(cesc2("#/p2")).should("have.text", "");
    cy.get(cesc2("#/p3")).should("have.text", "");
    cy.get(cesc2("#/p4")).should("have.text", "");

    cy.get(cesc2("#/ln") + " textarea").type("2{enter}", { force: true });

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");
    cy.get(cesc2("#/p4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5");

    cy.get(cesc2("#/pn") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });

    cy.get(cesc2("#/p1")).should("have.text", "");
    cy.get(cesc2("#/p2")).should("have.text", "");
    cy.get(cesc2("#/p3")).should("have.text", "");
    cy.get(cesc2("#/p4")).should("have.text", "");

    cy.get(cesc2("#/pn") + " textarea").type("2{enter}", { force: true });

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc2("#/p4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");

    cy.get(cesc2("#/cn") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });

    cy.get(cesc2("#/p1")).should("have.text", "");
    cy.get(cesc2("#/p2")).should("have.text", "");
    cy.get(cesc2("#/p3")).should("have.text", "");
    cy.get(cesc2("#/p4")).should("have.text", "");

    cy.get(cesc2("#/cn") + " textarea").type("2{enter}", { force: true });

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc2("#/p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc2("#/p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
    cy.get(cesc2("#/p4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6");
  });

  it("dot and array notation, recurse to subnames of composite replacements", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>n: <mathinput name="n" prefill="2" /></p>

    <map name="myMap">
      <template newnamespace>
        <p>The line through 
          <m>P=<point name="P">($v+1,$v+2)</point></m> and <m>Q=<point name="Q">($v+4, $v-1)</point></m>
          is <line name="l" through="$P $Q" />.</p>
      </template>
      <sources alias="v"><sequence from="1" to="$n" /></sources>
    </map>

    <p>Template number: <mathinput name="tn" prefill="1" /></p>
    <p>Point number: <mathinput name="pn" prefill="1" /></p>
    <p>Coordinate number: <mathinput name="cn" prefill="1" /></p>

    <p name="pt">The points from template $tn are: $(myMap[$tn]/P) and <copy source="myMap[$tn]/Q"/>.</p>
    <p name="pp">Point $pn from the line in that template is: $(myMap[$tn]/l.points[$pn]).</p>
    <p name="pc">Coordinate $cn from that point is $(myMap[$tn]/l.points[$pn].xs[$cn]).</p>
    <p name="pc2">Again, coordinate $cn from that point is <copy source="myMap[$tn]/l.points[$pn].xs[$cn]" />.</p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let Pxs = [2, 3, 4, 5, 6];
    let Pys = [3, 4, 5, 6, 7];
    let Qxs = [5, 6, 7, 8, 9];
    let Qys = [0, 1, 2, 3, 4];

    function checkResult(n, tn, pn, cn) {
      if (!(n >= 1 && tn <= n)) {
        // we have nothing
        cy.get(cesc("#\\/pt")).should("contain.text", "are:  and .");
        cy.get(cesc("#\\/pp")).should(
          "contain.text",
          " from the line in that template is: .",
        );
        cy.get(cesc("#\\/pc")).should("contain.text", "from that point is .");
        cy.get(cesc("#\\/pc2")).should("contain.text", "from that point is .");
      } else {
        cy.get(cesc("#\\/pt") + " .mjx-mrow").should(
          "contain.text",
          `(${Pxs[tn - 1]},${Pys[tn - 1]})`,
        );
        cy.get(cesc("#\\/pt") + " .mjx-mrow").should(
          "contain.text",
          `(${Qxs[tn - 1]},${Qys[tn - 1]})`,
        );
        cy.get(cesc("#\\/pt") + " .mjx-mrow")
          .eq(1)
          .should("have.text", `(${Pxs[tn - 1]},${Pys[tn - 1]})`);
        cy.get(cesc("#\\/pt") + " .mjx-mrow")
          .eq(4)
          .should("have.text", `(${Qxs[tn - 1]},${Qys[tn - 1]})`);

        if (pn === 1) {
          cy.get(cesc("#\\/pp") + " .mjx-mrow").should(
            "contain.text",
            `(${Pxs[tn - 1]},${Pys[tn - 1]})`,
          );
          cy.get(cesc("#\\/pp") + " .mjx-mrow")
            .eq(1)
            .should("have.text", `(${Pxs[tn - 1]},${Pys[tn - 1]})`);
          if (cn === 1) {
            cy.get(cesc("#\\/pc") + " .mjx-mrow").should(
              "contain.text",
              `${Pxs[tn - 1]}`,
            );
            cy.get(cesc("#\\/pc2") + " .mjx-mrow").should(
              "contain.text",
              `${Pxs[tn - 1]}`,
            );
            cy.get(cesc("#\\/pc") + " .mjx-mrow")
              .eq(1)
              .should("have.text", `${Pxs[tn - 1]}`);
            cy.get(cesc("#\\/pc2") + " .mjx-mrow")
              .eq(1)
              .should("have.text", `${Pxs[tn - 1]}`);
          } else if (cn === 2) {
            cy.get(cesc("#\\/pc") + " .mjx-mrow").should(
              "contain.text",
              `${Pys[tn - 1]}`,
            );
            cy.get(cesc("#\\/pc2") + " .mjx-mrow").should(
              "contain.text",
              `${Pys[tn - 1]}`,
            );
            cy.get(cesc("#\\/pc") + " .mjx-mrow")
              .eq(1)
              .should("have.text", `${Pys[tn - 1]}`);
            cy.get(cesc("#\\/pc2") + " .mjx-mrow")
              .eq(1)
              .should("have.text", `${Pys[tn - 1]}`);
          } else {
            cy.get(cesc("#\\/pc")).should(
              "contain.text",
              "from that point is .",
            );
            cy.get(cesc("#\\/pc2")).should(
              "contain.text",
              "from that point is .",
            );
          }
        } else if (pn === 2) {
          cy.get(cesc("#\\/pp") + " .mjx-mrow").should(
            "contain.text",
            `(${Qxs[tn - 1]},${Qys[tn - 1]})`,
          );
          cy.get(cesc("#\\/pp") + " .mjx-mrow")
            .eq(1)
            .should("have.text", `(${Qxs[tn - 1]},${Qys[tn - 1]})`);
          if (cn === 1) {
            cy.get(cesc("#\\/pc") + " .mjx-mrow").should(
              "contain.text",
              `${Qxs[tn - 1]}`,
            );
            cy.get(cesc("#\\/pc2") + " .mjx-mrow").should(
              "contain.text",
              `${Qxs[tn - 1]}`,
            );
            cy.get(cesc("#\\/pc") + " .mjx-mrow")
              .eq(1)
              .should("have.text", `${Qxs[tn - 1]}`);
            cy.get(cesc("#\\/pc2") + " .mjx-mrow")
              .eq(1)
              .should("have.text", `${Qxs[tn - 1]}`);
          } else if (cn === 2) {
            cy.get(cesc("#\\/pc") + " .mjx-mrow").should(
              "contain.text",
              `${Qys[tn - 1]}`,
            );
            cy.get(cesc("#\\/pc2") + " .mjx-mrow").should(
              "contain.text",
              `${Qys[tn - 1]}`,
            );
            cy.get(cesc("#\\/pc") + " .mjx-mrow")
              .eq(1)
              .should("have.text", `${Qys[tn - 1]}`);
            cy.get(cesc("#\\/pc2") + " .mjx-mrow")
              .eq(1)
              .should("have.text", `${Qys[tn - 1]}`);
          } else {
            cy.get(cesc("#\\/pc")).should(
              "contain.text",
              "from that point is .",
            );
            cy.get(cesc("#\\/pc2")).should(
              "contain.text",
              "from that point is .",
            );
          }
        } else {
          cy.get(cesc("#\\/pp")).should(
            "contain.text",
            " from the line in that template is: .",
          );
          cy.get(cesc("#\\/pc")).should("contain.text", "from that point is .");
          cy.get(cesc("#\\/pc2")).should(
            "contain.text",
            "from that point is .",
          );
        }
      }
    }

    checkResult(2, 1, 1, 1);

    cy.get(cesc("#\\/tn") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    checkResult(2, 2, 1, 1);

    cy.get(cesc("#\\/tn") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    checkResult(2, 3, 1, 1);

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    checkResult(4, 3, 1, 1);

    cy.get(cesc("#\\/pn") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    checkResult(4, 3, 3, 1);

    cy.get(cesc("#\\/pn") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    checkResult(4, 3, 2, 1);

    cy.get(cesc("#\\/cn") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    checkResult(4, 3, 2, 3);

    cy.get(cesc("#\\/cn") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    checkResult(4, 3, 2, 2);

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    checkResult(3, 3, 2, 2);

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    checkResult(1, 3, 2, 2);

    cy.get(cesc("#\\/tn") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    checkResult(1, 1, 2, 2);
  });

  it("dot and array notation from group", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name="grp">
      <math>x</math>
      copied will be blank
      <text fixed>hello</text>
      copied will also be blank
      <point>(4,5)</point>
      <line through="(10,9) (9,8)" />
      <p newNamespace>A <math name="m">y</math> and a <text name="t">word</text>.</p>
    </group>
    
    <p name="p1">the math: $grp[1]</p>
    <p name="p2">a blank: $grp[2]</p>
    <p name="p3">the text: $grp[3]</p>
    <p name="p4">another blank: $grp[4]</p>
    <p name="p5">the point: $grp[5]</p>
    <p name="p6">the point x: $grp[5].x</p>
    <p name="p7">the line: $grp[6]</p>
    <p name="p8">the line, point 1: $grp[6].points[1]</p>
    <p name="p9">the line, point 2, y: $grp[6].points[2].y</p>
    <p name="p10">math from p: $(grp[7]/m)</p>
    <p name="p11">text from p: $(grp[7]/t)</p>
    <p name="p12">nothing: $grp[8]</p>
    <p name="p13">Prop fixed from group: $grp.fixed</p>
    <p name="p14">Prop x from group: $grp.x</p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/p2")).should("have.text", "a blank: ");
    cy.get(cesc2("#/p3")).should("have.text", "the text: hello");
    cy.get(cesc2("#/p4")).should("have.text", "another blank: ");
    cy.get(cesc2("#/p5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)");
    cy.get(cesc2("#/p6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4");
    cy.get(cesc2("#/p7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0=x−y−1");
    cy.get(cesc2("#/p8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(10,9)");
    cy.get(cesc2("#/p9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "8");
    cy.get(cesc2("#/p10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");
    cy.get(cesc2("#/p11")).should("have.text", "text from p: word");
    cy.get(cesc2("#/p12")).should("have.text", "nothing: ");
    cy.get(cesc2("#/p13")).should(
      "have.text",
      "Prop fixed from group: false, true, false, false, false",
    );
    cy.get(cesc2("#/p14")).should("contain.text", "Prop x from group: x");
    cy.get(cesc2("#/p14")).should("contain.text", "x, 4");
    cy.get(cesc2("#/p14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/p14") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "4");
  });

  it("implicitProp from an input", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="x+x" name="mi" />

    <p name="pmacro1">$mi</p>
    <p name="pmacro2">$mi{simplify}</p>
    <p name="pcopy1">$mi</p>
    <p name="pcopy2"><copy source="mi{simplify}" /></p>
    <p name="pcopy3"><copy source="mi" simplify /></p>
    <p name="pcopy4"><copy source="mi" createComponentOfType="mathinput" /></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/pmacro1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");
    cy.get(cesc2("#/pmacro2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");

    cy.get(cesc2("#/pcopy1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");
    cy.get(cesc2("#/pcopy2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/pcopy3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/pcopy4") + " .mq-editable-field")
      .eq(0)
      .should("have.text", "x+x");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let macrom1Name =
        stateVariables["/pmacro1"].activeChildren[0].componentName;
      let macrom2Name =
        stateVariables["/pmacro2"].activeChildren[0].componentName;
      let copym1Name =
        stateVariables["/pcopy1"].activeChildren[0].componentName;
      let copym2Name =
        stateVariables["/pcopy2"].activeChildren[0].componentName;
      let copym3Name =
        stateVariables["/pcopy3"].activeChildren[0].componentName;
      let copymi4Name =
        stateVariables["/pcopy4"].activeChildren[0].componentName;

      expect(stateVariables[macrom1Name].componentType).eq("math");
      expect(stateVariables[macrom2Name].componentType).eq("math");
      expect(stateVariables[copym1Name].componentType).eq("math");
      expect(stateVariables[copym2Name].componentType).eq("math");
      expect(stateVariables[copym3Name].componentType).eq("math");
      expect(stateVariables[copymi4Name].componentType).eq("mathInput");
      expect(stateVariables[macrom1Name].stateValues.value).eqls([
        "+",
        "x",
        "x",
      ]);
      expect(stateVariables[macrom2Name].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables[copym1Name].stateValues.value).eqls([
        "+",
        "x",
        "x",
      ]);
      expect(stateVariables[copym2Name].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables[copym3Name].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables[copymi4Name].stateValues.value).eqls([
        "+",
        "x",
        "x",
      ]);
    });
  });

  it("implicitProp with same componentType depend on attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math name="m" simplify><math name="msub">x</math>+x</math>
    $m{name="mimplicit1"}
    $m{name="mimplicit2" createComponentOfType="math"}
    <math name="mimplicit3" copySource="m" />
    $m{name="mnotimplicit1" newNamespace}
    $m{name="mnotimplicit2" newNamespace createComponentOfType="math"}
    <math name="mnotimplicit3" copySource="m" newNamespace />
    $m{name="mnotimplicit4" simplify="false"}
    $m{name="mnotimplicit5" simplify="false" createComponentOfType="math"}
    <math name="mnotimplicit6" copySource="m" simplify="false" />

    $(mnotimplicit2/msub{name="msubimplicit1"})
    $(mnotimplicit3/msub{name="msubimplicit2"})
    <math name="msubimplicit3" copySource="mnotimplicit1/msub" />


    <math name="n" newNamespace><math name="nsub">y</math>+z</math>
    $n{name="nnotimplicit1"}
    <math name="nnotimplicit2" copySource="n" />
    $(nnotimplicit2/nsub{name="nsubimplicit1"})
    <math name="nsubimplicit2" copySource="nnotimplicit1/nsub" />


    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/mimplicit1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mimplicit2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mimplicit3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mnotimplicit1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mnotimplicit2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mnotimplicit3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mnotimplicit4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");
    cy.get(cesc2("#/mnotimplicit5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");
    cy.get(cesc2("#/mnotimplicit6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");
    cy.get(cesc2("#/msubimplicit1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/msubimplicit2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/msubimplicit3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");

    cy.get(cesc2("#/nnotimplicit1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y+z");
    cy.get(cesc2("#/nnotimplicit2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y+z");
    cy.get(cesc2("#/nsubimplicit1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");
    cy.get(cesc2("#/nsubimplicit2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mimplicit1"].activeChildren.length).eq(0);
      expect(stateVariables["/mimplicit2"].activeChildren.length).eq(0);
      expect(stateVariables["/mimplicit3"].activeChildren.length).eq(0);
      expect(stateVariables["/mnotimplicit1"].activeChildren.length).eq(2);
      expect(stateVariables["/mnotimplicit2"].activeChildren.length).eq(2);
      expect(stateVariables["/mnotimplicit3"].activeChildren.length).eq(2);
      expect(stateVariables["/mnotimplicit4"].activeChildren.length).eq(2);
      expect(stateVariables["/mnotimplicit5"].activeChildren.length).eq(2);
      expect(stateVariables["/mnotimplicit6"].activeChildren.length).eq(2);
      expect(stateVariables["/msubimplicit1"].activeChildren.length).eq(0);
      expect(stateVariables["/msubimplicit2"].activeChildren.length).eq(0);
      expect(stateVariables["/msubimplicit3"].activeChildren.length).eq(0);

      expect(stateVariables["/nnotimplicit1"].activeChildren.length).eq(2);
      expect(stateVariables["/nnotimplicit2"].activeChildren.length).eq(2);
      expect(stateVariables["/nsubimplicit1"].activeChildren.length).eq(0);
      expect(stateVariables["/nsubimplicit2"].activeChildren.length).eq(0);
    });
  });

  it("implicitProp with same componentType depend on attributes, subnames", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

    <map name="map">
      <template newNamespace><math name="m" simplify><math name="msub">x</math>+x</math></template>
      <sources><number>1</number></sources>
    </map>

    $(map[1]/m{name="mimplicit1"})
    $(map[1]/m{name="mimplicit2" createComponentOfType="math"})
    <math name="mimplicit3" copySource="map[1]/m" />
    $(map[1]/m{name="mnotimplicit1" newNamespace})
    $(map[1]/m{name="mnotimplicit2" newNamespace createComponentOfType="math"})
    <math name="mnotimplicit3" copySource="map[1]/m" newNamespace />
    $(map[1]/m{name="mnotimplicit4" simplify="false"})
    $(map[1]/m{name="mnotimplicit5" simplify="false" createComponentOfType="math"})
    <math name="mnotimplicit6" copySource="map[1]/m" simplify="false" />

    $(mnotimplicit2/msub{name="msubimplicit1"})
    $(mnotimplicit3/msub{name="msubimplicit2"})
    <math name="msubimplicit3" copySource="mnotimplicit1/msub" />

    <map name="map2">
      <template newNamespace><math name="n" newNamespace><math name="nsub">y</math>+z</math></template>
      <sources><number>1</number></sources>
    </map>

    $(map2[1]/n{name="nnotimplicit1"})
    <math name="nnotimplicit2" copySource="map2[1]/n" />
    $(nnotimplicit2/nsub{name="nsubimplicit1"})
    <math name="nsubimplicit2" copySource="nnotimplicit1/nsub" />


    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/mimplicit1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mimplicit2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mimplicit3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mnotimplicit1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mnotimplicit2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mnotimplicit3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "2x");
    cy.get(cesc2("#/mnotimplicit4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");
    cy.get(cesc2("#/mnotimplicit5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");
    cy.get(cesc2("#/mnotimplicit6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+x");
    cy.get(cesc2("#/msubimplicit1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/msubimplicit2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/msubimplicit3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");

    cy.get(cesc2("#/nnotimplicit1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y+z");
    cy.get(cesc2("#/nnotimplicit2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y+z");
    cy.get(cesc2("#/nsubimplicit1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");
    cy.get(cesc2("#/nsubimplicit2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mimplicit1"].activeChildren.length).eq(0);
      expect(stateVariables["/mimplicit2"].activeChildren.length).eq(0);
      expect(stateVariables["/mimplicit3"].activeChildren.length).eq(0);
      expect(stateVariables["/mnotimplicit1"].activeChildren.length).eq(2);
      expect(stateVariables["/mnotimplicit2"].activeChildren.length).eq(2);
      expect(stateVariables["/mnotimplicit3"].activeChildren.length).eq(2);
      expect(stateVariables["/mnotimplicit4"].activeChildren.length).eq(2);
      expect(stateVariables["/mnotimplicit5"].activeChildren.length).eq(2);
      expect(stateVariables["/mnotimplicit6"].activeChildren.length).eq(2);
      expect(stateVariables["/msubimplicit1"].activeChildren.length).eq(0);
      expect(stateVariables["/msubimplicit2"].activeChildren.length).eq(0);
      expect(stateVariables["/msubimplicit3"].activeChildren.length).eq(0);

      expect(stateVariables["/nnotimplicit1"].activeChildren.length).eq(2);
      expect(stateVariables["/nnotimplicit2"].activeChildren.length).eq(2);
      expect(stateVariables["/nsubimplicit1"].activeChildren.length).eq(0);
      expect(stateVariables["/nsubimplicit2"].activeChildren.length).eq(0);
    });
  });

  it("copies of composites ignore implicitProp", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name="g">
      <mathinput prefill="x" />
      <mathinput prefill="y" />
    </group>

    <p><collect componentTypes="mathinput" source="g" name="col" /></p>

    <p name="pmacro">$col</p>

    <p name="pcopy">$col</p>

    <p name="pmacro2">$g</p>

    <p name="pcopy2">$g</p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/pmacro") + " .mq-editable-field")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/pmacro") + " .mq-editable-field")
      .eq(1)
      .should("have.text", "y");

    cy.get(cesc2("#/pcopy") + " .mq-editable-field")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/pcopy") + " .mq-editable-field")
      .eq(1)
      .should("have.text", "y");

    cy.get(cesc2("#/pmacro2") + " .mq-editable-field")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/pmacro2") + " .mq-editable-field")
      .eq(1)
      .should("have.text", "y");

    cy.get(cesc2("#/pcopy2") + " .mq-editable-field")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/pcopy2") + " .mq-editable-field")
      .eq(1)
      .should("have.text", "y");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let [macromi1Name, macromi2Name] = stateVariables[
        "/pmacro"
      ].activeChildren.map((x) => x.componentName);
      let [copymi1Name, copymi2Name] = stateVariables[
        "/pcopy"
      ].activeChildren.map((x) => x.componentName);
      let [macromi1Name2, macromi2Name2] = stateVariables[
        "/pmacro2"
      ].activeChildren
        .filter((x) => x.componentName)
        .map((x) => x.componentName);
      let [copymi1Name2, copymi2Name2] = stateVariables[
        "/pcopy2"
      ].activeChildren
        .filter((x) => x.componentName)
        .map((x) => x.componentName);

      expect(stateVariables[macromi1Name].componentType).eq("mathInput");
      expect(stateVariables[macromi2Name].componentType).eq("mathInput");
      expect(stateVariables[copymi1Name].componentType).eq("mathInput");
      expect(stateVariables[copymi2Name].componentType).eq("mathInput");
      expect(stateVariables[macromi1Name].stateValues.value).eq("x");
      expect(stateVariables[macromi2Name].stateValues.value).eq("y");
      expect(stateVariables[copymi1Name].stateValues.value).eq("x");
      expect(stateVariables[copymi2Name].stateValues.value).eq("y");
      expect(stateVariables[macromi1Name2].componentType).eq("mathInput");
      expect(stateVariables[macromi2Name2].componentType).eq("mathInput");
      expect(stateVariables[copymi1Name2].componentType).eq("mathInput");
      expect(stateVariables[copymi2Name2].componentType).eq("mathInput");
      expect(stateVariables[macromi1Name2].stateValues.value).eq("x");
      expect(stateVariables[macromi2Name2].stateValues.value).eq("y");
      expect(stateVariables[copymi1Name2].stateValues.value).eq("x");
      expect(stateVariables[copymi2Name2].stateValues.value).eq("y");
    });
  });

  it("copies of composites with subnames do not ignore implicitProp", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map name="map" assignNames="t1 t2">
      <template newNamespace><mathinput name="mi" prefill="$v" /></template>
      <sources alias="v"><math>x</math><math>y</math></sources>
    </map>

    <p name="pmacro">$map</p>
    <p name="pcopy">$map</p>

    <p name="pmacroInd">$map[1]$map[2]</p>
    <p name="pcopyInd"><copy source="map[1]" /><copy source="map[2]" /></p>

    <p name="pmacroSubname">$(map[1]/mi)$(map[2]/mi)</p>
    <p name="pcopySubname"><copy source="map[1]/mi" /><copy source="map[2]/mi" /></p>



    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/pmacro") + " .mq-editable-field")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/pmacro") + " .mq-editable-field")
      .eq(1)
      .should("have.text", "y");

    cy.get(cesc2("#/pcopy") + " .mq-editable-field")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/pcopy") + " .mq-editable-field")
      .eq(1)
      .should("have.text", "y");

    cy.get(cesc2("#/pmacroInd") + " .mq-editable-field")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/pmacroInd") + " .mq-editable-field")
      .eq(1)
      .should("have.text", "y");

    cy.get(cesc2("#/pcopyInd") + " .mq-editable-field")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/pcopyInd") + " .mq-editable-field")
      .eq(1)
      .should("have.text", "y");

    cy.get(cesc2("#/pmacroSubname") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/pmacroSubname") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "y");

    cy.get(cesc2("#/pcopySubname") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/pcopySubname") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "y");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let [macromi1Name, macromi2Name] = stateVariables[
        "/pmacro"
      ].activeChildren.map((x) => x.componentName);
      let [copymi1Name, copymi2Name] = stateVariables[
        "/pcopy"
      ].activeChildren.map((x) => x.componentName);
      let [macroIndmi1Name, macroIndmi2Name] = stateVariables[
        "/pmacroInd"
      ].activeChildren.map((x) => x.componentName);
      let [copyIndmi1Name, copyIndmi2Name] = stateVariables[
        "/pmacroInd"
      ].activeChildren.map((x) => x.componentName);
      let [macroSubnamem1Name, macroSubnamem2Name] = stateVariables[
        "/pmacroSubname"
      ].activeChildren.map((x) => x.componentName);
      let [copySubnamem1Name, copySubnamem2Name] = stateVariables[
        "/pcopySubname"
      ].activeChildren.map((x) => x.componentName);

      expect(stateVariables[macromi1Name].componentType).eq("mathInput");
      expect(stateVariables[macromi2Name].componentType).eq("mathInput");
      expect(stateVariables[copymi1Name].componentType).eq("mathInput");
      expect(stateVariables[copymi2Name].componentType).eq("mathInput");
      expect(stateVariables[macroIndmi1Name].componentType).eq("mathInput");
      expect(stateVariables[macroIndmi2Name].componentType).eq("mathInput");
      expect(stateVariables[copyIndmi1Name].componentType).eq("mathInput");
      expect(stateVariables[copyIndmi2Name].componentType).eq("mathInput");
      expect(stateVariables[macroSubnamem1Name].componentType).eq("math");
      expect(stateVariables[macroSubnamem2Name].componentType).eq("math");
      expect(stateVariables[copySubnamem1Name].componentType).eq("math");
      expect(stateVariables[copySubnamem2Name].componentType).eq("math");
      expect(stateVariables[macromi1Name].stateValues.value).eq("x");
      expect(stateVariables[macromi2Name].stateValues.value).eq("y");
      expect(stateVariables[copymi1Name].stateValues.value).eq("x");
      expect(stateVariables[copymi2Name].stateValues.value).eq("y");
      expect(stateVariables[macroIndmi1Name].stateValues.value).eq("x");
      expect(stateVariables[macroIndmi2Name].stateValues.value).eq("y");
      expect(stateVariables[copyIndmi1Name].stateValues.value).eq("x");
      expect(stateVariables[copyIndmi2Name].stateValues.value).eq("y");
      expect(stateVariables[macroSubnamem1Name].stateValues.value).eq("x");
      expect(stateVariables[macroSubnamem2Name].stateValues.value).eq("y");
      expect(stateVariables[copySubnamem1Name].stateValues.value).eq("x");
      expect(stateVariables[copySubnamem2Name].stateValues.value).eq("y");
    });
  });

  it("implicitProp with createComponentOfType", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><mathinput name="mi"/>  <mathinput copySource="mi" />  <math copySource="mi" /></p>

    <p>$mi{createComponentOfType='mathinput'}, $mi, $mi{createComponentOfType='math'}</p> 

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "\uff3f");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mi3Anchor = cesc2(
        "#" + stateVariables["/_p2"].activeChildren[0].componentName,
      );
      let m2Anchor = cesc2(
        "#" + stateVariables["/_p2"].activeChildren[2].componentName,
      );
      let m3Anchor = cesc2(
        "#" + stateVariables["/_p2"].activeChildren[4].componentName,
      );

      cy.get(m2Anchor + " .mjx-mrow").should("contain.text", "\uff3f");
      cy.get(m3Anchor + " .mjx-mrow").should("contain.text", "\uff3f");

      cy.log("mathinputs change with immediate value");
      cy.get(cesc("#\\/mi") + " textarea").type("x", { force: true });

      cy.get(cesc("#\\/_mathinput2") + " .mq-editable-field").should(
        "have.text",
        "x",
      );
      cy.get(mi3Anchor + " .mq-editable-field").should("have.text", "x");

      cy.get(cesc("#\\/_math1") + " .mjx-mrow").should(
        "contain.text",
        "\uff3f",
      );
      cy.get(m2Anchor + " .mjx-mrow").should("contain.text", "\uff3f");
      cy.get(m3Anchor + " .mjx-mrow").should("contain.text", "\uff3f");

      cy.log("maths change with value");
      cy.get(cesc("#\\/mi") + " textarea").blur();

      cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "x");
      cy.get(m2Anchor + " .mjx-mrow").should("contain.text", "x");
      cy.get(m3Anchor + " .mjx-mrow").should("contain.text", "x");

      cy.log("mathinputs change with immediate value");
      cy.get(cesc("#\\/_mathinput2") + " textarea").type("{end}{backspace}y", {
        force: true,
      });

      cy.get(cesc("#\\/mi") + " .mq-editable-field").should("have.text", "y");
      cy.get(mi3Anchor + " .mq-editable-field").should("have.text", "y");

      cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "x");
      cy.get(m2Anchor + " .mjx-mrow").should("contain.text", "x");
      cy.get(m3Anchor + " .mjx-mrow").should("contain.text", "x");

      cy.log("maths change with value");
      cy.get(cesc("#\\/_mathinput2") + " textarea").blur();

      cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "y");
      cy.get(m2Anchor + " .mjx-mrow").should("contain.text", "y");
      cy.get(m3Anchor + " .mjx-mrow").should("contain.text", "y");

      cy.log("mathinputs change with immediate value");
      cy.get(mi3Anchor + " textarea").type("{end}{backspace}z", {
        force: true,
      });

      cy.get(cesc("#\\/mi") + " .mq-editable-field").should("have.text", "z");
      cy.get(cesc("#\\/_mathinput2") + " .mq-editable-field").should(
        "have.text",
        "z",
      );

      cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "y");
      cy.get(m2Anchor + " .mjx-mrow").should("contain.text", "y");
      cy.get(m3Anchor + " .mjx-mrow").should("contain.text", "y");

      cy.log("maths change with value");
      cy.get(mi3Anchor + " textarea").blur();

      cy.get(cesc("#\\/_math1") + " .mjx-mrow").should("contain.text", "z");
      cy.get(m2Anchor + " .mjx-mrow").should("contain.text", "z");
      cy.get(m3Anchor + " .mjx-mrow").should("contain.text", "z");
    });
  });

  it("asList when copy array prop", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <choiceinput name="ci">
      <choice>yes</choice>
      <choice>no</choice>
      <choice>maybe</choice>
    </choiceinput>

    <p name="default">Default: $ci.choiceTexts</p>
    <p name="nocommas">No commas: $ci.choiceTexts{asList="false"}</p>
    <p name="withcommas">With commas: $ci.choiceTexts{asList="true"}</p>
    <p name="default2" copySource="default" />
    <p name="nocommas2" copySource="nocommas" />
    <p name="withcommas2" copySource="withcommas" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/default")).should("have.text", "Default: yes, no, maybe");
    cy.get(cesc2("#/nocommas")).should("have.text", "No commas: yesnomaybe");
    cy.get(cesc2("#/withcommas")).should(
      "have.text",
      "With commas: yes, no, maybe",
    );
    cy.get(cesc2("#/default2")).should("have.text", "Default: yes, no, maybe");
    cy.get(cesc2("#/nocommas2")).should("have.text", "No commas: yesnomaybe");
    cy.get(cesc2("#/withcommas2")).should(
      "have.text",
      "With commas: yes, no, maybe",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/default"].stateValues.text).eq(
        "Default: yes, no, maybe",
      );
      expect(stateVariables["/nocommas"].stateValues.text).eq(
        "No commas: yesnomaybe",
      );
      expect(stateVariables["/withcommas"].stateValues.text).eq(
        "With commas: yes, no, maybe",
      );
      expect(stateVariables["/default2"].stateValues.text).eq(
        "Default: yes, no, maybe",
      );
      expect(stateVariables["/nocommas2"].stateValues.text).eq(
        "No commas: yesnomaybe",
      );
      expect(stateVariables["/withcommas2"].stateValues.text).eq(
        "With commas: yes, no, maybe",
      );
    });
  });

  it("asList when copy array prop, multiple stacked props", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <line name="l" through="(1,2) (3,4)" />

    <p name="default">Default: $l.points.x</p>
    <p name="nocommas">No commas: $l.points.x{asList="false"}</p>
    <p name="withcommas">With commas: $l.points.x{asList="true"}</p>
    <p name="default2" copySource="default" />
    <p name="nocommas2" copySource="nocommas" />
    <p name="withcommas2" copySource="withcommas" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/default")).should("contain.text", "1, 3");
    cy.get(cesc2("#/nocommas")).should("contain.text", "13");
    cy.get(cesc2("#/withcommas")).should("contain.text", "1, 3");
    cy.get(cesc2("#/default2")).should("contain.text", "1, 3");
    cy.get(cesc2("#/nocommas2")).should("contain.text", "13");
    cy.get(cesc2("#/withcommas2")).should("contain.text", "1, 3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/default"].stateValues.text).eq("Default: 1, 3");
      expect(stateVariables["/nocommas"].stateValues.text).eq("No commas: 13");
      expect(stateVariables["/withcommas"].stateValues.text).eq(
        "With commas: 1, 3",
      );
      expect(stateVariables["/default2"].stateValues.text).eq("Default: 1, 3");
      expect(stateVariables["/nocommas2"].stateValues.text).eq("No commas: 13");
      expect(stateVariables["/withcommas2"].stateValues.text).eq(
        "With commas: 1, 3",
      );
    });
  });

  it("asList when copy array prop, aslist overrides", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <choiceinput name="ci">
      <choice>yes</choice>
      <choice>no</choice>
      <choice>maybe</choice>
    </choiceinput>

    
    Override no commas: <aslist name="nocommas">$ci.choiceTexts{asList="false"}</aslist>
    Copy: <aslist name="nocommas2" copySource="nocommas" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Override no commas: yes, no, maybe",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Copy: yes, no, maybe",
    );
  });

  it("asList when copy array prop, test renderers", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <choiceinput name="ci">
      <choice>yes</choice>
      <choice>no</choice>
      <choice>maybe</choice>
    </choiceinput>

    In document: $ci.choiceTexts
    <alert name="in_alert">$ci.choiceTexts</alert>
    <blockquote name="in_blockquote">$ci.choiceTexts</blockquote>
    <c name="in_c">$ci.choiceTexts</c>
    <caption name="in_caption">$ci.choiceTexts</caption>
    <cell name="in_cell">$ci.choiceTexts</cell>
    <choice name="in_choice">$ci.choiceTexts</choice>
    <span name="in_span">$ci.choiceTexts</span>
    <em name="in_em">$ci.choiceTexts</em>
    <feedback name="in_feedback">$ci.choiceTexts</feedback>
    <footnote name="in_footnote">$ci.choiceTexts</footnote>
    <hint name="in_hint_w_title"><title>A title</title>$ci.choiceTexts</hint>
    <hint name="in_hint_wo_title">$ci.choiceTexts</hint>
    <label name="in_label">$ci.choiceTexts</label>
    <ol>
      <li name="in_li">$ci.choiceTexts</li>
    </ol>
    <ul>
      <li name="in_li2">$ci.choiceTexts</li>
    </ul>
    <p name="in_p">$ci.choiceTexts</p>
    <pre name="in_pre">$ci.choiceTexts</pre>
    <p name="in_q"><q>$ci.choiceTexts</q></p>
    <section name="in_section_w_title"><title name="sec_title">Title: $ci.choiceTexts</title>Text: $ci.choiceTexts</section>
    <section name="in_section_wo_title">$ci.choiceTexts</section>
    <solution name="in_solution">$ci.choiceTexts</solution>
    <p name="in_sq"><sq>$ci.choiceTexts</sq></p>
    <text name="in_text">$ci.choiceTexts</text>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "In document: yes, no, maybe",
    );
    cy.get(cesc2("#/in_alert")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_blockquote")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_c")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_caption")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_cell")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_choice")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_span")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_em")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_feedback")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_footnote")).click();
    cy.get(cesc2("#/in_footnote")).should("contain.text", "yes, no, maybe");
    cy.get(cesc2("#/in_hint_w_title")).click();
    cy.get(cesc2("#/in_hint_w_title")).should("contain.text", "yes, no, maybe");
    cy.get(cesc2("#/in_hint_wo_title")).click();
    cy.get(cesc2("#/in_hint_wo_title")).should(
      "contain.text",
      "yes, no, maybe",
    );
    cy.get(cesc2("#/in_label")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_li")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_li2")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_p")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_pre")).should("have.text", "yes, no, maybe");
    cy.get(cesc2("#/in_q")).should("have.text", "“yes, no, maybe”");
    cy.get(cesc2("#/in_section_w_title")).should(
      "contain.text",
      "Title: yes, no, maybe",
    );
    cy.get(cesc2("#/in_section_w_title")).should(
      "contain.text",
      "Text: yes, no, maybe",
    );
    cy.get(cesc2("#/in_section_wo_title")).should(
      "contain.text",
      "yes, no, maybe",
    );
    cy.get(cesc2("#/in_solution")).click();
    cy.get(cesc2("#/in_solution")).should("contain.text", "yes, no, maybe");
    cy.get(cesc2("#/in_sq")).should("have.text", "‘yes, no, maybe’");
    cy.get(cesc2("#/in_text")).should("have.text", "yes, no, maybe");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/in_alert"].stateValues.text).eq("yes, no, maybe");
      expect(stateVariables["/in_c"].stateValues.text).eq("yes, no, maybe");
      expect(stateVariables["/in_caption"].stateValues.text).eq(
        "yes, no, maybe",
      );
      expect(stateVariables["/in_cell"].stateValues.text).eq("yes, no, maybe");
      expect(stateVariables["/in_choice"].stateValues.text).eq(
        "yes, no, maybe",
      );
      expect(stateVariables["/in_em"].stateValues.text).eq("yes, no, maybe");
      expect(stateVariables["/in_footnote"].stateValues.text).eq(
        "yes, no, maybe",
      );
      expect(stateVariables["/in_label"].stateValues.text).eq("yes, no, maybe");
      expect(stateVariables["/in_p"].stateValues.text).eq("yes, no, maybe");
      expect(stateVariables["/in_text"].stateValues.text).eq("yes, no, maybe");
      expect(stateVariables["/sec_title"].stateValues.text).eq(
        "Title: yes, no, maybe",
      );
    });
  });

  it("copy number from external content multiple ways, change attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" /></p>

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" name="n2" displayDigits="10" /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" displayDigits="10" name="n4" /></p>

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" newNamespace /></p>

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" name="n6" displayDigits="10" newNamespace /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" newNamespace /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" displayDigits="10" name="n8" newNamespace /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_p1")).should("have.text", "8.85");
    cy.get(cesc("#\\/n2")).should("have.text", "8.853729375");
    cy.get(cesc("#\\/_number1")).should("have.text", "8.85");
    cy.get(cesc("#\\/n4")).should("have.text", "8.853729375");
    cy.get(cesc("#\\/_p5")).should("have.text", "8.85");
    cy.get(cesc("#\\/n6")).should("have.text", "8.853729375");
    cy.get(cesc("#\\/_number3")).should("have.text", "8.85");
    cy.get(cesc("#\\/n8")).should("have.text", "8.853729375");
  });

  it("correctly wrap replacement changes when verifying to force component type", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <answer name="ans">47</answer>
        <number copySource="ans.submittedResponse" name="num" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/num")).should("have.text", "NaN");

    cy.get(cesc("#\\/ans") + " textarea").type("4{enter}", { force: true });
    cy.get(cesc("#\\/num")).should("have.text", "4");

    cy.get(cesc("#\\/ans") + " textarea").type("7{enter}", { force: true });
    cy.get(cesc("#\\/num")).should("have.text", "47");
  });

  it("copy of copy with new namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <group name="orig"><text name="t">hello</text></group>
    
    <p>copy with new namespace:  <copy source="orig" name="cN" newnamespace /></p>
    <p>copy of copy: <copy source="cN" name="cNc" /></p>

    <p>copy of copy of copy: <copy source="cNc" name="cNcc" /></p>
    <p>copy of copy of copy nn: <copy source="cNc" name="cNccN" newNamespace /></p>
    
    <p>piece of copy: <text name="cNt" copySource="cN/t" /></p>
    <p>piece of copy of copy: <text name="cNct" copySource="cNc/t" /></p>

    <p>piece of copy of copy of copy: <text name="cNcct" copySource="cNcc/t" /></p>
    <p>piece of copy of copy of copy nn: <text name="cNccNt" copySource="cNccN/t" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/t")).should("have.text", "hello");
    cy.get(cesc2("#/cN/t")).should("have.text", "hello");
    cy.get(cesc2("#/cNc/t")).should("have.text", "hello");
    cy.get(cesc2("#/cNcc/t")).should("have.text", "hello");
    cy.get(cesc2("#/cNccN/t")).should("have.text", "hello");

    cy.get(cesc2("#/cNt")).should("have.text", "hello");
    cy.get(cesc2("#/cNct")).should("have.text", "hello");
    cy.get(cesc2("#/cNcct")).should("have.text", "hello");
    cy.get(cesc2("#/cNccNt")).should("have.text", "hello");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/orig"].componentType).eq("group");
      expect(stateVariables["/t"].stateValues.value).eq("hello");

      expect(stateVariables["/cN"].componentType).eq("group");
      expect(stateVariables["/cN/t"].stateValues.value).eq("hello");

      expect(stateVariables["/cNc"].componentType).eq("group");
      expect(stateVariables["/cNc/t"].stateValues.value).eq("hello");

      expect(stateVariables["/cNcc"].componentType).eq("group");
      expect(stateVariables["/cNcc/t"].stateValues.value).eq("hello");

      expect(stateVariables["/cNccN"].componentType).eq("group");
      expect(stateVariables["/cNccN/t"].stateValues.value).eq("hello");
    });
  });

  it("copy of copy with new namespace, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <group name="orig"><text name="t">hello</text></group>
    
    <p>copy with new namespace:  $orig{name="cN" newnamespace}</p>
    <p>copy of copy: $cN{name="cNc"}</p>

    <p>copy of copy of copy: $cNc{name="cNcc"}</p>
    <p>copy of copy of copy nn: $cNc{name="cNccN" newNamespace}</p>
    
    <p>piece of copy: $(cN/t{name="cNt"})</p>
    <p>piece of copy of copy: $(cNc/t{name="cNct"})</p>

    <p>piece of copy of copy of copy: $(cNcc/t{name="cNcct"})</p>
    <p>piece of copy of copy of copy nn: $(cNccN/t{name="cNccNt"})</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/t")).should("have.text", "hello");
    cy.get(cesc2("#/cN/t")).should("have.text", "hello");
    cy.get(cesc2("#/cNc/t")).should("have.text", "hello");
    cy.get(cesc2("#/cNcc/t")).should("have.text", "hello");
    cy.get(cesc2("#/cNccN/t")).should("have.text", "hello");

    cy.get(cesc2("#/cNt")).should("have.text", "hello");
    cy.get(cesc2("#/cNct")).should("have.text", "hello");
    cy.get(cesc2("#/cNcct")).should("have.text", "hello");
    cy.get(cesc2("#/cNccNt")).should("have.text", "hello");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/orig"].componentType).eq("group");
      expect(stateVariables["/t"].stateValues.value).eq("hello");

      expect(stateVariables["/cN"].componentType).eq("group");
      expect(stateVariables["/cN/t"].stateValues.value).eq("hello");

      expect(stateVariables["/cNc"].componentType).eq("group");
      expect(stateVariables["/cNc/t"].stateValues.value).eq("hello");

      expect(stateVariables["/cNcc"].componentType).eq("group");
      expect(stateVariables["/cNcc/t"].stateValues.value).eq("hello");

      expect(stateVariables["/cNccN"].componentType).eq("group");
      expect(stateVariables["/cNccN/t"].stateValues.value).eq("hello");
    });
  });
});
