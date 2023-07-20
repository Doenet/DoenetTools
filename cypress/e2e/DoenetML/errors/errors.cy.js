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

    cy.get(cesc2("#/survive")).should("have.text", "Still here");
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
    cy.get(cesc2("#/_document1")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/_document1")).should("contain.text", "Expected </math>");
    cy.get(cesc2("#/_document1")).should("contain.text", "Expected </section>");
    cy.get(cesc2("#/_document1")).should("contain.text", "Found </");
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Error in opening <p> tag",
    );
    cy.get(cesc2("#/_document1")).should("contain.text", `Found <p h="abc"`);

    cy.get(cesc2("#/sec_title")).should("have.text", "Section 1");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello there!");

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute radius.  Found in component of type circle.",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute hide.  Found in component of type rectangle.",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute q.  Found in component of type apple.",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate attribute bad.  Found in component of type banana.",
    );
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
    cy.get(cesc2("#/_document1")).should("contain.text", "Missing closing tag");
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Invalid component type: a",
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "Expected </a>");
    cy.get(cesc2("#/_document1")).should("contain.text", "Expected </point>");

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Error in opening <point> tag",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      `Found <point coords="(4,5)"`,
    );
  });

  it("Naming errors", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p name="_p" />
    <p name="p@" />
    <p name="p">Hello</p>
    <p name="p">Bye</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Invalid component name: _p",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Component name must begin with a letter",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Invalid component name: p@",
    );
    cy.get(cesc2("#/p")).should("have.text", "Hello");
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate component name p",
    );
  });

  it("assignNames errors", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <group assignNames="(_a _b)" />
    <group assignNames="a/ b%" />
    <group assignNames="a) b" />
    <group assignNames="a b (c a)" />
  
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

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Invalid assignNames: (_a _b)",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "All assigned names must begin with a letter",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Invalid assignNames: a/ b%",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Invalid format for assignNames: a) b",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "A name is duplicated in assignNames: a b (c a)",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Cannot define assignNames twice for a component",
    );
    cy.get(cesc2("#/a")).should("have.text", "cat");
    cy.get(cesc2("#/b")).should("have.text", "dog");
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Duplicate component name b",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Cannot assign names for component type p",
    );
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

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Must supply value for source",
    );

    // TODO: what should this error actually say?
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Invalid reference target: __s",
    );
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
      "Circular reference involving component a1",
    );

    // temporary messages until can better detect circular references with copysource
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Component b2 references component b1 but component b1 has not been created",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Component c2 references component c1 but component c1 has not been created",
    );
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Component d2 references component d1 but component d1 has not been created",
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
  });
});
