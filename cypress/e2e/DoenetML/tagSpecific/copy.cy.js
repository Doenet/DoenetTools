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

  it("copy copies properties", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <copy name="a" source="_math1"/>
    <copy name="b" source="a"/>
    <math modifyIndirectly="true">x</math>
    <copy name="c" source="_math2"/>
    <copy name="d" source="c"/>
    <point><label>A</label>(1,2)</point>
    <copy name="e" source="_point1"/>
    <copy name="f" source="e"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/a"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/b"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/_math2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/c"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/d"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/_point1"].stateValues.label).eq("A");
      expect(stateVariables["/e"].stateValues.label).eq("A");
      expect(stateVariables["/f"].stateValues.label).eq("A");
    });
  });

  it("copy copies properties, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    $_math1{name="a"}
    $a{name="b"}
    <math modifyIndirectly="true">x</math>
    $_math2{name="c"}
    $c{name="d"}
    <point><label>A</label>(1,2)</point>
    $_point1{name="e"}
    $e{name="f"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/a"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/b"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/_math2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/c"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/d"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/_point1"].stateValues.label).eq("A");
      expect(stateVariables["/e"].stateValues.label).eq("A");
      expect(stateVariables["/f"].stateValues.label).eq("A");
    });
  });

  it("copy copies properties, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <math modifyIndirectly="true">x</math>
    <math name="a" copySource="_math1"/>
    <math name="b" copySource="a"/>
    <math name="c" copySource="_math2"/>
    <math name="d" copySource="c"/>
    <point><label>A</label>(1,2)</point>
    <point name="e" copySource="_point1"/>
    <point name="f" copySource="e"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/a"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/b"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/_math2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/c"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/d"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/_point1"].stateValues.label).eq("A");
      expect(stateVariables["/e"].stateValues.label).eq("A");
      expect(stateVariables["/f"].stateValues.label).eq("A");
    });
  });

  it("copy overwrites properties", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <copy name="r1" source="_math1"/>
    <copy name="r2" modifyIndirectly="true" source="_math1"/>
    <copy name="r3" modifyIndirectly="true" source="r1"/>
    <copy name="r4" source="r2"/>
    <copy name="r5" source="r3"/>
    <copy name="r6" source="r2" modifyIndirectly="false" />
    <copy name="r7" source="r3" modifyIndirectly="false" />
    <point labelIsName name="A">(1,2)</point>
    <copy name="A2" source="A"/>
    <copy name="B" source="A" labelIsName />
    <copy name="B2" source="A2" />
    <copy name="C" source="B" labelIsName/>
    <copy name="C2" source="B"/>
    <copy name="D" source="C" labelIsName/>
    <copy name="D2" source="C"/>
    <copy name="D5" source="C2" labelIsName/>
    <copy name="D6" source="C2"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r3"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r4"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r5"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r6"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r7"].stateValues.modifyIndirectly).eq(false);

      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/A2"].stateValues.label).eq("A");
      expect(stateVariables["/B"].stateValues.label).eq("B");
      expect(stateVariables["/B2"].stateValues.label).eq("A");
      expect(stateVariables["/C"].stateValues.label).eq("C");
      expect(stateVariables["/C2"].stateValues.label).eq("B");
      expect(stateVariables["/D"].stateValues.label).eq("D");
      expect(stateVariables["/D2"].stateValues.label).eq("C");
      expect(stateVariables["/D5"].stateValues.label).eq("D5");
      expect(stateVariables["/D6"].stateValues.label).eq("B");
    });
  });

  it("copy overwrites properties, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    $_math1{name="r1" }
    $_math1{name="r2" modifyIndirectly="true" }
    $r1{name="r3" modifyIndirectly="true" }
    $r2{name="r4" }
    $r3{name="r5" }
    $r2{name="r6" modifyIndirectly="false" }
    $r3{name="r7" modifyIndirectly="false" }
    <point labelIsName name="A">(1,2)</point>
    $A{name="A2" }
    $A{name="B" labelIsName }
    $A2{name="B2" }
    $B{name="C" labelIsName }
    $B{name="C2" }
    $C{name="D" labelIsName }
    $C{name="D2" }
    $C2{name="D5" labelIsName }
    $C2{name="D6" }
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r3"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r4"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r5"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r6"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r7"].stateValues.modifyIndirectly).eq(false);

      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/A2"].stateValues.label).eq("A");
      expect(stateVariables["/B"].stateValues.label).eq("B");
      expect(stateVariables["/B2"].stateValues.label).eq("A");
      expect(stateVariables["/C"].stateValues.label).eq("C");
      expect(stateVariables["/C2"].stateValues.label).eq("B");
      expect(stateVariables["/D"].stateValues.label).eq("D");
      expect(stateVariables["/D2"].stateValues.label).eq("C");
      expect(stateVariables["/D5"].stateValues.label).eq("D5");
      expect(stateVariables["/D6"].stateValues.label).eq("B");
    });
  });

  it("copy overwrites properties, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <math name="r1" copySource="_math1"/>
    <math name="r2" modifyIndirectly="true" copySource="_math1"/>
    <math name="r3" modifyIndirectly="true" copySource="r1"/>
    <math name="r4" copySource="r2"/>
    <math name="r5" copySource="r3"/>
    <math name="r6" copySource="r2" modifyIndirectly="false" />
    <math name="r7" copySource="r3" modifyIndirectly="false" />

    <point labelIsName name="A">(1,2)</point>
    <point name="A2"><label>A</label>(1,2)</point>
    <point name="A3" copySource="A"/>
    <point name="A4" copySource="A2"/>
    <point labelIsName name="B" copySource="A"/>
    <point name="B2" copySource="A"/>
    <point name="B3" copySource="A"><label>B</label></point>
    <point labelIsName name="B4" copySource="A2"/>
    <point name="B5" copySource="A2"/>
    <point name="B6" copySource="A2"><label>B</label></point>
    <point labelIsName name="C" copySource="B"/>
    <point name="C2" copySource="B"/>
    <point name="C3" copySource="B"><label>C</label></point>
    <point labelIsName name="C4" copySource="B2"/>
    <point name="C5" copySource="B2"/>
    <point name="C6" copySource="B2"><label>C</label></point>
    <point labelIsName name="C7" copySource="B3"/>
    <point name="C8" copySource="B3"/>
    <point name="C9" copySource="B3"><label>C</label></point>
    <point labelIsName name="C10" copySource="B4"/>
    <point name="C11" copySource="B4"/>
    <point name="C12" copySource="B4"><label>C</label></point>
    <point labelIsName name="C13" copySource="B5"/>
    <point name="C14" copySource="B5"/>
    <point name="C15" copySource="B5"><label>C</label></point>
    <point labelIsName name="C16" copySource="B6"/>
    <point name="C17" copySource="B6"/>
    <point name="C18" copySource="B6"><label>C</label></point>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r3"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r4"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r5"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r6"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r7"].stateValues.modifyIndirectly).eq(false);

      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/A2"].stateValues.label).eq("A");
      expect(stateVariables["/A3"].stateValues.label).eq("A");
      expect(stateVariables["/A4"].stateValues.label).eq("A");
      expect(stateVariables["/B"].stateValues.label).eq("B");
      expect(stateVariables["/B2"].stateValues.label).eq("A");
      expect(stateVariables["/B3"].stateValues.label).eq("B");
      expect(stateVariables["/B4"].stateValues.label).eq("B4");
      expect(stateVariables["/B5"].stateValues.label).eq("A");
      expect(stateVariables["/B6"].stateValues.label).eq("B");
      expect(stateVariables["/C"].stateValues.label).eq("C");
      expect(stateVariables["/C2"].stateValues.label).eq("B");
      expect(stateVariables["/C3"].stateValues.label).eq("C");
      expect(stateVariables["/C4"].stateValues.label).eq("C4");
      expect(stateVariables["/C5"].stateValues.label).eq("A");
      expect(stateVariables["/C6"].stateValues.label).eq("C");
      expect(stateVariables["/C7"].stateValues.label).eq("C7");
      expect(stateVariables["/C8"].stateValues.label).eq("B");
      expect(stateVariables["/C9"].stateValues.label).eq("C");
      expect(stateVariables["/C10"].stateValues.label).eq("C10");
      expect(stateVariables["/C11"].stateValues.label).eq("B4");
      expect(stateVariables["/C12"].stateValues.label).eq("C");
      expect(stateVariables["/C13"].stateValues.label).eq("C13");
      expect(stateVariables["/C14"].stateValues.label).eq("A");
      expect(stateVariables["/C15"].stateValues.label).eq("C");
      expect(stateVariables["/C16"].stateValues.label).eq("C16");
      expect(stateVariables["/C17"].stateValues.label).eq("B");
      expect(stateVariables["/C18"].stateValues.label).eq("C");
    });
  });

  it("copy overwrites properties, decode XML entities", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math modifyIndirectly="3 &gt; 4">x</math>
    <copy name="r1" source="_math1"/>
    <copy name="r2" modifyIndirectly="3&lt;4" source="_math1"/>
    <copy name="r3" modifyIndirectly="3&lt;4" source="r1"/>
    <copy name="r4" source="r2"/>
    <copy name="r5" source="r3"/>
    <copy name="r6" source="r2" modifyIndirectly="3&gt;4" />
    <copy name="r7" source="r3" modifyIndirectly="3&gt;4" />


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r3"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r4"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r5"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r6"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r7"].stateValues.modifyIndirectly).eq(false);
    });
  });

  it("copy overwrites properties, decode XML entities, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math modifyIndirectly="3 &gt; 4">x</math>
    $_math1{name="r1" }
    $_math1{name="r2" modifyIndirectly="3&lt;4" }
    $r1{name="r3" modifyIndirectly="3&lt;4" }
    $r2{name="r4" }
    $r3{name="r5" }
    $r2{name="r6" modifyIndirectly="3&gt;4" }
    $r3{name="r7" modifyIndirectly="3&gt;4" }


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r3"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r4"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r5"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r6"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r7"].stateValues.modifyIndirectly).eq(false);
    });
  });

  it("copy overwrites properties, decode XML entities, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math modifyIndirectly="3 &gt; 4">x</math>
    <math name="r1" copySource="_math1"/>
    <math name="r2" modifyIndirectly="3&lt;4" copySource="_math1"/>
    <math name="r3" modifyIndirectly="3&lt;4" copySource="r1"/>
    <math name="r4" copySource="r2"/>
    <math name="r5" copySource="r3"/>
    <math name="r6" copySource="r2" modifyIndirectly="3&gt;4" />
    <math name="r7" copySource="r3" modifyIndirectly="3&gt;4" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r1"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r3"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r4"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r5"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/r6"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/r7"].stateValues.modifyIndirectly).eq(false);
    });
  });

  it("copy props", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <copy assignNames="mr" prop="modifyIndirectly" source="x"/>
    <copy assignNames="mr2" prop="modifyIndirectly" modifyIndirectly="true" source="x"/>

    <copy assignNames="frmt" prop="format" source="x"/>
    <copy assignNames="frmt2" prop="format" source="x" hide />
    <copy name="frmt3" hide source="frmt"/>

    <point name="A" labelIsName>(1,2)</point>
    <copy assignNames="cA" prop="coords" source="A"/>
    <copy assignNames="l" prop="latex" source="cA"/>
    <copy assignNames="lmr" prop="latex" modifyIndirectly="false" source="cA"/>
    <copy name="A2" source="A"/>
    <copy assignNames="cA2" prop="coords" source="A2"/>
    <copy assignNames="l2" prop="latex" source="cA2"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/x"].stateValues.hidden).eq(true);
      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables["/mr"].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables["/mr"].stateValues.hidden).eq(false);
      expect(stateVariables["/mr"].stateValues.value).eq(false);

      // modifyIndirectly is overwritten
      expect(stateVariables["/mr2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/mr2"].stateValues.hidden).eq(false);
      expect(stateVariables["/mr2"].stateValues.value).eq(false);

      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables["/frmt"].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables["/frmt"].stateValues.hidden).eq(false);
      expect(stateVariables["/frmt"].stateValues.value).eq("text");

      expect(stateVariables["/frmt2"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/frmt2"].stateValues.hidden).eq(true);
      expect(stateVariables["/frmt2"].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(stateVariables["/frmt3"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/frmt3"].stateValues.value).eq("text");
      expect(stateVariables["/frmt3"].stateValues.hidden).eq(true);

      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/cA"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/l"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
      expect(stateVariables["/l"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/lmr"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
      expect(stateVariables["/lmr"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/A2"].stateValues.label).eq("A");
      expect(stateVariables["/cA2"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/l2"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
    });
  });

  it("copy props, dot notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <copy assignNames="mr" source="x.modifyIndirectly"/>
    <copy assignNames="mr2" modifyIndirectly="true" source="x.modifyIndirectly"/>

    <copy assignNames="frmt" source="x.format"/>
    <copy assignNames="frmt2" source="x.format" hide />
    <copy name="frmt3" hide source="frmt"/>

    <point name="A" labelIsName>(1,2)</point>
    <copy assignNames="cA" source="A.coords"/>
    <copy assignNames="l" source="cA.latex"/>
    <copy assignNames="lmr" modifyIndirectly="false" source="cA.latex"/>
    <copy name="A2" source="A"/>
    <copy assignNames="cA2" source="A2.coords"/>
    <copy assignNames="l2" source="cA2.latex"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/x"].stateValues.hidden).eq(true);
      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables["/mr"].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables["/mr"].stateValues.hidden).eq(false);
      expect(stateVariables["/mr"].stateValues.value).eq(false);

      // modifyIndirectly is overwritten
      expect(stateVariables["/mr2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/mr2"].stateValues.hidden).eq(false);
      expect(stateVariables["/mr2"].stateValues.value).eq(false);

      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables["/frmt"].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables["/frmt"].stateValues.hidden).eq(false);
      expect(stateVariables["/frmt"].stateValues.value).eq("text");

      expect(stateVariables["/frmt2"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/frmt2"].stateValues.hidden).eq(true);
      expect(stateVariables["/frmt2"].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(stateVariables["/frmt3"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/frmt3"].stateValues.value).eq("text");
      expect(stateVariables["/frmt3"].stateValues.hidden).eq(true);

      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/cA"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/l"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
      expect(stateVariables["/l"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/lmr"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
      expect(stateVariables["/lmr"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/A2"].stateValues.label).eq("A");
      expect(stateVariables["/cA2"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/l2"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
    });
  });

  it("copy props, dot notation, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    $(x.modifyIndirectly{assignNames="mr" })
    $(x.modifyIndirectly{assignNames="mr2" modifyIndirectly="true" })

    $(x.format{assignNames="frmt" })
    $(x.format{assignNames="frmt2" hide })
    $frmt{name="frmt3" hide }

    <point name="A" labelIsName>(1,2)</point>
    $(A.coords{assignNames="cA" })
    $(cA.latex{assignNames="l" })
    $(cA.latex{assignNames="lmr" modifyIndirectly="false" })
    $A{name="A2" }
    $(A2.coords{assignNames="cA2" })
    $(cA2.latex{assignNames="l2" })
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/x"].stateValues.hidden).eq(true);
      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables["/mr"].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables["/mr"].stateValues.hidden).eq(false);
      expect(stateVariables["/mr"].stateValues.value).eq(false);

      // modifyIndirectly is overwritten
      expect(stateVariables["/mr2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/mr2"].stateValues.hidden).eq(false);
      expect(stateVariables["/mr2"].stateValues.value).eq(false);

      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables["/frmt"].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables["/frmt"].stateValues.hidden).eq(false);
      expect(stateVariables["/frmt"].stateValues.value).eq("text");

      expect(stateVariables["/frmt2"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/frmt2"].stateValues.hidden).eq(true);
      expect(stateVariables["/frmt2"].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(stateVariables["/frmt3"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/frmt3"].stateValues.value).eq("text");
      expect(stateVariables["/frmt3"].stateValues.hidden).eq(true);

      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/cA"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/l"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
      expect(stateVariables["/l"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/lmr"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
      expect(stateVariables["/lmr"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/A2"].stateValues.label).eq("A");
      expect(stateVariables["/cA2"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/l2"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
    });
  });

  it("copy props, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <boolean name="mr" copyProp="modifyIndirectly" copySource="x"/>
    <boolean name="mr2" copyProp="modifyIndirectly" modifyIndirectly="true" copySource="x"/>

    <text name="frmt" copyProp="format" copySource="x"/>
    <text name="frmt2" copyProp="format" copySource="x" hide />
    <text name="frmt3" hide copySource="frmt"/>

    <point name="A" labelIsName>(1,2)</point>
    <coords name="cA" copyProp="coords" copySource="A"/>
    <text name="l" copyProp="latex" copySource="cA"/>
    <text name="lmr" copyProp="latex" modifyIndirectly="false" copySource="cA"/>
    <point name="A2" copySource="A"/>
    <coords name="cA2" copyProp="coords" copySource="A2"/>
    <text name="l2" copyProp="latex" copySource="cA2"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/x"].stateValues.hidden).eq(true);
      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables["/mr"].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables["/mr"].stateValues.hidden).eq(false);
      expect(stateVariables["/mr"].stateValues.value).eq(false);

      // modifyIndirectly is overwritten
      expect(stateVariables["/mr2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/mr2"].stateValues.hidden).eq(false);
      expect(stateVariables["/mr2"].stateValues.value).eq(false);

      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables["/frmt"].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables["/frmt"].stateValues.hidden).eq(false);
      expect(stateVariables["/frmt"].stateValues.value).eq("text");

      expect(stateVariables["/frmt2"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/frmt2"].stateValues.hidden).eq(true);
      expect(stateVariables["/frmt2"].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(stateVariables["/frmt3"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/frmt3"].stateValues.value).eq("text");
      expect(stateVariables["/frmt3"].stateValues.hidden).eq(true);

      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/cA"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/l"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
      expect(stateVariables["/l"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/lmr"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
      expect(stateVariables["/lmr"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/A2"].stateValues.label).eq("A");
      expect(stateVariables["/cA2"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/l2"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
    });
  });

  it("copy props, with copySource, dot notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <boolean name="mr" copySource="x.modifyIndirectly"/>
    <boolean name="mr2" modifyIndirectly="true" copySource="x.modifyIndirectly"/>

    <text name="frmt" copySource="x.format"/>
    <text name="frmt2" copySource="x.format" hide />
    <text name="frmt3" hide copySource="frmt"/>

    <point name="A" labelIsName>(1,2)</point>
    <coords name="cA" copySource="A.coords"/>
    <text name="l" copySource="cA.latex"/>
    <text name="lmr" modifyIndirectly="false" copySource="cA.latex"/>
    <point name="A2" copySource="A"/>
    <coords name="cA2" copySource="A2.coords"/>
    <text name="l2" copySource="cA2.latex"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/x"].stateValues.hidden).eq(true);
      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables["/mr"].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables["/mr"].stateValues.hidden).eq(false);
      expect(stateVariables["/mr"].stateValues.value).eq(false);

      // modifyIndirectly is overwritten
      expect(stateVariables["/mr2"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/mr2"].stateValues.hidden).eq(false);
      expect(stateVariables["/mr2"].stateValues.value).eq(false);

      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables["/frmt"].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables["/frmt"].stateValues.hidden).eq(false);
      expect(stateVariables["/frmt"].stateValues.value).eq("text");

      expect(stateVariables["/frmt2"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/frmt2"].stateValues.hidden).eq(true);
      expect(stateVariables["/frmt2"].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(stateVariables["/frmt3"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/frmt3"].stateValues.value).eq("text");
      expect(stateVariables["/frmt3"].stateValues.hidden).eq(true);

      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/cA"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/l"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
      expect(stateVariables["/l"].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables["/lmr"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
      expect(stateVariables["/lmr"].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables["/A2"].stateValues.label).eq("A");
      expect(stateVariables["/cA2"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/l2"].stateValues.value).eq(
        "\\left( 1, 2 \\right)",
      );
    });
  });

  it("copy props of copy still updatable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      <copy name="p2" source="p1"/>
      <point name="p3">
        (<copy prop="y" source="p2"/>,
        <copy prop="x1" source="p2"/>)
      </point>
    </graph>
    <copy source="p1" name="p1a" />
    <copy source="p2" name="p2a" />
    <copy source="p3" name="p3a" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`initial position`);
    cy.get(cesc("#\\/p1a")).should("contain.text", "(1,2)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(1);
    });

    cy.log(`move point 1`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: -3, y: 5 },
      });
    });

    cy.get(cesc("#\\/p1a")).should("contain.text", "(−3,5)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(-3);
    });

    cy.log(`move point 2`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 6, y: -9 },
      });
    });

    cy.get(cesc("#\\/p2a")).should("contain.text", "(6,−9)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(-9);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(6);
    });

    cy.log(`move point 3`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: -1, y: -7 },
      });
    });

    cy.get(cesc("#\\/p3a")).should("contain.text", "(−1,−7)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(-1);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(-7);
    });
  });

  it("copy props of copy still updatable, dot notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      <copy name="p2" source="p1"/>
      <point name="p3">
        (<copy source="p2.y"/>,
        <copy source="p2.x1"/>)
      </point>
    </graph>
    <copy source="p1" name="p1a" />
    <copy source="p2" name="p2a" />
    <copy source="p3" name="p3a" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`initial position`);
    cy.get(cesc("#\\/p1a")).should("contain.text", "(1,2)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(1);
    });

    cy.log(`move point 1`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: -3, y: 5 },
      });
    });

    cy.get(cesc("#\\/p1a")).should("contain.text", "(−3,5)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(-3);
    });

    cy.log(`move point 2`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 6, y: -9 },
      });
    });

    cy.get(cesc("#\\/p2a")).should("contain.text", "(6,−9)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(-9);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(6);
    });

    cy.log(`move point 3`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: -1, y: -7 },
      });
    });

    cy.get(cesc("#\\/p3a")).should("contain.text", "(−1,−7)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(-1);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(-7);
    });
  });

  it("copy props of copy still updatable, dot notation, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      $p1{name="p2"}
      <point name="p3">
        ($p2.y, $p2.x1)
      </point>
    </graph>
    $p1{name="p1a"}
    $p2{name="p2a"}
    $p3{name="p3a"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`initial position`);
    cy.get(cesc("#\\/p1a")).should("contain.text", "(1,2)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(1);
    });

    cy.log(`move point 1`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: -3, y: 5 },
      });
    });

    cy.get(cesc("#\\/p1a")).should("contain.text", "(−3,5)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(-3);
    });

    cy.log(`move point 2`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 6, y: -9 },
      });
    });

    cy.get(cesc("#\\/p2a")).should("contain.text", "(6,−9)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(-9);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(6);
    });

    cy.log(`move point 3`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: -1, y: -7 },
      });
    });

    cy.get(cesc("#\\/p3a")).should("contain.text", "(−1,−7)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(-1);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(-7);
    });
  });

  it("copy props of copy still updatable, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      <point name="p2" copySource="p1"/>
      <point name="p3">
        (<math copyProp="y" copySource="p2"/>,
        <math copyProp="x1" copySource="p2"/>)
      </point>
    </graph>
    <point copySource="p1" name="p1a" />
    <point copySource="p2" name="p2a" />
    <point copySource="p3" name="p3a" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`initial position`);
    cy.get(cesc("#\\/p1a")).should("contain.text", "(1,2)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(1);
    });

    cy.log(`move point 1`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: -3, y: 5 },
      });
    });

    cy.get(cesc("#\\/p1a")).should("contain.text", "(−3,5)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(-3);
    });

    cy.log(`move point 2`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 6, y: -9 },
      });
    });

    cy.get(cesc("#\\/p2a")).should("contain.text", "(6,−9)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(-9);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(6);
    });

    cy.log(`move point 3`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: -1, y: -7 },
      });
    });

    cy.get(cesc("#\\/p3a")).should("contain.text", "(−1,−7)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(-1);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(-7);
    });
  });

  it("copy props of copy still updatable, with copySource, dot notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      <point name="p2" copySource="p1"/>
      <point name="p3">
        (<math copySource="p2.y"/>,
        <math copySource="p2.x1"/>)
      </point>
    </graph>
    <point copySource="p1" name="p1a" />
    <point copySource="p2" name="p2a" />
    <point copySource="p3" name="p3a" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`initial position`);
    cy.get(cesc("#\\/p1a")).should("contain.text", "(1,2)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(1);
    });

    cy.log(`move point 1`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: -3, y: 5 },
      });
    });

    cy.get(cesc("#\\/p1a")).should("contain.text", "(−3,5)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(5);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(-3);
    });

    cy.log(`move point 2`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 6, y: -9 },
      });
    });

    cy.get(cesc("#\\/p2a")).should("contain.text", "(6,−9)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(-9);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(6);
    });

    cy.log(`move point 3`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: -1, y: -7 },
      });
    });

    cy.get(cesc("#\\/p3a")).should("contain.text", "(−1,−7)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p3"].stateValues.xs[0]).eq(-1);
      expect(stateVariables["/p3"].stateValues.xs[1]).eq(-7);
    });
  });

  it.skip("copy invalid prop", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>x</math>
    <copy prop="label" source="_math1"/>

    <point />
    <copy source="_point1"/>
    <copy prop="format" source="_ref1"/>

    <copy name="A2" source="A"/>
    <copy name="cA2" prop="coords" source="A2"/>
    <copy name="lcA2" prop="label" source="cA2"/>
    <copy name="llcA2" labelIsName source="cA2"/>

    `,
        },
        "*",
      );
    });

    cy.get("#__math1"); //wait for page to load

    // How to check if the right errors get thrown for these?
  });

  it("copy of prop copy shadows source", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
    <copy prop="displacement" assignNames="d1" source="_vector1"/>
    </graph>
  
    <graph>
    <copy source="d1" name="d2" />
    </graph>

    <copy source="_vector1" name="v1a" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`initial positions`);
    cy.window().then(async (win) => {
      let displacement = [-4, 2];
      let v_tail = [1, 1];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
      expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
      expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
        ...displacement,
      ]);
      expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
      expect(stateVariables["/d1"].stateValues.displacement).eqls([
        ...displacement,
      ]);
      expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
      expect(stateVariables["/d2"].stateValues.displacement).eqls([
        ...displacement,
      ]);
    });

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [3, 1];
      let v_tail = [-1, 4];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 2`);
    cy.window().then(async (win) => {
      let displacement = [5, -2];
      let v_tail = [-1, 4];
      let d_tail = [3, -7];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d1",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 3`);
    cy.window().then(async (win) => {
      let displacement = [-3, 6];
      let v_tail = [-1, 4];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d2",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [5, 0];
      let v_tail = [-8, 6];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });
  });

  it("copy of prop copy shadows source, dot notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
    <copy assignNames="d1" source="_vector1.displacement"/>
    </graph>
  
    <graph>
    <copy source="d1" name="d2" />
    </graph>

    <copy source="_vector1" name="v1a" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`initial positions`);
    cy.window().then(async (win) => {
      let displacement = [-4, 2];
      let v_tail = [1, 1];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
      expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
      expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
        ...displacement,
      ]);
      expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
      expect(stateVariables["/d1"].stateValues.displacement).eqls([
        ...displacement,
      ]);
      expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
      expect(stateVariables["/d2"].stateValues.displacement).eqls([
        ...displacement,
      ]);
    });

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [3, 1];
      let v_tail = [-1, 4];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 2`);
    cy.window().then(async (win) => {
      let displacement = [5, -2];
      let v_tail = [-1, 4];
      let d_tail = [3, -7];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d1",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 3`);
    cy.window().then(async (win) => {
      let displacement = [-3, 6];
      let v_tail = [-1, 4];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d2",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [5, 0];
      let v_tail = [-8, 6];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });
  });

  it("copy of prop copy shadows source, dot notation, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
    $(_vector1.displacement{assignNames="d1"})
    </graph>
  
    <graph>
    $d1{name="d2"}
    </graph>

    $_vector1{name="v1a"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`initial positions`);
    cy.window().then(async (win) => {
      let displacement = [-4, 2];
      let v_tail = [1, 1];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
      expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
      expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
        ...displacement,
      ]);
      expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
      expect(stateVariables["/d1"].stateValues.displacement).eqls([
        ...displacement,
      ]);
      expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
      expect(stateVariables["/d2"].stateValues.displacement).eqls([
        ...displacement,
      ]);
    });

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [3, 1];
      let v_tail = [-1, 4];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 2`);
    cy.window().then(async (win) => {
      let displacement = [5, -2];
      let v_tail = [-1, 4];
      let d_tail = [3, -7];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d1",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 3`);
    cy.window().then(async (win) => {
      let displacement = [-3, 6];
      let v_tail = [-1, 4];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d2",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [5, 0];
      let v_tail = [-8, 6];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });
  });

  it("copy of prop copy shadows source, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
      <vector copyprop="displacement" name="d1" copySource="_vector1"/>
    </graph>
  
    <graph>
      <vector copySource="d1" name="d2" />
    </graph>

    <vector copySource="_vector1" name="v1a" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`initial positions`);
    cy.window().then(async (win) => {
      let displacement = [-4, 2];
      let v_tail = [1, 1];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
      expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
      expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
        ...displacement,
      ]);
      expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
      expect(stateVariables["/d1"].stateValues.displacement).eqls([
        ...displacement,
      ]);
      expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
      expect(stateVariables["/d2"].stateValues.displacement).eqls([
        ...displacement,
      ]);
    });

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [3, 1];
      let v_tail = [-1, 4];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 2`);
    cy.window().then(async (win) => {
      let displacement = [5, -2];
      let v_tail = [-1, 4];
      let d_tail = [3, -7];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d1",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 3`);
    cy.window().then(async (win) => {
      let displacement = [-3, 6];
      let v_tail = [-1, 4];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d2",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [5, 0];
      let v_tail = [-8, 6];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });
  });

  it("copy of prop copy shadows source, with copySource, dot notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
      <vector name="d1" copySource="_vector1.displacement"/>
    </graph>
  
    <graph>
      <vector copySource="d1" name="d2" />
    </graph>

    <vector copySource="_vector1" name="v1a" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log(`initial positions`);
    cy.window().then(async (win) => {
      let displacement = [-4, 2];
      let v_tail = [1, 1];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
      expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
      expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
        ...displacement,
      ]);
      expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
      expect(stateVariables["/d1"].stateValues.displacement).eqls([
        ...displacement,
      ]);
      expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
      expect(stateVariables["/d2"].stateValues.displacement).eqls([
        ...displacement,
      ]);
    });

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [3, 1];
      let v_tail = [-1, 4];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 2`);
    cy.window().then(async (win) => {
      let displacement = [5, -2];
      let v_tail = [-1, 4];
      let d_tail = [3, -7];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d1",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 3`);
    cy.window().then(async (win) => {
      let displacement = [-3, 6];
      let v_tail = [-1, 4];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d2",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [5, 0];
      let v_tail = [-8, 6];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        },
      });

      cy.get(cesc("#\\/v1a")).should(
        "contain.text",
        `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_vector1"].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables["/_vector1"].stateValues.head).eqls([...v_head]);
        expect(stateVariables["/_vector1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d1"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d1"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d1"].stateValues.displacement).eqls([
          ...displacement,
        ]);
        expect(stateVariables["/d2"].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables["/d2"].stateValues.head).eqls([...d_head]);
        expect(stateVariables["/d2"].stateValues.displacement).eqls([
          ...displacement,
        ]);
      });
    });
  });

  it("property children account for replacement changes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput />

    <p>
      <aslist>
        <sequence type="letters" from="a" length="$_mathinput1" />
      </aslist>
    </p>
    
    <p><copy name="al2" source="_aslist1"/></p>
    <copy name="p2" source="_p1"/>
    
    <p><copy source="al2"/></p>
    <copy source="p2" name="p3"/>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/_p1")).should("contain.text", "a, b");

    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_p1")).should("contain.text", "a, b, c, d, e");
    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_p1")).should("not.contain.text", "a, b, c, d, e");
    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}6{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_p1")).should("contain.text", "a, b, c, d, e, f");
    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
  });

  it("property children account for replacement changes, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput />

    <p>
      <aslist>
        <sequence type="letters" from="a" length="$_mathinput1" />
      </aslist>
    </p>
    
    <p>$_aslist1{name="al2"}</p>
    $_p1{name="p2"}
    
    <p>$al2</p>
    $p2{name="p3"}

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/_p1")).should("contain.text", "a, b");

    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_p1")).should("contain.text", "a, b, c, d, e");
    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_p1")).should("not.contain.text", "a, b, c, d, e");
    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}6{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_p1")).should("contain.text", "a, b, c, d, e, f");
    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
  });

  it("property children account for replacement changes, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput />

    <p>
      <aslist>
        <sequence type="letters" from="a" length="$_mathinput1" />
      </aslist>
    </p>
    
    <p><aslist name="al2" copySource="_aslist1"/></p>

    <p><aslist copySource="al2"/></p>

    <p name="p2" copySource="_p1"/>
    
    <p copySource="p2" name="p3"/>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/_p1")).should("contain.text", "a, b");

    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_p1")).should("contain.text", "a, b, c, d, e");
    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_p1")).should("not.contain.text", "a, b, c, d, e");
    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}6{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_p1")).should("contain.text", "a, b, c, d, e, f");
    cy.get(cesc("#\\/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/_p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/p2"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/_p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
    cy.get(cesc("#\\/p3"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a, b, c, d, e, f");
      });
  });

  it("copy macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>a=<mathinput name="a" prefill="5" /></p>
    <p>b=<mathinput name="b" prefill="2" /></p>
    <p>c=<mathinput name="c" prefill="3" /></p>

    <p name="orig"><m>ax^2+bx+c = <math name="s">$a x^2 + $b x + $c</math></m></p>
    <p name="single"><m>ax^2+bx+c = $s</m></p>
    <p name="double"><m>ax^2+bx+c = $$s</m></p>
    <p name="triple"><m>ax^2+bx+c = $$$s</m></p>
    <p name="singlem">$_m1</p>
    <p name="doublem">$$_m1</p>
    <p name="triplem">$$$_m1</p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/orig"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ax2+bx+c=5x2+2x+3");
      });
    cy.get(cesc("#\\/single"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ax2+bx+c=5x2+2x+3");
      });
    cy.get(cesc("#\\/double"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ax2+bx+c=$$s");
      });
    cy.get(cesc("#\\/triple"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ax2+bx+c=$$$s");
      });
    cy.get(cesc("#\\/singlem"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ax2+bx+c=5x2+2x+3");
      });
    cy.get(cesc("#\\/doublem")).should("have.text", "$$_m1");
    cy.get(cesc("#\\/triplem")).should("have.text", "$$$_m1");

    cy.log("Enter new numbers");
    cy.get(cesc("#\\/a") + " textarea").type("{end}{backspace}9{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/b") + " textarea").type("{end}{backspace}6{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/c") + " textarea").type("{end}{backspace}7{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/orig")).should("contain.text", "ax2+bx+c=9x2+6x+7");
    cy.get(cesc("#\\/orig"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ax2+bx+c=9x2+6x+7");
      });
    cy.get(cesc("#\\/single"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ax2+bx+c=9x2+6x+7");
      });
    cy.get(cesc("#\\/double"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ax2+bx+c=$$s");
      });
    cy.get(cesc("#\\/triple"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ax2+bx+c=$$$s");
      });
    cy.get(cesc("#\\/singlem"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("ax2+bx+c=9x2+6x+7");
      });
    cy.get(cesc("#\\/doublem")).should("have.text", "$$_m1");
    cy.get(cesc("#\\/triplem")).should("have.text", "$$$_m1");
  });

  it("macros after failed double macro", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <text name="t">hi</text>
    <text name="u">bye</text>
    <p>$t, $$t, $ $u,
    $t, $$u, $u</p>
    <p>$u, $$t(, $t,
    $u, $$u, $t</p>
    <p>$t, $$$t, $5, $u, $$5, $t, $$$5, $u</p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should(
      "have.text",
      "hi, $$t, $ bye,\n    hi, $$u, bye",
    );
    cy.get(cesc("#\\/_p2")).should(
      "have.text",
      "bye, $$t(, hi,\n    bye, $$u, hi",
    );
    cy.get(cesc("#\\/_p3")).should(
      "have.text",
      "hi, $$$t, $5, bye, $$5, hi, $$$5, bye",
    );
  });

  it("copy does not ignore hide by default", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Hidden text: <text name="hidden" hide>secret</text></p>
    <p>Hidden by default: $hidden</p>
    <p>Force to reveal: <copy source="hidden" hide="false" /></p>
    <p>Force to reveal 2: <copy source="hidden" sourceAttributesToIgnore="hide" /></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Hidden by default: ");
    cy.get(cesc("#\\/_p3")).should("have.text", "Force to reveal: secret");
    cy.get(cesc("#\\/_p4")).should("have.text", "Force to reveal 2: secret");
  });

  it("copy does not ignore hide by default, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Hidden text: <text name="hidden" hide>secret</text></p>
    <p>Hidden by default: $hidden</p>
    <p>Force to reveal: $hidden{hide="false"}</p>
    <p>Force to reveal 2: $hidden{sourceAttributesToIgnore="hide"}</p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Hidden by default: ");
    cy.get(cesc("#\\/_p3")).should("have.text", "Force to reveal: secret");
    cy.get(cesc("#\\/_p4")).should("have.text", "Force to reveal 2: secret");
  });

  it("copy does not ignore hide by default, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Hidden text: <text name="hidden" hide>secret</text></p>
    <p>Hidden by default: <text copySource="hidden" /></p>
    <p>Force to reveal: <text copySource="hidden" hide="false" /></p>
    <p>Force to reveal 2: <text copySource="hidden" sourceAttributesToIgnore="hide" /></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/_p2")).should("have.text", "Hidden by default: ");
    cy.get(cesc("#\\/_p3")).should("have.text", "Force to reveal: secret");
    cy.get(cesc("#\\/_p4")).should("have.text", "Force to reveal 2: secret");
  });

  it("copy keeps hidden children hidden", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="theP" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="pHidden">Hidden: $(theP/hidden)</p>
    <p name="pReveal">Revealed: $(theP/hidden{hide="false"})</p>
    <copy source="theP" name="theP2" />
    <p name="pHidden2">Hidden 2: $(theP2/hidden)</p>
    <p name="pReveal2">Revealed 2: $(theP2/hidden{hide="false"})</p>
    <copy source="theP" sourceAttributesToIgnore="hide" name="theP3" />
    <p name="pReveal3">Revealed 3: $(theP3/hidden)</p>
    <copy source="theP" hide="false" name="theP4" />
    <p name="pHidden4">Hidden 4: $(theP4/hidden)</p>
    <p name="pReveal4">Revealed 4: $(theP4/hidden{hide="false"})</p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/theP")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/pHidden")).should("have.text", "Hidden: ");
    cy.get(cesc("#\\/pReveal")).should("have.text", "Revealed: secret");
    cy.get(cesc("#\\/theP2")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/pHidden2")).should("have.text", "Hidden 2: ");
    cy.get(cesc("#\\/pReveal2")).should("have.text", "Revealed 2: secret");
    cy.get(cesc("#\\/theP3")).should("have.text", "Hidden text: secret");
    cy.get(cesc("#\\/pReveal3")).should("have.text", "Revealed 3: secret");
    cy.get(cesc("#\\/theP4")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/pHidden4")).should("have.text", "Hidden 4: ");
    cy.get(cesc("#\\/pReveal4")).should("have.text", "Revealed 4: secret");
  });

  it("copy keeps hidden children hidden, all macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="theP" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="pHidden">Hidden: $(theP/hidden)</p>
    <p name="pReveal">Revealed: $(theP/hidden{hide="false"})</p>
    $theP{name="theP2"}
    <p name="pHidden2">Hidden 2: $(theP2/hidden)</p>
    <p name="pReveal2">Revealed 2: $(theP2/hidden{hide="false"})</p>
    $theP{sourceAttributesToIgnore="hide" name="theP3"}
    <p name="pReveal3">Revealed 3: $(theP3/hidden)</p>
    $theP{hide="false" name="theP4"}
    <p name="pHidden4">Hidden 4: $(theP4/hidden)</p>
    <p name="pReveal4">Revealed 4: $(theP4/hidden{hide="false"})</p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/theP")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/pHidden")).should("have.text", "Hidden: ");
    cy.get(cesc("#\\/pReveal")).should("have.text", "Revealed: secret");
    cy.get(cesc("#\\/theP2")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/pHidden2")).should("have.text", "Hidden 2: ");
    cy.get(cesc("#\\/pReveal2")).should("have.text", "Revealed 2: secret");
    cy.get(cesc("#\\/theP3")).should("have.text", "Hidden text: secret");
    cy.get(cesc("#\\/pReveal3")).should("have.text", "Revealed 3: secret");
    cy.get(cesc("#\\/theP4")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/pHidden4")).should("have.text", "Hidden 4: ");
    cy.get(cesc("#\\/pReveal4")).should("have.text", "Revealed 4: secret");
  });

  it("copy keeps hidden children hidden, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="theP" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="pHidden">Hidden: <text copySource="theP/hidden" /></p>
    <p name="pReveal">Revealed: <text copySource="theP/hidden" hide="false" /></p>
    <p copySource="theP" name="theP2" />
    <p name="pHidden2">Hidden 2: <text copySource="theP2/hidden" /></p>
    <p name="pReveal2">Revealed 2: <text copySource="theP2/hidden" hide="false" /></p>
    <p copySource="theP" sourceAttributesToIgnore="hide" name="theP3" />
    <p name="pReveal3">Revealed 3: <text copySource="theP3/hidden" /></p>
    <p copySource="theP" name="theP4" hide="false" />
    <p name="pHidden4">Hidden 4: <text copySource="theP4/hidden" /></p>
    <p name="pReveal4">Revealed 4: <text copySource="theP4/hidden" hide="false" /></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/pHidden")).should("have.text", "Hidden: ");
    cy.get(cesc("#\\/pReveal")).should("have.text", "Revealed: secret");
    cy.get(cesc("#\\/theP2")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/pHidden2")).should("have.text", "Hidden 2: ");
    cy.get(cesc("#\\/pReveal2")).should("have.text", "Revealed 2: secret");
    cy.get(cesc("#\\/theP3")).should("have.text", "Hidden text: secret");
    cy.get(cesc("#\\/pReveal3")).should("have.text", "Revealed 3: secret");
    cy.get(cesc("#\\/theP4")).should("have.text", "Hidden text: ");
    cy.get(cesc("#\\/pHidden4")).should("have.text", "Hidden 4: ");
    cy.get(cesc("#\\/pReveal4")).should("have.text", "Revealed 4: secret");
  });

  it("copies hide dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <text name="source">hello</text>

    <booleaninput name='h1' prefill="false">
      <label>Hide first copy</label>
    </booleaninput>
    <booleaninput name='h2' prefill="true">
      <label>Hide second copy</label>
    </booleaninput>

    <p name="c1">copy 1: <copy hide="$h1" source="source" /></p>
    <p name="c2">copy 2: <copy hide="$h2" source="source" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/c1")).should("have.text", "copy 1: hello");
    cy.get(cesc("#\\/c2")).should("have.text", "copy 2: ");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();

    cy.get(cesc("#\\/c1")).should("have.text", "copy 1: ");
    cy.get(cesc("#\\/c2")).should("have.text", "copy 2: hello");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();

    cy.get(cesc("#\\/c1")).should("have.text", "copy 1: hello");
    cy.get(cesc("#\\/c2")).should("have.text", "copy 2: ");
  });

  it("copies hide dynamically, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <text name="source">hello</text>

    <booleaninput name='h1' prefill="false">
      <label>Hide first copy</label>
    </booleaninput>
    <booleaninput name='h2' prefill="true">
      <label>Hide second copy</label>
    </booleaninput>

    <p name="c1">copy 1: $source{hide="$h1"}</p>
    <p name="c2">copy 2: $source{hide="$h2"}</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/c1")).should("have.text", "copy 1: hello");
    cy.get(cesc("#\\/c2")).should("have.text", "copy 2: ");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();

    cy.get(cesc("#\\/c1")).should("have.text", "copy 1: ");
    cy.get(cesc("#\\/c2")).should("have.text", "copy 2: hello");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();

    cy.get(cesc("#\\/c1")).should("have.text", "copy 1: hello");
    cy.get(cesc("#\\/c2")).should("have.text", "copy 2: ");
  });

  it("copies hide dynamically, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <text name="source">hello</text>

    <booleaninput name='h1' prefill="false">
      <label>Hide first copy</label>
    </booleaninput>
    <booleaninput name='h2' prefill="true">
      <label>Hide second copy</label>
    </booleaninput>

    <p name="c1">copy 1: <text hide="$h1" copySource="source" /></p>
    <p name="c2">copy 2: <text hide="$h2" copySource="source" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/c1")).should("have.text", "copy 1: hello");
    cy.get(cesc("#\\/c2")).should("have.text", "copy 2: ");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();

    cy.get(cesc("#\\/c1")).should("have.text", "copy 1: ");
    cy.get(cesc("#\\/c2")).should("have.text", "copy 2: hello");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();

    cy.get(cesc("#\\/c1")).should("have.text", "copy 1: hello");
    cy.get(cesc("#\\/c2")).should("have.text", "copy 2: ");
  });

  it("copy uri two problems", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Two problems</title>

    <copy name="problem1" uri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" />
    
    <copy name="problem2" uri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" />
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_title1")).should("have.text", "Two problems"); // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"];

    cy.get(cesc2("#/problem1/_title1")).should("have.text", "Animal sounds");

    cy.get(cesc2("#/problem1/_p1"))
      .invoke("text")
      .then((text) => {
        let titleOptions = animalOptions.map((x) => `What does the ${x} say?`);
        problem1Version = titleOptions.indexOf(text);
        expect(problem1Version).not.eq(-1);
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let copy1Name = stateVariables["/problem1"].replacementOf;
          let copy2Name = stateVariables["/problem2"].replacementOf;
          expect(stateVariables[copy1Name].stateValues.cid).eq(
            "bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu",
          );
          expect(stateVariables[copy1Name].stateValues.doenetId).eq("abcdefg");
          expect(stateVariables[copy2Name].stateValues.cid).eq(
            "bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti",
          );
          expect(stateVariables[copy2Name].stateValues.doenetId).eq(
            "hijklmnop",
          );
        });
      });

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("be.visible");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback1")).should(
        "have.text",
        `That's right, the ${animal} goes ${sound}!`,
      );
      cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
    });

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("not.exist");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("be.visible");
      cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback2")).should("have.text", `Try again.`);
    });

    cy.get(cesc2("#/problem2/_title1")).should(
      "have.text",
      "Derivative problem",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/problem2/_answer1"].stateValues.inputChildren[0]
          .componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
      let mathinputCorrectAnchor = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrectAnchor = cesc2("#" + mathinputName + "_incorrect");

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type("2y{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("not.exist");
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type("{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinputIncorrectAnchor).should("not.exist");
    });
  });

  it("copy uri two problems, with copyFromUri", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Two problems</title>

    <problem name="problem1" copyFromUri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" />
    
    <problem name="problem2" copyFromUri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" />
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_title1")).should("have.text", "Two problems"); // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"];

    cy.get(cesc2("#/problem1/_title1")).should("have.text", "Animal sounds");

    cy.get(cesc2("#/problem1/_p1"))
      .invoke("text")
      .then((text) => {
        let titleOptions = animalOptions.map((x) => `What does the ${x} say?`);
        problem1Version = titleOptions.indexOf(text);
        expect(problem1Version).not.eq(-1);
      });

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("be.visible");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback1")).should(
        "have.text",
        `That's right, the ${animal} goes ${sound}!`,
      );
      cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
    });

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("not.exist");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("be.visible");
      cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback2")).should("have.text", `Try again.`);
    });

    cy.get(cesc2("#/problem2/_title1")).should(
      "have.text",
      "Derivative problem",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/problem2/_answer1"].stateValues.inputChildren[0]
          .componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
      let mathinputCorrectAnchor = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrectAnchor = cesc2("#" + mathinputName + "_incorrect");

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type("2y{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("not.exist");
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type("{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinputIncorrectAnchor).should("not.exist");
    });
  });

  it("copy uri two problems, with copyFromUri, change titles, add content, change attribute", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Two problems</title>

    <problem name="problem1" copyFromUri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" >
      <title>Extra animal sounds</title>

      <p>New content at bottom</p>
    </problem>
    
    <problem name="problem2" copyFromUri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" sectionWideCheckWork>
      <title>Derivative with second derivative</title>

      <p>What is the second derivative of <math copySource="problem2/expr" />?
      <answer>
        <award>
          <derivative>$(problem2/_derivative1)</derivative>
        </award>
      </answer>
    </p>
    </problem>

    <p>End paragraph</p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_title1")).should("have.text", "Two problems"); // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"];

    cy.get(cesc2("#/problem1/_title1")).should("not.exist");
    cy.get(cesc2("#/_title2")).should("have.text", "Extra animal sounds");
    cy.get(cesc2("#/_p1")).should("have.text", "New content at bottom");
    cy.get(cesc2("#/_p3")).should("have.text", "End paragraph");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1"].stateValues.title).eq(
        "Extra animal sounds",
      );
    });

    cy.get(cesc2("#/problem1/_p1"))
      .invoke("text")
      .then((text) => {
        let titleOptions = animalOptions.map((x) => `What does the ${x} say?`);
        problem1Version = titleOptions.indexOf(text);
        expect(problem1Version).not.eq(-1);
      });

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("be.visible");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback1")).should(
        "have.text",
        `That's right, the ${animal} goes ${sound}!`,
      );
      cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
    });

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("not.exist");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("be.visible");
      cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback2")).should("have.text", `Try again.`);
    });

    cy.get(cesc2("#/problem2/_title1")).should("not.exist");
    cy.get(cesc2("#/_title3")).should(
      "have.text",
      "Derivative with second derivative",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/problem2/_answer1"].stateValues.inputChildren[0]
          .componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";

      let mathinput2Name =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinput2Anchor = cesc2("#" + mathinput2Name) + " textarea";

      expect(stateVariables["/problem2"].stateValues.title).eq(
        "Derivative with second derivative",
      );

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type("2y{enter}", { force: true });
      cy.get(cesc2("#/problem2_submit")).click();
      cy.get(cesc2("#/problem2_incorrect")).should("be.visible");

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
      cy.get(cesc2("#/problem2_submit")).click();
      cy.get(cesc2("#/problem2_partial")).should("contain.text", "50%");

      cy.log(`enter incorrect answer for problem 2, part 2`);
      cy.get(mathinput2Anchor).type("3{enter}", { force: true });
      cy.get(cesc2("#/problem2_submit")).click();
      cy.get(cesc2("#/problem2_partial")).should("contain.text", "50%");

      cy.log(`enter correct answer for problem 2, part 2`);
      cy.get(mathinput2Anchor).type("{end}{backspace}2", { force: true });
      cy.get(cesc2("#/problem2_submit")).click();
      cy.get(cesc2("#/problem2_correct")).should("be.visible");
    });
  });

  it("copy uri two problems, with copyFromUri, newNamespace change titles, add content, change attribute", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Two problems</title>

    <problem name="problem1" newNamespace copyFromUri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" >
      <title>Extra animal sounds</title>

      <p>New content at bottom</p>
    </problem>
    
    <problem name="problem2" newNamespace copyFromUri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" sectionWideCheckWork>
      <title>Derivative with second derivative</title>

      <p>What is the second derivative of <math copySource="expr" />?
      <answer>
        <award>
          <derivative>$_derivative1</derivative>
        </award>
      </answer>
    </p>
    </problem>

    <p>End paragraph</p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_title1")).should("have.text", "Two problems"); // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"];

    cy.get(cesc2("#/problem1/_title1")).should("not.exist");
    cy.get(cesc2("#/problem1/_title2")).should(
      "have.text",
      "Extra animal sounds",
    );
    cy.get(cesc2("#/problem1/_p4")).should(
      "have.text",
      "New content at bottom",
    );
    cy.get(cesc2("#/_p1")).should("have.text", "End paragraph");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1"].stateValues.title).eq(
        "Extra animal sounds",
      );
    });

    cy.get(cesc2("#/problem1/_p1"))
      .invoke("text")
      .then((text) => {
        let titleOptions = animalOptions.map((x) => `What does the ${x} say?`);
        problem1Version = titleOptions.indexOf(text);
        expect(problem1Version).not.eq(-1);
      });

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("be.visible");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback1")).should(
        "have.text",
        `That's right, the ${animal} goes ${sound}!`,
      );
      cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
    });

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("not.exist");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("be.visible");
      cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback2")).should("have.text", `Try again.`);
    });

    cy.get(cesc2("#/problem2/_title1")).should("not.exist");
    cy.get(cesc2("#/problem2/_title2")).should(
      "have.text",
      "Derivative with second derivative",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/problem2/_answer1"].stateValues.inputChildren[0]
          .componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";

      let mathinput2Name =
        stateVariables["/problem2/_answer2"].stateValues.inputChildren[0]
          .componentName;
      let mathinput2Anchor = cesc2("#" + mathinput2Name) + " textarea";

      expect(stateVariables["/problem2"].stateValues.title).eq(
        "Derivative with second derivative",
      );

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type("2y{enter}", { force: true });
      cy.get(cesc2("#/problem2_submit")).click();
      cy.get(cesc2("#/problem2_incorrect")).should("be.visible");

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
      cy.get(cesc2("#/problem2_submit")).click();
      cy.get(cesc2("#/problem2_partial")).should("contain.text", "50%");

      cy.log(`enter incorrect answer for problem 2, part 2`);
      cy.get(mathinput2Anchor).type("3{enter}", { force: true });
      cy.get(cesc2("#/problem2_submit")).click();
      cy.get(cesc2("#/problem2_partial")).should("contain.text", "50%");

      cy.log(`enter correct answer for problem 2, part 2`);
      cy.get(mathinput2Anchor).type("{end}{backspace}2", { force: true });
      cy.get(cesc2("#/problem2_submit")).click();
      cy.get(cesc2("#/problem2_correct")).should("be.visible");
    });
  });

  it("copy uri two problems, change attribute but cannot change titles or add content without copyFromUri", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Two problems</title>

    <copy name="problem1" uri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" >
      <title>Extra animal sounds</title>

      <p>New content at bottom</p>
    </copy>
    
    <copy name="problem2" uri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" sectionWideCheckWork>
      <title>Derivative with second derivative</title>

      <p>What is the second derivative of <math copySource="problem2/expr" />?
      <answer>
        <award>
          <derivative>$(problem2/_derivative1)</derivative>
        </award>
      </answer>
    </p>
    </copy>
    <p>End paragraph</p>

    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_title1")).should("have.text", "Two problems"); // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"];

    cy.get(cesc2("#/problem1/_title1")).should("have.text", "Animal sounds");
    cy.get(cesc2("#/_title2")).should("not.exist");
    cy.get(cesc2("#/_p1")).should("not.exist");
    cy.get(cesc2("#/_p3")).should("have.text", "End paragraph");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1"].stateValues.title).eq("Animal sounds");
    });

    cy.get(cesc2("#/problem1/_p1"))
      .invoke("text")
      .then((text) => {
        let titleOptions = animalOptions.map((x) => `What does the ${x} say?`);
        problem1Version = titleOptions.indexOf(text);
        expect(problem1Version).not.eq(-1);
      });

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("be.visible");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback1")).should(
        "have.text",
        `That's right, the ${animal} goes ${sound}!`,
      );
      cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
    });

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("not.exist");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("be.visible");
      cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback2")).should("have.text", `Try again.`);
    });

    cy.get(cesc2("#/problem2/_title1")).should(
      "have.text",
      "Derivative problem",
    );
    cy.get(cesc2("#/_title3")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/problem2/_answer1"].stateValues.inputChildren[0]
          .componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";

      expect(stateVariables["/_answer1"]).eq(undefined);

      expect(stateVariables["/problem2"].stateValues.title).eq(
        "Derivative problem",
      );

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type("2y{enter}", { force: true });
      cy.get(cesc2("#/problem2_submit")).click();
      cy.get(cesc2("#/problem2_incorrect")).should("be.visible");

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
      cy.get(cesc2("#/problem2_submit")).click();
      cy.get(cesc2("#/problem2_correct")).should("be.visible");
    });
  });

  it("copy uri containing copy uri of two problems", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Four problems</title>

    <copy name="problem12" uri="doenet:CID=bafkreid5s6fwzzfaax7pr3d2i2iu2743vvzrvttjy55vcmvunka7nu3ope" />
    
    <copy name="problem34" newNamespace uri="doenet:CID=bafkreid5s6fwzzfaax7pr3d2i2iu2743vvzrvttjy55vcmvunka7nu3ope" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_title1")).should("have.text", "Four problems"); // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"];

    cy.get(cesc2("#/problem12/problem1/_p1"))
      .invoke("text")
      .then((text) => {
        let titleOptions = animalOptions.map((x) => `What does the ${x} say?`);
        problem1Version = titleOptions.indexOf(text);
        expect(problem1Version).not.eq(-1);
      });

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version];
      cy.get(cesc2("#/problem12/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_correct")).should(
        "be.visible",
      );
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_incorrect")).should(
        "not.exist",
      );
      cy.get(cesc2("#/problem12/problem1/_feedback1")).should(
        "have.text",
        `That's right, the ${animal} goes ${sound}!`,
      );
      cy.get(cesc2("#/problem12/problem1/_feedback2")).should("not.exist");
    });

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd];
      cy.get(cesc2("#/problem12/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_correct")).should(
        "not.exist",
      );
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_incorrect")).should(
        "be.visible",
      );
      cy.get(cesc2("#/problem12/problem1/_feedback1")).should("not.exist");
      cy.get(cesc2("#/problem12/problem1/_feedback2")).should(
        "have.text",
        `Try again.`,
      );
    });

    cy.get(cesc2("#/problem12/problem2/_title1")).should(
      "have.text",
      "Derivative problem",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/problem12/problem2/_answer1"].stateValues
          .inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
      let mathinputCorrectAnchor = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrectAnchor = cesc2("#" + mathinputName + "_incorrect");

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type("2y{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("not.exist");
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type("{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinputIncorrectAnchor).should("not.exist");
    });

    cy.get(cesc2("#/problem34/problem1/_p1"))
      .invoke("text")
      .then((text) => {
        let titleOptions = animalOptions.map((x) => `What does the ${x} say?`);
        problem1Version = titleOptions.indexOf(text);
        expect(problem1Version).not.eq(-1);
      });

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version];
      cy.get(cesc2("#/problem34/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_correct")).should(
        "be.visible",
      );
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_incorrect")).should(
        "not.exist",
      );
      cy.get(cesc2("#/problem34/problem1/_feedback1")).should(
        "have.text",
        `That's right, the ${animal} goes ${sound}!`,
      );
      cy.get(cesc2("#/problem34/problem1/_feedback2")).should("not.exist");
    });

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd];
      cy.get(cesc2("#/problem34/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_correct")).should(
        "not.exist",
      );
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_incorrect")).should(
        "be.visible",
      );
      cy.get(cesc2("#/problem34/problem1/_feedback1")).should("not.exist");
      cy.get(cesc2("#/problem34/problem1/_feedback2")).should(
        "have.text",
        `Try again.`,
      );
    });

    cy.get(cesc2("#/problem34/problem2/_title1")).should(
      "have.text",
      "Derivative problem",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/problem34/problem2/_answer1"].stateValues
          .inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
      let mathinputCorrectAnchor = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrectAnchor = cesc2("#" + mathinputName + "_incorrect");

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type("2y{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("not.exist");
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type("{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinputIncorrectAnchor).should("not.exist");
    });
  });

  // this triggered an error not caught with the other order
  it("copy uri containing copy uri of two problems, newNamespace first", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Four problems</title>

    <copy name="problem12" newNamespace uri="doenet:CID=bafkreid5s6fwzzfaax7pr3d2i2iu2743vvzrvttjy55vcmvunka7nu3ope" />
    
    <copy name="problem34" uri="doenet:CID=bafkreid5s6fwzzfaax7pr3d2i2iu2743vvzrvttjy55vcmvunka7nu3ope" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_title1")).should("have.text", "Four problems"); // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"];

    cy.get(cesc2("#/problem12/problem1/_p1"))
      .invoke("text")
      .then((text) => {
        let titleOptions = animalOptions.map((x) => `What does the ${x} say?`);
        problem1Version = titleOptions.indexOf(text);
        expect(problem1Version).not.eq(-1);
      });

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version];
      cy.get(cesc2("#/problem12/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_correct")).should(
        "be.visible",
      );
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_incorrect")).should(
        "not.exist",
      );
      cy.get(cesc2("#/problem12/problem1/_feedback1")).should(
        "have.text",
        `That's right, the ${animal} goes ${sound}!`,
      );
      cy.get(cesc2("#/problem12/problem1/_feedback2")).should("not.exist");
    });

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd];
      cy.get(cesc2("#/problem12/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_correct")).should(
        "not.exist",
      );
      cy.get(cesc2("#/problem12/problem1/_choiceinput1_incorrect")).should(
        "be.visible",
      );
      cy.get(cesc2("#/problem12/problem1/_feedback1")).should("not.exist");
      cy.get(cesc2("#/problem12/problem1/_feedback2")).should(
        "have.text",
        `Try again.`,
      );
    });

    cy.get(cesc2("#/problem12/problem2/_title1")).should(
      "have.text",
      "Derivative problem",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/problem12/problem2/_answer1"].stateValues
          .inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
      let mathinputCorrectAnchor = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrectAnchor = cesc2("#" + mathinputName + "_incorrect");

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type("2y{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("not.exist");
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type("{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinputIncorrectAnchor).should("not.exist");
    });

    cy.get(cesc2("#/problem34/problem1/_p1"))
      .invoke("text")
      .then((text) => {
        let titleOptions = animalOptions.map((x) => `What does the ${x} say?`);
        problem1Version = titleOptions.indexOf(text);
        expect(problem1Version).not.eq(-1);
      });

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version];
      cy.get(cesc2("#/problem34/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_correct")).should(
        "be.visible",
      );
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_incorrect")).should(
        "not.exist",
      );
      cy.get(cesc2("#/problem34/problem1/_feedback1")).should(
        "have.text",
        `That's right, the ${animal} goes ${sound}!`,
      );
      cy.get(cesc2("#/problem34/problem1/_feedback2")).should("not.exist");
    });

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd];
      cy.get(cesc2("#/problem34/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_correct")).should(
        "not.exist",
      );
      cy.get(cesc2("#/problem34/problem1/_choiceinput1_incorrect")).should(
        "be.visible",
      );
      cy.get(cesc2("#/problem34/problem1/_feedback1")).should("not.exist");
      cy.get(cesc2("#/problem34/problem1/_feedback2")).should(
        "have.text",
        `Try again.`,
      );
    });

    cy.get(cesc2("#/problem34/problem2/_title1")).should(
      "have.text",
      "Derivative problem",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/problem34/problem2/_answer1"].stateValues
          .inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
      let mathinputCorrectAnchor = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrectAnchor = cesc2("#" + mathinputName + "_incorrect");

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type("2y{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("not.exist");
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type("{end}{backspace}x", { force: true });
      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputAnchor).type("{enter}", { force: true });
      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinputIncorrectAnchor).should("not.exist");
    });
  });

  it("copy uri containing variant control", () => {
    const doenetML = `
    <title>Two variants from copied document</title>
    
    <copy name="thedoc" uri="doenet:cid=bafkreia7xqmfuhas6yrpr7hilr5khjxqsuqddgurnutqczyebj7lzw7zyy" />
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_title1")).should(
      "have.text",
      "Two variants from copied document",
    ); // to wait for page to load

    cy.get(cesc("#\\/thedoc")).should("contain.text", "first");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(
        stateVariables["/thedoc"].sharedParameters.allPossibleVariants,
      ).eqls(["first", "last"]);
      expect(stateVariables["/thedoc"].sharedParameters.variantName).eq(
        "first",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a", "b"]);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "a",
      );
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/thedoc")).should("contain.text", "last");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(
        stateVariables["/thedoc"].sharedParameters.allPossibleVariants,
      ).eqls(["first", "last"]);
      expect(stateVariables["/thedoc"].sharedParameters.variantName).eq("last");
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a", "b"]);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "b",
      );
    });
  });

  it("copy uri not in a problem", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <copy name="problem1" uri="doenet:cId=bafkreidqud3rixmphu3jufuke4rw7magtcrbrjgeo6ihkoyonsig7wciey&DoenEtiD=abcdefg" />
  
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/problem1_title")).should("have.text", "Animal sounds");

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"];

    cy.get(cesc2("#/problem1/_p1"))
      .invoke("text")
      .then((text) => {
        let titleOptions = animalOptions.map((x) => `What does the ${x} say?`);
        problem1Version = titleOptions.indexOf(text);
        expect(problem1Version).not.eq(-1);
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let copy1Name = stateVariables["/problem1"].replacementOf;
          expect(stateVariables[copy1Name].stateValues.cid).eq(
            "bafkreidqud3rixmphu3jufuke4rw7magtcrbrjgeo6ihkoyonsig7wciey",
          );
          expect(stateVariables[copy1Name].stateValues.doenetId).eq("abcdefg");
        });
      });

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("be.visible");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback1")).should(
        "have.text",
        `That's right, the ${animal} goes ${sound}!`,
      );
      cy.get(cesc2("#/problem1/_feedback2")).should("not.exist");
    });

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd];
      cy.get(cesc2("#/problem1/_choiceinput1"))
        .contains(sound)
        .click({ force: true });
      cy.get(cesc2("#/problem1/_choiceinput1_submit")).click();
      cy.get(cesc2("#/problem1/_choiceinput1_correct")).should("not.exist");
      cy.get(cesc2("#/problem1/_choiceinput1_incorrect")).should("be.visible");
      cy.get(cesc2("#/problem1/_feedback1")).should("not.exist");
      cy.get(cesc2("#/problem1/_feedback2")).should("have.text", `Try again.`);
    });
  });

  it("copyFromUri for uri not in a problem yields nothing", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <problem name="problem1" copyFromUri="doenet:cId=bafkreidqud3rixmphu3jufuke4rw7magtcrbrjgeo6ihkoyonsig7wciey&DoenEtiD=abcdefg" />
  
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/problem1_title")).should("have.text", "Problem 1");

    cy.get(cesc("#\\/_document1")).should("not.contain.text", "Animal sounds");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(Object.keys(stateVariables).length).eq(3);
    });
  });

  it("copy of component that changes away from a copy", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <booleaninput name="b" />

    <setup>
      <text name="jump">jump</text>
    </setup>

    <p name="forVerb"><conditionalContent assignNames="(verb)">
      <case condition="$b"><text>skip</text></case>
      <else>$jump</else>
    </conditionalContent></p>

    <copy source="verb" name="verb2" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/forVerb")).should("have.text", "jump");
    cy.get(cesc("#\\/verb2")).should("have.text", "jump");

    cy.get(cesc("#\\/b")).click();
    cy.get(cesc("#\\/forVerb")).should("have.text", "skip");
    cy.get(cesc("#\\/verb2")).should("have.text", "skip");

    cy.get(cesc("#\\/b")).click();
    cy.get(cesc("#\\/forVerb")).should("have.text", "jump");
    cy.get(cesc("#\\/verb2")).should("have.text", "jump");

    cy.get(cesc("#\\/b")).click();
    cy.get(cesc("#\\/forVerb")).should("have.text", "skip");
    cy.get(cesc("#\\/verb2")).should("have.text", "skip");
  });

  it("copy of component that changes away from a copy, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <booleaninput name="b" />

    <setup>
      <text name="jump">jump</text>
    </setup>

    <p name="forVerb"><conditionalContent assignNames="(verb)">
      <case condition="$b"><text>skip</text></case>
      <else>$jump</else>
    </conditionalContent></p>

    $verb{name="verb2"}
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/forVerb")).should("have.text", "jump");
    cy.get(cesc("#\\/verb2")).should("have.text", "jump");

    cy.get(cesc("#\\/b")).click();
    cy.get(cesc("#\\/forVerb")).should("have.text", "skip");
    cy.get(cesc("#\\/verb2")).should("have.text", "skip");

    cy.get(cesc("#\\/b")).click();
    cy.get(cesc("#\\/forVerb")).should("have.text", "jump");
    cy.get(cesc("#\\/verb2")).should("have.text", "jump");

    cy.get(cesc("#\\/b")).click();
    cy.get(cesc("#\\/forVerb")).should("have.text", "skip");
    cy.get(cesc("#\\/verb2")).should("have.text", "skip");
  });

  it("copy of component that changes away from a copy, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <booleaninput name="b" />
    
    <setup>
      <text name="jump">jump</text>
    </setup>

    <p name="forVerb"><conditionalContent assignNames="(verb)">
      <case condition="$b"><text>skip</text></case>
      <else>$jump</else>
    </conditionalContent></p>

    <text copySource="verb" name="verb2" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/forVerb")).should("have.text", "jump");
    cy.get(cesc("#\\/verb2")).should("have.text", "jump");

    cy.get(cesc("#\\/b")).click();
    cy.get(cesc("#\\/forVerb")).should("have.text", "skip");
    cy.get(cesc("#\\/verb2")).should("have.text", "skip");

    cy.get(cesc("#\\/b")).click();
    cy.get(cesc("#\\/forVerb")).should("have.text", "jump");
    cy.get(cesc("#\\/verb2")).should("have.text", "jump");

    cy.get(cesc("#\\/b")).click();
    cy.get(cesc("#\\/forVerb")).should("have.text", "skip");
    cy.get(cesc("#\\/verb2")).should("have.text", "skip");
  });

  it("copy of invalid source gives math in boolean and math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>We can't see $invalid in paragraph <text>or $invisible in text</text>.</p>

    <p>In math, we can: <math>$bad + $nothing</math></p>

    <p>And in boolean as well: <boolean>not ($missing = x)</boolean></p>.

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should(
      "have.text",
      "We can't see  in paragraph or  in text.",
    );

    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿+＿");
      });

    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("copy no link, base test", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Simplify of original: <textinput name="s1" prefill="full" /></p>
    <p>Simplify of copies: <textinput name="s2" prefill="none" /></p>

    <p>Original: <math name="m" simplify="$s1">x +x</math></p>
    
    <p>Unlinked copy: <copy link="false" source="m" simplify="$s2" name="m2" /></p>

    <p>Linked copy: <copy source="m" simplify="$s2" name="m3" /></p>
    
    <p>Double value of original: <updateValue target="m" newValue="2$m" name="doubleOriginal" >
      <label>double original</label>
    </updateValue></p>
    <p>Double value of copy 1: <updateValue target="m2" newValue="2$m2" name="doubleCopy1" >
      <label>double copy 1</label>
    </updateValue></p>
    <p>Double value of copy 2: <updateValue target="m3" newValue="2$m3" name="doubleCopy2" >
      <label>double copy 2</label>
    </updateValue></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let copy1Name = stateVariables["/m2"].replacementOf;
      let copy2Name = stateVariables["/m3"].replacementOf;
      expect(stateVariables[copy1Name].stateValues.link).eq(false);
      expect(stateVariables[copy2Name].stateValues.link).eq(true);
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["+", "x", "x"]);
    });

    cy.log("simplify copies");
    cy.get(cesc("#\\/s2_input")).clear().type("full{enter}");

    cy.get(cesc(`#\\/m2`)).should("contain.text", "2x");
    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, "x"]);
    });

    cy.log("stop simplifying original");
    cy.get(cesc("#\\/s1_input")).clear().type("none{enter}");

    cy.get(cesc(`#\\/m`)).should("contain.text", "x+x");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["+", "x", "x"]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, "x"]);
    });

    cy.log("double original");
    cy.get(cesc("#\\/doubleOriginal_button")).click();

    cy.get(cesc(`#\\/m`)).should("contain.text", "2(x+x)");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2(x+x)");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("4x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls([
        "*",
        2,
        ["+", "x", "x"],
      ]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 4, "x"]);
    });

    cy.log("double copy1");
    cy.get(cesc("#\\/doubleCopy1_button")).click();

    cy.get(cesc(`#\\/m2`)).should("contain.text", "4x");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2(x+x)");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("4x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("4x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls([
        "*",
        2,
        ["+", "x", "x"],
      ]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 4, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 4, "x"]);
    });

    cy.log("double copy2");
    cy.get(cesc("#\\/doubleCopy2_button")).click();

    cy.get(cesc(`#\\/m3`)).should("contain.text", "8x");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2⋅4x");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("4x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("8x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, 4, "x"]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 4, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 8, "x"]);
    });

    cy.log("stop simplifying copies");
    cy.get(cesc("#\\/s2_input")).clear().type("none{enter}");

    cy.get(cesc(`#\\/m2`)).should("contain.text", "2⋅2x");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2⋅4x");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2⋅2x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2⋅4x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, 4, "x"]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, 2, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, 4, "x"]);
    });
  });

  it("copy no link, base test, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Simplify of original: <textinput name="s1" prefill="full" /></p>
    <p>Simplify of copies: <textinput name="s2" prefill="none" /></p>

    <p>Original: <math name="m" simplify="$s1">x +x</math></p>
    
    <p>Unlinked copy: <math link="false" copySource="m" simplify="$s2" name="m2" /></p>

    <p>Linked copy: <math copySource="m" simplify="$s2" name="m3" /></p>
    
    <p>Double value of original: <updateValue target="m" newValue="2$m" name="doubleOriginal" >
      <label>double original</label>
    </updateValue></p>
    <p>Double value of copy 1: <updateValue target="m2" newValue="2$m2" name="doubleCopy1" >
      <label>double copy 1</label>
    </updateValue></p>
    <p>Double value of copy 2: <updateValue target="m3" newValue="2$m3" name="doubleCopy2" >
      <label>double copy 2</label>
    </updateValue></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let copy1Name = stateVariables["/m2"].replacementOf;
      let copy2Name = stateVariables["/m3"].replacementOf;
      expect(stateVariables[copy1Name].stateValues.link).eq(false);
      expect(stateVariables[copy2Name].stateValues.link).eq(true);
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["+", "x", "x"]);
    });

    cy.log("simplify copies");
    cy.get(cesc("#\\/s2_input")).clear().type("full{enter}");

    cy.get(cesc(`#\\/m2`)).should("contain.text", "2x");
    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, "x"]);
    });

    cy.log("stop simplifying original");
    cy.get(cesc("#\\/s1_input")).clear().type("none{enter}");

    cy.get(cesc(`#\\/m`)).should("contain.text", "x+x");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["+", "x", "x"]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, "x"]);
    });

    cy.log("double original");
    cy.get(cesc("#\\/doubleOriginal_button")).click();

    cy.get(cesc(`#\\/m`)).should("contain.text", "2(x+x)");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2(x+x)");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("4x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls([
        "*",
        2,
        ["+", "x", "x"],
      ]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 4, "x"]);
    });

    cy.log("double copy1");
    cy.get(cesc("#\\/doubleCopy1_button")).click();

    cy.get(cesc(`#\\/m2`)).should("contain.text", "4x");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2(x+x)");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("4x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("4x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls([
        "*",
        2,
        ["+", "x", "x"],
      ]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 4, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 4, "x"]);
    });

    cy.log("double copy2");
    cy.get(cesc("#\\/doubleCopy2_button")).click();

    cy.get(cesc(`#\\/m3`)).should("contain.text", "8x");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2⋅4x");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("4x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("8x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, 4, "x"]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 4, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 8, "x"]);
    });

    cy.log("stop simplifying copies");
    cy.get(cesc("#\\/s2_input")).clear().type("none{enter}");

    cy.get(cesc(`#\\/m2`)).should("contain.text", "2⋅2x");

    cy.get(cesc(`#\\/m`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2⋅4x");
      });
    cy.get(cesc(`#\\/m2`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2⋅2x");
      });
    cy.get(cesc(`#\\/m3`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2⋅4x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, 4, "x"]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, 2, "x"]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, 4, "x"]);
    });
  });

  it("copy points and lines with no link", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      <copy source="A" link="false" name="A2" />
      <copy source="l" link="false" name="l2" />
    </graph>
    
    <graph>
      <copy source="l" prop="point1" link="false" assignNames="A3" />
    </graph>
    <graph>
      <copy source="l" prop="points" link="false" assignNames="A4 B4"  />
    </graph>

    <copy source="g" link="false" name="gnolink" newNamespace />
    
    <copy source="A" prop="x" link="false" assignNames="Ax"  />

    <p>
      <copy source="A" name="Ac" />
      <copy source="B" name="Bc" />
      <copy prop="point1" source="l" assignNames="lp1" />
      <copy source="A2" name="A2c" />
      <copy prop="point1" source="l2" assignNames="l2p1" />
      <copy source="A3" name="A3c" />
      <copy source="A4" name="A4c" />
      <copy source="B4" name="B4c" />
      <copy source="gnolink/A" name="A5c" />
      <copy source="gnolink/B" name="B5c" />
      <copy prop="point1" source="gnolink/l" assignNames="l3p1" />

    </p>
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc(`#\\/Ax`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let copyForA2 = stateVariables["/A2"].replacementOf;
      let copyForl2 = stateVariables["/l2"].replacementOf;
      let copyForA3 = stateVariables["/A3"].replacementOf;
      let copyForA4B4 = stateVariables["/A4"].replacementOf;
      let copyForgnolink = stateVariables["/gnolink"].replacementOf;
      let copyForAx = stateVariables["/Ax"].replacementOf;
      expect(stateVariables[copyForA2].stateValues.link).eq(false);
      expect(stateVariables[copyForl2].stateValues.link).eq(false);
      expect(stateVariables[copyForA3].stateValues.link).eq(false);
      expect(stateVariables[copyForA4B4].stateValues.link).eq(false);
      expect(stateVariables[copyForgnolink].stateValues.link).eq(false);
      expect(stateVariables[copyForAx].stateValues.link).eq(false);
      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -9, y: -3 },
      });
    });

    cy.get(cesc("#\\/Ac")).should(
      "contain.text",
      `(${nInDOM(-9)},${nInDOM(-3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3]);
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -2, y: 6 },
      });
    });

    cy.get(cesc("#\\/Bc")).should(
      "contain.text",
      `(${nInDOM(-2)},${nInDOM(6)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3]);
      expect(stateVariables["/B"].stateValues.xs).eqls([-2, 6]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3]);
      expect(stateVariables["/l"].stateValues.point2).eqls([-2, 6]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [-7, -6],
          point2coords: [8, 0],
        },
      });
    });

    cy.get(cesc("#\\/lp1")).should(
      "contain.text",
      `(${nInDOM(-7)},${nInDOM(-6)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: 5, y: 4 },
      });
    });

    cy.get(cesc("#\\/A2c")).should(
      "contain.text",
      `(${nInDOM(5)},${nInDOM(4)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [-5, 9],
          point2coords: [-4, -1],
        },
      });
    });

    cy.get(cesc("#\\/l2p1")).should(
      "contain.text",
      `(${nInDOM(-5)},${nInDOM(9)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A3",
        args: { x: 6, y: -3 },
      });
    });

    cy.get(cesc("#\\/A3c")).should(
      "contain.text",
      `(${nInDOM(6)},${nInDOM(-3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A4");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A4",
        args: { x: -2, y: 7 },
      });
    });

    cy.get(cesc("#\\/A4c")).should(
      "contain.text",
      `(${nInDOM(-2)},${nInDOM(7)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B4");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B4",
        args: { x: -9, y: -8 },
      });
    });

    cy.get(cesc("#\\/B4c")).should(
      "contain.text",
      `(${nInDOM(-9)},${nInDOM(-8)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A5");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/A",
        args: { x: -10, y: -9 },
      });
    });

    cy.get(cesc("#\\/A5c")).should(
      "contain.text",
      `(${nInDOM(-10)},${nInDOM(-9)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B5");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/B",
        args: { x: -8, y: -7 },
      });
    });

    cy.get(cesc("#\\/B5c")).should(
      "contain.text",
      `(${nInDOM(-8)},${nInDOM(-7)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([-8, -7]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([-8, -7]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/gnolink/l",
        args: {
          point1coords: [6, 5],
          point2coords: [4, -3],
        },
      });
    });

    cy.get(cesc("#\\/l3p1")).should(
      "contain.text",
      `(${nInDOM(6)},${nInDOM(5)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([6, 5]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([4, -3]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([6, 5]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([4, -3]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });
  });

  it("copy points and lines with no link, dot notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      <copy source="A" link="false" name="A2" />
      <copy source="l" link="false" name="l2" />
    </graph>
    
    <graph>
      <copy source="l.point1" link="false" assignNames="A3" />
    </graph>
    <graph>
      <copy source="l.points" link="false" assignNames="A4 B4"  />
    </graph>

    <copy source="g" link="false" name="gnolink" newNamespace />
    
    <copy source="A.x" link="false" assignNames="Ax"  />

    <p>
      <copy source="A" name="Ac" />
      <copy source="B" name="Bc" />
      <copy source="l.point1" assignNames="lp1" />
      <copy source="A2" name="A2c" />
      <copy source="l2.point1" assignNames="l2p1" />
      <copy source="A3" name="A3c" />
      <copy source="A4" name="A4c" />
      <copy source="B4" name="B4c" />
      <copy source="gnolink/A" name="A5c" />
      <copy source="gnolink/B" name="B5c" />
      <copy source="gnolink/l.point1" assignNames="l3p1" />

    </p>
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc(`#\\/Ax`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let copyForA2 = stateVariables["/A2"].replacementOf;
      let copyForl2 = stateVariables["/l2"].replacementOf;
      let copyForA3 = stateVariables["/A3"].replacementOf;
      let copyForA4B4 = stateVariables["/A4"].replacementOf;
      let copyForgnolink = stateVariables["/gnolink"].replacementOf;
      let copyForAx = stateVariables["/Ax"].replacementOf;
      expect(stateVariables[copyForA2].stateValues.link).eq(false);
      expect(stateVariables[copyForl2].stateValues.link).eq(false);
      expect(stateVariables[copyForA3].stateValues.link).eq(false);
      expect(stateVariables[copyForA4B4].stateValues.link).eq(false);
      expect(stateVariables[copyForgnolink].stateValues.link).eq(false);
      expect(stateVariables[copyForAx].stateValues.link).eq(false);
      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -9, y: -3 },
      });
    });

    cy.get(cesc("#\\/Ac")).should(
      "contain.text",
      `(${nInDOM(-9)},${nInDOM(-3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3]);
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -2, y: 6 },
      });
    });

    cy.get(cesc("#\\/Bc")).should(
      "contain.text",
      `(${nInDOM(-2)},${nInDOM(6)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3]);
      expect(stateVariables["/B"].stateValues.xs).eqls([-2, 6]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3]);
      expect(stateVariables["/l"].stateValues.point2).eqls([-2, 6]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [-7, -6],
          point2coords: [8, 0],
        },
      });
    });

    cy.get(cesc("#\\/lp1")).should(
      "contain.text",
      `(${nInDOM(-7)},${nInDOM(-6)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: 5, y: 4 },
      });
    });

    cy.get(cesc("#\\/A2c")).should(
      "contain.text",
      `(${nInDOM(5)},${nInDOM(4)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [-5, 9],
          point2coords: [-4, -1],
        },
      });
    });

    cy.get(cesc("#\\/l2p1")).should(
      "contain.text",
      `(${nInDOM(-5)},${nInDOM(9)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A3",
        args: { x: 6, y: -3 },
      });
    });

    cy.get(cesc("#\\/A3c")).should(
      "contain.text",
      `(${nInDOM(6)},${nInDOM(-3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A4");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A4",
        args: { x: -2, y: 7 },
      });
    });

    cy.get(cesc("#\\/A4c")).should(
      "contain.text",
      `(${nInDOM(-2)},${nInDOM(7)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B4");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B4",
        args: { x: -9, y: -8 },
      });
    });

    cy.get(cesc("#\\/B4c")).should(
      "contain.text",
      `(${nInDOM(-9)},${nInDOM(-8)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A5");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/A",
        args: { x: -10, y: -9 },
      });
    });

    cy.get(cesc("#\\/A5c")).should(
      "contain.text",
      `(${nInDOM(-10)},${nInDOM(-9)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B5");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/B",
        args: { x: -8, y: -7 },
      });
    });

    cy.get(cesc("#\\/B5c")).should(
      "contain.text",
      `(${nInDOM(-8)},${nInDOM(-7)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([-8, -7]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([-8, -7]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/gnolink/l",
        args: {
          point1coords: [6, 5],
          point2coords: [4, -3],
        },
      });
    });

    cy.get(cesc("#\\/l3p1")).should(
      "contain.text",
      `(${nInDOM(6)},${nInDOM(5)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([6, 5]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([4, -3]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([6, 5]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([4, -3]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });
  });

  it("copy points and lines with no link, dot notation, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      $A{link="false" name="A2"}
      $l{link="false" name="l2"}
    </graph>
    
    <graph>
      $(l.point1{link="false" assignNames="A3"})
    </graph>
    <graph>
      $(l.points{link="false" assignNames="A4 B4" })
    </graph>

    $g{link="false" name="gnolink" newNamespace}
    
    $(A.x{link="false" assignNames="Ax" })

    <p>
      $A{name="Ac"}
      $B{name="Bc"}
      $(l.point1{assignNames="lp1"})
      $A2{name="A2c"}
      $(l2.point1{assignNames="l2p1"})
      $A3{name="A3c"}
      $A4{name="A4c"}
      $B4{name="B4c"}
      $(gnolink/A{name="A5c"})
      $(gnolink/B{name="B5c"})
      $(gnolink/l.point1{assignNames="l3p1"})

    </p>
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc(`#\\/Ax`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let copyForA2 = stateVariables["/A2"].replacementOf;
      let copyForl2 = stateVariables["/l2"].replacementOf;
      let copyForA3 = stateVariables["/A3"].replacementOf;
      let copyForA4B4 = stateVariables["/A4"].replacementOf;
      let copyForgnolink = stateVariables["/gnolink"].replacementOf;
      let copyForAx = stateVariables["/Ax"].replacementOf;
      expect(stateVariables[copyForA2].stateValues.link).eq(false);
      expect(stateVariables[copyForl2].stateValues.link).eq(false);
      expect(stateVariables[copyForA3].stateValues.link).eq(false);
      expect(stateVariables[copyForA4B4].stateValues.link).eq(false);
      expect(stateVariables[copyForgnolink].stateValues.link).eq(false);
      expect(stateVariables[copyForAx].stateValues.link).eq(false);
      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -9, y: -3 },
      });
    });

    cy.get(cesc("#\\/Ac")).should(
      "contain.text",
      `(${nInDOM(-9)},${nInDOM(-3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3]);
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -2, y: 6 },
      });
    });

    cy.get(cesc("#\\/Bc")).should(
      "contain.text",
      `(${nInDOM(-2)},${nInDOM(6)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3]);
      expect(stateVariables["/B"].stateValues.xs).eqls([-2, 6]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3]);
      expect(stateVariables["/l"].stateValues.point2).eqls([-2, 6]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [-7, -6],
          point2coords: [8, 0],
        },
      });
    });

    cy.get(cesc("#\\/lp1")).should(
      "contain.text",
      `(${nInDOM(-7)},${nInDOM(-6)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: 5, y: 4 },
      });
    });

    cy.get(cesc("#\\/A2c")).should(
      "contain.text",
      `(${nInDOM(5)},${nInDOM(4)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [-5, 9],
          point2coords: [-4, -1],
        },
      });
    });

    cy.get(cesc("#\\/l2p1")).should(
      "contain.text",
      `(${nInDOM(-5)},${nInDOM(9)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A3",
        args: { x: 6, y: -3 },
      });
    });

    cy.get(cesc("#\\/A3c")).should(
      "contain.text",
      `(${nInDOM(6)},${nInDOM(-3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A4");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A4",
        args: { x: -2, y: 7 },
      });
    });

    cy.get(cesc("#\\/A4c")).should(
      "contain.text",
      `(${nInDOM(-2)},${nInDOM(7)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B4");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B4",
        args: { x: -9, y: -8 },
      });
    });

    cy.get(cesc("#\\/B4c")).should(
      "contain.text",
      `(${nInDOM(-9)},${nInDOM(-8)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A5");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/A",
        args: { x: -10, y: -9 },
      });
    });

    cy.get(cesc("#\\/A5c")).should(
      "contain.text",
      `(${nInDOM(-10)},${nInDOM(-9)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B5");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/B",
        args: { x: -8, y: -7 },
      });
    });

    cy.get(cesc("#\\/B5c")).should(
      "contain.text",
      `(${nInDOM(-8)},${nInDOM(-7)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([-8, -7]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([-8, -7]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/gnolink/l",
        args: {
          point1coords: [6, 5],
          point2coords: [4, -3],
        },
      });
    });

    cy.get(cesc("#\\/l3p1")).should(
      "contain.text",
      `(${nInDOM(6)},${nInDOM(5)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([6, 5]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([4, -3]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([6, 5]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([4, -3]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });
  });

  it("copy points and lines with no link, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      <point copySource="A" link="false" name="A2" />
      <line copySource="l" link="false" name="l2" />
    </graph>
    
    <graph>
      <point copySource="l" copyProp="point1" link="false" name="A3" />
    </graph>
    <graph>
      <point copySource="l" copyProp="point1" link="false" name="A4" />
      <point copySource="l" copyProp="point2" link="false" name="B4" />
    </graph>

    <graph copySource="g" link="false" name="gnolink" newNamespace />
    
    <math copySource="A" copyProp="x" link="false" name="Ax" />

    <p>
      <point copySource="A" name="Ac" />
      <point copySource="B" name="Bc" />
      <point copyProp="point1" copySource="l" name="lp1" />
      <point copySource="A2" name="A2c" />
      <point copyProp="point1" copySource="l2" name="l2p1" />
      <point copySource="A3" name="A3c" />
      <point copySource="A4" name="A4c" />
      <point copySource="B4" name="B4c" />
      <point copySource="gnolink/A" name="A5c" />
      <point copySource="gnolink/B" name="B5c" />
      <point copyProp="point1" copySource="gnolink/l" name="l3p1" />

    </p>
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc(`#\\/Ax`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -9, y: -3 },
      });
    });

    cy.get(cesc("#\\/Ac")).should(
      "contain.text",
      `(${nInDOM(-9)},${nInDOM(-3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3]);
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -2, y: 6 },
      });
    });

    cy.get(cesc("#\\/Bc")).should(
      "contain.text",
      `(${nInDOM(-2)},${nInDOM(6)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3]);
      expect(stateVariables["/B"].stateValues.xs).eqls([-2, 6]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3]);
      expect(stateVariables["/l"].stateValues.point2).eqls([-2, 6]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [-7, -6],
          point2coords: [8, 0],
        },
      });
    });

    cy.get(cesc("#\\/lp1")).should(
      "contain.text",
      `(${nInDOM(-7)},${nInDOM(-6)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: 5, y: 4 },
      });
    });

    cy.get(cesc("#\\/A2c")).should(
      "contain.text",
      `(${nInDOM(5)},${nInDOM(4)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [-5, 9],
          point2coords: [-4, -1],
        },
      });
    });

    cy.get(cesc("#\\/l2p1")).should(
      "contain.text",
      `(${nInDOM(-5)},${nInDOM(9)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A3",
        args: { x: 6, y: -3 },
      });
    });

    cy.get(cesc("#\\/A3c")).should(
      "contain.text",
      `(${nInDOM(6)},${nInDOM(-3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A4");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A4",
        args: { x: -2, y: 7 },
      });
    });

    cy.get(cesc("#\\/A4c")).should(
      "contain.text",
      `(${nInDOM(-2)},${nInDOM(7)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B4");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B4",
        args: { x: -9, y: -8 },
      });
    });

    cy.get(cesc("#\\/B4c")).should(
      "contain.text",
      `(${nInDOM(-9)},${nInDOM(-8)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A5");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/A",
        args: { x: -10, y: -9 },
      });
    });

    cy.get(cesc("#\\/A5c")).should(
      "contain.text",
      `(${nInDOM(-10)},${nInDOM(-9)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B5");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/B",
        args: { x: -8, y: -7 },
      });
    });

    cy.get(cesc("#\\/B5c")).should(
      "contain.text",
      `(${nInDOM(-8)},${nInDOM(-7)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([-8, -7]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([-8, -7]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/gnolink/l",
        args: {
          point1coords: [6, 5],
          point2coords: [4, -3],
        },
      });
    });

    cy.get(cesc("#\\/l3p1")).should(
      "contain.text",
      `(${nInDOM(6)},${nInDOM(5)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([6, 5]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([4, -3]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([6, 5]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([4, -3]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });
  });

  it("copy points and lines with no link, with copySource, dot notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      <point copySource="A" link="false" name="A2" />
      <line copySource="l" link="false" name="l2" />
    </graph>
    
    <graph>
      <point copySource="l.point1" link="false" name="A3" />
    </graph>
    <graph>
      <point copySource="l.point1" link="false" name="A4" />
      <point copySource="l.point2" link="false" name="B4" />
    </graph>

    <graph copySource="g" link="false" name="gnolink" newNamespace />
    
    <math copySource="A.x" link="false" name="Ax" />

    <p>
      <point copySource="A" name="Ac" />
      <point copySource="B" name="Bc" />
      <point copySource="l.point1" name="lp1" />
      <point copySource="A2" name="A2c" />
      <point copySource="l2.point1" name="l2p1" />
      <point copySource="A3" name="A3c" />
      <point copySource="A4" name="A4c" />
      <point copySource="B4" name="B4c" />
      <point copySource="gnolink/A" name="A5c" />
      <point copySource="gnolink/B" name="B5c" />
      <point copySource="gnolink/l.point1" name="l3p1" />

    </p>
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc(`#\\/Ax`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -9, y: -3 },
      });
    });

    cy.get(cesc("#\\/Ac")).should(
      "contain.text",
      `(${nInDOM(-9)},${nInDOM(-3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3]);
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -2, y: 6 },
      });
    });

    cy.get(cesc("#\\/Bc")).should(
      "contain.text",
      `(${nInDOM(-2)},${nInDOM(6)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3]);
      expect(stateVariables["/B"].stateValues.xs).eqls([-2, 6]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3]);
      expect(stateVariables["/l"].stateValues.point2).eqls([-2, 6]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [-7, -6],
          point2coords: [8, 0],
        },
      });
    });

    cy.get(cesc("#\\/lp1")).should(
      "contain.text",
      `(${nInDOM(-7)},${nInDOM(-6)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: 5, y: 4 },
      });
    });

    cy.get(cesc("#\\/A2c")).should(
      "contain.text",
      `(${nInDOM(5)},${nInDOM(4)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l2");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [-5, 9],
          point2coords: [-4, -1],
        },
      });
    });

    cy.get(cesc("#\\/l2p1")).should(
      "contain.text",
      `(${nInDOM(-5)},${nInDOM(9)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A3",
        args: { x: 6, y: -3 },
      });
    });

    cy.get(cesc("#\\/A3c")).should(
      "contain.text",
      `(${nInDOM(6)},${nInDOM(-3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A4");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A4",
        args: { x: -2, y: 7 },
      });
    });

    cy.get(cesc("#\\/A4c")).should(
      "contain.text",
      `(${nInDOM(-2)},${nInDOM(7)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B4");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B4",
        args: { x: -9, y: -8 },
      });
    });

    cy.get(cesc("#\\/B4c")).should(
      "contain.text",
      `(${nInDOM(-9)},${nInDOM(-8)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move A5");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/A",
        args: { x: -10, y: -9 },
      });
    });

    cy.get(cesc("#\\/A5c")).should(
      "contain.text",
      `(${nInDOM(-10)},${nInDOM(-9)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move B5");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/B",
        args: { x: -8, y: -7 },
      });
    });

    cy.get(cesc("#\\/B5c")).should(
      "contain.text",
      `(${nInDOM(-8)},${nInDOM(-7)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([-8, -7]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([-8, -7]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });

    cy.log("move l3");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/gnolink/l",
        args: {
          point1coords: [6, 5],
          point2coords: [4, -3],
        },
      });
    });

    cy.get(cesc("#\\/l3p1")).should(
      "contain.text",
      `(${nInDOM(6)},${nInDOM(5)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6]);
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0]);
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6]);
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9]);
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1]);
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3]);
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7]);
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8]);
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([6, 5]);
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([4, -3]);
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([6, 5]);
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([4, -3]);
      expect(stateVariables["/Ax"].stateValues.value).eqls(1);
    });
  });

  it("copy string with no link", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Hello</p>
    <copy source="_p1" name="p2" link="false" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/p2")).should("have.text", "Hello");
  });

  it("copy string with no link, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Hello</p>
    $_p1{name="p2" link="false"}
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/p2")).should("have.text", "Hello");
  });

  it("copy string with no link, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Hello</p>
    <p copySource="_p1" name="p2" link="false" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/p2")).should("have.text", "Hello");
  });

  // This was causing a duplicate component name error
  it("copy group with name inside with no link", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><group name="g"><text name="m">hello</text> <copy source="m" name="q" /></group></p>
    <p><copy source="g" link="false" /></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should("have.text", "hello hello");
    cy.get(cesc("#\\/_p2")).should("have.text", "hello hello");
  });

  // This was causing a duplicate component name error
  it("copy group with name inside with no link, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><group name="g"><text name="m">hello</text> $m{name="q"}</group></p>
    <p>$g{link="false"}</p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should("have.text", "hello hello");
    cy.get(cesc("#\\/_p2")).should("have.text", "hello hello");
  });

  // This was causing a duplicate component name error
  it("copy group with assignNames inside with no link, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><group name="g"><text name="m">hello</text> $m{name="q"}</group></p>
    <p><group copySource="g" link="false" /></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_p1")).should("have.text", "hello hello");
    cy.get(cesc("#\\/_p2")).should("have.text", "hello hello");
  });

  it("copy group with copies with no link", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group>
      <p><math name="twox">x+x</math></p>
      <copy source="twox" name="twoxa" />
      <copy source="twox" name="twoxb" />
    </group>
    

    <copy source="twox" name="twoxc" />
    <copy source="twox" link="false" name="twoxd" />
    
    <copy source="twoxa" name="twoxe" />
    <copy source="twoxa" link="false" name="twoxf" />
    
    <copy source="twoxe" name="twoxg" />
    <copy source="twoxf" link="false" name="twoxh" />

    <copy source="twoxb" name="twoxi" />
    <copy source="twoxb" link="false" name="twoxj" />
    
    <copy source="twoxi" name="twoxk" />
    <copy source="twoxj" link="false" name="twoxl" />
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxb"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxc"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxd"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxe"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxf"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxg"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxh"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxi"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxj"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxk"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxl"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
  });

  it("copy group with copies with no link, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group>
      <p><math name="twox">x+x</math></p>
      $twox{name="twoxa"}
      $twox{name="twoxb"}
    </group>
    

    $twox{name="twoxc"}
    $twox{link="false" name="twoxd"}
    
    $twoxa{name="twoxe"}
    $twoxa{link="false" name="twoxf"}
    
    $twoxe{name="twoxg"}
    $twoxf{link="false" name="twoxh"}

    $twoxb{name="twoxi"}
    $twoxb{link="false" name="twoxj"}
    
    $twoxi{name="twoxk"}
    $twoxj{link="false" name="twoxl"}
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxb"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxc"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxd"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxe"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxf"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxg"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxh"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxi"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxj"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxk"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxl"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
  });

  it("copy group with copies with no link, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group>
      <p><math name="twox">x+x</math></p>
      <math copySource="twox" name="twoxa" />
      <math copySource="twox" name="twoxb" />
    </group>
    
    <math copySource="twox" name="twoxc" />
    <math copySource="twox" link="false" name="twoxd" />
    
    <math copySource="twoxa" name="twoxe" />
    <math copySource="twoxa" link="false" name="twoxf" />
    
    <math copySource="twoxe" name="twoxg" />
    <math copySource="twoxf" link="false" name="twoxh" />

    <math copySource="twoxb" name="twoxi" />
    <math copySource="twoxb" link="false" name="twoxj" />
    
    <math copySource="twoxi" name="twoxk" />
    <math copySource="twoxj" link="false" name="twoxl" />
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxb"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxc"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxd"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxe"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxf"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxg"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxh"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxi"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxj"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxk"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxl"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
  });

  it("copy group with copy overwriting attribute, no link", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name="g">
      <textinput name="sim" prefill="full" />
    
      <p><math name="twox">x+x</math>
      <copy source="twox" simplify="$sim" name="twoxa" />
      <math name="threex" simplify="$sim">x+x+x</math>
      </p>
    </group>
    
    <copy source="g" link="false" name="g2" newNamespace />
    <copy source="g2" link="false" name="g3" newNamespace />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.log("change first simplify");
    cy.get(cesc("#\\/sim_input")).clear().type("none{enter}");

    cy.get(cesc("#\\/twoxa")).should("contain.text", "x+x");
    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.log("change second simplify");
    cy.get(cesc("#\\/g2\\/sim_input")).clear().type("none{enter}");

    cy.get(cesc("#\\/g2\\/twoxa")).should("contain.text", "x+x");
    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.log("change third simplify");
    cy.get(cesc("#\\/g3\\/sim_input")).clear().type("none{enter}");

    cy.get(cesc("#\\/g3\\/twoxa")).should("contain.text", "x+x");
    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });
  });

  it("copy group with copy overwriting attribute, no link, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name="g">
      <textinput name="sim" prefill="full" />
    
      <p><math name="twox">x+x</math>
      $twox{simplify="$sim" name="twoxa"}
      <math name="threex" simplify="$sim">x+x+x</math>
      </p>
    </group>
    
    $g{link="false" name="g2" newNamespace}
    $g2{link="false" name="g3" newNamespace}
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.log("change first simplify");
    cy.get(cesc("#\\/sim_input")).clear().type("none{enter}");

    cy.get(cesc("#\\/twoxa")).should("contain.text", "x+x");
    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.log("change second simplify");
    cy.get(cesc("#\\/g2\\/sim_input")).clear().type("none{enter}");

    cy.get(cesc("#\\/g2\\/twoxa")).should("contain.text", "x+x");
    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.log("change third simplify");
    cy.get(cesc("#\\/g3\\/sim_input")).clear().type("none{enter}");

    cy.get(cesc("#\\/g3\\/twoxa")).should("contain.text", "x+x");
    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });
  });

  it("copy group with copy overwriting attribute, no link, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name="g">
      <textinput name="sim" prefill="full" />
    
      <p><math name="twox">x+x</math>
      <math copySource="twox" simplify="$sim" name="twoxa" />
      <math name="threex" simplify="$sim">x+x+x</math>
      </p>
    </group>
    
    <group copySource="g" link="false" name="g2" newNamespace />
    <group copySource="g2" link="false" name="g3" newNamespace />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.log("change first simplify");
    cy.get(cesc("#\\/sim_input")).clear().type("none{enter}");

    cy.get(cesc("#\\/twoxa")).should("contain.text", "x+x");
    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.log("change second simplify");
    cy.get(cesc("#\\/g2\\/sim_input")).clear().type("none{enter}");

    cy.get(cesc("#\\/g2\\/twoxa")).should("contain.text", "x+x");
    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("2x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("3x");
      });

    cy.log("change third simplify");
    cy.get(cesc("#\\/g3\\/sim_input")).clear().type("none{enter}");

    cy.get(cesc("#\\/g3\\/twoxa")).should("contain.text", "x+x");
    cy.get(cesc("#\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g2\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g2\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });

    cy.get(cesc("#\\/g3\\/twox"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/twoxa"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x");
      });
    cy.get(cesc("#\\/g3\\/threex"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal("x+x+x");
      });
  });

  it("copy group with link through name of external, no link", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name="g" newNamespace>
    <copy uri="doenet:cid=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" name="p" />
    <p>Credit achieved: <copy source="p/_answer1.creditAchieved" name="ca" /></p>
    </group>
    
    <copy source="g" link="false" name="g2" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinput1Anchor =
        cesc2(
          "#" +
            stateVariables["/g/p/_answer1"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput2Anchor =
        cesc2(
          "#" +
            stateVariables["/g2/p/_answer1"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";

      cy.get(cesc2("#/g/ca")).should("have.text", "0");
      cy.get(cesc2("#/g2/ca")).should("have.text", "0");

      cy.get(mathinput1Anchor).type("2x{enter}", { force: true });

      cy.get(cesc2("#/g/ca")).should("have.text", "1");
      cy.get(cesc2("#/g2/ca")).should("have.text", "0");

      cy.get(mathinput2Anchor).type("2x{enter}", { force: true });

      cy.get(cesc2("#/g/ca")).should("have.text", "1");
      cy.get(cesc2("#/g2/ca")).should("have.text", "1");
    });
  });

  it("copy group with link through name of external, no link, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name="g" newNamespace>
    <copy uri="doenet:cid=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" name="p" />
    <p>Credit achieved: $(p/_answer1.creditAchieved{assignNames="ca"})</p>
    </group>
    
    $g{link="false" name="g2"}
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinput1Anchor =
        cesc2(
          "#" +
            stateVariables["/g/p/_answer1"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput2Anchor =
        cesc2(
          "#" +
            stateVariables["/g2/p/_answer1"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";

      cy.get(cesc2("#/g/ca")).should("have.text", "0");
      cy.get(cesc2("#/g2/ca")).should("have.text", "0");

      cy.get(mathinput1Anchor).type("2x{enter}", { force: true });

      cy.get(cesc2("#/g/ca")).should("have.text", "1");
      cy.get(cesc2("#/g2/ca")).should("have.text", "0");

      cy.get(mathinput2Anchor).type("2x{enter}", { force: true });

      cy.get(cesc2("#/g/ca")).should("have.text", "1");
      cy.get(cesc2("#/g2/ca")).should("have.text", "1");
    });
  });

  it("copy group with link through name of external, no link, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name="g" newNamespace>
    <problem copyfromuri="doenet:cid=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" name="p" />
    <p>Credit achieved: <number copySource="p/_answer1.creditAchieved" name="ca" /></p>
    </group>
    
    <group copySource="g" link="false" name="g2" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinput1Anchor =
        cesc2(
          "#" +
            stateVariables["/g/p/_answer1"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput2Anchor =
        cesc2(
          "#" +
            stateVariables["/g2/p/_answer1"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";

      cy.get(cesc2("#/g/ca")).should("have.text", "0");
      cy.get(cesc2("#/g2/ca")).should("have.text", "0");

      cy.get(mathinput1Anchor).type("2x{enter}", { force: true });

      cy.get(cesc2("#/g/ca")).should("have.text", "1");
      cy.get(cesc2("#/g2/ca")).should("have.text", "0");

      cy.get(mathinput2Anchor).type("2x{enter}", { force: true });

      cy.get(cesc2("#/g/ca")).should("have.text", "1");
      cy.get(cesc2("#/g2/ca")).should("have.text", "1");
    });
  });

  it("copy group, no link, with function adapted to curve", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name='g'>
      <graph>
        <function>x</function>
      </graph>
    </group>
    
    <copy source='g' link="false" />
    `,
        },
        "*",
      );
    });

    // just testing that page loads, i.e., that bug is removed so that don't get error
    cy.get(cesc("#\\/_text1")).should("have.text", "a");
  });

  it("copy group, no link, with function adapted to curve, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name='g'>
      <graph>
        <function>x</function>
      </graph>
    </group>
    
    $g{link="false"}
    `,
        },
        "*",
      );
    });

    // just testing that page loads, i.e., that bug is removed so that don't get error
    cy.get(cesc("#\\/_text1")).should("have.text", "a");
  });

  it("copy group, no link, with function adapted to curve, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <group name='g'>
      <graph>
        <function>x</function>
      </graph>
    </group>
    
    <group copySource='g' link="false" />
    `,
        },
        "*",
      );
    });

    // just testing that page loads, i.e., that bug is removed so that don't get error
    cy.get(cesc("#\\/_text1")).should("have.text", "a");
  });

  it("copy group, no link, copy to external inside attribute", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <textinput name="external" prefill="bye" />

    <group name="g" newNamespace>
      <copy source="/external.value" name="w" />
      <point name="P"><label>$(/external)</label>(a,b)</point>
      <copy source="P.label" name="Plabel" />
    </group>
    
    <copy source="g" name="g2" link="false" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/g/w")).should("have.text", "bye");
    cy.get(cesc2("#/g/Plabel")).should("have.text", "bye");
    cy.get(cesc2("#/g2/w")).should("have.text", "bye");
    cy.get(cesc2("#/g2/Plabel")).should("have.text", "bye");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.label).eq("bye");
      expect(stateVariables["/g2/P"].stateValues.label).eq("bye");
    });

    cy.get(cesc2("#/external_input")).clear().type("hi{enter}");

    cy.get(cesc2("#/g/w")).should("have.text", "hi");
    cy.get(cesc2("#/g/Plabel")).should("have.text", "hi");
    cy.get(cesc2("#/g2/w")).should("have.text", "bye");
    cy.get(cesc2("#/g2/Plabel")).should("have.text", "bye");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.label).eq("hi");
      expect(stateVariables["/g2/P"].stateValues.label).eq("bye");
    });
  });

  it("copy group, no link, copy to external inside attribute, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <textinput name="external" prefill="bye" />

    <group name="g" newNamespace>
      $(/external.value{assignNames="w"})
      <point name="P"><label>$(/external)</label>(a,b)</point>
      $(P.label{assignNames="Plabel"})
    </group>
    
    $g{name="g2" link="false"}
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/g/w")).should("have.text", "bye");
    cy.get(cesc2("#/g/Plabel")).should("have.text", "bye");
    cy.get(cesc2("#/g2/w")).should("have.text", "bye");
    cy.get(cesc2("#/g2/Plabel")).should("have.text", "bye");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.label).eq("bye");
      expect(stateVariables["/g2/P"].stateValues.label).eq("bye");
    });

    cy.get(cesc2("#/external_input")).clear().type("hi{enter}");

    cy.get(cesc2("#/g/w")).should("have.text", "hi");
    cy.get(cesc2("#/g/Plabel")).should("have.text", "hi");
    cy.get(cesc2("#/g2/w")).should("have.text", "bye");
    cy.get(cesc2("#/g2/Plabel")).should("have.text", "bye");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.label).eq("hi");
      expect(stateVariables["/g2/P"].stateValues.label).eq("bye");
    });
  });

  it("copy group, no link, copy to external inside attribute, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <textinput name="external" prefill="bye" />

    <group name="g" newNamespace>
      <text copySource="/external.value" name="w" />
      <point name="P">
        <label>$(/external)</label>
        (a,b)
      </point>
      <label copySource="P.label" name="Plabel" />
    </group>
    
    <group copySource="g" name="g2" link="false" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/g/w")).should("have.text", "bye");
    cy.get(cesc2("#/g/Plabel")).should("have.text", "bye");
    cy.get(cesc2("#/g2/w")).should("have.text", "bye");
    cy.get(cesc2("#/g2/Plabel")).should("have.text", "bye");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.label).eq("bye");
      expect(stateVariables["/g2/P"].stateValues.label).eq("bye");
    });

    cy.get(cesc2("#/external_input")).clear().type("hi{enter}");

    cy.get(cesc2("#/g/w")).should("have.text", "hi");
    cy.get(cesc2("#/g/Plabel")).should("have.text", "hi");
    cy.get(cesc2("#/g2/w")).should("have.text", "bye");
    cy.get(cesc2("#/g2/Plabel")).should("have.text", "bye");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.label).eq("hi");
      expect(stateVariables["/g2/P"].stateValues.label).eq("bye");
    });
  });

  it("copy group, no link, internal copy to source alias is linked", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <group name="g" newNamespace>
      <textinput name="ti" prefill="hello" />
      <map assignNames="a">
        <template newNamespace>
          <copy source="x" name="w" />
          <point name="P"><label>$x</label>(a,b)</point>
          <copy prop="label" source="P" name="Plabel" />


        </template>
        <sources alias="x">
          $ti
        </sources>
      </map>
    </group>
    
    <copy source="g" name="g2" link="false" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/g/a/w")).should("have.text", "hello");
    cy.get(cesc2("#/g/a/Plabel")).should("have.text", "hello");
    cy.get(cesc2("#/g2/a/w")).should("have.text", "hello");
    cy.get(cesc2("#/g2/a/Plabel")).should("have.text", "hello");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/a/P"].stateValues.label).eq("hello");
      expect(stateVariables["/g2/a/P"].stateValues.label).eq("hello");
    });

    cy.get(cesc2("#/g/ti_input")).clear().type("one{enter}");
    cy.get(cesc2("#/g2/ti_input")).clear().type("two{enter}");

    cy.get(cesc2("#/g/a/w")).should("have.text", "one");
    cy.get(cesc2("#/g/a/Plabel")).should("have.text", "one");
    cy.get(cesc2("#/g2/a/w")).should("have.text", "two");
    cy.get(cesc2("#/g2/a/Plabel")).should("have.text", "two");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/a/P"].stateValues.label).eq("one");
      expect(stateVariables["/g2/a/P"].stateValues.label).eq("two");
    });
  });

  it("copy group, no link, internal copy to source alias is linked, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <group name="g" newNamespace>
      <textinput name="ti" prefill="hello" />
      <map assignNames="a">
        <template newNamespace>
          $x{name="w"}
          <point name="P"><label>$x</label>(a,b)</point>
          $(P.label{assignNames="Plabel"})


        </template>
        <sources alias="x">
          $ti
        </sources>
      </map>
    </group>
    
    $g{name="g2" link="false"}
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/g/a/w")).should("have.text", "hello");
    cy.get(cesc2("#/g/a/Plabel")).should("have.text", "hello");
    cy.get(cesc2("#/g2/a/w")).should("have.text", "hello");
    cy.get(cesc2("#/g2/a/Plabel")).should("have.text", "hello");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/a/P"].stateValues.label).eq("hello");
      expect(stateVariables["/g2/a/P"].stateValues.label).eq("hello");
    });

    cy.get(cesc2("#/g/ti_input")).clear().type("one{enter}");
    cy.get(cesc2("#/g2/ti_input")).clear().type("two{enter}");

    cy.get(cesc2("#/g/a/w")).should("have.text", "one");
    cy.get(cesc2("#/g/a/Plabel")).should("have.text", "one");
    cy.get(cesc2("#/g2/a/w")).should("have.text", "two");
    cy.get(cesc2("#/g2/a/Plabel")).should("have.text", "two");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/a/P"].stateValues.label).eq("one");
      expect(stateVariables["/g2/a/P"].stateValues.label).eq("two");
    });
  });

  it("copy group, no link, internal copy to source alias is linked, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <group name="g" newNamespace>
      <textinput name="ti" prefill="hello" />
      <map assignNames="a">
        <template newNamespace>
          <text copySource="x" name="w" />
          <point name="P">
            <label>$x</label>
            (a,b)
          </point>
          <label copyProp="label" copySource="P" name="Plabel" />
        </template>
        <sources alias="x">
          $ti
        </sources>
      </map>
    </group>
    
    <group copySource="g" name="g2" link="false" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/g/a/w")).should("have.text", "hello");
    cy.get(cesc2("#/g/a/Plabel")).should("have.text", "hello");
    cy.get(cesc2("#/g2/a/w")).should("have.text", "hello");
    cy.get(cesc2("#/g2/a/Plabel")).should("have.text", "hello");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/a/P"].stateValues.label).eq("hello");
      expect(stateVariables["/g2/a/P"].stateValues.label).eq("hello");
    });

    cy.get(cesc2("#/g/ti_input")).clear().type("one{enter}");
    cy.get(cesc2("#/g2/ti_input")).clear().type("two{enter}");

    cy.get(cesc2("#/g/a/w")).should("have.text", "one");
    cy.get(cesc2("#/g/a/Plabel")).should("have.text", "one");
    cy.get(cesc2("#/g2/a/w")).should("have.text", "two");
    cy.get(cesc2("#/g2/a/Plabel")).should("have.text", "two");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/a/P"].stateValues.label).eq("one");
      expect(stateVariables["/g2/a/P"].stateValues.label).eq("two");
    });
  });

  it("copy no link containing external copies use absolute source", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <number name="n">2</number>
    <number name="m">2$n</number>
    
    <group newNamespace name="g">
      <p>m = <copy source="../m" name="m1" /></p>
      <p>m = <copy source="../m" name="m2" link="false" /></p>
    </group>
    
    <copy source="g" name="g2" />
    <copy source="g" link="false" name="g3" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/n")).should("have.text", "2");
    cy.get(cesc2("#/m")).should("have.text", "4");
    cy.get(cesc2("#/g/m1")).should("have.text", "4");
    cy.get(cesc2("#/g/m2")).should("have.text", "4");
    cy.get(cesc2("#/g2/m1")).should("have.text", "4");
    cy.get(cesc2("#/g2/m2")).should("have.text", "4");
    cy.get(cesc2("#/g3/m1")).should("have.text", "4");
    cy.get(cesc2("#/g3/m2")).should("have.text", "4");
  });

  it("copy no link containing external copies use absolute source, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <number name="n">2</number>
    <number name="m">2$n</number>
    
    <group newNamespace name="g">
      <p>m = $(../m{name="m1"})</p>
      <p>m = $(../m{name="m2" link="false"})</p>
    </group>
    
    $g{name="g2"}
    $g{link="false" name="g3"}
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/n")).should("have.text", "2");
    cy.get(cesc2("#/m")).should("have.text", "4");
    cy.get(cesc2("#/g/m1")).should("have.text", "4");
    cy.get(cesc2("#/g/m2")).should("have.text", "4");
    cy.get(cesc2("#/g2/m1")).should("have.text", "4");
    cy.get(cesc2("#/g2/m2")).should("have.text", "4");
    cy.get(cesc2("#/g3/m1")).should("have.text", "4");
    cy.get(cesc2("#/g3/m2")).should("have.text", "4");
  });

  it("copy no link containing external copies use absolute source, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <number name="n">2</number>
    <number name="m">2$n</number>
    
    <group newNamespace name="g">
      <p>m = <number copySource="../m" name="m1" /></p>
      <p>m = <number copySource="../m" name="m2" link="false" /></p>
    </group>
    
    <group copySource="g" name="g2" />
    <group copySource="g" link="false" name="g3" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/n")).should("have.text", "2");
    cy.get(cesc2("#/m")).should("have.text", "4");
    cy.get(cesc2("#/g/m1")).should("have.text", "4");
    cy.get(cesc2("#/g/m2")).should("have.text", "4");
    cy.get(cesc2("#/g2/m1")).should("have.text", "4");
    cy.get(cesc2("#/g2/m2")).should("have.text", "4");
    cy.get(cesc2("#/g3/m1")).should("have.text", "4");
    cy.get(cesc2("#/g3/m2")).should("have.text", "4");
  });

  it("copy dynamic map no link, check aliases", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <section name="section1" newNamespace>
      <setup>
        <number name="n">2</number>
      </setup>

      <updateValue name="addP" target="n" newValue="$n+1" >
        <label>Add P</label>
      </updateValue>
      <updateValue name="removeP" target="n" newValue="$n-1" >
        <label>Remove P</label>
      </updateValue>
      <map assignNames="(p1) (p2) (p3) (p4)">
        <template><p>i=$i, v=$v</p></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </section>
    
    <section name="section2" newNamespace>
      <copy source='../section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section3">
      <copy source='section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <copy source='section1' link='false' name="section4" />
    
    <section name="section5" newNamespace>
      <copy source='../section1/_map1' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section6">
      <copy source='section1/_map1' assignNames='(p1a) (p2a) (p3a) (p4a)' />
    </section>

    <copy source='section1' name="section7" />
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/section1_title")).should("have.text", "Section 1");
    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2_title")).should("have.text", "Section 2");
    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/section3_title")).should("have.text", "Section 3");
    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4_title")).should("have.text", "Section 4");
    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5_title")).should("have.text", "Section 5");
    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/section6_title")).should("have.text", "Section 6");
    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7_title")).should("have.text", "Section 7");
    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section1/addP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section7/removeP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section4/addP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section4/removeP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");
  });

  it("copy dynamic map no link, check aliases", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <section name="section1" newNamespace>
      <setup>
        <number name="n">2</number>
      </setup>

      <updateValue name="addP" target="n" newValue="$n+1" >
        <label>Add P</label>
      </updateValue>
      <updateValue name="removeP" target="n" newValue="$n-1" >
        <label>Remove P</label>
      </updateValue>
      <map assignNames="(p1) (p2) (p3) (p4)">
        <template><p>i=$i, v=$v</p></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </section>
    
    <section name="section2" newNamespace>
      $(../section1/_map1{link='false' assignNames='(p1) (p2) (p3) (p4)'})
    </section>

    <section name="section3">
      $(section1/_map1{link='false' assignNames='(p1) (p2) (p3) (p4)'})
    </section>

    $section1{link='false' name="section4"}
    
    <section name="section5" newNamespace>
      $(../section1/_map1{assignNames='(p1) (p2) (p3) (p4)'})
    </section>

    <section name="section6">
      $(section1/_map1{assignNames='(p1a) (p2a) (p3a) (p4a)'})
    </section>

    $section1{name="section7"}
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/section1_title")).should("have.text", "Section 1");
    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2_title")).should("have.text", "Section 2");
    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/section3_title")).should("have.text", "Section 3");
    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4_title")).should("have.text", "Section 4");
    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5_title")).should("have.text", "Section 5");
    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/section6_title")).should("have.text", "Section 6");
    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7_title")).should("have.text", "Section 7");
    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section1/addP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section7/removeP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section4/addP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section4/removeP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");
  });

  it("copy dynamic map no link, check aliases, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <section name="section1" newNamespace>
      <setup>
        <number name="n">2</number>
      </setup>

      <updateValue name="addP" target="n" newValue="$n+1" >
        <label>Add P</label>
      </updateValue>
      <updateValue name="removeP" target="n" newValue="$n-1" >
        <label>Remove P</label>
      </updateValue>
      <map assignNames="(p1) (p2) (p3) (p4)">
        <template><p>i=$i, v=$v</p></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </section>
    
    <section name="section2" newNamespace>
      <map copySource='../section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section3">
      <map copySource='section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section copySource='section1' link='false' name="section4" />
    
    <section name="section5" newNamespace>
      <map copySource='../section1/_map1' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section6">
      <map copySource='section1/_map1' assignNames='(p1a) (p2a) (p3a) (p4a)' />
    </section>

    <section copySource='section1' name="section7" />
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/section1_title")).should("have.text", "Section 1");
    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2_title")).should("have.text", "Section 2");
    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/section3_title")).should("have.text", "Section 3");
    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4_title")).should("have.text", "Section 4");
    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5_title")).should("have.text", "Section 5");
    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/section6_title")).should("have.text", "Section 6");
    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7_title")).should("have.text", "Section 7");
    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section1/addP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section7/removeP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section4/addP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("have.text", "i=3, v=13");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");

    cy.get(cesc2("#/section4/removeP_button")).click();

    cy.get(cesc2("#/section1/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section1/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section1/p3")).should("not.exist");
    cy.get(cesc2("#/section1/p4")).should("not.exist");

    cy.get(cesc2("#/section2/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section2/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section2/p3")).should("not.exist");
    cy.get(cesc2("#/section2/p4")).should("not.exist");

    cy.get(cesc2("#/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3")).should("not.exist");
    cy.get(cesc2("#/p4")).should("not.exist");

    cy.get(cesc2("#/section4/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section4/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section4/p3")).should("not.exist");
    cy.get(cesc2("#/section4/p4")).should("not.exist");

    cy.get(cesc2("#/section5/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section5/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section5/p3")).should("not.exist");
    cy.get(cesc2("#/section5/p4")).should("not.exist");

    cy.get(cesc2("#/p1a")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/p2a")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/p3a")).should("not.exist");
    cy.get(cesc2("#/p4a")).should("not.exist");

    cy.get(cesc2("#/section7/p1")).should("have.text", "i=1, v=11");
    cy.get(cesc2("#/section7/p2")).should("have.text", "i=2, v=12");
    cy.get(cesc2("#/section7/p3")).should("not.exist");
    cy.get(cesc2("#/section7/p4")).should("not.exist");
  });

  it("copy map source with no link", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of iterations: <mathinput name="n" /></p>

    <graph>
    
      <map name="map1" assignNames="(A B C) (D E F)">
      <template>
      
      <point x="$i{link='false'}" y='$i.value{link="false"}+1'>
      </point>
      <point>
        (<number copySource="i" link="false" /> + 2, <number copySource="i.value" link="false" /> +3)
      </point>
      <point>
        (<copy source="i" link="false" /> + 4, <copy source="i.value" link="false" /> +5)
      </point>
      </template>
      
      <sources alias="i"><sequence from="1" to="$n" /></sources>
      </map>
        
    </graph>

    <p>A: <copy source="A" name="A2" /></p>
    <p>B: <copy source="B" name="B2" /></p>
    <p>C: <copy source="C" name="C2" /></p>
    <p>D: <copy source="D" name="D2" /></p>
    <p>E: <copy source="E" name="E2" /></p>
    <p>F: <copy source="F" name="F2" /></p>
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/A2")).should("not.exist");
    cy.get(cesc2("#/B2")).should("not.exist");
    cy.get(cesc2("#/C2")).should("not.exist");
    cy.get(cesc2("#/D2")).should("not.exist");
    cy.get(cesc2("#/E2")).should("not.exist");
    cy.get(cesc2("#/F2")).should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc2("#/A2") + " .mjx-mrow").should("contain.text", "(1,2)");
    cy.get(cesc2("#/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,2)");
    cy.get(cesc2("#/B2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.get(cesc2("#/C2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc2("#/D2")).should("not.exist");
    cy.get(cesc2("#/E2")).should("not.exist");
    cy.get(cesc2("#/F2")).should("not.exist");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 9, y: 0 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 1, y: 8 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: 7, y: 2 },
      });
    });

    cy.get(cesc2("#/C2") + " .mjx-mrow").should("contain.text", "(7,2)");
    cy.get(cesc2("#/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/B2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,8)");
    cy.get(cesc2("#/C2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,2)");
    cy.get(cesc2("#/D2")).should("not.exist");
    cy.get(cesc2("#/E2")).should("not.exist");
    cy.get(cesc2("#/F2")).should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc2("#/D2") + " .mjx-mrow").should("contain.text", "(2,3)");
    cy.get(cesc2("#/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/B2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,8)");
    cy.get(cesc2("#/C2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,2)");
    cy.get(cesc2("#/D2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/E2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)");
    cy.get(cesc2("#/F2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/D",
        args: { x: 0, y: 10 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/E",
        args: { x: 9, y: 1 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/F",
        args: { x: 2, y: 8 },
      });
    });

    cy.get(cesc2("#/F2") + " .mjx-mrow").should("contain.text", "(2,8)");
    cy.get(cesc2("#/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/B2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,8)");
    cy.get(cesc2("#/C2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,2)");
    cy.get(cesc2("#/D2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,10)");
    cy.get(cesc2("#/E2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,1)");
    cy.get(cesc2("#/F2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,8)");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc2("#/A2")).should("not.exist");
    cy.get(cesc2("#/B2")).should("not.exist");
    cy.get(cesc2("#/C2")).should("not.exist");
    cy.get(cesc2("#/D2")).should("not.exist");
    cy.get(cesc2("#/E2")).should("not.exist");
    cy.get(cesc2("#/F2")).should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc2("#/F2") + " .mjx-mrow").should("contain.text", "(2,8)");
    cy.get(cesc2("#/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/B2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,8)");
    cy.get(cesc2("#/C2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,2)");
    cy.get(cesc2("#/D2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,10)");
    cy.get(cesc2("#/E2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,1)");
    cy.get(cesc2("#/F2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,8)");
  });

  it("copy map source with no link, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of iterations: <mathinput name="n" /></p>

    <graph>
    
      <map name="map1" assignNames="(A B C) (D E F)">
      <template>
      
      <point x="$i{link='false'}" y='$i.value{link="false"}+1'>
      </point>
      <point>
        (<number copySource="i" link="false" /> + 2, <number copySource="i.value" link="false" /> +3)
      </point>
      <point>
        ($i{link="false"} + 4, $(i.value{link="false"}) +5)
      </point>
      </template>
      
      <sources alias="i"><sequence from="1" to="$n" /></sources>
      </map>
        
    </graph>

    <p>A: $A{name="A2"}</p>
    <p>B: $B{name="B2"}</p>
    <p>C: $C{name="C2"}</p>
    <p>D: $D{name="D2"}</p>
    <p>E: $E{name="E2"}</p>
    <p>F: $F{name="F2"}</p>
  
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/A2")).should("not.exist");
    cy.get(cesc2("#/B2")).should("not.exist");
    cy.get(cesc2("#/C2")).should("not.exist");
    cy.get(cesc2("#/D2")).should("not.exist");
    cy.get(cesc2("#/E2")).should("not.exist");
    cy.get(cesc2("#/F2")).should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc2("#/A2") + " .mjx-mrow").should("contain.text", "(1,2)");
    cy.get(cesc2("#/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,2)");
    cy.get(cesc2("#/B2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.get(cesc2("#/C2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc2("#/D2")).should("not.exist");
    cy.get(cesc2("#/E2")).should("not.exist");
    cy.get(cesc2("#/F2")).should("not.exist");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 9, y: 0 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 1, y: 8 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: 7, y: 2 },
      });
    });

    cy.get(cesc2("#/C2") + " .mjx-mrow").should("contain.text", "(7,2)");
    cy.get(cesc2("#/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/B2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,8)");
    cy.get(cesc2("#/C2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,2)");
    cy.get(cesc2("#/D2")).should("not.exist");
    cy.get(cesc2("#/E2")).should("not.exist");
    cy.get(cesc2("#/F2")).should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc2("#/D2") + " .mjx-mrow").should("contain.text", "(2,3)");
    cy.get(cesc2("#/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/B2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,8)");
    cy.get(cesc2("#/C2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,2)");
    cy.get(cesc2("#/D2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/E2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)");
    cy.get(cesc2("#/F2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/D",
        args: { x: 0, y: 10 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/E",
        args: { x: 9, y: 1 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/F",
        args: { x: 2, y: 8 },
      });
    });

    cy.get(cesc2("#/F2") + " .mjx-mrow").should("contain.text", "(2,8)");
    cy.get(cesc2("#/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/B2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,8)");
    cy.get(cesc2("#/C2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,2)");
    cy.get(cesc2("#/D2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,10)");
    cy.get(cesc2("#/E2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,1)");
    cy.get(cesc2("#/F2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,8)");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc2("#/A2")).should("not.exist");
    cy.get(cesc2("#/B2")).should("not.exist");
    cy.get(cesc2("#/C2")).should("not.exist");
    cy.get(cesc2("#/D2")).should("not.exist");
    cy.get(cesc2("#/E2")).should("not.exist");
    cy.get(cesc2("#/F2")).should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc2("#/F2") + " .mjx-mrow").should("contain.text", "(2,8)");
    cy.get(cesc2("#/A2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,0)");
    cy.get(cesc2("#/B2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,8)");
    cy.get(cesc2("#/C2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,2)");
    cy.get(cesc2("#/D2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,10)");
    cy.get(cesc2("#/E2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,1)");
    cy.get(cesc2("#/F2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,8)");
  });

  it("copy no-link of a copy prop", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math name="x">x</math>
    <math copySource="x.value" name="xval" />
    <math copySource="xval" link="false" name="xvalnl" />

    <mathinput name="mi1">$xval</mathinput>
    <mathinput name="mi2">$xvalnl</mathinput>
  
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/x") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/xval") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");
    cy.get(cesc2("#/xvalnl") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");

    cy.get(cesc2("#/mi1") + " textarea").type("{end}{backspace}y{enter}", {
      force: true,
    });

    cy.get(cesc2("#/x") + " .mjx-mrow").should("contain.text", "y");
    cy.get(cesc2("#/x") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");
    cy.get(cesc2("#/xval") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");
    cy.get(cesc2("#/xvalnl") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");

    cy.get(cesc2("#/mi2") + " textarea").type("{end}{backspace}z{enter}", {
      force: true,
    });

    cy.get(cesc2("#/xvalnl") + " .mjx-mrow").should("contain.text", "z");
    cy.get(cesc2("#/xvalnl") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "z");

    cy.get(cesc2("#/x") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");
    cy.get(cesc2("#/xval") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y");
  });

  it("copy no-link of a copy prop 2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
      <triangle name="t"/>
    
      <point copySource="t.vertex1" name="v1" />
      <point name="v2" copySource="v1" />
      <point name="v3" copySource="v2" />
    </graph>
    
    <graph>
      <point copySource="v1" name="v1nl" link="false" />
      <point copySource="v2" name="v2nl" link="false" />
      <point copySource="v3" name="v3nl" link="false" />
    </graph>

    <point copySource="v1" name="v1a" />
    <point copySource="v1nl" name="v1nla" />
    <point copySource="v2nl" name="v2nla" />
    <point copySource="v3nl" name="v3nla" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/v1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");
    cy.get(cesc2("#/v1nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");
    cy.get(cesc2("#/v2nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");
    cy.get(cesc2("#/v3nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");

    cy.log("Move v1");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/v1",
        args: { x: 2, y: 3 },
      });
    });

    cy.get(cesc2("#/v1a") + " .mjx-mrow").should("contain.text", "(2,3)");
    cy.get(cesc2("#/v1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/v1nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");
    cy.get(cesc2("#/v2nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");
    cy.get(cesc2("#/v3nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");

    cy.log("Move v1nl");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/v1nl",
        args: { x: 3, y: 4 },
      });
    });

    cy.get(cesc2("#/v1nla") + " .mjx-mrow").should("contain.text", "(3,4)");
    cy.get(cesc2("#/v1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/v1nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.get(cesc2("#/v2nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");
    cy.get(cesc2("#/v3nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");

    cy.log("Move v2nl");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/v2nl",
        args: { x: 4, y: 5 },
      });
    });

    cy.get(cesc2("#/v2nla") + " .mjx-mrow").should("contain.text", "(4,5)");
    cy.get(cesc2("#/v1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/v1nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.get(cesc2("#/v2nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)");
    cy.get(cesc2("#/v3nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");

    cy.log("Move v3nl");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/v3nl",
        args: { x: 5, y: 6 },
      });
    });

    cy.get(cesc2("#/v3nla") + " .mjx-mrow").should("contain.text", "(5,6)");
    cy.get(cesc2("#/v1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,3)");
    cy.get(cesc2("#/v1nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.get(cesc2("#/v2nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)");
    cy.get(cesc2("#/v3nla") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
  });

  it("external content cannot reach outside namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <copy uri="doenet:cid=bafkreiewcn63sugv6o6ernb2vljtt4d36zqn5pjxxy77qwfz2frejwnzhm" name="greetings" />

    <p>Don't get this: <text name="hi">Bye</text></p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/hi")).should("have.text", "Bye");

    cy.get(cesc2("#/greetings/hi")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/s/hi")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l1")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c4")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/s/s/hi")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l1")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/m1")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c5")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c5")).should("have.text", "Hello");
  });

  it("external content cannot reach outside namespace, external is single section", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <copy uri="doenet:cid=bafkreidpoi2m2sr52dm7hca3zlnnpm4vdgmtse7jx74zfvaee2ogfxnyqy" name="greetings" />

    <p>Don't get this: <text name="hi">Bye</text></p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/hi")).should("have.text", "Bye");

    cy.get(cesc2("#/greetings/hi")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/s/hi")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/l1")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l2")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l3")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l4")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l5")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/s/s/hi")).should("have.text", "Marhaban");

    cy.get(cesc2("#/greetings/s/s/l1")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l2")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l3")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l4")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l5")).should("have.text", "Marhaban");

    cy.get(cesc2("#/greetings/s/s/m1")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m2")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m3")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m4")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m5")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c5")).should("have.text", "Hello");
  });

  it("external content cannot reach outside namespace, with copyFromURI", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <section copyFromURI="doenet:cid=bafkreidpoi2m2sr52dm7hca3zlnnpm4vdgmtse7jx74zfvaee2ogfxnyqy" name="greetings" />

    <p>Don't get this: <text name="hi">Bye</text></p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/hi")).should("have.text", "Bye");

    cy.get(cesc2("#/greetings/hi")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/s/hi")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/l1")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l2")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l3")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l4")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l5")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/s/s/hi")).should("have.text", "Marhaban");

    cy.get(cesc2("#/greetings/s/s/l1")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l2")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l3")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l4")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l5")).should("have.text", "Marhaban");

    cy.get(cesc2("#/greetings/s/s/m1")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m2")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m3")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m4")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m5")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c5")).should("have.text", "Hello");
  });

  it("external content cannot reach outside namespace, external has namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <copy uri="doenet:cid=bafkreickzviscuc3v3bodp73qfgarfexcasf6txflg5huseru2qdpylaou" name="greetings" />

    <p>Don't get this: <text name="hi">Bye</text></p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/hi")).should("have.text", "Bye");

    cy.get(cesc2("#/greetings/hi")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/nm1")).should("not.exist");
    cy.get(cesc2("#/greetings/nm2")).should("not.exist");
    cy.get(cesc2("#/greetings/nm3")).should("not.exist");
    cy.get(cesc2("#/greetings/nm4")).should("not.exist");

    cy.get(cesc2("#/greetings/pNoMatch")).should(
      "have.text",
      "Four no matches:",
    );

    cy.get(cesc2("#/greetings/s/hi")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/l1")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l2")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l3")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l4")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l5")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/s/nm1")).should("not.exist");
    cy.get(cesc2("#/greetings/s/nm2")).should("not.exist");
    cy.get(cesc2("#/greetings/s/nm3")).should("not.exist");
    cy.get(cesc2("#/greetings/s/nm4")).should("not.exist");

    cy.get(cesc2("#/greetings/s/pNoMatch")).should(
      "have.text",
      "Four no matches:",
    );

    cy.get(cesc2("#/greetings/s/s/hi")).should("have.text", "Marhaban");

    cy.get(cesc2("#/greetings/s/s/l1")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l2")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l3")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l4")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l5")).should("have.text", "Marhaban");

    cy.get(cesc2("#/greetings/s/s/m1")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m2")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m3")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m4")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m5")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/s/s/nm1")).should("not.exist");
    cy.get(cesc2("#/greetings/s/s/nm2")).should("not.exist");
    cy.get(cesc2("#/greetings/s/s/nm3")).should("not.exist");
    cy.get(cesc2("#/greetings/s/s/nm4")).should("not.exist");

    cy.get(cesc2("#/greetings/s/s/pNoMatch")).should(
      "have.text",
      "Four no matches:",
    );
  });

  it("external content cannot reach outside namespace, external has namespace, with copyFromURI", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <section copyFromURI="doenet:cid=bafkreickzviscuc3v3bodp73qfgarfexcasf6txflg5huseru2qdpylaou" name="greetings" />

    <p>Don't get this: <text name="hi">Bye</text></p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/hi")).should("have.text", "Bye");

    cy.get(cesc2("#/greetings/hi")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/nm1")).should("not.exist");
    cy.get(cesc2("#/greetings/nm2")).should("not.exist");
    cy.get(cesc2("#/greetings/nm3")).should("not.exist");
    cy.get(cesc2("#/greetings/nm4")).should("not.exist");

    cy.get(cesc2("#/greetings/pNoMatch")).should(
      "have.text",
      "Four no matches:",
    );

    cy.get(cesc2("#/greetings/s/hi")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/l1")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l2")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l3")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l4")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/l5")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/s/nm1")).should("not.exist");
    cy.get(cesc2("#/greetings/s/nm2")).should("not.exist");
    cy.get(cesc2("#/greetings/s/nm3")).should("not.exist");
    cy.get(cesc2("#/greetings/s/nm4")).should("not.exist");

    cy.get(cesc2("#/greetings/s/pNoMatch")).should(
      "have.text",
      "Four no matches:",
    );

    cy.get(cesc2("#/greetings/s/s/hi")).should("have.text", "Marhaban");

    cy.get(cesc2("#/greetings/s/s/l1")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l2")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l3")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l4")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greetings/s/s/l5")).should("have.text", "Marhaban");

    cy.get(cesc2("#/greetings/s/s/m1")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m2")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m3")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m4")).should("have.text", "Hola");
    cy.get(cesc2("#/greetings/s/s/m5")).should("have.text", "Hola");

    cy.get(cesc2("#/greetings/s/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greetings/s/s/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greetings/s/s/nm1")).should("not.exist");
    cy.get(cesc2("#/greetings/s/s/nm2")).should("not.exist");
    cy.get(cesc2("#/greetings/s/s/nm3")).should("not.exist");
    cy.get(cesc2("#/greetings/s/s/nm4")).should("not.exist");

    cy.get(cesc2("#/greetings/s/s/pNoMatch")).should(
      "have.text",
      "Four no matches:",
    );
  });

  it("external content inside external content cannot reach outside namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <copy uri="doenet:cid=bafkreiccroxlq6rumheoxcs2vfze2h6u6ybi3yx4snhn7asbidbbit6wqa" name="greet" />

    <p>Don't get this 2: <text name="hi">Leave</text></p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/hi")).should("have.text", "Leave");

    cy.get(cesc2("#/greet/hi")).should("have.text", "Bye");

    cy.get(cesc2("#/greet/greetings/hi")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greet/greetings/s/hi")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/l1")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/c4")).should("have.text", "Hello");

    cy.get(cesc2("#/greet/greetings/s/s/hi")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greet/greetings/s/s/l1")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greet/greetings/s/s/m1")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c5")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c5")).should("have.text", "Hello");
  });

  it("external content inside external content cannot reach outside namespace, external is single section", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <copy uri="doenet:cid=bafkreic2z7kam3hnfbbpscwurh5lidhmtxmdlxcv7xtewp5mkqq32envae" name="greet" />

    <p>Don't get this 2: <text name="hi">Leave</text></p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/hi")).should("have.text", "Leave");

    cy.get(cesc2("#/greet/hi")).should("have.text", "Bye");

    cy.get(cesc2("#/greet/greetings/hi")).should("have.text", "Hello");

    cy.get(cesc2("#/greet/greetings/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greet/greetings/s/hi")).should("have.text", "Hola");

    cy.get(cesc2("#/greet/greetings/s/l1")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/l2")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/l3")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/l4")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/l5")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/c4")).should("have.text", "Hello");

    cy.get(cesc2("#/greet/greetings/s/s/hi")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greet/greetings/s/s/l1")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greet/greetings/s/s/m1")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c5")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c5")).should("have.text", "Hello");
  });

  it("external content inside external content cannot reach outside namespace, with copyFromURI", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <section copyfromuri="doenet:cid=bafkreic2z7kam3hnfbbpscwurh5lidhmtxmdlxcv7xtewp5mkqq32envae" name="greet" />

    <p>Don't get this 2: <text name="hi">Leave</text></p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc2("#/hi")).should("have.text", "Leave");

    cy.get(cesc2("#/greet/hi")).should("have.text", "Bye");

    cy.get(cesc2("#/greet/greetings/hi")).should("have.text", "Hello");

    cy.get(cesc2("#/greet/greetings/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/c5")).should("have.text", "Hello");

    cy.get(cesc2("#/greet/greetings/s/hi")).should("have.text", "Hola");

    cy.get(cesc2("#/greet/greetings/s/l1")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/l2")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/l3")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/l4")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/l5")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/c4")).should("have.text", "Hello");

    cy.get(cesc2("#/greet/greetings/s/s/hi")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greet/greetings/s/s/l1")).should("have.text", "Marhaban");
    cy.get(cesc2("#/greet/greetings/s/s/m1")).should("have.text", "Hola");
    cy.get(cesc2("#/greet/greetings/s/s/c1")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c2")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c3")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c4")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c5")).should("have.text", "Hello");
    cy.get(cesc2("#/greet/greetings/s/s/c5")).should("have.text", "Hello");
  });

  it("copy of template source maintained when withheld", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput name="n" /></p>

    <graph name='g1'>
      <map name="map1" assignNames="t1 t2">
        <template newNamespace>
          <point name="A" x="$(i{link='false' fixed='false'})" y='1'/>
        </template>
        <sources alias="i"><sequence from="1" to="$n" /></sources>
      </map>
    </graph>
    
    <p><m name="m1">A_1 = <copy source="t1/A" displayDigits="3" /></m></p>
    <p><m name="m2">A_2 = <copy source="t2/A" displayDigits="3" /></m></p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Add point");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/m1")).should("contain.text", "A1=(1,1)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(1,1)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Move point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/t1/A",
        args: { x: -3, y: 7 },
      });
    });

    cy.get(cesc("#\\/m1")).should("contain.text", "A1=(−3,7)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(−3,7)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Remove point");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should("not.contain.text", "A1=(−3,7)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Remember coordinates when restore point since copy was maintained");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "A1=(−3,7)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(−3,7)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Add second point");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/m2") + " .mjx-mrow").should("contain.text", "A2=(2,1)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(−3,7)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=(2,1)");
      });

    cy.log("Move second point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      win.callAction1({
        actionName: "movePoint",
        componentName: "/t2/A",
        args: { x: 5, y: -4 },
      });
    });

    cy.get(cesc("#\\/m2") + " .mjx-mrow").should("contain.text", "A2=(5,−4)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(−3,7)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=(5,−4)");
      });

    cy.log("Remove both points");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "not.contain.text",
      "A1=(−3,7)",
    );
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Remember coordinates of both points");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "A1=(−3,7)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(−3,7)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=(5,−4)");
      });
  });

  it("copy of template source maintained when withheld, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput name="n" /></p>

    <graph name='g1'>
      <map name="map1" assignNames="t1 t2">
        <template newNamespace>
          <point name="A" x="$(i{link='false' fixed='false'})" y='1'/>
        </template>
        <sources alias="i"><sequence from="1" to="$n" /></sources>
      </map>
    </graph>
    
    <p><m name="m1">A_1 = $(t1/A{displayDigits="3"})</m></p>
    <p><m name="m2">A_2 = $(t2/A{displayDigits="3"})</m></p>
    
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Add point");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/m1")).should("contain.text", "A1=(1,1)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(1,1)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Move point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/t1/A",
        args: { x: -3, y: 7 },
      });
    });

    cy.get(cesc("#\\/m1")).should("contain.text", "A1=(−3,7)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(−3,7)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Remove point");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should("not.contain.text", "A1=(−3,7)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Remember coordinates when restore point since copy was maintained");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "A1=(−3,7)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(−3,7)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Add second point");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/m2") + " .mjx-mrow").should("contain.text", "A2=(2,1)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(−3,7)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=(2,1)");
      });

    cy.log("Move second point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      win.callAction1({
        actionName: "movePoint",
        componentName: "/t2/A",
        args: { x: 5, y: -4 },
      });
    });

    cy.get(cesc("#\\/m2") + " .mjx-mrow").should("contain.text", "A2=(5,−4)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(−3,7)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=(5,−4)");
      });

    cy.log("Remove both points");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "not.contain.text",
      "A1=(−3,7)",
    );
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=");
      });

    cy.log("Remember coordinates of both points");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "A1=(−3,7)");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A1=(−3,7)");
      });
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("A2=(5,−4)");
      });
  });

  it("trim whitespace off source", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text name="hi">Hello</text>
    <p><copy source=" hi  " /> there</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/hi")).should("have.text", "Hello");
    cy.get(cesc("#\\/_p1")).should("have.text", "Hello there");
  });

  it("trim whitespace off source, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text name="hi">Hello</text>
    <p><text copySource=" hi  " /> there</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/hi")).should("have.text", "Hello");
    cy.get(cesc("#\\/_p1")).should("have.text", "Hello there");
  });

  it("copy of external content retains desired variant", () => {
    let doenetML = `
    <text>a</text>
    <copy name="problem1" uri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" />
    `;

    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let catInd, choiceOrder;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/problem1/_select1"].stateValues.currentVariantName,
      ).eq("cat");
      let choices =
        stateVariables["/problem1/_choiceinput1"].stateValues.choiceTexts;
      catInd = choices.indexOf("meow") + 1;
      choiceOrder =
        stateVariables["/problem1/_choiceinput1"].stateValues.choiceOrder;

      cy.get(cesc2(`#/problem1/_choiceinput1_choice${catInd}_input`)).click();
    });

    cy.get(cesc2(`#/problem1/_choiceinput1_submit`)).click();
    cy.get(cesc2(`#/problem1/_choiceinput1_correct`)).should("be.visible");

    cy.wait(2000); // make sure 1 second debounce occurred

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    // wait until core is loaded
    cy.waitUntil(() =>
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let foundIt = Boolean(
          stateVariables["/problem1/_choiceinput1"]?.stateValues?.choiceTexts,
        );
        return foundIt;
      }),
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/problem1/_select1"].stateValues.currentVariantName,
      ).eq("cat");
      expect(
        stateVariables["/problem1/_choiceinput1"].stateValues.choiceOrder,
      ).eqls(choiceOrder);
      let choices = [
        ...stateVariables["/problem1/_choiceinput1"].stateValues.choiceTexts,
      ];
      expect(choices.indexOf("meow") + 1).eq(catInd);
    });
  });

  it("copy of external content retains desired variant, with copyfromuri", () => {
    let doenetML = `
    <text>a</text>
    <problem name="problem1" copyFromURI="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" />
    `;

    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let catInd, choiceOrder;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/problem1/_select1"].stateValues.currentVariantName,
      ).eq("cat");
      let choices =
        stateVariables["/problem1/_choiceinput1"].stateValues.choiceTexts;
      catInd = choices.indexOf("meow") + 1;
      choiceOrder =
        stateVariables["/problem1/_choiceinput1"].stateValues.choiceOrder;

      cy.get(cesc2(`#/problem1/_choiceinput1_choice${catInd}_input`)).click();
    });

    cy.get(cesc2(`#/problem1/_choiceinput1_submit`)).click();
    cy.get(cesc2(`#/problem1/_choiceinput1_correct`)).should("be.visible");

    cy.wait(2000); // make sure 1 second debounce occurred

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    // wait until core is loaded
    cy.waitUntil(() =>
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let foundIt = Boolean(
          stateVariables["/problem1/_choiceinput1"]?.stateValues?.choiceTexts,
        );
        return foundIt;
      }),
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/problem1/_select1"].stateValues.currentVariantName,
      ).eq("cat");
      expect(
        stateVariables["/problem1/_choiceinput1"].stateValues.choiceOrder,
      ).eqls(choiceOrder);
      let choices = [
        ...stateVariables["/problem1/_choiceinput1"].stateValues.choiceTexts,
      ];
      expect(choices.indexOf("meow") + 1).eq(catInd);
    });
  });

  it("copy of external content retains desired variant, no problem in external content", () => {
    let doenetML = `
    <text>a</text>
    <copy name="problem1" uri="doenet:CID=bafkreidqud3rixmphu3jufuke4rw7magtcrbrjgeo6ihkoyonsig7wciey" />
    `;

    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let catInd, choiceOrder;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/problem1/_select1"].stateValues.currentVariantName,
      ).eq("cat");
      let choices =
        stateVariables["/problem1/_choiceinput1"].stateValues.choiceTexts;
      catInd = choices.indexOf("meow") + 1;
      choiceOrder =
        stateVariables["/problem1/_choiceinput1"].stateValues.choiceOrder;

      cy.get(cesc2(`#/problem1/_choiceinput1_choice${catInd}_input`)).click();
    });

    cy.get(cesc2(`#/problem1/_choiceinput1_submit`)).click();
    cy.get(cesc2(`#/problem1/_choiceinput1_correct`)).should("be.visible");

    cy.wait(2000); // make sure 1 second debounce occurred

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    // wait until core is loaded
    cy.waitUntil(() =>
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let foundIt = Boolean(
          stateVariables["/problem1/_choiceinput1"]?.stateValues?.choiceTexts,
        );
        return foundIt;
      }),
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/problem1/_select1"].stateValues.currentVariantName,
      ).eq("cat");
      expect(
        stateVariables["/problem1/_choiceinput1"].stateValues.choiceOrder,
      ).eqls(choiceOrder);
      let choices = [
        ...stateVariables["/problem1/_choiceinput1"].stateValues.choiceTexts,
      ];
      expect(choices.indexOf("meow") + 1).eq(catInd);
    });
  });

  it("copy with newNamespace and name retains original names, even with group", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>values: <group name="grp"><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section><copy source="_p1" newNamespace name="p1" /></section>
      
      $p1
      <copy source="p1" name="p1a" />
      <copy source="p1" newNamespace />
      <copy source="p1" newNamespace name="p1b" />
      <copy source="p1a" newNamespace />
      
      $_section1
      <copy source="_section1" name="s1a" />
      <copy source="_section1" newNamespace />
      <copy source="_section1" newNamespace name="s1b" />
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/_number1")).should("have.text", "1");
    cy.get(cesc2("#/_number2")).should("have.text", "2");
    cy.get(cesc2("#/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1a/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1a/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1a/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1b/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1b/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1b/_number3")).should("have.text", "3");

    cy.get(cesc2("#/s1b/p1/_number1")).should("have.text", "1");
    cy.get(cesc2("#/s1b/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/s1b/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/s1b/p1")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1a"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null;
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c2p = stateVariables["/_document1"].activeChildren[7].componentName;
      let c4p = stateVariables["/_document1"].activeChildren[11].componentName;
      let c6p = stateVariables["/_document1"].activeChildren[15].componentName;
      let c7s = stateVariables["/_document1"].activeChildren[17].componentName;
      let c9s = stateVariables["/_document1"].activeChildren[21].componentName;

      cy.get(cesc2("#" + c2p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c4p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c6p)).should("have.text", "values: 1 2 3");

      cy.get(cesc2("#" + c7s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
        });
      cy.get(cesc2("#" + c9s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 4\s*values: 1 2 3/)).not.be.null;
        });

      // put in window just so happens after above
      cy.window().then(async (win) => {
        expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
        expect(stateVariables["/p1/_number2"].stateValues.value).eq(2);
        expect(stateVariables["/p1/_number3"].stateValues.value).eq(3);

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__");
        expect(c2pChildNames[1].slice(0, 3)).eq("/__");
        expect(c2pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have gotten unique names (so begin with two underscores)
        let c4pChildNames = stateVariables[c4p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c4pChildNames[0].slice(0, 3)).eq("/__");
        expect(c4pChildNames[1].slice(0, 3)).eq("/__");
        expect(c4pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c6p's children should have gotten unique names (so begin with two underscores)
        let c6pChildNames = stateVariables[c6p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c6pChildNames[0].slice(0, 3)).eq("/__");
        expect(c6pChildNames[1].slice(0, 3)).eq("/__");
        expect(c6pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c6pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c6pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c6pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // s1a's grandchildren should have gotten unique names (so begin with two underscores)
        let s1aChildName = stateVariables["/s1a"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);

        // c9s's grandchildren should have gotten unique names (so begin with two underscores)
        let c9sChildName = stateVariables[c9s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c9sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);

        // s1b's grandchildren should have retained their original names
        let s1bChildName = stateVariables["/s1b"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1bGrandChildNames = stateVariables[s1bChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1bGrandChildNames[0]).eq("/s1b/p1/_number1");
        expect(s1bGrandChildNames[1]).eq("/s1b/p1/_number2");
        expect(s1bGrandChildNames[2]).eq("/s1b/p1/_number3");
        expect(stateVariables[s1bGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1bGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1bGrandChildNames[2]].stateValues.value).eq(3);
      });
    });
  });

  it("copy with newNamespace and name retains original names, even with group, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>values: <group name="grp"><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section>$_p1{newNamespace name="p1"}</section>
      
      $p1
      $p1{name="p1a"}
      $p1{newNamespace}
      $p1{newNamespace name="p1b"}
      $p1a{newNamespace}
      
      $_section1
      $_section1{name="s1a"}
      $_section1{newNamespace}
      $_section1{newNamespace name="s1b"}
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/_number1")).should("have.text", "1");
    cy.get(cesc2("#/_number2")).should("have.text", "2");
    cy.get(cesc2("#/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1a/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1a/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1a/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1b/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1b/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1b/_number3")).should("have.text", "3");

    cy.get(cesc2("#/s1b/p1/_number1")).should("have.text", "1");
    cy.get(cesc2("#/s1b/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/s1b/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/s1b/p1")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1a"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null;
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c2p = stateVariables["/_document1"].activeChildren[7].componentName;
      let c4p = stateVariables["/_document1"].activeChildren[11].componentName;
      let c6p = stateVariables["/_document1"].activeChildren[15].componentName;
      let c7s = stateVariables["/_document1"].activeChildren[17].componentName;
      let c9s = stateVariables["/_document1"].activeChildren[21].componentName;

      cy.get(cesc2("#" + c2p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c4p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c6p)).should("have.text", "values: 1 2 3");

      cy.get(cesc2("#" + c7s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
        });
      cy.get(cesc2("#" + c9s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 4\s*values: 1 2 3/)).not.be.null;
        });

      // put in window just so happens after above
      cy.window().then(async (win) => {
        expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
        expect(stateVariables["/p1/_number2"].stateValues.value).eq(2);
        expect(stateVariables["/p1/_number3"].stateValues.value).eq(3);

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__");
        expect(c2pChildNames[1].slice(0, 3)).eq("/__");
        expect(c2pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have gotten unique names (so begin with two underscores)
        let c4pChildNames = stateVariables[c4p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c4pChildNames[0].slice(0, 3)).eq("/__");
        expect(c4pChildNames[1].slice(0, 3)).eq("/__");
        expect(c4pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c6p's children should have gotten unique names (so begin with two underscores)
        let c6pChildNames = stateVariables[c6p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c6pChildNames[0].slice(0, 3)).eq("/__");
        expect(c6pChildNames[1].slice(0, 3)).eq("/__");
        expect(c6pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c6pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c6pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c6pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // s1a's grandchildren should have gotten unique names (so begin with two underscores)
        let s1aChildName = stateVariables["/s1a"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);

        // c9s's grandchildren should have gotten unique names (so begin with two underscores)
        let c9sChildName = stateVariables[c9s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c9sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);

        // s1b's grandchildren should have retained their original names
        let s1bChildName = stateVariables["/s1b"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1bGrandChildNames = stateVariables[s1bChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1bGrandChildNames[0]).eq("/s1b/p1/_number1");
        expect(s1bGrandChildNames[1]).eq("/s1b/p1/_number2");
        expect(s1bGrandChildNames[2]).eq("/s1b/p1/_number3");
        expect(stateVariables[s1bGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1bGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1bGrandChildNames[2]].stateValues.value).eq(3);
      });
    });
  });

  it("copy with newNamespace retains original names, even with group, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>values: <group name="grp"><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section><p name="p1a" copySource="_p1" newNamespace /></section>
      
      <p copySource="p1a" name="p1b" />
      <p copySource="p1a" newNamespace name="p1c" />
      
      <section copySource="_section1" name="s1a" />
      <section copySource="_section1" newNamespace name="s1b" />
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/_number1")).should("have.text", "1");
    cy.get(cesc2("#/_number2")).should("have.text", "2");
    cy.get(cesc2("#/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1a/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1a/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1a/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1b/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1b/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1b/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1c/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1c/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1c/_number3")).should("have.text", "3");

    cy.get(cesc2("#/s1b/p1a/_number1")).should("have.text", "1");
    cy.get(cesc2("#/s1b/p1a/_number2")).should("have.text", "2");
    cy.get(cesc2("#/s1b/p1a/_number3")).should("have.text", "3");

    cy.get(cesc2("#/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1c")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/s1b/p1a")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1a"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null;
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p1a/_number2"].stateValues.value).eq(2);
      expect(stateVariables["/p1a/_number3"].stateValues.value).eq(3);

      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p1b/_number2"].stateValues.value).eq(2);
      expect(stateVariables["/p1b/_number3"].stateValues.value).eq(3);

      expect(stateVariables["/p1c/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p1c/_number2"].stateValues.value).eq(2);
      expect(stateVariables["/p1c/_number3"].stateValues.value).eq(3);

      // s1a's grandchildren should have gotten unique names (so begin with two underscores)
      let s1aChildName = stateVariables["/s1a"].activeChildren[0].componentName;
      let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
        .filter((x) => x.componentName)
        .map((x) => x.componentName);
      expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
      expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
      expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
      expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
      expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
      expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);
    });
  });

  it("copy with newNamespace and name retains original names, even with group that assigns names", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>values: <group name="grp" assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n3">3</number></p>
      
      <section><copy source="_p1" newNamespace name="p1" /></section>
      
      $p1
      <copy source="p1" name="p1a" />
      <copy source="p1" newNamespace />
      <copy source="p1" newNamespace name="p1b" />
      <copy source="p1a" newNamespace />
      
      $_section1
      <copy source="_section1" name="s1a" />
      <copy source="_section1" newNamespace />
      <copy source="_section1" newNamespace name="s1b" />
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/n1")).should("have.text", "1");
    cy.get(cesc2("#/n2")).should("have.text", "2");
    cy.get(cesc2("#/n3")).should("have.text", "3");

    cy.get(cesc2("#/p1/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1/n3")).should("have.text", "3");

    cy.get(cesc2("#/p1a/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1a/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1a/n3")).should("have.text", "3");

    cy.get(cesc2("#/p1b/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1b/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1b/n3")).should("have.text", "3");

    cy.get(cesc2("#/s1b/p1/n1")).should("have.text", "1");
    cy.get(cesc2("#/s1b/p1/n2")).should("have.text", "2");
    cy.get(cesc2("#/s1b/p1/n3")).should("have.text", "3");

    cy.get(cesc2("#/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/s1b/p1")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1a"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null;
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c2p = stateVariables["/_document1"].activeChildren[7].componentName;
      let c4p = stateVariables["/_document1"].activeChildren[11].componentName;
      let c6p = stateVariables["/_document1"].activeChildren[15].componentName;
      let c7s = stateVariables["/_document1"].activeChildren[17].componentName;
      let c9s = stateVariables["/_document1"].activeChildren[21].componentName;

      cy.get(cesc2("#" + c2p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c4p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c6p)).should("have.text", "values: 1 2 3");

      cy.get(cesc2("#" + c7s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
        });
      cy.get(cesc2("#" + c9s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 4\s*values: 1 2 3/)).not.be.null;
        });

      // put in window just so happens after above
      cy.window().then(async (win) => {
        expect(stateVariables["/p1/n1"].stateValues.value).eq(1);
        expect(stateVariables["/p1/n2"].stateValues.value).eq(2);
        expect(stateVariables["/p1/n3"].stateValues.value).eq(3);

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__");
        expect(c2pChildNames[1].slice(0, 3)).eq("/__");
        expect(c2pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have gotten unique names (so begin with two underscores)
        let c4pChildNames = stateVariables[c4p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c4pChildNames[0].slice(0, 3)).eq("/__");
        expect(c4pChildNames[1].slice(0, 3)).eq("/__");
        expect(c4pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c6p's children should have gotten unique names (so begin with two underscores)
        let c6pChildNames = stateVariables[c6p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c6pChildNames[0].slice(0, 3)).eq("/__");
        expect(c6pChildNames[1].slice(0, 3)).eq("/__");
        expect(c6pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c6pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c6pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c6pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // s1a's grandchildren should have gotten unique names (so begin with two underscores)
        let s1aChildName = stateVariables["/s1a"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);

        // c9s's grandchildren should have gotten unique names (so begin with two underscores)
        let c9sChildName = stateVariables[c9s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c9sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);

        // s1b's grandchildren should have retained their original names
        let s1bChildName = stateVariables["/s1b"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1bGrandChildNames = stateVariables[s1bChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1bGrandChildNames[0]).eq("/s1b/p1/n1");
        expect(s1bGrandChildNames[1]).eq("/s1b/p1/n2");
        expect(s1bGrandChildNames[2]).eq("/s1b/p1/n3");
        expect(stateVariables[s1bGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1bGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1bGrandChildNames[2]].stateValues.value).eq(3);
      });
    });
  });

  it("copy with newNamespace and name retains original names, even with group that assigns names, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>values: <group name="grp" assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n3">3</number></p>
      
      <section>$_p1{newNamespace name="p1"}</section>
      
      $p1
      $p1{name="p1a"}
      $p1{newNamespace}
      $p1{newNamespace name="p1b"}
      $p1a{newNamespace}
      
      $_section1
      $_section1{name="s1a"}
      $_section1{newNamespace}
      $_section1{newNamespace name="s1b"}
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/n1")).should("have.text", "1");
    cy.get(cesc2("#/n2")).should("have.text", "2");
    cy.get(cesc2("#/n3")).should("have.text", "3");

    cy.get(cesc2("#/p1/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1/n3")).should("have.text", "3");

    cy.get(cesc2("#/p1a/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1a/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1a/n3")).should("have.text", "3");

    cy.get(cesc2("#/p1b/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1b/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1b/n3")).should("have.text", "3");

    cy.get(cesc2("#/s1b/p1/n1")).should("have.text", "1");
    cy.get(cesc2("#/s1b/p1/n2")).should("have.text", "2");
    cy.get(cesc2("#/s1b/p1/n3")).should("have.text", "3");

    cy.get(cesc2("#/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/s1b/p1")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1a"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null;
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c2p = stateVariables["/_document1"].activeChildren[7].componentName;
      let c4p = stateVariables["/_document1"].activeChildren[11].componentName;
      let c6p = stateVariables["/_document1"].activeChildren[15].componentName;
      let c7s = stateVariables["/_document1"].activeChildren[17].componentName;
      let c9s = stateVariables["/_document1"].activeChildren[21].componentName;

      cy.get(cesc2("#" + c2p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c4p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c6p)).should("have.text", "values: 1 2 3");

      cy.get(cesc2("#" + c7s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
        });
      cy.get(cesc2("#" + c9s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 4\s*values: 1 2 3/)).not.be.null;
        });

      // put in window just so happens after above
      cy.window().then(async (win) => {
        expect(stateVariables["/p1/n1"].stateValues.value).eq(1);
        expect(stateVariables["/p1/n2"].stateValues.value).eq(2);
        expect(stateVariables["/p1/n3"].stateValues.value).eq(3);

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__");
        expect(c2pChildNames[1].slice(0, 3)).eq("/__");
        expect(c2pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have gotten unique names (so begin with two underscores)
        let c4pChildNames = stateVariables[c4p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c4pChildNames[0].slice(0, 3)).eq("/__");
        expect(c4pChildNames[1].slice(0, 3)).eq("/__");
        expect(c4pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c6p's children should have gotten unique names (so begin with two underscores)
        let c6pChildNames = stateVariables[c6p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c6pChildNames[0].slice(0, 3)).eq("/__");
        expect(c6pChildNames[1].slice(0, 3)).eq("/__");
        expect(c6pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c6pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c6pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c6pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // s1a's grandchildren should have gotten unique names (so begin with two underscores)
        let s1aChildName = stateVariables["/s1a"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);

        // c9s's grandchildren should have gotten unique names (so begin with two underscores)
        let c9sChildName = stateVariables[c9s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c9sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);

        // s1b's grandchildren should have retained their original names
        let s1bChildName = stateVariables["/s1b"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1bGrandChildNames = stateVariables[s1bChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1bGrandChildNames[0]).eq("/s1b/p1/n1");
        expect(s1bGrandChildNames[1]).eq("/s1b/p1/n2");
        expect(s1bGrandChildNames[2]).eq("/s1b/p1/n3");
        expect(stateVariables[s1bGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1bGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1bGrandChildNames[2]].stateValues.value).eq(3);
      });
    });
  });

  it("copy with newNamespace retains original names, even with group that assigns names, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>values: <group name="grp" assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n3">3</number></p>
      
      <section><p name="p1a" copySource="_p1" newNamespace /></section>
      
      <p copySource="p1a" name="p1b" />
      <p copySource="p1a" newNamespace name="p1c" />
      
      <section copySource="_section1" name="s1a" />
      <section copySource="_section1" newNamespace name="s1b" />
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/n1")).should("have.text", "1");
    cy.get(cesc2("#/n2")).should("have.text", "2");
    cy.get(cesc2("#/n3")).should("have.text", "3");

    cy.get(cesc2("#/p1a/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1a/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1a/n3")).should("have.text", "3");

    cy.get(cesc2("#/p1b/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1b/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1b/n3")).should("have.text", "3");

    cy.get(cesc2("#/p1c/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1c/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1c/n3")).should("have.text", "3");

    cy.get(cesc2("#/s1b/p1a/n1")).should("have.text", "1");
    cy.get(cesc2("#/s1b/p1a/n2")).should("have.text", "2");
    cy.get(cesc2("#/s1b/p1a/n3")).should("have.text", "3");

    cy.get(cesc2("#/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1c")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/s1b/p1a")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1a"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null;
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/p1a/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p1a/n2"].stateValues.value).eq(2);
      expect(stateVariables["/p1a/n3"].stateValues.value).eq(3);

      expect(stateVariables["/p1b/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p1b/n2"].stateValues.value).eq(2);
      expect(stateVariables["/p1b/n3"].stateValues.value).eq(3);

      expect(stateVariables["/p1c/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p1c/n2"].stateValues.value).eq(2);
      expect(stateVariables["/p1c/n3"].stateValues.value).eq(3);

      // s1a's grandchildren should have gotten unique names (so begin with two underscores)
      let s1aChildName = stateVariables["/s1a"].activeChildren[0].componentName;
      let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
        .filter((x) => x.componentName)
        .map((x) => x.componentName);
      expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
      expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
      expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
      expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
      expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
      expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);
    });
  });

  it("copy with newNamespace and name retains original names, even with group that assigns name to just one number, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>values: <group name="grp" assignNames="n1"><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section>$_p1{newNamespace name="p1"}</section>
      
      $p1
      $p1{name="p1a"}
      $p1{newNamespace}
      $p1{newNamespace name="p1b"}
      $p1a{newNamespace}
      
      $_section1
      $_section1{name="s1a"}
      $_section1{newNamespace}
      $_section1{newNamespace name="s1b"}
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/n1")).should("have.text", "1");
    cy.get(cesc2("#/_number2")).should("have.text", "2");
    cy.get(cesc2("#/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1a/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1a/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1a/_number3")).should("have.text", "3");

    cy.get(cesc2("#/p1b/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1b/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1b/_number3")).should("have.text", "3");

    cy.get(cesc2("#/s1b/p1/n1")).should("have.text", "1");
    cy.get(cesc2("#/s1b/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/s1b/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/s1b/p1")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1a"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null;
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c2p = stateVariables["/_document1"].activeChildren[7].componentName;
      let c4p = stateVariables["/_document1"].activeChildren[11].componentName;
      let c6p = stateVariables["/_document1"].activeChildren[15].componentName;
      let c7s = stateVariables["/_document1"].activeChildren[17].componentName;
      let c9s = stateVariables["/_document1"].activeChildren[21].componentName;

      cy.get(cesc2("#" + c2p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c4p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c6p)).should("have.text", "values: 1 2 3");

      cy.get(cesc2("#" + c7s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
        });
      cy.get(cesc2("#" + c9s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 4\s*values: 1 2 3/)).not.be.null;
        });

      // put in window just so happens after above
      cy.window().then(async (win) => {
        expect(stateVariables["/p1/n1"].stateValues.value).eq(1);
        expect(stateVariables["/p1/_number2"].stateValues.value).eq(2);
        expect(stateVariables["/p1/_number3"].stateValues.value).eq(3);

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__");
        expect(c2pChildNames[1].slice(0, 3)).eq("/__");
        expect(c2pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have gotten unique names (so begin with two underscores)
        let c4pChildNames = stateVariables[c4p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c4pChildNames[0].slice(0, 3)).eq("/__");
        expect(c4pChildNames[1].slice(0, 3)).eq("/__");
        expect(c4pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c6p's children should have gotten unique names (so begin with two underscores)
        let c6pChildNames = stateVariables[c6p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c6pChildNames[0].slice(0, 3)).eq("/__");
        expect(c6pChildNames[1].slice(0, 3)).eq("/__");
        expect(c6pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c6pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c6pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c6pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // s1a's grandchildren should have gotten unique names (so begin with two underscores)
        let s1aChildName = stateVariables["/s1a"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);

        // c9s's grandchildren should have gotten unique names (so begin with two underscores)
        let c9sChildName = stateVariables[c9s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c9sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);

        // s1b's grandchildren should have retained their original names
        let s1bChildName = stateVariables["/s1b"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1bGrandChildNames = stateVariables[s1bChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1bGrandChildNames[0]).eq("/s1b/p1/n1");
        expect(s1bGrandChildNames[1]).eq("/s1b/p1/_number2");
        expect(s1bGrandChildNames[2]).eq("/s1b/p1/_number3");
        expect(stateVariables[s1bGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1bGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1bGrandChildNames[2]].stateValues.value).eq(3);
      });
    });
  });

  it("copy with newNamespace and name retains original names, even with group that has new namespace, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>values: <group name="grp" newNamespace><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section>$_p1{newNamespace name="p1"}</section>
      
      $p1
      $p1{name="p1a"}
      $p1{newNamespace}
      $p1{newNamespace name="p1b"}
      $p1a{newNamespace}
      
      $_section1
      $_section1{name="s1a"}
      $_section1{newNamespace}
      $_section1{newNamespace name="s1b"}
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/grp/_number1")).should("have.text", "1");
    cy.get(cesc2("#/grp/_number2")).should("have.text", "2");
    cy.get(cesc2("#/_number1")).should("have.text", "3");

    cy.get(cesc2("#/p1/grp/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1/grp/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1/_number1")).should("have.text", "3");

    cy.get(cesc2("#/p1a/grp/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1a/grp/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1a/_number1")).should("have.text", "3");

    cy.get(cesc2("#/p1b/grp/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1b/grp/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1b/_number1")).should("have.text", "3");

    cy.get(cesc2("#/s1b/p1/grp/_number1")).should("have.text", "1");
    cy.get(cesc2("#/s1b/p1/grp/_number2")).should("have.text", "2");
    cy.get(cesc2("#/s1b/p1/_number1")).should("have.text", "3");

    cy.get(cesc2("#/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/s1b/p1")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1a"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null;
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c2p = stateVariables["/_document1"].activeChildren[7].componentName;
      let c4p = stateVariables["/_document1"].activeChildren[11].componentName;
      let c6p = stateVariables["/_document1"].activeChildren[15].componentName;
      let c7s = stateVariables["/_document1"].activeChildren[17].componentName;
      let c9s = stateVariables["/_document1"].activeChildren[21].componentName;

      cy.get(cesc2("#" + c2p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c4p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c6p)).should("have.text", "values: 1 2 3");

      cy.get(cesc2("#" + c7s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
        });
      cy.get(cesc2("#" + c9s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 4\s*values: 1 2 3/)).not.be.null;
        });

      // put in window just so happens after above
      cy.window().then(async (win) => {
        expect(stateVariables["/p1/grp/_number1"].stateValues.value).eq(1);
        expect(stateVariables["/p1/grp/_number2"].stateValues.value).eq(2);
        expect(stateVariables["/p1/_number1"].stateValues.value).eq(3);

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__");
        expect(c2pChildNames[1].slice(0, 3)).eq("/__");
        expect(c2pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have gotten unique names (so begin with two underscores)
        let c4pChildNames = stateVariables[c4p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c4pChildNames[0].slice(0, 3)).eq("/__");
        expect(c4pChildNames[1].slice(0, 3)).eq("/__");
        expect(c4pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c6p's children should have gotten unique names (so begin with two underscores)
        let c6pChildNames = stateVariables[c6p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c6pChildNames[0].slice(0, 3)).eq("/__");
        expect(c6pChildNames[1].slice(0, 3)).eq("/__");
        expect(c6pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c6pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c6pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c6pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // s1a's grandchildren should have gotten unique names (so begin with two underscores)
        let s1aChildName = stateVariables["/s1a"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);

        // c9s's grandchildren should have gotten unique names (so begin with two underscores)
        let c9sChildName = stateVariables[c9s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c9sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);

        // s1b's grandchildren should have retained their original names
        let s1bChildName = stateVariables["/s1b"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1bGrandChildNames = stateVariables[s1bChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1bGrandChildNames[0]).eq("/s1b/p1/grp/_number1");
        expect(s1bGrandChildNames[1]).eq("/s1b/p1/grp/_number2");
        expect(s1bGrandChildNames[2]).eq("/s1b/p1/_number1");
        expect(stateVariables[s1bGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1bGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1bGrandChildNames[2]].stateValues.value).eq(3);
      });
    });
  });

  it("copy with newNamespace retains original names, even with group that has new namespace, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>values: <group name="grp" newNamespace><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section><p name="p1a" copySource="_p1" newNamespace /></section>
      
      <p copySource="p1a" name="p1b" />
      <p copySource="p1a" newNamespace name="p1c" />
      
      <section copySource="_section1" name="s1a" />
      <section copySource="_section1" newNamespace name="s1b" />
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/grp/_number1")).should("have.text", "1");
    cy.get(cesc2("#/grp/_number2")).should("have.text", "2");
    cy.get(cesc2("#/_number1")).should("have.text", "3");

    cy.get(cesc2("#/p1a/grp/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1a/grp/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1a/_number1")).should("have.text", "3");

    cy.get(cesc2("#/p1b/grp/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1b/grp/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1b/_number1")).should("have.text", "3");

    cy.get(cesc2("#/p1c/grp/_number1")).should("have.text", "1");
    cy.get(cesc2("#/p1c/grp/_number2")).should("have.text", "2");
    cy.get(cesc2("#/p1c/_number1")).should("have.text", "3");

    cy.get(cesc2("#/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1c")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/s1b/p1a")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1a"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null;
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/p1a/grp/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p1a/grp/_number2"].stateValues.value).eq(2);
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(3);

      expect(stateVariables["/p1b/grp/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p1b/grp/_number2"].stateValues.value).eq(2);
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(3);

      expect(stateVariables["/p1c/grp/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p1c/grp/_number2"].stateValues.value).eq(2);
      expect(stateVariables["/p1c/_number1"].stateValues.value).eq(3);

      // s1a's grandchildren should have gotten unique names (so begin with two underscores)
      let s1aChildName = stateVariables["/s1a"].activeChildren[0].componentName;
      let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
        .filter((x) => x.componentName)
        .map((x) => x.componentName);
      expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
      expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
      expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
      expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
      expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
      expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);
    });
  });

  it("copy with newNamespace and name retains original names, even with group that has new namespace and assigns names, macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>values: <group name="grp" newNamespace assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n1">3</number></p>
      
      <section>$_p1{newNamespace name="p1"}</section>
      
      $p1
      $p1{name="p1a"}
      $p1{newNamespace}
      $p1{newNamespace name="p1b"}
      $p1a{newNamespace}
      
      $_section1
      $_section1{name="s1a"}
      $_section1{newNamespace}
      $_section1{newNamespace name="s1b"}
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/grp/n1")).should("have.text", "1");
    cy.get(cesc2("#/grp/n2")).should("have.text", "2");
    cy.get(cesc2("#/n1")).should("have.text", "3");

    cy.get(cesc2("#/p1/grp/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1/grp/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1/n1")).should("have.text", "3");

    cy.get(cesc2("#/p1a/grp/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1a/grp/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1a/n1")).should("have.text", "3");

    cy.get(cesc2("#/p1b/grp/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1b/grp/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1b/n1")).should("have.text", "3");

    cy.get(cesc2("#/s1b/p1/grp/n1")).should("have.text", "1");
    cy.get(cesc2("#/s1b/p1/grp/n2")).should("have.text", "2");
    cy.get(cesc2("#/s1b/p1/n1")).should("have.text", "3");

    cy.get(cesc2("#/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/s1b/p1")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1a"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null;
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c2p = stateVariables["/_document1"].activeChildren[7].componentName;
      let c4p = stateVariables["/_document1"].activeChildren[11].componentName;
      let c6p = stateVariables["/_document1"].activeChildren[15].componentName;
      let c7s = stateVariables["/_document1"].activeChildren[17].componentName;
      let c9s = stateVariables["/_document1"].activeChildren[21].componentName;

      cy.get(cesc2("#" + c2p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c4p)).should("have.text", "values: 1 2 3");
      cy.get(cesc2("#" + c6p)).should("have.text", "values: 1 2 3");

      cy.get(cesc2("#" + c7s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
        });
      cy.get(cesc2("#" + c9s))
        .invoke("text")
        .then((text) => {
          expect(text.match(/Section 4\s*values: 1 2 3/)).not.be.null;
        });

      // put in window just so happens after above
      cy.window().then(async (win) => {
        expect(stateVariables["/p1/grp/n1"].stateValues.value).eq(1);
        expect(stateVariables["/p1/grp/n2"].stateValues.value).eq(2);
        expect(stateVariables["/p1/n1"].stateValues.value).eq(3);

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__");
        expect(c2pChildNames[1].slice(0, 3)).eq("/__");
        expect(c2pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have gotten unique names (so begin with two underscores)
        let c4pChildNames = stateVariables[c4p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c4pChildNames[0].slice(0, 3)).eq("/__");
        expect(c4pChildNames[1].slice(0, 3)).eq("/__");
        expect(c4pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c6p's children should have gotten unique names (so begin with two underscores)
        let c6pChildNames = stateVariables[c6p].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);
        expect(c6pChildNames[0].slice(0, 3)).eq("/__");
        expect(c6pChildNames[1].slice(0, 3)).eq("/__");
        expect(c6pChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c6pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c6pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c6pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // s1a's grandchildren should have gotten unique names (so begin with two underscores)
        let s1aChildName = stateVariables["/s1a"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);

        // c9s's grandchildren should have gotten unique names (so begin with two underscores)
        let c9sChildName = stateVariables[c9s].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(c9sGrandChildNames[0].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[1].slice(0, 3)).eq("/__");
        expect(c9sGrandChildNames[2].slice(0, 3)).eq("/__");
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);

        // s1b's grandchildren should have retained their original names
        let s1bChildName = stateVariables["/s1b"].activeChildren.filter(
          (x) => x.componentName,
        )[0].componentName;
        let s1bGrandChildNames = stateVariables[s1bChildName].activeChildren
          .filter((x) => x.componentName)
          .map((x) => x.componentName);

        expect(s1bGrandChildNames[0]).eq("/s1b/p1/grp/n1");
        expect(s1bGrandChildNames[1]).eq("/s1b/p1/grp/n2");
        expect(s1bGrandChildNames[2]).eq("/s1b/p1/n1");
        expect(stateVariables[s1bGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[s1bGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[s1bGrandChildNames[2]].stateValues.value).eq(3);
      });
    });
  });

  it("copy with newNamespace retains original names, even with group that has new namespace and assigns names, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>values: <group name="grp" newNamespace assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n1">3</number></p>
      
      <section><p name="p1a" copySource="_p1" newNamespace /></section>
      
      <p copySource="p1a" name="p1b" />
      <p copySource="p1a" newNamespace name="p1c" />
      
      <section copySource="_section1" name="s1a" />
      <section copySource="_section1" newNamespace name="s1b" />
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/grp/n1")).should("have.text", "1");
    cy.get(cesc2("#/grp/n2")).should("have.text", "2");
    cy.get(cesc2("#/n1")).should("have.text", "3");

    cy.get(cesc2("#/p1a/grp/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1a/grp/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1a/n1")).should("have.text", "3");

    cy.get(cesc2("#/p1b/grp/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1b/grp/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1b/n1")).should("have.text", "3");

    cy.get(cesc2("#/p1c/grp/n1")).should("have.text", "1");
    cy.get(cesc2("#/p1c/grp/n2")).should("have.text", "2");
    cy.get(cesc2("#/p1c/n1")).should("have.text", "3");

    cy.get(cesc2("#/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/p1c")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/s1b/p1a")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1a"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
      });
    cy.get(cesc2("#/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null;
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/p1a/grp/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p1a/grp/n2"].stateValues.value).eq(2);
      expect(stateVariables["/p1a/n1"].stateValues.value).eq(3);

      expect(stateVariables["/p1b/grp/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p1b/grp/n2"].stateValues.value).eq(2);
      expect(stateVariables["/p1b/n1"].stateValues.value).eq(3);

      expect(stateVariables["/p1c/grp/n1"].stateValues.value).eq(1);
      expect(stateVariables["/p1c/grp/n2"].stateValues.value).eq(2);
      expect(stateVariables["/p1c/n1"].stateValues.value).eq(3);

      // s1a's grandchildren should have gotten unique names (so begin with two underscores)
      let s1aChildName = stateVariables["/s1a"].activeChildren[0].componentName;
      let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren
        .filter((x) => x.componentName)
        .map((x) => x.componentName);
      expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__");
      expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__");
      expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__");
      expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
      expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
      expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);
    });
  });

  it("copy with newNamespace and name retains original names, even with group, wrapped in nested groups and copied with variable componentIndex", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <mathinput name="n" prefill="1" />
  <group name="grp">
    <group newNamespace name="g1">
      <p>values: <group name="grp"><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section>$_p1{newNamespace name="p1"}</section>
      
      $p1{name="p1a"}
      $p1{newNamespace name="p1b"}
      
      $_section1{newNamespace name="s1b"}
    </group>
    <group newNamespace name="g2">
      <p>values: <group name="grp" assignNames="n1 n2"><number>4</number> <number>5</number></group> <number name="n3">6</number></p>

      <section>$_p1{newNamespace name="p1"}</section>
      
      $p1{name="p1a"}
      $p1{newNamespace name="p1b"}
      
      $_section1{newNamespace name="s1b"}
    </group>
  </group>

  $grp[$n]{name="thegrp"}


    `,
        },
        "*",
      );
    });

    cy.log("check g1");
    cy.get(cesc2("#/g1/_number1")).should("have.text", "1");
    cy.get(cesc2("#/g1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/g1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/g1/p1/_number1")).should("have.text", "1");
    cy.get(cesc2("#/g1/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/g1/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/g1/p1a/_number1")).should("have.text", "1");
    cy.get(cesc2("#/g1/p1a/_number2")).should("have.text", "2");
    cy.get(cesc2("#/g1/p1a/_number3")).should("have.text", "3");

    cy.get(cesc2("#/g1/p1b/_number1")).should("have.text", "1");
    cy.get(cesc2("#/g1/p1b/_number2")).should("have.text", "2");
    cy.get(cesc2("#/g1/p1b/_number3")).should("have.text", "3");

    cy.get(cesc2("#/g1/s1b/p1/_number1")).should("have.text", "1");
    cy.get(cesc2("#/g1/s1b/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/g1/s1b/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/g1/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/g1/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/g1/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/g1/s1b/p1")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/g1/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null;
      });

    cy.get(cesc2("#/g1/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null;
      });

    cy.log("check g2");

    cy.get(cesc2("#/g2/n1")).should("have.text", "4");
    cy.get(cesc2("#/g2/n2")).should("have.text", "5");
    cy.get(cesc2("#/g2/n3")).should("have.text", "6");

    cy.get(cesc2("#/g2/p1/n1")).should("have.text", "4");
    cy.get(cesc2("#/g2/p1/n2")).should("have.text", "5");
    cy.get(cesc2("#/g2/p1/n3")).should("have.text", "6");

    cy.get(cesc2("#/g2/p1a/n1")).should("have.text", "4");
    cy.get(cesc2("#/g2/p1a/n2")).should("have.text", "5");
    cy.get(cesc2("#/g2/p1a/n3")).should("have.text", "6");

    cy.get(cesc2("#/g2/p1b/n1")).should("have.text", "4");
    cy.get(cesc2("#/g2/p1b/n2")).should("have.text", "5");
    cy.get(cesc2("#/g2/p1b/n3")).should("have.text", "6");

    cy.get(cesc2("#/g2/s1b/p1/n1")).should("have.text", "4");
    cy.get(cesc2("#/g2/s1b/p1/n2")).should("have.text", "5");
    cy.get(cesc2("#/g2/s1b/p1/n3")).should("have.text", "6");

    cy.get(cesc2("#/g2/_p1")).should("have.text", "values: 4 5 6");
    cy.get(cesc2("#/g2/p1a")).should("have.text", "values: 4 5 6");
    cy.get(cesc2("#/g2/p1b")).should("have.text", "values: 4 5 6");
    cy.get(cesc2("#/g2/s1b/p1")).should("have.text", "values: 4 5 6");

    cy.get(cesc2("#/g2/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 3\s*values: 4 5 6/)).not.be.null;
      });

    cy.get(cesc2("#/g2/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 4\s*values: 4 5 6/)).not.be.null;
      });

    cy.log("check thegrp");

    cy.get(cesc2("#/thegrp/_number1")).should("have.text", "1");
    cy.get(cesc2("#/thegrp/_number2")).should("have.text", "2");
    cy.get(cesc2("#/thegrp/_number3")).should("have.text", "3");

    cy.get(cesc2("#/thegrp/p1/_number1")).should("have.text", "1");
    cy.get(cesc2("#/thegrp/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/thegrp/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/thegrp/p1a/_number1")).should("have.text", "1");
    cy.get(cesc2("#/thegrp/p1a/_number2")).should("have.text", "2");
    cy.get(cesc2("#/thegrp/p1a/_number3")).should("have.text", "3");

    cy.get(cesc2("#/thegrp/p1b/_number1")).should("have.text", "1");
    cy.get(cesc2("#/thegrp/p1b/_number2")).should("have.text", "2");
    cy.get(cesc2("#/thegrp/p1b/_number3")).should("have.text", "3");

    cy.get(cesc2("#/thegrp/s1b/p1/_number1")).should("have.text", "1");
    cy.get(cesc2("#/thegrp/s1b/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/thegrp/s1b/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/thegrp/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/thegrp/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/thegrp/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/thegrp/s1b/p1")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/thegrp/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null;
      });

    cy.get(cesc2("#/thegrp/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 6\s*values: 1 2 3/)).not.be.null;
      });

    cy.log("Change index for thegrp");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc2("#/thegrp/n1")).should("have.text", "4");
    cy.get(cesc2("#/thegrp/n2")).should("have.text", "5");
    cy.get(cesc2("#/thegrp/n3")).should("have.text", "6");

    cy.get(cesc2("#/thegrp/p1/n1")).should("have.text", "4");
    cy.get(cesc2("#/thegrp/p1/n2")).should("have.text", "5");
    cy.get(cesc2("#/thegrp/p1/n3")).should("have.text", "6");

    cy.get(cesc2("#/thegrp/p1a/n1")).should("have.text", "4");
    cy.get(cesc2("#/thegrp/p1a/n2")).should("have.text", "5");
    cy.get(cesc2("#/thegrp/p1a/n3")).should("have.text", "6");

    cy.get(cesc2("#/thegrp/p1b/n1")).should("have.text", "4");
    cy.get(cesc2("#/thegrp/p1b/n2")).should("have.text", "5");
    cy.get(cesc2("#/thegrp/p1b/n3")).should("have.text", "6");

    cy.get(cesc2("#/thegrp/s1b/p1/n1")).should("have.text", "4");
    cy.get(cesc2("#/thegrp/s1b/p1/n2")).should("have.text", "5");
    cy.get(cesc2("#/thegrp/s1b/p1/n3")).should("have.text", "6");

    cy.get(cesc2("#/thegrp/_p1")).should("have.text", "values: 4 5 6");
    cy.get(cesc2("#/thegrp/p1a")).should("have.text", "values: 4 5 6");
    cy.get(cesc2("#/thegrp/p1b")).should("have.text", "values: 4 5 6");
    cy.get(cesc2("#/thegrp/s1b/p1")).should("have.text", "values: 4 5 6");

    cy.get(cesc2("#/thegrp/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 5\s*values: 4 5 6/)).not.be.null;
      });

    cy.get(cesc2("#/thegrp/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 6\s*values: 4 5 6/)).not.be.null;
      });

    cy.log("Change to invalid index for thegrp");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc2("#/thegrp")).should("not.exist");

    cy.log("Change back to index 1 for thegrp");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc2("#/thegrp/_number1")).should("have.text", "1");
    cy.get(cesc2("#/thegrp/_number2")).should("have.text", "2");
    cy.get(cesc2("#/thegrp/_number3")).should("have.text", "3");

    cy.get(cesc2("#/thegrp/p1/_number1")).should("have.text", "1");
    cy.get(cesc2("#/thegrp/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/thegrp/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/thegrp/p1a/_number1")).should("have.text", "1");
    cy.get(cesc2("#/thegrp/p1a/_number2")).should("have.text", "2");
    cy.get(cesc2("#/thegrp/p1a/_number3")).should("have.text", "3");

    cy.get(cesc2("#/thegrp/p1b/_number1")).should("have.text", "1");
    cy.get(cesc2("#/thegrp/p1b/_number2")).should("have.text", "2");
    cy.get(cesc2("#/thegrp/p1b/_number3")).should("have.text", "3");

    cy.get(cesc2("#/thegrp/s1b/p1/_number1")).should("have.text", "1");
    cy.get(cesc2("#/thegrp/s1b/p1/_number2")).should("have.text", "2");
    cy.get(cesc2("#/thegrp/s1b/p1/_number3")).should("have.text", "3");

    cy.get(cesc2("#/thegrp/_p1")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/thegrp/p1a")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/thegrp/p1b")).should("have.text", "values: 1 2 3");
    cy.get(cesc2("#/thegrp/s1b/p1")).should("have.text", "values: 1 2 3");

    cy.get(cesc2("#/thegrp/_section1"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null;
      });

    cy.get(cesc2("#/thegrp/s1b"))
      .invoke("text")
      .then((text) => {
        expect(text.match(/Section 6\s*values: 1 2 3/)).not.be.null;
      });
  });

  it("copy group of groups retains name", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <group name="grp" newNamespace><number name="num1">1</number> <number name="num2">2</number> <group><number name="num3">3</number><number name="num4">4</number><group><number name="num5">5</number><number name="num6">6</number></group></group></group>

      $grp{name="grp2"}
      
      <group copySource="grp2" name="grp3" />

      <group copySource="grp2/_group1" name="grp4" newNamespace />
      <group copySource="grp3/_group1" name="grp5" newNamespace />

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");

    cy.get(cesc2("#/grp/num1")).should("have.text", "1");
    cy.get(cesc2("#/grp/num2")).should("have.text", "2");
    cy.get(cesc2("#/grp/num3")).should("have.text", "3");
    cy.get(cesc2("#/grp/num4")).should("have.text", "4");
    cy.get(cesc2("#/grp/num5")).should("have.text", "5");
    cy.get(cesc2("#/grp/num6")).should("have.text", "6");

    cy.get(cesc2("#/grp2/num1")).should("have.text", "1");
    cy.get(cesc2("#/grp2/num2")).should("have.text", "2");
    cy.get(cesc2("#/grp2/num3")).should("have.text", "3");
    cy.get(cesc2("#/grp2/num4")).should("have.text", "4");
    cy.get(cesc2("#/grp2/num5")).should("have.text", "5");
    cy.get(cesc2("#/grp2/num6")).should("have.text", "6");

    cy.get(cesc2("#/grp3/num1")).should("have.text", "1");
    cy.get(cesc2("#/grp3/num2")).should("have.text", "2");
    cy.get(cesc2("#/grp3/num3")).should("have.text", "3");
    cy.get(cesc2("#/grp3/num4")).should("have.text", "4");
    cy.get(cesc2("#/grp3/num5")).should("have.text", "5");
    cy.get(cesc2("#/grp3/num6")).should("have.text", "6");

    cy.get(cesc2("#/grp4/num3")).should("have.text", "3");
    cy.get(cesc2("#/grp4/num4")).should("have.text", "4");
    cy.get(cesc2("#/grp4/num5")).should("have.text", "5");
    cy.get(cesc2("#/grp4/num6")).should("have.text", "6");

    cy.get(cesc2("#/grp5/num3")).should("have.text", "3");
    cy.get(cesc2("#/grp5/num4")).should("have.text", "4");
    cy.get(cesc2("#/grp5/num5")).should("have.text", "5");
    cy.get(cesc2("#/grp5/num6")).should("have.text", "6");
  });

  it("copy group, does not avoid name collision when assign subnames", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <group name="grp" newNamespace><number name="num1">1</number> <number name="num2">2</number></group>

      <p>$grp{assignNames="num2"}</p>
      

    `,
        },
        "*",
      );
    });

    cy.document().should("contain.text", "Duplicate component name: num2");
  });

  it("copy p with newNamespace, does not avoid name collision when assignnames", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <p name="p"><text name="hello">Hello</text></p>
      $p{newNamespace name="hello"}

    `,
        },
        "*",
      );
    });

    cy.document().should("contain.text", "Duplicate component name: hello");
  });

  it("copy point with math attribute, duplicate component name message uses point name", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <point name="P" y="1" />
      $P{name="P" y="2" }
    `,
        },
        "*",
      );
    });

    cy.document().should("contain.text", "Duplicate component name: P");
  });

  it("copy componentIndex", () => {
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
    
    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      <copy source="col" name="A2" componentIndex="$n" />
    </graph>
  
    <copy source="g2" name="g3" newNamespace />

    <aslist name="al"><copy prop="x" source="col" componentIndex="$n" assignNames="Ax" /></aslist>

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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/A2"]).eq(undefined);
      expect(stateVariables["/g3/A2"]).eq(undefined);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/Ax"]).eq(undefined);
      expect(stateVariables["/al2/Ax"]).eq(undefined);
    });

    cy.log("restrict collection to first component");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });

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
      expect(stateVariables["/Ax"].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
    });

    cy.log("move copied point");
    cy.window().then(async (win) => {
      (x1 = 9), (y1 = -5);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: x1, y: y1 },
      });

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
        expect(stateVariables["/Ax"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      });
    });

    cy.log("collect second component");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
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
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
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
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
      });
    });
  });

  it("copy componentIndex, array notation", () => {
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
    
    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      <copy source="col[$n]" name="A2" />
    </graph>
  
    <copy source="g2" name="g3" newNamespace />

    <aslist name="al"><copy source="col[$n].x" assignNames="Ax" /></aslist>

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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/A2"]).eq(undefined);
      expect(stateVariables["/g3/A2"]).eq(undefined);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/Ax"]).eq(undefined);
      expect(stateVariables["/al2/Ax"]).eq(undefined);
    });

    cy.log("restrict collection to first component");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });

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
      expect(stateVariables["/Ax"].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
    });

    cy.log("move copied point");
    cy.window().then(async (win) => {
      (x1 = 9), (y1 = -5);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: x1, y: y1 },
      });

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
        expect(stateVariables["/Ax"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      });
    });

    cy.log("restrict collection to second component");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
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
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
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
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
      });
    });
  });

  it("copy componentIndex, array notation, macros", () => {
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
    
    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      $(col[$n]{name="A2"})
    </graph>
  
    $g2{name="g3" newNamespace}

    <aslist name="al">$(col[$n].x{assignNames="Ax"})</aslist>

    $al{name="al2" newNamespace}

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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/A2"]).eq(undefined);
      expect(stateVariables["/g3/A2"]).eq(undefined);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/Ax"]).eq(undefined);
      expect(stateVariables["/al2/Ax"]).eq(undefined);
    });

    cy.log("restrict collection to first component");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });

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
      expect(stateVariables["/Ax"].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
    });

    cy.log("move copied point");
    cy.window().then(async (win) => {
      (x1 = 9), (y1 = -5);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: x1, y: y1 },
      });

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
        expect(stateVariables["/Ax"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      });
    });

    cy.log("restrict collection to second component");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
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
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
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
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
      });
    });
  });

  it("copy componentIndex, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>n: <mathinput name="n" prefill="1" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      <point copySource="col" name="A2" componentIndex="$n" />
    </graph>
  
    <graph copySource="g2" name="g3" newNamespace />
  
    <aslist name="al"><math copyprop="x" copySource="col" componentIndex="$n" name="Ax" /></aslist>
  
    <aslist copySource="al" name="al2" newNamespace />

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
      expect(stateVariables["/Ax"].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
    });

    cy.log("move copied point");
    cy.window().then(async (win) => {
      (x1 = 9), (y1 = -5);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: x1, y: y1 },
      });

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
        expect(stateVariables["/Ax"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      });
    });

    cy.log("restrict collection to second component");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
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
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
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
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
      });
    });
  });

  it("copy componentIndex, with copySource, array notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>n: <mathinput name="n" prefill="1" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      <point copySource="col[$n]" name="A2" />
    </graph>
  
    <graph copySource="g2" name="g3" newNamespace />
  
    <aslist name="al"><math copySource="col[$n].x" name="Ax" /></aslist>
  
    <aslist copySource="al" name="al2" newNamespace />

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
      expect(stateVariables["/Ax"].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
    });

    cy.log("move copied point");
    cy.window().then(async (win) => {
      (x1 = 9), (y1 = -5);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: x1, y: y1 },
      });

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
        expect(stateVariables["/Ax"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      });
    });

    cy.log("restrict collection to second component");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
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
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
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
        expect(stateVariables["/Ax"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
      });
    });
  });

  it("copy propIndex and componentIndex", () => {
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

    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al"><copy prop="xs" source="col" componentIndex="$m" propIndex="$n" assignNames="n1" /></aslist></p>

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
    cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/n1"]).eq(undefined);
      expect(stateVariables["/al2/n1"]).eq(undefined);
    });

    cy.log("set propIndex to 1");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/n1"]).eq(undefined);
      expect(stateVariables["/al2/n1"]).eq(undefined);
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
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
      });
    });

    cy.log("set componentIndex to 2");

    cy.get(cesc("#\\/m") + " textarea").type("2{enter}", { force: true });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
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
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
      });
    });

    cy.log("set propIndex to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y2);
      });
    });

    cy.log("set componentIndex to 1");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y1));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y1),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y1);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y1);
      });
    });

    cy.log("set propIndex to 3");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
      });
    });

    cy.log("set propIndex to 1");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x1));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x1),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x1);
      });
    });

    cy.log("set componentIndex to 3");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
      });
    });

    cy.log("set componentIndex to 2");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
      });
    });

    cy.log("clear propIndex");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/n1"]).eq(undefined);
      expect(stateVariables["/al2/n1"]).eq(undefined);
    });
  });

  it("copy propIndex and componentIndex, array notation", () => {
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

    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al"><copy source="col[$m].xs[$n]" assignNames="n1" /></aslist></p>

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
    cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/n1"]).eq(undefined);
      expect(stateVariables["/al2/n1"]).eq(undefined);
    });

    cy.log("set propIndex to 1");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/n1"]).eq(undefined);
      expect(stateVariables["/al2/n1"]).eq(undefined);
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
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
      });
    });

    cy.log("set componentIndex to 2");

    cy.get(cesc("#\\/m") + " textarea").type("2{enter}", { force: true });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
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
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
      });
    });

    cy.log("set propIndex to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y2);
      });
    });

    cy.log("set componentIndex to 1");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y1));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y1),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y1);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y1);
      });
    });

    cy.log("set propIndex to 3");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
      });
    });

    cy.log("set propIndex to 1");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x1));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x1),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x1);
      });
    });

    cy.log("set componentIndex to 3");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
      });
    });

    cy.log("set componentIndex to 2");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
      });
    });

    cy.log("clear propIndex");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/n1"]).eq(undefined);
      expect(stateVariables["/al2/n1"]).eq(undefined);
    });
  });

  it("copy propIndex and componentIndex, array notation, macros", () => {
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

    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al">$(col[$m].xs[$n]{assignNames="n1"})</aslist></p>

    <p>$al{name="al2" newNamespace}</p>

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
    cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/n1"]).eq(undefined);
      expect(stateVariables["/al2/n1"]).eq(undefined);
    });

    cy.log("set propIndex to 1");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/n1"]).eq(undefined);
      expect(stateVariables["/al2/n1"]).eq(undefined);
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
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
      });
    });

    cy.log("set componentIndex to 2");

    cy.get(cesc("#\\/m") + " textarea").type("2{enter}", { force: true });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
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
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
      });
    });

    cy.log("set propIndex to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y2);
      });
    });

    cy.log("set componentIndex to 1");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y1));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y1),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y1);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y1);
      });
    });

    cy.log("set propIndex to 3");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
      });
    });

    cy.log("set propIndex to 1");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x1));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x1),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x1);
      });
    });

    cy.log("set componentIndex to 3");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"]).eq(undefined);
        expect(stateVariables["/al2/n1"]).eq(undefined);
      });
    });

    cy.log("set componentIndex to 2");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
      });
    });

    cy.log("clear propIndex");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/n1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/n1"]).eq(undefined);
      expect(stateVariables["/al2/n1"]).eq(undefined);
    });
  });

  it("copy propIndex and componentIndex, with copySource", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>m: <mathinput name="m" prefill="2" /></p>
    <p>n: <mathinput name="n" prefill="1" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>

    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al"><math copyprop="xs" copySource="col" componentIndex="$m" propIndex="$n" name="n1" /></aslist></p>

    <p><aslist copySource="al" name="al2" newNamespace /></p>

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

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
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
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
      });
    });

    cy.log("set propIndex to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y2);
      });
    });

    cy.log("set componentIndex to 1");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y1));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y1),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y1);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y1);
      });
    });

    cy.log("set propIndex to 3");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", "\uff3f");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        "\uff3f",
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq("\uff3f");
        expect(stateVariables["/al2/n1"].stateValues.value).eq("\uff3f");
      });
    });

    cy.log("set propIndex to 1");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x1));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x1),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x1);
      });
    });

    cy.log("set componentIndex to 3");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", "\uff3f");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        "\uff3f",
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq("\uff3f");
        expect(stateVariables["/al2/n1"].stateValues.value).eq("\uff3f");
      });
    });

    cy.log("set componentIndex to 2");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
      });
    });

    cy.log("clear propIndex");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", "\uff3f");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        "\uff3f",
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq("\uff3f");
        expect(stateVariables["/al2/n1"].stateValues.value).eq("\uff3f");
      });
    });
  });

  it("copy propIndex and componentIndex, with copySource, array notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>m: <mathinput name="m" prefill="2" /></p>
    <p>n: <mathinput name="n" prefill="1" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>

    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al"><math copySource="col[$m].xs[$n]" name="n1" /></aslist></p>

    <p><aslist copySource="al" name="al2" newNamespace /></p>

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

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
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
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
      });
    });

    cy.log("set propIndex to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y2),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y2);
      });
    });

    cy.log("set componentIndex to 1");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(y1));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(y1),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(y1);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(y1);
      });
    });

    cy.log("set propIndex to 3");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", "\uff3f");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        "\uff3f",
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq("\uff3f");
        expect(stateVariables["/al2/n1"].stateValues.value).eq("\uff3f");
      });
    });

    cy.log("set propIndex to 1");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x1));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x1),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x1);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x1);
      });
    });

    cy.log("set componentIndex to 3");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", "\uff3f");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        "\uff3f",
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq("\uff3f");
        expect(stateVariables["/al2/n1"].stateValues.value).eq("\uff3f");
      });
    });

    cy.log("set componentIndex to 2");
    cy.get(cesc("#\\/m") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", nInDOM(x2));
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        nInDOM(x2),
      );
      cy.get(cesc("#\\/al2\\/n2") + " .mjx-mrow").should("not.exist");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq(x2);
        expect(stateVariables["/al2/n1"].stateValues.value).eq(x2);
      });
    });

    cy.log("clear propIndex");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/n1") + " .mjx-mrow").should("contain.text", "\uff3f");
      cy.get(cesc("#\\/al2\\/n1") + " .mjx-mrow").should(
        "contain.text",
        "\uff3f",
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/A"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/B"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/n1"].stateValues.value).eq("\uff3f");
        expect(stateVariables["/al2/n1"].stateValues.value).eq("\uff3f");
      });
    });
  });
});
