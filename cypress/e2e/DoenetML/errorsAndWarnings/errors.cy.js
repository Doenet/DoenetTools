import { cesc2 } from "../../../../src/_utils/url";

describe("Error Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("mismatched tags at base level", () => {
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
    cy.get(cesc2("#/_document1")).should("contain.text", "Invalid DoenetML");
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Mismatched closing tag",
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "Expected </math>");
    cy.get(cesc2("#/_document1")).should("contain.text", "Found </number>");
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "line 4, character 1 through line 4, character 29",
    );

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
<text name="survive">Still here</text>
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
    cy.get(cesc2("#/_document1")).should("contain.text", "Invalid DoenetML");
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Mismatched closing tag",
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "Expected </math>");
    cy.get(cesc2("#/_document1")).should("contain.text", "Found </number>");
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "line 4, character 3 through line 4, character 31",
    );

    cy.get(cesc2("#/survive")).should("have.text", "Still here");

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
  <rectangle hide hide />
  <apple q="a" q="b">hi</apple>
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
    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "line 3, character 3 through line 5, character 4",
    );
    cy.get(cesc2("#/__error2")).should("contain.text", "Found </");
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "line 7, character 1 through line 7, character 2",
    );
    cy.get(cesc2("#/__error3")).should(
      "contain.text",
      "Error in opening <p> tag",
    );
    cy.get(cesc2("#/__error3")).should("contain.text", `Found <p h="abc"`);
    cy.get(cesc2("#/__error3")).should(
      "contain.text",
      "line 9, character 1 through line 9, character 10",
    );

    cy.get(cesc2("#/__error4")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/__error4")).should("contain.text", "Expected </section>");
    cy.get(cesc2("#/__error4")).should(
      "contain.text",
      "line 11, character 1 through line 19, character 2",
    );
    cy.get(cesc2("#/sec_title")).should("have.text", "Section 1");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello there!");

    cy.get(cesc2("#/__error5")).should(
      "contain.text",
      "Duplicate attribute radius.",
    );
    cy.get(cesc2("#/__error5")).should(
      "contain.text",
      "line 15, character 3 through line 15, character 34",
    );
    cy.get(cesc2("#/__error6")).should(
      "contain.text",
      "Duplicate attribute hide.",
    );
    cy.get(cesc2("#/__error6")).should(
      "contain.text",
      "Duplicate attribute hide.",
    );
    cy.get(cesc2("#/__error6")).should(
      "contain.text",
      "line 16, character 3 through line 16, character 25",
    );
    cy.get(cesc2("#/__error7")).should(
      "contain.text",
      "Duplicate attribute q.",
    );
    cy.get(cesc2("#/__error7")).should(
      "contain.text",
      " line 17, character 3 through line 17, character 31",
    );
    cy.get(cesc2("#/__error8")).should(
      "contain.text",
      "Duplicate attribute bad.",
    );
    cy.get(cesc2("#/__error8")).should(
      "contain.text",
      "line 18, character 3 through line 18, character 30",
    );

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

    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "line 2, character 1 through line 2, character 7",
    );
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "line 3, character 3 through line 3, character 11",
    );
    cy.get(cesc2("#/__error3")).should(
      "contain.text",
      "line 4, character 1 through line 5, character 2",
    );
    cy.get(cesc2("#/__error4")).should(
      "contain.text",
      "line 6, character 5 through line 8, character 2.",
    );
    cy.get(cesc2("#/__error5")).should(
      "contain.text",
      "line 9, character 1 through line 10, character 3",
    );
    cy.get(cesc2("#/__error6")).should(
      "contain.text",
      "line 11, character 1 through line 12, character 4",
    );
    cy.get(cesc2("#/__error7")).should(
      "contain.text",
      "line 13, character 1 through line 14, character 6",
    );

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(7);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        "Invalid component type: abc",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(7);

      expect(errorWarnings.errors[1].message).contain(
        "Invalid component type: bcd",
      );
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(3);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(11);

      expect(errorWarnings.errors[2].message).contain(
        "Invalid component type: cde",
      );
      expect(errorWarnings.errors[2].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.errors[2].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[2].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.errors[2].doenetMLrange.charEnd).eq(2);

      expect(errorWarnings.errors[3].message).contain(
        "Invalid component type: def",
      );
      expect(errorWarnings.errors[3].doenetMLrange.lineBegin).eq(6);
      expect(errorWarnings.errors[3].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.errors[3].doenetMLrange.lineEnd).eq(8);
      expect(errorWarnings.errors[3].doenetMLrange.charEnd).eq(2);

      expect(errorWarnings.errors[4].message).contain(
        "Invalid component type: efg",
      );
      expect(errorWarnings.errors[4].doenetMLrange.lineBegin).eq(9);
      expect(errorWarnings.errors[4].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[4].doenetMLrange.lineEnd).eq(10);
      expect(errorWarnings.errors[4].doenetMLrange.charEnd).eq(3);

      expect(errorWarnings.errors[5].message).contain(
        "Invalid component type: fgh",
      );
      expect(errorWarnings.errors[5].doenetMLrange.lineBegin).eq(11);
      expect(errorWarnings.errors[5].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[5].doenetMLrange.lineEnd).eq(12);
      expect(errorWarnings.errors[5].doenetMLrange.charEnd).eq(4);

      expect(errorWarnings.errors[6].message).contain(
        "Invalid component type: ghi",
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
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("contain.text", "hello!");
    cy.get(cesc2("#/__error1")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/__error1")).should("contain.text", "Expected </a>");
    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "line 5, character 5 through line 6, character 2",
    );
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "Invalid component type: a",
    );
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "line 5, character 5 through line 6, character 2",
    );

    cy.get(cesc2("#/__error3")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/__error3")).should("contain.text", "Expected </point>");
    cy.get(cesc2("#/__error3")).should(
      "contain.text",
      "line 10, character 3 through line 10, character 23",
    );

    cy.get(cesc2("#/__error4")).should(
      "contain.text",
      "Error in opening <point> tag",
    );
    cy.get(cesc2("#/__error4")).should(
      "contain.text",
      `Found <point coords="(4,5)"`,
    );
    cy.get(cesc2("#/__error4")).should(
      "contain.text",
      "line 10, character 3 through line 10, character 23",
    );

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
        "Invalid component type: a",
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
    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "line 2, character 1 through line 2, character 15",
    );
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "Invalid component name: p@",
    );
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "line 3, character 5 through line 3, character 19",
    );
    cy.get(cesc2("#/p")).should("have.text", "Hello");
    cy.get(cesc2("#/__error3")).should(
      "contain.text",
      "Duplicate component name p",
    );
    cy.get(cesc2("#/__error3")).should(
      "contain.text",
      "line 5, character 1 through line 7, character 5",
    );

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
        "Duplicate component name p",
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
<group assignNames="(_a _b)" /><group assignNames="a/ b%" />
<group assignNames="a) b" />   <group assignNames="a b (c a)" />

<group assignNames="a b" assignnames="c d" />
<group assignNames="a b">
  <text>cat</text><text>dog</text>
</group>
<group assignNames="b c" />
<p assignNames="h" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "Invalid assignNames: (_a _b)",
    );
    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "All assigned names must begin with a letter",
    );
    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "line 2, character 1 through line 2, character 31",
    );
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "Invalid assignNames: a/ b%",
    );
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "line 2, character 32 through line 2, character 60",
    );
    cy.get(cesc2("#/__error3")).should(
      "contain.text",
      "Invalid format for assignNames: a) b",
    );
    cy.get(cesc2("#/__error3")).should(
      "contain.text",
      "line 3, character 1 through line 3, character 28",
    );
    cy.get(cesc2("#/__error4")).should(
      "contain.text",
      "A name is duplicated in assignNames: a b (c a)",
    );
    cy.get(cesc2("#/__error4")).should(
      "contain.text",
      "line 3, character 32 through line 3, character 64",
    );
    cy.get(cesc2("#/__error5")).should(
      "contain.text",
      "Cannot define assignNames twice for a component",
    );
    cy.get(cesc2("#/__error5")).should(
      "contain.text",
      "line 5, character 1 through line 5, character 45",
    );
    cy.get(cesc2("#/a")).should("have.text", "cat");
    cy.get(cesc2("#/b")).should("have.text", "dog");
    cy.get(cesc2("#/__error6")).should(
      "contain.text",
      "Duplicate component name b",
    );
    cy.get(cesc2("#/__error6")).should("contain.text", "Found in assignNames");
    cy.get(cesc2("#/__error6")).should(
      "contain.text",
      "line 9, character 1 through line 9, character 27",
    );
    cy.get(cesc2("#/__error7")).should(
      "contain.text",
      "Cannot assign names for component type p",
    );
    cy.get(cesc2("#/__error7")).should(
      "contain.text",
      "line 10, character 1 through line 10, character 21",
    );

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
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(60);

      expect(errorWarnings.errors[2].message).contain(
        "Invalid format for assignNames: a) b",
      );
      expect(errorWarnings.errors[2].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.errors[2].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[2].doenetMLrange.lineEnd).eq(3);
      expect(errorWarnings.errors[2].doenetMLrange.charEnd).eq(28);

      expect(errorWarnings.errors[3].message).contain(
        "A name is duplicated in assignNames: a b (c a)",
      );
      expect(errorWarnings.errors[3].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.errors[3].doenetMLrange.charBegin).eq(32);
      expect(errorWarnings.errors[3].doenetMLrange.lineEnd).eq(3);
      expect(errorWarnings.errors[3].doenetMLrange.charEnd).eq(64);

      expect(errorWarnings.errors[4].message).contain(
        "Cannot define assignNames twice for a component",
      );
      expect(errorWarnings.errors[4].doenetMLrange.lineBegin).eq(5);
      expect(errorWarnings.errors[4].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[4].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.errors[4].doenetMLrange.charEnd).eq(45);

      expect(errorWarnings.errors[5].message).contain(
        "Duplicate component name b",
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

    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "Must supply value for source",
    );
    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "line 4, character 5 through line 4, character 19",
    );

    // TODO: what should this error actually say?
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "Invalid reference target: __s",
    );
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "line 5, character 5 through line 5, character 25",
    );

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
      "Circular reference involving component a1.Found at line 2, character 1 through line 2, character 34",
    );

    // temporary messages until can better detect circular references with copysource
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Component b2 references component b1 but component b1 has not been created.  Perhaps this state was created by a circular reference?Found at line 4, character 1 through line 4, character 34",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Component c2 references component c1 but component c1 has not been created.  Perhaps this state was created by a circular reference?Found at line 7, character 1 through line 7, character 34",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Component d2 references component d1 but component d1 has not been created.  Perhaps this state was created by a circular reference?Found at line 11, character 1 through line 11, character 34",
    );
    cy.get(cesc2("#/_document1")).should(
      "not.contain.text",
      "Component e2 references component e1 but component e1 has not been created",
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
        "Circular reference involving component a1",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(2);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(34);

      expect(errorWarnings.errors[1].message).contain(
        "Component b2 references component b1 but component b1 has not been created",
      );
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(4);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(34);

      expect(errorWarnings.errors[2].message).contain(
        "Component c2 references component c1 but component c1 has not been created",
      );
      expect(errorWarnings.errors[2].doenetMLrange.lineBegin).eq(7);
      expect(errorWarnings.errors[2].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[2].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.errors[2].doenetMLrange.charEnd).eq(34);

      expect(errorWarnings.errors[3].message).contain(
        "Component d2 references component d1 but component d1 has not been created",
      );
      expect(errorWarnings.errors[3].doenetMLrange.lineBegin).eq(11);
      expect(errorWarnings.errors[3].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[3].doenetMLrange.lineEnd).eq(11);
      expect(errorWarnings.errors[3].doenetMLrange.charEnd).eq(34);
    });
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
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "line 3, character 1 through line 3, character 35",
    );

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute a",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found: $B{a="b" a="c"}`,
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "line 6, character 3 through line 6, character 17",
    );

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute b",
    );
    cy.get(cesc2("#/_document1")).should("contain.text", `Found: $$f{b b}`);
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "line 7, character 5 through line 7, character 15",
    );

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute d",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found: $C{d="b"\n  d}`,
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "line 8, character 7 through line 9, character 4",
    );

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute c",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found: $D{a="$b{c c}"}`,
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "line 11, character 6 through line 11, character 20",
    );

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Error in macro: macro cannot directly add attributes prop, propIndex, or componentIndex",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found: $$g{prop="a"}`,
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "line 12, character 4 through line 12, character 19",
    );

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute e",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found: $E{a="$b{c='$d{e e}'}"}`,
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "line 13, character 2 through line 13, character 24",
    );

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
    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "line 1, character 1 through line 1, character 5",
    );

    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "Invalid component type: bad",
    );
    cy.get(cesc2("#/__error2")).should(
      "contain.text",
      "line 1, character 1 through line 1, character 5",
    );

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
        "Invalid component type: bad",
      );
      expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(1);
      expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(1);
      expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(5);
    });
  });
});
