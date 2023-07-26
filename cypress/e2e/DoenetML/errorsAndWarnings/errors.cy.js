import { cesc2 } from "../../../../src/_utils/url";

describe("Error Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("Mismatched tags at base level", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<math name="good">x+y</math>

<math name="bad">a+b</number>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/good") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+y");
    cy.get(cesc2("#/bad") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "a+b");
    cy.get(cesc2("#/__error1")).should("contain.text", "Invalid DoenetML");
    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "Mismatched closing tag",
    );
    cy.get(cesc2("#/__error1")).should("contain.text", "Expected </math>");
    cy.get(cesc2("#/__error1")).should("contain.text", "Found </number>");
    cy.get(cesc2("#/__error1")).should("contain.text", "line 4");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(1);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain("Mismatched closing tag");
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(21);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(4);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(29);
    });
  });

  it("Mismatched tags in section, later tags outside survive", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<section name="sec">
  <math name="good">x+y</math>
  <math name="bad">a+b</number>
</section>
<math>x</math>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/good") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x+y");
    cy.get(cesc2("#/bad") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "a+b");
    cy.get(cesc2("#/__error1")).should("contain.text", "Invalid DoenetML");
    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "Mismatched closing tag",
    );
    cy.get(cesc2("#/__error1")).should("contain.text", "Expected </math>");
    cy.get(cesc2("#/__error1")).should("contain.text", "Found </number>");
    cy.get(cesc2("#/__error1")).should("contain.text", "line 4");

    cy.log(
      "confirm tag after section survive and component counting continues",
    );
    cy.get(cesc2("#/_math3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(1);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain("Mismatched closing tag");
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(23);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(4);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(31);
    });
  });

  it("More parsing errors", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<p>
  <math name="m1">y

    </p>
       
</hmm>

<p h="abc"

<section name="sec">

  <p>Hello there!</p>

  <circle radius="1" radius="2" />
  <rectangle hide hide name="rect" />
  <apple q="a" q="b" name="ap">hi</apple>
  <banana bad bad>bye</banana>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");
    cy.get(cesc2("#/__error1")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/__error1")).should("contain.text", "Expected </math>");
    cy.get(cesc2("#/__error1")).should("contain.text", "lines 3–5");
    cy.get(cesc2("#/__error2")).should("contain.text", "Found </");
    cy.get(cesc2("#/__error2")).should("contain.text", "line 7");
    cy.get(cesc2("#/_p2")).should("contain.text", "Error in opening <p> tag");
    cy.get(cesc2("#/_p2")).should("contain.text", `Found <p h="abc"`);
    cy.get(cesc2("#/_p2")).should("contain.text", "line 9");

    cy.get(cesc2("#/__error3")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/__error3")).should("contain.text", "Expected </section>");
    cy.get(cesc2("#/__error3")).should("contain.text", "lines 11–19");
    cy.get(cesc2("#/sec_title")).should("have.text", "Section 1");
    cy.get(cesc2("#/_p3")).should("have.text", "Hello there!");

    cy.get(cesc2("#/_circle1")).should(
      "contain.text",
      "Duplicate attribute radius.",
    );
    cy.get(cesc2("#/_circle1")).should("contain.text", "line 15");
    cy.get(cesc2("#/rect")).should("contain.text", "Duplicate attribute hide.");
    cy.get(cesc2("#/rect")).should("contain.text", "line 16");
    cy.get(cesc2("#/ap")).should("contain.text", "Duplicate attribute q.");
    cy.get(cesc2("#/ap")).should("contain.text", " line 17");
    cy.get(cesc2("#/_banana1")).should(
      "contain.text",
      "Duplicate attribute bad.",
    );
    cy.get(cesc2("#/_banana1")).should("contain.text", "line 18");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(8);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain("Missing closing tag");
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(5);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(4);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(4);

      expect(errorWarnings.errors[1].message).contain("Found </");
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(7);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(2);

      expect(errorWarnings.errors[2].message).contain(
        "Error in opening <p> tag",
      );
      expect(errorWarnings.errors[2].doenetMLrange.lineBegin).eq(9);
      expect(errorWarnings.errors[2].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[2].doenetMLrange.lineEnd).eq(9);
      expect(errorWarnings.errors[2].doenetMLrange.charEnd).eq(10);

      expect(errorWarnings.errors[3].message).contain(
        "Duplicate attribute radius",
      );
      expect(errorWarnings.errors[3].doenetMLrange.lineBegin).eq(15);
      expect(errorWarnings.errors[3].doenetMLrange.charBegin).eq(22);
      expect(errorWarnings.errors[3].doenetMLrange.lineEnd).eq(15);
      expect(errorWarnings.errors[3].doenetMLrange.charEnd).eq(31);

      expect(errorWarnings.errors[4].message).contain(
        "Duplicate attribute hide",
      );
      expect(errorWarnings.errors[4].doenetMLrange.lineBegin).eq(16);
      expect(errorWarnings.errors[4].doenetMLrange.charBegin).eq(19);
      expect(errorWarnings.errors[4].doenetMLrange.lineEnd).eq(16);
      expect(errorWarnings.errors[4].doenetMLrange.charEnd).eq(22);

      expect(errorWarnings.errors[5].message).contain("Duplicate attribute q");
      expect(errorWarnings.errors[5].doenetMLrange.lineBegin).eq(17);
      expect(errorWarnings.errors[5].doenetMLrange.charBegin).eq(16);
      expect(errorWarnings.errors[5].doenetMLrange.lineEnd).eq(17);
      expect(errorWarnings.errors[5].doenetMLrange.charEnd).eq(20);

      expect(errorWarnings.errors[6].message).contain(
        "Duplicate attribute bad",
      );
      expect(errorWarnings.errors[6].doenetMLrange.lineBegin).eq(18);
      expect(errorWarnings.errors[6].doenetMLrange.charBegin).eq(15);
      expect(errorWarnings.errors[6].doenetMLrange.lineEnd).eq(18);
      expect(errorWarnings.errors[6].doenetMLrange.charEnd).eq(17);

      expect(errorWarnings.errors[7].message).contain("Missing closing tag");
      expect(errorWarnings.errors[7].doenetMLrange.lineBegin).eq(19);
      expect(errorWarnings.errors[7].doenetMLrange.charBegin).eq(2);
      expect(errorWarnings.errors[7].doenetMLrange.lineEnd).eq(19);
      expect(errorWarnings.errors[7].doenetMLrange.charEnd).eq(2);
    });
  });

  it("Parsing errors, correctly find end of self-closing tag", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<abc />
  <bcd   />
<cde  
/>
    <def 
   
/>
<efg
 />
<fgh
a />
<ghi
 a  />

  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_abc1")).should("contain.text", "line 2");
    cy.get(cesc2("#/_bcd1")).should("contain.text", "line 3");
    cy.get(cesc2("#/_cde1")).should("contain.text", "lines 4–5");
    cy.get(cesc2("#/_def1")).should("contain.text", "lines 6–8.");
    cy.get(cesc2("#/_efg1")).should("contain.text", "lines 9–10");
    cy.get(cesc2("#/_fgh1")).should("contain.text", "lines 11–12");
    cy.get(cesc2("#/_ghi1")).should("contain.text", "lines 13–14");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(7);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        "Invalid component type: <abc>",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(7);

      expect(errorWarnings.errors[1].message).contain(
        "Invalid component type: <bcd>",
      );
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(3);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(11);

      expect(errorWarnings.errors[2].message).contain(
        "Invalid component type: <cde>",
      );
      expect(errorWarnings.errors[2].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.errors[2].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[2].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.errors[2].doenetMLrange.charEnd).eq(2);

      expect(errorWarnings.errors[3].message).contain(
        "Invalid component type: <def>",
      );
      expect(errorWarnings.errors[3].doenetMLrange.lineBegin).eq(6);
      expect(errorWarnings.errors[3].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.errors[3].doenetMLrange.lineEnd).eq(8);
      expect(errorWarnings.errors[3].doenetMLrange.charEnd).eq(2);

      expect(errorWarnings.errors[4].message).contain(
        "Invalid component type: <efg>",
      );
      expect(errorWarnings.errors[4].doenetMLrange.lineBegin).eq(9);
      expect(errorWarnings.errors[4].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[4].doenetMLrange.lineEnd).eq(10);
      expect(errorWarnings.errors[4].doenetMLrange.charEnd).eq(3);

      expect(errorWarnings.errors[5].message).contain(
        "Invalid component type: <fgh>",
      );
      expect(errorWarnings.errors[5].doenetMLrange.lineBegin).eq(11);
      expect(errorWarnings.errors[5].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[5].doenetMLrange.lineEnd).eq(12);
      expect(errorWarnings.errors[5].doenetMLrange.charEnd).eq(4);

      expect(errorWarnings.errors[6].message).contain(
        "Invalid component type: <ghi>",
      );
      expect(errorWarnings.errors[6].doenetMLrange.lineBegin).eq(13);
      expect(errorWarnings.errors[6].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[6].doenetMLrange.lineEnd).eq(14);
      expect(errorWarnings.errors[6].doenetMLrange.charEnd).eq(6);
    });
  });

  it("Errors bubble up to where can be displayed", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<text>
  <text>
    hello!
    <a>
  </text>
</text>

<graph>
  <point coords="(4,5)"
</graph>

<point>(1,2)</point>
<text>afterwards</text>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("contain.text", "hello!");
    cy.get(cesc2("#/__error1")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/__error1")).should("contain.text", "Expected </a>");
    cy.get(cesc2("#/__error1")).should("contain.text", "lines 5–6");
    cy.get(cesc2("#/_a1")).should(
      "contain.text",
      "Invalid component type: <a>",
    );
    cy.get(cesc2("#/_a1")).should("contain.text", "lines 5–6");

    cy.get(cesc2("#/__error2")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/__error2")).should("contain.text", "Expected </point>");
    cy.get(cesc2("#/__error2")).should("contain.text", "line 10");

    cy.get(cesc2("#/_point1")).should(
      "contain.text",
      "Error in opening <point> tag",
    );
    cy.get(cesc2("#/_point1")).should(
      "contain.text",
      `Found <point coords="(4,5)"`,
    );
    cy.get(cesc2("#/_point1")).should("contain.text", "line 10");

    cy.get(cesc2("#/_point2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,2)");
    cy.get(cesc2("#/_text3")).should("have.text", "afterwards");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(4);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain("Missing closing tag");
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(6);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(2);

      expect(errorWarnings.errors[1].message).contain(
        "Error in opening <point> tag",
      );
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(10);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(10);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(23);

      expect(errorWarnings.errors[2].message).contain("Missing closing tag");
      expect(errorWarnings.errors[2].doenetMLrange.lineBegin).eq(10);
      expect(errorWarnings.errors[2].doenetMLrange.charBegin).eq(24);
      expect(errorWarnings.errors[2].doenetMLrange.lineEnd).eq(10);
      expect(errorWarnings.errors[2].doenetMLrange.charEnd).eq(24);

      expect(errorWarnings.errors[3].message).contain(
        "Invalid component type: <a>",
      );
      expect(errorWarnings.errors[3].doenetMLrange.lineBegin).eq(5);
      expect(errorWarnings.errors[3].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.errors[3].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.errors[3].doenetMLrange.charEnd).eq(2);
    });
  });

  it("Naming errors", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<p name="_p" />
    <p name="p@" />
<p name="p">Hello</p>
<p name="p">
  Bye
</p >
<p>afterwards</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "Invalid component name: _p",
    );
    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "Component name must begin with a letter",
    );
    cy.get(cesc2("#/__error1")).should("contain.text", "line 2");
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "Invalid component name: p@",
    );
    cy.get(cesc2("#/__error2")).should("contain.text", "line 3");
    cy.get(cesc2("#/p")).should("have.text", "Hello");
    cy.get(cesc2("#/__error3")).should(
      "contain.text",
      "Duplicate component name: p",
    );
    cy.get(cesc2("#/__error3")).should("contain.text", "lines 5–7");
    cy.get(cesc2("#/_p5")).should("have.text", "afterwards");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(3);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        "Invalid component name: _p",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(15);

      expect(errorWarnings.errors[1].message).contain(
        "Invalid component name: p@",
      );
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(3);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(19);

      expect(errorWarnings.errors[2].message).contain(
        "Duplicate component name: p",
      );
      expect(errorWarnings.errors[2].doenetMLrange.lineBegin).eq(5);
      expect(errorWarnings.errors[2].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[2].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.errors[2].doenetMLrange.charEnd).eq(5);
    });
  });

  it("assignNames errors", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<group assignNames="(_a _b)" /><group assignNames="a/ b%" name="g2" />
<group assignNames="a) b" name="g3" />   <group assignNames="a b (c a)" />

<group assignNames="a b" assignnames="c d" name="g5" />
<group assignNames="e f">
  <text>cat</text><text>dog</text>
</group>
<group assignNames="f g" />
<p assignNames="h" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_group1")).should(
      "contain.text",
      "Invalid assignNames: (_a _b)",
    );
    cy.get(cesc2("#/_group1")).should(
      "contain.text",
      "All assigned names must begin with a letter",
    );
    cy.get(cesc2("#/_group1")).should("contain.text", "line 2");
    cy.get(cesc2("#/g2")).should("contain.text", "Invalid assignNames: a/ b%");
    cy.get(cesc2("#/g2")).should("contain.text", "line 2");
    cy.get(cesc2("#/g3")).should(
      "contain.text",
      "Invalid format for assignNames: a) b",
    );
    cy.get(cesc2("#/g3")).should("contain.text", "line 3");
    cy.get(cesc2("#/_group4")).should(
      "contain.text",
      "A name is duplicated in assignNames: a b (c a)",
    );
    cy.get(cesc2("#/_group4")).should("contain.text", "line 3");
    cy.get(cesc2("#/g5")).should(
      "contain.text",
      "Cannot define assignNames twice for a component",
    );
    cy.get(cesc2("#/g5")).should("contain.text", "line 5");
    cy.get(cesc2("#/e")).should("have.text", "cat");
    cy.get(cesc2("#/f")).should("have.text", "dog");
    cy.get(cesc2("#/_group7")).should(
      "contain.text",
      "Duplicate component name: f",
    );
    cy.get(cesc2("#/_group7")).should("contain.text", "Found in assignNames");
    cy.get(cesc2("#/_group7")).should("contain.text", "line 9");
    cy.get(cesc2("#/_p1")).should(
      "contain.text",
      "Cannot assign names for component type p",
    );
    cy.get(cesc2("#/_p1")).should("contain.text", "line 10");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(7);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        "Invalid assignNames: (_a _b)",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(31);

      expect(errorWarnings.errors[1].message).contain(
        "Invalid assignNames: a/ b%",
      );
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(32);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(70);

      expect(errorWarnings.errors[2].message).contain(
        "Invalid format for assignNames: a) b",
      );
      expect(errorWarnings.errors[2].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.errors[2].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[2].doenetMLrange.lineEnd).eq(3);
      expect(errorWarnings.errors[2].doenetMLrange.charEnd).eq(38);

      expect(errorWarnings.errors[3].message).contain(
        "A name is duplicated in assignNames: a b (c a)",
      );
      expect(errorWarnings.errors[3].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.errors[3].doenetMLrange.charBegin).eq(42);
      expect(errorWarnings.errors[3].doenetMLrange.lineEnd).eq(3);
      expect(errorWarnings.errors[3].doenetMLrange.charEnd).eq(74);

      expect(errorWarnings.errors[4].message).contain(
        "Cannot define assignNames twice for a component",
      );
      expect(errorWarnings.errors[4].doenetMLrange.lineBegin).eq(5);
      expect(errorWarnings.errors[4].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[4].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.errors[4].doenetMLrange.charEnd).eq(55);

      expect(errorWarnings.errors[5].message).contain(
        "Duplicate component name: f",
      );
      expect(errorWarnings.errors[5].doenetMLrange.lineBegin).eq(9);
      expect(errorWarnings.errors[5].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[5].doenetMLrange.lineEnd).eq(9);
      expect(errorWarnings.errors[5].doenetMLrange.charEnd).eq(27);

      expect(errorWarnings.errors[6].message).contain(
        "Cannot assign names for component type p",
      );
      expect(errorWarnings.errors[6].doenetMLrange.lineBegin).eq(10);
      expect(errorWarnings.errors[6].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[6].doenetMLrange.lineEnd).eq(10);
      expect(errorWarnings.errors[6].doenetMLrange.charEnd).eq(21);
    });
  });

  it("Invalid attribute errors", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>Good</p>
    <p bad="not good">Unhappy</p>
    <p>Good again</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_p1")).should("have.text", "Good");
    cy.get(cesc2("#/_p2")).should(
      "contain.text",
      `Invalid attribute "bad" for a component of type <p>`,
    );
    cy.get(cesc2("#/_p2")).should("contain.text", "line 3");
    cy.get(cesc2("#/_p3")).should("have.text", "Good again");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(1);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        `Invalid attribute "bad" for a component of type <p>`,
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(3);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(33);
    });
  });

  it("Invalid source errors", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `


    <copy source />
    <copy source="__s" />


    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_copy1")).should(
      "contain.text",
      "Must supply value for source",
    );
    cy.get(cesc2("#/_copy1")).should("contain.text", "line 4");

    // TODO: what should this error actually say?
    cy.get(cesc2("#/_copy2")).should(
      "contain.text",
      "Invalid reference target: __s",
    );
    cy.get(cesc2("#/_copy2")).should("contain.text", "line 5");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(2);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        "Must supply value for source",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(4);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(19);

      expect(errorWarnings.errors[1].message).contain(
        "Invalid reference target: __s",
      );
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(5);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(25);
    });
  });

  it("Circular references with copy source", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<math copySource="a1" name="a1" />

<math copySource="b1" name="b2" />
<math copySource="b2" name="b1" />

<math copySource="c1" name="c2" />
<math copySource="c2" name="c3" />
<math copySource="c3" name="c1" />

<math copySource="d1" name="d2" />
<math copySource="d2" name="d3" />
<math copySource="d3" name="d4" />
<math copySource="d4" name="d1" />

<math copySource="e1" name="e2" />
<math copySource="e2" name="e3" />
<math copySource="e3" name="e4" />
<math copySource="e4" name="e5" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Circular dependency involving these components: <math> (line 2).Found on line 2",
    );

    // temporary messages until can better detect circular references with copysource
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Possible circular dependency involving these components: <math> (line 5).Found on line 4",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Possible circular dependency involving these components: <math> (line 9).Found on line 7",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Possible circular dependency involving these components: <math> (line 14).Found on line 11",
    );
    cy.get(cesc2("#/_document1")).should(
      "not.contain.text",
      "Found on line 16",
    );

    cy.get(cesc2("#/e2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "＿");
    cy.get(cesc2("#/e3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "＿");
    cy.get(cesc2("#/e4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "＿");
    cy.get(cesc2("#/e5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "＿");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(4);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        "Circular dependency involving these components: <math> (line 2)",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(34);

      expect(errorWarnings.errors[1].message).contain(
        "Possible circular dependency involving these components: <math> (line 5)",
      );
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(4);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(34);

      expect(errorWarnings.errors[2].message).contain(
        "Possible circular dependency involving these components: <math> (line 9)",
      );
      expect(errorWarnings.errors[2].doenetMLrange.lineBegin).eq(7);
      expect(errorWarnings.errors[2].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[2].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.errors[2].doenetMLrange.charEnd).eq(34);

      expect(errorWarnings.errors[3].message).contain(
        "Possible circular dependency involving these components: <math> (line 14)",
      );
      expect(errorWarnings.errors[3].doenetMLrange.lineBegin).eq(11);
      expect(errorWarnings.errors[3].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[3].doenetMLrange.lineEnd).eq(11);
      expect(errorWarnings.errors[3].doenetMLrange.charEnd).eq(34);
    });
  });

  it("Circular references with macro children", () => {
    let doenetML1 = `<text name="t1">$t1</text`;

    let doenetML2 = `<text name="t1">$t2</text>
      <text name="t2">$t1</text>`;

    let doenetML3 = `<text name="t1">$t2</text>
      <text name="t2">$t3</text>
      <text name="t3">$t1</text>`;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: doenetML1,
        },
        "*",
      );
    });

    cy.document().should(
      "contain.text",
      "Circular dependency involving these components: <text> (line 1).",
    );

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: doenetML2,
        },
        "*",
      );
    });

    cy.document().should(
      "contain.text",
      "Circular dependency involving these components: <text> (line 1), <text> (line 2).",
    );

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: doenetML3,
        },
        "*",
      );
    });

    cy.document().should(
      "contain.text",
      "Circular dependency involving these components: <text> (line 1), <text> (line 2), <text> (line 3).",
    );
  });

  it("Errors in macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<!-- make sure get right character numbers after comment -->
$A{assignNames="a" assignnames="b"}
<p>
  <!-- make sure get right character numbers after comment -->
  $B{a="b" a="c"}
    $$f{b b}(x)
      $C{d="b"
  d}
</p>
     $D{a="$b{c c}"}
   $$g{prop="a"}(x)
 $E{a="$b{c='$d{e e}'}"}


    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Error in macro: cannot repeat assignNames",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found: $A{assignNames="a" assignnames="b"}`,
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "line 3");

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute a",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found: $B{a="b" a="c"}`,
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "line 6");

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute b",
    );
    cy.get(cesc2("#/_document1")).should("contain.text", `Found: $$f{b b}`);
    cy.get(cesc2("#/_document1")).should("contain.text", "line 7");

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute d",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found: $C{d="b"\n  d}`,
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "lines 8–9");

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute c",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found: $D{a="$b{c c}"}`,
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "line 11");

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Error in macro: macro cannot directly add attributes prop, propIndex, or componentIndex",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found: $$g{prop="a"}`,
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "line 12");

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute e",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found: $E{a="$b{c='$d{e e}'}"}`,
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "line 13");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(7);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain("Duplicate attribute a");
      expect(errorWarnings.errors[0].message).contain(`Found: $B{a="b" a="c"}`);
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(6);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(17);

      expect(errorWarnings.errors[1].message).contain("Duplicate attribute b");
      expect(errorWarnings.errors[1].message).contain("Found: $$f{b b}");
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(7);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(12);

      expect(errorWarnings.errors[2].message).contain("Duplicate attribute d");
      expect(errorWarnings.errors[2].message).contain(`Found: $C{d="b"\n  d}`);
      expect(errorWarnings.errors[2].doenetMLrange.lineBegin).eq(8);
      expect(errorWarnings.errors[2].doenetMLrange.charBegin).eq(7);
      expect(errorWarnings.errors[2].doenetMLrange.lineEnd).eq(9);
      expect(errorWarnings.errors[2].doenetMLrange.charEnd).eq(4);

      expect(errorWarnings.errors[3].message).contain(
        "cannot repeat assignNames",
      );
      expect(errorWarnings.errors[3].message).contain(
        `Found: $A{assignNames="a" assignnames="b"}`,
      );
      expect(errorWarnings.errors[3].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.errors[3].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[3].doenetMLrange.lineEnd).eq(3);
      expect(errorWarnings.errors[3].doenetMLrange.charEnd).eq(35);

      expect(errorWarnings.errors[4].message).contain("Duplicate attribute c");
      expect(errorWarnings.errors[4].message).contain(`Found: $D{a="$b{c c}"}`);
      expect(errorWarnings.errors[4].doenetMLrange.lineBegin).eq(11);
      expect(errorWarnings.errors[4].doenetMLrange.charBegin).eq(6);
      expect(errorWarnings.errors[4].doenetMLrange.lineEnd).eq(11);
      expect(errorWarnings.errors[4].doenetMLrange.charEnd).eq(20);

      expect(errorWarnings.errors[5].message).contain(
        "macro cannot directly add attributes prop, propIndex, or componentIndex",
      );
      expect(errorWarnings.errors[5].message).contain(`Found: $$g{prop="a"}`);
      expect(errorWarnings.errors[5].doenetMLrange.lineBegin).eq(12);
      expect(errorWarnings.errors[5].doenetMLrange.charBegin).eq(4);
      expect(errorWarnings.errors[5].doenetMLrange.lineEnd).eq(12);
      expect(errorWarnings.errors[5].doenetMLrange.charEnd).eq(16);

      expect(errorWarnings.errors[6].message).contain("Duplicate attribute e");
      expect(errorWarnings.errors[6].message).contain(
        `Found: $E{a="$b{c='$d{e e}'}"}`,
      );
      expect(errorWarnings.errors[6].doenetMLrange.lineBegin).eq(13);
      expect(errorWarnings.errors[6].doenetMLrange.charBegin).eq(2);
      expect(errorWarnings.errors[6].doenetMLrange.lineEnd).eq(13);
      expect(errorWarnings.errors[6].doenetMLrange.charEnd).eq(24);
    });
  });

  it("Get line/char numbers with no linebreaks", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `<bad>`,
        },
        "*",
      );
    });

    cy.get(cesc2("#/__error1")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/__error1")).should("contain.text", "Expected </bad>");
    cy.get(cesc2("#/__error1")).should("contain.text", "line 1");

    cy.get(cesc2("#/_bad1")).should(
      "contain.text",
      "Invalid component type: <bad>",
    );
    cy.get(cesc2("#/_bad1")).should("contain.text", "line 1");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(2);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain("Missing closing tag");
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(1);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(1);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(5);

      expect(errorWarnings.errors[1].message).contain(
        "Invalid component type: <bad>",
      );
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(1);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(1);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(5);
    });
  });

  it("Copy section with an error", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<section name="sec">
  <p>
</section>

<section copySource="sec" name="sec2" />
`,
        },
        "*",
      );
    });

    cy.get(cesc2("#/__error1")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/__error1")).should("contain.text", "Expected </p>");
    cy.get(cesc2("#/__error1")).should("contain.text", "line 3");

    cy.get(cesc2("#/sec2")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/sec2")).should("contain.text", "Expected </p>");
    cy.get(cesc2("#/sec2")).should("contain.text", "line 3");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(1);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain("Missing closing tag");
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(6);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(3);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(6);
    });
  });

  it("Error when copying a composite", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <group name='g'>
          <p name="p">first</p>
        </group>
        
        <group copySource="g" newNamespace name="g2" >
          <p name="p">collision</p>
        </group>
`,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate component name: p",
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "line 7");

    cy.get(cesc2("#/p")).should("have.text", "first");
    cy.get(cesc2("#/g2/p")).should("have.text", "first");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(1);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        "Duplicate component name: p",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(7);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(11);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(35);
    });
  });
});
