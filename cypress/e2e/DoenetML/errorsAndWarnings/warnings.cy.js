import { cesc2 } from "../../../../src/_utils/url";

describe("Warning Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("Deprecated attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<section suppressAutoName>
  <graph xlabel="a">
    <regularpolygon nSides="4" name="rp" />
    <regularpolygon copySource="rp" nSides="6" />
    $rp{nSides="8"}
  </graph>
  <answer maximumNumberOfAttempts="2">
    <choiceinput randomizeOrder>
      <choice>yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer>
</section>
<number copysource="rp.numSides" name="ns" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ns")).should("have.text", "4");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(7);

      expect(errorWarnings.warnings[0].message).contain(
        "Attribute suppressAutoName is deprecated. It is ignored.",
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(14);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(10);
      expect(errorWarnings.warnings[0].level).eq(1);

      expect(errorWarnings.warnings[1].message).contain(
        "Attribute xlabel of component type graph is deprecated. It is ignored.",
      );
      expect(errorWarnings.warnings[1].level).eq(1);
      expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(10);

      expect(errorWarnings.warnings[2].message).contain(
        "Attribute nSides is deprecated. Use numSides instead.",
      );
      expect(errorWarnings.warnings[2].level).eq(1);
      expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(4);
      expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(43);

      expect(errorWarnings.warnings[3].message).contain(
        "Attribute nSides is deprecated. Use numSides instead.",
      );
      expect(errorWarnings.warnings[3].level).eq(1);
      expect(errorWarnings.warnings[3].doenetMLrange.lineBegin).eq(5);
      expect(errorWarnings.warnings[3].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.warnings[3].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.warnings[3].doenetMLrange.charEnd).eq(49);

      expect(errorWarnings.warnings[6].message).contain(
        "Attribute nSides is deprecated. Use numSides instead.",
      );
      expect(errorWarnings.warnings[6].level).eq(1);
      expect(errorWarnings.warnings[6].doenetMLrange.lineBegin).eq(6);
      expect(errorWarnings.warnings[6].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.warnings[6].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.warnings[6].doenetMLrange.charEnd).eq(19);

      expect(errorWarnings.warnings[4].message).contain(
        "Attribute maximumNumberOfAttempts of component type answer is deprecated. Use maxNumAttempts instead.",
      );
      expect(errorWarnings.warnings[4].level).eq(1);
      expect(errorWarnings.warnings[4].doenetMLrange.lineBegin).eq(8);
      expect(errorWarnings.warnings[4].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[4].doenetMLrange.lineEnd).eq(13);
      expect(errorWarnings.warnings[4].doenetMLrange.charEnd).eq(11);

      expect(errorWarnings.warnings[5].message).contain(
        "Attribute randomizeOrder is deprecated. Use shuffleOrder instead.",
      );
      expect(errorWarnings.warnings[5].level).eq(1);
      expect(errorWarnings.warnings[5].doenetMLrange.lineBegin).eq(9);
      expect(errorWarnings.warnings[5].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.warnings[5].doenetMLrange.lineEnd).eq(12);
      expect(errorWarnings.warnings[5].doenetMLrange.charEnd).eq(18);
    });
  });

  it("Deprecated properties", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<graph>
  <regularpolygon numSides="4" name="rp" />
</graph>
<number copysource="rp.nSides" name="ns" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ns")).should("have.text", "4");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(1);

      expect(errorWarnings.warnings[0].message).contain(
        "Property nSides is deprecated. Use numSides instead.",
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(5);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(43);
    });
  });

  it("From state variable definitions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<graph>
  <line name="l1" through="(1,2) (3,4)" />
  <line name="l2" through="(1,2) (-3,4)" />
  <line name="l3" through="(-1,2) (-3,4)" />
  <angle betweenLines="$l1 $l2 $l3" name="alpha" />
</graph>
<math copysource="alpha" name="alpha2" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/alpha2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(2);

      expect(errorWarnings.warnings[0].message).contain(
        "Cannot define an angle between 3 lines",
      );
      expect(errorWarnings.warnings[0].level).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(6);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(51);

      expect(errorWarnings.warnings[1].message).contain(
        "Cannot define an angle between 3 lines",
      );
      expect(errorWarnings.warnings[1].level).eq(2);
      expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(6);
      expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(51);
    });
  });

  it("From state variable inverse definitions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <circle through="(a,b) (c,d)" name="c" />

  <mathinput name="mi">$c.radius</mathinput>
  <booleaninput name="bi" /><boolean copySource="bi" name="b" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/b")).should("have.text", "false");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(1);

      expect(errorWarnings.warnings[0].message).contain(
        "Haven't implemented circle through 2 points in case where don't have numerical values",
      );
      expect(errorWarnings.warnings[0].level).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(43);
    });

    cy.log("try to change radius");
    cy.get(cesc2("#/mi") + " textarea").type("1{enter}", { force: true });

    cy.log("wait for core");
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(2);

      expect(errorWarnings.warnings[0].message).contain(
        "Haven't implemented circle through 2 points in case where don't have numerical values",
      );
      expect(errorWarnings.warnings[0].level).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(43);

      expect(errorWarnings.warnings[1].message).contain(
        "Can't change radius of circle with non-numerical through points",
      );
      expect(errorWarnings.warnings[1].level).eq(2);
      expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(43);
    });
  });

  it("From validating attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <sequence type="bad" />

  <math name="m1">sin(x)</math>
  <math format="new1" name="m2">sin(x)</math>
  <math name="m3" copysource="m1" />
  <math name="m4" format="new2" copysource="m1" />
  <math name="m5" format="latex" copysource="m1" />
  <math name="m6" copysource="m2" />
  <math name="m7" format="new3" copysource="m2" />
  <math name="m8" format="latex" copysource="m2" />


  <textinput name="ti1">$m1.format</textinput>
  <textinput name="ti2">$m2.format</textinput>
  <textinput name="ti3">$m3.format</textinput>
  <textinput name="ti4">$m4.format</textinput>
  <textinput name="ti5">$m5.format</textinput>
  <textinput name="ti6">$m6.format</textinput>
  <textinput name="ti7">$m7.format</textinput>
  <textinput name="ti8">$m8.format</textinput>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sinx");
    cy.get(cesc2("#/m6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sinx");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(5);

      expect(errorWarnings.warnings[0].message).contain(
        "Invalid value new1 for attribute format",
      );
      expect(errorWarnings.warnings[0].level).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(5);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(45);

      expect(errorWarnings.warnings[1].message).contain(
        "Invalid value bad for attribute type",
      );
      expect(errorWarnings.warnings[1].level).eq(2);
      expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(25);

      expect(errorWarnings.warnings[2].message).contain(
        "Invalid value new2 for attribute format",
      );
      expect(errorWarnings.warnings[2].level).eq(2);
      expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(7);
      expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(50);

      expect(errorWarnings.warnings[3].message).contain(
        "Invalid value new1 for attribute format",
      );
      expect(errorWarnings.warnings[3].level).eq(2);
      expect(errorWarnings.warnings[3].doenetMLrange.lineBegin).eq(9);
      expect(errorWarnings.warnings[3].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[3].doenetMLrange.lineEnd).eq(9);
      expect(errorWarnings.warnings[3].doenetMLrange.charEnd).eq(36);

      expect(errorWarnings.warnings[4].message).contain(
        "Invalid value new3 for attribute format",
      );
      expect(errorWarnings.warnings[4].level).eq(2);
      expect(errorWarnings.warnings[4].doenetMLrange.lineBegin).eq(10);
      expect(errorWarnings.warnings[4].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[4].doenetMLrange.lineEnd).eq(10);
      expect(errorWarnings.warnings[4].doenetMLrange.charEnd).eq(50);
    });

    cy.log("try to change fromta");
    cy.get(cesc2("#/ti1_input")).clear().type("try1{enter}");
    cy.get(cesc2("#/ti2_input")).clear().type("try2{enter}");
    cy.get(cesc2("#/ti3_input")).clear().type("try3{enter}");
    cy.get(cesc2("#/ti4_input")).clear().type("try4{enter}");
    cy.get(cesc2("#/ti5_input")).clear().type("try5{enter}");
    cy.get(cesc2("#/ti6_input")).clear().type("try6{enter}");
    cy.get(cesc2("#/ti7_input")).clear().type("try7{enter}");
    cy.get(cesc2("#/ti8_input")).clear().type("try8{enter}");

    cy.get(cesc2("#/m8") + " .mjx-mrow").should("contain.text", "sin(x)");

    cy.get(cesc2("#/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");
    cy.get(cesc2("#/m8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "sin(x)");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(17);

      expect(errorWarnings.warnings[5].message).contain(
        "Invalid value try1 for attribute format",
      );
      expect(errorWarnings.warnings[5].doenetMLrange.lineBegin).eq(4);

      expect(errorWarnings.warnings[6].message).contain(
        "Invalid value new2 for attribute format",
      );
      expect(errorWarnings.warnings[6].doenetMLrange.lineBegin).eq(7);

      expect(errorWarnings.warnings[7].message).contain(
        "Invalid value try2 for attribute format",
      );
      expect(errorWarnings.warnings[7].doenetMLrange.lineBegin).eq(5);

      expect(errorWarnings.warnings[8].message).contain(
        "Invalid value try2 for attribute format",
      );
      expect(errorWarnings.warnings[8].doenetMLrange.lineBegin).eq(9);

      expect(errorWarnings.warnings[9].message).contain(
        "Invalid value try3 for attribute format",
      );
      expect(errorWarnings.warnings[9].doenetMLrange.lineBegin).eq(6);

      expect(errorWarnings.warnings[10].message).contain(
        "Invalid value new2 for attribute format",
      );
      expect(errorWarnings.warnings[10].doenetMLrange.lineBegin).eq(7);

      expect(errorWarnings.warnings[11].message).contain(
        "Invalid value try4 for attribute format",
      );
      expect(errorWarnings.warnings[11].doenetMLrange.lineBegin).eq(7);

      expect(errorWarnings.warnings[12].message).contain(
        "Invalid value try5 for attribute format",
      );
      expect(errorWarnings.warnings[12].doenetMLrange.lineBegin).eq(8);

      expect(errorWarnings.warnings[13].message).contain(
        "Invalid value try6 for attribute format",
      );
      expect(errorWarnings.warnings[13].doenetMLrange.lineBegin).eq(5);

      expect(errorWarnings.warnings[14].message).contain(
        "Invalid value try6 for attribute format",
      );
      expect(errorWarnings.warnings[14].doenetMLrange.lineBegin).eq(9);

      expect(errorWarnings.warnings[15].message).contain(
        "Invalid value try7 for attribute format",
      );
      expect(errorWarnings.warnings[15].doenetMLrange.lineBegin).eq(10);

      expect(errorWarnings.warnings[16].message).contain(
        "Invalid value try8 for attribute format",
      );
      expect(errorWarnings.warnings[16].doenetMLrange.lineBegin).eq(11);
    });
  });

  it("From action", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <number name="n">1</number>
  <updateValue target="n.bad" newValue="3" name="uv" />
  <booleaninput name="bi" /><boolean copySource="bi" name="b" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/b")).should("have.text", "false");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(0);
    });

    cy.log("try update value action");
    cy.get(cesc2("#/uv")).click();

    cy.log("wait for core");
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(1);

      expect(errorWarnings.warnings[0].message).contain(
        `Cannot update prop="bad" of n as could not find prop bad on a component of type number`,
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(3);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(55);
    });
  });

  it("Invalid children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p name="p1"><graph /></p>

  <p name="p2">Hello</p>

  <p name="p3" copySource="p2"><graph/></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/p2")).should("have.text", "Hello");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(2);

      expect(errorWarnings.warnings[0].message).contain(
        `Invalid children for /p1`,
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(28);

      expect(errorWarnings.warnings[1].message).contain(
        `Invalid children for /p3`,
      );
      expect(errorWarnings.warnings[1].level).eq(1);
      expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(6);
      expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(43);
    });
  });
});
